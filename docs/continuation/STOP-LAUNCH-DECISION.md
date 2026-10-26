# Stop-only launch decision — existing evidence only

2026-10-26, GPT-6.1 Sol High, resumed767570d. No new research, native client/UI/model
invocation, native-input refresh, install/config/trust action or runtime implementation.
Installed31 and all guards preserved. The accepted **project-local Stop design** is
unchanged. This document decides future **review scope**, not permission to launch.

## Conclusion

Existing evidence does **not** support a runnable “ordinary startup is safe” request.
A read-only tool sandbox/read RPC list does not bound native startup; a new client
name/stdio/no-daemon does not establish remote-ingress exclusion. Our Stop observer's
empty JSON does not constrain other hooks. Do not offer a blanket acceptance of all
normal startup effects or imply design agreement waived these unknowns.

The useful choice is therefore: **A keep no-launch**, or **B authorize only the
bounded two-file input review below** to assess a future normal-client envelope.
Neither choice runs Codex. B can still end blocked; it cannot by itself establish
runtime hooks, remote-control exclusion, safe startup, native support or billing.

## Saved evidence and actual unknowns

Only existing records were read; their pinned underlying CLI164source is
`6aaac694803004a63c6f393d153c96d22521a6b9`. No source was fetched again and no
current installed version/effective policy/enrollment was queried.

| Existing evidence | What it establishes | What it does not establish |
| --- | --- | --- |
| [Source36.1 startup review](INSPECTION-ACTIVATION-DEV36.md), app-server/config-manager trace | Reviewed path loads auth/cloud config and local state/log/recovery infrastructure before inspection replies | Actual network traffic/writes/recovery on this host; every other client path or global write-free startup |
| Same record, catalog worker trace | Catalog work may be scheduled without a client model/list request | Successful network/catalog generation, inference, exact billing or absence of other usage |
| [Source37](DEV37-REVIEW.md), plugin manager trace | Effective plugins=false excludes warmups in the reviewed plugin-manager entry | That this process has that effective setting, that all startup effects are excluded, or that disabling plugins is authorized here |
| Same record, persisted remote controller trace | ResolvePersisted can remain unknown until resolution; disabled policy/absent DB are separate source branches | Current enrollment/state, supported per-process exclusion or permission to edit policy/delete state/use an internal marker |
| [Stop proposal](STOP-ONLY-PROPOSAL.md), reviewed hook discovery/Stop code | Hook sources are additive; another Stop hook may cause continuation; our observer does not request it | Complete visibility, exactly one model request, tool-free host behavior, no other callback/network/write |
| [Source38](DEV38-REVIEW.md), Node reliability regressions | Corrected offline deadlines/group-result reporting; direct-child reap is not all-work cancellation | Native descendant containment, remote cancellation or an exact usage ceiling |
| [Current verification](STOP-ONLY-VERIFIED.md) |32inert artifacts/38source pins and existing preservation observations match | Fresh selected CLI/config admission. The known added project-trust entry stays unknown/unaccepted |

These are conditional source facts/earlier observations, **not evidence those effects
occurred now**. The source36/37app-server findings are not silently asserted as an
audit of every CLI/desktop route. An unreviewed alternative route is not an exclusion
or permission to bypass the current gates. No repeated startup investigation is needed
for this decision, and no new launcher or proof machinery is proposed.

## The exact human choice — pending

| Choice | Authority if explicitly chosen | Gates that remain closed |
| --- | --- | --- |
| **A — Keep native launch blocked** (current default) | Record the unresolved native Stop result; preserve design and evidence for later. No new input review | All launch/input-refresh/config/trust/install/inference gates. Full product remains incomplete |
| **B — Permit bounded current-input review only** | Read only the two historically selected files under the limits below, without executing either; record fixed classifications privately. Assess readiness for later normal-client review | Native/UI execution, network, inference, installation, config/trust/policy writes, state/credential/transcript reads, native argv/PLAN creation and automatic baseline adoption |

B is **not** acceptance of a normal-startup execution envelope. It reduces historical
input-identity uncertainty only. Neither the project-root design agreement nor this
new document chooses B; its approval flag remains false. Current instruction still
forbids input refresh, so **neither file was refreshed for this artifact**.

### B: exact two-file read scope for later explicit approval

Private FUTURE-READ-SCOPE.json derives path references only from the sealed historical
source34 INPUT record, not current discovery. It names exactly:

1. The historically selected standalone CLI file: regular-file metadata and streaming
   SHA256 only, max256MiB. No launch, version/help call, installed-app search, alternate
   executable selection or discovery through changed links.
2. The historically selected user config file: bounded max256KiB read, private digest
   and allowlisted type/preservation classifications. The whole bounded file can enter
   memory and could contain sensitive text; do not retain/print raw content or inspect
   credentials/environment values, hook command bodies or unrelated project details.

Review budget20seconds, zero retries, no recursion/new paths/network. Refuse absent,
linked/special/oversized/unsafe/changing files or ambiguous identity; preserve evidence
and do not repair. A budget is not a kernel-I/O deadline guarantee. If it cannot be
observed safely within these bounds, report unavailable rather than extending/retrying.

Compare only against existing historical/preservation observations. Report fixed
labels/counts/booleans and private hashes; no public paths/digests, commands, raw config,
API keys, account data or new accepted baseline. Optional typed fields are limited to
model/effort-preservation, approval/sandbox/features/plugin-enabled and hook **trust
metadata** classifications. Do not read hook definition files, auth/enrollment/state
DBs, logs, session files, credential stores, environment values or additional configs.
Do not resolve the known project-trust addition by accepting it or restoring old data.

A binary hash is not an executed version or compatible-release proof. User config
is not effective runtime configuration; builtin/managed/other layers may remain
unseen. This review **cannot resolve remote-ingress exclusion** or prove that an
empty hook list would authorize execution. If a comparison produces an unexpected
difference, stop for High read-only classification; no automatic repair/refresh.

The private scope is an **unapproved read-request description**, not an executable
plan: paths are explicitly marked historical/unrevalidated, no native argv/model/
thread/transport exists, all action flags false. It does not overwrite native
source34/35/36inputs or their manifests. Any later output needs its own dated
observation and must not be called a launch grant.

## What would still precede a future native test

After any B review, native launch remains blocked unless a separately reviewed,
supported boundary or explicit adequately specified execution envelope is agreed.
That future choice must identify actual target/current effective authority, residual
startup auth/cloud/catalog/state/log/plugin/MCP/other-hook/remote-ingress exposure,
normal permission/trust handling and realistic usage/cancellation limits. Unknown
remote ingress cannot be relabeled disabled. No new settings/privileged service/
internal environment patch or silent change to selected model/permissions is allowed.

Actual project configuration and human exact-hook review remain separate. The future
Stop test would need a fresh precise model-usage grant and bounded harmless task;
other callbacks could still add requests before an observer notices. A process stop
cannot promise remote cancellation. Do not make that grant from old approvals, a
synthetic test, elapsed time, the user's absence or an answer about review scope.

## Medium handoff and prepared question

High review is complete; **GPT-6.1 Sol Medium** can verify this decision/private scope
against sealed evidence, preserve all guards and present A/B without another research
or packaging loop. Current stage performs no input refresh. After explicit B approval,
only the exact bounded file-review scope can become authorized; if that future action
is outside the then-current user scope, stop. Never interpret either answer as native
execution or a policy change. High before consequential changes/new drift.

Prepared user question, after artifact verification: “Keep native launch blocked, or
allow only the two-file read-only review described here? B checks the already-selected
CLI file identity and user-config classifications; it does not run Codex or open any
other gate, and may still leave launch blocked.” No answer has been requested or
received in this High stage. No background continuation/model switch is scheduled.
