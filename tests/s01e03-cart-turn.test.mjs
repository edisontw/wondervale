// E03 diagnostic: cart wheel/handle screen-space rotation sensitivity.
// This is NOT real cart yaw, swept-wheel clearance, walkable-floor proof or Gate 3 approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {places,route} from '../engine/s01e03.mjs';
import {actorHeight,spriteBox} from '../e03/perspective.mjs';
import {occluders} from '../e03/route-depth.mjs';

const cargo=[[430,628],[580,579],[730,580],[785,620],[860,640],
 [880,689],[785,727],[600,728],[490,709],[430,688]];
const view={width:132,height:72};
const ink={left:9,right:106,top:18,bottom:66}; // handle + cart body + both wheels
const axle={x:69,y:58}; // midpoint between SVG wheel centers 47 and 91
const sampleStep=3,angles=[-30,-15,0,15,30];
function percent(rule,name){
 const m=rule.match(new RegExp('(?:^|;)\\s*'+name+'\\s*:\\s*(-?\\d+(?:\\.\\d+)?)%\\s*(?:;|$)'));
 assert.ok(m,'Cart '+name+' must remain an explicit percent');
 return Number(m[1])/100;
}
function inside([x,y],poly){
 let hit=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const [ax,ay]=poly[i],[bx,by]=poly[j];
  if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)hit=!hit;
 }
 return hit;
}
function cross(a,b,c){return(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);}
function overlap(a,b){
 if(a.some(p=>inside(p,b))||b.some(p=>inside(p,a)))return true;
 for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++){
  const p=a[i],q=a[(i+1)%a.length],r=b[j],s=b[(j+1)%b.length];
  if(cross(p,q,r)*cross(p,q,s)<0&&cross(r,s,p)*cross(r,s,q)<0)return true;
 }
 return false;
}
function cartPoly([x,y],style,degrees=0){
 const h=actorHeight([x,y]),w=h*spriteBox.width/spriteBox.height;
 const left=x-w/2+style.left*w,top=y-h+style.top*h;
 const sw=style.width*w,sh=style.height*h;
 const px=ix=>left+ix/view.width*sw,py=iy=>top+iy/view.height*sh;
 const cx=px(axle.x),cy=py(axle.y),a=degrees*Math.PI/180;
 const co=Math.cos(a),si=Math.sin(a);
 return [[ink.left,ink.top],[ink.right,ink.top],[ink.right,ink.bottom],[ink.left,ink.bottom]]
  .map(([ix,iy])=>{const dx=px(ix)-cx,dy=py(iy)-cy;
   return[cx+dx*co-dy*si,cy+dx*si+dy*co];});
}
function scan(path,style,degrees){
 return path.slice(1).map((to,k)=>{
  const from=path[k],a=places[from],b=places[to];
  const count=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/sampleStep);
  let hits=0,first=null;
  for(let j=0;j<=count;j++){
   const t=j/count,foot=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
   if(overlap(cartPoly(foot,style,degrees),cargo)){
    hits++;
    if(first===null)first=foot.map(v=>Number(v.toFixed(1)));
   }
  }
  return{edge:from+'-'+to,samples:count+1,overlapSamples:hits,firstOverlapFoot:first};
 });
}
// Probe continuous hypothetical screen-plane pivots at each real L corner.
// Runtime cart does not rotate: this is not physical wheel/road clearance.
// Signed centerline deflection is measurable, but is NOT cart wheel yaw.
function signedRouteTurn(before,pivot,after){
 const ix=pivot[0]-before[0],iy=pivot[1]-before[1];
 const ox=after[0]-pivot[0],oy=after[1]-pivot[1];
 return Math.atan2(ix*oy-iy*ox,ix*ox+iy*oy)*180/Math.PI;
}
function scanCornerTransitions(path,style,peakDegrees,obstacle=cargo){
 const corners=[];
 for(let i=1;i<path.length-1;i++){
  const before=places[path[i-1]],pivot=places[path[i]],after=places[path[i+1]];
  const incoming=Math.hypot(pivot[0]-before[0],pivot[1]-before[1]);
  const outgoing=Math.hypot(after[0]-pivot[0],after[1]-pivot[1]);
  assert.ok(incoming>0&&outgoing>0,'Route contains a zero-length turn');
  const routeTurnDegrees=signedRouteTurn(before,pivot,after);
  const cornerPeak=peakDegrees==='route-heading'?routeTurnDegrees:peakDegrees;
  const reach=Math.min(45,incoming/2,outgoing/2);
  const steps=Math.max(1,Math.ceil(reach/sampleStep));
  let hits=0,first=null;
  for(let j=-steps;j<=steps;j++){
   const fraction=Math.abs(j)/steps;
   const neighbor=j<0?before:after,segmentLength=j<0?incoming:outgoing;
   const foot=[pivot[0]+(neighbor[0]-pivot[0])*reach*fraction/segmentLength,
               pivot[1]+(neighbor[1]-pivot[1])*reach*fraction/segmentLength];
   const degrees=cornerPeak*(1-fraction);
   if(overlap(cartPoly(foot,style,degrees),obstacle)){
    hits++;
    if(first===null)first={foot:foot.map(v=>Number(v.toFixed(1))),
     degrees:Number(degrees.toFixed(1))};
   }
  }
  corners.push({from:path[i-1],corner:path[i],to:path[i+1],
   peakDegrees:cornerPeak,routeTurnDegrees:Number(routeTurnDegrees.toFixed(2)),
   exceedsFixed30Probe:Math.abs(routeTurnDegrees)>30,
   samples:steps*2+1,overlapSamples:hits,firstOverlap:first});
 }
 return corners;
}

test('E03 cart screen-space turning diagnostic; physical clearance remains OPEN',async()=>{
 const css=await readFile('e03/style.css','utf8');
 const rules=[...css.matchAll(/\.load-cart\s*\{([^}]+)\}/g)];
 assert.ok(rules.length,'Cart CSS missing');
 const style=Object.fromEntries(['left','top','width','height']
  .map(k=>[k,percent(rules.at(-1)[1],k)]));
 const ui=await readFile('e03/main.mjs','utf8');
 assert.ok(ui.includes('viewBox="0 0 132 72"'),'Update model when SVG viewBox changes');
 for(const x of [47,91])assert.ok(ui.includes('circle cx="'+x+'" cy="58" r="8"'),
  'Update model when SVG wheel coordinates change');
 const forward=route('H','T','tea_cart');
 assert.ok(forward.length>=6,'Expected L-only tea-cart route');
 assert.deepEqual(route('T','H','tea_cart'),forward.toReversed(),
  'Cart reverse path must use the same legal L edges');
 const probes=Object.fromEntries(angles.map(deg=>[String(deg),scan(forward,style,deg)]));
 const reverse=scan(forward.toReversed(),style,0);
 // Direction-aware L corner probes with both hypothetical pivot handednesses.
 const cornerProbes={
  forward:Object.fromEntries([-30,0,30].map(deg=>[String(deg),
   scanCornerTransitions(forward,style,deg)])),
  reverse:Object.fromEntries([-30,0,30].map(deg=>[String(deg),
   scanCornerTransitions(forward.toReversed(),style,deg)]))
 };
 // Cross-check the earlier hand-estimated cargo silhouette against the
 // existing source-coordinate *review-only* foreground mask. A difference
 // is evidence of model uncertainty, not proof of passable pavement.
 const reviewCargo=occluders.find(o=>o.id==='unloading-cargo');
 assert.ok(reviewCargo?.polygons.length,'Unloading foreground review mask missing');
 const reviewMaskCornerProbes={
  forward:Object.fromEntries([-30,0,30].map(deg=>[String(deg),
   scanCornerTransitions(forward,style,deg,reviewCargo.polygons[0])])),
  reverse:Object.fromEntries([-30,0,30].map(deg=>[String(deg),
   scanCornerTransitions(forward.toReversed(),style,deg,reviewCargo.polygons[0])]))
 };
 // A direction-aware image-plane probe uses each real graph corner's signed
 // centerline deflection, rather than treating arbitrary +/-30 degrees as
 // the measured turn. It still does not simulate true cart orientation.
 const routeHeadingProbes={
  forward:scanCornerTransitions(forward,style,'route-heading'),
  reverse:scanCornerTransitions(forward.toReversed(),style,'route-heading')
 };
 const reviewHeadingProbes={
  forward:scanCornerTransitions(forward,style,'route-heading',reviewCargo.polygons[0]),
  reverse:scanCornerTransitions(forward.toReversed(),style,'route-heading',reviewCargo.polygons[0])
 };
 const reviewMaskComparison=['forward','reverse'].flatMap(direction=>
  [-30,0,30].flatMap(deg=>cornerProbes[direction][String(deg)]
   ? cornerProbes[direction][String(deg)].map((original,i)=>({
      direction,corner:original.corner,degrees:deg,
      estimatedCargoSamples:original.overlapSamples,
      reviewMaskSamples:reviewMaskCornerProbes[direction][String(deg)][i].overlapSamples,
      firstReviewMaskOverlap:reviewMaskCornerProbes[direction][String(deg)][i].firstOverlap
     })) : []));
 assert.ok(Object.values(routeHeadingProbes).every(corners=>corners.length===forward.length-2&&
  corners.every(c=>Number.isFinite(c.routeTurnDegrees)&&Number.isFinite(c.peakDegrees)&&
   c.samples>=3&&c.overlapSamples<=c.samples)),
  'Measured graph turn angles and sensitivity samples must be finite in both directions');
 assert.ok(reviewMaskComparison.every(r=>Number.isInteger(r.reviewMaskSamples)),
  'Review-mask comparison must cover both directions and every corner');
 assert.ok(Object.values(reviewMaskCornerProbes).every(byAngle=>byAngle['0'].every(c=>c.overlapSamples===0)),
  'Unrotated cart must retain zero review-mask overlap');
 assert.ok(Object.values(cornerProbes).every(byAngle=>Object.values(byAngle)
  .every(corners=>corners.length===forward.length-2&&
   corners.every(c=>c.samples>=3&&c.overlapSamples<=c.samples))),
  'Every forward/reverse L corner must have finite pivot samples');
 assert.ok(probes['0'].every(e=>e.overlapSamples===0),
  'Preserve existing screen-aligned cargo clearance');
 assert.ok(reverse.every(e=>e.overlapSamples===0),
  'Preserve existing reverse screen-aligned cargo clearance');
 const findings=angles.filter(a=>a!==0).flatMap(deg=>probes[String(deg)]
  .filter(s=>s.overlapSamples>0).map(s=>({degrees:deg,...s})));
 const report={
  baseline:'Current E03 CSS, SVG and L route in 1672x941 source pixels',
  approval:'DIAGNOSTIC ONLY; not actual cart yaw, physical clearance or Gate 3 PASS',
  model:{sourceSize:[1672,941],style,svgViewBox:view,inkBounds:ink,
   wheelAxle:axle,stepPx:sampleStep,
   rotation:'hypothetical image-plane rotation around wheel midpoint; runtime cart does not yaw'},
  forward,screenAlignedForward:probes['0'],screenAlignedReverse:reverse,
  rotatedProbes:probes,cornerProbes,reviewMaskCornerProbes,reviewMaskComparison,
  routeHeadingProbes,reviewHeadingProbes,findings,
  limitations:[
   'Both the hand-estimated cargo silhouette and route-depth unloading foreground mask are review-only; neither is a verified solid obstacle or floor map.',
   'Differences between these masks show sensitivity to geometry assumptions; do not claim a safe front/east turn from either.',
   'Runtime cart stays screen-left of Milo even during reverse travel.',
   'Route-heading signed deflection is derived from the L graph; it is NOT actual wheel steering, cart yaw, or a turn-radius measurement.',
   'The fixed +/-30 degree probe can miss larger graph deflections; routeHeadingProbes explicitly reports those corners.',
   'Image-plane rotation and corner pivots are sensitivity tests, not physical top-down yaw or swept wheel tracks.',
   'Pavement, rails, plants, perspective and real phone rendering remain unverified.',
   'A rotated overlap is potential conflict, not a proven physical collision.'
  ]
 };
 await mkdir('test-results',{recursive:true});
 await writeFile('test-results/e03-cart-turn-sensitivity.json',JSON.stringify(report,null,2)+'\n');
 const reviewHits=reviewMaskComparison.filter(x=>x.reviewMaskSamples>0);
 console.log('E03 cart rotation DIAGNOSTIC: '+findings.length+
  ' estimated-cargo angle/edge conflicts; '+reviewHits.length+
  ' review-mask corner conflicts; real wheel/road/device clearance OPEN.');
});