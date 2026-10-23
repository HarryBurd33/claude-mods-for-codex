import { mkdir, lstat, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, resolve, parse, sep, join } from 'node:path';
import { validateConfig } from './config.mjs';

function replayFixtures(spec) {
  const base = { cwd:'/example/project', model:'synthetic-model', permission_mode:'default',
    session_id:'synthetic-session', transcript_path:null, turn_id:'synthetic-turn' };
  const tool = command => ({ ...base, hook_event_name:'PreToolUse', tool_name:'Bash', tool_use_id:'synthetic-call', tool_input:{command} });
  // These two controls share no ':' character, so a nonempty lexical match
  // cannot match both. Keep the control on the same tool for a useful replay.
  const control = ['printf MODS_SCAFFOLD_CONTROL', ':'].find(command => spec.kind === 'deny'
    ? !command.includes(spec.match) : command !== spec.from);
  const matching = spec.kind === 'notice' ? { ...base, hook_event_name:'SessionStart', source:'startup' }
    : tool(spec.kind === 'deny' ? spec.match : spec.from);
  return { 'matching.json':matching, 'nonmatching.json':tool(control) };
}

// Generates declarative data only. No executable code, settings edits or trust.
export async function scaffoldMod(spec, destination) {
  if (!spec || typeof spec !== 'object' || Array.isArray(spec) || Object.keys(spec).some(k=>!['name','kind','message','match','reason','from','to'].includes(k))) throw new Error('Invalid scaffold specification');
  if (typeof spec.name !== 'string' || !/^[a-z][a-z0-9-]{0,47}$/.test(spec.name)) throw new Error('Use a bounded lowercase mod name');
  const shapes={notice:['name','kind','message'],deny:['name','kind','match','reason'],replacement:['name','kind','from','to']};
  if (!shapes[spec.kind] || Object.keys(spec).sort().join()!==shapes[spec.kind].sort().join()) throw new Error('Select notice, deny, or replacement with exactly its required fields');
  const mod=spec.kind==='notice'?{id:spec.name,type:'sessionNotice',enabled:false,message:spec.message}:spec.kind==='deny'?{id:spec.name,type:'denyGuard',enabled:false,rules:[{toolNames:['Bash'],commandContains:[spec.match],reason:spec.reason}]}:{id:spec.name,type:'exactCommandRewrite',enabled:false,rules:[{toolName:'Bash',fromCommand:spec.from,toCommand:spec.to}]};
  const config={version:1,mods:[mod]};validateConfig(config);
  const fixtures = replayFixtures(spec);
  if (typeof destination!=='string'||!isAbsolute(destination)||/\p{Cc}/u.test(destination)) throw new Error('Output must be an absolute new directory');
  const path=resolve(destination),parent=dirname(path),root=parse(parent).root;
  let current=root;
  for(const part of parent.slice(root.length).split(sep).filter(Boolean)){current=join(current,part);const stat=await lstat(current);if(!stat.isDirectory()||stat.isSymbolicLink())throw new Error('Output parent must exist without links');}
  const access={version:1,name:spec.name,component:'declarative hook configuration',enabled:false,reads:spec.kind==='notice'?['SessionStart event']:['PreToolUse canonical Bash command in memory'],writes:[],network:[],modelCalls:0,decision:spec.kind==='replacement'?'Exact command proposal; normal host permissions apply':spec.kind==='deny'?'Lexical deny only':'Visible notice',limits:['Disabled until reviewed and explicitly enabled','Declaration is not an OS sandbox','Installing changed code requires human trust review']};
  // Exclusive creation preserves existing work. All validation precedes writes.
  await mkdir(path,{mode:0o700});
  for(const[name,value]of Object.entries({'mods.json':config,'access.json':access}))await writeFile(join(path,name),JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});
  await mkdir(join(path,'fixtures'),{mode:0o700});
  for(const [name,value] of Object.entries(fixtures))await writeFile(join(path,'fixtures',name),JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});
  const expected = spec.kind === 'notice' ? 'a SessionStart notice' : spec.kind === 'deny' ? 'a PreToolUse denial' : 'the exact replacement with visible before/after and normal permissions';
  await writeFile(join(path,'REVIEW.md'),`# Review this generated mod

This is disabled declarative configuration for Claude Mods for Codex, not a
standalone plugin or an immediate native slash callback. Read mods.json and
access.json. The declaration describes this template; it is not an OS sandbox.
Fixtures contain the selected match/from command as plaintext. Keep them private
if the specification is sensitive. Never execute fixture commands.

1. Use the verified package's absolute bin/codex-mods.mjs path. Validate this
   directory's mods.json, then replay with --config MODS_JSON --fixtures FIXTURES.
2. While disabled, matching.json and nonmatching.json must both return {}.
3. To test the intended effect offline, make a separate temporary configuration
   with only this generated mod enabled. Preserve the original disabled file.
   Replay these same fixtures with that temporary --config selection.
4. Enabled matching.json must produce ${expected}.
   Enabled nonmatching.json must return {}. This tests synthetic dispatcher
   behavior, not installation, native event delivery or permission approval.
5. Review the configuration/access diff. Merge only approved entries into selected
   configuration, preserving others. Use supported marketplace install/update and
   human changed-hook trust review; never write trust hashes or promise hot reload.

No installation, settings/trust change, network or additional model call occurs
during scaffold/validate/replay. Describing the mod through a skill uses the
selected model and consumes usage. Installation and live checks remain separate.
`,{flag:'wx',mode:0o600});
  return {created:true,files:['mods.json','access.json','REVIEW.md','fixtures/matching.json','fixtures/nonmatching.json'],enabled:false,installed:false};
}
