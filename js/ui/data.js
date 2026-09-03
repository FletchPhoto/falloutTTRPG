// DATA tab: notes, rules reference, conditions, characters (import/export), settings.
import { h, table, field, toast, confirmDialog, modal, closeModal, badge } from './dom.js';
import { RULE_NOTES, ACTIONS, TARGETED_ATTACKS, CONDITIONS, MINOR_DISEASES } from '../data/rules_text.js';
import { RANGED_PROPERTIES, MELEE_PROPERTIES } from '../data/weapons.js';
import { EXPLOSIVE_PROPERTIES, SPECIAL_AMMO, SYRINGES } from '../data/items.js';
import { FOOD_PROPERTIES } from '../data/consumables.js';
import { exportCharacter, importCharacter, newCharacter } from '../store.js';
import { RACE_BY_ID } from '../data/races.js';

export const DATA_TABS = [['notes', 'Notes'], ['rules', 'Rules'], ['combat', 'Combat'], ['conditions', 'Conditions'], ['properties', 'Properties'], ['characters', 'Characters'], ['about', 'About']];

export function renderData(ctx) {
  switch (ctx.subtab) {
    case 'rules': return renderRules();
    case 'combat': return renderCombat();
    case 'conditions': return renderConditions();
    case 'properties': return renderProperties();
    case 'characters': return renderCharacters(ctx);
    case 'about': return renderAbout();
    default: return renderNotes(ctx);
  }
}

function renderNotes(ctx) {
  const { ch, update } = ctx;
  return h('div', { class: 'grid two' },
    h('div', { class: 'panel' }, h('h2', {}, 'Notes'), h('textarea', { style: { minHeight: '50vh' }, placeholder: 'Quest log, contacts, loot to sell, magazine issues read…', onchange: e => update(c => { c.notes = e.target.value; }) }, ch.notes || '')),
    h('div', { class: 'panel' }, h('h2', {}, 'Bio'), h('textarea', { style: { minHeight: '50vh' }, onchange: e => update(c => { c.bio = e.target.value; }) }, ch.bio || '')));
}

function renderRules() {
  return h('div', { class: 'grid two' },
    ...RULE_NOTES.map(r => h('div', { class: 'panel' }, h('h3', {}, r.title), h('p', {}, r.text))));
}

function renderCombat() {
  return h('div', { class: 'grid two' },
    h('div', { class: 'panel' }, h('h2', {}, 'Actions in combat'), table(['Action', 'AP'], ACTIONS)),
    h('div', { class: 'panel' }, h('h2', {}, 'Targeted attacks'),
      h('p', { class: 'muted' }, 'Melee targeted attacks cost 2 less additional AP (minimum 1). Roll a d4 for the condition (re-roll up to your Luck modifier times); a crit inflicts the severe injury or two conditions.'),
      table(['Limb', 'Extra AP', 'Effect', '1', '2', '3', '4', 'Severe'], TARGETED_ATTACKS.map(t => [t.limb, t.ap, t.effect, ...t.conds, t.severe]))),
    h('div', { class: 'panel' }, h('h2', {}, 'Improvised weapons'),
      table(['Object load', 'AP', 'Damage', 'Thrown'], [['2 or less', 3, '1d4 + STR', 'STR ×6/12'], ['3–9', 4, '1d8 + STR', 'STR ×4/10'], ['10–15', 4, '1d10 + STR', 'STR ×3/8'], ['16–20', 5, '2d8 + STR', 'STR ×3/6'], ['21–30', 5, '3d6 + STR', 'STR ×3/5'], ['31–40', 6, '3d10 + STR', 'STR ×2/4'], ['50+', '7+', '4d12 + STR', 'STR ×1']])),
    h('div', { class: 'panel' }, h('h2', {}, 'Falling & environment'),
      h('p', {}, 'Medium creature: 1d6 impact per 10 feet fallen, lands prone, random arm and leg condition if HP damaged. Hold breath 1 + END modifier minutes. Flames: 2d10 fire and Burning. Lightly obscured: −5 passive sense, ranged range halved.')));
}

function renderConditions() {
  return h('div', { class: 'grid two' },
    h('div', { class: 'panel' }, h('h2', {}, 'Conditions'), table(['Condition', 'Effect'], CONDITIONS)),
    h('div', { class: 'panel' }, h('h2', {}, 'Minor diseases (Changes)'), h('p', { class: 'muted' }, 'Duration is multiplied by (12 − your Endurance score).'), table(['Disease', 'Effect', 'Duration'], MINOR_DISEASES),
      h('h3', { class: 'mt' }, 'Radiation severity'), table(['Zone', '2d4 RADs every'], [['Level 1', '30 minutes'], ['Level 2', '10 minutes'], ['Level 3', '3 minutes'], ['Level 4', '1 minute'], ['Level 5', '30 seconds'], ['Level 6', '6 seconds']])));
}

function renderProperties() {
  const list = (obj) => table(['Property', 'Effect'], Object.entries(obj));
  return h('div', { class: 'grid two' },
    h('div', { class: 'panel' }, h('h2', {}, 'Ranged weapon properties'), list(RANGED_PROPERTIES)),
    h('div', { class: 'panel' }, h('h2', {}, 'Melee weapon properties'), list(MELEE_PROPERTIES)),
    h('div', { class: 'panel' }, h('h2', {}, 'Explosive properties'), list(EXPLOSIVE_PROPERTIES)),
    h('div', { class: 'panel' }, h('h2', {}, 'Food & drink properties'), list(FOOD_PROPERTIES)),
    h('div', { class: 'panel' }, h('h2', {}, 'Special ammunition (2.1)'), table(['Round', 'Cost', 'Calibers', 'Effect'], SPECIAL_AMMO.map(s => [s.name, s.mult, s.types, s.text]))),
    h('div', { class: 'panel' }, h('h2', {}, 'Syringer ammo'), table(['Syringe', { label: 'Cost', class: 'num' }, 'Effect'], SYRINGES.map(s => [s.name, { v: `${s.cost}c`, class: 'num' }, s.text]))));
}

function renderCharacters(ctx) {
  const { store } = ctx;
  const active = store.active;
  const download = ch => {
    const blob = new Blob([exportCharacter(ch)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `${(ch.name || 'character').replace(/[^a-z0-9]+/gi, '_')}.pipboy.json` });
    document.body.append(a); a.click(); a.remove();
  };
  const importUI = () => {
    const ta = h('textarea', { placeholder: 'Paste exported character JSON here…', style: { minHeight: '200px' } });
    const file = h('input', { type: 'file', accept: 'application/json,.json', onchange: e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { ta.value = t; }); } });
    modal('Import character', h('div', { class: 'stack' }, file, ta,
      h('button', { class: 'primary', onclick: () => { try { const ch = importCharacter(ta.value); store.add(ch); closeModal(); toast(`Imported ${ch.name}.`); } catch (err) { toast('Could not import: ' + err.message); } } }, 'Import')));
  };
  return h('div', { class: 'stack' },
    h('div', { class: 'panel' },
      h('div', { class: 'row between' }, h('h2', {}, 'Characters'),
        h('div', { class: 'row' },
          h('button', { class: 'primary', onclick: () => { const c = newCharacter(); store.add(c); toast('New character created.'); } }, '+ New character'),
          h('button', { onclick: importUI }, 'Import JSON'))),
      h('p', { class: 'muted' }, 'Characters are saved in this browser\'s local storage. Export a JSON backup to move them between devices or share with your GM.'),
      table(['Name', 'Level', 'Race', 'Caps', ''], store.characters.map(c => ({ attrs: { class: c.id === active.id ? 'selected' : '' }, cells: [
        h('a', { href: '#', onclick: e => { e.preventDefault(); store.select(c.id); } }, c.name || 'Unnamed'), c.level, RACE_BY_ID[c.race]?.name || c.race, c.caps || 0,
        h('span', { class: 'row', style: { flexWrap: 'nowrap' } },
          h('button', { class: 'small', onclick: () => store.select(c.id) }, 'Open'),
          h('button', { class: 'small', onclick: () => download(c) }, 'Export'),
          h('button', { class: 'small', onclick: () => { navigator.clipboard?.writeText(exportCharacter(c)).then(() => toast('Copied JSON to clipboard.')); } }, 'Copy'),
          h('button', { class: 'small', onclick: () => store.duplicate(c.id) }, 'Duplicate'),
          h('button', { class: 'small danger', onclick: () => confirmDialog(`Delete ${c.name}? This cannot be undone.`, () => store.remove(c.id)) }, 'Delete'))] })))),
    h('div', { class: 'panel' }, h('h2', {}, 'Settings'),
      h('label', { class: 'inline' }, h('input', { type: 'checkbox', checked: !document.documentElement.classList.contains('no-fx'), onchange: e => { document.documentElement.classList.toggle('no-fx', !e.target.checked); try { localStorage.setItem('pipboy.fx', e.target.checked ? '1' : '0'); } catch {} } }), 'CRT scanline effects')));
}

function renderAbout() {
  return h('div', { class: 'panel' },
    h('h2', {}, 'About this Pip-Boy'),
    h('p', {}, 'An automatic character sheet and inventory for the fan-made Fallout TTRPG (Arcane Arcade, v2.1) using the ', badge('CHANGES', 'src-changes'), ' house rules by Co-verseers Tess and Peter. Where the two disagree, the Changes document wins: AP is 12 + half your Agility modifier, Luck uses the bonus table, radiation uses a threshold and RADs, blocking raises AC, death saves are DC 12, and all weapons, armour, food, chems and explosives come from the Changes tables.'),
    h('p', {}, 'Everything the sheet calculates — skills, HP/SP/AP, AC/DT, carry load, weapon hit/damage/crit/range, perk and skill point budgets — updates live as you change S.P.E.C.I.A.L., level, race, perks, traits, armour, upgrades, mods and decay. Situational effects are shown as text for you and your GM to apply.'),
    h('p', { class: 'muted' }, 'The 2.1 rulebook is still needed for anything not covered here (GM material, creature statblocks, crafting tables and the finer points). Data is stored in your browser; export regularly.'));
}
