import test from "node:test";
import assert from "node:assert/strict";
import { HOLD_COMMAND, HOLD_TIMEOUT_MS, holdElicitationRequest, holdDecision, holdProof, matchesHoldEvent } from "../proofs/hold.mjs";

const event = (command = HOLD_COMMAND) => ({ hook_event_name: "PreToolUse", tool_name: "Bash", tool_input: { command } });
function assertDenied(result) {
  assert.equal(result.hookSpecificOutput?.hookEventName, "PreToolUse");
  assert.equal(result.hookSpecificOutput?.permissionDecision, "deny");
  assert.ok(result.hookSpecificOutput.permissionDecisionReason.trim());
  assert.equal(result.hookSpecificOutput.updatedInput, undefined);
  assert.equal(result.hookSpecificOutput.decision, undefined);
  assert.equal(result.hookSpecificOutput.updatedPermissions, undefined);
}

test("hold probe requires opt-in, canonical event/tool, and the exact harmless marker", async () => {
  let calls = 0;
  const elicit = () => { calls++; return { action: "accept", content: { confirm: true } }; };
  assert.deepEqual(await holdProof(event(), { elicit }), {});
  for (const command of ["", "printf MODS_HOLD\n", " printf MODS_HOLD", "printf MODS_HOLD; pwd", "echo MODS_HOLD"]) {
    assert.deepEqual(await holdProof(event(command), { enabled: true, elicit }), {});
  }
  for (const hook_event_name of ["PostToolUse", "SessionStart", "PermissionRequest"]) {
    assert.equal(matchesHoldEvent({ ...event(), hook_event_name }), false);
  }
  for (const tool_name of ["exec_command", "Agent", "mcp__example__tool"]) {
    assert.equal(matchesHoldEvent({ ...event(), tool_name }), false);
  }
  assert.equal(calls, 0);
  assert.deepEqual(await holdProof(event(), { enabled: true, elicit }), {});
  assert.equal(calls, 1);
});

test("elicitation requires a nonempty boolean confirmation with no affirmative default", () => {
  const request = holdElicitationRequest();
  assert.equal(request.mode, "form");
  assert.equal(request.requestedSchema.type, "object");
  assert.deepEqual(request.requestedSchema.required, ["confirm"]);
  assert.deepEqual(Object.keys(request.requestedSchema.properties), ["confirm"]);
  assert.equal(request.requestedSchema.properties.confirm.type, "boolean");
  assert.equal(request.requestedSchema.properties.confirm.default, undefined);
  assert.match(request.message, /normal permissions/);
  request.requestedSchema.required.push("mutated");
  assert.deepEqual(holdElicitationRequest().requestedSchema.required, ["confirm"]);
});

test("only exact affirmative confirmation abstains; malformed, false, decline and cancel deny", () => {
  assert.deepEqual(holdDecision({ action: "accept", content: { confirm: true } }), {});
  for (const response of [undefined, null, [], {}, { action: "accept" }, { action: "accept", content: {} }, { action: "accept", content: { confirm: false } }, { action: "accept", content: { confirm: "true" } }, { action: "decline", content: { confirm: true } }, { action: "cancel", content: { confirm: true } }, { action: "Accept", content: { confirm: true } }, { error: { code: -1 } }]) {
    assertDenied(holdDecision(response));
  }
});

test("known automated review cannot substitute for the probe's confirmation", () => {
  assertDenied(holdDecision({ action: "accept", content: { confirm: true }, _meta: { approvals_reviewer: "auto_review" } }));
  // These outputs are abstentions, never approvals or input changes.
  assert.deepEqual(holdDecision({ action: "accept", content: { confirm: true } }), {});
});

test("deadline blocks an unanswered call and aborts its pending transport", async () => {
  let transportSignal;
  const result = await holdProof(event(), { enabled: true, timeoutMs: 10, elicit: (_request, { signal }) => {
    transportSignal = signal;
    return new Promise(() => {});
  } });
  assertDenied(result);
  assert.match(result.hookSpecificOutput.permissionDecisionReason, /deadline/);
  assert.equal(transportSignal.aborted, true);
});

test("cancellation before or during a call denies and cancels its transport", async () => {
  const controller = new AbortController();
  controller.abort();
  assertDenied(await holdProof(event(), { enabled: true, signal: controller.signal, elicit: () => { throw new Error("must not call"); } }));
  const pending = new AbortController();
  let transportSignal;
  const result = holdProof(event(), { enabled: true, signal: pending.signal, elicit: (_request, { signal }) => {
    transportSignal = signal;
    queueMicrotask(() => pending.abort());
    return new Promise(() => {});
  } });
  assertDenied(await result);
  assert.equal(transportSignal.aborted, true);
});

test("missing, throwing or disconnected transports and invalid bounds deny with sanitized output", async () => {
  assertDenied(await holdProof(event(), { enabled: true }));
  for (const elicit of [() => { throw new Error("private transport detail"); }, () => Promise.reject(new Error("private transport detail"))]) {
    const result = await holdProof(event(), { enabled: true, elicit });
    assertDenied(result);
    assert.equal(JSON.stringify(result).includes("private transport detail"), false);
  }
  for (const timeoutMs of [0, -1, HOLD_TIMEOUT_MS + 1, NaN, "100", 2.5]) {
    assertDenied(await holdProof(event(), { enabled: true, timeoutMs, elicit: () => { throw new Error("must not call"); } }));
  }
});

test("read-only probe leaves frozen inputs intact and never invokes accessors", async () => {
  const input = Object.freeze({ command: HOLD_COMMAND, sandbox_permissions: "use_default" });
  const frozen = Object.freeze({ ...event(), tool_input: input });
  assert.deepEqual(await holdProof(frozen, { enabled: true, elicit: () => ({ action: "accept", content: { confirm: true } }) }), {});
  assert.equal(input.command, HOLD_COMMAND);
  assert.equal(input.sandbox_permissions, "use_default");
  const getter = () => { throw new Error("must not run accessor"); };
  assert.equal(matchesHoldEvent({ get hook_event_name() { return getter(); } }), false);
  assertDenied(holdDecision({ action: "accept", content: { get confirm() { return getter(); } } }));
  assertDenied(holdDecision({ action: "accept", content: Object.create({ confirm: true }) }));
});
