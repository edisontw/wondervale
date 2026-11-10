// E11 optional child-controlled PAPER table retest; no canonical room alteration.
import {paperReturnRoute} from './return-route.mjs';
export const TABLE_SPOTS=Object.freeze(['across-walkway','near-wall']);
export function paperTableRetest(e11,steps,upstream,history=[]){
 const route=paperReturnRoute(e11,steps,upstream);
 if(!route||route.at!=='map_room'||!route.stationEarned||
  !Array.isArray(history)||history.length>12)return null;
 let spot='across-walkway',tested=false,checked=false;
 for(const action of history){
  if(!action||typeof action!=='object'||Array.isArray(action)||
   Object.keys(action).some(k=>!['type','spot'].includes(k)))return null;
  if(action.type==='place'&&TABLE_SPOTS.includes(action.spot)&&!tested){
   spot=action.spot;
  }else if(action.type==='test'&&Object.keys(action).length===1&&!tested){
   tested=true;checked=spot==='near-wall';
  }else if(action.type==='revise'&&Object.keys(action).length===1&&tested){
   tested=false;checked=false;
  }else return null;
 }
 const feedback=!tested?'Milo: "Place the PAPER table, then walk the model path."':
  checked?'Nia: "The PAPER walkway stays clear. We can record this model idea."':
  'Nia: "The PAPER table blocks our model path. Try moving it by the wall."';
 return {spot,tested,checked,feedback,
  chronicle:checked?'PAPER MODEL ONLY: Milo retested a clear Map Room walkway; no real room changed.':
   'PAPER MODEL PENDING: no new room change recorded.',
  canonicalEvents:[],unlocks:[],rights:[],realAccessApproved:false,
  historicHillClosed:true,commonRevealed:false,seasonComplete:false};
}
export function dispatchTableRetest(e11,steps,upstream,history,action){
 const next=[...history,action];
 return paperTableRetest(e11,steps,upstream,next)?next:history;
}
