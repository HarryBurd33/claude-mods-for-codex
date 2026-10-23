# Manual setup

## Requirements

- Codex in the ChatGPT desktop app with local plugin marketplace support.
- Node.js 22 or newer available as `node` to the hook process.
- A reviewed copy of this repository.

Run the offline checks first:

```sh
node ./bin/codex-mods.mjs validate
node ./bin/codex-mods.mjs replay --fixtures ./fixtures
node --test
```

## Add through a local marketplace

Current OpenAI documentation supports repo marketplaces at `$REPO_ROOT/.agents/plugins/marketplace.json` and personal marketplaces at `~/.agents/plugins/marketplace.json`. A marketplace entry points at a plugin folder using a `./`-prefixed path relative to the marketplace root.

For a repo-scoped test, copy this folder under the target repository, for example `plugins/claude-mods-for-codex`, and merge an entry like this into that repository's existing marketplace file:

```json
{
  "name": "local-repo",
  "interface": {
    "displayName": "Local Repo Plugins"
  },
  "plugins": [
    {
      "name": "claude-mods-for-codex",
      "source": {
        "source": "local",
        "path": "./plugins/claude-mods-for-codex"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Developer Tools"
    }
  ]
}
```

Preserve other marketplace entries. Restart the ChatGPT desktop app, open the Plugins Directory, choose the local marketplace, and install the plugin.

Installing or enabling the plugin does not trust its hooks. Use `/hooks` in Codex CLI to inspect the source, exact command, and current hash. Trust the hook only after reviewing `plugin.json`, `hooks/hooks.json`, `src/hook-main.mjs`, the dispatcher, registered mods, and configuration. Do not use a trust bypass.

The plugin is not installed or host-tested merely because the offline replay passes. This repository intentionally has no setup script and does not edit `marketplace.json`, `.codex/config.toml`, `~/.codex/config.toml`, or hook trust state.

Official references: [package plugins](https://developers.openai.com/plugins/build/plugins) and [hooks](https://learn.chatgpt.com/docs/hooks).
