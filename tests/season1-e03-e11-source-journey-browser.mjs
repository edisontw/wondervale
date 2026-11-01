// E03 verified source → child-operated E04–E11 PAPER journey; not a canonical unlock.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {canonicalCheckpoints} from './fixtures/season1-e03-canonical.mjs';
const {e02,e03}=canonicalCheckpoints();
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport,reducedMotion:'reduce'});
  try{
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));

   // No pre-completed PAPER fragments: the real E02/E03 action replay must pass first.
   const response=await page.goto(base+'/authoring-labs/e03-e04-paper-source-entry.html');
   assert.equal(response?.status(),200);
   await page.waitForFunction(()=>document.querySelector('#gate-status')?.dataset.gate==='blocked');
   assert.equal(await page.locator('#paper-entry').isVisible(),false);
   await page.evaluate(({e02,e03})=>{
    localStorage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
    localStorage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
    localStorage.setItem('source-journey-sentinel','keep');
   },{e02,e03});
   await page.locator('#refresh').click();
   assert.equal(await page.locator('#gate-status').getAttribute('data-gate'),'verified');
   assert.equal(await page.locator('#source-list li').count(),2);
   assert.match(await page.locator('#source-list').innerText(),/UNKNOWN/);
   assert.match(await page.locator('#production-boundary').innerText(),/Canonical E04: CLOSED/);
   await page.locator('#paper-entry').click();
   await page.waitForURL('**/authoring-labs/arc1-memory-station-handoff.html');
   await page.locator('[data-key="inspect-station"]').waitFor();
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
   // Milo must finish the second distinct garden and actually test/revise PAPER care.
   for(const key of ['trace','lower-path-walk','lower-path','channel-walk','channel-place','check',
     'pocket-walk','pocket-place','check','think','finish','heavy-care','test-care',
     'gentle-care','test-care','compare-care'])await garden(key);
   assert.match(await page.locator('#lower-world-note').innerText(),/hypothetical sprout/);
   assert.equal(await page.locator('#e07-transfer').isVisible(),true);
   await page.locator('#e07-transfer').click();
   assert.match(page.url(),/\/e07-scene\/#paper-memory-station-garden-shortcut=/);
   await page.waitForFunction(()=>document.querySelector('#e04-e05-context')?.hidden===false);
   assert.match(await page.locator('#e04-e05-context').innerText(),/UNKNOWN dates/);
   const e07=async key=>{
    const target=page.locator('[data-key="'+key+'"]');
    assert.equal(await target.isDisabled(),false,key);await target.click();
   };
   await e07('start');await e07('walk-shared');await e07('inspect-shared');
   assert.match(await page.locator('#observed').innerText(),/shared-path/);
   await page.locator('#e06-return').click();
   await page.waitForFunction(()=>document.querySelector('#e05-return')?.hidden===false);
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
   assert.equal(await page.locator('#e07-transfer').isVisible(),true);
   await page.locator('#e07-transfer').click();
   await page.waitForFunction(()=>document.querySelector('#e04-e05-context')?.hidden===false);
   assert.match(await page.locator('#observed').innerText(),/shared-path/,
     'E07 child action persists through E06→E05→E04→E05→E06');
   // Child earns E08 by revising the connector and walking the checked model route.
   for(const key of ['walk-channel','inspect-channel','walk-workbench','test-milo',
    'test-resident','test-water','place-water','test-milo','test-resident','test-water',
    'place-upper','test-water','test-milo','test-resident','compare','finish',
    'walk-start','walk-crossing','walk-check-crossing','walk-water','walk-check-water',
    'walk-base','walk-review'])await e07(key);
   assert.equal(await page.locator('#e08-transfer').isVisible(),true);
   await page.locator('#e08-transfer').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent.includes('E08 opening'));
   assert.match(page.url(),/paper-memory-station-garden-shortcut-steps=/);
   assert.match(await page.locator('#connector-trace').innerText(),/E04 sincere memories remain undated/);
   const e08=async key=>{
    const target=page.locator('[data-key="'+key+'"]');
    assert.equal(await target.isDisabled(),false,key);await target.click();
   };
   for(const key of ['start','inspect-brackets','inspect-boundary','inspect-a','lamp-a',
    'walk-landing','inspect-b','lamp-b','walk-base','observe','walk-landing',
    'walk-side','observe','compare','inspect-plate','finish'])await e08(key);
   assert.match(await page.locator('#steps-world-note').innerText(),/real lights NOT restored/);
   // E08 now carries E04/E05 undated/MOCK provenance into the independent
   // E09 safe survey; the hill is still CLOSED and never officially unlocked.
   assert.equal(await page.locator('#e09-transfer').isVisible(),true);
   await page.locator('#e09-transfer').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent.includes('E09 opening'));
   assert.match(page.url(),/paper-memory-station-garden-shortcut-steps-hill=/);
   assert.match(await page.locator('#lantern-context').innerText(),/E04 memories: UNKNOWN dates/);
   assert.match(await page.locator('#lantern-context').innerText(),/E05 station evidence: MOCK/);
   const e09=async key=>{
    const target=page.locator('[data-key="'+key+'"]');
    assert.equal(await target.isDisabled(),false,key);await target.click();
   };
   for(const key of ['start','inspect-entry_note','walk-signpost','inspect-boundary_sign',
    'walk-fence_view','walk-upper_closed','inspect-disturbed_ground','walk-signpost',
    'walk-lower_bend','inspect-runoff_marks','walk-overlook','inspect-distant_symbol',
    'mark-steps_base:signpost','mark-signpost:lower_bend','mark-lower_bend:overlook',
    'check-route','compare-symbol','review','finish-preview'])await e09(key);
   assert.match(await page.locator('#chronicle').innerText(),/E10 NOT UNLOCKED/);
   // E09 child-earned survey, not a fixture, enables the separate E10 PAPER scene.
   assert.equal(await page.locator('#e10-paper').isVisible(),true);
   await page.locator('#e10-paper').click();
   await page.waitForFunction(()=>document.querySelector('#hill-context')?.textContent?.includes('E04: two sincere memories'));
   assert.match(await page.locator('#hill-context').innerText(),/E05: MOCK station sources/);
   const e10=async(type,value)=>{
    const target=page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':''));
    assert.equal(await target.isDisabled(),false,type+':'+value);
    await target.click();
   };
   for(const [type,value] of [
    ['start'],['compare-symbol'],['walk','stone_edge'],['inspect','surface'],
    ['suggest','surface:passing'],['revise','surface:passing:resting'],
    ['walk','quiet_corner'],['hear','quiet'],['place','quiet:shared'],
    ['walk','meeting_edge'],['hear','activity'],['place','activity:shared'],
    ['test-one-slot'],['place','quiet:left'],['place','activity:right'],
    ['walk','notice_wall'],['inspect','holes'],['suggest','holes:display'],
    ['check-source'],['review-tradeoff'],['review'],['finish-paper']
   ])await e10(type,value);
   assert.equal(await page.locator('#e11-paper').isVisible(),true);
   assert.match(await page.locator('#hook').innerText(),/E11 NOT UNLOCKED/);
   await page.locator('#e11-paper').click();
   await page.waitForFunction(()=>document.querySelector('#paper-chronicle')?.textContent?.includes('E06 Lower'));
   assert.equal(await page.locator('#paper-chronicle li').count(),9);
   const chronicle=await page.locator('#paper-chronicle').innerText();
   for(const label of ['E04','E05','E06 Current','E06 Lower','E07','E08','E09','E10','E11'])
    assert.ok(chronicle.includes(label),label+' missing from nine-space PAPER Chronicle');
   for(const limit of ['UNKNOWN','MOCK','CLOSED'])assert.ok(chronicle.includes(limit),limit);
   assert.match(await page.locator('#e03-paper-source').innerText(),/NOT verified/);
   assert.match(await page.locator('#chronicle').innerText(),/canonical events: 0; unlocks: 0/);
   const press=async name=>page.getByRole('button',{name,exact:true}).click();
   await press('Begin the PAPER trial');
   await press('Place access strip (two middle cells)');
   await press('Place quiet seat');await press('Cell 0,1');
   await press('Place activity area');await press('Cell 0,2');
   await press('Test Quiet reader');await press('Test Activity group');
   await press('Save tested trial');
   await press('Place activity area');await press('Cell 2,1');
   await press('Test Quiet reader');await press('Test Activity group');
   await press('Save tested trial');await press('Compare FIRST and NOW');
   assert.match(await page.locator('#revisit-first-result').innerText(),/RETRY/);
   assert.match(await page.locator('#revisit-now-result').innerText(),/PASS/);
   // E05 -> E06 -> E11 is one real child-operated Chromium journey, not a
   // pre-completed fixture. Review E11 before walking the separate PAPER loop.
   assert.equal(await page.locator('#garden-lower-now').getAttribute('data-stage'),'paper-sprout');
   await press('Recall E09 closed hill');
   for(const edge of ['square ↔ market','market ↔ unnamed place','unnamed place ↔ square'])
    await press('Add link: '+edge);
   await press('Check the current loop');
   await press('Review NONCANONICAL finale');
   assert.equal(await page.locator('#return-route').isVisible(),true);
   await press('Try Market PAPER detour');
   assert.match(await page.locator('#return-route-feedback').innerText(),/walk back/);
   await press('Return to Square PAPER start');
   await press('Visit Garden PAPER stop');
   assert.match(await page.locator('#return-route-garden').innerText(),/E06 child-earned PAPER/);
   assert.match(await page.locator('#return-route-garden').innerText(),/possible PAPER sprout/);
   assert.doesNotMatch(await page.locator('#return-route-garden').innerText(),/NOT VERIFIED/);
   await press('Visit Map Room PAPER stop');
   assert.match(await page.locator('#return-route-station').innerText(),/E05 child-earned PAPER/);
   assert.match(await page.locator('#return-route-station').innerText(),/PAPER table by wall/);
   assert.match(await page.locator('#return-route-station').innerText(),/Two marks aligned on COPY/);
   assert.doesNotMatch(await page.locator('#return-route-station').innerText(),/NOT VERIFIED/);
   await press('Return to Garden PAPER stop');
   await press('Return to Square PAPER start');
   assert.match(await page.locator('#return-route-result').innerText(),/PAPER route tested/);
   // These two observations must be earned in this same E05→E06→E11 browser
   // journey, not injected as pre-completed E11 fixture state. A PAPER model
   // observation is distinct from a claim about actual planting or public access.
   assert.equal(await page.locator('#return-reflection').isVisible(),true);
   await press('Choose E05 wall-side PAPER table · not sorted');
   await press('Place under NEEDS REAL CHECK');
   assert.match(await page.locator('#reflection-feedback').innerText(),/Look again/);
   await press('Place under SEEN IN PAPER');
   await press('Choose E06 possible PAPER sprout · not sorted');
   await press('Place under SEEN IN PAPER');
   for(const note of ['Real seeds were planted','The public route is safe']){
    await press('Choose '+note+' · not sorted');
    await press('Place under NEEDS REAL CHECK');
   }
   assert.match(await page.locator('#reflection-result').innerText(),/Four notes sorted/);
   assert.equal(await page.locator('#reflection-world').isVisible(),true);
   assert.equal(await page.locator('#reflection-world-first .reflection-note').count(),4);
   assert.equal(await page.locator('#reflection-world-now .reflection-note[data-shelf="paper"]').count(),2);
   assert.equal(await page.locator('#reflection-world-now .reflection-note[data-shelf="check"]').count(),2);
   assert.match(await page.locator('#reflection-chronicle-preview').innerText(),/2 child-earned model observations and 2 questions/);
   const shelves=await page.locator('#reflection-shelves').innerText();
   assert.match(shelves,/SEEN IN PAPER: E05 wall-side PAPER table · E06 possible PAPER sprout/);
   assert.match(shelves,/NEEDS REAL CHECK: Real seeds were planted · The public route is safe/);
   assert.doesNotMatch(await page.locator('#reflection-result').innerText(),/real facts verified: [1-9]/i);
   assert.match(await page.locator('#chronicle').innerText(),/canonical events: 0; unlocks: 0/);
   assert.match(await page.locator('#return-route-trail').innerText(),/Market PAPER detour/);
   assert.doesNotMatch(await page.locator('#return-route-trail').innerText(),/North Hill|Common/);
   await press('Undo last PAPER step');
   assert.equal(await page.locator('#reflection-world').isVisible(),false);
   assert.match(await page.locator('#return-route-result').innerText(),/Not complete/);
   assert.equal(await page.locator('#return-reflection').isVisible(),false,
    'undo must withdraw the completed reflection');
   await press('Return to Square PAPER start');
   assert.match(await page.locator('#return-route-result').innerText(),/PAPER route tested/);
   assert.match(await page.locator('#reflection-result').innerText(),/0 of 4 notes/,
    'route revision must clear both previously earned shelf placements');
   // Re-earn the two model observations after revising the route; E10 read-only
   // callback may preserve the reflection within the same E11 session.
   for(const note of ['E05 wall-side PAPER table','E06 possible PAPER sprout']){
    await press('Choose '+note+' · not sorted');
    await press('Place under SEEN IN PAPER');
   }
   for(const note of ['Real seeds were planted','The public route is safe']){
    await press('Choose '+note+' · not sorted');
    await press('Place under NEEDS REAL CHECK');
   }
   assert.match(await page.locator('#reflection-result').innerText(),/Four notes sorted/);
   const earnedE11Fragment=new URL(page.url()).hash;
   await page.locator('#e10-return').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent?.includes('finished'));
   await page.locator('#e11-paper').click();
   await page.waitForFunction(()=>document.querySelector('#comparison')?.textContent?.includes('trial-1'));
   assert.equal(await page.locator('#paper-chronicle li').count(),9);
   assert.match(await page.locator('#comparison').innerText(),/trial-1 → NOW trial-2/);
   assert.equal(await page.locator('#return-reflection').isVisible(),false,
    'cross-page E10 return starts a new E11 walk, so session-only sorting clears');
   assert.equal(await page.locator('#garden-lower-now').getAttribute('data-stage'),'paper-sprout',
    'new E11 visit retains strictly replayed E06 model evidence, not its old shelf choices');
   assert.match(await page.locator('#chronicle').innerText(),/canonical events: 0; unlocks: 0/);
   const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(geometry.scroll<=geometry.width+1,JSON.stringify({viewport,geometry}));
   assert.deepEqual(errors,[]);
   await page.locator('#restart').click();
   assert.match(await page.locator('#paper-chronicle').innerText(),/placed: 0/);
   await page.locator('#e10-return').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent?.includes('finished'));
   assert.equal(await page.locator('#e11-paper').isVisible(),true);
   await page.locator('#restart').click();
   assert.equal(await page.locator('#e11-paper').isVisible(),false);
   // A canonical E03 reset revokes source eligibility, not a production event.
   await page.goto(base+'/authoring-labs/e03-e04-paper-source-entry.html');
   await page.waitForFunction(()=>document.querySelector('#gate-status')?.dataset.gate==='verified');
   await page.evaluate(()=>localStorage.removeItem('wondervale-s01e03-progress-v1'));
   await page.locator('#refresh').click();
   assert.equal(await page.locator('#gate-status').getAttribute('data-gate'),'blocked');
   assert.equal(await page.locator('#paper-entry').isVisible(),false);
   assert.deepEqual((await page.evaluate(()=>Object.keys(localStorage))).sort(),
    ['source-journey-sentinel','wondervale-s01e02-progress-v1']);
   // Resetting either upstream episode must invalidate the copied PAPER chain.
   // An editable fragment is not authenticated permission or saved progress.
   for(const episode of ['e05','e06']){
    const packet=JSON.parse(decodeURIComponent(earnedE11Fragment.slice('#paper-loop='.length)));
    assert.ok(packet[episode]?.length,episode+' earned history required');
    packet[episode]=[]; // same empty history as an upstream episode restart
    await page.goto(base+'/e11-scene/#paper-loop='+encodeURIComponent(JSON.stringify(packet)));
    await page.reload(); // Fragment-only navigation does not re-run ES modules.
    assert.equal(await page.locator('#garden-revisit').isVisible(),false,episode+' reset revokes garden callback');
    assert.equal(await page.locator('#return-route').isVisible(),false,episode+' reset revokes route completion');
    assert.equal(await page.locator('#return-reflection').isVisible(),false,
     episode+' reset must revoke both earned PAPER observation shelves');
    assert.match(await page.locator('#chronicle').innerText(),/canonical events: 0; unlocks: 0/);
   }
  }finally{await ctx.close();}
 }
 console.log('E03→E11 child-operated PAPER Chromium PASS: three viewports, 9-space Chronicle, resets, canonical gate closed');
}finally{await browser.close();}
