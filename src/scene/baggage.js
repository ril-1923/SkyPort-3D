import * as THREE from 'three';
import {box,cyl,mat,geo,label,pick,makeBoard,boardMesh} from './util.js';
const BAGC=[0xd32f2f,0x1976d2,0x388e3c,0xf9a825,0x6a1b9a,0x37474f,0xff7043,0x00acc1];
export function buildBaggage(ctx){
 const {scene,picks}=ctx,G=new THREE.Group();G.position.set(28,0,6);scene.add(G);
 const L=8,R=1.8,P=2*L+2*Math.PI*R,belt=mat(0x20272f),sil=mat(0xb8c4d0,{metalness:.6,roughness:.3});
 box(L,.6,2*(R+.9),belt,0,.3,0,G);[-1,1].forEach(s=>cyl(R+.9,R+.9,.6,belt,s*L/2,.3,0,G));
 box(L,.7,2*(R-.9),sil,0,.35,0,G);[-1,1].forEach(s=>cyl(R-.9,R-.9,.7,sil,s*L/2,.35,0,G));
 const lb=label('BAGGAGE CLAIM',9,1.8);lb.position.set(0,8,0);G.add(lb);[-3.6,3.6].forEach(x=>box(.12,4.4,.12,sil,x,10.2,0,G));
 const N=14,im=new THREE.InstancedMesh(geo('Box',1,1,1),mat(0xffffff),N),col=new THREE.Color(),sc=[],d=new THREE.Object3D();im.frustumCulled=false;
 for(let i=0;i<N;i++){sc.push([.5+Math.random()*.4,.35+Math.random()*.25,.3+Math.random()*.2]);im.setColorAt(i,col.setHex(BAGC[i%8]));}
 G.add(im);
 const path=s=>{s%=P;if(s<L)return [-L/2+s,-R,0];s-=L;if(s<Math.PI*R){const a=s/R;return [L/2+Math.sin(a)*R,-Math.cos(a)*R,a];}
  s-=Math.PI*R;if(s<L)return [L/2-s,R,Math.PI];s-=L;const a=s/R;return [-L/2-Math.sin(a)*R,R*Math.cos(a),Math.PI+a];};
 pick(G,()=>({title:'Baggage Carousel 1',rows:[['Flight','SK118 · Bengaluru'],['Status','Belt running'],['Bags on belt',N],['Bags processed',ctx.sim?ctx.sim.stats.bags:0]]}));picks.push(G);
 const ARR=[['SK118','Bengaluru'],['SK342','Frankfurt'],['SK507','Colombo'],['SK633','Abu Dhabi']],ST=['LANDED','ON BELT','EXPECTED'];
 const ab=makeBoard('ARRIVALS ✈',[['FLIGHT',24],['FROM',150],['BELT',390],['STATUS',470]],t=>ARR.map((r,i)=>[r[0],r[1],i%2+1,ST[(Math.floor(t/8)+i)%3]]));
 const am=boardMesh(ab);am.position.set(39.5,6,10);am.rotation.y=-Math.PI/2;scene.add(am);
 pick(am,()=>({title:'Arrivals Board',rows:ARR.map((r,i)=>[r[0]+' ← '+r[1],'Belt '+(i%2+1)])}));picks.push(am);
 let acc=9;
 return {update(dt,t){
  acc+=dt;if(acc>.5){acc=0;ab.draw(t);}
  for(let i=0;i<N;i++){const [x,z,h]=path(t*.9+i*P/N);d.position.set(x,.7+sc[i][1]/2,z);d.rotation.set(0,-h,0);d.scale.set(sc[i][0],sc[i][1],sc[i][2]);d.updateMatrix();im.setMatrixAt(i,d.matrix);}
  im.instanceMatrix.needsUpdate=true;}};
}
