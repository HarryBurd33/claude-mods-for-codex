import { ROUTE } from './routing-contract.mjs';

export const SCENARIOS = Object.freeze(['happy-v1', 'happy-v2', 'parent-mismatch', 'catalog-missing', 'model-mismatch',
  'wrong-role', 'missing-usage', 'requested-only', 'extra-child', 'extra-action', 'extra-turn', 'reroute',
  'deny-command', 'deny-file', 'deny-permissions', 'deny-input', 'deny-elicitation', 'deny-dynamic', 'deny-unknown',
  'malformed', 'invalid-utf8', 'frame-overflow', 'byte-overflow', 'disconnect', 'ignore-interrupt', 'stalled', 'ignore-term',
  'stderr-secret', 'env-isolation', 'exit-failure']);
export const PARENT = 'synthetic-parent', CHILD = 'synthetic-child', PTURN = 'synthetic-parent-turn', CTURN = 'synthetic-child-turn';
export const notify = (method, params) => ({ method, params });
export const childThread = () => ({ id: CHILD, ephemeral: true, parentThreadId: PARENT, agentRole: ROUTE.role,
  model: ROUTE.childModel, reasoningEffort: ROUTE.effort, source: { subAgent: { thread_spawn: {
    parent_thread_id: PARENT, agent_role: ROUTE.role, depth: 1 } } } });
export const parentResult = () => ({ thread: { id: PARENT, ephemeral: true }, model: ROUTE.parentModel,
  reasoningEffort: ROUTE.effort, cwd: ROUTE.cwd, sandbox: { type: 'readOnly' }, approvalPolicy: 'on-request', approvalsReviewer: 'user' });
export const catalogResult = () => ({ data: [ROUTE.parentModel, ROUTE.childModel].map(model => ({ model,
  supportedReasoningEfforts: [{ reasoningEffort: ROUTE.effort }], hidden: false })), nextCursor: null });
export const turnStarted = (threadId, id) => notify('turn/started', { threadId, turn: { id, status: 'inProgress' } });
export const turnCompleted = (threadId, id, status = 'completed') => notify('turn/completed', { threadId, turn: { id, status } });
export const itemPacket = (threadId, item, completed = true) => notify(completed ? 'item/completed' : 'item/started', { threadId, item });
export const selection = (v = 'v2') => itemPacket(PARENT, v === 'v1' ? { type: 'collabAgentToolCall', id: 'spawn-1', tool: 'spawnAgent',
  status: 'completed', senderThreadId: PARENT, receiverThreadIds: [CHILD], model: ROUTE.childModel, reasoningEffort: ROUTE.effort,
  agentsStates: { [CHILD]: { status: 'running' } }, prompt: 'SYNTHETIC_SECRET_DO_NOT_LOG' }
  : { type: 'subAgentActivity', id: 'spawn-1', kind: 'started', agentThreadId: CHILD, agentPath: '/root/routing-check',
    model: ROUTE.childModel, reasoningEffort: ROUTE.effort });
export const message = threadId => itemPacket(threadId, { type: 'agentMessage', id: 'message-' + threadId, text: ROUTE.marker });
export const usage = (threadId, n) => notify('thread/tokenUsage/updated', { threadId, turnId: threadId === PARENT ? PTURN : CTURN,
  tokenUsage: { total: { totalTokens: n, inputTokens: n, outputTokens: 0, cachedInputTokens: 0, reasoningOutputTokens: 0 },
    last: { totalTokens: n, inputTokens: n, outputTokens: 0, cachedInputTokens: 0, reasoningOutputTokens: 0 }, modelContextWindow: null } });
export const serverMethod = Object.freeze({ 'deny-command': 'item/commandExecution/requestApproval', 'deny-file': 'item/fileChange/requestApproval',
  'deny-permissions': 'item/permissions/requestApproval', 'deny-input': 'item/tool/requestUserInput',
  'deny-elicitation': 'mcpServer/elicitation/request', 'deny-dynamic': 'item/tool/call', 'deny-unknown': 'synthetic/unknown' });
