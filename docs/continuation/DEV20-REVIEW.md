# Source20 review — bounded progress-aware POSIX state contention

2026-10-24. Human selected GPT-6.1 Sol High from verifiedf500868 on
codex/astra-groundwork. Full93product incomplete. Source20 uninstalled; installed
human-trusted dev10/cache149files/private settings hash unchanged. No logging scope,
trust/config/client/theme/observer/native/model/API-run change. Windows gates closed.

## Preserved failure and concrete investigation

38848a8/CI40068264694 Ubuntu Node24 job120795969532 failed the original8writer ×
4event test with metadata-state busy;180pass/1fail/86skips. No retry/erasure. The
observed CI log does not expose its hold durations, so its precise scheduling/IO
cause remains unproved. No corruption, lost committed record or stale lock inferred.

Source inspection: original100attempts with10ms sleeps counted every collision
against one budget, regardless of ownership changes. The global root lock encloses
scope validation and the durable per-record journal append, including real fsync.
Active writers can therefore exhaust a waiter's budget without a stale lock.

One controlled private source-instrumented run copied only state.mjs/journal.mjs
to a fresh disposable root and added60ms before each real sync. Original8children
with4events each:4children busy,17completed and17retained, root holds65.06–69.20ms,
total1134.04ms, no root lock remaining after all children exited. No committed
event disappeared in this fixture. One equivalent after-change run completed all
32events/32retained with0busy, holds64.77–68.68ms,total2126.16ms. Original journal
source byte-identical; actual sync was not removed. Instrumented local OS proof,
not a reproduction of the CI host's exact latency or native Codex event delivery.
Private raw metrics/source copies remain ignored; no installed application patch.

## Chosen contract and security review

Keep bounded busy as a legitimate result under an unchanged/paused owner or severe
load. Do not promise32success under arbitrary scheduling. Change acquisition only:

- Unchanged/no observed handoff:1000ms idle allowance, about the original nominal
 100×10ms budget; repeated same-object samples and first late observation add none.
- A different validated lock-object fingerprint may renew the idle allowance,
 capped by2500ms from acquisition start. No new attempt after observed expiry.
 This is a conditional contention extension, not a blanket wait increase or FIFO
 guarantee.2.5s leaves nominal room within the existing5s hook setting for actual
 append/other work, but does not guarantee whole-hook or kernel IO completion.
- An expired budget never revives, and even endless observed object changes hit
 the total cap. No stale-lock removal, lock stealing, event replay, post-commit
 retry, shortened sync, weakened assertion, fewer writers or new background worker.

src/state-lock-budget.mjs is original MIT, pure in-memory scheduler. Fixed limits,
monotonic performance clock; injectable clock only for tests, not a config/API option.
Invalid/backward clocks and invalid fingerprints refuse. It grants no file access.

src/state.mjs still requires exclusive mkdir success to enter the critical section.
After EEXIST, lstat(bigint:true) must pass the existing current-user/private/directory/
no-symlink policy before sampling dev/ino/birthtimeNs. These ephemeral values never
enter metadata, filenames, stdout or logs. No lock fingerprint is a permission or
committed-record token. If inode reuse/coarse or unavailable birth time conceals a
handoff, behavior can conservatively remain busy. Observing churn cannot bypass
the hard acquisition allowance or privacy checks. Path checks/scope cap/append/
retention/owned release remain. No persistent token/queue/new data schema.

The loop checks deadlines before attempts and after observations. Already-pending
filesystem IO and critical-section/fsync time are not forcibly interrupted; no
universal wall-clock2.5s method bound. Existing cooperative POSIX/same-user threat
model remains; this is not a new adversarial filesystem sandbox or data authority.
No automatic retry of an event after append begins, so no new duplicate-write path.

Original journal.mjs, hook entrypoint/configuration, all Windows helper/adapter/
admission/proof code remain byte-identical to f500868. Windows dispatch returns
through its existing ACL adapter; the POSIX scheduler is not its acquisition policy.
Production Windows settings/project/Git/restore gates untouched. No model/API call,
network, raw-event/context collection or permission approval introduced.

## Meaningful tests and observed local results

Original8×4process test and32-record assertion unchanged. Original held-lock,
privacy/link/retention/cap tests retained. New tests:

1. Three portable clock tests: same/late identity does not renew; changes permit
 progress but never exceed total cap; expired/invalid clock/identity fails closed.
2. Source-instrumented POSIX OS regression: two explicit module copies,60ms added
 before every real sync,8IPC-ready children released together,4events each, exactly
32retained with correct counters and no lock. Output bounded;10s group watchdog,
all children stopped before fixture removal. Not a native host or Windows test.
3. Actual POSIX lock-object guard test: public-mode directory, symlink and regular
 file rejected without recording an event or altering targets. Only own synthetic
 fixture removed after rejected calls; no production/live-lock removal.

node --test test/state-lock-budget.test.mjs:3pass/0fail/0skip.
Targeted state/journal/scheduler/latency suite before extra guard test:30pass/0fail/
1Windows-only skip31total. Final npm test186pass/0fail/86Windows-only skips272total;
validate3mods/replay4fixtures, diff-check clean. Host macOS14.6/Node24.22.0/npm11.19.1.
Source [14091a2](https://github.com/HarryBurd33/claude-mods-for-codex/commit/14091a2a437ea56716c6d77e647367a457370fef),
[CI40069749825](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40069749825):
all4full POSIX lanes passed; actual decoded Ubuntu22/24 and macOS22/24 logs read,
each186pass/0fail/86Windows-only skips272total. Original8×4, new slow-sync32, idle/
total bounds and unsafe-lock cases passed. All7job conclusions read success, including Windows portable and both Windows OS
lanes. Windows observations here are conclusions only, no new OS counts/native claim. Prior failure remains, exact old CI delay
cause unproved. Installed10/logging/trust/Windows gates unchanged; source20 uninstalled.

No updated native-hook/Windows host/producer-health claim.

## Primary evidence and inaccessible source

Retrieved2026-10-24:

- [Node22.23.4 filesystem API](https://nodejs.org/docs/latest-v22.x/api/fs.html#statsbirthtimens)
 documents bigint nanosecond birth-time fields and platform-specific precision;
 metadata identity sampling is not a portable proof of process ownership.
- [Current Node performance API](https://nodejs.org/api/perf_hooks.html#performancenow)
 describes high-resolution process-relative milliseconds. Current page is26.12.1,
 not evidence of target runtime behavior; actual22/24 tests are recorded separately.
- Node22 performance page at https://nodejs.org/docs/latest-v22.x/api/perf_hooks.html
 was inaccessible through the web tool. Not claimed reviewed; no tool repair or
 software update attempted. Existing state observer already uses performance.now.

## Remaining scope, installation and rollback

All93requirements retained. This addresses a reproduced active-contention failure
class; it does not retroactively establish the CI host's exact delay cause or
guarantee success under arbitrary load. Historical failure remains in PACKAGE-DEV19.
Further failures require diagnosis, not retries until green. Source20 is uninstalled,
so installed dev10 still has its reviewed behavior; live updated-hook acceptance
would require supported update and human changed-code review later.

No machine rollback needed; remove uninstalled source/disposable test fixtures.
Do not modify installed cache/trust hashes/shared configuration/live locks. Existing
selective dev10 rollback remains separate. Keep Windows Installer-grant observation,
loader/signature/config/repository/ignore/writer and all native Windows11 gaps as
recorded in DEV19-REVIEW. Windows11 latest unavailable; do not ask again yet.
After actual CI verification checkpoint/upload/readback, stop for human Sol Medium
for packaging. Further gated Windows security requires High, not silent activation.

## Observed candidate identity and POSIX CI results

Tested14091a2a437ea56716c6d77e647367a457370fef,
treed5b44ddba6e89b097316b7b135a9f108810c5d39. Expected-parent/nonforce upload,
fetched full-tree equality/anonymous ls-remote verified. Equivalent local
23dbde676b843ae9916a8ee87a47c060032e1988 retained on
codex/dev20-state-progress-local-checkpoint.

Actual decoded job logs read:

- 120800434553 Ubuntu24,186pass/0fail/86skips; original32case246.55ms,
 slow-sync32case2260.20ms, unchanged held-lock refusal1007.02ms.
- 120800434738 Ubuntu22,186pass/0fail/86skips; original/new32/bounds/guard cases pass.
- 120800434595 macOS24,186pass/0fail/86skips; original32case312.05ms,
 slow-sync32case2560.90ms, held-lock refusal1012.41ms.
- 120800434648 macOS22,186pass/0fail/86skips; original/new32/bounds/guard cases pass.

Images Ubuntu24.04 version20261012.334.1 and macOS26-arm64 version20261013.0424.1.
The slow-sync case time includes all children/records/fixture work; it is not an
individual acquisition measurement or evidence of a universal method deadline.
Windows portable scheduler test is a clock simulation, not Windows storage support.
Windows OS jobs120800434393(Node24)/120800434577(Node22) concluded success;
conclusions only, no new decoded OS counts/mapping branch/native-host claim.
No failed-run retry. Exact old host stall cause remains unproved even though the
reproduced contention class and original regression pass at this new source.

Installed149files/settings hash freshly unchanged, all93identities/order retained.
No production Windows/proof or journal/hook/config/UI changes. No install/trust/
logging/client/native/model/API-run change. Final notes-only local/verified remote
identity is recorded after actual readback in reply/latest ignored handoff.

## Final checkpoint decision

All7CI40069749825jobs passed on the first candidate. Four POSIX logs read as
above; Windows conclusions are separate from native Windows acceptance. No manual
CI retry/fix or deletion of old failure. Installed149files/private settings hash
freshly unchanged; all93requirement identities/order retained. Runtime diff is
limited to POSIX state acquisition and its pure budget helper plus MCP version20;
journal/hook/Windows/proof code unchanged. Public data/permission/logging contracts
unchanged; no installed updated hook observation claimed.

High milestone leaves routine source20 packaging. Next human GPT-6.1 Sol Medium;
High required before new state/security or gated Windows changes. Save/upload/
independently verify notes first, then stop without background continuation.
