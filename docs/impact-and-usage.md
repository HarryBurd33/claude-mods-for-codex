# Command impact review and passive usage

Source0.2.0-dev.29. Installed28 remains unchanged until reviewed update. No assessed
command is executed. No extra model run, network request, transcript lookup, policy
write or production logging occurs in this workflow. Chat/skills consume usage.

## Review locally, then choose a separate next step

The owned **Impact review** view accepts up to4,096 UTF-16 characters. Press
**Assess locally** to see fixed lexical impact signals and uncertainty. Choose
**Stop here**, **Revise request**, or **Review policy separately** for guidance.
The choice stays in the panel; it sends no prompt/tool request, approves nothing,
and does not cancel a running call. Editing the command clears the assessment and
choice. Clear/host teardown clears source/results and invalidates old controls.
No persistent storage or new service/path/export/capture grant. The host controls
its webview; avoid credentials. The field starts empty. This is an owned component
inside the official host after installation, not native approval chrome.

For an immediate local equivalent, use the verified absolute plugin CLI:
`node ABSOLUTE_PLUGIN/bin/codex-mods.mjs impact-review --stdin` with exactly a
JSON object containing a command string. Supply it as private stdin data, never
shell-interpolate the command or execute it to test classification. JSON input
is bounded32KiB and the command4,096characters. The result omits command/targets
and prints all matching explanations plus next-step guidance. No user decision is
stored or inferred. CLI stdin/shell history have their own privacy. Existing
`impact --stdin` retains its assessment-only response and prior1MiB limit.
These are local CLI commands, not immediate native slash callbacks. Management
skill routes the installed feature and consumes the selected model's usage.

## Denial and retry boundary

The disabled-by-default `examples/config/blast-radius-opt-in.json` selects six
fixed lexical categories: deletion, Git history/working files, Git clean,
permissions, remote writes/transfers and package operations. Choose categories
explicitly. Canonical Bash PreToolUse only; no dynamic code/regex or filesystem
scan/shell parsing, path expansion, target/file-count or safe-command inference.
Quoted documentation/help/dry-run may match; wrappers/aliases/flags may be missed.
No matches does not mean safe. Even a harmless print containing an example may
match: assess it as data; never use destructive demonstrations.

An enabled guard denies matching original/revised commands with a bounded first
impact explanation and next-step guidance. It returns no allow/ask/approval token,
command echo or updated permissions. A local choice does not override that denial.
Stop, describe a safer operation in chat, or explicitly request a separate narrow
human configuration review. Never rerun unchanged or automatically disable the
guard. Any subsequent tool request uses normal host permissions. Guard selection
applies to covered calls wherever that installed hook runs; logging scope does not
scope the guard. A new guard selection requires separate exact review/consent.

This is a **deny-and-review/retry approximation**. Current official documentation
still excludes PreToolUse ask; PermissionRequest runs only for calls already needing
host approval. Callback failure/missing service is advisory. See [official hooks](https://learn.chatgpt.com/docs/hooks),
retrieved2026-10-24. Separate removed hold0.0.4 exercised confirmed response paths
but remains unsuitable as production approval authority: disconnected fail-open
and response provenance limits. Do not reinstall it or promote its form to a
sandbox/security boundary. Invalid-envelope/process-timeout/disconnected failure
is not guaranteed denial. The local view works without a host service connection
but does not change the safety of a separate tool call.

## token-weather/cache-tax equivalent: selected reported counters

Native hook metadata has no context/token/cache/billing counters. Optionally
select a **private export you explicitly chose**, without scanning session stores:

```sh
node bin/codex-mods.mjs usage --export /absolute/private/selected-exec.jsonl
```

The file must be canonical, current-user owned, mode0600 and unlinked on POSIX;
Source7 Windows uses the local fixed NTFS handle/ACL private reader, with
explicit selected path and bounded cancellation; native Codex Windows acceptance
is separate. The export can contain sensitive prompts/tool output. Raw data is read in bounded memory but never returned or persisted by
this adapter. Bounds:1MiB,4,096 lines,256KiB/line,32 completion records and128
non-JSON diagnostic lines. Broken JSON, multiple thread identities, invalid
counters/relations and excess bounds report unavailable. Diagnostics aren't echoed.

The source is `codex exec --json` JSONL. No new run is required to inspect an
existing export. Creating a new model run consumes usage and requires a visible,
authorized, bounded task; this command does not do it. The adapter extracts only
known numeric counters from the **latest completion snapshot**, never sums
completion records and never returns thread IDs, prompts, arguments or raw paths.

Important released implementation detail: [Codex0.163.0 copies thread totals](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/exec/src/event_processor_with_jsonl_output.rs#L118)
into [turn.completed](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/exec/src/event_processor_with_jsonl_output.rs#L509).
Despite the event's per-turn wording, a resumed thread can include earlier usage.
Missing host usage can also emit default zero counters. Thus these are reported
values with unverified source authenticity/completeness, not exact current-run
charges or proof of free operation. Evidence retrieved2026-10-23; a fresh selected
CLI0.163.0 ephemeral test export was also successfully read with expected counters.

Input/output are required nonnegative safe integers. Optional cached/cache-write/
reasoning fields stay unavailable if absent. Cached input cannot exceed reported
input; reasoning output cannot exceed output. Cached-input share is calculated
only with a populated numerator and positive input denominator. It is not cache
health, remaining TTL, savings, billing or current context occupancy. No automatic
paid cache-warming/keepalive calls, model/provider price guess or exact bill.

For the owned Access and usage view, add `usageExport` with that absolute private
path to **reviewed runtime settings outside the selected project**. The export
must also be outside that project. This is a separate explicit read grant, not
logging or a current-chat attachment. The no-argument mods.usage tool and dashboard
return only the sanitized summary; UI/model cannot choose a different file.
No export is selected by default. Existing hook logging scope/retention is unchanged.
Current context occupancy, exact billing and cache health remain unavailable.
