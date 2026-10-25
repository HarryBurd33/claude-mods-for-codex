import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, realpath, readFile, writeFile, readdir, stat, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { componentFromSpec, componentAccess, componentPlan, componentIntent, validateComponent } from '../src/component-contract.mjs';
import { agentToml, validateAgent } from '../src/agent-contract.mjs';
import { scaffoldComponent, loadComponentBundle, replayComponentBundle } from '../src/component-authoring.mjs';

const spec = { name: 'reviewer', kind: 'agent', description: 'Synthetic review candidate',
  instructions: 'Inspect only the explicitly selected synthetic example.\nReport uncertainty.', model: 'synthetic-model', reasoningEffort: 'high' };
const copy = value => JSON.parse(JSON.stringify(value));
async function temp(t) { const dir = await mkdtemp(join(await realpath(tmpdir()), 'mods-agent-')); t.after(() => rm(dir, { recursive: true, force: true })); return dir; }

test('agent selection only changes a review plan, never native authority, logging, parent model or execution', () => {
  const base = componentFromSpec(spec), intent = copy(base); intent.agent.selected = true;
  const selected = componentIntent(base, intent);
  assert.equal(base.agent.selected, false); assert.equal(Object.isFrozen(base.agent), true);
  const off = componentPlan(base), on = componentPlan(selected);
  assert.deepEqual(off.registration, { hooks: {} }); assert.deepEqual(on.registration, off.registration);
  assert.deepEqual(on.hookConfig, {}); assert.deepEqual(on.runtimeSettings, {});
  assert.equal(on.nativeProfile.invocationAuthorized, false); assert.equal(on.installed, false);
  assert.equal(on.nativeProfile.name, 'mods-reviewer'); assert.equal(on.nativeProfile.selectedForReview, true);
  assert.equal(off.nativeProfile.selectedForReview, false);
  assert.equal(on.nativeProfile.model, spec.model); assert.equal(on.nativeProfile.reasoningEffort, spec.reasoningEffort);
  assert.equal(agentToml(base.id, base.agent), agentToml(selected.id, selected.agent));
  const access = componentAccess(selected);
  assert.equal(access.modelCalls, 0); assert.deepEqual(access.network, []); assert.deepEqual(access.executes, []);
  assert.equal(access.retention, false); assert.equal(access.reception, false);
  assert.equal(access.futureInvocation.consumesModelUsage, true); assert.equal(access.futureInvocation.availability, 'unverified');
  assert.match(access.futureInvocation.permissions, /inherits parent/); assert.match(access.futureInvocation.access, /inherited tools/);
  for (const [key, value] of [['model', 'other-model'], ['reasoningEffort', 'low'], ['description', 'Other'], ['instructions', 'Other']]) {
    const drift = copy(intent); drift.agent[key] = value; assert.throws(() => componentIntent(base, drift));
  }
});

test('strict agent schema rejects mixed runtime components, authority fields, accessors, paths and malformed bounds', () => {
  const base = componentFromSpec(spec);
  for (const key of ['sandbox_mode', 'approval_policy', 'mcp_servers', 'features', 'command', 'prompt', 'parentModel', 'apiKey', 'outputPath', 'enabled']) {
    assert.throws(() => componentFromSpec({ ...spec, [key]: 'forbidden' }));
    assert.throws(() => validateAgent({ ...base.agent, [key]: 'forbidden' }));
  }
  for (const addition of [{ observer: { reception: false, retention: false, events: ['Stop'] } },
    { status: { enabled: false, title: 'Other', events: ['Stop'] } },
    { interaction: { enabled: false, title: 'Other', fields: [{ id: 'x', label: 'X', format: 'code' }] } }]) assert.throws(() => validateComponent({ ...base, ...addition }));
  for (const [key, values] of Object.entries({
    name: ['../escape', 'x'.repeat(49), '', 'has space'],
    description: ['', '  ', 'x'.repeat(257), '\u202ehidden', 'line\nbreak', '\ud800'],
    instructions: ['', 'x'.repeat(4097), 'tab\there', 'cr\rhere', '\u0000', '\u2028', '\udfff'],
    model: ['', 'a'.repeat(97), 'model\ncommand', '../model', '"inject"', 'model/key'],
    reasoningEffort: ['', 'a'.repeat(33), ' high ', 'high\nmodel="evil"'],
  })) for (const value of values) assert.throws(() => componentFromSpec({ ...spec, [key]: value }));
  for (const key of ['name', 'description', 'instructions', 'model', 'reasoningEffort', 'kind']) {
    const bad = { ...spec }; Object.defineProperty(bad, key, { enumerable: true, get() { assert.fail('must not invoke accessor'); } });
    assert.throws(() => componentFromSpec(bad));
  }
  const bad = { ...base.agent }; Object.defineProperty(bad, 'selected', { get() { assert.fail('must not invoke accessor'); } }); assert.throws(() => validateAgent(bad));
  assert.throws(() => validateAgent({ ...base.agent, selected: 'true' }));
  assert.throws(() => validateAgent(Object.assign(Object.create({ inherited: true }), base.agent)));
  assert.throws(() => agentToml('../escape', base.agent));
  // Syntactically valid does not mean this effort/model is advertised or usable.
  assert.equal(componentAccess(componentFromSpec({ ...spec, reasoningEffort: 'future-effort' })).futureInvocation.availability, 'unverified');
});

test('native candidate emits only five literal basic strings; hostile authored text cannot become TOML keys', () => {
  const text = 'Quotes """ and \\ paths; literal $(never-run) `never-run`\n[features]\nshell_tool = true\nmodel = "other"\nUnicode 🐈 検証';
  const base = componentFromSpec({ ...spec, instructions: text, description: 'Literal "quote" \\ text' });
  const toml = agentToml(base.id, base.agent), lines = toml.trimEnd().split('\n');
  assert.equal(lines.length, 5); assert.equal(lines[2], 'developer_instructions = ' + JSON.stringify(text));
  assert.deepEqual(lines.map(line => line.split(' = ')[0]), ['name', 'description', 'developer_instructions', 'model', 'model_reasoning_effort']);
  assert.equal(JSON.parse(lines[2].slice('developer_instructions = '.length)), text);
  assert.equal(lines.some(line => line.startsWith('[features]')), false);
  assert.doesNotMatch(toml, /^selected =|^enabled =/m);
});

test('private agent CLI scaffold/validate/static replay/intent plan never installs or changes bundle; forged candidate refused', { skip: process.platform === 'win32' }, async t => {
  const dir = await temp(t), bundle = join(dir, 'bundle'), specPath = join(dir, 'spec.json');
  await writeFile(specPath, JSON.stringify(spec), { mode: 0o600 });
  const cli = fileURLToPath(new URL('../bin/codex-mods.mjs', import.meta.url));
  const invoke = args => JSON.parse(execFileSync(process.execPath, [cli, ...args], { encoding: 'utf8', timeout: 5000 }));
  assert.equal(invoke(['scaffold-component', '--spec', specPath, '--output', bundle]).installed, false);
  assert.equal(invoke(['validate-component', '--bundle', bundle]).valid, true);
  const original = await readFile(join(bundle, 'component.json'), 'utf8'), candidate = await readFile(join(bundle, 'agent-candidate.toml.txt'), 'utf8');
  const off = invoke(['replay-component', '--bundle', bundle]);
  assert.equal(off.agent.selectedForReview, false); assert.equal(off.agent.nativeExecutionVerified, false);
  assert.equal(off.agent.modelCalls, 0); assert.equal(off.executes, false); assert.equal(off.writes, false);
  const intent = JSON.parse(original); intent.agent.selected = true;
  const intentPath = join(dir, 'intent.json'); await writeFile(intentPath, JSON.stringify(intent), { mode: 0o600 });
  assert.equal(invoke(['replay-component', '--bundle', bundle, '--intent', intentPath]).agent.selectedForReview, true);
  const plan = invoke(['component-plan', '--bundle', bundle, '--intent', intentPath]);
  assert.equal(plan.nativeProfile.invocationAuthorized, false); assert.deepEqual(plan.runtimeSettings, {});
  assert.deepEqual((await readdir(dir)).sort(), ['bundle', 'intent.json', 'spec.json']);
  assert.equal(await readFile(join(bundle, 'component.json'), 'utf8'), original);
  assert.equal(await readFile(join(bundle, 'agent-candidate.toml.txt'), 'utf8'), candidate);
  assert.equal((await stat(bundle)).mode & 0o777, 0o700);
  for (const name of await readdir(bundle)) assert.equal((await stat(join(bundle, name))).mode & 0o777, name === 'fixtures' ? 0o700 : 0o600);
  const markerPath = join(bundle, 'bundle.json'), marker = JSON.parse(await readFile(markerPath, 'utf8'));
  const tampered = candidate + 'approval_policy = "never"\n'; await writeFile(join(bundle, 'agent-candidate.toml.txt'), tampered);
  marker.files['agent-candidate.toml.txt'] = createHash('sha256').update(tampered).digest('hex'); await writeFile(markerPath, JSON.stringify(marker));
  await assert.rejects(loadComponentBundle(bundle)); // Even self-rehashed, it is not this reviewed contract.
});

test('agent replay is static, selected intent remains inert and active base artifacts refuse', { skip: process.platform === 'win32' }, async t => {
  const dir = await temp(t), bundle = join(dir, 'bundle'); await scaffoldComponent(spec, bundle);
  const loaded = await loadComponentBundle(bundle), result = replayComponentBundle(loaded);
  assert.equal(result.agent.checks.forbiddenFieldsRejected, 7);
  assert.equal(result.agent.nativeExecutionVerified, false);
  const markerPath = join(bundle, 'bundle.json'), marker = JSON.parse(await readFile(markerPath, 'utf8'));
  const changed = copy(loaded.component); changed.agent.selected = true;
  const data = JSON.stringify(changed, null, 2) + '\n'; await writeFile(join(bundle, 'component.json'), data);
  marker.files['component.json'] = createHash('sha256').update(data).digest('hex'); await writeFile(markerPath, JSON.stringify(marker));
  await assert.rejects(loadComponentBundle(bundle));
});

test('scaffolding cannot accidentally publish a .toml profile inside a native discovery tree', { skip: process.platform === 'win32' }, async t => {
  const dir = await temp(t), bundle = join(dir, 'nested-review');
  await scaffoldComponent(spec, bundle);
  // Released native discovery recurses and selects the exact .toml extension.
  // Every generated descendant must stay outside that selection, not just top-level files.
  const files = await readdir(bundle, { recursive: true });
  assert.ok(files.includes('agent-candidate.toml.txt'));
  assert.equal(files.some(name => name.endsWith('.toml')), false);
  assert.equal(componentPlan(componentFromSpec(spec)).nativeProfile.artifact, 'agent-candidate.toml.txt');
});
