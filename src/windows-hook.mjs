// No filesystem scope probing on the guard-response lane.
// Exact explicitly selected native-session root only, intentionally narrower
// than POSIX descendant containment. Never infer scope from a shell command.
import { performance } from 'node:perf_hooks';
import { windowsStorageRequest } from './windows-storage.mjs';
import { windowsHookProjectMatches } from './scope.mjs';
export { windowsHookProjectMatches } from './scope.mjs';
import { encodeJournalRecord } from './journal.mjs';
import { metadataScopeKey } from './state.mjs';
import { recordWindowsMetadata } from './windows-state.mjs';

export async function writeWindowsHookMetadata({event,projectRoot,dataDirectory,journal,stateMetadata,stateScope}) {
  const result = { journal: journal === null ? 'off' : 'unavailable', state: stateMetadata === null ? 'off' : 'unavailable' };
  if (journal === null && stateMetadata === null || !windowsHookProjectMatches(event.cwd,projectRoot)) return result;
  const deadline = performance.now() + 1500;
  const remaining = () => {
    const timeoutMs = Math.floor(deadline - performance.now());
    if (timeoutMs < 100) throw new Error('Metadata budget exhausted');
    return timeoutMs;
  };
  if (journal !== null) {
    try {
      const data = Buffer.from(encodeJournalRecord(journal)).toString('base64');
      await windowsStorageRequest('journal-append',dataDirectory,{data,timeoutMs:remaining()});
      result.journal = 'recorded';
    } catch { /* optional telemetry cannot replace a guard decision */ }
  }
  if (stateMetadata !== null) {
    try {
      const key = metadataScopeKey({projectId:projectRoot,...(stateScope === 'project' ? {} : {sessionId:event.session_id})});
      await recordWindowsMetadata(dataDirectory,key,stateMetadata,undefined,remaining());
      result.state = 'recorded';
    } catch { /* no raw event/path/identifier diagnostics */ }
  }
  return result;
}
