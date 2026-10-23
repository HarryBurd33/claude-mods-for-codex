import { runMcpServer } from '../src/mcp-stdio.mjs';
import { holdProof } from './hold.mjs';
let formAvailable = false;
runMcpServer(async (request, {signal,requestHost}) => {
  const p = request.params ?? {};
  if (request.method === 'initialize') {
    formAvailable = !!p.capabilities?.elicitation?.form;
    return {protocolVersion:'2025-11-25',capabilities:{tools:{}},serverInfo:{name:'claude-mods-hold-proof',version:'0.0.4'}};
  }
  if (request.method === 'ping') return {};
  if (request.method === 'tools/list') return {tools:[{name:'mods.hold',description:'Harmless native hold probe for the exact MODS_HOLD marker. Never grants permissions; no model call.',inputSchema:{type:'object',properties:{hook_event_name:{type:'string'},tool_name:{type:'string'},tool_input:{}},required:['hook_event_name','tool_name','tool_input'],additionalProperties:false},annotations:{readOnlyHint:true,openWorldHint:false}}]};
  if (request.method !== 'tools/call' || p.name !== 'mods.hold') throw new Error('Unsupported request');
  const event = p.arguments;
  if (!event || Array.isArray(event) || Object.keys(event).some(k=>!['hook_event_name','tool_name','tool_input'].includes(k))) throw new Error('Invalid event');
  const result = await holdProof(event,{enabled:true,signal,timeoutMs:30000,elicit:formAvailable ? (params,{signal}) => requestHost('elicitation/create',params,{signal,timeoutMs:30000}) : undefined});
  return {content:[{type:'text',text:JSON.stringify(result)}]};
});
