import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const report=[],errors=[];
try{
 for(const v of [
   {width:1366,height:900,label:'desktop'},
   {width:568,height:320,label:'landscape'},
   {width:390,height:844,label:'portrait'}
 ]){
   const context=await browser.newContext({viewport:{width:v.width,height:v.height},reducedMotion:'reduce'});
   const page=await context.newPage();
   page.on('pageerror',e=>errors.push(v.label+': '+e.message));
   page.on('console',m=>{if(m.type()==='error')errors.push(v.label+': '+m.text());});
   const button=id=>page.locator('[data-action="'+id+'"]');
   const hit=async id=>button(id).click();
   try{
     assert.equal((await page.goto(base+'/authoring-labs/lantern-hill.html'))?.status(),200);
     assert.match(await page.locator('.notice').innerText(),/NOT THE PRODUCTION GAME/);
     await page.evaluate(()=>localStorage.setItem('hill-sentinel','unchanged'));
     assert.equal(await button('nav:to-hill:').isDisabled(),true);
     assert.equal(await button('steps:observe-view:').isDisabled(),true);
     for(const feature of ['brackets','boundary','lower-a'])await hit('steps:inspect:'+feature);
     await hit('steps:walk:lower-landing');
     await hit('steps:inspect:lower-b');
     await hit('steps:toggle-lamp:lower-a');
     assert.equal(await button('steps:observe-view:').isDisabled(),true);
     await hit('steps:toggle-lamp:lower-b');
     await hit('steps:walk:base');
     await hit('steps:observe-view:');
     assert.equal(await button('steps:compare-views:').isDisabled(),true);
     await hit('steps:walk:lower-landing');
     await hit('steps:walk:side');
     await hit('steps:observe-view:');
     await hit('steps:inspect:service-plate');
     await hit('steps:compare-views:');
     await hit('steps:confirm-preview:');
     assert.match(await page.locator('#steps-object').innerText(),/undated plate QUESTION/);
     await hit('nav:to-hill:');
     assert.match(await page.locator('#hill-object').innerText(),/UPPER HILL CLOSED/);
     await hit('hill:inspect:entry_note');
     await hit('hill:mark:lower_bend:overlook');
     assert.match(await page.locator('#feedback').innerText(),/Walk this model edge/);
     await hit('hill:walk:signpost');
     await hit('hill:inspect:boundary_sign');
     await hit('hill:walk:fence_view');
     await hit('hill:inspect:disturbed_ground');
     await hit('hill:walk:upper_closed');
     assert.match(await page.locator('#feedback').innerText(),/This way is closed/);
     await hit('hill:mark:fence_view:upper_closed');
     assert.match(await page.locator('#feedback').innerText(),/closed edge cannot be marked/);
     await hit('hill:consider:water_may_change_ground');
     await hit('hill:walk:signpost');
     await hit('hill:walk:lower_bend');
     await hit('hill:inspect:runoff_marks');
     await hit('hill:walk:overlook');
     await hit('hill:inspect:distant_symbol');
     for(const id of ['steps_base:signpost','lower_bend:overlook'])await hit('hill:mark:'+id);
     await hit('hill:check-route:');
     assert.match(await page.locator('#progress').innerText(),/gap at signpost:lower_bend/);
     assert.equal(await button('hill:review:').isDisabled(),true);
     await hit('hill:mark:signpost:lower_bend');
     await hit('hill:check-route:');
     assert.match(await page.locator('#progress').innerText(),/continuous lower PAPER route/);
     await hit('hill:unmark:signpost:lower_bend');
     await hit('hill:check-route:');
     assert.match(await page.locator('#progress').innerText(),/gap at signpost:lower_bend/);
     await hit('hill:mark:signpost:lower_bend');
     await hit('hill:check-route:');
     await hit('hill:compare-symbol:');
     await hit('hill:review:');
     await hit('hill:finish-preview:');
     assert.match(await page.locator('#progress').innerText(),/E10 NOT UNLOCKED. Canonical events 0; unlocks 0/);
     await hit('nav:to-steps:');
     assert.match(await page.locator('#steps-object').innerText(),/LOWER A ON · LOWER B ON/);
     await hit('nav:to-hill:');
     assert.match(await page.locator('#hill-object').innerText(),/Safe PAPER overlook sketched/);
     assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['hill-sentinel']);
     const width=await page.evaluate(()=>({view:innerWidth,scroll:document.documentElement.scrollWidth}));
     assert.ok(width.scroll<=width.view+1,v.label+' horizontal overflow');
     if(v.label==='desktop')await page.screenshot({path:'test-results/lantern-hill-desktop.png'});
     await page.locator('#restart').click();
     assert.equal(await button('nav:to-hill:').isDisabled(),true);
     assert.match(await page.locator('#steps-object').innerText(),/LOWER A OFF · LOWER B OFF/);
     report.push({viewport:v.label,journey:'PASS',closedGate:'PASS',gapRetry:'PASS',revisit:'PASS',reset:'PASS',storage:'PASS'});
   }finally{await context.close();}
 }
 const context=await browser.newContext({viewport:{width:568,height:320}});
 try{
   const page=await context.newPage();
   await page.goto(base+'/authoring-labs/lantern-hill.html');
   await page.locator('[data-action="steps:inspect:brackets"]').focus();
   await page.keyboard.press('Enter');
   assert.equal(await page.locator('[data-action="steps:inspect:brackets"]').isDisabled(),true);
   await page.locator('[data-action="steps:walk:lower-landing"]').focus();
   await page.keyboard.press('Space');
   assert.match(await page.locator('#task-cue').innerText(),/Milo at lower-landing/);
   report.push({viewport:'keyboard',inspect:'PASS',walk:'PASS'});
 }finally{await context.close();}
 assert.deepEqual(errors,[]);
 await writeFile('test-results/lantern-hill-report.json',JSON.stringify({passed:true,report},null,2));
 console.log('E08->E09 safe hill Chromium PASS: 3 viewports, keyboard, closed edge, gap/revise, revisit, reset, zero storage');
}catch(e){
 await writeFile('test-results/lantern-hill-report.json',JSON.stringify({passed:false,report,errors,error:String(e.stack||e)},null,2));
 throw e;
}finally{await browser.close();}
