// STAT → Build: identity, race, background, level, starting kit, party.
import { h, field, select, stepper, badge, toast, confirmDialog } from './dom.js';
import { RACES, RACE_BY_ID } from '../data/races.js';
import { BACKGROUNDS, BACKGROUND_BY_ID, STARTING_KITS } from '../data/backgrounds.js';
import { SKILL_KEYS, MAX_LEVEL } from '../data/special.js';
import { addCompendiumItemByName } from './inventory.js';

export function renderBuild(ctx) {
  const { ch, d, update } = ctx;
  const race = RACE_BY_ID[ch.race];
  const variant = race?.variants.find(v => v.id === ch.raceVariant) || race?.variants[0];
  const bg = BACKGROUND_BY_ID[ch.background];
  const xpToNext = Math.max(0, d.level * 1000 - (ch.xp || 0));

  return h('div', { class: 'grid two' },
    h('div', { class: 'stack' },
      h('div', { class: 'panel' },
        h('h2', {}, 'Identity'),
        h('div', { class: 'grid two' },
          field('Character name', h('input', { type: 'text', value: ch.name, onchange: e => update(c => { c.name = e.target.value; }) })),
          field('Player', h('input', { type: 'text', value: ch.player || '', onchange: e => update(c => { c.player = e.target.value; }) })),
          field('Level', stepper(d.level, v => update(c => { c.level = Math.max(1, Math.min(MAX_LEVEL, v)); }), { min: 1, max: MAX_LEVEL, width: '3.5em' })),
          field('XP (1000 per level)', h('span', { class: 'row' }, h('input', { type: 'number', value: ch.xp || 0, style: { width: '6em' }, onchange: e => update(c => { c.xp = Math.max(0, Number(e.target.value) || 0); }) }),
            h('button', { class: 'small', onclick: () => update(c => { c.level = Math.min(MAX_LEVEL, Math.max(1, Math.floor((c.xp || 0) / 1000) + 1)); }) }, 'Set level from XP'),
            h('span', { class: 'muted' }, `${xpToNext} XP to level ${Math.min(MAX_LEVEL, d.level + 1)}`))),
          field('Party Nerve (sum of party CHA mods ÷ 2)', stepper(ch.partyNerve || 0, v => update(c => { c.partyNerve = v; }), { min: -10, max: 20, width: '3.5em' })),
          field('Caps', h('input', { type: 'number', value: ch.caps || 0, style: { width: '6em' }, onchange: e => update(c => { c.caps = Math.max(0, Number(e.target.value) || 0); }) })))),
      h('div', { class: 'panel' },
        h('h2', {}, 'Race'),
        h('div', { class: 'grid two' },
          field('Race', select(RACES.map(r => [r.id, r.name]), ch.race, v => update(c => { c.race = v; c.raceVariant = RACE_BY_ID[v].variants[0].id; c.traits = (c.traits || []).filter(t => t.slot !== 'character' || !['fast_metabolism', 'cheaper_parts', 'dense_circuitry', 'activated_actinides', 'onerous_regeneration'].includes(t.id)); }))),
          field(race?.id === 'robot' ? 'Robot type' : 'Variant', select(race.variants.map(v => [v.id, v.name]), variant?.id, v => update(c => { c.raceVariant = v; })))),
        h('p', { class: 'muted' }, `Size: ${race.size}. ${race.hasRadiationDC ? 'Has a radiation threshold.' : 'Immune to radiation levels.'}${race.noPowerArmor ? ' Cannot use power armor.' : ''}`),
        h('div', { class: 'list mt' },
          ...race.traits.map(t => h('div', { class: 'item' }, h('div', { class: 'title' }, t.name), h('div', { class: 'body' }, t.text))),
          ...(variant?.traits || []).map(t => h('div', { class: 'item' }, h('div', { class: 'title' }, t.name, ' ', badge('variant')), h('div', { class: 'body' }, t.text))))),
    ),
    h('div', { class: 'stack' },
      h('div', { class: 'panel' },
        h('h2', {}, 'Background'),
        field('Background', select(BACKGROUNDS.map(b => [b.id, b.name]), ch.background, v => update(c => { c.background = v; c.backgroundSkills = []; }))),
        bg ? h('p', { class: 'muted mt' }, bg.text) : null,
        bg?.skills ? h('p', {}, 'Skills +2: ', ...bg.skills.map(s => badge(s, 'on'))) : h('div', {},
          h('div', { class: 'tag' }, 'Custom background: choose three skills for +2'),
          h('div', {}, ...SKILL_KEYS.map(k => {
            const on = (ch.backgroundSkills || []).includes(k);
            return h('span', { class: `chip clickable ${on ? 'on' : ''}`, onclick: () => update(c => {
              c.backgroundSkills = c.backgroundSkills || [];
              if (on) c.backgroundSkills = c.backgroundSkills.filter(x => x !== k);
              else if (c.backgroundSkills.length < 3) c.backgroundSkills.push(k);
            }) }, k);
          }))),
        bg?.trait ? h('p', { class: 'muted' }, 'Background trait: pick it on the Traits tab.') : null,
        STARTING_KITS[ch.background] ? h('div', { class: 'row mt' },
          h('button', { onclick: () => confirmDialog(`Add the ${bg.name} starting equipment for a ${race.organic ? 'Human / Ghoul / Super Mutant' : 'Gen-2 Synth / Robot'} to the inventory (plus 50 caps)?`, () => {
            const kit = STARTING_KITS[ch.background][race.organic ? 'organic' : 'machine'];
            let missing = [];
            update(c => { for (const [name, qty] of kit) { if (!addCompendiumItemByName(c, name, qty)) missing.push(name); } c.caps = (c.caps || 0) + 50; });
            toast(missing.length ? `Kit added. Not in compendium (added as custom): ${missing.join(', ')}` : 'Starting kit added.');
          }) }, 'Add starting kit'),
          h('button', { onclick: () => confirmDialog('Take no equipment and start with 850 caps instead?', () => update(c => { c.caps = (c.caps || 0) + 850; })) }, 'Take 850 caps instead')) : null),
      h('div', { class: 'panel' },
        h('h2', {}, 'Level-up checklist'),
        h('ul', {},
          h('li', {}, `Perk points: ${d.perkPointsUsed} / ${d.perkPointsAvailable} (none at levels 5, 9, 13, 17, 19)`),
          h('li', {}, `Skill points: ${d.skillPointsUsed} / ${d.skillPointsAvailable} (${d.perGrant} per grant at INT ${d.special.INT})`),
          h('li', {}, `HP ${d.hpMax} · SP ${d.spMax} · AP ${d.apMax} — recalculated automatically`),
          h('li', {}, `Healing rate ${d.healingRate}`),
          h('li', {}, 'Every 1000 XP is a level. XP is shared: everyone matches the highest total.'))),
      h('div', { class: 'panel' },
        h('h2', {}, 'Bio'),
        h('textarea', { placeholder: 'Appearance, history, goals…', onchange: e => update(c => { c.bio = e.target.value; }) }, ch.bio || ''))));
}
