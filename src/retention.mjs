// Original MIT. Explicit POSIX CLI maintenance, never a hook or MCP action.
import { createHash } from 'node:crypto';
import { constants as flags } from 'node:fs';
import { lstat, mkdir, open, opendir, rmdir, unlink } from 'node:fs/promises';
import { isAbsolute, join, parse, relative, resolve, sep } from 'node:path';
import { MAX_JOURNAL_BYTES } from './constants.mjs';
import { parseJournalFiles } from './journal.mjs';
import { loadRuntimeSettings } from './runtime-settings.mjs';
import { metadataScopeKey } from './state.mjs';

const STATE = 'metadata-state-v1', ROOT_LOCK = '.state.lock', JOURNAL_LOCK = '.activity-journal.lock';
const JOURNALS = ['activity.previous.jsonl', 'activity.jsonl'];
const HEX = /^[a-f0-9]{64}$/;
const messages = {
  windows: 'Retention maintenance is unavailable on Windows pending separate review; no files accessed.',
  arguments: 'Retention requires --settings ABSOLUTE_PRIVATE_FILE and --before canonical UTC timestamp; cleanup also requires --confirm-preview SHA256. Duplicate or unknown options are refused.',
  cutoff: 'Retention cutoff must be an explicit canonical UTC timestamp with milliseconds, no later than now.',
  settings: 'Retention requires valid reviewed private settings outside a disjoint selected project, with an explicit project or session scope.',
  unsafe: 'Retention refuses linked, special, public, oversized, malformed or unexpected storage. No automatic retry.',
  busy: 'Retention is busy; stop relevant writers before maintenance. Existing locks are never removed.',
  changed: 'Retention selection or data changed; inspect a fresh preview. No automatic retry.',
  confirm: 'Retention cleanup requires the matching eligible preview fingerprint; it is not an approval of a native tool call.',
  unavailable: 'Retention storage is unavailable. Inspect selected data; do not retry cleanup automatically.',
};
class RetentionError extends Error {
  constructor(code) { super(messages[code]); this.name = 'RetentionError'; }
}
const fail = code => { throw new RetentionError(code); };
const hash = value => createHash('sha256').update(value).digest('hex');
const directoryId = s => [s.dev, s.ino, s.birthtimeNs, s.uid, s.mode].join(':');
const fileId = s => [directoryId(s), s.nlink, s.size, s.mtimeNs, s.ctimeNs].join(':');
function privateObject(s, directory) {
  if (s.isSymbolicLink() || !(directory ? s.isDirectory() : s.isFile()) ||
      (!directory && s.nlink !== 1n) || (s.mode & 0o077n) !== 0n ||
      (process.getuid && s.uid !== BigInt(process.getuid()))) fail('unsafe');
}
async function exists(path) {
  try { return await lstat(path, { bigint: true }); }
  catch (e) { if (e.code === 'ENOENT') return null; throw e; }
}
async function noLinks(path) {
  let cursor = parse(path).root;
  for (const part of path.slice(cursor.length).split(sep).filter(Boolean)) {
    cursor = join(cursor, part);
    const s = await exists(cursor);
    if (s === null) return false;
    if (s.isSymbolicLink() || !s.isDirectory()) fail('unsafe');
  }
  return true;
}
async function pinDirectory(path, pins) {
  if (!await noLinks(path)) return null;
  const before = await exists(path); if (before === null) return null;
  privateObject(before, true);
  const handle = await open(path, flags.O_RDONLY | flags.O_DIRECTORY | flags.O_NOFOLLOW | flags.O_NONBLOCK);
  pins.push(handle);
  const s = await handle.stat({ bigint: true }); privateObject(s, true);
  if (directoryId(s) !== directoryId(before)) fail('changed');
  return { path, handle, id: directoryId(s) };
}
async function verifyDirectory(pin) {
  if (!await noLinks(pin.path)) fail('changed');
  const s = await exists(pin.path); if (s === null) fail('changed');
  privateObject(s, true);
  if (directoryId(s) !== pin.id || directoryId(await pin.handle.stat({ bigint: true })) !== pin.id) fail('changed');
}
async function checkLock(path, owned) {
  const s = await exists(path);
  if (owned) {
    if (s === null || directoryId(s) !== owned.id) fail('changed');
    privateObject(s, true);
  } else if (s !== null) fail('busy');
}
async function namesInScope(path, ownLock) {
  const names = [];
  for await (const e of await opendir(path)) {
    if (e.name === JOURNAL_LOCK && ownLock) continue;
    if (!JOURNALS.includes(e.name) || names.length >= 2) fail(e.name === JOURNAL_LOCK ? 'busy' : 'unsafe');
    names.push(e.name);
  }
  return names.sort();
}
async function readJournal(path, pins) {
  const before = await lstat(path, { bigint: true }); privateObject(before, false);
  if (before.size > BigInt(MAX_JOURNAL_BYTES)) fail('unsafe');
  const handle = await open(path, flags.O_RDONLY | flags.O_NOFOLLOW | flags.O_NONBLOCK);
  pins.push(handle);
  const s = await handle.stat({ bigint: true }); privateObject(s, false);
  if (fileId(s) !== fileId(before)) fail('changed');
  const buffer = Buffer.alloc(MAX_JOURNAL_BYTES + 1);
  try {
    let total = 0;
    while (total < buffer.length) {
      const { bytesRead } = await handle.read(buffer, total, buffer.length - total, total);
      if (!bytesRead) break;
      total += bytesRead;
    }
    if (total > MAX_JOURNAL_BYTES) fail('unsafe');
    if (BigInt(total) !== s.size || fileId(await handle.stat({ bigint: true })) !== fileId(s)) fail('changed');
    let entries;
    try { entries = parseJournalFiles([new TextDecoder('utf-8', { fatal: true }).decode(buffer.subarray(0, total))]); }
    catch { fail('unsafe'); }
    return { path, handle, id: fileId(s), digest: hash(buffer.subarray(0, total)), bytes: total, entries };
  } finally { buffer.fill(0); }
}
async function verifyFile(file) {
  const s = await exists(file.path); if (s === null) fail('changed');
  privateObject(s, false);
  if (fileId(s) !== file.id || fileId(await file.handle.stat({ bigint: true })) !== file.id) fail('changed');
}
function overlaps(a, b) {
  const inside = (root, path) => { const r = relative(root, path); return r === '' || (!isAbsolute(r) && r !== '..' && !r.startsWith(`..${sep}`)); };
  return inside(a, b) || inside(b, a);
}
async function selection(options, cleanup) {
  // This guard precedes even settings-path validation or filesystem operations.
  if (process.platform === 'win32') fail('windows');
  const allowed = ['settings', 'before', ...(cleanup ? ['confirmPreview'] : [])];
  if (!options || Object.getPrototypeOf(options) !== Object.prototype ||
      Reflect.ownKeys(options).some(k => !allowed.includes(k) || !Object.hasOwn(Object.getOwnPropertyDescriptor(options, k), 'value'))) fail('arguments');
  const { settings, before, confirmPreview } = options;
  if (typeof settings !== 'string' || !isAbsolute(settings) || settings.length > 4096 || /\p{Cc}/u.test(settings) || resolve(settings) !== settings) fail('arguments');
  if (typeof before !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(before) ||
      !Number.isFinite(Date.parse(before)) || new Date(before).toISOString() !== before || Date.parse(before) > Date.now()) fail('cutoff');
  if (cleanup && (typeof confirmPreview !== 'string' || !HEX.test(confirmPreview))) fail('confirm');
  let config, info;
  try {
    info = await lstat(settings, { bigint: true });
    config = await loadRuntimeSettings(settings);
    if (!config || !['project', 'session'].includes(config.stateScope) ||
        (config.stateScope === 'session' && !config.sessionId) || overlaps(config.projectRoot, config.dataDirectory) ||
        fileId(await lstat(settings, { bigint: true })) !== fileId(info)) fail('settings');
  } catch { fail('settings'); }
  // Bind the complete reviewed settings, its identity, location, and selection.
  // This fingerprint is a conflict check, not a secret or human attestation.
  const binding = hash(JSON.stringify([resolve(settings), fileId(info), config]));
  return { config, binding, before, confirmPreview, key: metadataScopeKey({ projectId: config.projectRoot,
    ...(config.stateScope === 'session' ? { sessionId: config.sessionId } : {}) }) };
}
async function withSnapshot(selected, action, locks = {}) {
  const pins = [];
  try {
    const data = await pinDirectory(selected.config.dataDirectory, pins);
    const root = data && await pinDirectory(join(data.path, STATE), pins);
    if (!root) return await action({ status: 'absent', directories: [], files: [], records: 0, bytes: 0 });
    await checkLock(join(root.path, ROOT_LOCK), locks.root);
    const scope = await pinDirectory(join(root.path, selected.key), pins);
    if (!scope) {
      await verifyDirectory(data); await verifyDirectory(root);
      await checkLock(join(root.path, ROOT_LOCK), locks.root);
      return await action({ status: 'absent', directories: [data, root], files: [], records: 0, bytes: 0 });
    }
    await checkLock(join(scope.path, JOURNAL_LOCK), locks.journal);
    const names = await namesInScope(scope.path, locks.journal);
    const files = [];
    for (const name of names) files.push(await readJournal(join(scope.path, name), pins));
    const times = files.flatMap(f => f.entries.map(e => Date.parse(e.recordedAt)));
    const snapshot = { status: times.every(t => t < Date.parse(selected.before)) ? 'eligible' : 'retained',
      directories: [data, root, scope], files, records: times.length, bytes: files.reduce((n, f) => n + f.bytes, 0),
      oldest: times.length ? new Date(times.reduce((a, b) => Math.min(a, b))).toISOString() : null,
      newest: times.length ? new Date(times.reduce((a, b) => Math.max(a, b))).toISOString() : null };
    for (const d of snapshot.directories) await verifyDirectory(d);
    for (const f of files) await verifyFile(f);
    if (JSON.stringify(names) !== JSON.stringify(await namesInScope(scope.path, locks.journal))) fail('changed');
    await checkLock(join(scope.path, JOURNAL_LOCK), locks.journal);
    await checkLock(join(root.path, ROOT_LOCK), locks.root);
    snapshot.confirmation = snapshot.status === 'eligible' ? hash(JSON.stringify(['selected-retention-v1', selected.binding,
      selected.key, selected.before, snapshot.directories.map(d => d.id), files.map(f => [f.id, f.digest])])) : null;
    return await action(snapshot);
  } finally { for (const h of pins.reverse()) await h.close(); }
}
function previewResult(selected, s) {
  return { version: 1, scope: selected.config.stateScope, status: s.status, before: selected.before,
    records: s.records, bytes: s.bytes, journalFiles: s.files.length, oldestRecordedAt: s.oldest ?? null,
    newestRecordedAt: s.newest ?? null, confirmPreview: s.confirmation ?? null,
    limits: 'Entire selected scope only; every retained record must precede the cutoff. Not lifetime totals. Preview creates no storage. Fingerprint is not approval or authentication.' };
}
async function ownLock(path, action) {
  try { await mkdir(path, { mode: 0o700 }); }
  catch (e) { if (e.code === 'EEXIST') fail('busy'); throw e; }
  const s = await lstat(path, { bigint: true }); privateObject(s, true);
  const owned = { id: directoryId(s) };
  try { return await action(owned); }
  finally { await checkLock(path, owned); await rmdir(path); }
}
function sanitized(error) { return error instanceof RetentionError ? error : new RetentionError('unavailable'); }
export async function previewRetention(options) {
  try { const selected = await selection(options, false); return await withSnapshot(selected, s => previewResult(selected, s)); }
  catch (e) { throw sanitized(e); }
}
export async function cleanupRetention(options) {
  let removed = 0, started = false, scopeRemoved = false;
  try {
    const selected = await selection(options, true);
    return await withSnapshot(selected, async initial => {
      if (initial.status !== 'eligible' || initial.confirmation !== selected.confirmPreview) fail('confirm');
      const [, root, scope] = initial.directories;
      return ownLock(join(root.path, ROOT_LOCK), rootLock => ownLock(join(scope.path, JOURNAL_LOCK), async journalLock => {
        return withSnapshot(selected, async fresh => {
          if (fresh.status !== 'eligible' || fresh.confirmation !== selected.confirmPreview) fail('changed');
          // Re-read settings before the first unlink, not just the initial CLI load.
          if ((await selection(options, true)).binding !== selected.binding) fail('changed');
          started = true;
          for (const f of fresh.files) {
            for (const d of fresh.directories) await verifyDirectory(d);
            await verifyFile(f);
            await unlink(f.path);
            removed++;
          }
          return { version: 1, scope: selected.config.stateScope, removedJournalFiles: removed, removedRecords: fresh.records };
        }, { root: rootLock, journal: journalLock });
      }).then(async result => {
        // Only the lock we created was removed. A new file/lock makes rmdir fail;
        // it is never recursively deleted. Cooperating state writers still wait.
        await verifyDirectory(scope); await rmdir(scope.path); scopeRemoved = true;
        return { ...result, removedScopes: 1, limits: 'Selected retained metadata only. Future writes may recreate it. No secure erasure or crash-atomic deletion guarantee.' };
      }));
    });
  } catch (e) {
    if (started) throw new Error(`Retention cleanup did not complete cleanly; removed journal files: ${removed}; scope removed: ${scopeRemoved}. Inspect selected data after stopping writers; do not retry automatically.`);
    throw sanitized(e);
  }
}

export async function runRetentionCli(command, args, streams) {
  // Refuse Windows before parsing a path or loading settings.
  if (process.platform === 'win32') fail('windows');
  const allowed = new Set(['--settings', '--before', ...(command === 'retention-cleanup' ? ['--confirm-preview'] : [])]);
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i], name = flag === '--confirm-preview' ? 'confirmPreview' : flag?.slice(2);
    if (!allowed.has(flag) || Object.hasOwn(options, name) || typeof args[i + 1] !== 'string') fail('arguments');
    options[name] = args[i + 1];
  }
  const result = command === 'retention-preview' ? await previewRetention(options) : await cleanupRetention(options);
  streams.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
