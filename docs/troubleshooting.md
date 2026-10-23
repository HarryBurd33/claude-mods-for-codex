# Troubleshooting

## The plugin does not appear

Check that `.codex-plugin/plugin.json` exists and there is no root `plugin.json`. Released CLI 0.163.0/0.164.0 select the portable root format first and skip its bundled hooks; installing it can succeed with an empty hook inventory. This development package uses the supported compatibility format. Check that marketplace `source.path` starts with `./`, resolves from the marketplace root, and that the client loaded the reviewed installed snapshot. Run `node ./bin/codex-mods.mjs validate` from the plugin source. See [setup](setup.md) and [released-source evidence](continuation/CODEX-CONTRACTS.md#released-hook-packaging-contradicts-portable-documentation).

## Hooks are listed but do not run

Installing or enabling a plugin does not trust its hooks. Open `/hooks`, inspect the exact definition and hash, and make a trust decision yourself. Organization policy can require managed hooks only, in which case this local hook is skipped.

## The hook reports invalid input

Run the fixture replay. Hook stdin must be one JSON object no larger than 1 MiB. The runtime supports only `SessionStart`, `PreToolUse`, and `PostToolUse`. Diagnostics are intentionally generic so malformed input is not echoed.

## A command rule did not match

Codex exposes supported shell-like calls to hooks as tool name `Bash` and normalized `tool_input.command`. Matching is exact for tool names and literal, case-sensitive substring matching for commands. It is not a shell parser. Hosted and specialized tool paths may not invoke `PreToolUse`.

## A safe tool call was denied after a config error

For a valid `PreToolUse` envelope, an unreadable or invalid config causes an explicit deny-for-review response. Run `validate`, fix the config, and replay the fixture. Host-level crashes and timeouts are outside this fallback and may fail open.

## The report says the journal is unavailable

The journal is disabled by default. When enabled, native hooks require the host-provided `PLUGIN_DATA`. The report command requires the same absolute directory through `--data-dir`. Symlinks and malformed records are rejected. A hard crash can leave `.activity-journal.lock`; after confirming no hook process is writing, remove only that empty lock directory and retry.

## Paths with spaces

The bundled hook command quotes `${PLUGIN_ROOT}/src/hook-main.mjs`. The offline suite exercises the repository's space-containing path. Windows command quoting remains unverified for this release.
