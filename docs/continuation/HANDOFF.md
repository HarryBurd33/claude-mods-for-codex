# Source33 routing dry driver — next GPT-6.1 Sol Medium

2026-10-25. High resumed **327f0be** on **codex/astra-groundwork**. Implemented
and dry-tested the scoped routing protocol/admission/cancellation driver. No native
Codex process, model inference, profile installation or current chat model/config/
logging/trust/Windows change. Live gate remains closed and no native adapter exists.
Full93 incomplete. Medium is sufficient for routine CI/package verification now.

Read STATUS.md, DEV33-REVIEW.md, docs/routing-driver.md, NATIVE-ROUTING-TEST-PLAN.md,
REQUIREMENTS.md(EV15/EV16/SEC), ARCHITECTURE.md(source33 driver), TEST-LOG.md latest,
PACKAGE-DEV32.md and ignored root HANDOFF.md. Older no-driver plan notes are historical.

## Checkpoint identity

Starting local/verified public parent **327f0be2fe2723c19a7f06ac27a75c7b5405eb06**,
full tree **6490406331ab13bdd471f30e1eeb551f5a809e4d**.
[Starting checkpoint](https://github.com/HarryBurd33/claude-mods-for-codex/commit/327f0be2fe2723c19a7f06ac27a75c7b5405eb06),
[branch](https://github.com/HarryBurd33/claude-mods-for-codex/tree/codex/astra-groundwork).
Source32 immutable package/CI identity remains cbacb52 per PACKAGE-DEV32, not source33.
The current implementation local equivalent, verified remote commit/full tree/ref
and GitHub link are recorded after safe non-force upload in final/private record;
never guess a self-referential commit hash in this file. Preserve all local commits.

## Verified source33 implementation checkpoint

Local aligned source commit and independently verified remote:
**1427bc5c3318e960955d9fb25e442a5fccd59d26**;
full tree **26e12da269d334b495c4deed0ff23006e509090a**. GitHub tree creation matched
local source; non-force expected-parent update, fetched full-tree comparison,
connector source readback and anonymous public ref agreed. Original local
ffe6b4b93d09a2e30664d48544fc4036e5a5948c retained separately, not lost.
[Source33 checkpoint](https://github.com/HarryBurd33/claude-mods-for-codex/commit/1427bc5c3318e960955d9fb25e442a5fccd59d26).
This notes follow-up records the already verified implementation identity; its
final ref is independently verified and reported in final/private record.
Source33CI/package remain pending Medium; upload is not test evidence.

## Completed / partial / unverified

- Six proof modules implement constants/contracts, pure protocol machine, framing,
  fixed fixtures, synthetic peer and bounded process runner. Only current Node+
  fixed peer/env{}+enumerated scenario is executable. No command/path/URL/model/
  config/grant/transport option. --live is refused before peer start. Existing31
  remains enabled/usable; source33 is uninstalled and adds no MCP tool/launcher.
- **Native admission is closed by construction**, not an unverified boolean opened
  by a claim. No native transport exists. The separate mock action gate denies
  unknown/extra actions before mock dispatch; exact no-history role spawn/model-
  override refusal/one child/eight waits enforced only in synthetic peer. Do not
  confuse this with a verified Codex tool gate.
- Pure controller handles actual public V1/V2 event shapes, own scope/metadata/
  expected outputs, unavailable/misleading evidence, monotonic usage and fixed
  failures. Wrong model/role/parent, extra actions/turns/threads and reroutes stop.
- Typed requests deny without approval/cache/permissions/credentials; unowned or
  unknown requests get fixed errors. No session discovery or unowned cancellation.
  Queued undispatched normal work is dropped on cancellation; late sent responses
  can only add cleanup. Interrupt ACK and terminal evidence are separate.
- Stream bounds2MiB combined/64KiB per line/512messages; fatal bounded UTF8 JSON;
  stderr discarded, raw payloads/paths/IDs/arbitrary errors not reported. Model-work/
  request/outer/cleanup clocks tested synthetically; outer includes cleanup reserve.
- Actual fixed-peer process cleanup/exit handling, environment isolation, refusal,
  overflow/disconnect and POSIX signal-ignoring peer forced reap tested. No all-OS
  descendant or remote inference/billing cancellation guarantee. Artificial usage
  values are not account data; the whole workflow still uses selected chat usage.
- **Still unverified/blocked:** native tool admission/adapter, configured route/
  directory discovery/permissions/usage/lifecycle and platform gaps. Hook failures
  can continue tools; notifications/readonly/instructions/feature echoes do not
  establish a universal pre-execution barrier. Source33 cannot be live-enabled.
  No inference grant remains and no live approval should be requested for this build.
- **Pending:** exact source33 CI/public-clone/archive/spaced packaging. Older source32
  counts/CI/archive are not source33 evidence. Windows original bounds cause/known
  Image refusal/native11/WSL remain incomplete; all existing guards unchanged.

## Code locations and boundaries

- proofs/routing-contract.mjs: ROUTE/BOUNDS/PARENT_TEXT/CHILD_TEXT; liveAdmission always
  false and requireLiveAdmission always throws; jsonData validates plain bounded
  data without invoking accessors; typed refusals; createSyntheticAdmission.
- proofs/routing-machine.mjs: createRoutingMachine exposes start/receive/advance/
  abort/takeOutbound/report only. No IO. Outbound records domain synthetic-only;
  this is a label for the fixed runner, not a native capability. IDs held internally
  for correlation; report contains fixed status/counters/artificial usage only.
- proofs/routing-frames.mjs: bounded complete UTF8JSON lines and byte/message budgets;
  stderr counted/discarded, malformed/truncated input fixed reasons.
- proofs/routing-fixtures.mjs: enumerated synthetic scenarios and public-style packets.
- proofs/routing-peer.mjs: no model/FS/network/child-process action implementation,
  fixed mock dispatch gate, typed-refusal validation and deliberate failures.
- proofs/routing-driver.mjs: CLI --dry-run [--scenario NAME]; fixed Node peer/env{},
  stream forwarding only to machine; no native connection. Owned process close/
  TERM/KILL/reap is bounded and separately reported. Native Windows helpers unused.
- test/routing-driver.test.mjs:19meaningful pure+process tests. CI adds portable Node
  step; POSIX signal test skips Windows. No Windows private IO/security modifications.
- package/manifest/server/UI version metadata33; production behavior otherwise same.
  Docs explain limits; no installed code or human trust update performed.

Review fixes before checkpoint: queued turn/start after cancellation removed;
outer cleanup reserve enforced; ambiguous failed start/untracked activity cannot
claim confirmed cleanup; failed peer exit cannot hide protocol success; unowned
server requests cannot cancel unrelated work; corrupted transport is shut down
with protocol cancellation unconfirmed, not falsely acknowledged.

## Commands actually run / observed

- Real CLI happy-v1/happy-v2 --dry-run passed and --live refused exit2. Only fixed
  local Node peers, not Codex. Typed denial, invalid data, evidence gaps, environment/
  stderr privacy, process exit17, overflow/disconnect, forced POSIX peer kill/reap
  are covered by actual process tests, not only direct reducer calls.
- First focused test run16pass; corrected/expanded focused19pass0fail (~6.6sec).
- Final `npm test`:271pass0fail112Windows-onlyskips383total (~8.2sec).
- `npm run validate`:3mods valid. `npm run replay`:4data fixtures expected notices/
  deny/abstentions, no fixture command executed.
- Prepared enabled31 checker before/after:251cache/sharedconfig/owned human trust/
  settings/data/sources/marketplace unchanged,0native model turns. Exact helper/log
  paths remain in root private handoff.
- Official hooks/app-server docs retrieved; public0.164 schemas checked for typed
  decisions, empty permission grant and unsubscribe. A guessed v2 permission-response
  schema was absent; actual root schema read. Earlier nonexistent old-hold shell glob
  was not a product error or reason to repair tools. Prior pinned V1/V2 source stands.
- No duplicate live inventory/model-list/native thread/turn/host UI/proof run. No
  source33CI/package yet. No new hook/config/profile/install/trust/restart/capture.

Host prior macOS14.6/Node24.22.0, standalone CLI0.164.0 last observed previous stage;
not upgraded/invoked by this driver. Exact desktop/internal binary remains
independently unverified. Tests do not establish Windows Codex/native compatibility.

## Preservation and rollback

Installed0.2.0-dev.31 in current-user cache/profile scope remains enabled with
approved settings/Review desk, same251files/config/trust/data/logging. Source33 not
installed; production model/capture/exports/status/rules/permissions unchanged.
No restart/trust/user protected action needed for this dry checkpoint.

No installed rollback required. Preserve immutable31/30sources/approved settings
and completed lifecycle evidence; do not repeat transitions, restore whole config
or patch caches/trust. New proof files/version metadata are source development
only. Private raw logs/artifacts/root HANDOFF remain ignored and excluded from
upload. The previous private native proposal stays inert/unselected/unregistered.

## Next exact model and tasks

Select **GPT-6.1 Sol Medium**: demanding scoped driver decisions/code/dry review
are complete. Only routine exact CI/package verification is next. Keep native
admission closed; do not write or install a native adapter on Medium.

1. Confirm clean verified source33 checkpoint/branch and preserved installed31 with
   prepared enabled checker. Do not rerun native enable/disable/rollback transitions.
2. Check exact33CI final jobs/logs, including new portable Node-driver step. Expect
   local19test behavior, but do not claim Windows pass before observing CI. Preserve
   known Windows bounds/Image failures; no retry-until-green or unrelated proof loop.
3. Verify exact public anonymous clone/npm archive/spaced extraction, all new proof
   modules/test/guide/review included, versions33/defaults/MIT/privacy hygiene. Run
   actual packaged driver happy-v1/v2 and denial/refusal, relevant tests/validate/
   replay. Use only fixed synthetic peer; no native input/transport/profile/session.
4. No source33 installation/trust/restart or native model run is authorized. Existing
   user latest NOinference persists; fixture success does not grant usage or prove
   native admission. Source32 inert proposal remains historical, not a live script.
5. High before consequential gate/env/driver/security edits, unexpected unsafe drift/
   recovery, or native adapter design. If native strict admission cannot be proven,
   record exact supported limits and seek agreement to a revised bounded test using
   normal inherited permissions; do not silently relax the plan or substitute a fork.
   Future native run needs exact complete review artifacts and fresh explicit grant.
6. Update required continuation records, commit/upload/verify and stop at next
   human gate. Full93 remains incomplete; no background/delegated model continuation.

## Complete copy-and-paste resume instruction

“I’ve switched to GPT‑6.1 Sol, Medium. Continue from the verified source33 dry-driver
checkpoint on codex/astra-groundwork. Read docs/continuation/HANDOFF.md, STATUS.md,
DEV33-REVIEW.md, REQUIREMENTS.md, ARCHITECTURE.md, TEST-LOG.md, docs/routing-driver.md
and latest ignored root HANDOFF.md. Verify source33 CI and exact public packaging.
Preserve installed31, approved settings, logging scope, parent model, human trust
and Windows guards. Keep live admission closed: no native adapter, installation or
inference is authorized. Stop for High before consequential changes or drift.”
