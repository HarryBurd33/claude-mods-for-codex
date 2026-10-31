# Fresh native approval packet — revision 6

Preparation only; execution remains unapproved. Revision 5 stopped before its clock,
registration or startup because its pinned CLI installation disappeared. This packet
reviews the already-installed replacement and current inherited startup exposure.
It does not reuse v5 approval or install, downgrade, update or launch anything.
The exact private commands and binding are retained in the checkpoint; the sanitized
[manifest](NATIVE-HOST-V6-2026-10-30.json) records the reviewed hashes and boundaries.

## Replacement host and configuration

The installed package metadata identifies CLI **0.166.0**, target
`aarch64-apple-darwin`. Its 42-file inventory includes 40 paths corresponding to the
previous package: 31 have changed hashes and nine match the recorded v5 hashes.
Two executables are added: `codex-code-mode-host` and `codex-exec-server`; the package
metadata now declares the latter as its execution server. Read-only header parsing
identifies these two files and the CLI as arm64 Mach-O executables. No candidate
binary, help/version command, service or model was executed. Publisher provenance,
binary semantics, actual helper startup and version-specific compatibility remain
unverified. File hashes and metadata are not source or runtime attestation.

Fresh configuration inspection found exactly two added leaves since v5: command and
arguments for a direct maintenance MCP registration. Its script points at the now
installed maintenance plugin **0.1.3**; all seven source/cache files match, while the
previous 0.1.1 cache is absent. The direct registration and plugin declaration retain
the same other-task root/chat/inspector binding. Both registrations remain present.
Host precedence, deduplication and actual process count have not been tested.

Static review finds the same two no-argument MCP observation handlers. Discovery now
accepts absent/null cursor and protocol metadata; the separate milestone CLI mutation
remains outside the MCP surface. Service construction inspects bound-root metadata
before reading requests; initialization/discovery do not call observation handlers.
Actual tool calls can run inspectors/checkpoint subprocesses and read other-task data.
Neither tool, the service CLI nor other-task state was accessed during preparation.
The plugin README's update account does not independently establish actor or cause.

The new baseline explicitly retains those two additions. All previous configuration
leaves and empty tables, including permission and project/hook trust settings, match
v5. Previously disclosed marketplace/plugin, browser-service and unrelated project
trust changes remain retained. No live configuration was changed. Any later unrelated
semantic addition, removal or change still refuses; the exact typed new owned trust
allowance is unchanged. No automatic recapture or policy override was added.

## Gates and evidence

The binding now pins 63 selected runtime/service files, including all 42 CLI package
files. Node, preparation Python, NodeRepl/browser/app metadata, marketplace and inspector
pins match v5. The retained 40-file native component remains at
`61a990aa2484342a38f0be14b3479daa9feb02dc`; this macOS trial does not exercise the separately
accepted current Windows storage implementation.

Existing registration, trust-format, configuration, cache, interruption reader and
system-launcher checks are unchanged. A new read-only gate checks the exact CLI file
hashes and directory inventory, refusing extra, missing, changed or linked entries.
It never executes candidate code. Setup and every native startup chain include this
gate before the dependent action. Checks describe a point-in-time filesystem view;
they neither freeze later mutation nor establish all loaded dependencies.

**28 new checks pass** using inert package/configuration fixtures and shell builtins.
They cover package drift and links, optimized-mode/argument refusal, direct MCP and
native-policy drift, retained owned-trust allowance, all seven actual packet command
blocks and the new gate preventing subsequent actions. No real packet command runs
in those synthetic sequence checks. Live read-only preflight, exact system-launcher
check, package inventory and preserved 251-file cache comparison also pass.

One offline preparation failed at a broad file-stat comparison before binding creation.
That comparison included access time; a fresh inert-file observation reproduced an
access-time-only change on read, though the original differing field was not captured.
The failed source and partial owned artifacts were retained. Recovery verified the exact empty fixture and unchanged
artifact bytes, then used content/identity/size/modification/change-time comparison
without access time. Registration helpers and native authorization checks were not
relaxed. No clock, declaration or native process existed during that failure/recovery.

The collector is disabled and unloaded. The new project/data are private and empty;
its declaration, clock, attempt and result do not exist. Historical sealed v5 records
remain unchanged. Earlier accepted UI, archive and storage checks were not rerun;
all 93 requirement dispositions remain unchanged.

Independent security review: **conditional approval-readiness passed**. Preparation does not authorize execution.

## Single future approval scope

Fresh approval must cover the exact private v6 packet and current startup exposure:
the replacement CLI and bundled helpers, inherited MCP/plugin code and both maintenance
registrations. Normal startup may read auth/config, write local state, refresh catalogs,
connect to networks or resolve enrollment before the permission display. Read-only
tool labels and Workspace Ask do not confine inherited code. Maintenance tools and
their other-task data, NodeRepl/browser/sky/voice actions and unrelated work remain
excluded by instructions. Complete dependencies, system-launcher interpreter, loaded
identity and backend/descendant cancellation are not attested.

The proposed human-present batch retains one 15-minute clock, at most three manual
CLI startups, two Sol High model turns and no retry. It first requires native version,
project, model, unchanged compatible permission display and personal owned-hook trust
review, then exit without a prompt and preservation checks. The interruption case
must show actual terminal interruption and one fresh Interrupt/time observation before
the single `/usr/bin/false` case may proceed. Missing/ambiguous evidence or any failed
gate stops the batch. Only exact owned declaration removal after confirmed exit and
reconciled work is covered; expiry permits necessary safe removal, not another startup.
Source, data and trust are retained. No permission changes, installation, collector,
fallback, API spending, routing/inspection runner or release publication is included.

Current official documentation describes the interactive `--no-daemon` option and
model/configuration selection; this does not establish that the selected installed
binary behaves identically. [Developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli).
It also describes personal hook review and the active-main-turn `Interrupt` event;
the planned native evidence is still required. [Hooks](https://learn.chatgpt.com/docs/hooks).

Next: fresh human approval of the independently reviewed exact packet and Sol High selection
before any batch clock or native action. The previous approval is not transferable.
