# Source12 explicit Windows read-set proof — 2026-10-23

Human resumed GPT-6.1 Sol High frome8557f7. Windows11 computer is **not available
yet**, per fresh human reply; continue proofs. Original MIT code, no subagent or
extra model/evaluator. Source12 is uninstalled; installed human-trusted10 unchanged.
All production Windows settings/project/Git/restore refusals remain before IO.

## Narrow contract

ProjectReadSet.cs is a proof-only partial helper extension, compiled only by the
isolated fixed-source test build. ProjectReadSetProof(selectedRoot,relativePaths,
CancellationToken), Count, Verify(), Bytes(index), Dispose(). One synchronous
owner, explicit selected files only, no enumeration or automatic discovery.

Validate the entire input set before filesystem calls:1–20 portable forward-slash
relative paths, at most16segments; no duplicates under ordinal case-insensitive
comparison. Existing helper path rules refuse control/format characters, traversal,
empty/normalized/drive/UNC/device/ADS/long/short-name aliases. Original workspace
sensitive/directory-name exclusions apply to every segment. No caller code/import,
no fallback, missing-file/directory creation, ACL repair or credential access.

This is **not an ignore engine**. A future trusted caller must establish allowed
paths from the configured project's ignore policy first. Model/UI parameters may
not directly become this proof API's allowlist. In this stage every selected path
is a fixed synthetic test fixture; no real project file or Git metadata is read.

Original helper Pins holds no-reparse disk/NTFS ancestors with no delete sharing;
Info checks final normalized path, type, single-link identity and no reparse flag.
Each final file uses GENERIC_READ/READ_CONTROL/attributes, OPEN_EXISTING and only
read sharing: ordinary writable/delete handles conflict. No write access or
inheritable handles. Existing CodeAccess adds conservative foreign mutation-grant
refusal, including WriteData/Append/EA/attributes/ACL/owner/delete; foreign ordinary
read grants remain allowed for project data. Denies do not excuse broad allows.
Shared mutable projects may refuse; permissions are never repaired.

Per-file256KiB and aggregate1MiB bounds are checked from held-handle metadata before
content read. All positive files/ancestors stay held. Captured byte arrays remain
inside the helper. Verify rechecks ACL, volume/file ID/creation/write time/size/
attributes and rereads bytes through the same handle with native pointer/read APIs;
no managed read-ahead cache is used. Bytes(index) re-verifies before returning a
clone of the captured bytes. Dispose releases only owned handles and clears its
captured arrays, not returned clones; no memory-erasure guarantee.

Cancellation checks and a5s monotonic budget apply per constructor/Verify operation,
including read chunks; they cannot interrupt a blocked synchronous kernel IO call.
A future caller still needs the separately bounded owned-helper process deadline.
No production budget or operation is changed. Constructor failure disposes every
acquired pin. Disposal is idempotent; reading after disposal refuses.

## Consistency and exclusions

This is an explicit **positive read set**, not an atomic whole-directory snapshot.
New/unselected entries can appear while pins are held. Ignore decisions, negative
lookups, case-sensitive directory policy, repository membership and live Git status
are not certified. Existing writable mapped views are a separate IO path; the
proof tests whether Windows refuses the handle or byte re-verification detects a
change even with restored modification time. Neither outcome proves hostile same-
user/admin isolation or prevents a malicious change-and-restore between observations.
Only captured bytes could be consumed later; never treat returned original paths
as authority to let Git reopen a live tree.

The composite test copies one fixed captured synthetic file into source11's private
flat delete-on-close slot. It proves only those two primitives compose on that
fixture. No named Git layout/config/index/ref creation, external binary/DLL launch,
project-wide snapshot, OS network sandbox or writer is established. Original
workspace.mjs32MiB index bounds are not replaced by these1MiB proof bounds.

## Native OS acceptance added

Eight new real-Windows cases cover:

- Explicit nested Unicode paths, exact count/byte summary and unchanged source/
  synthetic Git sentinel bytes; no helper sidecars/locks.
- Traversal/sensitive segments/device/ADS/alias/case-collision/depth refusals.
- Junction/root alias/hardlink/directory/missing-file refusal and later valid read.
- Empty/too-many/per-file/aggregate bounds and pre-cancellation.
- Foreign mutation grants, deny+allow and pre-existing writer refusal; ordinary
  foreign read permission is accepted for project data, separate from private scratch.
- Live source/ancestor pinning, ordinary writer/rename refusal, unselected entry
  creation without an entire-tree consistency claim; release on cancellation.
- Writable mapping mutation with restored mtime; record the actual fixed diagnostic
  mapping-refused or changed-refused, never infer which branch from a passing test.
- Captured synthetic bytes copied to private delete-on-close slot; source untouched.

Actual results/source/CI belong in TEST-LOG after observation. Local macOS skips
are not Windows passes or native Codex/Windows11 acceptance.

## Primary evidence actually retrieved2026-10-23

- [CreateFileW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew):
  access/sharing/no-follow/open-existing and inheritance behavior.
- [GetFileInformationByHandle](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getfileinformationbyhandle):
  held-handle identity, size and attributes, not atomic directory snapshot semantics.
- [File security/access rights](https://learn.microsoft.com/en-us/windows/win32/fileio/file-security-and-access-rights):
  explicit data/metadata permissions are distinct, generic rights map to file rights.
- [Creating a file view](https://learn.microsoft.com/en-us/windows/win32/memory/creating-a-file-view):
  mapped writes and filesystem caching require a separate consistency witness.

No loader/settings/permission/model change is inferred from those documents. The
Windows helper ACL/path/job/scratch sources from DEV9/DEV11 remain foundational.

## Remaining gates

Actual installed Windows Git executable/parent/dependency/loader inventory is
unavailable until the later host. Inert named Git scratch layout/compatible readers,
ignore-aware bounded selection and consistent repository/object semantics still
need High review and real OS tests before any production activation. Restore is a
separate explicit writer: identity/content conflict, metadata/interruption and
normal native sandbox/permissions. Native Windows installation/hooks/UI/unload
remain unverified. No automatic trust, paid model run or new client direction.
