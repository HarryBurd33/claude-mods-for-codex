# Private Phase1 mechanism — synthetic acceptance, real entry closed

## Current Astra milestone — 2026-10-26

[Astra runtime review](ASTRA-RUNTIME-REVIEW.md) resolves the external
ownership-dependency review and supplies a versioned private launcher. Final current-
runtime/local-Git integration: **11 passes**. Selected public held-call/restore tests:
**44 passes**; default configuration and four replay fixtures passed. The historical
30-case core run was not repeated. These are offline results, not native acceptance.

The real Phase 1 setup remains unstarted, its original grant unused, both admissions
closed and its shared ledger empty. The last narrow execution instruction was
synthetic-only; a later explicit activation may use the existing grant once. Accepted
C design/manual supervision need no repeat vote. Later startup/trust/model/result
boundaries remain in the [consolidated packet](STOP-CONSOLIDATED-REQUEST.md).
No native Codex process, host inventory or production installation change occurred.

Source **0.2.0-dev.39 stays disabled/uninstalled**; installed31 is preserved. The full
project remains incomplete. Native lifecycle/failure/cancel, held-call NM-1 and
configured routing, UI accessibility/reopen/Watch teardown, full authoring lifecycle,
Windows security/native Windows/Linux/WSL and frozen-candidate release acceptance
remain. The 93-row ledger's 60V/14B/12A/3U/4P counts are unchanged and are not a
completion percentage. Source38/39 package and CI evidence remains version-specific.

The user now authorized GitHub progress publication; earlier no-network directions
below are historical for that purpose. Private checkpoints, machine bindings, grants
and raw logs stay local. Next **GPT-6.1 Sol Ultra**, following the
[consolidated implementation milestone](SOL-ULTRA-MILESTONE.md).
No automatic Sol dispatch or background continuation is scheduled.

## Historical records — prior stage directions

## Final preservation finding — external runtime pin drift

After the30passing synthetic cases and initial verification, the separately installed
task-checkpoint runtime changed outside this repository. The private entry's sealed
runtime digest no longer matches; **actual execution remains blocked**. The seal was
not updated and no new baseline adopted. Both digests are preserved privately. This
does not invalidate the synthetic core results, but current ownership-adapter code
needs High review before any real operation. The earlier Medium handoff below is superseded: **remain GPT-6.1 Sol High**
for a source-only review of the changed ownership adapter, without repinning or
executing Phase1. No actual
grant consumed/targets touched. No extra source investigation was started at the stop.


2026-10-26, GPT-6.1 Sol High fromccffef3 under
[STOP-PHASE1-ENFORCEMENT-SCOPE](STOP-PHASE1-ENFORCEMENT-SCOPE.md). **30synthetic tests
pass. Real Phase1 grant remains unused; no selected target checks/setup performed.**
Code/tests are in an ignored private implementation directory, backed up by the local
checkpoint. No product/runtime/test/package/version/CI change or native activation.

## Implementation and exact boundary

- phase1_core.py validates a fixed binding, strict one-use admission attestation and
  private coordinator ledger; reserves an exclusive durable attempt marker before
  target work. Entry also reserves its exclusive RESULT before calling core, so even
  an early refusal/empty receipt prevents repeat. Either reservation is consumed/unknown
  evidence; the original human authorization remains immutable.
- POSIX Budget uses monotonic checks and SIGALRM for one20second target-work budget;
  no existing timer/other thread is displaced. It does not promise to interrupt an
  uninterruptible kernel operation. No child process is spawned by the core.
- Source directory/file operations use no-follow handles, private ownership/type/
  mode/link checks, bounded hashing and identity rechecks. Selected directory handles
  stay pinned through setup, with named binding checks. No unlisted ancestor scan.
- Five expressly authorized artifacts are read through bounded no-follow file handles,
  checked against their saved hashes and fstat before/after. Their handle checks are
  integral to the authorized reads, not extra named-path discovery. The explicit old
  metadata checklist remains45objects; new owned-object validation and private
  coordination are not additional discovery targets. No CLI/Node/live config read.
- Exact policy/declaration semantics and path quoting are checked without execution.
  Four directories and two files are created exclusively with requested0700/0600,
  no permission repair or overwrite. Partial writes loop within the same budget;
  zero progress/errors stop. File bytes are read back through the created handles.
- Sync/close/deadline/partial-creation failures cannot report success. Partial objects
  remain; created labels list confirmed operations only, not a complete inventory
  after an ambiguous syscall. No rollback/delete/retry/lock recovery is performed.
- entry.py has no path/command selectors. It checks a fixed sealed BINDING, program/
  grant/runtime hashes, fresh reviewed admission and the existing local checkpoint
  owner/token. It rejects remote ownership rather than querying a remote ref.
  Verified core/runtime bytes are compiled after hashing to avoid a second code-file
  lookup. This executes only coordinator code, never selected source files/templates.
- ADMISSION.allowAttempt remainsfalse. Its future review must bind the entire SEAL
  digest, binding/scope digest and fresh lease fields; source/seal changes invalidate
  that review. Existing original grants/native drivers are not reopened or modified.

Binding is prepared only from the sealed REQUEST/ARTIFACT-PINS data. No actual39source
contents,45target metadata or five artifact contents were validated by this stage.
An empty private real-ledger directory is coordinator bookkeeping, not temporary
native project setup. No attempt marker exists there. Original unused authorization
bytes match the intake pin. Current target existence/permissions remain unobserved.

This is a cooperating local operator mechanism, not human authentication or an OS
sandbox. Directory checks cover the authorized selected roots/components; they do
not certify unexamined ancestors or prevent hostile same-user/root changes. Session
lease/ledger copies are not a distributed single-use service. Preserve the full private
ledger across transfer; missing evidence never authorizes a retry or fresh ledger.

## Tests actually run and failures retained

All fixtures are new owned private directories with synthetic contents/expected hashes.
They reuse only file names and scope shape from saved manifest data. Selected code is
never imported, and the actual grant is hash-checked unchanged after each test.

| Check | Observed result |
| --- | --- |
| Initial test discovery | Import failed before cases: harness matched absolute names against relative manifest keys. Corrected data-only name mapping; no fixture/native target operation. |
| First full suite |19cases:18pass/1fail. Close failure during creation reported failure but incorrectly left closedHandlesKnown=true. |
| Close accounting fix | Every uncertain close now clears the known-closed flag without retrying it; focused1case pass. |
| Expanded suite |27cases pass, including closed real entry, deadline before writes/after partial creation, zero/short/partial write, sync/close failure, collisions/links/modes and semantic refusals. |
| Copied entry | Two focused entry cases pass; full admitted path uses a synthetic copied coordinator/runtime lease adapter, then refuses repeat. Actual entry stays closed. |
| Final suite |30pass/0fail in the final sealed-entry run on this host. No real target, native client, extra model or network. |

Command: `python3 -B -m unittest discover -v -s .local/phase1-implementation -p test_phase1.py`.
Logs and pre-fix evidence are private. The final30 include earlier cases, not30extra
independent cases beyond the27/19. Closed-entry, exact-byte/mode setup, binding/grant/
metadata-list refusal, source/artifact drift, root collision, symlink/FIFO/hardlink,
private-mode/size bounds, real short POSIX alarm runs before/during writes, source-dir
replacement, short/zero/partial writes, sync/close/after-mkdir failure, output bound,
wrong hook binding, restrictive umask and simulated owner metadata are covered.
Review also strengthened the entry reservation before core: an unavailable timer
now leaves a consumed RESULT reservation even without an attempt marker. A new copied-
entry case verifies that early refusal and repeat prevention.

Owner refusal uses simulated metadata, not chown or another-user host acceptance.
The opened copied-entry lease is simulated, not actual task-runtime integration or
human authority. No process-death/power-loss/OS-stall/hostile-user/Windows acceptance.
The core has no child tree to supervise; no descendant-cancellation guarantee follows.
Synthetic roots/partial state are retained; logs/hashes and implementation are backed
up, while fixture bulk remains private on disk. No source managed scratch is cleaned.

## Model-switcher/resource decision

AGENTS instructed model-switcher at intake. Explicit Sol High/no extra-model choice
controlled this task; no worker dispatch, automatic desktop model change or API fallback.
High remained appropriate after the import and close-accounting acceptance failures.
Scope stayed the same; evidence was preserved and each fault corrected within the
bounded batch. Account allowance, API dollars, tokens/cost and context are unknown;
no measured savings or task-token estimate is claimed. No additional provider call.

High implementation/review is complete. **Next GPT-6.1 Sol Medium** for exact private
artifact review and, only under a fresh explicit resume invoking the already authorized
unused grant, one actual operation if it conforms to the sealed scope. This is not a
request to reapprove Phase1/C/manual supervision. Native/startup/network/trust/model
usage and later phases still need their separate grants. No extra source/probe loop.

## Exact Medium review/operation boundary

Read the current handoff and private implementation/RESULT/SEAL/BINDING/admission/grant
pins. Check code/scope and limits, current ownership, original unused authorization and
empty real ledger before any target access. Do not run the old source/template verifier
as an uncounted preflight. This stage did not validate real targets or guarantee they
will pass; drift/unsafe/missing check must stop the one future attempt.

If the real attempt is authorized by the resume and preconditions still hold, record a
fresh admission binding the SEAL/binding/scope hashes and current local owner/token,
then use only the fixed entry. The exclusive RESULT reserves the entry, and the durable attempt marker precedes
target work; it keeps the original authorization as historical evidence. No old checker/
native driver gate, global config/trust or baseline is changed. If any scope/safety
issue requires code changes, stop for High; do not improvise or broaden the45objects.
Return partial/unknown honestly, retain evidence and never retry automatically.

Close the admission after that attempt, preserve marker/result and checkpoint them.
No automatic native startup or trust/model action follows success. Cleanup/data
removal remains separate. Empty-directory/ledger transfer needs explicit care: a
regular-file backup cannot recreate an empty directory, and a missing ledger after
an uncertain operation is not proof of an unused grant.

No real Phase1 invocation, target access, native/UI/server/model/API/worker/network,
installation/global config/trust or baseline adoption occurred. Installed31/logging/
model/human trust/product/Windows guards and dev39disabled are preserved;93counts
unchanged. Local source/docs/checkpoint only; upload/remote verification remains
prohibited under no-network. Full product/native/platform delivery remains incomplete.
