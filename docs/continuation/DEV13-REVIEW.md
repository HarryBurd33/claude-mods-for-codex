# Source13 fixed Git metadata scratch proof — 2026-10-23

Human resumed GPT-6.1 Sol High fromd7d3b84. Source13 is uninstalled; installed
human-trusted10/logging scope and production Windows gates remain unchanged.
Windows11 host is still unavailable per latest human reply; do not ask again here.
Original MIT code; no subagent, extra model/API evaluation or real project read.

## Concrete uncertainty

Source11 flat numeric slots are not the directory-shaped inert Git metadata layout
used by workspace.mjs. This proof establishes protected named-file lifecycle and
reader-sharing behavior for that shape without selecting or executing installed Git.
A fixed synthetic reader is not proof that a released Git build can open the files.

## Contract and code

GitMetadataScratch.cs is a proof-only partial helper extension, compiled only by
the isolated fixed-source build. GitMetadataScratchProof(parent,headCommit,index,
exclude,CancellationToken), Path, Dispose(). All supplied paths are the one explicit
already-private parent. No arbitrary config/directory/ref/file names or adoption.

Before filesystem IO, head is null (fixed unborn refs/heads/mods-inspection) or
exactly40lowercase hex characters; trailing newline/ref syntax refused. Optional
index bytes bounded32MiB, exclude bytes1MiB, matching existing workspace.mjs metadata
limits. This deliberately does not expand source11 flat slots (256KiB/file/1MiB
aggregate) or source12 read sets (256KiB/file/1MiB aggregate). The larger typed proof
can hold at most33MiB plus fixed short config/HEAD; it cannot yet capture a real
32MiB index from the smaller read-set component.

Use original ScratchProof protected random root, create only objects/refs/info
with explicit private descriptors and verified pinned handles. Generate fixed
inert core config (format0/bare=false/filemode=false) and detached/unborn HEAD;
optionally write index and info/exclude. A factored proof-only CreateScratchFileProof
reuses source11 exact creation semantics: protected current-user/SYSTEM/Admin DACL,
CREATE_NEW + DELETE_ON_CLOSE before bytes, noninherited read/write/DELETE owner
handle, share read/delete, verify/write/flush/reverify and retain handle. No existing
file adoption. Both callers retain handles safely if list ownership transfer fails.
Production compiles only PrivateStorage.cs, not this helper or the new class.

5s constructor budget/cooperative cancellation checked between operations; cannot
interrupt a blocked synchronous write/flush. Future integration still needs an
outer owned-helper process deadline. Disposal releases file handles, directory
pins, then only successfully created/verified known directories with empty-only
Directory.Delete(false), then original empty-only root disposal. No enumeration,
recursion, stale-root adoption, permission repair or unexpected-entry deletion.
Path removal after pin release assumes no hostile same-user/admin namespace race,
as in source11; it is not atomic handle-based directory deletion.

## Crash and reader limits

DELETE_ON_CLOSE ties file deletion to exact created objects. Compatible readers
must share read/write/delete because the retained owner has write/DELETE access.
Incompatible sharing refuses. Real Git compatibility remains unverified. File
names may stay pending while a reader is live; an unowned reader can keep bytes
accessible through its handle. Empty-only root disposal reports refusal rather
than killing an unrelated process or claiming complete deletion. Closing that
reader allows content deletion, but no automatic root retry/recovery is performed.

External owner death closes files and its creation-time kill-on-close job; ordinary
owned descendant readers are killed, then content disappears. Empty private
objects/refs/info hierarchy can remain; no retained content or recursive recovery
claim. Cancellation through the existing OwnedProcess runner is tested separately.
No secure erasure, arbitrary service/broker containment or hostile same-user/admin
isolation. Actual object-store/index freshness, valid Git index parsing, repo format,
ignore semantics, executable/dependency/loader trust and native Codex remain gated.

## Seven added real-Windows acceptance cases

- Exact fixed layout, protected directories, detached/unborn optional-file variants,
  independent compatible owned reader, incompatible reader/new writer refusal,
  live directory pinning and normal empty-only cleanup.
- Invalid HEAD/oversized input/pre-cancellation refuse without residue; accepted
 32MiB index/1MiB exclude boundary; no unbounded directory/content selection.
- Unexpected known-directory file and unexpected junction/target are preserved;
  owned metadata removed, nonempty root reported as retained.
- Owner death removes owned files and leaves protected empty known hierarchy.
- Owner death with actual ordinary descendant index reader: both processes die,
  owned contents removed, empty hierarchy remains.
- Owned-reader cancellation composes with cleanup; asynchronous reader exit may
  leave an empty root rather than causing recursive retries.
- A live unowned compatible reader retains its handle/bytes and causes retained-root
  reporting; after that reader closes, owned files disappear without root adoption.

Actual source/CI results belong in TEST-LOG after observation. Local macOS skips
are not passes. The prior21proof cases also regress the shared creation refactor.

## Primary sources actually retrieved2026-10-23

- [CreateFileW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew):
  creation/private descriptor, sharing and delete-on-close rules.
- [RemoveDirectoryW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-removedirectoryw):
  empty-only deletion and directory/junction lifetime; no recursive cleanup used.
- [Git repository layout](https://git-scm.com/docs/gitrepository-layout): conventional
  HEAD/config/index/objects/refs/info names. A documented shape does not establish
  that this incomplete synthetic repository is accepted by installed Git.

No loader-policy mutation, binary download, PATH Git execution, .git/config copy,
user/global config/credential/session read, model routing or trust automation.
Next integration must prove actual compatible trusted Git and ignore-aware bounded
selection before enabling production paths. Restore is a separate writer gate.

The current production bridge has32KiB requests/3MiB responses; this in-memory
32MiB proof does not expand that IPC contract. Future metadata capture/child-reader
composition must stay inside a reviewed helper or use separately bounded framing;
never put private index/exclude bytes in process arguments, environment or logs.
This stage's process arguments contain only selected synthetic fixture locations.
