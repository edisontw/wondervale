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
    assert.match(await e04.locator('.alpha-warning').innerText(),/SYNTHETIC PAPER SOURCES.*NOT APPROVED HISTORY/);
    assert.match(await e04.locator('#e04-preview').innerText(),/Draft timeline|MODEL/);
    assert.doesNotMatch(await e04.locator('#e04-preview').innerText(),/E05 unlocked|E05 available/i);
    assert.equal(await e04.locator('a[href*="e05"]').count(),0,'synthetic E04 must not unlock E05');
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
