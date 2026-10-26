# Source36 readiness inspector — offline implementation review

2026-10-25. Sol High resumed6649c0a under fresh authorization to implement/offline-test
proposal35.1 only. **No Codex invocation, extra inference, installation, host config/
trust write by this agent or native activation.** Installed31, logging scope, parent model and
Windows guards remain preserved. Source0.2.0-dev.36 is uninstalled; full93 incomplete.

## Implemented components and boundary

- proofs/readiness-machine.mjs: deterministic protocol drafts and narrow projections.
  Exactly5requests plus initialized, one outstanding request at a time: initialize,
  explicit-cwd config/read, requirements/read, conditional hooks/list for that same
  cwd, repeated explicit-cwd config/read. No model/catalog, thread/turn, auth/account,
  command/fs, config-write, plugin/skill/MCP enablement or trust request is emitted.
- proofs/readiness-frames.mjs: strict UTF8 newline framing, combined stdout/stderr
  accounting, frame/message bounds, malformed/incomplete refusal. Stderr discarded.
- proofs/readiness-driver.mjs: fixed-peer CLI and private shared prepared transport.
  runFixedReadiness can launch only this Node runtime/fixed peer/scenario enum with
  an empty environment. There is no exported arbitrary process/argv/URL/transport
  factory. runNativeReadiness and FromFile/CLI run call unchanged unconditional
  requireLiveAdmission before plan/getter/path inspection, input reads or native
  spawn. The native branch is prepared but unreachable and unexecuted.
- proofs/readiness-{fixtures,peer,leaf}.mjs: fixed synthetic settings, sensitive marker,
  deterministic failure scenarios and a fixed Node descendant solely for POSIX group
  cleanup testing. No real config/credential/session/network/model access. The peer
  can spawn only that fixed leaf using Node; no arbitrary command or path option.
- test/readiness.test.mjs:17meaningful boundary/process tests. CI adds this suite to
  Windows portable checks; full POSIX lanes already collect it. Production metadata
  version36 only; default hooks/rules/MCP/state and existing routing modules unchanged.

The original proposal35.1 remains sealed historical design data; its statement that
implementation was absent is true at that checkpoint. This record is current. No
old input/code/config fingerprint was silently refreshed; no new native plan/grant
was created. Eight prior routing runtime pins remain byte-identical.

## Refusal, privacy and policy behavior

The first config must match existing plan reductions, hooks=true, typed state-only
metadata, no extra/invalid MCP server, no remote board and no trust bypass. It never
forces hooks on/off or writes/approves anything. Features.plugins and plugin_hooks
must be false before listing, preserving the proposed exclusion of the release's
plugin fingerprint/legacy-trust migration branch. Actual migration avoidance remains
unverified. Any listed hook, including disabled/untrusted/managed entries, requires
review; only known source/event/trust category counts survive, with no raw handler.

Managed requirements are intentionally narrow: null/empty policy, known null optional
fields, allowManagedHooksOnly=false and matching known feature constraints can pass.
Unknown fields, hook policy, other non-null policies (even a potentially compatible
approval allowlist) or conflicts require review **before listing**. This is a
conservative implementation limitation, not proof those host policies are unsupported.
Missing/normalized/unexported config data also refuses; no reducer relaxation.

Between config reads only a transient canonical projection digest is retained; raw
config, origins, paths/state keys/trust hashes and requirements are not included in
reports. Unrelated sensitive root data does not affect the projection. Digests are
not anonymization and are never persisted/reported. Errors/reasons use a fixed enum;
unknown error text and caller abort labels cannot leak into results. Warnings/errors,
extra/wrong cwd, unknown notifications/responses, malformed frames and server requests
stop. Known server requests get a typed denial; unknown requests get a fixed error,
never approval, successful tool result or filled user response. Unsent work purges.

An empty list can yield only observation-complete with hookAbsenceEstablished=false,
builtinHooksOmittedByHost=true, nativeInspectionVerified=false and liveAdmission=false.
These flags remain false even after synthetic success. Hidden builtin hooks, feature
short-circuits and discovery completeness gaps remain as in the original proposal.
The older dormant routing adapter still omits cwd; no routing/context fix is claimed.

## Transport, bounds and limits

Proposal limits remain20secwork/25secouter/5secrequest,1MiBcombined stdout+stderr,
64KiBframe/128messages/5requests/256hooks/128KiBoutgoing; cleanup reserves2secTERM and
2secKILL/reap. The fixed-peer harness adds a separate4sec deadline and shorter fixed
cleanup waits to keep offline failure tests bounded. Its timing is not native evidence.

SIGINT/SIGTERM and cancellation purge future requests and enter cleanup. POSIX cleanup
can signal the owned group even after its leader exits, addressing a descendant holding
pipes. Peer exit failure, forced termination, bad framing or incomplete cleanup cannot
produce successful observation. processReaped describes the observed direct child's
close; it is not proof of all invisible native descendants or remote model cancellation.
Windows fixed-peer tests use direct peer termination; POSIX signal/group cases skip.
No native Windows implementation or permission guard is changed or inferred.

The dormant native path uses existing bounded selected-file verification, ordinary
CLI environment/authentication and no shell. It checks lateness/cancellation before
spawn. OS filesystem stalls are not interrupted or a hard real-time guarantee. Normal
native startup network/log/cache side effects remain possible and unverified; tool
read-only permissions do not sandbox the host process. No exact usage/billing claim.

## Commands actually run and observed results

- Initial/intermediate preservation checks passed. A late final check correctly
  detected7added user-global hook trusted_hash entries. Read-only comparison proved
  all prior protected values unchanged; independent owned checks still passed251
  installed31files/settings/data/sources/marketplace. The human confirmed intentional
  review/trust in this session. No provenance or current-definition hash match was
  inferred beyond that confirmation. Old checker/baseline and sealed proposals stay
  untouched; a separate current preservation observation/checker records this attested
  transition and passes. No host config was written by this agent. New global hooks
  may appear in a future native listing; any nonempty result still requires review,
  never disabling hooks or weakening requirements to obtain an empty result.
- node --test test/readiness.test.mjs: initial16cases all passed. Added actual POSIX
  SIGINT coverage; targeted readiness/native/classifier suites37cases:36pass0fail1skip.
- Full npm test: **307passed,0failed,113platformskips,420total** (~10.9seconds).
  Final rerun followed the reviewed empty optional matcher/status-string correction;
  it again passed307/0/113/420. No other broad repeat was needed.
- npm run validate:3mods pass; npm run replay:4fixtures pass, no fixture command run.
- New cases cover conditional sequencing/cwd/bracketing, missing controls/MCP/trust,
  policy conflicts/unknowns, all hook-trust states, warnings/errors/bounds, transient
  projection changes/order, typed denials, post-completion events, getters/redaction,
  clocks/cancel/EOF, combined-output/framing, failed peer exits and fixed process cleanup.
  Actual fixed Node peer/leaf, stdout/stderr overflow, SIGINT, term-ignore and exited-
  leader pipe-holding tests ran on macOS. They are **not native Codex proofs**.
- Sealed proposal35.1, source35 source review,6frozen34 artifacts and34/35archives
  verified unchanged. New private36source-only record binds14runtime hashes plus test
  hash. No native PLAN/INPUT/current selected config refresh, native CLI version query,
  catalog/thread/turn/provider/model call, install/restart/trust change or REA.

Known source35 CI remains failed overall on Windows Image refusal; original bounds/
native11/WSL gaps unchanged. **Exact source36 CI/public clone/archive/spaced package
checks are pending Medium.** Do not substitute older results for36evidence.

## Source pins

Eight unchanged older runtime pins remain in DEV35-REVIEW. New public code/test pins:

| File | SHA256 |
| --- | --- |
| proofs/readiness-machine.mjs | cd9ffb804eb7e94827d1e601f330061edf417e10602832bd4d91d64f34f09f12 |
| proofs/readiness-frames.mjs | 17b6a735aafe7ed3a1ae6affe4a4afd8e700f2e76a9b81b7892331ac17b1dc5d |
| proofs/readiness-driver.mjs | 442fe63c7888f8ac64b1fcd78ebdffe9efe8b0c1f0f35a97c2d8de3e15c1ed51 |
| proofs/readiness-fixtures.mjs | 1cbd73ad93b7e8a8ffaaf397ed7a263223f524ed8802f118ee060160f43d96b5 |
| proofs/readiness-peer.mjs | 8e8f99805e8293e90a3b4c06f664a33118192f6978c598d58c1e60922a640b50 |
| proofs/readiness-leaf.mjs | 0c15d744e3d2afcf8c8b10673aed0a5634fefff74ce511687261cd938e401580 |
| test/readiness.test.mjs | 38ab92fcb2e8d9f6af8545a9e9b398a29a9d9536cdc3292d811e91479e347e19 |

## Next exact setting

**GPT-6.1 Sol Medium** for routine exact36CI/package/closed-entry/review artifact
verification. Preserve installed31 and sealed prior artifacts; prepare a separate
source36 review revision if needed, never refresh the sealed proposal. No native
execution, installation, configuration/trust change or inference grant exists.
High before security/transport changes, drift or activation. A future inspection-
only activation must be separately reviewed; never open the shared routing gate to
run the inspector. Native-run authorization remains distinct and human-controlled.
