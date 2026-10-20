const {plan}=require('./calc.js'),a=require('node:assert/strict');
const d={wall:300,height:240,side:15,top:15,bottom:15,gap:15,gapY:15,face:3,lower:30,bar:240,kerf:.3,trim:1,reserve:0,cols:3,rows:1};
let p=plan(d);a.equal(p.w,80);a.equal(p.heights[0],210);a.equal(p.linear,1740);a.equal(p.cuts.length,12);a.equal(p.frames[2].x,205);a.equal(p.totalBars,9);
p=plan({...d,rows:2});a.deepEqual(p.heights,[58.5,136.5]);a.equal(p.frames.length,6);a.equal(p.frames[3].y,88.5);
for(const rows of [1,2])for(let cols=1;cols<=8;cols++){
 const q=plan({...d,bar:600,cols,rows,reserve:10});a.equal(q.cuts.length,rows*cols*4);a.ok(q.bars.every(b=>b.used<=q.capacity+1e-8));a.equal(q.bars.flatMap(b=>b.cuts).length,q.cuts.length);a.ok(Math.abs(q.frames[cols-1].x+q.w+d.side-d.wall)<1e-8);
}
a.throws(()=>plan({...d,wall:30}));a.throws(()=>plan({...d,bar:100}));a.throws(()=>plan({...d,rows:3}));a.throws(()=>plan({...d,cols:2.5}));a.throws(()=>plan({...d,face:NaN}));console.log('Geometría, cortes, 16 combinaciones y límites comprobados.');
