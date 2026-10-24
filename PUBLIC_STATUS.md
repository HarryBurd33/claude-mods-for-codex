# Current project status — source28 — 2026-10-24

macOS acceptance is the current priority. Source **0.2.0-dev.28** adds a useful
[observer/status-component authoring workflow](docs/component-authoring.md): describe,
generate disabled private data, inspect access, validate, replay synthetic cases
and print reviewed merge fragments. Existing notice/deny/replacement authoring is
preserved. It creates no standalone plugin, arbitrary code or native host UI patch.

Source28 is **not installed or natively verified**. Local macOS tests:228pass/
0fail/111Windows-only skips339total; final related checks18pass/0fail/1skip.
CI/package/native28 checks remain separate. [Review](docs/continuation/DEV28-REVIEW.md).
The new per-event authored-storage allowlist does not enable ordinary or dormant
legacy logging. Reception, retention and display are independent choices, all off.

Independent MIT-licensed project; not affiliated with or endorsed by Anthropic or OpenAI.

This is a development checkpoint on `codex/astra-groundwork`, not a finished release.
The default branch retains the MVP; the [93-capability ledger](docs/continuation/REQUIREMENTS.md)
remains incomplete. Installed human-reviewed27 remains unchanged:217verified files,
existing capture scope/rules/data/retention, selected public synthetic export and
old usage selection preserved. [Bounded native27 checks](docs/continuation/NATIVE-DEV27.md)
passed for its synthetic table, six owned views and covered pre-hook checks; they
do not certify source28, all events/accessibility, platforms or the full product.

The public defaults keep metadata off and register only three hooks. New authored
status entries default absent; a display never enables capture. No new installation,
trust/config write, production cleanup, event opt-in or additional model/API run.
All old extra-run grants remain consumed. Local callbacks add no model calls;
using this chat/skills still consumes selected-model usage.

Windows remains in scope and later. New component IO refuses before options/path
access; current Windows settings/project/Git/restore/retention guards and the known
mandatory image-inventory failure remain unchanged. Prior27CI had four POSIX passes/
portable Windows success but both Windows storage jobs failed that positive before
bytes (links2 vs one-link guard). No native Windows11/WSL or all-green claim.

Next: human **GPT-6.1 Sol Medium** for exact source28 CI/package checks and concrete
display-only native review preparation against existing selected metadata. Optional
observer reception/storage, changed-code trust/restart and any separate model-run
usage remain explicit human steps. See [handoff](docs/continuation/HANDOFF.md),
[delivery plan](docs/continuation/DELIVERY-PLAN.md), [setup](docs/setup.md),
[runtime access](docs/runtime.md) and [privacy](docs/privacy.md).
