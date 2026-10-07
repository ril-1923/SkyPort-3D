import * as THREE from 'three';
import {box,cyl,mesh,geo,mat,glow,glass,label,pick,seatSet,makeBoard,boardMesh} from './util.js';
import {AIRLINES,AIRLINE_COLORS,SHOPS} from '../data/airportData.js';
import {makePerson} from './passengers.js';
export const CHECK_X=Array.from({length:8},(_,i)=>-35+i*3.8);
export const LANE_X=[-5,0,5];
const hex=c=>'#'+c.toString(16).padStart(6,'0');
export function buildTerminal(ctx){
 const {scene,picks,flightSim:fs}=ctx;const T=new THREE.Group();scene.add(T);
 const navy=mat(0x0d2b4e),white=mat(0xf4f7fb),silver=mat(0xb8c4d0,{metalness:.7,roughness:.3}),dark=mat(0x1b2430),amber=glow(0xffc247,.5,1.6);
 const hang=(x,y,z,w)=>[-1,1].forEach(s=>box(.12,12.4-y,.12,silver,x+s*w*.4,(12.4+y)/2,z,T));
 const rope=(x,z1,z2)=>[-.8,.8].forEach(s=>{[z1,z2].forEach(z=>cyl(.05,.05,1,silver,x+s,.5,z,T));box(.03,.03,Math.abs(z2-z1),amber,x+s,.9,(z1+z2)/2,T);});
 // shell
 box(82,.4,42,mat(0xdfe7ef,{roughness:.25,metalness:.2}),0,-.2,0,T).userData.noCast=true;
 box(26,.03,14,mat(0x1d3b5c),19,.02,-8,T).userData.noCast=true;
 box(84,.5,44,mat(0xbfe6ff,{transparent:true,opacity:.22,depthWrite:false}),0,12.5,0,T);
 for(let x=-40;x<=40;x+=8)box(.6,.8,44,navy,x,12,0,T);
 const strip=glow(0xfff1cf,.8,2.6);for(let x=-36;x<=36;x+=8)box(.5,.1,34,strip,x,11.5,0,T);
 box(80,12,.2,glass,0,6,-20,T);box(37,12,.2,glass,-21.5,6,20,T);box(37,12,.2,glass,21.5,6,20,T);box(.2,12,40,glass,-40,6,0,T);box(.2,12,40,glass,40,6,0,T);
 for(let x=-36;x<=36;x+=8){box(.5,12,.5,silver,x,6,20,T);box(.5,12,.5,silver,x,6,-20,T);}
 for(let z=-16;z<=16;z+=8){box(.5,12,.5,silver,-40,6,z,T);box(.5,12,.5,silver,40,6,z,T);}
 [-3,3].forEach(x=>box(.4,8,.4,navy,x,4,20,T));box(14,.4,6,navy,0,8.2,22,T);
 box(37,4,.5,navy,0,14.5,20.1,T);box(37,4,.5,navy,0,14.5,-20.1,T);
 const fs1=label('SKYPORT INTERNATIONAL AIRPORT',36,3,'#0b2d52','#ffc247');fs1.position.set(0,14.5,20.4);T.add(fs1);
 const fs2=label('SKYPORT INTERNATIONAL AIRPORT',36,3,'#0b2d52','#ffc247');fs2.position.set(0,14.5,-20.4);fs2.rotation.y=Math.PI;T.add(fs2);
 // check-in
 const ci=label('CHECK-IN',14,2.2,'#0b2d52','#ffc247');ci.position.set(-21,9,8.5);T.add(ci);hang(-21,10.1,8.5,14);
 CHECK_X.forEach((x,i)=>{
  box(3,1.1,1.2,white,x,.55,10,T);box(3.1,.1,1.3,navy,x,1.12,10,T);
  box(.9,.55,.06,glow(0x66e0ff,.8,2),x-.6,1.55,10.1,T).rotation.x=-.4;
  box(.6,.4,.4,mat([0xd32f2f,0x1976d2,0x388e3c,0xf9a825][i%4]),x+.8,1.4,10.2,T);
  const s=label(AIRLINES[i%5],2.8,.7,hex(AIRLINE_COLORS[i%5]));s.position.set(x,3.4,9.4);T.add(s);box(.08,3,.08,silver,x,1.6,9.4,T);
  rope(x,12.6,17.6);
  if(i%2===0){const a=makePerson(0x0d2b4e,0x1b1b1b,1);a.position.set(x,0,9.1);T.add(a);}
 });
 // security
 const sc=label('SECURITY CHECK',12,2,'#0b2d52','#ffc247');sc.position.set(0,8,4);T.add(sc);hang(0,9,4,12);
 const sb=new THREE.InstancedMesh(geo('Box',.5,.3,.4),mat(0x8c6a3f),9);sb.frustumCulled=false;T.add(sb);
 LANE_X.forEach(cx=>{
  box(1.2,.5,6,mat(0x222a33),cx-1.2,.3,-.5,T);box(1.8,1.6,1.8,mat(0x3a4756),cx-1.2,1.3,-.3,T);box(1.5,.9,.05,glow(0x7fd1ff,.5,1.6),cx-1.2,1.1,.62,T);
  [.2,1.6].forEach(dx=>box(.15,2.4,.5,glow(0x7fd1ff,.6,2),cx+dx,1.2,.2,T));box(1.6,.2,.5,glow(0x7fd1ff,.6,2),cx+.9,2.4,.2,T);
  const o=makePerson(0x1a2f5a,0x111111,1.05);o.position.set(cx+2.3,0,-.5);o.rotation.y=-Math.PI/2;T.add(o);
  rope(cx+.9,3.6,9);
 });
 // shops
 const shop=(def,x,z,ry)=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;T.add(g);
  box(6,5,.3,mat(def.color),0,2.5,-3,g);[-3,3].forEach(s=>box(.2,5,6,mat(0xe8eef5),s,2.5,0,g));box(6.2,.3,6.2,navy,0,5.1,0,g);
  box(3.6,1,1,white,0,.5,-1.2,g);box(3.8,.08,1.2,glow(0xffe2a8,.6,1.6),0,1.04,-1.2,g);
  for(let i=0;i<3;i++)box(1.6,.25,.5,white,-1.8+i*1.8,1.6+(i%2)*1.2,-2.7,g);
  const s=label(def.name,5.2,1.1,hex(def.color));s.position.set(0,4.4,3);g.add(s);
  pick(g,()=>({title:def.name,rows:[['Type',def.kind],['Hours',def.hours],['About',def.desc]]}));picks.push(g);};
 shop(SHOPS[0],36,-9,-Math.PI/2);shop(SHOPS[1],36,-2.5,-Math.PI/2);shop(SHOPS[2],36,4,-Math.PI/2);
 shop(SHOPS[3],-37,-12,Math.PI/2);shop(SHOPS[4],-37,-5,Math.PI/2);
 // info desk
 const idk=new THREE.Group();idk.position.set(10,0,12);T.add(idk);
 cyl(2,2,1.1,white,0,.55,0,idk);cyl(1.7,1.7,.05,glow(0x66e0ff,.6,1.8),0,1.12,0,idk);box(.08,2.5,.08,silver,0,2.3,0,idk);
 const il=label('INFORMATION',3.2,.8);il.position.set(0,3.8,0);idk.add(il);
 pick(idk,()=>({title:'Information Desk',rows:[['Services','Flight help, lost & found, maps'],['Hours','24 hours'],['Staff','4 agents on duty']]}));picks.push(idk);
 // plants
 [[-38,18],[38,18],[-12,18],[12,17],[-38,-17],[38,-17],[0,-17],[-20,-2],[22,-1],[-3,-12],[33,10],[-24,16]].forEach(([x,z])=>{
  cyl(.5,.4,.8,mat(0xd9dde2),x,.4,z,T);mesh(geo('Sphere',.65,8,6),mat(0x2e8b57),x,1.4,z,T);mesh(geo('Sphere',.45,8,6),mat(0x3aa66a),x+.3,2,z,T);});
 // lounge
 const pts=[];for(let r=0;r<3;r++)for(let c=0;c<10;c++)pts.push({x:9+c*2.2,z:-4-r*3.2});
 pts.forEach(p=>ctx.seats.push({x:p.x,z:p.z,used:false}));T.add(seatSet(pts));
 [12,20,28].forEach(x=>{cyl(.9,.9,.1,mat(0xe9edf2),x,.9,-.8,T);cyl(.1,.1,.9,silver,x,.45,-.8,T);[-1.3,1.3].forEach(d=>cyl(.4,.4,.5,mat(0xffc247),x+d,.25,-.8,T));});
 [7,31.4].forEach(x=>{box(.6,1.2,1.4,navy,x,.6,-7.2,T);box(.5,.05,1.2,glow(0x66ffcc,.7,2),x,1.22,-7.2,T);});
 // escalators + elevator
 [14,16.4].forEach(z=>{const r=box(8,.3,1.6,dark,35,2,z,T);r.rotation.z=.4;for(let i=0;i<9;i++)box(.12,.04,1.5,silver,-3.6+i*.9,.17,0,r);box(8,.9,.1,glass,35,2.7,z+.85,T).rotation.z=.4;});
 box(2.4,5,2.4,mat(0x9fd8ff,{transparent:true,opacity:.35,depthWrite:false}),-37.5,2.5,3,T);box(.05,3.6,1.6,glow(0xbfe8ff,.6,1.8),-36.25,1.9,3,T);
 [[-14,16],[-12.5,16.6],[18,15],[19.4,15.6]].forEach(([x,z])=>{box(1.6,.1,1,silver,x,.4,z,T);box(1.6,.9,.05,silver,x,.9,z-.5,T);[-.7,.7].forEach(s=>cyl(.09,.09,.2,dark,x+s,.12,z,T));});
 // boards
 const dep=makeBoard('DEPARTURES ✈',[['FLIGHT',24],['DESTINATION',150],['GATE',390],['STATUS',470]],()=>fs.flights.map(f=>[f.no,f.dest,f.gate,f.status]));
 [[12,8,2,true],[-20,6.5,-19.7,false]].forEach(([x,y,z,h])=>{const b=boardMesh(dep);b.position.set(x,y,z);T.add(b);if(h)hang(x,y+3.1,z-.3,8);
  pick(b,()=>({title:'Departures Board',rows:fs.flights.map(f=>[f.no+' → '+f.dest,f.gate+' · '+f.status])}));picks.push(b);});
 const dummy=new THREE.Object3D();let acc=9;
 return {update(dt,t){
  acc+=dt;if(acc>.45){acc=0;dep.draw(t);}
  for(let i=0;i<9;i++){const l=Math.floor(i/3);dummy.position.set(LANE_X[l]-1.2,.7,2.5-((t*.8+(i%3)*2)%6));dummy.updateMatrix();sb.setMatrixAt(i,dummy.matrix);}
  sb.instanceMatrix.needsUpdate=true;}};
}
