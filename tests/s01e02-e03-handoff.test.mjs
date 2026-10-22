import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fresh as freshE02, dispatch as dispatchE02, payload as payloadE02,
  restore as restoreE02, EVENTS as E02_EVENTS
} from '../engine/s01e02.mjs';
import {
  fresh as freshE03, dispatch as dispatchE03, payload as payloadE03,
  restore as restoreE03, e02Ready
} from '../engine/s01e03.mjs';

// Use the real E02 state machine, never fabricated unlock events.
function drain(s) {
  let n = 0;
  while (s.queue.length) {
    assert.ok(++n <= 100, 'E02 dialogue must terminate');
    s = dispatchE02(s, {type: 'next'});
  }
  return s;
}
function completedE02(order, choice) {
  let s = drain(dispatchE02(freshE02(), {type: 'begin'}));
  for (const what of order) {
    s = drain(dispatchE02(s, {type: 'go', to: what === 'stones' ? 'oldStones' : 'lookoutView'}));
    s = drain(dispatchE02(s, {type: 'inspect', what}));
    s = dispatchE02(s, {type: 'close-detail'});
  }
  s = drain(dispatchE02(s, {type: 'notebook'}));
  s = drain(dispatchE02(s, {type: 'fact', choice: 'gap'}));
  s = drain(dispatchE02(s, {type: 'revision', choice}));
  s = drain(dispatchE02(s, {type: 'go', to: 'lookoutView'}));
  s = drain(dispatchE02(s, {type: 'market'}));
  s = drain(dispatchE02(s, {type: 'chronicle'}));
  return dispatchE02(s, {type: 'finish'});
}

test('E02→E03: both observation orders and both qualified revisions unlock only after canonical finish', () => {
  for (const order of [['stones', 'gap'], ['gap', 'stones']]) {
    for (const choice of ['A', 'B']) {
      const s = completedE02(order, choice);
      assert.equal(s.phase, 'completed', order + '/' + choice);
      assert.ok(s.ledger.includes(E02_EVENTS.market));
      assert.ok(s.ledger.includes(E02_EVENTS.finish));
      assert.equal(e02Ready(s), true);
      assert.equal(e02Ready(restoreE02(payloadE02(s))), true, 'round-trip save remains eligible');
    }
  }
});

test('E02→E03: partial, invented and inconsistent E02 snapshots cannot unlock Market Lane', () => {
  const valid = completedE02(['stones', 'gap'], 'A');
  const forged = {ledger: [E02_EVENTS.market, E02_EVENTS.finish]};
  for (const bad of [
    null, freshE02(), forged,
    {...valid, version: 'unrecognized-version'},
    {...valid, market: false},
    {...valid, observed: []},
    {...valid, phase: 'chronicle'}
  ]) {
    assert.equal(e02Ready(bad), false, 'incomplete or contradictory E02 snapshot must fail closed');
  }
});

test('E02→E03: starting and resuming E03 never mutates the completed E02 source', () => {
  for (const order of [['stones', 'gap'], ['gap', 'stones']]) {
    const e02 = completedE02(order, 'B');
    const before = JSON.stringify(payloadE02(e02));
    let e03 = dispatchE03(freshE03(), {type: 'begin', ready: e02Ready(e02)});
    assert.equal(e03.phase, 'arrival');
    assert.ok(payloadE03(e03), 'canonical E03 may save its own progress');
    e03 = restoreE03(payloadE03(e03));
    assert.equal(e03.phase, 'arrival', 'E03 resume retains pending introduction');
    assert.equal(JSON.stringify(payloadE02(e02)), before, 'E02 snapshot remains read-only');
  }
});

test('E02→E03: an E02 reset revokes future entry; E03 replay/reset remains isolated', () => {
  const completed = completedE02(['gap', 'stones'], 'A');
  const before = JSON.stringify(payloadE02(completed));
  assert.equal(e02Ready(completed), true);
  assert.equal(e02Ready(freshE02()), false, 'cleared E02 save cannot authorize E03');
  assert.equal(dispatchE03(freshE03(), {type: 'begin', ready: false}).phase, 'preview');
  assert.equal(payloadE03(freshE03('historical_replay')), null, 'replay cannot save canonical E03');
  assert.equal(freshE03().phase, 'preview', 'E03 reset returns only its own state');
  assert.equal(JSON.stringify(payloadE02(completed)), before, 'E03 reset/replay does not erase E02');
});
