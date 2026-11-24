import assert from 'node:assert/strict';
import * as E07 from '../e07-scene/scene-model.mjs';
import {earnedE07,replayEarnedPath,dispatchEarnedPath} from '../e11-scene/e07-earned-shared-path.mjs';

assert.equal(earnedE07([]),null,'an unearned E07 visit must not unlock E11');
assert.equal(replayEarnedPath([],[]),null,'direct E11 trial cannot claim E07');
assert.equal(dispatchEarnedPath([],[],{type:'test'}),null);
assert.equal(earnedE07([{scene:'nav',type:'restart'}]),null,'restart is not transferable evidence');
assert.equal(earnedE07([{scene:'walkthrough',type:'review'}]),null,'skipped checks rejected');
assert.equal(earnedE07([{scene:'nav',type:'garden',rights:['open']}]),null,'forged rights rejected');
assert.equal(earnedE07([{scene:'story',action:{type:'finish'}}]),null,'unearned completion rejected');
assert.equal(E07.view(E07.replay([])).walkthrough.reviewed,false);
console.log('E07-earned E11 bridge rejects missing, forged and incomplete histories');
