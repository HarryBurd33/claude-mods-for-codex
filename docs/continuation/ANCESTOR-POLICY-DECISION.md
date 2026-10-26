# Ancestor-policy review: keep the guard, stop the probe chain

2026-10-26, GPT-6.1 Sol High, saved evidence/source only, startinglocale3a98eb.
No target read, implementation, permission/policy/gate change, native execution,
additional inference, network, config/trust write or baseline adoption occurred.

## Finding and threat model

The refusal is caused by our private checker.safe_directory admission rule. The old
two-file reader checked ancestor type and bindings; the new reader additionally
rejects group/other-write except root-owned sticky directories. Saved metadata shows
a directory that fails that exact predicate. This does not establish a released
Codex limitation, compromised installation or the identity of any additional writer.
ACLs, group membership and current directory state are unknown and were not queried.

The guard reduces exposure to replacement of a named object through a writable
ancestor. No-follow protects against following symlinks; descriptor/before-after
identity and size checks detect certain replacements/mutations during a read.
Expected CLI/config hashes detect different read bytes. None proves a permanently
stable path or authorizes later execution. Checks cannot confine a same-user/root
process with authority to change the checker and its evidence. The root-sticky
exception is an explicit existing policy exception, not a proof about all ancestors.

For config, raw sensitive text is transiently parsed only after the expected hash
matches, with fixed classifications/private output; that remains a confidentiality
boundary. For CLI, a matching hash is a byte observation, not installation trust.
Node has no accepted baseline: a new hash would be observation-only. The fact that
an operation is read-only does not automatically make path substitution acceptable;
it can still select unintended bytes. No mode-bit fact proves actual unauthorized
writers, and no lack of such evidence permits treating them as absent.

There are four different boundaries: private validation admission, product guards/
privacy, ordinary native host permissions, and human trust. They must not be silently
merged. The current rule is stricter than the earlier observation helper; the earlier
helper's consumed grant is not a permitted way around this blocker.

## Decision

**Under the current preserve-all-guards scope, retain the refusal. Do not change the
predicate, chmod the package tree, inspect more metadata, or run another preflight.**
The saved write bit already explains the deterministic refusal. Additional ACL/group/
ancestor probes cannot make that bit pass the unchanged rule and are not the next
productive action.

The recommended immediate project step is the independent macOS acceptance/source
integration plan in COMPLETION-PLAN.md. Native Stop/routing acceptance stays incomplete
until one explicit launch-validation decision is made. This blocker must not stall
all independent work or spawn another generic validation framework.

## At most three future options

| Option | Risk/tradeoff and boundary | Exact future change/access | Approval and acceptance |
| --- | --- | --- | --- |
| A. Keep current policy and blocker (current recommendation) | Preserves every guard; native trial remains incomplete. Independent UI/authoring and release preparation can progress. | No target access, code, permissions or gate change. | No extra permission needed to retain the refusal. Existing hashes, consumed grants and closed gates must remain; do not call this native acceptance. |
| B. Select another existing official entry that satisfies the same policy | Could preserve admission policy, but no suitable alternative is established. Different binary/version is a new target, not interchangeable evidence. | Human selects an exact official client/entry; separately bounded identity/path review, then full native trial approval. No discovery scan, copy, install or automatic link resolution. | New exact target-read grant, reviewed released syntax/version and scoped trial/human trust/usage consent. Existing rule must pass without repair; otherwise stop. No claim that an alternative exists now. |
| C. Explicitly amend validation trust for a human-operated trial | Uses ordinary trust in the user-managed official CLI/Node installation, not a machine-certified non-writable ancestor chain. It deliberately changes a validation prerequisite and cannot be called preservation of that prerequisite. Product guards/native permissions/human trust must still remain. | First a design decision only. If accepted, revise the existing manual Stop trial envelope; no permissive helper, app patch or hidden bypass. No execution/config/trust/model grant follows from design agreement. | Human must explicitly accept the weaker installation-identity assurance and exact normal-startup residuals. A later complete envelope must authorize scoped setup, human hook/code review, one harmless usage-consuming trial and cleanup. Record native delivery separately; never rewrite the failed preflight as passed. |

For eventual native progress, resolve B or C as a **single explicit decision**, rather
than another sequence of probes. C may be practical because the manual-supervision
design is already accepted, but its installation-trust amendment has not been
accepted and is not executed or authorized here. Do not ask again for the already
accepted 90 second manual-stop/no-enforced-output-cap design; isolate the genuinely
new trust decision. If neither B nor C is acceptable, A remains honest incomplete work.

A future C envelope must disclose unverified client/Node identity, additive hooks/
MCP/remote-ingress uncertainty, ordinary auth/catalog/network/local-state effects,
local-hook authority distinct from model sandbox, no guaranteed remote cancellation,
and no hard billing/request cap. It must preserve read-only model permissions,
no automatic approvals/continuations, exact selected project/minimal retained data,
separate human hook/source trust, parent model unchanged and visible bounded extra
usage. These facts are not removed by using a human operator.

Acceptance of any later native trial: actual official-client identity/version within
its stated evidence limits, exact reviewed hook selected and trusted by the human,
fixed harmless output plus selected Stop event/time-only data, no broadened capture,
normal permissions intact, no retries after a blocked/unknown outcome, closed/removed
owned trial hook and preserved evidence. It does not prove configured-agent routing,
full failure semantics, native Windows or whole-product completion.

## What was verified in this review

19 saved source/evidence pins matched; real receipts remain consumed and both gates
false. Existing43checker and8audit synthetic cases are prior evidence, not rerun.
No new host/CI/package/runtime observations. Exact machine metadata remains private.
Changes in this stage are review/completion-plan documents and local checkpoints only.
Network remains prohibited; GitHub publication/remote verification is pending.
