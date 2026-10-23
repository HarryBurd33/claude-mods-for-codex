import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { cp, mkdtemp, readFile, realpath, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateConfig } from "../src/config.mjs";
import { dispatch } from "../src/dispatcher.mjs";

const config = validateConfig(JSON.parse(await readFile(new URL("../config/mods.json", import.meta.url), "utf8")));
const fixture = async (name) => JSON.parse(await readFile(new URL(`../fixtures/${name}.json`, import.meta.url), "utf8"));

async function run(command, options) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn("/bin/sh", ["-c", command], options);
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
    child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolvePromise({ stdout, stderr }) : reject(new Error(`hook exited ${code}: ${stderr}`)));
    child.stdin.end(options.input);
  });
}

test("session notice is visible", async () => {
  const { output } = dispatch(await fixture("session-start"), config);
  assert.match(output.systemMessage, /Claude Mods for Codex is active/);
});

test("safe tool use produces the empty response", async () => {
  assert.deepEqual(dispatch(await fixture("pre-tool-safe"), config).output, {});
});

test("matched command produces only the documented deny response", async () => {
  const { output } = dispatch(await fixture("pre-tool-denied"), config);
  assert.deepEqual(output, {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Blocked by the example destructive-command rule. Review the command and use Codex permissions or a safer operation.",
    },
  });
});

test("unknown event is not treated as authorized", () => {
  assert.deepEqual(dispatch({ hook_event_name: "FutureEvent" }, config).output, {});
});

test("packaged hook command works when PLUGIN_ROOT contains spaces", async (t) => {
  const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const root = await mkdtemp(join(await realpath(tmpdir()), "codex mods with spaces "));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const entry of ["package.json", "src", "config"]) {
    await cp(join(sourceRoot, entry), join(root, entry), { recursive: true });
  }
  const hooks = JSON.parse(await readFile(new URL("../hooks/hooks.json", import.meta.url), "utf8"));
  const command = hooks.hooks.SessionStart[0].hooks[0].command;
  const input = JSON.stringify(await fixture("session-start"));
  const { stdout, stderr } = await run(command, {
    env: { ...process.env, PLUGIN_ROOT: root },
    input,
  });
  assert.equal(stderr, "");
  assert.match(JSON.parse(stdout).systemMessage, /Claude Mods for Codex is active/);
});
