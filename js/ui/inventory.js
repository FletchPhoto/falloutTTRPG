// INV tab: weapons, apparel, aid, ammo, misc, junk + add-item picker + item editor.
import { h, append, stepper, table, modal, closeModal, badge, toast, confirmDialog, fmtMod, select, field, bar } from './dom.js';
import { COMPENDIUM, CATEGORIES, searchCompendium, findByName, COMPENDIUM_BY_REF } from '../data/compendium.js';
import { WEAPON_GROUPS, RANGED_MODS, MELEE_MODS, MOD_BY_ID, RANGED_PROPERTIES, MELEE_PROPERTIES, WEAPON_BY_ID } from '../data/weapons.js';
import { ARMOR_UPGRADES, ARMOR_UPGRADE_BY_ID, POWER_ARMOR_UPGRADES, POWER_ARMOR_UPGRADE_BY_ID, ARMOR_BY_ID } from '../data/armor.js';
import { EXPLOSIVE_PROPERTIES } from '../data/items.js';
import { FOOD_PROPERTIES } from '../data/consumables.js';
import { uid } from '../store.js';
import { itemUnitLoad } from '../rules.js';

export const INV_TABS = [
  ['weapons', 'Weapons'], ['apparel', 'Apparel'], ['aid', 'Aid'], ['ammo', 'Ammo'], ['misc', 'Misc'], ['junk', 'Junk'], ['add', '+ Add'],
];

const TAB_FOR_CATEGORY = Object.fromEntries(CATEGORIES.map(c => [c.id, c.tab]));

export function makeInventoryItem(entry, qty = 1) {
  return { uid: uid(), ref: entry.ref, category: entry.category, name: entry.name, qty, decay: 0, mods: [], upgrades: [], equipped: false, worn: false, loaded: null, notes: '' };
}

/** Add an item by compendium name (used by starting kits). Falls back to a custom item. Returns true if found. */
export function addCompendiumItemByName(ch, name, qty) {
  const entry = findByName(name);
  const existing = entry && ch.inventory.find(i => i.ref === entry.ref && !['weapon', 'armor'].includes(entry.category) && !i.worn);
  if (existing) { existing.qty += qty; return true; }
  if (entry) {
    if (['weapon', 'armor'].includes(entry.category)) for (let i = 0; i < qty; i++) ch.inventory.push(makeInventoryItem(entry, 1));
    else ch.inventory.push(makeInventoryItem(entry, qty));
    return true;
  }
  ch.inventory.push({ uid: uid(), ref: null, category: 'gear', name, qty, load: 1, cost: 0, decay: 0, mods: [], upgrades: [], notes: 'Custom item from starting kit' });
  return false;
}

export function renderInventory(ctx) {
  const { ch, d, subtab } = ctx;
  const header = h('div', { class: 'panel' },
    h('div', { class: 'row between' },
      h('div', { class: 'row' },
        h('span', {}, 'Caps: '), h('b', { class: 'big' }, ch.caps || 0),
        stepper(ch.caps || 0, v => ctx.update(c => { c.caps = Math.max(0, v); }), { min: 0, width: '5em' })),
      h('div', { style: { minWidth: '260px', flex: 1 } },
        h('div', { class: 'row between' }, h('span', { class: 'tag' }, 'Carry load'), h('span', { class: d.encumbrance === 'none' ? '' : 'warn' }, `${d.load.total} / ${d.carryMax}${d.encumbrance !== 'none' ? ' — ' + d.encumbrance.toUpperCase() : ''}`)),
        bar(d.load.total, d.carryMax, { label: `${Math.round((d.load.total / Math.max(1, d.carryMax)) * 100)}%` })),
      h('button', { class: 'primary', onclick: () => ctx.setSubtab('add') }, '+ Add item')));

  let body;
  if (subtab === 'add') body = renderPicker(ctx);
  else body = renderTab(ctx, subtab);
  return h('div', { class: 'stack' }, header, body);
}

function itemsForTab(ch, tab) {
  return ch.inventory.filter(i => (TAB_FOR_CATEGORY[i.category] || 'misc') === tab || (tab === 'junk' && i.category === 'junk'));
}

function renderTab(ctx, tab) {
  const { ch, d } = ctx;
  const items = itemsForTab(ch, tab);
  if (!items.length) return h('div', { class: 'panel muted' }, 'Nothing here. Use + Add to pick items from the compendium or create your own.');
  const loadRow = Object.fromEntries(d.load.rows.map(r => [r.item.uid, r]));

  if (tab === 'weapons') {
    const weapons = items.filter(i => i.category === 'weapon');
    const explosives = items.filter(i => i.category === 'explosive');
    return h('div', { class: 'stack' },
      weapons.length ? h('div', { class: 'panel' }, h('h2', {}, 'Weapons'),
        table(['', 'Weapon', 'AP', { label: 'Hit', class: 'num' }, 'Damage', 'Crit', 'Range', 'Ammo', { label: 'Load', class: 'num' }, ''],
          weapons.map(it => {
            const w = d.weapons.find(x => x.item.uid === it.uid);
            const s = w?.stats;
            return { attrs: { class: it.equipped ? 'selected' : '' }, cells: [
              h('input', { type: 'checkbox', checked: !!it.equipped, title: 'Equipped / in hand', onchange: e => ctx.update(c => { c.inventory.find(x => x.uid === it.uid).equipped = e.target.checked; }) }),
              h('a', { href: '#', onclick: e => { e.preventDefault(); openItemEditor(ctx, it); } }, it.name, it.decay ? h('span', { class: it.decay >= 10 ? 'bad' : 'warn' }, ` [decay ${it.decay}]`) : null, (it.mods || []).length ? h('span', { class: 'muted' }, ` +${it.mods.length} mod${it.mods.length > 1 ? 's' : ''}`) : null),
              s ? s.ap : '', { v: s ? h('b', { class: 'good' }, fmtMod(s.attack)) : '', class: 'num' }, s ? `${s.damage} ${fmtMod(s.dmgBonus)}` : '', s ? `${s.crit}+ (${s.critText})` : '', s ? s.rangeText : '',
              s?.ammo ? `${it.loaded ?? s.rounds ?? '—'}/${s.rounds ?? '∞'} ${s.ammo}` : '—',
              { v: loadRow[it.uid]?.line ?? '', class: 'num' },
              h('button', { class: 'small', onclick: () => openItemEditor(ctx, it) }, 'Edit'),
            ] };
          })),
        h('p', { class: 'muted' }, `Unarmed strike: 3 AP · 1d4 ${fmtMod(d.unarmed.dmgBonus)} bludgeoning · hit ${fmtMod(d.unarmed.attack)} · crit ${d.unarmed.crit}+ (x2). Two strikes for 5 AP.`)) : null,
      explosives.length ? h('div', { class: 'panel' }, h('h2', {}, 'Explosives'),
        table(['Explosive', 'Qty', 'AP', 'Damage', 'Range', 'Area', 'Properties', { label: 'Load', class: 'num' }, ''],
          explosives.map(it => {
            const b = COMPENDIUM_BY_REF[it.ref]?.base;
            return [h('a', { href: '#', onclick: e => { e.preventDefault(); openItemEditor(ctx, it); } }, it.name), qtyCtl(ctx, it), b?.ap ?? '', b?.damage ?? '', b?.range ? b.range.replace('STR', String(d.special.STR_effective ?? d.special.STR)).replace(/(\d+) x(\d+)/, (m, a, c) => `${Number(a) * Number(c)} ft`) : (b?.armDC ? `Arm DC 10${b.armDC}` : ''), b?.area ?? '', (b?.props || []).join(', '), { v: loadRow[it.uid]?.line ?? '', class: 'num' }, h('button', { class: 'small', onclick: () => openItemEditor(ctx, it) }, 'Edit')];
          })),
        h('p', { class: 'muted' }, `Throw roll: d20 ${fmtMod(d.skills.Explosives.total)} (Explosives). 1 = in your hand · 2–3 half distance, next turn · 4–14 next turn · 15+ end of your turn.`)) : null);
  }

  if (tab === 'apparel') {
    return h('div', { class: 'panel' }, h('h2', {}, 'Apparel'),
      table(['Worn', 'Item', 'AC', 'DT', 'Upgrades', 'Decay', { label: 'Load', class: 'num' }, ''],
        items.map(it => {
          const b = COMPENDIUM_BY_REF[it.ref]?.base;
          const isArmor = it.ref?.startsWith('armor:') || it.ref?.startsWith('powerarmor:');
          return { attrs: { class: it.worn ? 'selected' : '' }, cells: [
            h('input', { type: 'checkbox', checked: !!it.worn, onchange: e => ctx.update(c => {
              const me = c.inventory.find(x => x.uid === it.uid);
              if (e.target.checked && isArmor) c.inventory.forEach(x => { if (x !== me && (x.ref?.startsWith('armor:') || x.ref?.startsWith('powerarmor:'))) x.worn = false; });
              me.worn = e.target.checked;
            }) }),
            h('a', { href: '#', onclick: e => { e.preventDefault(); openItemEditor(ctx, it); } }, it.name),
            b?.ac ?? '—', b?.dt ?? (b?.dp != null ? `DP ${b.dp}` : '—'),
            isArmor ? `${(it.upgrades || []).length}/${b?.slots ?? 0}${(it.upgrades || []).length ? ': ' + it.upgrades.map(u => `${(ARMOR_UPGRADE_BY_ID[u.id] || POWER_ARMOR_UPGRADE_BY_ID[u.id])?.name} R${u.rank}`).join(', ') : ''}` : (b?.text ? h('span', { class: 'muted' }, b.text) : ''),
            isArmor ? h('span', { class: it.decay >= 10 ? 'bad' : it.decay ? 'warn' : '' }, it.decay || 0) : '',
            { v: loadRow[it.uid]?.line ?? '', class: 'num' },
            h('button', { class: 'small', onclick: () => openItemEditor(ctx, it) }, 'Edit')] };
        })),
      h('p', { class: 'muted' }, 'Worn armor: load halved, AC and DT reduced by half its decay levels. Only one suit can be worn. Bags and bandoliers must be worn to add carry load.'));
  }

  if (tab === 'ammo') {
    return h('div', { class: 'panel' }, h('h2', {}, 'Ammunition'),
      table(['Type', 'Rounds', 'Used by', { label: 'Load', class: 'num' }, ''],
        items.map(it => [h('a', { href: '#', onclick: e => { e.preventDefault(); openItemEditor(ctx, it); } }, it.name), qtyCtl(ctx, it, 10),
          ch.inventory.filter(w => w.ref?.startsWith('weapon:') && WEAPON_BY_ID[w.ref.slice(7)]?.ammo === it.name).map(w => w.name).join(', ') || h('span', { class: 'muted' }, '—'),
          { v: loadRow[it.uid]?.line ?? '', class: 'num' }, h('button', { class: 'small', onclick: () => openItemEditor(ctx, it) }, 'Edit')])),
      h('p', { class: 'muted' }, 'Ten rounds = 1 load (heavy ammo has its own load). Reload: 6 AP by default.'));
  }

  // aid / misc / junk
  return h('div', { class: 'panel' }, h('h2', {}, tab === 'aid' ? 'Aid' : tab === 'junk' ? 'Junk' : 'Misc'),
    table(['Item', 'Qty', 'Effect / properties', tab === 'misc' ? 'Worn' : '', { label: 'Load', class: 'num' }, { label: 'Value', class: 'num' }, ''],
      items.map(it => {
        const entry = COMPENDIUM_BY_REF[it.ref];
        const b = entry?.base;
        const wearable = b && (b.carryBonus || b.worn || b.wornLoad != null);
        return [h('a', { href: '#', onclick: e => { e.preventDefault(); openItemEditor(ctx, it); } }, it.name), qtyCtl(ctx, it),
          h('span', { class: 'muted' }, entry?.summary || it.notes || ''),
          tab === 'misc' ? (wearable ? h('input', { type: 'checkbox', checked: !!it.worn, onchange: e => ctx.update(c => { c.inventory.find(x => x.uid === it.uid).worn = e.target.checked; }) }) : '') : '',
          { v: loadRow[it.uid]?.line ?? '', class: 'num' }, { v: `${(it.cost ?? b?.cost ?? 0) * (it.qty || 1)}c`, class: 'num' },
          h('span', { class: 'row', style: { flexWrap: 'nowrap' } },
            ['aid'].includes(tab) ? h('button', { class: 'small', title: 'Consume one', onclick: () => ctx.update(c => { const me = c.inventory.find(x => x.uid === it.uid); me.qty--; if (me.qty <= 0) c.inventory = c.inventory.filter(x => x.uid !== it.uid); }) }, 'Use') : null,
            h('button', { class: 'small', onclick: () => openItemEditor(ctx, it) }, 'Edit'))];
      })));
}

function qtyCtl(ctx, it, step = 1) {
  return stepper(it.qty || 1, v => ctx.update(c => { const me = c.inventory.find(x => x.uid === it.uid); me.qty = Math.max(0, v); if (me.qty === 0) c.inventory = c.inventory.filter(x => x.uid !== it.uid); }), { min: 0, step, width: '4em' });
}

// ---------------------------------------------------------------------------
// Picker
// ---------------------------------------------------------------------------
function renderPicker(ctx) {
  let query = '', cat = '';
  const results = h('div', {});
  const draw = () => {
    results.replaceChildren();
    const list = searchCompendium(query, cat || null).slice(0, 200);
    results.append(table(['Item', 'Type', 'Details', { label: 'Cost', class: 'num' }, { label: 'Load', class: 'num' }, ''],
      list.map(e => [h('b', {}, e.name), h('span', { class: 'muted' }, `${CATEGORIES.find(c => c.id === e.category)?.name || e.category}${e.sub ? ' · ' + e.sub : ''}`), h('span', { class: 'muted', style: { fontSize: '13px' } }, e.summary || ''), { v: `${e.cost}c`, class: 'num' }, { v: e.load, class: 'num' },
        h('span', { class: 'row', style: { flexWrap: 'nowrap' } },
          h('button', { class: 'small primary', onclick: () => addEntry(ctx, e, 1, false) }, 'Add'),
          h('button', { class: 'small', title: 'Add and pay caps', onclick: () => addEntry(ctx, e, 1, true) }, 'Buy'),
          ['ammo', 'food', 'drink', 'chem', 'medicine'].includes(e.category) ? h('button', { class: 'small', onclick: () => addEntry(ctx, e, 10, false) }, '+10') : null)])));
    if (!list.length) results.append(h('p', { class: 'muted' }, 'No matches.'));
  };
  draw();
  return h('div', { class: 'stack' },
    h('div', { class: 'panel' },
      h('div', { class: 'row' },
        h('input', { type: 'text', placeholder: 'Search the compendium…', style: { flex: 1, minWidth: '180px' }, autofocus: true, oninput: e => { query = e.target.value; draw(); } }),
        select([['', 'All categories'], ...CATEGORIES.filter(c => c.id !== 'junk').map(c => [c.id, c.name])], cat, v => { cat = v; draw(); }, { style: { width: 'auto' } }),
        h('button', { onclick: () => openCustomItem(ctx) }, 'Custom item / junk')),
      h('p', { class: 'muted' }, `${COMPENDIUM.length} items from the Changes document and the 2.1 rulebook. "Buy" deducts the listed cost from your caps.`)),
    h('div', { class: 'panel picker' }, results));
}

function addEntry(ctx, entry, qty, pay) {
  ctx.update(c => {
    if (pay) {
      const total = entry.cost * qty;
      if ((c.caps || 0) < total) { toast(`Not enough caps (${total}c needed).`); return; }
      c.caps -= total;
    }
    const stackable = !['weapon', 'armor'].includes(entry.category);
    const existing = stackable && c.inventory.find(i => i.ref === entry.ref);
    if (existing) existing.qty += qty; else c.inventory.push(makeInventoryItem(entry, qty));
  });
  toast(`${entry.name} ×${qty} added${pay ? ` (−${entry.cost * qty}c)` : ''}.`);
}

function openCustomItem(ctx) {
  const st = { name: '', category: 'junk', qty: 1, load: 1, cost: 0, notes: '' };
  modal('Custom item', h('div', { class: 'stack' },
    field('Name', h('input', { type: 'text', oninput: e => st.name = e.target.value })),
    field('Category', select(CATEGORIES.map(c => [c.id, c.name]), st.category, v => st.category = v)),
    h('div', { class: 'row' },
      field('Quantity', h('input', { type: 'number', value: 1, min: 1, onchange: e => st.qty = Math.max(1, Number(e.target.value)) })),
      field('Load (each)', h('input', { type: 'number', value: 1, min: 0, step: 0.1, onchange: e => st.load = Math.max(0, Number(e.target.value)) })),
      field('Value (each)', h('input', { type: 'number', value: 0, min: 0, onchange: e => st.cost = Math.max(0, Number(e.target.value)) }))),
    field('Notes / effect', h('textarea', { oninput: e => st.notes = e.target.value })),
    h('button', { class: 'primary', onclick: () => {
      if (!st.name.trim()) { toast('Give it a name.'); return; }
      ctx.update(c => c.inventory.push({ uid: uid(), ref: null, category: st.category, name: st.name.trim(), qty: st.qty, load: st.load, cost: st.cost, notes: st.notes, decay: 0, mods: [], upgrades: [] }));
      closeModal();
    } }, 'Add to inventory')));
}

// ---------------------------------------------------------------------------
// Item editor
// ---------------------------------------------------------------------------
export function openItemEditor(ctx, item) {
  const { ch, d } = ctx;
  const it = ch.inventory.find(x => x.uid === item.uid);
  if (!it) return;
  const entry = COMPENDIUM_BY_REF[it.ref];
  const b = entry?.base;
  const isWeapon = it.ref?.startsWith('weapon:');
  const isArmor = it.ref?.startsWith('armor:');
  const isPA = it.ref?.startsWith('powerarmor:');
  const upd = fn => { ctx.update(c => { const me = c.inventory.find(x => x.uid === it.uid); if (me) fn(me, c); }); refresh(); };
  const box = h('div', { class: 'stack' });

  let refreshing = false;
  function refresh() {
    if (refreshing) { queueMicrotask(refresh); return; }
    refreshing = true;
    try { doRefresh(); } finally { refreshing = false; }
  }
  function doRefresh() {
    const cur = ctx.store.active.inventory.find(x => x.uid === it.uid);
    if (!cur) { closeModal(); return; }
    const der = ctx.recompute();
    box.replaceChildren();
    const w = isWeapon ? der.weapons.find(x => x.item.uid === cur.uid)?.stats : null;
    append(box, 
      h('div', { class: 'row' },
        field('Name', h('input', { type: 'text', value: cur.name, onchange: e => upd(m => { m.name = e.target.value; }) })),
        field('Qty', h('input', { type: 'number', value: cur.qty, min: 0, style: { width: '4.5em' }, onchange: e => upd(m => { m.qty = Math.max(0, Number(e.target.value)); }) })),
        (isWeapon || isArmor || isPA || !it.ref) ? field('Decay (0–10)', h('input', { type: 'number', value: cur.decay || 0, min: -1, max: 10, style: { width: '4.5em' }, onchange: e => upd(m => { m.decay = Math.max(-1, Math.min(10, Number(e.target.value))); }) })) : null,
        !it.ref ? field('Load each', h('input', { type: 'number', value: cur.load ?? 0, min: 0, step: 0.1, style: { width: '4.5em' }, onchange: e => upd(m => { m.load = Number(e.target.value); }) })) : null,
        field('Value each', h('input', { type: 'number', value: cur.cost ?? b?.cost ?? 0, min: 0, style: { width: '5em' }, onchange: e => upd(m => { m.cost = Number(e.target.value); }) }))),
      entry?.summary ? h('p', { class: 'muted' }, entry.summary) : null,
      b?.text && !entry?.summary?.includes(b.text) ? h('p', {}, b.text) : null,
    );

    if (isWeapon && w) {
      append(box, h('div', { class: 'panel' },
        h('h3', {}, 'Computed'),
        table(['Hit', 'Damage', 'Crit', 'Range', 'AP', 'STR req', 'Skill'], [[fmtMod(w.attack), `${w.damage} ${fmtMod(w.dmgBonus)} (${w.dmgAbility})`, `${w.crit}+ (${w.critText})`, w.rangeText, w.ap, w.strReq, `${w.skillName} ${fmtMod(w.skillTotal)}`]]),
        w.notes.length ? h('div', {}, ...w.notes.map(n => h('div', { class: 'warn' }, n))) : null,
        h('div', { class: 'mt' }, ...(b.props || []).map(p => { const key = Object.keys({ ...RANGED_PROPERTIES, ...MELEE_PROPERTIES }).find(k => p.startsWith(k)); return h('div', {}, h('b', {}, p), key ? h('span', { class: 'muted' }, ` — ${(WEAPON_GROUPS[b.group].kind === 'ranged' ? RANGED_PROPERTIES : MELEE_PROPERTIES)[key] || RANGED_PROPERTIES[key] || MELEE_PROPERTIES[key]}`) : null); })),
        w.rounds ? h('div', { class: 'row mt' }, h('span', {}, `Loaded: `), stepper(cur.loaded ?? w.rounds, v => upd(m => { m.loaded = Math.max(0, Math.min(w.rounds, v)); }), { min: 0, max: w.rounds, width: '4em' }), h('span', { class: 'muted' }, `/ ${w.rounds} ${w.ammo}`),
          h('button', { class: 'small', onclick: () => upd((m, c) => {
            const ammo = c.inventory.find(a => a.category === 'ammo' && a.name === w.ammo);
            const need = w.rounds - (m.loaded ?? w.rounds);
            if (!ammo) { toast(`No ${w.ammo} in inventory.`); return; }
            const take = Math.min(need, ammo.qty);
            ammo.qty -= take; m.loaded = (m.loaded ?? w.rounds) + take;
            if (ammo.qty <= 0) c.inventory = c.inventory.filter(a => a.uid !== ammo.uid);
            if (take < need) toast(`Only ${take} rounds available.`);
          }) }, 'Reload from ammo'),
          h('button', { class: 'small', onclick: () => upd(m => { m.loaded = Math.max(0, (m.loaded ?? w.rounds) - 1); }) }, 'Fire 1')) : null));
      const mods = WEAPON_GROUPS[b.group].kind === 'ranged' ? RANGED_MODS : MELEE_MODS;
      const slotsUsed = (cur.mods || []).reduce((s, m) => s + (MOD_BY_ID[m]?.slots || 0), 0);
      append(box, h('div', { class: 'panel' },
        h('h3', {}, WEAPON_GROUPS[b.group].kind === 'ranged' ? `Modifications (${slotsUsed}/6 slots)` : `Modification (${(cur.mods || []).length}/1)`),
        h('div', {}, ...mods.map(m => { const on = (cur.mods || []).includes(m.id); return h('span', { class: `chip clickable ${on ? 'on' : ''}`, title: m.text, onclick: () => upd(x => { x.mods = x.mods || []; if (on) x.mods = x.mods.filter(y => y !== m.id); else if (WEAPON_GROUPS[b.group].kind === 'ranged' ? slotsUsed + (m.slots || 0) <= 6 : x.mods.length < 1) x.mods.push(m.id); else toast('No mod slot available.'); }) }, m.name, m.slots ? ` (${m.slots})` : ''); })),
        (cur.mods || []).length ? h('ul', { class: 'mt' }, ...cur.mods.map(m => h('li', {}, h('b', {}, MOD_BY_ID[m]?.name), ': ', MOD_BY_ID[m]?.text, MOD_BY_ID[m]?.costPct ? h('span', { class: 'muted' }, ` (${MOD_BY_ID[m].costPct}% of weapon cost ≈ ${Math.round(b.cost * MOD_BY_ID[m].costPct / 100)}c)`) : ''))) : h('p', { class: 'muted' }, 'Click a mod to attach it. Hover for details.')));
    }

    if (isArmor || isPA) {
      const upgrades = isPA ? POWER_ARMOR_UPGRADES : ARMOR_UPGRADES;
      const byId = isPA ? POWER_ARMOR_UPGRADE_BY_ID : ARMOR_UPGRADE_BY_ID;
      const slots = b.slots;
      const builtIn = isArmor ? (ARMOR_BY_ID[it.ref.slice(6)]?.builtInUpgrades || []) : [];
      append(box, h('div', { class: 'panel' },
        h('h3', {}, `Upgrades (${(cur.upgrades || []).length}/${slots} slots — ranks are free of slots)`),
        builtIn.length ? h('p', { class: 'muted' }, 'Built in: ', builtIn.map(u => `${byId[u.id]?.name} R${u.rank}`).join(', ')) : null,
        h('div', {}, ...upgrades.map(u => {
          const have = (cur.upgrades || []).find(x => x.id === u.id);
          return h('span', { class: `chip clickable ${have ? 'on' : ''}`, title: (u.ranks || []).map((r, i) => `R${i + 1}: ${typeof r === 'string' ? r : r.text}`).join('\n'), onclick: () => upd(x => {
            x.upgrades = x.upgrades || [];
            if (have) x.upgrades = x.upgrades.filter(y => y.id !== u.id);
            else if (x.upgrades.length < slots) x.upgrades.push({ id: u.id, rank: 1 });
            else toast('No upgrade slot available.');
          }) }, u.name, have ? ` R${have.rank}` : '');
        })),
        (cur.upgrades || []).length ? h('div', { class: 'list mt' }, ...cur.upgrades.map(u => { const def = byId[u.id]; return h('div', { class: 'item' },
          h('div', { class: 'title' }, h('span', {}, def.name, ` — rank `, stepper(u.rank, v => upd(x => { x.upgrades.find(y => y.id === u.id).rank = Math.max(1, Math.min(def.maxRank, v)); }), { min: 1, max: def.maxRank, width: '3em' })), def.cost ? h('span', { class: 'muted' }, `${def.cost}c per rank`) : null),
          h('div', { class: 'body' }, ...def.ranks.slice(0, u.rank).map((r, i) => h('div', {}, `R${i + 1}: ${typeof r === 'string' ? r : r.text}`)))); })) : null));
      if (isPA) append(box, h('p', { class: 'muted' }, 'Power armor: 6 AP to enter or exit. Strength counts as 12, size Large. DP absorb damage before SP; at 0 DP the armor gains a level of decay and DP refill. More than 15 AP in a turn overheats it.'));
    }

    if (it.category === 'explosive' && b) {
      append(box, h('div', { class: 'panel' }, h('h3', {}, 'Properties'), ...(b.props || []).map(p => { const key = Object.keys(EXPLOSIVE_PROPERTIES).find(k => p.startsWith(k)); return h('div', {}, h('b', {}, p), key ? h('span', { class: 'muted' }, ` — ${EXPLOSIVE_PROPERTIES[key]}`) : null); })));
    }
    if (['food', 'drink'].includes(it.category) && b?.props) {
      append(box, h('div', { class: 'panel' }, h('h3', {}, 'Properties'), ...b.props.map(p => { const key = p.split(' ')[0]; return h('div', {}, h('b', {}, p), FOOD_PROPERTIES[key] ? h('span', { class: 'muted' }, ` — ${FOOD_PROPERTIES[key]}`) : null); }), b.recipe ? h('p', { class: 'muted mt' }, `Recipe: ${b.recipe} (Survival ${b.dc})`) : null));
    }
    if (['chem', 'medicine', 'program'].includes(it.category) && b) {
      append(box, h('div', { class: 'panel' }, h('p', {}, b.effect), b.addiction ? h('p', { class: 'warn' }, 'Addiction: ', b.addiction) : null));
    }

    append(box, 
      field('Notes', h('textarea', { style: { minHeight: '60px' }, onchange: e => upd(m => { m.notes = e.target.value; }) }, cur.notes || '')),
      h('div', { class: 'row between mt' },
        h('div', { class: 'row' },
          h('button', { onclick: () => { const price = Math.floor((cur.cost ?? b?.cost ?? 0) * Math.max(0, 1 - 0.1 * Math.max(0, cur.decay || 0)) * (der.effects.find(e => e.type === 'sellRate')?.value ?? 0.5)); confirmDialog(`Sell one ${cur.name} for ${price} caps (${Math.round((der.effects.find(e => e.type === 'sellRate')?.value ?? 0.5) * 100)}% of value, −10% per decay level)?`, () => upd((m, c) => { c.caps = (c.caps || 0) + price; m.qty--; if (m.qty <= 0) c.inventory = c.inventory.filter(x => x.uid !== m.uid); })); } }, 'Sell one'),
          h('button', { onclick: () => upd((m, c) => { const copy = { ...JSON.parse(JSON.stringify(m)), uid: uid() }; c.inventory.push(copy); }) }, 'Duplicate')),
        h('button', { class: 'danger', onclick: () => confirmDialog(`Drop ${cur.name}?`, () => { ctx.update(c => { c.inventory = c.inventory.filter(x => x.uid !== cur.uid); }); closeModal(); }) }, 'Drop')));
  }
  refresh();
  modal(item.name, box, { wide: true });
}
