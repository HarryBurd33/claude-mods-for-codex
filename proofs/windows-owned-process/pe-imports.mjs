// Original MIT, proof-only static PE inventory. No filesystem, execution, loader,
// signature/provenance, dependency resolution or production API. Narrow subset
// from https://learn.microsoft.com/en-us/windows/win32/debug/pe-format .
export const MAX_PE_BYTES = 32 * 1024 * 1024;
const refuse = () => { throw new Error('PE inventory refused'); };
export function peImports(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 64 || bytes.length > MAX_PE_BYTES) refuse();
  const fits = (p, n, limit = bytes.length) => Number.isSafeInteger(p) && p >= 0 && n >= 0 && p <= limit - n;
  const u16 = p => { if (!fits(p, 2)) refuse(); return bytes.readUInt16LE(p); };
  const u32 = p => { if (!fits(p, 4)) refuse(); return bytes.readUInt32LE(p); };
  if (u16(0) !== 0x5a4d) refuse();
  const pe = u32(0x3c);
  if (pe < 64 || !fits(pe, 24) || u32(pe) !== 0x4550) refuse();
  const machine = ({ 0x14c: 'x86', 0x8664: 'x64', 0xaa64: 'arm64' })[u16(pe + 4)];
  const count = u16(pe + 6), optionalSize = u16(pe + 20), optional = pe + 24;
  if (!machine || count < 1 || count > 96 || !fits(optional, optionalSize) || optionalSize < 2) refuse();
  const magic = u16(optional), plus = magic === 0x20b;
  if (magic !== 0x10b && !plus) refuse();
  if ((machine === 'x86') === plus) refuse();
  const directoryOffset = plus ? 112 : 96;
  if (optionalSize < directoryOffset) refuse();
  const directories = u32(optional + directoryOffset - 4);
  if (directories > 16 || directoryOffset + directories * 8 > optionalSize) refuse();
  const headers = u32(optional + 60), table = optional + optionalSize;
  if (!fits(table, count * 40, headers) || !fits(0, headers)) refuse();
  const sections = [];
  for (let i = 0; i < count; i++) {
    const p = table + i * 40, virtual = u32(p + 12), size = u32(p + 16), raw = u32(p + 20);
    const span = Math.max(size, u32(p + 8));
    if (span && (virtual < headers || virtual + span > 0x100000000)) refuse();
    if (size && (raw < headers || !fits(raw, size))) refuse();
    for (const s of sections) {
      if (span && s.span && virtual < s.virtual + s.span && s.virtual < virtual + span) refuse();
      if (size && s.size && raw < s.raw + s.size && s.raw < raw + size) refuse();
    }
    sections.push({ virtual, raw, size, span });
  }
  // Only one complete file-backed mapping. Virtual zero-filled tails, section
  // crossings, overflow and ambiguous/overlapping sections are never guessed.
  function map(rva, size) {
    if (!Number.isInteger(rva) || rva < 0 || size < 1 || rva + size > 0x100000000) refuse();
    if (rva < headers && fits(rva, size, headers)) return rva;
    const s = sections.find(s => rva >= s.virtual && fits(rva - s.virtual, size, s.size));
    if (!s) refuse();
    return s.raw + rva - s.virtual;
  }
  const unique = new Set();
  function name(rva) {
    // Bounded ASCII DLL basename only. No path/environment expansion or file IO.
    let value = '';
    for (let i = 0; i <= 120; i++) {
      const c = bytes[map(rva, i + 1) + i];
      if (!c) {
        if (!/^[a-z0-9][a-z0-9._-]*\.dll$/i.test(value)) refuse();
        unique.add(value.toLowerCase()); if (unique.size > 64) refuse();
        return value.toLowerCase();
      }
      if (i === 120 || c > 0x7f) refuse();
      value += String.fromCharCode(c);
    }
    refuse();
  }
  function imports(index, delayed) {
    if (directories <= index) return [];
    const d = optional + directoryOffset + index * 8, rva = u32(d), size = u32(d + 4);
    if (!rva && !size) return [];
    const width = delayed ? 32 : 20;
    if (!rva || size < width || size > 1024 * 1024) refuse();
    const base = map(rva, size), names = new Set();
    for (let n = 0; n < 129 && (n + 1) * width <= size; n++) {
      const p = base + n * width;
      if (bytes.subarray(p, p + width).every(x => x === 0)) return [...names].sort();
      if (n === 128 || (delayed && u32(p) !== 1)) refuse();
      const target = u32(p + (delayed ? 4 : 12));
      if (!target) refuse();
      names.add(name(target));
    }
    refuse(); // No null descriptor within the declared bounded directory.
  }
  return { machine, format: plus ? 'PE32+' : 'PE32', imports: imports(1, false), delayImports: imports(13, true) };
}
