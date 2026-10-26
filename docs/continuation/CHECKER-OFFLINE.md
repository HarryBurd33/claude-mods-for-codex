# Private preflight checker adapted and offline-tested

2026-10-26, GPT-6.1 Sol High, startingd3c4682. Human authorized checker adaptation/
synthetic tests only. **No selected target content/metadata read, native client,
inference, network, setup, configuration/trust write or baseline adoption.**
Installed31 and every product/runtime/Windows guard remain unchanged.

## What changed

Separate private .local/preflight-checker contains checker.py, run_once.py and
test_checker.py. Old read-once.py, its consumed B grant/observation, original source
snapshot, frozen scope and unused new preflight grant remain untouched. This is
task-specific preflight tooling, not a new plugin/runtime/client or source39 release.

The reader reuses descriptor-relative no-follow traversal and before/after identity
checks, with explicit binary/config/Node roles. CLI/config compare with saved B hashes;
Node is an observation only, never an accepted baseline. Configuration retains only
the earlier fixed type/enablement/trust-count classifications. No command bodies,
environment, credentials or private sessions are inspected/discovered.

It checks39explicit source paths, the8MiB aggregate cap and future-root absence.
It rejects linked/special/unsafe/oversized/changed files and parents; no path
substitution, directory scanning, link resolution, repair or retry. Parent ownership
must be root/current user; writable ancestors are refused except root-owned sticky
temporary directories. Private files must be current-user-owned with no group/other
access; binaries root/current-user-owned and not group/other-writable. This can reject
a common symlinked Node installation: refusal is the required result, not a reason
to loosen access. No such native path has been inspected during this stage.

One shared20second main-thread POSIX timer covers control verification, all reads,
absence check and result persistence. Existing timers are refused rather than
displaced. SIGALRM/clock checks are not an OS kill guarantee for uninterruptible
kernel IO; no child processes or remote work are started. This is macOS/POSIX private
tooling, with no Windows compatibility claim.

## Closed entry and one-use evidence

Default entry refuses without reading controls or targets. The reviewed entry
requires an exact review hash plus a separate OPERATOR-REVIEW.json allowing target
reads. That file is **false now**. BINDING.json pins the frozen scope, original
unused grant, expected observations and manifest; RUN-REVIEW.json pins binding,
source and offline test results. Hashes identify bytes, not human trust or permission.

Before any target read, an exclusive private ATTEMPT.json reservation must succeed.
Existing/partial reservation is never removed, recovered or retried. A mid-reservation
interrupt reports uncertainty explicitly. Results use a separate exclusive
OBSERVATION.json; no overwrite of older evidence. Cancellation/deadline may leave
only a marker/partial record, which requires review; no retry is inferred. Result
writing shares the original timer, not an extra grace period.

The unused read grant still covers exactly its prior scope. Current High instruction
prohibits applying it. Medium must verify these artifacts and current authority
before any future operator action. Do not turn a saved grant/review hash into an
automatic run. Native startup/inference/network/setup/config/trust/baseline gates stay
closed even if a later preflight succeeds.

## Offline evidence

Ran: python3 -B .local/preflight-checker/test_checker.py
Final43tests,0failures,0errors,0.472seconds on this macOS Python environment.
Only synthetic ordinary/secret-marker/binary/source files were read by the checker;
all per-test fixture directories removed.

Coverage: successful three-role read and39source/absence result; privacy and raw
buffer clearing; leaf/ancestor/source symlinks; hardlinks/FIFO/directory; unsafe file/
parent modes; per-file/cumulative limits; CLI/config/source drift and early stop;
malformed config/types; traversal/count contracts; replacement races; actual timer
interruption and existing-timer preservation; exclusive attempt/result preservation;
closed/tampered entry; complete synthetic entry; no retry; cancellation, deadline,
partial reservation and partial-progress reporting.

Earlier31/37case passes were extended for complete-entry/deadline and partial
reservation coverage; final43case result is authoritative. No product suite, native
hook, CI/package or live preflight result is newly claimed. Old source38 evidence and
all93requirements/nativeWindows/Image/bounds gaps remain separate and incomplete.

## Medium verification and publication

Next **GPT-6.1 Sol Medium**: run the new records-only VERIFY.py, inspect exact source/
test/control pins and default-closed gate, confirm no real ATTEMPT/OBSERVATION exists.
Do not run old note-pinning verifiers against edited current Markdown. The new
checker verifier checks historical records at their commits and current notes apart.

Human no-network restriction includes GitHub upload/verification this stage. A local
commit and private checkpoint will be made; publication remains explicitly pending.
Do not describe it as uploaded. Medium should preserve that restriction unless human
authorizes repository publication. No background continuation or automatic worker.
