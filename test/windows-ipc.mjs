// Synthetic startup trace of a copied helper; fixed stage labels only.
import {spawn} from 'node:child_process';
import {mkdtemp,readFile,writeFile,mkdir,rm,realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,win32} from 'node:path';
if(process.platform==='win32') {
 const dir=await mkdtemp(join(await realpath(tmpdir()),'mods-ipc-'));
 try {
  let script=await readFile(new URL('../src/windows/private-storage.ps1',import.meta.url),'utf8');
  script="[Console]::Error.WriteLine('stage-entered')\n"+script;
  for(const [needle,stage] of [['  $text =','stage-before-buffer'],['  Import-Module','stage-input-read'],['  $request =','stage-imported'],['  Add-Type','stage-before-compile'],['  $result =','stage-compiled'],['  [Console]::WriteLine((@{','stage-completed']])script=script.replace(needle,`  [Console]::Error.WriteLine('${stage}')\n${needle}`);
  await writeFile(join(dir,'private-storage.ps1'),script);
  await writeFile(join(dir,'PrivateStorage.cs'),await readFile(new URL('../src/windows/PrivateStorage.cs',import.meta.url)));
  const systemRoot=process.env.SystemRoot,environment={};
  for(const key of ['SystemRoot','windir','SystemDrive','ComSpec','TEMP','TMP','USERPROFILE','HOMEDRIVE','HOMEPATH','APPDATA','LOCALAPPDATA','ProgramFiles','ProgramFiles(x86)','ProgramW6432','NUMBER_OF_PROCESSORS','PROCESSOR_ARCHITECTURE','OS'])if(process.env[key]!==undefined)environment[key]=process.env[key];
  environment.PATH=win32.join(systemRoot,'System32');environment.PSModulePath=win32.join(systemRoot,'System32/WindowsPowerShell/v1.0/Modules');
  const result=await new Promise(resolve=>{
   const child=spawn(win32.join(systemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe'),['-NoLogo','-NoProfile','-NonInteractive','-File',join(dir,'private-storage.ps1')],{env:environment,stdio:['pipe','pipe','pipe'],windowsHide:true});
   let stderr='',output='',done=false;
   const timer=setTimeout(()=>{child.kill();if(!done){done=true;resolve({stderr,output,status:'deadline'});}},8000);
   child.stderr.on('data',b=>{if(stderr.length<4096)stderr+=b;});child.stdout.on('data',b=>{if(output.length<4096)output+=b;});child.stdin.on('error',()=>{});
   child.on('error',()=>{if(!done){done=true;clearTimeout(timer);resolve({stderr,output,status:'spawn-failed'});}});
   child.on('close',code=>{if(!done){done=true;clearTimeout(timer);resolve({stderr,output,status:code===0?'success':'refused'});}});
   child.stdin.end(JSON.stringify({version:1,op:'prepare-directory',path:join(dir,'private'),data:'',limit:0})+'\n');
  });
  const stages=result.stderr.match(/stage-[a-z-]+/g)??[];
  console.log(JSON.stringify({syntheticHelper:result.status,stages}));
  if(!stages.includes('stage-compiled'))process.exitCode=1;
 } finally { await rm(dir,{recursive:true,force:true}); }
}
