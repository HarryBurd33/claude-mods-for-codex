// Selected-file verification only; no native executable, model, config write or discovery.
import { open, lstat, realpath, opendir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { createHash } from 'node:crypto';
import { validateNativePlan } from './routing-native-plan.mjs';

async function readSelected(path, maxBytes, collect = false) {
  if (process.platform !== 'darwin') throw Error('Native target unavailable');
  if (typeof path !== 'string' || !path.startsWith('/') || !Number.isSafeInteger(maxBytes)
    || maxBytes < 1 || maxBytes > 256 * 1024 * 1024) throw Error('Native input refused');
  if (await realpath(path) !== path) throw Error('Native input identity changed');
  const a = await lstat(path);
  if (!a.isFile() || a.isSymbolicLink() || a.size > maxBytes || a.nlink !== 1) throw Error('Native input identity changed');
  const fd = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const b = await fd.stat();
    if (!b.isFile() || a.dev !== b.dev || a.ino !== b.ino || a.size !== b.size || b.nlink !== 1) throw Error('Native input identity changed');
    if (collect && (a.mode & 0o077)) throw Error('Native review artifact privacy');
    const buffer = Buffer.alloc(65536), hash = createHash('sha256'), chunks = []; let total = 0;
    while (true) {
      const { bytesRead } = await fd.read(buffer, 0, Math.min(buffer.length, maxBytes - total + 1), null);
      if (!bytesRead) break;
      total += bytesRead; if (total > maxBytes) throw Error('Native input bound');
      hash.update(buffer.subarray(0, bytesRead));
      if (collect) chunks.push(Buffer.from(buffer.subarray(0, bytesRead)));
    }
    const c = await fd.stat(), d = await lstat(path);
    if (total !== a.size || [c, d].some(v => v.dev !== a.dev || v.ino !== a.ino || v.size !== a.size
      || v.mtimeMs !== a.mtimeMs || v.ctimeMs !== a.ctimeMs || v.nlink !== 1)) throw Error('Native input identity changed');
    return { hash: hash.digest('hex'), bytes: collect ? Buffer.concat(chunks, total) : null };
  } finally { await fd.close(); }
}
export async function hashNativeInput(path, maxBytes) {
  return (await readSelected(path, maxBytes)).hash;
}
export async function readNativeReview(path) {
  const { bytes } = await readSelected(path, 256 * 1024, true);
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
export async function verifyNativeInputs(reviewPlan) {
  if (process.platform !== 'darwin') throw Error('Native target unavailable');
  const plan = validateNativePlan(reviewPlan);
  const records = [{ path: plan.input.cliPath, sha256: plan.input.cliSha256, max: 256 * 1024 * 1024 },
    { path: plan.input.candidatePath, sha256: plan.input.candidateSha256, max: 16384 },
    ...plan.input.configFiles.map(v => ({ ...v, max: 1024 * 1024 }))];
  for (const r of records) if (await hashNativeInput(r.path, r.max) !== r.sha256) throw Error('Native input identity changed');
  if (await realpath(plan.input.cwd) !== plan.input.cwd || !(await lstat(plan.input.cwd)).isDirectory()) throw Error('Native project changed');
  const directory = await opendir(plan.input.cwd);
  try { if (await directory.read() !== null) throw Error('Native project changed'); }
  finally { await directory.close(); }
  return true;
}
