import {FLIGHTS0,DESTS} from '../data/airportData.js';
const rnd=a=>a[Math.floor(Math.random()*a.length)];
export function createFlightSim(){
 const flights=FLIGHTS0.map(f=>({...f})),stats={today:12},fns=[];let t=0;
 const step=()=>{const f=rnd(flights);
  if(f.status==='ON TIME')f.status=Math.random()<.2?'DELAYED':'BOARDING';
  else if(f.status==='DELAYED')f.status='ON TIME';
  else if(f.status==='BOARDING'){f.status='DEPARTED';stats.today++;}
  else{f.status='ON TIME';f.no='SK'+(100+Math.floor(Math.random()*880));f.dest=rnd(DESTS);}
  fns.forEach(fn=>fn(f));};
 return {flights,stats,byGate:id=>flights.find(f=>f.gate===id),on:fn=>fns.push(fn),update(dt){t+=dt;if(t>7){t=0;step();}}};
}
