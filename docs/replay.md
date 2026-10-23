# Selected checkpoints and separate restoration

Development source0.2.0-dev.3; not installed or native-host verified. These
original components compare user-selected Git commits. They do not read private
sessions, infer turn boundaries or automatically create commits.

## Read-only inspection

```sh
node bin/codex-mods.mjs checkpoints --project /absolute/project --from FULL_FROM_COMMIT --to FULL_TO_COMMIT
node bin/codex-mods.mjs checkpoints --project /absolute/project --from FULL_FROM_COMMIT --to FULL_TO_COMMIT --include-diffs
node bin/codex-mods.mjs checkpoints --project /absolute/project --from FULL_FROM_COMMIT --to FULL_TO_COMMIT --path src/example.txt --include-diffs
```

Replace both commit placeholders with full lowercase40-character SHA-1 commit
IDs from the selected ordinary local Git repository. Branch names, revision
syntax, remote fetches, external object stores and linked worktrees are not
accepted. The first command lists status/names only. Patch content is a separate
opt-in and can contain sensitive data even when filenames pass exclusion rules.

Working tree, index and HEAD are unchanged. The source explicitly labels selected
commits; they can span human edits or multiple turns. If you deliberately make
commits before/after a turn, the comparison uses those boundaries, but does not
prove every edit was made by the assistant. Inspection creates no checkpoint.
Files ignored in today's working tree may exist in selected commits. Historical
symlinks/submodules and conservative secret/directory names are excluded.
Reads/processes/output share the bounded isolated Git adapter described in runtime.md.

For the owned Replay view, add to the reviewed private runtime settings:

```json
"checkpoints": {
  "fromCommit": "FULL_FROM_COMMIT",
  "toCommit": "FULL_TO_COMMIT"
}
```

Replace placeholders before validation. `allowChanges` still controls returning
patches through MCP. `mods.checkpoints` has no arguments; model/UI cannot change
the selected project/commits or request writes. Missing selection is unavailable.
Source Replay displays attribution and from/to IDs, with bounded literal patches.

## Explicit one-file restore

Restoring is a separate local CLI workflow. Nothing in inspection or the panel
invokes it. Ask explicitly to restore the chosen file before an assistant invokes
apply; a plan ID identifies reviewed content, **not authenticated human consent
or a native approval grant**. Ordinary host file/tool permissions still apply.

1. Inspect the relevant diff and select one file. Prepare a **new private plan
   outside the project**. Its parent must be private/current-user owned, without
   symlinks. Plan creation does not alter the selected project.

   ```sh
   node bin/codex-mods.mjs restore-plan --project /absolute/project --from FULL_FROM_COMMIT --to FULL_TO_COMMIT --path src/example.txt --output /absolute/private/restore-review.json
   ```

2. Review the planned change and its access. The local summary contains the exact
   canonical project root and relative path (keep these private),
   selected commits, byte counts, content hashes, effects/limits and a plan ID.
   Recheck it and current file compatibility with:

   ```sh
   node bin/codex-mods.mjs restore-review --plan /absolute/private/restore-review.json
   ```

   The0600 plan contains both file versions encoded as base64 plus a private
   project path. **Base64 is not encryption.** Keep it out of Git and public logs.
   Review the from/to patch as well; hashes alone do not explain an edit. Apply
   re-derives both versions from the selected local commits and rejects tampering.

3. Only after an explicit restore decision, use the exact reviewed plan ID:

   ```sh
   node bin/codex-mods.mjs restore-apply --plan /absolute/private/restore-review.json --confirm-plan REVIEWED_SHA256
   ```

   Apply requires the current file bytes and executable mode to match the to
   checkpoint. It writes the from content to only that existing file. Changed
   content, symlinks, hardlinks, special files/bits, read-only files, binary data,
   executable-mode transitions and absent endpoints are refused. Add/delete/rename
   restoration is not implemented; inspect and perform an explicit normal host
   operation if needed. There is no automatic merge or force option.

The text-file bound is256KiB. Current implementation is POSIX only; Windows
explicitly refuses pending ACL validation. Apply uses an exclusive cooperative
directory lock; it never steals an existing lock. It writes through the checked
file descriptor in place to retain inode/ownership/permissions and existing
extended metadata. Index, HEAD and unselected files stay unchanged.

In-place writes are **not atomic against process interruption**. Both versions
remain in the private plan; an ordinary write error attempts to restore original
bytes, while an interrupted process/disk error can require manual recovery. This
is not an OS boundary against hostile same-user processes or arbitrary concurrent
editors. Don't edit the selected file concurrently. If a crash leaves the lock,
first establish that no restore process is active and inspect the file/plan;
remove only that empty owned lock through an explicit recovery action. No automatic
lock stealing, background cleanup or automatic recovery write is performed.

After success, a second application conflicts rather than repeating the restore.
To undo deliberately, review a new plan with the two checkpoints reversed. Keep
the original plan until satisfied, then remove it explicitly under ordinary file
permissions. Nothing uploads its contents or retains it in activity metadata.

Automated tests use disposable repositories: selected-file restore/reversal,
late conflicts, exact plan ID, unchanged other edits/index/HEAD, inode/mode/owner,
competing calls, permissions/links, tampered plans and unsupported content/modes.
Actual installed-host apply, extended ACL/xattr verification and interrupted/disk
failure recovery still need acceptance; passing these tests is not that evidence.
