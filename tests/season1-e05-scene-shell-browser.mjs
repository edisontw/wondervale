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
   assert.equal(await page.locator('#replica-board .replica-cell').count(),20);
   await page.locator('[data-board-inspect="peg-pair"]').click();
   assert.equal(await page.locator('[data-board-inspect="peg-pair"]').getAttribute('aria-pressed'),'true');
   await hit('station','inspect',{value:'worn-edge'});
   await hit('station','guess',{value:'unsure'});
   await page.locator('#board-turn').click();
   assert.equal(await page.locator('#replica-board [data-copy][data-overlap="false"]').count(),2);
   await hit('station','check');
   assert.match(await page.locator('#replica-status').innerText(),/2 marks are offset/);
   assert.match(await page.locator('#foyer-map').innerText(),/do not align/);
   await page.locator('#board-turn').click();
   assert.equal(await page.locator('#replica-board [data-copy][data-overlap="true"]').count(),2);
   await hit('station','check');
   assert.match(await page.locator('#replica-status').innerText(),/both marks line up/);
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
   assert.equal(await page.locator('#layout-spatial-grid .layout-spatial-cell').count(),20);
   assert.equal(await page.locator('#layout-spatial-grid [data-walkway="true"]').count(),8);
   assert.equal(await page.locator('[data-layout-position="near-wall"]').isDisabled(),true);
   await hit('station','walk',{value:'table'});
   await page.locator('[data-layout-position="across-walkway"]').click();
   assert.equal(await page.locator('#layout-spatial-grid [data-blocked="true"]').count(),4);
   assert.match(await page.locator('#layout-spatial-status').innerText(),/BLOCKED/);
   assert.match(await page.locator('#layout-map').innerText(),/BLOCKED/);
   assert.equal(await page.locator('[data-scene="station"][data-type="confirm"]').isDisabled(),true);
   await page.locator('[data-layout-position="near-wall"]').focus();
   await page.keyboard.press('Enter');
   assert.equal(await page.locator('#layout-spatial-grid [data-blocked="true"]').count(),0);
   assert.equal(await page.locator('#layout-spatial-grid [data-table="true"]').count(),4);
   assert.match(await page.locator('#layout-spatial-status').innerText(),/OPEN/);
   await hit('station','confirm');
   assert.match(await page.locator('#layout-spatial-status').innerText(),/Map Room ready/);
   await hit('station','reflect');await hit('nav','to-review');
   assert.match(await page.locator('#paper-note').innerText(),/UNKNOWN/);
   assert.equal(await page.locator('[data-scene="garden"][data-type="overlay"]').isDisabled(),true);
   await hit('garden','inspect',{value:'older'});
   assert.equal(await page.locator('[data-scene="garden"][data-type="overlay"]').isDisabled(),true);
   await hit('garden','inspect',{value:'present'});
   await hit('garden','overlay');
   assert.match(await page.locator('#garden-map').innerText(),/LOWER PAPER mark/);
   assert.match(await page.locator('#garden-map').innerText(),/UPPER PAPER mark/);
   await hit('garden','ask-why');
   assert.match(await page.locator('#paper-note').innerText(),/cause remain UNKNOWN/);
   assert.match(await page.locator('#guard').innerText(),/E06 NOT UNLOCKED/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['sentinel']);
   const size=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.w+1,JSON.stringify({viewport,size}));
   assert.deepEqual(errors,[]);
   await hit('nav','restart');
   assert.equal(await page.locator('#foyer').isVisible(),true);
   assert.match(await page.locator('#foyer-map').innerText(),/not tried/);
   assert.equal(await page.locator('#replica-board [data-copy]').count(),0);
   await hit('station','start');
   assert.equal(await page.locator('[data-scene="garden"][data-type="overlay"]').isDisabled(),true);
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
  await page.locator('[data-board-inspect="peg-pair"]').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('[data-board-inspect="peg-pair"]').getAttribute('aria-pressed'),'true');
 }finally{await context.close();}
 console.log('E05 scene shell Chromium PASS: three viewports, keyboard, replica and table spatial retry, MOCK provenance, clear path, no storage');
}finally{await browser.close();}
