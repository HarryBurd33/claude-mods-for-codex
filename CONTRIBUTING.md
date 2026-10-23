# Contributing

Thank you for helping keep Claude Mods for Codex small and reviewable.

1. Use Node.js 22 or newer.
2. Make one focused change and add a test for a meaningful boundary.
3. Run `node --test`, `node ./bin/codex-mods.mjs validate`, and `node ./bin/codex-mods.mjs replay --fixtures ./fixtures`.
4. Update documentation when configuration, wire behavior, privacy, or limitations change.

New mod types must follow [adding a mod](docs/adding-a-mod.md). Keep them statically registered and dependency-free. A mod must not execute tool input, perform a network request, load code from configuration, rewrite prompts or tool arguments, automate approvals, inspect transcripts, or emit host protocol objects directly.

Do not add generated logs, plugin data, credentials, local marketplace files, dependency directories, private paths, or investigation artifacts to the repository. By contributing, you agree that your contribution is licensed under the MIT License.
