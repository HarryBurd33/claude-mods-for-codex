// Test-only ownership of explicitly spawned disposable fixtures. No PID adoption.
import childProcess from 'node:child_process';
import { AsyncLocalStorage } from 'node:async_hooks';
import { syncBuiltinESMExports } from 'node:module';
const nativeSpawn=childProcess.spawn;
import { performance } from 'node:perf_hooks';

export class OwnedFixtureScope {
  children = new Set();
  context = new AsyncLocalStorage();
  writes = new Set();
  unresolved = false;
  check(signal) {
    if(this.unresolved)throw new Error('Owned fixture stopped: unresolved work');
    for(let frame=this.context.getStore();frame;frame=frame.parent) {
      if(frame.closed){this.unresolved=true;throw new Error('Owned fixture operation already closed');}
    }
    signal?.throwIfAborted();
  }
  trackExternalSpawns() {
    // Only installed by the isolated Windows test file, restored in its after hook.
    // Named ESM imports in the unchanged storage transport see the same wrapper.
    const prior=childProcess.spawn,wrapped=(...args)=>this.spawn(...args);
    childProcess.spawn=wrapped;syncBuiltinESMExports();
    return ()=>{
      if(childProcess.spawn!==wrapped){this.unresolved=true;throw new Error('Fixture spawn interception changed');}
      childProcess.spawn=prior;syncBuiltinESMExports();
    };
  }
  async externalIO(signal,operation) {
    this.check(signal);
    const frame={seen:new Set(),parent:this.context.getStore(),closed:false,pending:new Set()};
    return this.context.run(frame,async()=>{
      let value,failure;
      try {value=await this.io(signal,operation);}catch(error){failure=error;}
      finally {frame.closed=true;}
      if([...frame.seen].some(child=>this.children.has(child)) || frame.pending.size) {
        this.unresolved=true;
        const uncertain=new Error('Storage helper close unresolved');
        failure=failure?new AggregateError([failure,uncertain],'Storage operation and close failed'):uncertain;
      }
      if(failure)throw failure;return value;
    });
  }

  async io(signal, operation) {
    this.check(signal);
    const pending = Promise.resolve().then(operation);
    this.writes.add(pending);
    const frames=[];for(let f=this.context.getStore();f;f=f.parent){f.pending.add(pending);frames.push(f);}
    try { const value = await pending; this.check(signal); return value; }
    finally { this.writes.delete(pending); for(const f of frames)f.pending.delete(pending); }
  }
  assertCleanupSafe() {
    if (this.unresolved || this.children.size || this.writes.size)
      throw new Error('Owned fixture cleanup refused: unresolved child or IO');
  }
  spawn(executable, args, options) {
    this.check();
    let child;
    try {child=nativeSpawn(executable,args,options);}
    catch(error){this.unresolved=true;throw error;}
    this.children.add(child);
    for(let frame=this.context.getStore();frame;frame=frame.parent)frame.seen.add(child);
    child.once('close', () => this.children.delete(child));
    return child;
  }
  start(executable, args, {signal, lifetimeMs=20000, readyMs=null,
    stdoutLimit=32768, stderrLimit=8192, onDiagnostic, ...options}={}) {
    this.check(signal);
    const child=this.spawn(executable,args,{windowsHide:true,stdio:['ignore','pipe','pipe'],...options});
    const end=performance.now()+lifetimeMs;
    let output='',errors='',failure,closed=false,settled=false,ready=false;
    let finish,failFinish,first,failFirst,reconcileTimer,readyTimer;
    const completion=new Promise((resolve,reject)=>{finish=resolve;failFinish=reject;});
    const firstLine=new Promise((resolve,reject)=>{first=resolve;failFirst=reject;});
    completion.catch(()=>{});firstLine.catch(()=>{});
    const clear=()=>{clearTimeout(timer);clearTimeout(readyTimer);clearTimeout(reconcileTimer);signal?.removeEventListener('abort',abort);};
    const settle=(value,error)=>{
      if(settled)return;settled=true;clear();
      try {if(onDiagnostic)onDiagnostic(errors);}
      catch(diagnosticError){error=error?new AggregateError([error,diagnosticError],'Child and diagnostics failed'):diagnosticError;}
      if(error)failFinish(error);else finish(value);
    };
    const stop=error=>{
      if(failure || settled)return;
      failure=error;failFirst(error);
      if(closed){settle(null,error);return;}
      try {child.kill();}catch{}
      // Reconcile only within the original lifetime, never an unlimited wait.
      reconcileTimer=setTimeout(()=>{
        if(!closed){this.unresolved=true;settle(null,new Error('Owned child close unresolved'));}
      },Math.max(0,Math.min(1000,end-performance.now())));
    };
    const abort=()=>stop(new Error('Owned child aborted'));
    const timer=setTimeout(()=>stop(new Error('Proof harness deadline')),lifetimeMs);
    if(readyMs!==null)readyTimer=setTimeout(()=>stop(new Error('Synthetic content readiness deadline')),readyMs);
    signal?.addEventListener('abort',abort,{once:true});
    child.stdin?.on('error',()=>stop(new Error('Owned child stdin failed')));
    child.stdout.setEncoding('utf8');child.stderr.setEncoding('utf8');
    child.stdout.on('data',value=>{
      if(failure)return;
      if(Buffer.byteLength(output)+Buffer.byteLength(value)>stdoutLimit){stop(new Error('Owned child output bound'));return;}
      output+=value;
      if(!ready && output.includes('\n')){ready=true;clearTimeout(readyTimer);first(output.split(/\r?\n/)[0]);}
    });
    child.stderr.on('data',value=>{
      if(failure)return;
      if(Buffer.byteLength(errors)+Buffer.byteLength(value)>stderrLimit){stop(new Error('Owned child error bound'));return;}
      errors+=value;
    });
    child.once('error',()=>stop(new Error('Owned child spawn failed')));
    child.once('close',(code,exitSignal)=>{
      closed=true;
      if(!ready)failFirst(new Error('Owned child closed before readiness'));
      settle({code,signal:exitSignal},failure);
    });
    // Covers an abort that raced between the preflight and listener registration.
    if(signal?.aborted)abort();
    return {child,completion,firstLine,stop,hasClosed:()=>closed,
      output:()=>output,error:()=>errors,check:()=>this.check(signal)};
  }
  async run(executable,args,{onDiagnostic,...options}={}) {
    const h=this.start(executable,args,options);let value,failure;
    try {
      const r=await h.completion;h.check();
      if(r.code!==0)throw new Error('Public proof failed: '+r.code+': '+h.output()+': '+h.error());
      value=h.output().trim();
    } catch(error){failure=error;}
    try {if(onDiagnostic)onDiagnostic(h.error());}
    catch(error){failure=failure?new AggregateError([failure,error],'Proof and diagnostics failed'):error;}
    if(failure)throw failure;return value;
  }
}
