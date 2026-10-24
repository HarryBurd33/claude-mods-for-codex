# Current status — source27 observations — 2026-10-24

Source **0.2.0-dev.27** is a runnable development checkpoint on
`codex/astra-groundwork`. The [93-capability ledger](REQUIREMENTS.md) remains
incomplete; the default branch retains the earlier experimental MVP.

The new [observation CLI/MCP/panel workflow](../event-observation.md) summarizes
one explicitly selected private exec JSONL export. It separates command status,
zero/nonzero/missing exits, started/completed/failed turn records and stream errors.
This is a disclosed snapshot approximation: reviewed CLI163/164 have no
PostToolUseFailure hook, PostToolUse does not certify exit0, and interrupted exec
turns may omit a terminal record. No result-text scraping or missing-event inference.

The optional Stop/Interrupt/state lane retains only event/time and always returns
empty control output. Source27 tests busy/config failure/default-off/scope/privacy;
the optional manifest now respects the three-second Interrupt/SessionEnd limit.
Reception/trust and storage are separate explicit opt-ins. No default registration,
journal field or current capture selection changed. No raw payload retention.

Local Node24.22.0/macOS14.6 suite:217pass/0fail/110platform-only skips327total;
validate3mods/replay4fixtures. Parser/private-file/CLI/MCP and simulated accessible
UI checks passed, including synthetic mutation refusal. These are source tests, not native event delivery. [PACKAGE-DEV27](PACKAGE-DEV27.md)
now verifies the exact public archive,46focused spaced-package passes/0fail/2skips
and four POSIX CI lanes217pass each. Windows portable passed including the new
refusal; both Windows storage jobs retain the known failed real-image check.
No all-green CI or Windows compatibility claim.

Configured **source27 is installed and human-trusted, restart/native acceptance
pending**. Human explicitly authorized the359-byte public synthetic observation
fixture and same-ID update. New private settings copy adds only observationExport;
logging project/session scope/rules/data/usage selection and optional events remain
unchanged. All217cache files match the reviewed immutable54c2330 snapshot plus
three disclosed private overlays. Shared config matched before human review;
then only three owned trusted_hash fields changed. Everything else preserved.

No new native/model/API run or production cleanup; prior extra-run grant consumed.
[NATIVE-DEV26](NATIVE-DEV26.md) results belong to the earlier snapshot. Reviewed26/10
remain selective rollback sources. Installation is user-profile/cache scope,
not project-only. Cache/trust do not attest the loaded desktop process.

Windows remains in scope and later in the human-selected delivery order. Existing
settings/project/Git/restore/retention gates and mandatory image check are unchanged;
new observation file IO refuses before options/path access. CI40128013186 previously
had four POSIX successes/portable success and both Windows storage jobs failing the
retained installed-image positive (25storage passes/84of85process proofs each,
post-refusal links2 vs one-link guard). No image read/hash/import/execution or native
Windows11/WSL acceptance is established. Do not resume another Windows proof loop.

Next action: **restart Codex and reopen this chat on GPT-6.1 Sol Medium**. Verify
actual source27 tool discovery, owned outcome table/fixed synthetic counts/labels
and harmless ordinary hook behavior after reload. Preserve logging scope, human
trust and selected fixture; optional lifecycle storage/reception and any additional
bounded model run still require fresh explicit selection/authorization. Stop for High before new
consequential code/security work or a new correctness failure. macOS accessibility,
lifecycle/loaded disable/older rollback/themes/routing/context/authoring and other
platform acceptance remain incomplete; no full-product completion claim.
