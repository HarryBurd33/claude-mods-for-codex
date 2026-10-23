import { cp, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareDataDirectory } from '../src/journal.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const market = join(root, '.local', 'native-marketplace');
await prepareDataDirectory(join(root, '.local'));
// Exclusive creation: a prior snapshot or a colliding path must never be overwritten.
await mkdir(market, { mode: 0o700 });
await mkdir(join(market, '.agents', 'plugins'), { recursive: true, mode: 0o700 });
const target = join(market, 'plugin');
const dataDirectory = join(root, '.local', 'proof-data');
const quote = value => "'" + value.replaceAll("'", "'\\''") + "'";
await mkdir(target, { mode: 0o700 });
for (const name of ['src', 'proofs']) await cp(join(root, name), join(target, name), { recursive: true, errorOnExist: true });
await cp(join(root, 'LICENSE'), join(target, 'LICENSE'));
const save = (name, value) => writeFile(join(target, name), `${JSON.stringify(value, null, 2)}\n`);
await mkdir(join(target, '.codex-plugin'), { mode: 0o700 });
await save('.codex-plugin/plugin.json', {
  name: 'claude-mods-native-proof', version: '0.0.2', description: 'Harmless native integration probes; incomplete development checkpoint.',
  license: 'MIT', hooks: './hooks.json', mcpServers: './.mcp.json',
  interface: { displayName: 'Claude Mods Native Proof', shortDescription: 'Harmless hook and UI probes', category: 'Developer Tools', capabilities: ['Interactive', 'Read'] },
});
// No portable root manifest: released 0.163/0.164 explicitly skip its hooks.
// Legacy MCP resolves cwd relative to its package, but does not expand PLUGIN_ROOT.
await save('.mcp.json', { mcpServers: { 'mods-proof': { command: 'node', args: ['proofs/server.mjs'], cwd: '.', env: { CODEX_MODS_PROOF_DATA: dataDirectory } } } });
await save('hooks.json', { hooks: Object.fromEntries(['SessionStart', 'PreToolUse', 'PostToolUse'].map(event => [event, [{ hooks: [{ type: 'command', command: `node "${'${PLUGIN_ROOT}'}/proofs/hook.mjs" ${quote(dataDirectory)}`, timeout: 5, statusMessage: 'Claude Mods native proof' }] }]])) });
await writeFile(join(market, '.agents', 'plugins', 'marketplace.json'), JSON.stringify({ name: 'claude-mods-dev', interface: { displayName: 'Claude Mods development proofs' }, plugins: [{ name: 'claude-mods-native-proof', source: { source: 'local', path: './plugin' }, policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' }, category: 'Developer Tools' }] }, null, 2));
console.log('Prepared .local/native-marketplace. No installation, trust, or model call performed.');
