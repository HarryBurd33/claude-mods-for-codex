# Current project status — source30 — 2026-10-24

Development source **0.2.0-dev.30** adds **Appearance for this panel**: Follow
host (default), Quiet dark, Quiet light and Reset. These fixed colors apply only
to the owned dashboard, including code, diffs, charts and focus outlines. Nothing
is saved or sent to a tool, model or network. Native client appearance is separate.
See [appearance and limits](docs/themes.md) and [source review](docs/continuation/DEV30-REVIEW.md).

Installed **dev29** remains unchanged and human reviewed. Its bounded Impact review
and harmless hook checks passed in the official host; broader lifecycle and
accessibility acceptance remain incomplete. Dev30 is **not installed or natively
verified**. Local macOS offline checks: **239 passed, 0 failed, 112 Windows-only
skips (351 total)**; validation/replay passed. A disconnected browser check is
separate from native Codex acceptance. CI/package checks for this exact new source
remain next-stage work.

This independent MIT project is not affiliated with or endorsed by Anthropic or
OpenAI. The full [93-requirement product](docs/continuation/REQUIREMENTS.md) remains
incomplete; this branch is a development distribution. macOS acceptance comes
first. The original Windows metadata-bounds failure remains unresolved, known
image-inventory failures and Windows guards remain in force, and native Windows
11/WSL acceptance is unverified.

Logging selections, rules, retained data, optional capture, selected exports and
human trust are unchanged. Local deterministic callbacks make no additional model
calls; chat and skill invocations consume the selected model's usage. Next:
**GPT-6.1 Sol Medium** for exact source30 CI/package verification and supported
native update preparation. Hook trust and restart remain human steps. No new
capture, guard selection or additional model run is authorized by this checkpoint.

Setup, updates and removal: [setup](docs/setup.md), [runtime access](docs/runtime.md),
[privacy](docs/privacy.md), [removal](docs/removal.md). The default branch retains
the original MVP. See the [handoff](docs/continuation/HANDOFF.md) for the bounded
next stage; this is not a release-completion claim.
