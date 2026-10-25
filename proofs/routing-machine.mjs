import { ROUTE, BOUNDS, PARENT_TEXT, jsonData, ref, rpcId, denyServerRequest, liveAdmission } from './routing-contract.mjs';

const REASONS = new Set(['malformed-protocol', 'unsupported-notification', 'unexpected-response', 'server-error',
  'server-request-denied', 'catalog-unavailable', 'parent-mismatch', 'child-mismatch', 'selection-mismatch',
  'spawn-failed', 'extra-child', 'unexpected-turn', 'unexpected-action', 'unexpected-thread', 'model-rerouted',
  'usage-invalid', 'usage-limit', 'output-mismatch', 'turn-failed', 'request-timeout', 'work-timeout', 'outer-timeout',
  'peer-disconnected', 'transport-error', 'frame-limit', 'byte-limit', 'message-limit', 'incomplete-frame',
  'dry-transport-deadline', 'operator-cancelled', 'incomplete-evidence', 'driver-error']);
const TERMINAL = new Set(['completed', 'failed', 'interrupted']);

// Pure protocol state machine. Outbound records are simulation intents, never a
// capability to use a native transport. Only the fixed dry runner consumes them.
export function createRoutingMachine() {
  const s = { now: 0, phase: 'new', reason: null, next: 1, pending: new Map(), out: [],
    parent: null, child: null, childMeta: false, selection: null, spawnIds: new Set(), readSent: false,
    turns: new Map(), terminal: new Set(), outputs: new Set(), usage: new Map(), interruptSent: new Set(),
    interruptAck: new Set(), unsubscribeSent: new Set(), unsubscribeAck: new Set(), workAt: null,
    stopAt: null, finishAt: null, normalComplete: false, cancellationExpired: false, turnStarts: 0, waits: 0,
    reportedParent: null, terminalStatus: new Map(), uncertainTurnStart: false, untrackedActivity: false };
  const owned = id => ref(id) && (id === s.parent || id === s.child);
  const active = () => [...s.turns].filter(([id]) => !s.terminal.has(id));
  const modelPending = () => [...s.pending.values()].some(p => ['parent', 'turn'].includes(p.kind));
  function send(method, params, kind) {
    const id = s.next++;
    s.pending.set(id, { method, params, kind, at: s.now }); s.out.push({ id, method, params });
  }
  function beginStop(reason) {
    if (s.phase === 'done') return;
    if (['extra-child', 'unexpected-turn', 'unexpected-thread', 'child-mismatch'].includes(reason)) s.untrackedActivity = true;
    if (s.stopAt === null) { s.reason = reason; s.stopAt = s.now; s.phase = 'stopping'; }
    else if (s.reason === null && reason !== null) { s.reason = reason; s.normalComplete = false; }
    // Cancellation must remove not-yet-dispatched work, especially turn/start.
    // Already dispatched requests may return late, but can only cause cleanup.
    s.out = s.out.filter(rpc => {
      const req = s.pending.get(rpc.id);
      if (rpc.method && !['interrupt', 'unsubscribe'].includes(req?.kind)) {
        if (req && !req.sent) s.pending.delete(rpc.id);
        return false;
      }
      return true;
    });
    progressStop();
  }
  function progressStop() {
    if (s.phase !== 'stopping') return;
    if (s.now >= BOUNDS.outerMs) {
      if (active().length || modelPending() || [...s.interruptSent].some(id => !s.interruptAck.has(id))
        || [s.parent, s.child].filter(Boolean).some(id => !s.unsubscribeAck.has(id))) s.cancellationExpired = true;
      s.out = s.out.filter(rpc => !rpc.method); s.phase = 'done'; return;
    }
    for (const [threadId, turnId] of active()) if (!s.interruptSent.has(threadId)) {
      s.interruptSent.add(threadId); send('turn/interrupt', { threadId, turnId }, 'interrupt');
    }
    const expired = s.now - s.stopAt >= BOUNDS.cleanupMs;
    if (expired && (active().length || modelPending())) s.cancellationExpired = true;
    if (!active().length && !modelPending() || expired) {
      for (const threadId of [s.child, s.parent].filter(Boolean)) if (!s.unsubscribeSent.has(threadId)) {
        s.unsubscribeSent.add(threadId); send('thread/unsubscribe', { threadId }, 'unsubscribe');
      }
    }
    const clean = !active().length && !modelPending()
      && [...s.interruptSent].every(id => s.interruptAck.has(id))
      && [...s.unsubscribeSent].every(id => s.unsubscribeAck.has(id));
    if (clean && [s.parent, s.child].filter(Boolean).every(id => s.unsubscribeAck.has(id))
      || s.now - s.stopAt >= BOUNDS.cleanupMs + BOUNDS.cleanupGraceMs) s.phase = 'done';
  }
  function chooseChild(id) {
    if (!ref(id) || id === s.parent) return beginStop('child-mismatch');
    if (s.child && id !== s.child) return beginStop('extra-child');
    s.child = id;
  }
  function childMetadata(t) {
    if (!t || !ref(t.id)) return beginStop('child-mismatch');
    const source = t.source?.subAgent?.thread_spawn;
    const parent = t.parentThreadId ?? source?.parent_thread_id;
    const role = t.agentRole ?? source?.agent_role;
    if (parent !== s.parent || role !== ROUTE.role || t.ephemeral !== true
      || t.parentThreadId && source?.parent_thread_id && t.parentThreadId !== source.parent_thread_id
      || t.agentRole && source?.agent_role && t.agentRole !== source.agent_role) return beginStop('child-mismatch');
    chooseChild(t.id);
    if (s.phase === 'stopping' || s.phase === 'done') return;
    if (t.model !== ROUTE.childModel || t.reasoningEffort !== ROUTE.effort) return beginStop('selection-mismatch');
    s.childMeta = true;
  }
  function resolvedChild(item, family) {
    let id;
    if (family === 'v1') {
      if (item.senderThreadId !== s.parent || item.status !== 'completed') return beginStop('spawn-failed');
      if (!Array.isArray(item.receiverThreadIds) || item.receiverThreadIds.length !== 1) return beginStop('extra-child');
      [id] = item.receiverThreadIds;
    } else id = item.agentThreadId;
    chooseChild(id);
    if (s.phase === 'stopping' || s.phase === 'done') return;
    if (item.model !== ROUTE.childModel || item.reasoningEffort !== ROUTE.effort) return beginStop('selection-mismatch');
    if (s.selection && (s.selection.family !== family || s.selection.call !== item.id)) return beginStop('extra-child');
    s.selection = { family, call: item.id };
    if (!s.readSent) { s.readSent = true; send('thread/read', { threadId: s.child, includeTurns: false }, 'read'); }
  }
  function parentResponse(r) {
    const t = r?.thread;
    // Establish ownership before checking configuration, so a mismatched owned
    // parent can still be unsubscribed. Never adopt a peer-supplied unrelated id.
    if (!ref(t?.id) || s.parent && t.id !== s.parent || s.reportedParent && t.id !== s.reportedParent) return beginStop('parent-mismatch');
    s.parent = t.id;
    if (s.phase === 'stopping') return progressStop();
    if (r.model !== ROUTE.parentModel || r.reasoningEffort !== ROUTE.effort || t.ephemeral !== true
      || r.cwd !== ROUTE.cwd || r.sandbox?.type !== 'readOnly' || r.sandbox.networkAccess === true
      || r.approvalPolicy !== 'on-request' || r.approvalsReviewer !== 'user') return beginStop('parent-mismatch');
    s.phase = 'running';
    send('turn/start', { threadId: s.parent, input: [{ type: 'text', text: PARENT_TEXT }],
      model: ROUTE.parentModel, effort: ROUTE.effort }, 'turn');
  }
  function turnId(thread, turn) {
    if (!owned(thread) || !ref(turn)) return beginStop('unexpected-turn');
    if (s.turns.has(thread) && s.turns.get(thread) !== turn) return beginStop('unexpected-turn');
    s.turns.set(thread, turn);
    if (thread === s.parent) s.uncertainTurnStart = false;
    if (s.phase === 'stopping') progressStop();
  }
  function response(p) {
    const req = s.pending.get(p.id);
    if (!req) return beginStop('unexpected-response');
    s.pending.delete(p.id);
    if (Object.hasOwn(p, 'error')) {
      if (['interrupt', 'unsubscribe'].includes(req.kind)) return; // Never turn an error into an acknowledgment.
      if (req.kind === 'turn' && !s.turns.has(s.parent)) s.uncertainTurnStart = true;
      return beginStop('server-error');
    }
    const r = p.result;
    if (!r || typeof r !== 'object' || Array.isArray(r)) return beginStop('malformed-protocol');
    if (req.kind === 'interrupt') s.interruptAck.add(req.params.threadId);
    else if (req.kind === 'unsubscribe') {
      if (['unsubscribed', 'notLoaded', 'notSubscribed'].includes(r.status)) s.unsubscribeAck.add(req.params.threadId);
    } else if (req.kind === 'parent') parentResponse(r);
    else if (req.kind === 'turn') {
      if (!ref(r.turn?.id)) s.uncertainTurnStart = true;
      turnId(s.parent, r.turn?.id);
    }
    else if (s.phase !== 'stopping') {
      if (req.kind === 'initialize') {
        s.out.push({ method: 'initialized', params: {} });
        send('model/list', { limit: 100, includeHidden: false }, 'catalog');
      } else if (req.kind === 'catalog') {
        if (!Array.isArray(r.data) || r.nextCursor) return beginStop('catalog-unavailable');
        for (const model of [ROUTE.parentModel, ROUTE.childModel]) {
          const rows = r.data.filter(x => x?.model === model);
          if (rows.length !== 1 || rows[0].hidden === true || !Array.isArray(rows[0].supportedReasoningEfforts)
            || !rows[0].supportedReasoningEfforts.some(x => x?.reasoningEffort === ROUTE.effort)) return beginStop('catalog-unavailable');
        }
        s.phase = 'starting-parent';
        send('thread/start', { model: ROUTE.parentModel, ephemeral: true, sandbox: 'read-only', cwd: ROUTE.cwd,
          approvalPolicy: 'on-request', approvalsReviewer: 'user', experimentalRawEvents: false,
          allowProviderModelFallback: false }, 'parent');
      } else if (req.kind === 'read') childMetadata(r.thread);
    }
    progressStop();
  }
  function event(p) {
    const v = p.params;
    if (!v || typeof v !== 'object' || Array.isArray(v)) return beginStop('malformed-protocol');
    if (p.method === 'thread/started') {
      if (!s.parent && s.phase === 'starting-parent' && ref(v.thread?.id) && !v.thread.parentThreadId) {
        if (s.reportedParent && s.reportedParent !== v.thread.id) return beginStop('unexpected-thread');
        s.reportedParent = v.thread.id; return;
      }
      if (v.thread?.id === s.parent) return;
      return childMetadata(v.thread);
    }
    if (p.method === 'model/rerouted') return beginStop('model-rerouted');
    if (p.method === 'error') return beginStop('server-error');
    if (p.method === 'serverRequest/resolved') return; // Never counts as approval/cancellation acknowledgment.
    if (!owned(v.threadId)) return beginStop('unexpected-thread');
    if (p.method === 'thread/status/changed') return;
    if (p.method === 'turn/started') return turnId(v.threadId, v.turn?.id);
    if (p.method === 'turn/completed') {
      if (!ref(v.turn?.id) || s.turns.get(v.threadId) !== v.turn.id) return beginStop('unexpected-turn');
      if (!TERMINAL.has(v.turn.status)) return beginStop('malformed-protocol');
      if (s.terminalStatus.has(v.threadId) && s.terminalStatus.get(v.threadId) !== v.turn.status) return beginStop('turn-failed');
      s.terminalStatus.set(v.threadId, v.turn.status);
      s.terminal.add(v.threadId);
      if (s.phase !== 'stopping' && v.turn.status !== 'completed') return beginStop('turn-failed');
      if (v.threadId === s.parent && s.phase !== 'stopping') s.finishAt = s.now;
      return progressStop();
    }
    if (s.phase === 'stopping') return;
    if (p.method === 'thread/tokenUsage/updated') {
      const n = v.tokenUsage?.total?.totalTokens;
      if (!Number.isSafeInteger(n) || n < 0 || n < (s.usage.get(v.threadId) ?? 0)) return beginStop('usage-invalid');
      s.usage.set(v.threadId, n);
      const total = [...s.usage.values()].reduce((a, b) => a + b, 0);
      if (!Number.isSafeInteger(total) || total > BOUNDS.tokens) return beginStop('usage-limit');
      return;
    }
    if (!['item/started', 'item/completed'].includes(p.method) || !v.item || !ref(v.item.id)) return beginStop('unsupported-notification');
    const item = v.item, completed = p.method === 'item/completed';
    if (item.type === 'collabAgentToolCall') {
      if (v.threadId !== s.parent) return beginStop('unexpected-action');
      if (item.tool === 'spawnAgent') {
        if (!s.spawnIds.has(item.id)) s.spawnIds.add(item.id);
        if (s.spawnIds.size > 1) return beginStop('extra-child');
        if (completed) resolvedChild(item, 'v1'); // Started/requested values are deliberately ignored.
      } else if (item.tool === 'wait') {
        if (!s.child || item.senderThreadId !== s.parent || !Array.isArray(item.receiverThreadIds)
          || item.receiverThreadIds.some(x => x !== s.child) || ++s.waits > 16) beginStop('unexpected-action');
      } else beginStop('unexpected-action');
    } else if (item.type === 'subAgentActivity') {
      if (v.threadId !== s.parent || !['started', 'completed', 'interrupted', 'interacted'].includes(item.kind)) return beginStop('unexpected-action');
      if (item.kind === 'started' && completed) resolvedChild(item, 'v2');
      else if (item.kind !== 'started' && item.agentThreadId !== s.child) beginStop('unexpected-thread');
      else if (item.kind === 'interacted' || item.kind === 'interrupted') beginStop('unexpected-action');
    } else if (item.type === 'agentMessage') {
      if (completed) {
        if (item.text !== ROUTE.marker) return beginStop('output-mismatch');
        s.outputs.add(v.threadId);
      }
    } else if (!['userMessage', 'reasoning'].includes(item.type)) beginStop('unexpected-action');
  }
  function advance(now) {
    if (!Number.isSafeInteger(now) || now < s.now) { beginStop('driver-error'); return; }
    s.now = now;
    if (s.phase === 'done') return;
    if (s.phase === 'stopping') return progressStop();
    if (now >= BOUNDS.outerMs - BOUNDS.cleanupMs - BOUNDS.cleanupGraceMs) return beginStop('outer-timeout');
    if (s.workAt !== null && now - s.workAt >= BOUNDS.workMs) return beginStop('work-timeout');
    if ([...s.pending.values()].some(p => now - p.at >= BOUNDS.requestMs)) return beginStop('request-timeout');
    if (s.finishAt !== null && now - s.finishAt >= BOUNDS.settleMs) {
      s.normalComplete = !!s.selection && s.childMeta && s.terminal.has(s.child) && s.outputs.has(s.parent)
        && s.outputs.has(s.child) && s.usage.has(s.parent) && s.usage.has(s.child);
      beginStop(s.normalComplete ? null : 'incomplete-evidence');
    }
  }
  return Object.freeze({
    start() {
      if (s.phase !== 'new') return beginStop('driver-error');
      s.phase = 'initializing'; send('initialize', { clientInfo: { name: 'claude_mods_synthetic_driver', version: '1' },
        capabilities: { experimentalApi: true } }, 'initialize');
    },
    receive(p) {
      if (s.phase === 'done') return;
      try {
        if (!jsonData(p) || !p || typeof p !== 'object' || Array.isArray(p)) return beginStop('malformed-protocol');
        const hasId = Object.hasOwn(p, 'id'), method = Object.hasOwn(p, 'method');
        if (method) {
          if (typeof p.method !== 'string' || Object.hasOwn(p, 'result') || Object.hasOwn(p, 'error')) return beginStop('malformed-protocol');
          if (hasId) {
            if (!rpcId(p.id)) return beginStop('malformed-protocol');
            if (!owned(p.params?.threadId)) {
              s.out.push({ id: p.id, error: { code: -32601, message: 'Routing dry driver refuses an unowned request' } });
              return beginStop('unexpected-thread');
            }
            s.out.push(denyServerRequest(p)); return beginStop('server-request-denied');
          }
          event(p);
        } else {
          if (!hasId || !rpcId(p.id) || Object.hasOwn(p, 'result') === Object.hasOwn(p, 'error')) return beginStop('malformed-protocol');
          response(p);
        }
      } catch { beginStop('malformed-protocol'); }
    },
    advance,
    abort(reason) { beginStop(REASONS.has(reason) ? reason : 'driver-error'); },
    takeOutbound() { return s.out.splice(0).map(rpc => {
      const req = rpc.method && s.pending.get(rpc.id);
      if (req) { req.sent = true; if (req.kind === 'turn') { s.turnStarts++; s.workAt = s.now; } }
      return { domain: 'synthetic-only', rpc };
    }); },
    report() {
      const cleanupConfirmed = s.phase === 'done' && !s.cancellationExpired && !s.uncertainTurnStart && !s.untrackedActivity
        && !active().length && !modelPending()
        && [...s.interruptSent].every(id => s.interruptAck.has(id))
        && [s.parent, s.child].filter(Boolean).every(id => s.unsubscribeAck.has(id));
      const parent = s.usage.get(s.parent) ?? null, child = s.usage.get(s.child) ?? null;
      return { synthetic: true, nativeInferenceCalls: 0, nativeRoutingVerified: false, liveAdmission: liveAdmission(),
        done: s.phase === 'done', outcome: s.normalComplete && cleanupConfirmed ? 'passed'
          : s.reason === 'incomplete-evidence' ? 'incomplete' : 'stopped', reason: s.reason,
        resolvedSelection: s.selection?.family ?? 'unavailable', childMetadataMatched: s.childMeta,
        outputMatched: s.outputs.has(s.parent) && s.outputs.has(s.child), syntheticTurnStarts: s.turnStarts,
        usage: { parent, child, combined: parent !== null && child !== null ? parent + child : null },
        cleanupConfirmed, cancellationExpired: s.cancellationExpired, uncertainTurnStart: s.uncertainTurnStart,
        untrackedActivity: s.untrackedActivity };
    },
  });
}
