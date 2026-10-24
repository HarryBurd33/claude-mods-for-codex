# Source27 handoff — next GPT-6.1 Sol Medium

2026-10-24. Human switched to Sol High from4663912. The bounded failure/turn
contract review and useful default-off implementation are complete for their
stated scope. Remaining packaging/CI readback is routine. Stop for human
**GPT-6.1 Sol Medium**. Full93-capability product remains incomplete; macOS first,
Windows later. Do not start another Windows proof/package-only implementation loop.

## Read first

STATUS.md, REQUIREMENTS.md, current ARCHITECTURE.md/latest TEST-LOG.md,
DEV27-REVIEW.md and ../event-observation.md. NATIVE-DEV26.md, MACOS-ACCEPTANCE.md
and DELIVERY-PLAN.md preserve version-specific native results and broader gaps.
Read latest ignored root HANDOFF.md for exact private setup/logs/backups/final
notes checkpoint. Earlier nextHigh failure-contract instructions are historical.

## Verified checkpoint and runnable state

Repo https://github.com/HarryBurd33/claude-mods-for-codex
Branch codex/astra-groundwork.
Runnable public/local source commit:
[7d94c34565d72c32edb62ee23eebb52740dc02cb](https://github.com/HarryBurd33/claude-mods-for-codex/commit/7d94c34565d72c32edb62ee23eebb52740dc02cb),
treeaef171d890b2be0c3bd6002a0789b6a9c2985456, parent46639123af21237ed1ed66df996077b5f61363d8.
Expected-parent/nonforce upload, fetched full-tree equality, connector ref and
anonymous public ls-remote matched. Equivalent local87c1a181b55e878040c019e2a69ba6418f157a81
retained on codex/dev27-high-source-local-checkpoint before aligning identical tree.
No force push, lost commits or private-root handoff upload. This final notes
checkpoint's identity is read back after upload in reply/private handoff; it
preserves the runnable source/test tree except documentation.

Node24.22.0/npm11.19.1/macOS14.6. Previously measured standalone CLI0.163.0;
latest stable0.164.0 release re-read2026-10-24, no upgrade. Desktop bundle previously
26.1021.22027/build21747/panel host chatgpt; exact running bundled runtime not
independently attested. Native26 evidence does not certify new27 code/UI.

## Completed / partial / unverified

- Primary released contracts resolved: no PostToolUseFailure in reviewed CLI163/164
  interface. Registry uses output logging-success; exec sets true regardless of
  exit, supplies text-only terminal response, skips a post payload for live process.
  Invocation errors can bypass PostToolUse. Registry/context163/164 byte-equal.
  Stop is a stopping opportunity, Interrupt separate. Exec JSONL has status/exit/
  turn.failed/error, but interrupted turn shutdown may omit a terminal record.
- Useful supported-source approximation implemented: explicit private export
  observation, independent of live hooks and usage selection. Numeric fixed record
  counts/status only, never text scraping/missing-post/cancellation inference.
  No raw content/IDs/paths/usage returned, journal/state format change or model call.
- CLI, read-only no-argument MCP tool, separate runtime opt-in and owned Access and
  usage outcome table. Three defaults and installed scope unchanged. Activity/Watch
  never read/poll exports. New file IO refuses Windows before options/path access;
  settings existing before-IO Windows refusal unchanged, no helper/gate change.
- Optional turn observers still off/unregistered. Busy/config-failure/default-off/
  scope/privacy subprocess checks pass and always return{}. Example Interrupt/
  SessionEnd timeout5→3 matches docs. No automatic continuation/block/approval/retry.
- Automated tests pass for parser/status/exit/turn distinctions, malformed/bounds/
  privacy/links/cancel/read-only, service/settings grants and simulated accessible
  literal UI table. Copied-source synthetic file-change barrier refuses summary;
  it is not hostile-race/native proof. All93 identities/order preserved.
- Source27 package/extraction/loaded host/optional native events are unverified.
  Native nonzero vs invocation error/cancel/Stop/Interrupt remain distinct gaps.
  Visible start/resume/reset, full accessibility/close-pending, loaded disable/
  older rollback, themes/routing/current context/broader authoring/platforms remain.
  No separate client/private app patch or permanent impossibility claim.

## Exact code and contracts

src/observations.mjs: summarizeExecObservations(text), readSelectedObservations
(path, options). JSON-only single thread header,1MiB/4096lines/256KiBline/i32-or-null
exit. Return fixed turns{started,completed,failed,streamErrors},
commands{completed,failed,declined}, exits{zero,nonzero,unavailable}, streamStatus,
ignoredRecords, cancellation=unavailable, semantics/limits. Status and exit buckets
overlap, duplicate records count twice. Private regular canonical one-link owned
POSIX file and pre/handle/post metadata samples; AbortSignal/fatal UTF-8/fixed
unavailable on unsafe/change/cancel. No source-authenticity or malicious same-user
sandbox claim. Whole bounded raw file is read in memory only by explicit selection.

src/cli.mjs observations --export PRIVATE_JSONL is immediate local callback.
src/runtime-settings.mjs observationExport is a separate optional path outside
selected project. Existing usageExport never grants observation access.
src/server.mjs mods.observations has no arguments, read-only metadata; dashboard
field read only on dashboard request. ui/dashboard.html renders separate table
on Access and usage refresh, not Activity Watch. App/server/manifest/packagev27.

examples/exports/observation-synthetic.jsonl is original synthetic failed print/
turn data, not native evidence. Copy to a private outside-project file for reader
use. examples/hooks/observe-lifecycle.json is review-only; select individual events
explicitly, never enroll all seven automatically. test/observations.test.mjs,
observers.test.mjs, rendering.test.mjs; portable CI adds new before-IO guard test.
Default hooks, dispatcher/config/mods/state/journal/retention/windows runtime untouched.

## Commands actually run / observed results

- Initial targeted observations/observers/usage/dashboard:18pass/0fail/2skips20total.
  Expanded contracts/rendering:40pass/0fail/2skips42total.
- npm test first216pass/0fail/110Windows-only skips326total; final217pass/0fail/
  110Windows-only skips327total,7.1seconds. No source-milestone test failure.
- npm run validate3mods valid; npm run replay4fixture responses unchanged.
- Final source UI version-only string correction: rendering/package11pass/0fail/
  0skip. Prior new parser/UI focused13pass/0fail/1skip14total. No broad suite repeat
  solely for notes/metadata. git diff --check clean.
- Preservation: installed26cache210byte-equal configured fixture; settings SHA
  unchanged; default hooks/source Windows runtime/storage/gates unchanged. No
  native run/config/install/trust/export selection/production write in this stage.
- [CI40131377115](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40131377115)
  tests exact7d94c34. Last snapshot: portable120983614660, Ubuntu24120983614789,
  macOS24120983614817, Ubuntu22120983614885 completed success; counts not decoded.
  macOS22120983614945 and Windows22120983614841/24120983614939 in progress.
  No all-green claim; Medium must read completed logs and final conclusions.

Previous CI40128013186 both Windows storage lanes had25storage passes and84of85
process proofs: mandatory real cmd/git image positive refused before bytes,
post-refusal linkcount2 versus original one-link guard. Failure/assertion preserved.
No image hash/import/version/execution/native Windows11/WSL acceptance. All settings/
project/Git/restore/retention production Windows gates remain closed; no more Windows
investigation next. Native Windows host unavailable last asked; no repeat question.

## Installation / configuration / rollback

No source27 installed. Human-reviewed immutable26 stays selected and210files match
fixture. Existing project/data/usage export/scope/trust unchanged; new
observationExport absent, optional observers off. Private backup paths and exact
settings hash in ignored root handoff. No data cleanup or new selected export.
Latest one-run grant from26 is consumed; **no additional model/API run authorized**.
No active observer/native test child/background scheduling from this stage.

A later supported immutable same-ID update must be prepared/reviewed first,
preserve unrelated entries, complete human trust if required and restart/check
loaded snapshot. Optional event reception AND event storage need explicit human
selection, separate from ordinary model-run authorization. Do not add these merely
to make activity rise. No trust-hash/cache edits or auto-trust generated code.

No current rollback needed. To stop later export reads, remove only
observationExport then supported reload/update; CLI stops when not invoked.
For optional hooks remove only chosen storage names/registrations through reviewed
update. Keep data unless separately selecting explicit retention cleanup. Existing
immutable26/10 selective same-ID rollback sources preserved. Never whole shared
config restore, cache replacement, system ACL repair, live-lock reaping or automatic
cleanup/retry. Supported lifecycle/older-version rollback acceptance still pending.

## Next tasks / exact setting / human actions

**GPT-6.1 Sol Medium.** Demanding source/contract work is complete for this bounded
milestone; routine readback, packaging and review preparation do not justify High.

1. Read exact40131377115 final jobs/decoded logs. Record POSIX217/Windows-only skips
   if observed; verify new portable Windows refusal actually ran. Preserve known
   Windows failure. A new correctness/security issue requires High checkpoint;
   never weaken assertions/guards or retry into a false pass on Medium.
2. Verify anonymous exact public source and npm archive/spaced-path extraction,
   versions/MIT/default-off selections/no private files/proof-production separation.
   Exercise new read-only CLI against a private copy of the synthetic fixture.
   Reuse existing full suite evidence unless new code/failure warrants rerunning.
3. Prepare concrete immutable source27 access/review diff and native acceptance
   steps. Keep installed26 and existing settings untouched while packaging. New
   export selection and selected optional events must come from the human; no
   fallback to previous private test log or automatic enrollment. Ask only after
   the exact reviewable change is ready, with review/trust/restart steps precise.
4. Continue macOS acceptance where routine/authorized: new table using selected
   synthetic fixture and loaded snapshot, optional turn events only after explicit
   selection/review, bounded extra run only after fresh usage authorization. Do
   independent read-only work while protected actions pending. No synthetic writes
   to production journals or deletion. All native result categories stay separate.
5. Save/upload/full-tree/independent-ref verify and stop for High before new
   consequential code/security/gated Windows work. Stronger reasoning is not a
   reason to continue while only waiting for CI or human review. No subagent,
   automatic switch, background work or scheduled continuation after stop.

## Complete copy-and-paste resume

I've switched to GPT-6.1 Sol, Medium. Continue from the verified source27 handoff
checkpoint on codex/astra-groundwork. Read docs/continuation/HANDOFF.md,
DEV27-REVIEW.md, STATUS.md, REQUIREMENTS.md, ARCHITECTURE.md, latest TEST-LOG.md and
docs/event-observation.md, plus the latest ignored root HANDOFF.md. Read CI40131377115
and verify exact source27 packaging/spaced extraction, then prepare reviewable
macOS native acceptance. Preserve installed26, logging scope, human trust, old
usage selection, all93 requirements and Windows guards/known failed image check.
Do not opt into observationExport or optional event reception/storage automatically;
prior native-run grants are consumed. No extra model/API run or production cleanup
without its required fresh authorization. Stop for High before consequential code,
new correctness/security fixes or deferred Windows work. Save/upload/verify progress
before any human-controlled model-switch stop.
