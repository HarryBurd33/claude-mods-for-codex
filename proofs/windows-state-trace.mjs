// Diagnostic only: three explicitly bounded rounds on fresh owned synthetic roots.
// Copied helper labels are not production telemetry, policy or acceptance tests.
import {mkdtemp,mkdir,readFile,writeFile,rm,realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const args=process.argv.slice(2);
if(args.length>1 || args.length===1 && args[0]!=='--shape-only')throw Error('Closed diagnostic mode required');
const shapeOnly=args[0]==='--shape-only';
async function source(url) {
 let value=await readFile(url,'utf8');
 if(shapeOnly)value=value.replace(/\r?\n/g,'\r\n'); // Synthetic Windows checkout shape only.
 return value.replace(/\r\n/g,'\n');
}
if(process.platform==='win32' || shapeOnly) {
 const root=await mkdtemp(join(await realpath(tmpdir()),'mods-state-trace-'));
 try {
  const code=join(root,'code');await mkdir(join(code,'windows'),{recursive:true});
  let native=await source(new URL('../src/windows/PrivateStorage.cs',import.meta.url));
  const signature='static Exception Refuse() { return new IOException("Private Windows storage unavailable"); }';
  if(native.split(signature).length!==2)throw Error('Native diagnostic shape');
  const declaration=native.indexOf(signature)+'static Exception '.length;
  const labels=[];let n=0;
  native=native.replace(/Refuse\(\)/g,(value,index)=>{
   if(index===declaration)return value;
   const label='R'+String(++n).padStart(3,'0');labels.push({label,line:native.slice(0,index).split('\n').length});
   return 'Refuse("'+label+'")';
  });
  native=native.replace(signature,'static Exception Refuse(string stage) { Console.Error.WriteLine(stage); return new IOException("Private Windows storage unavailable"); }');
  await writeFile(join(code,'windows','PrivateStorage.cs'),native);
  let ps=await source(new URL('../src/windows/private-storage.ps1',import.meta.url));
  const catcher="} catch {\n  [Console]::WriteLine('2|error')";
  if(ps.split(catcher).length!==2)throw Error('Script diagnostic shape');
  ps=ps.replace(catcher,"} catch {\n  $kind = $_.Exception.GetBaseException().GetType().Name\n  if ($kind -cin @('IOException','UnauthorizedAccessException','ArgumentException','InvalidOperationException')) { [Console]::Error.WriteLine('kind-'+$kind) }\n  else { [Console]::Error.WriteLine('kind-other') }\n  [Console]::WriteLine('2|error')");
  const compileGuard="if ($compiled.Errors.HasErrors) { throw 'Native source compilation failed' }";
  if(ps.split(compileGuard).length!==2)throw Error('Compiler diagnostic shape');
  ps=ps.replace(compileGuard,"if ($compiled.Errors.HasErrors) { foreach ($e in $compiled.Errors) { [Console]::Error.WriteLine('compile-'+$e.ErrorNumber+'-line-'+[string]$e.Line) }; throw 'Native source compilation failed' }");
  await writeFile(join(code,'windows','private-storage.ps1'),ps);
  let bridge=await source(new URL('../src/windows-storage.mjs',import.meta.url));
  for(const needle of ["stdio: ['pipe', 'pipe', 'ignore']","    let chunks = [], bytes = 0, failed = false, done = false;","      chunks = []; if (error) reject(unavailable()); else resolve(value);"])
   if(bridge.split(needle).length!==2)throw Error('Bridge diagnostic shape');
  bridge="const traceFrames=[];export function takeTraceFrames(){return traceFrames.splice(0);}\n"+bridge;
  bridge=bridge.replace("stdio: ['pipe', 'pipe', 'ignore']","stdio: ['pipe', 'pipe', 'pipe']");
  bridge=bridge.replace('    let chunks = [], bytes = 0, failed = false, done = false;',
   "    let chunks = [], bytes = 0, failed = false, done = false;\n    const traceStart=performance.now();let traceText='';\n    child.stderr.on('data',b=>{if(traceText.length<4096)traceText+=b.toString('ascii').slice(0,4096-traceText.length);});");
  bridge=bridge.replace('      chunks = []; if (error) reject(unavailable()); else resolve(value);',
   "      traceFrames.push({op,ok:!error,elapsedMs:Math.round((performance.now()-traceStart)*100)/100,labels:traceText.match(/R[0-9]{3}|compile-CS[0-9]+-line-[0-9]+|kind-(?:IOException|UnauthorizedAccessException|ArgumentException|InvalidOperationException|other)/g)??[]});\n      chunks = []; if (error) reject(unavailable()); else resolve(value);");
  await writeFile(join(code,'windows-storage.mjs'),bridge);
  if(shapeOnly)console.log(JSON.stringify({diagnosticOnly:true,syntheticCRLFShape:'prepared',callsites:labels.length,noWindowsExecution:true}));
  else {
  const {windowsStorageRequest:request,takeTraceFrames}=await import(pathToFileURL(join(code,'windows-storage.mjs')).href);
  const key='a'.repeat(64),line=Buffer.from('{"recordedAt":"2026-10-23T12:00:00.000Z","event":"SessionStart"}\n').toString('base64');
  for(let round=1;round<=3;round++) {
   const data=join(root,'round '+round);let initial='empty',count=null;
   try {const files=await request('state-read',data,{data:key});if(files.some(v=>v.length))initial='unexpected';}
   catch {initial='refused';}
   takeTraceFrames();
   const writes=await Promise.allSettled(Array.from({length:3},()=>request('state-record',data,{data:key+':'+line})));
   const outcomes=writes.map(v=>v.status==='fulfilled'?'success':'refused'),frames=takeTraceFrames();
   try {const files=await request('state-read',data,{data:key});count=files.reduce((sum,b)=>sum+b.toString('utf8').split('\n').filter(Boolean).length,0);}catch{}
   const seen=new Set(frames.flatMap(v=>v.labels));
   console.log(JSON.stringify({diagnosticOnly:true,round,initial,outcomes,storedCount:count,frames,
    callsites:labels.filter(v=>seen.has(v.label)),productionPolicyChanged:false}));
   takeTraceFrames();
  }
  }
 } finally {await rm(root,{recursive:true,force:true});}
}
