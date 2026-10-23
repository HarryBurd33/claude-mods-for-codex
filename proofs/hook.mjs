import { readBoundedStream, parseJsonObject } from '../src/io.mjs';
import { validateEventEnvelope } from '../src/dispatcher.mjs';
import { appendJournalEntry } from '../src/journal.mjs';
import { rewriteProof } from './rewrite.mjs';

try {
  const event = parseJsonObject(await readBoundedStream(process.stdin, 1048576), 'hook input');
  if (!validateEventEnvelope(event)) throw new Error('Unsupported event');
  const output = event.hook_event_name === 'SessionStart'
    ? { systemMessage: 'Claude Mods native proof is active. Metadata-only probe; fixed harmless command rewrite enabled.' }
    : rewriteProof(event);
  const dataDirectory = process.argv[2] || process.env.PLUGIN_DATA;
  if (dataDirectory) {
    try { await appendJournalEntry(dataDirectory, { event: event.hook_event_name, ...(event.tool_name ? { tool: event.tool_name } : {}), ...(output.hookSpecificOutput?.permissionDecision === 'deny' ? { decision: 'deny' } : {}) }); }
    catch { process.stderr.write('mods-proof: metadata unavailable\n'); }
  }
  process.stdout.write(`${JSON.stringify(output)}\n`);
} catch {
  process.stderr.write('mods-proof: invalid input\n');
  process.exitCode = 1;
}
