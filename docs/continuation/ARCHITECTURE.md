# Extension architecture and security contracts

## Source15 current candidate — strict index projection

Original unintegrated SHA1/v2 index projection proof: bounded checksum/entry/path/
frame validation, optional accelerator stripping and explicit same-helper scratch
composition. Nine new real Windows tests pending CI; local170pass/0fail/
64Windows-only skips234total, validate3/replay4. Golden synthetic index from
macOS Git2.39.5 roundtrip, no Windows Git launch. No production operation/gate or
installed10/logging/trust change. Full93product and native Windows/Git remain
incomplete. See DEV15-REVIEW.md and TEST-LOG.md. Source14 records below are the
previous verified foundation, including its completed package checks.


## Source14 Medium packaging verification — 2026-10-23

Exact anonymous public clone1e1e4d1/tree00ac9bb, full170pass/0fail/55Windows-only
skips225total. Reviewed160-file archive1,066,360unpacked/324,060compressed bytes,
SHA256a4bc1abbde2cdd6a81fdee277a6c8bfe36e4f895891a1bc88531cc9701cdf69f.
All bytes match public clone/checkpoint; hygiene/MIT/version14/default-off storage
passed. Spaced extraction validate3mods/replay4fixtures/package-scaffolding7/7,
0fail/0skip. macOS14.6/Node24.22.0/npm11.19.1; no Windows compilation or install.
Installed10 still149reviewed files/settings hash unchanged; prior High trust/activity
observations remain separate. No config/cache/trust/logging/model-run/gated-code
change. All93IDs retained. Next human Sol High before further gated work. See
PACKAGE-DEV14.md; final notes-only artifact identity recorded after actual readback
in reply/private handoff. Full product/native Windows/Git remain incomplete.


## Source14 current checkpoint — same-helper metadata capture

Source0.2.0-dev.14 adds an original unintegrated fixed synthetic source-metadata
capture proof. Explicit index32MiB/info-exclude1MiB are held/read/reverified and
copied directly into private named scratch inside one helper. No public IPC byte
transfer or bridge expansion. Source [c369f49](https://github.com/HarryBurd33/claude-mods-for-codex/commit/c369f49f335c57ed0e5840088795145a0ea5717b),
[CI40059849695](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40059849695):
all 7 jobs passed. Actual Windows Node22/24 logs read: 20 storage + 35 proof tests
per lane, 0 failures and 0 skips. Seven new metadata-capture cases passed, including
full32MiB index/1MiB exclude direct composition. Both prior mapping diagnostics
still mapping-refused; altered-byte/mtime branch unverified. Windows Server2025 OS
evidence is separate from native Windows11 Codex/Git acceptance. Production settings/project/Git/restore gates unchanged;
installed10/human trust/logging unchanged. No real Git/source provenance/ignore/
loader/native acceptance claim. See DEV14-REVIEW.md and TEST-LOG.md. Full93product
incomplete. Source13 records below describe the previous verified foundation.


## Source13 foundation: fixed metadata lifetime — 2026-10-23

Proof-only GitMetadataScratchProof(parent,headCommit,index,exclude,token), Path/
Dispose. Closed generated config/HEAD/optional index+exclude and objects/refs/info;
no arbitrary names/adoption.32MiB index/1MiB exclude, no expansion of flat/read-set
bounds or32KiB request/3MiB response bridge. Common proof-only creation extracted
from ScratchContent, same private descriptor/CREATE_NEW/delete-on-close/retained
handle and safe list ownership transfer. Directory creation/pins protected; disposal
closes exact created files, releases pins, removes only known empty dirs/root.
No enumeration, recursion, unknown entry deletion, stale-root adoption or ACL repair.

Fixed compatible reader only; unowned readers can retain bytes until close and
cause cleanup refusal. Owner death with owned readers leaves private empty hierarchy.
Unknown child-created files would be preserved and may retain data. No claim of
arbitrary Git/child cleanup, secure erasure or hostile same-user/admin race defense.
5s checks cannot interrupt blocked IO; future owned-helper deadline required.
Actual Git/dependency/loader/readers/writes, ignore selection/provenance and bridge/
production/native/writer integration remain High gates. See DEV13-REVIEW.

Source15e388e CI40058125353 all7jobs passed; actual Windows20storage+28proof each,
0fail/skip. Prior mapping branch still mapping-refused; byte/mtime negative branch
unverified. Production compiles only PrivateStorage.cs, no operation/gate change.
Source13 uninstalled; installed10/logging/human trust preserved. Exact69e8bb3
package/public-clone/spaced extraction passed; see PACKAGE-DEV13. Next human High
before more gated security. All93product incomplete. Versioned
foundations below are historical and superseded where current status differs.

## Source12 foundation: explicit positive read set — 2026-10-23

Proof-only ProjectReadSetProof(root,relativePaths,token), Count/Verify/Bytes/Dispose
keeps original no-follow NTFS pins and readonly source handles. Whole input set
validated before IO,1–20files/16segments/256KiB each/1MiB total; foreign mutation
rights refused, ordinary read grants allowed. Same-handle identity/time/size/ACL
and native-byte rereads precede cloned captured bytes. Cleanup releases only owned
handles/arrays; no content persistence or source writes.5s per-operation checks
cannot interrupt synchronous kernel IO; outer owned-helper deadline remains needed.

Explicit positive read-set only: no enumeration/ignore engine/negative lookup/
whole-directory snapshot. Windows read layout, trusted selection and Git execution
still gated. Source11 private-slot composition uses fixed synthetic bytes only.
Both mapping witnesses refused before acceptance; negative mutated-byte/restored-
mtime branch and8.3-specific behavior remain unverified. No hostile same-user/admin
isolation or secure erasure. See DEV12-REVIEW for stable contract/limits/sources.

Sourcee55ed71 CI40048345934 all7jobs passed; actual Windows20storage+21proof each,
0fail/skip, both logs read. Native Windows11 unavailable per human, not certified.
Source12 uninstalled; installed10/logging/trust and production gates unchanged.
Source12 dd9a6e4 package/public clone/spaced extraction verified; see PACKAGE-DEV12.
Next human High before new gated security/integration. All93
requirements remain incomplete as applicable. Versioned foundations follow.

## Source11 private synthetic content boundary — 2026-10-23

Source392fc04/CI40046690213 all7jobs passed; native Windows20storage+13proof each,
0fail/skip, both logs read. Proof-only ScratchContentProof(parent)/Add(byte[])/
Dispose reuses helper checks and private ScratchProof directory. Flat numeric
slots,16files/256KiB each/1MiB total. CREATE_NEW/protected descriptor/delete-on-close
are atomic at creation; verified/flushed noninherited handles retained. Compatible
readers share read/write/delete, new writers refuse. No adoption/path deletion/
recursive recovery. Exact owned files disappear after last reader closes; normal
empty-only root removal can refuse, leaving a protected root. No secure erasure.

Original synthetic tests prove bounds/collision/junction/reader/owner-death behavior,
including creation-time job-owned descendant readers and successful root exit.
Production compiles only PrivateStorage.cs; no public operation or gate change.
Slot layout/limits are not a Git repository or its larger index bound. Real project
read-set consistency, executable/dependency/loader trust, inert named Git metadata
and separate restore/native host permissions remain High/security gates. See
DEV11-REVIEW for reviewed sources, contracts and exact acceptance order.

Source11 uninstalled; installed human-trusted source10 unchanged. Actual native
panel focus/render/keyboard-Clear passed after restart. Same settings/four scoped
records; no trust/config/logging/model-call change. Source11 Medium package/public-clone/spaced extraction passed at88e8895; see
PACKAGE-DEV11. Next human High switch before additional gated security/integration.
Full93product remains incomplete. Historical versioned foundations follow; older
installed6/pending10 statements are superseded by this current summary.

## Reviewed source9 Windows boundary — 2026-10-23

Production NTFS directory pins now request FILE_LIST_DIRECTORY alongside metadata
rights, with no share-delete. Metadata-only opens did not participate in the needed
sharing conflict; actual rmdir witness failed on both Windows lanes before repair.
No ancestor enumeration or extra metadata collection; missing list rights refuse.
Sharing violation32 alone retries10attempts/90ms sleep per handle, with unchanged
whole-request/telemetry deadlines. No ACL repair/lock stealing. Production compiles
only original PrivateStorage.cs; partial declaration permits fixed proof reuse.

Proofs/windows-owned-process is **unintegrated**, not a public runtime extension.
Original .NETFramework candidate uses mandatory creation-time JOB_LIST+HANDLE_LIST
and kill-on-close job, explicit CRT argv/env, EOF stdin, bounded pipes/deadline/
cancellation, root/descendant/owner-death cleanup. A suspended create then assign
sequence was rejected because owner death can leave an unassigned child. No shell,
PATH/project lookup, breakaway or uncontained fallback. This is process lifetime,
not a sandbox or protection from malicious broker/same-user/admin activity.

Proof ProgramPins reuses native same-handle ACL/parser/pins, explicit separate
code/project roots and rejects project alias/overlap, foreign mutation/creation,
links/streams/aliases. No code provenance or DLL dependency closure claim. Private
empty scratch has atomic descriptor, verification/pin and empty-only normal removal;
external death can leave an empty private directory. No index/refs/content copies,
real Git launch or project-file reads. No exact-owned content cleanup design yet.

Windows configured settings/project/Git/restore remain before-IO refused. Native
Windows11 host is available later, not presently tested. Its actual installed
client/Git/dependencies/ACL/sandbox must be inventoried before activation. No implicit
Git discovery, vendoring/download, live-tree/snapshot choice, custom client/fork or
application patch. Future security/traversal/content/restore changes require High
and native acceptance; routine packaging/preparation is suitable for Medium.

Installed trusted6 remains unchanged, same logging/retention/scope/export. No new
wire operation/observer registration/model/API call. Existing dispatcher/permission/
metadata contracts retained. See [proof](../../proofs/windows-owned-process/README.md),
[Windows](../windows-storage.md), [review](DEV9-REVIEW.md) and TEST-LOG for exact
source/CI and candidate failures. All93capabilities remain accounted and incomplete.

The versioned design sections below retain earlier contracts/history; source9
sharing correction supersedes earlier claims that metadata-only handles pin names.

Decision date: 2026-10-23. Development design; outstanding proof gates are explicit.
Read CODEX-CONTRACTS.md and CLAUDE-RESEARCH.md for dated primary evidence.

## Current authoring extension — source0.2.0-dev.8

Medium extends the existing declarative scaffold contract with two synthetic
host-shaped JSON fixtures in a new output's fixtures/ directory. The original
config stays disabled; review uses a separate temporary enabled copy. Controls
avoid literal/exact collisions on the same tool (notice control is a tool event).
Real CLI tests verify all three templates, disabled/temporary-enabled decisions,
no command execution and original preservation. No executable code generation,
installed-cache/config/trust/logging change or Windows gate removal. Fixture text
contains the selected match/from plaintext; keep specification privacy scope.

## Current Windows security boundary — source0.2.0-dev.7

Original fixed PowerShell5.1/.NETFramework/C# handle+NTFS ACL adapter now backs
journal/state/selected-export APIs. No shell/profile/module discovery/policy
override/elevation/ACL repair, no additional model call. Private descriptors at
creation, pinned no-reparse ancestors, same-handle owner/DACL/file checks, local
fixed NTFS only, bounded framed IPC and owned-process-tree cleanup. State keeps
hashed scope IDs, metadata allowlist,64scopes, two1MiB files and explicit fresh-
content-checked prune. Foreign broad/inherited/null/unsupported grants refuse;
trusted OS administrators/hostile same-user processes are outside the claim.

Native primitive checkpoint f152acb/CI40033656920 passed15/15 on Node22/24 Windows
Server2025. Integrated source f63ebab adds public API/CLI, cancellation and actual
Windows synthetic hook-subprocess tests; result belongs in TEST-LOG. These are
OS/subprocess tests, never Codex Windows installation/event/UI acceptance.

Windows hook-main routes only optional telemetry through windows-hook.mjs, one
shared1500ms budget+500ms cleanup. Exact explicitly selected native cwd string
only; no descendant/casefold/network scope walk or command-based inference.
Storage failure cannot replace deny/rewrite output. Public reads use15s default,
validated AbortSignal cancels only owned helper tree; pre-abort does not spawn.
State observer/MCP activity and selected-export reads propagate cancellation.
POSIX scope/storage and all logging defaults/registrations are unchanged.

Windows runtime settings and every workspace selectedRoot entry refuse *before*
traversal/spawn. Private reader success cannot safely enable existing POSIX Git
PATH/current-project executable lookup or inherited Windows temporary scratch.
Absolute trusted local executable, atomically private scratch, trusted cwd/env,
no-follow project/object traversal and owned Git tree cleanup need separate native
validation. Windows restore also stays refused before IO: private plan creation,
project writes/metadata/conflict/interruption and sandbox require separate review.
These are explicitly unfinished requirements; no unsupported-Codex conclusion.
No installed snapshot/config/trust change. Source contract/primary APIs/next
acceptance: [Windows storage](../windows-storage.md).

Current dev6 contracts are unchanged. After human trust/restart, the actual
owned panel verified restricted flowchart/JSON/plain-code, unsupported fallback,
Clear and all six views; reviewed authored print rewrite passed. Optional observers
remain unregistered/unselected; logging settings/scope unchanged. Same-version
supported production remove/reinstall verified fresh hook/cache absence and exact
125-file restoration with preserved human trust/configuration. This is not already-
loaded desktop unload/older-version rollback evidence. No extra model run.

Earlier dev4 normal sandbox-negative rewrite and separate hold0.0.4 confirm/
decline/cancel/30s timeout remain version-specific. Hold removed; no remaining tool
namespace after restart. Human provenance/infrastructure fail-open limits remain.
The completed High stage resolved the scoped storage boundary; actual native platform
validation remains separate from CI. Native Windows project/restore enabling
requires stronger review and a suitable host, never a routine Medium refusal removal.

## New bounded contracts (source0.2.0-dev.5)

- ui/rendering.js: parseFlowchart(source), jsonTokens(source), renderLocalPreview
  (document,parent,format,source). Original restricted grammar,4,096 characters,
  16 nodes/24 edges/64 lines, no interpretation of HTML/directives/links. Bounded
  declaration-order SVG + complete node/edge tables; no full Mermaid runtime.
  JSON validation/token display only, plain code literal/control-visible. No
  model/tool/network/storage calls. Clear/teardown remove local source/output.
- src/dashboard-resource.mjs: loadDashboardHtml() bundles exactly fixed trusted
  package HTML/rendering assets, sizes128/64KiB. One checked marker, no script-close
  sequence in the static rendering asset; no user path/content interpolation.
- OBSERVER_EVENTS in src/constants.mjs and metadataState.observerEvents config:
  explicit seven-event allowlist, default absent. Default hooks remain three.
  Dispatcher branches before mod handlers/raw-envelope clone and returns exactly
  {}, event-only state metadata only when independently opted in. It never blocks
  Stop/interrupt, requests follow-up, approves, mutates prompts/models or reads
  transcript/response content. Counts are deliveries, not unique turns/success.
- examples/hooks/observe-lifecycle.json and examples/events: optional reviewed
  registration, seven synthetic released0.163.0 projections. Not installed.
  New event reception itself exposes host payload in local process memory;
  registration and storage opt-ins are separately reviewed, same scoped retention.
  No automatic optional-hook installation/logging expansion.

See docs/local-preview.md and docs/lifecycle-observation.md for grammar, evidence,
acceptance and limits. High reviewed risky parser/output/privacy paths; Medium
may verify/fix within these contracts. A broader runtime, ACL adapter or approval
bridge requires stronger reasoning and a new explicit checkpoint/switch.

## Product surfaces

1. **Official native client extension:** supported lifecycle hooks, local plugin
   installation, skills, MCP and documented Extensions entrypoints.
2. **Plugin-owned component:** MCP App HTML in host-managed isolation. It may own
   controls, charts, explorer, diffs and status, but not native transcript rows.
3. **External companion:** optional export/report in a browser or file; label it.
4. **App-server client:** a different client with its own approvals and event
   stream. Requires user agreement before becoming a major product direction.
5. **Fork/patch:** excluded from implementation. No installed-app modification,
   private internals, injection or trust bypass.

## Stable boundaries

The production dispatcher implements the reviewed v2 contract below. The separate
proof remains fixed-marker evidence, not arbitrary production-field permission.
Do not remove output validation to enable additional hook fields.

The implemented v2 internal result is a discriminated union: abstain, visible notice,
denial, or a typed tool-input proposal. Only the adapter emits host wire fields.
A denial always wins. Multiple distinct proposals are an error/denial, not
last-writer-wins. A transformation is opt-in per exact tool and rule, size bounded,
visible before/after, and cannot modify permission/sandbox/model/prompt fields.
Revalidate after transformation and send through the normal native permission
path. Native hooks from other sources remain concurrently ordered by the host.

Never emit PermissionRequest approval. PreToolUse's wire `allow` is permitted
only as the documented carrier paired with validated updatedInput; it means
continue ordinary handling, not grant elevated permissions. Keep tests for this
distinction. Bare allow, unsupported ask, fabricated results and prompt rewrites
remain prohibited.

## Human decision adapter

Try a supported synchronous MCP hook that requests elicitation and waits for the
human. Use a nonempty form with a required boolean `confirm`; accept only
`action === "accept" && content.confirm === true`, and verify response provenance
and host automatic-review behavior. Empty/default form acceptance is insufficient.
Acceptance returns abstention so the host still evaluates its normal
permissions; rejection/cancel returns denial. Missing elicitation capability,
malformed response and timeout must be surfaced, never interpreted as consent.
Native host hook failures can still fail open; this remains a guardrail.
If the host cannot perform the hold, use visible deny-plus-explicit-retry with
impact information, clearly labeled an approximation. A panel button is never
represented as approving a native call unless that exact bridge was verified.

## Metadata and sensitive content

`src/state.mjs` defines the initial stable storage API:

- `metadataScopeKey({projectId, sessionId?})` hashes explicit scope identifiers.
- `recordMetadataEvent(directory, scope, metadata)` accepts event/tool/deny only.
- `readMetadataState(directory, scope)` returns retained counts and a revision.
- `observeMetadataState(directory, scope, options)` is bounded and cancellable.
- `pruneMetadataState(directory, {before})` requires an explicit cutoff.

Session scope is the default for native adapters. Project-wide scope must be
explicit; omit sessionId only when the user selected cross-session aggregation.
Hashing does not anonymize guessable paths/IDs. Never store raw envelopes,
commands, prompts, transcript paths, outputs or credentials in the metadata lane.
Counts describe retained records, not all-time usage or successful actions.
64 scopes, two bounded journal files per scope, private POSIX ownership/modes,
no-follow/link checks, serialized writes and explicit pruning are current limits.
The process-user boundary is not protection from hostile same-user code.
Windows storage uses the handle/ACL adapter described above; Windows dashboard/
project/Git/restore remain refused pending their separate boundaries.

Native scope is the session directory supplied by Codex. A tool workdir is not a
trustworthy per-call identity in the covered hook adapter (it supplies command
only). src/scope.mjs centralizes canonical containment and the path-free no-write
CLI diagnostic. Never parse commands for project identity, map parent-chat events
into a selected child, expand logging automatically or scan private session stores.
A matching selected-project CLI run established native three-event capture;
producer health still remains unknown from retained counts alone.

The read-only changes lane is separate and patches explicitly opted in because
patches may contain secrets. Prefer user-selected Git checkpoints or exported
structured events. Never discover private chat/session files. Label provenance:
Git changes can include concurrent human edits; tool attempts can fail or be
denied. Source0.2.0-dev.3 selected-checkpoint comparison accepts two full SHA-1
commit IDs only. Historical symlinks/submodules and sensitive paths are excluded;
content opt-in remains separate. It is not automatic assistant-turn attribution.

Restoration is a separate CLI, never an MCP writer/panel action. Plan creation
stores both bounded file versions in private outside-project0600 storage; the
local summary exposes canonical target root/path for meaningful review. Base64
is not encryption. Re-derive versions from selected local Git objects on review/
apply; reject arbitrary content/path/unknown fields. Exact plan ID is content
identity, not authenticated human consent or permission approval. Require explicit
restore intent and ordinary host tool permissions. Current support is one regular
UTF-8 text file present with unchanged executable mode at both endpoints; no
add/delete/binary/force/mode changes. Fresh expected-content/identity checks and a
cooperative lock reject ordinary conflicts. In-place writes preserve inode/mode/
ownership/extended metadata; they are not interruption-atomic or an OS boundary
against hostile same-user races. Both versions remain for explicit recovery;
ordinary write failure attempts rollback, crash/disk failure needs acceptance.
Windows refuses pending private-plan ACL validation. See docs/replay.md.

## Local service and UI

Use stdio MCP, no listening network port by default. The server offers bounded,
schema-validated read methods and narrowly scoped explicit mutations. UI cannot
supply arbitrary paths/commands. Select a project through an authorized host
resource or a reviewed server configuration; canonicalize/contain every read,
exclude secrets/ignored paths, reject special files and escaping links. Git
subprocesses use argument arrays, sanitized helper settings, time/output bounds.
Never run project commands to estimate blast radius.

Expose separate global/thread entrypoints if both are useful. Detect host
capabilities/version, give text fallback, apply host style variables, label
controls, preserve keyboard focus and close observers on teardown. Avoid remote
assets or rendering untrusted HTML. Test actual host pixels/interaction, not
just a browser mock. Core deterministic callbacks and buttons make no model calls.

## Usage, routing and skills

Usage adapters consume only documented fields supplied to the selected run.
Missing is unavailable, never zero. Distinguish context occupancy, cumulative
tokens, cache counters, account limits and estimated cost. Do not infer billing,
TTL or cache health; no paid keepalive. A new exec/app-server run consumes model
usage and must be visible, authorized and bounded.

Routing creates a new explicitly configured task/agent using supported model
settings. It does not intercept an existing inference or change the user's
selected model. Preserve inherited permissions and host constraints. No routing
proof may bypass the human-controlled development model switches.

Initial skill collection: mod scaffolding, systematic debugging, verification
before completion and review preparation. These are model-mediated workflows,
not immediate slash callbacks. Each needs a narrow trigger, permitted reads/
writes/commands, explicit model-usage statement and stop conditions. Scaffolding
outputs a reviewable change and permission manifest, validates/replays it, then
uses supported installation/trust; it never automatically trusts generated code.

## Installation and updates

Use compatibility-only `.codex-plugin/plugin.json` with no root `plugin.json`.
The released 0.163/0.164 portable loader skips hooks; adding a compatibility
overlay beside it does not fix discovery. Installed0.2.0-dev.6 is human-
trusted and verified after desktop restart; source0.2.0-dev.8 is not installed; earlier0.2.0-dev.1 has native execution/UI
evidence on the recorded macOS host. Keep version-specific acceptance separate.
Legacy MCP uses `.mcp.json`, relative `cwd: "."` and script arguments; it does
not inject portable plugin variables. Pass a shared data location explicitly
through reviewed configuration to both hook and server. Never assume a local
marketplace directory confines user-profile installation to that project.

Keep development source and installed snapshots separate. Back up affected config
privately; merge only owned marketplace/plugin entries. Verify installed cached
content. CLI 0.163.0 may retain hook-definition trust when referenced JS changes;
require explicit disable/review/retrust. 0.164.0 adds content-bound checks, but
still test actual host behavior. Do not promise hot reload. Removal covers plugin
registration/cache, marketplace registration and separately retained data.

## Main implementation milestones after proof review

1. Native gates partly passed: production install/trust, covered tool events,
   fixed rewrite/deny and MCP App interaction verified. Selected-project standalone
   CLI SessionStart/tool metadata reached desktop Refresh. Visible start notice,
   one normal sandbox-negative rewrite and synchronous MCP fixed-marker responses passed; provenance/all-mode guarantees remain unverified.
2. Integrate event projection/state/MCP status and lifecycle controls with versioned
   contracts; add covered event types and validate timeout/error behavior.
3. Build useful bounded explorer, changes inspector, risk explanation and passive
   usage views. Each gets concrete safety tests and real-host acceptance.
4. Add coherent authoring/debug/review/verification skills and safe update tooling.
5. Native Windows install/process/ACL validation, full packaging/removal checks,
   accessibility, explicit compatibility matrix, independent risky-path review.

Completion is capability-by-capability. Passing small proofs is not completion
of these milestones or the full user request.

## Sol implementation checkpoint — 2026-10-23

The v2 proposal adapter is now implemented in the production dispatcher, with the
v1 result adapter preserved. `exactCommandRewrite` is disabled unless explicitly
configured/enabled. Only the command string changes (max200 characters); input
is copied/frozen, denial wins before and after transformation, distinct proposals
conflict, and full before/after disclosure is mandatory. Structural preparation
failures after valid PreToolUse validation now emit an explicit sanitized denial.
The host can still fail open on external hook infrastructure failures.

`metadataState` configuration is default off/session scoped. Hook launch accepts
explicit CODEX_MODS_DATA_DIR and CODEX_MODS_PROJECT_ROOT; canonical containment
prevents recording another project into the selected scope. MCP runtime settings
select the same directory/project/session deliberately. No session-file discovery.
Only explicitly requested project scope aggregates sessions. Root `docs/runtime.md`
describes actual access and setup; Windows state APIs use NTFS ACLs, while settings/
dashboard remain unavailable. Metadata errors cannot discard a denial.

Production `.mcp.json` now declares `src/server.mjs`, using the bounded local
`src/mcp-stdio.mjs` transport and `ui/dashboard.html`. Settings absent means project
and scoped activity unavailable. Tools are dashboard/activity/files/changes;
request schemas contain no arbitrary path, command, write or permission action.
Workspace Git operations use temporary sanitized metadata, selected local objects,
read-only copies of HEAD/index/excludes and no project/user Git configuration.
Patch content is separately opted in. Working-tree provenance is explicit and
must not be relabeled previous-turn replay. Unsupported Git layouts abstain.

The UI owns its four views and escapes text; optional observation is bounded to30s
with request cancellation and teardown. Installed0.2.0-dev.1 views were observed
in the actual host. Source0.2.0-dev.2 chart/tree/diff additions have simulated DOM
evidence only. Bridge/stdio tests stay distinct from either native panel.
Native-hook token/context/cache/billing data remain unavailable. An optional
explicit private export supplies only reported counters as described below.

The synchronous MCP-hook probe now has an implemented decision helper/transport.
Known automatic review denies, a nonempty required-confirm form is used, expected
failure emits valid denial, and acceptance would abstain for ordinary permissions.
Actual0.0.3 host held then denied on deadline; the user reported answering a form,
so successful human decision handling is not established. Disconnected startup
allowed the earlier fixed marker before the MCP connection appeared. The probe
was removed through supported CLI after testing. Reviewed source0.0.4 includes
transport/lifecycle corrections and requires a new reviewed snapshot before any
retest; installation/trust must not be inherited silently from0.0.3.


High-stage authoring contract: scaffoldMod accepts only three known declarative
templates, validates before exclusive output creation, emits disabled config and
a template access declaration. Source dev8 also emits matching/control JSON
fixtures and a disabled/temporary-enabled review sequence. Controls avoid lexical/
exact collisions; replay never executes their commands. Fixtures contain selected
match/from text as plaintext, so share the specification review/privacy scope.
No generated code, install, settings mutation or trust. Skills are model-mediated and declare scope/usage/limits. Production
fixture setup remains separate from public defaults and requires actual host
delivery after installation/trust; CLI inventory alone is insufficient.

Source0.2.0-dev.2 rendering keeps all data local and inert: SVG uses fixed tags and
numeric attributes, event values are nonnegative safe integers and a table remains
the text alternative. File grouping uses Map rather than object prototype keys,
500 paths/16 path segments at display level. Diff rendering uses textContent,
visible control/bidi escapes and64Ki character/1,000-line bounds. Color supplements
literal signs, not vice versa. No new dependency, remote asset or filesystem grant.


## Impact and usage contracts — source0.2.0-dev.4

blastRadiusGuard is opt-in, canonical Bash PreToolUse only, with six fixed lexical
categories. It emits a bounded conservative explanation/denial, no raw command,
arguments, inferred targets/counts or native approval. Original/revised command
guards both apply. CLI impact is assessment only. This is the disclosed deny/review
alternative to the still-unverified hold proof, not an authenticated pending choice.
No match means no covered lexical signal, not safety; false positives/misses remain.

usageExport is a separate reviewed read grant to one private canonical/unlinked
outside-project JSONL. No model/UI path parameter, private-session search, content
persistence, sampling, price lookup or network. readSelectedUsage bounds bytes,
lines, diagnostics/completions and private ownership/mode; errors don't echo raw
content or paths. summarizeExecUsage returns known numeric fields/nulls from the
latest completion only, checks same-thread export and never sums snapshots.
Released0.163.0 emission copies cumulative thread totals and can emit default zeros;
source authenticity/completeness is not attested. Cached share requires populated
numerator/positive denominator and does not estimate cache health/TTL/cost/context.
No export default; mods.usage has no args. Access view distinguishes service calls
from normal chat/skill usage and displays unknowns explicitly.

Source5a4ecd7 exact-tree remote/anonymous-clone verified; all5 CI jobs passed
run40022914501. Next human-selected setting Sol Medium for bounded routine
acceptance/lifecycle/docs/packaging; new security contract expansion is excluded
from that routine phase and requires a stronger-model checkpoint.
