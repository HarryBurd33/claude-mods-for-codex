import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { runInNewContext } from 'node:vm';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFile, mkdtemp, writeFile, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createImpactReview, MAX_IMPACT_REVIEW_BYTES } from '../src/impact-review.mjs';
import { assessCommandImpact } from '../src/impact.mjs';
import { runCli } from '../src/cli.mjs';
import { loadDashboardHtml } from '../src/dashboard-resource.mjs';
import { dispatch, assertSafeOutput } from '../src/dispatcher.mjs';
import { validateConfig } from '../src/config.mjs';

const synthetic = "printf 'example git clean --dry-run SYNTHETIC_PRIVATE'";
const event = JSON.parse(await readFile(new URL('../fixtures/pre-tool-safe.json', import.meta.url), 'utf8'));
const guard = enabled => validateConfig({ version: 1, mods: [{ id: 'impact', type: 'blastRadiusGuard', enabled, categories: ['git-clean'] }] });
const envelope = command => ({ ...event, tool_name: 'Bash', tool_input: { command } });

test('review is redacted assessment with explicit non-authoritative next steps, including false positives and misses', () => {
  const review = createImpactReview({ command: synthetic });
  assert.equal(review.review, 'signals-found');
  assert.equal(review.execution, 'not-executed');
  assert.deepEqual(review.nextSteps.map(s => s.id), ['stop', 'revise', 'policy']);
  assert.match(review.authority, /No pending call is held or approved/);
  assert.match(review.nextSteps[2].detail, /separate narrow configuration review/);
  assert.doesNotMatch(JSON.stringify(review), /SYNTHETIC_PRIVATE|printf|command":|permissionDecision|updatedInput|token/);
  for (const command of ['printf harmless', 'custom-delete-wrapper']) {
    const r = createImpactReview({ command });
    assert.equal(r.review, 'no-known-signals'); assert.match(r.limits, /No matches does not mean safe/);
    assert.equal(r.nextSteps.length, 3); assert.equal(r.assessmentOnly, true);
  }
  assert.equal(assessCommandImpact('é'.repeat(524288)).matches.length, 0);
  assert.throws(() => assessCommandImpact('é'.repeat(524289)));
});

test('exact bounded data input refuses hidden fields, getters, invalid and oversized values without echo', () => {
  let called = false;
  for (const v of [null, [], {}, { command: '' }, { command: ' ' }, { command: 1 }, { command: 'x'.repeat(4097) }, { command: 'x', approve: true }, Object.create({ command: 'x' }), Object.defineProperty({}, 'command', { get() { called = true; return 'x'; } }), { command: 'x', [Symbol('private')]: true }]) assert.throws(() => createImpactReview(v), /bounded command field/);
  assert.equal(called, false);
  assert.equal(createImpactReview({ command: 'x'.repeat(4096) }).execution, 'not-executed');
  assert.equal(createImpactReview({ command: '<script>\u202e\u0000PRIVATE' }).review, 'no-known-signals');
});

test('CLI review treats stdin only as data, strict options/bounds; legacy impact output remains assessment-only', async () => {
  let out = '';
  await runCli(['impact-review', '--stdin'], { stdin: Readable.from([JSON.stringify({ command: synthetic })]), stdout: { write: s => out += s } });
  assert.equal(JSON.parse(out).review, 'signals-found'); assert.doesNotMatch(out, /SYNTHETIC_PRIVATE/);
  for (const [args, input] of [[['impact-review'], '{}'], [['impact-review', '--stdin', '--approve'], '{}'], [['impact-review', '--stdin'], '{PRIVATE_BROKEN'], [['impact-review', '--stdin'], JSON.stringify({ command: 'x', decision: 'allow' })], [['impact-review', '--stdin'], ' '.repeat(MAX_IMPACT_REVIEW_BYTES + 1)]]) {
    let written = ''; await assert.rejects(runCli(args, { stdin: Readable.from([input]), stdout: { write: s => written += s } })); assert.equal(written, '');
  }
  out = ''; await runCli(['impact', '--stdin'], { stdin: Readable.from(['{"command":"printf harmless"}']), stdout: { write: s => out += s } });
  assert.equal(JSON.parse(out).review, undefined); assert.equal(JSON.parse(out).assessmentOnly, true);
});

class Element {
  constructor(tag) { this.tagName = tag; this.children = []; this.textContent = ''; this.value = ''; this.attributes = {}; }
  append(e) { this.children.push(e); }
  replaceChildren() { this.children = []; this.textContent = ''; }
  setAttribute(k, v) { this.attributes[k] = v; }
}
const descendants = e => [e, ...e.children.flatMap(descendants)];

test('local choice UI requires fresh assessment; edits, errors, clear and teardown invalidate old choices (simulated DOM)', async () => {
  const ui = await readFile(new URL('../ui/impact-review.js', import.meta.url), 'utf8');
  const mount = runInNewContext(ui + '\n;mountImpactReview', { createImpactReview: value => createImpactReview(JSON.parse(JSON.stringify(value))) });
  const doc = { createElement: tag => new Element(tag) }, source = new Element('textarea'), result = new Element('div'), assess = new Element('button'), clear = new Element('button');
  const dispose = mount(doc, source, result, assess, clear);
  source.value = synthetic; assess.onclick();
  let nodes = descendants(result); const old = nodes.find(n => n.textContent === 'Review policy separately');
  assert.ok(old); assert.ok(nodes.some(n => n.textContent === 'No next step chosen.'));
  assert.equal(nodes.some(n => /SYNTHETIC_PRIVATE/.test(n.textContent)), false);
  old.onclick(); assert.ok(descendants(result).some(n => /No policy edit or execution occurs here/.test(n.textContent)));
  source.value = 'printf harmless'; source.oninput(); assert.equal(result.children.length, 0); old.onclick(); assert.equal(result.children.length, 0);
  assess.onclick(); nodes = descendants(result); assert.ok(nodes.some(n => /safety is unknown/.test(n.textContent)));
  const revise = nodes.find(n => n.textContent === 'Revise request'); revise.onclick();
  clear.onclick(); assert.equal(source.value, ''); assert.equal(result.children.length, 0);
  source.value = 'x'.repeat(4097); assess.onclick(); assert.equal(descendants(result).filter(n => n.tagName === 'button').length, 0);
  source.value = '<script>PRIVATE</script>'; assess.onclick(); assert.equal(descendants(result).some(n => /PRIVATE/.test(n.textContent)), false);
  dispose(); assert.equal(source.value, ''); assert.equal(result.children.length, 0); assert.equal(assess.disabled, true); revise.onclick(); assess.onclick(); assert.equal(result.children.length, 0);
});

test('actual served offline script navigates/assesses/chooses/clears without tool requests even when host disconnected (simulated bridge)', async () => {
  const html = await loadDashboardHtml(), script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const elements = new Map(); const get = id => { if (!elements.has(id)) elements.set(id, new Element('div')); return elements.get(id); };
  const nav = ['activity', 'preview', 'impact'].map(view => Object.assign(new Element('button'), { dataset: { view } }));
  const sections = nav.map(b => Object.assign(new Element('section'), { id: b.dataset.view }));
  const doc = { querySelector: id => get(id), querySelectorAll: s => s === 'nav button' ? nav : sections, createElement: tag => new Element(tag) };
  const messages = [], callbacks = [], parent = { postMessage: m => messages.push(m) }; let message;
  runInNewContext(script, { document: doc, parent, TextEncoder, setTimeout: f => { callbacks.push(f); return callbacks.length; }, clearTimeout() {}, addEventListener: (name, fn) => { if (name === 'message') message = fn; } }, { timeout: 1000 });
  assert.equal(messages.length, 1); assert.equal(messages[0].method, 'ui/initialize');
  // Reject the bridge, then local analysis must remain usable without a service.
  message({ source: parent, data: { jsonrpc: '2.0', id: messages[0].id, error: { code: -1 } } });
  await Promise.resolve(); nav[2].onclick();
  assert.equal(get('#refresh').disabled, true); assert.equal(get('#watch').disabled, true);
  get('#impact-source').value = synthetic; get('#impact-assess').onclick();
  const buttons = descendants(get('#impact-result')).filter(n => n.tagName === 'button'); assert.equal(buttons.length, 3);
  for (const b of buttons) b.onclick(); assert.equal(messages.length, 1);
  // Host teardown clears sensitive source and prevents retained handlers reuse.
  message({ source: parent, data: { jsonrpc: '2.0', id: 99, method: 'ui/resource-teardown', params: {} } });
  assert.equal(get('#impact-source').value, ''); assert.equal(get('#impact-result').children.length, 0);
  assert.equal(messages.length, 2); assert.equal(messages[1].id, 99); assert.deepEqual(Object.keys(messages[1].result), []);
  get('#impact-assess').onclick(); assert.equal(get('#impact-result').children.length, 0);
  assert.doesNotMatch(html, /innerHTML|outerHTML|insertAdjacentHTML|\beval\(|\bfetch\(|localStorage|sessionStorage/);
});

test('assessment/choices never change a denial or permission fields; original and rewritten signals remain denied', () => {
  const command = envelope(synthetic), config = guard(true);
  const before = dispatch(command, config).output;
  assert.match(before.hookSpecificOutput.permissionDecisionReason, /do not rerun unchanged/);
  const review = createImpactReview({ command: synthetic });
  for (const step of review.nextSteps) { assert.ok(step.id); assert.deepEqual(dispatch(command, config).output, before); }
  assertSafeOutput(before, command);
  assert.deepEqual(dispatch(command, guard(false)).output, {});
  for (const reversed of [false, true]) {
    const mods = [{ id: 'rewrite', type: 'exactCommandRewrite', enabled: true, rules: [{ toolName: 'Bash', fromCommand: 'printf REVIEW_CONTROL', toCommand: synthetic }] }, { id: 'impact', type: 'blastRadiusGuard', enabled: true, categories: ['git-clean'] }];
    if (reversed) mods.reverse();
    const out = dispatch(envelope('printf REVIEW_CONTROL'), validateConfig({ version: 1, mods })).output;
    assert.equal(out.hookSpecificOutput.permissionDecision, 'deny'); assert.equal(out.hookSpecificOutput.updatedInput, undefined);
  }
});

test('real CLI and hook subprocesses assess/deny without executing embedded harmless print (synthetic, not native)', async t => {
  const run = (path, input, args = [], env = process.env) => new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [path, ...args], { stdio: ['pipe', 'pipe', 'pipe'], env }); let stdout = '', stderr = '';
    const timer = setTimeout(() => { p.kill('SIGKILL'); reject(Error('Test subprocess deadline')); }, 5000);
    t.after(() => { clearTimeout(timer); p.kill('SIGKILL'); });
    p.stdout.on('data', b => stdout += b); p.stderr.on('data', b => stderr += b); p.on('error', reject);
    p.on('close', code => { clearTimeout(timer); resolve({ code, stdout, stderr }); }); p.stdin.end(input);
  });
  const r = await run(fileURLToPath(new URL('../bin/codex-mods.mjs', import.meta.url)), JSON.stringify({ command: synthetic }), ['impact-review', '--stdin']);
  assert.equal(r.code, 0); assert.equal(JSON.parse(r.stdout).execution, 'not-executed'); assert.doesNotMatch(r.stdout + r.stderr, /SYNTHETIC_PRIVATE/);
  const dir = await mkdtemp(join(await realpath(tmpdir()), 'mods impact review '));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const config = join(dir, 'config.json');
  await writeFile(config, JSON.stringify({ version: 1, mods: [{ id: 'impact', type: 'blastRadiusGuard', enabled: true, categories: ['git-clean'] }] }), { mode: 0o600 });
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (key.startsWith('CODEX_MODS_') || key === 'PLUGIN_DATA') delete env[key];
  env.PLUGIN_ROOT = fileURLToPath(new URL('../', import.meta.url)); env.CODEX_MODS_CONFIG = config;
  const hook = fileURLToPath(new URL('../src/hook-main.mjs', import.meta.url));
  const denied = await run(hook, JSON.stringify(envelope(synthetic)), [], env);
  assert.equal(denied.code, 0); assert.equal(JSON.parse(denied.stdout).hookSpecificOutput.permissionDecision, 'deny');
  assert.doesNotMatch(denied.stdout + denied.stderr, /SYNTHETIC_PRIVATE/);
  const control = await run(hook, JSON.stringify(envelope('printf HARMLESS_CONTROL')), [], env);
  assert.equal(control.code, 0); assert.deepEqual(JSON.parse(control.stdout), {});
  env.CODEX_MODS_CONFIG = join(dir, 'missing.json');
  const missing = await run(hook, JSON.stringify(envelope(synthetic)), [], env);
  assert.equal(missing.code, 0); assert.equal(JSON.parse(missing.stdout).hookSpecificOutput.permissionDecision, 'deny');
  const malformed = await run(hook, '{PRIVATE_BROKEN', [], env);
  assert.equal(malformed.code, 1); assert.equal(malformed.stdout, ''); assert.doesNotMatch(malformed.stderr, /PRIVATE_BROKEN/);
  // A host may continue after this invalid-envelope failure. Never claim that
  // invalid JSON/process timeout/disconnection produces an enforcement guarantee.

});
