// Armor (Changes doc table), armor upgrades (Changes doc), power armor (2.1 pg. 56-59, unchanged by the Changes doc).

export const ARMOR = [
  { id: 'cloth',     name: 'Cloth Armor',          cost: 50,  ac: 10, dt: 0, slots: 5, load: 5,  str: 1, text: 'Light with the most upgrade slots. Most vault suits are cloth armor.' },
  { id: 'leather',   name: 'Leather Armor',        cost: 175, ac: 11, dt: 1, slots: 4, load: 15, str: 2, text: 'Jacket, arm fittings, knee pads and boots. Not tough but fits easily.' },
  { id: 'metal',     name: 'Metal Armor',          cost: 250, ac: 12, dt: 0, slots: 3, load: 20, str: 5, text: 'Welded and fitted pieces. Toughness with less coverage.' },
  { id: 'multilayered', name: 'Multilayered Armor', cost: 275, ac: 10, dt: 2, slots: 3, load: 30, str: 3, text: 'Layers of leather, cloth, tarp and metal. Maximum coverage, little toughness.' },
  { id: 'steel',     name: 'Steel Armor',          cost: 650, ac: 13, dt: 2, slots: 2, load: 50, str: 6, text: 'Fitted plates like a knight. Coverage and toughness if you have the strength.' },
  { id: 'ballistic', name: 'Ballistic Weave',      cost: 800, ac: 12, dt: 3, slots: 2, load: 15, str: 3, text: 'Kevlar and military jackets. Extremely rare; the best of everything.' },
  { id: 'vaultsuit', name: 'Vault Suit',           cost: 1300, ac: 10, dt: 0, slots: 5, load: 5, str: 1, unique: true, text: 'Functions as cloth armor with rank 1 Lead Lined, Reinforced, Fitted and Sturdy upgrades. With a Pip-Boy and no more than five levels of decay, healing restores an additional amount equal to your level.',
    builtInUpgrades: [{ id: 'lead_lined', rank: 1 }, { id: 'reinforced', rank: 1 }, { id: 'fitted', rank: 1 }, { id: 'sturdy', rank: 1 }] },
];

export const ARMOR_BY_ID = Object.fromEntries(ARMOR.map(a => [a.id, a]));

// Armor upgrades: ranks 1-3, each rank costs the base cost. Effects are cumulative.
export const ARMOR_UPGRADES = [
  { id: 'insulated',   name: 'Insulated',   cost: 80,  maxRank: 2, ranks: [
    { text: 'Insulated against hypothermia. Maximum AP −1 (minimum 6).', effects: [{ type: 'apMax', value: -1 }] },
    { text: 'AP no longer decreased. (This rank costs 300 caps.)', effects: [{ type: 'apMax', value: 1 }] } ] },
  { id: 'camouflage',  name: 'Camouflage',  cost: 100, maxRank: 3, ranks: [
    { text: '+2 to Sneak checks and Passive Sneak.', effects: [{ type: 'skill', skill: 'Sneak', value: 2 }] },
    { text: '+2 to Sneak checks and Passive Sneak.', effects: [{ type: 'skill', skill: 'Sneak', value: 2 }] },
    { text: '+2 to Sneak checks and Passive Sneak.', effects: [{ type: 'skill', skill: 'Sneak', value: 2 }] } ] },
  { id: 'light',       name: 'Light',       cost: 50,  maxRank: 3, ranks: [
    { text: 'Load −5, Strength requirement −1, DT −1.', effects: [{ type: 'armorLoad', value: -5 }, { type: 'armorStr', value: -1 }, { type: 'dt', value: -1 }] },
    { text: 'Load −5 more (minimum 3).', effects: [{ type: 'armorLoad', value: -5 }] },
    { text: 'If you spend at least 4 AP moving, move an additional 10 feet.' } ] },
  { id: 'fitted',      name: 'Fitted',      cost: 150, maxRank: 3, ranks: [
    { text: 'Your DT is doubled against area of effect damage.' },
    { text: 'Maximum SP increases by your level.', effects: [{ type: 'spPerLevel', value: 1 }] },
    { text: 'Advantage on combat sequence rolls (+5 if you already have advantage).' } ] },
  { id: 'lead_lined',  name: 'Lead Lined',  cost: 150, maxRank: 3, ranks: [
    { text: 'Whenever you take 2d4 RADs, take 1 less.', effects: [{ type: 'radReduction', value: 1 }] },
    { text: 'Whenever you take 2d4 RADs, take 1 less.', effects: [{ type: 'radReduction', value: 1 }] },
    { text: 'Whenever you take 2d4 RADs, take 1 less.', effects: [{ type: 'radReduction', value: 1 }] } ] },
  { id: 'strengthened', name: 'Strengthened', cost: 200, maxRank: 3, ranks: [
    { text: 'DT +3 against critical hits.' },
    { text: 'DT +5 against critical hits (instead of +3).' },
    { text: 'A severe injury becomes a random limb condition instead.' } ] },
  { id: 'sturdy',      name: 'Sturdy',      cost: 300, maxRank: 3, ranks: [
    { text: 'Ignore the negative effects of the first 2 levels of armor decay.', effects: [{ type: 'ignoreArmorDecay', value: 2 }] },
    { text: 'Ignore the first 4 levels of armor decay.', effects: [{ type: 'ignoreArmorDecay', value: 2 }] },
    { text: 'Armor no longer decays from critical hits.' } ] },
  { id: 'pocketed',    name: 'Pocketed',    cost: 150, maxRank: 3, ranks: [
    { text: 'Carry load +10.', effects: [{ type: 'carry', value: 10 }] },
    { text: 'Carry load +10.', effects: [{ type: 'carry', value: 10 }] },
    { text: 'Carry load +10.', effects: [{ type: 'carry', value: 10 }] } ] },
  { id: 'reinforced',  name: 'Reinforced',  cost: 300, maxRank: 3, ranks: [
    { text: '+1 DT.', effects: [{ type: 'dt', value: 1 }] },
    { text: '+1 DT.', effects: [{ type: 'dt', value: 1 }] },
    { text: '+1 DT.', effects: [{ type: 'dt', value: 1 }] } ] },
  { id: 'hardened',    name: 'Hardened',    cost: 400, maxRank: 3, ranks: [
    { text: '+1 AC.', effects: [{ type: 'ac', value: 1 }] },
    { text: '+1 AC.', effects: [{ type: 'ac', value: 1 }] },
    { text: '+1 AC.', effects: [{ type: 'ac', value: 1 }] } ] },
];

export const ARMOR_UPGRADE_BY_ID = Object.fromEntries(ARMOR_UPGRADES.map(u => [u.id, u]));

// Power Armor (2.1). Load 100 (0 while worn), no Strength requirement, Strength counts as 12 while worn.
export const POWER_ARMOR = [
  { id: 'pa_t45', name: 'T-45 Power Armor',  cost: 4050,   ac: 14, dp: 15, slots: 6, repairDC: 16, time: '4 hours' },
  { id: 'pa_t51', name: 'T-51 Power Armor',  cost: 80250,  ac: 17, dp: 20, slots: 5, repairDC: 23, time: '6 hours' },
  { id: 'pa_t60', name: 'T-60 Power Armor',  cost: 85750,  ac: 16, dp: 30, slots: 6, repairDC: 20, time: '4 hours' },
  { id: 'pa_x01', name: 'X-01 Power Armor',  cost: 133500, ac: 16, dp: 45, slots: 4, repairDC: 25, time: '3 hours' },
  { id: 'pa_x02', name: 'X-02 Power Armor',  cost: 155000, ac: 18, dp: 40, slots: 4, repairDC: 25, time: '3 hours' },
];

export const POWER_ARMOR_UPGRADES = [
  { id: 'explosive_shielding', name: 'Explosive Shielding', cost: 1350, maxRank: 3, ranks: ['Reduce explosive damage taken by 5.', 'Reduce explosive damage taken by 10.', 'Reduce explosive damage taken by 15.'] },
  { id: 'prism_shielding', name: 'Prism Shielding', cost: 1800, maxRank: 3, ranks: ['Reduce laser and plasma damage taken by 5.', 'Reduce laser and plasma damage taken by 5 more.', 'Reduce laser and plasma damage taken by 10 more.'] },
  { id: 'emergency_protocols', name: 'Emergency Protocols', cost: 1800, maxRank: 2, ranks: ['Below half HP: spend 1 AP to move 10 feet.', 'Below half HP: DT +5 against HP damage.'] },
  { id: 'kinetic_dynamo', name: 'Kinetic Dynamo', cost: 2400, maxRank: 1, ranks: ['+1 AP at the start of your turn for each level of decay the armor gained since your last turn.'] },
  { id: 'tesla_coils', name: 'Tesla Coils', cost: 2400, maxRank: 3, ranks: ['3 AP to toggle: creatures within 10 feet take 1d6 electricity on activation and at the start of their turns. −10 minutes allotted time per round.', 'Damage +1d6, −5 more minutes per round.', 'Damage +2d6, −10 more minutes per round.'] },
  { id: 'reactive_plates', name: 'Reactive Plates', cost: 2700, maxRank: 3, ranks: ['Melee attackers take a quarter of the damage they dealt.', 'Melee attackers take half of the damage they dealt.', 'Melee attackers are knocked back 15 feet.'] },
  { id: 'core_assembly', name: 'Core Assembly', cost: 2250, maxRank: 3, ranks: ['Overheat threshold 18 AP instead of 15.', 'Overheat threshold 20 AP.', 'Overheating costs 15 minutes instead of 30.'] },
  { id: 'jet_pack', name: 'Jet Pack', cost: 6000, maxRank: 1, ranks: ['Spend 1 AP to fly 5 feet. Every 10 feet or second of flight uses 1 minute of allotted time.'] },
  { id: 'sensor_array', name: 'Sensor Array', cost: 4500, maxRank: 3, ranks: ['Passive sense +5.', 'Passive sense +5.', 'Passive sense +10.'], effects: [[{ type: 'passiveSense', value: 5 }], [{ type: 'passiveSense', value: 5 }], [{ type: 'passiveSense', value: 10 }]] },
  { id: 'vats_matrix', name: 'VATS Matrix Overlay', cost: 2700, maxRank: 2, ranks: ['Targeted attacks cost 1 less additional AP.', 'Targeted attacks cost 1 less additional AP.'] },
  { id: 'internal_database', name: 'Internal Database', cost: 2400, maxRank: 1, ranks: ['Spend 6 AP to learn a visible creature\'s HP, SP, AC or DT.'] },
  { id: 'targeting_hud', name: 'Targeting HUD', cost: 1800, maxRank: 3, ranks: ['3 AP to mark a creature: +1 damage die against it.', 'Mark up to two more creatures.', 'Another +1 damage die against marked creatures.'] },
  { id: 'headlamp', name: 'Headlamp', cost: 250, maxRank: 3, ranks: ['1 AP: bright light 40 ft cone, dim light 40 more.', 'Light +10 feet.', 'Light +10 feet; turning it on in darkness blinds creatures within 5 feet for a round.'] },
  { id: 'rusty_knuckles', name: 'Rusty Knuckles', cost: 100, maxRank: 1, ranks: ['Unarmed hits cause bleeding.'] },
  { id: 'optimized_bracers', name: 'Optimized Bracers', cost: 1700, maxRank: 3, ranks: ['6 AP unarmed attack dealing 2d6 bludgeoning.', 'Damage +1d6.', 'Damage +1d6 and push targets 15 feet.'] },
  { id: 'calibrated_shocks', name: 'Calibrated Shocks', cost: 1000, maxRank: 3, ranks: ['Carry Load +15.', 'Carry Load +15.', 'Carry Load +20.'], effects: [[{ type: 'carry', value: 15 }], [{ type: 'carry', value: 15 }], [{ type: 'carry', value: 20 }]] },
  { id: 'overclock_hydraulics', name: 'Overclock Hydraulics', cost: 1950, maxRank: 3, ranks: ['While overheated: max AP +2, advantage on attacks, 15 ft per 1 AP, unarmed +3d6 fire.', 'Spend 3 AP to overheat the core.', 'Maximum AP +2.'], effects: [[], [], [{ type: 'apMax', value: 2 }]] },
  { id: 'explosive_vent', name: 'Explosive Vent', cost: 1250, maxRank: 3, ranks: ['Fall 15+ feet: creatures within 20 ft take 3d6 fire and 3d6 explosive. −20 minutes allotted time.', 'Fire and explosive damage +1d6 each.', 'Radius +10 feet.'] },
  { id: 'super_mutant_fitting', name: 'Super Mutant Fitting', cost: null, maxRank: 1, ranks: ['Fitted for a super mutant; humans and ghouls can no longer use it. Costs 50% of the armor\'s base cost.'] },
];

export const POWER_ARMOR_UPGRADE_BY_ID = Object.fromEntries(POWER_ARMOR_UPGRADES.map(u => [u.id, u]));
