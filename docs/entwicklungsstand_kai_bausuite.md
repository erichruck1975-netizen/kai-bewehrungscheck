# Kai BauSuite - Entwicklungsstand

Stand: 2026-06-22

Version: **MVP 7b - Browser-Audioaufnahme**

## Status

MVP 1.1 bleibt stabil. MVP 2 ergänzt ausschließlich die projektbezogene Planverwaltung sowie die dafür notwendige zentrale Pfadkonfiguration und robuste JSON-Speicherung.

## Start der App

Ohne sichtbares Konsolenfenster:

```text
D:\Kai_BauSuite\baustelle\Start-KaiBauSuite-ohne-Konsole.vbs
```

Debug-Start:

```text
D:\Kai_BauSuite\baustelle\Start-KaiBauSuite.cmd
```

## Funktionierende Module

- Projekte
- Aktivitäten
- Beobachtungen
- Stammdaten Gewerke
- Stammdaten Firmen
- Stammdaten Verantwortliche
- Planverwaltung

## Planverwaltung

Über den Button `Pläne` wird die Planliste des ausgewählten Projekts geöffnet. Unterstützt werden PDF, PNG, JPG und JPEG.

Funktionen:

- Datei auswählen und in den Projektordner kopieren
- Planname, Geschoss/Bereich und Notiz erfassen
- Plan bearbeiten
- Plan aktivieren/deaktivieren
- Plan mit dem Windows-Standardprogramm öffnen
- Planliste nach App-Neustart erneut laden

Speicherstruktur:

```text
<data_root>\projekte\<projekt-id>\plaene\plans.json
<data_root>\projekte\<projekt-id>\plaene\<plan-id>.<dateityp>
```

Gespeichert wird nur ein relativer Pfad wie:

```text
plaene/PLN-....pdf
```

## MVP 2.1 - Komfortabler Planimport

Ergänzt wurden:

- globale Geschoss- und Planbereiche mit stabilen IDs
- 15 automatisch angelegte Standardbereiche
- projektspezifische, wiederverwendbare Bereiche
- Bereichs-Dropdown im Einzelimport
- editierbarer Mehrfachimport über \`Mehrere hinzufügen\`
- Vorschläge für Planname und Bereich aus dem Dateinamen
- transaktional gebündelte Dateikopie und Metadatenspeicherung
- optionale \`geschoss_bereich_id\` bei neuen oder bearbeiteten Plänen

Datenablage:

\`\`\`text
D:\Kai_BauSuite\daten\stammdaten\geschosse_bereiche.json
D:\Kai_BauSuite\daten\projekte\<projekt-id>\plaene\bereiche.json
D:\Kai_BauSuite\daten\projekte\<projekt-id>\plaene\plans.json
\`\`\`

Neue technische Module:

\`\`\`text
D:\Kai_BauSuite\baustelle\lib\KaiBauSuite.PlanCore.ps1
D:\Kai_BauSuite\baustelle\ui\PlanDialogV21.ps1
\`\`\`

Kompatibilitätstest am 20.06.2026: 15 globale Bereiche geladen; Dateinamenerkennung für Lageplan, EG, 2. OG, Schnitt, Ansicht, Detail und Dach geprüft; der bestehende Plan \`3 RH_II Arbeitspläne Arbeitsplan EG\` und seine PDF blieben vorhanden; sein relativer Pfad blieb unverändert.

## MVP 2.2 - Planversionierung und Archiv

Umgesetzt:

- stabile \`plan_group_id\` je logischem Plan
- fortlaufende \`version_nr\`
- Kennzeichnung des aktuellen Stands mit \`is_current\`
- Archivzeitpunkt und Verweis auf die ersetzende Version
- automatische Migration bestehender Pläne beim Laden
- versionierter Einzel- und Mehrfachimport
- Hauptliste zeigt nur aktive aktuelle Versionen
- Historienfenster öffnet aktuelle und ältere Dateien
- keine Plandatei wird bei der Versionierung gelöscht

Produktive Migration am 20.06.2026:

- 21 vorhandene Pläne und 21 Plandateien erhalten
- 20 Plan-Gruppen erzeugt
- zwei gleiche EG-Arbeitspläne als V1 und V2 gruppiert
- V2 als aktueller Stand markiert
- unveränderter Vorzustand in \`plans.json.bak\`
- Projekt, 1 Aktivität und 2 Beobachtungen unverändert

Ergänzte Dateien:

\`\`\`text
D:\Kai_BauSuite\baustelle\lib\KaiBauSuite.PlanCoreV22.ps1
D:\Kai_BauSuite\baustelle\ui\PlanDialogV22.ps1
\`\`\`

Getestet wurden Migration, Wiederladen, Gruppenerkennung, zwei passende Dateien innerhalb eines Mehrfachimports, genau eine aktuelle Version, Historienabfrage, Dateierhalt und Bereinigung des isolierten Testprojekts.

## Konfiguration

```text
D:\Kai_BauSuite\config\settings.json
```

```json
{
  "data_root": "D:\\Kai_BauSuite\\daten",
  "files_root": "D:\\Kai_BauSuite\\dateien"
}
```

Alle Datenzugriffe verwenden zentral `data_root`. Dieser Pfad kann später auf einen Dropbox-Ordner zeigen. Es wurden keine festen Datenpfade in den UI-Dateien verteilt.

## Speichersicherheit

`Write-KaiJson` schreibt zuerst eine temporäre Datei, ersetzt danach die Zieldatei und sichert den vorherigen Stand als `.bak`. JSON bleibt das MVP-Format; SQLite in synchronisierten Ordnern wird nicht verwendet.

## Technische Dateien

Geändert:

```text
D:\Kai_BauSuite\baustelle\KaiBauSuite.ps1
D:\Kai_BauSuite\baustelle\lib\KaiBauSuite.Core.ps1
```

Neu:

```text
D:\Kai_BauSuite\baustelle\ui\PlanDialog.ps1
D:\Kai_BauSuite\config\settings.json
```

Projektbezogen neu:

```text
D:\Kai_BauSuite\daten\projekte\PRJ-20260619182118-195920\plaene\plans.json
D:\Kai_BauSuite\daten\projekte\PRJ-20260619182118-195920\plaene\plans.json.bak
```

## Tests

Erfolgreich geprüft:

- konsolenloser VBS-Start
- Planimport und Dateikopie
- relatives Plan-Datenmodell
- Laden in neuem Prozess
- Anzeige in der Planliste
- Bearbeiten
- Deaktivieren und Reaktivieren
- Öffnen mit Windows Fotos als Standardprogramm
- temporäre JSON-Datei wird entfernt
- `.bak`-Sicherung wird erzeugt
- bestehendes Projekt bleibt erhalten
- 1 Aktivität und 2 Beobachtungen bleiben erhalten
- 14 Gewerke, 1 Firma und 1 Verantwortlicher bleiben erhalten

Der temporäre Testplan und seine Testdateien wurden nach dem Test entfernt. Die produktive Planliste ist leer und einsatzbereit.

## PC-/Mobile-Rollen

Windows ist aktuell die Büro-/Admin-Oberfläche. Projekte und Stammdaten werden dort gepflegt. Mobile Clients sollen Stammdaten nur als Auswahl verwenden und eine vereinfachte Baustellenoberfläche erhalten.

## Nächster Schritt

**MVP 3: Mobile Handling-Prototyp**

Geplant ist eine einfache mobile Web-/PWA-Testoberfläche über einen kleinen lokalen Server im gleichen WLAN. Sie testet früh Projekt- und Aktivitätsauswahl, Beobachtungen, Stammdaten-Dropdowns, Status und Priorität auf iOS und Android.

Noch nicht Teil von MVP 3 sind vollständige Adminfunktionen, Cloud-Synchronisation, Benutzerrechte, PDF-Berichte und perfekte Optik.

## Langfristige Zielarchitektur

- gemeinsames Online-Backend für Windows, iOS, Android und PWA
- Supabase oder vergleichbar als favorisierte Richtung
- PostgreSQL, Auth, Storage und API
- EU-Region, möglichst Frankfurt
- spätere zentrale Benutzer- und Rechteverwaltung
- Dropbox optional für Backup, Export oder ergänzende Dateiablage
- Dropbox nicht als einzige Live-Datenbank

Der aktuelle Windows-MVP bleibt lokal. Es wurde keine Mobile-App, Dropbox-API, Cloud-Synchronisation oder Supabase-Anbindung implementiert.

## Bekannte Einschränkungen von MVP 2

- kein integrierter PDF-/Bildviewer
- kein Zoom oder Verschieben
- keine Pins
- keine Fotos
- keine Berichte
- keine KI-Funktionen
- keine Benutzerrechte
- keine Cloud-Synchronisation
## Reparaturhinweis MVP 2.2 - Planliste und UTF-8

Am 20.06.2026 wurden zwei Datenprobleme in der Planverwaltung untersucht und behoben:

- Die Plan-Gruppe des Arbeitsplans EG war korrekt. V1 und V2 hatten dieselbe \`plan_group_id\`, Positionsplan EG, Exposé EG und Bewehrung Decke EG waren bereits getrennte Gruppen. Die aktuelle Version V2 war jedoch \`aktiv=false\` und wurde deshalb korrekt von der Hauptliste ausgeblendet. V2 wurde auf \`aktiv=true\` und \`is_current=true\` gesetzt; V1 bleibt mit \`is_current=false\` in der Historie.
- Während der manuellen MVP-2.2-Migration war eine UTF-8-JSON ohne BOM einmal mit dem Windows-PowerShell-Standardencoding statt mit der Core-Funktion gelesen worden. Dadurch entstanden Werte wie \`PlÃ¤ne\`, \`ExposÃ©\` und \`WÃ¤nde\`. 32 eindeutig betroffene Textfelder in \`planname\`, \`dateiname_original\` und \`notiz\` wurden in den Metadaten repariert.

Vor der Änderung wurde \`plans.json.backup-v22-reparatur-20260620.json\` angelegt. Keine PDF wurde gelöscht oder umbenannt. Nach der Reparatur sind 21 JSON-Einträge und 21 referenzierte Dateien vorhanden; fehlende oder verwaiste Plan-Dateien: 0. Ein Neustarttest über die App-Core-Funktionen bestätigte einen aktuellen Arbeitsplan EG, zwei Historieneinträge V1/V2, getrennte Fremdgruppen und lesbare PDF-Signaturen beider Versionen.


## MVP 3 - Mobile Handling-Prototyp

Stand 20.06.2026 ist ein lokaler mobiler Baustellenmodus auf Port \`8000\` umgesetzt.

Startdatei:

\`\`\`text
D:\Kai_BauSuite\mobile\Start-MobileServer.cmd
\`\`\`

Aktuelle Adressen:

\`\`\`text
PC:    http://localhost:8000
Handy: http://192.168.178.49:8000
\`\`\`

Echt getestet:

- Serverstart direkt und über die CMD-Datei
- HTTP 200 über localhost und WLAN-IP
- Projekt \`3 RH Kronwinkler\` aus der konfigurierten Datenbasis
- 1 vorhandene Aktivität
- vorhandene und mobil neu gespeicherte Beobachtungen
- 14 Gewerke, 1 Firma und 1 Verantwortlicher als aktive Dropdown-Daten
- 19 aktuelle aktive Pläne in der mobilen Planliste
- Öffnen eines echten Plans über die geschützte Planroute
- atomare Speicherung mit \`observations.json.bak\`
- neuer Datensatz \`Mobiler Funktionstest MVP 3\` mit Gewerk-, Firmen- und Verantwortlichen-ID
- Windows-kompatible Feldstruktur in \`observations.json\`
- Planversionierung unverändert: 21 Planmetadaten, Arbeitsplan EG mit zwei Versionen und genau einer aktuellen Version
- JavaScript-Syntax mit der gebündelten Node-Laufzeit

Neu angelegte Dateien:

\`\`\`text
D:\Kai_BauSuite\mobile\server.py
D:\Kai_BauSuite\mobile\Start-MobileServer.cmd
D:\Kai_BauSuite\mobile\static\index.html
D:\Kai_BauSuite\mobile\static\styles.css
D:\Kai_BauSuite\mobile\static\app.js
D:\Kai_BauSuite\mobile\static\manifest.json
\`\`\`

Die integrierte Browserautomatisierung war auf diesem Windows-System durch die lokale Sandbox nicht verfügbar. Netzwerk, HTML-Auslieferung, API, JavaScript-Syntax, reale Daten, Schreibpfad und PDF-Auslieferung wurden deshalb direkt geprüft. Der visuelle Test auf dem realen Handy bleibt der nächste manuelle Akzeptanztest.

Die langfristige Roadmap berücksichtigt mehrere echte Projekte, stabile IDs, spätere Benutzerrechte, gemeinsame Online-API, Supabase/PostgreSQL/Auth/Storage, Planpins, Soll-Ist-Abgleich, IFC/BIM, Raumbuch, Ausstattungsdaten und Projektvorlagen. Diese Funktionen sind nicht Bestandteil von MVP 3.

Nächster Schritt: MVP 4 mobile Plananzeige und danach Pins auf Plan.



## Roadmap-Ergänzung: Mehrsprachige Sprach- und KI-Erfassung

Die Anforderungen für Deutsch, Albanisch und gemischte Eingaben Deutsch/Albanisch sind aufgenommen. Im aktuellen MVP wurden keine Sprach-, Übersetzungs- oder KI-Funktionen implementiert und keine bestehende JSON-Struktur verändert.

Priorisierte Reihenfolge:

1. Mobiler Speicherfehler bei Beobachtungen beheben und verifizieren - abgeschlossen.
2. Mobile Handling-Prototyp stabilisieren - aktuell.
3. Beobachtungsmodell für mehrere Gewerke, Firmen und Verantwortliche vorbereiten.
4. Projektbezogene Zuordnung globaler Firmen und Verantwortlicher vorbereiten.
5. Einfache Sprach- und Diktierfunktion ergänzen.
6. Spracherkennung und Übersetzung Deutsch/Albanisch ergänzen.
7. Strukturierte KI-Auswertung als bestätigungspflichtigen Vorschlag ergänzen.
8. Optional freizugebende albanische Handwerkerausgabe ergänzen.

Das spätere Zielmodell umfasst Originalsprachtext, Originalsprache, deutsche Übersetzung, deutsche Zusammenfassung, optionale Ausgabesprache, deutsche und albanische Hinweistexte, KI-Vorschlag, optionale Konfidenz und Nutzerbestätigung. Firmen und Verantwortliche erhalten langfristig bevorzugte Sprache sowie optionale Angaben zu Deutschkenntnissen und Übersetzungsbedarf.

Verbindlich bleibt: Mehrere Beteiligte müssen möglich sein, KI darf nur vorschlagen, und Speichern oder Weitergeben erfordert eine prüfbare Nutzerfreigabe.



## Abnahmestand MVP 3

Stand: 21.06.2026

MVP 3 Mobile Handling-Prototyp ist erfolgreich getestet und für den aktuellen Umfang stabil.

Start:

D:\Kai_BauSuite\mobile\Start-MobileServer.cmd

Handy im gleichen WLAN:

http://192.168.178.49:8000

Bestätigte Funktionen:

- Projektliste mobil
- Projekt öffnen
- Aktivitäten anzeigen
- neue Aktivität anlegen
- Beobachtungen anzeigen
- neue Beobachtung anlegen
- Beobachtung antippen
- Detailansicht öffnen
- Beobachtung bearbeiten
- Änderung speichern
- Änderung nach Neuladen weiterhin vorhanden
- Windows-App-Kompatibilität erhalten

Die mobile Oberfläche und die Windows-App verwenden dieselben projektbezogenen JSON-Dateien und stabilen IDs. Schreibvorgänge erzeugen Backups. Es wurden keine Änderungen an Planversionierung oder Stammdatenlogik vorgenommen.

Nächste Entscheidung:

MVP 4 wird entweder mit Fotos zu Beobachtungen oder mit mobiler Plananzeige und späteren Pins fortgesetzt. Die Reihenfolge ist noch offen.



## MVP 4 - Fotos zu Beobachtungen

Stand: 21.06.2026

Umgesetzt:

- mehrere Fotos je Beobachtung
- Kamera-/Galerieauswahl über mobiles HTML-Dateifeld
- PC-Dateiauswahl im Browser
- Vorschauen in der mobilen Beobachtungs-Detailansicht
- größere Ansicht durch Antippen
- optionale gemeinsame Foto-Notiz beim Upload
- projekt- und beobachtungsbezogene Dateiablage
- eigene photos.json mit stabilen IDs und relativen Pfaden
- robuste Metadatenspeicherung mit Backup
- Dateisignaturprüfung und 15-MB-Grenze
- JPG, JPEG, PNG und WEBP

Erfolgreich getestet:

- zwei Fotos zur gleichen mobilen Testbeobachtung hochgeladen
- beide Metadatensätze nach erneutem Projektladen vorhanden
- beide Bilddateien über die mobile API lesbar
- alle geforderten Metadatenfelder vorhanden
- ausschließlich relative Pfade gespeichert
- falscher Bildinhalt mit HTTP 400 abgewiesen
- photos.json.bak vorhanden
- observations.json bleibt ohne neues photos-Feld
- 5 bestehende Beobachtungen weiterhin lesbar
- Planversionierung unverändert mit 21 Einträgen und Arbeitsplan EG V1/V2
- Projekt- und Stammdaten weiterhin gültig

Geänderte Dateien:

- D:\Kai_BauSuite\mobile\server.py
- D:\Kai_BauSuite\mobile\static\app.js
- D:\Kai_BauSuite\mobile\static\styles.css
- D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md
- D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md

Neue Projektdaten:

- D:\Kai_BauSuite\daten\projekte\PRJ-20260619182118-195920\photos.json
- D:\Kai_BauSuite\daten\projekte\PRJ-20260619182118-195920\photos.json.bak
- zwei Testfotos unter fotos\OBS-20260620174006-A7B2B6\

Nächster geplanter Schritt: mobile Plananzeige und Pins auf Plan. Pins sind nicht Bestandteil von MVP 4.



## MVP 5 - Mobile Plananzeige und Pins

Stand: 21.06.2026

Umgesetzt:

- aktuelle aktive Projektpläne mobil als Liste anzeigen
- PDF-Pläne im Browserviewer und Bildpläne direkt öffnen
- Pinmodus mit relativen Koordinaten `x_rel` und `y_rel`
- beim Pinsetzen direkt eine neue Beobachtung anlegen
- stabile Verknüpfung Plan -> Pin -> Beobachtung
- vorhandenen Pin antippen und Beobachtungsdetail öffnen
- aus der Beobachtung mit `Auf Plan anzeigen` zum markierten Pin zurückkehren
- Fotos an der verknüpften Beobachtung weiterhin anzeigen und hinzufügen
- projektbezogene `pins.json` mit robuster Sicherung
- `plans.json` ausschließlich lesen

Geänderte Dateien:

- D:\Kai_BauSuite\mobile\server.py
- D:\Kai_BauSuite\mobile\static\app.js
- D:\Kai_BauSuite\mobile\static\styles.css
- D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md
- D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md

Neue Projektdaten:

- D:\Kai_BauSuite\daten\projekte\PRJ-20260619182118-195920\pins.json
- D:\Kai_BauSuite\daten\projekte\PRJ-20260619182118-195920\pins.json.bak
- ein Testpin mit verknüpfter Beobachtung und Testfoto

Erfolgreich technisch getestet:

- Projekt liefert nach Serverneustart 19 aktuelle aktive Pläne
- echte PDF-Datei wird mit MIME-Typ `application/pdf` ausgeliefert
- Pin und Beobachtung sind gegenseitig über stabile IDs verknüpft
- Koordinaten werden relativ im Bereich 0 bis 1 gespeichert
- ungültige Koordinaten werden mit HTTP 400 abgewiesen
- Pin, Beobachtung und Foto bleiben nach Serverneustart vorhanden
- vorhandene MVP-4-Fotos bleiben erhalten
- `plans.json` bleibt mit 21 Einträgen und unverändertem Datei-Hash erhalten
- JavaScript- und Python-Syntaxprüfung erfolgreich

Manuell am Smartphone noch zu prüfen:

- Pinposition und Touchbedienung auf dem konkret verwendeten iPhone-/Android-Browser
- Verhalten des eingebauten PDF-Viewers beim Zoomen und Verschieben
- Rücksprung `Auf Plan anzeigen` nach realer Fingerbedienung

Bekannte Einschränkung: PDF-Pins beziehen sich in MVP 5 auf die erste Seite und die sichtbare Viewerfläche. Eine eigene PDF-Rendering- und Mehrseitenlogik ist nicht enthalten.

Nächster möglicher Schritt: mobile Pin-/Foto-Bedienung weiter stabilisieren oder einen einfachen Baustellenbericht vorbereiten.


Testanleitung:

1. `D:\Kai_BauSuite\mobile\Start-MobileServer.cmd` starten.
2. `http://192.168.178.49:8000` am Handy im gleichen WLAN öffnen.
3. Projekt, aktuellen Plan und `Pin setzen` wählen.
4. Position antippen, neue Beobachtung erfassen und speichern.
5. Pin und Beobachtungsdetail öffnen; `Auf Plan anzeigen` prüfen.
6. Foto ergänzen und nach Neuladen kontrollieren.
7. Server neu starten und Persistenz erneut prüfen.
8. Abschließend die gleichen Projekt-, Aktivitäts-, Beobachtungs- und Plandaten in der Windows-App kontrollieren.


## MVP 5.1 - Mobiler Workflow und stabile Pin-Koordinaten

Stand: 22.06.2026

Umgesetzt:

- PDF-Seite 1 wird lokal mit PDF.js in ein kontrolliertes Canvas gerendert.
- Pin-Layer und Planseite besitzen identische Abmessungen.
- Neue Pins verwenden coordinate_space = page-v1.
- Relative Koordinaten bleiben bei App-Zoom, Scrollen und Neuladen stabil.
- Ältere Pins bleiben unverändert und werden als ältere Koordinaten gekennzeichnet.
- Projekt-Dashboard mit offenen Beobachtungen, Mängeln, Fälligkeiten und Fragen.
- Letzte Beobachtungen und letzte Aktivitäten.
- Schnellaktionen für Beobachtung, Foto/Beobachtung, Pin, Aktivität und Pläne.
- Schnellablauf Projekt -> Pin auf Plan setzen -> Plan -> Pin -> Beobachtung.
- Direkte Beobachtungserfassung ohne vorherige Aktivitätsnavigation.
- Heutige Standard-Aktivität Baustellenrunde <Datum> wird wiederverwendet oder automatisch angelegt.
- Optionales Foto bei direkter Beobachtungserfassung.

Technisch geprüft:

- JavaScript-, Python- und PDF.js-Syntax.
- 19 aktuelle aktive Pläne über die mobile API.
- PDF-Datei wird als application/pdf ausgeliefert.
- Ungültige Koordinaten werden mit HTTP 400 abgewiesen.
- Testpin mit x_rel = 0.12, y_rel = 0.82 und page_number = 1.
- Pin und Beobachtung sind gegenseitig verknüpft.
- Direktbeobachtung und Pin-Beobachtung bleiben nach Serverneustart vorhanden.
- Zusätzliche Vorab- und atomare Backups vorhanden.
- plans.json unverändert mit SHA-256 E2765FD3E94386158AB4F4D1360E121C259AB151BFB407DFA6344F1AE90559CD.
- Bestehende Fotos und Planversionierung unverändert.

Geänderte Dateien:

- D:\Kai_BauSuite\mobile\server.py
- D:\Kai_BauSuite\mobile\static\app.js
- D:\Kai_BauSuite\mobile\static\styles.css
- D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md
- D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md

Neue Dateien:

- D:\Kai_BauSuite\mobile\static\vendor\pdf.min.mjs
- D:\Kai_BauSuite\mobile\static\vendor\pdf.worker.min.mjs
- D:\Kai_BauSuite\mobile\static\vendor\pdfjs-LICENSE

Manuell am Handy zu prüfen:

1. Server auf Port 8000 neu starten.
2. Projekt öffnen und Dashboard-Karten prüfen.
3. Pin auf Plan setzen wählen und einen Pin an einer eindeutig erkennbaren Gebäudeecke setzen.
4. Plan neu öffnen und Position vergleichen.
5. Beobachtung öffnen und Auf Plan anzeigen prüfen.
6. Direkte Beobachtung sowie Foto / Beobachtung testen.
7. Windows-App öffnen und neue Aktivitäten und Beobachtungen kontrollieren.


## MVP 5.2 - Pin-Bearbeitung und bessere Pin-Optik

Stand: 22.06.2026

Umgesetzt:

- Pin-Detail als mobiles Bottom Sheet
- Anzeige von Pin-Nummer, Titel, Beobachtung, Typ und Status
- Beobachtung direkt aus Pin-Detail öffnen
- expliziter Verschiebemodus mit Vorschau
- Speichern und Abbrechen der neuen Position
- Server-Endpunkt zum Aktualisieren ausschließlich von x_rel und y_rel
- Verschiebesperre für alte Pins ohne coordinate_space = page-v1
- kompakte Lucide-Map-Pins mit genauer Spitze
- Farben nach Typ beziehungsweise Erledigt-Status
- Hervorhebung des ausgewählten Pins
- Auf Plan anzeigen bleibt kompatibel

Technisch getestet:

- kompatibler Testpin von x_rel 0.12 / y_rel 0.82 auf 0.18 / 0.76 verschoben
- neue Position nach Serverneustart weiterhin vorhanden
- alter Pin mit HTTP 400 abgewiesen und unverändert
- ungültige Koordinaten mit HTTP 400 abgewiesen
- Pin-Beobachtungs-Verknüpfung unverändert
- pins.json.bak und zusätzliche Vorabsicherung vorhanden
- observations.json, photos.json und plans.json mit unveränderten Hashes
- alle 21 Plan-Dateien erhalten
- JavaScript-, Python- und Lucide-Syntax erfolgreich geprüft

Geänderte Dateien:

- D:\Kai_BauSuite\mobile\server.py
- D:\Kai_BauSuite\mobile\static\app.js
- D:\Kai_BauSuite\mobile\static\styles.css
- D:\Kai_BauSuite\mobile\static\index.html
- D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md
- D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md

Neue Dateien:

- D:\Kai_BauSuite\mobile\static\vendor\lucide.min.js
- D:\Kai_BauSuite\mobile\static\vendor\lucide-LICENSE

Manuell am Handy zu prüfen: Bottom Sheet, Markerfarben, exakte Markerspitze, Vorschau und Finger-/S-Pen-Bedienung. Pin-Löschen ist nicht Bestandteil von MVP 5.2.


## Roadmap nach MVP 5.2

Stand: 22.06.2026

### Nächster möglicher Schritt: MVP 6 Mailentwurf

Geplant:

- Aktion Mail an Verantwortlichen erstellen aus Beobachtung oder Mangel
- Empfängervorschläge aus Projektstammdaten
- Hauptempfänger, weitere Empfänger und CC
- mehrere beteiligte Firmen und Verantwortliche
- Plan-, Pin-, Foto-, Beschreibungs- und Fristdaten übernehmen
- höflichen, fachlich sauberen Mangeltext als Entwurf erzeugen
- Entwurf vollständig bearbeitbar halten
- Prüfung und ausdrückliche Nutzerfreigabe vor Versand
- kein automatischer Versand

Vorgesehene Felder:

- haupt_empfaenger_id
- weitere_empfaenger_ids[]
- cc_ids[]
- mail_status
- mail_entwurf_text
- mail_versendet_am
- frist_rueckmeldung
- frist_nachbesserung
- fachhinweis_text
- fachhinweis_quellen[]
- ki_generiert
- vom_nutzer_geprueft

### Danach: MVP 6.1 Quellenbasierter KI-Fachhinweis

Die KI darf nur Hinweise aus hinterlegten Herstellerunterlagen, Projektunterlagen, geprüften Textbausteinen und zulässigen eigenen Zusammenfassungen erzeugen. Normen und Herstellervorgaben dürfen nicht frei erfunden werden.

Jeder Fachhinweis benötigt nachvollziehbare Quellenbezüge. Bei fehlender oder unsicherer Quellenlage muss die App dies kenntlich machen und darf keine scheinbar sichere Aussage erzeugen. Der Nutzer prüft und bestätigt Fachhinweis, Quellen, Mailtext und Empfänger.

Beispiel für einen späteren Anwendungsfall: vorsichtiger, quellenbasierter Hinweis zu WDVS-Kreuzfugen an Fensteröffnungen.

Status: ausschließlich dokumentierte Roadmap; keine Mail-, KI- oder Versandfunktion implementiert.


## MVP 6 - Mailentwurf und PDF-Bericht

Stand: 22.06.2026

Umgesetzt:

- Mailentwurf aus Beobachtung oder Mangel
- Empfängervorschlag aus Stammdaten
- Hauptempfänger, weitere Empfänger und CC
- bearbeitbarer Betreff und Mailtext
- Kopieren in die Zwischenablage
- Rückmelde- und Nachbesserungsfrist
- manueller technischer Hinweis
- lokale Speicherung in mail_drafts.json
- PDF-Bericht aus Beobachtungsdaten
- PDF.js-Planausschnitt um den Pin
- sichtbare Pinmarkierung im Bericht
- Einbettung vorhandener Beobachtungsfotos
- Rückmelde- und Nachbesserungsseite
- projektbezogene Berichtsablage und reports.json
- Öffnen des gespeicherten PDFs aus der mobilen Beobachtung

Speicherorte:

- D:\Kai_BauSuite\daten\projekte\<project-id>\mail_drafts.json
- D:\Kai_BauSuite\daten\projekte\<project-id>\reports.json
- D:\Kai_BauSuite\daten\projekte\<project-id>\reports\

Testdaten:

- Mailentwurf MAIL-20260622102838-61CB61
- Bericht RPT-20260622140200-987248
- Berichtspfad reports/2026-06-22_Mangel_Neuer_test_pin_987248.pdf
- Grundlage: Beobachtung OBS-20260622090906-FBAE94 mit Pin und Foto

Erfolgreich getestet:

- Mailentwurf mit Hauptempfänger, weiterem Empfänger und CC gespeichert
- mail_status ist Entwurf
- ki_generiert und vom_nutzer_geprueft sind false
- vierseitiges A4-PDF erzeugt und gespeichert
- PDF kann mit Poppler und pypdf geöffnet werden
- Planausschnitt und rote Pinmarkierung visuell sichtbar
- Beobachtungsfoto visuell sichtbar
- Rückmeldeseite vorhanden
- Berichtsdaten und Seitenzahlen lesbar
- Berichtsmetadaten besitzen ausschließlich relativen Pfad
- mail_drafts.json.bak und reports.json.bak vorhanden
- observations.json, photos.json und plans.json unverändert

Geänderte Dateien des MVP-6-Schritts:

- D:\Kai_BauSuite\mobile\server.py
- D:\Kai_BauSuite\mobile\static\app.js
- D:\Kai_BauSuite\mobile\static\styles.css
- D:\Kai_BauSuite\mobile\static\index.html
- D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md
- D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md

Neue Laufzeitdateien:

- D:\Kai_BauSuite\mobile\static\vendor\pdf-lib.min.js
- D:\Kai_BauSuite\mobile\static\vendor\pdf-lib-LICENSE.md

Nächster Schritt:

- MVP 6.2 quellenbasierter Fachhinweis
- MVP 7 Deutsch-/Albanisch-Sprachfunktion

## MVP 6.1 - Klickbare Dashboard-Kacheln

Stand: 22.06.2026

Umgesetzt:

- `Offene Beobachtungen` öffnet alle nicht erledigten Beobachtungen.
- `Offene Mängel` öffnet alle nicht erledigten Mängel.
- `Überfällig` öffnet nicht erledigte Beobachtungen mit einer Frist vor heute.
- `Heute / nächste 7 Tage` öffnet nicht erledigte Beobachtungen mit Frist von heute bis einschließlich heute plus sieben Tage.
- `Offene Fragen` öffnet alle nicht erledigten Fragen.
- Jede Filteransicht zeigt Titel, Trefferzahl, verständlichen Leerzustand und mobile Beobachtungskarten.
- Beobachtungskarten öffnen die vorhandene Detailansicht.
- `Alle` bei den letzten Beobachtungen öffnet die vollständige Projektliste der Beobachtungen.
- `Alle` bei den letzten Aktivitäten öffnet die vollständige Aktivitätsliste.
- Statusauswertung ist tolerant gegenüber Groß-/Kleinschreibung.
- Fristen werden als ISO-Datum sowie in vorhandenen deutschen Formaten erkannt; leere und ungültige Werte werden ignoriert.

Geänderte Dateien:

- D:\Kai_BauSuite\mobile\static\app.js
- D:\Kai_BauSuite\mobile\static\styles.css
- D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md
- D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md

Unverändert:

- Server-API und fachliche JSON-Datenstrukturen
- Projekte, Aktivitäten, Beobachtungen, Fotos und Pins
- Planversionierung und plans.json
- Mailentwurf und PDF-Bericht

Prüfung:

- JavaScript-Syntax erfolgreich geprüft.
- Mobile Startseite, JavaScript, Styles und echte Projekt-API über lokalen Testserver geladen.
- Projekt `3 RH Kronwinkler` mit echten Aktivitäten, Beobachtungen, Plänen, Fotos und Pins geladen.
- Filterregeln und tolerante Status-/Datumsauswertung gegen die vorhandenen Projektdaten geprüft.
- plans.json blieb unverändert.

Bekannte Einschränkung:

- Noch keine frei kombinierbaren Filter in der vollständigen Beobachtungsliste.

## MVP 6.2 - Fachhinweis-Bausteine und Quellenbasis

Stand: 22.06.2026

Umgesetzt:

- zentrale JSON-Quellenbasis unter `D:\Kai_BauSuite\daten\fachwissen\fachhinweise.json`
- stabile Fachhinweis-IDs, Zeitstempel, Aktivstatus und Prüfstatus
- drei als `zu prüfen` gekennzeichnete Standardbeispiele für WDVS, Fensteranschluss und Elektroinstallation
- mobile Vorschläge nach Gewerk, Thema, Titel und Stichworten
- sichtbarer Kurztext, Maßnahme, Quelle und Prüfstatus
- bewusste Nutzerbestätigung vor Übernahme
- bearbeitbarer Übernahmetext
- optionale Fachhinweisfelder in Beobachtungen
- Fachhinweisverwaltung: Anzeigen, Neu, Bearbeiten, Aktiv/Inaktiv
- Übernahme von Text, Quelle und Prüfstatus in Mailentwurf und PDF-Bericht
- atomare Speicherung und `.bak`-Sicherungen

Geänderte Dateien:

- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\static\styles.css`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Neue Dateien:

- `D:\Kai_BauSuite\daten\fachwissen\fachhinweise.json`
- `D:\Kai_BauSuite\mobile\tests\mvp62_integration_test.py`

Testdaten:

- Fachhinweis `FHW-STD-WDVS-001` an Beobachtung `OBS-20260622090906-FBAE94`
- Mailentwurf `MAIL-20260622153602-A466FF`
- Bericht `RPT-20260622153602-6F91DC`
- Berichtspfad `reports/2026-06-22_MVP62_Fachhinweis_Test_6F91DC.pdf`

Erfolgreich geprüft:

- Fachhinweis-Datenbasis mit drei lesbaren Beispielen
- Verwaltungs-API und `fachhinweise.json.bak`
- Übernahme und Neuladen an einer bestehenden Beobachtung
- `observations.json.bak`
- Mailentwurf enthält Fachhinweis, Quelle und Prüfstatus
- PDF enthält Fachhinweis, Quelle und Prüfstatus
- Planausschnitt mit markiertem Pin bleibt sichtbar
- Beobachtungsfoto bleibt sichtbar
- Rückmeldeseite bleibt enthalten
- Mail-, Beobachtungs- und Berichtsmetadaten bleiben projektbezogen
- `plans.json` blieb unverändert

Nicht umgesetzt:

- automatische KI-Normrecherche
- automatische Herstellerrecherche
- ungeprüfte Normbehauptungen
- automatischer Mailversand

Nächster möglicher Schritt:

- MVP 7 Deutsch-/Albanisch-Sprachfunktion
- alternativ MVP 6.3 KI-gestützte Auswahl ausschließlich aus hinterlegten Fachhinweisen

## Roadmap - Raum-/Blickrichtungszuordnung

Stand: 22.06.2026

Status: ausschließlich dokumentierte Langfrist-Roadmap; nicht implementiert.

Ziel:

- Foto, Panorama oder Video räumlich einem Projekt und Plan zuordnen
- Raum, Geschoss, Standpunkt und Blickrichtung nachvollziehbar speichern
- Aufnahmen optional mit Beobachtung und Pin verbinden
- Grundlage für Elektro-Soll-Ist-Abgleich, Panorama-Dokumentation, Video-Rundgang und IFC/BIM-Abgleich schaffen

Vorgesehenes Modell:

- stabile IDs und `project_id`/`plan_id`
- optional `room_id` und `ifc_guid`
- `raum_name` und `geschoss_bereich`
- relative Planposition `position_x_rel`/`position_y_rel`
- `blickrichtung_grad` von 0 bis unter 360 Grad
- `aufnahme_typ` Foto, Panorama oder Video
- optionale `observation_id` und `pin_id`
- Beschreibung sowie `created_at`/`updated_at`
- später erweiterbar um `building_storey`, `wall_id`, `element_id` und `soll_punkt_id`

Geplante Ausbaustufen:

1. Manuelle Raumwahl, Standpunkt im Grundriss und Richtungspfeil.
2. Raumbezogene Panoramaaufnahme.
3. Kurzes Video beziehungsweise Rundgang mit Bewegungsbezug.
4. Soll-Ist-Abgleich von Planpunkten und dokumentierter Ausführung.
5. IFC-/BIM-Verknüpfung sowie unterstützende Sensor-, KI- und AR-/SLAM-Funktionen.

Leitplanken:

- Koordinaten relativ zur echten Planfläche, niemals als dauerhafte Pixelkoordinaten.
- Sensordaten sind nur unterstützend; Nutzer kann Position und Richtung immer korrigieren.
- Aufnahme-Standpunkt und Mangel-Pin dürfen getrennte fachliche Punkte bleiben.
- Datenmodell wird nicht auf PDF beschränkt, sondern für IFC-Räume, Wände und Elemente erweiterbar gedacht.
- Automatische Erkennung und AR/SLAM gehören nicht zum aktuellen Alpha-Stand.

Prioritätsreihenfolge bleibt:

1. MVP 6.2 Fachhinweis-Bausteine und Quellenbasis.
2. Deutsch-/Albanisch-Sprachfunktion.
3. Alpha-Vorbereitung.
4. Raum-/Blickrichtungsmodul als spätere Grundlage für Soll-Ist-Abgleich und BIM.

Für diese Ergänzung wurden ausschließlich Dokumentationsdateien geändert. App-Code, Projektdaten, Planversionierung und `plans.json` blieben unverändert.

## MVP 7a - Freitext- und Diktat-Erfassung

Stand: 22.06.2026

Umgesetzt:

- Schnellaktion `Per Sprache/Text erfassen` im mobilen Projekt-Dashboard
- großes Textfeld für Tippen, Einfügen oder Handytastatur-Diktat
- lokaler Endpunkt `POST /api/ai/parse-observation`
- regelbasierte Erkennung Deutsch, Albanisch, gemischt und unbekannt
- Vorschläge für Typ, Titel, Beschreibung, Gewerk, Firma, Verantwortlichen, Status, Priorität und Frist
- Stammdatenabgleich für WDVS/Putz, Elektro sowie namentlich erwähnte Ansprechpartner
- editierbare Vorschau mit `Übernehmen`, `Bearbeiten` und `Abbrechen`
- verpflichtende Nutzerbestätigung vor Speicherung
- automatische bestehende Standard-Aktivität `Baustellenrunde`, falls keine Aktivität gewählt wurde
- transparente Anzeige des Originaltexts in der Beobachtungsdetailansicht
- zusätzliche optionale Sprach-/Strukturfelder in neu bestätigten Beobachtungen

Technischer Umfang:

- `analysis_mode`: `rule-based-alpha`
- `external_ai_active`: `false`
- `echte_ki_verwendet`: `false`
- keine API-Schlüssel oder Zugangsdaten
- keine eigene Audioaufnahme
- keine automatische Norm- oder Fachbehauptung

Geänderte Dateien:

- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\static\styles.css`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Neue Dateien:

- `D:\Kai_BauSuite\mobile\alpha_parser.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7a.py`

Erfolgreich getestet:

- deutsche Eingabe erkennt Mangel, WDVS / Putz, hohe Priorität und nächste Woche
- gemischte Eingabe erkennt Sprache `mixed`, WDVS / Putz, LTH Bau GmbH und Labi
- Datumsregeln für heute, morgen und nächste Woche
- bestätigtes Speichern der Testbeobachtung `OBS-20260622190925-78A0F6`
- Originaltext, Sprache und Bestätigungsfelder bleiben nach Neuladen erhalten
- `observations.json.bak` wurde erzeugt
- Windows-Core liest die ergänzte Beobachtung
- Plan-, Foto- und Berichtsdateien antworten weiterhin mit HTTP 200
- Pins, Fotos, Fachhinweise, Mailentwürfe und Berichte bleiben vorhanden
- `activities.json` blieb unverändert
- `plans.json` blieb unverändert

Bekannte Einschränkungen:

- Regelbasierte Erkennung statt echter KI.
- Albanische Übertragung deckt nur wenige bekannte Begriffe ab.
- Keine eigene Audioaufnahme oder automatische Transkription.
- Mobile visuelle Browserautomatisierung war in der aktuellen Windows-Sitzung nicht verfügbar; UI-Ressourcen, Syntax und API wurden vollständig geprüft.

Nächster Schritt:

- MVP 7b echte KI-/Übersetzungsanbindung und Transkription
- anschließend Alpha-Testvorbereitung auf konkreten iOS-/Android-Geräten

## MVP 7b - Browser-Audioaufnahme

Stand: 22.06.2026

Umgesetzt:

- sichtbare Buttons `Aufnahme starten` und `Aufnahme stoppen`
- Statusanzeige während Aufnahme und Speicherung
- MediaRecorder mit Laufzeitwahl für WebM/Opus, MP4/M4A und Ogg/Opus
- Fallback auf nativen Audio-Aufnahme-/Dateidialog bei fehlendem sicherem MediaRecorder-Kontext
- Audio-Player für aktuelle und zuletzt gespeicherte Aufnahmen
- projektbezogene Audiodateien und `audio.json`
- relative Dateipfade und stabile Audio-IDs
- optionale Aktivitäts- und Beobachtungszuordnung
- atomare Speicherung und `audio.json.bak`
- vorbereiteter Endpunkt `POST /api/ai/transcribe-audio`
- klare Meldung, dass automatische Transkription nicht aktiv ist
- bestehende manuelle Texteingabe und MVP-7a-Auswertung bleiben erhalten

Geänderte Dateien:

- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\static\styles.css`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Neue Datei:

- `D:\Kai_BauSuite\mobile\tests\test_mvp7b_audio.py`

Neue Testdaten:

- `D:\Kai_BauSuite\daten\projekte\PRJ-20260619182118-195920\audio.json`
- `D:\Kai_BauSuite\daten\projekte\PRJ-20260619182118-195920\audio\AUD-20260622192909-82AB6A\AUD-20260622192909-82AB6A.wav`
- Zuordnung zu `OBS-20260622190925-78A0F6`

Erfolgreich geprüft:

- Mobile Server startet.
- Startseite, JavaScript und Styles werden ausgeliefert.
- Audio-Upload und Dateisignaturprüfung funktionieren.
- Audio-Metadaten bleiben nach Neuladen erhalten.
- Audiodatei wird bytegleich wieder ausgegeben.
- Zuordnung zu Aktivität und Beobachtung bleibt erhalten.
- Transkriptionsstatus ist ehrlich `not_active`.
- MVP-7a-Textanalyse liefert weiterhin einen Mangelvorschlag.
- Plan-, Foto- und Berichtsendpunkte antworten mit HTTP 200.
- Pins, Fotos, Fachhinweise, Mailentwürfe und Berichte bleiben vorhanden.
- `plans.json` blieb unverändert.

Bekannte Einschränkungen:

- Keine automatische Transkription.
- Keine externe KI und keine API-Schlüssel.
- Direkter MediaRecorder-Mikrofonzugriff benötigt üblicherweise HTTPS.
- Unter der aktuellen HTTP-WLAN-Adresse wird deshalb bei Bedarf der native Audio-Aufnahme-/Dateidialog verwendet.
- Kein physischer Firefox-/Chrome-/iOS-/Android-Mikrofontest in der Entwicklungsumgebung möglich.

Nächster Schritt:

- sicherer HTTPS-Zugriff für den WLAN-Test
- echte Transkription und Übersetzung Deutsch/Albanisch
- Geräte- und Browsermatrix auf realen Smartphones

## MVP 7b.1 - Direkte Mikrofonaufnahme

Stand: 22.06.2026

Umgesetzt:

- zusaetzlicher HTTPS-Start ueber `D:\Kai_BauSuite\mobile\Start-MobileServer-HTTPS.cmd`
- HTTPS-Adresse `https://192.168.178.49:8443`
- optionaler TLS-Betrieb in `server.py`; bisheriger HTTP-Start bleibt erhalten
- lokale Test-CA und Serverzertifikat unter `D:\Kai_BauSuite\mobile\certs`
- direkte Browseraufnahme mit `getUserMedia` und `MediaRecorder`
- Aufnahmestart, Aufnahmestopp und sichtbare Laufzeit
- Upload und Wiedergabe ueber das bestehende MVP-7b-Audiomodell
- klarer, aufklappbarer Datei-/Diktiergeraet-Fallback
- unveraenderte manuelle Texteingabe und MVP-7a-Auswertung

Neue Dateien:

- `D:\Kai_BauSuite\mobile\Start-MobileServer-HTTPS.cmd`
- `D:\Kai_BauSuite\mobile\generate_https_cert.py`
- `D:\Kai_BauSuite\mobile\certs\README.md`
- lokale CA-, Serverzertifikat- und Schluesseldateien unter `D:\Kai_BauSuite\mobile\certs`

Geaenderte Dateien:

- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\static\styles.css`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Erfolgreich geprueft:

- HTTP-Server liefert echte Projektdaten weiterhin aus.
- HTTPS-Server startet auf Port 8443.
- Serverzertifikat ist fuer `192.168.178.49`, `127.0.0.1`, `localhost` und den PC-Namen gueltig.
- HTTPS-Status, Startseite, Projektliste und JavaScript werden ueber die lokale CA erfolgreich geladen.
- JavaScript enthaelt sichere Kontextpruefung, MediaRecorder-Aufnahme, Timer und Fallback.
- Python- und JavaScript-Syntax sind gueltig.
- `plans.json` hat weiterhin SHA256 `E2765FD3E94386158AB4F4D1360E121C259AB151BFB407DFA6344F1AE90559CD`.

Bekannte Einschraenkungen:

- Die lokale CA muss auf dem Testhandy als vertrauenswuerdig installiert beziehungsweise bestaetigt werden.
- Der reale Mikrofon- und Berechtigungstest ist nur auf einem physischen Smartphone moeglich und wurde nicht als Chrome-/Firefox-Geraetetest simuliert.
- Keine automatische Transkription, keine externe KI und keine API-Schluessel.

Naechster Schritt: direkter Geraetetest ueber HTTPS; danach echte Transkription und Uebersetzung Deutsch/Albanisch.

## MVP 7c - Transkription vorbereitet

Stand: 22.06.2026

Umgesetzt:

- stabiler API-Vertrag `POST /api/ai/transcribe-audio`
- Validierung von Projekt, Audio, optionaler Beobachtung und Sprachhinweis
- ehrliche Antwort `not_configured`, solange kein KI-Dienst eingerichtet ist
- sichere Platzhalterkonfiguration ohne API-Schluessel
- mobile Schaltflaeche `Audio transkribieren`
- Statusanzeige fuer laufend, erfolgreich, nicht konfiguriert und Fehler
- bearbeitbares Transkriptionsfeld
- manuelles Transkript wird mit der vorhandenen MVP-7a-Logik ausgewertet
- optionale Transkriptionsmetadaten an Beobachtungen
- Audio-ID wird vor dem Speichern gegen das Projekt validiert
- Deutsch, Albanisch und gemischte Sprache als Zielarchitektur vorbereitet

Konfigurationsfelder:

- `ai_transcription_enabled`
- `ai_provider`
- `ai_endpoint`
- `ai_model_transcription`
- `ai_model_text`
- `ai_api_key_env_name`

Aktueller Betriebsstatus:

- Transkription ist vorbereitet, aber deaktiviert.
- Kein Provider-Adapter ist aktiv.
- Keine externe KI wird aufgerufen.
- Kein API-Schluessel ist im Code oder in JSON gespeichert.
- Manuelle Texteingabe und regelbasierte Strukturierung funktionieren weiter.

Geaenderte Dateien:

- `D:\Kai_BauSuite\config\settings.json`
- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\static\styles.css`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Neue Datei:

- `D:\Kai_BauSuite\mobile\tests\test_mvp7c_transcription.py`

Erfolgreich geprueft:

- Python-, JavaScript- und Konfigurationssyntax
- deaktivierter Transkriptionsvertrag ohne Absturz
- manueller gemischter Text wird strukturiert
- neue Transkriptionsfelder werden gespeichert und neu geladen
- Test erfolgt in einem automatisch entfernten isolierten Datenordner
- HTTPS-Projektbestand mit Aktivitaeten, Beobachtungen, Plaenen, Fotos, Pins, Fachhinweisen, Mailentwuerfen, Berichten und Audio laedt weiter
- keine produktiven Testbeobachtungen angelegt
- `plans.json` blieb unveraendert

Bekannte Einschraenkungen:

- Noch keine automatische Transkription oder Uebersetzung.
- Noch keine albanische Handwerkerausgabe.
- Kein Provider-Adapter und keine externe KI.
- Der vollstaendige Voice-First-Ablauf ist nur als Architekturziel vorbereitet.

Naechster Schritt: echten Transkriptions-/Uebersetzungsprovider auswaehlen und ueber Umgebungsvariable anbinden; danach Voice-First-Baustellenworkflow schrittweise aufbauen.

## MVP 7d - OpenAI-Provider integriert

Stand: 22.06.2026

Umgesetzt:

- OpenAI-Provideradapter ohne zusaetzliche Python-Abhaengigkeit
- Audio-Transkription ueber `/v1/audio/transcriptions`
- strukturierte Beobachtung ueber Responses API und strenges JSON-Schema
- neuer lokaler Endpunkt `POST /api/ai/structure-observation`
- bestehender Endpunkt `POST /api/ai/transcribe-audio` ruft OpenAI nur bei vorhandenem Schluessel auf
- API-Schluessel ausschliesslich aus `OPENAI_API_KEY`
- kein Schluessel in Code, JSON oder Logs
- kontrollierte Provider-, Netzwerk-, Timeout-, Format- und Leerantwortfehler
- lokaler MVP-7a-Fallback ohne Schluessel oder bei Providerfehlern
- Deutsch, Albanisch und gemischte Sprache
- serverseitige Filterung vorgeschlagener Stammdaten- und Fachhinweis-IDs
- Datenschutztext und getrennte bewusste Schaltflaechen fuer Audio und Text
- keine automatische Speicherung ohne Nutzerbestaetigung

Konfiguration:

```text
ai_transcription_enabled = true
ai_provider = openai
ai_model_transcription = gpt-4o-mini-transcribe
ai_model_text = gpt-4o-mini
ai_api_key_env_name = OPENAI_API_KEY
```

Geaenderte Dateien:

- `D:\Kai_BauSuite\config\settings.json`
- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\static\styles.css`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Neue Dateien:

- `D:\Kai_BauSuite\mobile\openai_provider.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7d_openai.py`

Erfolgreich geprueft:

- Python-, JavaScript- und JSON-Syntax
- Konfiguration enthaelt keinen echten Schluessel und kein frei konfigurierbares externes Ziel
- Ohne-Schluessel-Transkription liefert `not_configured`
- deutscher, gemischter und albanischer Text funktionieren im lokalen Fallback
- lokaler Mock prueft OpenAI-Multipart, Responses Structured Output und ID-Filterung
- keine automatische Beobachtungsspeicherung im Provider-Test
- echtes Projekt laedt weiterhin Aktivitaeten, Beobachtungen, Plaene, Fotos, Pins, Fachhinweise, Mailentwuerfe, Berichte und Audio
- `plans.json` blieb unveraendert

Nicht getestet:

- Echter OpenAI-Aufruf, da lokal kein `OPENAI_API_KEY` vorhanden war.
- Reale Transkriptionsqualitaet auf Android/iOS mit deutschem, albanischem und gemischtem Baustellenaudio.

Naechster Schritt: `OPENAI_API_KEY` als Windows-Benutzervariable setzen, kontrollierten echten API-/Handytest durchfuehren und danach MVP 7e Voice-First-Baustellenworkflow beginnen.

## MVP 7d.1 - Transkriptqualitaet und Bedienung verbessert

Stand: 23.06.2026

Umgesetzt:

- lokales Baustellen-Glossar fuer Transkription und Nachkorrektur
- projektbezogener Kontext fuer Audio-Transkription: Projektname, Adresse, Gewerke, Firmen, Verantwortliche und Fachhinweis-Titel
- optionale OpenAI-Nachkorrektur nach der Rohtranskription
- Ausgabe von Rohtranskript, bereinigtem deutschem Text und nachvollziehbaren Korrekturen
- Strukturvorschlag nutzt bevorzugt den bereinigten Text
- neuer Hauptbutton `Aufnahme auswerten`
- bisheriger Expertenablauf bleibt erhalten: `Audio transkribieren` und `Strukturvorschlag erzeugen`
- UI-Texte korrigiert: keine Meldung mehr `Automatische Transkription ist noch nicht aktiv`, wenn OpenAI verfuegbar ist
- bei deutscher Eingabe wird `Bereinigter deutscher Text` statt `Deutsche Uebersetzung` angezeigt
- Speicherung weiterhin erst nach Nutzerbestaetigung

Neue Datei:

- `D:\Kai_BauSuite\daten\fachwissen\baustellen_glossar.json`

Geaenderte Dateien:

- `D:\Kai_BauSuite\mobile\openai_provider.py`
- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\static\styles.css`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7d_openai.py`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Erfolgreich geprueft:

- Python-Syntax fuer Server, Provider und Test
- JavaScript-Syntax fuer mobile App
- MVP-7c-Kompatibilitaet
- MVP-7d/7d.1-Mocktest mit Rohtranskriptfehlern `Pflanzsystem` und `Kreuzbogen`
- Nachkorrektur zu `Putzsystem` und `Kreuzfugen`
- Strukturierung aus bereinigtem Text
- No-Key-Fallback bleibt funktionsfaehig
- keine automatische Beobachtungsspeicherung vor Nutzerbestaetigung
- keine API-Schluessel in Code oder Konfiguration gefunden
- `plans.json` blieb unveraendert

Bekannte Einschraenkungen:

- In dieser Codex-Terminalumgebung war `OPENAI_API_KEY` nicht sichtbar; ein echter OpenAI-Aufruf wurde daher nicht ausgefuehrt.
- Transkriptkorrektur ist ein KI-Vorschlag und muss vom Nutzer geprueft werden.
- Fachhinweise werden weiterhin nur aus vorhandener Bausteinbasis vorgeschlagen; Normen oder Herstellervorgaben werden nicht frei erzeugt.

Naechster Schritt: kontrollierter echter Handytest mit sichtbarer Windows-Umgebungsvariable `OPENAI_API_KEY`; danach Voice-First-Ablauf weiter vereinfachen.

## MVP 7d.2 - Geschuetzte Baustellenbegriffe und strengere Nachkorrektur

Stand: 23.06.2026

Umgesetzt:

- `protected_terms` im Baustellen-Glossar ergaenzt
- Projektname, Projektadresse, Gewerke, Firmen, Verantwortliche und Fachhinweis-Titel gelten automatisch als geschuetzte Begriffe
- Transkriptionsprompt enthaelt geschuetzte Begriffe als bevorzugte Schreibweisen
- Nachkorrektur-Prompt deutlich konservativer:
  - keine kreativen Umdeutungen
  - keine neuen Sachverhalte
  - Namen/Firmen/Projektorte bleiben Namen
  - `Labi` darf nicht zu `Lageverstaendigen` werden
  - `WDVS`, `Kreuzfugen`, `Armierungsgewebe` und Projektort sollen sichtbar bleiben, wenn sie im Text/Kontext wahrscheinlich sind
- Strukturierungsprompt fuer knappere, konkretere Titel und Beschreibungen geschaerft
- UI-Hinweis beim bereinigten Text: Fachbegriffe und Namen pruefen
- Korrekturanzeige `Korrekturen anzeigen` bleibt als pruefbare Original/Korrektur-Liste vorhanden

Erweiterte Glossar-Struktur:

```text
terms[]
protected_terms[]
```

Geaenderte Dateien:

- `D:\Kai_BauSuite\daten\fachwissen\baustellen_glossar.json`
- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\openai_provider.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7d_openai.py`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Erfolgreich geprueft:

- Python-Syntax fuer Server, Provider und OpenAI-Test
- JavaScript-Syntax fuer mobile App
- MVP-7d/7d.2-Mocktest mit echtem Baustellentext
- `Labi verstaendigen` bleibt `Labi verstaendigen` und wird nicht zu `Lageverstaendigen`
- `WDVS`, `Kreuzfugen`, `Armierungsgewebe`, `Kronwinkler Strasse/Straße` und `Aubing` bleiben erhalten
- Strukturvorschlag: konkreter Titel `WDVS: Kreuzfugen an Fensteroeffnung`, Typ `Mangel`, Prioritaet `hoch`, Verantwortlicher `Labi`
- No-Key-Fallback bleibt funktionsfaehig
- MVP-7c-Kompatibilitaet bleibt erhalten
- keine automatische Speicherung vor Nutzerbestaetigung
- kein API-Schluessel in Code oder Konfiguration gefunden
- `plans.json` blieb unveraendert

Bekannte Grenzen:

- Geschuetzte Begriffe reduzieren Fehlkorrekturen, ersetzen aber keine Nutzerpruefung.
- Die KI kann weiterhin unsichere Transkriptstellen liefern; deshalb bleibt die Korrekturliste sichtbar und der bereinigte Text bearbeitbar.
- Normen, Herstellerangaben und fachliche Bewertungen werden weiterhin nicht frei erzeugt.

## MVP 7d.3 - Rohtranskript, Bereinigung und Strukturvorschlag getrennt

Stand: 23.06.2026

Umgesetzt:

- Transkription liefert zuerst ein eigenes Rohtranskript.
- `transcript_text` der API bleibt jetzt das Rohtranskript.
- `cleaned_transcript_de` ist ein separates Feld fuer vorsichtige Bereinigung.
- Mobile UI zeigt getrennte bearbeitbare Felder: `Rohtranskript` und `Bereinigter Text`.
- Strukturvorschlag wird erst danach aus bereinigtem Text oder Rohtranskript erzeugt.
- Vorschau zeigt Rohtranskript, bereinigten Text und Strukturvorschlag getrennt.
- Transkriptionsprompt wurde auf Sprache-zu-Text reduziert: keine Uebersetzung, keine Zusammenfassung, keine Strukturierung.
- Offensichtlich englische Bereinigungen bei deutscher Eingabe werden serverseitig verworfen; Rohtranskript bleibt nutzbar.
- Speicherung bleibt erst nach Nutzerbestaetigung.

Geaenderte Dateien:

- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\openai_provider.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7d_openai.py`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Erfolgreich geprueft:

- Python-Syntax fuer Server, Provider und OpenAI-Test
- JavaScript-Syntax fuer mobile App
- MVP-7d/7d.3-Mocktest
- Rohtranskript bleibt wortnah und ohne englische Uebersetzung
- Bereinigung bleibt separat und deutsch
- `Labi`, `WDVS`, `Kreuzfugen`, `Armierungsgewebe` bleiben erhalten
- englische Bereinigung wird verworfen und Rohtranskript verwendet
- Strukturvorschlag nutzt bereinigten Text erst im separaten Schritt
- MVP-7c-Kompatibilitaet
- keine automatische Speicherung vor Nutzerbestaetigung
- kein API-Schluessel in Code oder Konfiguration gefunden
- `plans.json` blieb unveraendert

Bekannte Grenzen:

- Rohtranskript haengt weiterhin von der Transkriptionsqualitaet des Providers ab.
- Bereinigung ist optionaler Vorschlag und muss geprueft werden.
- Englisch-/Freiumschreibungsfilter ist bewusst einfach und ersetzt keine Nutzerkontrolle.

## MVP 7e - Baustellenmodus fuer gefuehrten Sprachworkflow

Stand: 23.06.2026

MVP 7e vereinfacht die mobile Sprach-/Texterfassung fuer den Baustelleneinsatz. Ziel ist weniger Tipparbeit und weniger Einzelklicks, ohne die Pruefung durch den Nutzer zu umgehen.

Umgesetzt:

- Standardmodus `Baustellenmodus` auf der mobilen Sprache/Text-Seite.
- Grosser Button `Aufnahme starten`.
- Waehrend der Aufnahme wird `Stoppen & auswerten` angezeigt.
- Nach `Stoppen & auswerten` laeuft der gefuehrte Ablauf automatisch:
  - Audio lokal speichern
  - Rohtranskript erstellen
  - bereinigten Text erzeugen
  - Strukturvorschlag erzeugen
  - zur Ansicht `Vorschlag pruefen` springen
- Die Vorschau ist vereinfacht und zeigt den Strukturvorschlag zuerst.
- Der Button `Übernehmen (geprüft)` ersetzt die bisherige Extra-Checkbox.
- Intern wird weiterhin `ki_vorschlag_bestaetigt = true` erst beim bewussten Uebernehmen gesetzt.
- Speicherung erfolgt weiterhin erst nach Nutzerbestaetigung.

Expertenmodus / Details:

- Einklappbarer Bereich `Expertenmodus / Details` bleibt erhalten.
- Einzelbuttons fuer Audio transkribieren und Strukturvorschlag erzeugen bleiben verfuegbar.
- Rohtranskript, bereinigter Text, Korrekturen, freie Texteingabe und letzte Aufnahmen bleiben pruefbar.
- Freie Eingabe ist unter `Text statt Aufnahme eingeben` erreichbar.
- Damit bleibt der Ablauf nachvollziehbar, falls Transkription oder KI-Vorschlag kontrolliert werden muessen.

Datenschutz und KI:

- KI-Auswertung startet nicht heimlich im Hintergrund.
- Der Standardablauf startet die Auswertung erst durch den bewussten Klick `Stoppen & auswerten`.
- Ohne aktive KI-Konfiguration bleibt der lokale regelbasierte Fallback verfuegbar.
- Es werden keine API-Schluessel in Code, Konfiguration oder Logs gespeichert.

Geaenderte Dateien:

- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\static\styles.css`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7e_ui.py`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Erfolgreich geprueft:

- JavaScript-Syntax fuer `app.js`
- MVP-7e-UI-Regressionscheck
- MVP-7d-OpenAI-Mocktest
- MVP-7c-Kompatibilitaetstest
- Server-Smoke-Test mit echten Projektdaten
- Projekt kann geladen werden
- Sprache/Text-Seite zeigt den Baustellenmodus
- `Expertenmodus / Details` ist einklappbar
- kein API-Schluessel in Code oder Konfiguration gefunden
- `plans.json` blieb unveraendert

Bekannte Grenzen:

- Direkte Mikrofonaufnahme benoetigt auf dem Handy weiterhin HTTPS bzw. einen sicheren Browser-Kontext.
- Der lokale Fallback kann nur einfache Strukturvorschlaege erzeugen und ersetzt keine echte Transkription/KI.
- Rohtranskript, bereinigter Text und Strukturvorschlag muessen fachlich weiterhin geprueft werden.

## MVP 7e.2 - Kritischer Fix Rohtranskription

Stand: 23.06.2026

Anlass:

- Im echten Handy-Test wurde eine Estrich-/Reinigungsansage fachlich in Richtung WDVS/Fensteranschluss verfremdet.
- Ursache war ein zu starker Kontext im Transkriptionsprompt: protected terms, Stammdaten, Glossar und Fachhinweisnaehe konnten bereits das Rohtranskript beeinflussen.

Umgesetzt:

- Rohtranskription ist jetzt bewusst kontextarm.
- Der Transkriptionsprompt enthaelt keine Projektstammdaten, keine Fachhinweis-Titel, keine WDVS-/Fenster-/Putz-Begriffslisten und keine alten Vorschlaege mehr.
- Erlaubt bleibt nur ein neutraler Hinweis: Baustellennotiz moeglichst wortnah transkribieren, nicht uebersetzen, nicht zusammenfassen, nicht strukturieren.
- Baustellen-Glossar, protected terms, Projektstammdaten und Fachhinweis-Titel werden erst nach dem Rohtranskript fuer Bereinigung und Strukturierung verwendet.
- Die Bereinigung wurde entschaerft: Wenn der Rohtext Estrichvorbereitung oder Reinigung nennt, darf daraus kein WDVS-/Fensteranschluss-Thema entstehen.
- Die Strukturierung wurde entschaerft: Fachbegriffe und Fachhinweise duerfen nur verwendet werden, wenn sie im aktuellen Text erkennbar sind.
- `original_text` aus einem alten Freitextfeld ueberlagert nicht mehr das aktuelle Rohtranskript.
- Bei unsicherem Transkript stoppt der automatische Baustellenmodus vor der Strukturierung und zeigt: `Transkript unsicher. Bitte Aufnahme anhoeren oder Text manuell korrigieren.`
- Die mobile Detailanzeige zeigt zur ausgewerteten Aufnahme `audio_id`, Dateiname, Dateigroesse, Dauer und Zeitstempel.

Diagnose ohne Geheimnisse:

- Serverlog enthaelt `request_id`, `project_id`, `audio_id`, Dateiname, Dateigroesse, Dauer und je maximal 120 Zeichen Rohtranskript/Bereinigung/Strukturinput.
- Es werden keine API-Schluessel und keine langen Volltexte geloggt.

Geaenderte Dateien:

- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\openai_provider.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7d_openai.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7e_ui.py`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Erfolgreich geprueft:

- Python-Syntax fuer Server, Provider und Tests
- JavaScript-Syntax fuer mobile App
- MVP-7d/7e.2-OpenAI-Mocktest
- Estrich/Reinigung bleibt Estrich/Reinigung und wird nicht WDVS/Fensteranschluss
- WDVS/Kreuzfugen/Armierungsgewebe bleiben im WDVS-Test erhalten
- zwei Aufnahmen nacheinander bleiben getrennt
- alter Freitext mit WDVS ueberlagert keine neue Estrich-Aufnahme
- englische Bereinigung wird verworfen
- MVP-7c-Kompatibilitaetstest
- MVP-7e-UI-Regressionscheck
- kein API-Schluesselmuster gefunden
- `plans.json` blieb unveraendert

Bekannte Grenze:

- Auch eine kontextarme Transkription kann bei undeutlicher Aufnahme falsch liegen. In diesem Fall muss der Nutzer die Aufnahme anhoeren oder den Text manuell korrigieren, bevor strukturiert und gespeichert wird.

## MVP 7f - Mobile Projektanlage

Stand: 23.06.2026

Umgesetzt:

- Mobile Projektliste zeigt einen sichtbaren Button `+ Neues Projekt`.
- Formular `Neues Projekt` mit:
  - Projektname als Pflichtfeld
  - Adresse / Ort
  - Bauherr / Kunde
  - Projekttyp: MFH, RH, EFH, Sanierung, Sonstiges
  - Notiz
- Neuer Endpunkt `POST /api/projects`.
- Nach erfolgreicher Anlage wird das neue Projekt direkt geoeffnet und das Projektdashboard geladen.
- Doppelte Projektnamen werden nicht blockiert; die technische `project_id` ist eindeutig.

Angelegte Datenstruktur je Projekt:

```text
D:\Kai_BauSuite\daten\projekte\<project-id>\
  activities.json
  observations.json
  pins.json
  photos.json
  audio.json
  reports.json
  mail_drafts.json
  plaene\plans.json
  fotos\
  audio\
  reports\
```

Alle JSON-Dateien werden als leere Listen initialisiert, soweit das jeweilige Modul sie erwartet.

Geaenderte Dateien:

- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7f_project_create.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7e_ui.py`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Erfolgreich geprueft:

- Python-Syntax fuer Server und Tests
- JavaScript-Syntax fuer mobile App
- MVP-7f-Projektanlage-Test mit temporaeren Daten
- Projekt erscheint in Projektliste
- neues Projekt kann geladen werden
- leere Planliste funktioniert ohne Fehler
- erste Aktivitaet und erste Beobachtung koennen im neuen Projekt angelegt werden
- bestehende MVP-7c/7d/7e-Tests bleiben erfolgreich
- kein API-Schluesselmuster gefunden
- `plans.json` des bestehenden Projekts `3 RH Kronwinkler` blieb unveraendert
- lesender Smoke-Test gegen echte Daten: Projektliste, `3 RH Kronwinkler` und mobile Oberflaeche laden

Hinweise:

- Es wurde kein echtes Testprojekt in `D:\Kai_BauSuite\daten` angelegt.
- Der Projektanlage-Test lief bewusst in einem temporaeren Testdatenordner.
- Bestehende Projekte, Planversionierung, Pins, Fotos, Mailentwuerfe und PDF-Berichte wurden nicht geaendert.

Naechster sinnvoller Schritt:

- Mobile Pflege von Stammdaten/Firmen/Gewerken vorbereiten, falls Projekte auch unterwegs komplett angelegt werden sollen.

## MVP 7g.1 - Harte Worttreue

Stand: 01.07.2026

Umgesetzt:

- Baustellen-Glossar auf Version `MVP 7g.1` erweitert.
- Neue geschützte Begriffe: unter anderem `Ortsbegehung`, `Erdaushub`, `Nachbarbaustelle` und `Schreiben an`.
- Neue `suspect_terms`:
  - `Aufspeckierung` mit kontextabhängigem Vorschlag `Ortsbegehung`
  - `Erdaufwurf` mit kontextabhängigem Vorschlag `Erdaushub`
  - `Pübenmessung` und `Baumagik` als ungeklärte Begriffe
- Verdächtige Begriffe erzeugen sichtbare Warnungen und nachvollziehbare Korrektureinträge.
- Ungeklärte Begriffe stoppen die automatische Strukturierung.
- Strukturierungs-Prompt verbietet Sinnumkehr, erfundene Verweigerung, Schuld, Ursache, Dringlichkeit und Beteiligte.
- Strukturierte Felder erhalten `field_sources` mit Textausschnitten aus dem aktuellen Transkript.
- Server prüft Feldquellen und definierte Halluzinationsmuster; bei Verstoß wird der KI-Vorschlag verworfen.
- Mobile Vorschau zeigt kritische Warnungen sofort sowie Korrekturen und Feldquellen im Detailbereich.
- Speicherung bleibt an `Übernehmen (geprüft)` gebunden.

Beispielschutz:

- `Ortsbegehung` bleibt `Ortsbegehung`.
- `Erdaushub` bleibt `Erdaushub`.
- `Schreiben an den Unternehmer der Nachbarbaustelle` wird nicht zu `Schreiben vom Unternehmer`.
- Nicht gesprochene Wörter wie `verweigert` oder `dringend` werden als unbelegt erkannt.

Geänderte Dateien:

- `D:\Kai_BauSuite\daten\fachwissen\baustellen_glossar.json`
- `D:\Kai_BauSuite\mobile\openai_provider.py`
- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7g1_word_fidelity.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7e_ui.py`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Sicherheitsgrenzen:

- keine automatische Speicherung
- kein API-Key in Code oder Konfiguration
- keine Änderung an Planversionierung, Pins, Fotos, Mail oder PDF
- `plans.json` bleibt unverändert

## MVP 7g.2 - Notbremse gegen Fantasieausgaben

Stand: 01.07.2026

Umgesetzt:

- `Unterminierung` und `freier Grund` als zusätzliche `suspect_terms`.
- Harte API-Notbremse, wenn unklare Begriffe im bereinigten Text verbleiben.
- Blockierte Antwort mit `structure_blocked = true` und ohne sichere Strukturfelder.
- Mobile Warnansicht `Vorschlag unsicher – bitte Text korrigieren`.
- Rohtranskript und bereinigter Text bleiben bei der Warnung prominent sichtbar.
- Button `Text korrigieren`.
- `Trotzdem als Entwurf anzeigen` nur im aufklappbaren Expertenmodus.
- Serverseitige Pflichtprüfung der Feldquellen.
- Wortmengenprüfung für Titel und Beschreibung.
- Prüfung auf unbelegte Begriffe, Sinnumkehr und bekannte Fantasiewörter.
- Deterministischer Fallback übernimmt ausschließlich den bereinigten Text und glättet nur Leerraum/Satzzeichen.
- Blockierte Vorschläge können nicht gespeichert werden.
- Typwahl ist zurückhaltender; `Mangel` wird nicht mehr allein aus einer allgemeinen Aufgabe abgeleitet.

Geänderte Dateien:

- `D:\Kai_BauSuite\daten\fachwissen\baustellen_glossar.json`
- `D:\Kai_BauSuite\mobile\openai_provider.py`
- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7g1_word_fidelity.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7g2_emergency_brake.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7d_openai.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7e_ui.py`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Erfolgreich geprüft:

- Fantasieausgabe `freier Grund zur Unterminierung der Baustelle` wird verworfen.
- Nicht belegtes `dringend` wird erkannt.
- `Erdaufwurf` blockiert die normale Strukturierung, solange keine eindeutige Korrektur erfolgt.
- Kontextabhängige Korrektur `Erdaufwurf` zu `Erdaushub` bleibt möglich.
- Wortnaher Fallback enthält Erdaushub, Bauschutt, Baugeräte, Schreiben an die Nachbarbaustelle und Frist, aber keine erfundenen Inhalte.
- API blockiert unsicheren Standardvorschlag.
- Expertenentwurf wird nur nach expliziter Anforderung erzeugt.
- bestehende MVP-7c-, MVP-7d-, MVP-7e- und MVP-7f-Regressionstests bleiben erfolgreich.
- keine automatische Speicherung.
- kein API-Key in Code oder Konfiguration.
- `plans.json` bleibt unverändert.

## MVP 7g.3 - Belegpflicht statt Wortverbote

Stand: 01.07.2026

Umgesetzt:

- Pauschale Verbotsprüfung durch semantische Belegprüfung ersetzt.
- Gesprochene Absichten bleiben erhalten.
- `description_de` wird im Standardfall wortnah aus dem bereinigten Text übernommen.
- Neue Beleggruppen für:
  - Räumung / Freimachen des Baufeldes
  - Veranlassen einer gesprochenen Handlung
  - Kontaktieren / Informieren / Schreiben schicken
  - ausdrückliche Dringlichkeit
  - ausdrücklich genannte Verweigerung oder Ablehnung
- Richtungsschutz für `Schreiben an` gegenüber `Schreiben von` oder `Unternehmer erstellt`.
- Fristschutz für `Frist bis Freitag`.
- Nicht belegte Formulierungen wie `bis zum nächsten Beitrag` werden verworfen.
- KI-Beschreibung mit unbelegten Ergänzungen wird vollständig durch den bereinigten Text ersetzt.
- Titel darf nur mit belegten Bedeutungen verdichten.
- `suspect_terms` bleiben für tatsächliche Unsinns- oder unklare Begriffe aktiv.

Geänderte Dateien:

- `D:\Kai_BauSuite\mobile\openai_provider.py`
- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7g1_word_fidelity.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7g2_emergency_brake.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7g3_evidence_grounding.py`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Erfolgreich geprüft:

- gesprochene `Räumung des Baufeldes veranlassen` bleibt zulässig
- `Räumung` ohne Beleg wird blockiert
- `Räumung` aus `Baufeld freimachen/freiräumen` ist zulässig
- `Nachbarbaustelle informieren` aus belegtem `Schreiben an ... schicken` ist zulässig
- `dringend` ist bei gesprochenem `sofort` zulässig, sonst nicht
- `verweigert` benötigt Verweigerungs-/Ablehnungsbeleg
- `Schreiben an den Unternehmer` wird nicht zu `vom Unternehmer` oder `Unternehmer erstellt`
- `Frist bis Freitag` bleibt erhalten
- `bis zum nächsten Beitrag` wird verworfen
- Fallbackbeschreibung enthält nur den bereinigten Text
- MVP-7g.1-, MVP-7g.2-, MVP-7d-, MVP-7e-, MVP-7c- und MVP-7f-Tests bleiben erfolgreich
- keine automatische Speicherung
- kein API-Key in Code oder Konfiguration
- `plans.json` unverändert

## MVP 7i - Audioverwaltung und Sammelprotokoll

Stand: 02.07.2026

Umgesetzt:

- Soft-Delete für Audioaufnahmen über `POST /api/audio/delete`
- physische Audiodatei bleibt erhalten
- archivierte Aufnahmen werden in normalen Listen ausgeblendet
- Warnung bei bereits einer Beobachtung oder einem Protokoll zugeordnetem Audio
- Metadaten `deleted`, `deleted_at`, `deleted_reason`, `deleted_by`
- Mehrfachauswahl vorhandener Aufnahmen
- automatische Transkription noch nicht transkribierter Auswahl
- editierbare Sammelprotokoll-Vorschau
- Speicherung erst nach Bestätigung
- projektbezogene Ablage in `protocols.json`
- Gruppierung nur bei ausdrücklich diktiertem Gewerk
- Rückfallgruppe `Ohne sichere Gewerkzuordnung`
- Diktat-first bleibt verbindlich; keine freie KI-Protokollprosa

Neue Endpunkte:

- `POST /api/audio/delete`
- `POST /api/projects/<project_id>/protocols/preview`
- `POST /api/projects/<project_id>/protocols`

Geänderte Dateien:

- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\static\styles.css`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7i_audio_protocols.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7e_ui.py`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Erfolgreich geprüft:

- Soft-Delete blendet die Aufnahme aus und erhält die Audiodatei
- zugeordnete Aufnahme erzeugt einen verständlichen Archivierungshinweis
- WDVS, Estrich und Erdarbeiten werden getrennt gruppiert
- Aufnahme ohne sichere Gewerkangabe bleibt unzugeordnet
- gespeichertes Protokoll behält Quell-Audio-IDs und Diktattext
- MVP-7h-, MVP-7g-, MVP-7d-, MVP-7e-, MVP-7c- und MVP-7f-Regressionen erfolgreich
- keine echten Projektdaten im Test verändert
- kein API-Key in Code oder Konfiguration
- `plans.json` unverändert

Bekannte Einschränkungen / nächster Schritt:

- Protokoll-PDF, Export und Mailverteilung sind noch nicht umgesetzt.
- Archivierte Audiodateien werden bewusst nicht physisch gelöscht.

## MVP 7h - Diktat-first

Stand: 01.07.2026

Umgesetzt:

- Beschreibung stammt verbindlich aus dem bereinigten Diktat.
- Ohne bereinigten Text wird das Rohtranskript verwendet.
- Keine freie KI-Prosa mehr als Standardbeschreibung.
- OpenAI-Strukturschema enthält kein `description_de` mehr.
- KI extrahiert nur strukturierte Felder, Quellen, Confidence und Warnungen.
- Unerwartete Provider-Beschreibung wird als nicht verwendete `ai_description_alternative` behandelt.
- Vorschau zeigt `Beschreibung / Diktattext` und den Herkunftshinweis.
- Feld-Confidence und optionale KI-Alternative sind im Detailbereich sichtbar.
- Deutsch ist im Baustellenmodus vorausgewählt.
- Albanisch, gemischt und automatische Erkennung bleiben im Expertenmodus wählbar.
- Transkriptionsmodell auf `gpt-4o-transcribe` umgestellt.
- Technischer Strukturstatus und fachlicher Beobachtungsstatus sind getrennt.

Neue Speichermetadaten:

- `description_source`
- `ai_field_extraction_used`
- `ai_description_used`
- `field_sources`
- `field_confidence`
- `ai_warnings`
- `user_final_values`
- `changed_fields`

Geänderte Dateien:

- `D:\Kai_BauSuite\config\settings.json`
- `D:\Kai_BauSuite\mobile\openai_provider.py`
- `D:\Kai_BauSuite\mobile\server.py`
- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7h_dictation_first.py`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7e_ui.py`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

Erfolgreich geprüft:

- freie KI-Beschreibung mit `dringend`, `Unterminierung` und `verweigert` wird nicht übernommen
- `description_de` entspricht dem vollständigen bereinigten Diktat
- Titel, Typ, Frist, Feldquellen und Confidence bleiben erhalten
- Diktat-first-Metadaten werden in einer Beobachtung gespeichert
- Feldextraktionsschema enthält keine KI-Beschreibung
- Nachbarbaustellen-, Estrich- und WDVS-Regressionsfälle bleiben erfolgreich
- Baustellenmodus und Expertenmodus funktionieren
- mobile Projektanlage funktioniert
- keine automatische Speicherung
- kein API-Key in Code oder Konfiguration
- `plans.json` unverändert

## v113 – Hotfix Baustellenkontrolle / Bautagesbericht / Berichtsdaten

### Behoben
- Bautagesbericht kann die Projektadresse aus den Stammdaten bzw. Projektdaten übernehmen.
- Wenn keine Projektadresse vorhanden ist, erscheint eine verständliche Meldung statt eines stillen Fehlers.
- Baustellenkontroll-Berichte enthalten wieder dokumentierte Feststellungen, auch wenn diese über Pin, Planbezug und Foto entstanden sind.
- Pin-Notizen werden mit der zugehörigen Feststellung synchronisiert, damit Bemerkungen nicht doppelt diktiert werden müssen.
- Pin-Fotos werden in der Baustellenkontroll-Berichtsausgabe berücksichtigt.

### Nicht verändert
- Bewehrungsabnahme und deren A4-Berichtspfad bleiben unverändert.
- Projektpläne, `plans.json`, Planviewer, Pinspeicher und IndexedDB-Stores wurden nicht umgebaut.
- Keine API-Schlüssel, keine Dropbox-Logik und keine Datenmigration wurden eingeführt.

### Technischer Stand
- App-Version: v113
- Cache: v113
- Offizieller PDF-Weg bleibt: A4-Berichtsvorschau → Druckdialog → Als PDF speichern.
- Die gemeinsame PDF-/Berichtlogik ist vorbereitet, aber noch nicht vollständig als separater BauSuite-Report-Core ausgelagert.

### Prüfpunkte
- Syntaxcheck `app.js`
- Build `dist`
- Syntaxcheck `dist/app.js`
- ZIP-Erstellung
- `plans.json` unverändert

## v114 – Hotfix Adresse / Plan-Pin im Baustellenkontroll-Bericht

### Behoben
- Projektadresse im Bautagesbericht wird mit sauberer Trennung von Straße, Hausnummer, PLZ und Ort ausgegeben.
- Baustellenkontroll-Berichte zeigen nun Planseiten mit markierten Pins, wenn eine Feststellung über einen Planpin dokumentiert wurde.
- Zentrale Projektpläne werden bei der Berichtsausgabe der Baustellenkontrolle berücksichtigt.
- Wenn ein Plan zu einem Pin nicht geladen werden kann, erscheint eine Diagnose-Warnung im Bericht statt eines leeren Bereichs.

### Nicht verändert
- plans.json wurde nicht geändert.
- Keine IndexedDB-Migration.
- Keine Änderung an Pin-Koordinaten, Planviewer oder Bewehrungsabnahme-Berichtspfad.

### Prüfpunkte
- Syntaxcheck app.js
- Build dist
- Syntaxcheck dist/app.js
- ZIP-Erstellung
