# Current status — source31 — 2026-10-24

Current [rollback acceptance](docs/continuation/ROLLBACK-DEV30.md): the temporary
older **dev30** snapshot is installed (242 verified files), and its three hooks are
human-reviewed/trusted. Restart/native30 checks remain pending. Approved dev31
settings/Review desk and source are preserved for restoration; logging scope and
Windows guards are unchanged. Full product remains incomplete.

Development source **0.2.0-dev.31** adds [authored local-preview cards](docs/local-interactions.md):
describe labeled plan/JSON/notes fields, generate a disabled private bundle, inspect
access, validate/replay and plan a reviewed display-only settings merge. Render/
Clear use fixed local callbacks; no raw-text storage, tool/model/network requests,
new hooks or capture. Existing rule/observer/status authoring remains compatible.
[Source contracts and verification](docs/continuation/DEV31-REVIEW.md).

Previously installed **dev31** passed bounded [native UI checks](docs/continuation/NATIVE-DEV31.md).
The current temporary rollback selects preserved dev30/settings28; no settings
file or capture selection was rewritten. [Lifecycle evidence](docs/continuation/LIFECYCLE-DEV31.md)
shows existing connections can survive disable/removal, so verify loaded behavior
after restart rather than inferring it from cache or trust.

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
Next: restart/reopen this chat on **GPT-6.1 Sol Medium** for loaded30 verification,
then the prepared31 restoration and human trust/restart/native confirmations. High before unexpected recovery or consequential
source/security changes. Older-version and restarted-host lifecycle acceptance remain incomplete.

[Handoff](docs/continuation/HANDOFF.md), [setup](docs/setup.md),
[runtime access](docs/runtime.md), [privacy](docs/privacy.md) and
[removal/rollback](docs/removal.md). This is a development branch, not a completed
release; the default branch retains the original MVP.
