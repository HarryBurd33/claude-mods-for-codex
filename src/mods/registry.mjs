import { activityJournal } from "./activity-journal.mjs";
import { denyGuard } from "./deny-guard.mjs";
import { sessionNotice } from "./session-notice.mjs";
import { exactCommandRewrite } from "./exact-command-rewrite.mjs";

const definitions = new Map([
  sessionNotice,
  denyGuard,
  activityJournal,
  exactCommandRewrite,
].map((definition) => [definition.type, Object.freeze(definition)]));

export function getModDefinition(type) {
  return definitions.get(type);
}

export function listModTypes() {
  return [...definitions.keys()];
}
