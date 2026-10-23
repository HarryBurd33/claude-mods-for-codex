import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp,realpath,readFile,writeFile,rm,symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inspectCheckpointChanges } from '../src/workspace.mjs';
import { runCli } from '../src/cli.mjs';

function git(root,...args){
  const r=spawnSync('git',['-c','user.name=Synthetic Test','-c','user.email=synthetic@example.invalid',...args],{cwd:root,encoding:'utf8',timeout:5000,
    env:{PATH:process.env.PATH,...(process.platform==='win32'?{SystemRoot:process.env.SystemRoot}:{}),GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:process.platform==='win32'?'NUL':'/dev/null',GIT_TERMINAL_PROMPT:'0'}});
  assert.equal(r.status,0,r.stderr||r.error?.message);return r.stdout.trim();
}
async function fixture(t){
  const root=await mkdtemp(join(await realpath(tmpdir()),'mods-checkpoints-'));t.after(()=>rm(root,{recursive:true,force:true}));
  git(root,'init','--template=','--initial-branch=main');
  await writeFile(join(root,'edit.txt'),'before\n');await writeFile(join(root,'deleted.txt'),'delete this fixture\n');
  git(root,'add','.');git(root,'commit','-m','Synthetic before');const fromCommit=git(root,'rev-parse','HEAD');
  await writeFile(join(root,'edit.txt'),'after\n');await rm(join(root,'deleted.txt'));await writeFile(join(root,'added.txt'),'added\n');
  await writeFile(join(root,'binary.dat'),Buffer.from([0,1,2]));await writeFile(join(root,'.env'),'SYNTHETIC_PRIVATE=not-real\n');
  git(root,'add','.');git(root,'commit','-m','Synthetic after');const toCommit=git(root,'rev-parse','HEAD');
  return{root,fromCommit,toCommit};
}
test('selected checkpoints are read-only, explicit and unaffected by later working-tree/index edits',async t=>{
  const {root,fromCommit,toCommit}=await fixture(t);
  await writeFile(join(root,'edit.txt'),'unrelated working edit\n');git(root,'add','edit.txt');
  const index=await readFile(join(root,'.git/index')),head=await readFile(join(root,'.git/HEAD'));
  const result=await inspectCheckpointChanges(root,{fromCommit,toCommit,includeDiffs:true});
  assert.equal(result.available,true);assert.equal(result.source,'git-selected-checkpoints');assert.equal(result.readOnly,true);
  assert.match(result.attribution,/human|multiple turns/);assert.equal(result.omitted,1);
  const changed=result.files.find(f=>f.path==='edit.txt');assert.match(changed.diff,/-before\n\+after/);assert.doesNotMatch(changed.diff,/unrelated working edit/);
  assert.equal(result.files.find(f=>f.path==='added.txt').status,'A');assert.equal(result.files.find(f=>f.path==='deleted.txt').status,'D');
  assert.equal(result.files.find(f=>f.path==='binary.dat').diffStatus,'binary');assert.doesNotMatch(JSON.stringify(result),/SYNTHETIC_PRIVATE|\.env/);
  assert.deepEqual(await readFile(join(root,'.git/index')),index);assert.deepEqual(await readFile(join(root,'.git/HEAD')),head);assert.equal(await readFile(join(root,'edit.txt'),'utf8'),'unrelated working edit\n');
  let output='';await runCli(['checkpoints','--project',root,'--from',fromCommit,'--to',toCommit],{stdout:{write:s=>output+=s}});
  assert.equal(JSON.parse(output).includesDiffs,false);assert.equal(JSON.parse(output).files.every(f=>f.diff===undefined),true);
});
test('checkpoint reader rejects refs/revision syntax and non-commit objects, handles bounds and absent objects',async t=>{
  const {root,fromCommit,toCommit}=await fixture(t);
  for(const from of ['HEAD','--help',fromCommit+'~1','a'.repeat(64),null])await assert.rejects(inspectCheckpointChanges(root,{fromCommit:from,toCommit}),/commit IDs/);
  const blob=git(root,'rev-parse',toCommit+':edit.txt');assert.equal((await inspectCheckpointChanges(root,{fromCommit:blob,toCommit})).available,false);
  assert.equal((await inspectCheckpointChanges(root,{fromCommit:'0'.repeat(40),toCommit})).available,false);
  const limited=await inspectCheckpointChanges(root,{fromCommit,toCommit,maxFiles:1});assert.equal(limited.files.length,1);assert.equal(limited.truncated,true);
  const selected=await inspectCheckpointChanges(root,{fromCommit,toCommit,path:'edit.txt',includeDiffs:true});assert.deepEqual(selected.files.map(f=>f.path),['edit.txt']);assert.match(selected.files[0].diff,/-before\n\+after/);
  await assert.rejects(inspectCheckpointChanges(root,{fromCommit,toCommit,path:'.env'}),/unsupported selected file/);
  const large=await inspectCheckpointChanges(root,{fromCommit,toCommit,includeDiffs:true,maxFileBytes:2});assert.equal(large.files.find(f=>f.path==='edit.txt').diffStatus,'large');
  const tiny=await inspectCheckpointChanges(root,{fromCommit,toCommit,includeDiffs:true,maxDiffBytes:1});assert.equal(tiny.truncated,true);assert.equal(tiny.files.every(f=>f.diff===undefined),true);
});
test('checkpoint inspection omits historical symlink endpoints and does not execute configured helpers',{skip:process.platform==='win32'},async t=>{
  const {root,fromCommit}=await fixture(t);
  await symlink('/synthetic-outside-path',join(root,'link.txt'));
  await writeFile(join(root,'.gitattributes'),'edit.txt diff=hostile\n');
  git(root,'config','diff.hostile.textconv','sh -c "touch helper-must-not-run"');
  git(root,'config','diff.external','sh -c "touch helper-must-not-run"');
  git(root,'add','link.txt','.gitattributes');git(root,'commit','-m','Synthetic unsafe paths');const toCommit=git(root,'rev-parse','HEAD');
  const result=await inspectCheckpointChanges(root,{fromCommit,toCommit,includeDiffs:true});
  assert.equal(result.available,true);assert.equal(result.files.some(f=>f.path==='link.txt'),false);assert.ok(result.omitted>=2);
  await assert.rejects(readFile(join(root,'helper-must-not-run')),{code:'ENOENT'});
});
