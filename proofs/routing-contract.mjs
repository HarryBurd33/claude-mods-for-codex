// Verification-only contract. No native transport, configuration, model or IO.
export const ROUTE = Object.freeze({ parentModel: 'gpt-6.1-sol', childModel: 'gpt-6-luna', effort: 'low',
  role: 'mods-native-route-check', marker: 'MODS_NATIVE_ROUTING_CHILD_OK', cwd: '/synthetic/routing-project' });
export const BOUNDS = Object.freeze({ requestMs: 10000, workMs: 90000, outerMs: 120000, cleanupMs: 5000,
  cleanupGraceMs: 1000, settleMs: 100, bytes: 2 * 1024 * 1024, frameBytes: 65536, messages: 512, tokens: 50000 });
export const PARENT_TEXT = `Perform only this synthetic routing check. Spawn exactly one agent using native
agent_type "mods-native-route-check"; use task_name "routing-check" if required.
For V2 set fork_turns to "none"; for V1 set fork_context to false. Do not set
model or reasoning_effort in the spawn arguments: the named role must select them.
Send the child exactly: "Return only the fixed response specified by your configured
role. Use no tools." Do not read files, run commands, use MCP, skills or web tools,
or create any other agents. Wait for that child's completion and return its response
verbatim. If named role selection is unavailable, stop with ROUTING_UNAVAILABLE;
do not substitute another role/model or retry.`;

// Deliberately cannot be opened by a flag, config echo, hook response, fixture,
// claimed authorization, environment variable or injected transport. There is no
// native adapter in this build. Synthetic admission is a separate trust domain.
export function liveAdmission() {
  return { admitted: false, authorization: 'absent', nativeToolAdmission: 'unverified', transport: 'not-implemented' };
}
export function requireLiveAdmission() { throw Error('Live routing is unavailable in this dry-only driver'); }
export const CHILD_TEXT = 'Return only the fixed response specified by your configured role. Use no tools.';
export function createSyntheticAdmission() {
  let spawned = false, waits = 0;
  return Object.freeze({
    admit(value) {
      if (!jsonData(value) || value?.actor !== 'parent' || typeof value.name !== 'string'
        || Object.keys(value).sort().join(',') !== 'actor,arguments,name') return false;
      const a = value.arguments;
      if (value.name === 'spawn_agent') {
        if (spawned || !a || typeof a !== 'object' || Array.isArray(a)) return false;
        const keys = Object.keys(a).sort().join(',');
        const v1 = keys === 'agent_type,fork_context,message' && a.fork_context === false;
        const v2 = keys === 'agent_type,fork_turns,message,task_name' && a.fork_turns === 'none' && a.task_name === 'routing-check';
        if ((!v1 && !v2) || a.agent_type !== ROUTE.role || a.message !== CHILD_TEXT) return false;
        spawned = true; return true;
      }
      if (value.name === 'wait_agent' && spawned && a && Object.keys(a).join(',') === 'target' && a.target === 'synthetic-child' && waits < 8) {
        waits++; return true;
      }
      return false;
    },
  });
}
export function jsonData(value) {
  let nodes = 0;
  function visit(v, depth) {
    if (++nodes > 4096 || depth > 24) return false;
    if (v === null || typeof v === 'boolean') return true;
    if (typeof v === 'string') return v.length <= BOUNDS.frameBytes && v.isWellFormed();
    if (typeof v === 'number') return Number.isFinite(v);
    if (!v || typeof v !== 'object') return false;
    const proto = Object.getPrototypeOf(v), keys = Reflect.ownKeys(v);
    if (Array.isArray(v)) {
      if (proto !== Array.prototype || v.length > 512 || keys.length !== v.length + 1) return false;
      for (let i = 0; i < v.length; i++) {
        const d = Object.getOwnPropertyDescriptor(v, String(i));
        if (!d || !Object.hasOwn(d, 'value') || !visit(d.value, depth + 1)) return false;
      }
      return true;
    }
    if (![Object.prototype, null].includes(proto) || keys.length > 512) return false;
    for (const key of keys) {
      const d = Object.getOwnPropertyDescriptor(v, key);
      if (typeof key !== 'string' || !Object.hasOwn(d, 'value') || !visit(d.value, depth + 1)) return false;
    }
    return true;
  }
  return visit(value, 0);
}
export const ref = v => typeof v === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(v);
export const rpcId = v => ref(v) || Number.isSafeInteger(v) && v >= 0;
export function denyServerRequest(packet) {
  if (!jsonData(packet) || !rpcId(packet.id) || typeof packet.method !== 'string') throw Error('Invalid routing request');
  let result;
  switch (packet.method) {
    case 'item/commandExecution/requestApproval':
    case 'item/fileChange/requestApproval': result = { decision: 'cancel' }; break;
    case 'execCommandApproval':
    case 'applyPatchApproval': result = { decision: 'abort' }; break;
    case 'item/permissions/requestApproval': result = { permissions: {}, scope: 'turn' }; break;
    case 'item/tool/requestUserInput': result = { answers: {} }; break;
    case 'mcpServer/elicitation/request': result = { action: 'decline', content: null }; break;
    case 'item/tool/call': result = { contentItems: [], success: false }; break;
    default: return { id: packet.id, error: { code: -32601, message: 'Routing dry driver declines this request' } };
  }
  return { id: packet.id, result };
}
