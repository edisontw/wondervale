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
async function open(width=1366,height=900,motion=false){
 const ctx=await browser.newContext({viewport:{width,height},hasTouch:width<900,isMobile:width<900,reducedMotion:motion?'no-preference':'reduce'});
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
  const motionStart=payloadE03(s);
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

  // #109: sample the *actual runtime RAF motion*, not only static injected waypoints.
  // A moving cart remains screen-aligned: these screenshots/traces are visual
  // evidence only, NOT real wheel steering, pavement, collision or Gate 3 PASS.
  // This isolated checkpoint harness covers forward appearance at the L
  // turns. The real UI journey below separately plays the empty-cart return;
  // neither source-plane trace establishes a physical swept envelope.
  const motionCases=[
   {direction:'forward',checkpoint:motionStart,end:'T',
    turns:['west','bend','front','east','fork','ramp0']}
  ];
  for(const [w,h] of [[320,740],[568,320],[1366,900]]){
   const {ctx,p}=await open(w,h,true);
   await ctx.addInitScript(({KEY})=>{
    const checkpoint=sessionStorage.getItem('__e03_cart_motion_fixture');
    if(checkpoint)localStorage.setItem(KEY,checkpoint);
   },{KEY});
   const before=await p.evaluate(({E01,E02})=>[localStorage.getItem(E01),localStorage.getItem(E02)],{E01,E02});
   for(const sample of motionCases){
    await p.evaluate(checkpoint=>sessionStorage.setItem('__e03_cart_motion_fixture',JSON.stringify(checkpoint)),sample.checkpoint);
    await p.reload();
    await p.locator('.backdrop').evaluate(img=>img.decode());
    assert.equal(await p.locator('[data-load-visual="cart"]').count(),1);
    assert.equal(await p.locator('[data-a="resume"]').count(),1);
    await p.evaluate(()=>{
     window.__e03CartTrace=[];
     window.__e03CartSampling=true;
     const capture=()=>{
      if(!window.__e03CartSampling)return;
      const actor=document.querySelector('[data-actor="MILO"]');
      const cart=document.querySelector('[data-load-visual="cart"]');
      const world=document.querySelector('.world');
      if(actor&&cart&&world){
       const r=cart.getBoundingClientRect(),wr=world.getBoundingClientRect();
       const x=parseFloat(actor.style.getPropertyValue('--x'))*16.72;
       const y=parseFloat(actor.dataset.footY);
       // Record *actual rendered* wheel/handle feature centers from the live
       // SVG transform, not the earlier theoretical fixed-size cart rectangle.
       // Back-project client pixels into the unchanged 1672x941 painting plane.
       // This is image-plane motion evidence, not physical steering or clearance.
       const svg=cart.querySelector('svg'),matrix=svg?.getScreenCTM();
       if(!matrix)return;
       const source=(sx,sy)=>{
        const q=new DOMPoint(sx,sy).matrixTransform(matrix);
        return [Number(((q.x-wr.left)*1672/wr.width).toFixed(2)),
         Number(((q.y-wr.top)*941/wr.height).toFixed(2))];
       };
       const wheels=[source(47,58),source(91,58)],handle=source(9,18);
       window.__e03CartTrace.push({frameIndex:window.__e03CartTrace.length,x,y,wheels,handle,cartLeft:r.left,cartRight:r.right,
        cartWidth:r.width,cartHeight:r.height,worldLeft:wr.left,worldRight:wr.right});
      }
      requestAnimationFrame(capture);
     };
     requestAnimationFrame(capture);
     document.querySelector('[data-a="resume"]').click();
    });
    for(const turn of sample.turns){
     const [tx,ty]=placesE03[turn];
     await p.waitForFunction(([x,y])=>window.__e03CartTrace?.some(v=>
      Math.abs(v.x-x)<16&&Math.abs(v.y-y)<16),[tx,ty],{timeout:15000});
     await p.screenshot({path:'test-results/e03-cart-live-'+w+'x'+h+'-'+sample.direction+'-'+turn+'.png',fullPage:true});
    }
    await p.waitForFunction(({KEY,end})=>{
     const saved=JSON.parse(localStorage.getItem(KEY)||'null');
     return saved?.position===end&&saved?.travel?.length===0;
    },{KEY,end:sample.end},{timeout:18000});
    const trace=await p.evaluate(()=>{window.__e03CartSampling=false;return window.__e03CartTrace;});
    assert.ok(trace.length>=12,'Expected multiple real animation frames at '+w+'x'+h+' '+sample.direction);
    assert.ok(trace.every((frame,index)=>frame.frameIndex===index),
     'Live feature frames must have a contiguous sequence at '+w+'x'+h);
    assert.ok(trace.every(v=>Number.isFinite(v.x)&&Number.isFinite(v.y)&&v.cartWidth>0&&v.cartHeight>0),
     'Actual cart/actor motion must remain finite');
    assert.ok(trace.every(v=>v.cartLeft>=v.worldLeft-2&&v.cartRight<=v.worldRight+2),
     'Actual moving cart must not clip outside the scene at '+w+'x'+h+' '+sample.direction);
    const finitePoint=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite);
    assert.ok(trace.every(v=>v.wheels?.length===2&&v.wheels.every(finitePoint)&&finitePoint(v.handle)),
     'Missing real SVG wheel/handle source-pixel positions at '+w+'x'+h);
    assert.ok(trace.every(v=>v.wheels[1][0]>v.wheels[0][0]),
     'Actual no-yaw cart should preserve wheel ordering in the rendered plane');
    const travelPx=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
    assert.ok(travelPx(trace[0].wheels[0],trace.at(-1).wheels[0])>100,
     'Live left wheel must move along the real loaded-cart path');
    for(const turn of sample.turns){
     const [tx,ty]=placesE03[turn];
     assert.ok(trace.some(v=>Math.abs(v.x-tx)<16&&Math.abs(v.y-ty)<16),
      'Missing live cart turn '+turn+' '+sample.direction);
    }
    await writeFile('test-results/e03-cart-live-feature-tracks-'+w+'x'+h+'.json',JSON.stringify({
     viewport:[w,h],sourceImage:[1672,941],direction:sample.direction,
     coordinateSystem:'actual rendered SVG wheel and handle centers back-projected into source-image pixels',
     featureModel:'wheel centers (47,58)/(91,58), handle point (9,18) in SVG viewBox 132x72',
     limitation:'Screen-plane feature points only; no verified pavement/solid obstacle, wheel radius, steering angle or physical swept clearance',
     frames:trace.map(v=>({frameIndex:v.frameIndex,foot:[v.x,v.y],wheels:v.wheels,handle:v.handle}))
    },null,2)+'\n');
    report.push({label:'cart-live-'+w+'x'+h+'-'+sample.direction,
     frames:trace.length,turns:sample.turns,
     xRange:[Math.min(...trace.map(v=>v.x)),Math.max(...trace.map(v=>v.x))],
     featureStart:{wheels:trace[0].wheels,handle:trace[0].handle},
     featureEnd:{wheels:trace.at(-1).wheels,handle:trace.at(-1).handle},
     physicalClearance:'OPEN: actual SVG wheel/handle image-plane paths, not steered wheel tracks, yaw, verified paving or solid clearance'});
   }
   assert.deepEqual(await p.evaluate(({E01,E02})=>[localStorage.getItem(E01),localStorage.getItem(E02)],{E01,E02}),before,
    'Live cart motion must not alter E01/E02 saves');
   await ctx.close();
  }

  // One uninterrupted, UI-played tea delivery and empty-cart return. The only
  // precondition is a replay-built E02 checkpoint; no E03 state is injected.
  {
   for(const [w,h] of [[320,740],[568,320],[1366,900]]){
   const {ctx,p}=await open(w,h,true);
   const act=key=>p.locator(`[data-a="${key}"]`).click();
   const inspectCart=()=>p.locator('[data-load-visual="cart"]').evaluate(el=>{
    const rect=node=>{const r=node.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(n=>Math.round(n*10)/10);};
    const style=node=>{const s=getComputedStyle(node);return {display:s.display,visibility:s.visibility,opacity:s.opacity,zIndex:s.zIndex};};
    const svg=el.querySelector('svg'),path=svg.querySelector('path');
    return {label:el.getAttribute('aria-label'),className:el.className,box:rect(el),elementStyle:style(el),svgBox:rect(svg),svgStyle:style(svg),pathStroke:getComputedStyle(path).stroke,pathStrokeWidth:getComputedStyle(path).strokeWidth,pathBox:(()=>{const b=path.getBBox();return [b.x,b.y,b.width,b.height]})()};
   });
   const drain=async()=>{let n=0;while(await p.locator('[data-a="next"]').count()){await act('next');assert.ok(++n<60);}};
   const capture=async()=>p.evaluate(()=>{
    window.__e03CartTrace=[];window.__e03CartSampling=true;
    const tick=()=>{
     if(!window.__e03CartSampling)return;
     const actor=document.querySelector('[data-actor="MILO"]'),cart=document.querySelector('[data-load-visual="cart"]'),world=document.querySelector('.world');
     if(actor&&cart&&world){
     const box=cart.getBoundingClientRect(),wr=world.getBoundingClientRect(),matrix=cart.querySelector('svg')?.getScreenCTM();
     if(matrix){const src=(x,y)=>{const q=new DOMPoint(x,y).matrixTransform(matrix);return [Number(((q.x-wr.left)*1672/wr.width).toFixed(2)),Number(((q.y-wr.top)*941/wr.height).toFixed(2))];};
      const backProject=(x,y)=>[Number(((x-wr.left)*1672/wr.width).toFixed(2)),Number(((y-wr.top)*941/wr.height).toFixed(2))];
      const visualBounds=[[box.left,box.top],[box.right,box.top],[box.right,box.bottom],[box.left,box.bottom]].map(([x,y])=>backProject(x,y));
      window.__e03CartTrace.push({frameIndex:window.__e03CartTrace.length,foot:[parseFloat(actor.style.getPropertyValue('--x'))*16.72,+actor.dataset.footY],wheels:[src(47,58),src(91,58)],handle:src(9,18),visualBounds,cartLeft:box.left,cartRight:box.right,cartTop:box.top,cartBottom:box.bottom,worldLeft:wr.left,worldRight:wr.right,empty:cart.classList.contains('cart-empty')});}
     }
     requestAnimationFrame(tick);
    };requestAnimationFrame(tick);
   });
   const end=async()=>p.evaluate(()=>{window.__e03CartSampling=false;return window.__e03CartTrace;});
   const track=async(direction,turns,endNode)=>{
    await capture();
    const clickAction=act(direction==='forward'?'walk':'return');
    for(const turn of turns){
     const point=placesE03[turn];
     await p.waitForFunction(([x,y])=>window.__e03CartTrace?.some(v=>Math.abs(v.foot[0]-x)<16&&Math.abs(v.foot[1]-y)<16),point,{timeout:15000});
     if(['bend','fork','ramp0','west'].includes(turn))
     await p.screenshot({path:`test-results/e03-cart-actual-${direction}-${w}x${h}-${turn}.png`,fullPage:true});
    }
    await p.waitForFunction(({KEY,node})=>{
     const saved=JSON.parse(localStorage.getItem(KEY)||'null');
     return saved?.position===node&&saved?.travel?.length===0;
    },{KEY,node:endNode},{timeout:18000});
    await clickAction;
    return await end();
   };

   await act('begin');await drain();
   await act('walk');await p.locator('[data-a="deliver"]').waitFor();
   await act('deliver');await drain();
   await act('return');await p.locator('.child[data-phase="tea"]').waitFor();await drain();
   assert.equal(await p.locator('[data-load-visual="cart"]').getAttribute('aria-label'),'Tea cup handcart');
   const forward=await track('forward',['bend','front','east','fork','ramp0'],'T');
   await p.locator('[data-a="deliver"]').waitFor();
   const loadedCartVisual=await inspectCart();
   await p.screenshot({path:`test-results/e03-cart-forward-loaded-at-tea-stall-${w}x${h}.png`,fullPage:true});
   await p.locator('[data-load-visual="cart"]').screenshot({
    path:`test-results/e03-cart-actual-forward-loaded-at-tea-stall-${w}x${h}.png`});
   assert.ok(forward.length>=20,'live UI forward trip records actual animation frames');
   assert.ok(forward.every(v=>!v.empty),'tea cups are visible on the outbound cart');
   assert.ok(forward.every(v=>v.cartLeft>=v.worldLeft-2&&v.cartRight<=v.worldRight+2),'forward cart stays in the rendered scene');
   await act('deliver');await drain();
   await act('compare-open');await act('inspect-S');await p.locator('.inspection img').evaluate(img=>img.decode());await act('observe');await act('reason-steps');await drain();
   assert.equal(await p.locator('.child').getAttribute('data-phase'),'return-tea');
   assert.equal(await p.locator('[data-load-visual="cart"]').getAttribute('aria-label'),'Empty tea handcart');
   const emptyCartVisual=await inspectCart();
   await p.screenshot({path:`test-results/e03-cart-reverse-empty-at-tea-stall-${w}x${h}.png`,fullPage:true});
   await p.locator('[data-load-visual="cart"]').screenshot({
    path:`test-results/e03-cart-actual-reverse-empty-at-tea-stall-${w}x${h}.png`});
   const reverse=await track('reverse',['ramp0','fork','east','front','bend','west'],'H');
   await p.locator('.child[data-phase="flowers"]').waitFor();
   assert.ok(reverse.length>=20,'live UI reverse trip records actual animation frames');
   assert.ok(reverse.every(v=>v.empty),'the return trip carries the empty cart');
   assert.ok(reverse.every(v=>v.cartLeft>=v.worldLeft-2&&v.cartRight<=v.worldRight+2),'reverse cart stays in the rendered scene');
   const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
   assert.ok(distance(forward[0].wheels[0],reverse.at(-1).wheels[0])<16,'actual reverse terminates near the forward start wheel position');
   assert.ok(distance(forward.at(-1).wheels[0],reverse[0].wheels[0])<16,'actual return begins near the tea-stall wheel position');
   for(const turn of ['ramp0','fork','east','front','bend','west'])
    assert.ok(reverse.some(v=>Math.abs(v.foot[0]-placesE03[turn][0])<16&&Math.abs(v.foot[1]-placesE03[turn][1])<16),`actual reverse samples ${turn}`);
   await writeFile(`test-results/e03-cart-actual-forward-reverse-${w}x${h}.json`,JSON.stringify({
    viewport:[w,h],forwardFrames:forward.length,reverseFrames:reverse.length,
    forwardTrace:forward.map(({frameIndex,foot,wheels,handle,visualBounds})=>({frameIndex,foot,wheels,handle,visualBounds})),
    reverseTrace:reverse.map(({frameIndex,foot,wheels,handle,visualBounds})=>({frameIndex,foot,wheels,handle,visualBounds})),
    loadedCartVisual,emptyCartVisual,
    forwardTurns:['bend','front','east','fork','ramp0'],reverseTurns:['ramp0','fork','east','front','bend','west'],
    renderedLoadBox:{forward:[forward[0].cartRight-forward[0].cartLeft,forward[0].cartBottom-forward[0].cartTop],reverse:[reverse[0].cartRight-reverse[0].cartLeft,reverse[0].cartBottom-reverse[0].cartTop]},
    featureModel:'actual rendered SVG wheel and handle centers back-projected to the unchanged 1672x941 background',
    observation:'Milo carries cups out, unloads at the tea stall, then pushes the empty cart back to the hub through the cart-safe graph.',
    limitation:'This records live image-plane motion only; wheel radius, yaw, real painted pavement, ground scale, obstacle contact and physical swept clearance remain unknown.'
   },null,2)+'\n');
   report.push({label:`actual-ui-cart-forward-and-empty-return-${w}x${h}`,forwardFrames:forward.length,reverseFrames:reverse.length,
    physicalClearance:'OPEN: real reverse journey captured; no verified physical swept envelope'});
   await ctx.close();
   }
  }
 }

 assert.deepEqual(errors,[]);
 console.log('PASS E03 cart static + live motion browser diagnostic: '+report.length+' records; physical clearance OPEN');
} finally {
 await writeFile('test-results/e03-cart-waypoint-report.json',JSON.stringify({report,errors},null,2));
 await browser.close();
}
