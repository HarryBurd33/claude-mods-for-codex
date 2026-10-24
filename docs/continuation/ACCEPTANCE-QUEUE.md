# Capability acceptance queue — macOS first — 2026-10-24

The [macOS audit](MACOS-ACCEPTANCE.md) now individually classifies all93 rows
against dated source/test/host evidence. Use it and [MACOS-BATCH](MACOS-BATCH.md)
for the next work. This older table is only the ledger's limit/gap projection;
it is not a closure score. Windows remains in scope for the later phase.

| Capability | Target recorded in ledger | Remaining gap / limit requiring audit |
| --- | --- | --- |
| UI-01 Open a mod-owned pane | UIhost / Desk | Owned component; native chrome replacement not implied |
| UI-02 Open a persistent side panel | UIhost / Desk | Host manages docking/navigation; no arbitrary host-tab API claim |
| UI-03 Use tabs within a mod | UIhost / Desk | Owned views do not create arbitrary host tabs |
| UI-04 Click buttons locally | NodeMac; Desk | Buttons never approve native calls |
| UI-05 Enter fields and choose options | UIhost | Watch replay0→1 observed; no native composer replacement |
| UI-06 See status and activity | NodeMac; Desk | Retained delivery counts are not success/lifetime totals/producer health |
| UI-07 Show band near prompt/transcript | Desk; CLI163 | A strip inside owned UI is not a native above-composer band |
| UI-08 Apply themes | CLI164; Desk separately unverified | No silent client update; desktop theme contract remains to establish |
| UI-09 Set backgrounds | UIhost; CLI164; Desk | Owned background is not whole-app background replacement |
| UI-10 Show footer information | UIhost; CLI163/164 | No arbitrary native transcript/footer insertion proved |
| UI-11 Show indicators | UIhost; CLI163; Desk | Native indicator appearance stays host-controlled; missing data unavailable |
| UI-12 Render rich code | CLI163/164; UIhost | JSON highlighting only; other languages literal; no native renderer replacement |
| UI-13 Render tables | UIhost | Native transcript customization not implied |
| UI-14 Render Mermaid | UIhost | Approximation: declaration-order flowcharts only, no full Mermaid language/layout; literal source fallback and separately reviewed tool alternative |
| UI-15 Render charts | UIhost | No missing-value invention or native transcript chart customization |
| UI-16 Inspect diffs | UIhost | Patches explicitly opted in; selected commits may include human edits/multiple turns |
| UI-17 Restyle native tool rows | CLI163/164; Desk | Render a separate owned activity view; do not call it native row restyling |
| UI-18 Replace native spinner | CLI163/164; Desk | Owned busy indicator plus normal host status |
| UI-19 Restyle native dialogs | CLI163; Desk; UIhost | Use supported elicitation for content; never impersonate approval UI |
| UI-20 Restyle native transcript | CLI164; Desk | Owned replay view for alternate layout; native renderer replacement not claimed |
| UI-21 Distinguish official extension, owned component and companion | All | Local process authority differs from model sandbox; separate client not substituted |
| UI-22 Consider separate app-server client only with agreement | Separate client, OS/version TBD | Prefer official host extension plus disclosed gaps |
| UI-23 Avoid unsupported application patch/fork | All | Upstream contribution may be proposed; not an installation workaround |
| EV-01 Observe session start | CLI163; Desk | Earlier empty thread/start alone gave no evidence; JSON output did not establish visible notice |
| EV-02 Observe covered tool start | Desk; CLI163 source | No claim for hosted search, `write_stdin` continuation or all tools; not complete enforcement |
| EV-03 Observe tool completion | CLI163; Desk | Completion is not success; omitted paths disclosed |
| EV-04 Observe turn completion | CLI163; Desk; explicit exec | Counts Stop deliveries, not unique turns/exactly once; no stop block or automatic follow-up |
| EV-05 Observe compaction, subagent, interruption and other useful triggers | CLI163/164; Desk | No UserPromptSubmit/PermissionRequest observation or inferred PostToolUseFailure; raw payload not retained |
| EV-06 Block covered risky calls | Desk; CLI163 source | Fixed proof is not complete risk analysis; lexical match is not sandbox enforcement |
| EV-07 Hold a covered call for explicit decision | CLI163; Desk | Limited proof, not production gate. Previously disconnected hook failed open; keep deny/review alternative |
| EV-08 Alter harmless tool input opt-in | Desk; CLI163 source | Paired carrier continues ordinary permissions; one rejection does not certify every mode/tool/client |
| EV-09 Resolve multiple mod decisions predictably | NodeMac; CLI163/164 | Other plugins run concurrently; dispatcher cannot guarantee global rewrite ordering |
| EV-10 Handle allow/deny/cancel/timeout/malformed/failure safely | CLI163; Desk; NodeMac | Infrastructure fail-open and absent human attestation prevent complete enforcement claim |
| EV-11 Share metadata across hook processes | NodeMac; POSIX-CI | Standalone CLI plus desktop shared view observed on macOS; Windows APIs use NTFS adapter/CI, native Codex reception/UI unverified |
| EV-12 Isolate sessions and deliberately share projects | NodeMac; POSIX-CI | Per-call shell workdir is not scope identity; sessionId selected explicitly, no private-session discovery |
| EV-13 Bound retention and cleanup | NodeMac; POSIX-CI | Approximately128MiB maximum plus overhead; cleanup commands not integrated |
| EV-14 Show event-driven live updates | NodeMac; Desk | Bounded opt-in polling, not permanent server push/subscription |
| EV-15 Route a new explicitly configured agent/task | CLI163/164; Desk availability to confirm | Not inference interception; extra runs require explicit bounded authorization; stage switches remain human-controlled |
| EV-16 Intercept/change current selected model or rewrite prompts | All | Explicit new configured task is EV-15; user selects stage model manually |
| EV-17 Observe model-request lifecycle separately from routing | CLI164; Desk unknown | Observation does not authorize request mutation or create live token feed by itself |
| EV-18 Avoid automatic approval | All | No automated approval, permission/model/prompt rewrite or blanket host guarantee |
| EV-19 Keep local callbacks deterministic and usage transparent | All | Model invocation and future model-assisted authoring/routing consume allowance; stage switches stay human-controlled |
| AU-01 Run immediate local user command | NodeMac; UIhost; CLI163 | CLI/owned control approximation, not native immediate slash callback |
| AU-02 Invoke a tool through the model | CLI163; Desk | Model-mediated calls consume chat usage; local buttons deterministic |
| AU-03 Invoke reusable skill | CLI163; Desk | Selected-model workflow consumes usage; not an immediate native slash callback |
| AU-04 Validate/replay/report from CLI | NodeMac; POSIX-CI; Win subset | Local CLI is not native command registration; patches may contain sensitive project content |
| AU-05 Run UI actions without model turns | UIhost | Host view action is not approval of a native pending tool call |
| AU-06 Describe a mod and scaffold supported components | NodeMac; CLI163; Desk | Declarative framework config only; no standalone custom UI/plugin scaffolding or auto-trust |
| AU-07 Inspect declared access before use | NodeMac; UIhost; CLI163/Desk | Declarations/read-only hints do not sandbox arbitrary trusted local code |
| AU-08 Validate contracts before install | NodeMac; CI | Validation does not install or trust code; authoring manifest/scaffold still incomplete |
| AU-09 Replay/test synthetic events safely | NodeMac; CI | Mock peer or Windows-looking path is not native acceptance; dev5 preview/observer native delivery remains unverified |
| AU-10 Review source changes before installation | CLI163/164; Desk | Integrated authoring review UI/skill pending |
| AU-11 Install through supported local mechanism | CLI163 installation; Desk execution | User-profile installation; optional observers off, original proof retained, hold removed |
| AU-12 Reload/update safely | CLI163/164; Desk | No promise of automatic hot reload/trust; UI code and skill update batched to avoid an extra restart |
| AU-13 Disable without damage | CLI163/164; Desk | Per-project versus user scope must be measured |
| AU-14 Remove cleanly | CLI163; Desk | Retained data/cache cleanup separate; original proof deliberately retained |
| AU-15 Restore configuration/rollback | CLI163/164; Desk | Never overwrite whole user config or assume old trust is valid |
| AU-16 Package the correct supported distribution | CLI163/164 source; Desk proof | Do not transfer dev4 host evidence to dev5 or call development a finished release |
| SEC-01 Understand each process's authority | All | Declarative read-only hints and CSP do not sandbox arbitrary local process code |
| SEC-02 Keep filesystem operations selected-project scoped | NodeMac; POSIX-CI; Win separately | No file-content explorer preview; patch/usage reads explicitly separate |
| SEC-03 Bound subprocesses and cleanup | NodeMac; POSIX-CI; Win | Source browser test uses a separately bounded loopback-only fixed-resource server, not product network mode |
| SEC-04 Make network access explicit | NodeMac; UIhost | CSP is not OS network confinement of trusted local processes |
| SEC-05 Minimize event fields and context access | CLI163; Desk; NodeMac | Transcript path receipt never authorizes reading it; optional raw export read is separate explicit selection; hashes not anonymization |
| SEC-06 Do not collect secrets/environment values | All | Need only availability flags if justified, never secret values |
| SEC-07 Keep prompts/transcripts private | All | Git patches may contain secrets even when sensitive filenames are excluded; review opt-in/scope separately |
| SEC-08 Opt in to metadata and sensitive telemetry separately | NodeMac; CLI163/Desk | Optional observer hook reception can contain sensitive payload in memory; registration/storage reviewed separately |
| SEC-09 Preserve private storage under concurrency | NodeMac; POSIX-CI; Windows Server2025 NTFS-CI (Node22/24) | Bounded busy is legitimate, not guaranteed delivery. Source23 failures retained with exact old stages/timings unknown. Source24 Windows handle-lifetime hypothesis refuted on tested host; no runtime/permission/deadline change. Hostile same-user/administrator outside claim; Windows project/restore gated |
| SEC-10 Maintain UI accessibility and lifecycle | UIhost; NodeMac simulation | Browser preview does not establish Codex accessibility or memory erasure |
| EX-01 blast-radius explains likely command impact | CLI163; Desk; UIhost | Production deny/review approximation, unknown extent/targets, no automatic approval or destructive demonstration |
| EX-02 filetree explores selected project with Git status | UIhost; NodeMac; Win later | No file-content explorer preview; no upstream code copied or prompt injection  Source23 macOS availability refusal remains unlocalized; source24 strict listing/diff and independent sentinel checks passed four POSIX lanes, with sanitized future refusal reasons. |
| EX-03 replay-theater inspects prior-turn edits | UIhost; NodeMac | Approximation: explicit commits, not automatic turn capture or pure assistant attribution |
| EX-04 Restore a reviewed previous change separately | CLI163/Desk; NodeMac | Only existing UTF-8 text with unchanged executable mode; add/delete/binary/mode cases refused. Normal explicit host edit is alternative. In-place write not interruption-atomic; Windows ACL unavailable |
| EX-05 token-weather shows context occupancy | CLI163/164; Desk; explicit run | Cumulative reported tokens are not context occupancy; default host zeros do not establish free usage |
| EX-06 Show available usage/activity transparently | CLI163/164; Desk; UIhost | Latest selected cumulative snapshot only; not current-chat occupancy/billing/cache-health |
| EX-07 cache-tax passive cache/cost display | Explicit run; UIhost | No TTL/warmth/health/savings/billing estimate; never sum cumulative snapshots |
| EX-08 prismantis theme/rich rendering equivalent | CLI164; UIhost; Desk unknown | CLI163 installed, prose-theme164 not installed; plugin-owned CSS/native TUI distinctly labeled; no fork |
| SK-01 Systematic debugging automation | CLI163; Desk | Skill is model-mediated advice/action workflow, not deterministic callback |
| SK-02 Verification before completion | CLI163; Desk | No self-certified full-product completion from partial suite |
| SK-03 Review preparation | CLI163; Desk | Writes/posts only within user authorization; usage and limits disclosed |
| SK-04 Mod scaffolding automation | CLI163; Desk; NodeMac | Same selected model only; no independent evaluator/extra model run; scaffold remains framework declarative data |
| PL-01 Usable native macOS CLI installation | CLI163 | CLI and desktop results recorded separately; optional lifecycle hooks unregistered |
| PL-02 Usable actual desktop integration | Desk | MCP Apps inspection permitted; native app CUA blocked and not bypassed |
| PL-03 Linux portability | POSIX-CI; Linux Codex version TBD | No Linux Codex host tested; Node CI is not native integration |
| PL-04 Native Windows compatibility | Win | Source25 CI40122363235:25 storage passes per lane,84/85 process proofs; mandatory installed-image read failed before bytes. Post-refusal cmd image link count2 violates current one-link guard. No hashes/imports or native Windows11/WSL acceptance. User selected macOS acceptance first; Windows remains incomplete and in scope |
| PL-05 WSL compatibility separately | WSL | WSL does not certify native Windows; Claude restriction not transferred blindly |
| PL-06 CI separates platform contracts from host tests | POSIX-CI; Win | No native Windows/Windows11/WSL installation/event/UI claim; source/extraction/private ACL CI recorded separately |
| GOV-01 Review full requested primary documentation | Research date 2026-10-23 | Current docs mutable; recheck changed claims before release |
| GOV-02 Use REA only for concrete unresolved questions | Local environment; REA 6.7.0 earlier | Released public source resolved rewrite/trust questions; no need to repair unrelated tools; prior limited study not semantic proof |
| GOV-03 Preserve MIT and independent-project status | Repository/all packages | Feature ideas are leads; copied code would require separate license/notice review |
| GOV-04 Preserve local history and user work | Git repository | Old historical public handoff exposure is not erased by new ignore rule |
| GOV-05 Publish sanitized durable checkpoints | Git/GitHub | Current checkpoint hash reported only after independent readback; no private history force-push |
| GOV-06 Honor human-controlled model switches | Human-selected Sol High; next Medium for human-prioritized macOS acceptance audit, High before runtime/security or resumed Windows work | Return to High before any new project/restore security enabling; full product remains incomplete |
| GOV-07 Account for every capability before full completion | All stated targets | Neither Astra proof nor Sol foundation checkpoint is full product completion |
