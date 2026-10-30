// Visual paper atlas for the isolated E05–E11 retrospective. Never a production map.
// All pieces are abstract authoring markers; they do not assert terrain, rights or historical facts.
export const PAPER_PIECES=Object.freeze({
 station:{before:[['board','Marks',1,1,2],['block','Table',3,2,2]],after:[['board','Marks',1,1,2],['table','Map table',1,2,2],['path','Clear way',3,2,2]]},
 current:{before:[['garden','Healthy beds',1,1,2],['block','Channel?',3,2,2]],after:[['garden','Healthy beds',1,1,2],['water','Rain tray',3,1,2],['path','Open',3,2,2]]},
 lower:{before:[['water','Runoff',1,1,2],['block','Footpath',3,2,2]],after:[['water','Runoff',1,1,2],['seed','Paper seed',3,1,2],['path','Clear',3,2,2]]},
 connector:{before:[['block','Crossing',2,1,2],['water','Water',2,2,2]],after:[['path','Walker',1,1,2],['table','Connector',2,2,2],['water','Water',3,3,2]]},
 steps:{before:[['lamp-off','OFF',1,1,1],['lamp-off','OFF',4,1,1],['fence','Upper CLOSED',1,3,4]],after:[['lamp-on','ON',1,1,1],['lamp-on','ON',4,1,1],['path','2 views',2,2,2],['fence','Upper CLOSED',1,3,4]]},
 hill:{before:[['fence','CLOSED',1,1,4],['block','Gap',2,3,2]],after:[['fence','CLOSED',1,1,4],['path','Lower line',1,3,4]]},
 needs:{before:[['block','Overlap',2,2,2]],after:[['quiet','Quiet',1,1,2],['activity','Activity',3,3,2]]},
 layout:{before:[['block','Conflict',2,2,2]],after:[['quiet','Quiet',1,1,2],['activity','Activity',3,1,2],['path','Shared way',1,3,4]]}
});
export function visualTiles(projection){
 if(!projection||!Array.isArray(projection.progress)||!['before','now'].includes(projection.view))
   throw new TypeError('Expected a validated authoring paper projection');
 return projection.progress.map(item=>{
  if(!Object.hasOwn(PAPER_PIECES,item.id))throw new TypeError('Unknown paper place');
  const visible=item.available===true;
  const stage=visible&&item.done===true&&projection.view==='now'?'after':'before';
  return {
   id:item.id,label:item.label,visible,active:item.id===projection.place,
   stage:visible?stage:'locked',changed:item.done===true,
   // Return fresh piece objects, never mutable canonical progress or source claims.
   pieces:visible?PAPER_PIECES[item.id][stage].map(([kind,label,col,row,span])=>({kind,label,col,row,span})):[]
  };
 });
}
