// Regression for the owner's floating/in-front-of-railing report. Compare
// actual browser screenshots with and without the source-pixel foreground.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_ART_BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch(),p=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'}),errors=[],report=[];
p.on('pageerror',e=>errors.push(e.message));
async function node(route,index){await p.locator(`[data-route="${route}"]`).click();for(let n=0;n<index;n++)await p.locator('#next').click();}
async function pixelCheck(label){
 const points=await p.evaluate(()=>{
  const actor=document.querySelector('#actor'),f=document.querySelector('#foreground'),g=f.getContext('2d'),x=+actor.dataset.footX,y=+actor.dataset.footY,h=+actor.dataset.sourceHeight,w=h*490/990;
  // Ignore clip edges: CSS downsampling legitimately blends those pixels.
  // Require a fully opaque 5x5 source neighborhood for an occlusion witness.
  const out=[];for(let sy=Math.ceil(y-h+3);sy<y-1;sy+=2)for(let sx=Math.ceil(x-w/2+2);sx<x+w/2-2;sx+=2){const alpha=g.getImageData(sx-2,sy-2,5,5).data;if(alpha.every((n,i)=>i%4!==3||n===255))out.push([sx,sy]);}
  return out;
 });
 const on=(await p.locator('.world').screenshot()).toString('base64');
 await p.evaluate(()=>{document.querySelector('#actor').style.visibility='hidden';document.querySelector('#contact').style.visibility='hidden';});
 const background=(await p.locator('.world').screenshot()).toString('base64');
 await p.evaluate(()=>{document.querySelector('#actor').style.visibility='';document.querySelector('#contact').style.visibility='';document.querySelector('#foreground').style.visibility='hidden';});
 const wrong=(await p.locator('.world').screenshot()).toString('base64');
 await p.evaluate(()=>document.querySelector('#foreground').style.visibility='');
 const stats=await p.evaluate(async({on,background,wrong,points})=>{
  async function pixels(b64){const i=new Image();i.src='data:image/png;base64,'+b64;await i.decode();const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const g=c.getContext('2d');g.drawImage(i,0,0);return {width:i.width,height:i.height,data:g.getImageData(0,0,c.width,c.height).data};}
  const [a,b,c]=await Promise.all([on,background,wrong].map(pixels));let affected=0,repaired=0,largestError=0;
  for(const [x,y]of points){const k=(Math.min(a.height-1,Math.round(y*a.height/941))*a.width+Math.min(a.width-1,Math.round(x*a.width/1672)))*4;
   const delta=(first,second)=>Math.max(...[0,1,2].map(n=>Math.abs(first[k+n]-second[k+n])));
   if(delta(c.data,b.data)>14){affected++;const error=delta(a.data,b.data);largestError=Math.max(largestError,error);if(error<=8)repaired++;}
  }return {affected,repaired,ratio:affected?repaired/affected:0,largestError};
 },{on,background,wrong,points});
 assert.ok(stats.affected>18,label+' must cover actual C01 pixels, not only empty canvas');
 assert.ok(stats.ratio>.90,label+' must restore foreground object pixels over C01: '+JSON.stringify(stats));
 assert.equal(await p.locator('#actor').evaluate(e=>getComputedStyle(e).opacity),'1',label+' never fades the actor');
 report.push({label,...stats});
 await p.screenshot({path:`test-results/e03-m1-depth-${label}.png`,fullPage:true});
}
try{
 await p.goto(base+'/e03/route-review.html');await p.locator('#plate').evaluate(i=>i.decode());
 assert.match(await p.locator('script[type="module"]').getAttribute('src'),/depth=2/);
 assert.match(await p.locator('link[rel="stylesheet"]').getAttribute('href'),/depth=2/);
 const startHeight=await p.locator('#actor').getAttribute('data-source-height');
 await node('S',8);assert.match(await p.locator('#actor').getAttribute('data-depth'),/terrace-front/);assert.ok(+await p.locator('#actor').getAttribute('data-source-height')<+startHeight*.7);
 await pixelCheck('terrace-railing');
 await node('S',9);assert.match(await p.locator('#actor').getAttribute('data-depth'),/terrace-sign-pier/);await pixelCheck('terrace-pier');
 await node('N',10);assert.match(await p.locator('#actor').getAttribute('data-depth'),/arcade-front-pier/);await pixelCheck('arcade-pier');
 await node('N',5);assert.equal(await p.locator('#actor').getAttribute('data-foot-y'),'595');await p.screenshot({path:'test-results/e03-m1-depth-cargo.png',fullPage:true});
 await node('L',5);assert.equal(await p.locator('#actor').getAttribute('data-depth'),'');
 assert.equal(await p.locator('#foreground').evaluate(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((n,i)=>i%4===3&&n>0)),false,'front road must not inherit stale masks');
 await p.locator('[data-art="m0"]').click();await p.locator('#plate').evaluate(i=>i.decode());assert.equal(await p.locator('#contact').isHidden(),true);
 assert.equal(await p.locator('#foreground').evaluate(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((n,i)=>i%4===3&&n>0)),false,'M0 must never receive M1 masks');
 await p.locator('[data-art="m1"]').click();await p.locator('#plate').evaluate(i=>i.decode());
 for(const size of [{width:568,height:320},{width:390,height:844}]){
  await p.setViewportSize(size);await node('S',8);await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(50);
  const alignment=await p.evaluate(()=>{const a=document.querySelector('#actor'),r=a.getBoundingClientRect(),w=document.querySelector('.world').getBoundingClientRect(),f=document.querySelector('#foreground').getBoundingClientRect();return {foot:r.bottom,y:w.y+(+a.dataset.footY/941)*w.height,plane:f.width-worldWidth(),overflow:document.documentElement.scrollWidth>innerWidth};function worldWidth(){return document.querySelector('.world').getBoundingClientRect().width;}});
  assert.ok(Math.abs(alignment.foot-alignment.y)<1);assert.ok(Math.abs(alignment.plane)<1);assert.equal(alignment.overflow,false);
  await p.screenshot({path:`test-results/e03-m1-depth-${size.width}.png`,fullPage:true});report.push({label:`resize-${size.width}`,alignment});
 }
 // Depth masks and perspective update during a real edge, not only after it.
 await p.setViewportSize({width:1440,height:1100});await p.emulateMedia({reducedMotion:'no-preference'});await node('S',0);await p.locator('#walk').click();
 await p.waitForFunction(()=>+document.querySelector('#actor').dataset.footX>850&&+document.querySelector('#actor').dataset.footX<925);
 assert.match(await p.locator('#actor').getAttribute('data-depth'),/terrace-front/);
 assert.equal(await p.locator('#actor').evaluate(e=>getComputedStyle(e).opacity),'1');
 await p.waitForFunction(()=>document.querySelector('#position').textContent.startsWith('13 / 13'));
 assert.equal(await p.locator('#actor').getAttribute('data-foot-x'),'1432');
 assert.equal(await p.evaluate(()=>localStorage.length),0);assert.deepEqual(errors,[]);
 console.log('PASS M1 actual foreground pixel regression, perspective, resize, continuous animation and no save writes.');
}finally{await writeFile('test-results/e03-m1-depth-report.json',JSON.stringify({report,errors,physicalRouteAcceptance:'OPEN'},null,2));await browser.close();}
