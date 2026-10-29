// E05->E06 world-change model: full child-operated browser path, not canonical episode acceptance.
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
   assert.equal((await page.goto(base+'/authoring-labs/world-change.html'))?.status(),200);
   assert.match(await page.locator('.notice').innerText(),/NOT THE PRODUCTION GAME/);
   await page.evaluate(()=>localStorage.setItem('world-sentinel','untouched'));
   assert.equal(await page.locator('[data-action="nav:to-current:"]').isDisabled(),true);
   await hit('e05:inspect-feature:peg-pair');await hit('e05:inspect-feature:worn-edge');
   await hit('e05:place-replica:side-b');await hit('e05:compare-fit:');
   assert.match(await page.locator('#feedback').innerText(),/do not line up/);
   await hit('e05:place-replica:side-a');await hit('e05:compare-fit:');
   await hit('e05:note-limits:');
   await hit('e05:place-table:across-walkway');
   assert.match(await page.locator('#feedback').innerText(),/covers the public walkway/);
   await hit('e05:place-table:near-wall');await hit('e05:confirm-room:');
   assert.match(await page.locator('#map-object').innerText(),/now visible/);
   await hit('nav:to-current:');
   for(const id of ['slope','shared-path']){
    await hit('e06:walk-to:'+id);await hit('e06:inspect:'+id);
   }
   await hit('e06:walk-to:model-tray');await hit('e06:run-model:');
   await hit('e06:set-weather:rain');await hit('e06:run-model:');
   await hit('e06:set-channel:blocked');await hit('e06:run-model:');
   await hit('e06:compare-model:');
   assert.match(await page.locator('#upper-object').innerText(),/Rain tray compared/);
   await hit('e06:visit-lower:');
   await hit('e06:inspect:runoff-trace');
   await hit('e06:walk-to:public-path');await hit('e06:inspect:public-path');
   for(const site of ['runoff-channel','footpath','raised-pocket']){
    await hit('e06:walk-to:'+site);await hit('e06:move-marker:'+site);
    await hit('e06:inspect-result:');
    if(site!=='raised-pocket')assert.equal(await page.locator('[data-action="e06:confirm-small-trial:"]').isDisabled(),true);
   }
   await hit('e06:confirm-small-trial:');
   assert.match(await page.locator('#pocket-object').innerText(),/Small PAPER planting pocket/);
   await hit('nav:to-station:');
   assert.match(await page.locator('#map-object').innerText(),/now visible/);
   await hit('nav:to-current:');
   assert.match(await page.locator('#upper-object').innerText(),/Healthy beds stay/);
   await hit('nav:to-lower:');
   assert.match(await page.locator('#pocket-object').innerText(),/Small PAPER planting pocket/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).sort()),['world-sentinel']);
   assert.equal(await page.evaluate(()=>localStorage.getItem('world-sentinel')),'untouched');
   const geo=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(geo.scroll<=geo.width+1,v.label+' horizontal overflow');
   await page.locator('#restart').click();
   assert.match(await page.locator('#map-object').innerText(),/no map table yet/);
   assert.match(await page.locator('#pocket-object').innerText(),/No pocket trial yet/);
   if(v.label==='desktop')await page.screenshot({path:'test-results/world-change-desktop.png'});
   report.push({viewport:v.label,journey:'PASS',revisit:'PASS',reset:'PASS',storage:'PASS'});
  }finally{await context.close();}
 }
 const context=await browser.newContext({viewport:{width:568,height:320}});
 const page=await context.newPage();
 try{
  await page.goto(base+'/authoring-labs/world-change.html');
  await page.locator('[data-action="e05:inspect-feature:peg-pair"]').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('[data-action="e05:inspect-feature:peg-pair"]').isDisabled(),true);
  await page.locator('[data-action="e05:inspect-feature:worn-edge"]').focus();
  await page.keyboard.press('Space');
  assert.equal(await page.locator('[data-action="e05:inspect-feature:worn-edge"]').isDisabled(),true);
  report.push({viewport:'keyboard',navigation:'PASS'});
 }finally{await context.close();}
 assert.deepEqual(errors,[]);
 await writeFile('test-results/world-change-report.json',JSON.stringify({passed:true,report},null,2));
 console.log('World-change Chromium PASS: 3 viewports, keyboard, wrong placements, model callback, revisit, reset, no storage');
}catch(e){
 await writeFile('test-results/world-change-report.json',JSON.stringify({passed:false,report,errors,error:String(e.stack||e)},null,2));
 throw e;
}finally{await browser.close();}
