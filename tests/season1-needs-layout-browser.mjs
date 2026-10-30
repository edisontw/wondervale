import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const report=[],errors=[];
const btn=(page,name)=>page.getByRole('button',{name,exact:true});
const hit=async(page,name)=>{assert.equal(await btn(page,name).isEnabled(),true,name);await btn(page,name).click();};
try{
 for(const v of [{width:1366,height:900,label:'desktop'},{width:568,height:320,label:'landscape'},{width:390,height:844,label:'portrait'}]){
  const ctx=await browser.newContext({viewport:{width:v.width,height:v.height},reducedMotion:'reduce'});
  const page=await ctx.newPage();
  page.on('pageerror',e=>errors.push(v.label+': '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(v.label+': '+m.text());});
  try{
   assert.equal((await page.goto(base+'/authoring-labs/needs-layout.html'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('needs-layout-sentinel','safe'));
   assert.match(await page.locator('.notice').innerText(),/NOT THE PRODUCTION GAME/);
   assert.equal(await btn(page,'Try E11 PAPER layout').isDisabled(),true);
   await hit(page,'Compare symbol, not name');
   await hit(page,'Walk: stone_edge');await hit(page,'Look: surface');
   await hit(page,'Maybe surface: meeting');await hit(page,'Revise surface: meeting → resting');
   await hit(page,'Walk: quiet_corner');await hit(page,'Listen: quiet');
   await hit(page,'Paper quiet → left');
   await hit(page,'Walk: meeting_edge');await hit(page,'Listen: activity');
   await hit(page,'Paper activity → left');await hit(page,'Paper activity → right');
   await hit(page,'Walk: notice_wall');await hit(page,'Look: holes');
   await hit(page,'Maybe holes: display');await hit(page,'check source');
   assert.match(await page.locator('#feedback').innerText(),/UNKNOWN/);
   await hit(page,'review tradeoff');await hit(page,'review');
   await hit(page,'Try E11 PAPER layout');
   assert.match(await page.locator('#needs-board').innerText(),/Name UNKNOWN/);
   await hit(page,'Place access strip');
   await hit(page,'Place quiet piece');await page.locator('button[data-cell="0,1"]').click();
   await hit(page,'Place activity piece');await page.locator('button[data-cell="0,2"]').click();
   await hit(page,'Test quiet_reader');await hit(page,'Test activity_group');
   assert.match(await page.locator('#progress').innerText(),/Quiet RETRY/);
   await hit(page,'Save tested trial');
   await page.locator('button[data-cell="2,1"]').click();
   await hit(page,'Test quiet_reader');await hit(page,'Test activity_group');
   assert.match(await page.locator('#progress').innerText(),/Quiet PASS/);
   await hit(page,'Save tested trial');await hit(page,'Compare FIRST and NOW');
   await hit(page,'Recall e10_needs (model)');
   await hit(page,'Add link: square-market');await hit(page,'Add link: market-common');
   await hit(page,'Check paper loop');
   assert.match(await page.locator('#progress').innerText(),/Loop not verified/);
   await hit(page,'Add link: common-square');await hit(page,'Check paper loop');
   await hit(page,'Review NONCANONICAL trial');
   assert.match(await page.locator('#progress').innerText(),/Paper review complete/);
   assert.match(await page.locator('#progress').innerText(),/Season NOT COMPLETE/);
   await hit(page,'Return to E10 needs');
   assert.match(await page.locator('#needs-board').innerText(),/Paper needs compared/);
   await hit(page,'Try E11 PAPER layout');
   assert.match(await page.locator('#layout-board').innerText(),/2 model trials/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['needs-layout-sentinel']);
   const geom=await page.evaluate(()=>({view:innerWidth,scroll:document.documentElement.scrollWidth,
    min:[...document.querySelectorAll('button:not(:disabled)')].reduce((a,e)=>Math.min(a,e.getBoundingClientRect().height),999)}));
   assert.ok(geom.scroll<=geom.view+1,v.label+' overflow');
   assert.ok(geom.min>=43.5,v.label+' 44px buttons');
   if(v.label==='desktop')await page.screenshot({path:'test-results/needs-layout-desktop.png'});
   await hit(page,'Restart paper story');
   assert.equal(await btn(page,'Try E11 PAPER layout').isDisabled(),true);
   report.push({viewport:v.label,journey:'PASS',revisit:'PASS',sourceUnknown:'PASS',noStorage:'PASS'});
  }finally{await ctx.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await ctx.newPage();await page.goto(base+'/authoring-labs/needs-layout.html');
  await btn(page,'Compare symbol, not name').focus();await page.keyboard.press('Enter');
  assert.equal(await btn(page,'Compare symbol, not name').isDisabled(),true);
  await btn(page,'Walk: stone_edge').focus();await page.keyboard.press('Space');
  assert.match(await page.locator('#task-cue').innerText(),/stone_edge/);
  report.push({viewport:'keyboard',pass:true});
 }finally{await ctx.close();}
 assert.deepEqual(errors,[]);
 await writeFile('test-results/needs-layout-report.json',JSON.stringify({passed:true,report},null,2));
 console.log('E10→E11 paper needs/layout Chromium PASS');
}catch(e){
 await writeFile('test-results/needs-layout-report.json',JSON.stringify({passed:false,report,errors,error:String(e.stack||e)},null,2));
 throw e;
}finally{await browser.close();}
