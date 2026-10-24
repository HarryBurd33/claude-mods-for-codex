# Source15 review — strict index projection proof

2026-10-23. Human selected GPT-6.1 Sol High from verified65743d9. Full product
incomplete. Source15 is uninstalled; installed human-trusted dev10, logging scope
and all production Windows settings/project/Git/restore gates remain unchanged.
No Windows11 host is available per latest reply; no repeated availability question.

## Concrete gap and contract

Source14 copies opaque index bytes inside one helper. Source15 adds an original
MIT binary-format projection before an explicitly selected proof-only scratch use.
No Git implementation code is copied. Production still compiles only PrivateStorage.cs.

ProjectSha1IndexV2Proof(byte[],CancellationToken) in GitIndexProjection.cs returns
an owned extension-free byte array. It performs no IO and mutates no input. Caller
must clear its returned bytes. Max input32MiB;10000entries;1024UTF8 bytes/200UTF16
units and16segments per relative name;64optional extension frames. Strict SHA1/v2
only, stage-zero regular0644/0755 files with nonzero object IDs, valid name lengths,
zero padding, unsigned-byte path order and valid nanosecond fractions. Assume-valid,
merge/extended flags, v3/v4, symlink/gitlink/sparse modes are refused, not rewritten.

Copies the bounded input before checksum/parse so parsing and checksum refer to
the same owned buffer. This is not an atomic multi-file repository capture or
SHA1 authenticity/provenance. Constant-size checked offsets/lengths and bounded
entry/extension loops;5s cooperative cancellation checks, no fallback cryptographic
provider/policy bypass. SHA1 identifies only this explicit wire-format assumption;
caller still must establish actual repository hash format/config/provenance.

Names require strict UTF8, literal relative forward-slash syntax, no dot/dotdot/
.git/empty component, Windows device/stream/normalization aliases or control/format
code points (including supplementary Unicode). Case-insensitive name and file/
directory-prefix collisions refuse. An inert dummy root checks syntax only: no
actual filesystem identity, ignore/secret selection,8.3 or root-length acceptance.
Real selected project roots/handles still require separate validation. Sensitive
names are not a directive to read their files; this parser reads no project file.

Checksum covers the complete captured input. Optional frames are bounded and their
signatures unique, but payloads are never interpreted. Every optional extension is
omitted from output; a fresh checksum covers only header+entries. Mandatory/unknown
non-uppercase-first-byte frames, duplicate/truncated/overflow framing or surplus
bytes refuse. Unknown optional payload correctness is deliberately not claimed.
No permission/trust or source file is changed by this projection.

The existing GitMetadataCaptureProof constructor retains its raw proof behavior.
A separate explicit final bool projectSha1Index overload requires index selection,
runs the strict parser before scratch creation, passes projected bytes directly to
GitMetadataScratchProof and clears the projection immediately afterward. Original
source bytes/held handles remain for verification/lifetime. No retry using opaque
bytes after a parser refusal is allowed for a future strict caller. Old raw fixture
passes are separate evidence and cannot certify a projected index.

## Tests and evidence plan

Nine new Windows OS proof tests cover empty/regular/Unicode and real macOS-Git-
generated synthetic index; checksums/header/count/version corruption; flags/modes/
zero IDs/nanoseconds; name lengths/NUL/padding/invalid UTF8; ordering/case/prefix/
traversal/Windows aliases; optional stripping/mandatory and malformed framing;
entry10000/input32MiB boundary, overflows/cancellation; retained-source scratch
projection/parser-refusal cleanup; external owner death/source release. All prior
35proof and20storage tests must regress on Node22/24 Windows lanes. Local macOS
skips are not Windows passes. Exact observed CI identity belongs in TEST-LOG.

Original deterministic golden fixture test/fixtures/git-index-v2.json was produced
using reviewed existing /usr/bin Git2.39.5 AppleGit154 in a disposable empty-template
repository. Global/system config suppressed, hooks/fsmonitor disabled, no shell,
network, credentials, user files or prompts. hash-object of one fixed original
synthetic string, update-index --index-info for two fixed names, ls-files --stage
roundtrip passed. All stat UID/GID/time/device fields confirmed zero before export.
192bytes, SHA256281ad5169c46eacf899af357b5042cd14dfaa9c995f15db70ee57458f86c25e8.
This is macOS producer/reader evidence, not Windows Git executable/loader acceptance.
Independent JS fixtures encode the published format; they do not invoke Git.

## Security review and limits

Whole parser input bound before clone; checksum before entry interpretation; offsets
checked before reads; additions limited by remaining bytes; no extension payload
allocation, decompression, recursive parser or IO. Private managed clone/result
buffers clear on failure; capture clears projection in finally. Names decoded into
managed strings and digests cannot be guaranteed erased; no secure-erasure/crash-
memory claim. Returned bytes are local/private by contract; only synthetic harness
length/hash is printed. Pure harness reads explicitly selected synthetic fixture
bytes, not production/private project data. It grants no new public operation.

Real Git has not consumed this C# projection. No actual Windows Git/parser attack
surface safety, source HEAD/ref/config/object provenance, index/worktree/commondir/
reftable/split/sparse compatibility, ignore semantics or coherent snapshot proof.
Source object freshness remains positive-file metadata/byte checks only. Optional
accelerator removal may change performance/auxiliary UI history; future read-only
listing/diff caller needs actual Git semantic acceptance, never a writer use.
All current optional/mode/version exclusions need explicit unavailable alternatives,
not silent partial listings. Existing POSIX dashboard or normal reviewed host edit
remains the practical alternative while Windows views stay gated.

No loader/executable/unknown child-created-content cleanup/native permissions or
restore gate is closed.5s checks cannot interrupt kernel IO/hash calls; future
owned outer helper deadline needed. Live unowned readers may retain scratch bytes,
unknown entries preserved; no recursive cleanup/adoption or isolation from hostile
same-user/admin processes. Previous mapping-refused outcome and8.3 uncertainty stay.
No install/config/trust/logging or additional model/API test run. No rollback needed
for machine state; remove checkout/proof fixtures. Never change installed cache or
trust hashes, expand logging scope or auto-approve a call to make acceptance pass.

## Primary evidence retrieved 2026-10-23

- Git [index format](https://git-scm.com/docs/gitformat-index), page lists2.55.0
  format update and2.56.0 unchanged: header, entry ordering/fields/padding/checksum,
  optional-first-byte rule and distinct split/sparse/extended interpretation.
- Official [v2.56.0 read-cache.c](https://github.com/git/git/blob/v2.56.0/read-cache.c)
  corroborates extension categories. Read as evidence only, no GPL source copied.
  Initial v2.47.0 retrieval was superseded by the retrieved v2.56.0 source.
- Existing retrieved Microsoft handle/ACL/sharing/lifetime evidence stays in
  proofs/windows-owned-process/README.md and DEV12–14 reviews. This milestone
  does not infer released/native Codex support from a source field or OS test.
