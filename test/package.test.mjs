import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("compatibility manifest declares hooks, skills, and contained OpenAI resources", async () => {
  const manifest = JSON.parse(await readFile(join(root, ".codex-plugin/plugin.json"), "utf8"));
  const packageInfo = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  await assert.rejects(access(join(root, "plugin.json")), { code: "ENOENT" });
  assert.equal(manifest.$schema, undefined);
  assert.equal(manifest.name, "claude-mods-for-codex");
  assert.match(manifest.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
  assert.equal(manifest.version, packageInfo.version);
  const openai = manifest.extensions["com.openai"];
  assert.equal(manifest.hooks, "./hooks/hooks.json");
  assert.equal(manifest.skills, "./skills");
  assert.equal(openai.hooks, undefined);
  assert.ok(manifest.interface.shortDescription.length <= 30);
  assert.equal(manifest.interface.category, "Developer Tools");
  for (const relative of [manifest.hooks, manifest.skills, openai.onboardingSkill]) {
    assert.ok(relative.startsWith("./") && !relative.split("/").includes(".."));
    await access(join(root, relative));
  }
  assert.ok(packageInfo.files.includes(".codex-plugin/plugin.json"));
  assert.ok(packageInfo.files.includes("proofs/"));
  assert.ok(!packageInfo.files.includes("plugin.json"));
  assert.equal(manifest.mcpServers, "./.mcp.json");
  const mcp = JSON.parse(await readFile(join(root, ".mcp.json"), "utf8"));
  assert.deepEqual(mcp.mcpServers, {"claude-mods": {command:"node", args:["src/server.mjs"], cwd:"."}});
  assert.ok(packageInfo.files.includes("ui/"));
  assert.ok(packageInfo.files.includes(".mcp.json"));
});

test("every packaged hook command quotes the plugin path and uses no network program", async () => {
  const hooks = JSON.parse(await readFile(join(root, "hooks/hooks.json"), "utf8"));
  for (const groups of Object.values(hooks.hooks)) {
    for (const group of groups) for (const hook of group.hooks) {
      assert.equal(hook.type, "command");
      assert.equal(hook.command, 'node "${PLUGIN_ROOT}/src/hook-main.mjs"');
      assert.doesNotMatch(hook.command, /curl|wget|http:|https:/i);
    }
  }
  assert.deepEqual(Object.keys(hooks.hooks).sort(), ["PostToolUse", "PreToolUse", "SessionStart"]);
});

test("bundled skill has valid frontmatter", async () => {
  const skill = await readFile(join(root, "skills/manage-claude-mods/SKILL.md"), "utf8");
  assert.match(skill, /^---\r?\nname: manage-claude-mods\r?\ndescription: .+\r?\n---\r?\n/);
  assert.match(skill, /two directory levels above/);
  assert.doesNotMatch(skill, /node \.\/bin/);
});

test("example configurations all validate", async () => {
  const { loadConfig } = await import("../src/config.mjs");
  for (const name of ["session-notice.json", "deny-guard.json", "activity-journal-opt-in.json", "blast-radius-opt-in.json"]) {
    await assert.doesNotReject(loadConfig(join(root, "examples/config", name)));
  }
});
