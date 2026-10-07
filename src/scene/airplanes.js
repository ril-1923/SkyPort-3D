import * as THREE from 'three';
import {box,cyl,mesh,geo,mat,glow,pick} from './util.js';
import {GATES,AIRLINES,AIRLINE_COLORS} from '../data/airportData.js';
import {Follower} from './vehicles.js';
export function makePlane(color){
 const g=new THREE.Group(),w=mat(0xf4f6f8),acc=mat(color),silver=mat(0xb8c4d0,{metalness:.7}),dk=mat(0x15191f);
 const F=(gm,m,x,y,z,rx)=>{const o=mesh(gm,m,x,y,z,g);if(rx)o.rotation.x=rx;return o;};
 F(geo('Cylinder',.9,.9,14,14),w,0,0,0,Math.PI/2);F(geo('Sphere',.9,12,8),w,0,0,7).scale.set(1,1,1.6);
 F(geo('Cylinder',.9,.3,3.2,12),w,0,.1,-8.5,Math.PI/2);
 box(1.84,.35,9,mat(0x1c2f45),0,.3,.5,g);box(16,.15,3.4,w,0,-.4,-.5,g);box(5.4,.12,1.6,w,0,.15,-9.4,g);box(.15,2.8,2.4,acc,0,1.9,-8.7,g);
 [-8,8].forEach(x=>box(.2,.5,.9,acc,x,-.2,-1.6,g));
 [-3.6,3.6].forEach(x=>F(geo('Cylinder',.5,.5,1.8,10),mat(0xaab3bd),x,-.85,.9,Math.PI/2));
 [[0,5],[-1.1,.4],[1.1,.4]].forEach(([x,z])=>{cyl(.07,.07,1.3,silver,x,-1.55,z,g);cyl(.28,.28,.25,dk,x,-2.15,z,g).rotation.z=Math.PI/2;});
 [[-8,-.3,-1.6,0xff2a2a],[8,-.3,-1.6,0x2aff5a],[0,3.3,-9,0xffffff]].forEach(([x,y,z,c])=>mesh(geo('Sphere',.2,6,4),glow(c,.8,3.5),x,y,z,g));
 return g;
}
export function buildAirplanes(ctx){
 const {scene,picks,flightSim:fs}=ctx;
 [['A01',0],['A03',2],['B02',4]].forEach(([id,ai])=>{
  const gt=GATES.find(g=>g.id===id),p=makePlane(AIRLINE_COLORS[ai]);p.position.set(gt.x,2.3,-38);scene.add(p);ctx.aircraft.push(p);
  pick(p,()=>{const f=fs.byGate(id);return {title:'Aircraft · '+AIRLINES[ai],rows:[['Flight',f.no],['Destination',f.dest],['Gate',id],['Status',f.status],['Type','Narrow-body jet']]};});picks.push(p);});
 const v=(x,y,z)=>new THREE.Vector3(x,y,z);
 const tp=makePlane(AIRLINE_COLORS[3]);scene.add(tp);ctx.aircraft.push(tp);
 const fol=new Follower(tp,[v(-95,2.3,-60),v(30,2.3,-60),v(30,2.3,-38),v(30,2.3,-60),v(110,2.3,-60)],6,{2:14});
 pick(tp,()=>({title:'Aircraft · AERO INDIA',rows:[['Flight',fs.byGate('B03').no],['Destination',fs.byGate('B03').dest],['Status',fol.w>0?'Docked at gate B03':'Taxiing'],['Gate','B03']]}));picks.push(tp);
 const tk=makePlane(AIRLINE_COLORS[1]);tk.rotation.order='YXZ';scene.add(tk);ctx.aircraft.push(tk);let ph=.2;
 pick(tk,()=>({title:'Aircraft · GLOBAL AIR',rows:[['Flight','GA 880'],['Status',ph>.55?'Climbing out':'Take-off roll'],['Altitude',Math.round(Math.max(0,tk.position.y-2.3)*30)+' ft']]}));picks.push(tk);
 return {update(dt){
  fol.update(dt);ph=(ph+dt/32)%1;tk.position.set(-150+300*ph,2.3+Math.pow(Math.max(0,ph-.55),1.6)*220,-80);tk.rotation.y=Math.PI/2;tk.rotation.x=ph>.55?-.3:0;}};
}
