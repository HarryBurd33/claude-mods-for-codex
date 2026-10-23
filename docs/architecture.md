# Architecture and v0.1 contract

Historical v0.1 design. Current scope and decisions are in
[continuation/ARCHITECTURE.md](continuation/ARCHITECTURE.md). The v0.1 review was
completed; references below to a pending final review are historical. Its narrow
output contract still applies to the production dispatcher, not every supported
Codex extension capability.

Status: design frozen for implementation, 2026-10-22. The initial Astra design was narrowed during handoff to reviewed built-in handlers rather than dynamic module loading. Final Astra review remains required. Implementation may choose file names, but changes to the safety/output contract require review.

## Product boundary

A local package lets developers write small JavaScript mods for supported Codex hook events. It supplies a consistent dispatcher, example mods, replay fixtures, and readable reports. It is independently developed, is not affiliated with Anthropic or OpenAI, and does not execute arbitrary Claude Mods unchanged.

One native hook command per event invokes the dispatcher. All ordering within this package happens there; order relative to other installed hooks is not controlled. Use ordinary Node ESM and minimal dependencies. The tool does not need a model, API key, network, or app-server to validate or replay fixtures.

```text
Codex hook / offline fixture
          |
          v
bounded JSON input -> event validation -> ordered enabled mods
                                             |
                              restricted result validation
                                             |
                      deny wins + bounded visible messages
                                             |
                      one Codex-compatible JSON response

Optional journal -> explicit plugin data directory -> local report
```

## Package and authoring API

Suggested layout: root `plugin.json`, `hooks/hooks.json`, `src/`, `mods/`, `skills/`, `examples/`, `test/`, and documentation. Root portable identity and `extensions.com.openai` follow current packaging guidance. Do not generate both competing manifest overlays unless compatibility is actually required.

A versioned JSON configuration lists reviewed built-in mod types, enabled state, and options. It does not accept executable paths, source strings, remote URLs, or expressions. Configuration validation must not execute tool commands or discover code from the current working directory. Replay runs this package's reviewed code with the process user's permissions.

The reusable handler registry separates built-in mod behavior from protocol translation. A handler receives a validated event and its own options and returns a narrow internal result, such as a visible message, no decision, or a denial reason. It must not return arbitrary host protocol fields. Adding a new type requires an explicit source change, matching configuration validation, tests, and review. Document this authoring path with a complete tiny example.

Bound input/output sizes, loops, storage work, and native hook duration. The initial handlers perform bounded synchronous matching and formatting, not arbitrary user-defined execution. A future dynamic-loader proposal must add a worker/process lifetime design; a `Promise.race` alone cannot stop a synchronous infinite loop. Neither the current process nor a future worker is a sandbox for malicious code.

## Host protocol restrictions

Support only `SessionStart`, `PreToolUse`, and `PostToolUse` initially. Require the expected event name and appropriately typed required identity/tool fields. Unknown or malformed inputs must produce an explicit diagnostic, never an implicit approval.

Allowed host outputs are `{}`, bounded `systemMessage`, and, for a denial, `hookSpecificOutput` with `hookEventName: "PreToolUse"`, `permissionDecision: "deny"`, and a reason. The runtime owns translation. Do not emit `allow`, `ask`, `updatedInput`, `continue`, `stopReason`, `suppressOutput`, or legacy approval fields. Do not handle `PermissionRequest` or `UserPromptSubmit`.

Once any enabled guard denies, later mods cannot cancel that denial. On a recognized `PreToolUse` guard/dispatcher error, return a valid explicit denial when possible. For other events, report the failure without pretending to undo an action. A process crash or host timeout may still let the tool proceed: the package is an advisory policy mechanism, not a complete security boundary.

Session notices must be visibly labeled. Do not alter user text, secretly add instructions, fabricate a tool result, or change approvals, hook trust, sandbox settings, or model selection.

## Examples and storage

1. **Session notice:** a short visible explanation of active mods.
2. **Tool policy:** deny explicitly configured exact tool names or literal command patterns. Describe command matching as lexical, not shell-semantic enforcement. Avoid a misleading universal “dangerous command detector.”
3. **Activity journal:** disabled by default; store only event/time/tool identifiers and outcomes. Do not record command text, prompts, tool arguments/results, transcripts, credentials, or private absolute paths.

Storage must use `PLUGIN_DATA` or an explicitly provided task-specific directory. Never infer permission to write into the project or user configuration. Sanitize identifiers used in filenames, bound report reads, and handle concurrent hook invocations without losing records or following symlink destinations. Reports must state when there is no journal and how to enable it deliberately.

## Future adapters

An MCP server could expose reports and an MCP Apps conversation panel. Validate actual host support before advertising that UI. An exec observer could consume JSONL, and an app-server client could own a separate interactive experience. Keep these adapters outside the initial runtime; none justify patching native Codex UI or reading private session files.
