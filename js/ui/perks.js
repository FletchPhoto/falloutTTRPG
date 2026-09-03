// STAT → Perks
import { h, modal, closeModal, sourceBadge, badge } from './dom.js';
import { PERKS, PERK_BY_ID, PERK_CATEGORIES } from '../data/perks.js';
import { perkAvailability } from '../rules.js';

const CAT_NAMES = { STR: 'Strength', PER: 'Perception', END: 'Endurance', CHA: 'Charisma', INT: 'Intelligence', AGI: 'Agility', LCK: 'Luck', General: 'General', Race: 'Race' };

export function renderPerks(ctx) {
  const { ch, d, update } = ctx;
  const left = d.perkPointsAvailable - d.perkPointsUsed;
  const taken = (ch.perks || []).map(p => ({ ...p, def: PERK_BY_ID[p.id] })).filter(p => p.def);
  return h('div', { class: 'stack' },
    h('div', { class: 'panel' },
      h('div', { class: 'row between' },
        h('h2', {}, 'Perks'),
        h('span', { class: left < 0 ? 'bad' : left > 0 ? 'warn' : 'good' }, `Perk points: ${d.perkPointsUsed} / ${d.perkPointsAvailable}${left > 0 ? ` — ${left} to spend` : ''}`),
        h('button', { class: 'primary', onclick: () => openPicker(ctx) }, '+ Choose perk')),
      h('p', { class: 'muted' }, 'One perk point per level except 5th, 9th, 13th, 17th and 19th. A perk point can instead raise an ability score by 1 (see S.P.E.C.I.A.L.). ', badge('CHANGES', 'src-changes'), ' marks perks rewritten or added by the Changes document.'),
      taken.length ? h('div', { class: 'list' }, ...taken.map(p => h('div', { class: 'item' },
        h('div', { class: 'title' },
          h('span', {}, p.def.name, p.count > 1 ? ` ×${p.count}` : '', ' ', h('span', { class: 'tag' }, CAT_NAMES[p.def.cat]), ' ', sourceBadge(p.def.source)),
          h('span', { class: 'row' },
            p.def.repeat > 1 && p.count < p.def.repeat ? h('button', { class: 'small', onclick: () => update(c => { c.perks.find(x => x.id === p.id).count++; }) }, '+1') : null,
            h('button', { class: 'small danger', onclick: () => update(c => { const x = c.perks.find(x => x.id === p.id); if (x.count > 1) x.count--; else c.perks = c.perks.filter(y => y.id !== p.id); }) }, p.count > 1 ? '−1' : 'Remove'))),
        h('div', { class: 'body' }, p.def.text),
        p.def.req?.text || p.def.req?.ability || p.def.req?.race || p.def.req?.level ? h('div', { class: 'tag' }, reqText(p.def)) : null))) : h('p', { class: 'muted' }, 'No perks chosen yet.')));
}

function reqText(def) {
  const r = def.req || {};
  const parts = [];
  if (r.ability && r.min != null) parts.push(`${r.ability} ${r.min}`);
  if (r.ability && r.max != null) parts.push(`${r.ability} ${r.max} or lower`);
  if (r.race) parts.push(r.race.map(x => ({ human: 'Human', ghoul: 'Ghoul', synth: 'Synth', robot: 'Robot', supermutant: 'Super Mutant' }[x] || x)).join('/'));
  if (r.level) parts.push(`Level ${r.level}`);
  if (r.text) parts.push(r.text);
  return parts.length ? `Requires: ${parts.join(', ')}${def.repeat > 1 ? ` · repeatable ×${def.repeat}` : ''}` : (def.repeat > 1 ? `Repeatable ×${def.repeat}` : 'No requirements');
}

function openPicker(ctx) {
  const { ch, d, update } = ctx;
  let query = '';
  let cat = 'all';
  let onlyAvailable = true;
  const body = h('div', {});
  const draw = () => {
    body.replaceChildren();
    const list = PERKS.filter(p => (cat === 'all' || p.cat === cat) && (!query || p.name.toLowerCase().includes(query) || p.text.toLowerCase().includes(query)))
      .map(p => ({ p, av: perkAvailability(ch, p, d) }))
      .filter(x => !onlyAvailable || x.av.ok);
    body.append(h('div', { class: 'list picker' }, ...list.map(({ p, av }) => h('div', { class: `item ${av.ok ? '' : 'off'}` },
      h('div', { class: 'title' },
        h('span', {}, p.name, ' ', h('span', { class: 'tag' }, CAT_NAMES[p.cat]), ' ', sourceBadge(p.source), av.taken ? badge(`taken ${av.taken}/${av.max}`) : null),
        h('button', { class: 'small primary', disabled: !av.ok, onclick: () => { update(c => { const x = c.perks.find(x => x.id === p.id); if (x) x.count = (x.count || 1) + 1; else c.perks.push({ id: p.id, count: 1 }); }); closeModal(); } }, 'Take')),
      h('div', { class: 'body' }, p.text),
      h('div', { class: av.ok ? 'tag' : 'tag bad' }, av.ok ? reqText(p) : av.reasons.join(' · '))))));
    if (!list.length) body.append(h('p', { class: 'muted' }, 'No perks match.'));
  };
  const controls = h('div', { class: 'row' },
    h('input', { type: 'text', placeholder: 'Search perks…', style: { width: '200px' }, oninput: e => { query = e.target.value.toLowerCase(); draw(); } }),
    h('select', { style: { width: 'auto' }, onchange: e => { cat = e.target.value; draw(); } }, h('option', { value: 'all' }, 'All categories'), ...PERK_CATEGORIES.map(c => h('option', { value: c }, CAT_NAMES[c]))),
    h('label', { class: 'inline' }, h('input', { type: 'checkbox', checked: true, onchange: e => { onlyAvailable = e.target.checked; draw(); } }), 'Only available'));
  draw();
  modal(`Choose a perk (${d.perkPointsAvailable - d.perkPointsUsed} point${d.perkPointsAvailable - d.perkPointsUsed === 1 ? '' : 's'} left)`, h('div', { class: 'stack' }, controls, body), { wide: true });
}
