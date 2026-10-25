// Pinned CLI0.164 HooksToml/HookStateToml shape, with narrower project bounds.
// Pure classification only: no lookup of referenced paths, approval or hook IO.
import { jsonData } from './routing-contract.mjs';

const EVENTS = new Set(['PreModelRequest', 'PostModelRequest', 'PreToolUse', 'PermissionRequest', 'PostToolUse',
  'PreCompact', 'PostCompact', 'SessionStart', 'SessionEnd', 'UserPromptSubmit', 'SubagentStart', 'SubagentStop', 'Stop', 'Interrupt']);
const record = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const identifier = v => v.length > 0 && v.length <= 4096 && v.trim().length > 0
  && v.isWellFormed() && !/[\p{Cc}\p{Cf}]/u.test(v);
// Opaque printable fingerprints, NOT validated approvals or a claim of a match.
const fingerprint = v => typeof v === 'string' && v.length > 0 && v.length <= 256 && !/[^\x21-\x7e]/.test(v);

export function nativeHookMetadataOnly(value) {
  if (value === undefined) return true; // Omitted optional table.
  if (!jsonData(value) || !record(value)) return false;
  for (const [key, entry] of Object.entries(value)) {
    if (key !== 'state') {
      // Only the exact released event defaults; any handler group stays blocked.
      if (!EVENTS.has(key) || !Array.isArray(entry) || entry.length !== 0) return false;
      continue;
    }
    if (!record(entry) || Object.keys(entry).length > 256) return false;
    for (const [id, state] of Object.entries(entry)) {
      if (!identifier(id) || !record(state)) return false;
      for (const [field, data] of Object.entries(state)) {
        if (field === 'enabled') { if (typeof data !== 'boolean') return false; }
        else if (field === 'trusted_hash' || field === 'trusted_content_hash') { if (!fingerprint(data)) return false; }
        else return false;
      }
    }
  }
  return true;
}
