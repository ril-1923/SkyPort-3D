import * as THREE from 'three';
import {GATES} from '../data/airportData.js';
export function createDashboard(ctx,camera,info){
 const $=id=>document.getElementById(id),cv=$('mapc'),g=cv.getContext('2d'),W=cv.width,H=cv.height;
 const X=x=>(x+110)/220*W,Z=z=>(z+100)/150*H,R=(a,b,c,d)=>[X(a),Z(b),X(c)-X(a),Z(d)-Z(b)];
 const bg=document.createElement('canvas');bg.width=W;bg.height=H;
 {const b=bg.getContext('2d');b.fillStyle='#0b2236';b.fillRect(0,0,W,H);
  b.fillStyle='#39464f';b.fillRect(...R(-110,-87,110,-73));b.fillStyle='#223a50';b.fillRect(...R(-110,-54,110,-20));
  b.fillStyle='#1d5f95';b.fillRect(...R(-40,-20,40,20));b.fillStyle='#ffc247';GATES.forEach(t=>b.fillRect(X(t.x)-2,Z(-18),4,3));
  b.fillStyle='#35e07a';b.fillRect(...R(-37,8,-8,12));b.fillStyle='#ff7a5a';b.fillRect(...R(-8,-3,8,3));b.fillStyle='#b58cff';b.beginPath();b.arc(X(28),Z(6),6,0,7);b.fill();
  b.fillStyle='#fff';b.font='8px sans-serif';b.fillText('RUNWAY',6,Z(-79));b.fillText('GATES',X(-12),Z(-22));b.fillText('CHECK-IN',X(-36),Z(7));b.fillText('SEC',X(-4),Z(-5));b.fillText('BAGGAGE',X(20),Z(-2));}
 const dir=new THREE.Vector3();let a1=9,a2=9;
 return {update(dt){
  a1+=dt;a2+=dt;
  if(a2>.08){a2=0;g.drawImage(bg,0,0);g.fillStyle='#fff';ctx.aircraft.forEach(o=>g.fillRect(X(o.position.x)-2.5,Z(o.position.z)-2.5,5,5));
   g.fillStyle='#6fe3ff';ctx.passengers.forEach(p=>{if(p.g.visible)g.fillRect(X(p.g.position.x),Z(p.g.position.z),1.5,1.5);});
   camera.getWorldDirection(dir);g.save();g.translate(X(camera.position.x),Z(camera.position.z));g.rotate(-Math.atan2(dir.x,dir.z));g.fillStyle='#ffc247';g.beginPath();g.moveTo(0,8);g.lineTo(-5,-3);g.lineTo(5,-3);g.fill();g.restore();}
  if(a1>.5){a1=0;const P=ctx.passengers,st=ctx.sim.stats,fl=ctx.flightSim.flights,bd=fl.filter(f=>f.status==='BOARDING').length;
   const inT=P.filter(p=>p.state!=='DEPARTED').length,boarding=P.filter(p=>p.state==='BOARDING').length;
   $('s-fl').textContent=fl.filter(f=>f.status!=='DEPARTED').length+ctx.aircraft.length-3;$('s-pa').textContent=inT;$('s-ba').textContent=st.bags;$('s-ga').textContent=GATES.length-bd;
   info.setSim([['Passengers in Terminal',inT],['Passengers Checked In',st.checked],['Passengers Boarding',boarding],['Flights Today',ctx.flightSim.stats.today],['Flights Boarding',bd],['Bags Processed',st.bags]]);}
 }};
}
