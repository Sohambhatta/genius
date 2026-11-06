'use strict';
const $ = id => document.getElementById(id);
const routes = {
  grove: {
    name:'Mosswood', guardian:'Brambleback', reward:'Cooling seed',
    story:'A pebble rolls down the bridge. Then it yawns. Brambleback lifts one mossy eyebrow. “Help me pack these seeds, and I’ll lend you one that can cool even molten rock.”',
    problems:[
      ['Brambleback has 3 seeds. Rowan brings 2 more.','How many seeds are there now?',['4','5','6'],1,'Start at three and count two more.'],
      ['There are 4 seed pods with 6 seeds in each pod. Brambleback plants 5 seeds by the bridge.','How many seeds are left?',['19','24','29'],0,'Find 4 groups of 6 first. Then take away the 5 he planted.'],
      ['Brambleback collected 48 seeds. He keeps ¼ for the forest. The rest are shared equally among 6 gardens.','How many seeds does each garden get?',['6','8','12'],0,'Find one quarter of 48. Subtract that amount, then divide the rest by six.']
    ]
  },
  falls: {
    name:'Moonfall', guardian:'Vesper', reward:'Echo shell',
    story:'Vesper the owl folds her wings over a shell. “Everyone hears the waterfall. A good mapmaker listens for the details.”',
    problems:[
      ['Vesper puts a red shell on a rock. A blue shell floats by.','Which shell did Vesper put on the rock?',['The blue shell','The red shell','Both shells'],1,'Read the first sentence again. Look for the color next to “shell.”'],
      ['At dusk, Vesper tucked the shell under a dry ledge. “A wet shell keeps no echo,” she told Rowan. The rain began a moment later.','Why did Vesper put the shell under the ledge?',['To keep its echo safe','To make it easier to see','To wash the shell'],0,'Look at what happens to the echo when a shell gets wet.'],
      ['Rowan rang the brass bell. The sound scattered in the windy gorge. Vesper held the shell near the stone wall, and a voice came back clear. “Let the mountain speak for itself,” she said.','Which detail best supports the idea that the wall helped carry sound?',['Rowan brought a brass bell.','A voice came back clear near the wall.','The gorge was windy.'],1,'Choose the detail that describes what happened when the shell was held near the wall.']
    ]
  }
};
const finalReading = [
  ['Ember says, “My feet are hot!” He holds up a foot with a sharp rock stuck in it.','What is hurting Ember?',['A sharp rock','Cold water','The wind'],0,'Look at what is stuck in Ember’s foot.'],
  ['When Ember took a step, the cracked vent hissed. He flinched, pressed his foot down on it, and the hiss stopped. “I’m trying to hold it shut,” he said.','Why does Ember keep his foot on the vent?',['He wants to block the steam.','He wants the village to shake.','He is looking for his shell.'],0,'Notice what happens to the hiss when Ember covers the vent.'],
  ['Ember roared whenever the ground shook. From the ridge, Rowan saw him brace a boulder against a widening crack. “If it opens, the river will boil,” he whispered.','Which detail best shows Ember is trying to protect the valley?',['He roared when the ground shook.','He braced a boulder against the crack.','Rowan watched from the ridge.'],1,'Pick the action that could keep the crack from opening.']
];
const finalMath = [
  ['Rowan finds 5 cool stones and uses 2 at the first vent.','How many stones are left?',['2','3','7'],1,'Count back two from five.'],
  ['There are 3 vents. Each vent needs 4 cool stones. Rowan already placed 5 stones.','How many more stones does Rowan need?',['5','7','12'],1,'Find how many stones all three vents need. Then subtract the five already placed.'],
  ['Rowan has 36 cool stones. One third go to the north vent. The remaining stones are shared equally among 4 smaller vents.','How many stones go to each smaller vent?',['6','8','9'],0,'Subtract one third of 36, then divide the remainder among four vents.']
];
const notes = {grove:'Mosswood · Brambleback guards the forest bridge.', falls:'Moonfall · Vesper keeps the echoes of the kingdom.', summit:'Mount Ember · A route tool and both skills unlock the summit.'};
const difficulty = $('difficulty');
let route = null, step = 'trail', xp = 0;
function show(tag, content, parent = $('game-body')) {
  const el = document.createElement(tag);
  el.textContent = content;
  parent.append(el);
  return el;
}
function choices(options) {
  const list = show('div','');
  list.className = 'choices';
  options.forEach(([label, action]) => {
    const button = show('button',label,list);
    button.type = 'button';
    button.onclick = action;
  });
}
function advance(next, amount = 0) {
  xp += amount;
  step = next;
  render(true);
}
function start(which) {
  route = which;
  xp = 0;
  advance('guardian');
  $('quest').scrollIntoView({block:'start'});
}
function reset() {
  route = null;
  xp = 0;
  advance('trail');
}
function question(title, item, next, amount, flavor) {
  const [passage, prompt, options, answer, hint] = item;
  show('h3',title);
  if (flavor) show('p',flavor);
  show('blockquote',passage);
  if ('speechSynthesis' in window) {
    const read = show('button','♫ Read the clue aloud');
    read.className = 'read';
    read.onclick = () => {
      window.speechSynthesis.cancel();
      const voice = new SpeechSynthesisUtterance(passage + ' ' + prompt);
      voice.rate = .86;
      window.speechSynthesis.speak(voice);
    };
  }
  show('p',prompt);
  choices(options.map((option, i) => [option, () => {
    if (i === answer) advance(next, amount);
    else $('status').textContent = 'Try again. ' + hint;
  }]));
}
function render(focus = false) {
  window.speechSynthesis?.cancel();
  const body = $('game-body');
  body.replaceChildren();
  $('status').textContent = '';
  const info = routes[route];
  const level = Number(difficulty.value);
  $('xp').textContent = xp + ' XP';
  $('progress').value = xp;
  $('inventory').textContent = xp ? 'Pack: compass, journal, ' + info.reward.toLowerCase() + '.' : 'Pack: a compass and an empty journal.';
  $('chapter').textContent = {trail:'TRAILHEAD',guardian:info?.name.toUpperCase(),summit:'SUMMIT UNLOCKED',reading:'MOUNT EMBER / READ',math:'MOUNT EMBER / SOLVE',won:'CHAPTER COMPLETE'}[step];
  if (step === 'trail') {
    show('h3','Which way, Rowan?');
    show('p','The trails split just outside the village. Both lead to Mount Ember, but each has its own guardian and reward.');
    choices([['Mosswood · Help Brambleback',()=>start('grove')],['Moonfall · Listen to Vesper',()=>start('falls')]]);
  } else if (step === 'guardian') {
    question(info.guardian,info.problems[level],'summit',40,info.story);
  } else if (step === 'summit') {
    show('h3',info.reward + ' earned!');
    show('p',route === 'grove' ? 'You plant the seed in a crack. It sprouts into a cool, green stairway up the mountain.' : 'You raise the echo shell. Ember hears you and stretches out a stone hand to lift you across the crater.');
    choices([['Enter Mount Ember →',()=>advance('reading')]]);
  } else if (step === 'reading') {
    question('Listen to Ember',finalReading[level],'math',30,'The mountain guardian looks relieved to see you. Get close enough to find out what happened.');
  } else if (step === 'math') {
    question('Cool the crater',finalMath[level],'won',30,'Now that you know what’s wrong, help Ember make the crater safe.');
  } else {
    show('h3','Bramblewick is safe.');
    show('p',route === 'grove' ? 'Roots curl into the cracks. Ember leans back and laughs, and the village sees green leaves on the mountain for the first time.' : 'The echo shell carries Ember’s thank-you all the way to the village. In the quiet that follows, the river runs clear again.');
    choices([['Try the other route ↗',()=>start(route==='grove'?'falls':'grove')],['Back to the trailhead',reset]]);
  }
  document.body.dataset.quest = step;
  document.body.dataset.route = route || '';
  window.dispatchEvent(new CustomEvent('questview',{detail:{step,route}}));
  if (focus) {
    const heading = body.querySelector('h3');
    heading.tabIndex = -1;
    heading.focus({preventScroll:true});
  }
}
difficulty.onchange = reset;
document.querySelectorAll('[data-start]').forEach(button => button.onclick = () => start(button.dataset.start));
document.querySelectorAll('[data-route]').forEach(button => button.onclick = () => {
  $('map-note').textContent = notes[button.dataset.route];
  window.dispatchEvent(new CustomEvent('mapview',{detail:button.dataset.route}));
});
const embers = document.querySelector('.embers');
for (let i = 0; i < 25; i++) {
  const spark = show('span','',embers);
  spark.style.left = (35 + (i*29)%64) + '%';
  spark.style.setProperty('--duration', (6 + i%9) + 's');
  spark.style.setProperty('--delay', (-i*.87) + 's');
}
render();
