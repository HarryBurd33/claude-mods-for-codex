export const MAX_STDIN_BYTES = 1024 * 1024;
export const MAX_CONFIG_BYTES = 256 * 1024;
export const MAX_JOURNAL_BYTES = 1024 * 1024;
export const MAX_JOURNAL_LINE_BYTES = 2048;
export const MAX_MESSAGE_CHARS = 1000;
export const KNOWN_EVENTS = new Set([
  "SessionStart",
  "PreToolUse",
  "PostToolUse",
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
