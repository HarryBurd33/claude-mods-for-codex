# Final review

Current2026-10-24: [source31 package/update](continuation/PACKAGE-DEV31.md)
verified251files/79passes+1Windows skip. Human authorized local Review desk and
reviewed3hooks; restart/native31 pending. Logging/rules/exports/status preserved,
Windows guards unchanged/original bounds unresolved. Exact source CI four246-pass
POSIX lanes/portable success plus known Windows image failures. Stay Sol Medium
for native acceptance; High before consequential changes. Earlier dated notes are historical.


Current native27 follow-up: [bounded post-restart checks](continuation/NATIVE-DEV27.md)
passed for the selected synthetic outcome tool/table, six owned views and harmless
ordinary pre-hook behavior. Logging scope/settings/trust selection/fixture remain
unchanged; optional lifecycle capture off, no extra model/API run or cleanup.
Earlier restart-pending statements below are historical; wider lifecycle/platform
acceptance remains incomplete. Next High before broader component authoring.


Current source27 adds [failure/turn export observation](event-observation.md), independently
selected with observationExport or an immediate CLI path. It makes no journal
writes, raw-content responses, model calls or automatic export discovery. Optional
Stop/Interrupt and the three default registrations stay unchanged/off as applicable.
Human authorized only a public synthetic observation fixture and supported27
update. Configured27 is installed/human-trusted with restart/native acceptance
pending; logging scope/rules/usage selection and Windows gates preserved. See
[package/install](continuation/PACKAGE-DEV27.md) and [review](continuation/DEV27-REVIEW.md).


This review covers only the historical v0.1 MVP. It is not approval or completion
of the expanded product; see the current continuation records.

**Historical v0.1 outcome only:** ready for its public experimental release as
offline-verified. This is not a final review of source7 or approval of the full
requested product. Current High storage review/CI and explicit unfinished native
Windows/project/restore/accessibility/platform gates are in continuation records.

Date: 2026-10-22. Reviewer: GPT-6 Astra with ultra reasoning, as requested. Starting commit: `2aa4409980460d8dde827946cd1408659bbb9eed`; the final recheck also covers the repair diff described below. The parent release process owns the final commit, rebuilt archive, publication, and public-content verification. This review does not claim those subsequent steps have happened.

A “review in progress” checkpoint was saved before substantive review. That checkpoint is superseded by this completed record.

## Scope and conclusion

Reviewed the handoff, research, capability matrix, architecture, implementation plan, REA evidence limitations, verification record, all runtime modules, tests, plugin and package manifests, hook configuration, management skill, and public setup/removal/security/privacy/authoring guides. A separate read-only documentation audit checked marketplace installation, manifest/onboarding paths, skill discovery, configuration, conversion examples, and removal against the implementation and primary sources.

The static registry is a coherent, smaller experimental MVP. It provides source-based mod authoring, strict declarative configuration, ordered dispatch, offline replay, native hook responses, and optional local metadata reports. It does not offer arbitrary configuration-driven JavaScript loading, unchanged Claude Mod execution, native interface replacement, prompt rewriting, or automatic approvals. This narrowing is accurately reflected in the architecture and capability matrix.

The native envelope fields and restricted empty/notice/deny outputs agree with the reviewed Codex schemas and runtime parser. The manifest and onboarding skill path agree with current packaging guidance and the pinned manifest parser. No release-blocking setup, packaging, skill-path, removal, privacy, or capability-claim defect remained after the repairs below.

## Findings repaired and rechecked

| Priority | Original location | Defect and observed evidence | Resolution verified |
| --- | --- | --- | --- |
| P2 | `src/io.mjs:19` | Opening a FIFO read-only blocked before the regular-file check. A valid denied fixture with a FIFO configuration timed out after 750 ms without stdout or stderr, leaving the host timeout path able to fail open. | Nonblocking/no-follow opening precedes descriptor validation. The same native probe now promptly exits 0 with a valid configuration-failure denial. CLI event FIFOs are rejected. A subprocess-watchdog regression covers both paths. |
| P2 | `src/dispatcher.mjs:44-47`; `src/hook-main.mjs:35,49-54` | A throwing source-registered handler after a denial discarded that denial. A disposable source-copy reproduction exited 1 with empty stdout and the misleading `invalid hook input` diagnostic. Internal result types and event scope were not checked. | Strict synchronous plain-data result validation and per-handler error normalization preserve the first denial or create a review denial for `PreToolUse`. Non-tool events retain valid unaffected messages. Throws, null/arrays, unknown fields, accessors, invalid types/text/event scope, and asynchronous returns are covered. Actual native-entrypoint probes for a later throw and a rejected Promise now exit 0, retain the original denial, and emit only a sanitized diagnostic. |
| P2 | Denial-reason validation in `src/mods/deny-guard.mjs` and `src/dispatcher.mjs` | The original validators accepted whitespace-only reasons. The pinned host trims reasons, so an empty trimmed reason does not produce the intended block. This was identified by the parent and corroborated during review. | Configuration, internal-result, and final-output validation reject whitespace-only reasons; regressions pass. Literal command matching remains unchanged. |

Two smaller improvements were completed: fixture-directory replay now caps input at 128 JSON files and 8 MiB total, in addition to the per-event limit; the REA summary now describes inventory and hashing without implying publisher-signature authentication. Journal activation is an explicit boolean signal, and only `true` requests metadata storage.

These fixes do not turn the policy guard into a sandbox. The documented host crash/timeout and unsupported-tool-path limitations still apply.

## Checks actually performed

- Before repairs, the complete suite passed **33/33**; the targeted probes above exposed behavior those tests did not cover.
- After inspecting the repair diff, reran the complete suite: **39 passed, 0 failed, 0 skipped**. `git diff --check` also passed.
- Repeated the FIFO and throwing-handler reproductions against the repaired native entrypoint, and added a native-entrypoint check for a returned rejected Promise. All produced valid exit-0 denial responses without leaking the exception payload. Disposable source copies were removed afterward.
- Ran default configuration validation and the complete fixture replay after repairs. Observed the visible session notice, exact denial, and empty nonmatch/post-tool responses.
- The independent documentation audit passed package tests **4/4**, validation, fixture replay, and both conversion-guide examples.
- Reviewed journal retention, locking, stable read-only reports, bounded reads, metadata allowlisting, ownership/private modes, symlink/hard-link checks, and the documented same-user-process boundary. The full suite exercised concurrency, rotation, and private-file behavior.
- Reviewed the package file allowlist and the existing clean-extraction evidence. The final archive must be rebuilt after this review record and any remaining release-documentation changes; that final packaging check belongs in the verification record.

## Primary evidence and limits

Current [Codex hook documentation](https://learn.chatgpt.com/docs/hooks) and [plugin packaging/onboarding documentation](https://developers.openai.com/plugins/build/plugins) were fetched on the review date. The local public-source checkout was confirmed at [`a3d93e1e692f1144cf8685175a5d1f6bf7294f57`](https://github.com/openai/codex/tree/a3d93e1e692f1144cf8685175a5d1f6bf7294f57). Source inspection included event-specific schemas, [`pre_tool_use.rs`](https://github.com/openai/codex/blob/a3d93e1e692f1144cf8685175a5d1f6bf7294f57/codex-rs/hooks/src/events/pre_tool_use.rs), [`output_parser.rs`](https://github.com/openai/codex/blob/a3d93e1e692f1144cf8685175a5d1f6bf7294f57/codex-rs/hooks/src/engine/output_parser.rs), plugin manifest/onboarding parsing, marketplace-root resolution, and hook environment injection.

REA's successful restricted run established package inventory/source-map evidence with zero JavaScript files parsed. It did not establish semantic analysis, publisher authentication, native hook execution, or UI availability. The research record preserves the unsuccessful full-analysis attempt and the successful narrower run separately.

No live plugin installation, hook trust/configuration change, model call, skill activation, private-session inspection, or publication was performed by this review. Installed-host execution, Windows behavior, older-version compatibility, UI integration, and public-directory ingestion remain unverified. Public release wording must continue to distinguish offline contract tests and subprocess simulations from live Codex verification.
