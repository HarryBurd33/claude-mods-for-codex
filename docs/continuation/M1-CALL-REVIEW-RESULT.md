# M1 optional call review — implemented source, offline acceptance only

2026-10-26, GPT-6.1 Sol High, starting ac0aec2. Current human instruction authorized
M1-CALL-REVIEW-SCOPE implementation/offline tests. Installed31 untouched; all native,
ancestor, routing and Windows gates remain closed. No target read, native execution,
extra model run, network, activation, installation or live config/trust change.

## Delivered contract and code

- `src/hold-review.mjs`: strict default-off policy; bounded data-only minimal Bash
  carrier; existing deterministic impact explanations; guard precedence; any enabled
  rewrite refused; shared-config snapshots/recheck; required no-default confirmation;
  affirmative output exactly `{}`; fixed redacted denials; one pending review; logical
  30second maximum; abort, disposal and late-result cleanup.
- `src/runtime-settings.mjs`: optional strict `callReview` selection. Existing settings
  trust/project requirements and Windows before-IO refusal preserved.
- `src/server.mjs`: ninth tool only on explicit enable; form capability negotiation;
  existing requestHost transport; lazy existing shared-config selection. Trusted
  loader seam for offline fixtures only. No model-controlled policy/path/loader.
- `test/hold-review.test.mjs`:36 cases, synthetic data/temp files/in-memory peers. No
  command strings executed. `examples/config/call-review.settings.json` is disabled;
  `examples/hooks/call-review.json` is inert/unregistered. See `docs/call-review.md`.

Default three hooks, `.mcp.json`, `config/mods.json`, dispatcher/config/mod registry,
shared transport, UI and Windows/routing/ancestor guards remain unchanged. No version
bump or package claim: source is additional unversioned work after dev38, uninstalled.
Installed31 rollback/removal is unnecessary because no installed files were changed.

## Observed verification

Child test environments scrubbed inherited `CODEX_MODS_SETTINGS`, `CODEX_MODS_CONFIG`,
`CODEX_MODS_DATA_DIR`, `CODEX_MODS_PROJECT_ROOT`, `PLUGIN_DATA`, `PLUGIN_ROOT`,
`NODE_OPTIONS`. Only synthetic temp config selection is used by the loader test.
No inherited live config or target was inspected.

- `node --test test/hold-review.test.mjs`:36pass,0fail,0skip, about0.20s final run.
- Relevant regression command below:155cases,152pass,0fail,3platform skips, about5.37s.
  This includes the36new cases; do not sum the two runs as unique test coverage.
- `node bin/codex-mods.mjs validate`: valid3mods.
- `node bin/codex-mods.mjs replay --fixtures ./fixtures`:4synthetic outputs, expected
  safe/post abstentions, deny and SessionStart notice; no commands executed.
- Private verifier checks frozen8default/core plus19prior source/evidence pins,
  remaining old product pins except the2authorized edited files, unchanged93-ID map/
  counts, consumed grants and closed gates. No selected native/live inputs read.

Regression argv (with scrubbed environment as above):

```sh
node --test test/hold-review.test.mjs test/hold.test.mjs test/dashboard.test.mjs test/transport-ui.test.mjs test/dispatcher.test.mjs test/contracts.test.mjs test/rewrite.test.mjs test/impact.test.mjs test/impact-review.test.mjs test/components.test.mjs test/interactions.test.mjs test/usage.test.mjs test/observations.test.mjs test/rendering.test.mjs test/safety.test.mjs
```

One newly added clock-test assertion incorrectly compared an earlier clock sample
against a later one, producing35pass/1fail. Removed that irrelevant comparison; the
actual before-form/recheck deadline assertions pass. Added explicit logical checks
before future form and recheck IO actions during review. No product failure is claimed
from the test-harness assertion. Initial33case and interim150pass runs were superseded
by the final results above. Raw synthetic logs stay in ignored local evidence.

## Limits, access and acceptance still needed

EV-07/EV-10/EX-01 now have a substantive disabled source implementation, not just a
marker proof. Their old native proof is not acceptance of this code. The93-ID counts
are unchanged. Confirmation is advisory abstention, not approval. Host infrastructure
failure can fail open. Known auto-review is denied, but human response provenance
cannot be attested. Unchanged-only shared-config use excludes mutating hooks from
any source and independently overridden configs; no final-input/atomicity guarantee.
Form explanations deliberately redact the command, so they do not identify a target.

New optional access: matching enabled reviews transiently receive covered arguments
and lazily read the already selected shared hook config twice on acceptance. No state,
raw log, target, network or model access is added. Hook application scope differs
from the selected logging project; no logging/capture expansion was performed.
Existing stdio is reused without modification. Host retention/network effects are
outside the local process claim. Exact native platform acceptance remains unverified;
Windows runtime settings remain blocked. No fresh upstream browsing under this scope.

## Next bounded stage and publication

**GPT-6.1 Sol Medium** is sufficient for exact source/artifact verification and future
candidate preparation guidance. Verify the local manifest and closed gates; inspect
this contract/examples, confirm no accidental defaults/version changes. Do not
rerun the old UI verifier that intentionally pins the2source files changed here.
No native/target/model/network/install/config/trust/activation permission is granted.
High before a consequential defect/security change or unexpected drift. No automatic
worker/model switch. Later candidate packaging/version/CI or native activation needs
its own concrete scope; native execution/usage/human trust remain separate decisions.

Local checkpoint only; GitHub publication/remote verification blocked by the explicit
no-network instruction. Historical verified public d3c4682 was not refreshed and is
not a current sync claim. Preserve unrelated `.gitignore`/other-chat checkpoint input
and generations. Private receipt has exact local SHA/tree; root HANDOFF.md stays ignored.
