// Strict, replay-derived E04-E07 independent PAPER chain; no official unlock.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as E04 from '../authoring-labs/arc1-memory-station-handoff-model.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import * as E08 from '../e08-scene/scene-model.mjs';
import * as E09 from '../e09-scene/scene-model.mjs';
import {encodeMemoryHill,decodeMemoryHill} from '../authoring-labs/e04-e09-scene-transfer.mjs';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {encodeMemoryCourtyard,decodeMemoryCourtyard} from '../authoring-labs/e04-e10-scene-transfer.mjs';
import {encodeMemoryLantern,decodeMemoryLantern} from '../authoring-labs/e04-e08-scene-transfer.mjs';
import {encodeMemoryGardenShortcut as encode,decodeMemoryGardenShortcut as decode}
 from '../authoring-labs/e04-e07-scene-transfer.mjs';
const a=(scene,type,extra={})=>({scene,action:{type,...extra}});
const nav=type=>({scene:'nav',type});
const g=(type,value)=>({scene:'garden',action:value===undefined?{type}:{type,value}});
const c=(type,value)=>value===undefined?{scene:'care',type}:{scene:'care',type,value};
function step(model,s,action){
 assert.equal(model.can(s,action),true,JSON.stringify(action));
 return model.dispatch(s,action);
}
function memories(){
 let s=E04.fresh();
 for(const action of [
  a('e04','inspect',{which:'station'}),a('e04','inspect',{which:'garden'}),
  a('e04','place',{which:'station',slot:'earlier'}),
  a('e04','place',{which:'garden',slot:'later'}),
  a('e04','place',{which:'station',slot:'unknown'}),
  a('e04','place',{which:'garden',slot:'unknown'}),
  a('e04','compare'),a('e04','finish-paper')
 ])s=step(E04,s,action);
 return s;
}
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

function completedGarden(){
 let s=E06.fresh();
 for(const a of [g('start'),g('inspect','present-bed'),g('walk','slope'),g('inspect','slope'),
  g('walk','model-tray'),g('run'),g('weather','rain'),g('run'),g('channel','blocked'),
  g('run'),g('compare'),g('enter'),g('inspect','runoff-trace'),
  g('walk','public-path'),g('inspect','public-path'),g('walk','runoff-channel'),
  g('place','runoff-channel'),g('check'),g('walk','raised-pocket'),
  g('place','raised-pocket'),g('check'),g('think','keep-path'),g('finish'),
  c('choose','heavy'),c('test'),c('choose','gentle'),c('test'),c('compare')]){
  assert.equal(E06.can(s,a),true,JSON.stringify(a));s=E06.dispatch(s,a);
 }
 return s;
}

test('E04 undated memories to E07 child action survive all four independent visits',()=>{
 const e04=memories(),e05=station(),e06=completedGarden();
 let e07=step(E07,E07.fresh(),a('story','start'));
 e07=step(E07,e07,a('story','walk',{value:'shared-path'}));
 e07=step(E07,e07,a('story','inspect',{value:'shared-path'}));
 const packet=decode(encode(e04,e05,e06,e07));
 assert.deepEqual(packet,{e04,e05,e06,e07});
 assert.equal(E04.view(packet.e04).sourceDates,'UNKNOWN');
 assert.equal(E05.view(packet.e05).e06Unlocked,false);
 assert.equal(E06.view(packet.e06).lowerGrowthVisible,true);
 assert.equal(E07.view(packet.e07).story.stage,'explore');
 assert.ok(E07.view(packet.e07).story.observed.includes('shared-path'));
 for(const s of Object.values(packet)){
  assert.deepEqual(s.canonicalEvents,[]);
  assert.deepEqual(s.unlocks,[]);
  assert.deepEqual(s.rights,[]);
  assert.deepEqual(s.historicalClaims,[]);
 }
 const e07Reset=E07.dispatch(e07,nav('restart'));
 assert.deepEqual(decode(encode(e04,e05,e06,e07Reset)).e07,E07.fresh());
 assert.equal(encode(e04,e05,E06.fresh(),e07),null,'E06 restart revokes E07');
 assert.equal(encode(e04,E05.fresh(),e06,e07),null,'E05 restart revokes E06/E07');
 assert.equal(encode(E04.dispatch(e04,nav('restart-e04')),e05,e06,e07),null);
});
test('E07 cannot be fabricated before E06 child care; rights, dates and malformed fragments fail closed',()=>{
 const e04=memories(),e05=station(),e06=completedGarden();
 const e07=step(E07,E07.fresh(),a('story','start'));
 assert.equal(encode(e04,e05,E06.fresh(),e07),null);
 assert.equal(encode(e04,e05,E06.fresh(),E07.fresh())!==null,true,
  'unstarted downstream may be carried but not credited');
 for(const bad of [
  {...e04,rights:['station']},{...e05,unlocks:['E06']},
  {...e06,rights:['planting']},{...e07,unlocks:['E08']},
  {...e07,history:[...e07.history,{scene:'nav',type:'grant-access'}]}
 ])assert.equal(encode(
  bad.version===e04.version?bad:e04,
  bad.version===e05.version?bad:e05,
  bad.version===e06.version?bad:e06,
  bad.version===e07.version?bad:e07),null);
 const fragment=p=>'#paper-memory-station-garden-shortcut='+encodeURIComponent(JSON.stringify(p));
 const packet={v:1,e04:e04.history,e05:e05.history,e06:e06.history,e07:e07.history};
 for(const bad of [
  {...packet,year:1920},{...packet,rights:['approved']},{...packet,v:2},
  {...packet,e04:[]},{...packet,e06:[]},
  {...packet,e07:[{scene:'story',action:{type:'finish'}}]}
 ])assert.equal(decode(fragment(bad)),null);
 assert.equal(decode(''),null);
 assert.equal(decode('#paper-memory-station-garden-shortcut=%bad'),null);
 assert.equal(decode('#paper-memory-station-garden-shortcut='+'x'.repeat(85001)),null);
});

// E04 -> E08 is a five-scene child-earned PAPER chain, not an official unlock.
test('E04-E08 PAPER histories survive five independent scenes, resets and forgery checks',()=>{
 const e04=memories(),e05=station(),e06=completedGarden();
 let e07=E07.fresh();
 const w=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
 for(const x of [a('story','start'),a('story','walk',{value:'shared-path'}),
  a('story','inspect',{value:'shared-path'}),a('story','walk',{value:'channel'}),
  a('story','inspect',{value:'channel'}),a('story','walk',{value:'workbench'}),
  ...['milo','resident','water'].map(value=>a('story','trial',{value})),
  a('story','place',{value:'path-clear-water-blocked'}),
  ...['milo','resident','water'].map(value=>a('story','trial',{value})),
  a('story','place',{value:'side-offset'}),
  ...['water','milo','resident'].map(value=>a('story','trial',{value})),
  a('story','compare'),a('story','finish'),
  w('start'),w('move','crossing'),w('inspect','crossing'),
  w('move','water-edge'),w('inspect','water-edge'),
  w('move','steps-base'),w('review')
 ])e07=step(E07,e07,x);
 let e08=E08.fresh();
 const l=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
 for(const x of [l('start'),l('inspect','feature','brackets'),l('inspect','feature','boundary'),
  l('inspect','feature','lower-a'),l('toggle-lamp','lampId','lower-a'),
  l('walk','anchor','lower-landing'),l('inspect','feature','lower-b'),
  l('toggle-lamp','lampId','lower-b'),l('walk','anchor','base'),l('observe-view'),
  l('walk','anchor','lower-landing'),l('walk','anchor','side'),l('observe-view'),
  l('compare-views'),l('inspect','feature','service-plate'),l('confirm-preview')
 ])e08=step(E08,e08,x);
 const fragment=encodeMemoryLantern(e04,e05,e06,e07,e08);
 assert.match(fragment,/^#paper-memory-station-garden-shortcut-steps=/);
 const p=decodeMemoryLantern(fragment);
 assert.deepEqual(p,{e04,e05,e06,e07,e08});
 assert.equal(E04.view(p.e04).sourceDates,'UNKNOWN');
 assert.equal(E05.view(p.e05).e06Unlocked,false);
 assert.equal(E07.view(p.e07).e08Unlocked,false);
 assert.equal(E08.view(p.e08).e09Unlocked,false);
 assert.equal(E08.view(p.e08).upperHillClosed,true);
 for(const s of Object.values(p))
  for(const k of ['canonicalEvents','unlocks','rights','historicalClaims'])assert.deepEqual(s[k],[]);
 // The E09 model remains an independent child survey, with the full undated
 // E04/E05 context available as read-only evidence and no new canonical rights.
 let e09=E09.fresh();
 for(const x of [
  l('start'),l('inspect','clueId','entry_note'),l('walk','to','signpost'),
  l('inspect','clueId','boundary_sign'),l('walk','to','fence_view'),
  l('inspect','clueId','disturbed_ground'),l('walk','to','upper_closed'),
  l('walk','to','signpost'),l('walk','to','lower_bend'),
  l('inspect','clueId','runoff_marks'),l('walk','to','overlook'),
  l('inspect','clueId','distant_symbol'),
  l('mark','edgeId','steps_base:signpost'),l('mark','edgeId','signpost:lower_bend'),
  l('mark','edgeId','lower_bend:overlook'),l('check-route'),
  l('compare-symbol'),l('review'),l('finish-preview')
 ])e09=step(E09,e09,x);
 const hillFragment=encodeMemoryHill(e04,e05,e06,e07,e08,e09);
 assert.match(hillFragment,/^#paper-memory-station-garden-shortcut-steps-hill=/);
 const six=decodeMemoryHill(hillFragment);
 assert.deepEqual(six,{e04,e05,e06,e07,e08,e09});
 assert.equal(E04.view(six.e04).sourceDates,'UNKNOWN');
 assert.equal(E09.view(six.e09).story.previewComplete,true);
 assert.equal(E09.view(six.e09).upperHillClosed,true);
 assert.equal(E09.view(six.e09).e10Unlocked,false);
 for(const st of Object.values(six))
  for(const k of ['canonicalEvents','unlocks','rights','historicalClaims'])assert.deepEqual(st[k],[]);
 // E10 remains an independent child-controlled PAPER scene. Seven histories are
 // transferred only after the child completes the safe E09 survey.
 let e10=E10.fresh();
 const e10Actions=[
  ['start',{}],['compare-symbol',{}],['walk',{to:'stone_edge'}],
  ['inspect',{traceId:'surface'}],['suggest',{traceId:'surface',useTag:'passing'}],
  ['revise',{traceId:'surface',oldTag:'passing',newTag:'resting'}],
  ['walk',{to:'quiet_corner'}],['hear',{needId:'quiet'}],
  ['place',{needId:'quiet',slot:'shared'}],['walk',{to:'meeting_edge'}],
  ['hear',{needId:'activity'}],['place',{needId:'activity',slot:'shared'}],
  ['test-one-slot',{}],['place',{needId:'quiet',slot:'left'}],
  ['place',{needId:'activity',slot:'right'}],['walk',{to:'notice_wall'}],
  ['inspect',{traceId:'holes'}],['suggest',{traceId:'holes',useTag:'display'}],
  ['check-source',{}],['review-tradeoff',{}],['review',{}],['finish-paper',{}]
 ];
 for(const [type,extra] of e10Actions){
  assert.equal(E10.can(e10,{type,...extra}),true,type);
  e10=E10.dispatch(e10,{type,...extra});
 }
 const sevenFragment=encodeMemoryCourtyard(e04,e05,e06,e07,e08,e09,e10);
 assert.match(sevenFragment,/^#paper-memory-station-garden-shortcut-steps-hill-courtyard=/);
 const seven=decodeMemoryCourtyard(sevenFragment);
 assert.deepEqual(seven,{e04,e05,e06,e07,e08,e09,e10});
 assert.equal(E04.view(seven.e04).sourceDates,'UNKNOWN');
 assert.equal(E09.view(seven.e09).upperHillClosed,true);
 assert.equal(E10.view(seven.e10).finishedPaper,true);
 assert.equal(E10.view(seven.e10).actualName,null);
 assert.equal(E10.view(seven.e10).e11Unlocked,false);
 for(const st of Object.values(seven))
  for(const k of ['canonicalEvents','unlocks','rights','historicalClaims'])assert.deepEqual(st[k],[]);
 const resetE10=E10.dispatch(e10,{type:'reset'});
 assert.equal(E10.view(decodeMemoryCourtyard(
  encodeMemoryCourtyard(e04,e05,e06,e07,e08,e09,resetE10)).e10).stage,'opening');
 assert.equal(encodeMemoryCourtyard(e04,e05,e06,e07,e08,E09.fresh(),e10),null);
 assert.equal(encodeMemoryCourtyard(e04,e05,e06,e07,E08.fresh(),e09,e10),null);
 assert.equal(encodeMemoryCourtyard(e04,e05,e06,E07.fresh(),e08,e09,e10),null);
 assert.equal(encodeMemoryCourtyard(e04,e05,E06.fresh(),e07,e08,e09,e10),null);
 assert.equal(encodeMemoryCourtyard(e04,E05.fresh(),e06,e07,e08,e09,e10),null);
 assert.equal(encodeMemoryCourtyard(E04.fresh(),e05,e06,e07,e08,e09,e10),null);
 assert.equal(encodeMemoryCourtyard(e04,e05,e06,e07,e08,e09,{...e10,rights:['courtyard']}),null);
 const sevenPacket={v:1,...Object.fromEntries(Object.entries(seven).map(([k,st])=>[k,st.history]))};
 const pack=x=>'#paper-memory-station-garden-shortcut-steps-hill-courtyard='+encodeURIComponent(JSON.stringify(x));
 for(const bad of [{...sevenPacket,v:2},{...sevenPacket,year:1901},{...sevenPacket,rights:['open']},
  {...sevenPacket,e04:[]},{...sevenPacket,e09:[]},{...sevenPacket,e10:[{type:'finish-paper'}]},
  {...sevenPacket,e10:[...e10.history,{type:'grant-unlock'}]}])
  assert.equal(decodeMemoryCourtyard(pack(bad)),null);
 assert.equal(decodeMemoryCourtyard('#paper-memory-station-garden-shortcut-steps-hill-courtyard=%broken'),null);
 assert.equal(decodeMemoryCourtyard('#paper-memory-station-garden-shortcut-steps-hill-courtyard='+'x'.repeat(180001)),null);
 const resetE09=E09.dispatch(e09,nav('restart'));
 const restarted=decodeMemoryHill(encodeMemoryHill(e04,e05,e06,e07,e08,resetE09));
 assert.equal(E09.view(restarted.e09).story.stage,'opening');
 assert.equal(E08.view(restarted.e08).story.previewComplete,true);
 assert.equal(encodeMemoryHill(e04,e05,e06,e07,E08.fresh(),e09),null);
 assert.equal(encodeMemoryHill(e04,e05,e06,E07.fresh(),e08,e09),null);
 assert.equal(encodeMemoryHill(e04,e05,E06.fresh(),e07,e08,e09),null);
 assert.equal(encodeMemoryHill(e04,E05.fresh(),e06,e07,e08,e09),null);
 assert.equal(encodeMemoryHill(E04.fresh(),e05,e06,e07,e08,e09),null);
 assert.equal(encodeMemoryHill(e04,e05,e06,e07,e08,{...e09,rights:['hill']}),null);
 const hillPacket={v:1,e04:e04.history,e05:e05.history,e06:e06.history,
  e07:e07.history,e08:e08.history,e09:e09.history};
 const packHill=x=>'#paper-memory-station-garden-shortcut-steps-hill='+encodeURIComponent(JSON.stringify(x));
 for(const bad of [{...hillPacket,year:1920},{...hillPacket,v:2},
  {...hillPacket,e04:[]},{...hillPacket,e08:[]},
  {...hillPacket,e09:[{scene:'story',action:{type:'finish-preview'}}]},
  {...hillPacket,rights:['real-hill']},
  {...hillPacket,e09:[...e09.history,{scene:'nav',type:'grant-access'}]}])
  assert.equal(decodeMemoryHill(packHill(bad)),null);
 assert.equal(decodeMemoryHill('#paper-memory-station-garden-shortcut-steps-hill=%broken'),null);
 assert.equal(decodeMemoryHill('#paper-memory-station-garden-shortcut-steps-hill='+'x'.repeat(150001)),null);
 const reset=E08.dispatch(e08,nav('restart'));
 assert.equal(E08.view(decodeMemoryLantern(encodeMemoryLantern(e04,e05,e06,e07,reset)).e08).story.stage,'opening');
 assert.equal(encodeMemoryLantern(e04,e05,e06,E07.fresh(),e08),null);
 assert.equal(encodeMemoryLantern(e04,e05,E06.fresh(),e07,e08),null);
 assert.equal(encodeMemoryLantern(e04,E05.fresh(),e06,e07,e08),null);
 assert.equal(encodeMemoryLantern(E04.fresh(),e05,e06,e07,e08),null);
 for(const [which,forged] of [['e04',{...e04,rights:['archive']}],
  ['e05',{...e05,unlocks:['E06']}],['e06',{...e06,rights:['plant']}],
  ['e07',{...e07,unlocks:['E08']}],['e08',{...e08,rights:['electricity']}]]){
  const input={e04,e05,e06,e07,e08,[which]:forged};
  assert.equal(encodeMemoryLantern(input.e04,input.e05,input.e06,input.e07,input.e08),null);
 }
 const packet={v:1,e04:e04.history,e05:e05.history,e06:e06.history,e07:e07.history,e08:e08.history};
 const pack=x=>'#paper-memory-station-garden-shortcut-steps='+encodeURIComponent(JSON.stringify(x));
 for(const bad of [{...packet,year:1912},{...packet,e04:[]},{...packet,e07:[]},
  {...packet,e08:[{scene:'story',action:{type:'confirm-preview'}}]},
  {...packet,v:2}])assert.equal(decodeMemoryLantern(pack(bad)),null);
 assert.equal(decodeMemoryLantern('#paper-memory-station-garden-shortcut-steps=%broken'),null);
 assert.equal(decodeMemoryLantern('#paper-memory-station-garden-shortcut-steps='+'x'.repeat(110001)),null);
});
