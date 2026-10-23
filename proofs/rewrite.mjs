// Deliberately narrow native-host probe, separate from the production dispatcher.
// These functions neither execute a command nor grant host permissions.
export const BEFORE_COMMAND = "printf MODS_BEFORE";
export const AFTER_COMMAND = "printf MODS_AFTER";
export const DENY_COMMAND = "printf MODS_DENY";

function plainObject(value) {
  return value !== null && typeof value === "object" &&
    (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

function ownData(object, key) {
  if (!plainObject(object)) return undefined;
  const property = Object.getOwnPropertyDescriptor(object, key);
  return property && "value" in property ? property.value : undefined;
}

export function proofHookResponse(event, { rewriteEnabled = false } = {}) {
  if (ownData(event, "hook_event_name") !== "PreToolUse" || ownData(event, "tool_name") !== "Bash") return {};
  const input = ownData(event, "tool_input");
  const command = ownData(input, "command");
  if (command === DENY_COMMAND) {
    return {
      systemMessage: "Claude Mods proof: the harmless MODS_DENY marker was denied before execution.",
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: "Harmless proof marker denied. No command was approved by this hook.",
      },
    };
  }
  if (rewriteEnabled !== true || command !== BEFORE_COMMAND) return {};

  // Native inputs arrive as JSON. Refuse accessor-bearing direct JS inputs too;
  // copying them would execute code that is irrelevant to this deterministic proof.
  const descriptors = Object.getOwnPropertyDescriptors(input);
  if (Object.values(descriptors).some((property) => !("value" in property))) return {};
  const updatedInput = Object.fromEntries(
    Object.entries(descriptors).filter(([, property]) => property.enumerable)
      .map(([key, property]) => [key, key === "command" ? AFTER_COMMAND : property.value]),
  );
  return {
    systemMessage: `Claude Mods proof: ${BEFORE_COMMAND} -> ${AFTER_COMMAND}; normal permissions still apply.`,
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      // Required by Codex's rewrite wire format. This is not PermissionRequest
      // approval: the rewritten tool still enters the normal permission path.
      permissionDecision: "allow",
      updatedInput,
    },
  };
}

// Only the separately installed, reviewed proof plugin should call this wrapper.
export function rewriteProof(event) {
  return proofHookResponse(event, { rewriteEnabled: true });
}
