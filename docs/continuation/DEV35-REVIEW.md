# Source35 hook metadata classifier —2026-10-25

Latest continuation: [proposal35.1](NATIVE-READINESS-DEV35.md) is source-only and
inspector-unimplemented; no native/config/inference/install grant. Classifier source
and its eight pins remain unchanged.

Current continuation: [PACKAGE-DEV35](PACKAGE-DEV35.md) and [CI-DEV35](CI-DEV35.md) record later exact-source verification. The original pending directions below are historical; native admission remains closed.

Sol High resumed a2e09fe. Source0.2.0-dev.35 corrects the prepared native preflight's
blanket refusal of nonempty hooks metadata. No installed configuration, trust,
logging, model, profile or Windows guard changed. Native execution remains
unconditionally closed. Full93/native routing/platform acceptance incomplete.

## Change and security boundary

New pure proofs/routing-native-hooks.mjs classifies the pinned CLI0.164.0
HooksToml/HookStateToml representation. routing-native-plan.mjs calls it instead
of treating every nonempty hooks table as executable. No filesystem discovery,
hook execution, approval emission, config mutation, model/network call or new tool.

Accepted forms: omitted table, empty object, state map with known well-typed
metadata, and empty arrays for the exact14released event names. State entries
may be empty or contain enabled(boolean), trusted_hash and trusted_content_hash
only. Fingerprints are bounded opaque printable ASCII, not validated approvals
or a claim they match a current definition. Identifiers are never opened as paths.

Project bounds:256state entries,1–4096UTF16-code-unit nonblank well-formed IDs,
no control/format characters; fingerprint1–256visibleASCII characters. These are
narrow project preflight limits, not claims of native schema maxima. Existing
protocol4,096node/24depth/frame/message/byte limits remain unchanged.

Refused forms include unknown table/state fields, malformed/null/falsy scalar/
array shapes, any nonempty event handler group (even with disabled/trusted state),
wrong enabled/fingerprint types, excessive/blank/control-bearing data, accessors,
custom prototypes, symbols and sparse arrays. No fields are stripped to pass.
Falsy malformed hooks previously slipped through the truthiness check; they now
refuse. Known empty event defaults are no longer mistaken for executable groups.

Metadata classification is neither hook discovery nor execution authority. It
cannot prove absence of external/project/managed hooks or effective native export
compatibility. Those remain independent before future activation. A stored trust
fingerprint is not this chat's grant. Unconditional admission gate/driver/input/
adapter/defaults/MCP/sandbox/permission/cancellation guards remain byte-unchanged.
Only the prepared classifier, tests/portable test list and source version metadata
changed; source35 is uninstalled. Existing actual-handler negative now uses a
nonempty synthetic definition, with all14event names tested independently.

## Primary contract

Previously retrieved pinned released source
[HookStateToml/HooksToml schema](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/core/config.schema.json),
[event names](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/lib.rs#L24),
[state merge](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/config_rules.rs),
[discovery/trust lookup](https://github.com/openai/codex/blob/6aaac694803004a63c6f393d153c96d22521a6b9/codex-rs/hooks/src/engine/discovery.rs)
were reused. No new host/version query, speculative latest/unreleased support,
REA, app patch or repeated broad research. [Reconciliation](STATE-RECONCILIATION-DEV34.md)
retains the distinction between foreign stored metadata and human provenance.

## Offline verification actually observed

- Regression tests first ran against source34:6cases,2pass4fail, demonstrating
  metadata/default false refusals and malformed-root acceptance. No missing-module
  failure used as proof. Added classifier then6cases pass.
- Native classifier+adapter suites20cases:19pass0fail1platformskip on macOS.
  Metadata/default positives preserve input, advance only a review catalog draft,
  and never authorize execution. All14nonempty events with enabledtrue/false state
  stop before catalog/thread/turn drafts. Boundaries, malformed shapes, getter
  nonexecution and opaque prototype/path-like IDs tested without side effects.
- Full local npm test:290pass0fail113platformskips403total (~8.3sec). Validation3mods/
  replay4fixtures pass. All tests offline, no native Codex process or new inference.
- Before/after private preservation check passed entire protected config including
  all trust/project entries, cache31 251/settings28+31/data/source30+31/marketplace;
  raw config matches prior High observation. Expected model preferences are compared
  separately, never overwritten. Seven foreign state records left untouched.
- Original34archive/frozen proposal hashes preserved. Native gate/driver/inputs/
  adapter/default config/hooks/MCP registration compare byte-identical. No source
  fix to permissions, no auto-trust, no Windows implementation/guard change.
- Source35 CI, exact public archive and spaced package checks remain pending Medium.
  Source34 package/CI are separate evidence, not35results. Known Windows Image/
  original bounds/native11/WSL gaps unchanged; no all-green/native support claim.

## Separate source review, not a new execution plan

A new ignored source35 review manifest records8public runtime/input hashes plus
old34artifact hashes and a next-review checklist. It contains no new PLAN/INPUT,
profile/override application or execution grant. The old34proposal remains intact
with old code pins/stale selected-config fingerprint. Source35's schema/plan text
is unchanged, but that does not authorize reusing old runtime fingerprints.

Any future runnable proposal needs an explicit separate revision and review of
current selected inputs/export shape/external hooks/access/usage/cancellation,
followed by fresh authorization for native configuration actions or both intended
model tasks. No current grant, Native CLI invocation or activation is implied.

## Public source pins

| File | SHA256 |
| --- | --- |
| proofs/routing-native-plan.mjs | 5b5fadae8c4cd13dafebbd8ae9734fc364701aacc35225368f1ad04ce6a6dbf4 |
| proofs/routing-native-hooks.mjs | e70dbb724c764f6b921f6276421eff5c945cb1b16b370c49f6b4126b745edc20 |
| proofs/routing-native-adapter.mjs | cb86f4a0e8bf88f3837c1f5987a608aea9d826e5f4106d079d3f2a87b139bfd1 |
| proofs/routing-native-inputs.mjs | fa49a34a47591595cd55e566d5fd0826c480906be40239929ca2abc76d5e163c |
| proofs/routing-native-driver.mjs | c8e64dc5958cc1626f1f4b51e5dc688f3d9a11ce30c0c661a90e81574e29b10d |
| proofs/routing-native-candidate.txt | f17550c7ea7a60b055f63fd907341207f0c5d3877be798d643f26962fcf5e022 |
| proofs/routing-contract.mjs | 3671cacc590d541daac14502f89f5cbe2f342869945f53a04d676e843c95c69b |
| proofs/routing-frames.mjs | bcb8f51fe8f9f9ad448796d250061fdfa2b7e436b215bd87aa79ad601eba535d |

## Next exact setting

**GPT-6.1 Sol Medium** for exact source35 CI/public clone/package/spaced extraction,
new helper/test inclusion, review-hash consistency and closed-entry verification.
Preserve installed31/current preferences/unrelated work/state and both old archives/
proposal. High before any new source security/native activation work or new drift.
No inference, native process, installation or configuration change authorized.
