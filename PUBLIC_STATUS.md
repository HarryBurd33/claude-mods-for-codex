# Current project status — source30 — 2026-10-24

Development source **0.2.0-dev.30** adds **Appearance for this panel**: Follow
host (default), Quiet dark, Quiet light and Reset. These fixed colors apply only
to the owned dashboard, including code, diffs, charts and focus outlines. Nothing
is saved or sent to a tool, model or network. Native client appearance is separate.
See [appearance and limits](docs/themes.md) and [source review](docs/continuation/DEV30-REVIEW.md).

Installed **dev30** now matches the reviewed242-file public-source candidate;
you have reviewed its three hooks. **Restart and loaded native30 acceptance are
pending.** Source CI's four macOS/Linux lanes each passed239tests, and the Windows
portable lane passed. Both Windows integration jobs retain the known image failure;
the original bounds failure remains unresolved. Exact archive/spaced extraction
passed62focused tests plus validation/replay. [Package and CI evidence](docs/continuation/PACKAGE-DEV30.md).
The disconnected browser checks remain separate from official-host acceptance.

This independent MIT project is not affiliated with or endorsed by Anthropic or
OpenAI. The full [93-requirement product](docs/continuation/REQUIREMENTS.md) remains
incomplete; this branch is a development distribution. macOS acceptance comes
first. The original Windows metadata-bounds failure remains unresolved, known
image-inventory failures and Windows guards remain in force, and native Windows
11/WSL acceptance is unverified.

Logging selections, rules, retained data, optional capture and selected exports
are unchanged. Changed-hook trust was performed by the human. Two other shared
fields changed around CLI review (model-availability notice and selected-project
entry); their origin was not instrumented and both are preserved. Local callbacks
make no additional model calls; chat/skills consume selected-model usage. Next:
restart Codex and reopen this chat on **GPT-6.1 Sol Medium** for native30 checks.
No new capture, guard selection or additional model run is authorized.

Setup, updates and removal: [setup](docs/setup.md), [runtime access](docs/runtime.md),
[privacy](docs/privacy.md), [removal](docs/removal.md). The default branch retains
the original MVP. See the [handoff](docs/continuation/HANDOFF.md) for the bounded
next stage; this is not a release-completion claim.
