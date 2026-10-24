# Current status — source26 selected-scope retention — 2026-10-24

Source **0.2.0-dev.26** is a development checkpoint on
`codex/astra-groundwork`. The full [93-capability ledger](REQUIREMENTS.md) remains
incomplete; the default branch retains the earlier experimental MVP.

The new POSIX [retention CLI](../retention.md) previews only the project/session
scope in reviewed private settings and requires its unchanged fingerprint for
explicit cleanup. It protects other scopes and recent data, takes cooperating
storage locks, refuses unsafe entries and reports partial deletion. No automatic
cleanup, MCP writer, lock reaping or Windows enabling. [Design/tests](DEV26-REVIEW.md).
No installed production metadata was deleted.

Exact public789a417 clone passed208/0fail/109Windows-only skips317total. Its
210-file archive was inspected byte-for-byte and a fresh spaced extraction passed
33focused checks/0fail/1Windows-only skip plus validate3/replay4. [Package record](PACKAGE-DEV26.md).
CI40128013186 completed: all four POSIX lanes208/0/109skips; Windows portable
passed (retention refusal1/0/19POSIX-skips). Both Windows storage jobs retain the
same real-image failure:25storage passes,84/85process proofs each. Not all-green.

Configured **dev26 is now installed in the Codex user profile and human-trusted**.
All210cache files equal the immutable prepared789a417 snapshot plus three private
existing-selection overlays. User reviewed all three changed hooks; independent
fresh inventory shows enabled/trusted, zero errors, no model turn. **Desktop
restart and native dev26 execution/rendering remain pending.** No production
cleanup, logging expansion, optional observer, theme or additional model/API run.
Preserved immutable10 is rollback source. Settings hash and unrelated config stay
unchanged; only owned marketplace source points to26. Do not infer loaded desktop
version from cache/trust inventory. See the restart [HANDOFF](HANDOFF.md).

Human priority remains macOS acceptance first, Windows later. Source25's known
Windows real-image positive fails before bytes: post-refusal linkcount2 versus
one-link guard. CI40122363235 had25storage passes and84/85process proofs per Windows
lane; four POSIX lanes189pass/0fail/108Windows-only skips. That failure is retained,
not hidden or repaired by26. No actual Git image hash/import/version/execution or
native Windows11/WSL acceptance; every production Windows gate remains closed.
[Preserved Windows review](DEV25-REVIEW.md).

Next: human restart, then continue **GPT-6.1 Sol Medium** for native read-only
dev26 acceptance. No model switch is needed for that routine work. High before
any new consequential runtime/security/writer change. Remaining accessibility,
loaded lifecycle/rollback, native triggers/active Watch, themes/routing/context,
broader authoring and platform work stay incomplete. See [HANDOFF](HANDOFF.md).
