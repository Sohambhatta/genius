const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const canvas = $('terrain');
const beats = [...document.querySelectorAll('[data-shot]')];
const shots = [
  {eye:[12,20,18],target:[0,1,-.7],zoom:1},
  {eye:[-4,5.9,11],target:[-.1,.95,4.1],zoom:2.65},
  {eye:[10,5.4,7],target:[3.5,1,.15],zoom:2.7},
  {eye:[8,8,8.6],target:[3.9,.95,.15],zoom:2.25}
];
let position = 0;
function scrollPosition() {
  const line = innerHeight * .49;
  const tops = beats.map(beat=>beat.getBoundingClientRect().top);
  let i = 0;
  while(i < tops.length-1 && line >= tops[i+1]) i++;
  if(i === tops.length-1) position=i;
  else {
    const fraction = Math.max(0, Math.min(1, (line-tops[i]) / (tops[i+1]-tops[i])));
    const transition = Math.max(0, (fraction-.56)/.44);
    position=i+transition*transition*(3-2*transition);
  }
  document.body.dataset.chapter = String(Math.round(position));
}
if(window.gsap && window.ScrollTrigger){
  window.gsap.registerPlugin(window.ScrollTrigger);
  window.ScrollTrigger.create({trigger:'main',start:'top bottom',end:'bottom top',onUpdate:scrollPosition,onRefresh:scrollPosition});
} else window.addEventListener('scroll',scrollPosition,{passive:true});
window.addEventListener('resize',scrollPosition);
scrollPosition();
try {
  const three = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  createWorld(three);
} catch (error) {
  console.warn('The 3D scene is unavailable. The quest remains playable.',error);
}

function createWorld(T) {
  const renderer=new T.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.35;
  const scene=new T.Scene();
  scene.background=new T.Color('#143f45');
  scene.fog=new T.FogExp2('#143f45',.019);
  const camera=new T.OrthographicCamera(-12,12,7,-7,.1,100);
  scene.add(new T.HemisphereLight('#ffe6bc','#427c68',2.5));
  const light=new T.DirectionalLight('#ffd397',3.2);
  light.position.set(-11,18,7); light.castShadow=true;
  light.shadow.mapSize.set(1024,1024);
  Object.assign(light.shadow.camera,{left:-13,right:13,top:13,bottom:-13,far:42});
  light.shadow.normalBias=.045;
  scene.add(light);
  let seed=78;
  function random() { seed=(seed*16807)%2147483647; return (seed-1)/2147483646; }
  const materials=new Map(), spheres=new T.IcosahedronGeometry(1,2), cube=new T.BoxGeometry(1,1,1);
  function mat(color) {
    if (!materials.has(color)) materials.set(color,new T.MeshStandardMaterial({color,roughness:.86}));
    return materials.get(color);
  }
  function mesh(geometry,color,x,y,z,sx=1,sy=sx,sz=sx,parent=scene) {
    const part=new T.Mesh(geometry,typeof color==='string'?mat(color):color);
    part.position.set(x,y,z);part.scale.set(sx,sy,sz);
    part.castShadow=true;part.receiveShadow=true;
    parent.add(part);return part;
  }
  const rock=(color,x,y,z,sx,sy,sz,parent)=>mesh(spheres,color,x,y,z,sx,sy,sz,parent);
  const block=(color,x,y,z,sx,sy,sz,parent)=>mesh(cube,color,x,y,z,sx,sy,sz,parent);
  const terrain=new T.CylinderGeometry(8.8,7.3,1.8,24);
  mesh(terrain,'#68543a',0,-1.05,0,1,1,.82);
  mesh(new T.CylinderGeometry(8.77,8.82,.36,24),'#678f3f',0,.01,0,1,1,.82);
  const sea=mesh(new T.PlaneGeometry(140,140),'#247d81',0,-1.35,0);
  sea.rotation.x=-Math.PI/2; sea.castShadow=false;
  const wave=new T.TorusGeometry(1,.022,5,32);
  for(let i=0;i<36;i++){
    const a=random()*Math.PI*2,r=9+random()*14;
    const ripple=mesh(wave,i%3===0?'#7db9af':'#438f8e',Math.cos(a)*r,-1.33,Math.sin(a)*r,.8+random()*2,.17,1);
    ripple.rotation.x=-Math.PI/2; ripple.castShadow=false;
  }
  function path(points) {
    const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
    for(const point of curve.getPoints(54)) rock('#cfaf72',point.x,.19,point.z,.49,.075,.49);
  }
  path([[0,0,5],[-3,0,3],[-4,0,.9],[-2.6,0,-2],[0,0,-3.6]]);
  path([[0,0,5],[3,0,3.2],[4,0,.2],[2.6,0,-2],[0,0,-3.6]]);
  function tree(x,z,s) {
    mesh(new T.CylinderGeometry(.10,.20,1,7),'#784a33',x,.65*s,z,s,s,s);
    rock('#2e683f',x,1.35*s,z,.72*s,.78*s,.69*s);
    rock('#699f48',x-.18*s,1.69*s,z-.14*s,.58*s,.63*s,.58*s);
    rock('#97b856',x+.17*s,1.84*s,z+.13*s,.39*s,.42*s,.39*s);
  }
  for(let i=0;i<57;i++){
    const a=random()*6.28,r=3+random()*5;
    const x=Math.cos(a)*r,z=Math.sin(a)*r*.8;
    if((z< -2 && Math.abs(x)<3.4)||(z>3 && Math.abs(x)<2.4)||Math.abs(Math.abs(x)-3.8)<.72)continue;
    tree(x,z,.44+random()*.62);
  }
  for(let i=0;i<105;i++){
    const a=random()*6.28,r=random()*8;
    const x=Math.cos(a)*r,z=Math.sin(a)*r*.76;
    if(z< -2 && Math.abs(x)<3.2)continue;
    rock(['#e9b648','#ef9165','#a8bf69'][i%3],x,.24,z,.09,.11,.08);
  }
  function house(x,z,roof) {
    block('#e3c599',x,.67,z,1.02,.98,.86);
    const cap=mesh(new T.ConeGeometry(.8,.68,4),roof,x,1.45,z);cap.rotation.y=Math.PI/4;
    block('#674535',x,.51,z+.444,.21,.55,.05);
    block('#7d4c45',x+.29,.88,z+.444,.19,.2,.06);
    block('#705b4e',x+.25,1.54,z-.17,.16,.44,.16);
  }
  house(-1.14,4.2,'#b95440');house(1.22,4.5,'#bd7544');house(.8,5.75,'#994c4a');
  mesh(new T.CylinderGeometry(1.15,3.35,3.65,12),'#573f38',0,1.97,-3.7);
  for(let i=0;i<17;i++){
    const a=i/17*Math.PI*2, r=1.7+random()*.75;
    rock(i%2?'#705448':'#604842',Math.cos(a)*r,1.25+random()*1.3,-3.7+Math.sin(a)*r,.61,1.18,.72);
  }
  const magma=new T.MeshStandardMaterial({color:'#ff963b',emissive:'#e65515',emissiveIntensity:1.8,roughness:.7});
  mesh(new T.CylinderGeometry(1.05,1.02,.12,24),magma,0,3.86,-3.7);
  const lavaPath=new T.CatmullRomCurve3([[-.65,3.89,-2.99],[-1.0,3.2,-2.17],[-.73,2.52,-1.85],[-1.01,1.48,-1.28],[-.85,.53,-.83]].map(p=>new T.Vector3(...p)));
  mesh(new T.TubeGeometry(lavaPath,24,.10,7,false),magma,0,0,0);
  const ember=new T.Group();
  ember.position.set(0,3.52,-3.83);scene.add(ember);
  rock('#673d35',0,.82,0,1.03,.96,.72,ember);
  rock('#884d3d',0,.36,.37,.84,.43,.54,ember);
  for(const side of [-1,1]){
    rock('#fbc86a',side*.36,.96,.65,.19,.14,.09,ember);
    rock('#3a2729',side*.35,.95,.725,.065,.082,.04,ember);
    rock('#94573d',side*.36,1.15,.60,.33,.13,.15,ember).rotation.z=side*.17;
    rock('#71463d',side*1.02,.29,.19,.59,.44,.47,ember);
    rock('#8e634e',side*1.26,.38,.37,.37,.24,.32,ember);
  }
  const giant=new T.Group();giant.position.set(-4.65,.17,1.05);scene.add(giant);
  rock('#737267',0,.64,0,.86,.68,.52,giant);
  rock('#999280',0,1.31,.08,.68,.53,.52,giant);
  rock('#699447',-.08,1.67,0,.59,.19,.46,giant);
  for(const side of [-1,1]){
    rock('#55574f',side*.69,.43,.13,.34,.39,.33,giant);
    rock('#fbdfa4',side*.21,1.35,.52,.125,.13,.05,giant);
    rock('#30352b',side*.20,1.35,.56,.055,.063,.028,giant);
  }
  const pool=mesh(new T.CylinderGeometry(1.46,1.24,.11,22),'#4cafac',4.45,.23,-.45);
  pool.scale.z=.78;
  rock('#777377',4.6,.75,-1.3,1.25,.8,.65);
  const stream=new T.CatmullRomCurve3([[4.55,1.46,-1.28],[4.52,1.31,-.91],[4.49,.66,-.57],[4.48,.26,-.45]].map(p=>new T.Vector3(...p)));
  mesh(new T.TubeGeometry(stream,20,.18,9,false),'#a7e4db',0,0,0);
  const owl=new T.Group();owl.position.set(5.05,.25,.52);scene.add(owl);
  rock('#8572a6',0,.39,0,.37,.45,.31,owl);
  rock('#a78dbf',0,.83,0,.46,.39,.35,owl);
  for(const side of [-1,1]){
    rock('#f5dcc2',side*.17,.88,.29,.17,.18,.075,owl);
    rock('#443449',side*.17,.89,.35,.077,.088,.05,owl);
    mesh(new T.ConeGeometry(.14,.31,6),'#9775b1',side*.27,1.13,0,1,1,1,owl);
  }
  rock('#ecaf62',0,.73,.34,.097,.09,.10,owl);
  const rowan=new T.Group();rowan.position.set(.2,.19,3.78);scene.add(rowan);
  mesh(new T.CylinderGeometry(.21,.36,.5,12),'#e9a739',0,.45,0,1,1,1,rowan);
  rock('#f4b687',0,.86,.04,.25,.24,.23,rowan);
  rock('#984b31',0,.99,-.04,.26,.18,.25,rowan);
  rock('#b25243',0,.65,.02,.27,.067,.24,rowan);
  block('#98663a',.25,.45,.12,.15,.24,.18,rowan);
  for(const side of [-1,1]){
    rock('#236962',side*.115,.14,.04,.12,.13,.16,rowan);
    rock('#3b312d',side*.09,.89,.235,.025,.035,.026,rowan);
  }
  // The gate and pickups are scene objects whose state follows the quest.
  for (const side of [-1,1]) {
    for(let i=0;i<5;i++){
      const x=3.9+side*(1+i*.4);
      block('#b28057',x,.51,.45,.13,.67,.18);
      if(i<4) for (const y of [.38,.64]) block('#d2a276',x+side*.20,y,.46,.43,.075,.10);
      rock('#6b9a53',x,.28,1.34,.18,.16,.21);
      rock(i%2?'#e5a85f':'#ee8e7f',x,.43,1.34,.084,.075,.083);
    }
  }
  for(let i=0;i<7;i++) block(i%2?'#bc9465':'#dab57d',3.9,.20,1.01+i*.21,.73,.045,.19);
  const gate = new T.Group();
  gate.position.set(3.9,.22,.45);
  scene.add(gate);
  for (const x of [-.85,.85]) {
    block('#ae9678',x,.85,0,.25,1.75,.35,gate);
    block('#e2c899',x,1.78,0,.39,.17,.47,gate);
  }
  const door = new T.Group();
  gate.add(door);
  for (let i=0;i<7;i++) block(i%2?'#a96e45':'#c88950',-.63+i*.21,.77,0,.19,1.48,.15,door);
  for (const y of [.42,1.08]) block('#624a42',0,y,.095,1.42,.15,.12,door);
  rock('#ffc86a',0,.76,.15,.15,.15,.075,door);
  const chest = new T.Group();
  chest.position.set(3.9,.27,-1.12);scene.add(chest);
  block('#9d4e30',0,.19,0,.72,.38,.52,chest);
  const lid = new T.Group();
  lid.position.set(0,.39,-.26);chest.add(lid);
  block('#d88c43',0,.08,.26,.75,.16,.54,lid);
  for (const x of [-.24,.24]) block('#ffe096',x,.17,.26,.075,.045,.54,lid);
  const seeds = Array.from({length:19},(_,i)=>{
    const a=i*2.399;
    const pickup=rock('#f8ce69',3.8+Math.cos(a)*(.48+i*.036),.42,2.48+Math.sin(a)*(.27+i*.031),.13,.20,.10);
    pickup.rotation.z=a;
    return {pickup,x:pickup.position.x,z:pickup.position.z};
  });
  const starShape = new T.Shape();
  for(let i=0;i<10;i++){
    const a=Math.PI*.5+i*Math.PI/5,r=i%2?.095:.21;
    if(i===0)starShape.moveTo(Math.cos(a)*r,Math.sin(a)*r);
    else starShape.lineTo(Math.cos(a)*r,Math.sin(a)*r);
  }
  starShape.closePath();
  const starGeometry = new T.ExtrudeGeometry(starShape,{depth:.05,bevelEnabled:false});
  const starMaterial = new T.MeshBasicMaterial({color:'#ffd365'});
  const stars = Array.from({length:24},()=>mesh(starGeometry,starMaterial,0,0,0));
  const sparks=new T.BufferGeometry();
  const count=72, positions=new Float32Array(count*3);
  for(let i=0;i<count;i++){positions[i*3]=(random()-.5)*4;positions[i*3+1]=4+random()*4;positions[i*3+2]=-3.6+(random()-.5)*3;}
  sparks.setAttribute('position',new T.BufferAttribute(positions,3));
  const cinders=new T.Points(sparks,new T.PointsMaterial({color:'#ffbc76',size:.11,transparent:true,opacity:.72}));
  scene.add(cinders);
  // Batch repeated scenery while keeping the animated characters independent.
  const batches = new Map();
  for (const part of scene.children) {
    if (!part.isMesh || part.geometry !== spheres) continue;
    const key = part.material.uuid;
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key).push(part);
  }
  for (const group of batches.values()) {
    if (group.length < 4) continue;
    const batch = new T.InstancedMesh(spheres, group[0].material, group.length);
    batch.castShadow = true;
    batch.receiveShadow = true;
    group.forEach((part, i) => {
      part.updateMatrix();
      batch.setMatrixAt(i, part.matrix);
      scene.remove(part);
    });
    scene.add(batch);
  }
  const target=new T.Vector3(), desired=new T.Vector3();
  let previousStage='', stageAt=0, width=0, height=0, frameAt=0;
  const lerp=T.MathUtils.lerp;
  function frame(now) {
    const w=canvas.clientWidth,h=canvas.clientHeight;
    if(!w||!h){requestAnimationFrame(frame);return;}
    if(w!==width||h!==height){
      renderer.setSize(w,h,false);width=w;height=h;
      const aspect=w/h;
      camera.left=-7.9*aspect;camera.right=7.9*aspect;
      camera.top=7.9;camera.bottom=-7.9;
    }
    const progress=reduced.matches?Math.round(position):position;
    const i=Math.floor(progress), a=shots[i], b=shots[Math.min(i+1,3)], t=progress-i;
    desired.set(...a.eye.map((value,j)=>lerp(value,b.eye[j],t)));
    target.set(...a.target.map((value,j)=>lerp(value,b.target[j],t)));
    const mobile=Math.min(1,w/h*1.35);
    camera.zoom=lerp(a.zoom,b.zoom,t)*mobile;
    if(w<h) target.x=lerp(target.x,3.65,Math.min(1,progress/2));
    camera.position.copy(desired);camera.lookAt(target);camera.updateProjectionMatrix();

    const stage=document.body.dataset.stage;
    if(stage!==previousStage){previousStage=stage;stageAt=now;}
    const time=(now-stageAt)/1000;
    const dt=Math.min(.05,(now-frameAt)/1000);frameAt=now;
    const moving=stage==='walk', done=stage==='done';
    const opening=['move','walk','done'].includes(stage);
    const play=progress>2.52;
    const walk=moving?Math.min(1,time/.99):done?1:0;
    const step=reduced.matches?0:Math.sin(walk*24)*.1;
    rowan.position.set(play?3.9:.2,.19+(moving?Math.abs(step):0),play?lerp(2.95,-.72,walk):3.78);
    rowan.rotation.y=play?Math.PI:.34;
    const ease=reduced.matches?1:1-Math.exp(-dt*7);
    door.position.y=lerp(door.position.y,opening?1.85:0,ease);
    lid.rotation.x=lerp(lid.rotation.x,done?-1.13:0,ease);
    const count=[5,19,6][Number($('difficulty').value)];
    seeds.forEach(({pickup,x,z},index)=>{
      const gather=stage==='pickup'?Math.max(0,Math.min(1,(time-index*.024)*2.5)):0;
      pickup.visible=index<count&&play&&(stage==='challenge'||(stage==='pickup'&&gather<1));
      pickup.position.set(lerp(x,3.9,gather),.42+Math.sin(gather*Math.PI)*1.2,lerp(z,2.96,gather));
      if(!reduced.matches)pickup.rotation.y=now*.002+index;
    });
    stars.forEach((star,index)=>{
      const burst=done||stage==='move';
      const age=time;
      star.visible=burst&&age<1.22;
      if(!star.visible)return;
      const angle=index*2.399;
      star.position.set(3.9+Math.cos(angle)*age*(1+index%4*.32),.92+age*(3+index%5*.35)-age*age*2.8,(done?-1.1:.45)+Math.sin(angle)*age*1.6);
      star.rotation.set(age*2,index+age*2,angle+age);
      star.scale.setScalar(1-Math.max(0,age-.7));
    });
    if(!reduced.matches){
      ember.position.y=3.52+Math.sin(now*.002)*.09;
      owl.rotation.y=Math.sin(now*.0016)*.25;
      cinders.position.y=(now*.00055)%1.8;
    }
    magma.emissiveIntensity=done?.65:1.5;
    renderer.render(scene,camera);
    canvas.parentElement.classList.add('ready');
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

