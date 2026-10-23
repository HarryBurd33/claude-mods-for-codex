import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { runMcpServer } from '../src/mcp-stdio.mjs';
import { holdProof } from '../proofs/hold.mjs';

const tick = () => new Promise(resolve => setImmediate(resolve));
function transport(t, handle, { slow = false } = {}) {
  const input = new PassThrough(), output = new EventEmitter(), messages = [], writes = [], diagnostics = [];
  output.write = (line, callback) => { messages.push(JSON.parse(line)); writes.push(callback); if (!slow) queueMicrotask(() => callback()); return !slow; };
  const server = runMcpServer(handle, { input, output, diagnostic: { write: text => diagnostics.push(text) } });
  t.after(() => { server.stop(); input.destroy(); });
  return { input, output, messages, writes, diagnostics, stop: server.stop, send: message => input.write(JSON.stringify({ jsonrpc: '2.0', ...message }) + '\n') };
}
const holdEvent = { hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'printf MODS_HOLD' } };
const holdHandler = (request, { signal, requestHost }) => holdProof(request.params, { enabled: true, signal, elicit: (params, { signal }) => requestHost('elicitation/create', params, { signal, timeoutMs: 1000 }) });

test('transport bounds malformed-message output flooding and never stacks writes on a slow host (synthetic)', async t => {
  const p = transport(t, async () => ({}), { slow: true }), priorExit = process.exitCode;
  try {
    p.input.write('{\n'.repeat(1000));
    await tick();
    assert.equal(p.writes.length, 1, 'only one write may await a callback');
    assert.equal(p.diagnostics.length, 1, 'output queue overflow fails once');
    assert.equal(p.input.destroyed, true);
    p.writes[0]();
    await tick();
    assert.equal(p.writes.length, 1, 'late callback cannot restart output after failure');
  } finally { process.exitCode = priorExit; }
});

test('transport serializes ordinary replies and parse errors through the same output queue (synthetic)', async t => {
  const p = transport(t, async () => ({ ok: true }), { slow: true });
  p.send({ id: 1, method: 'ping' }); await tick();
  p.input.write('{\n'); p.send({ id: 2, method: 'ping' }); await tick();
  assert.equal(p.writes.length, 1);
  p.writes[0](); await tick(); assert.equal(p.writes.length, 2); assert.equal(p.messages[1].error.code, -32700);
  p.writes[1](); await tick(); assert.equal(p.writes.length, 3); assert.equal(p.messages[2].id, 2);
  p.writes[2]();
});

test('a stalled output callback reaches the transport deadline and aborts active work (synthetic)', { timeout: 7000 }, async t => {
  let activeSignal;
  const p = transport(t, (_request, { signal }) => { activeSignal = signal; return {}; }, { slow: true }), priorExit = process.exitCode;
  try {
    p.send({ id: 1, method: 'ping' }); await tick();
    await new Promise(resolve => p.input.once('close', resolve));
    assert.equal(p.diagnostics.length, 1);
    assert.equal(activeSignal.aborted, true);
    assert.equal(p.writes.length, 1);
    p.writes[0](); await tick();
    assert.equal(p.writes.length, 1);
  } finally { process.exitCode = priorExit; }
});

test('transport cancellation notifies the host, denies the covered request and ignores late acceptance (synthetic)', async t => {
  const p = transport(t, holdHandler);
  p.send({ id: 'covered', method: 'tools/call', params: holdEvent }); await tick();
  const form = p.messages.find(m => m.method === 'elicitation/create'); assert.ok(form);
  p.send({ method: 'notifications/cancelled', params: { requestId: 'covered' } }); await tick();
  assert.equal(p.messages.find(m => m.id === 'covered').result.hookSpecificOutput.permissionDecision, 'deny');
  assert.deepEqual(p.messages.find(m => m.method === 'notifications/cancelled').params, { requestId: form.id, reason: 'Host request cancelled' });
  const count = p.messages.length;
  p.send({ id: form.id, result: { action: 'accept', content: { confirm: true } } }); await tick();
  assert.equal(p.messages.length, count);
});

test('transport deadline cancels its outgoing form instead of leaving a host wait pending (synthetic)', async t => {
  const p = transport(t, (_request, { requestHost }) => requestHost('elicitation/create', {}, { timeoutMs: 10 }).then(() => ({ accepted: true }), () => ({ accepted: false })));
  p.send({ id: 1, method: 'probe' }); await new Promise(resolve => setTimeout(resolve, 20)); await tick();
  const form = p.messages.find(m => m.method === 'elicitation/create');
  assert.equal(p.messages.filter(m => m.method === 'notifications/cancelled' && m.params.requestId === form.id).length, 1);
  assert.deepEqual(p.messages.find(m => m.id === 1).result, { accepted: false });
});

test('transport processes independent host requests despite overlapping outgoing IDs and rejects malformed host responses (synthetic)', async t => {
  const p = transport(t, (request, { requestHost }) => request.method === 'hold' ? requestHost('elicitation/create', {}, { timeoutMs: 1000 }).then(() => ({ confirmed: true }), () => ({ confirmed: false })) : ({ ping: true }));
  p.send({ id: 1, method: 'hold' }); await tick();
  const form = p.messages.find(m => m.method === 'elicitation/create');
  p.send({ id: form.id, method: 'ping' }); await tick();
  assert.deepEqual(p.messages.find(m => m.id === form.id && Object.hasOwn(m, 'result')).result, { ping: true });
  p.send({ id: form.id, result: { action: 'accept' }, error: { code: -1, message: 'malformed' } }); await tick();
  assert.deepEqual(p.messages.find(m => m.id === 1).result, { confirmed: false });
});

test('stdin EOF cancels active waits and drains the denial without a retained form deadline (synthetic)', async t => {
  const p = transport(t, holdHandler);
  p.send({ id: 1, method: 'tools/call', params: holdEvent }); await tick();
  p.input.end(); await tick();
  assert.equal(p.messages.find(m => m.id === 1).result.hookSpecificOutput.permissionDecision, 'deny');
});

class Element {
  constructor(tag = '') { this.tagName = tag; this.children = []; this._text = ''; this.disabled = false; this.checked = false; this.dataset = {}; this.attributes = {}; }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text + this.children.map(child => child.textContent).join(' '); }
  append(child) { this.children.push(child); }
  replaceChildren(...children) { this._text = ''; this.children = children; }
  setAttribute(key, value) { this.attributes[key] = value; }
  createTHead() { const element = new Element('thead'); this.append(element); return element; }
  createTBody() { const element = new Element('tbody'); this.append(element); return element; }
  insertRow() { const element = new Element('tr'); this.append(element); return element; }
}
async function dashboard() {
  const html = await readFile(new URL('../ui/dashboard.html', import.meta.url), 'utf8'), script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const messages = [], listeners = new Map(), timers = new Map(), elements = new Map(); let nextTimer = 0, now = 0;
  for (const id of ['connection', 'refresh', 'watch', 'notice', 'activity', 'files', 'changes', 'access', 'activity-result', 'files-result', 'changes-result', 'access-result']) { const element = new Element(); element.id = id; elements.set('#' + id, element); }
  const buttons = ['activity', 'files', 'changes', 'access'].map(view => { const element = new Element('button'); element.dataset.view = view; return element; });
  const parent = { postMessage: message => messages.push(message) };
  runInNewContext(script, {
    parent, document: { querySelector: selector => elements.get(selector), querySelectorAll: selector => selector === 'nav button' ? buttons : ['activity', 'files', 'changes', 'access'].map(id => elements.get('#' + id)), createElement: tag => new Element(tag), createElementNS: (_namespace, tag) => new Element(tag), documentElement: { style: { setProperty() {} } } },
    addEventListener: (name, callback) => listeners.set(name, callback), Date: { now: () => now },
    setTimeout: (callback, delay) => { const id = ++nextTimer; timers.set(id, { callback, delay }); return id; }, clearTimeout: id => timers.delete(id),
  }, { timeout: 1000 });
  const receive = message => listeners.get('message')({ source: parent, data: { jsonrpc: '2.0', ...message } });
  const reply = (request, data) => receive({ id: request.id, result: { structuredContent: data } });
  const latestCall = () => messages.filter(m => m.method === 'tools/call').at(-1);
  const fire = delay => { const match = [...timers].find(([, value]) => value.delay === delay); assert.ok(match, `no ${delay}ms timer`); timers.delete(match[0]); now += delay; match[1].callback(); };
  receive({ id: messages[0].id, result: { hostCapabilities: { serverTools: true }, hostInfo: { name: 'synthetic-host' } } }); await tick();
  return { messages, timers, elements, buttons, receive, reply, latestCall, fire };
}
const revision = 'a'.repeat(64);
function descendants(node){return [node,...node.children.flatMap(descendants)];}

test('owned chart shows measured counts with an equivalent table and never fabricates missing values (simulated DOM)',async()=>{
  const p=await dashboard();p.reply(p.latestCall(),{revision,records:4,events:{SessionStart:1,PreToolUse:2,PostToolUse:1,invalid:-5,unknown:null}});await tick();
  const nodes=descendants(p.elements.get('#activity-result')),svg=nodes.find(n=>n.tagName==='svg');
  assert.equal(svg.attributes.role,'img');assert.match(svg.attributes['aria-label'],/table/);
  assert.deepEqual(nodes.filter(n=>n.tagName==='rect').map(n=>n.attributes.width),['150','300','150']);
  const refresh=p.elements.get('#refresh').onclick();p.reply(p.latestCall(),{revision});await refresh;
  assert.match(p.elements.get('#activity-result').textContent,/Unavailable/);
  assert.equal(descendants(p.elements.get('#activity-result')).some(n=>n.tagName==='svg'),false);
  p.receive({id:100,method:'ui/resource-teardown'});
});

test('file tree bounds nesting, exposes literal hostile names and Git state without reading file content (simulated DOM)',async()=>{
  const p=await dashboard();p.reply(p.latestCall(),{revision,records:0});await tick();
  p.buttons.find(b=>b.dataset.view==='files').onclick();await tick();
  p.reply(p.latestCall(),{files:[{path:'src/<script>\u202e.js',status:' M',bytes:20},{path:'__proto__/safe.txt',status:'??',bytes:0},{path:'../escape'},{path:'deep/'.repeat(18)+'file'}]});await tick();
  const root=p.elements.get('#files-result'),nodes=descendants(root);
  assert.match(root.textContent,/<script>\\u\{202e\}\.js/);assert.match(root.textContent,/Git: M · 20 bytes/);assert.match(root.textContent,/__proto__/);assert.match(root.textContent,/omitted/);
  assert.equal(nodes.some(n=>n.tagName==='script'),false);assert.equal(nodes.filter(n=>n.tagName==='details').length,2);
  assert.equal(p.latestCall().params.name,'mods.files');assert.deepEqual(Object.keys(p.latestCall().params.arguments),[]);
  p.receive({id:100,method:'ui/resource-teardown'});
});

test('patch rendering is read-only literal text, retains sign semantics and caps hostile content (simulated DOM)',async()=>{
  const p=await dashboard();p.reply(p.latestCall(),{revision,records:0});await tick();
  p.buttons.find(b=>b.dataset.view==='changes').onclick();await tick();
  p.reply(p.latestCall(),{files:[{path:'fixture.txt',status:' M',diff:'@@ -1 +1 @@\n- old\n+ <img src=x onerror=alert(1)>\u001b\u202e\n'+('+line\n'.repeat(1100))}]});await tick();
  const root=p.elements.get('#changes-result'),nodes=descendants(root);
  assert.match(root.textContent,/<img src=x onerror=alert\(1\)>\\u\{1b\}\\u\{202e\}/);
  assert.match(root.textContent,/truncated/);assert.ok(nodes.some(n=>n.attributes.class==='diff-remove'));
  assert.equal(nodes.filter(n=>n.tagName==='span').length,1000);assert.equal(nodes.some(n=>n.tagName==='img'),false);
  assert.match(nodes.find(n=>n.tagName==='pre').attributes['aria-label'],/plus is addition/);
  p.receive({id:100,method:'ui/resource-teardown'});
});

test('dashboard teardown handles an ID collision with a pending UI call and clears all timers (simulated DOM)', async () => {
  const p = await dashboard(), pending = p.latestCall();
  p.receive({ id: pending.id, method: 'ui/resource-teardown' }); await tick();
  assert.equal(p.timers.size, 0);
  assert.ok(p.messages.some(m => m.id === pending.id && Object.hasOwn(m, 'result')));
  const count = p.messages.length;
  p.reply(pending, { revision, records: 99 }); await p.elements.get('#refresh').onclick(); await tick();
  assert.equal(p.messages.length, count); assert.doesNotMatch(p.elements.get('#activity-result').textContent, /99/);
});

test('dashboard watch toggles retain one generation, one sleep and no abandoned timer (simulated DOM)', async () => {
  const p = await dashboard(); p.reply(p.latestCall(), { revision, records: 1 }); await tick();
  const watch = p.elements.get('#watch');
  watch.checked = true; watch.onchange(); await tick(); const request = p.latestCall(), count = p.messages.length;
  watch.checked = false; watch.onchange(); watch.checked = true; watch.onchange(); await tick();
  assert.equal(p.messages.length, count, 'a new watch joins the current refresh instead of polling it');
  p.reply(request, { revision, records: 2 }); await tick();
  assert.equal(watch.checked, true, 'old generation cannot stop a newer watch');
  assert.deepEqual([...p.timers.values()].map(timer => timer.delay), [100]);
  watch.checked = false; watch.onchange(); await tick(); assert.equal(p.timers.size, 0);
  const stoppedCount = p.messages.length; await tick(); assert.equal(p.messages.length, stoppedCount);
  p.receive({ id: 100, method: 'ui/resource-teardown' });
});

test('dashboard defers navigation refresh until the previous view completes and renders changes.files (simulated DOM)', async () => {
  const p = await dashboard(), initial = p.latestCall();
  p.buttons.find(b => b.dataset.view === 'changes').onclick(); await tick();
  assert.equal(p.latestCall(), initial);
  p.reply(initial, { revision, records: 1 }); await tick();
  const changes = p.latestCall(); assert.equal(changes.params.name, 'mods.changes');
  p.reply(changes, { available: true, files: [{ path: 'synthetic.txt', status: ' M', diff: '+ synthetic change' }] }); await tick();
  assert.match(p.elements.get('#changes-result').textContent, /synthetic.txt/);
  assert.match(p.elements.get('#changes-result').textContent, /synthetic change/);
  p.receive({ id: 100, method: 'ui/resource-teardown' }); assert.equal(p.timers.size, 0);
});

test('dashboard teardown settles sleeping watch and timed-out calls stop watching (simulated DOM)', async () => {
  const p = await dashboard(); p.reply(p.latestCall(), { revision, records: 1 }); await tick();
  const watch = p.elements.get('#watch'); watch.checked = true; watch.onchange(); await tick();
  p.fire(5000); await tick(); assert.equal(watch.checked, false); assert.equal(p.timers.size, 0);
  watch.checked = true; watch.onchange(); await tick(); p.reply(p.latestCall(), { revision, records: 2 }); await tick();
  assert.equal(p.timers.size, 1);
  p.receive({ id: 100, method: 'ui/resource-teardown' }); await tick();
  assert.equal(watch.checked, false); assert.equal(p.timers.size, 0);
});

test('project reads get a longer view deadline while activity keeps its short wait (simulated DOM)', async () => {
  for (const view of ['files', 'changes', 'access']) {
    const p = await dashboard();
    assert.deepEqual([...p.timers.values()].map(timer => timer.delay), [5000]);
    p.reply(p.latestCall(), { revision, records: 1 }); await tick();
    p.buttons.find(button => button.dataset.view === view).onclick(); await tick();
    assert.deepEqual([...p.timers.values()].map(timer => timer.delay), [15000]);
    p.fire(15000); await tick();
    assert.match(p.elements.get('#notice').textContent, /unavailable/);
    p.receive({ id: 100, method: 'ui/resource-teardown' });
    assert.equal(p.timers.size, 0);
  }
});
