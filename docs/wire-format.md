# Hook wire format

The runtime reads one UTF-8 JSON object from stdin, bounded to 1 MiB, and writes one compact JSON object plus a newline to stdout. Diagnostics go to stderr and never include raw input.

Supported input event names are `SessionStart`, `PreToolUse`, and `PostToolUse`. The fixtures under `fixtures/` show the required identity fields. Tool inputs follow Codex's schema and may be any JSON value; the example guard only inspects an object with a string `command` field.

Supported outputs are a strict subset of the public Codex hook schemas:

```json
{}
```

```json
{ "systemMessage": "Visible bounded message" }
```

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Bounded reason"
  }
}
```

The runtime never emits `allow`, `ask`, `updatedInput`, `continue`, `stopReason`, `suppressOutput`, legacy `approve`, or arbitrary output fields. It does not register `PermissionRequest` or `UserPromptSubmit`.

Unknown event names yield `{}` plus a safe stderr diagnostic during native invocation and a `diagnostic` field outside the response in offline replay. Malformed input exits nonzero with a generic stderr message. A valid `PreToolUse` envelope with an unavailable configuration receives an explicit deny response when the runtime can still serialize one. A throwing handler or invalid internal result also receives a review denial for `PreToolUse`, preserving any earlier denial; other events retain valid messages from unaffected handlers. Handler diagnostics contain no exception or result payload. Reasons must contain non-whitespace text; control characters and overlong text are rejected. A process crash or host timeout can still fail open outside this protocol.

Offline `replay --fixtures` accepts at most 128 JSON files and 8 MiB of aggregate input, with a 1 MiB limit per event. Configuration and event file reads reject nonregular files, including POSIX FIFOs, without waiting for a pipe writer.

The contract was compared with public Codex source hook schemas at commit `a3d93e1e692f1144cf8685175a5d1f6bf7294f57`. Offline fixture tests do not prove installed-host execution.
