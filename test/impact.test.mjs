import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { assessCommandImpact,impactDenial,IMPACT_CATEGORIES } from '../src/impact.mjs';
import { validateConfig } from '../src/config.mjs';
import { dispatch,assertSafeOutput } from '../src/dispatcher.mjs';
import { runCli } from '../src/cli.mjs';
const event=JSON.parse(await readFile(new URL('../fixtures/pre-tool-safe.json',import.meta.url),'utf8'));
const guard=enabled=>({id:'impact-review',type:'blastRadiusGuard',enabled,categories:[...IMPACT_CATEGORIES]});
const input=command=>({...event,tool_name:'Bash',tool_input:{command}});
test('impact assessment gives bounded conservative explanations without command/target echo or execution',async()=>{
  const commands=['rm -rf SYNTHETIC_ONLY','git reset --hard SYNTHETIC_ONLY','git clean -fd SYNTHETIC_ONLY','chmod 700 SYNTHETIC_ONLY','scp SYNTHETIC_ONLY nowhere.invalid:','npm install SYNTHETIC_ONLY'];
  for(const command of commands){const a=assessCommandImpact(command);assert.ok(a.matches.length);assert.equal(a.targetScope,'unknown');assert.doesNotMatch(JSON.stringify(a),/SYNTHETIC_ONLY|nowhere.invalid/);assert.ok(impactDenial(a).length<=500);}
  const all=assessCommandImpact(commands.join('; '));assert.equal(all.matches.length,6);assert.ok(impactDenial(all).length<=500);
  assert.equal(assessCommandImpact('printf HARMLESS').matches.length,0);
  assert.ok(assessCommandImpact('echo "example rm -rf"').matches.length,'quoted documentation is a disclosed false positive');
  assert.equal(assessCommandImpact('custom-delete-wrapper').matches.length,0);assert.match(all.limits,/No matches does not mean safe/);
  let result='';await runCli(['impact','--stdin'],{stdin:Readable.from([JSON.stringify({command:commands[0]})]),stdout:{write:s=>result+=s}});assert.equal(JSON.parse(result).assessmentOnly,true);assert.doesNotMatch(result,/SYNTHETIC_ONLY/);
});
test('impact guard is opt-in, denies only covered signals and rechecks exact replacements without approving',()=>{
  assert.deepEqual(dispatch(input('rm -rf SYNTHETIC_ONLY'),validateConfig({version:1,mods:[guard(false)]})).output,{});
  const config=validateConfig({version:1,mods:[guard(true)]});
  assert.deepEqual(dispatch(input('printf HARMLESS'),config).output,{});
  const out=dispatch(input('rm -rf SYNTHETIC_ONLY'),config).output;assert.equal(out.hookSpecificOutput.permissionDecision,'deny');assert.match(out.hookSpecificOutput.permissionDecisionReason,/denied, not held/);assert.equal(out.hookSpecificOutput.updatedInput,undefined);assertSafeOutput(out,input('rm -rf SYNTHETIC_ONLY'));
  const rewrite={id:'test-rewrite',type:'exactCommandRewrite',enabled:true,rules:[{toolName:'Bash',fromCommand:'printf BEFORE',toCommand:'git clean --dry-run'}]};
  const revised=dispatch(input('printf BEFORE'),validateConfig({version:1,mods:[rewrite,guard(true)]})).output;
  assert.equal(revised.hookSpecificOutput.permissionDecision,'deny');assert.equal(revised.hookSpecificOutput.updatedInput,undefined);
  assert.deepEqual(dispatch({...input('rm -rf SYNTHETIC_ONLY'),tool_name:'different_tool'},config).output,{});
});
test('impact configuration cannot inject rules, modules or categories; malformed inputs are rejected',async()=>{
  for(const categories of [[],['unknown'],['delete','delete'],['delete',()=>{}]])assert.throws(()=>validateConfig({version:1,mods:[{...guard(true),categories}]}));
  assert.throws(()=>validateConfig({version:1,mods:[{...guard(true),execute:'anything'}]}));
  for(const value of [null,{},'x'.repeat(1024*1024+1)])assert.throws(()=>assessCommandImpact(value));
  await assert.rejects(runCli(['impact','--stdin'],{stdin:Readable.from(['{"command":"printf HARMLESS","approve":true}']),stdout:{write(){}}}));
});
