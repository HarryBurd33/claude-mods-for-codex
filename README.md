# Claude Mods for Codex

macOS acceptance is the current priority. Source **0.2.0-dev.27** adds explicit
read-only [command/turn export observations](docs/event-observation.md), a separate
runtime read opt-in and an owned-panel outcome table. It distinguishes command
status, nonzero exit, failed turns and stream errors without retaining raw content.
There is no released failure hook in the reviewed CLI163/164 interface; the export
is a disclosed snapshot approximation. Optional Stop/Interrupt observers remain off.
Source27 is not installed or natively verified. Human-reviewed dev26 stays frozen.

Source26's POSIX [selected-scope retention CLI](docs/retention.md) remains available:
read-only preview followed by explicit fingerprint-confirmed cleanup. No production
cleanup, automatic recovery or Windows gate change. [Prior review](docs/continuation/DEV26-REVIEW.md).

Independent MIT-licensed project; not affiliated with or endorsed by Anthropic or OpenAI.

This is a development checkpoint on `codex/astra-groundwork`, not a finished release.
The default branch retains the MVP; the [93-capability ledger](docs/continuation/REQUIREMENTS.md)
remains incomplete. Configured dev26 is installed in the local Codex user profile,
with210verified cache files and three hooks personally reviewed/trusted. **Desktop
restart completed; bounded dev26 native acceptance passed as recorded below.** Existing settings/rules/logging
scope are unchanged; no production data cleanup. Reviewed10 remains for rollback.

Prior source26 public clone:208tests passed/0failed/109Windows-only skips. Inspected210-file
archive and fresh spaced extraction:33focused passes/0fail/1skip plus validate3/
replay4. [Package/install record](docs/continuation/PACKAGE-DEV26.md). CI40128013186:
four POSIX lanes pass; Windows portable passes; both Windows storage lanes retain
the known failed image check. Packaging is not native-host or full-platform proof.

[Native dev26 results](docs/continuation/NATIVE-DEV26.md): two harmless exact
rewrites, unchanged control and expected denial passed; six owned views/local
preview rendered. One freshly authorized Sol Medium read-only run completed in
7.3s; Watch showed4→7records in the unchanged selected scope. Grant consumed,
Watch stopped; no production cleanup or further model run authorized. Full
lifecycle/accessibility/events and the93-capability product remain incomplete.

Windows stays in scope and deferred. Its unchanged mandatory real-image check
previously failed before bytes (observed2links versus the one-link guard). No
candidate Git execution, image hash/import/version or native Windows11/WSL result.
All production Windows gates remain closed. [Failure record](docs/continuation/DEV25-REVIEW.md).

The source27 implementation/review is complete for its stated scope; next is
routine packaging/CI readback on Sol Medium. Native optional-event acceptance,
export selection, changed-code trust and any extra model run remain separate
human steps. Keep the logging scope and installed snapshot unchanged meanwhile.
No native UI restyling, automatic trust, extra model/API run or full-product
completion is implied. The [delivery plan](docs/continuation/DELIVERY-PLAN.md) retains remaining work.

Use [setup](docs/setup.md), [runtime access](docs/runtime.md) and
[privacy](docs/privacy.md) for the implemented tools and their access. Current
continuation instructions are in the [handoff](docs/continuation/HANDOFF.md);
historical results and failures remain in the [test log](docs/continuation/TEST-LOG.md).

## What it does

- Runs one deterministic dispatcher for `SessionStart`, `PreToolUse`, and `PostToolUse`.
- Emits bounded abstention/notices/denials and, only for explicitly enabled exact Bash rules, a validated command replacement with visible before/after and normal permissions.
- Keeps a denial effective regardless of later configured mods.
- Validates a narrow JSON configuration. It never evaluates configuration as code or loads remote modules.
- Keeps journaling off by default. When enabled, it stores only time, event name, tool identifier, and a deny outcome in Codex's explicit plugin data directory.
- Offers explicit POSIX selected-scope retention preview/cleanup, with no automatic deletion.
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
