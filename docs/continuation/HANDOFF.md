# Dev7 Windows storage checkpoint — next GPT-6.1 Sol, Medium

2026-10-23. **Full product incomplete. Human-controlled stopping point after
upload/readback.** High resumed from23888dd and completed the scoped Windows
private-storage/security milestone. Next exact setting: **GPT-6.1 Sol, Medium**.
Routine verification/package/docs/native-step preparation fits Medium. A new
Windows Git/project/restore adapter or approval/security architecture needs another
saved High switch; do not remove those gates as a routine fix. No background
continuation, substitute subagent or internal model switch.

## Read and preserve

Read STATUS.md, REQUIREMENTS.md, ARCHITECTURE.md, TEST-LOG.md, ../windows-storage.md,
../runtime.md, ../privacy.md, ../authoring.md, ../removal.md and latest ignored root
HANDOFF.md. Root HANDOFF.md/.local contain private paths, evidence, settings,
backups/scripts/exports; never publish them or original private historical commits.
All93ledger rows remain in scope; do not call the expanded product finished.

Repo https://github.com/HarryBurd33/claude-mods-for-codex
Branch codex/astra-groundwork; main remains historical experimental MVP.
Verified runnable source:
[f63ebabec8730cbfaa2e39a7f5e3ae2f58438838](https://github.com/HarryBurd33/claude-mods-for-codex/commit/f63ebabec8730cbfaa2e39a7f5e3ae2f58438838),
tree5d521c5133bba1620ea39d038544ef1986575d5e. Local HEAD was aligned only after
GitHub upload, fetch and exact whole-tree equality. Original equivalent local
2a055e53e2238eb042e00451d65d820171edf58c preserved on
codex/windows-integration-local-checkpoint. Earlier local equivalents also retained,
including codex/windows-budget-local-checkpoint; original local main untouched.
Final records/package checkpoint identity is reported after upload/readback in the
switch response and ignored local handoff; a file cannot contain its own commit ID.
No force-push or private-history merge. Connected GitHub expected-parent ref update,
not unauthenticated terminal push, is the working write path.

## What High implemented

Source/package/compatibility manifest/server0.2.0-dev.7; **not installed**.

- src/windows-storage.mjs: strict local drive-absolute path syntax,240UTF-16 bound,
  fixed system Windows PowerShell5.1 -File argv/cwd, narrow OS environment, no shell/
  profile/module discovery/policy override/elevation/network/model call. ASCII v2
  pipe/base64 framed IPC32KiB request/3MiB response; canonical response validation,
 15s default+500ms owned-tree cleanup, validated AbortSignal/pre-abort/no raw errors.
- src/windows/private-storage.ps1: .NET Framework CodeDOM compiles only fixed public
  original C# source, in memory,/noconfig; no request/config text compilation. Normal
  execution/application-control/language policy may refuse and must not be bypassed.
  Compiler-managed scratch contains public source, not requests/private file bytes.
- src/windows/PrivateStorage.cs: same-handle owner/DACL/type/link/identity checks,
  pinned no-reparse ancestors, fixed local NTFS/persistent ACL only. Protected
  current-user/SYSTEM/Administrators descriptor at creation, never repair existing
  ACLs. Bounded cooperative journal/rotation/read retry, no lock stealing. State
 64hashed scopes/two1MiB files; explicit cutoff plus locked fresh byte digest prune.
  Trusted OS admins/TrustedInstaller and hostile same-user processes outside claim.
- src/journal.mjs/state.mjs/windows-state.mjs/usage.mjs: public journal/state/report/
  explicit usage reads route through native helper on Windows; POSIX retained.
  Shared strict metadata encoder/parser, no raw envelope/secret/transcript logging.
- src/windows-hook.mjs/hook-main.mjs/scope.mjs: optional Windows telemetry shares
 1500ms+500ms cleanup below host5s hook deadline. Exact explicitly selected native
  cwd string only; no descendant/casefold/workdir inference or filesystem scope walk.
  Unavailable telemetry does not replace dispatcher deny/rewrite. No new observers.
- State observation/MCP activity and selected-export reads propagate cancellation.
  No additional model/API evaluation. Do not put default15s writer in hook path.
- runtime-settings.mjs refuses Windows configured dashboard before filesystem IO;
  workspace.mjs selectedRoot refuses every Windows project/Git entry before IO/
  spawn. Existing POSIX Git PATH/project cwd/scratch cannot be safely ported by
  removing storage refusal. Windows restore remains refused before IO.

Stable dispatcher v2: abstain/notice/deny/exact command-only replacement, paired
allow+updatedInput continues normal permissions. No PermissionRequest approval,
user-prompt/model mutation, arbitrary mod code/network load or paid keepalive.
Private reader success is not proof of a safe project writer or native sandbox.

## Tests actually observed

[Primitive CI40033656920](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40033656920),
sourcef152acb: all7jobs success;15/15 on each Windows22/24 lane. Earlier failures/
diagnostics preserved in TEST-LOG, not erased as if the first candidate worked.

[Integrated CI40035478192](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40035478192),
sourcef63ebab: all7jobs success. Each Windows22/24 native lane20pass/0fail/0skip
(17Windows-only cases+3portable predicates). Windows Server2025 Datacenter10.0.26100,
imagewindows-2025-vs2026 20261021.278.1; Node22.23.4/npm10.9.9 and
Node24.22.1/npm11.19.1, fixed Windows PowerShell5.1/.NETFramework.

Tests: protected private read/create; broad/inherited/wrong-owner/null ACL/broad
allow despite deny/mutable ancestor refusals; spaces/BMP/non-BMP Unicode; hardlink/
junction refusal; concurrent journal/state, read no writes, rotation/unsafe archive,
held locks, explicit retention/hash mismatch, session isolation/observed revision,
public report/usage CLI privacy, cancelled owned helper+child cleanup/pre-abort,
exact scope/no effects, synthetic Windows hook subprocess deny with stalled helper
under3.5s. The fixture command is never executed. A subprocess is not native Codex.

Local macOS Node24.22.0 full npm test169pass/0fail/20Windows-only skips189total;
focused35pass/19skips54total. npm run validate3mods/default replay4fixtures pass.
Anonymous credential-helper-disabled public clone at exactf63ebab/tree reran
169pass/0fail/20skips, validate/replay pass. Initial restricted DNS clone failed;
authorized network escalation succeeded. A137-file documentation archive was inspected/extracted in a path with spaces;
validate/replay passed, every runtime/test/config/UI/package asset byte-equal the
fully tested anonymous clone. Final record rebuild/inspection and remote identity
are reported after observation in the ignored handoff/switch response; no full
suite repeat after docs-only changes is implied.

## Installed host and unchanged authority

Production claude-mods-for-codex@claude-mods-production-dev0.2.0-dev.6 remains
user-profile installed/enabled/human-trusted. Prior native host macOS14.6arm64,
desktop26.1016.62342build21477, Node24.22.0; systemCLI0.163.0 separately. No upgrade.
No Windows11/native Codex/Linux/WSL host available; Windows CI is OS primitive/
process evidence only. No source7 installation/live hook/UI/sandbox claim.

Prior dev6 actual permitted MCP Apps six views/preview/nested files/selected diffs/
passive usage and authored harmless print rewrite/control/deny passed. Supported
same-snapshot remove/add verified fresh-session absence,125exact files restored,
3trusted hooks/zero errors and exact parsed config/settings preservation. Already-
loaded unload/UI disable/older-version rollback still unverified. Original proof
retained; hold0.0.4 removed/namespace absent after prior restart. Prior hold accept/
decline/cancel/30s timeout and sandbox-negative results are version-specific, not
production enforcement: human provenance/disconnected fail-open unresolved.

This High stage changed no machine config/install/cache/trust. Same selected
private project/data/settings/scope/retention/patches/commits/export. Actual installed
mods.activity after source integration:4records/same revision. Chat cwd outside
selected child project; no capture is correct. Never infer scope from a shell
command/workdir or broaden it. Optional observers remain off/unregistered; theme
unapplied. Prior single bounded native model run grant consumed. No additional
Codex/model/API evaluation, secret/session discovery or subagent authorized.

Human selected/reported stages: Astra Ultra groundwork/proofs; Sol Ultra demanding
hold/integration; Sol High dev4/dev5 integration; Sol Medium dev6 native/packaging;
Sol High dev7 Windows storage security. Next is human-selected Sol Medium.

## Next tasks in priority order and acceptance

1. **Routine current-feature/ledger audit.** Resolve stale pending claims against
   already recorded evidence (e.g. management skill discovery now observed). Keep
   all93rows, supported unfinished work and per-version/OS evidence separate. Check
   docs/setup/removal/CLI help/access matrix for source7 vs installed6, original MIT/
   independent disclaimer and source-only Windows limits. Acceptance: no current
   summary contradicts tests; no native/full-completion claim from mocks/OS CI.
2. **Existing safe skills/review workflow.** Read the packaged debugging/verification/
   review/scaffolding skills when invoked; use synthetic disposable fixtures to
   verify the coherent collection without another independent model evaluator.
   Acceptance: scope/permissions/triggers/model-usage limits clear; no prompt/model
   rewrite, arbitrary code/trust/network grant or automatic publish. Record actual
   skill use separately from static/package tests.
3. **Native acceptance preparation.** Prepare short concrete steps for human
   keyboard/resize/close-pending, supported disable/re-enable/older-version rollback
   of immutable snapshots and native theme choice. User previously found broad
   accessibility request unclear: use one or two visible actions, explain expected
   focus/behavior. Do independent routine work while answers pending. Changed-code
   install needs reviewed immutable snapshot+human hook trust/restart; do not install
   source7 merely to collect Windows evidence on macOS or repeatedly re-trust dev6.
   Acceptance: exact before/after/fallback/restore check, protected actions human-
   controlled, unrelated entries/data preserved. No extra model run inferred.
4. **Windows/native blockers explicitly unfinished.** Need a real Windows Codex
   host and separate stronger review before enabling configured dashboard/project/
   Git/restore. Git acceptance: absolute trusted local executable, private atomic
   scratch, trusted cwd/env, no project executable/helper/config launch, reparse/
   streams/UNC/special-file bounds, no outbound operations and owned process-tree
   timeout. Restore acceptance: private plans, explicit decision, no-follow current
   identity/conflict/metadata preservation/interruption and normal sandbox checks.
   Do not hand these risky implementations to Medium or simply remove refusals.
   Preserve requirements and prepare a High switch when host/implementation work
   becomes concrete. Native guard allow/deny/rewrite/permission matrix, install/
   update/trust/disable/remove and user-policy-blocked helper refusal need that host.
5. **Checkpoint meaningfully.** Package/public-clone/source CI verify relevant
   changes, keep private evidence ignored, publish safe development progress with
   expected-parent/non-force upload, fetch/tree diff/independent remote readback.
   Stop for exact stronger/cheaper human setting when warranted. No automation.

## Setup/update/disable/removal/rollback

No config rollback required for this stage: source-only, installed dev6 unchanged.
Use docs/setup.md and docs/removal.md supported plugin operations for the owned
identity. Keep original proof/other entries; never restore an old full shared config
or write trust hashes. Prior immutable snapshots/settings backups are private.
A future source7 update needs code/access diff, source/package tests, supported
versioned install, human changed-code review and restart. No hot-reload/trust bypass.
Removal does not delete settings/data/plans; inspect separately after stopping
writers. Windows locks never stolen; explicit prune is metadata retention only.

## Complete copy-and-paste resume instruction

> I switched to GPT-6.1 Sol, Medium. Continue Claude Mods for Codex on
> codex/astra-groundwork from the verified dev7 Windows storage checkpoint. Read
> docs/continuation/{STATUS,REQUIREMENTS,ARCHITECTURE,TEST-LOG,HANDOFF}.md,
> docs/windows-storage.md and latest ignored root HANDOFF.md. Source7 has NTFS
> handle/ACL journal/state/selected-export integration, exact-root short-budget
> optional hook telemetry and owned-helper cancellation; Windows22/24 CI20/20
> each, all7jobs passed. Installed human-trusted dev6 is unchanged, activity4/same
> revision, same logging scope/retention, optional observers off, no extra model
> run. Continue routine ledger/skill/review/package/docs and concrete native
> acceptance preparation. Keep Windows configured dashboard/project/Git/restore
> refused before IO until a real native host and separate High security review;
> do not silently drop those incomplete requirements or weaken gates on Medium.
> Preserve human trust, private paths/history, selected model and permissions.
> No additional Codex/model/API evaluation or subagent is authorized. Stop/save/
> upload/verify and request High before any new risky architecture, or a cheaper
> setting when sufficient. Do not claim the full93-capability product complete.
