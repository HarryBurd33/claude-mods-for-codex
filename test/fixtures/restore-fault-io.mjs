// Test-only. No product API/seam or copied restore algorithm. Installed only in
// one fixed fixture child; every unrelated handle is returned unchanged.
import fs from 'node:fs/promises';
import { constants } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';

export const restoreFaultCases = Object.freeze(['control','short-writes','zero-progress',
  'partial-error','truncate-error','sync-error','recovery-error','interrupt']);
export function selectedHandleFaults(target, identity, scenario, prefixBarrier) {
  if (!restoreFaultCases.includes(scenario)) throw Error('Unknown fixed restore scenario');
  const originalOpen = fs.open;
  const trace = { selectedHandles:0, writes:0, truncates:0, syncs:0, prefixWrites:0,
    shortWrites:0, recoveryWrites:0, faults:[] };
  let recovery=false;
  const fault = (phase,code) => {
    recovery=true; trace.faults.push(phase);
    return Object.assign(Error('Injected selected fixture operation failure'),{code});
  };
  fs.open = async function(path,flags,...rest) {
    const handle = await originalOpen.call(this,path,flags,...rest);
    if (path !== target || typeof flags !== 'number' || !(flags & constants.O_RDWR)) return handle;
    const info = await handle.stat();
    if (info.ino !== identity.ino || info.dev !== identity.dev) {
      await handle.close(); throw Error('Fixture selected handle identity mismatch');
    }
    trace.selectedHandles++;
    const write=handle.write.bind(handle),truncate=handle.truncate.bind(handle),sync=handle.sync.bind(handle);
    handle.write = async function(buffer,offset,length,position) {
      if (!Buffer.isBuffer(buffer) || ![offset,length,position].every(Number.isInteger)
          || length<0 || length>4096) throw Error('Unexpected fixture write signature');
      trace.writes++;
      if (recovery) trace.recoveryWrites++;
      if (scenario==='zero-progress' && trace.writes===1) {
        recovery=true;trace.faults.push('zero-progress');return {bytesWritten:0,buffer};
      }
      if (['partial-error','recovery-error'].includes(scenario) && trace.writes===2) throw fault('target-write','EIO');
      if (scenario==='recovery-error' && trace.writes===3) throw fault('recovery-write','ENOSPC');
      if (['partial-error','recovery-error','interrupt'].includes(scenario) && trace.writes===1) {
        const result=await write(buffer,offset,Math.min(8,length),position);
        if (result.bytesWritten!==Math.min(8,length)) throw Error('Fixture prefix did not complete');
        trace.prefixWrites++;
        if (scenario==='interrupt') await prefixBarrier(trace);
        return result;
      }
      if (scenario==='short-writes') {
        const result=await write(buffer,offset,Math.min(8,length),position);
        trace.shortWrites++;return result;
      }
      return write(buffer,offset,length,position);
    };
    handle.truncate = async function(length) {
      trace.truncates++;
      if (scenario==='truncate-error' && trace.truncates===1) throw fault('target-truncate','ENOSPC');
      return truncate(length);
    };
    handle.sync = async function() {
      trace.syncs++;
      if (scenario==='sync-error' && trace.syncs===1) throw fault('target-sync','EIO');
      return sync();
    };
    return handle;
  };
  syncBuiltinESMExports();
  return {trace,dispose(){fs.open=originalOpen;syncBuiltinESMExports();}};
}
