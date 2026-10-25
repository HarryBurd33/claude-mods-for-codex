import { KNOWN_EVENTS, OBSERVER_EVENTS } from './constants.mjs';
import { validateEventEnvelope } from './dispatcher.mjs';
import { validateInteraction } from './interaction-contract.mjs';

export function componentError() { throw new Error('Invalid or unsupported component data'); }
export function componentRecord(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) componentError();
  if (Reflect.ownKeys(value).length !== keys.length) componentError();
  for (const key of Reflect.ownKeys(value)) {
    if (!keys.includes(key) || !Object.hasOwn(Object.getOwnPropertyDescriptor(value, key), 'value')) componentError();
  }
}
function array(value, max) {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || value.length > max || Reflect.ownKeys(value).length !== value.length + 1) componentError();
  for (let i = 0; i < value.length; i++) if (!Object.hasOwn(Object.getOwnPropertyDescriptor(value, String(i)) ?? {}, 'value')) componentError();
}
function events(value, observer) {
  array(value, observer ? OBSERVER_EVENTS.size : 8);
  const allowed = observer ? OBSERVER_EVENTS : KNOWN_EVENTS;
  if (!value.length || value.some(v => typeof v !== 'string' || !allowed.has(v)) || new Set(value).size !== value.length) componentError();
  return Object.freeze([...value]);
}
function id(value) { if (typeof value !== 'string' || !/^[a-z][a-z0-9-]{0,47}$/.test(value)) componentError(); return value; }
function title(value) { if (typeof value !== 'string' || !value.trim() || value.length > 96 || /[\p{Cc}\p{Cf}]/u.test(value)) componentError(); return value; }
function bool(value) { if (typeof value !== 'boolean') componentError(); return value; }

export function componentFromSpec(spec) {
  // Kind-specific shapes exclude paths, commands, HTML/JS templates and grants.
  if (!spec || typeof spec !== 'object') componentError();
  const kind = Object.getOwnPropertyDescriptor(spec, 'kind');
  if (!kind || !Object.hasOwn(kind, 'value') || !['observer', 'status', 'activity', 'interaction'].includes(kind.value)) componentError();
  if (kind.value === 'interaction') {
    componentRecord(spec, ['name', 'kind', 'title', 'fields']);
    return validateComponent({ version: 1, id: id(spec.name), interaction: { enabled: false, title: spec.title, fields: spec.fields } });
  }
  componentRecord(spec, kind.value === 'observer' ? ['name', 'kind', 'events'] : ['name', 'kind', 'events', 'title']);
  const observer = kind.value !== 'status', status = kind.value !== 'observer';
  return validateComponent({ version: 1, id: id(spec.name),
    ...(observer ? { observer: { reception: false, retention: false, events: events(spec.events, true) } } : {}),
    ...(status ? { status: { enabled: false, title: title(spec.title), events: events(spec.events, observer) } } : {}),
  });
}

export function validateComponent(value) {
  if (!value || typeof value !== 'object') componentError();
  const keys = ['version', 'id', ...(['observer', 'status', 'interaction'].filter(k => Object.hasOwn(value, k)))];
  componentRecord(value, keys);
  if (value.version !== 1 || keys.length === 2) componentError();
  const result = { version: 1, id: id(value.id) };
  if (Object.hasOwn(value, 'interaction')) {
    if (keys.length !== 3) componentError(); // Never share raw local input with observers/status.
    result.interaction = validateInteraction(value.interaction);
  }
  if (Object.hasOwn(value, 'observer')) {
    componentRecord(value.observer, ['reception', 'retention', 'events']);
    result.observer = Object.freeze({ reception: bool(value.observer.reception), retention: bool(value.observer.retention), events: events(value.observer.events, true) });
  }
  if (Object.hasOwn(value, 'status')) {
    componentRecord(value.status, ['enabled', 'title', 'events']);
    result.status = Object.freeze({ enabled: bool(value.status.enabled), title: title(value.status.title), events: events(value.status.events, false) });
  }
  // A paired component observes and displays the same declared event selection.
  if (result.observer && result.status && JSON.stringify(result.observer.events) !== JSON.stringify(result.status.events)) componentError();
  return Object.freeze(result);
}

export function validateStatusComponents(value = []) {
  array(value, 8);
  const result = value.map(item => {
    componentRecord(item, ['id', 'enabled', 'title', 'events']);
    return Object.freeze({ id: id(item.id), enabled: bool(item.enabled), title: title(item.title), events: events(item.events, false) });
  });
  if (new Set(result.map(item => item.id)).size !== result.length) componentError();
  return Object.freeze(result);
}

export function componentAccess(component) {
  const c = validateComponent(component);
  if (c.interaction) return { version: 1, id: c.id, component: 'owned local-preview interaction', display: c.interaction.enabled,
    reception: false, retention: false, requestedReceptionEvents: [], requestedStorageEvents: [],
    potentialReads: ['Authored labels/formats in this reviewed declaration; user-entered text only in its own webview fields'],
    potentialWrites: [], network: [], modelCalls: 0, executes: [], localCallbacks: ['render fixed previews', 'clear own fields/previews'],
    memory: { fields: c.interaction.fields.length, charactersPerField: 4096, persistent: false },
    limits: ['Fixed bundled render/clear callbacks only; no native call approval, commands or arbitrary code', 'Up to four fields of 4096 characters; in-memory text cleared by Clear or view teardown', 'Labels are included in the private UI resource; no input text is sent to tools or saved', 'No hook, metadata, project, export, scope or permission grant', 'Declarations are not an OS sandbox; the host controls its webview', 'Skill use consumes selected-model usage; local callbacks add no model call'] };
  return { version: 1, id: c.id, component: 'declarative observer/status component',
    reception: c.observer?.reception ?? false, retention: c.observer?.retention ?? false, display: c.status?.enabled ?? false,
    requestedReceptionEvents: c.observer?.reception ? c.observer.events : [],
    requestedStorageEvents: c.observer?.retention ? c.observer.events : [],
    requestedDisplayEvents: c.status?.enabled ? c.status.events : [],
    potentialReads: [...(c.observer ? ['Selected lifecycle hook envelopes in memory, possibly including assistant text and identifiers; never opened transcript files'] : []), ...(c.status ? ['Existing explicitly selected retained metadata scope; authored title is displayed and returned by tools'] : [])],
    potentialWrites: c.observer ? ['Only event/time metadata under a separately selected project/session scope if retention is enabled and a hook is delivered'] : [],
    network: [], modelCalls: 0,
    executes: c.observer?.reception ? ['Fixed bundled Node hook dispatcher; no project or fixture command execution'] : [],
    potentialExecutes: c.observer ? ['Fixed bundled Node hook dispatcher after explicit registration/trust'] : [],
    limits: ['Declarations describe this bundled template, not an OS sandbox', 'Reception, retention and display are separate choices', 'No path, scope, export or permission grant is supplied by this component', 'Describe/skill use consumes selected-model usage; deterministic callbacks add no model call'],
  };
}

export function componentPlan(component) {
  const c = validateComponent(component), hooks = {};
  if (c.observer?.reception) for (const event of c.observer.events) hooks[event] = [{ hooks: [{
    type: 'command', command: 'node "${PLUGIN_ROOT}/src/hook-main.mjs"', timeout: ['Interrupt', 'SessionEnd'].includes(event) ? 3 : 5,
    statusMessage: 'Observing opted-in Claude Mods lifecycle metadata',
  }] }];
  return { version: 1, id: c.id, installed: false, access: componentAccess(c),
    registration: { hooks },
    hookConfig: c.observer?.retention ? { metadataState: { componentObserverEvents: [...c.observer.events] } } : {},
    runtimeSettings: c.interaction ? { interactionComponents: [{ id: c.id, ...c.interaction }] } : c.status ? { statusComponents: [{ id: c.id, ...c.status }] } : {},
    mergeNote: c.interaction ? 'Merge only this reviewed interactionComponents entry by unique id; preserve existing cards, status, project/data/scope/exports and all hook/capture settings. No new path, capture, permission, installation or trust is selected. Definitions load with the reviewed settings snapshot; no hot reload. Enabling publishes authored labels/formats to the private UI resource, never user input.' : 'Merge only chosen fields. Union componentObserverEvents with reviewed existing authored selections; merge at most one bundled dispatcher per event. Preserve mods, legacy enabled/observerEvents and scope. If metadataState is absent, explicitly create a disabled base with enabled:false and reviewed scope before merging authored events. Shared event capture may serve other components; removal requires review. No project/data selection, installation or trust is performed.',
  };
}

export function projectStatusComponents(summary, definitions = []) {
  const selected = validateStatusComponents(definitions).filter(c => c.enabled);
  const supplied = summary && typeof summary === 'object' ? Object.getOwnPropertyDescriptor(summary, 'events') : undefined;
  const counts = supplied && Object.hasOwn(supplied, 'value') ? supplied.value : undefined;
  const available = Object.getOwnPropertyDescriptor(summary ?? {}, 'available')?.value === true
    && counts && typeof counts === 'object' && !Array.isArray(counts) && [Object.prototype, null].includes(Object.getPrototypeOf(counts));
  return selected.map(c => {
    const rows = c.events.map(event => {
      const descriptor = available ? Object.getOwnPropertyDescriptor(counts, event) : undefined;
      const count = !available ? null : descriptor === undefined ? 0 : Object.hasOwn(descriptor, 'value') && Number.isSafeInteger(descriptor.value) && descriptor.value >= 0 ? descriptor.value : null;
      return { event, deliveries: count };
    });
    const sum = rows.every(r => r.deliveries !== null) ? rows.reduce((n, r) => n + r.deliveries, 0) : null;
    return { id: c.id, title: c.title, rows, total: Number.isSafeInteger(sum) ? sum : null,
      semantics: 'Retained hook deliveries only; not unique calls, successful tools, unique turns or producer health. Missing source is unavailable, not zero. Display never enables capture.',
    };
  });
}

export function replayComponentEvent(component, event) {
  const c = validateComponent(component);
  let valid = false;
  try { valid = validateEventEnvelope(event); } catch { /* fixed result, no input diagnostics */ }
  return { valid, response: {}, metadata: valid && c.observer?.reception && c.observer.retention && c.observer.events.includes(event.hook_event_name) ? { event: event.hook_event_name } : null };
}

// Intent changes booleans only. Selection/title/id changes require regeneration
// and a new review, rather than silently drifting from the bundle's fixtures.
export function componentIntent(base, proposed) {
  const original = validateComponent(base), next = validateComponent(proposed);
  const reset = JSON.parse(JSON.stringify(next));
  if (reset.observer) { reset.observer.reception = false; reset.observer.retention = false; }
  if (reset.status) reset.status.enabled = false;
  if (reset.interaction) reset.interaction.enabled = false;
  if (JSON.stringify(reset) !== JSON.stringify(original)) componentError();
  return next;
}
