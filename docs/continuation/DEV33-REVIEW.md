# Source33 routing dry driver review — 2026-10-25

High resumed327f0be. User authorized implementation/dry tests and **no inference**.
Source0.2.0-dev.33 adds verification-only routing driver/admission/cancellation
modules and19tests. Installed31/cache251/settings/model/logging/trust/data/Windows
guards remain unchanged. Native adapter/admission/route still blocked/unverified;
this is not full product completion or a substitute native integration.

## Decisions and contracts

See [routing-driver](../routing-driver.md) and
[native proposal](NATIVE-ROUTING-TEST-PLAN.md). Native hooks cannot provide the sole
universal fail-closed barrier: retrieved official hooks guidance documents failure/
timeout/malformed replies continuing tools. No new hook install/trust or policy
weakening was attempted. Rather than treating feature booleans/notifications as
proof, this build has **no live transport** and an always-closed live gate.

Synthetic admission is separate: a fixed bundled Node peer admits one exact role
spawn/no-history/no model override and bounded owned waits before mock dispatch;
there is no native executable/URL/config/path/approval option, model or IO action
implementation in the peer. Child environment is empty. This is verification
tooling; it neither demonstrates native admission nor declares it impossible.

Code locations:
- proofs/routing-contract.mjs: frozen route/bounds/text, live gate always closed,
  strict data validation, typed refusals, synthetic pre-dispatch admission.
- proofs/routing-machine.mjs: pure scope/ownership/protocol/evidence/usage/deadline/
  cancellation state machine; outbound intents tagged synthetic-only, no IO.
- proofs/routing-frames.mjs: bounded UTF-8 JSON lines, combined byte budget,
  stderr discarded, fixed failure labels.
- proofs/routing-fixtures.mjs: fixed public synthetic packets/scenario names.
- proofs/routing-peer.mjs: only enumerated synthetic scenarios, no model/FS/network/
  process action implementation. Typed denial validation and deliberate failures.
- proofs/routing-driver.mjs: only current Node/fixed peer path, env{}, no shell;
  cleanup bounded and ownership-scoped, no native adapter.
- test/routing-driver.test.mjs: pure and real fixed-process dry cases.

Source version fields33 in package/manifest/server/UI; no production behavior other
than version metadata changed. CI adds only the portable synthetic-driver step.
Actual Windows private-storage/process helpers and guards remain byte-unchanged.

## Security review corrections before checkpoint

Review found and fixed queued turn/start surviving a cancellation; pending unsent
normal intents now purge before cleanup, while late sent responses only add cleanup
ownership. Tests cover no turn dispatch after queued cancellation. The120sec outer
budget now includes cleanup reserve, with no sends after absolute exhaustion.

Interrupt ACK alone cannot prove terminal state. Ambiguous failed turn start,
untracked activity, disconnect/malformed/overflow input and missing acknowledgments
never claim confirmed cancellation. Raw stderr/protocol errors remain redacted.
Protocol success cannot hide a failed peer exit; an actual17exit regression proves
the process result changes the outcome. Frames stop parsing untrusted over-budget
channels; process cleanup remains separate from unconfirmed protocol cancellation.

Current reviewed code is not an OS sandbox against hostile same-user source/Node
replacement. Artificial peer tokens are not real usage. No caller claim can open
this build's live gate; arbitrary external programs are outside this driver contract.

## Commands/results observed

- Initial focused tests16pass, then corrected expanded focused19pass0fail (~6.6sec).
- Final `npm test`:271pass0fail112Windows-onlyskips383total (~8.2sec), including
  final process overflow/disconnect cases. `npm run validate`:3mods valid;
  `npm run replay`:4fixtures expected notice/deny/abstentions, no fixture execution.
- Real fixed Node-peer CLI happy-v1 and happy-v2 passed; --live refused exit2.
  Typed refusal, invalid frames, extra actions, missing usage/requested-only paths,
  stderr redaction, environment isolation, nonzero exit and owned POSIX forced
  termination/reap are tested. No Codex process/thread/turn/model was started.
- Pure tests cover both evidence families, duplicates/conflicts/wrong role/parent/
  model/effort, monotonic usage/fuses, all deadlines, late/cancelled starts, malformed
  typed requests and no unrelated thread reads/cancels or discovery.
- Prepared enabled31 preservation checker before/after passed:251cache/sharedconfig/
  ownedtrust/settings/data/sources/marketplace unchanged,0modelturns. No new profile,
  native flags, trust hashes, logging scope or permission selection changed.
- Exact33CI/archive/public-clone/spaced packaging **not yet run**; next Medium.
  No native host/Windows compatibility inferred from local mocks or Node subprocesses.

Official docs retrieved [hooks](https://learn.chatgpt.com/docs/hooks) and
[app-server](https://learn.chatgpt.com/docs/app-server); installed0.164schema denial/
unsubscribe types checked. A guessed v2 permission-response path was absent; the
actual root response schema was found and read. An early shell glob matched no
old hold module; no source or tool repair followed. Prior pinned0.164V1/V2 sources
and no-history findings stand. No REA or unrelated research/native proof loop.

## Remaining / next model

Switch to **GPT-6.1 Sol Medium** for source33 CI and exact package verification.
The scoped dry implementation is complete; native admission remains honestly
closed, not something Medium may enable with a flag. Preserve31/no inference/no
new trust/restart/install. High before consequential driver/env/gate/security changes,
unexpected recovery or any native adapter design. A future native run needs real
admission evidence or an explicitly agreed revised boundary, exact runnable review
artifacts and fresh inference authorization. Do not ask for a live run of this build.

Windows original bounds cause/known Image refusals/native11/WSL remain incomplete,
guards unchanged; macOS first. Full93 remains incomplete; source33 dry tests are
separate from earlier source32 authoring/package and installed31 native evidence.
