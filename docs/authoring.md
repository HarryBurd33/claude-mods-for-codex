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
node bin/codex-mods.mjs replay --config /absolute/new-mod/mods.json --fixtures /absolute/new-mod/fixtures
```

Source dev8 output contains mods.json (disabled), access.json, REVIEW.md and
fixtures/matching.json plus fixtures/nonmatching.json. Installed dev6 output
contains only the first three files; source changes do not update that cache.
Existing output
is refused; validation happens before writing. No generated executable, dynamic
import, installation, Codex settings edit or trust decision occurs. Review the
specification, access declaration and diff. The access declaration describes this
known template; it does not sandbox arbitrary edited local code.

With the generated fixtures, disabled configuration must yield two empty
responses. For the enabled check, copy mods.json to a separately selected private
temporary file, set only the generated mod's enabled field to true, and replay the
same fixture directory with that temporary --config. Preserve the disabled
original. Matching must produce the selected notice/denial/exact replacement;
nonmatching must stay empty. For notice mods, the control is a tool event; for
command rules, it is a different command on the same Bash tool. The control is
chosen to avoid a literal collision with the authored rule. These are synthetic
host-shaped envelopes, not actual host events or a permission test.

Never execute fixture commands. They contain the chosen match/from text as
plaintext, so keep the output private if the specification is sensitive. Replay
never executes the command. Merge only approved entries into selected configuration,
preserving existing entries. Use supported marketplace installation/update and
human trust review after code changes; do not edit the installed cache, invent
hot reload or automatically trust generated output.

The four original model-mediated skills are mod-scaffolding, systematic-debugging,
verify-mod-completion and prepare-mod-review. They define narrow triggers, scope,
model usage and stop conditions in their SKILL.md files. These are skills, not
immediate native slash callbacks. The dev6 selected-model workflow scaffolded a disabled synthetic exact print rule
using the verified installed CLI, inspected access and replayed disabled/matching/
nonmatching cases. The rule was merged into a reviewed versioned fixture, human-
trusted, and after restart actually changed `printf MODS_AUTHOR_BEFORE` to
`printf MODS_AUTHOR_AFTER`. No additional model run or executable generation.
The corrected installed management skill was read/used in this chat; independent
invocation/evaluation of every skill and unsupported authoring shapes remain
unverified. This is framework configuration authoring, not arbitrary plugin/UI
generation or an immediate slash-command callback.


## Skill collection and current evidence

See [skill workflows](skill-workflows.md) for triggers, access, model usage and
observable acceptance checks. Reading/applying a skill in the current selected
chat is distinct from an independent model evaluation or native slash callback.
No extra model run or automatic installation is required to scaffold/test data.
