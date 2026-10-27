import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runFixedReadiness } from '../proofs/readiness-driver.mjs';
import { runFixedInspection } from '../proofs/inspection-driver.mjs';
import { observeProcessGroup } from '../proofs/process-group-observation.mjs';
const posix = process.platform !== 'win32';
const PROBE = fileURLToPath(new URL('../proofs/reliability-probe.mjs', import.meta.url));
for (const mode of ['readiness-late', 'readiness-serialize', 'inspection-serialize']) {
  test('no post-deadline outbound request: ' + mode, { skip: !posix }, () => {
    const child = spawnSync(process.execPath, [PROBE, mode], { env: {}, encoding: 'utf8', timeout: 12000 });
    assert.equal(child.status, 0, child.stderr); const r = JSON.parse(child.stdout);
    assert.equal(r.outcome, 'review-required'); assert.equal(r.processReaped, true);
    assert.equal(r.sentRequests, 1, 'only initialize may have been attempted before deadline');
    assert.equal(r.nativeProcessStarted, false); assert.equal(r.liveAdmission, false);
  });
}
for (const [name, run] of [['readiness', runFixedReadiness], ['inspection', runFixedInspection]]) {
  test('direct-child close does not establish group absence: ' + name, { skip: !posix }, async t => {
    const r = await run('silent-descendant');
    // Fixed categories/counters only; failure must retain enough evidence to
    // distinguish an unavailable probe from deadline expiry without a PID/log.
    const diagnostic = JSON.stringify({processReaped:r.processReaped, processGroupStatus:r.processGroupStatus,
      fixtureGroupSettlement:r.fixtureGroupSettlement ?? null});
    t.diagnostic(diagnostic);
    // Fixture self-exit has been observed before this test asserts/returns. No
    // retained PID, stale-group signal or arbitrary process adoption is used.
    assert.equal(r.fixtureGroupGoneObserved, true, diagnostic);
    assert.equal(r.processReaped, true); assert.equal(r.processGroupStatus, 'present-or-reused');
    assert.equal(r.allDescendantsVerified, false); assert.equal(r.nativeProcessStarted, false);
    assert.equal(r.outcome, 'review-required');
    assert.equal(r.reason, 'descendants-unresolved');
  });
}
test('group observation refuses unsafe identities and never claims all descendants', () => {
  for (const pid of [-1, 0, 1, 1.5, 2147483648, NaN, Infinity, {}, '1']) assert.equal(observeProcessGroup(pid), posix ? 'unavailable' : 'not-observed-on-platform');
});
