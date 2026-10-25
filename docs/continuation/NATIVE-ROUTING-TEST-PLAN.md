# Native configured-agent test plan — 2026-10-25

**Prepared, not authorized or run.** High resumed e462903. Installed31, selected
chat model, logging scope, trust, settings and Windows guards remain unchanged.
This plan covers a temporary driver for the official CLI app-server, not a new
product client, plugin agent discovery or interception of this chat's model.

## Proposed first trial

| Item | Proposed value |
| --- | --- |
| Official target | Standalone Codex CLI0.164.0 on this macOS host |
| Additional orchestrator | One new ephemeral task, GPT-6.1 Sol (`gpt-6.1-sol`), **Low** |
| Configured child | One intended child, GPT-6 Luna (`gpt-6-luna`), **Low** |
| Role | `mods-native-route-check` |
| Child history | V2 `fork_turns:"none"`; V1 `fork_context:false` |
| Role selection | Native `agent_type`, with model/effort omitted from spawn arguments so the profile is tested |
| Native profile mechanism | Explicit child-process-only `agents.mods-native-route-check.config_file` reference to an inert candidate |
| Filesystem/approval | Proposed parent read-only sandbox, on-request approval, human reviewer; no automatic approval |
| Task | Child returns a fixed synthetic marker; parent returns that result unchanged |
| Extra turns/retries | None; no follow-up, resume-agent or automatic retry |
| Current chat | Remains on the human-selected model; no history fork from this chat |

The native catalog was read using only initialize/model-list: both proposed models
advertised Low, with no thread/start or turn/start. This is catalog availability,
not proof of inference access or compatibility. No fallback is authorized. Both
orchestration and child work consume additional usage if separately authorized.

The first trial uses an explicit native configuration reference, avoiding a
permanent installation. It **does not verify project-directory auto-discovery**.
That remains a separate required phase, not silently satisfied by this route.

## Review artifacts already prepared

A new private source32 bundle contains an unselected `kind:agent` declaration,
access/review/plan, synthetic fixture and `agent-candidate.toml.txt`. Its five fields:

```toml
name = "mods-native-route-check"
description = "Synthetic routing acceptance role; no project access is needed."
developer_instructions = "Reply with exactly MODS_NATIVE_ROUTING_CHILD_OK. Do not use tools, read files, access the network, spawn another agent, or request permissions. This is a synthetic routing test."
model = "gpt-6-luna"
model_reasoning_effort = "low"
```

An empty private disposable project was prepared outside the existing selected
capture root. No `.codex/agents` directory or discoverable `.toml` was created;
no profile/configuration reference was installed. Existing CLI scaffold/validate/
static replay and independent TOML round-trip passed. The inert candidate SHA256:
`f17550c7ea7a60b055f63fd907341207f0c5d3877be798d643f26962fcf5e022`.
Machine paths and PLAN.json remain only in ignored local evidence/root handoff.

The instructions express the task, **not a sandbox**. Parent/host capabilities
remain authoritative. Selecting an empty cwd alone does not confine reads there.

Exact proposed parent request (the expected marker is deliberately absent):

```text
Perform only this synthetic routing check. Spawn exactly one agent using native
agent_type "mods-native-route-check"; use task_name "routing-check" if required.
For V2 set fork_turns to "none"; for V1 set fork_context to false. Do not set
model or reasoning_effort in the spawn arguments: the named role must select them.
Send the child exactly: "Return only the fixed response specified by your configured
role. Use no tools." Do not read files, run commands, use MCP, skills or web tools,
or create any other agents. Wait for that child's completion and return its response
verbatim. If named role selection is unavailable, stop with ROUTING_UNAVAILABLE;
do not substitute another role/model or retry.
```

Proposed thread/start payload for the isolated test process, **not sent**:

```json
{
  "model": "gpt-6.1-sol",
  "ephemeral": true,
  "sandbox": "read-only",
  "approvalPolicy": "on-request",
  "approvalsReviewer": "user",
  "allowProviderModelFallback": false,
  "experimentalRawEvents": false,
  "cwd": "REVIEWED_DISPOSABLE_PROJECT"
}
```

Only after all gates and a fresh grant would one turn/start target the returned own
parent id with the exact text above, model gpt-6.1-sol and effort low. Child-only
CLI overrides would reference the reviewed candidate and set parent effort low,
verified concurrency/depth limits and verified capability reductions. The final
driver command/override list remains blocked on the admission review below; this
payload alone is **not** a runnable approved test or a way around that review.

## Execution gates — all pending

1. Implement and review the bounded test driver **without running inference**.
   Dry-test it against synthetic protocol streams, including refusal/timeout/
   cancellation/output overflow/malformed events. No product launcher is requested.
2. Verify non-collaboration tool admission before permitting a model turn. Proposed
   process-only feature reductions remove shell/apps/plugins/memory/permission-request
   capabilities; explicitly configured MCP tools also need separate exclusion.
   Check actual released semantics and available controls, not config echo alone.
   Read-only policy blocks covered writes, but does not by itself exclude reads or
   trusted MCP/network actions. Do not promise tool confinement from instructions.
3. The driver must fail closed if the required native role selection, tool admission,
   sandbox/reviewer or observation/cancellation controls cannot be established.
   An item-start notification may follow execution admission: observing then
   interrupting an unexpected tool is **not** a pre-execution policy gate.
4. Inspect collisions/precedence for the proposed role reference and selected test
   project; no existing role, global default, other plugin or trust entry may change.
   Keep the new reference child-process-only and preserve its exact reviewed hash.
   Make a separate selected review intent only after explicit selection; preserve
   the disabled base. That boolean is not an execution grant or native enabled flag.
5. Prepare the exact runtime command, parent text and response/cleanup behavior,
   then obtain **fresh explicit human authorization** covering both new tasks and
   the stated access/usage limits. No earlier grant or a plain “continue” supplies it.
   Protected host trust/authentication/review remains human-controlled.

There is currently no live driver and no execution grant. Do not request approval
for an improvised run before these gates and its review artifacts are complete.

## Proposed bounds and stop behavior

- One intended parent task and one intended child. At most one concurrent child
  and one child depth, using verified native process-only limits. Concurrency is
  not a total-spawn or total-inference-request limit; do not describe it as one.
- Model-work deadline90seconds; total driver lifetime120seconds, including preflight
  and cleanup. Individual protocol requests10seconds, bounded by the outer deadline.
- Combined stdout/stderr2MiB,512messages; retain only fixed synthetic-result flags,
  configuration metadata, counters and sanitized failure labels. No raw prompt,
  reasoning, transcript, arbitrary tool arguments, paths or stderr persistence.
- Stop if reported combined parent/child total tokens exceed50,000. This is a
  **lagging observational fuse**, not an admission limit, exact cost cap or bill.
  Missing child usage is unavailable, never zero; do not substitute parent usage.
- No shell, project file, patch, web, MCP, skill, environment/credential discovery,
  permission-change or additional-agent action is authorized by the marker trial.
  Only native spawn and necessary wait operations are intended; any additional
  observed action, spawn, model reroute or unexpected thread fails the trial.
- Client-originated calls restricted to reviewed initialize/model/config reads,
  one ephemeral thread/start, one turn/start, exact owned-child metadata reads and
  interrupt/unsubscribe cleanup. No listing unrelated sessions, broad thread reads,
  settings writes, thread resume/steer, injected history, shell commands or internal
  raw Responses events. `experimentalRawEvents` stays false.
- Any server request for approval, input, permissions, authentication or elicitation
  is declined through its typed supported response, then the trial stops. Unknown
  requests receive an error followed by stop; no approval, auto-review or retry.
- On stop: interrupt known active owned turns, confirm terminal states where
  available, unsubscribe, close transport, terminate/reap only the owned CLI process
  group with bounded escalation. Do not kill the user's desktop/client processes.
  Missing child visibility/cancel acknowledgment is a reported failure. Process
  termination does not guarantee remote inference cancellation or exact billing.

The parent request will name the role and request exactly one child with no history,
without passing the expected marker or model/effort as child spawn overrides. The
child message asks it to use its profile's fixed response. No current chat context
or private session is supplied. A verbatim child reply supports instruction loading;
host metadata, not that reply, must establish the configured child selection.

## Evidence acceptance and negative cases

| Check | Required observation | Insufficient evidence |
| --- | --- | --- |
| Parent selection | Own thread/start response matches explicit model/effort, ephemeral state and proposed sandbox/reviewer | Current chat picker, config echo or model self-report |
| V1 child selection | Parent item/completed collabAgentToolCall: spawnAgent/completed, one receiver, resolved model/effort match | item/started, which contains requested values |
| V2 child selection | Parent item/completed subAgentActivity: kind started, owned child id, resolved model/effort match | Waiting for a V1 collab item that V2 may not emit publicly |
| Identity/role | Correlate owned child metadata/source to own parent and exact role where exposed; never enumerate other sessions | A marker alone or an unrelated thread with matching model |
| History | Explicit V2 none or V1 false; verify exposed metadata/source behavior where possible | Omitting V2 fork_turns: its default is all |
| Response/completion | Fixed marker, child and parent completion with no unplanned actions, no retries | Parent saying an agent ran successfully |
| Usage | Separate reported counters with identity correlation and unavailable handling | Assuming missing child usage is zero or asserting exact cost |
| Permission inheritance | First trial records parent constraints and source corroboration; empirical child-boundary test remains separate | Claiming a successful marker proves blocked writes/network or all inherited permissions |
| Reroute/error/metadata gap | Stop and mark partial/failed/unverified; preserve fixed evidence | Silently substituting a model or enabling internal/raw telemetry |

Resolved model/effort at child creation is configured-selection evidence, not proof
of a particular backend execution/billing identity. Public thread metadata likewise
describes configured state, not per-turn execution telemetry. Model-rerouted events
must be watched; absent events do not establish an unavailable backend guarantee.

Before a paid trial, synthetic tests must exercise both event families; requested-only
metadata; duplicates/conflicting child IDs; wrong models/efforts/roles/parent; missing
metadata/usage; malformed input; extra actions; decline/cancel; all deadline/size
limits; disconnect and cleanup. No synthetic replay establishes native behavior.

## Separate required follow-ups

After the marker route is verified, keep project/user directory discovery, safe
installation/update/disable/removal/restoration, empirical permission rejection,
cancellation/failure handling and desktop presentation in scope. Each needs its
own exact safe plan/authorization where it invokes models or changes configuration.
Do not execute a destructive command for any proof. Windows native acceptance and
existing guards/bounds/image gaps remain unchanged; macOS remains first.

## Primary evidence and work actually performed

Retrieved official [subagent guidance](https://learn.chatgpt.com/docs/agent-configuration/subagents)
and [app-server protocol](https://learn.chatgpt.com/docs/app-server). Read released
CLI0.164.0 source `6aaac694803004a63c6f393d153c96d22521a6b9`:
[V1 spawn](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/handlers/multi_agents/spawn.rs),
[V2 spawn](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/handlers/multi_agents_v2/spawn.rs),
[tool specifications](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/tools/handlers/multi_agents_spec.rs),
[child creation](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/agent/control/spawn.rs),
plus handler/common/control modules and prior pinned role/child config evidence.
Generated schema confirms public subAgentActivity fields and model/effort metadata
limits; source confirms the differing notification paths. No private API is proposed.

Actual no-inference native catalog check: initialize, initialized notification,
model/list (25sec/1MiB/256messages, server requests refused, process group reaped).
Both named models advertised Low, pagination complete; **zero thread/turn starts**.
Static source32 bundle/validation/replay/TOML checks passed; registered/installed
false. Prepared installed31 preservation checker passed before/after. No native
child run, model call, profile install, shared config, logging/trust/Windows change.

Next work still warrants **Sol High** for admission/cancellation/driver contracts.
Switch to Medium when those decisions and implementation are resolved and only
routine verification remains. This plan is not execution authorization or product
completion; no extra inference is currently authorized.
