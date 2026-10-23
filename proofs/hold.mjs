// Separate, opt-in native MCP-hook probe. It never executes a command, changes
// tool arguments, or emits a PermissionRequest approval. Host hook failures can
// still fail open; this helper is not a security enforcement boundary.
export const HOLD_COMMAND = "printf MODS_HOLD";
export const HOLD_TIMEOUT_MS = 30_000;

function ownData(object, key) {
  if (object === null || typeof object !== "object" || Array.isArray(object)) return undefined;
  const prototype = Object.getPrototypeOf(object);
  if (prototype !== Object.prototype && prototype !== null) return undefined;
  const property = Object.getOwnPropertyDescriptor(object, key);
  return property && "value" in property ? property.value : undefined;
}

export function matchesHoldEvent(event) {
  return ownData(event, "hook_event_name") === "PreToolUse" &&
    ownData(event, "tool_name") === "Bash" &&
    ownData(ownData(event, "tool_input"), "command") === HOLD_COMMAND;
}

// Return a fresh form so a transport cannot change later requests. A nonempty
// required boolean prevents the released host's empty-form automatic acceptance.
// It cannot prove that an accept response originated from a human: the host can
// have an automated reviewer, and MCP does not guarantee response provenance.
export function holdElicitationRequest() {
  return {
    mode: "form",
    message: `Claude Mods harmless hold probe: ${HOLD_COMMAND} prints a fixed marker. Confirm only to continue through the host's normal permissions. Decline or cancel to block this covered call.`,
    requestedSchema: {
      type: "object",
      properties: {
        confirm: {
          type: "boolean",
          title: "Continue this harmless probe",
          description: "I choose to continue the fixed print command through normal host permissions.",
        },
      },
      required: ["confirm"],
    },
  };
}

function deny(reason) {
  return {
    systemMessage: `Claude Mods hold proof: ${reason}`,
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: `Harmless hold marker blocked: ${reason}`,
    },
  };
}

export function holdDecision(response) {
  const action = ownData(response, "action");
  // Released auto-review responses carry this metadata. Absence of the marker
  // is not a human attestation; actual host interaction still needs verification.
  const reviewer = ownData(ownData(response, "_meta"), "approvals_reviewer");
  if (reviewer === "auto_review") return deny("automated review cannot confirm this probe.");
  if (action === "accept" && ownData(ownData(response, "content"), "confirm") === true) return {};
  if (action === "decline") return deny("the elicitation was declined.");
  if (action === "cancel") return deny("the elicitation was cancelled.");
  return deny("no valid affirmative confirmation was received.");
}

// elicit(params, {signal}) must send an MCP elicitation/create request, resolve
// only its matching JSON-RPC result, and cancel its pending request on abort.
// The server must keep reading responses while this promise is pending.
export async function holdProof(event, { enabled = false, elicit, signal, timeoutMs = HOLD_TIMEOUT_MS } = {}) {
  if (enabled !== true || !matchesHoldEvent(event)) return {};
  if (typeof elicit !== "function") return deny("the elicitation transport is unavailable.");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > HOLD_TIMEOUT_MS) {
    return deny("the decision deadline is invalid.");
  }
  if (signal?.aborted) return deny("the covered call was cancelled.");

  const controller = new AbortController();
  let timer;
  let onAbort;
  try {
    const cancelled = new Promise((resolve) => {
      onAbort = () => {
        controller.abort();
        resolve(deny("the covered call was cancelled."));
      };
      signal?.addEventListener("abort", onAbort, { once: true });
      timer = setTimeout(() => {
        controller.abort();
        resolve(deny("the decision deadline expired."));
      }, timeoutMs);
    });
    const decision = Promise.resolve().then(() => {
      if (controller.signal.aborted) return deny("the covered call was cancelled.");
      return Promise.resolve(elicit(holdElicitationRequest(), { signal: controller.signal }))
        .then(holdDecision, () => deny("the elicitation transport failed or disconnected."));
    });
    return await Promise.race([decision, cancelled]);
  } catch {
    return deny("the elicitation transport failed or disconnected.");
  } finally {
    clearTimeout(timer);
    if (onAbort) signal?.removeEventListener("abort", onAbort);
  }
}
