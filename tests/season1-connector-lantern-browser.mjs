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
      assert.equal((await page.goto(base+'/authoring-labs/connector-lantern.html'))?.status(),200);
      assert.match(await page.locator('.notice').innerText(),/NOT THE PRODUCTION GAME/);
      await page.evaluate(()=>localStorage.setItem('lantern-sentinel','unchanged'));
      assert.equal(await button('nav:to-steps:').isDisabled(),true);
      for(const anchor of ['shared-path','channel']){
        await hit('connector:walk:'+anchor);
        await hit('connector:inspect:'+anchor);
      }
      await hit('connector:walk:workbench');
      for(const type of ['test-milo','test-resident','test-water'])
        await hit('connector:'+type+':');
      assert.match(await page.locator('#progress').innerText(),/person BLOCKED/);
      await hit('connector:place-piece:path-clear-water-blocked');
      await hit('connector:run-all-traces:');
      assert.match(await page.locator('#progress').innerText(),/water BLOCKED/);
      assert.equal(await button('connector:compare-layouts:').isDisabled(),true);
      await hit('connector:place-piece:side-offset');
      await hit('connector:run-all-traces:');
      await hit('connector:compare-layouts:');
      await hit('connector:confirm-preview:');
      assert.match(await page.locator('#connector-object').innerText(),/Revised PAPER connector remains/);
      await hit('nav:to-steps:');
      assert.match(await page.locator('#lamps-object').innerText(),/LOWER A OFF · LOWER B OFF/);
      assert.equal(await button('steps:walk:side').isDisabled(),true);
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
      assert.equal(await page.locator('#parent-cue').isVisible(),true);
      await hit('steps:walk:lower-landing');
      await hit('steps:walk:side');
      await hit('steps:observe-view:');
      await hit('steps:inspect:service-plate');
      await hit('steps:compare-views:');
      await hit('steps:confirm-preview:');
      assert.match(await page.locator('#progress').innerText(),/undated_source_pending/);
      assert.match(await page.locator('#progress').innerText(),/Canonical events 0; unlocks 0; historical dates UNKNOWN/);
      assert.match(await page.locator('#lamps-object').innerText(),/UPPER HILL CLOSED/);
      assert.match(await page.locator('#connector-object').innerText(),/Revised PAPER connector remains/);
      await hit('nav:to-connector:');
      assert.match(await page.locator('#lamps-object').innerText(),/LOWER A ON · LOWER B ON/);
      await hit('nav:to-steps:');
      assert.match(await page.locator('#progress').innerText(),/Same three markers; different apparent spacing/);
      assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['lantern-sentinel']);
      const width=await page.evaluate(()=>({view:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(width.scroll<=width.view+1,v.label+' horizontal overflow');
      if(v.label==='desktop')await page.screenshot({path:'test-results/connector-lantern-desktop.png'});
      await page.locator('#restart').click();
      assert.equal(await button('nav:to-steps:').isDisabled(),true);
      assert.match(await page.locator('#lamps-object').innerText(),/LOWER A OFF · LOWER B OFF/);
      report.push({viewport:v.label,journey:'PASS',safeGate:'PASS',revisit:'PASS',reset:'PASS',storage:'PASS'});
    }finally{await context.close();}
  }
  const context=await browser.newContext({viewport:{width:568,height:320}});
  try{
    const page=await context.newPage();
    await page.goto(base+'/authoring-labs/connector-lantern.html');
    await page.locator('[data-action="connector:walk:shared-path"]').focus();
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#task-cue').innerText(),/Milo at shared-path/);
    await page.locator('[data-action="connector:inspect:shared-path"]').focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('[data-action="connector:inspect:shared-path"]').isDisabled(),true);
    report.push({viewport:'keyboard',movement:'PASS',inspect:'PASS'});
  }finally{await context.close();}
  assert.deepEqual(errors,[]);
  await writeFile('test-results/connector-lantern-report.json',JSON.stringify({passed:true,report},null,2));
  console.log('E07->E08 lower Lantern Steps Chromium PASS: three viewports, keyboard, light-off gate, two views, revisit, reset, no storage');
}catch(e){
  await writeFile('test-results/connector-lantern-report.json',JSON.stringify({passed:false,report,errors,error:String(e.stack||e)},null,2));
  throw e;
}finally{await browser.close();}
