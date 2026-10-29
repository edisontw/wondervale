// E10 synthetic courtyard Chromium journeys. Never production acceptance or verified history.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';

const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const records=[],errors=[];
const btn=(page,name)=>page.getByRole('button',{name,exact:true});
async function press(page,name){
  assert.equal(await btn(page,name).isEnabled(),true,name+' should be enabled');
  await btn(page,name).click();
}
async function walk(page,name){await press(page,'Go to '+name);}
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
    label+' scene within viewport');
  for(const a of data.anchors)
    assert.ok(a.left>=data.scene.left-1&&a.right<=data.scene.right+1,
      label+' '+a.name+' inside scene');
  for(const b of data.buttons)
    assert.ok(b.width>=43.5&&b.height>=43.5,label+' 44px touch target '+b.name);
  records.push({label,geometry:data});
}
async function noCanon(page,label){
  const t=await page.locator('#chronicle').innerText();
  assert.match(t,/Canonical events: 0; E11 unlocks: 0; historical claims: 0/,label);
  assert.match(await page.locator('.notice').innerText(),/FICTIONAL MODEL — NOT VERIFIED HISTORY OR ACCESS/);
  assert.match(await page.locator('.closed-label').innerText(),/CLOSED HILL — NO ENTRY/);
  assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).sort()),
    ['wondervale-e10-test-sentinel'],label+' no storage writes');
  assert.equal(await page.evaluate(()=>localStorage.getItem('wondervale-e10-test-sentinel')),
    'unchanged');
  assert.doesNotMatch(t,/unlocked E11|canonical complete|verified 19\d\d/i);
}
async function open(width,height,label,touch){
  const ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,
    isMobile:touch,reducedMotion:'reduce'});
  const page=await ctx.newPage();
  page.on('pageerror',e=>errors.push(label+': '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(label+': '+m.text());});
  const response=await page.goto(base+'/e10-prototype/',{waitUntil:'load'});
  assert.equal(response?.status(),200,label+' HTML served');
  await page.locator('#scene[data-phase="explore"]').waitFor();
  await page.evaluate(()=>localStorage.setItem('wondervale-e10-test-sentinel','unchanged'));
  assert.equal(await page.locator('.milo').count(),1);
  assert.equal(await page.locator('#scene .anchor').count(),5);
  return {ctx,page};
}
async function missingSource(page){
  assert.equal(await btn(page,'Walk Milo to Meeting edge').isDisabled(),true);
  assert.equal(await btn(page,'Look: Mounting holes').isDisabled(),true);
  assert.equal(await btn(page,'Finish SYNTHETIC preview').isDisabled(),true);
  await press(page,'Compare symbol shape');
  assert.match(await page.locator('#name-status').innerText(),/UNKNOWN/);
  await walk(page,'Stone edge');
  await press(page,'Look: Worn strip');
  await walk(page,'Entry');
  await walk(page,'Notice wall');
  await press(page,'Look: Mounting holes');
  await press(page,'Check name source');
  assert.match(await page.locator('#name-status').innerText(),/UNKNOWN — SOURCE PENDING/);
  assert.doesNotMatch(await page.locator('#name-status').innerText(),/Common/);
  assert.equal(await btn(page,'Finish SYNTHETIC preview').isDisabled(),true);
  await press(page,'Restart this preview');
  assert.equal(await btn(page,'Compare symbol shape').isEnabled(),true);
}
async function journey(page,label,screenshots){
  await geometry(page,label+' initial');
  await missingSource(page);
  await press(page,'Compare symbol shape');
  await walk(page,'Stone edge');
  await press(page,'Look: Worn strip');
  assert.equal(await btn(page,'Try: passing at Worn strip').isEnabled(),true);
  await press(page,'Try: passing at Worn strip');
  await press(page,'Revise: passing to meeting');
  assert.match(await page.locator('#hypothesis-status').innerText(),/MAYBE meeting/);
  assert.match(await page.locator('#seen').innerText(),/age and use are unknown/);
  await walk(page,'Quiet corner');
  await press(page,'Listen: quiet reader');
  await press(page,'Place quiet: Left');
  await walk(page,'Meeting edge');
  await press(page,'Listen: activity group');
  await press(page,'Place activity: Right');
  assert.equal(await page.locator('#parent-cue-needs').isVisible(),true);
  const before=await page.locator('.milo').evaluate(el=>el.style.left);
  await press(page,'Try closed hill (stop safely)');
  assert.equal(await page.locator('.milo').evaluate(el=>el.style.left),before);
  assert.match(await page.locator('#feedback').innerText(),/hill stays closed/);
  await walk(page,'Notice wall');
  await press(page,'Look: Mounting holes');
  assert.equal(await page.locator('#parent-cue-evidence').isVisible(),true);
  await press(page,'Try: display at Mounting holes');
  assert.equal(await btn(page,'Review four kinds of notes').isDisabled(),true);
  await press(page,'Enable SYNTHETIC name fixture (test only)');
  await press(page,'Check name source');
  const source=await page.locator('#name-status').innerText();
  assert.match(source,/SYNTHETIC TEST TOKEN: Common — NOT APPROVED HISTORY/);
  assert.match(source,/SYNTHETIC — NO APPROVED SOURCE/);
  await press(page,'Compare needs tradeoff');
  await press(page,'Review four kinds of notes');
  assert.equal(await btn(page,'Finish SYNTHETIC preview').isEnabled(),true);
  await press(page,'Place activity: Shared');
  assert.equal(await btn(page,'Review four kinds of notes').isDisabled(),true,
    'moving a card invalidates previous review');
  assert.equal(await btn(page,'Finish SYNTHETIC preview').isDisabled(),true);
  await press(page,'Compare needs tradeoff');
  await press(page,'Review four kinds of notes');
  await press(page,'Finish SYNTHETIC preview');
  assert.equal(await page.locator('#scene').getAttribute('data-phase'),'complete');
  assert.match(await page.locator('#hook').innerText(),/E11 remains NOT UNLOCKED/);
  assert.equal(await btn(page,'Go to Meeting edge').isDisabled(),true);
  assert.equal(await page.locator('#seen li').count(),2);
  assert.equal(await page.locator('#maybe li').count(),2);
  assert.equal(await page.locator('#needs li').count(),2);
  assert.equal(await page.locator('#unknown li').count(),3);
  assert.match(await page.locator('#board').innerText(),/activity group \(simulated\)/);
  await noCanon(page,label+' complete');
  await geometry(page,label+' complete');
  if(screenshots){
    await page.locator('#scene').screenshot({path:'test-results/e10-'+label+'-scene.png'});
    await page.locator('#cards').screenshot({path:'test-results/e10-'+label+'-notebook.png'});
  }
  await press(page,'Restart this preview');
  assert.equal(await page.locator('#scene').getAttribute('data-phase'),'explore');
  assert.match(await page.locator('#walk-status').innerText(),/Observed: none yet/);
  assert.doesNotMatch(await page.locator('#name-status').innerText(),/Common/);
  await noCanon(page,label+' reset');
  await page.reload();
  await page.locator('#scene[data-phase="explore"]').waitFor();
  assert.match(await page.locator('#walk-status').innerText(),/Observed: none yet/);
  await noCanon(page,label+' reload');
  records.push({label,flow:'source-pending-reset-inspect-revise-listen-board-closed-stop-fixture-review-revise-recheck',passed:true});
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
    await btn(page,'Compare symbol shape').focus();await page.keyboard.press('Enter');
    assert.match(await page.locator('#name-status').innerText(),/UNKNOWN/);
    await btn(page,'Walk Milo to Stone edge').focus();await page.keyboard.press('Space');
    await btn(page,'Look: Worn strip').focus();await page.keyboard.press('Enter');
    assert.match(await page.locator('#walk-status').innerText(),/Worn strip/);
    records.push({label:'keyboard',passed:true});
  }finally{await ctx.close();}
  assert.deepEqual(errors,[],'no browser console or page errors');
  await writeFile('test-results/e10-browser-report.json',
    JSON.stringify({records,errors,passed:true},null,2));
  console.log('E10 Chromium PASS: four full viewport journeys, source gate, keyboard; synthetic only');
}catch(error){
  await writeFile('test-results/e10-browser-report.json',
    JSON.stringify({records,errors,passed:false,error:String(error.stack||error)},null,2));
  throw error;
}finally{await browser.close();}
