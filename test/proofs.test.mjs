import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { copyFile, cp, lstat, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { appendJournalEntry, readJournalEntries } from '../src/journal.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const server = join(root, 'proofs', 'server.mjs');
const request = (id, method, params) => JSON.stringify({ jsonrpc: '2.0', id, method, ...(params === undefined ? {} : { params }) });

async function temporaryDirectory(t) {
  const path = await mkdtemp(join(await realpath(tmpdir()), 'codex-mods-proofs-'));
  t.after(() => rm(path, { recursive: true, force: true }));
  return path;
}

function runProgram(path, input = '', dataDirectory) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    delete env.PLUGIN_DATA;
    delete env.CODEX_MODS_PROOF_DATA;
    if (dataDirectory !== undefined) env.PLUGIN_DATA = dataDirectory;
    const child = spawn(process.execPath, [path], { env });
    let stdout = '', stderr = '';
    const watchdog = setTimeout(() => { child.kill('SIGKILL'); reject(new Error('proof subprocess exceeded test watchdog')); }, 10000);
    child.stdout.setEncoding('utf8').on('data', chunk => {
      stdout += chunk;
      if (stdout.length > 1024 * 1024) { child.kill('SIGKILL'); reject(new Error('proof subprocess output exceeded test limit')); }
    });
    child.stderr.setEncoding('utf8').on('data', chunk => { stderr += chunk; });
    child.stdin.on('error', error => { if (error.code !== 'EPIPE') reject(error); });
    child.on('error', error => { clearTimeout(watchdog); reject(error); });
    child.on('close', code => { clearTimeout(watchdog); resolve({ code, stdout, stderr }); });
    child.stdin.end(input);
  });
}

async function runServer(lines, directory, script = server) {
  const result = await runProgram(script, `${lines.join('\n')}\n`, directory);
  return { ...result, messages: result.stdout.trim() ? result.stdout.trim().split('\n').map(JSON.parse) : [] };
}

test('proof server advertises a plugin-owned resource with no network permissions', async () => {
  const result = await runServer([
    request(1, 'initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'synthetic-test', version: '1' } }),
    request(undefined, 'notifications/initialized'),
    request(2, 'tools/list'), request(3, 'resources/list'),
    request(4, 'resources/read', { uri: 'ui://claude-mods/native-proof' }), request(5, 'ping'),
  ]);
  assert.equal(result.code, 0);
  assert.equal(result.stderr, '');
  assert.deepEqual(result.messages.map(value => value.id), [1, 2, 3, 4, 5]);
  assert.equal(result.messages[0].result.protocolVersion, '2025-11-25');
  const tools = result.messages[1].result.tools;
  assert.deepEqual(tools.map(value => value.name), ['mods.proof', 'mods.status']);
  assert.equal(tools[0]._meta.ui.resourceUri, 'ui://claude-mods/native-proof');
  const content = result.messages[3].result.contents[0];
  assert.equal(content.mimeType, 'text/html;profile=mcp-app');
  assert.deepEqual(content._meta.ui.csp, { connectDomains: [], resourceDomains: [] });
  assert.match(content.text, /plugin-owned MCP App/);
  assert.match(content.text, /Test local interaction/);
});

test('proof status reports missing data without reading project or private session content', async (t) => {
  const directory = await temporaryDirectory(t);
  const missing = join(directory, 'synthetic-private-data');
  const absent = await runServer([request(1, 'tools/call', { name: 'mods.status', arguments: {} })]);
  assert.equal(absent.messages[0].result.structuredContent.available, false);
  const unreadable = await runServer([request(1, 'tools/call', { name: 'mods.status', arguments: {} })], missing);
  assert.equal(unreadable.messages[0].result.structuredContent.available, false);
  assert.doesNotMatch(unreadable.stdout + unreadable.stderr, /synthetic-private-data/);
  await assert.rejects(lstat(missing), /ENOENT/);
});

test('proof status exposes only retained aggregate metadata', { skip: process.platform === 'win32' }, async (t) => {
  const directory = await temporaryDirectory(t);
  await appendJournalEntry(directory, { event: 'SessionStart' });
  await appendJournalEntry(directory, { event: 'PreToolUse', tool: 'Bash', decision: 'deny' });
  const result = await runServer([request(1, 'tools/call', { name: 'mods.status', arguments: {} })], directory);
  assert.equal(result.code, 0);
  assert.deepEqual(result.messages[0].result.structuredContent, {
    available: true, records: 2, status: 'journal records summarized', denials: 1,
    events: { PreToolUse: 1, SessionStart: 1 }, tools: { Bash: 1 },
  });
  assert.doesNotMatch(result.stdout, /recordedAt|transcript|session_id|tool_input/);
});

test('proof server rejects malformed envelopes and tool parameters without reflecting payloads', async () => {
  const lines = ['{"synthetic-secret"', 'null', '[]', request({ syntheticSecret: true }, 'ping')];
  for (const argumentsValue of [null, false, 0, '', [], { prompt: 'synthetic-secret' }]) {
    lines.push(request(lines.length, 'tools/call', { name: 'mods.status', arguments: argumentsValue }));
  }
  lines.push(request(20, 'tools/call', { name: 'unknown', arguments: {} }));
  lines.push(request(21, 'tools/call', null));
  lines.push(request(22, 'resources/read', { uri: 'file:///synthetic-secret' }));
  const result = await runServer(lines);
  assert.equal(result.code, 0);
  assert.equal(result.messages.length, lines.length);
  assert.ok(result.messages.every(value => value.error));
  assert.equal(result.messages[0].error.code, -32700);
  assert.equal(result.messages[3].id, null);
  assert.doesNotMatch(result.stdout + result.stderr, /synthetic-secret|syntheticSecret/);
});

test('proof server terminates boundedly on oversized input and queued request floods', async () => {
  const oversized = await runProgram(server, 'x'.repeat(1024 * 1024 + 1));
  assert.notEqual(oversized.code, 0);
  assert.match(oversized.stderr, /input limit/);
  const flood = await runServer(Array.from({ length: 1000 }, (_, i) => request(i, 'ping')));
  assert.notEqual(flood.code, 0);
  assert.match(flood.stderr, /request queue limit/);
});

test('proof resource refuses a symlink or oversized source file', { skip: process.platform === 'win32' }, async (t) => {
  const directory = await temporaryDirectory(t);
  await cp(join(root, 'src'), join(directory, 'src'), { recursive: true });
  await mkdir(join(directory, 'proofs'));
  const script = join(directory, 'proofs', 'server.mjs');
  await copyFile(server, script);
  const resource = join(directory, 'proofs', 'ui.html');
  await writeFile(resource, 'x'.repeat(256 * 1024 + 1));
  const oversized = await runServer([request(1, 'resources/read', { uri: 'ui://claude-mods/native-proof' })], undefined, script);
  assert.ok(oversized.messages[0].error);
  await rm(resource);
  const secret = join(directory, 'synthetic-secret');
  await writeFile(secret, 'synthetic-secret-content');
  await symlink(secret, resource);
  const linked = await runServer([request(1, 'resources/read', { uri: 'ui://claude-mods/native-proof' })], undefined, script);
  assert.ok(linked.messages[0].error);
  assert.doesNotMatch(linked.stdout + linked.stderr, /synthetic-secret/);
});

test('proof UI allows one pending refresh and stops requests after teardown (simulated bridge)', async () => {
  const html = await readFile(join(root, 'proofs', 'ui.html'), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const elements = new Map(['#connection', '#count', '#clicks', '#refresh', '#activity'].map(key => [key, { disabled: key === '#refresh', textContent: '' }]));
  const messages = [], listeners = new Map(), timers = new Map();
  let timerId = 0;
  const parent = { postMessage: message => messages.push(message) };
  runInNewContext(script, {
    parent, document: { querySelector: key => elements.get(key), documentElement: { style: { setProperty() {} } } },
    addEventListener: (name, callback) => listeners.set(name, callback),
    setTimeout: callback => { timers.set(++timerId, callback); return timerId; }, clearTimeout: id => timers.delete(id),
  }, { timeout: 1000 });
  const receive = message => listeners.get('message')({ source: parent, data: { jsonrpc: '2.0', ...message } });
  receive({ id: messages[0].id, result: { hostCapabilities: { serverTools: true } } });
  await new Promise(resolve => setImmediate(resolve));
  const refresh = elements.get('#refresh');
  assert.equal(refresh.disabled, false);
  const initialCount = messages.length;
  const first = refresh.onclick();
  const second = refresh.onclick();
  assert.equal(messages.length, initialCount + 1);
  assert.equal(refresh.disabled, true);
  receive({ id: messages.at(-1).id, result: { structuredContent: { records: 1 } } });
  await Promise.all([first, second]);
  assert.equal(refresh.disabled, false);
  assert.match(elements.get('#activity').textContent, /"records": 1/);
  receive({ id: 99, method: 'ui/resource-teardown' });
  const stoppedCount = messages.length;
  await refresh.onclick();
  assert.equal(messages.length, stoppedCount);
  assert.equal(timers.size, 0);
});

test('proof hook subprocess returns a visible rewrite and sanitized metadata without executing it', { skip: process.platform === 'win32' }, async (t) => {
  const directory = await temporaryDirectory(t);
  const fixture = JSON.parse(await readFile(join(root, 'fixtures', 'pre-tool-safe.json'), 'utf8'));
  const input = { ...fixture, tool_name: 'Bash', tool_input: { command: 'printf MODS_BEFORE', sandbox_permissions: 'require_escalated' } };
  const result = await runProgram(join(root, 'proofs', 'hook.mjs'), JSON.stringify(input), directory);
  assert.equal(result.code, 0);
  assert.equal(result.stderr, '');
  const output = JSON.parse(result.stdout);
  assert.match(output.systemMessage, /MODS_BEFORE -> printf MODS_AFTER/);
  assert.equal(output.hookSpecificOutput.updatedInput.command, 'printf MODS_AFTER');
  assert.equal(output.hookSpecificOutput.updatedInput.sandbox_permissions, 'require_escalated');
  const entries = await readJournalEntries(directory);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].event, 'PreToolUse');
  assert.doesNotMatch(JSON.stringify(entries), /MODS_BEFORE|MODS_AFTER|command|sandbox_permissions|session_id/);
});

test('proof hook denies the harmless marker and sanitizes malformed input diagnostics', async () => {
  const fixture = JSON.parse(await readFile(join(root, 'fixtures', 'pre-tool-safe.json'), 'utf8'));
  const hook = join(root, 'proofs', 'hook.mjs');
  const denied = await runProgram(hook, JSON.stringify({ ...fixture, tool_name: 'Bash', tool_input: { command: 'printf MODS_DENY' } }));
  assert.equal(denied.code, 0);
  assert.equal(JSON.parse(denied.stdout).hookSpecificOutput.permissionDecision, 'deny');
  const malformed = await runProgram(hook, '{"synthetic-secret"');
  assert.notEqual(malformed.code, 0);
  assert.equal(malformed.stdout, '');
  assert.match(malformed.stderr, /invalid input/);
  assert.doesNotMatch(malformed.stderr, /synthetic-secret/);
});

async function preparationProject(directory) {
  for (const name of ['src', 'proofs']) await cp(join(root, name), join(directory, name), { recursive: true });
  await copyFile(join(root, 'LICENSE'), join(directory, 'LICENSE'));
  return join(directory, 'proofs', 'prepare.mjs');
}

test('proof preparation creates an isolated snapshot and refuses an existing destination', { skip: process.platform === 'win32' }, async (t) => {
  const directory = await temporaryDirectory(t);
  const script = await preparationProject(directory);
  const first = await runProgram(script);
  assert.equal(first.code, 0);
  assert.match(first.stdout, /No installation, trust, or model call/);
  const snapshot = join(directory, '.local', 'native-marketplace', 'plugin');
  const manifest = JSON.parse(await readFile(join(snapshot, '.codex-plugin', 'plugin.json'), 'utf8'));
  await assert.rejects(lstat(join(snapshot, 'plugin.json')), /ENOENT/);
  assert.equal(manifest.hooks, './hooks.json');
  assert.equal(manifest.mcpServers, './.mcp.json');
  assert.equal(manifest.name, 'claude-mods-native-proof');
  await lstat(join(snapshot, 'proofs', 'rewrite.mjs'));
  await writeFile(join(snapshot, 'sentinel'), 'preserved');
  const second = await runProgram(script);
  assert.notEqual(second.code, 0);
  assert.match(second.stderr, /EEXIST/);
  assert.equal(await readFile(join(snapshot, 'sentinel'), 'utf8'), 'preserved');
});

test('proof preparation refuses a symlinked local-data parent', { skip: process.platform === 'win32' }, async (t) => {
  const directory = await temporaryDirectory(t);
  const project = join(directory, 'project');
  const target = join(directory, 'outside');
  await mkdir(project, { mode: 0o700 });
  await mkdir(target, { mode: 0o700 });
  const script = await preparationProject(project);
  await symlink(target, join(project, '.local'));
  const result = await runProgram(script);
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /symbolic links/);
  await assert.rejects(lstat(join(target, 'native-marketplace')), /ENOENT/);
});
