# Source24 package handoff — GPT-6.1 Sol High

## Source24 Medium package checkpoint — 2026-10-24

Human selected GPT-6.1 Sol Medium from verified e15ba7b. Exact public clone passed
189 tests with98 Windows-only skips; archive199 files, all bytes matched. Fresh
spaced extraction validated3/replayed4 and passed14 focused checks.
See [PACKAGE-DEV24](PACKAGE-DEV24.md) for archive hash, commands and limits.
Only documentation changed; installed human-trusted dev10, logging scope, all93
requirements and every production Windows gate are preserved. Source24 is uninstalled.
Next human **GPT-6.1 Sol High** before gated Windows authority/loader/Git/writer
work or consequential runtime repair. Earlier model-next statements are historical.

2026-10-24. Astra Ultra resumed verified9becda0 on codex/astra-groundwork.
Reliability review and decisive OS investigation are complete for this milestone.
**The full93-capability product remains incomplete.** No production permission,
logging, storage, observer, Git or deadline behavior changed. Source24 is uninstalled.

## Read first

Read this file, STATUS.md, DEV24-REVIEW.md, REQUIREMENTS.md, ARCHITECTURE.md,
the latest TEST-LOG.md entry, PACKAGE-DEV22.md and ../packaging.md. Read the latest
ignored root HANDOFF.md for exact local artifacts and final checkpoint identity.
Consult DEV23-REVIEW.md for the original failures; do not restart the entire
Claude/Codex/REA survey. Historical model-next statements do not override this file.

## Verified code checkpoint and observed checks

Repository: https://github.com/HarryBurd33/claude-mods-for-codex
Branch: codex/astra-groundwork.
Local and verified remote tested code:
[5fa65b562d96b2737e54b73573fc699b8aca8119](https://github.com/HarryBurd33/claude-mods-for-codex/commit/5fa65b562d96b2737e54b73573fc699b8aca8119).
Tree: 679ff15f56bf837c520d8ed01a42526182a534e5.
Equivalent local bddf86ac2210694953fd5780a5af4326d2e05845 retained on
codex/dev24-lifetime-diagnostic-local-checkpoint.
Expected-parent/nonforce upload, fetched full-tree equality observed.

Earlier source24 code:
[5b1854f7bd5b07016b390146e43fdcf48bc2ba07](https://github.com/HarryBurd33/claude-mods-for-codex/commit/5b1854f7bd5b07016b390146e43fdcf48bc2ba07),
tree828d97055f5aa1e6ef44f7b3acc501f215f7bddb.
Equivalent local c92281bfca02ddaf3c7e2f32d206952587646043 retained on
codex/dev24-reliability-local-checkpoint. Its anonymous public ref was verified.
No force-push or lost commits. Following final handoff commit changes documentation
only; its actual identity is read back after upload in the checkpoint reply and
ignored handoff, avoiding a self-referential hash. Verify current HEAD/ref before work.

[CI40118125538](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40118125538)
on5fa65b5 passed all seven jobs. Both Windows and all four POSIX decoded logs read:

- Windows Node22 job120943628996 and Node24 job120943629060: each25 checks
  (22 existing storage/observer plus3 lock fixtures, including TWO diagnostic
  modes), plus75 process/security proofs, zero failures/cancellations/skips.
- Actual NTFS/Windows Server2025/PowerShell5.1; not Windows11 Codex acceptance.
  Both access-mask diagnostic modes observed create-error0/contender-acquired
  while old handle remained open. Held owner: refused, same identity; after
  explicit release: fresh acquisition and empty cleanup.
- Each copied state diagnostic:9 successful writes across3 fresh roots, count3
  each, no refusal labels. Not an explanation of the older unlocalized refusal.
- Ubuntu22 job120943629123, Ubuntu24 job120943628950, macOS22 job120943628910,
  macOS24 job120943629031: each189 passes/0 failures/98 Windows-only skips,
  287 total. Controlled slow-sync32, original real-clock32 and strict hostile-
  repository listing/diff passed; helper sentinel absence observed in all four.
- Windows portable job120943628814: success conclusion only, separate scope.

Local macOS14.6, Node24.22.0/npm11.19.1:
node --test test/state-contention.test.mjs test/state-lock-budget.test.mjs:
5 passes/0fail/0skip.
node --test test/workspace.test.mjs:15/0/0skip.
Initial source24 npm test:189/0/97 Windows-only skips,286 total (before the third
Windows-only diagnostic was added). Final code's current full counts are the
actual four CI lanes above. npm run validate:3 mods; npm run replay:4 fixtures.
Node syntax and git diff --check passed. No extra full run solely for final notes.
Source24 clean-clone/archive/extraction verification is now recorded in PACKAGE-DEV24.md.

## Decisions and exact code contracts

1. POSIX correctness versus availability:
   src/state-lock-budget.mjs remains1000ms idle/2500ms absolute acquisition
   scheduling, no FIFO or arbitrary-load success guarantee. The old injected
   stress case serializes at least1920ms before real IO; its unconditional
   success demand under all host schedules was stronger than this contract.
   test/state-contention.test.mjs controls ONLY the one acquisition-clock
   callsite in its owned source copy.8 children times4 events,60ms before every
   REAL fsync, all32 retained with correct counters and no locks remain required.
   The group watchdog is real and finite. No production clock seam, event replay,
   lock stealing, dropped sync or relaxed count. A separate original-budget
   controlled expiry after a real collision requires same held lock identity/
   permissions, exact prior journal bytes/snapshot and no new files.
   Existing production-clock32 and real held-lock tests remain unchanged.

2. Windows hypothesis refuted:
   proofs/windows-lock-contention.cs/.ps1 and
   test/windows-lock-contention.test.mjs compile an original test-only partial
   with actual unchanged PrivateStorage.cs. They measure exact LockExists
   metadata-only rights versus added FILE_LIST_DIRECTORY, both share7.
   Both measured modes permitted name recreation/acquisition on this host.
   Thus do NOT remove LockExists or alter retry/error/ACL policy based on the
   proposed deletion-lifetime explanation. It was not reproduced.
   The two modes are diagnostic observations, not accept-either storage
   acceptance. The separate held-owner test has strict refusal/identity/release
   invariants. Closed failure stages and numeric results only; no raw errors,
   paths, ACLs, SIDs, environment, session or journal content.
   Fixed OS helper, bounded owned-process/output cleanup; no native client run.
   Original50 acquisition attempts with10ms sleeps are not a hard500ms method bound.

3. macOS inspection:
   test/workspace.test.mjs keeps mandatory positive listing/diff checks and now
   reports the existing sanitized API reason on refusal. Finally checks helper
   nonexecution even if availability fails. No production Git, timeout, traversal
   or permission repair. Old failure reason remains unknown.

4. Observer review:
   Source23's isolated clock tests correctly distinguish absolute lifetime
   (including consumer pauses) from persisted writes. Production for-await
   consumer handles closure. No runtime patch needed; not real-time/native delivery.

5. Reporting:
   README/PUBLIC_STATUS/STATUS/REQUIREMENTS introductions now show current state
   instead of repeated historical model-next text. All93 IDs retained.
   Prior records survive in TEST-LOG/versioned reviews/Git. Runtime docs explain
   bounded best-effort telemetry and prohibit automatic replay of ambiguous writes.

Primary Microsoft sources and retrieval date are in DEV24-REVIEW. Generic
RemoveDirectory wording alone did not establish pathname-reuse behavior.
No new permission, authority, installer trust, code admission or loader decision.

## Preserve failed evidence and uncertainty

- Source23 e44dd93/CI40073187216: missing second observer value; precise phases
  unlogged. Controlled expiry is valid error shape, not retrospective timing proof.
- a70f90b/CI40075058916: initial Windows three-writer generic refusal; exact stage
  unknown. Current diagnostic success does not prove that cause fixed.
- 90375af/CI40075581270: copied diagnostic's CRLF setup bug (corrected separately);
  Ubuntu22 slow-sync case had one busy child. Exact old scheduling unknown.
- ccf6fbc/CI40075868007: macOS22 available:false; old reason and sentinel state
  unobserved because original assertion stopped early. No malicious-execution claim.
- New5b1854f/CI40117615834: both Windows lanes23pass/1fail/24total because our
  first lock experiment ASSERTED its unmeasured deletion hypothesis. Stage
  unlogged,690.2222/831.9914ms. Existing22 checks/held-lock passed;75 proofs skipped.
  Four actual POSIX lanes189/0/97skip; portable success. Revised measurements on
  5fa65b5 refuted the hypothesis. No runtime fix, retry or erasure.

These are bounded-availability uncertainties, not proof of corrupted storage.
A refusal after an unknown stage does not prove no commit; do not retry events.
No identified security/runtime defect justifies speculative repair at this point.
A new reproducible failure may need High; never silently weaken its assertion.

## Installation, scope and rollback

Installed human-trusted dev10 remains byte-equal to its149-file reviewed fixture.
Private settings hash and explicitly selected disposable project logging scope are
unchanged; this chat is outside that scope. Exact private paths stay ignored.
No install/update/native inventory/hook/UI/trust/config/cache/retention/export/
observer/theme/client/model-selection change and no extra native/model/API run.
Prior native host versions/results remain historical, not refreshed by this stage.
All Windows settings/dashboard/project/Git/restore before-IO gates remain closed.
Windows11 availability was last answered unavailable; do not ask again until changed.
Native Windows11 and WSL acceptance remain unverified.

No protected user action or restart is required for packaging. No machine rollback
is needed. Remove only owned test/package artifacts after child exit. Never remove
live locks, repair system ACLs, patch installed cache/trust hashes, globally trust
Installer or restore shared config wholesale. Existing supported selective dev10
disable/removal/rollback instructions remain in ../removal.md; settings/data separate.
Future installed changed code requires supported update and human trust review.

## Next exact model, effort and tasks

**GPT-6.1 Sol, High.** Source24 packaging is verified in PACKAGE-DEV24.md.
Immediate Medium work is complete. Remaining Windows authority/loader/Git/writer
security and integration work requires High. Do not start it until the human
switches and replies. No delegated/background/scheduled continuation.

1. Verify the final branch/commit and read PACKAGE-DEV24, DEV24-REVIEW, this
   handoff and current STATUS/REQUIREMENTS/ARCHITECTURE/TEST-LOG, plus latest ignored
   root HANDOFF. Production code equals tested5fa65b5; only documentation changes in this stage;
   package source e15ba7b has189/0/98 local public-clone results. Final notes-only
   artifact identity is recorded after independent verification in the reply/private
   handoff. Preserve user changes and all earlier failures.
2. Review the remaining Windows gates and existing source22 known-code-ancestor
   assessment/lease versus original ProgramPins. Choose a coherent bounded next
   implementation milestone with concrete acceptance criteria. Executable/DLL/
   source provenance is separate from private-data ACL authority. No global
   Installer trust or premature production gate activation.
3. Retain actual handle/job/scratch/read-set proofs and their limits. Original Git
   pins still refuse before content reads; executable version/import/authenticity/
   actual loader/native acceptance are not established. Do not execute candidate
   Git, change host ACLs/tools, add PATH/project fallback or infer successful
   provenance from a metadata schema or a proposed rule.
4. Old reliability failures remain unlocalized. Current evidence does not justify
   removing LockExists, increasing budgets, retrying ambiguous events or weakening
   all3/32-record assertions. A new reproducible failure needs bounded stage
   evidence and appropriate review, not speculative repair. No extra native/model/
   API test is authorized; any such run must be visible, separately authorized
   and bounded. Windows11 was last unavailable; do not repeat that question until
   availability changes.
5. Keep all unfinished93 requirements in scope. Native lifecycle/theme/event and
   Windows11/WSL acceptance remain incomplete. No new install or human trust review
   is needed for source investigation; changed installed code would require both.
6. Save runnable progress and sanitized required records, upload without force,
   verify exact full remote tree and independent ref, choose the cheapest exact
   next setting suitable for the remaining tasks, then stop for the human.
   Request Astra only if a new hard architecture/security problem requires it.

## Copy-and-paste resume instruction

I've switched to GPT-6.1 Sol, High. Continue from the verified source24 packaging
checkpoint on codex/astra-groundwork. Follow docs/continuation/HANDOFF.md and its
read list plus the latest ignored root HANDOFF.md. Resume the remaining gated
Windows security work with a coherent milestone and acceptance tests. Preserve
logging scope, human trust, installed dev10, all93 requirements, production gates
and failure evidence. Do not replay ambiguous events, weaken permissions, execute
candidate Git or run extra native/model tests. Save, upload and independently
verify progress, then stop for Medium when routine work is sufficient.
