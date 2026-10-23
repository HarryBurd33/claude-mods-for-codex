import test from "node:test";
import assert from "node:assert/strict";
import { BEFORE_COMMAND, AFTER_COMMAND, DENY_COMMAND, proofHookResponse, rewriteProof } from "../proofs/rewrite.mjs";

function event(command = BEFORE_COMMAND) {
  return {
    hook_event_name: "PreToolUse", tool_name: "Bash", tool_input: { command },
    session_id: "synthetic-session", turn_id: "synthetic-turn", permission_mode: "default",
  };
}

test("proof rewrite requires explicit opt-in and emits a visible exact before/after", () => {
  assert.deepEqual(proofHookResponse(event()), {});
  assert.deepEqual(proofHookResponse(event(), { rewriteEnabled: "true" }), {});
  const result = proofHookResponse(event(), { rewriteEnabled: true });
  assert.deepEqual(result.hookSpecificOutput, {
    hookEventName: "PreToolUse", permissionDecision: "allow", updatedInput: { command: AFTER_COMMAND },
  });
  assert.ok(result.systemMessage.includes(BEFORE_COMMAND));
  assert.ok(result.systemMessage.includes(AFTER_COMMAND));
  assert.match(result.systemMessage, /normal permissions still apply/);
  assert.deepEqual(rewriteProof(event()), result);
});

test("proof preserves input fields and does not mutate the received event", () => {
  const input = event();
  input.tool_input = Object.freeze({ command: BEFORE_COMMAND, workdir: "synthetic-project", sandbox_permissions: "use_default", timeout_ms: 1000 });
  Object.freeze(input);
  const result = rewriteProof(input);
  assert.deepEqual(result.hookSpecificOutput.updatedInput, {
    command: AFTER_COMMAND, workdir: "synthetic-project", sandbox_permissions: "use_default", timeout_ms: 1000,
  });
  assert.equal(input.tool_input.command, BEFORE_COMMAND);
  assert.equal(input.permission_mode, "default");
  assert.notEqual(result.hookSpecificOutput.updatedInput, input.tool_input);
  assert.equal(result.hookSpecificOutput.decision, undefined);
  assert.equal(result.hookSpecificOutput.updatedPermissions, undefined);
});

test("only the exact harmless command is rewritten on the canonical Bash pre-hook", () => {
  for (const command of ["", "printf MODS_BEFORE\n", " printf MODS_BEFORE", "printf MODS_BEFORE; pwd", "echo MODS_BEFORE", "printf MODS_AFTER", { command: BEFORE_COMMAND }]) {
    assert.deepEqual(rewriteProof(event(command)), {});
  }
  for (const name of ["SessionStart", "PostToolUse", "PermissionRequest", "UserPromptSubmit", "Stop"]) {
    assert.deepEqual(rewriteProof({ ...event(), hook_event_name: name }), {});
  }
  for (const tool of ["exec_command", "apply_patch", "mcp__example__tool", "Agent"]) {
    assert.deepEqual(rewriteProof({ ...event(), tool_name: tool }), {});
  }
});

test("the harmless deny marker never emits a rewrite or approval", () => {
  const result = proofHookResponse(event(DENY_COMMAND));
  assert.equal(result.hookSpecificOutput.permissionDecision, "deny");
  assert.ok(result.hookSpecificOutput.permissionDecisionReason.trim());
  assert.equal(result.hookSpecificOutput.updatedInput, undefined);
  assert.equal(result.hookSpecificOutput.decision, undefined);
  assert.deepEqual(rewriteProof(event(DENY_COMMAND)), result);
});

test("malformed or accessor-bearing events cannot trigger the rewrite", () => {
  for (const value of [null, [], 1, "event", {}, { ...event(), tool_input: null }, { ...event(), tool_input: [] }]) {
    assert.deepEqual(rewriteProof(value), {});
  }
  const getter = () => { throw new Error("accessor must not run"); };
  assert.deepEqual(rewriteProof({ get hook_event_name() { return getter(); } }), {});
  const toolInput = { command: BEFORE_COMMAND };
  Object.defineProperty(toolInput, "secret", { get: getter, enumerable: true });
  assert.deepEqual(rewriteProof({ ...event(), tool_input: toolInput }), {});
  assert.deepEqual(rewriteProof({ ...event(), tool_input: Object.create({ command: BEFORE_COMMAND }) }), {});
});
