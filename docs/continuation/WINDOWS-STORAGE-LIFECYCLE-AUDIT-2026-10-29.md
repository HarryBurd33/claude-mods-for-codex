# Windows storage failure lifecycle — source audit and review handoff

The next unblocked stage-D audit found a lifecycle evidence gap in the production
Windows storage transport. This is a source-level diagnosis with simulated process
events, not an observed native Windows process leak. No production code, native
policy, installed plugin or v4 trial artifact was changed.

## Frozen source and observations

`src/windows-storage.mjs` SHA256:
`86cce08d7ef440295e023b11ca9db384f7bff36eb00ede45946174d8666d3e84`.

The transport's `finish` rejects with the same generic unavailable error and clears
its timers. The taskkill close/error callbacks can invoke it before the owned helper
emits close. The500ms cleanup callback requests termination and immediately invokes
it too. A termination request, taskkill outcome, helper close and descendant closure
are separate observations. The generic rejection contains no distinction between
closed and unresolved owned processes.

The [diagnostic reproducer](../../proofs/windows-storage-lifecycle-audit.mjs) loads
the production module body unchanged into a Node VM. Only its dependencies are
synthetic: process/platform/environment, spawned EventEmitters and manually fired
timers. Its dependency linker permits only the module's three fixed imports. It
starts no real helper, system utility, Windows I/O or native client.

| Simulated ordering | Actual source result |
| --- | --- |
| taskkill close0 before helper close | Request rejected; helper close unobserved; no lifecycle receipt |
| taskkill error before helper close | Helper kill requested; request rejected before helper close; no lifecycle receipt |
|500ms cleanup callback before helper close | Kill requests issued; request rejected before helper close; no lifecycle receipt |
| Valid response and helper close0 | Request accepted after helper close |

The probe completed with three reproduced failure traces and one normal control.
Run it explicitly with `node --experimental-vm-modules proofs/windows-storage-lifecycle-audit.mjs`.
VM modules are an experimental diagnostic dependency, not a new production requirement.
The probe deliberately recognizes the current gap; it is not a future repaired-contract
test. A changed source must receive new expected outcomes rather than treating a
failed reproduction as a regression in the fix.

The mock traces do not establish which callback order a particular Windows installation
will produce or whether any OS process actually survived. No writes after rejection,
data corruption, arbitrary-process termination or native containment failure was observed.
Current failures remain refusals; the successful control does not weaken that behavior.

## Why the prior passing milestone does not close this

The [A/C/B milestone](SOL-ABC-IMPLEMENTATION-2026-10-27.md) explicitly left the shared
production transport unchanged. Its test-only lifecycle scope tracks helpers until
actual close, and a portable test recognizes a transport returning before close.
Those controls protect that proof scope; they do not give production callers a
process-lifecycle receipt. Public storage tests also include recursive fixture
cleanup. Any proposed repair must reconcile those cleanup assumptions separately
from returned request failure and existing actual Windows absence observations.

## Next bounded package: Astra Extra High review

Review the production failure contract and choose the smallest justified correction
before implementation. Preserve the exact source pin, current public error-message
compatibility, operation/path/data/output limits, restricted environment, no-shell
fixed executables, native ACL/link/ancestor policy and all closed Git/routing gates.
No deadline extension, automatic retry, PID discovery, foreign process cleanup,
native trial or policy weakening is authorized by this handoff.

The review must decide:

1. What callers may infer from rejection, and whether a closed/never-started/unresolved
   lifecycle status is required in a sanitized typed error or separate internal result.
   Unresolved termination must never be reported as observed closure.
2. How helper and taskkill close are tracked independently while retaining finite
   failure cleanup bounds. No indefinitely pending promise or unbounded wait; preserve
   uncertain state when close cannot be established. Late close cannot turn an
   already failed operation into success.
3. How callers and test fixtures avoid retry or recursive cleanup while owned work is
   unresolved. Reuse the existing lifecycle concepts without shipping its test-only
   builtin-spawn interception or adding arbitrary dependency injection to public APIs.
4. Whether the evidence warrants a production change now or only a narrower contract
   and test correction. Do not infer a real OS leak from these simulated traces.

Permitted initial review files are the production transport and its direct callers,
`test/windows-storage.test.mjs`, the existing test-only owned lifecycle helper/tests,
this reproducer and the A/C/B review/result. Return a finite implementation file list
and acceptance plan; do not implement an unreviewed new containment/admission design.

Acceptance before claiming a repair: preserve the three original traces, demonstrate
the selected corrected outcomes plus normal success, pre-abort, helper close/error,
output overflow, late/duplicate signals and unresolved-close cases. Relevant actual
Windows Node22/24 storage/process CI must pass on the corrected source before OS
acceptance; simulated VM results or macOS skips cannot substitute. Separate direct
helper close, taskkill close and unverified descendant/backend outcomes in all claims.

## Preserved holds and model boundary

The exact v4 native packet still awaits explicit human approval of its new0.165.0
host and inherited startup exposure. No hook registration, batch clock, trial,
collector restart, install/trust change or release is implied by this audit. The
collector remains disabled. All93 ledger dispositions remain unchanged.

The current Sol High audit is complete. Astra Extra High is recommended for the
consequential serial failure/cleanup contract review; no model switch or automatic
continuation has been performed. Continue from the verified checkpoint with:

> Review the Windows storage lifecycle audit and exact reproducer on Astra Extra High.
> Decide a finite failure/close contract and implementation acceptance plan. Preserve
> native permissions, disabled collector, v4 approval hold and existing ownership;
> do not launch a native client or trial, change admission gates, or repeat completed checks.

This milestone adds a diagnostic and documentation only. It claims no new production
fix, new hosted CI pass or current-package/native-platform acceptance. Prior failures,
passing CI and archived source retain their exact historical scope.
