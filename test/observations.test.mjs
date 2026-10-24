import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, realpath, writeFile, readFile, chmod, symlink, link, rm, readdir, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { summarizeExecObservations, readSelectedObservations } from '../src/observations.mjs';
import { runCli } from '../src/cli.mjs';
import { loadRuntimeSettings } from '../src/runtime-settings.mjs';
import { createDashboardHandler } from '../src/server.mjs';
const start = { type: 'thread.started', thread_id: 'SYNTHETIC_PRIVATE_THREAD' };
const command = (status, exit_code) => ({ type: 'item.completed', item: { type: 'command_execution', id: 'SYNTHETIC_PRIVATE_ITEM', status, exit_code, command: 'SYNTHETIC_PRIVATE_COMMAND', aggregated_output: 'SYNTHETIC_PRIVATE_OUTPUT' } });
const jsonl = (...events) => events.map(event => JSON.stringify(event)).join('\n');
const call = (h, name, args = {}) => h({ method: 'tools/call', params: { name, arguments: args } });
async function temporary(t) {
  const dir = await mkdtemp(join(await realpath(tmpdir()), 'mods-observations-'));
  t.after(() => rm(dir, { recursive: true, force: true })); return dir;
}

test('structured observations separate command status, nonzero exit, turn failure and stream error without text/IDs', () => {
  const result = summarizeExecObservations(jsonl(start, { type: 'turn.started' }, command('completed', 0), command('failed', 7), command('failed', null), command('declined', null),
    { type: 'turn.failed', error: { message: 'SYNTHETIC_PRIVATE_ERROR' } }, { type: 'error', message: 'SYNTHETIC_PRIVATE_STREAM' }));
  assert.deepEqual(result.commands, { completed: 1, failed: 2, declined: 1 });
  assert.deepEqual(result.exits, { zero: 1, nonzero: 1, unavailable: 2 });
  assert.deepEqual(result.turns, { started: 1, completed: 0, failed: 1, streamErrors: 1 });
  assert.equal(result.streamStatus, 'stream-error'); assert.equal(result.cancellation, 'unavailable');
  assert.doesNotMatch(JSON.stringify(result), /SYNTHETIC_PRIVATE|exit_code|thread_id|command_execution/);
  assert.match(result.semantics, /must not be added/);
  // Status is not guessed from code or output; even an inconsistent external
  // producer's completed+nonzero is described as supplied, never called success.
  const independent = summarizeExecObservations(jsonl(start, command('completed', 9), { type: 'turn.completed' }));
  assert.equal(independent.commands.completed, 1); assert.equal(independent.exits.nonzero, 1);
  assert.equal(independent.turns.completed, 1); assert.equal(independent.turns.failed, 0);
});

test('missing/unfinished/unknown/duplicate records never infer cancellation, unique turns or tool invocation errors', () => {
  assert.equal(summarizeExecObservations('').available, false);
  const header = summarizeExecObservations(jsonl(start)); assert.equal(header.streamStatus, 'unknown');
  const data = summarizeExecObservations(jsonl(start, { type: 'turn.started' }, { type: 'item.started', item: { type: 'command_execution', command: 'SYNTHETIC_PRIVATE' } }, { type: 'future.event', message: 'cancelled' }));
  assert.equal(data.streamStatus, 'unfinished'); assert.equal(data.cancellation, 'unavailable');
  assert.deepEqual(data.commands, { completed: 0, failed: 0, declined: 0 }); assert.equal(data.ignoredRecords, 2);
  const duplicate = summarizeExecObservations(jsonl(start, command('failed', 2), command('failed', 2)));
  assert.equal(duplicate.commands.failed, 2); assert.match(duplicate.semantics, /not live hooks|Not live hooks/);
});

test('observation parser rejects malformed, ambiguous, unsupported statuses and oversized input without partial results', () => {
  for (const text of ['diagnostic text', jsonl({ type: 'turn.started' }), jsonl(start, start), jsonl(start, { ...start, thread_id: 'other' }), jsonl(start, []), jsonl(start, command('in_progress', null)), jsonl(start, command('cancelled', null)), jsonl(start, command('failed', 1.5)), jsonl(start, command('failed', 2147483648)), jsonl(start, { type: 'turn.failed', error: 'raw' }), jsonl(start, { type: 'error' }), jsonl(start, { type: 'item.completed', item: null }), jsonl(start) + '\n{broken', 'x'.repeat(1024 * 1024 + 1), jsonl(start) + '\n'.repeat(4096), jsonl(start, { type: 'unknown', text: 'x'.repeat(256 * 1024) })]) {
    assert.throws(() => summarizeExecObservations(text), /Invalid or unsupported/);
  }
});

test('new observation IO refuses Windows before inspecting input or options; pure summary remains portable', { skip: process.platform !== 'win32' }, async () => {
  const input = { toString() { assert.fail('must not inspect Windows path'); } };
  const options = { get signal() { assert.fail('must not inspect Windows options'); } };
  assert.equal((await readSelectedObservations(input, options)).available, false);
});

test('explicit POSIX export read is private/bounded/read-only, cancellation-safe and does not return raw diagnostics', { skip: process.platform === 'win32' }, async t => {
  const dir = await temporary(t), path = join(dir, 'selected.jsonl');
  const content = jsonl(start, command('failed', 3), { type: 'turn.failed', error: { message: 'SYNTHETIC_PRIVATE_ERROR' } });
  await writeFile(path, content, { mode: 0o600 });
  assert.equal((await readSelectedObservations(path)).exits.nonzero, 1);
  const controller = new AbortController(); controller.abort('SYNTHETIC_PRIVATE_REASON');
  assert.equal((await readSelectedObservations(path, { signal: controller.signal })).available, false);
  await chmod(path, 0o644); assert.equal((await readSelectedObservations(path)).available, false); await chmod(path, 0o600);
  await symlink(path, path + '.link'); assert.equal((await readSelectedObservations(path + '.link')).available, false);
  await link(path, path + '.hard'); assert.equal((await readSelectedObservations(path)).available, false); await rm(path + '.hard');
  const folder = join(dir, 'folder'); await mkdir(folder); assert.equal((await readSelectedObservations(folder)).available, false);
  await writeFile(path, Buffer.from([0xff])); assert.equal((await readSelectedObservations(path)).available, false);
  await writeFile(path, content); assert.equal(await readFile(path, 'utf8'), content);
  let output = ''; await runCli(['observations', '--export', path], { stdout: { write: s => output += s } });
  assert.equal(JSON.parse(output).turns.failed, 1); assert.doesNotMatch(output, /SYNTHETIC_PRIVATE|selected.jsonl/);
  assert.deepEqual((await readdir(dir)).sort(), ['folder', 'selected.jsonl', 'selected.jsonl.link']);
  assert.equal(await readFile(path, 'utf8'), content);
});

test('service observation path is a separate reviewed opt-in, never a tool argument, usage fallback or journal write', { skip: process.platform === 'win32' }, async t => {
  const dir = await temporary(t), path = join(dir, 'selected.jsonl'), settingsPath = join(dir, 'settings.json'), projectRoot = join(dir, 'project'); await mkdir(projectRoot);
  await writeFile(path, jsonl(start, command('failed', 2)), { mode: 0o600 });
  const base = { version: 1, projectRoot, dataDirectory: join(dir, 'unused-data'), usageExport: path };
  await writeFile(settingsPath, JSON.stringify(base), { mode: 0o600 });
  const disabled = createDashboardHandler(await loadRuntimeSettings(settingsPath));
  assert.equal((await call(disabled, 'mods.observations')).structuredContent.available, false);
  await assert.rejects(call(disabled, 'mods.observations', { export: path }), /Unexpected arguments/);
  for (const observationExport of ['relative', join(projectRoot, 'raw.jsonl'), null]) {
    await writeFile(settingsPath, JSON.stringify({ ...base, observationExport })); await assert.rejects(loadRuntimeSettings(settingsPath));
  }
  await writeFile(settingsPath, JSON.stringify({ ...base, observationExport: path }));
  const enabled = createDashboardHandler(await loadRuntimeSettings(settingsPath));
  const result = await call(enabled, 'mods.observations'); assert.equal(result.structuredContent.commands.failed, 1);
  assert.doesNotMatch(JSON.stringify(result), /SYNTHETIC_PRIVATE|selected.jsonl|projectRoot/);
  assert.equal((await readdir(dir)).includes('unused-data'), false);
  const empty = createDashboardHandler(null); assert.equal((await call(empty, 'mods.observations')).structuredContent.available, false);
});

test('sampled export modification refuses the entire summary (copied-source synthetic barrier, not hostile-race proof)', { skip: process.platform === 'win32' }, async t => {
  const dir = await temporary(t), path = join(dir, 'selected.jsonl');
  await writeFile(path, jsonl(start, command('failed', 4)), { mode: 0o600 });
  const source = await readFile(new URL('../src/observations.mjs', import.meta.url), 'utf8');
  const marker = 'same(info, await handle.stat({ bigint: true }));';
  assert.equal(source.split(marker).length, 2);
  const copy = join(dir, 'barrier.mjs');
  await writeFile(copy, source.replace(marker, `await (await import('node:fs/promises')).appendFile(path, '\\n');\n      ${marker}`), { mode: 0o600 });
  const reader = (await import(new URL('file://' + copy).href)).readSelectedObservations;
  const result = await reader(path); assert.equal(result.available, false);
  assert.doesNotMatch(JSON.stringify(result), /SYNTHETIC_PRIVATE|selected.jsonl/);
  assert.equal((await readFile(path, 'utf8')).endsWith('\n'), true);
});
