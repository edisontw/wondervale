// E11 PAPER role conversation is derived from strict child trials, not testimony.
import {paperRevisit} from './revisit-model.mjs';

export function inspectPaperRole(snapshot,focus,cell){
 const model=paperRevisit(snapshot,focus);
 if(!model||typeof cell!=='string'||!/^[0-2],[0-3]$/.test(cell))return null;
 const first=model.first,now=model.now;
 const piece=focus==='quiet_reader'?'quiet':'activity';
 const target=first.layout[piece][0];
 const found=cell===target;
 const role=focus==='quiet_reader'?'quiet reader':'activity group';
 const status=t=>t.tests[focus].passed?'PASS':'RETRY';
 const response=found?
  'Milo: "I found the '+piece+' piece." FIRST '+role+': '+status(first)+
  ' — '+first.tests[focus].reason+' NOW: '+status(now)+
  ' — '+now.tests[focus].reason:
  'Milo: "That is not the '+piece+' piece. I can look again."';
 return {
  focus,cell,found,target:target||null,response,
  finn:found?'Finn: "My first plan was quick. I did not test every need."':null,
  nia:found?'Nia: "The model changed. Real people have not told us what they need."':null,
  nextQuestion:found?
   'Milo: "Who should we ask, and how can we check safe access and permission?"':null,
  simulatedOnly:true,actualConsultation:false,permissionApproved:false,
  canonicalEvents:[],unlocks:[],seasonComplete:false
 };
}
