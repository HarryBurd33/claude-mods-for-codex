# Sol High review-only scope: ancestor-policy blocker

2026-10-26. Medium followed local811834b to prepare this human-controlled handoff.
**Review existing task records/source only.** No new selected path metadata/content,
ACL/group lookup, permission change, native execution, inference, network,
configuration/trust write, policy implementation, alternate-path selection or baseline
adoption is authorized. Installed31 and every current guard remain unchanged.

## Established starting facts

The single20second preflight stopped in0.002seconds before selected file content,
with unsafe-directory. A separately authorized5second ancestor observation audited
4of7ancestors and stopped at the unchanged policy. It recorded a current-user-owned,
group-writable directory without the root-sticky exception. Exact path/mode/index
are in ignored .local/ancestor-observation/RESULT.json; do not publish machine paths.

Both grants are consumed. Both private gates are false and exclusive attempt/result
records preserved. Earlier grant JSON describing unused status is a historical
pre-execution snapshot; authoritative consumption receipts are
.local/preflight-run/AUTHORIZATION.json and
.local/ancestor-observation/AUTHORIZATION.json. No retry, deletion or reset.

This is a private preflight admission rule, not evidence of released Codex rejecting
that directory. The previous two-file reader checked ancestor type/identity but did
not impose this new ancestor ownership/write-mode policy. Its old scope is consumed;
do not invoke it as a workaround. Actual native execution/trust/permissions remain
separate boundaries. This source comparison is an observation, not approval to
remove the newer rule.

## Exact source/evidence locations and contracts

- .local/preflight-checker/checker.py:
  safe_directory, parent, read_selected, classify, observe, Budget, reserve_attempt.
  Directories must be root/current-user-owned; group/other write is rejected except
  root-owned sticky directories. Descriptor-relative no-follow traversal, before/
  after file and directory binding checks, leaf mode/type/link/size checks.
- .local/launch-two-file-review/read-once.py: historical two-file reader, source-only.
  No import/invocation; its module performs old reads and overwrites old observations.
- .local/preflight-checker/run_once.py and RUN-REVIEW/BINDING/OPERATOR-REVIEW:
  exact review/source/scope pins, closed gate, exclusive attempt, fixed classification,
  one20second shared budget. Node identity is observation-only, not accepted baseline.
- .local/ancestor-request/OPERATION.py.txt and SCOPE/OPERATOR-REVIEW:
  metadata instrumentation calls the original predicate and restores it, no leaf read.
- .local/preflight-run/RESULT.json and .local/ancestor-observation/RESULT.json:
  fixed real outcomes; corresponding ATTEMPT/OBSERVATION are in the checker/request
  directories. Current source/evidence hashes in the private High handoff directory.
- docs/continuation/CHECKER-OFFLINE.md, PREFLIGHT-RESULT.md, ANCESTOR-RESULT.md:
  sanitized scope, tests and actual observations.

43synthetic checker tests and8synthetic metadata-audit tests passed previously.
They are not native acceptance or proof about unseen ACLs/group membership. No new
test/host operation is required merely to understand this blocker.

## Questions High must resolve from existing evidence

1. Identify the rule's origin and security purpose. Distinguish the private reader's
   admission contract from product guards, native host permissions and human trust.
   Preserve all four; do not silently classify an exception as harmless maintenance.
2. Model the bounded read-only observation separately from future execution/trust:
   hash-matching CLI/config observations, confidential config held transiently,
   unknown-baseline Node, descriptor/identity checks, writable-ancestor replacement,
   concurrent change and same-user process limits. What does each check prove, and
   what does it not prove? No observation hash is execution authority.
3. Which risk follows from the recorded write bit alone, and what remains unknown
   (including actual writer identity/ACLs)? Do not infer group membership or query it.
   No categorical unsafe-system or successful-execution claim follows from this row.
4. Can a useful next step preserve current policy and exact path scope? If not,
   keep the blocker explicit. Any proposed narrower observation policy or alternate
   official entry/path requires a concrete separate human decision and scope; neither
   is authorized here. Do not chmod the package tree, copy/install clients, resolve
   links, add a path allowlist or change a source policy during review.
5. Identify the smallest next bounded action that removes a real uncertainty.
   Avoid repeating already-completed metadata reads or beginning another generic
   launcher/client/proof framework. New target access, code/guard changes and native
   startup/model usage have distinct approval requirements.

## Deliverable and acceptance

Write one concise evidence-based review/decision proposal with at most3options.
For each viable option: risk/tradeoff, preserved boundaries, exact access/code change
if any, prerequisites, new human approval needed, and concrete acceptance tests.
Separate documented/source reasoning, observed host metadata, synthetic tests and
unverified behavior. Choose a recommended next bounded action or retain the blocker
with a precise reason; do not claim full-product completion.

If future implementation is proposed, define synthetic race/link/permission/privacy/
deadline/no-retry tests and keep its execution scope unapproved. No new implementation
under this review-only grant. Existing public primary-source copies may be consulted
as records if directly relevant; current no-network rule prohibits new retrieval.
No repeated general Codex/Windows/REA/startup-isolation research.

Return to **GPT-6.1 Sol Medium** once difficult review decisions are saved and only
routine verification/presentation remains. Human switches only; no subagent/worker
substitution or background continuation.

## Publication and preserved state

No-network instruction prevents upload/remote verification; make a local checkpoint
and explicitly retain pending publication. Latest previously verified public commit
is historicald3c4682, not queried. Private paths/raw metadata stay ignored; public
records remain sanitized. Preserve original other-chat input/review/generations/
heartbeat and unrelated .gitignore. Native Stop/full93/Windows acceptance incomplete.
