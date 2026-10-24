import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, realpath, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

test('POSIX state preserves 32 concurrent events with injected sync latency and leaves no lock', {
  skip:process.platform==='win32', timeout:15000,
}, async t => {
  const root=await mkdtemp(join(await realpath(tmpdir()),'mods-state-latency-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  // Two explicit source copies only. Inject latency before (never replace) the
  // real fsync. This is a source-instrumented OS fixture, not a native host test.
  let journal=await readFile(new URL('../src/journal.mjs',import.meta.url),'utf8');
  assert.equal(journal.split('await handle.sync();').length,2);
  journal=journal.replace('await handle.sync();','await delay(60); await handle.sync();');
  journal=journal.replace(/(["'])\.\/([^"']+)\1/g,(_,q,name)=>{
    assert.ok(['constants.mjs','windows-storage.mjs'].includes(name),'review new fixture import');
    return JSON.stringify(new URL('../src/'+name,import.meta.url).href);
  });
  let state=await readFile(new URL('../src/state.mjs',import.meta.url),'utf8');
  state=state.replace(/(["'])\.\/([^"']+)\1/g,(all,q,name)=>{
    if(name==='journal.mjs')return all;
    assert.ok(['windows-state.mjs','state-lock-budget.mjs'].includes(name),'review new fixture import');
    return JSON.stringify(new URL('../src/'+name,import.meta.url).href);
  });
  await writeFile(join(root,'journal.mjs'),journal,{flag:'wx',mode:0o600});
  await writeFile(join(root,'state.mjs'),state,{flag:'wx',mode:0o600});
  const data=join(root,'private data');await mkdir(data,{mode:0o700});
  const moduleUrl=pathToFileURL(join(root,'state.mjs')).href;
  const scope={projectId:'synthetic-latency',sessionId:'synthetic-latency'};
  const program=`import {recordMetadataEvent} from ${JSON.stringify(moduleUrl)};
    const [data,scope]=JSON.parse(process.argv[1]);let completed=0;
    const go=new Promise(resolve=>process.once('message',resolve));process.send('ready');await go;
    try {for(;completed<4;completed++)await recordMetadataEvent(data,scope,{event:'PostToolUse',tool:'Bash'});
      process.send({done:true,completed,busy:false});}
    catch(error){process.send({done:false,completed,busy:/metadata state is busy/.test(error.message)});process.exitCode=1;}
    finally {process.disconnect();}`;
  const children=Array.from({length:8},()=>{
    const p=spawn(process.execPath,['--input-type=module','-e',program,JSON.stringify([data,scope])],{stdio:['ignore','pipe','pipe','ipc']});
    let output='',result;
    const ready=new Promise((resolve,reject)=>{
      p.on('message',m=>{if(m==='ready')resolve();else result=m;});
      p.once('error',reject);p.once('close',()=>reject(new Error('state latency writer closed before barrier')));
    });
    const closed=new Promise((resolve,reject)=>{p.once('close',code=>resolve({code,result,output}));p.once('error',reject);});
    ready.catch(()=>{});closed.catch(()=>{});
    for(const stream of [p.stdout,p.stderr])stream.on('data',b=>{output+=b;if(output.length>4096)p.kill('SIGKILL');});
    return {p,ready,closed};
  });
  const timer=setTimeout(()=>{for(const {p} of children)p.kill('SIGKILL');},10000);
  try {
    await Promise.all(children.map(c=>c.ready));for(const {p} of children)p.send('go');
    const results=await Promise.all(children.map(c=>c.closed));
    assert.deepEqual(results,Array.from({length:8},()=>({code:0,result:{done:true,completed:4,busy:false},output:''})));
  } finally {
    clearTimeout(timer);for(const {p} of children)if(p.exitCode===null && p.signalCode===null)p.kill('SIGKILL');
    await Promise.allSettled(children.map(c=>c.closed)); // Before fixture removal.
  }
  const {readMetadataState,metadataScopeKey}=await import(moduleUrl);
  const value=await readMetadataState(data,scope);
  assert.equal(value.records,32);assert.deepEqual(value.events,{PostToolUse:32});assert.deepEqual(value.tools,{Bash:32});
  const stateRoot=join(data,'metadata-state-v1');
  assert.deepEqual(await readdir(stateRoot),[metadataScopeKey(scope)]);
  assert.deepEqual(await readdir(join(stateRoot,metadataScopeKey(scope))),['activity.jsonl']);
});
