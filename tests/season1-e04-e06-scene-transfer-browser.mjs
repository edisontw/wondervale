// Independent E04 -> E05 -> E06 PAPER journey; no canonical source, unlock or save.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport,reducedMotion:'reduce'});
  try{
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/authoring-labs/arc1-memory-station-handoff.html');
   await page.evaluate(()=>localStorage.setItem('arc1-e06-sentinel','keep'));
   const b=key=>page.locator('[data-key="'+key+'"]');
   const go=async key=>{assert.equal(await b(key).isDisabled(),false,key);await b(key).click();};
   assert.equal(await page.locator('#e05-independent').isVisible(),false);
   await go('inspect-station');await go('inspect-garden');
   await go('station-earlier');await go('garden-later');
   assert.equal(await b('compare').isDisabled(),true);
   await go('station-unknown');await go('garden-unknown');
   await go('compare');await go('finish-e04');
   assert.equal(await page.locator('#e05-independent').isVisible(),true);
   await page.locator('#e05-independent').click();
   assert.match(page.url(),/\/e05-scene\/#paper-memory-station-garden=/);
   await page.waitForFunction(()=>document.querySelector('#e04-context')?.textContent?.includes('undated'));
   assert.match(await page.locator('#guard').innerText(),/E04 canonical completion absent/);
   const hit=async(scene,type,extra={})=>{
    let selector='[data-scene="'+scene+'"][data-type="'+type+'"]';
    for(const [k,v] of Object.entries(extra))selector+='[data-'+k+'="'+v+'"]';
    const target=page.locator(selector);
    assert.equal(await target.isDisabled(),false,selector);
    await target.click();
   };
   await hit('station','start');await hit('station','walk',{value:'board'});
   await hit('station','inspect',{value:'peg-pair'});
   await hit('station','inspect',{value:'worn-edge'});
   await hit('station','guess',{value:'unsure'});
   await hit('station','try-copy',{value:'side-b'});await hit('station','check');
   await hit('station','try-copy',{value:'side-a'});await hit('station','check');
   await hit('station','qualify');await hit('nav','to-records');
   await hit('sources','start');
   for(const card of ['a','b']){
    await hit('sources','walk',{value:'desk-'+card});
    await hit('sources','inspect',{card});
    await hit('sources','source-check',{card});
   }
   await hit('sources','walk',{value:'compare'});
   await hit('sources','place',{card:'a',slot:'earlier'});
   await hit('sources','test',{card:'a'});
   for(const card of ['a','b']){
    await hit('sources','place',{card,slot:'unknown'});
    await hit('sources','test',{card});
   }
   await hit('sources','compare');await hit('sources','finish');
   await hit('nav','to-layout');await hit('station','walk',{value:'table'});
   await hit('station','place-table',{value:'across-walkway'});
   await hit('station','place-table',{value:'near-wall'});
   await hit('station','confirm');await hit('station','reflect');await hit('nav','to-review');
   await hit('garden','inspect',{value:'older'});
   await hit('garden','inspect',{value:'present'});
   await hit('garden','overlay');await hit('garden','ask-why');
   assert.equal(await page.locator('#e06-paper').isVisible(),true);
   await page.locator('#e06-paper').click();
   assert.match(page.url(),/\/e06-scene\/#paper-memory-station-garden=/);
   await page.waitForFunction(()=>document.querySelector('#e05-context')?.textContent?.includes('MOCK'));
   assert.match(await page.locator('#e04-context').innerText(),/undated/);
   const garden=async key=>{
    const target=page.locator('[data-key="'+key+'"]');
    assert.equal(await target.isDisabled(),false,key);
    await target.click();
   };
   for(const key of ['start','bed','slope-walk','slope','tray-walk','run','rain','run','blocked','run','compare','enter'])await garden(key);
   assert.equal(await page.locator('#lower-scene').isVisible(),true);
   await page.locator('#e05-return').click();
   await page.waitForFunction(()=>document.querySelector('#e04-return')?.hidden===false);
   assert.match(await page.locator('#paper-note').innerText(),/cause remain UNKNOWN/);
   await page.locator('#e04-return').click();
   await page.waitForFunction(()=>document.querySelector('#e05-independent')?.hidden===false);
   assert.match(await page.locator('#e04-summary').innerText(),/Relative order UNKNOWN/);
   await page.locator('#e05-independent').click();
   await page.waitForFunction(()=>document.querySelector('#e06-paper')?.hidden===false);
   await page.locator('#e06-paper').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent?.includes('Lower Garden'));
   assert.equal(await page.locator('#lower-scene').isVisible(),true);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['arc1-e06-sentinel']);
   assert.equal(await page.locator('#upper-bed-tile').getAttribute('data-stage'),'healthy');
   const size=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.w+1,JSON.stringify({viewport,size}));
   assert.deepEqual(errors,[]);
   await garden('restart');
   await page.locator('#e05-return').click();
   await page.waitForFunction(()=>document.querySelector('#e04-return')?.hidden===false);
   await hit('nav','restart');
   assert.equal(await page.locator('#e06-paper').isVisible(),false);
   assert.equal(await page.locator('#e04-return').isVisible(),true);
   await page.locator('#e04-return').click();
   await page.waitForFunction(()=>document.querySelector('#e05-independent')?.hidden===false);
   await go('restart-e04');
   assert.equal(await page.locator('#e05-independent').isVisible(),false);
  }finally{await ctx.close();}
 }
 console.log('E04-E05-E06 independent PAPER Chromium PASS: three viewports, wrong-first revision, two gardens, returns, resets, no save');
}finally{await browser.close();}
