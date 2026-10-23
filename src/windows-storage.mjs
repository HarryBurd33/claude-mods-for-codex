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
  if (typeof path !== 'string' || path.length > 240 || !/^[A-Za-z]:\\/.test(path) || /[\p{Cc}\p{Cf}]/u.test(path)) throw unavailable();
  const parts = path.slice(3).split('\\');
  if (!parts.length || parts.some(part => !part || part === '.' || part === '..' || /[ .]$/.test(part)
    || /[/:*?"<>|]/.test(part) || /^(?:CON|PRN|AUX|NUL|(?:COM|LPT)[0-9¹²³])(?:\.|$)/i.test(part))) throw unavailable();
  if (win32.resolve(path).toLowerCase() !== path.toLowerCase()) throw unavailable();
  return path;
}

export async function windowsStorageRequest(op, path, { data = '', limit = 0 } = {}) {
  if (process.platform !== 'win32' || !OPERATIONS.has(op)) throw unavailable();
  validateWindowsPrivatePath(path);
  if (typeof data !== 'string' || data.length > 24 * 1024 || !Number.isInteger(limit) || limit < 0 || limit > 1024 * 1024) throw unavailable();
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
  const encoded = JSON.stringify({ version: 1, op, path, data, limit }).replace(/[^\x00-\x7f]/g, character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);
  const request = Buffer.from(encoded + '\n', 'ascii');
  if (request.length > 32768) throw unavailable();
  return new Promise((resolve, reject) => {
    const child = spawn(win32.join(directory, 'powershell.exe'), ['-NoLogo', '-NoProfile', '-NonInteractive', '-File', SCRIPT],
      { shell: false, windowsHide: true, env: environment, stdio: ['pipe', 'pipe', 'ignore'] });
    let chunks = [], bytes = 0, failed = false, done = false;
    let killer;
    const finish = (error, value) => {
      if (done) return; done = true; clearTimeout(deadline); clearTimeout(cleanup);
      chunks = []; if (error) reject(unavailable()); else resolve(value);
    };
    const stop = () => {
      if (failed || done) return; failed = true; chunks = [];
      if (child.pid && child.exitCode === null) {
        // Fixed system utility targets only this owned helper tree. No shell,
        // elevated token, execution-policy override or arbitrary process selector.
        killer = spawn(win32.join(systemRoot, 'System32', 'taskkill.exe'), ['/PID', String(child.pid), '/T', '/F'],
          { shell: false, windowsHide: true, env: environment, stdio: 'ignore' });
        killer.on('error', () => { child.kill(); finish(true); });
        killer.on('close', () => finish(true));
      } else child.kill();
      cleanup = setTimeout(() => { killer?.kill(); child.kill(); finish(true); }, 2000);
    };
    let cleanup;
    const deadline = setTimeout(stop, 15000);
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
        const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if (!value || Object.keys(value).sort().join() !== 'data,ok,version' || value.version !== 1 || value.ok !== true
          || !Array.isArray(value.data) || value.data.length > 2 || value.data.some(s => typeof s !== 'string' || s.length % 4 || /[^A-Za-z0-9+/=]/.test(s))) throw unavailable();
        const expected = op === 'private-read' || op === 'state-list' ? 1 : op === 'journal-read' || op === 'state-read' ? 2 : 0;
        if (value.data.length !== expected) throw unavailable();
        const buffers = value.data.map(s => Buffer.from(s, 'base64'));
        if (buffers.some((buffer, index) => buffer.toString('base64') !== value.data[index])) throw unavailable();
        if (buffers.some(b => b.length > (op === 'private-read' ? limit : 1024 * 1024))) throw unavailable();
        finish(false, buffers);
      } catch { finish(true); }
    });
    child.stdin.end(request);
  });
}

export async function readWindowsPrivateFile(path, limit) {
  return (await windowsStorageRequest('private-read', path, { limit }))[0].toString('utf8');
}
