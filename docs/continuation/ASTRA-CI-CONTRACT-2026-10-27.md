# Astra review: Mac observation and Windows inventory/deadlines

Review baseline: **8219ca27880dac30b340be62d8eda3eddf42324f**, 2026-10-27.
This is a reviewed implementation contract, **not an implemented repair or a release**.
The next assignment is **GPT-6.1 Sol / High**, with the finite scope below. Preserve
the consumed Phase1 grant and completed human-present Stop trial. This review grants
no new Codex startup, model trial, installation, trust or configuration change.

## What the evidence establishes

[Run 40542039681](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40542039681)
finished with **3 passing jobs and 4 failures**. Both Ubuntu lanes and Windows
portable checks passed; both Mac and both Windows NTFS lanes failed. Its runtime
and tests are identical to `cccb487`, whose earlier run had 5 passes and 2 failures.
That earlier pass did not establish a stable Mac fix.

| Observation | Conclusion and remaining uncertainty |
| --- | --- |
| Both Mac readiness fixtures: present group, then `EPERM` at 1017/1027 ms; two-second deadline not reached | Actual unavailable observation; no absence established. Exit/reaping is a supported hypothesis, not an observed kernel diagnosis. |
| Both Windows lanes: mandatory `cmd/git.exe` and `mingw64/bin/git.exe` positives fail | Later wrapper sample has two links; old internal directory open returns Missing. These are separate object-policy and layout issues. |
| Windows Node22: `metadata-bounds-failed\|exclude\|deadline\|completed` | Scratch reached the exclude phase and the cooperative deadline check failed. This does not identify which preceding I/O call was slow. Parent inventory restoration was observed separately. |
| Windows Node22: full-size capture test cancelled after 45 seconds | The whole test timed out. No stage timing or child-close receipt establishes where that time went or proves teardown of all effects. |

Windows Node24 had 25 storage passes and 86 process passes/3 failures (89 process
tests, counting the failing parent). Node22 had 25 storage passes and 84 process
passes/4 failures/1 cancellation. No failed run was retried. The earlier local
377-pass/115-skip result and 379-file archive remain dated evidence, not new tests.

## A. Mac: use the existing observation budget conservatively

Apple's pinned XNU implementation looks up the group, filters zombie members, and
can return `EPERM` when no eligible member is counted. Failure to find the group
returns `ESRCH`. Thus a group containing only zombies is one possible explanation
for the observed transition near the fixed leaf's one-second self-exit. We did not
inspect the CI kernel's process state or attest its exact XNU build.
[XNU source, `killpg1`](https://github.com/apple-oss-distributions/xnu/blob/f6217f891ac0bb64f3d375211650a4c1ff8ca1ea/bsd/kern/kern_sig.c#L1675).

Signal zero performs permission/existence checking without sending a signal.
The error categories are distinct; `EPERM` never proves absence.
[Apple kill(2)](https://developer.apple.com/library/archive/documentation/System/Conceptual/ManPages_iPhoneOS/man2/kill.2.html).

**Decision:** revise only fixed-fixture settlement to continue observation through
`EPERM` within the existing budget. Do not redesign the process tree or add a reaper.
The current early return discards the rest of that budget; this decision permits
further observations, not retries of the executed scenario.

Permitted files: `proofs/process-group-observation.mjs`,
`test/process-group-observation.test.mjs`, and an isolated fixed regression case in
`proofs/reliability-probe.mjs`/`test/reliability.test.mjs` if needed.

1. Keep both observation APIs and their error mappings unchanged. Only
   `settleFixedFixtureGroupDetail` may continue after `present-or-reused` or
   `unavailable/EPERM`. Other errors remain terminal.
2. Keep one monotonic entry deadline of 2000 ms and nominal 10 ms cadence. Check
   expiry after each await and immediately before another probe. Do not make a
   final probe after expiry or expose a caller clock/budget/executable parameter.
3. Only an actual `ESRCH` may set `goneObserved:true`. Persistent `EPERM` remains
   unavailable/false. Retain a closed `epermProbeCount` so intermediate uncertainty
   survives a later successful observation. Never emit PID/path/raw error text.
4. Keep signal zero only. No positive-PID fallback, process enumeration, adoption,
   longer deadline or additional cleanup signal. Preserve the originally sampled
   `processGroupStatus`, `allDescendantsVerified:false`, `review-required` outcome
   and `descendants-unresolved` reason.
5. Keep the real readiness/inspection assertions requiring observed group absence.
   A persistent unavailable result still fails. Later absence does not establish
   that every descendant stayed in that group or that its numeric ID was never reused.

Required tests: present→EPERM→ESRCH; initial EPERM→ESRCH;
present→EPERM→present→ESRCH; persistent EPERM until the unchanged deadline;
terminal EINVAL/other; invalid IDs and Windows before-signal refusal; unchanged
no-secret diagnostics. An isolated delayed-timer test must prove no probe occurs
after expiry. Test-only clock manipulation must not create a public injection API.
Change the old **immediate** EPERM settlement expectation explicitly; its conservative
false result remains required. Keep the real fixture's mandatory success assertion.

## B. Windows: separate linked-file sampling from execution policy

The shared `Info()` in `src/windows/PrivateStorage.cs` requires one link. The existing
Installer inventory uses it, and the parent reader independently requires one link.
Neither gate is a bug in its original contract. The parent also reopens the path;
its own before/after identity checks are not a same-handle content read from the
native helper. This is a design limitation, not evidence of an observed exploit.

Hardlinks share the underlying file's security descriptor and sharing state. An
unknown alias cannot bypass ordinary content-sharing restrictions simply by using
another name. [Microsoft CreateHardLinkW](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-createhardlinkw).
Read-only sharing conflicts with ordinary data writers and writable mappings, but
does not freeze attributes or all namespace changes.
[Microsoft CreateFileW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew).
Security-descriptor reads can race with changes; matching endpoint samples cannot
detect a changed-and-restored descriptor.
[Microsoft GetSecurityInfo](https://learn.microsoft.com/en-us/windows/win32/api/aclapi/nf-aclapi-getsecurityinfo).

**Decision:** add a separately named **LinkedInstallerInventory** proof profile,
limited to a bounded digest sample from the retained native handle. Keep the old
profiles and strict negative fixtures. This is a new contract, not general removal
of hardlink protection.

The profile may sample only a normalized ordinary file on local NTFS, under the
OS-known ProgramFilesX64 anchor and its immediate `Git` installation. Preserve
selected-project separation, path/type/no-reparse checks, directory pins, descriptor
policy and rejection of unknown principals' mutation grants, even when deny ACEs
also exist. Do not enable privileges, repair ACLs or discover other aliases.

The threat model excludes hostile same-user processes, Administrators, SYSTEM,
TrustedInstaller, enabled backup/restore/security privileges, kernel/filter tampering
and a compromised helper. Ordinary sharing constraints remain useful but do not
make this profile a sandbox against those actors. Other aliases' names/topology are
outside the guarantee. Equal link counts cannot detect rename or create/delete ABA.
After release, no authority persists. A digest is not provenance, signing, DLL
closure, safe execution, import-parser success or native Codex compatibility.

Permitted files: `proofs/windows-owned-process/InstalledImageRead.cs`, a dedicated
proof partial if useful, `Harness.cs`, explicit `build.ps1` source list if needed,
`test/windows-owned-process.test.mjs`, a small pure frame parser/test if needed,
`.github/workflows/ci.yml`, and accompanying evidence docs. **No `src/**` changes.**

1. Preserve shared `Info`, `Access`, `Trusted`, `CodeAccess`, `ProgramPins`, private
   reads, and the StrictCode/InstallerInventory profiles. Add a private object
   validator used only for the new profile's image. Retain all original conditions
   except `Links == 1`; require a nonzero link count and record it as a sample.
2. Retain `GENERIC_READ | READ_CONTROL`, `OPEN_EXISTING`,
   `FILE_FLAG_OPEN_REPARSE_POINT` and `FILE_SHARE_READ` only for the image. Directory
   handling remains unchanged. Retain the existing 64-byte–32-MiB image bounds.
3. Read the image **inside the helper through that retained handle**, in bounded
   chunks, hash with SHA256 and check exact length/EOF. Do not reopen by pathname,
   export raw bytes/handles/ACLs, or guess equivalence of Node and Win32 file IDs.
   Emit only closed frames, size, link count and digest after final validation and
   normal release. The parent buffers/discards any incomplete result; an error,
   cancellation, invalid control, missing release frame or failed exit is not success.
4. Check identity, selected final path, type/reparse, attributes, length, write time,
   link count and descriptor/policy before and after the read and at final control.
   Changed/unavailable samples discard the digest. Clear temporary bytes. Preserve
   the 15-second parent deadline, output bounds, EOF/cancel and partial-disposal
   behavior; do not claim synchronous native calls become interruptible.
5. Keep the existing JS PE parser and its tests separate. V2 reports PE analysis as
   **not performed**; it does not silently count a digest as the old parser result.
   Same-helper PE parsing is deferred. This intentionally narrows V2 acceptance.
6. Introduce a closed preselected layout `git-for-windows-ucrt64-v1` with exactly
   `cmd/git.exe` and `ucrt64/bin/git.exe`, selected explicitly by CI before probing.
   Reject unknown selectors. No PATH/registry search, recursive discovery,
   existence-based fallback or running Git to select a family.

Git 2.56 documents the internal prefix migration and recommends `cmd/git.exe` as
the stable entry point. This justifies the explicit new layout, not attestation of
the runner's version or replacement object.
[Official release](https://github.com/git-for-windows/git/releases/tag/v2.56.0.windows.1).
Preserve the old pair's failed run identities. In the implementation commit, replace
its obsolete mandatory installed-image contract with the **new named digest-only
contract**, not a skip or acceptance of refusal. Keep legacy APIs and their strict
synthetic hardlink negatives. Historical or separately selected legacy-layout
evidence is not a modern-layout pass.

Actual Windows Node22/24 acceptance must include:

- Single-link and two-link synthetic positives; an alias outside the selected code
  root but inside the disposable fixture; exact digest of known bytes.
- Old private/executable/Installer policies still refuse the linked object.
- Existing writers and writable mappings through either name block admission;
  ordinary write opens through both names fail while held and work after release.
  Prove the competing writer/mapping was successfully acquired and remains live
  before starting inventory; a failed fixture setup is not a passing safety test.
- Selected-name rename/delete refusal. Separately exercise other-alias
  rename/delete/addition: it may be blocked or change topology; if count changes,
  final acceptance must refuse. A mere alias rename is outside the guarantee, not
  a mandatory detected-change claim. Record which OS behavior actually occurred.
- Attribute/descriptor changes, foreign grants, reparse/wrong-kind/missing paths,
  false known-folder scope, overlap, unsupported/null descriptors, partial failure,
  invalid control, EOF, cancellation and helper death. No accepted partial digest.
- Both **installed** modern candidates must produce accepted digest samples.
  Never copy/modify installed images, remove aliases or change their ACLs to pass.

All writes in these negative cases belong to owned synthetic fixtures. Acceptance
means proof-only sampling on that runner. Production integration and Windows11
installation/events/UI remain blocked pending their separate reviews.

## C. Windows: repair cancellation ownership before tuning deadlines

The source supports a narrower conclusion than “Windows is slow”:

- `GitMetadataScratch.cs` uses a five-second cooperative clock. The `exclude`
  phase is assigned before its pre-write check. The observed frame can mean earlier
  index work consumed the budget; it does not establish an exclude write began.
- `ScratchContent.cs` performs a synchronous whole-file `WriteFile` and
  `FlushFileBuffers` between checks. A stopwatch does not interrupt either call.
- `GitMetadataCapture.cs` reads and verifies bytes repeatedly under its own
  five-second clock, while nested scratch construction starts another clock.
  Public `Verify()` starts a new verification clock. These are cooperative phase
  budgets, not a single guaranteed end-to-end cancellation bound.
- The test's `run()` kills and rejects on its 20-second timer without first awaiting
  `close`. The holder also has separate 5-second readiness and 20-second lifetime
  timers. The 45-second test timeout is not passed to these helpers or fixture I/O.
  The full-size test combines success and two oversize cases in one test. A cancelled
  body can therefore continue work; the log alone does not prove that it did.

Node exposes `t.signal` for cancelling test subtasks, and child `close` is distinct
from sending a kill request. Neither a test result nor `child.killed` proves every
descendant is gone. [Pinned Node22 test API](https://github.com/nodejs/node/blob/e29aa496472073e1582fb360e1e575f29b5eedc2/doc/api/test.md#contextsignal),
[child process API](https://github.com/nodejs/node/blob/e29aa496472073e1582fb360e1e575f29b5eedc2/doc/api/child_process.md#event-close).
Windows I/O cancellation itself is conditional on the operation/driver. Do not add
a cancellation call and advertise a universal hard deadline.
[Microsoft cancellation guidance](https://learn.microsoft.com/en-us/windows/win32/fileio/canceling-pending-i-o-operations),
[WriteFile](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-writefile),
[FlushFileBuffers](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-flushfilebuffers).

**Decision:** first repair the test harness's ownership/abort behavior and obtain
bounded stage timings. Do not extend 5/15/20/45-second limits, remove flushing,
skip full-size positives, weaken byte equality, raise size limits or turn deadlines
into acceptable success. No production deadline redesign is approved here.

Permitted files: `test/windows-owned-process.test.mjs`, a test-only child-lifecycle
helper/regression file, `proofs/windows-owned-process/Harness.cs`, and closed diagnostic
instrumentation in `GitMetadataScratch.cs`, `GitMetadataCapture.cs`, `ScratchContent.cs`.

1. Thread `t.signal` through the two affected metadata test flows, fixture creation,
   `run`, holder and finish operations. Check it before every new action and after
   awaited I/O. Abort requests stop new actions and terminate only the owned child.
   Where an I/O API cannot be cancelled, await/reconcile it; do not claim instant
   cancellation or start cleanup concurrently with an uncertain write.
2. Make child result settlement single-shot. Keep separate termination-request,
   process-close and unresolved states; a timer/error must not report successful
   teardown. Register every spawned test child until actual close. Cleanup must
   await known writers/holders and preserve uncertain roots instead of recursively
   deleting them. In particular, shared `test.after` must refuse recursive deletion
   while any child or fixture write is unresolved. Reconciliation must fit the
   existing test lifecycle; do not turn a timeout into an unlimited close wait.
   Record unresolved state and retain the root when close cannot be established.
   Keep existing inherited-child job-object proofs separate.
3. Split the composite full-size test into three independently named tests with
   their own synthetic source/parent: exact maximum success, oversized index refusal,
   oversized exclude refusal. Each retains the 45-second test limit and all original
   content/residue assertions. This removes aggregate time coupling, not the
   underlying five-second acceptance condition. Do not shrink the maximum fixture.
4. Record only closed phase labels and monotonic elapsed values for source acquisition,
   read/verify, scratch directory/config/HEAD/index/exclude work, write versus flush,
   final verification and disposal. Include start/end status so an unfinished call
   is distinguishable. Bound frames/counts; no source bytes, exception text or paths.
   Keep the original exception and report cleanup independently.
5. Add isolated owned-fixture regressions for abort before spawn, during readiness,
   during an owned child, output overflow and nonzero exit; assert one settlement,
   no follow-on operation, actual close before cleanup and no accepted success.
   For an unresolved close, fail and retain evidence; never adopt a stale PID or retry.

After these changes, run one new-source Windows matrix and retain every failure.
If the maximum positive still exceeds its internal budget, use the stage timings
to propose a separate measured optimization or supported-size decision. The current
evidence cannot justify a performance fix or larger deadline. That unresolved
boundary must not be hidden by the cancellation repair.

## Implementation order, review and stopping conditions

Sol High should complete **A, C, then B** as one coherent source milestone, with
small commits and local focused checks. No fresh handoff is needed between routine
steps. Stop only for a substantive authority/resource/contract boundary. Keep each
commit runnable; do not retry unchanged failing CI to seek a pass.

Run the Mac focused tests, relevant pure frame/lifecycle tests, then `npm test`,
`npm run validate`, and `npm run replay` once for the assembled candidate. Windows
skips on macOS are not Windows verification. Publish the reviewed candidate normally
and inspect its exact Mac/Ubuntu/Windows Node22/24 jobs. Retain full-size and modern
installed-image mandatory positives; unexpected failure remains failure.

**Review assignment:** GPT-6 Astra / Ultra independently reviews B's actual diff
before its first Windows CI execution, especially unchanged shared guards, native
handle use, sample rejection and cleanup. The same review checks C's cancellation
state transitions before any Windows CI push containing those changes. Source
preparation/local portable checks can proceed within this contract. Passing CI
alone is insufficient; reconcile the exact diff and observed outcomes before
accepting the milestone or recommending Sol Medium for routine packaging.

This stage reviewed source, primary documentation and existing terminal CI, with
two bounded read-only peer reviews. No runtime code, test assertion, installed
plugin, native grant, trust/configuration or live model operation changed. No tests
were rerun for this documentation-only stage. The publishing commit uses `[skip ci]`
to avoid rerunning unchanged code; this is **not a passing check**, merge approval
or release acceptance. Future implementation pushes must run the applicable CI.
[GitHub skip behavior](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs).

The broader [macOS milestone](SOL-ULTRA-MILESTONE.md), native lifecycle/failure/cancel,
held-call review, configured routing, accessibility/zoom/reopen/Watch teardown,
complete authoring lifecycle and actual Windows/Linux/WSL acceptance remain open.
Keep any future native authority request in one concrete consolidated packet.
The completed one-use Stop trial never authorizes another trial.
