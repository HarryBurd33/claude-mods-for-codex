# Next unblocked scope: POSIX restore failure and interruption acceptance

**Execution record:** human authorized and High completed this finite scope from245c3bd.
See [M1-RESTORE-FAILURE-RESULT](M1-RESTORE-FAILURE-RESULT.md). This historical scope is
not an unused test grant and does not authorize a repeat, packaging or activation.


2026-10-26, prepared on Sol Medium fromcce1ec4. **Preparation only, not authorization
or evidence that these cases pass.** Next setting: **GPT-6.1 Sol High** for file-mutation,
rollback and controlled-child interruption reasoning. No implementation/test run now.

## Objective and reason for selection

M1/W4 EX-04 plus W5 SEC-02/03/07/09: verify the already implemented one-file POSIX
restore's write/recovery/interruption behavior using synthetic repositories only.
The ledger and docs/replay.md explicitly leave interrupted/disk-failure recovery
unverified. Existing test/restore.test.mjs covers normal restore/reverse, conflict,
path/link/permission/plan/concurrency refusals, but no injected overwrite/truncate/
sync/recovery failure or controlled mid-write process death.

This is a substantive remaining acceptance gap, independent of native Codex launch,
UI, account/model access, network or Windows host availability. It is not a rerun of
the completed authoring/packaging work or speculative repair of a system tool.
Known non-atomic interruption is a disclosed design limit, **not by itself a new bug**.
No defect was reproduced or fix selected during preparation.

## Existing contract to preserve

Read src/restore.mjs, docs/replay.md, test/restore.test.mjs, relevant readCheckpointPair
in src/workspace.mjs, restore CLI branch and ledger EX-04/security rows. Current
apply requires a private outside-project re-derived plan, exact reviewed plan ID,
one existing regular owned bounded UTF-8 file, unchanged executable mode and expected
content/identity, owner-write permission and an exclusive cooperative lock.

Apply overwrites through the checked file descriptor in place. Ordinary overwrite
failure attempts an **in-call rollback** to the expected to-commit bytes. Failure of
that rollback reports manual recovery; both versions remain in the private plan.
Process death can interrupt mutation and leave a lock. No atomicity/power-loss or
hostile same-user guarantee; no post-crash automatic recovery/lock stealing. Clarify
ambiguous documentation only against observed behavior, not by pretending rollback
is absent or changing its authority silently.

Do not substitute rename/temp-file replacement merely to claim atomicity: it can
change inode/ACL/xattr contracts. Such a redesign needs a separate decision. No add/
delete/rename/binary/mode transition support, force flag, auto-merge, MCP/UI writer,
permission exception or Windows enabling. All existing guards remain in force.

## Exact proposed files/actions

After a later explicit High authorization:
- Add test/restore-failure.test.mjs and, only if needed, fixed test-only helpers
  test/fixtures/restore-failure-peer.mjs and test/fixtures/restore-fault-io.mjs.
- src/restore.mjs may change **only for a reproduced violation of its existing
  documented contract**, with saved pre-fix failure and a minimal regression-backed
  correction. No public signatures/new fault flags/env selectors or caller-supplied
  executor/IO implementation. Do not widen guards, file types, permissions or scope.
- docs/replay.md and sanitized continuation evidence may describe actual outcomes
  and limits. No source/skill/UI/hook/config/version/package/CI changes elsewhere.
- New private .local/m1-restore-failure/ may contain bounded synthetic Git projects,
  sibling private plans, logs/phase markers/pins/results. No real project or prior
  authoring data, installed cache/settings/trust, sessions, credentials, native CLI/
  Node identity targets or existing production state. Planning has not created it.

No live restoration is authorized. Every apply must target a file created by this
fixture under its own selected synthetic project and use that fixture's exact plan
ID. Plan storage is outside that selected project, private0700/0600, one-link/canonical;
no path repair or fallback scan. Retain old source/evidence pins and candidate39 archive.
New tests/fixes are unversioned source after39, not bytes in that archive or installed31.

## Deterministic fault boundary

Use the real restore algorithm in isolated fixed Node test subprocesses. Instrument
only the explicitly owned selected fixture FileHandle/operations; keep open/identity/
plan/Git/scratch safety checks real. Fault injection is test-only, never product config
or a generalized runtime adapter. Record which write/truncate/sync phase actually
fired; a missing injection/phase is inconclusive, not a passed failure test.

Prefer a minimal fixed helper that wraps only the selected handle in that subprocess.
Do not patch unrelated handles globally in a shared test process. If a safe deterministic
mechanism cannot exercise the real algorithm without a broader product seam, stop
with one exact design blocker rather than add an unrestricted callback API or silently
test a rewritten algorithm. No new generic runner/client/probe framework.

Inject errors such as EIO/ENOSPC at the selected operation; **do not fill a disk**, alter
mounts/ACLs/system settings or change real storage permissions to provoke them. Process
interruption uses only a newly spawned fixed Node child at a verified phase barrier,
never Codex or an existing/unrelated PID. It must have no model/network/native inputs.

## Finite new case matrix

Use at most eight independently owned scenarios, bounded text <=4KiB per version:

| Case | Controlled behavior | Required observation |
| --- | --- | --- |
| 1 Control | No injected failure | Normal reviewed restore; unchanged unselected file/index/HEAD and selected inode/mode/owner |
| 2 Short writes | Actual writes return bounded partial progress until complete | Exact target bytes, finite progress; no false success on incomplete data |
| 3 Zero progress | First target write returns0; rollback writes work | Reject, exact expected bytes restored, no restored=true |
| 4 Partial then error | Write an actual prefix then fail a later target write; rollback works | Reject, exact expected bytes/length restored; plan and unrelated data unchanged |
| 5 Truncate error | Target truncate fails once; rollback path works | Reject, exact expected bytes/length restored, no silent mixed tail |
| 6 Sync error | Target sync fails once; rollback sync works | Reject, exact expected bytes restored; do not infer hardware power-loss durability |
| 7 Recovery failure | Initial partial/error plus rollback write/truncate/sync failure | Reject with manual-recovery status; retain plan's two versions; no false original-restored/completed claim or automatic retry |
| 8 Process death | Fixed child pauses after an actual target prefix write, then is interrupted by its owning parent | No success claim; direct child reaped, partial/unknown state and retained lock/plan recorded; no lock stealing, post-crash retry or automatic recovery write |

For every case preserve/check plan bytes/ID, selected metadata as meaningful, original
Git index/HEAD, unselected tracked/untracked sentinels and absence of raw content in
safe summaries. Some failed/interrupted states intentionally have partial selected
bytes: report them, don't assert false no-mutation safety. Plans contain synthetic
versions only; real plans are sensitive/base64 is not encryption. This is fault-path
acceptance, not real disk exhaustion/power loss, native-host or extended ACL/xattr proof.

## Process/filesystem/network bounds

Fixed Node/local Git subprocesses only, shell=false. Minimal scrubbed environment;
no inherited CODEX_MODS/PLUGIN/NODE_OPTIONS, user/global Git config, credential helpers,
remote fetch, hooks or templates. Synthetic commits use fixed test identity and empty
templates; Git never operates on this development repository as a restore target.
Route the existing workspace adapter's owned scratch directories into a canonical
private fixture scratch root when supported; no changes to workspace.mjs are included.

One case at a time, no background jobs. Fixed child20second work ceiling, parent
25second ceiling including cleanup; ordinary fixture Git command5second timeout.
Phase protocol <=64KiB/case and combined private logs <=1MiB; all synthetic artifacts
<=1024regular files/16MiB. New nodes/byte content are fixed/allowlisted, no arbitrary
argv/paths from a model or case payload. These are bounded supervision targets, not
hard real-time/kernel guarantees. Verify actual phase and owned child identity before
signalling; never signal a group after its leader exits, fall back to unrelated PID
selection or claim all descendants are proven absent from direct-child reaping.

Stop on unknown child outcome, unsafe path, unexpected writer or scope drift; retain
private artifacts for review. No automatic retry or stale-lock cleanup. Interruption
case retains evidence/lock rather than restoring it to make the test pass. Existing
source-managed scratch cleanup is separate from recovery authority. Do not delete
unknown contents. Any later removal is limited to explicitly owned artifacts after
all relevant work has ended; no user-data cleanup or global rollback.

## Validation, fix and finish order

1. Run existing restore tests once as baseline in clean synthetic environment:
   `node --test test/restore.test.mjs`. Do not infer failure coverage from its success.
2. Implement/verify the fixed fault boundary and eight cases; run
   `node --test test/restore-failure.test.mjs`. Save observed faults/outcomes.
3. If and only if a case demonstrates an existing-contract violation, preserve that
   pre-fix evidence, make a minimal src/restore.mjs correction and rerun the actual
   failing case, then restore/new suite once. Documented non-atomic crash behavior or
   an expected refusal is not grounds for a speculative runtime fix. A need to alter
   guard/metadata/atomicity/API design is a separate decision, not included here.
4. If runtime code changes, run relevant regression once:
   `node --test test/restore.test.mjs test/restore-failure.test.mjs test/workspace.test.mjs test/checkpoints.test.mjs test/contracts.test.mjs test/safety.test.mjs`.
   Do not weaken existing assertions/deadlines or repeat unchanged stress suites to
   obtain a pass. No full package/CI/native rerun automatically follows new tests.
5. Review source/access/privacy/guard diff. Save exact commands/results and classify
   each outcome as injected failure, actual controlled interruption, documented limit,
   reproduced defect/fix or unverified. Preserve source/fixture provenance and stable
   default/native/Windows/ancestor/routing guards. Keep all93mapping/count claims honest.

Target one30minute foreground High batch, checkpoint before extending it. No extra
model/API/evaluator/subagent call, native Codex/UI/server run, network, install or live
configuration/trust change. Current selected chat consumes ordinary model usage.

Exit: meaningful bounded failure/interruption regressions and accurate recovery limits,
with a minimal fix only if demonstrated necessary; otherwise no runtime change. If a
hard prerequisite prevents those proofs, one precise evidenced blocker, not another
framework. Return to Medium when only routine result/package-review work remains.
Installed31/all guards remain untouched and dev39 disabled throughout. Full native/
Windows/project completion is not established by these source-only tests.

## Historical proposed authorization — subsequently granted and executed

“Continue on GPT-6.1 Sol High from the scoped checkpoint. Implement and run the bounded
synthetic POSIX restore failure/interruption acceptance in M1-RESTORE-FAILURE-SCOPE.md.
Permit its new test-only fixtures and a minimal src/restore.mjs fix only for a reproduced
existing-contract violation. Preserve installed31/all guards/dev39disabled. No live
restore, native/extra model run, network, installation or live config/trust change;
no guard/API/atomicity/metadata-policy expansion. Stop for Medium when sufficient.”
