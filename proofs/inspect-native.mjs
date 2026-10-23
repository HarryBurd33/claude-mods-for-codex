import { spawn } from 'node:child_process';
import { lstat } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const PLUGIN_NAME = 'claude-mods-native-proof';
const MAX_TIMEOUT_MS = 20_000;
const MAX_STDOUT_BYTES = 2 * 1024 * 1024;
const EVENTS = new Set(['preModelRequest', 'postModelRequest', 'preToolUse', 'permissionRequest', 'postToolUse', 'preCompact', 'postCompact', 'sessionStart', 'sessionEnd', 'userPromptSubmit', 'subagentStart', 'subagentStop', 'stop', 'interrupt']);
const TRUST = new Set(['managed', 'untrusted', 'trusted', 'modified']);
const HANDLERS = new Set(['command', 'mcpTool', 'prompt', 'agent']);
const delay = milliseconds => new Promise(resolveDelay => setTimeout(resolveDelay, milliseconds));

function safeError(message) { return new Error(`Native inspection: ${message}`); }
function record(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function version(value) { return typeof value === 'string' && /^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]{1,64})?$/.test(value) ? value : null; }

async function validatePaths(project, marketplace) {
  if (typeof project !== 'string' || !isAbsolute(project) || typeof marketplace !== 'string' || !isAbsolute(marketplace)) {
    throw safeError('--project and --marketplace must be absolute paths');
  }
  if (project.length > 4096 || marketplace.length > 4096 || /\p{Cc}/u.test(project + marketplace)) throw safeError('invalid path');
  let projectInfo, marketplaceInfo;
  try { [projectInfo, marketplaceInfo] = await Promise.all([lstat(project), lstat(marketplace)]); }
  catch { throw safeError('project or marketplace is unavailable'); }
  if (!projectInfo.isDirectory() || !marketplaceInfo.isFile() || !marketplace.endsWith('.json')) {
    throw safeError('project must be a directory and marketplace a regular JSON file');
  }
}

async function stopProcessTree(child, closed) {
  child.stdin.destroy();
  if (child.pid === undefined) return;
  if (process.platform === 'win32') {
    // Node's Windows child.kill only terminates the direct child.
    const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    const killed = new Promise(resolveKilled => {
      killer.once('error', resolveKilled);
      killer.once('close', resolveKilled);
    });
    await Promise.race([killed, delay(1000)]);
    if (killer.exitCode === null) killer.kill();
    child.kill();
  } else {
    try { process.kill(-child.pid, 'SIGTERM'); } catch { /* already gone */ }
    await Promise.race([closed, delay(400)]);
    // Clean up descendants even if the direct parent exited first.
    try { process.kill(-child.pid, 'SIGKILL'); } catch { /* already gone */ }
  }
  await Promise.race([closed, delay(1000)]);
  child.stdout.destroy();
}

function summarize(hooksResult, pluginResult) {
  const plugin = pluginResult?.plugin;
  const summary = plugin?.summary;
  if (!record(plugin) || !record(summary) || summary.name !== PLUGIN_NAME ||
      typeof summary.id !== 'string' || !summary.id.startsWith(`${PLUGIN_NAME}@`) ||
      !Array.isArray(plugin.hooks) || !Array.isArray(plugin.mcpServers) ||
      typeof summary.installed !== 'boolean' || typeof summary.enabled !== 'boolean' ||
      !Array.isArray(hooksResult?.data)) throw safeError('unexpected inventory response');
  const hooks = [];
  let discoveryWarningCount = 0, discoveryErrorCount = 0;
  for (const entry of hooksResult.data) {
    if (!record(entry) || !Array.isArray(entry.hooks) || !Array.isArray(entry.warnings) || !Array.isArray(entry.errors)) {
      throw safeError('unexpected hook discovery response');
    }
    discoveryWarningCount += entry.warnings.length;
    discoveryErrorCount += entry.errors.length;
    for (const hook of entry.hooks) {
      if (!record(hook) || hook.pluginId !== summary.id) continue;
      hooks.push({
        event: EVENTS.has(hook.eventName) ? hook.eventName : 'unknown',
        handler: HANDLERS.has(hook.handlerType) ? hook.handlerType : 'unknown',
        enabled: hook.enabled === true,
        trust: TRUST.has(hook.trustStatus) ? hook.trustStatus : 'unknown',
        timeoutSeconds: Number.isSafeInteger(hook.timeoutSec) && hook.timeoutSec >= 0 ? hook.timeoutSec : null,
      });
    }
  }
  return {
    evidence: 'native-inventory-only',
    plugin: {
      name: PLUGIN_NAME, installed: summary.installed, enabled: summary.enabled,
      version: version(summary.localVersion) ?? version(summary.version),
      declaredHookEvents: plugin.hooks.map(hook => EVENTS.has(hook?.eventName) ? hook.eventName : 'unknown'),
      proofMcpDeclared: plugin.mcpServers.includes('mods-proof'),
    },
    hooks, discoveryWarningCount, discoveryErrorCount,
    limitations: ['Inventory does not prove event delivery, hook execution, UI rendering, or permissions enforcement.'],
  };
}

// The second argument is a subprocess test seam, not a CLI executable override.
// It lets tests use a synthetic peer without starting Codex or accessing accounts.
export async function inspectNative({ project, marketplace }, {
  executable = 'codex', prefixArgs = [], timeoutMs = MAX_TIMEOUT_MS, maxOutputBytes = MAX_STDOUT_BYTES,
} = {}) {
  await validatePaths(project, marketplace);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 50 || timeoutMs > MAX_TIMEOUT_MS ||
      !Number.isInteger(maxOutputBytes) || maxOutputBytes < 1024 || maxOutputBytes > MAX_STDOUT_BYTES) throw safeError('invalid inspection bounds');
  const child = spawn(executable, [...prefixArgs, 'app-server'], {
    stdio: ['pipe', 'pipe', 'ignore'], detached: process.platform !== 'win32', windowsHide: true,
  });
  const closed = new Promise(resolveClosed => child.once('close', resolveClosed));
  let pending = null, failure = null, outputBytes = 0, buffered = '', timer;
  const fail = error => {
    if (failure) return;
    failure = error;
    if (pending) { const request = pending; pending = null; request.reject(error); }
  };
  const write = value => {
    if (failure) throw failure;
    child.stdin.write(`${JSON.stringify(value)}\n`, error => {
      if (error) fail(safeError('request transport closed'));
    });
  };
  child.once('error', () => fail(safeError('could not start app-server')));
  child.once('exit', () => fail(safeError('app-server exited before inspection completed')));
  child.stdin.on('error', () => fail(safeError('request transport closed')));
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', chunk => {
    if (failure) return;
    outputBytes += Buffer.byteLength(chunk);
    if (outputBytes > maxOutputBytes) return fail(safeError('app-server output exceeded the limit'));
    buffered += chunk;
    let end;
    while ((end = buffered.indexOf('\n')) !== -1) {
      const line = buffered.slice(0, end);
      buffered = buffered.slice(end + 1);
      if (!line.trim()) continue;
      let message;
      try { message = JSON.parse(line); } catch { return fail(safeError('invalid app-server JSON')); }
      if (!record(message)) return fail(safeError('invalid app-server envelope'));
      // Never answer a server request: this inspector cannot approve an action.
      if (typeof message.method === 'string' && Object.hasOwn(message, 'id')) return fail(safeError('unexpected server request; no action approved'));
      if (typeof message.method === 'string') continue;
      if (!pending || message.id !== pending.id) return fail(safeError('unexpected app-server response'));
      const request = pending;
      pending = null;
      if (Object.hasOwn(message, 'error')) {
        const code = Number.isSafeInteger(message.error?.code) ? ` (code ${message.error.code})` : '';
        const error = safeError(`${request.method} failed${code}`);
        request.reject(error);
        fail(error);
        return;
      }
      if (!Object.hasOwn(message, 'result')) {
        const error = safeError('missing app-server result');
        request.reject(error);
        fail(error);
        return;
      }
      request.resolve(message.result);
    }
  });
  const request = (id, method, params) => {
    if (failure) return Promise.reject(failure);
    return new Promise((resolveRequest, reject) => {
      pending = { id, method, resolve: resolveRequest, reject };
      try { write({ id, method, params }); } catch (error) { fail(error); }
    });
  };
  timer = setTimeout(() => fail(safeError('deadline exceeded')), timeoutMs);
  try {
    await request(1, 'initialize', { clientInfo: { name: 'claude_mods_inspection', version: '0.0.1' }, capabilities: { experimentalApi: true } });
    write({ method: 'initialized', params: {} });
    const hooks = await request(2, 'hooks/list', { cwds: [project] });
    const plugin = await request(3, 'plugin/read', { pluginName: PLUGIN_NAME, marketplacePath: marketplace });
    if (failure) throw failure;
    return summarize(hooks, plugin);
  } finally {
    clearTimeout(timer);
    await stopProcessTree(child, closed);
  }
}

function parseArguments(args) {
  if (args.length === 1 && args[0] === '--help') return null;
  const values = {};
  for (let index = 0; index < args.length; index += 2) {
    const option = args[index];
    if (!['--project', '--marketplace'].includes(option) || Object.hasOwn(values, option) || !args[index + 1]) throw safeError('expected --project ABSOLUTE_DIRECTORY --marketplace ABSOLUTE_JSON_FILE');
    values[option] = args[index + 1];
  }
  return { project: values['--project'], marketplace: values['--marketplace'] };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const options = parseArguments(process.argv.slice(2));
    if (options === null) console.log('Usage: node proofs/inspect-native.mjs --project ABSOLUTE_DIRECTORY --marketplace ABSOLUTE_JSON_FILE\nReads only the proof plugin inventory. Does not start a chat, run hooks, modify trust, or submit a model turn.');
    else console.log(JSON.stringify(await inspectNative(options), null, 2));
  } catch (error) {
    console.error(error?.message?.startsWith('Native inspection:') ? error.message : 'Native inspection: failed');
    process.exitCode = 1;
  }
}
