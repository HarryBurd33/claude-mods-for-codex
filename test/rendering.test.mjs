import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { loadDashboardHtml } from '../src/dashboard-resource.mjs';

const source = await readFile(new URL('../ui/rendering.js', import.meta.url), 'utf8');
const api = runInNewContext(source + '\n;({parseFlowchart,jsonTokens,renderLocalPreview})', {}, { timeout: 1000 });
const plain = value => JSON.parse(JSON.stringify(value));

class Element {
  constructor(tagName) { this.tagName = tagName; this.children = []; this.attributes = {}; this.textContent = ''; }
  append(child) { this.children.push(child); }
  replaceChildren() { this.children = []; this.textContent = ''; }
  setAttribute(key, value) { this.attributes[key] = value; }
  createTHead() { const e = new Element('thead'); this.append(e); return e; }
  createTBody() { const e = new Element('tbody'); this.append(e); return e; }
  insertRow() { const e = new Element('tr'); this.append(e); return e; }
}
const doc = { createElement: tag => new Element(tag), createElementNS: (_ns, tag) => new Element(tag) };
const descendants = root => [root, ...root.children.flatMap(descendants)];

test('restricted flowchart parses whole bounded input with literal labels, direction and directed edges', () => {
  for (const direction of ['TD', 'TB', 'LR', 'RL', 'BT']) {
    const graph = api.parseFlowchart(`flowchart ${direction}\r\nA["Review"]\r\nB["検証 & <text>"]\r\nA --> B`);
    assert.equal(graph.direction, direction);
    assert.deepEqual(plain(graph.nodes).map(n => n.label), ['Review', '検証 & <text>']);
    assert.deepEqual(plain(graph.edges), [{ from: 'A', to: 'B' }]);
  }
  assert.deepEqual(plain(api.parseFlowchart('graph LR\nA --> B\nA["Later label"]')).nodes.map(n => n.label), ['Later label', 'B']);
});

test('restricted flowchart rejects unsupported active syntax, malformed syntax and explicit bounds', () => {
  const bad = [
    'sequenceDiagram\nA->>B: text', 'flowchart LR\nclick A "https://example.test"',
    'flowchart LR\n%%{init: {}}%%', 'flowchart LR\nA((circle))',
    'flowchart LR\nA --> B --> C', 'flowchart LR\nA; B', 'flowchart LR\nA -->|label| B',
    'flowchart LR\nsubgraph B', 'flowchart LR\nstyle A fill:red', 'flowchart LR\nA\u202e',
    'flowchart LR\nA --> A', 'flowchart LR\nA["one"]\nA["two"]', 'flowchart LR\nend',
    'flowchart LR\nA["' + 'a'.repeat(81) + '"]',
    'flowchart LR\n' + Array.from({ length: 17 }, (_, i) => 'N' + i).join('\n'),
    'flowchart LR\n' + 'A --> B\n'.repeat(25), 'flowchart LR\n' + '\n'.repeat(64), 'a'.repeat(4097),
  ];
  for (const input of bad) assert.throws(() => api.parseFlowchart(input), undefined, input.slice(0, 80));
});

test('flowchart labels create only literal SVG text and equivalent tables, never markup or links (simulated DOM)', () => {
  for (const direction of ['LR', 'RL', 'TD', 'BT']) {
    const parent = new Element('div');
    api.renderLocalPreview(doc, parent, 'flowchart', `flowchart ${direction}\nA["<img src=x onerror=alert(1)>"]\nB["javascript:alert(1)"]\nA --> B\nB --> A`);
    const nodes = descendants(parent);
    assert.equal(nodes.filter(n => n.tagName === 'svg').length, 1);
    assert.equal(nodes.filter(n => n.tagName === 'table').length, 2);
    assert.ok(nodes.some(n => n.textContent === '<img src=x onerror=alert(1)>'));
    assert.ok(nodes.some(n => n.textContent === 'javascript:alert(1)'));
    assert.equal(nodes.some(n => ['img', 'script', 'a', 'foreignObject', 'image'].includes(n.tagName)), false);
    for (const element of nodes) for (const [key, value] of Object.entries(element.attributes)) {
      assert.doesNotMatch(key, /href|src|^on/i); assert.doesNotMatch(value, /javascript:|url\(/i);
    }
    assert.match(nodes.find(n => n.tagName === 'svg').attributes['aria-label'], /tables/);
    assert.equal(nodes.filter(n => n.tagName === 'polyline').length, 2);
  }
});

test('JSON highlighting preserves exact source before visible control escaping and never evaluates it', () => {
  const input = '{ "__proto__": "<script>literal", "list": [true, null, -12.5e+2], "quote": "a\\\"b" }';
  const tokens = api.jsonTokens(input);
  assert.equal(tokens.map(t => t.text).join(''), input);
  assert.ok(tokens.some(t => t.kind === 'key')); assert.ok(tokens.some(t => t.kind === 'number'));
  assert.ok(tokens.some(t => t.kind === 'literal'));
  assert.throws(() => api.jsonTokens('{ invalid'), /Invalid JSON/);
  assert.throws(() => api.jsonTokens('0'.repeat(4097)), /4,096/);
  const parent = new Element('div');
  api.renderLocalPreview(doc, parent, 'json', '{"text":"\u202e"}');
  assert.ok(descendants(parent).some(n => n.textContent === '"\\u{202e}"'));
  assert.equal(descendants(parent).filter(n => n.tagName === 'script').length, 0);
});

test('unsupported preview produces escaped source rather than a partial graph; plain code is literal (simulated DOM)', () => {
  const parent = new Element('div');
  api.renderLocalPreview(doc, parent, 'flowchart', 'flowchart LR\nA --> B\nclick A evil');
  assert.equal(descendants(parent).some(n => n.tagName === 'svg'), false);
  assert.ok(descendants(parent).some(n => n.tagName === 'pre' && n.textContent.endsWith('click A evil')));
  api.renderLocalPreview(doc, parent, 'code', '<script>alert(1)\u001b\u202e');
  assert.ok(descendants(parent).some(n => n.textContent === '<script>alert(1)\\u{1b}\\u{202e}'));
});

test('served UI bundles only fixed local rendering assets; no external library or active HTML sink', async () => {
  const html = await loadDashboardHtml();
  assert.equal(html.includes('/* LOCAL_RENDERING */'), false);
  assert.equal((html.match(/<script>/g) ?? []).length, 1);
  assert.equal((html.match(/<\/script>/g) ?? []).length, 1);
  assert.match(html, /function parseFlowchart\(/);
  assert.doesNotMatch(source, /innerHTML|outerHTML|insertAdjacentHTML|\beval\(|\bfetch\(|localStorage|sessionStorage/);
  assert.ok(Buffer.byteLength(html) < 256 * 1024);
});

test('export outcomes render separately from hook counts with literal accessible tables and unavailable fallback (simulated DOM)', async () => {
  const html = await loadDashboardHtml(), parent = new Element('div');
  const helpers = html.slice(html.indexOf('function visible('), html.indexOf('function eventChart('));
  const render = html.slice(html.indexOf('function render(view,data)'), html.indexOf('function stopWatch('));
  const draw = runInNewContext(helpers + '\n' + render + '\n;render', { document: doc, $: () => parent });
  draw('access', { observations: { available: true, semantics: '<script>literal', turns: { started: 2, completed: 1, failed: 1, streamErrors: 0 }, commands: { completed: 1, failed: 1, declined: 0 }, exits: { zero: 1, nonzero: 1, unavailable: 0 }, cancellation: 'unavailable', limits: 'Not live hooks' } });
  const nodes = descendants(parent), values = nodes.map(n => n.textContent);
  assert.ok(values.includes('Selected export outcomes (separate from live hooks)'));
  assert.ok(values.includes('Failed turn records')); assert.ok(values.includes('Command exit: nonzero')); assert.ok(values.includes('Cancellation detection'));
  assert.ok(values.includes('<script>literal')); assert.equal(nodes.some(n => n.tagName === 'script'), false);
  assert.ok(nodes.some(n => n.tagName === 'th' && n.scope === 'row'));
  draw('access', { observations: { available: false, reason: 'No observation export selected.' } });
  assert.equal(descendants(parent).some(n => n.textContent === 'Failed turn records'), false);
  assert.ok(descendants(parent).some(n => n.textContent === 'No observation export selected.'));
});
