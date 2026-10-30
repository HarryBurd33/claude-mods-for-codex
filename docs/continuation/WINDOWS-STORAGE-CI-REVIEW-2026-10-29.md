# WS-L1 CI review and WS-L2 correction contract

October 29, 2026. Serial diff and failure review on the human-confirmed GPT-6 Astra /
Extra High selection. Automated model/effort readback is unavailable. **WS-L1 is not
accepted.** The next bounded package is **WS-L2**, a test-ownership and diagnostic
correction plus missing regression coverage; its production transport stays pinned.

The reviewed runtime candidate is `60c44f944abfac41d874ad4cfa9851c124024a2c`, tree
`a52169c4dd6279b1a24cec0de72e229b6ddd2fc4`. Review baseline is the published failure
record `2c6c56a8483f66cadf37296f48ea269b8a96ae23`. The
[manifest](WINDOWS-STORAGE-CI-REVIEW-2026-10-29.json) pins inspected sources and the
additive acceptance groups below. The original [WS-L1 contract](WINDOWS-STORAGE-CONTRACT-2026-10-29.md),
its twelve groups, audit and failure record remain evidence, not rewritten history.

## What failed and what was verified

[Run 40986490389](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40986490389)
is terminal: five jobs passed and both Windows NTFS Node 22/24 jobs failed. Each
storage invocation reported 13 passes / 12 failures. Their lifecycle simulation,
startup, compilation and IPC steps passed; storage and copied-state diagnostic steps
failed; owned-process steps were skipped. No unchanged run was retried. The earlier
local and hosted passes remain narrow evidence, not WS-12 acceptance.

| Finding | Evidence and effect | Required correction |
| --- | --- | --- |
| F1: simultaneous observers borrow sibling children | `OwnedFixtureScope.spawn` adds each child to every active `externalIO` observer. The first completed concurrent append can see a sibling still open, latch global unresolved state and poison subsequent cases. The Node 24 stack names this check; Node 22 starts failing at the same concurrent case. | Attribute a child to its own async operation and enclosing operations, never unrelated siblings. Preserve concurrency and the global cleanup guard. |
| F2: a thrown spawn loses uncertainty in the fixture | `nativeSpawn` throws before adding a returned child; the current scope can report cleanup safe afterward, despite an attempted spawn with no close evidence. This is a new simulated finding, not an observed Windows survivor. | Latch fixture uncertainty on a thrown spawn attempt. Never synthesize a child/PID or infer close from the throw. |
| F3: copied diagnostic assumes an obsolete finish line | Its required `chunks = []; if (error) reject(unavailable()); else resolve(value);` string has zero matches in the candidate. Both CI diagnostic steps fail `Bridge diagnostic shape`. Merely changing that needle would leave the stderr listener inserted before `child` initialization. | Migrate exact, fail-closed instrumentation to the candidate's initialization, returned-child and finish sites; execute the generated module under synthetic dependencies in a regression. |
| F4: copied diagnostic deletes its root unconditionally | Its `finally` recursively removes the owned root even if a request rejects before child close. Current CI stops before any copied bridge request, so this is a source finding, not an observed deletion race. | Track copied requests, direct children and fixture IO; stop later rounds on uncertainty and retain unresolved roots. Preserve primary and cleanup failures. |

The new [pinned audit](../../proofs/windows-fixture-lifecycle-audit.mjs) loads the real
fixture module in a VM with synthetic child events and a closed dependency map.
On local Node 24.22.0 it reproduced F1 and F2: the first request falsely rejected
after its own child closed, and a separate thrown-spawn attempt incorrectly passed
the cleanup guard. It launched zero real child processes and performed zero fixture
writes. This proves those source behaviors, not their exclusivity as CI causes or any
OS leak. Its source pin deliberately prevents treating it as a green repaired-source
regression; preserve its bytes and add positive/negative repair tests separately.

## Production diff judgment and remaining coverage

The reviewed transport separates attempted spawn from observed close, freezes a
sanitized failure receipt, latches failure, limits terminator/direct-kill attempts,
and caps cleanup against the original monotonic deadline. Success still needs valid
bounded output and helper close before the deadline. Journal failure returns before
state telemetry. No additional production defect was established in these inspected
paths. This is a source-review conclusion, not native Windows acceptance or proof of
descendant closure, rollback or safe retry.

The existing 39-case suite does not fully demonstrate every frozen group. Add explicit
tests for listener-setup abort, terminator nonzero close, known exit without close,
duplicate failure events before settlement, timer/listener disposal, and elapsed
shared hook budget. The constant-zero hook clock only proves sequence behavior.
The nine passing local focused tests include existing fixtures and platform skips;
they did not exercise concurrent observer isolation or the thrown-spawn cleanup gap.
Do not mark WS-04/06/07/08/09/11 complete from a case count. WS-12 remains failed.

## Selected test ownership design

Use one test-only `AsyncLocalStorage` per `OwnedFixtureScope`, with `run`/`getStore`
and a per-operation frame. This API carries context through promise chains on the
supported Node lines; see the primary [Node 22](https://nodejs.org/download/release/v22.21.0/docs/api/async_context.html#asynclocalstoragerunstore-callback-args)
and [Node 24](https://nodejs.org/download/release/v24.11.0/docs/api/async_context.html#asynclocalstoragerunstore-callback-args)
references. These versioned references are not CI runtime attestations. Selection of
this design is a review decision and must be validated on actual Node 22/24.

- A frame belongs to one `externalIO` call, holds its observed children and links to
  its enclosing frame. Sibling frames are independent. A child spawned in a nested
  operation belongs to that frame and its enclosing operations, not other observers.
- Keep the global sets of all returned children and pending IO as independent root
  cleanup barriers. Outside a frame, explicit fixture spawns still join the global
  set. Do not reinterpret `kill`, `exit`, an error or promise settlement as close.
- At operation settlement, test only its attributable children for missing close;
  retain the global sticky uncertainty behavior for a real unresolved operation.
  Await all already-started siblings before assertions/teardown. No serial queue,
  global observer broadcast, promise-race shortcut or reset of the sticky flag.
- Close a frame when its operation settles. Detached callbacks retaining a closed
  frame must fail before a new spawn or fixture IO, rather than escaping ownership.
  Preserve the original error when a cleanup/ownership error also occurs. A nested
  operation still running when its enclosing operation ends cannot grant cleanup.
- Catch a throw around the actual spawn attempt, latch uncertainty and rethrow.
  Preflight refusal before a spawn attempt remains distinguishable. No real child
  is adopted or killed to reconcile this synthetic regression.
- Keep cancellation preflight, post-IO checks, existing lifetimes and scoped builtin
  interception/restoration. Bind direct request signals to the current test. Do not
  add a production injection API, ambient context, public option or dependency.

This design supports the existing test calls and copied diagnostic only. It does not
claim to control arbitrary callbacks, other processes, all Windows descendants or
the separately deferred observer/lock harnesses. A required change there stops this
package for review.

## Copied diagnostic migration

Preserve `proofs/windows-state-trace.mjs` as a three-round diagnostic, with its existing
fixed inputs, output fields and 4096-character stderr capture cap. Only copied files
may be instrumented. Production stderr remains ignored. Exact source markers must
occur once; reject missing or duplicate markers instead of using a broad replacement.
Initialize trace state before any possible finish, attach stderr after a child handle
exists, and append the fixed trace frame without replacing production settlement,
receipt creation, listener disposal or deadlines. Spawn throw and early failure must
not reference an uninitialized `child` or trace variable. Do not print raw stderr,
exceptions, paths, arguments, data, environment or arbitrary new fields.

A small pure `proofs/windows-state-trace-instrumentation.mjs` may hold the exact copied
bridge transformation for reuse by the diagnostic and its tests. It must have no IO,
spawn or import-time execution beyond definitions. Keep native C#/PowerShell copied
label transformations unchanged. `--shape-only` remains a no-Windows-execution mode;
syntax preparation alone is insufficient, so execute the transformed bridge in the
closed VM regression as well.

Use the corrected test-only scope to track copied requests and global child/IO
ownership in the isolated diagnostic process; restore interception in all paths.
`Promise.allSettled` preserves each concurrent outcome. If the scope is unresolved,
stop before another read/round and refuse root removal. Remove only this invocation's
owned root after all tracked work closes/completes; otherwise retain it and exit
nonzero with fixed sanitized failure labels. No new waits, deadline extensions,
foreign-PID cleanup, diagnostic disablement or `continue-on-error`.

## WS-L2 scope, gates and routing

Use **GPT-6.1 Sol / High** for this bounded correction, then **GPT-6 Astra / Extra High**
for diff and evidence review before acceptance. This is a serial review of Sol's
candidate, not a claim of a separate independent security-agent review. Budget: one
implementation candidate, at most two local repair/verification rounds and one new
corrected-source hosted run, within 90 minutes of active implementation. Preserve
unexpected failures and stop at an out-of-scope need, exceeded bound or hosted failure;
do not rerun unchanged CI. No paid API execution or new native client action.

| Permitted file | Exact purpose |
| --- | --- |
| `test/owned-fixture-lifecycle.mjs` | Async request attribution, closed-frame/attempt uncertainty and preserved global cleanup barriers |
| `test/owned-fixture-lifecycle.test.mjs` | New request-isolation, nesting, late-callback, spawn-throw and cleanup regressions; retain existing cases |
| `test/windows-storage.test.mjs` | Only wrapper/signal/cleanup integration needed for that scope; retain all concurrent positives, negatives and descendant checks |
| `proofs/windows-state-trace.mjs` | Exact copied instrumentation migration and bounded owned-root cleanup |
| `proofs/windows-state-trace-instrumentation.mjs` (optional new) | Pure exact transformation shared with the VM regression |
| `test/windows-state-trace.test.mjs` (new) | Generated bridge execution, marker rejection, privacy and cleanup regressions using synthetic dependencies |
| `proofs/windows-storage-lifecycle-contract.mjs` | Fill the listed missing WS-L1 coverage against unchanged production source |
| `.github/workflows/ci.yml` | Add the new portable diagnostic test and shape check to both Windows NTFS jobs; retain every existing step, condition, permission and timeout |
| `docs/windows-storage.md`, `PUBLIC_STATUS.md`, a new WS-L2 result document | Accurate result/remaining-gate reporting only |

No `src/` file, native helper, package/version/cache, original WS-L1 contract/audit,
this review/audit, ledger, routing gate, ACL/admission rule or production schema change.
The new file scope explicitly replaces WS-L1's restriction against editing the shared
fixture helper and copied-state diagnostic; all its production/authority limits remain.

| Added gate | Required evidence; WS-01–12 also remain required |
| --- | --- |
| WSL2-01 | Two overlapping successful operations spawn before either finishes; closing one does not borrow its sibling or latch uncertainty. Both finish, global cleanup waits for both, and the four-append/three-state Windows positives remain concurrent. |
| WSL2-02 | Genuine own-child uncertainty still latches and retains the root. Nested operations attribute to ancestors, unrelated siblings remain separate, and a callback from a closed frame performs no new spawn/IO. Reconcile all started synthetic work. |
| WSL2-03 | Thrown spawn, async error without close, close after rejection and outstanding fixture IO retain uncertainty correctly. Pre-abort has no spawn/write; fully observed close plus completed IO permits owned cleanup. Separate deliberate-descendant absence stays required. |
| WSL2-04 | Transformed LF and CRLF bridge executes in a VM: normal success, spawn throw, nonzero close and unresolved expiry retain original settlement/receipts. Missing/duplicate markers refuse; stderr is bounded and output contains only existing fixed diagnostic fields/labels. |
| WSL2-05 | Diagnostic cleanup integration retains its root and stops later rounds on unresolved child/request/IO; settled concurrent siblings and safe success permit only owned deletion. Preserve primary failure and restore interception. No Windows process is needed for these regressions. |
| WSL2-06 | Fill explicit raced-abort, nonzero terminator, known-exit/no-close, duplicate pre-settlement failures, disposal and elapsed hook-budget checks. Assert spawn/kill/write counts, original deadlines and no second telemetry call when budget is gone. |
| WSL2-07 | New focused tests/VM checks pass locally; report unavailable local versions. Full suite, validate and replay pass for the changed shared fixture. Record exact source/runtime and skips; do not rerun unrelated UI/archive/native checks. |
| WSL2-08 | One corrected-source hosted matrix passes, including Windows NTFS Node 22/24 real storage, copied diagnostic and previously skipped owned-process steps. Record actual runtime versions, not just matrix labels. Astra reviews the final diff, failures and claims before WS-L1/WS-L2 acceptance. |

There is no new native approval request for this source/test package. Native v4 trial
approval remains separate and pending. Collector remains disabled/unloaded, native
configuration and permission limits unchanged, and all 93 requirement dispositions
unchanged. This review ran no native trial, helper, hook registration, install/trust
change, old UI/archive check or full-suite/CI retry. Review publication is authorized
development progress, not a release or repair acceptance.
