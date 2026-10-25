import test from 'node:test';
import assert from 'node:assert/strict';
import { createNativePlan, nativeConfigMatches, CANDIDATE_SHA256 } from '../proofs/routing-native-plan.mjs';
import { createNativeRoutingAdapter } from '../proofs/routing-native-adapter.mjs';
import { runNativeRouting } from '../proofs/routing-native-driver.mjs';
import { liveAdmission } from '../proofs/routing-contract.mjs';

const events = ['PreModelRequest', 'PostModelRequest', 'PreToolUse', 'PermissionRequest', 'PostToolUse',
  'PreCompact', 'PostCompact', 'SessionStart', 'SessionEnd', 'UserPromptSubmit', 'SubagentStart', 'SubagentStop', 'Stop', 'Interrupt'];
const plan = () => createNativePlan({ cliPath: '/review/codex', cliSha256: 'a'.repeat(64), cwd: '/review/empty',
  candidatePath: '/review/candidate.txt', candidateSha256: CANDIDATE_SHA256,
  configFiles: [{ path: '/review/config.toml', sha256: 'b'.repeat(64) }], disabledMcpServers: [] });
function config(hooks, absent = false) {
  const p = plan(), c = {};
  for (const { path, value } of p.requirements) {
    let target = c; for (const key of path.slice(0, -1)) target = target[key] ??= {}; target[path.at(-1)] = value;
  }
  if (!absent) c.hooks = hooks;
  return c;
}
const metadata = () => ({ state: { 'synthetic-file:stop:0:0': { enabled: true, trusted_hash: 'sha256:synthetic', trusted_content_hash: 'opaque-v2:synthetic' } } });
function configStage(c) {
  const a = createNativeRoutingAdapter(plan()); a.start(); const init = a.takeOutbound()[0].rpc;
  a.receive({ id: init.id, result: {} }); const q = a.takeOutbound().map(x => x.rpc);
  assert.equal(q[0].method, 'initialized'); assert.equal(q[1].method, 'config/read');
  a.receive({ id: q[1].id, result: { config: c } }); return a;
}

test('native hook metadata and empty released event defaults classify without granting execution or changing input', async () => {
  const allEmpty = Object.fromEntries(events.map(name => [name, []]));
  for (const h of [{}, { state: {} }, metadata(), { ...allEmpty, ...metadata() },
    { state: { id: {}, disabled: { enabled: false }, contentOnly: { trusted_content_hash: 'sha256:opaque' } } }]) {
    const c = config(h), before = JSON.stringify(c); assert.equal(nativeConfigMatches(plan(), c), true);
    assert.equal(JSON.stringify(c), before);
    const a = configStage(c); assert.equal(a.report().resolvedConfigMatched, true);
    assert.equal(a.report().executionAuthorized, false); assert.equal(a.report().liveAdmission, false);
    assert.equal(a.report().nativeRoutingVerified, false); assert.equal(a.report().draftTurnStarts, 0);
    assert.deepEqual(a.takeOutbound().map(x => x.rpc.method), ['model/list']);
    await assert.rejects(runNativeRouting({ approved: true, hooks: h }), /dry-only/);
    assert.equal(liveAdmission({ approved: true, trusted_hash: 'sha256:synthetic' }).admitted, false);
  }
  assert.equal(nativeConfigMatches(plan(), config(undefined, true)), true);
});

test('every released event rejects a nonempty handler group even alongside trusted or disabled metadata', () => {
  for (const event of events) for (const enabled of [true, false]) {
    const c = config({ state: { id: { enabled, trusted_hash: 'sha256:synthetic' } },
      [event]: [{ matcher: '*', hooks: [{ type: 'command', command: 'NEVER_EXECUTE_SYNTHETIC' }] }] });
    assert.equal(nativeConfigMatches(plan(), c), false);
    const a = configStage(c); assert.equal(a.report().reason, 'config-mismatch'); assert.equal(a.report().draftTurnStarts, 0);
    assert.ok(a.takeOutbound().every(x => !['model/list', 'thread/start', 'turn/start'].includes(x.rpc.method)));
  }
});

test('unknown and malformed hook tables, events, state entries and fields remain refused', () => {
  const cases = [null, false, 0, '', [], { state: null }, { state: [] }, { state: false },
    { state: { id: null } }, { state: { id: [] } }, { state: { id: 'sha256:synthetic' } },
    { state: { id: { enabled: 'false' } } }, { state: { id: { enabled: null } } },
    { state: { id: { trusted_hash: 123 } } }, { state: { id: { trusted_content_hash: null } } },
    { state: { id: { trusted_hash: '' } } }, { state: { id: { trusted_hash: 'has whitespace' } } },
    { state: { id: { trusted_hash: 'bad\nvalue' } } }, { state: { id: { trusted_hash: 'trailing\n' } } },
    { state: { id: { trusted_hash: 'non-ascii-\u00e9' } } }, { state: { id: { trusted_hash: '\ud800' } } },
    { state: { id: { approved: true } } }, { state: { id: { command: 'NEVER_EXECUTE_SYNTHETIC' } } },
    { state: { id: { trusted_hash: 'sha256:synthetic', unknown: {} } } }, { state: { '': {} } }, { state: { ' ': {} } },
    { state: { ['id\u202e']: {} } }, { UnknownEvent: [] }, { managed_dir: '/synthetic/not-read' },
    { state: {}, unknown: null }, { PreToolUse: {} }, { PreToolUse: null }, { PreToolUse: [null] }];
  for (const h of cases) assert.equal(nativeConfigMatches(plan(), config(h)), false);
});

test('hook metadata resource bounds are explicit and do not expand generic protocol limits', () => {
  assert.equal(nativeConfigMatches(plan(), config({ state: Object.fromEntries(Array.from({ length: 256 }, (_, i) => ['id' + i, {}])) })), true);
  assert.equal(nativeConfigMatches(plan(), config({ state: Object.fromEntries(Array.from({ length: 257 }, (_, i) => ['id' + i, {}])) })), false);
  assert.equal(nativeConfigMatches(plan(), config({ state: { ['x'.repeat(4096)]: { trusted_hash: 'x'.repeat(256) } } })), true);
  for (const h of [{ state: { ['x'.repeat(4097)]: {} } }, { state: { id: { trusted_hash: 'x'.repeat(257) } } }]) assert.equal(nativeConfigMatches(plan(), config(h)), false);
});

test('accessors, custom prototypes, sparse arrays and symbols are rejected without reading getters', () => {
  let reads = 0;
  const getter = Object.defineProperty({}, 'trusted_hash', { enumerable: true, get() { reads++; return 'sha256:synthetic'; } });
  const topGetter = Object.defineProperty({}, 'state', { enumerable: true, get() { reads++; return {}; } });
  const symbol = { [Symbol('hidden')]: 'synthetic' };
  for (const h of [topGetter, { state: { id: getter } }, { state: { id: Object.create({ enabled: true }) } },
    { state: { id: symbol } }, { PreToolUse: Array(1) }]) assert.equal(nativeConfigMatches(plan(), config(h)), false);
  assert.equal(reads, 0);
});

test('opaque metadata identifiers are never paths, code, prototype assignments or permission approvals', () => {
  const state = JSON.parse('{"__proto__":{"trusted_hash":"sha256:synthetic"},"constructor":{"enabled":true},"file:/synthetic/never-read:stop:0:0":{"trusted_hash":"opaque:synthetic"}}');
  const c = config({ state }), before = JSON.stringify(c);
  assert.equal(nativeConfigMatches(plan(), c), true); assert.equal(JSON.stringify(c), before);
  assert.equal(Object.prototype.trusted_hash, undefined); assert.equal(Object.prototype.enabled, undefined);
  const a = configStage(c); assert.equal(a.report().executionAuthorized, false); assert.equal(a.report().draftTurnStarts, 0);
});
