import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const size of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport:size,reducedMotion:'reduce'});
  try{
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/authoring-labs/arc1-hill-unnamed-loop-handoff.html');
   assert.equal(response?.status(),200);
   const b=k=>page.locator('[data-key="'+k+'"]');
   const hit=async k=>{assert.equal(await b(k).isDisabled(),false,k);await b(k).click();};
   assert.match(await page.locator('.notice').innerText(),/NOT THE PRODUCTION GAME/);
   assert.equal(await b('to-garden').isDisabled(),true);
   assert.equal(await b('to-shortcut').isDisabled(),true);
   assert.equal(await b('to-lantern').isDisabled(),true);
   assert.equal(await b('to-hill').isDisabled(),true);
   assert.equal(await b('to-e10').isDisabled(),true);
   await page.evaluate(()=>localStorage.setItem('arc1-garden-sentinel','keep'));
   await hit('hear-station');await hit('hear-garden');
   await hit('station-earlier');await hit('garden-later');
   assert.equal(await b('compare').isDisabled(),true);
   await hit('station-unknown');await hit('garden-unknown');
   await hit('compare');await hit('finish-e04');await hit('to-e05');
   for(const k of ['start-e05','walk-board','inspect-peg','inspect-worn',
    'guess-route','copy-b','check','copy-a','check','qualify','walk-table',
    'table-block','table-clear','confirm','reflect'])await hit(k);
   assert.match(await page.locator('#station-state').innerText(),/Map Room/);
   await hit('to-garden');
   assert.match(await page.locator('#status').innerText(),/garden \/ opening/);
   for(const k of ['start-garden','walk-slope','inspect-slope',
    'walk-shared-path','inspect-shared-path','walk-model-tray','run',
    'weather-rain','run','channel-blocked','run','compare-garden','enter-lower'])await hit(k);
   assert.match(await page.locator('#status').innerText(),/garden \/ lower/);
   for(const k of ['inspect-runoff-trace','walk-public-path','inspect-public-path',
    'walk-runoff-channel','place-runoff-channel','check-marker',
    'walk-raised-pocket','place-raised-pocket','check-marker','think-path','finish-garden'])await hit(k);
   assert.match(await page.locator('#lower-state').innerText(),/Raised PAPER pocket/);
   assert.match(await page.locator('#current-state').innerText(),/Healthy beds stay/);
   await hit('to-shortcut');
   assert.match(await page.locator('#status').innerText(),/shortcut \/ opening/);
   for(const k of ['shortcut-start','shortcut-walk-shared-path','shortcut-inspect-shared-path',
    'shortcut-walk-channel','shortcut-inspect-channel','shortcut-walk-workbench',
    'shortcut-trial-milo','shortcut-trial-resident','shortcut-trial-water'])await hit(k);
   assert.match(await page.locator('#shortcut-first').innerText(),/resident: BLOCKED/);
   assert.ok(await page.locator('#shortcut-board [data-conflict="true"]').count()>0);
   await hit('shortcut-place-path-clear-water-blocked');
   for(const k of ['shortcut-trial-milo','shortcut-trial-resident','shortcut-trial-water'])await hit(k);
   assert.match(await page.locator('#shortcut-now').innerText(),/water: BLOCKED/);
   await hit('shortcut-place-side-offset');
   for(const k of ['shortcut-trial-water','shortcut-trial-milo','shortcut-trial-resident'])await hit(k);
   assert.equal(await page.locator('#shortcut-board [data-conflict="true"]').count(),0);
   await hit('shortcut-compare');await hit('shortcut-finish');
   await hit('to-lantern');
   assert.match(await page.locator('#status').innerText(),/lantern \/ opening/);
   assert.equal(await b('lantern-walk-side').isDisabled(),true);
   for(const k of ['lantern-start','lantern-inspect-brackets','lantern-inspect-boundary',
    'lantern-inspect-lower-a','lantern-toggle-lower-a','lantern-walk-lower-landing',
    'lantern-inspect-lower-b','lantern-toggle-lower-b','lantern-walk-base',
    'lantern-observe'])await hit(k);
   assert.equal(await b('lantern-compare').isDisabled(),true);
   for(const k of ['lantern-walk-lower-landing','lantern-walk-side',
    'lantern-observe','lantern-compare'])await hit(k);
   assert.match(await page.locator('#lantern-second').innerText(),/side/);
   assert.equal(await b('lantern-finish').isDisabled(),true);
   await hit('lantern-inspect-service-plate');await hit('lantern-finish');
   assert.match(await page.locator('#lantern-state').innerText(),/source UNKNOWN/);
   assert.match(await page.locator('#world-note').innerText(),/E09 PAPER survey/);
   assert.match(await page.locator('#current-state').innerText(),/Healthy beds stay/);
   await hit('to-hill');
   assert.match(await page.locator('#status').innerText(),/hill \/ opening/);
   assert.equal(await b('hill-walk-overlook').isDisabled(),true);
   assert.equal(await b('hill-finish').isDisabled(),true);
   for(const k of ['hill-start','hill-inspect-entry_note','hill-walk-signpost',
    'hill-inspect-boundary_sign','hill-walk-fence_view','hill-inspect-disturbed_ground',
    'hill-walk-upper_closed','hill-consider-water_may_change_ground',
    'hill-mark-fence_view:upper_closed','hill-walk-signpost','hill-walk-lower_bend',
    'hill-inspect-runoff_marks','hill-walk-overlook','hill-inspect-distant_symbol',
    'hill-mark-steps_base:signpost','hill-mark-lower_bend:overlook','hill-check'])await hit(k);
   assert.match(await page.locator('#hill-route').innerText(),/signpost:lower_bend/);
   assert.equal(await b('hill-review').isDisabled(),true);
   for(const k of ['hill-mark-signpost:lower_bend','hill-check','hill-symbol',
    'hill-review','hill-finish'])await hit(k);
   assert.match(await page.locator('#hill-state').innerText(),/upper hill CLOSED/);
   assert.match(await page.locator('#hill-note').innerText(),/E10 NOT UNLOCKED/);
   assert.match(await page.locator('#hill-seen').innerText(),/E08 from here/);
   await hit('to-e10');
   assert.match(await page.locator('#status').innerText(),/e10 \/ opening/);
   assert.equal(await b('e10-finish').isDisabled(),true);
   for(const k of ['e10-start','e10-compare-symbol','e10-walk-stone_edge',
    'e10-inspect-surface','e10-suggest-surface-passing',
    'e10-revise-surface-passing-resting','e10-walk-quiet_corner',
    'e10-hear-quiet','e10-place-quiet-shared','e10-walk-meeting_edge',
    'e10-hear-activity','e10-place-activity-shared','e10-test-one-slot'])await hit(k);
   assert.match(await page.locator('#e10-board').innerText(),/one-slot test tried/);
   assert.equal(await b('e10-review-tradeoff').isDisabled(),true);
   for(const k of ['e10-place-quiet-left','e10-place-activity-right',
    'e10-walk-notice_wall','e10-inspect-holes','e10-suggest-holes-display',
    'e10-check-source','e10-review-tradeoff','e10-review','e10-finish'])await hit(k);
   assert.match(await page.locator('#e10-state').innerText(),/no name or entry/i);
   assert.match(await page.locator('#world-note').innerText(),/E11 NOT UNLOCKED/);
   assert.match(await page.locator('#hill-state').innerText(),/upper hill CLOSED/);
   assert.equal(await b('to-e11').isDisabled(),false);
   await hit('to-e11');
   assert.match(await page.locator('#status').innerText(),/e11 .* opening/);
   assert.equal(await b('e11-finish').isDisabled(),true);
   for(const k of ['e11-start','e11-step-1','e11-step-2','e11-access','e11-quiet',
    'e11-activity-first','e11-test-reader','e11-test-group','e11-snapshot',
    'e11-activity-revise','e11-test-reader','e11-test-group','e11-snapshot',
    'e11-compare','e11-cite','e11-link-0','e11-link-1','e11-link-2',
    'e11-check-loop','e11-review','e11-finish'])await hit(k);
   assert.match(await page.locator('#e11-state').innerText(),/shared space CLOSED/);
   assert.match(await page.locator('#e11-tests').innerText(),/first conflict: true/);
   assert.match(await page.locator('#e11-trials').innerText(),/FIRST.NOW: compared/);
   assert.match(await page.locator('#world-note').innerText(),/CLOSED hill|CLOSED fence|North Hill CLOSED/);
   await hit('to-e10-e11');assert.match(await page.locator('#status').innerText(),/e10 .* finished/);
   await hit('to-e11');assert.match(await page.locator('#status').innerText(),/E11 PAPER finished: true/);
   await hit('to-e10-e11');
   await hit('to-hill-e10');await hit('to-e10');
   assert.match(await page.locator('#status').innerText(),/e10 \/ finished/);
   await hit('restart-e10');
   assert.match(await page.locator('#e11-state').innerText(),/No model trial/);
   assert.match(await page.locator('#status').innerText(),/e10 \/ opening/);
   await hit('to-hill-e10');
   assert.match(await page.locator('#current-state').innerText(),/Healthy beds stay/);
   await hit('to-steps');
   assert.match(await page.locator('#status').innerText(),/lantern \/ finished/);
   await hit('to-hill');
   assert.match(await page.locator('#status').innerText(),/hill \/ finished/);
   await hit('restart-hill');
   assert.match(await page.locator('#status').innerText(),/hill \/ opening/);
   assert.match(await page.locator('#lantern-state').innerText(),/source UNKNOWN/);
   await hit('to-steps');
   await hit('to-e07');
   assert.match(await page.locator('#connector-state').innerText(),/revised/);
   await hit('to-lantern');
   assert.match(await page.locator('#status').innerText(),/lantern \/ finished/);
   await hit('restart-lantern');
   assert.match(await page.locator('#status').innerText(),/lantern \/ opening/);
   assert.match(await page.locator('#connector-state').innerText(),/revised/);
   await hit('to-e07');
   assert.match(await page.locator('#connector-state').innerText(),/revised/);
   await hit('to-upstream');
   assert.match(await page.locator('#connector-state').innerText(),/revised/);
   await hit('to-shortcut');
   assert.match(await page.locator('#status').innerText(),/shortcut \/ finished/);
   await hit('restart-shortcut');
   assert.match(await page.locator('#status').innerText(),/shortcut \/ opening/);
   assert.match(await page.locator('#lower-state').innerText(),/Raised PAPER pocket/);
   await hit('to-upstream');
   await hit('to-arc1');
   assert.match(await page.locator('#lower-state').innerText(),/Raised PAPER pocket/);
   await hit('to-garden');
   assert.match(await page.locator('#status').innerText(),/garden \/ finished/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['arc1-garden-sentinel']);
   const geom=await page.evaluate(()=>({
    width:innerWidth,scroll:document.documentElement.scrollWidth,
    controls:[...document.querySelectorAll('button:not(:disabled)')]
     .filter(x=>x.offsetParent!==null).map(x=>({w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}))
   }));
   assert.ok(geom.scroll<=geom.width+1,JSON.stringify({size,geom}));
   for(const x of geom.controls)assert.ok(x.w>=43.5&&x.h>=43.5,JSON.stringify({size,x}));
   await hit('restart-garden');
   assert.match(await page.locator('#status').innerText(),/garden \/ opening/);
   assert.match(await page.locator('#station-state').innerText(),/Map Room/);
   assert.match(await page.locator('#lower-state').innerText(),/No lower pocket trial/);
   await hit('to-arc1');await hit('to-e04');await hit('to-e05');
   await hit('restart-e04');
   assert.equal(await b('to-garden').isDisabled(),true);
   await page.reload();
   assert.match(await page.locator('#status').innerText(),/E05 PAPER finished: false/);
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await ctx.newPage();await page.goto(base+'/authoring-labs/arc1-hill-unnamed-loop-handoff.html');
  await page.locator('[data-key="hear-station"]').focus();await page.keyboard.press('Enter');
  await page.locator('[data-key="hear-garden"]').focus();await page.keyboard.press('Space');
  assert.match(await page.locator('#arc-note').innerText(),/I remember a way to the garden/);
 }finally{await ctx.close();}
 console.log('Arc 1 E09-E10-E11 PAPER Chromium PASS: 3 viewports, keyboard, CLOSED boundary, lower route repair, two viewpoints, revisit, reset and no save');
}finally{await browser.close();}
