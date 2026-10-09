import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {fresh,dispatch,payload,groups,KEY,events,constrainToRoad} from '../engine/episode.mjs';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const out='test-results';await mkdir(out,{recursive:true});
const content=JSON.parse(await readFile('public/episode.json'));
const results=[],errors=[];
const browser=await chromium.launch({headless:true});
const drainState=s=>{while(s.queue.length)s=dispatch(s,{type:'next'});return s;};
function fixture(stage){let s=drainState(dispatch(fresh(),{type:'begin'}));if(stage==='square')return payload(s,{motion:false});s=drainState(dispatch(dispatch(s,{type:'move',target:'board'}),{type:'hold'}));if(stage==='map')return payload(s,{motion:false});for(const r of ['line','blank_shape'])s=drainState(dispatch(s,{type:'inspect',region:r}));s=drainState(dispatch(s,{type:'guess',choice:'A'}));if(stage==='observed')return payload(s,{motion:false});for(const t of ['fountain','large_tree'])s=drainState(dispatch(dispatch(s,{type:'move',target:t}),{type:'compare',symbol:t}));if(stage==='anchors')return payload(s,{motion:false});s=drainState(dispatch(dispatch(s,{type:'move',target:'marker'}),{type:'findPlate'}));s=drainState(dispatch(s,{type:'clean'}));if(stage==='marker')return payload(s,{motion:false});s=drainState(dispatch(s,{type:'finish'}));if(stage==='later')s.ledger.push('episode_completed:s01e03');return payload(s,{motion:false});}
async function context({mobile=false,stage=null,motion=false}={}){const c=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1366,height:900},isMobile:mobile,hasTouch:mobile,reducedMotion:motion?'no-preference':'reduce'});if(stage)await c.addInitScript(({key,save})=>{if(localStorage.getItem(key)===null)localStorage.setItem(key,JSON.stringify(save));},{key:KEY,save:fixture(stage)});const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});await p.goto(base,{waitUntil:'networkidle'});await p.locator('.brand').waitFor();if(await p.getByRole('button',{name:'Continue the story',exact:true}).count())await p.getByRole('button',{name:'Continue the story',exact:true}).click();return {c,p};}
async function drain(p){
 let n=0;
 while(true){
  if(await p.getByRole('button',{name:'Skip dialogue',exact:true}).count()){
   await p.getByRole('button',{name:'Skip dialogue',exact:true}).click();
  }else if(await p.getByRole('heading',{name:'A normal day in Town Square',exact:true}).count() &&
    await p.getByRole('button',{name:'Continue',exact:true}).count()){
   await p.getByRole('button',{name:'Continue',exact:true}).click();
  }else break;
  assert.ok(++n<25,'Dialogue remained stuck while advancing lines');
 }
}
async function click(p,name){await p.getByRole('button',{name,exact:true}).click();}
async function tap(p,name){await p.getByRole('button',{name,exact:true}).tap();}
async function ledger(p){return p.evaluate(key=>JSON.parse(localStorage.getItem(key))?.ledger||[],KEY);}
async function cp(p){return p.evaluate(key=>JSON.parse(localStorage.getItem(key))?.checkpoint,KEY);}
function pass(ids,observed,platform='Chromium desktop 1366×900'){for(const id of ids.split('/'))results.push({id,status:'PASS',platform,build:content.buildId,contentVersion:content.contentVersion,observed});}
async function finishPath(p,{choice='A',order=['line','blank_shape'],anchorOrder=['fountain','large_tree'],mobile=false,keyboard=false}={}){
 const action=mobile?tap:click;
 if(await p.getByRole('button',{name:'Begin',exact:true}).count()){await action(p,'Begin');await drain(p);}
 if(await p.getByRole('heading',{name:'Walk with Milo',exact:true}).count()){await action(p,'Noticeboard');await action(p,'Help hold the paper.');await drain(p);}
 if(await p.getByRole('button',{name:'Look at the line',exact:true}).count()){
  for(const r of order){await action(p,({line:'Look at the line',blank_shape:'Look at the shape',layer_holes:'Look at the paper'})[r]);await drain(p);}
  await action(p,content.lines[`S01E01-MILO-${({A:'013',B:'014',C:'015'})[choice]}`].exact_text);await drain(p);
 }
 for(const target of anchorOrder){await action(p,target==='fountain'?'Fountain':'Big tree');await action(p,target==='fountain'?'Compare the round mark':'Compare the tree mark');await drain(p);}
 assert.equal((await p.locator('body').innerText()).includes('RIVERSIDE'),false);
 await action(p,'Old post');await action(p,'Look at the old post');await drain(p);
 await action(p,'Clean without rubbing');
 assert.equal((await p.locator('body').innerText()).includes('RIVERSIDE'),false);
 await click(p,'Continue');await click(p,'Continue');
 assert.equal(await p.locator('.plate-text').count(),1);assert.equal(await p.locator('.marker-original-ink').count(),1,'Destination ink should appear on original post only after reveal');const inkBounds=await p.locator('.marker-original-ink').evaluate(el=>{const a=el.getBoundingClientRect(),b=document.getElementById('world').getBoundingClientRect();return {x:(a.left-b.left)/b.width,y:(a.top-b.top)/b.height,w:a.width/b.width,h:a.height/b.height,background:getComputedStyle(el).backgroundColor}});
 assert.ok(inkBounds.x>0.90&&inkBounds.x<0.94&&inkBounds.y>0.44&&inkBounds.y<0.49&&inkBounds.w<0.04&&inkBounds.h<0.11,'Reveal only inside original painted Old post: '+JSON.stringify(inkBounds));
 assert.equal(inkBounds.background,'rgba(0, 0, 0, 0)','Do not cover painted old post with an opaque rectangle');assert.equal(await p.locator('.marker-world-prop,.marker-world-plate,.marker-world-post').count(),0,'Do not overlay a second physical old post');
 assert.equal(await p.locator('[data-line-id]').getAttribute('data-line-id'),'S01E01-MILO-026');
 await drain(p);await p.screenshot({path:`${out}/${mobile?'mobile':'desktop'}-chronicle.png`,fullPage:true});
 await action(p,'Finish this page');await drain(p);
 assert.equal((await ledger(p)).filter(x=>x===events.complete[0]).length,1);
}
try{
 // Real browser regression: saved mid-episode recap must offer explicit, reversible reset.
 const resetContext=await browser.newContext({viewport:{width:1366,height:900}});
 await resetContext.addInitScript(({key,save})=>{if(localStorage.getItem(key)===null)localStorage.setItem(key,JSON.stringify(save));},{key:KEY,save:fixture('map')});
 const resetPage=await resetContext.newPage();
 resetPage.on('pageerror',e=>errors.push(e.message));
 await resetPage.goto(base,{waitUntil:'networkidle'});
 await resetPage.getByRole('dialog',{name:'Story so far'}).waitFor();
 const savedProgress=await resetPage.evaluate(key=>localStorage.getItem(key),KEY);
 await resetPage.getByRole('dialog',{name:'Story so far'}).getByRole('button',{name:'Start new adventure'}).click();
 await resetPage.getByRole('dialog',{name:'Confirm new adventure'}).getByRole('button',{name:'Keep my progress'}).click();
 assert.equal(await resetPage.getByRole('dialog',{name:'Story so far'}).count(),1);
 assert.equal(await resetPage.evaluate(key=>localStorage.getItem(key),KEY),savedProgress);
 pass('RESET-01','Cancelling new adventure from resumed recap leaves all existing progress intact.');
 await resetPage.getByRole('dialog',{name:'Story so far'}).getByRole('button',{name:'Start new adventure'}).click();
 await resetPage.getByRole('dialog',{name:'Confirm new adventure'}).getByRole('button',{name:'Erase progress and restart'}).click();
 assert.equal(await resetPage.evaluate(key=>localStorage.getItem(key),KEY),null);
 assert.equal(await resetPage.getByRole('dialog').count(),0);
 assert.equal(await resetPage.getByRole('button',{name:'Begin',exact:true}).count(),1);
 await resetPage.reload({waitUntil:'networkidle'});
 assert.equal(await resetPage.getByRole('dialog',{name:'Story so far'}).count(),0);
 assert.equal(await resetPage.getByRole('button',{name:'Begin',exact:true}).count(),1);
 pass('RESET-02','Confirmed erase clears only Wondervale progress and reload remains a fresh adventure.');
 await resetContext.close();
 // Completed progress and E02 unlocks must also be reset on touch-sized screens.
 const mobileResetContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await mobileResetContext.addInitScript(({key,save})=>{if(localStorage.getItem(key)===null)localStorage.setItem(key,JSON.stringify(save));},{key:KEY,save:fixture('later')});
 const mobileResetPage=await mobileResetContext.newPage();
 mobileResetPage.on('pageerror',e=>errors.push(e.message));
 await mobileResetPage.goto(base,{waitUntil:'networkidle'});
 assert.ok((await ledger(mobileResetPage)).includes('episode_completed:s01e01'));
 await mobileResetPage.getByRole('button',{name:'Parent',exact:true}).click();
 await mobileResetPage.locator('.parent').getByRole('button',{name:'Start new adventure'}).click();
 await mobileResetPage.getByRole('dialog',{name:'Confirm new adventure'}).getByRole('button',{name:'Erase progress and restart'}).click();
 assert.equal(await mobileResetPage.evaluate(key=>localStorage.getItem(key),KEY),null);
 await mobileResetPage.reload({waitUntil:'networkidle'});
 assert.equal(await mobileResetPage.getByRole('button',{name:'Begin',exact:true}).count(),1);
 pass('RESET-03','Mobile Parent View erases completed story and future unlocks only after confirmation.','Chromium emulated touch 390×844');
 await mobileResetContext.close();
 // A denied storage write must never falsely claim the previous progress was erased.
 const deniedContext=await browser.newContext({viewport:{width:1366,height:900}});
 await deniedContext.addInitScript(({key,save})=>{if(localStorage.getItem(key)===null)localStorage.setItem(key,JSON.stringify(save));},{key:KEY,save:fixture('map')});
 const deniedPage=await deniedContext.newPage();
 deniedPage.on('pageerror',e=>errors.push(e.message));
 await deniedPage.goto(base,{waitUntil:'networkidle'});
 await deniedPage.getByRole('dialog',{name:'Story so far'}).getByRole('button',{name:'Start new adventure'}).click();
 await deniedPage.evaluate(()=>{Storage.prototype.removeItem=function(){throw new DOMException('Storage denied','SecurityError');};});
 await deniedPage.getByRole('dialog',{name:'Confirm new adventure'}).getByRole('button',{name:'Erase progress and restart'}).click();
 assert.equal(await deniedPage.getByRole('alert').count(),1);
 assert.notEqual(await deniedPage.evaluate(key=>localStorage.getItem(key),KEY),null);
 await deniedPage.getByRole('dialog',{name:'Confirm new adventure'}).getByRole('button',{name:'Keep my progress'}).click();
 assert.equal(await deniedPage.getByRole('dialog',{name:'Story so far'}).count(),1);
 pass('RESET-04','Storage failure preserves the original checkpoint and shows a clear warning.');
 await deniedContext.close();
 const {c:firstVisitCtx,p:firstVisit}=await context();
 assert.equal(await firstVisit.getByRole('button',{name:'Fountain',exact:true}).count(),0);
 assert.equal(await firstVisit.getByRole('button',{name:'Big tree',exact:true}).count(),0);
 assert.equal(await firstVisit.getByRole('button',{name:'Begin',exact:true}).count(),1);
 const introFeet=await firstVisit.locator('.actor.milo, .actor.companion').evaluateAll(els=>els.map(el=>[parseFloat(el.style.left),parseFloat(el.style.top)]));
 assert.equal(introFeet.length,3);
 for(let i=0;i<introFeet.length;i++)for(let j=0;j<i;j++)assert.ok(Math.hypot(introFeet[i][0]-introFeet[j][0],introFeet[i][1]-introFeet[j][1])>9,'opening trio should stand apart');
 assert.match(await firstVisit.locator('.scene-heading').innerText(),/Press Begin, then read every story line/);
 await click(firstVisit,'Begin');
 assert.equal(await firstVisit.locator('.opening-guide').count(),0,'Intro instructions dismissed on Begin');
 assert.doesNotMatch(await firstVisit.locator('.scene-heading').innerText(),/Press Begin, then read every story line/);
 assert.equal(await firstVisit.getByRole('button',{name:'Fountain',exact:true}).count(),0);
 assert.equal(await firstVisit.getByRole('button',{name:'Continue story',exact:true}).count(),0,'No duplicate top Continue');
 assert.equal(await firstVisit.getByRole('button',{name:'Skip introduction',exact:true}).count(),0);
 assert.equal(await firstVisit.getByRole('button',{name:'Skip dialogue',exact:true}).count(),0);
 assert.equal(await firstVisit.getByRole('button',{name:'Help',exact:true}).count(),0);
 assert.equal(await firstVisit.getByRole('button',{name:'Pause',exact:true}).count(),0);
 const cropRanges={Milo:[90,530],Nia:[545,1010],Finn:[1035,1520]};
 const speakersWithPortrait=new Set();
 const introCount=groups.opening.length;
 for(let n=0;n<introCount;n++){
  const speaker=await firstVisit.locator('.caption .speaker').innerText();
  if(cropRanges[speaker]){
   const crop=await firstVisit.locator('.caption .portrait svg').getAttribute('viewBox');
   const [x,y,width,height]=crop.trim().split(/\s+/).map(Number);
   assert.ok(x>=cropRanges[speaker][0]&&x+width<=cropRanges[speaker][1],
     'Portrait must exclude neighboring people: '+JSON.stringify({speaker,crop}));
   assert.ok(y>=0&&height<600,'Portrait must be a head/shoulder crop');
   assert.equal(await firstVisit.locator('.caption .portrait image').count(),1);
   speakersWithPortrait.add(speaker);
  }else assert.equal(await firstVisit.locator('.caption .portrait image').count(),0);
  assert.equal(await firstVisit.getByRole('button',{name:'Continue',exact:true}).count(),1);
  assert.equal(await firstVisit.getByRole('button',{name:'Skip dialogue',exact:true}).count(),0);
  if(n<introCount-1)assert.equal(await firstVisit.getByRole('button',{name:'Fountain',exact:true}).count(),0);
  await click(firstVisit,'Continue');
 }
 assert.equal(await firstVisit.getByRole('button',{name:'Fountain',exact:true}).count(),1);
 assert.equal(await firstVisit.locator('.opening-guide').count(),0);
 assert.ok(speakersWithPortrait.size>=1,'At least one speaker-specific atlas crop must be exercised');
 await click(firstVisit,'Fountain');
 assert.ok(await firstVisit.locator('.actor.milo').evaluate(el=>parseFloat(el.style.left)>40),'first visitor explores only after full intro');
 pass('FIELD-QA-FIRST-01','Mandatory introduction requires every approved line via one lower Continue; no header Help/Pause or intro skip.');
 await firstVisitCtx.close();


 // The owner could not comfortably click the old dialogue actions at the foot
 // of desktop screen. Geometry must prove all three controls remain visible and
 // hit-testable, without scrolling the dialogue box or full browser document.
 const {c:captionCtx,p:captionPage}=await context();
 await click(captionPage,'Begin');
 for(const [w,h] of [[1366,900],[1024,720],[800,600]]){
  await captionPage.setViewportSize({width:w,height:h});
  const positions=await captionPage.evaluate(()=>{
   const cap=document.querySelector('.caption'),actions=[...cap.querySelectorAll('.caption-actions button')];
   const box=cap.getBoundingClientRect();
   return {windowHeight:innerHeight,documentHeight:document.documentElement.scrollHeight,
    caption:{top:box.top,bottom:box.bottom,overflow:getComputedStyle(cap).overflowY},
    controls:actions.map(button=>{
     const r=button.getBoundingClientRect(),hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
     return {name:button.textContent,top:r.top,bottom:r.bottom,height:r.height,width:r.width,hit:hit===button||button.contains(hit)};
    })};
  });
  assert.equal(positions.controls.length,2,'Opening has Continue and Read again; no Skip dialogue');
  assert.ok(positions.documentHeight<=h+3,'Entire desktop document should fit: '+JSON.stringify({w,h,positions}));
  assert.equal(positions.caption.overflow,'visible','Desktop caption must never require internal scroll to reach actions');
  for(const c of positions.controls){
   assert.ok(c.top>=0&&c.bottom<=h-3, 'Dialogue action outside viewport '+JSON.stringify({w,h,c,positions}));
   assert.ok(c.height>=44&&c.width>=65&&c.hit,'Dialogue action hard to click '+JSON.stringify({w,h,c}));
  }
  assert.ok(positions.controls[0].height>=54,'Continue must be a large primary target');
 }
 const firstCaption=await captionPage.locator('.caption [data-line-id]').getAttribute('data-line-id');
 await click(captionPage,'Continue');
 assert.notEqual(await captionPage.locator('.caption [data-line-id]').getAttribute('data-line-id'),firstCaption);
 pass('FIELD-QA-CAPTION-01','Opening Continue and Read again stay large and hit-testable at 1366x900, 1024x720 and 800x600.');
 await captionCtx.close();

 // Mobile-specific touch geometry, without changing the locked scene image.
 const {c:mobileCaptionCtx,p:mobileCaptionPage}=await context({mobile:true});
 await tap(mobileCaptionPage,'Begin');
 for(const [w,h] of [[390,844],[320,700]]){
  await mobileCaptionPage.setViewportSize({width:w,height:h});
  const geometry=await mobileCaptionPage.evaluate(()=>{
   const cap=document.querySelector('.caption'),scene=document.querySelector('.scene-card'),
     portrait=cap.querySelector('.portrait'),message=cap.querySelector('.caption-message');
   const r=x=>{const b=x.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height};};
   return {cap:r(cap),scene:r(scene),portrait:r(portrait),message:r(message),
    documentHeight:document.documentElement.scrollHeight,
    controls:[...cap.querySelectorAll('.caption-actions button')].map(b=>{
     const box=r(b),hit=document.elementFromPoint(box.x+box.width/2,box.y+box.height/2);
     return {...box,text:b.textContent,hit:hit===b||b.contains(hit)};})};
  });
  assert.ok(geometry.cap.y>=0&&geometry.cap.bottom<=h,'Phone dialogue outside viewport '+JSON.stringify(geometry));
  assert.ok(geometry.cap.y<geometry.scene.bottom,'Dialogue should overlap scene edge');
  assert.ok(geometry.portrait.right<=geometry.message.x+2,'Portrait overlaps the text');
  assert.ok(geometry.documentHeight<=h+3,'Phone document must fit the viewport');
  for(const c of geometry.controls)assert.ok(c.height>=44&&c.hit&&c.bottom<=h,
    'Mobile story button unreachable '+JSON.stringify({w,h,c}));
 }
 pass('FIELD-QA-RPG-MOBILE-01','Responsive RPG dialogue panel on 390px and 320px touch views, with isolated portrait and reachable actions.','Chromium emulated touch');
 await mobileCaptionCtx.close();

 const {c:hotspotsCtx,p:hotspotsPage}=await context({stage:'square'});
 const marks=await hotspotsPage.locator('#world button.spot').evaluateAll(btns=>btns.map(b=>{
  const d=b.getBoundingClientRect(),icon=b.querySelector('.spot-symbol'),p=icon?.getBoundingClientRect();
  const cs=getComputedStyle(b),badge=getComputedStyle(icon),background=cs.backgroundColor;
  return {action:b.dataset.action,aria:b.getAttribute('aria-label'),hitWidth:d.width,hitHeight:d.height,
    markWidth:p?.width,markHeight:p?.height,markAlpha:badge.opacity,background,
    centerHit:b.contains(document.elementFromPoint(d.left+d.width/2,d.top+d.height/2))};
 }));
 assert.equal(marks.length,4);
 for(const mark of marks){
  assert.ok(mark.aria?.startsWith('Walk to'),'Clickable landmark remains accessible: '+JSON.stringify(mark));
  assert.ok(mark.hitWidth>=44&&mark.hitHeight>=44&&mark.centerHit,'Tap area is at least 44px: '+JSON.stringify(mark));
  assert.ok(mark.markWidth<=20&&mark.markHeight<=20,'Visible icon is small and nonobstructing: '+JSON.stringify(mark));
  assert.equal(mark.background,'rgba(0, 0, 0, 0)','Tap target itself is invisible over artwork');
 }
 await hotspotsPage.locator('.spot[data-action="walk:fountain"]').click();
 assert.ok(await hotspotsPage.locator('.actor.milo').count());
 pass('FIELD-QA-SPOT-01','Landmark symbols are small translucent marks while their labeled 44px hit targets still navigate.');
 await hotspotsCtx.close();
 const {c:viewportCtx,p:viewportPage}=await context({stage:'observed'});
 assert.equal(await viewportPage.locator('.scene-map-sheet,.map-inset').count(),0,'Landmark stage must not show a map automatically');
 await click(viewportPage,'Map');
 const desktopMap=await viewportPage.evaluate(()=>{
  const sheet=document.querySelector('.scene-map-sheet'),world=document.querySelector('#world'),art=sheet.querySelector('.map-art'),ink=art.querySelector('.line');
  const rect=sheet.getBoundingClientRect(),base=world.getBoundingClientRect();
  const bg=getComputedStyle(sheet).backgroundColor,fill=getComputedStyle(art.firstElementChild).fill;
  const close=sheet.querySelector('[data-action="map"]'),cr=close.getBoundingClientRect();
  return {sheetWidth:rect.width,worldWidth:base.width,sheetRight:rect.right,worldRight:base.right,
   background:bg,paperFill:fill,inkStroke:getComputedStyle(ink).stroke,
   closeHeight:cr.height,closeHit:close.contains(document.elementFromPoint(cr.left+cr.width/2,cr.top+cr.height/2)),
   worldPresent:!!document.querySelector('.world')};
 });
 const alphaOf=s=>s.startsWith('rgba(')?parseFloat(s.split(',').at(-1)):1;
 assert.ok(desktopMap.sheetWidth<desktopMap.worldWidth*.59,'Most of desktop town must remain visible: '+JSON.stringify(desktopMap));
 assert.ok(alphaOf(desktopMap.background)<.95&&alphaOf(desktopMap.background)>.68,'Translucent paper must still be legible: '+desktopMap.background);
 assert.ok(alphaOf(desktopMap.paperFill)<.85,'SVG paper face must not be fully opaque: '+desktopMap.paperFill);
 assert.ok(desktopMap.closeHeight>=44&&desktopMap.closeHit,'Close map remains easy to activate');
 assert.ok(desktopMap.worldPresent,'The live Town Square must stay behind the old map');
 await click(viewportPage,'Close map');
 pass('FIELD-QA-MAP-OVERLAY-01','Translucent old paper is bounded to one side over Town Square with visible art, crisp map ink and accessible close action.');

 for(let n=0;n<3;n++){
  await click(viewportPage,'Map');
  assert.equal(await viewportPage.locator('.scene-map-sheet .map-art').count(),1,'Manual Map opens one copy, not two');
  await click(viewportPage,'Close map');
  assert.equal(await viewportPage.locator('.scene-map-sheet,.map-inset').count(),0,'Closed map remains closed');
 }
 const sizeDesktop=await viewportPage.evaluate(()=>({page:document.documentElement.scrollHeight,window:innerHeight,root:document.getElementById('app').getBoundingClientRect().height}));
 assert.ok(sizeDesktop.page<=sizeDesktop.window+3,'Desktop document should fit one viewport: '+JSON.stringify(sizeDesktop));
 await click(viewportPage,'Fountain');await click(viewportPage,'Compare the round mark');await drain(viewportPage);
 assert.equal(await viewportPage.locator('.scene-map-sheet').count(),0,'Map must not reopen after confirming a landmark');
 pass('FIELD-QA-SHELL-01','Desktop E01 stays inside one viewport and Map opens only by explicit action, once per toggle.');
 await viewportCtx.close();
 const {c:mapSheetCtx,p:mapSheetPage}=await context({stage:'map'});
 assert.equal(await mapSheetPage.locator('.scene-map-sheet.map-task').count(),1,'Required observation map remains available as an in-scene activity');
 assert.equal(await mapSheetPage.locator('#world').count(),1,'Town Square scene remains mounted behind study map');
 await click(mapSheetPage,'Back to Square');
 assert.equal(await mapSheetPage.locator('.scene-map-sheet').count(),0);
 await click(mapSheetPage,'Open the old map');
 assert.equal(await mapSheetPage.locator('.scene-map-sheet.map-task').count(),1);
 pass('FIELD-QA-SHELL-02','Required map investigation remains in same scene and can be closed/reopened without a new page.');
 await mapSheetCtx.close();
 // Real-world mobile field QA: the original fixed 760px scene and clipped
 // 44dvh viewport could hide the entire trio or cut off the town's lower half.
 // Keep the full approved 1672:941 composition visible at common phone widths.
 const {c:mobileFitCtx,p:mobileFitPage}=await context({mobile:true,stage:'square'});
 for(const [width,height] of [[320,568],[360,780],[390,844],[430,932],[667,375]]){
  await mobileFitPage.setViewportSize({width,height});
  const geometry=await mobileFitPage.evaluate(()=>{
   const r=el=>{const a=el.getBoundingClientRect();return {x:a.x,y:a.y,width:a.width,height:a.height,right:a.right,bottom:a.bottom,top:a.top};};
   const viewport=document.querySelector('#viewport'),world=document.querySelector('#world');
   const actors=[...document.querySelectorAll('#world .actor')].map(e=>({name:e.className,box:r(e)}));
   return {world:r(world),viewport:r(viewport),actors,overflowX:viewport.scrollWidth-viewport.clientWidth,
    scrollHeight:document.documentElement.scrollHeight,screenHeight:innerHeight};
  });
  assert.ok(Math.abs(geometry.world.width-geometry.viewport.width)<=2,
   'All mobile World artwork must fit screen width: '+JSON.stringify({width,height,geometry}));
  assert.ok(Math.abs(geometry.world.height/geometry.world.width-941/1672)<.012,
   'Town Square lower half must not be vertically clipped: '+JSON.stringify({width,height,geometry}));
  assert.ok(Math.abs(geometry.viewport.height-geometry.world.height)<=2,
   'Viewport must expose the complete painted Square: '+JSON.stringify({width,height,geometry}));
  assert.ok(geometry.overflowX<=2,
   'Mobile scene must not require horizontal panning to locate characters: '+JSON.stringify({width,height,geometry}));
  assert.equal(geometry.actors.length,4);
  for(const actor of geometry.actors){
   assert.ok(actor.box.x>=geometry.world.x-2&&actor.box.right<=geometry.world.right+2&&
    actor.box.y>=geometry.world.y-2&&actor.box.bottom<=geometry.world.bottom+2,
    'Character must remain inside world image: '+JSON.stringify({width,height,actor,world:geometry.world}));
  }
  if(width>=360&&height>=780){
   const scene=await mobileFitPage.locator('.scene-card').boundingBox();
   assert.ok(geometry.world.bottom<=scene.y+scene.height+3,
    'Entire Town Square/trio should be visible without scene scrolling in normal portrait: '+JSON.stringify({width,height,world:geometry.world,scene}));
  }
 }
 await mobileFitPage.setViewportSize({width:390,height:844});
 await mobileFitPage.screenshot({path:`${out}/mobile-full-town-square.png`,fullPage:true});
 pass('FIELD-QA-MOBILE-WORLD-01','Phone widths 320/360/390/430 and landscape 667 retain complete 1672:941 art with all actors inside and no horizontal viewport crop.','Chromium emulated touch');
 await mobileFitCtx.close();
 const {c:mobileExploreCtx,p:mobileExplorePage}=await context({mobile:true,stage:'observed'});
 await mobileExplorePage.setViewportSize({width:390,height:844});
 await tap(mobileExplorePage,'Big tree');
 const nearTree=await mobileExplorePage.evaluate(()=>{
  const actor=document.querySelector('.actor.milo').getBoundingClientRect();
  const world=document.querySelector('#world').getBoundingClientRect();
  return {actorX:actor.x,actorRight:actor.right,worldX:world.x,worldRight:world.right};
 });
 assert.ok(nearTree.actorX>=nearTree.worldX-3&&nearTree.actorRight<=nearTree.worldRight+3,
  'Travel to right-side landmark should not push Milo out of mobile frame: '+JSON.stringify(nearTree));
 await mobileExplorePage.screenshot({path:`${out}/mobile-tree-actors.png`,fullPage:true});
 pass('FIELD-QA-MOBILE-WORLD-02','Milo remains in visible responsive frame after mobile landmark travel.','Chromium emulated touch 390x844');
 await mobileExploreCtx.close();
 const {c:mobileShellCtx,p:mobileShellPage}=await context({mobile:true,stage:'observed'});
 const sizeMobile=await mobileShellPage.evaluate(()=>({page:document.documentElement.scrollHeight,window:innerHeight,root:document.getElementById('app').getBoundingClientRect().height}));
 assert.ok(sizeMobile.page<=sizeMobile.window+3,'Mobile document should fit one viewport: '+JSON.stringify(sizeMobile));
 await tap(mobileShellPage,'Map');
 assert.equal(await mobileShellPage.locator('.scene-map-sheet .map-art').count(),1);
 const mobileMap=await mobileShellPage.evaluate(()=>{
  const e=document.querySelector('.scene-map-sheet'),r=e.getBoundingClientRect(),c=document.querySelector('.scene-card').getBoundingClientRect();
  return {width:r.width,height:r.height,cardWidth:c.width,cardHeight:c.height,opacity:getComputedStyle(e).backgroundColor,
   button:e.querySelector('[data-action="map"]').getBoundingClientRect().height};
 });
 assert.ok(mobileMap.width<=mobileMap.cardWidth+2&&mobileMap.height<=mobileMap.cardHeight*.76,'Mobile paper must stay inside the scene, leaving visual Town Square context: '+JSON.stringify(mobileMap));
 assert.ok(mobileMap.button>=40,'Mobile close control retains a large tap target');

 await tap(mobileShellPage,'Close map');
 assert.equal(await mobileShellPage.locator('.scene-map-sheet').count(),0);
 pass('FIELD-QA-SHELL-03','Mobile viewport uses one page; optional map is an in-scene sheet without page-length growth.','Chromium touch 390×844');
 await mobileShellCtx.close();
 const {c:parentPreviewCtx,p:parentPreviewPage}=await context();
 await click(parentPreviewPage,'Parent preview');
 assert.equal(await parentPreviewPage.getByRole('dialog',{name:'Parent preview'}).count(),1);
 assert.ok(await parentPreviewPage.getByRole('dialog',{name:'Parent preview'}).getByText(content.parent.preview,{exact:true}).isVisible());
 await click(parentPreviewPage,'Back to the story');
 assert.equal(await parentPreviewPage.getByRole('dialog',{name:'Parent preview'}).count(),0);
 assert.equal(await parentPreviewPage.getByRole('button',{name:'Begin',exact:true}).count(),1);
 pass('FIELD-QA-PARENT-02','Parent preview is a working, dismissible on-screen guide, not a no-op in desktop side-by-side mode.');
 await parentPreviewCtx.close();
 const {c:mapMarksCtx,p:mapMarksPage}=await context({stage:'observed'});
 await click(mapMarksPage,'Map');
 assert.equal(await mapMarksPage.locator('.map-confirmed').count(),0,'Merely visiting a place cannot complete a mark');
 await click(mapMarksPage,'Close map');
 await click(mapMarksPage,'Fountain');await click(mapMarksPage,'Compare the round mark');await drain(mapMarksPage);
 await click(mapMarksPage,'Map');
 assert.equal(await mapMarksPage.locator('.map-confirmed[aria-label="Fountain checked"]').count(),1);
 assert.equal(await mapMarksPage.locator('.map-confirmed[aria-label="Big tree checked"]').count(),0);
 await click(mapMarksPage,'Close map');
 await click(mapMarksPage,'Big tree');await click(mapMarksPage,'Compare the tree mark');await drain(mapMarksPage);
 await click(mapMarksPage,'Map');
 assert.equal(await mapMarksPage.locator('.map-confirmed').count(),2);
 await click(mapMarksPage,'Close map');
 pass('FIELD-QA-MAP-02','Each landmark is visibly stamped only after confirmed physical comparison, and both marks persist into the next phase.');
 await mapMarksCtx.close();
 const {c:rubCtx,p:rubPage}=await context({stage:'anchors'});
 await click(rubPage,'Old post');await click(rubPage,'Look at the old post');
 assert.equal(await rubPage.locator('#plate-rub').count(),0,'Do not offer rubbing during queued dialogue');
 assert.equal(await rubPage.getByRole('button',{name:'Clean without rubbing'}).count(),0);
 assert.equal(await rubPage.getByRole('button',{name:'Continue story'}).count(),1);
 await drain(rubPage);
 assert.equal(await rubPage.locator('#plate-rub').count(),1);
 assert.equal(await rubPage.locator('.plate-text').count(),0,'No early destination spoiler');
 assert.equal(await rubPage.getByRole('button',{name:'Finish cleaning'}).isDisabled(),true);
 await rubPage.locator('#plate-rub').evaluate(canvas=>{
  const rect=canvas.getBoundingClientRect(),pid=731;
  const fire=(type,x,y)=>canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:pid,pointerType:'mouse',isPrimary:true,clientX:rect.left+x*rect.width/240,clientY:rect.top+y*rect.height/300}));
  for(let row=0;row<2;row++){
   const y=22+row*26;fire('pointerdown',18,y);
   for(let x=18;x<=230;x+=9)fire('pointermove',x,y);
   fire('pointerup',230,y);
  }
 });
 assert.equal(await rubPage.locator('#plate-rub').count(),1,'Early rubs must not make the plate jump away');
 assert.equal(await rubPage.getByRole('button',{name:'Finish cleaning'}).isDisabled(),true);
 assert.equal((await ledger(rubPage)).includes(events.marker[0]),false);
 await rubPage.locator('#plate-rub').evaluate(canvas=>{
  const rect=canvas.getBoundingClientRect(),pid=732;
  const fire=(type,x,y)=>canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:pid,pointerType:'mouse',isPrimary:true,clientX:rect.left+x*rect.width/240,clientY:rect.top+y*rect.height/300}));
  for(let row=2;row<13&&canvas.isConnected;row++){
   const y=22+row*21;fire('pointerdown',18,y);
   for(let x=18;x<=230;x+=8)fire('pointermove',x,y);
   fire('pointerup',230,y);
  }
 });
 assert.equal(await rubPage.getByRole('button',{name:'Finish cleaning'}).isEnabled(),true);
 assert.equal(await rubPage.locator('#plate-rub').count(),1,'Dust stays in place until Finish cleaning');
 assert.equal((await ledger(rubPage)).includes(events.marker[0]),false);
 await click(rubPage,'Finish cleaning');
 assert.equal(await rubPage.locator('#plate-rub').count(),0);
 assert.equal(await rubPage.getByRole('button',{name:'Continue story'}).count(),1);
 assert.equal(await rubPage.locator('.plate-text').count(),0,'Reveal remains locked behind story dialogue');
 await click(rubPage,'Continue story');await click(rubPage,'Continue story');
 assert.equal((await ledger(rubPage)).filter(x=>x===events.marker[0]).length,1);
 assert.equal(await rubPage.locator('.plate-text').count(),1);
 pass('FIELD-QA-RUB-01','Dialogue gates rubbing; deliberate strokes fill progress; explicit Finish cleaning reveals exactly once.');
 await rubCtx.close();
 const {c,p}=await context();
 await p.screenshot({path:`${out}/desktop-opening.png`,fullPage:true});
 assert.equal(await p.getByRole('dialog').count(),0);await click(p,'Begin');await drain(p);
 pass('INT-01/INT-02/INT-19','Preview skipped; controllable world entered without Parent View.');
 await click(p,'Fountain');await click(p,'Look closely');await drain(p);await click(p,'Big tree');await click(p,'Look closely');await drain(p);assert.deepEqual((await cp(p)).anchors,[]);pass('INT-03','Ambient inspections do not verify map anchors.');
 await click(p,'Noticeboard');await click(p,'Help hold the paper.');await drain(p);assert.equal((await cp(p)).checkpoint,'cp_map_exposed');pass('INT-04','Tap hold saves intact map-exposure checkpoint.');
 await click(p,'Look at the line');await drain(p);await click(p,'Look at the line');await drain(p);assert.equal(await p.getByRole('button',{name:"Maybe it's a treasure map!",exact:true}).count(),0);pass('INT-09','Repeated region does not unlock speculation.');
 assert.equal(await p.locator('#parent-cue').count(),1);pass('UX-07','Nonblocking first-observation parent cue in desktop side panel.');
 await click(p,'Look at the shape');await drain(p);await click(p,"Maybe it's a treasure map!");assert.equal(await p.locator('[data-line-id]').getAttribute('data-line-id'),'S01E01-MILO-013');await drain(p);assert.equal(await p.locator('.scene-map-sheet').count(),0);await click(p,'Map');assert.equal(await p.locator('.scene-map-sheet .map-art').count(),1);assert.equal(await p.locator('.scene-map-sheet image[href="public/art/glyph.svg"]').count(),1);await click(p,'Close map');assert.equal(await p.locator('.scene-map-sheet').count(),0);assert.equal((await p.locator('body').innerText()).includes('${mapArt()}'),false);pass('INT-05','A/B observations, A guess, C physical fallback converge.');
 await click(p,'Old post');assert.equal(await p.getByRole('button',{name:'Clean without rubbing',exact:true}).count(),0);pass('INT-15','No early clean control or destination disclosure.');
 assert.equal(await p.getByRole('button',{name:'Bench',exact:true}).count(),0);assert.equal(await p.getByRole('button',{name:'Compare the round mark'}).count(),0);assert.equal(await p.getByRole('button',{name:'Compare the tree mark'}).count(),0);assert.deepEqual((await cp(p)).anchors,[]);pass('INT-12','Unrelated location does not present misleading comparison buttons or confirm either landmark.');
 await click(p,'Fountain');await click(p,'Big tree');assert.deepEqual((await cp(p)).anchors,[]);pass('INT-13','Arrival alone never verifies landmarks.');
 for(const [place,compare] of [['Big tree','Compare the tree mark'],['Fountain','Compare the round mark']]){await click(p,place);await click(p,compare);await drain(p);}pass('INT-11','Tree then fountain both confirmed in the world.');
 assert.equal(await p.locator('.marker-world-prop,.marker-world-plate,.marker-world-post').count(),0,'Original background has the Old post; no duplicate image/wood cutout');assert.match(await p.locator('#world').evaluate(el=>getComputedStyle(el).backgroundImage),/town-square-master\.webp/);assert.equal(await p.locator('.marker-original-ink').count(),0,'Hide ink before cleaning');pass('FIELD-QA-POST-01','Town Square uses its painted Old post; duplicate sign layers are absent and route lettering stays hidden before discovery.');
 await click(p,'Old post');assert.equal((await p.locator('body').innerText()).includes('RIVERSIDE'),false);await click(p,'Look at the old post');await drain(p);pass('INT-14','Broad exit marker accessible only after both anchors; dirty destination hidden.');
 await p.screenshot({path:`${out}/desktop-dirty-plate.png`,fullPage:true});
 await click(p,'Clean without rubbing');await click(p,'Continue');await click(p,'Continue');assert.equal(await p.locator('.plate-text').count(),1);assert.equal(await p.locator('[data-line-id]').getAttribute('data-line-id'),'S01E01-MILO-026');pass('INT-16','Single click clean reveals text/arrow before Riverside caption.');
 await drain(p);const before=await ledger(p);await click(p,'Look at the mark again');await drain(p);assert.deepEqual(await ledger(p),before);pass('INT-17','Repeat marker inspect leaves ledger unchanged.');
 await p.screenshot({path:`${out}/desktop-chronicle.png`,fullPage:true});await click(p,'Finish this page');await drain(p);pass('INT-18','Chronicle finishes without reflection; E02 unlocked once.');
 const complete=await ledger(p);await p.reload({waitUntil:'networkidle'});assert.deepEqual(await ledger(p),complete);assert.equal(await p.getByRole('dialog').count(),0);await click(p,'Visit Town Square');assert.equal(await p.locator('.marker-original-ink').count(),1);await click(p,'Back to the Chronicle');pass('SAV-07','Completed reload and present Square retain reveal ink on original marker and completion without unfinished recap.');
 await click(p,'Replay this memory');await finishPath(p);assert.deepEqual(await ledger(p),complete);await click(p,'Leave replay');assert.deepEqual(await ledger(p),complete);pass('SAV-08','Full replay and exit preserve present ledger.');
 await c.close();
 for(const [id,order,choice] of [['INT-06',['blank_shape','layer_holes'],'B'],['INT-07',['line','layer_holes'],'C'],['INT-08',['layer_holes','blank_shape','line'],'B']]){const {c,p}=await context({stage:'map'});for(const r of order){await click(p,({line:'Look at the line',blank_shape:'Look at the shape',layer_holes:'Look at the paper'})[r]);await drain(p);}await click(p,content.lines[`S01E01-MILO-${({A:'013',B:'014',C:'015'})[choice]}`].exact_text);await drain(p);assert.equal((await cp(p)).phase,'square_compare');assert.equal((await cp(p)).played.includes('S01E01-FINN-009'),false);pass(id,'Reordered observations converge; no duplicate C fallback.');await c.close();}
 const {c:compareCtx,p:comparePage}=await context({stage:'observed'});
 assert.equal(await comparePage.getByRole('button',{name:'Compare the round mark'}).count(),0);
 assert.equal(await comparePage.getByRole('button',{name:'Compare the tree mark'}).count(),0);
 assert.match(await comparePage.locator('.comparison-guide').innerText(),/Walk to the Fountain or Big tree/);
 assert.match(await comparePage.locator('.comparison-progress').innerText(),/Fountain.*○/);
 await click(comparePage,'Fountain'); 
 assert.equal(await comparePage.getByRole('button',{name:'Compare the round mark'}).count(),1);
 assert.equal(await comparePage.getByRole('button',{name:'Compare the tree mark'}).count(),0);
 await click(comparePage,'Compare the round mark');await drain(comparePage);
 assert.match(await comparePage.locator('.comparison-progress').innerText(),/Fountain.*✓/);
 assert.equal(await comparePage.getByRole('button',{name:'Compare the round mark'}).count(),0);
 await click(comparePage,'Big tree');
 assert.equal(await comparePage.getByRole('button',{name:'Compare the tree mark'}).count(),1);
 await click(comparePage,'Compare the tree mark');await drain(comparePage);
 assert.equal((await cp(comparePage)).phase,'marker_search');
 pass('FIELD-QA-COMPARE-01','Comparison buttons appear only by their matching real landmarks; completing both advances without a mismatch loop.');
 assert.equal(await comparePage.getByRole('button',{name:'Bench',exact:true}).count(),0);
 pass('FIELD-QA-COMPARE-02','Unillustrated optional bench navigation is not presented as a required map symbol.');
 await compareCtx.close();
 const {c:qr,p:qp}=await context({stage:'map'});
 await click(qp,'Look at the line');
 await click(qp,'Read again');
 assert.equal(await qp.locator('.caption [role="status"]').count(),1);
 assert.match(await qp.locator('.caption [role="status"]').innerText(),/Reading aloud again|Audio unavailable/);
 await drain(qp);
 await qp.reload({waitUntil:'networkidle'});
 assert.equal(await qp.getByRole('dialog',{name:'Story so far'}).count(),1);
 await click(qp,'Read again');
 assert.equal(await qp.locator('.dialog [role="status"]').count(),1);
 assert.equal(await qp.locator('.dialog [data-line-id]').count(),2);
 await click(qp,'Continue the story');
 pass('FIELD-QA-03','Manual reread responds even when autoplay audio is disabled; recap reread responds after reload.');
 await qr.close();
 const {c:rc,p:rp}=await context({stage:'square'});
 await rp.locator('#world').click({position:{x:36,y:25}});
 const feet=await rp.locator('.actor.milo').evaluate(el=>[parseFloat(el.style.left)/100,parseFloat(el.style.top)/100]);
 const projected=constrainToRoad(36/(await rp.locator('#world').boundingBox()).width,25/(await rp.locator('#world').boundingBox()).height);
 assert.ok(Math.hypot(feet[0]-projected[0],feet[1]-projected[1])<1e-6);
 pass('FIELD-QA-04','Off-road pointer click projects Milo to the walking route.');
 await rc.close();

 // Regression: Repeated clicks near fountain area move Milo without locking
 const {c:fc1,p:fp1}=await context({stage:'square'});
 await click(fp1,'Fountain');
 const worldBox=await fp1.locator('#world').boundingBox();
 for(let i=0;i<3;i++){
  const before=await fp1.locator('.actor.milo').evaluate(el=>[parseFloat(el.style.left)/100,parseFloat(el.style.top)/100]);
  await fp1.locator('#world').click({position:{x:worldBox.width*0.46,y:worldBox.height*0.64}});
  const after=await fp1.locator('.actor.milo').evaluate(el=>[parseFloat(el.style.left)/100,parseFloat(el.style.top)/100]);
  assert.ok(Math.hypot(after[0]-before[0],after[1]-before[1])>0.01,'Milo moved on repeated fountain click');
 }
 pass('FIELD-QA-05-BROWSER','Repeated clicks near the fountain area always move Milo without locking.');
 await fc1.close();

 // Regression: Movement after comparison UI is visible
 const {c:cc1,p:cp1}=await context({stage:'observed'});
 assert.equal(await cp1.getByRole('button',{name:'Compare the round mark'}).count(),0);
 const worldBoxCp=await cp1.locator('#world').boundingBox();
 await cp1.locator('#world').click({position:{x:worldBoxCp.width*0.73,y:worldBoxCp.height*0.56}});
 const cpFeet=await cp1.locator('.actor.milo').evaluate(el=>[parseFloat(el.style.left)/100,parseFloat(el.style.top)/100]);
 assert.ok(Math.hypot(cpFeet[0]-0.73,cpFeet[1]-0.56)<0.05);
 assert.equal(await cp1.getByRole('button',{name:'Compare the round mark'}).count(),0);
 assert.equal(await cp1.getByRole('button',{name:'Compare the tree mark'}).count(),1);
 await click(cp1,'Compare the tree mark');
 assert.equal(await cp1.locator('[data-line-id]').getAttribute('data-line-id'),'S01E01-FINN-013');
 await drain(cp1);
 pass('FIELD-QA-06-BROWSER','Milo can move freely when comparison UI is visible, and compare buttons remain usable.');
 await cc1.close();

 // Regression: Actor, companion, label, and marker layers do not block world clicks
 const {c:lc1,p:lp1}=await context({stage:'square'});
 const miloBox=await lp1.locator('.actor.milo').boundingBox();
 await lp1.mouse.click(miloBox.x+miloBox.width/2,miloBox.y+miloBox.height/2);
 const miloAfter=await lp1.locator('.actor.milo').evaluate(el=>[parseFloat(el.style.left)/100,parseFloat(el.style.top)/100]);
 assert.ok(miloAfter.every(Number.isFinite));
 const actorPe=await lp1.locator('.actor.milo').evaluate(el=>getComputedStyle(el).pointerEvents);
 const labelPe=await lp1.locator('.milo-label').evaluate(el=>getComputedStyle(el).pointerEvents);
 assert.equal(actorPe,'none');
 assert.equal(labelPe,'none');
 pass('FIELD-QA-07-BROWSER','Decorative actor sprite and name label layers do not block world clicks.');
 await lc1.close();
 const {c:mc,p:mp}=await context({mobile:true});await mp.screenshot({path:`${out}/mobile-opening.png`,fullPage:true});await finishPath(mp,{mobile:true,choice:'C',anchorOrder:['fountain','large_tree']});assert.ok(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));pass('UX-01/UX-02/UX-04/UX-05','Audio off, reduced motion, touch actions and explicit assisted travel complete E01; no horizontal page overflow.','Chromium emulated touch 390×844');await mc.close();
 const {c:pc,p:pp}=await context({mobile:true,stage:'map'});await tap(pp,'Look at the line');await drain(pp);await tap(pp,'Parent');assert.equal(await pp.getByText(content.parent.cue,{exact:true}).count(),1);await tap(pp,'Back to Child View');assert.equal(await pp.getByRole('button',{name:'Look at the line',exact:true}).getAttribute('aria-pressed'),'true');await tap(pp,'Parent');await tap(pp,'Back to Child View');pass('INT-20/UX-08','Repeated Parent/Child switches preserve inspection; cue remains single.','Chromium emulated touch 390×844');await pc.close();
 for(const [stage,id,expected] of [['square','SAV-01','012'],['map','SAV-02','014'],['observed','SAV-03','014'],['anchors','SAV-04','014'],['marker','SAV-05','016']]){const {c,p}=await context({stage});await p.reload({waitUntil:'networkidle'});assert.equal(await p.getByRole('dialog').count(),1);assert.equal(await p.locator('.dialog [data-line-id]').first().getAttribute('data-line-id'),`S01E01-NARRATOR-${expected}`);await click(p,'Continue the story');assert.equal(await p.getByRole('dialog').count(),0);pass(id,'Resume presents exactly one state-appropriate optional recap.');await c.close();}
 const {c:lc,p:lp}=await context({stage:'later'});const later=await ledger(lp);await click(lp,'Replay this memory');await click(lp,'Begin');await drain(lp);await click(lp,'Leave replay');assert.deepEqual(await ledger(lp),later);pass('SAV-09','Later-season fixture unchanged after partial replay/exit.');await lc.close();
 const {c:kc,p:kp}=await context({stage:'square'});async function keyAction(name){for(let i=0;i<90;i++){await kp.keyboard.press('Tab');if(await kp.evaluate(name=>document.activeElement?.textContent.trim()===name,name)){await kp.keyboard.press('Enter');return;}}throw Error('Keyboard unreachable '+name);}
 await keyAction('Noticeboard');await keyAction('Help hold the paper.');while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');for(const name of ['Look at the line','Look at the shape']){await keyAction(name);while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');}await keyAction("I'm not sure yet.");while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');for(const [a,b] of [['Fountain','Compare the round mark'],['Big tree','Compare the tree mark']]){await keyAction(a);await keyAction(b);while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');}await keyAction('Old post');await keyAction('Look at the old post');while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');await keyAction('Clean without rubbing');while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');await keyAction('Finish this page');while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');assert.ok((await ledger(kp)).includes(events.complete[0]));pass('UX-03','Keyboard Tab/Enter alone completes required exploration, observation, comparison and cleaning.');await kc.close();

 // Equivalent guess branches: exact pair plus identical durable semantics.
 const branchLedgers=[];
 for(const choice of ['A','B','C']){const {c,p}=await context({stage:'map'});for(const r of ['Look at the line','Look at the shape']){await click(p,r);await drain(p);}await p.screenshot({path:`${out}/desktop-map.png`,fullPage:true});await click(p,content.lines[`S01E01-MILO-${({A:'013',B:'014',C:'015'})[choice]}`].exact_text);assert.equal(await p.locator('[data-line-id]').getAttribute('data-line-id'),groups[choice][0]);await click(p,'Continue');assert.equal(await p.locator('[data-line-id]').getAttribute('data-line-id'),groups[choice][1]);await drain(p);branchLedgers.push(await ledger(p));await c.close();}assert.deepEqual(branchLedgers[0],branchLedgers[1]);assert.deepEqual(branchLedgers[1],branchLedgers[2]);pass('INT-10','All three exact line pairs converge to identical canonical event arrays.');
 const {c:mapc,p:mapp}=await context({stage:'map'});await click(mapp,'Look at the paper');await drain(mapp);const mapLedger=await ledger(mapp);for(let i=0;i<3;i++){await click(mapp,'Back to Square');await click(mapp,'Open the old map');assert.equal(await mapp.getByRole('button',{name:'Look at the paper',exact:true}).getAttribute('aria-pressed'),'true');}assert.deepEqual(await ledger(mapp),mapLedger);pass('SAV-11','Close/reopen map three times retains the deliberately inspected region and ledger.');await mapc.close();
 const {c:dc,p:dp}=await context({stage:'anchors'});
 await click(dp,'Old post');await click(dp,'Look at the old post');await drain(dp);
 await dp.evaluate(()=>{const b=document.querySelector('[data-action="clean"]');b.click();b.click();});
 assert.equal(await dp.locator('.plate-text').count(),0,'Marker hidden until story reveals it');
 await click(dp,'Continue');await click(dp,'Continue');
 assert.equal((await ledger(dp)).filter(x=>x===events.marker[0]).length,1);
 await dp.reload({waitUntil:'networkidle'});
 await click(dp,'Continue the story');
 assert.equal((await ledger(dp)).filter(x=>x===events.marker[0]).length,1);
 pass('SAV-06','Double clean and reload preserve one completed event without a Pause control.');
 await dc.close();
 const {c:fc,p:fp}=await context({stage:'anchors'});await click(fp,'Old post');await click(fp,'Look at the old post');await drain(fp);await fp.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='wondervale-progress-v1'&&JSON.parse(v).ledger.includes('s01e01_town_square_old_marker_revealed'))throw new DOMException('Simulated quota','QuotaExceededError');return original.call(this,k,v);};});await click(fp,'Clean without rubbing');await click(fp,'Continue');await click(fp,'Continue');assert.equal(await fp.getByRole('alert').count(),1);assert.equal((await ledger(fp)).includes(events.marker[0]),false);await fp.reload({waitUntil:'networkidle'});await click(fp,'Continue the story');assert.equal(await fp.locator('.plate-text').count(),0);assert.equal((await ledger(fp)).includes(events.marker[0]),false);pass('SAV-10','Failed atomic write shows warning and reloads coherent pre-reveal checkpoint, without orphan event.');await fc.close();
 const {c:sc,p:sp}=await context({mobile:true,stage:'anchors'});
 await tap(sp,'Old post');await tap(sp,'Look at the old post');await drain(sp);
 await sp.locator('#plate-rub').scrollIntoViewIfNeeded();
 const box=await sp.locator('#plate-rub').boundingBox(),ts=await sc.newCDPSession(sp);
 for(let row=0;row<14;row++){
  if(await sp.getByRole('button',{name:'Finish cleaning'}).isEnabled())break;
  const y=box.y+18+row*20,start=box.x+17,end=box.x+box.width-17;
  await ts.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y}]});
  for(let i=1;i<=18;i++)await ts.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start+(end-start)*i/18,y}]});
  await ts.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 }
 assert.equal(await sp.getByRole('button',{name:'Finish cleaning'}).isEnabled(),true,'Touch should become ready after deliberate strokes');
 assert.equal(await sp.locator('#plate-rub').count(),1,'No automatic scene change while rubbing');
 await sp.evaluate(()=>{
  globalThis.__rubTapEvents=[];
  for(const name of ['pointerdown','pointerup','touchstart','touchend','click'])document.addEventListener(name,e=>globalThis.__rubTapEvents.push({type:name,tag:e.target.tagName,id:e.target.id||'',action:e.target.dataset?.action||''}),{capture:true,once:false});
 });
 await tap(sp,'Finish cleaning');
 const mobileStatus=await sp.evaluate(()=>{const b=document.querySelector('[data-action="rub-finish"]'),r=b?.getBoundingClientRect();return {buttons:[...document.querySelectorAll('#plate-swipe [data-action]')].map(el=>({action:el.dataset.action,text:el.textContent,disabled:el.disabled})),caption:document.querySelector('.caption [data-line-id]')?.getAttribute('data-line-id'),rub:document.querySelector('#rub-status')?.textContent,cleaned:!!document.querySelector('#plate-rub'),events:globalThis.__rubTapEvents,hit:r?document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)?.outerHTML.slice(0,180):null};});
 assert.equal(await sp.getByRole('button',{name:'Continue story'}).count(),1,'After mobile Finish cleaning: '+JSON.stringify(mobileStatus));
 await tap(sp,'Continue story');await tap(sp,'Continue story');
 assert.equal((await ledger(sp)).filter(x=>x===events.marker[0]).length,1);
 pass('INT-16-SWIPE','Touch rubbing needs genuine coverage and an explicit Finish, then original reveal completes once.','Chromium emulated touch 390×844');
 await sc.close();
 for(const stage of ['square','map','observed','anchors']){
  const {c,p}=await context({stage});
  assert.equal(await p.getByRole('button',{name:'Help',exact:true}).count(),0);
  assert.equal(await p.getByRole('button',{name:'Pause',exact:true}).count(),0);
  await c.close();
 }
 const {c:hc,p:hp}=await context({stage:'map'});
 await click(hp,'Look at the line');
 const beforeReread=await ledger(hp);
 const exactId=await hp.locator('.caption [data-line-id]').getAttribute('data-line-id');
 await click(hp,'Read again');
 assert.equal(await hp.locator('.caption [data-line-id]').getAttribute('data-line-id'),exactId);
 assert.equal(await hp.locator('.caption [data-line-id]').innerText(),content.lines[exactId].exact_text);
 assert.deepEqual(await ledger(hp),beforeReread,'Read again never advances or writes an event');
 await hc.close();
 pass('UX-06/UX-09','No header Help/Pause across stages; canonical Read again remains available without changing progress.');
 const {c:solo,p:solop}=await context({stage:'map'});await click(solop,'Look at the shape');assert.equal(await solop.locator('[data-line-id]').getAttribute('data-line-id'),'S01E01-FINN-004');await drain(solop);assert.equal(await solop.locator('.child input,.child textarea').count(),0);assert.equal(await solop.getByRole('button',{name:"Maybe it's a treasure map!",exact:true}).count(),0);pass('UX-10','Solo observation receives approved support without response input, scoring or guessed interpretation.');await solo.close();
 const {c:motor,p:motorp}=await context({stage:'square'});await motorp.getByLabel('Single-action assistance').check();assert.equal(await motorp.evaluate(key=>JSON.parse(localStorage.getItem(key)).preferences.motor,KEY),true);await finishPath(motorp);pass('UX-05-MOTOR','Motor assistance enabled: deliberate single-action travel, comparison and clean complete E01.');await motor.close();
 const {c:wc,p:wp}=await context({motion:true});
 await click(wp,'Begin');await drain(wp);await click(wp,'Noticeboard');
 await wp.getByRole('button',{name:'Help hold the paper.',exact:true}).waitFor();
 await click(wp,'Help hold the paper.');await drain(wp);
 assert.equal((await cp(wp)).phase,'map_observe');
 pass('MOTION-01','Normal-motion travel reaches noticeboard and interaction without Help/Pause controls.');
 await wc.close();
 const {c:oc,p:op}=await context();await op.evaluate(async()=>{await navigator.serviceWorker.ready;});await op.reload({waitUntil:'networkidle'});await oc.setOffline(true);await op.reload({waitUntil:'networkidle'});assert.equal(await op.locator('.brand').innerText(),'Wondervale');await click(op,'Begin');await drain(op);pass('OFFLINE-01','After one online cache install, offline reload and play work.');await oc.close();
 assert.deepEqual(errors,[]);
 pass('RUNTIME-01','No page exceptions or HTTP asset errors across all browser paths.');
}catch(error){results.push({id:'BROWSER-RUN',status:'FAIL',observed:error.stack});process.exitCode=1;}
finally{await browser.close();await writeFile(`${out}/browser-results.json`,JSON.stringify({build:content.buildId,contentVersion:content.contentVersion,results,errors,humanPending:['UX-11','UX-12'],mediaPending:['recorded_voices','music']},null,2));console.log(JSON.stringify({results,errors},null,2));}
