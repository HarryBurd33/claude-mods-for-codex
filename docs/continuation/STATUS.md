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
UI checks passed, including synthetic mutation refusal. No new native run, install,
trust, configuration change or optional event delivery. Source27 package/CI/loaded
native acceptance is pending; [review](DEV27-REVIEW.md) and latest TEST-LOG hold
exact evidence. No all-green CI or Windows compatibility claim.

Installed **human-reviewed dev26 remains frozen**. All210cache files still match
its configured immutable fixture; private settings SHA unchanged. Its bounded
[native hooks/panel/authorized Watch4→7](NATIVE-DEV26.md) results belong to26,
not27. Existing selected usage export is unchanged and never implicitly supplies
observation access. No production cleanup or further model/API run authorized;
latest one-run grant is consumed. Reviewed10 remains a selective rollback source.

Windows remains in scope and later in the human-selected delivery order. Existing
settings/project/Git/restore/retention gates and mandatory image check are unchanged;
new observation file IO refuses before options/path access. CI40128013186 previously
had four POSIX successes/portable success and both Windows storage jobs failing the
retained installed-image positive (25storage passes/84of85process proofs each,
post-refusal links2 vs one-link guard). No image read/hash/import/execution or native
Windows11/WSL acceptance is established. Do not resume another Windows proof loop.

Next exact setting: **GPT-6.1 Sol Medium** for source27 CI readback, exact package/
spaced-path verification and concrete review/native acceptance preparation. Keep
installed26/logging/trust unchanged unless a supported update is deliberately
prepared with human review. Explicit observer storage/event selection and fresh
bounded native-run authorization remain protected. Stop for High before new
consequential code/security work or a new correctness failure. macOS accessibility,
lifecycle/loaded disable/older rollback/themes/routing/context/authoring and other
platform acceptance remain incomplete; no full-product completion claim.
