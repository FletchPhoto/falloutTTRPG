// Races and variants (Fallout TTRPG 2.1, pg. 7-12)
// `effects` are applied automatically by rules.js; `text` is displayed to the player.

export const RACES = [
  {
    id: 'human',
    name: 'Human',
    size: 'Medium or Small',
    hasRadiationDC: true,
    organic: true,
    traits: [
      { name: 'Tenacity', text: 'When you roll death saves, you die when you fail your fourth death save instead of your third.' },
    ],
    variants: [
      { id: 'none', name: 'Standard Human', traits: [] },
      { id: 'resourceful', name: 'Variant: Resourceful', traits: [{ name: 'Resourceful', text: 'You gain one extra Karma Cap that you can use each game.' }], effects: [{ type: 'karmaCaps', value: 1 }] },
      { id: 'unexposed', name: 'Variant: Unexposed', traits: [{ name: 'Unexposed', text: 'You have disadvantage on all Radiation and Addiction checks.' }] },
      { id: 'gen3', name: 'Variant: Gen 3 Synth', traits: [{ name: 'Gen 3 Synth', text: 'Indistinguishable from a human. No statistical change; narrative only.' }] },
    ],
  },
  {
    id: 'ghoul',
    name: 'Ghoul',
    size: 'Medium or Small',
    hasRadiationDC: false,
    organic: true,
    traits: [
      { name: 'Evolution', text: 'You cannot gain levels of radiation and are immune to radiation damage. You gain no Irradiated levels from food or water.' },
      { name: 'Resilient Anatomy', text: 'Resistant to poison damage. SP gained from food, drinks or chems is halved. HP from stimpaks is halved. Healing powder does nothing. Non-loader syringes have no effect. Bleeding damage is halved.' },
    ],
    variants: [
      { id: 'none', name: 'Standard Ghoul', traits: [] },
      { id: 'manyroads', name: 'Variant: Many Roads Walked', traits: [{ name: 'Many Roads Walked', text: 'You gain a +2 in all skills and an extra perk at 1st level.' }], effects: [{ type: 'skillAll', value: 2 }, { type: 'perkPoints', value: 1 }] },
      { id: 'oldbones', name: 'Variant: Old Bones', traits: [{ name: 'Old Bones', text: 'You are immune to poison damage and you gain the Stitched Together perk.' }], effects: [{ type: 'freePerk', perk: 'stitched_together' }] },
      { id: 'halflife', name: 'Variant: Half Life', traits: [{ name: 'Half Life', text: 'Your mind slips each day. When you reach Level 15 you are fully consumed by ghoulification and your character is controlled by the GM.' }] },
    ],
  },
  {
    id: 'synth',
    name: 'Gen-2 Synth',
    size: 'Medium or Small',
    hasRadiationDC: false,
    organic: false,
    traits: [
      { name: 'Inorganic Body', text: 'Immune to radiation and poison. No effects from Chems, Drinks or Food. No need to breathe, sleep, eat or drink.' },
    ],
    variants: [
      { id: 'none', name: 'Standard Gen-2 Synth', traits: [] },
      { id: 'brittle', name: 'Variant: Brittle Body', traits: [{ name: 'Brittle Body', text: 'Targeted attacks against you apply two limb conditions instead of one. You are vulnerable to electricity damage.' }] },
      { id: 'upgrades', name: 'Variant: Software and Hardware Upgrades', traits: [{ name: 'Software and Hardware Upgrades', text: 'Whenever you gain a perk, you are considered a Robot for perk requirements.' }], effects: [{ type: 'countsAsRobot' }] },
      { id: 'ai', name: 'Variant: Artificial Intelligence Algorithms', traits: [{ name: 'Artificial Intelligence Algorithms', text: 'Whenever you gain skill points, you gain 1 more.' }], effects: [{ type: 'skillPointsPerGrant', value: 1 }] },
    ],
  },
  {
    id: 'robot',
    name: 'Robot',
    size: 'Medium',
    hasRadiationDC: false,
    organic: false,
    noPowerArmor: true,
    traits: [
      { name: 'Inorganic Body', text: 'Cannot gain radiation levels; immune to radiation and poison damage. Cannot gain levels of bleeding. No effects from Chems, Drinks or Food. No need to breathe, sleep, eat or drink.' },
      { name: 'Severed Limbs', text: 'Severed limbs do not cause shock and can be reattached with 3 steel and 1 circuitry in (10 − crafting bonus) minutes.' },
      { name: 'Armor and Weapons', text: 'You can use armor and weapons as any race would, but you cannot use power armor.' },
    ],
    variants: [
      {
        id: 'handy', name: 'Handy',
        traits: [
          { name: 'Limbs and Targeted Attacks', text: 'Three arms, three eyes, no head/groin/legs. Eye targeted attacks cost 2 less AP; jet engine can be targeted as legs (+2 AP).' },
          { name: 'Fuel', text: 'Every week spend 6 AP to consume a gallon of fuel or six oil junk items, or run 30 days on a fusion core.' },
          { name: 'Jet Engine', text: 'You hover and do not trigger floor-based traps.' },
          { name: 'Incredible Multi-Talented Appliance!', text: 'Three built-in tools (Buzz Saw, Clippers, Drill, Gripper, Torch). Without two Grippers you effectively have one hand.' },
        ],
      },
      {
        id: 'protectron', name: 'Protectron',
        traits: [
          { name: 'Reinforced Plating', text: 'Your DT increases by 1 even without armor.' },
          { name: 'Slow', text: 'You can spend a maximum of 6 AP on movement during your turn.' },
          { name: 'Protect and Serve', text: 'One built-in tool: Taser, Laser, Defibrillator, Cryo Spray or Nail Gun.' },
        ],
        effects: [{ type: 'dt', value: 1 }],
      },
      {
        id: 'robobrain', name: 'Robobrain',
        traits: [
          { name: 'All Terrain Rollers', text: 'You do not spend extra AP to move through difficult terrain.' },
          { name: 'NeuroTransmitters', text: 'Vulnerable to electricity damage. Targeted attacks to the head apply two conditions.' },
        ],
      },
    ],
  },
  {
    id: 'supermutant',
    name: 'Super Mutant',
    size: 'Medium (7–9 ft)',
    hasRadiationDC: false,
    organic: true,
    traits: [
      { name: 'Evolution', text: 'You cannot gain levels of radiation and are immune to radiation damage. No Irradiated levels from food or water.' },
      { name: 'Mass Exertion', text: 'Required food and water each day is doubled.' },
      { name: 'Bulky', text: 'Whenever your weapons or armor would gain a level of decay, they gain an additional one.' },
      { name: 'Power Armor', text: 'You cannot use power armor unless it has the Super Mutant Fitting upgrade.' },
    ],
    variants: [
      { id: 'none', name: 'Superior Strength', traits: [{ name: 'Superior Strength', text: 'Your Strength increases by 1 and cannot be lower than 6. Carry Load +40.' }], effects: [{ type: 'ability', ability: 'STR', value: 1, min: 6 }, { type: 'carry', value: 40 }] },
      { id: 'defective', name: 'Variant: Defective Strain', traits: [{ name: 'Defective Strain', text: 'Strength and Endurance +2, Carry Load +40. Intelligence −2 and cannot be raised above 3.' }], effects: [{ type: 'ability', ability: 'STR', value: 2 }, { type: 'ability', ability: 'END', value: 2 }, { type: 'ability', ability: 'INT', value: -2, max: 3 }, { type: 'carry', value: 40 }] },
      { id: 'nightkin', name: 'Variant: Nightkin', traits: [{ name: 'Nightkin', text: 'Strength +1 (min 6), Carry Load +40. Stealth Field: spend 3 AP to become invisible for 1 minute; each use after the first per day reduces Perception by 1 for 24 hours.' }], effects: [{ type: 'ability', ability: 'STR', value: 1, min: 6 }, { type: 'carry', value: 40 }] },
    ],
  },
];

export const RACE_BY_ID = Object.fromEntries(RACES.map(r => [r.id, r]));

/** Kind used for medicine / food effects & perk requirements. */
export function raceKind(raceId) {
  return RACE_BY_ID[raceId]?.organic === false ? 'machine' : 'organic';
}
