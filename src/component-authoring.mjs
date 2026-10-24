import { constants } from 'node:fs';
import { lstat, mkdir, open, readdir, realpath } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { KNOWN_EVENTS } from './constants.mjs';
import { componentFromSpec, componentAccess, componentPlan, componentIntent, validateComponent, projectStatusComponents, replayComponentEvent, componentRecord } from './component-contract.mjs';

const MAX_FILE = 32768, MAX_TOTAL = 128 * 1024;
const hash = data => createHash('sha256').update(data).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
function refuse() { throw new Error('Component bundle unavailable, incomplete, changed or unsafe; inspect the selected private artifacts'); }
export function assertComponentPlatform() {
  if (process.platform === 'win32') throw new Error('Windows component authoring IO is unavailable pending platform review');
}
function selected(input) {
  if (typeof input !== 'string' || !isAbsolute(input) || input.length > 4096 || /[\p{Cc}\p{Cf}]/u.test(input)) refuse();
  return resolve(input);
}
function privateObject(info, directory) {
  if (info.isSymbolicLink() || (directory ? !info.isDirectory() : !info.isFile() || info.nlink !== 1n)
    || (info.mode & 0o077n) !== 0n || typeof process.getuid === 'function' && info.uid !== BigInt(process.getuid())) refuse();
}
function same(a, b, content = false) {
  for (const key of ['dev', 'ino', 'uid', 'mode', ...(content ? ['size', 'mtimeNs', 'ctimeNs', 'nlink'] : [])]) if (a[key] !== b[key]) refuse();
}
async function directory(path) {
  if (await realpath(path) !== path) refuse();
  const info = await lstat(path, { bigint: true }); privateObject(info, true); return info;
}
export async function readComponentJson(input) {
  assertComponentPlatform();
  try { return JSON.parse(await readPrivate(selected(input))); } catch { refuse(); }
}
async function readPrivate(path) {
  if (await realpath(path) !== path) refuse();
  const before = await lstat(path, { bigint: true }); privateObject(before, false);
  if (before.size > BigInt(MAX_FILE)) refuse();
  const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const info = await handle.stat({ bigint: true }); privateObject(info, false); same(before, info, true);
    const buffer = Buffer.alloc(MAX_FILE + 1); let total = 0;
    while (total <= MAX_FILE) { const { bytesRead } = await handle.read(buffer, total, MAX_FILE + 1 - total, total); if (!bytesRead) break; total += bytesRead; }
    if (total > MAX_FILE) refuse();
    same(info, await handle.stat({ bigint: true }), true); same(info, await lstat(path, { bigint: true }), true);
    if (await realpath(path) !== path) refuse();
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer.subarray(0, total));
  } finally { await handle.close(); }
}

function eventFixture(name) {
  const event = { cwd: '/example/project', session_id: 'synthetic-session', transcript_path: null, hook_event_name: name,
    model: 'synthetic-model', turn_id: 'synthetic-turn', permission_mode: 'default' };
  if (name === 'SessionEnd') event.reason = 'other';
  if (name === 'SessionStart') event.source = 'startup';
  if (['Stop', 'SubagentStop'].includes(name)) { event.stop_hook_active = false; event.last_assistant_message = 'Synthetic text, never retained'; }
  if (name.includes('Compact')) event.trigger = 'manual';
  if (name.startsWith('Subagent')) { event.agent_id = 'synthetic-agent'; event.agent_type = 'synthetic-profile'; }
  if (['PreToolUse', 'PostToolUse'].includes(name)) { event.tool_name = 'Bash'; event.tool_input = { command: 'printf SYNTHETIC_COMPONENT_ONLY' }; event.tool_use_id = 'synthetic-call'; }
  if (name === 'PostToolUse') event.tool_response = 'Synthetic response, never retained';
  return event;
}
const REVIEW = `# Review this disabled component bundle

This is declarative data for Claude Mods, not a standalone plugin, native slash
callback, host-chrome replacement or executable-code template. Read component.json,
access.json and plan.json. No project/data/session/export selection is supplied.
The declaration describes bundled template behavior, not an OS sandbox.

Use the verified absolute bin/codex-mods.mjs path:
1. validate-component --bundle THIS_DIRECTORY verifies the complete private bundle.
   bundle.json is a last-written integrity/completion marker, not author trust.
2. replay-component --bundle THIS_DIRECTORY uses only generated synthetic events
   and summary.json. The malformed case must be invalid; all responses are {}.
   Defaults produce no metadata and no displayed component. Never execute fixtures.
3. Make a separate private copy of component.json outside this bundle. Change only observer.reception,
   observer.retention and/or status.enabled deliberately. Preserve the original.
   Replay with --intent PRIVATE_COPY; reception and retention are independent.
   Only both can project event-only synthetic metadata. Status reads the explicit
   synthetic summary, not replay-created activity or production state.
4. component-plan --bundle THIS_DIRECTORY --intent PRIVATE_COPY prints a fresh
   access delta and registration/hookConfig/runtimeSettings fragments for review.
   Changed title/id/events require regeneration. Never edit bundle hashes to trust
   a change. Review all source/access, preserve unrelated mods/scope/settings and
   merge only the chosen fields. No command installs, enables or trusts anything.
5. Native reception and retention need separate human selection and an existing
   reviewed project/data/session scope. Status uses only existing selected metadata.
   Install/update an immutable reviewed snapshot through supported mechanisms;
   complete human changed-code/hook trust and restart as required. No hot reload.
   Any separate model/API run needs fresh bounded human usage authorization.
6. Disable by removing only the authored status entry/chosen observer event storage
   and registration through reviewed update/reload; preserve unrelated entries and
   retained data. Rollback uses the preserved immutable source, not cache/trust
   hash edits, whole shared-config restore or automatic cleanup.

Generation/validation/replay makes no extra model/network call or project command.
Describing through a skill uses the selected model and consumes usage. Observer
processes can receive sensitive host payload in memory but retain only event/time;
status counts are retained deliveries, not success/unique turns/producer health.
Keep titles/specs/artifacts private when sensitive. Interrupted creation may leave
partial output: inspect it, do not overwrite/retry/delete it automatically. Windows
new component IO is unavailable. Pure contracts are portable, not Windows acceptance.
`;

function artifacts(component) {
  const chosen = component.observer?.events ?? component.status.events;
  const result = { 'component.json': json(component), 'access.json': json(componentAccess(component)), 'plan.json': json(componentPlan(component)),
    'summary.json': json({ available: true, events: Object.fromEntries(chosen.map((event, i) => [event, i + 2])) }), 'REVIEW.md': REVIEW };
  chosen.forEach((name, i) => { result[`fixtures/matching-${i}.json`] = json(eventFixture(name)); });
  const other = [...KNOWN_EVENTS].find(name => !chosen.includes(name));
  result['fixtures/nonmatching.json'] = json(eventFixture(other));
  result['fixtures/malformed.json'] = json({ ...eventFixture(chosen[0]), session_id: '' });
  return result;
}
function requireDisabled(c) { if (c.observer?.reception || c.observer?.retention || c.status?.enabled) refuse(); }

export async function scaffoldComponent(spec, destination) {
  assertComponentPlatform();
  const component = componentFromSpec(spec), path = selected(destination), files = artifacts(component);
  const parent = dirname(path);
  let created = false;
  try {
  // Existing parent need not be private (e.g. a repository), but must be canonical
  // and a directory. Newly created bundle and every descendant must be private.
  if (await realpath(parent) !== parent || !(await lstat(parent)).isDirectory()) refuse();
  if (Object.values(files).some(text => Buffer.byteLength(text) > MAX_FILE) || Object.values(files).reduce((n, text) => n + Buffer.byteLength(text), 0) > MAX_TOTAL) refuse();
  await mkdir(path, { mode: 0o700 }); // Exclusive: never overwrite/clean old output.
    created = true;
    const root = await directory(path); await mkdir(join(path, 'fixtures'), { mode: 0o700 });
    const fixtureDir = await directory(join(path, 'fixtures'));
    async function write(name, text) {
      same(root, await directory(path)); same(fixtureDir, await directory(join(path, 'fixtures')));
      const handle = await open(join(path, name), constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
      try { await handle.writeFile(text); } finally { await handle.close(); }
    }
    for (const [name, text] of Object.entries(files)) await write(name, text);
    // Marker is last. No automatic cleanup on error, and incomplete bundles
    // cannot be replayed/planned by the loader. Hashes are not trust/authenticity.
    await write('bundle.json', json({ version: 1, files: Object.fromEntries(Object.entries(files).map(([name, text]) => [name, hash(text)])) }));
    return { created: true, files: [...Object.keys(files), 'bundle.json'], enabled: false, registered: false, installed: false };
  } catch { throw new Error(created ? 'Component creation incomplete; inspect the selected output before recovery' : 'Component output unavailable; select a new private output under a canonical existing parent'); }
}

export async function loadComponentBundle(input, intentPath) {
  assertComponentPlatform();
  try {
    const path = selected(input), before = await directory(path), fixtures = await directory(join(path, 'fixtures'));
    const markerText = await readPrivate(join(path, 'bundle.json')), marker = JSON.parse(markerText);
    componentRecord(marker, ['version', 'files']);
    if (marker.version !== 1 || !marker.files || typeof marker.files !== 'object' || Array.isArray(marker.files)) refuse();
    const names = Object.keys(marker.files);
    if (names.length > 15 || !names.length || names.some(name => !/^(component\.json|access\.json|plan\.json|summary\.json|REVIEW\.md|fixtures\/(matching-[0-7]|nonmatching|malformed)\.json)$/.test(name) || !/^[a-f0-9]{64}$/.test(marker.files[name]))) refuse();
    const files = {}; let total = Buffer.byteLength(markerText);
    for (const name of names) { const text = await readPrivate(join(path, name)); total += Buffer.byteLength(text); if (total > MAX_TOTAL || hash(text) !== marker.files[name]) refuse(); files[name] = text; }
    const component = validateComponent(JSON.parse(files['component.json'])); requireDisabled(component);
    const expected = artifacts(component);
    if (JSON.stringify(Object.keys(files).sort()) !== JSON.stringify(Object.keys(expected).sort()) || Object.keys(expected).some(name => expected[name] !== files[name])) refuse();
    const top = ['bundle.json', ...names.filter(name => !name.includes('/')), 'fixtures'].sort();
    if (JSON.stringify((await readdir(path)).sort()) !== JSON.stringify(top) || JSON.stringify((await readdir(join(path, 'fixtures'))).sort()) !== JSON.stringify(names.filter(name => name.startsWith('fixtures/')).map(name => name.slice(9)).sort())) refuse();
    same(before, await directory(path)); same(fixtures, await directory(join(path, 'fixtures')));
    if (await readPrivate(join(path, 'bundle.json')) !== markerText) refuse();
    const selectedComponent = intentPath === undefined ? component : componentIntent(component, await readComponentJson(intentPath));
    return { component: selectedComponent, files };
  } catch { refuse(); }
}

export function replayComponentBundle(bundle) {
  return { fixtures: Object.keys(bundle.files).filter(name => name.startsWith('fixtures/')).map(name => ({ fixture: name, ...replayComponentEvent(bundle.component, JSON.parse(bundle.files[name])) })),
    status: projectStatusComponents(JSON.parse(bundle.files['summary.json']), bundle.component.status ? [{ id: bundle.component.id, ...bundle.component.status }] : []),
    synthetic: true, writes: false, executes: false };
}

export async function runComponentCli(command, args, streams) {
  assertComponentPlatform(); // Before argv/options/path inspection or reads.
  try {
    if (!['scaffold-component', 'validate-component', 'component-plan', 'replay-component'].includes(command) || !Array.isArray(args)) refuse();
    const allowed = command === 'scaffold-component' ? ['--spec', '--output'] : command === 'validate-component' ? ['--bundle'] : ['--bundle', '--intent'];
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i], value = args[i + 1];
      if (!allowed.includes(key) || Object.hasOwn(options, key) || typeof value !== 'string' || value.startsWith('--')) refuse();
      options[key] = value;
    }
    if (command === 'scaffold-component') {
      if (Object.keys(options).length !== 2) refuse();
      streams.stdout.write(json(await scaffoldComponent(await readComponentJson(options['--spec']), options['--output']))); return;
    }
    if (!options['--bundle']) refuse();
    const bundle = await loadComponentBundle(options['--bundle'], options['--intent']);
    streams.stdout.write(json(command === 'validate-component' ? { valid: true, id: bundle.component.id, installed: false }
      : command === 'component-plan' ? componentPlan(bundle.component) : replayComponentBundle(bundle)));
  } catch { throw new Error('Component command refused; check private complete bundle/spec/intent and supported options. No installation or recovery was performed.'); }
}
