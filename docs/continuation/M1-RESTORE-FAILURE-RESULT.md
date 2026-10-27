# POSIX restore fault/interruption acceptance — eight cases passed

2026-10-26, GPT-6.1 Sol High, starting245c3bd on codex/astra-groundwork. Human authorized
M1-RESTORE-FAILURE-SCOPE.md using synthetic fixtures only. **No runtime fix required or
made.** New regression tests/helpers are unversioned additions after source39; the exact
dev39 archive and installed31 do not contain them and remain unchanged/disabled.

## Code and actual mechanism

- test/restore-failure.test.mjs: eight sequential independent synthetic cases; fixed
  child supervisor, phase/correlation bounds, independent parent file/plan/metadata
  checks, retained case evidence and no continuation after an unknown/failed case.
- test/fixtures/restore-failure-peer.mjs: accepts only a case enum; exclusively creates
  its own new project/private plan under a fresh owned cwd. Uses fixed local Git to
  make two commits, reviews the exact plan ID, then calls the real restore export.
- test/fixtures/restore-fault-io.mjs: test-only selected-handle operation wrappers in
  that isolated child. Real open/plan/Git/identity checks remain active. Updates the
  child builtin open binding, wraps only the exact selected O_RDWR handle after its
  identity check and restores binding afterward. Every other handle is unchanged.
  No product seam/flag/env selector, copied algorithm or caller-supplied runtime IO.

The live product modules/exports/CLI/guards were not altered. Each case observed
selectedHandles=1 and the required operation/fault counters, proving the actual module
used the instrumented handle. Missing instrumentation could not pass as a fault test.
No-argument helper discovery has no fixture action; Windows tests skip before fixture
creation. These are source facts, not new Windows or every-runtime observations.

## Observed matrix

| Case | Outcome and independently checked file state |
| --- | --- |
| Control | Success; exact from-content; one write/truncate/sync |
| Short writes | Success;15actual bounded partial writes, exact target content/length |
| Zero progress | Rejected; one zero-progress fault, one rollback write attempt; exact expected to-content restored |
| Partial then EIO | Actual8byte prefix then injected write error; rejected, rollback restored exact expected bytes/length |
| Truncate ENOSPC | First target truncate failed; rejected, rollback restored exact expected bytes/length;2truncate calls |
| Sync EIO | First target sync failed; rejected, rollback restored exact expected bytes/length;2sync calls |
| Rollback write failure | Partial target write plus target EIO and recovery ENOSPC; manual-recovery rejection, no false success/original-restored claim; mixed selected bytes retained |
| Fixed child interruption | Child confirmed actual prefix-write barrier; parent terminated that owned child, observed close and independently confirmed partial bytes; empty cooperative lock retained |

All cases kept plan bytes/ID and its two versions, unselected tracked/untracked
sentinels, index, HEAD/branch ref and checked selected dev/inode/mode/owner. The report
label selectedMetadataUnchanged means those explicit asserted fields only: write
mtime/ctime, extended ACLs and xattrs were not checked. Selected content intentionally
remains partial in the rollback-failure and process-death cases; do not call them
no-mutation successes. No automatic retry/recovery/lock removal followed either case.

Direct-child close was observed. Reports explicitly keep allDescendantsVerified=false;
no process-tree/remote cancellation or hostile same-user boundary is claimed. The
interruption assertion accepts observed SIGTERM/SIGKILL termination; its exact signal
was not included in the retained per-case summary. No PID/group fallback was used.

## Commands and results actually observed

Existing baseline, before test implementation:

```sh
node --test test/restore.test.mjs
```

7cases:6pass,0fail,1Windows-only skip; about2.98seconds. New suite:

```sh
node --test test/restore-failure.test.mjs
```

8cases:8pass,0fail,0skip; about2.91seconds. No product violation was reproduced, so
no src/restore.mjs correction, repeated restore-fault matrix, broad regression,
package or CI rerun was justified. Existing baseline refusals were not weakened. The combined14
passes/1skip across two suites are separate scenario evidence, not native coverage.

Review then found a test-helper guard defect: a direct no-IPC invocation rejected its
cwd but could write a diagnostic there. A new control assertion reproduced exit1 in
an owned empty synthetic root. The helper entry now requires IPC, and its error
handler writes only after validating an owned base. Focused command:

```sh
node --test --test-name-pattern "POSIX restore control:" test/restore-failure.test.mjs
```

Before helper correction:1failed test/exit1 in0.114seconds. After:1passed test/exit0
in0.491seconds, checking empty/silent no-IPC behavior plus normal IPC control restore.
This Node run reports only the selected test (no other seven tests/skips). Full8case
results above precede this helper entry/diagnostic-only correction; fault wrappers
and product algorithm unchanged. No outside synthetic cwd was affected. This is a
test harness defect and correction, not a product-runtime defect or native proof.

Current POSIX Node process was used; native Codex/OS/Node identity was not freshly
inventoried. No other platform/Node-version compatibility claim. Node22/24 CI and
native Windows acceptance are not established by this local run.

## Bounds, privacy and retained evidence

Cases run one at a time. Only fixed Node/local Git processes, shell=false, scrubbed
environments, no user/global Git configuration/credentials/templates/hooks/remote fetch.
Source workspace scratch stayed under the private selected test scratch root. Child
work20seconds/parent case25seconds, fixture Git5seconds; phase/stdout/stderr <=64KiB
per case. All observed case outputs were far below bounds; initial baseline/matrix logs4,970bytes; focused guard logs are separate.
These are supervision limits, not hard guarantees against OS/kernel suspension.

Fixture files/plans contain only synthetic text. Plans are private0700parent/0600
one-link files outside each selected synthetic project. Selected mode0640 deliberately
tests preservation; Git objects retain their own normal modes inside private roots.
No real workspace/installed file was a restore target; no disk filling, hardware
fault, mount/ACL/system permission or trust manipulation. No native/UI/server/extra
model/network/API run, logging expansion, prompt/model rewrite, installation or live
configuration/trust change. Ordinary current-chat model usage still applies.

Private .local/m1-restore-failure retains baseline/new suite logs, eight case states/
reports/plans and mutated files, including the interrupted lock, plus both guard
regression attempts and the extra passing control fixture. At the first final
inventory172regular files/38,238bytes were present, below1024files/16MiB. Final receipts
record later evidence files. Do not automatically delete or recover them. No source
managed scratch change, lock stealing, post-leader group signal or unknown-path cleanup.

Checkpoint backups include regular non-Git case evidence/source hashes/results.
Synthetic .git internals and the empty interrupted lock remain on disk rather than
being copied into checkpoint file backups. Case reports retain their checked hashes/
lock state; a checkpoint is not an instruction to restore those repositories/locks.
Preserve the whole private test root separately for a device transfer if it is needed.

## Acceptance effect and remaining work

Adds narrow controlled error/interruption evidence to EX-04 and W5 security contracts.
No93-ID disposition/count change or full-product completion. Injected EIO/ENOSPC is
not real disk exhaustion; a killed fixed process is not power-loss atomicity. Runtime
still writes in place to preserve inode/mode/owner/metadata contract; no atomic rename
redesign or API/permission/type expansion. docs/replay.md now distinguishes existing
in-call rollback from absent automatic post-crash recovery.

Native host restore, extended ACL/xattr, physical storage durability, hostile same-user
races, native Windows and other platforms remain unverified. Installed31 untouched;
dev39 disabled/uninstalled, native launch/profile/ancestor/routing/Windows gates unchanged.
Both old read grants stay consumed. Old candidate/source evidence is preserved, not
repinned or adopted as a native baseline. No network upload/remote/CI observation.

High implementation/review work is complete. **Next GPT-6.1 Sol Medium** can verify the
exact test/evidence/documentation change and packaging readiness without rerunning
faults or touching retained partial files/locks. No version bump/package/native action
is authorized by this result. Human model switch only; no background continuation.
