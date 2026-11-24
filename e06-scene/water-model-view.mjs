// Read-only visual projection of completed E06 model runs.
// It accepts reducer snapshots only; setup changes alone cannot create evidence.
import {simulate} from '../engine/s01e06-authoring-prototype.mjs';

function isRunSnapshot(run){
 if(!run||typeof run!=='object'||Array.isArray(run))return false;
 const expected=simulate(run.weather,run.channel);
 if(!expected)return false;
 const keys=Object.keys(expected);
 return Object.keys(run).length===keys.length&&
  keys.every(key=>Object.hasOwn(run,key)&&run[key]===expected[key]);
}

function project(run,index){
 return {index,weather:run.weather,channel:run.channel,
  catchment:run.catchment,bypass:run.bypass,
  visualState:run.weather==='dry'?'dry':'rain-'+run.channel};
}

/** Derive every visible flow, count and pair from the reducer's completed run history. */
export function waterModelEvidence(runs){
 if(!Array.isArray(runs)||runs.some(run=>!isRunSnapshot(run)))return null;
 const history=runs.map((run,index)=>project(run,index+1));
 const open=history.filter(run=>run.weather==='rain'&&run.channel==='open').at(-1);
 const blocked=history.filter(run=>run.weather==='rain'&&run.channel==='blocked').at(-1);
 const comparison=open&&blocked?[open,blocked].sort((a,b)=>a.index-b.index):null;
 return {last:history.at(-1)||null,history,
  comparison:comparison?{weather:'rain',variable:'channel',before:comparison[0],after:comparison[1]}:null};
}
