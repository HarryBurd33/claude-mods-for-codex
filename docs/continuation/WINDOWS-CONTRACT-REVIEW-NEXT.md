# Windows inventory contract: concrete review boundary

Use GPT-6 Astra / Ultra for this consequential security decision, then return a
finite implementation contract to Sol High. This is source/evidence review only;
it authorizes no installation, Git execution on a Windows target, Codex/model trial,
trust/config change or replay of the completed Phase1/Stop operations.

## Established evidence

[Exact source cccb487](CI-REPAIR-2026-10-27.md) has four POSIX lanes and Windows
portable checks passing. Both Windows NTFS lanes retain the mandatory positive
failures; production source and the assertions were not relaxed.

| Current boundary | Evidence | Decision required |
| --- | --- | --- |
| Fixed `mingw64/bin/git.exe` positive | Directory segment1 Open returns Missing; official Git2.56 notes document a new internal prefix | Define an explicit versioned fixed-image family, with primary evidence and no PATH/recursive fallback; preserve the failed legacy evidence and make any acceptance migration explicit |
| Single-link image rule | `cmd/git.exe` later retained-handle metadata reports two links; installer source supports a possible optional wrapper alias | Decide whether a separately specified read-only inventory boundary can safely admit such objects; otherwise identify a genuinely conforming installation or retain the incompatibility |
| Executable and private-data authority | Existing strict policies still refuse; inventory samples confer no execution authority | Preserve these policies, normal permissions, all foreign-mutation refusals and no-execution claims |

Primary release/installer/runner links and exact CI observations are in the repair
record. Source on a mutable upstream branch is contextual evidence, not attestation
of the exact runner installation. A post-refusal observation is not an atomic cause.

## Required output before implementation

1. An explicit supported/read-only target and threat model: privileges excluded,
   same-user interference limits, selected scope, object/ACL/identity and sharing
   guarantees, retention, bounds, cleanup and refusal cases. Explain whether alias
   writes/deletion/security changes are prevented or only detected while the actual
   object is held, and what can still change between operations.
2. A narrow decision on the installed-image inventory policy. Keep private-data and
   executable admission separate. If safe support cannot be established, document
   the blocked capability; do not invent an implementation or green test result.
3. Exact source files and a finite Windows fixture/CI plan covering actual-image
   positives, hard links and unknown aliases, foreign mutation rights, reparse/wrong
   type/missing objects, descriptor/identity changes, partial acquisition and release.
   Tests must distinguish expected object-policy refusal from actual content success.
4. An explicit migration of any now-inapplicable fixed-path test contract. No silent
   deletion, skip, accept-either assertion, alias removal or copying of installed
   images to manufacture a positive. Keep prior failed source/run identities intact.
5. A review gate before using the new contract in the framework or claiming native
   Windows compatibility. Hosted CI remains OS evidence; Windows11/Linux/WSL host
   installation/events/UI still need their own acceptance.

Do not expand the observer/model/trust scope to solve this. After the Windows
decision, continue the existing consolidated macOS native/UI/authoring campaign;
the single Stop callback and source archive do not close that campaign. Keep its
remaining authority decisions together in one concrete packet. No extra human
approval is needed merely to read the committed source and return this review.
