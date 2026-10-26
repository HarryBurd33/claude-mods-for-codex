import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createReadinessMachine, READINESS_LIMITS as L } from '../proofs/readiness-machine.mjs';
import { createReadinessFrames } from '../proofs/readiness-frames.mjs';
import { runFixedReadiness, runNativeReadiness, runNativeReadinessFromFile, parseReadinessArgs } from '../proofs/readiness-driver.mjs';
import { syntheticReadinessPlan, readinessConfig, readinessHooks, readinessHook, SECRET } from '../proofs/readiness-fixtures.mjs';
import { liveAdmission } from '../proofs/routing-contract.mjs';
const copy = x => structuredClone(x);
function take(m) { return m.takeOutbound().map(x => { assert.equal(x.domain, 'readiness-review-draft');
  assert.equal(x.executionAuthorized, false); return x.rpc; }); }
const reply = (m, id, result) => m.receive({ id, result });
function boot(config = readinessConfig(), requirements) {
  const m = createReadinessMachine(syntheticReadinessPlan()); m.start();
  assert.equal(take(m)[0].method, 'initialize'); reply(m, 1, {});
  const out = take(m); assert.equal(out[0].method, 'initialized'); assert.deepEqual(out[1].params, { includeLayers: false, cwd: '/synthetic/empty-project' });
  reply(m, 2, config);
  if (requirements !== undefined && !m.report().done) { assert.equal(take(m)[0].method, 'configRequirements/read'); reply(m, 3, requirements); }
  return m;
}
function finish(m, second = readinessConfig()) {
  assert.equal(take(m)[0].method, 'hooks/list'); reply(m, 4, readinessHooks());
  const q = take(m); assert.equal(q[0].method, 'config/read'); assert.equal(q[0].id, 5); reply(m, 5, second);
}
const noSecrets = r => assert.doesNotMatch(JSON.stringify(r), /SYNTHETIC_SENSITIVE|synthetic\/|sha256:|synthetic_mcp|currentHash|command|sourcePath/);

test('readiness native entry and CLI stay closed before plan/path/getter IO; fixed args grant nothing', async () => {
  let reads = 0; const p = Object.defineProperty({}, 'input', { get() { reads++; throw Error(SECRET); } });
  await assert.rejects(runNativeReadiness(p), /dry-only/); await assert.rejects(runNativeReadinessFromFile(p), /dry-only/);
  const r = spawnSync(process.execPath, ['proofs/readiness-driver.mjs', '--run', '--plan', '/synthetic/missing'], { encoding: 'utf8' });
  assert.equal(r.status, 2); assert.equal(r.stdout, ''); assert.equal(reads, 0); assert.equal(liveAdmission({ approved: true }).admitted, false);
  for (const a of [[], ['--live'], ['--dry-run', '--command', 'codex'], ['--dry-run', '--scenario', '../peer'],
    ['--dry-run', '--scenario', 'empty', '--grant'], ['--run', '--plan', 'relative']]) assert.throws(() => parseReadinessArgs(a));
  const a = ['--dry-run']; Object.defineProperty(a, '0', { get() { assert.fail('getter'); } }); assert.throws(() => parseReadinessArgs(a));
  await assert.rejects(runFixedReadiness(p));
});

test('empty discovery completes exactly five conditional requests and same-cwd config bracket without native authority', () => {
  const before = readinessConfig(), saved = JSON.stringify(before);
  const m = boot(before, { requirements: null }); finish(m);
  const r = m.report(); assert.equal(r.outcome, 'observation-complete'); assert.equal(r.requestsDrafted, 5);
  assert.equal(r.completedRequests, 5); assert.equal(r.configProjectionStable, true); assert.equal(r.listedHookCount, 0);
  assert.equal(r.hookAbsenceEstablished, false); assert.equal(r.builtinHooksOmittedByHost, true);
  assert.equal(r.executionAuthorized, false); assert.equal(r.nativeInspectionVerified, false);
  assert.equal(JSON.stringify(before), saved); noSecrets(r); assert.deepEqual(take(m), []);
});

test('config mismatch, hooks off, plugin policy, malformed MCP and trust bypass stop before requirements/listing', () => {
  for (const mutate of [r => { r.config.features.plugins = true; }, r => { r.config.features.plugin_hooks = true; },
    r => { r.config.features.hooks = false; }, r => { delete r.config.features.hooks; },
    r => { r.config.mcp_servers = null; }, r => { r.config.mcp_servers.extra = { enabled: false }; },
    r => { r.config.bypass_hook_trust = true; }, r => { r.config.hooks.PreToolUse = [{ hooks: [{ command: SECRET }] }]; },
    r => { r.layers = [{ config: SECRET }]; }, r => { r.config.multi_agent_v2.message_board_remote = true; },
    r => { r.config.approvals_reviewer = 'auto_review'; }]) {
    const r = readinessConfig(); mutate(r); const m = boot(r); assert.equal(m.report().reason, 'config-mismatch');
    assert.deepEqual(take(m), []); assert.equal(m.report().requestsDrafted, 2); noSecrets(m.report());
  }
});

test('managed requirements are explicitly projected; unknown, non-null opaque, hook and conflicting policy stop before listing', () => {
  for (const requirements of [null, {}, { featureRequirements: { plugins: false, hooks: true }, allowManagedHooksOnly: false },
    { hooks: null, modelProvider: null, additionalDeveloperInstructions: null }]) {
    const m = boot(readinessConfig(), { requirements, supportsIndependentSpeedModes: true }); finish(m); assert.equal(m.report().outcome, 'observation-complete');
  }
  for (const result of [{}, { requirements: false }, { requirements: [] }, { requirements: { hooks: {} } },
    { requirements: { modelProvider: SECRET } }, { requirements: { unknown: null } },
    { requirements: { allowedApprovalPolicies: ['onRequest'] } }, { requirements: { allowManagedHooksOnly: true } },
    { requirements: { featureRequirements: { plugins: true } } }, { requirements: { featureRequirements: { unknown: true } } },
    { requirements: null, unknown: true }, { requirements: null, supportsIndependentSpeedModes: SECRET }]) {
    const m = boot(readinessConfig(), result); assert.equal(m.report().reason, 'requirements-review-required');
    assert.deepEqual(take(m), []); assert.equal(m.report().requestsDrafted, 3); noSecrets(m.report());
  }
});

test('every hook including disabled, untrusted and managed entries requires review and retains categories only', () => {
  for (const state of [{ enabled: false, trustStatus: 'untrusted' }, { enabled: true, trustStatus: 'trusted' },
    { enabled: true, trustStatus: 'managed', source: 'system', isManaged: true }, { enabled: false, trustStatus: 'modified' },
    { enabled: false, trustStatus: 'untrusted', matcher: '', statusMessage: '' }]) {
    const m = boot(readinessConfig(), { requirements: null }); take(m);
    reply(m, 4, readinessHooks(undefined, [{ ...readinessHook(), ...state }]));
    const r = m.report(); assert.equal(r.reason, 'hooks-require-review'); assert.equal(r.listedHookCount, 1);
    assert.equal(r.hookCategories.trust[state.trustStatus], 1); assert.equal(r.requestsDrafted, 4); noSecrets(r);
  }
});

test('warnings/errors, wrong or extra cwd, excess hooks, unknown enums/fields and unsupported handlers remain incomplete', () => {
  const changes = [r => { r.data[0].warnings = [SECRET]; }, r => { r.data[0].errors = [{ path: SECRET, message: SECRET }]; },
    r => { r.data[0].cwd = '/other'; }, r => { r.data.push(copy(r.data[0])); }, r => { r.data = []; },
    r => { r.data[0].hooks = Array.from({ length: 257 }, readinessHook); },
    r => { r.data[0].hooks = [{ ...readinessHook(), eventName: SECRET }]; },
    r => { r.data[0].hooks = [{ ...readinessHook(), unknown: SECRET }]; },
    r => { r.data[0].hooks = [{ ...readinessHook(), handlerType: 'agent' }]; },
    r => { r.data[0].warnings = null; }, r => { r.data[0].errors = [SECRET]; }];
  for (const change of changes) {
    const m = boot(readinessConfig(), { requirements: null }); take(m); const h = readinessHooks(); change(h); reply(m, 4, h);
    assert.equal(m.report().outcome, 'review-required'); assert.deepEqual(take(m), []); assert.equal(m.report().requestsDrafted, 4); noSecrets(m.report());
  }
});

test('projection is stable under key order/unrelated sensitive fields, but state changes stop; no digest is exposed', () => {
  const reordered = readinessConfig(); reordered.config = Object.fromEntries(Object.entries(reordered.config).reverse());
  reordered.config.hooks.state.synthetic = { trusted_hash: 'sha256:synthetic', enabled: true }; reordered.config.unrelatedSensitive = 'CHANGED_' + SECRET;
  const m = boot(readinessConfig(), { requirements: null }); finish(m, reordered); assert.equal(m.report().configProjectionStable, true); noSecrets(m.report());
  const changed = readinessConfig(); changed.config.hooks.state.synthetic.enabled = false;
  const n = boot(readinessConfig(), { requirements: null }); finish(n, changed); assert.equal(n.report().reason, 'config-changed'); noSecrets(n.report());
});

test('known and unknown server requests get one denial, never successful approval, then stop and purge unsent work', () => {
  for (const method of ['item/commandExecution/requestApproval', 'item/permissions/requestApproval', 'mcpServer/elicitation/request', SECRET]) {
    const m = boot(); m.receive({ id: 99, method, params: { sensitive: SECRET } });
    const out = take(m); assert.equal(out.length, 1); assert.equal(out[0].id, 99);
    assert.ok(out[0].error || out[0].result?.decision === 'cancel' || out[0].result?.action === 'decline' || out[0].result?.permissions);
    assert.equal(m.report().reason, 'server-request-denied'); m.receive({ id: 100, method }); assert.deepEqual(take(m), []); noSecrets(m.report());
  }
});

test('unexpected notifications/responses/errors/accessors and post-completion packets cannot produce successful observation', () => {
  let reads = 0;
  const getter = Object.defineProperty({}, 'id', { enumerable: true, get() { reads++; return 1; } });
  for (const packet of [getter, { id: 72, result: {} }, { method: 'thread/started', params: { secret: SECRET } },
    { id: 1, result: {}, error: {} }, { id: 1, error: { message: SECRET } }, { id: 1, result: {}, jsonrpc: '3.0' }]) {
    const m = createReadinessMachine(syntheticReadinessPlan()); m.start(); take(m); m.receive(packet);
    assert.equal(m.report().outcome, 'review-required'); assert.deepEqual(take(m), []); noSecrets(m.report());
  }
  assert.equal(reads, 0);
  const m = boot(readinessConfig(), { requirements: null }); finish(m); m.receive({ method: 'thread/started', params: {} });
  assert.equal(m.report().reason, 'unsupported-notification');
  const n = boot(); n.abort(SECRET); assert.equal(n.report().reason, 'driver-error'); noSecrets(n.report());
});

test('fake-clock request/work deadline, invalid clock and cancellation purge drafts before more RPC', () => {
  const m = createReadinessMachine(syntheticReadinessPlan()); m.start(); take(m); m.advance(L.requestMs);
  assert.equal(m.report().reason, 'request-timeout'); assert.deepEqual(take(m), []);
  const n = createReadinessMachine(syntheticReadinessPlan()); n.start(); n.advance(L.workMs);
  assert.equal(n.report().reason, 'work-timeout'); assert.deepEqual(take(n), []);
  const a = boot(); a.advance(-1); assert.equal(a.report().reason, 'invalid-clock'); assert.deepEqual(take(a), []);
  const b = boot(); b.abort('operator-cancelled'); assert.deepEqual(take(b), []); reply(b, 3, { requirements: null }); assert.deepEqual(take(b), []);
});

test('framing accepts split UTF-8 JSON and bounds stdout/stderr, frames, message count, invalid and incomplete data', () => {
  let packet; const good = createReadinessFrames(p => { packet = p; }, () => assert.fail());
  const wire = Buffer.from('{"unicode":"é"}\n'); for (const byte of wire) good.push(Buffer.from([byte])); assert.equal(packet.unicode, 'é');
  for (const [input, stderr, expected] of [[Buffer.alloc(L.bytes + 1), true, 'byte-limit'], [Buffer.alloc(L.frameBytes + 1), false, 'frame-limit'],
    [Buffer.from('x\n'), false, 'malformed-protocol'], [Buffer.from([255, 10]), false, 'malformed-protocol']]) {
    let reason; const f = createReadinessFrames(() => {}, r => { reason = r; }); f.push(input, stderr); assert.equal(reason, expected); assert.equal(f.counters().framingFailed, true);
  }
  let reason; const f = createReadinessFrames(() => {}, r => { reason = r; }); f.push(Buffer.from('{}\n'.repeat(L.messages + 1))); assert.equal(reason, 'message-limit');
  const p = createReadinessFrames(() => assert.fail(), r => { reason = r; }); p.push(Buffer.from('{')); p.finish(); assert.equal(reason, 'incomplete-frame');
});

test('actual fixed peer completes, isolates environment and never leaks synthetic sensitive values', async () => {
  process.env.SYNTHETIC_PARENT_SECRET = SECRET;
  try { const r = await runFixedReadiness(); assert.equal(r.outcome, 'observation-complete'); assert.equal(r.processReaped, true);
    assert.equal(r.sentRequests, 5); assert.equal(r.nativeProcessStarted, false); assert.equal(r.nativeInspectionVerified, false); noSecrets(r); }
  finally { delete process.env.SYNTHETIC_PARENT_SECRET; }
});

test('actual fixed peer rejects hooks, policy, changed projection, framing, request, late notification and nonzero exit', async () => {
  for (const scenario of ['hook', 'policy', 'changed', 'malformed', 'partial', 'oversized', 'stderr-overflow', 'server-request', 'late-notification', 'exit-failure']) {
    const r = await runFixedReadiness(scenario); assert.equal(r.outcome, 'review-required', scenario); assert.equal(r.processReaped, true, scenario);
    assert.equal(r.nativeProcessStarted, false); noSecrets(r);
  }
});

test('fixed stalled/cancelled peers are stopped and reaped within bounded cleanup', async () => {
  for (const scenario of ['stall', 'cancel']) {
    const r = await runFixedReadiness(scenario); assert.equal(r.outcome, 'review-required'); assert.equal(r.processReaped, true);
    assert.equal(r.reason, scenario === 'cancel' ? 'operator-cancelled' : 'synthetic-transport-deadline'); noSecrets(r);
  }
});

test('actual POSIX SIGINT reaches the fixed runner cancellation path and reaps its peer', { skip: process.platform === 'win32' }, () => {
  const code = `import { runFixedReadiness } from './proofs/readiness-driver.mjs';
    const pending = runFixedReadiness('ignore-term');
    process.kill(process.pid, 'SIGINT');
    process.stdout.write(JSON.stringify(await pending));`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8', timeout: 10000 });
  assert.equal(r.status, 0); const report = JSON.parse(r.stdout);
  assert.equal(report.reason, 'operator-cancelled'); assert.equal(report.cancelRequested, true);
  assert.equal(report.processReaped, true); assert.equal(report.nativeProcessStarted, false); noSecrets(report);
});

test('POSIX owned group cleanup reaps term-ignoring peer and exited-leader descendant holding pipes', { skip: process.platform === 'win32' }, async () => {
  for (const scenario of ['ignore-term', 'descendant']) {
    const r = await runFixedReadiness(scenario); assert.equal(r.outcome, 'review-required'); assert.equal(r.processReaped, true, scenario);
    assert.equal(r.forcedTermination, true); noSecrets(r);
  }
});

test('fixed driver exposes no transport injection and CLI output remains a bounded sanitized offline report', async () => {
  const r = spawnSync(process.execPath, ['proofs/readiness-driver.mjs', '--dry-run'], { encoding: 'utf8', timeout: 10000 });
  assert.equal(r.status, 0); const report = JSON.parse(r.stdout); assert.equal(report.synthetic, true); noSecrets(report);
  const source = await readFile(new URL('../proofs/readiness-driver.mjs', import.meta.url), 'utf8');
  assert.match(source, /spawn\(process\.execPath, \[PEER, scenario\]/); assert.match(source, /env: \{\}/);
  assert.doesNotMatch(source, /export (async )?function executeReadiness/);
  const leaf = await readFile(new URL('../proofs/readiness-leaf.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(leaf, /import |fetch\(|exec\(|readFile|writeFile/);
});
