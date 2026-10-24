# Next macOS milestone — production impact review and decision flow

Exact next setting: **GPT-6.1 Sol High**. Source28 authoring/native display batch
is complete for its bounded target; full93 requirements remain incomplete.
Prioritize EX-01 and EV-07/10 production usefulness. No Windows proof/package loop.

## Starting foundations and unresolved boundary

Read src/impact.mjs, dispatcher/config/CLI impact contracts, relevant tests and
current REQUIREMENTS/MACOS-ACCEPTANCE. Existing fixed lexical impact explanation
and deny-only guard are useful foundations; no command parsing/target counts or
safe-command inference. Separate hold0.0.4 previously exercised human response
paths, but disconnected advisory/fail-open behavior and human provenance prevent
calling it a production approval authority. Read the current architecture's hold
proof sections and versioned evidence before deciding. Do not reinstall the proof.

## Objective and acceptance

Design and implement the closest useful supported production workflow: describe
likely lexical impact, explain uncertainty, then an explicit human decision via
normal host permissions or a disclosed deny-plus-review/retry alternative. Do not
invent an authenticated token, trusted approval UI, permission bypass or automatic
allow. Recheck only relevant mutable primary host contracts where needed; establish
whether existing source suffices before adding code. If true held-call enforcement
cannot be provided, report the exact limitation and ship the useful disclosed
alternative rather than relabeling an advisory hook as guaranteed enforcement.

- Preserve default-off behavior, exact-rule semantics, scope/privacy and ordinary
  permission rechecks after rewrites. No shell execution/path scan/command echo or
  prompt/selected-model rewrite to produce explanations.
- User experience must explain the decision and next safe step. Any chosen policy
  edit is narrow, reviewable and separate from executing the denied command; no
  persistent broad allow/silent approval. No destructive demonstration.
- Test lexical matches/false-positive explanation, missing/invalid/bounded inputs,
  malformed/timeout/disconnected/error/cancel outcomes relevant to selected design.
  Preserve known host advisory limits and fail-safe claims only where proven.
- Prepare harmless synthetic and native acceptance cases with exact expected
  behavior, access delta/rollback and human trust needs. Existing installation
  stays frozen until concrete review; no new permissions/config choices inferred
  from this handoff. Any additional model run needs fresh bounded human grant.
- Update all relevant ledger rows/tests/access/setup documentation, preserving
  all93 IDs/order, MIT and independent-project disclaimer. Keep native proof,
  unit tests and unsupported claims distinct. Stop for Medium once routine
  package/CI/review preparation remains, with runnable uploaded verified handoff.

Do not start a separate client/fork, patch Codex internals, expand logging, reuse
consumed model-run grants, enroll optional hooks or address deferred Windows code.
If High finds a different prerequisite necessary, explain it and keep the bounded
objective; do not create another package-version-only milestone.
