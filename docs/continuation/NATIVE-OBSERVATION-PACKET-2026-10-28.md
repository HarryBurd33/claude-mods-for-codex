# Consolidated existing-client observation packet

Status: human approved and completed once; window spent. See the
[result](NATIVE-OBSERVATION-RESULT-2026-10-28.md). Prepared for human-selected Sol Medium.
Source baseline: `6fa33e0cade140ae8c24b53bbc29f54ee85f00a0`, dev39.
See [source evidence](NATIVE-READINESS-MANIFEST-2026-10-28.json) and
[readiness result](NATIVE-READINESS-RESULT-2026-10-28.md).

## One decision and finite scope

Approve one human-operated, read-only inventory lasting at most 15 minutes, with
one observation per available surface and no retries. Keep the selected model and
all native authorization, trust, configuration and hook settings unchanged.
This packet adds no terminal commands or automated native-client actions.

1. In the already-open desktop app, read its supported About view if available;
   report the displayed client/version, or unavailable.
2. In its existing Plugins view, read the Claude Mods entry without changing it;
   report displayed version/identity and enabled/disabled state only if shown.
   An absent version stays unknown; do not infer dev39 from the source checkout.
3. Only if a CLI session is already running, inspect its own advertised slash-menu
   entries. Open `/hooks` only if that exact command is advertised there. Read
   visible hook event names and categorical enabled/disabled/unknown states only.
   Do not submit unknown slash text as a model prompt or change any setting.

A missing surface means unavailable. Do not launch a client, CLI, app server or
new session, submit a prompt, start a model call, install/update a plugin, trust
code, enable a hook, inspect private host APIs or read configuration/session files.
Do not repeat Review desk, keyboard, zoom, Watch or close/reopen checks.

## Report and stop

Return only visible client/version, plugin identity/version/state, whether a
supported hook view exists, and event names with categorical state if exposed.
Keep paths, commands, raw hook content, transcripts, identifiers and screenshots
private. Stop immediately at a trust/install/settings prompt, unexpected model
activity, ambiguous control or expiration of the 15-minute window. Close only
views opened for this inventory using their ordinary Back/Close control; do not
close an existing session. No cleanup file deletion is required.

Expected new model calls: zero. Network behavior of existing app chrome is not
asserted offline; do not initiate catalog refreshes or authentication. If a view
requires either, record unavailable. No approval covers subsequent native trials.

## Acceptance and limitations

A result is accepted as inventory only when each observation identifies its
visible surface and unavailable fields remain explicit. Source and installed
host evidence must remain separate. A visible hook list cannot establish complete
stable effective-hook applicability or non-mutation. Held-call NM-1 and routing
admission remain closed. Lifecycle/cancellation and authoring-to-removal require
a separately reviewed candidate-bound campaign. Sol High remains the planned
assignment for consequential native contracts; this packet does not execute it.
