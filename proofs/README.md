# Native host proofs — development only

These probes are separate from the v0.1 plugin. They establish individual host
contracts, not product completion. They make no model/API/network calls.

`node proofs/prepare.mjs` creates a disposable local marketplace under `.local/`
with a reviewed snapshot. It does not install or trust anything. The probe logs
only event names, safe tool identifiers and denial outcomes into the explicit
private `.local/proof-data` directory generated for this probe. The hook and MCP
process receive that same location through separate configuration fields; legacy
MCP does not inject `PLUGIN_DATA`. It never opens transcript paths. Its UI reads
those bounded records. Snapshot version 0.0.2 uses the compatibility manifest
only, because the inspected released portable loader skips bundled hooks.

The fixed rewrite demonstration changes only the exact harmless command
`printf MODS_BEFORE` to `printf MODS_AFTER`; normal Codex permission handling
must still apply. The exact command `printf MODS_DENY` is denied. Do not use
these markers as a general security policy.

After preparation, inspect the snapshot, then use the installed CLI's
`plugin marketplace add` and `plugin add` commands. Hook trust must be reviewed
by the human through `/hooks`; never use a bypass. On CLI 0.163.0, edits to
referenced JavaScript may not invalidate hook-definition trust automatically.
Disable the probe before changing code and review/retrust the new snapshot.

Removal: `codex plugin remove claude-mods-native-proof@claude-mods-dev`, then
`codex plugin marketplace remove claude-mods-dev`. Keep data until intentionally
removed. See the continuation test log for what was actually exercised.

Read-only inventory after installation:

```sh
node proofs/inspect-native.mjs --project /absolute/disposable/project --marketplace /absolute/marketplace/.agents/plugins/marketplace.json
```

This bounds app-server inspection to 20 seconds and 2 MiB of output, reports only
the proof plugin's public metadata and warning/error counts, and terminates its
process tree. It does not run a model turn, change trust, or prove hook execution.
The seven subprocess-peer tests are synthetic; the actual CLI 0.163.0 inventory
check separately confirmed three trusted hooks. Its Windows process cleanup has
not been tested on a native Windows host.
