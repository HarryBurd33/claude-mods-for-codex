import { constants } from 'node:fs';
import { lstat, open, realpath } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';

const MAX_BYTES = 1024 * 1024, MAX_LINES = 4096, MAX_LINE = 256 * 1024;
const unavailable = reason => ({ available: false, source: 'selected-codex-exec-jsonl', reason });
function invalid() { throw new Error('Invalid or unsupported observation export'); }
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);

// No text scraping, identifier correlation, inferred missing post-hooks or side
// effects. Counts are records in one explicitly selected export, not executions
// certified by this process. Raw command/output/error/message fields are ignored.
export function summarizeExecObservations(text) {
  if (typeof text !== 'string' || Buffer.byteLength(text) > MAX_BYTES) invalid();
  const lines = text.split('\n');
  if (lines.length > MAX_LINES) invalid();
  let thread, streamStatus = 'unknown', ignoredRecords = 0;
  const turns = { started: 0, completed: 0, failed: 0, streamErrors: 0 };
  const commands = { completed: 0, failed: 0, declined: 0 };
  const exits = { zero: 0, nonzero: 0, unavailable: 0 };
  for (const line of lines) {
    if (!line.trim()) continue;
    if (Buffer.byteLength(line) > MAX_LINE) invalid();
    let event;
    try { event = JSON.parse(line); } catch { invalid(); }
    if (!object(event) || typeof event.type !== 'string') invalid();
    if (event.type === 'thread.started') {
      // A repeated header is ambiguous even when it claims the same thread.
      if (thread !== undefined || typeof event.thread_id !== 'string' || !event.thread_id || event.thread_id.length > 4096) invalid();
      thread = event.thread_id;
      continue;
    }
    if (thread === undefined) invalid();
    if (event.type === 'turn.started') { turns.started++; streamStatus = 'unfinished'; }
    else if (event.type === 'turn.completed') { turns.completed++; streamStatus = 'completed'; }
    else if (event.type === 'turn.failed') {
      if (!object(event.error) || typeof event.error.message !== 'string') invalid();
      turns.failed++; streamStatus = 'failed';
    } else if (event.type === 'error') {
      if (typeof event.message !== 'string') invalid();
      turns.streamErrors++; streamStatus = 'stream-error';
    } else if (event.type === 'item.completed' && object(event.item) && event.item.type === 'command_execution') {
      const { status, exit_code: code } = event.item;
      if (typeof status !== 'string' || !Object.hasOwn(commands, status) || !(code === null || Number.isInteger(code) && code >= -2147483648 && code <= 2147483647)) invalid();
      commands[status]++;
      exits[code === null ? 'unavailable' : code === 0 ? 'zero' : 'nonzero']++;
    } else {
      if (['item.started', 'item.updated', 'item.completed'].includes(event.type) && (!object(event.item) || typeof event.item.type !== 'string')) invalid();
      ignoredRecords++;
    }
  }
  if (thread === undefined) return unavailable('One thread.started header is required. No records were inferred.');
  return {
    available: true, source: 'selected-codex-exec-jsonl', turns, commands, exits, streamStatus, ignoredRecords,
    cancellation: 'unavailable',
    semantics: 'Record counts from the selected export only; command status and exit buckets describe the same records and must not be added together. Not live hooks or unique executions.',
    limits: 'No source authenticity or completeness attestation. Missing records are not success, failure or cancellation. A nonzero exit is not a tool invocation error; declined is not proof of user cancellation. No raw text, IDs, paths, usage or billing returned. No journal writes or model calls.',
  };
}

function safeFile(info) {
  if (!info.isFile() || info.nlink !== 1n || (info.mode & 0o077n) !== 0n || typeof process.getuid === 'function' && info.uid !== BigInt(process.getuid()) || info.size > BigInt(MAX_BYTES)) invalid();
}
function same(a, b) {
  for (const key of ['dev', 'ino', 'mode', 'uid', 'nlink', 'size', 'mtimeNs', 'ctimeNs']) if (a[key] !== b[key]) invalid();
}

export async function readSelectedObservations(input, options = {}) {
  // Do not admit this new entrypoint to Windows private IO through a generic
  // reader. Its OS/authority review remains deferred; pure summaries are portable.
  if (process.platform === 'win32') return unavailable('Windows observation file reads are unavailable pending platform review.');
  try {
    const { signal } = options;
    if (signal !== undefined && !(signal instanceof AbortSignal)) invalid();
    signal?.throwIfAborted();
    if (typeof input !== 'string' || !isAbsolute(input) || input.length > 4096 || /\p{Cc}/u.test(input)) invalid();
    const path = resolve(input);
    if (await realpath(path) !== path) invalid();
    const before = await lstat(path, { bigint: true }); safeFile(before);
    const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    let text;
    try {
      const info = await handle.stat({ bigint: true }); safeFile(info); same(before, info);
      const buffer = Buffer.alloc(MAX_BYTES + 1); let total = 0;
      while (total <= MAX_BYTES) {
        signal?.throwIfAborted();
        const { bytesRead } = await handle.read(buffer, total, MAX_BYTES + 1 - total, total);
        if (!bytesRead) break;
        total += bytesRead;
      }
      if (total > MAX_BYTES) invalid();
      same(info, await handle.stat({ bigint: true }));
      same(info, await lstat(path, { bigint: true }));
      if (await realpath(path) !== path) invalid();
      signal?.throwIfAborted();
      text = new TextDecoder('utf-8', { fatal: true }).decode(buffer.subarray(0, total));
    } finally { await handle.close(); }
    return summarizeExecObservations(text);
  } catch {
    return unavailable('Selected observation export unavailable, changed, cancelled or invalid. Require a bounded private unlinked canonical file containing one JSONL thread. No content was returned.');
  }
}
