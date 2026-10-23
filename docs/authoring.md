# Describe, scaffold and review a mod

The included mod-scaffolding skill translates a natural-language request into a
supported declarative specification. It uses the selected model and consumes
usage. The scaffold/validate/replay CLI itself makes no model or network calls.
This workflow currently generates configuration for this framework, not a new
standalone plugin or custom native UI component.

Supported specification shapes:

```json
{"name":"scope-notice","kind":"notice","message":"Review the selected project before edits."}
```

```json
{"name":"impact-guard","kind":"deny","match":"SYNTHETIC_RISK","reason":"Review the likely files and external effects before explicitly retrying through normal permissions."}
```

```json
{"name":"print-example","kind":"replacement","from":"printf BEFORE","to":"printf AFTER"}
```

Use a verified package CLI and an explicitly selected new absolute output path:

```sh
node bin/codex-mods.mjs scaffold --spec /absolute/reviewed-spec.json --output /absolute/new-mod
node bin/codex-mods.mjs validate --config /absolute/new-mod/mods.json
node bin/codex-mods.mjs replay --config /absolute/new-mod/mods.json --fixtures /absolute/package/fixtures
```

Output contains mods.json (disabled), access.json and REVIEW.md. Existing output
is refused; validation happens before writing. No generated executable, dynamic
import, installation, Codex settings edit or trust decision occurs. Review the
specification, access declaration and diff. The access declaration describes this
known template; it does not sandbox arbitrary edited local code.

Replay a synthetic matching and nonmatching fixture. Enable only a temporary
reviewed config when testing its decision: disabled rules abstain. Replay never
executes the command. Merge only approved entries into selected configuration,
preserving existing entries. Use supported marketplace installation/update and
human trust review after code changes; do not edit the installed cache, invent
hot reload or automatically trust generated output.

The four original model-mediated skills are mod-scaffolding, systematic-debugging,
verify-mod-completion and prepare-mod-review. They define narrow triggers, scope,
model usage and stop conditions in their SKILL.md files. These are skills, not
immediate native slash callbacks. Native skill discovery/invocation and a full
human authoring-to-install acceptance remain unverified.
