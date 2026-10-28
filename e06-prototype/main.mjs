// Isolated E06 authoring lab: never import production progress or write storage.
import {CURRENT_ANCHORS,LOWER_ANCHORS,CURRENT_OBSERVATIONS,LOWER_OBSERVATIONS,
  SITES,fresh,dispatch,previewProjection,siteEffect} from '../engine/s01e06-authoring-prototype.mjs';
let state=fresh();
const $=id=>document.getElementById(id);
const names={'present-bed':'Healthy beds','slope':'Higher slope','shared-path':'Garden path',
  'model-tray':'Rain model tray','runoff-trace':'Water trace','public-path':'Shared path',
  'runoff-channel':'Water route','footpath':'Footpath','raised-pocket':'Raised pocket'};
const positions={
  current:{'present-bed':[22,25],slope:[69,30],'shared-path':[45,84],'model-tray':[83,58]},
  lower:{'runoff-trace':[16,38],'public-path':[57,79],
    'runoff-channel':[26,58],footpath:[62,62],'raised-pocket':[83,26]}
};
function button(host,text,action,disabled=false,pressed=null){
  const b=document.createElement('button');b.textContent=text;b.disabled=disabled;
  if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));
  b.addEventListener('click',()=>{state=dispatch(state,action);render();});
  host.append(b);
  return b;
}
function drawWorld(){
  const lower=state.phase!=='current';
  const key=lower?'lower':'current';
  const host=$('scene');host.className='scene '+key;host.replaceChildren();
  host.setAttribute('aria-label',lower?'Lower Garden: walk Milo to water, path and trial sites':
    'Current Garden: walk Milo to healthy beds, slope, path and rain model');
  const decor=document.createElement('div');decor.className=lower?'runoff':'beds';host.append(decor);
  const path=document.createElement('div');path.className='path';host.append(path);
  if(lower){
    const pocket=document.createElement('div');
    pocket.className='pocket'+(state.lowerPreviewStarted?' planted':'');
    pocket.textContent=state.lowerPreviewStarted?'Small trial pocket':'Possible pocket';
    host.append(pocket);
  }
  const label=document.createElement('span');label.className='world-label';
  label.textContent=lower?'LOWER GARDEN · SYNTHETIC':'CURRENT GARDEN · SYNTHETIC';
  host.append(label);
  const anchors=lower?LOWER_ANCHORS:CURRENT_ANCHORS;
  for(const id of anchors){
    const b=document.createElement('button');
    b.className='anchor'+(state.location===id?' active':'');
    b.textContent=names[id];
    b.style.left=positions[key][id][0]+'%';b.style.top=positions[key][id][1]+'%';
    b.setAttribute('aria-label','Walk Milo to '+names[id]);
    b.disabled=state.phase==='done'||state.location===id;
    b.addEventListener('click',()=>{state=dispatch(state,{type:'walk-to',target:id});render();});
    host.append(b);
  }
  const actor=document.createElement('div');actor.className='milo';
  actor.textContent='Milo';
  actor.style.left=positions[key][state.location][0]+'%';
  actor.style.top=(positions[key][state.location][1]-4)+'%';
  host.append(actor);
  if(lower&&state.markerSite){
    const site=SITES[state.markerSite];
    const mark=document.createElement('div');
    mark.className='anchor active';
    mark.textContent=state.lowerPreviewStarted?'Planted (preview)':'Trial marker';
    mark.style.left=positions.lower[state.markerSite][0]+'%';
    mark.style.top=(positions.lower[state.markerSite][1]+14)+'%';
    mark.style.pointerEvents='none';
    mark.setAttribute('aria-hidden','true');
    host.append(mark);
  }
}
function drawObservations(){
  const lower=state.phase!=='current';
  $('scene-title').textContent=lower?'Lower Garden — water and access':'Current Garden — healthy beds and slope';
  $('guide').textContent=lower?'Walk Milo to the water trace and path. Then try a small planting marker.':
    'Walk Milo to the beds, slope or path. Inspect at least two before the rain tray.';
  const host=$('observe-controls');host.replaceChildren();
  const list=lower?LOWER_OBSERVATIONS:CURRENT_OBSERVATIONS;
  const observed=lower?state.lowerObserved:state.currentObserved;
  for(const id of list){
    button(host,'Look: '+names[id],{type:'inspect',id},
      state.phase==='done'||state.location!==id||observed.includes(id));
  }
  $('observations').textContent='Observed here: '+(observed.map(x=>names[x]).join(', ')||'nothing yet')+
    '. Walking is not the same as inspecting. '+(lower?'Both constraints matter.':'The garden is healthy now; history is still unknown.');
}
function drawModel(){
  const host=$('model-controls');host.replaceChildren();
  const current=state.phase==='current';
  const ready=current&&state.currentObserved.length>=2;
  button(host,'Dry',{type:'set-weather',weather:'dry'},!ready||state.weather==='dry',state.weather==='dry');
  button(host,'Rain',{type:'set-weather',weather:'rain'},!ready||state.weather==='rain',state.weather==='rain');
  button(host,'Channel open',{type:'set-channel',channel:'open'},!ready||state.channel==='open',state.channel==='open');
  button(host,'Channel blocked',{type:'set-channel',channel:'blocked'},!ready||state.channel==='blocked',state.channel==='blocked');
  const already=state.modelRuns.some(r=>r.weather===state.weather&&r.channel===state.channel);
  button(host,'Run this model',{type:'run-model'},!ready||state.location!=='model-tray'||already||state.modelRuns.length>=4);
  const evidence=state.modelRuns;
  const has=(w,c)=>evidence.some(r=>r.weather===w&&(c===null||r.channel===c));
  button(host,'Compare model results',{type:'compare-model'},
    !current||state.modelCompared||!has('dry',null)||!has('rain','open')||!has('rain','blocked'));
  button(host,'Walk to Lower Garden',{type:'visit-lower'},!current||!state.modelCompared);
  $('model-result').textContent='Weather: '+state.weather+'. Channel: '+state.channel+
    '. Model runs: '+evidence.length+'. '+(state.modelCompared?'Compared: water CAN move downhill in this MODEL; historical cause unknown.':
      'To compare, observe dry, rainy/open and rainy/blocked model runs. No need to fail first.');
  const meters=$('meters');meters.replaceChildren();
  const last=evidence.at(-1);
  if(last){
    for(const [label,value] of [['Low catchment',last.catchment],['Bypass',last.bypass]]){
      const line=document.createElement('div');line.className='meter';
      const title=document.createElement('span');title.textContent=label+': '+value+'/3';
      const track=document.createElement('div');track.className='track';
      const fill=document.createElement('div');fill.className='fill';fill.style.width=value/3*100+'%';
      track.append(fill);line.append(title,track);meters.append(line);
    }
  }
}
function drawPlant(){
  const host=$('plant-controls');host.replaceChildren();
  const lower=state.phase==='lower';
  for(const site of Object.keys(SITES)){
    button(host,'Try marker: '+names[site],{type:'move-marker',site},
      !lower||state.lowerObserved.length<2||state.location!==site||state.markerSite===site);
  }
  button(host,'Inspect marker result',{type:'inspect-result'},!lower||!state.markerSite||state.markerInspected);
  button(host,'Confirm small trial (preview)',{type:'confirm-small-trial'},
    !lower||!state.markerInspected||!siteEffect(state.markerSite)?.provisional);
  const p=previewProjection(state);
  $('plant-result').textContent=(state.markerSite?'Marker: '+names[state.markerSite]+'. ':'No marker yet. ')+
    (p.placement?('Wet route: '+(p.placement.wet?'yes':'no')+
    '; path blocked: '+(p.placement.blocksPath?'yes':'no')+'. '):'')+
    (state.lowerPreviewStarted?'Small pocket shown ONLY in this preview.':'No planting confirmed.')+
    ' Real permission and care are not approved.';
}
function drawChronicle(){
  const p=previewProjection(state);
  $('chronicle').textContent='OBSERVED (now): '+(state.currentObserved.map(x=>names[x]).join(', ')||'none')+
    '. SIMULATED (not history): '+state.modelRuns.map(r=>r.weather+'/'+r.channel+
      ' catchment '+r.catchment).join('; ')+
    '. STILL UNKNOWN: Why did the real garden move?'+
    (state.lowerPreviewStarted?' SMALL TRIAL: preview only; the present garden stays.':'')+
    ' Canonical events: 0; unlocks: 0.';
  $('parent-cue').hidden=!state.modelCompared;
  $('guide').setAttribute('aria-live','polite');
  $('scene').dataset.scene=p.scene;
}
function render(){
  drawWorld();drawObservations();drawModel();drawPlant();drawChronicle();
}
$('restart').addEventListener('click',()=>{state=fresh();render();});
render();
