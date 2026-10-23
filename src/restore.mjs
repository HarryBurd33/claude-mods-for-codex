import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { lstat,open,realpath,mkdir,rmdir } from 'node:fs/promises';
import { dirname,isAbsolute,join,relative,resolve,sep } from 'node:path';
import { prepareDataDirectory } from './journal.mjs';
import { readCheckpointPair } from './workspace.mjs';

const LIMIT=256*1024, PLAN_LIMIT=800*1024;
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const fail=message=>new Error(`Restore: ${message}`);
function platform(){if(process.platform==='win32')throw fail('private plans need native Windows ACL validation');}
function absolute(path){if(typeof path!=='string'||!isAbsolute(path)||path.length>4096||/\p{Cc}/u.test(path))throw fail('an absolute bounded path is required');return resolve(path);}
function outside(root,path){const child=relative(root,path);if(child===''||(!isAbsolute(child)&&child!=='..'&&!child.startsWith(`..${sep}`)))throw fail('keep sensitive restore plans outside the selected project');}
function owner(info){if(process.getuid&&info.uid!==process.getuid())throw fail('file must belong to the current user');}
function regular(info){if(!info.isFile()||info.nlink!==1)throw fail('file must be regular without links');owner(info);if(info.mode&0o7000)throw fail('special permission bits are excluded');if(info.size>LIMIT)throw fail('selected file exceeds the restore bound');}
async function selectedFile(root,path){
  if(typeof path!=='string'||!path||path.length>1024||/[\\\p{Cc}\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/u.test(path)||path.split('/').some(p=>!p||p==='.'||p==='..')||isAbsolute(path))throw fail('invalid selected relative path');
  if(await realpath(root)!==root)throw fail('project identity changed');
  let cursor=root;
  const parts=path.split('/');
  for(let i=0;i<parts.length;i++){
    cursor=join(cursor,parts[i]);const info=await lstat(cursor);
    if(info.isSymbolicLink()||(i<parts.length-1&&!info.isDirectory()))throw fail('linked or special paths are excluded');
    if(i===parts.length-1){regular(info);return{path:cursor,info};}
  }
}
async function bytes(handle,limit=LIMIT){
  const info=await handle.stat();if(info.size>limit)throw fail('read exceeds its bound');
  const buffer=Buffer.alloc(limit+1);let total=0;
  while(total<=limit){const r=await handle.read(buffer,total,limit+1-total,total);if(!r.bytesRead)break;total+=r.bytesRead;}
  if(total>limit)throw fail('read exceeds its bound');return buffer.subarray(0,total);
}
async function current(root,path){
  const checked=await selectedFile(root,path);const handle=await open(checked.path,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
  try{const info=await handle.stat();regular(info);if(info.ino!==checked.info.ino||info.dev!==checked.info.dev)throw fail('selected file changed');return{info,bytes:await bytes(handle)};}finally{await handle.close();}
}
function matches(actual,expected,info,mode){return actual.equals(expected)&&(((info.mode&0o111)!==0)===(mode==='100755'));}
function summary(plan,planId){return{version:1,planId,projectRoot:plan.projectRoot,path:plan.path,fromCommit:plan.fromCommit,toCommit:plan.toCommit,expectedBytes:Buffer.from(plan.after,'base64').length,restoreBytes:Buffer.from(plan.before,'base64').length,
  expectedSha256:digest(Buffer.from(plan.after,'base64')),restoreSha256:digest(Buffer.from(plan.before,'base64')),
  effect:'Replace only this existing file with the selected from-commit content. Keep index, HEAD, other files, ownership, permissions and extended metadata. No command execution.',
  limits:'One regular text file present with the same executable mode in both commits. Refuses changed content/links. Private plan contains both versions. Same-user concurrent writes are not an OS security boundary; interrupted writes may require recovery from the plan.'};}

export async function prepareRestorePlan(root,input,output){
  platform();const pair=await readCheckpointPair(root,input),snapshot=await current(pair.root,pair.path);
  if(!matches(snapshot.bytes,pair.after.bytes,snapshot.info,pair.after.mode))throw fail('selected file conflicts with the expected checkpoint; no plan created');
  if(pair.before.bytes.equals(pair.after.bytes))throw fail('selected checkpoints have no content change');
  const path=absolute(output);outside(pair.root,path);
  await prepareDataDirectory(dirname(path));
  const plan={version:1,projectRoot:pair.root,path:pair.path,fromCommit:input.fromCommit,toCommit:input.toCommit,mode:pair.before.mode,before:pair.before.bytes.toString('base64'),after:pair.after.bytes.toString('base64')};
  const serialized=JSON.stringify(plan),planId=digest(serialized),handle=await open(path,'wx',0o600);
  try{await handle.writeFile(serialized+'\n');await handle.sync();}finally{await handle.close();}
  return{created:true,readOnlyProject:true,...summary(plan,planId)};
}

async function loadPlan(input){
  platform();const path=absolute(input);
  // Existing private parent only; do not create it during review/apply.
  const parent=await realpath(dirname(path));if(parent!==dirname(path))throw fail('linked plan paths are excluded');
  let cursor=dirname(path);
  while(true){const stat=await lstat(cursor);if(stat.isSymbolicLink())throw fail('linked plan paths are excluded');const next=dirname(cursor);if(next===cursor)break;cursor=next;}
  const parentInfo=await lstat(parent);owner(parentInfo);if(!parentInfo.isDirectory()||(parentInfo.mode&0o077))throw fail('plan directory must be private');
  const handle=await open(path,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
  let raw;
  try{const info=await handle.stat();if(!info.isFile()||info.nlink!==1||(info.mode&0o077))throw fail('plan must be a private regular unlinked file');owner(info);raw=(await bytes(handle,PLAN_LIMIT)).toString('utf8').trim();}finally{await handle.close();}
  let plan;try{plan=JSON.parse(raw);}catch{throw fail('invalid plan');}
  const keys=['version','projectRoot','path','fromCommit','toCommit','mode','before','after'].sort().join();
  if(!plan||typeof plan!=='object'||Array.isArray(plan)||Object.keys(plan).sort().join()!==keys||plan.version!==1||!['100644','100755'].includes(plan.mode))throw fail('invalid plan');
  absolute(plan.projectRoot);outside(plan.projectRoot,path);
  for(const key of ['fromCommit','toCommit'])if(typeof plan[key]!=='string'||!/^[a-f0-9]{40}$/.test(plan[key]))throw fail('invalid checkpoint IDs');
  for(const key of ['before','after']){
    if(typeof plan[key]!=='string'||plan[key].length>Math.ceil(LIMIT/3)*4)throw fail('invalid plan content');
    const data=Buffer.from(plan[key],'base64');if(data.length>LIMIT||data.toString('base64')!==plan[key]||data.includes(0))throw fail('invalid plan content');
  }
  // Re-derive from validated in-project objects: a plan cannot grant arbitrary
  // target-path/content authority just by being a private JSON file.
  const pair=await readCheckpointPair(plan.projectRoot,{fromCommit:plan.fromCommit,toCommit:plan.toCommit,path:plan.path});
  if(pair.root!==plan.projectRoot||pair.before.mode!==plan.mode||pair.before.bytes.toString('base64')!==plan.before||pair.after.bytes.toString('base64')!==plan.after)throw fail('plan no longer matches its checkpoints');
  return{plan,planId:digest(JSON.stringify(plan))};
}
export async function reviewRestorePlan(path){const{plan,planId}=await loadPlan(path),snapshot=await current(plan.projectRoot,plan.path);return{...summary(plan,planId),currentMatchesExpected:matches(snapshot.bytes,Buffer.from(plan.after,'base64'),snapshot.info,plan.mode)};}

async function overwrite(handle,content){let offset=0;while(offset<content.length){const r=await handle.write(content,offset,content.length-offset,offset);if(!r.bytesWritten)throw fail('write made no progress');offset+=r.bytesWritten;}await handle.truncate(content.length);await handle.sync();}
export async function applyRestorePlan(path,confirmPlan){
  const {plan,planId}=await loadPlan(path);
  if(typeof confirmPlan!=='string'||confirmPlan!==planId)throw fail('supply the exact reviewed plan ID; no file changed');
  const checked=await selectedFile(plan.projectRoot,plan.path),lock=join(dirname(checked.path),'.claude-mods-restore.lock');
  if(!(checked.info.mode&0o200))throw fail('selected file is not owner-writable');
  // Cooperative lock, never steal it. In-place writes preserve ACLs/xattrs as
  // well as mode/owner. A crash can interrupt a write; both versions stay in the
  // private plan for recovery. This is not an automatic approval mechanism.
  await mkdir(lock,{mode:0o700});let handle;
  try{
    handle=await open(checked.path,constants.O_RDWR|constants.O_NOFOLLOW|constants.O_NONBLOCK);
    const info=await handle.stat();regular(info);
    if(!(info.mode&0o200))throw fail('selected file is not owner-writable');
    const fresh=await selectedFile(plan.projectRoot,plan.path);
    if(info.ino!==fresh.info.ino||info.dev!==fresh.info.dev||info.ino!==checked.info.ino||info.dev!==checked.info.dev)throw fail('selected file changed');
    const expected=Buffer.from(plan.after,'base64'),target=Buffer.from(plan.before,'base64'),actual=await bytes(handle);
    if(!matches(actual,expected,info,plan.mode))throw fail('selected file conflicts with the expected checkpoint; no file changed');
    try{await overwrite(handle,target);}catch{
      try{await overwrite(handle,expected);}catch{throw fail('write and recovery failed; recover the original bytes from the private plan before proceeding');}
      throw fail('write failed; original content restored');
    }
    const final=await selectedFile(plan.projectRoot,plan.path);
    if(final.info.ino!==info.ino||final.info.dev!==info.dev||!(await bytes(handle)).equals(target))throw fail('concurrent change detected after write; inspect the file and private plan before proceeding');
    return{restored:true,path:plan.path,planId,indexChanged:false,headChanged:false,recovery:'Both versions remain in the private plan. To undo, explicitly prepare/review a new plan with the two checkpoints reversed.'};
  }finally{await handle?.close();await rmdir(lock);}
}
