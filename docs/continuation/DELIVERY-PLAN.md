# Delivery order and remaining acceptance — 2026-10-24

The human selected **finish macOS feature acceptance first, then Windows**.
Windows stays in scope and explicitly incomplete. The next stage is Sol Medium
for an acceptance audit and bounded macOS verification, with High before a
consequential runtime/security change. Do not start another Windows proof loop.

## What is usable, and what is unfinished

The installed human-reviewed dev10 has recorded macOS native dashboard, covered
hook, exact rewrite/deny, preview/focus and basic authoring observations. Source25
is uninstalled. Its offline macOS suite passed189 tests with108 Windows-only skips.
Neither result is full-product acceptance. Native checks belong to the snapshot
and client version actually observed; unsupported behavior and approximations
must be disclosed rather than counted as implemented exact equivalents.

The [93-row ledger](REQUIREMENTS.md) accounts for the whole requested scope.
[ACCEPTANCE-QUEUE](ACCEPTANCE-QUEUE.md) exposes each row's remaining check/gap in a
shorter view. Mechanism status such as supported is NOT a completion count.
The next audit must record per-target closure and evidence before estimating the
remaining work. A test count or development version number cannot supply a
credible completion percentage or finish date.

| Work package | Requirements | Recorded foundation | Remaining acceptance / next action |
| --- | --- | --- | --- |
| Owned panel and rendering | UI-01–06, UI-12–16; SEC-10 | Six-view dashboard, local rendering, focus/resize and selected close/reopen checks | Verify exact loaded snapshot, remaining keyboard/accessibility/lifecycle and close-pending behavior; keep browser simulation separate from native host. |
| Native appearance boundaries | UI-07–11, UI-17–23; EX-08 | Owned CSS/rendering, theme proposal and public extension-point research | Reconcile each exact native surface with released support. Complete supported theme/footer/indicator checks on the actual version; disclose unavailable native restyling and useful owned alternatives. No app patch/fork/custom-client substitution. |
| Hooks and ordinary permissions | EV-01–10, EV-18 | Covered pre/post events, rewrite/deny/control, one normal-sandbox negative; separate hold probe | Close visible SessionStart/resume/reset and relevant failure/cancel/malformed/approval-mode gaps. Hold is a disclosed approximation with infrastructure/provenance limits, not a production approval authority. |
| State and useful triggers | EV-04–05, EV-11–14; SEC-09 | Scoped metadata, isolation, bounded state, native Refresh, synthetic Watch | Audit optional lifecycle hooks still off/unregistered; active native event during Watch, retention/cleanup workflow and producer-health limits. Never broaden logging to make counts rise or replay ambiguous writes. |
| Usage and routing | EV-15–17, EV-19; EX-05–07 | Selected-export counters; context/cache/billing unknown; new-task routing boundary | Preserve unknown fields. Check current released event/model configuration support; any additional model run needs visible bounded authorization. Do not change the parent model or add keepalive calls. |
| Authoring and commands | AU-01–10; SK-01–04 | Local CLI/replay/scaffolding, original skills, native authored print rewrite | Audit the four workflows against triggers/access/model usage and remaining invocation evidence. Skills remain model-mediated; generated code needs review and supported trust. |
| Install and lifecycle | AU-11–16; PL-01–02 | Supported install/trust, exact cache, fresh remove/reinstall evidence and package hygiene | Verify the intended reviewed macOS snapshot. Prepare human trust steps, already-loaded disable/unload and older-version rollback/restoration checks with backups and unrelated entries preserved. No hot-reload promise. |
| Project tools and restoration | EX-01–04; SEC-02–03 | Risk explanation, explorer, selected changes/checkpoints; explicit POSIX one-file restore | Close stated native acceptance/recovery gaps. Inspection remains read-only. Any restoration is a separate explicit reviewed action; do not execute destructive demonstrations. High before a new writer/security boundary. |
| Access and privacy | SEC-01–08 | Explicit selected project/data/export, default-off metadata, no private-session discovery, local stdio | Reconcile process authority/read/write/execute/transmit descriptions and opt-ins. No credential search, raw transcript publishing, network expansion or sandbox/permission weakening. |
| Windows and WSL follow-on | PL-04–05 | Actual NTFS/process/security OS proofs; source25 scoped read prototypes | Actual installed Git read remains refused: observed link count2 violates current one-link guard. Mandatory positive test fails in both lanes. Keep failure and guard visible; later High review required. Native Windows11 host unavailable; WSL separately unverified. |
| Linux, governance and final report | PL-03, PL-06; GOV-01–07 | Linux/macOS Node CI, primary research, MIT/disclaimer and durable checkpoints | Native Linux acceptance remains separate. Recheck only relevant mutable sources, preserve all93 rows, and produce the requested capability/setup/update/removal/models/tests/commit report without calling the incomplete product finished. |

## Next bounded macOS batch

1. Audit the queue against current sources and dated native evidence. Assign each
   macOS-applicable requirement: verified exact, verified disclosed approximation,
   unsupported with evidence/alternative, incomplete, or awaiting user action.
   Do not copy the mechanism-status column into a completion column.
2. Read-only inspect the installed host/plugin/version/settings selection. Keep
   private paths/raw logs local. Prepare one concrete macOS acceptance batch and
   immutable snapshot if an update is needed, with exact expected observations.
3. Continue already-authorized read-only/offline checks. Human trust/restart and
   any additional separate model/API run must follow the existing review and bounded
   usage rules; prepare the exact steps before requesting the required action.
4. Publish the resulting closure table, remaining implementation tasks and a
   conditional delivery estimate. Ask for High only when a concrete integration/
   runtime/security change warrants it. Preserve the Windows failed test; do not
   fix, hide or broaden its policy during the Medium macOS audit.

## Current Windows checkpoint, explicitly incomplete

Source3ce44fc / CI40122363235: both Windows lanes25 storage checks passed;
process proofs84pass/1fail/85total. The real-image positive for cmd/git.exe was
refused before bytes. New handle metadata reports disk/regular/non-reparse,
selected-name match and2links. This does not establish an atomic original cause,
code authenticity or safe alias support. No Git image was executed; no guard,
permission or original private-data policy was weakened. Source25 is not a
Windows-ready release. See [DEV25-REVIEW](DEV25-REVIEW.md).

The current checkpoint is a bounded investigation result. Completing it does not
complete the product. Windows alias policy, code/dependency provenance and actual
native-host acceptance belong to later explicitly scoped work after macOS priority.
