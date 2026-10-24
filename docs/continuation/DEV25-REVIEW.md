# Source25 review — scoped installed-image read inventory

2026-10-24. Human selected GPT-6.1 Sol High from verified804a7ef on
`codex/astra-groundwork`. Source25 is uninstalled. The full93-capability product
remains incomplete; installed human-trusted dev10, private settings/logging scope
and all production Windows settings/project/Git/restore gates stay unchanged.

## Coherent milestone and decision

Before designing actual Git/loader integration, obtain a bounded static inventory
of the two explicitly selected installed Git images through a separately reviewed
READ policy. The original ProgramPins rejects a legitimate Installer mutation
grant at the Program Files ancestor. Its refusal and private-data policy remain
byte-identical. This milestone does not create an execution capability or treat
readable code as authenticated code. No candidate Git process is launched.

Source21's draft descriptor rule and source22's retained metadata lease are useful
foundations, but a returned enum or expired lease must never authorize later IO.
New original `proofs/windows-owned-process/InstalledImageRead.cs` freshly applies
the explicit read-inventory scope and holds its prerequisites throughout the read.
Only the isolated proof build includes this partial; production still compiles
only PrivateStorage.cs. No production IPC operation, configuration or gate changes.

## Boundaries and contract

The known wrapper accepts only codeRoot named Git immediately beneath the exact
fresh SDK ProgramFilesX64 location, and only cmd/git.exe or mingw64/bin/git.exe.
Strict path/overlap/depth checks and the SDK match precede target/anchor IO. No
PATH search, recursion, project executable, environment-derived trust or fallback.
The separate synthetic wrapper names original.exe under an owned Git directory;
its installation-anchor assumption is explicit and its private parent is retained.
It cannot establish the known-folder scope of any real installation.

Private InstalledImageRead composes a fresh CodeAncestorLease with strict original
CodeAccess on EVERY child directory and image. Only the exact installation ancestor
uses the draft descriptor rule, including its Installer grant. This exception
does not propagate to the Git directory, intervening children, executable, private
data or global Trusted predicate. Current-user/SYSTEM/Administrators and privileged
Installer remain outside the hostile-principal claim; no system ACL is repaired.

Project identity pins, no-reparse normalized local NTFS ancestor pins, code-root
directory pins and read-only single-link image handle remain live until completion.
Image must be64 bytes to32MiB. The retained descriptors and identities are freshly
checked before readiness and after the parent's bounded content read. Directory
pins omit delete sharing; image pin omits write/delete sharing. Samples compare
owner/DACL bytes and object identity; image size/write time also rechecked.
Dispose clears descriptor arrays/closes partial handles, is idempotent and refuses
reuse. No handles, descriptors or authority token are returned.

Fixed proof frames have closed phases and one-byte verify/cancel/control input.
The parent waits at most15s, bounds output and awaits child exit before cleanup.
It separately opens only the explicitly selected pinned image, enforces32MiB/
single-link/identity/size/time/EOF bounds, computes SHA256 and parses bounded static
PE imports with the existing original parser. Image buffers are cleared. Content-
derived results are discarded if the final sample changes/refuses/cancels.
Output contains relative fixed target, byte count, digest/import basenames and
closed status only, never image bytes, arbitrary paths/ACL/SID/environment values.

This remains a sampled read-inventory contract. SDK lookup is not an immutable OS
configuration lease; descriptors can change and revert between samples. Handles
do not freeze WRITE_DAC/owner changes or existing writable mappings. No arbitrary-
load/pending-kernel-IO deadline, executable authenticity, package provenance, full
dependency resolution, loader behavior, network confinement or native Codex/Windows11
compatibility follows. Readiness cannot be reused after release or supplied to
OwnedProcess as execution authority. Production gates remain closed.

## Concrete acceptance cases

1. Synthetic Installer grant at ONLY the installation ancestor: new read policy
   permits bounded hash/import sampling while original ProgramPins and original
   private-file reader still refuse. Write/image/code/ancestor rename attempts
   while held refuse; release permits writing. Compare the sampled digest.
2. Installer mutation at code child or image, foreign allow despite deny, or
   foreign mutation at anchor refuses before bytes. No propagation of the exception.
3. Synthetic path cannot supply known SDK scope; overlapping project refuses
   before IO/read. No arbitrary target candidate.
4. Descriptor change during hold refuses final acceptance; construction failure
   releases all partial handles. Fresh rename after exit establishes release.
5. Cancel/EOF/invalid control and owner death release pins; no sample accepted.
6. Actual fixed CI images use fresh SDK scope and the complete read path. A
   refusal is recorded as a refusal, never trusted execution or suppressed. Actual
   results must be read before claiming image inventory obtained.

Existing original ProgramPins, private storage/ACL, code ancestor, job, scratch,
metadata/state, observer and reliability tests remain. No assertion/deadline is
weakened. New Windows tests skip locally; local syntax is not Windows evidence.

Before final acceptance, the original private-reader negative check was tightened:
its1MiB bound is proven sufficient for the compiled fixture, and a positive
original-reader/ProgramPins control precedes the scoped Installer grant. Refusal
therefore cannot pass merely because an undersized read limit was used. The known-
scope negative also supplies a valid fixed-relative Git image name under an owned
non-SDK anchor, separating wrong scope from wrong candidate name. These are test
precondition corrections, not permission or runtime changes.

## Primary evidence retrieved2026-10-24

- [KNOWNFOLDERID](https://learn.microsoft.com/en-us/windows/win32/shell/knownfolderid)
  identifies ProgramFilesX64 and its64-bit process/OS restrictions.
- [CreateFileW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew)
  documents access/sharing and directory/reparse flags. Sharing is not an ACL freeze.
- [GetSecurityInfo](https://learn.microsoft.com/en-us/windows/win32/api/aclapi/nf-aclapi-getsecurityinfo)
  returns a descriptor copy from a handle and explicitly does not handle races.
- Existing [DEV22 review](DEV22-REVIEW.md), [PE parser](../../proofs/windows-owned-process/pe-imports.mjs)
  and their primary references remain separate metadata/static inventory evidence.

## Initial validation and preservation

Local macOS14.6/Node24.22.0/npm11.19.1: new proof suite81Windows-only skips, no
Windows success claim. Full suite189pass/0fail/104Windows-only skips293total.
Actual Windows compilation/CI results remain pending upload.
Validate3mods/replay4fixtures and JS syntax/diff-check passed. Runtime/manifest/
package version25 only; original production storage/authority/state/Git and all
previous proof admission policies remain unchanged. No installation/trust/native
event/UI/model/API run, logging/retention/export/theme/client change or paid call.

All93 requirements remain in scope; native Windows11/WSL and the remaining broader
product acceptance are unverified. Windows11 last unavailable; no repeated ask.
No protected user action/restart or machine rollback needed. Own test artifacts
only after exit; no live lock deletion, cache/trust patch, shared config restore,
system-tool repair, global Installer authority or candidate Git execution.

After actual CI review and safe checkpoint upload/readback, stop for human Sol
Medium for packaging when only routine work remains. Further execution/loader/
private-plan/writer activation stays High. Do not call this the completed product.
