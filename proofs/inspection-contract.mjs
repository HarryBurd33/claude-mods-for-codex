// Inspection-only review data. No filesystem/process/network IO or model task.
import { posix } from 'node:path';
import { jsonData } from './routing-contract.mjs';
import { nativeHookMetadataOnly } from './routing-native-hooks.mjs';

const keys = (v, wanted) => v && !Array.isArray(v) && Object.keys(v).sort().join(',') === wanted.split(',').sort().join(',');
const sha = v => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
const path = v => typeof v === 'string' && v.length <= 4096 && v.startsWith('/') && v !== '/'
  && posix.normalize(v) === v && !/[\x00-\x1f\x7f\\]/u.test(v) && v.isWellFormed();
const freeze = v => { if (v && typeof v === 'object') { for (const x of Object.values(v)) freeze(x); Object.freeze(v); } return v; };
const FEATURES = Object.freeze({ shell_tool: false, shell_snapshot: false, apps: false, plugins: false,
  plugin_hooks: false, memories: false, memory_tool: false, request_permissions_tool: false,
  view_image: false, image_generation: false, agent_message_board: false, goals: false,
  skip_host_skill_discovery: true, code_mode: false, code_mode_only: false, code_mode_prewarm: false,
  multi_agent_v2: false, multi_agent_v2_dynamic_tools: false });

export function requireInspectionAdmission() {
  throw Error('Native inspection is unavailable in this offline-only driver');
}
export function createInspectionPlan(input) {
  if (!jsonData(input) || !keys(input, 'cliPath,cliSha256,cwd,configFiles,disabledMcpServers')) throw Error('Inspection input refused');
  if (!path(input.cliPath) || !path(input.cwd) || !sha(input.cliSha256)
    || !Array.isArray(input.configFiles) || input.configFiles.length < 1 || input.configFiles.length > 8
    || !input.configFiles.every(v => keys(v, 'path,sha256') && path(v.path) && sha(v.sha256))
    || new Set(input.configFiles.map(v => v.path)).size !== input.configFiles.length
    || !Array.isArray(input.disabledMcpServers) || input.disabledMcpServers.length > 64
    || !input.disabledMcpServers.every(v => typeof v === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(v))
    || new Set(input.disabledMcpServers).size !== input.disabledMcpServers.length) throw Error('Inspection identity refused');
  const selected = structuredClone(input);
  selected.configFiles.sort((a, b) => a.path.localeCompare(b.path)); selected.disabledMcpServers.sort();
  const requirements = Object.entries(FEATURES).map(([k, value]) => ({ path: ['features', k], value }));
  requirements.push(...[
    [['web_search'], 'disabled'], [['sandbox_mode'], 'read-only'],
    [['approval_policy'], 'on-request'], [['approvals_reviewer'], 'user'],
  ].map(([path, value]) => ({ path, value })));
  for (const name of selected.disabledMcpServers) requirements.push({ path: ['mcp_servers', name, 'enabled'], value: false });
  const argv = ['--no-daemon', '-C', selected.cwd];
  for (const r of requirements) argv.push('-c', r.path.join('.') + '=' + JSON.stringify(r.value));
  // Strict startup avoids the source's permissive fallback-to-defaults branch.
  // These remain unexecuted review data; startup side effects are not excluded.
  argv.push('app-server', '--stdio', '--strict-config');
  return freeze({ schema: 1, kind: 'inspection-only', target: { platform: 'darwin', cliVersion: '0.164.0' },
    input: selected, requirements, argv, spawn: { cwd: selected.cwd, shell: false, stdio: ['pipe', 'pipe', 'pipe'] },
    authorization: 'absent', executionAuthorized: false, inspectionAdmission: false, liveAdmission: false,
    nativeStartupVerified: false });
}
export function validateInspectionPlan(plan) {
  if (!jsonData(plan)) throw Error('Inspection plan refused');
  const expected = createInspectionPlan(plan.input);
  if (JSON.stringify(plan) !== JSON.stringify(expected)) throw Error('Inspection plan changed');
  return expected;
}
export function inspectionConfigMatches(reviewPlan, config) {
  const plan = validateInspectionPlan(reviewPlan);
  if (!jsonData(config) || !config || Array.isArray(config)) return false;
  const lookup = p => p.reduce((v, k) => v && typeof v === 'object' && Object.hasOwn(v, k) ? v[k] : undefined, config);
  if (!plan.requirements.every(r => lookup(r.path) === r.value)) return false;
  const servers = config.mcp_servers;
  if (servers && (typeof servers !== 'object' || Array.isArray(servers)
    || Object.entries(servers).some(([name, v]) => !plan.input.disabledMcpServers.includes(name) || v?.enabled !== false))) return false;
  return nativeHookMetadataOnly(config.hooks) && !config.multi_agent_v2?.message_board_remote;
}
export function describeInspection() {
  return { mode: 'inspection-only-offline', executionAuthorized: false, inspectionAdmission: false,
    liveAdmission: false, nativeInspectionVerified: false, nativeTransportImplemented: false,
    startupBlockers: ['remote-ingress-unexcluded', 'startup-side-effects-unverified', 'selected-inputs-not-refreshed'],
    fixedPeer: 'POSIX Node only; not a Codex process or Windows compatibility proof' };
}
