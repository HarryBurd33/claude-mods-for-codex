export const sessionNotice = {
  type: "sessionNotice",
  allowedKeys: ["message"],
  validate(raw, context) {
    return { message: context.cleanString(raw.message, `${context.where}.message`, context.maxMessageChars) };
  },
  handle(event, options) {
    return event.hook_event_name === "SessionStart" ? { message: options.message } : {};
  },
};
