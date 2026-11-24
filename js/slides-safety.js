/* S.P.A.R.K.S. Module 5: sections D to F: complications, best nursing practices, post-test and close
   (storyboard screens 5.28 to 5.42). */
(function () {
  'use strict';
  const { h, ICON, S, G, reduced, IMG, at, pnl, photoPnl, dh, head, doneMark, svg, fine, krow, ckrow, add, divider } = E;

  /* ====================== D. Complications of surgical energy devices ====================== */
  divider({
    id: 'complications', sb: '5.28', grp: G.comp, menu: 'Complications of surgical energy devices', vo: 'sec-d', n: '03', eyebrow: 'Section 3 of 4',
    lines: [['Complications of'], ['surgical energy', 'in1'], ['devices']], size: 62, photo: 'or-nurse', pos: '60% 30%', ph: 300,
    items: ['Unintended thermal spread', 'Stray current and alternate-site burns', 'Implanted electronic devices', 'Operating room fire', 'Surgical smoke']
  });

  /* 5.29 unintended thermal spread */
  const SPREAD = `
    <defs><radialGradient id="hg"><stop offset="0" stop-color="#EB1700" stop-opacity=".9"/><stop offset=".55" stop-color="#EB1700" stop-opacity=".35"/><stop offset="1" stop-color="#EB1700" stop-opacity="0"/></radialGradient></defs>
    <rect x="0" y="170" width="520" height="230" fill="#F3E3DF"/><path d="M0 170 H520" stroke="#81766F" stroke-width="2"/>
    <rect x="300" y="268" width="240" height="46" rx="23" fill="#fff" stroke="#81766F" stroke-width="2.5"/>
    <circle class="heat" cx="214" cy="178" r="170" fill="url(#hg)"/>
    <circle class="lim" cx="214" cy="178" r="92"/>
    <path d="M150 20 L208 164" stroke="#1F1A17" stroke-width="13" stroke-linecap="round"/><path d="M208 164 L214 178" stroke="#EB1700" stroke-width="5" stroke-linecap="round"/>
    <text x="132" y="52" text-anchor="end">Device tip</text><text x="420" y="342" text-anchor="middle">Nearby structure</text><text x="20" y="386">Tissue</text><text class="t60" x="214" y="244" text-anchor="middle">Heat spreads sideways</text>`;
  add({
    id: 'thermal-spread', sb: '5.29', grp: G.comp, menu: 'Unintended thermal spread', vo: [['Narration', 'spread']],
    build(ctx) {
      const st = ctx.stage;
      const gray = pnl('gray', 0, 0, 600, 720, 'l');
      const art = at(svg('0 0 520 400', SPREAD, 'spread', 'Heat spreading sideways through tissue from a device tip, reaching a nearby structure.'), 40, 150, 520);
      const hd = head('Complication 1 of 5', 'red', [['Unintended'], ['thermal spread', 'in1 r']], 54, 656, 40, 580);
      const r1 = krow(null, 'Heat can spread sideways', 'from the device and injure nearby structures, such as the bowel or ureters.', 'slim');
      const r2 = krow(null, 'The injury may appear later', 'as a delayed perforation.', 'slim');
      const list = at(h('div', { class: 'abs' }, r1, r2), 656, 210, 568);
      const prev = at(h('div', { class: 'abs prevent' }, h('p', { class: 'eyebrow red' }, 'Reduce it'), h('span', { class: 'fchip' }, 'Careful power settings'), h('span', { class: 'fchip' }, 'Short activations'), h('span', { class: 'fchip' }, 'Awareness of nearby anatomy')), 656, 470, 568);
      st.append(gray, art, hd, list, prev);
      ctx.timeline('spread', { pre: [[gray, 0.05], [art, 0.4]], 0: [hd], 1: [[r1, 1.0]], 2: [[r2, 5.6]], 3: [prev] });
    },
    notes: { build: ['Animation built in the module: the heat zone grows from the device tip toward a nearby structure.'] }
  });

  /* 5.30 stray current and alternate-site burns */
  const STRAY = `
    <g class="scene"><rect x="0" y="96" width="600" height="40" fill="#E8E6E3" stroke="#C1BBB3" stroke-width="1.5"/><text x="14" y="86">Abdominal wall</text>
      <ellipse cx="300" cy="316" rx="96" ry="18" fill="#F3D9D3" stroke="#B9A29C" stroke-width="1.5"/><text x="300" y="322" text-anchor="middle" class="sm">Target tissue</text>
      <ellipse class="near" cx="178" cy="226" rx="66" ry="34" fill="#F3D9D3" stroke="#B9A29C" stroke-width="1.5"/><text x="178" y="232" text-anchor="middle" class="sm">Nearby tissue</text>
      <rect x="274" y="66" width="52" height="104" fill="#C1BBB3" stroke="#81766F" stroke-width="2"/><rect x="292" y="6" width="16" height="254" rx="3" fill="#1F1A17"/><rect x="296" y="258" width="8" height="36" fill="#81766F"/><path d="M300 292 V300" stroke="#EB1700" stroke-width="5" stroke-linecap="round"/>
      <text x="264" y="60" text-anchor="end">Metal cannula</text><text x="280" y="24" text-anchor="end">Active electrode</text></g>
    <g class="m m0"><path d="M290 220 l6 5 l-6 5 z" fill="#fff"/><path class="spark" d="M290 226 l-12 -8 l-6 14 l-12 -8 l-8 10"/><circle class="burn" cx="238" cy="230" r="16"/></g>
    <g class="m m1"><ellipse cx="452" cy="196" rx="62" ry="30" fill="#F3D9D3" stroke="#B9A29C" stroke-width="1.5"/><text x="470" y="200" text-anchor="middle" class="sm">Nearby tissue</text><path d="M560 60 L310 280" stroke="#81766F" stroke-width="9" stroke-linecap="round"/><path class="spark dash" d="M312 276 L412 190"/><circle class="burn" cx="414" cy="188" r="16"/><text x="596" y="40" text-anchor="end">Another metal instrument</text></g>
    <g class="m m2"><path class="spark dash" d="M292 84 H276 M292 108 H276 M292 132 H276 M308 84 H324 M308 108 H324 M308 132 H324"/><circle class="burn" cx="268" cy="116" r="14"/><circle class="burn" cx="332" cy="116" r="14"/></g>`;
  const PAD = `
    <rect x="0" y="210" width="600" height="110" fill="#F3D9D3"/><path d="M0 210 H600" stroke="#B9A29C" stroke-width="2"/><text x="14" y="300">Skin</text>
    <path d="M110 208 H330 L470 150" fill="none" stroke="#B81200" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><text x="430" y="130">Pad lifting off the skin</text>
    <path class="spark dash" d="M150 90 V200 M200 90 V200 M250 90 V200 M300 90 V200"/><circle class="burn" cx="225" cy="216" r="46"/><text x="225" y="76" text-anchor="middle">The same current, through a smaller area</text>`;
  const MECH = [['Insulation failure', 'A crack or break in the insulation lets current escape.'], ['Direct coupling', 'The active electrode touches another metal instrument.'], ['Capacitive coupling', 'Current passes through intact insulation into nearby metal.'], ['Return electrode', 'Poor contact concentrates current at the pad site.']];
  add({
    id: 'stray-current', sb: '5.30', grp: G.comp, menu: 'Stray current and alternate-site burns', vo: [['Narration', 'stray']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Complication 2 of 5', 'red', [['Stray current and'], ['alternate-site burns', 'in1 r']], 50, 56, 36, 900);
      const gray = pnl('gray', 0, 170, 660, 384, 'l');
      const a1 = svg('0 0 600 340', STRAY, 'stray', 'An insulated instrument passing through a metal cannula in the abdominal wall, with the selected mechanism shown in red.');
      const a2 = svg('0 0 600 340', PAD, 'stray pad', 'A return pad partly lifted off the skin, with the current concentrated through the part still in contact.');
      const artw = at(h('div', { class: 'abs strayart' }, a1, a2), 50, 180, 560);
      const ttl = h('p', { class: 'cat' }, MECH[0][0]), txt = h('p', { class: 'body' }, MECH[0][1]);
      const card = at(h('div', { class: 'abs tcard kl', 'aria-live': 'polite' }, ttl, txt), 716, 376, 508);
      const tabs = MECH.map(([t], i) => h('button', { type: 'button', 'aria-pressed': String(i === 0) }, h('span', { class: 'n', 'aria-hidden': 'true' }, String(i + 1)), t));
      const sel = (i) => { tabs.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i))); artw.dataset.sel = String(i); ttl.textContent = MECH[i][0]; txt.textContent = MECH[i][1]; };
      tabs.forEach((b, i) => b.addEventListener('click', () => sel(i)));
      const pick = at(h('div', { class: 'abs mechs', role: 'group', 'aria-label': 'How current can escape' }, tabs), 716, 180, 508);
      const prev = at(h('div', { class: 'abs prevent row' }, h('p', { class: 'eyebrow red' }, 'Prevent it'), h('span', { class: 'fchip' }, 'Insulation checks'), h('span', { class: 'fchip' }, 'Correct return pad placement'), h('span', { class: 'fchip' }, 'Active electrode monitoring')), 56, 572, 1168);
      st.append(hd, gray, artw, pick, card, prev);
      sel(0);
      ctx.timeline('stray', { pre: [[gray, 0.05], [artw, 0.4]], 0: [hd], 1: [pick], 2: [card, () => sel(0)], 3: [() => sel(1)], 4: [() => sel(2)], 5: [() => sel(3)], 6: [prev] });
    },
    notes: { build: ['Each mechanism is shown as the narrator names it. The learner can also select them in any order.'] }
  });

  /* 5.31 implanted electronic devices */
  const BODY = `
    <g fill="#E8E6E3" stroke="#81766F" stroke-width="2"><circle cx="230" cy="52" r="34"/><rect x="110" y="104" width="34" height="180" rx="17"/><rect x="316" y="104" width="34" height="180" rx="17"/><rect x="158" y="286" width="66" height="176" rx="26"/><rect x="236" y="286" width="66" height="176" rx="26"/><rect x="150" y="96" width="160" height="214" rx="40"/></g>
    <rect x="256" y="124" width="36" height="28" rx="7" fill="#1F1A17"/><path d="M258 150 q-22 12 -30 34" fill="none" stroke="#1F1A17" stroke-width="2"/><text x="362" y="142">Implanted device</text><path d="M296 138 H356" stroke="#000" stroke-width="1.5"/>
    <g fill="none" stroke="#EB1700" stroke-width="3"><circle cx="216" cy="250" r="9"/><path d="M216 236 V264 M202 250 H230"/></g><text x="96" y="254" text-anchor="end">Surgical site</text><path d="M102 250 H200" stroke="#000" stroke-width="1.5"/>
    <g class="good"><rect x="166" y="340" width="50" height="34" rx="5" fill="#B81200"/><path class="spark dash" d="M214 262 L196 338"/><text x="96" y="362" text-anchor="end">Return electrode</text><path d="M102 358 H164" stroke="#000" stroke-width="1.5"/></g>
    <g class="poor"><rect x="300" y="100" width="44" height="30" rx="5" fill="#B81200"/><path class="spark dash" d="M222 240 L308 132"/><text x="362" y="96">Return electrode</text><circle class="burn" cx="274" cy="138" r="26"/></g>`;
  add({
    id: 'implanted-devices', sb: '5.31', grp: G.comp, menu: 'Implanted electronic devices', vo: [['Narration', 'implants']],
    build(ctx) {
      const st = ctx.stage;
      const gray = pnl('gray', 0, 0, 600, 720, 'l');
      const art = at(svg('0 0 500 480', BODY, 'bodyfig', 'A patient outline with an implanted device in the upper chest, the surgical site in the abdomen and the return electrode. The path of the current runs from the surgical site to the return electrode.'), 50, 60, 500);
      const bGood = h('button', { type: 'button', 'aria-pressed': 'true' }, 'Pad away from the device'), bPoor = h('button', { type: 'button', 'aria-pressed': 'false' }, 'Pad near the device');
      const out = h('p', { class: 'fine', 'aria-live': 'polite' }, 'The current path stays clear of the device.');
      const set = (good) => { art.dataset.sel = good ? 'good' : 'poor'; bGood.setAttribute('aria-pressed', String(good)); bPoor.setAttribute('aria-pressed', String(!good)); out.textContent = good ? 'The current path stays clear of the device.' : 'The current path crosses the device.'; };
      bGood.addEventListener('click', () => set(true)); bPoor.addEventListener('click', () => set(false));
      const tog = at(h('div', { class: 'abs padtog' }, h('div', { class: 'mechs two', role: 'group', 'aria-label': 'Return electrode position' }, bGood, bPoor), out), 56, 566, 488);
      const hd = head('Complication 3 of 5', 'red', [['Implanted'], ['electronic devices', 'in1 r']], 54, 656, 40, 580);
      const kinds = at(h('div', { class: 'abs deprow' }, h('span', { class: 'fchip' }, 'Pacemakers'), h('span', { class: 'fchip' }, 'Neurostimulators'), h('span', { class: 'fchip' }, 'Implantable cardioverter-defibrillators (ICDs)')), 656, 206, 568);
      const r1 = krow('01', 'Before surgery', 'Check whether the patient has an implanted device, and confirm the team’s plan.', 'slim');
      const r2 = krow('02', 'Place the return electrode', 'so the current path does not cross the device.', 'slim');
      const r3 = krow('03', 'Keep current paths away', 'from implanted hardware.', 'slim');
      const list = at(h('div', { class: 'abs' }, r1, r2, r3), 656, 336, 568);
      st.append(gray, art, tog, hd, kinds, list);
      set(true);
      ctx.timeline('implants', { pre: [[gray, 0.05], [art, 0.4]], 0: [hd, [kinds, 6.0]], 1: [r1], 2: [r2, [tog, 1.0], [r3, 5.2]] });
    },
    notes: { build: ['The learner can move the return electrode and see whether the current path crosses the device.'], flags: ['"Careful grounding" is shown as return electrode placement, which is what the nurse controls. Medical Affairs to confirm.'] }
  });

  /* 5.32 operating room fire */
  const TRI = `
    <path class="side s0" d="M230 30 L40 360"/><path class="side s1" d="M230 30 L420 360"/><path class="side s2" d="M40 360 H420"/>
    <path class="flame" d="M230 150 C272 200 288 238 264 274 C250 296 210 296 196 274 C178 240 214 222 230 150 Z"/><path d="M230 214 C246 236 252 252 242 268 C236 278 224 278 218 268 C210 252 224 244 230 214 Z" fill="#fff"/>
    <text class="tl t0" transform="translate(112 200) rotate(-60)" text-anchor="middle">Ignition source</text><text class="tl t1" transform="translate(348 200) rotate(60)" text-anchor="middle">Fuel</text><text class="tl t2" x="230" y="394" text-anchor="middle">Oxidizer</text>`;
  add({
    id: 'fire', sb: '5.32', grp: G.comp, menu: 'Operating room fire', vo: [['Narration', 'fire']],
    build(ctx) {
      const st = ctx.stage;
      const gray = pnl('gray', 0, 0, 560, 720, 'l');
      const art = at(svg('0 0 460 410', TRI, 'tri', 'The fire triangle: an ignition source, a fuel and an oxidizer.'), 50, 150, 460);
      const hd = head('Complication 4 of 5', 'red', [['Operating'], ['room fire', 'in1 r']], 54, 616, 40, 600);
      const rows = [['Ignition source', 'The active electrode of an energy device.'], ['Fuel', 'Drapes, alcohol-based prep solutions, bowel gas, hair or tissue.'], ['Oxidizer', 'Oxygen-enriched air around the surgical site.']].map(([a, b], i) => krow('0' + (i + 1), a, b, 'slim'));
      const list = at(h('div', { class: 'abs' }, rows), 616, 206, 608);
      const prev = at(h('div', { class: 'abs prevent' }, h('p', { class: 'eyebrow red' }, 'Prevent it'), h('span', { class: 'fchip' }, 'Control oxygen'), h('span', { class: 'fchip' }, 'Let prep solutions dry completely'), h('span', { class: 'fchip' }, 'Holster the active electrode when not in use')), 616, 498, 608);
      st.append(gray, art, hd, list, prev);
      const on = (i) => () => art.classList.add('on' + i);
      ctx.timeline('fire', { pre: [[gray, 0.05]], 0: [hd], 1: [[art, 0.8]], 2: [rows[0], on(0)], 3: [rows[1], on(1)], 4: [rows[2], on(2)], 5: [[prev, 2.0]] });
    },
    notes: { build: ['Each side of the fire triangle lights up as the narrator explains it.'] }
  });

  /* 5.33 surgical smoke */
  add({
    id: 'smoke', sb: '5.33', grp: G.comp, menu: 'Surgical smoke', vo: [['Narration', 'smoke']],
    build(ctx) {
      const st = ctx.stage;
      const pic = photoPnl('team', '50% 35%', 700, 0, 580, 720, 'r');
      const hd = head('Complication 5 of 5', 'red', [['Surgical'], ['smoke', 'in1 r']], 62, 56, 44, 580);
      const r1 = krow('01', 'It blocks the laparoscopic view', null, 'slim'), r2 = krow('02', 'It exposes the team to harmful particles', null, 'slim');
      const list = at(h('div', { class: 'abs' }, r1, r2), 56, 250, 580);
      const act = pnl('red', 0, 470, 640, 170, 'l', at(h('div', { class: 'abs' }, h('p', { class: 'eyebrow white' }, 'What to do'), h('p', { style: { font: '400 34px/1.15 "Johnson Display", Georgia, serif' } }, 'Use local smoke evacuation and filtration.')), 56, 30, 540));
      st.append(pic, hd, list, act);
      ctx.timeline('smoke', { pre: [[pic, 0.05]], 0: [hd], 1: [r1], 2: [r2], 3: [act] });
    }
  });

  /* ====================== E. Best nursing practices ====================== */
  divider({
    id: 'best-practices', sb: '5.35', grp: G.care, menu: 'Best nursing practices in the operating room', vo: 'sec-e', n: '04', eyebrow: 'Section 4 of 4',
    lines: [['Best nursing practices'], ['in the operating room', 'in1']], size: 52, photo: 'gown', pos: '40% 30%',
    items: ['Before surgery', 'During surgery', 'After surgery']
  });

  /* 5.36 before surgery */
  add({
    id: 'before-surgery', sb: '5.36', grp: G.care, menu: 'Before surgery', vo: [['Narration', 'before']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Best nursing practices · 1 of 3', 'red', [['Before surgery']], 56, 56, 36, 700);
      const eq = ['<b>Read and follow</b> the manufacturer’s instructions', '<b>Check generator and handpiece compatibility</b>; run the self-test before the patient enters the room', '<b>Inspect</b> cables, insulation, transducer and tip for damage', '<b>Place the unit</b> on a stable surface with alarms on', '<b>Check for implanted electronic devices</b> and assess fire risk'].map(ckrow);
      const col1 = at(h('div', { class: 'abs' }, h('p', { class: 'colhd' }, 'Equipment'), eq), 56, 164, 580);
      const gray = pnl('gray', 680, 144, 600, 500, 'r');
      const re = ['<b>Correct size</b>, on clean, dry skin over well-vascularized muscle', '<b>Avoid</b> bony prominences, scar tissue, hair, weight-bearing areas, tattoos and metal implants', '<b>Patient not touching metal</b>; jewelry removed'].map(ckrow);
      const col2 = at(h('div', { class: 'abs' }, h('p', { class: 'colhd' }, 'Return electrode ', h('span', null, '(monopolar)')), re), 716, 164, 508);
      st.append(hd, col1, gray, col2);
      ctx.timeline('before', { pre: [[gray, 0.2]], 0: [hd, [col1, 1.0]], 1: [eq[0]], 2: [eq[1]], 3: [eq[2]], 4: [eq[3]], 5: [eq[4]], 6: [col2], 7: [re[0]], 8: [re[1]], 9: [re[2]] });
    },
    notes: { build: ['The storyboard described two tabs. Both lists fit side by side here, so nothing is hidden behind a tab.'] }
  });

  /* 5.37 during surgery */
  add({
    id: 'during-surgery', sb: '5.37', grp: G.care, menu: 'During surgery', vo: [['Narration', 'during']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Best nursing practices · 2 of 3', 'red', [['During surgery']], 56, 56, 36, 700);
      const all = ['<b>Confirm power settings</b>; use the lowest setting that works', '<b>Footswitch</b> close to the user', '<b>Return electrode</b> in uniform contact; remove eschar from the tip', '<b>Smoke evacuation</b> close to the surgical site', '<b>Idle devices in an insulated holster</b>, never on the drapes', '<b>No activation</b> near flammable material'].map(ckrow);
      const col1 = at(h('div', { class: 'abs' }, h('p', { class: 'colhd' }, 'All energy devices'), all), 56, 164, 580);
      const gray = pnl('gray', 680, 144, 600, 380, 'r');
      const us = ['<b>The blade stays hot</b>: avoid vital structures; cool the tip as the instructions for use direct', '<b>Alert the surgeon</b> to metal clips, staples or trocars near the active jaws'].map(ckrow);
      const col2 = at(h('div', { class: 'abs' }, h('p', { class: 'colhd' }, 'For ultrasonic devices'), us), 716, 164, 508);
      st.append(hd, col1, gray, col2);
      ctx.timeline('during', { pre: [[gray, 0.2]], 0: [hd, [col1, 0.8]], 1: [all[0]], 2: [all[1]], 3: [all[2]], 4: [all[3]], 5: [all[4], [all[5], 5.6]], 6: [col2], 7: [us[0]], 8: [us[1]] });
    },
    notes: { build: ['The ultrasonic points sit in their own panel, so the main checklist stays correct for every device type.'] }
  });

  /* 5.38 after surgery */
  add({
    id: 'after-surgery', sb: '5.38', grp: G.care, menu: 'After surgery', vo: [['Narration', 'after']],
    build(ctx) {
      const st = ctx.stage;
      const pic = photoPnl('handover', 'center 55%', 0, 0, 480, 720, 'l');
      const hd = head('Best nursing practices · 3 of 3', 'red', [['After surgery']], 56, 540, 44, 680);
      const rows = [['Check the device', 'The jaws and tip are intact, with no fragments left behind.'], ['Check the patient’s skin', 'including the return electrode site.'], ['Document', 'generators, serial numbers and settings used.']].map(([a, b], i) => krow('0' + (i + 1), a, b));
      const list = at(h('div', { class: 'abs' }, rows), 540, 210, 684);
      st.append(pic, hd, list);
      ctx.timeline('after', { pre: [[pic, 0.05]], 0: [hd, [rows[0], 2.6]], 1: [rows[1]], 2: [rows[2]] });
    }
  });

  /* 5.39 before, during or after? drag a card to a phase, or use the buttons */
  const ACTS = [
    ['Run the generator self-test', 0, 'It is done before the patient enters the room.'],
    ['Confirm the power setting', 1, 'Settings are confirmed as the device is used.'],
    ['Check the device tip is intact', 2, 'This is checked before closing, when the device is no longer needed.'],
    ['Inspect cables and insulation', 0, 'Damage should be found before the device reaches the sterile field.'],
    ['Holster the device when it is not in use', 1, 'This applies every time the device is put down during the case.'],
    ['Place the return electrode on clean, dry skin over muscle', 0, 'The pad goes on before the first activation.'],
    ['Document generator serial numbers and settings', 2, 'The record is completed at the end of the case.'],
    ['Keep smoke evacuation close to the site', 1, 'Smoke is produced during activation.']
  ];
  const PH = ['Before', 'During', 'After'];
  add({
    id: 'sort-phases', sb: '5.39', grp: G.care, menu: 'Before, during or after?', vo: [['Narration', 'sort']],
    build(ctx) {
      const st = ctx.stage;
      const hd = head('Put it into practice', 'red', [['Before, during or after?']], 50, 56, 34, 900);
      const lists = PH.map(p => h('div', { role: 'list', 'aria-label': p + ' surgery' }));
      const cols = PH.map((p, i) => at(h('div', { class: 'abs dropcol' }, h('div', { class: 'hd' }, h('span', { class: 'kn', 'aria-hidden': 'true' }, '0' + (i + 1)), h('b', null, p + ' surgery')), lists[i]), 56 + i * 396, 136, 376, 290));
      const pile = at(h('div', { class: 'abs' }), 290, 444, 700);
      const live = h('p', { class: 'pl-sr', 'aria-live': 'polite' });
      st.append(hd, ...cols, pile, live);
      ctx.lock('Sort all eight actions to go on.');
      let i = 0;
      function card() {
        pile.innerHTML = '';
        if (i >= ACTS.length) {
          pile.append(h('div', { class: 'sortfin reveal', role: 'status' }, E.doneMark(), h('div', null, h('p', { class: 'big' }, 'All eight actions sorted'), h('p', null, 'Preparation, vigilance and follow-up: the nurse’s part in every phase.'))));
          ctx.unlock(); return;
        }
        const [txt, ans, why] = ACTS[i];
        const msg = h('p', { class: 'msg', hidden: true });
        const btns = PH.map((p, j) => { const b = h('button', { type: 'button' }, p); b.addEventListener('click', () => choose(j)); return b; });
        const grip = h('span', { class: 'grip', 'aria-hidden': 'true', html: '<svg viewBox="0 0 16 24" fill="currentColor"><circle cx="4" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="4" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="12" cy="19" r="2"/></svg>' });
        const c = h('div', { class: 'sortcard drag', role: 'group', 'aria-label': `Action ${i + 1} of ${ACTS.length}` },
          h('p', { class: 'counter' }, `Action ${i + 1} of ${ACTS.length}`), h('div', { class: 'dragrow' }, grip, h('p', { class: 'txt' }, txt)),
          h('div', { class: 'col3' }, btns), msg);
        function choose(pick) {
          const ok = pick === ans;
          ctx.answer({ type: 'choice', response: PH[pick], correct: [PH[ans]], ok, text: txt });
          if (!ok) { msg.hidden = false; msg.textContent = 'Not quite. ' + why; c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); live.textContent = 'Not quite. ' + why; return; }
          lists[ans].append(h('div', { class: 'placed', role: 'listitem' }, h('span', { class: 'ck', 'aria-hidden': 'true', html: ICON.check }), h('span', null, txt)));
          live.textContent = 'Correct: ' + PH[ans] + ' surgery.';
          i++; card();
          const nb = pile.querySelector('.sortcard button'); nb && nb.focus();
        }
        // dragging: the card follows the pointer and drops on the column under it
        let drag = null;
        c.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; drag = { x: e.clientX, y: e.clientY, moved: false }; c.setPointerCapture(e.pointerId); });
        c.addEventListener('pointermove', (e) => {
          if (!drag) return;
          const k = ctx.scale(), dx = (e.clientX - drag.x) / k, dy = (e.clientY - drag.y) / k;
          if (!drag.moved && Math.hypot(dx, dy) < 6) return;
          drag.moved = true; c.classList.add('dragging'); c.style.transform = `translate(${dx}px, ${dy}px) rotate(-1.5deg)`;
          cols.forEach(col => { const r = col.getBoundingClientRect(); col.classList.toggle('over', e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom); });
        });
        const drop = (e) => {
          if (!drag) return;
          const was = drag.moved; drag = null; c.classList.remove('dragging'); c.style.transform = '';
          const hit = cols.findIndex(col => col.classList.contains('over')); cols.forEach(col => col.classList.remove('over'));
          if (was && hit >= 0) choose(hit);
        };
        c.addEventListener('pointerup', drop); c.addEventListener('pointercancel', drop);
        pile.append(c);
      }
      card();
      ctx.timeline('sort', { 0: [hd], 1: [[cols[0], 0.2], [cols[1], 0.5], [cols[2], 0.8], [pile, 1.4]] });
    },
    notes: { build: ['Drag each card to a phase, or use the three buttons (the keyboard and touch alternative).', 'A wrong choice gives a one-line reason and the card stays for another try.'] }
  });

  /* ====================== F. Post-test and close ====================== */

  /* 5.40 post-test: 10 questions drawn from the 20-question bank, by group */
  const QUIZ = window.POV_QUIZ || { groups: [], questions: [], pass: 8 };
  function drawSet() {
    const out = [];
    QUIZ.groups.forEach((g, gi) => {
      const pool = QUIZ.questions.filter(q => q.g === gi);
      for (let k = pool.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [pool[k], pool[j]] = [pool[j], pool[k]]; }
      out.push(...pool.slice(0, g.draw).sort((a, b) => a.n - b.n));
    });
    return out;
  }
  add({
    id: 'post-test', sb: '5.40', grp: G.end, menu: 'Post-test', vo: [['Narration', 'test']],
    build(ctx) {
      const st = ctx.stage;
      const total = QUIZ.groups.reduce((a, g) => a + g.draw, 0), need = QUIZ.pass;
      const view = h('div', { style: { position: 'absolute', inset: '0' } });
      st.append(view);
      ctx.lock('Finish the post-test to go on.');
      let set = [], n = 0, picks = [];

      function intro(first) {
        view.innerHTML = '';
        const red = pnl('red', 0, 0, 520, 720, 'l', at(h('div', { class: 'abs' }, h('p', { class: 'eyebrow white' }, 'Check your understanding'), dh([['Post-test']], 84, 'white')), 56, 56, 420), at(h('div', { class: 'sec-n abs', 'aria-hidden': 'true' }, String(total)), 46, 380));
        const rows = [krow('01', `${total} questions`, 'drawn from all sections of the module.'), krow('02', 'One answer per question', 'Choose the best answer for each one.'), krow('03', `${need} correct answers to pass`, `(${Math.round(need / total * 100)}%, to be confirmed).`)];
        const list = at(h('div', { class: 'abs' }, rows), 580, 96, 644);
        const go = h('button', { class: 'btn', type: 'button', html: 'Start the post-test' + ICON.arrow });
        go.addEventListener('click', start);
        const goW = at(h('div', { class: 'abs' }, go), 580, 520);
        view.append(red, list, goW);
        if (first) ctx.timeline('test', { pre: [[red, 0.05]], 1: [rows[0]], 2: [rows[1]], 3: [rows[2], [goW, 1.2]] });
      }
      function start() { ctx.endLayerVO(); set = drawSet(); n = 0; picks = []; question(); }
      function question() {
        view.innerHTML = '';
        const q = set[n];
        let pick = -1;
        const sub = h('button', { class: 'btn sm', type: 'button', disabled: true }, n === set.length - 1 ? 'Submit and see my result' : 'Submit answer');
        const opts = q.opts.map((t, i) => {
          const b = h('button', { class: 'qopt', type: 'button', role: 'radio', 'aria-checked': 'false', tabindex: i ? '-1' : '0' }, h('span', { class: 'badge', 'aria-hidden': 'true' }, 'ABCD'[i]), h('span', null, t));
          const choose = () => { pick = i; opts.forEach((x, j) => { x.setAttribute('aria-checked', String(j === i)); x.tabIndex = j === i ? 0 : -1; }); sub.disabled = false; };
          b.addEventListener('click', choose);
          b.addEventListener('keydown', (e) => { const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (d) { e.preventDefault(); const j = (i + d + opts.length) % opts.length; opts[j].focus(); opts[j].click(); } });
          return b;
        });
        const pips = set.map((_, i) => h('span', { class: 'pip' + (i < n ? ' on' : i === n ? ' now' : ''), 'aria-hidden': 'true' }));
        const top = at(h('div', { class: 'abs qtop' }, h('p', { class: 'eyebrow red' }, `Question ${n + 1} of ${set.length}`), h('div', null, pips)), 56, 40, 1168);
        const qt = at(h('h2', { class: 'abs qtext', id: 'mcq' }, q.q), 56, 86, 1168);
        const box = at(h('div', { class: 'abs qopts', role: 'radiogroup', 'aria-labelledby': 'mcq' }, opts), 56, 0, 1168);
        const foot = at(h('div', { class: 'abs' }, sub), 0, 632);
        foot.style.left = 'auto'; foot.style.right = '56px';
        view.append(top, qt, box, foot);
        box.style.top = (86 + qt.offsetHeight + 22) + 'px';
        view.classList.remove('reveal'); void view.offsetWidth; view.classList.add('reveal');
        sub.addEventListener('click', () => {
          picks[n] = pick;
          ctx.answer({ type: 'choice', response: 'ABCD'[pick], correct: ['ABCD'[q.ans]], ok: pick === q.ans, text: q.q });
          n++; if (n < set.length) question(); else results();
        });
        setTimeout(() => opts[0].focus({ preventScroll: true }), 60);
      }
      function results() {
        view.innerHTML = '';
        const score = set.filter((q, i) => picks[i] === q.ans).length, pass = score >= need;
        const red = pnl(pass ? 'red' : 'gray', 0, 0, 520, 720, 'l', at(h('div', { class: 'abs' }, h('p', { class: 'eyebrow ' + (pass ? 'white' : 'red dk') }, 'Your result'), h('p', { class: 'score' }, String(score), h('small', null, ' / ' + set.length)), h('p', { class: 'lead' }, `Pass mark: ${need} of ${set.length}`)), 56, 56, 420));
        const again = h('button', { class: 'btn' + (pass ? ' ghost' : ''), type: 'button', html: ICON.restart + (pass ? 'Take it again' : 'Try again with new questions') });
        again.addEventListener('click', start);
        let body;
        if (pass) {
          const next = h('button', { class: 'btn', type: 'button', html: 'Continue' + ICON.arrow });
          next.addEventListener('click', () => ctx.go(ctx.slide.idx + 1));
          body = h('div', { role: 'status' }, h('div', { class: 'resline' }, doneMark(), h('p', { class: 'restitle' }, 'Well done')), h('p', { class: 'lead' }, `You passed the post-test with ${score} out of ${set.length}. You have completed this module.`), h('div', { class: 'resbtns' }, next, again));
        } else {
          const missed = [...new Set(set.filter((q, i) => picks[i] !== q.ans).map(q => q.sb))];
          const links = missed.map(sb => { const s = S.find(x => x.sb === sb); const b = h('button', { class: 'revlink', type: 'button' }, h('span', null, s ? s.menu : sb), h('span', { class: 'go', html: 'Review' + ICON.arrow })); b.addEventListener('click', () => s && ctx.go(s.id)); return b; });
          body = h('div', { role: 'status' }, h('p', { class: 'restitle' }, 'Not yet'), h('p', { class: 'lead' }, `You scored ${score} out of ${set.length}. You need ${Math.round(need / set.length * 100)}% to pass. Review the topics below, then try again with a new set of questions.`), h('div', { class: 'revlist' }, links), h('div', { class: 'resbtns' }, again));
        }
        view.append(red, at(h('div', { class: 'abs resbody' }, body), 580, 64, 644));
        view.classList.remove('reveal'); void view.offsetWidth; view.classList.add('reveal');
        ctx.unlock();
        setTimeout(() => { const f = view.querySelector('.resbtns button'); f && f.focus({ preventScroll: true }); }, 60);
      }
      intro(true);
      // for reviewers and testing: window.POV_TEST.finish(8) answers the test with that many correct
      window.POV_TEST = { finish(k) { set = drawSet(); picks = set.map((q, i) => i < k ? q.ans : (q.ans + 1) % 4); n = set.length; results(); } };
    },
    notes: { build: ['Ten questions are drawn at random by group (1, 2, 3, 2, 2), so every section is tested. A new attempt draws a new set.', 'The questions and options are the bank as supplied. There is no feedback per question; the result screen lists the topics to review.', 'Next unlocks when the result is shown, pass or not, so reviewers can move on. In the final module this follows the pass rule you choose.'], flags: ['Pass mark (80% suggested) and whether completion requires a pass.'] }
  });

  /* 5.41 references */
  const REFS = [
    'Association of periOperative Registered Nurses (AORN). Guidelines for Perioperative Practice. Current edition.',
    'Feldman LS, et al. (eds.). The SAGES Manual on the Fundamental Use of Surgical Energy (FUSE). Springer; 2012.',
    'Greenblatt SH. Harvey Cushing’s paradigmatic contribution to neurosurgery and the evolution of his thoughts about specialization. Bulletin of the History of Medicine. 2003;77(4):789-822.',
    'Chekan E, et al. Consistency and sealing of advanced bipolar tissue sealers. 2010.',
    'ECRI. Surgical fire prevention guide. Health Devices. 2009;38(10):313-332.',
    'J&J MedTech. Science of Energy critical concepts video series, episodes 3 to 5.'
  ];
  add({
    id: 'references', sb: '5.41', grp: G.end, menu: 'References',
    build(ctx) {
      const st = ctx.stage;
      const red = pnl('red', 0, 0, 400, 720, 'l', at(h('div', { class: 'abs' }, h('p', { class: 'eyebrow white' }, 'Sources'), dh([['References']], 60, 'white')), 56, 56, 320));
      const list = at(h('ol', { class: 'abs reflist', tabindex: '0', 'aria-label': 'References' }, REFS.map(r => h('li', null, r)),
        h('li', { class: 'pending' }, 'References for the new text on complications and nursing practices: to be added when the list is received.')), 456, 40, 768, 640);
      st.append(red, list);
      ctx.timeline(null, { pre: [[red, 0.05], [list, 0.4]] });
    },
    notes: { flags: ['The reference list for the new complications and nursing practice text (references 1 to 6 in the edited Word file).', 'AORN edition and chapter titles to confirm.'] }
  });

  /* 5.42 thank you */
  add({
    id: 'thank-you', sb: '5.42', grp: G.end, menu: 'Thank you', vo: [['Narration', 'thanks']],
    build(ctx) {
      const st = ctx.stage;
      const red = pnl('red', 0, 0, 760, 720, 'l');
      const hd = head('Module 5 complete', 'white', [['Thank you!']], 96, 56, 60, 660, 'white');
      const txt = at(h('p', { class: 'lead abs', style: { color: '#fff' } }, 'Congratulations! You have completed the Johnson & Johnson S.P.A.R.K.S. course on energy device management for OR nurses.'), 56, 270, 600);
      const aid = h('a', { class: 'btn on-red', href: 'assets/Energy safety card.pdf', target: '_blank', rel: 'noopener', html: 'Open the energy safety card (PDF)' + ICON.arrow });
      const aidW = at(h('div', { class: 'abs' }, h('p', { class: 'eyebrow white', style: { marginBottom: '14px' } }, 'Take this with you'), aid), 56, 468);
      const pic = photoPnl('title', '50% 25%', 760, 0, 520, 380, 'r');
      const again = h('button', { class: 'btn ghost', type: 'button', html: ICON.restart + 'Replay the module' });
      again.addEventListener('click', () => ctx.go(0));
      const doneBox = at(h('div', { class: 'abs', role: 'status' }, h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '22px' } }, doneMark(), h('p', { style: { font: '400 38px/1.05 "Johnson Display", Georgia, serif' } }, 'Module complete')), again), 808, 416, 420);
      const fp = fine('Review build of the storyboard. Content to be confirmed by J&J Medical Affairs.', 808, 606, 420);
      st.append(red, hd, txt, aidW, pic, doneBox, fp);
      ctx.timeline('thanks', { pre: [[red, 0.05], [pic, 0.3], [fp, 0.6]], 0: [hd], 1: [txt], 2: [aidW, doneBox] });
    },
    notes: { build: ['The energy safety card is the one-page job aid from the storyboard, as a draft PDF.'] }
  });
})();
