# WS-L2 final review: one execution-boundary correction remains

October 29, 2026. Serial review on human-selected GPT-6 Astra / Extra High.
Reviewed candidate `50af5709395ce5496e3fb8b3829634cd15e83c74`, tree
`1b4fa5171c2679587ee086860ea6411ec36ede55`, and result commit
`599cbc06f4adaf7a39690e0dd7a5c080632a933f`. **Review complete; full WS-L1/WS-L2
acceptance is withheld for one test-fixture race.** No production transport defect
was established in this review. The [manifest](WINDOWS-STORAGE-L2-REVIEW-2026-10-29.json)
pins the reviewed sources and records the bounded follow-up, **WS-L2-R1**.

## Verified progress

The nine-file implementation diff stays within the frozen WS-L2 scope. Production
`src/`, native C#/PowerShell helpers, original contracts/audits and the 93-item
requirements ledger are unchanged. Async frames remove sibling-child broadcasting;
nested frames retain ancestor ownership; thrown spawn attempts latch uncertainty.
The global child/IO cleanup barriers remain. The copied diagnostic uses exact
markers, attaches stderr after child initialization, preserves request settlement,
bounds captured text, restores interception and refuses unresolved root deletion.
Its primary/cleanup errors are combined internally and its terminal output is fixed.

[CI 40999690611](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40999690611)
is verified terminal success for the exact candidate: all seven jobs passed. Windows
Node 22.23.4 and 24.22.1 each passed 12 copied-bridge regressions, 25 storage tests and
97 owned-process tests, with zero skips. The actual copied diagnostic and 43-case
simulation also passed. Four POSIX full-suite jobs and Windows portable contracts
passed. The original failed run remains historical evidence. This review did not
rerun CI, full suites, native helpers, UI checks or the offline archive.

The local 408-pass/123-skip result and final 22 focused/43 simulated checks are retained
with their previously disclosed timing. Hosted execution used the final candidate.
These results remain valid even though the new review probe exposes an uncovered race.

## R1 — P2: check ownership again when queued IO actually starts

In [OwnedFixtureScope.io](../../test/owned-fixture-lifecycle.mjs), lines 46–52,
`check(signal)` runs before `Promise.resolve().then(operation)` queues the callback.
The next check runs only after that callback completes. During the intervening
microtasks, the enclosing frame can close and latch uncertainty, or the signal can
abort. The callback still executes and can perform fixture IO before its promise
rejects. The already-tracked pending operation keeps root cleanup blocked; this
finding does **not** establish unsafe deletion or a production helper leak.

A new deterministic probe loaded the published scope and scheduled an IO call through
two microtasks inside an enclosing `externalIO`. Its callback ran once with its parent
already closed and uncertainty latched. Both promises rejected, and cleanup stayed
refused. A second probe called `io`, immediately aborted its signal, then observed
one callback invocation before rejection. These used counters only: zero filesystem
fixture writes and zero real child processes.

Minimal historical reproduction, run from the repository with Node ESM:

```js
import assert from 'node:assert/strict';
import { OwnedFixtureScope } from './test/owned-fixture-lifecycle.mjs';
const scope = new OwnedFixtureScope();
let late, writes = 0, closedAtWrite;
const parent = scope.externalIO(undefined, () => {
  queueMicrotask(() => queueMicrotask(() => {
    late = scope.io(undefined, () => {
      writes++;
      closedAtWrite = scope.context.getStore().closed;
    });
    late.catch(() => {});
  }));
});
await assert.rejects(parent);
await assert.rejects(late);
assert.equal(writes, 1);           // Published candidate: unwanted invocation.
assert.equal(closedAtWrite, true);
assert.throws(() => scope.assertCleanupSafe(), /unresolved/);
```

The current late-callback regression begins `io` after closure, so its initial check
catches that case. It misses an operation admitted before closure but executed after
closure. The pre-abort and post-IO abort cases likewise miss a signal changing between
queueing and execution. This is one boundary defect with two reproducible triggers.

## Acceptance assessment

| Requirement | Review outcome |
| --- | --- |
| WS-01–10 | Transport/caller source review, retained simulations and corrected-source CI support the bounded lifecycle, deadline, receipt and telemetry-sequence behavior. No new production finding. |
| WS-11 | Child/IO cleanup refusal, concurrency reconciliation and separate synthetic-descendant checks remain supported. Root protection survived the new probe. Queued callback prevention is incomplete as detailed by WS-L2 below. |
| WS-12 | Exact-source hosted Windows execution gate met, including the previously skipped owned-process steps. |
| WSL2-01 | Sibling isolation and concurrent positives supported by focused tests, source and Windows CI. |
| WSL2-02/03 | **Incomplete:** a queued IO callback can execute after enclosing closure/uncertainty or cancellation. The global cleanup barrier still refuses deletion. |
| WSL2-04/05 | Exact copied instrumentation, generated-module execution and bounded diagnostic cleanup supported within the selected fixtures; no broader OS containment claim. |
| WSL2-06/07 | Added event-order/budget coverage and local/hosted checks supported; local version/platform limitations remain disclosed. |
| WSL2-08 | Hosted half passed. Final acceptance is withheld for R1; green CI does not waive it. |

## WS-L2-R1: exact correction and gates

The candidate correction is to replace only the queued callback expression with:

```js
const pending = Promise.resolve().then(() => {
  this.check(signal);
  return operation();
});
```

Keep the initial and post-IO checks, immediate pending registration, ancestor tracking,
`finally` removal, sticky uncertainty and global cleanup barriers. Do not move the
pending registration into the callback or silently discard rejection. Cancellation
before any effect need not invent an unresolved child. A scope already latched by an
unfinished enclosing operation must remain latched after its queued IO is refused.

This expression was evaluated only in an ephemeral copy of the actual scope, with a
closed synthetic dependency map. Both undesired callback counts changed from one to
zero; the nested successful IO positive still returned 42 and cleanup semantics were
preserved. No repository implementation was changed. This narrows the repair; it does
not replace repository regressions or corrected-source hosted verification.

Use **GPT-6.1 Sol / High** for WS-L2-R1 and **GPT-6 Astra / Extra High** for final diff
and evidence review. Permitted implementation files are only
`test/owned-fixture-lifecycle.mjs` and `test/owned-fixture-lifecycle.test.mjs`, plus
`PUBLIC_STATUS.md` and a new result document. Keep this review, all prior contracts,
audits/results, production source, workflow, diagnostic, package and ledger intact.

Required new regressions: (1) the two-microtask parent-close case invokes no callback,
rejects both promises, drains pending sets and retains sticky cleanup refusal;
(2) abort after queueing but before execution invokes no callback, rejects, drains IO
and permits cleanup when nothing else is unresolved; (3) nested/overlapping healthy
IO still returns its values and permits cleanup only after all work completes.
No real processes or filesystem writes are needed for these new cases.

Run focused lifecycle tests and the applicable full suite/validate/replay because the
shared fixture changed. One new corrected-source hosted matrix must retain and pass
all seven jobs, including Windows storage, diagnostic and owned-process steps on
Node 22/24. Keep the earlier green run as evidence for its own commit. Do not rerun an
unchanged workflow. Bound this follow-up to one candidate, at most two local repair
rounds and one hosted run within 45 active minutes; preserve and review any unexpected
failure or out-of-scope need. All original WS-L1/WS-L2 gates still apply.

## Authority and remaining work

Native configuration and the v4 review seal match their prior hashes; the collector
is disabled and unloaded. No trust, installation, permission, hook registration,
native trial, paid model call or model switch occurred. No new native approval is
needed for this repository-only correction. The native v4 trial remains separately
held, and all 93 requirement dispositions remain unchanged. This review is serial
cross-model review, not a new independent security-agent assessment or release.
