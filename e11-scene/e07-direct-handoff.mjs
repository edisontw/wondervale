// E07 -> E11 authoring-only transfer. URL data is untrusted; replay every event.
import {earnedTurnTaking} from './e07-earned-turn-taking.mjs';
const PREFIX='#e07-paper=',MAX_JSON=12000;
export function encodeE07Handoff(history){
 if(!earnedTurnTaking(history,[]))return '';
 const json=JSON.stringify(history);
 if(json.length>MAX_JSON||/[^\x00-\x7f]/.test(json))return '';
 return PREFIX+btoa(json).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
export function decodeE07Handoff(fragment){
 if(typeof fragment!=='string'||!fragment.startsWith(PREFIX))return null;
 const encoded=fragment.slice(PREFIX.length);
 if(!/^[A-Za-z0-9_-]+$/.test(encoded)||encoded.length>MAX_JSON*2)return null;
 try{
  const history=JSON.parse(atob(encoded.replace(/-/g,'+').replace(/_/g,'/')));
  return Array.isArray(history)&&JSON.stringify(history).length<=MAX_JSON&&earnedTurnTaking(history,[])?history:null;
 }catch{return null;}
}
