# Prepared native routing adapter — source35

Source0.2.0-dev.35 prepares a separate temporary CLI app-server test adapter for
the [human-accepted ordinary-read-only design](continuation/NATIVE-ADMISSION-REVIEW.md).
It is not a native plugin UI extension, a new product client or a Codex fork.
Installed31 is unchanged. **Execution remains closed by construction**: no human
grants, environment variables, CLI flags or plan fields can open this build.
No inference, installation or configuration change is authorized.

## Available commands

From the reviewed source root (or use the corresponding absolute script path):

```sh
node proofs/routing-native-driver.mjs --describe
```

This prints public preparation metadata only. The exact prepared execution entry:

```sh
node proofs/routing-native-driver.mjs --run --plan /absolute/private/PLAN.json
```

**Currently refuses with exit2 before reading PLAN.json or starting a process.**
It is included for source/interface review, not as a command to activate or test
models now. Exported runNativeRouting/runNativeRoutingFromFile also refuse before
inspecting their input. Source33's fixed-peer dry driver remains separate and
unchanged; it cannot be converted into a native transport through an option.

## Components and contracts

- `proofs/routing-native-plan.mjs`: pure, frozen explicit-input launch plan. Pins
  macOS/CLI0.164.0/V2, intended Sol Low parent/Luna Low named child, no history fork,
  no provider fallback, human reviewer/read-only sandbox, process-only reducers,
  explicit MCP disables, selected binary/candidate/config hashes. No IO/grant.
- `proofs/routing-native-hooks.mjs`: pure bounded state-versus-definition classifier.
  Known typed metadata/empty released event defaults accepted; nonempty handlers,
  unknown or malformed data refused. No path lookup, approval or hook IO.
- `proofs/routing-native-adapter.mjs`: native public-protocol draft adapter. Config
  confirmation precedes catalog/thread/turn drafts; missing controls stop. V2
  selection, owned parent/role/cwd/version/model/effort, turn identity, usage,
  fixed final marker and independent child completion remain separate evidence.
  Requested-only fields, V1 responses or a parent marker cannot establish them.
- `proofs/routing-native-inputs.mjs`: macOS-only selected-file verification. Canonical
  regular single-link files, bounded streaming reads, no-follow/nonblocking open,
  before/after handle/path metadata and exact hashes. Checks only one entry to
  refuse a nonempty selected project. No traversal/discovery/native execution.
  Private review JSON is bounded256KiB/strict UTF8/0600-equivalent POSIX mode.
- `proofs/routing-native-driver.mjs`: real prepared stdio process transport, behind
  the unconditional closed gate. Its private dormant path launches only the reviewed
  executable/argv without a shell or daemon reuse, checks selected files first,
  bounds framing/deadlines, declines server requests and reaps its own process group.
  It is not exported as an ungated executor. This path has **not run** or received
  native lifecycle acceptance; the current gate makes it unreachable.
- `proofs/routing-native-candidate.txt`: public synthetic inert candidate, not a
  discoverable/installable agent directory. It has the exact previously reviewed
  source32 candidate bytes/hash. Merely packaging it never registers a native role.

`createNativePlan` accepts exactly cliPath/cliSha256/cwd/candidatePath/
candidateSha256/configFiles/disabledMcpServers. Paths and server names are bounded;
extra/grant fields, duplicate servers, changed pinned candidate or plan changes
refuse. Generated argv is data passed directly to spawn, never shell-evaluated.
Raw plans contain selected private paths and belong in an ignored private folder.
They are review artifacts, not authorization or installed configuration files.

## Proposed control sequence — no steps executed now

A future separately authorized runner would recheck binary/candidate/selected
configuration hashes and the empty project, initialize, read resolved configuration,
require all proposed reductions, read the model catalog, then draft one ephemeral
parent and one parent turn. The named child is requested by the parent, not a
second direct client turn. Catalog availability is not inference access. No fallback,
automatic retry, history fork from this chat or current-model interception.

V2 is explicitly selected: V1 max_depth is not used as a V2 bound. V2 direct
messaging/model-override exposure is reduced, concurrency set1, wait enabled and
board requested in memory. Concurrency does not limit total spawns or model calls;
hiding model-override fields is not semantic argument enforcement. A second observed
spawn, wrong selection, reroute, unexpected tool/turn/thread, approval/input/
permission/authentication/elicitation request or unknown packet stops the trial.
Covered requests get typed refusal; unknown requests get an error. No approval,
permission grant, filled answer, token refresh or successful dynamic-tool response.

Required config echoes are corroborating preflight checks, **not a universal tool
barrier**. Missing/unexported/normalized fields refuse; there is no automatic
fallback or reducer relaxation. Nonempty inline hook definitions, unknown/malformed hook data, an unexpected MCP
server or a remote board refuse. Typed hooks.state metadata and empty exact
released event defaults are accepted as data only. External/managed hook discovery
is not established by that result. Exact native export compatibility is unverified. The
previous unconfirmed root code_mode.enabled/tools.update_plan.enabled attempts
are not reused; code-mode flags are under features.

## Access, usage, privacy and limits

The official CLI normally reads its configuration/authentication/ancestor
instructions and inherits the normal process environment. Provider/authentication
network activity is necessary for any later model run; a tool sandbox is not a
network sandbox for the CLI process itself. Host instructions may be included in
model context. An empty cwd and no current-chat fork do not erase ambient context.
No project credential store/session discovery, raw export, prompt/transcript or
secret collection is added by these proof modules. Selected config bytes are read
only for hashes; their contents are not retained or printed by the verifier.

Remaining native tools can attempt host-permitted reads. Normal permissions apply
to covered writes/network/escalations. An unexpected action may already have run
before its notification is observed. Stop/interrupt is not pre-execution admission.
The accepted design has no exact one-total-child or billing guarantee.

The proposed90second work/120second outer/10second request limits,2MiB combined
stdout/stderr,64KiB frame/512messages,128KiB outgoing data and50,000reported combined
token observational fuse are explicit. The dormant runner reserves time for owned
process cleanup. OS IO/scheduling stalls are not a hard real-time guarantee.
Stderr and deltas are discarded; only final-marker comparisons/fixed error labels/
counts/evidence flags are reported. Missing child usage stays null, not zero.
The adapter does not measure inference calls; it reports null, never inferred billing.
Both intended tasks and any native model work consume usage if later authorized.

Metadata-only child reads do not request history or guarantee a child event
subscription. Missing child output, usage or terminal-turn visibility remains
incomplete. A known child without a visible turn cannot claim confirmed cleanup.
Interrupt ACK is not terminal completion; late responses add cleanup only; queued
unsent work is purged. Ambiguous/untracked starts prevent confirmed cleanup.
Process termination does not guarantee remote inference cancellation or billing.

Selected-file pins assume trusted local source and files. They detect ordinary
changes, links, special files and bounds; path execution after verification is
not a hostile-same-user/administrator race sandbox. Windows/WSL execution is not
implemented; non-macOS input verification refuses before file access. Portable
protocol tests cannot establish native Windows compatibility or weaken its guards.

## Review, update and removal

The private preparation folder contains INPUT.json, PLAN.json, FILE-HASHES.json,
ACCESS.json and REVIEW.md with exact machine paths/source hashes/proposed argv.
Nothing is installed or applied. Current permission is design preparation only.
A future activation needs a separately reviewed source change, exact runnable
source/config/candidate/access/usage/cancellation/removal review, and fresh human
authorization. A plan boolean or prior design agreement cannot supply that grant.
Human trust/authentication remains protected; no auto-trust or application patch.

Removing only the private proposal folder discards these review artifacts. Do not
remove the existing candidate/config, installed31 or unrelated records. There is
no current running native process/profile/update to roll back. Source35 is an
incomplete development checkpoint, not a release or full configured-routing result.
See [DEV35-REVIEW](continuation/DEV35-REVIEW.md) for actual tests and pending checks.

Source35 classifier details/bounds/regression evidence: DEV35-REVIEW. The old34
proposal remains stale and preserved; the new source review is not an executable
proposal or run grant. Source35 exact CI/package verification remains separate.
