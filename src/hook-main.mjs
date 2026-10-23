#!/usr/bin/env node
import { join } from "node:path";
import process from "node:process";
import { loadConfig } from "./config.mjs";
import { dispatch, validateEventEnvelope } from "./dispatcher.mjs";
import { MAX_STDIN_BYTES } from "./constants.mjs";
import { parseJsonObject, readBoundedStream } from "./io.mjs";
import { appendJournalEntry } from "./journal.mjs";

async function main() {
  const pluginRoot = process.env.PLUGIN_ROOT;
  if (typeof pluginRoot !== "string" || pluginRoot.length === 0) throw new Error("PLUGIN_ROOT is required");
  const event = parseJsonObject(await readBoundedStream(process.stdin, MAX_STDIN_BYTES), "hook input");
  const knownEvent = validateEventEnvelope(event);
  if (!knownEvent) {
    process.stderr.write("claude-mods-for-codex: unsupported hook event\n");
    process.stdout.write("{}\n");
    return;
  }
  let config;
  try {
    config = await loadConfig(process.env.CODEX_MODS_CONFIG || join(pluginRoot, "config", "mods.json"));
  } catch {
    const output = event.hook_event_name === "PreToolUse" ? {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: "Claude Mods configuration could not be loaded; this tool call was denied for review.",
      },
    } : {};
    process.stderr.write("claude-mods-for-codex: configuration unavailable\n");
    process.stdout.write(`${JSON.stringify(output)}\n`);
    return;
  }
  const { output, journal, diagnostic } = dispatch(event, config);
  if (diagnostic !== null) process.stderr.write(`claude-mods-for-codex: ${diagnostic}\n`);
  if (journal !== null) {
    try {
      if (typeof process.env.PLUGIN_DATA !== "string" || process.env.PLUGIN_DATA.length === 0) {
        throw new Error("PLUGIN_DATA is required when journaling is enabled");
      }
      await appendJournalEntry(process.env.PLUGIN_DATA, journal);
    } catch {
      process.stderr.write("claude-mods-for-codex: activity journal unavailable\n");
    }
  }
  process.stdout.write(`${JSON.stringify(output)}\n`);
}

main().catch((error) => {
  const safeMessage = error?.message === "input exceeds 1048576 bytes"
    ? "hook input exceeds the size limit"
    : "invalid hook input";
  process.stderr.write(`claude-mods-for-codex: ${safeMessage}\n`);
  process.exitCode = 1;
});
