# WS-L1 implementation candidate

The reviewed [WS-L1 contract](WINDOWS-STORAGE-CONTRACT-2026-10-29.md) now has a
production implementation candidate on human-selected Sol High. Repair acceptance
still requires exact-source Windows Node22/24 CI and Astra Extra High diff review.

The transport reports immutable, sanitized helper/terminator lifecycle snapshots on
request failures. It reconciles both direct roles until observed close or the original
finite deadline; late events cannot become success or reset cleanup. The generic
error message, input/response limits, fixed executables, environment allowlist and
native storage admission remain. Journal failure now ends optional hook telemetry
before a state write. Descendant closure and rollback are never inferred.

The explicit VM command exercises39 synthetic cases, including the three original
failure traces, reverse close, missing close/PID, spawn/kill errors, output/stream
failure, delayed deadlines, hook sequence suppression and caller propagation. It
loads real module bodies with fixed synthetic dependencies and starts no real helper.
An initial caller test supplied a cross-realm scope object and correctly hit the plain
object validator; constructing it in the VM corrected the fixture. The original audit
is retained unchanged. This new suite is a regression check, not Windows OS evidence.

Windows storage fixtures now track spawned direct children and fixture writes,
await concurrent siblings, propagate test signals to direct request wrappers,
and refuse root deletion while work or deliberate descendant absence is unresolved.
The existing lifecycle helper stays unchanged. Separate observer/lock wrappers remain
outside this repair. Cancellation of indirect public calls does not establish child
closure; the tracked-child cleanup guard must still refuse deletion when unresolved.

Local Node24.22 verification: full suite392pass/123platform skips, focused lifecycle/
storage9pass/17Windows skips, three mods validate and four replay fixtures pass.
The full run preceded the final direct-request test wrapper and expanded VM-only
caller checks; the affected focused checks and new39-case suite passed afterward.
No local Node22 or Windows OS pass is claimed. Hosted CI is pending at publication.

WS-01–09 have new simulated checks; WS-10 has state/journal propagation, prune-stop,
observer-stop and unavailable-usage checks. Existing owned-fixture regressions plus
new Windows fixture guards address WS-11, subject to actual Windows execution and
diff review. WS-12 is pending hosted CI. No whole-contract acceptance is claimed.

Those were candidate-stage claims: the failures below and subsequent review establish
that the concurrent attribution and cleanup guards do not yet satisfy WS-11.

Native permissions/configuration, collector-disabled state, the v4 approval hold,
installed plugin, original audit and93 requirement dispositions are preserved. No
native client, trial, hook registration, install/trust action or release was started.

## Exact candidate CI failed; acceptance stopped

Candidate `60c44f944abfac41d874ad4cfa9851c124024a2c`, tree
`a52169c4dd6279b1a24cec0de72e229b6ddd2fc4`, ran
[CI40986490389](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40986490389).
All four POSIX Node22/24 jobs and the Windows portable job passed. Both Windows
NTFS Node22/24 jobs failed; each storage invocation reported13pass/12fail. The later
owned-process step was not reached. This is not WS-12 acceptance.

The first failing storage case is concurrent journal append. Node24 logs include
`Storage operation and close failed` / `Storage helper close unresolved`; subsequent
cases refuse with the fixture scope's sticky unresolved state. Node22 also fails that
concurrent case and then refuses subsequent work. Source inspection identifies a
fault in the new wrapper's use of `OwnedFixtureScope.externalIO`: simultaneous
observers each capture other requests' children. An early finishing request can
therefore label its still-running sibling as unresolved. This is a supported causal
explanation, not proof that no production issue remains. Do not remove cleanup guards
or serialize away the required concurrent positive to obtain a pass.

The always-run copied-helper diagnostic also fails `Bridge diagnostic shape` because
its exact source-string instrumentation no longer matches the changed transport.
Its source is outside WS-L1's permitted implementation list. Neither that diagnostic
nor the shared lifecycle helper was changed to suppress the failure. No unchanged
CI rerun was attempted.

The [Astra Extra High review](WINDOWS-STORAGE-CI-REVIEW-2026-10-29.md) now defines
WS-L2: request-specific ownership, conservative spawn-attempt handling, bounded copied
diagnostic migration/cleanup and missing regressions. Its new audit reproduces two
fixture gaps without real processes. Preserve original failures, concurrency, cleanup
refusal and finite deadlines. WS-11/12 and full repair acceptance remain open.
