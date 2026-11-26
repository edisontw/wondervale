// Real E05-E11 in-scene handoffs inside the isolated ordered alpha launcher.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {playAlphaE01ToE04,E02_SAVE_KEY,E03_SAVE_KEY} from './helpers/season1-alpha-e01-e04.mjs';

const alphaBase=process.env.WONDERVALE_ALPHA_TEST_URL||'http://127.0.0.1:4174';
const otherOrigin=process.env.WONDERVALE_OTHER_ORIGIN||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:568,height:320},reducedMotion:'reduce',hasTouch:true});
  try{
    const outside=await context.newPage();
    assert.equal((await outside.goto(otherOrigin+'/'))?.status(),200);
    const outsideSentinels=[[E02_SAVE_KEY,'isolated-E02'],[E03_SAVE_KEY,'isolated-E03']];
    await outside.evaluate(items=>items.forEach(([key,value])=>localStorage.setItem(key,value)),outsideSentinels);
    const outsideOrigin=await outside.evaluate(()=>location.origin);
    const page=await context.newPage();
    const {frame,ready:open,errors,e02Stored,e03Stored}=await playAlphaE01ToE04(page,alphaBase);
    const hit=async(root,key)=>{
      const action=root.locator(`[data-key="${key}"]`);
      assert.equal(await action.isDisabled(),false,key);
      await action.click();
    };

    const e05=frame('e05');
    await open(5,'e05');
    assert.equal(await e05.locator('#e04-alpha-arrival').isVisible(),true,
      'the E01→E04 child journey enters E05 with its earned story handoff');
    await mkdir('test-results',{recursive:true});
    await page.screenshot({path:'test-results/season1-alpha-e04-e05-earned-568x320.png'});
    const e05act=async(scene,type,extra={})=>{
      let selector=`[data-scene="${scene}"][data-type="${type}"]`;
      for(const [key,value] of Object.entries(extra))selector+=`[data-${key}="${value}"]`;
      const action=e05.locator(selector);
      assert.equal(await action.isDisabled(),false,`${scene}.${type} ${JSON.stringify(extra)}`);
      await action.click();
    };
    for(const [scene,type,extra] of [
      ['station','start'],['station','walk',{value:'board'}],['station','inspect',{value:'peg-pair'}],
      ['station','inspect',{value:'worn-edge'}],['station','guess',{value:'unsure'}],
      ['station','try-copy',{value:'side-b'}],['station','check'],
      ['station','try-copy',{value:'side-a'}],['station','check'],['station','qualify'],['nav','to-records'],
      ['sources','start'],['sources','walk',{value:'desk-a'}],['sources','inspect',{card:'a'}],
      ['sources','source-check',{card:'a'}],['sources','walk',{value:'desk-b'}],
      ['sources','inspect',{card:'b'}],['sources','source-check',{card:'b'}],
      ['sources','walk',{value:'compare'}],['sources','place',{card:'a',slot:'earlier'}],
      ['sources','test',{card:'a'}],['sources','place',{card:'a',slot:'unknown'}],['sources','test',{card:'a'}],
      ['sources','place',{card:'b',slot:'unknown'}],['sources','test',{card:'b'}],
      ['sources','compare'],['sources','finish'],['nav','to-layout'],['station','walk',{value:'table'}],
      ['station','place-table',{value:'across-walkway'}],['station','place-table',{value:'near-wall'}],
      ['station','confirm'],['station','reflect'],['nav','to-review'],
      ['garden','inspect',{value:'older'}],['garden','inspect',{value:'present'}],['garden','overlay'],['garden','ask-why']
    ])await e05act(scene,type,extra||{});
    await e05.locator('#e06-paper').click();
    await open(6,'e06');
    assert.match(await frame('e06').locator('#e05-context').innerText(),/maker\/date\/original UNKNOWN/);

    // One live E06 page spans Current Garden and Lower Garden, then hands its tested model to E07.
    const e06=frame('e06');
    for(const key of ['start','bed','slope-walk','slope','tray-walk','run','rain','run','blocked',
      'run','compare','enter','trace','lower-path-walk','lower-path','channel-walk','channel-place',
      'check','pocket-walk','pocket-place','check','think','finish','heavy-care','test-care',
      'gentle-care','test-care','compare-care'])await hit(e06,key);
    const e06Frame=page.locator('iframe[data-frame-key="e06"]');
    const e06Loads=Number(await e06Frame.getAttribute('data-load-count'));
    await page.locator('#scene-steps [data-slot="7"]').click();
    assert.equal(await page.locator('#scene-position').innerText(),'Scene 7 of 12');
    assert.equal(await e06Frame.getAttribute('data-load-count'),String(e06Loads),
      'Current and Lower Garden continue in one live E06 scene');
    assert.equal(await e06.locator('#lower-scene').isVisible(),true);
    await e06.locator('#e07-transfer').click();
    await open(8,'e07');
    assert.match(await frame('e07').locator('#e06-transfer-note').innerText(),/PAPER sprout|Garden/);

    // E07's observed path/water conflicts motivate its own E08 connector revisit.
    const e07=frame('e07');
    for(const key of ['start','walk-shared','inspect-shared','walk-channel','inspect-channel',
      'walk-workbench','test-milo','test-resident','test-water','place-water','test-milo',
      'test-resident','test-water','place-upper','test-water','test-milo','test-resident','compare',
      'finish','walk-start','walk-crossing','walk-check-crossing','other-start','other-step','other-step',
      'walk-water','walk-check-water','walk-base','walk-review'])await hit(e07,key);
    await e07.locator('#e08-transfer').click();
    await open(9,'e08');
    assert.match(await frame('e08').locator('#connector-trace').innerText(),/checked the model crossing/);

    // The same replay-earned E08 light/view investigation flows into the closed-hill survey.
    const e08=frame('e08');
    for(const key of ['start','inspect-brackets','inspect-boundary','inspect-a','lamp-a','walk-landing',
      'inspect-b','lamp-b','walk-base','observe','walk-landing','walk-side','observe','compare',
      'inspect-plate','finish'])await hit(e08,key);
    await e08.locator('#e09-transfer').click();
    await open(10,'e09');
    const e09=frame('e09');
    assert.match(await e09.locator('#lantern-context').innerText(),/SAME marks looked different/);
    assert.match(await e09.locator('#lantern-context').innerText(),/CLOSED hill/);
    for(const key of ['start','inspect-entry_note','walk-signpost','inspect-boundary_sign',
      'walk-fence_view','walk-upper_closed','inspect-disturbed_ground','walk-signpost',
      'walk-lower_bend','inspect-runoff_marks','walk-overlook','inspect-distant_symbol'])await hit(e09,key);
    await e09.locator('[data-sightline-select="light"]').click();
    await e09.locator('[data-sightline-site="overlook"]').click();
    await e09.locator('[data-sightline-select="view"]').click();
    await e09.locator('[data-sightline-site="fence_view"]').click();
    await e09.locator('#sightline-compare').click();
    assert.match(await e09.locator('#sightline-feedback').innerText(),/do not yet match/);
    await e09.locator('[data-sightline-select="light"]').click();
    await e09.locator('[data-sightline-site="fence_view"]').click();
    await e09.locator('[data-sightline-select="view"]').click();
    await e09.locator('[data-sightline-site="overlook"]').click();
    await e09.locator('#sightline-compare').click();
    await hit(e09,'mark-steps_base:signpost');
    await hit(e09,'mark-signpost:lower_bend');
    await hit(e09,'mark-lower_bend:overlook');
    await hit(e09,'check-route');
    await hit(e09,'compare-symbol');
    await hit(e09,'review');
    await hit(e09,'finish-preview');

    // Returning and re-entering uses E09's updated fragment; E10 receives the corrected evidence.
    const beforeReturn=Number(await page.locator('iframe[data-frame-key="e08"]').getAttribute('data-load-count'));
    await e09.locator('#e08-return').click();
    await open(9,'e08');
    await page.waitForFunction(count=>Number(document.querySelector('iframe[data-frame-key="e08"]')?.dataset.loadCount)>count,beforeReturn);
    assert.match(await frame('e08').locator('#e09-callback').innerText(),/Nia: Milo.*revised PAPER questions.*CLOSED/);
    await frame('e08').locator('#e09-transfer').click();
    await open(10,'e09');
    await frame('e09').locator('#e10-paper').click();
    await open(11,'e10');
    const e10=frame('e10');
    assert.match(await e10.locator('#hill-context').innerText(),/Milo inspected 5 fictional clues/);
    for(const [type,value] of [
      ['start'],['compare-symbol'],['walk','stone_edge'],['inspect','surface'],['suggest','surface:passing'],
      ['revise','surface:passing:resting'],['walk','quiet_corner'],['hear','quiet'],['place','quiet:shared'],
      ['walk','meeting_edge'],['hear','activity'],['place','activity:shared'],['test-one-slot'],
      ['place','quiet:left'],['place','activity:right'],['walk','notice_wall'],['inspect','holes'],
      ['suggest','holes:display'],['check-source'],['review-tradeoff'],['review'],['finish-paper']
    ]){
      const action=e10.locator(`[data-action="${type}"]${value?`[data-value="${value}"]`:''}`);
      await action.click();
    }
    assert.match(await e10.locator('#paper-comparison').innerText(),/FIRST|NOW/);
    await e10.locator('#e11-paper').click();
    await open(12,'e11');
    const e11=frame('e11');
    assert.match(await e11.locator('#e10-linked-context').innerText(),/observed 2 fictional traces/);
    assert.match(await e11.locator('#e10-linked-notes').innerText(),/SIMULATED NEEDS/);
    assert.match(await e11.locator('#loop-status').innerText(),/Historic hill remains CLOSED/);

    await e11.getByRole('button',{name:'Begin the PAPER trial',exact:true}).click();
    await e11.getByRole('button',{name:'Place access strip (two middle cells)',exact:true}).click();
    await e11.getByRole('button',{name:'Place quiet seat',exact:true}).click();
    await e11.getByRole('button',{name:'Cell 0,1',exact:true}).click();
    await e11.getByRole('button',{name:'Place activity area',exact:true}).click();
    await e11.getByRole('button',{name:'Cell 0,2',exact:true}).click();
    await e11.getByRole('button',{name:'Test Quiet reader',exact:true}).click();
    await e11.getByRole('button',{name:'Test Activity group',exact:true}).click();
    assert.match(await e11.locator('#test-results').innerText(),/Quiet reader: RETRY/);
    await e11.getByRole('button',{name:'Save tested trial',exact:true}).click();
    await e11.getByRole('button',{name:'Place activity area',exact:true}).click();
    await e11.getByRole('button',{name:'Cell 2,1',exact:true}).click();
    await e11.getByRole('button',{name:'Test Quiet reader',exact:true}).click();
    await e11.getByRole('button',{name:'Test Activity group',exact:true}).click();
    assert.match(await e11.locator('#test-results').innerText(),/Quiet reader: PASS/);
    await e11.getByRole('button',{name:'Save tested trial',exact:true}).click();
    await e11.getByRole('button',{name:'Compare FIRST and NOW',exact:true}).click();
    assert.match(await e11.locator('#comparison').innerText(),/trial-1 → NOW trial-2/);
    await e11.getByRole('button',{name:'Recall E09 closed hill',exact:true}).click();
    for(const link of ['Add link: square ↔ market','Add link: market ↔ unnamed place',
      'Add link: unnamed place ↔ square'])
      await e11.getByRole('button',{name:link,exact:true}).click();
    await e11.getByRole('button',{name:'Check the current loop',exact:true}).click();
    assert.match(await e11.locator('#loop-status').innerText(),/YES — FICTIONAL ONLY/);
    await e11.getByRole('button',{name:'Review NONCANONICAL finale',exact:true}).click();
    const alphaPanel=page.locator('[aria-label="Read-only Season 1 Alpha Chronicle"]');
    await alphaPanel.waitFor({state:'visible'});
    assert.match(await alphaPanel.innerText(),/E02\/E03 prerequisites replay-checked/);
    const alphaEntries=await page.locator('#alpha-chronicle-entries li').allInnerTexts();
    assert.deepEqual(alphaEntries.map(entry=>entry.split(':')[0]),[
      'E02–E03','E04','E05','E06 Current','E06 Lower','E07','E08','E09','E10','E11'
    ],'E11 shows the replay-validated Season 1 Alpha Chronicle across the played scenes');
    assert.match(await e11.locator('#chronicle').innerText(),/canonical events: 0; unlocks: 0/);
    assert.match(alphaEntries.at(-1),/layout cells placed: 4; model review: recorded/);
    assert.equal(await e11.locator('#revisit').isVisible(),true,
      'the child-earned FIRST and NOW boards are visible after the corrected review');
    for(const [stage,id] of [['first','#revisit-first'],['now','#revisit-now']]){
      await e11.locator(id).evaluate(element=>
        element.scrollIntoView({block:'start',behavior:'instant'}));
      await page.screenshot({path:`test-results/season1-alpha-e11-${stage}-board-568x320.png`});
    }
    await alphaPanel.evaluate(element=>
      element.scrollIntoView({block:'start',behavior:'instant'}));
    await page.screenshot({path:'test-results/season1-alpha-e11-alpha-chronicle-568x320.png'});
    await page.screenshot({path:'test-results/season1-alpha-e11-alpha-chronicle-full-568x320.png',fullPage:true});
    const alphaKeys=await page.evaluate(()=>Object.keys(localStorage).sort());
    assert.deepEqual(alphaKeys,[
      'wondervale-alpha-s01e04-e05-replay-v1','wondervale-progress-v1',
      'wondervale-alpha-s01e05-e06-replay-v1',
      'wondervale-s01e02-progress-v1','wondervale-s01e03-progress-v1',
      'wondervale-s01e04-authoring-preview-v1'
    ].sort(),'only the isolated Alpha origin contains the four replayed episodes and handoff');
    assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).phase,'wondervale-s01e04-authoring-preview-v1'),'completed');
    assert.deepEqual(await outside.evaluate(keys=>keys.map(key=>localStorage.getItem(key)),
      [E02_SAVE_KEY,E03_SAVE_KEY]),outsideSentinels.map(([,value])=>value),
      'the production-preview origin keeps its independent save sentinels');
    assert.notEqual(await page.evaluate(()=>location.origin),outsideOrigin);
    assert.deepEqual(errors,[],'full E01-E11 alpha journey page errors');
    console.log('Season 1 Alpha Chromium PASS: one child-played E01→E11 journey, E04 replay-earned Station handoff, E06 session continuity, corrected world evidence, E11 FIRST/NOW, isolated browser storage');
  }finally{await context.close();}
}finally{await browser.close();}
