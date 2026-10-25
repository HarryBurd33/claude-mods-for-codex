import { BOUNDS } from './routing-contract.mjs';

// Counts stdout AND stderr; never decodes or retains stderr. Only complete,
// bounded UTF-8 JSON lines reach the state machine. No logging of failed input.
export function createRoutingFrames(onPacket, onFailure) {
  let total = 0, messages = 0, rest = Buffer.alloc(0), failed = false;
  const fail = reason => { if (!failed) { failed = true; rest = Buffer.alloc(0); onFailure(reason); } };
  return Object.freeze({
    push(chunk, stderr = false) {
      if (failed) return;
      if (!Buffer.isBuffer(chunk)) return fail('malformed-protocol');
      total += chunk.length;
      if (total > BOUNDS.bytes) return fail('byte-limit');
      if (stderr) return;
      rest = Buffer.concat([rest, chunk]);
      let end;
      while ((end = rest.indexOf(10)) !== -1 && !failed) {
        if (end > BOUNDS.frameBytes) return fail('frame-limit');
        if (++messages > BOUNDS.messages) return fail('message-limit');
        const line = rest.subarray(0, end); rest = rest.subarray(end + 1);
        let value;
        try { value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(line)); }
        catch { return fail('malformed-protocol'); }
        try { onPacket(value); } catch { fail('driver-error'); }
      }
      if (rest.length > BOUNDS.frameBytes) fail('frame-limit');
    },
    finish() { if (rest.length) fail('incomplete-frame'); },
    counters() { return { transportBytes: total, messages, framingFailed: failed }; },
  });
}
