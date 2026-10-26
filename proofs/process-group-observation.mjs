// A scoped existence observation, never a kill/adoption capability. A PGID can be
// reused after leader close: presence is deliberately labelled ambiguous.
import { performance } from 'node:perf_hooks';
import { setTimeout as delay } from 'node:timers/promises';
export function observeProcessGroup(pid) {
  if (process.platform === 'win32') return 'not-observed-on-platform';
  // Never admit special kill targets 0/-1 or values outside signed pid_t range.
  if (!Number.isSafeInteger(pid) || pid <= 1 || pid > 2147483647) return 'unavailable';
  try { process.kill(-pid, 0); return 'present-or-reused'; }
  catch (error) { return error?.code === 'ESRCH' ? 'absent-at-probe' : 'unavailable'; }
}
// Used only for the fixed silent-descendant fixture's own bounded self-exit.
// No signal other than 0, arbitrary executable, factory or caller timeout.
export async function settleFixedFixtureGroup(pid) {
  const end = performance.now() + 2000;
  let status = observeProcessGroup(pid);
  while (status === 'present-or-reused' && performance.now() < end) {
    await delay(10); status = observeProcessGroup(pid);
  }
  return status === 'absent-at-probe';
}
