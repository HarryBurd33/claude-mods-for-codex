# Windows private storage — development source0.2.0-dev.7

Native OS primitive checkpoint f152acb passed all15 tests on Windows Server2025
Node22/24 in CI40033656920. Current source integrates journal, scoped state and
explicit selected-usage reads through that adapter; integration CI40035478192 passed all7jobs (20/20 in each native Windows lane).
This is not native Codex/Windows11 acceptance. Installed dev6 is unchanged.

Windows dashboard settings, project/Git views and restore remain explicitly
unavailable before filesystem traversal. Private read support alone cannot safely
enable those larger paths. See the separate acceptance gates below.

## Gated execution research — resumed High 2026-10-23

[Isolated process proof](../proofs/windows-owned-process/README.md) tests mandatory
creation-time job-list/handle-list ownership, bounds and parent-death cleanup.
It is not loaded by the production adapter; existing taskkill behavior unchanged.
No executable-trust, private Git scratch, traversal, restore or native-host claim.
Current OS results belong in continuation/TEST-LOG.md. Windows gates stay intact.

## Storage boundary

src/windows-storage.mjs launches only fixed Windows PowerShell5.1 with -NoProfile,
-NonInteractive and the fixed packaged .ps1 path/cwd. OS profile/runtime variables
are narrowly allowlisted, never the full environment or credential/API-key vars.
No shell interpolation, PATH-selected helper, elevation, policy override, module
import/discovery, profile or downloaded code. Internal v2 frames are ASCII with
base64 fields, bounded32KiB request/3MiB response. Default15s plus500ms cleanup targets
only the owned helper tree via fixed system taskkill. A shorter shared telemetry
budget is required before native-hook activation; do not put15s work before a
five-second host guard response. Errors sanitized, no native diagnostics/paths/SIDs
returned to model. Explicit private-file bytes go only to the calling local process.

The script uses only language/.NET APIs and compiles fixed original C# package
source with Framework CSharpCodeProvider, GenerateInMemory and /noconfig. It never
compiles request/config text. Normal execution/application-control/language policy
can refuse and must not be bypassed. Compiler-managed temporary artifacts contain
public source, not requests/file contents. .NET Core/PowerShell7 is not a fallback.
This is trusted local process authority, distinct from the model tool sandbox.

src/windows/PrivateStorage.cs keeps checks and IO inside one process. It opens
and pins each ancestor with no share-delete, OPEN_REPARSE_POINT and directory
backup semantics, verifies disk object type, final normalized path, reparse status,
owner and ACL. Local fixed NTFS with persistent ACLs only. Drive type is checked before opening
its root, and missing-file checks use no-follow handles rather than File.Exists,
so a rejected junction/mapped drive cannot first trigger a target read. UNC, device/extended
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

Native Windows Server2025 Datacenter10.0.26100, runner image windows-2025-vs2026
20261021.278.1, Node22/24 CI40033656920: all15 tests passed in each native lane.
Includes protected private reads, broad/inherited/wrong-owner/null ACL refusal,
broad allow despite deny, mutable ancestor, hardlinks/junctions, no-write reads,
concurrent append/rotation/unsafe archive/held lock, scoped state isolation and
freshness-checked prune, owned process deadline, exact scope and shared telemetry
budget. Earlier failures and repairs are retained in continuation/TEST-LOG.md.
No native Windows Codex install/events, Windows11 desktop, WSL or restore claim.

Integration adds public journal/state/report/selected-usage APIs, read cancellation,
observer signal propagation and a synthetic native hook subprocess with stalled
telemetry. Source f63ebab/CI40035478192 passed20/20 on both native Windows
Node22/24 lanes (17Windows-only cases+3portable predicates), all4POSIX and portable
Windows jobs. A subprocess is not native Codex event delivery. Default logging/registration remain unchanged. The current
macOS installed dev6 configuration, human trust and selected data are untouched.

## Explicit Windows boundaries

- Storage requires an explicitly selected local fixed NTFS path, normal helper
  policy and current-user protected ACLs. No automatic ACL repair, credential
  discovery, policy bypass or trust action. Data root must leave room for the
  hashed scoped layout: at most157 UTF-16 code units; all final paths at most240.
- Hook metadata requires CODEX_MODS_PROJECT_ROOT and exact native cwd equality,
  without descendant inference/case folding or filesystem scope walking. Journal
  and scoped metadata share1500ms, plus bounded500ms owned-tree cleanup, below the
  host5s hook deadline. Slow/unavailable optional storage drops metadata, preserves
  the dispatcher decision and reports only a fixed diagnostic. Actual Windows
  host path spelling, sandbox, permissions and throughput remain unverified.
- Public storage/selected-usage CLI reads use at most15s+500ms cleanup. Cancelled
  native reads stop the owned helper tree; pre-aborted reads do not spawn. No
  daemon, watcher, network call or model call. POSIX paths remain as before.
- Windows runtime settings/dashboard and all workspace/Git entry points refuse
  before project traversal or execution. Existing POSIX Git execution uses PATH
  and a private POSIX scratch directory; porting it unchanged could select a
  project git.exe or expose copied index/refs through inherited Windows ACLs.
  Safe enabling requires a validated absolute trusted local Git executable,
  atomically private scratch, trusted cwd/environment, bounded owned Git process
  tree cleanup, Windows traversal tests and native host acceptance. These are
  unfinished Windows requirements, not proof that Codex cannot support them.
- Windows restore remains refused. It needs private plans plus reviewed no-follow
  project-write/conflict/metadata/interruption/sandbox behavior. The private
  reader does not establish a safe writer. Use an explicitly reviewed normal
  host file edit as the practical alternative; no automated Windows restore claim.

## Setup, retention and removal

No installation or machine configuration changed in this source-only stage.
Use the supported package installation/update workflow and human changed-code
review before executing a new snapshot; never edit an installed cache or trust
record. Windows full installation/rollback still requires a native Codex host.
For OS tests use npm test on POSIX or the dedicated native Windows CI command
node --test test/windows-storage.test.mjs. Only synthetic disposable fixtures.
An existing broad/inherited data ACL is refused rather than repaired. A user can
select a new private data directory; do not weaken or copy shared ACLs blindly.
State prune requires an explicit valid cutoff and removes only verified expired
known files/scopes. Locks are never stolen. Removal of source/package does not
remove user settings/data; stop writers, inspect the explicit selected directory
and choose separate data deletion. Never delete a live lock to force operation.

## Primary evidence retrieved2026-10-23

- [Windows executable search](https://learn.microsoft.com/en-us/windows/win32/api/processenv/nf-processenv-needcurrentdirectoryforexepathw): current-directory search is a separate boundary; an absolute trusted Git path/cwd still needs validation.
- [Node22 file-system documentation](https://nodejs.org/docs/latest-v22.x/api/fs.html): Windows mode bits do not distinguish owner/group/other permissions.
- [CreateFileW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew): handle access/share modes and reparse/directory flags.
- [GetSecurityInfo](https://learn.microsoft.com/en-us/windows/win32/api/aclapi/nf-aclapi-getsecurityinfo): descriptor on an open handle; READ_CONTROL; no race guarantee for concurrent descriptor changes.
- [File security/access rights](https://learn.microsoft.com/en-us/windows/win32/fileio/file-security-and-access-rights) and [CreateDirectoryW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createdirectoryw): explicit security descriptor at creation; persistent ACL requirement.
- [File information](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getfileinformationbyhandle), [final path](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getfinalpathnamebyhandlew), [volume information](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getvolumeinformationbyhandlew): object identity/link count, normalized target, filesystem support.
- [PowerShell execution policy](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-5.1): policy can block unsigned/downloaded scripts; no policy override here.

Microsoft RawSecurityDescriptor .NET Framework4.8 page was inaccessible through the
research tool; no claim of retrieving it. Relevant public APIs above were retrieved.
Original MIT code, no third-party ACL library/native binary or upstream mod code.

Public [Import-Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/import-module?view=powershell-5.1) and [module loading](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_modules?view=powershell-5.1) guidance retrieved2026-10-23 supports the explicit built-in binary-module load; no remote module imported.

.NET [Assembly.Load](https://learn.microsoft.com/en-us/dotnet/api/system.reflection.assembly.load?view=netframework-4.8) retrieved2026-10-23. GlobalAssemblyCache property page was inaccessible; property behavior must be observed in native tests, not claimed from that page.

[CodeDomProvider.CompileAssemblyFromSource](https://learn.microsoft.com/en-us/dotnet/api/system.codedom.compiler.codedomprovider.compileassemblyfromsource?view=netframework-4.8.1) and [CSharpCodeProvider](https://learn.microsoft.com/en-us/dotnet/api/microsoft.csharp.csharpcodeprovider?view=netframework-4.8.1) retrieved2026-10-23; these APIs require .NET Framework. Earlier module-loading experiments were superseded, not shipped as supported routes.
