// E09 synthetic browser lab: Chromium evidence, NOT real hill access or production acceptance.
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
        const r=el.getBoundingClientRect();return {name:el.textContent,width:r.width,height:r.height};
      })};
  });
  assert.ok(data.scroll<=data.viewport+1,label+' no horizontal overflow');
  assert.ok(data.scene.width>180&&data.scene.left>=-1&&data.scene.right<=data.viewport+1,
    label+' scene visible');
  for(const a of data.anchors)assert.ok(a.left>=data.scene.left-1&&a.right<=data.scene.right+1,
    label+' '+a.name+' inside scene');
  for(const b of data.buttons)assert.ok(b.width>=43.5&&b.height>=43.5,
    label+' 44px touch target '+b.name);
  records.push({label,geometry:data});
}
async function noCanon(page,label){
  const t=await page.locator('#chronicle').innerText();
  assert.match(t,/Canonical events: 0; unlocks: 0; historical claims: 0/,label);
  assert.match(await page.locator('.notice').innerText(),/FICTIONAL MODEL — NOT A REAL HILL ROUTE/);
  assert.match(await page.locator('.closed-label').innerText(),/UPPER HILL CLOSED/);
  assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).sort()),
    ['wondervale-e09-test-sentinel'],label+' no storage writes');
  assert.equal(await page.evaluate(()=>localStorage.getItem('wondervale-e09-test-sentinel')),
    'unchanged');
  assert.doesNotMatch(t,/Common|18\d\d|19\d\d|20\d\d|hill opened/i);
}
async function open(width,height,label,touch){
  const ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,
    isMobile:touch,reducedMotion:'reduce'});
  const page=await ctx.newPage();
  page.on('pageerror',e=>errors.push(label+': '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(label+': '+m.text());});
  const response=await page.goto(base+'/e09-prototype/',{waitUntil:'load'});
  assert.equal(response?.status(),200,label+' HTML served');
  await page.locator('#scene[data-phase="survey"]').waitFor();
  await page.evaluate(()=>localStorage.setItem('wondervale-e09-test-sentinel','unchanged'));
  assert.equal(await page.locator('.milo').count(),1);
  assert.equal(await page.locator('#scene .anchor').count(),5);
  return {ctx,page};
}
async function journey(page,label,screenshots){
  await geometry(page,label+' start');
  assert.equal(await btn(page,'Walk Milo to Overlook').isDisabled(),true,'no teleport');
  assert.equal(await btn(page,'Look: Closed sign').isDisabled(),true,'inspect at anchor');
  assert.equal(await btn(page,'Review field notes').isDisabled(),true,'no forged completion');
  await press(page,'Look: Old sketch');
  await press(page,'Mark: Bend–Overlook');
  assert.match(await page.locator('#feedback').innerText(),/Walk this model edge/);
  await walk(page,'Signpost');
  await press(page,'Look: Closed sign');
  assert.equal(await page.locator('#parent-cue').isVisible(),true);
  await walk(page,'Fence lookout');
  await press(page,'Look: Uneven ground');
  const before=await page.locator('.milo').evaluate(el=>el.style.left);
  await press(page,'Try closed way (stop safely)');
  const after=await page.locator('.milo').evaluate(el=>el.style.left);
  assert.equal(before,after,'closed way does not move Milo');
  assert.match(await page.locator('#feedback').innerText(),/This way is closed/);
  await press(page,'Try marking closed edge');
  assert.match(await page.locator('#feedback').innerText(),/closed edge cannot be marked/);
  await press(page,'Consider: Water and ground');
  await walk(page,'Signpost');
  await walk(page,'Lower bend');
  await press(page,'Look: Water marks');
  await walk(page,'Overlook');
  await press(page,'Look: Distant mark');
  assert.notEqual(before,await page.locator('.milo').evaluate(el=>el.style.left),'Milo moved');
  await press(page,'Mark: Steps–Signpost');
  await press(page,'Mark: Bend–Overlook');
  await press(page,'Check my sketch');
  assert.match(await page.locator('#route-status').innerText(),/gap at Signpost–Bend/);
  assert.equal(await btn(page,'Review field notes').isDisabled(),true);
  await press(page,'Mark: Signpost–Bend');
  await press(page,'Check my sketch');
  assert.match(await page.locator('#route-status').innerText(),/Continuous model route/);
  await press(page,'Remove: Signpost–Bend');
  await press(page,'Check my sketch');
  assert.match(await page.locator('#route-status').innerText(),/gap at Signpost–Bend/);
  await press(page,'Mark: Signpost–Bend');
  await press(page,'Check my sketch');
  await press(page,'Compare distant mark shape');
  assert.match(await page.locator('#symbol-status').innerText(),/place is still unknown/);
  await press(page,'Review field notes');
  await press(page,'Finish model survey');
  assert.match(await page.locator('#hook').innerText(),/E10 remains NOT UNLOCKED/);
  assert.equal(await btn(page,'Walk Milo to Lower bend').isDisabled(),true);
  assert.ok((await page.locator('#seen li').count())>=4);
  assert.ok((await page.locator('#think li').count())>=1);
  assert.ok((await page.locator('#unknown li').count())>=3);
  await noCanon(page,label+' complete');
  await geometry(page,label+' complete');
  if(screenshots){
    await page.locator('#scene').screenshot({path:'test-results/e09-'+label+'-scene.png'});
    await page.locator('.cards').screenshot({path:'test-results/e09-'+label+'-notebook.png'});
  }
  await press(page,'Restart this preview');
  assert.equal(await page.locator('#scene').getAttribute('data-phase'),'survey');
  assert.match(await page.locator('#inspections').innerText(),/nothing yet/);
  await noCanon(page,label+' reset');
  await page.reload();
  await page.locator('#scene[data-phase="survey"]').waitFor();
  assert.match(await page.locator('#inspections').innerText(),/nothing yet/);
  await noCanon(page,label+' reload');
  records.push({label,flow:'walk-fence-stop-inspect-alternate-mark-gap-revise-compare-review-reset',passed:true});
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
    await btn(page,'Look: Old sketch').focus();await page.keyboard.press('Enter');
    assert.match(await page.locator('#inspections').innerText(),/Old sketch/);
    await btn(page,'Walk Milo to Signpost').focus();await page.keyboard.press('Space');
    assert.equal(await btn(page,'Look: Closed sign').isEnabled(),true);
    records.push({label:'keyboard',passed:true});
  }finally{await ctx.close();}
  assert.deepEqual(errors,[],'no browser console/page errors');
  await writeFile('test-results/e09-browser-report.json',
    JSON.stringify({records,errors,passed:true},null,2));
  console.log('E09 Chromium PASS: four complete viewport journeys and keyboard; model only');
}catch(error){
  await writeFile('test-results/e09-browser-report.json',
    JSON.stringify({records,errors,passed:false,error:String(error.stack||error)},null,2));
  throw error;
}finally{await browser.close();}
