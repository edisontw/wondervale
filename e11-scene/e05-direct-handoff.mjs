// E05 child-earned PAPER Map Room -> existing E11 scene; no canonical unlock.
import {earnedE05} from './e05-earned-layout-trial.mjs';
const PREFIX='#e05-paper=',MAX=24000;
export function encodeE05Handoff(history){
 if(!earnedE05(history))return '';
 const json=JSON.stringify(history);
 if(json.length>MAX||/[^\x00-\x7f]/.test(json))return '';
 return PREFIX+btoa(json).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
export function decodeE05Handoff(fragment){
 if(typeof fragment!=='string'||!fragment.startsWith(PREFIX))return null;
 const token=fragment.slice(PREFIX.length);
 if(!/^[A-Za-z0-9_-]+$/.test(token)||token.length>MAX*2)return null;
 try{
  const json=atob(token.replace(/-/g,'+').replace(/_/g,'/'));
  if(json.length>MAX)return null;
  const events=JSON.parse(json);
  return earnedE05(events)?events:null;
 }catch{return null;}
}
