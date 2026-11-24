
/* Storyline-style course player for the S.P.A.R.K.S. HTML review builds.
   Every slide has a timeline: the narration drives it, objects appear at their cue points, and the learner can
   pause, scrub and replay it. Feedback layers with narration get their own timeline, as layers do in Storyline. */
(function () {
  'use strict';
  const { h } = UI;
  const $ = (id) => document.getElementById(id);
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const box = $('stageBox'), stage = $('stage'), mid = $('plMid');
  const cc = $('slCC');
  let cover = null; // the start screen, until the learner starts the lesson
  const VO_TEXT = window.POV_VO_TEXT || {};
  const VO_AUDIO = window.POV_VO || {};
  const VO_CUES = window.POV_VO_CUES || {};
  const VO_CAPS = window.POV_VO_CAPS || {}; // caption lines with start times, from tools/build_audio.py
  const COURSE = window.POV_COURSE || {};
  const SB = window.POV_SB || {}; // storyboard status and reviewer notes per screen
  const LMS = window.POV_LMS || null; // the LMS package only (pov-lms.js): SCORM 2004 tracking
  const P = { visited: new Set(), lock: null, scale: 1, cur: null, idx: 0, started: false, cc: true, speed: 1, vol: 1, muted: false, base: null, layer: null, frozen: false, held: false, zoom: 1, instant: false };
  /* the learner's display settings (slide size, content at once) are kept in this browser when it allows */
  try { const pr = JSON.parse(localStorage.getItem('pov-prefs') || '{}') || {}; if ([1, 1.5, 2].includes(pr.zoom)) P.zoom = pr.zoom; P.instant = pr.instant === true; } catch (e) { /* storage blocked */ }
  const savePrefs = () => { try { localStorage.setItem('pov-prefs', JSON.stringify({ zoom: P.zoom, instant: P.instant })); } catch (e) { /* storage blocked */ } };
  const active = () => P.layer || P.base;

  /* ---------- device sounds: audio files (embedded) played the same way as the narration, so they work wherever
     the narration does. They follow the player's volume and mute, pause with the Pause button, and stop when the
     slide changes. In Storyline these are audio files on triggers. */
  const SFX = (() => {
    const SRC = window.POV_SFX || {};
    const live = new Set(), loops = new Map(), pool = {};
    const vol = () => (P.muted ? 0 : P.vol);
    const get = (name) => { // short sounds come from a small pool so rapid beeps never wait on decoding
      if (name !== 'qrs' && name !== 'key') return new Audio(SRC[name]);
      const p = pool[name] || (pool[name] = Array.from({ length: 4 }, () => { const a = new Audio(SRC[name]); a.preload = 'auto'; return a; }));
      const a = p.shift(); p.push(a); a.currentTime = 0; return a;
    };
    function play(name) {
      if (name === 'stop') { live.forEach(a => a.pause()); live.clear(); loops.clear(); return; }
      if (!SRC[name] || P.frozen) return;
      const loop = name === 'charged';
      if (loop && loops.has(name)) return;
      const a = get(name); a.loop = loop; a.volume = vol(); a.muted = false;
      live.add(a); a.onended = () => live.delete(a);
      if (loop) loops.set(name, a);
      const pr = a.play(); if (pr) pr.catch(() => live.delete(a));
      window.POV_SFX_LOG && window.POV_SFX_LOG.push(name);
    }
    const level = () => live.forEach(a => { a.volume = vol(); });
    const freeze = (on) => live.forEach(a => { if (on) a.pause(); else a.play().catch(() => {}); });
    return { play, level, freeze };
  })();

  /* ---------- layout ---------- */
  const pl = $('pl');
  function fit() {
    const r = mid.getBoundingClientRect(), W = r.width - 16, H = r.height - 12;
    pl.classList.toggle('zoomed', P.zoom > 1); // a larger slide than the window: the middle of the player scrolls
    P.scale = Math.max(0.2, Math.min(W / 1280, H / 720)) * P.zoom;
    box.style.width = (1280 * P.scale) + 'px'; box.style.height = (720 * P.scale) + 'px';
    [stage, cover].forEach(el => { if (el) { el.style.transform = `scale(${P.scale})`; el.style.transformOrigin = '0 0'; } });
    cc.style.fontSize = Math.max(15, Math.min(30 * P.zoom, 26 * P.scale)) + 'px'; // small screens keep captions in proportion
    if (P.cur) P.cur.scaleCbs.forEach(f => f());
    placeCC();
  }
  window.addEventListener('resize', fit);

  /* ---------- timeline ---------- */
  const sentences = (t) => (t.replace(/\b(Dr|Mr|Mrs|Ms|vs|St|[A-Z])\./g, '$1․').match(/[^.!?]+[.!?]+["”]?|[^.!?]+$/g) || []).map(s => s.replace(/․/g, '.').trim()).filter(Boolean); // "Dr." and initials such as "T." stay inside their sentence
  const fmt = (s) => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  function setVisible(el, vis, animate) {
    if (vis) { const was = el.classList.contains('wait'); el.classList.remove('wait'); if (was && animate && !reduced) { el.classList.remove('reveal'); void el.offsetWidth; el.classList.add('reveal'); } else if (!animate) el.classList.remove('reveal'); }
    else { el.classList.add('wait'); el.classList.remove('reveal'); }
  }
  /* lead: seconds of the slide on screen before the narration starts, so the learner sees the picture first.
     Cue keys: 'pre' (at 0, before the narration), a sentence number (when that sentence starts, plus a delay),
     'last' (the last sentence), 'end' (end of the timeline, a negative delay counts back from it). */
  class Timeline {
    constructor(key, cues, kind, lead) {
      this.key = key; this.kind = kind; this.t = 0; this.playing = false; this.ended = false; this.endFired = false; this.off = lead || 0;
      this.text = VO_TEXT[key] || ''; this.parts = sentences(this.text);
      const chars = this.parts.map(s => s.length), tot = chars.reduce((a, b) => a + b, 0) || 1;
      this.estStarts = (dur) => { let acc = 0; return chars.map(c => { const s = acc / tot * dur; acc += c; return s; }); };
      this.cuesIn = cues || {};
      this.items = [];
      this.ready = false;
      // hide every cued object straight away, so nothing flashes on before the audio has loaded
      Object.keys(this.cuesIn).forEach(k => { if (k !== 'pre') [].concat(this.cuesIn[k]).forEach(it => { const x = Array.isArray(it) ? it[0] : it; if (x && x.classList) setVisible(x, false); }); });
      if (VO_AUDIO[key] && P.started) { // behind the start cover the slide is rebuilt at Start, so it loads no audio yet
        this.audio = new Audio(VO_AUDIO[key]); this.audio.preload = 'auto';
        this.audio.addEventListener('loadedmetadata', () => this.setup(this.audio.duration));
        this.audio.addEventListener('ended', () => { this.audioDone = true; });
        this.audio.addEventListener('error', () => { if (this.ready) return; this.audio = null; this.setup(Math.max(2.4, tot / 15.5)); }); // a missing clip: the slide still runs, at reading pace
      } else this.setup(this.text ? Math.max(2.4, tot / 15.5) : 0.5); // no clip: about 150 words a minute
    }
    setup(voDur) {
      const off = this.off;
      this.voDur = voDur; this.dur = off + voDur + 0.4;
      const cs = VO_CUES[this.key];
      this.starts = ((this.audio && cs && cs.length === this.parts.length) ? cs : this.estStarts(voDur)).map(x => x + off);
      this.caps = (this.audio && VO_CAPS[this.key]) ? VO_CAPS[this.key].map(([t, x]) => [t + off, x]) : null; // shorter caption lines, timed from the words
      Object.keys(this.cuesIn).forEach(k => {
        const last = this.starts.length > 1 ? this.starts[this.starts.length - 1] : off + Math.max(0, voDur - 0.3); // 'last': the last sentence, or the end of a one-sentence clip
        const base = k === 'end' ? this.dur : k === 'pre' ? 0 : k === 'last' ? last : (this.starts[Math.min(+k, this.starts.length - 1)] || off);
        [].concat(this.cuesIn[k]).forEach(it => {
          const [x, d] = Array.isArray(it) ? it : [it, 0];
          const t = Math.max(0, Math.min(base + (d || 0), this.dur));
          if (typeof x === 'function') this.items.push({ t: P.instant ? 0 : t, fn: x, fired: false });
          else if (x) { const te = P.instant ? 0 : t; this.items.push({ t: te, el: x }); if (te > 0) setVisible(x, false); } // Show everything at once: no waiting for the narration
        });
      });
      this.ready = true; this.apply(this.t, true); ui();
      if (this.wantPlay) this.play();
    }
    play() {
      if (!this.ready) { this.wantPlay = true; ui(); return; }
      this.wantPlay = false;
      if (this.ended) this.seek(0);
      this.playing = true; this.ended = false;
      this.syncAudio(); this.toAudio();
      ui();
    }
    /* the audio follows the timeline: silent during the lead, then at (t - lead) */
    toAudio() {
      if (!this.audio) return;
      const at = this.t - this.off;
      this.audioDone = at >= this.voDur;
      if (this.audioDone) { this.audio.pause(); return; }
      if (Math.abs(this.audio.currentTime - Math.max(0, at)) > 0.08) this.audio.currentTime = Math.max(0, at);
      if (this.playing && at >= 0) this.audio.play().catch(() => {}); else this.audio.pause();
    }
    pause() { this.wantPlay = false; this.playing = false; if (this.audio) this.audio.pause(); ui(); }
    seek(t) {
      t = Math.max(0, Math.min(this.dur || 0, t));
      if (this.dur && t >= this.dur - 0.06) t = this.dur;
      const back = t < this.t;
      this.t = t; this.ended = t >= this.dur && this.dur > 0;
      if (this.ended) this.playing = false;
      this.toAudio();
      this.apply(t, true, back);
      if (this.ended) this.finish();
      ui();
    }
    syncAudio() { if (!this.audio) return; this.audio.playbackRate = P.speed; this.audio.volume = P.vol; this.audio.muted = P.muted; }
    tick(dt) {
      if (!this.ready || !this.playing) return;
      if (this.audio && !this.audioDone && this.t >= this.off) { const at = this.audio.currentTime; this.t = Math.max(this.t, this.off + at); if (this.audio.paused && at < this.voDur - 0.05) this.audio.play().catch(() => {}); }
      else { this.t += dt * P.speed; if (this.audio && !this.audioDone && this.t >= this.off) { this.t = this.off; this.toAudio(); } } // the lead is over: the narration starts
      this.apply(this.t, false);
      if (this.t >= this.dur) { this.t = this.dur; this.playing = false; this.ended = true; this.finish(); }
      ui();
    }
    apply(t, jump, back) {
      this.items.forEach(it => {
        if (it.el) setVisible(it.el, t >= it.t, !jump);
        else if (!it.fired && t >= it.t) { it.fired = true; it.fn(); }
      });
      this.caption(t);
    }
    caption(t) {
      if (active() !== this) return;
      let txt = '';
      if (this.kind === 'base' && P.holding) { if (cc.firstChild.textContent) cc.firstChild.textContent = ''; return; } // a device layer is open over a paused base
      if (this.parts.length && t >= this.off && t < this.off + (this.voDur || 0) + 0.05) {
        if (this.caps) { let i = 0; while (i + 1 < this.caps.length && this.caps[i + 1][0] <= t) i++; txt = this.caps[i][1]; }
        else { let i = 0; while (i + 1 < this.starts.length && this.starts[i + 1] <= t) i++; txt = this.parts[i]; }
      }
      if (cc.firstChild.textContent !== txt) cc.firstChild.textContent = txt;
    }
    finish() { if (!this.endFired) { this.endFired = true; this.onEnd && this.onEnd(); } this.caption(this.dur + 1); }
    destroy() { this.playing = false; if (this.audio) { this.audio.pause(); this.audio.removeAttribute('src'); this.audio.load(); } }
  }

  /* ---------- slide context ---------- */
  function makeCtx(s) {
    const c = { rafs: [], timers: [], scaleCbs: [], alive: true, reducedMotion: reduced, slide: s };
    let last = performance.now();
    const loop = (now) => {
      if (!c.alive) return;
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      const a = active(); if (a) a.tick(dt);
      c.rafs.forEach(f => f(P.frozen ? 0 : dt)); // the Pause button freezes the live monitors too
      placeCC();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    c.raf = (f) => c.rafs.push(f);
    c.sfx = (name) => SFX.play(name);
    c.frozen = () => P.frozen;
    c.after = (ms, f) => { const id = setTimeout(() => c.alive && f(), ms); c.timers.push(id); return id; };
    c.onScale = (f) => c.scaleCbs.push(f);
    c.scale = () => P.scale;
    c.go = (i) => show(typeof i === 'string' ? SLIDES.findIndex(x => x.id === i) : i);
    /* the slide's own timeline, driven by its narration; cues: {sentence index or 'end': [element | [element, delay] | fn]} */
    c.pending = {}; c.lead = 1;
    c.cue = (when, ...items) => { (c.pending[when] = c.pending[when] || []).push(...items); }; // helpers queue their entrances here
    c.timeline = (key, cues, onEnd) => {
      if (P.base) P.base.destroy();
      const all = Object.assign({}, c.pending); Object.entries(cues || {}).forEach(([k, v]) => { all[k] = (all[k] || []).concat(v); });
      const tl = new Timeline(key, all, 'base', VO_TEXT[key] ? c.lead : 0); P.base = tl;
      tl.onEnd = () => { if (onEnd) onEnd(); if (LMS && c.alive) LMS.slideEnd(s); }; // the end of the last slide completes the course
      if (P.started) tl.play();
      ui(); return tl;
    };
    c.vo = (key) => c.timeline(key);
    /* a feedback layer's narration: its own timeline; the base timeline waits */
    c.layerVO = (key) => {
      c.endLayerVO();
      const keys = [].concat(key).filter(k => VO_TEXT[k]); // one clip, or several played one after another
      if (!keys.length) return;
      if (P.base && P.base.playing) { P.base.pause(); }
      unfreeze();
      const run = (i) => {
        const tl = new Timeline(keys[i], null, 'layer'); P.layer = tl;
        if (i + 1 < keys.length) tl.onEnd = () => { if (P.layer === tl && c.alive) { tl.destroy(); run(i + 1); } };
        tl.play(); ui();
      };
      run(0);
    };
    c.endLayerVO = () => { if (P.layer) { P.layer.destroy(); P.layer = null; cc.firstChild.textContent = ''; ui(); } };
    c.stopVO = c.endLayerVO;
    /* a device layer opens: hold the base timeline so the narration does not talk over it */
    c.hold = (on) => {
      if (!P.base) return;
      if (on) { P.holding = true; P.held = P.base.playing || P.base.wantPlay; P.wasFrozen = P.frozen && !P.held; if (P.held) P.base.pause(); unfreeze(); P.base.caption(P.base.t); }
      else { P.holding = false; c.endLayerVO(); if (P.held) { unfreeze(); P.base.play(); } else if (P.wasFrozen) setFrozen(true); P.held = false; P.base.caption(P.base.t); }
      ui();
    };
    c.lock = (msg) => { P.lock = msg; ui(); };
    c.unlock = () => { if (P.lock && c.alive) { P.lock = null; const bN = $('bNext'); bN.classList.add('pulse'); setTimeout(() => bN.classList.remove('pulse'), 2600); ui(); } };
    c.answer = (r) => { if (LMS && c.alive) LMS.answer(s, r); }; // every answer, for the LMS: { type, response, correct, ok, text }
    c.destroy = () => { SFX.play('stop'); P.holding = false; P.held = false; c.alive = false; c.timers.forEach(clearTimeout); if (P.base) P.base.destroy(); c.endLayerVO(); P.base = null; };
    return c;
  }

  function show(i) {
    if (P.cur) P.cur.destroy();
    P.idx = Math.max(0, Math.min(SLIDES.length - 1, i));
    const s = SLIDES[P.idx];
    P.frozen = false; // a paused slide never carries its pause into the next one
    P.lock = null; P.visited.add(P.idx);
    const cnt = $('plCount'); if (cnt) cnt.textContent = `${P.idx + 1} of ${SLIDES.length}`;
    stage.innerHTML = ''; stage.className = 'stage pov';
    cc.firstChild.textContent = '';
    const holder = h('div', { class: 'fadein', style: { position: 'absolute', inset: '0' } });
    stage.append(holder);
    P.cur = makeCtx(s); P.cur.stage = holder; P.cur.root = stage;
    stage.setAttribute('aria-label', s.title);
    s.build(P.cur);
    if (!holder.querySelector('h1')) holder.prepend(h('h2', { class: 'pl-sr' }, s.title)); // a heading per slide, for screen readers
    if (!P.base) P.cur.timeline(null); // slides without narration still get a short timeline
    if (LMS && P.started) LMS.slide(s, P.idx, SLIDES); // bookmark and progress (not behind the start screen, so a return visit keeps its bookmark until the learner chooses)
    renderMenu(); renderTranscript(); renderNotes(); ui();
    try { history.replaceState(null, '', '#' + s.id); } catch (e) { /* file:// or sandbox */ }
    if (P.started) setTimeout(() => stage.focus({ preventScroll: true }), 30);
  }

  /* ---------- captions: over the bottom of the slide (the learner can turn them off); beside the card when a
     feedback card is open, so they never cover it ---------- */
  function placeCC() {
    cc.hidden = !P.cc || !P.started || !cc.firstChild.textContent;
    if (cc.hidden) return;
    const card = stage.querySelector('.fbx .fbcard');
    let left = '', width = '', top = false;
    if (card && card.offsetParent) {
      const r = card.getBoundingClientRect(), sr = stage.getBoundingClientRect(), k = P.scale;
      const l = (r.left - sr.left) / k, rt = (r.right - sr.left) / k; // in slide units
      const free = (l - 48) > (1280 - rt - 48) ? [24, l - 24] : [rt + 24, 1256]; // the wider side of the card
      if (free[1] - free[0] >= 380) { left = (free[0] * k) + 'px'; width = ((free[1] - free[0]) * k) + 'px'; }
      else top = true;
    }
    cc.style.left = left; cc.style.width = width; cc.style.right = width ? 'auto' : '';
    cc.style.bottom = top ? 'auto' : (14 * P.scale) + 'px'; cc.style.top = top ? (10 * P.scale) + 'px' : '';
  }

  /* ---------- sidebar: menu and transcript ---------- */
  const side = $('side'), bSide = $('bSide');
  const docked = () => document.body.classList.contains('docked');
  const setSide = (open, quiet) => { side.classList.toggle('open', open); side.inert = !open; side.setAttribute('aria-hidden', String(!open)); bSide.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('docked', open && window.innerWidth >= 1180); setTimeout(fit, 30);
    if (quiet) return; if (open) setTimeout(() => side.querySelector('[aria-selected="true"]').focus(), 60); else bSide.focus(); };
  bSide.addEventListener('click', () => setSide(!side.classList.contains('open')));
  const tabs = [[$('tMenu'), $('pMenu')], [$('tTr'), $('pTr')]];
  tabs.forEach(([t, p], k) => t.addEventListener('click', () => tabs.forEach(([t2, p2], j) => { t2.setAttribute('aria-selected', String(j === k)); p2.hidden = j !== k; })));
  function renderMenu() {
    const pane = $('pMenu'); pane.innerHTML = '';
    let grp = null;
    SLIDES.forEach((s, i) => {
      if (s.grp !== grp) { grp = s.grp; const n = SLIDES.filter((x, j) => x.grp === grp && P.visited.has(j)).length, tot = SLIDES.filter(x => x.grp === grp).length;
        pane.append(h('h6', null, h('span', null, grp), h('span', { class: 'cnt' }, `${n}/${tot}`))); }
      const st = i === P.idx ? 'now' : P.visited.has(i) ? 'seen' : 'new';
      const b = h('button', { class: 'item ' + st, type: 'button', 'aria-current': String(i === P.idx) }, h('span', { class: 'dot', 'aria-hidden': 'true' }), h('span', null, s.menu || s.title), st === 'seen' ? h('span', { class: 'pl-sr' }, ', visited') : null);
      b.addEventListener('click', () => { if (!docked()) setSide(false); show(i); });
      pane.append(b);
    });
  }
  function renderTranscript() {
    const pane = $('pTr'); pane.innerHTML = '';
    const s = SLIDES[P.idx];
    (s.vo || []).forEach(([label, key]) => { if (VO_TEXT[key]) pane.append(h('div', { class: 'tr' }, h('b', null, label), VO_TEXT[key])); });
    if (!pane.childNodes.length) pane.append(h('div', { class: 'tr' }, 'No narration on this slide.'));
  }

  /* ---------- resources: review notes ---------- */
  const drawer = $('drawer'), bRes = $('bRes');
  const setNotes = (open) => { drawer.classList.toggle('open', open); drawer.inert = !open; drawer.setAttribute('aria-hidden', String(!open)); bRes.setAttribute('aria-expanded', String(open)); if (open) setTimeout(() => drawer.querySelector('.x').focus(), 60); };
  bRes.addEventListener('click', () => setNotes(!drawer.classList.contains('open')));
  function renderNotes() {
    const s = SLIDES[P.idx], n = s.notes || {}, sb = SB[s.sb] || {};
    drawer.innerHTML = '';
    const x = h('button', { class: 'pl-btn x', type: 'button', 'aria-label': 'Close review notes', style: { color: 'var(--p-ink)' }, html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' });
    x.addEventListener('click', () => setNotes(false));
    drawer.append(x, h('h2', null, (s.sb ? s.sb + '  ' : '') + (s.menu || s.title)), h('div', { class: 'id' }, `${s.grp} · screen ${P.idx + 1} of ${SLIDES.length}` + (s.sb ? ` · storyboard ${s.sb}` : '')));
    if (sb.status) drawer.append(h('h3', null, 'Status in the storyboard'), h('p', null, sb.status));
    if (sb.notes) drawer.append(h('h3', null, 'Source and notes for reviewers'), h('p', null, sb.notes));
    if (n.build) drawer.append(h('h3', null, 'In this build'), h('ul', null, [].concat(n.build).map(b => h('li', null, b))));
    if (n.flags) { drawer.append(h('h3', null, 'To confirm')); [].concat(n.flags).forEach(f => drawer.append(h('div', { class: 'flag' }, f))); }
    if (!sb.status && !n.build && !n.flags) drawer.append(h('p', null, 'No notes for this screen.'));
  }

  /* ---------- bottom bar: play/pause, seekbar, replay | captions, settings, volume, full screen ---------- */
  const bPlay = $('bPlay'), seek = $('seek'), tElap = $('tElap'), tDur = $('tDur'), bReplay = $('bReplay');
  const bCC = $('bCC'), bSet = $('bSet'), setMenu = $('setMenu'), bVol = $('bVol'), volPop = $('volPop'), vol = $('vol'), bMute = $('bMute');
  const ICO_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13c0 .8.9 1.3 1.6.8l10-6.5c.6-.4.6-1.2 0-1.6l-10-6.5C8.9 4.2 8 4.7 8 5.5z"/></svg>';
  const ICO_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5" width="4" height="14" rx="1.2"/><rect x="13.5" y="5" width="4" height="14" rx="1.2"/></svg>';
  let dragging = false;
  /* what the Play/Pause button controls: the feedback narration if one is open, else a device layer (its live screen),
     else the slide's own timeline */
  const deviceOnly = () => P.holding && !P.layer;
  const isPlaying = () => { if (deviceOnly()) return !P.frozen; const a = active(); return !!(a && (a.playing || a.wantPlay)); };
  function setFrozen(on) { P.frozen = on; SFX.freeze(on); stage.classList.toggle('frozen', on); }
  function unfreeze() { if (P.frozen) setFrozen(false); }
  function togglePlay() {
    if (deviceOnly()) { setFrozen(!P.frozen); ui(); return; }
    const a = active(); if (!a) return;
    if (a.playing || a.wantPlay) { a.pause(); setFrozen(true); }
    else { unfreeze(); a.play(); }
    ui();
  }
  function ui() {
    const a = active();
    { const bN = $('bNext'), bP = $('bPrev'), tp = $('gateTip'); bN.setAttribute('aria-disabled', String(!!P.lock || P.idx >= SLIDES.length - 1)); bN.classList.toggle('locked', !!P.lock); if (!P.lock) tp.hidden = true; bP.disabled = P.idx === 0; }
    const playing = isPlaying();
    if (bPlay.dataset.on !== String(playing)) { // only on a change: a new icon under the pointer mid-click loses the click
      bPlay.dataset.on = String(playing); bPlay.innerHTML = playing ? ICO_PAUSE : ICO_PLAY; bPlay.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    }
    stage.classList.toggle('frozen', P.frozen);
    if (!a || !a.ready) { seek.max = 1; seek.value = 0; tElap.textContent = '0:00'; tDur.textContent = '0:00'; paintSeek(0); return; }
    const d = a.dur || 0;
    seek.max = Math.max(0.1, Math.ceil(d * 10) / 10).toFixed(1);
    if (!dragging) seek.value = a.t.toFixed(2);
    tElap.textContent = fmt(a.t); tDur.textContent = fmt(d);
    seek.setAttribute('aria-valuetext', `${fmt(a.t)} of ${fmt(d)}` + (a.kind === 'layer' ? ', feedback' : ''));
    paintSeek(d ? a.t / d : 0);
  }
  const paintSeek = (f) => { seek.style.setProperty('--p', (Math.max(0, Math.min(1, f)) * 100).toFixed(2) + '%'); };
  bPlay.addEventListener('click', () => { if (P.started) togglePlay(); else begin(null); });
  seek.addEventListener('input', () => { dragging = true; const a = active(); if (a) { a.seek(+seek.value); } dragging = false; });
  seek.addEventListener('change', () => { dragging = false; ui(); });
  // keyboard on the seekbar: arrows jump 5 seconds, Page keys 10, Home and End to the ends
  seek.addEventListener('keydown', (e) => {
    const a = active(); if (!a || !a.ready) return;
    const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: 10, PageDown: -10 }[e.key];
    if (step != null) { e.preventDefault(); a.seek(a.t + step); }
    else if (e.key === 'Home') { e.preventDefault(); a.seek(0); }
    else if (e.key === 'End') { e.preventDefault(); a.seek(a.dur); }
  });
  bReplay.addEventListener('click', () => { const a = active(); if (!a) return; unfreeze(); a.seek(0); a.play(); });
  const bPrev = $('bPrev'), bNext = $('bNext'), tip = $('gateTip'); let tipT = 0;
  const showTip = () => { tip.textContent = P.lock; tip.hidden = false; clearTimeout(tipT); tipT = setTimeout(() => { tip.hidden = true; }, 3200); };
  bPrev.addEventListener('click', () => { if (!P.started) return begin(null); if (P.idx > 0) show(P.idx - 1); });
  bNext.addEventListener('click', () => { if (!P.started) return begin(null); if (P.lock) { showTip(); return; } if (P.idx < SLIDES.length - 1) show(P.idx + 1); });
  bNext.addEventListener('mouseenter', () => { if (P.lock) showTip(); });
  bNext.addEventListener('focus', () => { if (P.lock) showTip(); });
  const applyAudio = () => { SFX.level(); [P.base, P.layer].forEach(t => t && t.syncAudio()); $('volWave').style.opacity = P.muted || P.vol === 0 ? '0' : '1'; bVol.setAttribute('aria-label', P.muted ? 'Volume, muted' : 'Volume'); };
  bCC.addEventListener('click', () => { P.cc = !P.cc; bCC.setAttribute('aria-pressed', String(P.cc)); placeCC(); });
  const menus = [[bSet, setMenu], [bVol, volPop]];
  const closeMenus = (except) => menus.forEach(([b, m]) => { if (m !== except) { m.hidden = true; b.setAttribute('aria-expanded', 'false'); } });
  menus.forEach(([b, m]) => b.addEventListener('click', () => { const open = m.hidden; closeMenus(); m.hidden = !open; b.setAttribute('aria-expanded', String(open)); if (open) { const f = m.querySelector('[aria-pressed="true"], input, button'); f && f.focus(); } }));
  document.addEventListener('click', (e) => { menus.forEach(([b, m]) => { if (!m.hidden && !m.contains(e.target) && !b.contains(e.target)) { m.hidden = true; b.setAttribute('aria-expanded', 'false'); } }); });
  /* settings: playback speed; slide size, to read the text larger (WCAG 1.4.4); and Show everything at once, so the
     slide's content is there straight away instead of coming in with the narration */
  function setGroup(id, title, items, cur, onPick) {
    const g = h('div', { class: 'grp', role: 'group', 'aria-labelledby': id }, h('h5', { id }, title));
    const btns = items.map(([v, label]) => {
      const b = h('button', { type: 'button', 'aria-pressed': String(v === cur) }, label);
      b.addEventListener('click', () => { btns.forEach(x => x.setAttribute('aria-pressed', String(x === b))); onPick(v); });
      return b;
    });
    g.append(...btns); setMenu.append(g);
  }
  setGroup('sgSpeed', 'Playback speed', [[0.75, '0.75x'], [1, 'Normal'], [1.25, '1.25x'], [1.5, '1.5x']], 1, (v) => { P.speed = v; applyAudio(); });
  setGroup('sgSize', 'Slide size', [[1, 'Fit the window'], [1.5, '150%'], [2, '200%']], P.zoom, (v) => { P.zoom = v; savePrefs(); fit(); });
  const bAll = h('button', { type: 'button', 'aria-pressed': String(P.instant) }, 'Show everything at once');
  bAll.addEventListener('click', () => {
    P.instant = !P.instant; bAll.setAttribute('aria-pressed', String(P.instant)); savePrefs();
    if (P.instant && P.base && P.base.ready) { P.base.items.forEach(it => { if (it.el) it.t = 0; }); P.base.apply(P.base.t, true); } // the slide on screen too
  });
  setMenu.append(h('div', { class: 'grp', role: 'group', 'aria-labelledby': 'sgShow' }, h('h5', { id: 'sgShow' }, 'Slide content'), bAll));
  vol.addEventListener('input', () => { P.vol = +vol.value; if (P.vol > 0 && P.muted) { P.muted = false; bMute.setAttribute('aria-pressed', 'false'); } applyAudio(); });
  bMute.addEventListener('click', () => { P.muted = !P.muted; bMute.setAttribute('aria-pressed', String(P.muted)); bMute.textContent = P.muted ? 'Unmute' : 'Mute'; applyAudio(); });
  $('bFull').addEventListener('click', () => { const d = document; if (!d.fullscreenElement) (d.documentElement.requestFullscreen ? d.documentElement.requestFullscreen() : Promise.reject()).catch(() => {}); else d.exitFullscreen && d.exitFullscreen(); });
  document.addEventListener('fullscreenchange', () => setTimeout(fit, 60));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const m = menus.find(([, mm]) => !mm.hidden);
      const L = [...stage.querySelectorAll('.pv-layer')].filter(x => !x.hidden && !x.classList.contains('bg') && x.layerApi).pop(); // an open layer closes first, wherever focus is
      if (m) { closeMenus(); m[0].focus(); } else if (drawer.classList.contains('open')) setNotes(false); else if (L) L.layerApi.hide(); else if (side.classList.contains('open') && !docked()) setSide(false);
    }
  });
  window.addEventListener('hashchange', () => { const i = SLIDES.findIndex(s => '#' + s.id === location.hash); if (i >= 0 && i !== P.idx) show(i); });

  /* ---------- start screen: narration needs one click before a browser will play it ---------- */
  const PLAY = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.6v10.8c0 .6.6.9 1.1.6l8.4-5.4c.5-.3.5-.9 0-1.2L5.1 2c-.5-.3-1.1 0-1.1.6z"/></svg>';
  const hint = h('p', { class: 'pl-sr', id: 'plHint' }, 'Tip for screen reader and keyboard users: slide content comes in with the narration. To have it all there straight away, open Settings in the player bar and turn on Show everything at once. Captions and a transcript are in the player too.');
  box.append(hint);
  let welcome = null;
  function buildCover() {
    const go = h('button', { class: 'cv-go', type: 'button', 'aria-describedby': 'plHint', html: '<span class="ic">' + PLAY + '</span>' + ((COURSE.cover || {}).go || 'Start the module') });
    const meta = (n, t) => h('div', { class: 'cv-meta' }, h('span', { class: 'n' }, n), h('span', null, t));
    const C = COURSE.cover || {};
    cover = h('div', { class: 'stage pov cover', role: 'region', 'aria-label': 'Start screen' },
      h('div', { class: 'pnl red cv-red' },
        h('img', { class: 'cv-logo', src: 'assets/img/jnj-medtech-white.png', alt: 'Johnson & Johnson MedTech' }),
        h('p', { class: 'eyebrow white cv-eye' }, C.eyebrow || ''),
        h('h1', { class: 'dh white cv-h', style: C.size ? { fontSize: C.size + 'px' } : null }, (C.title || []).map(([t, cls]) => h('span', { class: cls || '' }, t))),
        h('p', { class: 'cv-sub' }, C.sub || ''),
        go),
      h('div', { class: 'pnl photo cv-photo', 'aria-hidden': 'true' }, h('div', { class: 'photo', style: { backgroundImage: `url(${C.photo})`, backgroundPosition: C.pos || 'center' } })),
      h('div', { class: 'pnl gray cv-info' }, (C.meta || []).map(([n, t]) => meta(n, t))));
    go.addEventListener('click', () => begin(null));
    box.append(cover);
    stage.inert = true; // the first slide waits behind the cover
    return go;
  }
  function begin(i) { // the first click: narration can play from here on
    if (P.started) return;
    P.started = true; if (welcome) welcome.remove();
    stage.inert = false;
    if (cover) { const c = cover; cover = null; c.classList.add('leaving'); setTimeout(() => c.remove(), reduced ? 0 : 520); }
    show(i != null ? i : P.idx); // the slide builds fresh, so its panels come in as the cover leaves (show() also bookmarks it in the LMS)
    stage.focus({ preventScroll: true });
  }

  side.inert = true; side.setAttribute('aria-hidden', 'true'); drawer.inert = true;
  if (window.innerWidth >= 1500) setSide(true, true); // on a laptop the menu starts closed, so the slide (and its text) is as large as it can be
  $('bSkip').addEventListener('click', () => { if (!P.started) (welcome || cover).querySelector('button').focus(); else stage.focus(); });
  /* text spacing (WCAG 1.4.12): if a learner widens line, letter or word spacing (a browser setting, an extension, a
     bookmarklet), a text box whose text no longer fits scrolls, and a box that grows past the bottom of the slide moves
     up, then scrolls if it still doesn't fit. Nothing changes at the course's own spacing. */
  const BOXES = '.card, .fbcard, .lay-panel, .note';
  window.POV_LAYOUT_LOG = [];
  function settle() {
    const sr = stage.getBoundingClientRect(), k = P.scale;
    // a side card under a layer's task card moves down when the task card grows, and keeps the room that's left
    stage.querySelectorAll('.pv-side').forEach(sd => {
      const hd = sd.parentElement && [...sd.parentElement.children].find(x => x.classList.contains('pv-lhead'));
      if (!hd || !hd.offsetParent) return;
      const need = hd.offsetTop + hd.offsetHeight + 12;
      if (sd.offsetTop < need) { sd.style.top = need + 'px'; sd.style.height = Math.max(120, 702 - need) + 'px'; sd.style.overflowY = 'auto'; POV_LAYOUT_LOG.push('side down'); }
    });
    stage.querySelectorAll(BOXES).forEach(el => {
      if (!el.offsetParent || el.closest('[hidden]')) return;
      const cs = getComputedStyle(el);
      if (el.scrollHeight > el.clientHeight + 2 && (cs.overflowY === 'visible' || cs.overflowY === 'hidden')) { el.style.overflowY = 'auto'; POV_LAYOUT_LOG.push('scroll ' + el.className); }
      if (el.style.overflowY === 'auto' && !el.hasAttribute('tabindex') && !el.querySelector('button, input, [tabindex="0"]')) el.tabIndex = 0; // a box that scrolls and has nothing to tab to can be scrolled from the keyboard
      const r = el.getBoundingClientRect(), top = (r.top - sr.top) / k, bottom = (r.bottom - sr.top) / k, LIM = 716; // on the slide, transforms included
      const fromBottom = el.style.bottom && el.style.bottom !== 'auto' && (!el.style.top || el.style.top === 'auto');
      if (!fromBottom && bottom > LIM && cs.position === 'absolute') {
        const up = Math.min(bottom - LIM, Math.max(0, top - 8));
        if (up > 0) { el.style.top = (el.offsetTop - up) + 'px'; POV_LAYOUT_LOG.push('up ' + Math.round(up) + ' ' + el.className); }
        if (bottom - up > LIM) { el.style.maxHeight = (LIM - 8) + 'px'; el.style.overflowY = 'auto'; POV_LAYOUT_LOG.push('cap ' + el.className); }
      } else if (fromBottom && top < 4) { el.style.maxHeight = (bottom - 8) + 'px'; el.style.overflowY = 'auto'; POV_LAYOUT_LOG.push('cap ' + el.className); }
    });
    // the device's soft keys have a fixed size: their labels get a little smaller instead (down to 70%)
    stage.querySelectorAll('.pv-keys .sk').forEach(k => {
      if (!k.dataset.fs) k.dataset.fs = parseFloat(getComputedStyle(k).fontSize);
      let fs = parseFloat(k.style.fontSize) || +k.dataset.fs;
      const over = () => k.scrollHeight > k.clientHeight + 4 || k.scrollWidth > k.clientWidth + 1;
      if (!over() && fs < +k.dataset.fs) { k.style.fontSize = ''; fs = +k.dataset.fs; } // spacing back to normal
      while (over() && fs > k.dataset.fs * 0.6) { fs -= 1; k.style.fontSize = fs + 'px'; }
      if (k.style.fontSize) POV_LAYOUT_LOG.push('key ' + k.textContent.trim());
    });
    // a monitor's numbers sit at fixed heights: a block that grows into the next one gets a little smaller
    stage.querySelectorAll('.monitor').forEach(m => {
      const nums = [...m.children].filter(n => n.classList.contains('num')).sort((a, b) => a.offsetTop - b.offsetTop);
      nums.forEach(n => { n.style.transform = ''; });
      nums.forEach((n, i) => {
        const nx = nums[i + 1]; if (!nx) return;
        const room = nx.offsetTop - n.offsetTop - 2;
        if (room > 0 && n.offsetHeight > room + 3) { n.style.transformOrigin = 'right top'; n.style.transform = `scale(${Math.max(0.6, room / n.offsetHeight).toFixed(3)})`; POV_LAYOUT_LOG.push('num ' + n.textContent.trim()); }
      });
    });
  }
  let settleT = 0;
  const settleSoon = () => { clearTimeout(settleT); settleT = setTimeout(settle, 120); };
  new MutationObserver(settleSoon).observe(document.head, { childList: true, subtree: true, attributes: true }); // a stylesheet added or changed
  new MutationObserver(settleSoon).observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
  window.addEventListener('resize', settleSoon);
  /* icons drawn as svg say nothing to a screen reader unless they carry a label */
  const quiet = (root) => root.querySelectorAll('svg:not([aria-label]):not([aria-labelledby]):not([role]):not([aria-hidden])').forEach(v => { v.setAttribute('aria-hidden', 'true'); v.setAttribute('focusable', 'false'); });
  new MutationObserver((ms) => { let added = false; ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) { added = true; quiet(n.tagName.toLowerCase() === 'svg' ? n.parentNode : n); } })); if (added) settleSoon(); }).observe(stage, { childList: true, subtree: true });
  if (document.fonts) document.fonts.ready.then(settleSoon);
  fit();
  const start = SLIDES.findIndex(s => '#' + s.id === location.hash);
  const back = LMS ? LMS.resumeAt(SLIDES) : -1; // a return visit from the LMS: offer the slide where the learner left off
  show(start >= 0 ? start : 0);
  if (back > 0) {
    const r = SLIDES[back];
    const bRes = h('button', { class: 'go', type: 'button', html: '<span class="ic" aria-hidden="true">' + PLAY + '</span>Resume' });
    const bNew = h('button', { class: 'alt', type: 'button' }, 'Start from the beginning');
    const where = (r.grp && /^Module/.test(r.grp) ? r.grp.split(' · ')[0] + ', ' : '') + (r.menu || r.title);
    welcome = h('div', { class: 'pl-resume', role: 'dialog', 'aria-labelledby': 'rsT', 'aria-describedby': 'rsD' },
      h('div', { class: 'rs-card' }, h('h2', { id: 'rsT' }, 'Welcome back'),
        h('p', { id: 'rsD' }, 'You left off at ', h('b', null, where), '. Pick up from there?'),
        h('div', { class: 'row' }, bRes, bNew)));
    bRes.addEventListener('click', () => begin(back));
    bNew.addEventListener('click', () => begin(0));
    mid.append(welcome); // over the whole middle of the player, so it has room on a phone held upright
    setTimeout(() => bRes.focus(), 50);
  } else {
    const go = buildCover(); fit();
    setTimeout(() => go.focus(), 50);
  }
  window.POV_PLAYER = { show, P, active, start: () => begin(null), resume: () => begin(back > 0 ? back : null) };
})();

