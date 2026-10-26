// Fixed reviewed Node peer only. No Codex, credential/config reads or network.
import { createInterface } from 'node:readline';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { READINESS_SCENARIOS, syntheticReadinessPlan, readinessConfig, readinessHooks, readinessHook, SECRET } from './readiness-fixtures.mjs';
const scenario = process.argv[2];
if (!READINESS_SCENARIOS.includes(scenario) || Object.keys(process.env).some(k => k === 'SYNTHETIC_PARENT_SECRET')) process.exit(23);
const plan = syntheticReadinessPlan(), send = x => process.stdout.write(JSON.stringify(x) + '\n');
if (scenario === 'ignore-term') process.on('SIGTERM', () => {});
const keep = ['stall', 'ignore-term', 'cancel'].includes(scenario) ? setInterval(() => {}, 1000) : null;
if (scenario === 'descendant') {
  // POSIX-only test of an owned group whose leader exits but a leaf holds pipes.
  spawn(process.execPath, [fileURLToPath(new URL('./readiness-leaf.mjs', import.meta.url))],
    { stdio: ['ignore', 1, 2], env: {}, detached: false, windowsHide: true });
  setTimeout(() => process.exit(0), 120);
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
  if (r.id === 1 && scenario === 'server-request') { send({ id: 77, method: 'item/permissions/requestApproval', params: { secret: SECRET } }); return; }
  let result;
  if (r.method === 'initialize') result = {};
  else if (r.method === 'config/read') {
    result = readinessConfig(plan);
    if (r.id === 5 && scenario === 'changed') result.config.hooks.state.synthetic.enabled = false;
  } else if (r.method === 'configRequirements/read') result = { requirements: scenario === 'policy' ? { hooks: { secret: SECRET } } : null };
  else if (r.method === 'hooks/list') result = readinessHooks(plan, scenario === 'hook' ? [readinessHook()] : []);
  else { process.exitCode = 25; input.close(); return; }
  send({ id: r.id, result });
  if (r.id === 5 && scenario === 'late-notification') send({ method: 'thread/started', params: { secret: SECRET } });
  if (r.id === 5 && scenario === 'exit-failure') process.exitCode = 17;
});
input.on('close', () => { if (!keep) process.stdin.unref(); });
