// Fixed Node fixture, not a Codex adapter. Never accepts an arbitrary executable.
import { createInterface } from 'node:readline';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { INSPECTION_SCENARIOS, syntheticInspectionPlan, inspectionConfig, inspectionHooks, INSPECTION_SECRET } from './inspection-fixtures.mjs';
const scenario = process.argv[2];
if (!INSPECTION_SCENARIOS.includes(scenario) || 'SYNTHETIC_PARENT_SECRET' in process.env) process.exit(23);
const plan = syntheticInspectionPlan(process.cwd()), send = x => process.stdout.write(JSON.stringify(x) + '\n');
// Private fixed-peer preface: actual process cwd is checked, discarded and never
// treated as native endpoint evidence or included in a retained report.
send({ fixedPeerCwd: scenario === 'wrong-cwd' ? '/synthetic/wrong' : process.cwd() });
if (scenario === 'ignore-term') process.on('SIGTERM', () => {});
const keep = ['stall', 'ignore-term', 'cancel'].includes(scenario) ? setInterval(() => {}, 1000) : null;
if (scenario === 'descendant') {
  spawn(process.execPath, [fileURLToPath(new URL('./readiness-leaf.mjs', import.meta.url))],
    { stdio: ['ignore', 1, 2], env: {}, detached: false });
  setTimeout(() => process.exit(0), 100);
}
const input = createInterface({ input: process.stdin });
input.on('line', line => {
  let r; try { r = JSON.parse(line); } catch { process.exitCode = 24; input.close(); return; }
  if (!Object.hasOwn(r, 'id')) return;
  if (r.id === 1 && ['stall', 'ignore-term', 'cancel', 'descendant'].includes(scenario)) return;
  if (r.id === 1 && scenario === 'malformed') { process.stdout.write('{bad-json\n'); return; }
  if (r.id === 1 && scenario === 'partial') { process.stdout.write('{"id":'); input.close(); return; }
  if (r.id === 1 && scenario === 'oversized') { process.stdout.write('x'.repeat(65538)); return; }
  if (r.id === 1 && scenario === 'stderr-overflow') { process.stderr.write(Buffer.alloc(1048577, 120)); return; }
  if (r.id === 1 && scenario === 'server-request') { send({ id: 77, method: 'item/permissions/requestApproval', params: { secret: INSPECTION_SECRET } }); return; }
  let result;
  if (r.method === 'initialize') result = {};
  else if (r.method === 'config/read') {
    result = inspectionConfig(plan);
    if (r.id === 5 && scenario === 'changed') result.config.hooks.state.synthetic.enabled = false;
  } else if (r.method === 'configRequirements/read') result = { requirements: scenario === 'policy' ? { hooks: { secret: INSPECTION_SECRET } } : null };
  else if (r.method === 'hooks/list') result = inspectionHooks(plan, scenario === 'hook');
  else { process.exitCode = 25; input.close(); return; }
  if (r.id === 1 && scenario === 'delayed') setTimeout(() => send({ id: 1, result }), 300);
  else send({ id: r.id, result });
  if (r.id === 5 && scenario === 'late-notification') send({ method: 'thread/started', params: { secret: INSPECTION_SECRET } });
  if (r.id === 5 && scenario === 'exit-failure') process.exitCode = 17;
});
input.on('close', () => { if (!keep) process.stdin.unref(); });
