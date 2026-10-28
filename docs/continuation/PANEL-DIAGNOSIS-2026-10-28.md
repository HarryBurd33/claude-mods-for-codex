# Review desk restored through existing-panel navigation

2026-10-28, human-requested Sol Medium diagnosis from development source
`57579a9eb08f647aaa751227dff91d697da7f65f`. **The immediate visible symptom is
resolved.** No installation, trust, native permission or runtime code changed.

## Reproduction and recovery

The earlier [UI batch](MACOS-UI-RESULT-2026-10-28.md) correctly stopped when no
inspectable panel was available and the human reported a missing or different
panel. That dated observation remains valid; its cause was not established then.

In this fresh authorized diagnosis, the existing MCP Apps inventory contained one
Claude Mods panel. Its live DOM showed **Access and usage** selected, with no
Review desk on that view. The human clarified that their symptom was a **panel
without Review desk**, rather than no visible card or a fullscreen view.

One click on the existing **Authored local tools** navigation button restored the
**Review desk** group. A read-only field-length inspection found Plan sketch,
Data contract and Notes all empty, followed by a DOM observation of their labels
and Render/Clear controls. No draft text was collected or modified. The human
independently confirmed: “I see the review desk now and everything is blank.”

| Hypothesis/check | Finding |
| --- | --- |
| Wrong selected view | Confirmed for this occurrence: Access and usage was selected; Authored local tools exposed the expected desk. |
| Missing/uninstalled plugin | Not supported as the current cause: an existing connected panel and expected card were observed. No broad installation inventory or exact loaded-version attestation is claimed. |
| Missing interaction definition | Rejected for this visible card: the group and all three fields were present after navigation. |
| Host never supports this panel | Rejected as a universal explanation: this existing panel was inspectable and navigable now. Earlier absence remains a dated observation. |
| Dashboard metadata proves visible UI | False: service results and mounted panel state must be checked separately. No extra dashboard call was needed in this diagnosis. |

## Source metadata and the avoided speculative repair

The repository and the selected installed31 server source both declare a global
entrypoint and fullscreen-only resource presentation. The resource URI and MCP Apps
HTML MIME type are present. Current [OpenAI extension documentation](https://developers.openai.com/plugins/build/extensions)
distinguishes a global sidebar launcher from a thread entrypoint, and the
[UI reference](https://developers.openai.com/plugins/reference) permits fullscreen-only
resource declarations. These describe ChatGPT extensions and do not guarantee any
particular Codex build's rendering behavior.

Those declarations explain why an assumed thread-panel launch path needed checking;
they are not, by themselves, a demonstrated defect. Once the actual panel and wrong
view were observed, no speculative entrypoint, display-mode, cache-key or host
patch was justified. The UI resource, server and default policies were unchanged.
Installed-source reads were confined to relevant server metadata; no native client,
app-server, trust inventory or private host internals were opened.

## Durable correction and verification

Setup, local-interaction and source management-skill guidance now name the exact
navigation path and require preserving existing drafts. This makes the distinction
available to future users and model-assisted management without altering rendering,
permissions, data selection, capture, tool schemas or installed code.

The original symptom and recovery were verified on the actual existing panel,
then independently confirmed by the human. Documentation links and navigation
labels were checked against that observed UI. No source suite/package or old native
trial was rerun: no executable code changed. Existing offline test passes remain
dated evidence, not additional tests for this documentation correction.

The source management skill correction is committed for future reviewed packages;
it was not copied into the installed skill or cache. Documentation rollback is an
ordinary source revert. Returning to another view remains normal UI navigation.
The panel was left on the empty Review desk with no Render/Clear/Watch, zoom,
settings, theme, installation or trust action performed by the agent.

This resolves navigation availability only. Keyboard, VoiceOver, zoom, Watch,
close/reopen and backend cancellation acceptance remain unrun/unverified from the
stopped batch. It does not renew that batch, close whole requirement IDs, prove
exact runtime identity or complete the full project. A fresh bounded UI continuation
can use the existing packet when requested. No new model trial, Phase1/Stop replay
or installation is needed for that existing-panel continuation.

Sanitized progress is published on the development branch with `[skip ci]`; no new
passing CI or release claim follows. Native permissions remained unchanged.
