// Isolated evidence-sorting exercise, NOT a historical source, episode completion or Chronicle.
export const TYPES=Object.freeze(['MODEL','MAYBE','UNKNOWN']);
const scene=(id,title,hook,cards)=>Object.freeze({id,title,hook,cards:Object.freeze(cards.map(([key,type,text,why])=>Object.freeze({id:id+'-'+key,type,text,why})))});
export const WORKSHOPS=Object.freeze([
 scene('e05','Old Station','What would an actual station record tell us?',[
  ['a','MODEL','The copied marks can line up in the station paper model.','A replica alignment is a model observation, not proof of the old route.'],
  ['b','MAYBE','Perhaps the marks once pointed to a useful room.','A possible past use is an explanation to investigate, not a verified event.'],
  ['c','UNKNOWN','Who can verify the real station records and access?','Real records and permission are still missing.']]),
 scene('e06-current','Current Garden','How might we test a safe lower pocket?',[
  ['a','MODEL','The dry and rain models can send water in different directions.','This is what a simulated channel shows, not actual terrain history.'],
  ['b','MAYBE','Maybe water helped change where the garden grew.','A causal history needs independent evidence.'],
  ['c','UNKNOWN','What do real terrain and garden records show?','Neither the model nor a guess proves the past.']]),
 scene('e06-lower','Lower Garden','What would a caretaker need before planting?',[
  ['a','MODEL','The lower paper pocket can conflict with a wet channel.','The modeled placement can be checked and revised.'],
  ['b','MAYBE','Perhaps a small planting pocket could work here.','This remains a proposal, not a planted real site.'],
  ['c','UNKNOWN','Who permits planting and cares for it later?','Permission, stewardship and actual runoff are unresolved.']]),
 scene('e07','Finn\'s Shortcut','Whose route should we test next?',[
  ['a','MODEL','The short connector can block a simulated resident or water path.','The paper model exposes a tradeoff.'],
  ['b','MAYBE','A revised connector might serve more people.','A design hypothesis still needs real-world checks.'],
  ['c','UNKNOWN','Is the real passage safe and permitted?','The model does not grant access or certify clearance.']]),
 scene('e08','Lantern Steps','What might another viewpoint reveal?',[
  ['a','MODEL','Two model viewpoints can show different light patterns.','The geometric observation is not a historical date.'],
  ['b','MAYBE','The old lights may have guided travelers.','A plausible purpose is not established by the simulation.'],
  ['c','UNKNOWN','What source could date the old marker?','No genuine dated source has been approved.']]),
 scene('e09','Closed Hill','Can we observe without crossing the fence?',[
  ['a','MODEL','A marked model route can avoid the closed hill edge.','A graph test is not a certified public path.'],
  ['b','MAYBE','The distant symbol might resemble the first map clue.','Shape resemblance is tentative and does not name the place.'],
  ['c','UNKNOWN','Which real safe viewpoint is publicly accessible?','Real route permission and terrain safety remain unverified.']]),
 scene('e10','Place with No Name','What would both residents need from a shared place?',[
  ['a','MODEL','The courtyard model can compare two undated traces and simulated needs.','These are authoring fixtures, not testimony.'],
  ['b','MAYBE','The traces might suggest an earlier shared use.','A proposed interpretation requires attributed sources.'],
  ['c','UNKNOWN','What genuine source identifies the Common and its users?','The Common name is reserved for E10 and has no approved source here.']]),
 scene('e11','A New Line on the Map','What should change before any real opening?',[
  ['a','MODEL','A paper layout can be revised after two simulated user trials.','This proves only that the model can be tested.'],
  ['b','MAYBE','A different present-day loop might serve more people.','A design proposal cannot establish real safe access.'],
  ['c','UNKNOWN','Who approves the site, current safe loop and final design?','Rights, evidence and family acceptance are still missing.']])
]);
export function getWorkshop(id){return WORKSHOPS.find(s=>s.id===id)??null;}
export function fresh(id='e05'){if(!getWorkshop(id))throw Error('Unknown workshop');return {sceneId:id,selected:null,placements:{},feedback:'Choose a card. Then decide: MODEL, MAYBE, or UNKNOWN.'};}
export function selectCard(state,id){
 const scene=getWorkshop(state.sceneId);
 if(!scene?.cards.some(c=>c.id===id))return state;
 return {...state,selected:id,feedback:'Read the card. What kind of evidence is it?'};
}
export function placeCard(state,type){
 if(!TYPES.includes(type)||!state.selected)return state;
 const card=getWorkshop(state.sceneId)?.cards.find(c=>c.id===state.selected);
 if(!card)return state;
 if(card.type!==type)return {...state,feedback:'Try another group. '+card.why};
 return {...state,selected:null,placements:{...state.placements,[card.id]:type},
  feedback:'Placed in '+type+'. '+card.why+' You can choose this card again to revise.'};
}
export function review(state){
 const scene=getWorkshop(state.sceneId);
 const placed=scene.cards.filter(c=>state.placements[c.id]===c.type).length;
 return {placed,total:scene.cards.length,complete:placed===scene.cards.length,
  message:placed===scene.cards.length
   ?'Evidence practice complete — NOT a real source, Chronicle event or episode unlock. '+scene.hook
   :'Compare what a model shows, what we think, and what still needs proof.'};
}
