# Claude Mods research and upstream examples

Research date: **2026-10-23 (America/Denver)**. This is primary-source research for the next development milestone, not a compatibility or live-host certificate. No Claude mod, upstream installer, destructive demonstration, or third-party plugin code was executed. The project remains independent of Anthropic and OpenAI.

## Retrieval record and limits

The [official documentation index](https://code.claude.com/docs/llms.txt) was retrieved and used to discover the section. All ten Mods pages below were downloaded successfully from their official `.md` endpoints. Relevant prose, tables, examples, version gates, and failure semantics were inspected. Additional linked security and installation pages were retrieved for targeted review. The webpages are mutable; this record pins the research date, not a documentation release.

| Page | Retrieved primary source | Review focus |
| --- | --- | --- |
| Overview | [overview](https://code.claude.com/docs/en/plugins/mods/overview) | Scope, host/version matrix, trust, examples |
| Create | [create](https://code.claude.com/docs/en/plugins/mods/create) | Authoring skill, development directories, review, validation, reload |
| Interface | [interface](https://code.claude.com/docs/en/plugins/mods/interface) | Panes, bands, native render sites, input, shared state |
| Gallery | [gallery](https://code.claude.com/docs/en/plugins/mods/gallery) | Controls, code/diffs, image/surface fallbacks |
| Events | [events](https://code.claude.com/docs/en/plugins/mods/events) | Observe/rewrite/answer, holds, permission sequence, failures |
| API | [api](https://code.claude.com/docs/en/plugins/mods/api) | Commands/tools, model usage, timers, local/network access |
| Reference | [reference](https://code.claude.com/docs/en/plugins/mods/reference) | Event families, method catalog, limits, versions |
| Testing | [test](https://code.claude.com/docs/en/plugins/mods/test) | Stubs, mock clocks, UI trees versus actual rendering |
| Troubleshooting | [troubleshoot](https://code.claude.com/docs/en/plugins/mods/troubleshoot) | Skipped hooks, worker failures, invalid rendering, stale state |
| Administration | [admin](https://code.claude.com/docs/en/plugins/mods/admin) | Managed guard, trust, policy order, control limitations |
| Plugin security | [security](https://code.claude.com/docs/en/plugins/security) | Processes outside tool sandbox, installation/update trust |
| Permissions | [permissions](https://code.claude.com/docs/en/permissions) | Targeted review of mod/hook precedence and tool rules |
| Sandboxing | [sandboxing](https://code.claude.com/docs/en/sandboxing) | Targeted review of shell versus plugin-process boundary |
| Organization plugins | [org](https://code.claude.com/docs/en/plugins/org) | Targeted review of managed plugin controls |
| Installation | [install](https://code.claude.com/docs/en/plugins/install) | Scope, marketplace, enable/disable/update/remove |
| Loading | [loading](https://code.claude.com/docs/en/plugins/loading) | Cached copies and updates versus development checkout |

The web tool could not open several `.md` URLs (unsupported content type/access error), and one HTML interface request failed. Direct HTTPS retrieval then succeeded. The initial sandboxed shell retrieval failed DNS; the approved network-enabled retrieval succeeded. These are transport failures, not evidence that the documentation is unavailable. Embedded video URLs and textual descriptions were encountered, but **videos were not played or watched**. No claim depends on unseen video contents. Source code and README claims from other projects are not reproduced as this project's own verification.

## Claude capability inventory

The Codex column below is an architectural candidate to verify against official Codex evidence and the installed host. It is not a substitute for the project requirements ledger or its acceptance results.

| Requested experience | Claude mechanism and important constraint | Candidate Codex translation / acceptance implication | Primary source |
| --- | --- | --- | --- |
| Install reusable mods | Plugin manifest plus hooks module; installed copies use plugin cache | Supported plugin packaging; verify installation and code-change trust separately | Create; Loading |
| Natural-language authoring | Built-in `plugin-authoring` skill; session development directory; user approval before execution | Original scaffolding skill + deterministic CLI; generated code remains untrusted pending host review | Create |
| Safe development updates | Directory mode reloads modules; session-generated mods use an approval flow | Do not copy this hot-reload claim to Codex; use only Codex-supported refresh/update mechanism | Create |
| Owned panes and tabs | `ui.open`, `ui.render(Pane)`; tabs can be buttons with selected state | Plugin-owned MCP App/Extension component; prove host rendering, focus and an actual interaction | Interface |
| Prompt-adjacent band | `ui.render(AbovePrompt)`; shared by mods, requiring composition | Dedicated native insertion requires a Codex extension point; owned panel status is a disclosed alternative | Interface |
| Buttons and text fields | `Button`, `Input`, `Select` callbacks; input alone does not invoke a model | UI actions should call bounded local functions; retain keyboard labels and accessible focus | Gallery |
| Native tool rows | ToolUse/ToolResult/ToolGroup render sites | Assess separately from owned UI; never represent an iframe as a native row replacement | Reference |
| Spinner/progress/footer | Spinner, ToolProgress, TurnDuration, SessionMode, PromptHint sites vary by surface | Native themes/indicators if documented; otherwise owned status section | Reference |
| Native question dialog | AskUserQuestion wrapping has constraints; permission prompt is not a render site | Preserve native approvals; do not restyle, hide, or replace their semantics | Interface |
| Transcript appearance | UserMessage/AssistantMessage render sites | Native supported themes versus plugin-owned rendering must be labeled separately | Reference |
| Rich code and diffs | Code source/diff element; VS Code draws plain source without equivalent styling | Native code/diff display or original owned renderer; validate actual host output | Gallery |
| Tables, diagrams and charts | Markdown and drawing primitives; third-party renderers add richer features | Native supported Markdown/Mermaid subset, plus charts within owned UI | Gallery; Prismantis |
| Lifecycle observation | Session, turns, tools, agents, classic settings-hook events | Hook adapters with explicit event coverage and gaps | Events |
| Deny a tool | `tool.call` refusal before `next` prevents execution | Covered PreToolUse denial; retain host sandbox and permission checks | Events |
| Hold for a decision | Await `ui.ask`; dismissal/headless failure can be refused | Only implement a covered-call hold if host supplies a supported pending-decision path; otherwise deny + explicit retry | Events |
| Tool argument changes | Modified event passed to `next`; subsequent permission check still applies | Opt-in input rewrite with visible original/proposed values and unchanged approval policy | Events |
| Tool completion | Await the middleware continuation; a later refusal cannot undo side effects | Post-event observer; label attempted/denied/failed/succeeded separately | Events |
| Turn completion | `turn.complete` includes abort state and usage totals; subagents identified | Stop/turn events and supported usage adapter; do not infer success from a completion event alone | Events |
| Shared runtime state | Module variables reset on reload; `$.state` survives reload but resets on clear/resume/branch | Separate hook processes require explicit persistent state/service; define session and project isolation | Interface |
| Shared persistent state | `$.store` spans sessions; read-then-write is not atomic | Atomic or serialized updates; bounded retention and cross-session collision tests | Interface |
| Live activity | Event-derived state invalidates drawing; render refreshes are throttled | Event-driven metadata counters; distinguish last-known state from live connectivity | Interface |
| Route a request/model | `turn.step` can change model/effort for a request | Do not imply equivalent request interception; explicit new configured task/subagent routing only if supported | Reference |
| Spawn subagents | `agent.spawn` event and API, separate from resumed-agent messaging | Named configured roles with explicit budgets/usage; no change to user's current selected model | Reference |
| Immediate slash callbacks | `command.register` + `command.run`; `immediate` can run during a turn | A CLI command or UI callback can be immediate; a skill invocation is model-mediated | API |
| Model-invoked tools | `tool.register` exposes an MCP-style tool name | MCP tools with schemas, scoped permissions and deterministic handlers | API |
| Extra model work | `model.complete`/`model.fork` use user's credentials and usage | Additional API/task calls must be visible, authorized, bounded and separately described | API |
| Background callbacks | Clock API timers; stop/reload behavior matters | Service-local timers only where lifecycle/cleanup defined; no hidden paid keepalive | API |
| Files/process/network | API-mediated access with user's permissions; mod process execution outside Bash sandbox | Scope local backend explicitly; sandboxed model tool permission is not backend process confinement | Security; Administration |
| Session/usage access | Transcript and usage API exist; event fields have per-version gates | Read only documented fields necessary for feature; no credential or private-session discovery | API; Reference |
| Testing/replay | Stubbed events, mocked store/clock/model, UI tree interactions | Offline tests prove contracts; native event delivery and actual pixels require separate checks | Testing |
| Failure behavior | Hooks may be skipped on error/timeout; worker failure may unload installed mods | Document fail-open edges honestly; never market lexical callbacks as a complete security boundary | Troubleshooting |

### Host/version qualifications

The current overview specifies CLI **2.1.287+**, desktop embedded Claude Code **2.1.286+**, and VS Code rendering **2.1.299+**, or **2.1.304+** for sessions that do not fetch feature flags. Desktop WSL sessions have no plugins/mods. Headless and cloud sessions can run hooks without showing drawings. These are documentation claims; no Claude host was tested here. The reference's baseline is older than some individual entries, so the per-entry version and installed-build type declarations matter. `AbovePrompt` now includes desktop in the reference; older sample README wording calling it terminal-only must not override that current documentation. [Overview](https://code.claude.com/docs/en/plugins/mods/overview), [reference](https://code.claude.com/docs/en/plugins/mods/reference).

### Security lessons that affect this project

1. A hook's failure is not automatically a denial. Claude's default failure path can skip it; even its error handler can fail. Holding on an arbitrary promise can exhaust the hook budget. Model approval, explicit user consent, runtime capability checks and local policy are different concepts. [Events](https://code.claude.com/docs/en/plugins/mods/events).
2. Code review/validation identifies declared capabilities; it does not sandbox local execution or establish trustworthy behavior. Claude's plugin code can run outside the model's Bash sandbox, even when tool permission rules deny a file. Codex must be assessed independently and disclose its actual process boundary. [Plugin security](https://code.claude.com/docs/en/plugins/security).
3. The managed Claude guard protects specific policy and event paths; it is not blanket confinement. A preview must never run arbitrary project code merely to describe risk. Measurements that fail, truncate or cannot parse the command are **unknown**, never zero impact. [Administration](https://code.claude.com/docs/en/plugins/mods/admin), [sample issue #3](https://github.com/anthropics/claude-code-playground/issues/3).
4. State resets, overlapping callbacks, old responses after a clear, and multi-session writes need explicit tests. An in-memory JavaScript object is not a cross-process store. [Interface](https://code.claude.com/docs/en/plugins/mods/interface).
5. Follow the testing guide's own distinction: UI tree validity does not establish painted layout. Native interaction, cancellation, accessibility and fallback checks remain necessary. [Testing](https://code.claude.com/docs/en/plugins/mods/test).

## Primary example repositories

Only documentation, metadata, and relevant public source descriptions were inspected; nothing was installed or run. Main-branch identities and released tags are separate evidence.

| Repository | Main commit observed | Release observed | License retrieved |
| --- | --- | --- | --- |
| [Prismantis](https://github.com/NahumLitvin/prismantis) | [`8649253`](https://github.com/NahumLitvin/prismantis/tree/86492531383be01074ac066b2e3c9734e6837918), 2026-10-23 | [v0.35.0](https://github.com/NahumLitvin/prismantis/releases/tag/v0.35.0), 2026-10-23 | [MIT](https://github.com/NahumLitvin/prismantis/blob/86492531383be01074ac066b2e3c9734e6837918/LICENSE); README also points to third-party notices |
| [Filetree](https://github.com/data-goblin/claude-code-filetree) | [`2489b4e`](https://github.com/data-goblin/claude-code-filetree/tree/2489b4e4e7ffc3f5fac39aff108071380cae1f09), 2026-10-23 | [v0.4.1](https://github.com/data-goblin/claude-code-filetree/releases/tag/v0.4.1), 2026-10-23 | [MIT](https://github.com/data-goblin/claude-code-filetree/blob/2489b4e4e7ffc3f5fac39aff108071380cae1f09/LICENSE) |
| [Cache Tax](https://github.com/karanb192/cache-tax) | [`e4940af`](https://github.com/karanb192/cache-tax/tree/e4940afcc62c109bd667bae1b996bee765021759), 2026-10-22 | [v2.3.1](https://github.com/karanb192/cache-tax/releases/tag/v2.3.1), 2026-10-22 | [MIT](https://github.com/karanb192/cache-tax/blob/e4940afcc62c109bd667bae1b996bee765021759/LICENSE) |
| [Claude Code Playground](https://github.com/anthropics/claude-code-playground) | [`569c528`](https://github.com/anthropics/claude-code-playground/tree/569c5283d9a0a7ee7938df85bb32e4f48cbb8c86), 2026-10-01 | Releases API returned an empty list | [Apache-2.0](https://github.com/anthropics/claude-code-playground/blob/569c5283d9a0a7ee7938df85bb32e4f48cbb8c86/LICENSE) |

The implementation should remain original and MIT. These sources inform requirements and test cases; this task does not authorize importing their Claude implementation. Copying code later would require its attribution and dependency notices to be preserved.

### Blast Radius

The [sample README](https://github.com/anthropics/claude-code-playground/blob/569c5283d9a0a7ee7938df85bb32e4f48cbb8c86/claude-code/mods/blast-radius/README.md) describes a lexical risky-command classifier, bounded-looking previews, and proceed/cancel controls. It explicitly admits incomplete shell parsing, only the first risky segment measured, Bash-only coverage, approximate deletion counts and stale remote information. Migration previews execute project status commands. Some changes after its original live demo had only stand-in Node tests.

Concrete current open reports to turn into synthetic acceptance tests:

- [#3](https://github.com/anthropics/claude-code-playground/issues/3): nonzero/malformed measurement is incorrectly described as no files affected.
- [#9](https://github.com/anthropics/claude-code-playground/issues/9): Windows lacks the external `sleep` executable used by its hold loop.
- [#10](https://github.com/anthropics/claude-code-playground/issues/10): WSL launcher argument loss, drive letters and Git Bash cwd syntax can mislead preview output.
- [#16](https://github.com/anthropics/claude-code-playground/issues/16): shell quotes inside a word produce a false no-impact report.
- [#18](https://github.com/anthropics/claude-code-playground/issues/18): custom pane polling does not make session managers see a native waiting-for-user state.
- [#2](https://github.com/anthropics/claude-code-playground/issues/2): noninteractive runs can wait the full ten minutes for controls nobody can use.

These are reporter observations, not independently reproduced here. Recommendation: original deterministic risk explanation, no arbitrary shell evaluation, native approvals where available, immediate explicit failure for unavailable decision surfaces, and no destructive live demo.

### Filetree

The [README](https://github.com/data-goblin/claude-code-filetree/blob/2489b4e4e7ffc3f5fac39aff108071380cae1f09/README.md) describes scoped Git status, file selection, previews, search, activity indicators and platform-specific launching. Its selection-to-prompt behavior should not be copied because this project's policy excludes rewriting user prompts. It claims three-OS tests; that does not validate this Codex project. The open-issue query returned no matches at retrieval time, not a warranty of correctness.

Recommended initial equivalent: read-only, selected-project explorer with Git status and bounded previews; omit secrets, ignored paths, symlinks outside the root and special files. Use argument arrays for Git and disable external diff/textconv helpers. Opening executables or changing files is a separate explicit action, not a selection side effect.

### Replay Theater

The [sample README](https://github.com/anthropics/claude-code-playground/blob/569c5283d9a0a7ee7938df85bb32e4f48cbb8c86/claude-code/mods/replay-theater/README.md) records requested Edit/Write/MultiEdit calls and presents a stepper. It warns that denied/failed edits may appear, content is memory-only, and one fallback was not tested. [Open issue #11](https://github.com/anthropics/claude-code-playground/issues/11) reports missed edits through other tools. [#14](https://github.com/anthropics/claude-code-playground/issues/14) requests dismissible hints.

Recommended equivalent: read-only diff inspection with explicit provenance and successful/failed/attempted labels. A Git diff since a checkpoint is an approximation to per-tool replay and cannot silently attribute all concurrent edits to the agent. Snapshot contents are sensitive and require opt-in, bounds and retention. Restore must be a separately reviewed operation.

### Token Weather

The [sample README](https://github.com/anthropics/claude-code-playground/blob/569c5283d9a0a7ee7938df85bb32e4f48cbb8c86/claude-code/mods/token-weather/README.md) uses `session.usage().context` after main turns; its chart is the last twelve readings, not live per-token activity. The full-window percentage differs from the host's auto-compaction threshold. The sample itself makes no model call; that does not make agent sessions free.

Recommended equivalent: render supported observed fields with their source, scope and timestamp. Distinguish context occupancy, cumulative token counts and account limits. Missing measurements must display unavailable, never zero. Avoid forecasting an exact compaction moment from an undocumented threshold.

### Cache Tax

The [README](https://github.com/karanb192/cache-tax/blob/e4940afcc62c109bd667bae1b996bee765021759/README.md) describes paid fork pings, time-based warmth, API-equivalent estimates, and strict limitations on what one successful cache-read observation proves. It distinguishes mocked timer tests from retention behavior and documents managed-hook/session-reset pitfalls. [Issue #26](https://github.com/karanb192/cache-tax/issues/26) warns that some circulating hold-dialog recordings show modified forks rather than this repository.

Recommended equivalent: passive report of genuinely available cached-token fields, labeled estimates only with a source/date/model/provider pricing basis, and unknown cache retention where the host supplies none. **No paid keepalive, prompt interception, or inferred exact bill.**

### Prismantis and Codex release check

The pinned [Codex README](https://github.com/NahumLitvin/prismantis/blob/86492531383be01074ac066b2e3c9734e6837918/codex/README.md) provides a session note and syntax-theme assets, not a general native redraw adapter. Its broad Claude features must not be advertised as Codex parity.

Independently checked against GitHub primary metadata:

- [Codex #53662](https://github.com/openai/codex/issues/53662) is closed. [PR #54217](https://github.com/openai/codex/pull/54217) merged 2026-10-15 at `e89b7c442c0433ad5167e72a5a25bb6d0712766a`, adding theme foregrounds for Markdown prose in the TUI.
- [Codex #53663](https://github.com/openai/codex/issues/53663), custom fenced-block rendering, is **open**.
- [NahumLitvin/codex #1](https://github.com/NahumLitvin/codex/pull/1) is an **open, unmerged custom-fork proof**, not an official release. Its own description says it is Unix-only, scans cached manifests without trust gating, and can stall rendering.
- The Prismantis README's statement that prose themes are unreleased is now **stale**. Official [Codex 0.164.0](https://github.com/openai/codex/releases/tag/rust-v0.164.0), published 2026-10-23 at 04:48:10 UTC, lists #54217 in its changelog. Its annotated tag resolves to commit [`6aaac694803004a63c6f393d153c96d22521a6b9`](https://github.com/openai/codex/tree/6aaac694803004a63c6f393d153c96d22521a6b9). GitHub's [merge-to-release comparison](https://github.com/openai/codex/compare/e89b7c442c0433ad5167e72a5a25bb6d0712766a...rust-v0.164.0) reports `ahead`, 245 commits ahead and zero behind, with the theme merge itself as the merge base. This establishes inclusion in the released tag, not an actual host-rendering observation.
- The same [comparison against 0.163.0](https://github.com/openai/codex/compare/e89b7c442c0433ad5167e72a5a25bb6d0712766a...rust-v0.163.0) reports `diverged`, five ahead and 85 behind; that older installed baseline does not contain the merge. The first releases-list request failed with `Transport closed`; a later `releases/latest` call and both comparisons succeeded.
- The 0.164.0 changelog also names [#55144](https://github.com/openai/codex/pull/55144) observation-only model-request lifecycle hooks and [#54619](https://github.com/openai/codex/pull/54619) content-bound plugin hook approval. These entries are leads for source and live-host review, not proof that every installed desktop/client path exposes them.

Do not use the fork as an installation route. Native supported themes are a promising foundation; owned-panel colors/renderers are a separate capability. A separate client or upstream proposal remains a user decision, not an implicit fallback product.

## Next research/implementation actions

1. Verify prose theme rendering on a released Codex 0.164.0+ target, without silently updating the user's installed client; recheck relevant current source paths.
2. Transfer each candidate into `REQUIREMENTS.md` with target client/OS/version, current implementation and a concrete acceptance test. Retain unavailable/unverified distinctions.
3. Prove actual Codex installation, native harmless hooks, owned UI and opt-in rewrite behavior; document any trust action needed without bypassing it.
4. Use the upstream failure reports above as original synthetic fixtures for parser uncertainty, cancellation, Windows process/path behavior and replay provenance.
5. Keep a coherent first collection: risk explanation, scoped explorer, read-only change review, passive usage status, plus authoring/debugging/verification/review skills. Do not let successful small proofs imply full requested-product completion.
