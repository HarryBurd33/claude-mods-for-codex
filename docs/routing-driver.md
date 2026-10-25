# Routing dry driver — source33

Source **0.2.0-dev.33** implements the planned routing protocol driver and
synthetic admission/cancellation tests. It is verification tooling, not an
installed agent launcher, native UI extension or replacement Codex client.
Installed31 and all approved settings/logging/trust remain unchanged.

**There is no live transport.** Every run launches only a fixed local Node peer
that emits synthetic app-server messages. It cannot launch Codex or invoke a
model. Native routing and native pre-execution tool admission remain unverified.
This is a usable dry checkpoint, not completion of the requested product.

## Run locally

From the verified source root, or using the corresponding absolute paths:

```sh
node proofs/routing-driver.mjs --dry-run
node proofs/routing-driver.mjs --dry-run --scenario happy-v1
node proofs/routing-driver.mjs --dry-run --scenario deny-command
node --test test/routing-driver.test.mjs
```

The default is happy-v2. A passed synthetic run exits0; stopped/incomplete scenarios
exit1; invalid options exit2. The rejection scenario is expected to stop, not pass.
`--live`, command/path/URL/config/approval options and unknown scenarios refuse
before starting a peer. No input file, selected session, credential, user config,
native profile or account connection is read. Do not infer native behavior from
the artificial model settings, marker or token counts in these reports.

The peer executable is the current Node binary, with one fixed bundled script and
an enumerated scenario. There is no arbitrary command, shell or transport input.
Its environment is cleared; synthetic checks verify parent secret/permission claims
and NODE_OPTIONS do not reach it. The peer contains no model/filesystem/network/
child-process action implementation. Trusted reviewed source is required: this
does not sandbox hostile same-user replacement of the program or Node runtime.

## Admission boundaries

There are two separate gates:

1. **Live admission is closed by construction.** No native adapter exists. Claimed
   authorization, config echoes, feature flags, environment variables, hook output
   or caller-supplied booleans cannot open this build. No additional inference is
   authorized, and there is no live command to approve or execute.
2. **The fixed peer's synthetic action gate** admits only one exact parent role
   spawn with explicit no-history arguments and no model/effort override, followed
   by up to8waits targeting its one synthetic child. Extra fields, child spawning,
   inherited-all/default history, different tasks/roles/targets and all other actions
   are rejected before the mock action dispatch. This is an actual gate in the
   synthetic peer, not evidence of an equivalent native Codex control.

Notifications are observations after admission; the state machine does not present
them as pre-execution denial. Read-only sandbox metadata or task instructions are
not read/MCP/network confinement. Official [hook guidance](https://learn.chatgpt.com/docs/hooks)
also documents that hook errors/timeouts/malformed replies can continue the tool.
We therefore did not use a new hook as a universal fail-closed native barrier,
register or trust a hook, or weaken current host permissions.

A future native adapter requires separately established supported admission
controls, exact reviewable command/source/candidate hashes, and fresh explicit
human authorization. If the host cannot provide the proposed strict boundary,
report the exact limitation and seek agreement to a different bounded test using
normal inherited permissions. Do not silently relax this plan or substitute a fork/
new product client. No permanent impossibility claim follows from this closed build.

## Protocol and evidence

The pure state machine issues simulation intents for initialize/model-list,
one ephemeral parent start/turn, one owned-child metadata read and scoped cleanup.
It never lists unrelated sessions, resumes/steers a thread, invokes shell/MCP tools,
writes config, enables internal raw Responses events or retries a model turn.
The reviewed [test plan](continuation/NATIVE-ROUTING-TEST-PLAN.md) remains the native
proposal; its Sol Low/Luna Low names are fixture values here, not running agents.

- V1 ignores requested values from item/started and requires the resolved spawn
  item/completed. V2 uses completed subAgentActivity(kind started). Conflicting
  families/IDs/settings stop; identical selection duplicates are deduplicated.
- Own parent/child IDs, exact role, ephemeral state, configured model/effort,
  read-only parent/human reviewer and fixed outputs are correlated. Wrong scopes
  stop without reading or cancelling an unrelated thread. Missing resolved evidence
  or child usage remains incomplete; marker/parent usage alone cannot pass.
- Typed server requests return cancel/abort, empty permission grants/answers,
  declined elicitation or unsuccessful dynamic-tool results, followed by stop.
  Unknown or unowned requests get a fixed error. No approvals or credentials are
  generated, cached or transmitted. The decision shapes follow the retrieved
  [public app-server protocol](https://learn.chatgpt.com/docs/app-server) and the
  installed0.164 schema; synthetic success is not a native approval test.
- Reports contain fixed reasons, booleans/counters and artificial usage only.
  Raw prompts, reasoning, arguments, IDs, paths, arbitrary errors and stderr are
  not persisted or echoed. Malformed data, accessors/prototypes and excessive
  structure/strings reject. Input is bounded UTF-8 JSON lines, not executable data.

## Deadlines and cancellation

The controller models10sec request,90sec work and120sec outer limits, reserving
6seconds of the outer limit for cleanup. Stream bounds are2MiB combined stdout/
stderr,64KiB per line,512messages. Reported per-thread totals are monotonic and
not double-counted; the50,000token fuse is observational, not a billing/admission cap.
Missing usage is unavailable, never zero. All counts in dry output are synthetic. syntheticTurnStarts counts dispatched
simulation intents, not acknowledged execution or native inference.

On stop it drops queued undispatched work (including turn/start), interrupts only
known owned turns, waits for terminal evidence separately from interrupt ACKs,
then unsubscribes owned threads. Late start responses can add cleanup ownership
but cannot start another turn. Untracked children or ambiguous failed starts never
claim confirmed cancellation. Errors/disconnects cannot turn missing ACKs into
success. Absolute outer exhaustion stops further requests.

The process runner has a separate5sec dry-transport stop,8sec maximum polling loop
and bounded exit/termination waits. It flushes scoped cleanup intents, closes stdin,
then signals only its owned peer (POSIX process group; Windows direct child).
A signal-ignoring peer is forcibly killed/reaped in the POSIX test. Unparseable or
over-budget streams force transport shutdown and leave protocol cancellation
unconfirmed. Failed peer exit cannot be hidden behind protocol success. Timer and
process outcomes are reported; no all-OS descendant or remote inference/billing
cancellation guarantee is made. Native Windows process helpers remain gated.

## Code, tests and remaining gaps

The six routing modules under proofs/ provide constants/denials/admission, pure
state transitions, stream framing, fixed fixtures, fixed peer and process runner.
test/routing-driver.test.mjs adds19meaningful tests. Local macOS14.6/Node24.22.0:
all19pass; full suite271pass0fail112Windows-onlyskips383total, validate3/replay4.
Exact33 [CI/public archive](continuation/PACKAGE-DEV33.md) now verified:276files,
spaced104passes/1skip; fourPOSIX271passes/portableWindows routing18passes/1skip.
This is still not native routing acceptance.

Portable CI adds a synthetic Node-driver step. It is not Windows Codex, private
storage, native hooks or agent acceptance; the POSIX signal-specific case skips
there. Existing Windows guards, known Image failures and original bounds cause
are unchanged. No installed source33/hook/UI/runtime or native model test occurred.

Native tool admission, configured execution/discovery/permissions/usage/lifecycle
and remaining93-capability gaps stay incomplete. Preserve installed31 and human
trust. Source32 authoring and prior frozen macOS host evidence remain separate.
