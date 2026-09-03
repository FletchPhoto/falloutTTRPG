// STAT → Status: pools, conditions, derived numbers, warnings.
import { h, bar, stepper, table, fmtMod } from './dom.js';
import { ABILITIES } from '../data/special.js';
import { RACE_BY_ID } from '../data/races.js';
import { BACKGROUND_BY_ID } from '../data/backgrounds.js';

const VAULT_BOY = `      .-"""-.
     / .===. \\
     \\/ 6 6 \\/
     ( \\___/ )
___ooo__\\_/__ooo___
`;

export function renderStatus(ctx) {
  const { ch, d, update } = ctx;
  const hpCur = ch.hp.current ?? d.hpMax;
  const spCur = ch.sp.current ?? d.spMax;
  const apCur = ch.ap.current ?? d.apMax;

  const pool = (label, cur, max, temp, onCur, onTemp) => h('div', { class: 'pool' },
    h('b', {}, label),
    bar(cur, max, { temp }),
    h('div', { class: 'ctl' },
      stepper(cur, v => onCur(Math.max(0, v)), { min: 0, max: max + 50, width: '3.6em' }),
      onTemp ? h('span', { class: 'muted', title: 'Temporary points' }, ' tmp ') : null,
      onTemp ? h('input', { type: 'number', value: temp, min: 0, style: { width: '3.2em' }, onchange: e => onTemp(Math.max(0, Number(e.target.value))) }) : null));

  const warnings = [];
  if (d.encumbrance === 'encumbered') warnings.push('Encumbered: 2 AP per 5 feet, travel pace halved, fatigue each hour.');
  if (d.encumbrance === 'heavy') warnings.push('Heavily encumbered: 3 AP per 5 feet.');
  if (d.bagWarning) warnings.push('Wearing more than one bag with STR and END below 8: encumbered.');
  if (d.armorStrWarning) warnings.push(d.armorStrWarning);
  if (d.perkPointsUsed > d.perkPointsAvailable) warnings.push(`Perk points overspent: ${d.perkPointsUsed} / ${d.perkPointsAvailable}.`);
  if (d.skillPointsUsed > d.skillPointsAvailable) warnings.push(`Skill points overspent: ${d.skillPointsUsed} / ${d.skillPointsAvailable}.`);
  if (d.creation.remaining !== 0) warnings.push(`S.P.E.C.I.A.L. creation points: ${d.creation.remaining > 0 ? d.creation.remaining + ' unspent' : (-d.creation.remaining) + ' overspent'}.`);
  if (d.d20Penalty) warnings.push(`Conditions impose −${d.d20Penalty} on all d20 rolls (except Luck).`);
  if (hpCur === 0) warnings.push('DYING — spend 2 AP for a Death Save (DC 12).');
  for (const w of d.weapons) if (w.stats?.notes?.length) for (const n of w.stats.notes) if (/BROKEN/.test(n)) warnings.push(`${w.item.name}: ${n}`);

  const race = RACE_BY_ID[ch.race];
  const bg = BACKGROUND_BY_ID[ch.background];

  const cond = ch.conditions;
  const condRow = (key, label, max = 10) => h('div', { class: 'row between' }, h('span', {}, label),
    stepper(cond[key] || 0, v => update(c => { c.conditions[key] = Math.max(0, Math.min(max, v)); }), { min: 0, max, width: '3.2em' }));

  return h('div', { class: 'grid two' },
    h('div', { class: 'panel' },
      h('h2', {}, ch.name || 'Unnamed', ' ', h('small', { class: 'tag' }, `Level ${d.level} ${race?.name || ''} · ${bg?.name || ''}`)),
      h('pre', { class: 'vaultboy' }, VAULT_BOY),
      pool('HP', hpCur, d.hpMax, ch.hp.temp || 0, v => update(c => { c.hp.current = v; }), v => update(c => { c.hp.temp = v; })),
      pool('SP', spCur, d.spMax, ch.sp.temp || 0, v => update(c => { c.sp.current = v; }), v => update(c => { c.sp.temp = v; })),
      pool('AP', apCur, d.apMax, 0, v => update(c => { c.ap.current = v; })),
      d.dp != null ? pool('DP', ch.dp.current ?? d.dp, d.dp, 0, v => update(c => { c.dp.current = v; })) : null,
      h('div', { class: 'row mt' },
        h('button', { class: 'small', onclick: () => update(c => { c.ap.current = null; }) }, 'New turn (reset AP)'),
        h('button', { class: 'small', onclick: () => update(c => { c.sp.current = Math.max(spCur, Math.floor(d.spMax / 2)); c.ap.current = null; }) }, 'Short rest (SP → ½)'),
        h('button', { class: 'small', onclick: () => update(c => { c.hp.current = Math.min(d.hpMax, hpCur + Math.floor(d.special.END / 2) + d.level); c.sp.current = d.spMax; c.ap.current = null; c.hp.temp = 0; c.sp.temp = 0; c.magazineActive = {}; if (c.conditions.exhaustion > 0) c.conditions.exhaustion--; }) }, 'Long rest'),
        h('button', { class: 'small', onclick: () => update(c => { c.hp.current = d.hpMax; c.sp.current = d.spMax; c.ap.current = null; }) }, 'Full heal')),
      h('div', { class: 'row mt' },
        h('span', {}, 'Karma Caps: '),
        h('span', {}, ...Array.from({ length: d.karmaCaps }, (_, i) => h('span', { class: `chip clickable ${i < (d.karmaCaps - (ch.karmaFlipped || 0)) ? 'on' : ''}`, title: 'Click to flip', onclick: () => update(c => { c.karmaFlipped = i < (d.karmaCaps - (c.karmaFlipped || 0)) ? (c.karmaFlipped || 0) + 1 : Math.max(0, (c.karmaFlipped || 0) - 1); }) }, i < (d.karmaCaps - (ch.karmaFlipped || 0)) ? '● UP' : '○ FLIPPED'))),
        h('span', { class: 'muted' }, `(${d.karmaCaps} total)`)),
      warnings.length ? h('div', { class: 'mt' }, ...warnings.map(w => h('div', { class: 'warn' }, '⚠ ', w))) : h('div', { class: 'mt good' }, 'All systems nominal.'),
    ),
    h('div', { class: 'stack' },
      h('div', { class: 'panel' },
        h('h2', {}, 'Derived'),
        h('div', { class: 'grid three' },
          stat('Armor Class', d.ac, d.armorName),
          stat('Damage Threshold', d.dt, d.armorDecayPenalty ? `armor decay −${d.armorDecayPenalty}` : ''),
          stat('Healing Rate', d.healingRate, '(level + END) ÷ 2'),
          stat('Passive Sense', d.passiveSense, '12 + PER mod'),
          stat('Combat Sequence', fmtMod(d.combatSequence), 'd20 + this'),
          stat('Carry Load', `${d.load.total} / ${d.carryMax}`, d.encumbrance === 'none' ? 'OK' : d.encumbrance.toUpperCase()),
          stat('Rad Threshold', d.radThreshold ?? '—', d.radThreshold ? `RADs ${ch.rads || 0}; −${d.radReduction} per 2d4` : 'Immune to radiation'),
          stat('Party Nerve', fmtMod(d.partyNerve), 'set in Build'),
          stat('Death Save', `DC ${d.deathSave.dc}`, `d20 ${fmtMod(d.deathSave.bonus)}`),
          stat('Block (3 AP)', `+${d.blockBonus} AC`, 'vs melee, −2 per hit'),
          stat('Chem Limit', d.chemLimit, 'per day'),
          stat('Max AP', d.apMax, '12 + ½ AGI mod'),
        )),
      h('div', { class: 'panel' },
        h('h2', {}, 'Conditions'),
        d.radThreshold ? h('div', { class: 'row between' }, h('span', {}, `RADs (threshold ${d.radThreshold})`),
          h('span', { class: 'row' },
            stepper(ch.rads || 0, v => update(c => {
              c.rads = Math.max(0, v);
              while (d.radThreshold && c.rads >= d.radThreshold) { c.rads -= d.radThreshold; c.conditions.radLevels = Math.min(10, (c.conditions.radLevels || 0) + 1); }
            }), { min: 0, width: '3.4em' }),
            h('button', { class: 'small', title: 'Roll 2d4 minus your rad reduction (minimum 1)', onclick: () => update(c => {
              const roll = Math.max(1, (1 + Math.floor(Math.random() * 4)) + (1 + Math.floor(Math.random() * 4)) - d.radReduction);
              c.rads = (c.rads || 0) + roll;
              while (c.rads >= d.radThreshold) { c.rads -= d.radThreshold; c.conditions.radLevels = Math.min(10, (c.conditions.radLevels || 0) + 1); }
            }) }, '+2d4'))) : null,
        condRow('radLevels', 'Radiation levels (−1 d20, −2 HP/SP each)'),
        condRow('hunger', 'Hunger'),
        condRow('dehydration', 'Dehydration'),
        condRow('exhaustion', 'Exhaustion'),
        condRow('fatigue', 'Fatigue (max 9)', 9),
        condRow('bleeding', 'Bleeding levels'),
        condRow('alcohol', 'Alcohol level (1 buzzed → 4 wasted)', 4),
        condRow('hypothermia', 'Hypothermia'),
        condRow('overheating', 'Overheating'),
        h('label', { class: 'field mt' }, 'Other conditions / limb injuries',
          h('input', { type: 'text', value: cond.other || '', placeholder: 'e.g. Broken Arm, Burning, Dazed 2 turns', onchange: e => update(c => { c.conditions.other = e.target.value; }) })),
        d.d20Penalty ? h('div', { class: 'warn mt' }, `Total penalty to d20 rolls: −${d.d20Penalty}`) : null),
      h('div', { class: 'panel' },
        h('h2', {}, 'Ready weapons'),
        d.weapons.length ? table(['Weapon', 'AP', { label: 'Hit', class: 'num' }, 'Damage', 'Crit', 'Range'],
          d.weapons.filter(w => w.item.equipped).concat(d.weapons.filter(w => !w.item.equipped)).slice(0, 6).map(w => [
            h('span', { class: w.item.equipped ? 'good' : 'muted' }, w.item.equipped ? '▶ ' : '', w.item.name),
            w.stats.ap, { v: fmtMod(w.stats.attack), class: 'num' }, `${w.stats.damage} ${fmtMod(w.stats.dmgBonus)}`, `${w.stats.crit}+`, w.stats.rangeText])) : h('p', { class: 'muted' }, 'No weapons carried. Unarmed strike: 3 AP, 1d4 ', fmtMod(d.unarmed.dmgBonus), ' bludgeoning, hit ', fmtMod(d.unarmed.attack), '.')),
    ));
}

function stat(label, value, sub) {
  return h('div', { class: 'center' }, h('div', { class: 'tag' }, label), h('div', { class: 'big' }, value), sub ? h('div', { class: 'muted', style: { fontSize: '12px' } }, sub) : null);
}
