import { createHash } from "node:crypto";
import { lstat, mkdir, opendir, rmdir, unlink } from "node:fs/promises";
import { isAbsolute, join, parse, resolve, sep } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { appendJournalEntry, prepareDataDirectory, readJournalEntries, summarizeJournal } from "./journal.mjs";
import { recordWindowsMetadata, readWindowsMetadata, pruneWindowsMetadata } from './windows-state.mjs';

// This is an opt-in storage primitive, not a hook or a host event subscription.
// The caller selects the data directory and supplies trusted scope identifiers.
const STATE_DIRECTORY = "metadata-state-v1";
const ROOT_LOCK = ".state.lock";
const SCOPE_PATTERN = /^[a-f0-9]{64}$/;
export const MAX_STATE_SCOPES = 64;
const JOURNAL_FILES = new Set(["activity.jsonl", "activity.previous.jsonl"]);

function assertPlatform() {
  if (process.platform === "win32") throw new Error("Windows state storage requires a reviewed ACL implementation");
}

function plainRecord(value, allowed, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)
    || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new Error(`${label} must be a plain object`);
  for (const key of Reflect.ownKeys(value)) {
    if (!allowed.includes(key) || !Object.hasOwn(Object.getOwnPropertyDescriptor(value, key), "value")) {
      throw new Error(`${label} contains an unsupported field`);
    }
  }
}

export function metadataScopeKey(scope) {
  plainRecord(scope, ["projectId", "sessionId"], "state scope");
  for (const key of ["projectId", ...(scope.sessionId === undefined ? [] : ["sessionId"])]) {
    if (typeof scope[key] !== "string" || scope[key].length === 0 || scope[key].length > 4096 || /\p{Cc}/u.test(scope[key])) {
      throw new Error("state scope identifiers must be bounded non-empty strings without control characters");
    }
  }
  // Hashing avoids raw paths/identifiers on disk; it does not anonymize them.
  return createHash("sha256").update(JSON.stringify(["metadata-state-v1", scope.projectId, scope.sessionId ?? null])).digest("hex");
}

function assertPrivate(info, directory) {
  if (info.isSymbolicLink()) throw new Error("state paths must not contain symbolic links");
  if (directory ? !info.isDirectory() : !info.isFile()) throw new Error("state path has an unexpected file type");
  if (!directory && info.nlink !== 1) throw new Error("state files must not have hard links");
  if (typeof process.getuid === "function" && info.uid !== process.getuid()) throw new Error("state paths must be owned by the current user");
  if ((info.mode & 0o077) !== 0) throw new Error("state paths must not grant group or other access");
}

async function inspectDirectory(path) {
  if (typeof path !== "string" || !isAbsolute(path) || path.length > 4096 || /\p{Cc}/u.test(path)) {
    throw new Error("state data directory must be an absolute bounded path without control characters");
  }
  const absolute = resolve(path);
  const root = parse(absolute).root;
  let cursor = root;
  for (const part of absolute.slice(root.length).split(sep).filter(Boolean)) {
    cursor = join(cursor, part);
    let info;
    try { info = await lstat(cursor); } catch (error) {
      if (error?.code === "ENOENT") return false;
      throw error;
    }
    if (info.isSymbolicLink()) throw new Error("state paths must not contain symbolic links");
    if (!info.isDirectory()) throw new Error("state path must be a directory");
  }
  assertPrivate(await lstat(absolute), true);
  return true;
}

async function stateRoot(input, create = false) {
  assertPlatform();
  if (create) {
    const parent = await prepareDataDirectory(input);
    return prepareDataDirectory(join(parent, STATE_DIRECTORY));
  }
  if (!await inspectDirectory(input)) return null;
  const root = join(resolve(input), STATE_DIRECTORY);
  return await inspectDirectory(root) ? root : null;
}

async function scopeDirectories(root) {
  const names = [];
  const directory = await opendir(root);
  for await (const entry of directory) {
    if (entry.name === ROOT_LOCK) continue;
    if (!SCOPE_PATTERN.test(entry.name)) throw new Error("state directory contains an unexpected entry");
    assertPrivate(await lstat(join(root, entry.name)), true);
    names.push(entry.name);
    if (names.length > MAX_STATE_SCOPES) throw new Error("state scope limit exceeded");
  }
  return names;
}

async function withStateLock(root, action) {
  const path = join(root, ROOT_LOCK);
  let acquired = false;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      await mkdir(path, { mode: 0o700 });
      acquired = true;
      break;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      try { assertPrivate(await lstat(path), true); } catch (inspectionError) {
        if (inspectionError?.code !== "ENOENT") throw inspectionError;
      }
      await delay(10);
    }
  }
  if (!acquired) throw new Error("metadata state is busy; inspect a stale lock only after stopping writers");
  try { return await action(); } finally { await rmdir(path); }
}

export async function recordMetadataEvent(dataDirectory, scope, metadata, now = () => new Date()) {
  const key = metadataScopeKey(scope);
  // Reject the full host envelope before any filesystem effects. Only this
  // allowlist crosses the storage boundary; the journal checks value semantics.
  plainRecord(metadata, ["event", "tool", "decision"], "state metadata");
  if (process.platform === 'win32') return recordWindowsMetadata(dataDirectory, key, metadata, now);
  const root = await stateRoot(dataDirectory, true);
  await withStateLock(root, async () => {
    const names = await scopeDirectories(root);
    if (!names.includes(key) && names.length === MAX_STATE_SCOPES) throw new Error("state scope limit reached; prune old state explicitly");
    await appendJournalEntry(join(root, key), metadata, now);
  });
}

function snapshot(entries) {
  return {
    version: 1,
    revision: createHash("sha256").update(JSON.stringify(entries)).digest("hex"),
    ...summarizeJournal(entries),
    retention: "Counts cover only the two retained journal files, not lifetime activity.",
  };
}

export async function readMetadataState(dataDirectory, scope, options = {}) {
  plainRecord(options, ['signal', 'timeoutMs'], 'state read options');
  if (options.signal !== undefined && !(options.signal instanceof AbortSignal)) throw new Error('state read signal must be an AbortSignal');
  if (options.timeoutMs !== undefined && (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 100 || options.timeoutMs > 15000)) throw new Error('state read deadline must be 100–15000 ms');
  options.signal?.throwIfAborted();
  const key = metadataScopeKey(scope);
  if (process.platform === 'win32') return snapshot(await readWindowsMetadata(dataDirectory, key, options));
  const root = await stateRoot(dataDirectory);
  if (root === null || !await inspectDirectory(join(root, key))) return snapshot([]);
  try { return snapshot(await readJournalEntries(join(root, key))); } catch (error) {
    // An explicitly requested prune may remove the scope while it is read.
    if (error?.code === "ENOENT") return snapshot([]);
    throw error;
  }
}

// Polling is bounded and closes with the consuming iterator. It does not spawn
// a daemon, make model calls, or turn unobserved host events into observations.
export async function* observeMetadataState(dataDirectory, scope, options = {}) {
  plainRecord(options, ["intervalMs", "durationMs", "signal"], "state observer options");
  const { intervalMs = 250, durationMs = 10000, signal } = options;
  if (!Number.isInteger(intervalMs) || intervalMs < 100 || intervalMs > 5000
    || !Number.isInteger(durationMs) || durationMs < 1 || durationMs > 30000) {
    throw new Error("state observation requires an interval of 100–5000 ms and duration of 1–30000 ms");
  }
  if (signal !== undefined && !(signal instanceof AbortSignal)) throw new Error("state observation signal must be an AbortSignal");
  const deadline = performance.now() + durationMs;
  let revision;
  while (!signal?.aborted && performance.now() < deadline) {
    let current;
    try {
      current = await readMetadataState(dataDirectory, scope, { signal, timeoutMs: Math.max(100, Math.min(15000, Math.floor(deadline - performance.now()))) });
    } catch (error) { if (signal?.aborted) return; throw error; }
    if (signal?.aborted || performance.now() >= deadline) return;
    if (current.revision !== revision) {
      revision = current.revision;
      yield current;
    }
    const remaining = deadline - performance.now();
    if (remaining <= 0) return;
    try { await delay(Math.min(intervalMs, remaining), undefined, { signal }); } catch (error) {
      if (error?.name === "AbortError") return;
      throw error;
    }
  }
}

// Explicit retention only: never follows links, recursively deletes directories,
// steals locks, or deletes unknown files. Nonempty locked scopes are refused.
export async function pruneMetadataState(dataDirectory, { before } = {}) {
  if (!(before instanceof Date) || Number.isNaN(before.valueOf())) throw new Error("state pruning requires an explicit valid cutoff date");
  if (process.platform === 'win32') return pruneWindowsMetadata(dataDirectory, before);
  const root = await stateRoot(dataDirectory);
  if (root === null) return { removedScopes: 0 };
  return withStateLock(root, async () => {
    let removedScopes = 0;
    for (const key of await scopeDirectories(root)) {
      const path = join(root, key);
      const files = [];
      for await (const file of await opendir(path)) {
        if (!JOURNAL_FILES.has(file.name)) throw new Error("state pruning refuses locks or unexpected files");
        assertPrivate(await lstat(join(path, file.name)), false);
        files.push(file.name);
      }
      const entries = await readJournalEntries(path);
      if (entries.some((entry) => Date.parse(entry.recordedAt) >= before.valueOf())) continue;
      for (const file of files) await unlink(join(path, file));
      await rmdir(path);
      removedScopes += 1;
    }
    return { removedScopes };
  });
}
