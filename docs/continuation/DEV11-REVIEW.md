# Source11 private scratch content proof — 2026-10-23

Human resumed GPT-6.1 Sol High from1b11d14. Original MIT code; no independent
model/evaluator or subagent. Source11 is not installed. Installed human-trusted
source10, existing data selection/logging and all production Windows gates remain.

## Question and chosen contract

Can a helper own bounded private temporary bytes without needing a recursive
path-based cleaner after a crash? The proof tests deletion attached to the exact
created file handles. It deliberately does not turn a leftover-directory scanner
into an authority to read/delete arbitrary entries.

`PrivateStorage.ScratchContentProof(parent)` in
proofs/windows-owned-process/ScratchContent.cs reuses the original helper's private
creation descriptor, path/volume/ACL checks and pinned random empty ScratchProof
root. Add(byte[]) accepts no filename and adopts no file. Up to16 flat slots,
256KiB per file and1MiB total; zero-length slots still count. Limits are checked
before creation. CREATE_NEW, protected current-user/SYSTEM/Administrators descriptor
and FILE_FLAG_DELETE_ON_CLOSE are one CreateFile operation, before private bytes.
The returned noninherited handle is verified, written/flushed, reverified and kept.
Failure closes only that created handle; an existing slot refuses without adoption.

Retained handles have read/write/DELETE access, share read/delete and exclude new
writers. Compatible read handles must share read/write/delete; normal reader
sharing is not assumed compatible. The independent fixed synthetic reader reuses
same-handle private ACL/path/size checks. No read path is exposed in production.
Dispose closes only owned handles, then tries existing empty-only root removal.
Unexpected entries/junctions or still-open readers can leave a private root; no
recursion, enumeration-based deletion, ACL repair, adoption or stale-lock removal.

This is single-owner synchronous proof code, not a concurrent reusable service.
All content is synthetic. Real project/index/ref copying and Git use remain absent.
An outer owned-process deadline would still be needed around blocking local IO;
no new production deadline or helper operation is introduced here.

## Owner death and reader lifetime

DELETE_ON_CLOSE is requested at creation, avoiding a create-then-arm content gap.
If the owner dies, OS handle closure disposes its files after the last compatible
reader closes. The flag does not make live reader handles disappear. A separate
composite proof uses the existing creation-time job list and a real descendant
holding a file handle: external owner death kills that job, then content deletion
is observed. A successful root exit is tested separately with a lingering reader.
Root deletion may happen before asynchronous reader death; retaining an empty
private root is accepted and reported, never interpreted as recursive cleanup.

This provides no secure-erasure, hostile same-user/admin isolation, persistence,
recovery/adoption, arbitrary child network sandbox or Git/DLL trust claim. Backups,
filesystem/disk caches, kernel/admin access are outside this deletion claim.
Readers not governed by the owned job can delay deletion; future integration must
bound/contain readers and observe cleanup failure. No production retry/deletion
rule is silently broadened to cover such readers.

## Meaningful acceptance

Real Windows tests, not Windows-looking paths on POSIX:

- Independent compatible process verifies exact synthetic bytes and protected ACL;
  a new writer refuses, subsequent read still matches; normal disposal removes root.
- Null/oversized/count/aggregate/post-dispose inputs refuse. Existing slot bytes
  stay unchanged. Unexpected junction and its external synthetic target stay intact,
  while the owned content is removed and nonempty-root removal refuses.
- External owner death removes file bytes from the namespace; only empty protected
  root remains, with no automatic recovery scan.
- Real descendant reader exists before external owner death; owned root/reader
  processes die and content disappears. Successful root exit also kills its reader.

Source11 local POSIX checks skip all13 Windows proof cases. Windows CI results and
exact source/run identity must be recorded in TEST-LOG after actual observation;
no native Codex/Windows11 compatibility follows from those OS results.

## Remaining High gates

No production integration until executable/parent/dependency trust and loader
behavior, trusted cwd/env/config/helper/network suppression, selected project
no-follow traversal and consistent read semantics are reviewed. This proof accepts
in-memory bytes; it establishes no source authenticity/freshness or Git-compatible
file naming/layout. Whole-project copying is not selected or authorized by it.
A future bounded read set must refuse linked/special/sensitive/ignored paths and
check identity/content changes, rather than snapshot an arbitrary repository.

Restore is a different writer with its own conflict/identity/metadata/interruption/
sandbox acceptance. Windows runtime settings/workspace/restore still refuse before
IO. Native Windows11 client/OS/Git/DLL inventory is available later, not performed.

## Primary sources actually retrieved2026-10-23

- [CreateFileW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew):
  CREATE_NEW, descriptor and delete-on-close/sharing flags.
- [SetFileInformationByHandle](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-setfileinformationbyhandle):
  delete disposition needs DELETE access. Reviewed but not used; creation-time flag
  avoids an additional arming step.
- [FILE_DISPOSITION_INFO](https://learn.microsoft.com/en-us/windows/win32/api/winbase/ns-winbase-file_disposition_info):
  disposition does not override FILE_FLAG_DELETE_ON_CLOSE.
- [Closing/deleting files](https://learn.microsoft.com/en-us/windows/win32/fileio/closing-and-deleting-files):
  OS closes handles on termination; deletion waits for remaining handles.

These establish intended API semantics, not measured compatibility. Original NTFS
ACL/path/volume and job lifetime sources remain in the source9 proof README.
