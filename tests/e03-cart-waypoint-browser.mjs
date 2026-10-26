// E03 cart waypoint screenshots isolated from canonical browser acceptance.
// Static source-coordinate fixtures only: no physical wheel/yaw clearance claim.
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
async function open(width=1366,height=900){
 const ctx=await browser.newContext({viewport:{width,height},hasTouch:width<900,isMobile:width<900,reducedMotion:'reduce'});
 const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/e03/');
 await p.evaluate(({prior,E02,E01})=>{localStorage.setItem(E02,JSON.stringify(prior));localStorage.setItem(E01,'{"sentinel":"E01 unchanged"}');},{prior,E02,E01});await p.reload();
 return {ctx,p};
}
try {
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
   // A normal reload fires the old page's visibilitychange autosave, which can
   // overwrite a newly injected checkpoint. Restore from a test-only session
   // fixture BEFORE the new page module starts; never weaken production saves.
   await ctx.addInitScript(({KEY})=>{
    const checkpoint=sessionStorage.getItem('__e03_cart_waypoint_fixture');
    if(checkpoint)localStorage.setItem(KEY,checkpoint);
   },{KEY});
   for(const [node,checkpoint] of Object.entries(checkpoints)){
    await p.evaluate(checkpoint=>sessionStorage.setItem('__e03_cart_waypoint_fixture',JSON.stringify(checkpoint)),checkpoint);
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

 assert.deepEqual(errors,[]);
 console.log('PASS E03 cart static waypoint browser diagnostic: '+report.length+' records; physical clearance OPEN');
} finally {
 await writeFile('test-results/e03-cart-waypoint-report.json',JSON.stringify({report,errors},null,2));
 await browser.close();
}
