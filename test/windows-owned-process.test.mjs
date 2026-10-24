import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, readdir, rm, rmdir, access, realpath, mkdir, copyFile, symlink, link, open, rename } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, win32 } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { windowsStorageRequest } from '../src/windows-storage.mjs';

// Real Windows OS tests only. No mocked paths, model calls, Codex installation,
// production API integration, user project traversal or executable-trust claim.
const native = { skip: process.platform !== 'win32', timeout: 45000 };
let fixture;
async function run(exe, args, options = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(exe, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], ...options });
    const timer = setTimeout(() => { p.kill(); reject(new Error('Proof harness deadline')); }, 20000);
    let out = '', err = '';
    p.stdout.on('data', b => { out += b; if (out.length > 32768) p.kill(); });
    p.stderr.on('data', b => { err += b; if (err.length > 8192) p.kill(); });
    p.on('error', e => { clearTimeout(timer); reject(e); });
    p.on('close', code => { clearTimeout(timer); code === 0 ? resolve(out.trim()) : reject(new Error(`Public proof failed: ${code}: ${out}: ${err}`)); });
  });
}
async function setup() {
  fixture ??= (async () => {
    const root = await mkdtemp(join(await realpath(tmpdir()), 'mods-owned-'));
    const data = join(root, 'private proof Ω space');
    await windowsStorageRequest('prepare-directory', data);
    const ps = win32.join(process.env.SystemRoot, 'System32/WindowsPowerShell/v1.0/powershell.exe');
    assert.equal(await run(ps, ['-NoLogo','-NoProfile','-NonInteractive','-File',fileURLToPath(new URL('../proofs/windows-owned-process/build.ps1',import.meta.url)),'-Destination',data]), 'proof-compiled');
    return { root, data, exe: join(data, 'owned-proof.exe') };
  })();
  return fixture;
}
test.after(async () => { if (fixture) { const { root } = await fixture; await rm(root, { recursive: true, force: true }); } });
function result(frame) {
  const [kind, code, out, err, extra] = frame.split('|');
  assert.equal(kind, 'ok'); assert.equal(extra, undefined);
  return { code: Number(code), out: Buffer.from(out,'base64').toString(), err: Buffer.from(err,'base64').toString() };
}
async function dead(path) {
  const pid = Number(await readFile(path,'utf8'));
  assert.ok(Number.isInteger(pid) && pid > 0);
  for (let n = 0; n < 100; n++) {
    try { process.kill(pid, 0); } catch (e) { assert.equal(e.code, 'ESRCH'); return; }
    await new Promise(r => setTimeout(r, 10));
  }
  assert.fail('Owned synthetic process survived cleanup');
}
test('Windows job-list proof captures both pipes, EOF, exit status and exact Unicode/quote argv', native, async () => {
  const { data, exe } = await setup();
  assert.deepEqual(result(await run(exe,['run','print',data])),{ code:0,out:'fixed-output',err:'fixed-error' });
  assert.equal(result(await run(exe,['run','exit',data])).code,23);
  assert.equal(result(await run(exe,['run','stdin',data])).out,'eof');
  const args = ['', 'Ω🚀 space', 'quote"value', 'trailing\\', '\\"\\', '$(not-a-shell); & | %PATH%'];
  assert.deepEqual(result(await run(exe,['run','args',data,...args])).out.trimEnd().split(/\r?\n/).map(x=>Buffer.from(x,'base64').toString()),args);
});
test('Windows job-list proof excludes ambient environment and unrelated inheritable handles', native, async () => {
  const { data, exe } = await setup();
  const value=result(await run(exe,['run','env',data],{ env:{...process.env, MODS_SYNTHETIC_FORBIDDEN:'must-not-inherit'} })).out.split('|').map(s=>Buffer.from(s,'base64').toString());
  assert.deepEqual(value,['visible-value','']);
  assert.deepEqual(result(await run(exe,['run','handle',data])),{code:0,out:'attempted',err:''});
});
test('Windows job-list proof bounds output and refuses invalid or missing executable without side effects', native, async () => {
  const { data, exe } = await setup();
  assert.equal(await run(exe,['run','flood',data]),'refused');
  const marker=join(data,'not-created');
  assert.equal(await run(exe,['run','invalid-exe',data,marker]),'refused');
  assert.equal(await run(exe,['run','missing-exe',data,marker]),'refused');
  await assert.rejects(access(marker),{code:'ENOENT'});
});
test('Windows job-list proof kills root and descendant on deadline, cancellation and successful root exit', native, async () => {
  const { data, exe } = await setup();
  for (const mode of ['fork','cancel','fork-exit']) {
    const marker=join(data,mode), start=performance.now();
    const output=await run(exe,['run',mode,data,marker]);
    assert.ok(performance.now()-start<5000);
    if(mode==='fork-exit')assert.equal(result(output).code,0);
    else assert.equal(output,mode==='cancel'?'cancelled':'refused');
    await dead(marker+'.root'); await dead(marker+'.descendant');
  }
  const marker=join(data,'pre-cancel');
  assert.equal(await run(exe,['run','pre-cancel',data,marker]),'cancelled');
  await assert.rejects(access(marker),{code:'ENOENT'});
});
test('Windows job-list proof kills descendants if its owning helper is terminated externally', native, async () => {
  const { data, exe } = await setup();
  const marker=join(data,'outer-kill');
  const p=spawn(exe,['run','outer-kill',data,marker],{windowsHide:true,stdio:'ignore'});
  const closed=new Promise((resolve,reject)=>{p.once('close',resolve);p.once('error',reject);});
  try {
    let ready=false;
    for(let n=0;n<300;n++) {
      try {await access(marker+'.descendant');ready=true;break;} catch {}
      await new Promise(r=>setTimeout(r,10));
    }
    assert.ok(ready,'Synthetic root and descendant must actually start');
  } finally {p.kill();await closed;}
  await dead(marker+'.root');await dead(marker+'.descendant');
});
async function fixtureAcl(path, mode) {
  const ps=win32.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe');
  return new Promise((resolve,reject)=>{
    const p=spawn(ps,['-NoLogo','-NoProfile','-NonInteractive','-File',fileURLToPath(new URL('./windows-fixtures.ps1',import.meta.url))],{windowsHide:true,stdio:['pipe','pipe','ignore']});
    const timer=setTimeout(()=>{p.kill();reject(new Error('Synthetic ACL deadline'));},10000);
    let text='';p.stdout.on('data',b=>text+=b);p.on('error',reject);
    p.on('close',code=>{clearTimeout(timer);code===0&&text.trim()==='fixture-ready'?resolve():reject(new Error('Synthetic ACL fixture refused'));});
    p.stdin.end(JSON.stringify({path,mode}).replace(/[^\x00-\x7f]/g,c=>`\\u${c.charCodeAt(0).toString(16).padStart(4,'0')}`)+'\n');
  });
}
test('Windows executable-pin proof rejects project code, foreign writes, links, aliases and mutable code directory',native,async()=>{
  const {data,exe}=await setup(), code=join(data,'reviewed code'), project=join(data,'selected project');
  await windowsStorageRequest('prepare-directory',code);await mkdir(project);
  const selected=join(code,'synthetic.exe');await copyFile(exe,selected);await fixtureAcl(selected,'private');
  const pin=path=>run(exe,['run','pin',data,path,code,project]);
  assert.equal(await pin(selected),'pinned');
  assert.equal(await run(exe,['run','pin',data,selected,code,data]),'refused','code root overlaps selected project');
  for(const mode of ['code-write','deny-code-write']) {
    await fixtureAcl(selected,mode);assert.equal(await pin(selected),'refused');await fixtureAcl(selected,'private');
  }
  // Trusted administrator ownership is permitted for code; private data files
  // retain their separate current-user-only owner requirement.
  await fixtureAcl(selected,'wrong-owner');assert.equal(await pin(selected),'pinned');await fixtureAcl(selected,'private');
  await fixtureAcl(code,'code-write');assert.equal(await pin(selected),'refused');await fixtureAcl(code,'private');
  const hard=join(code,'hard.exe');await link(selected,hard);
  assert.equal(await pin(hard),'refused');await rm(hard);
  const junction=join(data,'linked code');await symlink(code,junction,'junction');
  assert.equal(await run(exe,['run','pin',data,join(junction,'synthetic.exe'),junction,project]),'refused');
  assert.equal(await run(exe,['run','pin',data,selected,code,junction]),'refused','project alias cannot hide overlap');
  await rm(junction);
  for(const path of [selected+':ads.exe',join(code,'..','reviewed code','synthetic.exe').replace('reviewed code','reviewed code.'),'relative.exe'])assert.equal(await pin(path),'refused');
  assert.equal(await pin(selected),'pinned');
});
test('Windows scratch proof starts private, is pinned while live, and removes only its own empty directory',native,async()=>{
  const {data,exe}=await setup();
  const p=spawn(exe,['run','scratch',data],{windowsHide:true,stdio:['pipe','pipe','ignore']});
  const closed=new Promise((resolve,reject)=>{p.on('close',resolve);p.on('error',reject);});
  let text='';p.stdout.setEncoding('utf8');
  const ready=new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Scratch witness deadline')),5000);
    p.stdout.on('data',c=>{text+=c;if(text.includes('\n')){clearTimeout(timer);resolve(text.split(/\r?\n/)[0]);}});
    p.on('error',reject);
  });
  let path;
  try {
    path=Buffer.from(await ready,'base64').toString();assert.ok(path.startsWith(data+win32.sep+'owned-'));
    // Existing adapter independently verifies protected current-user ownership.
    await windowsStorageRequest('prepare-directory',path);
    await assert.rejects(rmdir(path),e=>['EPERM','EBUSY','EACCES'].includes(e.code));
    p.stdin.end('\n');assert.equal(await closed,0);assert.match(text,/removed/);
    await assert.rejects(access(path),{code:'ENOENT'});
  } finally {if(p.exitCode===null){p.kill();await closed;}}
});
test('Windows directory pins tolerate a short sharing lease and refuse a held lease without changing ACLs',native,async()=>{
  const {data,exe}=await setup();
  assert.equal(await run(exe,['run','transient-pin',data]),'pinned');
  assert.equal(await run(exe,['run','held-pin',data]),'refused');
  await windowsStorageRequest('prepare-directory',data);
});

// Private synthetic paths stay inside this disposable fixture; no project/index/
// refs/credentials are copied. The helper never scans for abandoned directories.
async function scratchHolder(mode, marker, commandArgs) {
  const {data,exe}=await setup();
  const child=spawn(exe,commandArgs??['run',mode,data,...(marker?[marker]:[])],{windowsHide:true,stdio:['pipe','pipe','pipe']});
  let text='',error='';
  const closed=new Promise((resolve,reject)=>{child.once('close',resolve);child.once('error',reject);});
  const deadline=setTimeout(()=>child.kill(),20000);child.once('close',()=>clearTimeout(deadline));
  const first=new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{child.kill();reject(new Error('Synthetic content readiness deadline'));},5000);
    child.stdout.setEncoding('utf8');child.stdout.on('data',value=>{
      text+=value;
      if(text.length>8192){child.kill();reject(new Error('Synthetic content output bound'));}
      if(text.includes('\n')){clearTimeout(timer);resolve(text.split(/\r?\n/)[0]);}
    });
    child.stderr.on('data',value=>{error+=value;if(error.length>8192)child.kill();});
    child.once('error',e=>{clearTimeout(timer);reject(e);});
    child.once('close',()=>{clearTimeout(timer);if(!text.includes('\n'))reject(new Error('Synthetic content closed before readiness'));});
  });
  try {
    const paths=(await first).split('|').map(value=>Buffer.from(value,'base64').toString());
    assert.ok(paths[0].startsWith((commandArgs?commandArgs[3]:data)+win32.sep+'owned-'));
    if(paths.length===2)assert.equal(paths[1],join(paths[0],'slot-0000.bin'));
    return {child,closed,paths,output:()=>text};
  } catch(e) {child.kill();await closed;throw e;}
}
async function finishHolder(holder, kill=false) {
  if(kill)holder.child.kill();else holder.child.stdin.end('\n');
  const code=await holder.closed;
  if(!kill)assert.equal(code,0);
}
async function absent(path) {
  for(let n=0;n<100;n++) {
    try {await access(path);}catch(e){assert.equal(e.code,'ENOENT');return;}
    await new Promise(resolve=>setTimeout(resolve,10));
  }
  assert.fail('Owned synthetic content survived cleanup');
}
test('Windows scratch content is private, readable by a compatible process, write-excluded and removed on close',native,async()=>{
  const {exe,data}=await setup(),h=await scratchHolder('scratch-content');
  const [root,file]=h.paths;
  try {
    assert.equal(result(await run(exe,['run','scratch-read',data,file])).out,'verified');
    await assert.rejects(writeFile(file,'must-not-write'),e=>['EPERM','EACCES','EBUSY'].includes(e.code));
    assert.equal(result(await run(exe,['run','scratch-read',data,file])).out,'verified');
    await finishHolder(h);assert.match(h.output(),/removed/);await absent(root);
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});
test('Windows scratch content refuses count and byte bounds, retains unexpected entries and never adopts an existing slot',native,async()=>{
  const {exe,data}=await setup();assert.equal(await run(exe,['run','scratch-bounds',data]),'bounded');
  const h=await scratchHolder('scratch-collision'),root=h.paths[0],collision=join(root,'slot-0000.bin');
  try {
    await writeFile(collision,'unowned-synthetic');
    await finishHolder(h);assert.match(h.output(),/refused-slot/);assert.match(h.output(),/retained-root/);
    assert.equal(await readFile(collision,'utf8'),'unowned-synthetic');
    assert.deepEqual(await readdir(root),['slot-0000.bin']);
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
  const outside=join(data,'foreign synthetic target');await mkdir(outside);await writeFile(join(outside,'keep'),'unchanged');
  const second=await scratchHolder('scratch-content'),[secondRoot,owned]=second.paths;
  try {
    await symlink(outside,join(secondRoot,'unexpected junction'),'junction');
    await finishHolder(second);assert.match(second.output(),/retained-root/);await absent(owned);
    assert.deepEqual(await readdir(secondRoot),['unexpected junction']);
    assert.equal(await readFile(join(outside,'keep'),'utf8'),'unchanged');
  } finally {if(second.child.exitCode===null){second.child.kill();await second.closed;}}
});
test('Windows scratch content is deleted after external owner death without recursive recovery',native,async()=>{
  const h=await scratchHolder('scratch-content'),[root,file]=h.paths;
  try {
    await finishHolder(h,true);await absent(file);
    assert.deepEqual(await readdir(root),[],'only an empty private root may remain');
    await windowsStorageRequest('prepare-directory',root);
    await rmdir(root); // Explicit test-fixture cleanup, not product recovery.
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});
test('Windows job death closes descendant scratch readers before owned content disappears',native,async()=>{
  const {data}=await setup(),marker=join(data,'scratch-job');
  const h=await scratchHolder('scratch-job',marker),[root,file]=h.paths;
  try {
    let ready=false;
    for(let n=0;n<300;n++) {
      try {await access(marker+'.reader');ready=true;break;}catch{}
      await new Promise(resolve=>setTimeout(resolve,10));
    }
    assert.ok(ready,'The descendant must hold a real compatible file handle');
    await finishHolder(h,true);await dead(marker+'.root');await dead(marker+'.reader');await absent(file);
    assert.deepEqual(await readdir(root),[]);await rmdir(root);
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});
test('Windows successful root exit also removes scratch content held by an owned descendant',native,async()=>{
  const {data}=await setup(),marker=join(data,'scratch-job-exit');
  const h=await scratchHolder('scratch-job-exit',marker),[root,file]=h.paths;
  try {
    assert.equal(await h.closed,0);await dead(marker+'.root');await dead(marker+'.reader');await absent(file);
    // Job termination is asynchronous. Empty-only removal may have refused
    // before the reader closed; either absence or an empty private root is safe.
    try {assert.deepEqual(await readdir(root),[]);await rmdir(root);}catch(e){if(e.code!=='ENOENT')throw e;}
    assert.match(h.output(),/removed|retained-root/);
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});

async function readsetProject(name) {
  const {data,exe}=await setup(),project=join(data,'selected '+name);
  await windowsStorageRequest('prepare-directory',project);return {data,exe,project};
}
async function readsetHolder(project,paths,mode='readset-hold') {
  const {exe}=await setup();let text='';
  const child=spawn(exe,['run',mode,project,...paths],{windowsHide:true,stdio:['pipe','pipe','ignore']});
  const closed=new Promise((resolve,reject)=>{child.once('close',resolve);child.once('error',reject);});
  const deadline=setTimeout(()=>child.kill(),20000);child.once('close',()=>clearTimeout(deadline));
  try {
    await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('Synthetic read-set readiness deadline')),5000);
      child.stdout.setEncoding('utf8');child.stdout.on('data',value=>{
        text+=value;if(text.length>8192){child.kill();reject(new Error('Synthetic read-set output bound'));}
        if(text.includes('\n')){clearTimeout(timer);resolve();}
      });
      child.once('error',e=>{clearTimeout(timer);reject(e);});
      child.once('close',()=>{clearTimeout(timer);if(!text.includes('\n'))reject(new Error('Synthetic read-set closed before readiness'));});
    });
    assert.match(text,/^captured\|\d+\|\d+/);return {child,closed,output:()=>text};
  } catch(e){child.kill();await closed;throw e;}
}
test('Windows read-set captures only explicit bounded Unicode paths and keeps source and Git sentinel bytes unchanged',native,async()=>{
  const {project,exe}=await readsetProject('literal Ω');
  await mkdir(join(project,'nested'));await mkdir(join(project,'.git'));
  const contents=new Map([['sample.txt','alpha'],['nested/Ω space.txt','beta'],['.git/index','untouched-index'],['.git/HEAD','untouched-head']]);
  for(const [path,value] of contents)await writeFile(join(project,path),value);
  assert.equal(await run(exe,['run','readset',project,'sample.txt','nested/Ω space.txt']),'captured|2|9\r\nverified');
  for(const [path,value] of contents)assert.equal(await readFile(join(project,path),'utf8'),value);
  // A completed read-set releases pins and never leaves a helper lock/sidecar.
  await writeFile(join(project,'sample.txt'),'changed-after-release');
  assert.deepEqual((await readdir(project)).sort(),['.git','nested','sample.txt']);
});
test('Windows read-set rejects traversal, sensitive segments, namespaces, aliases and case-colliding selections',native,async()=>{
  const {project,exe}=await readsetProject('invalid');await writeFile(join(project,'sample.txt'),'alpha');
  const invalid=['../sample.txt','/sample.txt','nested//sample.txt','nested/./sample.txt','nested/../sample.txt',
    'nested\\sample.txt','sample.txt:stream','sample.txt.','sample.txt ','C:/elsewhere.txt','//server/share/file','CON.txt',
    '.ENV','nested/credentials.json','auth.json','id_ed25519','private.key','.git/index','node_modules/file.txt','x/\u202Ehidden.txt'];
  for(const path of invalid)assert.equal(await run(exe,['run','readset',project,path]),'refused');
  assert.equal(await run(exe,['run','readset',project,'sample.txt','SAMPLE.TXT']),'refused');
  assert.equal(await run(exe,['run','readset',project,Array(17).fill('x').join('/')]),'refused');
  assert.equal(await readFile(join(project,'sample.txt'),'utf8'),'alpha');
  assert.deepEqual(await readdir(project),['sample.txt']);
});
test('Windows read-set refuses linked roots, junction ancestors, hardlinks, missing and directory leaves',native,async()=>{
  const {project,data,exe}=await readsetProject('links');await mkdir(join(project,'nested'));await writeFile(join(project,'nested','sample.txt'),'alpha');
  const rootAlias=join(data,'selected alias');await symlink(project,rootAlias,'junction');
  assert.equal(await run(exe,['run','readset',rootAlias,'nested/sample.txt']),'refused');
  const nestedAlias=join(project,'linked');await symlink(join(project,'nested'),nestedAlias,'junction');
  for(const path of ['linked/sample.txt','linked','nested','absent.txt'])assert.equal(await run(exe,['run','readset',project,path]),'refused');
  const hard=join(project,'hard.txt');await link(join(project,'nested','sample.txt'),hard);
  assert.equal(await run(exe,['run','readset',project,'hard.txt']),'refused');await rm(hard);
  assert.equal(await run(exe,['run','readset',project,'nested/sample.txt']),'captured|1|5\r\nverified');
  await rm(rootAlias);await rm(nestedAlias);
});
test('Windows read-set enforces entry, file and aggregate byte bounds and pre-cancellation',native,async()=>{
  const {project,exe}=await readsetProject('bounds');
  assert.equal(await run(exe,['run','readset',project]),'refused');
  const paths=Array.from({length:21},(_,n)=>`file-${n}.txt`);
  for(const path of paths)await writeFile(join(project,path),'x');
  assert.equal(await run(exe,['run','readset',project,...paths.slice(0,20)]),'captured|20|20\r\nverified');
  assert.equal(await run(exe,['run','readset',project,...paths]),'refused');
  await writeFile(join(project,paths[0]),Buffer.alloc(262145));
  assert.equal(await run(exe,['run','readset',project,paths[0]]),'refused');
  for(const path of paths.slice(0,5))await writeFile(join(project,path),Buffer.alloc(262144));
  assert.equal(await run(exe,['run','readset',project,...paths.slice(0,4)]),'captured|4|1048576\r\nverified');
  assert.equal(await run(exe,['run','readset',project,...paths.slice(0,5)]),'refused');
  assert.equal(await run(exe,['run','readset-cancel',project,'missing.txt']),'cancelled');
});
test('Windows read-set refuses foreign mutation grants and pre-existing writers while allowing ordinary read sharing',native,async()=>{
  const {project,exe}=await readsetProject('access'),file=join(project,'sample.txt');await writeFile(file,'alpha');
  for(const mode of ['code-write','deny-code-write']) {
    await fixtureAcl(file,mode);assert.equal(await run(exe,['run','readset',project,'sample.txt']),'refused');
    await fixtureAcl(file,'private');
  }
  await fixtureAcl(file,'broad'); // Public read access is allowed for project data, not private scratch.
  assert.equal(await run(exe,['run','readset',project,'sample.txt']),'captured|1|5\r\nverified');
  await fixtureAcl(file,'private');
  const writer=await open(file,'r+');
  try {assert.equal(await run(exe,['run','readset',project,'sample.txt']),'refused');}finally{await writer.close();}
  assert.equal(await run(exe,['run','readset',project,'sample.txt']),'captured|1|5\r\nverified');
});
test('Windows read-set retains source and ancestor pins, permits unrelated entries and releases on cancellation',native,async()=>{
  const {project,exe}=await readsetProject('pins'),file=join(project,'sample.txt');await writeFile(file,'alpha');
  for(const mode of ['readset-hold','readset-cancel-after']) {
    const h=await readsetHolder(project,['sample.txt'],mode);
    try {
      for(const action of [()=>writeFile(file,'must-not-write'),()=>rename(file,file+'.moved'),()=>rename(project,project+'.moved')]) {
        await assert.rejects(action(),e=>['EPERM','EACCES','EBUSY'].includes(e.code));
      }
      await writeFile(join(project,'unselected.txt'),'outside-read-set');
      await finishHolder(h);assert.match(h.output(),mode==='readset-hold'?/verified/:/cancelled/);
      assert.equal(await readFile(file,'utf8'),'alpha');
    } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
    await writeFile(file,'alpha'); // Proof that failure/cancellation released its own handles.
  }
  assert.equal(await run(exe,['run','readset',project,'sample.txt']),'captured|1|5\r\nverified');
});
test('Windows read-set re-verification refuses writable-mapping changes even with restored modification time',native,async t=>{
  const {project,exe}=await readsetProject('mapping'),file=join(project,'sample.txt');await writeFile(file,'alpha');
  const outcome=await run(exe,['run','readset-mapping',project]);
  assert.ok(['changed-refused','mapping-refused'].includes(outcome));t.diagnostic(outcome);
  assert.equal(await readFile(file,'utf8'),outcome==='changed-refused'?'Xlpha':'alpha');
});
test('Windows read-set copies only captured synthetic bytes into private delete-on-close slots without changing sources',native,async()=>{
  const {project,data,exe}=await readsetProject('copy'),file=join(project,'sample.txt');await writeFile(file,'synthetic-private-content');
  const before=(await readdir(data)).sort();
  assert.equal(await run(exe,['run','readset-scratch',project,data]),'verified-copy');
  assert.equal(await readFile(file,'utf8'),'synthetic-private-content');assert.deepEqual((await readdir(data)).sort(),before);
});

async function metadataFilesAbsent(root) {
  for(const path of ['config','HEAD','index','info/exclude'])await absent(join(root,path));
}
async function emptyMetadataHierarchy(root) {
  assert.deepEqual((await readdir(root)).sort(),['info','objects','refs']);
  for(const name of ['info','objects','refs']) {
    assert.deepEqual(await readdir(join(root,name)),[]);
    await windowsStorageRequest('prepare-directory',join(root,name));
  }
}
test('Windows metadata scratch creates a fixed private layout readable only with compatible sharing and cleans it normally',native,async()=>{
  const {exe}=await setup();
  for(const mode of ['metadata','metadata-empty']) {
    const h=await scratchHolder(mode),root=h.paths[0];
    try {
      assert.deepEqual((await readdir(root)).sort(),mode==='metadata'?['HEAD','config','index','info','objects','refs']:['HEAD','config','info','objects','refs']);
      for(const path of [root,join(root,'info'),join(root,'objects'),join(root,'refs')])await windowsStorageRequest('prepare-directory',path);
      assert.equal(result(await run(exe,['run','metadata-read',root,root,mode==='metadata'?'full':'empty'])).out,'verified-layout');
      await assert.rejects(rmdir(join(root,'objects')),e=>['EPERM','EACCES','EBUSY'].includes(e.code));
      if(mode==='metadata') {
        assert.equal(result(await run(exe,['run','metadata-incompatible',root,root])).out,'reader-refused');
        await assert.rejects(writeFile(join(root,'index'),'must-not-write'),e=>['EPERM','EACCES','EBUSY'].includes(e.code));
      } else {
        await assert.rejects(access(join(root,'index')),{code:'ENOENT'});
        await assert.rejects(access(join(root,'info','exclude')),{code:'ENOENT'});
      }
      await finishHolder(h);assert.match(h.output(),/removed/);await absent(root);
    } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
  }
});
test('Windows metadata scratch enforces typed HEAD and existing 32MiB index/1MiB exclude bounds without residue',native,async()=>{
  const {data,exe}=await setup(),before=(await readdir(data)).sort();
  assert.equal(await run(exe,['run','metadata-bounds',data]),'bounded');
  assert.deepEqual((await readdir(data)).sort(),before);
});
test('Windows metadata scratch preserves unexpected known-directory content and junction targets without recursive cleanup',native,async()=>{
  const {data}=await setup(),h=await scratchHolder('metadata'),root=h.paths[0];
  try {
    await writeFile(join(root,'objects','unowned'),'preserve-unowned');
    await finishHolder(h);assert.match(h.output(),/retained-root/);await metadataFilesAbsent(root);
    assert.equal(await readFile(join(root,'objects','unowned'),'utf8'),'preserve-unowned');
    assert.deepEqual((await readdir(root)).sort(),['objects']);
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
  const outside=join(data,'metadata synthetic target');await mkdir(outside);await writeFile(join(outside,'keep'),'unchanged');
  const other=await scratchHolder('metadata'),otherRoot=other.paths[0];
  try {
    await symlink(outside,join(otherRoot,'unexpected junction'),'junction');
    await finishHolder(other);assert.match(other.output(),/retained-root/);await metadataFilesAbsent(otherRoot);
    assert.deepEqual(await readdir(otherRoot),['unexpected junction']);
    assert.equal(await readFile(join(outside,'keep'),'utf8'),'unchanged');
  } finally {if(other.child.exitCode===null){other.child.kill();await other.closed;}}
});
test('Windows metadata scratch owner death removes only owned file objects and leaves protected empty hierarchy',native,async()=>{
  const h=await scratchHolder('metadata'),root=h.paths[0];
  try {
    await finishHolder(h,true);await metadataFilesAbsent(root);await emptyMetadataHierarchy(root);
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});
test('Windows metadata scratch owner death kills its owned descendant reader before file cleanup completes',native,async()=>{
  const {data}=await setup(),marker=join(data,'metadata-job'),h=await scratchHolder('metadata-job',marker),root=h.paths[0];
  try {
    let ready=false;
    for(let i=0;i<300;i++) {
      try {await access(marker+'.reader');ready=true;break;}catch{}
      await new Promise(resolve=>setTimeout(resolve,10));
    }
    assert.ok(ready,'The descendant must actually hold an index read handle');
    await finishHolder(h,true);await dead(marker+'.root');await dead(marker+'.reader');
    await metadataFilesAbsent(root);await emptyMetadataHierarchy(root);
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});
test('Windows metadata scratch composes owned-reader cancellation with bounded empty-only cleanup',native,async()=>{
  const {data}=await setup(),marker=join(data,'metadata-cancel'),h=await scratchHolder('metadata-cancel',marker),root=h.paths[0];
  try {
    assert.equal(await h.closed,0);assert.match(h.output(),/cancelled/);
    await dead(marker+'.root');await dead(marker+'.reader');await metadataFilesAbsent(root);
    // Job termination is asynchronous; no recursive retry is inferred from
    // either normal removal or a retained empty private root.
    try {assert.deepEqual(await readdir(root),[]);}catch(e){if(e.code!=='ENOENT')throw e;}
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});
test('Windows metadata scratch reports a live unowned reader and does not claim deletion before its handle closes',native,async()=>{
  const h=await scratchHolder('metadata'),root=h.paths[0];let reader;
  try {
    reader=await open(join(root,'index'),'r');
    await finishHolder(h);assert.match(h.output(),/retained-root/);
    const bytes=Buffer.alloc(6);assert.equal((await reader.read(bytes,0,6,0)).bytesRead,6);
    assert.deepEqual([...bytes],[68,73,82,67,0,255]);
    await reader.close();reader=null;await metadataFilesAbsent(root);assert.deepEqual(await readdir(root),[]);
  } finally {if(reader)await reader.close();if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});

// Source14: explicit synthetic metadata roots only; bytes remain inside the
// compiled helper. No Git discovery, valid index parser or real user project.
let captureNumber=0;
async function captureFixture() {
  const {data,exe}=await setup(),id=++captureNumber;
  const source=join(data,`capture source ${id}`),parent=join(data,`capture parent ${id}`);
  await windowsStorageRequest('prepare-directory',source);await windowsStorageRequest('prepare-directory',parent);
  await mkdir(join(source,'info'));
  await writeFile(join(source,'index'),Buffer.from([68,73,82,67,0,255]));
  await writeFile(join(source,'info','exclude'),'synthetic-ignore\n');
  return {source,parent,exe};
}
async function captureHolder(f,selection='both',mode='capture-hold') {
  return scratchHolder(mode,undefined,['run',mode,f.source,f.parent,selection]);
}
test('Windows metadata capture retains exact source handles and composes private scratch without bridge content',native,async()=>{
  const f=await captureFixture();await writeFile(join(f.source,'config'),'unselected-config-sentinel');
  const h=await captureHolder(f),root=h.paths[0];
  try {
    assert.deepEqual(await readFile(join(root,'index')),await readFile(join(f.source,'index')));
    assert.equal(await readFile(join(root,'info','exclude'),'utf8'),'synthetic-ignore\n');
    assert.doesNotMatch(await readFile(join(root,'config'),'utf8'),/sentinel/);
    for(const path of [join(f.source,'index'),join(f.source,'info','exclude')]) {
      await assert.rejects(writeFile(path,'must-not-write'),e=>['EPERM','EACCES','EBUSY'].includes(e.code));
      await assert.rejects(rename(path,path+'.moved'),e=>['EPERM','EACCES','EBUSY'].includes(e.code));
    }
    await finishHolder(h);assert.match(h.output(),/verified-capture/);await absent(root);
    assert.deepEqual([...await readFile(join(f.source,'index'))],[68,73,82,67,0,255]);
    assert.equal(await readFile(join(f.source,'config'),'utf8'),'unselected-config-sentinel');
    await writeFile(join(f.source,'index'),'released-after-dispose');
    assert.deepEqual(await readdir(f.parent),[]);
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});
test('Windows metadata capture copies full 32MiB index and 1MiB exclude locally and refuses either oversize before scratch',native,async()=>{
  const f=await captureFixture(),index=Buffer.alloc(33554432,0xa5),exclude=Buffer.alloc(1048576,0x5a);
  index[0]=68;index[index.length-1]=255;
  await writeFile(join(f.source,'index'),index);await writeFile(join(f.source,'info','exclude'),exclude);
  const h=await captureHolder(f),root=h.paths[0];
  try {
    assert.deepEqual(await readFile(join(root,'index')),index);assert.deepEqual(await readFile(join(root,'info','exclude')),exclude);
    await finishHolder(h);assert.match(h.output(),/verified-capture/);await absent(root);
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
  for(const [path,bytes] of [[join(f.source,'index'),Buffer.alloc(33554433)],[join(f.source,'info','exclude'),Buffer.alloc(1048577)]]) {
    await writeFile(path,bytes);
    assert.equal(await run(f.exe,['run','capture',f.source,f.parent,'both']),'refused');
    assert.deepEqual(await readdir(f.parent),[]);
    await writeFile(path,path.endsWith('index')?index:exclude);
  }
});
test('Windows metadata capture selection is explicit: missing selected file refuses, omitted source is untouched',native,async()=>{
  const f=await captureFixture();await rm(join(f.source,'info','exclude'));
  assert.equal(await run(f.exe,['run','capture',f.source,f.parent,'both']),'refused');
  assert.deepEqual(await readdir(f.parent),[]);await writeFile(join(f.source,'index'),'released-on-partial-failure');
  const h=await captureHolder(f,'index'),root=h.paths[0];
  try {
    await assert.rejects(access(join(root,'info','exclude')),{code:'ENOENT'});
    await finishHolder(h);assert.match(h.output(),/verified-capture/);await absent(root);
    await assert.rejects(access(join(f.source,'info','exclude')),{code:'ENOENT'});
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});
test('Windows metadata capture refuses overlapping roots, aliases, hardlinks and junction ancestors without scratch residue',native,async()=>{
  const f=await captureFixture();
  for(const [source,parent] of [[f.source,f.source],[f.source,join(f.source,'child')],[f.source,f.source+win32.sep+'..'+win32.sep+'alias'],['\\\\synthetic-host\\share',f.parent]]) {
    assert.equal(await run(f.exe,['run','capture',source,parent,'both']),'refused');
  }
  const original=join(f.source,'index'),linked=join(f.source,'index-linked');await link(original,linked);
  assert.equal(await run(f.exe,['run','capture',f.source,f.parent,'index']),'refused');await rm(linked);
  const target=join(f.source,'info-original');await rename(join(f.source,'info'),target);
  await symlink(target,join(f.source,'info'),'junction');
  assert.equal(await run(f.exe,['run','capture',f.source,f.parent,'both']),'refused');
  assert.equal(await readFile(join(target,'exclude'),'utf8'),'synthetic-ignore\n');
  assert.deepEqual(await readdir(f.parent),[]);
});
test('Windows metadata capture refuses foreign write grants and an existing writer, without repairing source ACLs',native,async()=>{
  const f=await captureFixture(),file=join(f.source,'index');
  for(const mode of ['code-write','deny-code-write']) {
    await fixtureAcl(file,mode);assert.equal(await run(f.exe,['run','capture',f.source,f.parent,'both']),'refused');
  }
  await fixtureAcl(file,'private');
  const writer=await open(file,'r+');
  try {assert.equal(await run(f.exe,['run','capture',f.source,f.parent,'both']),'refused');}
  finally {await writer.close();}
  assert.deepEqual(await readdir(f.parent),[]);
  assert.match(await run(f.exe,['run','capture',f.source,f.parent,'both']),/verified-capture/);
});
test('Windows metadata capture cancels before IO and after capture, releases source pins and removes owned scratch',native,async()=>{
  const f=await captureFixture();
  assert.equal(await run(f.exe,['run','capture-cancel',f.source,f.parent,'both']),'cancelled');
  assert.deepEqual(await readdir(f.parent),[]);
  const h=await captureHolder(f,'both','capture-cancel-after'),root=h.paths[0];
  try {
    await finishHolder(h);assert.match(h.output(),/cancelled/);await absent(root);
    await writeFile(join(f.source,'index'),'released-on-cancel');assert.deepEqual(await readdir(f.parent),[]);
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});
test('Windows metadata capture owner death deletes owned scratch bytes and releases retained source handles',native,async()=>{
  const f=await captureFixture(),h=await captureHolder(f),root=h.paths[0];
  try {
    await finishHolder(h,true);await metadataFilesAbsent(root);await emptyMetadataHierarchy(root);
    assert.equal(await readFile(join(f.source,'info','exclude'),'utf8'),'synthetic-ignore\n');
    await writeFile(join(f.source,'index'),'released-on-owner-death');
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});

// Source15: independent fixtures encode the published format, not Git source.
// All contents/names below are synthetic. Parser outputs expose only size/hash.
function indexChecksum(prefix){return Buffer.concat([prefix,createHash('sha1').update(prefix).digest()]);}
function indexFixture(names=['sample.txt'],{mode=0o100644,flags=0,extensions=[]}={}){
  const header=Buffer.alloc(12);header.write('DIRC');header.writeUInt32BE(2,4);header.writeUInt32BE(names.length,8);
  const entries=names.map(name=>{const raw=Buffer.isBuffer(name)?name:Buffer.from(name);const b=Buffer.alloc(Math.ceil((62+raw.length+1)/8)*8);b.writeUInt32BE(mode,24);b.fill(0x11,40,60);b.writeUInt16BE(flags|raw.length,60);raw.copy(b,62);return b;});
  const ext=extensions.map(([signature,payload])=>{const h=Buffer.alloc(8);h.write(signature,0,4,'ascii');h.writeUInt32BE(payload.length,4);return Buffer.concat([h,payload]);});
  return indexChecksum(Buffer.concat([header,...entries,...ext]));
}
function indexChange(input,change){const prefix=Buffer.from(input.subarray(0,-20));change(prefix);return indexChecksum(prefix);}
const projectedResult=b=>`projected|${b.length}|${createHash('sha256').update(b).digest('hex')}`;
async function projectIndex(f,bytes,mode='index-project'){await writeFile(join(f.source,'index'),bytes);return run(f.exe,['run',mode,f.source]);}
test('Windows strict index projection accepts empty, regular Unicode and actual macOS Git-generated synthetic v2 index',native,async()=>{
  const f=await captureFixture();
  for(const names of [[],['a','docs/sample.txt','Ω.txt'],['a.c','a/b','z']]) {
    const b=indexFixture(names);assert.equal(await projectIndex(f,b),projectedResult(b));
  }
  const golden=JSON.parse(await readFile(new URL('./fixtures/git-index-v2.json',import.meta.url),'utf8'));
  const b=Buffer.from(golden.indexBase64,'base64');assert.equal(createHash('sha256').update(b).digest('hex'),golden.sha256);
  assert.equal(await projectIndex(f,b),projectedResult(b));
});
test('Windows strict index projection refuses checksum, signature, unsupported version and entry-count corruption',native,async()=>{
  const f=await captureFixture(),b=indexFixture(),badHash=Buffer.from(b);badHash[badHash.length-1]^=1;
  const cases=[Buffer.alloc(0),b.subarray(0,31),b.subarray(0,-1),badHash,indexChange(b,p=>p.write('FAIL')),indexChange(b,p=>p.writeUInt32BE(2,8))];
  for(const v of [0,1,3,4,0xffffffff])cases.push(indexChange(b,p=>p.writeUInt32BE(v,4)));
  for(const bytes of cases)assert.equal(await projectIndex(f,bytes),'refused');
});
test('Windows strict index projection refuses ambiguous flags, modes, zero object ID and invalid nanoseconds',native,async()=>{
  const f=await captureFixture();
  for(const flags of [0x1000,0x2000,0x3000,0x4000,0x8000])assert.equal(await projectIndex(f,indexFixture(['a'],{flags})),'refused');
  for(const mode of [0o120000,0o160000,0o040000,0o100600,0xffffffff])assert.equal(await projectIndex(f,indexFixture(['a'],{mode})),'refused');
  const b=indexFixture(['a']);
  for(const change of [p=>p.fill(0,52,72),p=>p.writeUInt32BE(1000000000,16),p=>p.writeUInt32BE(1000000000,24)])assert.equal(await projectIndex(f,indexChange(b,change)),'refused');
  const executable=indexFixture(['a'],{mode:0o100755});assert.equal(await projectIndex(f,executable),projectedResult(executable));
});
test('Windows strict index projection refuses malformed names, nonzero padding and invalid UTF8',native,async()=>{
  const f=await captureFixture(),b=indexFixture(['ab']);
  for(const change of [p=>p.writeUInt16BE(0,72),p=>p.writeUInt16BE(1,72),p=>p.writeUInt16BE(3,72),p=>p.writeUInt16BE(4095,72),p=>p[74]=0,p=>p[76]=1,p=>p[79]=1])assert.equal(await projectIndex(f,indexChange(b,change)),'refused');
  for(const raw of [Buffer.from([0xc0,0xaf]),Buffer.from([0xed,0xa0,0x80]),Buffer.from([0xff])])assert.equal(await projectIndex(f,indexFixture([raw])),'refused');
});
test('Windows strict index projection refuses unordered, colliding, traversal and Windows alias paths without path IO',native,async()=>{
  const f=await captureFixture();
  for(const names of [['b','a'],['a','a'],['A','a'],['a','a/b'],['A/b','a'],['/escape'],['a/../b'],['.Git/config'],['x\\y'],['C:stream'],['CON.txt'],['trailing.'],['a//b'],['a/'],['a/\u202eb'],['a/\u{e0001}b'],['a'.repeat(201)]])assert.equal(await projectIndex(f,indexFixture(names)),'refused');
});
test('Windows strict index projection strips optional extension payloads and refuses mandatory or malformed frames',native,async()=>{
  const f=await captureFixture(),plain=indexFixture(['a']);
  const optional=indexFixture(['a'],{extensions:[['TREE',Buffer.from('invalid-tree-synthetic')],['FSMN',Buffer.from([0,255])],['Zzzz',Buffer.alloc(0)]]});
  assert.equal(await projectIndex(f,optional),projectedResult(plain));
  for(const extensions of [[['link',Buffer.alloc(0)]],[['sdir',Buffer.alloc(0)]],[['nope',Buffer.alloc(0)]],[['TREE',Buffer.alloc(0)],['TREE',Buffer.alloc(0)]],Array.from({length:65},(_,n)=>['Z'+n.toString().padStart(3,'0'),Buffer.alloc(0)])])assert.equal(await projectIndex(f,indexFixture(['a'],{extensions})),'refused');
  const extra=indexFixture(['a'],{extensions:[['TREE',Buffer.from('x')]]}),start=plain.length-20;
  for(const change of [p=>p.writeUInt32BE(0xffffffff,start+4),p=>p.writeUInt32BE(2,start+4),p=>p.writeUInt32BE(0,start+4)])assert.equal(await projectIndex(f,indexChange(extra,change)),'refused');
});
test('Windows strict index projection bounds entry count, input bytes and cancellation',native,async()=>{
  const f=await captureFixture(),names=Array.from({length:10000},(_,n)=>'f'+n.toString().padStart(5,'0'));
  const accepted=indexFixture(names);assert.equal(await projectIndex(f,accepted),projectedResult(accepted));
  const plain=indexFixture(['a']),largest=indexFixture(['a'],{extensions:[['TREE',Buffer.alloc(33554432-plain.length-8)]]});
  assert.equal(largest.length,33554432);assert.equal(await projectIndex(f,largest),projectedResult(plain));
  assert.equal(await projectIndex(f,indexFixture([...names,'z'])),'refused');
  assert.equal(await projectIndex(f,Buffer.alloc(33554433)),'refused');
  assert.equal(await projectIndex(f,indexFixture(),'index-project-cancel'),'cancelled');
});
test('Windows projected metadata capture writes only verified extension-free index, retaining original source and pins',native,async()=>{
  const f=await captureFixture(),plain=indexFixture(['sample.txt']),original=indexFixture(['sample.txt'],{extensions:[['TREE',Buffer.from('synthetic-discarded')]]});
  await writeFile(join(f.source,'index'),original);
  const h=await captureHolder(f,'index','capture-projected'),root=h.paths[0];
  try {
    assert.deepEqual(await readFile(join(root,'index')),plain);assert.deepEqual(await readFile(join(f.source,'index')),original);
    await assert.rejects(writeFile(join(f.source,'index'),'must-not-write'),e=>['EPERM','EACCES','EBUSY'].includes(e.code));
    await finishHolder(h);assert.match(h.output(),/verified-capture/);await absent(root);
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
  await writeFile(join(f.source,'index'),Buffer.from('not-an-index'));
  assert.equal(await run(f.exe,['run','capture-projected',f.source,f.parent,'index']),'refused');
  assert.deepEqual(await readdir(f.parent),[]);await writeFile(join(f.source,'index'),'released-on-parser-refusal');
});
test('Windows projected metadata capture owner death removes owned projection and releases source handles',native,async()=>{
  const f=await captureFixture();await writeFile(join(f.source,'index'),indexFixture());
  const h=await captureHolder(f,'index','capture-projected'),root=h.paths[0];
  try {
    await finishHolder(h,true);await metadataFilesAbsent(root);await emptyMetadataHierarchy(root);
    await writeFile(join(f.source,'index'),'released-on-owner-death');
  } finally {if(h.child.exitCode===null){h.child.kill();await h.closed;}}
});
