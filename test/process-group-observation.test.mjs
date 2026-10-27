import test from 'node:test';
import assert from 'node:assert/strict';
import { observeProcessGroup, observeProcessGroupDetail, settleFixedFixtureGroup,
  settleFixedFixtureGroupDetail } from '../proofs/process-group-observation.mjs';

test('group probe reports only closed categories and ESRCH remains the only absence', {skip:process.platform === 'win32'}, t => {
  const calls = [];
  let thrown;
  const mock = t.mock.method(process, 'kill', (...args) => { calls.push(args); if (thrown) throw thrown; return true; });
  try {
    for (const [code, status, category] of [
      [null,'present-or-reused','none'], ['ESRCH','absent-at-probe','ESRCH'],
      ['EPERM','unavailable','EPERM'], ['EINVAL','unavailable','EINVAL'],
      ['SECRET_PATH_OR_ERROR','unavailable','other'], [42,'unavailable','other'],
    ]) {
      thrown = code === null ? null : Object.assign(new Error('SYNTHETIC_SECRET'), {code});
      assert.deepEqual(observeProcessGroupDetail(12345), {status,error:category});
      assert.equal(observeProcessGroup(12345), status);
    }
    assert.ok(calls.every(([pid, signal]) => pid === -12345 && signal === 0));
    const count = calls.length;
    for (const pid of [-1,0,1,1.5,2147483648,NaN,Infinity,{},'12345']) {
      assert.deepEqual(observeProcessGroupDetail(pid), {status:'unavailable',error:'invalid-identity'});
    }
    assert.equal(calls.length,count,'invalid identities never reach process.kill');
  } finally { mock.mock.restore(); }
});

test('fixed settlement records an unavailable probe without inferring absence or leaking error data', {skip:process.platform === 'win32'}, async t => {
  const mock = t.mock.method(process, 'kill', () => { throw Object.assign(new Error('SYNTHETIC_SECRET'), {code:'EPERM'}); });
  try {
    const result = await settleFixedFixtureGroupDetail(12345);
    assert.deepEqual(Object.keys(result).sort(), ['initialStatus','initialError','finalStatus','finalError',
      'probeCount','elapsedMs','deadlineReached','goneObserved'].sort());
    assert.equal(result.initialStatus,'unavailable'); assert.equal(result.finalStatus,'unavailable');
    assert.equal(result.initialError,'EPERM'); assert.equal(result.finalError,'EPERM');
    assert.equal(result.probeCount,1); assert.equal(result.goneObserved,false); assert.equal(result.deadlineReached,false);
    assert.ok(Number.isInteger(result.elapsedMs) && result.elapsedMs >= 0);
    assert.equal(await settleFixedFixtureGroup(12345),false);
    assert.doesNotMatch(JSON.stringify(result), /12345|SYNTHETIC_SECRET/);
  } finally { mock.mock.restore(); }
});

test('fixed settlement preserves a present-to-ESRCH transition and the conservative boolean API', {skip:process.platform === 'win32'}, async t => {
  let count = 0;
  const mock = t.mock.method(process, 'kill', () => {
    if (++count > 1) throw Object.assign(new Error('SYNTHETIC_SECRET'), {code:'ESRCH'});
    return true;
  });
  try {
    const result = await settleFixedFixtureGroupDetail(12345);
    assert.equal(result.initialStatus,'present-or-reused'); assert.equal(result.initialError,'none');
    assert.equal(result.finalStatus,'absent-at-probe'); assert.equal(result.finalError,'ESRCH');
    assert.equal(result.probeCount,2); assert.equal(result.goneObserved,true); assert.equal(result.deadlineReached,false);
    assert.equal(await settleFixedFixtureGroup(12345),true);
  } finally { mock.mock.restore(); }
});

test('Windows group diagnostics refuse observation without signalling', {skip:process.platform !== 'win32'}, async t => {
  const mock = t.mock.method(process,'kill',() => { throw new Error('must not signal'); });
  try {
    assert.deepEqual(observeProcessGroupDetail(12345), {status:'not-observed-on-platform',error:'platform'});
    const result = await settleFixedFixtureGroupDetail(12345);
    assert.equal(result.goneObserved,false); assert.equal(result.probeCount,1);
    assert.equal(result.finalError,'platform'); assert.equal(mock.mock.callCount(),0);
  } finally { mock.mock.restore(); }
});
