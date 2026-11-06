import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,earnedVoices,replay,restore} from '../engine/s01e10-authoring-prototype.mjs';

const doActions=(actions)=>actions.reduce((s,a)=>dispatch(s,a),fresh());
const hearBoth=[
  {type:'walk',to:'stone_edge'},{type:'walk',to:'quiet_corner'},
  {type:'hear',needId:'quiet'},{type:'walk',to:'meeting_edge'},
  {type:'hear',needId:'activity'}
];
test('E10 voices require real listening and remain synthetic',()=>{
  assert.deepEqual(earnedVoices(fresh()),[]);
  const s=doActions(hearBoth);
  assert.match(earnedVoices(s).join(' '),/Two people/);
  assert.deepEqual(s.canonicalEvents,[]);
  assert.deepEqual(s.unlocks,[]);
  assert.deepEqual(earnedVoices(restore(s)),earnedVoices(replay(s.history)));
});
test('E10 conflict then revision earns distinct dialogue; clear-first does not invent revision',()=>{
  const conflict=doActions([...hearBoth,
    {type:'place',needId:'quiet',slot:'shared'},
    {type:'place',needId:'activity',slot:'shared'}]);
  assert.match(earnedVoices(conflict).join(' '),/noise make reading hard/);
  const revised=dispatch(conflict,{type:'place',needId:'activity',slot:'right'});
  assert.match(earnedVoices(revised).join(' '),/noticed the clash/);
  const clear=doActions([...hearBoth,
    {type:'place',needId:'quiet',slot:'left'},
    {type:'place',needId:'activity',slot:'right'}]);
  assert.doesNotMatch(earnedVoices(clear).join(' '),/noticed the clash/);
  assert.deepEqual(earnedVoices(dispatch(revised,{type:'reset'})),[]);
  assert.deepEqual(earnedVoices({...revised,board:{quiet:'shared',activity:'shared'}}),[]);
});
