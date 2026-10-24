# Claude Mods for Codex

**Development source0.2.0-dev.12; the full93-capability product is incomplete.**
The default branch remains the historical experimental MVP. Current expanded work
is on codex/astra-groundwork; MIT/independent-project status remain unchanged.

Source12 adds an unintegrated Windows **explicit synthetic read-set proof**: retained
no-follow readonly handles, bounded captured bytes and identity/metadata/byte
re-verification. It tests path/link/ACL/bounds/pin/cancellation behavior and composes
one captured synthetic file with source11 private delete-on-close slots. No project
enumeration, ignore engine, real project/Git read, public helper operation or gate
activation. It is not an atomic whole-directory snapshot or a Windows release.
See [security review](docs/continuation/DEV12-REVIEW.md) and
[test log](docs/continuation/TEST-LOG.md).

Sourcee55ed71 [CI40048345934](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40048345934)
passed all7jobs; both Windows logs read20storage+21proof each/0fail/0skip.
Both mapping tests refused before read-set acceptance, so mutated-byte/restored-
mtime branch remains unverified. Local170pass/0fail/41Windows-only skips211total,
validate3/replay4 passed. Windows Server CI is not native Codex/Windows11/WSL
acceptance. The human confirmed Windows11 host is not available yet. Source12
[archive/public-clone/spaced extraction](docs/continuation/PACKAGE-DEV12.md) passed:
154files/all-byte checks, validate3/replay4/package-scaffolding7/7. Source12 is
still uninstalled; packaging does not establish Windows native compatibility.

Configured macOS fixture0.2.0-dev.10 remains installed,149files matching its reviewed
immutable snapshot and three human-trusted hooks. Existing settings/mod rules/
project/data/scope/retention/export and unrelated entries are preserved. Actual
source10 panel/render/focus/keyboard-Clear passed after restart. Activity remains
four scoped records/same revision. No source12 install, cache/trust/config/logging
change or additional model/API run. Inventory/trust is separate from event delivery.

Earlier native dev6 evidence covers six views, nested files, selected diffs, passive
usage, restricted local preview/Clear, reviewed print rewrites/control/deny and
same-version removal/reinstall. Dev4 separately verified sandbox rejection of a
rewritten out-of-workspace marker write. Removed hold proof exercised human
confirm/decline/cancel/deadline but is not a production gate; human provenance and
host fail-open limits remain. No destructive demonstration used.

Source11 [package verification](docs/continuation/PACKAGE-DEV11.md) passed; it does
not certify the new12 proof. Full accessibility/backend close-pending cleanup,
loaded disable/older rollback, optional native events/themes and Linux/Windows/WSL
acceptance remain incomplete. Routine source12 package checks are complete; next human Sol High before further
Windows security/integration/writer work. See
[handoff](docs/continuation/HANDOFF.md), [ledger](docs/continuation/REQUIREMENTS.md),
[Windows boundary](docs/windows-storage.md) and [native kit](docs/windows-native-acceptance.md).

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
