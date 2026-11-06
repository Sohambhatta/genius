'use strict';
const byId = id => document.getElementById(id);
const problems = [
  {title:'Count the seeds', prompt:'Rowan sees 3 seeds by the fence and 2 by the rock. How many can Rowan pick up?', answers:['4','5','6'], correct:'5', seeds:5, hint:'Start at three, then count two more.', clue:'The left trail is blocked by a fallen branch. The right trail is clear.', question:'Which trail should Rowan take?', paths:['Left trail','Right trail'], path:1},
  {title:'Pack for the climb', prompt:'There are 4 baskets with 6 seeds in each. Rowan plants 5 seeds. How many seeds are left to take?', answers:['19','24','29'], correct:'19', seeds:19, hint:'Multiply 4 × 6, then subtract the 5 planted seeds.', clue:'Rowan reads the sign. “After rain, the wooden bridge gets slippery. The stone trail stays dry.” Rain has just stopped.', question:'Which path has the safer footing?', paths:['Wooden bridge','Stone trail'], path:1},
  {title:'Share the harvest', prompt:'Rowan saves one quarter of 48 seeds for the village. The rest are shared equally among 6 gardens. How many seeds go to each garden?', answers:['6','8','12'], correct:'6', seeds:6, hint:'Subtract one quarter of 48, then divide the remaining seeds by 6.', clue:'“Watch for fresh tracks,” the ranger wrote. “The mossy trail looked empty, but its wet prints led straight to the gate. The dusty trail had no prints.”', question:'Which clue suggests someone used the mossy trail recently?', paths:['There were wet prints.','The trail looked empty.'], path:0}
];
const trailProblems=[
  {clue:'The map says: follow the blue lanterns. The red lanterns lead to a blocked tunnel.',options:['Blue lanterns','Red lanterns'],answer:0,math:'Three lantern flowers each need 1 cup of water. How many cups are needed?',answers:['2','3','4'],correct:'3',hint:'Count one cup for each of the three flowers.'},
  {clue:'Blue lanterns mark the open ridge. Red lanterns mark the tunnel. Fresh stones have fallen across the tunnel entrance.',options:['Take the blue ridge','Take the red tunnel'],answer:0,math:'Three lantern flowers each need 2 cups of water. How many cups are needed altogether?',answers:['5','6','8'],correct:'6',hint:'Add 2 + 2 + 2, or multiply 3 by 2.'},
  {clue:'The ridge lanterns burn blue, showing the ranger passed safely. Red lanterns hang beside fresh rubble at the tunnel entrance.',options:['The red tunnel is clear','The blue ridge is passable'],answer:1,math:'Each of 3 lantern flowers needs 1/4 litre of water. Rowan has 1 litre. How much water will remain?',answers:['1/4 litre','1/2 litre','3/4 litre'],correct:'1/4 litre',hint:'Three quarters of a litre are used. Subtract that from one whole litre.'}
];
function later(next,delay){
  const current=++run;
  setTimeout(()=>{if(current===run)setStage(next);},matchMedia('(prefers-reduced-motion: reduce)').matches?80:delay);
}
const level = byId('difficulty');
let digs = 0;
let stage = 'challenge', run = 0, seeds = 0, xp = 0, coins = 0;
function setStage(next) {
  if(next==='summitDone')xp=200;
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
  const trail=trailProblems[Number(level.value)];
  byId('seeds').textContent = '🌱 ' + seeds + ' seeds';
  byId('coins').textContent = '◉ ' + coins + ' coins';
  byId('animation-caption').textContent = {pickup:'Gathering seeds',opening:'The gate is lifting',walk:'Crossing the bridge',brush:'Brushing away the sand',loot:'Collecting treasure',trailEntry:'Following the summit map',trailWalk:'Following the blue lanterns',trailBloom:'Planting three lantern seeds',summitWalk:'Climbing the illuminated ridge'}[stage] || '';
  byId('xp').textContent = '✦ ' + xp + ' XP';
  const labels = {challenge:'01 / SUPPLY CACHE',pickup:'01 / COLLECTING SUPPLIES',path:'02 / READ THE TRAIL',opening:'02 / THE GATE OPENS',move:'02 / TRAIL UNLOCKED',walk:'03 / CROSSING THE GATE',dig:'04 / BURIED TREASURE',brush:'04 / CLEARING SAND',loot:'04 / COLLECTING TREASURE',done:'LEVEL 1 / BRIDGE COMPLETE',trailEntry:'LEVEL 2 / LANTERN RIDGE',trailRead:'LEVEL 2 / READ THE MAP',trailWalk:'LEVEL 2 / FOLLOW THE LANTERNS',trailMath:'LEVEL 2 / WAKE THE FLOWERS',trailBloom:'LEVEL 2 / LIGHT THE RIDGE',trailMove:'LEVEL 2 / PATH OPEN',summitWalk:'LEVEL 2 / CLIMB TO THE LOOKOUT',summitDone:'LEVEL 2 / LOOKOUT REACHED'};
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
    actions([['Level 2: Lantern Ridge →',()=>{setStage('trailEntry');later('trailRead',1800);}],['Replay level 1',reset]]);
  } else if(stage==='trailRead'){
    write('h3','Which way does the map lead?');
    write('p',trail.clue);
    actions(trail.options.map((text,i)=>[text,()=>{
      if(i!==trail.answer){byId('status').textContent='Look for the lanterns marking a safe, open route.';return;}
      xp=125;setStage('trailWalk');later('trailMath',2600);
    }]));
  } else if(stage==='trailMath'){
    write('h3','Wake the lantern flowers');
    write('p','The ridge is dark. Plant 3 seeds from your pack and water the flowers to light the way.');
    write('p',trail.math);
    actions(trail.answers.map(answer=>[answer,()=>{
      if(answer!==trail.correct){byId('status').textContent=trail.hint;return;}
      seeds-=3;xp=160;setStage('trailBloom');later('trailMove',2300);
    }]));
  } else if(stage==='trailMove'){
    write('h3','The ridge is glowing!');
    write('p','Your three seeds grew into lantern flowers. The blue trail is safe to climb.');
    actions([['Move Rowan to the lookout →',()=>{setStage('summitWalk');later('summitDone',3200);}]]);
  } else if(stage==='summitDone'){
    write('h3','You found Mount Ember.');
    write('p','The mountain opens one glowing eye. Rowan has the map, supplies, and courage to meet its guardian.');
    write('p','Two levels complete · 200 XP earned.');
    actions([['Replay the adventure',reset]]);
  } else if(stage==='trailEntry'||stage==='trailWalk'||stage==='trailBloom'||stage==='summitWalk'){
    write('p','Watch Rowan follow the trail.');

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
