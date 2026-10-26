# Source36 exact CI — 2026-10-25

Exact head **9833caf2c065f5ffc0419ff57674a3fe98b0632b**, full tree
**185e73b762669b6d255363c9d3377633f156b71f**. Push run
[40265830772](https://github.com/HarryBurd33/claude-mods-for-codex/actions/runs/40265830772).
**Completed: failure overall.** GitHub exact-head run metadata, job summaries and decoded logs inspected; all17
new readiness case titles verified in four POSIX logs and the Windows portable log.
No job rerun, assertion relaxation, source/security/Windows guard change or Codex run.

| Job | ID | Observed result |
| --- | --- | --- |
| macOS Node22 | 121387929040 | Success;307pass0fail113skip420total; validate/replay pass |
| macOS Node24 | 121387929026 | Success;307pass0fail113skip420total; validate/replay pass |
| Ubuntu Node22 | 121387929110 | Success;307pass0fail113skip420total; validate/replay pass |
| Ubuntu Node24 | 121387929076 | Success;307pass0fail113skip420total; validate/replay pass |
| Windows portable | 121387928809 | Success; readiness17cases15pass0fail2POSIXskips; native preparation19pass1macOSskip; synthetic routing18pass1POSIXskip; validate/replay pass |
| Windows integration22 | 121387929030 | Failure;25storagepass;86processproofs85pass1fail, known Image refusal |
| Windows integration24 | 121387929132 | Failure;25storagepass;86processproofs85pass1fail, known Image refusal |

Portable checks exercise fixed Node peers, deterministic contracts and explicit
before-IO refusals. The two readiness skips are POSIX SIGINT and group/descendant
cleanup. They do not establish native Windows hooks, sandbox permissions, UI,
installation, update/removal, model routing, Windows11 or WSL compatibility.

Both integration failures are the previously recorded Installer inventory
Image refusal (`installer-read-refused|Image`), linkcount2; diagnostics report
no data read, sample acceptance or execution authority. Metadata-bounds cases passed on this run, but original bounds root cause
remains unresolved; a passing later run is not a fix. Integration proofs are
synthetic NTFS/helper/process checks, not the Codex host. No unrelated Windows
investigation or weakening of the guard was performed.

[PACKAGE-DEV36](PACKAGE-DEV36.md) separately records exact-public-clone archive and
spaced macOS package checks. Source36 is uninstalled; installed31 and current
human-reviewed trust metadata remain preserved. Native admission stays closed.
