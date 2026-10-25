# Current status — source31 — 2026-10-24

The tested [native31->30->31 rollback](docs/continuation/RESTORE-DEV31.md) and
[profile-level disable/re-enable](docs/continuation/REENABLE-DEV31.md) are verified
for the stated macOS target. **Dev31 is enabled and its tools/Review desk returned
after restart.** Configuration, trust, settings, data and251files are preserved;
no restart or trust review is currently needed. Full product remains incomplete.

Development source **0.2.0-dev.31** adds [authored local-preview cards](docs/local-interactions.md):
describe labeled plan/JSON/notes fields, generate a disabled private bundle, inspect
access, validate/replay and plan a reviewed display-only settings merge. Render/
Clear use fixed local callbacks; no raw-text storage, tool/model/network requests,
new hooks or capture. Existing rule/observer/status authoring remains compatible.
[Source contracts and verification](docs/continuation/DEV31-REVIEW.md).

The approved **Review desk** returned with three empty fixed-format fields;
rollback30 had seven views and no Review desk. Both source/settings snapshots remain.
The original owned enabled flag is restored and actual tools/Review desk return
was observed after restart. These bounded checks do not establish all OS process
exit, every client/project configuration or full platform compatibility.

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
Next: **GPT-6.1 Sol High** for [configured-agent authoring/routing](docs/continuation/ROUTING-NEXT.md)
before new configuration/security contracts; installed31 stays unchanged. Other-client/platform/all-process cleanup and remaining feature acceptance stay
incomplete; the bounded rollback/disable/re-enable sequences above passed.

[Handoff](docs/continuation/HANDOFF.md), [setup](docs/setup.md),
[runtime access](docs/runtime.md), [privacy](docs/privacy.md) and
[removal/rollback](docs/removal.md). This is a development branch, not a completed
release; the default branch retains the original MVP.
