// Character state, persistence (localStorage) and import/export.
import { ABILITY_KEYS } from './data/special.js';

const KEY = 'pipboy.characters.v1';
const ACTIVE_KEY = 'pipboy.activeCharacter';

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function newCharacter(name = 'New Wastelander') {
  return {
    id: uid(),
    name,
    player: '',
    level: 1,
    xp: 0,
    race: 'human',
    raceVariant: 'none',
    background: 'wastelander',
    backgroundSkills: [],
    special: Object.fromEntries(ABILITY_KEYS.map(k => [k, 5])),
    specialFromPerks: Object.fromEntries(ABILITY_KEYS.map(k => [k, 0])),
    skillPoints: {},
    devoutSkillPoints: {},
    skillAbilityChoice: {},
    skillMisc: {},
    magazinesRead: {},
    magazineActive: {},
    traits: [],
    perks: [],
    hp: { current: null, temp: 0 },
    sp: { current: null, temp: 0 },
    ap: { current: null },
    dp: { current: null },
    rads: 0,
    conditions: { radLevels: 0, hunger: 0, dehydration: 0, exhaustion: 0, fatigue: 0, bleeding: 0, alcohol: 0, hypothermia: 0, overheating: 0, other: '' },
    karmaFlipped: 0,
    partyNerve: 0,
    caps: 0,
    inventory: [],
    notes: '',
    bio: '',
    createdAt: Date.now(),
  };
}

export function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.map(migrate) : [];
  } catch (e) {
    console.warn('Could not read saved characters', e);
    return [];
  }
}

export function saveAll(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { console.warn('Could not save', e); }
}

export function getActiveId() {
  try { return localStorage.getItem(ACTIVE_KEY); } catch { return null; }
}
export function setActiveId(id) {
  try { localStorage.setItem(ACTIVE_KEY, id); } catch { /* ignore */ }
}

/** Fill in any fields added since a character was saved. */
export function migrate(ch) {
  const fresh = newCharacter();
  const out = { ...fresh, ...ch };
  for (const k of ['special', 'specialFromPerks', 'skillPoints', 'devoutSkillPoints', 'skillAbilityChoice', 'skillMisc', 'magazinesRead', 'magazineActive', 'hp', 'sp', 'ap', 'dp']) {
    out[k] = { ...fresh[k], ...(ch[k] || {}) };
  }
  out.conditions = { ...fresh.conditions, ...(ch.conditions || {}) };
  out.traits = Array.isArray(ch.traits) ? ch.traits : [];
  out.perks = Array.isArray(ch.perks) ? ch.perks : [];
  out.inventory = Array.isArray(ch.inventory) ? ch.inventory.map(i => ({ uid: uid(), qty: 1, decay: 0, mods: [], upgrades: [], ...i })) : [];
  return out;
}

export function exportCharacter(ch) {
  return JSON.stringify(ch, null, 2);
}

export function importCharacter(json) {
  const parsed = JSON.parse(json);
  const ch = migrate(parsed);
  ch.id = uid();
  return ch;
}

/** Simple observable store. */
export function createStore() {
  let characters = loadAll();
  let activeId = getActiveId();
  if (!characters.length) {
    const c = newCharacter();
    characters = [c];
    activeId = c.id;
  }
  if (!characters.some(c => c.id === activeId)) activeId = characters[0].id;
  const listeners = new Set();
  let scheduled = false;
  const notify = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; listeners.forEach(fn => fn()); });
  };
  const persist = () => { saveAll(characters); setActiveId(activeId); };

  return {
    get characters() { return characters; },
    get active() { return characters.find(c => c.id === activeId); },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    /** Mutate the active character in place, then persist and notify. */
    update(mutator) {
      const ch = this.active;
      mutator(ch);
      persist();
      notify();
    },
    select(id) { if (characters.some(c => c.id === id)) { activeId = id; persist(); notify(); } },
    add(ch) { characters.push(ch); activeId = ch.id; persist(); notify(); return ch; },
    remove(id) {
      characters = characters.filter(c => c.id !== id);
      if (!characters.length) characters.push(newCharacter());
      if (activeId === id) activeId = characters[0].id;
      persist(); notify();
    },
    duplicate(id) {
      const src = characters.find(c => c.id === id);
      if (!src) return;
      const copy = migrate(JSON.parse(JSON.stringify(src)));
      copy.id = uid();
      copy.name = `${src.name} (copy)`;
      this.add(copy);
    },
  };
}
