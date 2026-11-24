// Reversible child-operated PAPER atlas repair. A visual model claim is not a real route.
import {paperWorldAtlas,PAPER_ATLAS_PLACES} from './world-atlas.mjs';
const ids=new Set(PAPER_ATLAS_PLACES.map(p=>p.id));
const choices=new Set(['first','now']);
export function paperAtlasRepair(e11,walk,upstream,shared,e10,useTrial,history=[]){
 const atlas=paperWorldAtlas(e11,walk,upstream,shared,e10,useTrial);
 if(!atlas||!Array.isArray(history)||history.length>24)return null;
 let place=null,phase=null,checked=false,accepted=false;
 for(const a of history){
  if(!a||typeof a!=='object'||Object.keys(a).sort().join(',')!==
    (a.type==='place'?'phase,place,type':a.type==='test'?'type':'')||
    (a.type==='place'&&(!ids.has(a.place)||!choices.has(a.phase)||checked))||
    (a.type==='test'&&(!place||checked)))return null;
  if(a.type==='place'){place=a.place;phase=a.phase;}
  else if(a.type==='test'){checked=true;accepted=phase==='now';}
  else return null;
 }
 const first=atlas.boards.first.find(x=>x.id===place);
 const now=atlas.boards.now.find(x=>x.id===place);
 return {place,phase,checked,accepted,
  first,now,places:PAPER_ATLAS_PLACES,
  feedback:!place?'Milo: "Choose a PAPER place and a model stage."':
   !checked?'Nia: "Test the model claim. Does it show our latest child revision?"':
   accepted?'Nia: "Yes. NOW shows the revised PAPER model. We can change our notebook."':
   'Finn: "That is the FIRST model. Try NOW to show what we changed."',
  visibleClaim:checked&&accepted?now:null,
  chronicle:checked&&accepted?'PAPER ATLAS REPAIR — '+now.label+
   ': Milo tested and replaced the FIRST model claim with the NOW child-replayed model. No actual place, right or route changed.':null,
  paperOnly:true,canonicalEvents:[],unlocks:[],persistentSave:false,realRouteOpen:false,
  commonRevealed:false};
}
export function dispatchAtlasRepair(e11,walk,upstream,shared,e10,useTrial,history,action){
 if(!Array.isArray(history)||history.length>=24||
    !action||typeof action!=='object'||Array.isArray(action)||
    !['place','test'].includes(action.type))return history;
 const next=[...history,action];
 return paperAtlasRepair(e11,walk,upstream,shared,e10,useTrial,next)?next:history;
}
