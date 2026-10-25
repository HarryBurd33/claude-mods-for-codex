// Declarative local-preview cards only. This module is shared with the offline
// webview; no IO, imports, callbacks, paths or user-provided code.
function interactionError() { throw Error('Invalid authored local interaction data'); }
function interactionRecord(value, keys) {
  if (!value || typeof value !== 'object' || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) interactionError();
  const own = Reflect.ownKeys(value);
  if (own.length !== keys.length || own.some(k => !keys.includes(k) || !Object.hasOwn(Object.getOwnPropertyDescriptor(value, k), 'value'))) interactionError();
}
function interactionArray(value, max) {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || value.length > max || Reflect.ownKeys(value).length !== value.length + 1) interactionError();
  for (let i = 0; i < value.length; i++) if (!Object.hasOwn(Object.getOwnPropertyDescriptor(value, String(i)) ?? {}, 'value')) interactionError();
}
function interactionId(value) { if (typeof value !== 'string' || !/^[a-z][a-z0-9-]{0,47}$/.test(value)) interactionError(); return value; }
function interactionLabel(value) { if (typeof value !== 'string' || !value.trim() || value.length > 96 || /[\p{Cc}\p{Cf}]/u.test(value)) interactionError(); return value; }
export function validateInteraction(value) {
  interactionRecord(value, ['enabled', 'title', 'fields']);
  if (typeof value.enabled !== 'boolean') interactionError();
  interactionArray(value.fields, 4); if (!value.fields.length) interactionError();
  const fields = value.fields.map(f => {
    interactionRecord(f, ['id', 'label', 'format']);
    if (!['code', 'json', 'flowchart'].includes(f.format)) interactionError();
    return Object.freeze({ id: interactionId(f.id), label: interactionLabel(f.label), format: f.format });
  });
  if (new Set(fields.map(f => f.id)).size !== fields.length) interactionError();
  return Object.freeze({ enabled: value.enabled, title: interactionLabel(value.title), fields: Object.freeze(fields) });
}
export function validateInteractionComponents(value = []) {
  interactionArray(value, 4);
  const result = value.map(c => {
    interactionRecord(c, ['id', 'enabled', 'title', 'fields']);
    const { id, ...definition } = c;
    return Object.freeze({ id: interactionId(id), ...validateInteraction(definition) });
  });
  if (new Set(result.map(c => c.id)).size !== result.length) interactionError();
  return Object.freeze(result);
}
