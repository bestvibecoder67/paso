(function () {
  'use strict';
  const C = window.COURSE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a, n) => shuffle(a).slice(0, n);
  const rand = a => a[Math.floor(Math.random() * a.length)];
  const PUNCT = /[¿¡.,!?;:"«»„“”]/g;
  const norm = s => s.toLowerCase().replace(PUNCT, ' ').replace(/\s+/g, ' ').trim();
  const strip = s => s.normalize('NFD').replace(/\p{M}/gu, '');
  const tok = s => s.replace(PUNCT, '').split(/\s+/).filter(Boolean);

  // ---------- course index ----------
  const ITEMS = [], DICT = {};
  const LESSONS = [];
  C.units.forEach(u => u.lessons.forEach(l => {
    l.unit = u; l.items = []; LESSONS.push(l);
    const add = it => {
      it.lesson = l; it.unit = u; it.alt = it.alt || [];
      if (it.type === 'word') {
        const m = it.es.match(/^(el|la|los|las)\s+(.+)$/i);
        if (m) it.alt = it.alt.concat([m[2]]);
        DICT[it.es.toLowerCase()] = it.lt;
        if (m) DICT[m[2].toLowerCase()] = it.lt;
      }
      l.items.push(it); ITEMS.push(it);
    };
    l.words.forEach((w, i) => add({ id: l.id + ':w' + i, type: 'word', es: w[0], lt: w[1], alt: w[2] }));
    l.sentences.forEach((s, i) => add({ id: l.id + ':s' + i, type: 'sent', es: s[0], lt: s[1], alt: s[2] }));
  }));
  const BY_ID = Object.fromEntries(ITEMS.map(i => [i.id, i]));
  const STORIES = (window.STORIES || []).filter(s => s && s.lines && C.units.some(u => u.id === s.unit));
  const storyOf = uid => STORIES.find(s => s.unit === uid);
  const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * f)); return `rgb(${c.join(',')})`; };

  // ---------- storage ----------
  const KEY = 'paso.v1';
  const DEF = { xp: 0, streak: 0, best: 0, lastDay: null, freezes: 1, goal: 10, lastSeen: null, weekStar: null, dayXp: {}, done: {}, legendary: {}, stories: {}, srs: {}, lostStreak: 0, repairMonth: null, sound: true };
  let S = load();
  function load() {
    const d = JSON.parse(JSON.stringify(DEF));
    try { return Object.assign(d, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return d; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode */ } }

  // ---------- dates & streak ----------
  const dk = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = () => dk(new Date());
  const addDays = (key, n) => { const d = new Date(key + 'T12:00:00'); d.setDate(d.getDate() + n); return dk(d); };
  const diffDays = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
  const month = () => today().slice(0, 7);

  function checkStreak() {
    if (!S.lastDay || S.streak === 0) return;
    const gap = diffDays(S.lastDay, today());
    if (gap <= 1) return;
    const missed = gap - 1;
    if (S.freezes >= missed) {
      S.freezes -= missed; S.lastDay = addDays(today(), -1);
      setTimeout(() => toast(`❄️ Serijos apsauga išsaugojo tavo ${S.streak} d. seriją!`), 400);
    } else { S.lostStreak = S.streak; S.streak = 0; }
    save();
  }
  function award(xp) {
    const t = today();
    S.xp += xp; S.dayXp[t] = (S.dayXp[t] || 0) + xp;
    let extended = false, freezeEarned = false;
    if (S.lastDay !== t) {
      const gap = S.lastDay ? diffDays(S.lastDay, t) : 99;
      S.streak = gap === 1 ? S.streak + 1 : 1;
      S.lastDay = t; extended = true;
      if (S.streak % 7 === 0 && S.freezes < 2) { S.freezes++; freezeEarned = true; }
    }
    S.best = Math.max(S.best, S.streak);
    save();
    return { extended, freezeEarned };
  }
  const canRepair = () => S.lostStreak > 1 && S.repairMonth !== month();

  // ---------- spaced repetition (Leitner boxes) ----------
  const INTERVALS = [0, 1, 2, 4, 7, 15, 30, 60];
  function srsUpdate(id, ok) {
    const r = S.srs[id] || { b: 0, due: today(), w: 0, seen: 0 };
    r.seen++;
    if (ok) r.b = Math.min(r.b + 1, INTERVALS.length - 1);
    else { r.b = 0; r.w++; r.lw = Date.now(); }
    r.due = addDays(today(), INTERVALS[r.b]);
    S.srs[id] = r;
  }
  const seenItems = () => Object.keys(S.srs).filter(id => BY_ID[id]).map(id => BY_ID[id]);
  const dueItems = () => seenItems().filter(it => S.srs[it.id].due <= today()).sort((a, b) => S.srs[a.id].b - S.srs[b.id].b);
  const mistakeItems = () => seenItems().filter(it => S.srs[it.id].w > 0 && S.srs[it.id].b < 3).sort((a, b) => (S.srs[b.id].lw || 0) - (S.srs[a.id].lw || 0));

  // ---------- audio ----------
  const HAS_TTS = 'speechSynthesis' in window;
  let VOICE = null;
  function pickVoice() { const vs = speechSynthesis.getVoices(); VOICE = vs.find(v => v.lang === 'es-ES') || vs.find(v => /^es/i.test(v.lang)) || null; }
  if (HAS_TTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  // Natural voice: pre-recorded clips per unit (audio/<unit>.json), loaded on demand.
  const AUDIO = {}, PACKS = {};
  function loadPack(uid) {
    if (!PACKS[uid]) PACKS[uid] = fetch(`audio/${uid}.json`).then(r => r.ok ? r.json() : {}).then(d => { Object.assign(AUDIO, d); }).catch(() => { delete PACKS[uid]; });
    return PACKS[uid];
  }
  const loadPacks = (uids, ms = 3000) => Promise.race([Promise.all([...new Set(uids)].map(loadPack)), new Promise(r => setTimeout(r, ms))]);
  const player = new Audio();
  function playClip(clip, slow) {
    if (HAS_TTS) speechSynthesis.cancel();
    player.pause();
    player.src = 'data:audio/mpeg;base64,' + clip;
    player.defaultPlaybackRate = player.playbackRate = slow ? 0.7 : 1;
    player.preservesPitch = true;
    player.play().catch(() => {});
  }
  // iPhone only allows audio that was first started inside a tap
  function unlockAudio() {
    player.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    player.play().catch(() => {});
  }
  function playKey(key, text, slow) { if (AUDIO[key]) playClip(AUDIO[key], slow); else speak(text, slow); }
  function speak(text, slow) {
    const clip = AUDIO[text.trim().toLowerCase()];
    if (clip) return playClip(clip, slow);
    if (!HAS_TTS) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES'; if (VOICE) u.voice = VOICE; u.rate = slow ? 0.6 : 0.95;
    speechSynthesis.speak(u);
  }
  let AC;
  function beep(ok) {
    if (!S.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = AC.currentTime;
      (ok ? [660, 990] : [260, 200]).forEach((f, i) => {
        const o = AC.createOscillator(), g = AC.createGain(), t = t0 + i * 0.11;
        o.type = ok ? 'sine' : 'triangle'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        o.connect(g).connect(AC.destination); o.start(t); o.stop(t + 0.22);
      });
    } catch (e) { /* no audio */ }
  }

  // ---------- ui helpers ----------
  let toastT;
  function toast(msg) { const t = $('#toast'); t.innerHTML = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
  function sheet(html, wire) {
    const s = document.createElement('div'); s.className = 'scrim';
    s.innerHTML = `<div class="sheet">${html}</div>`;
    s.addEventListener('click', e => { if (e.target === s || e.target.closest('[data-close]')) s.remove(); });
    document.body.appendChild(s); if (wire) wire(s, () => s.remove());
  }
  function ask(msg, okLabel, onOk, danger) {
    sheet(`<h2>${esc(msg)}</h2><div class="meta"></div><button class="btn ${danger ? 'red' : ''}" id="ok">${esc(okLabel)}</button><button class="btn ghost" data-close>Atšaukti</button>`,
      (s, close) => { $('#ok', s).onclick = () => { close(); onOk(); }; });
  }
  const spk = text => HAS_TTS ? `<button class="spk" data-say="${esc(text)}" aria-label="Klausyti">🔊</button>` : '';
  function hintify(text) {
    return text.split(/(\s+)/).map(t => {
      const core = t.replace(PUNCT, '').toLowerCase();
      return DICT[core] ? `<span class="hint" data-h="${esc(DICT[core])}">${esc(t)}</span>` : esc(t);
    }).join('');
  }
  document.addEventListener('click', e => {
    const k = e.target.closest('[data-key]'); if (k) { playKey(k.dataset.key, k.dataset.say || '', k.dataset.slow === '1'); return; }
    const b = e.target.closest('[data-say]'); if (b) { speak(b.dataset.say, b.dataset.slow === '1'); return; }
    const h = e.target.closest('.hint');
    $$('.hint.show').forEach(x => x !== h && x.classList.remove('show'));
    if (h) h.classList.toggle('show');
  });
  function showTip(unit) { sheet(`<h2>📘 ${esc(unit.title)}</h2><div class="meta">Gramatikos gidas</div>${unit.tip}<button class="btn" data-close>Supratau</button>`); }

  // ---------- navigation ----------
  let TAB = 'path';
  const app = $('#app');
  function render() { if (TAB === 'path') renderPath(); else if (TAB === 'practice') renderPractice(); else renderProfile(); window.scrollTo(0, 0); }
  function topBar() {
    const dayXp = S.dayXp[today()] || 0, pct = Math.min(100, dayXp / S.goal * 100);
    return `<div class="top"><div class="stats">
      <div class="stat">🇪🇸 Ispanų</div>
      <div class="stat fire ${S.lastDay === today() ? '' : 'off'}">🔥 ${S.streak}</div>
      <div class="stat ice">❄️ ${S.freezes}</div>
      <div class="stat xp">⚡ ${S.xp}</div></div>
      <div class="goal">Dienos tikslas<div class="bar"><div style="width:${pct}%"></div></div>${dayXp}/${S.goal} XP</div></div>`;
  }
  function navBar() {
    const due = dueItems().length;
    const b = (id, ic, label) => `<button data-tab="${id}" class="${TAB === id ? 'on' : ''}"><span>${ic}</span>${label}</button>`;
    return `<nav class="nav"><div class="nav-in">${b('path', '🗺️', 'Kelias')}${b('practice', '🏋️', 'Kartoti' + (due ? ` (${due})` : ''))}${b('profile', '👤', 'Profilis')}</div></nav>`;
  }
  function wireNav() { $$('[data-tab]').forEach(b => b.onclick = () => { TAB = b.dataset.tab; render(); }); }

  // ---------- path screen ----------
  const OFFSETS = [0, 55, 80, 55, 0, -55, -80, -55];
  function renderPath() {
    const currentIdx = LESSONS.findIndex(l => !S.done[l.id]);
    let h = topBar() + '<main>' + todayCard(currentIdx), n = 0;
    if (canRepair() && S.streak < S.lostStreak) {
      h += `<div class="card" style="margin-top:16px"><div class="ic">🩹</div><div class="tx"><b>Atkurk ${S.lostStreak} d. seriją</b><span>Viena nemokama atkūrimo galimybė per mėnesį</span></div><button class="pill" id="repair">Atkurti</button></div>`;
    }
    C.units.forEach((u, ui) => {
      const cd = shade(u.color, 0.78);
      h += `<section class="unit"><div class="unit-h" style="background:${u.color}"><div class="t"><small>${ui + 1} SKYRIUS</small><b>${esc(u.title)}</b><span class="d">${esc(u.desc)}</span></div><button class="guide" data-guide="${u.id}">📘 Gidas</button></div><div class="path">`;
      u.lessons.forEach(l => {
        const gi = LESSONS.indexOf(l), done = S.done[l.id] || 0;
        const locked = gi > 0 && !S.done[LESSONS[gi - 1].id];
        const cur = gi === currentIdx;
        const cls = locked ? 'locked' : done ? 'done' : cur ? 'current' : '';
        const dots = Array.from({ length: 5 }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('');
        h += `<div class="node-wrap" style="transform:translateX(${OFFSETS[n++ % OFFSETS.length]}px)">${cur ? '<div class="bubble">PRADĖK</div>' : ''}
          <button class="node ${cls}" style="--c:${u.color};--cd:${cd}" data-lesson="${l.id}">${locked ? '🔒' : done >= 5 ? '👑' : l.icon}</button>
          <div class="dots">${dots}</div><div class="lbl">${esc(l.title)}</div></div>`;
      });
      const unitDone = u.lessons.every(l => S.done[l.id]);
      const st = storyOf(u.id);
      if (st) {
        const read = S.stories[st.id];
        h += `<div class="node-wrap" style="transform:translateX(${OFFSETS[n++ % OFFSETS.length]}px)">${unitDone && !read ? '<div class="bubble">ISTORIJA</div>' : ''}
          <button class="node ${read ? 'story' : unitDone ? 'story fresh' : 'locked'}" style="--c:${u.color};--cd:${cd}" data-story="${st.id}">${unitDone || read ? st.icon : '📖'}</button>
          <div class="lbl">${esc(st.title)}</div></div>`;
      }
      const leg = S.legendary[u.id];
      h += `<div class="node-wrap" style="transform:translateX(${OFFSETS[n++ % OFFSETS.length]}px)">
        <button class="node ${leg ? 'legend' : unitDone ? '' : 'locked'}" style="--c:${u.color};--cd:${cd}" data-legend="${u.id}">🏆</button>
        <div class="lbl">${leg ? 'Legendinis ✓' : 'Legendinis lygis'}</div></div></div></section>`;
    });
    h += `<p class="sub" style="text-align:center;margin-top:30px">Daugiau skyrių – greitai 🚧</p></main>` + navBar();
    app.innerHTML = h; wireNav();
    $$('[data-guide]').forEach(b => b.onclick = () => showTip(C.units.find(u => u.id === b.dataset.guide)));
    $$('[data-lesson]').forEach(b => b.onclick = () => lessonSheet(LESSONS.find(l => l.id === b.dataset.lesson)));
    $$('[data-legend]').forEach(b => b.onclick = () => legendSheet(C.units.find(u => u.id === b.dataset.legend)));
    $$('[data-story]').forEach(b => b.onclick = () => storySheet(STORIES.find(s => s.id === b.dataset.story)));
    const q = $('#quick'); if (q) q.onclick = () => q.dataset.lesson ? startLesson(LESSONS.find(l => l.id === q.dataset.lesson)) : startQuick(q.dataset.welcome === '1');
    const r = $('#repair'); if (r) r.onclick = () => {
      S.streak = S.lostStreak + S.streak; S.best = Math.max(S.best, S.streak); S.lostStreak = 0; S.repairMonth = month();
      if (S.lastDay !== today()) S.lastDay = addDays(today(), -1);
      save(); toast(`🔥 Serija atkurta: ${S.streak} d.!`); render();
    };
    const c = $('.node.current'); if (c) setTimeout(() => c.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
  }
  // ---------- daily nudge: one tap, one minute ----------
  function weekInfo() {
    const mon = addDays(today(), -((new Date().getDay() + 6) % 7));
    const week = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
    return { mon, week, n: week.filter(d => (S.dayXp[d] || 0) > 0).length };
  }
  function todayCard(currentIdx) {
    const { week, n } = weekInfo(), done = S.lastDay === today();
    const dots = `<div class="wdots">${week.map((d, i) => `<i class="${(S.dayXp[d] || 0) > 0 ? 'on' : ''} ${d === today() ? 'now' : ''}">${DAYS[(i + 1) % 7]}</i>`).join('')}</div><div class="wlabel">Šią savaitę: ${n}/7 d.</div>`;
    let title, sub, btn, attrs = '', ghost = false;
    const next = LESSONS[currentIdx];
    if (done) { title = 'Diena įskaityta ✓'; sub = ''; btn = 'Dar 1 minutė'; ghost = true; }
    else if (seenItems().length < 3 && next) { title = `Kita pamoka: „${esc(next.title)}“`; sub = esc(next.unit.title); btn = 'Pradėti pamoką'; attrs = `data-lesson="${next.id}"`; }
    else if (AWAY >= 2) { title = 'Sveika sugrįžusi! 🌱'; sub = 'Pradėkim lengvai: 5 žodžiai, kuriuos jau žinai.'; btn = 'Pradėti (1 min.)'; attrs = 'data-welcome="1"'; }
    else { title = 'Tavo šiandienos minutė'; sub = '5 trumpi pratimai – užteks vienos minutės.'; btn = 'Pradėti (1 min.)'; }
    return `<div class="today ${done ? 'done' : ''}"><div class="today-t"><b>${title}</b>${sub ? `<span>${sub}</span>` : ''}</div>${dots}
      <button class="btn ${ghost ? 'ghost small' : ''}" id="quick" ${attrs}>${btn}</button></div>`;
  }
  const quickKinds = it => it.type === 'word' ? ['mcLt', 'mcEs', 'listenPick'] : ['bankEs', 'bankLt'];
  function startQuick(welcome) {
    let q;
    if (welcome) q = seenItems().filter(i => i.type === 'word').sort((a, b) => S.srs[b.id].b - S.srs[a.id].b).slice(0, 5).map(it => exFor(it, ['mcLt', 'mcEs', 'listenPick']));
    else {
      const ids = new Set(), list = [];
      for (const it of [...dueItems(), ...mistakeItems(), ...shuffle(seenItems())]) { if (!ids.has(it.id)) { ids.add(it.id); list.push(it); } if (list.length === 5) break; }
      q = list.map(it => exFor(it, quickKinds(it)));
    }
    if (!q.length) { const l = LESSONS.find(x => !S.done[x.id]) || LESSONS[0]; return startLesson(l); }
    startSession({ mode: 'quick', title: 'Minutė', queue: q });
  }
  // shared lines for result screens
  function winLines(extended, freezeEarned, goalHit) {
    const { mon, n } = weekInfo();
    let star = false;
    if (n >= 5 && S.weekStar !== mon) { S.weekStar = mon; save(); star = true; }
    const next = LESSONS.find(l => !S.done[l.id]);
    return (extended ? `<div class="streakmsg">🔥 ${S.streak} d. serija!</div><p class="sub" style="margin:0 0 6px">Diena įskaityta ✓<br>Rytoj: kartojimas${next ? ` ir pamoka „${esc(next.title)}“` : ''}</p>` : '')
      + (freezeEarned ? '<div class="streakmsg" style="color:var(--blue)">❄️ Gavai serijos apsaugą!</div>' : '')
      + (goalHit ? '<div class="streakmsg" style="color:var(--gold-d)">🎯 Dienos tikslas pasiektas!</div>' : '')
      + (star ? '<div class="streakmsg" style="color:var(--gold-d)">⭐ 5 dienos šią savaitę!</div>' : '');
  }
  function resultButtons(extended, homeTab) {
    const go = () => { TAB = homeTab; render(); };
    if (!extended) { $('.result .actions').innerHTML = '<button class="btn" id="home">Tęsti</button>'; $('#home').onclick = go; return; }
    $('.result .actions').innerHTML = '<button class="btn" id="more">Dar 1 minutė</button><button class="btn ghost" id="stop">Užteks šiandien</button>';
    $('#more').onclick = () => startQuick(false);
    $('#stop').onclick = () => { go(); toast('Iki rytojaus! 👋'); };
  }

  function lessonSheet(l) {
    const gi = LESSONS.indexOf(l), done = S.done[l.id] || 0;
    const locked = gi > 0 && !S.done[LESSONS[gi - 1].id];
    const words = l.words.map(w => w[0]).slice(0, 5).join(', ');
    sheet(`<h2>${l.icon} ${esc(l.title)}</h2><div class="meta">${esc(l.unit.title)} · Lygis ${Math.min(done, 5)}/5<br><small>${esc(words)}…</small></div>
      ${locked ? '<p class="sub">Ši pamoka dar užrakinta. Jei jau moki šią medžiagą, gali peršokti.</p><button class="btn ghost" id="go">Peršokti į priekį</button>'
        : `<button class="btn" id="go">${done ? (done >= 5 ? 'Kartoti +10 XP' : 'Kitas lygis +10 XP') : 'Pradėti +10 XP'}</button>`}`,
      (s, close) => { $('#go', s).onclick = () => { close(); startLesson(l); }; });
  }
  function legendSheet(u) {
    const unitDone = u.lessons.every(l => S.done[l.id]);
    sheet(`<h2>🏆 Legendinis lygis</h2><div class="meta">${esc(u.title)}</div>
      <p>Sunkiausi pratimai iš viso skyriaus: rašymas ir klausymas, be užuominų. Leidžiamos tik <b>3 klaidos</b>.</p>
      ${unitDone ? `<button class="btn legend" id="go">Pradėti +40 XP</button>` : '<p class="sub">Pirmiausia baik visas šio skyriaus pamokas.</p><button class="btn ghost" data-close>Gerai</button>'}`,
      (s, close) => { const g = $('#go', s); if (g) g.onclick = () => { close(); startLegend(u); }; });
  }

  // ---------- practice screen ----------
  function renderPractice() {
    const mis = mistakeItems(), due = dueItems(), seen = seenItems();
    [...new Set(seen.map(i => i.unit.id))].forEach(loadPack);
    const card = (id, ic, title, sub, n, dis) => `<button class="card" id="${id}" ${dis ? 'disabled' : ''}><div class="ic">${ic}</div><div class="tx"><b>${title}</b><span>${sub}</span></div>${n ? `<span class="pill">${n}</span>` : ''}</button>`;
    let h = topBar() + `<main><h1 class="page">Kartojimas</h1><p class="sub">Pratimai sudaromi pagal tavo klaidas ir tai, ką laikas pakartoti.</p>
      ${card('p-mis', '🎯', 'Klaidų taisymas', mis.length ? 'Žodžiai ir sakiniai, kuriuose suklydai' : 'Klaidų nėra – puiku!', mis.length, !mis.length)}
      ${card('p-due', '🧠', 'Šiandienos kartojimas', due.length ? 'Laikas pakartoti, kol nepamiršai' : 'Šiandien viskas pakartota', due.length, !due.length)}
      ${card('p-listen', '🎧', 'Klausymo treniruotė', HAS_TTS ? 'Klausyk ir rašyk' : 'Šis įrenginys nepalaiko balso', 0, !HAS_TTS || !seen.length)}
      ${card('p-mix', '🎲', 'Atsitiktinė treniruotė', 'Mišinys iš visko, ką išmokai', 0, !seen.length)}
      ${STORIES.length ? '<h1 class="page" style="font-size:20px">Istorijos</h1>' + STORIES.map(st => {
        const u = C.units.find(x => x.id === st.unit), open = u.lessons.every(l => S.done[l.id]) || S.stories[st.id];
        return `<button class="card" data-story="${st.id}"><div class="ic">${open ? st.icon : '🔒'}</div><div class="tx"><b>${esc(st.title)}</b><span>${esc(st.titleEs)} · ${esc(u.title)}</span></div>${S.stories[st.id] ? '<span class="pill" style="background:var(--green)">✓</span>' : ''}</button>`;
      }).join('') : ''}
      <h1 class="page" style="font-size:20px">Mano žodynas</h1><div class="box">`;
    const words = seen.filter(i => i.type === 'word').sort((a, b) => a.es.localeCompare(b.es, 'es'));
    if (!words.length) h += '<p class="sub" style="margin:14px 0">Čia atsiras išmokti žodžiai.</p>';
    words.forEach(w => {
      const b = S.srs[w.id].b, str = Math.min(5, b);
      h += `<div class="vocab"><div><div class="es">${esc(w.es)}</div><div class="lt">${esc(w.lt)}</div></div><div style="display:flex;gap:10px;align-items:center"><div class="str">${Array.from({ length: 5 }, (_, i) => `<i class="${i < str ? 'on' : ''}"></i>`).join('')}</div>${spk(w.es).replace('class="spk"', 'class="spk slow" style="width:36px;height:36px;font-size:16px;box-shadow:none"')}</div></div>`;
    });
    h += '</div></main>' + navBar();
    app.innerHTML = h; wireNav();
    const on = (id, fn) => { const b = $('#' + id); if (b) b.onclick = fn; };
    on('p-mis', () => startSession({ mode: 'practice', title: 'Klaidų taisymas', queue: itemsSession(mis.slice(0, 12), 12, practiceKinds) }));
    on('p-due', () => startSession({ mode: 'practice', title: 'Kartojimas', queue: itemsSession(due.slice(0, 12), 12, practiceKinds) }));
    on('p-listen', () => startSession({ mode: 'practice', title: 'Klausymas', queue: itemsSession(seen, 10, it => it.type === 'word' ? ['listenPick', 'listenType'] : ['listenType']) }));
    on('p-mix', () => startSession({ mode: 'practice', title: 'Treniruotė', queue: itemsSession(seen, 12, practiceKinds) }));
    $$('[data-story]').forEach(b => b.onclick = () => storySheet(STORIES.find(s => s.id === b.dataset.story)));
  }

  // ---------- profile screen ----------
  const DAYS = ['Sk', 'Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št'];
  function renderProfile() {
    const learned = seenItems().filter(i => S.srs[i.id].b >= 1 && i.type === 'word').length;
    const week = Array.from({ length: 7 }, (_, i) => addDays(today(), i - 6));
    const max = Math.max(S.goal, ...week.map(d => S.dayXp[d] || 0));
    const lessonsDone = LESSONS.filter(l => S.done[l.id]).length;
    let h = topBar() + `<main><h1 class="page">Profilis</h1>
      <div class="tiles">
        <div class="tile-s"><div class="ic">🔥</div><div><b>${S.streak}</b><span>dienų serija</span></div></div>
        <div class="tile-s"><div class="ic">🏅</div><div><b>${S.best}</b><span>ilgiausia serija</span></div></div>
        <div class="tile-s"><div class="ic">⚡</div><div><b>${S.xp}</b><span>XP iš viso</span></div></div>
        <div class="tile-s"><div class="ic">📚</div><div><b>${learned}</b><span>išmokti žodžiai</span></div></div>
        <div class="tile-s"><div class="ic">✅</div><div><b>${lessonsDone}/${LESSONS.length}</b><span>pamokos</span></div></div>
        <div class="tile-s"><div class="ic">❄️</div><div><b>${S.freezes}/2</b><span>serijos apsaugos</span></div></div>
      </div>
      <div class="box"><div class="row" style="border:none;padding-bottom:0"><b>Šios savaitės XP</b></div>
      <div class="week">${week.map(d => { const v = S.dayXp[d] || 0; return `<div class="${d === today() ? 'today' : ''}">${v || ''}<i style="height:${Math.max(3, v / max * 80)}px"></i>${DAYS[new Date(d + 'T12:00:00').getDay()]}</div>`; }).join('')}</div></div>
      <div class="box">
        <div class="row"><span>Dienos tikslas</span><div class="seg">${[10, 20, 30, 50].map(g => `<button data-goal="${g}" class="${S.goal === g ? 'on' : ''}">${g}</button>`).join('')}</div></div>
        <div class="row"><span>Garso efektai</span><div class="seg"><button id="snd" class="${S.sound ? 'on' : ''}">${S.sound ? 'Įjungta' : 'Išjungta'}</button></div></div>
        <div class="row"><span>Serijos apsauga</span><span class="sub" style="margin:0;font-size:13px">+1 už kas 7 dienas (iki 2)</span></div>
      </div>
      <div class="box">
        <div class="row"><span>Atsarginė kopija</span><div class="seg"><button id="exp">Išsaugoti</button><button id="imp">Įkelti</button></div></div>
        <div class="row"><span class="danger">Ištrinti visą progresą</span><button class="small-btn danger" id="reset">Ištrinti</button></div>
      </div></main>` + navBar();
    app.innerHTML = h; wireNav();
    $$('[data-goal]').forEach(b => b.onclick = () => { S.goal = +b.dataset.goal; save(); render(); });
    $('#snd').onclick = () => { S.sound = !S.sound; save(); render(); };
    $('#exp').onclick = () => sheet(`<h2>Atsarginė kopija</h2><div class="meta">Nukopijuok šį tekstą ir išsisaugok (pvz., užrašuose). Naujame telefone spausk „Įkelti“ ir įklijuok.</div>
      <textarea id="bk" readonly>${esc(JSON.stringify(S))}</textarea><div style="height:14px"></div><button class="btn" id="cp">Kopijuoti</button><button class="btn ghost" data-close>Uždaryti</button>`,
      s => { $('#cp', s).onclick = () => {
        const ta = $('#bk', s);
        const fallback = () => { ta.focus(); ta.select(); toast('Tekstas pažymėtas – nukopijuok jį'); };
        try { navigator.clipboard.writeText(ta.value).then(() => toast('Nukopijuota ✓'), fallback); } catch (err) { fallback(); }
      }; });
    $('#imp').onclick = () => sheet(`<h2>Įkelti progresą</h2><div class="meta">Įklijuok anksčiau nukopijuotą atsarginės kopijos tekstą.</div>
      <textarea id="bkin" placeholder="{&quot;xp&quot;: ...}"></textarea><div style="height:14px"></div><button class="btn" id="ld">Įkelti</button><button class="btn ghost" data-close>Atšaukti</button>`,
      (s, close) => { $('#ld', s).onclick = () => {
        try { const d = JSON.parse($('#bkin', s).value); if (typeof d.xp !== 'number') throw 0; S = Object.assign(JSON.parse(JSON.stringify(DEF)), d); save(); close(); toast('Progresas įkeltas ✓'); render(); }
        catch (err) { toast('Tai nepanašu į Paso atsarginę kopiją'); }
      }; });
    $('#reset').onclick = () => ask('Ištrinti visą progresą? To nebus galima atšaukti.', 'Ištrinti', () => { S = JSON.parse(JSON.stringify(DEF)); save(); render(); }, true);
  }

  // ---------- exercise generation ----------
  function poolFor(item, sameType = true) {
    let p = item.unit.lessons.flatMap(l => l.items).filter(x => x !== item && (!sameType || x.type === item.type));
    if (p.length < 8) p = ITEMS.filter(x => x !== item && (!sameType || x.type === item.type));
    return p;
  }
  function options(item, field) {
    const seen = new Set([item[field].toLowerCase()]), out = [item[field]];
    for (const x of shuffle(poolFor(item))) {
      const v = x[field];
      if (!seen.has(v.toLowerCase())) { seen.add(v.toLowerCase()); out.push(v); }
      if (out.length === 4) break;
    }
    return shuffle(out);
  }
  function tiles(item, lang) {
    const ans = tok(item[lang]);
    ans[0] = ans[0].toLowerCase();
    const have = new Set(ans.map(w => w.toLowerCase())), extra = [];
    const want = ans.length > 3 ? 4 : 3;
    for (const x of shuffle(poolFor(item, false))) {
      const t = tok(x[lang]); t[0] = t[0].toLowerCase();
      for (const w of shuffle(t)) { const k = w.toLowerCase(); if (!have.has(k)) { have.add(k); extra.push(w); break; } }
      if (extra.length >= want) break;
    }
    return shuffle(ans.concat(extra));
  }
  function exFor(item, kinds) {
    let k = rand(kinds);
    if (!HAS_TTS && /^listen/.test(k)) k = item.type === 'word' ? 'mcEs' : 'bankEs';
    return { kind: k, item };
  }
  const practiceKinds = it => it.type === 'word' ? ['mcEs', 'listenPick', 'typeEs', 'mcLt'] : ['bankEs', 'typeEs', 'listenType', 'bankLt'];
  const itemsSession = (items, n, kindsFor) => pick(items, n).map(it => exFor(it, kindsFor(it)));
  function lessonQueue(l) {
    const lvl = Math.min(S.done[l.id] || 0, 4);
    const words = shuffle(l.items.filter(i => i.type === 'word')), sents = shuffle(l.items.filter(i => i.type === 'sent'));
    const wk = lvl < 1 ? ['mcLt'] : lvl < 3 ? ['mcLt', 'mcEs', 'listenPick'] : ['mcEs', 'listenPick', 'typeEs'];
    const q = words.slice(0, 4).map(w => exFor(w, wk));
    q.push({ kind: 'match', items: pick(words, 5) });
    const plans = [
      ['bankLt', 'bankEs', 'bankLt', 'bankEs', 'listenType', 'bankEs'],
      ['bankEs', 'bankLt', 'typeEs', 'bankEs', 'listenType', 'typeEs'],
      ['typeEs', 'bankEs', 'listenType', 'typeEs', 'bankLt', 'listenType'],
    ];
    const plan = shuffle(plans[Math.min(lvl, 2)]);
    sents.forEach((s, i) => q.push(exFor(s, [plan[i % plan.length]])));
    return q;
  }

  // ---------- sessions ----------
  let SES = null, cur = null;
  function startLesson(l) { startSession({ mode: 'lesson', lesson: l, title: l.title, queue: lessonQueue(l) }); }
  function startLegend(u) {
    const items = u.lessons.flatMap(l => l.items);
    startSession({ mode: 'legendary', unit: u, title: 'Legendinis', maxMistakes: 3, queue: itemsSession(items, 15, it => it.type === 'word' ? ['typeEs', 'listenType'] : ['typeEs', 'listenType', 'bankEs']) });
  }
  function startSession(o) {
    if (!o.queue.length) return;
    SES = Object.assign({ total: o.queue.length, done: 0, mistakes: 0, answers: 0, correct: 0, start: Date.now() }, o);
    app.innerHTML = `<div class="lesson"><div class="lbar"><button class="x" id="quit" aria-label="Išeiti">✕</button><div class="bar"><div id="prog" style="width:0"></div></div>${SES.maxMistakes ? '<span class="lives" id="lives"></span>' : ''}</div><div class="ex" id="ex"></div><div class="foot" id="foot"></div></div>`;
    unlockAudio();
    $('#ex').innerHTML = '<p class="sub" style="text-align:center;margin-top:40px">Kraunama…</p>';
    const units = o.queue.flatMap(e => (e.items || [e.item]).map(i => i.unit.id));
    loadPacks(units).then(() => { if (SES === o || (SES && SES.queue === o.queue)) next(); });
    const leave = () => { SES = null; cur = null; if (HAS_TTS) speechSynthesis.cancel(); player.pause(); };
    $('#quit').onclick = () => {
      if (SES && SES.mode !== 'legendary' && SES.correct >= 3) {
        sheet(`<h2>Baigti dabar?</h2><div class="meta">Tai, ką padarei, bus įskaityta šiandienai (+5 XP). Pamoka lauks tavęs.</div>
          <button class="btn" id="ok">Išsaugoti ir baigti</button><button class="btn ghost" data-close>Tęsti pamoką</button>`,
          (s, close) => { $('#ok', s).onclick = () => { close(); leave(); award(5); toast('Diena įskaityta ✓ +5 XP'); render(); }; });
      } else ask('Išeiti? Šios pamokos progresas nebus išsaugotas.', 'Išeiti', () => { leave(); render(); }, true);
    };
  }
  function updateBar() {
    $('#prog').style.width = (SES.done / SES.total * 100) + '%';
    const l = $('#lives'); if (l) l.textContent = '💜 ' + (SES.maxMistakes - SES.mistakes);
  }
  function next() {
    updateBar();
    if (!SES.queue.length) return finish();
    renderEx(SES.queue.shift());
  }
  function footCheck() {
    const f = $('#foot'); f.className = 'foot';
    f.innerHTML = '<button class="btn green" id="check" disabled>Tikrinti</button>';
    $('#check').onclick = doCheck;
  }
  const setReady = v => { cur.ready = v; const c = $('#check'); if (c) c.disabled = !v; };

  const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];
  function typeBox() { return `<textarea id="inp" placeholder="Rašyk ispaniškai" autocapitalize="sentences" autocomplete="off" autocorrect="off" spellcheck="false"></textarea><div class="accents">${ACCENTS.map(a => `<button data-acc="${a}">${a}</button>`).join('')}</div>`; }
  function wireType(box) {
    const inp = $('#inp', box);
    inp.addEventListener('input', () => setReady(inp.value.trim().length > 0));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (cur.ready) doCheck(); } });
    $$('[data-acc]', box).forEach(b => b.onclick = () => {
      const s = inp.selectionStart, e = inp.selectionEnd;
      inp.value = inp.value.slice(0, s) + b.dataset.acc + inp.value.slice(e);
      inp.focus(); inp.selectionStart = inp.selectionEnd = s + 1; setReady(inp.value.trim().length > 0);
    });
    if (window.matchMedia('(pointer:fine)').matches) inp.focus();
    cur.val = () => inp.value;
  }
  function lev(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function checkTyped(v, answers) {
    const n = norm(v);
    if (!n) return { ok: false };
    if (answers.some(a => norm(a) === n)) return { ok: true };
    for (const a of answers) if (strip(norm(a)) === strip(n)) return { ok: true, note: `Atkreipk dėmesį į ženklus: <b>${esc(a)}</b>` };
    for (const a of answers) { const A = strip(norm(a)); if (A.length >= 6 && lev(A, strip(n)) <= 1) return { ok: true, note: `Maža rašybos klaida. Teisingai: <b>${esc(a)}</b>` }; }
    return { ok: false };
  }
  const esAnswers = it => [it.es].concat(it.alt);
  const isNew = it => it && !S.srs[it.id];

  function renderEx(ex) {
    cur = { ex, ready: false };
    const box = $('#ex'), it = ex.item;
    footCheck();
    const badge = isNew(it) ? '<div class="badge">✨ NAUJAS</div>' : '';
    const opts = (list, sayEach) => `<div class="opts">${list.map((o, i) => `<button class="opt" data-v="${esc(o)}"${sayEach ? ` data-say="${esc(o)}"` : ''}><span class="k">${i + 1}</span>${esc(o)}</button>`).join('')}</div>`;
    const wireOpts = () => $$('.opt', box).forEach(b => b.addEventListener('click', () => {
      $$('.opt', box).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); cur.val = b.dataset.v; setReady(true);
    }));
    switch (ex.kind) {
      case 'mcLt':
        box.innerHTML = `${badge}<h2>Ką tai reiškia?</h2><div class="prompt">${spk(it.es)}<span class="big">${esc(it.es)}</span></div>${opts(options(it, 'lt'))}`;
        wireOpts(); cur.check = () => ({ ok: cur.val === it.lt, correct: it.lt }); speak(it.es); break;
      case 'mcEs':
        box.innerHTML = `${badge}<h2>Kaip pasakyti ispaniškai?</h2><div class="prompt"><span class="big">${esc(it.lt)}</span></div>${opts(options(it, 'es'), true)}`;
        wireOpts(); cur.check = () => ({ ok: cur.val === it.es, correct: it.es, sayCorrect: true }); break;
      case 'listenPick':
        box.innerHTML = `<h2>Ką girdi?</h2><div class="listen"><button class="spk" data-say="${esc(it.es)}">🔊</button><button class="spk slow" data-say="${esc(it.es)}" data-slow="1">🐢</button></div>${opts(options(it, 'es'))}`;
        wireOpts(); cur.check = () => ({ ok: cur.val === it.es, correct: it.es, meaning: it.lt }); setTimeout(() => speak(it.es), 250); break;
      case 'bankLt':
      case 'bankEs': {
        const lang = ex.kind === 'bankLt' ? 'lt' : 'es', src = lang === 'lt' ? 'es' : 'lt';
        const t = tiles(it, lang), order = [];
        box.innerHTML = `${badge}<h2>Išversk šį sakinį</h2><div class="prompt">${src === 'es' ? spk(it.es) : ''}<span class="sent">${src === 'es' ? hintify(it.es) : esc(it.lt)}</span></div>
          <div class="answer" id="ans"></div><div class="bank">${t.map((w, i) => `<button class="tile" data-i="${i}">${esc(w)}</button>`).join('')}</div>`;
        const ans = $('#ans', box);
        const draw = () => {
          ans.innerHTML = order.map(i => `<button class="tile" data-a="${i}">${esc(t[i])}</button>`).join('');
          $$('.bank .tile', box).forEach(b => b.classList.toggle('used', order.includes(+b.dataset.i)));
          $$('[data-a]', ans).forEach(b => b.onclick = () => { order.splice(order.indexOf(+b.dataset.a), 1); draw(); });
          setReady(order.length > 0);
        };
        $$('.bank .tile', box).forEach(b => b.onclick = () => { const i = +b.dataset.i; if (!order.includes(i)) { order.push(i); if (lang === 'es') speak(t[i]); draw(); } });
        const answers = lang === 'lt' ? [it.lt] : esAnswers(it);
        cur.check = () => { const built = order.map(i => t[i]).join(' '); return { ok: answers.some(a => norm(a) === norm(built)), correct: answers[0], sayCorrect: lang === 'es' }; };
        if (src === 'es') speak(it.es);
        break;
      }
      case 'typeEs':
        box.innerHTML = `${badge}<h2>Parašyk ispaniškai</h2><div class="prompt"><span class="${it.type === 'word' ? 'big' : 'sent'}">${esc(it.lt)}</span></div>${typeBox()}`;
        wireType(box); cur.check = () => Object.assign({ correct: it.es, sayCorrect: true }, checkTyped(cur.val(), esAnswers(it))); break;
      case 'listenType':
        box.innerHTML = `<h2>Parašyk, ką girdi</h2><div class="listen"><button class="spk" data-say="${esc(it.es)}">🔊</button><button class="spk slow" data-say="${esc(it.es)}" data-slow="1">🐢</button></div>${typeBox()}`;
        wireType(box); cur.check = () => Object.assign({ correct: it.es, meaning: it.lt }, checkTyped(cur.val(), esAnswers(it))); setTimeout(() => speak(it.es), 250); break;
      case 'match': renderMatch(box, ex); break;
    }
  }
  function renderMatch(box, ex) {
    const its = ex.items, L = shuffle(its), R = shuffle(its);
    box.innerHTML = `<h2>Sujunk poras</h2><div class="match"><div class="col">${L.map(i => `<button class="opt" data-side="l" data-id="${i.id}">${esc(i.es)}</button>`).join('')}</div><div class="col">${R.map(i => `<button class="opt" data-side="r" data-id="${i.id}">${esc(i.lt)}</button>`).join('')}</div></div>`;
    $('#foot').innerHTML = '<button class="btn green" disabled>Tikrinti</button>';
    let sel = { l: null, r: null }, left = its.length, slipped = new Set();
    $$('.match .opt', box).forEach(b => b.onclick = () => {
      if (b.classList.contains('ok')) return;
      const side = b.dataset.side;
      if (side === 'l') speak(BY_ID[b.dataset.id].es);
      if (sel[side]) sel[side].classList.remove('sel');
      sel[side] = b; b.classList.add('sel');
      if (sel.l && sel.r) {
        const a = sel.l, c = sel.r;
        if (a.dataset.id === c.dataset.id) {
          [a, c].forEach(x => { x.classList.remove('sel'); x.classList.add('ok'); });
          srsUpdate(a.dataset.id, !slipped.has(a.dataset.id)); left--;
          if (!left) { beep(true); SES.done++; SES.answers++; SES.correct++; save(); setTimeout(next, 450); }
        } else {
          beep(false); slipped.add(a.dataset.id); slipped.add(c.dataset.id);
          [a, c].forEach(x => { x.classList.remove('sel'); x.classList.add('bad'); setTimeout(() => x.classList.remove('bad'), 400); });
        }
        sel = { l: null, r: null };
      }
    });
  }
  const PRAISE = ['Puiku!', 'Šaunu!', 'Teisingai!', 'Labai gerai!', '¡Muy bien!', '¡Perfecto!'];
  function doCheck() {
    if (!cur || !cur.ready || cur.checked) return;
    cur.checked = true;
    const ex = cur.ex, r = cur.check();
    SES.answers++;
    if (ex.item) srsUpdate(ex.item.id, r.ok);
    if (r.ok) { SES.done++; SES.correct++; }
    else {
      SES.mistakes++;
      if (!SES.maxMistakes && !ex.again) SES.queue.push(Object.assign({}, ex, { again: true }));
      if (!SES.maxMistakes && ex.again) SES.done++; // second miss: move on, item stays in mistakes review
    }
    save(); beep(r.ok);
    $$('#ex button, #ex textarea').forEach(e => e.disabled = true);
    const failed = SES.maxMistakes && SES.mistakes > SES.maxMistakes;
    const f = $('#foot');
    f.className = 'foot ' + (r.ok ? 'ok' : 'bad');
    f.innerHTML = `<div class="fb"><div class="fbh">${r.ok ? '✔ ' + rand(PRAISE) : '✘ Neteisingai'}</div>
      ${r.ok ? '' : `<div class="fbl">Teisingas atsakymas:</div><div class="fba">${esc(r.correct)}</div>`}
      ${r.note ? `<div class="fbn">${r.note}</div>` : ''}${r.meaning ? `<div class="fbm">Reikšmė: ${esc(r.meaning)}</div>` : ''}
      <div class="fbrow">${(r.sayCorrect || r.meaning) && HAS_TTS ? `<button class="link" data-say="${esc(ex.item.es)}">🔊 Klausyti</button>` : ''}${!r.ok && ex.item ? '<button class="link" id="tipb">📘 Gramatika</button>' : ''}</div></div>
      <button class="btn ${r.ok ? 'green' : 'red'}" id="cont">${failed ? 'Baigti' : 'Tęsti'}</button>`;
    const tb = $('#tipb'); if (tb) tb.onclick = () => showTip(ex.item.unit);
    $('#cont').onclick = () => failed ? finish(true) : next();
    updateBar();
  }
  document.addEventListener('keydown', e => {
    if (STORY && e.key === 'Enter') { const c = $('#scont'); if (c) { e.preventDefault(); c.click(); } return; }
    if (!SES || !$('#foot')) return;
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      const c = $('#cont'); if (c) { e.preventDefault(); c.click(); } else if (cur && cur.ready) { e.preventDefault(); doCheck(); }
    }
    if (/^[1-4]$/.test(e.key) && e.target.tagName !== 'TEXTAREA') { const o = $$('#ex .opts .opt')[+e.key - 1]; if (o && !o.disabled) o.click(); }
  });

  function finish(failed) {
    const s = SES; SES = null; cur = null;
    if (failed) {
      app.innerHTML = `<div class="lesson"><div class="result"><div class="emoji">💜</div><h1>Beveik!</h1><p class="sub">Legendiniame lygyje leidžiamos tik ${s.maxMistakes} klaidos. Pakartok skyrių ir bandyk dar kartą.</p>
        <div class="actions"><button class="btn legend" id="again">Bandyti dar kartą</button><button class="btn ghost" id="home">Grįžti</button></div></div></div>`;
      $('#again').onclick = () => startLegend(s.unit); $('#home').onclick = () => render();
      return;
    }
    const perfect = s.mistakes === 0;
    const xp = s.mode === 'legendary' ? 40 : 10 + (perfect ? 5 : 0);
    if (s.mode === 'lesson') S.done[s.lesson.id] = (S.done[s.lesson.id] || 0) + 1;
    if (s.mode === 'legendary') S.legendary[s.unit.id] = true;
    const before = S.dayXp[today()] || 0;
    const { extended, freezeEarned } = award(xp);
    const goalHit = before < S.goal && before + xp >= S.goal;
    const acc = Math.round(s.correct / Math.max(1, s.answers) * 100);
    const secs = Math.round((Date.now() - s.start) / 1000);
    const time = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    const emoji = s.mode === 'legendary' ? '🏆' : perfect ? '🌟' : '🎉';
    const title = s.mode === 'legendary' ? '¡Legendario!' : s.mode === 'lesson' ? 'Pamoka baigta!' : s.mode === 'quick' ? 'Minutė baigta!' : 'Kartojimas baigtas!';
    app.innerHTML = `<div class="lesson"><div class="result"><div class="emoji">${emoji}</div><h1>${title}</h1>
      ${perfect ? '<p class="sub">Be jokios klaidos! +5 XP premija</p>' : ''}
      <div class="tiles"><div class="tile-s"><span>XP</span><b style="color:var(--gold-d)">+${xp}</b></div><div class="tile-s"><span>Tikslumas</span><b style="color:var(--green)">${acc}%</b></div><div class="tile-s"><span>Laikas</span><b style="color:var(--blue)">${time}</b></div></div>
      ${winLines(extended, freezeEarned, goalHit)}
      <div class="actions" style="margin-top:16px"></div></div></div>`;
    resultButtons(extended, s.mode === 'practice' ? 'practice' : 'path');
  }

  // ---------- stories ----------
  let STORY = null;
  function storySheet(st) {
    const u = C.units.find(x => x.id === st.unit);
    const open = u.lessons.every(l => S.done[l.id]) || S.stories[st.id];
    sheet(`<h2>${st.icon} ${esc(st.title)}</h2><div class="meta"><i>${esc(st.titleEs)}</i> · ${esc(u.title)}</div>
      <p>Trumpa istorija ispaniškai: klausyk, skaityk ir atsakyk į klausimus. Paspausk žodį, kad pamatytum jo reikšmę.</p>
      ${open ? `<button class="btn" id="go">${S.stories[st.id] ? 'Skaityti dar kartą +5 XP' : 'Skaityti +15 XP'}</button>`
        : `<p class="sub">Atsirakins, kai baigsi skyriaus „${esc(u.title)}“ pamokas.</p><button class="btn ghost" id="go">Vis tiek skaityti</button>`}`,
      (s, close) => { $('#go', s).onclick = () => { close(); startStory(st); }; });
  }
  const NAME_COLORS = ['#ff7a45', '#4a8cff', '#2bb5a0', '#a66cff', '#e5484d', '#d9822b'];
  function startStory(st) {
    unlockAudio();
    SES = null; cur = null;
    STORY = { st, i: 0, mistakes: 0, answers: 0, start: Date.now(), main: Object.keys(st.cast || {})[0] };
    app.innerHTML = `<div class="lesson"><div class="lbar"><button class="x" id="quit" aria-label="Išeiti">✕</button><div class="bar"><div id="prog" style="width:0"></div></div></div>
      <div class="story" id="log"><div class="st-head"><div class="st-ic">${st.icon}</div><h2>${esc(st.titleEs)}</h2><div class="sub">${esc(st.title)}</div></div></div>
      <div class="foot" id="foot"><button class="btn" id="scont" disabled>Kraunama…</button></div></div>`;
    $('#quit').onclick = () => ask('Išeiti iš istorijos?', 'Išeiti', () => { STORY = null; player.pause(); render(); }, true);
    loadPack('stories').then(() => { const c = $('#scont'); if (STORY && c) { c.disabled = false; c.textContent = 'Pradėti'; c.onclick = storyStep; } });
  }
  function storyFoot(label = 'Tęsti') {
    const f = $('#foot'); f.className = 'foot';
    f.innerHTML = `<button class="btn" id="scont">${label}</button>`;
    $('#scont').onclick = storyStep;
  }
  function storyBar() { const t = STORY.st.lines.length + (STORY.st.pairs ? 1 : 0); $('#prog').style.width = Math.min(100, STORY.i / t * 100) + '%'; }
  function nameColor(who) { const keys = Object.keys(STORY.st.cast || {}); return NAME_COLORS[Math.max(0, keys.indexOf(who)) % NAME_COLORS.length]; }
  function storyLine(who, es, lt, key) {
    const log = $('#log'), el = document.createElement('div');
    if (!who) {
      el.className = 'st-narr';
      el.innerHTML = `<button class="st-spk" data-key="${key}" data-say="${esc(es)}" aria-label="Klausyti">🔊</button><div><div class="st-es">${hintify(es)}</div>${lt ? `<div class="st-lt" hidden>${esc(lt)}</div>` : ''}</div>`;
    } else {
      el.className = 'st-line' + (who === STORY.main ? ' me' : '');
      el.innerHTML = `<div class="st-av" style="background:${nameColor(who)}">${esc(who.charAt(0))}</div><div class="st-bub"><div class="st-who" style="color:${nameColor(who)}">${esc(who)}</div>
        <div class="st-es">${hintify(es)}</div>${lt ? `<div class="st-lt" hidden>${esc(lt)}</div>` : ''}
        <div class="st-tools"><button class="st-spk" data-key="${key}" data-say="${esc(es)}" aria-label="Klausyti">🔊</button>${lt ? '<button class="st-tr">Vertimas</button>' : ''}</div></div>`;
    }
    const tr = el.querySelector('.st-tr'); if (tr) tr.onclick = () => { const l = el.querySelector('.st-lt'); l.hidden = !l.hidden; };
    if (!who && lt) el.onclick = e => { if (!e.target.closest('button,.hint')) { const l = el.querySelector('.st-lt'); l.hidden = !l.hidden; } };
    log.appendChild(el);
    el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    playKey(key, es);
  }
  function storyStep() {
    const st = STORY.st;
    if (STORY.i >= st.lines.length) return st.pairs && st.pairs.length && !STORY.paired ? storyPairs() : storyEnd();
    const idx = STORY.i, ln = st.lines[idx];
    STORY.i++; storyBar();
    if (ln.q !== undefined) return storyQuestion(ln, idx);
    storyLine(ln.who, ln.es, ln.lt, `${st.id}:${idx}`);
    storyFoot();
  }
  function storyQuestion(ln, idx) {
    const log = $('#log'), el = document.createElement('div');
    el.className = 'st-q';
    el.innerHTML = `<div class="st-qh">${esc(ln.q)}</div><div class="opts">${ln.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
    log.appendChild(el); el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    $('#foot').innerHTML = '<button class="btn" disabled>Pasirink atsakymą</button>';
    let first = true;
    $$('.opt', el).forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if (first) { STORY.answers++; }
      if (i !== ln.answer) {
        if (first) STORY.mistakes++;
        first = false; beep(false); b.classList.add('bad'); b.disabled = true; return;
      }
      beep(true);
      $$('.opt', el).forEach(x => { x.disabled = true; });
      b.classList.add('good');
      if (ln.es) storyLine(ln.who || '', ln.options[ln.answer], ln.lt || '', `${STORY.st.id}:${idx}`);
      storyFoot();
    });
  }
  function storyPairs() {
    STORY.paired = true; STORY.i++; storyBar();
    const pairs = STORY.st.pairs, L = shuffle(pairs.map((p, i) => [p[0], i])), R = shuffle(pairs.map((p, i) => [p[1], i]));
    const log = $('#log'), el = document.createElement('div');
    el.className = 'st-q';
    el.innerHTML = `<div class="st-qh">Sujunk poras</div><div class="match"><div class="col">${L.map(([t, i]) => `<button class="opt" data-side="l" data-i="${i}">${esc(t)}</button>`).join('')}</div><div class="col">${R.map(([t, i]) => `<button class="opt" data-side="r" data-i="${i}">${esc(t)}</button>`).join('')}</div></div>`;
    log.appendChild(el); el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    $('#foot').innerHTML = '<button class="btn" disabled>Sujunk visas poras</button>';
    let sel = { l: null, r: null }, left = pairs.length;
    $$('.opt', el).forEach(b => b.onclick = () => {
      if (b.classList.contains('ok')) return;
      const side = b.dataset.side;
      if (side === 'l') speak(b.textContent);
      if (sel[side]) sel[side].classList.remove('sel');
      sel[side] = b; b.classList.add('sel');
      if (sel.l && sel.r) {
        const a = sel.l, c = sel.r;
        if (a.dataset.i === c.dataset.i) { [a, c].forEach(x => { x.classList.remove('sel'); x.classList.add('ok'); }); if (!--left) { beep(true); storyFoot('Baigti'); } }
        else { beep(false); [a, c].forEach(x => { x.classList.remove('sel'); x.classList.add('bad'); setTimeout(() => x.classList.remove('bad'), 400); }); }
        sel = { l: null, r: null };
      }
    });
  }
  function storyEnd() {
    const s = STORY; STORY = null;
    const again = !!S.stories[s.st.id];
    const xp = again ? 5 : 15;
    S.stories[s.st.id] = (S.stories[s.st.id] || 0) + 1;
    const before = S.dayXp[today()] || 0;
    const { extended, freezeEarned } = award(xp);
    const goalHit = before < S.goal && before + xp >= S.goal;
    const acc = Math.round((s.answers - s.mistakes) / Math.max(1, s.answers) * 100);
    app.innerHTML = `<div class="lesson"><div class="result"><div class="emoji">${s.st.icon}</div><h1>Istorija perskaityta!</h1><p class="sub"><i>${esc(s.st.titleEs)}</i></p>
      <div class="tiles"><div class="tile-s"><span>XP</span><b style="color:var(--gold-d)">+${xp}</b></div><div class="tile-s"><span>Tikslumas</span><b style="color:var(--green)">${acc}%</b></div><div class="tile-s"><span>Eilutės</span><b style="color:var(--blue)">${s.st.lines.filter(l => l.es !== undefined && l.q === undefined).length}</b></div></div>
      ${winLines(extended, freezeEarned, goalHit)}
      <div class="actions" style="margin-top:16px"></div></div></div>`;
    resultButtons(extended, TAB);
  }

  // ---------- one-time surprise: Paco from the street corner ----------
  const PACO = {
    intro: 'Eini Madrido gatve. Iš už kampo išlenda keistas vyrukas su akiniais nuo saulės. Naktį.',
    open: [['Psst... ¡Oye, guapa! Ven aquí.', 'Pst... Ei, gražuole! Ateik čia.'],
      ['¿Quieres CBD? Es del bueno. Cien por cien natural.', 'Nori CBD? Geras daiktas. Šimtu procentų natūralus.']],
    choices: [
      { es: 'No, gracias. Solo quiero aprender español.', lt: 'Ne, ačiū. Aš tik noriu išmokti ispanų kalbą.', reply: ['¿Español? ¡Eso es peor! Cuando empiezas, ya no puedes parar.', 'Ispanų? Tai dar blogiau! Kai pradedi, nebegali sustoti.'] },
      { es: '¿Cuánto cuesta?', lt: 'Kiek kainuoja?', reply: ['Para ti, veinte euros. Si dices gracias muy bien, quince.', 'Tau – dvidešimt eurų. Jei labai gražiai pasakysi „gracias“, penkiolika.'] },
      { es: '¡Socorro! ¡Policía!', lt: 'Gelbėkit! Policija!', reply: ['¡Tranquila, tranquila! Es legal... creo. ¡Adiós!', 'Ramiai, ramiai! Tai legalu... atrodo. Iki!'] },
    ],
    note: ['Una lección al día y nadie te para. Paco.', 'Viena pamoka per dieną, ir niekas tavęs nesustabdys. Paco.'],
  };
  function paco() {
    S.pacoSeen = true; save();
    sheet('<div class="pk-log" id="pklog"><div class="pk-h">🕶️</div></div><div id="pkfoot"></div>', (s, close) => {
      const log = $('#pklog', s), foot = $('#pkfoot', s);
      const say = (who, es, lt) => {
        const d = document.createElement('div'); d.className = 'pk-line ' + who;
        d.innerHTML = `${who === 'paco' ? '<div class="pk-av">🕶️</div>' : ''}<div class="pk-bub">${who === 'paco' ? '<div class="st-who">Paco</div>' : ''}${es ? `<div class="st-es">${esc(es)}</div>` : ''}<div class="st-lt">${esc(lt)}</div></div>`;
        log.appendChild(d); d.scrollIntoView({ block: 'end', behavior: 'smooth' });
        if (es) speak(es);
      };
      const btn = (label, fn) => { foot.innerHTML = `<button class="btn">${label}</button>`; foot.firstChild.onclick = fn; };
      const ending = () => {
        say('narr', '', 'Paco dingsta už kampo. Ant žemės lieka raštelis:');
        say('note', ...PACO.note);
        S.xp += 5; save();
        btn('Grįžti mokytis 😎 +5 XP', () => { close(); render(); });
      };
      const choices = () => {
        foot.innerHTML = `<div class="opts">${PACO.choices.map((c, i) => `<button class="opt" data-i="${i}"><div><b>${esc(c.es)}</b><div class="st-lt">${esc(c.lt)}</div></div></button>`).join('')}</div>`;
        $$('.opt', foot).forEach(b => b.onclick = () => {
          const c = PACO.choices[+b.dataset.i];
          say('me', c.es, c.lt); foot.innerHTML = '';
          setTimeout(() => { say('paco', ...c.reply); btn('Tęsti', ending); }, 2200);
        });
      };
      say('narr', '', PACO.intro);
      btn('Prieiti arčiau 👀', () => { say('paco', ...PACO.open[0]); btn('Klausytis toliau', () => { say('paco', ...PACO.open[1]); choices(); }); });
    });
  }

  // returning after days away gets a gentle restart (never mentions missed days)
  let AWAY = S.lastSeen ? diffDays(S.lastSeen, today()) : 0, RENDERED_DAY = today();
  S.lastSeen = today(); save();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (S.lastSeen !== today()) { AWAY = diffDays(S.lastSeen, today()); S.lastSeen = today(); save(); }
    if (!SES && !STORY && RENDERED_DAY !== today()) { RENDERED_DAY = today(); checkStreak(); render(); }
  });

  checkStreak();
  render();
  if (!S.pacoSeen) { loadPack('paco'); setTimeout(() => { if (!SES && !STORY && !S.pacoSeen) paco(); }, 800); }
})();
