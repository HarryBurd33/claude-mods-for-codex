# Research findings

Researched 2026-10-22, America/Denver. This is an implementation baseline, not a claim that every host integration has been tested.

## Decision

Build a small **native Codex plugin with a Node.js hook dispatcher, bundled skills, and an offline validation/replay CLI**. Treat Claude Mods as inspiration for the authoring experience, not an API or binary compatibility target. Do not patch the desktop application or copy Claude implementation code.

Claude Mods run JavaScript/TypeScript inside Claude Code and can handle events, register commands/tools, and own or replace interface elements. These capabilities do not all map to the same Codex mechanism. See the [Claude overview](https://code.claude.com/docs/en/plugins/mods/overview), [event model](https://code.claude.com/docs/en/plugins/mods/events), and [reference](https://code.claude.com/docs/en/plugins/mods/reference).

## Supported foundations

- **Packaging:** current documentation recommends portable root `plugin.json`, fixed `skills/` and `mcp.json` paths, and OpenAI-specific settings under `extensions.com.openai`. The older `.codex-plugin/plugin.json` remains a compatibility option. Hook-containing plugins are for manual Codex desktop installation, not public directory submission. Installing a plugin does not trust its hooks. [Packaging](https://developers.openai.com/plugins/build/plugins)
- **Hooks:** Codex documents session, prompt, tool, subagent, compaction, interrupt, and stop events. Native matching command hooks run concurrently. `PreToolUse` can deny or rewrite covered tool calls; hosted tools and certain specialized paths are excluded. A callback failure is not necessarily a denial. [Hooks](https://learn.chatgpt.com/docs/hooks)
- **Skills/MCP:** skills supply reusable workflows; MCP supplies tools, resources, and optionally UI. A skill is not a deterministic interception mechanism. [Plugin architecture](https://developers.openai.com/plugins/concepts/plugins), [skills](https://developers.openai.com/plugins/concepts/skills), [MCP](https://developers.openai.com/plugins/concepts/mcp-server)
- **UI:** MCP Apps and OpenAI Extensions document components, conversation panels, sidebar entrypoints, settings, and file views. Exact support in this installed Codex host was not exercised. No general public native spinner/tool-row replacement API was established by the reviewed interfaces. This is a survey conclusion, not proof that no private interface exists. [UI guide](https://developers.openai.com/plugins/build/chatgpt-ui), [extensions](https://developers.openai.com/plugins/build/extensions)
- **Separate hosts:** app-server supports a custom client, version-specific schemas, event notifications, and approval requests. `codex exec --json` supplies an event stream for subprocess integrations. Neither is an in-place native desktop UI extension. [App-server](https://learn.chatgpt.com/docs/app-server), [non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode)
- **Automations:** scheduled tasks can use skills/plugins; management belongs to the desktop/web surfaces. They are not a portable plugin timer contract. The MVP must not edit automation files. [Scheduled tasks](https://learn.chatgpt.com/docs/automations)

## Source corroboration and local evidence

The public Codex source was inspected at [`a3d93e1e692f1144cf8685175a5d1f6bf7294f57`](https://github.com/openai/codex/tree/a3d93e1e692f1144cf8685175a5d1f6bf7294f57). Relevant files:

- [`hooks/src/events/pre_tool_use.rs`](https://github.com/openai/codex/blob/a3d93e1e692f1144cf8685175a5d1f6bf7294f57/codex-rs/hooks/src/events/pre_tool_use.rs): denial aggregation and competing rewrites.
- [`hooks/schema/generated`](https://github.com/openai/codex/tree/a3d93e1e692f1144cf8685175a5d1f6bf7294f57/codex-rs/hooks/schema/generated): event-specific input/output schemas.
- [`hooks/src/engine/plugin_trust.rs`](https://github.com/openai/codex/blob/a3d93e1e692f1144cf8685175a5d1f6bf7294f57/codex-rs/hooks/src/engine/plugin_trust.rs): plugin hook trust handling.
- [`exec/src/exec_events.rs`](https://github.com/openai/codex/blob/a3d93e1e692f1144cf8685175a5d1f6bf7294f57/codex-rs/exec/src/exec_events.rs) and [`sdk/typescript/src/exec.ts`](https://github.com/openai/codex/blob/a3d93e1e692f1144cf8685175a5d1f6bf7294f57/sdk/typescript/src/exec.ts): event structures and subprocess SDK integration.

Locally observed: `codex-cli 0.163.0`; CLI help advertises JSON output, read-only/workspace sandbox modes, and app-server schema generation. `codex app-server generate-json-schema` completed successfully. Its generated protocol includes `hooks/list`, plugin operations, command approvals, and dynamic-tool requests. Schema presence does not prove host availability or successful execution.

Important distinction: the hook wire schema includes values that the runtime does not support. Therefore JSON-schema validity alone is insufficient. The MVP restricts output to a smaller documented subset; see [architecture](architecture.md).

## REA investigation

REA README, setup, security policy, disclaimer, and workflow guidance were reviewed before use at [`6dc0f60faa0928e20b2395ba1a93ff8e497143f7`](https://github.com/morluto/rea/tree/6dc0f60faa0928e20b2395ba1a93ff8e497143f7). Published `rea-agents@6.7.0` was installed in a temporary directory with lifecycle scripts disabled and optional dependencies omitted. No agent registration or setup transaction was applied.

Target: the public published `@openai/codex-sdk@0.163.0` artifact, never the desktop app or private sessions. Full JavaScript analysis failed before parsing because REA's macOS ownership helper could not compile. A scoped metadata/source-map run then **succeeded**, with zero JavaScript files parsed. It inventoried and hashed the package while analyzing only `package.json` and `dist/index.js.map`; no publisher-signature verification is claimed. Unselected-source relationships remain unknown. This supports package provenance, not hook behavior or runtime interception. Details and digests are in the [research log](research-log.md).

## Verification gaps

No live plugin installation, hook trust mutation, model call, MCP panel, scheduled task, or skill activation was tested. No user prompt was rewritten; no approval policy was weakened. The first release should advertise offline contract tests separately from live-host verification and preserve these gaps until observed.
