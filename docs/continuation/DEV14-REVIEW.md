# Source14 review — same-helper fixed metadata capture

2026-10-23, GPT-6.1 Sol High, resumed verified5016e11. Full product incomplete.
Source14 uninstalled; installed human-trusted10 and logging scope unchanged.
No production Windows gate, operation or helper build is changed. Native Windows11
host remains unavailable per latest human reply; no repeated availability question.

## Contract and boundary

Original MIT proof-only GitMetadataCapture.cs composes source12 retained source
handles with source13 private named scratch in the same compiled helper. Build.ps1
includes it only in the isolated proof executable. Production PowerShell still
compiles only PrivateStorage.cs. No new settings profile or dashboard grant is
implemented: the existing before-IO Windows settings refusal remains intact.

GitMetadataCaptureProof(selectedMetadata, privateParent, headCommit, index, exclude,
CancellationToken), Path/Verify/Dispose. Explicit strict local NTFS source root and
private scratch parent must not overlap. Whole fixed input syntax/HEAD is validated
before IO. Two booleans select exactly index and/or info/exclude. Selected missing
file refuses; an omitted source makes no absence claim and is not probed. HEAD is
inert caller-selected null/full lowercase40hex data, not a discovered repository ref.
No arbitrary filename, discovery, enumeration, ignore engine or config/ref loading.

Sources use original no-reparse ancestor pins and same-handle regular single-link
identity/ACL checks. No source write/delete sharing; foreign mutation grants refuse
including deny+allow. Other ordinary read handles are permitted. Limits32MiB index
and1MiB exclude, maximum33MiB captured data, independent of the old256KiB/file/1MiB
project read-set limits. Captured bytes are read directly with native ReadFile and
metadata plus bytes reverified before and after scratch construction. Source pins
remain owned until disposal. Verification repeats against held source handles.
No byte-return/export API: Path points only to newly created private scratch.

The original source13 constructor receives these arrays directly in the same helper;
the32KiB request/3MiB response bridge is unchanged. No content in argv, environment
or diagnostics. Read/verification temporary buffers and retained captures are cleared
on managed disposal/failure; this is not secure erasure or guaranteed crash-memory
zeroization. Disposal always releases sources even if scratch empty-only cleanup
refuses. Scratch keeps private create-new/delete-on-close exact owned handles;
unknown entries are preserved. Owner death can leave private empty hierarchy.

One5s cooperative constructor budget spans capture/verify/scratch/verify checks;
public Verify has its own5s cooperative budget. Synchronous kernel IO cannot be
interrupted by these checks; future production use needs an outer owned-helper
deadline. No threads, child launch, helper IPC extension or model/network call added.

## Acceptance and limitations

Seven new real Windows tests target exact-byte small composition/source read and
write/rename exclusion, full32MiB+1MiB transfer and oversize refusal, required versus
omitted sources/partial failure release, overlap/alias/UNC/hardlink/junction refusal,
foreign write ACLs/existing writer, pre/post capture cancellation and external owner
death/source release. All fixtures synthetic private NTFS roots. No real Git index
parser, actual project, credentials or session. Existing28proof and20storage cases
must regress on both Node22/24 Windows lanes. Local macOS skips are not OS passes.
Observed commands/results and CI identity belong in TEST-LOG; this initial record
makes no Windows pass claim before logs are read.

This proves positive selected file object capture only, not a coherent repository:
no HEAD/ref provenance, worktree/commondir/split/sparse index format, config objects,
ignore selection, atomic multi-file snapshot or Git parser trust. The original
writable-mapping tests remain separate; their previous outcome was mapping-refused,
not a witnessed altered-byte/restored-mtime negative branch. No8.3-specific witness.
Same-user hostile mappings/admin races are outside the established guarantee.
Actual Git readers/writers/temp/locks and unknown child-created content ownership,
executable/dependency/loader trust, native sandbox permissions, production integration
and the separate restore writer remain gated. Do not load source14 into Codex or
relax production gates on the strength of a synthetic CI test.

## Review and rollback

Reviewed failure ownership: paths/HEAD before IO; every opened source handle enters
the owned list before validation; partial read buffers clear on failure; captures
enter the list before reading; constructor failure disposes scratch then sources;
finally releases source handles/buffers even when scratch cleanup fails. Verify
never returns raw bytes and refuses disposed/cancelled state. No recursive cleanup,
ACL repair, stale-root adoption, trust mutation or private logging expansion.

No machine config/install change requires rollback. Remove the checkout to remove
proof code. Existing installed10 rollback instructions remain separate in the local
handoff; never edit installed cache, trust hashes or shared configuration wholesale.

Primary Windows API/ACL/sharing evidence remains the retrieved Microsoft references
in proofs/windows-owned-process/README.md and DEV12/DEV13-REVIEW. This milestone
composes existing primitives; no released Codex/Windows support inference is added.
