# Proposed normal-startup Stop validation — not authorized to run

## Subsequent selected milestone — pending phased approvals

The human selected Stop-only request preparation; see
[STOP-CONSOLIDATED-REQUEST](STOP-CONSOLIDATED-REQUEST.md). C/manual supervision are
accepted design facts, not pending votes. The older preflight/setup/usage prompts and
caps below are historical and must not be replayed as grants. No native approval or
checker/guard change follows. Current packet retains separate actual setup/startup/
trust/usage/result gates; all remain closed. Q39/NM-1 remains unresolved.


Current2026-10-26 update: human accepted **manual supervision design only**. [Exact next preflight request](MANUAL-PREFLIGHT-REQUEST.md) is prepared but unapproved. Native execution/inference/config/trust/input-read gates remain closed. Earlier pending-design statements below are historical.

2026-10-26, Sol High, starting7003e22. This completes preparation under
[NORMAL-STARTUP-SCOPE](NORMAL-STARTUP-SCOPE.md). **No native execution, inference,
installation, native config/trust write or input reread occurred.** Installed31 and
all execution/Windows guards remain unchanged. No new product runtime was written.

## Operator route and supervision decision

Use a human-supervised **official standalone CLI** in one fresh disposable macOS
project, not the desktop runtime or an experimental native driver. Reuse the
[Stop-only design](STOP-ONLY-PROPOSAL.md): one project hook, existing dispatcher,
separate private config/data, no production dashboard connection. The immutable
source snapshot is source38 implementation9016cb0, not installed31.

This proposes a **manual-supervision amendment requiring human agreement**:
one requested response, no retries, a human stop target of90seconds, no project-created
raw output log. There is **no enforced terminal-output byte cap or hard wall deadline**.
The earlier automated90second/2MiB envelope is not established by this route. Do not
run it unattended or describe a timer/interrupt as guaranteed process-tree or remote
cancellation. If hard automatic supervision is required, keep this route blocked;
separate authorization for a small bounded adapter would be needed. Do not reuse the
old raw-output/cleanup helpers unchanged or implement a runner under this plan grant.

The planned child selects GPT-6.1 Sol Medium explicitly, without changing the parent
chat's model or persistent preferences. This is an additional account-usage run;
requested turns are not a billing/request cap. This is not configured-agent routing
acceptance. The fixed prompt asks for STOP_PROBE_DONE and no tools/agents; that request
is not an enforced tool denylist. Unexpected tools/approval/continuation means stop.

## Inert artifacts and exact access proposal

Ignored .local/normal-startup-plan contains REVIEW-ARTIFACTS.json (exact future paths,
argv/cwd, prompt, false gates), OPERATOR-COMMAND.txt, project-hooks.json.txt,
stop-config.json.txt, SOURCE-SNAPSHOT.json and unchanged source-snapshot (39source/
license files). No target project or active .codex configuration was created.
Machine paths remain private. Artifacts are review data, not an executable approval.

P is a unique, not-yet-created project under a private temporary root **outside this
repository**; C (config) and D (data) are siblings outside P. S is the unchanged
private source snapshot. P and every created directory must be private; files0600.
The source snapshot deliberately has no default config/mods.json: explicit C is
required; missing config returns an empty Stop response and fixed diagnostic.

The single Stop command sets PLUGIN_ROOT=S, CODEX_MODS_CONFIG=C,
CODEX_MODS_PROJECT_ROOT=P, CODEX_MODS_DATA_DIR=D only for its child, then invokes
the explicitly selected Node and S/src/hook-main.mjs. Timeout5seconds, synchronous,
no continuation/block/async. C has no mods; metadataState.enabled=false,
scope=session, observerEvents=[], componentObserverEvents=["Stop"].
It does not enable ordinary logging, other lifecycle capture or production state.

The local hook process receives the host's complete Stop envelope in memory
(including possible assistant text/IDs/paths); it retains event/time only. It is an
ordinary local command process, not confined by the model tool sandbox. Reviewed
source makes no application network call, but this is not OS-enforced confinement.

Project containment includes descendants; session buckets isolate retained records,
not reception of exactly one session. Use one human-supervised session and do not
reuse P. Other applicable host hooks remain additive. Project declaration trust
does not fingerprint Node, referenced source or config; review those separately.

## Future phases — none currently approved

1. **Decision:** accept or reject the manual-supervision amendment. Agreement alone
   authorizes no file read, setup, startup, trust or usage.
2. **Separately approved preflight/setup:** obtain a fresh narrowly bounded grant
   for the exact saved CLI/config paths, selected Node identity, snapshot pins and
   collision/path checks. The earlier B read grant is consumed. Preserve old evidence;
   do not adopt an unexpected digest as baseline. Refuse drift/symlinks/unsafe modes/
   pre-existing target paths. Exact limits and allowlisted output must be reviewed
   before this phase; do not reuse the old grant as authority. Create only the
   reviewed temporary root/P/C/D and P/.codex/hooks.json after explicit setup consent.
   Do not install/update/disable installed31 or alter global logging/model/permissions.
3. **Separately approved ordinary startup and human trust:** proposed command has
   absolute historical CLI path, --no-daemon, -C P, --sandbox read-only,
   --ask-for-approval on-request, --model gpt-6.1-sol and
   -c model_reasoning_effort="medium"; OS cwd must also be P.
   Exact private argv is saved. Flags are based on earlier CLI164 evidence, not a
   fresh help/version check. If no longer supported, stop; do not substitute flags.
   Human opens /hooks, reviews only the exact new Stop declaration and referenced
   code/config, leaves all other trust unchanged, exits without a model prompt.
   Any project-trust/authentication/protected decision belongs to the human.
4. **Separately approved usage test:** open a fresh CLI session with the same command
   (no assumed hot reload). Human submits only the saved fixed prompt requesting
   STOP_PROBE_DONE, no tools/agents/follow-up. Human stays present, times90seconds,
   interrupts on unexpected behavior and exits after completion. No retry, approval
   automation, resumed session, raw output export or transcript collection.
5. **Separately approved read-only result check:** inspect only newly created D,
   with a bounded no-follow listing of metadata-state-v1. Expect exactly one safe
   hashed scope bucket. Zero/multiple/unsafe entries => inconclusive, no aggregation
   or discovery elsewhere. Use the existing journal reader/report for that explicit
   bucket (counts/types only); do not read private host session files for IDs.
   Expected response marker plus at least one Stop record supports native delivery.
   Multiple deliveries need review; no exact-once/lifetime attribution. No wire
   JSON capture means the run does not attest exact host parsing/output bytes.
6. **Explicit cleanup:** exit the child first. Remove only the exact owned hook file
   if its reviewed bytes still match; preserve changed files for review. Do not
   overwrite whole config files, delete native trust records/locks or roll back
   unrelated host state. Retain D/source evidence by default. Deleting test data/root
   is a separate explicit action, bounded to owned files/empty directories. A disabled
   future hook does not erase prior metadata or reverse normal startup effects.

Normal startup can access authentication, catalogs/cloud/network, local state,
plugins/MCP and applicable other hooks. Persisted remote-control/other callback
behavior is still unknown, not proven disabled. Human approval must explicitly
cover these residual effects; no promise of zero incidental requests/usage/writes.
Stop on new drift, protected-action prompts, unexpected remote work or unknown
outcome; do not retry or assume interrupt reversed external effects.

## Evidence and limits

[Official CLI reference](https://learn.chatgpt.com/docs/cli/reference),
[hooks/trust](https://learn.chatgpt.com/docs/hooks) and
[approvals/security](https://learn.chatgpt.com/docs/agent-approvals-security) were
retrieved2026-10-26. Release-specific Stop/discovery/trust sources and their commit
are linked in STOP-ONLY-PROPOSAL.md. Documentation/source are not native observations.

Fresh offline: components/observers/scope20total,19pass,0fail,1Windows-only skip,
1.309seconds. Six private fixed-Node copied-source replay checks pass: success,
count, event/time-only storage, missing config, malformed envelope, unchanged count
after failures. Synthetic spaced/apostrophe paths used; fixture data removed.
No native Codex/model/host config operation. Native Windows/Image/bounds and remaining
93requirements stay incomplete. No new CI/package/compatibility result is claimed.

## Next decision after Medium verification

Medium verifies exact inert artifacts/source pins/false gates/current docs, then asks:
“Do you accept the human-supervised CLI variant with a90second manual stop target
and no enforced output/deadline cap, or require a separately scoped supervised adapter?”
It must not combine design agreement with preflight/setup/startup/usage consent.
If accepted, prepare the exact next preflight/setup request under a separate scope;
if rejected, save the blocked route and request High for the bounded adapter design.
