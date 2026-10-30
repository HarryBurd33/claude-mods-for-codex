import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { win32 } from 'node:path';
import { performance } from 'node:perf_hooks';

const SCRIPT = fileURLToPath(new URL('./windows/private-storage.ps1', import.meta.url));
const MAX_OUTPUT = 3 * 1024 * 1024;
const OPERATIONS = new Set(['prepare-directory', 'private-read', 'journal-read', 'journal-append', 'state-record', 'state-read', 'state-list', 'state-prune']);
const unavailable = () => new Error('Private Windows storage unavailable; review local NTFS ownership, protected ACLs, path, helper policy and bounds');

// This is deliberately stricter than general Windows paths. No normalization can
// turn a rejected namespace, stream or relative input into an accepted path.
export function validateWindowsPrivatePath(path) {
  if (typeof path !== 'string' || path.length > 240 || !path.isWellFormed() || !/^[A-Za-z]:\\/.test(path) || /[\p{Cc}\p{Cf}]/u.test(path)) throw unavailable();
  const parts = path.slice(3).split('\\');
  if (!parts.length || parts.some(part => !part || part === '.' || part === '..' || /[ .]$/.test(part)
    || /[/:*?"<>|]/.test(part) || /^(?:CON|PRN|AUX|NUL|(?:COM|LPT)[0-9¹²³])(?:\.|$)/i.test(part))) throw unavailable();
  if (win32.resolve(path).toLowerCase() !== path.toLowerCase()) throw unavailable();
  return path;
}

export function parseWindowsStorageResponse(output, op, limit = 0) {
  if (!Buffer.isBuffer(output) || output.length > MAX_OUTPUT || !OPERATIONS.has(op) || !Number.isInteger(limit) || limit < 0 || limit > 1024 * 1024
    || output.some(byte => byte > 127 || byte < 32 && byte !== 10 && byte !== 13)) throw unavailable();
  const fields = output.toString('ascii').trim().split('|');
  const expected = op === 'private-read' || op === 'state-list' ? 1 : op === 'journal-read' || op === 'state-read' ? 2 : 0;
  if (fields[0] !== '2' || fields[1] !== 'ok' || fields[2] !== String(expected)) throw unavailable();
  const data = fields.slice(3);
  if (expected === 0 ? data.length !== 1 || data[0] !== '' : data.length !== expected) throw unavailable();
  if (expected === 0) data.length = 0;
  if (data.some(s => s.length % 4 || /[^A-Za-z0-9+/=]/.test(s))) throw unavailable();
  const buffers = data.map(s => Buffer.from(s, 'base64'));
  if (buffers.some((buffer, index) => buffer.toString('base64') !== data[index])) throw unavailable();
  if (buffers.some(b => b.length > (op === 'private-read' ? limit : 1024 * 1024))) throw unavailable();
  return buffers;
}

export async function windowsStorageRequest(op, path, { data = '', limit = 0, timeoutMs = 15000, signal } = {}) {
  const role = () => ({ attempted: false, closed: false, killRequested: false, child: undefined });
  const helper = role(), terminator = role();
  const failure = () => Object.defineProperties(unavailable(), {
    code: { value: 'ERR_WINDOWS_STORAGE_UNAVAILABLE' },
    storageLifecycle: { value: Object.freeze({ version: 1,
      helper: helper.closed ? 'closed' : helper.attempted ? 'unresolved' : 'never-started',
      terminator: terminator.closed ? 'closed' : terminator.attempted ? 'unresolved' : 'never-started',
      descendants: 'unverified' }) },
  });
  let request, systemRoot, directory, environment;
  try {
    if (process.platform !== 'win32' || !OPERATIONS.has(op)) throw unavailable();
    validateWindowsPrivatePath(path);
    if (typeof data !== 'string' || data.length > 24 * 1024 || !Number.isInteger(limit) || limit < 0 || limit > 1024 * 1024) throw unavailable();
    if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 15000) throw unavailable();
    if (signal !== undefined && !(signal instanceof AbortSignal) || signal?.aborted) throw unavailable();
    systemRoot = process.env.SystemRoot;
    if (typeof systemRoot !== 'string' || !/^[A-Za-z]:\\[^\p{Cc}]*$/u.test(systemRoot)) throw unavailable();
    directory = win32.join(systemRoot, 'System32', 'WindowsPowerShell', 'v1.0');
    // Windows PowerShell/CLR startup uses Windows profile and runtime locations.
    // Pass only these OS variables, never the calling process's full environment.
    environment = {};
    for (const name of ['SystemRoot','windir','SystemDrive','ComSpec','TEMP','TMP','USERPROFILE','HOMEDRIVE','HOMEPATH','APPDATA','LOCALAPPDATA','ProgramFiles','ProgramFiles(x86)','ProgramW6432','NUMBER_OF_PROCESSORS','PROCESSOR_ARCHITECTURE','OS']) {
      if (process.env[name] !== undefined) environment[name] = process.env[name];
    }
    environment.SystemRoot = systemRoot;
    environment.windir = systemRoot;
    environment.PATH = win32.join(systemRoot, 'System32');
    environment.PSModulePath = win32.join(directory, 'Modules');
    if (data.includes('|') || /[^\x20-\x7e]/.test(data)) throw unavailable();
    request = Buffer.from(['2', op, Buffer.from(path, 'utf8').toString('base64'), data, String(limit)].join('|') + '\n', 'ascii');
    if (request.length > 32768) throw unavailable();
  } catch { throw failure(); }
  const operationEnd = performance.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    let chunks = [], bytes = 0, failed = false, done = false;
    let cleanup, deadline;
    const running = r => r.child && !r.closed && r.child.exitCode === null && r.child.signalCode == null;
    const kill = r => {
      if (r.killRequested || !running(r)) return;
      r.killRequested = true;
      try { r.child.kill(); } catch { /* No termination or close inferred. */ }
    };
    const finish = (error, value) => {
      if (done) return;
      done = true; clearTimeout(deadline); clearTimeout(cleanup);
      signal?.removeEventListener('abort', stop);
      chunks = []; request = undefined;
      if (error) reject(failure()); else resolve(value);
    };
    const reconciled = () => {
      if (failed && !done && [helper, terminator].every(r => !r.attempted || r.closed)) finish(true);
    };
    const stop = () => {
      if (failed || done) return;
      failed = true; chunks = []; request = undefined;
      const cleanupEnd = Math.min(performance.now() + 500, operationEnd + 500);
      cleanup = setTimeout(() => { kill(terminator); kill(helper); finish(true); }, Math.max(0, cleanupEnd - performance.now()));
      if (running(helper) && Number.isInteger(helper.child.pid) && helper.child.pid > 0) {
        // Fixed utility, exact owned PID only. This is not a tree-close receipt.
        terminator.attempted = true;
        try {
          terminator.child = spawn(win32.join(systemRoot, 'System32', 'taskkill.exe'), ['/PID', String(helper.child.pid), '/T', '/F'],
            { shell: false, windowsHide: true, env: environment, stdio: 'ignore' });
          terminator.child.on('error', () => { if (!done) kill(helper); });
          terminator.child.once('close', code => {
            terminator.closed = true;
            if (!done && code !== 0) kill(helper);
            reconciled();
          });
        } catch { kill(helper); }
      } else { kill(helper); }
      reconciled();
    };
    deadline = setTimeout(stop, Math.max(0, operationEnd - performance.now()));
    helper.attempted = true;
    try {
      helper.child = spawn(win32.join(directory, 'powershell.exe'), ['-NoLogo', '-NoProfile', '-NonInteractive', '-File', SCRIPT],
        { shell: false, windowsHide: true, cwd: win32.dirname(SCRIPT), env: environment, stdio: ['pipe', 'pipe', 'ignore'] });
    } catch { stop(); return; }
    const child = helper.child;
    child.on('error', stop);
    child.stdin.on('error', stop);
    child.stdout.on('error', stop);
    child.stdout.on('data', chunk => {
      if (failed || done) return;
      bytes += chunk.length;
      if (bytes > MAX_OUTPUT) { stop(); return; }
      chunks.push(chunk);
    });
    child.once('close', code => {
      helper.closed = true;
      if (done) return;
      if (failed) { reconciled(); return; }
      if (code !== 0) { finish(true); return; }
      if (performance.now() >= operationEnd) { stop(); return; }
      try {
        const buffers = parseWindowsStorageResponse(Buffer.concat(chunks), op, limit);
        if (performance.now() >= operationEnd) { stop(); return; }
        finish(false, buffers);
      } catch { finish(true); }
    });
    signal?.addEventListener('abort', stop, { once: true });
    if (signal?.aborted || performance.now() >= operationEnd) stop();
    if (!failed && !done) {
      try { child.stdin.end(request); request = undefined; } catch { stop(); }
    }
  });
}

export async function readWindowsPrivateFile(path, limit, { signal } = {}) {
  return (await windowsStorageRequest('private-read', path, { limit, signal }))[0].toString('utf8');
}
