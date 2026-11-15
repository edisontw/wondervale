// Independent fictional PAPER visitor-use experiment. No rights, real users or Canon.
export const fresh=()=>({history:[],layout:null,visits:[],feedback:'Milo can place a paper plan.'});
export function replay(events){
 if(!Array.isArray(events)||events.length>24)return null;
 let s=fresh();
 for(const e of events){
  if(!e||typeof e!=='object'||Object.keys(e).sort().join(',')!=='type,value')return null;
  if(e.type==='layout'){
   if(!['quiet','work','turns'].includes(e.value))return null;
   s={...s,layout:e.value,visits:[],feedback:'Nia: Let us watch. Finn: Let us try!'};
  }else if(e.type==='visit'){
   if(!s.layout||!['reader','maker'].includes(e.value)||s.visits.includes(e.value))return null;
   s={...s,visits:[...s.visits,e.value],feedback:e.value==='reader'?'Nia: I can read here.':'Finn: I can make here.'};
  }else return null;
  s.history=[...s.history,{type:e.type,value:e.value}];
 }
 return s;
}
export function apply(s,e){return replay([...s.history,e])??s;}
export function undo(s){return replay(s.history.slice(0,-1));}
export function outcome(s){
 const both=s.visits.length===2;
 const fit=both&&s.layout==='turns';
 return {fit,text:!both?'Invite both PAPER visitors.':fit?'Both have a turn in this paper plan.':'The visitors need different turns. Move the paper plan and try again.'};
}
