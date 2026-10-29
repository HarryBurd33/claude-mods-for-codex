# Trust-hash format repair and fresh packet — 2026-10-28

The stopped batch exposed a preparation-helper defect: it required bare64hex,
while the actual native trust record used `sha256:` plus64 lowercase hex characters.
The old packet, source snapshot and seven-file seal remain unchanged. Its approval
is spent. No trial was rerun for this repair.

## Minimal correction and regression evidence

[proofs/native_trust_format.py](../../proofs/native_trust_format.py) defines the exact
canonical encoding predicate for the selected observed CLI trust-state format. The
new private helper embeds the same function; AST comparison verifies equality.
Only an added exact owned trusted_hash field can use it. Changed/removed baseline
values, unrelated fields and structural drift still refuse. The predicate does not
approve code, manufacture native trust or weaken native permission checks.

[proofs/native_trust_format_test.py](../../proofs/native_trust_format_test.py) runs
with the packet's bound Python using `-I -S`: two unittest methods cover20 vectors.
Canonical forms pass; bare/wrong-prefix/short/long/type/case/non-ASCII/whitespace and
control-containing forms fail. This is an offline Python preparation utility, not
an added production Node dependency or native CLI feature.

Eighteen full-helper config-check invocations reproduce the old native-shaped TOML
failure, pass it after correction and reject other encodings, other hook keys,
changed baseline values, unrelated empty tables and owned permission additions.
A separate18-invocation helper regression checks the revised packet's staging,
removal, clock, metadata-reader and preservation boundaries with synthetic fixtures.
These are new revision regressions, not repeated native/UI/archive/Stop campaigns.
No broad suite, package rebuild, new native result or CI pass is claimed.

## Independent security review and fresh bindings

An independent reviewer dispatched as GPT-6 Astra Ultra returned conditional
approval readiness for four exact revised artifact digests, checked against the
[revision2 seal](NATIVE-TRUST-FORMAT-V2-2026-10-28.json). Dispatch is recorded, not
independently attested backend identity. Reviewer performed reads/hashing only;
parent ran the tests. The reviewed helper change is limited to the format predicate
and its exact-owned-new-leaf use. Old baseline leaves and empty-table structure remain
preserved. The new baseline includes the prior trial's retained trust records without
copying them as trust for the new hook.

The [single fresh packet](NATIVE-CAMPAIGN-PACKET-2026-10-28.md) binds new canonical
private fixture/data/config/declaration paths and fresh one-use state. The unchanged
40-file source snapshot and selected runtime identities are reused. New source/input
preflight and cache-cohort checks pass. The new project/data are empty, declaration
absent, and no BATCH/ATTEMPT exists. Nothing is registered or launched. Native user
configuration/trust and permission controls were not written or restored.

Bounds remain15minutes, at most3manual native startups and2SolHigh turns, with
actual project/model/compatible permission readback and personal native trust before
any model prompt. Old approval cannot authorize this revision. Held-call NM-1,
routing, installation/authoring-chain, platform and full-product acceptance remain
excluded; all93 ledger dispositions unchanged. Only a new human decision can authorize
execution. Private source/helper/test/review artifacts are retained in the existing
checkpoint; sanitized GitHub publication is verified by commit/tree/file readback.
