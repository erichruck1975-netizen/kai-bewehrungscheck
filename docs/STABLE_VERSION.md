# Stabiler Stand und aktueller BauSuite-MVP

## Freigegebener Stable-Tag

Aktueller stabiler Baustellenstand: `v95-stable-a4-pdf-share`

Dieser Stand bleibt die Referenz fuer den offiziellen A4-Berichtspfad des BewehrungsChecks.

## Aktueller Entwicklungsstand

Aktueller BauSuite-MVP-Stand: `v100`

v100 fuehrt die BauSuite-Startseite und das erste Modul `Baustellenkontrolle` als MVP ein. Der bestehende BewehrungsCheck bleibt als Modul `Bewehrungsabnahme` erhalten.

## Funktioniert im Stable-Stand

- A4-Bericht ist offizieller PDF-Weg
- PDF speichern oeffnet A4-Bericht / Druckdialog
- gespeicherte PDF kann ausgewaehlt und geteilt werden
- Berichtstext teilen funktioniert
- Spracheingabe-Fix aus v91 enthalten
- Pins / Planviewer stabil
- Backup/Restore vorhanden

## Wichtige Regel

Der alte Direkt-PDF-Renderer ist nicht mehr Hauptweg und darf nicht ohne ausdrueckliche Freigabe reaktiviert werden.

Vor groesseren Umbauten:

- Backup exportieren
- Stable-Stand `v95-stable-a4-pdf-share` pruefen
- keine Aenderungen am A4-Berichtspfad ohne Freigabe

## v100-Ergaenzung

- Kai BauSuite Startseite
- Modul Bewehrungsabnahme als bestehender BewehrungsCheck
- Modul Baustellenkontrolle fuer allgemeine Begehungen, Feststellungen, Aufgaben, Fotos und offenen Punkte
- Baustellenkontrolle nutzt den bestehenden Projekt-, Foto-, Backup- und A4-Druckdialog-Unterbau
