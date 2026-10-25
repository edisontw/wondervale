import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {fresh,dispatch} from '../engine/s01e02.mjs';
import {fresh as freshE03,dispatch as dispatchE03,payload as payloadE03,route as routeE03,places as placesE03} from '../engine/s01e03.mjs';
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
 await arrive(p);const destination=await perspectiveFoot(p,'bookstall');assert.ok(destination.source<start.source*.85,'Milo gets smaller at distant upper bookstall');await carriedProp(p,'books');await click(p,'deliver');await drain(p);await hub(p);
 // L-first cart succeeds before any stair-stop or failure line.
 await arrive(p);await carriedProp(p,'cart');await cartFrame(p,'tea-cart at delivery');await p.screenshot({path:'test-results/e03-tea-cart-focus.png'});await click(p,'deliver');await drain(p);
 await click(p,'compare-open');assert.equal(await p.locator('[data-a="reason-steps"]').isDisabled(),true);
 await click(p,'inspect-S');await p.locator('.inspection img').evaluate(img=>img.decode());await click(p,'observe');await click(p,'reason-steps');await drain(p);await hub(p);
 await arrive(p);await carriedProp(p,'flowers');assert.ok(await p.locator('[data-load-visual="flowers"] .flower-bloom').count()>=5,'flower tray has detailed colorful blossoms');await geometry(p,'flowers-before-delivery');await p.screenshot({path:'test-results/e03-flower-focus.png'});await click(p,'deliver');await drain(p);
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
 await click(p,'begin');await perspectiveFoot(p,'568-opening');await carriedProp(p,'books');assert.equal(await p.locator('[data-load-visual="books"]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)','books have no opaque tile');await p.locator('[data-actor="MILO"]').evaluate(el=>{window.__miloActor=el});await click(p,'next');assert.equal(await p.locator('[data-actor="MILO"]').evaluate(el=>el===window.__miloActor),true,'dialogue advance keeps Milo visual mounted');await geometry(p,'568-opening');await p.screenshot({path:'test-results/e03-568-opening.png'});
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
  const {ctx,p}=await open(w,h);await click(p,'begin');await perspectiveFoot(p,`${w}x${h} opening`);await geometry(p,`${w}x${h} dialogue`);await drain(p);await geometry(p,`${w}x${h} controls`);await p.screenshot({path:`test-results/e03-${w}x${h}.png`});
  if(w<900){await click(p,'parent');assert.equal(await p.locator('.parent').isVisible(),true);await click(p,'parent');}
  await ctx.close();
 }
 // Real motion interruption is restored at the last completed graph node.
 {const {ctx,p}=await open(1366,900,true,false);await click(p,'begin');await drain(p);const before=await p.locator('[data-load-visual="books"]').boundingBox();await click(p,'walk');await p.waitForTimeout(250);const during=await p.locator('[data-load-visual="books"]').boundingBox();assert.ok(before&&during&&Math.abs(during.x-before.x)>1,'book visual moves with Milo');await p.waitForTimeout(350);await p.reload();await p.locator('[data-a="resume"]').waitFor();await click(p,'resume');await p.locator('[data-a="deliver"]').waitFor();assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).position,KEY),'B');await ctx.close();report.push({label:'mid-route reload and carried visual continue legal remaining edges',pass:true});}

 // Issue #109: actual packaged Chromium cart snapshots at the L-route bend
 // checkpoints. These show the rendered static screen-space cart; they do NOT
 // establish physical wheel tracks, cart yaw or source-image walkable clearance.
 {
  const drainEngine=s=>{let n=0;while(s.queue.length){s=dispatchE03(s,{type:'next'});assert.ok(++n<80);}return s;};
  let s=freshE03();
  s=drainEngine(dispatchE03(s,{type:'begin',ready:true}));
  s=dispatchE03(s,{type:'take-route',route:'L'});
  while(s.travel.length)s=dispatchE03(s,{type:'step',to:s.travel[0]});
  assert.equal(s.position,'B');
  s=drainEngine(dispatchE03(s,{type:'deliver'}));
  s=dispatchE03(s,{type:'return'});
  while(s.travel.length)s=dispatchE03(s,{type:'step',to:s.travel[0]});
  s=drainEngine(s);
  assert.equal(s.phase,'tea');
  assert.equal(s.load,'tea_cart');
  assert.equal(s.position,'H');
  s=dispatchE03(s,{type:'take-route',route:'L'});
  assert.deepEqual(s.travel,routeE03('H','T','tea_cart').slice(1));
  const checkpoints={};
  while(s.travel.length){
   const to=s.travel[0];
   s=dispatchE03(s,{type:'step',to});
   if(['bend','front','east','fork'].includes(to))checkpoints[to]=payloadE03(s);
  }
  assert.deepEqual(Object.keys(checkpoints),['bend','front','east','fork']);
  for(const [w,h] of [[320,740],[568,320],[1366,900]]){
   const {ctx,p}=await open(w,h);
   const priorBytes=await p.evaluate(({E01,E02})=>[localStorage.getItem(E01),localStorage.getItem(E02)],{E01,E02});
   for(const [node,checkpoint] of Object.entries(checkpoints)){
    await p.evaluate(({KEY,checkpoint})=>localStorage.setItem(KEY,JSON.stringify(checkpoint)),{KEY,checkpoint});
    await p.reload();
    await p.locator('.backdrop').evaluate(img=>img.decode());
    assert.equal(await p.locator('.child').getAttribute('data-phase'),'tea');
    assert.equal(await p.locator('[data-load-visual="cart"]').count(),1);
    const g=await p.evaluate(()=>{
     const rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
     const world=rect(document.querySelector('.world'));
     const actorEl=document.querySelector('[data-actor="MILO"]'),actor=rect(actorEl);
     const cart=rect(document.querySelector('[data-load-visual="cart"]'));
     return {world,actor,cart,footY:+actorEl.dataset.footY,
      overflowX:document.documentElement.scrollWidth>innerWidth+1};
    });
    assert.equal(g.overflowX,false,'Horizontal overflow at '+w+'x'+h+' '+node);
    assert.ok(g.cart.width>=10&&g.cart.height>=4,'Cart is rendered at '+w+'x'+h+' '+node);
    assert.ok(g.cart.left>=g.world.left-1&&g.cart.right<=g.world.right+1,
     'Cart is clipped horizontally at '+w+'x'+h+' '+node);
    assert.ok(Math.abs(g.actor.bottom-(g.world.top+g.footY*g.world.height/941))<1.5,
     'Milo foot misregistered at '+w+'x'+h+' '+node);
    assert.ok(Math.abs(g.footY-placesE03[node][1])<.01,'Wrong route checkpoint '+node);
    await p.screenshot({path:'test-results/e03-cart-waypoint-'+w+'x'+h+'-'+node+'.png',fullPage:true});
    report.push({label:'cart-waypoint-'+w+'x'+h+'-'+node,footY:g.footY,
     cart:g.cart,world:g.world,physicalClearance:'OPEN: static waypoint, no yaw or wheel-track proof'});
   }
   assert.deepEqual(await p.evaluate(({E01,E02})=>[localStorage.getItem(E01),localStorage.getItem(E02)],{E01,E02}),priorBytes,
    'Cart screenshot checkpoints must not modify E01/E02 saves');
   await ctx.close();
  }
 }
 // Storage refusal remains playable and reset failure is reported truthfully.
 {const {ctx,p}=await open();await p.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('denied');};});await click(p,'begin');await p.getByRole('alert').getByText('Saving is unavailable.',{exact:false}).waitFor();await drain(p);await ctx.close();report.push({label:'storage refusal',pass:true});}
 assert.deepEqual(errors,[]);
 console.log(`PASS E03 browser: ${report.length} result records`);
}finally{await writeFile('test-results/e03-browser-report.json',JSON.stringify({report,errors},null,2));await browser.close();}
