# Ontwerp — "Les per les"-leerpad voor Geschiedenis 1A

**Datum:** 2026-06-05
**Status:** Ontwerp ter review
**Vak:** Geschiedenis, 1ste graad A-stroom (`1A/geschiedenis/`)

## 1. Doel & context

Naast het bestaande thematische boek (19 hoofdstukken, gegroepeerd in 6 delen, met
`index.html` als inhoudstafel en `nav.js` voor vorige/volgende-navigatie) komt er een
tweede, optioneel **lessenspoor**: een leerling kan het vak ook "les per les" doorlopen,
waarbij elke les ongeveer **één lesuur (~60 min)** in beslag neemt voor een gemiddelde
leerling.

Een hoofdstuk is qua omvang niet gelijk aan één lesuur. Daarom snijdt een les dwars door
de bestaande secties: een les bundelt een samenhangend blok van ~3-4 secties (±1u). Een
lang hoofdstuk wordt over meerdere lessen verdeeld; korte hoofdstukken kunnen worden
samengevoegd. **De 19 hoofdstukbestanden blijven inhoudelijk ongewijzigd** — een les
*verwijst* met deeplinks naar de te lezen secties.

### Kernbeslissingen (door gebruiker bevestigd)

- **Aanpak A — apart lessenspoor naast het boek** (niet: markeringen in de hoofdstukken,
  niet: inhoud kopiëren naar lespagina's).
- **Rijke omkadering per les**: lesdoel, instap, kern (met deeplinks), oefeningen,
  afronding, en huiswerk/uitbreiding *enkel waar zinvol*.
- **Scope**: het volledige vak — alle 19 hoofdstukken (~30-34 lessen).
- **Onderwijsdoelen**: verwijzing naar de **officiële eindtermen** (niet de
  leerplandoelen), via een concordantietabel.
- **Concordantie**: een doelenblok op elke lespagina **én** een aparte
  `concordantie.html` met de volledige matrix.
- **Voortgang**: vinkjes zowel op het leerpad-overzicht als op elke lespagina
  (`localStorage`).

## 2. Onderwijsdoelen — bron

De doelenset zijn de **eindtermen historisch bewustzijn** (sleutelcompetentie 8),
1ste graad **A-stroom**, gecodeerd **8.1 t/m 8.9**:

| Code | Kern (samenvattend) |
|---|---|
| 8.1 | Historisch referentiekader: structuurbegrippen, zeven periodes, kenmerken & scharnierpunten, maatschappelijke domeinen |
| 8.2 | Kenmerken van de bestudeerde samenlevingen |
| 8.3 | Principes van periodisering; geschiedenis als constructie achteraf |
| 8.4 | Bronnen beoordelen: bruikbaarheid, betrouwbaarheid, representativiteit |
| 8.5 | Informatie onderscheiden / kritische bronnenconfrontatie |
| 8.6 | Historische redeneerwijzen (oorzaak-gevolg, (on)gelijktijdigheid); beeldvorming aanvullen |
| 8.7 | Argumenteren met bewijs; meerdere perspectieven innemen |
| 8.8 | Standplaatsgebondenheid en de invloed ervan op beeldvorming |
| 8.9 | Onderscheid verleden ↔ geschiedenis; mythevorming |

> **Build-stap (open):** de **verbatim** omschrijving van 8.1–8.9 wordt tijdens de bouw
> exact opgehaald uit het officiële besluit / het leerplan I-Ges-a en in `eindtermen.js`
> opgenomen. De codering (8.1–8.9) staat vast; enkel de letterlijke tekst moet nog.

## 3. Architectuur & bestanden

Alles additief, in `1A/geschiedenis/`. Terugdraaibaar door de nieuwe bestanden te
verwijderen en twee edits terug te draaien.

| Bestand | Type | Rol |
|---|---|---|
| `lessons.js` | nieuw | **Enige bron van waarheid** voor het lessenplan: `window.LESSONS = [...]` |
| `eindtermen.js` | nieuw | `window.EINDTERMEN = {'8.1': '...', ...}` (verbatim teksten) |
| `leerpad.html` | nieuw | Hub: rendert leskaarten per deel uit `LESSONS`, met voortgangsvinkjes + balk |
| `concordantie.html` | nieuw | Volledige matrix les ↔ eindterm (beide richtingen), uit `LESSONS`+`EINDTERMEN` |
| `les_01.html` … `les_NN.html` | nieuw | ~30-34 rijke lespagina's uit één vast sjabloon |
| `lesnav.js` | nieuw | Injecteert vorige/volgende les + "terug naar leerpad" op lespagina's |
| `index.html` | **edit** | Eén CTA-knop in de hero → `leerpad.html` |
| `nav.js` | **edit** | Detecteert `?les=NN` op een hoofdstukpagina → toont "terug naar de les"-lintje |

### Datamodel (`lessons.js`)

```js
window.LESSONS = [
  {
    n: 1,                          // lesnummer (uniek, oplopend)
    file: 'les_01.html',
    title: 'Tijd ordenen: periodes en structuurbegrippen',
    deel: 1,                       // 1..6, overeenkomend met index.html
    deelTitle: 'De gereedschapskist van de historicus',
    readMin: 60,                   // richttijd
    sources: [                     // welke secties lezen, in volgorde
      { file: 'hoofdstuk_01.html', anchor: 's1-1', label: 'H1 · 1.1 Wat is tijd?' },
      { file: 'hoofdstuk_01.html', anchor: 's1-3', label: 'H1 · 1.3 ...' }
    ],
    eindtermen: ['8.1', '8.3']     // codes die deze les aanspreekt
  },
  // ...
];
```

`leerpad.html`, `concordantie.html` en `lesnav.js` worden allemaal uit deze ene array
afgeleid, zodat lesnummering, navigatie en concordantie nooit uit elkaar lopen.

## 4. Opbouw van één lespagina

Hergebruikt het bestaande design system (identiek inline `<style>`-blok als een
hoofdstuk, gekopieerd uit het sjabloon, plus een klein lesspecifiek CSS-aanvullingsblok).
Dezelfde componentklassen (`section-block`, `denkvraag`, `begrip`, …). Werkt ook zonder
JavaScript (alleen voortgang en lesnav vereisen JS). Vaste volgorde:

1. **`site-header`** — zoals op de hoofdstukken (label linkt terug).
2. **Hero** — kicker `Leerpad · Les 12 · Deel 4`, titel, metabalk
   `⏱ ±60 min · 📖 H16 §16.1–16.4 · 🎯 8.1, 8.2`.
3. **Lesdoel** — "Wat leer je deze les?" (2-4 bullets).
4. **Onderwijsdoelen** — compact blok met de eindtermcode(s) + verbatim tekst (uit
   `eindtermen.js`); linkt door naar `concordantie.html`.
5. **Instap** — korte, prikkelende aanloop (vraag/anekdote) + een `denkvraag` om
   voorkennis te activeren. *(nieuw geschreven)*
6. **Aan de slag (kern)** — stapsgewijze leesopdracht met **deeplink-knoppen** naar de
   exacte secties (`hoofdstuk_16.html?les=12#s16-1`), met per sectie één oriënterende
   zin. *(verwijst, dupliceert niet)*
7. **Oefenen** — verwijzing naar de relevante oefeningen onderaan het hoofdstuk.
8. **Afronding** — 2-3 terugblik-/zelfcheckvragen + één synthesezin. *(nieuw geschreven)*
9. **Verder (huiswerk/uitbreiding)** — *enkel waar zinvol*: een uitbreidingstaak, bron,
   mini-onderzoekje, of link naar `personen/`. *(nieuw geschreven)*
10. **Voortgang** — "✓ Ik heb deze les afgewerkt"-knop (schrijft naar `localStorage`).
11. **Lesnavigatie** (geïnjecteerd door `lesnav.js`) + terug-naar-boven-knop.

## 5. Leerpad-overzicht (`leerpad.html`)

- Hero zoals `index.html`, met meta (`~32 lessen`, `~32 uur`, `6 delen`).
- Lessen gegroepeerd per **deel** (zelfde 6 delen als de inhoudstafel), elke les een kaart
  met: lesnummer, titel, `⏱ ±60 min`, bronhoofdstuk(ken), en een **voortgangsvinkje**.
- Bovenaan een **voortgangsbalk** "X / N lessen afgewerkt".
- Link naar `concordantie.html` ("Bekijk welke eindtermen elke les dekt").
- Voortgang via `localStorage`-sleutel `gesch-leerpad-voltooid` (array van lesnummers),
  gedeeld met de knop op de lespagina's. Bij ontbrekende `localStorage` verdwijnt enkel
  het vinken; de rest werkt.

## 6. Concordantietabel (`concordantie.html`)

- **Matrix**: rijen = lessen (1..N), kolommen = eindtermen 8.1–8.9; een merkteken waar een
  les een eindterm aanspreekt. Sticky kolomkop + eerste kolom voor leesbaarheid.
- **Omgekeerd overzicht**: per eindterm (8.1–8.9) de verbatim tekst + lijst van lessen die
  ze dekken.
- Volledig afgeleid uit `LESSONS` + `EINDTERMEN` (geen aparte databron).
- **Dekkingscheck** onderaan: signaleert eindtermen die door géén enkele les gedekt
  worden (mag normaal niet voorkomen — dient als bouw-/onderhoudswaarborg).

## 7. Integratie met bestaande bestanden (2 edits)

- **`index.html`**: één niet-opdringerige CTA-knop onder de hero-subtitle:
  `▶ Volg dit vak les per les` → `leerpad.html`.
- **`nav.js`**: bij het laden van een hoofdstukpagina de `?les=NN`-parameter uitlezen;
  indien aanwezig, bovenaan een slank lintje injecteren: `📘 Onderdeel van Les NN ▸ terug
  naar de les` → `les_<NN>.html`. Zonder de parameter verandert er niets. Het anker
  (`#s16-1`) zorgt dat de pagina meteen naar de juiste sectie scrolt.

## 8. Het lessenplan (chunking)

Het lessenplan is de ruggengraat en wordt als **eerste artefact** opgeleverd en door de
gebruiker nagekeken vóór er pagina's gegenereerd worden.

**Vuistregel ±60 min** voor een gemiddelde 1ste-graadsleerling: lezen van ~3-4 secties +
de bijhorende oefeningen + instap/afronding (~10 min overhead). Dichte of zware secties
(tijdlijnen, bronanalyse) tellen voor meer; lichte secties voor minder.

**Regels:**
- Een les blijft binnen één **deel**, en liefst binnen één hoofdstuk.
- Lange hoofdstukken (bv. H16 met 7 secties) → 2-3 lessen.
- Korte/verwante hoofdstukken (bv. H7 "Van mensaap tot Homo sapiens" + H8 "Jagers en
  voedselverzamelaars") → eventueel samen één les.
- Elke les krijgt 1-3 eindtermcodes (8.1–8.9) toegewezen op basis van de secties die ze
  behandelt.

**Ankers**: secties hebben stabiele id's `s<hoofdstuk>-<n>` (bv. `#s16-3`), zowel op
`section-block` als `section-alt`. Deeplinks gebruiken die bestaande id's; er worden geen
id's toegevoegd aan de hoofdstukken.

Geschatte omvang: ~30-34 lessen.

## 9. Bouw- & verificatievolgorde

1. **Eindtermen verbatim ophalen** → `eindtermen.js`.
2. **Lessenplan opstellen** (alle 19 hoofdstukken uitlezen: secties + ankers) → tabel →
   **gebruiker-checkpoint**.
3. **Infrastructuur**: lespagina-sjabloon, `lessons.js`, `lesnav.js`, `leerpad.html`,
   `concordantie.html`, edits aan `index.html` + `nav.js`.
4. **Lespagina's genereren** in parallelle batches (per deel), strikt volgens sjabloon.
5. **Verificatie**:
   - Gebalanceerde HTML-tags per bestand.
   - Elke `sources`-deeplink verwijst naar een bestaand bestand + bestaand anker.
   - `LESSONS`-bestandsnamen ↔ bestaande `les_*.html` (geen wezen, geen ontbrekende).
   - Elke `eindtermen`-code bestaat in `EINDTERMEN`; elke eindterm 8.1–8.9 komt in ≥1 les.
   - Browser-smoketest: leerpad → een les → deeplink → lintje terug → volgende les →
     vinkje persistent na refresh.

## 10. Foutafhandeling & randgevallen

- `lesnav.js` / `nav.js`: bij onbekende bestandsnaam of ontbrekende `?les=` gewoon niets
  injecteren (geen fout).
- `localStorage` niet beschikbaar (privémodus): voortgang stil uitschakelen.
- Deeplink-anker onverhoopt afwezig: de pagina opent bovenaan het hoofdstuk (graceful).

## 11. Niet in scope (YAGNI)

- Geen kalender/jaarplanning of datumgebonden roostering — enkel een sequentieel
  lessenspoor met richttijd.
- Geen serverkant / accounts — voortgang is lokaal per browser.
- Geen wijziging aan de andere vakken; dit is een experiment, enkel voor geschiedenis.
- Geen automatische generator-tooling; pagina's zijn statische HTML zoals de rest van het
  boek.
