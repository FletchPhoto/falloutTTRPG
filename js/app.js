// Pip-Boy character sheet — application bootstrap.
import { h, append, clear, fmtMod, toast } from './ui/dom.js';
import { createStore, newCharacter } from './store.js';
import { computeDerived } from './rules.js';
import { renderStatus } from './ui/status.js';
import { renderSpecial } from './ui/special.js';
import { renderSkills } from './ui/skills.js';
import { renderPerks } from './ui/perks.js';
import { renderTraits } from './ui/traits.js';
import { renderBuild } from './ui/build.js';
import { renderInventory, INV_TABS } from './ui/inventory.js';
import { renderData, DATA_TABS } from './ui/data.js';

const TABS = [
  { id: 'stat', label: 'STAT', subtabs: [['status', 'Status'], ['special', 'S.P.E.C.I.A.L.'], ['skills', 'Skills'], ['perks', 'Perks'], ['traits', 'Traits'], ['build', 'Build']] },
  { id: 'inv', label: 'INV', subtabs: INV_TABS },
  { id: 'data', label: 'DATA', subtabs: DATA_TABS },
];

const store = createStore();
let tab = 'stat';
let subtab = 'status';
try {
  const saved = JSON.parse(localStorage.getItem('pipboy.tab') || 'null');
  if (saved && TABS.some(t => t.id === saved.tab)) { tab = saved.tab; subtab = saved.subtab; }
  if (localStorage.getItem('pipboy.fx') === '0') document.documentElement.classList.add('no-fx');
} catch { /* ignore */ }

const $ = id => document.getElementById(id);

function setTab(t, s) {
  tab = t;
  const def = TABS.find(x => x.id === t);
  subtab = s && def.subtabs.some(x => x[0] === s) ? s : def.subtabs[0][0];
  try { localStorage.setItem('pipboy.tab', JSON.stringify({ tab, subtab })); } catch { /* ignore */ }
  render();
}

let rendering = false, pendingRender = false;
function render() {
  if (rendering) { pendingRender = true; return; }
  rendering = true;
  try { doRender(); } finally {
    rendering = false;
    if (pendingRender) { pendingRender = false; queueMicrotask(render); }
  }
}

function doRender() {
  const ch = store.active;
  const d = computeDerived(ch);
  const ctx = {
    store, ch, d, tab, subtab,
    update: fn => store.update(fn),
    setSubtab: s => setTab(tab, s),
    recompute: () => computeDerived(store.active),
  };

  // Character selector
  clear($('charsel')).append(
    h('select', { onchange: e => { if (e.target.value === '__new') { store.add(newCharacter()); toast('New character created.'); } else store.select(e.target.value); } },
      ...store.characters.map(c => h('option', { value: c.id, selected: c.id === ch.id }, `${c.name || 'Unnamed'} (L${c.level})`)),
      h('option', { value: '__new' }, '+ New character…')),
  );

  // Tabs
  clear($('tabs')).append(...TABS.map(t => h('button', { class: `tab ${t.id === tab ? 'active' : ''}`, onclick: () => setTab(t.id) }, t.label)));
  const def = TABS.find(t => t.id === tab);
  clear($('subtabs')).append(...def.subtabs.map(([id, label]) => h('button', { class: `tab ${id === subtab ? 'active' : ''}`, onclick: () => setTab(tab, id) }, label)));

  // Main
  const main = clear($('main'));
  try {
    if (tab === 'stat') {
      main.append({ status: renderStatus, special: renderSpecial, skills: renderSkills, perks: renderPerks, traits: renderTraits, build: renderBuild }[subtab](ctx));
    } else if (tab === 'inv') main.append(renderInventory(ctx));
    else main.append(renderData(ctx));
  } catch (err) {
    console.error(err);
    main.append(h('div', { class: 'panel bad' }, 'Display error: ', err.message));
  }

  // Status bar
  const hp = ch.hp.current ?? d.hpMax, sp = ch.sp.current ?? d.spMax, ap = ch.ap.current ?? d.apMax;
  append(clear($('statusbar')), 
    h('span', { class: 'stat' }, 'HP ', h('b', {}, `${hp}/${d.hpMax}`)),
    h('span', { class: 'stat' }, 'SP ', h('b', {}, `${sp}/${d.spMax}`)),
    h('span', { class: 'stat' }, 'AP ', h('b', {}, `${ap}/${d.apMax}`)),
    h('span', { class: 'stat' }, 'AC ', h('b', {}, d.ac)),
    h('span', { class: 'stat' }, 'DT ', h('b', {}, d.dt)),
    h('span', { class: 'stat' }, 'LOAD ', h('b', { class: d.encumbrance === 'none' ? '' : 'warn' }, `${d.load.total}/${d.carryMax}`)),
    h('span', { class: 'stat' }, 'CAPS ', h('b', {}, ch.caps || 0)),
    d.radThreshold ? h('span', { class: 'stat' }, 'RADS ', h('b', {}, `${ch.rads || 0}/${d.radThreshold}`)) : null,
    h('span', { class: 'stat' }, 'SEQ ', h('b', {}, fmtMod(d.combatSequence))),
    d.d20Penalty ? h('span', { class: 'stat warn' }, 'd20 ', h('b', {}, `−${d.d20Penalty}`)) : null,
  );
}

store.subscribe(render);
render();
