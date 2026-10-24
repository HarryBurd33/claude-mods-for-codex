# Bounded macOS acceptance and next milestone — 2026-10-24

Human priority: finish macOS feature acceptance, then Windows. This batch starts
from c5bd658/source25 with human-trusted dev10 installed; it changes no runtime,
installation, logging, data selection, trust, theme or model configuration.
[All93 row assessments](MACOS-ACCEPTANCE.md) accompany this record.

Source26 High follow-up: BatchB's selected-scope CLI is now implemented and tested
on synthetic POSIX data; [DEV26-REVIEW](DEV26-REVIEW.md) records the exact contract,
failures/corrections and observed runs. No production cleanup or native update.
The BatchB text below preserves the accepted implementation criteria; next Medium
is packaging and concrete native acceptance-step preparation, not more Windows.

## Batch A — observed now, unchanged installed dev10

Target: macOS14.6, CLI0.163.0, Node24.22.0. Installed desktop app bundle
26.1021.22027/build21747 differs from the earlier26.1016.62342/build21477 records.
Actual running panel says connected to chatgpt; running host/bundled runtime
version not independently attested. Do not transfer old host-version assertions.

| Check | Actual action/result | Limit |
| --- | --- | --- |
| Checkpoint | Clean branch/HEAD c5bd658; connector ref independently matched | Final new checkpoint identity must be verified after upload |
| Native inventory | Bounded no-daemon app-server initialize/hooks/list/plugin/read: three enabled/trusted production hooks, zero errors, no model turn | Two default-sandbox invocations closed before inventory/cleanup permission failed (second was an unnecessary repeat while writing notes); reviewed elevated read-only inventory succeeded between them and its output remains retained. No trust/config change. Inventory is not event execution |
| Cache/settings |149 installed files byte-equal reviewed dev10 fixture; private settings hash and selected-project root unchanged | No installed25 claim; private paths/config evidence ignored |
| Activity | Actual mods.dashboard/activity and native table/chart show project scope/four events; same revision; producerHealth unknown | Current chat outside selected logging child; no new capture generated |
| View navigation | Actual owned Activity/Project files/Changes/Replay/Access and usage/Local preview loaded; aria-current follows selected button | Synthetic locator clicks, not native keyboard/VoiceOver. Three existing panel instances inspected; only one used for actions, others preserved |
| Selected project | Two existing fixture files/status/size displayed; synthetic working patch and two reviewed commit diff rendered with read-only/provenance labels | No file mutation, commit, selected-export change or project command; no arbitrary path choice |
| Usage/access | Selected cumulative export fields displayed; current context/exact billing/cache health unavailable; local process/model usage distinction visible | No extra model/API run; no billing/cache/occupancy inference; no independent network trace |
| Native local preview | Labeled Format changed to JSON; synthetic img-like text remained literal code. Clear emptied source. Original sample restored and rendered3nodes/2edges with complete tables | No model/tool/network calls asserted by unchanged source/automated tests, not a native network trace. Panel input only, no files. Restricted flowchart approximation |
| Focus | Native DOM after Render click: focused button outline3px/offset3px | Actual human keyboard focus acceptance remains the dated dev10 result; no new keyboard/screen-reader proof |
| Watch deadline | Checked Watch; at31,737ms sample it was unchecked, Refresh enabled, project/four records unchanged | Observation is an upper sample, not exact stop timing. No native event during Watch, no backend-close/cancellation measurement |
| Focused offline regression | node --test test/transport-ui.test.mjs test/rendering.test.mjs test/dashboard.test.mjs test/scaffold.test.mjs test/state-lock-budget.test.mjs test/state-observer-boundary.test.mjs:36pass/0fail/0skip | Source25 Node tests/simulated bridge, not Codex event delivery. No full suite repeated solely for notes |
| CLI | node bin/codex-mods.mjs validate:3mods; replay --fixtures fixtures:4fixtures, expected abstain/deny/notice | Replay executes no fixture command |

Private screenshot/log/inventory/preservation evidence is retained locally and
excluded from Git. Current source UI/skills/hooks/config/MCP bytes are unchanged
from dev10; state.mjs/new state-lock-budget.mjs differ and do not inherit native
acceptance. Default/optional hooks and all Windows gates remain unchanged.

## Batch B — next High milestone: selected-scope retention management

**GPT-6.1 Sol High**, before implementation. This is macOS maintenance, not more
Windows image/alias policy work. Source25 is not a finished release and the failed
Windows positive must remain visible.

Problem: EV-13/SEC-09 currently offer bounded retention and a library-only
pruneMetadataState(dataDirectory,{before}) in src/state.mjs. The CLI exposes report
but no inspection/cleanup flow; the existing prune function scans the selected
root's scopes. Exposing it unchanged could delete other scopes when the user
intends only the configured project/session. Never infer authority from readable
metadata or a hash directory name.

Desired experience: inspect retained metadata for the exact scope in an already
reviewed settings file, preview which age-bounded journals/scopes would be removed,
then explicitly request that reviewed cleanup. No raw events/commands/paths/session
IDs in output, no automatic scheduling, no active lock deletion, no source/cache/
settings changes and no implicit root-wide pruning. Preserve unrelated scopes and
user data. Scope is chosen by reviewed runtime settings, not discovered sessions.

High should first decide a small stable CLI/API contract and review the existing
POSIX lock/prune path. An explicit scope filter/fresh conflict check is required;
a dry run must not create a state root, scope or lock merely to inspect. Mutation
needs explicit confirmation bound to the selected scope and preview semantics.
Choose the smallest practical review mechanism; do not build a generic privileged
file deletion service. No MCP/panel writer or change to native tool permissions.
New Windows command behavior must refuse before IO until separately reviewed;
no Windows security implementation or gate relaxation in this milestone.

Acceptance:

1. Absent/default/unselected/private-invalid settings refuse safely without data
   creation or path disclosure; valid inspect is read-only and returns only bounded
   count/age/size/eligibility information with unavailable/retained semantics.
2. Two projects/two sessions with old/recent synthetic data: only the exactly
   selected eligible scope is proposed/removed. Other scope contents/metadata,
   settings, index/HEAD and unrelated files are unchanged.
3. No confirmation, wrong selection/confirmation, changed data after preview,
   live locks, linked/multiply-linked/special/unexpected entries or invalid ages
   refuse. Do not delete/reap a lock or retry an ambiguous removal automatically.
4. Keep bounds, permissions and acquisition deadlines. Concurrent append/prune
   cannot lose newly retained data; error/interruption/partial cleanup behavior is
   explicit and tested. High must review consequential refusal/cleanup paths.
5. Library/CLI fixtures use private throwaway data, including spaced paths. No
   cleanup of installed production records is authorized by this plan. Verify new
   POSIX behavior and Windows-before-IO refusal; preserve the unrelated failed
   Windows image acceptance test unchanged.
6. Validate/replay/package only as warranted. Update runtime/privacy/removal/ledger
   and help with exact usage/limits. Save a usable code milestone and CI evidence.
7. Only then prepare immutable macOS install/access diff and human review steps if
   live changed-state acceptance is necessary. No cache patch/trust write/automatic
   trust or reused model-run grant. Keep selected project/logging unchanged.

A code/security concern requiring Astra must be checkpointed and returned to the
human for that switch; do not delegate around model gates. Return to Medium when
only routine packaging/docs/native read-only verification remains.

## Remaining native acceptance after the maintenance milestone

- Optional hooks stay unregistered/off unless human explicitly elects specific
  events and storage; review minimal payload projection and exact release schema.
  New model-request/failure observation requires High contract/privacy review.
- One bounded selected-project run can combine visible SessionStart, harmless
  successful/nonzero covered tools, native event-during-Watch and chosen Stop
  delivery. Prepare exact code/events/usage/bounds first; request fresh human
  authorization for that separate model run. No subagent/routing test is included
  without its own bounded authorization; no destructive or escalation demo.
- Loaded disable/unload, older-version rollback/restoration and exact cache checks
  need a supported owned-entry plan, immutable prior/target snapshots and private
  selective backups. Human changed-code trust and restart remain protected steps.
- Format keyboard/VoiceOver/zoom/light-dark/forced-color/overflow and close-pending
  require actual host checks. MCP Apps synthetic clicks cannot prove native keys,
  screen-reader speech or backend process cancellation. Do not bypass app CUA limits.
- Themes/statusline/title need a compatible CLI and human settings selection.
  CLI163 remains installed; do not update it or mutate OS/appearance preferences
  silently. Recheck only the current primary API relevant to an actual next test.
- Context data/custom-subagent routing and broader component scaffolding stay
  incomplete; exact unknown values and supported-surface limits remain visible.

These are acceptance/implementation batches, not promises of one turn each. Full
product completion also requires later Windows/WSL/native-Linux work or explicit
reported blockers/unsupported alternatives under the user's completion criteria.
