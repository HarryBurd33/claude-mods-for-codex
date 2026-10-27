# Astra review: runtime integration and the next macOS milestone

2026-10-26 project date. Starting local commit: `e5a13e96ca2a56565a084b815691bfd48767e13e`.
The other project chat was observed idle before this work. Its files and commits
were preserved. This is a completed **review and offline integration milestone**,
not completion of the product or permission to activate native trials.

## Result

The external checkpoint runtime drift has been reviewed. The eight source functions
reached by Phase 1 ownership validation are byte-for-byte identical between the old
pinned runtime and the current installed runtime. A new private, versioned launcher
adopts the reviewed dependency; the historical launcher/seal, original grant, target
binding and source/core bytes remain intact. Both launch admissions remain closed
and the original shared real ledger is empty. **The real Phase 1 grant is unused.**

The last narrow execution instruction was synthetic-only. The present Astra stage
does not infer activation from a general request to continue. A later explicit
activation may invoke the existing grant once; it does not require another vote on
the accepted C design or manual supervision. Native startup, trust, model usage and
result/removal access remain separate boundaries in the original packet.

Source remains **0.2.0-dev.39 disabled/uninstalled**; installed31 is preserved.
No production implementation, installation, global configuration, trust, logging,
model preference or Windows guard changed in this stage. No selected real Phase 1
source/template/target metadata was inspected. No native Codex process was started.

## Review and repairs

The old dependency digest was
`03f2d32e58efca8286f433c4e1cd1ae5f3649ad04d1c8cb68d9b828070ae3b6c`;
the reviewed installed digest is
`ff357925a45c2e767276d670ececb50c91fbe9adce7a0bbd130d2870e263fdce`.
Exact old bytes were recovered read-only from an existing local rollback archive.
AST-selected source comparison covered `read`, `config`, `git`, `git_text`, and
`Ownership.__init__`, `tip`, `value`, `check`. Top-level imports are standard library;
optional routing/monitor imports are not reached by this path. The changed release
logic is not called by Phase 1. This is a narrow call-path conclusion, not a review
or certification of every checkpoint-runtime feature.

The versioned entry makes four changes:

- Removes the unnecessary external directory insertion into Python's import path
  and requires isolated Python with site initialization disabled (`-I -S`).
- Rechecks the 60-second admission lifetime immediately before reserving the result,
  after ownership queries that could take time.
- Uses the **same original real ledger**, so changing the launcher cannot create
  a fresh opportunity to spend the one-use grant.
- Pins the reviewed runtime and modified entry in a new seal. It never overwrites
  historical evidence or changes the selected target scope.

Review also found that Python isolation does not isolate Git. The final test harness
clears its environment, uses fixed system Git, private HOME/TMPDIR, controlled PATH,
and disables system/global Git configuration. Every synthetic fixture checks its
actual Git directory. A later real launcher must likewise use a controlled minimal
child environment, with no inherited Git redirection variables; this is not a host
configuration change. Python/Git and the cooperating local operator remain trusted
platform dependencies, not an OS security boundary against a hostile local user.

## Checks actually performed

| Check | Observed result | Limit |
| --- | --- | --- |
| Old/current ownership dependency comparison | Eight reached functions identical; expected runtime hashes matched | Narrow source review, not whole-runtime certification |
| Versioned entry with actual current runtime and local Git | **11 tests passed** after environment hardening, 3.549 seconds | Synthetic repositories/source/templates only |
| Successful setup and repeat | Correct synthetic files created once; repeat refused without changing result | Not the real setup grant |
| Negative admission/ownership cases | Missing receipt, receipt/ref mismatch, owner/token mismatch, remote mode, runtime drift, stale/future review and nonisolated Python all refused | No real target or remote ownership operation |
| Delayed ownership | Review valid before Git but expired afterward refused before reservation | Controlled delay, not OS-stall proof |
| Project regression selection | **44 passed, 0 failed, 0 skipped** in hold-review and restore-failure tests | Local POSIX synthetic cases, no native host/Windows acceptance |
| Default configuration and replay | Validation passed for 3 mods; 4 fixtures produced expected responses | No fixture command executed |
| Preserved real state | Original pins intact, both admissions closed, original real ledger empty | Does not inspect or certify real target contents |

Commands for the public project checks:

```sh
node --test test/hold-review.test.mjs test/restore-failure.test.mjs
node ./bin/codex-mods.mjs validate
node ./bin/codex-mods.mjs replay --fixtures ./fixtures
```

The private integration command/log and digests are in the local checkpoint. An
earlier 11-case pass before environment hardening is retained as historical evidence;
these are 11 cases rerun, not 22 independent tests. The previous 30-case core suite
was **not rerun** in this stage. No full suite, new package, CI, native lifecycle,
screen reader, Windows, Linux or WSL acceptance is claimed.

## Capability conclusions and current primary-source check

The original [93-requirement ledger](REQUIREMENTS.md), architecture and REA findings
remain the project foundation. This stage refreshed the Claude Mods overview and
official hook/UI pages; it did not repeat a complete website crawl or REA run.

| Requested feature | Practical Codex route | Project conclusion |
| --- | --- | --- |
| Panes, buttons, filetree and visualizations | Owned MCP UI on supporting hosts | Dated macOS evidence exists; accessibility, reopen and backend teardown still need acceptance. Native transcript/spinner replacement is not established. |
| Hold/block/alter a tool call | Covered hooks; bounded exact Bash rewrite; optional MCP review candidate | Rewrite/deny have dated native evidence. Production held-call candidate remains disabled pending unchanged-input deployment and native checks. |
| Lifecycle reactions and shared counters | Separate hook processes and explicit private metadata | Selected events/state observed; Stop/failure/cancel breadth still pending. No shared in-process mod runtime claim. |
| Routing work to another model | Explicit configured agent/task with reviewed model and effort | Candidate/profile work exists; real configured-agent routing still unverified. No transparent rerouting. |
| Commands and natural-language authoring | Local CLI plus skills generating disabled, reviewable artifacts | Useful workflows exist; no arbitrary native slash callback or automatic trust/hot reload claim. Full candidate author/install/update/remove campaign pending. |
| Replay and usage views | Selected Git history/restore plans and explicitly selected usage exports | Scoped approximations; no complete transcript replay, exact billing or cache-health guarantee. |
| Machine/session access | Trusted local extension process with explicit selected access | May access sensitive data under OS permissions. This project avoids secret discovery, automatic approvals and hidden prompt changes. |

[Claude's overview](https://code.claude.com/docs/en/plugins/mods/overview) describes
in-process event handlers and UI customization. That runtime is not an assumed Codex
API. Current [Codex hook documentation](https://learn.chatgpt.com/docs/hooks) supports
denial and `updatedInput` on covered local calls, but excludes hosted/specialized
paths from universal coverage. Hooks are additive/concurrent, installation does not
grant trust, and unsupported response fields can fail rather than enforce a block.
These constraints rule out treating this project as a universal security layer.

The refreshed [Extensions guide](https://developers.openai.com/plugins/build/extensions)
describes ChatGPT UI surfaces. Its wording alone does not establish Codex host parity.
Use the project's dated host observations and capability checks for its owned UI;
do not generalize to every host or built-in UI element.

[REA research](../research.md#rea-investigation) remains limited: its recorded
metadata/source-map run succeeded while full JavaScript parsing failed. It supports
the inspected package provenance, not a new claim about native interception.

## Next implementation milestone and model

Use **GPT-6.1 Sol, Ultra** for the consolidated
[macOS integration milestone](SOL-ULTRA-MILESTONE.md). The ownership dependency review
is complete; do not spend another session reviewing the same unchanged functions.
Bring back Astra only for a new architecture/security uncertainty or final release
review. Routine packaging/docs/verification can move to Sol Medium after the native
contracts and candidate behavior are stable and the checks listed in that handoff pass.

The explicit reviewer used `gpt-6-astra` with `ultra`. This does not prove or change
the parent desktop chat's model setting. No Sol worker, paid API fallback or follow-up
automation was launched. The obsolete wait heartbeat was removed after the other
chat completed. Account allowance was checked; task-specific cost/savings are unknown.
