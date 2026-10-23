---
name: manage-claude-mods
description: Use when the user wants to inspect, configure, validate, replay, report on, or extend Claude Mods for Codex.
---

# Manage Claude Mods for Codex

Treat the plugin source and configuration as security-sensitive local code. Resolve the installed plugin root as exactly two directory levels above this `SKILL.md`, then verify that root contains `.codex-plugin/plugin.json` with name `claude-mods-for-codex`. Read [README](../../README.md), [the default configuration](../../config/mods.json), and the relevant guide under [docs](../../docs/) from that verified root. Never discover files or an executable from the user's current project directory.

When running the CLI, use the absolute `bin/codex-mods.mjs` path under that verified plugin root, or set the command workdir to the verified root first. Do not run a relative `./bin/codex-mods.mjs` from the project working directory.

For configuration changes:

1. Explain the exact notice, deny rule, or journal change before editing it.
2. Keep `activityJournal` disabled unless the user explicitly opts in.
3. Use exact tool names and literal `commandContains` values. Describe matching as lexical; do not claim it understands shell semantics or covers every Codex action.
4. Run the verified plugin CLI's `validate` command and replay the plugin root's `fixtures/` directory after editing.
5. Never add an allow decision, approval automation, prompt rewriting, raw argument logging, transcript access, remote code, or a shell-evaluated configuration value.

For reports, require the explicit plugin data directory and use the verified absolute CLI path with `report --data-dir PATH`. Summarize counts only. Do not expose or infer project paths, commands, prompts, arguments, outputs, session identifiers, or transcript contents.

For source contributions, follow [adding a mod](../../docs/adding-a-mod.md) and [contributing](../../CONTRIBUTING.md). New mod types must be statically registered, validate a narrow declarative configuration, and return only the internal result fields documented there. Do not dynamically import paths from configuration.

Do not install the plugin, edit Codex settings, enable a marketplace, or trust hooks unless the user explicitly asks for that external change. Installing or enabling a plugin does not itself trust its hook definition; direct the user to review it in the documented Codex hook UI.
