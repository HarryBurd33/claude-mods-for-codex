# Inspection activation proposal 36.1 — review only

2026-10-26, GPT-6.1 Sol High, resumed ce02f5a. **No activation is approved or
implemented.** Source36, installed31, routing/native gates, logging selection,
parent model, human trust and Windows guards remain unchanged. This proposal is
for a temporary diagnostic using the official CLI, not a new product client.

The exact source36 package remains [9833caf](PACKAGE-DEV36.md). Its offline tests
establish protocol/parser/owned-peer behavior, not safe native startup. **Do not
remove requireLiveAdmission from the existing driver to try the inspector.**

## Decision

Do not activate source36 as written. A separate inspection entry needs a reviewed
implementation and its own closed admission boundary, followed by a fresh human
grant for one exact no-turn invocation. Routing admission must stay unconditionally
closed throughout. No plan field, argument, environment flag, caller callback,
saved approval or synthetic test result may stand in for that grant.

This stage prepares the change contract and private byte-bound draft artifacts.
It does not supply a ready-to-run command, fresh native input plan or gate patch.
The artifact named HISTORICAL-ARGV.json preserves an exact **rejected launch
draft**, not an executable instruction. A runnable proposal must be generated
after the required source work and separately reviewed input observations.

## New evidence and consequences

Official [app-server guidance](https://learn.chatgpt.com/docs/app-server) and
[environment documentation](https://learn.chatgpt.com/docs/config-file/environment-variables)
were retrieved on 2026-10-26. They document read RPCs and Codex state locations;
neither establishes that starting the server is free of network or filesystem
effects. Native startup behavior below is corroborated against release-source
commit **6aaac694803004a63c6f393d153c96d22521a6b9**, not a fresh binary/version run.

| Finding | Exact evidence | Required treatment |
| --- | --- | --- |
| Native spawn inherits the caller's OS cwd | [source36 driver](../../proofs/readiness-driver.mjs), native spawn has no cwd option. Pinned [CLI app-server dispatch](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/cli/src/main.rs#L1250) forwards root config overrides; interactive cwd is not passed in this arm. [Server startup](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/lib.rs#L555) reads current_dir | Treat -C alone as insufficient for this arm. Future native spawn must set cwd to the verified disposable directory. Assert OS spawn cwd, argv cwd and both config/read plus hooks/list cwd match in offline tests. Do not infer the dormant routing adapter is fixed. |
| Startup begins before inspection RPC checks | [lib.rs](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/lib.rs#L570) loads cloud startup config/auth; [config manager](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/config_manager.rs#L400) bootstraps auth and cloud configuration | Post-start config checks cannot prevent startup effects. Disclose ordinary auth/cloud-policy/network access separately from the five outgoing client reads. No credential discovery/export by this project. |
| An online catalog refresh is scheduled without a client model/list RPC | [message processor](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/message_processor.rs#L388), [refresh worker](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/models_refresh_worker.rs#L34) | No outgoing client catalog RPC does not mean no catalog activity. Actual network success depends on auth/provider/runtime; not observed. This is not evidence of model generation, nor an exact zero-usage/billing guarantee. Future native grant must disclose startup catalog traffic. |
| Default remote-control mode resolves persisted state | [CLI options construction](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/cli/src/main.rs#L1302), [server remote-control startup](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/lib.rs#L888) | --no-daemon and stdio are not proof that another connection cannot arrive. Resolve a supported process-local disable or verifiable exclusion before launch. Do not use undocumented internal environment controls, change persisted remote-control settings, attach to an existing server or assume this machine has remote control enabled. This remains a launch blocker. |
| Server initializes local runtime state before inspection responses | [SQLite initialization](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/lib.rs#L674), [log database](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/lib.rs#L755), [recovery path](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/lib.rs#L1421) | A tool read-only policy does not sandbox this process. Normal logs/cache/state and possible corruption recovery writes require explicit disclosure. Do not promise a write-free run or silently isolate CODEX_HOME, which changes the hook/config population being inspected. Never erase normal host state as rollback. |
| Plugin startup warmups have their own startup path | [message processor](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/message_processor.rs#L559), [effective plugin input](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/config/mod.rs#L1788) | Effective plugins=false is passed to the plugin subsystem, but the complete startup branch was not traced this stage. Do not turn listing migration avoidance into a claim that every startup plugin side effect is excluded. Review that path before native approval. |

Two guessed source locations, request_processors/initialize.rs and
transport/remote_control.rs, returned404; neither supplies evidence. The actual
transport.rs only re-exports remote-control APIs; its implementation was not
retrieved here. No source claim establishes live host behavior.

## Concrete implementation contract for a later authorized stage

1. Add a dedicated inspection contract/entry with an **unconditional closed gate**.
   Keep proofs/routing-contract.mjs, routing-native-driver.mjs and their admission
   behavior unchanged. Existing source36 native entries must still refuse before
   plan/getter/path access. Do not export the private generic spawning function or
   accept arbitrary executable/argv/URL/transport factories. Gate opening is a
   distinct future reviewed change and human action, never part of offline tests.
2. Keep the source36 machine/framing invariants: five conditional read requests,
   explicit same cwd, one outstanding request, plugin reductions confirmed before
   listing, typed state-only metadata, narrow managed-policy refusal, typed denials
   and no retry. Reuse pure components only; no thread/turn/catalog/auth/account,
   command/fs/write RPC. Avoid broadening the accepted config or notification schema
   just to make a native test pass. Unexpected startup packets must stop safely.
3. Bind native transport to a separately reviewed selected-input contract and set
   OS cwd explicitly. Current32 process settings can remain historical review data;
   do not inherit a model-turn payload as inspection authority. Review whether the
   inert routing role/effort fields are necessary before defining a new narrow plan.
   Any changed settings need new exact argv/projection tests and disclosure. Do not
   change the current chat's model or any persistent profile.
4. Resolve persisted remote-control exclusion using a supported mechanism and trace
   plugin startup behavior. If no supported isolation is established, stop with a
   blocked proposal and practical read-only source analysis; do not patch Codex,
   use debug-only switches, weaken managed policy or invent a native proof.
5. Retain20sec work/25sec outer/5sec request bounds,1MiB combined output,64KiB frame,
  128messages,5requests,256hooks and128KiB outgoing;2sec TERM/2sec KILL cleanup.
   Revalidate before spawn, refuse late/cancelled/mismatched inputs and never retry.
   OS I/O stalls and all native descendant cleanup remain limitations to disclose.
6. Before a future run, bind exact public source/package, entry/contract hashes,
   current explicitly selected CLI/candidate-if-retained/config identities, empty
   cwd, argv/spawn options, conditional protocol, access and retention to a **new**
   private revision. Keep old34/35.1/source36 manifests unchanged. No input version
   query or settings application is authorized by this document.

Required offline acceptance includes: closed-before-getter/read/spawn for **both**
inspection and routing; attempted inspection-token/flag/environment misuse cannot
open routing; no generic transport injection; exact spawn cwd; no forbidden RPC in
any success/refusal/late-message path; startup-effect blockers cannot be bypassed by
caller claims; framing/bounds/privacy; cancel/timeout/EOF/failure/owned-process cleanup.
Use fixed peers and synthetic data. Tests cannot prove native policy or host isolation.

## Input freshness, trust and privacy

The old source36 preservation checker now fails: one new project trust entry was
added since ce02f5a, outside the previously reviewed project set. Removing only
that addition in memory reproduces the exact source36 protected digest. All prior
protected values, including the seven human-attested global hook metadata entries,
are unchanged. Origin/intent of the new project entry is **unknown**; no definition
trust or execution grant is inferred. It is left untouched, old baselines are not
refreshed, and fresh native-input acceptance is blocked pending reconciliation.
Independent installed31 cache251/settings/data/sources/marketplace checks are
recorded separately from that failed protected-configuration check.

This stage retains only private key paths, hashes and fixed classifications needed
for preservation review. No new hook definition/command or private session was
opened; no credential/environment search. No binary execution or input refresh.
Future read replies may contain secrets in bounded memory; never persist/echo raw
config/origins/layers/requirements/hook handlers, stderr, keys, paths, trust hashes,
environment, prompts or transcripts. Keep fixed labels/counts/booleans only. The
transient projection digest must not be reported or described as anonymized.

Any listed hook, including trusted/disabled/managed hooks, remains review-required;
warnings, errors, policy conflicts, incomplete visibility or changed projection stop.
Never disable unrelated callbacks or trust a definition to manufacture an empty
list. Even empty discovery means hookAbsenceEstablished=false and cannot open
routing. Builtin omissions, concurrent discovery and later config changes remain.

## Artifact and decision sequence

Private revision36.1 contains: ACTIVATION-PROPOSAL.json (closed, blocked),
HISTORICAL-ARGV.json (old rejected launch data), PROTOCOL-DRAFT.json (pure simulated
requests, no transport), SOURCE-PINS.json, ACCESS.md, protected-drift-paths.json,
PRESERVATION.json, VERIFY.py and HASHES.json. Files are0600/directory0700.
No new runnable PLAN/INPUT, executable permission, current CLI fingerprint,
candidate refresh or execution grant is created. Delete only this new folder to
discard it; do not touch referenced inputs, sealed artifacts or installed31.

Next **GPT-6.1 Sol Medium** can verify these records and the sanitized documentation
without repeating source36 packaging/CI. No Codex/inference/install/config/trust/gate
change. High and fresh explicit implementation scope are required for the contract,
cwd or startup-boundary source work above. Native approval must follow a concrete
implemented and verified artifact; it cannot be requested as an immediate run now.
Inference requires another separate authorization even after no-turn inspection.

Full93/native routing/nativeWindows acceptance remains incomplete. Source36 CI
still has the recorded Windows Image refusal; no unrelated Windows work or rerun
was undertaken. No runtime rollback, hook review or restart is needed for this stage.
