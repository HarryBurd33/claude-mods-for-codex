# Source22 review — retained code-ancestor metadata proof

2026-10-24. Human selected GPT-6.1 Sol High from verified4a6db33.
Source22 is uninstalled. Human-trusted dev10, private settings/logging scope,
all93 requirements and every production Windows gate remain unchanged.
The full product remains incomplete.

## Decision and authority boundary

Source21 closes its metadata handles before returning MatchesDraftRule. That enum
must never become a capability for a later operation. Source22 examines the concrete
lifetime prerequisite: retain the exact directory/ancestor handles inside a private
proof object, compare handle identity and sampled descriptors, then close everything.
No executable/private-data authority, ProgramPins replacement or production API.

Original MIT `proofs/windows-owned-process/CodeAncestorLease.cs` is compiled only
by the isolated proof build.ps1. It exposes only two explicitly named harness
wrappers, no directory handle/path/descriptor/token. KnownCodeAncestorScope was
extracted privately from source21 without changing its path/SDK/status behavior.
Both old assessment and new known lease perform the same fresh strict path,
64-bit OS/process and exact public SDK ProgramFilesX64 match before target IO.
No old assessment result is passed in as authority.

The synthetic wrapper is a separately named test assumption, NOT an OS scope
witness. Its explicit selected parent is required to be private by original Pins
and remains held outside the sample. It cannot grant private-data/code access.
All mutations in tests are to disposable owned fixtures; the actual ProgramFiles
case performs read-only metadata queries and fixed control only.

## Retention and sample contract

Private CodeAncestorLease retains a bounded, positive ancestor chain. Each handle
uses ReadControl/attributes/FILE_LIST_DIRECTORY, sharing read/write but not delete,
Backup/OpenReparse, null security attributes (non-inheritable). No enumeration,
image/file-content IO or writes. Original Info/Volume and prefix Access(false)
checks remain. Only final matched root uses source21's draft descriptor predicate;
original global Trusted/private-data/ProgramPins policies remain byte-identical.

Capture retains each directory's volume/index identity and owner+DACL serialized
sample (maximum64KiB, original128ACE/owner/DACL validation). Verify repeats Info,
original prefix policy/final draft rule, compares identity and exact bounded sample
bytes. No hashes/ACLs/SIDs/paths are output. A changed even still-allowed read grant
refuses the sample. Unsupported/foreign mutation descriptors and IO errors refuse.
Constructor invokes Verify after capture; any partial failure closes acquired
handles. Disposed Verify refuses; Dispose is idempotent and clears descriptor
arrays. Known wrapper validates scope before this construction. No handles escape.

This is a sampled metadata/lifetime proof, NOT an atomic or continuous ACL snapshot.
READ_CONTROL and no delete sharing do not prevent WRITE_DAC/owner/admin changes.
Original Access and descriptor acquisition can sample different instants. Changes
and restoration between samples can be missed. Benign system metadata changes can
conservatively refuse. No protection against hostile same-user/admin/privileged
Installer; no executable authenticity, dependency/loader closure, source provenance,
filesystem-content snapshot, code admission or permission approval is established.
SDK binding is a lookup sample, not an immutable registry/OS configuration lease.
Retained identities apply only during handle lifetime, not after release/reuse.
Pending native metadata IO still lacks a universal wall-clock completion bound.

## Harness and six acceptance cases

Harness modes known-ancestor-lease/synthetic-ancestor-lease emit only fixed frames:
held; unchanged or changed-or-refused/cancelled/control-refused; disposed-refused;
released. Construction/scope refusal emits only a closed refusal/assessment enum.
One control byte: v verify, c/EOF cancel, other byte refused. No arbitrary callback
or unbounded input line. Parent harness has15s deadline/output bound, kills and
waits before fixture cleanup. The inner control wait itself is not a production
service deadline. Parent termination lets the OS close its handles; no descendants
are spawned by this new proof. Existing OwnedProcess proof stays separate.

New cases in `test/windows-owned-process.test.mjs` (75 total):

1. Own synthetic final Installer grant matches draft only; retained target/parent
   renames refuse; original private-data API still refuses. Both rename after
   release; original own ACL restored. No marker/inheritance propagation hazard.
2. During hold, own final allowed-read/foreign-write/deny+write/null-DACL changes
   produce changed-or-refused. Restore own ACL, fresh lease revalidates unchanged.
3. Allowed-read prefix descriptor change refuses sample although original prefix
   mutation policy can allow that read. Explicit protected child ACL retained.
4. Unsafe final descriptor refuses construction; target AND parent rename afterward
   proves partial handles released. Own ACL restored without assertion weakening.
5. Cancel/EOF/invalid control and external helper termination release handles;
   post-exit rename succeeds. Normal disposal refuses reuse, idempotence checked.
6. CI opt-in actual SDK ProgramFilesX64 retains/rechecks unchanged metadata only;
   private/child/invalid/ADS inputs refuse before target IO. No system rename/ACL
   attempt, image read or candidate Git execution. No capability is returned.

Local macOS14.6/Node24.22.0/npm11.19.1: npm test186pass/0fail/95Windows-only skips,
281total; targeted Windows75skips/0passes, not Windows success. Validate3mods/
replay4fixtures, diff-check clean. Windows CI pending candidate upload; actual
compiler/OS logs must be inspected before success claims or model switch.

## Primary evidence retrieved2026-10-24

- [CreateFileW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew):
  sharing rights persist until handle closure; delete access includes rename;
  null security attributes disable inheritance. No claim that sharing freezes ACLs.
- [GetFileInformationByHandle](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getfileinformationbyhandle):
  volume serial/file index comparison identifies targets. Local NTFS only in proof;
  no remote filesystem generalization or post-release identity guarantee.
- [GetSecurityInfo](https://learn.microsoft.com/en-us/windows/win32/api/aclapi/nf-aclapi-getsecurityinfo):
  owner/DACL require READ_CONTROL; explicitly does not handle descriptor-change
  races. We preserve that limitation, not call the sample an atomic snapshot.
- [SetSecurityInfo](https://learn.microsoft.com/en-us/windows/win32/api/aclapi/nf-aclapi-setsecurityinfo):
  descriptor mutation and inheritance propagation are separate from sharing pins.
  Existing fixture changes apply only to owned disposable paths, never system ACLs.
- Exact SDK IDs/flags/current-token/bittedness sources remain in DEV21-REVIEW.

## Preserved state and next gate

All production Windows settings/project/Git/restore gates stay before-IO refusals.
No CodeAccess/ProgramPins/OwnedProcess/production PrivateStorage/adapter/state20
change. Production server/manifest/package version22 only. No installation, human
trust bypass, logging expansion, paid/model/API run, system ACL repair, executable
fallback/download or actual candidate Git launch. User Windows11 remains unavailable
per latest reply; no repeated ask. Earlier Windows CI is not native Codex acceptance.
PL-04 remains unverified; all93 IDs/order retained. Source21 first failure/correction
and source20's precise old contention-cause uncertainty remain preserved.

No machine rollback needed. Uninstalled source/owned fixtures can be removed after
child exit; do not delete live locks, patch installed cache/trust hashes or restore
shared configuration wholesale. Existing dev10 supported selective rollback stays
separate. Human review required for any future installed code change.

After actual CI inspection, save/upload/verify a complete checkpoint and stop for
human GPT-6.1 Sol Medium for source22 packaging. Further security/admission
composition remains High; this isolated lease is not authorization to compose it.
