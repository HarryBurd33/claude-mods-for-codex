# Proposed next scope — offline dev39 candidate packaging

2026-10-26, prepared on Sol Medium after974531d artifact verification. **Proposal only,
not execution authority.** Medium is sufficient for this routine stage; stop for High
on any required semantic source/security change or unexpected drift.

## One deliverable

A disabled, versioned, locally packed dev39 candidate whose archive bytes match exact
local source. It is a review artifact, not a release, installation or native acceptance.
Installed31, current logging/model/settings/trust and all guards stay untouched.

## Proposed edit and execution envelope

1. Only version strings in package.json, .codex-plugin/plugin.json, src/server.mjs and
   ui/dashboard.html may become0.2.0-dev.39. No controller/permission/config/registration/
   policy behavior change. Documentation can describe the actual candidate/tests.
2. Use an ignored local artifact directory and isolated cache for offline npm pack
   with scripts disabled. No dependency installation, downloads, remote clones,
   CI submission/query, publication, native input hashing or target/config inventory.
   Do not run prepare-production/prepare-hold/install/trust helpers.
3. Check archive members for path traversal, absolute paths, links, special types,
   case collisions, unexpected private files; match every member byte to exact source.
   Bind archive hash/integrity, source commit/tree and manifest. No root private
   HANDOFF.md, .local/.checkpoint, raw logs, caches, live configuration or credentials.
4. Extract into a disposable directory with spaces. Run test/hold-review.test.mjs,
   test/package.test.mjs and test/contracts.test.mjs using scrubbed inherited live
   selections. Fixed Node/in-memory/synthetic temp fixtures only. Compare packaged
   CLI validate/replay outputs with the expected3mods/4fixtures; no command execution.
   Preserve existing test meaning; do not alter tests to conceal a packaging failure.
5. Verify original default three hooks, .mcp.json, config/mods.json, dispatcher,
   transport and protected Windows/ancestor/routing guards are byte-identical;
   settings fragment false, optional hook example unregistered; no capture expansion.
   No closed native-entry invocation or actual host proof is included in this scope.
6. Save local manifest, observed commands/results, exact source commit and handoff.
   Do not claim remote equality/CI/native compatibility. No network publication under
   the present restriction; that needs a separate scope.

## Acceptance and stop boundary

All4version carriers agree; only version strings/records changed. Archive provenance
and private-file checks pass. Packaged selected tests/validate/replay pass with explicit
platform skips and no native inference. Default-off absence of the optional tool,
existing guard precedence and inert examples remain verified. Preserve old sealed
implementation/evidence manifests; new versioned source gets a new manifest, not an
accepted native-input baseline. Stop with exact evidence on an unexpected mismatch.

After packaging, the next consequential work is a separate High review of native
acceptance/deployment scope: shared hook-config binding, no-mutating-hooks assumption,
host trust, application scope versus logging scope, human provenance, failure behavior,
cleanup and still-blocked launch prerequisites. Do not disable installed31 rewrites to
make a test work. A native run, activation, changed settings/trust or additional model
usage each requires its own exact human-authorized scope. This packaging proposal
cannot bypass the ancestor-policy refusal or consumed grants.

Copyable authorization, **not yet given**:
“Continue on GPT-6.1 Sol Medium from the recorded verification checkpoint. Build and
verify the disabled offline dev39 candidate under M1-CALL-REVIEW-CANDIDATE-SCOPE.md.
Permit only the four version strings, local offline archive/test artifacts and docs.
Preserve installed31/all guards/logging/model/trust; no activation, target reads,
native runs, extra model runs, network, installation or live config/trust changes.
Stop for High before consequential source/security work or unexpected drift.”
