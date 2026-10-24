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

## Initial strict-reader boundaries and contract

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

## First actual OS result and next refusal boundary

Source7d8c3f532ce324ff7d2554e9b8411b8c77d9cba2,
[CI40120193894](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40120193894):
all seven jobs concluded success. Actual Windows logs120949871587(Node22) and
120949871626(Node24) each25 storage/observer/lock checks plus81 process/security
proofs passed, zero failures/skips. All six new cases ran; synthetic positive
composition worked without changing original policies.

Both real fixed Git candidates instead returned inventory-read-refused|CodeDirectory,
dataRead:false/sampleAccepted:false/executionAuthority:false. No actual image hash,
imports, version or loader result was obtained. The exact child directory and
refusing descriptor predicate were not exposed by that frame. Do not call these
diagnostic attempts successful inventory or relax the child policy to force reads.

The new sample-capture wrapper now optionally emits a CLOSED repeated metadata
observation after a refusal, while the same object handle is still retained.
It reuses the original source19 ProbeAccessDetail, with code-root-relative segment
ordinal and fixed reason enum only. This is a NEW sample, not an atomic trace of
the original policy check and never authority. Readiness remains refused and no
image content is read. No path/ACL/SID/environment value or policy change.
Actual results for the tightened positive controls and explanation remain pending.

## Explicit additional Installer inventory profile

The Node24 explanation on7921619 reported CodeDirectory/segment0 with a repeated
ForeignInstallerGrant sample for both real candidates. Segment0 is the Git code
root. This was a new descriptor observation, not an atomic causal trace. Original
strict code policy correctly keeps refusing that grant; all original strict-reader
and ProgramPins/private-data assertions remain in place.

Reading installed bytes for static inventory has a different purpose from admitting
them for execution. An additional, separately named InstallerInventory profile
therefore applies the reviewed descriptor predicate freshly to EACH validated
installation object, rather than implicitly inheriting an ancestor exception.
Its known wrapper still requires the fresh SDK anchor, immediate Git installation
and exactly the two named images before filesystem IO. The synthetic wrapper is
separate and keeps its owned/private-parent assumption explicit. No general read
broker, config option, executable handle/token or production API is exposed.

The inventory profile accepts mutation grants to the existing trusted principals
plus the exact Installer SID within that fixed read scope. Unknown owners, callback/
object ACEs, null/unbounded descriptors and every other principal's mutation grant
still refuse. Denies never excuse an unknown allow. Each object is checked after
no-reparse/type/path validation; file identity/link/size and retained pre/post
descriptor checks remain. No OS permission is added or repaired. The original
Trusted/Access/CodeAccess/ProgramPins and private-data policies are byte-identical.
This profile CANNOT authorize execution, DLL loading or private data: those gates
remain closed, and authenticity/source/loader provenance remain unverified.

Known/synthetic-installer-read modes use distinct installer-read frames. The old
strict modes keep their original frames and refusal tests. A failure of the new
predicate may expose its closed assessment enum from that sampled descriptor,
without SID/ACL/path values or atomic-snapshot claims. The old strict-policy repeat
classifier cannot explain an Installer-profile decision and is not used for it.

Four additional acceptance cases keep the boundary concrete:

1. Installer grants on owned anchor, code directory AND image: the explicit
   inventory profile samples content while old strict reader, original ProgramPins
   and original private reader still refuse. Renames/writes while held refuse;
   descriptor change after a read discards the hash/import sample. Cancel/EOF/bad
   control/owner death release handles. No original assertion is removed.
2. Installer grant plus unknown allow/deny on child/image still refuses before
   bytes with ForeignMutation. False SDK scope/project overlap also refuses.
3. Hardlinks, junction code directories and an active image writer refuse before
   bytes; restoring the owned fixture permits a fresh read and proves partial
   handles were released.
4. Actual fixed CI images must be read and accepted under this explicit inventory
   profile; this is a mandatory positive check, not accept-either diagnostic success.
   Output is bounded digest/static parser results with executionAuthority:false.

This is an explicit read-policy design, not relaxation of the original execution
or private-data policy to force an execution pass. Production loads no profile.
Actual new profile compilation/OS results are pending; local skipped tests do not
establish Windows behavior. No actual Git process, system mutation or network call.

## Installer-profile actual-image failure — guard preserved

Source8fa1147c2ce760b2158b0e88ae7727d98781b453,
CI40121829428 Node22 job120954870921:25 storage checks passed; process proofs
84pass/1fail/0skip85total. The mandatory real-image positive failed on cmd/git.exe
with installer-read-refused|Image, dataRead:false. It did not reach the second
image. The new synthetic profile/foreign/object checks passed. No image hash,
imports or actual execution authority was obtained. Failed run is preserved.

The object guard is NOT relaxed based on a guessed cause. A new bounded post-
refusal observation queries the retained handle for only opened/query/disk/reparse/
directory/selected-name-match booleans and link count. It does not output paths,
bytes or ACLs, bypass Info, accept the image or claim an atomic original cause.
Actual results must identify the failed boundary before any object-policy decision.

## Final observed boundary and human delivery priority

Tested source [3ce44fc](https://github.com/HarryBurd33/claude-mods-for-codex/commit/3ce44fc76561b11051c610894fa38338bdfafd50),
tree `e4e0dd98d54731bc685489608cdde3c066198b43`,
[CI40122363235](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40122363235):
five jobs passed; both Windows OS jobs failed the mandatory actual-image positive.
Actual decoded logs read: Node22 job120956483161 and Node24 job120956483033 each
25 storage/observer/lock passes, then84 process/security passes/1failure/0skip85total.
All four POSIX logs each189pass/0fail/108Windows-only skips297total; portable job
120956483220 successful conclusion, separate scope.

The cmd/git.exe post-refusal handle observation in BOTH lanes reports opened,
queried, disk and selected-name-match true; reparse/directory false; link count2.
That observed object violates the existing one-link Info contract. It is a NEW
metadata sample, not an atomic trace of the earlier call. No image bytes/hash/
imports were read. The mandatory test stopped before the second real image.
The guard and failing positive assertion remain intact; no link-policy repair,
assertion weakening, old-run retry or execution occurred. The experiment is
**incomplete**, not a Windows inventory or compatibility success.

The original, strict-reader and explicit inventory profiles passed their synthetic
cases; the latter does not establish actual linked-image support. A future
purpose-specific alias design would need separate review and actual alias write/
identity/path/count safety checks while preserving original private/execution
policies. This stage does not implement that design or start another investigation.

The human explicitly selected **finish macOS feature acceptance first, then Windows**
on2026-10-24 after asking for a delivery estimate. Windows remains in scope and
explicitly incomplete. Immediate next work is a capability acceptance audit and
bounded macOS verification plan on Sol Medium. High is required before a
consequential runtime/security change or resumed Windows work. This is a sequencing
decision, not removal of requirements or a claim that the product is finished.

See [delivery plan](DELIVERY-PLAN.md) and the current handoff. The failed actual-
image check must remain visible in any package/CI report. Source25 is uninstalled;
installed dev10/logging scope/human trust/all production gates remain unchanged.
