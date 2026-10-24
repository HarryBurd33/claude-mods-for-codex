import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { chmod, link, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rename, rm, symlink, truncate, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import test from 'node:test';
import { previewRetention, cleanupRetention, runRetentionCli } from '../src/retention.mjs';
import { metadataScopeKey, recordMetadataEvent, readMetadataState } from '../src/state.mjs';
import { runCli } from '../src/cli.mjs';
import { MAX_JOURNAL_BYTES } from '../src/constants.mjs';

const posix = { skip: process.platform === 'win32' };
const old = () => new Date('2020-01-01T00:00:00.000Z');
const recent = () => new Date('2025-01-01T00:00:00.000Z');
const before = '2024-01-01T00:00:00.000Z';
async function fixture(t, mode = 'project') {
  const root = await mkdtemp(join(await realpath(tmpdir()), 'mods retention '));
  t.after(() => rm(root, { recursive: true, force: true }));
  const project = join(root, 'selected project'), data = join(root, 'private data'), settings = join(root, 'reviewed settings.json');
  await mkdir(project, { mode: 0o700 });
  await mkdir(join(project, '.git'), { mode: 0o700 });
  await writeFile(join(project, '.git/HEAD'), 'synthetic unchanged HEAD');
  await writeFile(join(project, '.git/index'), 'synthetic unchanged index');
  const config = { version: 1, projectRoot: project, dataDirectory: data, stateScope: mode,
    ...(mode === 'session' ? { sessionId: 'synthetic-private-session' } : {}) };
  await writeFile(settings, JSON.stringify(config), { mode: 0o600 });
  const scope = { projectId: project, ...(mode === 'session' ? { sessionId: config.sessionId } : {}) };
  const scopePath = join(data, 'metadata-state-v1', metadataScopeKey(scope));
  const options = { settings, before };
  return { root, project, data, settings, config, scope, scopePath, options,
    record: (s = scope, now = old) => recordMetadataEvent(data, s, { event: 'SessionStart' }, now) };
}
async function tree(path, directoryTimes = true) {
  const s = await lstat(path, { bigint: true });
  const base = [String(s.dev), String(s.ino), String(s.mode), String(s.size),
    s.isFile() || directoryTimes ? String(s.mtimeNs) : 'directory lock activity'];
  if (s.isFile()) return [...base, (await readFile(path)).toString('base64')];
  return [...base, await Promise.all((await readdir(path)).sort().map(async name => [name, await tree(join(path, name), directoryTimes)]))];
}
const confirmation = async f => ({ ...f.options, confirmPreview: (await previewRetention(f.options)).confirmPreview });
async function refused(action, pattern = /Retention/) {
  await assert.rejects(action, e => {
    assert.match(e.message, pattern); assert.doesNotMatch(e.message, /synthetic-private|mods retention|ENOENT|EACCES|ELOOP|onerror/); return true;
  });
}
async function copiedModule(t, root, name, transform) {
  let source = await readFile(new URL('../src/' + name, import.meta.url), 'utf8');
  source = transform(source);
  source = source.replace(/(["'])\.\/([^"']+)\1/g, (_, q, file) => JSON.stringify(new URL('../src/' + file, import.meta.url).href));
  const path = join(root, 'controlled-' + name); await writeFile(path, source, { flag: 'wx', mode: 0o600 });
  return { path, module: await import(pathToFileURL(path).href) };
}

test('retention preview creates no data, scope, plan or lock when selection is absent', posix, async t => {
  const f = await fixture(t), initial = await tree(f.root);
  const p = await previewRetention(f.options);
  assert.equal(p.status, 'absent'); assert.equal(p.confirmPreview, null); assert.equal(p.records, 0);
  assert.deepEqual(await tree(f.root), initial);
  await refused(() => cleanupRetention({ ...f.options, confirmPreview: 'a'.repeat(64) }));
  assert.deepEqual(await tree(f.root), initial);
  await mkdir(f.data, { mode: 0o700 }); await mkdir(join(f.data, 'metadata-state-v1'), { mode: 0o700 });
  const empty = await tree(f.data); assert.equal((await previewRetention(f.options)).status, 'absent');
  assert.deepEqual(await tree(f.data), empty);
});

test('retention removes only the exact old project/session scope and preserves other scopes and project bytes', posix, async t => {
  for (const mode of ['project', 'session']) {
    const f = await fixture(t, mode);
    const others = [{ projectId: join(f.root, 'other project') }, { projectId: f.project, sessionId: 'other-session' },
      ...(mode === 'session' ? [{ projectId: f.project }] : [{ projectId: f.project, sessionId: 'third-session' }])];
    await f.record(); for (const s of others) await f.record(s, recent);
    await writeFile(join(f.data, 'unrelated.txt'), 'keep', { mode: 0o600 });
    const preserved = await Promise.all(others.map(s => tree(join(f.data, 'metadata-state-v1', metadataScopeKey(s)))));
    const project = await tree(f.project), settings = await readFile(f.settings);
    const dataBefore = await tree(f.data), p = await previewRetention(f.options);
    assert.deepEqual(await tree(f.data), dataBefore, 'preview must be read-only');
    assert.equal(p.status, 'eligible'); assert.equal(p.records, 1); assert.equal(p.journalFiles, 1);
    assert.equal(p.oldestRecordedAt, old().toISOString()); assert.match(p.confirmPreview, /^[a-f0-9]{64}$/);
    assert.doesNotMatch(JSON.stringify(p), /synthetic-private|projectId|sessionId|SessionStart|mods retention|activity.jsonl/);
    const result = await cleanupRetention({ ...f.options, confirmPreview: p.confirmPreview });
    assert.equal(result.removedScopes, 1); assert.equal(result.removedRecords, 1); assert.equal(result.removedJournalFiles, 1);
    await assert.rejects(lstat(f.scopePath), { code: 'ENOENT' });
    assert.deepEqual(await Promise.all(others.map(s => tree(join(f.data, 'metadata-state-v1', metadataScopeKey(s))))), preserved);
    assert.deepEqual(await tree(f.project), project); assert.deepEqual(await readFile(f.settings), settings);
    assert.equal(await readFile(join(f.data, 'unrelated.txt'), 'utf8'), 'keep');
    await refused(() => cleanupRetention({ ...f.options, confirmPreview: p.confirmPreview }));
    assert.equal((await previewRetention(f.options)).status, 'absent');
    assert.ok(!(await readdir(join(f.data, 'metadata-state-v1'))).includes('.state.lock'));
  }
});

test('retention keeps an entire mixed-age scope and refuses a missing, wrong or stale fingerprint', posix, async t => {
  const f = await fixture(t); await f.record(); const approved = await confirmation(f);
  for (const bad of [undefined, '', 'a'.repeat(64), 'A'.repeat(64)]) await refused(() => cleanupRetention({ ...f.options, confirmPreview: bad }));
  await f.record(f.scope, recent); const bytes = await tree(f.scopePath);
  const p = await previewRetention(f.options); assert.equal(p.status, 'retained'); assert.equal(p.records, 2); assert.equal(p.confirmPreview, null);
  await refused(() => cleanupRetention(approved)); assert.deepEqual(await tree(f.scopePath), bytes);
});

test('retention invalidates previews after old-data append, same-byte replacement, settings change or scope replacement', posix, async t => {
  for (const change of ['append', 'file', 'settings', 'scope']) {
    const f = await fixture(t); await f.record(); const approved = await confirmation(f);
    if (change === 'append') await f.record();
    if (change === 'file') { const p = join(f.scopePath, 'activity.jsonl'); const bytes = await readFile(p); await rm(p); await writeFile(p, bytes, { mode: 0o600 }); }
    if (change === 'settings') await writeFile(f.settings, JSON.stringify({ ...f.config, allowChanges: true }));
    if (change === 'scope') { await rename(f.scopePath, f.scopePath + '-preserved'); await mkdir(f.scopePath, { mode: 0o700 }); }
    const current = await tree(f.data); await refused(() => cleanupRetention(approved)); assert.deepEqual(await tree(f.data), current);
  }
});

test('retention fingerprint is bound to selected settings, data location, cutoff and project/session identity', posix, async t => {
  const a = await fixture(t), b = await fixture(t, 'session'); await a.record(); await b.record();
  const preview = await previewRetention(a.options), keepA = await tree(a.data), keepB = await tree(b.data);
  await refused(() => cleanupRetention({ ...b.options, confirmPreview: preview.confirmPreview }));
  await refused(() => cleanupRetention({ ...a.options, before: '2024-02-01T00:00:00.000Z', confirmPreview: preview.confirmPreview }));
  const otherSettings = join(a.root, 'other settings.json'); await writeFile(otherSettings, await readFile(a.settings), { mode: 0o600 });
  await refused(() => cleanupRetention({ ...a.options, settings: otherSettings, confirmPreview: preview.confirmPreview }));
  assert.deepEqual(await tree(a.data), keepA); assert.deepEqual(await tree(b.data), keepB);
});

test('retention refuses existing state/journal locks without deleting or replacing them', posix, async t => {
  for (const atRoot of [true, false]) {
    const f = await fixture(t); await f.record(); const approved = await confirmation(f);
    const lock = join(atRoot ? join(f.data, 'metadata-state-v1') : f.scopePath, atRoot ? '.state.lock' : '.activity-journal.lock');
    await mkdir(lock, { mode: 0o700 }); const keep = await tree(f.data);
    await refused(() => previewRetention(f.options), /busy/); await refused(() => cleanupRetention(approved), /busy/);
    assert.deepEqual(await tree(f.data), keep);
  }
});

test('retention handles two bounded journals and an empty selected directory without root-wide pruning', posix, async t => {
  const f = await fixture(t); await f.record();
  await writeFile(join(f.scopePath, 'activity.previous.jsonl'), await readFile(join(f.scopePath, 'activity.jsonl')), { mode: 0o600 });
  const p = await previewRetention(f.options); assert.equal(p.journalFiles, 2); assert.equal(p.records, 2);
  assert.equal((await cleanupRetention({ ...f.options, confirmPreview: p.confirmPreview })).removedJournalFiles, 2);
  await mkdir(f.scopePath, { mode: 0o700 }); const empty = await previewRetention(f.options);
  assert.equal(empty.status, 'eligible'); assert.equal(empty.records, 0);
  assert.equal((await cleanupRetention({ ...f.options, confirmPreview: empty.confirmPreview })).removedScopes, 1);
});

test('retention refuses linked/public/special/malformed/oversized/unexpected selected storage before deletion', posix, async t => {
  for (const variant of ['symlink-file', 'hardlink', 'fifo', 'large', 'json', 'utf8', 'secret-field', 'public-file', 'public-scope', 'unexpected']) {
    const f = await fixture(t); await f.record(); const approved = await confirmation(f);
    const journal = join(f.scopePath, 'activity.jsonl'), sentinel = join(f.root, 'sentinel');
    await writeFile(sentinel, 'synthetic-private-onerror-sentinel', { mode: 0o600 });
    if (variant === 'symlink-file' || variant === 'hardlink' || variant === 'fifo') await rm(journal);
    if (variant === 'symlink-file') await symlink(sentinel, journal);
    if (variant === 'hardlink') await link(sentinel, journal);
    if (variant === 'fifo') execFileSync('mkfifo', [journal], { timeout: 2000 });
    if (variant === 'large') await truncate(journal, MAX_JOURNAL_BYTES + 1);
    if (variant === 'json') await writeFile(journal, '{synthetic-private');
    if (variant === 'utf8') await writeFile(journal, Buffer.from([0xff]));
    if (variant === 'secret-field') await writeFile(journal, JSON.stringify({ recordedAt: old().toISOString(), event: 'SessionStart', prompt: 'synthetic-private' }) + '\n');
    if (variant === 'public-file') await chmod(journal, 0o644);
    if (variant === 'public-scope') await chmod(f.scopePath, 0o755);
    if (variant === 'unexpected') await writeFile(join(f.scopePath, 'unrelated'), 'keep', { mode: 0o600 });
    await refused(() => previewRetention(f.options)); await refused(() => cleanupRetention(approved));
    assert.equal(await readFile(sentinel, 'utf8'), 'synthetic-private-onerror-sentinel');
    assert.ok((await lstat(f.scopePath)).isDirectory());
    assert.ok(!(await readdir(join(f.data, 'metadata-state-v1'))).includes('.state.lock'));
  }
});

test('retention refuses linked data/root/scope and overlapping project data, without following targets', posix, async t => {
  for (const part of ['data', 'state', 'scope']) {
    const f = await fixture(t); await f.record(); const approved = await confirmation(f);
    const selected = part === 'data' ? f.data : part === 'state' ? join(f.data, 'metadata-state-v1') : f.scopePath;
    const target = selected + '-preserved'; await rename(selected, target); await symlink(target, selected);
    const keep = await tree(target); await refused(() => previewRetention(f.options)); await refused(() => cleanupRetention(approved));
    assert.deepEqual(await tree(target), keep);
  }
  const f = await fixture(t);
  for (const dataDirectory of [f.project, join(f.project, 'data'), f.root]) {
    await writeFile(f.settings, JSON.stringify({ ...f.config, dataDirectory })); await refused(() => previewRetention(f.options), /settings/);
  }
});

test('retention requires private reviewed selection and canonical nonfuture cutoff; errors reveal no raw paths', posix, async t => {
  const f = await fixture(t), initial = await tree(f.root);
  for (const options of [{}, { ...f.options, settings: 'relative-private' }, { ...f.options, settings: f.root + '/./reviewed settings.json' }, { ...f.options, before: '2024-01-01' },
    { ...f.options, before: '2024-02-30T00:00:00.000Z' }, { ...f.options, before: '9999-01-01T00:00:00.000Z' },
    { ...f.options, extra: 'synthetic-private' }, { ...f.options, settings: join(f.root, 'synthetic-private-missing') }]) await refused(() => previewRetention(options));
  assert.deepEqual(await tree(f.root), initial);
  await chmod(f.settings, 0o644); await refused(() => previewRetention(f.options)); await chmod(f.settings, 0o600);
  await writeFile(f.settings, JSON.stringify({ ...f.config, stateScope: 'session' })); await refused(() => previewRetention(f.options));
  await writeFile(f.settings, '{}'); await refused(() => previewRetention(f.options));
  await writeFile(f.settings, '{synthetic-private'); await refused(() => previewRetention(f.options));
  assert.ok(!(await readdir(f.root)).includes('private data'));
});

test('retention CLI validates options, previews and explicitly cleans a synthetic scope', posix, async t => {
  const f = await fixture(t); await f.record(); let out = '';
  const streams = { stdout: { write: s => { out += s; } } };
  for (const args of [[], ['--settings', f.settings, '--settings', f.settings, '--before', before], ['--private-secret', 'synthetic-private']])
    await refused(() => runCli(['retention-preview', ...args], streams));
  assert.equal(out, '');
  await runCli(['retention-preview', '--settings', f.settings, '--before', before], streams);
  const p = JSON.parse(out); out = '';
  await runCli(['retention-cleanup', '--settings', f.settings, '--before', before, '--confirm-preview', p.confirmPreview], streams);
  assert.equal(JSON.parse(out).removedScopes, 1);
});

test('retention rechecks settings after obtaining locks and before unlink (controlled source copy)', posix, async t => {
  const f = await fixture(t); await f.record(); const approved = await confirmation(f);
  const { module } = await copiedModule(t, f.root, 'retention.mjs', source => {
    const target = 'if ((await selection(options, true)).binding !== selected.binding)';
    assert.equal(source.split(target).length, 2);
    return source.replace(target, 'await retentionFixture();\n          ' + target) + '\nexport let retentionFixture = async () => {}; export function setRetentionFixture(f) { retentionFixture = f; }\n';
  });
  module.setRetentionFixture(() => writeFile(f.settings, JSON.stringify({ ...f.config, allowChanges: true })));
  // Taking and releasing our journal lock legitimately changes the directory's
  // mtime. File identity/mode/size/time/content, directory identity and entries
  // must still match; do not mistake lock bookkeeping for a journal mutation.
  const keep = await tree(f.scopePath, false); await refused(() => module.cleanupRetention(approved), /changed/);
  assert.deepEqual(await tree(f.scopePath, false), keep);
  assert.ok(!(await readdir(join(f.data, 'metadata-state-v1'))).includes('.state.lock'));
  assert.ok(!(await readdir(f.scopePath)).includes('.activity-journal.lock'));
});

test('retention serializes with a colliding state writer and preserves its new retained event (controlled barriers)', posix, async t => {
  const f = await fixture(t); await f.record(); const approved = await confirmation(f);
  let held, release; const reached = new Promise(r => { held = r; }), resume = new Promise(r => { release = r; });
  const cleanup = await copiedModule(t, f.root, 'retention.mjs', source => {
    assert.equal(source.split('await unlink(f.path);').length, 2);
    return source.replace('await unlink(f.path);', 'await retentionFixture(); await unlink(f.path);') + '\nexport let retentionFixture = async () => {}; export function setRetentionFixture(f) { retentionFixture = f; }\n';
  });
  cleanup.module.setRetentionFixture(async () => { held(); await resume; });
  let collision; const collided = new Promise(r => { collision = r; });
  const writer = await copiedModule(t, f.root, 'state.mjs', source => {
    const needle = 'if (error?.code !== "EEXIST") throw error;'; assert.equal(source.split(needle).length, 2);
    return source.replace(needle, needle + '\n      stateFixture();') + '\nexport let stateFixture = () => {}; export function setStateFixture(f) { stateFixture = f; }\n';
  });
  writer.module.setStateFixture(collision);
  const cleaning = cleanup.module.cleanupRetention(approved); await reached;
  const writing = writer.module.recordMetadataEvent(f.data, f.scope, { event: 'PostToolUse', tool: 'Bash' }, recent);
  try { await collided; } finally { release(); }
  assert.equal((await cleaning).removedRecords, 1); await writing;
  const current = await readMetadataState(f.data, f.scope); assert.equal(current.records, 1); assert.equal(current.events.PostToolUse, 1);
  assert.deepEqual(await readdir(f.scopePath), ['activity.jsonl']);
});

test('retention reports partial unlink failure, releases owned locks and never retries automatically (fault copy)', posix, async t => {
  const f = await fixture(t); await f.record();
  await writeFile(join(f.scopePath, 'activity.previous.jsonl'), await readFile(join(f.scopePath, 'activity.jsonl')), { mode: 0o600 });
  const approved = await confirmation(f);
  const { module } = await copiedModule(t, f.root, 'retention.mjs', source => {
    assert.equal(source.split('await unlink(f.path);').length, 2);
    return source.replace('await unlink(f.path);', "if (removed === 1) throw Error('synthetic-private failure'); await unlink(f.path);");
  });
  await refused(() => module.cleanupRetention(approved), /did not complete cleanly; removed journal files: 1; scope removed: false/);
  assert.deepEqual(await readdir(f.scopePath), ['activity.previous.jsonl']);
  assert.deepEqual(await readdir(join(f.data, 'metadata-state-v1')), [metadataScopeKey(f.scope)]);
  await refused(() => cleanupRetention(approved));
  assert.equal((await readMetadataState(f.data, f.scope)).records, 1);
});

test('retention refuses a file changed after locking without unlinking the new bytes (fault copy)', posix, async t => {
  const f = await fixture(t); await f.record(); const approved = await confirmation(f);
  const { module } = await copiedModule(t, f.root, 'retention.mjs', source => {
    assert.equal(source.split('started = true;').length, 2);
    return source.replace('started = true;', 'await retentionFixture(); started = true;') +
      '\nexport let retentionFixture = async () => {}; export function setRetentionFixture(f) { retentionFixture = f; }\n';
  });
  const newer = JSON.stringify({ recordedAt: recent().toISOString(), event: 'PostToolUse', tool: 'Bash' }) + '\n';
  module.setRetentionFixture(() => writeFile(join(f.scopePath, 'activity.jsonl'), newer));
  await refused(() => module.cleanupRetention(approved), /removed journal files: 0; scope removed: false/);
  assert.equal(await readFile(join(f.scopePath, 'activity.jsonl'), 'utf8'), newer);
  assert.deepEqual(await readdir(f.scopePath), ['activity.jsonl']);
});

test('retention never recursively removes a new unexpected file after journal deletion (fault copy)', posix, async t => {
  const f = await fixture(t); await f.record(); const approved = await confirmation(f);
  const { module } = await copiedModule(t, f.root, 'retention.mjs', source => {
    const target = 'await verifyDirectory(scope); await rmdir(scope.path);';
    assert.equal(source.split(target).length, 2);
    return source.replace(target, 'await retentionFixture(); ' + target) +
      '\nexport let retentionFixture = async () => {}; export function setRetentionFixture(f) { retentionFixture = f; }\n';
  });
  module.setRetentionFixture(() => writeFile(join(f.scopePath, 'unexpected-new-file'), 'synthetic-private keep', { mode: 0o600 }));
  await refused(() => module.cleanupRetention(approved), /removed journal files: 1; scope removed: false/);
  assert.equal(await readFile(join(f.scopePath, 'unexpected-new-file'), 'utf8'), 'synthetic-private keep');
  assert.deepEqual(await readdir(f.scopePath), ['unexpected-new-file']);
  assert.ok(!(await readdir(join(f.data, 'metadata-state-v1'))).includes('.state.lock'));
});

test('retention actual CLI subprocess returns a bounded preview and sanitizes settings errors', posix, async t => {
  const f = await fixture(t); await f.record();
  const bin = fileURLToPath(new URL('../bin/codex-mods.mjs', import.meta.url));
  const result = JSON.parse(execFileSync(process.execPath, [bin, 'retention-preview', '--settings', f.settings, '--before', before], { timeout: 5000, maxBuffer: 8192, encoding: 'utf8' }));
  assert.equal(result.status, 'eligible'); assert.equal(result.records, 1);
  const cleaned = JSON.parse(execFileSync(process.execPath, [bin, 'retention-cleanup', '--settings', f.settings, '--before', before, '--confirm-preview', result.confirmPreview], { timeout: 5000, maxBuffer: 8192, encoding: 'utf8' }));
  assert.equal(cleaned.removedScopes, 1);
  assert.throws(() => execFileSync(process.execPath, [bin, 'retention-preview', '--settings', join(f.root, 'synthetic-private-missing'), '--before', before], { timeout: 5000, maxBuffer: 8192, stdio: 'pipe' }), e => {
    assert.equal(e.status, 1); assert.equal(e.stdout.length, 0); assert.match(e.stderr.toString(), /valid reviewed private settings/);
    assert.doesNotMatch(e.stderr.toString(), /synthetic-private|mods retention|ENOENT/); return true;
  });
});

test('retention interruption leaves held locks and data intact rather than stealing or recovering locks (owned child)', { ...posix, timeout: 10000 }, async t => {
  const f = await fixture(t); await f.record(); const approved = await confirmation(f);
  const { path } = await copiedModule(t, f.root, 'retention.mjs', source => {
    assert.equal(source.split('await unlink(f.path);').length, 2);
    // Register the IPC listener before notifying the parent. An unsettled
    // promise alone does not keep Node alive while the parent is descheduled.
    return source.replace('await unlink(f.path);', "const paused = new Promise(resolve => process.once('message', resolve)); process.send('retention-held'); await paused; await unlink(f.path);");
  });
  const program = `import {cleanupRetention} from ${JSON.stringify(pathToFileURL(path).href)}; await cleanupRetention(JSON.parse(process.argv[1]));`;
  const child = spawn(process.execPath, ['--input-type=module', '-e', program, JSON.stringify(approved)], { stdio: ['ignore', 'pipe', 'pipe', 'ipc'] });
  let output = ''; for (const s of [child.stdout, child.stderr]) s.on('data', b => { output += b; if (output.length > 4096) child.kill('SIGKILL'); });
  const closed = new Promise((res, rej) => { child.once('close', (code, signal) => res({ code, signal })); child.once('error', rej); });
  const held = new Promise((res, rej) => { child.once('message', res); child.once('error', rej); child.once('close', () => rej(Error('child closed before held marker'))); });
  const timer = setTimeout(() => child.kill('SIGKILL'), 5000);
  try { assert.equal(await held, 'retention-held'); child.kill('SIGKILL'); assert.equal((await closed).signal, 'SIGKILL'); }
  finally { clearTimeout(timer); if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL'); await closed; }
  assert.equal(output, ''); assert.ok((await lstat(join(f.data, 'metadata-state-v1/.state.lock'))).isDirectory());
  assert.ok((await lstat(join(f.scopePath, '.activity-journal.lock'))).isDirectory());
  assert.equal((await readFile(join(f.scopePath, 'activity.jsonl'), 'utf8')).split('\n').filter(Boolean).length, 1);
  await refused(() => previewRetention(f.options), /busy/);
});

test('Windows retention guards refuse before reading even option getters or selected paths', { skip: process.platform !== 'win32' }, async () => {
  const options = { get settings() { assert.fail('must refuse before path access'); } };
  await refused(() => previewRetention(options), /unavailable on Windows/);
  await refused(() => cleanupRetention(options), /unavailable on Windows/);
  await refused(() => runRetentionCli('retention-preview', null, null), /unavailable on Windows/);
});

test('retention Windows guard contract also holds under a synthetic platform override (not Windows acceptance)', posix, async () => {
  const moduleUrl = new URL('../src/retention.mjs', import.meta.url).href;
  const program = `Object.defineProperty(process,'platform',{value:'win32'}); const m=await import(${JSON.stringify(moduleUrl)});
    for (const f of [()=>m.previewRetention(null),()=>m.cleanupRetention(null),()=>m.runRetentionCli('retention-preview',null,null)]) {
      try {await f();process.exitCode=1;} catch(e) {if(!e.message.startsWith('Retention maintenance is unavailable on Windows'))throw e;}
    }`;
  execFileSync(process.execPath, ['--input-type=module', '-e', program], { timeout: 5000, stdio: 'pipe' });
});
