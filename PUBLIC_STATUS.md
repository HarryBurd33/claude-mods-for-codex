# Current project status — source27 — 2026-10-24

macOS acceptance is the current priority. Source **0.2.0-dev.27** adds explicit
read-only [command/turn export observations](docs/event-observation.md), a separate
runtime read opt-in and an owned-panel outcome table. It distinguishes command
status, nonzero exit, failed turns and stream errors without retaining raw content.
There is no released failure hook in the reviewed CLI163/164 interface; the export
is a disclosed snapshot approximation. Optional Stop/Interrupt observers remain off.
Configured source27 is installed and human-trusted; desktop restart/native27
acceptance is pending. [Package/install record](docs/continuation/PACKAGE-DEV27.md).
The only new read opt-in is an explicitly authorized public synthetic fixture;
logging scope/rules/usage selection and optional-hook defaults are unchanged.

Source26's POSIX [selected-scope retention CLI](docs/retention.md) remains available:
read-only preview followed by explicit fingerprint-confirmed cleanup. No production
cleanup, automatic recovery or Windows gate change. [Prior review](docs/continuation/DEV26-REVIEW.md).

Independent MIT-licensed project; not affiliated with or endorsed by Anthropic or OpenAI.

This is a development checkpoint on `codex/astra-groundwork`, not a finished release.
The default branch retains the MVP; the [93-capability ledger](docs/continuation/REQUIREMENTS.md)
remains incomplete. Configured dev27 is installed in the local Codex user profile, with217verified
cache files and three hooks personally reviewed/trusted. **Restart/native27
acceptance is pending.** Earlier bounded dev26 results remain historical below.
Existing logging scope/rules/usage selection are unchanged; the authorized
359-byte synthetic observation fixture is selected through a new private settings
copy. No production cleanup. Reviewed26/10 remain for selective rollback.

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

Source27 packaging/CI readback and supported update/human trust are recorded in
[PACKAGE-DEV27](docs/continuation/PACKAGE-DEV27.md):217-file archive,46focused
passes/0fail/2skips; four POSIX CI lanes217pass each and portable Windows pass.
Both Windows storage jobs retain the known failed image check. Next: restart and
reopen this chat on Sol Medium for actual loaded27 native acceptance. No extra
model run or optional lifecycle logging is authorized by that step.
No native UI restyling, automatic trust, extra model/API run or full-product
completion is implied. The [delivery plan](docs/continuation/DELIVERY-PLAN.md) retains remaining work.

Use [setup](docs/setup.md), [runtime access](docs/runtime.md) and
[privacy](docs/privacy.md) for the implemented tools and their access. Current
continuation instructions are in the [handoff](docs/continuation/HANDOFF.md);
historical results and failures remain in the [test log](docs/continuation/TEST-LOG.md).
