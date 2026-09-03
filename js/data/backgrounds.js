// Backgrounds (Fallout TTRPG 2.1, pg. 13-18). Each grants +2 to its three skills and an optional background trait.

export const BACKGROUNDS = [
  { id: 'custom',      name: 'Custom Background', skills: null, trait: null, text: 'Choose any three skills for +2. Take any background\'s starting equipment or 850 caps.' },
  { id: 'cultist',     name: 'Cultist',      skills: ['Melee Weapons', 'Speech', 'Sneak'],          trait: 'the_sight_beyond',    text: 'In service to zealous followers, wandering the wastes awaiting signs from the great beyond.' },
  { id: 'doctor',      name: 'Doctor',       skills: ['Breach', 'Medicine', 'Science'],             trait: 'do_no_harm',          text: 'A steady hand, calm under pressure, searching for others to help — or the caps they provide.' },
  { id: 'drifter',     name: 'Drifter',      skills: ['Breach', 'Sneak', 'Unarmed'],                trait: 'street_rat',          text: 'Treated like dirt, city to city, shelter to shelter. Things are going to change now.' },
  { id: 'entertainer', name: 'Entertainer',  skills: ['Barter', 'Speech', 'Intimidation'],          trait: 'a_moment_of_respite', text: 'Talented since young, marvelling wastelanders with your ability to perform.' },
  { id: 'farmer',      name: 'Farmer',       skills: ['Crafting', 'Intimidation', 'Survival'],      trait: 'hardened_by_the_earth', text: 'Working the land for the most valuable resource in the wasteland: food.' },
  { id: 'guard',       name: 'Guard',        skills: ['Guns', 'Speech', 'Melee Weapons'],           trait: 'vigilant_watch',      text: 'Trained to keep those who were paying you safe.' },
  { id: 'hermit',      name: 'Hermit',       skills: ['Explosives', 'Medicine', 'Survival'],        trait: 'recluse',             text: 'Lived far from civilization, keeping the only one who matters alive: you.' },
  { id: 'journalist',  name: 'Journalist',   skills: ['Breach', 'Speech', 'Sneak'],                 trait: 'persistent',          text: 'The truth is important in the wasteland, even if you have to break a few laws.' },
  { id: 'laborer',     name: 'Laborer',      skills: ['Crafting', 'Speech', 'Melee Weapons'],       trait: 'long_days_long_nights', text: 'Long days, good pay. Honest work, now wandering in search of better fortune.' },
  { id: 'mechanic',    name: 'Mechanic',     skills: ['Crafting', 'Guns', 'Science'],               trait: 'proper_maintenance',  text: 'One of the few strands holding a broken world together.' },
  { id: 'mercenary',   name: 'Mercenary',    skills: ['Guns', 'Melee Weapons', 'Survival'],         trait: 'sweeten_the_deal',    text: 'A reliable protector. Many have tried to cheat you; few live to tell the tale.' },
  { id: 'pastor',      name: 'Pastor',       skills: ['Barter', 'Intimidation', 'Speech'],          trait: 'embolden',            text: 'Bringing hope and sanctity to many who were lost in the darkness.' },
  { id: 'pilgrim',     name: 'Pilgrim',      skills: ['Energy Weapons', 'Sneak', 'Survival'],       trait: 'long_roads',          text: 'A long journey across the wasteland to find a new home.' },
  { id: 'pitfighter',  name: 'Pit Fighter',  skills: ['Barter', 'Melee Weapons', 'Unarmed'],        trait: 'endure_the_battle',   text: 'It takes a lot to get back up and keep going, but it\'s all you\'ve known.' },
  { id: 'scientist',   name: 'Scientist',    skills: ['Energy Weapons', 'Breach', 'Science'],       trait: 'field_research',      text: 'Scouring old world books and crafting theories. Time for field research!' },
  { id: 'scribe',      name: 'Scribe',       skills: ['Crafting', 'Energy Weapons', 'Medicine'],    trait: 'wasteland_knowledge', text: 'Countless hours organizing a trove of information to share with the world.' },
  { id: 'soldier',     name: 'Soldier',      skills: ['Explosives', 'Guns', 'Medicine'],            trait: 'efficient_combatant', text: 'Obeyed orders to the end. Your term is up.' },
  { id: 'trader',      name: 'Trader',       skills: ['Barter', 'Speech', 'Intimidation'],          trait: 'bargaining_chip',     text: 'A gatherer of valuables; what matters most is your reputation and your caps.' },
  { id: 'vaultdweller',name: 'Vault Dweller',skills: ['Medicine', 'Speech', 'Science'],             trait: 'talented',            text: 'Only ever known the cold steel walls of a vault. The world was never what you thought.' },
  { id: 'wastelander', name: 'Wastelander',  skills: ['Guns', 'Survival', 'Unarmed'],               trait: 'adventurers_instinct', text: 'All you\'ve ever needed was what\'s on your back.' },
];

export const BACKGROUND_BY_ID = Object.fromEntries(BACKGROUNDS.map(b => [b.id, b]));

/** Starting equipment packs (organic = Human/Ghoul/Super Mutant, machine = Gen-2 Synth/Robot). Item names match the compendium where possible. */
export const STARTING_KITS = {
  cultist: {
    organic: [['Cloth Armor', 1], ['Knife', 1], ['Bolt-action Pipe Pistol', 1], ['9mm', 15], ['Bag, Backpack', 1], ['Chain', 1], ['Cram', 3], ['RadAway (Diluted)', 1], ['Rad-X', 1], ['Healing Powder', 1], ['Dirty Water', 3], ['Purified Water', 1]],
    machine: [['Leather Armor', 1], ['Knife', 1], ['Bolt-action Pipe Pistol', 1], ['9mm', 15], ['Bag, Backpack', 1], ['Chain', 1], ['Stimpak (Diluted)', 1], ['RobCo Quick Fix-it 1.0', 1], ['Overclock Hardware', 1], ['Cache Clearer', 1]],
  },
  doctor: {
    organic: [['Cloth Armor', 1], ['Knife', 1], ['Syringer', 1], ['Stimpak Loader', 2], ['Lock Joint', 1], ['Bag, Backpack', 1], ['First Aid Kit', 1], ['Stimpak (Diluted)', 2], ['RadAway (Diluted)', 1], ['Rad-X', 1], ['Healing Powder', 1], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Noodle Cup', 1], ['InstaMash', 1], ['Purified Water', 2]],
    machine: [['Cloth Armor', 1], ['Knife', 1], ['Syringer', 1], ['Stimpak Loader', 2], ['Lock Joint', 1], ['Bag, Backpack', 1], ['First Aid Kit', 1], ['RobCo Quick Fix-it 1.0', 2], ['RobCo Quick Fix-it 2.0', 2], ['RadAway (Diluted)', 1], ['Rad-X', 1], ['Healing Powder', 2]],
  },
  drifter: {
    organic: [['Cloth Armor', 1], ['Shiv', 1], ['Pipe Pistol', 1], ['9mm', 15], ['Bag, Backpack', 1], ['Canned Dog Food', 5], ['Iguana on a Stick', 1], ['Healing Powder', 2], ['Dirty Water', 4], ['Purified Water', 2], ['Lockpicks', 1], ['Tent (one person)', 1], ['Sleeping Bag', 1], ['Whiskey', 1], ['Fixer', 1], ['Jet', 2], ['Cigarette', 3], ['Psycho', 1], ['Coffee', 1]],
    machine: [['Cloth Armor', 1], ['Shiv', 1], ['Pipe Pistol', 1], ['9mm', 15], ['Bag, Backpack', 1], ['Lockpicks', 1], ['RobCo Quick Fix-it 1.0', 2], ['Overclock Hardware', 2], ['Cache Clearer', 2], ['Military Auto-Tank AI Upload', 1], ['Flashlight', 1], ['Energy Cell', 1], ['¡La Fantoma!', 1]],
  },
  entertainer: {
    organic: [['Cloth Armor', 1], ['Switchblade', 1], ['10mm Pistol', 1], ['10mm', 10], ['Bag, Backpack', 1], ['Dynamite', 2], ['Flare', 3], ['Salisbury Steak', 3], ['Desert Salad', 1], ['Nuka-Cola', 1], ['Dirty Wastelander', 1], ['Healing Powder', 1], ['Stimpak', 1], ['Purified Water', 2]],
    machine: [['Cloth Armor', 1], ['Switchblade', 1], ['10mm Pistol', 1], ['10mm', 20], ['Bag, Backpack', 1], ['Dynamite', 2], ['Flare', 3], ['RobCo Quick Fix-it 2.0', 2]],
  },
  farmer: {
    organic: [['Cloth Armor', 1], ['Pitchfork', 1], ['Single Shotgun', 1], ['12 gauge', 8], ['Bag, Backpack', 1], ['Healing Powder', 1], ['Potato', 5], ['Tato', 5], ['Mutfruit', 5], ['Purified Water', 4]],
    machine: [['Cloth Armor', 1], ['Pitchfork', 1], ['Sickle', 1], ['Single Shotgun', 1], ['12 gauge', 8], ['Bag, Backpack', 1], ['RobCo Quick Fix-it 1.0', 1], ['Potato', 2], ['Tato', 2], ['Mutfruit', 1]],
  },
  guard: {
    organic: [['Metal Armor', 1], ['Police Baton', 1], ['9mm Pistol', 1], ['9mm', 20], ['9mm Rubber', 10], ['Bag, Backpack', 1], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Binoculars', 1], ['Stimpak (Diluted)', 1], ['Purified Water', 3], ["Pork n' Beans", 2], ['Coffee', 1], ['Donut', 2]],
    machine: [['Metal Armor', 1], ['Police Baton', 1], ['9mm Pistol', 1], ['9mm', 35], ['9mm Rubber', 20], ['Bag, Backpack', 1], ['Binoculars', 1], ['RobCo Quick Fix-it 1.0', 2], ['Milsurp Review', 1], ['Cache Clearer', 1]],
  },
  hermit: {
    organic: [['Multilayered Armor', 1], ['Sharpened Pole', 1], ['Dynamite', 2], ['Bag, Backpack', 1], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Bear Trap', 1], ['Mutt Chops', 1], ['Gecko Steak', 1], ['RadAway (Diluted)', 1], ['Healing Powder', 3], ['First Aid Kit', 1], ['Purified Water', 1], ['Dirty Water', 2]],
    machine: [['Multilayered Armor', 1], ['Sharpened Pole', 1], ['Dynamite', 3], ['Bag, Backpack', 1], ['Bear Trap', 1], ['RobCo Quick Fix-it 2.0', 2]],
  },
  journalist: {
    organic: [['Cloth Armor', 1], ['Switchblade', 1], ['9mm Pistol', 1], ['9mm', 13], ['Bag, Backpack', 1], ['Flashlight', 1], ['Energy Cell', 1], ['Bandolier', 1], ['Lockpicks', 1], ['Cram', 3], ['RadAway (Diluted)', 1], ['Rad-X', 1], ['Stimpak (Diluted)', 1], ['Purified Water', 3]],
    machine: [['Cloth Armor', 1], ['Switchblade', 1], ['9mm Pistol', 1], ['9mm', 26], ['Bag, Backpack', 1], ['Flashlight', 1], ['Energy Cell', 1], ['Bandolier', 1], ['Lockpicks', 1], ['RobCo Quick Fix-it 1.0', 1], ['Coolant Rerouter', 1]],
  },
  laborer: {
    organic: [['Cloth Armor', 1], ['Crowbar', 1], ['Pipe Pistol', 1], ['9mm', 10], ['Bag, Backpack', 1], ['Canteen', 1], ['Rope', 1], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Potato Crisps', 1], ['InstaMash', 2], ['Radstag Stew', 1], ['Purified Water', 2], ['Healing Powder', 2]],
    machine: [['Cloth Armor', 1], ['Crowbar', 1], ['Pipe Pistol', 1], ['9mm', 10], ['Bag, Backpack', 1], ['Rope', 1], ['Flashlight', 1], ['Energy Cell', 1], ['RobCo Quick Fix-it 2.0', 1]],
  },
  mechanic: {
    organic: [['Cloth Armor', 1], ['Wrench', 1], ['Pipe Revolver', 1], ['.44 Magnum', 10], ['Bag, Backpack', 1], ['Bandolier', 1], ['Canteen', 1], ['Rope', 1], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Cram', 3], ['Purified Water', 3], ['Weapon Repair Kit', 1]],
    machine: [['Cloth Armor', 1], ['Wrench', 1], ['Pipe Revolver', 1], ['.44 Magnum', 15], ['Bag, Backpack', 1], ['Bandolier', 1], ['Rope', 1], ['RobCo Quick Fix-it 1.0', 1], ['Weapon Repair Kit', 2]],
  },
  mercenary: {
    organic: [['Leather Armor', 1], ['Combat Knife', 1], ['Trail Carbine', 1], ['.44 Magnum', 10], ['Bag, Backpack', 1], ['Cram', 2], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Stimpak (Diluted)', 1], ['Purified Water', 1]],
    machine: [['Leather Armor', 1], ['Combat Knife', 1], ['Trail Carbine', 1], ['.44 Magnum', 12], ['Bag, Backpack', 1], ['RobCo Quick Fix-it 1.0', 1], ['RobCo Quick Fix-it 2.0', 1]],
  },
  pastor: {
    organic: [['Cloth Armor', 1], ['Single Shotgun', 1], ['12 gauge', 8], ['Bag, Backpack', 1], ['Sleeping Bag', 1], ['Tent (one person)', 1], ["Pork n' Beans", 3], ['Donut', 1], ['Coffee', 1], ['Purified Water', 3], ['First Aid Kit', 1], ['Healing Powder', 3]],
    machine: [['Cloth Armor', 1], ['Single Shotgun', 1], ['12 gauge', 8], ['Bag, Backpack', 1], ['Flashlight', 1], ['Energy Cell', 1], ['First Aid Kit', 1], ['RobCo Quick Fix-it 2.0', 1]],
  },
  pilgrim: {
    organic: [['Leather Armor', 1], ['Sharpened Pole', 1], ['Laser Rifle', 1], ['Energy Cell', 1], ['Bag, Backpack', 1], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Mutfruit', 2], ['Apple', 2], ['Vegetable Soup', 1], ['Purified Water', 2], ['Healing Powder', 1]],
    machine: [['Leather Armor', 1], ['Sharpened Pole', 1], ['Laser Rifle', 1], ['Energy Cell', 1], ['Bag, Backpack', 1], ['Bandolier', 1], ['Binoculars', 1], ['Grappling Hook', 1], ['Rope', 1], ['RobCo Quick Fix-it 1.0', 1]],
  },
  pitfighter: {
    organic: [['Lead Pipe', 1], ['Brass Knuckles', 1], ['Spiked Knuckles', 1], ['Bandolier', 1], ['Ball Bearings', 1], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Cram', 3], ['Vodka', 1], ['Healing Powder', 3], ['Purified Water', 3], ['Stimpak (Diluted)', 1]],
    machine: [['Metal Armor', 1], ['Lead Pipe', 1], ['Brass Knuckles', 1], ['Spiked Knuckles', 1], ['Bandolier', 1], ['Ball Bearings', 1], ['RobCo Quick Fix-it 2.0', 1]],
  },
  scientist: {
    organic: [['Cloth Armor', 1], ['Laser Pistol', 1], ['Energy Cell', 2], ['Bag, Backpack', 1], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Cram', 3], ['Purified Water', 2], ['RadAway (Diluted)', 1], ['Rad-X', 1], ['Stimpak', 1]],
    machine: [['Cloth Armor', 1], ['Laser Pistol', 1], ['Energy Cell', 2], ['Bag, Backpack', 1], ['RobCo Quick Fix-it 2.0', 2], ["Programmer's Digest", 1], ['Data Scrubber', 1]],
  },
  scribe: {
    organic: [['Cloth Armor', 1], ['Laser Pistol', 1], ['Energy Cell', 2], ['Bag, Backpack', 1], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Cram', 3], ['Purified Water', 2], ['RadAway (Diluted)', 1], ['Rad-X', 1], ['Stimpak', 1]],
    machine: [['Cloth Armor', 1], ['Laser Pistol', 1], ['Energy Cell', 2], ['Bag, Backpack', 1], ['RobCo Quick Fix-it 2.0', 2], ["Programmer's Digest", 1], ['Data Scrubber', 1]],
  },
  soldier: {
    organic: [['Leather Armor', 1], ['Combat Knife', 1], ['Trail Carbine', 1], ['.44 Magnum', 10], ['Bag, Backpack', 1], ['Cram', 2], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Stimpak (Diluted)', 1], ['Purified Water', 1]],
    machine: [['Leather Armor', 1], ['Combat Knife', 1], ['Trail Carbine', 1], ['.44 Magnum', 12], ['Bag, Backpack', 1], ['RobCo Quick Fix-it 1.0', 1], ['RobCo Quick Fix-it 2.0', 1]],
  },
  trader: {
    organic: [['Cloth Armor', 1], ['Shiv', 1], ['Pipe Pistol', 1], ['9mm', 15], ['Bag, Backpack', 1], ['Canned Dog Food', 5], ['Iguana on a Stick', 1], ['Healing Powder', 2], ['Dirty Water', 4], ['Purified Water', 2], ['Lockpicks', 1], ['Tent (one person)', 1], ['Sleeping Bag', 1], ['Whiskey', 1], ['Fixer', 1], ['Jet', 2], ['Cigarette', 3], ['Psycho', 1], ['Coffee', 1]],
    machine: [['Cloth Armor', 1], ['Shiv', 1], ['Pipe Pistol', 1], ['9mm', 15], ['Bag, Backpack', 1], ['Lockpicks', 1], ['RobCo Quick Fix-it 1.0', 2], ['Overclock Hardware', 2], ['Cache Clearer', 2], ['Military Auto-Tank AI Upload', 1], ['Flashlight', 1], ['Energy Cell', 1], ['¡La Fantoma!', 1]],
  },
  vaultdweller: {
    organic: [['Vault Suit', 1], ['10mm Pistol', 1], ['10mm', 10], ['Bag, Backpack', 1], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Canteen', 1], ['Weapon Repair Kit', 1], ['Pip-Boy 3000', 1], ['BlamCo Mac & Cheese', 1], ['Salisbury Steak', 1], ['Yum Yum Deviled Eggs', 1], ['Coffee', 1], ['Purified Water', 4], ['Stimpak', 1]],
    machine: [['Vault Suit', 1], ['Laser Pistol', 1], ['Energy Cell', 2], ['Bag, Backpack', 1], ['Pip-Boy 3000', 1], ['RobCo Quick Fix-it 2.0', 2], ["Programmer's Digest", 1], ['Data Scrubber', 1]],
  },
  wastelander: {
    organic: [['Leather Armor', 1], ['Sharpened Pole', 1], ['10mm Pistol', 1], ['10mm', 10], ['Bag, Backpack', 1], ['Sleeping Bag', 1], ['Tent (one person)', 1], ['Mutfruit', 2], ['Apple', 2], ['Vegetable Soup', 1], ['Purified Water', 2], ['Healing Powder', 1]],
    machine: [['Leather Armor', 1], ['Sharpened Pole', 1], ['10mm Pistol', 1], ['10mm', 10], ['Bag, Backpack', 1], ['Bandolier', 1], ['Binoculars', 1], ['Grappling Hook', 1], ['Rope', 1], ['RobCo Quick Fix-it 1.0', 1]],
  },
};
