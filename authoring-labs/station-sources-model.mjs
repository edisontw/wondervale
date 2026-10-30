// Isolated E05 paper-source investigation. All cards are explicitly MOCK drawings,
// not records, attributed testimony, approved dates, or canonical history.
export const VERSION = 'e05-mock-sources-v1';
export const MAX_STEPS = 48;
export const CARDS = Object.freeze({
  a: Object.freeze({title:'MOCK A',drawing:'A drawn path bends beside a drawn garden.'}),
  b: Object.freeze({title:'MOCK B',drawing:'A drawn path stops beside a drawn slope.'})
});
const places = ['door','desk-a','desk-b','compare'];
const slots = ['earlier','later','unknown'];
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const own = (obj,k) => Object.prototype.hasOwnProperty.call(obj,k);
export function fresh(){
  return {version:VERSION,mode:'authoring_preview',phase:'opening',milo:'door',
    inspected:[],sourceChecked:[],placements:{a:null,b:null},
    tested:{a:null,b:null},compared:false,history:[],
    canonicalEvents:[],unlocks:[]};
}
function clean(a){
  if(!a||typeof a!=='object'||Array.isArray(a)||typeof a.type!=='string')return null;
  let out;
  switch(a.type){
    case 'start':case 'compare':case 'finish':out={type:a.type};break;
    case 'walk':out={type:'walk',value:a.value};if(!places.includes(a.value))return null;break;
    case 'inspect':case 'source-check':case 'test':
      out={type:a.type,card:a.card};if(!own(CARDS,a.card))return null;break;
    case 'place':
      out={type:'place',card:a.card,slot:a.slot};
      if(!own(CARDS,a.card)||!slots.includes(a.slot))return null;
      break;
    default:return null;
  }
  return same(out,a)?out:null;
}
function apply(s,a){
  if(s.phase==='finished')return null;
  if(a.type==='start')return s.phase==='opening'?{...s,phase:'investigate'}:null;
  if(s.phase==='opening')return null;
  if(a.type==='walk')return s.milo!==a.value?{...s,milo:a.value}:null;
  if(a.type==='inspect'){
    if(s.milo!=='desk-'+a.card||s.inspected.includes(a.card))return null;
    return {...s,inspected:[...s.inspected,a.card]};
  }
  if(a.type==='source-check'){
    if(s.milo!=='desk-'+a.card||!s.inspected.includes(a.card)||
       s.sourceChecked.includes(a.card))return null;
    return {...s,sourceChecked:[...s.sourceChecked,a.card]};
  }
  if(a.type==='place'){
    if(s.milo!=='compare'||!s.sourceChecked.includes(a.card)||
       s.placements[a.card]===a.slot)return null;
    return {...s,phase:'investigate',compared:false,
      placements:{...s.placements,[a.card]:a.slot},
      tested:{...s.tested,[a.card]:null}};
  }
  if(a.type==='test'){
    if(s.milo!=='compare'||!s.placements[a.card]||s.tested[a.card])return null;
    return {...s,tested:{...s.tested,
      [a.card]:s.placements[a.card]==='unknown'?'bounded':'needs-source'}};
  }
  if(a.type==='compare'){
    return s.milo==='compare'&&s.tested.a==='bounded'&&s.tested.b==='bounded'&&!s.compared
      ?{...s,phase:'compare',compared:true}:null;
  }
  if(a.type==='finish')return s.phase==='compare'&&s.compared
    ?{...s,phase:'finished'}:null;
  return null;
}
export function replay(history){
  if(!Array.isArray(history)||history.length>MAX_STEPS)return null;
  let s=fresh();
  for(const raw of history){
    const a=clean(raw);if(!a)return null;
    const n=apply(s,a);if(!n)return null;
    s={...n,history:[...s.history,a]};
  }
  return s;
}
export function restore(snapshot){
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot))return null;
  const s=replay(snapshot.history);
  return s&&same(s,snapshot)?s:null;
}
export function dispatch(snapshot,action){
  const s=restore(snapshot);if(!s)return fresh();
  if(s.history.length>=MAX_STEPS)return s;
  const a=clean(action);if(!a)return s;
  const n=apply(s,a);
  return n?{...n,history:[...s.history,a]}:s;
}
export function can(snapshot,action){
  const s=restore(snapshot),a=clean(action);
  return !!(s&&a&&s.history.length<MAX_STEPS&&apply(s,a));
}
export function view(snapshot){
  const s=restore(snapshot);if(!s)return null;
  const last=s.history.at(-1);
  let speaker='Nia',line='These are two MOCK drawings, not old records. Who made them? We do not know.';
  if(last?.type==='start'){speaker='Milo';line='I can look at both drawings and check where they came from.';}
  if(last?.type==='inspect'){speaker='Finn';line='I see a line on MOCK '+last.card.toUpperCase()+'. Does a drawing tell us when?';}
  if(last?.type==='source-check'){speaker='Nia';line='Maker UNKNOWN. Date UNKNOWN. Original record UNKNOWN. We need a real source.';}
  if(last?.type==='place'){speaker='Milo';line='I put MOCK '+last.card.toUpperCase()+' in '+last.slot.toUpperCase()+'. Let me test my idea.';}
  if(last?.type==='test'){
    if(s.tested[last.card]==='needs-source'){speaker='Nia';line='We cannot say earlier or later without a dated source. Move the paper card and try again.';}
    else {speaker='Milo';line='UNKNOWN fits what we know. I can still compare the drawings.';}
  }
  if(last?.type==='compare'){speaker='Finn';line='The drawings show different ideas. Neither proves the old route. What record should we ask for?';}
  if(s.phase==='finished'){speaker='Milo';line='We need real records with a maker and a date. The garden question is still open.';}
  return {phase:s.phase,milo:s.milo,speaker,line,
    inspected:[...s.inspected],sourceChecked:[...s.sourceChecked],
    placements:{...s.placements},tested:{...s.tested},compared:s.compared,
    sourceMetadata:{a:{maker:'UNKNOWN',date:'UNKNOWN',original:'UNKNOWN'},
      b:{maker:'UNKNOWN',date:'UNKNOWN',original:'UNKNOWN'}},
    paperNote:s.phase==='finished'
      ?'PAPER REQUEST ONLY: find attributable original records and dates before ordering any route/garden/hill events. No historical conclusion.'
      :'No verified source, historical order, Chronicle or episode unlock.',
    parentCue:s.sourceChecked.length?'What would help us tell which drawing came first?':null,
    historicalClaims:[],canonicalEvents:[],unlocks:[]};
}
