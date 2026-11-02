// Strict E09 -> E10 child-checked PAPER question/trace, revisited in E11.
// No historical claim, real-world check, rights, identity or canonical event.
import {view as viewE10} from '../authoring-labs/unnamed-story-model.mjs';
import {questionSource,restoreTrial,viewTrial} from '../e10-scene/hill-question.mjs';

export const PAPER_FUTURE_STOPS=Object.freeze([
 {id:'ask_caretaker',label:'ask the responsible person about safe access'},
 {id:'source_desk',label:'request an attributed source about the distant mark'}
]);
const LABELS=Object.freeze({
 access:{question:'Is the CLOSED hill open to the public?',trace:'surface',
  traceLabel:'worn surface',anchorLabel:'stone edge',futureStop:'ask_caretaker'},
 identity:{question:'What does the distant mark mean?',trace:'holes',
  traceLabel:'mounting holes',anchorLabel:'notice wall',futureStop:'source_desk'}
});
export function paperHillTraceRevisit(e10,upstream,questionTrial){
 const source=questionSource(upstream?.e07,upstream?.e08,upstream?.e09);
 const trial=source&&restoreTrial(questionTrial,source,e10);
 const checked=trial&&viewTrial(trial,source,e10),v=e10&&viewE10(e10);
 if(!checked?.compared||!v?.finishedPaper||v.sourceApproved!==false||
    v.realAccessApproved!==false||v.upperHillClosed!==true||
    v.actualName!==null||v.e11Unlocked!==false)return null;
 const rule=LABELS[checked.question];
 if(!rule||checked.anchor!==source.questions[checked.question]?.anchor||
    !v.observations.some(x=>x.id===rule.trace))return null;
 return {question:checked.question,questionLabel:rule.question,
  traceLabel:rule.traceLabel,anchorLabel:rule.anchorLabel,
  futureStop:rule.futureStop,firstMarker:checked.anchor,
  chroniclePreview:'PAPER E10→E11: Milo checked a fictional '+rule.traceLabel+
   ', then marked a future '+(checked.question==='access'?'access question':'source question')+
   '. NOT DONE; no real access, identity, history or permission.',
  upperHillClosed:true,realCheckDone:false,canonicalEvents:[],unlocks:[],rights:[]};
}
