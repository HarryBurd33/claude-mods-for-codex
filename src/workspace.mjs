import { spawn } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { lstat, mkdir, mkdtemp, open, opendir, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, isAbsolute, join, relative, resolve, sep } from "node:path";

const LIMITS = Object.freeze({ entries: 1000, depth: 16, files: 20, diffBytes: 128 * 1024, fileBytes: 256 * 1024 });
const EXCLUDED_DIRECTORY = /^(?:\.git|\.aws|\.ssh|\.gnupg|\.codex|\.local|\.docker|\.kube|\.azure|\.gcloud|node_modules|\.venv|venv|vendor|dist|build|coverage)$/i;
const SECRET_NAME = /^(?:\.env(?:\..*)?|\.npmrc|\.netrc|\.pypirc|\.git-credentials|auth\.json|id_(?:rsa|dsa|ecdsa|ed25519)(?:\..*)?|credentials?(?:\..*)?|secrets?(?:\..*)?|.*\.(?:pem|key|p12|pfx|jks|keystore))$/i;
const UNSAFE_TEXT = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g;
const OMIT_REASON = "Project-ignored, sensitive, linked, special, or unsupported paths are omitted; user/global Git ignore files are not loaded.";
const safeName = (path) => basename(path).replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, "�");

function safeError(message) { return new Error(`Workspace inspection: ${message}`); }
function plainOptions(value, allowed) {
  if (value === undefined) return {};
  if (value === null || typeof value !== "object" || Array.isArray(value)
    || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw safeError("options must be a plain object");
  for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
    if (!allowed.includes(key) || !("value" in descriptor)) throw safeError("unsupported option");
  }
  return value;
}
function bounded(value, fallback, maximum, name) {
  if (value === undefined) return fallback;
  if (!Number.isInteger(value) || value < 1 || value > maximum) throw safeError(`invalid ${name} limit`);
  return value;
}
function safeRelative(path) {
  return typeof path === "string" && path.length > 0 && path.length <= 1024 && !isAbsolute(path)
    && !/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069\\]/.test(path)
    && path.split("/").every((part) => part !== "" && part !== "." && part !== "..");
}
function permitted(path) {
  return safeRelative(path) && path.split("/").every((part) => !EXCLUDED_DIRECTORY.test(part) && !SECRET_NAME.test(part));
}
async function selectedRoot(path) {
  if (typeof path !== "string" || !isAbsolute(path) || path.includes("\0")) throw safeError("an explicit absolute project root is required");
  const normalized = resolve(path);
  const stat = await lstat(normalized).catch(() => { throw safeError("selected project is unavailable"); });
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw safeError("selected project must be a regular directory");
  const canonical = await realpath(normalized);
  // A parent symlink is allowed in an explicitly selected root; all later paths use its canonical location.
  return canonical;
}
async function checkedPath(root, path, { allowMissing = false, directory = false } = {}) {
  if (!safeRelative(path)) throw safeError("unsafe relative path");
  const parts = path.split("/");
  let current = root;
  for (let i = 0; i < parts.length; i++) {
    current = join(current, parts[i]);
    let stat;
    try { stat = await lstat(current); }
    catch (error) {
      if (error.code === "ENOENT" && allowMissing) return { missing: true };
      throw safeError("path is unavailable");
    }
    if (stat.isSymbolicLink()) throw safeError("linked paths are excluded");
    if (i < parts.length - 1 || directory) {
      if (!stat.isDirectory()) throw safeError("path is not a regular directory");
    } else if (!stat.isFile() || stat.nlink !== 1) throw safeError("special or multiply linked files are excluded");
    const actual = await realpath(current);
    const containment = relative(root, actual);
    if (containment === ".." || containment.startsWith(`..${sep}`) || isAbsolute(containment)) throw safeError("path escapes the selected project");
    if (i === parts.length - 1) return { path: current, stat };
  }
}
async function boundedRead(root, path, limit) {
  const checked = await checkedPath(root, path);
  if (checked.stat.size > limit) throw safeError("file exceeds the read limit");
  let handle;
  try {
    handle = await open(checked.path, fsConstants.O_RDONLY | (fsConstants.O_NOFOLLOW ?? 0) | (fsConstants.O_NONBLOCK ?? 0));
    const stat = await handle.stat();
    if (!stat.isFile() || stat.nlink !== 1 || stat.dev !== checked.stat.dev || stat.ino !== checked.stat.ino || stat.size > limit) {
      throw safeError("file changed during inspection");
    }
    const buffer = Buffer.alloc(limit + 1);
    let total = 0;
    while (total <= limit) {
      const { bytesRead } = await handle.read(buffer, total, limit + 1 - total, total);
      if (!bytesRead) break;
      total += bytesRead;
    }
    if (total > limit) throw safeError("file exceeds the read limit");
    return buffer.subarray(0, total);
  } finally { await handle?.close(); }
}

// Git never loads project/user configuration. Only the selected repository's validated
// object files, copied index, optional local ignore patterns and resolved HEAD are used.
// This supports ordinary repositories; linked worktrees, alternates and unusual formats
// intentionally fail closed instead of broadening the selected filesystem boundary.
async function objectDirectory(root, deadline) {
  await checkedPath(root, ".git/objects", { directory: true });
  let entries = 0;
  async function inspect(path, depth) {
    if (depth > 3) throw safeError("unsupported Git object layout");
    for await (const entry of await opendir(join(root, path))) {
      const name = entry.name;
      if (Date.now() > deadline) throw safeError("Git metadata inspection deadline exceeded");
      if (++entries > 20000) throw safeError("Git object inspection limit exceeded");
      if (!safeRelative(name)) throw safeError("unsupported Git metadata path");
      const child = `${path}/${name}`;
      const stat = await lstat(join(root, child));
      if (stat.isSymbolicLink() || (!stat.isDirectory() && (!stat.isFile() || stat.nlink !== 1))) throw safeError("unsafe Git object metadata");
      if (stat.isDirectory()) await inspect(child, depth + 1);
      else if (/\/(?:alternates|http-alternates)$/.test(child) && stat.size !== 0) throw safeError("external Git object stores are excluded");
    }
  }
  await inspect(".git/objects", 0);
  return join(root, ".git", "objects");
}
async function headObject(root) {
  let text = (await boundedRead(root, ".git/HEAD", 4096)).toString("utf8").trim();
  for (let i = 0; i < 8; i++) {
    if (/^[a-f0-9]{40}$/.test(text)) return text;
    const match = /^ref: (refs\/[A-Za-z0-9_./-]+)$/.exec(text);
    if (!match || !safeRelative(match[1])) throw safeError("unsupported Git HEAD format");
    const ref = match[1];
    const checked = await checkedPath(root, `.git/${ref}`, { allowMissing: true });
    if (!checked.missing) { text = (await boundedRead(root, `.git/${ref}`, 4096)).toString("utf8").trim(); continue; }
    const packed = await checkedPath(root, ".git/packed-refs", { allowMissing: true });
    if (packed.missing) return null;
    const lines = (await boundedRead(root, ".git/packed-refs", 4 * 1024 * 1024)).toString("utf8").split("\n");
    for (const line of lines) {
      const found = /^([a-f0-9]{40}) (refs\/.+)$/.exec(line);
      if (found?.[2] === ref) return found[1];
    }
    return null;
  }
  throw safeError("Git reference chain is too long");
}
async function gitContext(root) {
  const deadline = Date.now() + 10000;
  const metadata = await checkedPath(root, ".git", { directory: true }).catch(() => { throw safeError("a regular in-project Git repository is required"); });
  if (metadata.stat.isSymbolicLink()) throw safeError("linked Git metadata is excluded");
  const common = await checkedPath(root, ".git/commondir", { allowMissing: true });
  if (!common.missing) throw safeError("linked worktree metadata is excluded");
  const objects = await objectDirectory(root, deadline);
  const head = await headObject(root);
  const temporary = await mkdtemp(join(tmpdir(), "codex-mods-git-view-"));
  try {
    await mkdir(join(temporary, "objects"));
    await mkdir(join(temporary, "refs"));
    await mkdir(join(temporary, "info"));
    await writeFile(join(temporary, "config"), "[core]\nrepositoryformatversion = 0\nbare = false\nfilemode = true\n", { mode: 0o600 });
    await writeFile(join(temporary, "HEAD"), head ? `${head}\n` : "ref: refs/heads/mods-inspection\n", { mode: 0o600 });
    for (const [source, target, bound] of [[".git/index", "index", 32 * 1024 * 1024], [".git/info/exclude", "info/exclude", 1024 * 1024]]) {
      const checked = await checkedPath(root, source, { allowMissing: true });
      if (!checked.missing) await writeFile(join(temporary, target), await boundedRead(root, source, bound), { mode: 0o600 });
    }
    return { root, temporary, objects, head, deadline };
  } catch (error) { await rm(temporary, { recursive: true, force: true }); throw error; }
}
async function git(context, args, maxBytes = 2 * 1024 * 1024) {
  const remaining = Math.min(3000, context.deadline - Date.now());
  if (remaining <= 0) throw safeError("Git inspection deadline exceeded");
  const environment = {
    PATH: process.env.PATH ?? "", ...(process.platform === "win32" ? { SystemRoot: process.env.SystemRoot ?? "C:\\Windows" } : {}),
    LANG: "C", LC_ALL: "C", GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_SYSTEM: process.platform === "win32" ? "NUL" : "/dev/null",
    GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null", GIT_TERMINAL_PROMPT: "0", GIT_OPTIONAL_LOCKS: "0",
    GIT_NO_LAZY_FETCH: "1", GIT_NO_REPLACE_OBJECTS: "1", GIT_ATTR_NOSYSTEM: "1", GIT_PAGER: "", GIT_LITERAL_PATHSPECS: "1",
    GIT_DIR: context.temporary, GIT_WORK_TREE: context.root, GIT_OBJECT_DIRECTORY: context.objects,
  };
  const command = ["--no-optional-locks", "-c", "core.fsmonitor=false", "-c", "core.hooksPath=", "-c", "core.attributesFile=",
    "-c", "diff.external=", "-c", "credential.helper=", "-c", "core.untrackedCache=false", "-c", "core.quotePath=false", ...args];
  return new Promise((resolvePromise, reject) => {
    const child = spawn("git", command, { cwd: context.root, env: environment, shell: false, detached: process.platform !== "win32", stdio: ["ignore", "pipe", "ignore"], windowsHide: true });
    let bytes = 0; const chunks = []; let failure;
    function stop(message) {
      failure ??= safeError(message);
      try { if (process.platform !== "win32" && child.pid) process.kill(-child.pid, "SIGKILL"); else child.kill("SIGKILL"); } catch { child.kill("SIGKILL"); }
    }
    const timer = setTimeout(() => stop("Git inspection deadline exceeded"), remaining);
    child.stdout.on("data", (chunk) => { bytes += chunk.length; if (bytes > maxBytes) stop("Git output limit exceeded"); else chunks.push(chunk); });
    child.on("error", () => { clearTimeout(timer); reject(safeError("Git executable is unavailable")); });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (failure) reject(failure);
      else if (code !== 0) reject(safeError("Git could not inspect this repository"));
      else resolvePromise(Buffer.concat(chunks));
    });
  });
}
async function inProject(root, callback) {
  let context;
  try { context = await gitContext(root); return await callback(context); }
  finally { if (context) await rm(context.temporary, { recursive: true, force: true }); }
}
function unavailable(error) {
  return { available: false, reason: error.message.startsWith("Workspace inspection:") ? error.message : "Workspace inspection: project changed or is unavailable" };
}
function parseStatus(buffer) {
  const records = buffer.toString("utf8").split("\0");
  const result = new Map();
  for (let i = 0; i < records.length; i++) {
    if (!records[i]) continue;
    const status = records[i].slice(0, 2); const path = records[i].slice(3);
    if (!/^[ MADRCU?!]{2}$/.test(status)) throw safeError("unrecognized Git status");
    const from = /[RC]/.test(status) ? records[++i] : undefined;
    // Neither endpoint of a rename may reveal a sensitive or unsupported path.
    if (!permitted(path) || (from !== undefined && !permitted(from))) continue;
    result.set(path, { path, status, ...(from ? { from } : {}) });
  }
  return result;
}
async function status(context) {
  return parseStatus(await git(context, ["status", "--porcelain=v1", "-z", "--untracked-files=all", "--ignored=no", "--ignore-submodules=all", "--renames"]));
}
const provenance = { readOnly: true, source: "git-working-tree-against-HEAD", attribution: "May include concurrent human edits; does not establish previous-turn changes.", exclusions: OMIT_REASON };

export async function describeProject(absoluteRoot) {
  const root = await selectedRoot(absoluteRoot);
  try { return await inProject(root, async (context) => {
    await git(context, ["rev-parse", "--is-inside-work-tree"], 1024);
    return { available: true, name: safeName(root), readOnly: true, versionControl: "git", baseline: context.head ? "HEAD" : "empty-repository", limits: LIMITS, exclusions: OMIT_REASON };
  }); } catch (error) { return { ...unavailable(error), name: safeName(root), readOnly: true }; }
}

export async function listProjectFiles(absoluteRoot, input) {
  const options = plainOptions(input, ["maxEntries", "maxDepth"]);
  const maxEntries = bounded(options.maxEntries, LIMITS.entries, LIMITS.entries, "entry");
  const maxDepth = bounded(options.maxDepth, LIMITS.depth, LIMITS.depth, "depth");
  const root = await selectedRoot(absoluteRoot);
  try { return await inProject(root, async (context) => {
    const paths = (await git(context, ["ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", "."])).toString("utf8").split("\0");
    const statuses = await status(context); const files = []; let truncated = false; let omitted = 0;
    for (const path of [...new Set(paths)].sort()) {
      if (!path) continue;
      if (!permitted(path) || path.split("/").length > maxDepth) { omitted++; continue; }
      let checked;
      try { checked = await checkedPath(root, path); } catch { omitted++; continue; }
      if (files.length >= maxEntries) { truncated = true; break; }
      files.push({ path, kind: "file", bytes: checked.stat.size, status: statuses.get(path)?.status ?? "  " });
    }
    return { available: true, readOnly: true, source: "selected-project-files", files, truncated, omitted, exclusions: OMIT_REASON };
  }); } catch (error) { return { ...unavailable(error), readOnly: true, files: [] }; }
}

export async function inspectProjectChanges(absoluteRoot, input) {
  const options = plainOptions(input, ["maxFiles", "maxDiffBytes", "maxFileBytes", "includeDiffs"]);
  const maxFiles = bounded(options.maxFiles, LIMITS.files, LIMITS.files, "file");
  const maxDiffBytes = bounded(options.maxDiffBytes, LIMITS.diffBytes, LIMITS.diffBytes, "diff byte");
  const maxFileBytes = bounded(options.maxFileBytes, LIMITS.fileBytes, LIMITS.fileBytes, "file byte");
  if (options.includeDiffs !== undefined && typeof options.includeDiffs !== "boolean") throw safeError("includeDiffs must be boolean");
  const root = await selectedRoot(absoluteRoot);
  try { return await inProject(root, async (context) => {
    const statuses = await status(context); const files = []; let truncated = false; let remaining = maxDiffBytes;
    for (const changed of statuses.values()) {
      if (files.length >= maxFiles) { truncated = true; break; }
      let checked;
      try { checked = await checkedPath(root, changed.path, { allowMissing: true }); } catch { continue; }
      const item = { ...changed, diffStatus: "not-requested" };
      files.push(item);
      if (!options.includeDiffs) continue;
      if (checked.stat?.size > maxFileBytes) { item.diffStatus = "large"; continue; }
      if (remaining < 128) { item.diffStatus = "truncated"; truncated = true; continue; }
      try {
        let diff;
        if (changed.status === "??" || !context.head) {
          if (checked.missing) { item.diffStatus = "unavailable"; continue; }
          const text = await boundedRead(root, changed.path, maxFileBytes);
          if (text.includes(0)) { item.diffStatus = "binary"; continue; }
          const content = text.toString("utf8").replace(UNSAFE_TEXT, "�");
          diff = Buffer.from(`--- /dev/null\n+++ b/${changed.path}\n@@ -0,0 +1,${content.split("\n").length} @@\n${content.split("\n").map((line) => `+${line}`).join("\n")}\n`);
        } else {
          diff = await git(context, ["diff", "--no-ext-diff", "--no-textconv", "--no-color", "--no-renames", "--unified=3", "--ignore-submodules=all", "HEAD", "--", changed.path, ...(changed.from ? [changed.from] : [])], remaining);
        }
        if (diff.length > remaining) { item.diffStatus = "truncated"; truncated = true; continue; }
        const content = diff.toString("utf8").replace(UNSAFE_TEXT, "�");
        const safeBytes = Buffer.byteLength(content);
        if (safeBytes > remaining) { item.diffStatus = "truncated"; truncated = true; continue; }
        remaining -= safeBytes;
        if (/^(?:Binary files |GIT binary patch)/m.test(content) || diff.includes(0)) item.diffStatus = "binary";
        else { item.diffStatus = "text"; item.diff = content; }
      } catch (error) { item.diffStatus = /limit|deadline/.test(error.message) ? "truncated" : "unavailable"; truncated ||= item.diffStatus === "truncated"; }
    }
    return { available: true, ...provenance, baseline: context.head ? "HEAD" : "empty-repository", files, truncated, includesDiffs: options.includeDiffs === true };
  }); } catch (error) { return { ...unavailable(error), ...provenance, files: [] }; }
}
