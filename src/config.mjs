import { resolve } from "node:path";
import { MAX_CONFIG_BYTES, MAX_MESSAGE_CHARS } from "./constants.mjs";
import { parseJsonObject, readBoundedFile } from "./io.mjs";
import { getModDefinition } from "./mods/registry.mjs";

const TOP_KEYS = new Set(["version", "mods", "metadataState"]);
const COMMON_KEYS = new Set(["id", "type", "enabled"]);

export function fail(message) {
  throw new Error(`invalid config: ${message}`);
}

export function assertOnlyKeys(value, allowed, where) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) fail(`${where} has unknown key ${JSON.stringify(key)}`);
  }
}

export function cleanString(value, where, max = 256) {
  if (typeof value !== "string" || value.length === 0 || value.length > max) {
    fail(`${where} must be a non-empty string of at most ${max} characters`);
  }
  if (/\p{Cc}/u.test(value)) fail(`${where} must not contain control characters`);
  return value;
}

export function cleanStringArray(value, where, { maxItems = 32, maxChars = 128 } = {}) {
  if (!Array.isArray(value) || value.length === 0 || value.length > maxItems) {
    fail(`${where} must be a non-empty array with at most ${maxItems} entries`);
  }
  return value.map((entry, index) => cleanString(entry, `${where}[${index}]`, maxChars));
}

function validateMod(raw, index, ids) {
  if (raw === null || Array.isArray(raw) || typeof raw !== "object") {
    fail(`mods[${index}] must be an object`);
  }
  const id = cleanString(raw.id, `mods[${index}].id`, 64);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    fail(`mods[${index}].id must use lowercase letters, digits, and single hyphens`);
  }
  if (ids.has(id)) fail(`duplicate mod id ${JSON.stringify(id)}`);
  ids.add(id);
  const definition = getModDefinition(raw.type);
  if (definition === undefined) fail(`mods[${index}].type is unsupported`);
  if (typeof raw.enabled !== "boolean") fail(`mods[${index}].enabled must be boolean`);
  assertOnlyKeys(raw, new Set([...COMMON_KEYS, ...definition.allowedKeys]), `mods[${index}]`);
  const options = definition.validate(raw, {
    where: `mods[${index}]`,
    fail,
    assertOnlyKeys,
    cleanString,
    cleanStringArray,
    maxMessageChars: MAX_MESSAGE_CHARS,
  });
  return { id, type: raw.type, enabled: raw.enabled, options };
}

export function validateConfig(raw) {
  if (raw === null || Array.isArray(raw) || typeof raw !== "object") fail("root must be an object");
  assertOnlyKeys(raw, TOP_KEYS, "root");
  if (raw.version !== 1) fail("version must be 1");
  if (!Array.isArray(raw.mods) || raw.mods.length > 64) fail("mods must be an array with at most 64 entries");
  const ids = new Set();
  const metadataState = { enabled: false, scope: "session" };
  if (raw.metadataState !== undefined) {
    if (raw.metadataState === null || typeof raw.metadataState !== "object" || Array.isArray(raw.metadataState)) fail("metadataState must be an object");
    assertOnlyKeys(raw.metadataState, new Set(["enabled", "scope"]), "metadataState");
    if (typeof raw.metadataState.enabled !== "boolean") fail("metadataState.enabled must be boolean");
    if (raw.metadataState.scope !== undefined && !["session", "project"].includes(raw.metadataState.scope)) fail("metadataState.scope must be session or project");
    metadataState.enabled = raw.metadataState.enabled;
    metadataState.scope = raw.metadataState.scope ?? "session";
  }
  return { version: 1, mods: raw.mods.map((mod, index) => validateMod(mod, index, ids)), metadataState };
}

export async function loadConfig(configPath) {
  const text = await readBoundedFile(resolve(configPath), MAX_CONFIG_BYTES);
  return validateConfig(parseJsonObject(text, "config"));
}
