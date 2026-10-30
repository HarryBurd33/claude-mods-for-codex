import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { OwnedFixtureScope } from './owned-fixture-lifecycle.mjs';
const args=code=>['-e',code];

test('owned fixture pre-abort cannot create a child or perform fixture IO',async()=>{
  const scope=new OwnedFixtureScope(),c=new AbortController();c.abort();
  let writes=0;
  await assert.rejects(scope.run(process.execPath,args('process.exit(0)'),{signal:c.signal}));
  await assert.rejects(scope.io(c.signal,()=>writes++));
  assert.equal(writes,0);assert.equal(scope.children.size,0);scope.assertCleanupSafe();
});
for(const duringReady of [false,true]) {
  test('owned fixture abort '+(duringReady?'after readiness':'during readiness')+' awaits close before cleanup',async()=>{
    const scope=new OwnedFixtureScope(),c=new AbortController();
    const h=scope.start(process.execPath,args(duringReady?"console.log('ready');setInterval(()=>{},1000)":"setInterval(()=>{},1000)"),
      {signal:c.signal,env:{},readyMs:5000,stdio:['pipe','pipe','pipe']});
    if(duringReady)assert.equal(await h.firstLine,'ready');
    assert.throws(()=>scope.assertCleanupSafe(),/unresolved/);
    c.abort();
    await assert.rejects(h.completion,/aborted/);
    assert.equal(h.hasClosed(),true);assert.equal(scope.children.size,0);scope.assertCleanupSafe();
    let next=false;await assert.rejects(scope.io(c.signal,()=>{next=true;}));assert.equal(next,false);
  });
}
test('owned fixture output overflow and nonzero exit never become success',async()=>{
  const scope=new OwnedFixtureScope();
  await assert.rejects(scope.run(process.execPath,args("console.log('x'.repeat(2048));setInterval(()=>{},1000)"),{env:{},stdoutLimit:128}),/output bound/);
  scope.assertCleanupSafe();
  await assert.rejects(scope.run(process.execPath,args('process.exit(23)'),{env:{}}),/Public proof failed: 23/);
  scope.assertCleanupSafe();
});
test('fixture cleanup refuses an outstanding write and post-IO abort prevents follow-on actions',async()=>{
  const scope=new OwnedFixtureScope(),c=new AbortController();let resolve;
  const pending=scope.io(c.signal,()=>new Promise(r=>{resolve=r;}));
  await Promise.resolve();assert.throws(()=>scope.assertCleanupSafe(),/unresolved/);
  c.abort();resolve();await assert.rejects(pending);scope.assertCleanupSafe();
});
test('unchanged transport spawn imports are tracked until actual helper close',async()=>{
  const scope=new OwnedFixtureScope(),restore=scope.trackExternalSpawns();let child;
  try {
    await assert.rejects(scope.externalIO(undefined,async()=>{
      child=spawn(process.execPath,args('setInterval(()=>{},1000)'),{env:{},stdio:'ignore'});
      return 'transport-returned-before-close';
    }),/close unresolved/);
    assert.equal(scope.children.has(child),true);assert.throws(()=>scope.assertCleanupSafe(),/unresolved/);
    assert.throws(()=>scope.check(),/unresolved/);
    const closed=new Promise(resolve=>child.once('close',resolve));child.kill();
    let timer;
    try{await Promise.race([closed,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Fixture close deadline')),1000);})]);}
    finally{clearTimeout(timer);}
    assert.equal(scope.children.size,0);
    assert.throws(()=>scope.assertCleanupSafe(),/unresolved/,'uncertain effect remains latched for review');
  }finally{restore();}
});

test('overlapping external operations own their children independently',async()=>{
  const scope=new OwnedFixtureScope();let first,second;
  const a=scope.externalIO(undefined,async()=>{
    first=scope.start(process.execPath,args("setTimeout(()=>process.exit(0),50)"),{env:{}});
    await first.completion;return 'first';
  });
  const b=scope.externalIO(undefined,async()=>{
    second=scope.start(process.execPath,args("setInterval(()=>{},1000)"),{env:{}});
    await second.completion;return 'second';
  });
  await Promise.resolve();assert.equal(scope.children.size,2);
  assert.equal(await a,'first');assert.equal(scope.unresolved,false);
  assert.throws(()=>scope.assertCleanupSafe(),/unresolved/);
  second.child.kill();assert.equal(await b,'second');scope.assertCleanupSafe();
});
test('spawn throw latches uncertainty without creating an adopted child',async()=>{
  const scope=new OwnedFixtureScope();
  await assert.rejects(scope.externalIO(undefined,()=>scope.spawn(42,[],{})));
  assert.equal(scope.children.size,0);assert.equal(scope.unresolved,true);
  assert.throws(()=>scope.assertCleanupSafe(),/unresolved/);
});
test('nested pending IO prevents enclosing operation cleanup',async()=>{
  const scope=new OwnedFixtureScope();let finish,nested;
  await assert.rejects(scope.externalIO(undefined,async()=>{
    nested=scope.externalIO(undefined,()=>new Promise(r=>{finish=r;}));nested.catch(()=>{});
    await Promise.resolve();
  }),/close unresolved/);
  assert.throws(()=>scope.assertCleanupSafe(),/unresolved/);finish();await assert.rejects(nested);
});
test('callbacks retaining a closed operation cannot spawn or write',async()=>{
  const scope=new OwnedFixtureScope();let release,late;let writes=0;
  await scope.externalIO(undefined,async()=>{
    late=new Promise(r=>{release=r;}).then(()=>scope.io(undefined,()=>writes++));
    late.catch(()=>{});
  });
  release();await assert.rejects(late,/already closed/);assert.equal(writes,0);
  assert.throws(()=>scope.assertCleanupSafe(),/unresolved/);
});
