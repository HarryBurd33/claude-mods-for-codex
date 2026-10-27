# Reviewed CI candidate: A, C, then B

2026-10-27. Implementation follows the
[Astra contract](ASTRA-CI-CONTRACT-2026-10-27.md) from baseline `3338b82`.
This is a development candidate. Its first new-source CI results must be recorded
separately; the earlier `8219ca2` result remains 3 passing jobs and 4 failures.

## A: fixed-fixture observation

Settlement continues through an unavailable EPERM sample within the same two-second
budget and ten-millisecond nominal cadence. It checks expiry after every delay
before another probe. Only a later actual ESRCH can establish absence; persistent
EPERM remains unavailable and fails. The new EPERM counter retains intermediate
uncertainty. Other errors, invalid identities and Windows refusal remain terminal.

The observation APIs, cleanup signals, original unresolved-group report and real
readiness/inspection absence assertions remain unchanged. An isolated event-loop
stall regression checks that expiry prevents another probe. This does not establish
all-descendant cleanup or explain the exact earlier CI kernel state.

## C: child ownership and measured failure

The test harness tracks spawned children through actual close and tracks outstanding
fixture I/O. The affected metadata flows propagate the test signal before/after
operations. Timeout, abort and output failures request termination of the owned
child, reconcile within the original lifetime and retain unresolved state instead
of reporting successful teardown or waiting indefinitely. Shared recursive cleanup
refuses while a child, write or uncertain effect remains.

The unchanged public storage transport can reject before its helper closes. In this
isolated Windows test process only, a restored Node builtin spawn wrapper also
registers those helpers and taskkill children. A transport result with a still-live
captured child stops the fixture scope and prevents deletion. A normal policy
refusal after actual close remains a normal negative result. Production transport
source is unchanged; this test interception is not a shipping extension mechanism.

Maximum-size success, oversized index refusal and oversized exclude refusal are
independent tests with distinct synthetic roots. All keep their original maximum
bytes and 45-second test limits. The five-second cooperative operation checks,
15/20-second parent bounds, byte equality and flush behavior remain unchanged.

Source acquisition/read/verification, scratch layout, write, flush and disposal now
emit bounded closed phase/timing frames for the selected proof modes. Failure and
acquisition paths retain diagnostics too. The parent exports only validated frames
and a flag for invalid/incomplete input; it does not print arbitrary stderr. This
adds evidence, not a performance fix or an interruptible-I/O guarantee. A future
maximum-size failure remains a failure requiring its measured next step.

## B: explicit linked-image digest profile

The proof-only `LinkedInstallerInventory` profile reads and hashes through its
retained native file handle. It requires local NTFS, scoped normalized paths,
directory/descriptor checks, a regular non-reparse file, 64-byte–32-MiB size bounds,
nonzero link count and the existing read-only sharing mode. Before/after/final
checks retain object identity, selected path, attributes, length, write time,
link count and descriptor policy. Changed/unavailable observations discard results.

The helper emits the bounded SHA256/size/link-count receipt only after validation
and normal release. Missing release, nonzero exit, cancellation, invalid control or
malformed/partial frames cannot become an accepted sample. The parent does not
reopen the path or map Node identifiers to Win32 identifiers. PE analysis is
explicitly **not performed** by this profile.

Shared production `Info`, private-data rules, executable admission and the old
StrictCode/InstallerInventory profiles are preserved. Synthetic linked objects must
still be refused by those old policies. This new profile cannot authorize execution,
certify provenance/DLL closure or establish native Codex compatibility. The threat
model and alias/privileged-interference limits remain those in the Astra contract.

The modern mandatory installed-image contract explicitly selects
`git-for-windows-ucrt64-v1`: `cmd/git.exe` and `ucrt64/bin/git.exe`.
Both must yield accepted digest samples; refusal fails the positive. This replaces
the obsolete mandatory cmd/mingw64 parent-read/PE contract, whose failed commits/runs
remain preserved. The old APIs and synthetic refusal fixtures remain. There is no
PATH search, existence fallback, image execution, alias removal, ACL repair or
copying of installed images to make acceptance pass.

Windows tests cover linked/single-link positives, actual retained writers/mappings
through both names, selected-name protection, other-alias topology observations,
attribute/descriptor changes, foreign grants, wrong-kind/missing/reparse objects,
scope/selector refusal, cancellation/EOF/invalid control and helper death.
Contender setup must succeed before its negative can count. These Windows cases
are source-prepared, not verified by macOS skips.

## Verification and review

| Check | Observed local macOS result |
| --- | --- |
| A focused diagnostics/reliability |15 passed, 1 Windows-only skip |
| Final lifecycle/frame checks |8 passed |
| Assembled `npm test` |392 passed, 0 failed, 123 skipped; 515 tests, 16.639 seconds |
| Validation/replay |3 mods valid; 4 fixtures replayed |
| Shared production source |No `src/**` diff |

The first A regression run failed because an encoded URL pathname was used in a
directory with spaces. `fileURLToPath` corrected it. A generated import-alias syntax
error was corrected before execution of the Windows test file. Failed and passing
logs are retained privately; neither was a CI retry.

Implementation used human-requested GPT-6.1 Sol / High. GPT-6 Astra / Ultra reviewed
the actual diff before Windows CI. Its initial gate found three blockers: hidden
storage-helper closure, lost failure diagnostics and a stdin-after-refusal race.
All three were corrected; the targeted follow-up passed the gate for the first
exact-source Windows CI run. Review performed no tests or native execution. No C#
compiler was available on this Mac; compilation and actual OS outcomes remain CI
gates. Future CI results must be attributed to their exact commit.

No installed plugin, native trust/configuration or model trial changed. The Phase1
grant and human-present Stop trial remain spent. The broader native/UI/authoring,
Windows11/Linux/WSL and frozen release milestones remain open. This source candidate
is not a completed release or full Windows support claim.

## First actual CI and targeted integration correction

Exact source `3412f417381192a5074547e902dcab6620389fa1` /
[run40556019173](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40556019173)
finished with **5 passing jobs and 2 Windows NTFS failures**. All Mac/Ubuntu lanes
and Windows portable passed. Both Windows lanes passed 25 storage checks and
96 process checks, with one failing process test out of 97. The sole failure was
`holder.check is not a function` in the old read-set holder, which still returned
its earlier interface while the shared finish helper now requires lifecycle methods.

Both actual modern installed-image positives passed in both Windows lanes:
`cmd/git.exe` reported 2 links/45,400 bytes, and `ucrt64/bin/git.exe` reported
4 links/4,413,272 bytes. Each produced a digest with PE analysis not performed.
The synthetic linked-object/writer/mapping/negative cases, full-size metadata and
split oversize checks also passed. These are actual runner observations, not Mac
skips, production Git execution or Windows11/native Codex acceptance.

Mac Node22 recorded one EPERM during each fixed-fixture settlement, followed by
actual ESRCH at 1032/1037 ms. Node24 observed ESRCH at 1027/1048 ms without EPERM.
The original unresolved-descendant reports/assertions remained unchanged.

The correction moves the old read-set holder onto the same lifecycle helper,
preserving its 20-second lifetime, 5-second readiness limit and output bound.
It restores the required interface instead of making its check optional. The
portable lifecycle/frame checks passed again (8 tests), and syntax checks pass.
The full local suite was not repeated for this Windows-only creator change; new
exact-source CI is required. Astra Ultra reviewed this targeted diff and passed
the new-source Windows CI gate. No failed run was retried or erased.
