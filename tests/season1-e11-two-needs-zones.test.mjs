import assert from 'node:assert/strict';
import {test} from 'node:test';
import {addZoneEvent,replayZones} from '../e11-scene/two-needs-zones.mjs';
const place=(need,zone)=>({type:'place',need,zone});
test('Milo tries, hears conflict, revises, and can undo',()=>{
 let e=[];e=addZoneEvent(e,place('quiet','near'));e=addZoneEvent(e,place('making','far'));e=addZoneEvent(e,{type:'try'});
 assert.equal(replayZones(e).fits,false);assert.match(replayZones(e).response,/swap/);
 e=addZoneEvent(e,place('quiet','far'));e=addZoneEvent(e,place('making','near'));e=addZoneEvent(e,{type:'try'});
 assert.equal(replayZones(e).fits,true);assert.match(replayZones(e).chronicle,/PAPER Chronicle/);
 assert.equal(replayZones(e.slice(0,-1)).chronicle,null);
 assert.deepEqual(replayZones([]).zones,{near:null,far:null});
});
test('reject forged and impossible events',()=>{
 for(const events of [[{type:'try'}],[{type:'place',need:'quiet',zone:'north-hill'}],[{type:'try',approved:true}],Array(33).fill(place('quiet','near'))])assert.throws(()=>replayZones(events));
 assert.throws(()=>addZoneEvent([], {type:'open-common'}));
});
