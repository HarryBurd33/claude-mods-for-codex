// OS-specific storage only. Scope validation/snapshot contracts stay in state.mjs.
import { createHash } from 'node:crypto';
import { windowsStorageRequest } from './windows-storage.mjs';
import { encodeJournalRecord, parseJournalFiles } from './journal.mjs';
const KEY = /^[a-f0-9]{64}$/;
const checkKey = key => { if (typeof key !== 'string' || !KEY.test(key)) throw new Error('Invalid metadata scope key'); return key; };
export async function recordWindowsMetadata(dataDirectory, key, metadata, now, timeoutMs = 15000) {
  const data = checkKey(key) + ':' + Buffer.from(encodeJournalRecord(metadata, now)).toString('base64');
  await windowsStorageRequest('state-record', dataDirectory, { data, timeoutMs });
}
export async function readWindowsMetadata(dataDirectory, key, { signal, timeoutMs } = {}) {
  const files = await windowsStorageRequest('state-read', dataDirectory, { data: checkKey(key), signal, timeoutMs });
  return parseJournalFiles(files.map(file => file.toString('utf8')));
}
export async function pruneWindowsMetadata(dataDirectory, before) {
  if (!(before instanceof Date) || Number.isNaN(before.valueOf())) throw new Error('state pruning requires an explicit valid cutoff date');
  const [list] = await windowsStorageRequest('state-list', dataDirectory);
  const keys = JSON.parse(list.toString('utf8'));
  if (!Array.isArray(keys) || keys.length > 64 || new Set(keys).size !== keys.length || keys.some(key => typeof key !== 'string' || !KEY.test(key))) throw new Error('Invalid Windows metadata scope list');
  let removedScopes = 0;
  for (const key of keys) {
    const files = await windowsStorageRequest('state-read', dataDirectory, { data: key });
    const entries = parseJournalFiles(files.map(file => file.toString('utf8')));
    if (entries.some(entry => Date.parse(entry.recordedAt) >= before.valueOf())) continue;
    const expected = createHash('sha256').update(files[0]).update(Buffer.from([0])).update(files[1]).digest('hex');
    // Native side locks both scope and root and rechecks this exact content.
    // A fresh delivery refuses this prune; hash is freshness, never consent.
    await windowsStorageRequest('state-prune', dataDirectory, { data: key + ':' + expected });
    removedScopes++;
  }
  return { removedScopes };
}
