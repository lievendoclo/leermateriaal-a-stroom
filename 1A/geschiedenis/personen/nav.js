/* ============================================================
   nav.js — injects prev/next person navigation into every
   person page of the Historische personen subsection.
   Usage: <script src="nav.js"></script> before </body>
============================================================ */
(function () {
  'use strict';

  var PERSONS = [
    { file: 'hammurabi.html',    title: 'Hammurabi',          short: 'Hammurabi' },
    { file: 'hatsjepsoet.html',  title: 'Hatsjepsoet',        short: 'Hatsjepsoet' },
    { file: 'ramses-ii.html',    title: 'Ramses II',           short: 'Ramses II' },
    { file: 'homeros.html',      title: 'Homeros',             short: 'Homeros' },
    { file: 'perikles.html',     title: 'Perikles',            short: 'Perikles' },
    { file: 'sokrates.html',     title: 'Sokrates',            short: 'Sokrates' },
    { file: 'alexander.html',    title: 'Alexander de Grote',  short: 'Alexander' },
    { file: 'hannibal.html',     title: 'Hannibal',            short: 'Hannibal' },
    { file: 'caesar.html',       title: 'Julius Caesar',       short: 'Caesar' },
    { file: 'cleopatra.html',    title: 'Cleopatra VII',       short: 'Cleopatra' },
  ];

  /* ── inject styles ─────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '.site-header .label[href]{color:var(--gold);text-decoration:none;transition:opacity .15s}',
    '.site-header .label[href]:hover{opacity:.75}',
    '.personen-nav{background:var(--darkblue);padding:2rem 2.5rem;margin-top:3rem}',
    '.personen-nav-inner{max-width:820px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}',
    '.personen-nav a{font-family:"Source Sans 3",sans-serif;font-size:.9rem;font-weight:600;color:var(--gold);text-decoration:none;letter-spacing:.04em;padding:.45rem .9rem;border:1px solid rgba(212,160,23,.35);border-radius:4px;transition:background .15s,border-color .15s}',
    '.personen-nav a:hover{background:rgba(212,160,23,.12);border-color:var(--gold)}',
    '.personen-nav-home{color:var(--sand)!important;border-color:rgba(232,220,200,.25)!important}',
    '.personen-nav-home:hover{background:rgba(232,220,200,.08)!important;border-color:rgba(232,220,200,.5)!important}',
    '.personen-nav-prev::before{content:"←  "}',
    '.personen-nav-next::after{content:"  →"}',
    '@media(max-width:600px){.personen-nav{padding:1.5rem 1rem}.personen-nav-inner{flex-direction:column;align-items:stretch;text-align:center}}'
  ].join('\n');
  document.head.appendChild(style);

  /* ── find current page ──────────────────────────────────── */
  var filename = window.location.pathname.split('/').pop() || '';
  var idx = PERSONS.findIndex(function (p) { return p.file === filename; });
  if (idx === -1) return;

  /* ── make header label a link back to persons index ─────── */
  var label = document.querySelector('.site-header .label:first-child');
  if (label && label.tagName !== 'A') {
    var a = document.createElement('a');
    a.href = 'index.html';
    a.className = label.className;
    a.textContent = label.textContent;
    label.parentNode.replaceChild(a, label);
  }

  /* ── build prev/next bar ─────────────────────────────────── */
  var prev = idx > 0 ? PERSONS[idx - 1] : null;
  var next = idx < PERSONS.length - 1 ? PERSONS[idx + 1] : null;

  var nav = document.createElement('nav');
  nav.className = 'personen-nav';
  nav.setAttribute('aria-label', 'Navigatie historische personen');

  var html = '<div class="personen-nav-inner">';
  html += '<a href="index.html" class="personen-nav-home">← Overzicht personen</a>';
  html += '<div style="display:flex;gap:.75rem;flex-wrap:wrap;justify-content:flex-end">';
  if (prev) {
    html += '<a href="' + prev.file + '" class="personen-nav-prev">' + prev.short + '</a>';
  }
  if (next) {
    html += '<a href="' + next.file + '" class="personen-nav-next">' + next.short + '</a>';
  }
  html += '</div></div>';
  nav.innerHTML = html;

  /* insert before the back-to-top button (or at end of body) */
  var btn = document.getElementById('back-to-top');
  if (btn) {
    btn.parentNode.insertBefore(nav, btn);
  } else {
    document.body.appendChild(nav);
  }
})();
