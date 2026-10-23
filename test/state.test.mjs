import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chmod, link, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  MAX_STATE_SCOPES, metadataScopeKey, observeMetadataState, pruneMetadataState, readMetadataState, recordMetadataEvent,
} from "../src/state.mjs";

const posixOnly = { skip: process.platform === "win32" };
const scope = { projectId: "synthetic-private-project", sessionId: "synthetic-private-session" };
const fixedTime = () => new Date("2026-10-23T12:00:00Z");

async function temporaryDirectory(t) {
  const path = await mkdtemp(join(await realpath(tmpdir()), "codex-mods-state-"));
  t.after(() => rm(path, { recursive: true, force: true }));
  return path;
}

function statePath(directory, selectedScope = scope) {
  return join(directory, "metadata-state-v1", metadataScopeKey(selectedScope));
}

function childWriter(directory, selectedScope, count = 1) {
  const program = `import { recordMetadataEvent } from ${JSON.stringify(new URL("../src/state.mjs", import.meta.url).href)};
    const [directory, scope, count] = JSON.parse(process.argv[1]);
    for (let i = 0; i < count; i++) await recordMetadataEvent(directory, scope, { event: "PostToolUse", tool: "Bash" });`;
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--input-type=module", "-e", program, JSON.stringify([directory, selectedScope, count])]);
    let output = "";
    const watchdog = setTimeout(() => { child.kill("SIGKILL"); reject(new Error("state child exceeded watchdog")); }, 10000);
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("error", (error) => { clearTimeout(watchdog); reject(error); });
    child.on("close", (code) => {
      clearTimeout(watchdog);
      code === 0 ? resolve(output) : reject(new Error(`state child exited ${code}: ${output}`));
    });
    child.stdin.end();
  });
}

test("state scope keys isolate projects, sessions, and explicit project-wide state", () => {
  const values = [scope, { ...scope, projectId: "different" }, { ...scope, sessionId: "different" }, { projectId: scope.projectId }];
  assert.equal(new Set(values.map(metadataScopeKey)).size, 4);
  assert.match(metadataScopeKey(scope), /^[a-f0-9]{64}$/);
  assert.throws(() => metadataScopeKey({ ...scope, prompt: "secret" }), /unsupported field/);
  assert.throws(() => metadataScopeKey({ projectId: "" }), /identifiers/);
  assert.throws(() => metadataScopeKey({ projectId: "x", sessionId: null }), /identifiers/);
  assert.throws(() => metadataScopeKey({ get projectId() { throw new Error("should not execute"); } }), /unsupported field/);
});

test("Windows state storage is explicitly unavailable until ACL validation exists", { skip: process.platform !== "win32" }, async () => {
  const directory = join(tmpdir(), "unused-state-proof");
  await assert.rejects(recordMetadataEvent(directory, scope, { event: "SessionStart" }), /Windows state storage/);
  await assert.rejects(readMetadataState(directory, scope), /Windows state storage/);
  await assert.rejects(pruneMetadataState(directory, { before: new Date() }), /Windows state storage/);
});

test("state readers create nothing and return an explicit retained-record snapshot", posixOnly, async (t) => {
  const parent = await temporaryDirectory(t);
  const missing = join(parent, "missing");
  const empty = await readMetadataState(missing, scope);
  assert.equal(empty.records, 0);
  assert.match(empty.retention, /not lifetime/);
  await assert.rejects(lstat(missing), /ENOENT/);
  assert.deepEqual(await readdir(parent), []);
});

test("state contains only strict metadata and separates selected scopes", posixOnly, async (t) => {
  const directory = await temporaryDirectory(t);
  await recordMetadataEvent(directory, scope, { event: "SessionStart" }, fixedTime);
  await recordMetadataEvent(directory, scope, { event: "PreToolUse", tool: "Bash", decision: "deny" }, fixedTime);
  const other = { ...scope, sessionId: "different" };
  await recordMetadataEvent(directory, other, { event: "PostToolUse", tool: "Read" }, fixedTime);
  assert.equal((await readMetadataState(directory, scope)).records, 2);
  assert.equal((await readMetadataState(directory, scope)).denials, 1);
  assert.equal((await readMetadataState(directory, other)).records, 1);
  assert.equal((await readMetadataState(directory, { projectId: scope.projectId })).records, 0);
  const text = await readFile(join(statePath(directory), "activity.jsonl"), "utf8");
  assert.doesNotMatch(text, /synthetic-private|sessionId|projectId|command|prompt|transcript|\/Users\//);
  assert.deepEqual((await readdir(join(directory, "metadata-state-v1"))).sort(), [metadataScopeKey(scope), metadataScopeKey(other)].sort());
  await assert.rejects(recordMetadataEvent(directory, scope, { event: "SessionStart", prompt: "synthetic-secret" }), /unsupported field/);
  await assert.rejects(recordMetadataEvent(directory, scope, { event: "SessionStart", tool: "bad\nname" }), /identifier/);
  assert.equal((await readMetadataState(directory, scope)).records, 2);
});

test("independent state writer processes preserve every retained event", posixOnly, async (t) => {
  const directory = await temporaryDirectory(t);
  const outputs = await Promise.all(Array.from({ length: 8 }, () => childWriter(directory, scope, 4)));
  assert.deepEqual(outputs, Array(8).fill(""));
  const result = await readMetadataState(directory, scope);
  assert.equal(result.records, 32);
  assert.deepEqual(result.events, { PostToolUse: 32 });
  assert.deepEqual(result.tools, { Bash: 32 });
  assert.deepEqual(await readdir(statePath(directory)), ["activity.jsonl"]);
});

test("bounded observer sees an event written by another process and closes cleanly", posixOnly, async (t) => {
  const directory = await temporaryDirectory(t);
  const controller = new AbortController();
  const iterator = observeMetadataState(directory, scope, { intervalMs: 100, durationMs: 3000, signal: controller.signal });
  const initial = await iterator.next();
  assert.equal(initial.value.records, 0);
  await childWriter(directory, scope);
  const changed = await iterator.next();
  assert.equal(changed.value.records, 1);
  assert.notEqual(initial.value.revision, changed.value.revision);
  controller.abort();
  assert.equal((await iterator.next()).done, true);
  assert.deepEqual(await readdir(statePath(directory)), ["activity.jsonl"]);
});

test("observer rejects unbounded options, stops at its deadline, and aborts idle polling", posixOnly, async (t) => {
  const directory = await temporaryDirectory(t);
  for (const options of [{ intervalMs: 0 }, { durationMs: Infinity }, { durationMs: 30001 }, { callback() {} }]) {
    await assert.rejects(observeMetadataState(directory, scope, options).next(), /requires|unsupported field/);
  }
  const iterator = observeMetadataState(directory, scope, { intervalMs: 100, durationMs: 30 });
  assert.equal((await iterator.next()).value.records, 0);
  assert.equal((await iterator.next()).done, true);
  const controller = new AbortController();
  const abortable = observeMetadataState(directory, scope, { intervalMs: 1000, durationMs: 30000, signal: controller.signal });
  await abortable.next();
  const pending = abortable.next();
  controller.abort();
  assert.equal((await pending).done, true);
});

test("observer emits nothing after cancellation during an in-flight read", posixOnly, async (t) => {
  const directory = await temporaryDirectory(t);
  const controller = new AbortController();
  const observer = observeMetadataState(directory, scope, { signal: controller.signal });
  const pending = observer.next();
  controller.abort();
  assert.deepEqual(await pending, { value: undefined, done: true });
  assert.deepEqual(await readdir(directory), []);
});

test("explicit retention prunes old scopes and preserves active and unrelated files", posixOnly, async (t) => {
  const directory = await temporaryDirectory(t);
  const active = { ...scope, sessionId: "active" };
  await recordMetadataEvent(directory, scope, { event: "SessionStart" }, () => new Date("2026-01-01T00:00:00Z"));
  await recordMetadataEvent(directory, active, { event: "SessionStart" }, fixedTime);
  await writeFile(join(directory, "unrelated.txt"), "keep");
  await assert.rejects(pruneMetadataState(directory), /explicit valid cutoff/);
  assert.deepEqual(await pruneMetadataState(directory, { before: new Date("2026-10-01T00:00:00Z") }), { removedScopes: 1 });
  assert.equal((await readMetadataState(directory, scope)).records, 0);
  assert.equal((await readMetadataState(directory, active)).records, 1);
  assert.equal(await readFile(join(directory, "unrelated.txt"), "utf8"), "keep");
  await writeFile(join(statePath(directory, active), "unknown.txt"), "keep", { mode: 0o600 });
  await assert.rejects(pruneMetadataState(directory, { before: new Date("2027-01-01T00:00:00Z") }), /unexpected files/);
  assert.equal(await readFile(join(statePath(directory, active), "unknown.txt"), "utf8"), "keep");
});

test("state caps scope creation and does not guess which scope to evict", posixOnly, async (t) => {
  const directory = await temporaryDirectory(t);
  await recordMetadataEvent(directory, scope, { event: "SessionStart" }, fixedTime);
  const root = join(directory, "metadata-state-v1");
  for (let i = 1; i < MAX_STATE_SCOPES; i++) await mkdir(join(root, metadataScopeKey({ projectId: `synthetic-${i}` })), { mode: 0o700 });
  await assert.rejects(recordMetadataEvent(directory, { projectId: "overflow" }, { event: "SessionStart" }), /scope limit/);
  await recordMetadataEvent(directory, scope, { event: "PostToolUse", tool: "Bash" }, fixedTime);
  assert.equal((await readMetadataState(directory, scope)).records, 2);
  assert.equal((await readdir(root)).length, MAX_STATE_SCOPES);
});

test("state refuses a held lock within a bounded interval without removing it", posixOnly, async (t) => {
  const directory = await temporaryDirectory(t);
  await recordMetadataEvent(directory, scope, { event: "SessionStart" }, fixedTime);
  const lock = join(directory, "metadata-state-v1", ".state.lock");
  await mkdir(lock, { mode: 0o700 });
  await assert.rejects(recordMetadataEvent(directory, scope, { event: "SessionStart" }), /busy/);
  assert.ok((await lstat(lock)).isDirectory());
  assert.equal((await readMetadataState(directory, scope)).records, 1);
});

test("state rejects symlinked roots and scopes and public directory permissions", posixOnly, async (t) => {
  const directory = await temporaryDirectory(t);
  const target = join(directory, "target");
  const linkPath = join(directory, "link");
  await mkdir(target, { mode: 0o700 });
  await symlink(target, linkPath);
  await assert.rejects(readMetadataState(linkPath, scope), /symbolic/);
  await assert.rejects(recordMetadataEvent(linkPath, scope, { event: "SessionStart" }), /symbolic/);
  await recordMetadataEvent(target, scope, { event: "SessionStart" });
  await symlink(statePath(target), statePath(target, { projectId: "symlink-scope" }));
  await assert.rejects(readMetadataState(target, { projectId: "symlink-scope" }), /symbolic/);
  await assert.rejects(recordMetadataEvent(target, scope, { event: "SessionStart" }), /symbolic/);
  await chmod(target, 0o755);
  await assert.rejects(readMetadataState(target, scope), /group or other access/);
});

test("retention refuses linked journal files without altering their targets", posixOnly, async (t) => {
  const directory = await temporaryDirectory(t);
  await recordMetadataEvent(directory, scope, { event: "SessionStart" }, fixedTime);
  const target = join(directory, "unrelated");
  await writeFile(target, "keep", { mode: 0o600 });
  const archive = join(statePath(directory), "activity.previous.jsonl");
  await link(target, archive);
  await assert.rejects(pruneMetadataState(directory, { before: new Date("2027-01-01T00:00:00Z") }), /hard links/);
  await rm(archive);
  await symlink(target, archive);
  await assert.rejects(pruneMetadataState(directory, { before: new Date("2027-01-01T00:00:00Z") }), /symbolic/);
  assert.equal(await readFile(target, "utf8"), "keep");
});
