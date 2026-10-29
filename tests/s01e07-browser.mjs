// Real Chromium journeys for the isolated E07 model only; NOT a production release.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const records=[],errors=[];
const btn=(page,name)=>page.getByRole('button',{name,exact:true});
async function press(page,name){
  assert.equal(await btn(page,name).isEnabled(),true,name+' enabled');
  await btn(page,name).click();
}
async function walk(page,name){await press(page,'Walk Milo to '+name);}
async function geometry(page,label){
  const result=await page.evaluate(()=>{
    const s=document.querySelector('#scene').getBoundingClientRect();
    return {viewport:innerWidth,scroll:document.documentElement.scrollWidth,
      scene:{left:s.left,right:s.right,width:s.width},
      anchors:[...document.querySelectorAll('#scene button')].map(el=>{
        const r=el.getBoundingClientRect();
        return {name:el.getAttribute('aria-label'),left:r.left,right:r.right,width:r.width,height:r.height};
      }),
      buttons:[...document.querySelectorAll('button:not(:disabled)')].map(el=>{
        const r=el.getBoundingClientRect();
        return {name:el.textContent,width:r.width,height:r.height};
      })};
  });
  assert.ok(result.scroll<=result.viewport+1,label+' no horizontal overflow');
  assert.ok(result.scene.width>180&&result.scene.left>=-1&&result.scene.right<=result.viewport+1,
    label+' scene visible');
  for(const a of result.anchors)assert.ok(
    a.left>=result.scene.left-1&&a.right<=result.scene.right+1,
    label+' '+a.name+' stays inside scene');
  for(const b of result.buttons)assert.ok(b.width>=43.5&&b.height>=43.5,
    label+' touch target '+b.name);
  records.push({label,geometry:result});
}
async function noCanon(page,label){
  const c=await page.locator('#chronicle').innerText();
  assert.match(c,/Canonical events: 0; unlocks: 0; historical claims: 0/,label+' no canonical effects');
  assert.match(c,/historical evidence remain unknown/,label+' no invented history');
  assert.match(await page.locator('.notice').innerText(),/MODEL — NOT THE REAL SITE/,label+' model warning');
  assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).sort()),
    ['wondervale-e07-test-sentinel'],label+' no storage writes');
  assert.equal(await page.evaluate(()=>localStorage.getItem('wondervale-e07-test-sentinel')),
    'unchanged',label+' untouched sentinel');
}
async function open(width,height,label,touch){
  const ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,
    isMobile:touch,reducedMotion:'reduce'});
  const page=await ctx.newPage();
  page.on('pageerror',e=>errors.push(label+': '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(label+': '+m.text());});
  const response=await page.goto(base+'/e07-prototype/',{waitUntil:'load'});
  assert.equal(response?.status(),200,label+' HTML');
  await page.locator('#scene[data-phase="inspect"]').waitFor();
  await page.evaluate(()=>localStorage.setItem('wondervale-e07-test-sentinel','unchanged'));
  assert.equal(await page.locator('#board .cell').count(),56,label+' 8x7 model cells');
  assert.equal(await page.locator('.milo').count(),1,label+' exactly one Milo');
  return {ctx,page};
}
async function journey(page,label,screenshots){
  await geometry(page,label+' start');
  assert.equal(await btn(page,'Walk Milo to Model bench').isDisabled(),true,'no teleport');
  assert.equal(await btn(page,'Test Milo').isDisabled(),true,'must observe first');
  assert.equal(await btn(page,'Place: Upper side detour').isDisabled(),true,'no premature edit');
  const before=await page.locator('.milo').evaluate(el=>el.style.left);
  await walk(page,'Shared path');
  const after=await page.locator('.milo').evaluate(el=>el.style.left);
  assert.notEqual(before,after,'Milo visibly changes position');
  await press(page,'Look: Shared path');
  await walk(page,'Water channel');
  await press(page,'Look: Water channel');
  await walk(page,'Model bench');
  assert.equal(await btn(page,'Test Another person').isDisabled(),true,
    'test Milo before other users');
  await press(page,'Test Milo');
  assert.match(await page.locator('#trial-results').innerText(),/Milo: PASS/);
  assert.equal(await page.locator('#parent-cue').isVisible(),true,'parent cue appears once relevant');
  await press(page,'Test Another person');
  await press(page,'Test Water');
  assert.match(await page.locator('#trial-results').innerText(),/Another person: BLOCKED/);
  assert.match(await page.locator('#trial-results').innerText(),/Water: BLOCKED/);
  assert.equal(await btn(page,'Compare FIRST and NOW').isDisabled(),true);
  await press(page,'Place: Path clear, water blocked');
  await press(page,'Run all three traces');
  assert.match(await page.locator('#revision-results').innerText(),/Another person: PASS/);
  assert.match(await page.locator('#revision-results').innerText(),/Water: BLOCKED/);
  assert.equal(await btn(page,'Compare FIRST and NOW').isDisabled(),true,
    'cannot pass with water blocked');
  await press(page,'Place: Upper side detour');
  assert.match(await page.locator('#revision-results').innerText(),/Water: NEEDS TEST/,
    'new layout invalidates old traces');
  await press(page,'Run all three traces');
  const now=await page.locator('#revision-results').innerText();
  assert.match(now,/Milo: PASS/);assert.match(now,/Another person: PASS/);
  assert.match(now,/Water: PASS/);
  assert.equal(await btn(page,'Confirm model preview').isDisabled(),true,
    'explicit first/now comparison required');
  await press(page,'Compare FIRST and NOW');
  assert.match(await page.locator('#comparison').innerText(),/FIRST:.*NOW:/);
  await press(page,'Confirm model preview');
  assert.match(await page.locator('#hook').innerText(),/Lantern Steps base only/);
  assert.equal(await btn(page,'Walk Milo to Water channel').isDisabled(),true,
    'completed preview frozen');
  assert.match(await page.locator('#chronicle').innerText(),/Finn revises his idea/);
  await noCanon(page,label+' complete');
  await geometry(page,label+' complete');
  if(screenshots){
    await page.locator('#scene').screenshot({path:'test-results/e07-'+label+'-scene.png'});
    await page.locator('#board').screenshot({path:'test-results/e07-'+label+'-model.png'});
  }
  await press(page,'Restart this preview');
  assert.equal(await page.locator('#scene').getAttribute('data-phase'),'inspect');
  assert.match(await page.locator('#observations').innerText(),/nothing yet/);
  await noCanon(page,label+' reset');
  await page.reload();
  await page.locator('#scene[data-phase="inspect"]').waitFor();
  assert.match(await page.locator('#observations').innerText(),/nothing yet/);
  await noCanon(page,label+' reload');
  records.push({label,flow:'walk-inspect-three-first-traces-failed-revision-retest-compare-confirm-reset-reload',passed:true});
}
try{
  for(const v of [
    {width:1366,height:900,label:'desktop',touch:false,screenshots:true},
    {width:568,height:320,label:'phone-landscape-small',touch:true,screenshots:true},
    {width:667,height:375,label:'phone-landscape-wide',touch:true,screenshots:false},
    {width:390,height:844,label:'phone-portrait',touch:true,screenshots:false}
  ]){
    const {ctx,page}=await open(v.width,v.height,v.label,v.touch);
    try{await journey(page,v.label,v.screenshots);}finally{await ctx.close();}
  }
  const {ctx,page}=await open(568,320,'keyboard',false);
  try{
    await btn(page,'Walk Milo to Shared path').focus();
    await page.keyboard.press('Enter');
    assert.equal(await btn(page,'Look: Shared path').isEnabled(),true);
    await btn(page,'Look: Shared path').focus();
    await page.keyboard.press('Space');
    assert.match(await page.locator('#observations').innerText(),/Looked at: Shared path/);
    await btn(page,'Walk Milo to Water channel').focus();
    await page.keyboard.press('Space');
    assert.equal(await btn(page,'Look: Water channel').isEnabled(),true);
    records.push({label:'keyboard',passed:true});
  }finally{await ctx.close();}
  assert.deepEqual(errors,[],'no browser page/console errors');
  await writeFile('test-results/e07-browser-report.json',
    JSON.stringify({records,errors,passed:true},null,2));
  console.log('E07 Chromium PASS: four full viewport journeys and keyboard, isolated model only');
}catch(error){
  await writeFile('test-results/e07-browser-report.json',
    JSON.stringify({records,errors,passed:false,error:String(error.stack||error)},null,2));
  throw error;
}finally{await browser.close();}
