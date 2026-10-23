# Windows private-storage security

2026-10-23, development source0.2.0-dev.7. **Candidate, not native Codex support.**
Installed/trusted macOS production remains dev6, unchanged. No logging grants,
hook registration, host permissions, model selection or human trust are changed.

The previous journal relied on POSIX mode bits even on Windows. Source dev7 now
explicitly refuses Windows journal prepare/read/write before filesystem effects,
as state/settings/export/restore already did. Node's Windows chmod model does not
establish current-user-only access. Do not remove these refusals based on portable
path tests. A separate candidate runs actual NTFS ACL tests in Windows CI before
any production route is enabled.

## Candidate boundary

src/windows-storage.mjs launches only fixed Windows PowerShell5.1 with -NoProfile,
-NonInteractive and the fixed packaged .ps1 path. A narrow allowlist of OS profile/runtime variables is supplied; no full inherited
environment or arbitrary credential/API-key variables. No shell interpolation, PATH-selected
helper, elevation, execution-policy override, profile, downloaded module or model
call. Input JSON is bounded32KiB; output bounded3MiB,15s deadline plus2s cleanup,
own helper tree targeted through fixed system taskkill on timeout. Errors are
sanitized; no paths, SIDs, settings/export contents or native diagnostics returned
to the model. Explicit private-file reads return bytes only to the calling local
process. PowerShell compiles only the original packaged C# source with Add-Type;
normal execution/application-control policy can refuse it and must not be bypassed.
Compilation can create system-managed temporary artifacts containing public source,
not request or file contents. This is a trusted local process, not model sandbox IO.

src/windows/PrivateStorage.cs keeps checks and IO inside one process. It opens
and pins each ancestor with no share-delete, OPEN_REPARSE_POINT and directory
backup semantics, verifies disk object type, final normalized path, reparse status,
owner and ACL. Local fixed NTFS with persistent ACLs only. UNC, device/extended
namespaces, alternate streams, drive-relative/normalized aliases, reserved devices,
trailing dots/spaces and paths over240characters are refused. Unicode ordinary
names are supported; control/format characters are refused. Mapped drives/aliases
must match the actual opened normalized drive path; no network storage.

Private targets require current token-user owner, protected non-null DACL, bounded
ordinary allow/deny ACEs and no allow to any principal except current SID, SYSTEM
and built-in Administrators. Denies never excuse a broad allow; unsupported/callback
ACE types refuse. Ancestor owners may additionally be TrustedInstaller, and broad
ancestor grants cannot permit delete/delete-child/ACL takeover/attribute mutation.
Inherit-only ancestor grants do not apply to that ancestor. SYSTEM, Administrators,
TrustedInstaller and hostile same-user processes are outside this isolation claim.
The helper never repairs an existing ACL, takes ownership or changes inheritance.

New directories/files receive a protected current-user/SYSTEM/Administrators DACL
and explicit current-user owner *at creation*, not after an exposed create/chmod
window. Missing intermediate directories are individually created and checked.
Existing targets are verified unchanged. Hard-linked files, reparse points and
non-disk/special objects refuse. File reads query ACL/identity on the same handle,
then read at most the selected bound; ordinary private reads deny sharing write/
delete. Journal reads allow cooperating append/rotation, check locks and before/
after identities/times, retry boundedly, and create no directories/files. Writers
use a private cooperative directory lock, never steal locks, keep two1MiB files,
inspect archive before rotation and flush. This is not a filesystem transaction
or hostile-same-user defense. Metadata allowlist still belongs to journal.mjs.

## Evidence and acceptance

Current macOS syntax/path/POSIX tests are not Windows evidence. New Windows Node22/
24 CI runs real ACL/file APIs: protected current-user reads, broad/inherited/wrong-
owner refusal, broad allow despite deny, hardlinks/junctions, no-write reports,
concurrent appends, rotation/unsafe archive and held-lock bounds. Initial two candidate runs hit15s process deadlines; independent C# compilation
passed on the second run, but no ACL success is inferred. Selected OS environment
startup diagnosis and scoped-state candidate tests are the next exact-source gates. No native Windows Codex install/events,
Windows11 desktop, WSL or Windows restore claim. Windows CI is an OS primitive
proof, not host integration. Runtime state/settings/exports/restore stay refused
until reviewed integration and corresponding tests are completed.

Required next gates: observe exact-source Windows CI; inspect raw descriptor and
handle/race behavior without printing sensitive fixture data; add null/unsupported
ACL, unsafe ancestors and helper process-timeout tests; integrate only validated
operations; rerun POSIX and Windows CI. Scoped-state enum/prune and Windows restore
need their own contracts. No raw secrets/transcripts or credential-store tests.

## Primary evidence retrieved2026-10-23

- [Node22 file-system documentation](https://nodejs.org/docs/latest-v22.x/api/fs.html): Windows mode bits do not distinguish owner/group/other permissions.
- [CreateFileW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew): handle access/share modes and reparse/directory flags.
- [GetSecurityInfo](https://learn.microsoft.com/en-us/windows/win32/api/aclapi/nf-aclapi-getsecurityinfo): descriptor on an open handle; READ_CONTROL; no race guarantee for concurrent descriptor changes.
- [File security/access rights](https://learn.microsoft.com/en-us/windows/win32/fileio/file-security-and-access-rights) and [CreateDirectoryW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createdirectoryw): explicit security descriptor at creation; persistent ACL requirement.
- [File information](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getfileinformationbyhandle), [final path](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getfinalpathnamebyhandlew), [volume information](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getvolumeinformationbyhandlew): object identity/link count, normalized target, filesystem support.
- [PowerShell execution policy](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-5.1): policy can block unsigned/downloaded scripts; no policy override here.

Microsoft RawSecurityDescriptor .NET Framework4.8 page was inaccessible through the
research tool; no claim of retrieving it. Relevant public APIs above were retrieved.
Original MIT code, no third-party ACL library/native binary or upstream mod code.
