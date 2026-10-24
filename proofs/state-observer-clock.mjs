// Original MIT, test-only subprocess. Uses the real scoped storage and observer;
// replaces only this process's global observer clock while next() is pending.
import assert from 'node:assert/strict';
import { performance as realClock } from 'node:perf_hooks';
import { join } from 'node:path';
import { observeMetadataState, readMetadataState, recordMetadataEvent } from '../src/state.mjs';

const [mode,root]=process.argv.slice(2);
if(!['live','expired'].includes(mode) || !root)throw new Error('Closed observer fixture mode/root required');
const scope={projectId:'synthetic-observer',sessionId:'synthetic-observer'};
const data=join(root,'scoped state'),timings=[];
async function phase(name,work) {
  const start=realClock.now();const value=await work();
  timings.push({phase:name,elapsedMs:Math.round((realClock.now()-start)*100)/100});return value;
}
async function nextAt(iterator,time) {
  const descriptor=Object.getOwnPropertyDescriptor(globalThis,'performance');
  Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>time}});
  try {return await iterator.next();}
  finally {Object.defineProperty(globalThis,'performance',descriptor);}
}
try {
  // Writes run with the real clock, real sync/ACL APIs and ordinary deadlines.
  await phase('initial-writes',async()=>{
    for(let n=0;n<3;n++)await recordMetadataEvent(data,scope,{event:'SessionStart'});
  });
  const controller=new AbortController();
  const observer=observeMetadataState(data,scope,{intervalMs:100,durationMs:10000,signal:controller.signal});
  const initial=await phase('initial-observation',()=>nextAt(observer,0));
  assert.equal(initial.done,false);assert.equal(initial.value.records,3);
  await phase('paused-write',()=>recordMetadataEvent(data,scope,{event:'PostToolUse',tool:'Bash'}));
  const changed=await phase('resumed-observation',()=>nextAt(observer,mode==='live'?1000:10001));
  let legacyAssertion='not-run';
  if(mode==='expired') {
    assert.deepEqual(changed,{value:undefined,done:true});
    // Reproduce the old test's unguarded dereference on valid iterator closure.
    assert.throws(()=>{assert.equal(changed.value.records,4);},{name:'TypeError'});
    legacyAssertion='TypeError';
  } else {
    assert.equal(changed.done,false);assert.equal(changed.value.records,4);
    assert.notEqual(initial.value.revision,changed.value.revision);
    controller.abort();assert.deepEqual(await nextAt(observer,1000),{value:undefined,done:true});
  }
  assert.deepEqual(await observer.next(),{value:undefined,done:true});
  // An expired observer is not loss of the completed event; actual storage stays4.
  const stored=await phase('fresh-read',()=>readMetadataState(data,scope));assert.equal(stored.records,4);
  console.log(JSON.stringify({mode,initialRecords:3,storedRecords:4,secondDone:changed.done,
    observedRecords:changed.value?.records??null,legacyAssertion,closed:true,timings}));
} catch(error) {
  // No paths, scope identifiers, descriptors, environment or raw errors.
  console.error('observer-fixture-failed:'+error.name);process.exitCode=1;
}
