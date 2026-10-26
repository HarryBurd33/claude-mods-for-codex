import { READINESS_LIMITS as L } from './readiness-machine.mjs';

// Counts both streams, discards stderr; never reports raw bytes or parse errors.
export function createReadinessFrames(onPacket, onFailure) {
  let bytes = 0, messages = 0, rest = Buffer.alloc(0), failed = false;
  const fail = reason => { if (!failed) { failed = true; rest = Buffer.alloc(0); onFailure(reason); } };
  return Object.freeze({
    push(chunk, stderr = false) {
      if (failed) return;
      if (!Buffer.isBuffer(chunk)) return fail('malformed-protocol');
      bytes += chunk.length; if (bytes > L.bytes) return fail('byte-limit');
      if (stderr) return;
      rest = Buffer.concat([rest, chunk]); let end;
      while ((end = rest.indexOf(10)) !== -1 && !failed) {
        if (end > L.frameBytes) return fail('frame-limit');
        if (++messages > L.messages) return fail('message-limit');
        const line = rest.subarray(0, end); rest = rest.subarray(end + 1);
        let packet;
        try { packet = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(line)); }
        catch { return fail('malformed-protocol'); }
        try { onPacket(packet); } catch { fail('driver-error'); }
      }
      if (rest.length > L.frameBytes) fail('frame-limit');
    },
    finish() { if (rest.length) fail('incomplete-frame'); },
    counters() { return { transportBytes: bytes, messages, framingFailed: failed }; },
  });
}
