export function createInfo(){
 const $=id=>document.getElementById(id),panel=$('info'),title=$('i-title'),body=$('i-body'),sim=$('sim');
 const api={
  show(t,rows){title.textContent=t;body.innerHTML='<table class="table table-sm table-borderless mb-0">'+rows.map(([a,b])=>`<tr><th>${a}</th><td>${b}</td></tr>`).join('')+'</table>';panel.classList.add('open');},
  reset(){api.show('SkyPort 3D',[['Click','Passengers, gates, boards, planes, baggage, shops'],['Rotate','Left-drag / one finger'],['Pan','Right-drag / two fingers'],['Zoom','Wheel / pinch']]);},
  setSim(rows){sim.innerHTML=rows.map(([a,b])=>`<div class="d-flex justify-content-between"><span>${a}</span><b>${b}</b></div>`).join('');},
  close(){panel.classList.remove('open');}};
 $('i-close').onclick=api.close;return api;
}
