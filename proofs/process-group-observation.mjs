// A scoped existence observation, never a kill/adoption capability. A PGID can be
// reused after leader close: presence is deliberately labelled ambiguous.
import { performance } from 'node:perf_hooks';
import { setTimeout as delay } from 'node:timers/promises';
export function observeProcessGroupDetail(pid) {
  if (process.platform === 'win32') return {status:'not-observed-on-platform', error:'platform'};
  // Never admit special kill targets 0/-1 or values outside signed pid_t range.
  if (!Number.isSafeInteger(pid) || pid <= 1 || pid > 2147483647) return {status:'unavailable', error:'invalid-identity'};
  try { process.kill(-pid, 0); return {status:'present-or-reused', error:'none'}; }
  catch (error) {
    const code = error?.code;
    return {status:code === 'ESRCH' ? 'absent-at-probe' : 'unavailable',
      error:code === 'ESRCH' || code === 'EPERM' || code === 'EINVAL' ? code : 'other'};
  }
}
export function observeProcessGroup(pid) {
  return observeProcessGroupDetail(pid).status;
}
// Used only for the fixed silent-descendant fixture's own bounded self-exit.
// No signal other than 0, arbitrary executable, factory or caller timeout.
export async function settleFixedFixtureGroup(pid) {
  return (await settleFixedFixtureGroupDetail(pid)).goneObserved;
}
export async function settleFixedFixtureGroupDetail(pid) {
  const start = performance.now(), end = start + 2000;
  let probe = observeProcessGroupDetail(pid), probeCount = 1;
  let epermProbeCount = probe.error === 'EPERM' ? 1 : 0;
  const initial = probe;
  while ((probe.status === 'present-or-reused' || probe.status === 'unavailable' && probe.error === 'EPERM')
    && performance.now() < end) {
    await delay(10);
    // A delayed timer must not authorize one last probe beyond the same budget.
    if (performance.now() >= end) break;
    probe = observeProcessGroupDetail(pid); probeCount++;
    if (probe.error === 'EPERM') epermProbeCount++;
  }
  const finished = performance.now();
  // Diagnostic values only: no PID, exception text, new signal or authority.
  // EPERM remains unavailable, including while we spend the remaining fixed
  // observation budget. Only a later actual ESRCH can establish this sample.
  return {initialStatus:initial.status, initialError:initial.error,
    finalStatus:probe.status, finalError:probe.error, probeCount, epermProbeCount,
    elapsedMs:Math.max(0, Math.trunc(finished - start)), deadlineReached:finished >= end,
    goneObserved:probe.status === 'absent-at-probe'};
}
