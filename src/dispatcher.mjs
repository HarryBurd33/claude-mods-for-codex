import { types } from "node:util";
import { KNOWN_EVENTS, MAX_MESSAGE_CHARS } from "./constants.mjs";
import { getModDefinition } from "./mods/registry.mjs";

export function validateEventEnvelope(event) {
  if (event === null || Array.isArray(event) || typeof event !== "object") throw new Error("event must be a JSON object");
  if (typeof event.hook_event_name !== "string") throw new Error("event.hook_event_name must be a string");
  if (!KNOWN_EVENTS.has(event.hook_event_name)) return false;
  for (const key of ["cwd", "session_id"]) {
    if (typeof event[key] !== "string" || event[key].length === 0) throw new Error(`event.${key} must be a non-empty string`);
  }
  if (!(event.transcript_path === null || typeof event.transcript_path === "string")) {
    throw new Error("event.transcript_path must be a string or null");
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

export function validateHandlerResult(result, eventName) {
  if (types.isPromise(result)) {
    // A mistaken async handler must not leave an unhandled rejection behind.
    Promise.prototype.then.call(result, undefined, () => {});
    throw new Error("mod handlers must be synchronous");
  }
  if (result === null || typeof result !== "object" || Array.isArray(result)
    || ![Object.prototype, null].includes(Object.getPrototypeOf(result))) {
    throw new Error("mod result must be a plain object");
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
  if (!validateEventEnvelope(event)) return { output: {}, journal: null, diagnostic: "unsupported hook event" };
  const systemMessages = [];
  let denial = null;
  let journalEnabled = false;
  let handlerFailed = false;

  for (const mod of config.mods) {
    if (!mod.enabled) continue;
    try {
      const result = validateHandlerResult(resolveDefinition(mod.type).handle(event, mod.options), event.hook_event_name);
      if (result.message !== undefined) systemMessages.push(result.message);
      if (result.denyReason !== undefined && denial === null) denial = result.denyReason;
      if (result.journal === true) journalEnabled = true;
    } catch {
      handlerFailed = true;
      if (event.hook_event_name === "PreToolUse" && denial === null) {
        denial = "A Claude Mods handler failed; this tool call was denied for review.";
      }
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
  } else if (systemMessages.length > 0) {
    output = { systemMessage: systemMessages.join("\n").slice(0, MAX_MESSAGE_CHARS) };
  }

  assertSafeOutput(output);
  const journal = journalEnabled ? {
    event: event.hook_event_name,
    ...(typeof event.tool_name === "string" ? { tool: event.tool_name.slice(0, 256) } : {}),
    ...(denial === null ? {} : { decision: "deny" }),
  } : null;
  return { output, journal, diagnostic: handlerFailed ? "one or more mod handlers failed" : null };
}

export function assertSafeOutput(output) {
  if (output === null || Array.isArray(output) || typeof output !== "object") throw new Error("hook output must be an object");
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
    if (specific === null || Array.isArray(specific) || typeof specific !== "object") throw new Error("hookSpecificOutput is invalid");
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
  throw new Error("hook output contains unsupported fields");
}
