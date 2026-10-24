# Current project status — source27 — 2026-10-24

macOS acceptance is the current priority. Source **0.2.0-dev.27** adds explicit
read-only [command/turn export observations](docs/event-observation.md), a separate
runtime read opt-in and an owned-panel outcome table. It distinguishes command
status, nonzero exit, failed turns and stream errors without retaining raw content.
There is no released failure hook in the reviewed CLI163/164 interface; the export
is a disclosed snapshot approximation. Optional Stop/Interrupt observers remain off.
Source27 is not installed or natively verified. Human-reviewed dev26 stays frozen.

Source26's POSIX [selected-scope retention CLI](docs/retention.md) remains available:
read-only preview followed by explicit fingerprint-confirmed cleanup. No production
cleanup, automatic recovery or Windows gate change. [Prior review](docs/continuation/DEV26-REVIEW.md).

Independent MIT-licensed project; not affiliated with or endorsed by Anthropic or OpenAI.

This is a development checkpoint on `codex/astra-groundwork`, not a finished release.
The default branch retains the MVP; the [93-capability ledger](docs/continuation/REQUIREMENTS.md)
remains incomplete. Configured dev26 is installed in the local Codex user profile,
with210verified cache files and three hooks personally reviewed/trusted. **Desktop
restart completed; bounded dev26 native acceptance passed as recorded below.** Existing settings/rules/logging
scope are unchanged; no production data cleanup. Reviewed10 remains for rollback.

Prior source26 public clone:208tests passed/0failed/109Windows-only skips. Inspected210-file
archive and fresh spaced extraction:33focused passes/0fail/1skip plus validate3/
replay4. [Package/install record](docs/continuation/PACKAGE-DEV26.md). CI40128013186:
four POSIX lanes pass; Windows portable passes; both Windows storage lanes retain
the known failed image check. Packaging is not native-host or full-platform proof.

[Native dev26 results](docs/continuation/NATIVE-DEV26.md): two harmless exact
rewrites, unchanged control and expected denial passed; six owned views/local
preview rendered. One freshly authorized Sol Medium read-only run completed in
7.3s; Watch showed4→7records in the unchanged selected scope. Grant consumed,
Watch stopped; no production cleanup or further model run authorized. Full
lifecycle/accessibility/events and the93-capability product remain incomplete.

Windows stays in scope and deferred. Its unchanged mandatory real-image check
previously failed before bytes (observed2links versus the one-link guard). No
candidate Git execution, image hash/import/version or native Windows11/WSL result.
All production Windows gates remain closed. [Failure record](docs/continuation/DEV25-REVIEW.md).

The source27 implementation/review is complete for its stated scope; next is
routine packaging/CI readback on Sol Medium. Native optional-event acceptance,
export selection, changed-code trust and any extra model run remain separate
human steps. Keep the logging scope and installed snapshot unchanged meanwhile.
No native UI restyling, automatic trust, extra model/API run or full-product
completion is implied. The [delivery plan](docs/continuation/DELIVERY-PLAN.md) retains remaining work.

Use [setup](docs/setup.md), [runtime access](docs/runtime.md) and
[privacy](docs/privacy.md) for the implemented tools and their access. Current
continuation instructions are in the [handoff](docs/continuation/HANDOFF.md);
historical results and failures remain in the [test log](docs/continuation/TEST-LOG.md).
