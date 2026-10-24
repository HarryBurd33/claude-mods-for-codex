# Source26 review — selected-scope retention CLI

2026-10-24. Human selected GPT-6.1 Sol High from verifiedc234d5c and authorized
scoped retention preview/cleanup implementation. macOS acceptance remains first;
Windows later and incomplete. No cleanup of installed production records, changed
installation, trust action, logging expansion or additional model/API run.

## Contract and boundary

New src/retention.mjs exposes previewRetention/cleanupRetention and a narrow CLI
adapter. src/cli.mjs registers retention-preview/retention-cleanup only; no MCP,
hook, dashboard writer, scheduler or automatic follow-up. Manifest/package/server
version26 identifies changed source but does not update the installed dev10 cache.
Existing state/journal/runtime-settings/Windows authority and budgets are unchanged.
Compatibility-only packaging/MIT/disclaimer/independent-project identity retained.

Both operations take a reviewed private settings selection plus explicit canonical
UTC cutoff (milliseconds, valid date, not future). The data root must be disjoint
from the canonical selected project. Session scope needs an explicit sessionId;
project scope targets only its aggregate. Settings paths/selection/private checks
reuse loadRuntimeSettings; errors are closed sanitized messages. All new entry
points refuse Windows before path/option access. No Windows policy enabling.

Preview creates no data, scope, lock or plan. It reads only the exact scope's two
bounded journals and returns retained counts/bytes/ages/status, plus a SHA256
fingerprint when every record precedes the cutoff. It does not enumerate sibling
scopes, emit paths/IDs/event names/content or read private sessions. Empty scope
is eligible, absent scope has no confirmation. Mixed old/recent scope retained
entirely; legacy top-level journals untouched. Fingerprint is not authentication,
human provenance, anonymization or native approval.

Cleanup first verifies the preview, then exclusively creates global .state.lock
and selected .activity-journal.lock (no wait/steal/reap). It re-snapshots under
both locks, checks the fingerprint, rereads settings and compares identity/binding
before first unlink. Directory IDs omit mtime/ctime because our own locks change
them; file samples include nanosecond times, identity/permissions/link/size and
content digest. No file content is returned. Directory/file handles stay open;
path/identity/no-link checks repeat before each unlink. Known journal files only,
then empty-directory rmdir; no recursive removal or parent/sibling cleanup.
Cooperating state writers retain the same global lock protocol. A future writer
may recreate the scope after cleanup; bounded telemetry can still refuse busy.

Refused selection/files/locks preserve journals; failures after deletion starts
report completed removals/scope-removal status and require inspection, not automatic
retry. A newly appearing unexpected file is preserved and makes rmdir fail. Kill
can leave locks; no automatic recovery. Two-file deletion is not interruption-
atomic, power-loss durable by contract or secure erasure. Private POSIX storage
plus sampled handles is not a sandbox against hostile same-user/admin races.
See [user workflow and recovery limits](../retention.md).

## Meaningful verification

New test/retention.test.mjs uses owned private throwaway data and exact project/
session selections, including spaced paths. Tests cover no-create absent preview,
both selection modes/other scopes/index/HEAD/settings, whole-scope age semantics,
wrong/stale/replayed fingerprints, same-byte file replacement, changed settings/
scope/cutoff, live locks, empty/two-journal scope, symlinks/hardlinks/FIFO/oversize/
malformed JSON/UTF8/forbidden data/public permissions/unexpected files and errors.
Actual CLI subprocess preview/cleanup/error handling uses synthetic selected data.

Explicit source-copy fixtures add only controlled barriers/faults, not production
hooks/test switches. Settings mutation immediately before fresh read refuses;
a real filesystem lock collision pauses a state writer until cleanup finishes,
then its new retained event remains. Injected second-unlink failure reports partial
removal/releases owned locks; changed bytes after locking are preserved; new unknown
file after journal deletion is never recursively removed. A killed owned Node child
leaves both locks and pre-unlink data; preview refuses rather than reaping them.
These are synthetic/OS subprocess checks, not native Codex event or Windows claims.

Local initial retention run9pass/7fail/1Windows skip: six failures were a refusal
message-prefix expectation; one compared directory mtime despite legitimate lock
bookkeeping. Prefix made consistent; test now still checks directory identity/mode/
entries and all journal identity/size/time/content while excluding only directory
mtime for that lock-taking refusal. No deletion/permission assertion weakened.
The next focused run passed16/0/1skip. After three more fault/actual-CLI cases,
retention+state+lock-budget+contention39tests:37pass/0fail/2Windows-only skips.
Full source26 suite and CI are recorded after actual completion below; no future
success implied. Windows before-IO test is added to portable CI, while its POSIX
cases skip there. Existing unrelated Windows real-image positive remains intact.

## Preserved state and remaining acceptance

Installed human-trusted dev10/logging/settings/model selection unchanged; source26
uninstalled. No native host call, new model run, theme/client/observer/export opt-in,
cache edit/trust write or production metadata cleanup. Public audit keeps all93 IDs;
EV-13/SEC-09 gain a source CLI but native installed/current-state acceptance remains
separate. Source25 Windows real-image check fails before bytes (observed linkcount2
versus original one-link guard); no failure hidden/skipped, no candidate execution,
no hashes/imports/version or Windows11/WSL acceptance. Production gates unchanged.

After source/tests/risky paths are reviewed and actual CI evidence recorded, save/
upload/full-tree/independent-ref verify a runnable checkpoint, then stop for human
**GPT-6.1 Sol Medium** for exact packaging/docs and concrete native acceptance step
preparation. High before a new consequential integration/security/writer change;
no continued Windows investigation. Full product remains incomplete.

## Local full-suite result and fixture correction

Full source26 run207pass/1fail/109Windows-only skips317total: the owned interruption
child could emit Node's unsettled-top-level-await warning because an unresolved
promise alone did not keep its event loop alive while the parent was descheduled.
This was a test-liveness race, not observed deletion/data loss. The fixture now
registers its IPC message listener before signalling readiness; the original
cleanup/lock/deletion code is unchanged. Failed run retained privately. Subsequent
retention suite19pass/0fail/1Windows-only skip; full208pass/0fail/109skips317total.
A final canonical-settings-path refusal and targeted regression also passed19/0/1;
exact final-source full/CI results are recorded when observed. No assertion/noise
suppression or deadline increase. Native event/host acceptance remains separate.

Exact final local source26 full suite:208pass/0fail/109Windows-only skips317total.
Canonical-path retention suite19pass/0fail/1Windows-only skip. Validate3mods,
replay4fixtures and diff-check passed. No production data touched. All149installed
cache files remain byte-equal reviewed10, settings hash unchanged; original state/
journal/runtime-settings/Windows/project/restore/budget bytes equalc234d5c.
CI is pending this runnable source upload; results will be appended after readback.

## Uploaded code and CI handoff snapshot

Runnable source [b66f2fbdaeaaca5b350ecb229b769b90a0da675e](https://github.com/HarryBurd33/claude-mods-for-codex/commit/b66f2fbdaeaaca5b350ecb229b769b90a0da675e),
tree41e60bcaa33c4c5a00a6b015dcf205920e4e5d2f, expected-parent/nonforce uploaded.
Fetched full-tree equality and independent connector/anonymous public ref matched;
equivalent local062d51f95de5f96636efd8d936343db647701642 retained on named backup.
[CI40128013186](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40128013186)
was in progress when this handoff snapshot was made. Actual decoded completed logs:
Ubuntu24job120973491527, Ubuntu22job120973491569, macOS24job120973491589 each
208pass/0fail/109Windows-only skips317total. New retention/actual-CLI/interruption
checks passed there. Windows portable retention before-IO step concluded success
(counts not decoded yet). macOS22job120973491548, Windows22job120973491585,
Windows24job120973491304 and portablejob120973491662 were still in progress in the
last snapshot. This is not an all-green CI or new Windows storage/host claim.

Remaining CI readback and exact packaging are routine **Medium** work. Read the
run/decoded logs first; a new correctness/security failure needs a human High
checkpoint, not weakened assertions/retries or an attempted Medium runtime fix.
The old unchanged Windows image failure remains explicit even if its new lane
result has not finished. No further implementation investigation is required to
justify keeping High selected while waiting for routine evidence. Final notes-only
checkpoint identity is read back after upload in the reply/private handoff.

## Medium completed CI readback — 2026-10-24

CI40128013186 has five successful jobs/two Windows storage failures. Actual decoded
remaining logs: macOS22job120973491548208pass/0fail/109Windows-only skips317total;
Windows22job120973491585 and Windows24job120973491304 each25storage passes,84/85
process/security proofs. Same unchanged cmd/git.exe Image refusal before bytes,
post-refusal links2, no sample/execution/hash/import/version. No new failure found;
Windows work remains deferred, guard/test intact. Portablejob120973491662 passed;
retention guard1pass/0fail/19POSIX-only skips20total, not Windows cleanup support.
See [PACKAGE-DEV26](PACKAGE-DEV26.md) for source/archive/install/human review results.
