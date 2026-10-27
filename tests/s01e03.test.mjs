import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fresh,dispatch,restore,payload,route,places,edges,EVENTS,has,e02Ready} from '../engine/s01e03.mjs';
import {e04Handoff} from '../engine/s01e04-handoff.mjs';
import {fresh as fresh02,dispatch as dispatch02,payload as payload02} from '../engine/s01e02.mjs';
const drain=s=>{while(s.queue.length)s=dispatch(s,{type:'next'});return s;};
export function realE02(){let s=fresh02();const a=x=>{s=drain02(dispatch02(s,x));};const drain02=s=>{while(s.queue.length)s=dispatch02(s,{type:'next'});return s;};a({type:'begin'});a({type:'go',to:'oldStones'});a({type:'inspect',what:'stones'});a({type:'close-detail'});a({type:'go',to:'lookoutView'});a({type:'inspect',what:'gap'});a({type:'close-detail'});a({type:'notebook'});a({type:'fact',choice:'gap'});a({type:'revision',choice:'A'});a({type:'market'});a({type:'chronicle'});a({type:'finish'});return s;}
export function move(s){while(s.travel.length)s=dispatch(s,{type:'step',to:s.travel[0]});return s;}
export function deliver(s){s=move(dispatch(s,{type:'take-route',route:'L'}));return drain(dispatch(s,{type:'deliver'}));}
export function whole(mode='canonical',memoryOrder=['station','garden']){let s=drain(dispatch(fresh(mode),{type:'begin',ready:true}));s=deliver(s);s=drain(move(dispatch(s,{type:'return'})));s=deliver(s);s=dispatch(s,{type:'inspect',what:'S'});s=drain(dispatch(s,{type:'compare',reason:'steps'}));s=drain(move(dispatch(s,{type:'return'})));s=deliver(s);s=drain(move(dispatch(s,{type:'return'})));for(const kind of ['WALK','CART'])s=drain(dispatch(s,{type:'sign',kind,to:'L'}));s=move(dispatch(s,{type:'go-glyph'}));s=drain(dispatch(s,{type:'glyph'}));for(const which of memoryOrder)s=drain(dispatch(s,{type:'memory',which}));s=drain(dispatch(s,{type:'chronicle'}));s=dispatch(s,{type:'finish'});return s;}
test('canonical prerequisite uses actual E02 checkpoint validation, not two fabricated events',()=>{
 assert.equal(e02Ready(null),false);assert.equal(e02Ready({ledger:['episode_completed:s01e02','s01e02_market_lane_marker_recorded']}),false);
 const s=realE02();assert.equal(e02Ready(s),true);s.revised=false;assert.equal(e02Ready(s),false);
});
test('visible graph is bidirectional and cargo-specific; no inferred S/N through-route or direct crate crossing',()=>{
 for(const to of ['B','T','F'])for(const load of ['none','books','tea_cart','flowers']){const p=route('H',to,load);assert.ok(p.length>1);assert.deepEqual(route(to,'H',load),p.toReversed());}
 assert.equal(route('H','arch','tea_cart').length,0);assert.equal(route('H','arch','flowers').length,0);assert.ok(route('H','arch').length);
 assert.equal(edges.some(e=>e.a==='H'&&e.b==='B'),false);assert.equal(route('H','S').length,0);
 // Actual cargo silhouette, not its bounding rectangle (which also covers
 // the clear upper-right arch entrance). Sample all visible graph segments.
 const cargo=[[430,628],[580,579],[730,580],[785,620],[860,640],[880,689],[785,727],[600,728],[490,709],[430,688]];
 const inside=([x,y])=>{let yes=false;for(let i=0,j=cargo.length-1;i<cargo.length;j=i++){const [ax,ay]=cargo[i],[bx,by]=cargo[j];if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)yes=!yes;}return yes;};
 for(const e of edges){const a=places[e.a],b=places[e.b];for(let t=0;t<=1;t+=.01){assert.equal(inside([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]),false,`crate collision ${e.a}-${e.b}`);}}
});
// This is a centerline-to-painted-cargo SCREEN, not physical cart-width approval.
test('route audit: no invented 80px clearance and narrow cargo pinch stays explicitly open',()=>{
 const cargo=[[430,628],[580,579],[730,580],[785,620],[860,640],[880,689],[785,727],[600,728],[490,709],[430,688]];
 const gap=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],n=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/n));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);};
 function boundaryGap(a,b){
  const steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2);let closest=Infinity;
  for(let i=0;i<=steps;i++){const p=[a[0]+(b[0]-a[0])*i/steps,a[1]+(b[1]-a[1])*i/steps];
   for(let j=0;j<cargo.length;j++)closest=Math.min(closest,gap(p,cargo[j],cargo[(j+1)%cargo.length]));}
  return closest;
 }
 assert.ok(edges.every(e=>e.clearance===null),'unverified corridor width must be null, not a fabricated 80px');
 const audit=edges.filter(e=>e.cart).map(e=>({edge:e.a+'-'+e.b,gap:boundaryGap(places[e.a],places[e.b])}));
 const pinch=audit.filter(e=>e.gap<50);
 assert.ok(pinch.some(e=>e.edge==='west-bend'),'west-bend narrow paint-level corridor must be revisited');
 assert.ok(pinch.some(e=>e.edge==='bend-front'),'bend-front narrow paint-level corridor must be revisited');
 for(const e of pinch)assert.ok(e.gap>0,'current allowed cart centerline must stay outside this painted cargo boundary: '+e.edge);
 const m1=JSON.parse(readFileSync(new URL('../content/season-01/s01e03/M1_ROUTE_REVIEW.json',import.meta.url)));
 const inside=([x,y])=>{let yes=false;for(let i=0,j=cargo.length-1;i<cargo.length;j=i++){const a=cargo[i],b=cargo[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;};
 assert.ok(m1.routes.N.points.some(inside),'review-only narrow arcade route still intersects/backs onto unverified cargo');
 assert.equal(route('H','arch','tea_cart').length,0,'cart stays outside arch');
 console.log('E03 clearance SCREEN ONLY: '+pinch.map(e=>e.edge+' '+e.gap.toFixed(1)+'px').join(', ')+'; cart swept width and floor remain UNVERIFIED');
});
test('one complete L-first path, once-only ledger, attributed memories in either order',()=>{
 for(const order of [['station','garden'],['garden','station']]){const s=whole('canonical',order);assert.equal(s.phase,'completed');assert.equal(s.ledger.length,9);assert.equal(new Set(s.ledger).size,9);assert.ok(Object.values(EVENTS).every(e=>s.ledger.includes(e)));assert.deepEqual(restore(payload(s)),s);assert.deepEqual(dispatch(s,{type:'finish'}).ledger,s.ledger);}
});
test('delivery and reasoning require actual arrival and observed restriction; no forced failed cart route',()=>{
 let s=drain(dispatch(fresh(),{type:'begin',ready:true}));assert.equal(has(dispatch(s,{type:'deliver'}),'books'),false);
 s=deliver(s);s=drain(move(dispatch(s,{type:'return'})));const before=s.ledger.slice();
 s=dispatch(s,{type:'take-route',route:'S'});assert.equal(s.position,'H');assert.deepEqual(s.ledger,before);assert.equal(s.travel.length,0);
 s=deliver(s);assert.equal(has(s,'revision'),false);assert.equal(dispatch(s,{type:'compare',reason:'steps'}).phase,'comparison');
 const queueIds=s.history.filter(x=>x.type==='take-route').map(x=>x.route);assert.ok(queueIds.includes('L'));
 s=dispatch(s,{type:'inspect',what:'S'});s=dispatch(s,{type:'compare',reason:'steps'});assert.equal(has(s,'revision'),true);assert.ok(!s.queue.includes('S01E03-UI-005'));assert.ok(!s.queue.includes('S01E03-FINN-007'));
});
test('repeated unsure remains supportive without milestone; hints can lead to assisted confirmation',()=>{
 let s=drain(dispatch(fresh(),{type:'begin',ready:true}));for(let i=0;i<4;i++)s=drain(dispatch(s,{type:'unsure'}));assert.equal(s.hint,2);assert.equal(s.ledger.length,0);s=deliver(s);s=drain(move(dispatch(s,{type:'return'})));s=deliver(s);s=dispatch(s,{type:'inspect',what:'N'});s=drain(dispatch(s,{type:'compare',reason:'width'}));assert.equal(s.phase,'return-tea');
});
test('checkpoints preserve dialogue and in-flight itinerary; out-of-order steps cannot teleport',()=>{
 let s=dispatch(fresh(),{type:'begin',ready:true});s=dispatch(s,{type:'next'});assert.deepEqual(restore(payload(s)),s);s=drain(s);s=dispatch(s,{type:'take-route',route:'L'});assert.equal(s.position,'H');assert.deepEqual(dispatch(s,{type:'step',to:'B'}),s);s=dispatch(s,{type:'step',to:s.travel[0]});assert.deepEqual(restore(payload(s)),s);assert.equal(move(s).position,'B');
});
test('damaged or contradictory save fails closed; replay never writes a canonical payload or awards ledger',()=>{
 const s=whole();for(const mutate of [s=>s.position='B',s=>s.ledger=[],s=>s.queue=['not-a-line'],s=>s.phase='preview',s=>s.history.push({type:'unknown'})]){const bad=structuredClone(s);mutate(bad);assert.equal(restore(bad).phase,'preview');}
 const replay=whole('historical_replay');assert.equal(replay.phase,'completed');assert.deepEqual(replay.ledger,[]);assert.equal(payload(replay),null);
});
test('glyph, memories, signs and finish cannot be awarded early; wrong arrows recover',()=>{
 let s=drain(dispatch(fresh(),{type:'begin',ready:true}));for(const a of [{type:'glyph'},{type:'memory',which:'station'},{type:'sign',kind:'CART',to:'L'},{type:'finish'}])s=dispatch(s,a);assert.deepEqual(s.ledger,[]);
});
test('all queued line IDs exist in exact 79-line compilation and no exclusive stop dialogue on L-first',()=>{
 const c=JSON.parse(readFileSync(new URL('../public/s01e03.json',import.meta.url)));assert.equal(c.count,79);let s=dispatch(fresh(),{type:'begin',ready:true});for(const key of s.queue)assert.ok(c.lines[key]);const completed=whole();assert.ok(completed.history.every(a=>a.type!=='take-route'||a.route==='L'));
});

test('trying unavailable S/N paths stays on verified L edges and returns to the start without advancing deliveries',()=>{
 const start=drain(dispatch(fresh(),{type:'begin',ready:true}));
 for(const which of ['S','N']){
  const lookout=which==='S'?'bend':'fork';
  const expected=[...route('H',lookout,start.load).slice(1),...route(lookout,'H',start.load).slice(1)];
  let s=dispatch(start,{type:'try-route',route:which});
  const visited=[];
  while(s.travel.length){const to=s.travel[0],from=s.position;
   assert.ok(edges.some(e=>(e.a===from&&e.b===to)||(e.b===from&&e.a===to)),'only an existing graph edge');
   visited.push(to);s=dispatch(s,{type:'step',to});
  }
  assert.deepEqual(visited,expected);
  assert.equal(s.position,'H');assert.equal(s.phase,'books');assert.equal(s.load,'books');
  assert.deepEqual(s.ledger,[]);assert.equal(s.travelEnd,null);
  assert.match(s.feedback,/Back at the start/);
  assert.deepEqual(restore(payload(s)),s,'save replay retains the round trip');
  assert.ok(!visited.includes('arch'),'do not enter unverified arcade');
  assert.equal(deliver(s).phase,'return-books','normal play can continue');
 }
 const legacy=dispatch(start,{type:'take-route',route:'S'});
 assert.equal(legacy.travel.length,0,'legacy route-action saves remain non-moving');
 assert.deepEqual(restore(payload(legacy)),legacy,'backward save replay remains valid');
});

test('E04 handoff accepts only completed, saved canonical E03 state',()=>{
 const e02=payload02(realE02()),completed=whole();
 assert.equal(e04Handoff(e02,payload(completed)).ready,true);
 assert.equal(e04Handoff(e02,payload(whole('development_preview'))).ready,false);
 assert.equal(e04Handoff(e02,payload(drain(dispatch(fresh(),{type:'begin',ready:true})))).ready,false);
});
