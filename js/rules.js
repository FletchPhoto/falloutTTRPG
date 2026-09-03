// Pure derived-stat engine. Takes a character object and returns everything the sheet displays.
// Rules: Fallout TTRPG 2.1 overridden by the "Fallout TTRPG Changes" document.
import { ABILITY_KEYS, SKILLS, abilityMod, luckBonuses, baseActionPoints, AP_MAX, poolIncrements, perkPointsAtLevel, skillPointsPerGrant, skillPointGrantsAtLevel } from './data/special.js';
import { RACE_BY_ID } from './data/races.js';
import { BACKGROUND_BY_ID } from './data/backgrounds.js';
import { TRAIT_BY_ID } from './data/traits.js';
import { PERK_BY_ID } from './data/perks.js';
import { WEAPON_BY_ID, WEAPON_GROUPS, MOD_BY_ID, UNARMED_STRIKE } from './data/weapons.js';
import { ARMOR_BY_ID, ARMOR_UPGRADE_BY_ID, POWER_ARMOR, POWER_ARMOR_UPGRADE_BY_ID } from './data/armor.js';
import { GEAR, AMMO } from './data/items.js';
import { COMPENDIUM_BY_REF } from './data/compendium.js';

const POWER_ARMOR_BY_ID = Object.fromEntries(POWER_ARMOR.map(p => [p.id, p]));
const GEAR_BY_ID = Object.fromEntries(GEAR.map(g => [g.id, g]));
const AMMO_BY_ID = Object.fromEntries(AMMO.map(a => [a.id, a]));

export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export const fmt = n => (n >= 0 ? `+${n}` : `${n}`);

// ---------------------------------------------------------------------------
// Effect collection
// ---------------------------------------------------------------------------
function raceVariant(ch) {
  const race = RACE_BY_ID[ch.race];
  if (!race) return null;
  return race.variants.find(v => v.id === ch.raceVariant) || race.variants[0];
}

/** All active effects with their source label. */
export function collectEffects(ch) {
  const out = [];
  const push = (effects, source) => (effects || []).forEach(e => out.push({ ...e, source }));
  const race = RACE_BY_ID[ch.race];
  const variant = raceVariant(ch);
  if (race) push(race.effects, race.name);
  if (variant) push(variant.effects, variant.name);
  for (const t of ch.traits || []) {
    const def = TRAIT_BY_ID[t.id];
    if (!def) continue;
    if (t.wild && def.wild) push(def.wild.effects ?? [], `${def.name} (Wild Wasteland)`);
    else push(def.effects, def.name);
  }
  for (const p of ch.perks || []) {
    const def = PERK_BY_ID[p.id];
    if (!def) continue;
    for (let i = 0; i < (p.count || 1); i++) push(def.effects, def.name);
  }
  // Free perks granted by race variants (e.g. Old Bones → Stitched Together) are listed but have no numeric effects.
  const armor = wornArmorItem(ch);
  if (armor && armor.ref?.startsWith('armor:')) {
    const upgrades = [...(ARMOR_BY_ID[armor.ref.slice(6)]?.builtInUpgrades || []), ...(armor.upgrades || [])];
    for (const up of upgrades) {
      const def = ARMOR_UPGRADE_BY_ID[up.id];
      if (!def) continue;
      for (let r = 0; r < Math.min(up.rank || 1, def.maxRank); r++) push(def.ranks[r].effects, `${def.name} R${r + 1}`);
    }
  }
  if (armor && armor.ref?.startsWith('powerarmor:')) {
    for (const up of armor.upgrades || []) {
      const def = POWER_ARMOR_UPGRADE_BY_ID[up.id];
      if (!def?.effects) continue;
      for (let r = 0; r < Math.min(up.rank || 1, def.maxRank); r++) push(def.effects[r], `${def.name} R${r + 1}`);
    }
  }
  for (const it of ch.inventory || []) {
    if (it.worn && it.ref?.startsWith('gear:')) push(GEAR_BY_ID[it.ref.slice(5)]?.effects, it.name);
  }
  return out;
}

const sumEffects = (effects, type, filter = () => true) => effects.filter(e => e.type === type && filter(e)).reduce((s, e) => s + (e.value || 0), 0);
const hasEffect = (effects, type) => effects.some(e => e.type === type);

// ---------------------------------------------------------------------------
// Abilities
// ---------------------------------------------------------------------------
export function effectiveSpecial(ch, effects = collectEffects(ch)) {
  const out = {};
  for (const k of ABILITY_KEYS) {
    let v = (ch.special?.[k] ?? 5) + (ch.specialFromPerks?.[k] ?? 0);
    for (const e of effects.filter(e => e.type === 'ability' && e.ability === k)) {
      v += e.value || 0;
      if (e.min != null) v = Math.max(v, e.min);
      if (e.max != null) v = Math.min(v, e.max);
    }
    out[k] = clamp(v, 1, 10);
  }
  // Power armor: Strength counts as 12 while worn.
  const pa = wornArmorItem(ch);
  if (pa?.ref?.startsWith('powerarmor:')) out.STR_effective = 12;
  return out;
}

/** Score used for perk requirements (Good Natured / Feral adjust these). */
export function perkRequirementScore(ability, special, effects) {
  let v = special[ability];
  const override = effects.find(e => e.type === 'perkAbilityOverride' && e.ability === ability);
  if (override) return override.value;
  v += sumEffects(effects, 'perkAbilityAdjust', e => e.ability === ability);
  return v;
}

/** Creation point-buy accounting: every score starts at 5 with 3 points to spend; lowering a score refunds points. */
export function creationPoints(ch) {
  let spent = 0;
  for (const k of ABILITY_KEYS) spent += (ch.special?.[k] ?? 5) - 5;
  return { spent, budget: 3, remaining: 3 - spent };
}

// ---------------------------------------------------------------------------
// Inventory helpers
// ---------------------------------------------------------------------------
export function wornArmorItem(ch) {
  return (ch.inventory || []).find(i => i.worn && (i.ref?.startsWith('armor:') || i.ref?.startsWith('powerarmor:'))) || null;
}

function itemBase(item) {
  if (!item.ref) return null;
  return COMPENDIUM_BY_REF[item.ref]?.base || null;
}

/** Load of a single unit of an item, considering worn state, mods and perks. */
export function itemUnitLoad(item, ctx) {
  const base = itemBase(item);
  let load = item.load ?? base?.load ?? 0;
  if (item.ref?.startsWith('weapon:') && base) {
    let mult = 1;
    for (const m of item.mods || []) {
      const def = MOD_BY_ID[m];
      for (const e of def?.effects || []) {
        if (e.type === 'weaponLoad') load += e.value;
        if (e.type === 'weaponLoadMultiplier') mult *= e.value;
      }
    }
    load = Math.ceil(load * mult);
  }
  if (item.ref?.startsWith('powerarmor:')) return item.worn ? 0 : 100;
  if (item.ref?.startsWith('armor:')) {
    load += ctx?.armorLoadAdjust || 0;
    load = Math.max(3, load);
    if (item.worn) load = Math.floor(load / 2);
  }
  if (item.ref?.startsWith('gear:') && base) {
    if (item.worn && base.wornLoad != null) load = base.wornLoad;
  }
  if (item.ref?.startsWith('ammo:')) {
    const a = AMMO_BY_ID[item.ref.slice(5)];
    load = a?.unitLoad ?? 0.1;
  }
  if (item.ref?.startsWith('syringe:')) load = 0.1;
  if (ctx?.packRat && load > 0 && load < 3 && !item.ref?.startsWith('ammo:')) load = 1;
  return load;
}

export function totalLoad(ch, ctx) {
  let total = 0;
  const rows = [];
  for (const it of ch.inventory || []) {
    const unit = itemUnitLoad(it, ctx);
    const qty = it.qty ?? 1;
    const line = Math.round(unit * qty * 10) / 10;
    rows.push({ item: it, unit, line });
    total += line;
  }
  return { total: Math.round(total * 10) / 10, rows };
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
export function skillBreakdown(ch, skillKey, special, effects, luck) {
  const def = SKILLS.find(s => s.key === skillKey);
  const chosen = ch.skillAbilityChoice?.[skillKey] && def.abilities.includes(ch.skillAbilityChoice[skillKey]) ? ch.skillAbilityChoice[skillKey] : def.abilities[0];
  const parts = [];
  const add = (label, value) => { if (value) parts.push({ label, value }); };
  add(`${chosen} modifier`, abilityMod(special[chosen]));
  const bg = BACKGROUND_BY_ID[ch.background];
  const bgSkills = bg?.skills || ch.backgroundSkills || [];
  if (bgSkills.includes(skillKey)) add('Background', 2);
  add('Skill points', ch.skillPoints?.[skillKey] || 0);
  add('Devout Study', ch.devoutSkillPoints?.[skillKey] || 0);
  add('Luck', luck.skills);
  add('Effects (all skills)', sumEffects(effects, 'skillAll'));
  const specific = effects.filter(e => e.type === 'skill' && e.skill === skillKey);
  for (const e of specific) add(e.source, e.value);
  for (const t of ch.traits || []) {
    const def = TRAIT_BY_ID[t.id];
    const choice = t.wild && def?.wild?.choice ? def.wild.choice : def?.choice;
    if (choice && !(t.wild && def?.wild?.noChoice) && (t.skills || []).includes(skillKey)) add(def.name, choice.value);
  }
  const read = ch.magazinesRead?.[skillKey] || 0;
  add('Magazines (5 issues = +1)', Math.floor(read / 5));
  if (ch.magazineActive?.[skillKey]) add('Magazine (until rest)', 1);
  add('Misc / GM', ch.skillMisc?.[skillKey] || 0);
  const total = parts.reduce((s, p) => s + p.value, 0);
  return { key: skillKey, ability: chosen, abilities: def.abilities, total, parts };
}

// ---------------------------------------------------------------------------
// Weapons
// ---------------------------------------------------------------------------
function parseCrit(crit) {
  const m = /^(\d+)/.exec(crit || '');
  return m ? Number(m[1]) : 20;
}
function parseRange(range) {
  const m = /x(\d+)\s*[\/,]\s*x?(\d+)/i.exec(range || '');
  return m ? [Number(m[1]), Number(m[2])] : null;
}

export function weaponClasses(w) {
  const grp = WEAPON_GROUPS[w.group];
  const classes = new Set([w.group, grp.kind]);
  if (grp.kind === 'melee') { classes.add('melee'); if (w.group !== 'unarmed') classes.add('meleeWeapon'); }
  if (w.revolver) classes.add('revolver');
  if (w.group === 'handgun') classes.add('handgun');
  const props = (w.props || []).join(' ');
  classes.add(/Two Handed|Drawstring/i.test(props) ? 'hands2' : 'hands1');
  return classes;
}

function effectMatches(e, classes) {
  if (e.weapon && !classes.has(e.weapon)) return false;
  if (e.hands && !classes.has(`hands${e.hands}`)) return false;
  return true;
}

export function weaponStats(ch, item, derived) {
  const { special, effects, skills, luck } = derived;
  const base = item.ref === 'weapon:unarmed_strike' ? UNARMED_STRIKE : WEAPON_BY_ID[item.ref?.slice(7)];
  if (!base) return null;
  const grp = WEAPON_GROUPS[base.group];
  const classes = weaponClasses(base);
  const isShotgun = base.group === 'shotgun';
  const notes = [];

  // Mods
  let ap = base.ap, str = base.str, critAdj = 0, attackMod = 0, rangeShortMult = 1, rangeLongMult = 1, rangeShortAdd = 0, rangeLongAdd = 0, ignoreDecay = 0, rounds = base.rounds, load = base.load;
  for (const m of item.mods || []) {
    const def = MOD_BY_ID[m];
    for (const e of def?.effects || []) {
      switch (e.type) {
        case 'weaponAp': ap += e.value; break;
        case 'weaponStr': str += e.value; break;
        case 'weaponCrit': critAdj += e.value; break;
        case 'weaponAttack': attackMod += e.value; break;
        case 'rangeMultiplier': rangeShortMult *= e.value; rangeLongMult *= e.value; break;
        case 'rangeShortMultiplier': rangeShortMult *= e.value; break;
        case 'rangeLongMultiplier': rangeLongMult *= e.value; break;
        case 'rangeShortAdd': rangeShortAdd += e.value; break;
        case 'rangeLongAdd': rangeLongAdd += e.value; break;
        case 'ignoreDecay': ignoreDecay = Math.max(ignoreDecay, e.value); break;
        case 'roundsMultiplier': if (rounds) rounds = Math.ceil(rounds * e.value); break;
        default: break;
      }
    }
  }
  ap = Math.max(1, ap + sumEffects(effects, 'apCost', e => effectMatches(e, classes)));

  // Skill and attack bonus
  const skill = skills[grp.skill];
  const props = (base.props || []).join(' ');
  if (/Sturdy/i.test(props)) ignoreDecay = Math.max(ignoreDecay, 2);
  ignoreDecay = Math.max(ignoreDecay, sumEffects(effects, 'ignoreWeaponDecay'));
  const decay = item.decay || 0;
  const effectiveDecay = Math.max(0, decay - ignoreDecay);
  const artisan = decay === -1 ? 1 : 0;
  const attackEffects = sumEffects(effects, 'attack', e => effectMatches(e, classes));

  // Strength requirement (Changes doc: −2 per point short; Weapon Handling: STR +2 and −1 per point)
  const strScore = special.STR_effective ?? special.STR;
  const strBonus = sumEffects(effects, 'weaponStrBonus');
  const perPoint = hasEffect(effects, 'strPenaltyPerPoint') ? 1 : 2;
  const shortfall = Math.max(0, str - (strScore + strBonus));
  const strPenalty = shortfall * perPoint;
  if (shortfall) notes.push(`Strength ${strScore + strBonus} is ${shortfall} below the requirement of ${str}: −${strPenalty} to hit.`);

  const attack = (skill?.total || 0) + attackMod + attackEffects - effectiveDecay + artisan - strPenalty;
  if (effectiveDecay) notes.push(`${effectiveDecay} level${effectiveDecay > 1 ? 's' : ''} of decay: −${effectiveDecay} to hit.`);
  if (decay >= 10) notes.push('BROKEN — this weapon has ceased to function.');

  // Damage bonus
  let dmgAbility = grp.dmgAbility;
  if (base.group === 'bladed' && hasEffect(effects, 'bladedUsesAgi') && abilityMod(special.AGI) > abilityMod(special.STR)) { dmgAbility = 'AGI'; notes.push('The Dance: using Agility for damage.'); }
  if (base.id === 'unarmed_strike') dmgAbility = abilityMod(special.AGI) > abilityMod(special.STR) ? 'AGI' : 'STR';
  const weak = /Weak\b/.test(props) || /Area of Effect/.test(props);
  const dmgAbilityMod = weak ? 0 : abilityMod(special[dmgAbility]);
  const dmgEffects = sumEffects(effects, 'damage', e => effectMatches(e, classes));
  const dmgBonus = dmgAbilityMod + dmgEffects;

  // Crit chance
  let crit = parseCrit(base.crit) + critAdj;
  if (!isShotgun) crit += luck.crit;
  crit += sumEffects(effects, 'critChance', e => effectMatches(e, classes));
  crit = clamp(crit, 2, 20);

  // Range
  let rangeText = base.range;
  const r = parseRange(base.range);
  if (r) {
    const per = special.PER;
    const s = Math.round((r[0] * rangeShortMult + rangeShortAdd) * per);
    const l = Math.round((r[1] * rangeLongMult + rangeLongAdd) * per);
    rangeText = `${s} / ${l} ft`;
  } else if (/Thrown: x(\d+)\/x(\d+)/i.test(props)) {
    const m = /Thrown: x(\d+)\/x(\d+)/i.exec(props);
    rangeText = `5 ft (thrown ${Number(m[1]) * strScore} / ${Number(m[2]) * strScore} ft)`;
  } else if (/Reach/.test(props)) rangeText = '10 ft';

  return {
    base, grp, classes, ap, attack, skillName: grp.skill, skillTotal: skill?.total || 0, attackMod, attackEffects, strPenalty, effectiveDecay,
    damage: base.damage, dmgBonus, dmgAbility, crit, critText: base.crit, rangeText, rounds, ammo: base.ammo, strReq: str, notes,
    twoHanded: classes.has('hands2'),
  };
}

// ---------------------------------------------------------------------------
// Main derived computation
// ---------------------------------------------------------------------------
export function computeDerived(ch) {
  const level = clamp(Number(ch.level) || 1, 1, 30);
  const effects = collectEffects(ch);
  const special = effectiveSpecial(ch, effects);
  const mods = Object.fromEntries(ABILITY_KEYS.map(k => [k, abilityMod(special[k])]));
  const luck = luckBonuses(mods.LCK);
  const race = RACE_BY_ID[ch.race] || null;
  const variant = raceVariant(ch);
  const inc = poolIncrements(level);

  // Skills
  const skills = {};
  for (const s of SKILLS) skills[s.key] = skillBreakdown(ch, s.key, special, effects, luck);

  // Pools
  const hpMax = 10 + 5 * inc + mods.END * (inc + 1)
    + sumEffects(effects, 'hp') + sumEffects(effects, 'hpPerLevel') * level + sumEffects(effects, 'hpPerIncrement') * inc;
  const spMax = 10 + 5 * inc + mods.AGI * (inc + 1)
    + sumEffects(effects, 'sp') + sumEffects(effects, 'spPerLevel') * level + sumEffects(effects, 'spPerIncrement') * inc;
  const apMax = clamp(baseActionPoints(mods.AGI) + sumEffects(effects, 'apMax'), 6, AP_MAX);

  const healingRate = Math.floor((level + special.END) / 2) + sumEffects(effects, 'healingRate') + sumEffects(effects, 'healingRatePerLevel') * level;

  // Carry
  const packRat = hasEffect(effects, 'packRat');
  const armorLoadAdjust = sumEffects(effects, 'armorLoad');
  const strForCarry = special.STR_effective ?? special.STR;
  let carryMax = strForCarry * 10 + sumEffects(effects, 'carry');
  for (const it of ch.inventory || []) {
    if (it.worn && it.ref?.startsWith('gear:')) carryMax += GEAR_BY_ID[it.ref.slice(5)]?.carryBonus || 0;
  }
  const load = totalLoad(ch, { packRat, armorLoadAdjust });
  const wornBags = (ch.inventory || []).filter(i => i.worn && i.ref?.startsWith('gear:') && GEAR_BY_ID[i.ref.slice(5)]?.bag).length;
  let encumbrance = 'none';
  if (load.total > carryMax * 2) encumbrance = 'heavy';
  else if (load.total > carryMax) encumbrance = 'encumbered';
  if (encumbrance === 'encumbered' && hasEffect(effects, 'immuneEncumbered')) encumbrance = 'none';
  const bagWarning = wornBags > 1 && special.STR < 8 && special.END < 8;

  // Armor
  const armorItem = wornArmorItem(ch);
  let ac = 10, dt = 0, armorName = 'No armor', armorDecayPenalty = 0, dp = null, armorStrWarning = null, upgradeSlotsUsed = 0, upgradeSlots = 0;
  if (armorItem?.ref?.startsWith('armor:')) {
    const a = ARMOR_BY_ID[armorItem.ref.slice(6)];
    armorName = armorItem.name;
    const ignore = sumEffects(effects, 'ignoreArmorDecay');
    const decay = Math.max(0, (armorItem.decay || 0) - ignore);
    armorDecayPenalty = Math.floor(decay / 2);
    ac = a.ac - armorDecayPenalty;
    dt = a.dt - armorDecayPenalty;
    if (armorItem.decay === -1) { ac += 1; dt += 1; }
    if ((armorItem.decay || 0) >= 10) { ac = 10; dt = 0; armorName += ' (BROKEN)'; }
    const strReq = a.str + sumEffects(effects, 'armorStr');
    if (special.STR < strReq) armorStrWarning = `Strength ${special.STR} is below the armor requirement of ${strReq}: you are slowed.`;
    upgradeSlots = a.slots;
    upgradeSlotsUsed = (armorItem.upgrades || []).length;
  } else if (armorItem?.ref?.startsWith('powerarmor:')) {
    const pa = POWER_ARMOR_BY_ID[armorItem.ref.slice(11)];
    armorName = armorItem.name;
    ac = pa.ac;
    dp = pa.dp;
    upgradeSlots = pa.slots;
    upgradeSlotsUsed = (armorItem.upgrades || []).length;
    if (race?.noPowerArmor) armorStrWarning = 'Robots cannot use power armor.';
    if (ch.race === 'supermutant' && !(armorItem.upgrades || []).some(u => u.id === 'super_mutant_fitting')) armorStrWarning = 'Super mutants need the Super Mutant Fitting upgrade to use power armor.';
  }
  ac = Math.max(10, ac) + sumEffects(effects, 'ac');
  ac = Math.max(ch.traits?.some(t => t.id === 'godspeed') ? 8 : 10, ac);
  dt = Math.max(0, dt + sumEffects(effects, 'dt'));

  // Senses & misc
  const passiveSense = 12 + mods.PER + sumEffects(effects, 'passiveSense');
  const combatSequence = mods.PER + sumEffects(effects, 'combatSequence') + effects.filter(e => e.type === 'combatSequencePerMod').reduce((s, e) => s + Math.max(0, mods[e.ability]), 0);
  const hasRadiation = (race?.hasRadiationDC ?? true) || hasEffect(effects, 'gainsRadiation');
  const radThreshold = hasRadiation ? Math.max(1, 10 + mods.END + sumEffects(effects, 'radThreshold')) : null;
  const radReduction = sumEffects(effects, 'radReduction');
  let partyNerve = Number(ch.partyNerve) || 0;
  partyNerve += sumEffects(effects, 'partyNerve');
  const pnMult = effects.filter(e => e.type === 'partyNerveMultiplier').reduce((m, e) => m * e.value, 1);
  partyNerve = hasEffect(effects, 'noPartyNerve') ? 0 : Math.floor(partyNerve * pnMult);
  const karmaCaps = 1 + luck.karmaCaps + sumEffects(effects, 'karmaCaps');
  const blockBonus = Math.floor(special.END / 2) + sumEffects(effects, 'blockBonus');
  const chemLimit = clamp(2 + Math.floor(mods.END / 2), 1, 4);
  const deathSave = { dc: 12, bonus: Math.max(mods.LCK, mods.END) + partyNerve };

  // Level progression accounting
  const skillPointInt = effects.find(e => e.type === 'skillPointsAsInt')?.value ?? special.INT;
  const grants = skillPointGrantsAtLevel(level);
  const perGrant = skillPointsPerGrant(skillPointInt) + sumEffects(effects, 'skillPointsPerGrant');
  const skillPointsAvailable = grants * perGrant;
  const skillPointsUsed = Object.values(ch.skillPoints || {}).reduce((s, v) => s + (Number(v) || 0), 0);
  const devoutAvailable = sumEffects(effects, 'skillPoints');
  const devoutUsed = Object.values(ch.devoutSkillPoints || {}).reduce((s, v) => s + (Number(v) || 0), 0);
  const perkPointsAvailable = perkPointsAtLevel(level) + sumEffects(effects, 'perkPoints');
  const freePerks = effects.filter(e => e.type === 'freePerk').map(e => e.perk);
  const perkPointsUsed = (ch.perks || []).reduce((s, p) => s + (freePerks.includes(p.id) ? Math.max(0, (p.count || 1) - 1) : (p.count || 1)), 0)
    + Object.values(ch.specialFromPerks || {}).reduce((s, v) => s + (Number(v) || 0), 0);

  // Condition penalty to d20 rolls
  const cond = ch.conditions || {};
  const ignoreExhaustion = (ch.perks || []).some(p => p.id === 'alive_and_kickin') ? 3 : 0;
  const ignoreRads = (ch.perks || []).some(p => p.id === 'rad_tastic') ? 3 : 0;
  const d20Penalty = Math.max(0, (cond.exhaustion || 0) - ignoreExhaustion) + Math.max(0, (cond.radLevels || 0) - ignoreRads)
    + (cond.hunger || 0) + (cond.dehydration || 0) + (cond.fatigue || 0) + (cond.hypothermia || 0) + (cond.overheating || 0)
    + ((cond.alcohol || 0) >= 3 ? 3 : (cond.alcohol || 0) === 2 ? 2 : 0);
  const radPoolPenalty = (cond.radLevels || 0) * 2;

  // Weapons
  const weapons = (ch.inventory || []).filter(i => i.ref?.startsWith('weapon:')).map(i => ({ item: i, stats: weaponStats(ch, i, { special, effects, skills, luck }) }));
  const unarmed = weaponStats(ch, { ref: 'weapon:unarmed_strike' }, { special, effects, skills, luck });

  return {
    level, effects, special, mods, luck, race, variant, inc,
    skills, hpMax: Math.max(1, hpMax - radPoolPenalty), spMax: Math.max(0, spMax - radPoolPenalty), apMax, healingRate,
    carryMax, load, encumbrance, bagWarning, packRat,
    ac, dt, dp, armorName, armorItem, armorDecayPenalty, armorStrWarning, upgradeSlots, upgradeSlotsUsed,
    passiveSense, combatSequence, radThreshold, radReduction, partyNerve, karmaCaps, blockBonus, chemLimit, deathSave,
    skillPointsAvailable, skillPointsUsed, devoutAvailable, devoutUsed, perkPointsAvailable, perkPointsUsed, perGrant, grants,
    d20Penalty, radPoolPenalty, weapons, unarmed, creation: creationPoints(ch),
  };
}

// ---------------------------------------------------------------------------
// Perk requirement checking
// ---------------------------------------------------------------------------
export function perkAvailability(ch, perk, derived) {
  const reasons = [];
  const req = perk.req || {};
  const countsAsRobot = hasEffect(derived.effects, 'countsAsRobot');
  if (req.ability) {
    const score = perkRequirementScore(req.ability, derived.special, derived.effects);
    if (req.min != null && score < req.min) reasons.push(`${req.ability} ${req.min} required (you have ${score})`);
    if (req.max != null && score > req.max) reasons.push(`${req.ability} ${req.max} or lower required`);
  }
  if (req.race && !req.race.includes(ch.race) && !(countsAsRobot && req.race.includes('robot'))) reasons.push(`Race: ${req.race.join(' / ')}`);
  if (req.level && derived.level < req.level) reasons.push(`Level ${req.level} required`);
  const taken = (ch.perks || []).find(p => p.id === perk.id)?.count || 0;
  const max = perk.repeat || 1;
  if (taken >= max) reasons.push(max > 1 ? `Already taken ${taken}/${max} times` : 'Already taken');
  return { ok: reasons.length === 0, reasons, taken, max };
}
