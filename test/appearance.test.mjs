import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { loadDashboardHtml } from '../src/dashboard-resource.mjs';

const css = await readFile(new URL('../ui/appearance.css', import.meta.url), 'utf8');
const controller = await readFile(new URL('../ui/appearance.js', import.meta.url), 'utf8');

// WCAG relative luminance, measured from shipped six-digit sRGB tokens. This
// checks our fixed colors, not native rendering, host themes or all accessibility.
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(n => parseInt(n, 16) / 255)
    .map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function ratio(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + .05) / (values[1] + .05);
}
test('fixed palettes have readable text, code, diffs, focus, borders and opaque chart colors', () => {
  for (const name of ['quiet-dark', 'quiet-light']) {
    const block = css.match(new RegExp(`:root\\[data-mods-appearance="${name}"\\]\\{([^}]+)\\}`))[1];
    const colors = Object.fromEntries([...block.matchAll(/--mods-([a-z-]+):\s*(#[a-f0-9]{6})/gi)].map(m => [m[1], m[2]]));
    for (const bg of ['bg', 'surface', 'add', 'remove']) assert.ok(ratio(colors.text, colors[bg]) >= 4.5, `${name}: text/${bg}`);
    for (const bg of ['bg', 'surface']) {
      assert.ok(ratio(colors.muted, colors[bg]) >= 4.5, `${name}: muted/${bg}`);
      for (const fg of ['focus', 'border', 'chart']) assert.ok(ratio(colors[fg], colors[bg]) >= 3, `${name}: ${fg}/${bg}`);
    }
    for (const fg of ['string', 'number']) assert.ok(ratio(colors[fg], colors.bg) >= 4.5, `${name}: code ${fg}`);
    assert.match(block, /--mods-chart-opacity:1;/);
  }
});

test('palette callback accepts fixed IDs only, preserves host styles and cannot revive after teardown', () => {
  const attributes = new Map([['data-host-marker', 'keep']]);
  const root = { style: Object.freeze({ '--color-text-primary': '#123456' }), setAttribute: (k, v) => attributes.set(k, v), removeAttribute: k => attributes.delete(k) };
  const select = {}, reset = {}, status = {};
  const mount = runInNewContext(controller + '\n;mountAppearance', {});
  const dispose = mount({ documentElement: root }, select, reset, status);
  assert.equal(select.value, 'host'); assert.equal(attributes.has('data-mods-appearance'), false);
  for (const id of ['quiet-dark', 'quiet-light']) {
    select.value = id; select.onchange(); assert.equal(attributes.get('data-mods-appearance'), id);
    assert.match(status.textContent, /Host and CLI settings are unchanged/);
  }
  let coerced = false;
  for (const value of ['url(https://invalid.example/secret)', '<style>body{display:none}</style>', 'quiet-dark;--mods-bg:red', 'x'.repeat(100000), null, { toString() { coerced = true; throw Error('coercion'); } }]) {
    select.value = value; select.onchange(); assert.equal(select.value, 'host'); assert.equal(attributes.has('data-mods-appearance'), false);
  }
  assert.equal(coerced, false);
  select.value = 'quiet-light'; select.onchange(); reset.onclick();
  assert.equal(attributes.has('data-mods-appearance'), false); assert.match(status.textContent, /Following host colors/);
  assert.equal(attributes.get('data-host-marker'), 'keep'); assert.equal(root.style['--color-text-primary'], '#123456');
  select.value = 'quiet-dark'; select.onchange(); dispose();
  assert.equal(select.disabled, true); assert.equal(reset.disabled, true);
  select.value = 'quiet-dark'; select.onchange(); reset.onclick(); dispose();
  assert.equal(attributes.has('data-mods-appearance'), false);
});

test('served appearance is fixed offline CSS/script with labeled controls and system-color precedence', async () => {
  const html = await loadDashboardHtml();
  assert.ok(html.includes(controller)); assert.ok(html.includes(css));
  assert.doesNotMatch(html, /LOCAL_APPEARANCE_CSS|LOCAL_RENDERING|localStorage|sessionStorage|indexedDB|document\.cookie|\bfetch\(|\bXMLHttpRequest\b|\bWebSocket\b|\bimport\(/);
  assert.doesNotMatch(css, /url\s*\(|@import|https?:|expression\s*\(/i);
  assert.match(html, /<label for="appearance-select">Panel palette<\/label>/);
  assert.match(html, /<option value="host">Follow host<\/option>/);
  assert.match(html, /id="appearance-status" role="status" aria-live="polite"/);
  const system = css.slice(css.indexOf('@media(forced-colors:active)'));
  for (const token of ['text:CanvasText', 'bg:Canvas', 'focus:Highlight', 'chart:CanvasText']) assert.ok(system.includes(`--mods-${token}`));
  assert.match(html, /\.event-bar\{fill:var\(--mods-chart\)/);
  assert.match(html, /\.local-flowchart rect\{fill:var\(--mods-bg\)/);
  assert.match(html, /\.diff-add\{background:var\(--mods-add\)/);
});
