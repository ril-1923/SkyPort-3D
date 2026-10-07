import * as THREE from 'three';
import {box,cyl,mesh,geo,mat,pick} from './util.js';
export class Follower{
 constructor(o,pts,speed,hold={}){this.o=o;this.pts=pts;this.sp=speed;this.hold=hold;this.i=0;this.w=0;this.d=new THREE.Vector3();
  o.position.copy(pts[0]);o.rotation.y=Math.atan2(pts[1].x-pts[0].x,pts[1].z-pts[0].z);}
 update(dt){
  if(this.w>0){this.w-=dt;return;}
  const o=this.o,b=this.pts[this.i+1];this.d.subVectors(b,o.position);const L=this.d.length(),s=this.sp*dt;
  if(L>.001){let da=Math.atan2(this.d.x,this.d.z)-o.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));o.rotation.y+=da*Math.min(1,dt*3);}
  if(L<=s){o.position.copy(b);this.i++;this.w=this.hold[this.i]||0;if(this.i>=this.pts.length-1){this.i=0;o.position.copy(this.pts[0]);}}
  else o.position.addScaledVector(this.d,s/L);
 }
}
function body({c,w=2,l=4.5,h=1.2,win=0,tank=0}){
 const g=new THREE.Group(),M=mat(c);
 if(tank){box(w,.6,l,M,0,.7,0,g);mesh(geo('Cylinder',.9,.9,l*.7,16),mat(0xf2f2f2),0,1.7,-.4,g).rotation.x=Math.PI/2;box(w,1.3,1.2,M,0,1.05,l/2-.7,g);}
 else{box(w,h,l,M,0,.4+h/2,0,g);if(win)box(w+.04,.7,l*.8,mat(0x15222f),0,.4+h*.65,0,g);else box(w*.9,h*.6,l*.4,mat(0xcfe6f7),0,.4+h+h*.3,l*.15,g);}
 [[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([a,b])=>cyl(.4,.4,.3,mat(0x111111),a*w/2,.4,b*l*.32,g).rotation.z=Math.PI/2);
 return g;
}
export function buildVehicles(ctx){
 const V=new THREE.Group();ctx.scene.add(V);const fol=[];const v=(x,z)=>new THREE.Vector3(x,0,z);
 const veh=(o,pts,sp,title,rows)=>{V.add(o);fol.push(new Follower(o,pts,sp));pick(o,()=>({title,rows}));ctx.picks.push(o);};
 veh(body({c:0xffc247,w:2.6,l:9,h:2.1,win:1}),[v(-110,35),v(110,35)],6,'Airport shuttle bus',[['Route','Terminal 1 ↔ Car park'],['Status','In service'],['Capacity','45 passengers']]);
 veh(body({c:0xf7d000,w:1.8,l:4.2,h:1}),[v(110,30.5),v(-110,30.5)],5,'Airport taxi',[['Status','Available'],['Destination','City centre']]);
 const train=new THREE.Group();const tr=body({c:0x2e7d32,w:1.6,l:2.2,h:1});tr.position.z=1.6;train.add(tr);
 [-1.4,-4.4].forEach(z=>{box(1.8,.4,2.6,mat(0x555e68),0,.5,z,train);for(let i=0;i<3;i++)box(.6,.4,.5,mat([0xd32f2f,0x1976d2,0xf9a825][i]),(i-1)*.5,.9,z,train);});
 veh(train,[v(-80,-27),v(80,-27)],4,'Baggage cart train',[['Cargo','Passenger luggage'],['Destination','Aircraft hold']]);
 veh(body({c:0xe53935,w:2.2,l:6,tank:1}),[v(80,-29.5),v(-80,-29.5)],3,'Fuel truck',[['Cargo','Jet A-1 fuel'],['Status','Heading to aircraft']]);
 veh(body({c:0xff7a1a,w:2,l:4.6,h:1.4}),[v(-80,-50),v(80,-50)],4.5,'Service vehicle',[['Role','Ramp operations'],['Status','On patrol']]);
 veh(body({c:0x1e88e5,w:1.8,l:3.2,h:1.1}),[v(80,-52),v(-80,-52)],3.5,'Ground support unit',[['Role','Ground power unit'],['Status','En route']]);
 return {update(dt){fol.forEach(f=>f.update(dt));}};
}
