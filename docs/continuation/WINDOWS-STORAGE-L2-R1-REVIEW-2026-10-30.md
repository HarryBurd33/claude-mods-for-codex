# WS-L2-R1 final review: bounded storage milestone accepted

October 30, 2026. Serial review on the human-selected GPT-6 Astra / Extra High.
**R1 is resolved; WS-L1, WS-L2 and WS-L2-R1 are accepted within their frozen scope.**
No remaining actionable finding was identified in this correction. This closes the
source/test storage milestone, not the full project, native Codex host acceptance or
a release. This is cross-model review of Sol's implementation, not a new independent
security-agent assessment.

Reviewed implementation `71da77dcf698ebb6c9929ea00b3404e2c8860968`, tree
`9570cf7e1138922dfb09a42794bf0ca8e15736d0`, against review baseline
`54733050fa90c84b473988f5610e30bcac63fe1a`; result documentation is at
`3fdf54ca1eb727ffecba678f4a3aa50e1f27b005`. The
[manifest](WINDOWS-STORAGE-L2-R1-REVIEW-2026-10-30.json) pins the reviewed files and
evidence. The [implementation result](WINDOWS-STORAGE-L2-R1-RESULT-2026-10-29.md),
[previous review and R1 contract](WINDOWS-STORAGE-L2-REVIEW-2026-10-29.md), original
contracts, audits and failure records retain their historical bytes and conclusions.

## R1 resolution

When fixture IO is queued, an enclosing operation can close or its signal can abort
before the callback starts. Previously, the callback could still perform its effect
and only then reject. `OwnedFixtureScope.io` now calls `this.check(signal)` inside
the queued callback immediately before `operation()`. The check observes the inherited
async frame, its ancestors, sticky uncertainty and the current signal. There is no
asynchronous gap between that check and invoking the callback.

Initial and post-IO checks, immediate global/ancestor pending registration and
`finally` removal are unchanged. The parent-close regression rejects both promises
with zero callback invocations, drains tracked IO and preserves sticky cleanup
refusal. The queued-abort regression likewise invokes no callback, rejects with
AbortError, drains pending IO and permits cleanup when nothing is unresolved.
The healthy overlapping/nested positive returns 42 and 17, keeping cleanup blocked
until the remaining operation completes. The three new tests use only counters and
promises; they create no real process or fixture filesystem write.

Source review confirms ancestor pending entries are removed on every settled IO
path. The new check neither clears the sticky flag nor changes child-close tracking.
The global cleanup barrier and separate deliberate-descendant absence requirement
remain intact. This correction does not cancel arbitrary work already started by a
callback or extend the fixture's ownership to unrelated processes.

## Acceptance evidence

| Gate | Final disposition and evidence |
| --- | --- |
| WS-01–10 | Accepted within the original contract. Prior transport/caller review and the retained 43-case simulation cover the required ordering, receipts, failure/deadline behavior and telemetry sequencing. Production source and the simulation are unchanged by R1; corrected-source hosted jobs pass. |
| WS-11 | Accepted. Existing child/IO and descendant safeguards remain, and R1 now refuses queued effects after closure or cancellation. Sticky uncertainty still prevents root deletion. |
| WS-12 | Accepted for the specified hosted storage/process fixtures. Both exact-source Windows NTFS jobs pass, including the previously required owned-process steps. This is not native Codex host acceptance. |
| WSL2-01, 04–06 | Prior reviewed sibling isolation, copied instrumentation/diagnostic cleanup and additional transport coverage remain unchanged; corrected-source CI passes. |
| WSL2-02/03 and R1 | Accepted. The execution-boundary check plus the three targeted regressions close the only outstanding review finding, preserving nested ownership and cleanup behavior. |
| WSL2-07/08 | Accepted. Required local verification, the one corrected-source hosted matrix and this final diff/evidence review are complete. |

[CI run 41005748850](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/41005748850)
is terminal success on exact candidate `71da77d`, attempt 1, with all seven jobs passed.
Fresh GitHub readback confirms the candidate and terminal result. Original logs show
actual Windows Node 22.23.4 and 24.22.1: each has 12 copied-bridge regression passes,
25 storage passes and 97 owned-process passes, with zero skips. Each also passes the
actual copied diagnostic and 43-case transport simulation. The four POSIX full-suite
jobs and Windows portable job pass; the logs include the three new R1 regressions
passing in all four POSIX jobs.

Saved local Node 24.22.0 evidence confirms 13 focused passes, full suite 411 passes /
123 platform skips / zero failures, validation of three mods and four replay fixtures.
Local Windows and Node 22 were unavailable; hosted results supply those scoped gates.
This review inspected existing outputs and exact source, without rerunning completed
tests, CI, UI checks, archive checks or the native trial. No new runtime test result is
claimed. Documentation verification checks manifest pins, links, scope and privacy.

## Scope and native hold

R1 changes only the shared test fixture and its test, plus status/result documentation.
The other eleven source pins from the previous review match. Production source,
workflow, diagnostic, package/cache, original contracts/audits/results and requirement
ledger remain unchanged. This review publishes only its new records and current
status. No data roots, executable processes, network destinations, retained runtime
data or production model usage are added by the correction. No install or permission
change is part of this review; GitHub publication is the requested development push.

Read-only checks confirm the collector remains disabled and unloaded and the saved
v4 review seal is unchanged. Native configuration bytes have changed since that
baseline: exactly three added leaves, two under marketplaces (`source`, `source_type`)
and one plugin `enabled` leaf. All existing leaves, including sandbox/approval/reviewer
and project/hook trust leaves, match. The additions were retained; their origin and
startup implications were not established. No live configuration was written or
baseline silently accepted. Private identifiers and values remain in ignored records.

The native v4 trial remains held and was not restarted. Any future batch requires
fresh drift review, prerequisite checks and explicit approval before native actions;
this storage acceptance supplies none of those permissions. All 93 requirement
dispositions remain unchanged. Broader native integration, platform/authoring/UI
acceptance and frozen-candidate release work remain outside this completed milestone.
