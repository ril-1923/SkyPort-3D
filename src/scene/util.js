import * as THREE from 'three';
import {STATUS_COLORS} from '../data/airportData.js';
const mats={},geos={};
export const mat=(c,o={})=>{const k=c+JSON.stringify(o);return mats[k]||(mats[k]=new THREE.MeshStandardMaterial({color:c,roughness:.6,metalness:.15,...o}));};
export const geo=(t,...a)=>geos[t+a]||(geos[t+a]=new THREE[t+'Geometry'](...a));
export const mesh=(g,m,x=0,y=0,z=0,p)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p&&p.add(o);return o;};
export const box=(w,h,d,m,x,y,z,p)=>mesh(geo('Box',w,h,d),m,x,y,z,p);
export const cyl=(rt,rb,h,m,x,y,z,p)=>mesh(geo('Cylinder',rt,rb,h,14),m,x,y,z,p);
export const glowMats=[];
export const glow=(c,day=.7,night=2.2)=>{const m=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:day});glowMats.push({m,day,night});return m;};
export const glass=new THREE.MeshStandardMaterial({color:0x9fd8ff,transparent:true,opacity:.2,roughness:.05,metalness:.4,depthWrite:false});
export const pick=(o,get)=>{o.userData.pick=get;return o;};
export function label(text,w,h,bg='#0b2d52',fg='#ffffff'){
 const c=document.createElement('canvas');c.width=1024;c.height=Math.max(48,Math.round(1024*h/w));const g=c.getContext('2d');
 g.fillStyle=bg;g.fillRect(0,0,1024,c.height);let s=c.height*.62;g.font=`bold ${s}px Arial`;
 while(g.measureText(text).width>950&&s>8){s-=2;g.font=`bold ${s}px Arial`;}
 g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';g.fillText(text,512,c.height/2+2);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
 return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,toneMapped:false,side:THREE.DoubleSide}));
}
export function seatSet(pts,color=0x1d4f8a){
 const g=new THREE.Group(),n=pts.length,m=new THREE.Matrix4();
 const a=new THREE.InstancedMesh(geo('Box',1.5,.35,1.2),mat(color),n),b=new THREE.InstancedMesh(geo('Box',1.5,.9,.2),mat(color),n);
 pts.forEach((p,i)=>{a.setMatrixAt(i,m.makeTranslation(p.x,.45,p.z));b.setMatrixAt(i,m.makeTranslation(p.x,.9,p.z+.55));});
 a.frustumCulled=b.frustumCulled=false;g.add(a,b);return g;
}
export function makeBoard(title,cols,rows){
 const c=document.createElement('canvas');c.width=640;c.height=400;const g=c.getContext('2d'),tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
 const m=new THREE.MeshBasicMaterial({map:tex,toneMapped:false});
 const draw=t=>{
  g.fillStyle='#04101f';g.fillRect(0,0,640,400);g.fillStyle='#ffc247';g.font='bold 40px Arial';g.fillText(title,24,56);
  g.font='bold 20px monospace';g.fillStyle='#6fb5ff';cols.forEach(([n,x])=>g.fillText(n,x,100));
  rows(t).forEach((r,i)=>{const y=145+i*42;g.font='bold 24px monospace';
   r.forEach((v,j)=>{const last=j===r.length-1;g.fillStyle=last?(STATUS_COLORS[v]||'#fff'):'#fff';
    if(last&&v==='BOARDING'&&Math.floor(t*2)%2)g.fillStyle='#0b3d22';g.fillText(String(v).toUpperCase(),cols[j][1],y);});
   g.fillStyle='rgba(111,181,255,.2)';g.fillRect(20,y+10,600,1);});
  g.fillStyle='rgba(120,200,255,.07)';g.fillRect(0,(t*90)%400,640,8);tex.needsUpdate=true;};
 return {m,draw};
}
export function boardMesh(b,w=10,h=6.25){const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.PlaneGeometry(w,h),b.m));box(w+.4,h+.4,.3,mat(0x0b1a2e),0,0,-.18,g);return g;}
