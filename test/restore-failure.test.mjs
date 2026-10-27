import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,mkdir,realpath,readFile,writeFile,lstat,readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn,spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { restoreFaultCases } from './fixtures/restore-fault-io.mjs';
const peer=fileURLToPath(new URL('./fixtures/restore-failure-peer.mjs',import.meta.url));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
let stop=false;
function supervise(base,scenario) {
  return new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[peer,scenario],{cwd:base,shell:false,
      env:{PATH:process.env.PATH,HOME:base,TMPDIR:process.env.TMPDIR??tmpdir(),LANG:'C',LC_ALL:'C'},
      stdio:['ignore','pipe','pipe','ipc']});
    let size=0,phase=null,result=null,error=null,exited=false,closed=false,termTimer,killTimer;
    const output=[];const started=performance.now();
    const signal=name=>{
      if(exited||closed||child.exitCode!==null||child.signalCode!==null)return false;
      return child.kill(name); // Only this owned ChildProcess; no group/PID fallback.
    };
    const cancel=reason=>{
      error??=Error(reason);signal('SIGTERM');
      termTimer??=setTimeout(()=>signal('SIGKILL'),250);
      killTimer??=setTimeout(()=>{
        if(!closed){child.unref();child.stdout.destroy();child.stderr.destroy();if(child.connected)child.disconnect();reject(Error('Owned fixture child outcome unknown; retain evidence and stop'));}
      },1250);
    };
    const timer=setTimeout(()=>cancel('Fixed fixture work deadline'),20_000);
    const data=chunk=>{size+=chunk.length;if(size>65536)cancel('Fixture output bound');else output.push(chunk);};
    child.stdout.on('data',data);child.stderr.on('data',data);
    child.on('message',message=>{
      size+=Buffer.byteLength(JSON.stringify(message));
      if(size>65536){cancel('Fixture phase output bound');return;}
      if(message?.type==='phase' && message.scenario===scenario && message.phase==='prefix-written'
          && scenario==='interrupt' && !phase && !result && message.trace?.selectedHandles===1
          && message.trace.prefixWrites===1 && performance.now()-started<20_000 && !exited){
        phase=message;
        if(!signal('SIGTERM'))cancel('Owned barrier child termination was not accepted');
        termTimer=setTimeout(()=>signal('SIGKILL'),250);
        killTimer=setTimeout(()=>{
          if(!closed){child.unref();child.stdout.destroy();child.stderr.destroy();if(child.connected)child.disconnect();reject(Error('Owned barrier child outcome unknown; retain evidence and stop'));}
        },1250);
        return;
      }
      if(message?.type==='result' && message.scenario===scenario && !result && !phase){result=message;return;}
      cancel('Unexpected fixed fixture protocol');
    });
    child.once('error',()=>cancel('Fixture spawn failed'));
    child.once('exit',()=>{exited=true;});
    child.once('close',async(code,signalName)=>{
      closed=true;clearTimeout(timer);clearTimeout(termTimer);clearTimeout(killTimer);
      try {
        await writeFile(join(base,'child-output.txt'),Buffer.concat(output),{flag:'wx',mode:0o600});
        if(error)throw error;
        if(scenario==='interrupt')assert.ok(phase&&!result&&code===null&&['SIGTERM','SIGKILL'].includes(signalName));
        else assert.ok(result&&!phase&&code===0&&signalName===null,'fixed child must return a result, not only exit');
        resolve({message:result??phase,directChildReaped:true,signal:signalName,outputBytes:size});
      }catch(e){reject(e);}
    });
  });
}
for(const scenario of restoreFaultCases) {
  await test(`POSIX restore ${scenario}: bounded synthetic selected-handle fault`,{skip:process.platform==='win32',timeout:25_000},async t=>{
    if(stop){t.skip('Prior fixture outcome failed; no subsequent case started');return;}
    const base=await mkdtemp(join(await realpath(tmpdir()),'mods-restore-failure-'+scenario+'-'));
    try {
      if(scenario==='control'){
        // Helper must be inert outside the explicitly owned IPC child route.
        const probe=spawnSync(process.execPath,[peer,'control'],{cwd:base,shell:false,
          env:{PATH:process.env.PATH},encoding:'utf8',timeout:1000,maxBuffer:65536});
        assert.equal(probe.status,0,'no-IPC helper invocation must not act');
        assert.equal(probe.stdout+probe.stderr,'');assert.deepEqual(await readdir(base),[]);
      }
      const run=await supervise(base,scenario),p=join(base,'project');
      const before=JSON.parse(await readFile(join(base,'fixture-state.json'),'utf8'));
      for(const [path,expected] of Object.entries(before.files))assert.equal(hash(await readFile(join(p,path))),expected,'unselected/index/HEAD preserved');
      const rawPlan=await readFile(join(base,'private/plan.json'));assert.equal(hash(rawPlan),before.planSha256);
      const plan=JSON.parse(rawPlan);assert.equal(hash(Buffer.from(JSON.stringify(plan))),before.planId);
      assert.equal(hash(Buffer.from(plan.before,'base64')),before.targetSha256);assert.equal(hash(Buffer.from(plan.after,'base64')),before.expectedSha256);
      const planInfo=await lstat(join(base,'private/plan.json'));assert.ok(planInfo.isFile()&&planInfo.nlink===1&&planInfo.uid===process.getuid()&&(planInfo.mode&0o777)===0o600);
      const selected=await lstat(join(p,'edit.txt'));assert.ok(selected.isFile()&&selected.nlink===1);
      for(const field of ['dev','ino','uid','mode'])assert.equal(selected[field],before.selected[field],field);
      const bytes=await readFile(join(p,'edit.txt'));const target=Buffer.from(plan.before,'base64'),expected=Buffer.from(plan.after,'base64');
      const trace=run.message.trace;assert.equal(trace.selectedHandles,1,'real module must use the wrapped handle');
      const isPartial=bytes.equals(Buffer.concat([target.subarray(0,8),expected.subarray(8)]));
      const lock=await lstat(join(p,'.claude-mods-restore.lock')).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
      if(['control','short-writes'].includes(scenario)){
        assert.equal(run.message.outcome,'success');assert.equal(run.message.restored,true);assert.deepEqual(bytes,target);assert.equal(lock,null);
        if(scenario==='short-writes')assert.ok(trace.shortWrites>1&&trace.writes===trace.shortWrites);
        assert.deepEqual(trace.faults,[]);
      } else if(scenario==='interrupt'){
        assert.ok(isPartial&&!bytes.equals(expected)&&!bytes.equals(target));assert.ok(lock?.isDirectory());
        assert.equal(lock.mode&0o777,0o700);assert.equal(lock.uid,process.getuid());
        assert.deepEqual(await readdir(join(p,'.claude-mods-restore.lock')),[]);assert.deepEqual(trace.faults,[]);
      } else if(scenario==='recovery-error'){
        assert.equal(run.message.outcome,'manual-recovery');assert.equal(run.message.restored,false);assert.ok(isPartial);assert.equal(lock,null);
        assert.deepEqual(trace.faults,['target-write','recovery-write']);assert.equal(trace.recoveryWrites,1);
      } else {
        assert.equal(run.message.outcome,'rolled-back');assert.equal(run.message.restored,false);assert.deepEqual(bytes,expected);assert.equal(lock,null);
        const fault={ 'zero-progress':'zero-progress','partial-error':'target-write','truncate-error':'target-truncate','sync-error':'target-sync' }[scenario];
        assert.deepEqual(trace.faults,[fault]);assert.equal(trace.recoveryWrites,1);
      }
      assert.ok(trace.writes>0);
      if(['partial-error','recovery-error','interrupt'].includes(scenario))assert.equal(trace.prefixWrites,1);
      if(scenario==='truncate-error')assert.equal(trace.truncates,2);
      if(scenario==='sync-error')assert.equal(trace.syncs,2);
      const report={scenario,outcome:run.message.outcome??'interrupted-partial',directChildReaped:run.directChildReaped,
        allDescendantsVerified:false,selectedMetadataUnchanged:true,unselectedIndexHeadUnchanged:true,planUnchanged:true,
        lockRetained:!!lock,rawContentReported:false,trace,phaseOutputBytes:run.outputBytes};
      await writeFile(join(base,'result.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});
      t.diagnostic(JSON.stringify(report));
      // Retain owned cases, including interrupted lock/plan; no recovery or retry.
    }catch(error){stop=true;throw error;}
  });
}
