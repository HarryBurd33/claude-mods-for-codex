import { mountInteractionCards } from '../ui/interactions.js';

// Minimal synthetic DOM for replaying the actual trusted controller/renderer.
// No browser, eval, commands, network, storage or arbitrary callbacks in fixtures.
class ReplayElement {
  constructor(tag) { this.tagName = tag; this.children = []; this.attributes = {}; this.value = ''; this.ownText = ''; }
  get textContent() { return this.ownText + this.children.map(c => c.textContent).join(''); }
  set textContent(value) { this.ownText = value; this.children = []; }
  append(child) { this.children.push(child); }
  replaceChildren() { this.children = []; this.ownText = ''; }
  setAttribute(k, v) { this.attributes[k] = v; }
  createTHead() { const e = new ReplayElement('thead'); this.append(e); return e; }
  createTBody() { const e = new ReplayElement('tbody'); this.append(e); return e; }
  insertRow() { const e = new ReplayElement('tr'); this.append(e); return e; }
}
const nodes = e => [e, ...e.children.flatMap(nodes)];
export function interactionFixtures(component) {
  const input = Object.fromEntries(component.interaction.fields.map(f => [f.id, f.format === 'json' ? '{"sample":"<synthetic>","count":3}' : f.format === 'flowchart' ? 'flowchart LR\nA["Review"]\nA --> B' : 'printf SYNTHETIC_DATA_ONLY']));
  const first = component.interaction.fields[0].id;
  return { cases: ['render', 'edit', 'clear', 'malformed', 'oversized', 'dispose'].map(action => ({ action, input: { ...input, ...(action === 'malformed' ? { [first]: 42 } : action === 'oversized' ? { [first]: 'x'.repeat(4097) } : {}) } })) };
}
export function replayInteraction(component, fixtures) {
  const definition = { id: component.id, ...component.interaction };
  return { enabled: definition.enabled, renderer: 'Actual bundled local controller/renderer with a minimal synthetic DOM, not native host acceptance',
    cases: fixtures.cases.map(c => {
      const doc = { createElement: tag => new ReplayElement(tag), createElementNS: (_ns, tag) => new ReplayElement(tag) }, root = new ReplayElement('div');
      const dispose = mountInteractionCards(doc, root, [definition]);
      try {
        if (!definition.enabled) return { action: c.action, controls: 0, rendered: 0, cleared: true };
        const all = nodes(root), inputs = all.filter(e => e.tagName === 'textarea');
        const render = all.find(e => e.attributes['data-interaction-action'] === 'render'), clear = all.find(e => e.attributes['data-interaction-action'] === 'clear');
        for (const input of inputs) input.value = c.input[input.attributes['data-interaction-field']];
        render.onclick();
        const status = all.find(e => e.attributes.role === 'status');
        const rendered = Number(status.textContent.match(/^Rendered (\d+) of /)?.[1] ?? 0);
        if (c.action === 'edit') { inputs[0].value = 'Edited synthetic data'; inputs[0].oninput(); }
        else if (c.action === 'clear') clear.onclick();
        else if (c.action === 'dispose') { dispose(); render.onclick(); clear.onclick(); }
        return { action: c.action, controls: inputs.length, rendered,
          invalidInputCleared: ['malformed', 'oversized'].includes(c.action) ? inputs[0].value === '' : null,
          cleared: inputs.every(e => e.value === '') && !nodes(root).some(e => ['pre', 'svg'].includes(e.tagName)),
          editInvalidated: c.action === 'edit' ? status.textContent === 'Edited; render again to update this field.' : null,
          disposed: c.action === 'dispose' ? root.children.length === 0 && render.disabled && clear.disabled : null };
      } finally { dispose(); }
    }), synthetic: true, writes: false, executesFixtureCommands: false, modelCalls: 0, network: false };
}
