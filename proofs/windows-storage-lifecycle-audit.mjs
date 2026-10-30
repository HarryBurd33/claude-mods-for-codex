// Diagnostic reproduction only. Real helper processes, Windows I/O and native
// clients are never started. The production module body is evaluated unchanged.
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { win32 } from 'node:path';
import vm from 'node:vm';

const sourcePath = fileURLToPath(new URL('../src/windows-storage.mjs', import.meta.url));
const source = await readFile(sourcePath, 'utf8');
const rows = [];

async function scenario(name, stimulus) {
  const children = [], timers = [];
  function spawn() {
    const child = new EventEmitter();
    child.pid = 7300 + children.length;
    child.exitCode = null;
    child.closed = false;
    child.killRequests = 0;
    child.kill = () => { child.killRequests++; return true; };
    child.stdin = new EventEmitter();
    child.stdin.end = () => {};
    child.stdout = new EventEmitter();
    children.push(child);
    return child;
  }
  function close(child, code) {
    child.closed = true;
    child.exitCode = code;
    child.emit('close', code);
  }
  const context = vm.createContext({
    Buffer, URL, AbortSignal,
    process: { platform: 'win32', env: { SystemRoot: 'C:\\Windows' } },
    setTimeout(callback, delay) {
      const timer = { callback, delay, cleared: false };
      timers.push(timer);
      return timer;
    },
    clearTimeout(timer) { if (timer) timer.cleared = true; },
  });
  const module = new vm.SourceTextModule(source, {
    context,
    initializeImportMeta(meta) { meta.url = pathToFileURL(sourcePath).href; },
  });
  await module.link(specifier => {
    const bindings = specifier === 'node:child_process' ? { spawn }
      : specifier === 'node:url' ? { fileURLToPath }
      : specifier === 'node:path' ? { win32 } : null;
    assert.ok(bindings, 'Unexpected production dependency');
    return new vm.SyntheticModule(Object.keys(bindings), function () {
      for (const [key, value] of Object.entries(bindings)) this.setExport(key, value);
    }, { context });
  });
  await module.evaluate();
  const controller = new AbortController();
  let settled = false, accepted = false, error;
  const request = module.namespace.windowsStorageRequest(
    'prepare-directory', 'C:\\Synthetic\\private',
    { timeoutMs: 100, signal: controller.signal },
  );
  request.then(() => { settled = accepted = true; }, value => { settled = true; error = value; });
  assert.equal(children.length, 1);
  const helper = children[0];
  if (stimulus === 'success') {
    helper.stdout.emit('data', Buffer.from('2|ok|0|\n'));
    close(helper, 0);
  } else {
    controller.abort();
    assert.equal(children.length, 2);
    const killer = children[1];
    if (stimulus === 'killer-close') close(killer, 0);
    else if (stimulus === 'killer-error') killer.emit('error', new Error('synthetic'));
    else {
      const cleanup = timers.find(timer => timer.delay === 500 && !timer.cleared);
      assert.ok(cleanup);
      cleanup.callback();
    }
  }
  await new Promise(setImmediate);
  assert.equal(settled, true);
  assert.equal(accepted, stimulus === 'success');
  if (stimulus !== 'success') {
    assert.equal(helper.closed, false, 'Current gap no longer reproduced; review the changed contract');
    assert.equal(error?.message, 'Private Windows storage unavailable; review local NTFS ownership, protected ACLs, path, helper policy and bounds');
  }
  rows.push({
    name, requestSettled: settled, requestAccepted: accepted,
    helperCloseObservedAtSettlement: helper.closed,
    helperKillRequested: helper.killRequests > 0,
    errorHasLifecycleReceipt: error !== undefined && Object.hasOwn(error, 'cleanup'),
    evidence: stimulus === 'success' ? 'normal close control' : 'simulated failure settles before helper close',
  });
  // Reconcile only the simulated objects. No OS process or timer was created.
  for (const child of children) if (!child.closed) close(child, 1);
  await request.catch(() => {});
}

await scenario('taskkill close precedes helper close', 'killer-close');
await scenario('taskkill error precedes helper close', 'killer-error');
await scenario('cleanup timer requests kill without helper close', 'cleanup-deadline');
await scenario('successful helper close control', 'success');
console.log(JSON.stringify({
  source: 'src/windows-storage.mjs',
  sourceSha256: createHash('sha256').update(source).digest('hex'),
  rows, reproducedGaps: 3, controls: 1,
  nativeWindowsExecution: false, realProcessesSpawned: 0,
  productionSourceChanged: false,
}, null, 2));
