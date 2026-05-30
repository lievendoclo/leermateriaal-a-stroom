# Prompt: Nieuw vak toevoegen aan het leermateriaal

Gebruik deze prompt als startpunt voor een nieuw vak. Vervang alles tussen `[[ ]]` door de juiste gegevens.

---

## Startprompt (plak dit in een nieuw gesprek)

```
Ik wil een volledig digitaal leerboek maken voor het vak [[VAK]] voor [[JAAR]] (eerste/tweede jaar A-stroom, 12-13 of 13-14 jaar).

De vakfiche staat in [[PAD_NAAR_VAKFICHE.pdf]]. Converteer die eerst naar markdown.

## Projectcontext

Dit leerboek maakt deel uit van een bestaande website op:
  /Users/lievendoclo/dev/school/book-dev/

Structuur:
  index.html              ← root: kies jaar (1A / 2A)
  1A/index.html           ← vakken van 1A
  2A/index.html           ← vakken van 2A
  1A/geschiedenis/        ← voorbeeld van een volledig uitgewerkt vak

Het nieuwe vak komt in: [[JAAR]]/[[vaknaam_zonder_spaties]]/

## Designsysteem

Kopieer het volledige <style>-blok EXACT uit:
  1A/geschiedenis/hoofdstuk_01.html

Gebruik dezelfde kleurenpalet, typografie en componenten:
- Playfair Display (titels) + Source Sans 3 (tekst)
- --terracotta: #C1440E | --gold: #D4A017 | --oker: #C8923A
- --darkblue: #1A2B4A | --creme: #FAF6EF | --sand: #E8DCC8
- .begrip, .denkvraag, .illustratie, .prologue, .exercises-section, .summary-section

## Vaste hoofdstukstructuur

Elk hoofdstuk volgt deze opbouw:

1. OPENINGSVERHAAL (~200 woorden)
   Verhalende, historisch/wetenschappelijk correcte scène. Concrete details,
   zintuiglijke beschrijvingen. Eindigt met een vraag die naar de leerstof leidt.

2. INTRO-BRUG (1 alinea)
   Verbindt het verhaal met de leerstof.

3. SUBHOOFDSTUKKEN (elk 400-600 woorden)
   - Conversationele toon, spreekt de leerling direct aan
   - .begrip kader per kernterm
   - .illustratie placeholder met beschrijving voor illustrator
   - .denkvraag (prikkelend, niet formeel beoordeeld)

4. OEFENINGEN
   2-3 concrete taken gebaseerd op de leerdoelen van de vakfiche.

5. SAMENVATTING
   5-8 bulletpunten die alle leerdoelen afdekken.

## Schrijfstijl

Schrijf als een gepassioneerde vakleerkracht die lesgeeft aan 12-14-jarigen:
- Rijk en verhalend, niet droog
- Concrete analogieën en herkenbare vergelijkingen
- Maak verbindingen met het dagelijks leven van leerlingen
- Gebruik "jij" / "jullie" om de leerling direct aan te spreken
- Verzorgd maar toegankelijk Nederlands
- Doellengte per hoofdstuk: 2.500-3.500 woorden

## Lengterichtlijnen

- Openingsverhaal: ~200 woorden
- Per subhoofdstuk: 400-600 woorden
- Oefeningen: ~150 woorden
- Samenvatting: ~100 woorden

## Stappenplan

1. Converteer de vakfiche PDF naar markdown
2. Stel een inhoudstafel voor (hoofdstukken + subhoofdstukken)
3. Na goedkeuring: brainstorm de structuur van hoofdstuk 1 als template
4. Schrijf hoofdstuk 1 volledig uit als HTML
5. Maak de overige hoofdstukken in parallelle agents (max 5-7 tegelijk)
6. Maak de cursusindexpagina ([[JAAR]]/[[vak]]/index.html)
7. Maak nav.js aan (kopieer en pas aan van 1A/geschiedenis/nav.js)
8. Patch alle hoofdstukken met nav.js en de teruglink naar index.html
9. Voeg het vak toe als kaart in [[JAAR]]/index.html

## nav.js

Kopieer 1A/geschiedenis/nav.js en pas de CHAPTERS-array aan voor de
nieuwe hoofdstukken. Voeg daarna dit toe aan elk hoofdstuk voor </body>:

    <script src="nav.js"></script>

En vervang de linker header-span door een link:

    <a class="label" href="index.html">[[VAK]] [[JAAR]]</a>

## Vakoverzichtspagina toevoegen aan [[JAAR]]/index.html

Voeg een actieve kaart toe (zelfde stijl als de Geschiedenis-kaart in 1A/index.html):

    <a href="[[vak]]/index.html" class="subject-card">
      <div class="subject-card-body">
        <span class="subject-badge">Beschikbaar</span>
        <span class="subject-icon">[[EMOJI]]</span>
        <h2 class="subject-title">[[VAK]]</h2>
        <p class="subject-meta">[[N]] hoofdstukken · [[korte omschrijving]]</p>
        <span class="subject-cta">Start <span class="subject-cta-arrow">→</span></span>
      </div>
    </a>

Verwijder of houd de bijbehorende placeholder-kaart.
```

---

## Checklist na afronding

- [ ] Alle hoofdstukken aangemaakt als `.html`
- [ ] `index.html` voor het vak aangemaakt
- [ ] `nav.js` aangemaakt en correct geconfigureerd
- [ ] Alle hoofdstukken gepatcht (nav.js script tag + header link)
- [ ] Vak toegevoegd als actieve kaart in `[[JAAR]]/index.html`
- [ ] Placeholder-kaart voor dit vak verwijderd uit `[[JAAR]]/index.html`
- [ ] Geen verwijzingen naar "Schoolboeken" (gebruik "Leermateriaal")

---

## Veelgebruikte emoji's per vak

| Vak              | Emoji |
|------------------|-------|
| Aardrijkskunde   | 🌍    |
| Wiskunde         | 📐    |
| Nederlands       | 📖    |
| Frans            | 🗼    |
| Engels           | 🇬🇧   |
| Biologie         | 🔬    |
| Fysica           | ⚗️    |
| Chemie           | 🧪    |
| Muziek           | 🎵    |
| Tekenen          | 🎨    |
| LO               | 🏃    |
| Informatica      | 💻    |
