# WS-L2-R1 implementation result

Sol High implemented the exact [R1 correction](WINDOWS-STORAGE-L2-REVIEW-2026-10-29.md):
`OwnedFixtureScope.io` checks the signal and ownership context again inside the queued
callback, immediately before calling the operation. Initial/post-IO checks, immediate
pending registration, ancestor tracking, `finally` removal and sticky uncertainty remain.

Three new deterministic regressions use counters and promises, with no real processes
or fixture filesystem writes. The two-microtask parent-close case rejects both promises,
invokes no callback, drains pending IO and retains sticky cleanup refusal. Abort after
queueing invokes no callback, rejects with AbortError and drains otherwise safe IO.
Healthy nested/overlapping operations return 42 and 17 and keep cleanup blocked until
both finish. All existing lifecycle regressions remain.

Local Node 24.22.0 verification: 13 focused tests pass; full offline suite 411 pass /
123 platform skips / zero failures; three mods validate and four replay fixtures pass.
Local Windows/Node 22 verification is unavailable. One corrected-source hosted matrix
and Astra Extra High final diff/evidence review remain required before acceptance.

Only the shared fixture and its test changed, plus current status and this result.
Production source, workflow, diagnostic, all previous contracts/audits/results, ledger,
package and installed cache remain unchanged. Native permissions/config unchanged,
collector disabled/unloaded, and v4 native trial remains held. No native client,
installation, trust change or trial started. All 93 requirement dispositions remain.

## Corrected-source CI passed

Candidate `71da77dcf698ebb6c9929ea00b3404e2c8860968`, tree
`9570cf7e1138922dfb09a42794bf0ca8e15736d0`, passed all seven jobs in
[run 41005748850](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/41005748850).
Actual Windows Node 22.23.4 and 24.22.1 each passed 12 copied-bridge regressions,
25 storage tests and 97 owned-process tests, with zero skips. The copied diagnostic
and unchanged 43-case transport simulation passed. All four POSIX full-suite jobs
and Windows portable contracts passed. Exactly one corrected-source hosted run was
used; no unchanged workflow was rerun.

Astra Extra High final diff/evidence review remains required before WS-L1/WS-L2/R1
acceptance. Earlier results remain evidence for their own commits. Native permissions,
collector-disabled state and v4 native trial hold remain unchanged.
