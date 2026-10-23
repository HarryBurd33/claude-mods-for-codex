# Configuration

`config/mods.json` is a versioned, strict JSON object. Unknown keys, duplicate IDs, unsupported types, unsafe identifiers, control characters, oversized strings, and more than the documented bounds are rejected.

Mods run in array order inside one dispatcher. Native hook sources outside this package can still run concurrently. A denial from any enabled registered guard is sticky and later mods cannot undo it.

## Session notice

```json
{
  "id": "session-notice",
  "type": "sessionNotice",
  "enabled": true,
  "message": "Claude Mods for Codex is active."
}
```

It emits a visible, bounded `systemMessage` only for `SessionStart`.

## Deny guard

```json
{
  "id": "destructive-command-guard",
  "type": "denyGuard",
  "enabled": true,
  "rules": [
    {
      "toolNames": ["Bash"],
      "commandContains": ["rm -rf"],
      "reason": "Review this destructive command."
    }
  ]
}
```

Within a rule, supplied conditions are combined with AND. Array entries use OR. Tool names are exact and command fragments are literal, case-sensitive substrings. Regular expressions, shell parsing, globbing, and arbitrary predicates are not supported. A rule without `toolNames` can match any tool input that has a string `command`; a rule without `commandContains` can deny an exact tool name regardless of its input.

## Activity journal

```json
{
  "id": "metadata-activity-journal",
  "type": "activityJournal",
  "enabled": false
}
```

Change `enabled` to `true` only after deciding that local timestamp, event, tool identifier, and deny outcome metadata is appropriate. Codex supplies `PLUGIN_DATA`; the runtime never uses the event's working directory. Use `report --data-dir PATH` to view aggregate counts. See [privacy](privacy.md).

Run after every edit:

```sh
node ./bin/codex-mods.mjs validate
node ./bin/codex-mods.mjs replay --fixtures ./fixtures
```

The `examples/config/` directory contains valid single-purpose configurations. For example:

```sh
node ./bin/codex-mods.mjs replay --config ./examples/config/deny-guard.json --fixtures ./fixtures
```

The journal example enables its dispatch signal, but offline replay never writes journal files. Native hook invocation writes only when `PLUGIN_DATA` is present.
