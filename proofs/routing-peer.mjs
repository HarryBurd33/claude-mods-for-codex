// Fixed synthetic peer ONLY. No filesystem/network/child-process imports, Codex
// binary, configuration, model call or arbitrary executable payload.
import { ROUTE, PARENT_TEXT, CHILD_TEXT, createSyntheticAdmission, denyServerRequest } from './routing-contract.mjs';
import { SCENARIOS, PARENT, CHILD, PTURN, CTURN, notify, childThread, parentResult, catalogResult,
  turnStarted, turnCompleted, selection, message, usage, serverMethod, itemPacket } from './routing-fixtures.mjs';

const scenario = process.argv[2];
if (process.argv.length !== 3 || !SCENARIOS.includes(scenario)) process.exit(2);
if (scenario === 'env-isolation' && ['CODEX_MODS_TEST_SECRET', 'CODEX_MODS_ROUTING_LIVE', 'NODE_OPTIONS']
  .some(key => Object.hasOwn(process.env, key))) process.exit(15);
const gate = createSyntheticAdmission();
let rest = '', bytes = 0, turns = 0;
const emit = p => process.stdout.write(JSON.stringify(p) + '\n');
const answer = (p, result = {}) => emit({ id: p.id, result });
process.stdout.on('error', () => process.exit(0));
if (scenario === 'ignore-term') { process.on('SIGTERM', () => {}); setInterval(() => {}, 1000); }
process.stdin.on('end', () => { if (scenario !== 'ignore-term') process.exit(scenario === 'exit-failure' ? 17 : 0); });
function transcript(p) {
  answer(p, { turn: { id: PTURN, status: 'inProgress' } }); emit(turnStarted(PARENT, PTURN));
  if (serverMethod[scenario]) {
    emit({ id: 'server-request', method: serverMethod[scenario], params: { threadId: PARENT, turnId: PTURN,
      command: 'SYNTHETIC_SECRET_DO_NOT_LOG', answers: 'never accept' } }); return;
  }
  if (scenario === 'disconnect') return process.exit(0);
  if (scenario === 'malformed') { process.stdout.write('{SYNTHETIC_SECRET_DO_NOT_LOG\n'); return; }
  if (scenario === 'invalid-utf8') { process.stdout.write(Buffer.from([0xff, 10])); return; }
  if (scenario === 'frame-overflow') { process.stdout.write('x'.repeat(65537)); return; }
  if (scenario === 'byte-overflow') { process.stderr.write('x'.repeat(2 * 1024 * 1024 + 1)); return; }
  if (scenario === 'stderr-secret') process.stderr.write('SYNTHETIC_SECRET_DO_NOT_LOG');
  const version = scenario === 'happy-v1' || scenario === 'requested-only' ? 'v1' : 'v2';
  const args = { agent_type: ROUTE.role, message: CHILD_TEXT,
    ...(version === 'v1' ? { fork_context: false } : { fork_turns: 'none', task_name: 'routing-check' }) };
  if (!gate.admit({ actor: 'parent', name: 'spawn_agent', arguments: args })) return process.exit(3);
  const thread = childThread(); if (scenario === 'wrong-role') thread.agentRole = 'wrong-role';
  emit(notify('thread/started', { thread })); emit(turnStarted(CHILD, CTURN));
  if (version === 'v1') {
    const requested = selection('v1'); requested.method = 'item/started'; requested.params.item.status = 'inProgress';
    requested.params.item.model = 'requested-only-is-not-evidence'; emit(requested);
  }
  if (scenario !== 'requested-only') {
    const chosen = selection(version);
    if (scenario === 'model-mismatch' || scenario === 'ignore-interrupt') chosen.params.item.model = 'wrong-model';
    emit(chosen);
    if (scenario === 'model-mismatch' || scenario === 'ignore-interrupt') return;
    if (scenario === 'extra-child') { const extra = selection(version); extra.params.item.agentThreadId = 'unowned-extra'; emit(extra); return; }
  }
  if (scenario === 'extra-action') { emit(itemPacket(CHILD, { id: 'action-1', type: 'commandExecution', command: 'SYNTHETIC_SECRET_DO_NOT_LOG' }, false)); return; }
  if (scenario === 'extra-turn') { emit(turnStarted(CHILD, 'second-turn')); return; }
  if (scenario === 'reroute') { emit(notify('model/rerouted', { threadId: CHILD, fromModel: ROUTE.childModel, toModel: 'wrong-model' })); return; }
  emit(message(CHILD)); if (scenario !== 'missing-usage') emit(usage(CHILD, 10)); emit(turnCompleted(CHILD, CTURN));
  emit(message(PARENT)); emit(usage(PARENT, 20)); emit(turnCompleted(PARENT, PTURN));
}
function receive(p) {
  if (p.id === 'server-request') {
    const expected = denyServerRequest({ id: 'server-request', method: serverMethod[scenario] });
    if (JSON.stringify(p) !== JSON.stringify(expected)) process.exit(4);
    return;
  }
  if (scenario === 'stalled' || scenario === 'ignore-term') return;
  switch (p.method) {
    case 'initialize': answer(p); break;
    case 'initialized': break;
    case 'model/list': { const r = catalogResult(); if (scenario === 'catalog-missing') r.data.pop(); answer(p, r); break; }
    case 'thread/start': {
      if (p.params.model !== ROUTE.parentModel || p.params.ephemeral !== true || p.params.cwd !== ROUTE.cwd
        || p.params.sandbox !== 'read-only' || p.params.approvalPolicy !== 'on-request' || p.params.approvalsReviewer !== 'user'
        || p.params.experimentalRawEvents !== false || p.params.allowProviderModelFallback !== false) return process.exit(5);
      const r = parentResult(); if (scenario === 'parent-mismatch') r.approvalsReviewer = 'auto_review'; answer(p, r); break;
    }
    case 'turn/start':
      if (++turns !== 1 || p.params.threadId !== PARENT || p.params.model !== ROUTE.parentModel || p.params.effort !== ROUTE.effort
        || p.params.input.length !== 1 || p.params.input[0].text !== PARENT_TEXT) return process.exit(6);
      transcript(p); break;
    case 'thread/read': if (p.params.threadId !== CHILD || p.params.includeTurns !== false) process.exit(7); else answer(p, { thread: childThread() }); break;
    case 'turn/interrupt':
      if (![PARENT, CHILD].includes(p.params.threadId) || ![PTURN, CTURN].includes(p.params.turnId)) return process.exit(8);
      answer(p);
      if (scenario !== 'ignore-interrupt') emit(turnCompleted(p.params.threadId, p.params.turnId, 'interrupted'));
      break;
    case 'thread/unsubscribe': if (![PARENT, CHILD].includes(p.params.threadId)) process.exit(9); else answer(p, { status: 'unsubscribed' }); break;
    default: process.exit(10);
  }
}
process.stdin.on('data', chunk => {
  bytes += chunk.length; if (bytes > 131072) process.exit(11);
  rest += chunk.toString('utf8'); let end;
  while ((end = rest.indexOf('\n')) >= 0) {
    const line = rest.slice(0, end); rest = rest.slice(end + 1);
    if (line.length > 8192) process.exit(12);
    try { receive(JSON.parse(line)); } catch { process.exit(13); }
  }
  if (rest.length > 8192) process.exit(14);
});
