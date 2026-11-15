// Independent reversible E11 PAPER negotiation. No canonical state or persistence.
export const OPTIONS=['reading','making','shared'];
export const fresh=()=>({history:[],choice:null,checks:[],feedback:'Milo can try a paper space.'});
export function replay(events){
 if(!Array.isArray(events)||events.length>30)return null;
 let s=fresh();
 for(const e of events){
  if(!e||typeof e!=='object'||Object.keys(e).sort().join(',')!=='type,value')return null;
  if(e.type==='place'){
   if(!OPTIONS.includes(e.value))return null;
   s={...s,choice:e.value,checks:[],feedback:'Finn: Let us try it! Nia: Check both needs.'};
  }else if(e.type==='check'){
   if(!s.choice||!['reader','maker'].includes(e.value)||s.checks.includes(e.value))return null;
   s={...s,checks:[...s.checks,e.value],feedback:e.value==='reader'?'Nia: Can the reader rest here?':'Finn: Can the maker work here?'};
  }else return null;
  s.history=[...s.history,{type:e.type,value:e.value}];
 }
 return s;
}
export function apply(s,event){
 const next=replay([...s.history,event]);
 return next||s;
}
export function undo(s){return replay(s.history.slice(0,-1));}
export function result(s){
 const both=s.checks.length===2;
 return {both,fit:both&&s.choice==='shared',
  text:!both?'Try both PAPER visitors.':s.choice==='shared'?'Milo moved the paper pieces: both needs have a turn.':'One need is still missing. Move the paper piece and try again.'};
}
