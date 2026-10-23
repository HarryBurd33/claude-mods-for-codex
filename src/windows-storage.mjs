import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { win32 } from 'node:path';

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
  if (process.platform !== 'win32' || !OPERATIONS.has(op)) throw unavailable();
  validateWindowsPrivatePath(path);
  if (typeof data !== 'string' || data.length > 24 * 1024 || !Number.isInteger(limit) || limit < 0 || limit > 1024 * 1024) throw unavailable();
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 15000) throw unavailable();
  if (signal !== undefined && !(signal instanceof AbortSignal) || signal?.aborted) throw unavailable();
  const systemRoot = process.env.SystemRoot;
  if (typeof systemRoot !== 'string' || !/^[A-Za-z]:\\[^\p{Cc}]*$/u.test(systemRoot)) throw unavailable();
  const directory = win32.join(systemRoot, 'System32', 'WindowsPowerShell', 'v1.0');
  // Windows PowerShell/CLR startup uses Windows profile and runtime locations.
  // Pass only these OS variables, never the calling process's full environment.
  const environment = {};
  for (const name of ['SystemRoot','windir','SystemDrive','ComSpec','TEMP','TMP','USERPROFILE','HOMEDRIVE','HOMEPATH','APPDATA','LOCALAPPDATA','ProgramFiles','ProgramFiles(x86)','ProgramW6432','NUMBER_OF_PROCESSORS','PROCESSOR_ARCHITECTURE','OS']) {
    if (process.env[name] !== undefined) environment[name] = process.env[name];
  }
  environment.SystemRoot = systemRoot;
  environment.windir = systemRoot;
  environment.PATH = win32.join(systemRoot, 'System32');
  environment.PSModulePath = win32.join(directory, 'Modules');
  if (data.includes('|') || /[^\x20-\x7e]/.test(data)) throw unavailable();
  const request = Buffer.from(['2', op, Buffer.from(path, 'utf8').toString('base64'), data, String(limit)].join('|') + '\n', 'ascii');
  if (request.length > 32768) throw unavailable();
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawn(win32.join(directory, 'powershell.exe'), ['-NoLogo', '-NoProfile', '-NonInteractive', '-File', SCRIPT],
        { shell: false, windowsHide: true, cwd: win32.dirname(SCRIPT), env: environment, stdio: ['pipe', 'pipe', 'ignore'] });
    } catch { reject(unavailable()); return; }
    let chunks = [], bytes = 0, failed = false, done = false;
    let killer, cleanup, deadline;
    const kill = process => { try { process?.kill(); } catch { /* refusal remains sanitized */ } };
    const finish = (error, value) => {
      if (done) return; done = true; clearTimeout(deadline); clearTimeout(cleanup);
      signal?.removeEventListener('abort', stop);
      chunks = []; if (error) reject(unavailable()); else resolve(value);
    };
    const stop = () => {
      if (failed || done) return; failed = true; chunks = [];
      cleanup = setTimeout(() => { kill(killer); kill(child); finish(true); }, 500);
      if (child.pid && child.exitCode === null) {
        // Fixed system utility targets only this owned helper tree. No shell,
        // elevated token, execution-policy override or arbitrary process selector.
        try {
          killer = spawn(win32.join(systemRoot, 'System32', 'taskkill.exe'), ['/PID', String(child.pid), '/T', '/F'],
            { shell: false, windowsHide: true, env: environment, stdio: 'ignore' });
          killer.on('error', () => { kill(child); finish(true); });
          killer.on('close', code => { if (code !== 0) kill(child); finish(true); });
        } catch { kill(child); finish(true); }
      } else { kill(child); finish(true); }
    };
    deadline = setTimeout(stop, timeoutMs);
    signal?.addEventListener('abort', stop, { once: true });
    if (signal?.aborted) stop();
    child.on('error', () => finish(true));
    child.stdin.on('error', stop);
    child.stdout.on('data', chunk => {
      if (failed) return;
      bytes += chunk.length;
      if (bytes > MAX_OUTPUT) { stop(); return; }
      chunks.push(chunk);
    });
    child.on('close', code => {
      if (failed) { if (!killer) finish(true); return; }
      if (code !== 0) { finish(true); return; }
      try {
        const buffers = parseWindowsStorageResponse(Buffer.concat(chunks), op, limit);
        finish(false, buffers);
      } catch { finish(true); }
    });
    if (!failed) child.stdin.end(request);
  });
}

export async function readWindowsPrivateFile(path, limit, { signal } = {}) {
  return (await windowsStorageRequest('private-read', path, { limit, signal }))[0].toString('utf8');
}
