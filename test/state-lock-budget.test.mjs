import assert from 'node:assert/strict';
import test from 'node:test';
import { createStateLockBudget } from '../src/state-lock-budget.mjs';

test('state lock unchanged or first-observed identity cannot extend or revive idle waiting', () => {
  let now = 0; const budget = createStateLockBudget(() => now);
  now = 900; budget.observe('first-observed-late');
  now = 999; budget.observe('first-observed-late'); assert.equal(budget.canAttempt(),true);
  now = 1000; assert.equal(budget.canAttempt(),false);
  budget.observe('new-but-too-late'); assert.equal(budget.delayMs(),0);
  now = 2000; assert.equal(budget.canAttempt(),false);
});
test('state lock observed object changes allow bounded progress, never an unbounded stream of handoffs', () => {
  let now = 0; const budget = createStateLockBudget(() => now);
  budget.observe('a'); now = 800; budget.observe('b');
  now = 1100; assert.equal(budget.canAttempt(),true);
  now = 1700; budget.observe('b'); assert.equal(budget.canAttempt(),true);
  now = 1799; budget.observe('c');
  now = 2400; budget.observe('d'); assert.equal(budget.canAttempt(),true);
  now = 2499; assert.equal(budget.delayMs(),1);
  now = 2500; budget.observe('e'); assert.equal(budget.canAttempt(),false); assert.equal(budget.delayMs(),0);
  // Repeated samples of the same object do not count as progress.
  let time = 0; const stable = createStateLockBudget(() => time);
  stable.observe('a'); time = 500; stable.observe('b'); time = 1499; stable.observe('b');
  time = 1500; assert.equal(stable.canAttempt(),false);
});
test('state lock budget refuses invalid clocks and identities rather than disabling bounds', () => {
  assert.throws(()=>createStateLockBudget(()=>NaN),/clock unavailable/);
  let now = 0; const budget = createStateLockBudget(()=>now);
  for(const id of [null,undefined,'','x'.repeat(257)])assert.throws(()=>budget.observe(id),/identity unavailable/);
  now = 1; budget.canAttempt(); now = 0; assert.throws(()=>budget.canAttempt(),/clock unavailable/);
});
