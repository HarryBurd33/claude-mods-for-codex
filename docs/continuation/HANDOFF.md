# Source20 verified checkpoint — next Sol Medium

2026-10-24. Human selected GPT-6.1 Sol High from verifiedf500868 on
codex/astra-groundwork. Full93-capability product incomplete. Source20 uninstalled;
installed human-trusted dev10/logging scope/private settings unchanged.

## Read first

STATUS.md, REQUIREMENTS.md, ARCHITECTURE.md, TEST-LOG.md, DEV20-REVIEW.md,
PACKAGE-DEV19.md, DEV19-REVIEW.md, STATE-PROOF.md, ../../SECURITY.md,
../windows-storage.md, ../windows-native-acceptance.md and latest ignored root
HANDOFF.md. Private paths/raw logs/settings/backups/session data stay ignored.
Historical source reviews preserve earlier results; this file is current guidance.

## Completed investigation and observed failure class

Original38848a8/CI40068264694 Ubuntu24 independent-state-writer failure preserved,
not retried/erased. Its exact scheduling/IO delay cause remains unproved. Root lock
covered per-record real fsync and a fixed100×10ms collision budget could expire
even as other writers progressed. Controlled source-instrumented disposable test:
60ms added before real sync,8children×4events, before4busy children/17completed/
17retained; after0busy/32completed/32retained. No root lock left after all children
exited; no committed-record loss in that fixture. Original journal source identical.
Two explicit module copies only; not an installed app patch or exact CI-host trace.

src/state-lock-budget.mjs is a pure in-memory scheduler:1000ms without observed
handoff, at most2500ms total checked acquisition allowance; renews idle window
only between different validated lock-object fingerprints. First/same/late samples
add no time; expired clocks/budgets never revive. No new attempt after observed
expiry. Invalid/backward clock/invalid fingerprint refuses. Injectable test clock
is not exposed through configuration or the state API.

src/state.mjs still requires exclusive mkdir success before action. After EEXIST,
BigInt lstat must pass original private/current-user/directory/no-symlink checks
before sampling dev/ino/birthtimeNs. Ephemeral memory only; no raw metadata/path/
PID in logs/files. Fingerprints do not grant a lock or prove a committed write.
Coarse/unavailable birth-time/inode reuse can miss handoffs and conservatively
return busy. No FIFO/arbitrary-load success promise. Pending filesystem IO,
critical-section sync and preflight are not forcibly interrupted, so2500ms is not
a universal wall-clock method or whole5s-hook completion guarantee.

No lock stealing/removal, event retry after append starts, duplicate-write path,
skipped fsync, background queue/daemon or weakened32-record assertion. Root scope
cap/retention/privacy/owned release unchanged. Original journal, hook entrypoint/
configuration and all Windows helper/adapter/proof/admission code byte-identical
tof500868. Only POSIX acquisition and package/MCP version20 changed. Windows uses
its existing adapter; pure scheduler tests on Windows are not storage acceptance.

## Exact code/remote identity and actual verification

Tested source [14091a2a437ea56716c6d77e647367a457370fef](https://github.com/HarryBurd33/claude-mods-for-codex/commit/14091a2a437ea56716c6d77e647367a457370fef),
treed5b44ddba6e89b097316b7b135a9f108810c5d39. Expected-parent/nonforce upload,
fetched full-tree equality/anonymous ls-remote verified. Equivalent local
23dbde676b843ae9916a8ee87a47c060032e1988 retained on
codex/dev20-state-progress-local-checkpoint. Final notes-only local/verified remote
identity recorded after independent readback in reply/latest ignored handoff;
no self-hash claim. Confirm final HEAD/ancestry before continuing.

[CI40069749825](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40069749825)
all7job conclusions read success. Windows portable scheduler is clock simulation;
Windows OS120800434393(Node24)/120800434577(Node22) conclusions only, no new
decoded OS counts/mapping branch/native-host acceptance claim.

Actual decoded full POSIX job logs read, each186pass/0fail/86Windows-only skips
272total:120800434553(Ubuntu24),120800434738(Ubuntu22),120800434595(macOS24),
120800434648(macOS22). Original8×4and new synchronized slow-sync32case passed,
plus unchanged held-lock refusal,3clock cases and unsafe lock identity checks.
Ubuntu24 slow-sync case2260.20ms/held-lock1007.02ms; macOS24 slow-sync2560.90ms/
held-lock1012.41ms. Whole fixture duration is not individual acquisition duration.
Images Ubuntu24.04 version20261012.334.1, macOS26-arm64 version20261013.0424.1.
No manual retry. Prior failure remains, exact original host stall cause unproved.

Local macOS14.6/Node24.22.0/npm11.19.1:

- node --test test/state-lock-budget.test.mjs:3pass/0fail/0skip.
- Before extra guard test, targeted state/journal/budget/latency suite30pass/0fail/
 1Windows-only skip31total.
- Final npm test186pass/0fail/86Windows-only skips272total.
- npm run validate3mods; npm run replay4fixtures; git diff --check clean.

New source-instrumented OS regression uses8IPC-ready children released together,
4events each, every real sync preserved, bounded output/10s group watchdog. All
children stopped before fixture removal; root/scope contain no leftover locks.
No fixture command execution or model/API run. All old concurrency/held-lock/retention/
privacy assertions remain. Node22 filesystem primary retrieved; Node22 performance
page inaccessible, recorded rather than claimed reviewed (see DEV20-REVIEW).

## Installation, authority and rollback

Installed dev10/cache149files freshly equal immutable reviewed fixture; private
settings hash unchanged (exact private path/hash only ignored handoff). All93IDs/
order retained; SEC-09records reproduced-class fix, not proof of original delay.
No source20 install/cache/trust/settings/logging/scope/retention/export/observer/
theme/client/native/model/API-run change or fresh native inventory/event/UI/trust
observation. Source20 has not run as an installed updated hook. Future supported
update requires human changed-code review; source19/20 remain uninstalled now.
Current chat outside selected logging child, never broaden scope to move counters.

Every Windows settings/project/Git/restore before-IO gate stays closed. Existing
CodeAncestor/Installer-grant repeat metadata is not atomic original cause/code trust/
leaf presence/hash/import/version or native Windows compatibility. Do not globally
allowlist Installer/repair system ACLs/execute Git based on it. Earlier mapping/
byte-mtime/8.3/loader/repository/ignore/writer/native gaps remain in DEV19-REVIEW.
Windows11 latest unavailable; do not repeat availability question yet.

No machine rollback needed. New uninstalled source/disposable fixtures can be
removed; selective supported dev10 rollback remains separate in native records.
Never patch cache/trust hashes, restore whole shared config or remove live locks.
No protected user action/trust/restart needed for this checkpoint.

## Next tasks — Medium, then human High

1. Medium: exact anonymous public clone, ancestry totested14091a2. Full offline
   tests/validate/replay, offline ignore-scripts pack with empty separate npm configs/
   dedicated cache. Inspect MIT/manifest/version20/hygiene/default-off storage,
   exact packaged byte equality, no private roots/links/collisions/dependencies/
   compiled binaries. Check new scheduler/tests/review present, production Windows
   helper still excludes proof code. Fresh spaced extraction package/scaffold/
   scheduler/CLI checks. Add PACKAGE-DEV20.md with actual counts/hash/outcomes.
2. Preserve prior38848a8 failure and source20 instrumented evidence; no retry-until-
   green or claim exact old CI cause solved. Busy remains valid under paused owner/
   severe load. Medium must not change acquisition/admission/privacy/security,
   launcher/Windows/project/Git/restore code to package. No source20 install, trust
   automation, new native/model/API test or broadened logging. Save/upload/
   independently verify package checkpoint and stop for human GPT-6.1 Sol High.
3. Later High: resume one concrete gated Windows code-installation trust prerequisite.
   Separate code authority from private data, retain all gates until their own
   security/OS/native tests pass. No global Installer allowlisting/system repair/
   PATH or project executable fallback/binary download/Git launch. Later selected
   Windows11 read-only inventory precedes executable choices; compatibility remains
   unverified. Keep enclosing preflight/owner/transport bounds, loader/config and
   repository/hash-format/object/freshness/ignore/writer acceptance separate.
4. Stop for Medium once stronger reasoning no longer justified. New hard problem
   beyond High: checkpoint/request Astra. All switches human-controlled; no internal
   delegation/background/scheduled continuation to bypass a stop.

## Exact next model and complete resume instruction

**GPT-6.1 Sol, Medium.** Verified bounded-contention milestone leaves routine
source20 packaging/docs. Further gated Windows security requires High.

Copy and paste after human switch (use final verified notes commit from reply if
specifying exact resume HEAD):

> Continue on GPT-6.1 Sol Medium from the verified source20 handoff on
> codex/astra-groundwork. Read docs/continuation/HANDOFF.md, STATUS.md,
> REQUIREMENTS.md, ARCHITECTURE.md, TEST-LOG.md, DEV20-REVIEW.md, PACKAGE-DEV19.md
> and latest ignored root HANDOFF.md. Verify source20 exact anonymous package/
> extraction/hygiene, retaining tested14091a2/CI40069749825 and the old38848a8
> failure as distinct evidence. The progress-aware wait fixes a reproduced
> contention class, not proof of the old CI host's exact delay or arbitrary-load
> success. Preserve installed human-trusted dev10, private settings, selected
> logging scope, all93requirements and every Windows gate. No install, trust
> automation, security/runtime edit, actual Git execution or extra model/API test.
> Save/upload/independently verify package checkpoint, then stop for human
> GPT-6.1 Sol High before further gated Windows work.
