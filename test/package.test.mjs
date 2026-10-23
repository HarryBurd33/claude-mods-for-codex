import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("portable manifest declares the package and contained OpenAI resources", async () => {
  const manifest = JSON.parse(await readFile(join(root, "plugin.json"), "utf8"));
  assert.equal(manifest.$schema, "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
  assert.equal(manifest.name, "claude-mods-for-codex");
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  const openai = manifest.extensions["com.openai"];
  assert.equal(openai.hooks, "./hooks/hooks.json");
  assert.ok(openai.interface.shortDescription.length <= 30);
  assert.equal(openai.interface.category, "Developer Tools");
  for (const relative of [openai.hooks, openai.onboardingSkill]) await access(join(root, relative));
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
  assert.match(skill, /^---\nname: manage-claude-mods\ndescription: .+\n---\n/);
  assert.match(skill, /two directory levels above/);
  assert.doesNotMatch(skill, /node \.\/bin/);
});

test("example configurations all validate", async () => {
  const { loadConfig } = await import("../src/config.mjs");
  for (const name of ["session-notice.json", "deny-guard.json", "activity-journal-opt-in.json"]) {
    await assert.doesNotReject(loadConfig(join(root, "examples/config", name)));
  }
});
