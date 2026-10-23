import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,writeFile,rm,realpath,chmod,symlink,mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { loadRuntimeSettings } from '../src/runtime-settings.mjs';
import { recordMetadataEvent } from '../src/state.mjs';
// Load handler lazily after the independent workspace implementation is present.
const handler = async settings => (await import('../src/server.mjs')).createDashboardHandler(settings);
async function temporary(t){const dir=await mkdtemp(join(await realpath(tmpdir()),'mods-dashboard-'));t.after(()=>rm(dir,{recursive:true,force:true}));return dir;}
const call=(h,name,args={})=>h({method:'tools/call',params:{name,arguments:args}},{signal:new AbortController().signal});
test('dashboard without reviewed settings exposes unavailable data, never guesses session paths',async()=>{
 const h=await handler(null),r=await call(h,'mods.dashboard');
 assert.equal(r.structuredContent.configured,false);assert.equal(r.structuredContent.activity.available,false);assert.equal(r.structuredContent.usage.available,false);
 await assert.rejects(call(h,'mods.files',{root:'/private/synthetic-secret'}));
 assert.equal((await call(h,'mods.changes')).structuredContent.available,false);
 assert.equal((await call(h,'mods.checkpoints')).structuredContent.available,false);
 await assert.rejects(call(h,'mods.checkpoints',{fromCommit:'a'.repeat(40),toCommit:'b'.repeat(40)}));
 const resource=await h({method:'resources/read',params:{uri:'ui://claude-mods/dashboard'}});
 assert.deepEqual(resource.contents[0]._meta.ui.csp,{connectDomains:[],resourceDomains:[]});
 assert.match(resource.contents[0].text,/Working-tree changes/);
});
test('dashboard reads only selected scope and bounded observer sees independent event', {skip:process.platform==='win32'},async t=>{
 const dir=await temporary(t), data=join(dir,'data');
 const scope={projectId:dir,sessionId:'synthetic-session'};
 await recordMetadataEvent(data,scope,{event:'PreToolUse',tool:'Bash'});
 await recordMetadataEvent(data,{projectId:dir,sessionId:'other-session'},{event:'PreToolUse',decision:'deny'});
 const h=await handler({projectRoot:dir,dataDirectory:data,stateScope:'session',sessionId:scope.sessionId});
 const first=(await call(h,'mods.activity')).structuredContent;assert.equal(first.records,1);assert.equal(first.denials,0);assert.equal(first.producerHealth,'unknown');assert.match(first.captureNote,/session directory/);
 const next=call(h,'mods.activity',{sinceRevision:first.revision,waitMs:1000});
 await recordMetadataEvent(data,scope,{event:'PostToolUse',tool:'Bash'});
 assert.equal((await next).structuredContent.records,2);
 await assert.rejects(call(h,'mods.activity',{waitMs:30000}));
 await assert.rejects(call(h,'mods.activity',{sinceRevision:'bad'}));
 assert.doesNotMatch(JSON.stringify((await next).structuredContent),/synthetic-session|other-session|projectId|dataDirectory/);
});
test('runtime settings require explicit private file and reject links or unknown grants',{skip:process.platform==='win32'},async t=>{
 const dir=await temporary(t),path=join(dir,'settings.json');await mkdir(join(dir,'project'));const value={version:1,projectRoot:join(dir,'project'),dataDirectory:join(dir,'data')};
 await writeFile(path,JSON.stringify(value),{mode:0o600});const settings=await loadRuntimeSettings(path);assert.equal(settings.stateScope,'session');assert.equal(settings.allowChanges,false);
 await writeFile(path,JSON.stringify({...value,projectRoot:dir}));await assert.rejects(loadRuntimeSettings(path),/outside/);await writeFile(path,JSON.stringify(value));
 await chmod(path,0o644);await assert.rejects(loadRuntimeSettings(path));await chmod(path,0o600);
 await writeFile(path,JSON.stringify({...value,execute:'anything'}));await assert.rejects(loadRuntimeSettings(path));
  for(const checkpoints of [{fromCommit:'HEAD',toCommit:'b'.repeat(40)},{fromCommit:'a'.repeat(40),toCommit:'b'.repeat(40),path:'ignored'},{fromCommit:'a'.repeat(40)}]){
    await writeFile(path,JSON.stringify({...value,checkpoints}));await assert.rejects(loadRuntimeSettings(path));
  }
  await writeFile(path,JSON.stringify({...value,checkpoints:{fromCommit:'a'.repeat(40),toCommit:'b'.repeat(40)}}));
  assert.equal(Object.isFrozen((await loadRuntimeSettings(path)).checkpoints),true);
 const link=join(dir,'linked.json');await symlink(path,link);await assert.rejects(loadRuntimeSettings(link));
});
function peer(t,path){const child=spawn(process.execPath,[path],{stdio:['pipe','pipe','pipe']});const messages=[],waiters=[];let buffer='';
 const timer=setTimeout(()=>child.kill('SIGKILL'),6000);t.after(()=>{clearTimeout(timer);child.kill('SIGKILL');});
 child.stdout.setEncoding('utf8').on('data',chunk=>{buffer+=chunk;let end;while((end=buffer.indexOf('\n'))>=0){const m=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);messages.push(m);for(const w of [...waiters])if(w.predicate(m)){waiters.splice(waiters.indexOf(w),1);w.resolve(m);}}});
 return {send:m=>child.stdin.write(JSON.stringify({jsonrpc:'2.0',...m})+'\n'),wait:predicate=>new Promise(resolve=>{const m=messages.find(predicate);if(m)resolve(m);else waiters.push({predicate,resolve});}),child};}
test('hold MCP peer accepts response while request is pending, denies automatic review and cancellation (synthetic)',async t=>{
 const p=peer(t,fileURLToPath(new URL('../proofs/hold-server.mjs',import.meta.url)));
 p.send({id:1,method:'initialize',params:{capabilities:{elicitation:{form:{}}}}});await p.wait(m=>m.id===1);
 const event={hook_event_name:'PreToolUse',tool_name:'Bash',tool_input:{command:'printf MODS_HOLD'}};
 p.send({id:2,method:'tools/call',params:{name:'mods.hold',arguments:event}});const prompt=await p.wait(m=>m.method==='elicitation/create');
 assert.equal(prompt.params.requestedSchema.required[0],'confirm');p.send({id:prompt.id,result:{action:'accept',content:{confirm:true}}});
 assert.deepEqual(JSON.parse((await p.wait(m=>m.id===2)).result.content[0].text),{});
 p.send({id:3,method:'tools/call',params:{name:'mods.hold',arguments:event}});const second=await p.wait(m=>m.method==='elicitation/create'&&m.id!==prompt.id);
 p.send({id:second.id,result:{action:'accept',content:{confirm:true},_meta:{approvals_reviewer:'auto_review'}}});assert.equal(JSON.parse((await p.wait(m=>m.id===3)).result.content[0].text).hookSpecificOutput.permissionDecision,'deny');
 p.send({id:4,method:'tools/call',params:{name:'mods.hold',arguments:event}});await p.wait(m=>m.method==='elicitation/create'&&m.id!==prompt.id&&m.id!==second.id);
 p.send({method:'notifications/cancelled',params:{requestId:4}});assert.equal(JSON.parse((await p.wait(m=>m.id===4)).result.content[0].text).hookSpecificOutput.permissionDecision,'deny');
});
