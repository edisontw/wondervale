// E10 child-controlled PAPER rehearsal, never a production scene or approved history.
// Reuses the strict E10 evidence/needs reducer but deliberately excludes its fictional name token.
import * as E10 from '../engine/s01e10-authoring-prototype.mjs';
export const VERSION='s01e10-unnamed-story-paper-v1',MAX_STEPS=120;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function fresh(){return {version:VERSION,mode:'authoring_preview',started:false,
 e10:E10.fresh(),testedOneSlot:false,changedAfterTest:false,finishedPaper:false,
 history:[],canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]};}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 if(['start','test-one-slot','finish-paper'].includes(a.type))return {type:a.type};
 if(a.type==='walk')return {type:a.type,to:a.to};
 if(a.type==='inspect')return {type:a.type,traceId:a.traceId};
 if(['suggest','remove'].includes(a.type))return {type:a.type,traceId:a.traceId,useTag:a.useTag};
 if(a.type==='revise')return {type:a.type,traceId:a.traceId,oldTag:a.oldTag,newTag:a.newTag};
 if(a.type==='hear')return {type:a.type,needId:a.needId};
 if(a.type==='place')return {type:a.type,needId:a.needId,slot:a.slot};
 if(['compare-symbol','check-source','review-tradeoff','review'].includes(a.type))return {type:a.type};
 return null; // Never allow enable-fixture, finish-preview, invented sources, or canonical unlock.
}
function apply(s,a){
 if(a.type==='start')return s.started?null:{...s,started:true};
 if(!s.started||s.finishedPaper)return null;
 const n=s.e10;
 if(a.type==='test-one-slot'){
  return !s.testedOneSlot&&n.heard.length===2&&
   n.board.quiet==='shared'&&n.board.activity==='shared'?
   {...s,testedOneSlot:true}:null;
 }
 if(a.type==='finish-paper'){
  return n.reviewed&&n.sourceChecked&&!n.nameRevealed&&!n.fixtureEnabled&&
   s.testedOneSlot&&s.changedAfterTest&&n.board.quiet!==n.board.activity?
   {...s,finishedPaper:true}:null;
 }
 if(['review-tradeoff','review'].includes(a.type)&&
   (!s.testedOneSlot||!s.changedAfterTest||n.board.quiet===n.board.activity))return null;
 const next=E10.dispatch(n,a);
 if(eq(next,n))return null;
 const changedAfterTest=s.changedAfterTest||
  (a.type==='place'&&s.testedOneSlot&&next.board.quiet!==next.board.activity&&
   next.board.quiet!==undefined&&next.board.activity!==undefined);
 return {...s,e10:next,changedAfterTest};
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_STEPS)return null;
 let s=fresh();
 for(const raw of history){
  const a=clean(raw);if(!a||!eq(a,raw))return null;
  const n=apply(s,a);if(!n)return null;
  s={...n,history:[...s.history,a]};
 }
 return s;
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
  snapshot.version!==VERSION||snapshot.mode!=='authoring_preview')return null;
 const s=replay(snapshot.history);return s&&eq(s,snapshot)?s:null;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 return !!(s&&s.history.length<MAX_STEPS&&a&&eq(a,action)&&apply(s,a));
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);if(!s)return fresh();
 if(action?.type==='reset'&&eq(action,{type:'reset'}))return fresh();
 if(!can(s,action))return s;
 const a=clean(action),n=apply(s,a);
 return {...n,history:[...s.history,a]};
}
export function view(snapshot){
 const s=restore(snapshot);if(!s)return null;
 const n=s.e10,p=E10.previewProjection(n),last=s.history.at(-1);
 let speaker='Milo',line='I see a mark. What did people do here?';
 if(last?.type==='start'){speaker='Finn';line='I want to use this place! But what do we know?';}
 if(last?.type==='walk'){speaker='Milo';line=last.to==='closed_hill'?
  'I stop. The hill stays closed.':'I walk to the '+last.to.replaceAll('_',' ')+'.';}
 if(last?.type==='inspect'){speaker='Nia';line='I see a shape. Its use and age are UNKNOWN.';}
 if(last?.type==='suggest'){speaker='Milo';line='It could be '+last.useTag+'. I am not sure.';}
 if(last?.type==='revise'||last?.type==='remove'){speaker='Nia';line='We can change MAYBE. The thing we saw stays the same.';}
 if(last?.type==='compare-symbol'){speaker='Nia';line='The marks look alike. That does not prove a name.';}
 if(last?.type==='check-source'){speaker='Nia';line='No approved source yet. The name is UNKNOWN.';}
 if(last?.type==='hear'){speaker='Finn';line='They need '+E10.NEEDS[last.needId].want+'. Let us listen to both.';}
 if(last?.type==='place'){speaker='Milo';line='I move a PAPER need card. We can try again.';}
 if(last?.type==='test-one-slot'){speaker='Finn';line='Both cards want this spot at once. Could we try another plan?';}
 if(last?.type==='review-tradeoff'){speaker='Finn';line='We kept both needs visible. No real plan is chosen.';}
 if(last?.type==='review'){speaker='Nia';line='We saw clues. We have ideas. We still have questions.';}
 if(last?.type==='finish-paper'){speaker='Milo';line='Our paper notes are ready. We cannot open the place yet.';}
 const stage=!s.started?'opening':s.finishedPaper?'finished':n.reviewed?'reviewed':
  s.testedOneSlot?'revise':n.heard.length===2?'needs':n.inspected.length===2?'infer':'explore';
 return {stage,speaker,line,position:n.position,inspected:[...n.inspected],
  observations:p.cards.seen,hypotheses:p.cards.maybe,needs:p.cards.needs,
  unknown:p.cards.unknown,board:{...n.board},heard:[...n.heard],
  feedback:last?.type==='test-one-slot'?'PAPER TEST: one shared spot at the same time may not suit both needs. Move a card and compare.':
   last?.type==='finish-paper'?'PAPER review only. No real access, approved name or E11 unlock.':n.feedback,
  symbolCompared:n.symbolCompared,sourceChecked:n.sourceChecked,reviewed:n.reviewed,
  testedOneSlot:s.testedOneSlot,changedAfterTest:s.changedAfterTest,finishedPaper:s.finishedPaper,
  parentEvidenceCue:n.inspected.length===2&&!s.finishedPaper?
   'What tells us this place might have had more than one use?':null,
  parentNeedsCue:n.heard.length===2&&!s.finishedPaper?
   'Whose need might we miss if we choose too soon?':null,
  paperNote:s.finishedPaper?
   'PAPER NOTE — SEEN / MAYBE / SIMULATED NEEDS / UNKNOWN. Place name and history UNKNOWN. No approved safe entry. E11 NOT UNLOCKED.':
   'FICTIONAL MODEL — trace age, past use, present voices, name and safe entry UNKNOWN. North Hill CLOSED.',
  actualName:null,realAccessApproved:false,sourceApproved:false,upperHillClosed:true,
  e11Unlocked:false,seasonFinished:false,canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]};
}
