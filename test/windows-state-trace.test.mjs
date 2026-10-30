import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { win32 } from 'node:path';
import { instrumentBridge } from '../proofs/windows-state-trace-instrumentation.mjs';
const url=new URL('../src/windows-storage.mjs',import.meta.url);
const original=await readFile(url,'utf8');
test('copied instrumentation rejects missing and duplicate exact markers',()=>{
  assert.throws(()=>instrumentBridge(original.replace('    const child = helper.child;','')),/shape/);
  assert.throws(()=>instrumentBridge(original+'\n    const child = helper.child;'),/shape/);
});
for(const crlf of [false,true])for(const mode of ['success','throw','nonzero','expiry']) {
  test(`copied bridge ${crlf?'CRLF':'LF'} ${mode} preserves settlement and fixed diagnostics`,async()=>{
    // A separate process owns VM evaluation because default node --test lacks the flag.
    const {spawnSync}=await import('node:child_process');
    if(!process.execArgv.includes('--experimental-vm-modules')) {
      const r=spawnSync(process.execPath,['--experimental-vm-modules','--test','--test-name-pattern',`^copied bridge ${crlf?'CRLF':'LF'} ${mode} `,fileURLToPath(import.meta.url)],{encoding:'utf8',timeout:10000});
      assert.equal(r.status,0,r.stdout+r.stderr);return;
    }
    let now=0;const timers=[],children=[];
    const context=vm.createContext({Buffer,URL,AbortSignal,process:{platform:'win32',env:{SystemRoot:'C:\\Windows'}},
      setTimeout(fn,delay){const t={fn,at:now+delay};timers.push(t);return t;},clearTimeout(t){if(t)t.clear=true;}});
    const spawn=()=>{if(mode==='throw')throw Error('PRIVATE');const c=new EventEmitter();
      Object.assign(c,{pid:42,exitCode:null,signalCode:null,kill:()=>false,stdin:new EventEmitter(),stdout:new EventEmitter(),stderr:new EventEmitter()});c.stdin.end=()=>{};children.push(c);return c;};
    const bindings={'node:child_process':{spawn},'node:url':{fileURLToPath},'node:path':{win32},'node:perf_hooks':{performance:{now:()=>now}}};
    const module=new vm.SourceTextModule(instrumentBridge(crlf?original.replace(/\n/g,'\r\n'):original),{context,initializeImportMeta:m=>{m.url=url.href;}});
    await module.link(name=>{const values=bindings[name];assert.ok(values);return new vm.SyntheticModule(Object.keys(values),function(){for(const [k,v]of Object.entries(values))this.setExport(k,v);},{context});});await module.evaluate();
    let error,value;const p=module.namespace.windowsStorageRequest('prepare-directory','C:\\Synthetic\\private',{timeoutMs:100}).then(v=>{value=v;},e=>{error=e;});
    if(children[0]) {
      children[0].stderr.emit('data',Buffer.from('PRIVATE R001 kind-IOException '+'x'.repeat(5000)+' R999'));
      if(mode!=='expiry'){children[0].stdout.emit('data',Buffer.from('2|ok|0|\n'));children[0].exitCode=mode==='nonzero'?1:0;children[0].emit('close',children[0].exitCode);}
    }
    if(mode==='expiry'||mode==='throw'){now=600;for(let round=0;round<2;round++)for(const t of [...timers])if(!t.clear&&t.at<=now){t.clear=true;t.fn();}}
    await p;assert.equal(Boolean(value),mode==='success');
    if(error){assert.equal(error.code,'ERR_WINDOWS_STORAGE_UNAVAILABLE');assert.ok(Object.isFrozen(error.storageLifecycle));}
    assert.ok(timers.every(t=>t.clear));
    const frames=module.namespace.takeTraceFrames();assert.equal(frames.length,1);
    const frame=JSON.parse(JSON.stringify(frames[0]));assert.deepEqual(Object.keys(frame),['op','ok','elapsedMs','labels']);
    assert.doesNotMatch(JSON.stringify(frame),/PRIVATE|R999/);assert.equal(frame.ok,mode==='success');assert.equal(module.namespace.takeTraceFrames().length,0);
  });
}

for(const mode of ['success','request-unresolved','io-unresolved'])test('diagnostic cleanup integration '+mode,async()=>{
  if(!process.execArgv.includes('--experimental-vm-modules')) {
    const {spawnSync}=await import('node:child_process');
    const r=spawnSync(process.execPath,['--experimental-vm-modules','--test','--test-name-pattern','^diagnostic cleanup integration '+mode+'$',fileURLToPath(import.meta.url)],{encoding:'utf8',timeout:10000});
    assert.equal(r.status,0,r.stdout+r.stderr);return;
  }
  const {OwnedFixtureScope}=await import('./owned-fixture-lifecycle.mjs');
  let scope,restored=false,removed=0,requests=0;
  class Scope extends OwnedFixtureScope {
    constructor(){super();scope=this;}
    trackExternalSpawns(){return()=>{restored=true;};}
  }
  const output=[];const fakeProcess={platform:'win32',argv:['node','diagnostic'],exitCode:0};
  const context=vm.createContext({Buffer,URL,process:fakeProcess,console:{log:s=>output.push(s),error:s=>output.push(s)}});
  const fs={mkdtemp:async()=>'/synthetic-owned',realpath:async p=>p,mkdir:async()=>{},
    readFile:async url=>readFile(url,'utf8'),writeFile:async()=>{if(mode==='io-unresolved')scope.writes.add('synthetic pending IO');},
    rm:async()=>{removed++;}};
  const paths=await import('node:path'),urls=await import('node:url');
  const bindings={'node:fs/promises':fs,'node:os':{tmpdir:()=>'/synthetic'},'node:path':paths,'node:url':urls,
    '../test/owned-fixture-lifecycle.mjs':{OwnedFixtureScope:Scope},'./windows-state-trace-instrumentation.mjs':{instrumentBridge}};
  const dynamic=new vm.SyntheticModule(['windowsStorageRequest','takeTraceFrames'],function(){
    this.setExport('windowsStorageRequest',async()=>{requests++;if(mode==='request-unresolved'){scope.unresolved=true;throw Error('PRIVATE');}return [Buffer.alloc(0),Buffer.alloc(0)];});
    this.setExport('takeTraceFrames',()=>[]);
  },{context});await dynamic.link(()=>{});await dynamic.evaluate();
  const scriptURL=new URL('../proofs/windows-state-trace.mjs',import.meta.url);
  const module=new vm.SourceTextModule(await readFile(scriptURL,'utf8'),{context,initializeImportMeta:m=>{m.url=scriptURL.href;},importModuleDynamically:()=>dynamic});
  await module.link(name=>{const values=bindings[name];assert.ok(values,name);return new vm.SyntheticModule(Object.keys(values),function(){for(const [k,v]of Object.entries(values))this.setExport(k,v);},{context});});
  await module.evaluate();assert.equal(restored,true);
  assert.equal(removed,mode==='success'?1:0);assert.equal(fakeProcess.exitCode,mode==='success'?0:1);
  if(mode==='request-unresolved')assert.equal(requests,1);
  assert.doesNotMatch(output.join('\n'),/PRIVATE|synthetic-owned/);
});
