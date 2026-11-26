import {ALPHA_E05_E06_KEY,buildAlphaChronicle} from './alpha-chronicle.mjs';

const scenes=[
  {slot:1,episode:'E01',title:'The Map Behind the Board',url:'../',frameKey:'e01'},
  {slot:2,episode:'E02',title:'The Bridge That Stops',url:'../e02/',frameKey:'e02',blockedHeading:'Riverside is next'},
  {slot:3,episode:'E03',title:'Three Deliveries, One Wrong Turn',url:'../e03/',frameKey:'e03',blockedHeading:'Market Lane comes after Riverside'},
  {slot:4,episode:'E04',title:'Everyone Remembers It Differently',url:'./e04-preview.html',frameKey:'e04',blockedHeading:'Episode 04 is not available yet'},
  {slot:5,episode:'E05',title:'The Station with No Trains',url:'../e05-scene/',frameKey:'e05'},
  {slot:6,episode:'E06',title:'Current Garden',url:'../e06-scene/',frameKey:'e06',hint:'Scene 06 · Current Garden'},
  {slot:7,episode:'E06',title:'Lower Garden',url:'../e06-scene/',frameKey:'e06',hint:'Scene 07 · Lower Garden. Continue in the E06 scene using its “Walk to Lower Garden PAPER model” action.'},
  {slot:8,episode:'E07',title:'Finn’s Perfect Shortcut',url:'../e07-scene/',frameKey:'e07'},
  {slot:9,episode:'E08',title:'When the Steps Light Up',url:'../e08-scene/',frameKey:'e08'},
  {slot:10,episode:'E09',title:'The Closed Hill',url:'../e09-scene/',frameKey:'e09'},
  {slot:11,episode:'E10',title:'The Place with No Name',url:'../e10-scene/',frameKey:'e10'},
  {slot:12,episode:'E11',title:'A New Line on the Map',url:'../e11-scene/',frameKey:'e11'}
];
const $=id=>document.getElementById(id);
const stepNav=$('scene-steps');
const frameHost=$('scene-frame');
const frames=new Map();
let current=0;
const opened=new Set();

for(const scene of scenes){
  const button=document.createElement('button');
  button.type='button';button.className='scene-step';button.textContent=String(scene.slot).padStart(2,'0');
  button.setAttribute('aria-label',`Open scene ${scene.slot}: ${scene.episode} ${scene.title}`);
  button.dataset.slot=String(scene.slot);
  button.addEventListener('click',()=>show(scene.slot-1));
  stepNav.append(button);
}

function frameFor(scene,initialUrl=null){
  let frame=frames.get(scene.frameKey);
  if(frame)return frame;
  frame=document.createElement('iframe');
  frame.title=`Scene ${scene.slot}: ${scene.episode} ${scene.title}`;
  frame.loading='eager';
  frame.referrerPolicy='no-referrer';
  frame.dataset.frameKey=scene.frameKey;
  frame.addEventListener('load',()=>{
    try{if(frame.contentWindow.location.href==='about:blank')return;}catch{return;}
    frame.dataset.loaded='true';
    frame.dataset.loadCount=String(Number(frame.dataset.loadCount||0)+1);
    bindSceneLinks(frame);
    observeE11Review(frame);
    refreshAlphaChronicle();
  });
  frame.hidden=true;
  frameHost.append(frame);
  frames.set(scene.frameKey,frame);
  const href=initialUrl||entryUrlFor(scene);
  frame.src=href;
  return frame;
}

function entryUrlFor(scene){return new URL(scene.url,location.href).href;}

function sceneAt(href){
  const url=new URL(href,location.href);
  if(url.origin!==location.origin)return null;
  const index=scenes.findIndex(scene=>new URL(scene.url,location.href).pathname===url.pathname);
  return index<0?null:{index,scene:scenes[index],url};
}

function bindSceneLinks(frame){
  try{
    const doc=frame.contentDocument;
    if(!doc?.documentElement||doc.documentElement.dataset.alphaLinksBound==='true')return;
    doc.documentElement.dataset.alphaLinksBound='true';
    doc.addEventListener('click',event=>{
      if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      const target=event.target?.nodeType===1?event.target:event.target?.parentElement;
      const link=target?.closest?.('a[href]');
      if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
      const destination=sceneAt(link.href);
      if(!destination||destination.scene.frameKey===frame.dataset.frameKey)return;
      event.preventDefault();event.stopPropagation();
      if(frame.dataset.frameKey==='e05'&&destination.scene.frameKey==='e06'){
        try{localStorage.setItem(ALPHA_E05_E06_KEY,destination.url.hash);}catch{}
      }
      show(destination.index,destination.url.href);
    },true);
  }catch{}
}

function observeE11Review(frame){
  if(frame.dataset.alphaReviewObserved==='true')return;
  try{
    const doc=frame.contentDocument;
    const chronicle=doc?.getElementById('chronicle');
    if(!chronicle)return;
    frame.dataset.alphaReviewObserved='true';
    new MutationObserver(()=>refreshAlphaChronicle()).observe(chronicle,{childList:true,characterData:true,subtree:true});
  }catch{}
}

function refreshAlphaChronicle(){
  const panel=$('alpha-chronicle');
  if(scenes[current]?.frameKey!=='e11'){
    panel.hidden=true;
    return;
  }
  const frame=frames.get('e11');
  try{
    const doc=frame?.contentDocument;
    const hook=doc?.getElementById('hook');
    const text=doc?.getElementById('chronicle')?.textContent||'';
    const reviewed=!!hook&&!hook.hidden&&text.includes('model review recorded');
    const grid=doc?.querySelector('#grid');
    const placed=grid?
      grid.querySelectorAll('.cell.access').length+
      grid.querySelectorAll('.cell.quiet').length+
      grid.querySelectorAll('.cell.activity').length:null;
    const hash=frame.contentWindow.location.hash;
    const ledger=reviewed&&buildAlphaChronicle(localStorage,
      localStorage.getItem(ALPHA_E05_E06_KEY),hash,true,placed);
    panel.hidden=!ledger;
    if(!ledger)return;
    $('alpha-chronicle-source').textContent='E02/E03 prerequisites replay-checked for this local handoff; E04–E11 remain fictional PAPER and do not write Canon.';
    const list=$('alpha-chronicle-entries');
    list.replaceChildren();
    for(const entry of ledger.entries){
      const item=document.createElement('li');
      item.textContent=entry.scene+': '+entry.text;
      list.append(item);
    }
  }catch{panel.hidden=true;}
}

function loadEntry(frame,href){
  frame.dataset.loaded='false';
  const destination=new URL(href,location.href);
  try{
    const currentUrl=new URL(frame.contentWindow.location.href);
    if(currentUrl.origin===destination.origin&&currentUrl.pathname===destination.pathname&&
      currentUrl.search===destination.search){
      frame.contentWindow.location.hash=destination.hash;
      frame.contentWindow.location.reload();
      return;
    }
  }catch{}
  frame.src=href;
}

function isStillBlocked(scene,frame){
  if(!scene.blockedHeading||frame.dataset.loaded!=='true')return false;
  try{return [...frame.contentDocument.querySelectorAll('h1,h2')]
    .some(heading=>heading.textContent.trim()===scene.blockedHeading);}
  catch{return false;}
}

function show(index,entryUrl=null){
  current=Math.max(0,Math.min(scenes.length-1,index));
  const scene=scenes[current];
  opened.add(current);
  const existing=frames.get(scene.frameKey);
  const revisitBlocked=Boolean(existing?.hidden&&isStillBlocked(scene,existing));
  const frame=frameFor(scene,entryUrl);
  if(entryUrl&&existing){
    loadEntry(frame,entryUrl);
  }else if(revisitBlocked){
    loadEntry(frame,entryUrlFor(scene));
  }
  for(const other of frames.values())other.hidden=other!==frame;
  frame.title=`Scene ${scene.slot}: ${scene.episode} ${scene.title}`;
  $('scene-position').textContent=`Scene ${scene.slot} of ${scenes.length}`;
  $('scene-episode').textContent=scene.episode;
  $('scene-title').textContent=scene.title;
  $('scene-opened').textContent=`Opened in this session: ${opened.size} of ${scenes.length}`;
  $('scene-handoff-note').textContent=scene.hint||
    'Use a scene’s own PAPER handoff when available to carry its replay-checked actions forward. These step controls only switch the preview.';
  $('previous-scene').disabled=current===0;
  $('next-scene').disabled=current===scenes.length-1;
  $('next-scene').textContent=current===scenes.length-1?'End of season preview':'Next scene';
  for(const button of stepNav.querySelectorAll('button')){
    const slot=Number(button.dataset.slot);
    if(slot===scene.slot)button.setAttribute('aria-current','step');
    else button.removeAttribute('aria-current');
    button.dataset.opened=String(opened.has(slot-1));
  }
  if(scene.frameKey==='e05'){
    frame.contentWindow.postMessage({type:'wondervale-alpha-activate'},location.origin);
  }
  refreshAlphaChronicle();
  document.title=`Wondervale · ${scene.episode} ${scene.title} · Season 1 Alpha`;
}

$('previous-scene').addEventListener('click',()=>show(current-1));
$('next-scene').addEventListener('click',()=>show(current+1));
window.addEventListener('storage',refreshAlphaChronicle);
show(0);
