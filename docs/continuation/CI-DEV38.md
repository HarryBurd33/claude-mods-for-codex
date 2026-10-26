# Exact source38 CI — 2026-10-26

[Run40352685600](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40352685600)
completed against `9016cb0aca1d43c9d1fd87b058831a3ebb91e78b`.
Metadata and all seven decoded job logs were retrieved; no rerun requested.
**Overall conclusion: failure.**

| Job | Conclusion and observed scope |
| --- | --- |
| macOS Node24,121676706647 | success;437total324pass0fail113skip |
| macOS Node22,121676706972 | success;437total324pass0fail113skip |
| Ubuntu Node24,121676707057 | success;437total324pass0fail113skip |
| Ubuntu Node22,121676707101 | success;437total324pass0fail113skip |
| Windows portable,121676706228 | success; reliability6total1pass5POSIXskip; inspection11total7pass4POSIXskip; portable contracts only |
| Windows NTFS Node24,121676706876 | failure; storage25pass; process proofs86total85pass1fail |
| Windows NTFS Node22,121676707859 | failure; storage25pass; process proofs86total85pass1fail |

All six reliability names occur in each POSIX and portable log. POSIX exercises
three late-dispatch cases, two silent-descendant cases and pure observation identity
checks. Windows exercises only the pure case; five POSIX cases are explicitly skipped.
These results establish offline fixed-peer contracts, not native Codex behavior.

Both integration failures are the previously recorded explicit Installer inventory
positive: `installer-read-refused|Image`, link count2, before dataRead/sampleAccepted
or execution authority. Assertions/one-link security guard remain unchanged. No new
failure was observed in source38 logs. The original metadata-bounds root cause is
still unresolved even though those cases pass this run. Native Windows11/WSL,
installation/trust/UI/process containment remain unverified; Windows stays in scope.
Do not rerun until green or transfer Server CI to native host acceptance.

The final documentation checkpoint has a different commit from the implementation
run above; do not describe its later workflow as already observed. Exact source
package results: [PACKAGE-DEV38](PACKAGE-DEV38.md).
