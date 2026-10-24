import assert from 'node:assert/strict';
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
async function scratchHolder(mode, marker) {
  const {data,exe}=await setup();
  const child=spawn(exe,['run',mode,data,...(marker?[marker]:[])],{windowsHide:true,stdio:['pipe','pipe','pipe']});
  let text='',error='';
  const closed=new Promise((resolve,reject)=>{child.once('close',resolve);child.once('error',reject);});
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
    assert.ok(paths[0].startsWith(data+win32.sep+'owned-'));
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
