import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createNativePlan, validateNativePlan, nativeConfigMatches, CANDIDATE_SHA256 } from '../proofs/routing-native-plan.mjs';
import { createNativeRoutingAdapter } from '../proofs/routing-native-adapter.mjs';
import { runNativeRouting, runNativeRoutingFromFile, parseNativeDriverArgs } from '../proofs/routing-native-driver.mjs';
import { ROUTE, BOUNDS } from '../proofs/routing-contract.mjs';
import { PARENT, CHILD, PTURN, CTURN, notify, parentResult, catalogResult, childThread,
  turnStarted, turnCompleted, selection, message, usage, itemPacket } from '../proofs/routing-fixtures.mjs';

const input = () => ({ cliPath: '/review/codex', cliSha256: 'a'.repeat(64), cwd: '/review/empty project',
  candidatePath: '/review/agent-candidate.toml.txt', candidateSha256: CANDIDATE_SHA256,
  configFiles: [{ path: '/review/config.toml', sha256: 'b'.repeat(64) }], disabledMcpServers: ['selected_server'] });
const plan = () => createNativePlan(input());
const copy = x => JSON.parse(JSON.stringify(x));
function config(p = plan()) {
  const v = {};
  for (const r of p.requirements) { let target = v; for (const name of r.path.slice(0, -1)) target = target[name] ??= {}; target[r.path.at(-1)] = r.value; }
  return v;
}
function out(a) { return a.takeOutbound().map(x => { assert.equal(x.domain, 'native-review-draft'); assert.equal(x.executionAuthorized, false); return x.rpc; }); }
const respond = (a, q, result) => a.receive({ id: q.id, result });
const nativeParent = () => ({ ...parentResult(), cwd: input().cwd, thread: { id: PARENT, ephemeral: true, cliVersion: '0.164.0' } });
const nativeChild = () => ({ ...childThread(), cwd: input().cwd, cliVersion: '0.164.0' });
function packet(p) { const v = copy(p); v.params.turnId ??= v.params.threadId === PARENT ? PTURN : CTURN; return v; }
function boot({ configValue, beforeParent = false, beforeTurn = false } = {}) {
  const a = createNativeRoutingAdapter(plan()); a.start(); respond(a, out(a)[0], {});
  let q = out(a); assert.equal(q[0].method, 'initialized'); assert.equal(q[1].method, 'config/read');
  respond(a, q[1], { config: configValue ?? config() });
  if (configValue) return a;
  q = out(a); assert.equal(q[0].method, 'model/list'); respond(a, q[0], catalogResult());
  q = out(a); assert.equal(q[0].method, 'thread/start'); assert.equal(q[0].params.cwd, input().cwd);
  if (beforeParent) return { a, parentRequest: q[0] };
  respond(a, q[0], nativeParent()); q = out(a); assert.equal(q[0].method, 'turn/start');
  assert.equal(q[0].params.model, ROUTE.parentModel); assert.equal(q[0].params.effort, 'low');
  if (beforeTurn) return { a, turnRequest: q[0] };
  respond(a, q[0], { turn: { id: PTURN } }); a.receive(turnStarted(PARENT, PTURN)); return { a };
}
function child(a, turn = true) {
  a.receive(notify('thread/started', { thread: nativeChild() }));
  if (turn) a.receive(turnStarted(CHILD, CTURN));
  a.receive(packet(selection()));
  const q = out(a).find(q => q.method === 'thread/read'); assert.equal(q.params.threadId, CHILD); assert.equal(q.params.includeTurns, false);
  respond(a, q, { thread: nativeChild() });
}
function finish(a, childUsage = true) {
  a.receive(packet(message(CHILD))); if (childUsage) a.receive(usage(CHILD, 10)); a.receive(turnCompleted(CHILD, CTURN));
  a.receive(packet(message(PARENT))); a.receive(usage(PARENT, 20)); a.receive(turnCompleted(PARENT, PTURN)); a.advance(BOUNDS.settleMs);
}
function clean(a, terminal = true) {
  const seen = [];
  for (let i = 0; i < 8; i++) {
    const qs = out(a); if (!qs.length) break;
    for (const q of qs) {
      seen.push(q);
      if (q.method === 'turn/interrupt') { respond(a, q, {}); if (terminal) a.receive(turnCompleted(q.params.threadId, q.params.turnId, 'interrupted')); }
      if (q.method === 'thread/unsubscribe') respond(a, q, { status: 'unsubscribed' });
    }
  }
  return seen;
}

test('native review plan pins V2 and exact reductions without a shell, grants or V1 depth claim', () => {
  const p = plan(); assert.equal(p.liveAdmission, false); assert.equal(p.authorization, 'absent'); assert.ok(Object.isFrozen(p.argv));
  assert.ok(p.argv.includes('features.shell_tool=false'));
  assert.ok(p.argv.includes('agents.mods-native-route-check.config_file=' + JSON.stringify(input().candidatePath)));
  assert.equal(p.argv.at(-1), 'app-server'); assert.equal(p.argv.includes('--no-daemon'), true);
  assert.equal(p.requirements.some(r => r.path.join('.') === 'agents.max_depth'), false);
  assert.equal(p.requirements.find(r => r.path.join('.') === 'features.multi_agent_v2').value, true);
  assert.equal(p.requirements.find(r => r.path.join('.') === 'features.shell_tool').value, false);
  assert.doesNotMatch(p.turnInput[0].text, /MODS_NATIVE_ROUTING_CHILD_OK|fork_context/);
  assert.match(p.turnInput[0].text, /fork_turns "none"/);
  assert.equal(p.threadStart.experimentalRawEvents, false); assert.equal(p.threadStart.approvalsReviewer, 'user');
  assert.deepEqual(validateNativePlan(copy(p)), p);
  for (const change of [x => { x.argv.push('--yolo'); }, x => { x.liveAdmission = true; }, x => { x.threadStart.model = 'other'; },
    x => { x.input.cwd = '/other'; }, x => { x.bounds.tokens = 1e9; }]) { const v = copy(p); change(v); assert.throws(() => validateNativePlan(v)); }
});

test('native review rejects input accessors, traversal, altered candidate, duplicate or excessive server selections', () => {
  const bad = Object.defineProperty({}, 'cliPath', { get() { assert.fail('getter executed'); } }); assert.throws(() => createNativePlan(bad));
  for (const change of [x => { x.cwd = '/a/../b'; }, x => { x.cliPath = 'codex'; }, x => { x.candidateSha256 = 'a'.repeat(64); },
    x => { x.configFiles = []; }, x => { x.disabledMcpServers = ['a', 'a']; }, x => { x.disabledMcpServers = ['bad.key']; },
    x => { x.disabledMcpServers = Array.from({ length: 65 }, (_, i) => 's' + i); }, x => { x.authorization = true; }]) {
    const v = input(); change(v); assert.throws(() => createNativePlan(v));
  }
});

test('native execution refuses before any plan/path accessor, file read or process launch', async () => {
  const bad = new Proxy({}, { get() { assert.fail('native gate touched input'); }, ownKeys() { assert.fail('native gate inspected input'); } });
  await assert.rejects(runNativeRouting(bad), /dry-only/); await assert.rejects(runNativeRoutingFromFile(bad), /dry-only/);
  const cli = fileURLToPath(new URL('../proofs/routing-native-driver.mjs', import.meta.url));
  const r = spawnSync(process.execPath, [cli, '--run', '--plan', '/nonexistent/never-read.json'], { encoding: 'utf8', timeout: 3000 });
  assert.equal(r.status, 2); assert.equal(r.stdout, ''); assert.match(r.stderr, /closed/);
  const d = spawnSync(process.execPath, [cli, '--describe'], { encoding: 'utf8', timeout: 3000 });
  assert.equal(d.status, 0); assert.equal(JSON.parse(d.stdout).executionAuthorized, false);
  for (const x of [[], ['--run'], ['--live'], ['--describe', '--grant', 'yes']]) assert.throws(() => parseNativeDriverArgs(x));
});

test('native resolved config check rejects missing reducers, extra MCP, ambient hooks and remote board', () => {
  const p = plan(); assert.equal(nativeConfigMatches(p, config()), true);
  for (const change of [v => { delete v.features.plugin_hooks; }, v => { v.features.shell_tool = true; },
    v => { v.mcp_servers.other = { enabled: true }; }, v => { v.mcp_servers.selected_server.enabled = true; },
    v => { v.hooks = { PreToolUse: [] }; }, v => { v.multi_agent_v2.message_board_remote = {}; }]) {
    const c = config(); change(c); assert.equal(nativeConfigMatches(p, c), false);
    const a = boot({ configValue: c }); assert.equal(a.report().reason, 'config-mismatch'); assert.equal(a.report().draftTurnStarts, 0);
    assert.ok(out(a).every(q => q.method !== 'thread/start'));
  }
});

test('native V2 packets produce separate evidence fields and never native or inference verification', () => {
  const { a } = boot(); child(a); finish(a); clean(a); const r = a.report();
  assert.equal(r.outcome, 'passed'); assert.equal(r.resolvedSelection, 'v2'); assert.equal(r.childMetadataMatched, true);
  assert.deepEqual(r.usage, { parent: 20, child: 10, combined: 30 }); assert.equal(r.cleanupConfirmed, true);
  assert.equal(r.draftTurnStarts, 1); assert.equal(r.nativeRoutingVerified, false); assert.equal(r.nativeInferenceCalls, null);
  assert.equal(r.executionAuthorized, false); assert.equal(r.liveAdmission, false); assert.equal(r.exactToolAdmission, false);
  assert.doesNotMatch(JSON.stringify(r), /synthetic-parent|synthetic-child|\/review|SYNTHETIC_SECRET|prompt/);
});

test('native missing child usage remains unavailable and metadata-only reads never become history reads', () => {
  const { a } = boot(); child(a); finish(a, false); clean(a); const r = a.report();
  assert.equal(r.outcome, 'incomplete'); assert.equal(r.usage.child, null); assert.equal(r.usage.combined, null);
});

test('native V1, requested-only metadata and wrong versions do not establish configured V2 selection', () => {
  const { a } = boot(); a.receive(packet(selection('v1'))); assert.equal(a.report().reason, 'unexpected-action');
  const b = boot({ beforeParent: true }); const r = nativeParent(); r.thread.cliVersion = 'other'; respond(b.a, b.parentRequest, r);
  assert.equal(b.a.report().draftTurnStarts, 0); assert.equal(b.a.report().reason, 'parent-mismatch');
  const c = boot(); const q = packet(selection()); q.method = 'item/started'; c.a.receive(q); assert.equal(c.a.report().resolvedSelection, 'unavailable');
  q.params.item.id = 'second-spawn'; c.a.receive(q); assert.equal(c.a.report().reason, 'extra-child');
});

test('native events require own turn identity; deltas are discarded and unexpected tools stop after observation', () => {
  for (const event of [packet(itemPacket(PARENT, { id: 'cmd', type: 'commandExecution', command: 'SYNTHETIC_SECRET' })),
    { ...usage(PARENT, 10), params: { ...usage(PARENT, 10).params, turnId: 'wrong-turn' } },
    notify('item/agentMessage/delta', { threadId: PARENT, turnId: 'wrong-turn', delta: 'SYNTHETIC_SECRET' })]) {
    const { a } = boot(); a.receive(event); assert.notEqual(a.report().reason, null); assert.doesNotMatch(JSON.stringify(a.report()), /SYNTHETIC_SECRET/);
  }
  const { a } = boot(); a.receive(notify('item/agentMessage/delta', { threadId: PARENT, turnId: PTURN, delta: 'SYNTHETIC_SECRET' }));
  assert.equal(a.report().reason, null); assert.equal(a.report().outputMatched, false);
});

test('native typed denials never approve and cancellation ACK is not a terminal event', () => {
  const { a } = boot(); child(a); a.receive({ id: 'request', method: 'item/commandExecution/requestApproval', params: { threadId: PARENT } });
  const q = out(a); assert.deepEqual(q[0], { id: 'request', result: { decision: 'cancel' } });
  for (const r of q.slice(1)) if (r.method === 'turn/interrupt') respond(a, r, {});
  assert.equal(a.report().cleanupConfirmed, false); a.advance(BOUNDS.cleanupMs + BOUNDS.cleanupGraceMs); assert.equal(a.report().cancellationExpired, true);
});

test('native child without turn visibility cannot claim confirmed cleanup or interrupt an unrelated thread', () => {
  const { a } = boot(); child(a, false); a.abort('operator-cancelled'); clean(a);
  assert.equal(a.report().cleanupConfirmed, false); a.advance(BOUNDS.cleanupMs + BOUNDS.cleanupGraceMs); clean(a);
  assert.equal(a.report().cancellationExpired, true); assert.equal(a.report().cleanupConfirmed, false);
  const b = boot(); b.a.receive(turnStarted('unrelated', 'unknown')); assert.equal(b.a.report().untrackedActivity, true);
  assert.ok(out(b.a).every(q => q.params?.threadId !== 'unrelated'));
});

test('native cancellation purges unsent turns; late start responses add cleanup only', () => {
  const { a, parentRequest } = boot({ beforeParent: true }); a.abort('operator-cancelled'); respond(a, parentRequest, nativeParent());
  assert.ok(out(a).every(q => q.method === 'thread/unsubscribe')); assert.equal(a.report().draftTurnStarts, 0);
  const b = boot({ beforeTurn: true }); b.a.abort('operator-cancelled'); respond(b.a, b.turnRequest, { turn: { id: PTURN } });
  assert.ok(out(b.a).every(q => q.method === 'turn/interrupt')); assert.equal(b.a.report().cleanupConfirmed, false);
});

test('native malformed input, usage limits and deadlines stop without leaking data', () => {
  for (const event of [usage(PARENT, BOUNDS.tokens + 1), notify('model/rerouted', { threadId: PARENT }),
    { method: 'unknown', params: { threadId: PARENT, raw: 'SYNTHETIC_SECRET' } }]) {
    const { a } = boot(); a.receive(event); assert.notEqual(a.report().reason, null); assert.doesNotMatch(JSON.stringify(a.report()), /SYNTHETIC_SECRET/);
  }
  const a = createNativeRoutingAdapter(plan()); a.start(); out(a); a.advance(BOUNDS.requestMs); assert.equal(a.report().reason, 'request-timeout');
  const b = boot(); b.a.advance(BOUNDS.workMs); assert.equal(b.a.report().reason, 'work-timeout');
});

test('selected native input hashing is bounded and refuses symlinks, hardlinks and special files (macOS only)', { skip: process.platform !== 'darwin' }, async () => {
  const fs = await import('node:fs/promises'), os = await import('node:os'), path = await import('node:path');
  const { createHash } = await import('node:crypto');
  const { hashNativeInput, readNativeReview, verifyNativeInputs } = await import('../proofs/routing-native-inputs.mjs');
  const root = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'mods-native-input-')));
  try {
    const file = path.join(root, 'fixture'); await fs.writeFile(file, 'synthetic only', { mode: 0o600 });
    assert.equal(await hashNativeInput(file, 64), createHash('sha256').update('synthetic only').digest('hex'));
    assert.equal(await readNativeReview(file), 'synthetic only');
    await fs.chmod(file, 0o644); await assert.rejects(readNativeReview(file)); await fs.chmod(file, 0o600);
    await assert.rejects(hashNativeInput(file, 2));
    await fs.symlink(file, path.join(root, 'alias')); await assert.rejects(hashNativeInput(path.join(root, 'alias'), 64));
    await fs.link(file, path.join(root, 'hard')); await assert.rejects(hashNativeInput(file, 64));
    await assert.rejects(hashNativeInput(root, 64)); await assert.rejects(hashNativeInput('/dev/null', 64));
    const cli = path.join(root, 'inert-executable'), candidate = path.join(root, 'candidate.txt'), cfg = path.join(root, 'config.txt'), cwd = path.join(root, 'empty');
    await fs.writeFile(cli, 'never executed', { mode: 0o600 }); await fs.writeFile(cfg, 'synthetic config', { mode: 0o600 }); await fs.mkdir(cwd);
    const candidateBytes = await fs.readFile(new URL('../proofs/routing-native-candidate.txt', import.meta.url));
    assert.equal(createHash('sha256').update(candidateBytes).digest('hex'), CANDIDATE_SHA256);
    await fs.writeFile(candidate, candidateBytes, { mode: 0o600 });
    const p = createNativePlan({ ...input(), cliPath: cli, cliSha256: await hashNativeInput(cli, 64), candidatePath: candidate,
      cwd, configFiles: [{ path: cfg, sha256: await hashNativeInput(cfg, 64) }] });
    assert.equal(await verifyNativeInputs(p), true);
    await fs.writeFile(path.join(cwd, 'unexpected'), 'fixture'); await assert.rejects(verifyNativeInputs(p), /project changed/);
    await fs.unlink(path.join(cwd, 'unexpected')); await fs.writeFile(cfg, 'changed synthetic config'); await assert.rejects(verifyNativeInputs(p), /identity changed/);

  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('native input verification refuses Windows and other targets before touching paths', { skip: process.platform === 'darwin' }, async () => {
  const { hashNativeInput, verifyNativeInputs } = await import('../proofs/routing-native-inputs.mjs');
  const bad = new Proxy({}, { get() { assert.fail('unsupported platform inspected path'); } });
  await assert.rejects(hashNativeInput(bad, 64), /unavailable/); await assert.rejects(verifyNativeInputs(bad), /unavailable/);
});
