// Isolated evidence workshop journeys; not Season 1 progression or canonical acceptance.
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
  {width:568,height:320,label:'phone-landscape'},
  {width:390,height:844,label:'phone-portrait'}
 ]){
  const context=await browser.newContext({viewport:{width:v.width,height:v.height},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(v.label+': '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(v.label+': '+m.text());});
  try{
   const response=await page.goto(base+'/authoring-labs/evidence-workshop.html');
   assert.equal(response?.status(),200);
   assert.match(await page.locator('.notice').innerText(),/NOT THE PRODUCTION GAME/);
   assert.doesNotMatch(await page.locator('body').innerText(),/Common/,'no early identity reveal');
   await page.evaluate(()=>localStorage.setItem('evidence-sentinel','unchanged'));
   await page.locator('[data-card="e05-a"]').click();
   await page.locator('[data-type="MAYBE"]').click();
   assert.match(await page.locator('#feedback').innerText(),/Try another group/);
   assert.match(await page.locator('#review').innerText(),/0 of 3/);
   await page.locator('[data-type="MODEL"]').click();
   assert.match(await page.locator('#review').innerText(),/1 of 3/);
   await page.locator('[data-card="e05-b"]').click();
   await page.locator('[data-type="MAYBE"]').click();
   await page.locator('[data-card="e05-c"]').click();
   await page.locator('[data-type="UNKNOWN"]').click();
   assert.match(await page.locator('#review').innerText(),/3 of 3/);
   assert.match(await page.locator('#review').innerText(),/NOT a real source, Chronicle event or episode unlock/);
   await page.locator('#reset').click();
   assert.match(await page.locator('#review').innerText(),/0 of 3/);
   await page.locator('[data-scene="e09"]').click();
   assert.match(await page.locator('#scene-title').innerText(),/Closed Hill/);
   assert.doesNotMatch(await page.locator('body').innerText(),/Common/);
   await page.locator('[data-scene="e10"]').click();
   assert.match(await page.locator('body').innerText(),/Common/);
   assert.match(await page.locator('#review').innerText(),/0 of 3/,'scene selection resets practice');
   const geo=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(geo.scroll<=geo.width+1,v.label+' horizontal overflow');
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).sort()),['evidence-sentinel']);
   assert.equal(await page.evaluate(()=>localStorage.getItem('evidence-sentinel')),'unchanged');
   if(v.label==='desktop')await page.screenshot({path:'test-results/evidence-workshop-desktop.png'});
   report.push({viewport:v.label,classification:'PASS',retry:'PASS',isolation:'PASS'});
  }finally{await context.close();}
 }
 const context=await browser.newContext({viewport:{width:568,height:320}});
 const page=await context.newPage();
 try{
  await page.goto(base+'/authoring-labs/evidence-workshop.html');
  await page.locator('[data-card="e05-a"]').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('[data-type="MODEL"]').isDisabled(),false);
  await page.keyboard.press('Enter'); // focus moved to MODEL by card selection
  assert.match(await page.locator('#review').innerText(),/1 of 3/);
  await page.locator('[data-scene="e06-current"]').focus();
  await page.keyboard.press('Space');
  assert.match(await page.locator('#scene-title').innerText(),/Current Garden/);
  assert.match(await page.locator('#review').innerText(),/0 of 3/);
  report.push({viewport:'keyboard',classification:'PASS'});
 }finally{await context.close();}
 assert.deepEqual(errors,[]);
 await writeFile('test-results/evidence-workshop-report.json',JSON.stringify({passed:true,report},null,2));
 console.log('Evidence workshop Chromium PASS: 3 viewports, retry, isolation, no early reveal and keyboard');
}catch(e){
 await writeFile('test-results/evidence-workshop-report.json',JSON.stringify({passed:false,report,errors,error:String(e.stack||e)},null,2));
 throw e;
}finally{await browser.close();}
