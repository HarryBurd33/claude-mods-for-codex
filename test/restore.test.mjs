import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp,realpath,readFile,writeFile,rm,mkdir,chmod,lstat,readdir,symlink,link } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepareRestorePlan,reviewRestorePlan,applyRestorePlan } from '../src/restore.mjs';
import { runCli } from '../src/cli.mjs';

const posix={skip:process.platform==='win32'};
function git(root,...args){const r=spawnSync('git',['-c','user.name=Synthetic Test','-c','user.email=synthetic@example.invalid',...args],{cwd:root,encoding:'utf8',timeout:5000,
  env:{PATH:process.env.PATH,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null',GIT_TERMINAL_PROMPT:'0'}});assert.equal(r.status,0,r.stderr||r.error?.message);return r.stdout.trim();}
async function fixture(t){
  const base=await mkdtemp(join(await realpath(tmpdir()),'mods-restore-'));t.after(()=>rm(base,{recursive:true,force:true}));
  const root=join(base,'project'),output=join(base,'private','review.json');await mkdir(root);await mkdir(join(base,'private'),{mode:0o700});
  git(root,'init','--template=','--initial-branch=main');await writeFile(join(root,'edit.txt'),'before\n');await writeFile(join(root,'other.txt'),'other baseline\n');git(root,'add','.');git(root,'commit','-m','Synthetic before');const fromCommit=git(root,'rev-parse','HEAD');
  await writeFile(join(root,'edit.txt'),'after\n');git(root,'add','.');git(root,'commit','-m','Synthetic after');const toCommit=git(root,'rev-parse','HEAD');
  return{base,root,output,input:{fromCommit,toCommit,path:'edit.txt'}};
}
test('restore requires explicit reviewed plan, preserves unrelated work/index/HEAD and can be explicitly reversed',posix,async t=>{
  const {root,output,input}=await fixture(t);await chmod(join(root,'edit.txt'),0o640);await writeFile(join(root,'other.txt'),'unrelated human edit\n');
  const index=await readFile(join(root,'.git/index')),head=await readFile(join(root,'.git/HEAD')),info=await lstat(join(root,'edit.txt'));
  const plan=await prepareRestorePlan(root,input,output);assert.equal(plan.readOnlyProject,true);assert.equal(await readFile(join(root,'edit.txt'),'utf8'),'after\n');assert.equal((await lstat(output)).mode&0o777,0o600);
  assert.doesNotMatch(JSON.stringify(plan),/before\\n|after\\n/);assert.equal(plan.projectRoot,root);
  const reviewed=await reviewRestorePlan(output);assert.equal(reviewed.planId,plan.planId);assert.equal(reviewed.currentMatchesExpected,true);
  await assert.rejects(applyRestorePlan(output,'0'.repeat(64)),/exact reviewed plan ID/);assert.equal(await readFile(join(root,'edit.txt'),'utf8'),'after\n');
  let cliOutput='';await runCli(['restore-apply','--plan',output,'--confirm-plan',plan.planId],{stdout:{write:s=>cliOutput+=s}});assert.equal(JSON.parse(cliOutput).restored,true);
  assert.equal(await readFile(join(root,'edit.txt'),'utf8'),'before\n');assert.equal(await readFile(join(root,'other.txt'),'utf8'),'unrelated human edit\n');
  const after=await lstat(join(root,'edit.txt'));assert.equal(after.ino,info.ino);assert.equal(after.mode,info.mode);assert.equal(after.uid,info.uid);
  assert.deepEqual(await readFile(join(root,'.git/index')),index);assert.deepEqual(await readFile(join(root,'.git/HEAD')),head);
  await assert.rejects(applyRestorePlan(output,plan.planId),/conflicts/);assert.equal((await readdir(root)).includes('.claude-mods-restore.lock'),false);
  const reverse=await prepareRestorePlan(root,{...input,fromCommit:input.toCommit,toCommit:input.fromCommit},output+'.reverse');await applyRestorePlan(output+'.reverse',reverse.planId);assert.equal(await readFile(join(root,'edit.txt'),'utf8'),'after\n');
});
test('restore refuses late human edits, read-only files and competing restore locks without overwriting',posix,async t=>{
  const {root,output,input}=await fixture(t),file=join(root,'edit.txt'),lock=join(root,'.claude-mods-restore.lock');const plan=await prepareRestorePlan(root,input,output);
  await writeFile(file,'late human edit\n');assert.equal((await reviewRestorePlan(output)).currentMatchesExpected,false);await assert.rejects(applyRestorePlan(output,plan.planId),/conflicts/);assert.equal(await readFile(file,'utf8'),'late human edit\n');
  await assert.rejects(prepareRestorePlan(root,input,output+'.conflict'),/conflicts/);await assert.rejects(readFile(output+'.conflict'),{code:'ENOENT'});
  await writeFile(file,'after\n');await chmod(file,0o444);await assert.rejects(applyRestorePlan(output,plan.planId),/owner-writable/);assert.equal(await readFile(file,'utf8'),'after\n');await chmod(file,0o644);
  await mkdir(lock);await assert.rejects(applyRestorePlan(output,plan.planId),{code:'EEXIST'});assert.equal(await readFile(file,'utf8'),'after\n');await rm(lock,{recursive:true});
  const results=await Promise.allSettled([applyRestorePlan(output,plan.planId),applyRestorePlan(output,plan.planId)]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(await readFile(file,'utf8'),'before\n');
});
test('restore refuses unsafe selected paths, links, inside-project plans and existing outputs',posix,async t=>{
  const {base,root,output,input}=await fixture(t);await writeFile(output,'existing private data',{mode:0o600});
  await assert.rejects(prepareRestorePlan(root,input,output),{code:'EEXIST'});assert.equal(await readFile(output,'utf8'),'existing private data');
  await assert.rejects(prepareRestorePlan(root,input,join(root,'plan.json')),/outside/);await assert.rejects(readFile(join(root,'plan.json')),{code:'ENOENT'});
  for(const path of ['../escape','.env','.git/config','edit.txt/../edit.txt'])await assert.rejects(prepareRestorePlan(root,{...input,path},output+'.bad'));
  const outside=join(base,'outside.txt');await writeFile(outside,'outside sentinel');await rm(join(root,'edit.txt'));await symlink(outside,join(root,'edit.txt'));await assert.rejects(prepareRestorePlan(root,input,output+'.link'),/linked|regular/);assert.equal(await readFile(outside,'utf8'),'outside sentinel');
  await rm(join(root,'edit.txt'));await link(outside,join(root,'edit.txt'));await assert.rejects(prepareRestorePlan(root,input,output+'.hardlink'),/links/);
});
test('private restore plan cannot grant arbitrary path/content authority or broaden permissions',posix,async t=>{
  const {root,output,input}=await fixture(t);const plan=await prepareRestorePlan(root,input,output),raw=await readFile(output,'utf8'),value=JSON.parse(raw);
  await chmod(output,0o644);await assert.rejects(reviewRestorePlan(output),/private/);await chmod(output,0o600);
  for(const update of [{before:Buffer.from('injected content').toString('base64')},{path:'.env'},{extra:true},{mode:'100755'},{after:'not-base64!'}]){
    await writeFile(output,JSON.stringify({...value,...update}));await assert.rejects(reviewRestorePlan(output));
  }
  await writeFile(output,raw);await symlink(output,output+'.link');await assert.rejects(reviewRestorePlan(output+'.link'));
  await link(output,output+'.hard');await assert.rejects(reviewRestorePlan(output),/unlinked/);await rm(output+'.hard');
  assert.equal((await reviewRestorePlan(output)).planId,plan.planId);assert.equal(await readFile(join(root,'edit.txt'),'utf8'),'after\n');
});
test('restore refuses absent endpoints, binary content and executable-mode transitions',posix,async t=>{
  const {root,output,input}=await fixture(t);
  await writeFile(join(root,'added.txt'),'new fixture\n');git(root,'add','.');git(root,'commit','-m','Add fixture');const added=git(root,'rev-parse','HEAD');
  await assert.rejects(prepareRestorePlan(root,{...input,toCommit:added,path:'added.txt'},output),/present in both/);
  await chmod(join(root,'edit.txt'),0o755);git(root,'add','edit.txt');git(root,'commit','-m','Change fixture mode');const executable=git(root,'rev-parse','HEAD');
  await assert.rejects(prepareRestorePlan(root,{...input,toCommit:executable},output),/executable mode/);
  await chmod(join(root,'edit.txt'),0o644);await writeFile(join(root,'edit.txt'),Buffer.from([0xff,0x80]));git(root,'add','edit.txt');git(root,'commit','-m','Binary fixture');const binary=git(root,'rev-parse','HEAD');
  await assert.rejects(prepareRestorePlan(root,{...input,toCommit:binary},output),/binary/);
  await rm(join(root,'edit.txt'));git(root,'add','edit.txt');git(root,'commit','-m','Remove fixture');const deleted=git(root,'rev-parse','HEAD');
  await assert.rejects(prepareRestorePlan(root,{...input,toCommit:deleted},output),/present in both/);
  await assert.rejects(readFile(output),{code:'ENOENT'});
});
test('late symlink replacement is rejected before restore mutation',posix,async t=>{
  const {base,root,output,input}=await fixture(t),plan=await prepareRestorePlan(root,input,output);
  const outside=join(base,'outside.txt');await writeFile(outside,'outside sentinel');await rm(join(root,'edit.txt'));await symlink(outside,join(root,'edit.txt'));
  await assert.rejects(applyRestorePlan(output,plan.planId),/linked/);assert.equal(await readFile(outside,'utf8'),'outside sentinel');
  assert.equal((await readdir(root)).includes('.claude-mods-restore.lock'),false);
});
test('Windows restore explicitly refuses until private plan ACL validation exists',{skip:process.platform!=='win32'},async()=>{
  await assert.rejects(prepareRestorePlan('C:\\selected',{},'C:\\private\\plan'),/Windows ACL/);
  await assert.rejects(reviewRestorePlan('C:\\private\\plan'),/Windows ACL/);
  await assert.rejects(applyRestorePlan('C:\\private\\plan','a'.repeat(64)),/Windows ACL/);
});
