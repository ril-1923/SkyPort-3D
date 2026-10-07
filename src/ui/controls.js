export function createSound(fs){
 let ac,master,src,timer,on=false;
 function chime(){[659,523].forEach((f,i)=>{const o=ac.createOscillator(),gn=ac.createGain(),t=ac.currentTime+i*.45;o.frequency.value=f;gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(.25,t+.05);gn.gain.exponentialRampToValueAtTime(.001,t+.9);o.connect(gn).connect(master);o.start(t);o.stop(t+1);});}
 function announce(){chime();const f=fs.flights.find(f=>f.status==='BOARDING');
  if(f&&'speechSynthesis'in window){const u=new SpeechSynthesisUtterance(`Attention please. Flight ${f.no.split('').join(' ')} to ${f.dest} is now boarding at gate ${f.gate}.`);u.rate=.9;setTimeout(()=>speechSynthesis.speak(u),1200);}}
 function start(){ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();master=ac.createGain();master.gain.value=.6;master.connect(ac.destination);
  const len=ac.sampleRate*2,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);let l=0;for(let i=0;i<len;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.5;}
  src=ac.createBufferSource();src.buffer=buf;src.loop=true;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=700;const gn=ac.createGain();gn.gain.value=.15;src.connect(lp).connect(gn).connect(master);src.start();
  timer=setInterval(announce,24000);setTimeout(()=>on&&announce(),1200);}
 function stop(){clearInterval(timer);src&&src.stop();master&&master.disconnect();'speechSynthesis'in window&&speechSynthesis.cancel();}
 return {toggle(){on=!on;on?start():stop();return on;}};
}
export function bindControls({goTo,info,env,sound,ctx,weather}){
 const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],fs=ctx.flightSim;
 all('[data-cam]').forEach(b=>b.onclick=()=>{goTo(b.dataset.cam);all('[data-cam]').forEach(x=>x.classList.toggle('active',x===b));});
 const nav={
  terminal:()=>{goTo('overview');info.reset();},
  flights:()=>info.show('Departures',fs.flights.map(f=>[f.no+' → '+f.dest,f.gate+' · '+f.status])),
  gates:()=>{goTo('gates');info.show('Gates',fs.flights.map(f=>['Gate '+f.gate,f.no+' · '+f.status+' · '+ctx.gateQueue(f.gate)+' waiting']));},
  passengers:()=>{goTo('lounge');const c={};ctx.passengers.forEach(p=>c[p.state]=(c[p.state]||0)+1);info.show('Passengers',Object.entries(c));},
  map:()=>$('#mini').classList.toggle('flip')};
 all('[data-nav]').forEach(b=>b.onclick=e=>{e.preventDefault();nav[b.dataset.nav]();$('#nav').classList.remove('show');});
 $('#dn').onchange=e=>{env.target=e.target.checked?1:0;$('#dnl').textContent=e.target.checked?'🌙 Night':'☀️ Day';};
 all('[data-wx]').forEach(b=>b.onclick=()=>{env.weather=b.dataset.wx;weather.set(b.dataset.wx);all('[data-wx]').forEach(x=>x.classList.toggle('active',x===b));});
 $('#snd').onclick=()=>{const on=sound.toggle();$('#snd').textContent=on?'🔊 Sound ON':'🔇 Sound OFF';};
 info.reset();if(innerWidth<768)info.close();
}
