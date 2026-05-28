/* ============================================================
   nav.js — injects prev/next chapter navigation into every
   chapter page of the Geschiedenis 1A course.
   Usage: <script src="nav.js"></script> before </body>
============================================================ */
(function () {
  'use strict';

  var CHAPTERS = [
    { file: 'inleiding.html',     title: 'Inleiding',                                       short: 'Inleiding' },
    { file: 'hoofdstuk_01.html',  title: 'H1 — Hoe orden je de tijd?',                 short: 'H1' },
    { file: 'hoofdstuk_02.html',  title: 'H2 — Hoe orden je de ruimte?',               short: 'H2' },
    { file: 'hoofdstuk_03.html',  title: 'H3 — De vier werelden van de mens',          short: 'H3' },
    { file: 'hoofdstuk_04.html',  title: 'H4 — Hoe werk je met historische bronnen?',  short: 'H4' },
    { file: 'hoofdstuk_05.html',  title: 'H5 — Kunst en cultuur lezen',                short: 'H5' },
    { file: 'hoofdstuk_06.html',  title: 'H6 — Hoe schrijven historici geschiedenis?', short: 'H6' },
    { file: 'hoofdstuk_07.html',  title: 'H7 — Van mensaap tot Homo sapiens',          short: 'H7' },
    { file: 'hoofdstuk_08.html',  title: 'H8 — Jagers en voedselverzamelaars',         short: 'H8' },
    { file: 'hoofdstuk_09.html',  title: 'H9 — De agrarische revolutie',               short: 'H9' },
    { file: 'hoofdstuk_10.html',  title: 'H10 — Mesopotamië',                     short: 'H10' },
    { file: 'hoofdstuk_11.html',  title: 'H11 — Het oude Egypte',                      short: 'H11' },
    { file: 'hoofdstuk_12.html',  title: 'H12 — De vroegste Grieken',                  short: 'H12' },
    { file: 'hoofdstuk_13.html',  title: 'H13 — De Griekse stadstaten',                short: 'H13' },
    { file: 'hoofdstuk_14.html',  title: 'H14 — Alexander de Grote',                   short: 'H14' },
    { file: 'hoofdstuk_15.html',  title: 'H15 — De stichting van Rome',                short: 'H15' },
    { file: 'hoofdstuk_16.html',  title: 'H16 — De Romeinse republiek',                short: 'H16' },
    { file: 'hoofdstuk_17.html',  title: 'H17 — Het Romeinse keizerrijk',              short: 'H17' },
    { file: 'hoofdstuk_18.html',  title: 'H18 — Het einde van een wereld',             short: 'H18' },
    { file: 'hoofdstuk_19.html',  title: 'H19 — Samenlevingen vergelijken',            short: 'H19' },
    { file: 'nawoord.html',       title: 'Nawoord',                                          short: 'Nawoord' }
  ];

  /* ── inject styles ─────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '.site-header .label[href]{color:var(--gold);text-decoration:none;transition:opacity .15s}',
    '.site-header .label[href]:hover{opacity:.75}',
    '.chapter-nav{background:var(--darkblue);padding:2rem 2.5rem;margin-top:3rem}',
    '.chapter-nav-inner{max-width:820px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}',
    '.chapter-nav a{font-family:"Source Sans 3",sans-serif;font-size:.9rem;font-weight:600;color:var(--gold);text-decoration:none;letter-spacing:.04em;padding:.45rem .9rem;border:1px solid rgba(212,160,23,.35);border-radius:4px;transition:background .15s,border-color .15s}',
    '.chapter-nav a:hover{background:rgba(212,160,23,.12);border-color:var(--gold)}',
    '.chapter-nav-home{color:var(--sand)!important;border-color:rgba(232,220,200,.25)!important}',
    '.chapter-nav-home:hover{background:rgba(232,220,200,.08)!important;border-color:rgba(232,220,200,.5)!important}',
    '.chapter-nav-prev::before{content:"←  "}',
    '.chapter-nav-next::after{content:"  →"}',
    '@media(max-width:600px){.chapter-nav{padding:1.5rem 1rem}.chapter-nav-inner{flex-direction:column;align-items:stretch;text-align:center}}'
  ].join('\n');
  document.head.appendChild(style);

  /* ── find current page ──────────────────────────────────── */
  var filename = window.location.pathname.split('/').pop() || '';
  var idx = CHAPTERS.findIndex(function (c) { return c.file === filename; });
  if (idx === -1) return;

  /* ── make header label a link back to course index ───────── */
  var label = document.querySelector('.site-header .label:first-child');
  if (label && label.tagName !== 'A') {
    var a = document.createElement('a');
    a.href = 'index.html';
    a.className = label.className;
    a.textContent = label.textContent;
    label.parentNode.replaceChild(a, label);
  }

  /* ── build prev/next bar ─────────────────────────────────── */
  var prev = idx > 0 ? CHAPTERS[idx - 1] : null;
  var next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;

  var nav = document.createElement('nav');
  nav.className = 'chapter-nav';
  nav.setAttribute('aria-label', 'Hoofdstuknavigatie');

  var html = '<div class="chapter-nav-inner">';
  html += '<a href="index.html" class="chapter-nav-home">Overzicht</a>';
  html += '<div style="display:flex;gap:.75rem;flex-wrap:wrap;justify-content:flex-end">';
  if (prev) {
    html += '<a href="' + prev.file + '" class="chapter-nav-prev">' + prev.short + '</a>';
  }
  if (next) {
    html += '<a href="' + next.file + '" class="chapter-nav-next">' + next.short + '</a>';
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
