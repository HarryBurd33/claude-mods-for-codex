import assert from 'node:assert/strict';
import test from 'node:test';
import { directoryObservation } from '../proofs/windows-owned-process/directory-diagnostic-frame.mjs';

const frame = (operation, error = 'NotApplicable', flags = '1|1|1|1|0|1|1', segment = '0') =>
  `installer-directory-observed|${segment}|${operation}|${error}|${flags}`;

test('directory refusal observations retain closed failed-open categories without authority', () => {
  for (const error of ['Missing', 'AccessDenied', 'Sharing', 'OpenOther']) {
    assert.deepEqual(directoryObservation(frame('Open', error, '0|0|0|0|0|0|0')), {
      segment:0, operation:'Open', openError:error, opened:false, queried:false,
      disk:false, links:0, reparse:false, directory:false, selectedNameMatched:false,
      authority:false, atomicCause:false,
    });
  }
});

test('directory observations describe later same-handle metadata at each bounded boundary', () => {
  for (const operation of ['Info', 'Descriptor', 'Assessment']) {
    const result = directoryObservation(frame(operation, 'NotApplicable', '1|1|1|4294967295|0|1|1', '31'));
    assert.equal(result.operation, operation); assert.equal(result.segment, 31);
    assert.equal(result.links, 0xffffffff); assert.equal(result.authority, false); assert.equal(result.atomicCause, false);
  }
  assert.equal(directoryObservation(frame('Info', 'NotApplicable', '1|1|1|1|1|1|0')).reparse, true);
  assert.equal(directoryObservation(frame('Info', 'NotApplicable', '1|0|1|0|0|0|1')).queried, false);
});

test('directory observation decoder rejects malformed or approval-shaped frames and arbitrary data', () => {
  const valid = frame('Info');
  for (const value of [null, {}, '', 'x'.repeat(161), `${valid}\n`, `${valid}\r`, `${valid}|extra`,
    valid.replace('installer-directory-observed', 'allow'), frame('C:\\private'), frame('Execute'),
    frame('Open', 'C:\\private', '0|0|0|0|0|0|0'), frame('Info', 'AccessDenied'),
    frame('Info', 'NotApplicable', '1|1|1|1|0|1|1', '-1'),
    frame('Info', 'NotApplicable', '1|1|1|1|0|1|1', '01'),
    frame('Info', 'NotApplicable', '1|1|1|1|0|1|1', '32'),
    frame('Info', 'NotApplicable', '1|1|1|4294967296|0|1|1'),
    frame('Info', 'NotApplicable', '1|1|1|01|0|1|1'),
    frame('Info', 'NotApplicable', '1|1|1|-1|0|1|1'),
    frame('Info', 'NotApplicable', '1|1|true|1|0|1|1'),
    frame('Info', 'NotApplicable', '1|1|1|1|0|1'),
  ]) assert.throws(() => directoryObservation(value), {message:'Directory observation frame refused'});
});

test('directory observation decoder rejects impossible unopened and unqueried metadata combinations', () => {
  for (const value of [frame('Open', 'NotApplicable', '0|0|0|0|0|0|0'),
    frame('Open', 'Missing'), frame('Info', 'NotApplicable', '0|0|0|0|0|0|0'),
    ...['0|1|0|0|0|0|0', '0|0|1|0|0|0|0', '0|0|0|1|0|0|0',
      '0|0|0|0|1|0|0', '0|0|0|0|0|1|0', '0|0|0|0|0|0|1'].map(flags => frame('Open', 'Missing', flags)),
    ...['1|0|1|1|0|0|0', '1|0|1|0|1|0|0', '1|0|1|0|0|1|0'].map(flags => frame('Info', 'NotApplicable', flags)),
  ]) assert.throws(() => directoryObservation(value), {message:'Directory observation frame refused'});
});
