# Removal

Use the same surface through which you installed the plugin.

1. Disable or uninstall `claude-mods-for-codex` in the desktop Plugins Directory.
2. Remove only its entry from the local `marketplace.json`; preserve every other entry.
3. Remove the copied plugin folder if you no longer need the source.
4. Restart the desktop app and inspect `/hooks` to confirm the plugin hook source is gone.

If you enabled journaling, the plugin's data directory can contain `activity.jsonl`, `activity.previous.jsonl`, or a stale `.activity-journal.lock` directory. The plugin never discovers or deletes that directory for you. Locate the exact plugin data directory through the host or your own setup records, inspect it, and remove it only if you no longer need the local metadata.

Removing the Git checkout does not necessarily remove a cached marketplace installation. Removing a marketplace entry does not delete journal data. No removal script is provided because automated edits could damage unrelated settings or data.
