'use strict';const $=id=>document.getElementById(id),fmt=n=>new Intl.NumberFormat('es',{maximumFractionDigits:2}).format(n);
const defaults={wall:300,height:240,side:15,top:15,bottom:15,gap:15,gapY:15,face:3,lower:30,bar:240,kerf:.3,trim:1,reserve:10,cols:3,rows:1};let model={...defaults},valid=false;
try{const raw=new URL(location.href).searchParams.get('plano');if(raw&&raw.length<3000){const v=JSON.parse(raw);MouldMath.plan(v);model=v;}}catch{$('feedback').textContent='El plano del enlace no era válido; se muestra el ejemplo.';}
function fill(){for(const k of Object.keys(defaults))$(k).value=model[k];}
function calc(){
 for(const k of Object.keys(defaults))model[k]=Number($(k).value===''?NaN:$(k).value);
 $('lower-field').hidden=model.rows===1;$('gapY-field').hidden=model.rows===1;
 try{const p=MouldMath.plan(model);valid=true;$('error').hidden=true;$('results').hidden=false;
 $('size').textContent=fmt(p.w)+' cm';$('meters').textContent=fmt(p.linear/100)+' m';$('bars').textContent=p.totalBars+' barras';
 $('details').textContent=`${model.cols} columnas × ${model.rows} ${model.rows===1?'fila':'filas'}. Alturas exteriores: ${p.heights.map(h=>fmt(h)+' cm').join(' y ')}. Interior de cada marco: ${fmt(p.w-2*model.face)} cm de ancho.`;
 $('drawing').innerHTML=`<svg viewBox="-8 -8 ${model.wall+16} ${model.height+16}" role="img" aria-label="Distribución frontal de marcos de moldura numerados, sin puertas ni ventanas"><rect x="0" y="0" width="${model.wall}" height="${model.height}" fill="#e7e7df" stroke="#a8b1b5" stroke-width="0.6"/>${p.frames.map(f=>`<path d="M${f.x},${model.height-f.y-f.h}h${f.w}v${f.h}h-${f.w}z M${f.x+model.face},${model.height-f.y-f.h+model.face}v${f.h-2*model.face}h${f.w-2*model.face}v-${f.h-2*model.face}z" fill="#fffef8" fill-rule="evenodd" stroke="#748c96" stroke-width="0.5"/><text x="${f.x+f.w/2}" y="${model.height-f.y-f.h/2}" text-anchor="middle" font-size="${Math.max(3,Math.min(f.w,f.h)/5)}" fill="#456371">${f.id}</text>`).join('')}</svg>`;
 $('positions').innerHTML=p.frames.map(f=>`<tr><th scope="row">${f.id}</th><td>${fmt(f.x)}</td><td>${fmt(f.y)}</td><td>${fmt(f.w)} × ${fmt(f.h)}</td><td>${fmt(f.w-2*model.face)} × ${fmt(f.h-2*model.face)}</td></tr>`).join('');
 $('cut-list').innerHTML=p.heights.map((h,i)=>`<tr><th scope="row">Fila ${i+1} ${model.rows===2?(i===0?'inferior':'superior'):''}</th><td>${model.cols*2} × ${fmt(p.w)} cm</td><td>${model.cols*2} × ${fmt(h)} cm</td></tr>`).join('');
 $('bar-detail').textContent=`Plan orientativo: ${p.bars.length} barras para las piezas + ${p.extra} barras enteras de reserva. Reserva: ${fmt(model.reserve)} % de ${fmt(p.linear/100)} m, convertido a barras completas. Cada barra pierde ${fmt(model.trim)} cm de saneado y se reserva ${fmt(model.kerf)} cm por pieza para el corte.`;
 $('bar-plan').innerHTML=p.bars.map((b,i)=>`<tr><th scope="row">${i+1}</th><td>${b.cuts.map(c=>`${fmt(c.length)} cm (#${c.frame})`).join(' + ')}</td><td>${fmt(Math.max(0,p.capacity-b.used))} cm</td></tr>`).join('');
 $('live-status').textContent=`${p.frames.length} marcos y ${p.cuts.length} piezas. ${p.totalBars} barras, incluida la reserva indicada.`;
 }catch(e){valid=false;$('error').textContent=e.message;$('error').hidden=false;$('results').hidden=true;$('live-status').textContent='Revisa las medidas.';}
 $('share').disabled=!valid;$('print').disabled=!valid;
}
$('form').addEventListener('input',calc);$('form').addEventListener('change',calc);$('form').addEventListener('submit',e=>e.preventDefault());
$('reset').addEventListener('click',()=>{model={...defaults};fill();calc();$('feedback').textContent='Ejemplo recuperado.';});
$('print').addEventListener('click',()=>{if(valid)window.print();});
$('share').addEventListener('click',async()=>{if(!valid)return;const u=new URL(location.href);u.search='';u.searchParams.set('plano',JSON.stringify(model));try{await navigator.clipboard.writeText(u.href);$('feedback').textContent='Enlace copiado con las medidas.';}catch{$('share-url').hidden=false;$('share-url').value=u.href;$('share-url').select();$('feedback').textContent='Copia el enlace del campo.';}});fill();calc();
