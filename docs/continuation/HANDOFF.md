# Proposal36.1 reviewed — next GPT-6.1 Sol Medium

2026-10-26, America/Denver. Sol High resumed **ce02f5a** for inspection-only activation
**review and artifacts**. That bounded stage is complete. No production/source/gate
implementation change, Codex invocation, inference, installation or host config/trust
write. Installed31 and scoped logging/parent model/Windows guards are unchanged.
All gates remain closed. Full93/native routing/nativeWindows acceptance is incomplete.

Read INSPECTION-ACTIVATION-DEV36.md, STATUS.md, REQUIREMENTS.md, ARCHITECTURE.md,
latest TEST-LOG.md, RESUME-PLAN.md, PACKAGE-DEV36.md, CI-DEV36.md and the latest ignored
root HANDOFF.md. This new proposal supersedes the prior next-step activation review;
sealed35.1 and immutable source36 remain historical evidence, never permission.

## Decisions and blockers

**Do not activate source36 as-is.** The review traced pinned release-source
6aaac694803004a63c6f393d153c96d22521a6b9, not a fresh binary/version run:

- Native spawn lacks OS cwd; the reviewed CLI app-server arm does not forward
  interactive -C into its startup options. Server startup uses current_dir. A later
  inspection transport must explicitly set verified cwd and test all cwd identities.
- Before the inspector's first response, startup loads cloud config/auth, initializes
  SQLite/log/installation state and schedules an Online model-catalog refresh. No
  outgoing model/list RPC does not mean no host catalog/network activity. No inference
  request was sent here. A read-only tool policy does not sandbox the host process.
- Remote control defaults to ResolvePersisted. --no-daemon/stdio is insufficient
  evidence that other connections are excluded. A supported process-local exclusion
  is unresolved. No undocumented environment/debug control, persistent setting edit
  or installed client patch is proposed as a workaround.
- Plugin startup warmups have a separate path; full exclusion with plugins=false has
  not been traced. Listing's proposed migration avoidance is not a startup guarantee.
- Prepare a separate **closed** inspection contract/entry under future explicit
  implementation scope. Keep routing requireLiveAdmission and existing native entries
  unconditionally closed. No arbitrary executor/transport injection or caller grant.
- A concrete implemented/reviewed artifact and exact fresh inputs must precede a
  separate human native invocation grant. Inspection never authorizes routing/model
  usage. Existing accepted ordinary-read-only routing design remains design only.

Primary links, code locations, exact change contract, limits, protocol, privacy,
acceptance cases and practical blocked alternative are in INSPECTION-ACTIVATION-DEV36.
Two guessed source paths returned404 and supplied no evidence. Seven actual public
source files were retrieved/pinned privately. No complete upstream/source audit claimed.

## New protected difference — preserve, do not silently accept

The original source36 preservation checker **failed** on one newly added projects
trust_level entry. Read-only comparison/removing only that addition in memory exactly
reproduces the prior source36 protected digest. All earlier protected fields match,
including the previously human-attested seven global hooks.state additions. New
entry origin/intent is **unknown**; no provenance/definition trust/grant inferred.

Leave it unchanged. Do not overwrite the old checker/baseline or refresh sealed plans.
A separate private observation records the mismatch, not a new accepted baseline.
Fresh native-input acceptance is blocked pending reconciliation. Independent owned
checks passed installed31cache251/settings/data/sources/marketplace. Expected human
model-picker fields remain excluded only from the earlier protected comparison.

Current private VERIFY.py detects any subsequent raw-config difference as another
stop/classify condition. It does not make the original protected check pass and is
not permission. New metadata is distinct from the already reconciled old seven global
entries; do not reclassify/revert those or disable callbacks to obtain an empty list.

## Artifacts and actual verification

Private ignored revision36.1 contains ACTIVATION-PROPOSAL.json (blocked, closed),
HISTORICAL-ARGV.json (rejected old launch draft), PROTOCOL-DRAFT.json (pure simulated
requests), SOURCE-PINS.json, ACCESS.md, protected-drift-paths.json, PRESERVATION.json,
CLOSED-ENTRY-CHECK.json, VERIFY.py, HASHES.json, VERIFY-RESULT.json and seven fetched
primary-source files. All private files0600/folder0700; exact paths only local.
No new runnable PLAN/INPUT, binary hash refresh, current candidate/config plan,
transport grant or gate patch. Old34/35.1/source36 records and archives preserved.

Actually performed:

- Read-only protected comparison/classification and independent owned checks above.
- Pure Node createNativePlan/createReadinessMachine simulation with historical paths
  and synthetic replies: exact five requests plus initialized, conditional same-cwd
  reads/hooks listing, observation-complete with admission/native-verification false.
  No transport or raw response retention. This is not a native proof.
- Four existing native exported/from-file entry calls with throwing Proxy inputs:
  exact existing fixed refusal, **zero getter reads**, no selected-file IO/spawn. First
  ad hoc assertion expected different wording; corrected to the exact unchanged
  message and all four passed. No product source was changed for this harness issue.
- Artifact verifier checks private/public byte pins/modes,14runtime pins/test pin,
  sealed35.1/old34/source35 review/34+35archives, protocol/closed status, added-entry
  comparison and independent owned state. See private VERIFY-RESULT for final counts.
- Public local-link/privacy,93 ledger IDs/order, no source/default/security edits and
  git diff checks. No new broad tests, CI retry, package or native invocation needed
  for review/document-only changes. Earlier source36 tests/package/CI remain exact.

## Concurrent chat reconciled

A second chat created a local checkpoint binding and added /.checkpoint/ to .gitignore
while this stage was active. Shared writes paused; the human confirmed that chat was
told to stop until this stage finishes. Its original checkpoint/input/review remain
preserved. A fresh task-checkpoint state/review acquired the unowned local lease for
this bounded publication; no ownership was stolen. Only this stage's11public Markdown
files are committed. The other chat's .gitignore addition remains **unstaged**, so a
fully clean worktree is not claimed. Local checkpoint verification/release and final
synchronized identity are recorded privately. Do not initialize a second binding or
restore over the other chat's state. After this stage, coordinate a single writer.

## Immutable source and compatibility evidence retained

Implementation9833caf2c065f5ffc0419ff57674a3fe98b0632b/tree185e73b762669b6d255363c9d3377633f156b71f;
package0.2.0-dev.36:305files, SHA2561cb64ec70223ee853b5ec00e314ea810405ed8713b82340f54f09a85d48e18c4.
Packaged selected140pass0fail2skip/validate3/replay4. Exact CI40265830772 failed overall:
four POSIX lanes307pass0fail113skip420total, Windows portable readiness15pass2POSIXskip;
both Windows integrations retain known Image/linkcount2 refusal. Original bounds cause
and nativeWindows11/WSL acceptance remain unresolved; no Windows assertion/guard change.
Last historical hostmacOS14.6/Node24.22.0/CLI0.164; Node24.22.0 observed in this stage's
pure checks, CLI version not re-invoked. Source36 uninstalled; enabled installed31 kept.

## Next exact setting and acceptance

**GPT-6.1 Sol Medium** for routine proposal/document verification only:

1. Confirm branch and expected dirty state (the other chat owns an unstaged /.checkpoint/ ignore rule); read this handoff. Run the private revision36.1
   verifier once; inspect failed-check classification without accepting/restoring it.
   Any new difference => stop High for read-only classification, no baseline rewrite.
2. Verify proposal/public links, exact hashes/closed flags/five conditional reads and
   source findings. Do not rerun package/CI/source35/classifier research. No native
   PLAN/INPUT refresh, version query, process settings or native call.
3. Summarize the concrete next implementation decision: future Sol High, fresh
   explicit offline scope for a separate closed inspection contract, explicit OS cwd
   and supported startup/remote-control boundary investigation. Gate opening/native
   authorization are later decisions, not implied by that offline scope. Do not
   attempt consequential source/security work on Medium or ask to run an unimplemented
   native artifact. If no supported exclusion exists, retain the blocked alternative.
4. Save/upload/verify meaningful safe progress before stopping. Avoid another cycle
   that merely repeats completed packaging/research. Preserve macOS-first/full ledger.

No user action is required to preserve this checkpoint. No restart/trust/install/
rollback step; removal means deleting only new review artifacts, not host state.
No owned local background work/model continuation/automation was started. Upload may
trigger existing remote CI, but its result is not substituted for immutable36evidence.

Branch [codex/astra-groundwork](https://github.com/HarryBurd33/claude-mods-for-codex/tree/codex/astra-groundwork).
The exact new synchronized commit is recorded in the final/private handoff after
non-force upload and independent readback; do not guess a self-referential SHA here.

## Complete resume instruction

“I've switched to GPT-6.1 Sol, Medium. Continue from the verified proposal36.1 checkpoint
on codex/astra-groundwork. Read docs/continuation/HANDOFF.md and the ignored local
handoff; verify the proposal artifacts and documentation only. Preserve installed31,
approved settings, current preferences/unrelated project entries, scoped logging,
parent model, human trust and Windows guards. Keep all gates closed; no Codex,
inference, installation, config/trust change or native-input refresh. Keep the new
project trust entry's unknown intent and failed original preservation check explicit;
do not accept a new baseline. Stop for High before source/security work or new drift.”
