// Run with: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeDerived, perkAvailability } from '../js/rules.js';
import { newCharacter } from '../js/store.js';
import { luckBonuses, baseActionPoints, perkPointsAtLevel, skillPointsPerGrant } from '../js/data/special.js';
import { PERK_BY_ID } from '../js/data/perks.js';

const make = (over = {}) => ({ ...newCharacter('Test'), ...over });

test('luck table', () => {
  assert.deepEqual(luckBonuses(-2), { skills: -1, crit: 0, karmaCaps: 0 });
  assert.deepEqual(luckBonuses(0), { skills: 0, crit: 0, karmaCaps: 0 });
  assert.deepEqual(luckBonuses(1), { skills: 0, crit: -1, karmaCaps: 0 });
  assert.deepEqual(luckBonuses(3), { skills: 1, crit: -2, karmaCaps: 0 });
  assert.deepEqual(luckBonuses(5), { skills: 2, crit: -2, karmaCaps: 1 });
});

test('action points use the Changes formula', () => {
  assert.equal(baseActionPoints(0), 12);
  assert.equal(baseActionPoints(1), 13);
  assert.equal(baseActionPoints(-3), 11);
  assert.equal(baseActionPoints(5), 15);
});

test('level table', () => {
  assert.equal(perkPointsAtLevel(1), 1);
  assert.equal(perkPointsAtLevel(5), 4);
  assert.equal(perkPointsAtLevel(30), 25);
  assert.equal(skillPointsPerGrant(4), 3);
  assert.equal(skillPointsPerGrant(5), 4);
  assert.equal(skillPointsPerGrant(9), 5);
});

test('level 1 human baseline', () => {
  const d = computeDerived(make());
  assert.equal(d.hpMax, 10);
  assert.equal(d.spMax, 10);
  assert.equal(d.apMax, 12);
  assert.equal(d.ac, 10);
  assert.equal(d.dt, 0);
  assert.equal(d.carryMax, 50);
  assert.equal(d.passiveSense, 12);
  assert.equal(d.radThreshold, 10);
  assert.equal(d.healingRate, 3);
  assert.equal(d.karmaCaps, 1);
  assert.equal(d.perkPointsAvailable, 1);
  assert.equal(d.skillPointsAvailable, 0);
});

test('pools scale with level and modifiers', () => {
  const d = computeDerived(make({ level: 9, special: { STR: 5, PER: 5, END: 7, CHA: 5, INT: 5, AGI: 3, LCK: 5 } }));
  assert.equal(d.hpMax, 40);
  assert.equal(d.spMax, 20);
  assert.equal(d.healingRate, 8);
  assert.equal(d.skillPointsAvailable, 8);
  assert.equal(d.perkPointsAvailable, 7);
});

test('background, skill points and luck feed skills', () => {
  const ch = make({ background: 'guard', special: { STR: 5, PER: 5, END: 5, CHA: 5, INT: 5, AGI: 7, LCK: 9 }, skillPoints: { Guns: 3 } });
  const d = computeDerived(ch);
  assert.equal(d.skills.Guns.total, 9);
  assert.equal(d.skills.Barter.total, 2);
});

test('super mutant racial strength and carry', () => {
  const d = computeDerived(make({ race: 'supermutant', raceVariant: 'none' }));
  assert.equal(d.special.STR, 6);
  assert.equal(d.carryMax, 100);
  assert.equal(d.radThreshold, null);
});

test('armor, decay and upgrades', () => {
  const ch = make({ inventory: [{ uid: 'a', ref: 'armor:steel', name: 'Steel Armor', qty: 1, worn: true, decay: 4, upgrades: [{ id: 'hardened', rank: 2 }, { id: 'reinforced', rank: 1 }], mods: [] }] });
  const d = computeDerived(ch);
  assert.equal(d.ac, 13);
  assert.equal(d.dt, 1);
  assert.equal(d.load.total, 25);
  assert.ok(d.armorStrWarning);
});

test('inventory load, bags and encumbrance', () => {
  const ch = make({ inventory: [
    { uid: 'b', ref: 'gear:backpack', name: 'Bag, Backpack', qty: 1, worn: true },
    { uid: 'c', ref: 'ammo:ammo_9mm', name: '9mm', qty: 50 },
    { uid: 'd', ref: 'weapon:sledgehammer', name: 'Sledgehammer', qty: 1 },
  ] });
  const d = computeDerived(ch);
  assert.equal(d.carryMax, 100);
  assert.equal(d.load.total, 31);
  assert.equal(d.encumbrance, 'none');
});

test('weapon attack, damage, crit and range', () => {
  const ch = make({ special: { STR: 5, PER: 6, END: 5, CHA: 5, INT: 5, AGI: 7, LCK: 7 }, background: 'guard', inventory: [
    { uid: 'w', ref: 'weapon:10mm_pistol', name: '10mm Pistol', qty: 1, decay: 1, mods: ['holographic_sight'] },
  ], perks: [{ id: 'gunslinger', count: 1 }] });
  const d = computeDerived(ch);
  const s = d.weapons[0].stats;
  assert.equal(s.attack, 6); // Sturdy ignores the first two levels of decay
  assert.equal(s.dmgBonus, 2);
  assert.equal(s.crit, 17);
  assert.equal(s.rangeText, '48 / 84 ft');
});

test('strength requirement penalty and weapon handling', () => {
  const base = make({ inventory: [{ uid: 'w', ref: 'weapon:minigun', name: 'Minigun', qty: 1 }] });
  assert.equal(computeDerived(base).weapons[0].stats.strPenalty, 8);
  const wh = { ...base, perks: [{ id: 'weapon_handling', count: 1 }] };
  assert.equal(computeDerived(wh).weapons[0].stats.strPenalty, 2);
});

test('perk availability', () => {
  const ch = make({ special: { STR: 7, PER: 5, END: 5, CHA: 5, INT: 5, AGI: 5, LCK: 5 } });
  const d = computeDerived(ch);
  assert.equal(perkAvailability(ch, PERK_BY_ID.ko, d).ok, true);
  assert.equal(perkAvailability(ch, PERK_BY_ID.rooted, d).ok, false);
  assert.equal(perkAvailability(ch, PERK_BY_ID.holey_moley, d).ok, false);
  const gn = { ...ch, traits: [{ id: 'good_natured' }] };
  assert.equal(perkAvailability(gn, PERK_BY_ID.ko, computeDerived(gn)).ok, false);
});

test('traits: talented and recluse adjust perk points', () => {
  assert.equal(computeDerived(make({ traits: [{ id: 'talented', skills: [] }] })).perkPointsAvailable, 2);
  assert.equal(computeDerived(make({ traits: [{ id: 'recluse', skills: [] }] })).perkPointsAvailable, 0);
});
