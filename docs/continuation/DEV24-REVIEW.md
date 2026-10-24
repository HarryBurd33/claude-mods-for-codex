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
can prolong deletion if its owner releases concurrently. A real reader uses the
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
