// S.P.E.C.I.A.L. ability scores and skills (Fallout TTRPG 2.1, pg. 19-25; Archery added by the Changes doc)

export const ABILITIES = [
  { key: 'STR', name: 'Strength',     blurb: 'Raw physical power. Melee/unarmed hit & damage, carry load, weapon strength requirements.' },
  { key: 'PER', name: 'Perception',   blurb: 'Senses and insight. Combat sequence, passive sense, weapon range, energy weapon hit & damage.' },
  { key: 'END', name: 'Endurance',    blurb: 'Toughness. Hit points, healing rate, radiation threshold (10 + modifier), blocking.' },
  { key: 'CHA', name: 'Charisma',     blurb: 'Force of personality. Barter, speech, party nerve.' },
  { key: 'INT', name: 'Intelligence', blurb: 'Reasoning and memory. Skill points on level up, crafting, science.' },
  { key: 'AGI', name: 'Agility',      blurb: 'Quickness. Action points (12 + half modifier), stamina points, guns hit & damage, sneak.' },
  { key: 'LCK', name: 'Luck',         blurb: 'Fate and fortune. Luck table: +1 crit, +2 skills, +3 crit, +4 skills, +5 karma cap (Changes doc).' },
];

export const ABILITY_KEYS = ABILITIES.map(a => a.key);

/** Modifier is score minus 5 (score 1 → -4, score 10 → +5). */
export function abilityMod(score) {
  return (Number(score) || 0) - 5;
}

export const SKILLS = [
  { key: 'Archery',       abilities: ['PER'], source: 'changes' },
  { key: 'Barter',        abilities: ['CHA'] },
  { key: 'Breach',        abilities: ['PER', 'INT'] },
  { key: 'Crafting',      abilities: ['INT'] },
  { key: 'Energy Weapons',abilities: ['PER'] },
  { key: 'Explosives',    abilities: ['PER'] },
  { key: 'Guns',          abilities: ['AGI'] },
  { key: 'Intimidation',  abilities: ['STR', 'CHA'] },
  { key: 'Medicine',      abilities: ['PER', 'INT'] },
  { key: 'Melee Weapons', abilities: ['STR'] },
  { key: 'Science',       abilities: ['INT'] },
  { key: 'Sneak',         abilities: ['AGI'] },
  { key: 'Speech',        abilities: ['CHA'] },
  { key: 'Survival',      abilities: ['END'] },
  { key: 'Unarmed',       abilities: ['STR'] },
];

export const SKILL_KEYS = SKILLS.map(s => s.key);

export const DIFFICULTY_TABLE = [
  ['Extremely small chance of failure', 1],
  ['Very Easy', 4],
  ['Easy', 8],
  ['Medium', 12],
  ['Hard', 16],
  ['Very Hard', 20],
  ['Nearly Impossible', 25],
  ['Extremely small chance of success', 30],
];

/**
 * Level-up table (pg. 6).
 * SP/HP base = 10 + 5 per odd level from 3; ability modifier multiplied by (1 + increments).
 * Perk points: 1 per level except 5th, 9th, 13th, 17th and 19th.
 * Skill points: granted at 5, 9, 13, 17, 21, 25, 29 — 3 / 4 / 5 per grant for INT ≤4 / 5 / ≥6.
 */
export const MAX_LEVEL = 30;
export const NO_PERK_LEVELS = [5, 9, 13, 17, 19];
export const SKILL_POINT_LEVELS = [5, 9, 13, 17, 21, 25, 29];

export function poolIncrements(level) {
  return Math.floor((Math.max(1, level) - 1) / 2);
}

export function perkPointsAtLevel(level) {
  let pts = 0;
  for (let l = 1; l <= level; l++) if (!NO_PERK_LEVELS.includes(l)) pts++;
  return pts;
}

export function skillPointsPerGrant(intScore) {
  if (intScore <= 4) return 3;
  if (intScore === 5) return 4;
  return 5;
}

export function skillPointGrantsAtLevel(level) {
  return SKILL_POINT_LEVELS.filter(l => l <= level).length;
}

/**
 * Luck table from the Changes doc. Cumulative: each row adds to the previous ones.
 * Returns { skills, crit, karmaCaps } bonuses derived from the Luck modifier.
 */
export function luckBonuses(luckMod) {
  if (luckMod <= -1) return { skills: -1, crit: 0, karmaCaps: 0 };
  return {
    skills: (luckMod >= 2 ? 1 : 0) + (luckMod >= 4 ? 1 : 0),
    crit: 0 - ((luckMod >= 1 ? 1 : 0) + (luckMod >= 3 ? 1 : 0)) || 0,
    karmaCaps: luckMod >= 5 ? 1 : 0,
  };
}

/** Action points (Changes doc): 12 + half the Agility modifier, rounded up. Maximum 15. */
export function baseActionPoints(agiMod) {
  return 12 + Math.ceil(agiMod / 2);
}

export const AP_MAX = 15;
