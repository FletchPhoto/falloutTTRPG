// Quick reference text for the DATA tab. Changes doc rules take precedence over 2.1.

export const ACTIONS = [
  ['Attack', 'Weapon AP'], ['Block (melee weapon)', '3 AP'], ['Dodge', '6 AP'], ['Equip a weapon', '3 AP'], ['Escape', '5 AP'],
  ['Grapple', '3 AP'], ['Help', '6 AP'], ['Hide', '6 AP'], ['Interact with an object', '3 AP'], ['Move 5 feet', '1 AP'],
  ['Ready', '+2 AP'], ['Reload', '6 AP'], ['Search', '3 AP'], ['Shove', '4 AP'], ['Sprint (50 ft line)', '5 AP'],
  ['Stand up from prone', '5 AP'], ['Stow a weapon', '3 AP'], ['Take cover', '3 AP'], ['Unarmed strike (two for 5 AP)', '3 AP'],
  ['Use a chem', '4 AP'], ['Death save (while dying)', '2 AP'],
];

export const RULE_NOTES = [
  { title: 'Action Points', text: 'AP = 12 + half your Agility modifier (rounded up), maximum 15. Unspent AP is recycled in full, up to 5, at the start of your next turn.' },
  { title: 'Blocking', text: 'Spend 3 AP while wielding a melee weapon: your AC increases by half your Endurance score (rounded down) against melee attacks until your next turn. Each time you are attacked in melee the bonus drops by 2. Defensive weapons add +2.' },
  { title: 'Death Saves', text: 'DC 12. Roll a d20 + Luck or Endurance modifier + Party Nerve. Three successes: 1 HP. Three failures: death (humans die on the fourth). A natural 1 counts as two failures; a natural 20 restores 1 HP. Stabilising: 6 AP Medicine check — 12+ grants a success or removes a failure, 20+ two, natural 20 three; 3 or lower adds a failure.' },
  { title: 'Radiation', text: 'Radiation threshold = 10 + Endurance modifier. Irradiated zones inflict 2d4 RADs at the listed frequency (Level 1: 30 min, 2: 10 min, 3: 3 min, 4: 1 min, 5: 30 s, 6: 6 s). When your RADs reach the threshold you gain a level of radiation and subtract the threshold. Each level: −1 to all d20 rolls and −2 HP and SP. Rad-X, gas masks, lead lining and Fortifying food reduce 2d4 RADs (minimum 1). Ten levels kill you.' },
  { title: 'Luck', text: 'Modifier −1 or lower: −1 to all skills. +1: crit chance −1. +2: +1 to all skills. +3: crit chance −1 again. +4: +1 skills again. +5: an extra Karma Cap. Shotguns ignore the crit bonus.' },
  { title: 'Strength Requirement', text: 'For each point you fall short of a weapon\'s Strength requirement you suffer −2 to attack rolls (or +2 AP for area of effect weapons).' },
  { title: 'Sneak Attacks', text: 'Damage goes straight to HP. You have advantage on the attack roll and your crit chance decreases by 2. Sneak attacks no longer automatically crit.' },
  { title: 'Surprise', text: 'A creature whose passive sense is equal to or lower than your Sneak roll is surprised: disadvantage on combat sequence and half AP on their first turn.' },
  { title: 'Group Sneaking', text: 'Everyone rolls. Those who beat the enemies\' highest passive sense may reduce their result by 5 to grant another creature a re-roll or +3.' },
  { title: 'Unarmed Strikes', text: 'A natural 1 with an unarmed strike (not an unarmed weapon) deals 1d4 damage to you.' },
  { title: 'Damage Order', text: 'Temporary SP → SP → resistance/vulnerability → DT → temporary HP → HP. SP can only absorb damage you are aware of.' },
  { title: 'Decay', text: 'Weapons: −1 to attack rolls per level of decay; a natural 1 adds a level. Armor: AC and DT reduced by half the decay levels (rounded down); crits against you and falling to 0 HP add a level. Ten levels breaks an item. Every level of decay reduces price by 10%.' },
  { title: 'Explosives', text: 'Roll d20 + Explosives. 1: detonates in your hand. 2–3: thrown half distance, detonates at the start of your next turn. 4–14: detonates at the start of your next turn. 15+: detonates at the end of your turn. Throwback: 10 or lower detonates in hand, 11–15 half distance, 16+ start of next turn.' },
  { title: 'Missile Launcher', text: '1: detonates in the tube. 2–6: half distance and detonates immediately. 7–11: double distance, end of turn. 12+: hits and detonates at the end of your turn.' },
  { title: 'Chems', text: 'All chem effects last one hour. Chem limit = 2 + half your Endurance modifier (1–4) per day; each chem beyond it adds 5 levels of exhaustion. Addiction: DC 6 Endurance check. Lose an addiction after (5 − Endurance modifier) days, minimum 1.' },
  { title: 'Alcohol Levels', text: 'Level 1 Buzzed: disadvantage on INT/PER checks, advantage on END/STR checks, melee damage +2, −1 AP. Level 2 Drunk: SP + level, melee +2, −1 AP, −2 on non-Luck d20s. Level 3 Hammered: as drunk with −3 and vomiting on a natural 1 (lose 5 AP). Level 4 Wasted: −1 AP, DC 15 END every 10 minutes or fall unconscious; you remember nothing.' },
  { title: 'Resting', text: 'Organic: 1 hour restores SP to half (full if sleeping comfortably); 6 hours restores HP equal to half Endurance + level and removes one exhaustion level. Machines: 1 hour restores full SP; 2 hours restores HP equal to half INT or PER + level.' },
  { title: 'Food & Water', text: 'Humans, ghouls and super mutants gain a level of hunger every 24 hours without food and three levels of dehydration without three drinks (or a Hydrating drink). Super mutants need double. Ten levels of either is fatal.' },
  { title: 'Travel', text: 'Slow 18 miles/day (passive sneak 15 + group sneak, advantage on combat sequence); Normal 24; Fast 30 (10 + group sneak, disadvantage). Travel 8 + half END modifier hours per day; more adds fatigue.' },
  { title: 'Cover', text: 'Half cover +2 AC, three-quarters +5 AC (both give resistance to explosives beyond the cover). Total cover cannot be targeted.' },
  { title: 'Karma Caps', text: 'Flip a cap for advantage or a re-roll. Roll a natural 1 with a flipped cap to flip it back; the GM may flip your flipped cap for their own rolls. Luck +5 grants an extra cap.' },
];

export const TARGETED_ATTACKS = [
  { limb: 'Eyes', ap: '+5 (ranged to-hit halved)', effect: 'Damage halved', conds: ['−5 attacks 2 turns', 'Disadvantage 2 turns', 'Blinded 2 turns', 'Temporary Blindness'], severe: 'Eye Gouged' },
  { limb: 'Head', ap: '+3 (ranged to-hit halved)', effect: 'Damage dice +1', conds: ['−2 attacks 2 turns', '−5 attacks 2 turns', '−2 AP 2 turns', 'Rattled'], severe: 'Sliced Jugular or Concussion' },
  { limb: 'Arm', ap: '+3', effect: 'Damage dice −1', conds: ['Drops held item', '−2 attacks 2 turns', '−5 attacks 2 turns', 'Broken Arm'], severe: 'Severed Arm/Hand' },
  { limb: 'Torso', ap: '+2', effect: 'None', conds: ['None', 'None', '−2 AP 2 turns', 'Gut Wallop'], severe: 'Internal Bleeding' },
  { limb: 'Groin', ap: '+3', effect: 'None', conds: ['−2 AP 2 turns', '−3 AP 2 turns', 'Falls prone', 'Painful Collapse'], severe: 'Intense Agony' },
  { limb: 'Leg', ap: '+2', effect: 'Damage dice −1', conds: ['Max 30 ft 2 turns', 'Max 20 ft 2 turns', 'Max 15 ft 2 turns', 'Leg Cripple'], severe: 'Severed Leg/Foot' },
  { limb: 'Held object', ap: '+4', effect: 'Object decays 1, creature unharmed', conds: ['Decays 2', 'Flies 1 ft', 'Flies 1d4×5 ft', 'Choose 1–3'], severe: 'Destroyed' },
];

export const CONDITIONS = [
  ['Bleeding', 'Lose HP equal to half your healing rate per level at the start of each turn. Healing removes two levels instead of restoring HP.'],
  ['Blinded', 'Cannot see; fail sight checks; attacks against you have advantage.'],
  ['Burning', '1d10 fire at the start of your turns. 6 AP to extinguish.'],
  ['Dazed', 'Maximum AP −3 and no AP recycling.'],
  ['Deafened', 'Cannot hear.'],
  ['Dehydration', '−1 to d20s per level. Ten levels kill.'],
  ['Encumbered', '2 AP per 5 feet; travel pace halved; a level of fatigue per hour.'],
  ['Heavily Encumbered', '3 AP per 5 feet; travel halved; −2 max SP per hour travelled; −10 carry per day travelled.'],
  ['Exhaustion', '−1 to d20s per level. Ten levels kill. Remove one per 6 hour rest (2 hours for machines).'],
  ['Fatigue', '−1 to d20s per level (max 9). Lose one level at the end of each turn.'],
  ['Frightened', 'END or CHA check DC 8 + the frightener\'s Intimidation. Flight, Fight, Freeze or Fawn.'],
  ['Grappled', 'Cannot spend AP to move.'],
  ['Hunger', '−1 to d20s per level. Ten levels kill.'],
  ['Hypothermia / Overheating', '−1 to d20s per level and AP reduced by half the levels. Ten levels kill.'],
  ['Invisible', 'Attacks against you have disadvantage; yours have advantage.'],
  ['Poisoned', 'Disadvantage on all d20 rolls.'],
  ['Prone', 'Crawl only; disadvantage on attacks; attackers within 5 feet have advantage, others disadvantage.'],
  ['Radiation', '−1 to d20s per level, −2 HP and SP per level. Ten levels kill (Luck DC 20 to return as a ghoul).'],
  ['Restrained', 'Cannot move and damage bypasses SP.'],
  ['Shock', 'Cannot regain SP; disadvantage on d20 rolls.'],
  ['Short Circuit', '1d12 electricity per level at the start of your turns and −1 max AP. 6 AP removes a level.'],
  ['Slowed', 'Start your turn with a maximum of 6 AP.'],
  ['Unconscious', 'Drop everything, SP to 0, unaware.'],
];

export const MINOR_DISEASES = [
  ['Parasites', '2 levels of hunger; +1 per day.', '8 hours × (12 − END)'],
  ['Weeping Sores', 'HP damage gives a level of bleeding.', '6 hours × (12 − END)'],
  ['Blood Worms', 'HP damage deals 1d4 poison.', '6 hours × (12 − END)'],
  ['Fever', '2 levels of exhaustion; −1 AP.', '8 hours × (12 − END)'],
  ['Rad Worms', '3 RADs; radiation threshold −2.', '12 hours × (12 − END)'],
  ['Weakness', 'Current and max HP and SP −2.', '12 hours × (12 − END)'],
];
