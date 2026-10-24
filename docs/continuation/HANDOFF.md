# Source12 explicit read-set checkpoint — next Sol Medium

2026-10-23. **Full93-capability product incomplete.** Human resumed GPT-6.1 Sol
High frome8557f7. Added/reviewed an original unintegrated explicit synthetic Windows
read-set proof; no production Windows gate or installed snapshot change. Fresh
human reply: Windows11 Codex computer **not available yet; continue proofs**.

## Exact tested source and observed result

Branch codex/astra-groundwork. Source
[e55ed71cd5725127c71b04406b4cf374096a4ef9](https://github.com/HarryBurd33/claude-mods-for-codex/commit/e55ed71cd5725127c71b04406b4cf374096a4ef9),
tree412832a11f34288e039c7084f6ff8913e9a8dd7e.
[CI40048345934](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40048345934)
all7jobs passed. Both actual Windows logs120735108886(Node22)/120735108901(Node24)
read: each20storage+21proof/0fail/0skip. All4POSIX full suites/portableWindows pass.
Windows Server2025 is OS evidence, not native Codex/Windows11/WSL acceptance.
Local npm test170pass/0fail/41Windows-only skips211total; validate3/replay4 pass.

Both mapping diagnostics were **mapping-refused**, not changed-refused. The read
set refused before acceptance with the live writable view; exact cause was not
instrumented. The altered-bytes/restored-mtime branch was NOT observed. Do not claim
native negative byte-mutation detection or8.3-specific coverage from these passes.
Normal capture/reverification, writer/pin/cancel and private-slot composition passed.

Original local69681b4612ada98c7385fe00acef9d9bfe0f944b retained on
codex/dev12-readset-local-checkpoint. Nonforce expected-parent upload/fetch/whole-
tree equality passed. Final following notes-only identity is recorded after actual
remote readback in the reply/latest private handoff; code/test bytes match this CI
source. **Source12 package/public clone/spaced extraction not yet checked.**

## Read first

Read STATUS.md, REQUIREMENTS.md, ARCHITECTURE.md, TEST-LOG.md, DEV12-REVIEW.md,
DEV11-REVIEW.md, PACKAGE-DEV11.md, ../windows-storage.md,
../windows-native-acceptance.md, ../native-acceptance.md,
../../proofs/windows-owned-process/README.md and latest ignored root HANDOFF.md.
Keep machine paths/raw logs/settings/backups/snapshots private. Prior history and
failed candidates remain in Git/TEST-LOG; do not erase the unknown-cause earlier
intermittent storage failure or call it fixed by these new tests.

## Exact code and stable contract

- proofs/windows-owned-process/ProjectReadSet.cs: proof-only partial helper class.
  ProjectReadSetProof(selectedRoot,relativePaths,CancellationToken), Count,
  Verify(), Bytes(index), Dispose(). Single synchronous owner. Entire input set
  validated before IO;1–20forward-slash relative paths/16segments, ordinal
  case-insensitive duplicates refused, original sensitive/directory exclusions.
  Original Pins/Info validate no-reparse local NTFS ancestors/final regular single-
  link files, held without delete sharing. Final files request readonly access and
  share read only; original CodeAccess refuses foreign mutation grants. Ordinary
  foreign read grants are allowed for project data, separate from private storage.
- File metadata bounds256KiB/file/1MiB aggregate before content reads. Keep captured
  bytes in process; Verify rechecks ACL/volume+file ID/times/size/attributes and
  reads through same handle with native pointer/read APIs, avoiding managed cache.
  Bytes returns a clone after verification. Dispose closes only held handles and
  clears own arrays, not returned clones. No memory/secure-erasure guarantee.
-5s operation checks/cancellation cannot interrupt blocked synchronous kernel IO;
  a future outer owned-helper deadline is still needed. No production budget change.
  Constructor failures dispose all acquired handles. Long roots may conservatively
  refuse because Pins validates a bounded unused synthetic leaf; no alias fallback.
- Harness.cs/build.ps1/test/windows-owned-process.test.mjs add8real OS cases to the
  prior13. No real project/Git/credentials/transcripts/network/model calls; fixed
  synthetic fixtures and only count/fixed-status output. Source11 slot composition
  copies one captured synthetic file without changing source/Git sentinel bytes.
- Package/compatibility manifest/server metadata version0.2.0-dev.12. Production
  Windows helper/storage/state/hooks/runtime settings/workspace/restore, default
  config/hooks/UI/skills and previous process/scratch proof code unchanged. Production
  compiles only original PrivateStorage.cs. No new public helper operation or gate.

## Limits and remaining High gates

Positive explicit read set only: no enumeration, ignore engine, negative-lookup
consistency or atomic directory snapshot. New unselected entries may appear. Future
trusted ignore-aware selection must precede it; model/UI paths cannot directly grant
reads. Captured bytes cannot authorize later Git live-path reopens. It does not
defend hostile same-user/admin change-and-restore or prove installed Git/DLL trust.
Actual mapped-byte mutation and8.3/held ACL-metadata changes remain unverified.

Executable/dependency/loader trust, inert named Git scratch/layout/reader sharing,
ignore-aware bounded selection/repository semantics and integration remain High.
Flat source11 slots are not a Git repository,1MiB below existing32MiB index bound.
No whole-project snapshot/custom client/fork/app patch direction selected. Restore
is a separate writer: identity/content conflict, metadata/interruption/concurrency
and ordinary native sandbox permission acceptance. Windows production settings/
project/Git/restore still refuse before IO. Native Windows host unavailable.

## Installation, authority and rollback

Source12 uninstalled. Installed macOS fixture10 remains149immutable reviewed files,
three human-trusted hooks at last read-only inventory, same user-profile marketplace,
settings/data/project/scope/retention/patch/commits/export and private backups.
Actual source10 native focus/render/keyboard-Clear passed after restart; older native
6/4 event/rewrite/hold/sandbox observations stay version-specific. Optional observers
off, no theme/client/model change or extra model run. Current retained metadata
four records/same project revision; not producer-health evidence.

No installation/config/trust/cache changes to roll back in this phase. The proof is
removed with its reviewed checkout; it creates no user data outside disposable OS
tests. Installed10 selective rollback remains supported owned marketplace pointer to
retained immutable dev6 + plugin add, verify125files, human changed-hook review and
restart as required. Never edit cache/trust hashes or restore whole shared config;
settings/data separate, never remove a live lock. Exact paths/backups private.

## Exact next tasks — Medium

1. Anonymous exact public clone/package check for source12. Use prior safe workflow:
   empty separate npm configs/local cache, offline ignore-scripts pack, no dependency
   install. Inspect no links/traversal/special/set-ID/private paths/case collisions/
   root HANDOFF/.local/cache/dependencies/root portable plugin.json. Compare every
   packaged byte against exact public tree; record hash/counts/version/MIT/defaults.
   Extract into spaced path, validate3/replay4/relevant package-scaffolding checks.
   Source11 package result does not certify12. No install/retrust/restart implied.
2. Reconcile docs/current status and all93IDs; preserve conditional mapping outcome
   and each version/CI/host evidence separately. Final docs-only archive readback may
   run once after upload; don't repeat full suite solely for notes. No new UI/native
   event claim or extra model test from this packaging task.
3. Later Windows native kit is prepared; no need repeat the availability question
   until the human reports a change or real inventory is required. Read-only host
   inventory first when available; paths/raw config private, no secret/env dump,
   guessed PATH/project Git, download, sandbox setup, policy override or model prompt.
4. **Stop for human GPT-6.1 Sol High before any further gated security/integration
   implementation**, new ignore/traversal/scratch layout/loader/writer expansion or
   hard security defect. Preserve refusals. Native host absence is not permanent
   impossibility; independent synthetic High work can continue at the next switch.

## Exact next model and complete resume instruction

**GPT-6.1 Sol, Medium** for exact-source package/documentation/read-only acceptance
preparation. High stage's bounded proof/review is complete; unresolved integrations
remain High work and cannot be quietly enabled on Medium. Full product incomplete.

> I switched to GPT-6.1 Sol, Medium. Continue from the verified source12 read-set
> checkpoint on codex/astra-groundwork. Read docs/continuation/{STATUS,REQUIREMENTS,
> ARCHITECTURE,TEST-LOG,HANDOFF}.md, DEV12-REVIEW.md, DEV11-REVIEW.md,
> PACKAGE-DEV11.md, docs/windows-storage.md, docs/windows-native-acceptance.md and
> latest ignored root HANDOFF.md. Verify source12 package/public clone/spaced
> extraction and documentation. Installed human-trusted dev10 and logging scope
> remain unchanged. Both mapping tests refused before acceptance; mutated-byte/
> restored-mtime branch remains unverified. Windows11 host is not available yet.
> No extra model/API run, trust automation, broader logging, optional observers,
> theme/client change or new product direction authorized. Keep all93requirements
> incomplete as applicable. Stop for human Sol High before further gated Windows
> security/integration, then checkpoint/upload/verify before switching.
