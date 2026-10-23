import { mkdir, lstat, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, resolve, parse, sep, join } from 'node:path';
import { validateConfig } from './config.mjs';

// Generates declarative data only. No executable code, settings edits or trust.
export async function scaffoldMod(spec, destination) {
  if (!spec || typeof spec !== 'object' || Array.isArray(spec) || Object.keys(spec).some(k=>!['name','kind','message','match','reason','from','to'].includes(k))) throw new Error('Invalid scaffold specification');
  if (typeof spec.name !== 'string' || !/^[a-z][a-z0-9-]{0,47}$/.test(spec.name)) throw new Error('Use a bounded lowercase mod name');
  const shapes={notice:['name','kind','message'],deny:['name','kind','match','reason'],replacement:['name','kind','from','to']};
  if (!shapes[spec.kind] || Object.keys(spec).sort().join()!==shapes[spec.kind].sort().join()) throw new Error('Select notice, deny, or replacement with exactly its required fields');
  const mod=spec.kind==='notice'?{id:spec.name,type:'sessionNotice',enabled:false,message:spec.message}:spec.kind==='deny'?{id:spec.name,type:'denyGuard',enabled:false,rules:[{toolNames:['Bash'],commandContains:[spec.match],reason:spec.reason}]}:{id:spec.name,type:'exactCommandRewrite',enabled:false,rules:[{toolName:'Bash',fromCommand:spec.from,toCommand:spec.to}]};
  const config={version:1,mods:[mod]};validateConfig(config);
  if (typeof destination!=='string'||!isAbsolute(destination)||/\p{Cc}/u.test(destination)) throw new Error('Output must be an absolute new directory');
  const path=resolve(destination),parent=dirname(path),root=parse(parent).root;
  let current=root;
  for(const part of parent.slice(root.length).split(sep).filter(Boolean)){current=join(current,part);const stat=await lstat(current);if(!stat.isDirectory()||stat.isSymbolicLink())throw new Error('Output parent must exist without links');}
  const access={version:1,name:spec.name,component:'declarative hook configuration',enabled:false,reads:spec.kind==='notice'?['SessionStart event']:['PreToolUse canonical Bash command in memory'],writes:[],network:[],modelCalls:0,decision:spec.kind==='replacement'?'Exact command proposal; normal host permissions apply':spec.kind==='deny'?'Lexical deny only':'Visible notice',limits:['Disabled until reviewed and explicitly enabled','Declaration is not an OS sandbox','Installing changed code requires human trust review']};
  // Exclusive creation preserves existing work. All validation precedes writes.
  await mkdir(path,{mode:0o700});
  for(const[name,value]of Object.entries({'mods.json':config,'access.json':access}))await writeFile(join(path,name),JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});
  await writeFile(join(path,'REVIEW.md'),'# Review this generated mod\n\nRead mods.json and access.json. The mod is disabled. Validate and replay the configuration with the verified package CLI, inspect the resulting decisions and review the diff before enabling. Replays never execute commands. Merge only the selected mod into reviewed configuration; preserve other entries. Use supported local marketplace installation/update and human hook trust for changed packages. This output is configuration for Claude Mods for Codex, not a standalone plugin or native slash callback.\n',{flag:'wx',mode:0o600});
  return {created:true,files:['mods.json','access.json','REVIEW.md'],enabled:false,installed:false};
}
