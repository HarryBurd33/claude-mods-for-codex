# Synthetic restore failure acceptance complete — return to Sol Medium

2026-10-26, GPT-6.1 Sol High from245c3bd on codex/astra-groundwork. Current human
scope M1-RESTORE-FAILURE-SCOPE.md executed with synthetic fixtures only. Local commit,
tree and verified private checkpoint in ignored root HANDOFF.md and
.local/m1-restore-failure/SYNC.json. No network upload/remote verification permitted.

## Completed and runnable checkpoint

Read M1-RESTORE-FAILURE-RESULT.md, STATUS.md, TEST-LOG.md, REQUIREMENTS.md EX-04,
COMPLETION-PLAN.md/JSON and RESUME-PLAN.md. Baseline restore suite6pass/1Windows skip;
eight new sequential fault/interruption cases8pass. Product runtime unchanged.
Test helper no-IPC diagnostic side effect separately reproduced in owned empty cwd
(exit1) and fixed; focused control1pass afterward. Initial8case matrix predates this
helper entry/diagnostic-only correction. No broader rerun was needed.

Code: test/restore-failure.test.mjs supervises fixed children and independently checks
bytes/identity/plan/index/HEAD/unselected work; test/fixtures/restore-failure-peer.mjs
creates and reviews its own new Git/plan fixtures; restore-fault-io.mjs wraps only the
selected actual FileHandle in that isolated child. No product IO seam or copied
restore algorithm. No runtime contract violation established or fixed.

Zero-progress/write/truncate/sync errors rejected and rolled back expected bytes.
Recovery-write failure rejected with manual-recovery warning and retained partial
bytes. Interruption killed only the owned child after a verified prefix-write barrier;
partial file, original plan/two versions and empty lock retained. No retry/recovery/
lock removal. Direct close observed; all descendants, power loss, physical ENOSPC,
ACL/xattrs, native Codex and Windows remain unverified. No interruption atomicity claim.
Selected metadata assertion covers dev/inode/uid/mode only, not write times/ACL/xattr.

## Preserved boundaries and evidence

Installed31 untouched; dev39 remains disabled/uninstalled. Logging/capture/rules,
parent model/permissions/human trust, Windows/ancestor/launch/routing guards unchanged.
Both old target-read grants consumed, flagsfalse; no reread/repin/baseline adoption.
No native/UI/server/extra-model/network/install/liveconfig/trust action. No version
bump/archive/CI invocation or new OS/client inventory.93IDs/counts unchanged; full
macOS/native/platform delivery remains incomplete.

Private .local/m1-restore-failure contains all receipts/logs/synthetic fixtures; preserve
partial cases and lock. Checkpoint regular-file backups exclude synthetic .git internals
and cannot recreate an empty lock; reports retain checked hashes/lock state. Transfer
whole private evidence root separately if needed. Do not publish private root HANDOFF,
.local or .checkpoint. Unrelated .gitignore addition and shared checkpoint semantic
input/review/generations/heartbeat belong to existing integration; preserve them.
No persistent job/worker/schedule started. Exclusive local lease released at final
handoff. No work continues until the human switches and resumes.

## Exact next task

**GPT-6.1 Sol, Medium** is sufficient for exact artifacts/records and packaging-readiness
verification. Read public result and ignored .local/m1-restore-failure/VERIFY.py,
VERIFY-RESULT.json, HASHES.json, RESULT.json, GUARD-BEFORE.json, GUARD-AFTER.json and
SYNC.json. Verify source hashes/defaults/gates, retained reports and exact committed
changes without rerunning faults or mutating fixtures/locks. Inspect package inclusion
rules only; no version bump/archive generation/CI/network. Do not run the old absent-
file planning verifier or repin old manifests. Stop for High on consequential source/
security defects or drift. No activation/target reads/native/model/install/config/trust.
Then choose the next finite unblocked completion-plan task; existing native and
Windows gates require separate scopes. No repeated verification-only loop.

Resume: “Continue on Sol Medium from the local restore-failure checkpoint. Follow
M1-RESTORE-FAILURE-RESULT.md and HANDOFF.md; verify exact artifacts and packaging
readiness only. Preserve installed31/all guards; keep dev39 disabled. No fault reruns,
target reads, native/extra model runs, network, packaging or live config/trust changes.
Stop for High on consequential changes or unexpected drift.”

Repository: https://github.com/HarryBurd33/claude-mods-for-codex/tree/codex/astra-groundwork
Local-only work; no current GitHub synchronization claim under the network prohibition.
