import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, realpath, readFile, writeFile, readdir, chmod, symlink, link, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync, execFile } from 'node:child_process';
import { componentFromSpec, validateComponent, validateStatusComponents, componentAccess, componentPlan, componentIntent, projectStatusComponents, replayComponentEvent } from '../src/component-contract.mjs';
import { scaffoldComponent, loadComponentBundle, readComponentJson, runComponentCli, replayComponentBundle } from '../src/component-authoring.mjs';
import { validateConfig } from '../src/config.mjs';
import { dispatch } from '../src/dispatcher.mjs';
import { readMetadataState, recordMetadataEvent } from '../src/state.mjs';
import { loadRuntimeSettings } from '../src/runtime-settings.mjs';
import { createDashboardHandler } from '../src/server.mjs';

const spec = { name: 'turn-weather', kind: 'activity', title: 'Turn weather', events: ['Stop', 'Interrupt'] };
const root = fileURLToPath(new URL('../', import.meta.url));
const fixture = name => readFile(join(root, 'examples/events', name + '.json'), 'utf8').then(JSON.parse);
const copy = value => JSON.parse(JSON.stringify(value));
async function temp(t) { const dir = await mkdtemp(join(await realpath(tmpdir()), 'mods-component-')); t.after(() => rm(dir, { recursive: true, force: true })); return dir; }
const call = (h, name, args = {}) => h({ method: 'tools/call', params: { name, arguments: args } });

test('component contracts start disabled with independent reception/retention/display and fixed access', async () => {
  const base = componentFromSpec(spec), event = await fixture('Stop');
  assert.equal(Object.isFrozen(base.observer.events), true);
  assert.deepEqual(componentPlan(base).registration, { hooks: {} });
  assert.deepEqual(componentPlan(base).hookConfig, {});
  assert.deepEqual(replayComponentEvent(base, event), { valid: true, response: {}, metadata: null });
  for (const reception of [false, true]) for (const retention of [false, true]) {
    const next = copy(base); Object.assign(next.observer, { reception, retention }); next.status.enabled = true;
    const active = componentIntent(base, next), plan = componentPlan(active);
    assert.deepEqual(replayComponentEvent(active, event).metadata, reception && retention ? { event: 'Stop' } : null);
    assert.equal(Object.keys(plan.registration.hooks).length, reception ? 2 : 0);
    assert.equal(Object.keys(plan.hookConfig).length, retention ? 1 : 0);
    assert.equal(plan.runtimeSettings.statusComponents[0].enabled, true);
    assert.equal(componentAccess(active).modelCalls, 0); assert.deepEqual(componentAccess(active).network, []);
    if (reception) {
      assert.equal(plan.registration.hooks.Interrupt[0].hooks[0].timeout, 3);
      assert.equal(plan.registration.hooks.Stop[0].hooks[0].command, 'node "${PLUGIN_ROOT}/src/hook-main.mjs"');
      assert.equal(componentAccess(active).executes.length, 1);
    }
  }
  const active = copy(base); active.observer.reception = active.observer.retention = true;
  assert.equal(replayComponentEvent(active, { ...event, session_id: '' }).valid, false);
  assert.deepEqual(replayComponentEvent(active, { hook_event_name: 'PostToolUseFailure' }), { valid: false, response: {}, metadata: null });
  assert.doesNotMatch(JSON.stringify(replayComponentEvent(active, event)), /synthetic-private|model|session_id|assistant|transcript/);
});

test('strict component schemas reject active code/paths, bad combinations, accessors, duplicates and bounds', () => {
  for (const value of [
    { ...spec, execute: 'shell' }, { ...spec, kind: 'native-pane' }, { ...spec, name: '../escape' },
    { ...spec, events: [] }, { ...spec, events: ['Stop', 'Stop'] }, { ...spec, events: ['PermissionRequest'] },
    { ...spec, events: ['SessionStart'] }, { ...spec, title: 'x'.repeat(97) }, { ...spec, title: 'hidden\u202e' },
    { ...spec, events: ['Stop'], dataDirectory: '/synthetic-private' },
    Object.defineProperty({ ...spec }, 'title', { get() { assert.fail('must not call accessor'); } }),
  ]) assert.throws(() => componentFromSpec(value), /component data/);
  const base = componentFromSpec(spec), mismatch = copy(base); mismatch.status.events = ['Stop'];
  assert.throws(() => validateComponent(mismatch));
  const renamed = copy(base); renamed.status.title = 'Different scope of review'; assert.throws(() => componentIntent(base, renamed));
  const invalid = copy(base); invalid.observer.retention = 'yes'; assert.throws(() => validateComponent(invalid));
  class ForeignArray extends Array { [Symbol.iterator]() { assert.fail('must not iterate custom prototype'); } }
  assert.throws(()=>componentFromSpec({...spec,events:new ForeignArray('Stop')}),/component data/);
  const status = componentPlan(base).runtimeSettings.statusComponents[0];
  for (const value of [[status, status], Array.from({ length: 9 }, (_, i) => ({ ...status, id: 'id-' + i })), [{ ...status, path: '/secret' }], [{ ...status, events: ['Unknown'] }]]) assert.throws(() => validateStatusComponents(value));
});

test('authored storage opt-in never enables core or dormant legacy events and legacy semantics remain', async () => {
  const c = componentFromSpec({ name: 'stop-only', kind: 'observer', events: ['Stop'] });
  const intent = copy(c); intent.observer.reception = intent.observer.retention = true;
  const fragment = componentPlan(intent).hookConfig.metadataState;
  assert.deepEqual(fragment, { componentObserverEvents: ['Stop'] });
  const configuration = validateConfig({ version: 1, mods: [], metadataState: { enabled: false, observerEvents: ['Interrupt'], ...fragment } });
  assert.deepEqual(dispatch(await fixture('Stop'), configuration).stateMetadata, { event: 'Stop' });
  assert.equal(dispatch(await fixture('Interrupt'), configuration).stateMetadata, null);
  for (const name of ['session-start', 'pre-tool-safe', 'post-tool']) {
    const input = JSON.parse(await readFile(join(root, 'fixtures', name + '.json'), 'utf8'));
    assert.equal(dispatch(input, configuration).stateMetadata, null);
  }
  const legacy = validateConfig({ version: 1, mods: [], metadataState: { enabled: true, observerEvents: ['Stop'] } });
  assert.deepEqual(dispatch(await fixture('Stop'), legacy).stateMetadata, { event: 'Stop' });
  const overlap = validateConfig({ version: 1, mods: [], metadataState: { enabled: true, observerEvents: ['Stop'], componentObserverEvents: ['Stop'] } });
  assert.deepEqual(dispatch(await fixture('Stop'), overlap).stateMetadata, { event: 'Stop' });
  for (const componentObserverEvents of [['Stop', 'Stop'], ['PreToolUse'], ['PostToolUseFailure'], 'Stop', null]) assert.throws(() => validateConfig({ version: 1, mods: [], metadataState: { enabled: false, componentObserverEvents } }));
  let reads=0;const getters = []; Object.defineProperty(getters,'0',{get(){reads++;return 'Stop';},enumerable:true});
  assert.throws(()=>validateConfig({version:1,mods:[],metadataState:{enabled:false,componentObserverEvents:getters}}),/componentObserverEvents/);assert.equal(reads,0);
});

test('owned status projects only selected counts, distinguishes unavailable and never reads hidden text/accessors', () => {
  const c = componentFromSpec({ name: 'tools', kind: 'status', title: '<img src=x onerror=alert(1)>', events: ['PreToolUse', 'PostToolUse'] });
  const definitions = [{ id: c.id, ...c.status, enabled: true }];
  const summary = { available: true, events: { PreToolUse: 3, PostToolUse: 2, Stop: 99 }, get raw() { assert.fail('must not read raw content'); } };
  const [result] = projectStatusComponents(summary, definitions);
  assert.equal(result.total, 5); assert.deepEqual(result.rows, [{ event: 'PreToolUse', deliveries: 3 }, { event: 'PostToolUse', deliveries: 2 }]);
  assert.doesNotMatch(JSON.stringify(result), /99|raw|projectId|session/);
  assert.equal(projectStatusComponents({ available: false }, definitions)[0].total, null);
  assert.deepEqual(projectStatusComponents(summary, [{ ...definitions[0], enabled: false }]), []);
  assert.equal(projectStatusComponents({ available: true, events: {} }, definitions)[0].total, 0);
  assert.equal(projectStatusComponents({ available: true, events: { PreToolUse: -1 } }, definitions)[0].total, null);
  assert.equal(projectStatusComponents({ available: true, events: { PreToolUse: Number.MAX_SAFE_INTEGER, PostToolUse: 1 } }, definitions)[0].total, null);
  assert.equal(projectStatusComponents({ available: true, get events() { assert.fail('must not run accessor'); } }, definitions)[0].total, null);
});

test('new component Windows entrypoints refuse before input/argv/path inspection (actual OS lane only)', { skip: process.platform !== 'win32' }, async () => {
  const value = { get kind() { assert.fail('must not inspect spec'); }, toString() { assert.fail('must not inspect path'); } };
  for (const promise of [scaffoldComponent(value, value), loadComponentBundle(value, value), readComponentJson(value), runComponentCli('scaffold-component', value, value)]) await assert.rejects(promise, /Windows component authoring IO/);
});

test('private complete bundles generate all three new kinds, stay off and preserve prior output on collision', { skip: process.platform === 'win32' }, async t => {
  const dir = await temp(t);
  for (const kind of ['observer', 'status', 'activity']) {
    const selected = kind === 'observer' ? { name: 'observer', kind, events: ['Stop', 'Interrupt'] } : { ...spec, name: kind, kind, ...(kind === 'status' ? { events: ['PreToolUse', 'PostToolUse'] } : {}) };
    const path = join(dir, kind), result = await scaffoldComponent(selected, path);
    assert.equal(result.installed, false); assert.equal(result.registered, false);
    const bundle = await loadComponentBundle(path), replay = replayComponentBundle(bundle);
    assert.deepEqual(replay.status, []); assert.ok(replay.fixtures.some(f => !f.valid));
    assert.ok(replay.fixtures.every(f => f.metadata === null && !Object.keys(f.response).length));
    assert.equal((await readdir(path)).includes('.codex-plugin'), false); assert.equal((await readdir(path)).includes('hooks'), false);
    const original = await readFile(join(path, 'bundle.json'), 'utf8');
    await assert.rejects(scaffoldComponent(selected, path), /output unavailable/);
    assert.equal(await readFile(join(path, 'bundle.json'), 'utf8'), original);
  }
  assert.deepEqual((await readdir(dir)).sort(), ['activity', 'observer', 'status']);
  const maximum=join(dir,'maximum');await scaffoldComponent({name:'maximum',kind:'status',title:'Maximum selection',events:['SessionStart','PreToolUse','PostToolUse','Stop','Interrupt','PreCompact','PostCompact','SubagentStart']},maximum);
  assert.equal(replayComponentBundle(await loadComponentBundle(maximum)).fixtures.length,10);
});

test('bundle IO rejects links, broad modes, extra/tampered/partial files and cannot read artifact traversal', { skip: process.platform === 'win32' }, async t => {
  const dir = await temp(t), path = join(dir, 'bundle'); await scaffoldComponent(spec, path);
  const component = join(path, 'component.json'), original = await readFile(component, 'utf8');
  await chmod(component, 0o644); await assert.rejects(loadComponentBundle(path)); await chmod(component, 0o600);
  await link(component, join(dir, 'alias')); await assert.rejects(loadComponentBundle(path)); await rm(join(dir, 'alias'));
  await symlink(path, join(dir, 'linked')); await assert.rejects(loadComponentBundle(join(dir, 'linked')));
  await assert.rejects(scaffoldComponent(spec, join(dir, 'linked', 'new'))); assert.equal((await readdir(path)).includes('new'), false);
  await writeFile(component, original.replace('Turn weather', 'Tampered')); await assert.rejects(loadComponentBundle(path)); await writeFile(component, original);
  await writeFile(join(path, 'extra.json'), '{}', { mode: 0o600 }); await assert.rejects(loadComponentBundle(path)); await rm(join(path, 'extra.json'));
  const marker = join(path, 'bundle.json'), markerText = await readFile(marker, 'utf8');
  await writeFile(marker, JSON.stringify({ version: 1, files: { '../outside': '0'.repeat(64) } })); await assert.rejects(loadComponentBundle(path));
  await writeFile(marker, markerText); await rm(marker); await assert.rejects(loadComponentBundle(path));
  const badSpec = { ...spec, kind: 'execute' }; await assert.rejects(scaffoldComponent(badSpec, join(dir, 'invalid'))); assert.equal((await readdir(dir)).includes('invalid'), false);
  const huge = join(dir, 'huge.json'); await writeFile(huge, 'x'.repeat(32769), { mode: 0o600 }); await assert.rejects(readComponentJson(huge));
});

test('interrupted-before-marker generation stays partial with no cleanup/retry (copied-source injected fault)', { skip: process.platform === 'win32' }, async t => {
  const dir = await temp(t), path = join(dir, 'partial');
  let source = await readFile(new URL('../src/component-authoring.mjs', import.meta.url), 'utf8');
  for (const name of ['constants', 'component-contract', 'interaction-replay', 'agent-contract']) source = source.replace(`from './${name}.mjs'`, 'from ' + JSON.stringify(new URL(`../src/${name}.mjs`, import.meta.url).href));
  assert.equal(source.split('// Marker is last.').length, 2); source = source.replace('// Marker is last.', "throw new Error('synthetic fault before marker');\n    // Marker is last.");
  const module = join(dir, 'fault.mjs'); await writeFile(module, source, { mode: 0o600 });
  await assert.rejects((await import(pathToFileURL(module).href)).scaffoldComponent(spec, path), /creation incomplete/);
  assert.ok((await readdir(path)).includes('component.json')); assert.equal((await readdir(path)).includes('bundle.json'), false);
  await assert.rejects(loadComponentBundle(path)); await assert.rejects(scaffoldComponent(spec, path));
  assert.equal((await readdir(path)).includes('component.json'), true);
});

test('real component CLI runs disabled/independent intent projections without modifying bundle or executing fixtures', { skip: process.platform === 'win32' }, async t => {
  const dir = await temp(t), path = join(dir, 'bundle'), specPath = join(dir, 'spec.json'); await writeFile(specPath, JSON.stringify(spec), { mode: 0o600 });
  const cli = join(root, 'bin/codex-mods.mjs');
  const invoke = args => execFileSync(process.execPath, [cli, ...args], { encoding: 'utf8', timeout: 5000 });
  assert.equal(JSON.parse(invoke(['scaffold-component', '--spec', specPath, '--output', path])).enabled, false);
  assert.equal(JSON.parse(invoke(['validate-component', '--bundle', path])).valid, true);
  const original = await readFile(join(path, 'component.json'), 'utf8');
  assert.deepEqual(JSON.parse(invoke(['replay-component', '--bundle', path])).status, []);
  const intent = JSON.parse(original); intent.observer.reception = intent.observer.retention = intent.status.enabled = true;
  const intentPath = join(dir, 'intent.json'); await writeFile(intentPath, JSON.stringify(intent), { mode: 0o600 });
  const enabled = JSON.parse(invoke(['replay-component', '--bundle', path, '--intent', intentPath]));
  assert.equal(enabled.status[0].total, 5); assert.equal(enabled.fixtures.filter(f => f.metadata !== null).length, 2);
  assert.equal(enabled.fixtures.filter(f => !f.valid).length, 1); assert.ok(enabled.fixtures.every(f => !Object.keys(f.response).length));
  assert.equal(enabled.fixtures.find(f=>f.fixture==='fixtures/malformed.json').valid,false);
  assert.equal(enabled.fixtures.find(f=>f.fixture==='fixtures/nonmatching.json').metadata,null);
  const plan = JSON.parse(invoke(['component-plan', '--bundle', path, '--intent', intentPath]));
  assert.deepEqual(plan.hookConfig.metadataState, { componentObserverEvents: ['Stop', 'Interrupt'] });
  assert.deepEqual(Object.keys(plan.registration.hooks), ['Stop', 'Interrupt']);
  assert.equal(await readFile(join(path, 'component.json'), 'utf8'), original);
  const captured = []; await assert.rejects(runComponentCli('component-plan', ['--bundle', path, '--export', '/SYNTHETIC_PRIVATE'], { stdout: { write: s => captured.push(s) } }), /Component command refused/); assert.deepEqual(captured, []);
});

test('status service uses existing scope only; inactive components do no IO and tools accept no path/selection', { skip: process.platform === 'win32' }, async t => {
  const dir = await temp(t), projectRoot = join(dir, 'project'), dataDirectory = join(dir, 'data'), path = join(dir, 'settings.json'); await mkdir(projectRoot);
  const c = componentFromSpec({ name: 'core', kind: 'status', title: 'Core activity', events: ['PreToolUse', 'PostToolUse'] });
  const definition = { id: c.id, ...c.status, enabled: true };
  await writeFile(path, JSON.stringify({ version: 1, projectRoot, dataDirectory, stateScope: 'project', statusComponents: [definition] }), { mode: 0o600 });
  const h = createDashboardHandler(await loadRuntimeSettings(path));
  const r = (await call(h, 'mods.status')).structuredContent; assert.equal(r.components[0].total, 0);
  assert.equal((await readdir(dir)).includes('data'), false);
  await recordMetadataEvent(dataDirectory, {projectId:projectRoot}, {event:'PreToolUse',tool:'Bash'});
  await recordMetadataEvent(dataDirectory, {projectId:projectRoot}, {event:'PostToolUse',tool:'Bash'});
  await recordMetadataEvent(dataDirectory, {projectId:'other-project'}, {event:'Stop'});
  assert.equal((await call(h, 'mods.status')).structuredContent.components[0].total, 2);
  assert.equal((await call(h, 'mods.activity')).structuredContent.statusComponents[0].total, 2);
  assert.equal((await readMetadataState(dataDirectory,{projectId:projectRoot})).records,2);
  await assert.rejects(call(h, 'mods.status', { projectRoot: '/SYNTHETIC_PRIVATE' }), /Unexpected/);
  const dormant = createDashboardHandler({ statusComponents: [{ ...definition, enabled: false }], get dataDirectory() { assert.fail('inactive status must not read state'); } });
  assert.deepEqual((await call(dormant, 'mods.status')).structuredContent, { components: [] });
  const unavailable = createDashboardHandler({ projectRoot, dataDirectory, stateScope:'session', statusComponents: [definition] });
  assert.equal((await call(unavailable, 'mods.status')).structuredContent.components[0].total, null);
  assert.equal((await call(unavailable, 'mods.activity')).structuredContent.statusComponents[0].total, null);
});

test('native hook subprocess stores only authored event while ordinary/legacy metadata stays off (synthetic replay)', { skip: process.platform === 'win32' }, async t => {
  const dir = await temp(t), project = join(dir, 'project'), data = join(dir, 'data'), path = join(dir, 'mods.json'); await mkdir(project);
  await writeFile(path, JSON.stringify({ version: 1, mods: [], metadataState: { enabled: false, scope: 'session', observerEvents: ['Interrupt'], componentObserverEvents: ['Stop'] } }), { mode: 0o600 });
  const env = { ...process.env, PLUGIN_ROOT: root, CODEX_MODS_CONFIG: path, CODEX_MODS_PROJECT_ROOT: project, CODEX_MODS_DATA_DIR: data };
  const invoke = input => new Promise((resolve, reject) => { const child = execFile(process.execPath, [join(root, 'src/hook-main.mjs')], { env, timeout: 5000, maxBuffer: 4096 }, (err, stdout, stderr) => err ? reject(err) : resolve({ stdout, stderr })); child.stdin.end(JSON.stringify({ ...input, cwd: project, session_id: 'synthetic-private' })); });
  for (const input of [await fixture('Interrupt'), JSON.parse(await readFile(join(root, 'fixtures/pre-tool-safe.json'), 'utf8'))]) assert.deepEqual(await invoke(input), { stdout: '{}\n', stderr: '' });
  assert.equal((await readdir(dir)).includes('data'), false);
  assert.deepEqual(await invoke(await fixture('Stop')), { stdout: '{}\n', stderr: '' });
  const state = await readMetadataState(data, { projectId: project, sessionId: 'synthetic-private' }); assert.equal(state.records, 1); assert.deepEqual(state.events, { Stop: 1 }); assert.deepEqual(state.tools, {});
  const scope=(await readdir(join(data,'metadata-state-v1'))).find(name=>/^[a-f0-9]{64}$/.test(name));
  const raw=await readFile(join(data,'metadata-state-v1',scope,'activity.jsonl'),'utf8');assert.deepEqual(Object.keys(JSON.parse(raw.trim())).sort(),['event','recordedAt']);assert.doesNotMatch(raw,/synthetic-private|assistant|transcript|model|agent/);
});
