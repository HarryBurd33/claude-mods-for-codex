// Fixed test child: accepts only a scenario enum, creates a NEW project/private
// plan under its fresh owned cwd, and never accepts a target/plan/command path.
import { mkdir,writeFile,readFile,readdir,lstat,realpath,chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { selectedHandleFaults,restoreFaultCases } from './restore-fault-io.mjs';
import { prepareRestorePlan,reviewRestorePlan,applyRestorePlan } from '../../src/restore.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const send=message=>new Promise((resolve,reject)=>process.send(message,error=>error?reject(error):resolve()));
let ownedBase=null;
async function run(scenario) {
  process.umask(0o077);
  const base=await realpath(process.cwd()),info=await lstat(base);
  if (process.platform==='win32' || !process.send || !info.isDirectory() || info.isSymbolicLink()
      || (info.mode&0o077) || info.uid!==process.getuid() || (await readdir(base)).length) throw Error('Unsafe fixture cwd');
  ownedBase=base;
  const timer=setTimeout(()=>{process.exitCode=124;process.disconnect();},20_000);
  // No retries, no arbitrary execution, no inherited user/global configuration.
  const project=join(base,'project'),plans=join(base,'private'),planPath=join(plans,'plan.json');
  let injection;
  try {
    await mkdir(project,{mode:0o700});await mkdir(plans,{mode:0o700});
    const target=Buffer.from('restored version\n'+'A'.repeat(97)+'\n');
    const expected=Buffer.from('expected checkpoint\n'+'B'.repeat(193)+'\n');
    const file=join(project,'edit.txt');
    const git=(...args)=>{
      const r=spawnSync('git',['-c','user.name=Synthetic Test','-c','user.email=synthetic@example.invalid',
        '-c','core.hooksPath=/dev/null','-c','core.attributesFile=/dev/null','-c','credential.helper=',...args],
        {cwd:project,encoding:'utf8',timeout:5000,maxBuffer:65536,shell:false,
          env:{PATH:process.env.PATH,LANG:'C',LC_ALL:'C',GIT_CONFIG_NOSYSTEM:'1',
            GIT_CONFIG_SYSTEM:'/dev/null',GIT_CONFIG_GLOBAL:'/dev/null',GIT_TERMINAL_PROMPT:'0',GIT_NO_LAZY_FETCH:'1'}});
      if (r.status!==0 || r.error) throw Error('Synthetic Git fixture failed');
      return r.stdout.trim();
    };
    git('init','--template=','--initial-branch=main');
    await writeFile(file,target);await writeFile(join(project,'other.txt'),'synthetic tracked baseline\n');
    git('add','.');git('commit','-m','Synthetic before');const fromCommit=git('rev-parse','HEAD');
    await writeFile(file,expected);git('add','edit.txt');git('commit','-m','Synthetic after');const toCommit=git('rev-parse','HEAD');
    await chmod(file,0o640);await writeFile(join(project,'other.txt'),'synthetic unselected edit\n');
    await writeFile(join(project,'untracked.txt'),'synthetic untracked sentinel\n');
    const prepared=await prepareRestorePlan(project,{fromCommit,toCommit,path:'edit.txt'},planPath);
    const reviewed=await reviewRestorePlan(planPath);
    if (!reviewed.currentMatchesExpected || prepared.planId!==reviewed.planId) throw Error('Fixture plan review mismatch');
    const selected=await lstat(file);
    const checks=['other.txt','untracked.txt','.git/index','.git/HEAD','.git/refs/heads/main'];
    const baseline={files:Object.fromEntries(await Promise.all(checks.map(async p=>[p,hash(await readFile(join(project,p)))]))),
      selected:{dev:selected.dev,ino:selected.ino,uid:selected.uid,mode:selected.mode},
      targetSha256:hash(target),expectedSha256:hash(expected),planSha256:hash(await readFile(planPath)),planId:reviewed.planId};
    await writeFile(join(base,'fixture-state.json'),JSON.stringify(baseline,null,2)+'\n',{flag:'wx',mode:0o600});
    injection=selectedHandleFaults(file,selected,scenario,async trace=>{
      await send({type:'phase',scenario,phase:'prefix-written',trace});
      // Parent owns termination at this barrier. Work timer remains a backstop;
      // keep the child alive, never issue another write/recovery or cleanup here.
      await new Promise(()=>{});
    });
    let outcome,restored=false;
    try {restored=(await applyRestorePlan(planPath,reviewed.planId)).restored===true;outcome='success';}
    catch(error) {
      if(error.message==='Restore: write failed; original content restored')outcome='rolled-back';
      else if(error.message==='Restore: write and recovery failed; recover the original bytes from the private plan before proceeding')outcome='manual-recovery';
      else throw error;
    }
    await send({type:'result',scenario,outcome,restored,trace:injection.trace});
  } finally {
    injection?.dispose();clearTimeout(timer);
    if(process.connected)process.disconnect();
  }
}
// No-argument discovery/import does nothing (including on Windows).
if (process.argv.length===3 && restoreFaultCases.includes(process.argv[2]) && typeof process.send==='function') {
  run(process.argv[2]).catch(async error=>{
    // Synthetic diagnostics are private; no raw path/content enters phase output.
    if(ownedBase)try {await writeFile(join(ownedBase,'fixture-error.json'),JSON.stringify({name:error.name,message:error.message,code:error.code},null,2)+'\n',{flag:'wx',mode:0o600});}catch{}
    process.exitCode=1;
    if(process.connected){try{await send({type:'failure',reason:'fixture-failed'});}finally{process.disconnect();}}
  });
}
