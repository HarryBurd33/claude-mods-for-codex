// Independent fixed-output startup diagnostic; no request/file/env values printed.
import { spawn } from 'node:child_process';
import { win32 } from 'node:path';
import { fileURLToPath } from 'node:url';
if (process.platform === 'win32') {
const root=process.env.SystemRoot,dir=win32.join(root,'System32/WindowsPowerShell/v1.0');
const minimal={SystemRoot:root,windir:root,PATH:win32.join(root,'System32'),PSModulePath:win32.join(dir,'Modules'),TEMP:process.env.TEMP,TMP:process.env.TMP};
const selected={...minimal};
for(const key of ['SystemDrive','ComSpec','USERPROFILE','HOMEDRIVE','HOMEPATH','APPDATA','LOCALAPPDATA','ProgramFiles','ProgramFiles(x86)','ProgramW6432','NUMBER_OF_PROCESSORS','PROCESSOR_ARCHITECTURE','OS'])if(process.env[key]!==undefined)selected[key]=process.env[key];
for(const [name,env] of [['minimal',minimal],['selected-os',selected],['selected-os-pipe',selected],['selected-os-file',selected],['selected-os-file-pipe',selected]]) {
  const result=await new Promise(resolve=>{
    let output='',done=false;const child=spawn(win32.join(dir,'powershell.exe'),['-NoLogo','-NoProfile','-NonInteractive',...(name.includes('-file')?['-File',fileURLToPath(new URL('./windows-entry.ps1',import.meta.url))]:['-Command',"[Console]::WriteLine('fixed-startup-ok')"])],{env,stdio:[name.endsWith('-pipe')?'pipe':'ignore','pipe','ignore'],windowsHide:true});
    if(name.endsWith('-pipe')) { child.stdin.on('error',()=>{}); child.stdin.end('\n'); }
    const timer=setTimeout(()=>{child.kill();if(!done){done=true;resolve('deadline');}},8000);
    child.stdout.on('data',b=>{output+=b;if(output.length>128)child.kill();});
    child.on('error',()=>{if(!done){done=true;clearTimeout(timer);resolve('spawn-failed');}});
    child.on('close',code=>{if(!done){done=true;clearTimeout(timer);resolve(code===0&&output.trim()==='fixed-startup-ok'?'ready':'startup-failed');}});
  });
  console.log(`${name}: ${result}`);
  if(name.startsWith('selected-os')&&result!=='ready')process.exitCode=1;
}

}
