# Exact source37 CI — observed failure overall — 2026-10-26

[Run40284031143](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40284031143)
completed **failure**, head **d8d7cabd1cce2e6c060712173929372e2dae52bb**, tree
**dad85283b2618ce8534257179f1cd125b8d4fece**. Sol Medium retrieved exact metadata,
all seven job records and complete decoded logs; no rerun/source/assertion change.
All11inspection test titles occur in four POSIX and Windows portable logs.

| Job | ID | Observed outcome |
| --- | --- | --- |
| macOS Node22 |121443413133 |318pass0fail113skip431total; validate/replay |
| macOS Node24 |121443413221 |318pass0fail113skip431total; validate/replay |
| Ubuntu Node22 |121443413212 |318pass0fail113skip431total; validate/replay |
| Ubuntu Node24 |121443413263 |318pass0fail113skip431total; validate/replay |
| Windows portable |121443412943 |Inspection7pass0fail4POSIXskip11total; readiness15pass2POSIXskip17; native preparation19pass1macOSskip20; synthetic routing18pass1POSIXskip19; validate/replay |
| Windows storage/process Node22 |121443413194 |25storagepasses; process85pass1fail86total |
| Windows storage/process Node24 |121443413163 |25storagepasses; process85pass1fail86total |

The only integration failure in each lane is the known explicit Installer inventory
profile's **installer-read-refused|Image**, observed link count2. The diagnostic has
dataRead=false, sampleAccepted=false and executionAuthority=false. It neither trusts
nor executes Git. Metadata-bounds cases passed this run; the original cause remains
unresolved. No Windows guard or expectation was weakened. Native Windows11/WSL
installation/trust/events/dashboard/permissions are still unverified.

Portable inspection's four skips cover actual POSIX cwd/environment peer execution,
failure peers, group/cancel/stall cleanup and blocked-parent timing. Passing pure
contracts and before-IO refusals does not establish Windows process compatibility.
POSIX source37 results are offline/fixed Node peers, not native Codex observations.

[Exact package](PACKAGE-DEV37.md) independently passes selected spaced tests. Installed31,
logging/parent model/trust and all gates remain preserved; no Codex invocation,
inference, install/config/trust change or native-input refresh. New source-only review
records remain private. Do not substitute later notes-only CI for this source identity.
