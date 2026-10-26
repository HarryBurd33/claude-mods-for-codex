# Optional unchanged-input call review — source only

2026-10-26. This component is implemented and offline-tested, uninstalled and disabled
by default. It is source candidate0.2.0-dev.39, not a released or installed feature.
Installed31 and the default three hooks/config/MCP registration are unchanged.
Native acceptance and host trust review remain incomplete. Exact offline candidate
packaging is a separate record; source changes alone do not establish archive results.
This is an advisory review, not a complete risky-command enforcement boundary.

## Contract and composition

`src/hold-review.mjs` consumes the three-field `PreToolUse` / `Bash` carrier. It uses
the existing fixed lexical impact categories to select reviews. No match means
abstention, not safety. Aliases, wrappers, quoting and help/dry-run text can cause
misses or false positives. Targets, file counts and actual blast radius are unknown.
The form displays fixed category explanations, without raw commands or targets.

The supported profile explicitly requires `inputPolicy: "unchanged-only"`, a shared
fixed hook configuration and **no input-mutating hooks from any source**. The optional
handler checks the selected existing deny/impact guards before the form and rechecks
configuration/guards after confirmation. Existing guard denial wins. Any enabled
`exactCommandRewrite`, even one that does not match this command, refuses review.
Unknown or malformed configuration also denies. It never disables a mod or executes
a proposed replacement. Existing command-hook rewrite/recheck behavior is unchanged.

This restriction does not verify another plugin's policy, independently overridden
command-hook config, or final effective arguments. Before/after snapshots detect an
observed shared-config change; they are transient and are not atomic across processes,
a configuration baseline or a permission ticket. External mutation and independent
configurations are unsupported. A momentary change restored between reads can escape
comparison. No global ordering is inferred from separate command/MCP hooks. Keep the
existing deny/local-assessment alternative for unsupported combinations.

A required boolean confirmation has no affirmative default. Valid acceptance returns
**exactly `{}`**, then normal host permission checks continue. No `allow`, input
replacement, permission rewrite or remembered exception is emitted. Decline, cancel,
false/missing/malformed confirmation, known `_meta.approvals_reviewer: "auto_review"`,
missing form capability, transport error, config failure, cancellation and deadline
produce a fixed denial when the service can answer. Absence of the auto-review marker
is **not authenticated human provenance**. A model-invoked tool call cannot prove a
pending native call or mint permission. Panel buttons have no held-call authority.

One matching review/form may be active per service; a concurrent matching request
is denied without queueing/retrying. The total logical deadline is at most 30 seconds,
covering both config reads and the form. Checks surround awaited work and future
form/read actions. Abort stops host requests; late responses cannot authorize a later
call. Disposal cancels a pending review. A trusted IO operation already started may
finish after cancellation; its result is ignored and no late form is created. Node
scheduling stalls can delay returning a denial; this is not an OS-enforced deadline.

A crashed/disconnected service, hook adapter failure or host timeout may **fail open**
at the host. Offline denial tests do not establish complete enforcement. Normal host
permissions must remain enabled; do not replace them with this component.

## Selection and access difference

`examples/config/call-review.settings.json` is an inert runtime-settings fragment,
not a standalone settings file. It starts with `enabled: false`. Enabled selection
requires explicit known unique categories (delete, git-history, git-clean, permissions,
remote-write, install-scripts) and the unchanged-only profile. `timeoutMs` is an integer
1–30000, default 30000. Existing reviewed project/settings requirements and the Windows
before-IO refusal remain in force. Enabling this feature does not enable capture.

`examples/hooks/call-review.json` is a separate **unregistered** hook example using
the saved released MCP-hook carrier from the earlier hold0.0.4 proof. It must not be
copied into live config without a separately reviewed candidate, supported install
flow, human trust and an explicit native-test scope. `server: claude-mods` refers to
the existing source MCP connection. No activation/update/restart is performed here.
Hook coverage follows host hook application scope; it is not restricted by the logging
project selection. A reviewed deployment must account for that difference.

When disabled/absent, the service advertises the original eight tools; it performs no
call-review config read or elicitation. When enabled it additionally advertises
`mods.review_call`. It negotiates `elicitation.form` at initialization. The only tool
arguments are event name, tool name and tool input: paths, code, categories and policy
cannot be supplied through tool parameters. The trusted source seam is
`createDashboardHandler(settings, {loadHookConfig})`, for offline testing, not an API
for model-supplied loaders. Production lazily reads the existing `CODEX_MODS_CONFIG`
selection or packaged `config/mods.json` only for matching reviews, twice on acceptance.
The shared selection must be the same one used by the command hooks. Existing bounded
regular-file/no-final-symlink config IO is reused; this adds no directory scan or new
filesystem trust guarantee. Project-supplied config still needs separate human review.

The component receives covered arguments transiently, bounds and snapshots them,
and never writes state/logs/transcripts or reads targets, credentials or environment
values other than the existing config path selection. No command execution, network
client, model/API call or paid keepalive is added. Its stdio elicitation exchanges with
the host may be handled or retained by the host; host internals are outside this claim.
The local extension process has its OS account access, distinct from a model tool's
sandbox. Local deterministic callbacks consume no model tokens; invoking skills or
model-driven tools still consumes account usage. No assertion that the system is free.

## Verification and next steps

`test/hold-review.test.mjs` uses synthetic carriers/configs, private temporary fixtures
and in-memory JSON-RPC peers with the production handler/transport. Commands remain
data and are never executed. It covers default-off/nonmatching behavior, data bounds,
getter/proxy/prototype rejection, redaction, deny precedence/rewrite refusal, config
drift, explicit abstention, transport/capability errors, concurrent/late IDs,
cancellation/EOF, deadlines and disposal. Broader dispatcher/rewrite/UI/transport
regressions are recorded in `docs/continuation/M1-CALL-REVIEW-RESULT.md`.

No native host, Windows host or current upstream-contract check occurred in this
stage. Saved proof results do not establish this component's native acceptance.
Next: routine source/artifact review on Medium, then a separately authorized exact
candidate review. Native activation and any model usage require their own scope.
Until then leave the examples inert. Nothing was installed, so removal/rollback for
this stage is source Git review/reversion only; installed31 needs no restoration.
