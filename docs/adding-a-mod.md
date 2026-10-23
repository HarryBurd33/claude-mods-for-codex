# Adding a reviewed mod type

The release intentionally has no configuration-driven JavaScript loader. Adding behavior is a source contribution that can be reviewed before installation.

Create one module under `src/mods/` that exports a definition with this narrow interface:

```js
export const example = {
  type: "example",
  allowedKeys: ["message"],
  validate(raw, context) {
    return {
      message: context.cleanString(raw.message, `${context.where}.message`, 200),
    };
  },
  handle(event, options) {
    if (event.hook_event_name !== "SessionStart") return {};
    return { message: options.message };
  },
};
```

Register the definition explicitly in `src/mods/registry.mjs`. The dispatcher recognizes only three internal result fields:

- `message`: nonblank visible text of at most 1,000 characters, without control characters; the dispatcher translates it to `systemMessage`.
- `denyReason`: nonblank text of at most 500 characters, without control characters, valid only for `PreToolUse`; the dispatcher translates it to the one supported `PreToolUse` denial envelope and keeps the first denial.
- `journal`: a boolean signal; only `true` requests the dispatcher's strict metadata record. Callers cannot supply arbitrary journal fields.

Handlers must return a synchronous plain object containing only those optional data fields. Promises, arrays, null, getters, extra fields, and invalid field types are rejected. A handler failure produces a sanitized diagnostic; for `PreToolUse`, the dispatcher preserves the first denial or generates a review denial. For other events, valid messages from unaffected handlers can still be returned. A rejected returned Promise is consumed to avoid an unhandled rejection, but asynchronous handlers remain unsupported. Tests may pass a trusted source resolver as the third `dispatch` argument; configuration and hook input cannot supply one.

The mod never returns a Codex hook response directly. Do not add pass-through output fields, an allow or ask decision, updated tool input, synthetic tool output, approval handling, prompt changes, transcript access, command execution, filesystem discovery, network access, remote modules, or regular expressions supplied by configuration.

Add configuration validation and tests for disabled behavior, event scope, deterministic ordering, output restrictions, errors, privacy, and bounds. Update the wire-format and security documents when the contract changes.
