# Stop-only isolated lifecycle acceptance proposal

2026-10-26, GPT-6.1 Sol High, resumed7eff539. **Review/offline artifacts only.**
No Codex/app-server invocation, model run, installation, native config/trust write,
native-input refresh, runtime implementation or gate opening. Installed31 unchanged;
source38 is uninstalled. Native Stop acceptance remains **blocked/unverified**.

## Decision and intended experience

Propose a single **project-local command hook** in a fresh disposable macOS project,
reusing an immutable reviewed public source snapshot of the existing dispatcher.
Separate Stop-only configuration and private data stay outside that project. The
human later reviews the exact command/source/dependencies and native hook trust;
one separately authorized harmless turn could produce minimal Stop delivery metadata.
Inspect it read-only with the existing state API, without pointing the production
panel at test data. No display component, addon plugin, production update, extra
MCP server, shared marketplace identity or new transport is needed.

This is an official-client project-hook extension proposal, **not an installed
plugin-owned pane, companion app, custom client or patched application**. Existing
installed31/three hooks/approved settings retain their separate identity and scope.
No deployed candidate or runnable native plan exists. Inert placeholders/JSON below
are not installation instructions or permission to activate.

## Primary evidence retrieved and release limits

The [official hooks page](https://learn.chatgpt.com/docs/hooks), retrieved2026-10-26,
describes project-local hooks and human trust. Matching sources are additive. Stop
accepts JSON; a blocking response can cause another turn. We choose synchronous
five-second handling with `{}` output. Plugin variables must be supplied explicitly
for a project command. [Packaging guidance](https://developers.openai.com/plugins/build/plugins)
separates local marketplaces/project enablement and human trust; we avoid changing
those production settings by proposing a project hook instead.

Pinned releasedCLI164 source `6aaac694803004a63c6f393d153c96d22521a6b9`:

- [Stop parser/aggregation](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/events/stop.rs):
  receives assistant text/IDs/paths in memory; recognizes continuation/control
  output. Empty JSON has no continuation effect from this observer.
- [Discovery/trust/timeout](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/engine/discovery.rs):
  active config layers feed hook discovery; project source is non-managed, timeout5
  is valid. Ordinary config-hook trust hashes the normalized declaration. It does
  **not** get the plugin bundle-content verification attached to plugin sources.
- [Plugin trust](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/engine/plugin_trust.rs):
  plugin execution separately checks content. Do not transfer that guarantee to this
  project-hook proposal. Referenced source/config/Node must be reviewed and pinned
  separately before any future test; hashes alone are not author trust/confinement.

These are documentation/source corroboration, not fresh client inventory or native
execution. CLI164 was previously observed by source32; desktop/internal-server version
remains independently unverified. Additional registry/declarations source retrieved
for navigation, not used as proof of project runtime acceptance. No inaccessible
source is counted as reviewed; no new unavailable-source blocker arose this stage.

## Exact existing contracts and inert review fragments

Existing authoring spec, generated as a private disabled bundle:

```json
{"name":"stop-only-review","kind":"observer","events":["Stop"]}
```

Base has reception=false/retention=false, no status component, empty registration/
retention/runtime-settings plan. A separate **review intent** may toggle only the
two booleans; it is not installed or trusted. Existing componentPlan selects only
Stop, timeout5 and the fixed bundled Node dispatcher. Its `${PLUGIN_ROOT}` command
assumes plugin environment: **do not copy it unchanged into a project hook**.

For a later expressly reviewed test, proposed config is:

```json
{"version":1,"mods":[],"metadataState":{"enabled":false,"scope":"session","observerEvents":[],"componentObserverEvents":["Stop"]}}
```

This file is retained only as inert `.json.txt` review data. It is not production
configuration. No ordinary journal, core lifecycle event, dormant legacy observer,
status field, raw export, pending-call policy or automatic follow-up is enabled.

Project registration template: one Stop command, no matcher/async/additional context,
timeout5. Its unresolved command binds **only that child process** to four reviewed
values: PLUGIN_ROOT (immutable public source), CODEX_MODS_CONFIG (separate Stop config),
CODEX_MODS_PROJECT_ROOT (fresh disposable project), CODEX_MODS_DATA_DIR (separate
private test data), plus an absolute reviewed Node executable. The inert template
contains no actual selected machine paths. A future exact command must safely quote
all paths; never interpolate user/model text. No env-file or global env change.

The public snapshot has default storage off; the explicit test config is still
mandatory. Do not use production config/settings/data paths or edit an installed
cache. Preserve source/hash evidence and refuse if any reviewed dependency changes.
Project declaration trust alone does not detect changes in referenced files. No OS
immutability or hostile same-user/admin resistance is claimed. Native hook processes
have local-user authority distinct from model-tool sandbox permissions and may inherit
host environment; implementation reads only its declared variables, not credential stores.

| Reception intent | Retention intent | Planned registration | Runtime storage if Stop arrives by another source |
| --- | --- | --- | --- |
| false | false | none | none |
| true | false | Stop only | none |
| false | true | none | Stop metadata may be written |
| true | true | Stop only | Stop metadata may be written |

Reception is a registration choice, **not a runtime capability filter**. The
synthetic component replay requires both flags to project a record, but runtime
retention is independently effective on an event delivered by another source.
No status selection is proposed; displaying counts never grants capture.

## Scope, privacy, retention and acceptance limits

- Fresh canonical project `P`, immutable source `S`, private config `C` and private
  data `D` are separately selected. `C`/`D` are outside `P`; none is production data.
  Existing data/symlink/collision/current trust must be inspected only under a future
  narrow authorization. No such native paths/configuration were created/refreshed here.
- Current project matching includes descendants of `P`. `scope:session` chooses
  separate hashed state buckets for native event session IDs; it does **not** reject
  every other session in `P`. Use the root exclusively for one test session and remove
  the hook before reusing it. If exact one-session reception is required, this existing
  lane does not provide it; do not silently implement a new filter in this proposal.
- Full Stop envelope, including possible assistant text/IDs/paths, enters callback
  memory. The observer outputs `{}` and stores only recordedAt/event. Scope directories
  are hashed identifiers, not anonymization. No transcript path is opened; raw input,
  commands, prompts, responses, model/turn/session IDs or permissions are not journaled.
- Existing private storage bounds remain: up to64scope buckets; journal rotation at
 1MiB with two retained files per bucket. No new retention schedule/cleanup operation.
  Busy/invalid config returns empty JSON with fixed diagnostic. Malformed envelope
  exits1 with no stdout/fixed invalid-input message; it is failure, not a successful
  observation. No observer block/continue/approve/command/model output in any case.
- Parent/sibling project events are excluded before data creation; descendants are
  included. A single fresh retained Stop record would prove delivery in that setup,
  not unique successful turns, failure/cancellation coverage, session completion or
  continuous health. Duplicates/count absence stay explicit, never inferred outcomes.
- Offline sanitized Node environment differs from native inherited environment;
  no native network/process-confinement trace was taken. Local callbacks add no model
  call; the future native model turn would consume account usage. No free-product claim.

## Closed gates and exact future decisions

| Gate | Current result / required future step |
| --- | --- |
| Design agreement | Accepted by human2026-10-26 **design only**: project-hook lane with referenced-content trust/descendant/session-bucket limits. Every execution gate remains closed; [verification/decision record](STOP-ONLY-VERIFIED.md). |
| Native launch/startup | **Blocked.** Existing source37/38 startup/remote-ingress boundaries remain unresolved; no safe new launch path is established. Do not assume an ordinary CLI run is exempt or repeat the blocked investigation under another name. A revised execution envelope needs separate High review and human agreement. |
| Effective hooks/permissions | Unrefreshed. Other global/managed/plugin hooks remain active; no exact-one-turn/tool-free guarantee from our empty output. Any future narrowly authorized inventory must preserve other trust/permissions and stop on uncertain effective behavior. |
| Native install/config/trust | Closed. No `.codex/`/marketplace/native config written here. Future project trust and exact hook review are human actions, not hash writes or a bypass flag. |
| Model run | Closed. Existing grants consumed. No prompt/session/child/approval action. |

After the gates are resolved, a **draft request only** could select one new ephemeral
read-only CLI session in `P`, explicitly GPT-6.1 Sol Medium, with prompt “Reply exactly
STOP_PROBE_DONE. Do not call tools, spawn agents or continue after that response.”
One user turn requested, zero tools intended, max90seconds/2MiB local output, no retries,
stop on approval/unexpected tool/continuation/error. Other hooks could still cause more
requests before observation; no exact billing/cancellation guarantee. No executable
argv, current input binding or native plan is prepared. Do not send this prompt now.

## Future setup, update, disable, removal and rollback — not executed

1. Obtain design/native-launch-scope agreement first. Later review exact immutable
   source/Node/config/data/root/command hashes and collisions; preserve exclusive
   private backups. No source/model/permission/trust default may be changed silently.
2. Only after separate config authorization, stage one owned Stop definition in the
   fresh trusted project's supported `.codex/hooks.json`; do not merge the seven-event
   example or update installed31. Human reviews project trust and only the new exact
   hook through `/hooks`; no model prompt yet. Changed source/dependencies need review.
3. End/restart/reopen the affected test session as required and separately verify
   fresh discovery/effective configuration under a fresh narrow grant. Discovery is
   not delivery; trust a changed definition only through human review. No hot reload.
4. Only with a distinct bounded usage grant, perform the reviewed native test and
   inspect only its explicitly selected state. Do not attach its export/data to the
   production panel or infer a match from a shell tool's workdir.
5. Disable/remove only this unchanged owned Stop definition or its newly-created
   hooks file; preserve all other entries. End/restart affected test host and verify
   absence before claiming revocation. Loaded connections may outlive config removal.
   Retain test data by default; deletion is a separate explicit scoped choice.
6. Rollback restores only an exact unchanged backed-up owned definition through
   supported configuration/human trust review. Never restore an entire user config,
   copy trust hashes, adopt unknown project trust or delete/reap locks. Newly created
   project-trust bookkeeping remains a separately reviewed user choice.

No removal/rollback is needed now: only ignored inert bundle/templates and offline
synthetic state were made; temporary replay data was removed. Installed31 remains
usable. [Observed offline results](STOP-ONLY-OFFLINE.md). Next Medium verifies exact
artifacts/publication only; native Stop/full93/nativeWindows acceptance incomplete.
