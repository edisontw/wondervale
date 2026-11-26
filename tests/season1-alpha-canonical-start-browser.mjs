// Real E01→E02→E03 local-save journey, followed by an honest E04 PAPER gate.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const alphaBase=process.env.WONDERVALE_ALPHA_TEST_URL||'http://127.0.0.1:4174';
const otherOrigin=process.env.WONDERVALE_OTHER_ORIGIN||'http://127.0.0.1:4173';
const e01SaveKey='wondervale-progress-v1';
const e02SaveKey='wondervale-s01e02-progress-v1';
const e03SaveKey='wondervale-s01e03-progress-v1';
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:1366,height:900},reducedMotion:'reduce'});
  try{
    const outside=await context.newPage();
    assert.equal((await outside.goto(otherOrigin+'/'))?.status(),200);
    const outsideSentinels=[e02SaveKey,e03SaveKey].map(key=>[key,'isolated-'+key]);
    await outside.evaluate(items=>items.forEach(([key,value])=>localStorage.setItem(key,value)),outsideSentinels);
    const outsideOrigin=await outside.evaluate(()=>location.origin);
    await outside.close();

    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
    await page.goto(alphaBase+'/season-alpha/');
    const frame=key=>page.frameLocator(`iframe[data-frame-key="${key}"]`);
    const ready=async(slot,key)=>page.waitForFunction(({slot,key})=>{
      const target=document.querySelector(`iframe[data-frame-key="${key}"]`);
      return document.querySelector('#scene-position')?.textContent===`Scene ${slot} of 12`&&
        target&&!target.hidden&&target.dataset.loaded==='true';
    },{slot,key});
    const drainE01=async scene=>{
      let steps=0;
      while(true){
        if(await scene.getByRole('button',{name:'Skip dialogue',exact:true}).count())
          await scene.getByRole('button',{name:'Skip dialogue',exact:true}).click();
        else if(await scene.getByRole('heading',{name:'A normal day in Town Square',exact:true}).count()&&
          await scene.getByRole('button',{name:'Continue',exact:true}).count())
          await scene.getByRole('button',{name:'Continue',exact:true}).click();
        else break;
        assert.ok(++steps<25,'E01 dialogue must progress');
      }
    };
    const e01button=(scene,name)=>scene.getByRole('button',{name,exact:true});
    const finishChapter=async scene=>{
      let steps=0;
      while(await scene.getByRole('button',{name:'Continue',exact:true}).count()){
        await scene.getByRole('button',{name:'Continue',exact:true}).click();
        assert.ok(++steps<80,'E02 dialogue queue must progress');
      }
    };

    await ready(1,'e01');
    const e01=frame('e01');
    const episode=JSON.parse(await readFile(new URL('../public/episode.json',import.meta.url),'utf8'));
    await e01button(e01,'Begin').click();
    await drainE01(e01);
    await e01button(e01,'Noticeboard').click();
    await e01button(e01,'Help hold the paper.').click();
    await drainE01(e01);
    await e01button(e01,'Look at the line').click();await drainE01(e01);
    await e01button(e01,'Look at the shape').click();await drainE01(e01);
    await e01button(e01,episode.lines['S01E01-MILO-013'].exact_text).click();await drainE01(e01);
    for(const [place,compare] of [['Fountain','Compare the round mark'],['Big tree','Compare the tree mark']]){
      await e01button(e01,place).click();
      await e01button(e01,compare).click();
      await drainE01(e01);
    }
    await e01button(e01,'Old post').click();
    await e01button(e01,'Look at the old post').click();
    await drainE01(e01);
    await e01button(e01,'Clean without rubbing').click();
    await e01button(e01,'Continue').click();
    await e01button(e01,'Continue').click();
    assert.equal(await e01.locator('.marker-original-ink').count(),1,
      'E01 reveals its original marker only after the replay-earned clean');
    await drainE01(e01);
    await e01button(e01,'Finish this page').click();
    await drainE01(e01);
    const e01Ledger=await page.locator('iframe[data-frame-key="e01"]').evaluate((element,key)=>
      JSON.parse(element.contentWindow.localStorage.getItem(key)).ledger,e01SaveKey);
    assert.ok(e01Ledger.includes('episode_completed:s01e01'));
    assert.equal(await e01.getByRole('link',{name:'Continue to Episode 2 · Riverside →',exact:true}).count(),1);

    // E01's existing chapter link advances the shell and keeps its accepted local save.
    await e01.getByRole('link',{name:'Continue to Episode 2 · Riverside →',exact:true}).click();
    await ready(2,'e02');
    const e02=frame('e02');
    assert.equal(await e02.getByRole('button',{name:'Begin Riverside adventure'}).count(),1);
    await e02.getByRole('button',{name:'Begin Riverside adventure'}).click();
    await finishChapter(e02);
    await e02.getByRole('button',{name:'Go to public lookout',exact:true}).click();
    await finishChapter(e02);
    await e02.getByRole('button',{name:'Look across',exact:true}).click();
    await finishChapter(e02);
    await e02.getByRole('button',{name:'Back to Riverside',exact:true}).click();
    await e02.getByRole('button',{name:'Look at old stones',exact:true}).click();
    await finishChapter(e02);
    await e02.getByRole('button',{name:'Back to Riverside',exact:true}).click();
    await e02.getByRole('button',{name:'Open old map',exact:true}).click();
    await e02.getByRole('button',{name:'Close map',exact:true}).click();
    await finishChapter(e02);
    await e02.getByRole('button',{name:'Open evidence notebook',exact:true}).click();
    await finishChapter(e02);
    await e02.getByRole('button',{name:'Not sure yet',exact:true}).click();
    await finishChapter(e02);
    await e02.locator('[data-a="fact-stones"]').click();await finishChapter(e02);
    await e02.locator('[data-a="fact-gap"]').click();await finishChapter(e02);
    await e02.getByRole('button',{name:'I was wrong about only the fence.',exact:true}).click();
    await finishChapter(e02);
    await e02.getByRole('button',{name:'Go to public lookout',exact:true}).click();
    await e02.getByRole('button',{name:'Look at the old mark',exact:true}).click();
    await finishChapter(e02);
    await e02.getByRole('button',{name:'Read the Chronicle',exact:true}).click();
    await finishChapter(e02);
    await e02.getByRole('button',{name:'Finish this chapter',exact:true}).click();
    assert.equal(await e02.getByRole('heading',{name:'Chapter complete'}).count(),1);
    const e02Stored=await page.locator('iframe[data-frame-key="e02"]').evaluate((element,key)=>
      JSON.parse(element.contentWindow.localStorage.getItem(key)),e02SaveKey);
    assert.equal(e02Stored.phase,'completed');
    assert.ok(e02Stored.ledger.includes('episode_completed:s01e02'));
    assert.equal(await e02.getByRole('link',{name:'Continue to Market Lane',exact:true}).count(),1);

    // E02's existing gated link carries the actual local checkpoint into E03.
    await e02.getByRole('link',{name:'Continue to Market Lane',exact:true}).click();
    await ready(3,'e03');
    const e03=frame('e03');
    assert.equal(await e03.getByRole('button',{name:'Begin Market Lane adventure'}).count(),1);
    await e03.locator('[data-a="begin"]').click();
    const drainE03=async()=>{
      let steps=0;
      while(await e03.locator('[data-a="next"]').count()){
        await e03.locator('[data-a="next"]').click();
        assert.ok(++steps<50,'E03 dialogue queue must progress');
      }
    };
    const e03act=key=>e03.locator(`[data-a="${key}"]`).click();
    const arrive=async()=>{await e03act('walk');await e03.locator('[data-a="deliver"]').waitFor();};
    const returnToHub=async()=>{
      const phase=await e03.locator('.child').getAttribute('data-phase');
      const destination=phase==='return-books'?'tea':'flowers';
      await e03act('return');
      await e03.locator(`.child[data-phase="${destination}"]`).waitFor();
      await drainE03();
      await e03.locator('[data-a="walk"]').waitFor();
    };
    await drainE03();
    await arrive();await e03act('deliver');await drainE03();
    await returnToHub();
    await arrive();await e03act('deliver');await drainE03();
    await e03act('compare-open');await e03act('inspect-S');await e03act('observe');
    await e03act('reason-steps');await drainE03();
    await returnToHub();
    await arrive();await e03act('deliver');await drainE03();
    await e03act('return');await e03.locator('.child[data-phase="signs"]').waitFor();await drainE03();
    await e03act('signs-open');await e03act('bad-cart');
    await e03.getByText('Check the arrow.',{exact:false}).waitFor();
    await e03act('walk-sign');await e03act('cart-sign');await drainE03();
    await e03act('go-glyph');await e03act('glyph');await drainE03();
    await e03act('garden');await drainE03();
    await e03act('station');await drainE03();
    await e03act('chronicle');await drainE03();
    await e03act('finish');
    await e03.getByRole('heading',{name:'Different loads, different ways'}).waitFor();
    const e03Stored=await page.locator('iframe[data-frame-key="e03"]').evaluate((element,key)=>
      JSON.parse(element.contentWindow.localStorage.getItem(key)),e03SaveKey);
    assert.ok(e03Stored.ledger.includes('episode_completed:s01e03'));
    assert.deepEqual(await page.evaluate(({e01SaveKey,e02SaveKey,e03SaveKey})=>[
      JSON.parse(localStorage.getItem(e01SaveKey)).ledger,
      JSON.parse(localStorage.getItem(e02SaveKey)).ledger,
      JSON.parse(localStorage.getItem(e03SaveKey)).ledger
    ],{e01SaveKey,e02SaveKey,e03SaveKey}),[e01Ledger,e02Stored.ledger,e03Stored.ledger]);

    // E04 can inspect only its labelled synthetic worktable after real E02/E03 saves exist.
    await page.locator('#scene-steps [data-slot="4"]').click();
    await ready(4,'e04');
    const e04=frame('e04');
    await e04.getByRole('heading',{name:'Source cards',exact:true}).waitFor();
    assert.match(await e04.locator('.alpha-warning').innerText(),/SYNTHETIC PAPER SOURCES.*OWNER-SELECTED FICTIONAL SCRIPT MODEL.*NOT HISTORICAL EVIDENCE/);
    const e04Initial=await e04.locator('#e04-preview').innerText();
    assert.match(e04Initial,/station route board · Version 1/i);
    assert.match(e04Initial,/garden route update · Version 2/i);
    assert.match(e04Initial,/Undated photo: way sign/);
    assert.match(e04Initial,/Draft timeline|MODEL/);
    assert.doesNotMatch(await e04.locator('#e04-preview').innerText(),/E05 unlocked|E05 available/i);
    assert.equal(await e04.locator('a[href*="e05"]').count(),0,'synthetic E04 must not unlock E05');

    // Play the Owner-selected fictional proposal: the child can make a wrong
    // first order, use the visible version-mark clue to revise, and keep the
    // photograph uncertain. No calendar year, cause, Canon event or E05 gate
    // is produced by completing this local source model.
    for(const key of ['memory:station','memory:garden',
      'inspect:station-route-copy','inspect:garden-route-update','inspect:undated-way-photo','clue:version-mark'])
      await e04.locator(`[data-focus-key="${key}"]`).click();
    await e04.locator('[data-focus-key="place:station-route-copy:later"]').click();
    await e04.locator('[data-focus-key="place:garden-route-update:earlier"]').click();
    await e04.locator('[data-focus-key="place:undated-way-photo:uncertain"]').click();
    assert.equal(await e04.locator('[data-focus-key="explain"]').isDisabled(),true,
      'the draft cannot explain an unsupported paper order');
    await e04.locator('[data-focus-key="place:station-route-copy:earlier"]').click();
    await e04.locator('[data-focus-key="place:garden-route-update:later"]').click();
    assert.equal(await e04.locator('[data-focus-key="explain"]').isEnabled(),true,
      'inspected Version 1/Version 2 records support only their relative order');
    await e04.locator('[data-focus-key="explain"]').click();
    await e04.locator('[data-focus-key="chronicle"]').click();
    const e04Chronicle=await e04.locator('.e04-chronicle').innerText();
    assert.match(e04Chronicle,/Earlier and later show source order, not confirmed calendar dates/);
    assert.match(e04Chronicle,/Version 1/);assert.match(e04Chronicle,/Version 2/);
    assert.match(e04Chronicle,/Not sure yet:[\s\S]*Undated photo: way sign/);
    assert.match(e04Chronicle,/Neither memory has a verified date/);
    assert.match(e04Chronicle,/Different times could explain both memories/);
    assert.doesNotMatch(e04Chronicle,/19\d{2}|20\d{2}|because the garden moved/i,
      'the script model cannot invent years or explain the route change');
    await e04.locator('[data-focus-key="finish"]').click();
    await e04.getByText('Draft timeline complete. This does not unlock production episodes.').waitFor();
    assert.equal(await e04.locator('a[href*="e05-scene"]').count(),1,
      'the replay-earned Alpha link appears only after completing the fictional E04 draft');
    assert.deepEqual(await page.locator('iframe[data-frame-key="e02"]').evaluate((element,key)=>
      JSON.parse(element.contentWindow.localStorage.getItem(key)),e02SaveKey),e02Stored,
      'E04 draft completion cannot rewrite the E02 save');
    assert.deepEqual(await page.locator('iframe[data-frame-key="e03"]').evaluate((element,key)=>
      JSON.parse(element.contentWindow.localStorage.getItem(key)),e03SaveKey),e03Stored,
      'E04 draft completion cannot rewrite the E03 save');
    // The child uses the in-scene replay-earned link. The launcher Next control
    // remains preview navigation and cannot supply this story context.
    await e04.locator('.e04-alpha-handoff').click();
    await ready(5,'e05');
    const e05=frame('e05');
    await e05.getByRole('heading',{name:'E05 — The Station with No Trains'}).waitFor();
    assert.equal(await e05.locator('#e04-alpha-arrival').isVisible(),true,
      'E05 receives the replay-checked E04 question inside the story scene');
    assert.match(await e05.locator('#e04-alpha-note').innerText(),/Market coordinator:.*Garden resident:.*undated memory/);
    assert.match(await e05.locator('#e04-alpha-note').innerText(),/Version 1.*Version 2.*photo stays Not sure yet/);
    assert.match(await e05.locator('.notice').first().innerText(),/AUTHORING ONLY.*no approved entry permission.*E04 canonical checkpoint/i);
    assert.match(await e05.locator('#guard').innerText(),/Production E05 LOCKED/);

    // A parent reload and scene revisit recover only a currently replay-valid
    // Alpha handoff from isolated storage. Restarting E05 itself keeps that
    // valid incoming question, while resetting E02 invalidates it on revisit.
    const e05Restart=await e05.getByRole('button',{name:'Restart E05 paper scene'}).count();
    assert.equal(e05Restart,1);
    await e05.getByRole('button',{name:'Restart E05 paper scene'}).click();
    assert.equal(await e05.locator('#e04-alpha-arrival').isVisible(),true);
    await page.reload();
    await ready(1,'e01');
    await page.locator('#scene-steps [data-slot="5"]').click();
    await ready(5,'e05');
    assert.equal(await e05.locator('#e04-alpha-arrival').isVisible(),true,
      'reload and revisit retain the handoff only while E02/E03/E04 still replay');
    await page.locator('#scene-steps [data-slot="2"]').click();
    await ready(2,'e02');
    const e02ResetFrame=frame('e02');
    await e02ResetFrame.locator('[data-a="reset-prompt"]').click();
    await e02ResetFrame.getByRole('button',{name:'Clear E02 and restart',exact:true}).click();
    assert.equal(await page.locator('iframe[data-frame-key="e02"]').evaluate((element,key)=>
      element.contentWindow.localStorage.getItem(key),e02SaveKey),null);
    await page.locator('#scene-steps [data-slot="5"]').click();
    await ready(5,'e05');
    await page.waitForFunction(()=>{
      const frame=document.querySelector('iframe[data-frame-key="e05"]');
      return frame?.contentDocument?.querySelector('#e04-alpha-arrival')?.hidden===true;
    });
    assert.equal(await e05.locator('#e04-alpha-arrival').isVisible(),false,
      'upstream E02 reset revokes an already loaded Alpha arrival on E05 revisit');
    assert.match(await e05.locator('#guard').innerText(),/Production E05 LOCKED/);
    const outsideAfter=await context.newPage();
    await outsideAfter.goto(otherOrigin+'/');
    assert.deepEqual(await outsideAfter.evaluate(keys=>keys.map(key=>localStorage.getItem(key)),
      [e02SaveKey,e03SaveKey]),outsideSentinels.map(([,value])=>value),
      'the non-alpha origin retains its independent save sentinels');
    assert.equal(await outsideAfter.evaluate(key=>JSON.parse(localStorage.getItem(key)).ledger.includes('episode_completed:s01e01'),e01SaveKey),false,
      'E01 completion remains saved only on the alpha origin');
    await outsideAfter.close();
    const actualOrigin=await page.evaluate(()=>location.origin);
    assert.notEqual(actualOrigin,outsideOrigin);
    assert.deepEqual(errors,[],'E01-E04 alpha canonical-start errors');
    console.log('Season 1 Alpha Chromium PASS: actual E01→E02→E03 saves, same-origin handoffs, synthetic E04 gate, outside-origin sentinels unchanged');
  }finally{await context.close();}
}finally{await browser.close();}
