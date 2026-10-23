import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { inspectNative } from '../proofs/inspect-native.mjs';

// This peer is deliberately synthetic. These tests never launch Codex, review
// trust, start a chat, call a model, or prove installed-host compatibility.
const FAKE_SERVER = String.raw`
import { appendFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { spawn } from 'node:child_process';
const [mode, trace] = process.argv.slice(2);
writeFileSync(trace + '.pid', String(process.pid));
const secret = 'SYNTHETIC_PRIVATE_CONTENT';
let ready = false;
if (mode === 'stubborn') { process.on('SIGTERM', () => {}); setInterval(() => {}, 1000); }
if (mode === 'descendant') {
  spawn(process.execPath, ['-e', 'const fs=require("node:fs");setInterval(()=>fs.appendFileSync(process.argv[1],"x"),20)', trace + '.child'], { stdio: 'ignore' });
}
const reply = value => process.stdout.write(JSON.stringify(value) + '\n');
for await (const line of createInterface({ input: process.stdin })) {
  const request = JSON.parse(line);
  appendFileSync(trace, JSON.stringify(request) + '\n');
  if (mode === 'stall' || mode === 'stubborn' || mode === 'descendant') continue;
  if (mode === 'overflow') { process.stdout.write('x'.repeat(8192)); continue; }
  if (mode === 'invalid') { process.stdout.write(secret + '\n'); continue; }
  if (mode === 'request') { reply({ id: 99, method: 'item/commandExecution/requestApproval', params: { command: secret } }); continue; }
  if (mode === 'exit') process.exit(2);
  if (mode === 'error') { reply({ id: request.id, error: { code: -32001, message: secret, data: { path: secret } } }); continue; }
  if (request.method === 'initialized') { ready = true; continue; }
  if (request.method === 'initialize') {
    reply({ method: 'synthetic/notice', params: { private: secret } });
    reply({ id: request.id, result: { userAgent: secret } });
  } else if (ready && request.method === 'hooks/list') {
    reply({ id: request.id, result: { data: [{ cwd: secret, warnings: [secret], errors: [{ path: secret, message: secret }], hooks: [
      { pluginId: 'claude-mods-native-proof@synthetic-market', eventName: 'preToolUse', handlerType: 'command', enabled: true, trustStatus: 'untrusted', timeoutSec: 5, command: secret, currentHash: secret, sourcePath: secret },
      { pluginId: 'other-private-plugin@synthetic-market', eventName: 'sessionStart', enabled: true, trustStatus: 'trusted', sourcePath: secret },
      ...(mode === 'hostile' ? [{ pluginId: 'claude-mods-native-proof@synthetic-market', eventName: secret, handlerType: secret, enabled: secret, trustStatus: secret, timeoutSec: secret }] : []),
    ] }] } });
  } else if (ready && request.method === 'plugin/read') {
    const result = { plugin: {
      summary: { id: 'claude-mods-native-proof@synthetic-market', name: mode === 'wrong-plugin' ? 'other-plugin' : 'claude-mods-native-proof', installed: true, enabled: false, localVersion: mode === 'hostile' ? secret : '0.0.2', source: secret },
      hooks: [{ eventName: 'preToolUse', key: secret }], mcpServers: ['mods-proof', secret], shareUrl: secret, description: secret,
    } };
    const data = JSON.stringify({ id: request.id, result }) + '\n';
    // Exercise framing split across stdout chunks.
    process.stdout.write(data.slice(0, 17));
    setTimeout(() => process.stdout.write(data.slice(17)), 10);
  } else { reply({ id: request.id, error: { code: -32601, message: secret } }); }
}
`;

async function fixture(t) {
  const directory = await mkdtemp(join(await realpath(tmpdir()), 'codex-mods-inspection-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const server = join(directory, 'synthetic-peer.mjs');
  const marketplace = join(directory, 'marketplace.json');
  await writeFile(server, FAKE_SERVER);
  await writeFile(marketplace, '{}');
  return { directory, server, options: { project: directory, marketplace } };
}

function mockOptions(f, mode, overrides = {}) {
  return { executable: process.execPath, prefixArgs: [f.server, mode, join(f.directory, `${mode}.trace`)], timeoutMs: 1500, ...overrides };
}

test('synthetic inventory uses only three read requests and emits no private fields', async t => {
  const f = await fixture(t);
  const result = await inspectNative(f.options, mockOptions(f, 'success'));
  assert.equal(result.evidence, 'native-inventory-only');
  assert.deepEqual(result.plugin, {
    name: 'claude-mods-native-proof', installed: true, enabled: false, version: '0.0.2', declaredHookEvents: ['preToolUse'], proofMcpDeclared: true,
  });
  assert.deepEqual(result.hooks, [{ event: 'preToolUse', handler: 'command', enabled: true, trust: 'untrusted', timeoutSeconds: 5 }]);
  assert.equal(result.discoveryWarningCount, 1);
  assert.equal(result.discoveryErrorCount, 1);
  assert.doesNotMatch(JSON.stringify(result), /SYNTHETIC_PRIVATE_CONTENT|sourcePath|currentHash|other-private-plugin/);
  const requests = (await readFile(join(f.directory, 'success.trace'), 'utf8')).trim().split('\n').map(JSON.parse);
  assert.deepEqual(requests.map(request => request.method), ['initialize', 'initialized', 'hooks/list', 'plugin/read']);
  assert.deepEqual(requests[2].params, { cwds: [f.options.project] });
  assert.deepEqual(requests[3].params, { pluginName: 'claude-mods-native-proof', marketplacePath: f.options.marketplace });
  const pid = Number(await readFile(join(f.directory, 'success.trace.pid'), 'utf8'));
  assert.throws(() => process.kill(pid, 0), { code: 'ESRCH' });
});

test('synthetic host strings cannot escape the allowlisted summary', async t => {
  const f = await fixture(t);
  const result = await inspectNative(f.options, mockOptions(f, 'hostile'));
  assert.equal(result.plugin.version, null);
  assert.deepEqual(result.hooks[1], { event: 'unknown', handler: 'unknown', enabled: false, trust: 'unknown', timeoutSeconds: null });
  assert.doesNotMatch(JSON.stringify(result), /SYNTHETIC_PRIVATE_CONTENT/);
  await assert.rejects(inspectNative(f.options, mockOptions(f, 'wrong-plugin')), /unexpected inventory response/);
});

test('synthetic errors, malformed input, approval requests, and early exit fail without payload disclosure', async t => {
  const f = await fixture(t);
  for (const [mode, expected] of [['error', /initialize failed \(code -32001\)/], ['invalid', /invalid app-server JSON/], ['request', /no action approved/], ['exit', /exited before inspection/]]) {
    await assert.rejects(inspectNative(f.options, mockOptions(f, mode)), error => {
      assert.match(error.message, expected);
      assert.doesNotMatch(error.message, /SYNTHETIC_PRIVATE_CONTENT/);
      return true;
    });
    const requests = (await readFile(join(f.directory, `${mode}.trace`), 'utf8')).trim().split('\n').map(JSON.parse);
    assert.deepEqual(requests.map(request => request.method), ['initialize']);
  }
});

test('synthetic output flooding and stalled peers are bounded and cleaned up', async t => {
  const f = await fixture(t);
  for (const [mode, expected] of [['overflow', /output exceeded/], ['stall', /deadline exceeded/], ['stubborn', /deadline exceeded/]]) {
    const started = Date.now();
    await assert.rejects(inspectNative(f.options, mockOptions(f, mode, { timeoutMs: 300, maxOutputBytes: 4096 })), expected);
    assert.ok(Date.now() - started < 3000, 'inspection and cleanup remain bounded');
    const pid = Number(await readFile(join(f.directory, `${mode}.trace.pid`), 'utf8'));
    assert.throws(() => process.kill(pid, 0), { code: 'ESRCH' });
  }
});

test('synthetic POSIX descendants stop after an inspection timeout', { skip: process.platform === 'win32' }, async t => {
  const f = await fixture(t);
  await assert.rejects(inspectNative(f.options, mockOptions(f, 'descendant', { timeoutMs: 400 })), /deadline exceeded/);
  const heartbeat = join(f.directory, 'descendant.trace.child');
  const before = await readFile(heartbeat, 'utf8');
  assert.ok(before.length > 0);
  await new Promise(resolveDelay => setTimeout(resolveDelay, 100));
  assert.equal(await readFile(heartbeat, 'utf8'), before);
});

test('invalid paths and unavailable executables fail with sanitized diagnostics', async t => {
  const f = await fixture(t);
  await assert.rejects(inspectNative({ ...f.options, project: 'relative' }), /absolute paths/);
  await assert.rejects(inspectNative({ ...f.options, marketplace: f.directory }), /regular JSON file/);
  await assert.rejects(inspectNative(f.options, { executable: join(f.directory, 'SYNTHETIC_PRIVATE_CONTENT') }), error => {
    assert.match(error.message, /could not start app-server/);
    assert.doesNotMatch(error.message, /SYNTHETIC_PRIVATE_CONTENT/);
    return true;
  });
});

test('CLI rejects session-start and executable overrides', async () => {
  const script = fileURLToPath(new URL('../proofs/inspect-native.mjs', import.meta.url));
  for (const option of ['--start-session', '--executable']) {
    const result = await new Promise((resolveResult, reject) => {
      const child = spawn(process.execPath, [script, option, 'SYNTHETIC_PRIVATE_CONTENT']);
      let stdout = '', stderr = '';
      child.stdout.on('data', chunk => { stdout += chunk; });
      child.stderr.on('data', chunk => { stderr += chunk; });
      child.once('error', reject);
      child.once('close', code => resolveResult({ code, stdout, stderr }));
    });
    assert.equal(result.code, 1);
    assert.equal(result.stdout, '');
    assert.doesNotMatch(result.stderr, /SYNTHETIC_PRIVATE_CONTENT/);
  }
});
