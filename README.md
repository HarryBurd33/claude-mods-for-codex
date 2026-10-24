# Claude Mods for Codex

## Source15 current candidate — strict index projection

Original unintegrated SHA1/v2 index projection proof: bounded checksum/entry/path/
frame validation, optional accelerator stripping and explicit same-helper scratch
composition. Nine new real Windows tests pending CI; local170pass/0fail/
64Windows-only skips234total, validate3/replay4. Golden synthetic index from
macOS Git2.39.5 roundtrip, no Windows Git launch. No production operation/gate or
installed10/logging/trust change. Full93product and native Windows/Git remain
incomplete. See docs/continuation/DEV15-REVIEW.md and TEST-LOG.md. Source14 records below are the
previous verified foundation, including its completed package checks.


**The full 93-capability product is incomplete. Development source 0.2.0-dev.15
is uninstalled. Installed human-trusted dev10 and logging scope are unchanged.**
Human resumed GPT-6.1 Sol High from verified5016e11.

Source14 adds an original, isolated same-helper metadata capture proof: explicitly
selected synthetic index (32 MiB) and info/exclude (1 MiB) use retained read handles,
metadata/byte verification and direct private scratch composition. Private bytes
stay inside the helper; the public 32 KiB request/3 MiB response bridge is unchanged.
No production operation, settings/project/Git/restore gate or installation changes.
Source [c369f49](https://github.com/HarryBurd33/claude-mods-for-codex/commit/c369f49f335c57ed0e5840088795145a0ea5717b),
[CI40059849695](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40059849695):
all 7 jobs passed. Actual Windows Node22/24 logs read: 20 storage + 35 proof tests
per lane, 0 failures and 0 skips. Seven new metadata-capture cases passed, including
full32MiB index/1MiB exclude direct composition. Both prior mapping diagnostics
still mapping-refused; altered-byte/mtime branch unverified. Windows Server2025 OS
evidence is separate from native Windows11 Codex/Git acceptance.

Local suite: 170 pass, 0 fail,
55 Windows-only skips, 225 total. Validation: 3 mods; replay: 4 fixtures.

Real Git, executable/DLL trust, ignore-aware selection, repository provenance,
child-created content ownership and native Windows11 acceptance remain gated.
Five-second cooperative checks cannot interrupt blocked IO. Live readers can retain
scratch bytes; unknown entries are preserved, with no recursive cleanup or secure
erasure claim. Prior mapping tests returned mapping-refused; altered-byte/mtime
negative branch and 8.3-specific behavior remain unverified. Windows11 host remains
unavailable per latest human reply; no repeated availability question.

Expanded development is on codex/astra-groundwork; default branch remains the
historical experimental MVP. MIT and independent-project status are preserved.
See [source14 review](docs/continuation/DEV14-REVIEW.md),
[handoff](docs/continuation/HANDOFF.md) and [verification log](docs/continuation/TEST-LOG.md).
Source14 [package/public-clone/spaced extraction](docs/continuation/PACKAGE-DEV14.md)
passed:160files/all-byte checks, validate3/replay4/package-scaffolding7/7. It remains
uninstalled. Prior source13 package evidence is versioned separately.

Installed macOS dev10 remains149 reviewed files/3human-trusted hooks, same private
settings/mod rules/data/project/scope/retention/export. Activity remains4retained
records/same revision. No install/cache/config/trust/logging change, extra model/API
evaluation or optional observer/theme/client upgrade. Source10 native focus/render/
keyboard-Clear passed earlier; inventory/trust is separate from event delivery.

Earlier native dev6 six views/preview/files/diffs/usage/rewrites/deny/removal-reinstall
and dev4 sandbox-negative/removed hold evidence stay version-specific. Hold is not
a production approval gate; human provenance/host fail-open limits remain. Full
accessibility/lifecycle/loaded disable/older rollback/Linux/Windows/WSL incomplete.
Source14 package checks passed; next human Sol High before further gated work. See
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
