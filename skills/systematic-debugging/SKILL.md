---
name: systematic-debugging
description: Investigate a reproducible bug in Claude Mods hooks, MCP tools, state or UI using evidence and a minimal fix; ordinary configuration questions do not require this workflow.
---

Identify the failing boundary: configuration, dispatcher, subprocess transport, state, plugin discovery/trust, or owned UI. Preserve user changes and record a concrete expected/observed example. Read only relevant package sources and explicitly selected diagnostics; never discover private sessions or credential stores.

Build a synthetic reproducer at the nearest boundary. Separate fixture success from actual host delivery. For hook failures inspect sanitized output and normal permission behavior; for UI inspect cancellation, request correlation and lifecycle. Do not bypass trust or private app boundaries to make a test pass.

Change the smallest responsible component. Run the reproducer and relevant existing checks, then report what is observed and what remains unverified. If a real host step requires human trust or protected interaction, prepare the exact step and continue independent authorized work.

The skill uses the selected model and ordinary scoped file/tool permissions. Local deterministic tests do not require additional model runs. No automatic network, installation, prompt rewriting, approval automation or selected-model change. Stop repeated speculative repairs when evidence points to a host limitation; record the blocker and supported alternative.
