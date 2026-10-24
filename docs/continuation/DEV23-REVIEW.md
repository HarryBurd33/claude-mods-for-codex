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
