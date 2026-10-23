# Optional observation-only lifecycle events

Source0.2.0-dev.5 adds event-only observation for `Stop`, `Interrupt`, `PreCompact`,
`PostCompact`, `SubagentStart`, `SubagentStop` and `SessionEnd`. **Observer registration/storage not enabled or native-host verified.**
The observer implementation is packaged in installed dev6; optional hooks are not registered. Default package hooks remain exactly SessionStart,
PreToolUse and PostToolUse, and existing metadata settings do not enable new
events. There is no new logging in the current installed dev6 fixture.

Released CLI0.163.0 provides these event names in its
[event list](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/hooks/src/lib.rs#L23)
and [input schemas](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/hooks/src/schema.rs#L344).
Exact released source was read locally2026-10-23. This is source corroboration,
not proof of delivery in this desktop build or any other client/version. No
`PostToolUseFailure`, request-observation or prompt hook is inferred from it.

For explicit opt-in, review `examples/hooks/observe-lifecycle.json` and merge only
the selected entries into a **new source snapshot's** hooks file. Never replace
the current default hooks file wholesale or edit an installed cache. Separately
select matching names in `metadataState.observerEvents`, as demonstrated by
`examples/config/lifecycle-observation-opt-in.json`. Set `enabled:true` and keep
the chosen session/project scope and data/project-root launch variables aligned.
The example is session scoped; it does not choose/discover a session for you.
Supported installation/update and human changed-hook trust must follow.

Observation deliberately bypasses all mod handlers and returns exactly `{}`.
It cannot block Stop, request follow-up work, mutate a prompt/model/permission,
approve anything or invoke a model. When independently selected and metadata is
enabled, it stores event name and recording time only, through the existing
private scoped journal. No tool/decision field is allowed for these events.
The legacy activityJournal mod does not automatically enable lifecycle events.

Native envelopes can contain assistant messages, transcript paths, agent/turn
identifiers and other sensitive fields in memory. They are not read for content,
cloned to mod handlers, returned or persisted. The observer validates the common
envelope and the minimal released identity/shape fields it needs; it is not a
complete validator for every optional host field. It never opens transcript paths.
The existing1MiB input bound still applies. Disable by removing the selected
observerEvents names or setting metadata enabled false; uninstall the optional
hook entries through a reviewed update to stop receiving those envelopes.

Counts mean **retained event deliveries**, not unique completed turns, success,
exactly-once processing or current host health. Stop can occur multiple times;
deduplicating by retained turn/session identifiers is intentionally not added.
Unknown events abstain; malformed observer events fail input validation; config,
handler or storage failures never emit a stop/block/approval or automatic retry.
Host hook infrastructure may fail open, and SessionEnd shutdown delivery has
host-specific deadlines. No observation is a security enforcement boundary.

Offline replay makes no storage writes or model calls:

```sh
node bin/codex-mods.mjs validate --config examples/config/lifecycle-observation-opt-in.json
node bin/codex-mods.mjs replay --config examples/config/lifecycle-observation-opt-in.json --fixtures examples/events
```

Seven synthetic envelopes exercise the released projection. Unit/subprocess tests
cover explicit opt-in, unchanged defaults/scope, forbidden output, malformed
fields, no mod-handler execution, event-only storage and disabled no-write paths.
Native acceptance still needs a reviewed optional-hook installation and a
separately authorized bounded model run for any model-driven trigger. Do not reuse
the earlier consumed model-run authorization. Interruption, compaction and agent
delivery need their own harmless host tests. Source7 Windows private state has
NTFS CI, but native Windows optional-hook delivery remains unverified; no optional
registration or logging grant was added.
