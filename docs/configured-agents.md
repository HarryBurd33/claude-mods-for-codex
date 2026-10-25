# Author an explicit native agent candidate — source32

Source **0.2.0-dev.32** extends the private component CLI with `kind: agent`.
It generates a candidate for separately reviewed native project/user configuration.
Plugin installation does not install an agent. Installed31 is unchanged and its
CLI/skill does not implement this kind. Use the verified source32 CLI below.

This is a NEW configured child, not interception of this chat's model or prompt.
Authoring and static replay make no model/network call. Describing through a skill
uses the selected model. Invoking a native child consumes additional usage, needs
separate explicit bounded authorization, and remains unverified here.

## Describe, scaffold and inspect

Choose the child model and effort explicitly. This synthetic example is for static
testing only; `synthetic-model` is not a usable model recommendation:

```json
{
  "name": "reviewer",
  "kind": "agent",
  "description": "Review the explicitly selected example",
  "instructions": "Inspect the selected synthetic example. Report uncertainty.",
  "model": "synthetic-model",
  "reasoningEffort": "high"
}
```

Save the spec privately (POSIX0600), then use the verified package's absolute CLI
path from elsewhere, or these commands from its root:

```sh
node bin/codex-mods.mjs scaffold-component --spec /absolute/private/agent-spec.json --output /absolute/canonical/new-agent-bundle
node bin/codex-mods.mjs validate-component --bundle /absolute/canonical/new-agent-bundle
node bin/codex-mods.mjs replay-component --bundle /absolute/canonical/new-agent-bundle
node bin/codex-mods.mjs component-plan --bundle /absolute/canonical/new-agent-bundle
```

The exact spec has six fields. Name is a lowercase slug1–48characters; description
is1–256characters, instructions1–4096characters. Text must be nonblank, valid Unicode
without control/bidi formatting; only instructions permit LF. Model is a bounded
1–96ASCII identifier using letters/digits/dot/underscore/hyphen, starting alphanumeric.
Effort is1–32lowercase letters/digits/underscore/hyphen, starting with a letter.
These deliberately narrow syntax checks do **not** establish advertised model access,
effort compatibility, cost or inference behavior. Unknown availability is unverified;
there is no model lookup or fallback. Other native options are outside this generator.

The new exclusive0700 bundle contains0600files: `component.json`, `access.json`,
`plan.json`, `REVIEW.md`, `agent-candidate.toml.txt`, `fixtures/agent.json`, and the
last-written `bundle.json` integrity marker. Existing private ownership/link/bounds/
canonical-file checks apply. No overwrite, automatic cleanup or repair of partial
output. Windows component IO still refuses before argv/path inspection.

The candidate has exactly five quoted literal TOML fields: name (`mods-` plus id),
description, developer_instructions, model and model_reasoning_effort. The `.txt`
suffix matters: native agent discovery recursively selects `.toml`; generation must
not accidentally publish a profile if a bundle is placed in a discovery tree.
Never rename/copy it into discovery as part of validation or replay.

Static replay checks selected/unselected review plans, unchanged candidate bytes
and forbidden authority fields. It never submits instructions or tests native tools,
permissions, usage, model access or execution. All existing observer/status/interaction
and rule bundles remain supported. New candidates cannot be combined with those
component kinds. No runtime settings, hook/capture selection or export/path grant.

## Select a review plan

Copy `component.json` to a separate private file **outside** the bundle and change
only `agent.selected` from false to true. Pass `--intent /absolute/private/intent.json`
to `replay-component` and `component-plan`. This selects review intent only: no native
`enabled` flag, installation, registration or invocation authority is generated.
Model/effort/description/instruction/name changes require regeneration and review.
Validation hashes detect inconsistency; they are not source trust or authorization.

Read the exact candidate, access declaration and plan before any install. The child
can use inherited tools/files/network/environment as the host permits. Its instructions
are **not a read-only sandbox**. The generator emits no sandbox, approval, provider,
MCP, feature, tool, path, secret or parent-model settings. Native host constraints
and permission checks remain authoritative. Keep authored text/artifacts private;
no credential/session discovery, telemetry or prompt logging is added.

## Human-reviewed native installation and lifecycle

The plan displays two alternatives: project `.codex/agents/mods-ID.toml`, or personal
`~/.codex/agents/mods-ID.toml`. Choose **one**, inspect actual client support and
name collisions/precedence in relevant configuration scopes, and preserve any
existing selected file privately. A `mods-` prefix reduces collisions; it does not
prove uniqueness. Do not shadow a built-in or overwrite a different profile.

Only after an explicit installation choice, review the exact five fields and place
the reviewed candidate content at the selected native target. Keep unrelated files,
global agent defaults, logging and parent model unchanged. Complete any host trust/
reload/restart requirement; never write trust hashes or assume hot reload. This
project supplies review steps, not an automatic native installer or launcher.

For an update, generate/validate/replay a new bundle, diff it against the preserved
target and review the exact replacement. For disable/removal, separately review
moving only that selected profile outside discovery and handling any explicit role
reference; preserve unrelated roles/global settings. Removing a profile does not
cancel existing children. Rollback restores only the preserved selected profile/
reference after review, never a whole shared config or plugin cache/trust snapshot.
Native installation/update/removal and configured execution are still unverified.

Before invocation, choose exact model/effort, project, task, allowed calls/tools,
deadline/output/cancellation limits and a usage budget. Parent orchestration can
itself consume model usage. No process timeout guarantees exact billing or remote
inference cancellation. No extra model test is currently authorized; do not use
another chat, collaboration agent or background task to bypass that boundary.

## Evidence and limits — 2026-10-24

Official [subagent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents)
describes native TOML agents and inherited host authority. Released CLI0.164.0
source at `6aaac694803004a63c6f393d153c96d22521a6b9` corroborates the
[parser](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/agent-roles/src/agent_role_config.rs),
[recursive discovery](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/agent-roles/src/discovery.rs),
[role overrides](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/agent/role.rs) and
[child inheritance](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/src/agent/child_config.rs).
No plugin-owned agent-directory loading contract was established from the reviewed
[plugin packaging](https://developers.openai.com/plugins/build/plugins) and loader
sources. We use the separate native configuration alternative, not a claim that
such integration is permanently impossible.

On macOS14.6/Node24.22.0, installed standalone CLI0.164.0 initialized and read the
explicit child-only candidate reference with no parse warning. A malformed control
produced a parse warning. **Both** references were visible in config/read; visibility
alone is not validation. This no-turn check proves neither automatic directory
discovery nor effective child routing/permissions. Python TOML parsing independently
round-tripped all five fields, including quotes, backslashes, Unicode and literal
key-looking instruction text. Synthetic CLI/security tests are recorded separately.
No native profile, production setting or model turn was created. Desktop and native
Windows discovery/execution remain unverified; installed31 preservation passed.

## Native acceptance preparation — 2026-10-25

The [test plan](continuation/NATIVE-ROUTING-TEST-PLAN.md) now provides exact proposed
separate orchestrator/child settings, inert candidate, native event evidence and
stop/usage/privacy bounds. Native model-list advertised Sol/Luna Low with no
thread/turn start. No profile or inference was authorized/started. Source32 static
validation still reports native execution unverified. V1/V2 differ in public
resolved-child metadata; V2 history must explicitly be none. Tool-admission and
cancellation implementation/dry tests remain High work before a live request.
Existing installed31/parent selection/logging/trust/platform guards unchanged.
