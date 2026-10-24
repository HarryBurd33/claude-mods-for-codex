# Later Windows native acceptance kit

Prepared2026-10-23 from official documentation retrieved that day. This is a
checklist, not a Windows compatibility result or an installation script. Source9
OS CI passed20storage+8proof tests on each Windows Server2025 Node22/24 lane;
no native Windows Codex was tested. The user's Windows11 computer is available
later. Source10 retains the source9 Windows foundation and is installed/human-
trusted on macOS, native focus verified after restart; this is not a Windows installation result.

**Use Sol High before gated Windows security or integration work.** Medium may
prepare records/package and collect explicitly selected read-only inventory. It
must not alter the launcher, private adapter, project/Git/restore gate or sandbox.
No custom client, fork, app patch, binary vendoring or PATH-selected Git fallback.

## 1. Establish the actual host without changing it

Use the existing Windows desktop app and normal, non-administrator terminal.
Do not install/update software, change execution policy, configure a sandbox,
register a marketplace, trust hooks or send a model prompt during inventory.

Record only this small sanitized summary publicly; keep paths/raw output private:

| Item | Read-only observation | Acceptance / stop condition |
| --- | --- | --- |
| Windows | Settings → System → About: edition, OS build and system type. Omit device/product IDs. | Identify native Windows11 separately from WSL and Server CI. |
| Desktop | App's displayed version/build and selected project location type. | Record actual client; CLI version alone does not identify its bundled runtime. |
| CLI | User identifies the existing trusted installation and absolute launcher path. Inspect its help/version after reviewing that path. | No discovery/execution from the selected project or automatic PATH fallback. If absent, record unavailable; don't install it as inventory. |
| Node | User identifies the reviewed absolute Node executable and version. | Node22+ required, but availability in a normal terminal does not prove the hook process can find it. |
| Git | User identifies the installed distribution/location; inspect executable properties and installation origin. | Do not execute it yet merely because it exists or is named git.exe. High must review executable/parent/DLL trust. |
| Policy | Inspect the client's shown sandbox/permissions and any policy error. `/status` and `/debug-config` are documented CLI inspection surfaces. | Keep raw config, accounts, paths and logs local; never dump full environment, credential stores or private chats. |

Windows11 is the recommended baseline in current official guidance. Native Windows
and WSL have distinct configuration/history. Sandbox selection depends on device
capabilities and policy; this kit does not change it or invoke setup/compatibility
probes. Use the actual host's displayed mode, not an assumption from its OS name.
[Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox).

## 2. Inspect supported commands before using a package

After the absolute existing CLI launcher is reviewed, these are the intended
read-only command forms. Use its full path with PowerShell's call operator `&`;
replace the placeholder with that reviewed path. If installed help differs, stop
and record the difference. Don't paste a guessed executable path.

```powershell
& '<reviewed absolute Codex CLI launcher>' --version
& '<reviewed absolute Codex CLI launcher>' plugin --help
& '<reviewed absolute Codex CLI launcher>' plugin list --json
& '<reviewed absolute Codex CLI launcher>' plugin marketplace list --json
```

Keep inventory output private: it can contain machine-specific locations and
unrelated plugins. Public record needs only this plugin's identity/version/status
and command success/failure. No `add`, `remove`, `upgrade`, login or full config
rewrite during inventory. Current official command reference documents separate
installed/available arrays; an available entry is not an installed/loaded plugin.
[Developer commands](https://learn.chatgpt.com/docs/developer-commands).

## 3. High security review before activation

Inventory is a prerequisite, not permission to activate a gate. Reuse the
[source9 security record](continuation/DEV9-REVIEW.md) and
[isolated proof contract](../proofs/windows-owned-process/README.md).

| Gate | Concrete acceptance still required | Current state |
| --- | --- | --- |
| Executable and dependencies | Reviewed absolute installed Git and dependency locations; object/parent ACLs and no-follow identities held during execution; trusted cwd/environment; no project executable/DLL/helper/config/network launch. | Synthetic object pins and owned-process lifetime proved separately; real Git/DLL closure unverified. |
| Private content scratch | Protected descriptor at creation, verified files/index/refs, explicit bounds, freshness/provenance, exact owned cleanup and owner-death recovery. | Source11 flat synthetic content/delete-on-close proof, no project/index/refs copied or Git-compatible layout; no recursive cleanup/adoption. |
| Project reads | Selected root, ignores/secrets/case/Unicode/link/special-file bounds; no junction/alternate object-store escape; concurrency and immutable identity checks. | Windows views refuse before IO. No live-tree/snapshot design selected. |
| Restore | Separate explicit intent, private plan, fresh content/identity conflict checks, metadata/interruption/concurrency, ordinary host write permissions. | Windows restore refuses. Normal reviewed host edit is the practical alternative. |
| Host boundary | Harmless hooks and MCP launch in the actual client/sandbox, correct output handling and cleanup. | Windows native hook installation, launch, permissions and panel unverified. |

A successful `--version`, schema field or Server CI run cannot close these gates.
If a new hard question exceeds High, save/upload/verify and request Astra through
the same human-controlled switch protocol. Never remove a refusal on Medium.

## 4. Prepare the supported installation and rollback before the human step

Choose one immutable, reviewed source archive and a separately reviewed local
marketplace identity. Review [setup](setup.md) and [removal](removal.md) against
that host's actual help. Back up only affected owned entries privately; record
other plugin entries so their preservation can be verified. Keep existing data,
retention, export selection and project scope unchanged. Do not copy a macOS
machine config into Windows or assume a project-local marketplace is project-only.

The current tested distribution has only `.codex-plugin/plugin.json`, no root
portable manifest. Released CLI163/164 loader differences are documented in
[Codex contracts](continuation/CODEX-CONTRACTS.md). Current general packaging docs
describe both formats; they do not prove that an arbitrary installed release loads
portable hooks. Check actual native inventory instead of changing formats blindly.
[Official packaging](https://developers.openai.com/plugins/build/plugins).

Prepare removal and exact prior-snapshot restoration through supported commands
or UI, preserving unrelated entries. Do not edit the installed cache or trust
hashes. Changed code must receive real human review even if old trust remains.
Installation/authentication/trust are human protected steps; present the concrete
reviewed package and expected scope before asking the human to complete them.

## 5. Native checks after those gates and human review

Use disposable selected projects and fixed harmless markers. Never execute a
risky command to demonstrate denial. Do not broaden logging to make counts move.
No additional `codex exec`/model session is authorized by this checklist; the old
single-run grant was consumed. Ordinary selected-chat use consumes its model's
usage; a separate model-driven run needs a new visible bounded authorization.

| Check | Expected observation | Evidence to retain |
| --- | --- | --- |
| Inventory/trust | Exactly this package/version's three default hooks, enabled and human-trusted, zero hook errors. | Sanitized counts/version; raw paths/inventory private. Empty inventory is a packaging/launch blocker, not a trust prompt to bypass. |
| Session start | Harmless visible notice or explicitly opted-in scoped metadata from the actual native session. | Actual event/output and client version, separately from a replay. Do not infer session scope from a shell workdir. |
| Harmless covered tool | Fixed print marker, expected tool/event shape, bounded completion. | No transcript scan or raw argument journal. Validate the actual Windows shell before choosing a print command; don't assume POSIX printf exists. |
| Deny / exact replacement | Harmless matched print blocked; explicit approved print BEFORE→AFTER and unmatched control behave as declared. | Before/after disclosure and unchanged normal permissions; separate safe permission-negative case. No bare allow, automatic approval or prompt/model rewrite. |
| Failure paths | Malformed input, failure, deadline and cancellation preserve fail-closed mod behavior where applicable; host crash/timeout limits explicitly recorded. | Offline and native results separate. Hold proof is not a production approval gate. |
| Owned panel | Real client renders/connects; refresh/shared-state update, controls, keyboard/tables/resize, close/reopen and cleanup are observed separately. | Read-only inspection by default. UI button never approves a native pending call. |
| Update / disable / removal / rollback | Exact reviewed snapshot loaded; human changed-hook review, fresh inventory, removal absence and exact owned prior restoration. | Preserve unrelated plugins/settings/data. Already-loaded unload is separate from fresh-session absence. |

Official hooks documentation requires trust review, documents Windows command
overrides and notes incomplete tool coverage. A documented override is not evidence
that this package's current generic Node command works in that host. High must
review a launcher change, then the human must review its changed hook definition.
[Hooks](https://learn.chatgpt.com/docs/hooks).

## Result record

For every check record: source commit/archive hash, component version, client/OS/
architecture, sandbox/permission mode, actual action, result and exact remaining
gap. Separate documented support, source corroboration, offline/OS tests and native
host observations. Publish sanitized summaries only. Leave all unmet requirements
in the ledger as incomplete; no full Windows or full-product completion claim.
