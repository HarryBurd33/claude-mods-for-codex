import { spawn } from 'node:child_process';
import { mkdtemp, realpath, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { jsonData } from './routing-contract.mjs';
import { requireInspectionAdmission, describeInspection, validateInspectionPlan } from './inspection-contract.mjs';
import { createInspectionMachine, READINESS_LIMITS as L } from './readiness-machine.mjs';
import { createReadinessFrames } from './readiness-frames.mjs';
import { syntheticInspectionPlan, INSPECTION_SCENARIOS } from './inspection-fixtures.mjs';
const PEER = fileURLToPath(new URL('./inspection-peer.mjs', import.meta.url));
const FIXED_MS = 2500;

export async function runNativeInspection(plan) {
  requireInspectionAdmission(); // Unconditional: no getter, validation, file IO or spawn.
}
export async function runNativeInspectionFromFile(path) {
  requireInspectionAdmission(); // No native transport is implemented by this entry.
}
export async function runFixedInspection(scenario = 'empty') {
  if (arguments.length > 1 || !INSPECTION_SCENARIOS.includes(scenario) || process.platform === 'win32') throw Error('Fixed inspection scenario unavailable');
  // The only cwd used by executable code is a new owned temporary directory.
  // A reviewed plan cannot redirect the fixed fixture into a selected project.
  const directory = await mkdtemp(join(await realpath(tmpdir()), 'claude mods inspection '));
  let result;
  try { result = await fixedTransport(validateInspectionPlan(syntheticInspectionPlan(directory)), scenario); }
  finally {
    // Empty-directory removal only, never recursive traversal/deletion. Leave an
    // unexpected entry or unreaped process for review rather than deleting it.
    if (result?.processReaped) {
      try { await rmdir(directory); result.temporaryDirectoryRemoved = true; }
      catch { result.temporaryDirectoryRemoved = false; result.outcome = 'review-required'; result.reason = 'transport-error'; }
    }
  }
  return result;
}

// Private fixed transport: no native branch, injected executor, plan parameter on
// the public run function, URL, caller clock, environment or launch factory.
async function fixedTransport(plan, scenario) {
  const start = performance.now(), elapsed = () => Math.trunc(performance.now() - start);
  const machine = createInspectionMachine(plan);
  let child, closed = false, spawned = false, failed = false, exitCode = null, signal = null;
  let forced = false, stopping = false, cancelled = false, cwdMatched = false, timer, cancelTimer;
  let sentBytes = 0, sentRequests = 0, settleExit;
  const exited = new Promise(r => { settleExit = r; });
  const cancel = () => { cancelled = true; machine.abort('operator-cancelled'); };
  process.on('SIGINT', cancel); process.on('SIGTERM', cancel);
  const advance = () => {
    const now = elapsed(); machine.advance(now);
    // Check the absolute wall clock on packet delivery too, before accepting a
    // buffered response after the parent event loop was blocked.
    if (now >= FIXED_MS) machine.abort('synthetic-transport-deadline');
  };
  const kill = sig => { if (!child?.pid || closed) return; try { process.kill(-child.pid, sig); } catch { /* owned group gone */ } };
  const wait = async ms => {
    let t; try { return await Promise.race([exited.then(() => closed), new Promise(r => { t = setTimeout(() => r(false), ms); })]); }
    finally { clearTimeout(t); }
  };
  const flush = () => {
    for (const item of machine.takeOutbound()) {
      if (item.domain !== 'inspection-review-draft' || item.executionAuthorized !== false || !child || closed || child.stdin.destroyed) { machine.abort('transport-error'); return; }
      if (item.rpc.method && Object.hasOwn(item.rpc, 'id') && ++sentRequests > L.requests) { machine.abort('request-limit'); return; }
      const wire = JSON.stringify(item.rpc) + '\n'; sentBytes += Buffer.byteLength(wire);
      if (sentBytes > L.outgoingBytes) { machine.abort('outgoing-limit'); return; }
      try { child.stdin.write(wire); } catch { machine.abort('transport-error'); }
    }
  };
  const frames = createReadinessFrames(packet => {
    advance();
    if (!cwdMatched) {
      if (machine.report().done) return;
      if (!packet || Object.keys(packet).join(',') !== 'fixedPeerCwd' || packet.fixedPeerCwd !== plan.spawn.cwd) { machine.abort('input-mismatch'); return; }
      cwdMatched = true; machine.start(); flush(); return;
    }
    machine.receive(packet); flush();
  }, reason => machine.abort(reason));
  try {
    child = spawn(process.execPath, [PEER, scenario], { cwd: plan.spawn.cwd, shell: false,
      env: {}, stdio: ['pipe', 'pipe', 'pipe'], detached: true, windowsHide: true });
    spawned = true;
    child.on('error', () => { failed = true; machine.abort('transport-error'); settleExit(); });
    child.on('exit', (code, sig) => { exitCode = code; signal = sig; if (!machine.report().done) machine.abort('peer-disconnected'); });
    child.on('close', () => { closed = true; frames.finish(); if (!machine.report().done) machine.abort('peer-disconnected'); settleExit(); });
    child.stdout.on('data', b => frames.push(b)); child.stderr.on('data', b => frames.push(b, true));
    child.stdin.on('error', () => { if (!stopping) machine.abort('transport-error'); });
    if (scenario === 'cancel') cancelTimer = setTimeout(cancel, 150);
    await new Promise(done => {
      const tick = () => { advance(); flush(); if (closed || failed || machine.report().done || frames.counters().framingFailed) { clearInterval(timer); done(); } };
      timer = setInterval(tick, 10); tick();
    });
  } catch { failed = true; machine.abort('transport-error'); }
  finally {
    clearInterval(timer); clearTimeout(cancelTimer); stopping = true;
    try {
      if (child && !closed) {
        child.stdin.end();
        if (!await wait(100)) { forced = true; kill('SIGTERM'); }
        if (!await wait(150)) kill('SIGKILL');
        await wait(1000);
      }
    } finally { process.removeListener('SIGINT', cancel); process.removeListener('SIGTERM', cancel); }
  }
  const reaped = spawned && closed && !failed;
  if (elapsed() >= FIXED_MS + 1250) machine.abort('outer-timeout');
  if (!reaped || exitCode !== 0 || forced || frames.counters().framingFailed) machine.abort('transport-error');
  return { ...machine.report(), transport: 'fixed-inspection-node-peer', synthetic: true,
    nativeProcessStarted: false, nativeTransportImplemented: false, inspectionAdmission: false,
    processReaped: reaped, peerExitCode: exitCode, peerSignalled: signal !== null,
    forcedTermination: forced, cancelRequested: cancelled, fixedPeerCwdMatched: cwdMatched,
    planArgvAndSpawnCwdMatched: plan.argv[2] === plan.spawn.cwd && plan.input.cwd === plan.spawn.cwd,
    temporaryDirectoryRemoved: false, ...frames.counters(), sentBytes, sentRequests };
}
export function parseInspectionArgs(argv) {
  if (!jsonData(argv) || !Array.isArray(argv)) throw Error('Inspection options refused');
  if (argv.length === 1 && argv[0] === '--describe') return { mode: 'describe' };
  if (argv.length === 1 && argv[0] === '--dry-run') return { mode: 'fixed', scenario: 'empty' };
  if (argv.length === 3 && argv[0] === '--dry-run' && argv[1] === '--scenario' && INSPECTION_SCENARIOS.includes(argv[2])) return { mode: 'fixed', scenario: argv[2] };
  if (argv.length === 3 && argv[0] === '--run' && argv[1] === '--plan' && typeof argv[2] === 'string'
    && argv[2].startsWith('/') && argv[2].length <= 4096 && !/[\x00-\x1f\x7f]/.test(argv[2])) return { mode: 'native', path: argv[2] };
  throw Error('Inspection options refused');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const a = parseInspectionArgs(process.argv.slice(2));
    const r = a.mode === 'describe' ? describeInspection() : a.mode === 'fixed' ? await runFixedInspection(a.scenario) : await runNativeInspectionFromFile(a.path);
    process.stdout.write(JSON.stringify(r, null, 2) + '\n');
    if (a.mode === 'fixed' && r.outcome !== 'observation-complete') process.exitCode = 1;
  } catch { process.stderr.write('Inspection refused; native execution remains closed.\n'); process.exitCode = 2; }
}
