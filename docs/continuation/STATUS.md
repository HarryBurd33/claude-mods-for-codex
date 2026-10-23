# Current continuation status

Updated 2026-10-23. **Astra groundwork checkpoint; full product incomplete.**
This directory supersedes old MVP exclusions and completion statements. The
next stage is human-selected GPT-6.1 Sol, Ultra; read [HANDOFF.md](HANDOFF.md).

## Starting state and history

Initial local main was clean at `6c59e98`; public main was
`4f2c0be0e734cad5d4769c840c43e02e298cc053`. Public file contents matched; local
history additionally tracked private HANDOFF. Original local main/commits are
preserved. `codex/astra-groundwork` starts from public main, so it does not upload
private local history. Root HANDOFF.md and .local/ are ignored. No force push.
An older public commit already contained an old handoff; this work does not
rewrite that history or claim historical exposure was removed.

## What is established

- All ten Claude Mods pages and relevant admin/security pages retrieved, primary
  sample repositories/licenses/issues reviewed, 93 requirements accounted for.
- Released Codex 0.163/0.164 source exposed a packaging discrepancy: portable
  manifests load MCP but skip hooks. Compatibility-only proof 0.0.2 corrected it.
  Production source migrated to compatibility-only `0.1.1-dev.1`; not installed.
- Proof plugin installed in this user's Codex profile/cache; user trusted three
  hooks. Native inventory independently confirms all three trusted and enabled.
- Actual desktop covered tool events: fixed BEFORE→AFTER rewrite, DENY blocked
  before execution, UNCHANGED control unchanged. Source corroborates ordinary
  permission handling after rewrite; negative sandbox/approval proof is pending.
- Actual plugin-owned MCP App connected to the desktop, rendered, accepted local
  clicks and refreshed hook metadata from 22 to 29 records. This is explicit
  refresh, not automatic subscription or native transcript restyling.
- Isolated metadata-state library implements bounded concurrent writes,
  observation, retention and privacy. It is tested but not production-integrated;
  the native probe uses the older bounded aggregate journal.
- Runnable offline validation/replay/tests and bounded read-only native inventory
  utility. Latest counts and CI observations belong in [TEST-LOG.md](TEST-LOG.md).

## Actual environment and installed scope

macOS 14.6 (23G80), Node24.22.0; CLI0.163.0; desktop com.openai.codex / ChatGPT
26.1016.62342 build21477. CLI0.164.0 was researched, not installed. The system CLI
version must not be attributed to the desktop's bundled runtime.

Only `claude-mods-native-proof@claude-mods-dev` is installed for this work; it is
user-profile scoped, not project-only. Source snapshots, config backup and event
metadata are private/ignored. Runtime has no network/model calls and stores no
commands/prompts/transcripts. Hook/MCP local process authority differs from the
model shell sandbox. Production plugin is not installed. Removal steps are in
TEST-LOG and HANDOFF. The unchanged reviewed proof is left available for Sol.

## Incomplete and blocked

Production UI, safe general input transformation, native human hold, expanded
events, explorer, changes inspector, usage/cache views, theme integration and the
new authoring/debug/review/verification skill collection remain incomplete.
All remain in the ledger with acceptance tests. Native SessionStart delivery,
permission-negative checks, model-routing runtime, broader UI lifecycle and
accessibility, production install/update/remove and native Windows are unverified.
Windows scoped storage explicitly refuses operation pending ACL work.

Native computer-use access to the desktop app was blocked; no workaround was
used. The permitted MCP Apps interface did allow actual owned-panel inspection.
No additional model/API turn was launched for proofs. An ephemeral app-server
thread without a turn produced no SessionStart evidence. MCP elicitation is a
released-source candidate for a native hold, not yet a proved feature.

## Model stage

User-requested stage: GPT Astra, Ultra, including inherited same-stage research
workers. No Sol worker was used to bypass the human switch. A usage check did
not establish reliable Astra-specific remaining allowance; work is preserved
before another long investigation. Next: GPT-6.1 Sol, Ultra for integration and
remaining permission/hold work. Do not announce full completion at this gate.
