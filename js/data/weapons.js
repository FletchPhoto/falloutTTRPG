// Weapons — all tables from the "Fallout TTRPG Changes" document (which replaces the 2.1 weapon tables).
// Costs come from the Changes doc price tiers (a representative value inside each tier's range).
// group → skill: handgun/smg/rifle/shotgun/bigGun = Guns (AGI dmg); energy = Energy Weapons (PER dmg);
// archery = Archery (PER dmg); bladed/blunt/mechanical = Melee Weapons (STR dmg); unarmed = Unarmed (STR dmg).

export const RANGED_TIERS = { crude: 40, moderate: 125, good: 350, epic: 750, legendary: 1200 };
export const MELEE_TIERS  = { crude: 20, moderate: 60,  good: 200, epic: 550, legendary: 900 };

export const WEAPON_GROUPS = {
  archery:    { name: 'Archery Weapons', kind: 'ranged', skill: 'Archery',        dmgAbility: 'PER' },
  handgun:    { name: 'Handguns',        kind: 'ranged', skill: 'Guns',           dmgAbility: 'AGI' },
  smg:        { name: 'Submachine Guns', kind: 'ranged', skill: 'Guns',           dmgAbility: 'AGI' },
  rifle:      { name: 'Rifles',          kind: 'ranged', skill: 'Guns',           dmgAbility: 'AGI' },
  shotgun:    { name: 'Shotguns',        kind: 'ranged', skill: 'Guns',           dmgAbility: 'AGI' },
  bigGun:     { name: 'Big Guns',        kind: 'ranged', skill: 'Guns',           dmgAbility: 'AGI' },
  energy:     { name: 'Energy Weapons',  kind: 'ranged', skill: 'Energy Weapons', dmgAbility: 'PER' },
  bladed:     { name: 'Bladed Weapons',  kind: 'melee',  skill: 'Melee Weapons',  dmgAbility: 'STR' },
  blunt:      { name: 'Blunt Weapons',   kind: 'melee',  skill: 'Melee Weapons',  dmgAbility: 'STR' },
  mechanical: { name: 'Mechanical Weapons', kind: 'melee', skill: 'Melee Weapons', dmgAbility: 'STR' },
  unarmed:    { name: 'Unarmed Weapons', kind: 'melee',  skill: 'Unarmed',        dmgAbility: 'STR' },
};

const W = (group, name, ap, damage, range, crit, ammo, rounds, props, load, str, tier, extra = {}) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
  name, group, ap, damage, range, crit, ammo, rounds, props, load, str, tier,
  cost: WEAPON_GROUPS[group].kind === 'ranged' ? RANGED_TIERS[tier] : MELEE_TIERS[tier],
  ...extra,
});
const M = (group, name, ap, damage, crit, props, load, str, tier, extra = {}) =>
  W(group, name, ap, damage, '5 ft', crit, null, null, props, load, str, tier, extra);

export const WEAPONS = [
  // ---- Archery ----
  W('archery', 'Shortbow',      4, '1d6 piercing',  'x4/x8',  '20, x2', 'Arrow', null, ['Charge', 'Drawstring', 'Flimsy'], 12, 5, 'moderate'),
  W('archery', 'Longbow',       5, '1d8 piercing',  'x6/x12', '20, x2', 'Arrow', null, ['Charge', 'Drawstring', 'Flimsy'], 16, 6, 'moderate'),
  W('archery', 'Greatbow',      6, '1d10 piercing', 'x8/x16', '20, x2', 'Arrow', null, ['Charge', 'Drawstring', 'Flimsy'], 20, 7, 'moderate'),
  W('archery', 'Compound Bow',  5, '1d10 piercing', 'x6/x10', '20, x2', 'Arrow', null, ['Charge', 'Drawstring', 'Sturdy', 'Destructive'], 18, 5, 'good'),
  W('archery', 'Crossbow',      4, '2d8 piercing',  'x6/x12', '20, x2', 'Arrow', 1,    ['Quick Reload', 'Two Handed'], 12, 4, 'moderate'),

  // ---- Handguns ----
  W('handgun', 'Acid Soaker',            4, '1d4 acid',      '30 ft',  '20, 1d4',  'Acid', 10,   ['Corrosive'], 5, 1, 'crude'),
  W('handgun', 'Flare Gun',              4, '1d4 fire',      'x4/x10', '20, 1d4',  'Flares', 1,  ['Incendiary', 'Quick Reload'], 3, 1, 'crude'),
  W('handgun', 'Pipe Pistol',            4, '1d6 ballistic', 'x6/x10', '20, 1d6',  '9mm', 10,    ['Breakable', 'Kickback'], 5, 1, 'crude'),
  W('handgun', 'Bolt-action Pipe Pistol',6, '1d12 ballistic','x8/x14', '20, 3d4',  '.308', 3,    ['Breakable', 'Destructive', 'Kickback'], 8, 5, 'crude'),
  W('handgun', 'Pipe Revolver',          5, '1d8 ballistic', 'x6/x12', '20, x3',   '.357 Magnum', 6, ['Breakable', 'Kickback', 'Manual Reload'], 6, 2, 'crude', { revolver: true }),
  W('handgun', '9mm Pistol',             5, '1d6 ballistic', 'x8/x12', '19, 1d6',  '9mm', 12,    ['Kickback', 'Semi-Automatic'], 4, 2, 'moderate'),
  W('handgun', '10mm Pistol',            5, '1d8 ballistic', 'x8/x14', '20, 1d8',  '10mm', 10,   ['Kickback', 'Semi-Automatic', 'Sturdy'], 6, 4, 'moderate'),
  W('handgun', '5.56mm Pistol',          4, '1d10 ballistic','x6/x14', '20, x2',   '5.56mm', 6,  ['Destructive', 'Kickback', 'Manual Reload'], 7, 5, 'good'),
  W('handgun', '12.7mm Pistol',          5, '2d6 ballistic', 'x5/x10', '20, 1d6',  '12.7mm', 7,  ['Semi-Automatic', 'Kickback'], 8, 6, 'good'),
  W('handgun', '.45 Auto Pistol',        4, '1d10 ballistic','x8/x14', '20, x2',   '.45', 7,     ['Semi-Automatic', 'Kickback', 'Quick Reload'], 6, 3, 'epic'),
  W('handgun', 'Walther PPK',            4, '1d8 ballistic', 'x10/x16','20, 2d8',  '9mm', 8,     ['Semi-Automatic', 'Kickback'], 4, 3, 'good'),
  W('handgun', 'Single Shot Savvy',      6, '2d10 ballistic','x8/x18', '20, x3',   '.44 Magnum', 1, ['Accurate', 'Destructive', 'Manual Reload', 'Kickback', 'Piercing'], 7, 4, 'good'),
  W('handgun', 'Flintlock Pistol',       6, '3d10 ballistic','x6/x14', '20, 2d10', 'Cartridge', 1, ['Debilitating', 'Piercing', 'Slow Reload', 'Kickback', 'Breakable'], 6, 5, 'good'),
  W('handgun', 'Desert Eagle',           6, '3d8 ballistic', 'x7/x16', '20, x2',   '.50', 7,     ['Destructive', 'Kickback'], 8, 6, 'epic'),
  W('handgun', '.357 Magnum Revolver',   5, '1d10 ballistic','x7/x16', '20, x3',   '.357 Magnum', 6, ['Accurate', 'Manual Reload', 'Destructive'], 6, 3, 'moderate', { revolver: true }),
  W('handgun', '.44 Magnum Revolver',    5, '2d8 ballistic', 'x6/x14', '20, x3',   '.44 Magnum', 6, ['Accurate', 'Manual Reload'], 6, 4, 'good', { revolver: true }),
  W('handgun', 'Ranger Sequoia Revolver',6, '3d10 ballistic','x6/x14', '20, x3',   ".45-70 Gov't", 5, ['Accurate', 'Destructive', 'Manual Reload'], 8, 5, 'epic', { revolver: true }),

  // ---- Submachine guns ----
  W('smg', 'H&H Tools Nail Gun', 6, '1d4 piercing',  'x3/x6',  '19, 1d4',  'Nails', 60,  ['Automatic: 2', 'Two Handed', 'Debilitating'], 8, 4, 'crude'),
  W('smg', '9mm SMG',            6, '1d4 ballistic', 'x5/x9',  '20, 1d4',  '9mm', 18,    ['Automatic: 3', 'Two Handed'], 6, 4, 'moderate'),
  W('smg', '10mm SMG',           6, '1d6 ballistic', 'x5/x10', '20, 1d6',  '10mm', 18,   ['Automatic: 3', 'Two Handed', 'Sturdy'], 8, 5, 'moderate'),
  W('smg', 'Tommy Gun',          6, '1d6 ballistic', 'x5/x9',  '20, 1d6',  '.45', 30,    ['Automatic: 4', 'Two Handed'], 12, 6, 'good'),
  W('smg', 'P90',                6, '1d12 ballistic','x5/x10', '20, 1d12', '5mm', 48,    ['Automatic: 2', 'Two Handed', 'Uses 4 rounds per attack'], 12, 5, 'epic'),

  // ---- Rifles ----
  W('rifle', 'Syringer',           5, '1d4 piercing',  'x3/x8',   '20, 1d4',  'Syringe', 1,   ['Accurate', 'Quick Reload'], 8, 2, 'moderate'),
  W('rifle', 'Junk Jet',           6, '3d6 bludgeoning or piercing', 'x4/x10', '19, 2d6', 'Any item ≤4 load', 5, ['Breakable', 'Powerful', 'Two Handed'], 18, 6, 'moderate'),
  W('rifle', 'Railway Rifle',      6, '2d10 piercing', 'x4/x8',   '19, x3',   'Railway Spike', 8, ['Debilitating', 'Destructive', 'Two Handed', 'Defensive'], 21, 6, 'good'),
  W('rifle', 'Pipe Rifle',         5, '1d8 piercing',  'x5/x7',   '20, x2',   '.308', 4,      ['Two Handed', 'Breakable', 'Quick Reload'], 12, 4, 'crude'),
  W('rifle', 'Musket',             6, '4d8 ballistic', 'x8/x20',  '20, 2d8',  'Cartridge', 1, ['Debilitating', 'Piercing', 'Two Handed', 'Breakable', 'Slow Reload'], 16, 6, 'good'),
  W('rifle', 'Bolt Action Rifle',  6, '2d10 ballistic','x10/x22', '20, x2',   '.308', 3,      ['Accurate', 'Destructive', 'Two Handed'], 14, 4, 'good'),
  W('rifle', 'Cowboy Repeater',    5, '2d6 ballistic', 'x8/x20',  '20, x2',   '.357 Magnum', 7, ['Accurate', 'Manual Reload', 'Two Handed'], 12, 4, 'moderate'),
  W('rifle', 'Lever Action Rifle', 6, '2d6 ballistic', 'x10/x22', '20, x3',   '10mm', 5,      ['Accurate', 'Manual Reload', 'Two Handed'], 13, 4, 'moderate'),
  W('rifle', 'Varmint Rifle',      6, '2d4 ballistic', 'x10/x20', '20, 2d4',  '5.56mm', 5,    ['Accurate', 'Two Handed'], 12, 3, 'crude'),
  W('rifle', 'Trail Carbine',      6, '2d8 ballistic', 'x10/x20', '20, x2',   '.44 Magnum', 6,['Accurate', 'Manual Reload', 'Two Handed'], 13, 4, 'moderate'),
  W('rifle', 'Sniper Rifle',       6, '2d12 ballistic','x12/x30', '20, x3',   '.308', 5,      ['Accurate', 'Destructive', 'Two Handed'], 16, 5, 'epic'),
  W('rifle', 'Anti-Material Rifle',6, '5d8 ballistic', 'x15/x36', '20, x3',   '.50', 3,       ['Accurate', 'Destructive', 'Two Handed'], 25, 7, 'legendary'),
  W('rifle', 'Assault Rifle',      6, '1d10 ballistic','x6/x12',  '20, 1d10', '5.56mm', 24,   ['Automatic: 3 (Switch)', 'Two Handed', 'Quick Reload', 'Single Shot: Semi-Automatic, Accurate, Range x8/x18'], 14, 5, 'good'),
  W('rifle', 'Military Carbine',   4, '2d4 ballistic', 'x8/x20',  '20, 2d4',  '10mm', 9,      ['Accurate', 'Two Handed', 'Quick Reload'], 12, 4, 'moderate'),

  // ---- Shotguns ----
  W('shotgun', 'Pipe Shotgun',            5, '3d6 ballistic', 'x3/x6', '20, 2d6',  '20 gauge', 1,  ['Powerful', 'Quick Reload', 'Spread', 'Two Handed'], 10, 3, 'crude'),
  W('shotgun', 'Lever-action Shotgun',    5, '2d8 ballistic', 'x3/x6', '20, 2d8',  '20 gauge', 4,  ['Powerful', 'Manual Reload', 'Spread', 'Two Handed'], 12, 4, 'moderate'),
  W('shotgun', 'Pump Shotgun',            5, '2d8 ballistic', 'x4/x7', '20, 1d8',  '20 gauge', 5,  ['Destructive', 'Powerful', 'Manual Reload', 'Spread', 'Two Handed'], 14, 4, 'good'),
  W('shotgun', 'Super Shorty',            4, '2d6 ballistic', 'x2/x4', '20, 3d6',  '20 gauge', 3,  ['Powerful', 'Manual Reload', 'Spread', 'Two Handed'], 8, 3, 'moderate'),
  W('shotgun', 'Revolving Shotgun Pistol',5, '2d6 ballistic', 'x3/x6', '19, 2d6',  '20 gauge', 5,  ['Kickback', 'Powerful', 'Manual Reload', 'Spread'], 6, 4, 'moderate', { revolver: true }),
  W('shotgun', 'Sawed-off Double Barrel', 4, '2d10 ballistic','x2/x4', '20, 3d10', '12 gauge', 2,  ['Destructive', 'Powerful', 'Manual Reload', 'Spread', 'Two Handed'], 10, 4, 'good'),
  W('shotgun', 'Double Barrel Shotgun',   4, '2d10 ballistic','x3/x6', '20, 2d10', '12 gauge', 2,  ['Powerful', 'Manual Reload', 'Spread', 'Two Handed'], 12, 5, 'good'),
  W('shotgun', 'Combat Shotgun',          5, '2d12 ballistic','x4/x8', '20, 2d12', '12 gauge', 8,  ['Powerful', 'Spread', 'Two Handed', 'Destructive'], 16, 5, 'epic'),
  W('shotgun', 'Riot Shotgun',            6, '3d6 ballistic', 'x3/x6', '20, 3d6',  '12 gauge', 12, ['Powerful', 'Semi-Automatic', 'Spread', 'Two Handed'], 16, 5, 'epic'),
  W('shotgun', 'Quintuple Barrel Shotgun',4, '2d10 ballistic','x2/x5', '19, 2d10', '12 gauge', 5,  ['Destructive', 'Powerful', 'Slow Reload', 'Spread', 'Two Handed'], 25, 6, 'legendary'),

  // ---- Big guns ----
  W('bigGun', 'Flamer',           6, '2d10 fire', '60×10 ft line or 20 ft cone', '20, 1d10', 'Fuel', 5, ['Area of Effect', 'Incendiary', 'Slow Reload', 'Two Handed'], 40, 8, 'epic'),
  W('bigGun', 'Missile Launcher', 6, '10d6 explosive (10/20 ft radius)', 'x20/x40', '20, 2d6', 'Missile', 1, ['Area of Effect', 'Destructive', 'Durable', 'Two Handed', 'Uses Missile Launcher table'], 36, 7, 'epic'),
  W('bigGun', 'Minigun',          6, '5d6 ballistic', 'x15/x30', '20, 2d6', '5mm', 120, ['Automatic: 2', 'Destructive', 'Durable', 'Slow Reload', 'Spread', 'Two Handed', 'Uses 10 rounds per attack'], 60, 9, 'legendary'),
  W('bigGun', 'Fat-Man',          6, '12d10 explosive (30 ft radius) + RAD level 4 in 60 ft', 'x15/x25', '20, 2d10', 'Mini Nuke', 1, ['Area of Effect', 'Destructive', 'Durable', 'Slow', 'Two Handed'], 40, 6, 'legendary'),
  W('bigGun', 'Harpoon Gun',      5, '4d10 ballistic', 'x5/x12', '20, 2d10', 'Harpoon', 1, ['Sturdy', 'Reeling', 'Two Handed'], 30, 5, 'epic'),

  // ---- Energy weapons ----
  W('energy', 'Laser Pistol',          4, '2d4 laser',       'x10/x20', '20, x2, Burning',   'Energy Cell', 16,       ['Quick Reload', 'Kickback'], 6, 1, 'moderate'),
  W('energy', 'Laser Rifle',           5, '2d6 laser',       'x12/x24', '20, x2, Burning',   'Energy Cell', 12,       ['Accurate', 'Two Handed', 'Quick Reload'], 12, 2, 'moderate'),
  W('energy', 'Laser Musket',          4, '1d10 laser',      'x12/x24', '20, x2, Burning',   'Energy Cell', 4,        ['Accurate', 'Piercing', 'Charge', 'Two Handed', 'Quick Reload'], 14, 2, 'moderate'),
  W('energy', 'Automatic Laser Rifle', 5, '1d6 laser',       'x8/x12',  '20, 1d6, Burning',  'Energy Cell', 18,       ['Automatic: 2', 'Two Handed', 'Quick Reload'], 14, 2, 'moderate'),
  W('energy', 'Tri-Beam Laser Rifle',  5, '3d8 laser',       'x4/x8',   '20, 2d8, Burning',  'Energy Cell', 6,        ['Spread', 'Powerful', 'Two Handed', 'Quick Reload'], 12, 2, 'good'),
  W('energy', 'Laser Revolver',        5, '1d10 laser',      'x5/x10',  '19, 2d10, Burning', 'Energy Cell', 6,        ['Destructive', 'Quick Reload', 'Kickback'], 6, 3, 'good', { revolver: true }),
  W('energy', 'Plasma Pistol',         5, '2d6 plasma',      'x6/x12',  '20, x3',            'Microfusion Cell', 10,  ['Destructive', 'Kickback'], 6, 2, 'good'),
  W('energy', 'Plasma Rifle',          6, '2d8 plasma',      'x8/x16',  '20, x3',            'Microfusion Cell', 8,   ['Accurate', 'Destructive', 'Two Handed'], 12, 2, 'good'),
  W('energy', 'Multiplas Rifle',       6, '3d10 plasma',     'x3/x6',   '20, 3d10',          'Microfusion Cell', 4,   ['Spread', 'Destructive', 'Two Handed', 'Powerful', 'Quick Reload'], 14, 2, 'epic'),
  W('energy', 'Pulse Pistol',          4, '2d8 electricity', 'x7/x14',  '19, 1d8, Dazed',    'Pulse Cell', 10,        ['Kickback', 'Pulse', 'Sturdy'], 6, 2, 'good'),
  W('energy', 'Pulse Rifle',           5, '2d10 electricity','x9/x18',  '19, 1d10, Dazed',   'Pulse Cell', 8,         ['Destructive', 'Accurate', 'Two Handed', 'Pulse', 'Sturdy'], 12, 4, 'good'),
  W('energy', 'Gauss Pistol',          4, '1d10 ballistic',  'x8/x16',  '19, x2',            '2mm EC', 6,             ['Charge', 'Kickback', 'Piercing', 'Destructive', 'Quick Reload'], 8, 4, 'epic'),
  W('energy', 'Gauss Rifle',           4, '1d12 ballistic',  'x10/x20', '20, x2',            '2mm EC', 4,             ['Charge', 'Piercing', 'Two Handed', 'Destructive'], 20, 5, 'epic'),
  W('energy', 'Cryolator',             5, '3d10 cryo',       '20 ft cone', '20, 1d10',       'Cryo Cell', 3,          ['Area of Effect', 'Freezing', 'Slow', 'Two Handed'], 20, 6, 'good'),
  W('energy', 'Crystalizing Cryolator',5, '2d10 cryo',       'x8/x16',  '20, x2, Slowed',    'Cryo Cell', 6,          ['Debilitating', 'Destructive', 'Two Handed'], 20, 6, 'good'),
  W('energy', 'Gamma Gun',             4, '1d12 radiation',  'x8/x12',  '20, 1d12',          'Gamma Cell', 8,         ['Kickback', 'Destructive', 'Spread', 'Radioactive'], 8, 2, 'good'),
  W('energy', 'Protectron Arm',        4, '1d8 laser',       'x8/x20',  '20, x2, Burning',   'Energy Cell', 16,       ['Two Handed'], 8, 2, 'crude'),
  W('energy', 'Solar Scorcher',        3, '1d6 fire',        'x5/x10',  '20, 1d4, Burning',  'Sunlight', null,        ['Powerful', 'Fires so long as it is in sunlight'], 3, 1, 'moderate'),
  W('energy', 'Torcher',               6, '2d4 fire',        'x3/x6',   '20, 1d4, Burning',  'Fuel', 9,               ['Automatic: 2', 'Incendiary', 'Spread', 'Two Handed'], 20, 5, 'moderate'),
  W('energy', 'Gatling Laser',         6, '2d10 laser',      'x20/x30', '20, 1d10, Burning', 'Fusion Core', 100,      ['Automatic: 4', 'Destructive', 'Two Handed', 'Slow Reload'], 40, 6, 'legendary'),

  // ---- Bladed ----
  M('bladed', 'Butcher Knife',       4, '1d8 slashing',              '20, 2d8', ['Debilitating', 'Weighted'], 3, 4, 'moderate'),
  M('bladed', 'Combat Knife',        3, '2d4 piercing or slashing',  '20, x3',  ['Precise', 'Stealthy', 'Thrown: x3/x6'], 2, 3, 'good'),
  M('bladed', 'Knife',               3, '1d6 piercing or slashing',  '20, x3',  ['Stealthy', 'Thrown: x3/x6'], 2, 1, 'moderate'),
  M('bladed', 'Shiv',                3, '1d4 piercing',              '20, x4',  ['Fragile', 'Stealthy'], 1, 1, 'crude'),
  M('bladed', 'Switchblade',         3, '1d6 piercing or slashing',  '20, x3',  ['Breakable', 'Weighted', 'Stealthy'], 1, 1, 'moderate'),
  M('bladed', 'Meat Hook',           5, '2d8 slashing',              '20, x3',  ['Breakable', 'Clasp'], 6, 4, 'moderate'),
  M('bladed', 'Fire Axe',            6, '2d10 slashing',             '20, x3',  ['Two Handed', 'Weighted', 'Sturdy'], 10, 6, 'good'),
  M('bladed', 'Hatchet',             4, '2d6 slashing',              '20, x3',  ['Thrown: x4/x8'], 4, 4, 'good'),
  M('bladed', 'Machete',             4, '2d4 slashing',              '20, x3',  ['Precise', 'Sturdy'], 3, 3, 'moderate'),
  M('bladed', 'Sickle',              4, '1d8 slashing',              '19, x2',  ['Defensive', 'Debilitating', 'Precise'], 3, 2, 'moderate'),
  M('bladed', 'Spear',               4, '1d10 piercing',             '20, x2',  ['Reach', 'Thrown: x6/x10'], 8, 2, 'moderate'),
  M('bladed', 'Sharpened Pole',      5, '1d8 piercing',              '20, x3',  ['Fragile', 'Reach', 'Thrown: x6/x10'], 7, 3, 'crude'),
  M('bladed', 'Sword',               4, '2d6 slashing',              '20, x2',  ['Defensive'], 4, 3, 'good'),
  M('bladed', 'Guitar Sword',        5, '1d8 slashing',              '20, x2',  ['Defensive', 'First six decay levels deal 1 damage to you'], 6, 5, 'crude'),
  M('bladed', 'Assaultron Blade',    5, '2d10 slashing or piercing', '20, x3',  ['Defensive', 'Precise', 'Sturdy'], 6, 5, 'epic'),
  M('bladed', 'Ski Sword',           4, '2d4 slashing',              '20, x3',  ['Defensive', 'Sturdy', 'If you have two, you can ski'], 4, 5, 'moderate'),
  M('bladed', 'Plastic Bumper Sword',6, '3d6 slashing',              '20, x3',  ['Two Handed', 'Cleave', 'Reach'], 10, 7, 'good'),
  M('bladed', 'Steel Bumper Sword',  6, '8d6 slashing',              '20, x3',  ['Two Handed', 'Slow', 'Always Cleaves', 'Weighted', 'Reach'], 30, 9, 'epic'),
  M('bladed', 'Pickaxe',             6, '3d6 piercing',              '20, x3',  ['Two Handed', 'Weighted', 'Sturdy'], 9, 6, 'good'),
  M('bladed', 'Pitchfork',           5, '2d6 piercing',              '20, x3',  ['Reach', 'Debilitating', 'Two Handed'], 8, 3, 'moderate'),

  // ---- Blunt ----
  M('blunt', 'Aluminium Bat',   5, '2d6 bludgeoning',  '20, 2d6, Shoves 5 ft', ['Weighted', 'Defensive', 'Two Handed', 'Sturdy'], 10, 5, 'good'),
  M('blunt', 'Baseball Bat',    5, '1d12 bludgeoning', '20, 1d12, Shoves 5 ft',['Weighted', 'Defensive', 'Two Handed'], 8, 4, 'moderate'),
  M('blunt', 'Board',           5, '1d8 bludgeoning',  '20, 1d8',  ['Weighted', 'Breakable', 'Two Handed'], 8, 5, 'crude'),
  M('blunt', 'Board with Nail', 5, '1d10 bludgeoning', '20, 1d10', ['Weighted', 'Breakable', 'Two Handed'], 8, 5, 'moderate'),
  M('blunt', 'Bone Club',       4, '1d8 bludgeoning',  '20, 1d8',  ['Debilitating'], 5, 4, 'crude'),
  M('blunt', 'Crowbar',         6, '2d10 bludgeoning', '20, 3d10', ['Weighted', 'Durable', 'Defensive', 'Two Handed'], 18, 6, 'good'),
  M('blunt', 'Dress Cane',      4, '1d4 bludgeoning',  '19, 2d4, Prone', ['Defensive'], 3, 2, 'crude'),
  M('blunt', 'Lead Pipe',       5, '1d8 bludgeoning',  '20, 1d8',  ['Weighted', 'Two Handed', 'Sturdy'], 6, 3, 'moderate'),
  M('blunt', 'Nine Iron',       5, '1d8 bludgeoning',  '20, 1d8, Prone', ['Weighted', 'Two Handed', 'Defensive'], 5, 3, 'moderate'),
  M('blunt', 'Police Baton',    4, '1d6 bludgeoning',  '19, 1d6, Dazed', ['Sturdy', 'Defensive'], 3, 2, 'crude'),
  M('blunt', 'Pool Cue',        5, '1d6 bludgeoning',  '20, 2d6, Shoves 5 ft', ['Weighted', 'Breakable', 'Two Handed', 'Reach'], 5, 3, 'crude'),
  M('blunt', 'Protest Sign',    4, '1d6 bludgeoning',  '20, 1d6, Shoves 5 ft', ['Two Handed', 'Breakable'], 8, 3, 'crude'),
  M('blunt', 'Wooden Sword',    5, '1d8 bludgeoning',  '20, 1d8',  ['Breakable', 'Cleave'], 8, 3, 'moderate'),
  M('blunt', 'Stop Sign',       6, '3d8 bludgeoning or slashing', '20, x2', ['Weighted', 'Two Handed', 'Reach'], 40, 9, 'good'),
  M('blunt', 'Shovel',          5, '2d6 bludgeoning or slashing', '20, x3', ['Weighted', 'Two Handed', 'Defensive'], 10, 4, 'moderate'),
  M('blunt', 'Sledgehammer',    6, '2d8 bludgeoning',  '20, 3d8, Dazed', ['Sturdy', 'Weighted', 'Two Handed'], 26, 7, 'good'),
  M('blunt', 'Super Sledge',    6, '3d8 bludgeoning',  '20, 3d8, Dazed', ['Sturdy', 'Weighted', 'Debilitating', 'Two Handed', 'Ammo: Fuel, 10 rounds', 'Depleted: 2d8 bludgeoning'], 30, 8, 'epic', { ammo: 'Fuel', rounds: 10 }),
  M('blunt', 'Tire Iron',       4, '1d6 bludgeoning',  '20, 1d6, Prone', ['Weighted'], 4, 2, 'crude'),
  M('blunt', 'Wrench',          4, '2d4 bludgeoning',  '20, 4d4',  ['Sturdy'], 5, 2, 'moderate'),

  // ---- Mechanical ----
  M('mechanical', 'Taser Staff',      4, '1d4 bludgeoning + 2d6 electricity', '19, Dazed', ['Two Handed', 'Reach', 'Ammo: Energy Cell, 10 rounds', 'Depleted: 1d4 bludgeoning'], 5, 3, 'good', { ammo: 'Energy Cell', rounds: 10 }),
  M('mechanical', 'Ripper',           3, '3d6 slashing',   '20, 2d6', ['Debilitating', 'Mangle', 'Ammo: Energy Cell, 12 rounds', 'Depleted: 1d4 slashing'], 5, 5, 'epic', { ammo: 'Energy Cell', rounds: 12 }),
  M('mechanical', 'Handy Buzz Blade', 5, '2d8 slashing',   '20, x3',  ['Two Handed', 'Weighted', 'Mangle', 'Ammo: Energy Cell, 10 rounds', 'Depleted: 1d6 slashing'], 10, 5, 'good', { ammo: 'Energy Cell', rounds: 10 }),
  M('mechanical', 'Chainsaw',         6, '5d8 slashing',   '20, 5d8', ['Debilitating', 'Two Handed', 'Mangle', 'Ammo: Energy Cell, 5 rounds', 'Depleted: 1d8 bludgeoning'], 20, 8, 'epic', { ammo: 'Energy Cell', rounds: 5 }),
  M('mechanical', 'Drill',            5, '1d12 slashing',  '19, x2',  ['Debilitating', 'Mangle', 'Precise', 'Ammo: Energy Cell, 20 rounds', 'Depleted: 1d4 piercing'], 8, 5, 'moderate', { ammo: 'Energy Cell', rounds: 20 }),
  M('mechanical', 'Plasma Cutter',    5, '4d8 plasma',     '20, 2d8', ['Debilitating', 'Dismember', 'Ammo: Microfusion Cell, 5 rounds', 'Depleted: 1d6 bludgeoning'], 12, 5, 'legendary', { ammo: 'Microfusion Cell', rounds: 5 }),
  M('mechanical', 'Shishkebab',       4, '2d6 slashing + 1d12 fire', '20, x2, Burning', ['Defensive', 'Ammo: Fuel, 8 rounds', 'Depleted: 2d6 slashing'], 16, 5, 'epic', { ammo: 'Fuel', rounds: 8 }),

  // ---- Unarmed ----
  M('unarmed', 'Brass Knuckle',      4, '1d8 bludgeoning', '19, 2d8', ['Sturdy'], 2, 5, 'moderate'),
  M('unarmed', 'Spiked Knuckle',     4, '1d8 piercing',    '19, x2',  ['Precise'], 2, 4, 'moderate'),
  M('unarmed', 'Boxing Tape',        3, '1d4 bludgeoning', '19, x2',  ['Weighted'], 1, 1, 'crude'),
  M('unarmed', 'Boxing Gloves',      4, '1d4 bludgeoning', '20, 1d4, Dazed', ['Defensive', 'Sturdy'], 6, 3, 'crude'),
  M('unarmed', 'Bear Skull Arm',     6, '3d6 piercing or slashing', '20, x2', ['Debilitating', 'Defensive'], 16, 5, 'good'),
  M('unarmed', 'Deathclaw Gauntlet', 6, '3d12 slashing',   '20, 1d12', ['Debilitating', 'Mangle', 'Defensive'], 15, 5, 'legendary'),
  M('unarmed', 'Hunting Trap Fist',  5, '4d4 piercing',    '20, x2',  ['Clasp', 'Debilitating', 'Defensive', 'Mangle'], 20, 8, 'epic'),
  M('unarmed', 'Bear Trap Fist',     6, '3d12 piercing',   '20, x2',  ['Clasp', 'Debilitating', 'Defensive', 'Mangle'], 40, 10, 'legendary'),
  M('unarmed', 'Power Fist',         5, '4d6 bludgeoning', '20, 2d6, Prone and Shoves 15 ft', ['Debilitating', 'Weighted', 'Ammo: Energy Cell, 12 rounds', 'Depleted: 1d6 bludgeoning'], 12, 6, 'epic', { ammo: 'Energy Cell', rounds: 12 }),
];

export const WEAPON_BY_ID = Object.fromEntries(WEAPONS.map(w => [w.id, w]));

// Unarmed strike (no weapon): 3 AP (or two strikes for 5 AP), 1d4 + STR or AGI bludgeoning, crit 20 (x2 total damage).
export const UNARMED_STRIKE = { id: 'unarmed_strike', name: 'Unarmed Strike', group: 'unarmed', ap: 3, damage: '1d4 bludgeoning', crit: '20, x2', props: ['Two strikes for 5 AP', 'Natural 1 deals 1d4 damage to you'], load: 0, str: 0, range: '5 ft' };

// ---- Ranged weapon modifications (Changes doc). 6 mod slots per ranged weapon. ----
export const RANGED_MODS = [
  { id: 'bayonet',          name: 'Bayonet',              slots: 1, costPct: 20,  text: 'Attach a knife or combat knife; attack with it without switching weapons. Any Two Handed ranged weapon.' },
  { id: 'boosted_capacitor',name: 'Boosted Capacitor',    slots: 3, costPct: 50,  text: 'Spend 2 rounds instead of 1 to raise the damage die rank by 1 and add +1 damage (d12: +1 per die). Energy weapons using energy, microfusion, cryo or pulse cells.' },
  { id: 'double_action',    name: 'Double Action',        slots: 2, costPct: 75,  text: 'Attacks cost 1 less AP (minimum 1). Any revolver.', effects: [{ type: 'weaponAp', value: -1 }] },
  { id: 'ergonomic_grip',   name: 'Ergonomic Grip',       slots: 2, costPct: 60,  text: 'Critical hit multiplier or damage dice +1. Any ranged weapon.' },
  { id: 'hardened_receiver',name: 'Hardened Receiver',    slots: 3, costPct: 120, text: 'Gains Destructive (or damage die rank +1 to a max of d12 if already Destructive). Handguns, SMGs, shotguns, rifles.' },
  { id: 'high_capacity_mag',name: 'High Capacity Magazine', slots: 1, costPct: 20, text: 'Rounds increased by half (rounded up). Ballistic weapons without Manual Reload or Quick Eject Mag.', effects: [{ type: 'roundsMultiplier', value: 1.5 }] },
  { id: 'holographic_sight',name: 'Holographic Sight',    slots: 2, costPct: 60,  text: 'Attack rolls +1. Load +1. Not with Scope or Infrared Scope.', effects: [{ type: 'weaponAttack', value: 1 }, { type: 'weaponLoad', value: 1 }] },
  { id: 'improved_rifling', name: 'Improved Rifling',     slots: 2, costPct: 45,  text: 'Range modifiers increased by a third (rounded up). Ballistic handguns, rifles, SMGs.', effects: [{ type: 'rangeMultiplier', value: 4 / 3 }] },
  { id: 'infrared_scope',   name: 'Infrared Scope',       slots: 2, costPct: 90,  text: 'Short range ×1.5, long range ×2; disadvantage within 30 ft. Target hidden/invisible non-robots. Attack rolls +2. Load +2. Revolvers, rifles, laser/plasma/gauss/pulse rifles, laser revolver.', effects: [{ type: 'weaponAttack', value: 2 }, { type: 'weaponLoad', value: 2 }, { type: 'rangeShortMultiplier', value: 1.5 }, { type: 'rangeLongMultiplier', value: 2 }] },
  { id: 'laser_sight',      name: 'Laser Sight',          slots: 2, costPct: 35,  text: 'Short range modifier +2. Gains Accurate (or crit multiplier/dice +1 if already Accurate). Load +1. Handguns, rifles, most energy weapons.', effects: [{ type: 'weaponLoad', value: 1 }, { type: 'rangeShortAdd', value: 2 }] },
  { id: 'light_build',      name: 'Light Build',          slots: 2, costPct: 25,  text: 'Load halved, Strength requirement −1, gains Breakable. Not with Strengthen.', effects: [{ type: 'weaponLoadMultiplier', value: 0.5 }, { type: 'weaponStr', value: -1 }] },
  { id: 'longer_barrel',    name: 'Longer Barrel',        slots: 2, costPct: 35,  text: 'Long range modifier +8; disadvantage within 20 ft. Handguns, rifles, energy weapons.', effects: [{ type: 'rangeLongAdd', value: 8 }] },
  { id: 'lucky_charm',      name: 'Lucky Charm',          slots: 1, cost: 50,     text: 'Crit chance −1. Only one charm per character. Any ranged weapon.', effects: [{ type: 'weaponCrit', value: -1 }] },
  { id: 'muzzle_brake',     name: 'Muzzle Brake',         slots: 2, costPct: 55,  text: 'Attack rolls +1, Strength requirement −1, load +2. Ballistic handguns, rifles, SMGs, shotguns without Silencer.', effects: [{ type: 'weaponAttack', value: 1 }, { type: 'weaponStr', value: -1 }, { type: 'weaponLoad', value: 2 }] },
  { id: 'target_tracking',  name: 'On-Board Target Tracking', slots: 2, costPct: 120, text: 'Spend 6 AP to mark a target in short range: attacks against it have advantage. Energy weapons except Gauss and Gatling.' },
  { id: 'overclocked_capacitor', name: 'Overclocked Capacitor', slots: 3, costPct: 110, text: 'Spend 3 rounds instead of 1 to raise the damage die rank by 2 and add +1 damage. Not with Boosted Capacitor.' },
  { id: 'quick_eject_mag',  name: 'Quick Eject Magazine', slots: 1, costPct: 20,  text: 'Gains Quick Reload. Ballistic weapons without Manual Reload or High Capacity Mag.' },
  { id: 'scope',            name: 'Scope',                slots: 2, costPct: 30,  text: 'Short range ×2, long range ×3, attack rolls +1; disadvantage within 40 ft. Load +2. Revolvers, rifles, listed energy weapons, archery weapons.', effects: [{ type: 'weaponAttack', value: 1 }, { type: 'weaponLoad', value: 2 }, { type: 'rangeShortMultiplier', value: 2 }, { type: 'rangeLongMultiplier', value: 3 }] },
  { id: 'semi_automatic',   name: 'Semi Automatic',       slots: 3, costPct: 85,  text: 'Gains Semi-Automatic. Ballistic handguns, shotguns, rifles without Manual Reload.' },
  { id: 'silencer',         name: 'Silencer',             slots: 2, costPct: 65,  text: 'Attacks while hidden do not reveal you. Load +2, damage die rank −1 (minimum d4). Ballistic handguns, rifles, SMGs.', effects: [{ type: 'weaponLoad', value: 2 }] },
  { id: 'stock',            name: 'Stock',                slots: 2, costPct: 45,  text: 'Attack rolls +1, load +4. SMGs, rifles, shotguns, energy weapons, revolvers.', effects: [{ type: 'weaponAttack', value: 1 }, { type: 'weaponLoad', value: 4 }] },
  { id: 'strengthen',       name: 'Strengthen',           slots: 3, costPct: 30,  text: 'Gains Sturdy and Defensive. Load +2. Not with Light Build.', effects: [{ type: 'weaponLoad', value: 2 }, { type: 'ignoreDecay', value: 2 }] },
];

// ---- Melee weapon modifications (Changes doc). One mod per melee weapon. ----
export const MELEE_MODS = [
  { id: 'm_strengthen',  name: 'Strengthen',  costPct: 55, text: 'Gains Durable. Permanent.' },
  { id: 'm_heavy',       name: 'Heavy',       costPct: 30, text: 'AP +1, load +50%, Strength requirement +1. Gains Weighted (or +1 damage if already Weighted). Crit multiplier or damage dice +1. Permanent.', effects: [{ type: 'weaponAp', value: 1 }, { type: 'weaponLoadMultiplier', value: 1.5 }, { type: 'weaponStr', value: 1 }] },
  { id: 'm_upgraded',    name: 'Upgraded',    costPct: 75, text: 'Damage dice showing 1 or 2 add +2 damage. Permanent.' },
  { id: 'm_light_build', name: 'Light Build', costPct: 25, text: 'AP −1 (minimum 3), load halved, Strength requirement −1. Gains Breakable. Permanent.', effects: [{ type: 'weaponAp', value: -1 }, { type: 'weaponLoadMultiplier', value: 0.5 }, { type: 'weaponStr', value: -1 }] },
  { id: 'm_sharpened',   name: 'Sharpened, Serrated or Barbed', costPct: 25, text: 'Gains Mangle.' },
  { id: 'm_ergonomic',   name: 'Ergonomic',   costPct: 50, text: 'Crit chance −1.', effects: [{ type: 'weaponCrit', value: -1 }] },
  { id: 'm_wrist_sheath',name: 'Wrist Sheath', costPct: 20, text: 'Knives only. Draw for 1 less AP (minimum 2), stow for 1 AP.' },
];

export const MOD_BY_ID = Object.fromEntries([...RANGED_MODS, ...MELEE_MODS].map(m => [m.id, m]));

export const RANGED_PROPERTIES = {
  'Accurate': 'Targeted attacks: roll 2d4 and choose the result.',
  'Arc': 'Damage leaps to each creature within 15 feet of the previous target, as long as there is a new target.',
  'Area of Effect': 'Automatically hits everything in the area regardless of AC; still roll a d20 for decay/crit. No ability modifier to damage.',
  'Automatic': 'Make the listed number of extra attacks for no extra AP against targets within 10 feet of the previous one (no ability modifier on extras). Half decay from natural 1s.',
  'Automatic (Switch)': 'Spend 3 AP to switch between single shot and automatic fire modes.',
  'Breakable': 'Gains a level of decay on an attack roll of 3 or lower.',
  'Charge': 'Spend 3 extra AP for +1 damage die, or 6 for +2. Charged attacks add your modifier twice.',
  'Corrosive': 'HP damage decays the target\'s armor a level (natural armor: AC and DT −1, max 3).',
  'Debilitating': 'Targeted attacks that damage HP roll two conditions (three with Accurate, choose two).',
  'Defensive': 'When blocking, your AC increases by an additional 2.',
  'Destructive': 'Damage dice showing 1 count as 2.',
  'Durable': 'Does not decay on a natural 1.',
  'Drawstring': 'No reload; must be held in two hands. Charging increases both ranges by half per charge.',
  'Flimsy': 'Gains an extra level of decay when decaying from a natural 1.',
  'Freezing': 'HP damage applies Slowed until the end of their next turn.',
  'Incendiary': 'HP damage applies Burning. Misses may ignite flammables.',
  'Kickback': 'Held in one hand, both ranges are halved.',
  'Manual Reload': 'Load 1 round per AP spent, minimum 3 AP.',
  'Overheating': 'Each attack adds 1d6 heat; attacking at 10+ heat decays the weapon.',
  'Piercing': 'Also attack every creature in the line behind your target (separate rolls, damage halved per extra target).',
  'Powerful': 'Hits within 5 feet deal crit damage; an actual crit adds the crit dice twice or +1 multiplier.',
  'Pulse': 'May knock out targets reduced to 0 HP. Targets gain +2 DT unless robotic/power armored, in which case −2 DT.',
  'Quick Reload': 'Reloading costs 4 AP.',
  'Radioactive': 'HP damage inflicts 2d4 RADs.',
  'Reeling': 'HP damage pulls the target 15 feet towards you.',
  'Semi-Automatic': 'Attack twice in a row with this weapon to gain a free third attack.',
  'Slow': 'Hits at the start of your next turn.',
  'Slow Reload': 'Reloading costs 10 AP (5 with a helper).',
  'Spread': 'In the second range increment, also target everything within 5 feet of the target (half damage to all in that increment).',
  'Sturdy': 'Ignores the negative effects of the first 2 levels of decay.',
  'Two Handed': 'One-handed attacks cost 2 more AP or have disadvantage and knock you prone. STR 3+ over requirement waives this.',
};

export const MELEE_PROPERTIES = {
  'Ammo': 'Requires ammunition for full damage; 6 AP to reload. Depleted damage otherwise.',
  'Breakable': 'Gains a level of decay on an attack roll of 3 or lower.',
  'Clasp': 'HP damage grapples the target (escape checks at disadvantage).',
  'Cleave': 'Spend 3 extra AP to also attack two adjacent areas.',
  'Always Cleaves': 'Cleaves without the extra AP.',
  'Debilitating': 'Targeted attacks that damage HP roll two conditions.',
  'Defensive': 'When blocking, your AC increases by an additional 2.',
  'Dismember': 'Arm/leg targeted attacks cost 1 less AP. Crits may inflict a severe limb condition of your choice. Sever on kill.',
  'Durable': 'Does not decay when thrown or on a natural 1.',
  'Fragile': 'Breaks when it gains a level of decay.',
  'Mangle': 'HP damage applies a level of bleeding (short circuit for machines).',
  'Precise': 'Crits that damage HP apply two levels of bleeding.',
  'Reach': 'Range increased by 5 feet.',
  'Revitalizing': 'Spend 6 AP on a dying creature to give them 1 HP.',
  'Slow': 'Hits at the start of your next turn.',
  'Stealthy': 'Sneak attacks roll an additional damage die.',
  'Sturdy': 'No decay when thrown; ignores the first 2 levels of decay.',
  'Thrown': 'Throw Strength × listed multipliers in feet.',
  'Two Handed': 'One-handed attacks cost 2 more AP or have disadvantage. STR 3+ over requirement waives this.',
  'Weighted': 'Damage dice showing 1 count as 2.',
  'Weak': 'No ability modifier added to damage.',
};
