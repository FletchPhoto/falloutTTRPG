// STAT → Skills
import { h, stepper, select, fmtMod, modal, table } from './dom.js';
import { SKILLS } from '../data/special.js';
import { MAGAZINES } from '../data/consumables.js';

export function renderSkills(ctx) {
  const { ch, d, update } = ctx;
  const spLeft = d.skillPointsAvailable - d.skillPointsUsed;
  const dvLeft = d.devoutAvailable - d.devoutUsed;
  return h('div', { class: 'stack' },
    h('div', { class: 'panel' },
      h('div', { class: 'row between' },
        h('h2', {}, 'Skills'),
        h('span', { class: spLeft < 0 ? 'bad' : spLeft > 0 ? 'warn' : 'good' }, `Skill points: ${d.skillPointsUsed} / ${d.skillPointsAvailable}`,
          d.devoutAvailable ? ` · Devout Study: ${d.devoutUsed} / ${d.devoutAvailable}` : '')),
      h('p', { class: 'muted' }, `Skill points are granted at levels 5, 9, 13, 17, 21, 25 and 29 (${d.perGrant} per grant at your Intelligence). Luck ${fmtMod(d.luck.skills)} to all skills. Click a total for the breakdown.`),
      table(['Skill', 'Ability', { label: 'Total', class: 'num' }, 'Points', 'Misc', 'Magazines'], SKILLS.map(s => {
        const sk = d.skills[s.key];
        const abilityCtl = s.abilities.length > 1
          ? select(s.abilities, sk.ability, v => update(c => { c.skillAbilityChoice[s.key] = v; }), { style: { width: 'auto' } })
          : s.abilities[0];
        const mags = MAGAZINES.filter(m => m.skill === s.key);
        return [
          h('span', {}, s.key, s.source === 'changes' ? h('span', { class: 'chip src-changes' }, 'NEW') : null),
          abilityCtl,
          { v: h('button', { class: 'ghost', style: { fontSize: '18px', color: 'var(--g5)' }, onclick: () => showBreakdown(sk) }, fmtMod(sk.total)), class: 'num' },
          h('span', { class: 'row', style: { flexWrap: 'nowrap' } },
            stepper(ch.skillPoints[s.key] || 0, v => update(c => { c.skillPoints[s.key] = Math.max(0, v); }), { min: 0, width: '3em' }),
            d.devoutAvailable ? h('span', { class: 'muted', title: 'Devout Study points (max 2 per skill)' }, ' DS ', stepper(ch.devoutSkillPoints[s.key] || 0, v => update(c => { c.devoutSkillPoints[s.key] = Math.max(0, Math.min(2, v)); }), { min: 0, max: 2, width: '3em' })) : null),
          h('input', { type: 'number', value: ch.skillMisc[s.key] || 0, style: { width: '3.5em' }, title: 'Misc / GM bonus', onchange: e => update(c => { c.skillMisc[s.key] = Number(e.target.value) || 0; }) }),
          mags.length ? h('span', { class: 'row', style: { flexWrap: 'nowrap' } },
            h('span', { class: 'muted', title: mags[0].name }, 'read '),
            stepper(ch.magazinesRead[s.key] || 0, v => update(c => { c.magazinesRead[s.key] = Math.max(0, v); }), { min: 0, width: '3em' }),
            h('label', { class: 'inline muted', title: '+1 until you rest' }, h('input', { type: 'checkbox', checked: !!ch.magazineActive[s.key], onchange: e => update(c => { c.magazineActive[s.key] = e.target.checked; }) }), 'active')) : h('span', { class: 'muted' }, '—'),
        ];
      })),
    ),
    h('div', { class: 'panel' },
      h('h3', {}, 'Difficulty classes'),
      h('p', {}, 'Very Easy 4 · Easy 8 · Medium 12 · Hard 16 · Very Hard 20 · Nearly Impossible 25 · Extremely small chance 30')));
}

function showBreakdown(sk) {
  modal(`${sk.key} ${fmtMod(sk.total)}`, h('div', {},
    table(['Source', { label: 'Bonus', class: 'num' }], sk.parts.map(p => [p.label, { v: fmtMod(p.value), class: 'num' }])),
    h('p', { class: 'muted mt' }, 'Roll d20 + this total. Condition penalties (hunger, rads, exhaustion…) apply on top.')));
}
