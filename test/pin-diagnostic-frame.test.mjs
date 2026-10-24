import assert from 'node:assert/strict';
import test from 'node:test';
import { pinRefusal } from '../proofs/windows-owned-process/pin-diagnostic-frame.mjs';

test('pin diagnostic frame preserves refusal when repeat metadata probe passes', () => {
  assert.deepEqual(pinRefusal('refused|Complete|NoRepeatRefusal|0'), {
    pin:'refused', dataRead:false, repeatProbe:{role:'Complete',reason:'NoRepeatRefusal',segment:0,authority:false},
  });
});
test('pin diagnostic frame accepts only bounded closed metadata categories', () => {
  for (const reason of ['Missing','AccessDenied','Sharing','OpenOther','ObjectPolicy','VolumePolicy',
    'DescriptorPolicy','OwnerPolicy','AcePolicy','ForeignInstallerGrant','ForeignMutationGrant','AccessUnclassified']) {
    const value = pinRefusal(`refused|CodeAncestor|${reason}|120`);
    assert.equal(value.dataRead,false); assert.equal(value.repeatProbe.authority,false);
    assert.equal(value.repeatProbe.reason,reason);
  }
});
test('pin diagnostic frame rejects arbitrary data, malformed, oversized and approval-shaped frames', () => {
  for (const value of [null,{},'', 'pinned','refused', 'allow|Complete|NoRepeatRefusal|0',
    'refused|CodeAncestor|C:\\private|0','refused|C:\\private|Missing|0','refused|Input|PathPolicy|0|extra',
    'refused|Input|PathPolicy|-1','refused|Input|PathPolicy|01','refused|Input|PathPolicy|121',
    'refused|Input|PathPolicy|0\n','refused|Input|PathPolicy|0\r', 'x'.repeat(121),
    'refused|Complete|Missing|0','refused|Executable|NoRepeatRefusal|0']) {
    assert.throws(()=>pinRefusal(value),{message:'Pin diagnosis frame refused'});
  }
});
