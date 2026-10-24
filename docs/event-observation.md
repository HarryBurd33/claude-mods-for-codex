# Command failure and turn observation — source27

This development feature has two distinct inputs. Neither is automatically
enabled, neither launches a model, and neither changes the selected project or
the three default hook registrations. [Configured27 is now installed/human-trusted](continuation/PACKAGE-DEV27.md)
after human selection of only the public synthetic fixture; [bounded native27
tool/table checks passed](continuation/NATIVE-DEV27.md). Broader lifecycle
acceptance remains incomplete. Logging scope/rules/usage selection and optional
lifecycle reception/storage remain unchanged/off. The implementation-stage
contracts below do not imply native delivery.

| Input | What can be reported | Limits |
| --- | --- | --- |
| Existing optional Stop / Interrupt hooks | Retained event/time delivery counts in the selected metadata scope and Activity chart | Requires separate event registration, trust and storage opt-in. Stop is a stopping opportunity, not unique completed turns. Interrupt is separate, main-thread only. No raw message or continuation output. Native optional delivery remains unverified. |
| Explicit selected `codex exec --json` export | Command status records, zero/nonzero/missing exit buckets, started/completed/failed turn records and stream errors | Read-only snapshot approximation, separate from hooks/current chat. No complete native failure subscription or cancellation inference. Source authenticity, uniqueness and completeness are not attested. |

## Released contract, checked 2026-10-24

The [official hooks documentation](https://learn.chatgpt.com/docs/hooks) lists
PostToolUse, Stop and Interrupt, but no PostToolUseFailure. It distinguishes
Stop continuation from interruption, warns that main schemas can exceed released
behavior, and limits Interrupt/SessionEnd command timeouts to three seconds.
The optional example now uses that limit; other events retain five seconds.

CLI0.163.0 is the previously measured standalone installation. Latest stable
[0.164.0](https://github.com/openai/codex/releases/tag/rust-v0.164.0) was re-read;
no client was upgraded. In both released versions the
[registry](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/src/tools/registry.rs#L799)
only runs PostToolUse when the tool output's logging-success flag is true.
The released [exec output](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/src/tools/context.rs#L409)
sets that flag true regardless of process exit, but exposes only truncated text
for its post-hook response and omits it while a process remains live.
The [adapter](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/src/tools/handlers/unified_exec.rs#L78)
requires that response; invocation errors can bypass the post-hook. Registry and
context files were byte-equal at the163 and164 release commits. Consequently
PostToolUse is neither proof of exit0 nor a comprehensive error notification.
This implementation never scrapes output for exit/error words or subtracts
pre/post counts to invent failure counts.

The released [exec JSONL types](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/exec/src/exec_events.rs)
provide structured command status and nullable exit code, turn.completed,
turn.failed and error. Its [processor](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/exec/src/event_processor_with_jsonl_output.rs#L513)
maps an interrupted turn to shutdown without a terminal interruption record.
Thus a missing terminal record stays unfinished/unknown; declined is not proof
of human cancellation, and nonzero is not a tool invocation error category.
The selected export is a practical supported-source alternative, not an official
client extension that subscribes to every native failure. Desktop bundle/runtime
is independent of the system CLI; no new native optional-event result is claimed.

## Immediate local use

Run from the verified source/package root, replacing it with an absolute CLI path
when invoking elsewhere:

```sh
node bin/codex-mods.mjs observations --export /absolute/private/selected.jsonl
```

Select an existing reviewed export explicitly. Keep it outside the project with
mode0600, owned by the current user, canonical and without symbolic/hard links.
The parser requires exactly one thread.started header, JSON-only lines, at most
1MiB/4096lines/256KiB per line and supported terminal command statuses. Mixed
stderr, malformed data, multiple headers and unsafe/changing files refuse the
whole summary. A header-only file has zero observed records and unknown status;
that is not proof nothing happened. Unknown record types are counted as ignored.
Duplicate terminal records count twice; this is a record summary, not deduplication.
Command status and exit buckets describe the same records: do not sum them.

For a harmless demonstration, copy
`examples/exports/observation-synthetic.jsonl` to a private file outside the
project, then use the command above. It is synthetic, not native evidence.
No export capture, session discovery or extra model run is performed. Capturing
a fresh native model run consumes usage and requires fresh human authorization.

## Owned panel and MCP opt-in

After reviewing a new immutable package, an owner may separately add
`"observationExport": "/absolute/private/selected.jsonl"` to their private
runtime settings outside the selected project. It is independent of usageExport;
neither field enables the other. Do not select a private test log automatically.
The no-argument read-only `mods.observations` tool returns the aggregate. The
Access and usage view shows a separately labeled table when refreshed. Activity
and its Watch continue to read only selected hook metadata; no export polling,
new hook state, journal fields, cache writes or automatic retention are added.
Model-invoked calls still use normal chat/model usage and host permissions.

Selecting an export grants the local process access to its entire bounded raw
file in memory, including any sensitive text it contains. Only fixed numeric
counts/status labels leave the summarizer. It never returns commands, results,
errors, prompts, transcripts, paths, IDs, usage or billing. Local processes have
ordinary user permissions distinct from the model's sandbox; these checks are
not a defense against a hostile same-user/admin process. No network or execution
is performed. Cancellation/failure returns a fixed unavailable result.

## Optional native turn observations — not installed

1. Review `examples/hooks/observe-lifecycle.json` and select only Stop and/or
   Interrupt if wanted; do not copy all seven by default. Merge the chosen keys
   into a new reviewed immutable package through supported installation/update.
2. Separately add only the same chosen names to metadataState.observerEvents in
   the reviewed configuration, with metadataState.enabled true and the existing
   explicit project/session selection. This changes retention; obtain that
   human selection before applying it. Empty/absent observerEvents writes none.
3. Preserve all other rules/settings/entries. Review the exact package/access
   diff, use supported same-ID installation, complete human changed-hook trust
   and restart as required. Never trust by writing hashes or modifying the cache.
4. With a separately authorized bounded harmless native trigger, inspect trusted
   inventory, event delivery, empty output, exact scope and no raw payload. Stop,
   Interrupt and failure paths require separate evidence. No automatic follow-up,
   denial/approval, command, prompt or model change comes from this observer lane.

Disable export access by removing only observationExport and reloading through
the supported host lifecycle. Stop selecting the file for CLI use. Disable optional
observers by removing only the chosen storage names and registrations, then review/
update as required; keep existing data unless explicitly choosing scoped cleanup.
Rollback uses the preserved immutable package through supported same-ID update,
not shared-config restoration or cache edits. No such machine changes occurred
in the High implementation stage; the later human-authorized Medium update is
recorded separately in PACKAGE-DEV27. It preserves the old reviewed sources. New export IO and runtime-settings entrypoints refuse Windows before
IO; portable summary tests do not establish Windows host/storage compatibility.
