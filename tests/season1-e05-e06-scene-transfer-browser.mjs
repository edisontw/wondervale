// E05 -> E06 Current/Lower PAPER round-trip; no production unlock or storage.
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
   await page.goto(base+'/e05-scene/');
   await page.evaluate(()=>localStorage.setItem('e05-e06-sentinel','keep'));
   const hit=async(scene,type,extra={})=>{
    let selector='[data-scene="'+scene+'"][data-type="'+type+'"]';
    for(const [k,v] of Object.entries(extra))selector+='[data-'+k+'="'+v+'"]';
    await page.locator(selector).click();
   };
   assert.equal(await page.locator('#e06-paper').isVisible(),false);
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
   await hit('nav','to-layout');
   await hit('station','walk',{value:'table'});
   await hit('station','place-table',{value:'across-walkway'});
   await hit('station','place-table',{value:'near-wall'});
   await hit('station','confirm');await hit('station','reflect');
   await hit('nav','to-review');
   assert.equal(await page.locator('#e06-paper').isVisible(),false);
   await hit('garden','inspect',{value:'older'});
   await hit('garden','inspect',{value:'present'});
   await hit('garden','overlay');await hit('garden','ask-why');
   assert.equal(await page.locator('#e06-paper').isVisible(),true);
   assert.match(await page.locator('#guard').innerText(),/E06 NOT UNLOCKED/);
   await page.locator('#e06-paper').click();
   assert.match(page.url(),/\/e06-scene\/#paper-station-garden=/);
   await page.waitForFunction(()=>document.querySelector('#e05-context')?.textContent?.includes('two fictional garden marks'));
   assert.match(await page.locator('#e05-context').innerText(),/maker\/date\/original UNKNOWN/);
   assert.equal(await page.locator('#e05-return').isVisible(),true);
   assert.equal(await page.locator('#e05-world').isVisible(),true);
   assert.equal(await page.locator('#e05-world').getAttribute('data-view'),'now');
   assert.match(await page.locator('#station-map-table').innerText(),/by wall/);
   assert.match(await page.locator('#station-map-feedback').innerText(),/tried the walkway first/);
   await page.locator('#e05-world-first').click();
   assert.match(await page.locator('#station-map-table').innerText(),/No PAPER table/);
   assert.equal(await page.locator('#e05-world-first').getAttribute('aria-pressed'),'true');
   await page.locator('#e05-world-now').click();
   assert.match(await page.locator('#station-map-board').innerText(),/COPY/);
   assert.equal(await page.locator('#e05-world-now').getAttribute('aria-pressed'),'true');
   const b=key=>page.locator('[data-key="'+key+'"]');
   const go=async key=>{assert.equal(await b(key).isDisabled(),false,key);await b(key).click();};
   for(const k of ['start','bed','slope-walk','slope','tray-walk','run','rain','run','blocked','run','compare','enter'])await go(k);
   assert.equal(await page.locator('#lower-scene').isVisible(),true);
   await page.locator('#e05-return').click();
   assert.match(page.url(),/\/e05-scene\/#paper-station-garden=/);
   await page.waitForFunction(()=>document.querySelector('#garden-map')?.textContent?.includes('LOWER PAPER mark'));
   assert.match(await page.locator('#paper-note').innerText(),/cause remain UNKNOWN/);
   await page.locator('#e06-paper').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent?.includes('Lower Garden'));
   assert.equal(await page.locator('#lower-scene').isVisible(),true);
   assert.match(await page.locator('#tray').innerText(),/3 run/);
   assert.equal(await page.locator('#upper-bed-tile').getAttribute('data-stage'),'healthy');
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e05-e06-sentinel']);
   const size=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.w+1,JSON.stringify({viewport,size}));
   assert.deepEqual(errors,[]);
   await go('restart');
   assert.equal(await page.locator('#current-scene').isVisible(),true);
   assert.equal(await page.locator('#e05-return').isVisible(),true,'E06 reset preserves E05 question');
   assert.equal(await page.locator('#e05-world').isVisible(),true,'E06 reset retains earned E05 station world');
   await page.locator('#e05-return').click();
   await page.waitForFunction(()=>document.querySelector('#e06-paper')?.hidden===false);
   await page.locator('[data-scene="nav"][data-type="restart"]').click();
   assert.equal(await page.locator('#e06-paper').isVisible(),false,'E05 reset revokes downstream E06 visit');
  }finally{await ctx.close();}
 }
 console.log('E05-E06 independent PAPER Chromium PASS: three viewports, earned entry, Current/Lower visit, returns, resets, no storage');
}finally{await browser.close();}
