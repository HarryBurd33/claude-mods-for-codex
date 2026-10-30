// Historical WS-L1 CI review: reproduce gaps in the pinned fixture source only.
// Not repair acceptance. No real spawn, filesystem mutation or Windows execution.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../test/owned-fixture-lifecycle.mjs', import.meta.url), 'utf8');
const sourceSha256 = createHash('sha256').update(source).digest('hex');
assert.equal(sourceSha256, '9ea4c2a94b9c3eb21527ecccd5e7e3c48bf4b48852cb3c65eb1e8f004430b847',
  'Historical audit requires its original source; do not weaken this pin for repaired source');
async function fixture(throws = false) {
  const children = []; let attempts = 0;
  const fakeProcess = { spawn() {
    attempts++;
    if (throws) throw new Error('Synthetic spawn throw');
    const child = new EventEmitter(); children.push(child); return child;
  } };
  const context = vm.createContext({});
  const bindings = {
    'node:child_process': { default: fakeProcess },
    'node:module': { syncBuiltinESMExports() { throw new Error('Unexpected interception'); } },
    'node:perf_hooks': { performance: { now: () => 0 } },
  };
  const module = new vm.SourceTextModule(source, { context });
  await module.link(name => {
    const values = bindings[name]; assert.ok(values, 'Unexpected dependency');
    return new vm.SyntheticModule(Object.keys(values), function() {
      for (const [key, value] of Object.entries(values)) this.setExport(key, value);
    }, { context });
  });
  await module.evaluate();
  return { scope: new module.namespace.OwnedFixtureScope(), children, attempts: () => attempts };
}
const gate = () => { let release; const promise = new Promise(r => { release = r; }); return { promise, release }; };
const observe = promise => promise.then(value => ({ value }), error => ({ error }));
const sibling = await fixture(), a = gate(), b = gate();
const first = observe(sibling.scope.externalIO(undefined, async () => {
  sibling.scope.spawn('synthetic', [], {}); await a.promise; return 'first';
}));
const second = observe(sibling.scope.externalIO(undefined, async () => {
  sibling.scope.spawn('synthetic', [], {}); await b.promise; return 'second';
}));
await Promise.resolve();
assert.equal(sibling.children.length, 2);
sibling.children[0].emit('close', 0); a.release();
const firstResult = await first;
assert.equal(firstResult.error?.message, 'Storage helper close unresolved');
assert.equal(sibling.scope.children.has(sibling.children[1]), true);
sibling.children[1].emit('close', 0); b.release();
assert.equal((await second).error?.message, 'Owned fixture stopped: unresolved work');
assert.equal(sibling.scope.children.size, 0); assert.equal(sibling.scope.writes.size, 0);
assert.throws(() => sibling.scope.assertCleanupSafe(), /unresolved/);

const attempted = await fixture(true);
await assert.rejects(attempted.scope.externalIO(undefined,
  () => attempted.scope.spawn('synthetic', [], {})), /Synthetic spawn throw/);
assert.equal(attempted.attempts(), 1);
assert.equal(attempted.scope.unresolved, false);
assert.doesNotThrow(() => attempted.scope.assertCleanupSafe());
console.log(JSON.stringify({ audit: 'WS-L1-CI', sourceSha256, node: process.version,
  siblingMisattributionReproduced: true, spawnThrowCleanupGapReproduced: true,
  realProcesses: 0, fixtureWrites: 0, windowsExecution: false, repairAcceptance: false }));
