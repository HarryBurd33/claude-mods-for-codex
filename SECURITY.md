# Security policy

Source20 POSIX state acquisition uses a1000ms no-observed-handoff allowance and
2500ms total checked budget. Only validated private lock-object identity changes
may extend contention waiting; no stale-lock stealing, event retry or additional
persisted metadata. Pending filesystem IO/critical-section sync is not universally bounded
by that schedule. Windows policy and installed dev10 are unchanged. See
[review](docs/continuation/DEV20-REVIEW.md).

## Supported versions

Until the first stable release, the default branch remains an experimental MVP.
Current expanded development/security work is on codex/astra-groundwork; it is
not a completed stable release. Consult continuation/STATUS and the exact version.

## Report a vulnerability

Please use GitHub's private vulnerability reporting feature for this repository. Do not open a public issue containing an exploit, private path, credential, transcript, or other sensitive data. If private reporting is unavailable, open a minimal issue asking the maintainer for a private contact channel without including vulnerability details.

## Security boundary

The dispatcher is an advisory policy mechanism. It does not replace Codex permissions, sandboxing, hook trust review, operating-system controls, or human review. A host hook failure or timeout may allow an operation to continue. The lexical guard does not parse shell syntax and cannot cover hosted or specialized tool paths that do not invoke the hook.

Configuration is data, not executable code. The release has no dynamic module loader, remote configuration, network client, install script, approval automation, or prompt rewriting. New mod implementations are reviewed source registered in `src/mods/registry.mjs`.

Journaling is disabled by default and accepts only strict event/time/tool/deny
metadata. Storage uses only the explicit configured data directory (native
PLUGIN_DATA or reviewed CODEX_MODS_DATA_DIR override); no session discovery or
prompt/transcript/argument collection. POSIX directories/files require current-
user ownership and private0700/0600 modes. Source7 Windows uses fixed local NTFS
handle/ACL validation and protected user/SYSTEM/Administrators descriptors at
creation; mode bits are never Windows privacy evidence. Unsafe existing access,
reparse points, hardlinks, unsupported namespaces and network storage refuse.
The helper runs with local process authority, distinct from a model-executed
sandboxed tool; normal OS/helper policy still applies. No elevation/ACL repair/
execution-policy override. Trusted administrators/hostile same-user processes are
outside the isolation claim. See[Windows storage](docs/windows-storage.md).

Reports create no selected-project/data files and retry cooperating writes boundedly.
A private cooperative lock serializes writers; a killed writer can leave it behind.
Never steal a live lock. Stop all writers and inspect the explicit selected path
before any separate human stale-lock removal. Windows optional hook storage shares
1500ms+500ms cleanup; failure cannot replace a dispatcher decision. Codex host
crash/timeout fail-open limits still apply. Fixed helper compiles only public package
source; compiler-managed scratch contains no request/config/private file bytes.
Windows dashboard settings/project/Git/restore remain before-IO refused pending
separate native security validation. Windows OS CI is not native Codex acceptance.

Development source0.2.0-dev.3 also offers explicit selected-commit inspection and
a separate POSIX one-file restore CLI. Inspection is read-only. Restore plan
creation writes both selected file versions to a private0600 file outside the
project; it contains sensitive content/base64 and a machine path. No such content
belongs in telemetry or public logs. Review/apply re-derive it from validated local
Git objects, and apply requires an exact reviewed plan ID and fresh current-file
match. A plan ID identifies content; it is not human authentication or native
approval. There is no mutating MCP tool or dashboard restore action. Normal host
tool permissions apply when the CLI is invoked. In-place writes preserve existing
file metadata but can be interrupted; both versions remain for explicit recovery.
No automatic lock stealing, force apply, permission weakening or recovery write
is provided. See [restore limits and recovery](docs/replay.md). Native Windows
restore refuses pending private-plan ACL support; same-user races are not an OS
sandbox. This source is not an installed/released restoration guarantee.

Source0.2.0-dev.4 can optionally read one reviewed private usage export outside the
selected project. This file may contain prompts/tool output; only whitelisted
numeric counters and availability/provenance descriptions are returned. No raw
session discovery, identifier/content logging, network, price lookup or keepalive.
Reported completion snapshots are not summed, since the released CLI copies
cumulative thread totals. Source completeness/authenticity is not attested; missing
values stay unavailable and default zero counters are not evidence of free use.
The original blast-radius example is disabled by default, lexical and deny-only.
It neither measures target scope nor approves/holds calls; documented misses and
false positives remain. See [impact and usage](docs/impact-and-usage.md).
