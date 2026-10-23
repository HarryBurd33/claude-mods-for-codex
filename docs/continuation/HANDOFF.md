# Astra → GPT-6.1 Sol handoff

Date:2026-10-23. **Human-controlled stage boundary. Full product incomplete.**
Next model: **GPT-6.1 Sol**. Effort: **Ultra**. Substantial integration and the
remaining native permission/hold questions justify Ultra; use High only after
those uncertainties and demanding integration no longer require it. At every
later switch, save/upload/verify and stop for the human. Do not delegate across
the stage boundary or schedule continuation.

## Milestone and objective

Astra groundwork: reconcile history, complete requirements and primary research,
correct architecture, prove native installation/covered events/owned UI/fixed
rewrite, implement bounded state and reproducible inspection. Continue toward
the whole93-row ledger, not another MVP presented as completion.

Read in order: STATUS.md, REQUIREMENTS.md, ARCHITECTURE.md, TEST-LOG.md, this file,
then CODEX-CONTRACTS.md, CLAUDE-RESEARCH.md and STATE-PROOF.md as needed. All are
under docs/continuation. Root HANDOFF.md contains ignored private local details;
never upload it, private logs, absolute user paths or configuration backups.

## Git checkpoint identity

Repository: [HarryBurd33/claude-mods-for-codex](https://github.com/HarryBurd33/claude-mods-for-codex).
Development branch: [codex/astra-groundwork](https://github.com/HarryBurd33/claude-mods-for-codex/tree/codex/astra-groundwork).
Safe base: `4f2c0be0e734cad5d4769c840c43e02e298cc053`.
Original local main6c59e98 and its history remain intact; never push it wholesale,
because it tracks private local handoff history. No force push or history loss.
Verified source checkpoint: [`8bf70aeebe5842be130395483daef9e832733ac7`](https://github.com/HarryBurd33/claude-mods-for-codex/commit/8bf70aeebe5842be130395483daef9e832733ac7).
Local branch was aligned to that verified commit. Its tree
`079fc8bd0973405318efd4ec2055ca22ba723f52` exactly matches the original local
checkpoint `c13555083e0f6d5413263ab39bea58a77dd49f51`, preserved on
`codex/astra-local-checkpoint`. Terminal push lacked credentials; the connected
GitHub integration uploaded the reviewed tree with public main as parent.
Fetch, full-tree comparison and ls-remote independently verified it. No force push.
This handoff-record follow-up also fixes one CRLF-sensitive test; its final
commit is verified separately in the human switch message and private handoff.

## Completed, partial and unverified

- Completed groundwork: all ten Claude pages, relevant admin/security/permissions,
  primary examples/licenses/issues, current official Codex/released source,
  theme release correction and93-row ledger. REA was not rerun because public
  source resolved concrete uncertainties; old REA metadata was not semantic work.
- Actual native proof0.0.2: installed/updated via supported CLI, user-reviewed
  trust independently confirmed for three hooks; BEFORE→AFTER executed, DENY
  blocked, UNCHANGED unchanged in desktop; actual owned MCP App click+refresh.
- Implemented offline: scoped metadata state, bounded stdio MCP proof, fixed
  rewrite/deny, sanitized native inventory utility, packaging migration and CI.
- Partial production: compatibility manifest0.1.1-dev.1 and the existing notice/
  lexical deny/journal/management skill. New state/UI/transformations are separate
  foundations, not production integration. Production plugin is not installed.
- Unverified: negative permission boundary, SessionStart delivery, native hold/
  elicitation and cancel/failure paths, routing runtime, full UI lifecycle/
  accessibility, native Windows, final uninstall/cache/process cleanup/restore.
- Incomplete implementation: richer owned UI, blast-radius, filetree,
  replay-theater, passive token/cache views, theme integration, authoring workflow,
  new debugging/verification/review/scaffolding skills. Ledger keeps all in scope.
- Policy exclusions: automatic permission approval, prompt rewriting, secret
  collection, paid keepalive, private-app injection/patching. A major separate
  client direction requires user agreement. Unsupported exact native styling
  must have evidence and a clearly labeled useful alternative.

## Decisions, evidence and contracts

- **Compatibility-only packaging is essential.** Root portable plugin.json causes
  released0.163/0.164 to skip hooks; a .codex-plugin overlay does not override it.
  Legacy .mcp.json uses relative cwd/args and does not inject plugin variables.
  CODEX-CONTRACTS links exact release loader/normalization/selection source.
- PreToolUse rewrite needs allow+updatedInput; it is a carrier into normal tool
  permissions, not permission approval. Bare allow/ask are invalid. Do not expand
  production output validator without the typed proposal adapter in ARCHITECTURE.
  Native harmless execution + release ordering evidence is not a negative test.
- Native hold candidate: synchronous mcp_tool hook plus nonempty form elicitation,
  required confirm boolean and explicit accept/true/provenance. Acceptance returns
  {}, decline/cancel returns deny; never PermissionRequest approval. Errors can
  still fail open at host boundary. Validate before advertising this feature.
- 0.163 hashes hook definition, not referenced JS contents;0.164 adds bundle
  content trust checks. Keep source/cache separate, disable before update, review,
  reinstall and human retrust. Never mutate trust or auto-trust generated code.
- Local hook/MCP OS authority differs from model tool sandbox. No network port or
  external request in proof, no secret/transcript access, metadata-only storage.
- New configured task/agent routing is supported by documented model selection;
  intercepting existing inference is not. Additional runs consume usage and must
  be visible, authorized and bounded. No development model-switch bypass.
- TUI prose themes shipped0.164; installed0.163 lacks them. Prismantis README was
  stale on release status; custom native fenced renderer remains an open proposal.
  No fork code substituted or upstream implementation copied.

## Exact code locations

| Location | Contract / current role |
| --- | --- |
| .codex-plugin/plugin.json | Production0.1.1-dev.1 compatibility manifest; no root portable file |
| src/dispatcher.mjs, src/hook-main.mjs | Existing deterministic deny-only production boundary; dispatch/assertSafeOutput and hook entrypoint |
| src/state.mjs | metadataScopeKey, recordMetadataEvent, readMetadataState, observeMetadataState, pruneMetadataState; explicit scope,64-scope cap, bounded journal, POSIX-only private storage |
| src/journal.mjs | Existing locked bounded metadata journal; probe aggregate source |
| proofs/rewrite.mjs | Disabled-by-default proofHookResponse; installed wrapper enables only exact fixed markers; no arbitrary rewrite |
| proofs/hook.mjs | Bounded event stdin, fixed probe responses, metadata projection; never executes tool input |
| proofs/server.mjs, proofs/ui.html | Local stdio MCP tools mods.proof/mods.status, fixed UI resource, local click/manual refresh, timeout/teardown; no model calls |
| proofs/prepare.mjs | Exclusive private disposable snapshot generation; no config or trust change |
| proofs/inspect-native.mjs | initialize/initialized/hooks-list/plugin-read only;20s/2MiB limits; sanitized own inventory, no approval/model turn |
| test/{state,proofs,rewrite,native-inspection,package}.test.mjs | New focused tests; native-inspection peers and UI bridge are mocks, not H evidence |
| .github/workflows/ci.yml | POSIX full offline matrix and limited Windows protocol/package lane; no native Codex tests |

## Commands run and observed host

See TEST-LOG for exact outcomes and limitations. macOS14.6, Node24.22.0,
CLI0.163.0; desktop26.1016.62342 build21477. CLI0.164 researched, not installed.

- npm test:74 passed/one Windows-only skip; validation/replay pass.
- Initial remote CI:all four Ubuntu/macOS Node22/24 full suites pass. Windows
  portable lane initially9 pass/one failure due to LF-only skill-header test.
  CRLF fix passed the subsequent remote run40009074164 on tested commit
  da8d01dd65b015455d5a1cb47b9e1d6aa7500e87, including all five jobs. Native
  Windows Codex/storage support remains unverified. Final follow-up is docs-only.
- npm pack --ignore-scripts --offline and clean space-path extraction: package
  boundary inspected; offline tests/validation/replay passed at recorded revision.
- CLI marketplace add, plugin add, plugin remove then add: success for proof only.
- node proofs/inspect-native.mjs --project <absolute-disposable-project>
  --marketplace <absolute-marketplace-json>: three trusted hooks, enabled0.0.2,
  MCP present, no warnings/errors. No turn or trust mutation.
- Actual desktop exec commands BEFORE/AFTER, DENY, UNCHANGED and activity: recorded.
- Real MCP Apps DOM interaction + screenshot: connected host, button and refresh.
- Native app computer-use access blocked by tool policy; not bypassed.
- Ephemeral app-server thread/start with no turn: no SessionStart evidence.

## Installation, configuration and rollback

Only claude-mods-native-proof@claude-mods-dev0.0.2 is installed/enabled/trusted.
The user completed the exact changed-package trust review. Keep it unchanged
until a newly reviewed update. It is user-profile/cache scoped, not project-only.
Production is not installed. No client/model/permission setting was changed.
Private config backup exists; unrelated entries compared unchanged. Source
snapshots, metadata and exact locations are in ignored local HANDOFF.

To remove using supported CLI:

```sh
codex plugin remove claude-mods-native-proof@claude-mods-dev --json
codex plugin marketplace remove claude-mods-dev --json
```

Stop affected sessions and verify hook/MCP absence before optional data deletion.
Retained snapshots/data/backup are separate from registration. Preserve unrelated
settings; never restore the entire old config over later changes. Reinstall only
reviewed snapshots and request human trust for changed code. Setup/removal docs
cover the production identifiers separately. Do not edit installed cache directly.

Known low-priority proof debt: MCP initialize reports0.0.1 while installed package
is0.0.2. Align in the next reviewed snapshot; this did not change actual inventory
version. Do not silently replace the trusted installation solely to fix it.

## Next tasks, priority and acceptance

1. **Consolidate native safety evidence.** Read existing logs instead of repeating
   research. Design fixed harmless negative permission and synchronous MCP-hook
   elicitation tests. Preserve selected model; announce and obtain any necessary
   authorization before an additional model turn. Human trust after code changes
   is required. Accept only observed rewrite still blocked by normal permission,
   explicit confirm/decline/cancel behavior, bounded timeout/disconnect, documented
   fail-open limits. If host blocks proof, record exact blocker and use deny/retry
   approximation without claiming native hold. SessionStart needs real delivery.
2. **Integrate safe contracts.** Versioned adapter for abstain/notice/deny/typed
   transform; deny wins, conflicts rejected, no security/prompt/model mutation.
   Wire explicit project/session metadata and bounded observation to MCP status.
   Acceptance: opt-in scope, concurrent retention/privacy/cancel tests, real hook
   updates in UI, no arbitrary path/tool bridge, visible before/after.
3. **Build coherent useful owned UI.** Bounded Git-aware explorer, read-only edits
   inspector, lexical impact explanation, passive usage/cache states and rich
   rendering. Select project explicitly, reject escaping links/special files,
   exclude secrets/ignored paths, bound Git/process/output. Restore separate and
   explicit. Accept actual host lifecycle, accessibility and missing-data behavior.
   Native bands/restyling need public support evidence; label alternatives.
4. **Authoring and skills.** Describe→scaffold→permissions→validate/replay→review→
   supported install/update/human trust. Add original debugging, verification and
   review-preparation automations with narrow triggers, usage and permission limits.
   Accept one complete harmless authored mod flow, no auto-trust/hot-reload claim.
5. **Compatibility and finishing.** Native Windows ACL adapter and real-host test
   plan; CI portable success alone is insufficient. Theme integration on supported
   version only with reviewed config backup/rollback. Verify production install,
   update, disable/removal/restoration and clean public clone at final revision.
   Audit every ledger row, update README and independent review; no finished
   release while supported requested capabilities are merely roadmap entries.

## Required user action and resume instruction

No new authentication or permission approval is currently pending. The immediate
user action is the model switch. Further changed-hook trust and any protected
host action must be prepared concretely and performed by the human when needed.

Copy and paste after selecting **GPT-6.1 Sol, Ultra**:

> Continue Claude Mods for Codex on branch codex/astra-groundwork. Read
> docs/continuation/STATUS.md, REQUIREMENTS.md, ARCHITECTURE.md, TEST-LOG.md and
> HANDOFF.md, then the referenced research/contracts and ignored local HANDOFF.md
> for machine-specific setup. Preserve existing work and private history. Astra
> groundwork is complete, not the full product. Follow the prioritized tasks and
> all93 requirements; begin with remaining native safety proofs and integrate the
> verified compatibility packaging, hook, MCP UI and state foundations. Keep
> production and proof claims separate. Do not change my selected model, bypass
> permissions/trust, or introduce a major separate client without agreement.
> Make meaningful safe development checkpoints, test and upload them, and verify
> GitHub. When Ultra is no longer needed, choose one exact cheaper setting, save
> a complete handoff, commit/upload/verify, then stop for me to switch. Do not
> delegate or continue in the background past that human-controlled gate.
