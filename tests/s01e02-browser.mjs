import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';

const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const errors=[],report=[];
const browser=await chromium.launch({headless:true});
const fakeE01={schemaVersion:1,contentVersion:'s01e01-script-v1',ledger:['episode_completed:s01e01','s01e01_town_square_old_marker_revealed','s01e01_old_route_points_toward_riverside'],checkpoint:{phase:'completed'}};
async function open({width=1366,height=900,authorized=true,touch=false}={}){
 const ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch,reducedMotion:'reduce'});
 if(authorized)await ctx.addInitScript(data=>{localStorage.setItem('wondervale-progress-v1',JSON.stringify(data));},fakeE01);
 const p=await ctx.newPage();
 p.on('pageerror',e=>errors.push(e.message));
 p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await p.goto(base+'/e02/',{waitUntil:'networkidle'});
 await p.getByRole('heading',{name:authorized?'Find the way that is safe today':'Riverside is next'}).waitFor();
 return {ctx,p};
}
async function lines(p){
 let i=0;
 while(await p.getByRole('button',{name:'Continue',exact:true}).count()){
  await p.getByRole('button',{name:'Continue',exact:true}).click();
  assert.ok(++i<80,'E02 line queue failed to drain');
 }
 return i;
}
// Owner's regression was at line five, not merely the first or last line.
// Verify all 13 actual opening lines with changing narrator/C01 SVG portraits,
// preserving one decoded image and landscape geometry throughout the queue.
async function verifyStableIntroduction(p,width,height){
 const shortLandscape=height<400&&width>height;
 let initial=null;
 await p.locator('#world img.backdrop').evaluate(img=>img.decode());
 await p.evaluate(()=>{window.__e02StableBackdrop=document.querySelector('#world img.backdrop');});
 for(let index=0;index<13;index++){
  const geometry=await p.evaluate(()=>{
   const rect=el=>{if(!el)return null;const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
   const caption=document.querySelector('.caption:not(.idle)');
   return {viewport:{width:innerWidth,height:innerHeight},world:rect(document.querySelector('#world')),
    caption:rect(caption),text:rect(caption?.querySelector('.caption-text')),
    controls:[...(caption?.querySelectorAll('button')||[])].map(rect),
    documentWidth:document.documentElement.scrollWidth,
    imageUnchanged:window.__e02StableBackdrop===document.querySelector('#world img.backdrop'),
    imageComplete:!!document.querySelector('#world img.backdrop')?.complete};
  });
  assert.ok(geometry.imageUnchanged,'Backdrop must not be recreated at opening line '+(index+1));
  assert.ok(geometry.imageComplete,'Backdrop should remain loaded at line '+(index+1));
  assert.ok(geometry.caption&&geometry.world,'Scene and caption present at line '+(index+1));
  assert.ok(geometry.documentWidth<=width+2,'No horizontal page clipping at line '+(index+1)+' '+JSON.stringify(geometry));
  if(shortLandscape){
   assert.ok(geometry.caption.left>=-1&&geometry.caption.right<=width+1,
    'Dialogue box stays inside phone width at line '+(index+1)+' '+JSON.stringify(geometry));
   assert.ok(geometry.controls.every(b=>b.left>=-1&&b.right<=width+1&&b.bottom<=height+2),
    'Continue and Listen stay on screen at line '+(index+1)+' '+JSON.stringify(geometry));
   assert.ok(geometry.caption.bottom<=height+2,
    'Dialogue box stays within landscape height at line '+(index+1)+' '+JSON.stringify(geometry));
   assert.ok(geometry.world.width>=350,'Opening world must stay large at line '+(index+1));
   if(initial)assert.ok(Math.abs(geometry.world.width-initial.world.width)<2&&
     Math.abs(geometry.world.height-initial.world.height)<2,
     'Landscape scene size changes while Continue is clicked at line '+(index+1)+' '+JSON.stringify({initial,geometry}));
  }
  if(!initial)initial=geometry;
  if(index===4)await p.screenshot({path:'test-results/e02-intro-line-05-'+width+'x'+height+'.png',fullPage:true});
  assert.equal(await p.getByRole('button',{name:'Continue',exact:true}).count(),1,'13 canonical opening lines required, step '+index);
  await p.getByRole('button',{name:'Continue',exact:true}).tap();
 }
 assert.equal(await p.locator('.child.phase-explore').count(),1,'After line 13, switch to normal exploration');
 assert.equal(await p.locator('#world img.backdrop').evaluate(el=>el===window.__e02StableBackdrop),true,
  'Intro-to-explore transition should retain the decoded background image');
 const after=await p.evaluate(()=>{
  const r=document.querySelector('#world').getBoundingClientRect();
  return {left:r.left,right:r.right,width:r.width,docWidth:document.documentElement.scrollWidth,
   docHeight:document.documentElement.scrollHeight,viewportHeight:innerHeight};
 });
 assert.ok(after.left>=-2&&after.right<=width+2&&after.docWidth<=width+2,
  'Exploration after final Continue must stay within full landscape '+JSON.stringify(after));
 if(shortLandscape)assert.ok(after.docHeight<=height+3&&after.width>=370,
  'After dialogue, full landscape must not collapse or start page-scrolling '+JSON.stringify(after));
}
// Chronicle is an internally scrolling evidence book with a fixed action row.
async function checkPhoneChronicle(page,width,height,reading=false){
 const g=await page.evaluate(()=>{
  const box=sel=>{const r=document.querySelector(sel)?.getBoundingClientRect();return r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}:null;};
  const sc=document.querySelector('.chronicle-scroll');
  const cont=document.querySelector('.caption [data-a="next"]');
  return {article:box('#chronicle'),scroll:box('.chronicle-scroll'),
   first:box('.chronicle-evidence img'),second:box('.chronicle-evidence > div:nth-child(2) img'),
   action:box('.chronicle-actions'),read:box('[data-a="chronicle"]'),finish:box('[data-a="finish"]'),
   caption:box('.caption:not(.idle)'),cont:box('.caption [data-a="next"]'),
   docHeight:document.documentElement.scrollHeight,docWidth:document.documentElement.scrollWidth,
   contentHeight:sc?.scrollHeight,visibleHeight:sc?.clientHeight,
   contWrap:cont?getComputedStyle(cont).whiteSpace:null};
 });
 assert.equal(await page.locator('#world').count(),0,'Chronicle must not stack the river panorama over the book');
 assert.equal(await page.getByText('MARKET LANE →',{exact:true}).count(),1,'The gated Market Lane clue stays visible');
 assert.ok(g.article&&g.scroll&&g.first&&g.second&&g.action,'Then/Now pictures and Chronicle action must exist '+JSON.stringify(g));
 assert.ok(g.docWidth<=width+3,'No horizontal page overflow '+JSON.stringify(g));
 if(height<400){
  assert.ok(g.article.left>=-2&&g.article.right<=width+2&&g.article.top>=-2&&g.action.bottom<=height+3,
   'Chronicle and action must fit phone landscape '+JSON.stringify(g));
  assert.ok(g.action.height>=44&&g.contentHeight>g.visibleHeight+4,
   'Chronicle text should scroll internally '+JSON.stringify(g));
  assert.ok(g.docHeight<=height+3,'No document scrolling during Chronicle '+JSON.stringify(g));
  if(g.caption)assert.ok(g.caption.bottom<=height+3,'Dialogue must remain in the phone viewport '+JSON.stringify(g));
 }
 if(reading){
  assert.ok(g.caption&&g.cont,'Continue button must remain available during Chronicle');
  assert.equal(g.read,null);
  assert.equal(g.finish,null,'Finish stays gated during narration');
  if(height<400)assert.equal(g.contWrap,'nowrap');
 }else assert.equal(g.caption,null,'No idle dialogue panel should take space');
 const decoded=await page.locator('.chronicle-evidence img').evaluateAll(els=>Promise.all(els.map(async img=>{await img.decode();return img.naturalWidth;})));
 assert.deepEqual(decoded,[1672,1672],'Both approved evidence paintings decode');
 return g;
}
async function action(p,name){await p.getByRole('button',{name,exact:true}).first().click();}
async function saved(p){return p.evaluate(()=>JSON.parse(localStorage.getItem('wondervale-s01e02-progress-v1')));}
const passed=(id,note)=>{report.push({id,status:'PASS',note});process.stdout.write('PASS '+id+' '+note+'\n');};
try{
 {const {ctx,p}=await open({authorized:false});
  assert.equal(await p.getByRole('button',{name:'Begin Riverside adventure'}).count(),0);
  await ctx.close();passed('E02-N02','E01 prerequisite truly gates the episode');
 }
 // The completed Town Square must hand off to E02 on the same origin, without losing progress.
 {const handoffCtx=await browser.newContext({viewport:{width:667,height:375},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
  await handoffCtx.addInitScript(data=>{localStorage.setItem('wondervale-progress-v1',JSON.stringify(data));},fakeE01);
  const handoffPage=await handoffCtx.newPage();
  handoffPage.on('pageerror',e=>errors.push(e.message));
  await handoffPage.goto(base+'/',{waitUntil:'networkidle'});
  const next=handoffPage.getByRole('link',{name:'Continue to Episode 2 · Riverside →',exact:true});
  assert.equal(await next.count(),1);
  await next.click();
  await handoffPage.waitForURL('**/e02/');
  await handoffPage.getByRole('button',{name:'Begin Riverside adventure'}).waitFor();
  assert.deepEqual(await handoffPage.evaluate(()=>JSON.parse(localStorage.getItem('wondervale-progress-v1')).ledger),fakeE01.ledger);
  await handoffCtx.close();
  passed('E01-E02-REAL-LINK','Town Square completion links to unlocked E02 on same origin and preserves E01 ledger');
 }
 const {ctx,p}=await open();
 assert.equal(await p.getByText('MARKET LANE →',{exact:true}).count(),0);
 await action(p,'Begin Riverside adventure');
  assert.equal(await p.locator('#world').getAttribute('data-view'),'r0','Opening dialogue must already show Riverside');
  assert.equal(await p.locator('img.backdrop').evaluate(async img=>{await img.decode();return img.naturalWidth;}),1672);
 assert.ok((await p.locator('[data-line]').first().getAttribute('data-line')).startsWith('S01E02-'));
 await lines(p);
 const pavement=await p.locator('#world .actor').evaluateAll(els=>els.map(el=>({
   x:parseFloat(el.style.getPropertyValue('--x')),y:parseFloat(el.style.getPropertyValue('--y'))
  })));
  assert.equal(pavement.length,3);
  assert.ok(pavement.every(q=>q.x>=8&&q.x<=92&&q.y>=85&&q.y<=92),'R0 actor feet must be on near-bank paving '+JSON.stringify(pavement));
  assert.equal(await p.locator('img.backdrop').evaluate(async img=>{await img.decode();return img.naturalWidth;}),1672,'R0 painting decodes');
  passed('E02-S01','Mandatory fence-only opening played line-by-line');
 // Touch/keyboard alike have explicit accessible Go-to station actions.
 await action(p,'Go to public lookout');await lines(p);
 const arrived=await saved(p);
 assert.equal(arrived.ledger.filter(x=>x==='s01e02_riverside_overlook_accessible').length,1);
 assert.equal(arrived.observed.length,0,'Arrival alone cannot count as inspection');
 assert.equal(await p.getByText('MARKET LANE →',{exact:true}).count(),0);
 await action(p,'Look across');assert.ok(await p.locator('img.backdrop').getAttribute('src').then(s=>s.endsWith('-r2.webp')));
  assert.equal(await p.locator('#world .actor').count(),0,'R2 close-up cannot place actors in the river');
  assert.equal(await p.locator('img.backdrop').evaluate(async img=>{await img.decode();return img.naturalWidth;}),1672,'R2 painting decodes');
 await lines(p);assert.deepEqual((await saved(p)).observed,['gap']);
 passed('E02-G04/I03','Lookout event once, child must separately inspect gap');
 await action(p,'Back to Riverside');
  await action(p,'Walk to old stones');await action(p,'Look at old stones');
  assert.equal(await p.locator('#world .actor').count(),0,'R1 close-up cannot place actors in the river');
  assert.equal(await p.locator('img.backdrop').evaluate(async img=>{await img.decode();return img.naturalWidth;}),1672,'R1 painting decodes');
  await lines(p);await action(p,'Back to Riverside');
  assert.equal(await p.locator('#world .actor').count(),3,'R0 restores all three actors');
 assert.deepEqual(new Set((await saved(p)).observed),new Set(['stones','gap']));
 await action(p,'Open old map');
  assert.equal(await p.getByRole('dialog',{name:'Old map fragment'}).count(),1,'Old map must be its own visible dialog');
  await action(p,'Close map');await lines(p);
  await action(p,'Open evidence notebook');
  assert.equal(await p.locator('#world').count(),0,'Notebook is its own thinking screen, not beneath the river scene');
  assert.equal(await p.locator('#notebook').count(),1,'Notebook visible even during its initial guidance');
  await lines(p);
  assert.equal(await p.locator('#notebook').count(),1);
  await action(p,'Not sure yet');
  assert.equal((await saved(p)).queue.length,3,'Uncertainty must offer approved Nia/Finn/UI spoken help');
  assert.equal((await saved(p)).linked,false,'Help cannot count as the right answer');
  assert.equal(await p.locator('#notebook').count(),1,'Notebook remains visible behind guidance');
  await lines(p);
  assert.equal((await saved(p)).phase,'notebook','User can still answer after help');
 assert.equal(await p.getByText('MARKET LANE →',{exact:true}).count(),0);
 const parent=await p.locator('#parent').innerText();
 assert.ok(parent.includes("doesn't fit Milo's first idea"),'Parent cue now eligible');
 await p.locator('[data-a="fact-stones"]').click();await lines(p);
 assert.equal((await saved(p)).linked,false);
 await p.locator('[data-a="fact-gap"]').click();await lines(p);
 assert.equal((await saved(p)).linked,true);
 passed('E02-I02/R01','Gap-first order and unscored old-stones recovery');
 await action(p,'I was wrong about only the fence.');await lines(p);
 assert.equal((await saved(p)).ledger.filter(x=>x==='s01e02_old_connection_changed_confirmed').length,1);
 assert.equal(await p.getByText('MARKET LANE →',{exact:true}).count(),0);
 await action(p,'Go to public lookout');
 await action(p,'Look at the old mark');await lines(p);
 assert.equal((await saved(p)).ledger.filter(x=>x==='s01e02_market_lane_marker_recorded').length,1);
 assert.equal(await p.getByText('MARKET LANE →',{exact:true}).count(),1);
 passed('E02-M01/M02','Market sign and once-only event strictly gated');
 await action(p,'Read the Chronicle');await lines(p);
 await action(p,'Finish this chapter');
 const final=await saved(p);
 assert.equal(final.phase,'completed');
 assert.equal(final.ledger.filter(x=>x==='episode_completed:s01e02').length,1);
 await p.reload({waitUntil:'networkidle'});
 assert.equal(await p.getByRole('heading',{name:'Chapter complete'}).count(),1);
 assert.equal((await saved(p)).ledger.length,4);
 await p.screenshot({path:'test-results/e02-desktop-complete.png',fullPage:true});
 passed('E02-C02','Complete and restore four deduplicated E02 canonical events');
 await ctx.close();
 // E02 previously tested only portrait widths and allowed page-length phone
 // layouts. Exercise the actual ~568x320 CSS viewport of the owner's iPhone
 // (1136x639 physical screenshot), not a 1136x639 CSS desktop equivalent.
 let chronicleCheckpoint=null;
 for(const [width,height] of [[568,320],[667,375],[390,844]]){
  const {ctx:phoneCtx,p:phone}=await open({width,height,authorized:true,touch:true});
  await phone.getByRole('button',{name:'Begin Riverside adventure'}).tap();
  const opening=await phone.evaluate(()=>{
   const rect=s=>{const r=document.querySelector(s)?.getBoundingClientRect();return r?{width:r.width,height:r.height,bottom:r.bottom}:null;};
   return {scene:rect('#world'),caption:rect('.caption:not(.idle)')};
  });
  assert.ok(opening.scene&&opening.caption,'Opening picture and dialogue appear together');
  if(height<400){
   assert.ok(opening.scene.width>=350,'Short-landscape opening art visible '+JSON.stringify(opening));
   assert.ok(opening.caption.bottom<=height+3,'Opening caption remains inside phone '+JSON.stringify(opening));
  }
  await verifyStableIntroduction(phone,width,height);
  const rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
  const geom=await phone.evaluate(()=>{
   const box=s=>{const r=document.querySelector(s)?.getBoundingClientRect();return r?{left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}:null;};
   const actions=[...document.querySelectorAll('.scene-card .actions button')].map(el=>{
    const r=el.getBoundingClientRect();return {label:el.innerText.trim(),top:r.top,bottom:r.bottom,height:r.height};
   });
   return {world:box('#world'),frame:box('.world-frame'),scene:box('.scene-card'),
    dock:box('.scene-card .actions'),captionIdleHidden:getComputedStyle(document.querySelector('.caption.idle')).display==='none',
    actions,documentWidth:document.documentElement.scrollWidth,documentHeight:document.documentElement.scrollHeight,
    app:box('#app')};
  });
  assert.ok(geom.world&&geom.frame&&geom.dock,'Riverside artwork and travel controls must render on '+width);
  assert.ok(Math.abs(geom.world.width/geom.world.height-1672/941)<.03,'Riverside art ratio must stay uncropped '+JSON.stringify({width,height,geom}));
  assert.ok(geom.world.right<=width+2&&geom.world.left>=-2,'Riverside art must fit phone width '+JSON.stringify({width,height,geom}));
  assert.ok(geom.documentWidth<=width+3,'E02 must not create horizontal document scrolling '+JSON.stringify({width,height,geom}));
  assert.ok(geom.captionIdleHidden,'Idle free roam should not consume a dialogue panel on touch phones');
  assert.ok(geom.actions.every(a=>a.height>=44),'All explicit walk targets remain >=44px');
  if(height<400){
   assert.ok(geom.world.width>=370,'Short landscape art should be legible rather than a central thumbnail '+JSON.stringify({width,height,geom}));
   assert.ok(geom.documentHeight<=height+3,'Normal short-landscape exploration should fit one viewport '+JSON.stringify({width,height,geom}));
   assert.ok(geom.actions.every(a=>a.top>=geom.world.bottom-2&&a.bottom<=height+3),
    'Travel controls stay under the scene and in the window '+JSON.stringify({width,height,geom}));
  }
  await phone.getByRole('button',{name:'Child / Parent View'}).tap();
  assert.equal(await phone.locator('#parent').evaluate(el=>getComputedStyle(el).display!=='none'),true);
  assert.equal(await phone.locator('.child').evaluate(el=>getComputedStyle(el).display==='none'),true,'Phone parent mode must not stack below inaccessible child scene');
  await phone.getByRole('button',{name:'Child / Parent View'}).tap();
  assert.ok(await phone.locator('.child').evaluate(el=>getComputedStyle(el).display!=='none'));
  await phone.getByRole('button',{name:'Go to public lookout'}).first().tap();
  const story=phone.locator('.caption:not(.idle)');
  assert.equal(await story.count(),1,'Lookout arrival should show real story, not idle placeholder');
  const dialogue=await story.evaluate(el=>{
   const b=el.getBoundingClientRect(),buttons=[...el.querySelectorAll('button')].map(x=>{
    const r=x.getBoundingClientRect();return {label:x.textContent.trim(),top:r.top,bottom:r.bottom,height:r.height};
   });return {top:b.top,bottom:b.bottom,buttons};
  });
  if(height<400){
   assert.ok(dialogue.bottom<=height+3,'Active RPG dialogue stays in short-landscape phone screen '+JSON.stringify({width,height,dialogue}));
   assert.ok(dialogue.buttons.every(x=>x.height>=44&&x.bottom<=height+3),'Continue/Listen stay touchable in phone dialogue '+JSON.stringify({width,height,dialogue}));
  }
  await lines(phone);
  if(width===568){
   await phone.getByRole('button',{name:'Look across'}).tap();await lines(phone);
   assert.equal(await phone.locator('#world .actor').count(),0);
   await phone.getByRole('button',{name:'Back to Riverside'}).tap();
   await phone.locator('.scene-card .actions [data-a="go-stones"]').tap();
   await phone.getByRole('button',{name:'Look at old stones'}).tap();await lines(phone);
   assert.equal(await phone.locator('#world .actor').count(),0);
   await phone.getByRole('button',{name:'Back to Riverside'}).tap();
   await phone.getByRole('button',{name:'Open old map'}).tap();
   const modal=phone.getByRole('dialog',{name:'Old map fragment'});
   const modalBounds=await modal.evaluate(el=>{const r=el.querySelector('.card').getBoundingClientRect();return {top:r.top,bottom:r.bottom};});
   assert.ok(modalBounds.top>=0&&modalBounds.bottom<=height+2,'Old map remains onscreen in short landscape '+JSON.stringify(modalBounds));
   await phone.getByRole('button',{name:'Close map'}).tap();await lines(phone);
   await phone.getByRole('button',{name:'Open evidence notebook'}).tap();
   const notebook=phone.getByRole('heading',{name:'Nia’s evidence notebook'});
   const checkNotebook=async active=>{
    const geometry=await phone.evaluate(()=>{
     const box=s=>{const e=document.querySelector(s),r=e?.getBoundingClientRect();return r?{left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}:null;};
     return {card:box('#notebook'),stone:box('[data-a="fact-stones"]'),gap:box('[data-a="fact-gap"]'),
      unsure:box('[data-a="unsure"]'),dialogue:box('.caption:not(.idle)'),
      cont:box('.caption button[data-a="next"]'),viewWidth:innerWidth,viewHeight:innerHeight,
      documentWidth:document.documentElement.scrollWidth,
      continueWrap:document.querySelector('.caption button[data-a="next"]')?
       {whiteSpace:getComputedStyle(document.querySelector('.caption button[data-a="next"]')).whiteSpace,
        scrollWidth:document.querySelector('.caption button[data-a="next"]').scrollWidth,
        clientWidth:document.querySelector('.caption button[data-a="next"]').clientWidth}:null};
    });
    assert.equal(await phone.locator('#world').count(),0,'No large world behind notebook');
    assert.ok(geometry.card&&geometry.stone&&geometry.gap&&geometry.unsure,'Notebook actions visibly rendered');
    assert.ok(geometry.documentWidth<=width+2,'No horizontal notebook overflow '+JSON.stringify(geometry));
    for(const key of ['card','stone','gap','unsure']){
     const r=geometry[key];
     assert.ok(r.left>=-2&&r.right<=width+2&&r.top>=-2&&r.bottom<=height+2,
      key+' must fit phone viewport '+JSON.stringify(geometry));
    }
    assert.ok(geometry.stone.height>=44&&geometry.gap.height>=44&&geometry.unsure.height>=44,
     'Evidence and help are touchable');
    if(active){
     assert.ok(geometry.dialogue&&geometry.cont,'Help line and Continue must appear without scrolling');
     assert.ok(geometry.dialogue.bottom<=height+2,'Help stays inside landscape '+JSON.stringify(geometry));
     assert.equal(geometry.continueWrap.whiteSpace,'nowrap','Continue must never break into two lines');
     assert.ok(geometry.continueWrap.scrollWidth<=geometry.continueWrap.clientWidth+2,'Continue should not be clipped');
    }
   };
   await checkNotebook(true);
   await lines(phone);
   await checkNotebook(false);
   await phone.getByRole('button',{name:'Not sure yet'}).tap();
   assert.equal((await saved(phone)).queue.length,3,'Not sure yet starts Nia/Finn guidance');
   assert.equal((await saved(phone)).linked,false);
   await checkNotebook(true);
   await phone.screenshot({path:'test-results/e02-phone-notebook-hint-'+width+'x'+height+'.png',fullPage:true});
   await lines(phone);
   await checkNotebook(false);
   assert.equal(await notebook.count(),1,'Notebook must be reachable without cropping');
   await phone.locator('[data-a="fact-gap"]').tap();
   await lines(phone);
   assert.equal((await saved(phone)).linked,true,'Mobile evidence flow must preserve original E02 reasoning gate');
   await phone.getByRole('button',{name:'The bridge was here before. It is not here now.'}).tap();
   await lines(phone);
   assert.equal((await saved(phone)).phase,'market');
   assert.equal((await saved(phone)).market,false,'Market discovery must require a further action');
   await phone.getByRole('button',{name:'Go to public lookout'}).tap();
   await phone.getByRole('button',{name:'Look at the old mark'}).tap();
   await lines(phone);
   const before=await saved(phone);
   assert.equal(before.phase,'chronicle');
   assert.equal(before.chronicleSeen,false);
   assert.equal(before.ledger.includes('episode_completed:s01e02'),false);
   chronicleCheckpoint=before;
   const initial=await checkPhoneChronicle(phone,width,height);
   assert.ok(initial.read&&initial.read.height>=44,'Read is immediately reachable');
   assert.equal(await phone.getByRole('button',{name:'Finish this chapter'}).count(),0);
   await phone.screenshot({path:'test-results/e02-chronicle-ready-'+width+'.png',fullPage:true});
   await phone.getByRole('button',{name:'Child / Parent View'}).tap();
   assert.equal(await phone.locator('.child').evaluate(el=>getComputedStyle(el).display),'none');
   await phone.getByRole('button',{name:'Child / Parent View'}).tap();
   await phone.getByRole('button',{name:'Read the Chronicle'}).tap();
   assert.ok((await saved(phone)).queue.length>=9);
   await checkPhoneChronicle(phone,width,height,true);
   await phone.locator('.chronicle-scroll').evaluate(el=>el.scrollTop=el.scrollHeight);
   await checkPhoneChronicle(phone,width,height,true);
   await phone.screenshot({path:'test-results/e02-chronicle-reading-'+width+'.png',fullPage:true});
   await lines(phone);
   const finishedReading=await checkPhoneChronicle(phone,width,height);
   assert.ok(finishedReading.finish&&finishedReading.finish.height>=44&&finishedReading.finish.bottom<=height+3,
    'Finish stays visible without page scrolling '+JSON.stringify(finishedReading));
   await phone.getByRole('button',{name:'Finish this chapter'}).tap();
   assert.equal((await saved(phone)).phase,'completed');
   assert.equal((await saved(phone)).ledger.filter(x=>x==='episode_completed:s01e02').length,1);
   await phone.reload({waitUntil:'networkidle'});
   assert.equal((await saved(phone)).phase,'completed');
   await phone.getByRole('button',{name:'Review the Chronicle'}).tap();
   assert.equal(await phone.getByText(/old stones marked a crossing/).count(),1);
   await phone.getByRole('button',{name:'Close Chronicle review'}).tap();
   await phone.getByRole('button',{name:'Start E02 again'}).tap();
   assert.equal(await phone.getByRole('dialog',{name:'Restart E02 confirmation'}).count(),1);
   await phone.getByRole('button',{name:'Cancel'}).tap();
   assert.equal((await saved(phone)).phase,'completed','Cancel must preserve the completed chapter');
   assert.deepEqual(await phone.evaluate(()=>JSON.parse(localStorage.getItem('wondervale-progress-v1')).ledger),fakeE01.ledger);
   await phone.screenshot({path:'test-results/e02-chronicle-completed-'+width+'.png',fullPage:true});
  }
  await phone.screenshot({path:'test-results/e02-phone-landscape-'+width+'x'+height+'.png',fullPage:true});
  await phoneCtx.close();
 }
 passed('E02-PHONE-VIEWPORT','E02 short-landscape 568x320 and 667x375 plus portrait 390x844 preserve full art, scene controls, bottom story, reachable Parent View, and notebook progression.');

 // Independent 667x375 saved-book route, including restoring the checkpoint
 // and completing without replaying any discovery/ledger event.
 assert.ok(chronicleCheckpoint,'568x320 run must reach Chronicle');
 {const {ctx:largerCtx,p:larger}=await open({width:667,height:375,touch:true});
  await larger.evaluate(s=>localStorage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(s)),chronicleCheckpoint);
  await larger.reload({waitUntil:'networkidle'});
  const restoredCheckpoint=await saved(larger);
  assert.equal(restoredCheckpoint.phase,'chronicle',
   'Chronicle checkpoint must survive reload: '+JSON.stringify({phase:restoredCheckpoint.phase,version:restoredCheckpoint.version,market:restoredCheckpoint.market,ledger:restoredCheckpoint.ledger}));
  assert.equal(await larger.locator('#chronicle').count(),1,
   'Chronicle DOM must exist on saved phone reload: '+(await larger.locator('.child').innerText()));
  await checkPhoneChronicle(larger,667,375);
  await larger.getByRole('button',{name:'Read the Chronicle'}).tap();
  await checkPhoneChronicle(larger,667,375,true);
  await lines(larger);
  await checkPhoneChronicle(larger,667,375);
  await larger.getByRole('button',{name:'Finish this chapter'}).tap();
  assert.equal((await saved(larger)).phase,'completed');
  await larger.screenshot({path:'test-results/e02-chronicle-completed-667.png',fullPage:true});
  await largerCtx.close();
 }
 passed('E02-CHRONICLE-PHONE','Touch completion from notebook through Market Lane, gated Chronicle narration, fixed Finish and reload on 568x320 and 667x375');

 for(const width of [320,360,390,430]){
  const {ctx:c,p:page}=await open({width,height:width<390?700:844,authorized:true,touch:true});
  await page.getByRole('button',{name:'Begin Riverside adventure'}).tap();await lines(page);
  const labels=await page.locator('.actor-label').evaluateAll(els=>els.map(el=>({name:el.textContent,rect:el.getBoundingClientRect().toJSON()})));
  assert.equal(labels.length,3);
  for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
   const a=labels[i].rect,b=labels[j].rect;
   const overlaps=a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
   assert.equal(overlaps,false,'Actor labels overlap on '+width+'px phone: '+labels[i].name+' / '+labels[j].name);
  }
  await page.screenshot({path:'test-results/e02-phone-'+width+'.png',fullPage:true});
  assert.equal(await page.getByRole('button',{name:'Child / Parent View'}).count(),1);
  await page.getByRole('button',{name:'Child / Parent View'}).tap();
  assert.ok(await page.locator('#parent').evaluate(el=>getComputedStyle(el).display!=='none'));
  await c.close();
 }
 passed('E02-E03','320/360/390/430 touch render screenshot and parent view toggle');
  // Image fetch failures should show an explicit retry instead of an empty scene.
  {const {ctx:brokenCtx,p:broken}=await open({width:568,height:320,touch:true});
   await broken.getByRole('button',{name:'Begin Riverside adventure'}).tap();await lines(broken);
   await broken.route('**/s01e02-riverside-r2.webp**',r=>r.abort());
   await action(broken,'Go to public lookout');await lines(broken);
   await action(broken,'Look across');
   await broken.getByRole('alert').getByText('Riverside picture could not load.').waitFor();
   await broken.unroute('**/s01e02-riverside-r2.webp**');
   await action(broken,'Retry picture');
   assert.equal(await broken.locator('img.backdrop').evaluate(async img=>{await img.decode();return img.naturalWidth;}),1672);
   await brokenCtx.close();
   passed('E02-ART-LOAD','R2 network failure explains the missing picture and retry restores the image');
  }
  assert.deepEqual(errors,[]);
}finally{await writeFile('test-results/e02-acceptance.json',JSON.stringify({report,errors},null,2));await browser.close();}
