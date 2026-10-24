# Project status — source11 security proof — 2026-10-23

**Full93-capability product incomplete. Source11 is uninstalled; human-trusted
source10 remains installed on macOS.** The default branch is the historical MVP;
current development is on codex/astra-groundwork, not a finished release.

Human-selected GPT-6.1 Sol High added a proof-only Windows private scratch-content
primitive:16flat slots,256KiB per file/1MiB total, private ACL + CREATE_NEW +
DELETE_ON_CLOSE at creation, retained noninherited handles. It closes exact owned
files and refuses recursive cleanup/adoption. Unexpected entries remain intact;
empty private roots may remain after owner/reader death. No real project/index/ref
copy, Git launch, helper operation, network/model call or gate activation.

Five new actual-Windows test cases cover reader/writer sharing, byte/count bounds,
existing slot and junction refusal, normal/external-death cleanup and descendant
readers. Local full suite170pass/0fail/33Windows-only skips203total; validate3mods/
replay4fixtures pass. Source392fc04 [CI40046690213](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40046690213) passed all7jobs; actual native
Windows logs20storage+13proof each,0fail/0skip. No skip/mock
or Server CI implies native Codex/Windows11 support. DLL/provenance/project read
semantics and separate restore/native-host acceptance remain High/security gates.

Installed10 still has149verified fixture files and three human-trusted hooks with
zero inventory errors. Actual post-restart panel focus/render passed; human
confirmed source→Render→Clear keyboard focus and Enter-Clear. Same four records/
project scope/revision; settings hash unchanged. No config/trust/cache/logging edit.
Earlier dev6/4 native event/rewrite/sandbox/hold evidence stays version-specific.

Source11 exact88e8895 anonymous clone170pass/0fail/33Windows-only skips203total,
151-file archive/all-byte hygiene inspection and spaced extraction validate3/
replay4/package-scaffold7/7 passed. See [package record](docs/continuation/PACKAGE-DEV11.md).
No source11 install; next human-selected Sol High before more Windows gated code.

Broader accessibility, backend close-pending cleanup, loaded disable/older rollback,
optional events/themes and native Linux/Windows/WSL remain incomplete. Windows11
computer is available later; not tested here. No custom client/fork/app patch,
credential/session discovery, automatic trust or extra model test authorized.

See [handoff](docs/continuation/HANDOFF.md), [ledger](docs/continuation/REQUIREMENTS.md),
[test log](docs/continuation/TEST-LOG.md), [source11 security review](docs/continuation/DEV11-REVIEW.md).
