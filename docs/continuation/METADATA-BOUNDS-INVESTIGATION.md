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

The5s check is cooperative between synchronous file operations, not a hard wall-time
limit on WriteFile/FlushFileBuffers. Historical Node24 maximum-positive passed in
427.0748ms; that contrast still does not identify the Node22 historical failure.
A preservation check found only prior owned hook hashes plus two unrelated
node_repl environment fields differing from the pre28 backup. Values were not
returned/changed; origin/timing of external drift was not instrumented. No restore
or unrelated configuration repair. Installed28/settings/owned trust remain intact.

Diagnostic source [249a69e32a317bb5fee92222c6761698af0b7c3a](https://github.com/HarryBurd33/claude-mods-for-codex/commit/249a69e32a317bb5fee92222c6761698af0b7c3a),
tree9cdb15d2bfd9f5c92cdb50afb416cb989764ae85, parent7f51e99. Equivalent local
21915dcb38ea1b807c8032d65e153028951c8ac5 retained in
codex/metadata-bounds-diagnostic-local-checkpoint. Full-tree/fetch and anonymous
remote ref matched; no force push/history loss/private upload. Diagnostic
[CI40151191583](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40151191583)
uses that exact source. Local347total235pass/0fail/112Windows-only skips; four
POSIX CI jobs same counts and portable Windows passed. NTFS results pending at
this interim entry; final observations below supersede the pending state.

## Final diagnostic CI and disposition — 2026-10-24

One diagnostic run40151191583, exact249a69e, all7final jobs/decoded logs retrieved:

| Job | Observed result |
| --- | --- |
| macOS24 /121042907502 | 235pass/0fail/112Windows skips347total |
| macOS22 /121042907515 | 235pass/0fail/112Windows skips347total |
| Ubuntu24 /121042907595 | 235pass/0fail/112Windows skips347total |
| Ubuntu22 /121042907606 | 235pass/0fail/112Windows skips347total |
| Windows portable /121042907411 | Success, including source29 impact contracts; no native Codex acceptance |
| Windows NTFS22 /121042907579 | 25storage passes;85pass/1fail86process proofs. Bounds299.7592ms and diagnostic self-test60.854ms passed |
| Windows NTFS24 /121042907649 | 25storage passes;85pass/1fail86process proofs. Bounds314.0449ms and diagnostic self-test59.9811ms passed |

The C# proof source compiled and its new fixed-frame self-test actually ran on
both Windows lanes. Parent inventory matched after both maximum positives. Both
remaining failures are the unchanged mandatory installed cmd/git Image refusal,
links2, before bytes/sample/hash/import/version/execution. No guard/assertion waived.

The original metadata-bounds failure **did not recur**. Its historical root cause
and phase remain unknown; timing contrast does not prove OS latency or deadline.
Diagnostic changes are not claimed to fix that failure. No retry of the same
source until green, source30/version bump, speculative security repair or new
Windows feature was added. The historical reliability gap stays explicit in PL-04
and Windows acceptance remains incomplete/gated. If it recurs, inspect the fixed
phase/kind/cleanup frame and independent inventory result, retaining the failure.

Disposition: bounded triage/observability is complete for this stage; continue
macOS acceptance under unchanged Windows gates. This does not waive a Windows
release criterion or claim all-green. Native Windows11/WSL unverified. Further
Windows policy/strict-syscall-deadline work remains later; do not extend this into
a proof/package-only loop. Next exact model GPT-6.1 Sol Medium.

Source29 product runtime/UI/settings/default hooks are byte-unchanged by249a69e.
The exact234file archive from dddd49a remains verified and may be used as the
explicit immutable source29 native candidate, with its original proof/test/docs
snapshot disclosed. Do not claim its proof bytes equal249a69e. No need to repack
solely for diagnostic notes; if selecting a newer package including proof changes,
verify that new exact archive separately. No installed snapshot was modified.
