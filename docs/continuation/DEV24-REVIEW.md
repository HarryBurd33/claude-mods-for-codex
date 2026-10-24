# Source24 Astra reliability review — 2026-10-24

Human resumed GPT-6 Astra Ultra from verified9becda0 on `codex/astra-groundwork`.
The installed human-trusted dev10, private settings and selected-project logging
scope are unchanged. Source24 is uninstalled; all Windows settings/project/Git/
restore gates remain closed. Full93-capability product is incomplete.

## Evidence and contracts

The three failures in [DEV23-REVIEW](DEV23-REVIEW.md) remain distinct: initial
Windows concurrent-write refusal, POSIX slow-sync contention busy, and macOS
inspection unavailable. Their historical precise timings/refusal stages were not
recorded. No corruption, lost committed record or malicious helper execution is
inferred. No failed run was retried or erased.

The source23 observer correction is sound: its absolute duration includes pauses
between yields. The production for-await consumer handles completion. The two
isolated tests exercise real storage with a controlled observer clock, separately
requiring live3-to-4/cancel and expiry/no-yield/fresh4. That is not a real-time or
native-host delivery guarantee. Production observer and budgets remain unchanged.

### POSIX contention

The production acquisition contract permits busy after1000ms without an observed
handoff or2500ms total; it provides no FIFO/arbitrary-load success guarantee.
The old stress case serializes at least32 times60ms =1920ms of injected delay
inside the global lock, before actual IO and scheduling. Requiring all writers to
succeed under any host load asserted more than that finite contract. This does
not retrospectively establish the precise old CI schedule.

`test/state-contention.test.mjs` now controls ONLY the acquisition clock at the
one exact callsite in its owned source copy. Eight IPC-ready children still write
four events each;60ms is still added before every real fsync. All32 writes and
retained records, counters and absence of locks are required. Real IO, exclusive
mkdir admission, timers and finite group watchdog remain. It tests contention/
preservation, explicitly not production wall-clock capacity. No production seam,
budget increase, event replay, lock stealing or reduced assertion.

A separate controlled-expiry case collides with an actual owned lock using the
original budget, then requires busy, identical lock identity/mode/owner, identical
committed journal bytes/snapshot and no new files. Existing real-clock8-by-4 and
held-lock cases and pure scheduler tests remain unchanged. Local focused5/0/0skip.

### Windows lock lifetime investigation

The actual `JournalLock` retries50 collisions with10ms sleeps. Its discarded
`LockExists` probe opens a metadata handle with delete sharing, and retains it
during identity/ACL validation even though its result/errors are ignored. That
was hypothesized to prolong deletion if its owner releases concurrently. This
requires actual OS observation, including the metadata-only access distinction.
A real reader uses the
same probe, so an acquisition-only change cannot eliminate reader contention.

Microsoft documents deletion-on-last-close in [RemoveDirectoryW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-removedirectoryw)
and atomic creation with supplied security in [CreateDirectoryW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createdirectoryw),
retrieved2026-10-24. The precise CreateDirectory error on a pending name must be
observed; source reasoning alone does not establish the old refusal branch.

New original `proofs/windows-lock-contention.cs` compiles as a test-only partial
with the actual production helper; it does not copy the lock algorithm. Owned
NTFS fixtures retain exactly the probe's metadata access/share handle across owner
release, observe the numeric creation error, require actual contender refusal,
then require fresh acquisition and empty cleanup after explicit handle release.
A separate unchanged-owner case requires refusal without replacement/removal,
then successful fresh acquisition after owner release. No event is retried.
Disposal failure cannot be misclassified as acquisition refusal.

The fixed PowerShell5.1 wrapper compiles public source in memory. Node uses fixed
SystemRoot executables, bounded output/deadline and owned-process cleanup, awaiting
exit before fixture deletion. No raw errors/paths/ACLs/SIDs/environment/content
are emitted. These are OS proofs, not Codex acceptance or an adversarial same-user
sandbox. Windows CI must run them before any Windows result is claimed.

### macOS inspection

The hostile-repository test now includes the existing sanitized API refusal reason
in its availability assertions. An independent finally check requires the helper
sentinel to be absent even if inspection refuses, and records that fixed fact.
Positive listing/diff assertions remain mandatory. Local15/0/0skip; the older
macOS22 refusal is not reproduced or explained. No production Git/permission/
timeout change or raw Git stderr logging.

## Initial local validation and pending evidence

macOS14.6, Node24.22.0, npm11.19.1: full189pass/0fail/97Windows-only skips286total;
validate3mods; replay4fixtures; diff-check clean. New Windows tests skipped locally.
Initial Windows CI is pending upload; no source24 package or native-host claim.
Production code changes so far are version24 fields only. Private storage and
all authority/deadline policies are still byte-identical to the checkpoint.

No installation, config/cache/trust/logging/export/retention/theme/model-selection
change or extra native/model/API test. Independent same-setting source reviewers
assisted this Astra turn; no model-switch delegation. Windows11 remains unavailable
per the last answer. No protected user step/restart or machine rollback is needed.
Remove only owned test artifacts after children exit; never remove live locks or
repair system ACLs. Every earlier failure remains in the public verification log.

## First Windows experiment — hypothesis not established

Source [5b1854f](https://github.com/HarryBurd33/claude-mods-for-codex/commit/5b1854f7bd5b07016b390146e43fdcf48bc2ba07),
tree828d97055f5aa1e6ef44f7b3acc501f215f7bddb,
[CI40117615834](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40117615834).
Both actual Windows logs read: Node22 job120942100291 and Node24 job120942100303
each23pass/1fail/0skip24total. The new delete-pending experiment exited1 at its
closed invariant boundary (690.2222ms/831.9914ms), without recording which stage.
The actual held-lock refusal/unchanged-owner/release check passed. The existing22
storage/observer cases passed;75-process-proof step skipped after the failure.
Copied-helper trace: each lane9successful writes across3fresh roots, count3each,
no refusal labels. This does not explain the old three-writer failure.

Four POSIX and portable jobs concluded success; detailed POSIX logs still to be
read before claiming exact counts. No manual rerun or production change. The
experiment had assumed its proposed mechanism before measuring it, so failure is
not evidence for that mechanism or a storage regression.

The original Pins comment already distinguishes metadata-only access from actual
directory-data access. The revised experiment measures both separately: exact
LockExists rights, and those rights plus FILE_LIST_DIRECTORY, each with share7.
It records the immediate numeric create error and actual JournalLock outcome,
then strictly requires fresh acquisition/empty cleanup after release. These two
observations are diagnostic-only, not relaxed production acceptance; original
all3/4writer tests remain strict. The held-owner case still requires refusal and
identity preservation. Closed numeric failure stages were added to the proof;
no paths/errors/content or production telemetry. Do not remove LockExists unless
the actual observation establishes an avoidable hazard. A corrected hypothesis
must be distinguished from a runtime fix, and exact old causes remain unproved.

Current README/status/ledger introductions now replace repeated historical model-
next text with a clear current summary. Full prior records remain in TEST-LOG and
versioned reviews/Git history. All93 IDs and implementation rows are retained.

## Corrected observations and final decision

Tested source [5fa65b5](https://github.com/HarryBurd33/claude-mods-for-codex/commit/5fa65b562d96b2737e54b73573fc699b8aca8119),
tree `679ff15f56bf837c520d8ed01a42526182a534e5`,
[CI40118125538](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40118125538):
all seven jobs passed. Actual decoded logs for both Windows and all four POSIX
lanes were read, not inferred from job conclusions.

| Lane / job | Observed result |
| --- | --- |
| Windows Node22 / 120943628996 | 25 checks: 22 existing storage/observer checks and 3 lock fixtures; plus 75 process/security proofs. Zero failures/skips. |
| Windows Node24 / 120943629060 | Same 25 plus75, zero failures/skips. |
| macOS Node22 / 120943628910 | 189 passes, zero failures,98 Windows-only skips,287 total. |
| macOS Node24 / 120943629031 | Same189/0/98; hostile-helper sentinel absent. |
| Ubuntu Node22 / 120943629123 | Same189/0/98; hostile-helper sentinel absent. |
| Ubuntu Node24 / 120943628950 | Same189/0/98; hostile-helper sentinel absent. |
| Windows portable / 120943628814 | Successful job conclusion; separate from native host acceptance. |

Windows Server2025/NTFS/PowerShell5.1, not Windows11 Codex. In BOTH lanes and
BOTH handle modes, direct creation returned success/error0 and the actual lock
contender acquired while the old metadata handle remained open. Explicit release
then permitted another fresh acquisition and empty cleanup. The proposed
delete-pending-name explanation is **refuted for these tested schedules/host**.
Do not remove LockExists or change retries/permissions based on that hypothesis.
No universal Windows filesystem behavior is inferred from the samples, and
generic API deletion wording alone does not establish pathname reuse behavior.

The separate unchanged-owner fixture required the actual contender to refuse,
preserved the owner's identity, then acquired after explicit owner release. The
two access-mask modes are diagnostic observations, not two new production
availability guarantees; report the25 count with that distinction. Current
copied-helper state tracing again observed9 successful writes per lane across
3 fresh roots, count3 each, with no refusal labels. The original initial-write
failure remains unlocalized; this run does not retrospectively explain it.

All four POSIX lanes passed both the controlled-clock slow-sync32-write case
and the original real-clock32-write case. The existing hostile-repository
availability/diff assertions and independent sentinel absence passed in all four.
The older macOS failure's reason and old POSIX schedule remain unknown. Sanitized
future refusal evidence is available; no blind retries or runtime repair is justified.

All production observer/storage/lock/Git behavior is byte-identical to9becda0;
only reported version24 changed. Installed149-file dev10/private settings and all
93 requirement identities are preserved. No user action/config rollback needed.
Following final records change documentation only, so no new full-suite run is
needed solely for those notes. Source24 package/archive verification is outstanding.

## Human-controlled next stage

**GPT-6.1 Sol, Medium** is sufficient for exact public-clone/archive verification
and routine documentation reconciliation. Do not keep Astra running for packaging.
Before any gated Windows authority/loader/Git/writer work, or a consequential
runtime/security repair, save/verify and request human **Sol High**. Lack of the
old exact failure timings is explicit uncertainty, not a reason for endless
speculative policy changes or repeated model-switch proofs. Preserve those failed
runs, the refuted hypothesis and existing strict functionality assertions.

Native Windows11/WSL, remaining macOS lifecycle/theme/event coverage and every
unfinished ledger acceptance stay incomplete. Do not declare the full product
finished or install source24 as part of routine package verification.
