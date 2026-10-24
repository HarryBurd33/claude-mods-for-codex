# Build a local source package

This is a compatibility-only hook distribution. Its manifest is `.codex-plugin/plugin.json`, with top-level `hooks`, `skills`, and `interface`, plus `extensions.com.openai.onboardingSkill`. All component paths resolve from the package root. There is deliberately no root `plugin.json`: released Codex CLI 0.163.0/0.164.0 would select that portable format and skip bundled hooks. See [release evidence](continuation/CODEX-CONTRACTS.md#released-hook-packaging-contradicts-portable-documentation).

The runtime requires Node.js 22 or newer and has no dependencies to install. Build a source archive into an existing output directory:

```sh
npm pack --ignore-scripts --pack-destination /absolute/path/to/output
```

This creates a local archive; it does not publish or install the plugin. `package.json` is private to prevent accidental npm publication. The current development version is `0.2.0-dev.26`; match it in the compatibility manifest and server version when changing versions so the installed cache can distinguish reviewed snapshots. The exact source26 archive/public clone/spaced extraction are verified in [PACKAGE-DEV26](continuation/PACKAGE-DEV26.md). The separately configured210-file snapshot is installed and human-trusted; desktop restart/native acceptance remain pending. Installed private overlays never belong in a public archive.

The explicit package file list includes `.codex-plugin/plugin.json`, runtime, configuration, hooks, skills, examples, fixtures, tests, public documentation, and development proofs. npm also includes the package metadata, README, and MIT license. Production does not load `proofs/`; explicit test/proof commands can execute those fixtures, and separate proof plugins require their own installation/review. Production registers its settings-scoped dashboard server via `.mcp.json` and includes `ui/`; it does not register proof servers or enable replacement by default. The Windows production wrapper compiles only `src/windows/PrivateStorage.cs`, excluding test-only partial classes.

Inspect every resulting archive before distribution:

- Include `package/.codex-plugin/plugin.json`, all referenced hook/skill files, and the separately labeled proofs needed by the shipped tests.
- Exclude `package/plugin.json`; a competing portable root would break hook discovery on the inspected releases.
- Exclude `.git/`, `.local/`, private root `HANDOFF.md`, dependencies, configuration backups, raw logs, journals, private sessions, credentials, and symlinks or path traversal. Sanitized records under `docs/continuation/` are intentional public content.

Extract into a fresh directory whose path contains spaces, enter its `package/` folder, and run `npm test`, `npm run validate`, and `npm run replay`. Those are offline checks, not native-host acceptance. Only then add the extracted folder to a reviewed local marketplace using [setup](setup.md). The tarball is a manual source distribution, not an OpenAI directory submission or a full-product release.

To update an installed copy, review and version the new source, disable/remove the old installation, replace only its marketplace source, reinstall, inspect the cached files and hooks, and complete human trust review. Do not edit the installed cache or claim hot reload. See [setup's update flow](setup.md#update-and-development-reload).
