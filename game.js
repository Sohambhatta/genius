'use strict';
const byId = id => document.getElementById(id);
const challenges = [
  { shape:'round', rows:[4], choices:[3,4,6], clue:'Take only the round lanterns. Leave the stars for the festival.', question:'How many round lanterns can you send to the bridge?' },
  { shape:'round', rows:[3,4], choices:[6,7,10], clue:'The bridge needs round lanterns. Pip found three in the red crate and four in the blue crate. Leave the star lanterns for the festival.', question:'How many lanterns can Pip take from both crates together?' },
  { shape:'star', rows:[4,4,4], choices:[7,12,15], clue:'Tonight the bridge needs star lanterns. Juniper packed three crates with four stars in each. The round lanterns are for the library windows.', question:'How many star lanterns are in the three crates?' }
];
let lit = false;
const level = byId('level');
function setup() {
  lit = false;
  const data = challenges[Number(level.value)];
  const total = data.rows.reduce((sum, n) => sum + n, 0);
  byId('clue').textContent = data.clue;
  byId('question').textContent = data.question;
  byId('reward').hidden = true;
  byId('feedback').textContent = '';
  byId('answers').replaceChildren();
  byId('lanterns').replaceChildren();
  const alternate = data.shape === 'star' ? 'round' : 'star';
  data.rows.forEach((count, index) => {
    const row = document.createElement('div');
    row.className = 'crate';
    row.setAttribute('aria-label', 'Crate ' + (index + 1));
    [...Array(count).fill(data.shape), alternate].forEach(shape => {
      const item = document.createElement('button');
      item.type = 'button';
      item.textContent = shape === 'star' ? '★' : '●';
      item.setAttribute('aria-label', shape + ' lantern');
      item.setAttribute('aria-pressed', 'false');
      item.onclick = () => item.setAttribute('aria-pressed', String(item.getAttribute('aria-pressed') !== 'true'));
      row.append(item);
    });
    byId('lanterns').append(row);
  });
  data.choices.forEach(choice => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.onclick = () => {
      if (lit) return;
      if (choice !== total) {
        byId('feedback').textContent = 'Pip: “Check Juniper’s note, then count only the lanterns it asks for.”';
        return;
      }
      lit = true;
      byId('feedback').textContent = 'You lit the bridge! Pip found something on the other side.';
      byId('reward').hidden = false;
    };
    byId('answers').append(button);
  });
}
level.onchange = setup;
byId('replay').onclick = () => { setup(); level.focus(); };
const speech = window.speechSynthesis;
byId('speak').hidden = !speech;
byId('speak').onclick = () => {
  speech.cancel();
  const reading = new SpeechSynthesisUtterance(byId('clue').textContent);
  reading.rate = 0.85;
  speech.speak(reading);
};
setup();

const canvas = byId('scene');
const ctx = canvas.getContext('2d');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const panels = [...document.querySelectorAll('[data-view]')];
const shots = [
  [[18,13,21],[0,1,0]],
  [[-2,5,11],[-7,1.8,0]],
  [[0,7,13],[0,1,0]],
  [[13,6,9],[8,2,0]]
];
let eye = [30,19,30], target = [0,1,0];
let start = performance.now(), intro = true;
const skip = byId('skip');
const world = canvas.parentElement;
skip.onclick = () => { intro = false; skip.hidden = true; };
const points = [];
const fixed = [];
let meshes = fixed;
function face(vertices, color, glow = 0) {
  meshes.push({vertices, color, glow});
}
function box(x,y,z,w,h,d,colors) {
  const a = [[x-w/2,y,z-d/2],[x+w/2,y,z-d/2],[x+w/2,y,z+d/2],[x-w/2,y,z+d/2]];
  const b = a.map(([px,py,pz]) => [px,py+h,pz]);
  face(b, colors[0]);
  for(let i=0;i<4;i++) {
    const j=(i+1)%4;
    face([a[i],a[j],b[j],b[i]],colors[1+i%2]);
  }
}
function cone(x,y,z,r,h,sides,colors,top=0) {
  for(let i=0;i<sides;i++) {
    const a=i/sides*2*Math.PI, b=(i+1)/sides*2*Math.PI;
    face([[x+r*Math.cos(a),y,z+r*Math.sin(a)],[x+r*Math.cos(b),y,z+r*Math.sin(b)],
      [x+top*Math.cos(b),y+h,z+top*Math.sin(b)],[x+top*Math.cos(a),y+h,z+top*Math.sin(a)]],colors[i%colors.length]);
  }
}
function island(x,r) {
  cone(x,-2,0,r*.65,2,9,['#354560','#465574','#283c56'],r);
  cone(x,0,0,r,.25,9,['#4a927c','#5fa58a','#377a73'],r*.98);
  cone(x,.25,0,r*.98,0,9,['#5a9e82','#69ad89','#559b7d']);
}
function tree(x,z,h) {
  box(x,.24,z,.24,h*.6,.24,['#7c664f','#514757','#67505c']);
  for(let i=0;i<3;i++) cone(x,.5+i*h*.21,z,h*(.38-i*.068),h*.69,6,['#244e56','#367a70','#469884']);
}
island(-8.3,5.3);
island(8.3,5.7);
[[-11,-3,3.5],[-9,-4,3],[-5,-2,2.9],[-11,2,4],[-7,3,2.6],[6,-3,3],[10,3,3.6],[11,-3,4],[6,3,2.5]].forEach(t=>tree(...t));
for(let i=0;i<15;i++) {
  const x = -4.7 + i*.67;
  box(x,.32,0,.62,.16,1.65,['#b07f68','#6f4956','#916477']);
}
for(const z of [-.83,.83]) {
  box(0,.85,z,10,.09,.09,['#d3ad84','#7c5964','#a77769']);
  for(let x=-4.6;x<=5;x+=1.52) box(x,.35,z,.13,.77,.13,['#e3bd95','#7c5964','#9c746e']);
}
box(9,.26,0,3.6,2.65,3.2,['#e4a888','#af686f','#d9907d']);
cone(9,2.9,0,2.65,1.55,4,['#7959a5','#513a82','#a179b7'],.22);
for(const x of [7.9,10.1]) {
  box(x,1.2,1.63,.54,.75,.04,['#f4cf9a','#f4cf9a','#ffda9f']);
  box(x,2.32,1.64,.8,.13,.05,['#ffe0b0','#6f4b74','#8f5874']);
}
box(9,.26,1.64,.7,1.45,.1,['#765887','#453a65','#634f84']);
box(10.45,2.7,-.55,.5,1.2,.5,['#e2a292','#8c526a','#ab6174']);
for(let i=0;i<84;i++) {
  const x = Math.sin(i*17.41)*15, z = Math.cos(i*7.18)*10;
  if (Math.hypot(Math.abs(x)-8.3,z)<5.4) continue;
  box(x,-.73,z,.35+(i%4)*.22,.018,.04,['#83bfc3','#497b9c','#497b9c']);
}
function fox(t) {
  const x=-6.8, z=.87, y=.24, bob=Math.sin(t*3)*.05;
  const russet=['#fdbe7c','#c96552','#e78662'];
  const cloak=['#a4f3d6','#356e75','#4fa398'];
  const ivory=['#fff0cc','#e2beac','#ffe0b0'];
  box(x-.22,y,z,.29,.35,.32,russet);
  box(x+.22,y,z,.29,.35,.32,russet);
  cone(x,y+.27,z,.54,.82,7,cloak,.34);
  cone(x-.54,y+.38,z-.42,.22,.65,6,russet,.08);
  cone(x-.54,y+1.03,z-.42,.12,.21,6,ivory);
  box(x,y+1.05+bob,z,.85,.61,.68,russet);
  for(const dx of [-.29,.29]) {
    cone(x+dx,y+1.65+bob,z,.23,.48,4,russet);
    box(x+dx,y+1.39+bob,z+.35,.07,.10,.04,['#29243c','#29243c','#29243c']);
  }
  box(x,y+1.08+bob,z+.33,.57,.23,.22,ivory);
  box(x,y+1.21+bob,z+.46,.13,.10,.08,['#352a40','#352a40','#352a40']);
  box(x,y+.6,z+.42,.54,.41,.13,['#ffc774','#a95866','#e78662']);
  box(x,y+.7,z+.50,.34,.05,.04,ivory);
}
function moth(t) {
  const x=-5.6, y=1.55+Math.sin(t*2.1)*.19, z=1.1;
  const flap=Math.sin(t*9)*.38;
  for(const side of [-1,1]) {
    face([[x,y,z],[x+side*.53,y+.36,z+flap],[x+side*.43,y-.14,z+flap],[x,y-.24,z]],'#f2abdb');
    face([[x,y,z],[x+side*.32,y+.17,z+flap*.7],[x+side*.2,y-.15,z+flap*.6]],'#ffdd95');
    cone(x+side*.13,y+.17,z,.037,.19,5,['#f6e6af']);
  }
  box(x,y-.14,z,.24,.29,.24,['#fff0bc','#ac76bb','#db9cc8']);
}
const minus=(a,b)=>a.map((n,i)=>n-b[i]);
const dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
const unit=v=>v.map(n=>n/Math.hypot(...v));
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
for(let i=0;i<70;i++) points.push([Math.sin(i*31)*17, .6+(i%15)*.36, Math.cos(i*13)*10]);
function render(now) {
  const ratio=Math.min(devicePixelRatio,1.75), w=canvas.clientWidth, h=canvas.clientHeight;
  if (canvas.width!==Math.round(w*ratio)||canvas.height!==Math.round(h*ratio)) {
    canvas.width=Math.round(w*ratio); canvas.height=Math.round(h*ratio);
  }
  ctx.setTransform(ratio,0,0,ratio,0,0);
  ctx.clearRect(0,0,w,h);
  const t=reduce.matches ? 0 : now/1000;
  const active=panels.reduce((current,panel,index)=>panel.getBoundingClientRect().top<innerHeight*.61?index:current,0);
  if(reduce.matches || now-start>4200 || active>0) { intro=false; skip.hidden=true; }
  const shot=shots[active];
  world.classList.toggle('opening',intro);
  const opening=intro ? (1-(now-start)/4200)**2 : 0;
  const end=lit && active===2 ? [[8,6,12],[3,1,0]] : shot;
  const destination=end[0].map((n,i)=>n+opening*[9,10,-9][i]);
  const ease=reduce.matches ? 1 : .048;
  eye=eye.map((n,i)=>n+(destination[i]-n)*ease);
  target=target.map((n,i)=>n+(end[1][i]-n)*ease);
  const forward=unit(minus(target,eye)), right=unit(cross(forward,[0,1,0])), up=cross(right,forward);
  const focal=Math.min(w,h)*.99;
  function project(point) {
    const relative=minus(point,eye), depth=dot(relative,forward);
    return [w*.5+dot(relative,right)*focal/depth,h*.55-dot(relative,up)*focal/depth,depth];
  }
  const moon=ctx.createRadialGradient(w*.74,h*.23,1,w*.74,h*.23,Math.min(w,h)*.16);
  moon.addColorStop(0,'#ffdfaaa0'); moon.addColorStop(.32,'#ecb6a84a'); moon.addColorStop(1,'#ecb6a800');
  ctx.fillStyle=moon; ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#ffe6b5'; ctx.beginPath(); ctx.arc(w*.74,h*.23,Math.min(w,h)*.038,0,Math.PI*2); ctx.fill();
  meshes=fixed.slice();
  fox(t); moth(t);
  for(let i=0;i<12;i++) {
    const x=-4.7+Math.floor(i/2)*1.88,z=i%2?.84:-.84;
    box(x,1,z,.19,.25,.19,lit?['#fff1a5','#ffc367','#ffdd84']:['#806c8c','#544761','#695674']);
    if (lit) face([[x,1.24,z],[x+.015,1.25,z],[x,1.26,z]],'#fff4a7',20);
  }
  const projected=meshes.map(m=>({...m, vertices:m.vertices.map(project)}))
    .filter(m=>m.vertices.every(p=>p[2]>.5))
    .sort((a,b)=>b.vertices.reduce((s,p)=>s+p[2],0)/b.vertices.length-a.vertices.reduce((s,p)=>s+p[2],0)/a.vertices.length);
  for(const m of projected) {
    ctx.beginPath();
    m.vertices.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
    ctx.closePath(); ctx.fillStyle=m.color;
    if(m.glow){ctx.shadowColor='#ffb53f';ctx.shadowBlur=m.glow;ctx.lineWidth=8;ctx.strokeStyle='#ffe587';ctx.stroke();ctx.shadowBlur=0;}
    ctx.fill();
  }
  points.forEach(([x,y,z],i)=>{
    const [px,py,d]=project([x,y+Math.sin(t+i)*.23,z]);
    if(d<=1) return;
    ctx.globalAlpha=.34+.26*Math.sin(t+i);ctx.fillStyle=i%3?'#ffe1a1':'#a8fff2';
    ctx.beginPath();ctx.arc(px,py,Math.min(2.1,22/d),0,Math.PI*2);ctx.fill();
  });
  ctx.globalAlpha=1;
  requestAnimationFrame(render);
}
if(ctx) requestAnimationFrame(render);

