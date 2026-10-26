# Source37 — separate closed inspection contract and cwd proofs

2026-10-26, GPT-6.1 Sol High, resumed5e36484 under explicit offline implementation
scope. **No Codex invocation, inference, installation, host config/trust change,
native-input refresh or gate opening.** Installed31 and approved scope remain.
Source0.2.0-dev.37 is uninstalled; full93/native routing/Windows acceptance incomplete.

## Implemented boundary

| Location | Contract |
| --- | --- |
| proofs/inspection-contract.mjs | Strict inspection-only input: selected CLI/hash, cwd, config identities and MCP-disable names as review data. No candidate role/model/effort/thread/turn/prompt or caller authority. Exact generated argv/spawn cwd, shell=false, strict config/stdin transport draft; native startup remains unverified. requireInspectionAdmission always throws. |
| proofs/readiness-machine.mjs | Adds createInspectionMachine through a private shared protocol implementation. Each public constructor validates its own exact plan; no injected validator, executor or transport. Legacy createReadinessMachine retains its validator, wire identity/domain and refusal rules. |
| proofs/inspection-driver.mjs | Native exported/from-file entries invoke the separate unconditional gate before input getters/validation/IO. **No native transport implemented.** Fixed mode accepts only a scenario enum, creates an owned spaced temporary cwd and starts this Node runtime/fixed peer with cwd explicit, shell=false, empty environment and owned POSIX group. No selected project/executable supplied by a caller is executed. |
| proofs/inspection-fixtures.mjs, inspection-peer.mjs | Synthetic data/fixed peer. Private preface reports actual peer process.cwd for comparison with plan/spawn cwd, then is discarded. Five read drafts remain conditional; paths never enter the report. One fixed existing Node leaf is used only for the POSIX pipe-holding cleanup test. |
| test/inspection.test.mjs | Eleven contract/process acceptance cases: cross-use/forgery, closed-before-getter/IO, CLI/environment grants refused, same-cwd sequencing, policy/trust/MCP refusals, hooks/errors, typed denials, physical cwd/environment isolation, failures/bounds/cancel/cleanup and a blocked-parent deadline regression. |

Inspection reductions disable multi_agent_v2 instead of configuring routing. No
agent candidate or model/effort override is generated. Hooks remain informative only
when effective features.hooks=true; no hooks=true/false override or trust bypass.
Permissions remain read-only/on-request/user as process-only **unexecuted review data**.
The draft adds documented --stdio/--strict-config; strict config excludes the reviewed
startup fallback-to-defaults branch. This does not suppress normal startup side effects.
No persistent profile or current chat model is changed.

Common protocol behavior stays conservative: initialize/initialized, explicit-cwd
config/read, requirements/read, conditional same-cwd hooks/list, repeated config/read.
One request outstanding; typed metadata-only hook config; plugins/plugin_hooks false;
unknown/non-null opaque policy requires review. This includes a non-null managed
allowRemoteControl=false requirement: it is not silently treated as compatible.
Every listed hook (even trusted/disabled/managed), warning/error, unexpected request,
notification or projection change stops. Server requests get only a typed denial or
fixed error, never approval, completed tool action or an answered user form. No retry.

Reports retain fixed reasons/categories/counts/flags only. No config/layers/origins,
hook commands, trust keys/hashes, prompts, transcripts, raw stdout/stderr or projection
digest. Empty discovery keeps hookAbsenceEstablished/nativeInspectionVerified and
liveAdmission false. An inspection plan/result can never authorize a model task.

## Cwd, timing and cleanup proofs — scope of evidence

Fixed mode canonicalizes the OS temp root before creating a fresh spaced directory;
it binds input.cwd, argv's -C value and spawn.cwd to the same path. The peer checks its
actual process.cwd independently; mismatch refuses before any inspection read draft.
This is a real Node subprocess observation, **not evidence that native Codex honors
cwd or that current host inputs are accepted**. Native CLI argv is never executed.

Machine limits remain20sec work/25sec outer/5sec request,1MiB combined output,64KiB
frame,128messages,5requests,256hooks and128KiB outgoing. Fixed mode has its own
2.5sec work ceiling/1.25sec cleanup reserve, with EOF grace100ms,TERM150ms and
KILL/reap1000ms. Both per-packet delivery and scheduler ticks check elapsed time;
a real blocked-parent test buffers a reply while the parent stalls and then refuses
it rather than accepting a late success. These are event-loop/OS bounds, not a hard
real-time guarantee against process suspension or kernel stalls.

Owned POSIX groups are signalled even after leader exit while a descendant holds
pipes. processReaped means observed direct-child close, not proof of all invisible
or detached descendants. Empty-directory-only removal avoids recursive deletion;
unexpected contents or unreaped work remain for review. No caller-selected paths
are deleted. Fixed POSIX peer checks skip on Windows; pure contracts/closed-entry
checks are added to portable CI. That is not native Windows/WSL compatibility.
Legacy native routing/readiness entries, shared requireLiveAdmission and Windows
storage/permission guards are unchanged.

## Primary startup investigation — source findings, not live observations

Official [CLI reference](https://learn.chatgpt.com/docs/cli/reference),
[app-server](https://learn.chatgpt.com/docs/app-server) and
[configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference)
were retrieved2026-10-26. They document stdio/strict config and managed remote-control
policy; they do not establish a supported per-process remote-disable CLI option for
this diagnostic. Public environment documentation had no REMOTE_CONTROL entry.

Additional released source was retrieved at pinned CLI0.164 commit
**6aaac694803004a63c6f393d153c96d22521a6b9** through repository directory listings:

- [PluginsManager startup tasks](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core-plugins/src/manager.rs#L2823):
  curated sync, marketplace auto-upgrade, remote cache/bundle/catalog refresh and
  featured-plugin warmup in this entry are inside config.plugins_enabled. Effective
  plugins=false excludes this entry's warmups **in the reviewed source**. Existing
  core config maps Feature::Plugins into that input. Actual startup configuration
  and other client work remain native-unverified; no claim of globally write-free startup.
- [Remote startup controller](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server-transport/src/transport/remote_control/controller.rs#L265):
  policy DisabledByRequirements or absent state DB gives Disabled; normal
  ResolvePersisted gives Unknown until resolution. This does not justify disabling
  state storage, altering machine policy or assuming this host's preference.
- [Desired state](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server-transport/src/transport/remote_control/desired_state.rs#L30),
  [websocket preference resolution](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server-transport/src/transport/remote_control/websocket.rs#L612):
  persisted enabled enrollment is scoped by target/account/client identity and can
  resolve to Enabled. A new client name is not a supported exclusion guarantee.
- [Remote mode/marker](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server-transport/src/transport/remote_control/mod.rs#L79)
  explicitly describes the daemon's disabled environment marker as **internal**.
  It was neither set nor proposed as a supported workaround. The CLI's already
  reviewed runtime selection defaults to ResolvePersisted without that marker.

Eight additional public source files are pinned privately (manager/startup_sync and
remote-control mod/controller/desired_state/enroll/persistence/websocket). Only the
sections needed for these conclusions were reviewed; no complete upstream audit,
current-binary refresh, credential/SQLite inspection or endpoint query. No new404
source lead was needed. Previous catalog/cloud-auth/SQLite/log/installation/recovery
startup findings remain. No native traffic/billing/permissions/cleanup observation.

**Native activation stays blocked.** A preexisting managed restriction might provide
an independently reviewable alternative, but this stage did not inspect/accept current
policy or change it. No supported process-local exclusion was established here. Do
not activate the old transport, set internal/debug controls, modify installed Codex,
suppress hooks/managed policy or manufacture an empty listing. Continue supported
source analysis until a concrete separate native proposal is feasible; user approval
for any run remains distinct from offline implementation and from inference.

## Commands and observed results

- Starting Medium artifact checker passed19private/11historical+9current documents,
 14runtime/test/sealed earlier records and owned installed31cache251/settings/data/
  sources/marketplace. Original protected mismatch stays the known one added project
  trust entry, unknown intent; prior values match, no baseline acceptance or new drift.
- First inspection+legacy readiness run:28cases27pass1fail. The new test wrongly used
  an empty released event default as a handler. Replaced its fixture with a nonempty
  group and added a positive empty-default assertion. Classifier/runtime policy unchanged.
- Targeted inspection/readiness/native/classifier suites: **48cases47pass0fail1skip**.
- Full npm test after final temp-root/deadline checks: **431cases318pass0fail113skip**,
  about10.9sec. New11tests passed; old17readiness tests and routing guards still pass.
- npm run validate:3mods pass; npm run replay:4fixtures pass, no command execution.
- Byte comparison: routing/native/legacy-readiness gates/drivers and31protected
  config/hooks/storage/Windows files unchanged. Four version carriers become37;
  CI adds only the new portable suite. No default/MCP/rule/observer/logging selection
  change. Source36 sealed artifacts remain historical; new source pins are separate.

Exact source37 public CI/package/anonymous clone/spaced archive checks are **pending**
Medium. Earlier source36 CI's known Windows Image/linkcount2 failure is retained;
no all-green, native Windows or original bounds-resolution claim. No repair/retry loop.

## Next setting and rollback

**GPT-6.1 Sol Medium** for exact source37 CI/package verification, new source-only
review pins and documentation consistency. Do not rerun old package/source research.
High before new consequential source/security work or unexpected protected drift.
No Codex/inference/install/config/trust change, native-input refresh or gate opening.
No executable native plan is prepared. Nothing installed/activated to roll back;
preserve installed31 and unrelated entries. Private logs/hashes/checkpoint/root
handoff remain ignored; public branch is incomplete development, MIT/independent.
