import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve, join, dirname } from 'node:path';
import { runMcpServer } from './mcp-stdio.mjs';
import { createCallReviewer } from './hold-review.mjs';
import { readBoundedFile, parseJsonObject } from './io.mjs';
import { MAX_CONFIG_BYTES } from './constants.mjs';
import { loadRuntimeSettings } from './runtime-settings.mjs';
import { loadDashboardHtml } from './dashboard-resource.mjs';
import { readMetadataState, observeMetadataState } from './state.mjs';
import { describeProject, listProjectFiles, inspectProjectChanges, inspectCheckpointChanges } from './workspace.mjs';
import { CAPTURE_NOTE } from './scope.mjs';
import { readSelectedUsage } from './usage.mjs';
import { readSelectedObservations } from './observations.mjs';
import { projectStatusComponents, validateStatusComponents } from './component-contract.mjs';
import { validateInteractionComponents } from './interaction-contract.mjs';

const URI = 'ui://claude-mods/dashboard';
const empty = { type: 'object', properties: {}, additionalProperties: false };
const readOnly = { readOnlyHint: true, openWorldHint: false, destructiveHint: false };
const tools = [
  { name:'mods.dashboard', title:'Claude Mods', description:'Open the local project and activity dashboard. No model calls.', inputSchema:empty, annotations:readOnly, _meta:{ ui:{resourceUri:URI}, 'openai/ui':{entrypoints:[{type:'global'}]} } },
  { name:'mods.activity', title:'Read scoped activity', description:'Read retained metadata for the explicitly configured project/session. Optional bounded wait for a change.', inputSchema:{type:'object', properties:{sinceRevision:{type:'string',pattern:'^[a-f0-9]{64}$'},waitMs:{type:'integer',minimum:1,maximum:2000}},additionalProperties:false},annotations:readOnly },
  { name:'mods.files', title:'List selected project files', description:'Read a bounded Git-aware file listing, excluding ignored paths, links and secret filenames.', inputSchema:empty,annotations:readOnly },
  { name:'mods.changes', title:'Inspect selected project changes', description:'Read working-tree changes against HEAD. Patch content requires configuration opt-in; this is not exact per-turn attribution.',inputSchema:empty,annotations:readOnly },
  { name:'mods.checkpoints', title:'Inspect selected checkpoints', description:'Compare only the two commits selected in reviewed runtime settings. Read-only; no automatic turn attribution or restoration.',inputSchema:empty,annotations:readOnly },
  { name:'mods.usage', title:'Read selected usage snapshot', description:'Read reported counters from only the private export selected in reviewed settings. Not current chat/context, billing or cache health.',inputSchema:empty,annotations:readOnly },
  { name:'mods.observations', title:'Read selected command and turn outcomes', description:'Read record counts from only the private exec export separately selected in reviewed settings. POSIX read-only approximation; not live hooks, unique executions or cancellation detection.',inputSchema:empty,annotations:readOnly },
  { name:'mods.status', title:'Read authored status components', description:'Read enabled authored counters from the existing selected metadata scope. No path arguments, new capture, writes or model calls. Retained deliveries are not unique successful calls or turns.',inputSchema:empty,annotations:readOnly },
];
function noArguments(value) { if (value !== undefined && (!value || Array.isArray(value) || typeof value !== 'object' || Object.keys(value).length)) throw new Error('Unexpected arguments'); }
function scope(settings) {
  if (!settings || (settings.stateScope === 'session' && !settings.sessionId)) return null;
  return {projectId:settings.projectRoot,...(settings.stateScope === 'session' ? {sessionId:settings.sessionId}: {})};
}
const unavailable = reason => ({available:false,reason});
// Existing hook config selection, lazily read only for opted-in matching reviews.
async function loadSharedHookConfig({signal}={}) {
  if(signal?.aborted)throw new Error('Call review cancelled');
  const path=process.env.CODEX_MODS_CONFIG || join(dirname(fileURLToPath(import.meta.url)),'..','config','mods.json');
  const value=parseJsonObject(await readBoundedFile(path,MAX_CONFIG_BYTES),'hook config');
  if(signal?.aborted)throw new Error('Call review cancelled');
  return value;
}
const reviewTool = {
  name:'mods.review_call',title:'Review an unchanged covered call',
  description:'Optional advisory MCP hook. Confirmation abstains, never grants permissions. Mutating hooks are unsupported; host failures can fail open and response provenance is not human-attested.',
  inputSchema:{type:'object',properties:{hook_event_name:{type:'string'},tool_name:{type:'string'},tool_input:{}},
    required:['hook_event_name','tool_name','tool_input'],additionalProperties:false},
  annotations:readOnly,
};
export function createDashboardHandler(settings, {loadHookConfig=loadSharedHookConfig}={}) {
  const review=createCallReviewer(settings?.callReview,{loadHookConfig});
  const selectedTools=review.enabled ? [...tools,reviewTool] : tools;
  let formAvailable=false;
  const definitions = validateStatusComponents(settings?.statusComponents);
  const interactions = validateInteractionComponents(settings?.interactionComponents);
  const withStatus = data => ({...data,statusComponents:projectStatusComponents(data,definitions)});
  const usage=signal=>settings?.usageExport?readSelectedUsage(settings.usageExport,{signal}):unavailable('No private usage export selected. Native hooks do not provide context, token or billing counters.');
  const observations=signal=>settings?.observationExport?readSelectedObservations(settings.observationExport,{signal}):unavailable('No observation export selected. This separate read opt-in never follows the usage export or live hook scope.');
  async function activity(args = {}, signal) {
    if (!args || typeof args !== 'object' || Array.isArray(args) || Object.keys(args).some(k => !['sinceRevision','waitMs'].includes(k))) throw new Error('Invalid activity options');
    if (args.sinceRevision !== undefined && !/^[a-f0-9]{64}$/.test(args.sinceRevision)) throw new Error('Invalid revision');
    if (args.waitMs !== undefined && (!Number.isInteger(args.waitMs) || args.waitMs < 1 || args.waitMs > 2000)) throw new Error('Invalid wait');
    const selected = scope(settings);
    if (!selected) return withStatus(unavailable('Select a reviewed project and session in runtime settings; cross-session totals require explicit project scope.'));
    const current = await readMetadataState(settings.dataDirectory,selected,{signal});
    if (args.sinceRevision === current.revision && args.waitMs) {
      for await (const next of observeMetadataState(settings.dataDirectory,selected,{durationMs:args.waitMs,intervalMs:100,signal})) {
        if (next.revision !== args.sinceRevision) return withStatus({available:true,scope:settings.stateScope,...next,producerHealth:'unknown',captureNote:CAPTURE_NOTE});
      }
    }
    return withStatus({available:true,scope:settings.stateScope,...current,producerHealth:'unknown',captureNote:CAPTURE_NOTE});
  }
  return async (request, {signal,requestHost} = {}) => {
    const p = request.params ?? {};
    switch (request.method) {
      case 'initialize':
        formAvailable = !!p.capabilities?.elicitation?.form && typeof p.capabilities.elicitation.form==='object' && !Array.isArray(p.capabilities.elicitation.form);
        return {protocolVersion:'2025-11-25',capabilities:{tools:{},resources:{}},serverInfo:{name:'claude-mods-for-codex',version:'0.2.0-dev.39'}};
      case 'ping': return {};
      case 'tools/list': return {tools:selectedTools};
      case 'resources/list': return {resources:[{uri:URI,name:'Claude Mods dashboard',mimeType:'text/html;profile=mcp-app'}]};
      case 'resources/templates/list': return {resourceTemplates:[]};
      case 'resources/read':
        if (p.uri !== URI) throw new Error('Unknown resource');
        return {contents:[{uri:URI,mimeType:'text/html;profile=mcp-app',text:await loadDashboardHtml(interactions),_meta:{ui:{csp:{connectDomains:[],resourceDomains:[]}},'openai/ui':{preferredDisplayMode:'fullscreen',availableDisplayModes:['fullscreen']}}}]};
      case 'tools/call': {
        if (!selectedTools.some(t => t.name === p.name)) throw new Error('Unknown tool');
        if(p.name==='mods.review_call') {
          const result=await review.review(p.arguments,{signal,elicit:formAvailable && typeof requestHost==='function'
            ? (params,{signal})=>requestHost('elicitation/create',params,{signal,timeoutMs:settings.callReview.timeoutMs ?? 30000})
            : undefined});
          return {content:[{type:'text',text:JSON.stringify(result)}]};
        }
        let data;
        if (p.name === 'mods.activity') data = await activity(p.arguments,signal);
        else {
          noArguments(p.arguments);
          if (p.name === 'mods.dashboard') data = {surface:'plugin-owned MCP App',configured:!!settings,project:settings ? await describeProject(settings.projectRoot) : unavailable('No project selected.'),activity:await activity({},signal),usage:await usage(signal),observations:await observations(signal),access:{network:false,modelCalls:false,changesOptIn:settings?.allowChanges === true}};
          else if (p.name === 'mods.usage') data = await usage(signal);
          else if (p.name === 'mods.observations') data = await observations(signal);
          else if (p.name === 'mods.status') data = {components: definitions.some(c=>c.enabled) ? (await activity({},signal)).statusComponents : []};
          else if (!settings) data = unavailable('No project selected in reviewed runtime settings.');
          else if (p.name === 'mods.files') data = await listProjectFiles(settings.projectRoot,{});
          else if (p.name === 'mods.changes') data = await inspectProjectChanges(settings.projectRoot,{includeDiffs:settings.allowChanges});
          else data = settings.checkpoints ? await inspectCheckpointChanges(settings.projectRoot,{...settings.checkpoints,includeDiffs:settings.allowChanges}) : unavailable('Select two full commit IDs in reviewed runtime settings. Replay does not create checkpoints, infer turns or restore files.');
        }
        return {content:[{type:'text',text:JSON.stringify(data)}],structuredContent:data};
      }
      default: throw new Error('Unsupported request');
    }
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  let path = process.env.CODEX_MODS_SETTINGS;
  if (process.argv.length > 2) {
    if (process.argv.length !== 4 || process.argv[2] !== '--settings') { process.stderr.write('claude-mods: expected --settings ABSOLUTE_FILE\n'); process.exit(1); }
    path = process.argv[3];
  }
  try { runMcpServer(createDashboardHandler(await loadRuntimeSettings(path))); }
  catch { process.stderr.write('claude-mods: runtime settings unavailable\n'); process.exitCode = 1; }
}
