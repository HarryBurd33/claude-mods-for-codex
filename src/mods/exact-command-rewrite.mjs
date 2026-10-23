// Configuration is reviewed local data, never generated from the tool envelope.
// Restrict this first transformation adapter to the released canonical Bash
// command field; changing sandbox/permission/model/prompt fields is not an API.
export const MAX_REWRITE_COMMAND_CHARS = 200;

export const exactCommandRewrite = {
  type: "exactCommandRewrite",
  allowedKeys: ["rules"],
  validate(raw, context) {
    if (!Array.isArray(raw.rules) || raw.rules.length === 0 || raw.rules.length > 32) {
      context.fail(`${context.where}.rules must contain 1 to 32 rules`);
    }
    const inputs = new Set();
    return { rules: raw.rules.map((rule, index) => {
      const where = `${context.where}.rules[${index}]`;
      if (rule === null || Array.isArray(rule) || typeof rule !== "object") context.fail(`${where} must be an object`);
      context.assertOnlyKeys(rule, new Set(["toolName", "fromCommand", "toCommand"]), where);
      if (rule.toolName !== "Bash") context.fail(`${where}.toolName must be Bash`);
      const fromCommand = context.cleanString(rule.fromCommand, `${where}.fromCommand`, MAX_REWRITE_COMMAND_CHARS);
      const toCommand = context.cleanString(rule.toCommand, `${where}.toCommand`, MAX_REWRITE_COMMAND_CHARS);
      if (fromCommand.trim().length === 0 || toCommand.trim().length === 0) context.fail(`${where} commands must contain visible text`);
      if (/\p{Cf}/u.test(fromCommand) || /\p{Cf}/u.test(toCommand)) context.fail(`${where} commands must not contain invisible formatting controls`);
      if (fromCommand === toCommand) context.fail(`${where} must change the command`);
      if (inputs.has(fromCommand)) context.fail(`${where} duplicates an exact command rule`);
      inputs.add(fromCommand);
      return { toolName: "Bash", fromCommand, toCommand };
    }) };
  },
  handle(event, options) {
    if (event.hook_event_name !== "PreToolUse" || event.tool_name !== "Bash"
      || event.tool_input === null || typeof event.tool_input !== "object" || Array.isArray(event.tool_input)) {
      return { kind: "abstain" };
    }
    const rule = options.rules.find((entry) => entry.fromCommand === event.tool_input.command);
    return rule === undefined ? { kind: "abstain" } : { kind: "replaceCommand", command: rule.toCommand };
  },
};
