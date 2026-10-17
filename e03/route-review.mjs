import {actorHeight,spriteBox,activeOccluders,coverage} from './route-depth.mjs';
const data=await fetch('../content/season-01/s01e03/M1_ROUTE_REVIEW.json').then(r=>{if(!r.ok)throw Error('Missing M1 review data');return r.json();});
const $=s=>document.querySelector(s),canvas=$('#guide'),ctx=canvas.getContext('2d'),foreground=$('#foreground'),front=foreground.getContext('2d'),plate=$('#plate');
let art='m1',key='S',index=0,show=false,moving=false,token=0,currentFoot=data.start;
function limit(){const stop=data.routes[key].cartStopIndex;return $('#cart').checked&&stop!==null?stop:data.routes[key].points.length-1;}
function actor(p){
 currentFoot=p;const el=$('#actor'),contact=$('#contact'),height=actorHeight(p),width=height*spriteBox.width/spriteBox.height;
 el.style.left=contact.style.left=p[0]/16.72+'%';el.style.top=contact.style.top=p[1]/9.41+'%';
 el.style.width=width/16.72+'%';el.style.height=height/9.41+'%';
 el.dataset.footX=p[0];el.dataset.footY=p[1];el.dataset.sourceHeight=height;
 contact.style.width=width*.72/16.72+'%';contact.style.height=height*.04/9.41+'%';el.hidden=contact.hidden=art==='m0';
 const active=art==='m1'?activeOccluders(p):[],polygons=active.flatMap(o=>o.polygons);
 el.dataset.depth=active.map(o=>o.id).join(' ');el.classList.toggle('covered',coverage(p,polygons)>.68);
 front.clearRect(0,0,1672,941);if(art!=='m1'||!plate.complete||!plate.naturalWidth)return;
 for(const polygon of polygons){front.save();front.beginPath();polygon.forEach(([x,y],i)=>i?front.lineTo(x,y):front.moveTo(x,y));front.closePath();front.clip();front.drawImage(plate,0,0,1672,941);front.restore();}
}
function draw(){ctx.clearRect(0,0,1672,941);if(!show||art==='m0')return;const route=data.routes[key];ctx.lineWidth=6;ctx.strokeStyle='#fff5cf';ctx.setLineDash([12,9]);ctx.beginPath();route.points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.setLineDash([]);route.points.forEach(([x,y],i)=>{ctx.beginPath();ctx.fillStyle=i===index?'#b25d25':'#355d4e';ctx.arc(x,y,9,0,Math.PI*2);ctx.fill();});}
function render(){const r=data.routes[key],url=`../public/art/s01e03-market-lane-${art==='m1'?'m1-candidate':'m0'}.webp`;if(plate.getAttribute('src')!==url)plate.src=url;$('#route-name').textContent=art==='m0'?'M0 原始素材，未覆蓋修改':r.label+' · M1 腳點與遮擋檢視';$('#note').textContent=art==='m0'?'切回 M1 才會顯示針對修訂圖繪製的路線草案。':r.review;$('#position').textContent=`${index+1} / ${r.points.length} · 腳點 ${r.points[index].join(', ')}${$('#cart').checked&&index===limit()&&limit()<r.points.length-1?' · 推車停點草案':''}`;actor(r.points[index]);document.querySelectorAll('[data-art]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.art===art)));document.querySelectorAll('[data-route]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.route===key)));$('#guides').setAttribute('aria-pressed',String(show));$('#previous').disabled=moving||index===0||art==='m0';$('#next').disabled=moving||index>=limit()||art==='m0';$('#walk').disabled=moving||index>=limit()||art==='m0';draw();}
function stop(){token++;moving=false;}
async function walk(){if(moving||art==='m0')return;moving=true;const mine=++token;render();while(index<limit()&&mine===token){const a=data.routes[key].points[index],b=data.routes[key].points[index+1],duration=matchMedia('(prefers-reduced-motion: reduce)').matches?1:Math.max(180,Math.hypot(b[0]-a[0],b[1]-a[1])*5);await new Promise(resolve=>{const start=performance.now();function frame(t){if(mine!==token){resolve();return;}const u=Math.min(1,(t-start)/duration);actor(a.map((n,i)=>n+(b[i]-n)*u));if(u<1)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame);});if(mine!==token)return;index++;render();}moving=false;render();}
document.querySelectorAll('[data-art]').forEach(b=>b.onclick=()=>{stop();art=b.dataset.art;render();});
document.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>{stop();key=b.dataset.route;index=0;render();});
$('#next').onclick=()=>{index=Math.min(limit(),index+1);render();};$('#previous').onclick=()=>{index=Math.max(0,index-1);render();};$('#reset').onclick=()=>{stop();index=0;render();};$('#walk').onclick=walk;$('#guides').onclick=()=>{show=!show;render();};$('#cart').onchange=()=>{stop();index=Math.min(index,limit());render();};
function fit(){const frame=$('.frame');$('.world').style.width=Math.min(frame.clientWidth,frame.clientHeight*1672/941)+'px';}
plate.addEventListener('load',()=>actor(currentFoot));
new ResizeObserver(fit).observe($('.frame'));
render();fit();
