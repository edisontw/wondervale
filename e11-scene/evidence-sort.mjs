// Independent child-operated E05→E11 PAPER evidence sorting rehearsal.
// These are invented paper objects, not E04 records or earned canonical evidence.
export const CARDS=Object.freeze([
 Object.freeze({id:'paper-mark',label:'Paper arrow',supports:'path',detail:'A drawn arrow suggests a path, but cannot prove access.'}),
 Object.freeze({id:'paper-seat',label:'Paper seat',supports:'rest',detail:'A movable paper seat suggests a resting idea, not permission.'}),
 Object.freeze({id:'paper-question',label:'Question card',supports:'unknown',detail:'We do not know who uses this place.'})
]);
const ids=new Set(CARDS.map(c=>c.id));
const targets=new Set(['path','rest']);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function replayEvidence(history=[]){
 if(!Array.isArray(history)||history.length>16)return null;
 let picked=null,model=null,checked=false,tries=0;
 for(const a of history){
  if(!a||Array.isArray(a)||typeof a!=='object')return null;
  if(a.type==='pick'){
   if(!same(Object.keys(a).sort(),['card','type'])||!ids.has(a.card))return null;
   picked=a.card;model=null;checked=false;
  }else if(a.type==='model'){
   if(!same(Object.keys(a).sort(),['target','type'])||!targets.has(a.target)||!picked)return null;
   model=a.target;checked=false;
  }else if(a.type==='test'){
   if(!same(Object.keys(a),['type'])||!picked||!model||checked)return null;
   checked=true;tries++;
  }else return null;
 }
 const card=CARDS.find(c=>c.id===picked);
 const fits=checked&&card?.supports===model;
 const feedback=!picked?'Milo: “Pick a paper clue.”':!model?'Nia: “What could this clue help us try?”':
 !checked?'Nia: “Test your idea. What can we really say?”':
 fits?'Nia: “This is a useful PAPER idea. Real access is still unknown.”':
 'Nia: “Not yet. Look again and change your model.”';
 return {picked,model,checked,fits,tries,feedback,
  visibleModel:fits?{clue:card.label,idea:model}:null,
  chronicle:fits?'PAPER NOTE — Milo tested '+card.label+' for a '+model+
   ' model. This is a reversible idea, not verified history, access or a real change.':null,
  paperOnly:true,sourceApproved:false,realAccessApproved:false,
  commonRevealed:false,canonicalEvents:[],unlocks:[],persistentSave:false};
}
export function dispatchEvidence(history,action){
 if(!Array.isArray(history)||history.length>=16)return history;
 const next=[...history,action];
 return replayEvidence(next)?next:history;
}
