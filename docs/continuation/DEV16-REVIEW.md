# Source16 review — positive source HEAD binding

2026-10-23. Human selected GPT-6.1 Sol High from verifiedfbce126. Full product
incomplete. Source16 uninstalled; installed human-trusted dev10, logging scope and
all production Windows settings/project/Git/restore before-IO gates unchanged.
Windows11 remains unavailable per latest reply; no repeated availability question.

## Concrete gap, contract and acceptance

Source15 validates a narrow index but source14's scratch commit was caller-supplied.
Original MIT GitSelectedMetadata.cs adds GitSelectedMetadataProof(selectedMetadata,
privateParent,bool exclude,CancellationToken), Path/Verify/Dispose. It binds scratch
HEAD to positive retained source HEAD and, for one symbolic form, the existing
loose refs/heads leaf. Mandatory index passes source15's strict projection; optional
exclude selection remains explicit. No arbitrary caller commit, ref override or
raw-index fallback. Production still compiles only PrivateStorage.cs.

Strict disjoint local root syntax and fixed paths are checked before IO. Source
HEAD uses original ProjectReadSetProof no-follow pins/single-link regular handle/
foreign-mutation ACL checks and no write/delete sharing. Accepts one exact lowercase
nonzero40hex line, or literal ref: refs/heads/... whose existing single loose file
contains that commit form. None/LF/CRLF termination accepted; no Trim, BOM, embedded
newline, NUL, non-ASCII, whitespace repair, chains or alternate ref namespaces.
Ref path max160ASCII chars/16segments; narrow literal components, no .lock/dotdot/
normalization/device/stream/alias escapes. Inherited secret/build-directory name
exclusions can refuse legitimate branch names; this is a disclosed conservative
proof subset, not full Git ref compatibility. No source path/ref names in diagnostics.

Inherited source reader bound is256KiB/file, with line parse cap512bytes; two
positive source files at most, in addition to original index32MiB/exclude1MiB.
The narrow parse limit is applied after the bounded source read, not represented
as a512byte IO limit. Missing HEAD/loose ref refuses; packed-only refs and unborn
HEAD remain unsupported. No negative existence/absence assertion, packed fallback,
ref chain traversal, directory enumeration or repository discovery. Dynamic ref
path is validated before opening that one leaf under the explicitly selected root.

HEAD and ref handles retained before index/scratch capture and verified before/
after composition. Source14 captured bytes retain their own index/exclude checks;
source15 projects directly in the same helper. Verify repeats held-source checks.
This pins positive objects only, not coherent repository or object database state.
Root/HEAD/ref/index bytes could be synthetic or malicious despite valid shape;
SHA1 repository configuration, ref/object identity/provenance/existence/type and
coherent history/worktree remain unverified. No actual Git process is launched.

Failure disposes metadata first and always releases ref then HEAD through nested
finally. Constructor's HEAD/ref clones clear in finally; inherited managed read/
verification temporaries and decoded strings are not guaranteed erased. No blanket
buffer-zeroization or secure-erasure/crash-memory claim. Source12 read-set semantics
unchanged. Five-second cooperative constructor/Verify checks cannot interrupt
blocked kernel IO; inherited operations have their own cooperative checks. Future
outer owned-helper deadline required. Single-consumer proof, no concurrent method-
call/thread-safety guarantee. Ordinary external writes/replacements are tested as
sharing refusals; hostile same-user mapped writes/admin races remain outside claim.

## Tests and observed-result plan

Nine new cases target detached none/LF/CRLF + projected index/selected exclude;
nested loose ref and source/ancestor replacement leases; malformed/oversize HEAD;
conservative ref syntax; missing/packed-only/chained/malformed refs; hardlinks,
junction ancestors, foreign write ACLs and existing writers; source lease release
on index parser failure; pre/post capture cancellation/root validation; external
owner death/source release. All fixtures synthetic private NTFS roots, no real
Git/project/credential/session/model/network access. Existing44proof+20storage
regress on Windows Node22/24. Local skips do not establish Windows success.
Exact observed CI source/results belong in TEST-LOG; this draft claims no OS pass.

No production event, tool, UI, setting, permissions or logging scope changed. Version
metadata16 only in package/manifest/server. No source16 install or human trust/restart
step. All93ledger IDs retained and incomplete as applicable. Normal POSIX dashboard
or explicit reviewed host edit remains available while Windows views are gated.

## Security review and remaining gates

All controlled root syntax before IO; dynamic ref syntax before leaf read. Each
source read set owns its own failure cleanup; successful object stored before
obtaining clone. Partial construction finally clears clones/releases leases even
if strict index projection fails. Metadata cleanup may refuse unknown entries,
but release of source handles still runs. No raw fallback, recursive cleanup,
ACL repair, stale-root adoption, unrelated reader termination or approval action.

No Git config/hash format, object database/provenance, linked worktree/commondir/
reftable/packed/unborn semantics or ignore engine implementation. No atomic full-
repository snapshot, source authenticity or proof that the selected directory is
an actual repository. Not all legal ref names supported; report unavailable rather
than partial successful listings. Actual Windows Git reader/write/temp/lock/loader,
unknown child-created content ownership, native permissions and separate restore
writer remain gated. Source15 parser/mapping-refused/8.3 limitations remain.
Live unowned readers may retain bytes and private empty hierarchy may remain after
owner death; unknown content preserved, not recursively deleted. No new IPC or
private content in arguments/environment/logs. Same32KiB request/3MiB response.

No machine change needs rollback. Remove disposable proof fixtures/checkout to
remove source16. Existing selective dev10 removal/rollback remains separate; never
edit installed cache/trust hashes or restore whole shared config/live locks. No
extra model/API evaluation, broader logging, observer/theme/client change or major
client/fork direction authorized. Next Medium after verified security checkpoint
for routine public-clone/archive/spaced-path verification; High before more gates.

## Primary evidence retrieved 2026-10-23

- [Git repository layout](https://git-scm.com/docs/gitrepository-layout), page lists
 2.49.0 update/unchanged through2.56.0, describes direct/symbolic HEAD, loose/packed
 refs and legal unborn state. This proof deliberately refuses several legal forms.
- [Git reference format](https://git-scm.com/docs/git-check-ref-format), page lists
 2.52.0 update/unchanged through2.56.0, describes reference path restrictions. The
 proof implements a narrower ASCII/Windows-safe subset, not the Git command.
- Previously retrieved Microsoft no-follow/handle/ACL/sharing/lifetime evidence
 remains in proofs/windows-owned-process/README.md and source12–15 reviews.
 No upstream code copied; original MIT implementation, independent-project status.
