import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { mkdtemp, readFile, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { Readable } from "node:stream";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateConfig } from "../src/config.mjs";
import { runCli } from "../src/cli.mjs";
import { assertSafeOutput, dispatch, validateEventEnvelope, validateHandlerResult } from "../src/dispatcher.mjs";
import { readBoundedFile, readBoundedStream } from "../src/io.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseConfig = JSON.parse(await readFile(join(root, "config/mods.json"), "utf8"));
const deniedEvent = JSON.parse(await readFile(join(root, "fixtures/pre-tool-denied.json"), "utf8"));
const safeEvent = JSON.parse(await readFile(join(root, "fixtures/pre-tool-safe.json"), "utf8"));

function invokeProgram(args, input = "", env = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, args, { env: { ...process.env, ...env } });
    const watchdog = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("child process exceeded the bounded test watchdog"));
    }, 2000);
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
    child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
    child.on("error", (error) => { clearTimeout(watchdog); reject(error); });
    child.on("close", (code) => { clearTimeout(watchdog); resolvePromise({ code, stdout, stderr }); });
    child.stdin.end(input);
  });
}

function invokeHook(input, env = {}) {
  return invokeProgram([join(root, "src/hook-main.mjs")], input, { PLUGIN_ROOT: root, ...env });
}

test("output validator accepts only the exact supported shapes", () => {
  assert.doesNotThrow(() => assertSafeOutput({}));
  assert.doesNotThrow(() => assertSafeOutput({ systemMessage: "visible" }));
  assert.throws(() => assertSafeOutput({ decision: "block" }), /unsupported/);
  assert.throws(() => assertSafeOutput({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "allow", permissionDecisionReason: "no" } }), /only PreToolUse deny/);
  assert.throws(() => assertSafeOutput({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: "x", updatedInput: {} } }), /unsupported fields/);
});

test("first denial survives every later mod", () => {
  const raw = structuredClone(baseConfig);
  raw.mods.push({
    id: "later-guard",
    type: "denyGuard",
    enabled: true,
    rules: [{ toolNames: ["Bash"], reason: "later reason" }],
  });
  assert.equal(dispatch(deniedEvent, validateConfig(raw)).output.hookSpecificOutput.permissionDecisionReason, baseConfig.mods[1].rules[0].reason);
});

test("disabled guard is never evaluated and arbitrary JSON tool input remains a nonmatch", () => {
  const raw = structuredClone(baseConfig);
  raw.mods[1].enabled = false;
  const disabled = validateConfig(raw);
  assert.deepEqual(dispatch(deniedEvent, disabled).output, {});
  const scalarInput = { ...safeEvent, tool_input: "opaque" };
  assert.equal(validateEventEnvelope(scalarInput), true);
  assert.deepEqual(dispatch(scalarInput, validateConfig(baseConfig)).output, {});
});

test("configuration is strict data and rejects regex or module loader fields", () => {
  const raw = structuredClone(baseConfig);
  raw.mods[1].rules[0].regex = ".*";
  assert.throws(() => validateConfig(raw), /unknown key/);
  const moduleConfig = { version: 1, mods: [{ id: "remote", type: "module", enabled: true, path: "https:\/\/example.test\/mod.js" }] };
  assert.throws(() => validateConfig(moduleConfig), /unsupported/);
});

test("malformed envelopes and unsafe tool identifiers are rejected", () => {
  assert.throws(() => validateEventEnvelope({ hook_event_name: "PreToolUse" }), /cwd/);
  assert.throws(() => validateEventEnvelope({ ...safeEvent, tool_name: "bad\nname" }), /safe identifier/);
  const withoutInput = { ...safeEvent };
  delete withoutInput.tool_input;
  assert.throws(() => validateEventEnvelope(withoutInput), /requires tool_input/);
});

test("bounded readers stop oversized streams and regular files", async (t) => {
  await assert.rejects(readBoundedStream(Readable.from([Buffer.alloc(9)]), 8), /exceeds/);
  const directory = await mkdtemp(join(tmpdir(), "codex-mods-bounds-"));
  t.after(async () => (await import("node:fs/promises")).rm(directory, { recursive: true, force: true }));
  const path = join(directory, "large.json");
  await writeFile(path, "123456789");
  await assert.rejects(readBoundedFile(path, 8), /exceeds/);
  const link = join(directory, "link.json");
  await symlink(path, link);
  await assert.rejects(readBoundedFile(link, 100), /ELOOP|symbolic|too many/i);
});

test("replay dispatch never executes a command contained in tool input", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "codex-mods-noexec-"));
  t.after(async () => (await import("node:fs/promises")).rm(directory, { recursive: true, force: true }));
  const marker = join(directory, "should-not-exist");
  const event = { ...safeEvent, tool_input: { command: `touch ${marker}` } };
  dispatch(event, validateConfig(baseConfig));
  await assert.rejects(readFile(marker), /ENOENT/);
});

test("valid PreToolUse fails closed when config cannot be loaded without echoing payload", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "codex-mods-invalid-config-"));
  t.after(async () => (await import("node:fs/promises")).rm(directory, { recursive: true, force: true }));
  const invalid = join(directory, "invalid.json");
  await writeFile(invalid, "{ secret-payload");
  const event = JSON.stringify({ ...safeEvent, tool_input: { command: "private-command-token" } });
  const result = await invokeHook(event, { CODEX_MODS_CONFIG: invalid });
  assert.equal(result.code, 0);
  assert.equal(JSON.parse(result.stdout).hookSpecificOutput.permissionDecision, "deny");
  assert.match(result.stderr, /configuration unavailable/);
  assert.doesNotMatch(result.stderr, /private-command-token|secret-payload/);
});

test("malformed JSON diagnostics never echo the raw payload", async () => {
  const result = await invokeHook('{ "private": "secret-token" ');
  assert.notEqual(result.code, 0);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /invalid hook input/);
  assert.doesNotMatch(result.stderr, /secret-token/);
});

test("dispatch is deterministic", () => {
  const config = validateConfig(baseConfig);
  assert.deepEqual(dispatch(deniedEvent, config), dispatch(deniedEvent, config));
});


test("FIFO configuration and event paths are rejected without waiting for a writer", { skip: process.platform === "win32" }, async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "codex-mods-fifo-"));
  t.after(async () => (await import("node:fs/promises")).rm(directory, { recursive: true, force: true }));
  const fifo = join(directory, "input.json");
  execFileSync("mkfifo", [fifo], { timeout: 2000 });
  const hook = await invokeHook(JSON.stringify(safeEvent), { CODEX_MODS_CONFIG: fifo });
  assert.equal(hook.code, 0);
  assert.equal(JSON.parse(hook.stdout).hookSpecificOutput.permissionDecision, "deny");
  assert.match(hook.stderr, /configuration unavailable/);
  const replay = await invokeProgram([join(root, "bin/codex-mods.mjs"), "replay", "--event", fifo]);
  assert.equal(replay.code, 1);
  assert.match(replay.stderr, /regular file/);
});

function dispatchWithHandlers(event, handlers) {
  const config = { mods: handlers.map((handle, index) => ({ type: String(index), enabled: true, options: {} })) };
  return dispatch(event, config, (type) => ({ handle: handlers[Number(type)] }));
}

test("handler failures preserve prior denial and become sanitized fallback denials", async () => {
  const invalidResults = [null, [], { allow: true }, { journal: {} }, { journal: undefined },
    { message: "" }, { message: "x".repeat(1001) }, { message: "bad\u001btext" },
    { denyReason: " " }, { denyReason: "x".repeat(501) }, { denyReason: "bad\ntext" },
    new Date(), { then() {} }, Object.defineProperty({}, "message", { get() { throw new Error("private getter"); } }),
  ];
  const faultyHandlers = [() => { throw new Error("private failure payload"); },
    () => Promise.reject(new Error("private asynchronous payload")), ...invalidResults.map((result) => () => result)];
  for (const faulty of faultyHandlers) {
    const preserved = dispatchWithHandlers(safeEvent, [() => ({ denyReason: "first denial" }), faulty]);
    assert.equal(preserved.output.hookSpecificOutput.permissionDecisionReason, "first denial");
    assert.equal(preserved.diagnostic, "one or more mod handlers failed");
    const fallback = dispatchWithHandlers(safeEvent, [faulty]);
    assert.equal(fallback.output.hookSpecificOutput.permissionDecision, "deny");
    assert.doesNotMatch(JSON.stringify(fallback), /private/);
  }
  await new Promise((resolvePromise) => setImmediate(resolvePromise));
});

test("non-tool handler failures emit diagnostics without a denial or false journal activation", async () => {
  const session = JSON.parse(await readFile(join(root, "fixtures/session-start.json"), "utf8"));
  for (const event of [session, { ...safeEvent, hook_event_name: "PostToolUse", tool_response: {} }]) {
    const result = dispatchWithHandlers(event, [() => ({ message: "visible notice" }), () => ({ denyReason: "wrong event" })]);
    assert.deepEqual(result.output, { systemMessage: "visible notice" });
    assert.equal(result.diagnostic, "one or more mod handlers failed");
  }
  assert.equal(dispatchWithHandlers(safeEvent, [() => ({ journal: false })]).journal, null);
  assert.deepEqual(dispatchWithHandlers(safeEvent, [() => ({ journal: true })]).journal, { event: "PreToolUse", tool: safeEvent.tool_name });
  assert.throws(() => validateHandlerResult({ denyReason: "wrong event" }, "SessionStart"), /PreToolUse/);
});

test("whitespace denial reasons fail validation without changing literal guard matches", () => {
  const raw = structuredClone(baseConfig);
  raw.mods[1].rules[0].reason = "   ";
  assert.throws(() => validateConfig(raw), /visible text/);
  assert.throws(() => assertSafeOutput({ hookSpecificOutput: {
    hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: "  ",
  } }), /invalid/);
  assert.throws(() => assertSafeOutput({ systemMessage: "bad\u001btext" }), /invalid/);
  const literal = structuredClone(baseConfig);
  literal.mods[1].rules[0].commandContains = [" "];
  literal.mods[1].rules[0].reason = "  visible reason  ";
  assert.equal(dispatch(safeEvent, validateConfig(literal)).output.hookSpecificOutput.permissionDecisionReason, "  visible reason  ");
});

test("fixture replay enforces file-count and aggregate-byte caps", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "codex-mods-replay-caps-"));
  t.after(async () => (await import("node:fs/promises")).rm(directory, { recursive: true, force: true }));
  const streams = { stdin: Readable.from([]), stdout: { write() { assert.fail("oversized fixture collection must not emit results"); } } };
  await Promise.all(Array.from({ length: 129 }, (_, index) => writeFile(join(directory, `${index}.json`), "{}")));
  await assert.rejects(runCli(["replay", "--fixtures", directory], streams), /128-file limit/);
  await Promise.all(Array.from({ length: 129 }, async (_, index) => (await import("node:fs/promises")).rm(join(directory, `${index}.json`))));
  const padded = "{}" + " ".repeat(1024 * 1024 - 2);
  await Promise.all(Array.from({ length: 9 }, (_, index) => writeFile(join(directory, `${index}.json`), padded)));
  await assert.rejects(runCli(["replay", "--fixtures", directory], streams), /8 MiB aggregate limit/);
});


test("a rejected async handler cannot terminate the process after producing a denial", async () => {
  const dispatcherUrl = new URL("../src/dispatcher.mjs", import.meta.url).href;
  const program = `import { dispatch } from ${JSON.stringify(dispatcherUrl)};
    const event = JSON.parse(process.argv[1]);
    const result = dispatch(event, { mods: [{ type: "trusted-test", enabled: true, options: {} }] },
      () => ({ handle: async () => { throw new Error("private async failure"); } }));
    process.stdout.write(JSON.stringify(result));`;
  const result = await invokeProgram(["--input-type=module", "-e", program, JSON.stringify(safeEvent)]);
  assert.equal(result.code, 0);
  assert.equal(JSON.parse(result.stdout).output.hookSpecificOutput.permissionDecision, "deny");
  assert.equal(JSON.parse(result.stdout).diagnostic, "one or more mod handlers failed");
  assert.equal(result.stderr, "");
  assert.doesNotMatch(result.stdout, /private async failure/);
});
