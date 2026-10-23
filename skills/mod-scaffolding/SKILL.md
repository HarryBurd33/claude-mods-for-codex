---
name: mod-scaffolding
description: Scaffold a Claude Mods configuration when the user describes a local notice, lexical denial, or exact command replacement; report unsupported surfaces explicitly.
---

Resolve the installed package root two levels above this file and verify .codex-plugin/plugin.json names claude-mods-for-codex. Read docs/runtime.md and src/scaffold.mjs from that root. Translate the requested behavior into one supported declarative specification; disclose approximations before choosing them. Do not turn an unsupported native UI request into a different client.

Use the verified absolute bin/codex-mods.mjs CLI: scaffold --spec PATH --output NEW_ABSOLUTE_DIRECTORY. Specifications have name/kind plus message for notice, match/reason for deny, or from/to for replacement. Output is disabled configuration and access declaration, not an installed plugin. Review access.json and the generated diff. Validate mods.json, replay a synthetic matching and nonmatching event, and inspect the exact response. To exercise the rule offline, enable only the temporary reviewed config; replay does not execute its command.

Merge only reviewed entries into selected configuration, preserving others. Install/update only within the user's authorization through supported marketplace mechanisms. Changed code requires human hook trust; never write trust hashes or promise hot reload.

This workflow uses the selected model and consumes usage. Local scaffold/validate/replay callbacks make no model calls. Reads are verified package files, the user's specification and selected configuration; writes are the chosen new output and explicitly requested edits. No secret/session discovery, network, automatic paid calls, model switching or permission approval. Stop if the specification requires an unsupported component or broader access than authorized.
