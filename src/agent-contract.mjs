// Pure authoring contract. No IO, native registration, inference or task launch.
function refuse() { throw Error('Invalid configured agent data'); }
function record(value, keys) {
  if (!value || typeof value !== 'object' || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) refuse();
  const own = Reflect.ownKeys(value);
  if (own.length !== keys.length || own.some(k => !keys.includes(k) || !Object.hasOwn(Object.getOwnPropertyDescriptor(value, k), 'value'))) refuse();
}
function text(value, max, multiline = false) {
  if (typeof value !== 'string' || !value.trim() || value.length > max || !value.isWellFormed()
    || /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u.test(multiline ? value.replaceAll('\n', '') : value)) refuse();
  return value;
}
export function validateAgent(value) {
  record(value, ['selected', 'description', 'instructions', 'model', 'reasoningEffort']);
  if (typeof value.selected !== 'boolean' || typeof value.model !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/.test(value.model)
    || typeof value.reasoningEffort !== 'string' || !/^[a-z][a-z0-9_-]{0,31}$/.test(value.reasoningEffort)) refuse();
  // The native effort type is an advertised string, not a fixed enum. Syntax
  // validation cannot establish account availability or model/effort compatibility.
  return Object.freeze({ selected: value.selected, description: text(value.description, 256),
    instructions: text(value.instructions, 4096, true), model: value.model, reasoningEffort: value.reasoningEffort });
}
function nativeName(id) {
  if (typeof id !== 'string' || !/^[a-z][a-z0-9-]{0,47}$/.test(id)) refuse();
  return `mods-${id}`;
}
export function agentToml(id, value) {
  const a = validateAgent(value);
  // JSON basic strings are TOML-compatible for this restricted Unicode domain.
  // Never interpolate raw authored text, use multiline quotes or emit extra keys.
  return Object.entries({ name: nativeName(id), description: a.description, developer_instructions: a.instructions,
    model: a.model, model_reasoning_effort: a.reasoningEffort }).map(([key, v]) => `${key} = ${JSON.stringify(v)}\n`).join('');
}
export function agentAccess(id, value) {
  const a = validateAgent(value);
  return { version: 1, id, component: 'separately reviewed native agent profile candidate', selectedForReview: a.selected,
    reception: false, retention: false, display: false, potentialReads: ['Explicit private authoring spec, bundle and optional review intent'],
    potentialWrites: ['New private bundle only; never native configuration or discovery directories'],
    network: [], modelCalls: 0, executes: [],
    futureInvocation: { nativeName: nativeName(id), model: a.model, reasoningEffort: a.reasoningEffort,
      consumesModelUsage: true, automatic: false, availability: 'unverified',
      permissions: 'Native child inherits parent approval, sandbox, provider and MCP constraints; instructions are not an OS sandbox',
      access: 'May use inherited tools, files, network and environment as the host permits; not restricted by this declaration' },
    limits: ['Selection means review-plan intent only; no installation, enabled native flag, model launch or parent-model/prompt change',
      'Generation/validation/static replay are local; skill-mediated describing consumes selected-model usage',
      'Native execution requires separate explicit bounded usage authorization; no silent model fallback or exact billing/cancellation guarantee',
      'Keep authored instructions and artifacts private; no transcript, credential or model discovery',
      'No hook, scope, capture, export, runtime settings, trust or permission grant'] };
}
export function agentPlan(id, value) {
  const a = validateAgent(value), name = nativeName(id);
  return { version: 1, id, installed: false, access: agentAccess(id, a), registration: { hooks: {} }, hookConfig: {}, runtimeSettings: {},
    nativeProfile: { selectedForReview: a.selected, name, artifact: 'agent-candidate.toml.txt',
      mechanism: 'Separate native project/user configuration, not plugin agent discovery',
      projectTarget: `.codex/agents/${name}.toml`, userTarget: `~/.codex/agents/${name}.toml`,
      model: a.model, reasoningEffort: a.reasoningEffort, invocationAuthorized: false },
    mergeNote: 'Review the exact candidate/source and native host support first. Selection only prepares a review plan. Choose one project or user scope, inspect name collisions/precedence and preserve an existing profile before any explicit install. Do not merge into plugin runtime settings or global agent defaults. Never overwrite, auto-trust or launch. Changes require regeneration/review; disable/removal/rollback are separately reviewed native-file changes.' };
}
export function agentFixtures() {
  return { version: 1, checks: ['unselected-review', 'selected-review', 'forbidden-authority-fields'],
    semantics: 'Static authoring checks only; no native agent, prompt execution, permission or model-availability test' };
}
export function replayAgent(id, value, fixtures) {
  const a = validateAgent(value);
  if (JSON.stringify(fixtures) !== JSON.stringify(agentFixtures())) refuse();
  const off = agentPlan(id, { ...a, selected: false }), on = agentPlan(id, { ...a, selected: true });
  const forbidden = ['sandbox_mode', 'approval_policy', 'mcp_servers', 'features', 'command', 'prompt', 'parentModel'];
  for (const key of forbidden) {
    let rejected = false;
    try { validateAgent({ ...a, [key]: 'synthetic-forbidden' }); } catch { rejected = true; }
    if (!rejected) refuse();
  }
  if (off.installed || on.installed || off.nativeProfile.invocationAuthorized || on.nativeProfile.invocationAuthorized
    || off.nativeProfile.model !== on.nativeProfile.model || agentToml(id, { ...a, selected: false }) !== agentToml(id, { ...a, selected: true })) refuse();
  return { nativeName: nativeName(id), selectedForReview: a.selected, model: a.model, reasoningEffort: a.reasoningEffort,
    checks: { selectionNeverLaunches: true, selectionPreservesCandidate: true, forbiddenFieldsRejected: forbidden.length },
    nativeExecutionVerified: false, modelAvailability: 'unverified', modelCalls: 0 };
}
