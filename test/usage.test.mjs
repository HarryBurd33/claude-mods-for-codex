import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,realpath,writeFile,chmod,symlink,link,rm,readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { summarizeExecUsage,readSelectedUsage } from '../src/usage.mjs';
import { runCli } from '../src/cli.mjs';
import { createDashboardHandler } from '../src/server.mjs';
const start={type:'thread.started',thread_id:'SYNTHETIC_PRIVATE_THREAD'};
const completion=(input=100,cached=25,output=10)=>({type:'turn.completed',usage:{input_tokens:input,cached_input_tokens:cached,output_tokens:output}});
const jsonl=(...records)=>records.map(r=>typeof r==='string'?r:JSON.stringify(r)).join('\n');
test('usage uses the latest reported cumulative snapshot, never sums completions or exposes raw session content',()=>{
  const r=summarizeExecUsage(jsonl('synthetic diagnostic never echoed',start,{type:'item.completed',item:{text:'SYNTHETIC_PRIVATE_PROMPT',command:'SYNTHETIC_PRIVATE_COMMAND'}},completion(),completion(200,75,20)));
  assert.equal(r.available,true);assert.equal(r.counters.inputTokens,200);assert.equal(r.counters.outputTokens,20);assert.equal(r.counters.cachedInputTokens,75);assert.equal(r.cachedInputShare,.375);assert.equal(r.completionRecords,2);assert.equal(r.ignoredDiagnosticLines,1);
  assert.match(r.semantics,/never summed/);assert.doesNotMatch(JSON.stringify(r),/SYNTHETIC_PRIVATE|never echoed/);assert.equal(r.contextOccupancy,null);assert.equal(r.cacheHealth,null);assert.equal(r.exactBilling,null);
  const failed=summarizeExecUsage(jsonl(start,completion(),{type:'turn.failed',error:'SYNTHETIC_PRIVATE_ERROR'}));assert.equal(failed.streamStatus,'failed-or-error');assert.doesNotMatch(JSON.stringify(failed),/SYNTHETIC_PRIVATE/);
});
test('missing counters and zero denominators remain unavailable and reported zeros are not a free-usage claim',()=>{
  const missing=summarizeExecUsage(jsonl(start,{type:'turn.completed',usage:{input_tokens:100,output_tokens:10}}));
  assert.equal(missing.counters.cachedInputTokens,null);assert.equal(missing.cachedInputShare,null);
  const zero=summarizeExecUsage(jsonl(start,completion(0,0,0)));assert.equal(zero.cachedInputShare,null);assert.match(zero.limits,/default zero/);
  assert.equal(summarizeExecUsage(jsonl(start)).available,false);assert.equal(summarizeExecUsage(jsonl(completion())).available,false);
});
test('usage rejects malformed/oversized/concatenated data and invalid counter relations without fabricating partial sums',()=>{
  for(const usage of [{input_tokens:-1,output_tokens:1},{input_tokens:1.5,output_tokens:1},{input_tokens:1,output_tokens:1,cached_input_tokens:2},{input_tokens:1,output_tokens:1,reasoning_output_tokens:2},{input_tokens:Number.MAX_SAFE_INTEGER+1,output_tokens:1},{output_tokens:1}])assert.throws(()=>summarizeExecUsage(jsonl(start,{type:'turn.completed',usage})));
  assert.throws(()=>summarizeExecUsage(jsonl(start,completion(),{...start,thread_id:'OTHER_PRIVATE_THREAD'},completion())),/one thread/);
  assert.throws(()=>summarizeExecUsage(jsonl(start,completion(),'{broken JSON')),/invalid/);
  assert.throws(()=>summarizeExecUsage('x'.repeat(1024*1024+1)),/limit/);
  assert.throws(()=>summarizeExecUsage(jsonl(start,...Array.from({length:33},()=>completion()))),/completion limit/);
  assert.throws(()=>summarizeExecUsage(jsonl(start,'x'.repeat(256*1024+1))),/line size/);
});
test('selected usage file is explicit/private/unlinked/read-only and its CLI returns only the safe summary',{skip:process.platform==='win32'},async t=>{
  const dir=await mkdtemp(join(await realpath(tmpdir()),'mods-usage-'));t.after(()=>rm(dir,{recursive:true,force:true}));const path=join(dir,'selected.jsonl');
  const content=jsonl(start,completion());await writeFile(path,content,{mode:0o600});assert.equal((await readSelectedUsage(path)).available,true);
  let output='';await runCli(['usage','--export',path],{stdout:{write:s=>output+=s}});assert.equal(JSON.parse(output).counters.inputTokens,100);assert.doesNotMatch(output,/SYNTHETIC_PRIVATE|selected.jsonl|projectRoot/);
  const handler=createDashboardHandler({usageExport:path});const result=await handler({method:'tools/call',params:{name:'mods.usage',arguments:{}}});assert.equal(result.structuredContent.counters.inputTokens,100);assert.doesNotMatch(JSON.stringify(result),/SYNTHETIC_PRIVATE|selected.jsonl/);
  await chmod(path,0o644);assert.equal((await readSelectedUsage(path)).available,false);await chmod(path,0o600);
  await symlink(path,path+'.link');assert.equal((await readSelectedUsage(path+'.link')).available,false);
  await link(path,path+'.hard');assert.equal((await readSelectedUsage(path)).available,false);await rm(path+'.hard');
  await writeFile(path,'SYNTHETIC_PRIVATE_INVALID\n{broken');const invalid=await readSelectedUsage(path);assert.equal(invalid.available,false);assert.doesNotMatch(JSON.stringify(invalid),/SYNTHETIC_PRIVATE|selected.jsonl/);
  assert.deepEqual((await readdir(dir)).sort(),['selected.jsonl','selected.jsonl.link']);
});
test('Windows usage rejects network exports without returning content',{skip:process.platform!=='win32'},async()=>{
  const result=await readSelectedUsage('\\\\synthetic-host\\share\\selected.jsonl');
  assert.equal(result.available,false);assert.doesNotMatch(JSON.stringify(result),/synthetic-host|selected.jsonl/);
});
