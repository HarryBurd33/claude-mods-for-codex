# Proposed five-second ancestor metadata observation — unapproved

2026-10-26, Sol Medium, following locale53a7c4. Request preparation only.
No new target metadata/content lookup, preflight retry, native/model/network activity,
configuration/trust change, permission repair or baseline adoption occurred.

The consumed preflight grant remains consumed. Its unsafe-directory result does not
name the ancestor. A new, narrower observation could identify a **current** policy
failure; it cannot retroactively prove which ancestor failed earlier if state changed.

## Exact proposed access

One traversal, maximum5seconds total, zero retries, using the existing reviewed
descriptor-relative parent walk and unchanged safe_directory predicate. Select only
the7fixed ancestors (including root) of the saved CLI path, ending at its containing
directory. Private SCOPE.json lists their exact strings derived from saved records;
no resolution, metadata lookup or path discovery was done to prepare them.

At each visited ancestor, audit existing metadata/policy inputs only: position,
selected path (private result), type, octal mode, root/current-user/other ownership
classification, group/other-write and sticky flags. No usernames/group names or raw
UID/GID lookup, directory listing, binary leaf open/stat/hash, config, Node, source,
environment, credentials, session/database discovery or sibling traversal.
Existing before/after binding metadata checks may revisit the same ancestor during
the single traversal; these are identity checks, not retries/new observations.

Stop at the first unchanged policy rejection, symlink, access/identity error or
deadline. Record the rejected index/path and fixed cause when the predicate supplies
it. If another error prevents identification, report inconclusive; if all pass, report
no current failure reproduced. Do not guess, continue to other targets, resolve links,
relax policy, choose alternate paths or repair anything.

Five seconds includes control verification, traversal and private evidence writes.
Use only a new private diagnostic gate/exclusive attempt/result in
.local/ancestor-request. Keep the earlier preflight gate closed and its markers/result
untouched. No Codex config/trust or product admission change. A deadline/partial marker
requires review, never deletion/retry. Existing POSIX timer limitations are unchanged:
no guaranteed interruption of uninterruptible kernel IO, no spawned child.

## Concrete inert preparation

SCOPE.json, OPERATION.py.txt (unexecuted operation), false OPERATOR-REVIEW.json and
exact future command are private. It instruments the existing directory-policy
callback, calls the original predicate and rethrows its refusal; it introduces no
replacement permission/path walker or policy change. The patched callback is restored.
Existing checker source pins remain unchanged.

Eight synthetic in-memory metadata tests pass: first unsafe stop/index/cause, owner
classification, current-only success, callback restoration, binding/symlink refusal
without false identification, scope mismatch and closed default entry. The actual
parent walker was not called in those tests; no target metadata was consulted.
This is preparation evidence, not a completed host check.

## Approval question

“May I perform one5second metadata-only observation of the saved CLI path's7ancestors,
stopping at the first failure under the unchanged policy, with zero retries?
Only private task gate/evidence records may be written. No binary/file contents,
directory listings, link resolution, permissions/policy changes, native execution,
inference, network, config/trust changes or baseline adoption.”

The old grant cannot authorize this new observation. Agreement must explicitly
authorize this exact scope; until then the operation remains closed. After approval,
verify the exact operation/checker hashes and inherited paths before one invocation.
Consequential security/policy changes require High; current proposal only reuses
existing policy. No full-product/native compatibility result follows.

Local docs/checkpoint only. GitHub upload remains blocked by no-network instruction.
