# Kai BewehrungsCheck

Mobile-first PWA für Bewehrungsabnahmen auf der Baustelle.

## Stabiler Zwischenstand

**Stable-Tag:** `v95-stable-a4-pdf-share`  
**Release:** v95 stable – A4 PDF Workflow

Dieser Stand ist der stabile Baustellenstand mit offiziellem A4-Berichtspfad.

### Funktioniert

- A4-Bericht ist offizieller PDF-Weg
- PDF speichern öffnet A4-Bericht / Druckdialog
- gespeicherte PDF kann ausgewählt und geteilt werden
- Berichtstext teilen funktioniert
- Spracheingabe-Fix aus v91 enthalten
- Pins / Planviewer stabil
- Backup/Restore vorhanden

### Wichtige Regel

Der alte Direkt-PDF-Renderer ist nicht mehr Hauptweg und darf nicht ohne ausdrückliche Freigabe reaktiviert werden.

### Vor größeren Umbauten

- Backup exportieren
- Release v95 stable prüfen
- keine Änderungen am A4-Berichtspfad ohne Freigabe

### Nächste empfohlene Richtung

PDF-Server-MVP, der denselben A4-Bericht serverseitig als echte PDF rendert.

## Aktueller Entwicklungsstand

v95 ist der aktuelle stabile Baustellenstand.

Der offizielle PDF-Weg ist:
PDF speichern → A4-Bericht → Druckdialog → Als PDF speichern

Die gespeicherte PDF kann anschließend über „Gespeicherte PDF teilen“ ausgewählt und weitergegeben werden.

Der alte Direkt-PDF-Renderer ist nicht mehr Hauptweg und soll nicht ohne ausdrückliche Freigabe reaktiviert werden.

## Production-PWA

Die App ist eine statische PWA. Für die Auslieferung genügt der Inhalt des Ordners `dist`.

Hosting ist auf normalem HTTPS-Webspace möglich, zum Beispiel:

- Netlify
- Vercel
- GitHub Pages
- eigener Webspace oder Subdomain

Wichtig: Für PWA-Installation und Service Worker muss die App über HTTPS ausgeliefert werden. `localhost` ist nur für Entwicklung und Tests gedacht.

## Build

Der Build kopiert die statischen App-Dateien in `dist`:

```powershell
.\build.ps1
```

Danach den Inhalt von `dist` auf den Webspace hochladen.

## Handy-Nutzung

1. URL der gehosteten App auf dem Handy öffnen.
2. App einmal vollständig laden.
3. Im Browser-Menü `Zum Startbildschirm hinzufügen` oder `App installieren` wählen.
4. Danach die App direkt über das Startbildschirm-Symbol öffnen.
5. Nach dem ersten vollständigen Laden kann die App auch ohne Internet starten.

PDF-Pläne, Fotos, Projekte, Abnahmen und Stammdaten werden lokal auf dem Gerät in IndexedDB gespeichert.

Wenn die App auf einem anderen Handy geöffnet wird, sind die lokalen Daten dort nicht automatisch vorhanden. Für Sicherung oder Gerätewechsel `Komplettes Backup exportieren` und `Backup importieren` verwenden.

## Browser-Empfehlung für Baustellen

Empfohlen für die Baustellennutzung ist Android Chrome.

Android Firefox kann bei komplexen CAD-/Bewehrungsplänen in PDF-Dateien Darstellungsfehler verursachen. Vor einer Bewehrungsabnahme muss die Plananzeige im verwendeten Browser visuell geprüft werden.

## Offline-Nutzung

Der Service Worker cached:

- `index.html`
- `app.js`
- `styles.css`
- `manifest.webmanifest`
- Icon
- pdf.js und pdf.js Worker als Runtime-Assets, soweit der Browser das Caching zulässt

Beim ersten Laden braucht das Gerät Internetzugriff für App-Dateien und externe Bibliotheken. Danach startet die PWA offline aus dem Cache.

## PWA-Konfiguration

- App-Name: `Kai BewehrungsCheck`
- Start-URL: `./index.html`
- Display: `standalone`
- Theme-Color: `#f4c542`
- Service Worker: `sw.js`
- Cache-Version: `kai-bewehrungscheck-v95`

## Daten und Sicherung

Große Dateien werden in IndexedDB gespeichert:

- Pläne/PDFs
- Fotos zu Pins und Prüfstellen
- Übersichtsfotos der Baustelle

- Datenbank: `kai-bewehrungscheck-db`
- Stores: `projects`, `protocols`, `masterData`, `plans`, `photos`, `settings`
- Pläne und Fotos liegen als Blob in `plans` und `photos`
- Abnahmen enthalten Metadaten, Pins, Checkpunkte und Foto-/Plan-IDs

In den Einstellungen stehen bereit:

- `Komplettes Backup exportieren`
- `Backup importieren`
- `Projektpaket exportieren`
- `Projektpaket importieren`
- `Speicher prüfen`
- `Lokale Testdaten löschen`

Das komplette Backup ist eine JSON-Datei mit allen Projekten, Abnahmen/Protokollen, Stammdaten, Einstellungen sowie Plan- und Foto-Dateien als DataURLs. Es ist der empfohlene Weg für Sicherung und Gerätewechsel.

Das Projektpaket ist eine JSON-Datei mit ausgewählten Projekt-/Abnahmedaten sowie zugehörigen Plan- und Foto-Dateien als DataURLs.

## PDF.js

PDFs werden mit pdf.js `3.11.174` gerendert:

```text
vendor/pdfjs/pdf.min.js
vendor/pdfjs/pdf.worker.min.js
```

Die Dateien liegen lokal im Ordner vendor/pdfjs und werden vom Service Worker gecached.

Wenn PDF-Rendering fehlschlägt, zeigt die App:

```text
PDF konnte nicht gerendert werden. Bitte Planseite als JPG/PNG hochladen.
```

## PDF speichern / drucken

Empfohlener PDF-Export:

1. `PDF-Vorschau` öffnen.
2. Druckdialog öffnen.
3. Ziel `Als PDF speichern` wählen.

Der Browserdruck ist der offizielle PDF-Weg, weil er das A4-Layout der Vorschau zuverlässig abbildet.

## Fotoanalyse / Stäbe zählen

Die spätere Funktion `Stäbe zählen (Beta)` ist als UI und Datenstruktur vorbereitet.

Aktueller Stand:

- Foto kann einer vorbereiteten Zählhilfe zugeordnet werden.
- Richtung kann gewählt werden: automatisch, horizontal, vertikal, beide Richtungen.
- KI-Vorschlag und manuell bestätigte Anzahl können gespeichert werden.
- Ergebnis erscheint in der Fotodokumentation des PDF-Protokolls.
- Die Ausgabe ist ausdrücklich als Assistenzfunktion formuliert.

Die automatische Erkennung selbst ist noch nicht implementiert. Spätere Optionen:

- OpenCV.js für einfache Linien-/Kantenerkennung
- serverseitige KI-Bildanalyse
- lokales Modell zur Objekterkennung

Die Funktion ersetzt keine fachliche Prüfung und erzeugt keine automatische Freigabe.

## Entwicklungs-Test

Für lokale Entwicklung kann die App optional über einen einfachen statischen Server getestet werden:

```powershell
python -m http.server 4173
```

Dann lokal öffnen:

```text
http://localhost:4173/index.html
```

Dieser lokale Server ist nur für Entwicklung gedacht. Für die Baustelle soll die App als gehostete HTTPS-PWA auf dem Handy installiert werden.





















