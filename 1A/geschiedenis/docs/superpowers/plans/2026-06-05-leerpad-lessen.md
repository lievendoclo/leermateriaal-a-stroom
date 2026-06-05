# Leerpad "Les per les" (Geschiedenis 1A) — Implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Een optioneel lessenspoor toevoegen aan het bestaande geschiedenisboek, waarbij een leerling het vak in ~32 lessen van ±1 uur kan doorlopen, met rijke omkadering, deeplinks naar de bestaande hoofdstukinhoud, voortgangsbijhouding en een concordantietabel naar de officiële eindtermen (8.1–8.9).

**Architecture:** Statische HTML/CSS/JS, additief in `1A/geschiedenis/`. Eén databron (`lessons.js`) voedt het overzicht (`leerpad.html`), de navigatie (`lesnav.js`) en de concordantie (`concordantie.html`). Lespagina's zijn statische HTML uit één vast sjabloon; hun kern verwijst met deeplinks (`hoofdstuk_NN.html?les=K#sNN-x`) naar ongewijzigde hoofdstukken. Voortgang via `localStorage`. Twee bestaande bestanden krijgen een kleine edit (`index.html` CTA, `nav.js` terug-lintje).

**Tech Stack:** Vanilla HTML5 + CSS (bestaand inline design system) + vanilla JS (geen build, geen dependencies), zelfde patroon als de bestaande `nav.js`.

**Spec:** `docs/superpowers/specs/2026-06-05-leerpad-lessen-design.md`

**Verificatie i.p.v. unit tests:** dit is een statische-site-feature zonder testrunner. "Tests" zijn concrete bash-checks (tag-balans, anker-/linkbestaan, data↔bestanden) plus een browser-smoketest. Elke taak eindigt met een verificatiecommando met verwachte output.

**Conventies (volg strikt):**
- Werk uitsluitend in `1A/geschiedenis/`. Raak geen andere vakken aan.
- Hoofdstukbestanden (`hoofdstuk_*.html`) worden NIET gewijzigd (geen ankers toevoegen — die bestaan al als `s<H>-<n>`).
- Gebruik bestaande componentklassen; nieuwe CSS enkel onder een duidelijk `/* === LES === */`-blok.
- Geen commits tenzij expliciet gevraagd (de repo werkt in een niet-gecommitte working tree). Waar het plan "Commit" zegt: enkel uitvoeren als de gebruiker daarom vraagt; anders overslaan en doorgaan.

---

## Bestandsoverzicht

| Bestand | Actie | Verantwoordelijkheid |
|---|---|---|
| `eindtermen.js` | nieuw | `window.EINDTERMEN` — codes 8.1–8.9 met verbatim tekst |
| `lessons.js` | nieuw | `window.LESSONS` — het lessenplan (bron van waarheid) |
| `lesnav.js` | nieuw | Injecteert lesnav + les-componenthelpers op lespagina's |
| `leerpad.html` | nieuw | Overzichts-hub, voortgang |
| `concordantie.html` | nieuw | Matrix les ↔ eindterm |
| `les_01.html`…`les_32.html` | nieuw | Lespagina's (uit sjabloon) |
| `index.html` | edit | CTA-knop naar `leerpad.html` |
| `nav.js` | edit | `?les=NN` → terug-naar-les-lintje op hoofdstukpagina's |

**Delen (uit `index.html`):** D1=H1–H6 · D2=H7–H9 · D3=H10–H11 · D4=H12–H14 (Griekenland) · D5=H15–H18 (Rome) · D6=H19.

---

## Task 1: Eindtermen-data (`eindtermen.js`)

**Files:**
- Create: `1A/geschiedenis/eindtermen.js`

- [ ] **Step 1: Probeer de verbatim eindtermtekst op te halen**

Bron-poging (officieel besluit / leerplan I-Ges-a). De codering staat vast: sleutel­competentie 8 "historisch bewustzijn", 1ste graad A-stroom, eindtermen **8.1 t/m 8.9**. Zoek de letterlijke omschrijvingen op (bv. via onderwijsdoelen.be of een leerplan-PDF). Lukt dat niet betrouwbaar, gebruik dan de samenvattende omschrijvingen uit Step 2 als waarde (die zijn inhoudelijk correct afgeleid en volstaan voor een concordantie). Markeer in dat geval bovenaan het bestand met een `// bron: samengevat, verbatim te verfijnen`-commentaar.

- [ ] **Step 2: Schrijf `eindtermen.js`**

```js
/* ============================================================
   eindtermen.js — officiële eindtermen "historisch bewustzijn"
   (sleutelcompetentie 8), 1ste graad A-stroom. Codes 8.1–8.9.
   Gebruikt door leerpad.html, concordantie.html en de lespagina's.
============================================================ */
window.EINDTERMEN = {
  '8.1': 'De leerlingen situeren historische fenomenen in een historisch referentiekader aan de hand van structuurbegrippen, de westerse periodisering en de kenmerken en scharnierpunten van de prehistorie, het oude nabije oosten en de klassieke oudheid.',
  '8.2': 'De leerlingen onderscheiden samenlevingen aan de hand van de kenmerken van de maatschappelijke domeinen (politiek, sociaal, economisch, cultureel).',
  '8.3': 'De leerlingen lichten de principes van periodisering toe en duiden geschiedenis als een constructie achteraf.',
  '8.4': 'De leerlingen beoordelen historische bronnen op bruikbaarheid, betrouwbaarheid en representativiteit.',
  '8.5': 'De leerlingen onderscheiden informatie uit historische bronnen via een kritische bronnenconfrontatie.',
  '8.6': 'De leerlingen passen historische redeneerwijzen toe (oorzaak en gevolg, (on)gelijktijdigheid) en vullen historische beeldvorming aan met bewijs.',
  '8.7': 'De leerlingen onderbouwen een historische redenering met argumenten en bewijs en nemen daarbij meerdere perspectieven in.',
  '8.8': 'De leerlingen lichten de invloed van standplaatsgebondenheid op historische beeldvorming toe.',
  '8.9': 'De leerlingen maken het onderscheid tussen het verleden en geschiedenis en herkennen mythevorming.'
};
```

- [ ] **Step 3: Verifieer**

Run:
```bash
cd 1A/geschiedenis && node -e "global.window={};require('./eindtermen.js');const k=Object.keys(window.EINDTERMEN);console.log(k.length, k.join(','))"
```
Expected: `9 8.1,8.2,8.3,8.4,8.5,8.6,8.7,8.8,8.9`

---

## Task 2: Lessenplan (`lessons.js`) — KERN + CHECKPOINT

Dit is de ruggengraat. Het vereist het uitlezen van alle 19 hoofdstukken (sectie-id's + titels) en het groeperen tot ±1u-lessen.

**Files:**
- Create: `1A/geschiedenis/lessons.js`

- [ ] **Step 1: Inventariseer alle secties + ankers per hoofdstuk**

Run:
```bash
cd 1A/geschiedenis
for f in hoofdstuk_*.html; do
  echo "== $f =="
  grep -oE 'id="s[0-9]+-[0-9]+"[^>]*>|class="section-num">[^<]*|class="section-title">[^<]*' "$f" \
    | sed -E 's/.*id="(s[0-9]+-[0-9]+)".*/ANKER \1/; s/.*section-num">/NUM /; s/.*section-title">/TITEL /'
done
```
Gebruik de output om per hoofdstuk de secties (anker + nummer + titel) te kennen.

- [ ] **Step 2: Stel het lessenplan op volgens de chunking-regels**

Regels (uit de spec):
- ±60 min ≈ 3-4 secties + oefeningen + instap/afronding; dichte secties (tijdlijn, bronanalyse) tellen zwaarder.
- Een les blijft binnen één **deel**, liefst binnen één hoofdstuk.
- Lange hoofdstukken splitsen; korte/verwante (bv. H7+H8) samenvoegen.
- Ken elke les 1-3 eindtermcodes (8.1–8.9) toe op basis van de behandelde secties:
  - Vaardigheidshoofdstukken H1–H6 → referentiekader/bronnen/redeneren: 8.1, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9.
  - Samenlevings­hoofdstukken (H7–H18) → 8.1 (situeren), 8.2 (kenmerken samenlevingen), aangevuld met 8.6 (oorzaak-gevolg) waar van toepassing.
  - H19 (vergelijken) → 8.1, 8.2, plus 8.9 waar het over verleden↔heden gaat.

- [ ] **Step 3: Schrijf `lessons.js`**

Vorm (vul met het opgestelde plan; `n` uniek en oplopend; `file` = `les_<NN>.html` met 2 cijfers):
```js
/* ============================================================
   lessons.js — lessenplan Geschiedenis 1A (bron van waarheid).
   Gebruikt door leerpad.html, concordantie.html, lesnav.js.
============================================================ */
window.LESSONS = [
  {
    n: 1,
    file: 'les_01.html',
    title: 'Tijd ordenen: periodes en structuurbegrippen',
    deel: 1,
    deelTitle: 'De gereedschapskist van de historicus',
    readMin: 60,
    sources: [
      { file: 'hoofdstuk_01.html', anchor: 's1-1', label: 'H1 · 1.1' },
      { file: 'hoofdstuk_01.html', anchor: 's1-3', label: 'H1 · 1.3' }
    ],
    eindtermen: ['8.1', '8.3']
  }
  // ... alle overige lessen ...
];
```

- [ ] **Step 4: Verifieer dat elke deeplink-anker écht bestaat**

Run:
```bash
cd 1A/geschiedenis && node -e '
global.window={}; require("./lessons.js");
let bad=0;
for (const les of window.LESSONS) for (const s of les.sources) {
  const fs=require("fs"); const html=fs.readFileSync(s.file,"utf8");
  if (!html.includes("id=\""+s.anchor+"\"")) { console.log("ONTBREEKT:", les.file, s.file, "#"+s.anchor); bad++; }
}
console.log(bad===0 ? "OK alle ankers bestaan" : (bad+" ontbrekende ankers"));
'
```
Expected: `OK alle ankers bestaan`

- [ ] **Step 5: Verifieer dataconsistentie (nummers uniek, eindtermen geldig, dekking)**

Run:
```bash
cd 1A/geschiedenis && node -e '
global.window={}; require("./eindtermen.js"); const ET=window.EINDTERMEN;
global.window={}; require("./lessons.js"); const L=window.LESSONS;
const ns=L.map(x=>x.n); const dup=ns.filter((x,i)=>ns.indexOf(x)!==i);
console.log("lessen:", L.length, "| dubbele n:", dup.length?dup:"geen");
const used=new Set(); let badcode=0;
for (const l of L) for (const c of l.eindtermen){ used.add(c); if(!ET[c]){console.log("ongeldige code", l.file, c);badcode++;} }
const ongedekt=Object.keys(ET).filter(c=>!used.has(c));
console.log("ongeldige codes:", badcode, "| ongedekte eindtermen:", ongedekt.length?ongedekt:"geen");
'
```
Expected: `dubbele n: geen`, `ongeldige codes: 0`, `ongedekte eindtermen: geen`.

- [ ] **Step 6: CHECKPOINT — lessenplan aan de gebruiker tonen**

Toon een compacte tabel (les → deel → hoofdstuk/secties → eindtermen → ~tijd) en vraag akkoord vóór Task 6/9 (pagina's genereren). Pas `lessons.js` aan op feedback en herhaal Steps 4-5.

---

## Task 3: Lesnavigatie + les-helpers (`lesnav.js`)

**Files:**
- Create: `1A/geschiedenis/lesnav.js`

- [ ] **Step 1: Schrijf `lesnav.js`** (spiegelt `nav.js`; injecteert prev/next + leerpad-link onderaan, op basis van `window.LESSONS`)

```js
/* ============================================================
   lesnav.js — injecteert lesnavigatie (vorige/volgende les +
   terug naar leerpad) op elke les_*.html. Vereist dat lessons.js
   eerder is ingeladen (<script src="lessons.js"></script>).
============================================================ */
(function () {
  'use strict';
  var L = window.LESSONS || [];
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
```

- [ ] **Step 2: Verifieer syntax**

Run: `cd 1A/geschiedenis && node --check lesnav.js && echo OK`
Expected: `OK`

---

## Task 4: `nav.js` — terug-naar-les-lintje op hoofdstukpagina's

**Files:**
- Modify: `1A/geschiedenis/nav.js` (voeg een blok toe binnen de bestaande IIFE, vóór de afsluitende `})();`)

- [ ] **Step 1: Voeg het lintje-blok toe aan `nav.js`**

Voeg dit toe net vóór de regel `})();` aan het einde van `nav.js`:
```js
  /* ── "terug naar les"-lintje wanneer geopend vanuit een les ── */
  (function () {
    var params = new URLSearchParams(window.location.search);
    var les = params.get('les');
    if (!les || !/^\d+$/.test(les)) return;
    var lesFile = 'les_' + (les.length < 2 ? '0' + les : les) + '.html';
    var bar = document.createElement('a');
    bar.href = lesFile;
    bar.setAttribute('role', 'navigation');
    bar.style.cssText = 'display:block;background:var(--gold,#D4A017);color:#1A2B4A;' +
      'text-decoration:none;font-family:"Source Sans 3",sans-serif;font-weight:700;' +
      'font-size:.9rem;text-align:center;padding:.55rem 1rem;letter-spacing:.02em';
    bar.textContent = '📘  Onderdeel van Les ' + les + '  ▸  Terug naar de les';
    var hdr = document.querySelector('.site-header');
    if (hdr && hdr.parentNode) hdr.parentNode.insertBefore(bar, hdr.nextSibling);
    else document.body.insertBefore(bar, document.body.firstChild);
  })();
```

- [ ] **Step 2: Verifieer syntax + dat het bestaande gedrag intact is**

Run: `cd 1A/geschiedenis && node --check nav.js && grep -c "CHAPTERS" nav.js && echo OK`
Expected: `1` (de CHAPTERS-array staat er nog) en `OK`.

---

## Task 5: Lespagina-sjabloon (referentie) + eerste les `les_01.html`

Het sjabloon is de blauwdruk voor álle lespagina's. Bouw eerst `les_01.html` volledig als referentie, verifieer, en gebruik die exact als sjabloon in Task 9.

**Files:**
- Create: `1A/geschiedenis/les_01.html`

- [ ] **Step 1: Bouw het `<head>`**

Kopieer het volledige `<head>` (incl. het volledige inline `<style>`-blok, fonts, `:root`-variabelen) van een bestaand hoofdstuk, bv. `hoofdstuk_01.html`. Pas enkel de `<title>` aan naar `Les 1 — <titel> | Geschiedenis 1A`. Voeg onderaan het `<style>`-blok dit les-specifieke blok toe (vóór `</style>`):

```css
  /* === LES === */
  .les-meta{display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center;margin-top:1.6rem}
  .les-meta span{font-family:'Source Sans 3',sans-serif;font-size:.82rem;font-weight:600;
    color:var(--gold);background:rgba(212,160,23,.12);border:1px solid rgba(212,160,23,.35);
    border-radius:20px;padding:.3rem .85rem;letter-spacing:.02em}
  .doelen-blok{background:var(--sand-light);border:1px solid var(--sand);border-left:4px solid var(--oker);
    border-radius:var(--border-radius);padding:1.3rem 1.5rem;margin:1.5rem 0}
  .doelen-blok h3{font-family:'Source Sans 3',sans-serif;font-size:.78rem;font-weight:700;
    text-transform:uppercase;letter-spacing:.12em;color:var(--text-light);margin-bottom:.8rem}
  .doelen-blok ul{list-style:none;display:flex;flex-direction:column;gap:.55rem}
  .doelen-blok li{display:flex;gap:.7rem;font-size:.95rem;line-height:1.5}
  .doelen-blok .et-code{flex:0 0 auto;font-weight:700;color:var(--terracotta);font-variant-numeric:tabular-nums}
  .doelen-blok a{color:var(--terracotta);font-weight:600}
  .leesstap{display:flex;gap:1rem;align-items:flex-start;margin:1rem 0;padding:1rem 1.2rem;
    background:#fff;border:1px solid var(--sand);border-radius:var(--border-radius);box-shadow:var(--shadow-sm)}
  .leesstap .stap-num{flex:0 0 auto;width:2rem;height:2rem;border-radius:50%;background:var(--darkblue);
    color:var(--gold);font-family:'Playfair Display',serif;font-weight:700;display:flex;align-items:center;justify-content:center}
  .leesstap .stap-body{flex:1}
  .leesstap .leeslink{display:inline-block;margin-top:.5rem;font-family:'Source Sans 3',sans-serif;
    font-size:.88rem;font-weight:600;color:#fff;background:var(--terracotta);text-decoration:none;
    padding:.45rem .9rem;border-radius:4px;transition:background .15s}
  .leesstap .leeslink:hover{background:var(--terracotta-light)}
  .les-voortgang{text-align:center;margin:2.5rem 0 0}
  .les-voortgang button{font-family:'Source Sans 3',sans-serif;font-size:.95rem;font-weight:700;
    color:var(--darkblue);background:var(--gold);border:none;border-radius:6px;padding:.7rem 1.6rem;
    cursor:pointer;transition:background .15s,transform .1s}
  .les-voortgang button:hover{background:var(--gold-light)}
  .les-voortgang button.done{background:#2e7d32;color:#fff}
```

- [ ] **Step 2: Bouw de `<body>`** volgens deze exacte structuur (vul de inhoud voor les 1):

```html
<body>
<header class="site-header">
  <span class="label">← Geschiedenis 1A</span>
  <span class="label label-right">Leerpad · Les 1</span>
</header>

<section class="chapter-hero">
  <p class="chapter-kicker">Leerpad · Les 1 · Deel 1</p>
  <h1>Tijd ordenen: periodes en structuurbegrippen</h1>
  <p class="subtitle">Hoe deelt een historicus de tijd op — en waarom?</p>
  <div class="les-meta">
    <span>⏱ ±60 min</span>
    <span>📖 H1 · secties 1.1, 1.3</span>
    <span>🎯 8.1 · 8.3</span>
  </div>
</section>

<main class="page-wrapper">

  <section class="section-block">
    <div class="section-heading"><span class="section-num">·</span>
      <h2 class="section-title">Wat leer je deze les?</h2></div>
    <ul>
      <li>… 2-4 concrete lesdoelen …</li>
    </ul>
  </section>

  <aside class="doelen-blok">
    <h3>Onderwijsdoelen (eindtermen)</h3>
    <ul>
      <li><span class="et-code">8.1</span><span>Situeren in een historisch referentiekader …</span></li>
      <li><span class="et-code">8.3</span><span>Principes van periodisering …</span></li>
    </ul>
    <p style="margin-top:.8rem;font-size:.88rem"><a href="concordantie.html">Bekijk de volledige concordantietabel →</a></p>
  </aside>

  <section class="section-block">
    <div class="section-heading"><span class="section-num">1</span>
      <h2 class="section-title">Instap</h2></div>
    <p>… korte, prikkelende aanloop (1 alinea) …</p>
    <div class="denkvraag"><div class="dv-header">Denk eerst even na</div>
      <div class="dv-text">… activeringsvraag …</div></div>
  </section>

  <section class="section-block">
    <div class="section-heading"><span class="section-num">2</span>
      <h2 class="section-title">Aan de slag</h2></div>
    <p>Lees nu de volgende stukken in het hoofdstuk. Kom daarna terug voor de afronding.</p>
    <div class="leesstap"><span class="stap-num">1</span><div class="stap-body">
      <strong>H1 · 1.1 — …</strong><br>… één oriënterende zin …
      <a class="leeslink" href="hoofdstuk_01.html?les=1#s1-1">Lees sectie 1.1 →</a>
    </div></div>
    <div class="leesstap"><span class="stap-num">2</span><div class="stap-body">
      <strong>H1 · 1.3 — …</strong><br>… één oriënterende zin …
      <a class="leeslink" href="hoofdstuk_01.html?les=1#s1-3">Lees sectie 1.3 →</a>
    </div></div>
  </section>

  <section class="section-block">
    <div class="section-heading"><span class="section-num">3</span>
      <h2 class="section-title">Oefenen</h2></div>
    <p>Maak de oefeningen bij deze secties onderaan <a href="hoofdstuk_01.html?les=1#oefeningen">hoofdstuk 1</a>. …</p>
  </section>

  <section class="section-block">
    <div class="section-heading"><span class="section-num">4</span>
      <h2 class="section-title">Afronding</h2></div>
    <p>… één synthesezin …</p>
    <div class="denkvraag"><div class="dv-header">Kan je nu …?</div>
      <div class="dv-text">… 2-3 zelfcheckvragen …</div></div>
  </section>

  <!-- "Verder" enkel waar zinvol; anders weglaten:
  <section class="section-block">
    <div class="section-heading"><span class="section-num">5</span>
      <h2 class="section-title">Verder (uitbreiding)</h2></div>
    <p>… optionele uitbreidingstaak …</p>
  </section>
  -->

  <div class="les-voortgang">
    <button id="les-done-btn" data-les="1" type="button">Ik heb deze les afgewerkt</button>
  </div>

</main>

<button id="back-to-top" aria-label="Terug naar boven" title="Terug naar boven">↑</button>

<script src="lessons.js"></script>
<script src="eindtermen.js"></script>
<script src="lesnav.js"></script>
<script>
/* voortgangsknop — gedeeld localStorage met het leerpad */
(function(){
  var KEY='gesch-leerpad-voltooid';
  var btn=document.getElementById('les-done-btn'); if(!btn) return;
  var n=parseInt(btn.getAttribute('data-les'),10);
  function load(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}}
  function save(a){try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
  function render(){var d=load().indexOf(n)!==-1;btn.classList.toggle('done',d);
    btn.textContent=d?'✓ Afgewerkt':'Ik heb deze les afgewerkt';}
  btn.addEventListener('click',function(){var a=load();var i=a.indexOf(n);
    if(i===-1)a.push(n);else a.splice(i,1);save(a);render();});
  render();
})();
</script>
</body>
</html>
```

- [ ] **Step 3: Verifieer tag-balans + dat scripts in de juiste volgorde staan**

Run:
```bash
cd 1A/geschiedenis && f=les_01.html
echo "section $(grep -c '<section' $f)/$(grep -c '</section>' $f)  div $(grep -c '<div' $f)/$(grep -c '</div>' $f)"
grep -n 'src="lessons.js"\|src="lesnav.js"\|src="eindtermen.js"' $f
```
Expected: gelijke open/dicht-aantallen; `lessons.js` staat vóór `lesnav.js`.

- [ ] **Step 4: Verifieer de deeplinks in les_01 bestaan**

Run:
```bash
cd 1A/geschiedenis && for a in s1-1 s1-3; do grep -q "id=\"$a\"" hoofdstuk_01.html && echo "$a OK" || echo "$a ONTBREEKT"; done
```
Expected: `s1-1 OK`, `s1-3 OK`.

---

## Task 6: Leerpad-overzicht (`leerpad.html`)

**Files:**
- Create: `1A/geschiedenis/leerpad.html`

- [ ] **Step 1: Bouw `<head>`** — kopieer het volledige `<head>`/`<style>` van `index.html`; titel `Geschiedenis 1A — Leerpad (les per les)`. Voeg vóór `</style>` toe:

```css
  /* === LEERPAD === */
  .voortgangsbalk{max-width:820px;margin:2rem auto 0;padding:0 1.5rem;font-family:'Source Sans 3',sans-serif}
  .vb-track{height:12px;background:var(--sand);border-radius:6px;overflow:hidden}
  .vb-fill{height:100%;background:var(--gold);width:0;transition:width .3s}
  .vb-label{font-size:.85rem;color:var(--text-light);margin-top:.5rem;text-align:center}
  .les-kaart{display:flex;align-items:center;gap:1rem;background:#fff;border:1px solid var(--sand);
    border-radius:var(--border-radius);padding:.9rem 1.1rem;margin:.6rem 0;box-shadow:var(--shadow-sm);
    text-decoration:none;color:inherit;transition:box-shadow .15s,transform .1s}
  .les-kaart:hover{box-shadow:var(--shadow-md);transform:translateY(-1px)}
  .les-kaart .lk-num{flex:0 0 auto;width:2.4rem;height:2.4rem;border-radius:50%;background:var(--darkblue);
    color:var(--gold);font-family:'Playfair Display',serif;font-weight:700;display:flex;align-items:center;justify-content:center}
  .les-kaart .lk-body{flex:1}
  .les-kaart .lk-title{font-family:'Playfair Display',serif;font-weight:600;font-size:1.05rem}
  .les-kaart .lk-meta{font-size:.82rem;color:var(--text-light);margin-top:.15rem}
  .les-kaart .lk-check{flex:0 0 auto;width:1.6rem;height:1.6rem;border:2px solid var(--sand);border-radius:50%;
    display:flex;align-items:center;justify-content:center;color:#fff;font-size:.9rem}
  .les-kaart.done .lk-check{background:#2e7d32;border-color:#2e7d32}
  .concordantie-link{display:inline-block;margin:1.5rem 0;font-weight:600;color:var(--terracotta)}
```

- [ ] **Step 2: Bouw `<body>`** — header + hero, voortgangsbalk, link naar concordantie, en een `#leerpad-root` container die per **deel** door JS wordt gevuld. Render uit `window.LESSONS`:

```html
<body>
<header class="site-header">
  <a href="index.html" class="label">← Geschiedenis 1A</a>
  <span class="label label-right">Leerpad</span>
</header>
<section class="course-hero">
  <p class="kicker">Geschiedenis · 1A · Leerpad</p>
  <h1>Volg dit vak les per les</h1>
  <p class="subtitle">Elke les duurt ongeveer één uur. Werk ze in volgorde af of kies zelf.</p>
</section>
<div class="voortgangsbalk">
  <div class="vb-track"><div class="vb-fill" id="vb-fill"></div></div>
  <div class="vb-label" id="vb-label">0 / 0 lessen afgewerkt</div>
</div>
<main class="page-wrapper">
  <p style="text-align:center"><a class="concordantie-link" href="concordantie.html">📋 Bekijk welke eindtermen elke les dekt →</a></p>
  <div id="leerpad-root"></div>
</main>
<button id="back-to-top" aria-label="Terug naar boven" title="Terug naar boven">↑</button>
<script src="lessons.js"></script>
<script>
(function(){
  var KEY='gesch-leerpad-voltooid', L=window.LESSONS||[];
  function load(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}}
  function save(a){try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
  var root=document.getElementById('leerpad-root'), done=load();
  // groepeer per deel
  var delen=[];
  L.forEach(function(les){
    var d=delen.find(function(x){return x.deel===les.deel});
    if(!d){d={deel:les.deel,title:les.deelTitle,items:[]};delen.push(d);}
    d.items.push(les);
  });
  delen.forEach(function(d){
    var h=document.createElement('h2');
    h.style.cssText='font-family:"Playfair Display",serif;margin:2rem 0 .5rem;color:var(--darkblue)';
    h.textContent='Deel '+d.deel+' — '+d.title;
    root.appendChild(h);
    d.items.forEach(function(les){
      var a=document.createElement('a');
      a.href=les.file; a.className='les-kaart'; a.setAttribute('data-les',les.n);
      var chaps=Array.from(new Set(les.sources.map(function(s){return s.label.split(' · ')[0]}))).join(', ');
      a.innerHTML='<span class="lk-num">'+les.n+'</span>'+
        '<span class="lk-body"><span class="lk-title">'+les.title+'</span>'+
        '<span class="lk-meta">⏱ ±'+les.readMin+' min · '+chaps+' · 🎯 '+les.eindtermen.join(', ')+'</span></span>'+
        '<span class="lk-check">✓</span>';
      if(done.indexOf(les.n)!==-1) a.classList.add('done');
      root.appendChild(a);
    });
  });
  function refresh(){
    var d=load(); var pct=L.length?Math.round(d.length/L.length*100):0;
    document.getElementById('vb-fill').style.width=pct+'%';
    document.getElementById('vb-label').textContent=d.length+' / '+L.length+' lessen afgewerkt';
  }
  refresh();
  // herlees voortgang wanneer men terugkomt op de pagina
  window.addEventListener('pageshow',function(){
    var d=load();
    document.querySelectorAll('.les-kaart').forEach(function(el){
      el.classList.toggle('done', d.indexOf(parseInt(el.getAttribute('data-les'),10))!==-1);
    });
    refresh();
  });
})();
</script>
</body>
</html>
```

- [ ] **Step 3: Verifieer**

Run: `cd 1A/geschiedenis && echo "div $(grep -c '<div' leerpad.html)/$(grep -c '</div>' leerpad.html)" && grep -c 'src="lessons.js"' leerpad.html`
Expected: gelijke div-aantallen; `1`.

---

## Task 7: Concordantietabel (`concordantie.html`)

**Files:**
- Create: `1A/geschiedenis/concordantie.html`

- [ ] **Step 1: Bouw `<head>`** — kopieer `<head>`/`<style>` van `index.html`; titel `Geschiedenis 1A — Concordantietabel`. Voeg toe:

```css
  /* === CONCORDANTIE === */
  .matrix-wrap{overflow-x:auto;margin:2rem 0}
  table.matrix{border-collapse:collapse;font-family:'Source Sans 3',sans-serif;font-size:.85rem;min-width:640px}
  table.matrix th,table.matrix td{border:1px solid var(--sand);padding:.45rem .6rem;text-align:center}
  table.matrix th.lesnaam,table.matrix td.lesnaam{text-align:left;position:sticky;left:0;background:var(--creme);
    white-space:nowrap;max-width:280px;overflow:hidden;text-overflow:ellipsis}
  table.matrix thead th{background:var(--darkblue);color:var(--gold);position:sticky;top:0}
  table.matrix td.hit{background:rgba(212,160,23,.25);color:var(--terracotta);font-weight:700}
  .et-lijst{margin:2rem 0}
  .et-lijst .et-item{background:var(--sand-light);border-left:4px solid var(--oker);border-radius:var(--border-radius);
    padding:1rem 1.2rem;margin:.7rem 0}
  .et-lijst .et-item h3{font-family:'Source Sans 3';font-size:1rem;color:var(--terracotta)}
  .et-lijst .et-item .et-lessen{font-size:.85rem;color:var(--text-light);margin-top:.4rem}
```

- [ ] **Step 2: Bouw `<body>`** — uit `LESSONS` + `EINDTERMEN`:

```html
<body>
<header class="site-header">
  <a href="leerpad.html" class="label">← Leerpad</a>
  <span class="label label-right">Concordantietabel</span>
</header>
<section class="course-hero">
  <p class="kicker">Geschiedenis · 1A</p>
  <h1>Concordantietabel</h1>
  <p class="subtitle">Welke les dekt welke eindterm historisch bewustzijn (8.1–8.9)?</p>
</section>
<main class="page-wrapper">
  <div class="matrix-wrap"><table class="matrix" id="matrix"></table></div>
  <div class="et-lijst" id="et-lijst"></div>
  <p id="dekking" style="font-size:.9rem;color:var(--text-light)"></p>
</main>
<button id="back-to-top" aria-label="Terug naar boven" title="Terug naar boven">↑</button>
<script src="lessons.js"></script>
<script src="eindtermen.js"></script>
<script>
(function(){
  var L=window.LESSONS||[], ET=window.EINDTERMEN||{};
  var codes=Object.keys(ET).sort();
  // matrix
  var t=document.getElementById('matrix');
  var head='<thead><tr><th class="lesnaam">Les</th>'+codes.map(function(c){return '<th>'+c+'</th>'}).join('')+'</tr></thead>';
  var body='<tbody>'+L.map(function(les){
    return '<tr><td class="lesnaam">'+les.n+'. '+les.title+'</td>'+
      codes.map(function(c){return les.eindtermen.indexOf(c)!==-1?'<td class="hit">●</td>':'<td></td>'}).join('')+'</tr>';
  }).join('')+'</tbody>';
  t.innerHTML=head+body;
  // per eindterm
  var el=document.getElementById('et-lijst');
  el.innerHTML='<h2 style="font-family:\'Playfair Display\',serif;color:var(--darkblue)">Per eindterm</h2>'+
    codes.map(function(c){
      var lessen=L.filter(function(les){return les.eindtermen.indexOf(c)!==-1}).map(function(les){return 'Les '+les.n});
      return '<div class="et-item"><h3>'+c+'</h3><p>'+ET[c]+'</p>'+
        '<p class="et-lessen">Gedekt in: '+(lessen.length?lessen.join(', '):'⚠ geen enkele les')+'</p></div>';
    }).join('');
  // dekkingscheck
  var ongedekt=codes.filter(function(c){return !L.some(function(les){return les.eindtermen.indexOf(c)!==-1})});
  document.getElementById('dekking').textContent= ongedekt.length?
    ('⚠ Niet gedekt: '+ongedekt.join(', ')) : ('✓ Alle eindtermen 8.1–8.9 komen in minstens één les aan bod.');
})();
</script>
</body>
</html>
```

- [ ] **Step 3: Verifieer**

Run: `cd 1A/geschiedenis && grep -c 'src="lessons.js"\|src="eindtermen.js"' concordantie.html`
Expected: `2`.

---

## Task 8: CTA op `index.html`

**Files:**
- Modify: `1A/geschiedenis/index.html` (in de hero, na de `.hero-meta`-div)

- [ ] **Step 1: Voeg de CTA-knop toe**

Zoek in `index.html` de hero (`<section class="course-hero">`), direct na het sluiten van de `hero-meta`-`</div>`. Voeg toe:
```html
<a href="leerpad.html" style="display:inline-block;margin-top:1.8rem;font-family:'Source Sans 3',sans-serif;font-weight:700;font-size:1rem;color:var(--darkblue);background:var(--gold);text-decoration:none;padding:.8rem 1.8rem;border-radius:6px">▶ Volg dit vak les per les</a>
```

- [ ] **Step 2: Verifieer**

Run: `cd 1A/geschiedenis && grep -c 'leerpad.html' index.html`
Expected: `1`.

---

## Task 9: Genereer alle overige lespagina's (`les_02.html` … `les_NN.html`)

Herhaal het sjabloon uit Task 5 voor elke resterende les in `lessons.js`. Werk per **deel** in parallelle batches (zoals het eerdere gap-vul-werk), telkens één agent per deel.

**Per lespagina (strikt):**
- Identieke `<head>`/`<style>` als `les_01.html` (inclusief het `/* === LES === */`-blok). Enkel `<title>` verschilt.
- Hero `chapter-kicker` = `Leerpad · Les N · Deel D`; `les-meta` = tijd, `📖 H… · secties …`, `🎯 <codes>` (exact de `eindtermen` uit `lessons.js`).
- `doelen-blok`: voor elke code in `les.eindtermen` één `<li>` met de code + de **verbatim** tekst uit `eindtermen.js`.
- `Aan de slag`: één `.leesstap` per item in `les.sources`, met `href="<file>?les=N#<anchor>"` (N zonder voorloopnul in de query) en een oriënterende zin.
- `Verder (uitbreiding)`: enkel toevoegen waar zinvol (zie spec); anders weglaten.
- Voortgangsknop: `data-les="N"`.
- Scripts onderaan in deze volgorde: `lessons.js`, `eindtermen.js`, `lesnav.js`, daarna het inline voortgangsscript (identiek aan les_01).
- Toon: instap & afronding **kort en prikkelend** (geen extra lesblok); diepgang mag, maar beperkt.

- [ ] **Step 1: Genereer Deel 1-lessen (H1–H6)** — alle lessen met `deel===1`. Volg het sjabloon.
- [ ] **Step 2: Genereer Deel 2-lessen (H7–H9).**
- [ ] **Step 3: Genereer Deel 3-lessen (H10–H11).**
- [ ] **Step 4: Genereer Deel 4-lessen (H12–H14).**
- [ ] **Step 5: Genereer Deel 5-lessen (H15–H18).**
- [ ] **Step 6: Genereer Deel 6-les(sen) (H19).**

- [ ] **Step 7: Verifieer dat er exact één bestand per LESSONS-entry is (geen wezen)**

Run:
```bash
cd 1A/geschiedenis && node -e '
global.window={}; require("./lessons.js");
const fs=require("fs");
let miss=0,extra=0;
const want=new Set(window.LESSONS.map(l=>l.file));
for(const f of want) if(!fs.existsSync(f)){console.log("ONTBREEKT:",f);miss++;}
for(const f of fs.readdirSync(".")) if(/^les_\d+\.html$/.test(f)&&!want.has(f)){console.log("WEES:",f);extra++;}
console.log(miss+extra===0?"OK 1-op-1":"mismatch m="+miss+" e="+extra);
'
```
Expected: `OK 1-op-1`.

---

## Task 10: Volledige verificatie + smoketest

- [ ] **Step 1: Tag-balans over alle nieuwe pagina's**

Run:
```bash
cd 1A/geschiedenis
for f in leerpad.html concordantie.html les_*.html; do
  s=$(grep -c '<section' "$f"); sc=$(grep -c '</section>' "$f")
  d=$(grep -c '<div' "$f"); dc=$(grep -c '</div>' "$f")
  [ "$s" = "$sc" ] && [ "$d" = "$dc" ] && echo "OK  $f" || echo "FOUT $f sec $s/$sc div $d/$dc"
done | grep -c '^OK'
```
Expected: een getal gelijk aan het aantal nieuwe pagina's (geen `FOUT`-regels).

- [ ] **Step 2: Alle deeplink-ankers bestaan** — herhaal de check uit Task 2 Step 4. Expected: `OK alle ankers bestaan`.

- [ ] **Step 3: Eindterm-dekking** — herhaal Task 2 Step 5. Expected: geen ongedekte eindtermen.

- [ ] **Step 4: JS-syntaxcheck van alle scripts**

Run: `cd 1A/geschiedenis && for j in lessons.js eindtermen.js lesnav.js nav.js; do node --check "$j" && echo "OK $j"; done`
Expected: `OK` voor elk.

- [ ] **Step 5: Browser-smoketest** (handmatig of via de `verify`/`run` skill)

Open `1A/geschiedenis/leerpad.html`. Controleer:
- Lessen verschijnen gegroepeerd per deel; voortgangsbalk toont `0 / N`.
- Klik een les → lespagina opent met hero-meta, doelenblok, leesstappen.
- Klik een leesstap → het hoofdstuk opent op de juiste sectie met bovenaan het gele lintje "Onderdeel van Les N ▸ Terug naar de les"; klik het → terug op de lespagina.
- Klik "Ik heb deze les afgewerkt" → knop wordt groen; ga terug naar het leerpad → kaart en balk tonen de voortgang; herlaad → blijft bewaard.
- Open `concordantie.html` → matrix + per-eindterm-lijst + "✓ Alle eindtermen … aan bod".

- [ ] **Step 6 (optioneel, enkel op vraag): Commit**

```bash
cd /Users/lievendoclo/dev/school/book-dev
git add 1A/geschiedenis/lessons.js 1A/geschiedenis/eindtermen.js 1A/geschiedenis/lesnav.js \
        1A/geschiedenis/leerpad.html 1A/geschiedenis/concordantie.html 1A/geschiedenis/les_*.html \
        1A/geschiedenis/index.html 1A/geschiedenis/nav.js \
        1A/geschiedenis/docs/superpowers
git commit -m "feat(geschiedenis): leerpad les-per-les met concordantie eindtermen"
```

---

## Self-review (door de planner uitgevoerd)

- **Spec-dekking:** lessenspoor (T2,T5,T9) · rijke omkadering incl. instap/afronding/huiswerk-waar-zinvol (T5,T9) · deeplinks naar ongewijzigde hoofdstukken (T5,T9) · leerpad + voortgang (T6) · vinkjes ook op lespagina (T5) · concordantie aparte pagina + doelenblok per les (T5,T7) · eindtermen 8.1–8.9 (T1) · CTA index (T8) · terug-lintje via `?les=` (T4) · terugdraaibaar (alle bestanden additief, 2 edits). Geen openstaande spec-eisen.
- **Placeholders:** de enige inhoudelijke "…" zitten in het sjabloon (T5/T9), bewust — dat is de per-les te genereren prozalaag met expliciete regels; alle code/CSS/JS is volledig. Verbatim eindtermtekst heeft een echte fallback (geen TBD).
- **Consistentie:** `localStorage`-sleutel `gesch-leerpad-voltooid` identiek in T5 en T6; `data-les` is het lesnummer zonder voorloopnul; querystring `?les=N` (geen nul) ↔ bestandsnaam `les_0N.html` afgehandeld in `nav.js` (T4); `window.LESSONS`/`window.EINDTERMEN` veldnamen (`n,file,title,deel,deelTitle,readMin,sources[{file,anchor,label}],eindtermen[]`) consistent over T2/T3/T6/T7/T9.
