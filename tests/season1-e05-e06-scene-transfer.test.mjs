import test from 'node:test';
import assert from 'node:assert/strict';
import * as E05 from '../e05-scene/scene-model.mjs';
import * as E06 from '../e06-scene/scene-model.mjs';
import {encodeStationGardenTransfer,decodeStationGardenTransfer} from '../authoring-labs/e05-e06-scene-transfer.mjs';
import {stationWorld} from '../e06-scene/station-world.mjs';
import * as Return from '../e05-scene/garden-return-model.mjs';
const a=(scene,type,extra={})=>({scene,action:{type,...extra}});
const nav=type=>({scene:'nav',type});
const step=(model,s,action)=>{assert.equal(model.can(s,action),true,JSON.stringify(action));return model.dispatch(s,action);};
function station(){
 let s=E05.fresh();
 for(const action of [
  a('station','start'),a('station','walk',{value:'board'}),
  a('station','inspect',{value:'peg-pair'}),a('station','inspect',{value:'worn-edge'}),
  a('station','guess',{value:'unsure'}),a('station','try-copy',{value:'side-b'}),
  a('station','check'),a('station','try-copy',{value:'side-a'}),a('station','check'),
  a('station','qualify'),nav('to-records'),a('sources','start'),
  ...['a','b'].flatMap(card=>[
   a('sources','walk',{value:'desk-'+card}),a('sources','inspect',{card}),
   a('sources','source-check',{card})]),
  a('sources','walk',{value:'compare'}),
  a('sources','place',{card:'a',slot:'earlier'}),a('sources','test',{card:'a'}),
  ...['a','b'].flatMap(card=>[
   a('sources','place',{card,slot:'unknown'}),a('sources','test',{card})]),
  a('sources','compare'),a('sources','finish'),nav('to-layout'),
  a('station','walk',{value:'table'}),a('station','place-table',{value:'across-walkway'}),
  a('station','place-table',{value:'near-wall'}),a('station','confirm'),
  a('station','reflect'),nav('to-review'),
  a('garden','inspect',{value:'older'}),a('garden','inspect',{value:'present'}),
  a('garden','overlay'),a('garden','ask-why')
 ])s=step(E05,s,action);
 return s;
}
test('E05 earned PAPER question visits independent E06 and returns without changing either source',()=>{
 const e05=station();let e06=E06.fresh();
 assert.equal(E05.view(e05).e06Unlocked,false);
 const first=decodeStationGardenTransfer(encodeStationGardenTransfer(e05,e06));
 assert.deepEqual(first,{e05,e06});
 for(const action of [a('garden','start'),a('garden','inspect',{value:'present-bed'}),
  a('garden','walk',{value:'slope'}),a('garden','inspect',{value:'slope'}),
  a('garden','walk',{value:'model-tray'}),a('garden','run'),
  a('garden','weather',{value:'rain'}),a('garden','run'),
  a('garden','channel',{value:'blocked'}),a('garden','run'),
  a('garden','compare'),a('garden','enter')])e06=step(E06,e06,action);
 const back=decodeStationGardenTransfer(encodeStationGardenTransfer(e05,e06));
 assert.deepEqual(back.e05,e05);assert.deepEqual(back.e06,e06);
 assert.equal(E06.view(back.e06).screen,'lower');
 assert.equal(E06.view(back.e06).currentHealthy,true);
 assert.equal(E06.view(back.e06).e07Unlocked,false);
 assert.deepEqual(back.e05.canonicalEvents,[]);assert.deepEqual(back.e06.unlocks,[]);
 const e06Reset=E06.dispatch(e06,nav('restart'));
 const retained=decodeStationGardenTransfer(encodeStationGardenTransfer(e05,e06Reset));
 assert.deepEqual(retained.e05,e05);assert.deepEqual(retained.e06,E06.fresh());
 assert.equal(encodeStationGardenTransfer(E05.dispatch(e05,nav('restart')),e06),null);
});
test('no early entry, forged rights or invented dates can pass strict cross-scene replay',()=>{
 const e05=station(),e06=E06.fresh();
 assert.equal(encodeStationGardenTransfer(E05.fresh(),e06),null);
 const noQuestion=E05.replay(e05.history.slice(0,-1));
 assert.equal(encodeStationGardenTransfer(noQuestion,e06),null);
 for(const bad of [
  {...e05,rights:['station-access']},
  {...e05,unlocks:['E06']},
  {...e05,garden:{...e05.garden,question:false}}
 ])assert.equal(encodeStationGardenTransfer(bad,e06),null);
 for(const bad of [{...e06,rights:['planting']},{...e06,unlocks:['E07']}])
  assert.equal(encodeStationGardenTransfer(e05,bad),null);
 assert.equal(decodeStationGardenTransfer(''),null);
 assert.equal(decodeStationGardenTransfer('#paper-station-garden=%bad'),null);
 assert.equal(decodeStationGardenTransfer('#paper-station-garden='+'x'.repeat(35001)),null);
 const p={v:1,e05:e05.history,e06:e06.history};
 for(const bad of [
  {...p,v:2},{...p,year:1900},{...p,permissionApproved:true},
  {...p,e05:[]},{...p,e06:[{scene:'nav',type:'to-lower'}]},
  {...p,e05:[...p.e05,{scene:'grant-access',type:'approve'}]},
  {...p,e06:[{scene:'garden',action:{type:'enter'}}]}
 ])assert.equal(decodeStationGardenTransfer('#paper-station-garden='+encodeURIComponent(JSON.stringify(bad))),null);
});

test('E05 child-tested Map Room changes independent E06 FIRST/NOW PAPER world',()=>{
 const e05=station(),p=stationWorld(e05);
 assert.ok(p);
 assert.equal(p.first.table,'No PAPER table');
 assert.equal(p.now.table,'PAPER table by wall');
 assert.equal(p.first.board,'Old marks · untouched');
 assert.equal(p.now.board,'Two marks aligned on COPY');
 assert.equal(p.first.path,p.now.path);
 assert.equal(p.triedWalkway,true);
 assert.deepEqual(p.observedMarks,['lower PAPER mark','upper PAPER mark']);
 assert.equal(p.stationRealAccessApproved,false);
 assert.equal(p.historyKnown,false);
 assert.equal(p.e06Unlocked,false);
 assert.deepEqual(p.canonicalEvents,[]);
 assert.deepEqual(stationWorld(E05.replay(e05.history)),p);
 assert.equal(stationWorld(E05.fresh()),null);
 assert.equal(stationWorld(E05.replay(e05.history.slice(0,-1))),null);
 assert.equal(stationWorld(E05.dispatch(e05,nav('restart'))),null);
 const forged=structuredClone(e05);forged.rights.push('station-access');
 assert.equal(stationWorld(forged),null);
 const tampered=structuredClone(e05);tampered.station.replica.table='across-walkway';
 assert.equal(stationWorld(tampered),null);
});

test('E05 Map Room return requires E06 child-inspected two gardens; unsupported solid road revises to UNKNOWN question',()=>{
 const e05=station();
 let e06=E06.fresh();
 assert.equal(Return.view([],e05,e06).eligible,false);
 for(const action of [
  a('garden','start'),a('garden','inspect',{value:'present-bed'}),
  a('garden','walk',{value:'slope'}),a('garden','inspect',{value:'slope'}),
  a('garden','walk',{value:'model-tray'}),a('garden','run'),
  a('garden','weather',{value:'rain'}),a('garden','run'),
  a('garden','channel',{value:'blocked'}),a('garden','run'),
  a('garden','compare'),a('garden','enter'),
  a('garden','inspect',{value:'runoff-trace'}),
  a('garden','walk',{value:'public-path'}),a('garden','inspect',{value:'public-path'}),
  a('garden','walk',{value:'runoff-channel'}),a('garden','place',{value:'runoff-channel'}),
  a('garden','check'),a('garden','walk',{value:'raised-pocket'}),
  a('garden','place',{value:'raised-pocket'}),a('garden','check'),
  a('garden','think',{value:'keep-path'}),a('garden','finish')
 ])e06=step(E06,e06,action);
 const earned=decodeStationGardenTransfer(encodeStationGardenTransfer(e05,e06));
 assert.ok(earned);
 assert.equal(Return.view([],earned.e05,earned.e06).eligible,true);
 let h=[];
 assert.equal(Return.can(h,'try-solid',e05,e06),false);
 for(const type of ['inspect-current','inspect-lower','try-solid']){
  assert.equal(Return.can(h,type,e05,e06),true,type);
  h=Return.dispatch(h,type,e05,e06);
 }
 let v=Return.view(h,e05,e06);
 assert.equal(v.annotation,'unsupported');
 assert.match(v.feedback,/solid road needs real ground/);
 assert.equal(v.paperChronicle,null);
 h=Return.dispatch(h,'mark-question',e05,e06);
 h=Return.dispatch(h,'compare',e05,e06);
 v=Return.view(h,e05,e06);
 assert.equal(v.compared,true);
 assert.match(v.now,/NO ROAD/);
 assert.match(v.paperChronicle,/cause and permission remain UNKNOWN/);
 assert.deepEqual(v.canonicalEvents,[]);
 assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.rights,[]);
 assert.equal(Return.replay(h,e05,e06).compared,true);
 assert.equal(Return.replay([...h,'grant-access'],e05,e06),null);
 assert.equal(Return.replay(['compare'],e05,e06),null);
 assert.equal(Return.view(h,E05.dispatch(e05,nav('restart')),e06).eligible,false);
 assert.equal(Return.view(h,e05,E06.dispatch(e06,nav('restart'))).eligible,false);
 assert.equal(Return.view(h,{...e05,rights:['station']},e06).eligible,false);
 assert.equal(Return.view(h,e05,{...e06,unlocks:['E07']}).eligible,false);
 const erased=Return.dispatch(h,'erase',e05,e06);
 assert.equal(Return.view(erased,e05,e06).compared,false);
 assert.equal(Return.view(erased,e05,e06).annotation,'none');
 assert.equal(Return.view(['inspect-current','inspect-lower','mark-question','compare'],e05,e06).compared,true,
  'child need not be forced into a wrong first attempt');
});
