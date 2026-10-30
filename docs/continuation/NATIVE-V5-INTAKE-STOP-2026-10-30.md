# Native v5 approval intake stopped before startup

October 30, 2026. The human approved the exact revision 5 packet and its disclosed
startup exposure, requested Sol High guidance, and required stopping at any failed
gate. Fresh read-only preflight failed before the 15-minute clock or owned setup.
The batch was stopped; no launch command was issued to the human.

## Failed host prerequisite

The approved packet pins CLI 0.165.0. Its executable, package metadata and all 38
selected CLI resource files are now absent: 40 missing entries. The other 21 selected
entry hashes, 40 component-source pins and owned artifact pins match. The approved
seal and packet bytes are unchanged.

The installed stable entry resolves to a 0.166.0 installation, and its package metadata
reports version 0.166.0 for aarch64-apple-darwin. This is a filesystem/package observation;
no version command or replacement client was executed. The replacement has not been
reviewed, selected or approved for this campaign. Cause, actor, provenance and native
compatibility are not established by this observation.

Preflight ran once and returned exit 1. Its original stderr was not retained by the
initial read-only caller. The missing exact-host prerequisite was established by a
subsequent direct file/pin comparison, without repeating the failed helper. The later
launcher/cache gates were not run after failure. No test or CI rerun occurred.

## Preserved state

- No batch clock, hook registration, trial attempt, native startup or model prompt.
- Fresh data remains empty; no owned declaration exists, so no hook cleanup is needed.
- Current configuration bytes equal the approved baseline; zero semantic differences
  and no native permission/trust/configuration writes.
- Collector remains disabled and unloaded; no service-manager mutation.
- The human reported that Sol High still needed selection. No model transition was
  performed; only the prerequisite stop, evidence and publication were completed.

The v5 preparation and independent review remain historical evidence for their bound
host. This approval does not cover substituting 0.166.0, recreating the old installation
or retrying the failed packet. Next work requires a separate review of the currently
available host and a fresh exact packet/approval before any native action. There was
no 15-minute window to expire or reset. All 93 requirement dispositions remain unchanged;
completed storage, UI and archive checks remain preserved without repetition.
