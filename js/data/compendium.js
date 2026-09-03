// Unified item compendium used by the inventory "add item" picker and by starting kits.
import { WEAPONS, WEAPON_GROUPS } from './weapons.js';
import { ARMOR, POWER_ARMOR } from './armor.js';
import { AMMO, EXPLOSIVES, GEAR, UNIQUE_ITEMS, SYRINGES } from './items.js';
import { COOKED_FOOD, PREWAR_FOOD, DRINKS, CHEMS, MEDICINE, MAGAZINES, PROGRAMS } from './consumables.js';

export const CATEGORIES = [
  { id: 'weapon',   name: 'Weapons',    tab: 'weapons' },
  { id: 'armor',    name: 'Apparel',    tab: 'apparel' },
  { id: 'gear',     name: 'Gear',       tab: 'misc' },
  { id: 'ammo',     name: 'Ammo',       tab: 'ammo' },
  { id: 'explosive',name: 'Explosives', tab: 'weapons' },
  { id: 'food',     name: 'Food',       tab: 'aid' },
  { id: 'drink',    name: 'Drinks',     tab: 'aid' },
  { id: 'chem',     name: 'Chems',      tab: 'aid' },
  { id: 'medicine', name: 'Medicine',   tab: 'aid' },
  { id: 'magazine', name: 'Magazines',  tab: 'misc' },
  { id: 'program',  name: 'Programs',   tab: 'aid' },
  { id: 'unique',   name: 'Unique',     tab: 'misc' },
  { id: 'junk',     name: 'Junk',       tab: 'junk' },
];

function entry(category, ref, base, extra = {}) {
  return { category, ref, name: base.name, cost: base.cost ?? 0, load: base.load ?? 0, base, ...extra };
}

export const COMPENDIUM = [
  ...WEAPONS.map(w => entry('weapon', `weapon:${w.id}`, w, { sub: WEAPON_GROUPS[w.group].name, summary: `${w.ap} AP · ${w.damage} · ${w.range} · crit ${w.crit}` })),
  ...ARMOR.map(a => entry('armor', `armor:${a.id}`, a, { sub: 'Armor', summary: `AC ${a.ac} · DT ${a.dt} · ${a.slots} slots · STR ${a.str}` })),
  ...POWER_ARMOR.map(a => entry('armor', `powerarmor:${a.id}`, { ...a, load: 100 }, { sub: 'Power Armor', summary: `AC ${a.ac} · DP ${a.dp} · ${a.slots} slots` })),
  ...GEAR.map(g => entry('gear', `gear:${g.id}`, g, { sub: 'Gear', summary: g.text })),
  ...UNIQUE_ITEMS.map(u => entry('unique', `unique:${u.id}`, u, { sub: 'Unique', summary: u.text })),
  ...AMMO.map(a => entry('ammo', `ammo:${a.id}`, { ...a, load: a.unitLoad ?? 0.1 }, { sub: a.kind, summary: a.text || `${a.cost}c per round` })),
  ...SYRINGES.map(s => entry('ammo', `syringe:${s.id}`, { ...s, load: 0.1 }, { sub: 'Syringe', summary: s.text })),
  ...EXPLOSIVES.map(e => entry('explosive', `explosive:${e.id}`, e, { sub: e.type === 'thrown' ? 'Thrown' : 'Placed', summary: `${e.ap} AP · ${e.damage} · ${e.area}` })),
  ...COOKED_FOOD.map(f => entry('food', `food:${f.id}`, f, { sub: 'Cooked', summary: f.props.join(', ') })),
  ...PREWAR_FOOD.map(f => entry('food', `food:${f.id}`, f, { sub: f.produce ? 'Produce' : 'Pre-War', summary: f.props.join(', ') })),
  ...DRINKS.map(d => entry('drink', `drink:${d.id}`, d, { sub: 'Drink', summary: d.props.join(', ') })),
  ...CHEMS.map(c => entry('chem', `chem:${c.id}`, c, { sub: 'Chem', summary: c.effect })),
  ...MEDICINE.map(m => entry('medicine', `medicine:${m.id}`, m, { sub: 'Medicine', summary: m.effect })),
  ...MAGAZINES.map(m => entry('magazine', `magazine:${m.id}`, m, { sub: m.skill, summary: `+1 ${m.skill} until you rest. Five issues: permanent +1.` })),
  ...PROGRAMS.map(p => entry('program', `program:${p.id}`, p, { sub: 'Program', summary: p.effect })),
];

export const COMPENDIUM_BY_REF = Object.fromEntries(COMPENDIUM.map(e => [e.ref, e]));
export const COMPENDIUM_BY_NAME = Object.fromEntries(COMPENDIUM.map(e => [e.name.toLowerCase(), e]));

export function findByName(name) {
  return COMPENDIUM_BY_NAME[name.toLowerCase()] || null;
}

export function searchCompendium(query, category = null) {
  const q = query.trim().toLowerCase();
  return COMPENDIUM.filter(e => (!category || e.category === category) && (!q || e.name.toLowerCase().includes(q) || (e.sub || '').toLowerCase().includes(q)));
}
