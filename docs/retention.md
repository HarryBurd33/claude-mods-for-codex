# Preview and explicitly clean selected metadata

Current native follow-up: [dev26 restart acceptance](continuation/NATIVE-DEV26.md)
verified the bounded hooks/owned UI and one explicitly authorized active-Watch
update. No configuration/trust/scope/production cleanup changes; optional events
off and the extra run grant consumed. Broader lifecycle/platform limits remain.


Source26 adds immediate local POSIX CLI commands. They are not registered hooks,
MCP tools, native slash commands or scheduled cleanup. Configured source26 is installed/human-trusted; bounded native hooks/panel/Watch acceptance passed after restart; full lifecycle remains incomplete;
these checks are not native Codex acceptance. Installed human-trusted dev10 and
its selected logging scope are unchanged. Windows commands refuse before reading
settings or any selected path; all existing Windows gates remain closed.

Use the reviewed package's absolute CLI path and the existing private runtime
settings file using its canonical absolute path (no dot segments). Settings must select a canonical project and a separate private
data directory. Session scope needs an explicitly selected sessionId; project
scope targets only the explicit aggregate. No sessions or sibling scopes are
discovered. Data must be disjoint from the project, not inside it or its ancestor.
The settings file remains outside the selected project under the usual ownership,
regular-file/no-links/private-permission checks.

```sh
node /absolute/reviewed/package/bin/codex-mods.mjs retention-preview \
  --settings /absolute/private/settings.json \
  --before 2024-01-01T00:00:00.000Z
```

Choose your own explicit cutoff. It must be a real canonical UTC timestamp with
milliseconds, no later than now. Preview reads only the exact selected scope's
two bounded journals. It creates no data, lock or plan file. Output includes
`absent`, `retained` or `eligible`, retained record/file/byte counts, oldest/newest
record timestamps, and `confirmPreview` only when eligible. It emits no paths,
session identifiers, event/tool names or journal content. The retained counts do
not establish complete capture, lifetime activity or current producer health.

The whole selected scope is eligible only if **every** retained record is strictly
older than the cutoff. A recent record preserves both journals. An empty selected
scope can be removed; an absent scope cannot produce a cleanup fingerprint.
Top-level legacy journals and all other projects/sessions remain outside this flow.

After reviewing the preview, explicitly run:

```sh
node /absolute/reviewed/package/bin/codex-mods.mjs retention-cleanup \
  --settings /absolute/private/settings.json \
  --before 2024-01-01T00:00:00.000Z \
  --confirm-preview COPY_THE_PREVIEW_SHA256
```

This command deletes retained metadata. It is a separate explicit action; never
run it automatically from a report, dashboard, skill or hook. The fingerprint
binds the reviewed settings identity/selection, cutoff, directories and exact file
samples/content. It is a conflict check, not a secret, human authentication or
approval of any pending native tool call. It does not override Codex permissions.
A changed selection/settings/file/scope requires a fresh preview and review.
There is no automatic retry, expiry watcher, model/API request or network request.

Stop relevant writers before maintenance. Cleanup takes the existing global state
lock and selected journal lock using exclusive creation, without waiting, stealing
or deleting existing locks. It recomputes the preview under those locks, rereads
settings before deletion, and rechecks directory/file identity. Cooperating state
writers serialize with cleanup; a subsequent new write may recreate the scope.
Unrelated scopes and user files are never enumerated or pruned.

Links, multiply linked files, special/oversized/malformed journals, public or foreign
ownership, unexpected entries and busy storage refuse. Handles remain open during
inspection/deletion and buffers are cleared; this is not a memory-erasure promise.
Only the known journal files are unlinked; the selected directory is removed only
if empty. Nothing is recursively removed. Parent data directories stay in place.

## Failures and recovery limits

Deletion is **not crash-atomic or securely erasable**. A failure after one journal
was removed can leave the other; a newly appearing unknown file prevents scope
removal and is preserved. The error reports completed journal removals and whether
the scope was removed, without raw filesystem diagnostics. Inspect selected data
after stopping writers; do not repeat an old fingerprint or infer that failure
means no bytes were removed. Root/selected-directory timestamps may change when
our temporary locks are taken and released even when journals are preserved.

A killed process can leave locks. Neither command reaps them or assumes a lock is
stale from its age. Stop relevant processes and inspect only the explicitly selected
storage before any separate manual recovery. Never delete a lock while a writer
might be active. There is no automatic undo for deletion; preserve a private copy
before an explicitly requested real cleanup if you need the data later. This
milestone tests only disposable synthetic data, not installed production records.

The POSIX safety claim covers cooperating package writers and the private selected
storage contract. Path/identity samples and retained handles are not an OS sandbox,
atomic filesystem lease, or protection against a hostile same-user process or an
administrator changing paths/permissions between checks. No Windows deletion or
new project/Git/restore authority is enabled by this feature.
