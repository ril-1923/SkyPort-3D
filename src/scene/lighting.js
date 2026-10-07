import * as THREE from 'three';
export function buildLighting(ctx){
 const {scene}=ctx;
 const amb=new THREE.AmbientLight(0xffffff,.45),hemi=new THREE.HemisphereLight(0xbfe3ff,0x445566,.6);
 const sun=new THREE.DirectionalLight(0xfff2d6,2.4);sun.position.set(60,90,50);
 sun.castShadow=!ctx.lowPower;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0004;sun.shadow.normalBias=.4;
 Object.assign(sun.shadow.camera,{left:-120,right:120,top:100,bottom:-100,far:300});
 scene.add(amb,hemi,sun);
 const pts=[[-26,9,8],[-8,9,2],[14,9,-4],[30,9,6],[-20,9,-12],[26,9,-12]].map(p=>{const l=new THREE.PointLight(0xffe2b0,0,42,2);l.position.set(...p);scene.add(l);return l;});
 const spots=[-8,8].map(x=>{const s=new THREE.SpotLight(0xffd488,0,60,.6,.5,1.5);s.position.set(x,13,30);s.target.position.set(x,0,16);scene.add(s,s.target);return s;});
 const dayC=new THREE.Color(0xfff2d6),nightC=new THREE.Color(0x6f8cff);
 return {sun,update(n,dim){
  sun.intensity=(2.4*(1-n)+.35*n)*dim;sun.color.copy(dayC).lerp(nightC,n);
  amb.intensity=.45*(1-n)+.14*n;hemi.intensity=(.65*(1-n)+.12*n)*(.5+.5*dim);
  pts.forEach(l=>l.intensity=30+n*230);spots.forEach(s=>s.intensity=n*500);}};
}
