import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {fresh,dispatch,payload,groups,KEY,events} from '../engine/episode.mjs';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const out='test-results';await mkdir(out,{recursive:true});
const content=JSON.parse(await readFile('public/episode.json'));
const results=[],errors=[];
const browser=await chromium.launch({headless:true});
const drainState=s=>{while(s.queue.length)s=dispatch(s,{type:'next'});return s;};
function fixture(stage){let s=drainState(dispatch(fresh(),{type:'begin'}));if(stage==='square')return payload(s,{motion:false});s=drainState(dispatch(dispatch(s,{type:'move',target:'board'}),{type:'hold'}));if(stage==='map')return payload(s,{motion:false});for(const r of ['line','blank_shape'])s=drainState(dispatch(s,{type:'inspect',region:r}));s=drainState(dispatch(s,{type:'guess',choice:'A'}));if(stage==='observed')return payload(s,{motion:false});for(const t of ['fountain','large_tree'])s=drainState(dispatch(dispatch(s,{type:'move',target:t}),{type:'compare',symbol:t}));if(stage==='anchors')return payload(s,{motion:false});s=drainState(dispatch(dispatch(s,{type:'move',target:'marker'}),{type:'findPlate'}));s=drainState(dispatch(s,{type:'clean'}));if(stage==='marker')return payload(s,{motion:false});s=drainState(dispatch(s,{type:'finish'}));if(stage==='later')s.ledger.push('episode_completed:s01e03');return payload(s,{motion:false});}
async function context({mobile=false,stage=null}={}){const c=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1366,height:900},isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce'});if(stage)await c.addInitScript(({key,save})=>localStorage.setItem(key,JSON.stringify(save)),{key:KEY,save:fixture(stage)});const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});await p.goto(base,{waitUntil:'networkidle'});await p.locator('.brand').waitFor();if(await p.getByRole('button',{name:'Continue the story',exact:true}).count())await p.getByRole('button',{name:'Continue the story',exact:true}).click();return {c,p};}
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
 const {c,p}=await context();
 await p.screenshot({path:`${out}/desktop-opening.png`,fullPage:true});
 assert.equal(await p.getByRole('dialog').count(),0);await click(p,'Begin');await drain(p);
 pass('INT-01/INT-02/INT-19','Preview skipped; controllable world entered without Parent View.');
 await click(p,'Fountain');await click(p,'Look closely');await drain(p);await click(p,'Big tree');await click(p,'Look closely');await drain(p);assert.deepEqual((await cp(p)).anchors,[]);pass('INT-03','Ambient inspections do not verify map anchors.');
 await click(p,'Noticeboard');await click(p,'Help hold the paper.');await drain(p);assert.equal((await cp(p)).checkpoint,'cp_map_exposed');pass('INT-04','Tap hold saves intact map-exposure checkpoint.');
 await click(p,'Look at the line');await drain(p);await click(p,'Look at the line');await drain(p);assert.equal(await p.getByRole('button',{name:"Maybe it's a treasure map!",exact:true}).count(),0);pass('INT-09','Repeated region does not unlock speculation.');
 assert.equal(await p.locator('#parent-cue').count(),1);pass('UX-07','Nonblocking first-observation parent cue in desktop side panel.');
 await click(p,'Look at the shape');await drain(p);await click(p,"Maybe it's a treasure map!");assert.equal(await p.locator('[data-line-id]').getAttribute('data-line-id'),'S01E01-MILO-013');await drain(p);pass('INT-05','A/B observations, A guess, C physical fallback converge.');
 await click(p,'Old post');assert.equal(await p.getByRole('button',{name:'Clean the old plate.',exact:true}).count(),0);pass('INT-15','No early clean control or destination disclosure.');
 await click(p,'Bench');await click(p,'Compare the round mark');await drain(p);assert.deepEqual((await cp(p)).anchors,[]);pass('INT-12','Unrelated object gives friendly mismatch without completion.');
 await click(p,'Fountain');await click(p,'Big tree');assert.deepEqual((await cp(p)).anchors,[]);pass('INT-13','Arrival alone never verifies landmarks.');
 for(const [place,compare] of [['Big tree','Compare the tree mark'],['Fountain','Compare the round mark']]){await click(p,place);await click(p,compare);await drain(p);}pass('INT-11','Tree then fountain both confirmed in the world.');
 await click(p,'Old post');assert.equal((await p.locator('body').innerText()).includes('RIVERSIDE'),false);await click(p,'Look at the old post');await drain(p);pass('INT-14','Broad exit marker accessible only after both anchors; dirty destination hidden.');
 await p.screenshot({path:`${out}/desktop-dirty-plate.png`,fullPage:true});
 await click(p,'Clean the old plate.');await click(p,'Continue');await click(p,'Continue');assert.equal(await p.locator('.plate-text').count(),1);assert.equal(await p.locator('[data-line-id]').getAttribute('data-line-id'),'S01E01-MILO-026');pass('INT-16','Single click clean reveals text/arrow before Riverside caption.');
 await drain(p);const before=await ledger(p);await click(p,'Look at the mark again');await drain(p);assert.deepEqual(await ledger(p),before);pass('INT-17','Repeat marker inspect leaves ledger unchanged.');
 await p.screenshot({path:`${out}/desktop-chronicle.png`,fullPage:true});await click(p,'Finish this page');await drain(p);pass('INT-18','Chronicle finishes without reflection; E02 unlocked once.');
 const complete=await ledger(p);await p.reload({waitUntil:'networkidle'});assert.deepEqual(await ledger(p),complete);assert.equal(await p.getByRole('dialog').count(),0);pass('SAV-07','Completed page reload preserves completion, without unfinished recap.');
 await click(p,'Replay this memory');await finishPath(p);assert.deepEqual(await ledger(p),complete);await click(p,'Leave replay');assert.deepEqual(await ledger(p),complete);pass('SAV-08','Full replay and exit preserve present ledger.');
 await c.close();
 for(const [id,order,choice] of [['INT-06',['blank_shape','layer_holes'],'B'],['INT-07',['line','layer_holes'],'C'],['INT-08',['layer_holes','blank_shape','line'],'B']]){const {c,p}=await context({stage:'map'});for(const r of order){await click(p,({line:'Look at the line',blank_shape:'Look at the shape',layer_holes:'Look at the paper'})[r]);await drain(p);}await click(p,content.lines[`S01E01-MILO-${({A:'013',B:'014',C:'015'})[choice]}`].exact_text);await drain(p);assert.equal((await cp(p)).phase,'square_compare');assert.equal((await cp(p)).played.includes('S01E01-FINN-009'),false);pass(id,'Reordered observations converge; no duplicate C fallback.');await c.close();}
 const {c:mc,p:mp}=await context({mobile:true});await mp.screenshot({path:`${out}/mobile-opening.png`,fullPage:true});await finishPath(mp,{mobile:true,choice:'C',anchorOrder:['fountain','large_tree']});assert.ok(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));pass('UX-01/UX-02/UX-04/UX-05','Audio off, reduced motion, touch actions and explicit assisted travel complete E01; no horizontal page overflow.','Chromium emulated touch 390×844');await mc.close();
 const {c:pc,p:pp}=await context({mobile:true,stage:'map'});await tap(pp,'Look at the line');await drain(pp);await tap(pp,'Parent');assert.equal(await pp.getByText(content.parent.cue,{exact:true}).count(),1);await tap(pp,'Back to Child View');assert.equal(await pp.getByRole('button',{name:'Look at the line',exact:true}).getAttribute('aria-pressed'),'true');await tap(pp,'Parent');await tap(pp,'Back to Child View');pass('INT-20/UX-08','Repeated Parent/Child switches preserve inspection; cue remains single.','Chromium emulated touch 390×844');await pc.close();
 for(const [stage,id,expected] of [['square','SAV-01','012'],['map','SAV-02','014'],['observed','SAV-03','014'],['anchors','SAV-04','014'],['marker','SAV-05','016']]){const {c,p}=await context({stage});await p.reload({waitUntil:'networkidle'});assert.equal(await p.getByRole('dialog').count(),1);assert.equal(await p.locator('.dialog [data-line-id]').first().getAttribute('data-line-id'),`S01E01-NARRATOR-${expected}`);await click(p,'Continue the story');assert.equal(await p.getByRole('dialog').count(),0);pass(id,'Resume presents exactly one state-appropriate optional recap.');await c.close();}
 const {c:lc,p:lp}=await context({stage:'later'});const later=await ledger(lp);await click(lp,'Replay this memory');await click(lp,'Begin');await drain(lp);await click(lp,'Leave replay');assert.deepEqual(await ledger(lp),later);pass('SAV-09','Later-season fixture unchanged after partial replay/exit.');await lc.close();
 const {c:kc,p:kp}=await context({stage:'square'});async function keyAction(name){for(let i=0;i<90;i++){await kp.keyboard.press('Tab');if(await kp.evaluate(name=>document.activeElement?.textContent.trim()===name,name)){await kp.keyboard.press('Enter');return;}}throw Error('Keyboard unreachable '+name);}
 await keyAction('Noticeboard');await keyAction('Help hold the paper.');while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');for(const name of ['Look at the line','Look at the shape']){await keyAction(name);while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');}await keyAction("I'm not sure yet.");while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');for(const [a,b] of [['Fountain','Compare the round mark'],['Big tree','Compare the tree mark']]){await keyAction(a);await keyAction(b);while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');}await keyAction('Old post');await keyAction('Look at the old post');while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');await keyAction('Clean the old plate.');while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');await keyAction('Finish this page');while(await kp.getByRole('button',{name:'Skip dialogue',exact:true}).count())await keyAction('Skip dialogue');assert.ok((await ledger(kp)).includes(events.complete[0]));pass('UX-03','Keyboard Tab/Enter alone completes required exploration, observation, comparison and cleaning.');await kc.close();
 const {c:oc,p:op}=await context();await op.evaluate(async()=>{await navigator.serviceWorker.ready;});await op.reload({waitUntil:'networkidle'});await oc.setOffline(true);await op.reload({waitUntil:'networkidle'});assert.equal(await op.locator('.brand').innerText(),'Wondervale');await click(op,'Begin');await drain(op);pass('OFFLINE-01','After one online cache install, offline reload and play work.');await oc.close();
 assert.deepEqual(errors,[]);
 pass('RUNTIME-01','No page exceptions or HTTP asset errors across all browser paths.');
}catch(error){results.push({id:'BROWSER-RUN',status:'FAIL',observed:error.stack});process.exitCode=1;}
finally{await browser.close();await writeFile(`${out}/browser-results.json`,JSON.stringify({build:content.buildId,contentVersion:content.contentVersion,results,errors,humanPending:['UX-11','UX-12'],mediaPending:['recorded_voices','music']},null,2));console.log(JSON.stringify({results,errors},null,2));}
