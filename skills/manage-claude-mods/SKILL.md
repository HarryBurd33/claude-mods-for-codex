---
name: manage-claude-mods
description: Use when the user wants to inspect, configure, validate, replay, report on, or extend Claude Mods for Codex.
---

# Manage Claude Mods for Codex

Treat the plugin source and configuration as security-sensitive local code. Resolve the installed plugin root as exactly two directory levels above this `SKILL.md`, then verify that root contains `.codex-plugin/plugin.json` with name `claude-mods-for-codex`. Read [README](../../README.md), [the default configuration](../../config/mods.json), and the relevant guide under [docs](../../docs/) from that verified root. Never discover files or an executable from the user's current project directory.

When running the CLI, use the absolute `bin/codex-mods.mjs` path under that verified plugin root, or set the command workdir to the verified root first. Do not run a relative `./bin/codex-mods.mjs` from the project working directory.

For configuration changes:

1. Explain the exact notice, deny rule, replacement, or storage change before editing it. Keep metadata, patch/export reads and optional lifecycle observation as separate explicit opt-ins; preserve the selected project/session scope.
2. Keep `activityJournal` disabled unless the user explicitly opts in.
3. Use exact tool names and literal `commandContains` values. Describe matching as lexical; do not claim it understands shell semantics or covers every Codex action.
4. Run the verified plugin CLI's `validate` command and replay the plugin root's `fixtures/` directory after editing.
5. An explicitly requested exact replacement may use the registered `exactCommandRewrite` configuration only. Review its full before/after, keep it disabled until approved for use, and replay both matching and nonmatching events without executing their commands. Its validated paired `allow+updatedInput` wire carrier continues normal host permissions; it is not an approval. Never emit a bare allow, PermissionRequest approval, approval automation, prompt/model/permission mutation, raw argument logging, transcript access, remote code, or a shell-evaluated configuration value. See [replacement contracts](../../docs/runtime.md#opt-in-event-metadata-and-exact-replacement).

For reports, require the explicit plugin data directory and use the verified absolute CLI path with `report --data-dir PATH`. Summarize counts only. Do not expose or infer project paths, commands, prompts, arguments, outputs, session identifiers, or transcript contents.

For source contributions, follow [adding a mod](../../docs/adding-a-mod.md) and [contributing](../../CONTRIBUTING.md). New mod types must be statically registered, validate a narrow declarative configuration, and return only the internal result fields documented there. Do not dynamically import paths from configuration.

Install/update or edit owned Codex registration/settings only within the user's authorized scope; preserve unrelated entries and private backups. Installing or enabling a plugin does not itself trust its hook definition. The human must review changed hooks through the documented hook UI; never write trust hashes or bypass review. Skills use the selected model and consume usage; local validation/replay/report callbacks make no additional model calls.
