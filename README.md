# Claude Mods for Codex

Development source **0.2.0-dev.33** adds a [routing dry driver](docs/routing-driver.md): a fixed synthetic Node peer, strict action admission, protocol/evidence checks, typed refusals, bounded streams/deadlines and owned-process cancellation/cleanup. It starts **no Codex process or model inference**. There is no live adapter or flag to enable one; native tool admission and configured routing remain unverified. [Source33 review](docs/continuation/DEV33-REVIEW.md).

Installed **0.2.0-dev.31** remains enabled with the approved Review desk, eight tools and unchanged251files/settings/logging/trust/data. This chat's selected model and Windows guards are preserved. Source33 is uninstalled; no restart or trust action is needed. Previous native31 rollback/disable-reenable evidence remains within its stated macOS limits.

Local tests: **271 passed,112 Windows-only skips,0 failed** (383total), including19new routing tests. Validation3mods/replay4fixtures passed. Actual fixed-peer V1/V2 dry runs passed; `--live` refused. Synthetic outputs and token counts are not native/account evidence. Exact [source33 CI/public packaging](docs/continuation/PACKAGE-DEV33.md) is verified:276files, spaced104passes/1skip; fourPOSIX271passes and Windowsportable routing18passes/1POSIXskip. Both Windows integrations retain only known Image refusal. Prior [source32 packaging](docs/continuation/PACKAGE-DEV32.md) remains separate; known Windows Image failures/original bounds cause are unresolved.

Next human setting: **GPT-6.1 Sol Medium** for routine review of the [native admission assessment](docs/continuation/NATIVE-ADMISSION-REVIEW.md) and the pending design choice. The strict spawn/wait-only gate was not established through the inspected CLI0.164 public interface; the concrete ordinary-permissions alternative requires human agreement before implementation. High before a native adapter/security change. Installed31/logging/model/trust/Windows guards stay preserved; live admission stays closed and no inference is authorized. [Handoff](docs/continuation/HANDOFF.md), [native plan](docs/continuation/NATIVE-ROUTING-TEST-PLAN.md), [setup](docs/setup.md), [privacy](docs/privacy.md), [removal](docs/removal.md).

The full [93-requirement product](docs/continuation/REQUIREMENTS.md) remains incomplete. macOS first, Windows later; nativeWindows11/WSL and configured-agent permissions/usage/lifecycle gaps remain. Local callbacks add no model calls; chat/skills and future authorized native tasks consume usage. This development branch is not a completed release; the default branch retains the original MVP.

Independent MIT project, not affiliated with or endorsed by Anthropic or OpenAI.

## What it does

- Runs one deterministic dispatcher for `SessionStart`, `PreToolUse`, and `PostToolUse`.
- Emits bounded abstention/notices/denials and, only for explicitly enabled exact Bash rules, a validated command replacement with visible before/after and normal permissions.
- Keeps a denial effective regardless of later configured mods.
- Validates a narrow JSON configuration. It never evaluates configuration as code or loads remote modules.
- Keeps journaling off by default. When enabled, it stores only time, event name, tool identifier, and a deny outcome in Codex's explicit plugin data directory.
- Offers explicit POSIX selected-scope retention preview/cleanup, with no automatic deletion.
- Authors private disabled observer/status bundles, validates complete artifacts and replays synthetic cases without execution/install/trust.
- Authors inert native agent profile candidates with explicit child model/effort and permission/usage review; no automatic installation or invocation.
- Displays authored counters inside owned Activity using only existing selected retained metadata, with no new path or capture grant.
- Summarizes one explicitly selected private exec export, separating command status, exit buckets and turn/error records. Source-only; independent of live hook metadata and usage selection.
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
