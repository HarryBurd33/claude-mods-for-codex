# Native routing admission review — 2026-10-25

Sol High resumed verified737c27c. **Live admission remains closed; no inference.**
Installed31, approved settings, logging scope, parent model, human trust and Windows
guards are unchanged. Source33 stays uninstalled; this is a research/decision
checkpoint, not source34 or a new plugin package. Full93 remains incomplete.

## Decision

The proposed strict first trial cannot currently be admitted through the inspected
public CLI0.164.0 app-server surface. It requires a pre-execution rule allowing
only one exact named-role spawn and bounded waits, denying every other parent or
child action. No supported public control establishing that complete rule was
found. Do not turn config echoes, after-start notifications or instructions into
that guarantee. This conclusion concerns this test boundary/version/interface;
it does not establish that native routing is impossible or absent.

A real startup tool allowlist exists in the released Rust embedding API. It is
not a plugin capability, a CLI config key or a public thread/turn option found in
this review. Using it through a newly compiled host would be an embedding/custom
host direction requiring separate agreement. Even a tool-name allowlist alone
would not enforce exact spawn arguments, one total child, or all descendant rules.
No installed app was patched; no custom host or native adapter was built.

## Primary evidence: CLI0.164.0

Pinned release commit `6aaac694803004a63c6f393d153c96d22521a6b9`, retrieved
2026-10-25. These are source observations, not live tool-execution tests.

| Control | Actual boundary and gap | Primary source |
| --- | --- | --- |
| ToolPolicy.allowed_tools | Startup ceiling filters trusted/external registry entries and hosted specifications. Default is unrestricted ordinary selection; host supplies it through ExtensionDataInit. Exact argument/total-call limits are separate. | [ToolPolicy](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/ext/extension-api/src/tool_policy.rs), [session capture](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/session/session.rs#L1041), [registry filtering](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/registry.rs#L422) |
| Public thread/turn controls | Inspected ThreadStartParams/TurnStartParams expose config, sandbox/permissions and dynamic-tool additions; no generic tool allowlist/admission callback. Dynamic tools add host tools; they do not replace native tools. Config schema has no public ToolPolicy key. | [thread](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server-protocol/src/protocol/v2/thread.rs#L62), [turn](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server-protocol/src/protocol/v2/turn.rs#L170), [config schema](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/config.schema.json), [native extension assembly](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/app-server/src/extensions.rs#L52) |
| Shell, web, app/plugin and MCP reductions | ShellTool false prevents shell registration; web disabled omits the hosted search spec. App/plugin/MCP enablement and per-server/tool policy have their own scope. An empty override table is not evidence that inherited servers disappeared. None is a universal native tool/argument gate. | [tool plan](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/spec_plan.rs#L1234), [hosted web](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/hosted_spec.rs#L14), [schema](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/config.schema.json) |
| Native core tools | Model-supported apply_patch registration is independent of ShellTool; other utilities have distinct selection conditions. Removing shell is not equivalent to removing file/tool access. | [core selection](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/spec_plan.rs#L1288), [apply_patch](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/spec_plan.rs#L1409) |
| Code-mode namespace exclusions | Excludes names only from the nested code-mode surface. Direct/deferred/native registration remains a separate question; this setting is not a general all-tools deny rule. | [nested exclusion](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/spec_plan.rs#L877), [CodeModeConfigToml](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/config.schema.json#L597) |
| Collaboration bounds | V1 uses max_depth; V2 ignores that V1 depth setting. V2 native selection also includes interrupt/list and, unless disabled, send/followup. Concurrency is not one total spawn or an inference-request cap. | [V1 depth/V2 selection](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/spec_plan.rs#L729), [native registrations](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/spec_plan.rs#L1440), [AgentsToml schema](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/config.schema.json#L46) |
| Hooks and dispatch | Successful deny can block a covered call. A hook error leaves should_block false; serialization failure also continues. Registry dispatch calls the handler after covered hooks; there is no general external client request before every tool action. | [hook error](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/events/pre_tool_use.rs#L195), [serialization](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/events/pre_tool_use.rs#L313), [dispatch](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/registry.rs#L702) |
| Child permissions | Child configuration copies runtime approval/reviewer/cwd and permission-profile snapshot after role layering. This is source corroboration, not empirical descendant security acceptance. No claim that role instructions sandbox the child. | [child runtime overrides](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/agent/child_config.rs#L175) |

Current official [app-server documentation](https://learn.chatgpt.com/docs/app-server),
[configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference)
and [approval/security documentation](https://learn.chatgpt.com/docs/agent-approvals-security)
were retrieved, not merely search results. They document configuration/approval
controls, including reads/commands within read-only sandboxes. They do not establish
the proposed exact spawn/wait-only enforcement boundary. Living docs and pinned
release source are distinct evidence; no claim that a newer proposal shipped here.

## Harmless native check actually run

On macOS14.6, standalone `codex --version` returned **codex-cli0.164.0**.
A private fixed Python driver launched that official binary with `--no-daemon`,
child-process-only restrictive CLI overrides and `app-server`. It allowed only
initialize/initialized/config-read, refused any server request, bounded20seconds/
1MiB/256messages, discarded stderr and reaped its own process. No thread/start,
turn/start, model/list, tool execution, native profile install or inference.

The sandboxed attempt exited before initialization. The same bounded no-turn check
then completed with filesystem escalation, not an inference grant:4messages,
36,752outputbytes, own process reaped. Ten selected restrictive values matched
the exported config (shell/apps/plugins/memories/memory-tool/permission-request/
view-image off, web disabled, V1 depth1, concurrency1). Two attempted keys were
**not confirmed by config/read**: root code_mode.enabled and tools.update_plan.enabled.
Do not reuse those attempts as verified controls. The documented code-mode toggle
is under features; no further native retries were made to turn echoes into proof.
No echo establishes actual tool selection or admission. Runtime enforcement and
native route/usage/cancellation remain unverified. The prepared installed31
preservation helper passed before/after:251cachefiles/config/trust/settings/data/
sources/marketplace unchanged. Raw config was not persisted or printed.

The first batched retrieval stopped on tools/spec.rs HTTP404; other uncompleted
requests in that batch are not individually claimed as retrieved/reviewed or404.
Subsequent observed404s included obsolete extension-api/src, thread_start.rs,
session/services.rs and hooks/src/hooks.rs. Directory listings resolved the actual
split paths; unavailable/uncompleted pages did not supply evidence. No REA, tool repair,
installed-app inspection/patch, Windows proof loop or additional model call.

## Concrete alternative for human design review — not approved or runnable

Keep the same intended marker task, explicit configured role, proposed Sol Low
parent and Luna Low child, no current-chat history, empty disposable project and
no automatic retries. Use the official CLI app-server with ordinary read-only
permissions and human approval reviewer. Request only one child and necessary
waits in instructions, but explicitly report this as intended behavior rather
than a pre-execution guarantee of exact actions or total paid calls.

Before any live adapter/run, review the exact process-only reductions for shell,
web, apps/plugins, explicit MCP servers, memory/skills and other optional features.
Do not change global config or installed31. Recheck native inherited settings and
refuse the trial if required reductions cannot be confirmed. Do not claim that
this removes every native core/child-management tool. Keep synthetic-only driver
and native adapter separate; the existing liveAdmission function stays closed.

Residual access must be accepted explicitly: read-only is not “no reads.” Remaining
native tools can attempt reads of files permitted by the host profile, while
covered writes/network/escalations retain normal host enforcement. Instructions
asking for no files/tools do not remove that capability. No prompts/transcripts/
credentials are collected by this project; environment/authentication consumed by
the official client has its normal access. A separate new restrictive filesystem
profile or custom host is not silently included in this alternative.

Any approval/input/permission/authentication/elicitation request is declined with
a typed response and the trial stops; unknown requests error/stop. Unexpected tool
or child activity triggers interrupt/cleanup **after observation** and fails the
trial; an unexpected action may already have run. Runtime/deadline/output/usage
fuses bound observation and cleanup, not exact billing/remote cancellation. Keep
90second work/120second outer/2MiB512message/50,000reported-token observational
limits from the original plan, subject to implementation review. Missing child
usage remains unavailable. No exact cost cap, universal gate or guaranteed remote
cancellation is claimed.

Two distinct human decisions remain:

1. **Design scope:** accept this ordinary-permissions alternative, or retain the
   strict proposal and leave native routing blocked while completing other macOS
   requirements. Agreement only permits preparing the revised plan/adapter.
2. **Execution later:** after exact runnable source/config/candidate hashes,
   models/access/usage/cancellation/removal are reviewable, request a separate
   fresh bounded inference grant. Design agreement or “continue” is not that grant.

No user decision has been recorded yet. Do not build or execute the revised live
adapter while that scope decision is pending. The unchanged source33 dry driver
can still be used offline; re-running it is not progress on this native question.

## Next work

Medium can verify these source citations/notes and record the human design choice
without changing runtime/package/install/logging/trust. If ordinary permissions
are accepted, stop for High before implementing the separate native adapter and
review artifacts; keep inference disabled. If strict scope is retained, mark the
native acceptance blocked at this specific boundary and choose a concrete other
macOS acceptance task from the93-row ledger. Do not repeatedly research the same
gap, rebuild a mock-only substitute or repackage unchanged source33.
