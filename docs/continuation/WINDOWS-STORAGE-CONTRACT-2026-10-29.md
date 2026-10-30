# Windows storage failure and cleanup contract

Contract **WS-L1**, October 29, 2026. Serial review on the human-confirmed
GPT-6 Astra / Extra High selection; automated model/backend readback was unavailable.
Review baseline: `8e45b78d3ce4f7d72302b038bba8938d2d032aa0`.

**Decision: make a bounded production correction, followed by new regressions and
actual Windows CI.** Rejection must retain direct-process uncertainty, and a failed
journal request must not start the next optional telemetry operation. This review
does not implement that correction or establish a native Windows leak. It changes
documentation only. The native v4 trial remains unapproved and the collector disabled.

## Evidence and findings

The [audit](WINDOWS-STORAGE-LIFECYCLE-AUDIT-2026-10-29.md) and its three simulated
failure traces are retained, not rerun. The reviewed
[transport](../../src/windows-storage.mjs) SHA256 is
`86cce08d7ef440295e023b11ca9db384f7bff36eb00ede45946174d8666d3e84`.
The [review manifest](WINDOWS-STORAGE-CONTRACT-2026-10-29.json) binds the inspected
source, callers, tests and previous acceptance records.

| Finding | Source consequence | Required correction |
| --- | --- | --- |
| Taskkill close/error and the cleanup callback can settle rejection before helper close | A bare error cannot establish that owned work has ended | Track helper and terminator close separately; expose a fixed lifecycle snapshot on request errors |
| `writeWindowsHookMetadata` catches journal failure and proceeds to state recording if budget remains | An early failure can launch another write while the first request's helper remains unresolved; this is a source inference, not a newly observed Windows execution | End this invocation's optional telemetry sequence on any journal failure |
| Storage tests register unconditional recursive root removal and some stop callbacks reject before close | A failed test can reach teardown without reconciling its helpers, fixture writes or deliberately created child | Guard affected fixture cleanup independently of request settlement; retain unresolved roots and fail |
| Storage documentation says cancelled reads stop the helper tree | The statement exceeds the transport result and the narrow synthetic absence checks | Describe termination requests, observed direct close and remaining uncertainty separately |

The documented Node contracts distinguish `close` from `exit` and `error`; a kill
request or the `killed` flag is not close evidence. An error can also represent a
failed kill, not just a failed spawn. These semantics support the separation used
here. See the versioned primary
[Node 22 documentation](https://nodejs.org/download/release/v22.21.0/docs/api/child_process.html#event-close)
and [Node 24 documentation](https://nodejs.org/download/release/v24.11.0/docs/api/child_process.html#event-error).
They are API references, not attestations of the later CI runtime patch versions.

No actual helper survival, post-rejection write, corruption or foreign-process
termination was observed. Existing failures still refuse the operation. The
[A/C/B result](SOL-ABC-IMPLEMENTATION-2026-10-27.md) deliberately protected its
test scope while leaving this production transport unchanged; its prior pass is
neither invalidated nor promoted into acceptance of the proposed repair.

## Selected public and internal contract

Successful requests retain the existing array-of-Buffers API and exact response
validation. Success requires helper `close` with code zero, a valid bounded response,
no latched failure and an unexpired operation deadline. Receiving output alone,
an `exit` event or a late zero exit cannot satisfy success.

Keep the exact existing error message and ordinary `Error` name:

```text
Private Windows storage unavailable; review local NTFS ownership, protected ACLs, path, helper policy and bounds
```

For failures produced by `windowsStorageRequest`, add a read-only, non-enumerable
`code: 'ERR_WINDOWS_STORAGE_UNAVAILABLE'` and `storageLifecycle` property. The latter
is a frozen snapshot with exactly these fields:

```js
{ version: 1, helper: 'unresolved', terminator: 'closed', descendants: 'unverified' }
```

Each direct-process field uses only these values:

| Value | Evidence required |
| --- | --- |
| `never-started` | This invocation never called spawn for that role. Preflight/pre-abort refusal qualifies. |
| `closed` | That returned ChildProcess emitted `close`. A failed spawn may also emit close; this does not assert a process ran successfully. |
| `unresolved` | Spawn was attempted and close has not been observed. Includes a synchronous spawn throw without a returned handle, conservatively. |

Use `descendants: 'unverified'` consistently; there is no all-tree receipt in this
transport. Do not expose PIDs, paths, arguments, environment, raw errors, stacks from
child errors, request contents or output through these properties. Do not attach a
raw `cause`. Existing validator/parser exports keep their standalone behavior; their
errors are not process receipts. Wrap their failures inside a request with the
request's actual snapshot. Invalid JavaScript call shapes outside the supported API
may still produce ordinary errors; a missing or malformed receipt is unknown, never
proof of closure. No new injectable spawn API, public callback or test interception
is permitted in production.

The snapshot is immutable at settlement. Later events cannot revise it, resolve the
request again, restart cleanup or initiate another operation. Even `closed` says
nothing about rollback: a failed mutating request may already have changed data.
It is not retry, deletion, installation or trust authority. No `safeToDelete` or
all-descendants-closed boolean is introduced.

## Finite transport state machine

Maintain independent attempted/close state for the helper and the one optional
taskkill process, plus a sticky request-failed flag and one settlement flag.

1. Keep all existing platform, operation, path, signal, data, frame and environment
   checks before spawn. Record a monotonic start immediately before attempting the
   helper spawn. Attach the child/stream listeners before writing stdin or processing
   a raced abort. Recheck abort before sending input. A pre-abort spawns nothing.
2. Timeout, abort, helper error, stdin/stdout error or synchronous input-write failure,
   and output overflow latch failure and drop buffered output. The first failure
   starts one reconciliation period. Repeated failures cannot reset its deadline,
   accumulate output, spawn another terminator or trigger recursive cleanup.
3. Preserve the fixed taskkill path and exact owned-helper PID selector, no shell or
   elevated mode. Attempt it at most once, only for the returned helper with a valid
   PID and no observed exit/close. Observe exit/signal state to avoid requesting
   termination after known exit, but do not treat exit as close. There is no PID
   rediscovery, adoption or new process-tree containment guarantee.
4. A terminator error/nonzero close, or failure to create it, permits the existing
   direct-helper fallback. Request direct termination at most once per returned
   ChildProcess, only while not known exited/closed. At the cleanup deadline request
   termination of any still-open owned direct process not already requested. A
   successful kill call is not evidence that close happened.
5. On failure, settle early only when every attempted direct role has observed close.
   A never-attempted role needs no wait. Taskkill zero close alone is insufficient;
   helper close alone is insufficient if taskkill was attempted but remains open.
   Synchronous spawn throws without a handle remain unresolved; do not invent a
   close event to satisfy this condition.
6. At the reconciliation deadline, reject once with the actual snapshot, including
   unresolved roles. Never wait indefinitely for close. Clear timers and the abort
   listener; discard late data. Keep minimal inert error handling on unresolved
   emitters so late errors cannot crash the caller or relaunch work. Retain no raw
   request/output buffers or live result mutation.
7. A nonzero helper close or invalid response after close rejects with helper closed.
   A valid response must still pass the sticky-failure and deadline checks, including
   after parsing. No failure is turned into success by a later close or valid frame.

The operation allowance remains **100–15000 ms**, default **15000 ms**. Reconciliation
ends no later than the first failure plus **500 ms**, capped at the original operation
deadline plus **500 ms**. Use monotonic absolute deadlines; delayed callbacks must
not earn another full cleanup period or allow late success. This adds no longer
deadline. These are scheduling budgets, not a hard wall-clock or process-lifetime
guarantee under a stalled event loop, blocked spawn or missing OS event. Promise
settlement does not ensure the enclosing Node process exits: an unresolved child or
pipe can keep it alive. Do not add unref/detach, an OS service or hidden background
cleanup to disguise that uncertainty.

## Callers and fixture policy

The smallest caller correction is in [windows-hook.mjs](../../src/windows-hook.mjs):
return the existing fixed result object immediately on **any** journal failure.
This deliberately drops state telemetry for that invocation even after an observed
closed policy refusal. It avoids using an incomplete process receipt as permission
to continue and handles failures before a receipt exists. Journal-off/state-only and
successful-journal/state paths retain their behavior. Preserve the shared **1500 ms**
operation budget and **500 ms** cleanup allowance, exact project matching, dispatcher
deny decision and fixed unavailable diagnostics. Optional telemetry must never become
a new authorization decision.

The other inspected production paths need no behavior expansion:

- `windows-state.mjs` and Windows branches in `journal.mjs` already await and propagate
  request failures. Prune stops at a failed list/read/prune instead of continuing its
  loop. Preserve this and do not add retry or rollback.
- `state.mjs` stops its observer on failure; cancellation may end the iterator without
  forwarding an error. Iterator completion is not a storage-close receipt.
- `usage.mjs` intentionally converts errors into its fixed unavailable result. Keep
  that privacy boundary and schema; it performs no automatic retry or cleanup.
- `io.mjs` has no Windows transport call. Windows retention is refused before IO.
  Keep these boundaries unchanged.

This correction controls one request and its current caller sequence. It does not
serialize independent requests, coordinate separate Node processes, quarantine paths
globally or reconcile work after caller death. Concurrent successful writes remain
supported. A future cross-request containment or recovery design requires separate
review; it is not silently added to WS-L1.

In `test/windows-storage.test.mjs`, register each owned helper/terminator and pending
fixture write until actual completion. Reuse the existing test-only lifecycle scope
where suitable; keep any builtin-spawn interception confined to the isolated test
process and restore it. Apply the guard to every affected root, including ACL setup,
timeout, cancellation and synthetic hook-subprocess fixtures. All started concurrent
operations must settle before assertions/cleanup; `Promise.all` rejection alone is
insufficient. Bind cancellation to `t.signal` and keep original fixture/test bounds.

Root deletion requires no unresolved direct child, request or fixture IO. Deliberate
synthetic descendants require their existing separate absence observation as well;
direct helper close is not a substitute. If a test aborts before that evidence can be
obtained, fail and retain its root. Preserve the primary failure and report cleanup
refusal separately. Do not poll indefinitely, adopt a PID, kill a foreign process or
delete an unknown file to manufacture cleanup success. Retained fixtures are not
reused by a retry.

The separate observer and lock-proof wrappers also contain broader lifecycle
assumptions; they are outside this direct-transport repair. Their old passes remain
narrow evidence. Do not claim WS-L1 fixes every test harness or permits arbitrary
recursive cleanup. A new failure there must be retained and reviewed, not patched
by expanding this contract during a CI run.

## Bounded implementation package

Use **GPT-6.1 Sol / High** for the race-sensitive implementation within this reviewed
scope. Use **GPT-6 Astra / Extra High** for the resulting diff and claim review before
calling the repair accepted. The current review is serial, not a separate independent
implementation review. No new model session, selection or inference was launched.

| Permitted file | Purpose |
| --- | --- |
| `src/windows-storage.mjs` | Finite lifecycle state, sanitized request-error snapshots and monotonic deadline checks; optional fixed `node:perf_hooks` import only |
| `src/windows-hook.mjs` | End optional telemetry sequence on journal failure |
| `proofs/windows-storage-lifecycle-contract.mjs` (new) | Explicit VM-based regressions loading real module bodies with a closed synthetic dependency map; no real helper or Windows IO |
| `test/windows-storage.test.mjs` | Actual Windows receipt/sequence assertions and bounded owned-fixture cleanup guards |
| `test/owned-fixture-lifecycle.test.mjs` | Only additional regressions needed for reuse; existing helper implementation stays unchanged unless re-reviewed |
| `.github/workflows/ci.yml` | Add the explicit VM regression command to existing POSIX and Windows NTFS Node 22/24 jobs; keep their real tests and limits |
| `docs/windows-storage.md`, `PUBLIC_STATUS.md`, this campaign's status/result documents | Describe implemented results and exact remaining limits after evidence exists |

Keep the original diagnostic and audit bytes intact. The diagnostic is pinned
historical evidence and is not a required green check against repaired source; its
old “gap reproduced” assertions should cease to describe the fix. Add the new
regressions rather than weakening those assertions. The new explicit command is
`node --experimental-vm-modules proofs/windows-storage-lifecycle-contract.mjs`;
the experimental dependency stays test-only, not a production launch flag.

Do not change native PowerShell/C# storage logic, ACL/owner/link/ancestor policies,
executable/private-data/Git admission, routing gates, public output schemas, package
version or installed cache. No dependency installation is needed. Stop and re-review
if a required correction exceeds these files or needs a new containment architecture.
Do not rerun an unchanged failing CI job seeking a pass.

## Frozen acceptance before repair claims

These checks are **required, not yet run**. New tests must inspect outcomes, event
ordering, actual spawn counts and cleanup refusal, not merely mirror the implementation.

| ID | Required outcome |
| --- | --- |
| WS-01 | Preserve all three original trace identities. For terminator-close-first and terminator-error-first, remain pending until both relevant closes or the unchanged deadline; at expiry reject with the exact unresolved/closed snapshot. |
| WS-02 | Reverse close order; helper closed/terminator unresolved must remain pending until terminator close or expiry. Closed roles are never killed again. |
| WS-03 | Normal valid response succeeds only after helper close within deadline. Nonzero close, malformed/oversized response, valid late output and response after a latched failure never succeed. |
| WS-04 | Invalid operation/path/options within the supported API and pre-abort spawn nothing, with never-started roles. An abort racing listener setup sends no further stdin and starts at most one cleanup sequence. |
| WS-05 | Helper spawn throw, asynchronous error then close, and error without close: distinguish attempted/unresolved from observed close. Cover missing PID without inventing never-started evidence. |
| WS-06 | Terminator spawn throw, error without close, nonzero/zero close and missing close; helper kill returns false or throws. No error is promoted to closure; no raw diagnostics escape. |
| WS-07 | Timeout, stdin write/error, stdout error and output overflow latch failure once. Repeated/late abort, error, data, exit and close events cannot reset budgets, buffer output, spawn more processes, mutate a receipt or settle twice. |
| WS-08 | Delayed timer delivery and success at/after deadline use the original monotonic deadline. Failure expiry rejects without waiting for nonexistent close; timer/listener disposal and sanitized immutable receipt are checked. No deadline extension. |
| WS-09 | Hook journal failure of every receipt type, plus a plain error, starts no state call and preserves fixed result/guard behavior. State-only and successful two-lane positives remain mandatory, with the original shared budget. |
| WS-10 | Direct state/journal errors propagate; prune stops at first failed stage; observer failure performs no next read; selected usage stays unavailable without content or retry. No blanket schema changes. |
| WS-11 | Fixture failure/cancellation while child or IO remains unresolved refuses deletion and retains the root. Observed direct close plus completed IO permits only owned cleanup; synthetic descendant checks remain separate. Concurrent sibling requests are all reconciled. |
| WS-12 | Exact corrected-source Windows Node 22/24 NTFS storage and owned-process jobs pass with existing ACL/link/admission negatives, normal state/concurrency positives, timeout/abort and hook deny timing assertions retained. Record actual runtime versions and separate direct close from synthetic descendant absence. |

Run new VM checks first on available Node 22/24 or report the missing local version;
then relevant focused tests. The hosted matrix must exercise both versions and the
unchanged real storage/process checks on the corrected commit. The existing full
workflow is applicable because runtime code changes. Mac/Linux skips, mock traces or
the historical seven-job pass cannot satisfy WS-12. A Windows regression stops
acceptance; no wider cleanup, automatic retry or relaxed positive assertion is allowed.

## Review completion and unchanged authority

The source/caller review and finite implementation contract are complete. Verification
for this documentation milestone checks source pins, local links, scope and private
data exclusion. No old tests, native UI checks, archive extraction or trials were
repeated. No new runtime test or CI pass is claimed; all 93 ledger dispositions remain
unchanged. The repair remains unimplemented and its diff/security review outstanding.

The [v4 packet](NATIVE-APPROVAL-V4-2026-10-29.md) still requires exact informed approval
of the new host and inherited MCP startup exposure, followed by its human gates.
This storage contract grants no native startup, hook registration, trust/config write,
collector restart, installation, release or new data access. Permissions stay unchanged.
