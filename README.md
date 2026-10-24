# Claude Mods for Codex

**The full 93-capability product is incomplete. Development source0.2.0-dev.15
is uninstalled. Installed human-trusted dev10 and logging scope are unchanged.**
Human resumed GPT-6.1 Sol High from verified65743d9.

Source15 adds an original isolated SHA1/v2 index projection: bounded structure,
checksum, names/order and frame checks; optional extension payloads omitted and
checksum regenerated. An explicit source14 capture overload composes it inside
one helper before private scratch. Unsupported flags/modes/formats/mandatory
extensions refuse; no fallback to raw bytes after strict refusal. No production
helper/operation/settings/project/Git/restore gate is enabled.

Local npm test:170pass/0fail/64Windows-only skips234total, validate3mods/replay4.
Source[4933f28](https://github.com/HarryBurd33/claude-mods-for-codex/commit/4933f28b82e16e29d14d24a5e3222037113afee8),
[CI40060887884](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40060887884):
all7jobs passed. Both actual WindowsServer2025 Node22/24 logs read:20storage+
44proof each/0fail/0skip. All9new index cases passed, including10000entries,
32MiB input, malformed/mandatory framing and projected-source cleanup. Both prior
mapping diagnostics still mapping-refused; altered-byte/mtime and8.3 unverified.
OS evidence is not native Windows11 Codex or Windows Git acceptance. A deterministic192-byte index
was produced/read using macOS Git2.39.5 with synthetic data/zero stat fields, not
Windows Git. See [review](docs/continuation/DEV15-REVIEW.md) and
[verification log](docs/continuation/TEST-LOG.md).

Strict format checks are not repository/hash-format/HEAD/ref/object provenance,
ignore-aware selection, whole-tree freshness, loader trust or native Windows11
acceptance. Root syntax uses a dummy path, not an actual selected-root identity.
Five-second cooperative checks cannot interrupt hashing/kernel IO. Prior mapping
outcomes remain mapping-refused; altered-byte/mtime branch and8.3 unverified.
Live readers/unknown child-created content can retain bytes; no recursive cleanup,
secure erasure or hostile same-user/admin isolation. Windows11 remains unavailable
per latest reply; do not repeat its availability question without a state change.

Expanded development remains on codex/astra-groundwork; default branch is the
historical experimental MVP. MIT and independent-project status preserved.
Source14 [package/public-clone/spaced extraction](docs/continuation/PACKAGE-DEV14.md)
passed; source15 packaging is the next Medium task after its security proof. No
source15 installation or Windows compatibility claim.

Installed dev10 remains149 reviewed files and the same private settings/mod rules/
data/project/scope/retention/patch/export grants. Last High inventory3enabled/
human-trusted hooks/0errors and Activity4/same scope/revision are prior versioned
observations, not new source15 event/UI evidence. Source10 focus/render/keyboard-
Clear and dev6/dev4 hook/rewrite/deny/hold/sandbox evidence remain separate.
Full accessibility/lifecycle/loaded disable/older rollback/Linux/Windows/WSL
acceptance incomplete. No config/cache/trust/logging/optional observer/theme/client
change or additional model/API run. See [handoff](docs/continuation/HANDOFF.md),
[ledger](docs/continuation/REQUIREMENTS.md) and [native kit](docs/windows-native-acceptance.md).

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
