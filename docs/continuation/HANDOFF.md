# Source21 handoff — stop for human Sol Medium

2026-10-24. Human selected GPT-6.1 Sol High from verified `a1bc966` on
`codex/astra-groundwork`. Objective completed for this High milestone: a narrow,
proof-only OS-known code-ancestor descriptor assessment, with actual Windows CI.
The full 93-capability product remains incomplete. Source21 is uninstalled.

## Read first

Read this file, STATUS.md, REQUIREMENTS.md, ARCHITECTURE.md, TEST-LOG.md,
DEV21-REVIEW.md, PACKAGE-DEV20.md, DEV20-REVIEW.md, DEV19-REVIEW.md,
../windows-storage.md, ../windows-native-acceptance.md and the latest section of
ignored root HANDOFF.md. Earlier versioned records are historical. The root
handoff, machine paths/configuration, raw logs and private evidence stay ignored.

## Exact checkpoint and observed results

Repository: https://github.com/HarryBurd33/claude-mods-for-codex
Branch: `codex/astra-groundwork`.

Tested corrected source:
[4b99ac1bdac3aad211a4553feb4fcacb7ce61f57](https://github.com/HarryBurd33/claude-mods-for-codex/commit/4b99ac1bdac3aad211a4553feb4fcacb7ce61f57),
tree `c605eea0dd705bf2c75a0660dc781487d9956b5a`.
[CI40071604769](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40071604769)
passed all seven jobs. Actual decoded logs were read:

- Windows Node22 job120806040058 and Node24 job120806040276: each 20 storage +
  69 proof passes, zero failures/cancellations/skips. All three new cases and
  private fixture cleanup passed. Windows Server2025 NTFS,
  `windows-2025-vs2026` image `20261021.278.1`, Windows PowerShell5.1 build path.
- Four Ubuntu/macOS Node22/24 lanes: each 186 passes, zero failures, 89
  Windows-only skips, 275 total. Windows portable job concluded successfully.
- Local macOS14.6/Node24.22.0/npm11.19.1: `npm test` 186/0/89 skips;
  `node --test test/windows-owned-process.test.mjs` 69 skips/0 passes;
  `npm run validate` 3 mods; `npm run replay` 4 fixtures; diff-check clean.

First source `b16a7495656c0968103605cd623121f624c18494`, CI40071218873:
5 jobs passed, both Windows OS lanes failed a new marker read and teardown after
parent fixture inheritance replacement. Each storage suite passed20; proof
report68pass/2fail/70total includes the after-hook failure. SDK/descriptor groups
passed. The correction gives only that own sentinel an explicit protected private
file ACL before changing the parent; no policy/assertion/budget change. Old raw
child ACL was not dumped; propagation mechanism is a documented inference.
No retry/erasure. DEV21-REVIEW preserves exact failed-job identities.

Equivalent original local commits are retained on local branches:
`253cc2f` (first), `4bcd98b` (corrected fixture). The corrected remote tree was
independently fetched, compared in full and read back anonymously. The following
notes-only checkpoint is uploaded/read back after this file is saved; actual
final local/remote/tree identities belong in the checkpoint reply and ignored
handoff, avoiding a circular self-hash claim. Next model must verify HEAD/ref.
No force-push or lost commits.

## Contracts and security decisions

`proofs/windows-owned-process/CodeAncestorAssessment.cs` is original MIT,
proof-only, compiled by that directory's build.ps1 and exposed by Harness.cs:

- `run code-ancestor <private-fixture-root> <candidate>` returns a closed enum.
  Original strict path and 64-bit OS/process checks precede public SDK lookup.
  SHGetKnownFolderPath / FOLDERID_ProgramFilesX64 / DONT_VERIFY / current token,
  bounded240-character conversion, returned memory freed; no CREATE/INIT/setter.
  Exact OS-returned candidate equality is required before target-object IO.
- Original no-follow retained metadata/NTFS/final-path checks and prefix Access
  remain. Only the exact matched folder gets a separate bounded draft descriptor
  predicate. Known Installer owner/mutation is accepted only there, not globally.
  Unknown mutation grants refuse even with denies; malformed/missing/unsupported
  owner/DACL/ACEs/counts refuse. Inherit-only current-root handling grants no child
  authority. Handles close; no authority/capability escapes.
- `run code-ancestor-case <private-fixture-root> <closed-fixture-kind>` covers18
  constructed descriptors. A synthetic scope assumption is not an OS witness.
- Result `MatchesDraftRule` is an assessment, never permission/code authenticity,
  executable pinning, private-data authority or an atomic snapshot. Children,
  private paths and invalid inputs refuse. No enumeration/image bytes/signature/
  version/network/registry change/candidate Git execution. Pending metadata IO
  is not universally bounded by the outer harness deadline.

Tests: `test/windows-owned-process.test.mjs`, three new native cases (69 total).
They verify narrow descriptors, actual private-data refusal and unchanged marker,
exact SDK folder scope, child/invalid refusal, and original metadata-only Git pin
refusal. Both fixed Git candidates still refuse before content reads; separate
repeat diagnostic CodeAncestor/ForeignInstallerGrant/segment1 is not authority or
an atomic retrospective cause. No candidate hash/import/version/loader claim.
Original ProgramBoundary/OwnedProcess/PrivateStorage/production adapter and source20
state budget are unchanged. Only src/server.mjs version changed in production
source. Manifest/package/server report `0.2.0-dev.21`.

Primary Microsoft sources retrieved2026-10-24: KnownFolderID,
SHGetKnownFolderPath, KNOWN_FOLDER_FLAG and SetSecurityInfo. Exact links, flags,
bitness/refusal contracts and inference limits are in DEV21-REVIEW.

## Status, installed scope, permissions and rollback

Completed: isolated SDK scope/descriptor proof, 18 constructed cases, private-data
separation and corrected real OS tests. Partial: code-installation trust design;
this draft ancestor assessment is not composed into admission. Unverified/blocked:
Windows11 native Codex installation, trust, hooks/sandbox, dashboard and all gated
settings/project/Git/restore paths. PL-04 stays unverified. All93 IDs/order retained.
Windows11 unavailable per latest reply; do not repeatedly ask availability.

Installed human-reviewed dev10 remains byte-equal to its immutable149-file fixture.
Private settings unchanged. Logging remains scoped to the selected disposable
child project; this chat is outside it. Do not widen scope or treat per-call cwd
as trusted capture scope. No source21 install/update, native hook/UI observation,
trust/config/cache/retention/observer/theme/client change or extra model/API run.
No paid keepalive, secret discovery or system ACL repair. All production Windows
before-IO gates remain closed. Native claims from older versions stay separate.

No machine rollback is needed for this stage. Ignore/remove only owned disposable
proof/package artifacts after children exit; never remove live locks, edit trust
hashes, patch installed cache, repair system ACLs or restore shared config wholesale.
Existing supported selective dev10 disable/removal/rollback remains a separate
reviewed workflow; settings/data remain intact. Future installed changed code needs
human host trust review. No protected user action/restart is required for packaging.

## Exact next model, tasks and acceptance

**GPT-6.1 Sol, Medium.** Remaining immediate task is routine source21 packaging;
High is no longer needed for archive verification. Do not perform additional gated
Windows security/admission work at Medium.

1. Verify clean branch and exact public checkpoint via anonymous clone. Read this
   handoff and latest private handoff. Preserve both CI runs and source20's old
   contention failure/precise-cause uncertainty as distinct evidence.
2. Run warranted offline full suite against that exact public clone. Expected local
   186/0/89 skips, not Windows success. Validate3/replay4. No dependency installs or
   lifecycle scripts; no native/model/API test or installed update.
3. Build with `npm pack --ignore-scripts --offline --json`, isolated empty npm config
   and local cache. Verify every byte against clone/workspace, one package root,
   no traversal/links/special/private paths/raw logs/secrets/dependencies/compiled
   binaries, MIT/independent status/version21/default-off logging. New assessment
   source/build/harness/tests/docs present; production helper excludes proof code.
4. Fresh spaced extraction: validate/replay plus relevant package/scaffold/state
   scheduler/slow-sync tests. Windows-only skips remain explicit. Document exact
   archive file count/bytes/hash and observed outcomes, not inferred success.
5. Save sanitized PACKAGE-DEV21/status/handoff, upload meaningful safe progress on
   this branch with expected-parent/nonforce checks. Verify final remote full tree
   and anonymously read back branch. Rebuild final notes-only archive/readback and
   spaced validate/replay; no repeated full suite solely for notes.
6. Stop for human **GPT-6.1 Sol, High** before any subsequent runtime/security or
   Windows gate composition. Do not widen Installer trust or execute candidate
   Git. A draft rule match alone authorizes no trust expansion. Keep all unfinished
   supported requirements in scope; do not call this a completed product.

If a new hard security question emerges during packaging, save/review the concrete
blocker and stop for High rather than changing gated code. Do not delegate or
schedule continuation to bypass human model switches.

## Copy-and-paste resume instruction

I've switched to GPT-6.1 Sol, Medium. Continue from the verified source21 High
checkpoint on codex/astra-groundwork. Read docs/continuation/HANDOFF.md and its
listed files plus latest ignored root HANDOFF.md; verify the exact remote HEAD.
Verify source21 packaging. Keep corrected4b99ac1/CI40071604769 and first failed
b16a749/CI40071218873 distinct: only own sentinel setup changed, original Git pins
and every production gate remain closed. The exact SDK ancestor assessment is no
executable/private-data authority or native Windows compatibility. Preserve logging
scope, human trust, installed dev10/private settings, all93requirements and source20
state/failure evidence. No install/trust automation, gated security edit, candidate
Git execution or extra native/model/API run. Save/upload/independently verify the
package checkpoint, then stop for human Sol High before further gated Windows work.
