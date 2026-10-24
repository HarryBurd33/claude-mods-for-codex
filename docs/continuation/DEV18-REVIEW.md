# Source18 review — read-only installed-code inventory

2026-10-23. Human selected GPT-6.1 Sol High from verified7848c97 on
codex/astra-groundwork. Full93product incomplete. Source18 uninstalled; installed
human-trusted10/cache149files equal immutable fixture and private settings hash
freshly unchanged. No logging, trust, install, model/API run or production gate
change. Windows11 remains unavailable per latest reply; no repeated availability
question. Windows CI is an OS proof, never native Codex acceptance.

## Concrete uncertainty and primary evidence

Prior original fixture proofs do not establish the installed Git object's pin
compatibility or static dependency names. Inspect two exact CI-installed files
read-only under the existing ProgramPins contract; never run those files or load
their DLLs. A refusal is useful evidence and never repaired or silently bypassed.

Primary sources retrieved2026-10-23:

- [Official runner Install-Git.ps1](https://github.com/actions/runner-images/blob/main/images/windows/scripts/build/Install-Git.ps1)
  uses C:\Program Files\Git paths. This moving main file supplies a candidate CI
  root, not proof about a user's installed Git. CI explicitly opts into that root
  and the fixed cmd/git.exe and mingw64/bin/git.exe leaves; no PATH discovery or
  directory scan. We do not run or copy the installer script.
- [Microsoft PE format](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format)
  documents image headers, file-backed sections and ordinary/delay import tables.
  The original MIT parser uses those offsets for a deliberately restricted static
  inventory. Static names do not establish actual loader resolution; dynamic loads,
  forwarding, API sets, activation contexts and dependency provenance remain open.

## Exact code contracts and access

`proofs/windows-owned-process/pe-imports.mjs`: pure peImports(Buffer), no filesystem,
execution, imports of external packages or network. At most32MiB; DOS/PE/COFF and
PE32/x86 or PE32+/x64/ARM64 subset;1..96sections,0..16data directories. Bounded
header/section spans refuse overlap, overflow, out-of-file and virtual-only data.
Ordinary/delay descriptor directories max1MiB,128nonzero descriptors each, required
zero terminator; only delay RVA attribute1 supported. DLL ASCII basenames max120
characters, max64case-folded unique names combined. Names require a .dll suffix;
no path expansion/resolution or loader call. Output only declared machine/format/
sorted ordinary and delay names; fixed error on any unsupported/malformed input.
No function/thunk/resource/signature parse or whole-image loader validity claim.

`Harness.cs` new test-only run inventory-pin: existing ProgramPins verifies/pins
explicit code root/ancestors/executable and disjoint selected disposable project,
then emits pinned and waits for owner stdin/EOF before disposing. Fixed refused
status on IO refusal. No file-content/version read or executable launch in that
mode. ProgramBoundary.cs/OwnedProcess.cs/production helper unchanged.

`test/windows-owned-process.test.mjs` pinnedInventory owns that helper,15s outer
timer/128char stdout/8KiB stderr bounds, requires readiness before open. On refused,
no image content read and no PE/hash result. On held, one regular/single-link file
handle and prebounded32MiB allocation, exact positional reads plus EOF, stable
dev/ino/size/mtime/ctime sample. Clears its owned byte buffer after hash/parse and
closes file before release; fixed expected frames and no helper stderr. Read bytes
are not published. SHA256 identifies sampled bytes, not authenticity; version is
explicitly not queried. Public diagnostics only fixed relative target, pin/read
status, bounded byte count/hash/static metadata and unverified labels. No full
paths/ACLs/SIDs/environment/secrets/session data. No production API integration.

Node file open follows a pathname while existing native no-follow pins retain the
exact name chain/file against ordinary replacement and incompatible writes. This
does not certify writable mappings opened earlier, hostile same-user/admin actors,
atomic snapshots, signature trust, directory additions or full dependency closure.
Stat sampling is not a proof against changes restored between samples. Refusal
before read is tested separately from successful reads. Parsing is synchronous and
bounded, not a general safe executable loader. No image execution occurs.

The15s owner timer requests helper termination; preflight/read kernel IO may still
be pending asynchronously. No universal15s bound/interruptible-driver claim. Parent
death closes stdin, not an additional creation-time owner job. Existing source17
job fixtures remain separate; the untrusted Git images are never processes here.

## Tests, observed outcomes and limits

Eight portable synthetic parser tests: PE32/PE32+/ARM64 metadata, absent directories,
header/architecture/size refusal, section overlap/virtual-tail/overflow, directory/
descriptor limits/termination, unsafe/nonASCII/unterminated names, delay VA/reserved
attributes and unique-name/case bounds. No downloaded binary fixture or DLL load.

Two new Windows OS cases: original compiled CLR image read with retained pins and
write/file+directory rename refusal then release; unsafe foreign-write ACL refuses
before image read. CI installed-file inventory records either held/read or explicit
policy refusal per fixed target. A passing inventory test means the evidence
protocol held, never that Git passed security checks. CI enabled only by explicit
CODEX_MODS_CI_GIT_ROOT; otherwise that installed-file case skips. No user host scan.

Local node --test test/pe-inventory.test.mjs:8pass/0fail/0skip.
Targeted parser+OS suite:8pass/0fail/64Windows-only skips72total.
npm test:178pass/0fail/84Windows-only skips262total; npm run validate3mods;
npm run replay4fixtures; git diff --check clean. Source [f8290ef](https://github.com/HarryBurd33/claude-mods-for-codex/commit/f8290ef7289d3dba16397b2bf8092c089b0d6a86),
[CI40064711984](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40064711984):
all7jobs passed. Both decoded Windows Node22/24 logs read:20storage+64proof tests
per lane,0fail/0skip. Both fixed Git candidate paths returned pin=refused/dataRead=false
in both lanes. No image hash/import list/version was obtained; the generic pin
boundary does not distinguish absent/path/ACL/sharing refusal. The original compiled
fixture passed held-read/write+rename refusal/release; unsafe ACL refused before
image read. Previous mapping diagnostics still mapping-refused; altered-byte/mtime
and8.3 remain unverified. OS evidence is separate from Windows11 Codex/Git execution.

No native Windows11 Codex, actual Git execution/loader/approval/installation claim.

## Remaining gates and rollback

Every production settings/project/Git/restore Windows before-IO refusal remains.
Keep repository config/hash-format/object identity/freshness/ignore, actual binary/
loader dependency trust, enclosing preflight/transport ownership and explicit writer
acceptance separate. Static imports alone cannot justify executing Git. Source17
timer/mapping/8.3/live-reader/unknown-content/retention limits remain as recorded.
All93requirements retained; PL-04 still unverified. No current client cache/trust/
settings/logging change or extra model call. No machine rollback required; removing
new source/proof fixtures removes this uninstalled work. Never edit installed cache
or trust hashes. Medium may package verified source; High required for new gated
security/integration. Native Windows11 inventory later precedes executable choices.

## Actual CI record and handoff decision

Tested commit f8290ef7289d3dba16397b2bf8092c089b0d6a86,
tree cd3efdbb83cba58628c52d9f6ed2f238c8e99558. Expected-parent/nonforce upload,
fetch/full-tree equality and anonymous ls-remote verified. Equivalent local
5c73cbbf1feadc7a9d3709d74cc34801e4d38be2 retained on
codex/dev18-inventory-local-checkpoint. Both actual decoded job logs read:
120785412717(Node22),120785412597(Node24). Windows Server2025 image
windows-2025-vs2026 version20261021.278.1; run completed2026-10-24UTC
(2026-10-23 local workspace date). Four full POSIX lanes and portable Windows also
success; portable lane explicitly runs all8new parser tests. No retry or fix.

Do not equate the successful evidence-protocol test with passing Git trust. Both
fixed candidates refused at the unchanged ProgramPins boundary; no content read,
version/hash/static import result, independently verified presence or exact failing
ACL/path/sharing check. Do not guess the cause or weaken policy. A later High
investigation may add narrowly scoped fixed-stage diagnostics without sensitive
ACL/path dumps. This is an open integration blocker, not permanent impossibility.

The retrieved official runner installer also sets system-wide Git safe.directory
and GCM policy. We did not execute Git or inspect its effective configuration;
that source is a lead for later configuration isolation, not an observation about
this image's effective settings. Installed executable/DLL provenance and actual
loader resolution remain unverified even if future object pins succeed.

Local host macOS14.6/Node24.22.0/npm11.19.1. Source18 is still uninstalled; installed10
149files/private settings hash freshly unchanged. All93requirement identities and
order compared with7848c97, no changes. Production source diff is only MCP version18;
hooks/UI/config/skills/Windows primitives unchanged. Final notes-only checkpoint
identity is independently recorded after readback in reply/latest ignored handoff.

High security milestone is complete as a bounded inventory/refusal proof. Next
human GPT-6.1 Sol Medium should verify anonymous clone/package/extraction/hygiene,
then checkpoint and stop for High before diagnosing or integrating Windows security.
Do not activate gates, install source18, automate human trust or run a model test.
