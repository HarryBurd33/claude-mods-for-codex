# Current status — source31 — 2026-10-24

The tested [native31->30->31 rollback](docs/continuation/RESTORE-DEV31.md) is verified,
including returned Review desk and harmless hooks after human reviews/restarts.
**Dev31 is now temporarily disabled for a separate restart-based lifecycle check**;
its251files, approved settings, stored trust, data and Windows guards are preserved.
[Current steps](docs/continuation/DISABLE-RESTART-DEV31.md). Full product incomplete.

Development source **0.2.0-dev.31** adds [authored local-preview cards](docs/local-interactions.md):
describe labeled plan/JSON/notes fields, generate a disabled private bundle, inspect
access, validate/replay and plan a reviewed display-only settings merge. Render/
Clear use fixed local callbacks; no raw-text storage, tool/model/network requests,
new hooks or capture. Existing rule/observer/status authoring remains compatible.
[Source contracts and verification](docs/continuation/DEV31-REVIEW.md).

The approved **Review desk** returned with three empty fixed-format fields;
rollback30 had seven views and no Review desk. Both source/settings snapshots remain.
Only the owned enabled flag is now false; do not infer restarted-tool absence from
fresh hook inventory or cached panels. Existing connections can survive disabling
until the affected host is reloaded/restarted and checked.

The dev31 public archive/spaced extraction passed79tests with one Windows-only skip,
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
Next: restart/reopen on **GPT-6.1 Sol Medium** for the disabled-host absence check,
then restore only the original enabled flag and verify/restart before loaded return. High before unexpected recovery or consequential
source/security changes. Older-version and restarted-host lifecycle acceptance remain incomplete.

[Handoff](docs/continuation/HANDOFF.md), [setup](docs/setup.md),
[runtime access](docs/runtime.md), [privacy](docs/privacy.md) and
[removal/rollback](docs/removal.md). This is a development branch, not a completed
release; the default branch retains the original MVP.
