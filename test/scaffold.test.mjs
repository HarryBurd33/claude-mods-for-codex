import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,realpath,rm,readFile,readdir,symlink,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {scaffoldMod} from '../src/scaffold.mjs';
import {validateConfig} from '../src/config.mjs';
import {dispatch} from '../src/dispatcher.mjs';
const fixture=JSON.parse(await readFile(new URL('../fixtures/pre-tool-safe.json',import.meta.url),'utf8'));
test('scaffold produces disabled reviewable data, validates and replays all supported behaviors',async t=>{
 const root=await mkdtemp(join(await realpath(tmpdir()),'mods-author-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const specs=[{name:'notice',kind:'notice',message:'Review scope'},{name:'guard',kind:'deny',match:'SYNTHETIC_RISK',reason:'Review the impact before retrying.'},{name:'rewrite',kind:'replacement',from:'printf BEFORE',to:'printf AFTER'}];
 for(const spec of specs){const path=join(root,spec.name);const r=await scaffoldMod(spec,path);assert.equal(r.installed,false);const raw=JSON.parse(await readFile(join(path,'mods.json')));assert.deepEqual(dispatch(fixture,validateConfig(raw)).output,{});raw.mods[0].enabled=true;const input=spec.kind==='notice'?{...fixture,hook_event_name:'SessionStart',model:'synthetic',source:'startup'}:{...fixture,tool_name:'Bash',tool_input:{command:spec.kind==='deny'?'printf SYNTHETIC_RISK':'printf BEFORE'}};const out=dispatch(input,validateConfig(raw)).output;assert.ok(Object.keys(out).length);assert.deepEqual(JSON.parse(await readFile(join(path,'access.json'))).network,[]);await assert.rejects(scaffoldMod(spec,path),/EEXIST/);}
});
test('scaffold validates before writes and refuses existing/linked output parents', {skip:process.platform==='win32'},async t=>{
 const root=await mkdtemp(join(await realpath(tmpdir()),'mods-author-safe-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const spec={name:'sample',kind:'notice',message:'hello'};
 for(const invalid of [{...spec,kind:'native-pane'},{...spec,execute:'shell'},{...spec,name:'../escape'}])await assert.rejects(scaffoldMod(invalid,join(root,'new')));
 assert.deepEqual(await readdir(root),[]);await symlink(root,join(root,'linked'));await assert.rejects(scaffoldMod(spec,join(root,'linked','new')),/links/);
});

test('generated matching/control fixtures exercise disabled and enabled rules through the real offline CLI',async t=>{
 const root=await mkdtemp(join(await realpath(tmpdir()),'mods-author-cli-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const cli=fileURLToPath(new URL('../bin/codex-mods.mjs',import.meta.url));
 // CI40065152768 hit this harness's 5s limit during one Windows replay.
 // Keep a bounded 15s Windows test budget; no retries/product deadline changes.
 const invoke=args=>execFileSync(process.execPath,[cli,...args],{cwd:root,encoding:'utf8',timeout:process.platform==='win32'?15000:5000});
 const specs=[
  {name:'notice',kind:'notice',message:'Review scope'},
  {name:'guard',kind:'deny',match:'SYNTHETIC_RISK',reason:'Review before retrying'},
  {name:'control-collision',kind:'deny',match:'printf',reason:'Review before retrying'},
  {name:'colon-collision',kind:'deny',match:':',reason:'Review before retrying'},
  {name:'rewrite',kind:'replacement',from:'printf BEFORE > must-not-run.txt',to:'printf AFTER > must-not-run.txt'},
  {name:'exact-control-collision',kind:'replacement',from:'printf MODS_SCAFFOLD_CONTROL',to:'printf AFTER'},
 ];
 for(const spec of specs){
  const path=join(root,spec.name),specPath=join(root,spec.name+'.json');await writeFile(specPath,JSON.stringify(spec));
  const created=JSON.parse(invoke(['scaffold','--spec',specPath,'--output',path]));
  assert.equal(created.installed,false);assert.equal(created.enabled,false);
  assert.deepEqual(created.files,['mods.json','access.json','REVIEW.md','fixtures/matching.json','fixtures/nonmatching.json']);
  const configPath=join(path,'mods.json'),rawText=await readFile(configPath,'utf8'),raw=JSON.parse(rawText);
  assert.match(invoke(['validate','--config',configPath]),/Configuration is valid/);
  const replay=config=>JSON.parse(invoke(['replay','--config',config,'--fixtures',join(path,'fixtures')]));
  assert.deepEqual(replay(configPath).map(x=>x.response),[{},{}]);
  raw.mods[0].enabled=true;const enabled=join(root,spec.name+'-enabled.json');await writeFile(enabled,JSON.stringify(raw));
  const result=replay(enabled);assert.equal(result.length,2);assert.deepEqual(result[1].response,{});
  const matching=result[0].response;
  if(spec.kind==='notice')assert.equal(matching.systemMessage,spec.message);
  else if(spec.kind==='deny')assert.equal(matching.hookSpecificOutput.permissionDecision,'deny');
  else {
   assert.equal(matching.hookSpecificOutput.permissionDecision,'allow');
   assert.equal(matching.hookSpecificOutput.updatedInput.command,spec.to);
   assert.match(matching.systemMessage,/Normal permissions still apply/);
  }
  assert.equal(await readFile(configPath,'utf8'),rawText,'offline enable copy must preserve disabled generated config');
  const access=JSON.parse(await readFile(join(path,'access.json'),'utf8'));
  assert.deepEqual(access.writes,[]);assert.deepEqual(access.network,[]);assert.equal(access.modelCalls,0);
  assert.match(await readFile(join(path,'REVIEW.md'),'utf8'),/Never execute fixture commands/);
 }
 await assert.rejects(readFile(join(root,'must-not-run.txt')),{code:'ENOENT'});
});
