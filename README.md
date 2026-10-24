# Claude Mods for Codex

Source10 strengthens the owned dashboard's focus outline for mouse and keyboard
focus. It follows a human report that Clear worked but focus was unclear. The
isolated browser check is separate from installed dev6; no native source10 result
or full accessibility claim. [Source9 packaging](docs/continuation/PACKAGE-DEV9.md)
passed anonymous-clone/archive/extraction checks; source10 requires its own archive.

High Windows work adds an isolated, unintegrated process/object-security proof:
creation-time job ownership, executable handle/ACL checks and private empty scratch.
Real Windows CI results and limits are in [the proof](proofs/windows-owned-process/README.md)
and [verification log](docs/continuation/TEST-LOG.md). No project/settings/restore
activation or installation; installed dev6, logging scope and human trust unchanged.

**Development source `0.2.0-dev.10`: the full requested product is incomplete.**
Source dev8 adds matching/nonmatching offline fixtures to each generated mod and
keeps its configuration disabled. The reviewed dev7 foundation provides handle-checked private Windows NTFS journal/state and explicit
selected-usage reads, with bounded optional hook telemetry and cancellation.
Windows dashboard settings, project/Git views and restore explicitly refuse before
project traversal until their separate security/host gates pass. See
[Windows storage](docs/windows-storage.md). Native Windows CI is storage/process
evidence, not Codex/Windows11 compatibility. Installed dev6/trust/logging unchanged.

Installed test fixture `0.2.0-dev.6` has actual macOS desktop evidence after
human trust and restart: six owned views, local flowchart/JSON/plain-code preview,
Clear, nested project browsing, selected-commit diffs and passive usage counters.
The reviewed authored print rewrite, existing rewrite, unchanged control and deny
rule passed. Supported removal/reinstallation restored all125 reviewed files and
three trusted hooks; fresh-session absence during removal was verified. This does
not establish immediate unload in an already-open desktop process.

The earlier dev4 normal sandbox rejected a rewritten marker-file write outside
the workspace; no target or elevated retry. Separate harmless hold tests verified
confirm/decline/cancel/30s timeout and were removed. The hold proof is not a
production gate: human provenance is not attested and disconnected hooks can fail
open. See [current status](docs/continuation/STATUS.md) and
[test log](docs/continuation/TEST-LOG.md) for version-specific limits.

The [local preview](docs/local-preview.md) is an original restricted flowchart
approximation, not full Mermaid or native transcript restyling. Optional
[observation-only lifecycle events](docs/lifecycle-observation.md) remain source-
tested, unregistered and native-unverified. Default hook registration/logging
is unchanged. Local callbacks make no additional model calls; skill/chat use
consumes usage. Current source local suite170pass/28Windows-only skips (198total); CI and native
platform evidence are separate.

Replay compares only explicit selected Git commits, which may include human edits
or multiple turns; it is not automatic previous-turn attribution. A separate
explicit POSIX one-file [restore CLI](docs/replay.md) has conflict/private-plan
checks and documented non-atomic interruption limits; no panel/MCP restore action.
[Usage](docs/impact-and-usage.md) reads only one explicitly selected private export:
latest cumulative counters, never summed or called current context/billing/cache
health. No private-session discovery or paid keepalive.

Remaining incomplete work includes full accessibility, broader skill invocation,
disable/older-version rollback and loaded-process lifecycle, supported themes,
optional event native delivery and real Windows/Linux/WSL compatibility. Windows settings/dashboard,
project/Git views and restore remain explicitly unavailable; private storage and
selected-export APIs have dedicated NTFS CI. Native Codex installation/events,
standard-user sandbox behavior and full Windows compatibility remain unverified. The
[93-capability ledger](docs/continuation/REQUIREMENTS.md) records every gap and
alternative. An original [theme example and supported setup/rollback guide](docs/themes.md) is
provided without applying it or upgrading Codex. The management skill reflects
the reviewed exact-replacement contract; the source scaffolding skill now uses
self-contained fixtures. A human confirmed the installed dev6 Preview source →
Tab → Enter rendering path and narrower/wider preview usability; broader
accessibility remains incomplete. Continue through the [handoff](docs/continuation/HANDOFF.md).

Claude Mods for Codex is an inspectable local hook framework with a plugin-owned dashboard, scoped metadata, read-only project tools, authoring/replay CLI and five focused skills. Its default hook examples are: a visible session notice, a deny-only lexical command guard, and an optional metadata activity journal. A fixture replay CLI lets you test the exact hook responses without installing the plugin or signing in.

This is an independent project. It is not affiliated with, endorsed by, or maintained by Anthropic or OpenAI. It does not run Claude Mods unchanged.

## What it does

- Runs one deterministic dispatcher for `SessionStart`, `PreToolUse`, and `PostToolUse`.
- Emits bounded abstention/notices/denials and, only for explicitly enabled exact Bash rules, a validated command replacement with visible before/after and normal permissions.
- Keeps a denial effective regardless of later configured mods.
- Validates a narrow JSON configuration. It never evaluates configuration as code or loads remote modules.
- Keeps journaling off by default. When enabled, it stores only time, event name, tool identifier, and a deny outcome in Codex's explicit plugin data directory.
- Uses standard Node.js modules, plus fixed system Windows PowerShell5.1/.NET Framework for Windows private storage; no dependency download or network call.

The guard is a policy aid. It is not a sandbox, a shell parser, or complete enforcement. Codex runs native hooks concurrently with other hook sources, and a hook crash or timeout may fail open at the host boundary.

| Example | Reads | Changes or executes |
| --- | --- | --- |
| Session notice | Session event and configured message | Returns visible text; no storage |
| Deny guard | Tool identifier and command text in memory | Returns a denial for a lexical match; never executes the command |
| Activity journal (opt-in) | Event and tool identifiers | Writes bounded local metadata files under `PLUGIN_DATA` |
| Management skill | Verified plugin files and requested local report | Can edit configuration and run the packaged validation/replay/report CLI using ordinary Codex permissions |
| Source project dashboard | Explicit selected Git project and optional private export | Read-only tools; patch content and usage export separately opt in; no raw export content returned |
| Source restore CLI | Two selected commits, one existing text file and private plan | Explicit apply only; writes selected file after conflict checks; limits/recovery in docs/replay.md |
| Source blast-radius guard | Canonical Bash command in memory | Lexical impact explanation/denial only; no command execution, target scan or approval |

## Try it offline

Node.js 22 or newer is required.

```sh
git clone https://github.com/HarryBurd33/claude-mods-for-codex.git
cd claude-mods-for-codex
git switch codex/astra-groundwork
node ./bin/codex-mods.mjs validate
node ./bin/codex-mods.mjs replay --fixtures ./fixtures
node --test
```

The denied fixture produces exactly this decision:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Blocked by the example destructive-command rule. Review the command and use Codex permissions or a safer operation."
  }
}
```

A nonmatch produces `{}`. The replay command never executes the command stored in a fixture.

## Author a configuration

Use the [authoring workflow](docs/authoring.md) to describe, scaffold, inspect access,
validate and replay a disabled mod before review and supported installation. Four
bundled skills cover scaffolding, debugging, verification and review preparation.
They consume model usage when invoked; local CLI callbacks make no model calls.

## Configure the examples

Edit `config/mods.json`, then run `validate` and `replay` again. Rules match an exact Codex hook tool name and/or a literal substring of the normalized `tool_input.command`. Both conditions must match when both are present. Literal matching is case-sensitive and intentionally avoids regular expressions.

The default guard targets Codex's hook-facing `Bash` tool name. Codex normalizes supported shell-like calls to `{ "command": "..." }` before the hook. Other tool inputs may be any JSON value, so command rules simply do not match values without a string `command` field.

See [configuration](docs/configuration.md), [wire format](docs/wire-format.md), and [adding a mod](docs/adding-a-mod.md). Ready-to-replay single-purpose configurations are in `examples/config/`.

## Install manually

This branch is a development distribution. The local MCP dashboard service is included;
project and activity access are unavailable until explicitly configured.
Read [runtime setup and limits](docs/runtime.md) before enabling it. Follow [setup](docs/setup.md) to register a local
marketplace, install the reviewed package and complete human hook trust. It uses
only `.codex-plugin/plugin.json`: released CLI0.163.0/0.164.0 skip hooks when a
portable root manifest is selected. Do not restore that root manifest.
Installation changes the active Codex user's profile/cache; putting marketplace
files in a project does not make the installed hooks project-only. No automatic
trust or hot reload is provided. [Setup](docs/setup.md) covers reviewed updates;
[removal](docs/removal.md) covers disabling, uninstalling and rollback.

## Privacy and security

The journal is disabled in the shipped config. It does not store commands, prompts,
tool arguments/results, transcripts, session IDs, credentials or paths. Hooks
receive event fields in memory and execute as local trusted processes, whose OS
authority differs from the model tool sandbox. The local MCP service reads only its reviewed selected project, private metadata
and optional selected export, plus fixed packaged UI assets. Patch/export reads
are separate explicit grants.
They make no network/model calls. Skills use the selected model and consume usage;
the whole workflow is not free merely because callbacks are deterministic.
Read [privacy](docs/privacy.md) and [security](SECURITY.md) before enabling storage
or adding a mod.

## Project guides

- [Setup](docs/setup.md)
- [Configuration](docs/configuration.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Claude-to-Codex conversion](docs/conversion-guide.md)
- [Architecture](docs/architecture.md)
- [Verification record](docs/verification.md)
- [Roadmap](docs/roadmap.md)
- [Contributing](CONTRIBUTING.md)
- [Build a source package](docs/packaging.md)

GitHub source publication is separate from OpenAI's public Plugins Directory. Current OpenAI documentation says plugins containing lifecycle hooks are for manual Codex desktop installation and are not eligible for the public directory.
