// WS-L1 event-order regressions: real module bodies, synthetic processes/clock only.
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { win32 } from 'node:path';
import vm from 'node:vm';
import * as crypto from 'node:crypto';
import * as paths from 'node:path';
import { constants as fsConstants } from 'node:fs';
import * as constants from '../src/constants.mjs';
const sourceURL = new URL('../src/windows-storage.mjs', import.meta.url);
const source = await readFile(sourceURL, 'utf8');
let cases = 0;
async function load(body, url, context, bindings) {
  const module = new vm.SourceTextModule(body, {context, initializeImportMeta(meta) {meta.url = url.href;}});
  await module.link(specifier => {
    const values = bindings[specifier]; assert.ok(values, 'Unexpected dependency: '+specifier);
    return new vm.SyntheticModule(Object.keys(values), function() {
      for (const [key,value] of Object.entries(values)) this.setExport(key,value);
    }, {context});
  });
  await module.evaluate(); return module.namespace;
}
async function fixture({throwAt=-1, missingPid=false, killMode='ok', writeThrow=false}={}) {
  let now=0, spawnCalls=0;
  const children=[], timers=[];
  const context=vm.createContext({Buffer,URL,AbortSignal,process:{platform:'win32',env:{SystemRoot:'C:\\Windows'}},
    setTimeout(fn,delay){const t={fn,at:now+delay,cleared:false};timers.push(t);return t;},
    clearTimeout(t){if(t)t.cleared=true;}});
  const spawn=(exe,args,options)=>{
    const index=spawnCalls++; if(index===throwAt)throw new Error('SYNTHETIC_PRIVATE');
    assert.equal(options.shell,false); assert.ok(exe.startsWith('C:\\Windows\\System32\\'));
    const child=new EventEmitter(); Object.assign(child,{pid:missingPid?undefined:7000+index,exitCode:null,signalCode:null,kills:0,writes:0});
    child.kill=()=>{child.kills++;if(killMode==='throw')throw new Error('SYNTHETIC_PRIVATE');return killMode!=='false';};
    child.stdin=new EventEmitter();child.stdout=new EventEmitter();
    child.stdin.end=()=>{child.writes++;if(writeThrow)throw new Error('SYNTHETIC_PRIVATE');};
    children.push(child);return child;
  };
  const api=await load(source,sourceURL,context,{'node:child_process':{spawn},'node:url':{fileURLToPath},'node:path':{win32},'node:perf_hooks':{performance:{now:()=>now}}});
  const c=new AbortController();let settled=false,value,error;
  const request=(op='prepare-directory',path='C:\\Synthetic\\private',options={})=>{
    const p=api.windowsStorageRequest(op,path,{timeoutMs:100,signal:c.signal,...options});
    p.then(v=>{settled=true;value=v;},e=>{settled=true;error=e;});return p;
  };
  const flush=async()=>{await Promise.resolve();await Promise.resolve();};
  const close=(index,code=0)=>{const child=children[index];child.exitCode=code;child.emit('close',code);};
  const advance=async time=>{now=time;for(const t of [...timers])if(!t.cleared&&t.at<=now){t.cleared=true;t.fn();}await flush();};
  const refused=(helper,terminator)=>{
    assert.ok(settled);assert.equal(value,undefined);assert.equal(error.code,'ERR_WINDOWS_STORAGE_UNAVAILABLE');
    assert.equal(error.name,'Error');assert.equal(error.message,'Private Windows storage unavailable; review local NTFS ownership, protected ACLs, path, helper policy and bounds');
    assert.deepEqual(JSON.parse(JSON.stringify(error.storageLifecycle)),{version:1,helper,terminator,descendants:'unverified'});
    assert.ok(Object.isFrozen(error.storageLifecycle));assert.deepEqual(Object.keys(error),[]);
    assert.equal(Object.getOwnPropertyDescriptor(error,'storageLifecycle').writable,false);
    assert.equal(error.cause,undefined);cases++;
  };
  return {api,c,request,children,close,advance,flush,refused,timers,get settled(){return settled;},get error(){return error;},get value(){return value;},get calls(){return spawnCalls;},setNow:t=>{now=t;}};
}
// Original three orderings, plus reverse close and fully observed cleanup.
for(const mode of ['killer-close','killer-error','expiry','helper-first','both']){
  const f=await fixture();f.request();f.c.abort();
  if(mode==='killer-close'||mode==='both')f.close(1);
  if(mode==='killer-error')f.children[1].emit('error',new Error('SYNTHETIC_PRIVATE'));
  if(mode==='helper-first'||mode==='both')f.close(0);
  await f.flush();assert.equal(f.settled,mode==='both');
  if(mode!=='both')await f.advance(500);
  f.refused(mode==='helper-first'||mode==='both'?'closed':'unresolved',mode==='killer-close'||mode==='both'?'closed':'unresolved');
  const receipt=f.error.storageLifecycle;const calls=f.calls;
  f.close(0);f.close(1);f.c.abort();f.children[0].stdout.emit('data',Buffer.from('2|ok|0|\n'));f.children[0].emit('error',new Error('late'));
  assert.equal(f.error.storageLifecycle,receipt);assert.equal(f.calls,calls);
  assert.ok(f.children.every(c=>c.kills<=1));
}
for(const mode of ['valid','nonzero','malformed','late','overflow','stdin','stdout','write']){
  const f=await fixture({writeThrow:mode==='write'});f.request();
  if(mode==='late')f.setNow(100);
  if(mode==='stdin')f.children[0].stdin.emit('error',new Error('private'));
  if(mode==='stdout')f.children[0].stdout.emit('error',new Error('private'));
  if(mode==='overflow')f.children[0].stdout.emit('data',Buffer.alloc(3*1024*1024+1));
  f.children[0].stdout.emit('data',Buffer.from(mode==='malformed'?'bad':'2|ok|0|\n'));
  await f.flush();assert.equal(f.settled,false);
  f.close(0,mode==='nonzero'?1:0);if(f.children.length>1)f.close(1);
  await f.flush();
  if(mode==='valid'){assert.ok(f.settled);assert.equal(f.value.length,0);cases++;}
  else f.refused('closed',f.children.length>1?'closed':'never-started');
}
for(const options of [{throwAt:0},{throwAt:1},{missingPid:true},{killMode:'false'},{killMode:'throw'}]){
  const f=await fixture(options);f.request();f.c.abort();await f.advance(600);
  f.refused('unresolved',options.throwAt===0||options.missingPid?'never-started':'unresolved');
  assert.ok(f.children.every(c=>c.kills<=1));
}
for(const close of [false,true]){
  const f=await fixture({missingPid:true});f.request();f.children[0].emit('error',new Error('private'));
  if(close)f.close(0,1);await f.flush();if(!close)await f.advance(500);
  f.refused(close?'closed':'unresolved','never-started');
}
for(const [op,path,opts] of [['bad','C:\\x',{}],['prepare-directory','relative',{}],['prepare-directory','C:\\x',{timeoutMs:1}],['prepare-directory','C:\\x',{signal:AbortSignal.abort()}]]){
  const f=await fixture();f.request(op,path,opts);await f.flush();f.refused('never-started','never-started');assert.equal(f.calls,0);
}
{
  const f=await fixture();f.request();await f.advance(1000);assert.equal(f.settled,false);await f.advance(1000);
  f.refused('unresolved','unresolved'); // Delayed operation callback earns no new500ms.
}
// Evaluate the real hook module with fixed caller dependencies; no filesystem IO.
const hookURL=new URL('../src/windows-hook.mjs',import.meta.url),hook=await readFile(hookURL,'utf8');
for(const failure of ['plain','never-started','closed','unresolved',null,'journal-off']){
  let journal=0,state=0;
  const context=vm.createContext({Buffer});
  const api=await load(hook,hookURL,context,{
    'node:perf_hooks':{performance:{now:()=>0}},
    './windows-storage.mjs':{windowsStorageRequest:async()=>{journal++;if(failure&&failure!=='journal-off'){const error=new Error('synthetic');if(failure!=='plain')Object.defineProperty(error,'storageLifecycle',{value:Object.freeze({version:1,helper:failure,terminator:'never-started',descendants:'unverified'})});throw error;}}},
    './scope.mjs':{windowsHookProjectMatches:(a,b)=>a===b},
    './journal.mjs':{encodeJournalRecord:()=> '{}'},'./state.mjs':{metadataScopeKey:()=> '1'.repeat(64)},
    './windows-state.mjs':{recordWindowsMetadata:async()=>{state++;}},
  });
  const result=await api.writeWindowsHookMetadata({event:{cwd:'synthetic'},projectRoot:'synthetic',dataDirectory:'unused',journal:failure==='journal-off'?null:{},stateMetadata:{},stateScope:'project'});
  assert.equal(journal,failure==='journal-off'?0:1);assert.equal(state,!failure||failure==='journal-off'?1:0);
  assert.equal(result.state,state?'recorded':'unavailable');cases++;
}
// Caller propagation: no filesystem or timer activity is allowed in these paths.
const noIO = () => { throw new Error('Unexpected fixture IO'); };
const fs = Object.fromEntries(['lstat','mkdir','open','rename','rm','rmdir','stat','opendir','unlink','realpath'].map(k=>[k,noIO]));
const context=vm.createContext({Buffer,URL,AbortSignal,Date,performance:{now:()=>0},process:{platform:'win32'}});
const refusal=new Error('SYNTHETIC_PRIVATE');let calls=[];
const transport=async op=>{calls.push(op);throw refusal;};
const journalURL=new URL('../src/journal.mjs',import.meta.url);
const journal=await load(await readFile(journalURL,'utf8'),journalURL,context,{
  'node:fs':{constants:fsConstants},'node:fs/promises':fs,'node:path':paths,
  'node:timers/promises':{setTimeout:noIO},'./constants.mjs':constants,
  './windows-storage.mjs':{windowsStorageRequest:transport,validateWindowsPrivatePath:p=>p},
});
for(const action of [()=>journal.prepareDataDirectory('C:\\synthetic'),()=>journal.appendJournalEntry('C:\\synthetic',{event:'SessionStart'}),()=>journal.readJournalEntries('C:\\synthetic')]){
  calls=[];await assert.rejects(action(),error=>error===refusal);assert.equal(calls.length,1);cases++;
}
const stateURL=new URL('../src/windows-state.mjs',import.meta.url);
for(const failAt of ['state-list','state-read','state-prune']){
  calls=[];
  const state=await load(await readFile(stateURL,'utf8'),stateURL,context,{
    'node:crypto':crypto,'./journal.mjs':journal,
    './windows-storage.mjs':{windowsStorageRequest:async op=>{
      calls.push(op);if(op===failAt)throw refusal;
      return op==='state-list'?[Buffer.from(JSON.stringify(['1'.repeat(64),'2'.repeat(64)]))]:[Buffer.alloc(0),Buffer.alloc(0)];
    }},
  });
  await assert.rejects(state.pruneWindowsMetadata('unused',new Date()),e=>e===refusal);
  assert.equal(calls.at(-1),failAt);assert.equal(calls.filter(c=>c===failAt).length,1);cases++;
}
const publicStateURL=new URL('../src/state.mjs',import.meta.url);calls=[];
const publicState=await load(await readFile(publicStateURL,'utf8'),publicStateURL,context,{
  'node:crypto':crypto,'node:fs/promises':fs,'node:path':paths,'node:timers/promises':{setTimeout:noIO},
  './journal.mjs':journal,'./state-lock-budget.mjs':{createStateLockBudget:noIO},
  './windows-state.mjs':{recordWindowsMetadata:transport,readWindowsMetadata:transport,pruneWindowsMetadata:transport},
});
await assert.rejects(publicState.observeMetadataState('unused',vm.runInContext("({projectId:'synthetic',sessionId:'one'})",context)).next(),e=>e===refusal);
assert.equal(calls.length,1);cases++;
const usageURL=new URL('../src/usage.mjs',import.meta.url);calls=[];
const usage=await load(await readFile(usageURL,'utf8'),usageURL,context,{
  'node:fs':{constants:fsConstants},'node:fs/promises':fs,'node:path':paths,
  './windows-storage.mjs':{readWindowsPrivateFile:transport},
});
const result=await usage.readSelectedUsage('unused');assert.equal(result.available,false);
assert.equal(calls.length,1);assert.doesNotMatch(JSON.stringify(result),/SYNTHETIC_PRIVATE/);cases++;
console.log(JSON.stringify({contract:'WS-L1',cases,realHelperProcesses:0,windowsIO:false}));
