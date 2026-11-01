// E11 child-selected next step after strictly earned PAPER return/reflection.
// A proposed check is not testimony, a site visit, permission or an unlock.
import {paperReflectionWorld} from './reflection-world.mjs';

export const FOLLOW_UP_ACTIONS=Object.freeze([
 Object.freeze({id:'ask',label:'Ask the responsible person later'}),
 Object.freeze({id:'permission',label:'Request permission before changing anything'}),
 Object.freeze({id:'survey',label:'Arrange an authorized access check later'})
]);
const questions=Object.freeze({
 station:Object.freeze({action:'ask',reason:'Ask who manages the real Map Room; a model table is not a real change.'}),
 garden:Object.freeze({action:'ask',reason:'Ask who cares for the real garden; a PAPER sprout is not real growth.'}),
 planting:Object.freeze({action:'permission',reason:'Request the site owner’s approval before planting or moving soil.'}),
 route:Object.freeze({action:'survey',reason:'Arrange a permitted accessibility and route inspection; a PAPER walk is not proof.'})
});

export function paperReflectionFollowUp(snapshot,steps=[],upstream=null,placements={},
 questionId=null,actionId=null){
 const world=paperReflectionWorld(snapshot,steps,upstream,placements);
 if(!world)return null;
 const unknowns=world.now.filter(note=>note.shelf==='check').map(note=>({
  id:note.id,label:note.label
 }));
 if(questionId!==null&&!unknowns.some(q=>q.id===questionId))return null;
 if(actionId!==null&&!FOLLOW_UP_ACTIONS.some(a=>a.id===actionId))return null;
 if(actionId!==null&&questionId===null)return null;
 const matched=questionId!==null&&actionId!==null&&questions[questionId].action===actionId;
 const chosen=unknowns.find(q=>q.id===questionId);
 const action=FOLLOW_UP_ACTIONS.find(a=>a.id===actionId);
 return {
  unknowns,actions:FOLLOW_UP_ACTIONS,questionId,actionId,matched,
  feedback:actionId===null?
   'Milo: "Choose a question, then plan a safe future check."':
   matched?'Nia: "Good plan. We have NOT done this check yet." '+questions[questionId].reason:
   'Finn: "That may help another question. Try a check that fits this one."',
  diaryLine:matched?'PAPER NEXT STEP — NOT DONE: '+chosen.label+
   ' → '+action.label+'. '+questions[questionId].reason:null,
  realWorldFactsVerified:0,actualCheckPerformed:false,permissionApproved:false,
  realRouteOpen:false,canonicalEvents:[],unlocks:[],seasonComplete:false
 };
}
