# Native readiness proposal 35.1 — 2026-10-25

Sol High resumed 4f4c0b3. **Proposal only: no native process, inference, installation,
configuration change or admission-gate change.** Source35 remains uninstalled and
installed31 is preserved. This is a temporary diagnostic proposal, not an external
product client or a replacement for native Codex integration.

## Decision and remaining gap

Prepare one separately authorized, no-turn inspection before proposing routing
activation. `config/read` alone cannot inventory hooks: discovery combines inline
config, adjacent hook files, managed requirements and eligible plugin sources.
Source35 correctly classifies metadata; it does not discover definitions or prove
trust. Do not disable unrelated hooks, change managed policy or reuse a trust record
as permission. The accepted ordinary-read-only routing design is unchanged.

This proposal is now reviewable, but its inspector is **not implemented**. No new
source35 execution PLAN/INPUT or gate switch was created. Private revision35.1
contains exact proposed argv, selected file observations, protocol drafts, access
review and byte hashes. Earlier34 proposal/source35 source-review records remain
unchanged; they must not be silently refreshed or reused as authority.

## Evidence and scope

Official documentation retrieved 2026-10-25:

- [Hooks](https://learn.chatgpt.com/docs/hooks): discovery merges several sources;
  user trust and managed policy are distinct. Concurrent handlers mean one guard
  does not prevent another callback from starting.
- [Advanced configuration](https://learn.chatgpt.com/docs/config-file/config-advanced):
  project trust affects project layers, while user/system layers remain separate.
- [App-server](https://learn.chatgpt.com/docs/app-server): read endpoints include
  `config/read`, `configRequirements/read` and `hooks/list`. These are distinct from
  configuration-write or thread/turn requests.

Pinned CLI0.164.0 source, commit **6aaac694803004a63c6f393d153c96d22521a6b9**;
relevant functions/sections inspected, not a claim of complete source review:

| Finding | Primary released source | Consequence |
| --- | --- | --- |
| hooks/list loads config for each requested cwd and discovers managed/config/plugin entries | [catalog processor, lines624–692](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/request_processors/catalog_processor.rs#L624), [discovery](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/engine/discovery.rs#L106) | Explicitly select one disposable cwd; no machine-wide directory search |
| Public hook metadata omits builtin entries | [hooks_to_info](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/request_processors/catalog_processor.rs#L72) | Empty public list cannot prove universal absence |
| Listing returns no entries if hooks feature is off; outcome exposes entries/warnings rather than an independent required-load-error field | [list_hooks](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/registry.rs#L344) | Feature-off/unknown/warnings/errors are incomplete, not success |
| Plugin discovery in this endpoint depends on effective hooks and plugins features | [catalog processor](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/request_processors/catalog_processor.rs#L663) | Confirm process-only plugins=false before listing; do not alter installed31 |
| Plugin listing fingerprints bundles; trust comparison can create a legacy baseline file | [listing fingerprint](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/engine/discovery.rs#L292), [trust migration](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/engine/plugin_trust.rs#L51) | Do not call this a side-effect-free listing with plugins enabled; migration avoidance here is proposed, not live-verified |
| Hook state merges only user/session preference layers; it does not enumerate declarations | [state rules](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/config_rules.rs#L10) | Preserve unrelated state; do not infer execution or provenance |
| config/read without cwd uses thread-agnostic config; layers can contain full config objects | [read service](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/config_manager_service.rs#L120), [protocol](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server-protocol/src/protocol/v2/config.rs#L389) | Explicit cwd, includeLayers=false; no raw exports retained |
| load_for_cwd applies current CLI overrides; policy refresh may involve host services | [config manager](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/config_manager.rs#L485) | Proposed inspection must use the intended process reductions; no network-isolation claim |
| Hook list returns per-cwd entries plus warnings/errors; handler metadata includes commands/paths | [protocol](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server-protocol/src/protocol/v2/plugin.rs#L53), [metadata](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server-protocol/src/protocol/v2/plugin.rs#L559) | Retain counts/categories only, never raw handler text or paths |

One guessed source path, `protocol/v2/catalog.rs`, returned404. Directory listings
resolved the actual definitions in plugin.rs; the missing file supplied no evidence.
No REA, system-tool repair, latest-release migration or installed-app patch was done.
Living docs are separate from pinned release behavior; current native binary version
and actual endpoint behavior were not refreshed through execution this stage.

## Proposed scope and protocol — data, not a command to run

Target: previously observed macOS CLI0.164.0, already-selected empty disposable
project, official app-server with --no-daemon. Reuse the existing32 reviewed
process-only reductions and selected candidate/MCP-disable entries as proposed data.
No persistent profile/global settings edit, extra host, session fork or app restart.
No hooks=false override, trust bypass, automatic approval or managed-policy change.
All required effective values must be confirmed, never silently normalized to pass.

The private argv and input hashes are exact observations, not execution permission.
The binary/candidate/config were hashed with the existing bounded selected-file
verifier; three selected files verified, including empty cwd identity. No executable
was invoked or credential/session store searched. Eight source35 runtime pins match.
Future native use requires freshness checks and review if any selected bytes change;
expected human model-picker changes must not be restored or treated as a new grant.

Proposed sequential requests (one outstanding request at a time):

| Order | Request | Condition/result |
| --- | --- | --- |
| 1 | initialize with fixed inspection client identity and experimentalApi=true; then initialized notification | No thread, model/catalog, auth or account request |
| 2 | config/read with includeLayers=false and explicit selected cwd | Confirm existing reductions, plugins=false and plugin_hooks=false; require informative hooks=true, typed metadata-only table, no extra MCP/remote board |
| 3 | configRequirements/read with empty params | Inspect only hook/feature-policy projections; conflict, unknown shape or hook-policy uncertainty stops. Never override requirements |
| 4 | hooks/list with cwds containing only that same selected cwd | Sent only after preceding checks pass; any error/warning/extra cwd or listed hook, even disabled/untrusted, means review-required |
| 5 | repeat the same explicit-cwd config/read | Compare narrow projections, not merely request success. Changed projection means stale/incomplete result |

This is five requests plus one initialized notification, **not a batch to send blindly**.
Do not call thread/start, turn/start, model/list, command/exec, fs APIs, config writes,
plugin/MCP/skill updates, trust/enable/disable or authentication operations.
Any server request receives at most a fixed typed denial/error and stops. Unknown
notifications, unexpected IDs/methods, malformed input, EOF or refusal stop; no retry.

The dormant source35 routing adapter currently requests config/read without cwd.
Any future activation must separately reconcile that context with selected-cwd
inspection and later thread config; do not claim this proposal fixes the adapter.
No production/runtime code changes are authorized by a proposal document.

## Access, retention, side effects and cost

The proposed diagnostic makes no model-generation request. It does not authorize
parent/child inference, model selection changes or routing. Normal official CLI
startup may read authentication/config/instructions, contact authentication/cloud
policy services, and write its usual logs/caches. Tool read-only permissions are
not an OS-level sandbox for this host process. No assertion of zero network traffic,
zero host writes or exact account/billing effects follows from the RPC allowlist.
These side effects require disclosure and separate native-run authorization.

Read responses can include sensitive configuration or requirements fields in
bounded process memory even with includeLayers=false. Do not print/save raw packets,
config/origin/layer values, instructions, commands, matchers, arguments, identifiers,
trust hashes, paths, environment, credentials, prompts, transcripts or session data.
Keep only fixed reason labels, projection-equality flags, counts and source/event/
trust-category totals, byte/message totals and owned-process cleanup status.
Existing scoped activity selection/retention is unchanged; no production journal.

Proposed limits:20 seconds work,25 seconds outer,5 seconds per request;1MiB combined
stdout/stderr,64KiB frame,128 messages,5 requests,1 cwd,256 hooks,128KiB outgoing.
Reserve2 seconds TERM and2 seconds KILL/reap for the owned process group. No shell
interpolation, retry, background task or native-child adoption. These are design
requirements, not a tested transport or hard real-time OS guarantee.

## Acceptance and outcome rules

Before a future authorized launch, a separately reviewed inspector must pass offline
synthetic transport/parser tests: exact request ordering and cwd; no forbidden method
from any result/error; plugin/feature/policy mismatch before listing; hooks disabled;
managed/disabled/untrusted hook entries; builtin-omission label; warnings/errors;
malformed/oversized/incomplete frames; unexpected requests/IDs/notifications;
timeout/cancel/EOF; process-group cleanup and no raw-value leakage. Tests must use
synthetic sensitive values and fixed peers, never real credentials or private chats.
Those inspector tests and the native inspection **have not been implemented/run**.

An informative empty list, matching projections, no warning/error and clean process
exit can establish only a bounded discovery observation for that process/cwd/time.
It cannot establish absence of hidden builtin/runtime hooks, atomic future stability,
a universal tool gate, live routing, permissions, model inheritance, usage or remote
cancellation. A nonempty list is review-required; never disable it to get a green
result. Missing visibility remains incomplete, not permanent impossibility.

Later routing acceptance still needs a separate source/activation review, exact
permission/access/usage/cancellation review, fresh human authorization for both
intended model tasks and runtime checks. No gate may open under this proposal.

## Verification actually performed this stage

- Current source35 hashes and protected-state preservation checked; installed31's
 251 cache files and approved settings/data/sources/marketplace still match. All
 trust/project fields included; expected human model-picker fields handled apart.
- Existing selected-file verifier hashed only three selected files and checked the
 empty disposable cwd. New35.1 proposal records current observations separately;
 old34 proposal/archive and source35 source-only manifest remain unchanged.
- Proposal structure/hashes and public documentation consistency checked offline;
 no native inspector transport exists. No new full test/CI/package run was needed
 for these documentation-only changes. Prior exact source35 results remain in
 [PACKAGE-DEV35](PACKAGE-DEV35.md) and [CI-DEV35](CI-DEV35.md).
- CI remains failed overall on the known Windows Image refusal; no Windows guard,
 assertion, policy or source changed. NativeWindows11/WSL remain unverified.

## Next step and removal

**GPT-6.1 Sol Medium** can verify the prepared proposal records and present the
bounded next-step decision. No native run or inspector/security implementation is
authorized. High is required before consequential native/transport/security work;
any native action additionally needs fresh human authorization after exact review.
Do not repeat completed source35 package/CI or the known trust-record classification.

Removing only the new ignored proposal folder discards these artifacts; referenced
inputs, old proposals, installed31 and unrelated files remain. No runtime rollback,
trust review or restart is needed now. Public records contain no machine paths,
private configuration values or raw logs. The full request remains incomplete.
