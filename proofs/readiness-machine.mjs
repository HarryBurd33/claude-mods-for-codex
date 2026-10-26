// Proposal35.1 protocol drafts only. No process, filesystem, network or model IO.
import { createHash } from 'node:crypto';
import { jsonData, rpcId, denyServerRequest } from './routing-contract.mjs';
import { validateNativePlan, nativeConfigMatches } from './routing-native-plan.mjs';
import { validateInspectionPlan, inspectionConfigMatches } from './inspection-contract.mjs';

export const READINESS_LIMITS = Object.freeze({ workMs: 20000, outerMs: 25000, requestMs: 5000,
  softReapMs: 2000, hardReapMs: 2000, bytes: 1048576, frameBytes: 65536, messages: 128,
  requests: 5, hooks: 256, outgoingBytes: 131072 });
const record = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const fields = (v, allowed) => record(v) && Object.keys(v).every(k => allowed.includes(k));
const lookup = (v, parts) => parts.reduce((o, k) => record(o) && Object.hasOwn(o, k) ? o[k] : undefined, v);
const canonical = v => Array.isArray(v) ? v.map(canonical) : record(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])])) : v;
const digest = v => createHash('sha256').update(JSON.stringify(canonical(v))).digest('hex');
const text = (v, max = 4096) => typeof v === 'string' && v.length > 0 && v.length <= max;
const SOURCES = ['system', 'user', 'project', 'mdm', 'sessionFlags', 'plugin', 'cloudRequirements',
  'cloudManagedConfig', 'legacyManagedConfigFile', 'legacyManagedConfigMdm', 'unknown'];
const EVENTS = ['preModelRequest', 'postModelRequest', 'preToolUse', 'permissionRequest', 'postToolUse',
  'preCompact', 'postCompact', 'sessionStart', 'sessionEnd', 'userPromptSubmit', 'subagentStart', 'subagentStop', 'stop', 'interrupt'];
const TRUST = ['managed', 'untrusted', 'trusted', 'modified'];
const REASONS = new Set(['request-limit', 'malformed-protocol', 'server-request-denied', 'unsupported-notification',
  'unexpected-response', 'server-error', 'config-mismatch', 'requirements-review-required', 'hook-shape',
  'hook-discovery-incomplete', 'hooks-require-review', 'config-changed', 'invalid-clock', 'work-timeout',
  'request-timeout', 'operator-cancelled', 'transport-error', 'outgoing-limit', 'input-mismatch', 'driver-error',
  'synthetic-transport-deadline', 'outer-timeout', 'peer-disconnected', 'byte-limit', 'frame-limit',
  'message-limit', 'incomplete-frame']);
// Pinned ConfigRequirements optional fields. Non-null policies outside the narrow
// supported projection require review; they are never silently treated as inert.
const POLICY_FIELDS = ['modelProvider', 'modelProviders', 'allowedLoginMethods', 'cliAuthCredentialsStore',
  'chatgptBaseUrl', 'additionalDeveloperInstructions', 'allowedApprovalPolicies', 'allowedApprovalsReviewers',
  'allowedSandboxModes', 'allowedWindowsSandboxImplementations', 'allowedPermissionProfiles', 'defaultPermissions',
  'allowedWebSearchModes', 'allowManagedHooksOnly', 'allowBrowserAndComputerUse', 'allowAppshots', 'allowRemoteControl',
  'computerUse', 'browserUse', 'inAppBrowser', 'featureRequirements', 'hooks', 'enforceResidency', 'network',
  'application', 'autoReview', 'models', 'sqliteHome', 'logDir', 'modelCatalogJson', 'checkForUpdateOnStartup',
  'allowLoginShell', 'feedback'];

function configProjection(plan, result, inspection) {
  if (!fields(result, ['config', 'origins', 'layers']) || !record(result.config)
    || result.layers != null || (Object.hasOwn(result, 'origins') && !record(result.origins))) return null;
  const c = result.config;
  if (!(inspection ? inspectionConfigMatches(plan, c) : nativeConfigMatches(plan, c)) || c.features?.hooks !== true
    || (Object.hasOwn(c, 'mcp_servers') && !record(c.mcp_servers))
    || (Object.hasOwn(c, 'bypass_hook_trust') && c.bypass_hook_trust !== false)) return null;
  // Only a transient digest is kept between reads; never return config/path/hash
  // values, raw hook state, origin data or this digest in a report.
  return digest({ required: plan.requirements.map(r => lookup(c, r.path)), hooks: c.hooks ?? {},
    hooksEnabled: true, mcp: c.mcp_servers ?? {}, bypass: c.bypass_hook_trust ?? false,
    remoteBoard: c.multi_agent_v2?.message_board_remote ?? null });
}

function compatibleRequirements(plan, result) {
  if (!fields(result, ['requirements', 'supportsIndependentSpeedModes']) || !Object.hasOwn(result, 'requirements')
    || (Object.hasOwn(result, 'supportsIndependentSpeedModes') && typeof result.supportsIndependentSpeedModes !== 'boolean')) return false;
  const r = result.requirements;
  if (r === null) return true;
  if (!fields(r, POLICY_FIELDS)) return false;
  for (const [key, value] of Object.entries(r)) {
    if (value === null) continue;
    if (key === 'allowManagedHooksOnly') { if (value !== false) return false; }
    else if (key === 'featureRequirements') {
      if (!record(value)) return false;
      for (const [feature, enabled] of Object.entries(value)) {
        const required = feature === 'hooks' ? true
          : plan.requirements.find(x => x.path.length === 2 && x.path[0] === 'features' && x.path[1] === feature)?.value;
        if (typeof enabled !== 'boolean' || required === undefined || enabled !== required) return false;
      }
    } else return false;
  }
  return true;
}

function hookCategories(hooks) {
  const categories = { source: {}, event: {}, trust: {} };
  for (const h of hooks) {
    if (!fields(h, ['key', 'eventName', 'handlerType', 'command', 'async', 'server', 'tool', 'matcher', 'timeoutSec',
      'statusMessage', 'additionalContextLimit', 'sourcePath', 'source', 'pluginId', 'displayOrder', 'enabled', 'isManaged',
      'currentHash', 'trustStatus']) || !SOURCES.includes(h.source) || !EVENTS.includes(h.eventName)
      || !TRUST.includes(h.trustStatus) || !text(h.key) || !text(h.sourcePath) || !text(h.currentHash)
      || typeof h.enabled !== 'boolean' || typeof h.isManaged !== 'boolean' || !Number.isSafeInteger(h.displayOrder)
      || !Number.isSafeInteger(h.timeoutSec) || h.timeoutSec < 0
      || ![null, undefined].includes(h.pluginId) && !text(h.pluginId)
      || ![null, undefined].includes(h.matcher) && (typeof h.matcher !== 'string' || h.matcher.length > 65536)
      || ![null, undefined].includes(h.statusMessage) && (typeof h.statusMessage !== 'string' || h.statusMessage.length > 65536)
      || ![null, undefined].includes(h.additionalContextLimit) && (!Number.isSafeInteger(h.additionalContextLimit) || h.additionalContextLimit < 0)) return null;
    if (h.handlerType === 'command') {
      if (!text(h.command, 65536) || (Object.hasOwn(h, 'async') && typeof h.async !== 'boolean')
        || Object.hasOwn(h, 'server') || Object.hasOwn(h, 'tool')) return null;
    } else if (h.handlerType === 'mcpTool') {
      if (!text(h.server) || !text(h.tool) || Object.hasOwn(h, 'command') || Object.hasOwn(h, 'async')) return null;
    } else return null; // Unsupported prompt/agent types cannot establish completeness.
    for (const [kind, value] of [['source', h.source], ['event', h.eventName], ['trust', h.trustStatus]]) {
      categories[kind][value] = (categories[kind][value] ?? 0) + 1;
    }
  }
  return categories;
}

export function createReadinessMachine(reviewPlan) {
  return createMachine(validateNativePlan(reviewPlan), false);
}
export function createInspectionMachine(reviewPlan) {
  return createMachine(validateInspectionPlan(reviewPlan), true);
}
// Both strict public contracts select this private protocol; no injected callback,
// transport or caller-provided validator can change its admission behavior.
function createMachine(plan, inspection) {
  let now = 0, started = false, done = false, reason = null, pending = null, out = [], first = null;
  let drafted = 0, completed = 0, configMatched = false, policyMatched = false, stable = false;
  let hookCount = null, warnings = 0, errors = 0, categories = { source: {}, event: {}, trust: {} };
  const stop = why => { if (reason !== null) return; reason = REASONS.has(why) ? why : 'driver-error';
    done = true; pending = null; first = null; out = []; };
  function request(id, method, params) {
    if (++drafted > READINESS_LIMITS.requests) return stop('request-limit');
    pending = { id, at: now }; out.push({ id, method, params });
  }
  const readConfig = id => request(id, 'config/read', { includeLayers: false, cwd: plan.input.cwd });
  return Object.freeze({
    start() { if (started || done) return; started = true;
      request(1, 'initialize', { clientInfo: { name: inspection ? 'claude_mods_inspection_only' : 'claude_mods_native_readiness_review', version: inspection ? 'offline-37' : 'proposal-35.1' },
        capabilities: { experimentalApi: true } }); },
    receive(packet) {
      if (reason !== null) return;
      if (!jsonData(packet) || !record(packet) || (Object.hasOwn(packet, 'jsonrpc') && packet.jsonrpc !== '2.0')) return stop('malformed-protocol');
      if (Object.hasOwn(packet, 'method')) {
        if (rpcId(packet.id) && typeof packet.method === 'string') {
          const denial = denyServerRequest(packet); stop('server-request-denied'); out.push(denial);
        } else stop('unsupported-notification');
        return;
      }
      if (done || !started || !pending || packet.id !== pending.id) return stop('unexpected-response');
      if (!fields(packet, ['id', 'jsonrpc', 'result', 'error']) || Object.hasOwn(packet, 'result') === Object.hasOwn(packet, 'error')) return stop('malformed-protocol');
      if (Object.hasOwn(packet, 'error')) return stop('server-error');
      const id = pending.id, r = packet.result; pending = null; completed++;
      if (id === 1) {
        if (!record(r)) return stop('malformed-protocol');
        out.push({ method: 'initialized', params: {} }); readConfig(2);
      } else if (id === 2) {
        first = configProjection(plan, r, inspection);
        if (first === null) return stop('config-mismatch');
        configMatched = true; request(3, 'configRequirements/read', {});
      } else if (id === 3) {
        if (!compatibleRequirements(plan, r)) return stop('requirements-review-required');
        policyMatched = true; request(4, 'hooks/list', { cwds: [plan.input.cwd] });
      } else if (id === 4) {
        if (!fields(r, ['data']) || !Array.isArray(r.data) || r.data.length !== 1) return stop('hook-shape');
        const e = r.data[0];
        if (!fields(e, ['cwd', 'hooks', 'warnings', 'errors']) || e.cwd !== plan.input.cwd
          || !Array.isArray(e.hooks) || e.hooks.length > READINESS_LIMITS.hooks
          || !Array.isArray(e.warnings) || !e.warnings.every(x => typeof x === 'string')
          || !Array.isArray(e.errors) || !e.errors.every(x => fields(x, ['path', 'message']) && typeof x.path === 'string' && typeof x.message === 'string')) return stop('hook-shape');
        warnings = e.warnings.length; errors = e.errors.length;
        if (warnings || errors) return stop('hook-discovery-incomplete');
        const counts = hookCategories(e.hooks); if (counts === null) return stop('hook-shape');
        hookCount = e.hooks.length; categories = counts;
        if (hookCount !== 0) return stop('hooks-require-review');
        readConfig(5);
      } else if (id === 5) {
        const second = configProjection(plan, r, inspection); stable = second !== null && second === first; first = null;
        if (!stable) return stop('config-changed'); done = true;
      }
    },
    advance(ms) {
      if (!Number.isSafeInteger(ms) || ms < now) return stop('invalid-clock'); now = ms;
      if (done || !started) return;
      if (now >= READINESS_LIMITS.workMs) stop('work-timeout');
      else if (pending && now - pending.at >= READINESS_LIMITS.requestMs) stop('request-timeout');
    },
    abort: stop,
    takeOutbound() { const value = out; out = []; return value.map(rpc => ({ domain: inspection ? 'inspection-review-draft' : 'readiness-review-draft', executionAuthorized: false, rpc })); },
    report() { return { done, outcome: done && reason === null ? 'observation-complete' : reason === null ? 'incomplete' : 'review-required',
      reason, requestsDrafted: drafted, completedRequests: completed, configMatched, requirementsCompatible: policyMatched,
      configProjectionStable: stable, listedHookCount: hookCount, warningCount: warnings, errorCount: errors,
      hookCategories: structuredClone(categories), executionAuthorized: false, liveAdmission: false,
      nativeInspectionVerified: false, hookAbsenceEstablished: false, builtinHooksOmittedByHost: true }; },
  });
}
