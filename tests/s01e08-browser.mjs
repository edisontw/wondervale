// E08 synthetic browser lab Chromium tests; NOT production or real-device acceptance.
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
  const data=await page.evaluate(()=>{
    const scene=document.querySelector('#scene').getBoundingClientRect();
    return {viewport:innerWidth,scroll:document.documentElement.scrollWidth,
      scene:{left:scene.left,right:scene.right,width:scene.width},
      anchors:[...document.querySelectorAll('#scene button')].map(el=>{
        const r=el.getBoundingClientRect();
        return {name:el.getAttribute('aria-label'),left:r.left,right:r.right,width:r.width,height:r.height};
      }),
      buttons:[...document.querySelectorAll('button:not(:disabled)')].map(el=>{
        const r=el.getBoundingClientRect();
        return {name:el.textContent,width:r.width,height:r.height};
      })};
  });
  assert.ok(data.scroll<=data.viewport+1,label+' no horizontal overflow');
  assert.ok(data.scene.width>180&&data.scene.left>=-1&&data.scene.right<=data.viewport+1,
    label+' scene visible');
  for(const a of data.anchors)assert.ok(a.left>=data.scene.left-1&&a.right<=data.scene.right+1,
    label+' '+a.name+' stays inside scene');
  for(const b of data.buttons)assert.ok(b.width>=43.5&&b.height>=43.5,
    label+' 44px touch target '+b.name);
  records.push({label,geometry:data});
}
async function noCanon(page,label){
  const t=await page.locator('#chronicle').innerText();
  assert.match(t,/Canonical events: 0; unlocks: 0; historical claims: 0/,label);
  assert.match(await page.locator('.notice').innerText(),/MODEL — NOT THE REAL STEPS/);
  assert.match(await page.locator('.upper').innerText(),/UPPER HILL CLOSED/);
  assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).sort()),
    ['wondervale-e08-test-sentinel'],label+' no storage writes');
  assert.equal(await page.evaluate(()=>localStorage.getItem('wondervale-e08-test-sentinel')),
    'unchanged');
  assert.doesNotMatch(t,/18\d\d|19\d\d|20\d\d|Common revealed|hill opened/i);
}
async function open(width,height,label,touch){
  const ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,
    isMobile:touch,reducedMotion:'reduce'});
  const page=await ctx.newPage();
  page.on('pageerror',e=>errors.push(label+': '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(label+': '+m.text());});
  const response=await page.goto(base+'/e08-prototype/',{waitUntil:'load'});
  assert.equal(response?.status(),200,label+' HTML served');
  await page.locator('#scene[data-phase="inspect"]').waitFor();
  await page.evaluate(()=>localStorage.setItem('wondervale-e08-test-sentinel','unchanged'));
  assert.equal(await page.locator('.milo').count(),1,label+' Milo actor');
  assert.equal(await page.locator('.lamp').count(),2,label+' two model lamps');
  return {ctx,page};
}
async function journey(page,label,screenshots){
  await geometry(page,label+' start');
  assert.equal(await btn(page,'Walk Milo to Side lookout').isDisabled(),true,'no teleport');
  assert.equal(await btn(page,'Turn on: Lower lamp A').isDisabled(),true,'inspect first');
  assert.equal(await btn(page,'Observe from Base').isDisabled(),true,'need lights');
  assert.equal(await btn(page,'Compare two viewpoints').isDisabled(),true,'no evidence');
  await press(page,'Look: Brackets');
  await press(page,'Look: Closed upper boundary');
  await press(page,'Look: Lower lamp A');
  const before=await page.locator('.milo').evaluate(el=>el.style.left);
  await walk(page,'Lower landing');
  const after=await page.locator('.milo').evaluate(el=>el.style.left);
  assert.notEqual(before,after,'Milo moved visibly');
  await press(page,'Look: Lower lamp B');
  await press(page,'Turn on: Lower lamp A');
  assert.match(await page.locator('#light-status').innerText(),/Not enough light to compare yet/);
  assert.equal(await btn(page,'Observe from Lower landing').isDisabled(),true);
  await press(page,'Turn on: Lower lamp B');
  await walk(page,'Base');
  await press(page,'Observe from Base');
  assert.match(await page.locator('#view-status').innerText(),/Base \(0\.0° spread\)/);
  assert.equal(await page.locator('#parent-cue').isVisible(),true);
  assert.equal(await btn(page,'Compare two viewpoints').isDisabled(),true);
  await walk(page,'Lower landing');
  await walk(page,'Side lookout');
  await press(page,'Observe from Side lookout');
  assert.match(await page.locator('#view-status').innerText(),/Side lookout \([3-9]\d\.\d° spread\)/);
  assert.equal(await page.locator('.view-card .mark').count(),6);
  assert.equal(await btn(page,'Confirm model preview').isDisabled(),true);
  await press(page,'Look: Undated service plate');
  await press(page,'Compare two viewpoints');
  assert.match(await page.locator('#comparison').innerText(),/A line-up is not historical proof/);
  await press(page,'Confirm model preview');
  assert.match(await page.locator('#hook').innerText(),/safe North Hill survey only — NOT UNLOCKED/);
  assert.equal(await btn(page,'Walk Milo to Lower landing').isDisabled(),true);
  assert.match(await page.locator('#chronicle').innerText(),/undated service plate, source pending/);
  await noCanon(page,label+' complete');
  await geometry(page,label+' complete');
  if(screenshots){
    await page.locator('#scene').screenshot({path:'test-results/e08-'+label+'-scene.png'});
    await page.locator('#projections').screenshot({path:'test-results/e08-'+label+'-two-views.png'});
  }
  await press(page,'Restart this preview');
  assert.equal(await page.locator('#scene').getAttribute('data-phase'),'inspect');
  assert.match(await page.locator('#inspections').innerText(),/nothing yet/);
  assert.match(await page.locator('#view-status').innerText(),/none yet/);
  await noCanon(page,label+' reset');
  await page.reload();
  await page.locator('#scene[data-phase="inspect"]').waitFor();
  assert.match(await page.locator('#inspections').innerText(),/nothing yet/);
  await noCanon(page,label+' reload');
  records.push({label,flow:'inspect-walk-two-lamps-base-side-plate-compare-confirm-reset-reload',passed:true});
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
    await btn(page,'Look: Brackets').focus();
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#inspections').innerText(),/Brackets/);
    await btn(page,'Look: Closed upper boundary').focus();
    await page.keyboard.press('Space');
    await btn(page,'Walk Milo to Lower landing').focus();
    await page.keyboard.press('Enter');
    assert.equal(await btn(page,'Look: Lower lamp B').isEnabled(),true);
    records.push({label:'keyboard',passed:true});
  }finally{await ctx.close();}
  assert.deepEqual(errors,[],'no page or console errors');
  await writeFile('test-results/e08-browser-report.json',
    JSON.stringify({records,errors,passed:true},null,2));
  console.log('E08 Chromium PASS: four complete viewport journeys and keyboard; isolated model only');
}catch(error){
  await writeFile('test-results/e08-browser-report.json',
    JSON.stringify({records,errors,passed:false,error:String(error.stack||error)},null,2));
  throw error;
}finally{await browser.close();}
