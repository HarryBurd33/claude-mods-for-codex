# Claude Mods for Codex

**Development source0.2.0-dev.13; the full93-capability product is incomplete.**
Current expanded work is on codex/astra-groundwork; default branch remains the
historical experimental MVP. MIT and independent-project status are preserved.

Source13 adds an unintegrated fixed private Git-metadata layout proof: generated
config/HEAD, optional index/info-exclude and known objects/refs/info directories.
Owned file handles use private create-new/delete-on-close; directory cleanup is
empty-only. It tests compatible and incompatible readers, explicit32MiB index/1MiB
exclude bounds, unexpected-entry preservation, owner death/cancellation and delayed
deletion while an unowned reader stays open. Prior flat/read-set bounds unchanged.
No actual Git/project/index capture, loader/ignore engine, public helper operation
or production Windows gate activation. See [review](docs/continuation/DEV13-REVIEW.md).

Source15e388e [CI40058125353](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40058125353)
all7jobs passed; both Windows logs read20storage+28proof each/0fail/0skip. Local
170pass/0fail/48Windows-only skips218total; validate3/replay4. Server CI is not
native Codex/Windows11/WSL acceptance. Both earlier mapping tests still refused
before acceptance; altered-byte/mtime branch remains unverified. Source13
[package/public-clone/spaced extraction](docs/continuation/PACKAGE-DEV13.md) passed:
157files/all-byte checks, validate3/replay4/package-scaffolding7/7. Source13 remains
uninstalled. Windows11 host remains unavailable.

Compatible live readers can retain bytes; unknown child-created files would be
preserved, not recursively deleted. Empty private hierarchy may remain after owner
death. Real Git reader/write/temp/lock behavior, executable/DLL trust, ignore-aware
selection, metadata provenance, IPC and native integration remain separate gates.
The in-memory32MiB fixture does not expand the32KiB request/3MiB response bridge.
No private bytes in arguments/environment/logs, secure-erasure or arbitrary-process
sandbox guarantee. All Windows settings/project/Git/restore still refuse before IO.

Installed macOS fixture0.2.0-dev.10 remains149reviewed files, human-trusted3hooks,
same settings/mod rules/data/project/scope/retention/export. Native source10 focus/
render/keyboard-Clear passed earlier; activity four retained records/same revision.
No install13/cache/config/trust/logging change, extra model/API evaluation or optional
observer/theme/client upgrade. Inventory/trust is separate from event delivery.

Earlier native dev6 six views/preview/files/diffs/usage/rewrites/deny/removal-reinstall
and dev4 sandbox-negative/removed hold evidence stay version-specific. Hold is not
a production approval gate; human provenance/host fail-open limits remain. Full
accessibility/lifecycle/loaded disable/older rollback/Linux/Windows/WSL incomplete.
Routine package checks complete; next human Sol High before more gated work. See
[handoff](docs/continuation/HANDOFF.md), [ledger](docs/continuation/REQUIREMENTS.md),
[test log](docs/continuation/TEST-LOG.md), [Windows boundary](docs/windows-storage.md)
and [native kit](docs/windows-native-acceptance.md).

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
