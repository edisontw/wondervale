import {geometryAt} from '../engine/s01e08-authoring-prototype.mjs';

// Synthetic PAPER sightlines; never physical geometry, history or real lighting.
export function viewfinderFrame(anchor,lights){
 const geometry=geometryAt(anchor);
 if(!geometry||!lights||typeof lights!=='object'||Array.isArray(lights)||
   Object.keys(lights).sort().join(',')!=='lower-a,lower-b'||
   Object.values(lights).some(x=>typeof x!=='boolean'))return null;
 const lit=lights['lower-a']&&lights['lower-b'];
 if(!lit)return {anchor,lit:false,marks:[],spreadDegrees:null,
   label:'Both lower PAPER lamps are needed to inspect the model marks.'};
 const angles=geometry.angles.map(({id,angleDegrees})=>({id,angle:(angleDegrees+360)%360}));
 const sorted=[...angles].sort((a,b)=>a.angle-b.angle);
 let maxGap=-1,after=0;
 for(let i=0;i<sorted.length;i++){
  const next=i===sorted.length-1?sorted[0].angle+360:sorted[i+1].angle;
  const gap=next-sorted[i].angle;
  if(gap>maxGap){maxGap=gap;after=i;}
 }
 const start=sorted[(after+1)%sorted.length].angle;
 const values=angles.map(a=>(a.angle-start+360)%360);
 const center=(Math.min(...values)+Math.max(...values))/2;
 const marks=angles.map((a,i)=>({
  id:a.id,mark:'ABC'[i],
  x:Math.round((160+(values[i]-center)*3.2)*10)/10,y:30+i*44
 }));
 return {anchor,lit:true,marks,spreadDegrees:geometry.spreadDegrees,
  label:'Synthetic sightlines from '+anchor.replaceAll('-',' ')+
    '; apparent angular spread '+geometry.spreadDegrees.toFixed(1)+
    ' degrees; A B C remain fixed in the PAPER plan.'};
}
