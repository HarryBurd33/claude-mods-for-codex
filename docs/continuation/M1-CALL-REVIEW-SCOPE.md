# Proposed next bounded scope: source-only optional call review

Historical scope: subsequently authorized by the human at ac0aec2 and implemented
with offline tests. See [M1-CALL-REVIEW-RESULT](M1-CALL-REVIEW-RESULT.md). The original
proposal below is retained as the contract; it grants no activation/native authority.

2026-10-26. Prepared on Sol Medium after the UI acceptance batch; **not authorized
or implemented by this document**. Completion-plan W1 EV-07/EV-10 and W4 EX-01.
Choose GPT-6.1 Sol High for the consequential composition/transport/security work.

## Objective and existing foundation

Convert the useful held-call proof into a reviewable, disabled-by-default production
component, without enabling it or changing installed31. This is one substantive
macOS integration milestone, not full-product completion or another generic client/
proof framework. Do not reimplement the JSON wording fix already present in source.

Saved source/evidence to reuse:
- proofs/hold.mjs: exact marker proof, required no-default confirmation, affirmative
  abstention, deny on invalid/decline/cancel/deadline/disconnect, known auto-review
  rejection and incomplete human-provenance warning.
- proofs/hold-server.mjs and src/mcp-stdio.mjs: existing form capability negotiation,
  matching requestHost/abort/deadline transport and async request handling.
- src/impact.mjs and src/impact-review.mjs: bounded deterministic impact categories,
  no raw command in returned assessment, no execution/approval/policy authority.
- src/dispatcher.mjs/config.mjs/mods and hooks/hooks.json: deny precedence, immutable
  inputs, exact rewrite/recheck and existing three command hooks.
- DEV29-REVIEW.md, ledger EV-07/EV-10/EX-01 and prior hold results: actual proof paths,
  MCP error/service failure may fail open at host, absence of human attestation.

Read the code as source. Never invoke prepare-hold, native probes/clients, install/
trust helpers or generators against a live config/cache. No raw session investigation.

## Authorized boundary to propose to the human

Source implementation and fixed offline tests inside this repository only, under a
future explicit grant. No target reads, new native session/model run, network,
installation, user/runtime config/trust change, guard activation or capture expansion.
Native ancestor/routing/Windows guards and consumed grant markers remain untouched.

Proposed edit envelope: dedicated src/hold-review.mjs; conditional source wiring in
src/server.mjs and strict default-off selection in src/runtime-settings.mjs if needed;
bounded test/hold-review.test.mjs and relevant transport/composition regressions;
inert example hook/config fragments and docs. Reuse src/mcp-stdio.mjs; change shared
transport only for a reproduced defect essential to this task, with regression proof.
Do not edit installed/cache copies, default hooks/hooks.json, .mcp.json, current
config/mods.json, Windows guards, ancestor policy, routing drivers or unrelated UI.
If safe wiring needs broader source/default changes, stop with one exact decision
rather than expanding scope silently.

## Resolve the contract before implementation

1. Keep the default three hooks and existing deny/rewrite behavior unchanged. An
   optional MCP review must never override another denial, disable a rule or cache
   a permission exception. Source-only optional registration must use a released,
   saved-evidence host mechanism; no invented enabled flag/hot reload.
2. State how matching and explanation relate to the effective post-rewrite command.
   Separate command/MCP hooks may run concurrently; do not imply cross-process
   atomic configuration or global ordering. Use a conservative refusal/restriction
   for unprovable combinations, not a misleading confirmation of different bytes.
   Do not disable current rewrite/deny configuration to make the new path work.
3. Confirmation returns abstention only, then normal host permission checks. Never
   emit allow/updatedPermissions/PermissionRequest approval or mutate arguments.
   Decline/cancel/invalid/no capability/transport error/deadline returns denial when
   the hook can answer. Process/service/host failures may still fail open; disclose
   that boundary rather than advertising complete risky-call enforcement.
4. Required explicit confirmation, no affirmative default. Reject the known
   auto-review marker; absence is not human attestation. Panel assessment/buttons
   have no pending-call authority; ordinary model-invoked MCP calls cannot mint
   persistent permissions or prove a particular pending native call.
5. Strict bounded data-only input and redacted impact text. No arbitrary JS/regex/
   shell callback, execution, target scan, secrets/session discovery, raw payload log
   or new model/API calls. Limit concurrent pending forms and one request per covered
   review; finite deadline at most the existing 30seconds, abort/correlation cleanup.
6. All policy/state selection remains explicitly reviewed and off by default.
   Hook application scope is not the logging project scope; disclose that distinction.
   No new metadata retention or changes to approved export/project/status selections.

If the saved released interface cannot meet the composition contract, retain the
existing deny/review alternative and produce one precise decision/limit. Do not ship
the proof under a production name, add a permissive approval carrier or build more
speculative peer machinery. No fresh upstream fetch under the network restriction.

## Concrete offline acceptance

- Default-off/nonmatching path: no elicitation, state/file/network/model action;
  default hooks/config/registration behavior byte-identical.
- Matching enabled path: bounded impact explanation/form, no raw secrets/arguments
  in results/diagnostics; acceptance is exactly abstention with normal permissions.
- Decline, cancel, false/missing/malformed confirmation, known auto-review, no form
  capability, thrown/disconnected transport and deadline: fixed denial where the
  handler replies; infrastructure limitations documented separately.
- Preserve original object, tool arguments, permission fields, existing denial and
  rewritten-command rechecks. Mixed/ambiguous composition must conservatively refuse
  or be explicitly unsupported by validated config; never approve the wrong command.
- Concurrent/out-of-order/late responses, abort before/during request, bounded pending
  count, one-response handling and disposal: no stale/cross-call authorization/leaks.
- Strict schema/size/accessor/prototype/UTF8 tests and synthetic sensitive-data
  sentinels. Command examples remain data; no destructive demo or native tool run.
- Fixed Node stdio peers may test transport, labelled offline; no Codex app-server,
  native startup, actual host elicitation, paid inference, download or deployment.
- Relevant tests plus existing regression suite/validate/replay as justified by
  actual changed source. Save runnable source and observed results, access/default
  diff, precise limitations and disabled opt-in documentation.

Exit: usable disabled source component with meaningful tests and reviewed constraints,
or a single concrete blocker with tested evidence. No installed/native claim, release,
packaging/CI rerun just for notes or automatic next action. Stop for Sol Medium once
only routine verification/packaging-review remains. Later native activation needs
its own candidate review, human trust, launch-validation decision and explicit usage
scope; both earlier target-read grants remain consumed.

## Copyable future authorization — not yet given

“I’ve switched to GPT-6.1 Sol High. Implement and offline-test the optional call-review
integration in docs/continuation/M1-CALL-REVIEW-SCOPE.md. Resolve the composition
contract first; preserve all existing defaults/guards and installed31. No target
reads, native execution, extra model runs, network, installation or live config/trust/
capture changes. Do not activate the component. Stop with one precise decision if
broader changes are needed; otherwise stop for Medium when implementation is verified.”
