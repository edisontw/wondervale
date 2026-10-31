// E11 child-authored PAPER follow-up plans; no actual inspection or consent.
import {inspectPaperRole} from './role-inspection.mjs';

export const PAPER_QUESTIONS=Object.freeze([
 Object.freeze({id:'people',label:'Who needs this space?',check:'ask'}),
 Object.freeze({id:'access',label:'Can everyone enter safely?',check:'survey'}),
 Object.freeze({id:'rights',label:'Who can approve a change?',check:'permission'})
]);
export const PAPER_CHECKS=Object.freeze([
 Object.freeze({id:'ask',label:'Ask actual users (later)'}),
 Object.freeze({id:'survey',label:'Inspect the real route with permission (later)'}),
 Object.freeze({id:'permission',label:'Request site-owner permission (later)'})
]);
const notes=Object.freeze({
 people:'Ask actual users about both needs; the two PAPER roles are not testimony.',
 access:'Arrange an authorized route and accessibility check; the grid is not terrain.',
 rights:'Find the responsible site owner and request permission before any change.'
});
export function draftPaperVerification(snapshot,focus,cell,questionId,checkId){
 const inspection=inspectPaperRole(snapshot,focus,cell);
 if(!inspection?.found)return null;
 const question=PAPER_QUESTIONS.find(q=>q.id===questionId);
 const check=PAPER_CHECKS.find(c=>c.id===checkId);
 if(!question||!check)return null;
 const matched=question.check===check.id;
 return {
  questionId,checkId,focus,matched,
  feedback:matched?
   'Milo: "This is a next step, not proof." '+notes[questionId]:
   'Milo: "That check might help another question. Let me try a different station."',
  draft:matched?question.label+' — '+check.label+' — NOT CHECKED':null,
  source:'REPLAYED FICTIONAL PAPER TRIAL',
  actualEvidence:false,actualConsultation:false,siteSurveyCompleted:false,
  permissionApproved:false,canonicalEvents:[],unlocks:[],seasonComplete:false
 };
}
