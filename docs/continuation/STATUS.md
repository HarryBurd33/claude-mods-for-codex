# Current status — source14 same-helper capture proof — 2026-10-23

**The full 93-capability product is incomplete. Development source 0.2.0-dev.14
is uninstalled. Installed human-trusted dev10 and logging scope are unchanged.**
Human resumed GPT-6.1 Sol High from verified5016e11.

Source14 adds an original, isolated same-helper metadata capture proof: explicitly
selected synthetic index (32 MiB) and info/exclude (1 MiB) use retained read handles,
metadata/byte verification and direct private scratch composition. Private bytes
stay inside the helper; the public 32 KiB request/3 MiB response bridge is unchanged.
No production operation, settings/project/Git/restore gate or installation changes.
Source [c369f49](https://github.com/HarryBurd33/claude-mods-for-codex/commit/c369f49f335c57ed0e5840088795145a0ea5717b),
[CI40059849695](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40059849695):
all 7 jobs passed. Actual Windows Node22/24 logs read: 20 storage + 35 proof tests
per lane, 0 failures and 0 skips. Seven new metadata-capture cases passed, including
full32MiB index/1MiB exclude direct composition. Both prior mapping diagnostics
still mapping-refused; altered-byte/mtime branch unverified. Windows Server2025 OS
evidence is separate from native Windows11 Codex/Git acceptance.

Local suite: 170 pass, 0 fail,
55 Windows-only skips, 225 total. Validation: 3 mods; replay: 4 fixtures.

Real Git, executable/DLL trust, ignore-aware selection, repository provenance,
child-created content ownership and native Windows11 acceptance remain gated.
Five-second cooperative checks cannot interrupt blocked IO. Live readers can retain
scratch bytes; unknown entries are preserved, with no recursive cleanup or secure
erasure claim. Prior mapping tests returned mapping-refused; altered-byte/mtime
negative branch and 8.3-specific behavior remain unverified. Windows11 host remains
unavailable per latest human reply; no repeated availability question.

Next: GPT-6.1 Sol Medium for exact-source packaging/public-clone/spaced extraction,
then human-selected High before further gated Windows implementation. Read
[handoff](HANDOFF.md), [review](DEV14-REVIEW.md) and [test log](TEST-LOG.md).

Installed10 is byte-equal to all149 reviewed files; private settings hash unchanged.
Fresh read-only inventory:3enabled/human-trusted hooks,0errors,0model turns. Actual
activity:4records/same project scope/revision, producer health unknown. Native
source10 focus/render/keyboard-Clear and dev6/dev4 event/hold/sandbox evidence stay
version-specific. Full accessibility/lifecycle/loaded disable/older rollback/Linux/
Windows/WSL acceptance incomplete. Optional observers off; no model/API run, trust
write or theme/client change. Earlier failures remain in TEST-LOG.

## Source13 Medium package verification — 2026-10-23

Human resumed clean69e8bb3/tree3471e32 on Sol Medium. Exact anonymous public
clone/full suite170pass/0fail/48Windows-only skips218total. Reviewed157-file archive
1033715unpacked/316972compressed bytes, SHA256
11a5f0bdd3634c0cc9f3a6279106bc43051c34429556e40031291e62cb1ee41b.
All packaged bytes equal clone/checkpoint; no links/traversal/special/set-ID/private
roots/case collisions/dependencies/root portable manifest. MIT/version13/default-
off storage verified. Spaced extraction validate3/replay4/package-scaffolding7/7,
0fail/0skip. macOS14.6/Node24.22.0/npm11.19.1; no Windows compilation/installation.
NotesCI40058562429 all7job conclusions read as success, no new log-count/branch
claim. Actual proof15e388e/CI40058125353 evidence remains separate.

Fresh bounded no-model inventory3enabled/human-trusted/0errors; installed10/cache/
settings unchanged. Activity4/same scope/revision. No logging/trust/config/model-run
or gated-code change. All93IDs retained. Real Git/native/unknown child-content
cleanup/live-reader limits persist; mapping mutation branch unverified. Next human
Sol High before further gated implementation. See PACKAGE-DEV13.
