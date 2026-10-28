# Existing-panel UI continuation: observed results and remaining limits

2026-10-28, human-requested Sol Medium continuation of the
[bounded UI packet](MACOS-UI-PACKET-2026-10-28.md), after
[Review desk navigation recovery](PANEL-DIAGNOSIS-2026-10-28.md).
Documentation baseline `3ec8e1fea68f6a47f227a91377403b17fd7f006e`;
the existing installed panel was used, without updating it. Exact loaded client/
runtime identity remains unverified. **Seven case outcomes are accepted within
their stated scope; three remain unverified.** These are case observations, not
seven new automated tests or full accessibility certification.

| Case | Outcome | Actual evidence and boundary |
| --- | --- | --- |
| UI-A1: initial state | Pass | Live owned-view DOM showed Review desk with three empty named fields, Render/Clear and no preview. Human had independently confirmed the blank desk. |
| UI-A2: keyboard | Pass | Human reports Tab and Shift-Tab reach all fields/buttons with visible focus. Native keyboard behavior is human-reported, not inferred from synthetic clicks. |
| UI-A3: VoiceOver | Unverified | Human reports VoiceOver unavailable. No OS accessibility setup or speech result claimed. |
| UI-A4: literal feedback and cleanup | Pass | Agent entered only the approved synthetic Notes sample and rendered once. Live DOM showed the exact literal output; human confirmed visibility and keyboard access. One owned Clear left all fields/previews empty. |
| UI-A5: zoom | Unverified at exact requested scale | Human reports enlarged zoom works and confirms restoring the starting setting. Starting/enlarged percentages were not supplied, so exact 200% and a measured clipping matrix remain unverified. Qualitative enlarged usability is recorded separately. |
| UI-A6: equivalent table | Pass, visual/keyboard scope | Human reports readable, keyboard-reachable table headers. Spoken header/value associations remain unverified because VoiceOver was unavailable. No table values are published. |
| UI-A7: two Watch start/stop cycles | Pass, human report | Two approximately five-second ON/OFF cycles stopped promptly without a stuck busy state; human left Watch off. No independent backend-loop or cancellation attestation follows. |
| UI-A8: close during third Watch and reopen | Pass, UI-only scope | On the fresh reopened view the agent observed Watch off, then checked the last permitted Watch checkbox and observed it checked/enabled. The human confirmed closing the owned tab. After a five-second wait, tab inventory was empty. The final reopened dashboard was responsive with Watch off by human report; later DOM also confirmed off. No direct same-request backend cancellation receipt. |
| UI-A9: separate quiet close/reopen | Unverified | An earlier manual closure/first reopen occurred, but pre-closure Watch state was not established. It cannot be relabeled a passing quiet-close test. No additional reopen was attempted to seek a pass. |
| UI-A10: final state | Pass | Human reports responsive dashboard, Watch off and all fields blank. Agent's inspection initially exposed Activity with Watch off; selecting Authored local tools then confirmed the visible desk, three zero-length fields and Watch off. Human had confirmed original zoom restoration. |

## Execution and reconciliation

The existing blank desk was reused without an initial dashboard opening. The batch
used three Watch windows total and two reopen requests, within the approved action
budget. The first two Watch cycles were performed by the human. The third was
started by the agent only after the human located the owned-tab close control and
reported readiness. There was no fourth Watch cycle or third reopen.

The instruction “Watch window” caused confusion; it meant an ON period of the
**Watch activity for 30 seconds** checkbox in Activity, beside Refresh view, not
a separate window. Reopening into a normal app tab was used; no forced conversation
side-panel mode or presentation metadata change was made.

Two automated inspection operations timed out after the single Activity navigation
request. The agent did not repeat that navigation. The human confirmed Activity
visible and responsive, reconciling the action without calling the product frozen.
Manual observations continued under the human's current instruction. A materially
fresh reopened tab was later inspectable, allowing observation of the last Watch
activation, closed-tab absence and final empty state. Inspection timeouts remain
recorded, not erased or counted as application test failures or passing retries.

The human's unavailable VoiceOver, exact zoom values and uncertain earlier closure
were retained as gaps. Current results combine direct owned-view observations and
explicitly identified human reports; they do not attest synchronized state across
every connection, exact old-card reactivation, physical data erasure, process exit,
all-descendant cleanup or backend cancellation. No screenshot/transcript/raw counters
or private revision/session identifiers are published.

## Preservation and milestone effect

The owned sample was cleared before Activity testing. Final fields are blank,
Watch is off and the human reports original zoom restored. No configuration, data
selection, event capture, theme, native permission, installation or trust changed.
No native CLI/app-server, provider/API/model trial, source activation or spent
Phase1/Stop operation was started. The prior source test suites and archive were
not rerun; no executable source changed in this continuation.

This adds bounded actual UI evidence to the existing installed-panel record.
All93 requirement dispositions remain unchanged; a narrow case pass does not close
a whole accessibility or lifecycle requirement. VoiceOver, exact 200% behavior,
independent quiet close/reopen, backend cancellation, broader native contracts,
authoring/platform acceptance and frozen release remain open. Keep unavailable
observations unverified rather than repeating successful source tests or changing
native permissions to manufacture acceptance.

Sanitized results are published as documentation with `[skip ci]`, which creates
no new passing CI result, install approval or release claim. Private categorical
case receipts and checkpoint state are retained separately.
