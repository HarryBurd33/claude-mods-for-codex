import { types } from "node:util";
import { KNOWN_EVENTS, MAX_MESSAGE_CHARS, OBSERVER_EVENTS } from "./constants.mjs";
import { getModDefinition } from "./mods/registry.mjs";
import { MAX_REWRITE_COMMAND_CHARS } from "./mods/exact-command-rewrite.mjs";

export function validateEventEnvelope(event) {
  if (event === null || Array.isArray(event) || typeof event !== "object"
    || ![Object.prototype, null].includes(Object.getPrototypeOf(event))) throw new Error("event must be a JSON object");
  for (const key of Reflect.ownKeys(event)) {
    if (typeof key !== "string" || !Object.hasOwn(Object.getOwnPropertyDescriptor(event, key), "value")) throw new Error("event must contain JSON data fields");
  }
  if (typeof event.hook_event_name !== "string") throw new Error("event.hook_event_name must be a string");
  if (!KNOWN_EVENTS.has(event.hook_event_name)) return false;
  for (const key of ["cwd", "session_id"]) {
    if (typeof event[key] !== "string" || event[key].length === 0) throw new Error(`event.${key} must be a non-empty string`);
  }
  if (!(event.transcript_path === null || typeof event.transcript_path === "string")) {
    throw new Error("event.transcript_path must be a string or null");
  }
  if (OBSERVER_EVENTS.has(event.hook_event_name)) {
    const name = event.hook_event_name;
    if (name === "SessionEnd") {
      if (event.reason !== "other") throw new Error("SessionEnd reason is invalid for CLI0.163.0");
    } else {
      for (const key of ["model", "turn_id"]) if (typeof event[key] !== "string" || event[key].length === 0) throw new Error(`observer ${key} must be a non-empty string`);
      if (["PreCompact", "PostCompact"].includes(name)) {
        if (!["manual", "auto"].includes(event.trigger)) throw new Error("observer compaction trigger is invalid");
      } else if (!["default", "acceptEdits", "plan", "dontAsk", "bypassPermissions"].includes(event.permission_mode)) throw new Error("observer permission_mode is invalid");
      if (["Stop", "SubagentStop"].includes(name) && typeof event.stop_hook_active !== "boolean") throw new Error("observer stop_hook_active must be boolean");
      if (["SubagentStart", "SubagentStop"].includes(name)) for (const key of ["agent_id", "agent_type"]) {
        if (typeof event[key] !== "string" || !event[key].length) throw new Error(`observer ${key} must be a non-empty string`);
      }
    }
    // Optional response/transcript payloads are never accessed by this lane.
    return true;
  }
  if (event.hook_event_name === "SessionStart") {
    if (typeof event.model !== "string" || event.model.length === 0) throw new Error("event.model must be a non-empty string");
    if (!["default", "acceptEdits", "plan", "dontAsk", "bypassPermissions"].includes(event.permission_mode)) {
      throw new Error("event.permission_mode is invalid");
    }
    if (!["startup", "resume", "clear", "compact", "fork"].includes(event.source)) throw new Error("event.source is invalid");
  }
  if (event.hook_event_name === "PreToolUse" || event.hook_event_name === "PostToolUse") {
    if (typeof event.tool_name !== "string" || !/^[A-Za-z0-9_.:-]{1,256}$/.test(event.tool_name)) {
      throw new Error("tool event tool_name must be a safe identifier of at most 256 characters");
    }
    if (!Object.hasOwn(event, "tool_input")) throw new Error("tool event requires tool_input");
    for (const key of ["model", "permission_mode", "tool_use_id", "turn_id"]) {
      if (typeof event[key] !== "string" || event[key].length === 0) throw new Error(`tool event ${key} must be a non-empty string`);
    }
    if (event.hook_event_name === "PostToolUse" && !Object.hasOwn(event, "tool_response")) {
      throw new Error("PostToolUse event requires tool_response");
    }
  }
  return true;
}

function validText(value, limit, allowNewlines = false) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= limit
    && !/\p{Cc}/u.test(allowNewlines ? value.replaceAll("\n", "") : value);
}

function validReplacementCommand(value) {
  return validText(value, MAX_REWRITE_COMMAND_CHARS) && !/\p{Cf}/u.test(value);
}

function dataRecord(value, allowed, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)
    || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new Error(`${label} must be a plain object`);
  for (const key of Reflect.ownKeys(value)) {
    if (!allowed.includes(key)) throw new Error(`${label} contains unsupported fields`);
    if (!Object.hasOwn(Object.getOwnPropertyDescriptor(value, key), "value")) throw new Error(`${label} must contain data fields`);
  }
}

// Never run toJSON/getters or copy permission fields from a proposed replacement.
// Native envelopes are JSON; direct trusted/test callers receive the same bounds.
function cloneToolInput(input) {
  let nodes = 0;
  function clone(value, depth) {
    nodes += 1;
    if (depth > 32 || nodes > 16384) throw new Error("tool input exceeds structural limits");
    if (value === null || typeof value === "boolean" || typeof value === "string") return value;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value !== "object") throw new Error("tool input must be JSON data");
    if (!Array.isArray(value) && ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new Error("tool input must be JSON data");
    const entries = [];
    for (const key of Reflect.ownKeys(value)) {
      if (Array.isArray(value) && key === "length") continue;
      if (typeof key !== "string") throw new Error("tool input keys must be strings");
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!Object.hasOwn(descriptor, "value") || !descriptor.enumerable) throw new Error("tool input must contain enumerable data");
      if (Array.isArray(value) && !/^(0|[1-9][0-9]*)$/.test(key)) throw new Error("tool input arrays must contain JSON entries");
      entries.push([key, clone(descriptor.value, depth + 1)]);
    }
    if (Array.isArray(value)) {
      if (entries.length !== value.length) throw new Error("tool input arrays must not be sparse");
      return entries.map(([, entry]) => entry);
    }
    return Object.fromEntries(entries);
  }
  const result = clone(input, 0);
  if (result === null || Array.isArray(result) || typeof result !== "object") throw new Error("Bash input must be an object");
  if (Buffer.byteLength(JSON.stringify(result)) > 1024 * 1024) throw new Error("tool input exceeds byte limit");
  return result;
}

export function replacementNotice(before, after) {
  return `Claude Mods command replacement: ${JSON.stringify(before)} -> ${JSON.stringify(after)}. Normal permissions still apply.`;
}

function freezeData(value) {
  if (value !== null && typeof value === "object") {
    for (const entry of Object.values(value)) freezeData(entry);
    Object.freeze(value);
  }
  return value;
}

export function validateHandlerResult(result, eventName) {
  if (types.isPromise(result)) {
    // A mistaken async handler must not leave an unhandled rejection behind.
    Promise.prototype.then.call(result, undefined, () => {});
    throw new Error("mod handlers must be synchronous");
  }
  dataRecord(result, ["kind", "message", "reason", "command", "denyReason", "journal"], "mod result");
  if (Object.hasOwn(result, "kind")) {
    const shape = {
      abstain: ["kind"], notice: ["kind", "message"],
      deny: ["kind", "reason"], replaceCommand: ["kind", "command"],
    }[result.kind];
    if (shape === undefined || Object.keys(result).sort().join(",") !== [...shape].sort().join(",")) throw new Error("mod result has an invalid v2 shape");
    if (result.kind === "abstain") return {};
    if (result.kind === "notice") {
      if (!validText(result.message, MAX_MESSAGE_CHARS)) throw new Error("mod text is invalid");
      return { message: result.message };
    }
    if (eventName !== "PreToolUse") throw new Error("mod denial or replacement requires PreToolUse");
    if (result.kind === "deny") {
      if (!validText(result.reason, 500)) throw new Error("mod text is invalid");
      return { denyReason: result.reason };
    }
    if (!validReplacementCommand(result.command)) throw new Error("replacement command is invalid");
    return { commandReplacement: result.command };
  }
  const normalized = {};
  for (const key of Reflect.ownKeys(result)) {
    if (!["message", "denyReason", "journal"].includes(key)) throw new Error("mod result contains unsupported fields");
    const descriptor = Object.getOwnPropertyDescriptor(result, key);
    if (!Object.hasOwn(descriptor, "value")) throw new Error("mod result must contain data fields");
    const value = descriptor.value;
    if (key === "journal") {
      if (typeof value !== "boolean") throw new Error("mod journal signal must be boolean");
    } else {
      if (key === "denyReason" && eventName !== "PreToolUse") throw new Error("mod denial requires PreToolUse");
      if (!validText(value, key === "message" ? MAX_MESSAGE_CHARS : 500)) throw new Error("mod text is invalid");
    }
    normalized[key] = value;
  }
  return normalized;
}

// The resolver is a trusted source/test seam, never configurable by hook input.
export function dispatch(event, config, resolveDefinition = getModDefinition) {
  if (!validateEventEnvelope(event)) return { output: {}, journal: null, stateMetadata: null, diagnostic: "unsupported hook event" };
  if (OBSERVER_EVENTS.has(event.hook_event_name)) {
    // Never call mod handlers for stop/interrupt/compaction/subagent/end events:
    // observation cannot block/continue a turn, rewrite context, or start work.
    // Do not clone or retain last_assistant_message, prompts, agent IDs or paths.
    return {
      output: {}, journal: null, diagnostic: null,
      stateMetadata: config.metadataState?.enabled === true && config.metadataState.observerEvents?.includes(event.hook_event_name)
        ? { event: event.hook_event_name } : null,
    };
  }
  // Each handler sees immutable JSON copied before invoking trusted definitions.
  // Even a mistaken handler cannot mutate a permission field for a later one.
  event = freezeData(cloneToolInput(event));
  const systemMessages = [];
  let denial = null;
  let journalEnabled = false;
  let handlerFailed = false;
  const proposals = new Set();

  for (const mod of config.mods) {
    if (!mod.enabled) continue;
    try {
      const result = validateHandlerResult(resolveDefinition(mod.type).handle(event, mod.options), event.hook_event_name);
      if (result.message !== undefined) systemMessages.push(result.message);
      if (result.denyReason !== undefined && denial === null) denial = result.denyReason;
      if (result.journal === true) journalEnabled = true;
      if (result.commandReplacement !== undefined) {
        if (event.tool_name !== "Bash") throw new Error("replacement requires canonical Bash tool");
        proposals.add(result.commandReplacement);
      }
    } catch {
      handlerFailed = true;
      if (event.hook_event_name === "PreToolUse" && denial === null) {
        denial = "A Claude Mods handler failed; this tool call was denied for review.";
      }
    }
  }

  let replacement;
  if (denial === null && proposals.size > 0) {
    try {
      if (proposals.size !== 1) throw new Error("conflicting replacement proposals");
      const input = cloneToolInput(event.tool_input);
      const command = [...proposals][0];
      if (!validReplacementCommand(input.command) || command === input.command) throw new Error("replacement requires a bounded changed command");
      replacement = { ...input, command };
      // Run the registered guards again with changed input. They can deny only;
      // this pass cannot chain transformations or re-enable any disabled mod.
      const revisedEvent = freezeData({ ...event, tool_input: replacement });
      for (const mod of config.mods) {
        if (!mod.enabled) continue;
        const definition = resolveDefinition(mod.type);
        if (definition.inspectReplacement !== true) continue;
        const result = validateHandlerResult(definition.handle(revisedEvent, mod.options), "PreToolUse");
        if (result.commandReplacement !== undefined) throw new Error("a replacement review cannot transform input");
        if (result.denyReason !== undefined && denial === null) denial = result.denyReason;
      }
    } catch {
      handlerFailed = true;
      if (denial === null) denial = "Claude Mods could not safely apply the requested command replacement; this tool call was denied for review.";
    }
  }

  let output = {};
  if (denial !== null) {
    output = {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: denial,
      },
    };
  } else if (replacement !== undefined) {
    output = {
      // This exact before/after is never journaled and cannot be truncated away
      // by other notices. It discloses the explicitly configured command change.
      systemMessage: replacementNotice(event.tool_input.command, replacement.command),
      hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "allow", updatedInput: replacement },
    };
  } else if (systemMessages.length > 0) {
    output = { systemMessage: systemMessages.join("\n").slice(0, MAX_MESSAGE_CHARS) };
  }

  assertSafeOutput(output, event);
  const metadata = {
    event: event.hook_event_name,
    ...(typeof event.tool_name === "string" ? { tool: event.tool_name.slice(0, 256) } : {}),
    ...(denial === null ? {} : { decision: "deny" }),
  };
  return {
    output, journal: journalEnabled ? metadata : null,
    stateMetadata: config.metadataState?.enabled === true ? metadata : null,
    diagnostic: handlerFailed ? "one or more mod handlers failed" : null,
  };
}

export function assertSafeOutput(output, event) {
  dataRecord(output, ["systemMessage", "hookSpecificOutput"], "hook output");
  const keys = Object.keys(output);
  if (keys.length === 0) return;
  if (keys.length === 1 && keys[0] === "systemMessage") {
    if (!validText(output.systemMessage, MAX_MESSAGE_CHARS, true)) {
      throw new Error("systemMessage is invalid");
    }
    return;
  }
  if (keys.length === 1 && keys[0] === "hookSpecificOutput") {
    const specific = output.hookSpecificOutput;
    dataRecord(specific, ["hookEventName", "permissionDecision", "permissionDecisionReason"], "hookSpecificOutput");
    const specificKeys = Object.keys(specific).sort();
    if (specificKeys.join(",") !== "hookEventName,permissionDecision,permissionDecisionReason") {
      throw new Error("hookSpecificOutput contains unsupported fields");
    }
    if (specific.hookEventName !== "PreToolUse" || specific.permissionDecision !== "deny") {
      throw new Error("only PreToolUse deny decisions are supported");
    }
    if (!validText(specific.permissionDecisionReason, 500)) {
      throw new Error("permissionDecisionReason is invalid");
    }
    return;
  }
  if (keys.length === 2 && keys.includes("systemMessage") && keys.includes("hookSpecificOutput")) {
    const specific = output.hookSpecificOutput;
    dataRecord(specific, ["hookEventName", "permissionDecision", "updatedInput"], "hookSpecificOutput");
    if (Object.keys(specific).sort().join(",") !== "hookEventName,permissionDecision,updatedInput"
      || specific.hookEventName !== "PreToolUse" || specific.permissionDecision !== "allow"
      || event?.hook_event_name !== "PreToolUse" || event.tool_name !== "Bash") throw new Error("only a paired PreToolUse Bash replacement is supported");
    const original = cloneToolInput(event.tool_input);
    const updated = cloneToolInput(specific.updatedInput);
    if (!validReplacementCommand(original.command) || !validReplacementCommand(updated.command)
      || original.command === updated.command || JSON.stringify({ ...original, command: updated.command }) !== JSON.stringify(updated)) {
      throw new Error("replacement may change only command and must preserve every other input field");
    }
    if (output.systemMessage !== replacementNotice(original.command, updated.command)
      || !validText(output.systemMessage, MAX_MESSAGE_CHARS)) throw new Error("replacement requires the complete visible before/after notice");
    return;
  }
  throw new Error("hook output contains unsupported fields");
}
