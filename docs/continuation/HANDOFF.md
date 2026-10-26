# Source38 offline reliability corrected — next GPT-6.1 Sol Medium

2026-10-26, America/Denver. Sol High resumed0fcc04e under explicit fixed-Node
investigation/correction scope. Both recorded leads reproduced and minimal timing/
result guards were corrected. **No Codex invocation, inference, install/config/trust
change, native-input refresh or gate opening.** Installed31/all host guards preserved.
Source38 uninstalled; full93/native routing/nativeWindows acceptance incomplete.

Read DEV38-REVIEW.md, STATUS.md, REQUIREMENTS.md, ARCHITECTURE.md, latest TEST-LOG.md,
RESUME-PLAN.md and ignored root HANDOFF.md. PACKAGE-DEV37/CI-DEV37 stay exact prior
source evidence, not source38 results.

## Actual reproduction and acceptance

Before correction, new diagnostic fixtures/regression harness ran6cases:1pass5fail:

- Legacy readiness delayed timer/late peer reply attempted5requests; required1.
- Readiness serialization stall attempted2requests; required1.
- Inspection serialization stall attempted2requests; required1.
- Both silent-descendant cases reported observation-complete while their old group
  was still present at the main cleanup snapshot; required review-required.

The isolated Node harness stalls only its own timer/serialization at fixed durations.
No arbitrary public clock/transport/executor or installed-client patch. Silent leaf
closes standard streams, stays in the fixture group and self-exits after1sec; separate
signal0-only fixture teardown observed group absence before tests asserted/returned.
These are reproduced **offline Node** failures, not native Codex failures.

After corrections, reliability+readiness+inspection **34pass0fail**,~14.4sec.
Full suite after strict identity checks **437cases324pass0fail113skip**,~16.1sec.
Final full rerun after leader-exit signal guard: same324/0/113/437,~15.9sec.
validate3mods/replay4fixtures pass; no command executed. Runtime darwin/Node24.22.0.
All six new reliability cases included; Windows will skip5POSIX cases, run1pure case.
Exact38CI/package/anonymous clone/spaced extraction remain pending Medium.

## Code contracts and justified changes

- proofs/readiness-driver.mjs: monotonic sample before packet acceptance, each outgoing
  item and after serialization; final clock sample. Local taken queue stops explicitly.
- proofs/inspection-driver.mjs: retains packet sample, adds each-item/post-serialization
  checks. Both drivers count only post-check write attempts; no execution/billing claim.
  Typed denials remain within deadline/cancel bounds; no approval or successful tool.
- proofs/process-group-observation.mjs: only signal0 to the spawned group's recorded
  ID; ESRCH=>absent-at-probe, presence=>present-or-reused, other errors=>unavailable.
  Reject special0/1, negative/noninteger/out-of-range identities. Windows returns
  not-observed-on-platform before syscall. No process enumeration or broad PID adoption.
- Both drivers preserve processReaped as direct close, add group/fixture labels and
  allDescendantsVerified=false. POSIX presence/unknown absence aborts descendants-
  unresolved. Report pre-fixture-teardown status even if later fixture self-exit succeeds.
- TERM/KILL stops after leader exit/close except the known fixed pipe-holding leaf
  scenario whose code cannot change groups. Native/arbitrary descendants get no such
  exception. A stale/reused group is never killed after leader exit; it is uncertainty.
- proofs/readiness-{fixtures,peer,leaf}.mjs and inspection-{fixtures,peer}.mjs add only
  fixed scenarios/bounded silent mode. proofs/reliability-probe.mjs is a fixed isolated
  Node regression runner; test/reliability.test.mjs6cases. Common machine adds only a
  fixed reason; four version carriers become0.2.0-dev.38, CI adds portable suite.

All native gate function bodies are byte-identical to0fcc04e. Shared routing/native
runtime, inspection contract,31protected storage/Windows/config/hooks files, defaults/
MCP/rules/logging selection unchanged. No new native PLAN/INPUT/current binary/config
snapshot. Native inspection transport remains absent; old dormant native path closed.

## Limits and primary references

Group absence is a point observation, not proof no child escaped or remote work was
cancelled. PID reuse, permission errors and zombies are not inferred as safe. Kernel
stalls/process suspension are not bounded by a JavaScript clock. Generic descendant
containment needs separately reviewed supported OS supervision; not implemented here.

DEV38-REVIEW links Node24 process.kill, Linux man-pages6.19 and historical Apple BSD
manual retrieved2026-10-26. Both Open Group POSIX page attempts403, no evidence used.
No native source/endpoint refresh, unrelated research or host process/credential scan.
Existing remote-control/startup blockers persist; no internal marker/policy edit/app
patch or native approval request. Do not repeat that blocked admission research here.

## Preservation and provenance

Starting previous Medium verifier passed. New source38 source-only verifier keeps
historical37/36.1 artifact checks at exact Git versions while checking current
intentional38runtime/docs separately. Old manifests/archives untouched. Exact new
checker named in ignored handoff; old worktree pins would flag these intentional
source changes, which are not an accepted host config/trust baseline.

Raw config matches36.1; known one added project-trust entry remains unknown/unaccepted,
prior protected values match after removing only it in memory. Owned installed31cache
251/settings/data/sources/marketplace unchanged;93ledger IDs/order preserved. No hook
source/command/private session opened, no environment/key/credential-store discovery.
New protected/runtime differences must stop for High classification, never restoration.

## Next exact setting — Medium, no native scope

**GPT-6.1 Sol Medium.** Difficult reproduction/correction is complete. Verify exact
source38 CI, public package/spaced extraction and source-only records:

1. Coordinate one writer; inspect branch/dirty state/current checkpoint, run new38
   private verifier and acquire released lease. Preserve other-chat .gitignore
   /.checkpoint/ edit, prior generations/input/review and waiting automation. No steal.
2. Match exact implementation commit/tree (final/ignored handoff) to CI metadata and
   decoded logs. Separate4POSIX results, portable pure/skipped tests and integration
   failures. Source37's known Windows Image failure/bounds/native11/WSL gaps remain;
   no assertion/guard relaxation, speculative repair or rerun-until-green.
3. Anonymous exact-source clone; offline ignore-scripts npm archive/isolated cache;
   strict file/source/private/link/traversal/integrity/version/default/MIT checks.
   Include process-group-observation/reliability-probe/test and changed peer assets.
   Run meaningful packaged selected suites/validate/replay; no selected native plan.
4. Packaged describe/closed entry checks and fixed Node regressions only. No Codex/
   inference/install/config/trust change, input refresh, gate or native transport work.
   Save separate source-only verification records; keep sealed older files intact.
5. Checkpoint/upload/verify then stop before consequential work/drift. Do not redo
   source37 package/CI/research, old metadata classification or unrelated Windows work.

No restart/trust/install/removal/rollback action needed: nothing installed/activated.
Temporary fixture groups self-exited or were reaped by bounded owned-group cleanup
while identity was known; no owned background process/model task left by this stage.
No new worker/scheduler. Existing other-chat heartbeat is separate; coordinate before
another writer. Planner unavailable config/signals was recorded; no repair/dispatch/
Codex telemetry collector. Fresh account observation permitted ordinary usage;
per-task/API/context measurements remain unknown. Manual semantic packages retained.

[Development branch](https://github.com/HarryBurd33/claude-mods-for-codex/tree/codex/astra-groundwork).
Actual synchronized source38 commit/tree, private checkpoint and release are recorded
after non-force upload/readback in final/ignored handoff, never guessed here.

## Complete resume instruction

“I've switched to GPT-6.1 Sol, Medium. Continue from the verified source38 checkpoint
on codex/astra-groundwork. Follow docs/continuation/HANDOFF.md and ignored handoff;
verify exact source38 CI, packaging, closed entries and source-only artifacts.
Preserve installed31, approved settings/current preferences/unrelated entries, scoped
logging, parent model, human trust and Windows guards. Coordinate one writer; keep
all gates closed. No Codex, inference, install/config/trust change or native-input
refresh. Preserve the known unaccepted project-trust difference. Stop for High before
consequential source/security work or unexpected drift.”
