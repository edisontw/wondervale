// E05->E11 fictional evidence-to-layout trial; authoring-only, never Canon.
import {replay as replayE05,view as viewE05} from '../e05-scene/scene-model.mjs';
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function earnedE05(history){
 const s=replayE05(history);
 const v=s&&viewE05(s);
 return !!(v&&v.stage==='review'&&v.mapRoomPaperVisible&&v.e04CanonicalComplete===false&&v.productionEntryReady===false&&v.canonicalEvents.length===0&&v.rights.length===0);
}
export function replayLayout(source,events=[]){
 if(!earnedE05(source))throw Error('E05 PAPER source required');
 if(!Array.isArray(events)||events.length>24)throw Error('Invalid E11 history');
 let table='center',tested=false,attemptedBlocked=false;
 for(const e of events){
  if(!e||typeof e!=='object'||Array.isArray(e))throw Error('Invalid event');
  if(e.type==='place'&&same(Object.keys(e).sort(),['position','type'])&&['center','side'].includes(e.position)){
   if(tested&&table==='center')attemptedBlocked=true;
   table=e.position;tested=false;
  }else if(e.type==='test'&&same(Object.keys(e),['type'])&&!tested){
   tested=true;
  }else throw Error('Invalid event');
 }
 const clear=tested&&table==='side';
 return {table,tested,clear,attemptedBlocked,
  world:!tested?'Map Room layout not tested':clear?'PAPER walkway clear':'PAPER walkway blocked',
  feedback:!tested?'Nia: Look at the E05 paper room. Try the walkway.':clear?'Finn: Our model leaves room to walk.':'Finn: The table blocks the model path. Try the side.',
  chronicle:clear?'PAPER Chronicle: Milo tested and placed the model table beside the path.':null,
  canonicalEvents:[],rights:[],unlocks:[],northHillClosed:true,commonRevealed:false};
}
export function dispatchLayout(source,events,event){const next=[...events,event];replayLayout(source,next);return next;}
