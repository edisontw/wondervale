// Browser checks for E05 noncanonical engineering shell, never a production episode.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const context=await browser.newContext({viewport});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   assert.equal((await page.goto(base+'/e05-scene/'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('sentinel','keep'));
   const hit=async(scene,type,extra={})=>{
    let selector='[data-scene="'+scene+'"][data-type="'+type+'"]';
    for(const [k,v] of Object.entries(extra))selector+='[data-'+k+'="'+v+'"]';
    await page.locator(selector).click();
   };
   assert.match(await page.locator('.notice').first().innerText(),/AUTHORING ONLY/);
   assert.equal(await page.locator('[data-type="to-records"]').isDisabled(),true);
   await hit('station','start');await hit('station','walk',{value:'board'});
   await hit('station','inspect',{value:'peg-pair'});await hit('station','inspect',{value:'worn-edge'});
   await hit('station','guess',{value:'unsure'});
   await hit('station','try-copy',{value:'side-b'});await hit('station','check');
   assert.match(await page.locator('#foyer-map').innerText(),/do not align/);
   await hit('station','try-copy',{value:'side-a'});await hit('station','check');
   await hit('station','qualify');await hit('nav','to-records');
   assert.equal(await page.locator('#records').isVisible(),true);
   await hit('sources','start');
   for(const card of ['a','b']){
    await hit('sources','walk',{value:'desk-'+card});
    await hit('sources','inspect',{card});await hit('sources','source-check',{card});
   }
   await hit('sources','walk',{value:'compare'});
   await hit('sources','place',{card:'a',slot:'earlier'});await hit('sources','test',{card:'a'});
   assert.match(await page.locator('#record-map').innerText(),/needs-source/);
   await hit('sources','place',{card:'a',slot:'unknown'});await hit('sources','test',{card:'a'});
   await hit('sources','place',{card:'b',slot:'unknown'});await hit('sources','test',{card:'b'});
   await hit('sources','compare');await hit('sources','finish');await hit('nav','to-layout');
   await hit('station','walk',{value:'table'});
   await hit('station','place-table',{value:'across-walkway'});
   assert.match(await page.locator('#layout-map').innerText(),/BLOCKED/);
   assert.equal(await page.locator('[data-scene="station"][data-type="confirm"]').isDisabled(),true);
   await hit('station','place-table',{value:'near-wall'});await hit('station','confirm');
   await hit('station','reflect');await hit('nav','to-review');
   assert.match(await page.locator('#paper-note').innerText(),/UNKNOWN/);
   assert.match(await page.locator('#guard').innerText(),/E06 NOT UNLOCKED/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['sentinel']);
   const size=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.w+1,JSON.stringify({viewport,size}));
   assert.deepEqual(errors,[]);
   await hit('nav','restart');
   assert.equal(await page.locator('#foyer').isVisible(),true);
   assert.match(await page.locator('#foyer-map').innerText(),/not tried/);
  }finally{await context.close();}
 }
 const context=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await context.newPage();await page.goto(base+'/e05-scene/');
  await page.locator('[data-scene="station"][data-type="start"]').focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-scene="station"][data-type="walk"][data-value="board"]').focus();
  await page.keyboard.press('Space');
  assert.match(await page.locator('#foyer-map').innerText(),/Milo at board/);
 }finally{await context.close();}
 console.log('E05 scene shell Chromium PASS: three viewports, keyboard, replica retry, MOCK source provenance, clear path, no storage');
}finally{await browser.close();}
