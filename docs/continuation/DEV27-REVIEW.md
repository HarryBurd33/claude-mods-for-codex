# Source27 failure/turn observation review — 2026-10-24

Human switched to GPT-6.1 Sol High from verified4663912 on
codex/astra-groundwork. This is the bounded macOS-first implementation milestone,
not full-product completion. All93 requirement identities remain in scope.

## Decision and primary evidence

[Contract/workflow](../event-observation.md) links the retrieved official hooks
page, latest stable0.164.0 release and pinned0.163.0 registry, output, exec adapter,
hook schema/Stop and exec event types/processor. Registry/context were byte-equal
at163 and164 commits. No client upgrade or installed desktop-runtime equivalence
is inferred. Standalone CLI163 is the previous native measurement; desktop
bundle26.1021.22027/build21747 and panel-host chatgpt are independent old evidence.

There is no PostToolUseFailure in the reviewed release interface. Generic registry
logging-success gates PostToolUse; exec output returns true even for nonzero exit,
with text-only post-hook output when a terminal command payload exists. Invocation
errors can bypass it. Stop is a stopping opportunity; Interrupt separate. Exec
JSONL provides command status/nullable exit and turn failure/error, but interrupted
turn shutdown may emit no terminal record. We therefore do not add a fake hook,
scrape text, count missing posts as failure or claim cancellation detection.

Useful alternative implemented: read one separately selected structured export,
return fixed counters/status labels. It is not native all-tool subscription or a
separate client. No response/prompt/command/ID is retained or returned. Reading
the raw selected file in process memory is an explicit privacy/access grant.

## Code and stable contracts

- `src/observations.mjs`: summarizeExecObservations(text), readSelectedObservations
  (path, options). Strict JSON-only single-header bounded input; terminal command
  status and i32-or-null exit validated independently. Unknown record types
  counted ignored; duplicate records counted, never unique-execution claims.
  Return available/source, turns{started,completed,failed,streamErrors},
  commands{completed,failed,declined}, exits{zero,nonzero,unavailable}, streamStatus,
  ignoredRecords, cancellation=unavailable and fixed semantics/limits. No raw keys.
  Invalid/private-file/cancel failures return fixed unavailable, no partial summary.
- POSIX reader: at most1MiB/4096lines/256KiBline, no-follow/nonblocking regular
  owned mode-private one-link canonical file, before/handle/after identity and
  mode/size/mtime/ctime samples, fatal UTF-8, AbortSignal checks. Bounded regular
  file work; not strict OS syscall wall-time or malicious same-user defense.
- `src/cli.mjs`: immediate observations --export PRIVATE_JSONL, no model request.
- `src/runtime-settings.mjs`: optional observationExport, outside selected project,
  independently validated. Windows before-IO refusal unchanged. No actual settings
  edited. Paths remain configuration, never model tool arguments.
- `src/server.mjs`: no-argument read-only mods.observations; dashboard aggregate
  field. No path/selection fallback to usageExport; missing field remains off.
- `ui/dashboard.html`: separate outcome table in Access and usage; literal text/
  row headers/unavailable fallback. Existing Activity Watch never reads exports.
  Updated activity limits and source appInfo27; six existing views preserved.
- Optional `examples/hooks/observe-lifecycle.json`: Interrupt/SessionEnd timeout3
  rather than5 per host cap. No registration enabled or added. Default three hooks,
  dispatcher/mod/permission behavior, observer state contracts and journals unchanged.
- `examples/exports/observation-synthetic.jsonl`: harmless original synthetic
  failed-command/turn example. Must be copied privately for the strict file reader;
  no claim of native capture. No paid keepalive, retry or automatic follow-up.

## Verification and preservation

Node24.22.0/npm11.19.1/macOS14.6. Initial targeted20tests18pass/0fail/2skips;
expanded targeted42tests40pass/0fail/2skips. First full326tests216pass/0fail/
110Windows-only skips. Added independent simulated outcome-table check and final
type guard: full327tests217pass/0fail/110Windows-only skips. Validate3mods/replay4
fixtures passed. Final UI version-only correction gets focused checks separately
in TEST-LOG. No product test failure occurred in this source milestone.

Coverage includes status/nonzero/missing distinction, failed/error/unfinished and
duplicate/future records, malformed/oversized/multi-header input, private file/link/
special-file refusal, aborted read, UTF-8 refusal, CLI output privacy, settings
grant validation, no usage fallback/tool-path injection/data writes, simulated
accessible literal table and unavailable replacement. A copied-source synthetic
barrier modifies the selected file between read and final samples; full summary
refuses. This is not proof against every real hostile race. Existing optional
observer subprocess checks keep{} on busy state/config failure and retain the
lock/old scoped count; disabled Interrupt writes nothing. PostToolUse synthetic
response variations never infer exit/error/cancellation. Native outcomes unverified.

All210installed26cache files equal the immutable configured fixture; existing
settings SHA unchanged. Default hooks byte-identical to4663912. Every Windows
helper/storage/runtime gate, state/journal/retention/dispatcher/config module and
old mandatory real-image failure untouched. Only optional runtime settings schema
extended behind the unchanged Windows refusal. New IO refuses Windows before
examining path/options, with actual-Windows test included in portable CI. CI is
pending for27: local skips are not Windows OS or native-client evidence. Earlier
CI40128013186 failures remain visible; no assertion/test skip/guard was weakened.

## Installation, trust and acceptance still required

Source27 is not installed. Current26, project/data/export selections/trust and
all unrelated entries remain intact. No optional event/storage opt-in, production
cleanup, new native/model/API run or background watch. Prior one-run grant consumed.
Human source27 packaging/installation review must cover the new optional file-read
grant, tool/owned table and timeout example. Supported same-ID update needs immutable
snapshot review, backups preserving other entries, fresh hook trust if changed,
restart and loaded snapshot verification. Do not edit cache/trust hashes.

Medium next: read exact CI results; verify public archive/spaced package/defaults/
MIT/no private files/proof separation; prepare an immutable review and synthetic
private observation fixture only when useful. Existing settings remain untouched
until explicit export selection. Optional Stop/Interrupt registration AND storage
require explicit human selection, review/trust and separately authorized bounded
native trigger. Do not enroll all seven events. Native success/nonzero/invocation
error/cancel/Stop/Interrupt remain distinct tests; do not call one proof all of them.

Rollback/removal: no new machine change to undo. Remove only observationExport to
stop service reads, and the chosen optional registration/storage names if enabled
later. Reload/update through supported lifecycle; preserve retained data unless a
separate explicit cleanup is chosen. Keep immutable26/10 for supported selective
rollback; never restore whole shared config or delete live locks/data automatically.

High reasoning is no longer needed for remaining routine packaging/readback.
Checkpoint/upload/verify and stop for human **GPT-6.1 Sol Medium**. High is required
before new consequential runtime/security changes or unexpected correctness fixes.
Windows work remains later; native host unavailable last asked, no repeat request.
