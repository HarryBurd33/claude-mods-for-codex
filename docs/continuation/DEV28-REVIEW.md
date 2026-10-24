# Source28 component authoring review — 2026-10-24

Human resumed GPT-6.1 Sol High from verifieda2f76b4 on codex/astra-groundwork.
This implements the bounded AUTHORING-NEXT objective. Full93-capability product
remains incomplete. Installed human-reviewed27/logging scope/trust are unchanged;
source28 is not installed or natively accepted. No additional model/API run.

## What changed and why

The prior scaffold still supports notice/deny/replacement unchanged. New POSIX
commands scaffold-component, validate-component, replay-component and component-plan
create/inspect disabled data-only observer/status/activity bundles. An activity
bundle pairs a lifecycle observer with a retained-event table inside the existing
owned Activity view. It is not a standalone plugin/client, arbitrary UI/code
generator, immediate native slash callback or host-chrome replacement.

User experience/contract/commands are in [component-authoring](../component-authoring.md).
Existing reviewed hooks/official-host MCP App and event/schema evidence remain in
CODEX-CONTRACTS/NATIVE-DEV27. This stage adds this repository's own extension
contracts, not a new native host API. No upstream proposal/schema-only capability
claim, client upgrade/private patch or license/code copying.

## Important architecture/security decisions

- component-contract.mjs: strict version1 plain-data schemas, original observer/
  status/activity specs; independent reception/retention/display booleans start
  false.1–7 known optional lifecycle events; status1–8 known events; name48/title96
  UTF-16 code units, controls/bidi formatting rejected. No path, command, module,
  script/HTML template, model, API or permission fields. No accessors/custom-array
  prototypes. At most8 unique runtime status definitions. Immutable validated data.
- Proposed lifecycle registration uses only the existing fixed bundled Node
  dispatcher, timeout3s for Interrupt/SessionEnd and5s others. Empty registration
  while off. Access reports potential full host envelope in memory, fixed local
  callback execution and event/time metadata writes; it is not an OS sandbox.
- **Independent storage allowlist:** legacy metadataState.enabled also enables
  default-event retention; a global authored-storage boolean could activate dormant
  legacy selections. New componentObserverEvents explicitly grants only named
  optional-event retention, independent of core enabled and legacy observerEvents.
  Dispatcher ORs the two explicitly selected paths, projecting one event-only
  record per delivery, not duplicates. Existing configs without the new list retain
  old semantics. No new event names, state/journal format or Windows helper change.
- Plans add only componentObserverEvents when retention is selected; never change
  core enabled/scope or dormant legacy selection. Merge unions chosen authored
  names, one dispatcher per event, preserving other components. Shared capture may
  serve multiple components; disabled intent does not attest global native inventory.
  Base scope/data still requires an explicit reviewed owner selection.
- Status is inline reviewed runtimeSettings.statusComponents, no new file path or
  export access. mods.status takes no arguments, reads only existing selected state
  if a display is enabled; all-off avoids IO. Activity decorates its existing
  snapshot without another read/watch. Rows/totals are selected retained deliveries,
  not success, unique turns or producer health. Missing source/invalid count/
  overflow is unavailable; absent events in available retained data count0.
- UI uses existing literal text/table primitives, bounded8components/8events with
  row headers. Unavailable Activity can still show unavailable authored counters.
  No new native panel/tab, network/library/eval/HTML sink or persistent UI state.
- component-authoring.mjs: new private canonical POSIX output only, exclusive
  creation/0600files/0700dirs, no overwrite/automatic cleanup. Fixed filenames,
 32KiBfile/128KiBbundle bounds, no links/hardlinks/special files/broad modes; samples
  identities and file content metadata. All validation before output creation.
  Files plus marker hashes written with exclusive no-follow handles; bundle.json
  last. Partial generation is retained for inspection, cannot validate/replay/plan.
  Marker is consistency/completion, not authenticity/trust. Not crash atomicity,
  hostile same-user/admin sandbox or OS syscall wall-time guarantee.
- Bundle loader requires exact known filenames/template-derived contents and
  marker hash, private ownership/modes/canonical identities/stable files/UTF-8.
  Validate using the same reviewed generator format. Extra/tampered/partial data
  refuses; no custom executable component loading. Intent is a separate private
  copy outside bundle and changes only activation booleans. IDs/titles/events
  require regeneration. Replay returns only fixed relative fixture labels, empty
  responses and event-only synthetic projections plus explicit synthetic summary.
  It never executes fixtures, reads/writes production state or applies a plan.
- **Windows:** every new authoring IO entrypoint and CLI route refuses before
  argv/options/spec/path inspection. Existing settings early refusal, helper/
  authority/storage/project/Git/restore/retention guards unchanged. Pure contracts
  are portable; no Windows private-output or native host claim. Legacy scaffold
  remains unchanged; no POSIX mode-bit privacy claim for it on Windows.
- Source version28 in manifest/package/server/UI; skill updated with actual feature
  detection, two routes, usage/permissions/limits and explicit review. No skill
  policy/agent metadata changed, automatic trust or independent model invocation.

## Actual verification

Node24.22.0/macOS14.6 source tests. Initial focused32total:30pass/1fail/1Windows
skip. Failure was the new status test passing an incomplete factory settings object
instead of the valid session-scope-with-missing-session case; existing factory
assumed validated settings and attempted an invalid scope. Corrected the fixture
to represent actual unavailable-session behavior, no production guard relaxation.
Expanded scope/data/DOM checks then33total32pass/0fail/1Windows skip.

Full suite339tests **228pass/0fail/111Windows-only skips**,7.1s on final structural
validation after private-array hardening. Final fixed relative fixture-label output
refinement has related19tests18pass/0fail/1Windows skip; malformed/control labels
asserted through actual CLI. No repeated broad suite solely for docs/labels.
Validate3mods/replay4legacyfixtures unchanged. node syntax checks/diff check passed.

Meaningful coverage: independent switch combinations; unselected/dormant/default-
event non-capture; unchanged legacy and overlap-once behavior; selected-scope status
isolation; no state creation/read while display off; unavailable/zero/overflow;
malformed/unknown/accessor/custom prototype/bounds/field-injection; CLI path-option
rejection; links/hardlinks/private modes/extra/tampered/traversal/oversized files;
maximum8event bundle; collision no overwrite; preserved disabled originals and
read-only plans; literal accessible simulated UI/bounds/unavailable fallback.
Copied-source fault before marker leaves partial artifacts and refuses load/retry;
not all crash/race proof. Actual Node hook subprocess with synthetic Stop wrote
only event/recordedAt; disabled core and dormant Interrupt wrote nothing. No native
Codex event/source28/UI assertion from subprocess/VM tests.

Two source-CLI demonstrations privately copied the original public turn-weather
and tool-deliveries specs: generate, validate, disabled replay, separate temporary
intent replay and access/plan. Both synthetic summaries total5; originals unchanged.
No installation/registration/runtime setting/event storage grant or fixture command
executed. These temporary offline intent booleans do not enable the actual host.

Skill quick_validate.py was attempted with system and configured bundled Python;
both lacked PyYAML, so the helper is unavailable, **not passed**. No dependency
install/system repair. Required name/description/frontmatter/routing/reference
content manually inspected; existing package metadata tests and source CLI workflow
provide separate evidence, not independent model/skill-behavior evaluation.

CI extends the portable Windows job with component contracts and actual before-IO
guard test; POSIX IO cases skip there. CI has not been read for28 yet. Preserve
existing mandatory Windows real-image failure and all assertions. Earlier27 CI
had four POSIX217passes/portable success and both Windows storage jobs25storage
passes/84of85process proofs; installed-image Image refusal/links2 before bytes.
No new image read/hash/import/execution or native Windows11/WSL claim.

## Installed setup and next Medium acceptance

Installed27 still217byte-equal reviewed candidate; authorized settings/old usage/
synthetic fixture unchanged, optional events off. Actual service Activity remained
7/same revision in the original selected scope. Current chat is outside that child
capture; no logger expansion, synthetic production writes or data cleanup. No
agent trust/config/cache write, separate model run or background watcher/child.
All earlier extra-run grants consumed. Exact private proofs/backups stay ignored.

Next **GPT-6.1 Sol Medium**: read exact source28 CI, verify anonymous public package/
archive/spaced extraction/defaults/MIT/no private files/proof separation. Preserve
installed27. Prepare a concrete **display-only** authoring/native review using the
tool-deliveries bundle against existing authorized metadata. No observer reception/
retention required for that proof, no new path/export/capture or separate model run.
Obtain explicit display selection/source review and supported immutable update,
human changed-hook trust/restart before native28 claims. New dispatcher/config code
must be included in that review. Broader observer native delivery needs separate
chosen events/retention and harmless authorized trigger; no reuse of old grants.

All93 IDs remain; source28 is a useful bounded authoring milestone, not arbitrary
component support or completed product. Native failure/cancel/optional events,
full accessibility/lifecycle/disable/older rollback/themes/routing/context/platforms
remain incomplete. Medium stops for High before new correctness/security fixes or
consequential source work; no further deferred Windows investigation. Disable/
rollback steps and no-automatic-cleanup limits are in component-authoring.md.
