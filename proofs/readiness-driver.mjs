import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { jsonData, requireLiveAdmission } from './routing-contract.mjs';
import { validateNativePlan } from './routing-native-plan.mjs';
import { verifyNativeInputs, readNativeReview } from './routing-native-inputs.mjs';
import { createReadinessMachine, READINESS_LIMITS as L } from './readiness-machine.mjs';
import { createReadinessFrames } from './readiness-frames.mjs';
import { syntheticReadinessPlan, READINESS_SCENARIOS } from './readiness-fixtures.mjs';
import { observeProcessGroup, settleFixedFixtureGroup } from './process-group-observation.mjs';
const PEER = fileURLToPath(new URL('./readiness-peer.mjs', import.meta.url));

export async function runNativeReadiness(plan) {
  requireLiveAdmission(); // Before inspecting a plan/getter or doing any IO.
  return executeReadiness(validateNativePlan(plan), null);
}
export async function runNativeReadinessFromFile(path) {
  requireLiveAdmission(); // No file read or native executable reachable in this build.
  return runNativeReadiness(JSON.parse(await readNativeReview(path)));
}
export async function runFixedReadiness(scenario = 'empty') {
  if (typeof scenario !== 'string' || !READINESS_SCENARIOS.includes(scenario)
    || ['descendant', 'silent-descendant', 'late-packet'].includes(scenario) && process.platform === 'win32') throw Error('Fixed readiness scenario refused');
  return executeReadiness(syntheticReadinessPlan(), scenario);
}

// Shared transport is private: no public arbitrary executable/argv/URL/factory.
// Native path is dormant behind the unconditional gate above; fixed path always
// spawns this Node runtime and the fixed peer with an empty environment.
async function executeReadiness(plan, scenario) {
  const synthetic = scenario !== null, start = performance.now(), elapsed = () => Math.trunc(performance.now() - start);
  const machine = createReadinessMachine(plan);
  let child, closed = false, leaderExited = false, spawned = false, spawnFailed = false, exitCode = null, signalled = false;
  let forced = false, stopping = false, cancelled = false, timer, sentBytes = 0, sentRequests = 0;
  let cancelTimer, infrastructureFailure = false, nativeInputFailure = false;
  const cancel = () => { cancelled = true; machine.abort('operator-cancelled'); };
  process.on('SIGINT', cancel); process.on('SIGTERM', cancel);
  let settleExit;
  const exited = new Promise(r => { settleExit = r; });
  function kill(signal) {
    if (!child?.pid || closed) return;
    // A reaped leader is no longer a stable group identity. The sole exception
    // is our fixed pipe-holding leaf, which cannot detach/change its group.
    if (leaderExited && !(synthetic && scenario === 'descendant')) return;
    try { if (process.platform === 'win32') child.kill(signal); else process.kill(-child.pid, signal); }
    catch { /* Group already gone; never target an unrelated PID. */ }
  }
  async function wait(ms) {
    let t;
    try { return await Promise.race([exited.then(() => closed), new Promise(r => { t = setTimeout(() => r(false), ms); })]); }
    finally { clearTimeout(t); }
  }
  function sampleClock() {
    const now = elapsed(); machine.advance(now);
    let within = true;
    if (synthetic && now >= 4000) { machine.abort('synthetic-transport-deadline'); within = false; }
    if (now >= L.outerMs - L.softReapMs - L.hardReapMs) { machine.abort('outer-timeout'); within = false; }
    return within && !cancelled;
  }
  const canDispatch = item => {
    if (!sampleClock()) return false;
    const reason = machine.report().reason;
    return reason === null || reason === 'server-request-denied' && !Object.hasOwn(item.rpc, 'method');
  };
  function flush() {
    for (const item of machine.takeOutbound()) {
      if (!canDispatch(item)) return;
      if (item.domain !== 'readiness-review-draft' || item.executionAuthorized !== false || !child || closed || child.stdin.destroyed) {
        machine.abort('transport-error'); return;
      }
      // At most five client requests plus one denial of an unexpected server request.
      const request = item.rpc.method && Object.hasOwn(item.rpc, 'id');
      if (request && sentRequests >= L.requests) { machine.abort('request-limit'); return; }
      const wire = JSON.stringify(item.rpc) + '\n', bytes = Buffer.byteLength(wire);
      // Serialization can itself cross the deadline; count/write only after a
      // second sample. A local taken queue is not purged by machine.abort.
      if (!canDispatch(item)) return;
      if (sentBytes + bytes > L.outgoingBytes) { machine.abort('outgoing-limit'); return; }
      sentBytes += bytes; if (request) sentRequests++;
      try { child.stdin.write(wire); } catch { machine.abort('transport-error'); }
    }
  }
  const frames = createReadinessFrames(p => { if (!sampleClock()) return; machine.receive(p); flush(); }, reason => machine.abort(reason));
  try {
    if (!synthetic) {
      try { await verifyNativeInputs(plan); } catch { nativeInputFailure = true; machine.abort('input-mismatch'); }
      // Selected regular-file reads are bounded, but OS stalls are not a hard
      // real-time guarantee. Never spawn after late verification or cancellation.
      if (elapsed() >= L.requestMs) machine.abort('request-timeout');
    }
    if (!machine.report().done && !cancelled) {
      try {
        child = synthetic
          ? spawn(process.execPath, [PEER, scenario], { stdio: ['pipe', 'pipe', 'pipe'], env: {},
            detached: process.platform !== 'win32', windowsHide: true })
          : spawn(plan.input.cliPath, plan.argv, { stdio: ['pipe', 'pipe', 'pipe'], detached: true, windowsHide: true });
        spawned = true;
      } catch { spawnFailed = true; closed = true; infrastructureFailure = true; settleExit(); machine.abort('transport-error'); }
      if (child) {
        child.on('error', () => { spawnFailed = true; infrastructureFailure = true; machine.abort('transport-error'); settleExit(); });
        child.on('exit', (code, signal) => { leaderExited = true; exitCode = code; signalled = signal !== null;
          if (!machine.report().done) machine.abort('peer-disconnected'); });
        child.on('close', () => { closed = true; frames.finish();
          if (!machine.report().done) machine.abort('peer-disconnected'); settleExit(); });
        child.stdout.on('data', b => frames.push(b)); child.stderr.on('data', b => frames.push(b, true));
        child.stdin.on('error', () => { if (!stopping) machine.abort('transport-error'); });
        machine.start(); flush();
        if (synthetic && scenario === 'cancel') cancelTimer = setTimeout(cancel, 100);
        await new Promise(done => {
          const tick = () => {
            sampleClock();
            flush();
            if (closed || spawnFailed || machine.report().done || frames.counters().framingFailed) {
              clearInterval(timer); done();
            }
          };
          timer = setInterval(tick, 10); tick();
        });
      }
    }
  } catch { infrastructureFailure = true; machine.abort('driver-error'); }
  finally {
    clearInterval(timer); clearTimeout(cancelTimer); stopping = true;
    try {
      if (child && !closed) {
        child.stdin.end();
        if (!await wait(100)) { forced = true; kill('SIGTERM'); }
        if (!await wait(synthetic ? 150 : L.softReapMs)) kill('SIGKILL');
        await wait(synthetic ? 1000 : L.hardReapMs);
      }
    } finally { process.removeListener('SIGINT', cancel); process.removeListener('SIGTERM', cancel); }
  }
  const reaped = spawned && closed && !spawnFailed;
  const processGroupStatus = reaped ? observeProcessGroup(child.pid) : 'unavailable';
  const fixtureGroupGoneObserved = synthetic && scenario === 'silent-descendant' && reaped
    ? await settleFixedFixtureGroup(child.pid) : null;
  if (process.platform !== 'win32' && processGroupStatus !== 'absent-at-probe') machine.abort('descendants-unresolved');
  sampleClock();
  if (!reaped || exitCode !== 0 || forced || infrastructureFailure || frames.counters().framingFailed) machine.abort('transport-error');
  return { ...machine.report(), transport: synthetic ? 'fixed-synthetic-readiness-peer' : 'dormant-native-readiness',
    synthetic, nativeProcessStarted: !synthetic && spawned, nativeInputFailure, processReaped: reaped,
    peerExitCode: exitCode, peerSignalled: signalled, forcedTermination: forced, cancelRequested: cancelled,
    processGroupStatus, fixtureGroupGoneObserved, allDescendantsVerified: false,
    ...frames.counters(), sentBytes, sentRequests };
}
export function parseReadinessArgs(argv) {
  if (!jsonData(argv) || !Array.isArray(argv)) throw Error('Readiness options refused');
  if (argv.length === 1 && argv[0] === '--describe') return { mode: 'describe' };
  if (argv.length === 1 && argv[0] === '--dry-run') return { mode: 'dry', scenario: 'empty' };
  if (argv.length === 3 && argv[0] === '--dry-run' && argv[1] === '--scenario' && READINESS_SCENARIOS.includes(argv[2])) return { mode: 'dry', scenario: argv[2] };
  if (argv.length === 3 && argv[0] === '--run' && argv[1] === '--plan' && typeof argv[2] === 'string'
    && argv[2].startsWith('/') && argv[2].length <= 4096 && !/[\x00-\x1f\x7f]/.test(argv[2])) return { mode: 'native', path: argv[2] };
  throw Error('Readiness options refused');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const a = parseReadinessArgs(process.argv.slice(2));
    const r = a.mode === 'describe' ? { mode: 'readiness-inspector', executionAuthorized: false, liveAdmission: false,
      nativeInspectionVerified: false, fixedPeerAvailable: true } : a.mode === 'dry' ? await runFixedReadiness(a.scenario)
      : await runNativeReadinessFromFile(a.path);
    process.stdout.write(JSON.stringify(r, null, 2) + '\n');
    if (a.mode === 'dry' && r.outcome !== 'observation-complete') process.exitCode = 1;
  } catch { process.stderr.write('Readiness inspector refused; native execution remains closed.\n'); process.exitCode = 2; }
}
