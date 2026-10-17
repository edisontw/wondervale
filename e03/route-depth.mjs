// Foreground occlusion remains review-only; no unvalidated wall/route masks ship.
// The actor-sizing curve is shared with E03 gameplay via perspective.mjs.
import {actorHeight,spriteBox} from './perspective.mjs';
export {actorHeight,spriteBox};
export function contains([x,y],polygon){
 let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const [ax,ay]=polygon[i],[bx,by]=polygon[j];
  if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
 }return inside;
}
export const occluders=[
 {id:'terrace-front',region:[[730,155],[1285,175],[1300,290],[740,275]],polygons:[
  // Foreground parapet cap/ivy follows the edge in the painting. Its lower
  // extent can be generous: source pixels outside the sprite remain identical.
  [[740,207],[781,196],[850,197],[930,201],[1002,211],[1080,225],[1165,242],[1255,264],[1290,286],[1293,342],[1170,319],[1080,282],[988,258],[875,249],[755,241]],
  // Individual wooden rails/posts leave their gaps transparent.
  [[783,165],[1018,169],[1018,179],[783,175]],
  [[790,158],[801,158],[802,202],[791,202]],
  [[850,159],[861,159],[861,205],[850,205]],
  [[925,160],[936,161],[937,212],[926,211]],
  [[1007,163],[1017,163],[1019,222],[1008,220]]
 ]},
 {id:'terrace-sign-pier',region:[[970,155],[1150,180],[1150,295],[975,275]],polygons:[
  [[1030,164],[1083,166],[1088,188],[1090,231],[1101,255],[1093,300],[1067,349],[1014,343],[1000,301],[1009,273],[1025,263],[1027,213]],
  [[1037,197],[1085,197],[1084,261],[1065,279],[1041,261]]
 ]},
 {id:'unloading-cargo',region:[[490,545],[890,545],[897,644],[500,644]],polygons:[
  [[502,680],[529,625],[566,617],[575,595],[610,596],[668,597],[713,605],[754,595],[798,608],[803,632],[826,632],[843,650],[870,651],[877,689],[846,701],[803,720],[756,732],[714,719],[664,732],[620,724],[568,715],[530,711]]
 ]},
 {id:'arcade-front-pier',region:[[935,445],[1110,442],[1130,550],[958,561]],polygons:[
  [[977,394],[1008,394],[1028,410],[1040,433],[1049,456],[1047,501],[1066,519],[1060,559],[1017,573],[993,559],[994,521],[989,455]],
  [[925,320],[980,333],[1025,357],[1054,394],[1076,429],[1041,449],[1014,416],[986,392],[956,376],[922,364]],
  [[1065,487],[1104,480],[1138,490],[1149,511],[1141,553],[1107,565],[1073,546]]
 ]},
 {id:'arcade-side-jamb',region:[[1100,410],[1210,415],[1212,534],[1100,534]],polygons:[
  [[1098,350],[1128,352],[1134,382],[1132,420],[1124,468],[1131,490],[1120,510],[1100,503],[1090,466],[1090,409]],
  [[1184,355],[1220,361],[1220,405],[1210,444],[1217,469],[1201,485],[1182,463],[1184,415]]
 ]}
];
export function activeOccluders(p){return occluders.filter(o=>contains(p,o.region));}
export function coverage(p,polygons){
 const h=actorHeight(p),w=h*spriteBox.width/spriteBox.height;
 let covered=0,total=0;
 for(let y=0;y<10;y++)for(let x=0;x<5;x++){
  const sample=[p[0]-w/2+(x+.5)*w/5,p[1]-h+(y+.5)*h/10];
  total++;if(polygons.some(poly=>contains(sample,poly)))covered++;
 }return covered/total;
}
