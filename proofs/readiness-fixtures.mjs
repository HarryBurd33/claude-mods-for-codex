// Entirely synthetic inputs; no user settings, executable or private paths.
import { createNativePlan, CANDIDATE_SHA256 } from './routing-native-plan.mjs';
export const READINESS_SCENARIOS = Object.freeze(['empty', 'hook', 'policy', 'changed', 'malformed',
  'partial', 'oversized', 'stderr-overflow', 'late-notification', 'server-request', 'exit-failure',
  'stall', 'ignore-term', 'cancel', 'descendant']);
export const SECRET = 'SYNTHETIC_SENSITIVE_DO_NOT_RETAIN';
export function syntheticReadinessPlan() {
  return createNativePlan({ cliPath: '/synthetic/never-execute', cliSha256: 'a'.repeat(64),
    cwd: '/synthetic/empty-project', candidatePath: '/synthetic/inert-candidate.txt', candidateSha256: CANDIDATE_SHA256,
    configFiles: [{ path: '/synthetic/config.toml', sha256: 'b'.repeat(64) }], disabledMcpServers: ['synthetic_mcp'] });
}
export function readinessConfig(plan = syntheticReadinessPlan()) {
  const c = {};
  for (const { path, value } of plan.requirements) {
    let o = c; for (const k of path.slice(0, -1)) o = o[k] ??= {}; o[path.at(-1)] = value;
  }
  c.features.hooks = true;
  c.hooks = { state: { synthetic: { enabled: true, trusted_hash: 'sha256:synthetic' } } };
  c.unrelatedSensitive = SECRET;
  return { config: c, origins: { sensitive: { name: SECRET, version: SECRET } }, layers: null };
}
export function readinessHook() {
  return { key: SECRET, eventName: 'preToolUse', handlerType: 'command', command: SECRET, async: false,
    matcher: SECRET, timeoutSec: 5, statusMessage: SECRET, additionalContextLimit: null,
    sourcePath: '/synthetic/' + SECRET, source: 'user', pluginId: null, displayOrder: 0,
    enabled: false, isManaged: false, currentHash: SECRET, trustStatus: 'untrusted' };
}
export function readinessHooks(plan = syntheticReadinessPlan(), hooks = []) {
  return { data: [{ cwd: plan.input.cwd, hooks, warnings: [], errors: [] }] };
}
