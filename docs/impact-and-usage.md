# Conservative impact review and passive usage

Development source0.2.0-dev.4. No component below launches a model, executes the
assessed command, discovers private sessions or sends a network request. Skills
and ordinary chat/tool use still consume the selected model's usage.

## blast-radius equivalent: explanation plus denial

Review examples/config/blast-radius-opt-in.json before enabling any category.
It is disabled by default. The original fixed lexical classifier recognizes six
categories: deletion, Git history/working-file changes, Git clean, permissions,
remote writes/transfers and package operations that may execute install scripts.
Categories are explicit, known and unique; no dynamic regex/module/script fields.

Only canonical Bash PreToolUse command strings are covered. Matching calls receive
a bounded denial explaining likely classes of impact. Commands, target arguments,
secrets, file counts and inferred paths are not echoed or stored. The classifier
does not parse shell syntax, expand paths, inspect a filesystem or claim semantic
coverage. Help/dry-run/quoted text may be false positives; aliases, wrappers,
intervening flags and obfuscation may be missed. No match does not mean safe.
Enabled guards recheck a proposed exact command replacement before it is emitted.
Denials never approve a call or weaken normal host permissions.

For immediate local assessment, send exactly a JSON object with a command field
to `node bin/codex-mods.mjs impact --stdin`. A saved **synthetic** JSON file can
be redirected to stdin; the command inside it is data and is never executed.
The result is assessment only, not approval or complete policy enforcement.

This is a **deny-and-review approximation**, not a native pending confirmation.
The separate MCP human-hold proof timed out despite a reported form answer, and
could fail open before connection. It is not a production gate. A denial requires
an explicit new decision: choose a safer operation, or review a narrow policy
decision and retry through normal permissions. No silent allow, automatic rule
disabling, cached approval, prompt rewrite or panel approval button is provided.
Native hook infrastructure itself can fail open; this guard is not a sandbox.

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
