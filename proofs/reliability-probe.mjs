// Isolated fixed regression harness. No model/native client, selected plan, tool
// factory or user source. Timer/serialization stalls affect this test process only.
import { performance } from 'node:perf_hooks';
import { runFixedReadiness } from './readiness-driver.mjs';
import { runFixedInspection } from './inspection-driver.mjs';
import { settleFixedFixtureGroupDetail } from './process-group-observation.mjs';
const mode = process.argv[2];
if (process.argv.length !== 3 || !['readiness-late', 'readiness-serialize', 'inspection-serialize', 'settlement-late'].includes(mode)) process.exit(2);
if (mode === 'settlement-late') {
  const kill = process.kill;
  let calls = 0;
  try {
    process.kill = () => {
      calls++;
      if (calls === 1) setTimeout(() => {
        const end = performance.now() + 2100;
        while (performance.now() < end) { /* isolated event-loop stall */ }
      }, 0);
      throw Object.assign(new Error('fixed'), {code:'EPERM'});
    };
    const report = await settleFixedFixtureGroupDetail(12345);
    process.stdout.write(JSON.stringify({calls, ...report}) + '\n');
  } finally { process.kill = kill; }
  process.exit(0);
}
const interval = globalThis.setInterval, stringify = JSON.stringify;
let stalled = false;
try {
  if (mode === 'readiness-late') globalThis.setInterval = callback => interval(callback, 5200);
  else JSON.stringify = function(value, ...rest) {
    if (!stalled && value?.method === 'config/read') {
      stalled = true; const end = performance.now() + (mode === 'readiness-serialize' ? 4200 : 2700);
      while (performance.now() < end) { /* deterministic serialization boundary stall */ }
    }
    return stringify(value, ...rest);
  };
  const report = mode === 'inspection-serialize' ? await runFixedInspection('empty')
    : await runFixedReadiness(mode === 'readiness-late' ? 'late-packet' : 'empty');
  globalThis.setInterval = interval; JSON.stringify = stringify;
  process.stdout.write(JSON.stringify(report) + '\n');
} finally { globalThis.setInterval = interval; JSON.stringify = stringify; }
