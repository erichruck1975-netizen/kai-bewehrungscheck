# Kai BewehrungsCheck

Mobile-first PWA für Bewehrungsabnahmen auf der Baustelle.

## Stabiler Zwischenstand

Tag: `v52-stable-before-v53`

Stabiler Chrome-Teststand vor v53-Erweiterungen.

## Aktueller Entwicklungsstand

v78 stabilisiert den direkten PDF-Download/Teilen mit stufenweiser Diagnose und Abschnitts-Fallbacks. Der PDF-Export startet nicht mehr über die HTML-Berichtsvorstufe. Nahe Pins werden wieder einzeln mit leichtem Versatz statt als Cluster ausgegeben; die v75-Bildkomprimierung bleibt erhalten.

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
- Cache-Version: `kai-bewehrungscheck-v92`

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



















### v79
- PDF teilen nutzt dieselbe zentrale PDF-Datei wie PDF herunterladen.
- Wenn direktes Teilen nicht unterstützt wird oder fehlschlägt, wird die PDF automatisch heruntergeladen.
- Technische Share-Diagnose wird in state.lastPdfShareDebug protokolliert.
- Druckdialog/A4-Bericht und Pin-Darstellung bleiben unverändert.

### v80
- Direkt-PDF wurde inhaltlich und optisch näher an den Druckdialog-Bericht angeglichen.
- Enthält strukturierte Projekt-/Prüfungsdaten, Wetter, Übersichtsfotos, Ergebnis, Planunterlagen, Auflagen/Mängel, Checkliste, Plananlagen, Fotodokumentation und Unterschriften.
- PDF teilen verwendet weiterhin dieselbe Direkt-PDF wie PDF herunterladen; Druckdialog, Planviewer und Pins bleiben unverändert.

### v81
- Direkt-PDF-Hotfix: feste deutsche Sonderzeichen/Umlaute im Direkt-PDF repariert.
- Auflagen/M?ngel im Direkt-PDF enthalten jetzt Pr?fpunkt, Pr?fstelle, Status, Pin/Plan und Bemerkung verst?ndlicher.
- Mobile PDF-Aktionsleiste im Ergebnis-/Berichtsbereich l?uft nicht mehr rechts aus dem Bildschirm.
- Druckdialog, Planviewer und Pin-Darstellung bleiben unver?ndert.

### v82
- Stammdatenfeld beim Prüfingenieur sichtbar von Büro auf Sachbearbeiter umbenannt.
- Interne Datenfelder und Backup/Restore bleiben unver?ndert.

### v92
- Direkt-PDF Layout saubergezogen: harter Textumbruch, robuste einspaltige Projekt-/Prüfungskarten, gekapselte Überschriften für Auflagen, Checkpunkte, Plananlagen, Fotodokumentation und Unterschriften.
- Druckdialog, Pins, Planviewer und PDF-Download/Teilen-Logik bleiben unverändert.

### v88
- Direkt-PDF Mini-Fix: Übersichtsfotos-Überschrift wird vor dem Abschnittsstart mit erster Fotozeile zusammengehalten; Plananlagen nutzen Breite/Höhe stärker aus.
- Druckdialog, Pins, Planviewer und übrige PDF-Logik bleiben unverändert.

### v87
- Direkt-PDF Feinschliff: Orphan-Überschriften weiter reduziert, Übersichtsfotos mit erstem Inhalt zusammengehalten, Plananlagen größer und offene Checkpunkte kompakter dargestellt.
- Druckdialog, Pins, Planviewer und PDF-Download/Teilen-Logik bleiben unverändert.

### v86
- Direkt-PDF Layout-Feinschliff: interne Bezeichnung entfernt, Orphan-Überschriften reduziert, Cards neutraler/ruhiger, Plananlagen größer und App-Version sichtbar im Header.
- Druckdialog, Pins und Planviewer bleiben unverändert.

### v85
- Direkt-PDF mit echten Karten/Boxen: Rechteck-Rendering im Direkt-PDF aktiviert und zentrale Card-Komponenten für Projekt, Wetter, Ergebnis, Planunterlagen, Auflagen, Checkpunkte, Fotodokumentation und Unterschriften gestärkt.
- Druckdialog, Planviewer und Pin-Funktionen bleiben unverändert.

### v84
- Direkt-PDF optisch näher am Druckdialog-Bericht: verbesserter Kopf, ruhigere Tabellen/Karten, Fotodokumentation und kompakter Unterschriftenbereich.
- Gezeichnete Signaturen werden im Direkt-PDF aus gespeicherten Signaturdaten eingebettet; Druckdialog und Plan-/Pin-Funktionen bleiben unverändert.

### v83
- Direkt-PDF-Bildeinbettung robuster gemacht: Übersichtsfotos, Fotodokumentationsfotos und gezeichnete Signaturen werden gr??er/sichtbarer eingef?gt.
- `state.lastPdfImageDebug` protokolliert gefundene/eingebettete Übersichtsfotos, Fotodokumentationsfotos und Signaturen.
- Druckdialog, Pins, Planviewer und Checklogik bleiben unver?ndert.


