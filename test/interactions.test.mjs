import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, realpath, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { componentFromSpec, validateComponent, componentIntent, componentAccess, componentPlan } from '../src/component-contract.mjs';
import { validateInteractionComponents } from '../src/interaction-contract.mjs';
import { scaffoldComponent, loadComponentBundle, replayComponentBundle } from '../src/component-authoring.mjs';
import { loadDashboardHtml } from '../src/dashboard-resource.mjs';
import { loadRuntimeSettings } from '../src/runtime-settings.mjs';
import { createDashboardHandler } from '../src/server.mjs';

const spec = { name: 'review-desk', kind: 'interaction', title: 'Review desk', fields: [
  { id: 'plan', label: 'Plan sketch', format: 'flowchart' }, { id: 'contract', label: 'Data contract', format: 'json' }, { id: 'notes', label: 'Notes', format: 'code' },
] };
const copy = v => JSON.parse(JSON.stringify(v));
const definition = c => ({ id: c.id, ...c.interaction });

test('authored interaction is disabled, local-only and intent cannot change reviewed fields or add authority', () => {
  const base = componentFromSpec(spec), plan = componentPlan(base), access = componentAccess(base);
  assert.equal(base.interaction.enabled, false); assert.deepEqual(plan.registration.hooks, {}); assert.deepEqual(plan.hookConfig, {});
  assert.equal(plan.runtimeSettings.interactionComponents[0].enabled, false);
  assert.deepEqual(access.potentialWrites, []); assert.deepEqual(access.executes, []); assert.equal(access.modelCalls, 0); assert.deepEqual(access.network, []);
  assert.equal(access.retention, false); assert.equal(access.memory.persistent, false); assert.equal(access.memory.charactersPerField, 4096);
  const next = copy(base); next.interaction.enabled = true;
  assert.equal(componentIntent(base, next).interaction.enabled, true);
  for (const change of [v=>v.interaction.title='Changed', v=>v.interaction.fields[0].format='code', v=>v.interaction.fields[0].label='Changed', v=>v.id='changed']) {
    const altered = copy(next); change(altered); assert.throws(()=>componentIntent(base, altered));
  }
  assert.throws(()=>validateComponent({...base, status:{enabled:true,title:'Share',events:['PreToolUse']}}));
  assert.throws(()=>validateComponent({...base, observer:{reception:true,retention:true,events:['Stop']}}));
});

test('exact interaction shapes refuse code/path/defaults, hidden fields/getters, collisions and bounds', () => {
  let getter = false;
  const bad = [ {...spec, path:'/synthetic-private'}, {...spec, fields:[]}, {...spec, fields:Array(5).fill(spec.fields[0])},
    {...spec, fields:[spec.fields[0],spec.fields[0]]}, {...spec, fields:[{...spec.fields[0],format:'html'}]},
    {...spec, fields:[{...spec.fields[0],default:'SYNTHETIC_PRIVATE'}]}, {...spec,title:'x'.repeat(97)},
    {...spec,title:'hidden\u202e'}, {...spec,fields:[{...spec.fields[0],id:'../escape'}]},
    {...spec,fields:[Object.defineProperty({...spec.fields[0]},'label',{get(){getter=true;return 'hidden';}})]},
  ];
  for (const input of bad) assert.throws(()=>componentFromSpec(input)); assert.equal(getter,false);
  const c = definition(componentFromSpec(spec));
  assert.throws(()=>validateInteractionComponents([c,c]));
  assert.throws(()=>validateInteractionComponents(Array.from({length:5},(_,i)=>({...c,id:'card-'+i}))));
  assert.throws(()=>validateInteractionComponents([{...c,enabled:1}]));
  const sparse=[];sparse.length=1;assert.throws(()=>validateInteractionComponents(sparse));
  const fields=[...spec.fields];Object.defineProperty(fields,'0',{get(){getter=true;return spec.fields[0];}});
  assert.throws(()=>componentFromSpec({...spec,fields}));assert.equal(getter,false);
  assert.ok(Object.isFrozen(validateInteractionComponents([c])[0].fields));
});

test('enabled UI definitions escape hostile labels; disabled definitions never enter the resource', async () => {
  const hostile = '</script><img src=x onerror=alert(1)>&\u2028';
  const c = componentFromSpec({...spec,title:hostile});
  const hidden = await loadDashboardHtml([definition(c)]); assert.equal(hidden.includes('onerror=alert(1)'),false);
  const active=copy(definition(c));active.enabled=true;
  const html=await loadDashboardHtml([active]);
  assert.equal((html.match(/<script>/g)||[]).length,1);assert.equal((html.match(/<\/script>/g)||[]).length,1);
  assert.equal(html.includes(hostile),false);assert.ok(html.includes('\\u003c/script\\u003e'));
  assert.doesNotMatch(html, /LOCAL_INTERACTIONS_DATA|innerHTML|insertAdjacentHTML|localStorage|sessionStorage|\beval\(|\bfetch\(/);
  const h=createDashboardHandler({interactionComponents:[active]});
  const resource=await h({method:'resources/read',params:{uri:'ui://claude-mods/dashboard'}});
  assert.deepEqual(resource.contents[0]._meta.ui.csp,{connectDomains:[],resourceDomains:[]});
  const tools=await h({method:'tools/list'});assert.equal(tools.tools.length,8);
  assert.equal(tools.tools.some(t=>/interaction|render|write/.test(t.name)),false);
});

test('real private bundle and CLI replay actual fixed callbacks without installing, storing text or executing fixtures', {skip:process.platform==='win32'}, async t => {
  const dir=await mkdtemp(join(await realpath(tmpdir()),'mods-interaction-'));t.after(()=>rm(dir,{recursive:true,force:true}));
  const path=join(dir,'bundle');await scaffoldComponent(spec,path);
  const base=await loadComponentBundle(path), off=replayComponentBundle(base).interaction;
  assert.equal(off.enabled,false);assert.ok(off.cases.every(c=>c.controls===0));
  const original=await readFile(join(path,'bundle.json'),'utf8');const intent=copy(base.component);intent.interaction.enabled=true;
  const selected=join(dir,'intent.json');await writeFile(selected,JSON.stringify(intent),{mode:0o600});
  const active=await loadComponentBundle(path,selected), replay=replayComponentBundle(active).interaction;
  assert.equal(replay.cases.find(c=>c.action==='render').rendered,3);
  for(const action of ['malformed','oversized']){const c=replay.cases.find(c=>c.action===action);assert.equal(c.rendered,0);assert.equal(c.invalidInputCleared,true);}
  assert.equal(replay.cases.find(c=>c.action==='clear').cleared,true);
  assert.equal(replay.cases.find(c=>c.action==='edit').editInvalidated,true);
  assert.equal(replay.cases.find(c=>c.action==='dispose').disposed,true);
  assert.equal(replay.executesFixtureCommands,false);assert.equal(replay.writes,false);assert.equal(replay.modelCalls,0);
  const cli=fileURLToPath(new URL('../bin/codex-mods.mjs',import.meta.url));
  const out=execFileSync(process.execPath,[cli,'replay-component','--bundle',path,'--intent',selected],{encoding:'utf8',timeout:5000});
  assert.equal(JSON.parse(out).interaction.enabled,true);assert.doesNotMatch(out, /SYNTHETIC_DATA_ONLY|<synthetic>|"count":3|projectId|session_id/);
  const plan=JSON.parse(execFileSync(process.execPath,[cli,'component-plan','--bundle',path,'--intent',selected],{encoding:'utf8',timeout:5000}));
  assert.equal(plan.runtimeSettings.interactionComponents[0].enabled,true);assert.deepEqual(plan.registration.hooks,{});
  assert.equal(await readFile(join(path,'bundle.json'),'utf8'),original);
  await writeFile(join(path,'fixtures/local.json'),'{"private":"SYNTHETIC_PRIVATE"}',{mode:0o600});
  await assert.rejects(loadComponentBundle(path));
  assert.throws(()=>execFileSync(process.execPath,[cli,'validate-component','--bundle',path],{encoding:'utf8',timeout:5000,stdio:['ignore','pipe','pipe']}),e=>!String(e.stderr).includes('SYNTHETIC_PRIVATE'));
});

test('reviewed runtime accepts only inline bounded definitions and preserves observer/status/access selections', {skip:process.platform==='win32'}, async t=>{
  const dir=await mkdtemp(join(await realpath(tmpdir()),'mods-local-settings-'));t.after(()=>rm(dir,{recursive:true,force:true}));
  const path=join(dir,'settings.json'), settings={version:1,projectRoot:dir,dataDirectory:join(dir,'data'),stateScope:'project',interactionComponents:[definition(componentFromSpec(spec))]};
  // Settings must be outside the selected project; select an existing canonical child.
  const {mkdir}=await import('node:fs/promises');await mkdir(join(dir,'project'));settings.projectRoot=join(dir,'project');
  await writeFile(path,JSON.stringify(settings),{mode:0o600});const value=await loadRuntimeSettings(path);
  assert.equal(value.interactionComponents[0].enabled,false);assert.equal(value.stateScope,'project');assert.deepEqual(value.statusComponents,[]);
  await writeFile(path,JSON.stringify({...settings,interactionComponents:[{...settings.interactionComponents[0],source:'private draft'}]}));await assert.rejects(loadRuntimeSettings(path));
});
