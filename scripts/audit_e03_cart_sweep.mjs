// E03-only, source-pixel DIAGNOSTIC of the CSS cart's conservative visual envelope.
// This is not a physical/cart-width or actual paved-surface approval.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {places,route} from '../engine/s01e03.mjs';
import {actorHeight,spriteBox} from '../e03/perspective.mjs';

const css=await readFile('e03/style.css','utf8');
const rules=[...css.matchAll(/\.load-cart\s*\{([^}]+)\}/g)];
assert.ok(rules.length,'E03 cart CSS missing');
const last=Object.fromEntries(rules.at(-1)[1].split(';').filter(Boolean).map(t=>t.split(':').map(s=>s.trim())));
const percent=name=>{
 const s=last[name];assert.match(s||'',/^-?\d+(?:\.\d+)?%$/,'CSS cart '+name+' must remain a percent');
 return parseFloat(s)/100;
};
const style={left:percent('left'),top:percent('top'),width:percent('width'),height:percent('height')};
const art=await readFile('e03/main.mjs','utf8');
assert.match(art,/class="load-visual load-cart"/,'cart shape must exist');
assert.match(art,/viewBox="0 0 132 72"/,'CSS envelope needs updating after cart art change');

// Cargo is an approximate painted silhouette from the previously accepted L audit,
// not a complete floor/rail/flower obstacle mask.
const cargo=[[430,628],[580,579],[730,580],[785,620],[860,640],
 [880,689],[785,727],[600,728],[490,709],[430,688]];
// Axis-aligned, conservative SVG visible-ink bounds: cart handle x=9..104,
// cups y=20; wheel extremities y=50..66. Interior transparent spaces remain
// included, so an overlap is a *potential* issue, not proof of drawn-pixel overlap.
const ink={x0:9,x1:106,y0:18,y1:66};
const view={w:132,h:72};
const sq=v=>v*v;
function footBox([x,y]){
 const h=actorHeight([x,y]),w=h*spriteBox.width/spriteBox.height;
 const left=x-w/2+style.left*w,top=y-h+style.top*h;
 return [left+ink.x0/view.w*style.width*w,top+ink.y0/view.h*style.height*h,
         left+ink.x1/view.w*style.width*w,top+ink.y1/view.h*style.height*h];
}
const rectPoly=b=>[[b[0],b[1]],[b[2],b[1]],[b[2],b[3]],[b[0],b[3]]];
function inside(p,polygon){
 let hit=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[i],b=polygon[j];
  if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;
 }return hit;
}
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
function intersect(a,b,c,d){
 const z1=cross(a,b,c),z2=cross(a,b,d),z3=cross(c,d,a),z4=cross(c,d,b);
 return (z1*z2<0&&z3*z4<0);
}
function polygonOverlaps(a,b){
 if(a.some(p=>inside(p,b))||b.some(p=>inside(p,a)))return true;
 for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++)
  if(intersect(a[i],a[(i+1)%a.length],b[j],b[(j+1)%b.length]))return true;
 return false;
}
function segmentDistance(p,a,b){
 const dx=b[0]-a[0],dy=b[1]-a[1],length=sq(dx)+sq(dy);
 const t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/length));
 return Math.hypot(p[0]-a[0]-dx*t,p[1]-a[1]-dy*t);
}
function pixelGap(a,b){
 if(polygonOverlaps(a,b))return 0;
 let gap=Infinity;
 for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++){
  gap=Math.min(gap,segmentDistance(a[i],b[j],b[(j+1)%b.length]),
       segmentDistance(b[j],a[i],a[(i+1)%a.length]));
 }
 return gap;
}
function audit(path){
 const segments=[],frames=[];
 for(let k=1;k<path.length;k++){
  const from=places[path[k-1]],to=places[path[k]];
  const steps=Math.ceil(Math.hypot(from[0]-to[0],from[1]-to[1])/3);
  let overlap=0,minGap=Infinity,first=null;
  for(let j=0;j<=steps;j++){
   const t=j/steps,foot=[from[0]+(to[0]-from[0])*t,from[1]+(to[1]-from[1])*t];
   const rect=rectPoly(footBox(foot));
   const isOverlap=polygonOverlaps(rect,cargo);
   if(isOverlap){overlap++;if(first===null)first=Number(t.toFixed(3));}
   minGap=Math.min(minGap,pixelGap(rect,cargo));
   if(j%Math.max(1,Math.ceil(steps/6))===0||j===steps)frames.push({edge:path[k-1]+'-'+path[k],foot,rect,overlap:isOverlap});
  }
  segments.push({edge:path[k-1]+'-'+path[k],samples:steps+1,overlapSamples:overlap,
   firstOverlapFraction:first,minEnvelopeGapPx:Number(minGap.toFixed(1))});
 }
 return {segments,frames};
}
const forward=route('H','T','tea_cart');
assert.ok(forward.length>=6,'legal L route to tea is required');
assert.deepEqual(route('T','H','tea_cart'),forward.toReversed(),'reverse cart path should be reversible');
const {segments,frames}=audit(forward);
const reverse=audit([...forward].reverse());
const overlapEdges=segments.filter(s=>s.overlapSamples>0).map(s=>s.edge);
const result={
 baseline:'E03 accepted image / cart CSS, conservative axis-aligned decoration envelope',
 approval:'2D display-envelope screen PASS; physical turn/wheel/terrain clearance OPEN',
 coordinateSystem:'source image 1672 × 941 (CSS width and actor perspective projected back to image)',
 model:{css:style,visibleSvgViewBox:view,conservativeVisibleSvgBounds:ink,
   cargoApproximatePolygon:cargo,frameStepPx:3,rotation:'not modeled; actual cart CSS does not yaw at turns'},
 path:forward,forward:segments,reverse:reverse.segments,
 overlapEdges,notes:[
 'False positive possible because SVG bounds contain transparent pixels and paint is not a verified solid floor.',
 'False negative possible because other obstacles (fence, planters, arcades) are not represented.',
 'Bounding frame is not a physical wheel/handle/body swept volume; turning orientation is not simulated.',
 'Do not promote S/N walking routes or certify cart access solely from this screen.'
 ]};
await mkdir('test-results',{recursive:true});
await writeFile('test-results/e03-cart-sweep-report.json',JSON.stringify(result,null,2)+'\n');
const fmt=n=>Number(n.toFixed(1));
const red='#dc3944',gold='#c99b32';
const show=frames.filter((v,i)=>i%2===0).map(({rect,overlap})=>
 '<rect x="'+fmt(rect[0][0])+'" y="'+fmt(rect[0][1])+'" width="'+fmt(rect[1][0]-rect[0][0])+
 '" height="'+fmt(rect[2][1]-rect[1][1])+'" fill="'+(overlap?red:gold)+
 '" fill-opacity="'+(overlap?.28:.09)+'" stroke="'+(overlap?red:gold)+'" stroke-opacity=".65" stroke-width="1"/>').join('\n');
const polyline=forward.map(k=>places[k].join(',')).join(' ');
const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1672" height="941" viewBox="0 0 1672 941">'+
 '<image href="../public/art/s01e03-market-lane-m0.webp" width="1672" height="941"/>'+
 '<polygon points="'+cargo.map(p=>p.join(',')).join(' ')+'" fill="#d92143" fill-opacity=".08" stroke="#b81e3b" stroke-width="4"/>'+
 '<polyline points="'+polyline+'" fill="none" stroke="#f1c24d" stroke-width="6" stroke-dasharray="13 9"/>'+
 show+'<rect x="18" y="18" width="940" height="88" rx="12" fill="#142f30" fill-opacity=".91"/>'+
 '<text x="35" y="53" fill="white" font-size="27" font-family="sans-serif">E03 CART ENVELOPE — DIAGNOSTIC ONLY</text>'+
 '<text x="35" y="84" fill="#ffdfa2" font-size="19" font-family="sans-serif">Red: potential overlap with estimated cargo; not a Gate 3 pass</text>'+
 '</svg>\n';
await writeFile('test-results/e03-cart-sweep-overlay.svg',svg);
assert.ok(segments.every(s=>s.samples>=2),'sweep must sample every segment');
assert.ok(segments.every(s=>Number.isFinite(s.minEnvelopeGapPx)),'sweep gaps must be valid');
assert.ok(reverse.segments.length===segments.length,'reverse cart traversal must also be screened');
assert.deepEqual(overlapEdges,[],'cart CSS ink-envelope must not intersect estimated cargo in L forward trip');
assert.ok(segments.every(s=>s.minEnvelopeGapPx>=4),'forward projected cart has at least 4 source-pixel screening margin');
assert.ok(reverse.segments.every(s=>s.minEnvelopeGapPx>=4&&s.overlapSamples===0),
 'reverse cart screening must also remain outside estimated cargo');
// These are conservative 2D art-only checks: a PASS does not approve cart wheel turns,
// railing/flowers, actual road widths, orientation, or physical Gate 3.

console.log('E03 CART SWEEP SCREEN PASS: zero estimated painted-cargo overlap on L cart path; physical clearance / wheel-turns / Gate 3 remain OPEN. Report and SVG written.');
