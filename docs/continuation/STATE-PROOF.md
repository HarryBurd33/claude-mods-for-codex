# Scoped metadata state proof

Historical first synthetic state checkpoint. Current source7 integration, real
Windows NTFS CI and prior macOS host evidence are in STATUS/TEST-LOG/REQUIREMENTS.
The pending/unintegrated/refusal statements below describe that earlier version,
not current source or installed dev6. Native-platform evidence remains separate.

Status: implemented as a narrow library and tested with synthetic subprocess writers on macOS, 2026-10-23. This is **not native Codex event delivery or UI integration**. The packaged hook entrypoint is unchanged and does not call this module yet. No plugin/configuration installation, model/API calls, or network access is required by the proof.

## Observed checks

- Starting workspace was clean. `npm test` rerun before changes: **39 passed, 0 failed**.
- Host: macOS, arm64; Node.js **v24.22.0**. Exact OS build and machine paths belong in the ignored local handoff.
- `node --test test/state.test.mjs`: **11 passed, 0 failed, 1 skipped**. The skipped test is Windows-only; this run says nothing about Windows execution.
- Full `npm test` after adding this proof: **50 passed, 0 failed, 1 skipped** (51 total). `npm run validate` passed with three mods; `npm run replay` returned the expected notice, denial, and two empty nondecisions. `git diff --check` passed.
- Eight independent Node subprocesses wrote four records each to one scope; the reader counted **32** retained records with no lost updates.
- A bounded observer first saw zero records, then saw one record written by another process, and closed on cancellation. This is a real cross-process storage observation using synthetic events, not a mocked write; no Codex host event was involved.
- Tests cover session/project isolation, strict metadata, read-only absent-state reads, explicit retention, scope limit, held-lock failure, symlink and hard-link refusal, private directory mode enforcement, observer bounds and cancellation.

## Contract and component boundary

`src/state.mjs` reuses the existing reviewed journal for append, bounded read, rotation, and aggregation. It does not modify hook outputs, approvals, selected models, or tool input.

| Export | Contract |
| --- | --- |
| `metadataScopeKey({ projectId, sessionId? })` | SHA-256 filename key. Supplying a session ID isolates that session; omitting it explicitly selects project-wide state shared across sessions. IDs are nonempty bounded strings with no control characters. |
| `recordMetadataEvent(dataDirectory, scope, metadata, now?)` | Explicit opt-in write. Allows only existing journal fields `event`, `tool`, and optional `decision: "deny"`. Requires a caller-selected absolute data root. |
| `readMetadataState(dataDirectory, scope)` | Read-only summary with a revision token, event/tool/denial counts, and a retention caveat. Missing data returns zero without creating directories. |
| `observeMetadataState(dataDirectory, scope, options?)` | Bounded async polling iterator. Default 250 ms interval and 10-second lifetime; allowed interval 100–5000 ms and lifetime 1–30000 ms. Optional AbortSignal; no daemon or background restart. |
| `pruneMetadataState(dataDirectory, { before: Date })` | Explicit retention operation; deletes only old known journal files in validated scope directories. Refuses locks, unknown entries, links, and special files. |

The caller must choose a trusted scope from its selected project/session context. Do not accept a model-supplied filesystem path as permission to read or write it. No raw project/session IDs, project paths, commands, arguments, outputs, prompts, transcripts, or credentials are persisted. SHA-256 avoids raw identifiers on disk but is **not anonymization**: predictable IDs can be guessed and correlated.

Storage lives under the caller-selected data directory's `metadata-state-v1/`. A maximum of 64 scopes prevents unbounded directory growth; the module refuses additional scopes until the caller explicitly prunes old state. Each scope inherits the existing journal's two 1 MiB file limit, so retained event data is bounded to 128 MiB across the root, plus small filesystem overhead. Counters represent retained records, not lifetime counts. Size-based rotation happens on write; age-based pruning is explicit, not scheduled.

A private root lock serializes cooperating writers and retention across scopes; the existing private journal lock protects each append/rotation. A stale lock causes a bounded busy error and is never automatically stolen. Stop all writers and inspect the lock before manually removing it. Normal read-only snapshots do not create locks; explicit pruning may turn a concurrent reader's result into an empty snapshot. The privacy/path checks are defenses against accidental unsafe paths, not a sandbox against another process running as the same OS user. Hashing scope names does not authorize a caller to access another scope.

## Integration tasks and acceptance criteria

1. Add an explicit opt-in adapter from validated native hooks to `recordMetadataEvent`; project/session selection must be host-derived and declared. Preserve the existing no-state default. Verify real native events create exactly the expected metadata without storing raw envelopes.
2. Expose read-only summaries through the chosen supported UI/tool transport. UI requests must be scoped by trusted server configuration rather than arbitrary paths. Distinguish polling from host event subscription. Verify a real host event changes a visible counter and cancellation cleans up transport resources.
3. Explain project-wide versus session-isolated state to the user. Obtain explicit selection before aggregating across sessions. Define user-facing retention controls, scope-cap handling, stale-lock diagnostics, disable/removal, and safe export behavior.
4. Decide whether stronger cross-user or same-user adversarial isolation is needed. This library is neither a security service nor a replacement for Codex permissions. It reads/writes using the local process user's OS authority.

## Windows and CI

`.github/workflows/ci.yml` adds a full offline matrix for macOS/Linux on Node 22/24 and a distinctly labeled Windows **portable contracts only** lane. The Windows lane runs pure dispatch/package checks, configuration validation, fixture replay, scope-key validation, and an assertion that state storage explicitly refuses Windows until ACL validation is implemented. It excludes the `/bin/sh` hook-launch test and POSIX filesystem-mode tests.

The new CI workflow has not yet run remotely at the time of this record. A green Windows portable lane will still not establish native Windows hook installation, quoting, shell selection, process handling, journal security, or UI compatibility.

Concrete Windows risks in the existing package: hooks use POSIX `${PLUGIN_ROOT}` shell expansion; `test/dispatcher.test.mjs` invokes `/bin/sh`; journal privacy uses POSIX UID/mode checks; link handling and `O_NOFOLLOW`/`O_NONBLOCK` semantics need a Windows-specific review; stale-lock cleanup and child termination need validation on an actual Windows host. The state module explicitly refuses storage on Windows rather than weakening privacy checks.

Required Windows validation before a compatibility claim: actual Windows Codex client installation and version record; supported shell/path expansion with spaces and non-ASCII characters; NTFS ACL enforcement and junction/reparse-point handling; concurrent processes and interrupted writes; cancellation and child cleanup; update/disable/uninstall restoration; native hook trust and permission behavior. Use harmless disposable fixtures. Linux tests with Windows-looking paths are insufficient.

## Removal and rollback

This proof changes no host configuration and is not enabled by default. Removing the opt-in caller disables writes. After stopping all writers/readers, remove only its explicitly selected `metadata-state-v1` subtree if its contents are no longer wanted; preserve the parent data directory and the existing MVP journal. Source rollback consists of removing the new state module, state tests, this proof record, and optional CI workflow. No installed application changes are involved.
