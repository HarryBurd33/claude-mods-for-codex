# Source21 review — exact known-folder code-ancestor assessment

2026-10-24. Human selected GPT-6.1 Sol High from verifieda1bc966. Full93product
incomplete. Source21 uninstalled; installed human-trusted dev10/cache149files/private
settings/logging scope unchanged. All production Windows gates remain closed.

## Concrete prerequisite and decision

Source19 observed an Installer-matching mutation grant at Program Files after
original Git pin refusal. It did not justify globally trusting Installer or repairing
system ACLs. Source21 tests a separate, read-only draft descriptor rule for exactly
the OS-known ProgramFilesX64 directory. It is an assessment, NOT admission,
permission approval, a reusable capability or code authenticity validation.

Decision: original production Trusted/Access and proof ProgramPins stay byte-
identical. Draft result MatchesDraftRule is never consumed by executable/data
admission. No fallback, candidate image read, Git process, DLL load of a candidate,
ACL repair, registry/config/trust change or global Installer allowlisting. Ordinary
OS API imports are dependencies of this test process, not evidence of a future
candidate's loader closure. Windows helpers/proof admission/state20 fix unchanged.

## Exact code contract

Original MIT CodeAncestorAssessment.cs is compiled only by isolated proof build,
not production private-storage.ps1. AssessKnownCodeAncestorProof(candidate):

- Original strict PathInput validates caller path before lookup. Requires64-bit OS
 and process. SHGetKnownFolderPath for FOLDERID_ProgramFilesX64 with DONT_VERIFY,
 current token only; no CREATE/INIT/DEFAULT_PATH, impersonation or guessed PATH.
 Returned UTF16 conversion bounded240chars; COM allocation freed on all returns.
- Caller path must equal that exact OS-returned folder. Children/private roots/
 lookalike names/aliases/ADS/UNC/relative forms cannot reuse the descriptor rule.
 No target-object IO after a scope mismatch. This is not folder discovery for
 arbitrary user data. Nonlocal or unsupported paths refuse before traversal.
- Derived positive ancestor chain only. ReadControl/attributes/list-directory
 handles, no enumeration/write/delete sharing. Original Info/Volume ensure local
 NTFS/disk/directory/no-reparse/final-path identity. Prefix ancestors still require
 original Access(false). All handles close in finally; none returned as authority.
- At the one matched folder only, bounded owner/DACL shape and ACE predicate:
 current user/SYSTEM/Admins plus existing Installer constant for mutation grants.
 Unknown/callback/object ACEs, missing owner/DACL/flag, >128ACEs and unknown allowed
 mutation grants refuse. Denies never excuse unknown allowed grants. Mutation mask
 is union of original code/ancestor masks, including create/write/ACL/delete.
 Inherit-only grants do not apply to this root; child/image policy is NOT inherited
 or assessed, and children fail the scope check. No new private-data authority.

The descriptor rule does not require protected inheritance at this system ancestor;
verified prefix metadata and the final descriptor sample are the boundary. This is
not protection from hostile same-user/admin changes or an atomic snapshot/OS image
attestation. API metadata IO can remain pending despite outer20s harness deadline;
no universal wall-clock completion guarantee. SDK/OS errors refuse/fail closed.

Harness modes code-ancestor and code-ancestor-case return only closed enum names,
never caller path/SID/raw ACL/mask/config/environment/session content. The latter
uses18closed constructed descriptor fixtures and a synthetic scope assumption;
it is NOT an OS scope witness. There is no arbitrary SDDL input, trust-store lookup
or installed-system ACL mutation. No production MCP/UI/API/schema expansion.

## Acceptance tests and observed local checks

Three new Windows cases:

1.18constructed cases: base/Installer/Installer-owner/read-only/inherit-only,
 unscoped, unknown write/generic/service/deny+allow, foreign/missing owner, missing
 DACL/flag, callback/object ACE, count overflow and unknown fixture kind. Expected
 positive results are draft predicate matches only, not effective permissions.
2.Existing private-data API still refuses a synthetic current-user-owned private
 root carrying Installer full-control grant. That same abstract grant can match
 the code-only descriptor fixture, while the actual private path fails known-folder
 scope. Marker preserved, only own fixture ACL restored after calls complete.
3.CI explicitly selects the known Program Files ancestor from its already reviewed
 fixed Git root. Real SDK lookup/retained metadata must match draft rule; child and
 invalid paths refuse. Original metadata-only pin mode still refuses both fixed
 Git candidates. It reads no image bytes even if some future changed ACL causes
 the assertion to fail. No admission result routes through this new assessment.

Local Windows suite69skips/0passes, not Windows success. Full npm test186pass/
0fail/89Windows-only skips275total; validate3mods/replay4fixtures/diff-check clean.
Corrected Windows CI passed; actual logs and scope limits are recorded below.
A draft directory match does not establish code admission or native acceptance. Source20/old38848a8 failure evidence preserved;
exact old host delay cause unproved, no state/runtime acquisition change here.

## Primary evidence retrieved2026-10-24

- [Known-folder IDs](https://learn.microsoft.com/en-us/windows/win32/shell/knownfolderid):
 ProgramFilesX64 GUID6D809377-6AF0-444B-8957-A3773F02200E; unsupported on32-bit
 OS or32-bit applications, hence explicit bitness refusal. Default examples do
 not establish actual installed paths; the live SDK result must match the input.
- [SHGetKnownFolderPath](https://learn.microsoft.com/en-us/windows/win32/api/shlobj_core/nf-shlobj_core-shgetknownfolderpath):
 current-token path retrieval and returned COM-memory cleanup; no setter used.
- [Known-folder flags](https://learn.microsoft.com/en-us/windows/win32/api/shlobj_core/ne-shlobj_core-known_folder_flag):
 DONT_VERIFY avoids implicit existence verification; CREATE/INIT not used. The
 proof itself performs explicit no-follow metadata checks after scope matching.

No released Codex/native Windows compatibility is inferred from SDK documentation,
schema, constructed descriptors or server CI.32-bit and ARM64 Codex hosts remain
unverified. Actual Windows11 machine still unavailable per latest reply; no repeat
availability question. No system-tool install/update/repair or secret discovery.

## Remaining gates and rollback

All93requirements retained; PL-04 remains unverified. Even a real MatchesDraftRule
only assesses one ancestor's metadata against a draft contract. It does not assess
Git root/children/image bytes, signatures, loader dependencies, config authority,
repository/hash-format/objects/freshness/ignores or a writer. Original conservative
executable admission and every production settings/project/Git/restore gate stay.
No future composition or trust expansion is authorized solely by this result.

No machine change needs rollback. New uninstalled source/owned disposable fixtures
can be removed; installed dev10 selective supported rollback remains separate. No
cache/trust hash edits, shared-config restore, live-lock removal or logging expansion.
After actual CI verification checkpoint/upload/readback, stop for human Sol Medium
for source21 packaging. Further gated security decisions require High.

## First CI candidate and fixture correction (preserved failure)

Sourceb16a7495656c0968103605cd623121f624c18494,
tree72998f1d8f2619dac4eefa5cce73ea1c00617bb0,
[CI40071218873](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40071218873):
5jobs passed; both Windows OS lanes failed. Actual decoded logs120804866914(Node24)
and120804866990(Node22) read. Each storage20pass; proof report68pass/2fail/70total
including after-hook cleanup error.18constructed cases and exact known-folder SDK/
legacy pin-refusal case passed. The private-root scope/API rejection assertions
were reached, then the own sentinel read failed EPERM; its teardown unlink also
failed. No raw host paths/ACLs published in these records.

The new sentinel inherited from its parent; fixtureAcl replaces that parent's
inheriting descriptor with non-inheriting rules. Read/delete refusal is consistent
with propagated removal of inherited grants. The fixture now explicitly applies
its existing protected private file ACL BEFORE parent replacement. No assessment/
production policy/assertion/budget changed; no system ACL repair. Child content
assertion and complete teardown must still pass. This is an isolated own-fixture
setup correction, not permission repair to the installed Git/system directory.

[Microsoft SetSecurityInfo](https://learn.microsoft.com/en-us/windows/win32/api/aclapi/nf-aclapi-setsecurityinfo),
retrieved2026-10-24, documents propagation of inheritable ACE changes to existing
children. We did not dump the old child descriptor, so propagation is the supported
mechanism/inference rather than a retrospective raw-ACL observation. Corrected
candidate verification subsequently passed as recorded below; the failed run remains.
No manual retry of40071218873, no hidden failure erasure or weakened assertion.


## Corrected source and observed CI

Corrected source [4b99ac1bdac3aad211a4553feb4fcacb7ce61f57](https://github.com/HarryBurd33/claude-mods-for-codex/commit/4b99ac1bdac3aad211a4553feb4fcacb7ce61f57),
tree `c605eea0dd705bf2c75a0660dc781487d9956b5a`.
[CI40071604769](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40071604769)
passed all seven jobs. Actual decoded logs were read, not inferred from green status:

| Job | Observed result |
| --- | --- |
| Windows Node22, 120806040058 | 20 storage + 69 proof passes, zero failures/cancellations/skips |
| Windows Node24, 120806040276 | 20 storage + 69 proof passes, zero failures/cancellations/skips |
| macOS Node22, 120806040271 | 186 passes, zero failures/cancellations, 89 Windows-only skips |
| macOS Node24, 120806040347 | Same 186/0/89 result |
| Ubuntu Node22, 120806040355 | Same 186/0/89 result |
| Ubuntu Node24, 120806040325 | Same 186/0/89 result |
| Windows portable contracts, 120806040247 | Successful job conclusion; distinct from OS and native-host acceptance |

Windows host: Server2025, `windows-2025-vs2026` image `20261021.278.1`,
Windows PowerShell5.1 build path, Node22/24, NTFS fixtures. No Windows11 Codex host
was available. This stage ran no native client session or model/API test.

Both corrected OS lanes passed the three new cases, including the private marker's
unchanged contents, refusal under the Installer grant, restoration and complete
teardown. Fixed diagnostic: ProgramFilesX64 / MatchesDraftRule /
admissionAuthority:false / imageRead:false / productionPolicyChanged:false.
Both original fixed Git pins still refused before data reads. Their separate
repeat diagnostic remains CodeAncestor/ForeignInstallerGrant/segment1 with
no authority, version not queried, authenticity/loader closure unverified.
The draft assessment does not identify or authenticate Git executables.

The only test correction was explicit protection of the own sentinel before the
parent fixture ACL changed. No C# assessment, original authority/admission code,
production gate, state acquisition budget, timeout or assertion was relaxed.
First and corrected runs are different commits; the failed run was not retried.

Local macOS14.6, Node24.22.0/npm11.19.1: `npm test` 186 passes/0 failures/
89 Windows-only skips (275 total), `node --test test/windows-owned-process.test.mjs`
69 skipped/0 passes, `npm run validate` 3 mods, `npm run replay` 4 fixtures,
`git diff --check` clean. Source21 packaging remains a separate Medium task.
149 installed dev10 files still equal the reviewed immutable fixture; private
settings/logging/human trust and all 93 requirement IDs/order are preserved.

The following handoff commit changes documentation only. Its actual local/remote
identity is read back after upload and recorded in the checkpoint response and
ignored handoff, avoiding a circular self-hash claim. No repeated full suite solely
for notes. Further admission composition and all remaining security gates require
High; routine archive verification can use Medium.
