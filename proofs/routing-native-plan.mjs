// Review-only native launch contract. No filesystem, process, network or model IO.
import { posix } from 'node:path';
import { ROUTE, BOUNDS, jsonData } from './routing-contract.mjs';
import { nativeHookMetadataOnly } from './routing-native-hooks.mjs';

export const NATIVE_TARGET = Object.freeze({ platform: 'darwin', cliVersion: '0.164.0', backend: 'v2' });
export const NATIVE_PARENT_TEXT = `Perform only this synthetic routing check. Spawn exactly one native agent using
agent_type "mods-native-route-check", task_name "routing-check", and fork_turns "none".
Do not set model or reasoning_effort in spawn arguments: the named role must select them.
Send the child exactly: "Return only the fixed response specified by your configured role. Use no tools."
Use only the necessary waits for that child and return its response verbatim.
Do not read files, run commands, use MCP, skills or web tools, send follow-ups,
or create another agent. If this V2 named role is unavailable, return ROUTING_UNAVAILABLE;
do not substitute another backend, role or model, or retry.`;
export const CANDIDATE_SHA256 = 'f17550c7ea7a60b055f63fd907341207f0c5d3877be798d643f26962fcf5e022';
const sha = v => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
const path = v => typeof v === 'string' && v.length <= 4096 && v.startsWith('/') && v !== '/'
  && posix.normalize(v) === v && !/[\x00-\x1f\x7f\\]/u.test(v) && v.isWellFormed();
const keys = (v, wanted) => v && !Array.isArray(v) && Object.keys(v).sort().join(',') === wanted.split(',').sort().join(',');
const freeze = v => { if (v && typeof v === 'object') { for (const x of Object.values(v)) freeze(x); Object.freeze(v); } return v; };

// These are proposed process-only reductions, not a universal tool allowlist.
// Full resolved-config confirmation is required before drafting a model turn.
const REDUCTIONS = Object.freeze({ shell_tool: false, shell_snapshot: false, apps: false, plugins: false,
  plugin_hooks: false, memories: false, memory_tool: false, request_permissions_tool: false,
  view_image: false, image_generation: false, agent_message_board: false, goals: false,
  skip_host_skill_discovery: true, code_mode: false, code_mode_only: false, code_mode_prewarm: false,
  multi_agent_v2: true, multi_agent_v2_dynamic_tools: false });
export function createNativePlan(input) {
  if (!jsonData(input) || !keys(input, 'cliPath,cliSha256,cwd,candidatePath,candidateSha256,configFiles,disabledMcpServers')) throw Error('Native review input refused');
  if (![input.cliPath, input.cwd, input.candidatePath].every(path) || !sha(input.cliSha256)
    || input.candidateSha256 !== CANDIDATE_SHA256 || input.cliPath === input.candidatePath) throw Error('Native review identity refused');
  if (!Array.isArray(input.configFiles) || input.configFiles.length < 1 || input.configFiles.length > 8 || !input.configFiles.every(x => keys(x, 'path,sha256') && path(x.path) && sha(x.sha256))
    || new Set(input.configFiles.map(x => x.path)).size !== input.configFiles.length) throw Error('Native review configuration refused');
  if (!Array.isArray(input.disabledMcpServers) || input.disabledMcpServers.length > 64
    || !input.disabledMcpServers.every(x => typeof x === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(x))
    || new Set(input.disabledMcpServers).size !== input.disabledMcpServers.length) throw Error('Native review MCP selection refused');
  const selected = JSON.parse(JSON.stringify(input)); selected.disabledMcpServers.sort(); selected.configFiles.sort((a, b) => a.path.localeCompare(b.path));
  const requirements = Object.entries(REDUCTIONS).map(([name, value]) => ({ path: ['features', name], value }));
  requirements.push(...[
    [['web_search'], 'disabled'], [['model_reasoning_effort'], ROUTE.effort], [['sandbox_mode'], 'read-only'],
    [['approval_policy'], 'on-request'], [['approvals_reviewer'], 'user'],
    [['agents', 'max_concurrent_threads_per_session'], 1], [['multi_agent_v2', 'max_concurrent_threads_per_session'], 1],
    [['multi_agent_v2', 'disable_direct_message'], true], [['multi_agent_v2', 'expose_spawn_agent_model_overrides'], false],
    [['multi_agent_v2', 'wait_agent_enabled'], true], [['multi_agent_v2', 'message_board_in_memory'], true],
    [['agents', ROUTE.role, 'config_file'], selected.candidatePath],
  ].map(([path, value]) => ({ path, value })));
  for (const name of selected.disabledMcpServers) requirements.push({ path: ['mcp_servers', name, 'enabled'], value: false });
  const argv = ['--no-daemon', '-C', selected.cwd];
  for (const r of requirements) argv.push('-c', r.path.join('.') + '=' + JSON.stringify(r.value));
  argv.push('app-server');
  return freeze({ schema: 1, target: { ...NATIVE_TARGET }, input: selected, requirements, argv,
    threadStart: { model: ROUTE.parentModel, ephemeral: true, sandbox: 'read-only', cwd: selected.cwd,
      approvalPolicy: 'on-request', approvalsReviewer: 'user', experimentalRawEvents: false, allowProviderModelFallback: false },
    turnInput: [{ type: 'text', text: NATIVE_PARENT_TEXT }], bounds: { ...BOUNDS },
    authorization: 'absent', liveAdmission: false, strictToolAdmission: false });
}
export function validateNativePlan(plan) {
  if (!jsonData(plan)) throw Error('Native review plan refused');
  const expected = createNativePlan(plan.input);
  if (JSON.stringify(plan) !== JSON.stringify(expected)) throw Error('Native review plan changed');
  return expected;
}
export function nativeConfigMatches(plan, config) {
  plan = validateNativePlan(plan);
  if (!jsonData(config) || !config || Array.isArray(config)) return false;
  const lookup = parts => parts.reduce((v, k) => v && typeof v === 'object' && Object.hasOwn(v, k) ? v[k] : undefined, config);
  if (!plan.requirements.every(r => lookup(r.path) === r.value)) return false;
  // No implicit inherited MCP or remote board. Unknown active entries fail closed.
  const servers = config.mcp_servers;
  if (servers && (typeof servers !== 'object' || Array.isArray(servers)
    || Object.entries(servers).some(([name, v]) => !plan.input.disabledMcpServers.includes(name) || v?.enabled !== false))) return false;
  // Metadata classification is neither hook discovery nor execution authority.
  if (!nativeHookMetadataOnly(config.hooks)) return false;
  if (config.multi_agent_v2?.message_board_remote) return false;
  return true;
}
export function describeNativePreparation() {
  return { target: NATIVE_TARGET, executionAuthorized: false, liveAdmission: false, nativeRoutingVerified: false,
    mode: 'review-only', intendedParentModel: ROUTE.parentModel, intendedChildModel: ROUTE.childModel, effort: ROUTE.effort,
    residualAccess: 'ordinary-host-permitted-reads-and-remaining-native-tools', inferenceGrantRequired: true,
    configurationChangeAuthorized: false, installationAuthorized: false };
}
