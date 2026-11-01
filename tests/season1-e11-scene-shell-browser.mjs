// E11 independent scene Chromium acceptance. Noncanonical PAPER, never a release gate.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const records=[],errors=[];
const btn=(page,name)=>page.getByRole('button',{name,exact:true});
async function press(page,name){
 assert.equal(await btn(page,name).isEnabled(),true,name+' must be enabled');
 await btn(page,name).click();
}
async function geometry(page,label){
 const v=await page.evaluate(()=>({
  viewport:innerWidth,scroll:document.documentElement.scrollWidth,
  grid:(()=>{const r=document.querySelector('#grid').getBoundingClientRect();
   return {left:r.left,right:r.right,width:r.width};})(),
  buttons:[...document.querySelectorAll('button:not(:disabled)')].filter(e=>e.getClientRects().length>0).map(e=>{
   const r=e.getBoundingClientRect();return {name:e.getAttribute('aria-label')||e.textContent,
    width:r.width,height:r.height,left:r.left,right:r.right};
  })
 }));
 assert.ok(v.scroll<=v.viewport+1,label+' horizontal overflow');
 assert.ok(v.grid.width>170&&v.grid.left>=-1&&v.grid.right<=v.viewport+1,label+' grid fit');
 for(const b of v.buttons){
  assert.ok(b.width>=43.5&&b.height>=43.5,label+' 44px control '+b.name);
  assert.ok(b.left>=-1&&b.right<=v.viewport+1,label+' button within viewport '+b.name);
 }
 records.push({label,geometry:v});
}
async function invariant(page,label){
 const t=await page.locator('#chronicle').innerText();
 assert.match(t,/canonical events: 0; unlocks: 0; historical claims: 0; finished: false/);
 assert.match(t,/HISTORIC LINE NOT PROVEN SAFE/);
 assert.match(await page.locator('.notice').innerText(),/FICTIONAL PAPER MODEL/);
 assert.match(await page.locator('#loop-status').innerText(),/Historic hill remains CLOSED/);
 assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).sort()),['e11-sentinel'],label);
 assert.equal(await page.evaluate(()=>localStorage.getItem('e11-sentinel')),'untouched');
}
async function open(width,height,label,touch){
 const ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch,
  reducedMotion:'reduce'});
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push(label+': '+e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(label+': '+m.text());});
 const response=await page.goto(base+'/e11-scene/',{waitUntil:'load'});
 assert.equal(response?.status(),200,label+' served');
 await press(page,'Begin the PAPER trial');
 await btn(page,'Cell 0,1').waitFor();
 await page.evaluate(()=>localStorage.setItem('e11-sentinel','untouched'));
 assert.equal(await page.locator('#grid button').count(),12);
 return {ctx,page};
}
async function journey(page,label,shots){
 await geometry(page,label+' initial');
 assert.equal(await page.locator('#loop-visual line[data-selected="true"]').count(),0);
 assert.match(await page.locator('#loop-visual-status').innerText(),/North Hill CLOSED/);
 assert.equal(await btn(page,'Cell 0,3').isDisabled(),true);
 assert.equal(await btn(page,'Review NONCANONICAL finale').isDisabled(),true);
 await press(page,'Place access strip (two middle cells)');
 await press(page,'Place quiet seat');await press(page,'Cell 0,1');
 await press(page,'Place activity area');await press(page,'Cell 0,2');
 await press(page,'Walk Milo');await press(page,'Cell 1,1');
 await press(page,'Cell 0,1');
 assert.match(await page.locator('#position').innerText(),/Milo at 1,1/);
 assert.match(await page.locator('#feedback').innerText(),/Milo stops/);
 await press(page,'Test Quiet reader');await press(page,'Test Activity group');
 assert.match(await page.locator('#test-results').innerText(),/Quiet reader: RETRY/);
 assert.match(await page.locator('#test-results').innerText(),/Activity group: PASS/);
 assert.equal(await page.locator('#parent-cue').isVisible(),true);
 await press(page,'Save tested trial');
 assert.match(await page.locator('#trials').innerText(),/trial-1/);
 await press(page,'Place activity area');await press(page,'Cell 2,1');
 assert.match(await page.locator('#test-results').innerText(),/Quiet reader: not tested/);
 assert.equal(await btn(page,'Compare FIRST and NOW').isDisabled(),true);
 await press(page,'Test Quiet reader');await press(page,'Test Activity group');
 assert.match(await page.locator('#test-results').innerText(),/Quiet reader: PASS/);
 assert.match(await page.locator('#test-results').innerText(),/Activity group: PASS/);
 await press(page,'Save tested trial');
 await press(page,'Compare FIRST and NOW');
 assert.match(await page.locator('#comparison').innerText(),/trial-1 → NOW trial-2/);
 assert.match(await page.locator('#comparison').innerText(),/not real access/);
 assert.equal(await page.locator('#revisit').isVisible(),true);
 assert.match(await page.locator('#revisit-first-result').innerText(),/FIRST Quiet reader: RETRY/);
 assert.match(await page.locator('#revisit-now-result').innerText(),/NOW Quiet reader: PASS/);
 assert.equal(await page.locator('#revisit-first .mini-cell').count(),12);
 assert.equal(await page.locator('#revisit-now .mini-cell').count(),12);
 assert.match(await page.locator('#revisit-first').getAttribute('aria-label'),/FIRST fictional paper board/);
 await press(page,'Inspect FIRST cell 0,0');
 assert.match(await page.locator('#role-response').innerText(),/look again/);
 await btn(page,'Inspect FIRST cell 0,1').focus();
 await page.keyboard.press('Enter');
 assert.match(await page.locator('#role-response').innerText(),/FIRST quiet reader: RETRY/);
 assert.match(await page.locator('#role-response').innerText(),/NOW: PASS/);
 assert.match(await page.locator('#role-dialogue').innerText(),/Finn:.*Nia:/);
 assert.match(await page.locator('#role-next').innerText(),/safe access and permission/);
 assert.equal(await page.locator('#verification-plan').isVisible(),true);
 await press(page,'Unknown: Who needs this space?');
 await press(page,'Inspect the real route with permission (later)');
 assert.match(await page.locator('#plan-feedback').innerText(),/try a different station/);
 assert.match(await page.locator('#draft-checks').innerText(),/still needs a plan/);
 await press(page,'Ask actual users (later)');
 assert.match(await page.locator('#draft-checks').innerText(),/NOT CHECKED/);
 await press(page,'Unknown: Can everyone enter safely?');
 await press(page,'Inspect the real route with permission (later)');
 await press(page,'Unknown: Who can approve a change?');
 await press(page,'Request site-owner permission (later)');
 assert.match(await page.locator('#plan-finish').innerText(),/ZERO performed/);
 assert.match(await page.locator('#plan-finish').innerText(),/before anyone opens/);
 assert.doesNotMatch(await page.locator('#role-dialogue').innerText(),/\bCommon\b/);
 await press(page,'Trace activity group');
 assert.match(await page.locator('#role-response').innerText(),/Choose a FIRST piece/);
 assert.equal(await page.locator('#verification-plan').isVisible(),false);
 await press(page,'Inspect FIRST cell 0,2');
 assert.match(await page.locator('#role-response').innerText(),/FIRST activity group: PASS/);
 await press(page,'Unknown: Who needs this space?');
 await press(page,'Ask actual users (later)');
 assert.match(await page.locator('#draft-checks').innerText(),/NOT CHECKED/);
 assert.match(await page.locator('#revisit-first-result').innerText(),/FIRST Activity group: PASS/);
 assert.match(await page.locator('#revisit-now-result').innerText(),/NOW Activity group: PASS/);
 await press(page,'Recall E09 closed hill');
 assert.match(await page.locator('#citation').innerText(),/SYNTHETIC/);
 await press(page,'Add link: square ↔ market');
 assert.equal(await page.locator('#loop-visual line[data-selected="true"]').count(),1);
 await press(page,'Show FIRST paper map');
 assert.equal(await page.locator('#loop-visual line[data-selected="true"]').count(),0);
 assert.equal(await page.locator('#loop-visual').getAttribute('data-view'),'first');
 await press(page,'Show NOW paper map');
 assert.equal(await page.locator('#loop-visual line[data-selected="true"]').count(),1);
 await press(page,'Add link: market ↔ unnamed place');
 await press(page,'Check the current loop');
 assert.match(await page.locator('#loop-status').innerText(),/not established/);
 await press(page,'Add link: unnamed place ↔ square');
 assert.equal(await page.locator('#loop-visual line[data-selected="true"]').count(),3);
 await press(page,'Check the current loop');
 assert.match(await page.locator('#loop-status').innerText(),/YES — FICTIONAL ONLY/);
 await press(page,'Add link: square ↔ garden');
 assert.equal(await page.locator('#loop-visual line[data-selected="true"]').count(),4);
 assert.equal(await page.locator('#loop-visual').getAttribute('data-connected'),'false');
 assert.match(await page.locator('#loop-status').innerText(),/not established/);
 await press(page,'Check the current loop');
 assert.match(await page.locator('#loop-status').innerText(),/not established/);
 await press(page,'Remove link: square ↔ garden');
 assert.equal(await page.locator('#loop-visual line[data-selected="true"]').count(),3);
 await press(page,'Check the current loop');
 await press(page,'Review NONCANONICAL finale');
 assert.match(await page.locator('#hook').innerText(),/unnamed place is NOT OPEN/);
 assert.match(await page.locator('#hook').innerText(),/Season 1 is NOT COMPLETE/);
 assert.match(await page.locator('#revisit-world').innerText(),/unnamed place/);
 assert.match(await page.locator('#revisit-world').innerText(),/North Hill CLOSED/);
 assert.doesNotMatch(await page.locator('#revisit-world').innerText(),/\bCommon\b/);
 assert.equal(await page.locator('#return-route').isVisible(),true);
 assert.match(await page.locator('#return-route-result').innerText(),/Not complete/);
 assert.equal(await page.locator('#return-route-map [data-here="true"]').getAttribute('data-place'),'square');
 await press(page,'Try Market PAPER detour');
 assert.equal(await page.locator('#return-route-map [data-here="true"]').getAttribute('data-place'),'market');
 assert.match(await page.locator('#return-route-feedback').innerText(),/walk back/);
 await press(page,'Return to Square PAPER start');
 await press(page,'Visit Garden PAPER stop');
 assert.match(await page.locator('#return-route-garden').innerText(),/NOT VERIFIED/);
 assert.equal(await page.locator('#return-route-map [data-here="true"]').getAttribute('data-place'),'garden');
 await press(page,'Visit Map Room PAPER stop');
 assert.equal(await page.locator('#return-route-map [data-here="true"]').getAttribute('data-place'),'map_room');
 assert.match(await page.locator('#return-route-station').innerText(),/NOT VERIFIED/);
 await press(page,'Return to Garden PAPER stop');
 await press(page,'Return to Square PAPER start');
 assert.match(await page.locator('#return-route-result').innerText(),/PAPER route tested/);
 assert.equal(await page.locator('#return-reflection').isVisible(),true);
 await press(page,'Choose E05 wall-side PAPER table · not sorted');
 await press(page,'Place under SEEN IN PAPER');
 assert.match(await page.locator('#reflection-feedback').innerText(),/Look again/);
 await press(page,'Place under NEEDS REAL CHECK');
 for(const name of ['E06 possible PAPER sprout','Real seeds were planted','The public route is safe']){
  await press(page,'Choose '+name+' · not sorted');
  await press(page,'Place under NEEDS REAL CHECK');
 }
 assert.match(await page.locator('#reflection-result').innerText(),/Four notes sorted/);
 assert.match(await page.locator('#reflection-result').innerText(),/No real planting/);
 assert.doesNotMatch(await page.locator('#reflection-result').innerText(),/\\bCommon\\b/);
 assert.doesNotMatch(await page.locator('#return-route-trail').innerText(),/North Hill|Common/);
 assert.equal(await page.locator('#return-route-map [data-visited="true"]').count(),2);
 await press(page,'Undo last PAPER step');
 assert.match(await page.locator('#return-route-result').innerText(),/Not complete/);
 assert.equal(await page.locator('#return-reflection').isVisible(),false);
 await press(page,'Return to Square PAPER start');
 assert.match(await page.locator('#return-route-result').innerText(),/PAPER route tested/);
 assert.match(await page.locator('#reflection-result').innerText(),/0 of 4 notes/);
 await invariant(page,label+' reviewed');
 assert.equal(await btn(page,'Review E10 PAPER needs').isEnabled(),true);
 await press(page,'Review E10 PAPER needs');
 assert.equal(await page.locator('#e10-notes').isVisible(),true);
 assert.equal(await page.locator('#e11-work').isVisible(),false);
 assert.match(await page.locator('#e10-notes').innerText(),/No E10 completion/);
 await press(page,'Return to E11 trial');
 assert.equal(await page.locator('#loop-visual line[data-selected="true"]').count(),3);
 assert.equal(await page.locator('#loop-visual').getAttribute('data-reviewed'),'true');
 assert.match(await page.locator('#loop-visual-status').innerText(),/unnamed place NOT OPEN/);
 assert.equal(await page.locator('#e11-work').isVisible(),true);
 assert.match(await page.locator('#chronicle').innerText(),/model review recorded/);
 assert.match(await page.locator('#revisit-first-result').innerText(),/FIRST Activity group: PASS/);
 assert.match(await page.locator('#revisit-world').innerText(),/PAPER revisit/);
 assert.match(await page.locator('#return-route-result').innerText(),/PAPER route tested/);
 assert.equal(await page.locator('#return-reflection').isVisible(),true);
 assert.match(await page.locator('#role-response').innerText(),/FIRST activity group: PASS/);
 assert.match(await page.locator('#draft-checks').innerText(),/NOT CHECKED/);
 await geometry(page,label+' reviewed');
 if(shots){
  await page.locator('#grid').screenshot({path:'test-results/e11-scene-'+label+'-grid.png'});
  await page.locator('#trials').screenshot({path:'test-results/e11-scene-'+label+'-trials.png'});
  await page.locator('#revisit').screenshot({path:'test-results/e11-scene-'+label+'-world-revisit.png'});
 }
 await press(page,'Restart fictional lab');
 assert.equal(await btn(page,'Begin the PAPER trial').isVisible(),true);
 await press(page,'Begin the PAPER trial');
 assert.equal(await page.locator('#loop-visual line[data-selected="true"]').count(),0);
 assert.match(await page.locator('#position').innerText(),/Milo at 1,0/);
 assert.equal(await btn(page,'Place access strip (two middle cells)').isEnabled(),true);
 assert.equal(await btn(page,'Review NONCANONICAL finale').isDisabled(),true);
 assert.equal(await page.locator('#revisit').isVisible(),false);
 assert.equal(await page.locator('#return-route').isVisible(),false);
 assert.equal(await page.locator('#return-reflection').isVisible(),false);
 assert.equal(await page.locator('#verification-plan').isVisible(),false);
 await invariant(page,label+' reset');
 await page.reload();await press(page,'Begin the PAPER trial');await btn(page,'Cell 0,1').waitFor();
 assert.match(await page.locator('#position').innerText(),/Milo at 1,0/);
 await invariant(page,label+' reload');
 records.push({label,passed:true,flow:'blocked-walk-failed-user-revise-both-pass-compare-loop-retry-review-reset'});
}
try{
 for(const v of [
  {width:1366,height:900,label:'desktop',touch:false,shots:true},
  {width:568,height:320,label:'phone-landscape-small',touch:true,shots:true},
  {width:667,height:375,label:'phone-landscape-wide',touch:true,shots:false},
  {width:390,height:844,label:'phone-portrait',touch:true,shots:false}
 ]){
  const {ctx,page}=await open(v.width,v.height,v.label,v.touch);
  try{await journey(page,v.label,v.shots);}finally{await ctx.close();}
 }
 const {ctx,page}=await open(568,320,'keyboard',false);
 try{
  await btn(page,'Place access strip (two middle cells)').focus();await page.keyboard.press('Enter');
  assert.equal(await btn(page,'Place access strip (two middle cells)').isDisabled(),true);
  await btn(page,'Place quiet seat').focus();await page.keyboard.press('Space');
  await btn(page,'Cell 0,1').focus();await page.keyboard.press('Enter');
  assert.match(await page.locator('#grid').innerText(),/Quiet/);
  records.push({label:'keyboard',passed:true});
 }finally{await ctx.close();}
 assert.deepEqual(errors,[],'no page/console errors');
 await writeFile('test-results/e11-scene-scene-browser-report.json',JSON.stringify({records,errors,passed:true},null,2));
 console.log('E11 independent scene Chromium PASS: four journeys, keyboard, E10 callback, no unlock');
}catch(e){
 await writeFile('test-results/e11-scene-scene-browser-report.json',JSON.stringify({records,errors,passed:false,error:String(e.stack||e)},null,2));
 throw e;
}finally{await browser.close();}
