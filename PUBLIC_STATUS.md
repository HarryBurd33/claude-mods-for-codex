# Current project status — source30 — 2026-10-24

Development source **0.2.0-dev.30** adds **Appearance for this panel**: Follow
host (default), Quiet dark, Quiet light and Reset. These fixed colors apply only
to the owned dashboard, including code, diffs, charts and focus outlines. Nothing
is saved or sent to a tool, model or network. Native client appearance is separate.
See [appearance and limits](docs/themes.md) and [source review](docs/continuation/DEV30-REVIEW.md).

Installed **dev30** is human reviewed and now has bounded native appearance
acceptance: default/dark/light/Reset, retained synthetic previews/reviews, chart/
code/diff colors, human keyboard/width checks and harmless hooks passed. Separate
CLI0.163 theme discovery/picker/cancel passed with no saved preference; physical
terminal colors remain unverified. [Native evidence and limits](docs/continuation/NATIVE-DEV30.md).
The exact242-file archive passed62packaged tests; four POSIX CI lanes each passed
239tests. Known Windows failures remain. [Package/CI](docs/continuation/PACKAGE-DEV30.md).

This independent MIT project is not affiliated with or endorsed by Anthropic or
OpenAI. The full [93-requirement product](docs/continuation/REQUIREMENTS.md) remains
incomplete; this branch is a development distribution. macOS acceptance comes
first. The original Windows metadata-bounds failure remains unresolved, known
image-inventory failures and Windows guards remain in force, and native Windows
11/WSL acceptance is unverified.

Logging selections, rules, data, optional capture, exports/status and human trust
are preserved. Temporary theme file/directory removed; configuration byte-unchanged
after preview. Local callbacks make no extra model calls; chat/skills consume
selected-model usage. Next **GPT-6.1 Sol High** for an authored interactive owned
component workflow beyond the existing observer/status counters. No new capture,
guard selection or additional model run is authorized.

Setup, updates and removal: [setup](docs/setup.md), [runtime access](docs/runtime.md),
[privacy](docs/privacy.md), [removal](docs/removal.md). The default branch retains
the original MVP. See the [handoff](docs/continuation/HANDOFF.md) for the bounded
next stage; this is not a release-completion claim.
