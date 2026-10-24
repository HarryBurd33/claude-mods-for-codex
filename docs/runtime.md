# Development dashboard and immediate local commands

Current source24 packaging note2026-10-24: installed human-trusted dev10 remains
unchanged; source24 is uninstalled. Native results below describe the recorded
versions when tested, not fresh acceptance of source24. Current state is in
[STATUS](continuation/STATUS.md) and [HANDOFF](continuation/HANDOFF.md).

Native acceptance note2026-10-23: new dashboard views and fixed production
rewrite/deny/control were verified after restart. Activity scope must align with
the actual native chat/project context: setting a shell tool's workdir to a child
does not establish matching hook scope. Do not automatically broaden logging to
make counts increase. A synthetic matching replay verified the native Watch
separately; empty retained counts do not prove the producer is connected/healthy.

Installed dev6 is human-trusted and was verified after desktop restart: all six
owned views, including Local preview, synthetic patches/selected Replay, scoped
activity and selected-export usage. The authored harmless print replacement,
control and deny passed. A normal sandbox rejected an earlier rewritten marker
write outside the workspace; no file/elevated retry. Source dev8 adds generated
authoring replay fixtures but is not installed. Project/data/settings/scope and
retention remain unchanged; optional lifecycle observers are off/unregistered.
Default hooks and logging are unchanged. See the dated continuation records.

## Read-only commands

From a reviewed package, use the absolute CLI path or run from its verified root:

```sh
node bin/codex-mods.mjs files --project /absolute/selected/project
node bin/codex-mods.mjs changes --project /absolute/selected/project
node bin/codex-mods.mjs changes --project /absolute/selected/project --include-diffs
node bin/codex-mods.mjs scope --project /absolute/selected/project --session-cwd /absolute/native/session/directory
node bin/codex-mods.mjs checkpoints --project /absolute/selected/project --from FULL_FROM_COMMIT --to FULL_TO_COMMIT
node bin/codex-mods.mjs usage --export /absolute/private/selected-exec.jsonl
```

These are immediate local CLI callbacks and make no model calls. They are not
native slash-command callbacks. Changes default to filenames/status only;
`--include-diffs` explicitly requests patch content, which may contain secrets
even when sensitive filenames are excluded. Keep that output private unless
reviewed for publication. Nothing restores files or executes project commands.

Source0.2.0-dev.3 adds selected-commit inspection to the CLI and owned Replay view.
Add a reviewed `checkpoints` selection with full fromCommit/toCommit IDs to runtime
settings; the narrow read-only `mods.checkpoints` tool accepts no arguments.
Commit history is not automatically assistant-turn history. [Replay documentation](replay.md)
also describes the separate explicit POSIX one-file restore CLI, private plan
contents, normal permissions, conflict checks and interruption/recovery limits.
The panel/inspection commands never invoke this mutation. No mutating MCP tool.

The `scope` command checks only the two supplied directory strings. POSIX checks
canonical containment; Windows requires an exact explicitly selected root string
without filesystem probing, descendant capture or case folding. It returns a match
and a path-free explanation, makes no writes and does not attest installation,
trust or current producer health. Use the native session directory, not a proposed
tool workdir. Start a CLI session with `codex -C /absolute/selected/project` or open
that project in the intended host. Never automatically expand selection to a parent
directory to make records appear. Empty counts and retained records do not prove
that hooks are connected now. This diagnostic does not launch a model run.

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
Windows private storage APIs now have real NTFS CI, but runtime settings/dashboard
and project/Git views still refuse before traversal: safe private scratch, absolute
trusted Git and native project/host boundaries are not validated. Explicit storage
report/selected-export CLI remains separate. See [Windows storage](windows-storage.md).

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
escalation. One native dev4 normal-sandbox outside-workspace write rejection passed; other approval modes remain unverified. Never alter
prompts/models/permission fields or emit PermissionRequest approval.

## UI actions and limitations

Installed dev6 has Activity, Project files, Changes, Replay, Access and usage,
and Local preview. It uses local tools only, with escaped text. Watch is explicit,
bounded to30s, and reads only the configured scope. Each observation request waits
at most2s. The SVG event chart has measured values in a table; the native HTML
collapsible tree reads filenames/status only. Diff signs carry meaning apart
from color; controls/bidirectional characters use visible escapes. Display bounds
are64Ki characters/1,000diff lines,500paths/16segments, in addition to backend
limits. No network resources are loaded or pending tool approvals granted.

Actual dev6 rendering/view controls/nested expansion and restricted local preview
were observed after restart. A human in the Medium continuation confirmed Tab from
Preview source reached Render locally and Enter rendered the diagram; permitted
MCP Apps inspection confirmed the resulting3nodes/2edges and complete tables.
This establishes that one keyboard path, not full focus/screen-reader/lifecycle
accessibility. The human also confirmed narrower/wider preview usability; exact widths were not
measured. Close/reopen and close-pending remain separate acceptance checks. Synthetic bridge cancellation/teardown tests remain distinct
from actual host lifecycle behavior. No button approves a native tool call.

Token/context/cache/billing information is unavailable from the hook feed.
Optionally, reviewed settings may select `usageExport` outside the project for
reported counters from one private exec JSONL export. It is not current context
or a current-chat attachment. Latest cumulative completion snapshot only, never
sum; absent data stays unavailable. See [impact and usage](impact-and-usage.md).
No keepalive or new model call. Skills/chat/tool use still consume model usage.


## Scoped observer lifetime

The metadata observer's duration is absolute from its first iteration and includes
pauses while its consumer processes a yielded snapshot or writes an event. An
expired observer can return `{done:true,value:undefined}` without another snapshot;
consumers must check `done` or use `for await`. Expiry does not remove recorded
metadata. A fresh explicitly scoped read can retrieve completed writes. No model
call, background watcher, deadline extension or automatic retry is implied.
Source23 tests live delivery and expiry with a clock controlled only inside a
throwaway test process using actual storage; they are not native client or
real-time delivery guarantees. The production observer/read/write code is unchanged.

## Contention and unavailable state

Scoped activity is bounded, best-effort telemetry. A writer can refuse when lock
acquisition or its helper budget is exhausted; an unavailable result is not proof
that no bytes were committed. Do not automatically retry an event after an
ambiguous failure. Counts report retained metadata and do not attest complete
event delivery or producer health. Refusal never overrides a guard denial.

The POSIX lock permits1000ms idle and2500ms total acquisition scheduling, with
idle renewal only after a validated lock-object change. Already-pending IO and
critical-section sync are not forcibly interrupted by that schedule. Windows
locks attempt creation50times with10ms between collisions; this is not a hard
500ms method deadline. Neither policy promises success under arbitrary load.
Source24 separates slow-sync concurrency correctness, expiry/refusal and observed
OS handle lifetime in tests, without increasing production budgets.
