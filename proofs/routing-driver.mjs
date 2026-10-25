import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { createRoutingMachine } from './routing-machine.mjs';
import { createRoutingFrames } from './routing-frames.mjs';
import { SCENARIOS } from './routing-fixtures.mjs';

// Only this fixed reviewed local peer is reachable. No CLI path/URL/config/model/
// cwd/authorization/transport option exists. Environment is NOT inherited by peer.
const PEER = fileURLToPath(new URL('./routing-peer.mjs', import.meta.url));
export function parseRoutingArgs(argv) {
  if (!Array.isArray(argv) || Object.getPrototypeOf(argv) !== Array.prototype || ![1, 3].includes(argv.length)
    || Reflect.ownKeys(argv).length !== argv.length + 1) throw Error('Routing dry driver options refused');
  for (let i = 0; i < argv.length; i++) if (!Object.hasOwn(Object.getOwnPropertyDescriptor(argv, String(i)) ?? {}, 'value')) throw Error('Routing dry driver options refused');
  if (argv[0] !== '--dry-run' || argv.length === 3 && (argv[1] !== '--scenario' || !SCENARIOS.includes(argv[2]))) throw Error('Routing dry driver options refused');
  return argv.length === 1 ? 'happy-v2' : argv[2];
}
export async function runRoutingDry(scenario = 'happy-v2') {
  if (typeof scenario !== 'string' || !SCENARIOS.includes(scenario)) throw Error('Routing dry driver scenario refused');
  const machine = createRoutingMachine(), start = performance.now();
  let peer, closed = false, exitCode = null, signalCode = null, done = false, forced = false, timer;
  let flushed = 0, infrastructureFailure = false;
  const frames = createRoutingFrames(packet => { machine.receive(packet); flush(); }, reason => { machine.abort(reason); flush(); });
  function flush() {
    for (const item of machine.takeOutbound()) {
      if (item.domain !== 'synthetic-only' || ++flushed > 32) { machine.abort('driver-error'); return; }
      if (!peer || closed || peer.stdin.destroyed) { machine.abort('transport-error'); return; }
      try { peer.stdin.write(JSON.stringify(item.rpc) + '\n'); } catch { machine.abort('transport-error'); }
    }
  }
  const exited = new Promise(resolveExit => {
    try { peer = spawn(process.execPath, [PEER, scenario], { stdio: ['pipe', 'pipe', 'pipe'], env: {},
      detached: process.platform !== 'win32', windowsHide: true }); }
    catch { infrastructureFailure = true; closed = true; resolveExit(); return; }
    peer.on('error', () => { infrastructureFailure = true; machine.abort('transport-error'); resolveExit(); });
    peer.on('close', (code, signal) => { closed = true; exitCode = code; signalCode = signal;
      frames.finish(); if (!machine.report().done) machine.abort('peer-disconnected'); resolveExit(); });
    peer.stdout.on('data', chunk => frames.push(chunk));
    peer.stderr.on('data', chunk => frames.push(chunk, true));
    peer.stdin.on('error', () => { if (!done) machine.abort('transport-error'); });
  });
  await new Promise(resolveRun => {
    function tick() {
      const elapsed = Math.trunc(performance.now() - start); machine.advance(elapsed);
      if (elapsed >= 5000) machine.abort('dry-transport-deadline');
      flush();
      if (machine.report().done || closed || infrastructureFailure || frames.counters().framingFailed || elapsed >= 8000) {
        clearInterval(timer); done = true; resolveRun();
      }
    }
    machine.start(); flush(); timer = setInterval(tick, 10); tick();
  });
  async function boundedExit(ms) {
    let timeout;
    const value = await Promise.race([exited.then(() => true), new Promise(r => { timeout = setTimeout(() => r(false), ms); })]);
    clearTimeout(timeout); return value;
  }
  function kill(signal) {
    if (!peer?.pid || closed || peer.exitCode !== null || peer.signalCode !== null) return;
    try { if (process.platform !== 'win32') process.kill(-peer.pid, signal); else peer.kill(signal); }
    catch { /* The owned peer may already have exited. Never target another PID. */ }
  }
  if (peer && !closed) {
    peer.stdin.end();
    if (!await boundedExit(150)) { forced = true; kill('SIGTERM'); }
    if (!await boundedExit(150)) kill('SIGKILL');
  }
  const reaped = await boundedExit(1500);
  const report = machine.report(), processReaped = reaped && closed && !infrastructureFailure;
  const transportComplete = processReaped && exitCode === 0 && !forced && !frames.counters().framingFailed;
  return { ...report, outcome: report.outcome === 'passed' && !transportComplete ? 'stopped' : report.outcome,
    reason: report.reason ?? (transportComplete ? null : 'transport-error'),
    transport: 'fixed-synthetic-peer', processReaped, peerExitCode: exitCode, peerSignalled: signalCode !== null,
    forcedPeerTermination: forced, ...frames.counters() };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { const result = await runRoutingDry(parseRoutingArgs(process.argv.slice(2))); process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    if (result.outcome !== 'passed') process.exitCode = 1;
  } catch { process.stderr.write('Routing dry driver refused; no live transport is available.\n'); process.exitCode = 2; }
}
