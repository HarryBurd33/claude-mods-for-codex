// Synthetic data only; no selected host inputs or credential/session reads.
import { createInspectionPlan } from './inspection-contract.mjs';
export const INSPECTION_SECRET = 'SYNTHETIC_INSPECTION_DO_NOT_RETAIN';
export const INSPECTION_SCENARIOS = Object.freeze(['empty', 'hook', 'policy', 'changed', 'wrong-cwd',
  'malformed', 'partial', 'oversized', 'stderr-overflow', 'server-request', 'late-notification',
  'exit-failure', 'stall', 'ignore-term', 'cancel', 'descendant', 'delayed', 'silent-descendant']);
export function syntheticInspectionPlan(cwd = '/synthetic/empty-project') {
  return createInspectionPlan({ cliPath: '/synthetic/never-execute', cliSha256: 'a'.repeat(64), cwd,
    configFiles: [{ path: '/synthetic/config.toml', sha256: 'b'.repeat(64) }], disabledMcpServers: ['synthetic_mcp'] });
}
export function inspectionConfig(plan = syntheticInspectionPlan()) {
  const c = {};
  for (const { path, value } of plan.requirements) {
    let o = c; for (const k of path.slice(0, -1)) o = o[k] ??= {}; o[path.at(-1)] = value;
  }
  c.features.hooks = true; c.hooks = { state: { synthetic: { enabled: true, trusted_hash: INSPECTION_SECRET } } };
  c.unrelatedSensitive = INSPECTION_SECRET;
  return { config: c, origins: { secret: INSPECTION_SECRET }, layers: null };
}
export function inspectionHooks(plan, hook = false) {
  return { data: [{ cwd: plan.input.cwd, warnings: [], errors: [], hooks: hook ? [{ key: INSPECTION_SECRET,
    eventName: 'preToolUse', handlerType: 'command', command: INSPECTION_SECRET, async: false,
    matcher: '', timeoutSec: 5, sourcePath: '/synthetic/' + INSPECTION_SECRET, source: 'user',
    displayOrder: 0, enabled: false, isManaged: false, currentHash: INSPECTION_SECRET, trustStatus: 'trusted' }] : [] }] };
}
