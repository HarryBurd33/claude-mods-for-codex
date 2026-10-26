# Claude Mods for Codex

Development source **0.2.0-dev.37** adds a separate inspection-only plan and closed native entry. Fixed Node peers verify explicit working-directory handling, protocol refusals, privacy, deadlines and cleanup. **No native inspection transport is implemented or enabled.** [Implementation and limits](docs/continuation/DEV37-REVIEW.md).

**Installed production remains 0.2.0-dev.31**, with approved settings, logging scope and human trust unchanged. No Codex invocation, additional inference, installation, host config/trust change or native-input refresh occurred. The known added project-trust entry remains preserved and unaccepted; no new baseline. The full93-capability product remains incomplete.

Local offline tests: **318 passed,0 failed,113 skipped**; validation/replay passed. Exact source37 CI and packaging are pending. [Earlier source36 CI](docs/continuation/CI-DEV36.md) failed overall on the known Windows Installer Image refusal; native Windows and original bounds gaps remain unresolved.

**Next: GPT-6.1 Sol Medium** for exact37 CI/package/source-review verification. Native startup remains blocked by remote-control exclusion and other unverified host effects; no gate opening or native/model authorization. [Handoff](docs/continuation/HANDOFF.md), [future plan](docs/continuation/RESUME-PLAN.md), [setup](docs/setup.md), [privacy](docs/privacy.md), [removal](docs/removal.md).

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
