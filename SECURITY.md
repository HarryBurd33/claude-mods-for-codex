# Security policy

## Supported versions

Until the first stable release, security fixes target the latest version on the default branch.

## Report a vulnerability

Please use GitHub's private vulnerability reporting feature for this repository. Do not open a public issue containing an exploit, private path, credential, transcript, or other sensitive data. If private reporting is unavailable, open a minimal issue asking the maintainer for a private contact channel without including vulnerability details.

## Security boundary

The dispatcher is an advisory policy mechanism. It does not replace Codex permissions, sandboxing, hook trust review, operating-system controls, or human review. A host hook failure or timeout may allow an operation to continue. The lexical guard does not parse shell syntax and cannot cover hosted or specialized tool paths that do not invoke the hook.

Configuration is data, not executable code. The release has no dynamic module loader, remote configuration, network client, install script, approval automation, or prompt rewriting. New mod implementations are reviewed source registered in `src/mods/registry.mjs`.

Journaling is disabled by default and accepts only a strict metadata record. Files are written only under the explicit `PLUGIN_DATA` directory supplied by Codex. The CLI report requires an explicit absolute data directory. Data directories and journal files must have private permissions and, on POSIX systems, belong to the current user. New directories use mode `0700` and new files use `0600`; unsuitable existing permissions are rejected. Symbolic links in data paths and hard-linked journal files are rejected. These are local privacy safeguards, not protection from a hostile process running as the same operating-system user. Windows ownership and permission behavior remains unverified. Reports create no files or directories and use bounded retries to detect cooperating writes or rotations; they can return a busy error. A short directory lock serializes normal concurrent writers; a process that terminates while holding that lock can stop later journal writes until the stale lock directory is removed manually. Hook decisions still return when journal writing fails.
