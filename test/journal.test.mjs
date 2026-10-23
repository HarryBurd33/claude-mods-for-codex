import assert from "node:assert/strict";
import { chmod, link, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { validateConfig } from "../src/config.mjs";
import { dispatch } from "../src/dispatcher.mjs";
import { MAX_JOURNAL_BYTES } from "../src/constants.mjs";
import { appendJournalEntry, readJournalEntries, summarizeJournal } from "../src/journal.mjs";

async function temporaryDirectory(t, prefix) {
  const path = await mkdtemp(join(await realpath(tmpdir()), prefix));
  t.after(async () => (await import("node:fs/promises")).rm(path, { recursive: true, force: true }));
  return path;
}

test("journal stores only strict metadata and report is deterministic", async (t) => {
  const directory = await temporaryDirectory(t, "codex-mods-journal-");
  const now = () => new Date("2026-10-22T12:00:00.000Z");
  await appendJournalEntry(directory, { event: "SessionStart" }, now);
  await appendJournalEntry(directory, { event: "PreToolUse", tool: "Bash", decision: "deny" }, now);
  const text = await readFile(join(directory, "activity.jsonl"), "utf8");
  assert.doesNotMatch(text, /command|prompt|response|transcript|session_id|turn_id|cwd|\/Users\//i);
  assert.deepEqual(summarizeJournal(await readJournalEntries(directory)), {
    records: 2,
    status: "journal records summarized",
    denials: 1,
    events: { PreToolUse: 1, SessionStart: 1 },
    tools: { Bash: 1 },
  });
});

test("journal rejects extra or unsafe metadata", async (t) => {
  const directory = await temporaryDirectory(t, "codex-mods-journal-reject-");
  await assert.rejects(appendJournalEntry(directory, { event: "PreToolUse", prompt: "secret" }), /forbidden/);
  await assert.rejects(appendJournalEntry(directory, { event: "PreToolUse", tool: "bad\nname" }), /identifier/);
  await assert.rejects(appendJournalEntry(directory, { event: "PreToolUse", tool: "__proto__" }), /identifier/);
});

test("disabled journal creates no dispatch record", () => {
  const config = validateConfig({ version: 1, mods: [{ id: "journal", type: "activityJournal", enabled: false }] });
  const event = {
    cwd: "/fixture", hook_event_name: "SessionStart", model: "fixture", permission_mode: "default",
    session_id: "fixture", source: "startup", transcript_path: null,
  };
  assert.equal(dispatch(event, config).journal, null);
});

test("concurrent journal writes preserve every record", async (t) => {
  const directory = await temporaryDirectory(t, "codex-mods-journal-concurrent-");
  await Promise.all(Array.from({ length: 12 }, (_, index) => appendJournalEntry(
    directory,
    { event: "PreToolUse", tool: `tool_${index}` },
    () => new Date("2026-10-22T12:00:00.000Z"),
  )));
  const entries = await readJournalEntries(directory);
  assert.equal(entries.length, 12);
  assert.deepEqual(entries.map((entry) => entry.tool).sort(), Array.from({ length: 12 }, (_, index) => `tool_${index}`).sort());
});

test("journal refuses symlinked data directories", async (t) => {
  const parent = await temporaryDirectory(t, "codex-mods-journal-symlink-");
  const target = join(parent, "target");
  await (await import("node:fs/promises")).mkdir(target);
  const link = join(parent, "link");
  await symlink(target, link);
  await assert.rejects(appendJournalEntry(link, { event: "SessionStart" }), /symbolic/);
});

test("report reading does not create a missing data directory", async (t) => {
  const parent = await temporaryDirectory(t, "codex-mods-report-readonly-");
  const missing = join(parent, "missing");
  await assert.rejects(readJournalEntries(missing), /ENOENT/);
  await assert.rejects(lstat(missing), /ENOENT/);
});

test("report rejects malformed or privacy-expanding records", async (t) => {
  const directory = await temporaryDirectory(t, "codex-mods-journal-malformed-");
  await writeFile(join(directory, "activity.jsonl"), '{"recordedAt":"2026-10-22T12:00:00.000Z","event":"PreToolUse","prompt":"secret"}\n', { mode: 0o600 });
  await assert.rejects(readJournalEntries(directory), /forbidden/);
});


test("journal refuses hard-linked files without changing their target", async (t) => {
  const parent = await temporaryDirectory(t, "codex-mods-journal-hardlink-");
  const directory = join(parent, "data");
  await mkdir(directory, { mode: 0o700 });
  const target = join(parent, "unrelated");
  await writeFile(target, "unrelated contents", { mode: 0o600 });
  await link(target, join(directory, "activity.jsonl"));
  await assert.rejects(appendJournalEntry(directory, { event: "SessionStart" }), /hard links/);
  await assert.rejects(readJournalEntries(directory), /hard links/);
  assert.equal(await readFile(target, "utf8"), "unrelated contents");
  assert.deepEqual(await readdir(directory), ["activity.jsonl"]);
});

test("existing data and journal paths must remain private", async (t) => {
  const directory = await temporaryDirectory(t, "codex-mods-journal-modes-");
  await chmod(directory, 0o755);
  await assert.rejects(appendJournalEntry(directory, { event: "SessionStart" }), /group or other access/);
  await assert.rejects(readJournalEntries(directory), /group or other access/);
  assert.deepEqual(await readdir(directory), []);
  await chmod(directory, 0o700);
  await appendJournalEntry(directory, { event: "SessionStart" });
  const journal = join(directory, "activity.jsonl");
  assert.equal((await lstat(journal)).mode & 0o777, 0o600);
  await chmod(journal, 0o644);
  await assert.rejects(appendJournalEntry(directory, { event: "SessionStart" }), /group or other access/);
  await assert.rejects(readJournalEntries(directory), /group or other access/);
});

test("journal retries a normal writer lock and cleans up its own lock", async (t) => {
  const directory = await temporaryDirectory(t, "codex-mods-journal-lock-");
  const lock = join(directory, ".activity-journal.lock");
  await mkdir(lock, { mode: 0o700 });
  const release = new Promise((resolve, reject) => setTimeout(() => rm(lock, { recursive: true }).then(resolve, reject), 30));
  await Promise.all([appendJournalEntry(directory, { event: "SessionStart" }), release]);
  assert.deepEqual(await readdir(directory), ["activity.jsonl"]);
});

test("reports create no files and give a bounded busy error for a held lock", async (t) => {
  const directory = await temporaryDirectory(t, "codex-mods-report-lock-");
  assert.deepEqual(await readJournalEntries(directory), []);
  assert.deepEqual(await readdir(directory), []);
  const lock = join(directory, ".activity-journal.lock");
  await mkdir(lock, { mode: 0o700 });
  await assert.rejects(readJournalEntries(directory), /busy; retry/);
  assert.deepEqual(await readdir(directory), [".activity-journal.lock"]);
});

function fullJournal() {
  const line = `${JSON.stringify({ recordedAt: "2026-10-22T12:00:00.000Z", event: "PreToolUse", tool: "seed" })}\n`;
  const count = Math.floor(MAX_JOURNAL_BYTES / Buffer.byteLength(line));
  return { text: line.repeat(count), count };
}

test("reports remain consistent while concurrent writers rotate the journal", async (t) => {
  const directory = await temporaryDirectory(t, "codex-mods-report-rotate-");
  const seed = fullJournal();
  await writeFile(join(directory, "activity.jsonl"), seed.text, { mode: 0o600 });
  const writes = Promise.all(Array.from({ length: 8 }, (_, index) => appendJournalEntry(
    directory, { event: "PreToolUse", tool: `new_${index}_${"x".repeat(200)}` },
  )));
  const reports = Promise.all(Array.from({ length: 4 }, async () => {
    const entries = await readJournalEntries(directory);
    assert.equal(entries.filter((entry) => entry.tool === "seed").length, seed.count);
    const newTools = entries.filter((entry) => entry.tool !== "seed").map((entry) => entry.tool);
    assert.equal(new Set(newTools).size, newTools.length);
    assert.ok(newTools.length <= 8);
  }));
  await Promise.all([writes, reports]);
  assert.equal((await readJournalEntries(directory)).length, seed.count + 8);
  for (const name of ["activity.jsonl", "activity.previous.jsonl"]) {
    assert.ok((await lstat(join(directory, name))).size <= MAX_JOURNAL_BYTES);
  }
});

test("rotation refuses a hard-linked archive and releases its lock", async (t) => {
  const parent = await temporaryDirectory(t, "codex-mods-journal-archive-link-");
  const directory = join(parent, "data");
  await mkdir(directory, { mode: 0o700 });
  await writeFile(join(directory, "activity.jsonl"), fullJournal().text, { mode: 0o600 });
  const target = join(parent, "unrelated");
  await writeFile(target, "unrelated contents", { mode: 0o600 });
  await link(target, join(directory, "activity.previous.jsonl"));
  await assert.rejects(appendJournalEntry(directory, { event: "PreToolUse", tool: "x".repeat(256) }), /hard links/);
  assert.equal(await readFile(target, "utf8"), "unrelated contents");
  await assert.rejects(lstat(join(directory, ".activity-journal.lock")), /ENOENT/);
});


test("journal refuses a symlinked journal file without changing its target", async (t) => {
  const parent = await temporaryDirectory(t, "codex-mods-journal-file-symlink-");
  const directory = join(parent, "data");
  await mkdir(directory, { mode: 0o700 });
  const target = join(parent, "unrelated");
  await writeFile(target, "unrelated contents", { mode: 0o600 });
  await symlink(target, join(directory, "activity.jsonl"));
  await assert.rejects(appendJournalEntry(directory, { event: "SessionStart" }), /symbolic/);
  await assert.rejects(readJournalEntries(directory), /symbolic/);
  assert.equal(await readFile(target, "utf8"), "unrelated contents");
});
