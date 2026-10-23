import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, readdir, writeFile, cp, link, symlink, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, win32 } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { windowsHookProjectMatches } from '../src/windows-hook.mjs';
import { validateWindowsPrivatePath, windowsStorageRequest, readWindowsPrivateFile, parseWindowsStorageResponse } from '../src/windows-storage.mjs';
import { appendJournalEntry, prepareDataDirectory, readJournalEntries } from '../src/journal.mjs';

const native = { skip: process.platform !== 'win32' };
const fixtureScript = fileURLToPath(new URL('./windows-fixtures.ps1', import.meta.url));
const fixedRecord = Buffer.from('{"recordedAt":"2026-10-23T12:00:00.000Z","event":"SessionStart"}\n').toString('base64');
async function directory(t) {
  const root = await mkdtemp(join(await realpath(tmpdir()), 'mods-windows-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const data = join(root, 'private data Ω🚀');
  await windowsStorageRequest('prepare-directory', data);
  return { root, data };
}
async function acl(path, mode = 'private') {
  const exe = win32.join(process.env.SystemRoot, 'System32/WindowsPowerShell/v1.0/powershell.exe');
  await new Promise((resolve, reject) => {
    const child = spawn(exe, ['-NoLogo','-NoProfile','-NonInteractive','-File',fixtureScript], { windowsHide:true, stdio:['pipe','pipe','ignore'] });
    let output=''; const timer=setTimeout(()=>{child.kill();reject(new Error('Synthetic ACL fixture deadline'));},10000);
    child.stdout.on('data', c=>{output+=c;}); child.on('error',reject);
    child.on('close', code=>{clearTimeout(timer);code===0 && output.trim()==='fixture-ready'?resolve():reject(new Error('Synthetic ACL fixture failed'));});
    child.stdin.end(JSON.stringify({path,mode}).replace(/[^\x00-\x7f]/g,c=>`\\u${c.charCodeAt(0).toString(16).padStart(4,'0')}`)+'\n');
  });
}

test('Windows private path contract rejects namespaces, aliases, streams and reserved devices', () => {
  for(const path of ['x','C:relative','\\\\server\\share\\file','\\\\?\\C:\\file','C:\\file:stream','C:\\a\\..\\b','C:\\a.\\b','C:\\a \\b','C:\\CON.txt','C:\\COM¹.txt','C:\\a\\','C:\\a/b','C:\\a\u202eb']) {
    assert.throws(()=>validateWindowsPrivatePath(path), /Private Windows storage unavailable/);
  }
  assert.equal(validateWindowsPrivatePath('C:\\selected data\\Ω.json'),'C:\\selected data\\Ω.json');
});

test('Windows legacy journal refuses before any filesystem effects until candidate is integrated', native, async t => {
  const root=await mkdtemp(join(tmpdir(),'mods-refusal-'));t.after(()=>rm(root,{recursive:true,force:true}));
  const path=join(root,'absent');
  await assert.rejects(prepareDataDirectory(path),/Windows journal storage/);
  await assert.rejects(appendJournalEntry(path,{event:'SessionStart'}),/Windows journal storage/);
  await assert.rejects(readJournalEntries(path),/Windows journal storage/);
  assert.deepEqual(await readdir(root),[]);
});

test('native Windows private reader accepts protected current-user NTFS file without writes',native,async t=>{
  const {data}=await directory(t),file=join(data,'settings.json');
  await writeFile(file,'{"synthetic":true}');await acl(file);
  const before=await readdir(data);
  assert.equal(await readWindowsPrivateFile(file,16384),'{"synthetic":true}');
  assert.deepEqual(await readdir(data),before);
  assert.equal(await readFile(file,'utf8'),'{"synthetic":true}');
  await assert.rejects(readWindowsPrivateFile(file,2),/Private Windows/);
});

test('native Windows private reader rejects broad grants, inherited ACL, and broad allow despite deny',native,async t=>{
  const {data}=await directory(t),file=join(data,'synthetic.txt');await writeFile(file,'synthetic');
  for(const mode of ['broad','deny-and-broad','inherited']) {
    await acl(file,mode);await assert.rejects(readWindowsPrivateFile(file,100),/Private Windows/);
    await acl(file,'private');assert.equal(await readFile(file,'utf8'),'synthetic');
  }
});

test('native Windows private reader rejects a non-current owner',native,async t=>{
  const {data}=await directory(t),file=join(data,'owner.txt');await writeFile(file,'keep');
  await acl(file,'wrong-owner');await assert.rejects(readWindowsPrivateFile(file,100),/Private Windows/);
  assert.equal(await readFile(file,'utf8'),'keep');
});

test('native Windows private reader refuses hardlinks and junction ancestors',native,async t=>{
  const {root,data}=await directory(t),file=join(data,'file.txt');await writeFile(file,'keep');await acl(file);
  const linked=join(data,'hard.txt');await link(file,linked);
  await assert.rejects(readWindowsPrivateFile(file,100),/Private Windows/);await rm(linked);
  const junction=join(root,'junction');await symlink(data,junction,'junction');
  await assert.rejects(readWindowsPrivateFile(join(junction,'file.txt'),100),/Private Windows/);
  assert.equal(await readFile(file,'utf8'),'keep');
});

test('native Windows journal candidate appends, serializes processes and reports without writes',native,async t=>{
  const {data}=await directory(t);
  await Promise.all(Array.from({length:4},()=>windowsStorageRequest('journal-append',data,{data:fixedRecord})));
  const before=await readdir(data);
  const files=await windowsStorageRequest('journal-read',data);
  assert.equal(files.map(b=>b.toString('utf8')).join('').trim().split('\n').length,4);
  assert.deepEqual(await readdir(data),before);
  assert.deepEqual(before,['activity.jsonl']);
});

test('native Windows journal candidate bounds retained files and refuses unsafe archive rotation',native,async t=>{
  const {data}=await directory(t),current=join(data,'activity.jsonl'),archive=join(data,'activity.previous.jsonl');
  const line=Buffer.from(fixedRecord,'base64');
  await writeFile(current,Buffer.concat([Buffer.alloc(1048576-line.length,32),line]));await acl(current);
  await windowsStorageRequest('journal-append',data,{data:fixedRecord});
  assert.equal((await readFile(archive)).length,1048576);assert.equal((await readFile(current)).length,line.length);
  await writeFile(current,Buffer.alloc(1048576,32));await acl(current);await acl(archive,'broad');
  await assert.rejects(windowsStorageRequest('journal-append',data,{data:fixedRecord}),/Private Windows/);
  assert.equal((await readFile(current)).length,1048576);assert.equal((await readFile(archive)).length,1048576);
});

test('native Windows journal candidate refuses an existing lock without removing it and read creates nothing',native,async t=>{
  const {data}=await directory(t),lock=join(data,'.activity-journal.lock');
  assert.deepEqual((await windowsStorageRequest('journal-read',data)).map(b=>b.length),[0,0]);
  assert.deepEqual(await readdir(data),[]);
  await windowsStorageRequest('prepare-directory',lock);
  await assert.rejects(windowsStorageRequest('journal-append',data,{data:fixedRecord}),/Private Windows/);
  await assert.rejects(windowsStorageRequest('journal-read',data),/Private Windows/);
  assert.deepEqual(await readdir(data),['.activity-journal.lock']);
});


test('native Windows private reader rejects a null DACL and mutable ancestor',native,async t=>{
  const {data}=await directory(t),file=join(data,'null.txt');await writeFile(file,'keep');
  await acl(file,'null');await assert.rejects(readWindowsPrivateFile(file,100),/Private Windows/);
  await acl(file,'private');assert.equal(await readFile(file,'utf8'),'keep');
  await acl(data,'ancestor');await assert.rejects(readWindowsPrivateFile(file,100),/Private Windows/);
  await acl(data,'private');assert.equal(await readFile(file,'utf8'),'keep');
});


test('native Windows owned-process deadline simulation kills helper and child tree',{...native,timeout:30000},async t=>{
  const root=await mkdtemp(join(tmpdir(),'mods-timeout-'));t.after(()=>rm(root,{recursive:true,force:true}));
  const runtime=await readFile(new URL('../src/windows-storage.mjs',import.meta.url),'utf8');
  await writeFile(join(root,'windows-storage.mjs'),runtime);await mkdir(join(root,'windows'));
  await writeFile(join(root,'windows/private-storage.ps1'),`
$ErrorActionPreference = 'Stop'
$info = [System.Diagnostics.ProcessStartInfo]::new()
$info.FileName = [System.IO.Path]::Combine($PSHOME,'powershell.exe')
$info.Arguments = '-NoLogo -NoProfile -NonInteractive -Command "[System.Threading.Thread]::Sleep(60000)"'
$info.UseShellExecute = $false
$info.CreateNoWindow = $true
$child = [System.Diagnostics.Process]::Start($info)
[System.IO.File]::WriteAllText([System.IO.Path]::Combine($PSScriptRoot,'child.pid'),[string]$child.Id)
[System.Threading.Thread]::Sleep(60000)
`);
  const candidate=await import(pathToFileURL(join(root,'windows-storage.mjs')).href);
  const start=performance.now();
  await assert.rejects(candidate.windowsStorageRequest('private-read',join(root,'synthetic.txt'),{limit:10}),/Private Windows/);
  assert.ok(performance.now()-start>=14000);assert.ok(performance.now()-start<23000);
  const pid=Number(await readFile(join(root,'windows/child.pid'),'utf8'));assert.ok(Number.isInteger(pid)&&pid>0);
  assert.throws(()=>process.kill(pid,0),{code:'ESRCH'});
});


test('native Windows scoped candidate isolates sessions, preserves concurrent records and prunes only exact unchanged scope',native,async t=>{
  const {data}=await directory(t),one='1'.repeat(64),two='2'.repeat(64);
  const state=join(data,'metadata-state-v1');
  assert.deepEqual((await windowsStorageRequest('state-read',data,{data:one})).map(b=>b.length),[0,0]);
  assert.deepEqual(await readdir(data),[]);
  await assert.doesNotReject(windowsStorageRequest('state-record',data,{data:one+':'+fixedRecord}),'first synthetic state record');
  await assert.doesNotReject(Promise.all(Array.from({length:3},()=>windowsStorageRequest('state-record',data,{data:one+':'+fixedRecord}))),'concurrent synthetic state records');
  await windowsStorageRequest('state-record',data,{data:two+':'+fixedRecord});
  const first=await windowsStorageRequest('state-read',data,{data:one});
  assert.equal(first[1].toString('utf8').trim().split('\n').length,4);
  assert.equal((await windowsStorageRequest('state-read',data,{data:two}))[1].toString('utf8').trim().split('\n').length,1);
  assert.deepEqual(JSON.parse((await windowsStorageRequest('state-list',data))[0]),[one,two]);
  await assert.rejects(windowsStorageRequest('state-prune',data,{data:one+':'+ '0'.repeat(64)}),/Private Windows/);
  assert.equal((await readFile(join(state,one,'activity.jsonl'),'utf8')).trim().split('\n').length,4);
  const hash=createHash('sha256').update(first[0]).update(Buffer.from([0])).update(first[1]).digest('hex');
  await windowsStorageRequest('state-prune',data,{data:one+':'+hash});
  assert.deepEqual(await readdir(state),[two]);
  assert.equal((await windowsStorageRequest('state-read',data,{data:two}))[1].toString('utf8').trim().split('\n').length,1);
});


test('Windows hook scope predicate is exact, explicit and never infers a child or case alias',()=>{
  assert.equal(windowsHookProjectMatches('C:\\project','C:\\project'),true);
  for(const [cwd,selected] of [['C:\\project\\child','C:\\project'],['C:\\other','C:\\project'],['c:\\project','C:\\project'],['C:\\project',undefined],['\\\\server\\share','C:\\project']])assert.equal(windowsHookProjectMatches(cwd,selected),false);
});

test('native Windows candidate shares a short telemetry budget and mismatched scope has no effects',{...native,timeout:15000},async t=>{
  const root=await mkdtemp(join(await realpath(tmpdir()),'mods-budget-'));t.after(()=>rm(root,{recursive:true,force:true}));
  const source=join(root,'src');await cp(new URL('../src/',import.meta.url),source,{recursive:true});
  const project=join(root,'project'),data=join(root,'data');await mkdir(project);
  const spy=join(source,'windows/starts.txt');
  await writeFile(join(source,'windows/private-storage.ps1'),`
[System.IO.File]::AppendAllText([System.IO.Path]::Combine($PSScriptRoot,'starts.txt'),"started"+[Environment]::NewLine)
[System.Threading.Thread]::Sleep(60000)
`);
  const module=await import(pathToFileURL(join(source,'windows-hook.mjs')).href);
  const base={projectRoot:project,dataDirectory:data,journal:{event:'PreToolUse',tool:'Bash',decision:'deny'},stateMetadata:{event:'PreToolUse',tool:'Bash',decision:'deny'},stateScope:'project'};
  for(const cwd of [join(project,'child'),join(root,'other')]) {
    assert.deepEqual(await module.writeWindowsHookMetadata({...base,event:{cwd,session_id:'synthetic'}}),{journal:'unavailable',state:'unavailable'});
  }
  assert.deepEqual((await readdir(join(source,'windows'))).sort(),['PrivateStorage.cs','private-storage.ps1']);
  const start=performance.now();
  assert.deepEqual(await module.writeWindowsHookMetadata({...base,event:{cwd:project,session_id:'synthetic'}}),{journal:'unavailable',state:'unavailable'});
  assert.ok(performance.now()-start<2600,'telemetry must leave time for the native five-second guard response');
  const starts=await readFile(spy,'utf8').catch(e=>{if(e.code==='ENOENT')return '';throw e;});
  assert.ok(starts.trim()?starts.trim().split('\n').length===1:true,'second telemetry lane must not get a new budget');
  assert.deepEqual((await readdir(root)).sort(),['project','src']);
});


test('Windows private bridge rejects malformed, mismatched, noncanonical, oversized and non-ASCII responses',()=>{
  assert.equal(parseWindowsStorageResponse(Buffer.from('2|ok|1|YWJj\r\n'),'private-read',3)[0].toString(),'abc');
  assert.deepEqual(parseWindowsStorageResponse(Buffer.from('2|ok|2||'),'journal-read').map(b=>b.length),[0,0]);
  for(const [value,op,limit] of [['1|ok|0|','journal-append',0],['2|ok|0|','private-read',10],['2|ok|1|YR==','private-read',10],['2|ok|1|YWJj|extra','private-read',10],['2|ok|1|YWJj','private-read',2],['2|ok|0|YWJj','journal-append',0],['2|error','private-read',10],['{"ok":true}','private-read',10],['2|ok|0|','unknown',0]])assert.throws(()=>parseWindowsStorageResponse(Buffer.from(value),op,limit),/Private Windows/);
  assert.throws(()=>parseWindowsStorageResponse(Buffer.concat([Buffer.from([0x82]),Buffer.from('|ok|0|')]),'journal-append'),/Private Windows/);
  assert.throws(()=>parseWindowsStorageResponse(Buffer.alloc(3*1024*1024+1),'journal-append'),/Private Windows/);
});
