// Tiny DOM helpers — no framework.

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'value') el.value = v;
    else if (k === 'checked') el.checked = !!v;
    else if (k === 'disabled') el.disabled = !!v;
    else if (k === 'selected') el.selected = !!v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'data' && typeof v === 'object') Object.entries(v).forEach(([dk, dv]) => el.dataset[dk] = dv);
    else el.setAttribute(k, v === true ? '' : v);
  }
  append(el, children);
  return el;
}

export function append(el, ...children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

export const fmtMod = n => (n >= 0 ? `+${n}` : `${n}`);

export function numInput(value, onChange, attrs = {}) {
  return h('input', { type: 'number', value, ...attrs, onchange: e => onChange(Number(e.target.value)) });
}

export function stepper(value, onChange, { min = -Infinity, max = Infinity, step = 1, width } = {}) {
  const input = h('input', { type: 'number', value, min: isFinite(min) ? min : null, max: isFinite(max) ? max : null, style: width ? { width } : null,
    onchange: e => onChange(clampNum(Number(e.target.value), min, max)) });
  return h('span', { class: 'row', style: { gap: '2px', flexWrap: 'nowrap' } },
    h('button', { class: 'small', onclick: () => onChange(clampNum(value - step, min, max)) }, '−'),
    input,
    h('button', { class: 'small', onclick: () => onChange(clampNum(value + step, min, max)) }, '+'));
}

const clampNum = (n, lo, hi) => Math.max(lo, Math.min(hi, isNaN(n) ? 0 : n));

export function select(options, value, onChange, attrs = {}) {
  return h('select', { ...attrs, onchange: e => onChange(e.target.value) },
    ...options.map(o => {
      const [v, label] = Array.isArray(o) ? o : [o, o];
      return h('option', { value: v, selected: String(v) === String(value) }, label);
    }));
}

export function field(label, control, extra) {
  return h('label', { class: 'field' }, label, control, extra);
}

export function bar(current, max, { temp = 0, label } = {}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  const tpct = max > 0 ? Math.max(0, Math.min(100 - pct, (temp / max) * 100)) : 0;
  return h('div', { class: 'bar' },
    h('i', { style: { width: pct + '%' } }),
    temp ? h('i', { class: 'temp', style: { left: pct + '%', width: tpct + '%' } }) : null,
    h('span', {}, label ?? `${current}${temp ? ` (+${temp})` : ''} / ${max}`));
}

export function table(headers, rows, { rowClass } = {}) {
  return h('div', { class: 'tablewrap' }, h('table', {},
    h('thead', {}, h('tr', {}, ...headers.map(hd => typeof hd === 'string' ? h('th', {}, hd) : h('th', { class: hd.class }, hd.label)))),
    h('tbody', {}, ...rows.map((r, i) => {
      const cells = Array.isArray(r) ? r : r.cells;
      const attrs = Array.isArray(r) ? {} : (r.attrs || {});
      if (rowClass) attrs.class = [attrs.class, rowClass(r, i)].filter(Boolean).join(' ');
      return h('tr', attrs, ...cells.map(c => (c && c.nodeType) ? h('td', {}, c) : (c && typeof c === 'object' && 'v' in c) ? h('td', { class: c.class }, c.v) : h('td', {}, c ?? '')));
    }))));
}

let modalEl = null;
export function modal(title, content, { wide = false } = {}) {
  closeModal();
  const box = h('div', { class: 'modal', style: wide ? { maxWidth: '1000px' } : null },
    h('h2', {}, title, h('button', { class: 'small ghost', onclick: closeModal }, '✕ CLOSE')),
    content);
  modalEl = h('div', { class: 'modal-bg', onclick: e => { if (e.target === modalEl) closeModal(); } }, box);
  document.body.append(modalEl);
  document.addEventListener('keydown', escClose);
  return closeModal;
}
function escClose(e) { if (e.key === 'Escape') closeModal(); }
export function closeModal() {
  if (modalEl) { modalEl.remove(); modalEl = null; document.removeEventListener('keydown', escClose); }
}

let toastTimer = null;
export function toast(msg) {

  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = h('div', { class: 'toast' }, msg);
  document.body.append(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 2200);
}

export function confirmDialog(message, onYes) {
  modal('Confirm', h('div', { class: 'stack' }, h('p', {}, message),
    h('div', { class: 'row' },
      h('button', { class: 'danger', onclick: () => { closeModal(); onYes(); } }, 'Yes'),
      h('button', { onclick: closeModal }, 'Cancel'))));
}

export function badge(text, cls = '') { return h('span', { class: `chip ${cls}` }, text); }
export function sourceBadge(source) { return source === 'changes' ? badge('CHANGES', 'src-changes') : badge('2.1'); }
