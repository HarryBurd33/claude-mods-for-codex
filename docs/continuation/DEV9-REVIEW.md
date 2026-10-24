# Source9 Windows security review — 2026-10-23

Narrow review of source9 relative to travel1ae63d1, human-selected Sol High.
Not an independent audit or full-product completion. No extra model/evaluator.

## Concrete fix

A new real Windows witness successfully removed an empty directory despite an
open metadata-only handle. The original storage helper used the same access mask.
READ_CONTROL/READ_ATTRIBUTES alone do not establish the needed sharing conflict;
MS-FSA access/share algorithms corroborate this. Pins.OpenDirectory now requests
FILE_LIST_DIRECTORY with metadata rights and no delete sharing. An independent
live-rmdir witness now refuses on Node22/24 NTFS. No enumeration of ancestors.
A path lacking list rights refuses rather than gaining access through ACL repair.

Directory sharing violation32 alone retries10attempts/90ms sleep per handle;
path/ACL errors do not retry, share modes/owner/ACL/lock policies do not relax.
The existing15s and1500ms optional telemetry budgets still bound requests. A
controlled30ms exclusive lease succeeds after release; a held lease refuses.
Existing native journal/state/concurrency/rotation/prune/cancellation/guard tests
pass. No extra journal fields, project/session capture, model or network call.

## Decisive isolated proof

Mandatory Windows creation-time JOB_LIST avoids the create-then-assign owner-death
gap. An unnamed non-inherited kill-on-close job covers the fixed synthetic child/
ordinary descendants. Explicit inherited stdio list, EOF stdin, CRT argv, explicit
small environment, bounded output/monotonic deadline/cancellation, root-exit and
external-helper-death cleanup are actually tested in Windows CI. No fallback to
uncontained/breakaway process creation. It is not a token/network sandbox or a
protection from malicious broker/same-user/admin activity.

Proof-only partial ProgramBoundary reuses original helper handles/ACL/path parser;
production compiles only PrivateStorage.cs and exposes no new operation. Explicit
separate code root rejects project overlap/junction alias, foreign write/create/
ACL mutation, links/streams/aliases; trusted administrator-owned code is accepted.
Code provenance/DLL dependencies/installed Git are not established. Private empty
scratch has atomic descriptor, verified live pin and empty-only removal. Owner
death can leave an empty private directory; copied content cleanup is not designed.
No private project file/index/ref copy or actual Git launch. No gate removal.

## Evidence and limitations

Runnable sourcea3a9c2598455a858bbfec6c3b1ecb6d7b14e62e0,
[CI40043152081](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40043152081)
all7jobs passed. Each Windows Server2025 Node22/24 lane20storage+8proof/0fail/0skip.
All4POSIX full suites and portableWindows pass. Local170pass/0fail/28Windows-only
skips198total. Actual job logs read; failed candidates retained in TEST-LOG.
The first handle assertion confused numeric handle reuse with object inheritance;
fixed original-event witness, not runner permissions. The failed rmdir assertion
exposed a real source defect and was retained as a regression. One intermediate
Node24 public-state failure did not recur in diagnostic/final lanes, but its exact
cause is not established. Do not claim the sharing retry conclusively fixed it.

No source9 install/native event/UI run, changed-code trust, Windows11 host/sandbox/
WSL validation or package/public-clone recheck yet. Windows host is available later.
Installed trusted6 scope/settings/retention/export unchanged; actual activity4same
revision. Invalid waitMs0 call refused, corrected empty options returned metadata.
No secret/session discovery, credential search, dependency download, policy bypass,
permission weakening, app patch, independent model run or subagent. Original MIT
code only, no third-party library/upstream implementation copied.

## Stop boundary

Immediate next work is routine source9 package/clone verification and native
acceptance preparation: Sol Medium is sufficient. Windows settings/project/Git/
restore remain before-IO refused until later target-host inventory and High review
of executable/DLL trust, project traversal/snapshot semantics, exact-owned content
cleanup and separate writer/native permissions. Medium must request High before
changing those paths. Supported unfinished requirements remain in the93-row ledger.
