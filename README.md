# Fallout TTRPG Pip-Boy

A Pip-Boy styled automatic character sheet and inventory for the fan-made **Fallout TTRPG 2.1** (Arcane Arcade) using the **Fallout TTRPG Changes** house rules (Tess & Peter).

**Where the two disagree, the Changes document wins.** That means:

- Action Points = 12 + half your Agility modifier (rounded up), max 15; recycle up to 5 AP.
- Luck bonus table (+1 crit, +2 skills, +3 crit, +4 skills, +5 karma cap; −1 or lower gives −1 to skills).
- Radiation threshold (10 + END modifier) and RAD counting instead of a Radiation DC.
- Blocking raises AC by half your Endurance; death saves are DC 12; sneak attacks no longer auto-crit.
- The Archery skill, and every weapon, armour, armour upgrade, weapon mod, food, drink, chem, medicine and thrown explosive table from the Changes doc.
- Perks rewritten by the Changes doc use that text; perks it doesn't mention keep their 2.1 text (each perk is badged with its source).

Everything else (races, backgrounds, traits, level table, power armour, ammo, gear, placed explosives, magazines, robot programs, conditions) comes from the 2.1 rulebook.

## Running it

It's a static site with no build step. Either:

- open `index.html` directly in a browser, or
- serve the folder (`python3 -m http.server 8000` then visit `http://localhost:8000`), or
- enable GitHub Pages for this repository (deploy from the root of the branch).

Characters are saved in the browser's local storage. Use **DATA → Characters** to export/import JSON backups.

## What it calculates

- S.P.E.C.I.A.L. with racial adjustments, creation point-buy budget and perk-point increases.
- All skills with a full breakdown (ability, background, skill points, Devout Study, Luck, traits, perks, upgrades, magazines).
- HP, SP, AP, healing rate, AC, DT, passive sense, combat sequence, carry load, radiation threshold, party nerve, karma caps, block bonus, chem limit, death save bonus.
- Weapon hit bonus, damage bonus, crit chance and range for every weapon carried (skill, Strength requirement penalties, decay, mods, perks, Luck, Perception range multiplier).
- Perk and skill point budgets per level and Intelligence; perk requirement checking (including Good Natured / Feral adjustments and race variants).
- Inventory load (worn armour halved, bags, ammo per 10 rounds, Pack Rat), encumbrance, caps, buying/selling, armour upgrades, weapon mods, decay, loaded rounds.
- Condition trackers (RADs, radiation levels, hunger, dehydration, exhaustion, fatigue, bleeding, alcohol, hypothermia, overheating) with the resulting d20 penalty.

## Development

```
node --test tests/rules.test.mjs
```

Source layout:

- `js/data/` — rules data (SPECIAL, races, backgrounds, traits, perks, weapons, armour, items, consumables, reference text).
- `js/rules.js` — pure derived-stat engine.
- `js/store.js` — character state and persistence.
- `js/ui/` — Pip-Boy tabs.
- `css/pipboy.css` — CRT phosphor theme.
