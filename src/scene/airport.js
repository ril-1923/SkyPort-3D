import * as THREE from 'three';
import {box,cyl,mesh,geo,mat,glow} from './util.js';
import {buildTerminal} from './terminal.js';
import {buildGates} from './gates.js';
import {buildAirplanes} from './airplanes.js';
import {buildVehicles} from './vehicles.js';
import {buildBaggage} from './baggage.js';
function inst(g,m,pts){const im=new THREE.InstancedMesh(g,m,pts.length),mx=new THREE.Matrix4();pts.forEach((p,i)=>im.setMatrixAt(i,mx.makeTranslation(...p)));im.frustumCulled=false;return im;}
function buildWeather(ctx){
 const N=1800,pos=new Float32Array(N*3);
 for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*190;pos[i*3+1]=Math.random()*50;pos[i*3+2]=(Math.random()-.5)*190-20;}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const rain=new THREE.Points(g,new THREE.PointsMaterial({color:0xb6cde6,size:.22,transparent:true,opacity:.75,depthWrite:false}));rain.visible=false;rain.frustumCulled=false;ctx.scene.add(rain);
 return {mode:'clear',set(m){this.mode=m;rain.visible=m==='rain';},
  update(dt){if(!rain.visible)return;for(let i=0;i<N;i++){let y=pos[i*3+1]-48*dt,x=pos[i*3]-5*dt;if(y<0)y+=50;if(x<-95)x+=190;pos[i*3+1]=y;pos[i*3]=x;}g.attributes.position.needsUpdate=true;}};
}
export function createAirport(ctx){
 const {scene}=ctx,flat=o=>{o.userData.noCast=true;return o;};
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(900,700),mat(0x4d7c4f,{roughness:1,metalness:0}));ground.rotation.x=-Math.PI/2;ground.position.y=-.1;scene.add(flat(ground));
 flat(box(240,.1,34,mat(0x8e98a3,{roughness:.9}),0,.0,-37,scene));
 flat(box(320,.08,8,mat(0x4d555e,{roughness:.9}),0,.02,-60,scene));
 flat(box(340,.08,14,mat(0x2f353c,{roughness:.9}),0,.02,-80,scene));
 flat(box(240,.06,12,mat(0x2d343c,{roughness:.9}),0,.03,33,scene));
 const dashes=[];for(let x=-150;x<=150;x+=20)dashes.push([x,.08,-80]);scene.add(inst(geo('Box',8,.02,.5),mat(0xffffff),dashes));
 const rl=[],tl=[];for(let x=-150;x<=150;x+=10){rl.push([x,.3,-86.6],[x,.3,-73.4]);tl.push([x,.25,-64.4],[x,.25,-55.6]);}
 scene.add(inst(geo('Sphere',.28,6,4),glow(0xffffff,.35,3.6),rl),inst(geo('Sphere',.2,6,4),glow(0x3b82f6,.25,3),tl));
 [-60,-30,30,60].forEach(x=>{cyl(.15,.15,9,mat(0x667788),x,4.5,-53,scene);mesh(geo('Sphere',.5,8,6),glow(0xfff3c4,.4,3),x,9.2,-53,scene);});
 const tw=new THREE.Group();tw.position.set(-75,0,-45);scene.add(tw);
 cyl(1.4,2,26,mat(0xdfe6ee),0,13,0,tw);cyl(3.6,2.4,3.4,mat(0x7fb2d9,{transparent:true,opacity:.6}),0,27,0,tw);cyl(4,4,.4,mat(0x0d2b4e),0,29,0,tw);mesh(geo('Sphere',.4,6,4),glow(0xff3030,.8,4),0,30.2,0,tw);
 ctx.aircraft=[];
 const mods=[buildTerminal(ctx),buildGates(ctx),buildAirplanes(ctx),buildVehicles(ctx),buildBaggage(ctx)];
 const weather=buildWeather(ctx);
 return {weather,update(dt,t){mods.forEach(m=>m.update&&m.update(dt,t));weather.update(dt);}};
}
export function applyShadows(scene,on){
 scene.traverse(o=>{if(!o.isMesh)return;const m=o.material,basic=m.isMeshBasicMaterial||m.transparent;
  o.castShadow=on&&!basic&&!o.userData.noCast;o.receiveShadow=on&&!m.isMeshBasicMaterial;});
}
