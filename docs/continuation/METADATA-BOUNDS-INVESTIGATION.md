# Bounded metadata-scratch proof investigation — 2026-10-24

High resumed7f51e99 to investigate CI40140487633 Node22 job121011005347 test46.
Original result remains a failure:10,286.6228ms, generic harness-failed. Node24
counterpart passed; neither result identifies the failing phase or root cause.
No retry-until-green, budget/guard weakening or new Windows feature work.

## Source finding and diagnostic change

The maximum positive creates/flushes32MiB index+1MiB exclude under the existing
5,000ms constructor budget. Size mismatch, constructor refusal, final budget check
and disposal/root-presence failure were all lost in Harness's generic catch.
The10s observation does not prove a5s budget expiry or cleanup fault.

Proof-only GitMetadataScratch.cs now distinguishes the same5s refusal as an
IOException subtype. Its existing constructor cleanup/rethrow path attaches only
fixed stage and cleanup-result labels to the original exception, never a path,
message, stack, command or native error. No failure is converted to success.
Harness metadata-bounds emits one fixed bounded phase/kind/cleanup frame on failure
and still exits1. Other modes retain generic errors. Typed HEAD/index/exclude
bounds, checks, file rights, sharing, flush and empty-only cleanup are unchanged.
No production src/helper/settings/hook code or product version change.

The actual Windows test still requires bounded and exact parent inventory. It now
also checks inventory after child failure and preserves both independent failures.
A separate actual Windows self-test supplies hostile diagnostic fields/messages
and checks fixed frames for IO/deadline/cancellation/access/other; these are test
exceptions, not user/project data. Local OS skips are not C# compilation/native
validation. One CI run on the diagnostic source will provide that evidence.

Installed28/logging/trust/exports unchanged. Source29 macOS impact runtime and its
verified234-file archive remain versioned in PACKAGE-DEV29; diagnostic proof files
in a newer package are different bytes and must be inventoried if packaged. No
native29/Windows acceptance, model run, guard-category choice or installation.

High will read the single diagnostic run, preserve any non-recurrence as limited
evidence, then return routine work to Medium. If the failure recurs, use its actual
frame; do not infer the historical phase from a later successful run. macOS
acceptance remains the delivery priority after this bounded triage.
