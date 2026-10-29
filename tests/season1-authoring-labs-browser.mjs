// Cross-lab navigation smoke only. No canonical Chronicle, unlock, or release claim.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const cases=[
 {id:'e05',route:'/e05-prototype/'},
 {id:'e06-current',route:'/e06-prototype/'},
 {id:'e06-lower',route:'/e06-prototype/'},
 {id:'e07',route:'/e07-prototype/'},
 {id:'e08',route:'/e08-prototype/'},
 {id:'e09',route:'/e09-prototype/'},
 {id:'e10',route:'/e10-prototype/'},
 {id:'e11',route:'/e11-prototype/'}
];
const report=[],errors=[];
try{
 for(const v of [
  {width:1366,height:900,label:'desktop',touch:false},
  {width:568,height:320,label:'phone-landscape',touch:true},
  {width:390,height:844,label:'phone-portrait',touch:true}
 ]){
  const context=await browser.newContext({viewport:{width:v.width,height:v.height},
   isMobile:v.touch,hasTouch:v.touch,reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(v.label+': hub '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(v.label+': hub '+m.text());});
  try{
   const response=await page.goto(base+'/authoring-labs/',{waitUntil:'load'});
   assert.equal(response?.status(),200,'hub served');
   assert.match(await page.locator('.notice').innerText(),/NOT THE PRODUCTION GAME/);
   assert.equal(await page.getByRole('button',{name:/E04 source and timeline lab unavailable/}).isDisabled(),true);
   assert.equal(await page.locator('#frame').isVisible(),false);
   await page.evaluate(()=>localStorage.setItem('lab-sentinel','untouched'));
   for(let i=0;i<cases.length;i++){
    const scene=cases[i];
    await page.locator('[data-scene="'+scene.id+'"]').click();
    const frame=page.frameLocator('#frame');
    await frame.locator('header h1').waitFor({timeout:15000});
    assert.equal(new URL(await page.locator('#frame').getAttribute('src')).pathname,scene.route);
    assert.equal(await page.locator('[data-scene="'+scene.id+'"]').getAttribute('aria-pressed'),'true');
    assert.match(await page.locator('#status').innerText(),/AUTHORING ONLY/);
    const notice=await frame.locator('.notice').first().innerText();
    assert.ok(notice.length>30,scene.id+' has explicit boundary');
    assert.ok(await frame.locator('button').count()>0,scene.id+' interactive controls present');
    if(scene.id==='e06-lower'){
      assert.match(await page.locator('#status').innerText(),/First complete Current Garden/);
      assert.ok(await frame.getByRole('button',{name:'Walk to Lower Garden'}).count()>0,
       'Lower Garden has in-lab gate, not menu unlock');
    }
    assert.equal(await page.evaluate(()=>localStorage.getItem('lab-sentinel')),'untouched');
    report.push({viewport:v.label,scene:scene.id,route:scene.route,smoke:'PASS'});
   }
   assert.equal(await page.getByRole('button',{name:'Next lab'}).isDisabled(),true);
   await page.getByRole('button',{name:'Previous lab'}).click();
   assert.match(await page.locator('#title').innerText(),/E10/);
   await page.getByRole('button',{name:'Restart selected lab'}).click();
   await page.frameLocator('#frame').locator('header h1').waitFor();
   const geo=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(geo.scroll<=geo.width+1,v.label+' hub horizontal overflow');
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).sort()),['lab-sentinel'],
    'hub and labs do not write production progress');
   if(v.label==='desktop')await page.screenshot({path:'test-results/authoring-labs-desktop.png'});
  }finally{await context.close();}
 }
 const context=await browser.newContext({viewport:{width:568,height:320}});
 const page=await context.newPage();
 try{
  await page.goto(base+'/authoring-labs/');
  await page.locator('[data-scene="e05"]').focus();await page.keyboard.press('Enter');
  await page.frameLocator('#frame').locator('header h1').waitFor();
  await page.getByRole('button',{name:'Next lab'}).focus();await page.keyboard.press('Enter');
  assert.match(await page.locator('#title').innerText(),/E06/);
  report.push({viewport:'keyboard',smoke:'PASS'});
 }finally{await context.close();}
 assert.deepEqual(errors,[],'no hub page or console errors');
 await writeFile('test-results/authoring-labs-report.json',JSON.stringify({passed:true,report,errors},null,2));
 console.log('Authoring labs Chromium PASS: 3 viewports x 8 scene entries + keyboard, no canonical writes');
}catch(e){
 await writeFile('test-results/authoring-labs-report.json',JSON.stringify({passed:false,report,errors,error:String(e.stack||e)},null,2));
 throw e;
}finally{await browser.close();}
