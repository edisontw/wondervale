import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const report=[],errors=[];
try{
 for(const v of [{width:1366,height:900,label:'desktop'},{width:568,height:320,label:'landscape'},{width:390,height:844,label:'portrait'}]){
  const context=await browser.newContext({viewport:{width:v.width,height:v.height},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(v.label+': '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(v.label+': '+m.text());});
  const hit=async id=>page.locator('[data-action="'+id+'"]').click();
  try{
   assert.equal((await page.goto(base+'/authoring-labs/garden-connector.html'))?.status(),200);
   assert.match(await page.locator('.notice').innerText(),/NOT THE PRODUCTION GAME/);
   await page.evaluate(()=>localStorage.setItem('garden-sentinel','unchanged'));
   assert.equal(await page.locator('[data-action="nav:to-connector:"]').isDisabled(),true);
   for(const id of ['slope','shared-path']){
    await hit('garden:walk-to:'+id);await hit('garden:inspect:'+id);
   }
   await hit('garden:walk-to:model-tray');await hit('garden:run-model:');
   await hit('garden:set-weather:rain');await hit('garden:run-model:');
   await hit('garden:set-channel:blocked');await hit('garden:run-model:');
   await hit('garden:compare-model:');await hit('garden:visit-lower:');
   await hit('garden:inspect:runoff-trace');
   await hit('garden:walk-to:public-path');await hit('garden:inspect:public-path');
   for(const site of ['runoff-channel','footpath','raised-pocket']){
    await hit('garden:walk-to:'+site);await hit('garden:move-marker:'+site);
    await hit('garden:inspect-result:');
    if(site!=='raised-pocket')assert.equal(await page.locator('[data-action="garden:confirm-small-trial:"]').isDisabled(),true);
   }
   await hit('garden:confirm-small-trial:');
   assert.match(await page.locator('#pocket-object').innerText(),/PAPER pocket planted/);
   await hit('nav:to-connector:');
   for(const anchor of ['shared-path','channel']){
    await hit('connector:walk:'+anchor);await hit('connector:inspect:'+anchor);
   }
   await hit('connector:walk:workbench');
   for(const type of ['test-milo','test-resident','test-water'])await hit('connector:'+type+':');
   assert.match(await page.locator('#pocket-object').innerText(),/PAPER sprout/);
   await hit('connector:place-piece:path-clear-water-blocked');
   await hit('connector:run-all-traces:');
   assert.match(await page.locator('#progress').innerText(),/water BLOCKED/);
   assert.equal(await page.locator('[data-action="connector:compare-layouts:"]').isDisabled(),true);
   await hit('connector:place-piece:side-offset');
   await hit('connector:run-all-traces:');
   await hit('connector:compare-layouts:');await hit('connector:confirm-preview:');
   assert.match(await page.locator('#pocket-object').innerText(),/PAPER leaf/);
   await hit('nav:to-garden:');
   assert.match(await page.locator('#pocket-object').innerText(),/PAPER leaf/);
   await hit('nav:to-connector:');
   assert.match(await page.locator('#passage-object').innerText(),/Revised PAPER connector/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['garden-sentinel']);
   const width=await page.evaluate(()=>({view:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(width.scroll<=width.view+1,v.label+' horizontal overflow');
   if(v.label==='desktop')await page.screenshot({path:'test-results/garden-connector-desktop.png'});
   await page.locator('#restart').click();
   assert.match(await page.locator('#pocket-object').innerText(),/No pocket trial yet/);
   report.push({viewport:v.label,journey:'PASS',revisit:'PASS',storage:'PASS',reset:'PASS'});
  }finally{await context.close();}
 }
 const context=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await context.newPage();await page.goto(base+'/authoring-labs/garden-connector.html');
  await page.locator('[data-action="garden:walk-to:slope"]').focus();
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#task-cue').innerText(),/Milo at slope/);
  await page.locator('[data-action="garden:inspect:slope"]').focus();
  await page.keyboard.press('Space');
  assert.equal(await page.locator('[data-action="garden:inspect:slope"]').isDisabled(),true);
  report.push({viewport:'keyboard',movement:'PASS',inspect:'PASS'});
 }finally{await context.close();}
 assert.deepEqual(errors,[]);
 await writeFile('test-results/garden-connector-report.json',JSON.stringify({passed:true,report},null,2));
 console.log('E06->E07 paper pocket Chromium PASS: three viewports, keyboard, retry, growth callback, revisits, reset, no storage');
}catch(e){
 await writeFile('test-results/garden-connector-report.json',JSON.stringify({passed:false,report,errors,error:String(e.stack||e)},null,2));
 throw e;
}finally{await browser.close();}
