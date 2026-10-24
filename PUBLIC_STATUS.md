# Current project status — source26 — 2026-10-24

macOS acceptance is the current priority. Source **0.2.0-dev.26** adds an
explicit POSIX [selected-scope retention CLI](docs/retention.md): read-only preview,
then fingerprint-confirmed cleanup with fresh selection/data checks. No automatic
cleanup, MCP writer or lock recovery. [Design and tests](docs/continuation/DEV26-REVIEW.md).

Independent MIT-licensed project; not affiliated with or endorsed by Anthropic or OpenAI.

This is an uninstalled development checkpoint on `codex/astra-groundwork`, not a
finished release. The default branch retains the experimental MVP. The full
[93-capability ledger](docs/continuation/REQUIREMENTS.md) and [macOS audit](docs/continuation/MACOS-ACCEPTANCE.md)
remain incomplete. Installed human-trusted dev10, its149reviewed files and logging
scope are unchanged; no installed production metadata was cleaned.

Local source26:208tests passed,0failed,109Windows-only skips; new retention suite
19passed/0failed/1Windows-only skip; validate3mods/replay4fixtures. CI40128013186 is in progress; decoded Ubuntu22/24 and macOS24 logs each
passed208 with109Windows-only skips. Remaining jobs are unverified. Synthetic/OS subprocess tests do not certify native Codex delivery.
[Last completed source24 package check](docs/continuation/PACKAGE-DEV24.md); source26 packaging
and installed native acceptance remain separate.

Windows stays in scope and deferred. Its unchanged mandatory real-image check
previously failed before bytes (observed2links versus the one-link guard). No
candidate Git execution, image hash/import/version or native Windows11/WSL result.
All production Windows gates remain closed. [Failure record](docs/continuation/DEV25-REVIEW.md).

The next setting is Sol Medium for packaging and concrete native acceptance-step
preparation, with High before new consequential runtime/security/writer changes.
No native UI restyling, automatic trust, extra model/API run or full-product
completion is implied. The [delivery plan](docs/continuation/DELIVERY-PLAN.md) retains remaining work.

Use [setup](docs/setup.md), [runtime access](docs/runtime.md) and
[privacy](docs/privacy.md) for the implemented tools and their access. Current
continuation instructions are in the [handoff](docs/continuation/HANDOFF.md);
historical results and failures remain in the [test log](docs/continuation/TEST-LOG.md).
