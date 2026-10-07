import {GATES} from '../data/airportData.js';
import {CHECK_X,LANE_X} from '../scene/terminal.js';
const rnd=a=>a[Math.floor(Math.random()*a.length)],rand=(a,b)=>a+Math.random()*(b-a);
const gp=(gi,i)=>({x:GATES[gi].x+((i%3)-1)*.9,z:-13.4+Math.floor(i/3)*.9});
export function createPassengerSim(ctx){
 const P=ctx.passengers,fs=ctx.flightSim,seats=ctx.seats,stats={checked:0,bags:0};
 const cq=CHECK_X.map(()=>[]),lq=LANE_X.map(()=>[]),gq=GATES.map(()=>[]);
 ctx.gateQueue=id=>gq[GATES.findIndex(g=>g.id===id)].length;
 const set=(p,s)=>{p.state=s;p.t=0;};
 const place=(p,x,z)=>{p.g.position.set(x,0,z);p.g.visible=true;p.target=null;p.path=[];p.sitting=false;};
 const shortest=q=>q.reduce((b,_,i)=>q[i].length<q[b].length?i:b,0);
 const ring=()=>{const a=Math.random()*Math.PI*2;return {x:28+Math.cos(a)*6.6,z:6+Math.sin(a)*4.2};};
 function enter(p,seed){const c=shortest(cq);p.c=c;cq[c].push(p);p.bag.visible=true;p.flightNo=rnd(fs.flights).no;
  if(seed){place(p,CHECK_X[c]+rand(-.3,.3),12+cq[c].length*.95);set(p,'CHECK-IN');}else{place(p,rand(-3,3),26);set(p,'ENTERING');}}
 function toSecurity(p,seed){const l=shortest(lq);p.l=l;lq[l].push(p);set(p,'SECURITY');if(seed)place(p,LANE_X[l]+.9,3+lq[l].length*.95);}
 function toWaiting(p,seed){set(p,'WAITING');p.sub=1;p.wander=0;
  if(seed){const s=rnd(seats.filter(s=>!s.used));if(s){s.used=true;p.seat=s;place(p,s.x,s.z);p.target={x:s.x,z:s.z};p.sub=2;}else{place(p,rand(8,28),rand(-11,0));p.target={x:rand(8,30),z:rand(-11,12)};p.sub=3;}}}
 function toGate(p,seed){const b=fs.flights.filter(f=>f.status==='BOARDING'),f=b.length?rnd(b):(fs.flights.find(f=>f.no===p.flightNo)||fs.flights[0]);
  p.flightNo=f.no;p.gi=GATES.findIndex(g=>g.id===f.gate);gq[p.gi].push(p);p.go=false;set(p,'BOARDING');p.g.visible=true;
  if(seed){const s=gp(p.gi,gq[p.gi].length-1);place(p,s.x,s.z);}}
 function toArrival(p){const gi=Math.floor(Math.random()*GATES.length),gx=GATES[gi].x;place(p,gx,-18.6);p.bag.visible=false;p.flightNo=fs.flights[gi].no;set(p,'ARRIVING');
  p.target={x:gx,z:-10};p.path=[{x:(gx+28)/2,z:3},ring()];}
 function toBaggage(p,seed){set(p,'BAGGAGE CLAIM');p.wait=rand(8,14);p.bag.visible=false;if(seed){const r=ring();place(p,r.x,r.z);}}
 P.forEach((p,i)=>{const s=i%7;
  if(s<2)enter(p,true);else if(s===2)toSecurity(p,true);else if(s<5)toWaiting(p,true);else if(s===5)toGate(p,true);else{p.flightNo='SK118';toBaggage(p,true);}});
 function update(dt){
  P.forEach(p=>{
   switch(p.state){
    case 'ENTERING':case 'CHECK-IN':{const q=cq[p.c],i=q.indexOf(p);p.target={x:CHECK_X[p.c],z:11.8+i*.95};
     if(p.state==='ENTERING'&&p.g.position.z<17)p.state='CHECK-IN';
     if(i===0&&p.arrived){p.t+=dt;if(p.t>3.5){q.shift();stats.checked++;stats.bags++;toSecurity(p);}}else p.t=0;break;}
    case 'SECURITY':{const q=lq[p.l],i=q.indexOf(p),x=LANE_X[p.l]+.9;p.target={x,z:3+i*.95};
     if(i===0&&p.arrived){p.t+=dt;if(p.t>2.8){q.shift();set(p,'WAITING');p.sub=0;p.target={x,z:.2};p.path=[{x,z:-3.5}];}}else p.t=0;break;}
    case 'WAITING':{
     if(p.sub===0){if(p.arrived&&!p.path.length)p.sub=1;}
     if(p.sub===1){const s=Math.random()<.6?rnd(seats.filter(s=>!s.used)):null;
      if(s){s.used=true;p.seat=s;p.target={x:s.x,z:s.z};p.sub=2;}else{p.target={x:rand(8,30),z:rand(-11,12)};p.sub=3;p.t=0;}}
     else if(p.sub===2&&p.arrived){p.sitting=true;p.g.position.set(p.seat.x,-.1,p.seat.z+.05);p.g.rotation.y=Math.PI;p.sitFor=rand(9,18);p.t=0;p.sub=4;}
     else if(p.sub===3&&p.arrived){p.t+=dt;if(p.t>1.5){p.t=0;if(++p.wander<2)p.target={x:rand(8,30),z:rand(-11,12)};else toGate(p);}}
     else if(p.sub===4){p.t+=dt;if(p.t>p.sitFor){p.sitting=false;p.seat.used=false;p.seat=null;p.g.position.y=0;toGate(p);}}
     break;}
    case 'BOARDING':{const q=gq[p.gi],i=q.indexOf(p),gx=GATES[p.gi].x;
     if(p.go){if(p.arrived){p.g.visible=false;p.go=false;set(p,'DEPARTED');p.wait=rand(4,9);}break;}
     p.target=gp(p.gi,i);const f=fs.byGate(GATES[p.gi].id);p.t+=dt;
     if(i===0&&p.arrived&&(f.status==='BOARDING'||p.t>20)){q.shift();p.go=true;p.target={x:gx,z:-16};p.path=[{x:gx,z:-18.7}];}
     break;}
    case 'DEPARTED':p.t+=dt;if(p.t>p.wait)toArrival(p);break;
    case 'ARRIVING':if(p.arrived)toBaggage(p);break;
    case 'BAGGAGE CLAIM':p.t+=dt;if(p.t>p.wait){p.bag.visible=true;stats.bags++;set(p,'EXITING');p.target={x:15,z:14};p.path=[{x:2,z:18},{x:rand(-2,2),z:24}];}break;
    case 'EXITING':if(p.arrived)enter(p,false);break;
   }
  });
 }
 return {stats,update};
}
