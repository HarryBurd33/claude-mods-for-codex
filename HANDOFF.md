# Claude Mods for Codex — session checkpoint

Updated: 2026-10-22 (America/Denver). Start here when continuing this project.

## User authorization and constraints

Build a public MIT-licensed open-source project named **Claude Mods for Codex**. Publish to the already connected GitHub account after implementation and final review. Do not copy Claude implementation code, imply affiliation, bypass Codex permissions, auto-approve calls, or rewrite user prompts. Preserve existing work. Keep potentially destructive or externally visible actions explicit and opt-in.

Use the strongest available Astra for research/architecture and final review; use the weakest reliable Sol for implementation. Research used **gpt-6-astra / ultra** and initial implementation used **gpt-5.6-sol / high**. An early suggestion of Luna was corrected before implementation. GPT-5.6 Sol later hit a usage limit. The user asked about **GPT-6.1 Sol**; the recommendation and continuation choice is **High reasoning** for the remaining scoped work. User asks for durable checkpoints and notification when cheaper models can take over. The research scope is now bounded enough for Sol.

## Current state

- The starting workspace was empty. A local Git repository now exists on `main`. First checkpoint: `99c7470` (Astra findings and scoped Sol handoff).
- Connected GitHub profile and authenticated browser both identify **HarryBurd33**. The GitHub connector returned 404 for `HarryBurd33/claude-mods-for-codex`; GitHub's new-repository form confirmed the slug was available. Recheck before publishing.
- The intended public repository now exists under `HarryBurd33` and the connector confirms it is empty with push access. Its creation was not performed by this agent. No project contents have been published yet. No Codex configuration has been changed.
- GitHub connector lacks repository creation. Browser creation is available; connector tools support trees/commits/files. `gh` is not installed. The connector installation uses selected repositories; access to a newly created repository may need checking.
- Installed CLI: `codex-cli 0.163.0`; Node: `v24.22.0`; Python: `3.15.0`.
- Astra researched current primary documentation and source, froze the scope below, then hit a usage limit. After the root preserved its findings, Astra resumed and saved `docs/research.md`, `docs/capability-matrix.md`, `docs/architecture.md`, `docs/implementation-plan.md`, and `docs/research-log.md`. Do not claim the final Astra review has happened.
- GPT-5.6 Sol implemented the initial framework before its usage limit. GPT-6.1 Sol completed journal safety fixes and packaging. Latest complete clean-package check: **33 tests passed, 0 failed**; validation, replay, stdin replay/help, and a simulated hook/journal/report journey succeeded. The earlier broad privacy regex is fixed. This is offline verification only.
- Quoted plugin paths and the hook-facing `Bash`/`tool_input.command` mapping were verified. Runtime safety review prompted bounded file reads, sanitized parse errors, deny on recognized tool events with invalid config, a static registry, strict output/metadata validation, journal locking, and read-only reports. Expanded tests cover these areas.
- Skill commands resolve the installed plugin root, public identity is `HarryBurd33`, journal hard links/private modes/ownership and concurrent reports are covered. Source-package file allowlist and `.gitignore` are present. The package was inspected and checked from a clean extraction with spaces. Latest temporary package directory is recorded in `/private/tmp/claude-mods-latest-package.txt`; rebuild after final source/documentation changes.

## Frozen MVP and handoff

Native manually installed plugin, portable root `plugin.json` with `extensions.com.openai`, one dependency-light Node ESM hook dispatcher, focused built-in mods, and a small offline CLI.

1. Smallest runnable mechanism: documented hook envelopes in, restricted JSON responses out; fixture replay without a Codex login.
2. Reusable deterministic dispatcher; validated local JSON configuration; `validate`, `replay`, and `report` commands.
3. Examples: visible session notice, deny-only matching tool/command guard, opt-in metadata-only activity journal. Keep a guard denial effective regardless of later mod order. No arbitrary remote mod loader.
4. One or two useful bundled skills, native plugin packaging, setup/removal/security/troubleshooting/contribution docs, Claude-to-Codex conversion guide and roadmap.
5. Tests and archive inspection; Astra review; fix findings; publish and independently verify URL and contents.

Do not emit permission `allow`, `updatedInput`, `PermissionRequest`, or `UserPromptSubmit` behavior in v0.1. Avoid unsupported `ask`, `continue`, `stopReason`, or legacy `approve` responses. Some fields appear in schemas but are rejected at runtime; rejection can leave execution continuing. The guard is a policy aid, never a sandbox or complete security boundary. Host hook failure/timeout may fail open. Do not automatically trust or install hooks.

## Evidence and research artifacts

Primary sources:

- <https://code.claude.com/docs/en/plugins/mods/overview>
- <https://code.claude.com/docs/en/plugins/mods/events>
- <https://code.claude.com/docs/en/plugins/mods/reference>
- <https://developers.openai.com/plugins/build/plugins>
- <https://learn.chatgpt.com/docs/hooks>
- <https://developers.openai.com/plugins/build/extensions>
- <https://developers.openai.com/plugins/build/chatgpt-ui>
- <https://developers.openai.com/plugins/deploy/submission>
- <https://github.com/openai/codex>
- <https://github.com/morluto/rea>

Temporary investigation data (not required by the eventual runtime; may disappear between sessions):

- REA source: `/private/tmp/codex-mods-rea-research`, commit `6dc0f60faa0928e20b2395ba1a93ff8e497143f7`.
- Codex source: `/private/tmp/codex-mods-codex-research`, commit `a3d93e1e692f1144cf8685175a5d1f6bf7294f57`.
- Generated CLI schemas: `/private/tmp/codex-mods-app-server-schema`.
- Pinned temporary REA tools: `/private/tmp/codex-mods-research-tools` (REA 6.7.0; installed with package lifecycle scripts disabled).
- Public SDK artifact: `/private/tmp/codex-mods-sdk-package/package`, version 0.163.0.
- REA evidence: `/private/tmp/codex-mods-rea-sdk-evidence.json` and `/private/tmp/codex-mods-rea-artifact-evidence.json`. Do not publish raw diagnostics without sanitizing.

REA README, SECURITY, DISCLAIMER and setup were inspected before execution. No installer changed user configuration; no private sessions, credentials, desktop binaries, remote-debugging ports or permission controls were inspected or modified. A directory passed to the binary route was rejected with an explicit suggested JavaScript route. Full JavaScript static analysis failed in REA's macOS process-ownership helper because Apple's Swift modules were redefined. A narrower metadata/source-map-only analysis of the exact public SDK **succeeded**, with **zero JavaScript files parsed**. Evidence ID: `ev_776a501013ac7201c576c5c97b0b7d1eb5c798bc401c1f42fae2411ed2852f02`; root SHA-256: `b1c316e2be5148e95ce94159191c8ff624617c62747363816319d17f12366773`. This establishes bounded artifact provenance, not semantic analysis or hook execution. See `docs/research-log.md`.

## Key conclusions and uncertainty

Current Codex docs support plugins, skills, MCP tools, and lifecycle hooks. Hook plugins require manual desktop installation and trust review; current public directory submission excludes hooks. Native hooks run concurrently, so ordering belongs inside one dispatcher. MCP Apps/Extensions document UI panels, navigation and other host integration; exact behavior in this installed Codex host is untested. No documented general native Codex restyling API was found. App-server is a supported separate-client route, not injection into the desktop interface. Schema generation succeeded, but installed-host hook trust, execution, UI and model-driven skill behavior remain unverified.

## Next action

GPT-6 Astra at Ultra is conducting final review (`docs/final-review.md` records progress). It reproduced a FIFO-read hang risk and found missing handler-error/result validation that could discard an earlier denial. GPT-6.1 Sol at High is repairing both with regressions and adding bounded replay batches. Reverify the repairs with Astra, rebuild/inspect the final archive, then upload to the existing empty public repository and verify it anonymously. Research and implementation verification are saved. Root owns this checkpoint and Git commits. Preserve final-review and publication gaps explicitly if usage interrupts work.

Scope alignment for final review: the initial architecture proposed dynamic local JS modules plus worker isolation; the parent narrowed v0.1 to declarative configuration of reviewed built-in handlers, with an authoring path through source contributions. The architecture and implementation plan now describe the static handler registry. Astra should assess that scope against the product goal before publication.
