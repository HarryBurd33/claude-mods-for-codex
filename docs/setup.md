# Reviewed local setup

Current native follow-up: [dev26 restart acceptance](continuation/NATIVE-DEV26.md)
verified the bounded hooks/owned UI and one explicitly authorized active-Watch
update. No configuration/trust/scope/production cleanup changes; optional events
off and the extra run grant consumed. Broader lifecycle/platform limits remain.


This development package uses **only `.codex-plugin/plugin.json`**. Released Codex CLI 0.163.0 and 0.164.0 skip bundled hooks when a schema-recognized root `plugin.json` selects the portable format. Do not restore the old root manifest or add it beside the compatibility manifest. Paths in the compatibility manifest resolve from the package root. See the release-source evidence and observed inventory correction in [Codex contracts](continuation/CODEX-CONTRACTS.md#released-hook-packaging-contradicts-portable-documentation).

The current source package is `0.2.0-dev.26` (explicit POSIX selected-scope retention CLI; unintegrated Windows read-inventory proofs and retained source10 panel/authoring components), a development checkpoint, not a completed product release. Its registered components include the session notice, lexical guard, opt-in metadata journal/state, exact-command replacement and management skill, plus the local dashboard MCP service. Default configuration does not enable replacement or metadata storage. See [runtime access](runtime.md) before configuring its project/session scope. The included `proofs/` directory contains separate development harnesses and the unintegrated Windows OS proof. Installing the main package does not register those proof servers, panels, probes or an arbitrary execution tool. Actual host results and remaining blockers are recorded in the [continuation test log](continuation/TEST-LOG.md).

The configured macOS fixture26 is now installed with210verified cache files and
three hooks personally reviewed/trusted; fresh inventory confirms enabled/trusted,
zero errors/no model turn. After human restart bounded native26 hooks/panel/active-Watch checks passed;
full lifecycle acceptance remains incomplete.
Settings/rules/logging unchanged; no optional observers or production cleanup.
Reviewed10 retained for selective rollback. [Current package/install record](continuation/PACKAGE-DEV26.md).
Source edits alone never update caches or establish trust.

## Requirements and installation scope

- A reviewed copy of this repository or its extracted source package.
- Node.js 22 or newer available as `node` in the host's hook environment.
- A Codex client with the supported compatibility plugin and local marketplace interfaces. CLI 0.163.0 help was checked; inspect the exact version and hook inventory in your intended desktop client separately.
- macOS/Linux for the full offline suite. Windows private storage has real NTFS CI, and generated authoring data has a separate offline CLI check; native Codex hook execution, shell expansion, permissions/sandbox and installation remain unverified. Windows configured dashboard/project/Git/restore remain gated. See [Windows storage and acceptance](windows-storage.md) and the [later native-host checklist](windows-native-acceptance.md).

Registering a marketplace with the CLI and installing from it changes the **current Codex user home's configuration and plugin cache**. Placing the marketplace JSON inside one project does not, by itself, make the installation or hook enablement project-only. Review the client's displayed scope before installation; use its supported enable/disable controls for the intended projects. There is no installation or trust change merely from cloning this repository.

Before changing registration or installation, keep private local backups of the active Codex `config.toml` and any marketplace file you will edit. Preserve unrelated entries. Do not publish these backups. Record the installed version, source commit, marketplace name, and data location for rollback.

Run these offline checks from the package root:

```sh
node ./bin/codex-mods.mjs validate
node ./bin/codex-mods.mjs replay --fixtures ./fixtures
node --test
```

These checks make no model/API calls and do not establish native execution. The management skill uses a model when invoked; its usage is separate from the deterministic local checks.

## Prepare and register a marketplace

Choose a dedicated, reviewed local marketplace directory. Put the plugin copy at `plugins/claude-mods-for-codex` within it, including the hidden `.codex-plugin/` directory. Create `.agents/plugins/marketplace.json` at that marketplace root, or merge this entry into the existing file while preserving every other entry:

```json
{
  "name": "claude-mods-local",
  "interface": { "displayName": "Claude Mods Local Development" },
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

The relative source path is resolved from the marketplace root, not from `.agents/plugins/`. Use the actual selected absolute path below:

```sh
codex plugin marketplace add /absolute/path/to/marketplace
codex plugin marketplace list
codex plugin add claude-mods-for-codex@claude-mods-local --json
codex plugin list --marketplace claude-mods-local --json
```

These command forms were confirmed with installed CLI 0.163.0 help. They register/install the selected package; they do not constitute hook trust or a native execution test. The desktop's supported Plugins surface can also install a registered local marketplace, but its actual behavior must be verified in that desktop version.

## Inspect, trust, and verify

Open a disposable project in the intended Codex client and inspect `/hooks` in the CLI. The package should expose `SessionStart`, `PreToolUse`, and `PostToolUse`. If the inventory is empty, stop: trusting a nonexistent hook cannot fix packaging. Confirm that the installed cache contains `.codex-plugin/plugin.json` and no root `plugin.json`.

Review the installed compatibility manifest, `hooks/hooks.json`, `src/hook-main.mjs`, dispatcher, registered mods, configuration, and management skill. Hooks launch local code using the hook process's OS authority, which is distinct from the sandbox governing a model-executed command. They receive event fields, including some tool input/output and a transcript path; this package does not open transcript files or persist those fields. Journaling is disabled by default. See [security](../SECURITY.md).

Have the human review and trust the exact hooks through `/hooks`. Never write trust hashes or use a trust-bypass flag. Start/resume the disposable session and verify the notice and a harmless covered tool call. Record the client version, actual event output, and any failure. Do not infer hook delivery from installation, offline replay, or a trust notification alone.

## Update and development reload

There is no promised hot reload. The host copies local packages into its cache; editing the original source does not prove the installed files changed.

1. Disable this plugin in the client's supported Plugins controls, or remove it using the command below. Stop sessions that could still use the old loaded snapshot.
2. Review the source diff, access, and version change; run validation, replay, and tests. Keep the previous reviewed source for rollback.
3. Replace only the selected local marketplace's plugin copy with the reviewed version. Ensure the old root `plugin.json` is absent.
4. Reinstall through the supported commands, then inspect the cache and hook inventory again:

```sh
codex plugin remove claude-mods-for-codex@claude-mods-local --json
codex plugin add claude-mods-for-codex@claude-mods-local --json
```

5. Review/retrust changed hooks as a human, restart the affected client/session if required, and rerun harmless native checks. CLI 0.163.0 must not be assumed to invalidate trust when referenced JavaScript alone changes; 0.164.0 adds execution-time plugin-content checks. Neither behavior replaces source review.

`codex plugin marketplace upgrade` refreshes configured **Git** marketplace snapshots; it is not a local-source hot-reload command. The explicit remove/add sequence above is a conservative local update path. A versioned immutable local snapshot followed by `codex plugin add` also updated the installed fixture on CLI0.163.0; verify the actual new cache/version/trust before claiming success. Removal and data retention are covered in [removal and rollback](removal.md).

References: [official packaging guide](https://developers.openai.com/plugins/build/plugins), [official hooks guide](https://learn.chatgpt.com/docs/hooks), and [released compatibility manifest parser](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core-plugins/src/manifest.rs).
