# Research log and reproducibility

## 2026-10-24 — source27 bounded failure/turn contract check

Official hooks page retrieved from https://learn.chatgpt.com/docs/hooks; a direct
https://developers.openai.com/docs/hooks attempt returned404, and the German
search lead redirected to the same English Learn page. No unavailable page was
claimed reviewed. Latest stable GitHub release re-read rust-v0.164.0, published
2026-10-23T04:48:10Z. No install/upgrade or model run.

Retrieved pinned0.163.0 hook schema/PostToolUse/Stop, tool registry/context, unified
exec handler/adapter and exec_events/event_processor_with_jsonl_output. Re-read
0.164.0 registry/context: byte-identical. Two initially guessed filenames
(event_processor_with_json_output.rs and unified_exec/mod.rs) returned404; directory
listing/correct filenames resolved to jsonl_output.rs and unified_exec.rs. Only
retrieved content supports conclusions. Full primary links and source-specific
limits are in [event observation](event-observation.md).

Conclusions: no released PostToolUseFailure in reviewed interface; registry uses
logging success, while exec returns true independent of exit. Text-only terminal
post-response is unsuitable for trustworthy failure classification; invocation
errors/live processes can omit it. Exec JSONL structured statuses/exit/turn.failed
are a useful explicit snapshot alternative; interrupted turns may lack terminal
records. No cancellation inference, text scraping, native desktop-runtime mapping
or expanded logging. Implemented source27 explicit selection, fixed safe counts,
privacy/Windows refusals and synthetic tests; native acceptance remains separate.


> Historical v0.1 record. Current capability assessment, released-format correction and native proof results are in [continuation/STATUS.md](continuation/STATUS.md) and [continuation/REQUIREMENTS.md](continuation/REQUIREMENTS.md). Earlier exclusions and portable-hook packaging claims are superseded; the full product remains incomplete.

Date: 2026-10-22, America/Denver. Public documentation is mutable; Git source and package identities below are pinned. This log contains sanitized summaries, not raw machine diagnostics.

## Sources and versions

| Item | Observed identity |
| --- | --- |
| Installed Codex CLI | `codex-cli 0.163.0` |
| Local Node | `v24.22.0` |
| Codex public source | `a3d93e1e692f1144cf8685175a5d1f6bf7294f57` |
| REA public source reviewed | `6dc0f60faa0928e20b2395ba1a93ff8e497143f7` |
| REA package executed | `rea-agents@6.7.0` |
| SDK package inspected | `@openai/codex-sdk@0.163.0` |

Source repositories: [Codex](https://github.com/openai/codex/tree/a3d93e1e692f1144cf8685175a5d1f6bf7294f57), [REA](https://github.com/morluto/rea/tree/6dc0f60faa0928e20b2395ba1a93ff8e497143f7). A repository main commit and a published package version are distinct evidence; they are not claimed to be identical builds.

Package integrity values returned by npm:

```text
rea-agents@6.7.0
sha512-yhIx2ioJYYT1C/tONfYeitC6LhnKmCh+ZwRUOgYuhSc733lGhkkt73zhug9WmLgxoMdKuqIYGCoBfD4fXkOhFw==

@openai/codex-sdk@0.163.0
sha512-o10d8dqxFjhzoWp75MUrhaN8C6QrXPQqUJGwVnySj++ztAnrA322UuFRzHZvSa903lFgjjaimuf5rkqVsj0RHg==
```

## REA safety and configuration review

Before execution, read REA [README](https://github.com/morluto/rea/blob/6dc0f60faa0928e20b2395ba1a93ff8e497143f7/README.md), [installation](https://github.com/morluto/rea/blob/6dc0f60faa0928e20b2395ba1a93ff8e497143f7/docs/installation.md), [SECURITY](https://github.com/morluto/rea/blob/6dc0f60faa0928e20b2395ba1a93ff8e497143f7/SECURITY.md), [DISCLAIMER](https://github.com/morluto/rea/blob/6dc0f60faa0928e20b2395ba1a93ff8e497143f7/DISCLAIMER.md), and bundled workflow guidance.

Prospective setup changes were reviewed statically in `SupportedClients.ts`, `SetupClientConfiguration.ts`, `ClientConfigurationDocument.ts`, and `ClientRegistrationIdentity.ts`. Codex setup would add a named MCP registration to its configuration; default setup also offers matching skill installation and backups. Provider installation is a separate choice. None was needed for the standalone CLI investigation, so **no setup command, setup dry-run, registration, or configuration edit was performed**. This is a source-based review of potential changes, not a claim of an applied or locally generated setup plan.

The package was installed only under a temporary prefix with `--ignore-scripts --omit=optional --no-audit --no-fund`. No native provider, browser instrumentation, debug port, desktop app analysis, private sessions, or credentials were used. No REA process-ownership control was disabled.

## Results

1. CLI version/help checks succeeded. `codex app-server generate-json-schema --out <temporary-directory>` succeeded. A warning about unavailable PATH alias writes did not prevent schema generation. Generated request schemas include hooks, plugins, approvals, and dynamic tool calls. No live turn was started.
2. Full REA JavaScript analysis attempted to compile its macOS process-ownership helper. It first encountered a denied shared compiler-cache write. The documented `REA_DARWIN_MODULE_CACHE_PATH` override moved cache work to a temporary directory; compilation then failed with duplicate `SwiftBridging` module definitions. An explicitly selected existing SDK/compiler pair produced the same class of error. No compiler was installed, altered, or repaired.
3. `inspect-artifact` rejected the extracted SDK directory because that opening route requires a file/app bundle. This was a routing error, not a successful inspection.
4. A narrower supported run **succeeded**:

```sh
rea analyze-javascript-application <absolute-extracted-sdk-package> \
  --source-path package.json --source-path dist/index.js.map \
  --analysis-timeout-ms 30000 --max-heap-mb 256 --json
```

The target was the exact extracted public SDK tarball, not a rewritten fixture. REA completed inventory, metadata processing, graph validation, and evidence hashing. It read 36,307 selected text bytes, reported four relevant files, selected two, left two outside analysis scope, parsed zero JavaScript files, and recorded zero parse failures in this limited run.

```text
Evidence ID:
ev_776a501013ac7201c576c5c97b0b7d1eb5c798bc401c1f42fae2411ed2852f02

Root artifact SHA-256:
b1c316e2be5148e95ce94159191c8ff624617c62747363816319d17f12366773
```

This result establishes bounded package/source-map provenance. It does **not** establish semantic call relationships, runtime behavior, native hook execution, or UI availability. Independent public source inspection supplied the implementation-contract evidence. Raw temporary reports contain local paths and are intentionally excluded from the project.

## Outstanding verification

Live manual install/trust, hook dispatch inside the installed host, skill invocation, UI panels, model-driven behavior, other operating systems, and automation integration were not exercised. The implementation should maintain its own actual check results separately from this research record.
