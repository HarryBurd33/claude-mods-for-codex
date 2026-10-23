import { constants } from 'node:fs';
import { lstat,open,realpath } from 'node:fs/promises';
import { isAbsolute,resolve } from 'node:path';
import { readWindowsPrivateFile } from './windows-storage.mjs';

const MAX_BYTES=1024*1024,MAX_LINES=4096,MAX_LINE=256*1024;
const unavailable=reason=>({available:false,source:'selected-codex-exec-jsonl',reason});
function invalid(){throw new Error('Selected export has invalid or unsupported usage data');}
function counter(usage,key,required=false){
  if(!Object.hasOwn(usage,key)){if(required)invalid();return null;}
  const n=usage[key];if(!Number.isSafeInteger(n)||n<0)invalid();return n;
}
export function summarizeExecUsage(text){
  if(typeof text!=='string'||Buffer.byteLength(text)>MAX_BYTES)throw new Error('Selected export exceeds the 1 MiB limit');
  const lines=text.split('\n');if(lines.length>MAX_LINES)throw new Error('Selected export exceeds the line limit');
  let latest,threadId,completions=0,diagnosticLines=0,lastStatus='unknown';
  for(const line of lines){
    if(!line.trim())continue;
    if(Buffer.byteLength(line)>MAX_LINE)throw new Error('Selected export exceeds the line size limit');
    let event;
    try{event=JSON.parse(line);}catch{
      // A captured CLI may include stderr diagnostics. Never echo their text.
      // A broken JSON record, however, must not silently become partial usage.
      if(/^[\s]*[\[{]/.test(line)||++diagnosticLines>128)invalid();
      continue;
    }
    if(!event||typeof event!=='object'||Array.isArray(event))invalid();
    if(event.type==='thread.started'){
      if(typeof event.thread_id!=='string'||!event.thread_id||event.thread_id.length>4096)invalid();
      if(threadId!==undefined&&threadId!==event.thread_id)throw new Error('Select one thread export; concatenated threads cannot be combined');
      threadId=event.thread_id;
    }else if(event.type==='turn.started')lastStatus='unfinished';
    else if(event.type==='turn.failed'||event.type==='error')lastStatus='failed-or-error';
    else if(event.type==='turn.completed'){
      if(++completions>32)throw new Error('Selected export exceeds the completion limit');
      const u=event.usage;if(!u||typeof u!=='object'||Array.isArray(u))invalid();
      latest={inputTokens:counter(u,'input_tokens',true),outputTokens:counter(u,'output_tokens',true),cachedInputTokens:counter(u,'cached_input_tokens'),cacheWriteInputTokens:counter(u,'cache_write_input_tokens'),reasoningOutputTokens:counter(u,'reasoning_output_tokens')};
      if((latest.cachedInputTokens??0)>latest.inputTokens||(latest.reasoningOutputTokens??0)>latest.outputTokens)invalid();
      lastStatus='completed';
    }
  }
  if(!latest)return unavailable('No valid completion usage snapshot in the selected export. Missing data is not zero.');
  if(threadId===undefined)return unavailable('A single thread.started record is required to identify the selected export boundary.');
  return{available:true,source:'selected-codex-exec-jsonl',semantics:'Latest reported completion snapshot; Codex0.163.0 copies cumulative thread totals. Earlier usage may be included. Completion records are never summed.',
    counters:latest,cachedInputShare:latest.cachedInputTokens!==null&&latest.inputTokens>0?latest.cachedInputTokens/latest.inputTokens:null,
    completionRecords:completions,streamStatus:lastStatus,ignoredDiagnosticLines:diagnosticLines,
    contextOccupancy:null,exactBilling:null,cacheHealth:null,
    limits:'Explicit selected export only; not attached to this chat. Source authenticity/completeness is not attested. The host can emit default zero counters when usage was not supplied. Missing fields stay unavailable; cached share is not cache health, TTL, savings or exact cost.'};
}

export async function readSelectedUsage(input,{signal}={}){
  try{
    if(signal!==undefined&&!(signal instanceof AbortSignal))throw new Error('Invalid read signal');
    signal?.throwIfAborted();
    if(process.platform==='win32')return summarizeExecUsage(await readWindowsPrivateFile(input,MAX_BYTES,{signal}));
    if(typeof input!=='string'||!isAbsolute(input)||input.length>4096||/\p{Cc}/u.test(input))return unavailable('Select an absolute bounded private export path.');
    const path=resolve(input);if(await realpath(path)!==path)return unavailable('Select a canonical export path without links.');
    const prior=await lstat(path);
    const handle=await open(path,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
    let text;
    try{
      const stat=await handle.stat();
      if(!stat.isFile()||stat.nlink!==1||(stat.mode&0o077)||(process.getuid&&stat.uid!==process.getuid())||stat.ino!==prior.ino||stat.dev!==prior.dev)throw new Error('Selected export must be private, current-user owned and unlinked');
      if(stat.size>MAX_BYTES)throw new Error('Selected export exceeds the 1 MiB limit');
      const buffer=Buffer.alloc(MAX_BYTES+1);let total=0;
      while(total<=MAX_BYTES){const r=await handle.read(buffer,total,MAX_BYTES+1-total,total);if(!r.bytesRead)break;total+=r.bytesRead;}
      if(total>MAX_BYTES)throw new Error('Selected export exceeds the 1 MiB limit');
      text=buffer.subarray(0,total).toString('utf8');
    }finally{await handle.close();}
    return summarizeExecUsage(text);
  }catch{
    // Don't send filesystem exception paths, raw JSON, prompts or diagnostics to
    // the host/model. Troubleshoot the explicitly selected private file locally.
    return unavailable('Selected export unavailable or invalid. Check private ownership/mode, links, size and supported single-thread JSONL records. No content was returned.');
  }
}
