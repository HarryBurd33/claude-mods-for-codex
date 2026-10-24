import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { link, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { describeProject, inspectProjectChanges, listProjectFiles } from "../src/workspace.mjs";

function git(root, ...args) {
  const result = spawnSync("git", ["-c", "user.name=Synthetic Test", "-c", "user.email=synthetic@example.invalid", ...args], {
    cwd: root, encoding: "utf8", timeout: 5000,
    env: { PATH: process.env.PATH, ...(process.platform === "win32" ? { SystemRoot: process.env.SystemRoot } : {}),
      GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null", GIT_TERMINAL_PROMPT: "0" },
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
  return result.stdout;
}
async function fixture(t, { commit = true } = {}) {
  const root = await mkdtemp(join(await realpath(tmpdir()), "mods-workspace-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  git(root, "init", "--initial-branch=main");
  await writeFile(join(root, ".gitignore"), "ignored/\n*.ignored\n");
  await writeFile(join(root, "hello.txt"), "hello\n");
  if (commit) { git(root, "add", "."); git(root, "commit", "-m", "Synthetic baseline"); }
  return root;
}
function paths(result) { return result.files.map((entry) => entry.path); }

test("selected project is explicit and returned metadata does not disclose absolute paths", async (t) => {
  const root = await fixture(t);
  for (const bad of [".", "", undefined, "/synthetic-project-does-not-exist"]) await assert.rejects(describeProject(bad), /Workspace inspection/);
  const result = await describeProject(root);
  assert.equal(result.available, true);
  assert.equal(result.readOnly, true);
  assert.equal(result.versionControl, "git");
  assert.equal(result.baseline, "HEAD");
  assert.doesNotMatch(JSON.stringify(result), new RegExp(root));
  for (const input of [{ maxEntries: 1001 }, { maxDepth: 0 }, { root: "/" }, { get maxDepth() { throw new Error("getter executed"); } }]) {
    await assert.rejects(listProjectFiles(root, input), /limit|option/);
  }
  await assert.rejects(inspectProjectChanges(root, { includeDiffs: "yes" }), /boolean/);
});

test("explorer honors project ignores, excludes sensitive names, and reports status", async (t) => {
  const root = await fixture(t);
  await mkdir(join(root, "ignored"));
  await mkdir(join(root, "nested"));
  await mkdir(join(root, ".ssh"));
  await writeFile(join(root, "ignored", "hidden.txt"), "synthetic ignored");
  await writeFile(join(root, "nested", "useful.txt"), "safe");
  await writeFile(join(root, "data.ignored"), "synthetic ignored");
  await writeFile(join(root, ".env"), "SYNTHETIC_SECRET=not-a-secret");
  await writeFile(join(root, "nested", "credentials.json"), '{"synthetic":true}');
  await writeFile(join(root, "nested", "private.key"), "synthetic");
  await writeFile(join(root, ".ssh", "config"), "synthetic");
  await writeFile(join(root, "hello.txt"), "changed\n");
  const result = await listProjectFiles(root);
  assert.equal(result.available, true);
  assert.deepEqual(paths(result), [".gitignore", "hello.txt", "nested/useful.txt"]);
  assert.equal(result.files.find((entry) => entry.path === "hello.txt").status, " M");
  assert.equal(result.files.find((entry) => entry.path === "nested/useful.txt").status, "??");
  assert.doesNotMatch(JSON.stringify(result), /SYNTHETIC_SECRET|ignored\/hidden|credentials|private\.key/);
});

test("paths containing traversal syntax or terminal controls cannot appear in explorer", { skip: process.platform === "win32" }, async (t) => {
  const root = await fixture(t);
  await writeFile(join(root, "odd\nname.txt"), "safe");
  await writeFile(join(root, "odd\\name.txt"), "safe");
  await writeFile(join(root, "--help.txt"), "safe");
  const result = await listProjectFiles(root);
  assert.equal(result.available, true);
  assert.deepEqual(paths(result), ["--help.txt", ".gitignore", "hello.txt"]);
});

test("links, external paths, multiply linked files and special files stay outside previews", { skip: process.platform === "win32" }, async (t) => {
  const root = await fixture(t);
  const outside = await mkdtemp(join(await realpath(tmpdir()), "mods-outside-"));
  t.after(() => rm(outside, { recursive: true, force: true }));
  await writeFile(join(outside, "outside.txt"), "SYNTHETIC_OUTSIDE_SENTINEL");
  await symlink(join(outside, "outside.txt"), join(root, "escape.txt"));
  await symlink(outside, join(root, "external-directory"));
  await symlink("hello.txt", join(root, "internal-link.txt"));
  await link(join(outside, "outside.txt"), join(root, "hardlink.txt"));
  const fifo = spawnSync("mkfifo", [join(root, "special.txt")]);
  assert.equal(fifo.status, 0);
  git(root, "add", "escape.txt", "internal-link.txt");
  const listed = await listProjectFiles(root);
  assert.equal(listed.available, true);
  assert.deepEqual(paths(listed), [".gitignore", "hello.txt"]);
  const changed = await inspectProjectChanges(root, { includeDiffs: true });
  assert.equal(changed.available, true);
  assert.deepEqual(paths(changed), []);
  assert.doesNotMatch(JSON.stringify(changed), /SYNTHETIC_OUTSIDE_SENTINEL/);
  const alias = join(outside, "root-alias");
  await symlink(root, alias);
  await assert.rejects(describeProject(alias), /regular directory/);
});

test("changes are read-only metadata by default, with explicit plain-text patches against HEAD", async (t) => {
  const root = await fixture(t);
  const originalIndex = await readFile(join(root, ".git", "index"));
  const originalConfig = await readFile(join(root, ".git", "config"));
  await writeFile(join(root, "hello.txt"), "hello\nnew line\n");
  await writeFile(join(root, "new.txt"), "<script>synthetic</script>\n");
  const summary = await inspectProjectChanges(root);
  assert.equal(summary.available, true);
  assert.equal(summary.includesDiffs, false);
  assert.equal(summary.source, "git-working-tree-against-HEAD");
  assert.match(summary.attribution, /does not establish previous-turn/);
  assert.ok(summary.files.every((entry) => !Object.hasOwn(entry, "diff") && entry.diffStatus === "not-requested"));
  const detailed = await inspectProjectChanges(root, { includeDiffs: true });
  assert.equal(detailed.available, true);
  assert.match(detailed.files.find((entry) => entry.path === "hello.txt").diff, /\+new line/);
  assert.match(detailed.files.find((entry) => entry.path === "new.txt").diff, /\+<script>synthetic<\/script>/);
  assert.deepEqual(await readFile(join(root, ".git", "index")), originalIndex);
  assert.deepEqual(await readFile(join(root, ".git", "config")), originalConfig);
  assert.equal((await readdir(join(root, ".git"))).includes("index.lock"), false);
});

test("staged deletions and renames retain relative provenance and excluded endpoints stay private", async (t) => {
  const root = await fixture(t);
  await writeFile(join(root, "remove.txt"), "old value\n");
  await writeFile(join(root, "secret.key"), "synthetic private\n");
  git(root, "add", "."); git(root, "commit", "-m", "Synthetic rename baseline");
  git(root, "mv", "hello.txt", "renamed.txt");
  git(root, "rm", "remove.txt");
  git(root, "mv", "secret.key", "ordinary.txt");
  const result = await inspectProjectChanges(root, { includeDiffs: true });
  assert.equal(result.available, true);
  assert.deepEqual(paths(result), ["remove.txt", "renamed.txt"]);
  assert.match(result.files.find((entry) => entry.path === "remove.txt").diff, /-old value/);
  const renamed = result.files.find((entry) => entry.path === "renamed.txt");
  assert.equal(renamed.from, "hello.txt");
  assert.match(renamed.diff, /hello/);
  assert.doesNotMatch(JSON.stringify(result), /synthetic private|ordinary\.txt|secret\.key/);
});

test("large, binary, control-containing patches and unbounded output have explicit fallbacks", async (t) => {
  const root = await fixture(t);
  await writeFile(join(root, "large.txt"), "x".repeat(300000));
  await writeFile(join(root, "binary.bin"), Buffer.from([0, 1, 2, 0]));
  await writeFile(join(root, "control.txt"), "safe\u001b[31m\u202edanger\n");
  let result = await inspectProjectChanges(root, { includeDiffs: true });
  assert.equal(result.files.find((entry) => entry.path === "large.txt").diffStatus, "large");
  assert.equal(result.files.find((entry) => entry.path === "binary.bin").diffStatus, "binary");
  assert.doesNotMatch(result.files.find((entry) => entry.path === "control.txt").diff, /[\u001b\u202e]/);
  await writeFile(join(root, "hello.txt"), "line\n".repeat(500));
  result = await inspectProjectChanges(root, { includeDiffs: true, maxDiffBytes: 512 });
  assert.equal(result.truncated, true);
  assert.ok(result.files.some((entry) => entry.diffStatus === "truncated"));
  assert.ok(Buffer.byteLength(result.files.map((entry) => entry.diff ?? "").join("")) <= 512);
});

test("entry, depth and change-count bounds remain explicit", async (t) => {
  const root = await fixture(t);
  await mkdir(join(root, "nested"));
  await writeFile(join(root, "nested", "child.txt"), "safe");
  await writeFile(join(root, "new.txt"), "safe");
  const limited = await listProjectFiles(root, { maxEntries: 1 });
  assert.equal(limited.files.length, 1); assert.equal(limited.truncated, true);
  const shallow = await listProjectFiles(root, { maxDepth: 1 });
  assert.equal(paths(shallow).includes("nested/child.txt"), false);
  assert.ok(shallow.omitted > 0);
  const changes = await inspectProjectChanges(root, { maxFiles: 1 });
  assert.equal(changes.files.length, 1); assert.equal(changes.truncated, true);
});

test("unborn repositories show additions without pretending an existing HEAD baseline", async (t) => {
  const root = await fixture(t, { commit: false });
  git(root, "add", "hello.txt");
  const project = await describeProject(root);
  assert.equal(project.available, true);
  assert.equal(project.baseline, "empty-repository");
  const result = await inspectProjectChanges(root, { includeDiffs: true });
  assert.equal(result.available, true);
  assert.equal(result.baseline, "empty-repository");
  assert.match(result.files.find((entry) => entry.path === "hello.txt").diff, /\+hello/);
});

test("repository config, includes, fsmonitor, diff commands, textconv and hooks are never executed", { skip: process.platform === "win32" }, async (t) => {
  const root = await fixture(t);
  const sentinel = join(root, "SYNTHETIC_HELPER_EXECUTED");
  await writeFile(join(root, "helper.sh"), '#!/bin/sh\ntouch "' + sentinel + '"\nexit 1\n', { mode: 0o700 });
  await writeFile(join(root, ".gitattributes"), "*.txt diff=synthetic\n");
  const config = await readFile(join(root, ".git", "config"), "utf8");
  await writeFile(join(root, ".git", "config"), config + '\n[core]\nfsmonitor = "' + join(root, "helper.sh") + '"\nhooksPath = "' + root + '"\n[diff]\nexternal = "' + join(root, "helper.sh") + '"\n[diff "synthetic"]\ncommand = "' + join(root, "helper.sh") + '"\ntextconv = "' + join(root, "helper.sh") + '"\n[include]\npath = /synthetic/not/a/real/config\n');
  await writeFile(join(root, "hello.txt"), "new\n");
  // Check nonexecution even when availability refuses. Report only the API's
  // fixed, sanitized reason; never print a Git stderr/path or patch payload.
  try {
    const files = await listProjectFiles(root);
    assert.equal(files.available, true, files.reason);
    const changes = await inspectProjectChanges(root, { includeDiffs: true });
    assert.equal(changes.available, true, changes.reason);
    assert.match(changes.files.find((entry) => entry.path === "hello.txt").diff, /\+new/);
  } finally {
    await assert.rejects(lstat(sentinel), { code: 'ENOENT' });
    t.diagnostic('synthetic repository helper sentinel absent after inspection');
  }
});

test("external Git stores and linked metadata fail closed with sanitized reasons", { skip: process.platform === "win32" }, async (t) => {
  const root = await fixture(t);
  await mkdir(join(root, ".git", "objects", "info"), { recursive: true });
  await writeFile(join(root, ".git", "objects", "info", "alternates"), "/synthetic/outside-object-store\n");
  let result = await listProjectFiles(root);
  assert.equal(result.available, false); assert.match(result.reason, /external Git object/);
  assert.doesNotMatch(JSON.stringify(result), /outside-object-store/);
  await rm(join(root, ".git", "objects", "info", "alternates"));
  await writeFile(join(root, ".git", "commondir"), "../../outside\n");
  result = await describeProject(root);
  assert.equal(result.available, false); assert.match(result.reason, /linked worktree/);
  await rm(join(root, ".git", "commondir"));
  await symlink("/synthetic/outside", join(root, ".git", "objects", "info", "unsafe"));
  result = await inspectProjectChanges(root);
  assert.equal(result.available, false); assert.match(result.reason, /unsafe Git/);
});

test("non-Git directories and gitdir files are explicit unavailable states", async (t) => {
  const root = await mkdtemp(join(await realpath(tmpdir()), "mods-not-git-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  assert.equal((await describeProject(root)).available, false);
  await writeFile(join(root, ".git"), "gitdir: /synthetic/outside\n");
  const result = await listProjectFiles(root);
  assert.equal(result.available, false);
  assert.deepEqual(result.files, []);
  assert.doesNotMatch(JSON.stringify(result), /synthetic\/outside/);
});

test("diff output overflow kills the bounded subprocess and removes temporary metadata", async (t) => {
  const root = await fixture(t);
  await writeFile(join(root, "hello.txt"), "synthetic repeated line\n".repeat(1000));
  // Isolate this worker's temporary metadata instead of scanning directories
  // concurrently owned by other test processes. The old global scan also had
  // an undefined baseline that was evaluated only when another worker existed.
  const temporary = await mkdtemp(join(await realpath(tmpdir()), "mods-overflow-context-"));
  t.after(() => rm(temporary, { recursive:true, force:true }));
  const worker = spawnSync(process.execPath, ["--input-type=module", "-e",
    `import { inspectProjectChanges } from ${JSON.stringify(new URL('../src/workspace.mjs',import.meta.url).href)}; console.log(JSON.stringify(await inspectProjectChanges(${JSON.stringify(root)}, { includeDiffs:true, maxDiffBytes:128 })));`],
    { encoding:"utf8", timeout:5000, env:{...process.env,TMPDIR:temporary,TMP:temporary,TEMP:temporary} });
  assert.equal(worker.status,0,worker.stderr||worker.error?.message);
  const result = JSON.parse(worker.stdout);
  assert.equal(result.available, true);
  assert.equal(result.truncated, true);
  assert.equal(result.files[0].diffStatus, "truncated");
  assert.equal(Object.hasOwn(result.files[0], "diff"), false);
  assert.deepEqual(await readdir(temporary), []);
});

test("a tracked submodule is omitted without traversing its repository or invoking helpers", { skip: process.platform === "win32" }, async (t) => {
  const root = await fixture(t);
  const object = git(root, "rev-parse", "HEAD").trim();
  await mkdir(join(root, "nested-repo"));
  git(join(root, "nested-repo"), "init", "--initial-branch=main");
  git(root, "update-index", "--add", "--cacheinfo", `160000,${object},nested-repo`);
  await writeFile(join(root, "nested-repo", "secret.txt"), "SYNTHETIC_NESTED_PRIVATE");
  const result = await listProjectFiles(root);
  assert.equal(result.available, true);
  assert.deepEqual(paths(result), [".gitignore", "hello.txt"]);
  const changes = await inspectProjectChanges(root, { includeDiffs: true });
  assert.equal(changes.available, true);
  assert.deepEqual(changes.files, []);
});

test("a mocked stalled Git process reaches its deadline and is reaped with metadata cleanup", { skip: process.platform === "win32" }, async (t) => {
  const root = await fixture(t);
  const fakeBin = join(root, "fake-bin");
  await mkdir(fakeBin);
  const marker = join(root, "mock-git-pid");
  const metadataMarker = join(root, "mock-git-metadata");
  // This executable fixture tests process cleanup only; it is not native Git or host evidence.
  await writeFile(join(fakeBin, "git"), `#!/bin/sh\nprintf '%s' "$$" > '${marker.replaceAll("'", "'\\''")}'\nprintf '%s' "$GIT_DIR" > '${metadataMarker.replaceAll("'", "'\\''")}'\n/bin/sleep 30 &\nwait\n`, { mode: 0o700 });
  const originalPath = process.env.PATH;
  process.env.PATH = `${fakeBin}:${originalPath ?? ""}`;
  const start = Date.now();
  let result;
  try { result = await describeProject(root); }
  finally { process.env.PATH = originalPath; }
  assert.equal(result.available, false);
  assert.match(result.reason, /deadline/);
  assert.ok(Date.now() - start < 7000);
  const pid = Number(await readFile(marker, "utf8"));
  assert.throws(() => process.kill(pid, 0), { code: "ESRCH" });
  const metadataPath = await readFile(metadataMarker, "utf8");
  await assert.rejects(lstat(metadataPath), { code: "ENOENT" });
});
