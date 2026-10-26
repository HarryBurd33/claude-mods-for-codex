# First installed31 UI-only acceptance batch — partial acceptance

2026-10-26, GPT-6.1 Sol Medium. Human authorized a session of up to 15 minutes using
an empty synthetic Notes sample, preserving installed31/all guards, with no CLI,
extra model run, installation, network, file inspection or settings/trust/capture change.
Session ran 15:19:13–15:29:49 America/Denver (10 minutes 36 seconds).

Existing Claude Mods owned MCP App, previously approved installed31 connection.
DOM content matched the Review desk contract; no fresh cache/binary/OS/build identity
inspection. Connected host text alone is not version attestation.

## Observed results

| Check | Outcome | Evidence / limit |
| --- | --- | --- |
| Empty test scope | Pass | Two matching owned panels available; all three Review desk fields initially empty. One selected for test, other left untouched. No personal draft read or cleared. |
| Labels and roles | Pass, DOM only | Plan sketch, Data contract and Notes had associated labels; distinct scoped Render/Clear button names, enabled controls, 4096-character limits, role=status feedback. Spoken accessibility is separate. |
| Notes Render | Pass | Only Synthetic accessibility check entered into initially empty Notes by the agent. Literal preview and Rendered 1 of 3 fields locally feedback observed in the actual owned view. No claim of full Mermaid/JSON validation or all-field keyboard coverage. |
| Clear focus | Pass | Human reported a clear focus outline after clicking Render and pressing Tab; DOM corroborated focused Clear. Keyboard activation by Enter was not tested in this batch. |
| Current-zoom readability | Pass, human report | All three labels and Render/Clear readable/reachable, no clipping/overlap at unchanged zoom. Numeric zoom not measured; not enlarged-zoom/forced-colors acceptance. |
| Screen reader | Unverified | Human reported nothing speaks / VoiceOver unavailable. No setup/settings change or repeated attempts; not a proven label defect. |
| Enlarged zoom | Unverified | Settings kept unchanged under the authorized scope. |
| Exact same-card reopen | Unverified | Human could not identify the exact originating card/reopen control. Pane left open; no close/reopen or repeated new-card attempts. No docking, draft persistence, memory-erasure or backend teardown inference. |
| Cleanup | Pass | Agent checked only the exact owned sample/empty fields remained, then used Clear. Final DOM: all three fields empty, no rendered sample, Fields and previews cleared. |

The sample later appeared in Data contract while Notes was empty. Human explicitly
confirmed moving/typing it there. This was not recorded as a renderer/state defect.
Cleanup affected only the exact synthetic sample; no unknown/user draft was cleared.

## Known guidance issue

Installed31 displayed Invalid JSON. Choose Plain code to inspect literal text in a
fixed-format JSON field, where that choice is unavailable. This reproduces the already
documented installed31 wording problem, not a new regression. Current repository
ui/rendering.js instead says Invalid JSON. Source is shown as literal text, with
test/rendering.test.mjs asserting that message. No source edit, installation or trust/
restart cycle was performed to change the installed snapshot.

## Scope and interpretation

Only the supported dashboard entry and permitted owned-panel DOM interactions were
used. No project/files/diffs/exports selected; no Watch, palette, logging or data
selection changed. Dashboard opening supplied its normal configured summary; no
private counts/paths/export contents are copied into this public result.

No native CLI/app-server session, additional model/API run, install, project/file
inspection, external network action or config/trust/capture change initiated.
No OS network trace or universal no-network proof is claimed from UI feedback.
No screenshots/OS preferences/private app internals used. Results were initially
kept in the conversation; this later docs-only task records them without reopening UI.

SEC-10 and UI-02 remain incomplete; accepted V rows stay target-bound. Screen-reader/
enlarged zoom/old-card/backend lifecycle gaps are retained once, not repeatedly probed
to force a pass. No full accessibility/compliance/platform completion follows.
Next independent source work is proposed in M1-CALL-REVIEW-SCOPE.md, not authorized here.
