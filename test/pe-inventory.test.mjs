import assert from 'node:assert/strict';
import test from 'node:test';
import { peImports, MAX_PE_BYTES } from '../proofs/windows-owned-process/pe-imports.mjs';

// Original synthetic bytes, never an executable fixture to launch or DLL to load.
function image(plus = true) {
  const b = Buffer.alloc(0x6200), pe = 0x80, op = pe + 24, dirs = op + (plus ? 112 : 96);
  const u16 = (p, v) => b.writeUInt16LE(v, p), u32 = (p, v) => b.writeUInt32LE(v, p);
  u16(0, 0x5a4d); u32(0x3c, pe); u32(pe, 0x4550); u16(pe + 4, plus ? 0x8664 : 0x14c);
  u16(pe + 6, 1); u16(pe + 20, plus ? 240 : 224); u16(op, plus ? 0x20b : 0x10b);
  u32(op + 60, 0x200); u32(dirs - 4, 16);
  const section = op + (plus ? 240 : 224);
  u32(section + 8, 0x6000); u32(section + 12, 0x1000); u32(section + 16, 0x6000); u32(section + 20, 0x200);
  u32(dirs + 8, 0x1000); u32(dirs + 12, 40);
  u32(0x20c, 0x1100); b.write('KERNEL32.dll\0', 0x300, 'ascii');
  u32(dirs + 13 * 8, 0x1200); u32(dirs + 13 * 8 + 4, 64);
  u32(0x400, 1); u32(0x404, 0x1300); b.write('USER32.dll\0', 0x500, 'ascii');
  return { b, pe, op, dirs, section, u16, u32 };
}
function refused(b) { assert.throws(() => peImports(b), { message: 'PE inventory refused' }); }
test('PE static inventory reads ordinary and RVA delay DLL names from PE32 and PE32+', () => {
  for (const plus of [false, true]) {
    const { b } = image(plus), before = Buffer.from(b);
    assert.deepEqual(peImports(b), { machine: plus ? 'x64' : 'x86', format: plus ? 'PE32+' : 'PE32', imports: ['kernel32.dll'], delayImports: ['user32.dll'] });
    assert.deepEqual(b, before, 'read-only parser');
  }
  const f = image(); f.u16(f.pe + 4, 0xaa64); assert.equal(peImports(f.b).machine, 'arm64');
});
test('PE static inventory accepts absent directories without inferring loader completeness', () => {
  const f = image(); f.u32(f.dirs - 4, 0);
  assert.deepEqual(peImports(f.b).imports, []); assert.deepEqual(peImports(f.b).delayImports, []);
  f.u32(f.dirs - 4, 16); f.b.fill(0, f.dirs, f.dirs + 128);
  assert.deepEqual(peImports(f.b).imports, []);
});
test('PE static inventory refuses invalid signature, architecture, optional header and sizes', () => {
  refused(null); refused(new Uint8Array(64)); refused(Buffer.alloc(MAX_PE_BYTES + 1));
  for (const change of [f => f.u16(0, 0), f => f.u32(0x3c, 0xffffffff), f => f.u32(f.pe, 0),
    f => f.u16(f.pe + 4, 0), f => f.u16(f.op, 0), f => f.u16(f.pe + 4, 0x14c),
    f => f.u16(f.pe + 20, 2), f => f.u32(f.dirs - 4, 17), f => f.u32(f.op + 60, 0xffffffff),
    f => f.u16(f.pe + 6, 0), f => f.u16(f.pe + 6, 97)]) {
    const f = image(); change(f); refused(f.b);
  }
  for (const n of [0, 63, 127, 150, 200, 511, 0x6100]) refused(image().b.subarray(0, n));
});
test('PE static inventory refuses ambiguous, header-alias, overflowing and virtual-only section data', () => {
  for (const change of [f => f.u32(f.section + 12, 0), f => f.u32(f.section + 12, 0xfffff000),
    f => f.u32(f.section + 20, 0), f => f.u32(f.section + 16, 0),
    f => { f.u16(f.pe + 6, 2); f.b.copy(f.b, f.section + 40, f.section, f.section + 40); },
    f => { f.u32(f.section + 16, 16); }]) {
    const f = image(); change(f); refused(f.b);
  }
});
test('PE static inventory bounds directory bytes, descriptor counts and termination', () => {
  for (const size of [1, 19, 20, 1048577, 0xffffffff]) { const f = image(); f.u32(f.dirs + 12, size); refused(f.b); }
  for (const rva of [0, 0xffffffff, 0x6ff0]) { const f = image(); f.u32(f.dirs + 8, rva); refused(f.b); }
  const f = image(); f.u32(f.dirs + 12, 130 * 20);
  for (let n = 0; n < 129; n++) f.u32(0x20c + 20 * n, 0x6000);
  f.b.write('same.dll\0', 0x5200); refused(f.b);
});
test('PE static inventory refuses malformed DLL names, unsafe paths, non-ASCII and missing NUL', () => {
  for (const value of ['../x.dll', 'C:x.dll', '\\x.dll', 'bad name.dll', '.dll', 'x.exe', 'x\n.dll', 'x'.repeat(121) + '.dll']) {
    const f = image(); f.b.fill(0, 0x300, 0x400); f.b.write(value, 0x300); refused(f.b);
  }
  const f = image(); f.b[0x300] = 0xff; refused(f.b);
  const g = image(); g.u32(0x20c, 0x6ffc); g.b.write('a.dl', 0x61fc); refused(g.b);
});
test('PE static inventory refuses delay VA pointers and reserved attributes rather than guessing', () => {
  for (const attr of [0, 2, 3, 0xffffffff]) { const f = image(); f.u32(0x400, attr); refused(f.b); }
  const f = image(); f.u32(f.dirs + 13 * 8 + 4, 32); refused(f.b);
});
test('PE static inventory bounds unique DLL names and case-insensitive deduplication', () => {
  const f = image(); f.u32(f.dirs + 12, 66 * 20);
  for (let i = 0; i < 65; i++) { f.u32(0x20c + i * 20, 0x3000 + i * 32); f.b.write(`item${i}.dll\0`, 0x2200 + i * 32); }
  // Delay directory was overwritten by descriptors; remove it for this fixture.
  f.u32(f.dirs + 13 * 8, 0); f.u32(f.dirs + 13 * 8 + 4, 0); refused(f.b);
  const g = image(); g.u32(g.dirs + 12, 60); g.u32(0x220, 0x1140); g.b.write('kernel32.DLL\0', 0x340);
  assert.deepEqual(peImports(g.b).imports, ['kernel32.dll']);
});
