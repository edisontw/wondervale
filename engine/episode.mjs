export const VERSION = 's01e01-script-v1';
export const KEY = 'wondervale-progress-v1';
export const locations = {board:[.27,.735], fountain:[.46,.64], large_tree:[.73,.56], marker:[.92,.61], bench:[.78,.70]};

/**
 * Town Square's walkable route network. Coordinates are normalized against the
 * 1672×941 Square art. All named destinations are reachable from this network.
 * Free-pointer/keyboard travel snaps to the nearest segment instead of letting
 * characters stand on the fountain, greenery, buildings or foreground props.
 * The board destination is on the open paving in front of the board, not on
 * the wooden panel; the original Town Square image and hotspots are unchanged.
 */
const roadNodes = [
 [.42,.77], // slightly right-shifted start: leave Steward nameplate unobstructed
 [.39,.68], // Square junction
 [.32,.70], // path in front of the noticeboard, never through its painted wood
 locations.board,
 locations.fountain,
 [.60,.63], // path past the fountain
 locations.large_tree,
 [.83,.60], // exit path
 locations.marker,
 locations.bench
];
const roadEdges = [[0,1],[1,2],[2,3],[1,4],[4,5],[5,6],[6,7],[7,8],[7,9]];
function roadProjection(x,y){
 if(!Number.isFinite(x)||!Number.isFinite(y))return {point:[.42,.77],edge:0,t:0};
 let best=null;
 roadEdges.forEach(([a,b],edge)=>{
  const p=roadNodes[a],q=roadNodes[b],dx=q[0]-p[0],dy=q[1]-p[1];
  const t=Math.max(0,Math.min(1,((x-p[0])*dx+(y-p[1])*dy)/(dx*dx+dy*dy)));
  const point=[p[0]+t*dx,p[1]+t*dy],distance=(x-point[0])**2+(y-point[1])**2;
  if(!best||distance<best.distance)best={point,edge,t,distance};
 });
 return best;
}
export const constrainToRoad=(x,y)=>roadProjection(x,y).point;
const roadDistance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
export function walkableTarget(current,x,y){
 if(!Number.isFinite(x)||!Number.isFinite(y)){x=current?current[0]:roadNodes[0][0];y=current?current[1]:roadNodes[0][1];}
 const projected=constrainToRoad(x,y);
 if(!current)return projected;
 if(roadDistance(current,projected)>=0.02)return projected;
 let best=null;
 roadNodes.forEach(node=>{
  const dFromCurrent=roadDistance(current,node);
  if(dFromCurrent>=0.03){
   const dFromClick=Math.hypot(x-node[0],y-node[1]);
   if(!best||dFromClick<best.dist)best={point:node,dist:dFromClick};
  }
 });
 return best?best.point:projected;
}
export function roadRoute(from,to){
 const a=roadProjection(from[0],from[1]),b=roadProjection(to[0],to[1]);
 const n=roadNodes.length,source=n,target=n+1;
 const adj=Array.from({length:n+2},()=>[]);
 const link=(i,j,weight)=>{adj[i].push([j,weight]);adj[j].push([i,weight]);};
 roadEdges.forEach(([i,j])=>link(i,j,roadDistance(roadNodes[i],roadNodes[j])));
 for(const [projection,vertex] of [[a,source],[b,target]]){
  const [i,j]=roadEdges[projection.edge];
  link(vertex,i,roadDistance(projection.point,roadNodes[i]));
  link(vertex,j,roadDistance(projection.point,roadNodes[j]));
 }
 if(a.edge===b.edge)link(source,target,roadDistance(a.point,b.point));
 const dist=Array(n+2).fill(Infinity),prev=Array(n+2).fill(-1),used=Array(n+2).fill(false);dist[source]=0;
 for(let k=0;k<n+2;k++){
  let u=-1;for(let i=0;i<n+2;i++)if(!used[i]&&(u<0||dist[i]<dist[u]))u=i;
  if(u<0||dist[u]===Infinity||u===target)break;
  used[u]=true;for(const [v,w] of adj[u])if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;prev[v]=u;}
 }
 const result=[];let at=target;
 while(at>=0){result.push(at===source?a.point:at===target?b.point:roadNodes[at]);at=prev[at];}
 result.reverse();
 return result.filter((p,i)=>i===0||roadDistance(p,result[i-1])>1e-8);
}

const id = (who,n) => `S01E01-${who}-${String(n).padStart(3,'0')}`;
const ids = (...pairs) => pairs.map(([who,n])=>id(who,n));
const range = (who,a,b) => Array.from({length:b-a+1},(_,i)=>id(who,a+i));
export const groups = {
 opening: ids(['NARRATOR',1],['NARRATOR',2],['NARRATOR',3],['MILO',1],['FINN',1],['NIA',1],['STEWARD',1],['STEWARD',2],['MILO',2],['STEWARD',3],['NARRATOR',4]),
 board: ids(['STEWARD',4],['UI',1],['MILO',5],['STEWARD',5],['FINN',3],['NIA',3],['MILO',6],['STEWARD',6],['STEWARD',7],['NIA',4],['MILO',7]),
 observe: ids(['MILO',8],['MILO',9],['NIA',6],['UI',2]),
 line: ids(['MILO',10],['NIA',7],['NIA',8]),
 blank_shape: ids(['FINN',4],['NIA',9],['MILO',11]),
 layer_holes: ids(['FINN',5],['FINN',6],['NIA',10]),
 guessPrompt: ids(['MILO',12],['NIA',11]),
 A: ids(['MILO',13],['FINN',7]), B: ids(['MILO',14],['NIA',12]), C: ids(['MILO',15],['FINN',8]),
 physical: ids(['FINN',9],['NIA',13]),
 converge: ids(['NIA',14],['NIA',15],['FINN',10],['MILO',16]),
 compare: ids(['FINN',11],['NIA',18],['MILO',17],['FINN',12],['UI',5]),
 fountain: ids(['MILO',18],['NIA',19]), large_tree: ids(['FINN',13],['NIA',20]),
 firstAnchor: ids(['MILO',19],['NIA',21]),
 bothAnchors: ids(['NIA',22],['FINN',15],['MILO',21],['NIA',23],['MILO',22]),
 mismatch: ids(['FINN',14],['MILO',20]),
 plate: ids(['FINN',16],['MILO',23],['NIA',25],['MILO',24],['STEWARD',8],['STEWARD',9],['FINN',17],['FINN',18],['MILO',25],['UI',8]),
 clean: range('NARRATOR',5,6),
 revealed: ids(['MILO',26],['NIA',26],['FINN',19],['MILO',27],['NIA',27],['FINN',20],['FINN',21],['MILO',28],['NIA',28]),
 chronicle: ids(['NARRATOR',7],['NARRATOR',8],['NIA',30],['MILO',30],['FINN',22],['NIA',31],['MILO',31],['FINN',23],['NARRATOR',9],['NARRATOR',10]),
 completion: [id('NARRATOR',11)]
};
export const events = {
 observed:['s01e01_old_map_fragment_documented','s01e01_blank_place_symbol_seen','s01_missing_place_mystery_open'],
 anchors:['s01e01_old_route_matches_town_square'],
 marker:['s01e01_town_square_old_marker_revealed','s01e01_old_route_points_toward_riverside'],
 complete:['episode_completed:s01e01']
};
export function fresh(mode='first_play', ledger=[]) {
 return {schemaVersion:1,contentVersion:VERSION,mode,phase:'preview',scene:'s01e01-sc00',ledger:[...ledger],checkpoint:'fresh',started:false,position:[.42,.77],location:null,inspected:[],physical:false,sketch:false,guess:null,anchors:[],cueOffered:false,cueCount:0,plateFound:false,markerRevealed:false,chroniclePresented:false,played:[],queue:[],after:null,hints:{},safe:null};
}
function checkpoint(s,key) {
 s.checkpoint=key;
 const {safe,queue,after,...local}=s;
 s.safe=structuredClone({...local,queue:[],after:null});
}
function emit(s,list) {if(s.mode==='first_play') s.ledger=[...new Set([...s.ledger,...list])];}
function enqueue(s,list,after=null,once=true) {
 const lines=once?list.filter(x=>!s.played.includes(x)):list;
 s.queue.push(...lines); if(once) s.played=[...new Set([...s.played,...lines])];
 if(after) s.after=after;
 if(!s.queue.length && s.after) completeQueue(s);
}
function scene(s,phase,num) {s.phase=phase;s.scene=`s01e01-sc0${num}`;}
function completeQueue(s) {
 const after=s.after;s.after=null;
 if(after==='opening') {scene(s,'square_explore',2);checkpoint(s,'cp_sc01_done');}
 if(after==='expose') {scene(s,'map_observe',3);checkpoint(s,'cp_map_exposed');enqueue(s,groups.observe);}
 if(after==='observe') {s.sketch=true;s.physical=true;emit(s,events.observed);scene(s,'square_compare',4);s.anchors=[];checkpoint(s,'cp_observation_done');enqueue(s,groups.compare);}
 if(after==='anchors') {emit(s,events.anchors);scene(s,'marker_search',5);checkpoint(s,'cp_anchors_verified');}
 if(after==='reveal') {s.markerRevealed=true;emit(s,events.marker);checkpoint(s,'cp_marker_revealed');enqueue(s,groups.revealed,'chronicle');}
 if(after==='chronicle') {scene(s,'chronicle_close',6);s.chroniclePresented=true;checkpoint(s,'cp_marker_revealed');enqueue(s,groups.chronicle);}
 if(after==='finish') {emit(s,events.complete);s.phase='completed';checkpoint(s,'cp_episode_completed');}
}
export function near(s,target) {const p=locations[target];return p&&Math.hypot(p[0]-s.position[0],p[1]-s.position[1])<.095;}
export function dispatch(state,action) {
 const s=structuredClone(state);
 if(action.type==='next') {s.queue.shift();if(!s.queue.length)completeQueue(s);return s;}
 if(action.type==='skip') {s.queue=[];completeQueue(s);return s;}
 if(action.type==='replayLine') {return s;} // presentation only, handled by audio adapter
 if(action.type==='move') {
  if(!['square_explore','square_compare','marker_search'].includes(s.phase))return s;
  s.position=action.target?locations[action.target]||s.position:walkableTarget(s.position,action.x,action.y);
  s.location=Object.keys(locations).find(x=>near(s,x))||null;return s;
 }
 if(s.queue.length)return s;
 if(action.type==='begin'&&s.phase==='preview') {s.started=true;scene(s,'opening',1);checkpoint(s,'started');enqueue(s,groups.opening,'opening');}
 if(action.type==='hold'&&s.phase==='square_explore'&&near(s,'board'))enqueue(s,groups.board,'expose');
 if(action.type==='ambient'&&s.phase==='square_explore'&&near(s,action.target)) {
  if(action.target==='fountain')enqueue(s,ids(['MILO',3],['FINN',2]));
  if(action.target==='large_tree')enqueue(s,ids(['NIA',2],['MILO',4]));
 }
 if(action.type==='inspect'&&s.phase==='map_observe'&&['line','blank_shape','layer_holes'].includes(action.region)) {
  if(s.inspected.includes(action.region))enqueue(s,[id('NIA',16)],null,false);
  else {
   s.inspected.push(action.region);if(action.region==='layer_holes')s.physical=true;
   if(!s.cueOffered){s.cueOffered=true;s.cueCount=1;}
   enqueue(s,groups[action.region]);
   if(s.inspected.length>=2)enqueue(s,groups.guessPrompt);
  }
 }
 if(action.type==='guess'&&s.phase==='map_observe'&&s.inspected.length>=2&&['A','B','C'].includes(action.choice)) {
  s.guess=action.choice;s.sketch=true;const fallback=s.physical?[]:groups.physical;s.physical=true;
  enqueue(s,[...groups[action.choice],...fallback,...groups.converge],'observe');
 }
 if(action.type==='compare'&&s.phase==='square_compare') {
  const target=['fountain','large_tree'].find(x=>near(s,x));
  if(target&&action.symbol===target&&!s.anchors.includes(target)) {
   s.anchors.push(target);enqueue(s,groups[target]);
   if(s.anchors.length===1)enqueue(s,groups.firstAnchor);
   else enqueue(s,groups.bothAnchors,'anchors');
  } else if(!target||action.symbol!==target)enqueue(s,groups.mismatch,null,false);
 }
 if(action.type==='findPlate'&&s.phase==='marker_search'&&near(s,'marker')&&!s.plateFound) {s.plateFound=true;enqueue(s,groups.plate);}
 if(action.type==='clean'&&s.phase==='marker_search'&&s.plateFound&&!s.markerRevealed)enqueue(s,groups.clean,'reveal');
 if(action.type==='inspectMarker'&&s.markerRevealed)enqueue(s,[id('MILO',29)],null,false);
 if(action.type==='finish'&&s.phase==='chronicle_close'&&s.chroniclePresented)enqueue(s,groups.completion,'finish');
 if(action.type==='help') {
  const key=s.plateFound?'cleaning':s.phase;const level=s.hints[key]||0;s.hints[key]=level+1;
  const hints={square_explore:ids(['STEWARD',4],['UI',1]),map_observe:ids(['UI',3],['UI',4],['NIA',17]),square_compare:ids(['UI',6],['UI',7],['NIA',24]),marker_search:ids(['UI',9],['NIA',29]),cleaning:[id('UI',10)]};
  const list=hints[key];if(list)enqueue(s,[list[Math.min(level,list.length-1)]],null,false);
 }
 return s;
}
export function projection(ledger) {return {markerVisible:ledger.includes(events.marker[0]),e02Unlocked:ledger.includes(events.complete[0]),chronicleAvailable:ledger.includes(events.complete[0])};}
export function payload(s,prefs={}) {
 if(s.mode==='historical_replay')return null;
 return {schemaVersion:1,contentVersion:VERSION,ledger:[...s.ledger],checkpoint:s.safe||fresh(),preferences:prefs};
}
export function restore(saved) {
 if(!saved||saved.schemaVersion!==1||saved.contentVersion!==VERSION||!Array.isArray(saved.ledger))return fresh();
 const s={...fresh(),...structuredClone(saved.checkpoint),ledger:[...new Set(saved.ledger)],mode:'first_play',queue:[],after:null};
 s.safe=structuredClone(saved.checkpoint);
 s.position=constrainToRoad(s.position?.[0],s.position?.[1]);
 if(s.phase==='opening'){s.queue=[...groups.opening];s.after='opening';}
 if(s.markerRevealed&&s.phase==='marker_search'){scene(s,'chronicle_close',6);s.chroniclePresented=true;}
 if(s.started&&s.phase!=='completed') {
  const start=s.markerRevealed?16:s.checkpoint==='cp_sc01_done'||s.checkpoint==='started'?12:14;
  s.recap=range('NARRATOR',start,start+1);
 }
 return s;
}
