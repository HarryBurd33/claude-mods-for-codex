# Author a local interaction card — source31

This is an authorable component inside the existing plugin-owned MCP App, not
native client chrome, a separate client, arbitrary executable plugin or immediate
slash callback. Installed30 does not support the new kind until a reviewed update.
Existing observer/status/activity bundles and counters remain compatible.

Describe a useful local review desk: a plan diagram, JSON contract and plain notes.
The scaffolding skill uses the selected model/usage to translate that request into
bounded data; deterministic scaffold/validation/replay/UI callbacks add no model
calls. Example spec:

```json
{
  "name": "review-desk",
  "kind": "interaction",
  "title": "Review desk",
  "fields": [
    {"id": "plan", "label": "Plan sketch", "format": "flowchart"},
    {"id": "contract", "label": "Data contract", "format": "json"},
    {"id": "notes", "label": "Notes", "format": "code"}
  ]
}
```

Use the verified absolute package CLI and explicit private canonical POSIX paths:

```text
node /ABSOLUTE/PACKAGE/bin/codex-mods.mjs scaffold-component --spec /PRIVATE/spec.json --output /PRIVATE/new-bundle
node /ABSOLUTE/PACKAGE/bin/codex-mods.mjs validate-component --bundle /PRIVATE/new-bundle
node /ABSOLUTE/PACKAGE/bin/codex-mods.mjs replay-component --bundle /PRIVATE/new-bundle
```

Generation is exclusive/private, starts disabled and never installs/trusts. Inspect
component.json, access.json, plan.json, REVIEW.md and fixed synthetic local fixtures.
The last-written bundle marker checks completeness/integrity, not authorship/trust.
Partial/tampered output refuses; inspect it without overwriting, automatic cleanup
or hash editing. Windows component IO and runtime settings still refuse before
user-path IO; portable tests do not establish Windows host compatibility.

Make a separate private intent copy of component.json outside the bundle. Only
set interaction.enabled to true after choosing that display. Replay with --intent
/PRIVATE/intent.json, then component-plan with the same intent. Changing title/id/
fields/format requires regeneration/review. Plan prints only a reviewed
interactionComponents entry; merge by unique id, preserving existing cards,
status, roots/scope/exports, hooks and capture selections. No paths or hook grants
are supplied. No automatic installer, trust or hot reload. Use a reviewed immutable
supported update and human changed-code/hook trust/restart as required.

Replay exercises the actual fixed controller and renderer in a minimal synthetic
DOM: render, edit invalidation, Clear, malformed/oversized refusal and disposal.
Output reports counts/booleans, not field source. Synthetic code is never executed;
no production data writes or model/network calls. This is not native rendering,
keyboard, accessibility or physical browser acceptance; those checks follow update.

## Actual interface and access

An enabled card appears under **Authored local tools**. Up to4cards/4fields per
card,4096characters each. Each field is explicitly labeled with its fixed format:
plain literal code, highlighted JSON or the existing restricted flowchart subset
(with its16node/24edge/64line limits and complete tables). Render fields locally
and Clear fields and previews are the only actions, scoped to that card. Edits
invalidate that field's old preview; invalid/oversized input is cleared and no
render runs for that click. Navigation/palette changes retain drafts; Clear and
real teardown clear them. A new view has empty fields. Stale callbacks cannot
revive a disposed card. Missing/disabled selection mounts no controls; no defaults.

No file/network/model/tool/command action, event registration/capture, project/
export read, pending-call approval, prompt/model rewrite or persistence. Authored
labels/formats are included in the enabled private UI resource and can be sensitive;
keep artifacts private. Typed text stays in that view's memory, never serialized
into settings, tool messages, metadata or logs. The host owns its webview and can
inspect its text; do not paste credentials. Declarations/read-only hints are not
an OS sandbox for arbitrary local trusted code. No arbitrary HTML/CSS/JS/URLs/
module/action names accepted. Fixed palette/focus/system forced-color rules apply;
actual source31 native accessibility remains unverified.

Disable/remove only that reviewed settings entry and reload through supported
update; preserve other components/capture/data. For code rollback select preserved
immutable30 and supported same-ID add, verify cache/trust/loaded view and complete
human review if needed. Never patch installed cache, copy trust hashes, restore
whole shared configuration, weaken permissions or delete production data.
