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
async function deliveryGuidance(p,item,destination,cta){
 const bar=p.locator('[data-active-delivery]');
 assert.equal(await bar.count(),1,'one active delivery guide');
 assert.ok((await bar.getAttribute('aria-label')).includes('Carrying '+item+'. Destination: '+destination+'.'),'item and destination both explicit');
 assert.equal(await p.locator('.delivery-marker').count(),1,'exactly one scene destination marker');
 assert.equal(await p.locator('.delivery-marker').getAttribute('aria-label'),'Destination: '+destination);
 assert.equal(await p.locator('[data-a="walk"]').textContent(),cta);
 const fit=await p.locator('.delivery-guide').evaluate(el=>{const a=el.getBoundingClientRect(),w=el.closest('.world').getBoundingClientRect();return {visible:a.width>0&&a.height>0,left:a.left,right:a.right,worldLeft:w.left,worldRight:w.right};});
 assert.ok(fit.visible&&fit.left>=fit.worldLeft-1&&fit.right<=fit.worldRight+1,'delivery guide remains in scene');
}
async function markerWithinScene(p,label){
 const fit=await p.locator('.delivery-marker').evaluate(el=>{
  const a=el.getBoundingClientRect(),w=el.closest('.world').getBoundingClientRect();
  return {width:a.width,height:a.height,left:a.left,right:a.right,top:a.top,bottom:a.bottom,worldLeft:w.left,worldRight:w.right,worldTop:w.top,worldBottom:w.bottom};
 });
 assert.ok(fit.width>0&&fit.height>0&&fit.left>=fit.worldLeft-1&&fit.right<=fit.worldRight+1&&fit.top>=fit.worldTop-1&&fit.bottom<=fit.worldBottom+1,label+' destination marker stays inside the scene');
}
async function markerClearOfMilo(p,label){
 const positions=await p.evaluate(()=>{
  const marker=document.querySelector('.delivery-marker')?.getBoundingClientRect();
  const milo=document.querySelector('[data-actor="MILO"]')?.getBoundingClientRect();
  if(!marker||!milo)return null;
  return {overlap:!(marker.right<=milo.left||marker.left>=milo.right||marker.bottom<=milo.top||marker.top>=milo.bottom)};
 });
 assert.ok(positions&&!positions.overlap,label+' destination label does not cover Milo on arrival');
}
async function destinationGone(p){
 assert.equal(await p.locator('[data-active-delivery]').count(),0,'guide disappears after delivery');
 assert.equal(await p.locator('.delivery-marker').count(),0,'marker disappears after delivery');
}
async function cartFrame(p,label){
 const g=await p.locator('[data-load-visual="cart"]').evaluate(el=>{
  const actor=el.closest('[data-actor="MILO"]').getBoundingClientRect();
  const cart=el.getBoundingClientRect();
  return {relativeWidth:cart.width/actor.width,relativeHeight:cart.height/actor.height,
   bottomAfterFeet:(cart.bottom-actor.bottom)/actor.height};
 });
 assert.ok(g.relativeWidth>=1.82&&g.relativeWidth<=1.88,label+' cart remains readable but bounded');
 assert.ok(g.relativeHeight>=.48&&g.relativeHeight<=.52,label+' cart remains compact');
 assert.ok(g.bottomAfterFeet>=.08&&g.bottomAfterFeet<=.12,label+' cart wheels visually meet foreground paving near Milo feet');
}
async function perspectiveFoot(p,label){
 const result=await p.locator('[data-actor="MILO"]').evaluate(el=>{
  const world=document.querySelector('.world').getBoundingClientRect(),r=el.getBoundingClientRect();
  return {source:+el.dataset.sourceHeight,footY:+el.dataset.footY,
   expected:Math.max(88,Math.min(156,88+(+el.dataset.footY-210)*68/446)),
   actual:r.height,worldHeight:world.height,bottom:r.bottom,expectedFoot:world.y+world.height*(+el.dataset.footY)/941};
 });
 assert.ok(Math.abs(result.source-result.expected)<.02,label+' source-perspective height');
 assert.ok(Math.abs(result.actual-result.source*result.worldHeight/941)<1,label+' rendered perspective height');
 assert.ok(Math.abs(result.bottom-result.expectedFoot)<1,label+' shoes remain registered to actual pavement');
 return result;
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
 const start=await perspectiveFoot(p,'book hub');
 await deliveryGuidance(p,'Books','Bookstall','Go to bookstall');
 await arrive(p);await markerClearOfMilo(p,'bookstall');const destination=await perspectiveFoot(p,'bookstall');assert.ok(destination.source<start.source*.85,'Milo gets smaller at distant upper bookstall');await carriedProp(p,'books');await click(p,'deliver');await drain(p);await destinationGone(p);await hub(p);
 // L-first cart succeeds before any stair-stop or failure line.
 await deliveryGuidance(p,'Tea cart','Tea stall','Push to tea stall');
 await arrive(p);await markerClearOfMilo(p,'tea stall');await carriedProp(p,'cart');await cartFrame(p,'tea-cart at delivery');await p.screenshot({path:'test-results/e03-tea-cart-focus.png'});await click(p,'deliver');await drain(p);await destinationGone(p);
 await click(p,'compare-open');assert.equal(await p.locator('[data-a="reason-steps"]').isDisabled(),true);
 await click(p,'inspect-S');await p.locator('.inspection img').evaluate(img=>img.decode());await click(p,'observe');await click(p,'reason-steps');await drain(p);await hub(p);
 await deliveryGuidance(p,'Flowers','Garden','Walk to garden');await arrive(p);await markerClearOfMilo(p,'garden');await carriedProp(p,'flowers');assert.ok(await p.locator('[data-load-visual="flowers"] .flower-bloom').count()>=5,'flower tray has detailed colorful blossoms');await geometry(p,'flowers-before-delivery');await p.screenshot({path:'test-results/e03-flower-focus.png'});await click(p,'deliver');await drain(p);await destinationGone(p);
 await click(p,'return');await p.locator('.child[data-phase="signs"]').waitFor();await drain(p);await p.locator('[data-a="signs-open"]').waitFor();
 await click(p,'signs-open');await click(p,'bad-cart');await p.getByText('Check the arrow.',{exact:false}).waitFor();
 await click(p,'walk-sign');await click(p,'cart-sign');await drain(p);assert.equal(await p.locator('.new-signs').count(),1);
 await click(p,'go-glyph');await p.locator('[data-a="glyph"]').waitFor();await click(p,'glyph');await drain(p);
 await click(p,'garden');assert.equal(await p.locator('[data-npc-portrait="RESIDENT"]').count(),1,'Garden resident gets illustrated dialogue portrait');await drain(p);await click(p,'station');assert.equal(await p.locator('[data-npc-portrait="COORDINATOR"]').count(),1,'Market coordinator gets distinct illustrated portrait');await drain(p);
 await click(p,'chronicle');await drain(p);await click(p,'finish');
 await p.getByRole('heading',{name:'Different loads, different ways'}).waitFor();
}
try{
 {const {ctx,p}=await open(568,320,false);await p.getByRole('heading',{name:'Market Lane comes after Riverside'}).waitFor();assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),null);assert.equal(await p.locator('[data-a="begin"]').count(),0);await click(p,'preview');await click(p,'begin');await drain(p);await p.reload();await p.getByRole('heading',{name:'Market Lane comes after Riverside'}).waitFor();assert.deepEqual(await p.evaluate(({KEY,E02,E01})=>[localStorage.getItem(KEY),localStorage.getItem(E02),localStorage.getItem(E01)],{KEY,E02,E01}),[null,null,null]);await ctx.close();report.push({label:'canonical prerequisite locked; explicit preview never fabricates progress',pass:true});}
 const {ctx,p}=await open(568,320);
 const originals=await p.evaluate(({E01,E02})=>[localStorage.getItem(E01),localStorage.getItem(E02)],{E01,E02});
 await click(p,'begin');assert.equal(await p.locator('[data-active-delivery="arrival"]').count(),1,'books are identified before first dialogue ends');assert.equal(await p.locator('.delivery-marker').getAttribute('data-destination'),'arrival','arrival has only current bookstall marker');await perspectiveFoot(p,'568-opening');await carriedProp(p,'books');assert.equal(await p.locator('[data-load-visual="books"]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)','books have no opaque tile');await p.locator('[data-actor="MILO"]').evaluate(el=>{window.__miloActor=el});await click(p,'next');assert.equal(await p.locator('[data-actor="MILO"]').evaluate(el=>el===window.__miloActor),true,'dialogue advance keeps Milo visual mounted');await geometry(p,'568-opening');await p.screenshot({path:'test-results/e03-568-opening.png'});
 await p.evaluate(()=>{window.__spoken=[];Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){},speak(u){window.__spoken.push(u.text);}}});});const beforeListen=await p.evaluate(k=>localStorage.getItem(k),KEY);await click(p,'listen');assert.equal(await p.evaluate(()=>window.__spoken.length),1);assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),beforeListen);
 await click(p,'next');const savedLine=await p.locator('[data-line]').getAttribute('data-line');await p.reload();assert.equal(await p.locator('[data-line]').getAttribute('data-line'),savedLine);
 await drain(p);await deliveryGuidance(p,'Books','Bookstall','Go to bookstall');await geometry(p,'568-books');await p.screenshot({path:'test-results/e03-568-market.png'});
 // Modal focus, Escape and Listen stay operable without prerecorded audio.
 await click(p,'paths');await p.keyboard.press('Tab');assert.equal(await p.locator('.modal button:focus').count(),1);await p.keyboard.press('Escape');assert.equal(await p.locator('[role="dialog"]').count(),0);
 await finish(p);const canonical=await p.evaluate(k=>localStorage.getItem(k),KEY);assert.equal(JSON.parse(canonical).ledger.length,9);
 await p.reload();await click(p,'review');await p.getByText('Not yet checked.',{exact:false}).waitFor();await click(p,'replay');await click(p,'begin');await drain(p);await finish(p);assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),canonical);
 const unchanged=await p.evaluate(({E01,E02})=>[localStorage.getItem(E01),localStorage.getItem(E02)],{E01,E02});assert.deepEqual(unchanged,originals);
 await click(p,'exit-replay');await click(p,'reset-open');await click(p,'reset-confirm');await p.reload();assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),null);assert.deepEqual(await p.evaluate(({E01,E02})=>[localStorage.getItem(E01),localStorage.getItem(E02)],{E01,E02}),originals);
 await ctx.close();report.push({label:'full touch story, reload, repeat, replay and isolated reset',pass:true});
 for(const [w,h]of [[320,740],[360,780],[390,844],[430,932],[667,375],[1366,900],[1024,600]]){
  const {ctx,p}=await open(w,h);await click(p,'begin');await perspectiveFoot(p,`${w}x${h} opening`);await geometry(p,`${w}x${h} dialogue`);await drain(p);await deliveryGuidance(p,'Books','Bookstall','Go to bookstall');await markerWithinScene(p,`${w}x${h} books`);await geometry(p,`${w}x${h} controls`);await p.screenshot({path:`test-results/e03-${w}x${h}.png`});
  if(w<900){await click(p,'parent');assert.equal(await p.locator('.parent').isVisible(),true);await click(p,'parent');}
  await ctx.close();
 }
 // Real motion interruption is restored at the last completed graph node.
 {const {ctx,p}=await open(1366,900,true,false);await click(p,'begin');await drain(p);const before=await p.locator('[data-load-visual="books"]').boundingBox();await click(p,'walk');await p.waitForTimeout(250);const during=await p.locator('[data-load-visual="books"]').boundingBox();assert.ok(before&&during&&Math.abs(during.x-before.x)>1,'book visual moves with Milo');await p.waitForTimeout(350);await p.reload();await p.locator('[data-a="resume"]').waitFor();await click(p,'resume');await p.locator('[data-a="deliver"]').waitFor();assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).position,KEY),'B');await ctx.close();report.push({label:'mid-route reload and carried visual continue legal remaining edges',pass:true});}
 // Storage refusal remains playable and reset failure is reported truthfully.
 {const {ctx,p}=await open();await p.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('denied');};});await click(p,'begin');await p.getByRole('alert').getByText('Saving is unavailable.',{exact:false}).waitFor();await drain(p);await ctx.close();report.push({label:'storage refusal',pass:true});}
 // Same-tab prerequisite removal must fail closed before the next E03 action/save.
 {const {ctx,p}=await open(568,320);await click(p,'begin');
  const saved=await p.evaluate(k=>localStorage.getItem(k),KEY);
  await p.evaluate(k=>localStorage.removeItem(k),E02);
  await click(p,'next');await p.getByRole('heading',{name:'Riverside progress changed'}).waitFor();
  assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),saved,'same-tab reset must not overwrite E03');
  assert.equal(await p.locator('[data-a="next"]').count(),0,'canonical controls paused');
  await ctx.close();report.push({label:'same-tab E02 reset locks E03 before action and preserves checkpoint',pass:true});}
 // A different tab can reset/restore E02 during an actual moving E03 edge.
 // Latch the change even if original E02 bytes are restored (ABA).
 {const {ctx,p}=await open(1366,900,true,false);await click(p,'begin');await drain(p);
  const sibling=await ctx.newPage();await sibling.goto(base+'/e03/');
  await click(p,'walk');await p.waitForTimeout(70);
  const saved=await p.evaluate(k=>localStorage.getItem(k),KEY);
  await sibling.evaluate(k=>localStorage.removeItem(k),E02);
  await p.getByRole('heading',{name:'Riverside progress changed'}).waitFor();
  await sibling.evaluate(({E02,prior})=>localStorage.setItem(E02,JSON.stringify(prior)),{E02,prior});
  await p.waitForTimeout(400);
  assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),saved,'moving tab must not commit after E02 reset/restore');
  assert.equal(await p.getByRole('heading',{name:'Riverside progress changed'}).count(),1,'ABA restore must not unlock stale tab');
  await p.reload();await p.locator('[data-a="resume"]').waitFor();
  assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),saved,'fresh mount can resume preserved E03 checkpoint');
  await ctx.close();report.push({label:'two-tab E02 reset/restore interrupts moving E03 and latches until reload',pass:true});}
 assert.deepEqual(errors,[]);
 console.log(`PASS E03 browser: ${report.length} result records`);
}finally{await writeFile('test-results/e03-browser-report.json',JSON.stringify({report,errors},null,2));await browser.close();}
