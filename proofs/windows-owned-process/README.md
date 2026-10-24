# Windows owned-process research candidate

Source12 adds ProjectReadSet.cs, an **unintegrated explicit synthetic read-set**
proof: retained no-follow handles, bounded captured bytes, metadata+byte verification,
path/ACL/share/cancel refusals and one private-slot composition. No enumeration/
ignore engine/real project/Git/DLL launch or gate activation. Sourcee55ed71
CI40048345934 all7jobs passed; both Windows logs20storage+21proof/0fail/0skip.
Both mapping cases refused before acceptance; changed-bytes/restored-mtime branch
unverified. Windows11 host unavailable; no native Codex claim. See
[source12 review](../../docs/continuation/DEV12-REVIEW.md). Production still compiles
only PrivateStorage.cs. Source11 history below remains a separate foundation.

## Source11 content extension — not installed or integrated

ScratchContent.cs adds a bounded flat synthetic-content proof using private
CREATE_NEW + DELETE_ON_CLOSE from creation and retained noninherited handles.
It tests normal cleanup, existing/unexpected entry refusal, count/byte bounds,
external owner death and owned descendant reader lifetime. No recursive recovery,
project/index/ref copying or Git launch. Compatible readers need read/write/delete
sharing; this is not established for installed Git. Empty private roots can remain.
Source11 is uninstalled; source10 remains human-trusted on macOS. Production compiles
only PrivateStorage.cs; Windows settings/project/restore gates stay closed.
See [source11 review](../../docs/continuation/DEV11-REVIEW.md) for contract, sources,
limits and exact remaining gates. Source392fc04 CI40046690213 passed all7jobs;
both Windows logs20storage+13proof/0fail/0skip read. See TEST-LOG.

Earlier source9-only empty-scratch descriptions below are historical; this proof
extends synthetic content handling, not production access or native compatibility.

Original MIT proof, 2026-10-23. **Not loaded by any production hook, tool, CLI or
server.** No new public execution operation, selected project access, installation,
configuration/trust edit or model/API call. Source version dev9 tightens directory sharing without activating project paths; installed
human-trusted dev6 remains unchanged. Windows project/settings/restore gates stay.

## Contract under test

`OwnedProcess.Run(executable, arguments, directory, environment, timeoutMs,
maximum, CancellationToken)` is a candidate **lifetime/stdio primitive only**.
The synthetic harness supplies its own explicitly compiled absolute executable,
private disposable NTFS cwd and synthetic arguments/environment. No Git is run.

ProgramBoundary.cs is a proof-only partial extension of the original NTFS helper.
Production compiles only PrivateStorage.cs and exposes no new operation. Its
directory pin now also requests FILE_LIST_DIRECTORY, because metadata-only opens
do not enforce every sharing conflict. It does not enumerate ancestor contents;
insufficient list rights refuse. A partial class declaration enables proof reuse.
Package/manifest/server identify the source snapshot as0.2.0-dev.9, not installed.

- Fixed local absolute executable/cwd strings; explicit CreateProcessW application,
  CRT argument escaping, no shell or PATH lookup. At most32 arguments/16KiB command,
  16 environment entries/16KiB environment,15s duration/128KiB combined output.
- Windows10/Server2016+ mandatory creation-time `PROC_THREAD_ATTRIBUTE_JOB_LIST`
  and `HANDLE_LIST`. Unsupported/restricted/nested-job failure refuses; no retry
  using breakaway or create-then-assign. The travel idea of creating suspended and
  *then* assigning a job leaves an owner-death interval; it is superseded here.
- Unnamed, non-inherited kill-on-close job. No breakaway flags, foreign PID lookup,
  taskkill, elevation or change to host sandbox/approvals. The child starts suspended
  but is already job-associated when creation returns. Only its stdin read end and
  stdout/stderr write ends are inherited; stdin immediately receives EOF.
- Single-reader bounded pipe polling, monotonic deadline, cancellation before
  creation and while running. Root exit terminates remaining owned descendants;
  return waits for pipe closure up to500ms within the original deadline. Failure
  terminates/closes the job and waits up to500ms for the owned root. External owner
  termination closes the sole job handle; the OS then terminates its descendants.
- Nonzero child exit is returned as data, not misrepresented as success. Errors
  are fixed messages; child stdout/stderr is synthetic only and never published as
  production telemetry. Failed output is discarded. No persistent process/watcher.

This **is not a sandbox**: no token restriction, network isolation or protection
from malicious code using brokers/WMI/hostile same-user processes. Windows job
membership covers ordinary CreateProcess descendants, not every possible service-
mediated action. Only trusted deterministic programs could be considered later.
Process/job/pipe descriptors use normal token defaults; no private data is placed
in them by this proof. The existing storage adapter is not changed.

## Executable and scratch object candidate

ProgramPins(executable, codeRoot, selectedProject) pins no-reparse ancestors and
same-handle disk/single-link executable with no write/delete sharing. Separately
reviewed explicit code root must contain the executable and must not overlap the
selected project. Code-root-to-executable directories reject foreign file creation,
write, delete, ACL/owner/attribute mutation. Denies do not excuse broad allows.
Private current-user fixture executables are checked, never run from project/PATH.
Tests exercise foreign WriteData grants (including deny+allow), trusted administrator ownership,
hardlinks/junctions/aliases/streams, scope overlap and accepted original fixture.

This is an object-integrity check, not code provenance or DLL trust. The conservative
shared ancestor ACL check may refuse legitimate installed code (including some
TrustedInstaller grants); refusal is not repaired or interpreted as support. No
real installed Git executable/installation/dependency closure has been validated.

ScratchProof uses the existing atomically private descriptor to create a fresh
random empty directory beneath an already-private explicit root. It verifies and
pins before returning its path. A separate process checks it through the existing
adapter; deletion while pinned refuses. Normal disposal removes only that empty
owned directory, never recursively deletes unexpected entries. External death may
leave an empty private directory; future content cleanup/recovery is unimplemented.
No index/refs/content copied, no private project file read. A future Git operation
must hold program and scratch handles across execution, validate all dependencies
and IO, and design exact-owned-file cleanup separately. These fixtures do not prove
that composite behavior or native sandbox authority.

## Not established by this candidate

Path syntax alone and OwnedProcess.Run do not validate executable/parent ACLs,
DLL dependencies/search, reparse points, project file traversal, private Git index/
ref snapshots, Git config/helper suppression or native Codex permissions. Callers
cannot infer those from absolute paths or these tests. No production integration
until those independent gates pass. Restore remains a separate writer review.

No suitable native Windows Codex host is available here. Windows Server CI tests
are OS/process evidence, not Windows11/WSL installation/events/UI/sandbox proof.
No disabling of security checks or policy bypass to make a runner pass.

## Reproduce

On a real Windows host with ordinary Windows PowerShell5.1/.NET Framework and
Node22+, from this reviewed checkout:

```text
node --test test/windows-owned-process.test.mjs
```

The test creates a disposable private NTFS directory using the existing adapter,
compiles only these original public fixed C# sources there using system CodeDOM,
runs fixed harmless actions and removes its own directory. Synthetic process IDs
are local test evidence only. No Git, network, model, credentials, transcripts or
user project. No install/removal steps required beyond removing this checkout.
Build/compiler policy refusal must remain a refusal; never override policy.

Observed results belong in docs/continuation/TEST-LOG.md with exact source and CI
identity. Local macOS skip is not a passing Windows test.

## Primary references actually retrieved 2026-10-23

- [Job objects](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects)
  describes ordinary descendant membership and its limits.
- [UpdateProcThreadAttribute](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-updateprocthreadattribute)
  documents both handle list and creation job list, Windows10/Server2016 minimum.
- [InitializeProcThreadAttributeList](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-initializeprocthreadattributelist)
  documents list allocation/lifetime.
- [CreateProcessW](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createprocessw)
  documents explicit application, environment, stdio and extended startup.
- [Job limits](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-jobobject_basic_limit_information)
  and [extended limits](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-jobobject_extended_limit_information)
  document kill-on-last-handle and breakaway flags.
- [PeekNamedPipe](https://learn.microsoft.com/en-us/windows/win32/api/namedpipeapi/nf-namedpipeapi-peeknamedpipe)
  documents pipe availability; a single reader avoids multi-reader synchronous
  pipe waits. This primitive is not suitable for concurrent pipe reads.
- [AssignProcessToJobObject](https://learn.microsoft.com/en-us/windows/win32/api/jobapi2/nf-jobapi2-assignprocesstojobobject)
  was reviewed for nested-job restrictions; it is deliberately not the launch path.

[DLL search order](https://learn.microsoft.com/en-us/windows/win32/dlls/dynamic-link-library-search-order),
[SetDefaultDllDirectories](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-setdefaultdlldirectories)
and [file access rights](https://learn.microsoft.com/en-us/windows/win32/fileio/file-security-and-access-rights)
were retrieved2026-10-23 for the remaining trust boundary. Setting DLL search policy
in a parent process is not evidence of configuring the child process's loader.
Absolute executable selection alone does not validate dependent modules.

[MS-FSA access checks](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-fsa/82b364ce-6d7b-422f-8d88-4db32eea809a)
and [sharing checks](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-fsa/8c0e3f4f-0729-49f4-a14d-7f7add593819)
retrieved2026-10-23 explain why metadata-only handles cannot establish pinning.
The corrected helper requests the directory list right solely to participate in
sharing checks. Its independent NTFS rmdir witness and storage regressions must
pass on the exact final source. No claim of defending hostile same-user processes
or changing directory ACLs; OS administrators remain outside the isolation claim.

A controlled30ms no-sharing lease and a permanently held lease test directory
sharing behavior. The production OpenDirectory implementation retries only sharing
violation32, at most10attempts/90ms sleep per handle, and repeats all ordinary
identity/ACL checks on the actual opened handle. It never repairs permissions or
changes share modes. Outer15s/optional1500ms deadlines still bound the operation.
This models a short-lived creator handle; it is not proof of the exact cause of
a previously intermittent public-state CI failure.
