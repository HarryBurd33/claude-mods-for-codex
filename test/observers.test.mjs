import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm, readdir, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { OBSERVER_EVENTS } from '../src/constants.mjs';
import { validateConfig } from '../src/config.mjs';
import { dispatch, validateEventEnvelope } from '../src/dispatcher.mjs';
import { recordMetadataEvent, readMetadataState } from '../src/state.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = (observerEvents, enabled = true) => validateConfig({ version: 1, mods: [], metadataState: { enabled, scope: 'session', ...(observerEvents === undefined ? {} : { observerEvents }) } });
const names = [...OBSERVER_EVENTS];
const fixture = name => readFile(join(root, 'examples/events', name + '.json'), 'utf8').then(JSON.parse);

test('released lifecycle examples validate and emit only opt-in event metadata, never mod output or follow-up', async () => {
  for (const name of names) {
    const input = await fixture(name);
    assert.equal(validateEventEnvelope(input), true);
    for (const configured of [config(undefined), config([]), config(names, false)]) {
      assert.deepEqual(dispatch(input, configured), { output: {}, journal: null, stateMetadata: null, diagnostic: null });
    }
    let calls = 0;
    const configured = config([name]);
    configured.mods = [{ enabled: true, type: 'mistake' }];
    const result = dispatch(input, configured, () => { calls++; throw Error('must not run'); });
    assert.equal(calls, 0);
    assert.deepEqual(result, { output: {}, journal: null, stateMetadata: { event: name }, diagnostic: null });
    assert.doesNotMatch(JSON.stringify(result), /synthetic-private|prompt|transcript|agent_id|model|turn_id|tool_name/);
  }
});

test('observer opt-in rejects duplicates, permission events, prompts and unknown future events', () => {
  for (const value of [['Stop', 'Stop'], ['PermissionRequest'], ['UserPromptSubmit'], ['ModelRequest'], ['PostToolUseFailure'], 'Stop', null, [null]]) {
    assert.throws(() => config(value), /observerEvents/);
  }
  assert.deepEqual(dispatch({ hook_event_name: 'FutureObservation' }, config(names)).output, {});
});

test('malformed lifecycle fields fail validation without interpreting response/transcript payloads', async () => {
  for (const name of names) {
    const input = await fixture(name);
    assert.throws(() => validateEventEnvelope({ ...input, session_id: '' }));
    if (name === 'SessionEnd') assert.throws(() => validateEventEnvelope({ ...input, reason: 'arbitrary' }));
    else assert.throws(() => validateEventEnvelope({ ...input, turn_id: '' }));
    if (name.includes('Compact')) assert.throws(() => validateEventEnvelope({ ...input, trigger: 'invalid' }));
    if (name.endsWith('Stop')) assert.throws(() => validateEventEnvelope({ ...input, stop_hook_active: 'false' }));
    if (name.startsWith('Subagent')) assert.throws(() => validateEventEnvelope({ ...input, agent_id: '' }));
    // Deliberately complex optional JSON payload is not cloned, inspected or
    // persisted by the observer lane; raw content is not a storage requirement.
    input.last_assistant_message = { nested: Array(20000).fill('synthetic-private') };
    assert.deepEqual(dispatch(input, config([name])).stateMetadata, { event: name });
  }
});

test('optional observer hook manifest is explicit; default package keeps its three hooks', async () => {
  const manifest = JSON.parse(await readFile(join(root, 'examples/hooks/observe-lifecycle.json'), 'utf8'));
  assert.deepEqual(Object.keys(manifest.hooks).sort(), names.sort());
  for (const groups of Object.values(manifest.hooks)) {
    assert.equal(groups.length, 1); assert.equal(groups[0].hooks.length, 1);
    assert.deepEqual(groups[0].hooks[0], { type: 'command', command: 'node "${PLUGIN_ROOT}/src/hook-main.mjs"', timeout: 5, statusMessage: 'Observing opted-in Claude Mods lifecycle metadata' });
  }
  const defaults = JSON.parse(await readFile(join(root, 'hooks/hooks.json'), 'utf8'));
  assert.deepEqual(Object.keys(defaults.hooks).sort(), ['PostToolUse', 'PreToolUse', 'SessionStart']);
});

test('observer delivery counts and subprocess output stay scoped/private; disabled event writes nothing (not native)', { skip: process.platform === 'win32' }, async t => {
  const directory = await mkdtemp(join(await realpath(tmpdir()), 'mods-observer-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const scope = { projectId: 'synthetic-project', sessionId: 'synthetic-session' };
  for (const name of names) await recordMetadataEvent(directory, scope, { event: name });
  const counts = await readMetadataState(directory, scope);
  assert.equal(counts.records, 7); assert.deepEqual(counts.tools, {});
  for (const name of names) assert.equal(counts.events[name], 1);
  await assert.rejects(recordMetadataEvent(directory, scope, { event: 'Stop', tool: 'Bash' }), /only the event/);
  const env = { ...process.env, PLUGIN_ROOT: root, CODEX_MODS_CONFIG: join(root, 'examples/config/lifecycle-observation-opt-in.json'), CODEX_MODS_DATA_DIR: join(directory, 'must-not-exist'), CODEX_MODS_PROJECT_ROOT: directory };
  // Source observer event remains excluded by the selected-project boundary.
  // This is a Node subprocess replay, not native delivery.
  const input = await fixture('Stop');
  function invoke(environment) {
    return new Promise((resolve, reject) => {
      const child = execFile(process.execPath, [join(root, 'src/hook-main.mjs')], { env: environment, timeout: 5000, maxBuffer: 4096 }, (error, stdout, stderr) => error ? reject(error) : resolve({ stdout, stderr }));
      child.stdin.end(JSON.stringify(input));
    });
  }
  const result = await invoke(env);
  assert.equal(result.stdout, '{}\n'); assert.match(result.stderr, /metadata state unavailable/);
  assert.equal((await readdir(directory)).includes('must-not-exist'), false);
  const disabled = await invoke({ ...env, CODEX_MODS_CONFIG: join(root, 'config/mods.json') });
  assert.equal(disabled.stdout, '{}\n'); assert.equal(disabled.stderr, '');
  assert.equal((await readdir(directory)).includes('must-not-exist'), false);
});
