# Extension architecture and security contracts

Decision date: 2026-10-23. Development design; outstanding proof gates are explicit.
Read CODEX-CONTRACTS.md and CLAUDE-RESEARCH.md for dated primary evidence.

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

The current production dispatcher remains deny-only until the integrated v2
contract is reviewed. `proofs/rewrite.mjs` is deliberately separate, matching
only fixed harmless commands. Do not merely remove output validation to enable
arbitrary hook fields.

Proposed v2 internal result is a discriminated union: abstain, visible notice,
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
Windows storage refuses operation until an ACL-backed adapter is reviewed.

A later read-only changes lane must be separate and explicitly opted in because
patches may contain secrets. Prefer user-selected Git checkpoints or exported
structured events. Never discover private chat/session files. Label provenance:
Git changes can include concurrent human edits; tool attempts can fail or be
denied. Restore is a separate reviewed write with a fresh diff and conflict check.

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
overlay beside it does not fix discovery. Production source is now migrated to
0.1.1-dev.1; only the separate proof has live installation/execution evidence.
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

1. Native proof gates partly passed: proof install/trust, covered tool events,
   fixed rewrite/deny and MCP App interaction verified. SessionStart, negative
   permission-boundary checks and synchronous MCP elicitation remain pending.
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
describes actual access and setup; native Windows ACL-backed settings/state remain
unavailable. Metadata errors cannot discard a denial.

Production `.mcp.json` now declares `src/server.mjs`, using the bounded local
`src/mcp-stdio.mjs` transport and `ui/dashboard.html`. Settings absent means project
and scoped activity unavailable. Tools are dashboard/activity/files/changes;
request schemas contain no arbitrary path, command, write or permission action.
Workspace Git operations use temporary sanitized metadata, selected local objects,
read-only copies of HEAD/index/excludes and no project/user Git configuration.
Patch content is separately opted in. Working-tree provenance is explicit and
must not be relabeled previous-turn replay. Unsupported Git layouts abstain.

The UI owns its four views and escapes text; optional observation is bounded to30s
with request cancellation and teardown. It remains unverified in the actual host.
Synthetic bridge/stdio tests are separate from Astra's different native panel.
Token/context/cache/billing data remain unavailable, never fabricated.

The synchronous MCP-hook probe now has an implemented decision helper/transport.
Known automatic review denies, a nonempty required-confirm form is used, expected
failure emits valid denial, and acceptance would abstain for ordinary permissions.
Actual0.0.3 host held then denied on deadline; the user reported answering a form,
so successful human decision handling is not established. Disconnected startup
allowed the earlier fixed marker before the MCP connection appeared. The probe
was removed through supported CLI after testing. Reviewed source0.0.4 includes
transport/lifecycle corrections and requires a new reviewed snapshot before any
retest; installation/trust must not be inherited silently from0.0.3.
