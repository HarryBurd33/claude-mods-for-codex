import { fileURLToPath } from 'node:url';
import { readBoundedFile } from '../src/io.mjs';
import { readJournalEntries, summarizeJournal } from '../src/journal.mjs';

const URI = 'ui://claude-mods/native-proof';
const MAX_MESSAGE_BYTES = 1048576;
const MAX_PENDING_REQUESTS = 32;
const MAX_PENDING_BYTES = 2 * MAX_MESSAGE_BYTES;
const empty = { type: 'object', properties: {}, additionalProperties: false };
const tools = [
  { name: 'mods.proof', title: 'Claude Mods Native Proof', description: 'Open the harmless local native integration proof. No model call or project access.', inputSchema: empty, annotations: { readOnlyHint: true, openWorldHint: false }, _meta: { ui: { resourceUri: URI }, 'openai/ui': { entrypoints: [{ type: 'global' }] } } },
  { name: 'mods.status', title: 'Read probe activity', description: 'Read bounded metadata counts written by the probe hooks.', inputSchema: empty, annotations: { readOnlyHint: true, openWorldHint: false } },
];
async function status() {
  const dataDirectory = process.env.CODEX_MODS_PROOF_DATA || process.env.PLUGIN_DATA;
  if (!dataDirectory) return { available: false, reason: 'No explicit proof data directory configured.' };
  try { return { available: true, ...summarizeJournal(await readJournalEntries(dataDirectory)) }; }
  catch { return { available: false, reason: 'No readable probe activity yet.' }; }
}
async function handle(request) {
  const p = request.params ?? {};
  switch (request.method) {
    case 'initialize': return { protocolVersion: '2025-11-25', capabilities: { tools: {}, resources: {} }, serverInfo: { name: 'claude-mods-native-proof', version: '0.0.1' } };
    case 'ping': return {};
    case 'tools/list': return { tools };
    case 'resources/list': return { resources: [{ uri: URI, name: 'Native proof', mimeType: 'text/html;profile=mcp-app' }] };
    case 'resources/templates/list': return { resourceTemplates: [] };
    case 'resources/read':
      if (p.uri !== URI) throw new Error('Unknown resource');
      return { contents: [{ uri: URI, mimeType: 'text/html;profile=mcp-app', text: await readBoundedFile(fileURLToPath(new URL('./ui.html', import.meta.url)), 256 * 1024), _meta: { ui: { csp: { connectDomains: [], resourceDomains: [] } }, 'openai/ui': { preferredDisplayMode: 'fullscreen', availableDisplayModes: ['fullscreen'] } } }] };
    case 'tools/call': {
      if (!tools.some(t => t.name === p.name) || (p.arguments !== undefined && (p.arguments === null || typeof p.arguments !== 'object' || Array.isArray(p.arguments) || Object.keys(p.arguments).length))) throw new Error('Invalid tool request');
      const data = await status();
      return { content: [{ type: 'text', text: `Native probe metadata: ${JSON.stringify(data)}` }], structuredContent: data };
    }
    default: throw new Error('Unsupported request');
  }
}
let input = '';
let pending = Promise.resolve();
let pendingCount = 0;
let pendingBytes = 0;
function fail(message) {
  process.stderr.write(`mods-proof: ${message}\n`);
  process.exit(1);
}
function validId(id) {
  return (typeof id === 'string' && id.length <= 256) || Number.isSafeInteger(id);
}
function respond(response) {
  // Wait for the write callback instead of accumulating output behind a slow
  // or disconnected host. A stuck host cannot keep the probe alive forever.
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Output timeout')), 5000);
    process.stdout.write(`${JSON.stringify(response)}\n`, error => {
      clearTimeout(timeout);
      error ? reject(error) : resolve();
    });
  });
}
async function processLine(line) {
  let request;
  try { request = JSON.parse(line); }
  catch { return respond({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Invalid JSON' } }); }
  if (request === null || Array.isArray(request) || typeof request !== 'object'
    || request.jsonrpc !== '2.0' || typeof request.method !== 'string'
    || (request.id !== undefined && !validId(request.id))) {
    return respond({ jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid proof request' } });
  }
  if (request.id === undefined) return;
  try {
    if (request.params !== undefined && (request.params === null || typeof request.params !== 'object' || Array.isArray(request.params))) throw new Error('Invalid parameters');
    const result = await handle(request);
    return respond({ jsonrpc: '2.0', id: request.id, result });
  } catch {
    return respond({ jsonrpc: '2.0', id: request.id, error: { code: -32602, message: 'Invalid or unsupported proof request' } });
  }
}
process.stdout.on('error', () => fail('output unavailable'));
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  input += chunk;
  if (Buffer.byteLength(input) > MAX_MESSAGE_BYTES) fail('input limit');
  let end;
  while ((end = input.indexOf('\n')) >= 0) {
    const line = input.slice(0, end); input = input.slice(end + 1);
    const bytes = Buffer.byteLength(line);
    if (++pendingCount > MAX_PENDING_REQUESTS || (pendingBytes += bytes) > MAX_PENDING_BYTES) fail('request queue limit');
    pending = pending.then(() => processLine(line)).catch(() => fail('output unavailable')).finally(() => {
      pendingCount -= 1;
      pendingBytes -= bytes;
    });
  }
});
process.stdin.on('end', () => {
  if (input.trim().length) fail('unterminated request');
});
