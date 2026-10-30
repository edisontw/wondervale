// E06 paper-only presentation. No storage, canonical runtime, history sources or audio.
import {fresh,dispatch,can,view} from './current-garden-story-model.mjs';
let state=fresh();
const $=id=>document.getElementById(id);
const actionOf=b=>b.dataset.value?{type:b.dataset.action,value:b.dataset.value}:{type:b.dataset.action};
function render(){
 const v=view(state);
 $('speaker').textContent=v.speaker;
 $('line').textContent=v.line;
 $('phase').textContent='Paper stage: '+v.phase+' · Current Garden remains healthy';
 $('marker').textContent='Milo paper marker: '+v.milo.replaceAll('-',' ');
 $('observations').textContent='Observed here: '+(v.observed.length?v.observed.join(' + '):'nothing yet')+
  ' · My idea: '+(v.hypothesis||'not yet')+'. These are not historical causes.';
 $('tray').dataset.weather=v.weather;
 $('tray').dataset.channel=v.channel;
 $('weather').textContent=v.weather;
 $('channel').textContent=v.channel;
 $('catchment').textContent=v.lastRun?'model '+v.lastRun.catchment+'/3':'not tested';
 $('model').textContent='SYNTHETIC MODEL runs: '+v.runs.length+
  ' · '+v.runs.map(r=>r.weather+'/'+r.channel+' = low '+r.catchment+'/3').join('; ')+
  (v.modelCompared?' · Compared; historical cause still UNKNOWN.':' · Compare requires dry and both rain channel states.');
 $('parent').textContent=v.parentCue?'Optional parent cue: '+v.parentCue:'Parent: allow Milo to observe and predict first.';
 $('note').textContent=v.paperNote||'No paper note yet. Historical cause UNKNOWN; canonical events: 0; unlocks: 0.';
 for(const el of document.querySelectorAll('[data-place]')){
  el.dataset.active=String(el.dataset.place===v.milo);
 }
 for(const b of document.querySelectorAll('[data-action]')){
  b.disabled=!can(state,actionOf(b));
  if(['walk','guess','weather','channel','revise'].includes(b.dataset.action)){
   const selected=b.dataset.action==='walk'?v.milo:
    b.dataset.action==='guess'?v.hypothesis:
    b.dataset.action==='weather'?v.weather:
    b.dataset.action==='channel'?v.channel:v.revision;
   b.setAttribute('aria-pressed',String(selected===b.dataset.value));
  }
 }
}
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{
 state=dispatch(state,actionOf(b));render();
}));
$('restart').addEventListener('click',()=>{state=fresh();render();});
render();
