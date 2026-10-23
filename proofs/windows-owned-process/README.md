# Windows owned-process research candidate

Original MIT proof, 2026-10-23. **Not loaded by any production hook, tool, CLI or
server.** No new public execution operation, selected project access, installation,
configuration/trust edit or model/API call. Source runtime remains dev8; installed
human-trusted dev6 remains unchanged. Windows project/settings/restore gates stay.

## Contract under test

`OwnedProcess.Run(executable, arguments, directory, environment, timeoutMs,
maximum, CancellationToken)` is a candidate **lifetime/stdio primitive only**.
The synthetic harness supplies its own explicitly compiled absolute executable,
private disposable NTFS cwd and synthetic arguments/environment. No Git is run.

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

## Not established by this candidate

Path syntax is not executable trust. It does not validate executable/parent ACLs,
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
