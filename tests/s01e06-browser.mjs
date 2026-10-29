// Real Chromium acceptance for the isolated, noncanonical E06 two-garden authoring lab.
// Does not exercise or approve the E06 production episode, real drainage, planting or MN4.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';

const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const records=[];
const errors=[];
const sceneId=page=>page.locator('#scene').getAttribute('data-scene');
const btn=(page,name)=>page.getByRole('button',{name,exact:true});
async function press(page,name){
  const control=btn(page,name);
  assert.equal(await control.isEnabled(),true,name+' is enabled');
  await control.click();
}
async function walk(page,name){
  await press(page,'Walk Milo to '+name);
  assert.equal(await page.locator('.milo').count(),1,'exactly one player-controlled Milo');
}
async function geometry(page,label){
  const g=await page.evaluate(()=>{
    const scene=document.querySelector('#scene').getBoundingClientRect();
    const anchors=[...document.querySelectorAll('#scene button')].map(el=>{
      const r=el.getBoundingClientRect();
      return {label:el.getAttribute('aria-label'),left:r.left,right:r.right,top:r.top,
        bottom:r.bottom,width:r.width,height:r.height};
    });
    const buttons=[...document.querySelectorAll('button:not(:disabled)')].map(el=>{
      const r=el.getBoundingClientRect();
      return {name:el.textContent,width:r.width,height:r.height};
    });
    return {viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,
      scene:{left:scene.left,right:scene.right,width:scene.width,height:scene.height},
      anchors,buttons};
  });
  assert.ok(g.scrollWidth<=g.viewport+1,label+' no horizontal page overflow');
  assert.ok(g.scene.width>180&&g.scene.left>=-1&&g.scene.right<=g.viewport+1,
    label+' scene is visible in viewport width');
  for(const a of g.anchors){
    assert.ok(a.left>=g.scene.left-1&&a.right<=g.scene.right+1,
      label+' '+a.label+' anchor stays within the scene');
  }
  for(const b of g.buttons){
    assert.ok(b.height>=43.5&&b.width>=43.5,label+' 44px touch control: '+b.name);
  }
  records.push({label,geometry:g});
}
async function assertNoCanon(page,label){
  const text=await page.locator('#chronicle').innerText();
  assert.match(text,/STILL UNKNOWN: Why did the real garden move\?/,
    label+' does not invent historical causality');
  assert.match(text,/Canonical events: 0; unlocks: 0/,
    label+' cannot save a canonical completion or unlock E07');
  assert.match(await page.locator('.notice').innerText(),/TEST GEOMETRY ONLY/,
    label+' is conspicuously synthetic');
  const keys=await page.evaluate(()=>Object.keys(localStorage).sort());
  assert.deepEqual(keys,['wondervale-e06-test-sentinel'],
    label+' has not written production or preview storage');
  assert.equal(await page.evaluate(()=>localStorage.getItem('wondervale-e06-test-sentinel')),
    'unchanged');
}
async function open(width,height,label,touch){
  const ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,
    isMobile:touch,reducedMotion:'reduce'});
  const page=await ctx.newPage();
  page.on('pageerror',e=>errors.push(label+': '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(label+': '+m.text());});
  const response=await page.goto(base+'/e06-prototype/',{waitUntil:'load'});
  assert.equal(response?.status(),200,label+' HTML served');
  await page.locator('#scene[data-scene="s01e06-current-garden"]').waitFor();
  await page.evaluate(()=>localStorage.setItem('wondervale-e06-test-sentinel','unchanged'));
  assert.equal(await sceneId(page),'s01e06-current-garden');
  assert.match(await page.locator('#scene').getAttribute('aria-label'),/Current Garden/);
  return {ctx,page};
}
async function complete(page,label,screenshots){
  await geometry(page,label+' current');
  assert.equal(await btn(page,'Run this model').isDisabled(),true,
    'model cannot start before two inspections');
  assert.equal(await btn(page,'Walk to Lower Garden').isDisabled(),true,
    'cannot skip current-garden reasoning');
  assert.equal(await btn(page,'Look: Higher slope').isDisabled(),true,
    'walking and inspecting are separate');
  const before=await page.locator('.milo').evaluate(el=>el.style.left);
  await press(page,'Look: Healthy beds');
  await walk(page,'Higher slope');
  const after=await page.locator('.milo').evaluate(el=>el.style.left);
  assert.notEqual(before,after,'Milo visibly changes position in Current Garden');
  await press(page,'Look: Higher slope');
  await walk(page,'Rain model tray');
  await press(page,'Run this model');
  assert.match(await page.locator('#model-result').innerText(),/Model runs: 1/);
  assert.match(await page.locator('#meters').innerText(),/Low catchment: 0\/3/);
  assert.equal(await btn(page,'Compare model results').isDisabled(),true);
  await press(page,'Rain');
  await press(page,'Run this model');
  assert.match(await page.locator('#meters').innerText(),/Low catchment: 1\/3/);
  await press(page,'Channel blocked');
  await press(page,'Run this model');
  assert.match(await page.locator('#meters').innerText(),/Low catchment: 3\/3/);
  assert.equal(await btn(page,'Run this model').isDisabled(),true,
    'cannot repeat an identical observation');
  await press(page,'Compare model results');
  assert.equal(await page.locator('#parent-cue').isVisible(),true,
    'one optional parent cue follows comparison');
  assert.match(await page.locator('#model-result').innerText(),/historical cause unknown/);
  if(screenshots)await page.locator('#scene').screenshot({path:'test-results/e06-'+label+'-current.png'});
  await press(page,'Walk to Lower Garden');
  assert.equal(await sceneId(page),'s01e06-lower-garden');
  assert.match(await page.locator('#scene').getAttribute('aria-label'),/Lower Garden/);
  assert.equal(await btn(page,'Walk Milo to Healthy beds').count(),0,
    'the Lower Garden has its own anchors, not a recolored current scene');
  await geometry(page,label+' lower');
  assert.equal(await btn(page,'Try marker: Raised pocket').isDisabled(),true,
    'must inspect water and public access before placing');
  await press(page,'Look: Water trace');
  await walk(page,'Shared path');
  await press(page,'Look: Shared path');
  await walk(page,'Water route');
  await press(page,'Try marker: Water route');
  assert.match(await page.locator('#plant-result').innerText(),/Wet route: yes; path blocked: no/);
  await press(page,'Inspect marker result');
  assert.equal(await btn(page,'Confirm small trial (preview)').isDisabled(),true,
    'wet route cannot be confirmed');
  await walk(page,'Footpath');
  await press(page,'Try marker: Footpath');
  assert.match(await page.locator('#plant-result').innerText(),/Wet route: no; path blocked: yes/);
  assert.equal(await btn(page,'Inspect marker result').isDisabled(),false,
    'moving marker invalidates the previous inspection');
  await press(page,'Inspect marker result');
  assert.equal(await btn(page,'Confirm small trial (preview)').isDisabled(),true,
    'shared footpath cannot be blocked');
  await walk(page,'Raised pocket');
  await press(page,'Try marker: Raised pocket');
  assert.match(await page.locator('#plant-result').innerText(),/Wet route: no; path blocked: no/);
  assert.equal(await btn(page,'Confirm small trial (preview)').isDisabled(),true,
    'even a viable trial must be inspected');
  await press(page,'Inspect marker result');
  await press(page,'Confirm small trial (preview)');
  assert.equal(await sceneId(page),'s01e06-lower-garden');
  assert.equal(await page.locator('.pocket.planted').count(),1,
    'small pocket appears only in noncanonical preview');
  assert.equal(await btn(page,'Walk Milo to Footpath').isDisabled(),true,
    'completed preview is frozen');
  assert.match(await page.locator('#plant-result').innerText(),/Real permission and care are not approved/);
  await assertNoCanon(page,label+' completed');
  if(screenshots)await page.locator('#scene').screenshot({path:'test-results/e06-'+label+'-lower.png'});
  await press(page,'Restart this preview');
  assert.equal(await sceneId(page),'s01e06-current-garden');
  assert.match(await page.locator('#observations').innerText(),/nothing yet/);
  assert.equal(await btn(page,'Run this model').isDisabled(),true);
  await assertNoCanon(page,label+' restart');
  await page.reload();
  await page.locator('#scene[data-scene="s01e06-current-garden"]').waitFor();
  assert.match(await page.locator('#observations').innerText(),/nothing yet/,
    'reload does not resurrect a saved E06 preview');
  await assertNoCanon(page,label+' reload');
  records.push({label,flow:'current-model-lower-wet-path-viable-restart-reload',passed:true});
}
try{
  for(const v of [
    {width:1366,height:900,label:'desktop',touch:false,screenshots:true},
    {width:568,height:320,label:'phone-landscape-small',touch:true,screenshots:true},
    {width:667,height:375,label:'phone-landscape-wide',touch:true,screenshots:false},
    {width:390,height:844,label:'phone-portrait',touch:true,screenshots:false}
  ]){
    const {ctx,page}=await open(v.width,v.height,v.label,v.touch);
    try{await complete(page,v.label,v.screenshots);}finally{await ctx.close();}
  }
  const {ctx,page}=await open(568,320,'keyboard-equivalence',false);
  try{
    await btn(page,'Look: Healthy beds').focus();
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#observations').innerText(),/Healthy beds/);
    await btn(page,'Walk Milo to Higher slope').focus();
    await page.keyboard.press('Enter');
    assert.equal(await btn(page,'Look: Higher slope').isEnabled(),true);
    await btn(page,'Look: Higher slope').focus();
    await page.keyboard.press('Space');
    assert.match(await page.locator('#observations').innerText(),/Higher slope/);
    records.push({label:'keyboard-equivalence',passed:true});
  }finally{await ctx.close();}
  assert.deepEqual(errors,[],'no page/console errors');
  await writeFile('test-results/e06-browser-report.json',JSON.stringify({records,errors,passed:true},null,2));
  console.log('E06 Chromium PASS: 4 viewport full flows + keyboard, no canonical writes; '+records.length+' records');
}catch(error){
  await writeFile('test-results/e06-browser-report.json',JSON.stringify({records,errors,passed:false,error:String(error.stack||error)},null,2));
  throw error;
}finally{await browser.close();}
