import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateConfig } from "../src/config.mjs";
import { assertSafeOutput, dispatch, validateHandlerResult } from "../src/dispatcher.mjs";
import { readMetadataState } from "../src/state.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const fixture = JSON.parse(await readFile(new URL("../fixtures/pre-tool-safe.json", import.meta.url), "utf8"));
const before = "printf MODS_BEFORE";
const after = "printf MODS_AFTER";
const event = (command = before) => ({ ...fixture, tool_name: "Bash", tool_input: { command } });
const rewrite = (toCommand = after, enabled = true) => ({
  id: "exact-command", type: "exactCommandRewrite", enabled,
  rules: [{ toolName: "Bash", fromCommand: before, toCommand }],
});
const config = (mods = [rewrite()], extra = {}) => validateConfig({ version: 1, mods, ...extra });
const invoke = (input, configuration, environment = {}) => new Promise((resolve, reject) => {
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (key.startsWith("CODEX_MODS_") || key === "PLUGIN_DATA") delete env[key];
  Object.assign(env, { PLUGIN_ROOT: root, CODEX_MODS_CONFIG: configuration }, environment);
  const child = spawn(process.execPath, [join(root, "src/hook-main.mjs")], { env });
  const watchdog = setTimeout(() => { child.kill("SIGKILL"); reject(new Error("bounded hook test timed out")); }, 5000);
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
  child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
  child.on("error", (error) => { clearTimeout(watchdog); reject(error); });
  child.on("close", (code) => { clearTimeout(watchdog); resolve({ code, output: stdout ? JSON.parse(stdout) : null, stderr }); });
  child.stdin.end(JSON.stringify(input));
});
const temporary = async (t) => {
  const directory = await mkdtemp(join(await realpath(tmpdir()), "claude-mods-contract-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
};

test("v2 results are a strict discriminated contract and keep the v1 result adapter", () => {
  assert.deepEqual(validateHandlerResult({ kind: "abstain" }, "SessionStart"), {});
  assert.deepEqual(validateHandlerResult({ kind: "notice", message: "visible" }, "SessionStart"), { message: "visible" });
  assert.deepEqual(validateHandlerResult({ kind: "deny", reason: "review" }, "PreToolUse"), { denyReason: "review" });
  assert.deepEqual(validateHandlerResult({ kind: "replaceCommand", command: after }, "PreToolUse"), { commandReplacement: after });
  assert.deepEqual(validateHandlerResult({ message: "old handler", journal: true }, "SessionStart"), { message: "old handler", journal: true });
  for (const value of [
    { kind: "approve" }, { kind: "allow", updatedInput: {} }, { kind: "ask" },
    { kind: "abstain", reason: "extra" }, { kind: "deny", reason: "x", command: after },
    { kind: "replaceCommand", command: after, sandbox_permissions: "require_escalated" },
    { kind: "replaceCommand", command: "x".repeat(201) }, { kind: "replaceCommand", command: "bad\ninput" },
    { kind: "replaceCommand", command: " " }, { kind: "replaceCommand", command: "printf \u202ehidden" }, { commandReplacement: after },
  ]) assert.throws(() => validateHandlerResult(value, "PreToolUse"));
  assert.throws(() => validateHandlerResult({ kind: "replaceCommand", command: after }, "PostToolUse"), /PreToolUse/);
  assert.throws(() => validateHandlerResult(Object.defineProperty({}, "kind", { get() { assert.fail("must not invoke accessor"); } }), "PreToolUse"), /data fields/);
});

test("exact replacement is opt-in, literal, canonical-tool only and does not execute", () => {
  assert.deepEqual(dispatch(event(), config([rewrite(after, false)])).output, {});
  for (const command of [before + "\n", " " + before, before + "; pwd", "echo MODS_BEFORE"]) {
    assert.deepEqual(dispatch(event(command), config()).output, {});
  }
  for (const tool_name of ["exec_command", "Agent", "mcp__test__tool"]) {
    assert.deepEqual(dispatch({ ...event(), tool_name }, config()).output, {});
  }
  assert.deepEqual(dispatch({ ...event(), hook_event_name: "PostToolUse", tool_response: {} }, config()).output, {});
  const output = dispatch(event(), config()).output;
  assert.equal(output.hookSpecificOutput.permissionDecision, "allow");
  assert.equal(output.hookSpecificOutput.updatedInput.command, after);
  assert.ok(output.systemMessage.includes(before));
  assert.ok(output.systemMessage.includes(after));
  assert.match(output.systemMessage, /Normal permissions still apply/);
});

test("replacement preserves all permission/context fields and receives immutable input", () => {
  const input = event();
  input.tool_input = {
    command: before, cwd: "selected-project", sandbox_permissions: "require_escalated",
    justification: "reviewed request", prefix_rule: ["printf"], timeout_ms: 1500,
    nested: { model: "keep-selection", permissions: { network: false } },
  };
  const original = structuredClone(input);
  const { output } = dispatch(input, config());
  assert.deepEqual(output.hookSpecificOutput.updatedInput, { ...original.tool_input, command: after });
  assert.deepEqual(input, original);
  const malicious = { mods: [{ enabled: true, type: "mistake", options: {} }] };
  const result = dispatch(input, malicious, () => ({ handle(received) {
    received.tool_input.sandbox_permissions = "use_default";
    return { kind: "replaceCommand", command: after };
  } }));
  assert.equal(result.output.hookSpecificOutput.permissionDecision, "deny");
  assert.deepEqual(input, original);
});

test("denial wins independent of order, conflicting proposals deny, identical proposals agree", () => {
  const guard = { id: "guard", type: "denyGuard", enabled: true, rules: [{ commandContains: ["MODS_BEFORE"], reason: "first denial" }] };
  for (const mods of [[guard, rewrite()], [rewrite(), guard]]) {
    const { output } = dispatch(event(), config(mods));
    assert.equal(output.hookSpecificOutput.permissionDecisionReason, "first denial");
    assert.equal(output.hookSpecificOutput.updatedInput, undefined);
  }
  const second = { ...rewrite("printf SECOND"), id: "second" };
  const conflict = dispatch(event(), config([rewrite(), second]));
  assert.equal(conflict.output.hookSpecificOutput.permissionDecision, "deny");
  assert.equal(conflict.output.hookSpecificOutput.updatedInput, undefined);
  assert.doesNotMatch(JSON.stringify(conflict), /MODS_BEFORE|SECOND/);
  const same = dispatch(event(), config([rewrite(), { ...rewrite(), id: "same" }]));
  assert.equal(same.output.hookSpecificOutput.updatedInput.command, after);
});

test("guards re-evaluate transformed input without chained rewrites or bypass", () => {
  const guard = { id: "guard", type: "denyGuard", enabled: true, rules: [{ commandContains: ["MODS_AFTER"], reason: "transformed command denied" }] };
  assert.equal(dispatch(event(), config([rewrite(), guard])).output.hookSpecificOutput.permissionDecisionReason, "transformed command denied");
  guard.enabled = false;
  assert.equal(dispatch(event(), config([rewrite(), guard])).output.hookSpecificOutput.updatedInput.command, after);
  const chained = { ...rewrite("printf THIRD"), id: "chained", rules: [{ toolName: "Bash", fromCommand: after, toCommand: "printf THIRD" }] };
  assert.equal(dispatch(event(), config([rewrite(), chained])).output.hookSpecificOutput.updatedInput.command, after);
});

test("replacement review failure preserves an existing denial and rejects malformed proposals", () => {
  const mods = ["rewrite", "guard", "error"].map((type) => ({ type, enabled: true, options: {} }));
  const definitions = {
    rewrite: { handle: () => ({ kind: "replaceCommand", command: after }) },
    guard: { inspectReplacement: true, handle: (received) => received.tool_input.command === after ? { kind: "deny", reason: "preserved replacement denial" } : { kind: "abstain" } },
    error: { inspectReplacement: true, handle: (received) => {
      if (received.tool_input.command === after) throw new Error("synthetic-private-failure");
      return { kind: "abstain" };
    } },
  };
  const result = dispatch(event(), { mods }, (type) => definitions[type]);
  assert.equal(result.output.hookSpecificOutput.permissionDecisionReason, "preserved replacement denial");
  assert.doesNotMatch(JSON.stringify(result), /synthetic-private-failure/);
  const wrongTool = dispatch({ ...event(), tool_name: "Agent" }, { mods: [mods[0]] }, (type) => definitions[type]);
  assert.equal(wrongTool.output.hookSpecificOutput.permissionDecision, "deny");
  assert.equal(wrongTool.output.hookSpecificOutput.updatedInput, undefined);
});

test("wire validator refuses permission mutations, approval-only output and missing disclosure", () => {
  const original = event();
  original.tool_input.sandbox_permissions = "require_escalated";
  const valid = dispatch(original, config()).output;
  assert.doesNotThrow(() => assertSafeOutput(valid, original));
  const mutations = [
    (output) => { delete output.systemMessage; },
    (output) => { output.systemMessage = "something changed"; },
    (output) => { output.hookSpecificOutput.updatedInput.sandbox_permissions = "use_default"; },
    (output) => { output.hookSpecificOutput.updatedInput.model = "another-model"; },
    (output) => { output.hookSpecificOutput.hookEventName = "PermissionRequest"; },
    (output) => { delete output.hookSpecificOutput.updatedInput; },
    (output) => { output.hookSpecificOutput.updatedInput.command = before; },
  ];
  for (const mutate of mutations) {
    const output = structuredClone(valid);
    mutate(output);
    assert.throws(() => assertSafeOutput(output, original));
  }
  assert.throws(() => assertSafeOutput(valid), /paired/);
});

test("bounded proposals and strict config prevent arbitrary field or module alteration", () => {
  for (const fields of [
    { toolName: "exec_command" }, { toCommand: before }, { toCommand: "x".repeat(201) },
    { toCommand: "printf something\n" }, { toCommand: "printf \u202ehidden" }, { updatedInput: {} }, { model: "another" },
    { sandbox_permissions: "require_escalated" }, { prompt: "replace" }, { path: "custom.mjs" },
  ]) {
    const mod = rewrite();
    Object.assign(mod.rules[0], fields);
    assert.throws(() => config([mod]));
  }
  const duplicate = rewrite();
  duplicate.rules.push({ ...duplicate.rules[0] });
  assert.throws(() => config([duplicate]), /duplicates/);
  for (const metadataState of [{ enabled: "true" }, { enabled: true, scope: "all" }, { enabled: true, capture: "transcript" }]) {
    assert.throws(() => config([], { metadataState }));
  }
  const escaped = "\\".repeat(200);
  const mod = rewrite(escaped);
  mod.rules[0].fromCommand = "\"".repeat(200);
  assert.ok(dispatch(event(mod.rules[0].fromCommand), config([mod])).output.systemMessage.length <= 1000);
});

test("metadata projection is default-off, independent of legacy journal, and content-free", () => {
  const sensitive = { ...event(), transcript_path: "synthetic-private-transcript", prompt: "synthetic-private-prompt" };
  assert.equal(dispatch(sensitive, config()).stateMetadata, null);
  const result = dispatch(sensitive, config([], { metadataState: { enabled: true } }));
  assert.deepEqual(result.stateMetadata, { event: "PreToolUse", tool: "Bash" });
  assert.equal(result.journal, null);
  assert.doesNotMatch(JSON.stringify(result.stateMetadata), /private|MODS|session|cwd|prompt|transcript/);
  const mods = [{ id: "deny", type: "denyGuard", enabled: true, rules: [{ toolNames: ["Bash"], reason: "review" }] }];
  assert.equal(dispatch(sensitive, config(mods, { metadataState: { enabled: true } })).stateMetadata.decision, "deny");
  assert.deepEqual(config().metadataState, { enabled: false, scope: "session" });
  assert.deepEqual(config([], { metadataState: { enabled: true } }).metadataState, { enabled: true, scope: "session" });
});

const posix = { skip: process.platform === "win32" };

test("disabled native metadata path performs no writes, including with a configured data directory", posix, async (t) => {
  const directory = await temporary(t);
  const path = join(directory, "config.json");
  await writeFile(path, JSON.stringify({ version: 1, mods: [] }));
  const data = join(directory, "must-not-exist");
  const result = await invoke({ ...event(), cwd: directory }, path, { CODEX_MODS_DATA_DIR: data });
  assert.equal(result.code, 0);
  assert.equal(result.stderr, "");
  await assert.rejects(readdir(data), /ENOENT/);
});

test("native hook metadata isolates sessions and persists only selected metadata", posix, async (t) => {
  const directory = await temporary(t);
  const project = join(directory, "synthetic-private-project");
  await mkdir(project);
  const path = join(directory, "config.json");
  await writeFile(path, JSON.stringify({ version: 1, metadataState: { enabled: true }, mods: [] }));
  const data = join(directory, "data");
  for (const session_id of ["synthetic-private-session-a", "synthetic-private-session-b", "synthetic-private-session-a"]) {
    const result = await invoke({ ...event(), cwd: project, session_id, transcript_path: "synthetic-private-transcript", prompt: "synthetic-private-prompt" }, path, { CODEX_MODS_DATA_DIR: data });
    assert.equal(result.code, 0);
    assert.equal(result.stderr, "");
  }
  assert.equal((await readMetadataState(data, { projectId: project, sessionId: "synthetic-private-session-a" })).records, 2);
  assert.equal((await readMetadataState(data, { projectId: project, sessionId: "synthetic-private-session-b" })).records, 1);
  const files = await readdir(data, { recursive: true, withFileTypes: true });
  for (const entry of files.filter((entry) => entry.isFile())) {
    const content = await readFile(join(entry.parentPath, entry.name), "utf8");
    assert.doesNotMatch(content, /synthetic-private|MODS_BEFORE|prompt|transcript|cwd|session_id/);
  }
});

test("project aggregation requires explicit scope and enforces the selected project boundary", posix, async (t) => {
  const directory = await temporary(t);
  const project = join(directory, "project");
  const subdirectory = join(project, "child");
  await mkdir(subdirectory, { recursive: true });
  const outside = join(directory, "outside");
  await mkdir(outside);
  const path = join(directory, "config.json");
  await writeFile(path, JSON.stringify({ version: 1, metadataState: { enabled: true, scope: "project" }, mods: [] }));
  const data = join(directory, "data");
  const env = { CODEX_MODS_DATA_DIR: data, CODEX_MODS_PROJECT_ROOT: project };
  for (const [cwd, session_id] of [[project, "first"], [subdirectory, "second"]]) {
    const result = await invoke({ ...event(), cwd, session_id }, path, env);
    assert.equal(result.stderr, "");
  }
  assert.equal((await readMetadataState(data, { projectId: project })).records, 2);
  const refused = await invoke({ ...event(), cwd: outside, session_id: "private-refused" }, path, env);
  assert.deepEqual(refused.output, {});
  assert.equal(refused.stderr, "claude-mods-for-codex: metadata state unavailable\n");
  assert.doesNotMatch(refused.stderr, /outside|private-refused|MODS/);
  assert.equal((await readMetadataState(data, { projectId: project })).records, 2);
});

test("metadata failures cannot discard a native denial or echo private input", posix, async (t) => {
  const directory = await temporary(t);
  const path = join(directory, "config.json");
  await writeFile(path, JSON.stringify({ version: 1, metadataState: { enabled: true }, mods: [{ id: "deny", type: "denyGuard", enabled: true, rules: [{ toolNames: ["Bash"], reason: "review" }] }] }));
  const result = await invoke({ ...event("synthetic-private-command"), cwd: directory }, path);
  assert.equal(result.output.hookSpecificOutput.permissionDecision, "deny");
  assert.equal(result.stderr, "claude-mods-for-codex: metadata state unavailable\n");
  assert.doesNotMatch(JSON.stringify(result), /synthetic-private-command/);
});


test("native structural preparation failures deny covered PreToolUse events without private output", async (t) => {
  const directory = await temporary(t);
  const path = join(directory, "config.json");
  await writeFile(path, JSON.stringify({ version: 1, mods: [{ id: "deny", type: "denyGuard", enabled: true, rules: [{ toolNames: ["Bash"], reason: "review" }] }] }));
  let nested = { note: "synthetic-private-extra" };
  for (let index = 0; index < 34; index++) nested = { child: nested };
  const cases = [nested, Array(16384).fill("synthetic-private-extra")];
  for (const extra of cases) {
    const input = { ...event("synthetic-private-command"), extra };
    const result = await invoke(input, path);
    assert.equal(result.code, 0);
    assert.equal(result.output.hookSpecificOutput.permissionDecision, "deny");
    assert.equal(result.output.hookSpecificOutput.updatedInput, undefined);
    assert.equal(result.stderr, "claude-mods-for-codex: event processing unavailable\n");
    assert.doesNotMatch(JSON.stringify(result), /synthetic-private|MODS_BEFORE|cwd|session_id|transcript/);
  }
  const post = await invoke({ ...event("synthetic-private-command"), hook_event_name: "PostToolUse", tool_response: {}, extra: nested }, path);
  assert.equal(post.code, 0);
  assert.deepEqual(post.output, {});
  assert.equal(post.stderr, "claude-mods-for-codex: event processing unavailable\n");
  assert.doesNotMatch(JSON.stringify(post), /synthetic-private|MODS_BEFORE/);
});
