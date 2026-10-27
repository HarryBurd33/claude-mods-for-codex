# Next unblocked task: one offline authoring-skills acceptance batch

Historical scope: explicitly authorized by the human from7bd32a5 and completed.
See [M1-AUTHORING-SKILLS-RESULT](M1-AUTHORING-SKILLS-RESULT.md). Original preparation
wording below is retained; it does not authorize a repeat or live deployment.

2026-10-26, prepared on GPT-6.1 Sol Medium from75559a7. **Scope preparation only;
the exercise below is not yet authorized or run.** No model switch is needed to
perform this routine batch after the human authorizes it. No implementation is planned.

## Choice and completion-plan link

Choose M1/W4: coherent authoring workflow and broader application of the four original
skills. Primary IDs AU-06/07/08/09/10 and SK-01/02/03/04. Existing code already supports
this path. The remaining task is observed same-chat workflow acceptance, not new CLI,
plugin machinery or another unit-test mirror. It supplies narrower evidence for the
backlog; it does not close native installation/trust/use or independent skill evaluation.

Why this task: W1/W2/native dev39 acceptance is blocked by launch/profile conditions;
W3 remaining human accessibility checks need a separately chosen UI session and prior
screen-reader availability was not established; W6 is gated by platform/security and
host dependencies; W7 network publication/research is disallowed. W4 can produce a
useful disabled, reviewed artifact without those dependencies. Do not reopen the
native admission, optional Stop or routing probe chains to do it.

## One concrete request and artifact

Apply the existing source skills in this **same selected Sol Medium chat** to:

“Create an Evidence desk local review card with a JSON claim list, literal test
notes, and a small workflow diagram. Render/Clear locally only. Generate it disabled;
do not collect data, save drafts, read projects or install anything.”

Translate it to this bounded spec:

```json
{
  "name": "evidence-desk",
  "kind": "interaction",
  "title": "Evidence desk",
  "fields": [
    {"id": "claims", "label": "Claim list", "format": "json"},
    {"id": "notes", "label": "Test notes", "format": "code"},
    {"id": "sequence", "label": "Workflow sketch", "format": "flowchart"}
  ]
}
```

This is an owned-card definition for the existing fixed renderer, not arbitrary
HTML/JS/CSS, full Mermaid support, native chrome or an immediate slash command. The
flowchart subset/bounds and fallback must remain disclosed. No default field contents.

## Exact future access/write envelope

Source reads: the four SKILL.md files under skills/mod-scaffolding,
skills/systematic-debugging, skills/verify-mod-completion and skills/prepare-mod-review;
docs/authoring.md, docs/local-interactions.md, docs/skill-workflows.md; current ledger;
existing bin/codex-mods.mjs and only relevant component-contract/authoring,
interaction-contract/replay/controller/rendering source when needed for interpretation.
Use the reviewed repository's source39 CLI, **not** an assumed installed version.

New private root: `.local/m1-authoring-skills/`, currently not created by this proposal.
Use canonical private0700directories/0600regular one-link files. Refuse an existing,
linked, unsafe or unexpected path; no overwrite, permissions repair or alternate-root
search. No selected project, settings/cache/trust, session/transcript, credential,
native CLI/Node target identity, old production data or environment-value discovery.

Only future artifact writes inside that root:
- spec.json and original-bundle/{component.json,access.json,plan.json,REVIEW.md,
  fixtures/local.json,bundle.json}, produced by the existing generator once.
- replay-intent.json, a separate synthetic copy changing **only** interaction.enabled
  to true. This is offline replay input, never merged into host/runtime settings.
- corrupted-bundle/, one copied synthetic negative control described below.
- bounded commands/results/logs, original/source hashes, SKILL-APPLICATION.md,
  REVIEW.md and RESULT.md. No generated executable or new product source/test code.

Public writes after the future exercise: one sanitized acceptance record and necessary
updates to current continuation status/ledger/handoff. Raw fixtures, field text,
private paths/logs stay ignored. No version bump, package/CI cycle, install or release.
All existing source/skills/default hooks/.mcp/config and dev39 archive remain unchanged.
Installed31, logging/model/settings/trust/Windows/ancestor/routing guards stay unchanged;
dev39 remains disabled and uninstalled. No source/runtime fix is included in this scope.

## Workflow and exact command shapes

Resolve `<CLI>` only to this repository's reviewed absolute bin/codex-mods.mjs;
`<R>` is the new private root above. Run fixed Node commands without a shell, in the
reviewed repository cwd, with inherited CODEX_MODS/PLUGIN selections and NODE_OPTIONS
removed. No Codex client, server, model/provider adapter, installer or trust helper.

1. **mod-scaffolding:** record the original request/spec/source version, access limits
   and disabled intent. Generate once:
   `node <CLI> scaffold-component --spec <R>/spec.json --output <R>/original-bundle`.
   Require created=true, enabled=false, registered=false, installed=false. Hash the
   original complete bundle. No proposed file/model/network/capture action may be
   added just because the request uses words such as evidence or workflow.
2. Validate with `node <CLI> validate-component --bundle <R>/original-bundle`.
   Replay disabled with `node <CLI> replay-component --bundle <R>/original-bundle`;
   inspect disabled plan with `node <CLI> component-plan --bundle <R>/original-bundle`.
   Expect valid/not-installed, no mounted controls, no hooks/hook config or paths;
   display remains false. Review actual access declaration as a code claim, not an
   OS sandbox. Authoring writes are distinct from the card's runtime access.
3. Make only the separate replay-intent change. Run
   `node <CLI> replay-component --bundle <R>/original-bundle --intent <R>/replay-intent.json`
   and `node <CLI> component-plan --bundle <R>/original-bundle --intent <R>/replay-intent.json`.
   Actual fixed controller/renderer runs in the existing **minimal synthetic DOM**:
   render3fields; edit invalidates; Clear clears; malformed/oversized clears and
   renders0; dispose prevents stale callbacks. No field input is executed or returned
   in replay summary. Plan has exactly the reviewed enabled interaction entry and no
   registration/capture/permissions/new paths. Nothing is displayed in the real app.
4. **systematic-debugging:** exercise one explicitly seeded integrity fault, not a
   fabricated product defect. Copy the disabled bundle with private modes intact;
   append one ASCIIspace to copied fixtures/local.json, retaining valid JSON and
   every original marker/hash. Run exactly one
   `node <CLI> validate-component --bundle <R>/corrupted-bundle`, expecting refusal.
   Diagnose by the one-byte diff and original marker comparison at the integrity
   boundary. Preserve the corrupted copy; do not repair hashes, overwrite/regenerate
   it or make a runtime fix. The correct outcome is expected rejection, not a bug fix.
   Revalidate the untouched original once as the control. That is not a retry of
   the corrupted input; it must pass and remain byte-identical.
5. **prepare-mod-review:** record trigger/behavior, exact selected files/diff, separate
   authoring versus runtime reads/writes, no network/model/capture authority, intent
   delta, meaningful checks and missing native facts. No staging/private publication,
   install/trust request, merge or update commands are part of the exercise.
6. **verify-mod-completion:** build a claim-to-evidence table. Accept this source-only
   authored workflow and expected integrity refusal only if the criteria below pass.
   Keep live rendering/accessibility/installation/hook delivery independent and
   unverified; don't mark the full project, a native slash invocation or all skill
   quality complete. Stop after one sanitized results record and local checkpoint.

Use the actual outputs rather than assuming key names where contracts differ. A
contract mismatch is a finding, not permission to weaken an assertion or alter source.

## Bounds, model usage and acceptance

One batch, one generation, one known corrupted copy; **eight fixed CLI invocations**
above. Per invocation10second subprocess limit,64KiB combined output; at most512KiB
CLI logs. Private authored artifacts at most64regular files/2MiB total, excluding
existing reviewed source. Target at most20minutes of foreground work; no background
continuation or retries after unexpected/ambiguous outcomes. Bounded private parsing/
hashing/copying is allowed; it grants no arbitrary command executor. Logical/process
limits are not hard real-time guarantees under OS stalls. No cleanup of unknown files.

All four skills use the current selected model and ordinary chat usage. CLI callbacks
add no model/network requests. **No extra evaluator, subagent, API, model task, native
client or paid keepalive is authorized.** This is same-chat source-skill application,
not independent evaluation or proof of installed discovery/invocation. Do not read the
installed skill/cache to turn it into a different acceptance claim.

Acceptance requires:
- Supported request translated accurately; generated original stays disabled and
  byte-identical throughout. Only a separate replay intent enables simulated display.
- Exact no-new-access plan and the six simulated cases behave as specified; raw input
  remains out of summaries. Capture/network/model/file execution remain absent.
- Seeded altered copy refuses; diagnosis identifies the integrity mismatch, reports
  expected refusal and preserves evidence without blessing edits or changing guards.
- Review/completion notes account for authoring writes, current-chat model usage,
  platform/version/source-only limits and every missing native check.
- Source/defaults/skills/archive and installed31 are untouched by the exercise;
  consumed grants/gates remain closed. No claim of fresh installed preservation
  inventory, Windows compatibility or native acceptance.

Any unexpected source/security/process failure or need for broader reads/changes:
checkpoint evidence, stop for **Sol High**, no repair or broader test loop. An unsafe
path is a refusal, not a reason to weaken its guard. Existing archive/acceptance tests
need not be rerun: source has not changed. Preserve private artifacts by default;
removal is a separate explicit action confined to owned paths.

## Authorization to use later — not yet granted

“Continue on GPT-6.1 Sol Medium from the recorded scope checkpoint. Run the one offline
Evidence desk authoring-skills batch in M1-AUTHORING-SKILLS-SCOPE.md using existing
source only. Permit its private spec/bundle/replay intent/corrupted control and result
records; no live config/trust changes. Preserve installed31/all guards/dev39disabled;
no source implementation, native/UI/server runs, extra model runs, network, installation
or target/session reads. Stop for High on unexpected source/security failures or drift.”
