# Continuation verification log

## Production native acceptance after restart — 2026-10-23

Production0.2.0-dev.1 tools and skills loaded after the human restarted Codex.
Actual native calls: `printf MODS_PRODUCTION_BEFORE` returned MODS_PRODUCTION_AFTER;
`printf MODS_PRODUCTION_DENY` was blocked by PreToolUse; CONTROL returned unchanged.
No reinstall, trust edit, extra model turn or permission weakening occurred.

The actual production dashboard opened beside this chat, separately from the
original proof. Permitted MCP Apps inspection observed connected host, four view
buttons, notes.txt/status??, read-only changes with Patch:not-requested and
unavailable token/cache/billing disclosure. Screenshot stays ignored/local.
Keyboard/screen-reader, resize/close/reopen acceptance remains unverified.

Activity stayed0 after native calls: the selected child-project scope differs
from this chat's hook context. Scope was not broadened. A labeled synthetic
PreToolUse envelope replayed through the installed hook subprocess returned{},
stored one metadata record and executed no command. Actual native panel Watch
changed0→1/PreToolUse1; Watch was then unchecked. This verifies replay/storage/
MCP/view observation, not native scoped event provenance or SessionStart.

A normal print request inside a temporary chmod000 directory in the disposable
project failed process creation with OS permission denied13. Permissions restored
and empty directory removed. This establishes that specific OS boundary only;
sandbox escalation and approval UI semantics remain unverified.

The lexical fixture guard also rejected a shell documentation edit containing
its deny marker. This false positive illustrates substring scope, not shell
semantic analysis. File-edit tooling recorded these results without changing
the installed policy. Source unchanged;129pass/1skip baseline still applies.

Date: 2026-10-23, America/Denver. Full product incomplete. Documentation, released
source, offline tests and actual host observations are distinguished below.

## Environment and starting audit

macOS14.6 (23G80); Node24.22.0; installed codex-cli0.163.0; desktop
ChatGPT/Codex26.1016.62342 (21477). Latest stable CLI0.164.0 researched, not
installed. No native Windows host available. No credential stores/private
sessions inspected. Root private handoff and machine-specific logs stay ignored.

- `git status --short --branch`: clean initial local main6c59e98.
- Public API and `git ls-remote`: public main4f2c0be0e734cad5d4769c840c43e02e298cc053.
- `git fetch` and content diff: public contents identical except private handoff.
  Safe development branch created from public history; local history preserved.
- Baseline `npm test`:39 passed. CLI version and installation/removal help checked.

## Automated checks

- Metadata state: actual independent Node writer processes retain32 events;
  observer sees another process's write. Tests cover scopes, retention, cap,
  locks, cancellation, symlinks/hard links, private modes, sanitized metadata.
- Fixed rewrite: five tests, exact matching/opt-in/no mutation/preserved fields/
  deny/malformed inputs. These do not establish native permission enforcement.
- Probe:11 tests, real stdio subprocess MCP framing, bounded inputs/queue/output,
  resources, sanitized errors, aggregate metadata, snapshot collision/link
  refusal. UI bridge tests are simulated, separate from native observations.
- Native inspector:seven synthetic peer tests cover request whitelist, no action
  approvals, sanitized output, flooding/deadlines and POSIX descendant cleanup.
- Full suite after compatibility migration and inspector: **73 passed,0 failed,
  one Windows-only skip (74 total)**. Final review follow-up results recorded
  below. Validation:3 mods; replay:all shipped fixture responses valid.
- Packaging check before final inspector/doc additions:67-file archive,336367
  unpacked bytes. No root portable manifest, links/traversal, .git/.local or root
  private HANDOFF. Fresh extraction into a path with spaces passed66 tests plus
  one Windows skip, validation and replay. That archive is an intermediate
  local artifact, not the final released package.
- `.github/workflows/ci.yml` covers Ubuntu/macOS Node22/24 full offline suite and
  a limited native Windows protocol/package lane. Native Codex and Windows ACL
  behavior are not established by that workflow. Remote result recorded below.

## Installation, update and trust — actual host

Private config backup made before changes. Only owned marketplace/plugin entries
added; preexisting entries compared equal. Installation affects current Codex
user profile/cache, not solely the disposable project.

1. `node proofs/prepare.mjs`: reviewed private marketplace snapshot created.
2. `codex plugin marketplace add <snapshot-root> --json`:succeeded.
3. `codex plugin add claude-mods-native-proof@claude-mods-dev --json`:portable
   0.0.1 installed;22 source files matched cache. MCP appeared, **zero hooks**.
4. Read-only native app-server initialize, hooks/list and plugin/read confirmed
   that absence. Released0.163/0.164 loaders deliberately skip AgentPlugin hooks.
5. Supported remove/add replaced it with compatibility-only0.0.2 using
   `.codex-plugin/plugin.json` and `.mcp.json`, no portable root. Relative MCP
   cwd/args and an explicitly shared private data location resolved legacy
   parser differences. Old snapshots archived locally.
6. Inventory showed three enabled untrusted hooks; user then explicitly reported
   trusting the changed version0.0.2 hooks. Fresh native inventory independently
   confirmed PreToolUse, PostToolUse and SessionStart trusted,5-second timeout,
   MCP present, zero discovery warnings/errors.
7. Public utility `node proofs/inspect-native.mjs --project <absolute-disposable>
   --marketplace <absolute-marketplace-json>` subsequently succeeded against real
   CLI0.163.0 with the same sanitized result. No model turn/trust change performed.

The initial sandboxed app-server failed with Operation not permitted; approved
host inspection succeeded and cleaned up. Initial plugin/read directory argument
failed; supplying the actual marketplace JSON file succeeded. Neither error was
native hook execution failure. The earlier trust report on0.0.1 was insufficient
because no hook inventory corroborated it; the0.0.2 review resolves that ambiguity.

## Covered native tool behavior — actual desktop session

These were actual `exec_command` calls in the current desktop session, using the
disposable project and ordinary sandbox setting, not replayed fixture processes:

| Requested command | Observed result |
| --- | --- |
| `printf MODS_BEFORE` | `MODS_AFTER`, exit0 |
| `printf MODS_DENY` | PreToolUse rejection naming the harmless proof marker; no command execution |
| `printf MODS_UNCHANGED` | `MODS_UNCHANGED`, exit0 |
| `printf MODS_ACTIVITY` | `MODS_ACTIVITY`, exit0; new metadata activity |

Native PreToolUse/PostToolUse records appeared in the private probe directory.
The probe persisted only event/tool/denial metadata, not command contents.
Source corroborates that the rewrite is applied before ordinary permission
resolution; field-preservation tests pass. **A negative sandbox/approval test
has not been performed.** No assertion of arbitrary safe rewriting, normal
approval UI preservation, cancellation or elevated-access prevention follows
from this harmless success. Visibility of the rewrite's systemMessage in the
human transcript still needs separate confirmation.

A separate ephemeral `thread/start` through native app-server, without turn/start,
completed but produced no SessionStart notification/record during observation.
Do not call SessionStart verified or permanently unsupported on that evidence.
No extra model/API turn was launched. No selected model was changed.

## Plugin-owned UI — actual desktop

User opened “Claude Mods Native Proof” beside this chat and reported increasing
click count. Permitted MCP Apps inspection then independently observed:

- Host handshake: `chatgpt 26.1016.62342`.
- Actual local button click changed0→1. A later screenshot showed2 clicks.
- Explicit Refresh changed retained journal records22→29 after native activity;
  denial count1, PreToolUse/PostToolUse counts present. This is manual refresh,
  not automatic push/subscription and not the newer scoped-state library.
- Screenshot showed readable title/buttons/counts/metadata and privacy footer,
  with no obvious clipping at the observed panel size. Raw screenshot stays local.

Native app computer-use access itself was blocked by the tool safety boundary;
no bypass attempted. MCP Apps DOM interaction was supported. Native keyboard
input is unavailable through that interface; keyboard/screen-reader/resize/
reopen/teardown acceptance remains pending. The component is an MCP App, not
native chrome/transcript restyling. No button launched a model turn.

## Review and remaining boundaries

Independent review found a cancellation race in scoped observation (abort during
an awaited read could still yield one update); fix and regression are included
in the final review follow-up below. No permission approval or secret persistence
was found in reviewed proof paths. Source review is not a security guarantee.

The installed proof server's MCP initialize version still says0.0.1 while its
package version is0.0.2; this is recorded provenance debt. Do not silently edit
trusted installed code to fix it; align in the next reviewed snapshot/update.

Native hold/elicitation, cancel/timeout/failure behavior, routing runtime,
production install/removal/restoration, broader UI and native Windows remain
unverified. All capability rows remain in REQUIREMENTS; these proofs do not
complete the full product.

## Access, configuration and rollback

Installed proof:fixed local scripts, no network/model calls, bounded metadata
only. MCP reads only its explicit data directory and static HTML. Local hook/MCP
processes have OS authority distinct from the model-executed sandboxed tool.
No raw event arguments, transcript contents or credentials are retained.

The proof0.0.2 remains installed/enabled/trusted for continuation. Production
plugin is not installed. Source edits have not mutated the installed snapshot.
Supported removal commands checked and plugin remove/add exercised:

```sh
codex plugin remove claude-mods-native-proof@claude-mods-dev --json
codex plugin marketplace remove claude-mods-dev --json
```

Remove only owned entries. Stop affected sessions before deleting optional probe
data/snapshots. Do not restore the entire config backup over unrelated later
changes. Generated snapshots and backup include private paths and must stay
ignored. Source updates require explicit review/reinstall/human trust; no trust
hash or bypass was written. Exact private locations are in ignored root HANDOFF.

## Final checkpoint verification

Final local follow-up: cancellation regression fixed; targeted state suite12 passed,
0 failed,1 Windows-only skip. Full suite now **74 passed,0 failed,1 skipped
(75 total)**. Validation and replay passed again. Whitespace and public path/secret-pattern
scan found no new private-path or credential-shaped payload. Remote verification
is recorded after upload; no CI success is inferred from workflow presence.


Checkpoint source uploaded as [8bf70ae](https://github.com/HarryBurd33/claude-mods-for-codex/commit/8bf70aeebe5842be130395483daef9e832733ac7).
Terminal push could not authenticate; connected GitHub upload succeeded. Fetched
remote tree079fc8bd0973405318efd4ec2055ca22ba723f52 matched local exactly; ls-remote
confirmed branch commit. The equivalent original local commit is preserved on a
separate local branch, with no private history pushed and no force update.

[Initial CI run](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40008784397):
all four Ubuntu/macOS Node22/24 full suites succeeded. Actual Windows runner
portable tests:9 passed,1 failed because a skill-frontmatter assertion accepted
LF only while checkout used CRLF. The assertion now accepts both valid line
endings; targeted package tests4/4 pass locally. Follow-up remote result must be
checked independently; this fix does not claim native Windows Codex support.

Final source archive before this small test/docs follow-up:69 files,375552
unpacked bytes. Public docs/continuation/HANDOFF included; private root HANDOFF,
.local/.git/node_modules/links/traversal and portable root manifest excluded.
Fresh space-path extraction passed74 tests plus1 Windows skip, validate/replay.
The default npm cache was unwritable in the sandbox; a disposable cache resolved
packaging without repairing/changing system tools. A future release must rebuild
and verify its exact final archive.


**Follow-up CI passed** for tested code commit
[da8d01dd65b015455d5a1cb47b9e1d6aa7500e87](https://github.com/HarryBurd33/claude-mods-for-codex/commit/da8d01dd65b015455d5a1cb47b9e1d6aa7500e87):
[run40009074164](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40009074164)
completed successfully. This includes four POSIX full-suite jobs and the limited
Windows portable-contract job after the CRLF fix. It does not establish native
Windows Codex installation, hooks, process cleanup or private ACL storage. The
subsequent handoff-record commit changes documentation only. Local and remote
code trees were independently compared, and required public records were found
in the fetched tree.

# Sol Ultra stage — 2026-10-23

The human explicitly switched to GPT-6.1 Sol Ultra and resumed from verified
bf2960e on codex/astra-groundwork. Initial working tree clean. Same-stage workers
implemented/reviewed contracts, workspace reads and the hold proof. No additional
model/API test turn was launched; local callbacks/services make no model calls.

## New automated and review evidence

Production0.2.0-dev.1 now has typed opt-in exact command replacement, scoped hook
metadata, bounded MCP transport/dashboard and read-only Git project tools.
Contract tests cover immutable inputs, original/revised denial precedence,
conflicting proposals, permission-field preservation, structural failures,
privacy, default-off storage, session isolation and explicit project scope.
Workspace fixtures use actual macOS Git; one stalled executable is deliberately
mocked for process-deadline cleanup, not native Git evidence. UI bridge/hold peers
are synthetic and do not establish host rendering or human approval provenance.

Independent reviews fixed these concrete issues before checkpoint:

- A structural-clone failure after valid PreToolUse validation could escape with
  no decision. It now emits a sanitized explicit denial; subprocess regressions
  cover deep/node-limited unrelated fields and post-event fallback.
- Malformed MCP errors could bypass output bounds. All responses/notifications
  now share a bounded32-message/2MiB output queue and one timed write.
- Elicitation timeout/abort now sends cancellation notifications; pending maps,
  timers and callbacks are cleaned up. Host visual dismissal remains unverified.
- Native host request IDs could collide with pending UI response IDs; method
  classification precedes response lookup. Watch generation, teardown, navigation
  refresh and correct changes.files rendering are covered by simulated tests.
- Runtime settings require a private, unlinked file outside the selected project.
  This is a reviewed configuration boundary, not protection from arbitrary
  same-user local code. Paths are not accepted through UI tool parameters.
- A cleanup test compared shared temporary-directory contents and could fail when
  a parallel package suite created its own metadata. It now checks the exact
  temporary path used by its mocked Git process. The initial failed run is not
  counted as success; final rerun is recorded below.

Patch content is explicitly opt-in; filename exclusions do not scan every secret
inside otherwise allowed content. Git reads use temporary sanitized metadata and
ignore project/user helper configuration. Native Windows/private ACL work remains
unverified/unavailable. Source settings/native observer integration and new UI
have no production native-host acceptance yet.

## Native hold evidence and rollback

A separate hold-only0.0.3 snapshot was prepared and installed via:

```text
node proofs/prepare-hold.mjs
codex plugin marketplace add <private-hold-marketplace> --json
codex plugin add claude-mods-hold-proof@claude-mods-hold-dev --json
```

The user explicitly trusted its single MCP hook. The first exact harmless
`printf MODS_HOLD` printed MODS_HOLD before the new MCP server appeared in the
active tool inventory. After server availability, the next identical native call
held30s and was blocked by the hook's decision-deadline denial. The user reported
answering the form. Successful accept/decline handling and the reason for that
discrepancy remain unresolved; no human-acceptance claim follows. This provides
native held/timeout-deny evidence and a real connection/fail-open dependency.
No destructive operation or model turn was used.

The installed snapshot was not edited after review. After preserving a private
current-config backup, supported plugin remove and marketplace remove succeeded
for only claude-mods-hold-proof@claude-mods-hold-dev / claude-mods-hold-dev. A parsed
before/after comparison confirmed only owned hold-probe config entries changed.
Fresh-host loaded-tool/process absence is still unverified. Original Astra native
proof0.0.2 is preserved installed/enabled/trusted; production is not installed.
Private hold snapshots remain ignored. Reviewed source0.0.4 contains fixes and
requires a new snapshot/review/trust cycle before any retest; old trust is not
silently reused.

## Sol checkpoint verification

Final local suite, packaging and remote observations are appended before the
human-controlled switch. No workflow presence alone is called CI success.

Final Sol local run: `npm test` **127 passed,0 failed,1 Windows-only skip
(128 total)**; `npm run validate`3 mods valid; `npm run replay` all shipped
fixtures valid; `git diff --check` passed. Final focused transport/UI12 tests
include a real stalled-output deadline with synthetic streams; dashboard4 and
hold8 passed. All tests remain separate from native evidence.
Intermediate87-file source archive (519197 unpacked bytes) included .mcp.json,
compatibility manifest, UI and public handoff, excluded private roots/links and
portable root manifest, and passed clean extraction test/validate/replay. That
archive preceded final review corrections; final release must rebuild exact
source. A fresh checkpoint package/run is recorded separately if performed.


Verified Sol source checkpoint
[c6e4656beb39d8318701d3191cd84c8c06ea1a8c](https://github.com/HarryBurd33/claude-mods-for-codex/commit/c6e4656beb39d8318701d3191cd84c8c06ea1a8c).
Connected GitHub upload tree4c12b4d99dadc25d2fd4536f879e7d6232af653b exactly
matched committed local30904bc; original local commit preserved on its own branch,
working branch aligned to remote without force update. Public fetch/diff/ls-remote
independently verified branch/contents; working tree clean before this docs update.
Exact-source87-file package,522820 unpacked bytes: included compatibility manifest,
MCP config/UI and public continuation handoff; excluded private root handoff,
.local/.git/dependencies/links/traversal/portable root manifest. Fresh extraction
into a path containing spaces passed127 tests plus one skip, validate and replay.
[CI run40011272508](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40011272508)
was in progress when this record was written. Its actual result must be checked;
no CI success or native Windows result is inferred. This follow-up is docs-only.


# Sol High authoring and production-install milestone — 2026-10-23

Resumed clean at5bc8ef7 after explicit human switch to Sol High. Added scaffold
CLI producing disabled validated declarative config/access.json/REVIEW.md with
exclusive output creation; no executable generation, install or trust automation.
Tests generate/replay matching behavior for all three templates and preserve
existing paths/refuse symlink parents and invalid specs. Four original scoped
skills authored; Ruby YAML frontmatter checks passed. Bundled quick_validate.py
failed due absent PyYAML; no successful run of that validator is claimed.
Full local npm test:129 passed,0 failed,1 Windows-only skip (130 total).

Prepared a separate private production fixture, initialized its disposable Git
project, backed up current configuration privately, registered dedicated local
marketplace and installed claude-mods-for-codex@claude-mods-production-dev0.2.0-dev.1
through supported CLI. All94 cached files matched snapshot. Parsed before/after
config comparison showed only owned production marketplace/plugin changes.
Fixture deliberately enables only selected-project metadata, fixed print rewrite
and harmless deny marker, patches off. Public default configuration unchanged.
Human confirmed three-hook trust; read-only native inventory independently showed
three trusted/enabled hooks, no warnings/errors and declared MCP service.

Current chat did not yet expose new MCP dashboard tools. Actual native command
printf MODS_PRODUCTION_BEFORE returned MODS_PRODUCTION_BEFORE; DENY marker also
ran unchanged. This is NOT production hook execution success. Installed/trusted
CLI inventory does not establish current desktop connection. User asked to
restart Codex and resume this same chat before further marker/panel checks.
No extra model turn was launched. The panel has not been inspected and no new
production UI observation is claimed. Keep High until this integration is resolved.
