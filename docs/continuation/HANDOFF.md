# Source26 handoff — next GPT-6.1 Sol Medium

2026-10-24. Human selected Sol High from verifiedc234d5c and authorized scoped
retention implementation. macOS acceptance first; Windows later/incomplete.
This runnable source26 milestone adds POSIX selected-scope preview/explicit
cleanup; no installed production data was cleaned, no logging/trust change.
Full93-capability product incomplete. Installed human-trusted dev10 preserved.

## Read first

STATUS.md, DEV26-REVIEW.md, ../retention.md, MACOS-ACCEPTANCE.md, MACOS-BATCH.md,
REQUIREMENTS.md, DELIVERY-PLAN.md, current ARCHITECTURE.md and latest TEST-LOG.md.
Read latest ignored root HANDOFF.md for exact final checkpoint/private evidence.
PACKAGE-DEV24.md is last completed package check; source26 packaging outstanding.
DEV25-REVIEW.md preserves the Windows blocker. Older next-model/Windows directions
are historical and do not override macOS priority or this handoff.

Repo https://github.com/HarryBurd33/claude-mods-for-codex
Branch codex/astra-groundwork. Startc234d5c7e6f3bc85ae1bb60b0e750034daa750d4,
tree9a9534134bcf4a39a2b7844916a62cb039a9beb2. Exact new source/final checkpoint
and CI evidence are recorded after actual remote readback; no self-hash claim.
Verify local HEAD/ref before work. No force-push or overwritten user history.

## Uploaded code and CI handoff snapshot

Runnable source [b66f2fbdaeaaca5b350ecb229b769b90a0da675e](https://github.com/HarryBurd33/claude-mods-for-codex/commit/b66f2fbdaeaaca5b350ecb229b769b90a0da675e),
tree41e60bcaa33c4c5a00a6b015dcf205920e4e5d2f, expected-parent/nonforce uploaded.
Fetched full-tree equality and independent connector/anonymous public ref matched;
equivalent local062d51f95de5f96636efd8d936343db647701642 retained on named backup.
[CI40128013186](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40128013186)
was in progress when this handoff snapshot was made. Actual decoded completed logs:
Ubuntu24job120973491527, Ubuntu22job120973491569, macOS24job120973491589 each
208pass/0fail/109Windows-only skips317total. New retention/actual-CLI/interruption
checks passed there. Windows portable retention before-IO step concluded success
(counts not decoded yet). macOS22job120973491548, Windows22job120973491585,
Windows24job120973491304 and portablejob120973491662 were still in progress in the
last snapshot. This is not an all-green CI or new Windows storage/host claim.

Remaining CI readback and exact packaging are routine **Medium** work. Read the
run/decoded logs first; a new correctness/security failure needs a human High
checkpoint, not weakened assertions/retries or an attempted Medium runtime fix.
The old unchanged Windows image failure remains explicit even if its new lane
result has not finished. No further implementation investigation is required to
justify keeping High selected while waiting for routine evidence. Final notes-only
checkpoint identity is read back after upload in the reply/private handoff.

## Implemented contracts and code

- src/retention.mjs: previewRetention/cleanupRetention/runRetentionCli. Private
  canonical settings path, existing reviewed project/session scope; no sibling
  discovery. Data root disjoint from project. Explicit real canonical UTC cutoff
  with milliseconds, not future. Windows refuses before path/option/IO access.
- Preview creates no directories/locks/plan. Two bounded journals only; reports
  retained count/bytes/oldest/newest/status, no paths/IDs/event names/content. Whole
  selected scope eligible only if every record precedes cutoff; empty eligible,
  absent no fingerprint, mixed age retained. Legacy/root-wide journals untouched.
- SHA256 conflict fingerprint binds settings location/identity/config, selection,
  cutoff, directory samples and exact file samples/digests. Not secret/human
  authentication/anonymization/native approval. Changed data/settings require
  new preview/review; no automatic retry or another model/API call.
- Cleanup exclusively creates existing global state and selected journal locks,
  no wait/steal/reap. Re-snapshot under locks, check fingerprint, reread settings,
  recheck directory/file identity before known-file unlink. Handles retained and
  buffers cleared. Empty-directory rmdir only; never recursive deletion or parent/
  sibling cleanup. Existing state writers serialize; future writes can recreate.
- Failure after deletion starts reports completed file removals/scope-removal
  status; inspect after stopping writers, no automatic retry. Kill can leave locks;
  never reap by age. Not crash-atomic/secure erasure/power-loss durability or OS
  confinement against hostile same-user/admin races. See user recovery limits.
- src/cli.mjs registers two immediate commands/help, no MCP/hook/UI writer.
  package/compatibility manifest/server version26; original state/journal/settings/
  Windows/project/restore modules and budgets unchanged. No optional hooks added.
- test/retention.test.mjs:20tests. Source-copy controlled fault/barrier cases are
  explicitly synthetic; no production injection option. .github/workflows/ci.yml
  adds Windows portable before-IO guard test (POSIX deletion cases skip there).

## Local commands and observed results

macOS14.6/Node24.22.0/npm11.19.1. No new Codex native/model/API run.

- Initial retention9pass/7fail/1skip: six message-prefix expectations and one
  directory mtime after our lock bookkeeping. Prefix made consistent; file identity/
  time/content and directory identity/entries still asserted, only directory mtime
  excluded for that lock-taking refusal. Next16pass/0fail/1Windows-only skip.
- After three additional fault/CLI cases: node --test test/retention.test.mjs
  test/state.test.mjs test/state-lock-budget.test.mjs test/state-contention.test.mjs
  37pass/0fail/2Windows-only skips39total.
- First full run207pass/1fail/109Windows-only skips317total. Interruption fixture's
  promise alone did not keep Node alive while parent descheduled; unsettled-await
  warning. Fixed fixture IPC listener before ready marker; no production/deadline/
  assertion suppression. Failure log retained. Retention19/0/1, full208/0/109.
- Canonical settings-path guard and targeted regression19pass/0fail/1skip; exact
  final source26 npm test208pass/0fail/109Windows-only skips317total. validate3mods,
  replay4fixtures, JS/diff-check pass. Node/OS subprocess evidence, not native host.
- Project/session isolation/others/index/HEAD/settings and no-create preview;
  age/confirmation/stale/replacement/settings/cutoff; links/FIFO/private/malformed/
  oversized/unknown entries; held locks; writer collision/new-event preservation;
  partial unlink/new-byte/new-file preservation; real CLI and killed owned child.
  All cleanup data is owned synthetic scratch. Never installed production records.

Actual CI evidence follows after upload/readback in DEV26-REVIEW/TEST-LOG/private
handoff; no future success implied. Known unrelated Windows image test unchanged.

## Installation, privacy and rollback

Installed human-trusted dev10:149files remain byte-equal reviewed immutable fixture;
private settings hash/selected child project/logging scope unchanged. Current chat
outside that logging scope. No config/cache/trust/retention/export/observer/theme/
client/model-selection mutation. No native UI call or model/API run in this High
stage. Source26 uninstalled/package-unverified; source24 last completed package.
No protected user action/restart or machine rollback required now.

Earlier read-only native batch: CLI0.163.0/macOS14.6, installed desktop app bundle
26.1021.22027/build21747; connected panel says chatgpt, exact running host/bundled
runtime not independently attested. Older observations stay version-specific.
New26CLI/prior changed state locks do not inherit installed10 host acceptance.

Root HANDOFF/raw logs/private paths/settings/synthetic logs ignored. Remove only
owned scratch after children exit. Never live-lock deletion, system ACL repair,
cache/trust patch, broad settings restore or automatic approval. Future installation
needs supported immutable update/access review and real human changed-hook trust.
No cleanup of installed production data authorized by this implementation milestone.

## Windows failure preserved, no work on it next

Source25 tested3ce44fc/CI40122363235: both Windows lanes25storage passes,
84/85process proofs; actual cmd Git image refused before bytes. New samplelinks2
violates unchanged one-link guard, not an atomic original-cause trace. No image
hash/import/version or candidate execution. Four POSIX lanes189/0/108skips.
Every Windows settings/dashboard/project/Git/restore gate stays closed. Native
Windows11/WSL untested, last unavailable; no repeated availability question or
alias/Installer/loader policy change. Source26 new command Windows refusal is
separate evidence, not Windows cleanup/native compatibility.

## Next exact model and tasks

**GPT-6.1 Sol Medium**. Source/tree/ref verified; completed CI logs read as above.
Finish pending CI readback as routine work; do not keep High merely to wait.
Remaining work is routine packaging/docs and concrete native step preparation.
High before new consequential runtime/security/writer changes. Preserve macOS
priority; do not return to a Windows-proof/package-version-only loop.

1. Verify HEAD/ref; first read CI40128013186/decoded remaining logs. New correctness/
   security failure requires a human High stop; preserve the known old Windows
   image failure without restarting that investigation. Then exact source26 public
   clone/archive/spaced extraction using
   docs/packaging.md/PACKAGE-DEV24 workflow. Retention module/test/docs included;
   compatibility-only manifest/MIT/defaults/proof-production separation intact;
   no private handoff/log/config/link/traversal. No dependency install or scripts.
2. Run warranted exact-package CLI/retention tests on private synthetic data; no
   production cleanup. Keep original Windows failed positive/guard and all93IDs.
   Packaging does not certify native execution or make the full CI green.
3. Prepare a concrete immutable macOS snapshot/source+access diff if needed for
   remaining native acceptance. Installed10 is preserved until supported update
   steps and human changed-hook review are concrete; no cache patch/autotrust.
   Do not register optional hooks or broaden logging/data selection silently.
4. Prepare the next bounded native test plan for changed-state acceptance, visible
   SessionStart/harmless nonzero/success tool events/active Watch and chosen optional
   triggers. A separate model run needs fresh explicit bounded authorization; the
   previous grant was consumed. Human trust/restart stays protected. No blind
   production cleanup, destructive demonstrations, permission escalation or parent
   model/prompt rewrite. Direct CLI synthetic tests need no extra model call.
5. Remaining accessibility/close-pending/loaded disable/older rollback/themes/
   routing/current-context/broader component authoring and native platforms remain
   incomplete. Reuse only exact versioned unchanged evidence. Any consequential
   code needed to close a gap requires a human High switch first.
6. Save/upload/full-tree/independent-ref verify safe progress; stop for the exact
   human setting warranted by the next concrete task. No delegated/background/
   scheduled continuation or automatic model switch after the stop.

## Complete resume instruction

I've switched to GPT-6.1 Sol, Medium. Continue from the verified source26 retention
checkpoint on codex/astra-groundwork. Read docs/continuation/HANDOFF.md,
DEV26-REVIEW.md and docs/retention.md plus the latest ignored root HANDOFF.md.
Verify exact source26 packaging and synthetic CLI behavior, then prepare concrete
macOS native acceptance steps. Preserve logging scope, human trust, installed10,
unrelated data/all93 requirements and the deferred Windows guards/failed image
check. No production cleanup, automatic trust or additional model/API run. Stop
for High before consequential runtime/security changes. Save, upload and
independently verify the next checkpoint before a model-switch stop.
