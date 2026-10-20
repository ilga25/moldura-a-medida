(function(root){'use strict';function plan(d){
 const n=(v,a,b,label)=>{if(!Number.isFinite(v)||v<a||v>b)throw Error('Revisa '+label+'.');return v;};
 n(d.wall,10,2000,'el ancho');n(d.height,10,1000,'el alto');n(d.side,0,500,'los márgenes laterales');n(d.top,0,500,'el margen superior');n(d.bottom,0,500,'el margen inferior');n(d.gap,0,200,'la separación horizontal');n(d.gapY,0,200,'la separación vertical');n(d.face,0.1,30,'el ancho de moldura');n(d.lower,5,95,'la proporción inferior');n(d.bar,10,600,'la longitud de barra');n(d.kerf,0,2,'el grosor de corte');n(d.trim,0,20,'el saneado de barra');n(d.reserve,0,50,'la reserva');
 if(!Number.isInteger(d.cols)||d.cols<1||d.cols>8||![1,2].includes(d.rows))throw Error('Selecciona de 1 a 8 columnas y 1 o 2 filas.');
 const w=(d.wall-2*d.side-(d.cols-1)*d.gap)/d.cols, available=d.height-d.top-d.bottom-(d.rows-1)*d.gapY;
 const heights=d.rows===1?[available]:[available*d.lower/100,available*(1-d.lower/100)];
 if(w<=2*d.face||heights.some(h=>h<=2*d.face))throw Error('Los huecos interiores desaparecen. Reduce márgenes, separaciones, columnas o ancho de moldura.');
 let y=d.bottom;const frames=[],cuts=[];
 heights.forEach((h,r)=>{for(let c=0;c<d.cols;c++){const id=frames.length+1;frames.push({id,x:d.side+c*(w+d.gap),y,w,h,row:r+1});for(let i=0;i<2;i++){cuts.push({frame:id,kind:'Horizontal',length:w});cuts.push({frame:id,kind:'Vertical',length:h});}}y+=h+d.gapY;});
 const capacity=d.bar-d.trim;
 if(cuts.some(c=>c.length+d.kerf>capacity+1e-8))throw Error('Hay piezas que no caben enteras en la barra con el saneado y el corte indicados. Usa barras más largas o cambia el diseño.');
 const bars=[];
 for(const cut of [...cuts].sort((a,b)=>b.length-a.length)){
  let bin=bars.find(b=>b.used+cut.length+d.kerf<=capacity+1e-8);
  if(!bin){bin={used:0,cuts:[]};bars.push(bin);}bin.used+=cut.length+d.kerf;bin.cuts.push(cut);
 }
 const linear=cuts.reduce((s,c)=>s+c.length,0),extra=d.reserve===0?0:Math.ceil((linear*d.reserve/100)/d.bar-1e-10);
 return {w,heights,frames,cuts,bars,linear,extra,totalBars:bars.length+extra,capacity};
}if(typeof module!=='undefined')module.exports={plan};else root.MouldMath={plan};})(typeof window!=='undefined'?window:globalThis);
