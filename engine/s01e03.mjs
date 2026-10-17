// E03-owned engineering slice. Only visibly connected M0 pavement is walkable.
// S/N remain inspection targets until their occluded connections are validated.
import {restore as restoreE02,projected as projectE02} from './s01e02.mjs';
export const KEY='wondervale-s01e03-progress-v1',E02_KEY='wondervale-s01e02-progress-v1';
export const VERSION='s01e03-slice-v1',BUILD='20261017-e03-carried-props1';
export const EVENTS={books:'s01e03_delivery_book_delivered',revision:'s01e03_cart_route_revised',tea:'s01e03_delivery_tea_delivered',flowers:'s01e03_delivery_flowers_delivered',signs:'s01e03_market_wayfinding_improved',glyph:'s01e03_old_market_marker_recorded',station:'s01e03_station_memory_recorded',garden:'s01e03_garden_memory_recorded',finish:'episode_completed:s01e03'};
export const e02Ready=save=>{const s=restoreE02(save),p=projectE02(s);return s.phase==='completed'&&s.chronicleSeen&&p.completed&&p.market;};
// Source-image pixels, feet on visible paving. No river/bridge foreground edge.
export const places={H:[275,656],west:[350,691],bend:[470,747],front:[670,788],east:[880,790],fork:[1085,731],archApproach:[946,664],arch:[847,573],ramp0:[1160,644],ramp1:[1190,535],ramp2:[1285,428],ramp3:[1394,342],B:[1432,305],T:[1370,656],flowerTurn:[950,870],F:[1040,885],stone:[1125,708]};
export const edges=[['H','west'],['west','bend'],['bend','front'],['front','east'],['east','fork'],['fork','ramp0'],['ramp0','ramp1'],['ramp1','ramp2'],['ramp2','ramp3'],['ramp3','B'],['ramp0','T'],['east','flowerTurn'],['flowerTurn','F'],['fork','stone'],['fork','archApproach'],['archApproach','arch']].map(([a,b])=>({a,b,walk:true,cart:!['arch','archApproach','stone'].includes(a)&&!['arch','archApproach','stone'].includes(b),steady:!['arch','archApproach'].includes(a)&&!['arch','archApproach'].includes(b),clearance:80}));
export const destinations={books:'B',tea:'T',flowers:'F'};
export const restricted={S:{label:'Steps',cart:false,steady:false,crop:[390,120,530,255]},N:{label:'Narrow arcade',cart:false,steady:false,crop:[660,340,380,320]}};
export function route(start,end,load='none'){
 if(!(start in places)||!(end in places))return [];
 const allowed=e=>load==='tea_cart'?e.cart:load==='flowers'?e.steady:e.walk;
 const q=[[start]],seen=new Set([start]);
 while(q.length){const path=q.shift(),last=path.at(-1);if(last===end)return path;
  for(const e of edges.filter(allowed)){const n=e.a===last?e.b:e.b===last?e.a:null;if(n&&!seen.has(n)){seen.add(n);q.push([...path,n]);}}}
 return [];
}
const id=(s,n)=>`S01E03-${s}-${String(n).padStart(3,'0')}`;
const lines=(...pairs)=>pairs.map(([s,n])=>id(s,n));
export const speech={
 arrival:lines(['NARRATOR',1],['MILO',1],['NIA',1],['FINN',1],['NARRATOR',2],['NARRATOR',3],['COORDINATOR',1],['COORDINATOR',2],['MILO',2],['COORDINATOR',3],['COORDINATOR',4],['COORDINATOR',5],['NIA',2],['UI',2],['FINN',2],['FINN',3],['NIA',3],['UI',3]),
 books:lines(['MILO',3],['FINN',4],['NIA',4]),
 tea:lines(['COORDINATOR',6],['MILO',4],['FINN',5],['FINN',6],['UI',4]),
 teaDelivered:lines(['MILO',6],['NIA',7],['MILO',7]),
 reasoning:lines(['FINN',9],['FINN',10]),
 flowers:lines(['COORDINATOR',7],['MILO',8],['UI',9]),
 flowerDelivered:lines(['MILO',9],['COORDINATOR',8],['FINN',11]),
 signs:lines(['MILO',10],['NIA',9],['FINN',12],['FINN',13],['UI',11]),
 signsDone:lines(['NARRATOR',4],['MILO',11],['NIA',10]),
 glyph:lines(['MILO',12],['FINN',14]),
 station:lines(['COORDINATOR',9]),garden:lines(['RESIDENT',1]),
 memories:lines(['MILO',13],['NIA',11],['NIA',12],['FINN',15],['MILO',14],['NARRATOR',5],['UI',13]),
 chronicle:lines(['NARRATOR',6],['NARRATOR',7],['UI',14]),
 unsure:lines(['UI',7],['NIA',13],['NIA',14]),
};
export const fresh=(mode='canonical')=>({schema:1,version:VERSION,mode,phase:'preview',position:'H',load:'none',queue:[],after:null,ledger:[],achieved:[],travel:[],travelEnd:null,observed:[],signs:[],chronicleSeen:false,feedback:'',hint:0,history:[]});
export const has=(s,k)=>s.achieved.includes(EVENTS[k]);
function emit(s,k){if(!has(s,k))s.achieved.push(EVENTS[k]);if(s.mode==='canonical'&&!s.ledger.includes(EVENTS[k]))s.ledger.push(EVENTS[k]);}
function say(s,group,after=null){s.queue=[...group];s.after=after;if(!s.queue.length&&after){s.phase=after;s.after=null;}}
function plan(s,to,end){const p=route(s.position,to,s.load);if(p.length){s.travel=p.slice(1);s.travelEnd=end;if(!s.travel.length)arrival(s);}}
function arrival(s){const end=s.travelEnd;s.travelEnd=null;
 if(end==='hub'){s.load='none';if(s.phase==='return-books'){s.load='tea_cart';s.phase='tea';say(s,speech.tea);}else if(s.phase==='return-tea'){s.load='flowers';s.phase='flowers';say(s,speech.flowers);}else if(s.phase==='return-flowers'){s.phase='signs';say(s,speech.signs);}}
 if(end==='glyph')s.feedback='Look closely at the old stone. The new signs are separate.';
}
export function dispatch(before,a){
 const s=structuredClone(before);if(!a||typeof a.type!=='string'||s.history.length>=4000)return s;
 const snapshot=JSON.stringify(s);
 if(a.type==='next'){if(s.queue.length){s.queue.shift();if(!s.queue.length&&s.after){s.phase=s.after;s.after=null;}}}
 else if(!s.queue.length){
  if(s.travel.length){if(a.type==='step'&&a.to===s.travel[0]){s.position=s.travel.shift();if(!s.travel.length)arrival(s);}}
  else switch(a.type){
   case 'begin':if(s.phase==='preview'&&a.ready===true){s.load='books';s.phase='arrival';say(s,speech.arrival,'books');}break;
   case 'inspect':if(['books','tea','comparison','flowers'].includes(s.phase)&&['S','N','load'].includes(a.what)){
    if(!s.observed.includes(a.what))s.observed.push(a.what);
    s.feedback=a.what==='S'?'The steps are for people on foot. The loaded cart cannot climb them.':a.what==='N'?'The arcade has a narrow entrance and a tight turn. The loaded cart needs more room.':s.load==='books'?'A small bundle of books, carried by hand.':s.load==='tea_cart'?'Cups stay on the cart. It needs a wide, level path.':'The flower tray needs a steady, level path.';
   }break;
   case 'unsure':if(['books','tea','comparison','flowers'].includes(s.phase)){s.hint=Math.min(2,s.hint+1);s.feedback='Look at the load, the steps and the width. You can look again.';say(s,speech.unsure);}break;
   case 'take-route':if(['books','tea','flowers'].includes(s.phase)){
    if(a.route==='L'){s.feedback='';plan(s,destinations[s.phase],'delivery');}
    else if(['S','N'].includes(a.route))s.feedback='This connection is not yet walkable in this preview. Inspect the real entrance, or take the open outer lane.';
   }break;
   case 'deliver':if(['books','tea','flowers'].includes(s.phase)&&s.position===destinations[s.phase]&&s.load===({books:'books',tea:'tea_cart',flowers:'flowers'})[s.phase]){
    const ph=s.phase;emit(s,ph);s.load='none';
    if(ph==='tea'){s.phase='comparison';say(s,speech.teaDelivered);}
    else {s.phase=ph==='books'?'return-books':'return-flowers';say(s,speech[ph==='books'?'books':'flowerDelivered']);}
   }break;
   case 'compare':if(s.phase==='comparison'&&s.observed.some(x=>['S','N'].includes(x))&&['steps','width'].includes(a.reason)&&s.observed.includes(a.reason==='steps'?'S':'N')){
    emit(s,'revision');s.phase='return-tea';s.feedback='The load changed. A wide, level route fits the cart.';say(s,speech.reasoning);
   }break;
   case 'return':if(['return-books','return-tea','return-flowers'].includes(s.phase))plan(s,'H','hub');break;
   case 'sign':if(s.phase==='signs'&&['WALK','CART'].includes(a.kind)){
    if(a.to!=='L'){s.feedback='Check the arrow. That way does not fit this sign. Try again.';break;}
    if(!s.signs.includes(a.kind))s.signs.push(a.kind);s.feedback='';
    if(s.signs.length===2){emit(s,'signs');s.phase='glyph';say(s,speech.signsDone);}
   }break;
   case 'go-glyph':if(s.phase==='glyph'&&!has(s,'glyph'))plan(s,'stone','glyph');break;
   case 'glyph':if(s.phase==='glyph'&&s.position==='stone'){emit(s,'glyph');s.phase='memories';say(s,speech.glyph);}break;
   case 'memory':if(s.phase==='memories'&&has(s,'glyph')&&['station','garden'].includes(a.which)){
    emit(s,a.which);say(s,speech[a.which]);if(has(s,'station')&&has(s,'garden'))say(s,[...speech[a.which],...speech.memories],'chronicle');
   }break;
   case 'chronicle':if(s.phase==='chronicle'&&has(s,'station')&&has(s,'garden')){s.chronicleSeen=true;say(s,speech.chronicle);}break;
   case 'finish':if(s.phase==='chronicle'&&s.chronicleSeen&&Object.keys(EVENTS).filter(k=>k!=='finish').every(k=>has(s,k))){emit(s,'finish');s.phase='completed';}break;
  }
 }
 // Store only accepted actions in a bounded, replayable atomic checkpoint.
 if(JSON.stringify(s)!==snapshot&&s.history.length<4000)s.history.push(structuredClone(a));
 return s;
}
export function payload(s){return s.mode==='canonical'&&s.phase!=='preview'?structuredClone(s):null;}
export function restore(raw){
 if(!raw||raw.schema!==1||raw.version!==VERSION||raw.mode!=='canonical'||!Array.isArray(raw.history)||raw.history.length>4000)return fresh();
 try{let s=fresh();for(const a of raw.history){if(!a||!['begin','next','step','inspect','unsure','take-route','deliver','compare','return','sign','go-glyph','glyph','memory','chronicle','finish'].includes(a.type))return fresh();s=dispatch(s,a);}
  // Reconstruct every story flag and position; reject mixed/corrupt snapshots.
  return JSON.stringify(s)===JSON.stringify(raw)?s:fresh();
 }catch{return fresh();}
}
