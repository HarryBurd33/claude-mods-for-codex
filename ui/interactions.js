import { validateInteractionComponents } from '../src/interaction-contract.mjs';
import { renderLocalPreview } from './rendering.js';

// Fresh webview memory only. No bridge, storage, model, network or path access.
export function mountInteractionCards(doc, container, definitions) {
  const selected = validateInteractionComponents(definitions).filter(c => c.enabled);
  const disposers = []; let disposed = false;
  function add(parent, tag, text) {
    const e = doc.createElement(tag); if (text !== undefined) e.textContent = text; parent.append(e); return e;
  }
  selected.forEach((card, ci) => {
    const group = add(container, 'fieldset'); group.setAttribute('class', 'interaction-card'); group.setAttribute('data-interaction-id', card.id);
    add(group, 'legend', card.title);
    add(group, 'p', 'Local preview only. Up to 4,096 characters per field. Text is not saved or sent to tools, models or the network. Do not paste credentials.');
    const fields = card.fields.map((f, fi) => {
      // Positional IDs cannot collide through author-controlled slug concatenation.
      const label = add(group, 'label', f.label), id = `mods-local-field-${ci}-${fi}`;
      label.setAttribute('for', id);
      add(group, 'p', `Fixed format: ${f.format === 'flowchart' ? 'restricted Mermaid flowchart subset' : f.format === 'json' ? 'highlighted JSON' : 'plain code'}.`);
      const input = add(group, 'textarea'); input.setAttribute('id', id); input.setAttribute('class', 'preview-source');
      input.setAttribute('maxlength', '4096'); input.setAttribute('spellcheck', 'false'); input.setAttribute('data-interaction-field', f.id);
      input.value = '';
      const result = add(group, 'div'); result.setAttribute('aria-live', 'polite');
      return { input, result, format: f.format };
    });
    const row = add(group, 'div'); row.setAttribute('class', 'row');
    const render = add(row, 'button', 'Render fields locally'), clear = add(row, 'button', 'Clear fields and previews');
    for (const [button, action] of [[render, 'render'], [clear, 'clear']]) {
      button.setAttribute('type', 'button'); button.setAttribute('data-interaction-action', action);
      button.setAttribute('aria-label', `${card.title}: ${button.textContent}`);
    }
    const status = add(group, 'p', 'No preview rendered.'); status.setAttribute('role', 'status');
    function reset() { for (const f of fields) { f.input.value = ''; f.result.replaceChildren(); } status.textContent = 'Fields and previews cleared.'; }
    function invalid() {
      let bad = false;
      for (const f of fields) if (typeof f.input.value !== 'string' || f.input.value.length > 4096) { f.input.value = ''; bad = true; }
      if (bad) { for (const f of fields) f.result.replaceChildren(); status.textContent = 'Invalid input cleared. Use text up to 4,096 characters per field.'; }
      return bad;
    }
    for (const f of fields) f.input.oninput = () => {
      if (disposed) return;
      f.result.replaceChildren(); if (!invalid()) status.textContent = 'Edited; render again to update this field.';
    };
    render.onclick = () => {
      if (disposed || invalid()) return;
      const count = fields.reduce((n, f) => n + Number(renderLocalPreview(doc, f.result, f.format, f.input.value)), 0);
      status.textContent = `Rendered ${count} of ${fields.length} fields locally. No tool, model or network request.`;
    };
    clear.onclick = () => { if (!disposed) reset(); };
    disposers.push(() => { reset(); render.disabled = clear.disabled = true; for (const f of fields) { f.input.disabled = true; f.input.oninput = null; } });
  });
  return () => { if (disposed) return; disposed = true; for (const dispose of disposers) dispose(); container.replaceChildren(); };
}
