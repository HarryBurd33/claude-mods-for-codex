import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { performance } from 'node:perf_hooks';
import { createInspectionPlan, validateInspectionPlan, inspectionConfigMatches, requireInspectionAdmission, describeInspection } from '../proofs/inspection-contract.mjs';
import { createInspectionMachine, createReadinessMachine } from '../proofs/readiness-machine.mjs';
import { runNativeInspection, runNativeInspectionFromFile, runFixedInspection, parseInspectionArgs } from '../proofs/inspection-driver.mjs';
import { runNativeReadiness, runNativeReadinessFromFile } from '../proofs/readiness-driver.mjs';
import { runNativeRouting, runNativeRoutingFromFile } from '../proofs/routing-native-driver.mjs';
import { syntheticReadinessPlan } from '../proofs/readiness-fixtures.mjs';
import { syntheticInspectionPlan, inspectionConfig, inspectionHooks, INSPECTION_SECRET } from '../proofs/inspection-fixtures.mjs';
const clone = v => structuredClone(v), portable = process.platform === 'win32';
const CLI = fileURLToPath(new URL('../proofs/inspection-driver.mjs', import.meta.url));
const noSecret = v => { const s = JSON.stringify(v); assert.ok(!s.includes(INSPECTION_SECRET)); assert.ok(!s.includes('/synthetic/')); assert.ok(!s.includes('claude mods inspection ')); };
function feed(machine, id, result) { machine.receive({ id, result }); return machine.takeOutbound(); }
function configStage() {
  const p = syntheticInspectionPlan(), m = createInspectionMachine(p); m.start(); m.takeOutbound();
  feed(m, 1, {}); return { p, m };
}

test('inspection plan has no model/task/agent payload and binds explicit OS cwd to argv', () => {
  const p = syntheticInspectionPlan('/synthetic/project with spaces');
  assert.equal(p.kind, 'inspection-only'); assert.equal(p.spawn.cwd, p.input.cwd); assert.equal(p.argv[2], p.spawn.cwd);
  assert.deepEqual(p.argv.slice(-3), ['app-server', '--stdio', '--strict-config']);
  assert.equal(p.spawn.shell, false); assert.ok(Object.isFrozen(p.input));
  assert.ok(!JSON.stringify(p).includes('model_reasoning_effort')); assert.ok(!('threadStart' in p)); assert.ok(!('turnInput' in p));
  assert.ok(!p.requirements.some(r => r.path[0] === 'agents' || r.path[0] === 'model'));
  assert.equal(p.requirements.find(r => r.path.join('.') === 'features.multi_agent_v2').value, false);
  for (const field of ['model', 'candidatePath', 'turnInput', 'startupVerified', 'executionAuthorized', 'transport', 'argv']) {
    assert.throws(() => createInspectionPlan({ ...p.input, [field]: true }));
  }
  for (const change of [v => { v.spawn.cwd = '/synthetic/other'; }, v => { v.argv.push('--remote-control'); },
    v => { v.inspectionAdmission = true; }, v => { v.target.platform = 'win32'; }]) {
    const q = clone(p); change(q); assert.throws(() => validateInspectionPlan(q));
  }
  assert.throws(() => createInspectionPlan({ ...p.input, cwd: '/synthetic/../other' }));
  assert.throws(() => createInspectionPlan({ ...p.input, disabledMcpServers: ['a', 'a'] }));
});

test('inspection and routing contracts reject cross-use and every native entry stays closed before getters', async () => {
  assert.throws(() => createInspectionMachine(syntheticReadinessPlan()));
  assert.throws(() => createReadinessMachine(syntheticInspectionPlan()));
  let reads = 0; const poison = new Proxy({}, { get() { reads++; throw Error('read'); }, ownKeys() { reads++; throw Error('enumerated'); } });
  for (const f of [runNativeInspection, runNativeInspectionFromFile, runNativeReadiness, runNativeReadinessFromFile, runNativeRouting, runNativeRoutingFromFile]) await assert.rejects(f(poison));
  assert.throws(() => requireInspectionAdmission({ authorized: true })); assert.equal(reads, 0);
  for (const key of ['executionAuthorized', 'inspectionAdmission', 'liveAdmission', 'nativeInspectionVerified', 'nativeTransportImplemented']) assert.equal(describeInspection()[key], false);
  await assert.rejects(runFixedInspection('empty', { spawn: () => { reads++; } })); assert.equal(reads, 0);
});

test('inspection command parsing cannot turn options or environment grants into native admission', () => {
  for (const args of [['--allow'], ['--run'], ['--dry-run', '--cwd', '/synthetic'], ['--run', '--plan', '/synthetic/none', '--grant']]) assert.throws(() => parseInspectionArgs(args));
  const r = spawnSync(process.execPath, [CLI, '--run', '--plan', '/synthetic/never-read'], {
    env: { CLAUDE_MODS_INSPECTION_ADMISSION: 'true', CLAUDE_MODS_LIVE_ADMISSION: 'true' }, timeout: 5000, encoding: 'utf8' });
  assert.equal(r.status, 2); assert.equal(r.stdout, ''); assert.equal(r.stderr, 'Inspection refused; native execution remains closed.\n');
});

test('inspection protocol emits only conditional five reads with same cwd and never produces authority', () => {
  const p = syntheticInspectionPlan(), m = createInspectionMachine(p), packets = [];
  m.start(); packets.push(...m.takeOutbound());
  for (const [id, result] of [[1, {}], [2, inspectionConfig(p)], [3, { requirements: null }], [4, inspectionHooks(p)], [5, inspectionConfig(p)]]) packets.push(...feed(m, id, result));
  assert.deepEqual(packets.map(x => x.rpc.method), ['initialize', 'initialized', 'config/read', 'configRequirements/read', 'hooks/list', 'config/read']);
  for (const x of packets) { assert.equal(x.domain, 'inspection-review-draft'); assert.equal(x.executionAuthorized, false); }
  assert.deepEqual(packets[2].rpc.params, { includeLayers: false, cwd: p.input.cwd }); assert.deepEqual(packets[5].rpc.params, packets[2].rpc.params);
  assert.deepEqual(packets[4].rpc.params, { cwds: [p.input.cwd] });
  const r = m.report(); assert.equal(r.outcome, 'observation-complete');
  for (const k of ['liveAdmission', 'nativeInspectionVerified', 'hookAbsenceEstablished']) assert.equal(r[k], false);
  noSecret(r);
});

test('inspection config retains plugin, policy, trust and MCP refusals before listing', () => {
  for (const mutate of [c => { c.features.plugins = true; }, c => { c.features.hooks = false; }, c => { c.bypass_hook_trust = true; },
    c => { c.features.multi_agent_v2 = true; }, c => { c.mcp_servers.extra = { enabled: false }; }, c => { c.hooks.PreToolUse = [{ hooks: [] }]; }]) {
    const { p, m } = configStage(), result = inspectionConfig(p); mutate(result.config);
    feed(m, 2, result); assert.equal(m.report().outcome, 'review-required'); assert.equal(m.report().requestsDrafted, 2); noSecret(m.report());
  }
  const { p, m } = configStage(); feed(m, 2, inspectionConfig(p));
  feed(m, 3, { requirements: { allowRemoteControl: false } }); // Conservative unsupported non-null policy, never bypassed.
  assert.equal(m.report().reason, 'requirements-review-required'); assert.equal(m.report().requestsDrafted, 3);
  assert.equal(inspectionConfigMatches(p, inspectionConfig(p).config), true);
  const emptyDefault = inspectionConfig(p).config; emptyDefault.hooks.PreToolUse = [];
  assert.equal(inspectionConfigMatches(p, emptyDefault), true); // Released empty defaults declare no handler.
});

test('inspection lists no further request after any hook/warning/error or changed config', () => {
  for (const mode of ['hook', 'warning', 'error', 'wrong-cwd', 'changed']) {
    const { p, m } = configStage(); feed(m, 2, inspectionConfig(p)); feed(m, 3, { requirements: null });
    const h = inspectionHooks(p, mode === 'hook');
    if (mode === 'warning') h.data[0].warnings.push(INSPECTION_SECRET);
    if (mode === 'error') h.data[0].errors.push({ path: INSPECTION_SECRET, message: INSPECTION_SECRET });
    if (mode === 'wrong-cwd') h.data[0].cwd = '/synthetic/other';
    const out = feed(m, 4, h);
    if (mode === 'changed') { assert.equal(out[0].rpc.id, 5); const c = inspectionConfig(p); c.config.hooks.state.synthetic.enabled = false; feed(m, 5, c); }
    else assert.equal(out.length, 0);
    assert.equal(m.report().outcome, 'review-required'); noSecret(m.report());
  }
});

test('inspection server requests get typed denials, no approval or continued read; clocks stop late data', () => {
  for (const method of ['item/permissions/requestApproval', 'item/commandExecution/requestApproval', 'unknown/execute']) {
    const { m } = configStage(); m.receive({ id: 99, method, params: { secret: INSPECTION_SECRET } });
    const out = m.takeOutbound(); assert.equal(out.length, 1); assert.equal(out[0].rpc.id, 99);
    assert.ok(!JSON.stringify(out).includes(INSPECTION_SECRET)); assert.ok(!JSON.stringify(out).includes('"approved":true'));
    assert.equal(m.report().outcome, 'review-required'); assert.equal(m.takeOutbound().length, 0);
  }
  const { m } = configStage(); m.advance(5000); feed(m, 2, {}); assert.equal(m.report().reason, 'request-timeout');
});

test('inspection fixed peer uses actual spaced temporary cwd and an empty child environment', { skip: portable }, async () => {
  const r = await runFixedInspection('empty'); assert.equal(r.outcome, 'observation-complete');
  assert.equal(r.fixedPeerCwdMatched, true); assert.equal(r.planArgvAndSpawnCwdMatched, true);
  assert.equal(r.processReaped, true); assert.equal(r.temporaryDirectoryRemoved, true); assert.equal(r.nativeProcessStarted, false); noSecret(r);
  const child = spawnSync(process.execPath, [CLI, '--dry-run'], { env: { SYNTHETIC_PARENT_SECRET: 'synthetic-do-not-inherit' }, timeout: 6000, encoding: 'utf8' });
  assert.equal(child.status, 0); assert.equal(JSON.parse(child.stdout).fixedPeerCwdMatched, true); noSecret(JSON.parse(child.stdout));
});

test('inspection fixed peer failure cases refuse and reap, without sensitive payloads', { skip: portable }, async () => {
  for (const scenario of ['wrong-cwd', 'hook', 'policy', 'changed', 'malformed', 'partial', 'oversized', 'stderr-overflow', 'server-request', 'late-notification', 'exit-failure']) {
    const r = await runFixedInspection(scenario); assert.equal(r.outcome, 'review-required', scenario);
    assert.equal(r.processReaped, true, scenario); assert.equal(r.temporaryDirectoryRemoved, true, scenario);
    assert.equal(r.liveAdmission, false); assert.equal(r.nativeProcessStarted, false); noSecret(r);
  }
});

test('inspection fixed peer cancels, bounds stalls and kills a term-ignoring owned group', { skip: portable }, async () => {
  for (const scenario of ['cancel', 'stall', 'ignore-term', 'descendant']) {
    const r = await runFixedInspection(scenario); assert.equal(r.outcome, 'review-required', scenario);
    assert.equal(r.processReaped, true, scenario); assert.equal(r.temporaryDirectoryRemoved, true, scenario);
    if (scenario === 'cancel') assert.equal(r.cancelRequested, true);
    if (scenario === 'ignore-term') assert.equal(r.peerSignalled, true);
    noSecret(r);
  }
});

test('inspection refuses buffered responses after an actual blocked-parent deadline', { skip: portable }, async () => {
  const run = runFixedInspection('delayed'); await delay(150);
  const until = performance.now() + 2800; while (performance.now() < until) { /* deliberately stall this test process */ }
  const r = await run; assert.equal(r.outcome, 'review-required'); assert.equal(r.reason, 'synthetic-transport-deadline');
  assert.equal(r.processReaped, true); assert.equal(r.temporaryDirectoryRemoved, true); noSecret(r);
});
