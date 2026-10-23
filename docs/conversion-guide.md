# Converting a Claude Mod concept

Claude Mods and Codex hooks have different capabilities and execution models. Convert the intent after reviewing it; do not copy implementation code or expect binary compatibility.

1. Inventory each event, command, tool, interface change, side effect, and stored field.
2. Keep only behavior that maps to a documented Codex surface. In this release that means a visible `SessionStart` notice, a deny-only `PreToolUse` policy, or metadata observation on the three registered events.
3. Translate configuration into narrow JSON values. Replace regular-expression or callback policy with exact tool names and literal command fragments where that simpler meaning is acceptable.
4. Implement any new behavior as reviewed source in the static registry. Do not load a Claude mod, package path, URL, or JavaScript expression from configuration.
5. Use the offline fixtures to prove exact output. A nonmatch must emit `{}`; no path may emit an allow or approval decision.
6. Reassess privacy. Discard prompts, arguments, results, transcript paths, session IDs, and project paths rather than logging them.
7. Treat UI replacement, synthetic tool results, prompt rewriting, permission automation, and arbitrary in-process state as unsupported in this framework.

Native Codex hooks from different sources run concurrently. This package creates deterministic order only among its own registered mods. A converted guard remains a policy aid because a hook failure or uncovered tool path can proceed.

## Worked example: a destructive-command warning

Suppose a Claude mod concept inspects shell calls and blocks a forceful cleanup. Keep the blocking intent and use the shipped [`deny-guard.json`](../examples/config/deny-guard.json) with the native `PreToolUse` adapter. Run:

```sh
node ./bin/codex-mods.mjs replay --config ./examples/config/deny-guard.json --event ./fixtures/pre-tool-denied.json
node ./bin/codex-mods.mjs replay --config ./examples/config/deny-guard.json --event ./fixtures/pre-tool-safe.json
```

The first returns a native deny response; the second returns `{}`. Neither executes the fixture command. This conversion uses literal matching: alternate quoting, flags, wrappers, or tool paths can evade the pattern, and harmless text containing the fragment can match it. Use Codex's permissions and sandbox for enforcement.

A concept that adds a live tool-history pane instead maps only partly to this release: the optional journal and report provide local aggregate counts. An owned MCP panel is a future adapter requiring host verification. Consult the [capability matrix](capability-matrix.md) and its primary sources before choosing an equivalent for a different concept.
