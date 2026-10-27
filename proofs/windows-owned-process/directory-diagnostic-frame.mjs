// Original MIT. Proof-only refusal observation; never admission or an atomic cause.
const operations = new Set(['Open', 'Info', 'Descriptor', 'Assessment']);
const openErrors = new Set(['Missing', 'AccessDenied', 'Sharing', 'OpenOther']);
export function directoryObservation(frame) {
  const refuse = () => { throw new Error('Directory observation frame refused'); };
  if (typeof frame !== 'string' || frame.length > 160 || /[\r\n]/.test(frame)) refuse();
  const [kind, segment, operation, error, opened, queried, disk, links, reparse, directory, name, extra] = frame.split('|');
  const flags = [opened, queried, disk, reparse, directory, name];
  if (kind !== 'installer-directory-observed' || extra !== undefined
    || !/^(0|[1-9][0-9]?)$/.test(segment ?? '') || Number(segment) > 31
    || !operations.has(operation) || flags.some(x => x !== '0' && x !== '1')
    || !/^(0|[1-9][0-9]{0,9})$/.test(links ?? '') || Number(links) > 0xffffffff
    || (operation === 'Open' ? !openErrors.has(error) || opened !== '0' : error !== 'NotApplicable' || opened !== '1')
    || (opened === '0' && (queried !== '0' || disk !== '0' || links !== '0' || reparse !== '0' || directory !== '0' || name !== '0'))
    || (queried === '0' && (links !== '0' || reparse !== '0' || directory !== '0'))) refuse();
  return { segment:Number(segment), operation, openError:error, opened:opened === '1', queried:queried === '1',
    disk:disk === '1', links:Number(links), reparse:reparse === '1', directory:directory === '1',
    selectedNameMatched:name === '1', authority:false, atomicCause:false };
}
