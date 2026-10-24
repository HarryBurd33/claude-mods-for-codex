# Build a local source package

Current2026-10-24: source29 adds local impact assessment/ephemeral guidance;
[DEV29-REVIEW](continuation/DEV29-REVIEW.md) separates source tests and pending
CI/package/native29 acceptance. Installed28/native counter checks are recorded in
[NATIVE-DEV28](continuation/NATIVE-DEV28.md). Existing logging scope/exports/trust
stay unchanged; no guard opt-in/model run granted. Next Medium package/review
preparation, High before consequential changes. Earlier dated notes are historical.


Current native27 follow-up: [bounded post-restart checks](continuation/NATIVE-DEV27.md)
passed for the selected synthetic outcome tool/table, six owned views and harmless
ordinary pre-hook behavior. Logging scope/settings/trust selection/fixture remain
unchanged; optional lifecycle capture off, no extra model/API run or cleanup.
Earlier restart-pending statements below are historical; wider lifecycle/platform
acceptance remains incomplete. Next High before broader component authoring.


This is a compatibility-only hook distribution. Its manifest is `.codex-plugin/plugin.json`, with top-level `hooks`, `skills`, and `interface`, plus `extensions.com.openai.onboardingSkill`. All component paths resolve from the package root. There is deliberately no root `plugin.json`: released Codex CLI 0.163.0/0.164.0 would select that portable format and skip bundled hooks. See [release evidence](continuation/CODEX-CONTRACTS.md#released-hook-packaging-contradicts-portable-documentation).

The runtime requires Node.js 22 or newer and has no dependencies to install. Build a source archive into an existing output directory:

```sh
npm pack --ignore-scripts --pack-destination /absolute/path/to/output
```

This creates a local archive; it does not publish or install the plugin. `package.json` is private to prevent accidental npm publication. The previously packaged version is `0.2.0-dev.27`; source28 packaging is pending. Match compatibility manifest,
server and UI appInfo version when changing versions. [PACKAGE-DEV27](continuation/PACKAGE-DEV27.md)
records the exact54c2330 public217-file archive, byte/hygiene inspection and fresh
spaced-path46focused passes/0fail/2skips plus validate/replay. Four POSIX source CI
lanes each passed217tests; the portable Windows lane passed, while both Windows
storage jobs retain the known image failure. No native compatibility inference.
The configured217-file snapshot is installed/human-trusted after explicit selection
of only a public synthetic observation fixture. Restart/native27 acceptance is
pending. Private overlays/settings never belong in a public archive. Later notes
commits do not silently replace that immutable installed snapshot.

The explicit package file list includes `.codex-plugin/plugin.json`, runtime, configuration, hooks, skills, examples, fixtures, tests, public documentation, and development proofs. npm also includes the package metadata, README, and MIT license. Production does not load `proofs/`; explicit test/proof commands can execute those fixtures, and separate proof plugins require their own installation/review. Production registers its settings-scoped dashboard server via `.mcp.json` and includes `ui/`; it does not register proof servers or enable replacement by default. The Windows production wrapper compiles only `src/windows/PrivateStorage.cs`, excluding test-only partial classes.

Inspect every resulting archive before distribution:

- Include `package/.codex-plugin/plugin.json`, all referenced hook/skill files, and the separately labeled proofs needed by the shipped tests.
- Exclude `package/plugin.json`; a competing portable root would break hook discovery on the inspected releases.
- Exclude `.git/`, `.local/`, private root `HANDOFF.md`, dependencies, configuration backups, raw logs, journals, private sessions, credentials, and symlinks or path traversal. Sanitized records under `docs/continuation/` are intentional public content.

Extract into a fresh directory whose path contains spaces, enter its `package/` folder, and run `npm test`, `npm run validate`, and `npm run replay`. Those are offline checks, not native-host acceptance. Only then add the extracted folder to a reviewed local marketplace using [setup](setup.md). The tarball is a manual source distribution, not an OpenAI directory submission or a full-product release.

To update an installed copy, review and version the new source, disable/remove the old installation, replace only its marketplace source, reinstall, inspect the cached files and hooks, and complete human trust review. Do not edit the installed cache or claim hot reload. See [setup's update flow](setup.md#update-and-development-reload).
