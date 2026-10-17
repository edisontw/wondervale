import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {fresh,dispatch} from '../engine/s01e02.mjs';
const KEY='wondervale-s01e03-progress-v1',E02='wondervale-s01e02-progress-v1',E01='wondervale-progress-v1';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
let prior=fresh();
function e02(a){prior=dispatch(prior,a);while(prior.queue.length)prior=dispatch(prior,{type:'next'});}
for(const a of [{type:'begin'},{type:'go',to:'oldStones'},{type:'inspect',what:'stones'},{type:'close-detail'},{type:'go',to:'lookoutView'},{type:'inspect',what:'gap'},{type:'close-detail'},{type:'notebook'},{type:'fact',choice:'gap'},{type:'revision',choice:'A'},{type:'market'},{type:'chronicle'},{type:'finish'}])e02(a);
assert.equal(prior.phase,'completed');
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true}),report=[],errors=[];
const click=(p,a)=>p.locator(`[data-a="${a}"]`).click();
async function open(width=1366,height=900,authorized=true,reduced=true){const ctx=await browser.newContext({viewport:{width,height},hasTouch:width<900,isMobile:width<900,reducedMotion:reduced?'reduce':'no-preference'});const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/e03/');if(authorized){await p.evaluate(({prior,E02,E01})=>{localStorage.setItem(E02,JSON.stringify(prior));localStorage.setItem(E01,'{"sentinel":"E01 unchanged"}');},{prior,E02,E01});await p.reload();}return {ctx,p};}
async function drain(p){let n=0;while(await p.locator('[data-a="next"]').count()){await click(p,'next');assert.ok(++n<50);}return n;}
async function arrive(p,a='walk'){await click(p,a);await p.locator('[data-a="deliver"]').waitFor();}
async function carriedProp(p,kind){const prop=p.locator(`[data-load-visual="${kind}"]`);assert.equal(await prop.count(),1,`Milo carries ${kind} visual`);assert.equal(await prop.evaluate(el=>el.closest('[data-actor="MILO"]')!==null),true,`${kind} visual follows Milo`);const box=await prop.boundingBox();assert.ok(box&&box.width>=12&&box.height>=8,`${kind} visual has visible size`);}
async function bookPlacement(p,label){
 const m=await p.locator('[data-load-visual="books"]').evaluate(el=>{
  const a=el.closest('[data-actor="MILO"]').getBoundingClientRect(),b=el.getBoundingClientRect(),s=getComputedStyle(el);
  return {side:(b.left-a.left)/a.width,lower:(b.top-a.top)/a.height,size:b.width/a.width,pixels:b.width,background:s.backgroundColor,border:s.borderTopWidth};
 });
 assert.ok(m.side>=.60,label+' books leave Milo face/torso visible');
 assert.ok(m.lower>=.39,label+' books are at hand/waist height, not the face');
 assert.ok(m.size<=1.70,label+' books do not dominate Milo');
 assert.ok(m.pixels>=16,label+' the book bundle stays readable on small screens');
 assert.equal(m.background,'rgba(0, 0, 0, 0)',label+' no floating rectangular book label');
 assert.equal(m.border,'0px',label+' no floating frame');
}
async function hub(p){const to=await p.locator('.child').getAttribute('data-phase')==='return-books'?'tea':'flowers';await click(p,'return');await p.locator(`.child[data-phase="${to}"]`).waitFor();await drain(p);await p.locator('[data-a="walk"]').waitFor();}
async function geometry(p,label){const result=await p.evaluate(()=>{
 const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
 const main=document.querySelector('.child'),buttons=[...document.querySelectorAll('.toolbar button,.caption button')];
 return {width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight,main:rect(main),buttons:buttons.map(rect),world:document.querySelector('.world')?rect(document.querySelector('.world')):null,caption:document.querySelector('.caption')?rect(document.querySelector('.caption')):null,actors:[...document.querySelectorAll('.actor')].map(e=>({name:e.dataset.actor,...rect(e.querySelector('.actor-label'))}))};
 });
 assert.equal(result.overflow,false,label+' viewport overflow');
 for(const b of result.buttons){assert.ok(b.h>=43.9&&b.w>=43.9,label+' 44px action');assert.ok(b.right<=result.width+.5&&b.bottom<=result.height+.5,label+' offscreen action');}
 if(result.world&&result.caption)assert.ok(result.world.bottom<=result.caption.y+.5,label+' dock covers world');
 for(const a of result.actors){assert.ok(a.x>=result.world.x-.5&&a.right<=result.world.right+.5,label+' cropped label '+a.name);assert.ok(a.y>=result.world.y-.5&&a.bottom<=result.world.bottom+.5,label+' cropped feet/label '+a.name);}
 report.push({label,...result});
}
async function finish(p){
 await arrive(p);await carriedProp(p,'books');await click(p,'deliver');await drain(p);await hub(p);
 // L-first cart succeeds before any stair-stop or failure line.
 await arrive(p);await carriedProp(p,'cart');await click(p,'deliver');await drain(p);
 await click(p,'compare-open');assert.equal(await p.locator('[data-a="reason-steps"]').isDisabled(),true);
 await click(p,'inspect-S');await p.locator('.inspection img').evaluate(img=>img.decode());await click(p,'observe');await click(p,'reason-steps');await drain(p);await hub(p);
 await arrive(p);await carriedProp(p,'flowers');await geometry(p,'flowers-before-delivery');await p.screenshot({path:'test-results/e03-flower-focus.png'});await click(p,'deliver');await drain(p);
 await click(p,'return');await p.locator('.child[data-phase="signs"]').waitFor();await drain(p);await p.locator('[data-a="signs-open"]').waitFor();
 await click(p,'signs-open');await click(p,'bad-cart');await p.getByText('Check the arrow.',{exact:false}).waitFor();
 await click(p,'walk-sign');await click(p,'cart-sign');await drain(p);assert.equal(await p.locator('.new-signs').count(),1);
 await click(p,'go-glyph');await p.locator('[data-a="glyph"]').waitFor();await click(p,'glyph');await drain(p);
 await click(p,'garden');await drain(p);await click(p,'station');await drain(p);
 await click(p,'chronicle');await drain(p);await click(p,'finish');
 await p.getByRole('heading',{name:'Different loads, different ways'}).waitFor();
}
try{
 {const {ctx,p}=await open(568,320,false);await p.getByRole('heading',{name:'Market Lane comes after Riverside'}).waitFor();assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),null);assert.equal(await p.locator('[data-a="begin"]').count(),0);await click(p,'preview');await click(p,'begin');await drain(p);await p.reload();await p.getByRole('heading',{name:'Market Lane comes after Riverside'}).waitFor();assert.deepEqual(await p.evaluate(({KEY,E02,E01})=>[localStorage.getItem(KEY),localStorage.getItem(E02),localStorage.getItem(E01)],{KEY,E02,E01}),[null,null,null]);await ctx.close();report.push({label:'canonical prerequisite locked; explicit preview never fabricates progress',pass:true});}
 const {ctx,p}=await open(568,320);
 const originals=await p.evaluate(({E01,E02})=>[localStorage.getItem(E01),localStorage.getItem(E02)],{E01,E02});
 await click(p,'begin');await carriedProp(p,'books');await bookPlacement(p,'568-opening');await p.locator('[data-actor="MILO"]').evaluate(el=>{window.__miloActor=el});await click(p,'next');assert.equal(await p.locator('[data-actor="MILO"]').evaluate(el=>el===window.__miloActor),true,'dialogue advance keeps Milo visual mounted');await geometry(p,'568-opening');await p.screenshot({path:'test-results/e03-568-opening.png'});
 await p.evaluate(()=>{window.__spoken=[];Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){},speak(u){window.__spoken.push(u.text);}}});});const beforeListen=await p.evaluate(k=>localStorage.getItem(k),KEY);await click(p,'listen');assert.equal(await p.evaluate(()=>window.__spoken.length),1);assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),beforeListen);
 await click(p,'next');const savedLine=await p.locator('[data-line]').getAttribute('data-line');await p.reload();assert.equal(await p.locator('[data-line]').getAttribute('data-line'),savedLine);
 await drain(p);await geometry(p,'568-books');await p.screenshot({path:'test-results/e03-568-market.png'});
 // Modal focus, Escape and Listen stay operable without prerecorded audio.
 await click(p,'paths');await p.keyboard.press('Tab');assert.equal(await p.locator('.modal button:focus').count(),1);await p.keyboard.press('Escape');assert.equal(await p.locator('[role="dialog"]').count(),0);
 await finish(p);const canonical=await p.evaluate(k=>localStorage.getItem(k),KEY);assert.equal(JSON.parse(canonical).ledger.length,9);
 await p.reload();await click(p,'review');await p.getByText('Not yet checked.',{exact:false}).waitFor();await click(p,'replay');await click(p,'begin');await drain(p);await finish(p);assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),canonical);
 const unchanged=await p.evaluate(({E01,E02})=>[localStorage.getItem(E01),localStorage.getItem(E02)],{E01,E02});assert.deepEqual(unchanged,originals);
 await click(p,'exit-replay');await click(p,'reset-open');await click(p,'reset-confirm');await p.reload();assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),null);assert.deepEqual(await p.evaluate(({E01,E02})=>[localStorage.getItem(E01),localStorage.getItem(E02)],{E01,E02}),originals);
 await ctx.close();report.push({label:'full touch story, reload, repeat, replay and isolated reset',pass:true});
 for(const [w,h]of [[320,740],[360,780],[390,844],[430,932],[667,375],[1366,900],[1024,600]]){
  const {ctx,p}=await open(w,h);await click(p,'begin');await bookPlacement(p,`${w}x${h}-opening`);await geometry(p,`${w}x${h} dialogue`);await drain(p);await geometry(p,`${w}x${h} controls`);await p.screenshot({path:`test-results/e03-${w}x${h}.png`});
  if(w<900){await click(p,'parent');assert.equal(await p.locator('.parent').isVisible(),true);await click(p,'parent');}
  await ctx.close();
 }
 // Real motion interruption is restored at the last completed graph node.
 {const {ctx,p}=await open(1366,900,true,false);await click(p,'begin');await drain(p);const before=await p.locator('[data-load-visual="books"]').boundingBox();await click(p,'walk');await p.waitForTimeout(250);const during=await p.locator('[data-load-visual="books"]').boundingBox();assert.ok(before&&during&&Math.abs(during.x-before.x)>1,'book visual moves with Milo');await p.waitForTimeout(350);await p.reload();await p.locator('[data-a="resume"]').waitFor();await click(p,'resume');await p.locator('[data-a="deliver"]').waitFor();assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).position,KEY),'B');await ctx.close();report.push({label:'mid-route reload and carried visual continue legal remaining edges',pass:true});}
 // Storage refusal remains playable and reset failure is reported truthfully.
 {const {ctx,p}=await open();await p.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('denied');};});await click(p,'begin');await p.getByRole('alert').getByText('Saving is unavailable.',{exact:false}).waitFor();await drain(p);await ctx.close();report.push({label:'storage refusal',pass:true});}
 assert.deepEqual(errors,[]);
 console.log(`PASS E03 browser: ${report.length} result records`);
}finally{await writeFile('test-results/e03-browser-report.json',JSON.stringify({report,errors},null,2));await browser.close();}
