# Sol Ultra → Sol High handoff

2026-10-23. Full product incomplete. **Next model GPT-6.1 Sol; effort High.**
The human completed the Astra→Sol Ultra switch before this implementation stage.
Reviewed contracts/transport/workspace boundaries and focused proofs now make
remaining feature construction and empirical host checks suitable for High.
If a new hard architecture/security issue emerges, checkpoint and request Ultra
or Astra explicitly. Never bypass human model switches through subagents.

Read STATUS.md, REQUIREMENTS.md, ARCHITECTURE.md, TEST-LOG.md and this file under
docs/continuation; docs/runtime.md describes current source setup/access. Refer to
CODEX-CONTRACTS/CLAUDE-RESEARCH/STATE-PROOF for existing primary evidence. Root
HANDOFF.md is ignored/private and has local paths/backups/logs; never upload it.

## Identity and objective

Repository [HarryBurd33/claude-mods-for-codex](https://github.com/HarryBurd33/claude-mods-for-codex),
branch [codex/astra-groundwork](https://github.com/HarryBurd33/claude-mods-for-codex/tree/codex/astra-groundwork).
Starting verified commit bf2960eb5b0fc74c794dcd05955c42670b603163. Current source
checkpoint/local/remote verification is stamped after upload below; final
handoff-record commit is independently reported in switch message/private record.
Original user local main6c59e98 and original Astra checkpoint branch preserved.
No force push or private local-history merge. Terminal Git lacks credentials;
use connected GitHub tree/commit/ref workflow, fetch and compare exact trees.

Milestone: production0.2.0-dev.1 integrates foundations; next build the coherent
useful collection and verify actual production host behavior. All93 ledger rows
remain in scope. Do not call this finished because a larger test suite passes.

## Implemented this stage

- src/dispatcher.mjs: strict v2 union + v1 adapter; immutable inputs; denial wins;
  replacement conflict rejection and original/revised guard evaluation.
  assertSafeOutput(output,event) validates paired allow+updatedInput, command-only
  difference and mandatory full before/after. No PermissionRequest approval.
- src/mods/exact-command-rewrite.mjs: explicitly enabled exact Bash rules,
  max200-character commands, no dynamic module/regex/security/model/prompt fields.
- src/config.mjs, src/hook-main.mjs: metadataState default off/session scope,
  explicit data/project boundary and native session ID; writes metadata only.
  Structural preparation failure after valid PreToolUse explicitly denies.
- src/workspace.mjs: describeProject, listProjectFiles, inspectProjectChanges.
  Ordinary selected in-project Git only, sanitized temporary metadata/config,
  read-only operations, bounded processes/output, safe paths and opt-in patches.
- src/cli.mjs: immediate local files --project and changes --project [--include-diffs].
  Commands execute deterministic local code; they are not native slash callbacks.
- src/mcp-stdio.mjs: bounded input/active/output queues, concurrent response
  handling for elicitation, cancel/EOF cleanup, no network/sampling/model API.
- src/runtime-settings.mjs: reviewed private unlinked settings outside selected
  project; explicit project/data/session or opted-in project scope, default no
  patches. Native Windows private settings refuse pending ACL implementation.
- src/server.mjs, ui/dashboard.html, .mcp.json: production owned UI/service with
  activity/files/changes/access; bounded opt-in watch, unavailable usage data.
  Tools accept no arbitrary paths/commands/writes. Not native-host verified yet.
- proofs/hold.mjs/hold-server.mjs/prepare-hold.mjs: bounded exact-marker human
  decision candidate. Known auto_review rejects; decline/cancel/failure deny;
  accept+confirm:true abstains. Generic response is not human authentication.
- Tests: contracts/workspace/dashboard/hold/transport-ui plus preserved baseline;
  CI Windows adds portable contracts, with native host/storage gaps still stated.

## Observed native behavior and installation

Host: macOS14.6, Node24.22.0, CLI0.163.0, desktop26.1016.62342 build21477.
CLI0.164 researched, not installed. Do not assign CLI version to desktop runtime.
Astra proof0.0.2 remains installed/trusted; covered fixed rewrite/deny and owned
MCP App were proved then. New production0.2.0-dev.1 is NOT installed/verified.

Sol installed separate hold0.0.3 through supported marketplace/plugin commands;
human trusted its single MCP hook. Disconnected-start marker ran unchanged;
after MCP connection, exact marker held30s then denied timeout. Human reported
answering the form, but accept/decline delivery and cause remain unverified.
No extra model turn, prompt rewrite, permission weakening or app patch occurred.

Hold0.0.3 and its dedicated marketplace were removed through supported CLI.
Private config backup made before removal; only owned entries changed. Snapshot/
evidence retained privately; fresh-host process/tool absence remains unverified.
Reviewed source0.0.4 includes transport/UI fixes and is NOT installed. Preparing
it currently refuses an existing snapshot destination: archive the reviewed old
private hold marketplace first, then prepare/review/install and obtain human trust.
Do not edit installed caches or silently retain old code trust.

Rollback/removal identifiers:

```sh
codex plugin remove claude-mods-hold-proof@claude-mods-hold-dev --json
codex plugin marketplace remove claude-mods-hold-dev --json
codex plugin remove claude-mods-native-proof@claude-mods-dev --json
codex plugin marketplace remove claude-mods-dev --json
```

The first pair already succeeded. The second pair applies only if removing the
retained original proof. Stop affected clients before optional data cleanup;
preserve unrelated config and never restore whole backups over newer settings.
Production setup/removal uses separate identifiers in docs/setup.md/removal.md.

## Results, limits and known gaps

Exact commands/results are in TEST-LOG. Native new-dashboard rendering/watch,
negative permission preservation, SessionStart, human hold accept/decline/cancel,
model-routing runtime and native Windows remain unverified. No per-turn attribution
from Git working tree; restoring is a separate explicit action, not implemented.
Git supports no linked worktrees/external objects/alternates/SHA256/split index.
Global ignore settings are not loaded; secret filename filters do not guarantee
secret-free patch contents. Same-user races are not an OS sandbox.

UI tool requests have bounded bridge waits; Git calls are3s each/context10s after
bounded metadata preflight. Preflight is count bounded rather than a strict wall
clock filesystem timeout. Timeout can report unavailable while a read-only server
operation completes its cleanup. Visual form cancellation requires native proof.
The original installed native proof still reports old MCP internal version0.0.1
with package0.0.2; align only through a later reviewed update if retained.

## Next tasks and acceptance

1. Install reviewed production source in a disposable selected Git project using
   supported compatibility/local marketplace flow; configure private settings and
   matching hook project/session state explicitly. Human trust after code changes.
   Verify cache, real events, exact replacement permission-negative case, scoped
   activity watch, files/changes rendering, close/reopen/resizing/accessibility.
   Do not use old proof H results as new production H evidence.
2. Retest hold source0.0.4 only after reviewed update. Capture human accept,
   decline/cancel, timeout/disconnect and host-review behavior. Investigate form
   answer/timeout discrepancy without private app internals. If blocked, record
   exact blocker and provide explanation+deny+explicit retry approximation.
3. Build useful coherent authoring/debugging/verification/review skills and safe
   scaffolding flow: describe→components/permissions→validate/replay→review→
   supported installation/update/human trust. No auto-trust/hot reload. Each skill
   declares triggers, permissions, model usage and limits; not instant callbacks.
4. Complete richer bounded UI (tables/chart/text/code/diff; Mermaid only after safe
   local renderer/license review), lexical blast-radius explanations, selected
   checkpoint/turn export replay, explicit restore workflow, passive usage/cache
   adapters where real data exists, and supported theme flow. No invented billing,
   cache health or keepalive. Native styling gaps remain distinct from owned UI.
5. Windows ACL/settings/state design plus real native installation/process checks;
   CI protocol success is not full compatibility. Test production updates,
   disable/removal/restoration and public clean clone/package at final revision.
   Reconcile all93 requirements and final independent review before release.

No extra paid/API run is authorized merely by a test helper. Any additional model
run must be visible, bounded and authorized; do not change the user's selected
model. A major separate app-server client needs user agreement. The current
immediate user action is switching to Sol High; no trust review is pending now.

## Copy-and-paste resume

> Continue Claude Mods for Codex using GPT-6.1 Sol, High, on codex/astra-groundwork.
> Read docs/continuation/STATUS.md, REQUIREMENTS.md, ARCHITECTURE.md, TEST-LOG.md,
> HANDOFF.md and docs/runtime.md, plus ignored local HANDOFF.md for machine setup.
> Preserve private history and user changes. Integrate and verify production
> 0.2.0-dev.1 in the actual supported host, follow prioritized tasks and all93
> requirements, and keep source/mock/native evidence distinct. Finish the useful
> authoring/skills/UI/examples collection without calling partial work complete.
> Preserve normal permissions, explicit sensitive-data opt-ins and human trust.
> Upload meaningful safe checkpoints and verify remote contents. When Medium is
> sufficient, save a precise handoff, commit/upload/verify, then stop for me to
> switch; request stronger effort if a new hard security/architecture problem
> appears. Do not delegate or continue in the background past model-switch gates.
