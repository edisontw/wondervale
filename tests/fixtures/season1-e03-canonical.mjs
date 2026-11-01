// Deterministic genuine E02/E03 engine checkpoints for read-only PAPER boundary QA.
import assert from 'node:assert/strict';
import {fresh as fresh02,dispatch as dispatch02,payload as payload02} from '../../engine/s01e02.mjs';
import {fresh as fresh03,dispatch as dispatch03,payload as payload03} from '../../engine/s01e03.mjs';
const drain02=s=>{while(s.queue.length)s=dispatch02(s,{type:'next'});return s;};
const drain03=s=>{while(s.queue.length)s=dispatch03(s,{type:'next'});return s;};
const move03=s=>{while(s.travel.length)s=dispatch03(s,{type:'step',to:s.travel[0]});return s;};
export function canonicalCheckpoints(){
 let e02=fresh02();
 const a=x=>{e02=drain02(dispatch02(e02,x));};
 a({type:'begin'});a({type:'go',to:'oldStones'});a({type:'inspect',what:'stones'});
 a({type:'close-detail'});a({type:'go',to:'lookoutView'});
 a({type:'inspect',what:'gap'});a({type:'close-detail'});
 a({type:'notebook'});a({type:'fact',choice:'gap'});a({type:'revision',choice:'A'});
 a({type:'market'});a({type:'chronicle'});a({type:'finish'});
 assert.equal(e02.phase,'completed');
 let e03=drain03(dispatch03(fresh03(),{type:'begin',ready:true}));
 const deliver=s=>drain03(dispatch03(move03(dispatch03(s,{type:'take-route',route:'L'})),{type:'deliver'}));
 e03=deliver(e03);
 e03=drain03(move03(dispatch03(e03,{type:'return'})));
 e03=deliver(e03);
 e03=dispatch03(e03,{type:'inspect',what:'S'});
 e03=drain03(dispatch03(e03,{type:'compare',reason:'steps'}));
 e03=drain03(move03(dispatch03(e03,{type:'return'})));
 e03=deliver(e03);
 e03=drain03(move03(dispatch03(e03,{type:'return'})));
 for(const kind of ['WALK','CART'])e03=drain03(dispatch03(e03,{type:'sign',kind,to:'L'}));
 e03=move03(dispatch03(e03,{type:'go-glyph'}));
 e03=drain03(dispatch03(e03,{type:'glyph'}));
 for(const which of ['station','garden'])e03=drain03(dispatch03(e03,{type:'memory',which}));
 e03=drain03(dispatch03(e03,{type:'chronicle'}));
 e03=dispatch03(e03,{type:'finish'});
 assert.equal(e03.phase,'completed');
 return {e02:payload02(e02),e03:payload03(e03)};
}
