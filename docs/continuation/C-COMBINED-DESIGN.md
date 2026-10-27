# Combined C trust and no-mutation design — conditional, not admitted

2026-10-26, GPT-6.1 Sol High from6e83d09. Saved evidence/source review only under
[C-DESIGN-SCOPE](C-DESIGN-SCOPE.md). **Design complete; no native profile admitted.**
Installed31/product guards are preserved; dev39 remains disabled/uninstalled.

## Decision and the one remaining admission blocker

The human accepted weaker installation-identity assurance for design preparation:
a proposed manual trial may trust the user-managed official CLI/Node installation.
It need not certify every ancestor as non-writable. This is an explicit change to
that future trial's validation assumption, not a successful preflight or new binary
identity observation. The private checker, old failed evidence, both consumed grants
and all actual execution/read/routing gates stay unchanged.

**Blocker NM-1: no reviewed supported deployment presently establishes a complete,
stable, non-mutating effective covered-hook set while preserving installed31.**
The accepted installation-trust assumption does not supply that missing fact.
An isolated project, separate service/config and exact package digest can bind our
owned components; they cannot exclude inherited handlers or certify final host input.
No claim of permanent Codex impossibility follows. This is a conditional deployment
prerequisite, not a newly demonstrated product bug or permission to remove safeguards.

The design below is one candidate profile, Q39, with explicit conditions. It is not
a configured environment, executable plan, supported isolation flag or native result.
No active paths, hook declaration, settings file, server connection or runner was made.

## Evidence and confidence

Primary-source references below were previously retrieved, then reread from saved
copies. Six selected cached Rust files match their prior retrieval digests. Reviewed
source is pinned CLI0.164 commit6aaac694803004a63c6f393d153c96d22521a6b9, as recorded
2026-10-25/26; this is not a claim about the currently installed client/version.
No web retrieval, current target/config/trust inventory or new runtime test occurred.

| Finding | Evidence and confidence | Limit |
| --- | --- | --- |
| Hook discovery combines sources | [Discovery](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/engine/discovery.rs#L105) appends managed requirements, config-layer JSON/TOML hooks and plugin hook sources. Layer-source mapping includes system/user/project/session and managed origins. Source-corroborated. | A project declaration does not replace the effective hook set. No current effective set observed. |
| Hook state differs from discovery | [Config rules](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/config_rules.rs#L8) takes enablement/trust preferences from user/session layers, merging fields; [discovery](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/engine/discovery.rs#L912) keeps builtin/managed hooks enabled. Source-corroborated. | Empty project config or a per-hook override is not a universal exclusion. This design does not use overrides to disable installed31/unrelated hooks or change managed policy. |
| Listing is not a durable execution certificate | [Discovery](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/engine/discovery.rs#L280) handles listing/plugin content hashes; [plugin trust](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/engine/plugin_trust.rs#L28) verifies plugin contents at execution. Source-corroborated. | Config-command declarations and plugin bundle verification have different coverage. Referenced executables/config and later changes still need review. Trust verifies identity, not non-mutation semantics; legacy verification may write migration state. |
| Another handler can supply final arguments | [PreToolUse](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/events/pre_tool_use.rs#L74) selects covered handlers and resolves competing input updates by completion order; [registry](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/registry.rs#L702) applies the resulting updated input before dispatch. Source-corroborated. | A successful review returning{} cannot veto an update returned by another handler. Display/config order is not a serial argument-integrity guarantee. |
| Candidate protection is local to its selected policy | src/hold-review.mjs validates unchanged-only settings, runs existing guards, rejects every enabled exactCommandRewrite in its selected config, rechecks that config after confirmation and returns only{} or deny. Current source review; prior offline tests remain historical. | It neither enumerates the effective host hook set nor sees final invocation arguments. Stable before/after policy snapshots do not detect every transient change or lock other processes. |
| Project/session attribution is absent from review carrier | examples/hooks/call-review.json forwards only event/tool/input; src/server.mjs accepts exactly that envelope for mods.review_call. Current source review. | Dashboard projectRoot scopes data reads, not reception of review calls. A fabricated model invocation is not proof of a native pending call. |
| Ordinary startup is not isolated or write-free | [DEV37 startup review](DEV37-REVIEW.md) records plugin refresh/upgrade/catalog and remote-control/local-state behavior in pinned source. Previously retrieved findings, not reexecuted here. | A new client/connection name does not exclude remote ingress or shared-state effects. No public process-local exclusion established in that record; internal markers are not a workaround. |

Only needed source sections were reviewed; no complete upstream audit or latest-release
claim. Earlier unavailable source leads are not newly retrieved or treated as evidence.

## Q39 — one conditional profile and its invariants

Q39 uses an official standalone macOS CLI in one disposable project P, with a distinct
reviewed dev39 service connection R and an immutable candidate source S39 from
[PACKAGE-DEV39](PACKAGE-DEV39.md), exact sourceefccbaa. Installed31 retains its original
connection/source/settings/trust. R must actually load dev39 and expose the enabled
review tool; installed31's saved eight-tool connection cannot substitute for it.
No service is currently enabled. A future settings selection is separate from archive
provenance and human trust, and requires explicit setup approval.

| Invariant | What must be established before admission | Current finding |
| --- | --- | --- |
| Installation trust | Human operates the selected official CLI/Node under accepted C assurance; record version/identity evidence within its actual limits. No certified ancestor chain or inherited checker pass. | C design assumption accepted; current identities unobserved. |
| Full covered-hook accounting | Account for managed requirements, all effective config layers, JSON/TOML/plugin sources, builtin handlers, canonical tool names/aliases, enabled/trust states and referenced code/config for the exact client/cwd/turn context. Every handler that can affect a covered call must be non-mutating. Unavailable/unknown/warning => stop. | NM-1 unresolved; saved evidence supplies discovery semantics, not a current complete inventory. |
| Non-mutation and scope | For the covered PreToolUse path, no reachable handler returns input/permission replacements or otherwise changes the executed command. A handler may be excluded only by established host applicability/semantics, not an assumption from its name or one successful sample. | No such effective-profile proof. Saved installed31 rewrite acceptance cannot be assumed removed or non-applicable in a new session. |
| Owned policy binding | Owned trial dispatcher, if included, and R select the same reviewed absolute policy C39 and immutable source; R uses reviewed private settings separate from31. Code reads these selections explicitly. No relative-path equality assumption. | Source contract established; no concrete paths/settings/host binding selected. |
| No inherited policy override | Any per-process binding affects only the new owned processes. Do not export trial CODEX_MODS_CONFIG/PLUGIN_ROOT/settings into the whole host to redirect inherited installed31 hooks. Other applicable handlers retain their original policies and must separately satisfy the invariant. | No supported current deployment reviewed. A new shared C39 cannot turn C31 or other sources into C39. |
| Host application boundary | Supported host declaration limits the new registration to P as reviewed; account for descendant/other-session applicability. Carrier has no trusted cwd/session, so backend settings cannot enforce that boundary. | Project-local design is corroborated, exact later scope/host behavior unverified. No one-session guarantee. |
| Stable reviewed source and state | No concurrent participating edits, hook/plugin changes or unreviewed updates during the trial. Human reviews referenced source/config/runtime in addition to declaration. Revalidate on known changes; terminate unknown outcomes. | Operational review condition only, not an atomic host lock or hostile-same-user security boundary. |
| Original31 preservation | New setup/startup must not replace31 or change its rules/logging/trust/preferences. A before/after digest is detection, not prevention; if ordinary refresh could change31, supported preservation must be resolved before setup. | Normal-startup residual effects remain; no guaranteed rollback of auth/catalog/trust migration. |
| Normal permissions and provenance | Ordinary read-only/on-request model permissions and native checks remain. Human checks actual pending command independently and submits the required confirmation personally. | Product returns abstention, not permission. Auto-review marker rejection is not universal human authentication. |

The conservative covered-path condition is retained: a planned harmless string alone
is not a general no-mutation profile, since an instruction to issue only that string
is not an enforced native argument gate. This does not assert that every hook capable
of mutation is always applicable. Exclusion requires actual supported applicability
and semantic evidence. No global disable, rewrite change, hooks.state override,
managed-policy change, alternate CODEX_HOME/auth copy, app patch or custom client is
proposed to manufacture absence. Newly suggested host isolation would need primary
support and separate explicit authorization; it is not supplied by this design.

Q39 is therefore **not admitted**. The smallest missing fact is the complete stable
effective covered-hook profile satisfying NM-1 under original31 preservation. More
ancestor metadata cannot establish it. A blank config, clean project, tool listing,
matching candidate digest or direct synthetic MCP call cannot establish it either.
A later profile could qualify if its supported configuration/applicability is actually
reviewed; saved evidence here neither establishes one nor rules out every possible one.

## Separate tracks and practical alternatives

| Track | Useful result | What remains incomplete |
| --- | --- | --- |
| Existing local impact/deny workflow | Already implemented lexical assessment/deny guidance; no pending-call authority or automatic permission grant. No new activation needed. | Does not complete dev39 native held-call acceptance. Maintain target/shell/host-fail-open limitations. |
| Existing Stop-only project-hook proposal | One independently authorized harmless response could establish selected Stop delivery/time/event metadata in its stated official CLI. Reuse [STOP-ONLY-PROPOSAL](STOP-ONLY-PROPOSAL.md) and [NORMAL-STARTUP-PLAN](NORMAL-STARTUP-PLAN.md); C removes the ancestor-certification assumption for that future design. | Not dev39/no-mutation/routing acceptance. Inherited hooks/startup can still have effects; normal startup/code/trust/usage/setup approval remains necessary. Prompted no-tools is not enforced isolation. |
| Q39 pending-call trial | Conditional native confirmation/decline/cancel/deadline/default-off and permission behavior after NM-1 admission. | No current profile, service setup, trust, form or execution verification. Existing hold0.0.4 evidence does not verify this candidate. |
| Configured-agent routing | Separate scoped integration with explicit child model/effort and observed inherited permissions. | Neither Stop delivery nor a form verifies routing or changes the parent model. Existing routing gates stay closed. |

Recommendation: keep Q39 disabled. Use existing impact/deny guidance now; a future
Stop-only campaign is the narrower native milestone available for consideration.
Do not turn it into full held-call acceptance, rerun ambiguous cases, or repeat an
unchanged records-review/probe sequence. Full native/Windows work stays in scope.

## Later approval envelope — requirements only, not authority or commands

These phases deliberately contain no executable argv, active config or implementation.
No phase is authorized now. Human design C/manual supervision need not be accepted again.

1. **Choose one milestone.** Stop-only and Q39 have distinct acceptance. For Q39,
   require NM-1 first. Do not start the service or produce a form to discover whether
   its missing precondition might hold. If no complete current profile can be reviewed,
   stop once with that blocker; do not disable unrelated hooks as an automatic repair.
2. **One combined future review scope if selected.** Specify exact official entry/P/
   source/settings/config and required effective-hook/source coverage, bounded reads,
   minimal fixed classifications and handling of unknowns. Reuse supported host review,
   not a new permissive reader. Live /hooks or app-server inventory itself starts a
   native client and may cause normal auth/catalog/network/state effects; it needs
   that explicit scope. No old grant reuse or credential/transcript discovery. Current
   no-target/no-native/no-network restrictions permit none of those actions.
3. **Owned setup scope.** Only after an admissible profile: one private disposable P,
   immutable reviewed source, sibling private policy/settings/data and distinct owned
   registration/connection as applicable. No inherited environment redirect,31 update,
   broad capture, exports/diffs, raw sessions or unrelated entries touched. Private
   process authority is the OS account, not model sandbox confinement. Server's other
   project/dashboard tools are part of its access review, despite readOnly annotations.
4. **Separate human trust.** Review exact declaration plus referenced code/config/Node
   and ordinary startup residuals. Do not copy31/proof trust, auto-approve generated
   code or bypass content invalidation. Missing service/unknown scope/capability or
   modified content blocks the campaign. Plugin bundle checks and config-declaration
   trust have different coverage; a digest alone is not semantic or human approval.
5. **One separately authorized usage-consuming case.** Human-supervised harmless data
   print/response only, parent model/preferences unchanged, no auto approval/continuation.
   Review must match actual pending native call; returned{} cannot approve it. The
   existing90second manual stop target is not a hard deadline/output/request/billing cap.
   Form's configured30second logical deadline is not a host/process lifetime guarantee.
   The later grant must identify the additional task model/effort explicitly. Unexpected
   tools/agents/approvals/repeated forms/continuation/remote activity mean stop; that
   cannot undo reads or effects already permitted by the host. Additional cases each
   need their own scope/usage grant; no retry after blocked,
   ambiguous, declined/cancelled or unknown outcome. No destructive command demonstration.
6. **Observe only what was authorized.** Fixed marker, native delivery/form/response and
   normal permission behavior, minimal outcome/time metadata; no raw command/protocol/
   transcript/config/credential logs. Distinguish actual Decline, Cancel, untouched
   deadline and host cancellation. Shared-project counts do not imply one producer,
   unique executions or a complete turn. Missing service/crash/serialization/host errors
   can fail open even though our service returns fixed denials when it answers.
7. **Close and remove only owned unchanged artifacts.** End owned work first, then
   compare exact registration/source bytes and disable/remove only matching owned
   additions; preserve unknown/changed files for review. Verify the later host state
   separately; a loaded service may outlive removal. Do not restore shared config,
   copy/delete trust, steal locks or clean31 data. Auth/catalog/remote effects may be
   irreversible; cleanup is not guaranteed remote/descendant cancellation. Retention/
   deletion of minimal trial evidence is separately explicit and scoped.

## Verification, acceptance effect and next model

This stage checked six cached primary-source digests and six repository source/example
pins, prior protected defaults/evidence, closed consumed grants and unchanged93-ID
mapping. Documents/links/changed-file boundaries were reviewed; no Node-peer/test/npm/
package run, target refresh, native/UI/server/model/API/worker call, network, installation
or live config/trust change. Current-chat model usage applies. No source defect/fix,
new client/OS/build inventory, fresh release/source retrieval or runtime acceptance.

C's design decision is accounted for without weakening product/no-mutation guards.
No capability status/count/native checkmark changes follow. NM-1 remains an explicit
incomplete deployment condition. Earlier failed preflight and source39/native evidence
retain their dates and limits; new design receipts do not repin old seals.

**High design/review complete. Next GPT-6.1 Sol Medium** may verify these exact design
records and present the consolidated future milestone/access choice once. No repeated
C vote, changed policy, target reads, setup or execution follows. No additional source
investigation absent new evidence or an explicitly changed task. Checkpoint locally;
GitHub upload/remote verification remain prohibited by current no-network scope.
