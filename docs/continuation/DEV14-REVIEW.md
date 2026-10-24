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
regressed on both Node22/24 Windows lanes. Local macOS skips are not OS passes.
Observed results are recorded below and in TEST-LOG; no native-host claim follows.

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

## Observed result and completed High review

Source [c369f49](https://github.com/HarryBurd33/claude-mods-for-codex/commit/c369f49f335c57ed0e5840088795145a0ea5717b),
[CI40059849695](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40059849695):
all 7 jobs passed. Actual Windows Node22/24 logs read: 20 storage + 35 proof tests
per lane, 0 failures and 0 skips. Seven new metadata-capture cases passed, including
full32MiB index/1MiB exclude direct composition. Both prior mapping diagnostics
still mapping-refused; altered-byte/mtime branch unverified. Windows Server2025 OS
evidence is separate from native Windows11 Codex/Git acceptance.

Source treeb34f9ce1286b64ad0f859d82df7820e502b1dc8a. Local npm test170pass/0fail/
55Windows-only skips225total; validate3mods/replay4fixtures; diff-check clean.
Windows jobs120770786180(Node24)/120770786310(Node22), both decoded logs read.
Original equivalent local1b73fa3 retained on codex/dev14-capture-local-checkpoint;
nonforce expected-parent upload/fetch/full-tree equality verified.

High review covered whole-input validation, every handle/buffer failure path,
partial source capture release, retained positive-file identity/sharing, full-size
same-helper transfer, pre/post cancellation, source handle release on owner death
and inherited exact-owned scratch cleanup. No new lifetime/source isolation claim
for hostile same-user/admin or previously accepted writable mappings. The32MiB
fixture contains synthetic bytes, not a valid parsed Git index. Production gates
remain before IO; only package/manifest/server version metadata14 changed there.

Fresh read-only installed inventory3enabled/human-trusted hooks/0errors/0model turns.
Initial shell-sandbox inventory exited before initialize and could not send process-
group cleanup; identical bounded inventory under approved local execution succeeded.
No system tool repair or trust write. Activity4/same selected scope/revision, health
unknown; installed10 byte-equal149files and private settings hash unchanged.

Next immediate work is routine exact-source public-clone/package/spaced-path
verification: human-controlled GPT-6.1 Sol Medium. Return to High before another
Windows security/integration/gate/writer change; full93product remains incomplete.
