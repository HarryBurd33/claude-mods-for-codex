# Current status — 2026-10-23

**Full93-capability product incomplete. Source0.2.0-dev.9; installed0.2.0-dev.6.**
Human resumed Sol High from travel1ae63d1. Source9 corrects Windows directory pins
and adds an isolated process/object-security proof; no Windows project/settings/
restore activation. User has a Windows11 Codex computer available **later**.
Exact source/CI/remote identities belong in TEST-LOG and the final checkpoint reply.

## High Windows results

Metadata-only directory handles did not prevent live rmdir in Windows CI. The
production NTFS helper now requests FILE_LIST_DIRECTORY alongside metadata rights,
while still omitting share-delete. It does not enumerate ancestors. Insufficient
rights refuse; no ACL repair. Sharing violation32 alone has10attempts/90ms sleep
per handle; the existing whole-request/optional telemetry deadlines remain.

The original MIT unintegrated proof uses mandatory creation-time JOB_LIST and
HANDLE_LIST, kill-on-close ownership, explicit argv/environment, EOF stdin,
bounded output/deadline/cancellation and owned descendant cleanup including owner
death. A proof-only partial helper extension checks executable object ACLs/handles,
separate code/project roots, no-follow project-root metadata and private empty
scratch. No product code loads it, no new public execution operation, no Git run.
See [review](DEV9-REVIEW.md), [proof](../../proofs/windows-owned-process/README.md)
and [Windows boundary](../windows-storage.md). Failed candidates are retained in
TEST-LOG, including a corrected handle-number test and intermittent state failure.

Local full suite170pass/0fail/28Windows-only skips198total. [Source9 CI40043152081](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40043152081)
all7jobs passed: each Windows lane20storage+8proof, all4POSIX and portable Windows.
These OS results remain separate from native host acceptance. Native Codex
Windows11/WSL installation/events/UI/permissions remain unverified.

## Unchanged installed host and authority

Human-trusted dev6 remains installed/enabled in the macOS user profile. Previous
host macOS14.6arm64, desktop26.1016.62342build21477/Node24.22.0; systemCLI0.163.0
separate. No installation, machine settings/cache/trust, theme, observers, client
upgrade, selected model or logging scope/retention/export change. Actual installed
activity read returned4records/same revision. This chat is outside the selected
child logging project; never infer scope from a shell workdir/command or broaden it.
No extra model/API evaluation, subagent, REA or tool repair. Old single-run grant
is consumed. Local deterministic callbacks make no additional model calls;
ordinary selected-chat skill use consumes selected-model usage.

Installed6 native evidence remains six owned views/local preview/Clear, nested
files, selected diffs/passive counters, authored print rewrite/control/deny and
same-version remove/reinstall with125exact files/three trusted hooks. One preview
keyboard path and narrow/wide usability were human-confirmed. Full accessibility,
close-pending/reopen/loaded unload/disable/older rollback remain incomplete.
Earlier dev4 sandbox-negative and separate hold0.0.4 results are version-specific;
hold proof is removed and not a production approval gate. Optional observers off.

## Next milestone and model boundary

After final CI/readback, routine package/public-clone verification and native
acceptance preparation are suitable for **GPT-6.1 Sol, Medium**. Do not spend High
on those once the checkpoint is verified. Windows activation remains incomplete,
awaiting the later host's exact client/Git/ACL/dependency/sandbox inventory and
security/native acceptance. **Return to High before any Windows integration,
traversal, scratch-content cleanup or restore design/change.** The isolated proofs
are not a grant to remove a gate. No custom client/fork/app patch direction chosen.

Other incomplete rows remain in REQUIREMENTS: authoring/skill workflow gaps,
accessibility/lifecycle/rollback, user-selected themes and optional native event/
platform checks. Native checks requiring new model runs/optional registrations/
settings choices still need their own explicit authorization. Full product is not
finished; main remains the historical experimental MVP. Root HANDOFF/.local stay
private; original local history preserved; no force-push.
