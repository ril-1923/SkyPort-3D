import * as THREE from 'three';
import {box,mat,geo,mesh,pick} from './util.js';
import {NAMES,NATIONS} from '../data/airportData.js';
const SKIN=[0xf1c9a5,0xd9a066,0x8d5524,0xc68642,0xffdbac];
const SHIRT=[0xe74c3c,0x3498db,0x2ecc71,0xf1c40f,0x9b59b6,0xecf0f1,0x1abc9c,0xe67e22,0x34495e,0xff6fa5];
const PANTS=[0x2c3e50,0x34495e,0x1f2d3d,0x6b4f3a,0x3b5b7a,0x222222];
const BAGC=[0xd32f2f,0x1976d2,0x388e3c,0xf9a825,0x6a1b9a,0x37474f,0xff7043,0x00acc1];
const rnd=a=>a[Math.floor(Math.random()*a.length)];
export function makePerson(shirt,pants,scale=1){
 const g=new THREE.Group(),skin=rnd(SKIN),hc=rnd([0x1b1b1b,0x4a2c17,0xb5651d,0xd8d8d8]),hs=Math.floor(Math.random()*3);
 const body=box(.5,.7,.28,mat(shirt),0,1.15,0,g);
 const head=new THREE.Group();head.position.set(0,1.7,0);g.add(head);
 mesh(geo('Sphere',.17,10,8),mat(skin),0,0,0,head);
 if(hs===0)mesh(geo('Sphere',.18,10,8,0,Math.PI*2,0,Math.PI/2),mat(hc),0,.02,0,head);
 else if(hs===1)box(.36,.1,.36,mat(hc),0,.13,0,head);
 else mesh(geo('Sphere',.19,10,8),mat(hc),0,.04,-.05,head);
 const limb=(w,h,m,x,y)=>{const p=new THREE.Group();p.position.set(x,y,0);g.add(p);box(w,h,w,m,0,-h/2,0,p);return p;};
 const parts={body,head,armL:limb(.12,.65,mat(shirt),-.33,1.48),armR:limb(.12,.65,mat(shirt),.33,1.48),legL:limb(.17,.8,mat(pants),-.13,.8),legR:limb(.17,.8,mat(pants),.13,.8)};
 g.scale.setScalar(scale);g.userData.parts=parts;return g;
}
function makeBag(){const g=new THREE.Group(),w=.35+Math.random()*.2,h=.45+Math.random()*.25;
 box(w,h,.22,mat(rnd(BAGC)),0,h/2,0,g);box(.04,.25,.04,mat(0x222222),0,h+.1,0,g);return g;}
export function buildPassengers(ctx,n=26){
 const list=[];
 for(let i=0;i<n;i++){
  const g=makePerson(rnd(SHIRT),rnd(PANTS),.9+Math.random()*.22),kind=['carry','roll','pack'][i%3],bag=makeBag();
  if(kind==='roll')bag.position.set(.45,0,-.55);else if(kind==='carry'){bag.position.set(.42,.1,.05);bag.scale.setScalar(.75);}else{bag.position.set(0,.95,-.28);bag.scale.setScalar(.55);}
  g.add(bag);
  const p={id:i,g,bag,kind,name:NAMES[i%NAMES.length],nation:rnd(NATIONS),speed:.9+Math.random()*.9,phase:Math.random()*6,state:'ENTERING',target:null,path:[],arrived:false,sitting:false,t:0,flightNo:''};
  pick(g,()=>({title:p.name,rows:[['Nationality',p.nation],['Flight',p.flightNo||'—'],['Status',p.state],['Luggage',kind==='roll'?'Rolling suitcase':kind==='carry'?'Carry bag':'Backpack']]}));
  ctx.scene.add(g);ctx.picks.push(g);list.push(p);
 }
 ctx.passengers=list;
 return {update(dt){list.forEach(p=>step(p,dt));}};
}
function step(p,dt){
 const g=p.g;if(!g.visible)return;const u=g.userData.parts;p.arrived=false;let mv=false;
 if(p.sitting){u.legL.rotation.x=u.legR.rotation.x=-1.45;u.armL.rotation.x=u.armR.rotation.x=-.5;p.phase+=dt;u.head.rotation.y=Math.sin(p.phase*.5)*.4;u.body.scale.y=1+Math.sin(p.phase*2)*.012;return;}
 if(p.target){
  const dx=p.target.x-g.position.x,dz=p.target.z-g.position.z,d=Math.hypot(dx,dz);
  if(d>.12){const s=Math.min(d,p.speed*dt);g.position.x+=dx/d*s;g.position.z+=dz/d*s;
   let da=Math.atan2(dx,dz)-g.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));g.rotation.y+=da*Math.min(1,dt*8);mv=true;}
  else if(p.path.length)p.target=p.path.shift();else p.arrived=true;
 }
 if(mv){p.phase+=dt*p.speed*6;const s=Math.sin(p.phase)*.7;u.legL.rotation.x=s;u.legR.rotation.x=-s;u.armL.rotation.x=-s*.8;u.armR.rotation.x=p.kind==='carry'?-.15:p.kind==='roll'?-.7:s*.8;}
 else{p.phase+=dt;u.legL.rotation.x=u.legR.rotation.x=u.armL.rotation.x=u.armR.rotation.x=0;u.head.rotation.y=Math.sin(p.phase*.7)*.3;u.body.scale.y=1+Math.sin(p.phase*2)*.012;}
}
