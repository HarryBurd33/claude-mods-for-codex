# Offline development archive verification

Verified on 2026-10-28 from source **3e5c874c47e7241c94b8c9a12a235ff5982e8edd**,
tree **df50c9349866822cb7c3fc863585d58965e39dcd**, on macOS with Node
24.22.0 and npm 11.19.1. This verifies a development archive, not a release or
installation. The archive remains private local evidence; no package was published.

The remote development ref matched that source before packaging. The original
[CI run 40557201530](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40557201530)
was freshly checked: completed successfully, all seven jobs passed at
`f9af0cbd2a6c96393fdd2be270d4f3f3e9e6dc1e`. Only two Markdown files differ
between that source and the archive source. This check did not rerun CI.

| Archive observation | Result |
| --- | --- |
| Package | `claude-mods-for-codex-0.2.0-dev.39.tgz` |
| Compressed size | 1,007,741 bytes |
| Regular files | 386 |
| Unpacked size | 3,273,001 bytes |
| SHA256 | `d6f65a338c4e63ad6a728f34f960fc50ceff922113296cf182563a78e1524faf` |
| npm SHA1 and SHA512 integrity | Both match the generated manifest |
| File names, count and sizes | Match the npm manifest |
| Every archived file | Bytes equal its exact Git blob at the pinned source |

Packaging used `npm --offline --ignore-scripts pack`, explicit empty user/global
npm configuration, a fresh private cache and temporary directory, and a minimal
child environment. No dependency installation or download was performed. The
archive was checked before manual extraction into a fresh path containing spaces.
The verifier refused traversal, absolute/noncanonical names, case-folded duplicate
names, links, special file types, private state paths and oversized content. These
path/content checks do not certify arbitrary source bytes as secret-free.

The selected tests ran from the extracted archive:

- Process-group observation, directory/pin diagnostic frames, package contracts,
  owned-fixture lifecycle, and linked-inventory frames: **28 passed, 0 failed,
  1 Windows-only skip**, 29 total, 6.323 seconds.
- Offline validation: **3 mods valid**.
- Offline replay: **4 fixtures**, including the destructive-command denial.

The skip is not Windows verification. No full-suite rerun or new Windows/native
host test is claimed. The existing successful CI remains evidence for its exact
earlier source. The older `cccb487` archive remains historical and was not reused.

The human confirmed GPT-6.1 Sol / Medium selection. Automatic model readback was
unavailable; this is not independent per-turn model telemetry. Recovery used a
fresh normal checkpoint review and the existing task lease, without an allowance
override. Native sandbox/approval boundaries remained authoritative.

No native client, model trial, trust/configuration change, plugin installation,
release or tag was performed by this archive stage. Phase1 and the human-present
Stop trial remain spent. Native lifecycle/failure/cancel, production held-call
review, configured routing, accessibility/zoom/reopen/Watch teardown, complete
authoring lifecycle, actual Windows11/Linux/WSL acceptance, and final frozen release
verification remain open. See the [implementation record](SOL-ABC-IMPLEMENTATION-2026-10-27.md)
and [requirement ledger](REQUIREMENTS.md).

The follow-up publication changes documentation only and uses `[skip ci]`. Its new
documentation is outside this pinned archive; it does not create a new passing CI
result or change the runtime covered above.
