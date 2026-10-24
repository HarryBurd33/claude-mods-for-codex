# Source17 review — owned metadata helper composition

2026-10-23. Human selected GPT-6.1 Sol High from verifiedb67f98a. Full product
incomplete. Source17 uninstalled; installed human-trusted dev10, logging scope and
all production Windows settings/project/Git/restore before-IO gates unchanged.
Windows11 unavailable per latest reply; do not repeat that availability question.

## Concrete gap and scope

Source16 captures HEAD/ref/index with cooperative checks that cannot interrupt
kernel calls. Source17 composes that capture inside the existing creation-time
owned job runner, using only the independently compiled fixed public fixture.
This is an isolated lifecycle proof, not a production execution API, sandbox or
validation of actual Git/executable/DLL provenance. Production still compiles only
PrivateStorage.cs; its existing fixed PowerShell/taskkill adapter is unchanged.

Original MIT MetadataOperation.cs exposes proof-only
RunMetadataOperationProof(codeRoot,selectedMetadata,privateParent,kind,token).
Only complete/stall/exit/before/flood fixture kinds; no arbitrary command/callback.
Strict local paths and three pairwise-disjoint roots before IO. Fixed owned-proof.exe
under explicit code root, fixed synthetic marker names under privateParent. Original
ProgramPins denies executable write/delete sharing and pins directory identity
against rename/replacement; current-user child-entry creation/DLL additions are
not excluded.
private parent uses original current-user private NTFS pins. No PATH/project exe.
Object integrity pins do not authenticate binary contents/dependencies. Tests copy
and byte-check the separately compiled original fixture into fresh private code root.
Never use this method with arbitrary caller-selected programs as a trusted executor.

Existing OwnedProcess.Run receives fixed argv, only SystemRoot environment, stdin
EOF, private parent cwd,4000ms child budget/4096byte combined output. Mandatory
creation-time JOB_LIST/HANDLE_LIST, sole non-inherited unnamed kill-on-close job,
no breakaway/uncontained fallback or create-then-assign interval. Source capture,
strict index projection and private scratch all happen inside that child. No private
bytes passed in argv/env/stdout; source/parent locations are explicit path arguments.
No new production operation, helper framing or bridge32KiB/3MiB expansion.

The child uses GitSelectedMetadataProof with explicit exclude=true. Normal complete
verifies and disposes; exit deliberately calls Environment.Exit(23) to skip managed
cleanup; stall sleeps after capture; before sleeps before capture; flood writes fixed
public bytes after capture. These are synthetic stalls, not actual kernel IO hangs.
Malformed source returns fixed status7/metadata-refused; nonzero status is data.
Timeout/output failure discards child output and refuses; explicit cancellation
cancels owned work, not a host approval action. Parent death closes its sole job.

## Test-only instrumentation and ownership

Harness.cs creates only fixed operation.pid/.scratch/.ready markers with CREATE_NEW,
no overwrite/adoption; they contain synthetic process ID/scratch path/status, never
source bytes, session data or production telemetry. Markers persist for independent
checks then test teardown removes its synthetic root. Their ordinary inherited ACL
creation is not a new private production storage protocol. Selected private parent
is verified/pinned before child launch. A marker collision refuses without overwrite.

The cancel test's parent has one background stdin reader that requests cancellation;
child stdin still receives EOF. No daemon, network, model call, human trust mutation
or automatic native approval. Helper/parent process IDs are synthetic local evidence.
Parent/child output remains fixed status data, with failed flood output discarded.

Nine new OS tests: normal completion with EOF/private cwd/stripped synthetic env;
abrupt exit status23; captured timeout with source/code leases; explicit cancellation;
external owner death; pre-cancel/pre-capture stall; malformed source and marker
collision; output overflow; unsafe code/cwd/kind/ACL/junction refusal before launch.
Existing53proof+20storage regressed on Node22/24 Windows. Local macOS skips are
not Windows success. Exact observed source/CI results belong in TEST-LOG.

## Bounds and guarantees not established

Parent-side program/private-parent preflight IO occurs before the child timer and
is not bounded or interruptible by that timer. A future production caller still
needs an enclosing owner/transport deadline and acceptance for preflight. Existing
runner cleanup waits up to500ms for its root, with asynchronous OS termination;
it does not prove every pending kernel IO/driver completes by that time. The new
stall witness shows ordinary process termination/handle cleanup, not that a blocked
filesystem driver is interruptible. Never report a universal four-second API bound.

Source16 positive-file/header/ref/subset limits remain, no repository config/hash-
format/object identity/type/provenance/atomic snapshot or ignore implementation.
No real Git consumption/write/temp/lock behavior, DLL trust or native permissions.
This is not network isolation or protection from malicious brokers/WMI/hostile
same-user/admin processes. Job membership covers ordinary child creation only.
Unknown child-created files/live unowned readers may retain bytes, private empty
hierarchy may remain, no recursive cleanup/adoption/secure erasure. Failed marker
writes/unknown contents are preserved; synthetic fixture teardown is separate.
Prior mapping-refused/altered-byte-mtime/8.3 gaps stay explicitly unverified.

No code change to OwnedProcess/ProgramPins/source12–16 primitives or production
helper/gates/defaults/hooks/UI/skills. New proof source/build/Harness/tests and
package/manifest/server version17 only. No install/config/cache/trust/logging/
observer/theme/client/model/API-run change. No machine rollback required; remove
disposable fixture/checkout source. Existing selective dev10 removal/rollback remains
separate; never edit installed cache/trust hashes or whole shared config/live locks.
Next Medium after verified checkpoint for routine package/public-clone/spaced tests;
High before more gated work. All93requirements remain incomplete as applicable.

## Primary references retrieved/rechecked 2026-10-23

- [Job objects](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects)
 describes ordinary descendant membership/termination and broker limitations.
- [Creation attributes](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-updateprocthreadattribute)
 documents HANDLE_LIST/JOB_LIST, supported Windows versions and attribute lifetime.
- [TerminateProcess](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-terminateprocess)
 documents asynchronous termination and pending IO. That limit remains relevant
 rather than inferred away from a sleeping-process test.
- Prior Microsoft ACL/handle/loader evidence stays in proof README and DEV9–16;
 no unrelated Codex/model research, binary download or system tool repair.

## Observed result and completed High review

Source[04a4939](https://github.com/HarryBurd33/claude-mods-for-codex/commit/04a49394b477fe45c14025da0f318a7a641faff3),
[CI40063228451](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40063228451):
all7jobs passed. Both actual WindowsServer2025 Node22/24 decoded logs read:
20storage+62proof each/0fail/0skip. All9new owned-helper cases passed. Prior
mapping diagnostics still mapping-refused; altered-byte/mtime and8.3 unverified.
OS fixture evidence is separate from Windows11 Codex/Git/native acceptance.

Tested tree8ebe34f70905fda08a22d548129e52080af34c5f. Actual Windows log IDs
120781001773(Node22)/120781001823(Node24), both read. All4full POSIX suites and
portable Windows job passed. Local npm test170pass/0fail/82Windows-only skips
252total; validate3mods/replay4fixtures; diff-check clean. No CI retry/fix needed.
Earlier failed candidates/intermittent storage issue remain in TEST-LOG; these
passes do not establish a cause/fix for that separate history.

High reviewed phase boundaries, closed kind/argv/env/cwd selection, disjoint
code/data/source roots, held program/private-parent objects and existing mandatory
job/handle inheritance contract. Actual witnesses establish ordinary completion/
exit23, timeout/cancel/owner-death/overflow handle closure and source/code lease
release, pre-cancel/no launch, source status7 and no PID-marker overwrite. Fixed
fixture EOF/private cwd/synthetic env exclusion passed. Only synthetic stalls were
injected. No blanket4s method bound, blocked-driver guarantee, binary/dependency
provenance or sandbox claim. Parent preflight remains outside child deadline and
current-user additions/unknown child content/live readers remain independent gates.

Installed10 still149reviewed files/private settings hash unchanged. No native
inventory/event/UI/trust/model turn or config/cache/logging/observer/theme/client
change. All93IDs retained. Existing production helper/gates/defaults/UI/hooks/skills
and prior primitive code unchanged; only new proof/Harness/build/tests and version17
metadata. No machine rollback/trust/restart needed for this uninstalled source.

Next human GPT-6.1 Sol Medium for routine public clone/package/spaced-path/records;
High before further Windows preflight/launcher/loader/metadata/ignore/cleanup/gate/
writer integration. Full product remains incomplete.
