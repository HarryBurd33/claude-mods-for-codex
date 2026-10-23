export const MAX_STDIN_BYTES = 1024 * 1024;
export const MAX_CONFIG_BYTES = 256 * 1024;
export const MAX_JOURNAL_BYTES = 1024 * 1024;
export const MAX_JOURNAL_LINE_BYTES = 2048;
export const MAX_MESSAGE_CHARS = 1000;
// Released CLI0.163.0 observation only. Default hooks do not register these;
// they require explicit hook installation and a separate metadata opt-in.
export const OBSERVER_EVENTS = new Set([
  "Stop", "Interrupt", "PreCompact", "PostCompact", "SubagentStart", "SubagentStop", "SessionEnd",
]);
export const KNOWN_EVENTS = new Set([
  "SessionStart",
  "PreToolUse",
  "PostToolUse",
  ...OBSERVER_EVENTS,
]);
export const FORBIDDEN_OUTPUT_KEYS = new Set([
  "allow",
  "ask",
  "updatedInput",
  "continue",
  "stopReason",
  "suppressOutput",
  "approve",
]);
