# Codex contracts: release-aware research checkpoint

Research date: 2026-10-23. This record separates documentation, released source,
installed-client inspection, and native execution. The separate compatibility
proof package has passed installation, human trust, covered desktop tool hooks
and basic MCP App interaction. This is not completion or installation of the
production product. Detailed native proof results belong in `TEST-LOG.md`.

**Critical correction from live investigation:** portable root `plugin.json`
packages load MCP servers but **do not load bundled hooks in released Codex
0.163.0 or 0.164.0**. Both release loaders deliberately return an empty hook
inventory for the `AgentPlugin` format. Current documentation says portable
OpenAI extension metadata can declare hooks, but parsing such metadata is not
execution support. See the installation correction below. The investigation observed
an installed portable probe with its MCP server present and `hooks: []`; a
reported trust action could not establish delivery of those absent hooks.
Replacing that probe with compatibility-only version 0.0.2 resolved discovery:
the current inventory has three enabled, human-trusted hooks and the MCP server,
with zero discovery warnings/errors. Actual desktop rewrite/deny and owned UI
interaction were then observed. The production package's compatibility-only
migration is prepared as 0.1.1-dev.1; its native installation and acceptance
checks remain separate and outstanding.

## Versions and evidence

- Installed command-line client inspected: `codex-cli 0.163.0`. Read-only help
  calls succeeded despite a warning that PATH aliases could not be created.
- Actual native proof host: com.openai.codex desktop / ChatGPT
  `26.1016.62342`, build `21477`, macOS `14.6` arm64. The MCP App reported
  `chatgpt 26.1016.62342`. The system CLI version is not the desktop runtime's
  version; do not relabel desktop tool delivery as standalone CLI execution.
- GitHub's `rust-v0.163.0` release tag resolves to commit
  `83086188ae0614bd882818ff1aa23f3194962012`, published 2026-10-15.
- GitHub's latest stable release retrieved on the research date is `0.164.0`;
  `rust-v0.164.0` resolves to `6aaac694803004a63c6f393d153c96d22521a6b9`.
- The earlier research checkout remains at main commit
  `a3d93e1e692f1144cf8685175a5d1f6bf7294f57`, dated 2026-10-22. It is not the
  installed release. Important contracts below were rechecked against release
  tags, not inferred solely from that checkout.

Primary records: [0.163.0 release](https://github.com/openai/codex/releases/tag/rust-v0.163.0),
[0.163.0 tag object](https://api.github.com/repos/openai/codex/git/tags/129b8ec7ee6f4511557a4856279f529025c25af4),
[0.164.0 release](https://github.com/openai/codex/releases/tag/rust-v0.164.0),
[0.164.0 tag object](https://api.github.com/repos/openai/codex/git/tags/fe3b29455488c2e189e43ad5526a107900c5e1b7).

## Native hooks and permission-preserving rewrites

Current [official hooks documentation](https://learn.chatgpt.com/docs/hooks)
documents lifecycle hooks, matching, trust review, and command/MCP handlers.
Command handlers consume one JSON event. The host executes matching handlers
concurrently. Hosted search and some specialized paths bypass the local tool
hook path; `write_stdin` does not repeat the original command's pre-hook.
Consequently this product is a guardrail, not a complete enforcement boundary.

The release parser accepts a rewrite only when `PreToolUse` contains both
`permissionDecision: "allow"` and `updatedInput`. A bare `allow`, `ask`, or
rewrite without `allow` is invalid. An invalid pre-hook produces a failed hook
record and allows normal tool processing to continue. This is distinct from a
valid `deny` with a nonempty reason. The original MVP's ban on all `allow`
outputs is a product restriction, not evidence that safe rewriting is absent.
See the [0.163.0 output parser](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/hooks/src/engine/output_parser.rs#L121)
and its [validation](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/hooks/src/engine/output_parser.rs#L441).

The release [tool registry](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/src/tools/registry.rs#L701)
applies replacement input to the invocation before dispatching the normal tool
handler. For shell execution, the adapter changes only the command string;
other execution arguments remain in the invocation. The regular handler then
resolves sandbox and approval requirements. `allow` in this specific pre-hook
rewrite envelope therefore does not itself grant elevated permissions. The fixed
harmless rewrite was observed in the desktop proof below. Actual host testing
must still verify preserved access limits and rejection/cancellation paths
before a general rewrite feature is enabled.

The released [exec adapter](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/src/tools/handlers/unified_exec/exec_command.rs#L518)
maps hook `tool_input.command` to the actual `cmd` field. It does not forward
arbitrary new shell permissions from a hook. The same released handler's
[permission resolution](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/src/tools/handlers/unified_exec/exec_command.rs#L246)
still applies. This is released source corroboration, separate from live proof.

The [pre-hook aggregator](https://github.com/openai/codex/blob/a3d93e1e692f1144cf8685175a5d1f6bf7294f57/codex-rs/hooks/src/events/pre_tool_use.rs#L125)
gives denial precedence. Without denial, concurrent rewrites resolve by
completion order. Within this package, retain a single dispatcher and explicit
rewrite-conflict rejection. Another plugin's independently running rewrite can
still compete; never promise system-wide ordering.

### Proof envelope

Use an explicitly installed proof plugin and an exact synthetic command only:

```json
{
  "systemMessage": "Claude Mods proof: printf MODS_BEFORE -> printf MODS_AFTER; normal permissions still apply.",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "updatedInput": { "command": "printf MODS_AFTER" }
  }
}
```

`systemMessage` and the hook-specific output coexist in the release parser.
Whether the installed desktop renders that warning visibly is a separate live
acceptance criterion. Do not generalize this proof into arbitrary shell text
rewriting or rewrite user prompts. The proof function must return `{}` for
near-matches, other tools/events, and disabled rewriting, preserve its input,
and never emit a permission-approval decision.

Implemented at `proofs/rewrite.mjs`: `proofHookResponse(event, options)` defaults
rewriting to disabled; `rewriteProof(event)` enables only this exact probe for
the separately installed proof plugin. The exact `printf MODS_DENY` marker
returns a denial. Unknown events, other tools, and near-matches return `{}`.
`node --test test/rewrite.test.mjs` was actually run: **5 passed, 0 failed**.
These are deterministic unit tests, not a native-host permission test.

The installed compatibility proof subsequently received real covered desktop
tool events: `printf MODS_BEFORE` produced `MODS_AFTER`, the exact DENY marker
was blocked before execution, and an unrelated UNCHANGED marker ran unchanged.
This establishes native execution and output handling for those narrow cases.
It does **not** establish a negative permission/sandbox test, general rewrite
safety, cancellation/error handling, or all event types. A harmless rewritten
request that the normal host must reject or hold still needs independent
verification. SessionStart delivery remains unverified; an ephemeral
app-server `thread/start` without a model turn produced no SessionStart evidence.

The real plugin-owned MCP App connected in the intended host. Its local button
changed 0→1, and explicit Refresh changed retained metadata records 22→29 after
real hook activity. This is a verified owned component and manual refresh, not
an automatic subscription, native transcript restyling, or a complete UI
lifecycle/accessibility result. The proof callbacks made no additional model
calls. Synchronous MCP-hook elicitation remains unimplemented and unverified.

## Explicit human decisions and blast-radius

`PreToolUse.permissionDecision: "ask"` cannot implement a native hold in the
inspected release. A declaration in a JSON schema does not change this runtime
result. A hook that emits `ask` risks allowing the operation after an error.

`PermissionRequest` runs when the host already needs approval. Its empty output
preserves the normal approval prompt. Its `decision.behavior: "allow"` can
suppress that prompt and is prohibited by this project. Its denial can reject
the pending request; reserved mutation fields fail closed. See the event
contract in [Hooks](https://learn.chatgpt.com/docs/hooks#permissionrequest).

Initial safe blast-radius behavior: explain the lexical risk and deny the
covered call. For calls already requiring host approval, add bounded impact
information and abstain. This is an approximation to forcing a prompt for every
risky call. Do not claim that a plugin-owned button approves the native pending
call. Any later explicit retry must still traverse the host's permissions.

App-server has real client-directed approval requests with accept, decline, and
cancel decisions, but owning that response means operating an app-server client.
It is not a native plugin control API. The user must agree before that becomes
a major product direction. MCP elicitation is another documented interaction;
the synchronous MCP-hook path below is a promising native hold mechanism whose
actual host behavior remains unverified here.
[App-server approval protocol](https://learn.chatgpt.com/docs/app-server#approvals).

### MCP-hook elicitation proof to implement next

An already-connected MCP server can service a synchronous pre-hook, ask the
user through form elicitation, and return a normal hook response after the
decision. The [released executor](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/src/hook_mcp_executor.rs#L18)
awaits the tool and feeds its text into the normal hook parser. It uses the
existing connection without waiting for server startup. The
[released MCP runner](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/hooks/src/engine/mcp_runner.rs#L27)
expands only the explicitly configured event-field arguments.

Proposed blast-radius hold: elicit for an exact harmless marker; on explicit
human acceptance return `{}` so normal host permissions still apply; on decline
or cancellation return a valid deny. Never return PermissionRequest approval.
Check that the chosen host surfaces the form to the human and does not resolve
it through automatic review. Do not treat lack of a response as acceptance.
Use a nonempty form with a required `confirm` boolean and require both
`action: "accept"` and `content.confirm === true`. Generic acceptance with an
empty object is insufficient evidence of human review. Preserve any available
response provenance and test the host's automatic-review settings explicitly.
Validate timeout, disconnect, missing-tool, and crash behavior separately:
hooks remain an advisory boundary because infrastructure errors can fail open.
This path is a prioritized experiment, not an implemented capability.
The released MCP client includes
[active-time timeout tests](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/rmcp-client/src/rmcp_client.rs)
for pausing deadlines during elicitation; these upstream tests were inspected,
not executed here.

## Local installation, updates, trust, and removal

Read-only help on installed 0.163.0 confirmed these interfaces:

```text
codex plugin marketplace add <marketplace-root>
codex plugin marketplace list
codex plugin add <plugin>@<marketplace> --json
codex plugin list --marketplace <marketplace> --json
codex plugin remove <plugin>@<marketplace>
codex plugin marketplace remove <marketplace>
```

`plugin add --help` explicitly accepts the selector shown. The stage used the
supported marketplace/plugin operations to install the separate proof, then
remove the portable version and install compatibility-only version 0.0.2.
Installation is user-local registration plus a versioned cached snapshot; it
does not install the production plugin. Affected configuration was backed up,
unrelated entries were preserved, and the human reviewed the three hook trust
declarations. Machine-specific backup, snapshot and data locations are recorded
only in the ignored local handoff. See the public handoff for scoped removal
and restoration instructions; do not delete unrelated cache or configuration.

The [packaging guide](https://developers.openai.com/plugins/build/plugins)
documents local marketplaces, portable root `plugin.json`, `skills/`, and MCP
configuration. It currently emphasizes desktop installation/testing even though
the installed CLI also advertises install operations. Local plugin entries are
copied into a versioned cache; changes to the source directory are not proof
that the installed cache changed. Follow refresh/restart instructions and
verify actual loaded files. Installing a plugin and trusting its hooks are
separate actions. The guide supports per-project enable/disable configuration
for trusted projects and resolves local paths from the marketplace root.

### Released hook packaging contradicts portable documentation

The [0.163.0 loader](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core-plugins/src/loader.rs#L963)
and [0.164.0 loader](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core-plugins/src/loader.rs#L973)
skip `load_plugin_hooks` for `PluginManifestFormat::AgentPlugin` and produce
empty hook sources. Their [plugin/read implementation](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core-plugins/src/manager.rs#L2751)
also reports hooks only for `Legacy` manifests. Both release files were actually
retrieved to verify this gate. This supersedes earlier inference from the
manifest parser, docs, and standalone hook schemas.

Use a compatibility-only hook distribution rooted at
`.codex-plugin/plugin.json`, with `hooks` and `skills` paths relative to the
package root and a legacy `.mcp.json` if needed. Omit root `plugin.json` from
that distribution so it cannot select the portable format. Do not merely add a
compatibility overlay next to the portable root and assume it enables hooks.
This compatibility layout passed inventory, human trust, and covered harmless
desktop execution for the separate proof. Production packaging and each target
client still require their own checks. Keep the portable MCP-only format
separately if useful; do not claim hook parity.

The released [manifest-selection code](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/utils/plugins/src/plugin_namespace.rs#L43)
selects a schema-recognized root `plugin.json` before compatibility manifests.
A `.codex-plugin/plugin.json` can declare `"hooks": "./hooks/hooks.json"`,
`"skills": "./skills"`, and `"mcpServers": "./.mcp.json"`; these paths resolve
from the plugin root, not the manifest subdirectory. This is exercised by the
[released manifest tests](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core-plugins/src/manifest.rs#L978).

The legacy MCP parser differs materially from the portable parser. It resolves
a relative `cwd` from the installed plugin root but does **not** perform the
portable `${PLUGIN_ROOT}`/`${PLUGIN_DATA}` argument substitution or automatic
reserved-variable injection. Use an explicit package-relative working directory
and script argument, for example:

```json
{
  "mcpServers": {
    "mods-proof": {
      "command": "node",
      "args": ["proofs/server.mjs"],
      "cwd": "."
    }
  }
}
```

`proofs/server.mjs` is the actual reviewed proof entrypoint. The installed probe
also sets an explicit private `CODEX_MODS_PROOF_DATA` location, omitted from this
portable example. Shared-state location must be passed deliberately; it cannot
be assumed to arrive as `PLUGIN_DATA` in the legacy MCP process. Hook processes
still receive their documented plugin variables. See the
[released legacy MCP normalization](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/codex-mcp/src/plugin_config.rs#L240).
These findings apply directly to the inspected CLI releases. A desktop's
bundled runtime may differ, so inspect its actual hook inventory and record
its version separately before declaring desktop support.

**Release-specific trust difference:** 0.163.0's
[discovery hash](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/hooks/src/engine/discovery.rs#L769)
covers the normalized event, matcher group, and handler configuration. Its
command runner does not perform the newer bundle-content verification. Merely
changing referenced JavaScript must not be assumed to invalidate trust there.
Version 0.164.0 adds
[execution-time plugin-content verification](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/engine/plugin_trust.rs#L26).
This is a released behavior difference, not an unresolved main-only proposal.

Safe development sequence: disable the relevant plugin/hooks; review the source
diff and declared access; validate and replay; update via the supported
marketplace flow; inspect the installed cache; have the human review/trust the
new definition in `/hooks`; re-enable only the reviewed definitions and run
harmless checks. On older
hosts, require this review explicitly even if the host does not detect the
changed code. Never write trust hashes or use a trust-bypass flag automatically.
Back up changed configuration and preserve unrelated entries. Removal must
separately address registration, cached code, and optional retained data.

### Portable MCP packaging confirmed in 0.163.0

The released [portable manifest parser](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core-plugins/src/agent_plugin_manifest.rs#L161)
maps a root Agent Plugins manifest to `./mcp.json`. The
[released MCP parser](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/codex-mcp/src/agent_plugin_config.rs#L40)
accepts this shape:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "mods-proof": {
      "type": "stdio",
      "command": "node",
      "args": ["${PLUGIN_ROOT}/proofs/server.mjs"]
    }
  }
}
```

This is an alternative portable MCP-only configuration; the installed native
hook proof uses the compatibility configuration above. The parser expands plugin
root/data placeholders in arguments and environment, defaults the server's
working directory to its plugin root, and supplies reserved `PLUGIN_ROOT` and
`PLUGIN_DATA` environment variables. A server cannot override those names.
The command must be a bare executable or a contained `./` path. Portable
transport type and schema are required; renaming legacy `.mcp.json` is
insufficient. Unknown fields are rejected by this released format.

### Bounded, read-only native inventory

`proofs/inspect-native.mjs` initializes a short-lived app-server connection and
calls only `hooks/list` and `plugin/read`. It starts no thread/model turn,
reads no chats and writes no trust decisions. For example, replace these
placeholders with the selected disposable project and generated marketplace
JSON file:

```text
node proofs/inspect-native.mjs --project /absolute/disposable-project --marketplace /absolute/marketplace.json
```

The script uses a 20-second deadline, a 2 MiB stdout bound and child-process
cleanup; it emits only an allowlisted summary for the proof plugin. Protocol
tests use synthetic subprocesses and are labeled accordingly. The actual-host
run separately succeeded: installed version 0.0.2, enabled plugin, three trusted
hooks, `mods-proof` MCP server and zero warnings/errors. Inventory alone is not
execution evidence; the narrow desktop executions above supply that distinct
observation. Native Windows process cleanup remains unverified.

## Process boundary and privacy

The released [command runner](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/hooks/src/engine/command_runner.rs#L213)
launches the configured hook shell directly. This path is distinct from the
model-executed tool's sandbox orchestration. Hook installation is a grant of
local-code trust: do not describe the hook process as sandboxed by the pending
tool's permission profile. It inherits a filtered session environment; that
filter is not a general guarantee that every credential is absent.

Hooks can receive working-directory and transcript-path fields, tool arguments,
and some tool results. Receipt does not authorize reading transcript files or
persisting their contents. Use event/session identifiers only for opaque scope
keys; do not publish them. Retain counts and bounded allowlisted metadata by
default. Reading edits or exporting a timeline needs an explicit scoped input
or opt-in capture. A hook crash/timeout cannot be claimed to enforce denial.

MCP server access is a separate boundary that must be documented from its
actual launch configuration. Do not assume all local MCP servers share either
the hook process privileges or the model shell sandbox. UI code should access
only explicit narrow tools, not arbitrary host filesystem APIs.

## Events, usage, and routing

[Released exec event types](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/exec/src/exec_events.rs#L8)
include thread/turn/item events. Turn completion carries input, cached-input,
cache-write-input, output, and reasoning-output token counters in the source
schema. A field present in that structure does not establish a populated value
from every provider. `codex exec --json` observes its own explicitly launched
run; it does not attach to all existing desktop chats. Raw streams can contain
arguments, output, reasoning summaries, and messages, so use deliberate
redaction and metadata projection before storage. Official
[non-interactive documentation](https://learn.chatgpt.com/docs/non-interactive-mode)
also documents ephemeral runs and machine-readable output. Such runs use model
allowance; they are not free local callbacks.

Token-weather can show observed counters with source, timestamp, and missing-data
states. Cache-tax can show measured cached-token ratios where provided. Neither
can infer exact billing, cache TTL, or cache health from a ratio. Do not add
keepalive model calls. Hooks' ordinary lifecycle envelopes do not constitute a
documented token-usage feed.

[Current custom-agent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents)
allows configured new subagents to use selected models/efforts while inheriting
the parent's permissions, provider, and MCP connections. Configuration files
cannot override those security settings. Spawn/configuration selects a new
task; it does not intercept and reroute an existing inference request. Plugin
workflow skills can request explicit delegation but are not deterministic
native callbacks. Additional agents consume usage. For this staged task all
model-switch gates remain human-controlled; no proof may replace the user's
selected model or bypass a stage using delegation.

## Windows risks and validation plan

The [official Windows sandbox guide](https://learn.chatgpt.com/docs/windows/windows-sandbox)
documents native Windows clients and distinguishes MXC, elevated, and unelevated
sandboxes. Windows 11 is the recommended baseline; WSL2 runs the Linux path.
Neither documentation nor macOS tests establish this package's compatibility.

Concrete package risks found in the starting implementation:

- Hook commands use `${PLUGIN_ROOT}` shell expansion; native Windows default
  command handling needs a reviewed `commandWindows` form.
- POSIX private-mode and ownership checks in `src/journal.mjs` are not Windows
  ACL validation. Do not disable privacy checks simply to make tests pass.
- No-follow/nonblocking flags need platform-aware treatment; a Windows-looking
  path in a macOS test does not exercise junctions or Windows file identity.
- Symlink tests may require privileges. FIFO tests are intentionally POSIX-only.
- Child cleanup, command quoting, rename/rotation with open handles, long and
  Unicode paths, and scoped installation require native verification.

The CI workflow now separates macOS/Linux package tests from a limited Windows
portable-contract job; record observed remote results and commit IDs before
claiming they passed. Native host tests remain separate. On Windows, first
verify an ACL-backed private storage
adapter or fail explicitly with an informative limitation. Test with spaces,
Unicode, junctions, drive/UNC paths, concurrent writers, stale locks, timeout and
cancelled child processes. Then run a disposable native Codex installation,
human trust review, harmless echo/rewrite/deny, disable/update/remove, and verify
configuration restoration. Without that host, keep Windows native support
unverified. WSL verification does not substitute for native Windows.

## Retrieval and research limits

Successfully retrieved current official Hooks, plugin packaging, app-server,
non-interactive mode, custom agents, and Windows sandbox pages plus released
GitHub source. Initial `/docs/subagents` and `/docs/windows` guesses returned
404; their canonical paths above succeeded. Markdown variants were rejected by
the browsing tool's content-type handling; the HTML pages were read instead.
Direct shell fetch was unavailable in the sandbox, so connected/web read tools
were used. The GitHub main commits web view was stale and was not used to infer
the latest commit.

No REA execution was needed: public released source resolved the concrete
rewrite and trust questions. The previous metadata/source-map investigation
remains exactly that; no new semantic/runtime REA result is claimed.


## Reported exec usage semantics — released0.163.0, checked2026-10-23

Exact release source (tag/commit already identified above) was fetched into the
read-only research checkout for this uncertainty; working checkout was not changed.
The [Usage fields](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/exec/src/exec_events.rs#L59)
include input, cached input, cache-write input, output and reasoning output.
The event comments describe a turn, but the released
[usage_from_last_total](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/exec/src/event_processor_with_jsonl_output.rs#L118)
copies ThreadTokenUsage.total and defaults to zeros when no usage was supplied.
[Completion emission](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/exec/src/event_processor_with_jsonl_output.rs#L509)
uses that snapshot. Therefore do not sum completion events as independent deltas
or infer actual free usage from reported zeros. A resumed thread can include
prior usage. The adapter preserves latest reported snapshot semantics and missing
fields, verifies bounded integer counters/relations and never infers occupancy,
cache health/TTL, price or exact billing.

The one explicitly authorized fresh ephemeral CLI0.163.0 Sol High test returned
42721 input/26368 cached/54 output; the passive source adapter subsequently read
that already-selected private export and returned the same counters, without a
new run or raw thread/prompt/tool content. JSONL export may contain sensitive
information; private explicit selection is required, not session-store discovery.
This establishes released schema plus source semantics plus one actual export;
it does not establish a native current-chat token feed or new UI rendering.

The same authorized run also establishes explicit model/effort selection for a
new bounded CLI task on this host. It did not intercept an inference, change this
chat's selected model, prove custom-subagent routing or authorize further runs.
