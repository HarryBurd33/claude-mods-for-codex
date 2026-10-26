// Synthetic data and in-memory stdio only. Command strings are never executed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { EventEmitter } from 'node:events';
import { mkdtemp, mkdir, realpath, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createCallReviewer, validateCallReviewSettings } from '../src/hold-review.mjs';
import { createDashboardHandler } from '../src/server.mjs';
import { loadRuntimeSettings } from '../src/runtime-settings.mjs';
import { runMcpServer } from '../src/mcp-stdio.mjs';

const policy={enabled:true,inputPolicy:'unchanged-only',categories:['git-clean'],timeoutMs:1000};
const event=()=>({hook_event_name:'PreToolUse',tool_name:'Bash',tool_input:{command:'git clean -n SYNTHETIC_PRIVATE_SENTINEL',sandbox_permissions:'use_default',nested:{unchanged:[true,null,2]}}});
const config=()=>({version:1,mods:[]});
const accept=()=>({action:'accept',content:{confirm:true}});
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return{promise,resolve};};
const reviewer=(extra={},loadHookConfig=async()=>config())=>createCallReviewer({...policy,...extra},{loadHookConfig});
const deny=(result,pattern)=>{assert.equal(result.hookSpecificOutput?.permissionDecision,'deny');assert.equal(result.hookSpecificOutput.hookEventName,'PreToolUse');if(pattern)assert.match(result.hookSpecificOutput.permissionDecisionReason,pattern);assert.deepEqual(Object.keys(result),['hookSpecificOutput']);assert.deepEqual(Object.keys(result.hookSpecificOutput).sort(),['hookEventName','permissionDecision','permissionDecisionReason'].sort());};
const elicit=async()=>accept();

test('selection is strict, frozen, explicit and disabled by default',()=>{
 assert.equal(validateCallReviewSettings(undefined),undefined);
 assert.deepEqual(validateCallReviewSettings({enabled:false}),{enabled:false});
 const {timeoutMs,...withoutDeadline}=policy;
 const selected=validateCallReviewSettings(withoutDeadline);
 assert.equal(selected.timeoutMs,30000);assert.ok(Object.isFrozen(selected));assert.ok(Object.isFrozen(selected.categories));
 for(const raw of [null,[],{}, {enabled:'yes'}, {...policy,timeoutMs:undefined}, {...policy,extra:true}, {...policy,inputPolicy:'rewritten'}, {enabled:true,categories:['git-clean']}, {enabled:true,inputPolicy:'unchanged-only'}, {...policy,categories:[]}, {...policy,categories:['unknown']}, {...policy,categories:['delete','delete']}, {...policy,timeoutMs:30001}, {...policy,timeoutMs:0}, {...policy,timeoutMs:1.2}])assert.throws(()=>validateCallReviewSettings(raw));
});

test('disabled and nonmatching reviews perform no config read or form action',async()=>{
 let reads=0,forms=0;const loadHookConfig=async()=>{reads++;throw Error('must not read');},elicit=async()=>{forms++;};
 for(const raw of [undefined,{enabled:false}])assert.deepEqual(await createCallReviewer(raw,{loadHookConfig}).review(new Proxy({}, {get(){throw Error('trap');}}),{elicit}),{});
 const r=reviewer({},loadHookConfig);
 for(const e of [{...event(),hook_event_name:'PostToolUse'},{...event(),tool_name:'Other'},{...event(),tool_input:{command:'printf SAFE_SYNTHETIC'}}])assert.deepEqual(await r.review(e,{elicit}),{});
 assert.equal(reads,0);assert.equal(forms,0);
});
test('explicit confirmation is abstention only; data remains unchanged and sensitive strings stay out of form/results',async()=>{
 const e=event(),original=structuredClone(e);let reads=0,forms=0;
 const r=reviewer({},async()=>{reads++;return config();});
 const result=await r.review(e,{elicit:async(params,{signal})=>{
  forms++;assert.equal(signal.aborted,false);assert.equal(params.mode,'form');
  assert.deepEqual(params.requestedSchema.required,['confirm']);assert.equal(params.requestedSchema.properties.confirm.type,'boolean');
  assert.equal(Object.hasOwn(params.requestedSchema.properties.confirm,'default'),false);
  assert.doesNotMatch(JSON.stringify(params),/SYNTHETIC_PRIVATE_SENTINEL|git clean|sandbox_permissions/);
  assert.match(params.message,/normal host permissions/);assert.match(params.message,/not human-attested/);
  e.tool_input.command='printf MUTATED_BY_CALLER'; // Reviewer must use its own snapshot.
  return accept();
 }});
 assert.deepEqual(result,{});assert.equal(reads,2);assert.equal(forms,1);
 e.tool_input.command=original.tool_input.command;assert.deepEqual(e,original);
 const frozen=Object.freeze({...event(),tool_input:Object.freeze(event().tool_input)});
 assert.deepEqual(await r.review(frozen,{elicit}),{});
});
for(const [label,response,pattern] of [
 ['decline',{action:'decline'},/declined/],['cancel',{action:'cancel'},/cancelled/],
 ['false',{action:'accept',content:{confirm:false}},/confirmation/],['missing',{action:'accept',content:{}},/confirmation/],
 ['no-content',{action:'accept'},/confirmation/],['string',{action:'accept',content:{confirm:'true'}},/confirmation/],
 ['permission-field',{action:'accept',content:{confirm:true,permissionDecision:'allow'}},/confirmation/],
 ['invalid-action',{action:'other',content:{confirm:true}},/confirmation/],['null',null,/confirmation/],
 ['automated',{...accept(),_meta:{approvals_reviewer:'auto_review'}},/automated reviewer/],
 ['unexpected',{...accept(),updatedPermissions:[]},/confirmation/],
])test(`confirmation ${label} denies without config recheck`,async()=>{
 let reads=0;const r=reviewer({},async()=>{reads++;return config();});
 deny(await r.review(event(),{elicit:async()=>response}),pattern);assert.equal(reads,1);
});

test('hostile data, bounds, prototypes, getters and UTF8 are rejected without running accessors',async()=>{
 let hits=0,forms=0,reads=0;const r=reviewer({},async()=>{reads++;return config();});
 const getter=Object.defineProperty({},'command',{enumerable:true,get(){hits++;return 'git clean';}});
 const proxy=new Proxy({}, {ownKeys(){hits++;throw Error('trap');}});
 const sparse=[];sparse.length=1;
 const custom=[];Object.setPrototypeOf(custom,null);
 const cyclic={};cyclic.self=cyclic;
 const cases=[null,[],{...event(),extra:true},{...event(),tool_input:getter},{...event(),tool_input:proxy},
  {...event(),tool_input:Object.create({command:'git clean'})},{...event(),tool_input:{command:'git clean',x:sparse}},
  {...event(),tool_input:{command:'git clean',x:custom}},{...event(),tool_input:{command:'git clean',x:cyclic}},
  {...event(),tool_input:{command:'git clean',x:()=>{hits++;}}},{...event(),tool_input:{command:'git clean',x:NaN}},
  {...event(),tool_input:{command:'git clean',x:Symbol('x')}},{...event(),tool_input:{command:'git clean',x:'é'.repeat(40000)}},
  {...event(),tool_input:{command:'git clean'+'😀'.repeat(3000)}},{...event(),tool_input:{command:'git clean'+'x'.repeat(4096)}},
  {...event(),tool_input:{command:'  '}},Object.defineProperty(event(),'tool_name',{get(){hits++;return 'Bash';}})];
 for(const value of cases)deny(await r.review(value,{elicit:async()=>{forms++;return accept();}}),/invalid/);
 assert.equal(hits,0);assert.equal(forms,0);assert.equal(reads,0);
 const categories=Object.defineProperty({...policy},'categories',{enumerable:true,get(){hits++;return ['git-clean'];}});
 assert.throws(()=>validateCallReviewSettings(categories));assert.equal(hits,0);
 const allowed={...event(),tool_input:JSON.parse('{"command":"git clean -n","__proto__":{"safe":true}}')};
 assert.deepEqual(await r.review(allowed,{elicit}),{});assert.equal({}.safe,undefined);
});

const denyMod={id:'deny',type:'denyGuard',enabled:true,rules:[{toolNames:['Bash'],commandContains:['git clean'],reason:'SYNTHETIC_PRIVATE_POLICY'}]};
const impactMod={id:'impact',type:'blastRadiusGuard',enabled:true,categories:['git-clean']};
const rewriteMod={id:'rewrite',type:'exactCommandRewrite',enabled:true,rules:[{toolName:'Bash',fromCommand:'printf BEFORE',toCommand:'printf AFTER'}]};
for(const [label,mod,pattern] of [['deny',denyMod,/existing configured guard/],['impact',impactMod,/existing configured guard/],['even-nonmatching-rewrite',rewriteMod,/unchanged input/]])test(`existing ${label} refuses before form, never disables policy`,async()=>{
 const c={version:1,mods:[mod]},before=structuredClone(c);let forms=0;
 const result=await reviewer({},async()=>c).review(event(),{elicit:async()=>{forms++;return accept();}});
 deny(result,pattern);assert.equal(forms,0);assert.deepEqual(c,before);assert.doesNotMatch(JSON.stringify(result),/SYNTHETIC_PRIVATE_POLICY/);
});
test('disabled rewrite remains disabled, existing notice/journal selection causes no side effect',async()=>{
 const c={version:1,mods:[{...rewriteMod,enabled:false},{id:'notice',type:'sessionNotice',enabled:true,message:'SYNTHETIC_PRIVATE_NOTICE'},{id:'journal',type:'activityJournal',enabled:true}]};
 assert.deepEqual(await reviewer({},async()=>c).review(event(),{elicit}),{});
});
test('config changes or invalid/failing reads deny; loader exceptions never disclose paths or data',async()=>{
 for(const next of [{version:1,mods:[denyMod]},{version:1,mods:[rewriteMod]},{version:1,mods:[{id:'notice',type:'sessionNotice',enabled:true,message:'Changed'}]}]){
  let n=0;deny(await reviewer({},async()=>++n===1?config():next).review(event(),{elicit}),/changed/);assert.equal(n,2);
 }
 for(const next of [null,{version:1,mods:[{id:'future',type:'unknown',enabled:true}]},{version:1,mods:[],unexpected:true}])deny(await reviewer({},async()=>next).review(event(),{elicit}),/configuration/);
 for(const failAt of [1,2]){let n=0;const result=await reviewer({},async()=>{if(++n===failAt)throw Error('/synthetic/private/SENTINEL');return config();}).review(event(),{elicit});deny(result,/configuration/);assert.doesNotMatch(JSON.stringify(result),/SENTINEL|synthetic\/private/);}
});
test('no capability or disconnected transport denies without leaking error content',async()=>{
 let reads=0;const r=reviewer({},async()=>{reads++;return config();});
 deny(await r.review(event()),/unavailable/);assert.equal(reads,0);
 const result=await r.review(event(),{elicit:async()=>{throw Error('SYNTHETIC_PRIVATE_ERROR');}});deny(result,/unavailable/);assert.doesNotMatch(JSON.stringify(result),/SYNTHETIC_PRIVATE_ERROR/);
});
test('one pending form; concurrent request denied, no queue, no stale confirmation',async()=>{
 const d=deferred();let count=0;const r=reviewer();
 const first=r.review(event(),{elicit:async()=>{count++;return d.promise;}});await tick();
 deny(await r.review(event(),{elicit}),/pending/);assert.equal(count,1);
 d.resolve(accept());assert.deepEqual(await first,{});
 assert.deepEqual(await r.review(event(),{elicit}),{});
});
test('abort before/during form, dispose and deadline deny and abort the pending signal',async()=>{
 const aborted=new AbortController();aborted.abort();let forms=0;
 deny(await reviewer().review(event(),{signal:aborted.signal,elicit:async()=>{forms++;return accept();}}),/cancelled/);assert.equal(forms,0);
 for(const mode of ['abort','dispose','deadline']){
  const d=deferred(),c=new AbortController();let pendingSignal;
  const r=reviewer({timeoutMs:mode==='deadline'?15:1000});
  const p=r.review(event(),{signal:c.signal,elicit:(_,{signal})=>{pendingSignal=signal;return d.promise;}});await tick();
  if(mode==='abort')c.abort();if(mode==='dispose')r.dispose();
  deny(await p,mode==='deadline'?/deadline/:mode==='dispose'?/stopped/:/cancelled/);assert.equal(pendingSignal.aborted,true);
  d.resolve(accept());await tick();
  if(mode==='dispose')deny(await r.review(event(),{elicit}),/stopped/);
 }
});
test('deadline during first load produces no late form or second read',async()=>{
 const d=deferred();let reads=0,forms=0;
 const r=reviewer({timeoutMs:10},async()=>{reads++;return d.promise;});
 deny(await r.review(event(),{elicit:async()=>{forms++;return accept();}}),/deadline/);
 d.resolve(config());await tick();assert.equal(reads,1);assert.equal(forms,0);
});
test('deadline/cancel during recheck cannot turn late accepted response into permission',async()=>{
 for(const mode of ['deadline','cancel']){
  const d=deferred(),c=new AbortController();let reads=0;
  const r=reviewer({timeoutMs:mode==='deadline'?15:1000},async()=>++reads===1?config():d.promise);
  const p=r.review(event(),{signal:c.signal,elicit});await tick();assert.equal(reads,2);
  if(mode==='cancel')c.abort();deny(await p,mode==='deadline'?/deadline/:/cancelled/);
  d.resolve(config());await tick();
 }
});

test('default handler keeps eight tools; opt-in capability negotiation adds only advisory tool',async()=>{
 for(const settings of [null,{callReview:{enabled:false}}]){
  const h=createDashboardHandler(settings,{loadHookConfig:async()=>{throw Error('Unexpected read');}});
  assert.equal((await h({method:'tools/list'})).tools.length,8);
  await assert.rejects(h({method:'tools/call',params:{name:'mods.review_call',arguments:event()}}),/Unknown tool/);
 }
 const h=createDashboardHandler({callReview:policy},{loadHookConfig:async()=>config()});
 const listed=(await h({method:'tools/list'})).tools;assert.equal(listed.length,9);assert.equal(listed.at(-1).name,'mods.review_call');
 const call=ctx=>h({method:'tools/call',params:{name:'mods.review_call',arguments:event()}},ctx);
 deny(JSON.parse((await call({requestHost:async()=>accept()})).content[0].text),/unavailable/);
 await h({method:'initialize',params:{capabilities:{elicitation:{form:{}}}}});
 assert.deepEqual(JSON.parse((await call({requestHost:async(method,params,{signal,timeoutMs})=>{
  assert.equal(method,'elicitation/create');assert.equal(signal.aborted,false);assert.equal(timeoutMs,1000);return accept();
 }})).content[0].text),{});
});
test('private synthetic runtime settings accept explicit default-off selection without changing existing selections',{skip:process.platform==='win32'},async t=>{
 const dir=await mkdtemp(join(await realpath(tmpdir()),'mods-call-review-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const project=join(dir,'project');await mkdir(project);const file=join(dir,'settings.json');
 const base={version:1,projectRoot:project,dataDirectory:join(dir,'data'),stateScope:'project'};
 for(const callReview of [{enabled:false},policy]){
  await writeFile(file,JSON.stringify({...base,callReview}),{mode:0o600});const selected=await loadRuntimeSettings(file);
  assert.equal(selected.callReview.enabled,callReview.enabled);assert.equal(selected.stateScope,'project');assert.equal(selected.allowChanges,false);assert.equal(selected.observationExport,undefined);
 }
 await writeFile(file,JSON.stringify({...base,callReview:{enabled:true}}));await assert.rejects(loadRuntimeSettings(file));
});

// Same transport and production handler, but no process, host or filesystem peer.
function peer(t,timeoutMs=1000){
 const input=new PassThrough(),output=new EventEmitter(),messages=[],diagnostics=[];
 output.write=(line,callback)=>{messages.push(JSON.parse(line));queueMicrotask(callback);return true;};
 const handler=createDashboardHandler({callReview:{...policy,timeoutMs}},{loadHookConfig:async()=>config()});
 const server=runMcpServer(handler,{input,output,diagnostic:{write:s=>diagnostics.push(s)}});
 t.after(()=>{server.stop();input.destroy();});
 return{messages,diagnostics,input,send:m=>input.write(JSON.stringify({jsonrpc:'2.0',...m})+'\n')};
}
const init=async p=>{p.send({id:'init',method:'initialize',params:{capabilities:{elicitation:{form:{}}}}});await tick();};
const call=p=>p.send({id:'covered',method:'tools/call',params:{name:'mods.review_call',arguments:event()}});
const result=(p,id='covered')=>JSON.parse(p.messages.find(m=>m.id===id)?.result.content[0].text);

test('production transport correlates replies, permits independent ping, ignores wrong/late IDs and confirms once',async t=>{
 const p=peer(t);await init(p);call(p);await tick();const form=p.messages.find(m=>m.method==='elicitation/create');assert.ok(form);
 p.send({id:'wrong-response',result:accept()});p.send({id:'ping',method:'ping'});await tick();
 assert.equal(p.messages.some(m=>m.id==='covered'),false);assert.deepEqual(p.messages.find(m=>m.id==='ping').result,{});
 p.send({id:'concurrent',method:'tools/call',params:{name:'mods.review_call',arguments:event()}});await tick();deny(result(p,'concurrent'),/pending/);
 p.send({id:form.id,result:accept()});await tick();assert.deepEqual(result(p),{});
 const count=p.messages.length;p.send({id:form.id,result:accept()});await tick();assert.equal(p.messages.length,count);assert.equal(p.diagnostics.length,0);
 assert.doesNotMatch(JSON.stringify(p.messages),/SYNTHETIC_PRIVATE_SENTINEL/);
});
for(const mode of ['cancel','eof','malformed','error','deadline'])test(`production transport ${mode} denies and cannot accept a late reply`,async t=>{
 const p=peer(t,mode==='deadline'?15:1000);await init(p);call(p);await tick();const form=p.messages.find(m=>m.method==='elicitation/create');assert.ok(form);
 if(mode==='cancel')p.send({method:'notifications/cancelled',params:{requestId:'covered'}});
 if(mode==='eof')p.input.end();
 if(mode==='malformed')p.send({id:form.id,result:accept(),error:{code:-1,message:'SYNTHETIC_PRIVATE_ERROR'}});
 if(mode==='error')p.send({id:form.id,error:{code:-1,message:'SYNTHETIC_PRIVATE_ERROR'}});
 if(mode==='deadline')await sleep(30);await tick();deny(result(p));
 const count=p.messages.length;if(mode!=='eof')p.send({id:form.id,result:accept()});await tick();assert.equal(p.messages.length,count);
 assert.doesNotMatch(JSON.stringify(p.messages),/SYNTHETIC_PRIVATE_ERROR|SYNTHETIC_PRIVATE_SENTINEL/);
});

test('real default loader reads only a synthetic selected config; tool arguments cannot redirect it',async t=>{
 const dir=await mkdtemp(join(await realpath(tmpdir()),'mods-review-config-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const path=join(dir,'config.json');await writeFile(path,JSON.stringify(config()),{mode:0o600});
 const prior=process.env.CODEX_MODS_CONFIG;process.env.CODEX_MODS_CONFIG=path;
 t.after(()=>{if(prior===undefined)delete process.env.CODEX_MODS_CONFIG;else process.env.CODEX_MODS_CONFIG=prior;});
 const h=createDashboardHandler({callReview:policy});await h({method:'initialize',params:{capabilities:{elicitation:{form:{}}}}});
 const call=args=>h({method:'tools/call',params:{name:'mods.review_call',arguments:args}},{requestHost:async()=>accept()});
 assert.deepEqual(JSON.parse((await call(event())).content[0].text),{});
 deny(JSON.parse((await call({...event(),configPath:'/synthetic/no-read'})).content[0].text),/invalid/);
 await writeFile(path,JSON.stringify({version:1,mods:[denyMod]}));
 deny(JSON.parse((await call(event())).content[0].text),/existing configured guard/);
});

test('deny precedence survives mixed guards/rewrites without showing any form',async()=>{
 for(const mods of [[denyMod,rewriteMod],[rewriteMod,denyMod],[impactMod,rewriteMod]]){
  let forms=0;deny(await reviewer({},async()=>({version:1,mods})).review(event(),{elicit:async()=>{forms++;return accept();}}),/existing configured guard/);assert.equal(forms,0);
 }
});
test('logical deadline rechecked before form and before second config load (fixed clock)',async t=>{
 let checks=0;
 t.mock.method(performance,'now',()=>{checks++;return checks<4?0:2000;});
 let reads=0,forms=0;
 const r=reviewer({},async()=>{reads++;return config();});
 deny(await r.review(event(),{elicit:async()=>{forms++;return accept();}}),/deadline/);
 assert.equal(forms,0);assert.equal(reads,1);
 t.mock.restoreAll();
 let now=0;t.mock.method(performance,'now',()=>now);
 reads=0;const second=reviewer({},async()=>{reads++;return config();});
 deny(await second.review(event(),{elicit:async()=>{now=2000;return accept();}}),/deadline/);assert.equal(reads,1);
});
