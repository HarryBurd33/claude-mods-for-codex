# Disable, remove, and roll back

Current native follow-up: [dev26 restart acceptance](continuation/NATIVE-DEV26.md)
verified the bounded hooks/owned UI and one explicitly authorized active-Watch
update. No configuration/trust/scope/production cleanup changes; optional events
off and the extra run grant consumed. Broader lifecycle/platform limits remain.


Use the supported Plugins controls in the client where the plugin is active to disable it. Do not simulate disabling by editing trust hashes or deleting cached files while the client is running. If that client does not expose a suitable disable control, uninstall the selected plugin with the CLI command below. End affected sessions or restart the client, then verify that new sessions no longer load its hooks.

For the example marketplace from [setup](setup.md), installed CLI 0.163.0 help confirms:

```sh
codex plugin remove claude-mods-for-codex@claude-mods-local --json
codex plugin list --marketplace claude-mods-local --json
```

The remove command uninstalls the selected plugin and removes its local cache. A source can remain listed as available after removal; inspect installation/enabled state and `/hooks`, not just whether its marketplace listing exists. Confirm that the removed plugin's hook source is absent from a fresh session.

Remove only this plugin's entry from a shared local `marketplace.json`, preserving other entries. If the dedicated marketplace has no other installations you need, unregister it separately:

```sh
codex plugin marketplace remove claude-mods-local --json
```

Do not unregister a shared marketplace to remove one plugin. Delete its copied source folder only when you no longer need it for review or rollback. Registration and installation affect the active Codex user home and cache; deleting a Git checkout or a marketplace JSON entry alone does not uninstall a cached plugin.

## Optional data

Removal is not evidence that all retained metadata was deleted. If journaling was enabled, its exact selected plugin-data directory may contain `activity.jsonl`, `activity.previous.jsonl`, or a stale `.activity-journal.lock`. The integrated scoped-state library additionally creates a `metadata-state-v1/` subtree only when metadataState is explicitly enabled. The shipped default configuration keeps it off; optional lifecycle events require another explicit event selection and reviewed hook registration.

Locate the exact data directory through the host or your own setup record. Stop all relevant hook/server processes before removing data. Inspect and remove only this plugin's selected data if you no longer need it; preserve unrelated files and the parent directory. Do not infer a data path from the source checkout or search credential/session stores. Never remove an apparently stale lock while a writer may still be active.

## Rollback

Keep the previously reviewed source snapshot and private configuration/marketplace backups before updating. Remove the new installation, restore only this plugin's source/marketplace entry from that snapshot, reinstall it through the supported marketplace flow, and repeat cache inspection and human hook trust review. Restore only the affected configuration entries; do not replace a whole shared configuration file if unrelated settings changed after the backup.

The old portable `0.1.0` manifest did not load hooks on the inspected released clients. Restoring that artifact can restore its exact old bytes, but does not restore working native hooks. Prefer the corrected compatibility package when validating hook functionality. On CLI 0.163.0, manually review referenced-code changes even when the host does not automatically invalidate prior trust. See [version-specific trust evidence](continuation/CODEX-CONTRACTS.md#local-installation-updates-trust-and-removal).

The development proof has a separate identity, `claude-mods-native-proof@claude-mods-dev`, and must be removed separately if it was installed. Production removal does not remove that proof or authorize deleting its data.

## Observed dev6 lifecycle check

On2026-10-23, supported CLI0.163.0 removal of the owned production development
fixture removed its cache and fresh read-only app-server inventory showed no
production/hold hooks. Reinstalling the same unchanged immutable snapshot restored
all125 files byte-for-byte and three enabled/trusted hooks, zero errors. Parsed
user configuration was restored exactly, unrelated entries preserved throughout,
and runtime settings hash unchanged. No model turn, trust-file edit, marketplace
removal or data deletion. The existing human trust was retained for identical bytes;
changed source still requires human review even if the host retains trust.
Already-loaded desktop process unload, UI disable and older-version rollback were
not established by this fresh-session check. Private backups are retained.

## Explicit selected-scope retention (source26)

The POSIX [retention CLI](retention.md) previews only the scope selected by reviewed
private settings, then requires its unchanged fingerprint for explicit cleanup.
No automatic data deletion, sibling-scope discovery, MCP writer or lock reaping.
Both journals remain when any retained record is too recent. Deletion may partially
complete or leave locks after interruption; inspect after stopping writers, do not
retry automatically. Windows refuses before IO. Configured source26 is installed/human-trusted; bounded native hooks/panel/Watch acceptance passed after restart; full lifecycle remains incomplete; no cleanup
of installed production records was performed by this milestone.
