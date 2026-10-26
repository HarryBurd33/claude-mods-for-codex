// Optional advisory review. No command execution, permission grants, state writes,
// model calls or path discovery. Only the trusted loader may read selected config.
import { types } from 'node:util';
import { validateConfig } from './config.mjs';
import { getModDefinition } from './mods/registry.mjs';
import { validateHandlerResult } from './dispatcher.mjs';
import { assessCommandImpact, IMPACT_CATEGORIES } from './impact.mjs';

export const MAX_CALL_REVIEW_MS = 30_000;
export const MAX_CALL_REVIEW_COMMAND = 4096;
const OFF = Object.freeze({ enabled:false });
const reasons = Object.freeze({
  invalid:'Call review rejected an invalid or oversized event.',
  config:'Call review could not verify the shared hook configuration.',
  guard:'An existing configured guard denies this input. Call review cannot override it.',
  mutation:'Call review requires unchanged input. Input-mutating configurations are unsupported; review policy separately.',
  changed:'The shared hook configuration changed during review; this call is denied.',
  unavailable:'The host review form or transport is unavailable; this call is denied.',
  busy:'Another call review is pending; this call is denied without another form.',
  cancelled:'This call review was cancelled; the covered call is denied.',
  disposed:'Call review has stopped; this covered call is denied.',
  deadline:'The call-review deadline expired; this covered call is denied.',
  decline:'The review was declined; this covered call is denied.',
  cancel:'The review form was cancelled; this covered call is denied.',
  automated:'An automated reviewer cannot supply this confirmation; this call is denied.',
  confirmation:'No valid explicit confirmation was received; this covered call is denied.',
});
export function callReviewDenial(reason) {
  return {hookSpecificOutput:{hookEventName:'PreToolUse',permissionDecision:'deny',
    permissionDecisionReason:reasons[reason] ?? reasons.invalid}};
}
function record(value, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || types.isProxy(value)
      || ![Object.prototype,null].includes(Object.getPrototypeOf(value))) throw Error('Invalid call-review data');
  for (const key of Reflect.ownKeys(value)) {
    const d=Object.getOwnPropertyDescriptor(value,key);
    if (typeof key !== 'string' || !allowed.includes(key) || !d?.enumerable || !Object.hasOwn(d,'value')) throw Error('Invalid call-review data');
  }
}
function cloneData(value, limit) {
  let nodes=0, textBytes=0;
  function clone(v,depth) {
    if (++nodes>4096 || depth>16) throw Error('Invalid call-review data');
    if (typeof v === 'string') {
      textBytes+=Buffer.byteLength(v);
      if(textBytes>limit)throw Error('Invalid call-review data');
      return v;
    }
    if(v===null || typeof v==='boolean' || (typeof v==='number' && Number.isFinite(v)))return v;
    if(!v || typeof v!=='object' || types.isProxy(v))throw Error('Invalid call-review data');
    const array=Array.isArray(v);
    if(array && Object.getPrototypeOf(v)!==Array.prototype)throw Error('Invalid call-review data');
    if(!array && ![Object.prototype,null].includes(Object.getPrototypeOf(v)))throw Error('Invalid call-review data');
    const entries=[];
    for(const key of Reflect.ownKeys(v)){
      if(array && key==='length')continue;
      const d=Object.getOwnPropertyDescriptor(v,key);
      if(typeof key!=='string' || !d?.enumerable || !Object.hasOwn(d,'value'))throw Error('Invalid call-review data');
      if(array && !/^(0|[1-9][0-9]*)$/.test(key))throw Error('Invalid call-review data');
      textBytes+=Buffer.byteLength(key);
      if(textBytes>limit)throw Error('Invalid call-review data');
      entries.push([key,clone(d.value,depth+1)]);
    }
    if(array && entries.length!==v.length)throw Error('Invalid call-review data');
    return array ? entries.map(([,x])=>x) : Object.fromEntries(entries);
  }
  const result=clone(value,0);
  if(Buffer.byteLength(JSON.stringify(result))>limit)throw Error('Invalid call-review data');
  return result;
}
function freeze(value) {
  if(value && typeof value==='object'){for(const v of Object.values(value))freeze(v);Object.freeze(value);}
  return value;
}
export function validateCallReviewSettings(raw) {
  if(raw===undefined)return undefined;
  record(raw,['enabled','inputPolicy','categories','timeoutMs']);
  const v=cloneData(raw,4096);
  if(typeof v.enabled!=='boolean')throw Error('Invalid call-review selection');
  if(v.inputPolicy!==undefined && v.inputPolicy!=='unchanged-only')throw Error('Call review requires unchanged input');
  if(v.enabled && (v.inputPolicy!=='unchanged-only' || v.categories===undefined))throw Error('Select the unchanged-input profile and explicit categories');
  if(v.categories!==undefined && (!Array.isArray(v.categories) || !v.categories.length
      || v.categories.length>IMPACT_CATEGORIES.length || v.categories.some(x=>!IMPACT_CATEGORIES.includes(x))
      || new Set(v.categories).size!==v.categories.length))throw Error('Invalid call-review categories');
  if(v.timeoutMs!==undefined && (!Number.isInteger(v.timeoutMs) || v.timeoutMs<1 || v.timeoutMs>MAX_CALL_REVIEW_MS))throw Error('Invalid call-review deadline');
  return freeze({...v,...(v.enabled ? {timeoutMs:v.timeoutMs ?? MAX_CALL_REVIEW_MS} : {})});
}
function envelope(raw) {
  record(raw,['hook_event_name','tool_name','tool_input']);
  if(Object.keys(raw).length!==3 || typeof raw.hook_event_name!=='string' || typeof raw.tool_name!=='string'
     || raw.hook_event_name.length>64 || !/^[A-Za-z0-9_.:-]{1,256}$/.test(raw.tool_name))throw Error('Invalid event');
  if(raw.hook_event_name!=='PreToolUse' || raw.tool_name!=='Bash')return null;
  const event=cloneData(raw,65536),input=event.tool_input;
  if(!input || Array.isArray(input) || typeof input!=='object' || !Object.hasOwn(input,'command')
      || typeof input.command!=='string' || !input.command.trim() || input.command.length>MAX_CALL_REVIEW_COMMAND
      || Buffer.byteLength(input.command)>16384)throw Error('Invalid event');
  return freeze(event);
}
function snapshot(raw) {
  const config=freeze(validateConfig(cloneData(raw,256*1024)));
  return {config,fingerprint:JSON.stringify(config)};
}
function guard(config,event) {
  // Only these existing definitions are context-free and synchronous for PreToolUse.
  // No synthetic session/cwd/model is manufactured and no journal/state is written.
  for(const mod of config.mods){
    if(!mod.enabled)continue;
    if(!['denyGuard','blastRadiusGuard','sessionNotice','activityJournal','exactCommandRewrite'].includes(mod.type))return 'config';
    if(!['denyGuard','blastRadiusGuard'].includes(mod.type))continue;
    const result=validateHandlerResult(getModDefinition(mod.type).handle(event,mod.options),'PreToolUse');
    if(result.denyReason!==undefined)return 'guard';
    if(result.commandReplacement!==undefined)return 'mutation';
  }
  return config.mods.some(m=>m.enabled && m.type==='exactCommandRewrite') ? 'mutation' : null;
}
function confirmation(raw) {
  try {
    record(raw,['action','content','_meta']);
    const value=cloneData(raw,16384),meta=value._meta;
    if(meta!==undefined && (!meta || Array.isArray(meta) || typeof meta!=='object'))return 'confirmation';
    if(meta?.approvals_reviewer==='auto_review')return 'automated';
    if(value.action==='decline')return 'decline';
    if(value.action==='cancel')return 'cancel';
    if(value.action!=='accept')return 'confirmation';
    record(value.content,['confirm']);
    return Object.keys(value.content).length===1 && value.content.confirm===true ? null : 'confirmation';
  } catch { return 'confirmation'; }
}
function form(assessment) {
  return {mode:'form',
    message:'Claude Mods advisory call review. '+assessment.matches.map(m=>m.impact).join(' ')+
      ' Targets are unknown and lexical signals may be wrong. This reviews only unchanged input in this request; mutating hooks are unsupported. Confirming does not approve execution or certify final arguments; normal host permissions still apply. Response provenance is not human-attested.',
    requestedSchema:{type:'object',properties:{confirm:{type:'boolean',title:'Continue through normal host permissions',
      description:'I choose to continue this unchanged-input review. This is not a permission grant.'}},required:['confirm']}};
}
class Stopped extends Error { constructor(reason){super(reason);this.reason=reason;} }
export function createCallReviewer(raw, {loadHookConfig}={}) {
  const policy=validateCallReviewSettings(raw) ?? OFF;
  let active=null,disposed=false;
  return Object.freeze({
    enabled:policy.enabled===true,
    async review(rawEvent,{elicit,signal}={}) {
      if(!policy.enabled)return {};
      let event,assessment;
      try {
        event=envelope(rawEvent);if(event===null)return {};
        assessment=assessCommandImpact(event.tool_input.command,policy.categories);
        if(!assessment.matches.length)return {};
      } catch {return callReviewDenial('invalid');}
      if(disposed)return callReviewDenial('disposed');
      if(signal?.aborted)return callReviewDenial('cancelled');
      if(active)return callReviewDenial('busy');
      if(typeof elicit!=='function')return callReviewDenial('unavailable');
      if(typeof loadHookConfig!=='function')return callReviewDenial('config');
      const controller=new AbortController(),deadline=performance.now()+policy.timeoutMs;
      let timer,onAbort,finished=false,stopReason=null,resolveStop;
      const interruption=new Promise(resolve=>{resolveStop=resolve;});
      const cancel=reason=>{
        if(stopReason!==null || finished)return;
        stopReason=reason;controller.abort();resolveStop(callReviewDenial(reason));
      };
      const token={cancel};active=token;
      const check=()=>{
        if(finished)throw new Stopped('cancelled');
        if(stopReason!==null)throw new Stopped(stopReason);
        if(signal?.aborted)throw new Stopped('cancelled');
        if(performance.now()>=deadline)throw new Stopped('deadline');
      };
      try {
        onAbort=()=>cancel('cancelled');
        signal?.addEventListener('abort',onAbort,{once:true});
        timer=setTimeout(()=>cancel('deadline'),policy.timeoutMs);
        if(signal?.aborted)cancel('cancelled');
        const work=Promise.resolve().then(async()=>{
          check();
          let before;
          try {before=snapshot(await loadHookConfig({signal:controller.signal}));}
          catch {check();return callReviewDenial('config');}
          check();
          const blocked=guard(before.config,event);
          if(blocked)return callReviewDenial(blocked);
          let answer;
          const params=form(assessment);
          check();
          try {answer=await elicit(params,{signal:controller.signal});}
          catch {check();return callReviewDenial('unavailable');}
          check();
          const rejected=confirmation(answer);if(rejected)return callReviewDenial(rejected);
          check();
          let after;
          try {after=snapshot(await loadHookConfig({signal:controller.signal}));}
          catch {check();return callReviewDenial('config');}
          check();
          if(after.fingerprint!==before.fingerprint)return callReviewDenial('changed');
          const denied=guard(after.config,event);if(denied)return callReviewDenial(denied);
          check();
          return {}; // Abstention only, never allow/updatedInput/updatedPermissions.
        }).catch(error=>callReviewDenial(error instanceof Stopped ? error.reason : 'config'));
        const result=await Promise.race([work,interruption]);
        if(performance.now()>=deadline)return callReviewDenial('deadline');
        if(signal?.aborted)return callReviewDenial('cancelled');
        return result;
      } finally {
        finished=true;clearTimeout(timer);
        if(onAbort)signal?.removeEventListener('abort',onAbort);
        controller.abort();
        if(active===token)active=null;
      }
    },
    dispose(){disposed=true;active?.cancel('disposed');},
  });
}
