// Prepared native process transport. This build refuses BEFORE any IO/spawn.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { requireLiveAdmission, BOUNDS, jsonData } from './routing-contract.mjs';
import { describeNativePreparation, validateNativePlan } from './routing-native-plan.mjs';
import { verifyNativeInputs, readNativeReview } from './routing-native-inputs.mjs';
import { createNativeRoutingAdapter } from './routing-native-adapter.mjs';
import { createRoutingFrames } from './routing-frames.mjs';

export async function runNativeRouting(reviewPlan) {
  requireLiveAdmission(); // Unconditionally throws; no flag, plan, env or grant opens it.
  return executePreparedNative(validateNativePlan(reviewPlan));
}

// Deliberately private and unreachable in this build. Preparing this code is not
// permission to activate it. Future execution requires a fresh reviewed change
// and human authorization; there is no exported ungated native process function.
async function executePreparedNative(plan) {
  const start = performance.now(), elapsed = () => Math.trunc(performance.now() - start);
  let preflightTimer;
  try {
    await Promise.race([verifyNativeInputs(plan), new Promise((_, reject) => {
      preflightTimer = setTimeout(() => reject(Error('Native preflight deadline')), BOUNDS.requestMs);
    })]);
  } finally { clearTimeout(preflightTimer); }
  if (elapsed() >= BOUNDS.requestMs) throw Error('Native preflight deadline');
  const adapter = createNativeRoutingAdapter(plan);
  let child, closed = false, exitCode = null, forced = false, failed = false, stopping = false, tick;
  let outbound = 0, sentBytes = 0, cancelRequested = false, reaped = false;
  const frames = createRoutingFrames(packet => { adapter.receive(packet); flush(); }, reason => adapter.abort(reason));
  function flush() {
    for (const item of adapter.takeOutbound()) {
      if (item.domain !== 'native-review-draft' || ++outbound > 64 || !child || closed || child.stdin.destroyed) {
        adapter.abort('transport-error'); return;
      }
      const wire = JSON.stringify(item.rpc) + '\n'; sentBytes += Buffer.byteLength(wire);
      if (sentBytes > 128 * 1024) { adapter.abort('transport-error'); return; }
      try { child.stdin.write(wire); } catch { adapter.abort('transport-error'); }
    }
  }
  function cancel() { cancelRequested = true; adapter.abort('operator-cancelled'); flush(); }
  const exited = new Promise(done => {
    // Explicit reviewed executable/argv; no shell, URL, daemon reuse or transport injection.
    try { child = spawn(plan.input.cliPath, plan.argv, { stdio: ['pipe', 'pipe', 'pipe'], detached: true,
      windowsHide: true }); } // Normal environment/auth inherited by the official CLI; never logged.
    catch { failed = true; closed = true; done(); return; }
    child.on('error', () => { failed = true; adapter.abort('transport-error'); done(); });
    child.on('close', code => { closed = true; exitCode = code; frames.finish();
      if (!adapter.report().done) adapter.abort('peer-disconnected'); done(); });
    child.stdout.on('data', chunk => frames.push(chunk));
    child.stderr.on('data', chunk => frames.push(chunk, true));
    child.stdin.on('error', () => { if (!stopping) adapter.abort('transport-error'); });
  });
  process.on('SIGINT', cancel); process.on('SIGTERM', cancel);
  function kill(signal) {
    if (!child?.pid || closed || child.exitCode !== null || child.signalCode !== null) return;
    try { process.kill(-child.pid, signal); } catch { /* Owned group may already have exited. */ }
  }
  async function wait(ms) {
    let timer;
    try { return await Promise.race([exited.then(() => closed), new Promise(r => { timer = setTimeout(() => r(false), ms); })]); }
    finally { clearTimeout(timer); }
  }
  try {
    adapter.start(); flush();
    await new Promise(done => {
      function advance() {
        adapter.advance(elapsed());
        if (elapsed() >= BOUNDS.outerMs - 3000) adapter.abort('outer-timeout');
        flush();
        if (closed || failed || frames.counters().framingFailed || adapter.report().done || elapsed() >= BOUNDS.outerMs - 3000) {
          clearInterval(tick); done();
        }
      }
      tick = setInterval(advance, 10); advance();
    });
  } finally {
    clearInterval(tick); stopping = true;
    try {
      if (child && !closed) {
        child.stdin.end();
        if (!await wait(200)) { forced = true; kill('SIGTERM'); }
        if (!await wait(800)) kill('SIGKILL');
      }
      reaped = await wait(1500);
    } finally { process.removeListener('SIGINT', cancel); process.removeListener('SIGTERM', cancel); }
  }
  const observed = adapter.report();
  return { ...observed, outcome: observed.outcome === 'passed' && (forced || failed || !closed || exitCode !== 0
      || frames.counters().framingFailed) ? 'stopped' : observed.outcome,
    reason: observed.reason ?? (forced || failed || !closed || exitCode !== 0 || frames.counters().framingFailed ? 'transport-error' : null),
    processReaped: reaped && closed && !failed, forcedTermination: forced, cancelRequested,
    ...frames.counters(), sentBytes, nativeRoutingVerified: false };
}
export function parseNativeDriverArgs(argv) {
  if (!jsonData(argv) || !Array.isArray(argv)) throw Error('Native routing options refused');
  if (argv.length === 1 && argv[0] === '--describe') return { mode: 'describe' };
  if (argv.length === 3 && argv[0] === '--run' && argv[1] === '--plan' && typeof argv[2] === 'string'
    && argv[2].startsWith('/') && argv[2].length <= 4096 && !/[\x00-\x1f\x7f]/.test(argv[2])) return { mode: 'run', planPath: argv[2] };
  throw Error('Native routing options refused');
}
export async function runNativeRoutingFromFile(planPath) {
  requireLiveAdmission(); // Before inspecting the path or reading any artifact.
  return runNativeRouting(JSON.parse(await readNativeReview(planPath)));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = parseNativeDriverArgs(process.argv.slice(2));
    const report = args.mode === 'describe' ? describeNativePreparation() : await runNativeRoutingFromFile(args.planPath);
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } catch { process.stderr.write('Native routing execution is closed or review failed; no run is authorized.\n'); process.exitCode = 2; }
}
