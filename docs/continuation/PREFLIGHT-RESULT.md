# Single read-only preflight stopped on unsafe ancestor

2026-10-26, Sol Medium, localb3413ca. Human explicitly authorized the one20second,
zero-retry preflight through the verified checker. Exactly one invocation occurred.

**Result: review-required / unsafe-directory,0.002seconds.** The first selected
file check began, but an ancestor failed the reader's directory safety policy before
any selected file content was read. Selected files completed0; source files checked0;
future-root absence not checked. No further target lookup, link resolution, retry,
permission repair or path substitution was performed.

The report deliberately does not identify the offending ancestor. Do not guess which
directory or owner/mode caused it, claim that the CLI binary drifted, or treat this
as a Codex runtime failure. This was a static preflight policy refusal, not native
execution or Stop delivery evidence.

## Preserved state and evidence

Private .local/preflight-run records current authorization, prior gate bytes and a
fixed result summary. .local/preflight-checker/ATTEMPT.json and OBSERVATION.json are
the exclusive real attempt/result and must be preserved. The original unused-grant
record remains historical; **this attempt has consumed that grant**. Its older
false started/consumed fields cannot be reused as authority. No marker recovery,
deletion, replacement or rerun is allowed.

The private read gate was briefly enabled for the expressly authorized invocation
and restored byte-for-byte to its original false value afterward. This is a task
tool control, not Codex configuration/trust or a product admission gate. Native
inspection/live gates remain closed. Checker source, binding, expected hashes, old
two-file reader, original observations and selected source snapshot unchanged.

No native client/help/version/UI, inference, network, setup, native config/trust
write or baseline adoption. Installed31/logging/model/permissions/human trust/Windows
guards unchanged. No selected file content retained; only ancestor metadata was
consulted during the rejected first check. No new product test/CI/package result.

## Next boundary

Current request is complete at its mandatory stop condition. Preserve the failure;
do not continue with other targets or bypass the ancestor rule. Any further selected
path metadata/content inspection requires a new exact bounded grant. Do not repair
permissions or resolve links under the consumed grant. Consequential directory
policy/path-selection/security changes require Sol High and separate scope.

Remain Sol Medium for records-only result verification or preparing a precise next
decision. No additional target action is authorized. New records-only verifier reads
task artifacts/source bytes only; the old checker VERIFY.py intentionally expects
no real attempt and must not be rerun as if the preflight were still unstarted.

Current no-network instruction still prevents GitHub upload/remote verification.
New local checkpoint/publication-pending receipt records exact commit/tree privately.
Original other-chat input/review/generations/heartbeat/.gitignore remain untouched.
No worker or background continuation created; full product/native acceptance incomplete.
