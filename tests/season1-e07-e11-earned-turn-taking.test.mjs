import test from 'node:test';
import assert from 'node:assert/strict';
import * as E07 from '../e07-scene/scene-model.mjs';
import {earnedTurnTaking} from '../e11-scene/e07-earned-turn-taking.mjs';
const a=(type,value)=>({scene:'story',action:value===undefined?{type}:{type,value}});
const w=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
const route=[a('start'),a('walk','shared-path'),a('inspect','shared-path'),a('walk','channel'),a('inspect','channel'),a('walk','workbench'),a('trial','milo'),a('trial','resident'),a('trial','water'),a('place','path-clear-water-blocked'),a('trial','milo'),a('trial','resident'),a('trial','water'),a('place','side-offset'),a('trial','water'),a('trial','milo'),a('trial','resident'),a('compare'),a('finish'),w('start'),w('move','crossing'),w('inspect','crossing'),w('other-start'),w('other-step'),w('other-step'),w('move','water-edge'),w('inspect','water-edge'),w('move','steps-base'),w('review')];
test('E07 earned child journey gates E11 turn-taking, reset and forged events fail closed',()=>{
 let s=E07.fresh();for(const e of route){assert.equal(E07.can(s,e),true,JSON.stringify(e));s=E07.dispatch(s,e);}
 const turns=[{type:'choose',choice:'share'},{type:'try'},{type:'switch'}];
 assert.equal(earnedTurnTaking([],turns),null);
 assert.equal(earnedTurnTaking(route.slice(0,-1),turns),null);
 assert.equal(earnedTurnTaking([...route,{scene:'nav',type:'grant-rights'}],turns),null);
 const earned=earnedTurnTaking(s.history,turns);
 assert.equal(earned.turn,1);assert.equal(earned.e07OtherTravelerPassed,true);
 assert.match(earned.crossEpisodeFeedback,/traveler/);
 assert.deepEqual(earned.canonicalEvents,[]);assert.deepEqual(earned.unlocks,[]);assert.deepEqual(earned.rights,[]);
 assert.equal(earned.northHillClosed,true);assert.equal(earned.commonRevealed,false);
 assert.equal(earnedTurnTaking(s.history,turns.slice(0,-1)).turn,0);
 assert.equal(earnedTurnTaking(s.history,[{type:'switch'}]),null);
 assert.equal(earnedTurnTaking(s.history,[...turns,{type:'open-common'}]),null);
 assert.deepEqual(earnedTurnTaking(structuredClone(s.history),structuredClone(turns)),earned);
});
