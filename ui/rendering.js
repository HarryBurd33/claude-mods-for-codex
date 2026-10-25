// Original, deliberately restricted rendering. No Mermaid runtime or upstream
// implementation is included. This trusted static script is bundled into the
// owned HTML resource, never imported from a project or a remote URL.
function parseFlowchart(source) {
  if (typeof source !== 'string' || source.length > 4096 || source.split('\n').length > 64) throw Error('Use at most 4,096 characters and 64 lines.');
  if (/[\p{Cc}\p{Cf}]/u.test(source.replaceAll('\r\n', '\n').replaceAll('\n', ''))) throw Error('Control and bidirectional formatting characters are unsupported.');
  const lines = source.trim().split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const heading = /^(?:flowchart|graph) (TD|TB|LR|RL|BT)$/.exec(lines.shift() ?? '');
  if (!heading) throw Error('Start with flowchart TD, TB, LR, RL or BT on its own line.');
  const nodes = new Map(), edges = [];
  const idPattern = '[A-Za-z][A-Za-z0-9_]{0,31}';
  const declaration = new RegExp('^(' + idPattern + ')\\["([^"\\[\\]]{1,80})"\\]$');
  const edge = new RegExp('^(' + idPattern + ')\\s+-->\\s+(' + idPattern + ')$');
  const bare = new RegExp('^' + idPattern + '$');
  function node(id) {
    if (id === 'end') throw Error('The lowercase end identifier is unsupported.');
    if (!nodes.has(id)) nodes.set(id, { id, label: id, declared: false });
    if (nodes.size > 16) throw Error('Use at most 16 nodes.');
  }
  for (const line of lines) {
    let match = declaration.exec(line);
    if (match) {
      node(match[1]);
      const prior = nodes.get(match[1]);
      if (prior.declared) throw Error('Declare each node label only once.');
      nodes.set(match[1], { id: match[1], label: match[2], declared: true });
    } else if ((match = edge.exec(line))) {
      node(match[1]); node(match[2]);
      if (match[1] === match[2]) throw Error('Self edges are unsupported; inspect the source instead.');
      edges.push({ from: match[1], to: match[2] });
      if (edges.length > 24) throw Error('Use at most 24 edges.');
    } else if (bare.test(line)) node(line);
    else throw Error('Unsupported flowchart syntax. Use one bare node, quoted rectangular node or A --> B edge per line.');
  }
  if (!nodes.size) throw Error('Add at least one node.');
  return { direction: heading[1], nodes: [...nodes.values()], edges };
}

function jsonTokens(source) {
  if (typeof source !== 'string' || source.length > 4096) throw Error('Use at most 4,096 characters.');
  try { JSON.parse(source); } catch { throw Error('Invalid JSON. Choose Plain code to inspect literal text.'); }
  // Parsing checks syntax; this bounded scanner only assigns display classes.
  // It never evaluates a token or creates markup from the input.
  const tokens = [];
  let offset = 0;
  while (offset < source.length) {
    const start = offset;
    let kind = 'punctuation';
    if (source[offset] === '"') {
      offset++;
      while (offset < source.length) {
        if (source[offset] === '\\') { offset += 2; continue; }
        if (source[offset++] === '"') break;
      }
      kind = /^\s*:/.test(source.slice(offset)) ? 'key' : 'string';
    } else if ('-0123456789'.includes(source[offset])) {
      kind = 'number';
      while (offset < source.length && /[0-9eE+.-]/.test(source[offset])) offset++;
    } else if (/[a-z]/.test(source[offset])) {
      kind = 'literal';
      while (offset < source.length && /[a-z]/.test(source[offset])) offset++;
    } else offset++;
    tokens.push({ kind, text: source.slice(start, offset) });
  }
  return tokens;
}

function localText(doc, parent, tag, value) {
  const element = doc.createElement(tag);
  element.textContent = String(value).replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, c => '\\u{' + c.codePointAt(0).toString(16) + '}');
  parent.append(element);
  return element;
}

function renderFlowchart(doc, parent, graph) {
  const horizontal = ['LR', 'RL'].includes(graph.direction), reverse = ['RL', 'BT'].includes(graph.direction);
  const ordered = reverse ? [...graph.nodes].reverse() : graph.nodes;
  // One row/column in declaration order. This is a bounded literal overview,
  // not Mermaid's automatic layout. Tables retain every node and edge.
  const positions = new Map(ordered.map((node, index) => [node.id, { x: horizontal ? 30 + index * 200 : 50, y: horizontal ? 90 : 30 + index * 110 }]));
  const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${horizontal ? ordered.length * 200 + 30 : 280} ${horizontal ? 240 : ordered.length * 110 + 20}`);
  svg.setAttribute('class', 'local-flowchart'); svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Restricted flowchart overview. Complete node labels and directed edges follow in tables. Layout follows declaration order.');
  function add(tag, attrs, value) {
    const element = doc.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, String(value));
    if (value !== undefined) element.textContent = value;
    svg.append(element);
    return element;
  }
  for (const edge of graph.edges) {
    const a = positions.get(edge.from), b = positions.get(edge.to);
    const forward = horizontal ? b.x > a.x : b.y > a.y;
    const x1 = a.x + (horizontal && forward ? 160 : horizontal ? 0 : 80), y1 = a.y + (horizontal ? 30 : forward ? 60 : 0);
    const x2 = b.x + (horizontal && forward ? 0 : horizontal ? 160 : 80), y2 = b.y + (horizontal ? 30 : forward ? 0 : 60);
    // Route backwards/skipping edges outside the boxes, without user-supplied
    // path commands, marker URLs, HTML labels, images, links or styles.
    const lane = horizontal ? 45 : 250, sign = forward ? 1 : -1;
    const adjacent = horizontal ? Math.abs(a.x - b.x) === 200 : Math.abs(a.y - b.y) === 110;
    const points = adjacent ? `${x1},${y1} ${x2},${y2}` : horizontal
      ? `${x1},${y1} ${x1+sign*12},${y1} ${x1+sign*12},${lane} ${x2-sign*12},${lane} ${x2-sign*12},${y2} ${x2},${y2}`
      : `${x1},${y1} ${lane},${y1} ${lane},${y2-sign*12} ${x2},${y2-sign*12} ${x2},${y2}`;
    add('polyline', { points, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 });
    add('polygon', { points: horizontal ? `${x2},${y2} ${x2-sign*9},${y2-5} ${x2-sign*9},${y2+5}` : `${x2},${y2} ${x2-5},${y2-sign*9} ${x2+5},${y2-sign*9}`, fill: 'currentColor' });
  }
  for (const node of ordered) {
    const { x, y } = positions.get(node.id);
    add('rect', { x, y, width: 160, height: 60, rx: 5, fill: 'Canvas', stroke: 'currentColor', 'stroke-width': 2 });
    const label = add('text', { x: x + 8, y: y + 27, fill: 'currentColor', 'font-size': 13 });
    // Use the short safe identifier in the picture. Full Unicode labels stay
    // legible in the equivalent table rather than overflowing other nodes.
    label.textContent = node.id.length > 18 ? node.id.slice(0, 17) + '…' : node.id;
  }
  parent.append(svg);
  localText(doc, parent, 'p', 'Declaration-order overview; crossing or repeated edges may overlap. The tables are the complete representation.');
  function list(caption, headers, rows) {
    const table = doc.createElement('table'); localText(doc, table, 'caption', caption);
    const head = table.createTHead().insertRow();
    for (const title of headers) localText(doc, head, 'th', title).scope = 'col';
    const body = table.createTBody();
    for (const values of rows) { const row = body.insertRow(); for (const value of values) localText(doc, row, 'td', value); }
    parent.append(table);
  }
  list('Nodes', ['Identifier', 'Label'], graph.nodes.map(node => [node.id, node.label]));
  list('Directed edges', ['From', 'To'], graph.edges.map(edge => [edge.from, edge.to]));
}

function renderLocalPreview(doc, parent, format, source) {
  parent.replaceChildren();
  try {
    if (typeof source !== 'string' || source.length > 4096) throw Error('Use at most 4,096 characters.');
    if (format === 'flowchart') renderFlowchart(doc, parent, parseFlowchart(source));
    else if (format === 'json' || format === 'code') {
      const tokens = format === 'json' ? jsonTokens(source) : [{ kind: 'plain', text: source }];
      const pre = doc.createElement('pre'), code = doc.createElement('code');
      pre.setAttribute('aria-label', format === 'json' ? 'Read-only highlighted JSON' : 'Read-only plain code');
      for (const token of tokens) localText(doc, code, 'span', token.text).setAttribute('class', 'syntax-' + token.kind);
      pre.append(code); parent.append(pre);
    } else throw Error('Unsupported preview format.');
    localText(doc, parent, 'p', 'Rendered locally in this panel. No file, network or model request was made.');
    return true;
  } catch (error) {
    localText(doc, parent, 'p', error.message);
    // No partial graph: keep the original as bounded, escaped source text.
    localText(doc, parent, 'pre', typeof source === 'string' ? source.slice(0, 4096) : '');
    return false;
  }
}

export { parseFlowchart, jsonTokens, renderLocalPreview };
