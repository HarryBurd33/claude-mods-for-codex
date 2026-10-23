#!/usr/bin/env node
import { realpath, stat } from "node:fs/promises";
import { isAbsolute, join, relative, sep } from "node:path";
import process from "node:process";
import { loadConfig } from "./config.mjs";
import { dispatch, validateEventEnvelope } from "./dispatcher.mjs";
import { MAX_STDIN_BYTES } from "./constants.mjs";
import { parseJsonObject, readBoundedStream } from "./io.mjs";
import { appendJournalEntry } from "./journal.mjs";
import { recordMetadataEvent } from "./state.mjs";

async function metadataScope(event, config) {
  const cwd = await realpath(event.cwd);
  if (!(await stat(cwd)).isDirectory()) throw new Error("hook cwd must be a directory");
  let projectId = cwd;
  const selected = process.env.CODEX_MODS_PROJECT_ROOT;
  if (selected !== undefined) {
    if (!isAbsolute(selected) || selected.length > 4096 || /\p{Cc}/u.test(selected)) throw new Error("selected project must be an absolute bounded path");
    projectId = await realpath(selected);
    if (!(await stat(projectId)).isDirectory()) throw new Error("selected project must be a directory");
    const child = relative(projectId, cwd);
    if (child === ".." || child.startsWith(`..${sep}`) || isAbsolute(child)) throw new Error("hook cwd is outside the selected project");
  }
  return { projectId, ...(config.metadataState.scope === "project" ? {} : { sessionId: event.session_id }) };
}

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
  let result;
  try {
    result = dispatch(event, config);
  } catch {
    // The envelope has already identified a covered event. Preparation/structural
    // failures must not discard its guard by escaping as a host hook failure.
    const output = event.hook_event_name === "PreToolUse" ? {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: "Claude Mods could not safely process this tool event; this tool call was denied for review.",
      },
    } : {};
    process.stderr.write("claude-mods-for-codex: event processing unavailable\n");
    process.stdout.write(`${JSON.stringify(output)}\n`);
    return;
  }
  const { output, journal, stateMetadata, diagnostic } = result;
  if (diagnostic !== null) process.stderr.write(`claude-mods-for-codex: ${diagnostic}\n`);
  if (journal !== null) {
    try {
      const dataDirectory = process.env.CODEX_MODS_DATA_DIR ?? process.env.PLUGIN_DATA;
      if (typeof dataDirectory !== "string" || dataDirectory.length === 0) {
        throw new Error("a data directory is required when journaling is enabled");
      }
      await appendJournalEntry(dataDirectory, journal);
    } catch {
      process.stderr.write("claude-mods-for-codex: activity journal unavailable\n");
    }
  }
  if (stateMetadata !== null) {
    try {
      const dataDirectory = process.env.CODEX_MODS_DATA_DIR ?? process.env.PLUGIN_DATA;
      await recordMetadataEvent(dataDirectory, await metadataScope(event, config), stateMetadata);
    } catch {
      // Telemetry availability never replaces a guard decision, adds arguments,
      // or echoes an identifier, input, path, prompt or exception to the host.
      process.stderr.write("claude-mods-for-codex: metadata state unavailable\n");
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
