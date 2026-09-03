// STAT → Traits
import { h, select, badge } from './dom.js';
import { TRAITS, TRAIT_BY_ID } from '../data/traits.js';
import { BACKGROUND_BY_ID } from '../data/backgrounds.js';
import { SKILL_KEYS } from '../data/special.js';

export function renderTraits(ctx) {
  const { ch, d, update } = ctx;
  const bg = BACKGROUND_BY_ID[ch.background];
  const traits = ch.traits || [];
  const charTraits = TRAITS.filter(t => t.kind !== 'background' && (!t.prereq?.race || t.prereq.race.includes(ch.race)) && (!t.prereq?.abilityMax || Object.values(d.special).some(v => v <= t.prereq.abilityMax)));
  const bgTraits = TRAITS.filter(t => t.kind === 'background');

  const slot = (label, options, current, setId) => {
    const sel = traits.find(t => t.id && options.some(o => o.id === t.id) && t.slot === current.slot);
    const def = sel ? TRAIT_BY_ID[sel.id] : null;
    const choice = def ? (sel.wild && def.wild?.choice ? def.wild.choice : def.choice) : null;
    const noChoice = def && sel.wild && def.wild?.noChoice;
    return h('div', { class: 'panel' },
      h('h2', {}, label),
      select([['', '— none —'], ...options.map(o => [o.id, o.name + (o.id === bg?.trait ? ' (your background)' : '')])], sel?.id || '', v => setId(v)),
      def ? h('div', { class: 'mt' },
        h('div', { class: 'row' },
          h('label', { class: 'inline' }, h('input', { type: 'checkbox', checked: !!sel.wild, onchange: e => update(c => { c.traits.find(t => t.slot === current.slot).wild = e.target.checked; }) }), 'Wild Wasteland'),
          def.kind === 'racial' ? badge('racial') : def.kind === 'background' ? badge('background') : badge('character')),
        h('p', {}, sel.wild && def.wild ? def.wild.text : def.text),
        sel.wild && def.wild ? h('p', { class: 'muted' }, 'Standard: ', def.text) : null,
        choice && !noChoice ? h('div', {},
          h('div', { class: 'tag' }, `Choose ${choice.skills} skill${choice.skills > 1 ? 's' : ''} (${choice.value > 0 ? '+' : ''}${choice.value} each)`),
          h('div', {}, ...SKILL_KEYS.map(k => {
            const on = (sel.skills || []).includes(k);
            return h('span', { class: `chip clickable ${on ? 'on' : ''}`, onclick: () => update(c => {
              const t = c.traits.find(t => t.slot === current.slot);
              t.skills = t.skills || [];
              if (on) t.skills = t.skills.filter(x => x !== k);
              else if (t.skills.length < choice.skills) t.skills.push(k);
            }) }, k);
          }))) : null) : null);
  };

  const setSlot = (slotName, id) => update(c => {
    c.traits = (c.traits || []).filter(t => t.slot !== slotName);
    if (id) c.traits.push({ id, slot: slotName, wild: false, skills: [] });
  });

  return h('div', { class: 'stack' },
    h('p', { class: 'muted' }, 'Traits are optional. You may take one character trait (racial traits count as character traits) and your background\'s trait. Wild Wasteland doubles the numbers or swaps in the wilder version.'),
    h('div', { class: 'grid two' },
      slot('Character trait', charTraits, { slot: 'character' }, id => setSlot('character', id)),
      slot('Background trait', bgTraits, { slot: 'background' }, id => setSlot('background', id))),
    h('div', { class: 'panel' },
      h('h3', {}, 'Active numeric effects'),
      d.effects.length ? h('div', {}, ...d.effects.filter(e => e.value != null || ['packRat', 'noPartyNerve', 'countsAsRobot', 'bladedUsesAgi', 'immuneEncumbered', 'gainsRadiation'].includes(e.type)).map(e => badge(`${e.source}: ${e.type}${e.weapon ? ` (${e.weapon})` : ''}${e.skill ? ` ${e.skill}` : ''}${e.ability ? ` ${e.ability}` : ''} ${e.value != null ? (e.value > 0 ? '+' : '') + e.value : ''}`))) : h('p', { class: 'muted' }, 'None.')));
}
