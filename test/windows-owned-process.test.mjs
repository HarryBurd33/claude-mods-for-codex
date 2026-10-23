import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, rmdir, access, realpath, mkdir, copyFile, symlink, link } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, win32 } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { windowsStorageRequest } from '../src/windows-storage.mjs';

// Real Windows OS tests only. No mocked paths, model calls, Codex installation,
// production API integration, project traversal or executable-trust claim.
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
