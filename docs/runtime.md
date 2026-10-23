# Development dashboard and immediate local commands

Version0.2.0-dev.1 is an incomplete development checkpoint. New production
contracts/service/UI are tested offline; only the separate Astra proof has native
MCP App rendering evidence. Do not attribute its results to this new dashboard.

## Read-only commands

From a reviewed package, use the absolute CLI path or run from its verified root:

```sh
node bin/codex-mods.mjs files --project /absolute/selected/project
node bin/codex-mods.mjs changes --project /absolute/selected/project
node bin/codex-mods.mjs changes --project /absolute/selected/project --include-diffs
```

These are immediate local CLI callbacks and make no model calls. They are not
native slash-command callbacks. Changes default to filenames/status only;
`--include-diffs` explicitly requests patch content, which may contain secrets
even when sensitive filenames are excluded. Keep that output private unless
reviewed for publication. Nothing restores files or executes project commands.

Git provenance is working tree against HEAD, including possible concurrent human
edits. It cannot establish changes from exactly the previous assistant turn.
Ordinary in-project .git directories are supported; linked worktrees, external
object stores/alternates, SHA256 and split-index layouts are currently unavailable.
Ignored/sensitive filenames, linked/special/multiply-linked files and submodules
are excluded. Global ignore settings are not loaded. Bounds and omissions appear
in results; these safeguards are not an OS sandbox against hostile same-user races.

## Explicit runtime access

The compatibility manifest now declares the local `claude-mods` MCP server using
`.mcp.json`. It serves a plugin-owned view. Without reviewed settings it does not
select a project, discover private sessions or read activity from guessed paths.
The installed server snapshot must be checked after normal install/update/trust.

Create a private JSON file outside the selected project's editable content,
owned by the current user and mode0600 on POSIX. Example (replace placeholders):

```json
{
  "version": 1,
  "projectRoot": "/absolute/canonical/selected/project",
  "dataDirectory": "/absolute/private/mods-data",
  "stateScope": "session",
  "sessionId": "explicitly-selected-native-session-id",
  "allowChanges": false
}
```

No real session identifier belongs in public examples. Do not search private
session stores for one. Session scope is the default; absent session selection
reports unavailable. Alternatively, deliberately select `stateScope:"project"`
and omit sessionId to aggregate that project's sessions. This is additional
metadata scope, not a change to Codex permissions. Enable matching hook metadata
configuration separately (below). `allowChanges:true` explicitly permits bounded
patch content to be returned through MCP to the host/model; default false.
Settings/private data ACL validation on native Windows is not implemented, so
runtime settings/state refuse operation there.

Start the server with `node src/server.mjs --settings /absolute/private/settings.json`,
or set `CODEX_MODS_SETTINGS` to that file in the reviewed local `.mcp.json` server
entry's env map. The legacy MCP parser does not inject PLUGIN_DATA or expand
portable placeholders. Do not place private settings or absolute local paths in
this public repository or mutate the installed cache. Reinstall the reviewed
source through [setup](setup.md); human trust review follows changed code.

## Opt-in event metadata and exact replacement

The default config keeps metadata storage off. To opt in, add:

```json
"metadataState": { "enabled": true, "scope": "session" }
```

Hook launch environment supports `CODEX_MODS_DATA_DIR` (otherwise native
PLUGIN_DATA), `CODEX_MODS_PROJECT_ROOT` (explicit selected project boundary) and
`CODEX_MODS_CONFIG` (reviewed configuration). The server's dataDirectory and
canonical projectRoot must match the hook launch selection. Project scope must
be explicitly enabled on both sides; the server never silently broadens sessions.
Only event/tool/denial metadata is retained. No commands, prompts, outputs,
transcript paths or session identifiers are persisted. Directory hashes are not
anonymization. Retention remains bounded and pruning explicit.

The disabled `examples/config/exact-command-rewrite-opt-in.json` demonstrates
an exact Bash command replacement. Review and explicitly enable it before use.
Rules are bounded literal from/to command strings, not scripts/modules/regex.
The adapter changes only command, preserves all other fields, rejects conflicts,
rechecks enabled guards and emits the full before/after. Its paired PreToolUse
allow+updatedInput continues normal host permissions; it does not approve an
escalation. Negative native permission acceptance is still pending. Never alter
prompts/models/permission fields or emit PermissionRequest approval.

## UI actions and limitations

The new owned dashboard has Activity, Project files, Changes and Access views.
It uses local tools only, with escaped text. Watch is explicit, bounded to30s,
and reads only the configured scope. Each observation request waits at most2s.
Cancellation, close and navigation must clean up pending work; tests exercise the
bridge lifecycle with synthetic peers. Actual new-dashboard rendering,
keyboard/screen-reader behavior, resizing and reopening remain native acceptance
work. No button approves a native tool call. No network resources are loaded.
Token/context/cache/billing information is unavailable from the hook feed; the UI
says so and sends no keepalive/model calls. Skills still consume model usage.
