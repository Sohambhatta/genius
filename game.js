'use strict';
const byId = id => document.getElementById(id);
const problems = [
  {title:'Count the seeds', prompt:'Rowan sees 3 seeds by the fence and 2 by the rock. How many can Rowan pick up?', answers:['4','5','6'], correct:'5', seeds:5, hint:'Start at three, then count two more.', clue:'The left trail is blocked by a fallen branch. The right trail is clear.', question:'Which trail should Rowan take?', paths:['Left trail','Right trail'], path:1},
  {title:'Pack for the climb', prompt:'There are 4 baskets with 6 seeds in each. Rowan plants 5 seeds. How many seeds are left to take?', answers:['19','24','29'], correct:'19', seeds:19, hint:'Multiply 4 × 6, then subtract the 5 planted seeds.', clue:'Rowan reads the sign. “After rain, the wooden bridge gets slippery. The stone trail stays dry.” Rain has just stopped.', question:'Which path has the safer footing?', paths:['Wooden bridge','Stone trail'], path:1},
  {title:'Share the harvest', prompt:'Rowan saves one quarter of 48 seeds for the village. The rest are shared equally among 6 gardens. How many seeds go to each garden?', answers:['6','8','12'], correct:'6', seeds:6, hint:'Subtract one quarter of 48, then divide the remaining seeds by 6.', clue:'“Watch for fresh tracks,” the ranger wrote. “The mossy trail looked empty, but its wet prints led straight to the gate. The dusty trail had no prints.”', question:'Which clue suggests someone used the mossy trail recently?', paths:['There were wet prints.','The trail looked empty.'], path:0}
];
const level = byId('difficulty');
let digs = 0;
let stage = 'challenge', run = 0, seeds = 0, xp = 0, coins = 0;
function setStage(next) {
  stage = next;
  document.body.dataset.stage = next;
  document.body.dataset.digs = digs;
  render();
}
function button(parent, text, action) {
  const el = document.createElement('button');
  el.type = 'button';
  el.textContent = text;
  el.onclick = action;
  parent.append(el);
}
function render() {
  const data = problems[Number(level.value)];
  byId('seeds').textContent = '🌱 ' + seeds + ' seeds';
  byId('coins').textContent = '◉ ' + coins + ' coins';
  byId('animation-caption').textContent = {pickup:'Gathering seeds',opening:'The gate is lifting',walk:'Crossing the bridge',brush:'Brushing away the sand',loot:'Collecting treasure'}[stage] || '';
  byId('xp').textContent = '✦ ' + xp + ' XP';
  const labels = {challenge:'01 / SUPPLY CACHE',pickup:'01 / COLLECTING SUPPLIES',path:'02 / READ THE TRAIL',opening:'02 / THE GATE OPENS',move:'02 / TRAIL UNLOCKED',walk:'03 / CROSSING THE GATE',dig:'04 / BURIED TREASURE',brush:'04 / CLEARING SAND',loot:'04 / COLLECTING TREASURE',done:'04 / CHEST OPENED'};
  byId('chapter').textContent = labels[stage];
  const body = byId('game-body');
  body.replaceChildren();
  byId('status').textContent = '';
  function write(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    body.append(el);
  }
  function actions(options) {
    const group = document.createElement('div');
    group.className = 'choices';
    body.append(group);
    options.forEach(([label, action]) => button(group,label,action));
  }
  if(stage === 'challenge'){
    write('h3',data.title);
    write('p',data.prompt);
    actions(data.answers.map(answer=>[answer,()=>{
      if(answer !== data.correct){byId('status').textContent=data.hint;return;}
      const current = ++run;
      setStage('pickup');
      setTimeout(()=>{if(current!==run)return;seeds=data.seeds;xp=40;setStage('path');},950);
    }]));
  } else if(stage === 'pickup'){
    write('h3','Seeds found!');
    write('p','Rowan is gathering the seeds into the pack.');
  } else if(stage === 'path'){
    write('h3','Find the way to the gate');
    write('p',data.clue);
    write('p',data.question);
    actions(data.paths.map((path,i)=>[path,()=>{
      if(i!==data.path){byId('status').textContent='Check the trail clue and try again.';return;}
      xp=70;
      const current=++run;setStage('opening');
      setTimeout(()=>{if(current===run)setStage('move');}, matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 3400);
    }]));
  } else if(stage === 'opening'){
    write('h3','The gate is opening…');
    write('p','Watch the bridge as the gate lifts.');
  } else if(stage === 'move'){
    write('h3','The bridge is clear!');
    write('p','You found a safe path. Move Rowan through the gate to claim the chest.');
    actions([['Move Rowan →',()=>{
      const current=++run;setStage('walk');
      setTimeout(()=>{if(current!==run)return;xp=85;setStage('dig');},matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 3500);
    }]]);
  } else if(stage === 'walk'){
    write('h3','Onward, Rowan!');
    write('p','Crossing to the treasure chest…');
  } else if(stage === 'dig'){
    write('h3','Something is buried here.');
    write('p','Tap the mound or use Dig to brush away the sand. '+digs+' of 3 layers cleared.');
    actions([['Dig the sand',dig]]);
  } else if(stage === 'done'){
    write('h3','Summit trail unlocked.');
    write('p','You packed six gold coins and a map to Mount Ember.');
    actions([['Play again',reset]]);
  }
}
function dig(){
  if(stage!=='dig')return;
  digs++;
  const current = ++run;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(digs < 3){
    setStage('brush');
    setTimeout(()=>{if(current===run)setStage('dig');}, reduced ? 70 : 420);
    return;
  }
  setStage('loot');
  for(let i=0;i<6;i++){
    setTimeout(()=>{
      if(current!==run)return;
      coins=i+1;
      byId('coins').textContent='◉ '+coins+' coins';
      if(coins===6){xp=100;setStage('done');}
    },reduced?100+i*30:1420+i*155);
  }
}
byId('dig-marker').onclick=dig;
function reset(){run++;seeds=0;xp=0;digs=0;coins=0;setStage('challenge');}
level.onchange=reset;
render();
