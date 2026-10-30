# WS-L2 implementation candidate

Sol High implemented the [WS-L2 correction contract](WINDOWS-STORAGE-CI-REVIEW-2026-10-29.md).
Async operation frames isolate concurrent fixture children, preserve nested ownership,
refuse detached work from closed frames and latch uncertainty on a thrown spawn.
Global child/IO barriers and sticky cleanup refusal remain. Concurrent storage
positives, descendant checks, production source and historical audits are unchanged.

The copied diagnostic now uses exact, single-occurrence instrumentation markers,
initializes trace state before early failure, attaches stderr after the returned
child exists, and preserves lifecycle receipts and settlement. It tracks fixture IO
and requests, stops on uncertainty, retains unresolved owned roots, restores spawn
interception and preserves primary/cleanup failures internally. Terminal failure
output uses a fixed label. Native copied C#/PowerShell transformations are unchanged.

New portable checks execute LF/CRLF generated bridges against synthetic dependencies
and exercise missing/duplicate marker refusal, bounded diagnostic labels, spawn throw,
normal/nonzero close, expiry, safe cleanup and unresolved request/IO retention. The
lifecycle VM suite adds raced abort, nonzero terminator close, known exit without
close, duplicate failure events, timer/listener disposal and elapsed shared hook budget.

Local Node 24.22.0: 22 focused tests passed, 43 VM cases passed; full offline suite
408 passed / 123 platform skips / zero failures, three mods validate and four replay
fixtures pass. The full run preceded the final diagnostic IO wrappers and deterministic
sibling-test refinement; affected focused tests and shape preparation passed afterward.
Local Node 22 and Windows execution are unavailable. Hosted corrected-source CI and
Astra Extra High final diff/evidence review remain required; no acceptance claim yet.

Native permissions/config unchanged; collector disabled/unloaded; v4 trial remains
held. No native client, install/trust action or trial started. All 93 requirement
ledger dispositions are unchanged. Original failed CI remains evidence.

## Corrected-source hosted result

Candidate `50af5709395ce5496e3fb8b3829634cd15e83c74`, tree
`1b4fa5171c2679587ee086860ea6411ec36ede55`, passed all seven jobs in
[run 40999690611](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40999690611).
Windows NTFS used actual Node **22.23.4** and **24.22.1**. Each passed 12 copied-bridge
regressions, 25 storage tests and 97 owned-process tests, with zero skips. The copied
state trace and 43-case transport simulation passed on both. All four POSIX full-suite
jobs and the portable Windows job passed. Exactly one corrected-source run occurred.

This clears the hosted execution gate; Astra Extra High final diff/evidence review
remains pending before WS-L1/WS-L2 acceptance. These results do not approve the native
Codex trial or establish arbitrary descendant closure. Native permissions, disabled
collector and all requirement dispositions remain unchanged.
