# Source38 — reproduced offline deadline and descendant leads

2026-10-26, GPT-6.1 Sol High, resumed0fcc04e under explicit fixed-Node investigation/
correction scope. **No Codex invocation, inference, install/config/trust change,
native-input refresh or gate opening.** Installed31 and all host guards remain.
Source0.2.0-dev.38 is uninstalled; full93/native routing/Windows acceptance incomplete.

## Reproduction before correction

Added fixed scenarios/diagnostic group observation and an isolated Node regression
probe, without the subsequent clock/result corrections. Six tests ran: **1pass5fail**.

| Boundary | Observed pre-correction result | Required result |
| --- | --- | --- |
| Legacy readiness late reply while interval callbacks are delayed |5request write attempts; only initialize was inside the deadline |1attempt; no further request after deadline |
| Legacy readiness serialization stalls past its fixed deadline |2request attempts |1attempt |
| Inspection serialization stalls past its fixed deadline |2request attempts |1attempt |
| Readiness direct child closes while silent descendant remains |observation-complete with group present at the cleanup snapshot |review-required; direct reap is not group absence |
| Inspection same silent-descendant case |observation-complete with group present |review-required |

The timing probe delays its **own isolated process's** interval or JSON serialization
using fixed durations/enums. It uses real monotonic time and fixed Node peers; no
arbitrary caller clock/executor or installed application patch. This deterministic
scheduler/serialization harness is not a reproduced native Codex failure. Existing
actual blocked-parent test remains separate. Reported request count is write attempts,
not evidence of tool execution, billing or successful remote delivery.

The silent leaf uses ignored standard streams, cannot detach/change groups and
self-exits after a fixed1sec. The peer unrefs it and closes before that leaf. A separate
fixture teardown waits up to2sec for its old group's absence using signal0 only, before
the test asserts/returns. Both pre-fix failures observed fixture-group absence after
self-exit; no immortal fixture was abandoned or stale PID killed to demonstrate it.

## Minimal responsible corrections

- **proofs/readiness-driver.mjs** samples monotonic deadlines before packet acceptance,
  before each outgoing item and again after serialization, immediately before counting/
  attempting a write. Interval polling remains a backstop. It also samples at final
  reporting. A taken local queue is explicitly stopped; clearing the machine queue
  alone would not remove those local items.
- **proofs/inspection-driver.mjs** retains packet sampling and adds the same per-item/
  post-serialization checks. Request/byte counters advance only for attempted writes
  after the checks. Typed server denials are permitted only within deadline and
  cancellation bounds; this never becomes approval or a successful tool response.
- **proofs/process-group-observation.mjs** provides only scoped signal0 observation of
  a known spawned group. ESRCH maps to absent-at-probe; presence maps to present-or-reused;
  permission/other errors are unavailable. PID0/1, negative, noninteger and out-of-range
  identities are refused. Windows returns not-observed-on-platform before any syscall.
- Both drivers retain **processReaped** as direct-child close only, add fixed group/
  fixture status labels and **allDescendantsVerified=false**. POSIX presence or unknown
  absence becomes review-required with descendants-unresolved. No raw PID/path is in
  reports. The pre-teardown observation is not rewritten when fixture teardown later
  succeeds; a fixture's self-exit does not retroactively prove the main cleanup path.
- Real TERM/KILL group signals stop once the leader exits or closes. The sole explicit
  post-exit exception is the reviewed fixed pipe-holding leaf scenario, whose source
  cannot detach/change group; existing bounded group cleanup tests cover it. No native
  or arbitrary descendant receives this exception. Unknown/reused group IDs are never
  adopted or signalled for termination after leader exit. Signal0 is not termination.
- **proofs/readiness-leaf.mjs** gains only the bounded silent mode; existing pipe-holding
  term-ignore mode remains. Both peers/scenario enums add fixed cases; new
  **proofs/reliability-probe.mjs** is a fixed isolated test runner, not a plugin tool.
  **test/reliability.test.mjs** has6cases; Windows skips5POSIX process cases.
  Common machine adds only the fixed descendants-unresolved reason, no permission rule.

Scope limits are deliberate. An absent-at-probe group is a snapshot, not proof that
no child escaped into a different group, that PID reuse cannot occur, or that remote
work was cancelled. An unavailable probe is not absence. Kernel stalls/suspension can
exceed JavaScript timing bounds. Generic cross-platform descendant containment would
need a separately reviewed supported OS supervisor; no such capability was invented.
Neither new inspection native transport nor live routing is implemented/enabled here.

## Primary evidence

Retrieved2026-10-26:
[Node24 process.kill](https://nodejs.org/docs/latest-v24.x/api/process.html#processkillpid-signal)
explains signal0 existence checks and Windows group limitations. The retrieved page
was24.22.1 documentation; local tests used the installed Node runtime, not a Node upgrade.
[Linux man-pages6.19 kill(2)](https://man7.org/linux/man-pages/man2/kill.2.html) documents
negative group IDs, no-signal checks, ESRCH/permission and zombie caveats.
[Apple's archived kill(2)](https://developer.apple.com/library/archive/documentation/System/Conceptual/ManPages_iPhoneOS/man2/kill.2.html)
is a historical BSD reference, not fresh proof for every macOS release. Both attempted
Open Group POSIX kill page versions returned403 and supplied no evidence. No unrelated
research, host process enumeration, credential/environment scan or native client query.

## Verification and unchanged boundaries

- After the initial corrections, reliability+readiness+inspection: **34passed0failed**,
  about14.4sec. All five reproduced failures now refuse as expected; baseline logs kept.
- First full suite after strict group identity bounds: **437cases324pass0fail113skip**,
  about16.1sec; validation3mods/replay4fixtures pass without command execution.
- After the final leader-exit signal guard, full npm test again passed **437cases:
  324pass0fail113skip**, about15.9sec. Runtime observed darwin/Node24.22.0. No native
  client query or compatibility inference; this rerun followed an actual code change.
- Native entry gate function bodies are byte-identical to0fcc04e, as are shared routing
  contract/native driver/inspection contract and31protected Windows/storage/config/
  hook files. No default/MCP/rule/capture/logging selection change. Only four metadata
  version carriers become38; CI adds the portable reliability suite.
- Starting source37 Medium verifier passed runtime/protected/old sealed/owned251/raw
  config checks. Known single project-trust addition remains unknown and unaccepted;
  no new baseline or selected native-input record. Later intentional source changes
  get separate38source pins; old37 review/package artifacts remain unchanged.

Exact source38 CI/anonymous archive/spaced-package verification is **pending Medium**.
Source37 CI's known Windows Image refusal/original bounds/native11/WSL gaps remain;
no Windows guard/assertion change or native compatibility claim. Passing Node fixtures
is not installation, live tool/hook execution, OS confinement or complete product proof.

## Next setting and rollback

**GPT-6.1 Sol Medium** for exact38CI, offline package/spaced checks, new source-only pins
and documentation consistency. High before consequential source/security work or drift.
All gates closed: no Codex/inference/install/config/trust change or native-input refresh.
No executable native PLAN/INPUT/current binary/config fingerprint or run grant.
Nothing installed or activated to remove/roll back. Preserve installed31 and unrelated
entries; private diagnostics/root HANDOFF/checkpoint state stay ignored. Existing
other-chat automation is separate; this stage created no worker or background schedule.
