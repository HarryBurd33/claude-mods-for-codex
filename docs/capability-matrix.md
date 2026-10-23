# Capability matrix

> Historical v0.1 record. Current capability assessment, released-format correction and native proof results are in [continuation/STATUS.md](continuation/STATUS.md) and [continuation/REQUIREMENTS.md](continuation/REQUIREMENTS.md). Earlier exclusions and portable-hook packaging claims are superseded; the full product remains incomplete.

Baseline: 2026-10-22. **Documented** means public support; **observed** means a local check; **approximation** means our design translates the intent; **not established** means no supported equivalent was found in the surveyed interfaces. A documented feature is not automatically verified in every host.

| Claude Mods capability | Codex route and status | v0.1 decision |
| --- | --- | --- |
| Reusable installable package | Portable plugins; documented | Root manifest, hooks, skills; manual installation |
| Reusable instructions | Skills; documented | One focused usage/authoring skill |
| Lifecycle event handlers | Command hooks; documented; source schemas inspected | `SessionStart`, `PreToolUse`, `PostToolUse` only |
| Ordered middleware | Native hooks are concurrent; ordered internal dispatcher is an approximation | Deterministic order; denial cannot be overridden |
| Block a tool | `PreToolUse` denial on covered paths; documented | Deny-only configurable policy aid |
| Rewrite tool input | Documented, with tool-specific limits | Excluded |
| Supply a synthetic result for any tool | General equivalent not established | Excluded |
| Auto-answer approval | `PermissionRequest` can decide; documented | Excluded by project policy |
| Rewrite user prompt | Some lifecycle mechanisms affect context; exact equivalence unnecessary | Explicitly excluded |
| Run a native slash-command callback immediately | General callback registration not established | CLI commands and skill invocation are approximations |
| Add model-callable tools | MCP; documented | Later adapter, not needed for MVP |
| Render an owned panel | MCP Apps/OpenAI Extensions; documented; installed host untested | Roadmap with host capability check |
| Replace native spinner, tool row, transcript styling | Public equivalent not established | Excluded; no app patching |
| Share in-process variables between hooks | Separate command processes; not equivalent | Explicit data directory, opt-in metadata journal |
| Durable plugin storage | `PLUGIN_DATA`; documented | Use only when journaling is enabled |
| Observe exec runs | `codex exec --json`; help observed, source inspected | Future read-only adapter; cannot veto via output stream |
| Own a complete interactive client | App-server; schema generation observed | Separate future product scope |
| Schedule work | Desktop/web scheduled tasks; documented | Instructions only; no scheduler/config writer |
| Intercept every action | Not supported: hosted/specialized paths and failure semantics matter | Never claim complete enforcement |
| Run existing Claude mod code unchanged | No compatible runtime established | Manual conversion guide only |

Sources: [Claude overview](https://code.claude.com/docs/en/plugins/mods/overview), [Claude API](https://code.claude.com/docs/en/plugins/mods/api), [Codex hooks](https://learn.chatgpt.com/docs/hooks), [plugin architecture](https://developers.openai.com/plugins/concepts/plugins), [UI extensions](https://developers.openai.com/plugins/build/extensions), [app-server](https://learn.chatgpt.com/docs/app-server), [scheduled tasks](https://learn.chatgpt.com/docs/automations). See [research](research.md) for source commits and the limits of local observations.
