import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, realpath, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, win32 } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const native={skip:process.platform!=='win32',timeout:45000};
const script=fileURLToPath(new URL('../proofs/windows-lock-contention.ps1',import.meta.url));

async function fixture(t,mode) {
  const root=await mkdtemp(join(await realpath(tmpdir()),'mods-lock-proof-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  const data=join(root,'private');
  const osRoot=process.env.SystemRoot;
  assert.match(osRoot,/^[A-Za-z]:\\[^\p{Cc}]*$/u);
  const osBin=win32.join(osRoot,'System32');
  const psDirectory=win32.join(osBin,'WindowsPowerShell','v1.0');
  const env={};
  for(const name of ['SystemRoot','windir','SystemDrive','ComSpec','TEMP','TMP','USERPROFILE','HOMEDRIVE','HOMEPATH','APPDATA','LOCALAPPDATA','ProgramFiles','ProgramFiles(x86)','ProgramW6432','NUMBER_OF_PROCESSORS','PROCESSOR_ARCHITECTURE','OS']) {
    if(process.env[name]!==undefined)env[name]=process.env[name];
  }
  env.SystemRoot=osRoot;env.windir=osRoot;env.PATH=osBin;env.PSModulePath=win32.join(psDirectory,'Modules');
  const child=spawn(win32.join(psDirectory,'powershell.exe'),['-NoLogo','-NoProfile','-NonInteractive','-File',script,'-Directory',data,'-Mode',mode],
    {shell:false,windowsHide:true,cwd:root,env,stdio:['ignore','pipe','pipe']});
  let output='',stderr='',expired=false,overflow=false,stopping=false,killer,killerClosed;
  const closed=new Promise((resolve,reject)=>{child.once('close',resolve);child.once('error',reject);});
  closed.catch(()=>{});
  const stop=()=>{
    if(stopping || child.exitCode!==null || child.signalCode!==null)return;
    stopping=true;
    if(!child.pid){child.kill();return;}
    // Fixed system utility, only this owned compile/helper process tree.
    killer=spawn(win32.join(osBin,'taskkill.exe'),['/PID',String(child.pid),'/T','/F'],{shell:false,windowsHide:true,env,stdio:'ignore'});
    killerClosed=new Promise(resolve=>{killer.once('close',()=>{child.kill();resolve();});killer.once('error',()=>{child.kill();resolve();});});
  };
  const deadline=setTimeout(()=>{expired=true;stop();},30000);
  const fallback=setTimeout(()=>{if(stopping){killer?.kill();child.kill();}},31000);
  child.stdout.on('data',chunk=>{output+=chunk;if(output.length>1024){output=output.slice(0,1024);overflow=true;stop();}});
  child.stderr.on('data',chunk=>{stderr+=chunk;if(stderr.length>1024){stderr=stderr.slice(0,1024);overflow=true;stop();}});
  try {
    assert.equal(await closed,0,'Owned native lock proof must complete');
    assert.equal(expired,false,'Owned native lock proof deadline');assert.equal(overflow,false);assert.equal(stderr,'');
    const fields=output.trim().split('|');
    assert.deepEqual(fields.slice(0,3),['lock-proof',mode,'create-error']);
    assert.deepEqual(fields.slice(4),['contender','refused','released','acquired','empty','true']);
    assert.match(fields[3],/^(0|[1-9][0-9]{0,4})$/);const createError=Number(fields[3]);
    if(mode==='held-lock')assert.equal(createError,0);
    else assert.ok([5,183].includes(createError),'Observed pending-name create result must be access-denied or already-exists');
    assert.deepEqual(await readdir(data),[]);
    t.diagnostic(JSON.stringify({diagnosticOnly:true,mode,createError,contender:'refused',afterRelease:'acquired',empty:true,oldFailureCauseEstablished:false}));
  } finally {
    clearTimeout(deadline);stop();
    try {await closed;} finally {
      clearTimeout(fallback);
      if(killerClosed) {
        const cleanup=setTimeout(()=>killer.kill(),500);
        try {await killerClosed;} finally {clearTimeout(cleanup);}
      }
    }
  }
}

test('native Windows retained lock metadata observes delete-pending refusal and release without authority changes',native,t=>fixture(t,'delete-pending'));
test('native Windows held lock refuses bounded acquisition without stealing its owner and succeeds after release',native,t=>fixture(t,'held-lock'));
