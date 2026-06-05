/* ============================================================
   lesnav.js — injecteert lesnavigatie (vorige/volgende les +
   terug naar leerpad) op elke les_*.html, en vult het
   doelen-blok met de eindtermteksten uit eindtermen.js.
   Vereist: lessons.js én eindtermen.js eerder ingeladen.
============================================================ */
(function () {
  'use strict';
  var L = window.LESSONS || [];
  var ET = window.EINDTERMEN || {};

  /* ── nav-styling injecteren ─────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '.les-nav{background:var(--darkblue);padding:2rem 2.5rem;margin-top:3rem}',
    '.les-nav-inner{max-width:820px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}',
    '.les-nav a{font-family:"Source Sans 3",sans-serif;font-size:.9rem;font-weight:600;color:var(--gold);text-decoration:none;letter-spacing:.04em;padding:.45rem .9rem;border:1px solid rgba(212,160,23,.35);border-radius:4px;transition:background .15s,border-color .15s}',
    '.les-nav a:hover{background:rgba(212,160,23,.12);border-color:var(--gold)}',
    '.les-nav-home{color:var(--sand)!important;border-color:rgba(232,220,200,.25)!important}',
    '.les-nav-prev::before{content:"\\2190  "}',
    '.les-nav-next::after{content:"  \\2192"}',
    '@media(max-width:600px){.les-nav-inner{flex-direction:column;align-items:stretch;text-align:center}}'
  ].join('\n');
  document.head.appendChild(style);

  /* ── doelen-blok vullen uit EINDTERMEN ──────────────────── */
  document.querySelectorAll('.doelen-blok[data-codes]').forEach(function (blok) {
    var ul = blok.querySelector('ul');
    if (!ul) return;
    blok.getAttribute('data-codes').trim().split(/\s+/).forEach(function (code) {
      var li = document.createElement('li');
      li.innerHTML = '<span class="et-code">' + code + '</span><span>' +
        (ET[code] || '(onbekende eindterm)') + '</span>';
      ul.appendChild(li);
    });
  });

  /* ── vorige/volgende les ────────────────────────────────── */
  var filename = window.location.pathname.split('/').pop() || '';
  var idx = L.findIndex(function (x) { return x.file === filename; });
  if (idx === -1) return;
  var prev = idx > 0 ? L[idx - 1] : null;
  var next = idx < L.length - 1 ? L[idx + 1] : null;

  var nav = document.createElement('nav');
  nav.className = 'les-nav';
  nav.setAttribute('aria-label', 'Lesnavigatie');
  var html = '<div class="les-nav-inner">';
  html += '<a href="leerpad.html" class="les-nav-home">Leerpad</a>';
  html += '<div style="display:flex;gap:.75rem;flex-wrap:wrap;justify-content:flex-end">';
  if (prev) html += '<a href="' + prev.file + '" class="les-nav-prev">Les ' + prev.n + '</a>';
  if (next) html += '<a href="' + next.file + '" class="les-nav-next">Les ' + next.n + '</a>';
  html += '</div></div>';
  nav.innerHTML = html;

  var btn = document.getElementById('back-to-top');
  if (btn) btn.parentNode.insertBefore(nav, btn);
  else document.body.appendChild(nav);
})();
