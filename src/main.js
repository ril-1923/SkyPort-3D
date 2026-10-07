import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import 'bootstrap';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createAirport,applyShadows} from './scene/airport.js';
import {buildLighting} from './scene/lighting.js';
import {buildPassengers} from './scene/passengers.js';
import {glowMats} from './scene/util.js';
import {createFlightSim} from './simulation/flightSimulation.js';
import {createPassengerSim} from './simulation/passengerSimulation.js';
import {createInfo} from './ui/informationPanel.js';
import {createDashboard} from './ui/dashboard.js';
import {bindControls,createSound} from './ui/controls.js';

const lowPower=matchMedia('(max-width:768px)').matches||/Mobi|Android/i.test(navigator.userAgent);
const canvas=document.getElementById('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:!lowPower,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,lowPower?1.5:2));
renderer.shadowMap.enabled=!lowPower;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
const scene=new THREE.Scene(),sky=new THREE.Color(0x8ec9ff);scene.background=sky;scene.fog=new THREE.FogExp2(0x8ec9ff,.0016);
const camera=new THREE.PerspectiveCamera(50,1,.5,900);camera.position.set(0,50,78);
const controls=new OrbitControls(camera,canvas);
Object.assign(controls,{enableDamping:true,dampingFactor:.08,maxPolarAngle:Math.PI*.495,minDistance:4,maxDistance:260,screenSpacePanning:true});controls.target.set(0,0,-10);

const flightSim=createFlightSim();
const ctx={scene,renderer,camera,picks:[],seats:[],flightSim,lowPower,aircraft:[]};
const light=buildLighting(ctx);
const airport=createAirport(ctx);
const crowd=buildPassengers(ctx);
ctx.sim=createPassengerSim(ctx);
applyShadows(scene,!lowPower);

// camera presets
const presets={overview:[[0,50,78],[0,0,-10]],checkin:[[-22,8,27],[-22,2,8]],security:[[0,9,19],[0,1,0]],lounge:[[16,9,9],[18,1,-10]],gates:[[0,9,-4],[0,3,-26]],baggage:[[12,8,19],[28,1,6]],exterior:[[-70,26,-68],[8,3,-38]]};
const tw={on:false,p:new THREE.Vector3(),t:new THREE.Vector3()};
const goTo=k=>{tw.p.set(...presets[k][0]);tw.t.set(...presets[k][1]);tw.on=true;};
controls.addEventListener('start',()=>{tw.on=false;});

const info=createInfo(),dash=createDashboard(ctx,camera,info);
const env={night:0,target:0,weather:'clear'};
bindControls({goTo,info,env,sound:createSound(flightSim),ctx,weather:airport.weather});

// picking
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();let down=null;
canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
canvas.addEventListener('pointerup',e=>{
 if(!down)return;const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;if(moved>6)return;
 const r=canvas.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);
 for(const h of ray.intersectObjects(ctx.picks,true)){let hidden=false,found=null;
  for(let o=h.object;o;o=o.parent){if(!o.visible)hidden=true;if(!found&&o.userData.pick)found=o;}
  if(!hidden&&found){const d=found.userData.pick();info.show(d.title,d.rows);return;}}
});

function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
addEventListener('resize',resize);resize();

const dayC=new THREE.Color(0x8ec9ff),nightC=new THREE.Color(0x050b1a),grey=new THREE.Color(0x7c8794),g2=new THREE.Color();
let fogD=.0016;
function applyEnv(dt){
 env.night+=(env.target-env.night)*Math.min(1,dt*1.8);const n=env.night,w=env.weather;
 sky.copy(dayC).lerp(nightC,n);if(w!=='clear'){g2.copy(grey).multiplyScalar(1-.8*n);sky.lerp(g2,w==='fog'?.7:.5);}
 scene.fog.color.copy(sky);fogD+=((w==='fog'?.013:w==='rain'?.005:.0016)-fogD)*Math.min(1,dt*2);scene.fog.density=fogD;
 light.update(n,w==='clear'?1:.55);glowMats.forEach(({m,day,night})=>{m.emissiveIntensity=day+(night-day)*n;});
}
const clock=new THREE.Clock();let t=0,fr=0;renderer.shadowMap.needsUpdate=true;
function loop(){
 requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05);t+=dt;
 flightSim.update(dt);applyEnv(dt);ctx.sim.update(dt);crowd.update(dt);airport.update(dt,t);
 if(tw.on){const k=1-Math.exp(-dt*3.2);camera.position.lerp(tw.p,k);controls.target.lerp(tw.t,k);if(camera.position.distanceTo(tw.p)<.15)tw.on=false;}
 controls.update();dash.update(dt);
 if(fr++%4===0)renderer.shadowMap.needsUpdate=true;
 renderer.render(scene,camera);
}
loop();
