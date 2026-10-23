import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { runMcpServer } from './mcp-stdio.mjs';
import { loadRuntimeSettings } from './runtime-settings.mjs';
import { readBoundedFile } from './io.mjs';
import { readMetadataState, observeMetadataState } from './state.mjs';
import { describeProject, listProjectFiles, inspectProjectChanges } from './workspace.mjs';
import { CAPTURE_NOTE } from './scope.mjs';

const URI = 'ui://claude-mods/dashboard';
const empty = { type: 'object', properties: {}, additionalProperties: false };
const readOnly = { readOnlyHint: true, openWorldHint: false, destructiveHint: false };
const tools = [
  { name:'mods.dashboard', title:'Claude Mods', description:'Open the local project and activity dashboard. No model calls.', inputSchema:empty, annotations:readOnly, _meta:{ ui:{resourceUri:URI}, 'openai/ui':{entrypoints:[{type:'global'}]} } },
  { name:'mods.activity', title:'Read scoped activity', description:'Read retained metadata for the explicitly configured project/session. Optional bounded wait for a change.', inputSchema:{type:'object', properties:{sinceRevision:{type:'string',pattern:'^[a-f0-9]{64}$'},waitMs:{type:'integer',minimum:1,maximum:2000}},additionalProperties:false},annotations:readOnly },
  { name:'mods.files', title:'List selected project files', description:'Read a bounded Git-aware file listing, excluding ignored paths, links and secret filenames.', inputSchema:empty,annotations:readOnly },
  { name:'mods.changes', title:'Inspect selected project changes', description:'Read working-tree changes against HEAD. Patch content requires configuration opt-in; this is not exact per-turn attribution.',inputSchema:empty,annotations:readOnly },
];
function noArguments(value) { if (value !== undefined && (!value || Array.isArray(value) || typeof value !== 'object' || Object.keys(value).length)) throw new Error('Unexpected arguments'); }
function scope(settings) {
  if (!settings || (settings.stateScope === 'session' && !settings.sessionId)) return null;
  return {projectId:settings.projectRoot,...(settings.stateScope === 'session' ? {sessionId:settings.sessionId}: {})};
}
const unavailable = reason => ({available:false,reason});
export function createDashboardHandler(settings) {
  async function activity(args = {}, signal) {
    if (!args || typeof args !== 'object' || Array.isArray(args) || Object.keys(args).some(k => !['sinceRevision','waitMs'].includes(k))) throw new Error('Invalid activity options');
    if (args.sinceRevision !== undefined && !/^[a-f0-9]{64}$/.test(args.sinceRevision)) throw new Error('Invalid revision');
    if (args.waitMs !== undefined && (!Number.isInteger(args.waitMs) || args.waitMs < 1 || args.waitMs > 2000)) throw new Error('Invalid wait');
    const selected = scope(settings);
    if (!selected) return unavailable('Select a reviewed project and session in runtime settings; cross-session totals require explicit project scope.');
    const current = await readMetadataState(settings.dataDirectory,selected);
    if (args.sinceRevision === current.revision && args.waitMs) {
      for await (const next of observeMetadataState(settings.dataDirectory,selected,{durationMs:args.waitMs,intervalMs:100,signal})) {
        if (next.revision !== args.sinceRevision) return {available:true,scope:settings.stateScope,...next,producerHealth:'unknown',captureNote:CAPTURE_NOTE};
      }
    }
    return {available:true,scope:settings.stateScope,...current,producerHealth:'unknown',captureNote:CAPTURE_NOTE};
  }
  return async (request, {signal} = {}) => {
    const p = request.params ?? {};
    switch (request.method) {
      case 'initialize': return {protocolVersion:'2025-11-25',capabilities:{tools:{},resources:{}},serverInfo:{name:'claude-mods-for-codex',version:'0.2.0-dev.2'}};
      case 'ping': return {};
      case 'tools/list': return {tools};
      case 'resources/list': return {resources:[{uri:URI,name:'Claude Mods dashboard',mimeType:'text/html;profile=mcp-app'}]};
      case 'resources/templates/list': return {resourceTemplates:[]};
      case 'resources/read':
        if (p.uri !== URI) throw new Error('Unknown resource');
        return {contents:[{uri:URI,mimeType:'text/html;profile=mcp-app',text:await readBoundedFile(fileURLToPath(new URL('../ui/dashboard.html',import.meta.url)),256*1024),_meta:{ui:{csp:{connectDomains:[],resourceDomains:[]}},'openai/ui':{preferredDisplayMode:'fullscreen',availableDisplayModes:['fullscreen']}}}]};
      case 'tools/call': {
        if (!tools.some(t => t.name === p.name)) throw new Error('Unknown tool');
        let data;
        if (p.name === 'mods.activity') data = await activity(p.arguments,signal);
        else {
          noArguments(p.arguments);
          if (p.name === 'mods.dashboard') data = {surface:'plugin-owned MCP App',configured:!!settings,project:settings ? await describeProject(settings.projectRoot) : unavailable('No project selected.'),activity:await activity({},signal),usage:unavailable('This native hook feed supplies no context, token or billing counters.'),access:{network:false,modelCalls:false,changesOptIn:settings?.allowChanges === true}};
          else if (!settings) data = unavailable('No project selected in reviewed runtime settings.');
          else if (p.name === 'mods.files') data = await listProjectFiles(settings.projectRoot,{});
          else data = await inspectProjectChanges(settings.projectRoot,{includeDiffs:settings.allowChanges});
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
