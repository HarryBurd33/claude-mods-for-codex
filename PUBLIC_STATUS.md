# Current project status — source25 — 2026-10-24

macOS acceptance is the current priority. The [93-row audit](docs/continuation/MACOS-ACCEPTANCE.md)
and [bounded native batch](docs/continuation/MACOS-BATCH.md) record what is verified
on unchanged installed dev10 and what remains incomplete. Next is High review of
selected-scope retention management; Windows remains incomplete and deferred.

Source **0.2.0-dev.25** is a development checkpoint on `codex/astra-groundwork`.
The full [93-capability ledger](docs/continuation/REQUIREMENTS.md) remains incomplete;
the default branch retains the earlier experimental MVP.

The source25 code milestone was a proof-only installed-image read inventory. It retains
the original strict-code profile and adds an explicitly named Installer inventory
profile for fixed images beneath the fresh SDK-bound Program Files/Git location.
Neither profile grants execution or private-data authority. No candidate Git is
launched, and all production Windows settings/project/Git/restore gates stay closed.
[Design, tests and observed results](docs/continuation/DEV25-REVIEW.md).

Installed human-trusted **dev10** and its logging scope remain unchanged. Source25
is uninstalled. Earlier macOS native UI/hooks/preview observations do not certify
this source. Native Windows11 Codex and WSL acceptance remain unverified.

macOS acceptance is the human-selected priority; the audit/current native batch
is recorded above. Historical latest full-source test evidence follows:
Local and four POSIX CI lanes passed189 tests with108 Windows-only skips.
Windows storage checks passed25 per lane; process checks passed84/85. The mandatory
real-image read is still refused (observed2links versus the one-link guard).
No real image bytes/hash/imports were obtained. This experiment remains incomplete.
The [delivery plan](docs/continuation/DELIVERY-PLAN.md) gives the remaining work and next macOS batch.
The latest reviewed source24 archive is documented in
[PACKAGE-DEV24](docs/continuation/PACKAGE-DEV24.md); source25 packaging is outstanding.
Static read samples do not establish binary authenticity, loader/dependency trust,
version or native compatibility. Keep the original execution/private-data policies
and normal Codex permissions separate.

Use [setup](docs/setup.md), [runtime access](docs/runtime.md) and
[privacy](docs/privacy.md) for the implemented tools and their access. Current
continuation instructions are in the [handoff](docs/continuation/HANDOFF.md);
historical results and failures remain in the [test log](docs/continuation/TEST-LOG.md).
