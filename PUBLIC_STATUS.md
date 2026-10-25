# Current status — source31 — 2026-10-24

Development source **0.2.0-dev.31** adds [authored local-preview cards](docs/local-interactions.md):
describe labeled plan/JSON/notes fields, generate a disabled private bundle, inspect
access, validate/replay and plan a reviewed display-only settings merge. Render/
Clear use fixed local callbacks; no raw-text storage, tool/model/network requests,
new hooks or capture. Existing rule/observer/status authoring remains compatible.
[Source contracts and verification](docs/continuation/DEV31-REVIEW.md).

Installed **dev31** now matches the reviewed251-file candidate. You authorized
one local **Review desk** card and reviewed its three hooks. **Restart and actual
native31 acceptance remain pending.** Prior logging/rules/exports/status/capture
selections and Windows guards are preserved. [Package, CI and update evidence](docs/continuation/PACKAGE-DEV31.md).

Exact public archive/spaced extraction passed79tests with one Windows-only skip,
plus validation/replay. Four POSIX source CI lanes each246passes; Windows portable
passed. Both Windows integration jobs retain the known image failure; original
bounds root cause remains unresolved. No all-green/native Windows claim.
Synthetic UI replay is separate from actual host acceptance.

Independent MIT project, not affiliated with or endorsed by Anthropic or OpenAI.
The full [93-requirement product](docs/continuation/REQUIREMENTS.md) is incomplete.
macOS acceptance first, Windows later. Original Windows bounds failure unresolved;
known image failures/Windows guards remain, native Windows11/WSL unverified.

Existing settings/data remain preserved; only the explicitly authorized local
card is added in a new private settings file. Local callbacks add no model calls;
chat/skills consume selected-model usage. No new guard/capture/model-run grant.
Next: restart Codex and reopen this chat on **GPT-6.1 Sol Medium** for native
authored-card checks. Stop for High before consequential changes.

[Handoff](docs/continuation/HANDOFF.md), [setup](docs/setup.md),
[runtime access](docs/runtime.md), [privacy](docs/privacy.md) and
[removal/rollback](docs/removal.md). This is a development branch, not a completed
release; the default branch retains the original MVP.
