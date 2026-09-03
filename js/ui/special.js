// STAT → S.P.E.C.I.A.L.
import { h, stepper, fmtMod } from './dom.js';
import { ABILITIES } from '../data/special.js';

export function renderSpecial(ctx) {
  const { ch, d, update } = ctx;
  const cp = d.creation;
  const perkSpent = Object.values(ch.specialFromPerks || {}).reduce((s, v) => s + (Number(v) || 0), 0);
  return h('div', { class: 'stack' },
    h('div', { class: 'panel' },
      h('h2', {}, 'S.P.E.C.I.A.L.'),
      h('div', { class: 'special-grid' }, ...ABILITIES.map(a => {
        const base = ch.special[a.key] ?? 5;
        const fromPerks = ch.specialFromPerks?.[a.key] || 0;
        const eff = d.special[a.key];
        return h('div', { class: 'box', title: a.blurb },
          h('div', { class: 'k' }, a.name.toUpperCase()),
          h('div', { class: 'v' }, eff),
          h('div', { class: 'm' }, fmtMod(d.mods[a.key])),
          h('div', { class: 'tag' }, 'base'),
          h('div', { class: 'ctl' }, stepper(base, v => update(c => { c.special[a.key] = Math.max(1, Math.min(10, v)); }), { min: 1, max: 10, width: '3em' })),
          h('div', { class: 'tag', style: { marginTop: '4px' } }, 'from perk pts'),
          h('div', { class: 'ctl' }, stepper(fromPerks, v => update(c => { c.specialFromPerks[a.key] = Math.max(0, v); }), { min: 0, max: 9, width: '3em' })),
          eff !== base + fromPerks ? h('div', { class: 'muted', style: { fontSize: '11px' } }, 'racial adj.') : null);
      })),
      h('div', { class: 'row mt between' },
        h('span', { class: cp.remaining === 0 ? 'good' : 'warn' }, `Creation points: ${cp.spent} spent of ${cp.budget} (${cp.remaining} remaining). Every score starts at 5; lowering a score refunds a point.`),
        h('span', { class: d.perkPointsUsed > d.perkPointsAvailable ? 'bad' : '' }, `Perk points used on abilities: ${perkSpent} · Perk points total: ${d.perkPointsUsed} / ${d.perkPointsAvailable}`))),
    h('div', { class: 'grid two' },
      ...ABILITIES.map(a => h('div', { class: 'panel' },
        h('h3', {}, `${a.name} ${d.special[a.key]} (${fmtMod(d.mods[a.key])})`),
        h('p', { class: 'muted' }, a.blurb),
        h('ul', {}, ...abilityFacts(a.key, d).map(f => h('li', {}, f)))))));
}

function abilityFacts(key, d) {
  switch (key) {
    case 'STR': return [`Carry Load ${d.carryMax} (Strength × 10 plus bonuses)`, 'Melee Weapons, Unarmed and Intimidation (optional) skills', 'Weapons above your Strength requirement: −2 to hit per point short'];
    case 'PER': return [`Passive Sense ${d.passiveSense}`, `Combat Sequence ${fmtMod(d.combatSequence)}`, `Ranged weapon ranges are multiplied by ${d.special.PER}`, 'Energy Weapons, Archery, Explosives, Breach and Medicine (optional) skills'];
    case 'END': return [`Hit Points ${d.hpMax}`, `Healing Rate ${d.healingRate}`, d.radThreshold ? `Radiation Threshold ${d.radThreshold}` : 'Immune to radiation', `Block bonus +${d.blockBonus} AC`, `Chem limit ${d.chemLimit} per day`, 'Survival skill'];
    case 'CHA': return [`Party Nerve ${fmtMod(d.partyNerve)} (party total set in Build)`, 'Barter, Speech and Intimidation (optional) skills'];
    case 'INT': return [`Skill points per grant: ${d.perGrant} (levels 5, 9, 13, 17, 21, 25, 29)`, 'Crafting, Science, Breach and Medicine (optional) skills'];
    case 'AGI': return [`Action Points ${d.apMax} (12 + half modifier, max 15)`, `Stamina Points ${d.spMax}`, 'Guns and Sneak skills'];
    case 'LCK': return [`All skills ${fmtMod(d.luck.skills)}`, `Crit chance ${d.luck.crit} (not shotguns)`, `Karma Caps ${d.karmaCaps}`, 'Luck rolls ignore condition penalties'];
    default: return [];
  }
}
