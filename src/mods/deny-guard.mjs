function extractCommand(toolInput) {
  if (toolInput === null || Array.isArray(toolInput) || typeof toolInput !== "object") return null;
  return typeof toolInput.command === "string" ? toolInput.command : null;
}

function matchesRule(rule, event) {
  const toolMatches = rule.toolNames === null || rule.toolNames.includes(event.tool_name);
  const command = extractCommand(event.tool_input);
  const commandMatches = rule.commandContains === null
    || (command !== null && rule.commandContains.some((literal) => command.includes(literal)));
  return toolMatches && commandMatches;
}

export const denyGuard = {
  type: "denyGuard",
  // Re-run policy checks against the one proposed command before emitting it.
  inspectReplacement: true,
  allowedKeys: ["rules"],
  validate(raw, context) {
    if (!Array.isArray(raw.rules) || raw.rules.length === 0 || raw.rules.length > 64) {
      context.fail(`${context.where}.rules must contain 1 to 64 rules`);
    }
    const rules = raw.rules.map((rule, ruleIndex) => {
      const where = `${context.where}.rules[${ruleIndex}]`;
      if (rule === null || Array.isArray(rule) || typeof rule !== "object") context.fail(`${where} must be an object`);
      context.assertOnlyKeys(rule, new Set(["toolNames", "commandContains", "reason"]), where);
      const toolNames = rule.toolNames === undefined
        ? null
        : context.cleanStringArray(rule.toolNames, `${where}.toolNames`, { maxChars: 80 });
      const commandContains = rule.commandContains === undefined
        ? null
        : context.cleanStringArray(rule.commandContains, `${where}.commandContains`, { maxChars: 160 });
      if (toolNames === null && commandContains === null) context.fail(`${where} needs toolNames or commandContains`);
      const reason = context.cleanString(rule.reason, `${where}.reason`, 500);
      if (reason.trim().length === 0) context.fail(`${where}.reason must contain visible text`);
      return { toolNames, commandContains, reason };
    });
    return { rules };
  },
  handle(event, options) {
    if (event.hook_event_name !== "PreToolUse") return {};
    const match = options.rules.find((rule) => matchesRule(rule, event));
    return match === undefined ? {} : { denyReason: match.reason };
  },
};
