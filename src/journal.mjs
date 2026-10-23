import { constants as fsConstants } from "node:fs";
import { lstat, mkdir, open, rename, rm, rmdir, stat } from "node:fs/promises";
import { dirname, isAbsolute, join, parse, resolve, sep } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { MAX_JOURNAL_BYTES, MAX_JOURNAL_LINE_BYTES, KNOWN_EVENTS, OBSERVER_EVENTS } from "./constants.mjs";

const JOURNAL_NAME = "activity.jsonl";
const ARCHIVE_NAME = "activity.previous.jsonl";
const LOCK_NAME = ".activity-journal.lock";
const RETRY_ATTEMPTS = 50;

function assertPrivateOwnership(info, label) {
  if (typeof process.getuid === "function" && info.uid !== process.getuid()) {
    throw new Error(`${label} must be owned by the current user`);
  }
  if ((info.mode & 0o077) !== 0) throw new Error(`${label} must not grant group or other access`);
}

function assertJournalFile(info) {
  if (!info.isFile()) throw new Error("journal must be a regular file");
  if (info.nlink !== 1) throw new Error("journal must not have hard links");
  assertPrivateOwnership(info, "journal file");
}

async function existingPathIsSafe(path) {
  try {
    const info = await lstat(path);
    if (info.isSymbolicLink()) throw new Error("journal paths must not contain symbolic links");
    return info;
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function assertNoSymlinkComponents(path) {
  const absolute = resolve(path);
  const root = parse(absolute).root;
  const parts = absolute.slice(root.length).split(sep).filter(Boolean);
  let cursor = root;
  for (const part of parts) {
    cursor = join(cursor, part);
    await existingPathIsSafe(cursor);
  }
}

export async function prepareDataDirectory(input) {
  if (process.platform === "win32") throw new Error("Windows journal storage requires a reviewed ACL implementation");
  if (typeof input !== "string" || input.length === 0 || input.length > 4096 || /\p{Cc}/u.test(input)) {
    throw new Error("data directory must be a non-empty path without control characters");
  }
  if (!isAbsolute(input)) throw new Error("data directory must be absolute");
  const dataDirectory = resolve(input);
  await assertNoSymlinkComponents(dirname(dataDirectory));
  await mkdir(dataDirectory, { recursive: true, mode: 0o700 });
  await assertNoSymlinkComponents(dataDirectory);
  const info = await stat(dataDirectory);
  if (!info.isDirectory()) throw new Error("data directory must be a directory");
  assertPrivateOwnership(info, "data directory");
  return dataDirectory;
}

async function openDataDirectoryForRead(input) {
  if (typeof input !== "string" || input.length === 0 || input.length > 4096 || /\p{Cc}/u.test(input)) {
    throw new Error("data directory must be a non-empty path without control characters");
  }
  if (!isAbsolute(input)) throw new Error("data directory must be absolute");
  const dataDirectory = resolve(input);
  await assertNoSymlinkComponents(dataDirectory);
  const info = await stat(dataDirectory);
  if (!info.isDirectory()) throw new Error("data directory must be a directory");
  assertPrivateOwnership(info, "data directory");
  return dataDirectory;
}

async function withLock(dataDirectory, action) {
  const lockPath = join(dataDirectory, LOCK_NAME);
  let acquired = false;
  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt += 1) {
    try {
      await mkdir(lockPath, { mode: 0o700 });
      acquired = true;
      break;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      const info = await existingPathIsSafe(lockPath);
      if (info !== null) {
        if (!info.isDirectory()) throw new Error("journal lock must be a directory");
        assertPrivateOwnership(info, "journal lock");
      }
      await delay(10);
    }
  }
  if (!acquired) throw new Error("activity journal is busy");
  try {
    return await action();
  } finally {
    await rmdir(lockPath);
  }
}

function validateMetadata(metadata) {
  if (metadata === null || Array.isArray(metadata) || typeof metadata !== "object") throw new Error("journal metadata must be an object");
  const allowed = new Set(["event", "tool", "decision"]);
  for (const key of Object.keys(metadata)) if (!allowed.has(key)) throw new Error("journal metadata contains a forbidden field");
  if (!KNOWN_EVENTS.has(metadata.event)) throw new Error("journal event is invalid");
  if (OBSERVER_EVENTS.has(metadata.event) && (metadata.tool !== undefined || metadata.decision !== undefined)) throw new Error("observer metadata must contain only the event name");
  if (metadata.tool !== undefined) {
    const reserved = new Set(["__proto__", "prototype", "constructor"]);
    if (typeof metadata.tool !== "string" || !/^[A-Za-z0-9_.:-]{1,256}$/.test(metadata.tool) || reserved.has(metadata.tool.toLowerCase())) {
      throw new Error("journal tool identifier is invalid");
    }
  }
  if (metadata.decision !== undefined && metadata.decision !== "deny") throw new Error("journal decision is invalid");
  return metadata;
}

function validateStoredRecord(record) {
  if (record === null || Array.isArray(record) || typeof record !== "object") throw new Error("journal contains an invalid record");
  const allowed = new Set(["recordedAt", "event", "tool", "decision"]);
  for (const key of Object.keys(record)) if (!allowed.has(key)) throw new Error("journal contains a forbidden field");
  if (typeof record.recordedAt !== "string" || record.recordedAt.length > 64 || Number.isNaN(Date.parse(record.recordedAt))) {
    throw new Error("journal contains an invalid timestamp");
  }
  validateMetadata({
    event: record.event,
    ...(record.tool === undefined ? {} : { tool: record.tool }),
    ...(record.decision === undefined ? {} : { decision: record.decision }),
  });
  return record;
}

async function rotateIfNeeded(dataDirectory, lineBytes) {
  const currentPath = join(dataDirectory, JOURNAL_NAME);
  const archivePath = join(dataDirectory, ARCHIVE_NAME);
  const currentInfo = await existingPathIsSafe(currentPath);
  if (currentInfo !== null) assertJournalFile(currentInfo);
  if (currentInfo === null || currentInfo.size + lineBytes <= MAX_JOURNAL_BYTES) return currentPath;
  const archiveInfo = await existingPathIsSafe(archivePath);
  if (archiveInfo !== null) assertJournalFile(archiveInfo);
  if (archiveInfo !== null) await rm(archivePath, { force: true });
  await rename(currentPath, archivePath);
  return currentPath;
}

export function encodeJournalRecord(metadata, now = () => new Date()) {
  const record = { recordedAt: now().toISOString(), ...validateMetadata(metadata) };
  const line = `${JSON.stringify(record)}\n`;
  const lineBytes = Buffer.byteLength(line);
  if (lineBytes > MAX_JOURNAL_LINE_BYTES) throw new Error("journal record exceeds the size limit");
  return line;
}

export async function appendJournalEntry(dataDirectoryInput, metadata, now = () => new Date()) {
  const line = encodeJournalRecord(metadata, now);
  const lineBytes = Buffer.byteLength(line);
  const dataDirectory = await prepareDataDirectory(dataDirectoryInput);
  return withLock(dataDirectory, async () => {
    const currentPath = await rotateIfNeeded(dataDirectory, lineBytes);
    const handle = await open(
      currentPath,
      fsConstants.O_APPEND | fsConstants.O_CREAT | fsConstants.O_WRONLY | fsConstants.O_NOFOLLOW | fsConstants.O_NONBLOCK,
      0o600,
    );
    try {
      assertJournalFile(await handle.stat());
      await handle.writeFile(line, "utf8");
      await handle.sync();
    } finally {
      await handle.close();
    }
  });
}

async function journalSnapshot(dataDirectory) {
  const snapshot = [];
  for (const name of [ARCHIVE_NAME, JOURNAL_NAME]) {
    const path = join(dataDirectory, name);
    let info;
    try {
      info = await lstat(path, { bigint: true });
    } catch (error) {
      if (error?.code === "ENOENT") {
        snapshot.push(null);
        continue;
      }
      throw error;
    }
    // Convert only the ownership fields; retain nanosecond times for comparisons.
    if (info.isSymbolicLink()) throw new Error("journal paths must not contain symbolic links");
    assertJournalFile({
      isFile: () => info.isFile(), nlink: Number(info.nlink),
      uid: Number(info.uid), mode: Number(info.mode),
    });
    snapshot.push([info.dev, info.ino, info.size, info.mtimeNs, info.ctimeNs].join(":"));
  }
  return JSON.stringify(snapshot);
}

async function readJournalFile(path) {
  let handle;
  try {
    handle = await open(path, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW | fsConstants.O_NONBLOCK);
    const info = await handle.stat();
    assertJournalFile(info);
    if (info.size > MAX_JOURNAL_BYTES) throw new Error("journal exceeds the size limit");
    // Read at most one byte beyond the limit even if another process appends.
    const buffer = Buffer.alloc(MAX_JOURNAL_BYTES + 1);
    let total = 0;
    while (total < buffer.length) {
      const { bytesRead } = await handle.read(buffer, total, buffer.length - total, total);
      if (bytesRead === 0) break;
      total += bytesRead;
    }
    if (total > MAX_JOURNAL_BYTES) throw new Error("journal exceeds the size limit");
    return buffer.subarray(0, total).toString("utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return "";
    throw error;
  } finally {
    await handle?.close();
  }
}

export function parseJournalFiles(texts) {
  const entries = [];
  for (const text of texts) {
    for (const line of text.split("\n")) {
      if (line.length === 0) continue;
      let entry;
      try {
        entry = JSON.parse(line);
      } catch {
        throw new Error("journal contains malformed JSON");
      }
      entries.push(validateStoredRecord(entry));
    }
  }
  return entries;
}

export async function readJournalEntries(dataDirectoryInput) {
  if (process.platform === "win32") throw new Error("Windows journal storage requires a reviewed ACL implementation");
  const dataDirectory = await openDataDirectoryForRead(dataDirectoryInput);
  const lockPath = join(dataDirectory, LOCK_NAME);
  // Reports remain read-only. Retry if a cooperating writer holds its lock or
  // file identity/size/timestamps change while reading across a rotation.
  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt += 1) {
    if (await existingPathIsSafe(lockPath) !== null) {
      await delay(10);
      continue;
    }
    const before = await journalSnapshot(dataDirectory);
    let texts;
    let readError;
    try {
      texts = await Promise.all([ARCHIVE_NAME, JOURNAL_NAME].map((name) => readJournalFile(join(dataDirectory, name))));
    } catch (error) {
      readError = error;
    }
    const after = await journalSnapshot(dataDirectory);
    if (await existingPathIsSafe(lockPath) === null && before === after) {
      if (readError) throw readError;
      return parseJournalFiles(texts);
    }
    await delay(10);
  }
  throw new Error("activity journal is busy; retry the report");
}

export function summarizeJournal(entries) {
  const events = new Map();
  const tools = new Map();
  let denials = 0;
  for (const entry of entries) {
    if (typeof entry.event === "string") events.set(entry.event, (events.get(entry.event) || 0) + 1);
    if (typeof entry.tool === "string") tools.set(entry.tool, (tools.get(entry.tool) || 0) + 1);
    if (entry.decision === "deny") denials += 1;
  }
  return {
    records: entries.length,
    status: entries.length === 0 ? "no journal records" : "journal records summarized",
    denials,
    events: Object.fromEntries([...events].sort(([a], [b]) => a.localeCompare(b))),
    tools: Object.fromEntries([...tools].sort(([a], [b]) => a.localeCompare(b))),
  };
}
