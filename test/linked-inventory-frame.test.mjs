import test from 'node:test';
import assert from 'node:assert/strict';
import { LINKED_LAYOUT, linkedImageFamily, linkedInventoryFrame } from '../proofs/windows-owned-process/linked-inventory-frame.mjs';
const digest='a'.repeat(64),frame=`linked-inventory-held\nlinked-inventory-released\nlinked-inventory-sample|64|2|${digest}|not-performed`;
test('linked inventory requires final release and exact bounded digest receipt',()=>{
  assert.deepEqual(linkedInventoryFrame(frame),{accepted:true,bytes:64,links:2,sha256:digest,pe:'not-performed',executionAuthority:false});
  for(const bad of [frame.replace('linked-inventory-released\n',''),frame+'\nextra',frame.replace('|64|','|63|'),frame.replace('|2|','|0|'),frame.replace('|2|','|4294967296|'),frame.replace('not-performed','verified'),frame.replace(digest,digest.toUpperCase())])
    assert.throws(()=>linkedInventoryFrame(bad),/refused/);
  assert.equal(linkedInventoryFrame('linked-inventory-refused|Image').accepted,false);
  assert.equal(linkedInventoryFrame('linked-inventory-held\nlinked-inventory-cancelled\nlinked-inventory-released').accepted,false);
});
test('modern installed-image family is explicit and never selected by existence',()=>{
  assert.deepEqual(linkedImageFamily(LINKED_LAYOUT),['cmd/git.exe','ucrt64/bin/git.exe']);
  for(const value of [undefined,'','legacy','cmd/git.exe',{},null])assert.throws(()=>linkedImageFamily(value),/refused/);
});
