# Kai BauSuite Architektur

Stand: v100-Vorbereitung, Dokumentation ohne App-Refaktorierung.

Dieses Dokument beschreibt die Zielarchitektur fuer eine spaetere Kai BauSuite. Der bestehende Kai BewehrungsCheck bleibt dabei das erste produktiv nutzbare Spezialmodul. Die laufende App-Struktur, Feldnamen und gespeicherten Daten werden durch diese Architektur-Dokumentation nicht migriert oder umbenannt.

## Leitprinzipien

- Der BewehrungsCheck bleibt stabil und lauffaehig.
- Bestehende lokale Daten duerfen nicht durch Architekturvorbereitung veraendert werden.
- Der A4-Berichtspfad bleibt der offizielle PDF-Weg.
- Gemeinsame Baustellenfunktionen werden schrittweise als BauSuite-Kern gedacht, aber erst spaeter technisch herausgeloest.
- Neue Module sollen moeglichst auf gemeinsame Projekt-, Plan-, Foto-, Pin-, Beteiligten- und Berichtsdaten aufbauen.

## 1. Gemeinsamer Kern

Der gemeinsame Kern der Kai BauSuite soll spaeter die Funktionen enthalten, die in mehreren Baustellenmodulen wiederverwendet werden koennen:

- Projekte
- Beteiligte / Stammdaten
- Plaene
- Pins / Planbezug
- Fotos und andere Anhaenge
- Spracheingabe
- Feststellungen / Pruefpunkte
- Nachbegehungen / Nachkontrollen
- Aufgaben / offene Punkte
- Unterschriften
- Berichtsdaten und Berichtsvorlagen
- Backup/Restore

Der Kern soll keine fachliche Bewertung erzwingen. Fachlogik, Begriffe, Statuslogik und Berichtsinhalte bleiben Aufgabe des jeweiligen Moduls.

## 2. Modul BewehrungsCheck

Der bestehende Kai BewehrungsCheck ist das erste Spezialmodul der BauSuite.

Fachlicher Umfang:

- Bewehrungsabnahmen
- Pruefpunkte fuer Bewehrung
- Pruefstellen / Stichproben
- Uebergreifungslaengen-Pruefung
- Betonagefreigabe und Ergebnisbewertung
- Plananlagen mit Bewehrungspins
- Fotodokumentation
- Nachbegehung / Nachkontrolle offener Punkte
- Unterschriften / Kenntnisnahme

Das Modul nutzt bereits viele spaetere Kernfunktionen: Projekte, Plaene, Pins, Fotos, Spracheingabe, Nachbegehungen, Stammdaten, Unterschriften und A4-Bericht.

## 3. Modul Baustellenprotokoll

Ein spaeteres Modul Baustellenprotokoll soll allgemeiner sein als der BewehrungsCheck.

Moeglicher Umfang:

- allgemeine Baustellenbegehungen
- Feststellungen
- Maengel
- Aufgaben
- Gewerke
- Zustaendigkeiten
- Fristen
- Fotos
- Planpins
- Nachverfolgung
- kurze Berichte / Protokolle

Dieses Modul wuerde denselben Kern fuer Projekte, Beteiligte, Plaene, Pins, Fotos, Aufgaben, Nachbegehungen und Berichte nutzen, aber mit neutraleren Begriffen als im BewehrungsCheck.

## 4. Spaetere Module

Weitere moegliche Spezialmodule:

- Maengelmanagement
- Abnahmen
- Fotodokumentation
- Tagesberichte
- Aufmass / Regiebericht
- PDF-Server
- Benutzer / Teams / Sync

Diese Module sollten langfristig keine eigene Projekt-, Foto-, Plan- oder Backup-Logik duplizieren, sondern auf den BauSuite-Kern aufsetzen.

## Gemeinsames Datenmodell, Zielbild

Das folgende Modell ist ein neutrales Zielbild. Es ersetzt nicht automatisch die bestehenden BewehrungsCheck-Felder.

### Project

Ein Projekt ist der gemeinsame Container fuer Baustellendaten.

Typische Felder:

- id
- name
- address
- clientId / clientSnapshot
- contractorId / contractorSnapshot
- participants
- protocols[]
- createdAt / updatedAt

### Protocol

Ein Protocol beschreibt einen Bericht, eine Abnahme, eine Begehung oder einen Tagesbericht.

Typische Felder:

- id
- projectId
- kind
- title
- dateTime
- location / area
- participants
- items[]
- plans[]
- pins[]
- attachments[]
- signatures[]
- result
- parentProtocolId optional
- createdAt / updatedAt

Zukuenftige `protocol.kind`-Werte:

- `rebar-inspection`
- `site-report`
- `defect-walkthrough`
- `acceptance`
- `daily-report`

### ProtocolItem

Ein ProtocolItem ist die neutrale Form einer Pruefstelle, Feststellung, Aufgabe oder Notiz.

Typische Felder:

- id
- protocolId
- type
- title
- location
- trade / category optional
- status
- note
- dueDate optional
- responsibleParticipantId optional
- planReferences[]
- attachments[]
- sourceItemId optional
- createdAt / updatedAt

Zukuenftige `item.type`-Werte:

- `check`
- `finding`
- `defect`
- `task`
- `note`

Zukuenftige `item.status`-Werte:

- `ok`
- `defect`
- `condition`
- `open`
- `in_progress`
- `done`
- `not_checkable`

### Attachment / Photo

Anhaenge speichern Foto- und Dateiverweise. Bilddaten koennen wie bisher in IndexedDB liegen.

Typische Felder:

- id
- projectId
- protocolId
- itemId optional
- pinId optional
- fileName
- fileType
- blob / storageRef
- caption / note
- createdAt

### Plan

Planunterlagen sind projekt- oder protokollbezogene Dokumente.

Typische Felder:

- id
- projectId
- protocolId optional
- fileName
- fileType
- planNumber
- title
- planDate
- index
- status
- pageCount
- blob / storageRef

### Pin

Pins sind Planreferenzen und koennen spaeter mehrfach auf Plaenen platziert sein.

Typische Felder:

- id
- projectId
- protocolId
- itemId optional
- planId
- pageNumber
- xPercent
- yPercent
- placements[] optional
- label
- note
- status
- attachments[]

### Signature

Unterschriften bestaetigen Kenntnisnahme oder fachliche Abnahme im jeweiligen Modulkontext.

Typische Felder:

- id
- protocolId
- name
- company
- role
- category
- note
- signedAt
- signatureData

### Participant

Beteiligte koennen Firmen, Personen, Pruefer, Verantwortliche oder Auftraggeber sein.

Typische Felder:

- id
- type
- name
- company
- role
- address
- phone
- email
- snapshot

### MasterData

Stammdaten liefern wiederverwendbare Vorschlaege fuer Projekte und Protokolle.

Typische Bereiche:

- Firmen
- Personen / eigene Abnehmende
- Pruefingenieure / Pruefer
- Gewerke
- Bauteile
- Geschosse
- Abnahmearten
- Standardbereiche / Achsen
- Rollen

## Mapping BewehrungsCheck auf BauSuite-Kern

| BewehrungsCheck heute | BauSuite-Zielmodell | Hinweis |
| --- | --- | --- |
| Projekt | Project | bleibt gemeinsamer Container |
| Abnahme / Protokoll | Protocol | spaeter `protocol.kind = "rebar-inspection"` |
| Nachbegehung / Nachkontrolle | Follow-up Protocol | `parentProtocolId` verweist auf Ursprung |
| Checkpunkt | ProtocolItem type `check` | fachlicher Katalog bleibt im Modul |
| Pruefstelle / Stichprobe | ProtocolItem | konkrete dokumentierte Stelle |
| Mangel / Auflage | ProtocolItem status / Finding | Statuslogik bleibt modulbezogen |
| Pin / Planmarkierung | Pin / PlanReference | Planbezug als Kernfunktion |
| Planunterlage | Plan | Blob bleibt in IndexedDB / Storage |
| Foto | Attachment / Photo | mit itemId, pinId oder protocolId verknuepft |
| Uebersichtsfoto | Attachment / Photo | protocolbezogen, ohne Pin |
| Unterschrift | Signature | gemeinsame Signaturstruktur |
| Ergebnis | ProtocolResult | Modul definiert Ergebnisoptionen |
| A4-Bericht | ReportTemplate | spaeter pro Modul auswählbar |
| Backup/Restore | Core Export/Import | muss alle Kernobjekte enthalten |

## Migrationsregel

Vor einer spaeteren technischen Migration gilt:

- keine bestehenden Felder in der laufenden App umbenennen
- keine lokale IndexedDB-Struktur ohne Backup-Pfad veraendern
- alte BewehrungsCheck-Protokolle weiter lesbar halten
- zuerst Export/Import und Testdaten sichern
- fachliche Berichte vor und nach Migration vergleichen

## Naechste empfohlene Richtung

Der naechste groessere Architekturschritt sollte kein Client-Refaktor sein, sondern ein risikoarmer PDF-Server-MVP:

- gleicher A4-Bericht als serverseitig gerenderte PDF
- keine Reaktivierung des alten Direkt-PDF-Renderers als Hauptweg
- klare Trennung zwischen PWA-Daten und optionalem Server-Export

Danach kann der gemeinsame BauSuite-Kern schrittweise aus dem vorhandenen BewehrungsCheck herausmodelliert werden.

## Dropbox / Projektplanablage (v104 Teststand)

Die BauSuite bereitet Dropbox als spätere Planablage vor, ohne eine automatische Synchronisierung vorzutuschen.

- Globale Einstellung: Dropbox-Basisordner sowie Standard-Unterordner für Pläne, Fotos und Berichte.
- Projekt: projektbezogener Dropbox-Ordner, optionaler Dropbox-Link und Unterordner für Pläne/Berichte/Fotos.
- Plan: Quelle `uploaded`, `dropbox_path` oder `dropbox_link`, Dropbox-Pfad, Shared Link, Dateiname, File-ID, Revision, manueller Stand und Sync-Status.
- Offline-Grundsatz: Für die Baustelle bleibt eine lokale IndexedDB-Kopie von Plänen/Fotos wichtig.
- Sptere Erweiterung: Dropbox OAuth/API, Projektordner verbinden, Planstnde erkennen, lokale Offline-Kopie aktualisieren.

## Stammdaten-Struktur ab v106

Die Stammdaten werden in der Oberfläche in Untermenüs geführt, ohne bestehende Speicherstrukturen umzubenennen oder Daten zu migrieren. Die Gliederung bereitet den BauSuite-Kern vor:

- Firmen
- Personen / Ansprechpartner
- Gewerke
- Rollen / Funktionen
- Prüfer / Prüfingenieure
- Standardwerte
- Standardtexte
- Planablage / Dropbox

Diese Ordnung ist eine UI-Struktur. Das bestehende BewehrungsCheck-Datenmodell bleibt unverändert lauffähig.

## v108 Vorbereitung: Projektpläne als gemeinsamer Baustein

Projektpläne werden als BauSuite-Kernfunktion behandelt. Fachmodule sollen Pläne nicht isoliert besitzen, sondern projektbezogen nutzen können. Für den v108-Teststand werden vorhandene Planunterlagen aus den Bewehrungsabnahmen eines Projekts in der Projektzentrale zusammengeführt und von der Baustellenkontrolle als Markierungsgrundlage genutzt.

Baustellenkontroll-Pins bleiben eigenständige Pin-Objekte und werden über `module: "site-control"`, `protocolId` und `itemId` fachlich von Bewehrungs-Pins getrennt. Damit bleibt der bestehende BewehrungsCheck ohne Migration lauffähig, während der gemeinsame Kern für Planbezug, Fotos, Pins und Berichte vorbereitet wird.

## v109 Integration: Projektpl?ne, Dropbox und Hilfsdaten

Die Projektplananzeige wird zentral dedupliziert, ohne Pl?ne aus bestehenden Protokollen zu l?schen oder Planbez?ge zu migrieren. Fachmodule greifen auf die deduplizierte Projektplan-Auswahl zu, w?hrend ihre eigenen Daten unver?ndert bleiben.

Dropbox bleibt im Teststand vorbereitet: Pfade und Links k?nnen gespeichert werden, automatische Synchronisierung wird sp?ter als eigene Anbindung erg?nzt. Globale Stammdaten bleiben die Quelle f?r Firmen, Personen, Zust?ndigkeiten und Gewerke. Wetterdaten werden als Protokoll-Hilfsfunktion verstanden und nur als Text im aktuellen Protokoll gespeichert.

