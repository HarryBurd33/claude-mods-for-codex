# Source23 handoff — human GPT-6 Astra Ultra required

2026-10-24. Human selected GPT-6.1 Sol High from verifiedd11a4a6 on
`codex/astra-groundwork`. Observer test assumption corrected and tested on Windows.
Separate persistence/locking/inspection reliability questions remain. Medium is
insufficient; strongest-model review is needed before security or deadline changes.
Source23 is uninstalled; full93-capability product remains incomplete.

## Read first, without restarting research

Read this file; STATUS.md, REQUIREMENTS.md, ARCHITECTURE.md, TEST-LOG.md,
DEV23-REVIEW.md, PACKAGE-DEV22.md, DEV22-REVIEW.md, DEV21-REVIEW.md,
DEV20-REVIEW.md, DEV19-REVIEW.md, ../runtime.md, ../windows-storage.md,
../windows-native-acceptance.md; latest ignored root HANDOFF.md.
Do not repeat the whole Claude/Codex survey or repair unrelated tools. Investigate
these concrete failures first. Private machine paths/config/raw logs stay ignored.
Historical model-next statements below current summaries do not override this file.

## Exact source and observed latest run

Repository: https://github.com/HarryBurd33/claude-mods-for-codex
Branch: `codex/astra-groundwork`.
Latest tested source:
[ccf6fbc6dc19ccd932db10a082ec54d15adabb43](https://github.com/HarryBurd33/claude-mods-for-codex/commit/ccf6fbc6dc19ccd932db10a082ec54d15adabb43),
tree `ebdf2bf9de47edd60ca371e3be46553ce70db4fd`.
[CI40075868007](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40075868007):
6jobs passed, macOS Node22 failed. Actual decoded logs read:

- Windows22 job120818952009 and Windows24 job120818951871: each22storage+
  75process/security proof passes, zero failures/cancellations/skips. Real NTFS/
  Server2025/PowerShell5.1, not Windows11 native Codex. New controlled observer
  live3→4/cancel and expiry/no yield/old TypeError/fresh4 cases passed.
- Each Windows copied-helper diagnostic:3fresh roots×3concurrent writes, all9
  responses successful, each root fresh count3, no refusal labels. It did NOT
  reproduce or explain the older concurrent-creation refusal.
- Ubuntu22/24 jobs120818951986/120818951990 and macOS24 job120818952014:
  each188pass/0fail/95Windows-only skips283total.
- macOS22 job120818951996:187pass/1fail/95skips. Existing hostile-repository test
  at workspace.test.mjs188 received listProjectFiles.available:false instead of
  true, duration130.797042ms. Reason not logged; diff and negative sentinel
  assertion192 were NOT reached. No helper-execution or sentinel-absence claim.
- Windows portable120818952065:successful conclusion, not native acceptance.

Fresh local macOS14.6/Node24.22.0/npm11.19.1: npm test188/0/95skips283total;
state+boundary targeted15/0/1skip; boundary2/0/0skip; validate3mods/replay4fixtures;
node --check diagnostic and --shape-only synthetic CRLF preparation40callsites
passed. These source-shape/logical-clock checks are not Windows support. Diff clean.

Source local equivalents retained:45a416f (observer) on
codex/dev23-observer-local-checkpoint;1d0b585 (diagnostic) on
codex/dev23-state-trace-local-checkpoint;c95441c (CRLF/cleanup) on
codex/dev23-trace-crlf-local-checkpoint. Expected-parent/nonforce uploads and full
remote-tree/anonymous-ref checks observed. Following notes-only handoff commit's
actual local/remote/tree identities belong in checkpoint reply/ignored handoff
after readback, avoiding self-hash claims. Next model must verify HEAD/ref.
No force-push/lost history. Source23 packaging remains unverified/separate.

## Failure ledger — preserve each, no retry/erasure

1. e44dd93 notes CI40073187216 Windows22 job120810857964:19storage pass/1fail,
   missing second observer value at windows-storage.test.mjs227,22595.0689ms.
   First snapshot3 and awaited write completed. Exact per-phase times/result not
   logged. Valid absolute expiry reproduces error shape, not old host timing.
2. a70f90b CI40075058916 Windows22 job120816524685:21storage pass/1fail/22,
   INITIAL concurrent3writes refused at220,1097.918ms, generic native unavailable.
   Both controlled observer cases passed; original state case never reached them.
   Proof step skipped; Windows24 passed22+75. Exact native refusal point unproved.
3. 90375af CI40075581270:both Windows storage22passed; own diagnostic then failed
   Script diagnostic shape on CRLF checkout before native tracing, process proofs
   skipped. Fixed by normalizing copied source only, preserved failed run.
   Same run Ubuntu22 job120818082991:existing slow-sync32-event case failed
   4199.936832ms, one child busy/completed0 vs all8×4expected;187/1/95skips.
   No post-assertion retained-count claim. Exact host delay/handoff cause unproved.
4. ccf6fbc latest macOS22 availability failure above. No root cause or claim that
   malicious helper ran, and no claim sentinel absent when assertion was not run.

Do not conflate these with source20 old38848a8/CI40068264694 contention failure,
source21 b16a749/CI40071218873 fixture inheritance failure/correction in4b99ac1,
or source22's passing46c417d/CI40072785589 OS proof. All remain version-specific.
Later d11 notes CI40073546538 concluded success; no new decoded counts/cause claim.
No manual retry of any failed run; new source/diagnostic runs are distinct commits.

## Code contracts and implemented scope

Production state.mjs/windows-state.mjs/windows-storage.mjs/PrivateStorage.cs/
state-lock-budget.mjs/ProgramBoundary/OwnedProcess/CodeAncestorAssessment/Lease are
byte-identical to d11a4a6. Only package/manifest/server version23 changes in production.
No increased observer/helper/sharing/lock budgets, disabled sync, event replay or
permission/logging expansion. All Windows settings/project/Git/restore before-IO
gates remain. No original Git-pin change, candidate executable read/run or loader
provenance claim. Source22 retained metadata is not atomic ACL/code/private authority.

Observer duration is absolute from first iteration, including consumer pauses.
Server uses for-await and handles closure. Original unsafe dereference was in test.
proofs/state-observer-clock.mjs imports actual functions/storage; overrides ONLY
child process global performance while next pending, restores in finally. Writes/
lock budgets use real clock; timers/helper deadlines unmodified. Closed modes live/
expired, fixed synthetic metadata/root, sanitized counters/timings only. No installed
app injection, copied observer implementation or production clock option.
Test/state-observer-boundary.test.mjs has2cases, bounded child/output/cleanup;
Windows test uses direct fresh4read plus same scope/prune/strict metadata assertions.
Initial3writes still start concurrently; Promise.allSettled waits EVERY helper
before requiring ALL3fulfilled and tearing down. No serialization/fewer writers/
optional success branch or weakened32-event assertion.

proofs/windows-state-trace.mjs copies public C#/PowerShell/bridge into own temporary
root. Forty numbered Refuse callsites mapped to original source lines, closed
exception/compiler categories, bounded labels/timing frames; no paths/SID/ACL/
environment/content/session logs. Original API/deadlines remain, temporary copies
normalize CRLF before matching. --shape-only simulates CRLF preparation without
Windows execution. Three fresh roots only; reports refusal as refusal, never
acceptance. Current9/9perlane success leaves old failure unknown. Instrumentation
can change timing and later labels classify that sample, not old atomic cause.
CI diagnostic always runs after storage and cannot clear earlier failures.

## Status, installation, privacy and rollback

Completed: observer contract/probe/test correction, actual Windows observer cases,
fixture await-all cleanup, diagnostic preparation/execution. Partial/unresolved:
Windows concurrent creation refusal, POSIX finite-budget32-write reliability,
macOS read-only inspection availability, source23 package. Unverified: Windows11
Codex installation/trust/hooks/sandbox/dashboard, WSL, executable/loader/source
provenance and remaining gates. PL-04 unverified; all93 IDs/order retained.

Installed human-trusted dev10 stays byte-equal to149-file immutable fixture;
private settings unchanged. Logging selected disposable child only; this chat
outside it. No source23 install/update, native inventory/hook/UI/trust observation,
config/cache/retention/export/observer/theme/client/model/API-run change. No secrets,
paid keepalive, automatic approval/model switch or prompt rewriting. Windows11
latest unavailable; do not ask again until availability changes. Any extra native/
model/API test needs separate visible bounded user authorization.
No machine rollback needed; remove only own ignored artifacts after children exit.
Never remove live locks, patch installed cache/trust hashes, repair system ACLs,
restore shared config wholesale or globally trust Installer. Existing selective
supported dev10 disable/removal/rollback separate; settings/data preserved. Future
installed changed code requires human trust review. No protected user action or
restart needed for source investigation.

## Exact next model and priority tasks

**GPT-6 Astra, Ultra.** Remaining issues cross private persistence, lock ownership,
bounded-completion claims and trusted Git inspection. Medium is insufficient;
strongest review is warranted before any policy/deadline repair. Human switch only.

1. Verify checkpoint/ref, read this ledger and actual failure records. Review
   observer correction and isolated fixture cleanup/clock limits; do not redo all
   Claude/Codex/REA research or assume latest green Windows means old issue fixed.
2. Investigate Windows initial3-writer refusal: original PrivateStorage Pins/State/
   JournalLock/open-sharing/create protocol vs Node helper bounds. Current trace
   did not reproduce it. Define a controlled harmless owned-fixture experiment
   with fixed-stage diagnostics before altering production. No ACL repair/global
   Installer exception/PATH-project executable fallback or blind retry/budget bump.
3. Review POSIX conditional1000ms idle/2500ms total schedule versus actual32×60ms
   sync-latency test under scheduler/IO load. Keep exact old CI delay unproved.
   Preserve meaningful32-write verification and real sync; don't merely accept
   fewer writes, steal locks, replay events or assert arbitrary-load success.
4. Investigate macOS22 available:false at workspace.test.mjs188. Capture bounded
   sanitized refusal reason at the synthetic boundary and ensure sentinel checks
   can establish nonexecution even on availability refusal. Preserve positive
   functionality and hostile-config defenses; do not remove either assertion.
   No helper-execution inference from title, no private project/session discovery.
5. Prioritize a coherent contract/fix, complete decisive controlled proofs and
   appropriate actual CI, preserve failures and privacy. If no cause reproduced,
   say exactly what remains unverified; do not manufacture certainty from samples.
6. Save runnable progress/public required records, upload expected-parent/nonforce,
   independently verify full tree/anonymous ref. Choose exact next least expensive
   model/effort suitable for remaining work, then STOP for human switch. Sol Medium
   only when remaining work is routine; no delegation/background/scheduled bypass.

All supported unfinished requested capabilities remain in scope. No custom-client/
fork/installed-app patch direction without user agreement. This is not a release.

## Complete resume instruction

I've switched to GPT-6 Astra, Ultra. Continue from the verified source23 High
checkpoint on codex/astra-groundwork. Read docs/continuation/HANDOFF.md and listed
files plus latest ignored root HANDOFF.md; verify exact remote HEAD. Review the
observer test correction and investigate remaining Windows concurrent-creation,
POSIX slow-sync contention and macOS inspection-availability failures. Preserve
all failed runs, exact-cause uncertainty, actual OS versus logical-clock/native-host
distinctions, logging scope, human trust, installed dev10/private settings, all93
requirements and every production gate. No blind timeout/permission repair, weaker
assertions, old-run retry, global Installer trust, system ACL repair, candidate Git
execution or extra native/model/API test. Save/upload/verify a runnable checkpoint
and stop for the next human-controlled model switch when sufficient.
