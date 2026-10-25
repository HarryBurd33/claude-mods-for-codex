# Source32 configured-agent authoring review — 2026-10-24

High resumed fa365ba. Implemented strict `kind:agent` authoring in
src/agent-contract.mjs, integrated with component-contract/component-authoring and
the existing four component CLI commands. No installer/launcher/MCP endpoint, native
profile/global setting/parent-model/prompt/trust/logging change. Installed31 remains
the approved enabled251-file snapshot. Full93 incomplete.

## Contract and security decisions

- Exact private spec requires name/kind/description/instructions/model/reasoningEffort.
  Base agent.selected=false; intent may change only that boolean, selecting a review
  plan, never native activation/execution. Model availability remains unverified.
- Candidate emits exactly five literal TOML strings; bounded valid Unicode prevents
  basic-string escape ambiguity and multiline/key injection. No arbitrary config/
  permission keys or combined observer/status/interaction authority. Prefixmods- does
  not prove absence of scope/name collisions.
- Native discovery recursively selects .toml. The candidate is deliberately
  **agent-candidate.toml.txt**; even nested review bundles must emit no .toml file.
  Direct config_file references can still load it; only a reviewed explicit choice
  may install/reference it. No native enabled flag is invented.
- Child authority remains inherited from parent/host, not restricted by instructions.
  Exact model/effort and future usage/permissions are shown. No implicit child model
  choice, silent fallback or current request interception. Native inference needs a
  fresh bounded grant, separate from generation and human stage switches.
- Existing private bundle loader/generator/marker and Windows before-IO guard remain.
  Self-rehashing a forged extra TOML permission key still refuses regenerated-content
  comparison. Old observer/status/interaction artifacts retain their bytes/behavior.
- Shared invalidJSON guidance now describes literal fallback, without referring to
  a format selector unavailable in fixed authored fields. Regression checks actual
  literal fallback and no active markup. Installed31 still has its old message.

## Primary evidence

See [configured-agents](../configured-agents.md) for retrieved official docs and
released source links. CLI0.163 source83086188ae0614bd882818ff1aa23f3194962012 was
compared with installed0.164 release6aaac694803004a63c6f393d153c96d22521a6b9;
role/parser/discovery/child inheritance reviewed. The child config source was
identical; role source differed and was read at164. Official docs describe standalone
native roles; plugin discovery was not established. No unreleased-main claim.

The installed standalone CLI now reports0.164.0, unlike prior0.163 inventory. We did
not upgrade it. Exact desktop/internal-server version remains independently unverified.
Generated experimental JSON schema has no public agent/list method; effort is an
advertised nonempty string, not a fixed enum. Schema presence is not runtime proof.

## Commands/results actually observed

- Focused node tests for agents/components/interactions/rendering:29pass/1Windows-only
  skip/30total after the inert-extension correction. New6agent tests include real
  private CLI, strict authority/accessor/bounds checks, unchanged selection, forged
  candidate, active-base refusal, literal injection and no discoverable .toml output.
- `npm test`:252pass/112Windows-only skips/0fail/364total. No Windows host or CI
  claim from this local run. `npm run validate` valid3mods; `npm run replay` four existing
  fixtures produced expected notice/deny/abstentions without executing fixture text.
- Real source32 CLI generated the final private inert bundle; independent Python
  tomllib exact5keys/literalUnicode/quotes/backslashes/newline round-trip passed.
- Bounded initialize/config/read app-server proof, two separate child-only overrides,
  max20seconds/client1MiB256messages, no thread/start/turn/start: valid candidate
  no parse warning; malformed control emitted parse warning. Both references visible
  in config/read. Explicit override parsing is not directory discovery/effective
  model/effort/permission inheritance or configured-agent execution proof.
- Initial sandboxed app-server attempts exited before initialize; same bounded
  no-turn proof succeeded outside sandbox with normal authorization review. Raw local
  paths/results remain ignored; no system repair, home override or native config edit.
- Skill quick_validate.py attempted with system and bundled Python; both lack yaml.
  Validation therefore blocked on optional PyYAML, not claimed passed; no install or
  runtime repair. Independent Ruby YAML frontmatter parse passed; existing packaged
  skill/source checks passed as part of local suite.
- Prepared enabled31 preservation checker before/after native proof passed: cache251,
  config/owned trust/settings/sources/marketplace/data unchanged, zero model turns.

## Remaining and next stage — updated after Medium verification

Medium [PACKAGE-DEV32](PACKAGE-DEV32.md) verified exact CI/public archive/clone/
spaced extraction. No source or installed31 change. Next High for native acceptance.
Preserve installed31; do not install source32 or copy any agent to discovery as a
packaging side effect. Runtime configured-agent routing, native directory discovery,
effective authority and lifecycle remain unverified. Any paid run needs a precise
new reviewed task/model/effort/call/tool/deadline/output/usage/cancel plan and fresh
human authorization; none remains. No delegation/background continuation.

Read [HANDOFF](HANDOFF.md) for the exact Medium scope and resume instruction. High
before consequential launcher/config/security design, unexpected drift or recovery.
Windows private-storage bounds/image failures and all current guards are unchanged;
native Windows11/WSL unverified, macOS first, no repeated proof/availability loop.
