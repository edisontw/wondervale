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
async function drain(p){let n=0;while(await p.getByRole('button',{name:'Skip dialogue',exact:true}).count()){await p.getByRole('button',{name:'Skip dialogue',exact:true}).click();assert.ok(++n<20);} }
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
 await action(p,'Clean the old plate.');
 assert.equal((await p.locator('body').innerText()).includes('RIVERSIDE'),false);
 await click(p,'Continue');await click(p,'Continue');
 assert.equal(await p.locator('.plate-text').count(),1);
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
 await click(firstVisit,'Begin');
 assert.equal(await firstVisit.getByRole('button',{name:'Fountain',exact:true}).count(),0);
 assert.equal(await firstVisit.getByRole('button',{name:'Continue story',exact:true}).count(),1);
 await click(firstVisit,'Continue story');
 assert.ok((await cp(firstVisit)).started,'introduction can advance');
 await click(firstVisit,'Skip introduction');
 assert.equal(await firstVisit.getByRole('button',{name:'Fountain',exact:true}).count(),1);
 await click(firstVisit,'Fountain');
 assert.ok((await cp(firstVisit)).position[0]>0.4,'fresh first visitor can explore after intro');
 pass('FIELD-QA-FIRST-01','Fresh private browser starts with separated trio, visible Begin/Continue, and working exploration after intro.');
 await firstVisitCtx.close();
 const {c,p}=await context();
 await p.screenshot({path:`${out}/desktop-opening.png`,fullPage:true});
 assert.equal(await p.getByRole('dialog').count(),0);await click(p,'Begin');await drain(p);
 pass('INT-01/INT-02/INT-19','Preview skipped; controllable world entered without Parent View.');
 await click(p,'Fountain');await click(p,'Look closely');await drain(p);await click(p,'Big tree');await click(p,'Look closely');await drain(p);assert.deepEqual((await cp(p)).anchors,[]);pass('INT-03','Ambient inspections do not verify map anchors.');
 await click(p,'Noticeboard');await click(p,'Help hold the paper.');await drain(p);assert.equal((await cp(p)).checkpoint,'cp_map_exposed');pass('INT-04','Tap hold saves intact map-exposure checkpoint.');
 await click(p,'Look at the line');await drain(p);await click(p,'Look at the line');await drain(p);assert.equal(await p.getByRole('button',{name:"Maybe it's a treasure map!",exact:true}).count(),0);pass('INT-09','Repeated region does not unlock speculation.');
 assert.equal(await p.locator('#parent-cue').count(),1);pass('UX-07','Nonblocking first-observation parent cue in desktop side panel.');
 await click(p,'Look at the shape');await drain(p);await click(p,"Maybe it's a treasure map!");assert.equal(await p.locator('[data-line-id]').getAttribute('data-line-id'),'S01E01-MILO-013');await drain(p);assert.equal(await p.locator('.map-inset .map-art').count(),1);assert.equal(await p.locator('.map-inset image[href="public/art/glyph.svg"]').count(),1);assert.equal((await p.locator('body').innerText()).includes('${mapArt()}'),false);pass('INT-05','A/B observations, A guess, C physical fallback converge.');
 await click(p,'Old post');assert.equal(await p.getByRole('button',{name:'Clean the old plate.',exact:true}).count(),0);pass('INT-15','No early clean control or destination disclosure.');
 assert.equal(await p.getByRole('button',{name:'Bench',exact:true}).count(),0);assert.equal(await p.getByRole('button',{name:'Compare the round mark'}).count(),0);assert.equal(await p.getByRole('button',{name:'Compare the tree mark'}).count(),0);assert.deepEqual((await cp(p)).anchors,[]);pass('INT-12','Unrelated location does not present misleading comparison buttons or confirm either landmark.');
 await click(p,'Fountain');await click(p,'Big tree');assert.deepEqual((await cp(p)).anchors,[]);pass('INT-13','Arrival alone never verifies landmarks.');
 for(const [place,compare] of [['Big tree','Compare the tree mark'],['Fountain','Compare the round mark']]){await click(p,place);await click(p,compare);await drain(p);}pass('INT-11','Tree then fountain both confirmed in the world.');
 await click(p,'Old post');assert.equal((await p.locator('body').innerText()).includes('RIVERSIDE'),false);await click(p,'Look at the old post');await drain(p);pass('INT-14','Broad exit marker accessible only after both anchors; dirty destination hidden.');
 await p.screenshot({path:`${out}/desktop-dirty-plate.png`,fullPage:true});
 await click(p,'Clean the old plate.');await click(p,'Continue');await click(p,'Continue');assert.equal(await p.locator('.plate-text').count(),1);assert.equal(await p.locator('[data-line-id]').getAttribute('data-line-id'),'S01E01-MILO-026');pass('INT-16','Single click clean reveals text/arrow before Riverside caption.');
 await drain(p);const before=await ledger(p);await click(p,'Look at the mark again');await drain(p);assert.deepEqual(await ledger(p),before);pass('INT-17','Repeat marker inspect leaves ledger unchanged.');
 await p.screenshot({path:`${out}/desktop-chronicle.png`,fullPage:true});await click(p,'Finish this page');await drain(p);pass('INT-18','Chronicle finishes without reflection; E02 unlocked once.');
 const complete=await ledger(p);await p.reload({waitUntil:'networkidle'});assert.deepEqual(await ledger(p),complete);assert.equal(await p.getByRole('dialog').count(),0);await click(p,'Visit Town Square');assert.equal(await p.locator('.marker-world-label').count(),1);await click(p,'Back to the Chronicle');pass('SAV-07','Completed reload and present Square retain clear marker/completion without unfinished recap.');
 await click(p,'Replay this memory');await finishPath(p);assert.deepEqual(await ledger(p),complete);await click(p,'Leave replay');assert.deepEqual(await ledger(p),complete);pass('SAV-08','Full replay and exit preserve present ledger.');
 await c.close();
 for(const [id,order,choice] of [['INT-06',['blank_shape','layer_holes'],'B'],['INT-07',['line','layer_holes'],'C'],['INT-08',['layer_holes','blank_shape','line'],'B']]){const {c,p}=await context({stage:'map'});for(const r of order){await click(p,({line:'Look at the line',blank_shape:'Look at the shape',layer_holes:'Look at the paper'})[r]);await drain(p);}await click(p,content.lines[`S01E01-MILO-${({A:'013',B:'014',C:'015'})[choice]}`].exact_text);await drain(p);assert.equal((await cp(p)).phase,'square_compare');assert.equal((await cp(p)).played.includes('S01E01-FINN-009'),false);pass(id,'Reordered observations converge; no duplicate C fallback.');await c.close();}
 const {c:compareCtx,p:comparePage}=await context({stage:'observed'});
 assert.equal(await comparePage.getByRole('button',{name:'Compare the round mark'}).count(),0);
 assert.equal(await comparePage.getByRole('button',{name:'Compare the tree mark'}).count(),0);
 assert.match(await comparePage.locator('.comparison-guide').innerText(),/Walk to the Fountain or Big tree/);
 assert.match(await comparePage.locator('.notice').first().innerText(),/Fountain.*Not yet/);
 await click(comparePage,'Fountain'); 
 assert.equal(await comparePage.getByRole('button',{name:'Compare the round mark'}).count(),1);
 assert.equal(await comparePage.getByRole('button',{name:'Compare the tree mark'}).count(),0);
 await click(comparePage,'Compare the round mark');await drain(comparePage);
 assert.match(await comparePage.locator('.notice').first().innerText(),/Fountain.*Matched/);
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
 await keyAction('Noticeboard');await keyAction('Help hold the paper.');while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');for(const name of ['Look at the line','Look at the shape']){await keyAction(name);while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');}await keyAction("I'm not sure yet.");while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');for(const [a,b] of [['Fountain','Compare the round mark'],['Big tree','Compare the tree mark']]){await keyAction(a);await keyAction(b);while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');}await keyAction('Old post');await keyAction('Look at the old post');while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');await keyAction('Clean the old plate.');while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');await keyAction('Finish this page');while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');assert.ok((await ledger(kp)).includes(events.complete[0]));pass('UX-03','Keyboard Tab/Enter alone completes required exploration, observation, comparison and cleaning.');await kc.close();

 // Equivalent guess branches: exact pair plus identical durable semantics.
 const branchLedgers=[];
 for(const choice of ['A','B','C']){const {c,p}=await context({stage:'map'});for(const r of ['Look at the line','Look at the shape']){await click(p,r);await drain(p);}await p.screenshot({path:`${out}/desktop-map.png`,fullPage:true});await click(p,content.lines[`S01E01-MILO-${({A:'013',B:'014',C:'015'})[choice]}`].exact_text);assert.equal(await p.locator('[data-line-id]').getAttribute('data-line-id'),groups[choice][0]);await click(p,'Continue');assert.equal(await p.locator('[data-line-id]').getAttribute('data-line-id'),groups[choice][1]);await drain(p);branchLedgers.push(await ledger(p));await c.close();}assert.deepEqual(branchLedgers[0],branchLedgers[1]);assert.deepEqual(branchLedgers[1],branchLedgers[2]);pass('INT-10','All three exact line pairs converge to identical canonical event arrays.');
 const {c:mapc,p:mapp}=await context({stage:'map'});await click(mapp,'Look at the paper');await drain(mapp);const mapLedger=await ledger(mapp);for(let i=0;i<3;i++){await click(mapp,'Back to Square');await click(mapp,'Open the old map');assert.equal(await mapp.getByRole('button',{name:'Look at the paper',exact:true}).getAttribute('aria-pressed'),'true');}assert.deepEqual(await ledger(mapp),mapLedger);pass('SAV-11','Close/reopen map three times retains the deliberately inspected region and ledger.');await mapc.close();
 const {c:dc,p:dp}=await context({stage:'anchors'});await click(dp,'Old post');await click(dp,'Look at the old post');await drain(dp);await dp.evaluate(()=>{const b=document.querySelector('[data-action="clean"]');b.click();b.click();});await click(dp,'Pause');assert.equal(await dp.locator('.plate-text').count(),0);await click(dp,'Return to the story');await click(dp,'Continue');await click(dp,'Continue');await click(dp,'Pause');assert.equal((await ledger(dp)).filter(x=>x===events.marker[0]).length,1);await click(dp,'Return to the story');await dp.reload({waitUntil:'networkidle'});await click(dp,'Continue the story');assert.equal((await ledger(dp)).filter(x=>x===events.marker[0]).length,1);pass('SAV-06','Double clean and pauses before/after reveal persist one complete marker event.');await dc.close();
 const {c:fc,p:fp}=await context({stage:'anchors'});await click(fp,'Old post');await click(fp,'Look at the old post');await drain(fp);await fp.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='wondervale-progress-v1'&&JSON.parse(v).ledger.includes('s01e01_town_square_old_marker_revealed'))throw new DOMException('Simulated quota','QuotaExceededError');return original.call(this,k,v);};});await click(fp,'Clean the old plate.');await click(fp,'Continue');await click(fp,'Continue');assert.equal(await fp.getByRole('alert').count(),1);assert.equal((await ledger(fp)).includes(events.marker[0]),false);await fp.reload({waitUntil:'networkidle'});await click(fp,'Continue the story');assert.equal(await fp.locator('.plate-text').count(),0);assert.equal((await ledger(fp)).includes(events.marker[0]),false);pass('SAV-10','Failed atomic write shows warning and reloads coherent pre-reveal checkpoint, without orphan event.');await fc.close();
 const {c:sc,p:sp}=await context({mobile:true,stage:'anchors'});await tap(sp,'Old post');await tap(sp,'Look at the old post');await drain(sp);await sp.locator('#plate-swipe').scrollIntoViewIfNeeded();const box=await sp.locator('#plate-swipe .plate-close').boundingBox();const ts=await sc.newCDPSession(sp);await ts.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+60,y:box.y+100}]});await ts.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+160,y:box.y+130}]});await ts.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await click(sp,'Continue');await click(sp,'Continue');assert.equal((await ledger(sp)).filter(x=>x===events.marker[0]).length,1);pass('INT-16-SWIPE','Broad touch pointer swipe reaches the same one-time reveal as button and keyboard.','Chromium emulated touch 390×844; Chromium touch input');await sc.close();
 for(const stage of ['square','map','observed','anchors']){const {c,p}=await context({stage});const start=await ledger(p);for(let i=0;i<3;i++){await click(p,'Help');const id=await p.locator('[data-line-id]').getAttribute('data-line-id');assert.ok(content.lines[id]);assert.equal(await p.locator('[data-line-id]').innerText(),content.lines[id].exact_text);await click(p,'Read again');assert.deepEqual(await ledger(p),start);await drain(p);}await c.close();}const {c:hc,p:hp}=await context({stage:'anchors'});await click(hp,'Old post');await click(hp,'Look at the old post');await drain(hp);await click(hp,'Help');assert.equal(await hp.locator('[data-line-id]').getAttribute('data-line-id'),'S01E01-UI-010');await drain(hp);assert.equal((await ledger(hp)).includes(events.marker[0]),false);await hc.close();pass('UX-06/UX-09','On-demand support escalation uses exact locked lines; reread/skip does not emit progress.');
 const {c:solo,p:solop}=await context({stage:'map'});await click(solop,'Look at the shape');assert.equal(await solop.locator('[data-line-id]').getAttribute('data-line-id'),'S01E01-FINN-004');await drain(solop);assert.equal(await solop.locator('.child input,.child textarea').count(),0);assert.equal(await solop.getByRole('button',{name:"Maybe it's a treasure map!",exact:true}).count(),0);pass('UX-10','Solo observation receives approved support without response input, scoring or guessed interpretation.');await solo.close();
 const {c:motor,p:motorp}=await context({stage:'square'});await motorp.getByLabel('Single-action assistance').check();assert.equal(await motorp.evaluate(key=>JSON.parse(localStorage.getItem(key)).preferences.motor,KEY),true);await finishPath(motorp);pass('UX-05-MOTOR','Motor assistance enabled: deliberate single-action travel, comparison and clean complete E01.');await motor.close();
 const {c:wc,p:wp}=await context({motion:true});await click(wp,'Begin');await drain(wp);await click(wp,'Noticeboard');await click(wp,'Pause');await click(wp,'Return to the story');await wp.getByRole('button',{name:'Help hold the paper.',exact:true}).waitFor();await click(wp,'Help hold the paper.');await drain(wp);assert.equal((await cp(wp)).phase,'map_observe');pass('MOTION-01','Normal motion plus pause during travel recovers without locking required action.');await wc.close();
 const {c:oc,p:op}=await context();await op.evaluate(async()=>{await navigator.serviceWorker.ready;});await op.reload({waitUntil:'networkidle'});await oc.setOffline(true);await op.reload({waitUntil:'networkidle'});assert.equal(await op.locator('.brand').innerText(),'Wondervale');await click(op,'Begin');await drain(op);pass('OFFLINE-01','After one online cache install, offline reload and play work.');await oc.close();
 assert.deepEqual(errors,[]);
 pass('RUNTIME-01','No page exceptions or HTTP asset errors across all browser paths.');
}catch(error){results.push({id:'BROWSER-RUN',status:'FAIL',observed:error.stack});process.exitCode=1;}
finally{await browser.close();await writeFile(`${out}/browser-results.json`,JSON.stringify({build:content.buildId,contentVersion:content.contentVersion,results,errors,humanPending:['UX-11','UX-12'],mediaPending:['recorded_voices','music']},null,2));console.log(JSON.stringify({results,errors},null,2));}
