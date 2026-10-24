# Author an observer and owned status component — source28

Source28 extends the existing notice/deny/replacement workflow with disabled,
data-only lifecycle observer and retained-event status components. It is a source
implementation, not installed/native28 acceptance. The reviewed installed27,
logging scope, trust, synthetic observation fixture and old usage export stay unchanged.

The component is part of the existing official-host plugin. A status title and
counter table appear inside its owned Activity view; this does not create native
host tabs/bands or change tool rows, dialogs, spinners or transcript rendering.
No arbitrary code/template loading, slash callback, separate client or model route.

## Describe and generate

The updated mod-scaffolding skill can translate a description such as “Show the
number of retained Stop and Interrupt deliveries as Turn weather” into:

```json
{"name":"turn-weather","kind":"activity","title":"Turn weather","events":["Stop","Interrupt"]}
```

The skill uses the selected model and consumes usage. Deterministic callbacks make
no additional model calls. Stop is a stopping opportunity, not a unique successful
turn; Interrupt is separate. Request broader/unavailable behavior explicitly,
rather than silently substituting this counter.

Kinds:

| Kind | Fields | Generated intent |
| --- | --- | --- |
| observer | name, kind, events | Separate reception/retention switches, both false |
| status | name, kind, title, events | Display switch false, no hook registration/storage selection |
| activity | name, kind, title, events | Paired observer and display using the same event list; all three switches false |

Observer/paired events are the seven existing optional lifecycle names in
constants.mjs. Status can filter1–8 known event names, including the three default
events, without subscribing to them. IDs are bounded lowercase names; titles96
characters, literal text with controls/bidi formatting rejected. No paths, shell
commands, export/model/API settings, HTML/JS templates or permission fields allowed.

Create an explicitly private mode0600 spec. From the verified package root:

```sh
node bin/codex-mods.mjs scaffold-component --spec /absolute/private/spec.json --output /absolute/canonical/new-bundle
node bin/codex-mods.mjs validate-component --bundle /absolute/canonical/new-bundle
node bin/codex-mods.mjs replay-component --bundle /absolute/canonical/new-bundle
```

Use the verified absolute CLI path from elsewhere. New authoring IO is POSIX-only;
Windows refuses before options/path access. No system ACL/cache/tool repair is needed.
Original scaffold/validate/replay commands and three legacy kinds remain unchanged.

## Bundle and offline review

Exclusive new mode0700 directory contains component.json, access.json, plan.json,
summary.json, REVIEW.md, synthetic fixtures and a last-written bundle.json marker
with file hashes. Files0600. Bundle is not a plugin: no compatibility manifest or
auto-discovered hooks directory. It registers/enables/installs nothing. Matching
fixtures cover each selected event; valid nonmatching and malformed cases also
exist. summary.json is explicitly synthetic and independent of replayed events.

Validation checks bounds, private ownership/modes, regular one-link canonical
files/directories, exact known filenames/content and hashes with the same reviewed
generator format. It refuses extra, changed or incomplete artifacts. Marker/hashes
are consistency checks, not authenticity, permission or human trust. Re-generate
after changing fields/format; do not repair hashes to bless a change. Generation
may leave partial output on error/interruption; no auto-delete, overwrite or retry.
These checks do not sandbox a hostile same-user/admin replacing paths, promise
crash atomicity, or impose an OS syscall wall-time bound. Input files32KiB each,
bundle128KiB total; no network API/process launch by authoring tools.

Disabled replay must produce no metadata/status and all hook responses{}. Malformed
input is invalid, not a control action. To test activation, copy component.json
to a mode0600 private file **outside the bundle**, change only booleans:

```json
{
  "version":1,"id":"turn-weather",
  "observer":{"reception":true,"retention":true,"events":["Stop","Interrupt"]},
  "status":{"enabled":true,"title":"Turn weather","events":["Stop","Interrupt"]}
}
```

```sh
node bin/codex-mods.mjs replay-component --bundle /absolute/canonical/new-bundle --intent /absolute/private/intent.json
node bin/codex-mods.mjs component-plan --bundle /absolute/canonical/new-bundle --intent /absolute/private/intent.json
```

Replay reads only validated synthetic bundle data: no journal/filesystem state,
fixture command execution, host calls, installation or trust. Both reception and
retention are needed to project synthetic event-only metadata for this proposed
pipeline. Display reads the explicit synthetic summary, not replay-created state;
default counts2/3 therefore total5 for this example. Missing source is unavailable,
not zero. Other host registrations may already deliver events; offline replay cannot
attest live inventory or global capture. ID/title/event changes require regeneration;
intent only activates booleans while preserving disabled original artifacts.

## Fresh plan and explicit merge

component-plan prints the current intent, actual requested access and three distinct
merge fragments. No command applies them. Review source/access and all additions:

- registration.hooks requests only selected fixed bundled dispatcher callbacks when
  reception is true; empty otherwise. Interrupt/SessionEnd timeouts3s, others5s.
- hookConfig.metadataState.componentObserverEvents requests only selected authored
  storage events when retention is true; absent otherwise. This list is independent
  of ordinary metadataState.enabled/observerEvents and cannot enable dormant legacy
  or default-event storage. If metadataState does not exist, explicitly choose a
  reviewed scope and disabled ordinary base `{ "enabled":false,"scope":"session" }`
  before merging the authored list. No path or scope is supplied by the component.
- runtimeSettings.statusComponents requests one inline, initially disabled bounded
  counter definition. No extra config file path/dynamic module loading. Enabled
  status reads only existing reviewed metadata scope through mods.status/Activity.

Merge only human-selected fragments, union reviewed authored storage names and use
at most one dispatcher registration per event. Preserve ordinary enabled/scope,
legacy observer choices, existing mods and unrelated status entries. Shared event
capture/registration may serve more than one component; removal is not automatically
global disable. Potential access is disclosed even when inactive: observer process
receives full host envelopes in memory (possibly assistant text/IDs), but stores
only event/time. Fixed callback executes bundled Node code with local process
authority, distinct from the model tool sandbox. No fixture/project command,
automatic approval/continuation, prompt/model change or extra model/API call.

Runtime permits at most8 unique status IDs, each1–8 known events. Selected delivery
counts only; zero means absent from available retained data, not idle/healthy.
Unavailable source/bad counter/overflow yields unavailable totals. Titles are
authored display data returned to the host/model; keep sensitive labels private.

## Install, verify, disable and rollback

This source does not update installed27. After a complete review, create an immutable
versioned package and use supported same-ID update, preserving other entries and
backups. Human must select new reception/storage/display settings, review changed
code/hooks and restart as required. Never write trust hashes/edit caches or claim
hot reload. Native event/model tests remain separate; an additional model/API run
requires fresh bounded usage authorization. Do not reuse older consumed grants.

For a status-only native acceptance, choose existing retained metadata and enable
only the authored display: no new event or capture selection is required. Optional
observer native acceptance requires selected event registration and retention plus
a harmless authorized trigger; synthetic replay alone is not native evidence.

Disable by removing only authored status entries and reviewed authored event names/
registrations no other component still requires, then supported update/reload. Keep
existing data and legacy choices. No automatic retention cleanup/lock reaping.
Rollback through preserved immutable source/owned marketplace entry and supported
same-ID add, inspect cache/trust/reloaded host; never wholesale shared-config restore.
Generated artifacts are private user-selected output; removal is a separate explicit
file action. MIT/independent-project disclaimer remain unchanged.
