/* S.P.A.R.K.S. Module 5: section C, types of energy-based surgery (storyboard screens 5.12 to 5.26). */
(function () {
  'use strict';
  const { h, ICON, G, reduced, IMG, at, pnl, photoPnl, dh, head, doneMark, svg, fine, krow, feedback, layer, videoLayer, EDU, add, divider, typeOpener, TYPES } = E;

  divider({
    id: 'types-of-energy', sb: '5.12', grp: G.types, menu: 'Types of energy-based surgery', vo: 'sec-c', n: '02', eyebrow: 'Section 2 of 4',
    lines: [['What are the different'], ['types of energy-based', 'in1'], ['surgery?']], size: 54, photo: 'or-close', pos: '50% 35%', ph: 370,
    items: ['Monopolar and bipolar electrosurgery', 'Advanced bipolar devices', 'Ultrasonic energy devices', 'How the four compare']
  });

  /* 5.13 types of electrosurgery */
  const GEN = (x, y) => `<g class="gen"><rect x="${x}" y="${y}" width="104" height="76" rx="5" fill="#fff" stroke="#000" stroke-width="2.5"/><rect x="${x + 12}" y="${y + 12}" width="46" height="24" fill="#F1EFED" stroke="#81766F" stroke-width="1.5"/><circle cx="${x + 80}" cy="${y + 24}" r="9" fill="none" stroke="#000" stroke-width="2.5"/><circle cx="${x + 20}" cy="${y + 56}" r="5" fill="#EB1700"/><circle cx="${x + 38}" cy="${y + 56}" r="5" fill="#000"/></g>`;
  const PATIENT = `<path d="M196 214 H524" stroke="#C1BBB3" stroke-width="9" stroke-linecap="round"/><path d="M250 219 V262 M470 219 V262" stroke="#C1BBB3" stroke-width="7" stroke-linecap="round"/><rect x="226" y="166" width="246" height="42" rx="21" fill="#E8E6E3" stroke="#81766F" stroke-width="2"/><circle cx="498" cy="184" r="22" fill="#E8E6E3" stroke="#81766F" stroke-width="2"/>`;
  const MONO = `${GEN(20, 120)}${PATIENT}
    <rect x="256" y="205" width="92" height="9" rx="3" fill="#B81200"/>
    <path d="M330 70 L366 150" stroke="#1F1A17" stroke-width="11" stroke-linecap="round"/><path d="M366 150 L372 162" stroke="#EB1700" stroke-width="4.5" stroke-linecap="round"/>
    <g class="flow"><path class="w" d="M72 120 V44 H326 V66"/><path class="w thru" d="M372 164 L318 204"/><path class="w" d="M256 210 H160 V158 H124"/></g>
    <text x="318" y="34" text-anchor="middle">Active electrode</text><text x="300" y="250" text-anchor="middle">Return electrode</text><text x="72" y="222" text-anchor="middle">Generator</text>`;
  const BIPO = `${GEN(20, 120)}${PATIENT}
    <path d="M312 60 L353 160 M336 60 L375 160" stroke="#1F1A17" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M304 52 H344" stroke="#1F1A17" stroke-width="14" stroke-linecap="round"/>
    <g class="flow"><path class="w" d="M72 120 V40 H318 V46"/><path class="w thru" d="M353 166 Q364 184 375 166"/></g>
    <text x="330" y="26" text-anchor="middle">Two tips on one instrument</text><text x="72" y="222" text-anchor="middle">Generator</text>`;
  add({
    id: 'types', sb: '5.13', grp: G.types, menu: 'Types of electrosurgery', vo: [['Narration', 'types']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Two primary types', 'red', [['Types of electrosurgery']], 54, 56, 38, 900);
      const card = (name, art, label, text, x) => at(h('div', { class: 'abs tcmp' }, h('h3', null, name), svg('0 0 540 280', art, 'esu small', label), h('p', { class: 'body kl' }, text)), x, 170, 564);
      const c1 = card('Monopolar', MONO, 'Monopolar: the current flows from the active electrode through the patient to a return electrode under the patient.', 'Current passes through the patient to a return electrode.', 56);
      const c2 = card('Bipolar', BIPO, 'Bipolar: the current flows only between the two tips of the instrument.', 'Current passes only through the tissue between the two tips.', 660);
      st.append(hd, c1, c2);
      ctx.timeline('types', { 0: [hd, [c1, 2.2], [c2, 3.6]] });
    },
    notes: { build: ['New illustration in the brand style, with the same idea as the current image: both instruments shown with the patient, and the path of the current.'] }
  });

  /* 5.14 and 5.15 monopolar */
  typeOpener({ id: 'monopolar', sb: '5.14', menu: 'Monopolar electrosurgery', vo: 'mono-t', i: 0, lines: [['Monopolar'], ['electrosurgery', 'in1 r']], photo: 'or-notes', pos: '40% center' });
  add({
    id: 'monopolar-circuit', sb: '5.15', grp: G.types, menu: 'Monopolar: the circuit', title: 'Monopolar electrosurgery: the circuit', vo: [['Narration', 'mono']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Monopolar electrosurgery', 'red', [['The circuit']], 54, 56, 38, 700);
      const v = h('video', { src: 'assets/video/monopolar-circuit.mp4', poster: 'assets/img/poster-monopolar-circuit.jpg', muted: true, loop: true, playsinline: true, preload: 'auto', 'aria-label': 'Animation of the monopolar circuit: current flows from the generator to the pencil held by the surgeon, through the patient to the pad under the patient, and back to the generator.' });
      v.muted = true;
      const dot = (n, x, y) => h('span', { class: 'vdot', style: { left: x + '%', top: y + '%' }, 'aria-hidden': 'true' }, n);
      const dots = [dot('1', 24, 37), dot('2', 70, 36), dot('3', 88, 49), dot('4', 56, 60)];
      const vbox = at(h('div', { class: 'abs vbox plain' }, v, ...dots), 56, 170, 680, 430);
      const cap = fine(EDU, 56, 610, 680);
      const step = (n, lead, sub) => h('div', { class: 'flowstep' }, h('span', { class: 'vdot static', 'aria-hidden': 'true' }, n), h('div', null, h('b', null, lead), sub ? h('span', null, sub) : null));
      const s1 = step('1', 'Generator'), s2 = step('2', 'Active electrode', 'current concentrated'), s3 = step('3', 'Patient'), s4 = step('4', 'Return electrode', 'current spread out'), s5 = step('1', 'Back to the generator');
      const flow = at(h('div', { class: 'abs flowlist' }, s1, s2, s3, s4, s5), 790, 170, 434);
      const key = at(h('p', { class: 'abs kl keyline' }, 'The patient completes the circuit.'), 790, 546, 434);
      st.append(hd, vbox, cap, flow, key);
      dots.forEach(d => d.classList.add('wait'));
      const on = (d) => () => { d.classList.remove('wait'); d.classList.add('reveal'); };
      const hl = (el) => () => { [s2, s4].forEach(x => x.classList.remove('hl')); el.classList.add('hl'); };
      ctx.timeline('mono', { pre: [[vbox, 0.2], [() => { v.play().catch(() => {}); }, 0.6]], 0: [hd, cap, [s1, 2.4], [on(dots[0]), 2.4], [s2, 4.6], [on(dots[1]), 4.6]], 1: [hl(s2)], 2: [[s3, 1.0], [on(dots[2]), 1.0], [s4, 3.4], [on(dots[3]), 3.4], [s5, 6.2]], 3: [key], 4: [hl(s4)] });
    },
    notes: { build: ['The supplied monopolar circuit animation, looped. The numbered markers and the list beside it are added in the build.'] }
  });

  /* 5.16 and 5.17 bipolar */
  typeOpener({ id: 'bipolar', sb: '5.16', menu: 'Bipolar electrosurgery', vo: 'bi-t', i: 1, lines: [['Bipolar'], ['electrosurgery', 'in1 r']], photo: 'or-focus', pos: '50% 30%' });
  const BIP = `
    <rect class="tissue" x="40" y="160" width="520" height="62" rx="6"/><rect class="dry" x="238" y="160" width="124" height="62"/>
    <path class="tip" d="M252 96 H348 a20 20 0 0 1 20 20 V160 H232 V116 a20 20 0 0 1 20 -20 Z"/><path class="tip" d="M232 222 H368 V266 a20 20 0 0 1 -20 20 H252 a20 20 0 0 1 -20 -20 Z"/>
    <g class="straight">${[256, 278, 300, 322, 344].map(x => `<path d="M${x} 162 V220"/>`).join('')}</g>
    <g class="balloon">${[[232, 150], [232, 100], [232, 56]].map(([x, c], i) => `<path d="M${x + 6} 162 C ${c} 170, ${c} 212, ${x + 6} 220"/><path d="M${600 - x - 6} 162 C ${600 - c} 170, ${600 - c} 212, ${600 - x - 6} 220"/>`).join('')}</g>
    <text x="300" y="80" text-anchor="middle">Tip</text><text x="300" y="316" text-anchor="middle">Tip</text><text x="44" y="140">Tissue</text>
    <text class="lb-bal" x="556" y="116" text-anchor="end">Current balloons outward</text>`;
  add({
    id: 'bipolar-circuit', sb: '5.17', grp: G.types, menu: 'Bipolar: the circuit', title: 'Bipolar electrosurgery: the circuit', vo: [['Narration', 'bi']],
    build(ctx) {
      const st = ctx.stage;
      const gray = pnl('gray', 0, 0, 640, 720, 'l');
      const art = at(svg('0 0 600 340', BIP, 'bip', 'Bipolar electrosurgery: the tissue is held between two tips and the current flows straight between them. As the tissue dries, the current balloons out around the tips.'), 30, 170, 580);
      const hd = head('Bipolar electrosurgery', 'red', [['The circuit']], 54, 696, 38, 540);
      const r1 = krow('01', 'Between the tips', 'Current flows from one tip, through the tissue held between the tips, to the other tip.');
      const r2 = krow('02', 'No return electrode', 'Nothing needs to be placed on the patient.');
      const r3 = krow('03', 'As tissue dries', 'Current balloons around the tips.');
      const list = at(h('div', { class: 'abs' }, r1, r2, r3), 696, 196, 528);
      const tog = h('button', { class: 'btn sm ghost', type: 'button', 'aria-pressed': 'false' }, 'Show the tissue drying');
      tog.addEventListener('click', () => { const on = !art.classList.contains('dryon'); art.classList.toggle('dryon', on); tog.setAttribute('aria-pressed', String(on)); tog.textContent = on ? 'Show the tissue before it dries' : 'Show the tissue drying'; });
      const togw = at(h('div', { class: 'abs' }, tog), 696, 560);
      st.append(gray, art, hd, list, togw);
      const dry = () => { art.classList.add('dryon'); tog.setAttribute('aria-pressed', 'true'); tog.textContent = 'Show the tissue before it dries'; };
      ctx.timeline('bi', { pre: [[gray, 0.05], [art, 0.4]], 0: [hd], 1: [r1], 2: [r2], 4: [r3, dry], 5: [togw] });
    },
    notes: { build: ['A bipolar animation built in the module (the supplied deck plays the monopolar clip on its bipolar slide).', 'The lines of current bulge outward when the narrator describes the tissue drying; the learner can switch between the two states.'] }
  });

  /* 5.18 why move beyond traditional bipolar */
  const LIMITS = [['Small vessels only', 'up to and including 2 mm'], ['Compression by hand', null], ['No energy control', 'the surgeon judges when to stop by eye'], ['Heat spreads', 'as tissue dries, current balloons sideways'], ['A separate tool is needed to cut', null]];
  add({
    id: 'beyond-bipolar', sb: '5.18', grp: G.types, menu: 'Why move beyond traditional bipolar?', vo: [['Narration', 'whybeyond']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Traditional bipolar', 'red', [['Why move beyond'], ['traditional bipolar?', 'in1 r']], 52, 56, 38, 760);
      const rows = LIMITS.map(([a, b], i) => krow('0' + (i + 1), a, b, 'slim'));
      const list = at(h('div', { class: 'abs' }, rows), 56, 196, 700);
      const gray = pnl('gray', 816, 0, 464, 720, 'r');
      const dev = at(h('figure', { class: 'abs devfig' }, h('img', { src: 'assets/img/dev-1940.png', alt: 'Line drawing of fine-tip bipolar forceps' }), h('figcaption', null, 'Traditional bipolar forceps, for spot coagulation')), 856, 60, 384);
      const watch = h('button', { class: 'btn sm ghost', type: 'button', html: '<span style="display:inline-flex;width:20px;height:20px"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.6v10.8c0 .6.6.9 1.1.6l8.4-5.4c.5-.3.5-.9 0-1.2L5.1 2c-.5-.3-1.1 0-1.1.6z"/></svg></span>Watch: current ballooning' });
      const thumb = h('button', { class: 'vthumb', type: 'button', 'aria-label': 'Watch the ballooning demonstration, 22 seconds' }, h('img', { src: 'assets/img/poster-ballooning.jpg', alt: '' }));
      const open = (b) => videoLayer(ctx, { src: 'ballooning', title: 'Ballooning demonstration', eyebrow: 'Video · 22 seconds · no sound', note: EDU + ' Video © Ethicon, Inc.' }, b);
      watch.addEventListener('click', () => open(watch)); thumb.addEventListener('click', () => open(thumb));
      const vid = at(h('div', { class: 'abs' }, thumb, h('div', { style: { marginTop: '16px' } }, watch)), 856, 296, 384);
      const close = at(h('p', { class: 'abs keyline strong' }, 'Advanced bipolar devices were developed to address these limits.'), 56, 566, 700);
      st.append(hd, list, gray, dev, vid, close);
      ctx.timeline('whybeyond', { pre: [[gray, 0.05]], 0: [hd, [dev, 1.0]], 1: [[rows[0], 0.6]], 2: [rows[1], [rows[2], 3.0]], 3: [rows[3], [vid, 2.4]], 4: [rows[4]], 5: [close] });
    },
    notes: { build: ['Device drawing and the optional ballooning demonstration come from the supplied Science of Energy deck.'] }
  });

  /* 5.19 advanced bipolar devices */
  const CMP = [['Vessels', 'Up to 2 mm', 'Up to 7 mm'], ['Compression', 'By hand', 'Built into the jaws'], ['Energy control', 'The surgeon, by eye', 'The generator senses impedance'], ['Cutting', 'Separate tool', 'Built-in blade'], ['End of cycle', 'Judged by eye', 'Often signalled by a tone']];
  add({
    id: 'advanced-bipolar', sb: '5.19', grp: G.types, menu: 'Advanced bipolar devices', vo: [['Narration', 'abp']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Bipolar current plus compression', 'red', [['Advanced bipolar devices']], 54, 56, 38, 1000);
      const th = (cls, name, img, alt) => h('div', { class: 'th ' + cls, role: 'columnheader' }, h('img', { src: 'assets/img/' + img, alt }), h('b', null, name));
      const headRow = h('div', { class: 'cmp-row hdr', role: 'row' }, h('div', { role: 'columnheader' }, h('span', { class: 'pl-sr' }, 'Feature')), th('trad', 'Traditional bipolar', 'dev-1960.jpg', 'Wider-jaw bipolar forceps'), th('adv', 'Advanced bipolar', 'dev-1990.png', 'An advanced bipolar device with jaws'));
      const rows = CMP.map(([a, b, c]) => h('div', { class: 'cmp-row', role: 'row' }, h('div', { class: 'lab', role: 'rowheader' }, a), h('div', { role: 'cell' }, b), h('div', { class: 'adv', role: 'cell' }, c)));
      const table = at(h('div', { class: 'abs cmp', role: 'table', 'aria-label': 'Traditional bipolar compared with advanced bipolar' }, headRow, rows), 56, 160, 1168);
      st.append(hd, table);
      ctx.timeline('abp', { 0: [hd, [headRow, 1.2]], 2: [[rows[0], 4.6], [rows[1], 8.2]], 3: [rows[2]], 6: [rows[3], [rows[4], 3.4]] });
    },
    notes: { build: ['The comparison builds row by row with the narration.', 'Device drawings from the supplied Science of Energy deck (no brand names shown).'], flags: ['"Some systems also control the temperature at the jaws": Medical Affairs to confirm.'] }
  });

  /* seal formation in five steps, drawn from the supplied deck */
  function stepsRow(prefix, steps, y, alt) {
    return steps.map(([lab, txt, cls], i) => at(h('div', { class: 'sstep abs ' + (cls || '') }, h('div', { class: 'ring' }, h('img', { src: `assets/img/${prefix}-${i + 1}.png`, alt: alt[i] })), h('div', { class: 'cap' }, h('span', { class: 'kn', 'aria-hidden': 'true' }, String(i + 1)), h('b', null, lab)), h('p', null, txt)), 56 + i * 238, y, 216));
  }
  const litUp = (els) => (i) => () => els.forEach((e, j) => e.classList.toggle('on', j === i));

  /* 5.20 how an advanced bipolar seal forms */
  add({
    id: 'abp-seal', sb: '5.20', grp: G.types, menu: 'How an advanced bipolar seal forms', vo: [['Narration', 'abpseal']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Advanced bipolar', 'red', [['How a seal forms']], 54, 56, 38, 900);
      const steps = stepsRow('abp', [['Compress', 'The jaws close on the vessel.'], ['Heat', 'Heat breaks hydrogen bonds and denatures proteins such as collagen and elastin.'], ['Coagulum', 'The denatured proteins form a sticky coagulum.'], ['Seal', 'Heat and compression fuse the vessel walls. The generator monitors impedance.'], ['Cut', 'The blade divides the sealed tissue.']], 164,
        ['Jaws closed on a blood vessel', 'Protein strands inside the cells unwinding', 'A tangled mass of denatured protein', 'Cross-section of the jaws with the tissue heated between them', 'A blade passing through the sealed tissue']);
      const key = at(h('p', { class: 'abs kl keyline' }, h('b', null, 'The heat starts in the tissue. '), 'Right after sealing, the tissue is hotter than the jaws.'), 56, 560, 1168);
      const cr = fine('Illustrations: J&J MedTech, Science of Energy.', 764, 96, 460, 'right');
      st.append(hd, ...steps, key, cr);
      const lit = litUp(steps);
      ctx.timeline('abpseal', { 0: [hd, cr], 1: [steps[0], lit(0)], 2: [steps[1], lit(1)], 5: [steps[2], lit(2), [steps[3], 3.2], [lit(3), 3.2]], 7: [steps[4], lit(4)], 8: [key, lit(-1)] });
    },
    notes: { build: ['The five drawings are the ones in the supplied deck (slide 13), used as they are.'] }
  });

  /* 5.21 and 5.22 ultrasonic */
  typeOpener({ id: 'ultrasonic', sb: '5.21', menu: 'Ultrasonic energy devices', vo: 'us-t', i: 3, lines: [['Ultrasonic'], ['energy devices', 'in1 r']], photo: 'cover', pos: '30% center' });
  const BLADE = `<rect x="20" y="52" width="150" height="26" rx="6" fill="#81766F"/><text x="24" y="40">Handpiece</text>
    <g class="ghost"><path d="M318 44 V86 M378 44 V86"/><path d="M318 96 H378" marker-start="url(#a1)" marker-end="url(#a2)"/></g>
    <defs><marker id="a1" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M10 0 L0 5 L10 10 z" fill="#000"/></marker><marker id="a2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#000"/></marker></defs>
    <g class="osc"><path d="M168 65 H338 q14 0 14 0" stroke="#1F1A17" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="348" cy="65" r="7" fill="#EB1700"/></g>
    <text x="348" y="122" text-anchor="middle">Blade movement</text>`;
  const LEVELS = ['More coagulation: the blade moves least.', 'More coagulation: the blade moves less.', 'In between.', 'Faster cutting: the blade moves further.', 'Faster cutting: the blade moves furthest.'];
  add({
    id: 'ultrasonic-works', sb: '5.22', grp: G.types, menu: 'How ultrasonic energy works', vo: [['Narration', 'us']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Electrical energy becomes mechanical vibration', 'red', [['How ultrasonic energy works']], 52, 56, 34, 1100);
      const v = h('video', { src: 'assets/video/transducer.mp4', poster: 'assets/img/poster-transducer.jpg', muted: true, loop: true, playsinline: true, preload: 'auto', 'aria-label': 'Animation of the handpiece: piezoelectric ceramics in the transducer vibrate, and a mechanical wave travels along the blade.' });
      v.muted = true;
      const vbox = at(h('div', { class: 'abs vbox plain' }, v), 56, 140, 1168, 249);
      const f1 = h('div', { class: 'fact' }, h('span', { class: 'kn' }, '55,500'), h('span', null, 'vibrations of the blade every second'));
      const f2 = h('div', { class: 'fact' }, h('span', { class: 'kn' }, '50 to 100'), h('span', null, 'micrometers of blade movement'));
      const facts = at(h('div', { class: 'abs facts' }, f1, f2), 56, 410, 520);
      const gray = pnl('gray', 620, 404, 604, 250, 'r');
      const art = svg('0 0 420 130', BLADE, 'blade', null);
      const out = h('p', { class: 'lvl', 'aria-live': 'polite' }, LEVELS[2]);
      const btns = [1, 2, 3, 4, 5].map(n => h('button', { type: 'button', 'aria-pressed': String(n === 3), 'aria-label': 'Power level ' + n }, String(n)));
      const set = (n) => { btns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === n - 1))); art.style.setProperty('--amp', (6 + n * 5) + 'px'); out.textContent = LEVELS[n - 1]; };
      btns.forEach((b, i) => b.addEventListener('click', () => set(i + 1)));
      const dial = at(h('div', { class: 'abs dial' }, h('div', { class: 'top' }, h('p', { class: 'eyebrow' }, 'Power level'), h('div', { class: 'seg lv', role: 'group', 'aria-label': 'Power level' }, btns)), art, out), 644, 418, 556);
      set(3);
      st.append(hd, vbox, facts, gray, dial);
      ctx.timeline('us', { pre: [[vbox, 0.2], [() => { v.play().catch(() => {}); }, 0.6]], 0: [hd], 1: [[f1, 5.0], [f2, 9.4]], 2: [gray, dial, [() => set(5), 0.8]], 3: [[() => set(1), 0.6]], 4: [() => set(3)] });
    },
    notes: { build: ['The supplied transducer animation, shown large and looped.', 'The power level control is added in the build: a higher level moves the blade further.'] }
  });

  /* 5.23 how an ultrasonic seal forms */
  add({
    id: 'ultrasonic-seal', sb: '5.23', grp: G.types, menu: 'How an ultrasonic seal forms', vo: [['Narration', 'usseal']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Ultrasonic', 'red', [['How a seal forms']], 54, 56, 38, 900);
      const steps = stepsRow('us', [['Compress', 'The clamp arm holds the vessel against the blade.'], ['Heat', 'Frictional heat breaks hydrogen bonds and denatures proteins.'], ['Coagulum', 'The denatured proteins form a sticky coagulum.'], ['Seal', 'The heat seals the vessel walls.'], ['Cut', 'The tissue is coagulated and cut at the same time.']], 164,
        ['A blood vessel compressed between the clamp arm and the blade', 'Protein strands inside the cells unwinding', 'A tangled mass of denatured protein', 'The vessel sealed between the clamp arm and the vibrating blade', 'The tissue divided at the blade']);
      const same = at(h('p', { class: 'abs samenote' }, 'The same first steps as advanced bipolar'), 56, 138, 692);
      const tips = at(h('div', { class: 'abs deprow' }, h('p', null, 'To seal a vessel:'), h('span', { class: 'fchip' }, 'Release tension'), h('span', { class: 'fchip' }, 'Use a lower power level'), h('span', { class: 'fchip' }, 'Place the vessel in the center of the blade')), 56, 560, 1168);
      const cr = fine('Illustrations: J&J MedTech, Science of Energy.', 764, 96, 460, 'right');
      st.append(hd, same, ...steps, tips, cr);
      const lit = litUp(steps);
      ctx.timeline('usseal', { 0: [hd, cr, [same, 1.6]], 1: [steps[0], lit(0)], 2: [steps[1], lit(1)], 3: [steps[2], lit(2), [steps[3], 2.4], [lit(3), 2.4], [steps[4], 4.2], [lit(4), 4.2]], 4: [lit(-1)], 7: [tips] });
    },
    notes: { build: ['The five drawings are the ones in the supplied deck (slide 20), used as they are.'], flags: ['The deck describes where ultrasonic heat starts in two ways (in the tissue, and in the blade). The narration avoids the point until Medical Affairs confirms one wording.'] }
  });

  /* 5.24 vessel sealing and limitations */
  add({
    id: 'ultrasonic-limits', sb: '5.24', grp: G.types, menu: 'Vessel sealing and limitations', vo: [['Narration', 'uslimits']],
    build(ctx) {
      const st = ctx.stage;
      const red = pnl('red', 0, 0, 620, 720, 'l');
      const size = (n, d, label) => h('div', { class: 'bigrow vs' }, h('div', { class: 'n' }, n, h('small', null, ' mm')), h('div', { class: 'l' }, label), h('span', { class: 'ves', 'aria-hidden': 'true', style: { width: d + 'px', height: d + 'px' } }));
      const a = size('5', 70, 'Standard devices: vessels up to 5 mm'), b = size('7', 98, 'Advanced models: up to and including 7 mm');
      const left = at(h('div', { class: 'abs' }, h('p', { class: 'eyebrow white' }, 'Vessel sealing'), a, b, h('p', { class: 'fine white', style: { marginTop: '18px' } }, 'Circles show relative size, not actual size.')), 56, 64, 508);
      const hd = head('Keep in mind', 'red', [['Limitations']], 54, 676, 56, 548);
      const rows = [['The active blade stays hot after activation', 'It can injure nearby structures it touches.'], ['Activation without tissue in the jaws', 'This adds to the risk of thermal injury.'], ['Higher unit cost', 'than standard instruments.'], ['A learning curve', 'for jaw pressure, activation timing and tissue tension.']].map(([x, y], i) => krow('0' + (i + 1), x, y, 'slim'));
      const list = at(h('div', { class: 'abs' }, rows), 676, 200, 548);
      st.append(red, left, hd, list);
      [a, b].forEach(x => x.classList.add('wait'));
      const on = (x) => () => { x.classList.remove('wait'); x.classList.add('reveal'); };
      ctx.timeline('uslimits', { pre: [[red, 0.05]], 0: [left, [on(a), 0.6], [on(b), 5.6]], 1: [hd], 2: [rows[0], [rows[1], 6.2]], 3: [rows[2], [rows[3], 4.2]] });
    }
  });

  /* 5.25 one instrument, many tasks */
  const CLIPS = [['us-grasping', 'Grasping'], ['us-dissection', 'Dissection'], ['us-plane', 'Tissue plane dissection'], ['us-backscoring', 'Back-scoring'], ['us-otomy', 'Otomy'], ['us-coagulating', 'Coagulating'], ['us-sealing', 'Vessel sealing'], ['us-cutting', 'Tissue cutting'], ['us-mesentery', 'Mesenteric transection']];
  const BENEFITS = [['No electrical current through the patient', 'Avoids alternate-site burns and capacitive coupling, and reduces interference with pacemakers and ICDs.'], ['No return pad', 'Saves set-up time and avoids pad-site burns or skin irritation.'], ['Lower tissue temperature', 'Less heat spread to nerves, bowel and ureters.'], ['Less surgical smoke', 'A clearer laparoscopic view and a healthier OR environment.']];
  add({
    id: 'ultrasonic-tasks', sb: '5.25', grp: G.types, menu: 'One instrument, many tasks', vo: [['Narration', 'ustasks']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Ultrasonic devices', 'red', [['One instrument, many tasks']], 52, 56, 34, 800);
      const tabs = ['What it can do', 'Benefits'].map((t, i) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(i === 0), id: 'ut' + i, 'aria-controls': 'up' + i }, t));
      const tabbar = at(h('div', { class: 'abs vtabs', role: 'tablist' }, tabs), 872, 72, 352);
      const seen = new Set();
      const tiles = CLIPS.map(([src, label]) => {
        const b = h('button', { class: 'clip', type: 'button', 'aria-label': 'Watch: ' + label }, h('img', { src: `assets/img/poster-${src}.jpg`, alt: '' }), h('span', { class: 'lb' }, h('span', { class: 'pi', 'aria-hidden': 'true', html: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.6v10.8c0 .6.6.9 1.1.6l8.4-5.4c.5-.3.5-.9 0-1.2L5.1 2c-.5-.3-1.1 0-1.1.6z"/></svg>' }), label));
        b.addEventListener('click', () => videoLayer(ctx, { src, title: label, eyebrow: 'Ultrasonic device · animation · no sound', note: EDU + ' Animation © Ethicon Endo-Surgery, Inc.' }, b, () => { seen.add(src); b.classList.add('seen'); }));
        return b;
      });
      const info = h('div', { class: 'clip info' }, h('p', null, 'Select a clip to watch it.'), h('p', { class: 'fine' }, 'Nine short animations, each under 35 seconds.'));
      const p0 = at(h('div', { class: 'abs gallery', role: 'tabpanel', id: 'up0', 'aria-labelledby': 'ut0' }, tiles, info), 56, 160, 1168);
      const cards = BENEFITS.map(([a, b], i) => h('div', { class: 'bcard' }, h('span', { class: 'kn', 'aria-hidden': 'true' }, '0' + (i + 1)), h('b', null, a), h('p', null, b)));
      const p1 = at(h('div', { class: 'abs bgrid', role: 'tabpanel', id: 'up1', 'aria-labelledby': 'ut1', hidden: true }, cards), 56, 166, 1168);
      const cr = fine(EDU + ' Animations © Ethicon Endo-Surgery, Inc.', 56, 530, 900);
      const show = (i) => { tabs.forEach((t, j) => t.setAttribute('aria-selected', String(j === i))); p0.hidden = i !== 0; p1.hidden = i !== 1; cr.hidden = i !== 0; };
      tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
      st.append(hd, tabbar, p0, p1, cr);
      ctx.timeline('ustasks', { 0: [hd, [p0, 0.6], cr], 1: [tabbar], 2: [() => show(1)], 3: [cards[0]], 4: [cards[1]], 5: [cards[2]], 6: [cards[3]] });
    },
    notes: { build: ['The nine supplied animations, unedited, each with its own disclaimer and copyright cards. They open in a viewer.', 'The screen switches to the benefits when the narrator reaches them; the learner can switch back to the clips.'], flags: ['The clips date from 2014. Newer or higher-resolution versions would look sharper.', 'Benefit wording softened in two places for Medical Affairs to confirm ("reduces interference", "lower tissue temperature").'] }
  });

  /* 5.26 comparing the four energy types, then a matching check */
  const FOUR = [
    ['Monopolar', 'Current passes through the patient to a return pad', 'Yes', 'Cuts and coagulates', 'Pad contact, stray current, fire risk'],
    ['Traditional bipolar', 'Current only between the two tips', 'No', 'Spot coagulation; small vessels up to 2 mm', 'Heat spreads as tissue dries'],
    ['Advanced bipolar', 'Current between the jaws, with compression and generator control', 'No', 'Seals vessels up to 7 mm; built-in blade', 'Tissue is hot after sealing; steam'],
    ['Ultrasonic', 'Vibration creates frictional heat; no current through the patient', 'No', 'Seals vessels up to 5 mm (advanced models up to 7 mm); grasps, dissects, cuts', 'The blade stays hot after activation']
  ];
  const MATCH = [['Current passes through the patient to a return pad.', 0], ['Fine forceps for spot coagulation; the surgeon decides when to stop.', 1], ['Current flows between the jaws, and the generator stops the energy when the seal is complete.', 2], ['The blade vibrates; no current reaches the patient.', 3]];
  const SHORT = ['Monopolar', 'Bipolar', 'Adv. bipolar', 'Ultrasonic'];
  add({
    id: 'compare', sb: '5.26', grp: G.types, menu: 'Comparing the four energy types', vo: [['Narration', 'compare']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Side by side', 'red', [['Comparing the four energy types']], 50, 56, 34, 1100);
      const hr = h('div', { class: 'four-row hdr', role: 'row' }, ['Energy type', 'How energy reaches tissue', 'Return pad', 'What it does', 'Watch for'].map(t => h('div', { role: 'columnheader' }, t)));
      const rows = FOUR.map(r => h('div', { class: 'four-row', role: 'row' }, r.map((t, i) => h('div', { role: i ? 'cell' : 'rowheader', class: i ? '' : 'lab' }, t))));
      const go = h('button', { class: 'btn sm', type: 'button', html: 'Quick check' + ICON.arrow });
      const table = at(h('div', { class: 'abs four', role: 'table', 'aria-label': 'The four energy types compared' }, hr, rows), 56, 136, 1168);
      const goW = at(h('div', { class: 'abs' }, go), 1040, 60);
      // the matching check
      let done = 0;
      const mrows = MATCH.map(([txt, ans], idx) => {
        const res = h('span', { class: 'res', 'aria-live': 'polite' });
        const okTag = h('span', { class: 'chip ok', hidden: true });
        const btns = SHORT.map((s, j) => h('button', { type: 'button', 'aria-pressed': 'false', 'aria-label': TYPES[j] === 'Bipolar' ? 'Traditional bipolar' : TYPES[j] }, s));
        const row = h('div', { class: 'mrow wide', role: 'group', 'aria-label': txt }, h('span', { class: 'kn', 'aria-hidden': 'true' }, '0' + (idx + 1)), h('div', null, h('div', { class: 'ttl' }, h('b', null, txt), okTag), res), h('div', { class: 'seg wide' }, btns));
        btns.forEach((b, j) => b.addEventListener('click', () => {
          if (row.classList.contains('done')) return;
          const ok = j === ans;
          btns.forEach(x => { x.setAttribute('aria-pressed', String(x === b)); x.classList.remove('right', 'wrong'); });
          b.classList.add(ok ? 'right' : 'wrong');
          ctx.answer({ type: 'matching', response: SHORT[j], correct: [SHORT[ans]], ok, text: txt });
          if (ok) {
            row.classList.add('done'); res.className = 'res pl-sr'; res.textContent = 'Matched: ' + FOUR[ans][0]; okTag.hidden = false; okTag.innerHTML = ICON.check + FOUR[ans][0];
            btns.forEach(x => { if (x !== b) x.disabled = true; });
            if (++done === MATCH.length) { doneBox.hidden = false; ctx.unlock(); }
          } else { res.className = 'res'; res.textContent = 'Not this one. Try again.'; }
        }));
        return row;
      });
      const back = h('button', { class: 'btn sm ghost', type: 'button', html: ICON.back + 'Back to the table' });
      const doneBox = h('p', { class: 'alldone', role: 'status', hidden: true }, h('span', { class: 'chip ok', html: ICON.check + 'All four matched' }));
      const check = at(h('div', { class: 'abs', hidden: true }, h('p', { class: 'body', style: { marginBottom: '10px' } }, 'Match each description to its energy type.'), mrows, h('div', { class: 'mfoot' }, back, doneBox)), 56, 136, 1168);
      const view = (c) => { table.hidden = c; goW.hidden = c; check.hidden = !c; hd.querySelector('.eyebrow').textContent = c ? 'Quick check' : 'Side by side'; if (c) setTimeout(() => check.querySelector('.seg button').focus(), 60); else go.focus(); };
      go.addEventListener('click', () => view(true)); back.addEventListener('click', () => view(false));
      st.append(hd, table, goW, check);
      ctx.lock('Do the quick check to go on.');
      ctx.timeline('compare', { 0: [hd, [hr, 0.8]], 1: [rows[0]], 2: [rows[1]], 3: [rows[2]], 4: [rows[3]], 5: [goW, [() => { if (!check.hidden) return; go.classList.add('pulse'); }, 0.2]] });
    },
    notes: { build: ['The table builds one energy type at a time. The quick check opens from the button; Next unlocks when all four are matched.', 'Everything here repeats facts from the earlier screens.'] }
  });
})();
