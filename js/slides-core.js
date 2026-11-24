/* S.P.A.R.K.S. Module 5, Principles of Energy Device Management: review build of the storyboard.
   Layouts follow the J&J paneling system on a 1280 x 720 grid with 56 px margins. Type always sits on a solid panel.
   Each slide builds its objects, then hands them to the narration timeline: cue keys are sentence numbers in the clip
   ('pre' = before the narration, 'last' = the last sentence, 'end' = when it finishes).
   This file: shared helpers, the Introduction and "How energy devices work". */
(function () {
  'use strict';
  const { h, ICON } = UI;
  const S = window.SLIDES = [];
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IMG = (n) => `url(assets/img/${n}.jpg)`;
  const G = { intro: 'Introduction', how: 'How energy devices work', types: 'Types of energy-based surgery', comp: 'Complications', care: 'Best nursing practices', end: 'Post-test and close' };

  window.POV_COURSE = {
    cover: {
      eyebrow: 'S.P.A.R.K.S. · Module 5', title: [['Energy device'], ['management', 'in1']], size: 88,
      sub: 'The principles behind the energy devices used in the operating room.',
      photo: 'assets/img/cover.jpg', pos: '28% center', go: 'Start the module',
      meta: [['25', 'minutes, narrated'], ['40', 'short screens and a post-test'], ['CC', 'captions and a transcript in the player']]
    }
  };

  /* ---------- helpers ---------- */
  const at = (el, l, t, w, hgt) => { Object.assign(el.style, { position: 'absolute', left: l + 'px', top: t + 'px' }); if (w != null) el.style.width = w + 'px'; if (hgt != null) el.style.height = hgt + 'px'; return el; };
  const pnl = (kind, l, t, w, hgt, from, ...kids) => at(h('div', { class: `pnl ${kind} from-${from || 'l'}` }, ...kids), l, t, w, hgt);
  const photoPnl = (name, pos, l, t, w, hgt, from) => pnl('photo', l, t, w, hgt, from, h('div', { class: 'photo kb', 'aria-hidden': 'true', style: { backgroundImage: IMG(name), backgroundPosition: pos || 'center' } }));
  const dh = (lines, size, extra) => h('h2', { class: 'dh' + (extra ? ' ' + extra : ''), style: size ? { fontSize: size + 'px' } : null }, lines.map(([t, cls]) => h('span', { class: cls || '' }, t)));
  const head = (eyebrow, eyeCls, lines, size, x, y, w, extra) => at(h('div', { class: 'abs' }, h('p', { class: 'eyebrow ' + eyeCls }, eyebrow), dh(lines, size, extra)), x, y, w);
  const doneMark = () => h('div', { 'aria-hidden': 'true', html: '<svg class="done-mark" viewBox="0 0 92 92"><circle cx="46" cy="46" r="42"/><path d="M27 47l13 13 25-27"/></svg>' });
  const svg = (vb, inner, cls, label) => h('div', { class: 'svgbox ' + (cls || ''), role: label ? 'img' : null, 'aria-label': label || null, 'aria-hidden': label ? null : 'true', html: `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>` });
  const fine = (t, x, y, w, cls) => at(h('p', { class: 'fine abs ' + (cls || '') }, t), x, y, w);
  /* a key-line row: optional numeral, a bold lead and a line of detail */
  const krow = (n, lead, sub, cls) => h('div', { class: 'krow ' + (cls || '') }, n != null ? h('span', { class: 'kn', 'aria-hidden': 'true' }, n) : null, h('div', null, h('b', null, lead), sub ? h('span', null, sub) : null));
  const ckrow = (text) => h('div', { class: 'ckrow' }, h('span', { class: 'ck', 'aria-hidden': 'true', html: ICON.check }), h('p', { html: text }));

  function isolate(ctx, keep) {
    const others = [...ctx.stage.children].filter(c => c !== keep);
    others.forEach(c => { c.inert = true; });
    const trap = (e) => { // Tab cycles inside the layer, as in a Storyline modal layer
      if (e.key !== 'Tab') return;
      const f = [...keep.querySelectorAll('button:not([disabled]), [href], input, video[controls], [tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    keep.addEventListener('keydown', trap);
    return () => { keep.removeEventListener('keydown', trap); others.forEach(c => { c.inert = false; }); };
  }
  /* feedback card over the slide; its narration plays on its own timeline, as a Storyline layer does */
  function feedback(ctx, o) {
    const body = () => { // the narration repeats the title ("That's right. ..."); on screen it reads once
      const t = window.POV_VO_TEXT[o.vo] || o.text || '', m = t.match(/^([^.!?]+)[.!?]\s+/);
      const n = (x) => x.trim().toLowerCase().replace(/’/g, "'");
      return m && n(m[1]) === n(String(o.title)) ? t.slice(m[0].length) : t;
    };
    const ic = o.kind === 'ok' ? ICON.check : o.kind === 'no' ? ICON.cross : ICON.arrow;
    const btns = o.buttons.map(([label, fn, ghost]) => {
      const b = h('button', { class: 'btn sm' + (ghost ? ' ghost' : ''), type: 'button' }, label);
      b.addEventListener('click', () => { close(); fn && fn(); });
      return b;
    });
    const card = h('div', { class: 'fbcard ' + o.kind, role: 'alertdialog', 'aria-modal': 'true', 'aria-labelledby': 'fbT', 'aria-describedby': 'fbD' },
      h('div', { class: 'tt', id: 'fbT' }, h('span', { class: 'ic', 'aria-hidden': 'true', html: ic }), o.title),
      h('p', { id: 'fbD' }, body()),
      h('div', { class: 'row' }, btns));
    const wrap = h('div', { class: 'fbx' + (o.right ? ' right' : '') }, card);
    ctx.stage.append(wrap);
    const release = isolate(ctx, wrap);
    if (o.vo) ctx.layerVO(o.vo);
    setTimeout(() => btns[0].focus(), 60);
    function close() { ctx.endLayerVO(); release(); wrap.remove(); }
    return close;
  }
  /* a Storyline-style layer: panel over the slide, Escape closes it, focus goes back to the opener */
  function layer(ctx, panel, opener, onClose) {
    const L = h('div', { class: 'pv-layer', role: 'dialog', 'aria-modal': 'true', 'aria-label': panel.getAttribute('aria-label') || 'Details' }, h('div', { class: 'scrim' }), panel);
    ctx.stage.append(L);
    const release = isolate(ctx, L);
    const hide = () => { ctx.hold(false); release(); L.remove(); opener && opener.focus(); onClose && onClose(); };
    L.layerApi = { hide };
    L.querySelector('.scrim').addEventListener('click', hide);
    ctx.hold(true);
    setTimeout(() => { const f = L.querySelector('[data-focus]') || L.querySelector('button'); f && f.focus(); }, 60);
    return hide;
  }
  /* the player's volume and mute also apply to videos on the slide */
  const tuneVideo = (v) => { const P = (window.POV_PLAYER || {}).P; if (P) { v.volume = P.vol; v.muted = P.muted; } };
  const EDU = 'Illustrative example for educational purposes only.';
  /* a video in a layer: the slide's narration waits while it is open */
  function videoLayer(ctx, o, opener, onClose) {
    const v = h('video', { src: `assets/video/${o.src}.mp4`, poster: `assets/img/poster-${o.src}.jpg`, controls: true, playsinline: true, preload: 'metadata', 'aria-label': o.title });
    const x = h('button', { class: 'x', type: 'button', 'aria-label': 'Close', html: ICON.close });
    const done = h('button', { class: 'btn sm', type: 'button', 'data-focus': '' }, 'Close');
    const panel = h('div', { class: 'lay-panel vid', 'aria-label': o.title },
      h('div', { class: 'vhead' }, h('p', { class: 'eyebrow red' }, o.eyebrow || 'Video'), h('h3', null, o.title)),
      h('div', { class: 'vframe' }, v),
      h('div', { class: 'vfoot' }, h('p', { class: 'fine' }, o.note || EDU), done), x);
    const hide = layer(ctx, panel, opener, onClose);
    x.addEventListener('click', hide); done.addEventListener('click', hide);
    v.addEventListener('play', () => tuneVideo(v));
    setTimeout(() => { tuneVideo(v); v.play().catch(() => {}); }, 350);
    return hide;
  }
  function countUp(el) {
    const n = el.querySelector('.n'), to = +n.dataset.to, suf = n.dataset.suf || '';
    if (reduced) { n.textContent = to + suf; return; }
    const t0 = performance.now(), dur = 1100;
    const step = (now) => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); n.textContent = Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  const add = (s) => { s.idx = S.length; s.title = s.title || s.menu; s.menu = (s.sb ? s.sb + '  ' : '') + s.menu; S.push(s); };

  /* a section opener: the section number and title on red, a photo, and what the section covers */
  function divider(o) {
    add({
      id: o.id, sb: o.sb, grp: o.grp, menu: o.menu, vo: [['Narration', o.vo]],
      build(ctx) {
        const ph = o.ph || 410;
        const red = pnl('red', 0, 0, 700, 720, 'l',
          at(h('p', { class: 'eyebrow white abs' }, o.eyebrow), 56, 56, 580),
          at(h('div', { class: 'sec-n abs', 'aria-hidden': 'true' }, o.n), 46, 100),
          at(h('h1', { class: 'dh white abs', style: { fontSize: (o.size || 62) + 'px' } }, o.lines.map(([t, c]) => h('span', { class: c || '' }, t))), 56, 356, 610));
        const pic = photoPnl(o.photo, o.pos, 700, 0, 580, ph, 'r');
        const gray = pnl('gray', 700, ph, 580, 720 - ph, 'b');
        const list = at(h('div', { class: 'abs sec-list' + (o.items.length > 4 ? ' tight' : '') }, h('p', { class: 'eyebrow red dk' }, 'In this section'),
          o.items.map((t, i) => h('div', { class: 'sec-item' }, h('span', { class: 'kn', 'aria-hidden': 'true' }, String(i + 1)), h('span', null, t)))), 756, ph + 30, 468);
        ctx.stage.append(red, pic, gray, list);
        ctx.timeline(o.vo, { pre: [[red, 0.05], [pic, 0.3], [gray, 0.55]], 0: [[list, 0.9]] });
      },
      notes: o.notes
    });
  }
  /* a short opener for one energy type, with its place among the four */
  const TYPES = ['Monopolar', 'Bipolar', 'Advanced bipolar', 'Ultrasonic'];
  function typeOpener(o) {
    add({
      id: o.id, sb: o.sb, grp: G.types, menu: o.menu, vo: [['Narration', o.vo]],
      build(ctx) {
        const pic = photoPnl(o.photo, o.pos, 0, 0, 440, 720, 'l');
        const hd = at(h('div', { class: 'abs' }, h('p', { class: 'eyebrow red' }, 'Types of energy-based surgery'), h('h1', { class: 'dh', style: { fontSize: '84px' } }, o.lines.map(([t, c]) => h('span', { class: c || '' }, t)))), 508, 150, 720);
        const track = at(h('div', { class: 'abs ttrack', role: 'list', 'aria-label': 'The four energy types' },
          TYPES.map((t, i) => h('div', { class: 'tstep' + (i === o.i ? ' on' : i < o.i ? ' past' : ''), role: 'listitem', 'aria-current': i === o.i ? 'step' : null }, h('span', { class: 'n', 'aria-hidden': 'true' }, '0' + (i + 1)), h('span', null, t)))), 508, 470, 716);
        ctx.stage.append(pic, hd, track);
        ctx.timeline(o.vo, { pre: [[pic, 0.05]], 0: [hd, [track, 0.5]] });
      },
      notes: o.notes
    });
  }

  window.E = { h, ICON, S, G, reduced, IMG, at, pnl, photoPnl, dh, head, doneMark, svg, fine, krow, ckrow, isolate, feedback, layer, videoLayer, tuneVideo, EDU, countUp, add, divider, typeOpener, TYPES };

  /* ====================== A. Introduction ====================== */

  /* 5.1 welcome */
  add({
    id: 'welcome', sb: '5.1', grp: G.intro, menu: 'Welcome', title: 'Principles of Energy Device Management', vo: [['Narration', 'welcome']],
    build(ctx) {
      const st = ctx.stage;
      const p1 = pnl('red', 0, 0, 620, 340, 'l',
        at(h('p', { class: 'eyebrow white abs' }, 'S.P.A.R.K.S. · Module 5'), 56, 52, 520),
        at(h('div', { class: 't-word abs', 'aria-hidden': 'true', style: { fontSize: '86px' } }, 'Energy', h('br'), 'device'), 52, 118));
      const p2 = photoPnl('or-wide', '50% 40%', 620, 0, 660, 460, 'r');
      const p3 = pnl('red', 500, 460, 780, 170, 'b',
        at(h('div', { class: 'abs', 'aria-hidden': 'true', style: { font: '400 68px/1 "Johnson Display", Georgia, serif', letterSpacing: '-.01em', whiteSpace: 'nowrap' } }, 'management'), 52, 50));
      const h1 = h('h1', { class: 'pl-sr' }, 'Principles of Energy Device Management');
      const lead = at(h('p', { class: 'lead abs' }, 'The principles behind the energy devices used in the operating room.'), 56, 380, 400);
      const go = h('button', { class: 'btn', type: 'button', html: `Let’s begin ${ICON.arrow}` });
      go.addEventListener('click', () => ctx.go(1));
      const goWrap = at(h('div', { class: 'abs' }, go), 56, 524);
      const logo = at(h('img', { class: 'abs', src: 'assets/img/jnj-medtech-red.png', alt: 'Johnson & Johnson MedTech', style: { height: '38px' } }), 56, 612);
      const fp = at(h('p', { class: 'fine abs' }, h('span', { class: 'disclaim' }, 'Review build of the storyboard. Content to be confirmed by J&J Medical Affairs.')), 540, 636, 690);
      st.append(h1, p1, p2, p3, lead, goWrap, logo, fp);
      ctx.timeline('welcome', { pre: [[p1, 0.05], [p2, 0.3], [p3, 0.6], [logo, 0.9], [fp, 1.0]], 2: [lead], 3: [goWrap] });
    },
    notes: { build: ['Narration is the current approved welcome, re-voiced in the new voice.', 'Photo from the J&J brand photo library.'] }
  });

  /* 5.2 Halsted's principles */
  const HALSTED = ['Gentle handling of tissues minimizes tissue trauma.', 'Careful hemostasis helps improve visualization and reduce infection.', 'Judicious dissection preserves the blood supply to the organs and tissues.', 'Strict aseptic technique helps prevent infection.', 'Minimizing wound edge tension ensures adequate blood supply to healing tissues.', 'Accurate tissue apposition promotes healing.', 'Eliminate dead space to prevent seroma formation and infection.'];
  add({
    id: 'halsted', sb: '5.2', grp: G.intro, menu: 'Halsted’s principles', title: 'Halsted’s principles of tissue management', vo: [['Narration', 'halsted']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Tissue management', 'red', [['Halsted’s'], ['principles', 'in1 r']], 58, 56, 38, 640);
      const rows = HALSTED.map((t, i) => h('li', { class: 'hrow' }, h('span', { class: 'kn', 'aria-hidden': 'true' }, String(i + 1)), h('span', null, t)));
      const list = at(h('ol', { class: 'abs hlist' }, rows), 56, 196, 700);
      const pic = pnl('photo', 820, 0, 460, 590, 'r', h('div', { class: 'photo', role: 'img', 'aria-label': 'Portrait of William S. Halsted', style: { backgroundImage: IMG('halsted'), backgroundPosition: '50% 12%' } }));
      const name = pnl('red', 820, 590, 460, 130, 'b', at(h('div', { class: 'abs' }, h('p', { style: { font: '400 34px/1.1 "Johnson Display", Georgia, serif' } }, 'William S. Halsted, M.D.')), 36, 26, 400));
      st.append(hd, list, pic, name);
      const mark = () => { rows[1].classList.add('hl'); rows[2].classList.add('hl'); };
      ctx.timeline('halsted', { pre: [[pic, 0.1], [name, 0.4]], 0: [hd, [list, 1.2]], 2: [[mark, 3.2]] });
    },
    notes: { build: ['The second and third principles highlight when the narrator names them.', 'Portrait from the current module.'] }
  });

  /* 5.3 learning objectives */
  const OBJ = ['Understand the principles underlying the use of energy-based devices in the operating room.', 'Compare and contrast the types of energy-based surgery.', 'Understand complications of surgical energy devices.', 'Get ready to implement evidence-based best practices for using energy-based devices in the operating room.'];
  add({
    id: 'objectives', sb: '5.3', grp: G.intro, menu: 'Learning objectives', vo: [['Narration', 'objectives']],
    build(ctx) {
      const st = ctx.stage;
      const red = pnl('red', 0, 0, 500, 720, 'l',
        at(h('div', { class: 'abs' }, h('p', { class: 'eyebrow white' }, 'What you will learn'), dh([['Learning'], ['objectives', 'in1']], 64, 'white')), 56, 56, 420),
        at(h('p', { class: 'lead abs', style: { color: '#fff' } }, 'By the end of this module, you will be able to:'), 56, 520, 380));
      const rows = OBJ.map((t, i) => h('div', { class: 'krow big' }, h('span', { class: 'kn', 'aria-hidden': 'true' }, '0' + (i + 1)), h('div', null, h('p', null, t))));
      const list = at(h('div', { class: 'abs' }, rows), 560, 56, 664);
      st.append(red, list);
      ctx.timeline('objectives', { pre: [[red, 0.05]], 0: [[rows[0], 3.4]], 1: [rows[1]], 2: [rows[2]], 3: [rows[3]] });
    }
  });

  /* 5.4 the first surgery using electrosurgery */
  add({
    id: 'first-surgery', sb: '5.4', grp: G.intro, menu: 'The first surgery using electrosurgery', title: 'When was the first surgery performed using electrosurgery?', vo: [['Narration', 'first']],
    build(ctx) {
      const st = ctx.stage;
      const bg = pnl('gray', 0, 0, 860, 720, 'l');
      const hd = head('A look back', 'red dk', [['When was the first'], ['surgery performed using', 'in1'], ['electrosurgery?', 'r']], 50, 56, 44, 780);
      const person = (img, alt, name, role, did, pos) => h('figure', { class: 'pcard' }, h('div', { class: 'ph', role: 'img', 'aria-label': alt, style: { backgroundImage: IMG(img), backgroundPosition: pos || 'center' } }), h('figcaption', null, h('b', null, name), h('span', null, role), h('span', { class: 'did' }, did)));
      const c1 = at(person('bovie-unit', 'An early Bovie electrosurgical unit', 'William T. Bovie', 'Scientist', 'Invented the electrosurgical unit'), 56, 268);
      const c2 = at(person('cushing', 'Dr. Harvey Cushing at his desk', 'Dr. Harvey Cushing', 'Neurosurgeon', 'First surgery using electrosurgery', '50% 20%'), 446, 268);
      const red = pnl('red', 860, 0, 420, 720, 'r');
      const q = at(h('div', { class: 'abs bigq', 'aria-hidden': 'true' }, '?'), 968, 150);
      const date = at(h('div', { class: 'abs datebox', role: 'status' }, h('p', { class: 'eyebrow white' }, 'The first surgery'), h('p', { class: 'd1' }, 'October 1,'), h('p', { class: 'd2' }, '1926'), h('p', { class: 'd3' }, 'Boston, Massachusetts')), 908, 190, 330);
      const cr = fine('Images from the current S.P.A.R.K.S. module.', 56, 598, 700);
      st.append(bg, hd, c1, c2, red, q, date, cr);
      ctx.timeline('first', { pre: [[bg, 0.05], [red, 0.3], [q, 0.9]], 0: [hd], 3: [[c1, 0.6], [c2, 4.6], cr], 7: [() => { q.classList.add('gone'); }, [date, 0.25]] });
    },
    notes: { build: ['The question stays open on the red panel until the narrator gives the date.', 'The current module has no portrait of Bovie, so his card shows the unit he invented.'] }
  });

  /* 5.5 the history of electrosurgery */
  add({
    id: 'history', sb: '5.5', grp: G.intro, menu: 'The history of electrosurgery', vo: [['Narration', 'history']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Electrosurgery', 'red', [['Almost a century'], ['of use', 'in1 r']], 62, 56, 52, 560);
      const tl = at(h('div', { class: 'abs yrs' },
        h('div', { class: 'yr' }, h('b', null, '1926'), h('span', null, 'First surgery using electrosurgery')),
        h('div', { class: 'yr' }, h('b', null, '1932'), h('span', null, 'Cushing retires'))), 56, 262, 520);
      const pic = photoPnl('or-lights', '50% 40%', 0, 440, 600, 280, 'b');
      const red = pnl('red', 640, 0, 640, 720, 'r');
      const row = (to, label) => h('div', { class: 'bigrow dim' }, h('div', { class: 'n', 'data-to': to, 'data-suf': '%' }, to + '%'), h('div', { class: 'l' }, label));
      const r1 = row(90, 'mortality in procedures that opened the skull, before electrosurgery'), r2 = row(10, 'by 1932, when Cushing retired');
      const list = at(h('div', { class: 'abs' }, h('p', { class: 'eyebrow white' }, 'Mortality'), r1, r2), 696, 80, 528);
      st.append(hd, tl, pic, red, list);
      const cu = (el) => () => { el.classList.remove('dim'); countUp(el); };
      ctx.timeline('history', { pre: [[red, 0.1], [pic, 0.4]], 0: [hd, [tl, 2.0]], 3: [list], 4: [[cu(r1), 5.0]], 5: [[cu(r2), 5.6]] });
    },
    notes: { build: ['The two figures light up and count as the narrator says them.'] }
  });

  /* ====================== B. How energy devices work ====================== */
  divider({
    id: 'how-it-works', sb: '5.6', grp: G.how, menu: 'How energy-based devices work', vo: 'sec-b', n: '01', eyebrow: 'Section 1 of 4',
    lines: [['What are energy-based'], ['devices and how do', 'in1'], ['they work?']], size: 54, photo: 'or-team', pos: '50% 30%',
    items: ['The basic principles of electricity', 'What electrosurgery is', 'How heat and waveforms change the effect on tissue']
  });

  /* 5.7 basic electricity terms */
  const TERMS = [
    { k: 'i', sym: 'I', name: 'Current', unit: 'amps', def: 'The flow of electrons through a circuit.' },
    { k: 'v', sym: 'V', name: 'Voltage', unit: 'volts', def: 'The force that pushes the current.' },
    { k: 'r', sym: 'Ω', name: 'Impedance, or resistance', unit: 'ohms', def: 'How strongly tissue resists the current.' },
    { k: 'p', sym: 'W', name: 'Power', unit: 'watts', def: 'The rate at which energy is delivered.' }
  ];
  const CIRCUIT = `
    <path class="wire" d="M70 60 H450 V240 H70 Z"/>
    <g class="pt-v"><rect x="50" y="128" width="40" height="44" fill="#F1EFED"/><path d="M48 140 H92" stroke-width="3"/><path d="M58 160 H82" stroke-width="7"/><text x="112" y="158">Voltage</text></g>
    <g class="pt-r"><rect x="196" y="44" width="128" height="32" fill="#F1EFED"/><polyline points="196,60 210,44 226,76 242,44 258,76 274,44 290,76 306,44 324,60" fill="none" stroke-width="3" stroke-linejoin="round"/><text x="260" y="30" text-anchor="middle">Impedance</text></g>
    <g class="pt-p"><circle class="glow" cx="450" cy="150" r="34"/><circle cx="450" cy="150" r="20" fill="#fff" stroke-width="3"/><path d="M440 150 H460 M450 140 V160" stroke-width="3"/><text x="404" y="158" text-anchor="end">Power</text></g>
    <g class="pt-i"><path id="loop" d="M70 240 V60 H450 V240 Z" fill="none" stroke="none"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<circle r="6"><animateMotion dur="7s" begin="-${(i * 7 / 8).toFixed(2)}s" repeatCount="indefinite"><mpath href="#loop"/></animateMotion></circle>`).join('')}
      <text x="260" y="276" text-anchor="middle">Current</text></g>`;
  add({
    id: 'terms', sb: '5.7', grp: G.how, menu: 'Basic electricity terms', vo: [['Narration', 'terms']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('The basics', 'red', [['Basic electricity'], ['terms', 'in1 r']], 56, 56, 40, 560);
      const gray = pnl('gray', 640, 0, 640, 720, 'r');
      const circ = at(svg('0 0 520 300', CIRCUIT, 'circuit', 'A simple circuit: voltage pushes current around the loop, impedance resists it, and power is delivered at the far side.'), 680, 36, 560);
      const sym = h('span', { class: 'sym', 'aria-hidden': 'true' }, '');
      const nm = h('p', { class: 'cat' }, 'Select a term');
      const df = h('p', { class: 'body' }, 'Four properties of electricity decide the effect on tissue.');
      const card = at(h('div', { class: 'abs tcard kl', 'aria-live': 'polite' }, h('div', { class: 'th' }, sym, nm), df), 696, 390, 528);
      const formula = at(h('p', { class: 'abs formula' }, h('b', null, 'Power'), ' = voltage × current'), 696, 610, 528);
      const seen = new Set();
      const count = h('span', { class: 'counter', 'aria-live': 'polite' }, h('b', null, '0'), ' of 4 explored');
      const guide = at(h('div', { class: 'abs', style: { display: 'flex', alignItems: 'center', gap: '18px' } }, h('p', { class: 'body' }, 'Select each term.'), count), 56, 196, 560);
      ctx.lock('Explore all four terms to go on.');
      const btns = TERMS.map((t, i) => {
        const b = h('button', { class: 'term', type: 'button', 'aria-pressed': 'false' }, h('span', { class: 'sym', 'aria-hidden': 'true' }, t.sym), h('span', { class: 'tx' }, h('b', null, t.name), h('span', null, t.unit)), h('span', { class: 'chip ok done', hidden: true, html: ICON.check + 'Explored' }));
        b.addEventListener('click', () => {
          btns.forEach((x, j) => x.setAttribute('aria-pressed', String(j === i)));
          circ.dataset.sel = t.k;
          const swap = () => { sym.textContent = t.sym; nm.textContent = t.name + ' (' + t.unit + ')'; df.textContent = t.def; card.classList.remove('swap'); };
          if (reduced) swap(); else { card.classList.add('swap'); setTimeout(swap, 180); }
          seen.add(t.k); b.classList.add('seen'); b.querySelector('.done').hidden = false;
          count.firstChild.textContent = String(seen.size);
          if (seen.size === TERMS.length) ctx.unlock();
        });
        return b;
      });
      const list = at(h('div', { class: 'abs terms' }, btns), 56, 250, 540);
      st.append(hd, gray, circ, card, formula, guide, list);
      ctx.timeline('terms', { pre: [[gray, 0.05], [circ, 0.4]], 0: [hd], 1: [guide, card], 2: [btns[0]], 4: [btns[1]], 6: [btns[2]], 9: [btns[3]], 10: [formula] });
    },
    notes: { build: ['Each term highlights its part of the circuit. Next unlocks after all four are opened.'] }
  });

  /* 5.8 what is electrosurgery */
  const ESU = `
    <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#EB1700"/></marker></defs>
    <g class="p-gen"><rect x="40" y="96" width="176" height="118" rx="6" fill="#fff" stroke="#000" stroke-width="2.5"/><rect x="58" y="114" width="84" height="40" fill="#F1EFED" stroke="#81766F" stroke-width="1.5"/><circle cx="174" cy="134" r="14" fill="none" stroke="#000" stroke-width="2.5"/><circle cx="70" cy="186" r="7" fill="#EB1700"/><circle cx="98" cy="186" r="7" fill="#000"/><text x="128" y="82" text-anchor="middle">Generator</text></g>
    <g class="p-table"><path d="M560 208 H1040" stroke="#C1BBB3" stroke-width="10" stroke-linecap="round"/><path d="M640 213 V262 M960 213 V262" stroke="#C1BBB3" stroke-width="8" stroke-linecap="round"/></g>
    <g class="p-pat"><rect x="640" y="158" width="300" height="44" rx="22" fill="#E8E6E3" stroke="#81766F" stroke-width="2"/><circle cx="978" cy="176" r="24" fill="#E8E6E3" stroke="#81766F" stroke-width="2"/><text x="930" y="132" text-anchor="middle">Patient</text></g>
    <g class="p-ret"><rect x="700" y="199" width="130" height="10" rx="3" fill="#B81200"/><text x="765" y="250" text-anchor="middle">Return electrode</text></g>
    <g class="p-act"><path d="M690 66 L738 148" stroke="#1F1A17" stroke-width="12" stroke-linecap="round"/><path d="M738 148 L746 160" stroke="#EB1700" stroke-width="5" stroke-linecap="round"/><text x="772" y="92">Active electrode</text></g>
    <g class="flow"><path class="w" d="M216 124 H420 V40 H690 V62"/><path class="w thru" d="M746 162 L756 196"/><path class="w" d="M700 204 H540 V280 H128 V216"/>
      <path class="dir" d="M300 124 H360" marker-end="url(#ah)"/><path class="dir" d="M420 280 H350" marker-end="url(#ah)"/></g>`;
  add({
    id: 'what-is-electrosurgery', sb: '5.8', grp: G.how, menu: 'What is electrosurgery?', vo: [['Narration', 'what']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('The circuit', 'red', [['What is electrosurgery?']], 52, 56, 34, 900);
      const circ = at(svg('0 0 1168 300', ESU, 'esu', 'The electrosurgical circuit: current flows from the generator to the active electrode, through the patient to the return electrode, and back to the generator.'), 56, 132, 1168);
      const fx = (f) => ((Math.log10(f) - 1) / 6 * 100).toFixed(2) + '%'; // 10 Hz to 10 MHz on a log scale
      const mk = (f, cls, top, bottom) => h('div', { class: 'fmark ' + cls, style: { left: fx(f) } }, top ? h('span', { class: 'top' }, top) : null, bottom ? h('span', { class: 'bot' }, bottom) : null);
      const zone = h('div', { class: 'fzone', style: { width: fx(100000) } }, h('span', null, 'Nerves and muscles respond'));
      const band = h('div', { class: 'fband', style: { left: fx(300000), width: `calc(${fx(500000)} - ${fx(300000)})` } });
      const m1 = mk(55, 'out', 'Power outlet', '50 or 60 Hz'), m2 = mk(100000, 'lim', 'About 100 kHz', 'Above this, nerves and muscles are not stimulated'), m3 = mk(387000, 'gen', 'Electrosurgical generator', 'typically 300 to 500 kHz');
      const scale = at(h('div', { class: 'abs fscale', role: 'img', 'aria-label': 'Frequency scale: a power outlet supplies 50 or 60 hertz. Above about 100 kilohertz, nerves and muscles are not stimulated. Electrosurgical generators typically work at 300 to 500 kilohertz.' },
        h('p', { class: 'eyebrow' }, 'Frequency'), h('div', { class: 'fbar' }, zone, band, m1, m2, m3)), 56, 470, 1168);
      st.append(hd, circ, scale);
      [m1, m2, m3, band, zone].forEach(x => x.classList.add('wait'));
      const show = (...els) => () => els.forEach(x => { x.classList.remove('wait'); x.classList.add('reveal'); });
      ctx.timeline('what', { 0: [hd], 1: [circ], 3: [scale, [show(m1), 2.6], [show(m3, band), 6.2]], 4: [show(m2, zone)] });
    },
    notes: { build: ['The current animates around the circuit. The frequency scale builds as the narrator gives each figure.'], flags: ['"Typically 300 to 500 kHz": generators vary (the Science of Energy deck shows 200 kHz to 3.3 MHz).'] }
  });

  /* 5.9 how heat is generated */
  const sine = (w, amp, per, y0) => { let d = `M0 ${y0}`; for (let x = 2; x <= w; x += 2) d += ` L${x} ${(y0 - Math.sin(x / per * 2 * Math.PI) * amp).toFixed(1)}`; return d; };
  const BEATS = [
    { t: 'High-frequency current', s: 'reaches the tissue', g: `<g class="trav"><path d="${sine(440, 34, 55, 60)}" fill="none" stroke="#EB1700" stroke-width="4"/></g>` },
    { t: 'Kinetic energy', s: 'charged particles in the cells move rapidly', g: `<circle cx="110" cy="60" r="50" fill="#fff" stroke="#81766F" stroke-width="2.5"/>${[[86, 40], [128, 46], [100, 70], [134, 78], [84, 84], [112, 26]].map(([x, y], i) => `<circle class="ion" style="animation-delay:-${i * 0.07}s" cx="${x}" cy="${y}" r="6"/>`).join('')}` },
    { t: 'Thermal energy', s: 'the movement produces heat', g: `<circle class="warm" cx="110" cy="64" r="46"/><g class="rise" fill="none" stroke="#EB1700" stroke-width="3.5" stroke-linecap="round"><path d="M86 16 q8 -8 0 -16"/><path d="M110 12 q8 -8 0 -16"/><path d="M134 16 q8 -8 0 -16"/></g>` },
    { t: 'Tissue effect', s: 'the tissue is cut or coagulated', g: `<rect x="20" y="62" width="180" height="52" fill="#E8E6E3" stroke="#81766F" stroke-width="2"/><ellipse class="spot" cx="110" cy="64" rx="34" ry="16"/><path d="M110 6 V52" stroke="#1F1A17" stroke-width="9" stroke-linecap="round"/><path d="M110 52 V60" stroke="#EB1700" stroke-width="4" stroke-linecap="round"/>` }
  ];
  add({
    id: 'heat', sb: '5.9', grp: G.how, menu: 'How heat is generated in tissue', title: 'How is heat generated in tissue?', vo: [['Narration', 'heat']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('From current to heat', 'red', [['How is heat'], ['generated in tissue?', 'in1 r']], 54, 56, 38, 800);
      const beats = BEATS.map((b, i) => at(h('div', { class: 'beat abs b' + i }, svg('0 0 220 120', b.g, 'beatsvg'), h('span', { class: 'kn', 'aria-hidden': 'true' }, '0' + (i + 1)), h('b', null, b.t), h('span', null, b.s)), 56 + i * 300, 204, 268));
      const arrows = [0, 1, 2].map(i => at(h('div', { class: 'abs barrow', 'aria-hidden': 'true', html: ICON.arrow }), 56 + i * 300 + 272, 250));
      const chips = ['Tissue type', 'Time of exposure', 'Electrode size and shape'].map(t => h('span', { class: 'fchip' }, t));
      const dep = at(h('div', { class: 'abs deprow' }, h('p', null, 'The effect depends on:'), chips), 56, 560, 1168);
      st.append(hd, ...beats, ...arrows, dep);
      ctx.timeline('heat', { 0: [hd, [beats[0], 0.6], [arrows[0], 3.6], [beats[1], 3.8], [arrows[1], 6.2], [beats[2], 6.4]], 2: [arrows[2], [beats[3], 0.2], [dep, 2.2]] });
    },
    notes: { build: ['Animation built in the module, in four beats that follow the narration.'] }
  });

  /* 5.10 cut, coagulation and blend */
  const burst = (w, per, on, amp, y0, cyc) => { // an interrupted waveform: short bursts, then nothing
    let d = `M0 ${y0}`;
    for (let x = 1; x <= w; x += 1) { const ph = x % per; d += ` L${x} ${(ph < on ? y0 - Math.sin(ph / on * cyc * 2 * Math.PI) * amp * (1 - ph / on * 0.55) : y0).toFixed(1)}`; }
    return d;
  };
  const MODES = [
    { k: 'cut', name: 'Cut', wave: sine(340, 20, 17, 60), facts: [['Waveform', 'continuous'], ['Current on', '100% of the time'], ['Voltage', 'low']], fx: 'Cells vaporize' },
    { k: 'coag', name: 'Coagulation', wave: burst(340, 85, 14, 52, 60, 2), facts: [['Waveform', 'interrupted'], ['Current on', 'about 6% of the time'], ['Voltage', 'high']], fx: 'Cells dry out, vessels seal' },
    { k: 'blend', name: 'Blend', wave: burst(340, 68, 34, 32, 60, 3), facts: [['Waveform', 'cut and coagulation combined'], ['Proportions', 'vary by blend setting'], ['Voltage', 'in between']], fx: 'Cuts and coagulates' }
  ];
  add({
    id: 'waveforms', sb: '5.10', grp: G.how, menu: 'Cut, coagulation and blend', vo: [['Narration', 'waves']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Electrosurgical waveforms', 'red', [['Cut, coagulation'], ['and blend', 'in1 r']], 54, 56, 38, 700);
      const cards = MODES.map((m, i) => at(h('div', { class: 'mode abs ' + m.k },
        h('h3', null, m.name),
        svg('0 0 340 120', `<path class="base" d="M0 60 H340"/><path class="wv" pathLength="1" d="${m.wave}"/>`, 'wave', `${m.name} waveform`),
        h('dl', null, m.facts.map(([a, b]) => [h('dt', null, a), h('dd', null, b)])),
        h('p', { class: 'fx' }, h('span', { class: 'ic', 'aria-hidden': 'true', html: ICON.arrow }), m.fx)), 56 + i * 396, 196, 376));
      const arc = at(h('p', { class: 'abs kl arcnote' }, h('b', null, 'Higher voltage, higher risk. '), 'In coagulation mode, arcing and injury to nearby tissue are more likely.'), 56, 560, 1168);
      st.append(hd, ...cards, arc);
      ctx.timeline('waves', { 0: [hd, [cards[0], 0.4]], 2: [cards[1]], 5: [arc], 6: [cards[2]] });
    },
    notes: { build: ['Animated in the order asked for: Cut, then Coagulation, then Blend. Each waveform draws itself as its card comes in.'] }
  });

  /* 5.11 cut and coagulation: the tissue effect (video and a quick check) */
  add({
    id: 'tissue-effect', sb: '5.11', grp: G.how, menu: 'Cut and coagulation: the tissue effect', vo: [['Narration', 'cutcoag'], ['Question', 'cutcoag-q'], ['Feedback', 'cutcoag-ok'], ['Feedback', 'cutcoag-no']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('On tissue', 'red', [['Cut and coagulation:'], ['the tissue effect', 'in1 r']], 50, 56, 36, 900);
      const v = h('video', { src: 'assets/video/cut-vs-coag.mp4', poster: 'assets/img/poster-cut-vs-coag.jpg', controls: true, playsinline: true, preload: 'metadata', 'aria-label': 'Video: the same electrode on tissue in coagulation mode, then in cut mode' });
      const vbox = at(h('div', { class: 'abs vbox' }, v), 56, 176, 720, 405);
      const cap = fine(EDU + ' Video © Ethicon, Inc.', 56, 590, 720);
      const gray = pnl('gray', 816, 176, 408, 405, 'r');
      const askBox = at(h('div', { class: 'abs vask', 'aria-live': 'polite' }), 844, 200, 352);
      st.append(hd, vbox, cap, gray, askBox);
      ctx.lock('Answer the question to go on.');
      let asked = false, holding = false;
      const watched = h('button', { class: 'btn sm ghost', type: 'button' }, 'I’ve watched the video');
      const intro = () => { askBox.innerHTML = ''; askBox.append(h('p', { class: 'eyebrow red dk' }, 'Your task'), h('p', { class: 'body' }, 'Watch the video. Look at the area around the tip in each mode.'), h('div', { style: { marginTop: '22px' } }, watched)); };
      function ask() {
        if (asked) return; asked = true;
        const bCut = h('button', { class: 'btn ghost', type: 'button' }, 'Cut'), bCoag = h('button', { class: 'btn ghost', type: 'button' }, 'Coagulation');
        askBox.innerHTML = '';
        askBox.append(h('p', { class: 'eyebrow red dk' }, 'Quick check'), h('p', { class: 'mcq', id: 'mcq' }, 'In the video, which mode left a wider area of damaged tissue around the tip?'), h('div', { class: 'vopts' }, bCut, bCoag));
        const again = () => { v.currentTime = 0; tuneVideo(v); v.play().catch(() => {}); };
        const answer = (ok) => {
          ctx.answer({ type: 'choice', response: ok ? 'coagulation' : 'cut', correct: ['coagulation'], ok, text: 'Which mode left a wider area of damaged tissue?' });
          ctx.unlock();
          feedback(ctx, ok ? { kind: 'ok', title: 'That’s right', vo: 'cutcoag-ok', buttons: [['Continue', () => ctx.go(ctx.slide.idx + 1)], ['Stay on this screen', null, true]] }
            : { kind: 'no', title: 'Not quite', vo: 'cutcoag-no', buttons: [['Continue', () => ctx.go(ctx.slide.idx + 1)], ['Watch again', again, true]] });
        };
        bCut.addEventListener('click', () => answer(false)); bCoag.addEventListener('click', () => answer(true));
        ctx.layerVO('cutcoag-q');
        setTimeout(() => bCut.focus(), 80);
      }
      intro();
      watched.addEventListener('click', () => { v.pause(); ask(); });
      // the narration waits while the video plays, and carries on when it stops
      v.addEventListener('play', () => { tuneVideo(v); ctx.endLayerVO(); if (!holding) { holding = true; ctx.hold(true); } });
      const release = () => { if (holding) { holding = false; ctx.hold(false); } };
      v.addEventListener('pause', release);
      v.addEventListener('ended', () => { release(); ask(); });
      ctx.timeline('cutcoag', { 0: [hd], 1: [vbox, cap, [gray, 0.3], [askBox, 0.6]] });
    },
    notes: { build: ['The video is the supplied "Cut vs Coag mode tissue effect" clip, unedited, with its own sound.', 'The quick check appears when the video ends, or when the learner selects "I’ve watched the video".'] }
  });
})();
