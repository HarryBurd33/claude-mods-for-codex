import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { ROUTE, BOUNDS, CHILD_TEXT, liveAdmission, requireLiveAdmission, createSyntheticAdmission,
  denyServerRequest, jsonData } from '../proofs/routing-contract.mjs';
import { createRoutingMachine } from '../proofs/routing-machine.mjs';
import { createRoutingFrames } from '../proofs/routing-frames.mjs';
import { runRoutingDry, parseRoutingArgs } from '../proofs/routing-driver.mjs';
import { PARENT, CHILD, PTURN, CTURN, notify, parentResult, catalogResult, childThread, selection,
  turnStarted, turnCompleted, itemPacket, message, usage } from '../proofs/routing-fixtures.mjs';

const copy = v => JSON.parse(JSON.stringify(v));
const outbound = m => m.takeOutbound().map(x => { assert.equal(x.domain, 'synthetic-only'); return x.rpc; });
function respond(m, req, result) { m.receive({ id: req.id, result }); }
function boot({ parent, earlyParent = false, beforeTurn = false } = {}) {
  const m = createRoutingMachine(); m.start();
  let req = outbound(m)[0]; assert.equal(req.method, 'initialize'); respond(m, req, {});
  const initial = outbound(m); assert.equal(initial[0].method, 'initialized'); respond(m, initial[1], catalogResult());
  req = outbound(m)[0]; assert.equal(req.method, 'thread/start');
  if (earlyParent) m.receive(notify('thread/started', { thread: { id: PARENT } }));
  respond(m, req, parent ?? parentResult());
  if (parent) return { m, requests: outbound(m) };
  req = outbound(m)[0]; assert.equal(req.method, 'turn/start');
  if (beforeTurn) return { m, turnRequest: req };
  respond(m, req, { turn: { id: PTURN } }); m.receive(turnStarted(PARENT, PTURN));
  return { m };
}
function child(m, family = 'v2') {
  m.receive(notify('thread/started', { thread: childThread() })); m.receive(turnStarted(CHILD, CTURN));
  m.receive(selection(family));
  const req = outbound(m).find(x => x.method === 'thread/read');
  if (req) { assert.equal(req.params.threadId, CHILD); assert.equal(req.params.includeTurns, false); respond(m, req, { thread: childThread() }); }
}
function complete(m, includeUsage = true) {
  m.receive(message(CHILD)); if (includeUsage) m.receive(usage(CHILD, 10)); m.receive(turnCompleted(CHILD, CTURN));
  m.receive(message(PARENT)); m.receive(usage(PARENT, 20)); m.receive(turnCompleted(PARENT, PTURN));
  m.advance(BOUNDS.settleMs);
}
function clean(m, acknowledgeTurns = true) {
  const sent = [];
  for (let i = 0; i < 8; i++) {
    const requests = outbound(m); if (!requests.length) break;
    for (const r of requests) {
      sent.push(r);
      if (r.method === 'turn/interrupt') {
        respond(m, r, {});
        if (acknowledgeTurns) m.receive(turnCompleted(r.params.threadId, r.params.turnId, 'interrupted'));
      } else if (r.method === 'thread/unsubscribe') respond(m, r, { status: 'unsubscribed' });
      else if (r.method === 'thread/read') respond(m, r, { thread: childThread() });
    }
  }
  return sent;
}

test('live admission cannot be opened by approval claims, fields, environment or CLI options', () => {
  for (const value of [undefined, true, { executionAuthorized: true, nativeToolAdmission: true, mode: 'live' }]) {
    assert.equal(liveAdmission(value).admitted, false); assert.throws(() => requireLiveAdmission(value), /dry-only/);
  }
  for (const argv of [[], ['--live'], ['--dry-run', '--command', 'codex'], ['--dry-run', '--url', 'http://example.test'],
    ['--dry-run', '--scenario', '../peer'], ['--dry-run', '--grant', 'approved'], ['--dry-run', '--scenario', 'happy-v2', '--live']]) assert.throws(() => parseRoutingArgs(argv));
  const getter = ['--dry-run']; Object.defineProperty(getter, '0', { get() { assert.fail('must not inspect accessor'); } }); assert.throws(() => parseRoutingArgs(getter));
  assert.equal(parseRoutingArgs(['--dry-run']), 'happy-v2');
});

test('synthetic pre-execution admission only permits exact no-history role spawn and bounded owned waits', () => {
  const base = { actor: 'parent', name: 'spawn_agent', arguments: { agent_type: ROUTE.role, message: CHILD_TEXT, fork_turns: 'none', task_name: 'routing-check' } };
  for (const change of [v => { v.actor = 'child'; }, v => { v.name = 'exec_command'; }, v => { v.arguments.model = ROUTE.childModel; },
    v => { v.arguments.reasoning_effort = 'low'; }, v => { v.arguments.fork_turns = 'all'; }, v => { delete v.arguments.fork_turns; },
    v => { v.arguments.task_name = '../escape'; }, v => { v.arguments.agent_type = 'default'; }, v => { v.arguments.message = 'Other'; },
    v => { v.arguments.command = 'never execute'; }, v => { v.extraGrant = true; }]) {
    const value = copy(base); change(value); const gate = createSyntheticAdmission();
    let effects = 0; if (gate.admit(value)) effects++; assert.equal(effects, 0);
  }
  const gate = createSyntheticAdmission(); assert.equal(gate.admit({ actor: 'parent', name: 'wait_agent', arguments: { target: CHILD } }), false);
  assert.equal(gate.admit(base), true); assert.equal(gate.admit(base), false);
  for (let i = 0; i < 8; i++) assert.equal(gate.admit({ actor: 'parent', name: 'wait_agent', arguments: { target: CHILD } }), true);
  assert.equal(gate.admit({ actor: 'parent', name: 'wait_agent', arguments: { target: CHILD } }), false);
  assert.equal(gate.admit({ actor: 'child', name: 'spawn_agent', arguments: base.arguments }), false);
  assert.equal(createSyntheticAdmission().admit({ actor: 'parent', name: 'spawn_agent', arguments: { agent_type: ROUTE.role, message: CHILD_TEXT, fork_context: false } }), true);
});

test('protocol data validation rejects accessors, prototypes, malformed Unicode, holes, cycles and excessive nesting without invoking code', () => {
  const accessor = Object.defineProperty({}, 'secret', { enumerable: true, get() { assert.fail('must not read getter'); } });
  const cycle = {}; cycle.self = cycle;
  let nested = null; for (let i = 0; i < 30; i++) nested = { nested };
  for (const value of [accessor, new Date(), [1, , 2], cycle, nested, '\ud800', { toJSON() { assert.fail('must not serialize'); } }, Infinity]) assert.equal(jsonData(value), false);
  const m = createRoutingMachine(); m.start(); outbound(m); m.receive(accessor);
  assert.equal(m.report().reason, 'malformed-protocol'); assert.doesNotMatch(JSON.stringify(m.report()), /secret/);
});

test('both released event families resolve the owned child, ignore V1 requested values and deduplicate identical selection packets', () => {
  for (const family of ['v1', 'v2']) {
    const { m } = boot({ earlyParent: true });
    if (family === 'v1') { const p = selection('v1'); p.method = 'item/started'; p.params.item.status = 'inProgress'; p.params.item.model = 'not-resolved'; m.receive(p); assert.equal(m.report().resolvedSelection, 'unavailable'); }
    child(m, family); m.receive(selection(family)); assert.deepEqual(outbound(m), []);
    complete(m); clean(m); const r = m.report();
    assert.equal(r.outcome, 'passed'); assert.equal(r.resolvedSelection, family); assert.equal(r.cleanupConfirmed, true);
    assert.equal(r.syntheticTurnStarts, 1); assert.equal(r.nativeInferenceCalls, 0); assert.equal(r.nativeRoutingVerified, false);
    assert.deepEqual(r.usage, { parent: 20, child: 10, combined: 30 });
    assert.doesNotMatch(JSON.stringify(r), /synthetic-parent|synthetic-child|SYNTHETIC_SECRET|prompt|agentPath/);
  }
});

test('parent metadata mismatches stop before any synthetic turn or child metadata read', () => {
  for (const change of [r => { r.model = 'other'; }, r => { r.reasoningEffort = 'high'; }, r => { r.thread.ephemeral = false; },
    r => { r.cwd = '/other'; }, r => { r.sandbox = { type: 'dangerFullAccess' }; }, r => { r.sandbox.networkAccess = true; },
    r => { r.approvalPolicy = 'never'; }, r => { r.approvalsReviewer = 'auto_review'; }]) {
    const p = parentResult(); change(p); const { m, requests } = boot({ parent: p });
    assert.equal(m.report().reason, 'parent-mismatch'); assert.equal(m.report().syntheticTurnStarts, 0);
    assert.ok(requests.every(x => x.method === 'thread/unsubscribe'));
  }
});

test('wrong model/effort, mixed families, changed spawn ids, wrong role/parent and extra actions stop without querying unrelated threads', () => {
  for (const change of [p => { p.params.item.model = 'wrong'; }, p => { p.params.item.reasoningEffort = 'high'; }]) {
    const { m } = boot(); m.receive(notify('thread/started', { thread: childThread() })); m.receive(turnStarted(CHILD, CTURN));
    const p = selection(); change(p); m.receive(p); assert.equal(m.report().reason, 'selection-mismatch');
    assert.ok(outbound(m).every(x => x.method === 'turn/interrupt'));
  }
  for (const p of [selection('v1'), (() => { const p = selection(); p.params.item.id = 'spawn-2'; return p; })(),
    (() => { const p = selection(); p.params.item.agentThreadId = 'unrelated'; return p; })(),
    itemPacket(CHILD, { id: 'danger', type: 'mcpToolCall', arguments: 'SYNTHETIC_SECRET_DO_NOT_LOG' }, false)]) {
    const { m } = boot(); child(m); m.receive(p); assert.notEqual(m.report().reason, null);
    assert.ok(outbound(m).every(x => !['thread/read', 'turn/start', 'thread/resume'].includes(x.method)));
  }
  for (const change of [t => { t.agentRole = 'wrong'; }, t => { t.parentThreadId = 'unrelated'; }, t => { t.ephemeral = false; }]) {
    const { m } = boot(); const t = childThread(); change(t); m.receive(notify('thread/started', { thread: t }));
    assert.equal(m.report().reason, 'child-mismatch'); assert.ok(outbound(m).every(x => x.params?.threadId !== 'unrelated'));
  }
});

test('missing resolved evidence or child usage stays incomplete; marker and parent usage do not establish a route', () => {
  for (const kind of ['requested-only', 'missing-usage']) {
    const { m } = boot();
    if (kind === 'requested-only') { m.receive(notify('thread/started', { thread: childThread() })); m.receive(turnStarted(CHILD, CTURN)); }
    else child(m);
    complete(m, kind !== 'missing-usage'); clean(m); const r = m.report();
    assert.equal(r.outcome, 'incomplete'); assert.equal(r.nativeRoutingVerified, false);
    if (kind === 'missing-usage') { assert.equal(r.usage.child, null); assert.equal(r.usage.combined, null); }
  }
});

test('typed decisions never approve, grant permissions, fill answers or return successful dynamic tools', () => {
  const expected = {
    'item/commandExecution/requestApproval': { decision: 'cancel' }, 'item/fileChange/requestApproval': { decision: 'cancel' },
    execCommandApproval: { decision: 'abort' }, applyPatchApproval: { decision: 'abort' },
    'item/permissions/requestApproval': { permissions: {}, scope: 'turn' }, 'item/tool/requestUserInput': { answers: {} },
    'mcpServer/elicitation/request': { action: 'decline', content: null }, 'item/tool/call': { contentItems: [], success: false },
  };
  for (const [method, result] of Object.entries(expected)) {
    const packet = { id: 'request-1', method, params: { threadId: PARENT, secret: 'SYNTHETIC_SECRET_DO_NOT_LOG' } };
    assert.deepEqual(denyServerRequest(packet), { id: packet.id, result });
    const { m } = boot(); m.receive(packet); const out = outbound(m);
    assert.deepEqual(out[0], { id: packet.id, result }); assert.equal(m.report().reason, 'server-request-denied');
    assert.ok(out.slice(1).every(x => x.method === 'turn/interrupt'));
  }
  const { m } = boot(); m.receive({ id: 'auth', method: 'account/chatgptAuthTokens/refresh', params: { threadId: PARENT } });
  assert.equal(outbound(m)[0].error.code, -32601);
  const { m: other } = boot(); other.receive({ id: 'other', method: 'item/fileChange/requestApproval', params: { threadId: 'unrelated' } });
  assert.equal(outbound(other)[0].error.code, -32601); assert.equal(other.report().reason, 'unexpected-thread');
});

test('usage is monotonic and bounded without double-counting repeated totals; reroutes, extra turns and output mismatches stop', () => {
  const { m } = boot(); child(m); m.receive(usage(CHILD, 10)); m.receive(usage(CHILD, 10)); m.receive(usage(PARENT, 20));
  assert.equal(m.report().usage.combined, 30); m.receive(usage(CHILD, 9)); assert.equal(m.report().reason, 'usage-invalid');
  const { m: cap } = boot(); cap.receive(usage(PARENT, BOUNDS.tokens + 1)); assert.equal(cap.report().reason, 'usage-limit');
  for (const p of [notify('model/rerouted', { threadId: CHILD }), turnStarted(PARENT, 'other-turn'),
    itemPacket(PARENT, { id: 'reply', type: 'agentMessage', text: 'SYNTHETIC_SECRET_DO_NOT_LOG' })]) {
    const { m } = boot(); m.receive(p); assert.notEqual(m.report().reason, null); assert.doesNotMatch(JSON.stringify(m.report()), /SYNTHETIC_SECRET/);
  }
});

test('request/work/outer deadlines and cancellation distinguish acknowledgment from actual terminal state', () => {
  const init = createRoutingMachine(); init.start(); outbound(init); init.advance(BOUNDS.requestMs); assert.equal(init.report().reason, 'request-timeout');
  const outer = createRoutingMachine(); outer.start(); outbound(outer); outer.advance(BOUNDS.outerMs); assert.equal(outer.report().reason, 'outer-timeout');
  const { m } = boot(); child(m); m.advance(BOUNDS.workMs); assert.equal(m.report().reason, 'work-timeout');
  const cancels = clean(m, false); assert.equal(cancels.filter(x => x.method === 'turn/interrupt').length, 2);
  assert.equal(m.report().cleanupConfirmed, false);
  m.advance(BOUNDS.workMs + BOUNDS.cleanupMs); clean(m, false); m.advance(BOUNDS.workMs + BOUNDS.cleanupMs + BOUNDS.cleanupGraceMs);
  assert.equal(m.report().done, true); assert.equal(m.report().cancellationExpired, true); assert.equal(m.report().cleanupConfirmed, false);
});

test('late start responses after cancellation never cause a new turn and unknown requests never cause session discovery', () => {
  const { m, turnRequest } = boot({ beforeTurn: true }); m.abort('operator-cancelled');
  assert.deepEqual(outbound(m), []); respond(m, turnRequest, { turn: { id: PTURN } });
  const requests = clean(m); assert.deepEqual(requests.map(x => x.method), ['turn/interrupt', 'thread/unsubscribe']);
  assert.equal(m.report().cleanupConfirmed, true); assert.equal(m.report().reason, 'operator-cancelled');
  const fresh = createRoutingMachine(); fresh.start(); outbound(fresh); fresh.receive({ id: 'stranger', method: 'unknown', params: { threadId: 'unrelated' } });
  assert.deepEqual(outbound(fresh).map(x => Object.keys(x).sort()), [['error', 'id']]); assert.equal(fresh.report().syntheticTurnStarts, 0);
});

test('cancellation removes queued undispatched starts and the outer deadline includes cleanup', () => {
  const m = createRoutingMachine(); m.start(); respond(m, outbound(m)[0], {});
  respond(m, outbound(m)[1], catalogResult()); const parent = outbound(m)[0]; respond(m, parent, parentResult());
  // A turn is queued but has not reached the synthetic transport yet.
  m.abort('operator-cancelled'); const requests = clean(m);
  assert.deepEqual(requests.map(x => x.method), ['thread/unsubscribe']); assert.equal(m.report().syntheticTurnStarts, 0);
  assert.equal(m.report().cleanupConfirmed, true);
  const init = createRoutingMachine(); init.start(); respond(init, outbound(init)[0], {}); init.abort('operator-cancelled');
  assert.deepEqual(outbound(init), []); assert.equal(init.report().syntheticTurnStarts, 0);
  const { m: running } = boot(); child(running);
  running.advance(BOUNDS.outerMs); assert.equal(running.report().done, true);
  assert.equal(running.report().cleanupConfirmed, false); assert.deepEqual(outbound(running), []);
});

test('an ambiguous failed turn start and untracked child never claim confirmed cancellation', () => {
  const { m, turnRequest } = boot({ beforeTurn: true }); m.receive({ id: turnRequest.id, error: { code: -1, message: 'SYNTHETIC_SECRET_DO_NOT_LOG' } });
  clean(m); assert.equal(m.report().uncertainTurnStart, true); assert.equal(m.report().cleanupConfirmed, false);
  const { m: extra } = boot(); child(extra); const p = selection(); p.params.item.agentThreadId = 'untracked'; extra.receive(p); clean(extra);
  assert.equal(extra.report().untrackedActivity, true); assert.equal(extra.report().cleanupConfirmed, false);
});

test('stream framing bounds UTF-8 fragments, malformed/truncated/oversized frames, combined stderr bytes and message counts', () => {
  const packets = [], errors = [], f = createRoutingFrames(x => packets.push(x), x => errors.push(x));
  const b = Buffer.from('{"text":"検証"}\n'); const i = b.indexOf(Buffer.from('検')); f.push(b.subarray(0, i + 1)); f.push(b.subarray(i + 1)); f.finish();
  assert.equal(packets[0].text, '検証'); assert.deepEqual(errors, []);
  for (const [chunks, stderr, expected] of [[ [Buffer.from([0xff, 10])], false, 'malformed-protocol'],
    [[Buffer.from('SYNTHETIC_SECRET\n')], false, 'malformed-protocol'], [[Buffer.from('{}')], false, 'incomplete-frame'],
    [[Buffer.alloc(BOUNDS.frameBytes + 1, 120)], false, 'frame-limit'], [[Buffer.alloc(BOUNDS.bytes + 1)], true, 'byte-limit'],
    [[Buffer.from('{}\n'.repeat(BOUNDS.messages + 1))], false, 'message-limit']]) {
    const e = []; const x = createRoutingFrames(() => {}, r => e.push(r)); for (const c of chunks) x.push(c, stderr); x.finish(); assert.deepEqual(e, [expected]);
  }
});

test('fixed process peer exercises both event families, typed refusal, malformed input, evidence gaps and scoped interruption', async () => {
  for (const [scenario, expected] of [['happy-v1', 'passed'], ['happy-v2', 'passed'], ['deny-permissions', 'stopped'],
    ['deny-command', 'stopped'], ['malformed', 'stopped'], ['byte-overflow', 'stopped'], ['disconnect', 'stopped'],
    ['extra-action', 'stopped'], ['missing-usage', 'incomplete'], ['requested-only', 'incomplete']]) {
    const r = await runRoutingDry(scenario); assert.equal(r.outcome, expected, scenario); assert.equal(r.processReaped, true, scenario);
    assert.equal(r.nativeInferenceCalls, 0); assert.equal(r.liveAdmission.admitted, false);
    assert.doesNotMatch(JSON.stringify(r), /SYNTHETIC_SECRET|synthetic-parent|synthetic-child/);
  }
});

test('CLI refuses live/path/approval options and ignores claimed execution permission in environment', () => {
  const path = fileURLToPath(new URL('../proofs/routing-driver.mjs', import.meta.url));
  const denied = spawnSync(process.execPath, [path, '--live'], { encoding: 'utf8', timeout: 3000 }); assert.equal(denied.status, 2); assert.equal(denied.stdout, '');
  const output = JSON.parse(execFileSync(process.execPath, [path, '--dry-run', '--scenario', 'stderr-secret'], {
    encoding: 'utf8', timeout: 8000, env: { ...process.env, CODEX_MODS_ROUTING_LIVE: 'approved', CODEX_MODS_TEST_SECRET: 'SYNTHETIC_SECRET_DO_NOT_LOG' } }));
  assert.equal(output.outcome, 'passed'); assert.equal(output.liveAdmission.admitted, false); assert.equal(output.nativeInferenceCalls, 0);
  const isolated = JSON.parse(execFileSync(process.execPath, [path, '--dry-run', '--scenario', 'env-isolation'], {
    encoding: 'utf8', timeout: 8000, env: { ...process.env, NODE_OPTIONS: '--no-warnings',
      CODEX_MODS_ROUTING_LIVE: 'approved', CODEX_MODS_TEST_SECRET: 'SYNTHETIC_SECRET_DO_NOT_LOG' } }));
  assert.equal(isolated.outcome, 'passed'); assert.equal(isolated.peerExitCode, 0);
});

test('protocol success cannot hide a failed peer exit', async () => {
  const r = await runRoutingDry('exit-failure'); assert.equal(r.processReaped, true); assert.equal(r.peerExitCode, 17);
  assert.equal(r.outcome, 'stopped'); assert.equal(r.reason, 'transport-error');
});

test('owned synthetic peer ignoring termination is forcibly reaped with bounded cleanup (POSIX signal semantics only)', { skip: process.platform === 'win32' }, async () => {
  const result = await runRoutingDry('ignore-term'); assert.equal(result.reason, 'dry-transport-deadline');
  assert.equal(result.processReaped, true); assert.equal(result.forcedPeerTermination, true); assert.equal(result.peerSignalled, true);
});

test('driver contains no native executable/URL/configuration input; peer has no execution or network implementation', async () => {
  const source = await readFile(new URL('../proofs/routing-driver.mjs', import.meta.url), 'utf8');
  assert.match(source, /spawn\(process\.execPath, \[PEER, scenario\]/); assert.match(source, /env: \{\}/);
  const peer = await readFile(new URL('../proofs/routing-peer.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(peer, /from ['"]node:(child_process|fs|net|https?|tls)|\bfetch\(|\beval\(|\bexec\(/);
});
