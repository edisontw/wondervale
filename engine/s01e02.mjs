// E02 state machine and approved public route; separate from the E01 save key.
export const E01_KEY='wondervale-progress-v1';
export const KEY='wondervale-s01e02-progress-v1';
export const VERSION='s01e02-script-v1',BUILD='20261014-e02-notebook-compact3';
export const e01Ready=save=>Array.isArray(save?.ledger)&&['episode_completed:s01e01','s01e01_town_square_old_marker_revealed'].every(id=>save.ledger.includes(id));
export const places={spawn:[170,801],plaza:[453,786],oldSpurFork:[746,763],oldStones:[748,683],promenadeEast:[1030,772],publicSideFork:[1120,758],sidePathMiddle:[1214,711],lookoutEntry:[1322,676],lookoutView:[1407,667]};
export const edges=[['spawn','plaza'],['plaza','oldSpurFork'],['oldSpurFork','oldStones'],['oldSpurFork','promenadeEast'],['promenadeEast','publicSideFork'],['publicSideFork','sidePathMiddle'],['sidePathMiddle','lookoutEntry'],['lookoutEntry','lookoutView']];
export const EVENTS={lookout:'s01e02_riverside_overlook_accessible',revision:'s01e02_old_connection_changed_confirmed',market:'s01e02_market_lane_marker_recorded',finish:'episode_completed:s01e02'};
const id=(who,n)=>'S01E02-'+who+'-'+String(n).padStart(3,'0');
const pair=(...v)=>v.map(([who,n])=>id(who,n));
const range=(who,a,b)=>Array.from({length:b-a+1},(_,i)=>id(who,a+i));
export const speech={
 intro:pair(['NARRATOR',1],['NARRATOR',2],['UI',1],['NARRATOR',3],['MILO',1],['FINN',1],['NIA',1],['MILO',2],['MILO',3],['MILO',4],['NIA',2],['FINN',2],['UI',2]),
 stones:pair(['UI',3],['MILO',5],['NIA',3],['FINN',3],['NIA',4],['MILO',6]),
 closed:pair(['UI',4],['FINN',4],['NIA',5]),
 lookout:pair(['UI',5],['NARRATOR',4],['MILO',7],['FINN',5]),
 gap:pair(['UI',6],['MILO',8],['NIA',6],['FINN',6],['FINN',7],['NIA',7],['MILO',9]),
 map:pair(['UI',7],['NIA',8]),ambient:pair(['MILO',10],['FINN',8]),
 notebook:pair(['NIA',9],['MILO',11],['UI',8]),
 recovery:pair(['NIA',10],['FINN',9],['UI',9]),
 link:pair(['MILO',12],['MILO',13],['NIA',11],['FINN',10],['UI',10]),
 revisionA:range('MILO',14,16),revisionB:range('MILO',17,19),
 converge:pair(['NIA',12],['FINN',11],['MILO',20]),
 market:pair(['MILO',21],['UI',11],['NIA',13],['FINN',12],['FINN',13],['MILO',22],['NIA',14]),
 chronicle:[...range('NARRATOR',5,6),...range('NIA',15,16),id('MILO',23),id('FINN',14),id('NIA',17),...range('NARRATOR',7,8),id('UI',12)],
 hint:pair(['UI',13],['NIA',18],['NIA',19],['FINN',15],['UI',14]),
 recap:range('NARRATOR',9,10)
};
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
export function route(start,end){
 if(!(start in places)||!(end in places))return [];
 const adj=Object.fromEntries(Object.keys(places).map(k=>[k,[]]));
 for(const [a,b]of edges){const w=dist(places[a],places[b]);adj[a].push([b,w]);adj[b].push([a,w]);}
 const queue=new Set(Object.keys(places)),ds=Object.fromEntries([...queue].map(k=>[k,Infinity])),prev={};ds[start]=0;
 while(queue.size){const u=[...queue].reduce((a,b)=>ds[a]<=ds[b]?a:b);queue.delete(u);if(u===end||ds[u]===Infinity)break;
  for(const [v,w]of adj[u])if(queue.has(v)&&ds[u]+w<ds[v]){ds[v]=ds[u]+w;prev[v]=u;}}
 let cur=end;const nodes=[];while(cur){nodes.unshift(cur);if(cur===start)break;cur=prev[cur];}
 return nodes[0]===start?nodes:[];
}
const unique=a=>[...new Set(a)];
export const fresh=(mode='first_play')=>({schema:1,version:VERSION,mode,phase:'preview',position:'spawn',ledger:[],observed:[],linked:false,revised:false,market:false,started:false,visitedLookout:false,offeredCue:false,queue:[],after:null,played:[],view:'r0',lastFeedback:'',chronicleSeen:false});
export const projected=s=>({stones:s.observed.includes('stones'),gap:s.observed.includes('gap'),lookout:s.ledger.includes(EVENTS.lookout),revised:s.ledger.includes(EVENTS.revision),market:s.ledger.includes(EVENTS.market),completed:s.ledger.includes(EVENTS.finish)});
function enqueue(s,group,after=null,repeat=false){
 const lines=repeat?group:group.filter(x=>!s.played.includes(x));
 s.played=unique([...s.played,...lines]);s.queue.push(...lines);
 if(after)s.after=after;
 if(!s.queue.length&&s.after){s.phase=s.after;s.after=null;}
}
function emit(s,event){if(s.mode==='first_play'&&!s.ledger.includes(event))s.ledger.push(event);}
export function dispatch(before,action){
 const s=structuredClone(before);if(!action||typeof action.type!=='string')return s;
 if(action.type==='next'){if(s.queue.length)s.queue.shift();if(!s.queue.length&&s.after){s.phase=s.after;s.after=null;}return s;}
 if(s.queue.length)return s;
 switch(action.type){
 case 'begin':if(s.phase==='preview'){s.started=true;s.phase='intro';enqueue(s,speech.intro,'explore');}break;
 case 'go':
  if(!['explore','market'].includes(s.phase)||!(action.to in places)||!route(s.position,action.to).length)break;
  s.position=action.to;s.view='r0';
  if(action.to==='lookoutView'&&!s.visitedLookout){s.visitedLookout=true;emit(s,EVENTS.lookout);enqueue(s,speech.lookout);}
  break;
 case 'closed':
  if(s.phase==='explore'){s.position='oldStones';enqueue(s,speech.closed,null,true);}break;
 case 'inspect':
  if(s.phase!=='explore'||!['stones','gap'].includes(action.what))break;
  if((action.what==='stones'&&s.position!=='oldStones')||(action.what==='gap'&&s.position!=='lookoutView'))break;
  s.view=action.what==='stones'?'r1':'r2';
  if(!s.observed.includes(action.what)){s.observed.push(action.what);enqueue(s,speech[action.what]);}
  else s.lastFeedback='You have seen this evidence. Look again or choose another place.';
  break;
 case 'close-detail':
   // Camera-only return. Do not change observed evidence, position or ledger.
   if(s.phase==='explore'&&['r1','r2'].includes(s.view))s.view='r0';
   break;
  case 'map':if(s.phase==='explore'&&s.observed.length>0)enqueue(s,speech.map,null,true);break;
 case 'ambient':if(s.phase==='explore')enqueue(s,speech.ambient,null,true);break;
 case 'notebook':
  if(s.phase==='explore'&&s.observed.length===2){s.phase='notebook';s.view='r0';s.offeredCue=true;enqueue(s,speech.notebook);}break;
 case 'fact':
  if(s.phase!=='notebook'||s.observed.length!==2)break;
  if(action.choice==='stones'){s.lastFeedback='The stones tell us about before. What is here now?';enqueue(s,speech.recovery,null,true);}
  if(action.choice==='gap'){s.linked=true;s.lastFeedback='A gap today cannot be explained by the fence alone.';enqueue(s,speech.link,'revision');}break;
 case 'unsure':
  if(s.phase==='notebook'){
   // Offer the approved recovery dialogue without awarding an observation,
   // an evidence link, a revision, or any completion event.
   s.lastFeedback='Look at what was here before and what is missing now.';
   enqueue(s,speech.recovery,null,true);
  }else if(s.phase==='revision'){
   s.lastFeedback='It is fine to wonder. Compare what was and what is here now.';
   enqueue(s,[id('NIA',18),id('NIA',19)],null,true);
  }
  break;
 case 'revision':
  if(s.phase==='revision'&&s.linked&&['A','B'].includes(action.choice)){
   s.revised=true;emit(s,EVENTS.revision);s.view='r0';
   enqueue(s,[...speech[action.choice==='A'?'revisionA':'revisionB'],...speech.converge],'market');}
  break;
 case 'market':
  if(s.phase==='market'&&s.revised&&s.position==='lookoutView'&&!s.market){
   s.market=true;emit(s,EVENTS.market);enqueue(s,speech.market,'chronicle');}break;
 case 'chronicle':
  if(s.phase==='chronicle'&&s.market){s.chronicleSeen=true;enqueue(s,speech.chronicle);}break;
 case 'finish':
  if(s.phase==='chronicle'&&s.market&&s.chronicleSeen){emit(s,EVENTS.finish);s.phase='completed';s.view='r0';}break;
 }
 return s;
}
export function payload(s){
 if(s.mode==='historical_replay')return null;
 // Preserve unplayed dialogue and its phase transition through reload.
 return structuredClone(s);
}
export function restore(raw){
 if(!raw||raw.schema!==1||raw.version!==VERSION||!Array.isArray(raw.ledger)||!Array.isArray(raw.observed)||!(raw.position in places))return fresh();
 const s={...fresh(),...structuredClone(raw)};
 const allLines=new Set(Object.values(speech).flat());
 s.queue=Array.isArray(s.queue)?s.queue.filter(x=>allLines.has(x)).slice(0,100):[];
 s.after=['explore','revision','market','chronicle'].includes(s.after)?s.after:null;
 s.mode='first_play';
 s.ledger=unique(s.ledger.filter(x=>Object.values(EVENTS).includes(x)));
 s.observed=unique(s.observed.filter(x=>['stones','gap'].includes(x)));
 if(s.phase==='intro'&&!s.queue.length){s.played=[];enqueue(s,speech.intro,'explore',true);}
 return s;
}
