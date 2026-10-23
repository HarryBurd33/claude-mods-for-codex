import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,realpath,rm,readFile,readdir,symlink} from 'node:fs/promises';
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
