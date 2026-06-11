'use strict';
/* ═══════════════════════════════════════════
   LEDGER · Pure Vanilla JS · LocalStorage
═══════════════════════════════════════════ */

/* ─── Defaults ───────────────────────────── */
const DEF_PREFS = {
  appName: 'Ledger', currency: '€', theme: 'light',
  accent: 'moss', limit: 0, budget: 0
};

const DEF_CATS = [
  { id:'c1', name:'Food',      icon:'🍔', color:'#D38C76', type:'expense' },
  { id:'c2', name:'Transport', icon:'🚌', color:'#637A6A', type:'expense' },
  { id:'c3', name:'Fun',       icon:'🎮', color:'#A8B5A2', type:'expense' },
  { id:'c4', name:'Shopping',  icon:'🛍️', color:'#B89A5A', type:'expense' },
  { id:'c5', name:'Health',    icon:'💊', color:'#4A6580', type:'expense' },
  { id:'c6', name:'Bills',     icon:'🧾', color:'#8C4A60', type:'expense' },
  { id:'c7', name:'Salary',    icon:'💼', color:'#4A5D4E', type:'income'  },
  { id:'c8', name:'Freelance', icon:'💻', color:'#637A6A', type:'income'  },
  { id:'c9', name:'Other',     icon:'✨', color:'#9AA097', type:'expense' }
];

/* ─── State ──────────────────────────────── */
let S = { transactions:[], categories:[], prefs:{...DEF_PREFS} };

/* ─── Storage ────────────────────────────── */
function loadState() {
  try {
    const raw = localStorage.getItem('ledger_v2');
    if (raw) {
      const p = JSON.parse(raw);
      S.transactions = Array.isArray(p.transactions) ? p.transactions : [];
      S.categories   = Array.isArray(p.categories)   ? p.categories   : [...DEF_CATS];
      S.prefs        = Object.assign({}, DEF_PREFS, p.prefs || {});
    } else {
      S.categories = [...DEF_CATS];
    }
  } catch(_) { S.categories = [...DEF_CATS]; }
}

function saveState() {
  localStorage.setItem('ledger_v2', JSON.stringify(S));
}

/* ─── Utils ──────────────────────────────── */
const uid  = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);
const esc  = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fmt  = v  => (S.prefs.currency||'€') + Number(v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const today= () => new Date().toISOString().slice(0,10);
const mon  = ()  => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; };
const cat  = id  => S.categories.find(c=>c.id===id) || {name:'Unknown',icon:'•',color:'#9AA097',type:'expense'};
const rgba = (h,a) => {
  const r=parseInt(h.slice(1,3),16), g=parseInt(h.slice(3,5),16), b=parseInt(h.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
};
const fmtDate = iso => {
  if (!iso) return '';
  const [y,m,d] = iso.split('-');
  return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1]} ${y}`;
};

/* ─── Count-Up ───────────────────────────── */
function countUp(el, target) {
  const sym = S.prefs.currency || '€';
  const num = parseFloat(String(target).replace(sym,'').replace(/,/g,'')) || 0;
  const neg = num < 0;
  const abs = Math.abs(num);
  const dur = 650, t0 = performance.now();
  const step = now => {
    const p = Math.min((now-t0)/dur, 1);
    const e = 1 - Math.pow(1-p, 3);
    el.textContent = (neg?'-':'') + sym + (abs*e).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ─── Toast ──────────────────────────────── */
function toast(msg, type='', ms=2600) {
  const el = document.createElement('div');
  el.className = 'toast' + (type?' '+type:'');
  el.textContent = msg;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => {
    el.classList.add('bye');
    el.addEventListener('animationend', ()=>el.remove(), {once:true});
  }, ms);
}

/* ─── Confirm ────────────────────────────── */
function confirm(title, body) {
  return new Promise(resolve => {
    const bg = document.getElementById('modal-bg');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').textContent  = body;
    bg.classList.remove('hidden');
    const ok = document.getElementById('modal-ok');
    const no = document.getElementById('modal-cancel');
    const done = r => { bg.classList.add('hidden'); ok.replaceWith(ok.cloneNode(true)); no.replaceWith(no.cloneNode(true)); resolve(r); };
    document.getElementById('modal-ok').addEventListener('click', ()=>done(true),  {once:true});
    document.getElementById('modal-cancel').addEventListener('click', ()=>done(false), {once:true});
  });
}

/* ─── Apply Prefs ────────────────────────── */
function applyPrefs() {
  const { appName, theme, accent, currency, limit } = S.prefs;
  document.documentElement.setAttribute('data-theme',  theme  || 'light');
  document.documentElement.setAttribute('data-accent', accent || 'moss');
  document.getElementById('app-name-display').textContent = appName || 'Ledger';
  document.getElementById('page-title').textContent       = appName || 'Ledger';
  document.getElementById('s-appname').value  = appName  || '';
  document.getElementById('s-currency').value = currency || '€';
  document.getElementById('s-limit').value    = limit    || '';
  document.querySelectorAll('[data-thv]').forEach(b => b.classList.toggle('active', b.dataset.thv === (theme||'light')));
  document.querySelectorAll('.sw').forEach(s  => s.classList.toggle('active', s.dataset.ac === (accent||'moss')));
}

/* ─── Category Selects ───────────────────── */
function fillCatSelects(type='expense') {
  const main = document.getElementById('txn-category');
  const filt = document.getElementById('filter-category');
  main.innerHTML = S.categories.filter(c=>c.type===type).map(c=>`<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
  filt.innerHTML = '<option value="">All Categories</option>' +
    S.categories.map(c=>`<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
}

/* ─── Build Transaction Row ──────────────── */
function buildRow(t) {
  const c     = cat(t.categoryId);
  const lim   = parseFloat(S.prefs.limit)||0;
  const over  = lim>0 && t.type==='expense' && t.amount>lim;
  const sign  = t.type==='income' ? '+' : '-';
  const div   = document.createElement('div');
  div.className = `txn-row txn-${t.type}${over?' over-limit':''}`;
  div.dataset.id = t.id;
  div.innerHTML = `
    <div class="txn-ic" style="background:${rgba(c.color,.14)}">${c.icon}</div>
    <div class="txn-info">
      <div class="txn-name">${esc(t.name)}</div>
      <div class="txn-meta">
        <span>${fmtDate(t.date)}</span>
        <span class="txn-tag" style="background:${rgba(c.color,.14)};color:${c.color}">${c.name}</span>
        ${over?'<span style="color:var(--danger);font-weight:600">⚠ over limit</span>':''}
      </div>
    </div>
    <div class="txn-amt">${sign}${fmt(t.amount)}</div>
    <div class="txn-acts">
      <button class="act-btn edit" data-id="${t.id}" title="Edit" aria-label="Edit">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>
      <button class="act-btn del" data-id="${t.id}" title="Delete" aria-label="Delete">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
      </button>
    </div>`;
  return div;
}

/* ─── Render Recent ──────────────────────── */
function renderRecent() {
  const list  = document.getElementById('recent-list');
  const empty = document.getElementById('recent-empty');
  const rows  = [...S.transactions].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6);
  list.innerHTML = '';
  if (!rows.length) { empty.style.display=''; return; }
  empty.style.display = 'none';
  rows.forEach(t => list.appendChild(buildRow(t)));
}

/* ─── Render All Transactions ────────────── */
function getFiltered() {
  const q  = document.getElementById('filter-search').value.toLowerCase();
  const cf = document.getElementById('filter-category').value;
  const tf = document.getElementById('filter-type').value;
  const sf = document.getElementById('filter-sort').value;
  let arr  = S.transactions.filter(t =>
    (!q  || t.name.toLowerCase().includes(q)) &&
    (!cf || t.categoryId===cf) &&
    (!tf || t.type===tf)
  );
  arr.sort((a,b) => {
    if (sf==='date-desc')   return b.date.localeCompare(a.date);
    if (sf==='date-asc')    return a.date.localeCompare(b.date);
    if (sf==='amount-desc') return b.amount-a.amount;
    if (sf==='amount-asc')  return a.amount-b.amount;
    if (sf==='category')    return cat(a.categoryId).name.localeCompare(cat(b.categoryId).name);
    return 0;
  });
  return arr;
}

function renderAllTxns() {
  const list  = document.getElementById('all-txn-list');
  const empty = document.getElementById('all-empty');
  const warn  = document.getElementById('limit-warning');
  const lim   = parseFloat(S.prefs.limit)||0;
  const arr   = getFiltered();
  list.innerHTML = '';
  if (!arr.length) { empty.style.display=''; } else { empty.style.display='none'; arr.forEach(t=>list.appendChild(buildRow(t))); }
  const hasOver = lim>0 && arr.some(t=>t.type==='expense'&&t.amount>lim);
  warn.classList.toggle('hidden', !hasOver);
  if (hasOver) document.getElementById('limit-display').textContent = fmt(lim);
}

/* ─── Render Hero ────────────────────────── */
function renderHero() {
  const inc = S.transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const exp = S.transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const bal = inc - exp;
  const balEl = document.getElementById('hero-balance');
  const tgt = (bal<0?'-':'') + fmt(Math.abs(bal));
  countUp(balEl, tgt);
  document.getElementById('stat-income-val').textContent    = fmt(inc);
  document.getElementById('stat-expense-val').textContent   = fmt(exp);
  document.getElementById('stat-income-count').textContent  = S.transactions.filter(t=>t.type==='income').length + ' entries';
  document.getElementById('stat-expense-count').textContent = S.transactions.filter(t=>t.type==='expense').length + ' entries';
  document.getElementById('txn-count').textContent          = S.transactions.length;
}

/* ─── Pie Chart ──────────────────────────── */
let _pieRaf = null;
function renderPie() {
  const canvas = document.getElementById('pie-chart');
  const empty  = document.getElementById('pie-empty');
  const legend = document.getElementById('pie-legend');
  const center = document.getElementById('pie-center');
  const layout = document.getElementById('pie-layout');
  const exps   = S.transactions.filter(t=>t.type==='expense');

  if (!exps.length) {
    empty.style.display=''; layout.style.display='none'; return;
  }
  empty.style.display='none'; layout.style.display='';

  const bycat = {};
  exps.forEach(t => { bycat[t.categoryId]=(bycat[t.categoryId]||0)+t.amount; });
  const total   = Object.values(bycat).reduce((s,v)=>s+v,0);
  const entries = Object.entries(bycat).sort((a,b)=>b[1]-a[1]).map(([id,val])=>({c:cat(id),val}));

  legend.innerHTML = entries.map(e=>`
    <div class="leg-item">
      <div class="leg-dot" style="background:${e.c.color}"></div>
      <div class="leg-name">${e.c.icon} ${e.c.name}</div>
      <div class="leg-pct">${((e.val/total)*100).toFixed(0)}%</div>
    </div>`).join('');

  center.innerHTML = `<div class="pcl-a">${fmt(total)}</div><div class="pcl-l">Total</div>`;

  if (_pieRaf) cancelAnimationFrame(_pieRaf);
  const t0=performance.now(), dur=850;
  const dark = document.documentElement.getAttribute('data-theme')==='dark';

  const draw = progress => {
    const dpr = window.devicePixelRatio||1;
    const sz  = canvas.offsetWidth||170;
    canvas.width  = sz*dpr; canvas.height = sz*dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,sz,sz);
    const cx=sz/2, cy=sz/2, r=cx*.87, ir=r*.56;
    let a = -Math.PI/2;
    entries.forEach(e=>{
      const sl=(e.val/total)*Math.PI*2*progress;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,a,a+sl); ctx.closePath();
      ctx.fillStyle=e.c.color; ctx.fill(); a+=sl;
    });
    ctx.beginPath(); ctx.arc(cx,cy,ir,0,Math.PI*2);
    ctx.fillStyle=dark?'#212521':'#FAFAF7'; ctx.fill();
  };

  const animate = now => {
    const p = Math.min((now-t0)/dur,1);
    draw(1-(Math.pow(1-p,3))*(1-p<0?0:1));
    if(p<1) _pieRaf=requestAnimationFrame(animate); else draw(1);
  };
  _pieRaf=requestAnimationFrame(animate);
}

/* ─── Bar Chart ──────────────────────────── */
let _barRaf = null;
function renderBar() {
  const canvas = document.getElementById('bar-chart');
  const empty  = document.getElementById('bar-empty');
  if (!S.transactions.length) { empty.style.display=''; canvas.style.display='none'; return; }
  empty.style.display='none'; canvas.style.display='';

  const months=[];
  for(let i=5;i>=0;i--){
    const d=new Date(); d.setMonth(d.getMonth()-i);
    months.push({
      key:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`,
      lbl:d.toLocaleString('default',{month:'short'}),
      inc:0, exp:0
    });
  }
  S.transactions.forEach(t=>{
    const k=t.date?t.date.slice(0,7):'';
    const m=months.find(m=>m.key===k);
    if(m) m[t.type==='income'?'inc':'exp']+=t.amount;
  });
  const max=Math.max(...months.flatMap(m=>[m.inc,m.exp]),1);

  if(_barRaf) cancelAnimationFrame(_barRaf);
  const t0=performance.now(), dur=750;
  const dark=document.documentElement.getAttribute('data-theme')==='dark';

  const draw=prog=>{
    const dpr=window.devicePixelRatio||1;
    const W=canvas.offsetWidth||400, H=200;
    canvas.width=W*dpr; canvas.height=H*dpr;
    const ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,W,H);
    const pL=44,pR=12,pT=18,pB=34;
    const cW=W-pL-pR, cH=H-pT-pB, n=months.length;
    const gW=cW/n, bW=Math.min(gW*.3,18), gap=bW*.5;
    const gridC=dark?'#2C302C':'#E4DFD6';
    const lblC =dark?'#9AA097':'#9AA097';
    const incC =dark?'#7AB890':'#3A6647';
    const expC =dark?'#D98870':'#B05A3D';

    [0,.25,.5,.75,1].forEach(f=>{
      const y=pT+cH*(1-f);
      ctx.strokeStyle=gridC; ctx.lineWidth=.6;
      ctx.beginPath(); ctx.moveTo(pL,y); ctx.lineTo(pL+cW,y); ctx.stroke();
      if(f>0){
        ctx.fillStyle=lblC; ctx.font=`400 10px 'JetBrains Mono',monospace`;
        ctx.textAlign='right';
        ctx.fillText(Math.round(max*f).toLocaleString(),pL-5,y+3.5);
      }
    });

    months.forEach((m,i)=>{
      const cx=pL+i*gW+gW/2;
      const ih=(m.inc/max)*cH*prog, eh=(m.exp/max)*cH*prog;
      ctx.fillStyle=incC;
      ctx.beginPath();
      if(ctx.roundRect) ctx.roundRect(cx-gap-bW,pT+cH-ih,bW,ih,[2,2,0,0]); else ctx.rect(cx-gap-bW,pT+cH-ih,bW,ih);
      ctx.fill();
      ctx.fillStyle=expC;
      ctx.beginPath();
      if(ctx.roundRect) ctx.roundRect(cx+gap,pT+cH-eh,bW,eh,[2,2,0,0]); else ctx.rect(cx+gap,pT+cH-eh,bW,eh);
      ctx.fill();
      ctx.fillStyle=lblC; ctx.font=`400 11px 'Outfit',sans-serif`;
      ctx.textAlign='center';
      ctx.fillText(m.lbl,cx,H-pB+16);
    });
  };

  const animate=now=>{
    const p=Math.min((now-t0)/dur,1), e=1-Math.pow(1-p,3);
    draw(e);
    if(p<1) _barRaf=requestAnimationFrame(animate);
  };
  _barRaf=requestAnimationFrame(animate);
}

/* ─── Budget Tab ─────────────────────────── */
function renderBudget() {
  const budget = parseFloat(S.prefs.budget)||0;
  const m      = mon();
  const spent  = S.transactions.filter(t=>t.type==='expense'&&t.date&&t.date.startsWith(m)).reduce((s,t)=>s+t.amount,0);
  const inp    = document.getElementById('budget-input');
  if (!inp.value && budget) inp.value = budget.toFixed(2);

  document.getElementById('budget-spent').textContent = fmt(spent);
  document.getElementById('budget-total').textContent = fmt(budget);

  const pct  = budget>0 ? Math.min(spent/budget*100,100) : 0;
  const fill = document.getElementById('budget-fill');
  fill.style.width = pct.toFixed(1)+'%';
  fill.className   = 'bfill'+(pct>=100?' danger':pct>=80?' warn':'');

  const rem = budget - spent;
  document.getElementById('budget-pct').textContent = pct.toFixed(0)+'% used';
  document.getElementById('budget-rem').textContent = budget>0
    ? (rem>=0 ? fmt(rem)+' remaining' : fmt(Math.abs(rem))+' over budget') : '';

  // Breakdown
  const bd    = document.getElementById('cat-breakdown');
  const bempty= document.getElementById('breakdown-empty');
  const exps  = S.transactions.filter(t=>t.type==='expense'&&t.date&&t.date.startsWith(m));
  if (!exps.length) { bd.innerHTML=''; bempty.style.display=''; return; }
  bempty.style.display='none';
  const bycat={};
  exps.forEach(t=>{ bycat[t.categoryId]=(bycat[t.categoryId]||0)+t.amount; });
  const tot=Object.values(bycat).reduce((s,v)=>s+v,0);
  bd.innerHTML=Object.entries(bycat).sort((a,b)=>b[1]-a[1]).map(([id,val])=>{
    const c=cat(id), p=tot>0?(val/tot*100):0;
    return `<div class="cbd-item">
      <div class="cbd-head">
        <span class="cbd-name"><span>${c.icon}</span><span>${c.name}</span></span>
        <span class="cbd-amt">${fmt(val)} <span style="opacity:.5">(${p.toFixed(0)}%)</span></span>
      </div>
      <div class="cbd-track"><div class="cbd-fill" style="width:${p.toFixed(1)}%;background:${c.color}"></div></div>
    </div>`;
  }).join('');
}

/* ─── Categories Drawer List ─────────────── */
function renderCatsList() {
  const el = document.getElementById('cats-list');
  if (!S.categories.length) { el.innerHTML='<p style="font-size:.8rem;color:var(--fg-low);text-align:center;padding:1rem">No categories.</p>'; return; }
  el.innerHTML = S.categories.map(c=>`
    <div class="cat-row" data-id="${c.id}">
      <div class="cat-dot" style="background:${c.color}"></div>
      <div class="cat-emoji">${c.icon||''}</div>
      <div class="cat-lbl">${esc(c.name)}</div>
      <span class="cat-badge ${c.type}">${c.type}</span>
      <div class="cat-acts">
        <button class="act-btn edit" data-cid="${c.id}" title="Edit" aria-label="Edit">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="act-btn del" data-cid="${c.id}" title="Delete" aria-label="Delete">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        </button>
      </div>
    </div>`).join('');
}

/* ─── Full Render ────────────────────────── */
let _txnType = 'expense';
function renderAll() {
  renderHero();
  renderRecent();
  renderAllTxns();
  renderPie();
  renderBar();
  renderBudget();
  fillCatSelects(_txnType);
}

/* ─── Tab Switch ─────────────────────────── */
function switchTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const panel=document.getElementById('tab-'+name);
  if(panel) panel.classList.add('active');
  const btn=document.querySelector(`[data-tab="${name}"]`);
  if(btn) btn.classList.add('active');
  if(name==='budget') renderBudget();
  if(name==='transactions') renderAllTxns();
  if(name==='dashboard'){ renderPie(); renderBar(); renderRecent(); }
}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
document.addEventListener('click',e=>{
  const l=e.target.closest('[data-tab-link]');
  if(l) switchTab(l.dataset.tabLink);
});

/* ─── Transaction Form ───────────────────── */
let _editTxnId = null;

function setTxnType(type) {
  _txnType = type;
  document.querySelectorAll('#type-toggle .pill').forEach(b=>b.classList.toggle('active',b.dataset.type===type));
  fillCatSelects(type);
}

function resetTxnForm() {
  document.getElementById('txn-form').reset();
  document.getElementById('txn-date').value = today();
  document.getElementById('txn-edit-id').value = '';
  document.getElementById('form-btn-label').textContent = 'Add Transaction';
  document.getElementById('form-cancel').style.display = 'none';
  _editTxnId = null;
  setTxnType('expense');
}

document.querySelectorAll('#type-toggle .pill').forEach(b=>b.addEventListener('click',()=>setTxnType(b.dataset.type)));

document.getElementById('txn-form').addEventListener('submit', e=>{
  e.preventDefault();
  const name   = document.getElementById('txn-name').value.trim();
  const amount = parseFloat(document.getElementById('txn-amount').value);
  const catId  = document.getElementById('txn-category').value;
  const date   = document.getElementById('txn-date').value;
  const editId = document.getElementById('txn-edit-id').value;
  if (!name || !amount || amount<=0 || !catId || !date) { toast('Fill in all fields correctly.','err'); return; }
  if (editId) {
    const i=S.transactions.findIndex(t=>t.id===editId);
    if(i>-1) S.transactions[i]={...S.transactions[i],name,amount,categoryId:catId,date,type:_txnType};
    toast('Transaction updated.','ok');
  } else {
    S.transactions.unshift({id:uid(),name,amount,categoryId:catId,date,type:_txnType});
    toast('Transaction added.','ok');
  }
  resetTxnForm(); saveState(); renderAll();
});

document.getElementById('form-cancel').addEventListener('click', resetTxnForm);

/* ─── Edit / Delete Transactions ────────── */
function editTxn(id) {
  const t=S.transactions.find(x=>x.id===id); if(!t) return;
  document.getElementById('txn-name').value    = t.name;
  document.getElementById('txn-amount').value  = t.amount;
  document.getElementById('txn-date').value    = t.date;
  document.getElementById('txn-edit-id').value = t.id;
  document.getElementById('form-btn-label').textContent = 'Update Transaction';
  document.getElementById('form-cancel').style.display  = '';
  _editTxnId = t.id;
  setTxnType(t.type);
  setTimeout(()=>{ document.getElementById('txn-category').value=t.categoryId; },10);
  document.getElementById('txn-form').scrollIntoView({behavior:'smooth',block:'center'});
  switchTab('dashboard');
}

async function deleteTxn(id) {
  const ok = await confirm('Delete Transaction?','This action cannot be undone.');
  if (!ok) return;
  const row=document.querySelector(`.txn-row[data-id="${id}"]`);
  if(row){ row.style.animation='rowOut .22s ease-in forwards'; await new Promise(r=>setTimeout(r,230)); }
  S.transactions=S.transactions.filter(t=>t.id!==id);
  saveState(); renderAll(); toast('Deleted.');
}

document.addEventListener('click',e=>{
  const eb=e.target.closest('.act-btn.edit[data-id]');
  const db=e.target.closest('.act-btn.del[data-id]');
  if(eb) editTxn(eb.dataset.id);
  if(db) deleteTxn(db.dataset.id);
});

/* ─── Filters ────────────────────────────── */
['filter-search','filter-category','filter-type','filter-sort'].forEach(id=>{
  document.getElementById(id).addEventListener('input',  renderAllTxns);
  document.getElementById(id).addEventListener('change', renderAllTxns);
});

/* ─── Budget ─────────────────────────────── */
document.getElementById('budget-save-btn').addEventListener('click',()=>{
  const v=parseFloat(document.getElementById('budget-input').value);
  if(isNaN(v)||v<0){ toast('Enter a valid amount.','err'); return; }
  S.prefs.budget=v; saveState(); renderBudget(); toast('Budget saved.','ok');
});

/* ─── Drawer ─────────────────────────────── */
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow='hidden';
  applyPrefs(); renderCatsList();
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow='';
}
document.getElementById('settings-open').addEventListener('click', openDrawer);
document.getElementById('settings-close').addEventListener('click', closeDrawer);
document.getElementById('overlay').addEventListener('click', closeDrawer);

document.querySelectorAll('.dtab').forEach(t=>t.addEventListener('click',()=>{
  document.querySelectorAll('.dtab').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.dpanel').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
  document.getElementById('dpanel-'+t.dataset.dtab).classList.add('active');
}));

/* ─── Theme Toggle ───────────────────────── */
document.getElementById('theme-toggle').addEventListener('click',()=>{
  S.prefs.theme = document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';
  saveState(); applyPrefs(); renderPie(); renderBar();
});
document.querySelectorAll('[data-thv]').forEach(b=>b.addEventListener('click',()=>{
  S.prefs.theme=b.dataset.thv; applyPrefs(); renderPie(); renderBar();
}));
document.querySelectorAll('.sw').forEach(s=>s.addEventListener('click',()=>{
  S.prefs.accent=s.dataset.ac; applyPrefs(); renderPie(); renderBar();
}));

/* ─── Save Prefs ─────────────────────────── */
document.getElementById('s-save').addEventListener('click',()=>{
  S.prefs.appName  = document.getElementById('s-appname').value.trim()  || 'Ledger';
  S.prefs.currency = document.getElementById('s-currency').value.trim() || '€';
  S.prefs.limit    = parseFloat(document.getElementById('s-limit').value)||0;
  saveState(); applyPrefs(); renderAll(); toast('Preferences saved.','ok'); closeDrawer();
});

/* ─── Clear All ──────────────────────────── */
document.getElementById('s-clear').addEventListener('click', async()=>{
  const ok=await confirm('Clear All Data?','Everything will be deleted permanently.');
  if(!ok) return;
  localStorage.removeItem('ledger_v2');
  S={transactions:[],categories:[...DEF_CATS],prefs:{...DEF_PREFS}};
  saveState(); applyPrefs(); renderAll(); closeDrawer(); toast('All data cleared.');
});

/* ─── Category Form ──────────────────────── */
let _catType='expense', _editCatId=null;

function setCatType(type){
  _catType=type;
  document.querySelectorAll('#cat-type-toggle .pill').forEach(b=>b.classList.toggle('active',b.dataset.ct===type));
}
document.querySelectorAll('#cat-type-toggle .pill').forEach(b=>b.addEventListener('click',()=>setCatType(b.dataset.ct)));

function resetCatForm(){
  document.getElementById('cat-form').reset();
  document.getElementById('cat-color').value='#4A5D4E';
  document.getElementById('cat-edit-id').value='';
  document.getElementById('cat-btn-lbl').textContent='Add Category';
  document.getElementById('cat-cancel').classList.add('hidden');
  _editCatId=null; setCatType('expense');
}

document.getElementById('cat-form').addEventListener('submit',e=>{
  e.preventDefault();
  const name  = document.getElementById('cat-name').value.trim();
  const icon  = document.getElementById('cat-icon').value.trim()||'•';
  const color = document.getElementById('cat-color').value;
  const editId= document.getElementById('cat-edit-id').value;
  if(!name){ toast('Enter a category name.','err'); return; }
  if(editId){
    const i=S.categories.findIndex(c=>c.id===editId);
    if(i>-1) S.categories[i]={...S.categories[i],name,icon,color,type:_catType};
    toast('Category updated.','ok');
  } else {
    if(S.categories.find(c=>c.name.toLowerCase()===name.toLowerCase())){ toast('Name already exists.','err'); return; }
    S.categories.push({id:uid(),name,icon,color,type:_catType});
    toast('Category added.','ok');
  }
  resetCatForm(); saveState(); renderCatsList(); fillCatSelects(_txnType);
});

document.getElementById('cat-cancel').addEventListener('click', resetCatForm);

document.getElementById('cats-list').addEventListener('click', async e=>{
  const eb=e.target.closest('.act-btn.edit[data-cid]');
  const db=e.target.closest('.act-btn.del[data-cid]');
  if(eb){
    const c=S.categories.find(x=>x.id===eb.dataset.cid); if(!c) return;
    document.getElementById('cat-name').value  =c.name;
    document.getElementById('cat-icon').value  =c.icon||'';
    document.getElementById('cat-color').value =c.color||'#4A5D4E';
    document.getElementById('cat-edit-id').value=c.id;
    document.getElementById('cat-btn-lbl').textContent='Update Category';
    document.getElementById('cat-cancel').classList.remove('hidden');
    _editCatId=c.id; setCatType(c.type);
  }
  if(db){
    const cid=db.dataset.cid;
    if(S.transactions.some(t=>t.categoryId===cid)){ toast('Category is in use — cannot delete.','err'); return; }
    const ok=await confirm('Delete Category?','This category will be removed.');
    if(!ok) return;
    S.categories=S.categories.filter(c=>c.id!==cid);
    saveState(); renderCatsList(); fillCatSelects(_txnType); toast('Category deleted.');
  }
});

/* ─── Keyboard ───────────────────────────── */
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ closeDrawer(); document.getElementById('modal-bg').classList.add('hidden'); }
});

/* ─── Resize ─────────────────────────────── */
let _resizeT;
window.addEventListener('resize',()=>{ clearTimeout(_resizeT); _resizeT=setTimeout(()=>{ renderPie(); renderBar(); },180); });

/* ─── Boot ───────────────────────────────── */
(function boot(){
  loadState();
  applyPrefs();
  document.getElementById('txn-date').value = today();
  fillCatSelects('expense');
  renderAll();
})();
