import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp,realpath,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join,win32 } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

// Real POSIX/Windows scoped storage; controlled observer clock in a separate
// process. Not real-time delivery, mocked Windows compatibility or native Codex.
async function fixture(t,mode) {
  const root=await mkdtemp(join(await realpath(tmpdir()),'mods-observer-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  const p=spawn(process.execPath,[fileURLToPath(new URL('../proofs/state-observer-clock.mjs',import.meta.url)),mode,root],
    {windowsHide:true,stdio:['ignore','pipe','pipe']});
  let out='',err='',expired=false,stopping=false,killer,killerClosed;
  const closed=new Promise((resolve,reject)=>{p.once('close',code=>resolve(code));p.once('error',reject);});
  closed.catch(()=>{});
  const stop=()=>{
    if(stopping || p.exitCode!==null || p.signalCode!==null)return;
    stopping=true;
    if(process.platform==='win32' && p.pid) {
      // Same fixed OS cleanup utility pattern as the private bridge; own PID only.
      // Never search PATH or use project executables. No process handles exported.
      const osRoot=process.env.SystemRoot;
      if(typeof osRoot==='string' && /^[A-Za-z]:\\[^\p{Cc}]*$/u.test(osRoot)) {
        killer=spawn(win32.join(osRoot,'System32','taskkill.exe'),['/PID',String(p.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});
        killerClosed=new Promise(resolve=>{killer.once('close',resolve);killer.once('error',()=>{p.kill();resolve();});});
      } else p.kill();
    } else p.kill();
  };
  const timer=setTimeout(()=>{expired=true;stop();},45000);
  const fallback=setTimeout(()=>{if(expired){killer?.kill();p.kill();}},46000);
  p.stdout.on('data',b=>{out+=b;if(out.length>8192)stop();});
  p.stderr.on('data',b=>{err+=b;if(err.length>1024)stop();});
  try {
    assert.equal(await closed,0,'Scoped observer fixture must complete');
    assert.equal(expired,false,'Scoped observer fixture outer deadline');assert.equal(err,'');
    assert.ok(out.length<=8192);const value=JSON.parse(out);
    assert.equal(value.mode,mode);assert.equal(value.initialRecords,3);assert.equal(value.storedRecords,4);assert.equal(value.closed,true);
    assert.deepEqual(value.timings.map(v=>v.phase),['initial-writes','initial-observation','paused-write','resumed-observation','fresh-read']);
    assert.ok(value.timings.every(v=>Number.isFinite(v.elapsedMs)&&v.elapsedMs>=0));
    t.diagnostic(JSON.stringify(value));return value;
  } finally {
    clearTimeout(timer);stop();
    try {await closed;} finally {
      clearTimeout(fallback);
      if(killerClosed) {
        const cleanup=setTimeout(()=>killer.kill(),500);
        try {await killerClosed;} finally {clearTimeout(cleanup);}
      }
    }
  }
}
test('scoped observer sees a completed paused write inside its deadline and closes on cancel',{timeout:60000},async t=>{
  const value=await fixture(t,'live');assert.equal(value.secondDone,false);assert.equal(value.observedRecords,4);assert.equal(value.legacyAssertion,'not-run');
});
test('scoped observer expires during a consumer pause without yielding or losing the completed event',{timeout:60000},async t=>{
  const value=await fixture(t,'expired');assert.equal(value.secondDone,true);assert.equal(value.observedRecords,null);assert.equal(value.legacyAssertion,'TypeError');
});
