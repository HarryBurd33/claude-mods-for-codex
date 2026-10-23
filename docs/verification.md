# Verification record

This file records checks actually completed for v0.1.0. The initial implementation worker hit a usage limit; work continued from the saved checkpoint.

## Environment

- Date: 2026-10-22
- Research/architecture model: GPT-6 Astra, ultra reasoning
- Initial implementation: GPT-5.6 Sol, high reasoning
- Implementation completion and journal safety review: GPT-6.1 Sol, high reasoning
- Node.js observed before implementation: v24.22.0
- Installed Codex CLI observed during research: 0.163.0
- Public Codex source/schema baseline: `a3d93e1e692f1144cf8685175a5d1f6bf7294f57`

## Completed checks

- `node --test`: **39 passed, 0 failed**, including protocol restrictions, configuration bounds, no execution of fixture commands, sanitized diagnostics, private journal paths, hard links/symlinks, concurrency, rotation, and read-only reports.
- `node ./bin/codex-mods.mjs validate`: default config valid with three mods.
- `node ./bin/codex-mods.mjs replay --fixtures ./fixtures`: notice, empty nonmatch, and exact deny response observed.
- Earlier runs found a privacy test incorrectly matching the allowed `SessionStart` event. That assertion was corrected before the successful full run. Journal review also found and fixed a real hard-link append risk.
- `node ./bin/codex-mods.mjs --help` and stdin replay succeeded.
- `npm pack --ignore-scripts --json --pack-destination <temporary-output>` succeeded with npm in offline mode. An initial 48-file archive was inspected: one `package/` root, no links/traversal, Git data, checkpoints, journals, credentials, dependencies, or investigation artifacts.
- That initial archive was extracted into a clean temporary path containing spaces. All 33 tests, validation, and fixture replay passed there without dependency installation.
- From a different working directory, the extracted native hook entrypoint consumed three fixtures with explicit `PLUGIN_ROOT`, an opt-in journal config, and a temporary `PLUGIN_DATA`. It returned valid JSON without stderr; the report counted three records. This was a subprocess simulation, not a live Codex hook test.
- The path-with-spaces test constructs its own temporary copy, so the suite also works in ordinary clone directories without spaces.

Final Astra review passed with all three findings repaired; see final-review.md. The complete source was published and anonymously cloned; all 39 tests, validation and replay passed in that public clone. A package changed after this inspection must be rebuilt and inspected again before delivery.

These are offline checks. No plugin was installed, no hook was trusted, no model or live tool call was made, and no skill or native desktop behavior was exercised. Windows quoting, host hook execution, public-directory ingestion, and any future MCP UI remain unverified.

Final post-review source package rebuilt and inspected: 49 files. All 39 tests, validation and replay passed in a clean extraction containing spaces. Repository access was enabled, the complete source was uploaded, and anonymous clone/content verification succeeded.
