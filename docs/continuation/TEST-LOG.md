# Continuation verification log

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
