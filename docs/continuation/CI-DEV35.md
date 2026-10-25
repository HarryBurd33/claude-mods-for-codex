# Source35 exact CI — 2026-10-25

Exact implementation head **f618bc3d306790ac30d89a9b9978bcddf170baf6**, tree
**d88689e2c93b8338666937039267673344d87d37**. Push run
[40234846271](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40234846271).
**Completed: failure overall.** Connected GitHub run/job summaries and decoded logs were inspected for the exact
head. No job rerun, source/assertion change, native Codex invocation or inference.
All six new hook-metadata classifier cases occur in each POSIX and portable lane.

| Job | ID | Observed result |
| --- | --- | --- |
| macOS Node22 | 121294090939 | Success; 290 pass, 0 fail, 113 skip, 403 total; validate/replay pass |
| macOS Node24 | 121294091010 | Success; 290 pass, 0 fail, 113 skip, 403 total; validate/replay pass |
| Ubuntu Node22 | 121294090971 | Success; 290 pass, 0 fail, 113 skip, 403 total; validate/replay pass |
| Ubuntu Node24 | 121294091122 | Success; 290 pass, 0 fail, 113 skip, 403 total; validate/replay pass |
| Windows portable | 121294091092 | Success; native preparation 19 pass, 0 fail, 1 macOS-only skip, 20 total; synthetic driver 18 pass, 1 POSIX skip; validate/replay pass |
| Windows integration22 | 121294090788 | Failure; storage25 pass; process proofs85 pass, 1 fail, 86 total |
| Windows integration24 | 121294090972 | Failure; storage25 pass; process proofs85 pass, 1 fail, 86 total |

Both integration failures are the previously recorded explicit Installer inventory
Image refusal (`installer-read-refused|Image`), observed link count 2. The diagnostic
reports dataRead/sampleAccepted/executionAuthority false; it does not establish an
atomic root cause or grant executable authority. No new failure was found in these
logs. Metadata-bounds cases passed in this run; the original bounds root cause stays
unresolved. No all-green claim, assertion relaxation, retry-until-green or Windows
policy change. Seven decoded logs and completed exact-head metadata were retained
privately. These CI results cannot establish native Windows11 or WSL support.

Windows portable tests cover deterministic contracts and explicit before-IO refusals,
not installed hooks, native app UI, sandbox behavior or Windows Codex acceptance.
The integration jobs exercise synthetic NTFS/helper/job-list behavior, not the native
Codex host. Known Windows Image refusal/original bounds uncertainty remain open;
no Windows guard was weakened or unrelated Windows investigation performed.

[PACKAGE-DEV35](PACKAGE-DEV35.md) separately records exact-public-clone archive and
spaced macOS packaged tests. Source35 remains uninstalled, installed31 preserved.
Native routing/export/hook inventory/model inheritance/usage/cancellation, native
Windows11 and WSL remain unverified. The unconditional native gate is closed.
