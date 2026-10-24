# Claude Mods for Codex

Source12 High candidate2026-10-23: unintegrated explicit synthetic Windows read-set
proof under test. Source12 is uninstalled; installed human-trusted10/logging and all
production Windows before-IO gates stay unchanged. No project enumeration/ignore
engine/Git execution; Windows11 host is still unavailable per fresh human reply.
See [DEV12-REVIEW](docs/continuation/DEV12-REVIEW.md) for contract, risks and acceptance; actual results go in TEST-LOG.

**Development source0.2.0-dev.11; the full93-capability product is incomplete.**
The default branch remains the historical experimental MVP. Current expanded work
is on codex/astra-groundwork; it is not a stable release or a Windows compatibility
claim. MIT and the independent-project disclaimer remain unchanged.

The source11 Windows proof creates bounded private synthetic scratch files with
creation-time delete-on-close, retained handles and no recursive cleanup/adoption.
It is not loaded by the production helper, does not copy project/Git data and does
not enable Windows settings/project/Git/restore. Empty private roots can remain.
See [source11 review](docs/continuation/DEV11-REVIEW.md) and
[verification log](docs/continuation/TEST-LOG.md) for actual test scope/results.
Local suite170pass/0fail/33Windows-only skips203total; validate3/replay4 passed.
Source392fc04 [CI40046690213](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40046690213) passed all7jobs; both actual
Windows job logs read20storage+13proof each,0fail/0skip.
[Source11 packaging](docs/continuation/PACKAGE-DEV11.md): exact88e8895 anonymous
clone170pass/33Windows-only skips,151-file archive, byte/hygiene inspection and
spaced extraction validate3/replay4/package-scaffold7/7 passed. Source11 remains
uninstalled. Real Windows CI is separate; POSIX skips are not Windows passes.

The configured macOS test fixture0.2.0-dev.10 remains installed in the user profile,
149files equal its immutable reviewed snapshot, three hooks human-trusted/zero
inventory errors. Its existing settings/mod rules/project/data/scope/retention/
export grants are preserved. After restart, the actual owned panel rendered its
sample and stronger3px focus outline; the human confirmed source→Render→Clear
keyboard focus and Enter-Clear. Retained activity remains four records, same project
scope/revision. No new model run, logging/trust/configuration change or source11
installation was made. Installation/trust inventory is separate from event delivery.

Earlier native dev6 evidence covers six views, nested files, selected diffs, passive
usage, restricted local preview/Clear, reviewed print rewrites/control/deny and
same-version removal/reinstall. Dev4 separately verified sandbox rejection of a
rewritten out-of-workspace marker write. Removed hold proofs exercised human
confirm/decline/cancel/deadline, but are not a production approval gate: human
provenance and host fail-open limits remain. No destructive demonstration was used.

Full accessibility, backend close-pending cleanup, loaded disable/older rollback,
optional native lifecycle/themes and Linux/Windows/WSL acceptance remain incomplete.
Windows Server NTFS CI is OS evidence, not native Codex/Windows11 acceptance.
Gated Windows security/integration requires human-selected Sol High; routine
packaging/preparation can use Medium. See the [current handoff](docs/continuation/HANDOFF.md),
[ledger](docs/continuation/REQUIREMENTS.md), [Windows boundary](docs/windows-storage.md)
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
