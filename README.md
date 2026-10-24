# Claude Mods for Codex

Source18 package verification is in progress; the exact09a810b public archive
passed local checks. Its later CI40065152768 had one Windows test-harness timeout;
a bounded test-only correction is pending CI. No production gate or installed
plugin change. See [package record](docs/continuation/PACKAGE-DEV18.md).

**Full 93-capability product remains incomplete. Source 0.2.0-dev.18 is
uninstalled; installed human-trusted dev10 and logging scope remain unchanged.**
Human selected GPT-6.1 Sol High from verified 7848c97.

Source18 adds a proof-only, read-only installed-code inventory and original bounded
static PE import parser. It never runs Git or loads its DLLs. Two fixed Windows CI
Git candidate paths are read only after the existing object pins succeed; a refusal records
no content read. Static imports/hashes are inventory, not authenticity, actual DLL
resolution, execution safety or native Windows11 Codex acceptance. Every production
Windows settings/project/Git/restore gate remains closed before IO.

Local `npm test`: 178 passed, 0 failed, 84 Windows-only skips (262 total).
`npm run validate`: 3 mods; `npm run replay`: 4 fixtures. Source [f8290ef](https://github.com/HarryBurd33/claude-mods-for-codex/commit/f8290ef7289d3dba16397b2bf8092c089b0d6a86),
[CI40064711984](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40064711984):
all7jobs passed. Both decoded Windows Node22/24 logs read:20storage+64proof tests
per lane,0fail/0skip. Both fixed Git candidate paths returned pin=refused/dataRead=false
in both lanes. No image hash/import list/version was obtained; the generic pin
boundary does not distinguish absent/path/ACL/sharing refusal. The original compiled
fixture passed held-read/write+rename refusal/release; unsafe ACL refused before
image read. Previous mapping diagnostics still mapping-refused; altered-byte/mtime
and8.3 remain unverified. OS evidence is separate from Windows11 Codex/Git execution.

No compatibility upgrade is claimed. See
[Source18 review](docs/continuation/DEV18-REVIEW.md) for contracts and remaining security work.

## Prior source17 checkpoint (historical)

**Full93-capability product incomplete. Development source0.2.0-dev.17 is
uninstalled. Installed human-trusted dev10 and logging scope are unchanged.**
Human resumed GPT-6.1 Sol High from verifiedb67f98a.

Source17 adds an original isolated owned-helper composition around source16's
retained HEAD/ref/index capture. The fixed independently compiled fixture runs
in a mandatory creation-time job, with pinned code objects/private cwd, stdin EOF,
SystemRoot-only environment,4s child budget and4KiB output. Normal completion,
abrupt exit, synthetic stalls, cancellation, owner death, parser failure and output
bounds are tested. No production launcher/helper/operation/gate is enabled.

Local suite170pass/0fail/82Windows-only skips252total; validate3/replay4. Source[04a4939](https://github.com/HarryBurd33/claude-mods-for-codex/commit/04a49394b477fe45c14025da0f318a7a641faff3),
[CI40063228451](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40063228451):
all7jobs passed. Both actual WindowsServer2025 Node22/24 decoded logs read:
20storage+62proof each/0fail/0skip. All9new owned-helper cases passed. Prior
mapping diagnostics still mapping-refused; altered-byte/mtime and8.3 unverified.
OS fixture evidence is separate from Windows11 Codex/Git/native acceptance. See
[review](docs/continuation/DEV17-REVIEW.md) and [test log](docs/continuation/TEST-LOG.md).

The timer excludes parent preflight IO. Synthetic stalls do not prove blocked
kernel IO termination or a universal4s API bound; cleanup is asynchronous. Object
pins do not authenticate binary/DLL dependencies or block all current-user code
additions. This is not a sandbox/network boundary, actual Git or native Windows11
acceptance. Repository identity/hash format/object provenance/ignore/restore stay
gated. Live readers/unknown content may retain bytes; no recursive cleanup or
secure erasure. Prior mapping-refused/byte-mtime/8.3 gaps remain. Windows11 remains
unavailable per latest reply; do not repeat that availability question.

Expanded development remains on codex/astra-groundwork; default branch stays the
historical experimental MVP. MIT and independent-project status preserved.
Source17 [package/public-clone/spaced extraction](docs/continuation/PACKAGE-DEV17.md)
passed:170files/all-byte checks, validate3/replay4/package-scaffolding7/7. Source17
remains uninstalled; next human Sol High before further gated Windows work.

Installed dev10/cache149reviewed files/private settings remain unchanged, with no
new native inventory/event/UI/trust/model run or logging/observer/theme/client
change. Prior High3trusted/enabled/0errors and Activity4/same scope/revision/health
unknown stay version-specific; source10 focus/render/Clear and dev6/dev4 hook/
rewrite/deny/hold/sandbox evidence separate. Full accessibility/lifecycle/loaded
disable/older rollback/Linux/Windows/WSL gaps remain. See
[handoff](docs/continuation/HANDOFF.md), [ledger](docs/continuation/REQUIREMENTS.md)
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
