// Original MIT. In-memory POSIX acquisition schedule, never lock authority.
// A validated change of lock object may extend contention waiting. An unchanged
// or absent lock cannot; no new attempt starts after the absolute budget.
export function createStateLockBudget(clock = () => performance.now()) {
  let last = clock();
  if (!Number.isFinite(last)) throw new Error('state lock clock unavailable');
  const until = last + 2500;
  let idleUntil = last + 1000, previous;
  function tick() {
    const value = clock();
    if (!Number.isFinite(value) || value < last) throw new Error('state lock clock unavailable');
    last = value;
    return value;
  }
  function remaining(value) { return Math.min(until, idleUntil) - value; }
  return Object.freeze({
    canAttempt() { return remaining(tick()) > 0; },
    observe(identity) {
      if (typeof identity !== 'string' || identity.length === 0 || identity.length > 256) throw new Error('state lock identity unavailable');
      const value = tick();
      if (remaining(value) <= 0) return; // An expired budget never revives.
      if (previous !== undefined && identity !== previous) idleUntil = Math.min(value + 1000, until);
      previous = identity;
    },
    delayMs() { return Math.max(0, Math.min(10, remaining(tick()))); },
  });
}
