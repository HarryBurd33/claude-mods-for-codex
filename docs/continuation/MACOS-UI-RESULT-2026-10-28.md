# Existing-panel UI batch: blocked before interaction

2026-10-28, human-approved [UI packet](MACOS-UI-PACKET-2026-10-28.md), keeping
human-selected Sol Medium and native permissions unchanged. **The expected panel
was unavailable for the batch. No native UI acceptance pass is claimed.**

One `mods.dashboard` call returned successfully with configured plugin-owned
dashboard metadata. This establishes a responding configured service, not a visible
panel or current installed-version identity. The supported MCP Apps browser listed
no inspectable panel tab in two observations. The human then reported:
“Panel is missing or different.” That response does not distinguish a missing panel
from an unexpected view, and it does not establish an uninstalled plugin or a code
defect. No additional dashboard call, reload or substitute installation was tried.

| Case | Actual outcome |
| --- | --- |
| UI-A1: initial expected empty Review desk | **Unverified**: expected panel and empty fields could not be established. |
| UI-A2: keyboard | Not run. |
| UI-A3: VoiceOver | Not run; no speech or screen-reader availability claim. |
| UI-A4: synthetic Notes feedback | Not run; no field contents entered or cleared. |
| UI-A5: zoom | Not run; initial zoom unknown, no agent zoom change. |
| UI-A6: equivalent Activity table | Not run. |
| UI-A7: Watch start/stop | Not run; zero Watch windows started. |
| UI-A8: close while watching | Not run. |
| UI-A9: quiet close/reopen | Not run; no reopen attempted. |
| UI-A10: final state | Final visible UI state unverified. No owned sample, Watch session or zoom change was created by the agent, so no such cleanup was needed. |

Backend teardown remains **unverified**. No live backend request was cancelled or
its termination inferred. No screenshots, transcripts or raw dashboard output are
published. Existing data/export selections, configuration, native permissions,
installation and trust were not changed by this batch. No native CLI, app-server,
model trial, install/update/removal or spent Phase1/Stop operation was started.

The approved packet explicitly requires stopping when the expected panel is absent
or changed. The human response also arrived after the packet's foreground window;
that does not extend execution authority or justify an automatic retry. All UI work
is stopped; no timer, Watch loop or ongoing test process was started by this batch.
The private receipt preserves the one attempted opening and actual observations.

The earlier [34 source UI/transport passes](UI-READINESS-RESULT-2026-10-28.md) remain
dated simulation evidence. They were not repeated and do not resolve this host
availability blocker. All93 requirement dispositions stay unchanged. Full native,
accessibility, platform and release acceptance remain open.

Next useful work is a bounded panel-availability diagnosis that distinguishes a
missing expansion control, an absent owned panel and a different rendered view.
Start from the human-visible symptom and supported panel integration. Do not infer
a reinstall is needed, inspect private host internals, change trust/configuration,
or launch a native client simply because the dashboard service responds. A new UI
batch needs its prerequisite established and a fresh bounded continuation; it does
not need another copy of the already-completed offline archive/authoring exercises.

This result publication changes documentation only and uses `[skip ci]`. No new
CI pass or product repair is claimed.
