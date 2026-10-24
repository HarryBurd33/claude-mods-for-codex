# Current status — source24 Astra reliability review — 2026-10-24

Source **0.2.0-dev.24** is a development checkpoint on `codex/astra-groundwork`,
not a completed release. The default branch retains the earlier experimental MVP.
The full [93-capability ledger](REQUIREMENTS.md) remains in scope.

The installed, human-reviewed macOS package is still **dev10**. Earlier native
checks verified the owned dashboard, local preview/focus, covered hooks and an
opt-in exact print rewrite; those results do not certify source24. Logging remains
limited to the deliberately selected disposable project. Source24 is uninstalled.

This milestone separates concurrency correctness from finite wait budgets, adds
actual Windows lock-lifetime experiments, and improves failure evidence for Git
inspection. [Review and observed results](DEV24-REVIEW.md).
All seven CI jobs passed. Both Windows lanes passed22 existing storage/observer
checks,3 lock fixtures (two diagnostic), and75 process/security proofs. All four
POSIX lanes passed189 tests with98 Windows-only skips. This is not native Windows
Codex or WSL acceptance. No production lock change was justified by the experiment.
Windows dashboard settings, project/Git views and restore still refuse before IO.
The prior macOS availability refusal and exact older storage failure causes
remain unproved. No logging, trust, permission or production deadline expansion.

Use [setup](../setup.md), [runtime access](../runtime.md) and
[privacy](../privacy.md) for the implemented tools and their limits. Current
state and next human model switch are in the
[handoff](HANDOFF.md); version-specific evidence and all earlier
failures remain in the [test log](TEST-LOG.md).
