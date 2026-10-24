# Source23 review — observer deadline test boundary

2026-10-24. Human selected GPT-6.1 Sol High from verifiedd11a4a6. Full93-capability
product incomplete. Source23 uninstalled; human-trusted dev10/private settings/
selected-project logging/all production Windows gates unchanged.

## Preserved failure and source inspection

[e44dd93 notes CI40073187216](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40073187216),
Windows Node22 job120810857964: storage19pass/1fail/0skip20total. Actual failed log
read previously and retained. Test windows-storage.test.mjs:227 dereferenced a
missing second iterator value, TypeError reading records, total test22595.0689ms.
First observation3 passed; a write completed before the second next. Process proof
step was skipped. Six other jobs succeeded. No retry/erasure. The exact old host
phase timings/iterator-result object were not logged and remain unproved.

Production observeMetadataState has an absolute performance.now deadline starting
when first iterated. It checks expiry after reads and between yielded values;
consumer pauses spend that lifetime. Caller abort had not yet been requested by
that test. Valid expiry can therefore close the iterator without another value.
The old test incorrectly required two yields across an independently awaited
Windows helper write without controlling elapsed observation time.
The server's production consumer uses for-await, so closure is handled; no unsafe
production `.next().value.records` consumer was found. No runtime patch needed.

Do not infer old corruption, lost records, permission regression, source22 lease
cause or exact Windows helper delay from this log. The fix addresses the identified
invalid test assumption and adds explicit coverage of the legal failure shape;
it does not retrospectively measure the old machine or erase its result.
Later d11a4a6 notes CI40073546538 concluded success; conclusion only, no fresh OS
counts or a failed-run retry, and no claim that this success resolves the old cause.

## Controlled reproducer before old test adjustment

Original MIT `proofs/state-observer-clock.mjs` runs only as an explicitly spawned
test process. It imports the unchanged real state/observer functions and uses actual
POSIX or Windows scoped storage; no copied observer implementation or mocked disk.
Only that child process's global performance.now is replaced while iterator.next
is pending, then the original property descriptor is restored in finally. Actual
writes and lock budgets run with the real clock. Node timers/helper deadlines are
not extended. No installed client/process is patched, no production test seam/API/
config clock option, and no prompt/model/API call or logging expansion.

Two closed modes, fixed synthetic scope, explicitly passed temporary root:

- live: initial snapshot3 at logical0ms, complete real write, resume at1000ms
  within unchanged10000ms duration, require same iterator yields4/new revision;
  abort and require clean closure; fresh actual read still4.
- expired: initial3 at0ms, complete real write, resume at10001ms, require exact
  `{value:undefined,done:true}`. Applying the old assertion must throw TypeError,
  while a fresh actual read must still return4. This distinguishes observer
  lifetime from persistence, not an arbitrary-host no-data-loss guarantee.

Before modifying the old native test, both modes passed locally against original
production sources. Live3→4 and cancel passed; expiry reproduced TypeError and
stored4. Initial local test2pass/0fail/0skip. Sanitized per-phase elapsed timings
are measured by separately retained real performance API, not injected time.
No paths/IDs/environment/ACLs/content in output, only closed mode, counters,
booleans/error category and numeric elapsed times. Logical-clock control is not
actual Windows latency or real-time delivery evidence.

`test/state-observer-boundary.test.mjs` owns roots/child processes, bounds output,
uses45s outer watchdog/46s fallback/60s test limit, waits for exit before cleanup.
Windows failure cleanup uses fixed OS taskkill with its own PID/tree only, no
PATH/project search; utility cleanup bounded separately. No production or existing
helper/observer deadlines changed. These are fixture cleanup mechanisms, not a
new universal kernel-IO termination guarantee. Normal success has no helper left
pending; no credentials/session discovery, system config or ACL repair.

## Minimal correction and acceptance

Windows public-state integration retains concurrent3event initialization, other-
session isolation, fresh3/4record reads, unsupported-field rejection, explicit
prune and unaffected other scope. It reads the completed write directly instead
of assuming an unexpired iterator. New clock-controlled tests independently
require SAME-iterator3→4 delivery and cancel inside duration, AND valid expiry/
missing value without removing the completed event. No optional assertion or
accept-either branch, retry, fewer writes, disabled sync or deadline increase.

Dedicated Windows OS CI now runs windows-storage plus state-observer-boundary tests
in the storage step. Four full POSIX lanes run the same new cases. Windows portable
job remains separate; no native Windows11 Codex compatibility claim. Source22 lease
and other original Windows proof modules remain unchanged and still isolated.

Production state.mjs/windows-state.mjs/windows-storage.mjs/PrivateStorage/observer/
ProgramBoundary/OwnedProcess/state20 are byte-identical to d11a4a6. Only version23
manifest/package/server production fields change. All settings/project/Git/restore
before-IO gates remain. No installed update/trust change or actual candidate Git run.

Local macOS14.6/Node24.22.0/npm11.19.1: targeted state+boundary15pass/0fail/1skip,
full188pass/0fail/95Windows-only skips283total; validate3mods/replay4fixtures,
diff-check clean. Actual Windows CI pending candidate upload. Do not treat local
clock control or skips as Windows OS success. Inspect actual logs before claims.

## Preservation and next gate

All93 IDs/order retained; native Windows11 and WSL acceptance remain unverified.
Windows11 latest unavailable; no repeated availability question. Original source21
fixture failure/correction and source20 old contention-failure uncertainty remain
separate. Source22 package/OS evidence retained, no full-product completion claim.
149 installed human-trusted dev10 files/private settings/logging unchanged.

No machine rollback needed. Only owned ignored fixtures after child exit; never
remove live locks, patch installed cache/trust hashes, restore shared config wholesale
or repair system ACLs. Existing selective supported dev10 rollback stays separate.
Future installed changed code needs human host trust review; none requested here.

After actual CI inspection, save/upload/independently verify full checkpoint and
STOP for human GPT-6.1 Sol Medium for source23 packaging. No background/delegated/
scheduled continuation, no additional native/model/API run authorization.


## First source23 CI: observer cases passed, new concurrency refusal

Sourcea70f90b6fd01de142a3c3049def7896661434d33,
CI40075058916:6jobs passed, Windows Node22 job120816524685 failed. Actual decoded
logs read for both OS lanes. Node22:both new live/expiry cases passed using actual
storage (live3→4/cancel, expired TypeError/fresh4). Then storage public-state test
failed its INITIAL concurrent3writes assertion at windows-storage.test.mjs:220,
1097.918ms, generic Private Windows storage unavailable. Storage21pass/1fail/0skip,
22total; process proof skipped. This is separate from the old missing second yield.
Node24 job120816524773 passed22storage+75proof/0fail/0skip, including both new cases.
Four decoded POSIX logs each188pass/0fail/95skips. No retry of this failed run.

No permission failure cause, corruption or record-loss claim follows from generic
refusal. Do not blindly increase sharing/lock/helper budgets, repair ACLs, serialize
away the original three-writer assertion, retry events or weaken checks. Source22
and prior failures remain distinct. Exact old observer host delay still unproved.

New diagnostic-only proofs/windows-state-trace.mjs copies the public C# helper,
PowerShell wrapper and Node bridge into an owned temporary root. Refuse callsites
receive closed numbered labels mapped to original source line numbers; wrapper
emits closed exception types, bridge captures only fixed labels/numeric timings.
Three fresh roots, initial missing-state read and THREE concurrent writes per root,
then fresh stored-count observation. Original helper/deadlines/policies unchanged;
only own source copies gain diagnostics, no installed or production logging.
A diagnostic refusal is reported as a refusal, never counted as storage acceptance.
No raw paths/ACL/SID/environment/session/content output. All requests bounded by
original adapter deadlines; wait for results before removing own temporary root.
The explicit CI step runs even after storage failure, and cannot erase prior failed
steps. It is a new diagnostic experiment on fresh roots, not a retry of the old run.
Actual diagnostic results pending upload. High must inspect labels before any
private-storage change or model switch. If a deeper architecture/security issue
requires Astra, checkpoint and request that human switch rather than speculate.


## Diagnostic candidate failure and minimal preparation correction

Source90375af / CI40075581270: both Windows storage suites passed22/0/0skip,
including observer cases, but diagnostic setup threw Script diagnostic shape before
any native trace/request rounds. Both process-proof steps skipped. Actual logs
120818082748(Node22)/120818082965(Node24) read. Windows checkout CRLF failed the
literal LF source matcher. Fix normalizes ONLY copied source text before inserting
labels. A local --shape-only mode synthesizes CRLF inputs, prepares all three copies
and reports40callsites/noWindowsExecution; it is source preparation, not Windows
runtime/semantic support. Failed run preserved, not retried; no production change.

Same run Ubuntu Node22 job120818082991:187pass/1fail/95skips283total. Existing
POSIX32-event slow-sync test failed4199.936832ms: one writer reported busy/completed0
instead of all8writers completed4. No final count inferred past its failed assertion.
Other three full POSIX lanes and portable job concluded success. Exact host delay/
handoff-budget cause unproved. Do not conflate with old observer expiry, Windows
concurrent creation, source20's earlier failure or the diagnostic line-ending bug.
No lock-budget increase, sync removal, event replay or weakened32-write assertion.

The Windows integration test now uses Promise.allSettled before asserting all3
statuses fulfilled. All3still start concurrently and must succeed; waiting every
helper prevents teardown racing unfinished siblings after one refusal. This is a
cleanup correction, not an explanation or fix for the initial native refusal.
Actual new Windows diagnostic results pending upload. Private storage/locking
questions remain unresolved; if source-only samples don't resolve them, use a
verified checkpoint and human Astra Ultra review, not speculative policy repair.
