import * as THREE from 'three';
import {box,cyl,mesh,geo,mat,glow,label,pick,seatSet} from './util.js';
import {GATES,STATUS_COLORS} from '../data/airportData.js';
export function buildGates(ctx){
 const G=new THREE.Group();ctx.scene.add(G);const fs=ctx.flightSim,draws=[];
 GATES.forEach(gt=>{
  const g=new THREE.Group();g.position.x=gt.x;G.add(g);
  const s=label('GATE '+gt.id,4,1,'#0b2d52','#ffc247');s.position.set(0,7,-19.6);g.add(s);
  box(3.6,4.2,.3,mat(0x0b2d52),0,2.1,-19.75,g);box(3,3.8,.1,glow(0x8fe0ff,.6,1.8),0,2,-19.55,g);
  const c=document.createElement('canvas');c.width=256;c.height=96;const x=c.getContext('2d'),tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;
  const dm=new THREE.Mesh(new THREE.PlaneGeometry(3.6,1.35),new THREE.MeshBasicMaterial({map:tx,toneMapped:false}));dm.position.set(0,5.4,-19.55);g.add(dm);
  draws.push(()=>{const f=fs.byGate(gt.id);x.fillStyle='#04101f';x.fillRect(0,0,256,96);x.fillStyle='#fff';x.font='bold 28px monospace';
   x.fillText(f.no+' '+f.dest.slice(0,8).toUpperCase(),8,36);x.fillStyle=STATUS_COLORS[f.status];x.font='bold 34px monospace';x.fillText(f.status,8,78);tx.needsUpdate=true;});
  mesh(geo('Plane',4,2.4),mat(0xffc247,{transparent:true,opacity:.3}),0,.03,-12.6,g).rotation.x=-Math.PI/2;
  box(3.2,3,11,mat(0xaab6c4),0,4.2,-25.5,g);cyl(.25,.25,2.7,mat(0x8795a5),0,1.35,-29,g);
  G.add(seatSet([-3.3,-1.1,1.1,3.3].map(dx=>({x:gt.x+dx,z:-15.8}))));
  pick(g,()=>{const f=fs.byGate(gt.id);return {title:'Gate '+gt.id,rows:[['Flight',f.no],['Destination',f.dest],['Status',f.status],['Passengers queued',ctx.gateQueue?ctx.gateQueue(gt.id):'—']]};});
  ctx.picks.push(g);
 });
 const redraw=()=>draws.forEach(d=>d());fs.on(redraw);redraw();
 return {};
}
