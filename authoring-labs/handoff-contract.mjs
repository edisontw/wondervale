// Engineering-only evidence inventory. No episode unlock, persistence, history or release authority.
// These entries describe WHAT an isolated lab can demonstrate, not proof that the child completed it.
export const SCENES=Object.freeze([
  {id:'e04',episode:'s01e04',scene:'04',lab:null,engine:null,status:'blocked-design',
   evidence:'Two attributed memories and a reversible chronology are proposed, not approved or served here.',
   missing:'Owner-approved source attribution, chronology and genuine evidence cards'},
  {id:'e05',episode:'s01e05',scene:'05',lab:'/e05-prototype/',engine:'s01e05',
   evidence:'Synthetic two-mark replica alignment and a corridor-clear Map Room paper placement.',
   missing:'E04 approved handoff, station access/records, credible replica geometry and final art'},
  {id:'e06-current',episode:'s01e06',scene:'06',lab:'/e06-prototype/',engine:'s01e06',
   evidence:'Present-garden observations and a reversible synthetic dry/rain/channel comparison.',
   missing:'Canonical E05 checkpoint, approved terrain/records and current-garden scene art'},
  {id:'e06-lower',episode:'s01e06',scene:'07',lab:'/e06-prototype/',engine:'s01e06',
   evidence:'Same-lab observation/model prerequisite, lower-site path/runoff checks and a small pocket trial.',
   missing:'In-lab Current Garden tasks, actual planting permission/stewardship, geometry and art'},
  {id:'e07',episode:'s01e07',scene:'08',lab:'/e07-prototype/',engine:'s01e07',
   evidence:'Synthetic connector revision after resident/water-route conflicts.',
   missing:'Canonical E06 growth/checkpoint, permitted safe connector alignment and final art'},
  {id:'e08',episode:'s01e08',scene:'09',lab:'/e08-prototype/',engine:'s01e08',
   evidence:'Two synthetic lights and a two-viewpoint geometry comparison, not historical dating.',
   missing:'Canonical E07 handoff, lighting safety/rights, dated evidence and final art'},
  {id:'e09',episode:'s01e09',scene:'10',lab:'/e09-prototype/',engine:'s01e09',
   evidence:'Surveyed safe-model edges, a marked alternate route and an unidentified distant symbol.',
   missing:'Canonical E08 handoff, verified public path/slope safety, source and final art'},
  {id:'e10',episode:'s01e10',scene:'11',lab:'/e10-prototype/',engine:'s01e10',
   evidence:'Two undated synthetic traces, revisable hypotheses and two simulated resident needs.',
   missing:'Canonical E09 handoff, genuine Common name/source, access, representative needs and art'},
  {id:'e11',episode:'s01e11',scene:'12',lab:'/e11-prototype/',engine:'s01e11',
   evidence:'Revised fictional shared-space layout, two user tests and a fictional current safe-loop graph.',
   missing:'Canonical E10 evidence, site rights, safe loop, accepted design/art and family signoff'}
].map(s=>Object.freeze(s)));

export const HANDOFFS=Object.freeze([
  ['e04','e05','episode'],['e05','e06-current','episode'],
  ['e06-current','e06-lower','same-lab'],['e06-lower','e07','episode'],
  ['e07','e08','episode'],['e08','e09','episode'],
  ['e09','e10','episode'],['e10','e11','episode']
].map(([from,to,kind])=>Object.freeze({from,to,kind})));

const byId=new Map(SCENES.map(s=>[s.id,s]));
export function handoffAudit(){
  return HANDOFFS.map(edge=>{
    const source=byId.get(edge.from),target=byId.get(edge.to);
    return {
      from:edge.from,to:edge.to,kind:edge.kind,
      observedInLab:source.evidence,
      prerequisite:edge.kind==='same-lab'
        ?'Child must finish Current Garden observation and model comparison inside E06; menu selection never bypasses this.'
        :'Verified canonical upstream episode completion and an approved continuity event are NOT supplied by the isolated labs.',
      blockedBy:target.missing,
      productionEligible:false,canonicalEventIssued:false,unlockIssued:false,
      verdict:edge.kind==='same-lab'?'IN-LAB GATE ONLY — NOT A PRODUCTION UNLOCK':'NO CANONICAL HANDOFF'
    };
  });
}
export function sceneAudit(){
  return SCENES.map(s=>({...s,productionEligible:false,canonicalEventIssued:false,unlockIssued:false}));
}
