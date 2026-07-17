# Kai BauSuite - Technische Dokumentation

Stand: 2026-06-22

Aktuelle Version: **MVP 7b**

Quelle: `D:\Kai_BauSuite\dokumentation\anforderungen\00_vision.md`

## Aktueller Implementierungsstand: MVP 7b

MVP 2 ist als lokale Windows-App mit PowerShell 5.1 und WinForms umgesetzt. Der stabile Kern `Projekt -> Aktivität -> Beobachtung`, die Stammdaten aus MVP 1.1 und die neue projektbezogene Planverwaltung arbeiten auf einer gemeinsamen lokalen JSON-Datenbasis.

### Start

Normaler Start ohne sichtbares Konsolenfenster:

```text
D:\Kai_BauSuite\baustelle\Start-KaiBauSuite-ohne-Konsole.vbs
```

Debug-Start mit sichtbarer Konsole:

```text
D:\Kai_BauSuite\baustelle\Start-KaiBauSuite.cmd
```

### Implementierte Module

- Projekte anlegen, öffnen, bearbeiten und lokal speichern
- Aktivitäten anlegen, bearbeiten, löschen und lokal speichern
- Beobachtungen anlegen, bearbeiten, löschen und filtern
- Stammdaten Gewerke, Firmen und Verantwortliche verwalten
- Pläne einem Projekt hinzufügen, bearbeiten, aktivieren/deaktivieren und auf dem PC öffnen
- PDF-, PNG-, JPG- und JPEG-Dateien in den Projektordner kopieren
- Planliste nach Projektwechsel und App-Neustart erneut laden

### Planverwaltung

Die Windows-Oberfläche öffnet über den Button `Pläne` ein projektbezogenes Planfenster. Ohne ausgewähltes Projekt wird keine Plananlage zugelassen.

Pro Projekt werden Planmetadaten und Dateien hier gespeichert:

```text
<data_root>\projekte\<projekt-id>\plaene\
  plans.json
  <plan-id>.pdf
  <plan-id>.png
  <plan-id>.jpg
  <plan-id>.jpeg
```

Beim aktuellen Standardpfad entspricht dies beispielsweise:

```text
D:\Kai_BauSuite\daten\projekte\PRJ-...\plaene
```

Das Planmodell enthält:

```text
id
projekt_id
planname
geschoss_bereich
dateiname_original
dateiname_lokal
relativer_pfad
dateityp
hinzugefuegt_am
aktualisiert_am
notiz
aktiv
```

In Fachdaten wird nur ein relativer Pfad wie `plaene/PLN-....pdf` gespeichert. Der absolute Dateipfad wird erst zur Laufzeit aus `data_root`, Projekt-ID und relativem Pfad aufgelöst. Pfade außerhalb des Projektordners werden abgewiesen.

Das Öffnen erfolgt in MVP 2 mit dem Windows-Standardprogramm. Ein integrierter PDF- oder Bildviewer ist noch nicht Bestandteil dieses Schritts.

### Technische Dateien und Schichten

```text
D:\Kai_BauSuite\baustelle\KaiBauSuite.ps1
D:\Kai_BauSuite\baustelle\lib\KaiBauSuite.Core.ps1
D:\Kai_BauSuite\baustelle\ui\StammdatenDialog.ps1
D:\Kai_BauSuite\baustelle\ui\PlanDialog.ps1
```

- `KaiBauSuite.ps1`: Windows-Hauptoberfläche und Ablaufsteuerung
- `KaiBauSuite.Core.ps1`: IDs, Konfiguration, JSON-Zugriff, Fachmodelle, Plan-Dateikopie und relative Pfadauflösung
- `StammdatenDialog.ps1`: Windows-spezifische Stammdatenoberfläche
- `PlanDialog.ps1`: Windows-spezifische Planverwaltungsoberfläche und Öffnen mit Standardprogramm

## Ergänzung MVP 2.1: Planimport und Bereiche

MVP 2.1 erweitert die Planverwaltung um strukturierte Geschoss- und Planbereiche sowie einen Mehrfachimport. Bestehende Pläne bleiben kompatibel; ein vorhandener Freitext wie \`Erdgeschoss\` wird weiterhin angezeigt und bei der nächsten Bearbeitung der passenden Stammdaten-ID zugeordnet.

### Geschoss- und Planbereiche

Globale Stammdaten liegen unter:

\`\`\`text
<data_root>\stammdaten\geschosse_bereiche.json
\`\`\`

Jeder Eintrag enthält \`id\`, \`name\`, \`kurzbezeichnung\`, \`typ\`, \`sortierung\`, \`aktiv\`, \`created_at\` und \`updated_at\`. Standardmäßig werden 15 Bereiche von Lageplan bis Sonstiges angelegt. Projektspezifische Ergänzungen liegen unter:

\`\`\`text
<data_root>\projekte\<projekt-id>\plaene\bereiche.json
\`\`\`

Technische IDs bleiben intern. Die Windows-Oberfläche zeigt Name und, sofern vorhanden, Kurzbezeichnung.

### Import

Der Einzelimport verwendet eine Dropdown-Auswahl aus globalen und projektspezifischen Bereichen. Über \`Neuer Bereich\` kann eine wiederverwendbare projektspezifische Ergänzung angelegt werden.

\`Mehrere hinzufügen\` öffnet eine Zuordnungstabelle für PDF, PNG, JPG und JPEG. Pro Datei können Importstatus, Planname, Bereich, neuer projektspezifischer Bereich und Notiz bearbeitet werden. Ein einfacher, UI-unabhängiger Erkennungsdienst schlägt anhand des Dateinamens Bereiche wie Lageplan, UG, EG, nummerierte OG, DG, TG, Schnitt, Ansicht, Detail, Dach und Außenanlagen vor.

Der Batchimport validiert alle ausgewählten Zeilen, kopiert die Dateien und schreibt die Planmetadaten gesammelt. Schlägt der Vorgang fehl, werden bereits kopierte Dateien dieses Vorgangs entfernt. In \`plans.json\` bleiben Dateipfade relativ; neue Datensätze ergänzen optional \`geschoss_bereich_id\`.

### Technische Trennung

\`\`\`text
D:\Kai_BauSuite\baustelle\lib\KaiBauSuite.PlanCore.ps1
D:\Kai_BauSuite\baustelle\ui\PlanDialogV21.ps1
\`\`\`

\`KaiBauSuite.PlanCore.ps1\` enthält Bereichsmodelle, Dateinamenerkennung und Einzel-/Batchimport. \`PlanDialogV21.ps1\` ist ausschließlich die Windows-WinForms-Oberfläche. Damit können dieselben Modelle und Regeln später über eine API für die mobile PWA bereitgestellt werden.

## Ergänzung MVP 2.2: Planversionierung und Historie

Pläne werden logisch über \`plan_group_id\` zu Plan-Gruppen zusammengefasst. Eine Gruppe kann mehrere unveränderlich erhaltene Dateiversionen besitzen. Die Hauptliste zeigt ausschließlich aktive Datensätze mit \`is_current = true\`; ältere Versionen bleiben in \`plans.json\` und im Planordner erhalten.

Ergänzte Planfelder:

\`\`\`text
plan_group_id
version_nr
is_current
archived_at
replaced_by_plan_id
hinzugefuegt_am
aktualisiert_am
\`\`\`

Beim ersten Laden werden bestehende Pläne ohne Versionsfelder migriert. Für jede exakt passende bereinigte Signatur werden die vorhandenen Einträge chronologisch als V1, V2 usw. eingeordnet. Der jüngste Eintrag wird aktuell. Die robuste JSON-Speicherung erzeugt dabei \`plans.json.bak\`; Plandateien werden weder verschoben noch gelöscht.

Die pragmatische Gruppenerkennung verwendet:

- bereinigten Planname
- Geschoss oder Planbereich
- Dateityp

Beim Plannamen werden Groß-/Kleinschreibung, Dateiendung, Unterstriche, Mehrfachleerzeichen und eindeutige Endzusätze wie \`neu\`, \`v2\`, \`rev1\`, \`Stand 2026-06-20\` oder ein Enddatum ignoriert. Nur eine vollständig gleiche Signatur wird automatisch verbunden; unterschiedliche Plannamen im selben Geschoss bleiben getrennt.

Einzel- und Mehrfachimport verwenden dieselbe Fachlogik. Trifft ein Import auf die aktuelle Version einer Gruppe, wird diese mit \`is_current = false\`, \`archived_at\` und \`replaced_by_plan_id\` archiviert. Der neue Datensatz übernimmt die Gruppe, erhöht \`version_nr\` und wird aktuell. Auch zwei passende Dateien innerhalb desselben Mehrfachimports werden in Importreihenfolge versioniert.

Der Button \`Historie\` zeigt für den ausgewählten aktuellen Plan alle Versionen mit Versionsnummer, Importdatum, Originaldateiname, Aktuell- und Aktivstatus. Jede Version kann weiterhin mit dem Windows-Standardprogramm geöffnet werden.

Technische Ergänzungen:

\`\`\`text
D:\Kai_BauSuite\baustelle\lib\KaiBauSuite.PlanCoreV22.ps1
D:\Kai_BauSuite\baustelle\ui\PlanDialogV22.ps1
\`\`\`

Die Gruppierung, Migration und Importversionierung liegen im Fachlogik-Modul und sind nicht an WinForms gekoppelt. Das erleichtert die spätere Bereitstellung über eine API für Windows, PWA, iOS und Android.

### Zentral konfigurierbarer Datenstamm

Die Umgebungskonfiguration liegt unter:

```text
D:\Kai_BauSuite\config\settings.json
```

Aktuelle Standardkonfiguration:

```json
{
  "data_root": "D:\\Kai_BauSuite\\daten",
  "files_root": "D:\\Kai_BauSuite\\dateien"
}
```

Alle Projekt- und Stammdatenzugriffe werden zentral aus `data_root` abgeleitet. Ein späterer Dropbox-Ordner kann als `data_root` eingetragen werden, ohne Fachdaten oder UI-Dateien umzuschreiben. `files_root` ist für spätere getrennte Dateiablagen reserviert; MVP 2 legt Pläne weiterhin projektbezogen unter `data_root` ab.

Dropbox bleibt optional für Backup, Export oder Dateiablage. Dropbox wird nicht als einzige spätere Live-Datenbank vorausgesetzt, und im aktuellen MVP wird keine Dropbox-API verwendet.

### Robuste JSON-Speicherung

JSON wird weiterhin statt SQLite verwendet. Schreibvorgänge erfolgen im Zielordner in drei Schritten:

1. vollständige JSON-Ausgabe in eine temporäre Datei
2. Ersatz der Zieldatei
3. Sicherung des vorherigen Standes als `.bak`

Temporäre Dateien werden bei Erfolg entfernt. Fehler enthalten den vollständigen betroffenen Pfad und werden an die Oberfläche weitergegeben. Diese Strategie reduziert das Risiko teilweise geschriebener JSON-Dateien bei lokalen oder synchronisierten Ordnern.

### Encoding

Die ausgeführten PowerShell-Dateien sind als **UTF-8 mit BOM** gespeichert. JSON wird explizit als UTF-8 gelesen und geschrieben. Deutsche Umlaute werden unter Windows PowerShell 5.1 korrekt dargestellt.

### PC-, Mobile- und Backend-Zielarchitektur

Die Windows-App ist aktuell der Büro-/Admin-Prototyp. Dort werden Projekte und Stammdaten vollständig gepflegt. Eine spätere mobile Baustellenoberfläche nutzt Stammdaten nur als Auswahl und konzentriert sich auf Projekt, Aktivität, Plan, Beobachtung, Status, Frist und Priorität.

Architekturleitlinien:

- Fachlogik und Datenzugriff bleiben außerhalb der WinForms-Dialoge gekapselt.
- Projekt-, Aktivitäts-, Beobachtungs-, Plan- und Stammdaten verwenden stabile IDs.
- Neue Modelle verwenden `created_at`/`updated_at` oder fachlich entsprechende Zeitfelder.
- Medienpfade bleiben relativ.
- Eine spätere API kann dieselben Fachobjekte bereitstellen.
- Stammdaten gelten als zentrale Datenquelle; mobile Clients erhalten sie als Auswahllisten.
- Benutzer, Rollen und Rechte werden erst mit dem Online-Backend ergänzt.

Langfristige Zielrichtung ist ein ständig erreichbares Online-Backend für Windows, iOS, Android und PWA/Web-App. Favorisiert wird Supabase oder ein vergleichbares System mit PostgreSQL, Auth, Storage und API in einer EU-Region, möglichst Frankfurt. Pläne und Fotos sollen später in objektbezogenem Storage liegen; Metadaten und Beziehungen in PostgreSQL.

Der lokale JSON-MVP bleibt zunächst führend und bildet die Migrationsquelle. Es wird noch keine Cloud-Synchronisation, kein Supabase-Projekt und keine Live-API eingerichtet.

### Nicht Bestandteil von MVP 2

- integrierter PDF-/Bildviewer
- Zoom und Verschieben von Plänen
- Pins oder Markierungen
- Fotoaufnahme und Fotoanhänge
- PDF-Berichte
- KI-Funktionen
- Mobile App/PWA
- Benutzerverwaltung und Rechte
- Cloud- oder Dropbox-Synchronisation

### Nächster großer Schritt

**MVP 3: Mobile Handling-Prototyp**

Ein kleiner lokaler Server auf dem Windows-PC stellt im gleichen WLAN eine einfache mobile Web-/PWA-Testoberfläche bereit. Ziel ist frühes Testen der Bedienung auf iOS und Android, bevor Pins, Fotos und Berichte vollständig umgesetzt werden.

MVP-3-Funktionen:

- Projekt auswählen
- Aktivität auswählen oder einfach anlegen
- vorhandene Beobachtungen anzeigen
- einfache Beobachtung erfassen
- Gewerk, Firma und Verantwortliche auswählen
- Status und Priorität setzen
- kurze Beschreibung eingeben

Stammdatenpflege, Berichte, Cloud-Synchronisation, Benutzerrechte und perfekte Optik sind in MVP 3 noch nicht erforderlich.
## 1. Projektueberblick

Kai BauSuite ist eine integrierte Plattform fuer digitale Bauprojektarbeit. Sie verbindet Buero-Cockpit, Baustellen-App, KI-Assistent, Projektdokumentation und spaeter Statikmodule in einer gemeinsamen Anwendung.

Der zentrale Grundsatz lautet:

> Informationen werden nur einmal erfasst und stehen danach ueberall zur Verfuegung.

Die Plattform dokumentiert Baustellenbegehungen und andere projektbezogene Vorgänge digital. Der fachliche Kern wird durch zwei Konzepte gebildet:

- `AKTIVITAET`: etwas, das im Projekt passiert oder von einem Nutzer, System oder KI-Assistenten ausgefuehrt wird.
- `BEOBACHTUNG`: eine fachliche Feststellung, ein offener Punkt oder ein dokumentierter Zustand, der aus Aktivitaeten entsteht oder durch Aktivitaeten veraendert wird.

Aktivitaeten erzeugen oder veraendern Beobachtungen. Dadurch wird Kai BauSuite nicht nur eine Dateiablage, sondern ein nachvollziehbares Projektgedaechtnis.

## 2. Zentrale Fachkonzepte

## 2.1 AKTIVITAET

Eine Aktivitaet beschreibt ein Ereignis, eine Handlung oder einen Kommunikationsvorgang im Projekt. Sie beantwortet die Frage: Was ist passiert?

Aktivitaetstypen:

- Baustellenbegehung
- Foto
- Mail
- Notiz
- Telefonat
- Termin
- KI-Pruefung

Beispiele:

- Eine Baustellenbegehung findet am 12.06.2026 statt.
- Ein Foto wird aufgenommen und auf einem Plan verortet.
- Eine Mail mit Herstellerangaben wird importiert.
- Eine Notiz wird per Spracheingabe erstellt.
- Ein Telefonat mit einer ausfuehrenden Firma wird dokumentiert.
- Ein Termin zur Abnahme wird angelegt.
- Eine KI-Pruefung bewertet einen Sachverhalt anhand von Fotos, Notizen und Quellen.

## 2.2 BEOBACHTUNG

Eine Beobachtung beschreibt eine fachliche Aussage oder einen Zustand im Projekt. Sie beantwortet die Frage: Was wissen wir dadurch?

Beobachtungstypen:

- Dokumentation
- Hinweis
- Frage
- Freigabe
- Mangel
- Aufgabe

Beispiele:

- Dokumentation: Die Bewehrung der Bodenplatte wurde vor Betonage fotografisch dokumentiert.
- Hinweis: Abdichtungsdetail muss mit Herstellerangabe abgeglichen werden.
- Frage: Ist die Ausfuehrung im Sockelbereich normgerecht?
- Freigabe: Ausfuehrung wurde nach Pruefung freigegeben.
- Mangel: Riss im Innenputz im Flur EG.
- Aufgabe: Firma Ausbau GmbH soll bis 26.06.2026 Rueckmeldung geben.

## 2.3 Beziehung zwischen Aktivitaet und Beobachtung

Aktivitaeten sind die Ursache oder Bearbeitungshandlung. Beobachtungen sind das fachliche Ergebnis.

```text
AKTIVITAET -> erzeugt Beobachtung
AKTIVITAET -> veraendert Beobachtung
AKTIVITAET -> bestaetigt Beobachtung
AKTIVITAET -> schliesst Beobachtung
AKTIVITAET -> verweist auf Beobachtung
```

Beispiele:

- Aktivitaet `Foto` erzeugt Beobachtung `Dokumentation`.
- Aktivitaet `Notiz` erzeugt Beobachtung `Hinweis` oder `Frage`.
- Aktivitaet `KI-Pruefung` veraendert Beobachtung `Frage` zu `Freigabe`, `Hinweis`, `Mangel` oder `Aufgabe`.
- Aktivitaet `Telefonat` veraendert Beobachtung `Aufgabe`, indem ein neuer Status oder eine Frist dokumentiert wird.
- Aktivitaet `Baustellenbegehung` fasst mehrere Fotos, Notizen, Pins und daraus entstandene Beobachtungen zusammen.

## 3. Produktziele

### 3.1 Version 1

Version 1 soll eine nutzbare Einzelbenutzer-Anwendung fuer Baustellenbegehungen und Projektdokumentation bereitstellen.

Fokus:

- Projektverwaltung
- PDF-Plaene
- Planpins
- Aktivitaeten fuer Baustellenbegehung, Foto und Notiz
- Beobachtungen fuer Dokumentation, Hinweis, Frage, Mangel und Aufgabe
- PDF-Protokolle aus Aktivitaeten und Beobachtungen

### 3.2 Version 1.5

Version 1.5 erweitert die Anwendung um den Button `Kai pruefen`. Dieser erzeugt eine Aktivitaet vom Typ `KI-Pruefung` und kann Beobachtungen erstellen oder veraendern.

Fokus:

- KI-Pruefung als Aktivitaet
- Online-Recherche
- Quellenverwaltung
- Herstellerangaben
- Normenhinweise
- Ergebnisuebernahme in Beobachtungen

### 3.3 Langfristige Ausbaustufe

Version 2 fuehrt KI-Wissensdatenbank, Baustellenchat, Fotobewertung und Aufgabenmanagement ein.

Fokus:

- Projektwissen aus Aktivitaeten und Beobachtungen durchsuchen
- Baustellenchat mit Projektkontext
- Fotobewertung als KI-gestuetzte Aktivitaet
- Aufgabenmanagement als Beobachtungsworkflow
- automatische Maengelerkennung als Erweiterung

## 4. Zielnutzer

Primaerer Nutzer ist Erich Ruck. Version 1 wird als Einzelbenutzer-System geplant. Mehrbenutzerfaehigkeit, Rollen und Rechte werden strukturell vorbereitet, sind aber kein Muss fuer V1.

## 5. Systemkontext

Kai BauSuite besteht aus folgenden Hauptbereichen:

- Buero-Cockpit fuer Projektuebersicht, Stammdaten, Plaene, Aktivitaeten, Beobachtungen, Protokolle und Auswertungen.
- Baustellen-App fuer mobile Begehungen, Planansicht, Fotoaufnahme, Planpins, Notizen, Beobachtungen und Protokollerstellung.
- KI-Assistent fuer KI-Pruefungen, Recherche, Zusammenfassungen, Fotobewertung und spaetere Wissensdatenbank.
- Projektdokumentation als strukturierte Ablage aller projektbezogenen Informationen.
- Statikmodule als spaetere fachliche Erweiterung.

## 6. Architekturprinzipien

### 6.1 Ereignisbasierte Projektdokumentation

Das System dokumentiert nicht nur Endzustaende, sondern auch den Weg dorthin. Jede relevante Handlung wird als Aktivitaet gespeichert. Fachliche Ergebnisse werden als Beobachtungen gespeichert.

Dadurch bleibt nachvollziehbar:

- wann eine Beobachtung entstanden ist
- durch welche Aktivitaet sie entstanden ist
- welche Aktivitaeten sie spaeter veraendert haben
- welche Fotos, Notizen, Quellen, Plaene oder KI-Pruefungen beteiligt waren

### 6.2 Einmalige Erfassung

Informationen werden einmal erfasst und danach ueber Referenzen genutzt.

Beispiele:

- Ein Foto ist eine Aktivitaet und kann eine Beobachtung `Dokumentation` erzeugen.
- Eine Notiz ist eine Aktivitaet und kann eine Beobachtung `Hinweis`, `Frage`, `Mangel` oder `Aufgabe` erzeugen.
- Eine KI-Pruefung ist eine Aktivitaet und kann bestehende Beobachtungen anreichern, bestaetigen oder in neue Beobachtungen ueberfuehren.
- Ein Protokoll wird aus vorhandenen Aktivitaeten und Beobachtungen erzeugt.

### 6.3 Lokale Datenhoheit in V1

Version 1 kann ohne zentrale Datenbank starten. Die fuehrende Datenquelle ist eine lokale Projektablage mit JSON-Dateien und Medienordnern. Dadurch bleiben die Daten transparent, portabel und offline nutzbar.

### 6.4 Erweiterbarkeit

Die Architektur muss KI, Synchronisation, Quellenverwaltung, Aufgabenmanagement und spaetere Fachmodule aufnehmen koennen. Deshalb erhalten Aktivitaeten und Beobachtungen stabile IDs, Zeitstempel, Versionsfelder, Statuswerte und flexible Referenzen.

## 7. Empfohlener Technologieansatz

### 7.1 Frontend

Empfohlen wird eine responsive Web-App, die auf Desktop und Tablet nutzbar ist. Eine spaetere Verpackung als Desktop- oder Mobile-App bleibt moeglich.

Geeigneter Stack:

- React oder Next.js fuer UI und Routing
- TypeScript fuer robuste Objektmodelle
- Tailwind CSS oder ein leichtes Designsystem fuer konsistente Oberflaechen
- PDF.js fuer Anzeige und Interaktion mit PDF-Plaenen
- Browser File System Access API oder lokale App-Shell fuer lokale Projektordner

### 7.2 Lokale Speicherung

In V1 werden Projektdaten dateibasiert gespeichert:

- JSON fuer strukturierte Daten
- PDF fuer Plaene und Protokollexporte
- JPG/PNG fuer Fotos, Vorschaubilder und Planansichten
- Markdown optional als editierbarer Zwischenstand fuer Protokolle

### 7.3 KI-Schicht

KI-Funktionen werden ueber eine eigene Service-Schicht gekapselt. Die UI ruft nicht direkt externe KI-Dienste auf.

Die KI-Schicht erzeugt Aktivitaeten vom Typ `KI-Pruefung`. Die Ergebnisse werden nicht nur als Text gespeichert, sondern koennen Beobachtungen erzeugen oder veraendern.

## 8. App-Struktur

```text
kai-bausuite/
  baustelle/
    start/
    projekte/
    planansicht/
    aktivitaeten/
    beobachtungen/
    fotos/
    notizen/
    protokolle/
    kai-pruefen/
  buero_cockpit_neu/
    dashboard/
    projekte/
    plaene/
    aktivitaeten/
    beobachtungen/
    protokolle/
    wissen/
    einstellungen/
  daten/
    app.json
    user.json
    projects.json
    projects/
  dokumentation/
```

## 9. Projektablage

```text
D:\Kai_BauSuite\daten\
  app.json
  user.json
  projects.json
  projects\
    PRJ-2026-0001\
      project.json
      activities\
        activities.json
      observations\
        observations.json
      plans\
        plans.json
        plan-001.pdf
        plan-001-preview.png
      pins\
        pins.json
      photos\
        2026-06-12\
          photo-001.jpg
          photo-001-thumb.jpg
      reports\
        reports.json
        report-001.md
        report-001.pdf
      sources\
        sources.json
      ai\
        knowledge.json
      exports\
      archive\
```

Grundregel:

- Fachliche Ereignisse liegen in `activities/activities.json`.
- Fachliche Ergebnisse und offene Punkte liegen in `observations/observations.json`.
- Medien und Dokumente liegen physisch in Projektunterordnern.
- JSON-Objekte referenzieren Dateien ueber relative Pfade.

## 10. Zentrale Datenobjekte

### 10.1 Gemeinsame Felder

Alle Hauptobjekte enthalten:

```json
{
  "id": "string",
  "projectId": "string",
  "createdAt": "ISO-8601 datetime",
  "updatedAt": "ISO-8601 datetime",
  "deleted": false,
  "syncStatus": "local",
  "lastSyncedAt": null,
  "version": 1
}
```

Moegliche Werte fuer `syncStatus`:

- `local`
- `changed`
- `synced`
- `conflict`

### 10.2 ID-Schema

```text
PRJ-2026-0001  Projekt
ACT-2026-0001  Aktivitaet
OBS-2026-0001  Beobachtung
PLN-2026-0001  Plan
PIN-2026-0001  Planpin
SRC-2026-0001  Quelle
PRT-2026-0001  Protokoll
```

Spezialisierte alte IDs wie `FTO`, `NTZ`, `MGL`, `TSK` koennen fuer Migration oder Anzeige weiter verstanden werden, sollen im neuen Kernmodell aber durch `ACT` und `OBS` ersetzt werden.

## 11. Objektmodell

### 11.1 Projekt

Speicherort:

```text
D:\Kai_BauSuite\daten\projects\PRJ-2026-0001\project.json
```

```json
{
  "id": "PRJ-2026-0001",
  "number": "2026-0001",
  "name": "Neubau Musterstrasse 12",
  "status": "active",
  "client": {
    "name": "Max Mustermann",
    "company": "Mustermann GmbH",
    "email": "max@example.com",
    "phone": "+49 123 456789"
  },
  "address": {
    "street": "Musterstrasse 12",
    "postalCode": "12345",
    "city": "Musterstadt",
    "country": "DE"
  },
  "startDate": "2026-06-12",
  "endDate": null,
  "description": "Neubau eines Einfamilienhauses.",
  "folders": {
    "activities": "activities/",
    "observations": "observations/",
    "plans": "plans/",
    "pins": "pins/",
    "photos": "photos/",
    "reports": "reports/",
    "sources": "sources/",
    "ai": "ai/",
    "exports": "exports/"
  },
  "createdAt": "2026-06-12T10:00:00Z",
  "updatedAt": "2026-06-12T10:00:00Z",
  "deleted": false,
  "syncStatus": "local",
  "lastSyncedAt": null,
  "version": 1
}
```

### 11.2 Aktivitaet

Speicherort:

```text
D:\Kai_BauSuite\daten\projects\PRJ-2026-0001\activities\activities.json
```

```json
{
  "id": "ACT-2026-0001",
  "projectId": "PRJ-2026-0001",
  "type": "site_walk",
  "title": "Baustellenbegehung 12.06.2026",
  "description": "Begehung EG und Bodenplatte.",
  "occurredAt": "2026-06-12T08:00:00Z",
  "status": "completed",
  "actor": {
    "type": "user",
    "name": "Erich Ruck"
  },
  "location": {
    "area": "Bodenplatte",
    "floor": "EG",
    "room": null,
    "gps": {
      "lat": null,
      "lng": null
    }
  },
  "content": {
    "text": "Bewehrung vor Betonage geprueft und fotografiert.",
    "inputType": "manual"
  },
  "media": [
    {
      "kind": "photo",
      "path": "photos/2026-06-12/photo-001.jpg",
      "thumbnailPath": "photos/2026-06-12/photo-001-thumb.jpg",
      "mimeType": "image/jpeg",
      "sizeBytes": 1840000
    }
  ],
  "relations": {
    "planIds": ["PLN-2026-0001"],
    "pinIds": ["PIN-2026-0001"],
    "observationIdsCreated": ["OBS-2026-0001"],
    "observationIdsUpdated": [],
    "sourceIds": [],
    "parentActivityId": null
  },
  "createdAt": "2026-06-12T08:50:00Z",
  "updatedAt": "2026-06-12T08:50:00Z",
  "deleted": false,
  "syncStatus": "local",
  "lastSyncedAt": null,
  "version": 1
}
```

Aktivitaetstypen:

```text
site_walk     Baustellenbegehung
photo         Foto
mail          Mail
note          Notiz
phone_call    Telefonat
appointment   Termin
ai_check      KI-Pruefung
```

Statuswerte:

- `draft`
- `planned`
- `in_progress`
- `completed`
- `cancelled`
- `failed`
- `archived`

Eingabetypen fuer `content.inputType`:

- `manual`
- `voice`
- `import`
- `ai`
- `system`

### 11.3 Beobachtung

Speicherort:

```text
D:\Kai_BauSuite\daten\projects\PRJ-2026-0001\observations\observations.json
```

```json
{
  "id": "OBS-2026-0001",
  "projectId": "PRJ-2026-0001",
  "type": "documentation",
  "title": "Bewehrung Bodenplatte dokumentiert",
  "description": "Bewehrung wurde vor Betonage fotografisch dokumentiert.",
  "status": "open",
  "priority": "medium",
  "trade": "Rohbau",
  "responsible": {
    "name": null,
    "company": null,
    "email": null,
    "phone": null
  },
  "location": {
    "area": "Bodenplatte",
    "floor": "EG",
    "room": null
  },
  "dueDate": null,
  "resolvedAt": null,
  "relations": {
    "activityIds": ["ACT-2026-0001"],
    "planIds": ["PLN-2026-0001"],
    "pinIds": ["PIN-2026-0001"],
    "sourceIds": [],
    "reportIds": []
  },
  "history": [
    {
      "at": "2026-06-12T08:50:00Z",
      "activityId": "ACT-2026-0001",
      "type": "created",
      "text": "Beobachtung aus Baustellenbegehung erstellt."
    }
  ],
  "createdAt": "2026-06-12T08:50:00Z",
  "updatedAt": "2026-06-12T08:50:00Z",
  "deleted": false,
  "syncStatus": "local",
  "lastSyncedAt": null,
  "version": 1
}
```

Beobachtungstypen:

```text
documentation  Dokumentation
hint           Hinweis
question       Frage
approval       Freigabe
defect         Mangel
task           Aufgabe
```

Statuswerte:

- `open`
- `in_review`
- `waiting`
- `approved`
- `rejected`
- `resolved`
- `closed`
- `archived`

Prioritaeten:

- `low`
- `medium`
- `high`
- `critical`

### 11.4 Plan

Speicherort:

```text
D:\Kai_BauSuite\daten\projects\PRJ-2026-0001\plans\plans.json
```

```json
{
  "id": "PLN-2026-0001",
  "projectId": "PRJ-2026-0001",
  "title": "Grundriss Erdgeschoss",
  "planNumber": "A-001",
  "discipline": "architecture",
  "revision": "00",
  "status": "valid",
  "file": {
    "path": "plans/plan-001.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 2480000
  },
  "preview": {
    "path": "plans/plan-001-preview.png",
    "mimeType": "image/png"
  },
  "uploadedAt": "2026-06-12T10:15:00Z",
  "createdAt": "2026-06-12T10:15:00Z",
  "updatedAt": "2026-06-12T10:15:00Z",
  "deleted": false,
  "syncStatus": "local",
  "lastSyncedAt": null,
  "version": 1
}
```

### 11.5 Planpin

Planpins verorten Aktivitaeten und Beobachtungen auf einem PDF-Plan.

Speicherort:

```text
D:\Kai_BauSuite\daten\projects\PRJ-2026-0001\pins\pins.json
```

```json
{
  "id": "PIN-2026-0001",
  "projectId": "PRJ-2026-0001",
  "planId": "PLN-2026-0001",
  "page": 1,
  "position": {
    "x": 0.428,
    "y": 0.617
  },
  "title": "Bewehrung Bodenplatte",
  "relations": {
    "activityIds": ["ACT-2026-0001"],
    "observationIds": ["OBS-2026-0001"]
  },
  "createdAt": "2026-06-12T08:50:00Z",
  "updatedAt": "2026-06-12T08:50:00Z",
  "deleted": false,
  "syncStatus": "local",
  "lastSyncedAt": null,
  "version": 1
}
```

Die Koordinaten werden relativ zur PDF-Seite gespeichert, damit Pins unabhaengig von Zoomstufe und Bildschirmgroesse stabil bleiben.

### 11.6 Quelle

Quellen werden ab Version 1.5 fuer `Kai pruefen`, Online-Recherche, Herstellerangaben und Normenhinweise benoetigt.

Speicherort:

```text
D:\Kai_BauSuite\daten\projects\PRJ-2026-0001\sources\sources.json
```

```json
{
  "id": "SRC-2026-0001",
  "projectId": "PRJ-2026-0001",
  "title": "Herstellerangabe Abdichtungssystem",
  "type": "manufacturer_document",
  "url": "https://example.com/dokument.pdf",
  "file": {
    "path": "sources/herstellerangabe-abdichtung.pdf",
    "mimeType": "application/pdf"
  },
  "accessedAt": "2026-06-12T12:00:00Z",
  "summary": "Relevante Herstellerangaben zur Verarbeitung.",
  "createdByActivityId": "ACT-2026-0007",
  "createdAt": "2026-06-12T12:00:00Z",
  "updatedAt": "2026-06-12T12:00:00Z",
  "deleted": false,
  "syncStatus": "local",
  "lastSyncedAt": null,
  "version": 1
}
```

Quellentypen:

- `manufacturer_document`
- `standard_reference`
- `web_page`
- `technical_sheet`
- `manual`
- `mail_attachment`
- `other`

### 11.7 Protokoll

Protokolle sind Ausgaben aus Aktivitaeten und Beobachtungen. Sie sind keine fuehrende Datenquelle, sondern ein dokumentierter Exportzustand.

Speicherort:

```text
D:\Kai_BauSuite\daten\projects\PRJ-2026-0001\reports\reports.json
```

```json
{
  "id": "PRT-2026-0001",
  "projectId": "PRJ-2026-0001",
  "type": "site_report",
  "title": "Bautagesbericht 12.06.2026",
  "date": "2026-06-12",
  "status": "draft",
  "activityIds": ["ACT-2026-0001", "ACT-2026-0002"],
  "observationIds": ["OBS-2026-0001", "OBS-2026-0002"],
  "export": {
    "markdownPath": "reports/report-001.md",
    "pdfPath": "reports/report-001.pdf"
  },
  "createdAt": "2026-06-12T16:00:00Z",
  "updatedAt": "2026-06-12T16:00:00Z",
  "deleted": false,
  "syncStatus": "local",
  "lastSyncedAt": null,
  "version": 1
}
```

## 12. Architektur nach Aktivitaeten und Beobachtungen

### 12.1 Fachliche Schichten

```text
UI-Schicht
  Baustellen-App
  Buero-Cockpit
  KI-Assistent

Anwendungsschicht
  ActivityService
  ObservationService
  PlanService
  ReportService
  SourceService
  AiService

Domaenenschicht
  Projekt
  Aktivitaet
  Beobachtung
  Plan
  Planpin
  Quelle
  Protokoll

Speicherschicht
  JSON-Dateien
  Medienordner
  PDF-Dateien
  Exportordner
```

### 12.2 ActivityService

Aufgaben:

- Aktivitaeten erstellen, aktualisieren und archivieren
- Medien, Planpins und Quellen mit Aktivitaeten verknuepfen
- aus Aktivitaeten neue Beobachtungen erzeugen
- Aenderungen an Beobachtungen als Aktivitaet nachvollziehbar machen

### 12.3 ObservationService

Aufgaben:

- Beobachtungen erstellen und aktualisieren
- Status, Prioritaet, Verantwortlichkeit und Fristen verwalten
- Beobachtungshistorie pflegen
- Beziehungen zu Aktivitaeten, Plaenen, Pins, Quellen und Protokollen verwalten

### 12.4 AiService

Aufgaben:

- KI-Pruefungen als Aktivitaeten anlegen
- Kontext aus Aktivitaeten, Beobachtungen, Plaenen, Pins und Quellen zusammenstellen
- Ergebnisse speichern
- Vorschlaege fuer neue oder geaenderte Beobachtungen erzeugen
- Quellen und Recherchepfade dokumentieren

## 13. Zentrale Workflows

### 13.1 Baustellenbegehung

1. Nutzer oeffnet die Baustellen-App.
2. Nutzer waehlt ein Projekt aus.
3. App erstellt oder oeffnet eine Aktivitaet `Baustellenbegehung`.
4. Nutzer oeffnet einen PDF-Plan.
5. Nutzer setzt Planpins.
6. Nutzer nimmt Fotos auf. Jedes Foto wird als Aktivitaet `Foto` gespeichert.
7. Nutzer erfasst Notizen per Text oder Sprache. Jede Notiz wird als Aktivitaet `Notiz` gespeichert.
8. Aus Fotos und Notizen entstehen Beobachtungen wie `Dokumentation`, `Hinweis`, `Frage`, `Mangel` oder `Aufgabe`.
9. Optional startet Nutzer `Kai pruefen`. Daraus entsteht eine Aktivitaet `KI-Pruefung`.
10. KI-Pruefung erzeugt oder veraendert Beobachtungen.
11. Aus Aktivitaeten und Beobachtungen wird ein Protokollentwurf erstellt.
12. Nutzer prueft, bearbeitet und exportiert das Protokoll als PDF.

### 13.2 Foto auf Plan verorten

1. PDF-Plan wird im Viewer geladen.
2. Nutzer tippt oder klickt auf eine Position.
3. App speichert einen Planpin mit relativen Koordinaten.
4. Nutzer nimmt ein Foto auf.
5. App speichert das Foto als Aktivitaet `Foto`.
6. Foto-Aktivitaet wird mit Planpin und Plan verknuepft.
7. App erzeugt optional eine Beobachtung `Dokumentation`.

### 13.3 Notiz oder Spracheingabe

1. Nutzer startet Text- oder Spracheingabe.
2. App erstellt eine Aktivitaet `Notiz`.
3. Sprache wird transkribiert und im Aktivitaetsinhalt gespeichert.
4. Nutzer entscheidet, ob daraus eine Beobachtung wird.
5. Moegliche Beobachtungen sind `Hinweis`, `Frage`, `Mangel` oder `Aufgabe`.

### 13.4 Mail oder Telefonat

1. Nutzer dokumentiert eine Mail oder ein Telefonat.
2. App erstellt eine Aktivitaet `Mail` oder `Telefonat`.
3. Anhänge oder relevante Inhalte werden als Quelle gespeichert.
4. Die Aktivitaet erzeugt oder veraendert Beobachtungen.
5. Beispiel: Ein Telefonat aktualisiert eine Aufgabe; eine Mail bestaetigt eine Freigabe.

### 13.5 Termin

1. Nutzer legt einen Termin an.
2. App erstellt eine Aktivitaet `Termin` mit Status `planned`.
3. Termin kann mit Beobachtungen verbunden werden, etwa einer Aufgabe oder Frage.
4. Nach Abschluss wird der Termin auf `completed` gesetzt.
5. Ergebnis des Termins wird als neue Aktivitaet oder als Aenderung an Beobachtungen dokumentiert.

### 13.6 Kai pruefen

1. Nutzer klickt auf `Kai pruefen`.
2. App erstellt eine Aktivitaet `KI-Pruefung`.
3. App sammelt Kontext: Projekt, Plan, Pin, Aktivitaeten, Beobachtungen, Fotos, Notizen und Quellen.
4. KI-Schicht fuehrt Pruefung und optional Recherche aus.
5. Quellen werden in `sources.json` gespeichert.
6. Ergebnis wird in der Aktivitaet `KI-Pruefung` gespeichert.
7. Nutzer uebernimmt Vorschlaege als Beobachtung `Hinweis`, `Frage`, `Freigabe`, `Mangel` oder `Aufgabe`.

### 13.7 Protokollerstellung

1. Nutzer waehlt Projekt und Zeitraum.
2. App sammelt Aktivitaeten und Beobachtungen des Zeitraums.
3. Nutzer waehlt relevante Inhalte aus.
4. App erzeugt einen Markdown- oder HTML-Entwurf.
5. Nutzer bearbeitet den Entwurf.
6. App exportiert ein PDF.
7. Protokoll speichert Referenzen auf alle verwendeten Aktivitaeten und Beobachtungen.

## 14. UI-Module

### 14.1 Buero-Cockpit

Hauptansichten:

- Dashboard mit aktuellen Projekten, offenen Beobachtungen und letzten Aktivitaeten
- Projektliste mit Suche, Filter und Status
- Projektdetail mit Stammdaten, Plaenen, Aktivitaeten, Beobachtungen und Protokollen
- Aktivitaeten-Timeline
- Beobachtungsboard mit Dokumentationen, Hinweisen, Fragen, Freigaben, Maengeln und Aufgaben
- Planverwaltung mit Upload, Revision und Status
- Protokollverwaltung mit Entwurf, Export und Archiv
- Quellenverwaltung ab V1.5
- KI-Wissensbereich ab V2

### 14.2 Baustellen-App

Hauptansichten:

- Projektwahl
- Tagesuebersicht
- Baustellenbegehung
- PDF-Planansicht
- Pin-Werkzeug
- Aktivitaetserfassung fuer Foto, Notiz, Telefonat, Mail und Termin
- Beobachtungserfassung fuer Dokumentation, Hinweis, Frage, Freigabe, Mangel und Aufgabe
- Protokollentwurf
- `Kai pruefen`

### 14.3 KI-Assistent

Funktionen:

- Kontextbezogene KI-Pruefung
- Online-Recherche
- Quellenliste
- Herstellerangaben
- Normenhinweise
- Fotobewertung
- Baustellenchat
- Projektwissenssuche
- Vorschlaege fuer neue oder geaenderte Beobachtungen

## 15. PDF-Planfunktion

Technische Anforderungen:

- PDF-Dateien laden und seitenweise anzeigen
- Zoom und Pan unterstuetzen
- Pins relativ zur PDF-Seite speichern
- Pins auf allen Zoomstufen korrekt positionieren
- Pins mit Aktivitaeten und Beobachtungen verbinden
- Detailpanel fuer Aktivitaet oder Beobachtung anzeigen
- Optional Vorschaubilder pro Plan erzeugen

Empfohlene technische Grundlage:

- PDF.js fuer Rendering
- Canvas oder DOM-Overlay fuer Pins
- relative Koordinaten statt Pixelkoordinaten

## 16. Medienverarbeitung

Fotos, Anhänge und exportierte Dokumente werden physisch im Projektordner gespeichert. Ihre fachliche Bedeutung entsteht ueber Aktivitaeten und Beobachtungen.

Anforderungen:

- Fotoaufnahme oder Dateiimport
- automatische Dateibenennung
- Thumbnail-Erzeugung
- Speicherung nach Datum
- Verknuepfung mit Aktivitaet, Plan, Pin und Beobachtung
- Vorbereitung fuer KI-Fotobewertung

## 17. Export

Version 1 benoetigt PDF-Protokolle. Optional kann ein Markdown-Zwischenformat gespeichert werden.

Exportanforderungen:

- Protokoll als PDF erzeugen
- verwendete Aktivitaeten ausgeben
- relevante Beobachtungen ausgeben
- Fotos und Quellen einbetten oder referenzieren
- Projekt-, Datums- und Teilnehmerdaten ausgeben
- Exportpfad im Protokollobjekt speichern

## 18. KI und Datenschutz

KI-Funktionen duerfen nur ueber eine kontrollierte Service-Schicht laufen.

Leitplanken:

- Jede KI-Aktion wird als Aktivitaet `KI-Pruefung` gespeichert.
- Nutzer muss erkennen, welche Projektdaten an KI-Dienste gehen.
- KI-Ergebnisse sind Vorschlaege, keine automatische Freigabe.
- Quellen werden gespeichert und pruefbar verlinkt.
- KI-Aktionen muessen langfristig auditierbar sein.
- Lokale Projektdaten bleiben die fuehrende Quelle.

## 19. Suche und Projektwissen

Ab Version 2 soll Projektwissen durchsuchbar werden.

Suchquellen:

- Projektstammdaten
- Plaene und Planmetadaten
- Aktivitaeten
- Beobachtungen
- Planpins
- Quellen
- Protokolle
- KI-Pruefungen

Technischer Ansatz:

- lokale Volltextsuche fuer V1/V1.5
- spaeter Vektorindex fuer semantische Suche
- klare Trennung zwischen lokalem Index und externen KI-Diensten
- Suchergebnisse immer mit Aktivitaets- und Beobachtungskontext anzeigen

## 20. Validierung

Alle JSON-Dateien sollten gegen Schemas validierbar sein.

Mindestvalidierungen:

- Pflichtfelder vorhanden
- IDs eindeutig
- referenzierte IDs existieren
- referenzierte Dateien existieren
- Aktivitaetstypen sind gueltig
- Beobachtungstypen sind gueltig
- Statuswerte sind gueltig
- Datumswerte sind ISO-konform
- relative Pfade verlassen den Projektordner nicht
- Beobachtungshistorie verweist auf gueltige Aktivitaeten

## 21. Fehler- und Konfliktbehandlung

Version 1:

- fehlende Dateien sichtbar melden
- defekte JSON-Dateien nicht still ueberschreiben
- automatische Backups vor Schreiboperationen
- geloeschte Objekte per `deleted: true` markieren
- Aktivitaeten nicht physisch loeschen, wenn sie Beobachtungshistorie erklaeren

Version 2:

- Konflikterkennung ueber `updatedAt` und `version`
- Konfliktstatus `conflict`
- Vergleichsansicht fuer widerspruechliche Objektversionen
- Wiederherstellung aus Backups
- Konfliktaufloesung auf Ebene von Aktivitaeten und Beobachtungen

## 22. Roadmap

### 22.1 MVP 1.1 - Grundkern und Stammdaten (abgeschlossen)

- Projekte
- Aktivitäten
- Beobachtungen
- Stammdaten Gewerke, Firmen und Verantwortliche
- konsolenloser Windows-Start
- UTF-8-/Umlautkorrektur

### 22.2 MVP 2 - Planverwaltung (umgesetzt)

- projektbezogene Planordner
- PDF-, PNG-, JPG- und JPEG-Import
- Planmetadaten in `plans.json`
- relative Dateipfade und stabile IDs
- Bearbeiten und Aktivieren/Deaktivieren
- Öffnen mit Windows-Standardprogramm
- zentral konfigurierbarer `data_root`
- robuste JSON-Speicherung mit temporärer Datei und Backup

### 22.3 MVP 3 - Mobile Handling-Prototyp (nächster Schritt)

- lokaler Server auf dem Windows-PC
- Zugriff im gleichen WLAN per iOS-/Android-Browser
- einfache mobile Web-/PWA-Oberfläche
- Projekt- und Aktivitätsauswahl
- Beobachtungen anzeigen und erfassen
- Stammdaten nur als Dropdown-Auswahl
- große Touch-Ziele und wenig Texteingabe

### 22.4 Folgeschritte nach MVP 3

- touchfähige Plananzeige mit Zoom und Verschieben
- Pins und Markierungen
- Kamera- und Fotoanhänge
- Berichte und Exporte
- Aufgaben- und erweiterte Mangelworkflows

### 22.5 Langfristiges Online-Backend

- gemeinsames Backend für Windows, iOS, Android und PWA
- bevorzugt Supabase oder vergleichbar
- PostgreSQL für Fach- und Beziehungsdaten
- Auth und spätere Rollen/Rechte
- Storage für Pläne und Fotos
- API als gemeinsamer Zugriffspunkt
- EU-Region, möglichst Frankfurt
- Dropbox optional für Backups, Exporte oder ergänzende Dateiablage
## 23. Nicht-Ziele fuer Version 1

Folgende Punkte werden fuer V1 vorbereitet, aber nicht zwingend umgesetzt:

- Mehrbenutzerbetrieb
- zentrale Cloud-Datenbank
- vollautomatische Maengelerkennung
- vollstaendige Normendatenbank
- Statikberechnungen
- komplexes Aufgabenmanagement
- automatische Synchronisation ueber mehrere Geraete
- vollstaendige Mail- und Telefonieintegration

## 24. Offene technische Entscheidungen

- Soll V1 als reine Web-App, lokale Desktop-App oder PWA umgesetzt werden?
- Welche lokale Speicherstrategie wird bevorzugt: Browser File System Access API, Electron/Tauri-App-Shell oder lokaler Backend-Dienst?
- Soll die PDF-Erzeugung clientseitig oder serverseitig erfolgen?
- Welcher KI-Anbieter wird fuer `Kai pruefen` verwendet?
- Welche Daten duerfen bei KI-Pruefungen extern verarbeitet werden?
- Sollen Normen nur referenziert oder lokal verwaltet werden?
- Wie werden Statikmodule spaeter technisch eingebunden?
- Welche Aktivitaeten sollen in V1 wirklich aktiv erfasst werden und welche nur vorbereitet sein?
- Welche Beobachtungstypen benoetigen eigene Pflichtfelder?

## 25. Empfohlener MVP-Schnitt

Der kleinste sinnvolle MVP besteht aus:

- Projekt anlegen
- PDF-Plan importieren
- PDF-Plan anzeigen
- Aktivitaet `Baustellenbegehung` starten
- Pin auf Plan setzen
- Aktivitaet `Foto` erfassen
- Aktivitaet `Notiz` erfassen
- Beobachtung `Dokumentation`, `Hinweis`, `Frage`, `Mangel` oder `Aufgabe` aus Aktivitaet erstellen
- Protokoll aus Aktivitaeten und Beobachtungen erzeugen
- Protokoll als PDF exportieren

Dieser MVP erfuellt den Kern der Vision: digitale Baustellenbegehung mit wiederverwendbaren Informationen und nachvollziehbarem Projektwissen.

## 26. Migration vom alten Modell

Fruehere Einzelobjekte werden in das neue Kernmodell ueberfuehrt:

```text
Foto        -> Aktivitaet type=photo
Notiz       -> Aktivitaet type=note
KI-Pruefung -> Aktivitaet type=ai_check
Mangel      -> Beobachtung type=defect
Aufgabe     -> Beobachtung type=task
Hinweis     -> Beobachtung type=hint
Freigabe    -> Beobachtung type=approval
Frage       -> Beobachtung type=question
```

Plaene, Planpins, Quellen und Protokolle bleiben eigene Objekte, werden aber konsequent mit Aktivitaeten und Beobachtungen verknuepft.

## 27. Zusammenfassung

Kai BauSuite sollte als modular aufgebaute, lokal startende und KI-faehige Bauplattform umgesetzt werden. Der fachliche Kern ist die Beziehung zwischen Aktivitaeten und Beobachtungen.

Aktivitaeten beschreiben, was passiert ist: Baustellenbegehung, Foto, Mail, Notiz, Telefonat, Termin oder KI-Pruefung. Beobachtungen beschreiben, was daraus fachlich folgt: Dokumentation, Hinweis, Frage, Freigabe, Mangel oder Aufgabe.

Version 1 liefert die operative Grundlage fuer digitale Baustellenbegehungen. Version 1.5 bringt `Kai pruefen` als KI-Aktivitaet mit Recherche und Quellen. Version 2 erweitert das System zu einer KI-gestuetzten Wissens- und Aufgabenplattform fuer Bauprojekte.

## Reparaturhinweis MVP 2.2 - Planliste und UTF-8

Am 20.06.2026 wurden zwei Datenprobleme in der Planverwaltung untersucht und behoben:

- Die Plan-Gruppe des Arbeitsplans EG war korrekt. V1 und V2 hatten dieselbe \`plan_group_id\`, Positionsplan EG, Exposé EG und Bewehrung Decke EG waren bereits getrennte Gruppen. Die aktuelle Version V2 war jedoch \`aktiv=false\` und wurde deshalb korrekt von der Hauptliste ausgeblendet. V2 wurde auf \`aktiv=true\` und \`is_current=true\` gesetzt; V1 bleibt mit \`is_current=false\` in der Historie.
- Während der manuellen MVP-2.2-Migration war eine UTF-8-JSON ohne BOM einmal mit dem Windows-PowerShell-Standardencoding statt mit der Core-Funktion gelesen worden. Dadurch entstanden Werte wie \`PlÃ¤ne\`, \`ExposÃ©\` und \`WÃ¤nde\`. 32 eindeutig betroffene Textfelder in \`planname\`, \`dateiname_original\` und \`notiz\` wurden in den Metadaten repariert.

Vor der Änderung wurde \`plans.json.backup-v22-reparatur-20260620.json\` angelegt. Keine PDF wurde gelöscht oder umbenannt. Nach der Reparatur sind 21 JSON-Einträge und 21 referenzierte Dateien vorhanden; fehlende oder verwaiste Plan-Dateien: 0. Ein Neustarttest über die App-Core-Funktionen bestätigte einen aktuellen Arbeitsplan EG, zwei Historieneinträge V1/V2, getrennte Fremdgruppen und lesbare PDF-Signaturen beider Versionen.


## MVP 3: Mobile Handling-Prototyp

MVP 3 stellt eine lokale, smartphone-optimierte Baustellenoberfläche über einen kleinen Python-Server bereit. Der Server verwendet ausschließlich die Python-Standardbibliothek, bindet an Port \`8000\` und liest \`D:\Kai_BauSuite\config\settings.json\`. Alle Projekt- und Stammdatenpfade werden aus dem dort konfigurierten \`data_root\` abgeleitet.

Start:

\`\`\`text
D:\Kai_BauSuite\mobile\Start-MobileServer.cmd
\`\`\`

PC-Aufruf:

\`\`\`text
http://localhost:8000
\`\`\`

Handy-Aufruf im aktuellen WLAN:

\`\`\`text
http://192.168.178.49:8000
\`\`\`

Die WLAN-IP kann sich nach Router-Neustart ändern. Beim Serverstart werden alle erkannten lokalen Adressen ausgegeben. Beendet wird der Server im Konsolenfenster mit \`Strg+C\`. Bei einer Windows-Firewall-Abfrage ist nur der Zugriff für private Netzwerke zu erlauben. Der Server ist ausschließlich für das lokale WLAN vorgesehen und besitzt in MVP 3 weder TLS noch Anmeldung oder öffentliche Internetfreigabe.

Mobile Funktionen:

- echte Projektliste aus \`projects.json\`
- projektbezogene Anzeige von Bauherr, Adresse und Aktivitäten
- neue Aktivität im bestehenden Windows-Datenformat
- projekt- und aktivitätsbezogene Beobachtungsliste
- neue Beobachtung mit Gewerk, Firma und Verantwortlichem aus aktiven Stammdaten
- Status, Priorität und optionale Frist
- Liste ausschließlich aktueller, aktiver Planversionen
- optionales Öffnen einer Plandatei im Browser
- keine mobile Stammdatenpflege

Schreibzugriffe validieren Projekt- und Aktivitäts-IDs, verwenden stabile neue IDs und schreiben JSON atomar über eine temporäre Datei. Vor dem Ersetzen wird die vorherige JSON-Datei als \`.bak\` gesichert. In Fachdaten werden keine absoluten Windows-Pfade ergänzt. Alte fehlerhaft kodierte Texte werden nur in der API-Ausgabe lesbar dekodiert; bestehende Datendateien werden dadurch nicht migriert.

Technische Dateien:

\`\`\`text
D:\Kai_BauSuite\mobile\server.py
D:\Kai_BauSuite\mobile\Start-MobileServer.cmd
D:\Kai_BauSuite\mobile\static\index.html
D:\Kai_BauSuite\mobile\static\styles.css
D:\Kai_BauSuite\mobile\static\app.js
D:\Kai_BauSuite\mobile\static\manifest.json
\`\`\`

### Architekturziele nach MVP 3

Alle mobilen API-Routen arbeiten mit übergebenen Projekt-, Aktivitäts-, Beobachtungs- und Plan-IDs; es gibt keine Sonderlogik für das Projekt \`3 RH Kronwinkler\`. Planversionierung bleibt unverändert: mobil werden nur aktuelle aktive Versionen gelesen, ältere Dateien bleiben in der Windows-Historie erhalten.

Für spätere Ausbaustufen bleiben folgende Beziehungen vorgesehen, ohne sie in MVP 3 anzulegen:

- Benutzer und projektbezogene Rollen: Admin, Bauleiter, Mitarbeiter, Nachunternehmer, Lesen und eigene Aufgaben
- Auditfelder wie \`created_by\`, \`updated_by\`, \`assigned_to\` und \`visibility\`
- Planpins mit relativen Koordinaten und Beziehungen zu Plan, Beobachtung, Foto und Soll-Punkt
- IFC/BIM-Bezüge über \`room_id\`, \`ifc_guid\`, \`building_storey\` und \`building_part\`
- Raumbuch, Ausstattung und Fenstermerkmale als eigenständige Fachobjekte
- Projektvorlagen für Gewerke, Typen, Bereiche und Projektarten
- spätere gemeinsame API mit PostgreSQL, Auth und Storage, bevorzugt Supabase oder vergleichbar

Der lokale Python-Server ist ein austauschbarer MVP-Adapter auf die JSON-Datenbasis. Er wird nicht als endgültiges Online-Backend betrachtet.

Bekannte Einschränkungen:

- Der Büro-PC muss für den WLAN-Test laufen.
- Keine Authentifizierung, Benutzerrechte, HTTPS oder Cloud-Synchronisation.
- Gleichzeitiges Schreiben in Windows- und Mobile-App sollte im Prototyp vermieden werden.
- Manifest vorhanden, aber Installation als vollständige PWA über eine WLAN-IP erfordert später HTTPS.
- Keine Offline-Synchronisation im Browser.
- Keine Pins, Fotos, Planbearbeitung, Berichte, IFC- oder Adminfunktionen.

Nächster Schritt ist MVP 4: mobile Plananzeige weiter ausbauen und anschließend Pins auf aktuellen Planversionen vorbereiten.



## Zielarchitektur: Mehrsprachige Sprach- und KI-Erfassung

Die Sprach- und KI-Erfassung ist eine spätere Ausbaustufe und nicht Bestandteil des aktuellen MVP 3. Sie soll freie Spracheingaben auf Deutsch, Albanisch sowie gemischte Eingaben Deutsch/Albanisch verarbeiten.

### Zielablauf

1. Der Nutzer oder ein Handwerker nimmt einen freien Sprachtext auf.
2. Das System erkennt die verwendete Sprache oder Sprachmischung.
3. Albanische und gemischte Inhalte werden für die interne Projektdokumentation ins Deutsche übersetzt.
4. Ein Analyse-Service erzeugt daraus einen strukturierten Vorschlag für Beobachtung, Mangel, Hinweis, Frage oder Aufgabe.
5. Gewerke, Firmen und Verantwortliche werden vorrangig aus den Projektbeteiligten vorgeschlagen.
6. Der Nutzer prüft und ändert alle erkannten Inhalte und Zuordnungen.
7. Erst nach ausdrücklicher Bestätigung wird die deutsche Fassung fachlich gespeichert.
8. Optional wird eine albanische Fassung für den Handwerker erzeugt.
9. Eine Weitergabe an Firmen oder Verantwortliche erfolgt niemals automatisch und niemals ohne Freigabe.

### Langfristige Felder der Beobachtung

- haupt_gewerk_id
- beteiligte_gewerk_ids[]
- haupt_firma_id
- beteiligte_firma_ids[]
- haupt_verantwortlicher_id
- weitere_verantwortliche_ids[]
- original_sprachtext
- original_sprache
- deutsche_uebersetzung
- zusammenfassung_deutsch
- ausgabe_sprache_optional
- hinweistext_fuer_handwerker_deutsch
- hinweistext_fuer_handwerker_albanisch
- ki_vorschlag
- ki_confidence optional
- vom_nutzer_bestaetigt
- created_at
- updated_at

Ein Mangel kann mehrere Gewerke, Firmen und Verantwortliche betreffen. Eine Hauptzuständigkeit bleibt zusätzlich möglich. Die bestehenden Einzelfelder trade_id, company_id und responsible_id müssen bei einer späteren Migration weiterhin lesbar bleiben und dürfen nicht ohne Backup oder dokumentierte Migration entfernt werden.

### Projektbezogene Beteiligte und Sprachen

Globale Stammdaten bleiben die zentrale Quelle. Firmen und Verantwortliche sollen später zusätzlich einem oder mehreren Projekten zugeordnet werden. Dadurch kann die Vorschlagslogik Begriffe wie Außenputz zunächst gegen die tatsächlich im Projekt eingesetzten Gewerke und Firmen abgleichen.

Langfristig vorgesehene Sprachfelder bei Firmen und Verantwortlichen:

- bevorzugte_sprache
- kann_deutsch optional true/false
- braucht_uebersetzung optional true/false

Vorgesehene projektbezogene Beziehungen:

- project_trade
- project_company
- project_responsible

IDs werden nicht aus Namen abgeleitet. Alle Zuordnungen verwenden stabile Projekt-, Gewerke-, Firmen- und Verantwortlichen-IDs.

### Qualität, Freigabe und Nachvollziehbarkeit

- KI-Ergebnisse sind ausschließlich Vorschläge.
- Der Nutzer muss Typ, Titel, Beschreibung, Beteiligte, Status, Priorität und Frist prüfen können.
- Mehrfachzuordnungen müssen mobil mit möglichst wenig Tipparbeit bearbeitbar sein.
- Originalsprachtext, erkannte Sprache, deutsche Übersetzung und Nutzerbestätigung bleiben nachvollziehbar.
- Eine optionale KI-Konfidenz ersetzt niemals die Nutzerbestätigung.
- Keine automatische Nachricht oder Aufgabenweitergabe ohne Freigabe.
- Die deutsche Fassung ist die führende interne Projektdokumentation.
- Eine albanische Ausgabe ist eine abgeleitete, optional freizugebende Kommunikationsfassung.

### Spätere Objektbezüge

Der strukturierte Vorschlag soll später optional auf plan_id, plan_group_id, room_id, element_id, ifc_guid, pin_id, Foto-IDs und Aktivitäts-IDs verweisen können. Diese Beziehungen werden jetzt nicht implementiert.

Sprachaufnahme, Spracherkennung, Übersetzung und fachliche KI-Strukturierung werden als getrennte Services geplant. Eine einfache Diktierfunktion soll dadurch unabhängig von einer späteren KI-Auswertung nutzbar bleiben.



## MVP 3 - Stabiler Mobile Handling-Prototyp

Stand: 21.06.2026

Der Mobile Handling-Prototyp ist erfolgreich praktisch getestet. Der lokale Server wird gestartet über:

D:\Kai_BauSuite\mobile\Start-MobileServer.cmd

Aktuelle Handy-Adresse im lokalen WLAN:

http://192.168.178.49:8000

Die IP-Adresse wird vom lokalen Netzwerk vergeben und kann sich später ändern. Der Server zeigt beim Start die aktuell erkannten Adressen an. Die Oberfläche ist ausschließlich für das private lokale WLAN vorgesehen.

Erfolgreich getestete mobile Abläufe:

- echte Projektliste aus der bestehenden Kai-BauSuite-Datenbasis
- Projekt öffnen
- Aktivitäten anzeigen
- neue Aktivität mit stabiler ID anlegen
- Beobachtungen eines Projekts und einer Aktivität anzeigen
- neue Beobachtung anlegen
- Beobachtung als Listenelement antippen
- mobile Beobachtungs-Detailansicht öffnen
- Typ, Titel, Beschreibung, Status, Priorität und Frist anzeigen
- Gewerk, Firma, Verantwortlichen und zugehörige Aktivität anzeigen
- Beobachtung bearbeiten
- Änderungen robust speichern
- Änderungen nach Neuladen erneut anzeigen
- kompatible Anzeige und Weiterverarbeitung in der Windows-App

Die mobile API schreibt Aktivitäten und Beobachtungen im vorhandenen Windows-Datenformat. Vor dem Ersetzen einer JSON-Datei wird eine Sicherung mit der Endung .bak angelegt. Planversionierung, Stammdaten und bestehende Projektstrukturen bleiben unverändert.

Geänderte mobile Komponenten des abgeschlossenen MVP-3-Stands:

- mobile/server.py
- mobile/static/app.js
- mobile/static/styles.css

Der nächste Entwicklungsschritt ist noch festzulegen:

- MVP 4 Fotos zu Beobachtungen
- oder MVP 4 mobile Plananzeige mit anschließenden Pins

Bis zur Entscheidung werden keine dieser Funktionen vorgezogen.



## MVP 4: Fotos zu Beobachtungen

Stand: 21.06.2026

MVP 4 ergänzt projektbezogene Fotos zu Beobachtungen in der mobilen Baustellenoberfläche. Planversionierung, Stammdaten und das bestehende Beobachtungsformat bleiben unverändert.

### Datei- und Metadatenablage

Fotodateien werden je Projekt und Beobachtung gespeichert:

D:\Kai_BauSuite\daten\projekte\<projekt-id>\fotos\<observation-id>\<photo-id>.<dateityp>

In den Fachdaten wird ausschließlich ein relativer Pfad gespeichert:

fotos/<observation-id>/<photo-id>.jpg

Die projektbezogenen Metadaten liegen getrennt unter:

D:\Kai_BauSuite\daten\projekte\<projekt-id>\photos.json

Das separate Modell verhindert, dass bestehende Beobachtungsobjekte für die Windows-App verändert werden müssen. Vor jeder Änderung an photos.json erzeugt die robuste JSON-Speicherung photos.json.bak.

### Fotometadatenmodell

- photo_id
- project_id
- activity_id
- observation_id
- original_filename
- local_filename
- relative_path
- mime_type
- file_size
- hinzugefuegt_am
- notiz
- aktiv
- created_at
- updated_at

Alle Beziehungen verwenden stabile IDs. Absolute Windows-Pfade werden nicht gespeichert. Die Struktur kann später auf API- und PostgreSQL-Beziehungen sowie auf Cloud- oder Supabase-Storage migriert werden.

### Mobile Bedienung

In der Beobachtungs-Detailansicht gibt es einen Abschnitt Fotos. Vorhandene Fotos werden als kleine Vorschauen mit optionaler Notiz angezeigt. Ein Tipp auf die Vorschau öffnet die Bilddatei größer im Browser.

Der Upload verwendet ein HTML-Dateifeld mit accept image/jpeg, image/png und image/webp sowie capture environment. Auf unterstützten Smartphones kann damit Kamera oder Galerie angeboten werden; am PC öffnet sich die Dateiauswahl. Mehrere ausgewählte Fotos werden nacheinander gespeichert.

### Sicherheit und Speicherung

Zulässige Formate:

- JPG und JPEG
- PNG
- WEBP

Der Server prüft nicht nur Dateiendung oder Browser-MIME-Typ, sondern auch die Dateisignatur. Andere Inhalte werden abgewiesen. Die maximale Dateigröße beträgt 15 MB pro Foto.

Die Bilddatei und ihre Metadaten werden atomar gespeichert. Schlägt die Metadatenspeicherung fehl, wird die für diesen Vorgang bereits kopierte Bilddatei entfernt. Bestehende Fotos werden nicht überschrieben.

### Kompatibilität und spätere Nutzung

Die Windows-App ignoriert photos.json zunächst, kann Projekte, Aktivitäten und Beobachtungen aber unverändert laden und bearbeiten. observations.json erhält kein zusätzliches photos-Feld.

Die Fotometadaten enthalten bereits die Bezüge zu Projekt, Aktivität und Beobachtung. Später können Fotos zusätzlich mit Berichten, Planpins, Soll-Ist-Abgleichen, Räumen, Bauteilen oder IFC-Objekten verknüpft werden.

Bekannte Einschränkungen:

- Noch keine Fotoanzeige in der Windows-App.
- Noch kein Löschen oder Deaktivieren von Fotos in der mobilen Oberfläche.
- Keine Bildkomprimierung, Thumbnail-Datei oder EXIF-Auswertung.
- Keine Pins, KI-, Sprach- oder Berichtsfunktion.
- Der lokale Büro-PC muss für den mobilen WLAN-Zugriff laufen.

Nächster Schritt: mobile Plananzeige und anschließend Pins auf aktuellen Planversionen.



## MVP 5: Mobile Plananzeige und Pins

Stand: 21.06.2026

MVP 5 ergänzt die mobile Planliste, eine einfache Planansicht und Pins, die beim Anlegen direkt mit einer neuen Beobachtung verknüpft werden. Die bestehende Planversionierung und `plans.json` bleiben unverändert.

### Mobile Plananzeige

In der Projektansicht werden ausschließlich aktive, aktuelle Planversionen angezeigt. Die Liste enthält Planname, Geschoss/Bereich, Dateityp, Version und Hinzufügedatum.

- PDFs werden mit dem integrierten PDF-Viewer des Browsers geöffnet.
- Bildpläne werden direkt in der mobilen Oberfläche angezeigt.
- Das aktuelle MVP verwendet für Pins die erste PDF-Seite beziehungsweise die sichtbare Bildfläche.
- Der Browser übernimmt Zoomen und Verschieben; eine eigene PDF-Rendering-Engine ist noch nicht integriert.

### Pin-Datenablage

Pins werden projektbezogen gespeichert:

```text
<data_root>\projekte\<projekt-id>\pins.json
```

Das Pinmodell enthält:

```text
pin_id
project_id
plan_id
activity_id
observation_id
pin_typ
title
description
x_rel
y_rel
page_number
status
priority
created_at
updated_at
active
```

Die Koordinaten `x_rel` und `y_rel` werden relativ zur Planfläche im Bereich 0 bis 1 gespeichert. Dadurch bleiben sie unabhängig von Bildschirmgröße und absolutem Windows-Pfad. `page_number` ist im aktuellen MVP auf Seite 1 ausgelegt.

### Verknüpfung mit Beobachtungen

`Pin setzen` aktiviert die Eingabe auf dem Plan. Nach dem Tippen auf die gewünschte Position wird eine neue Beobachtung im bestehenden Windows-kompatiblen Format erfasst. Die Beobachtung erhält zusätzlich `plan_id`, `plan_group_id` und `pin_id`; der Pin verweist über `observation_id` zurück.

Ein Tipp auf einen vorhandenen Pin öffnet die verknüpfte Beobachtung. In der Beobachtungs-Detailansicht führt `Auf Plan anzeigen` zurück zum Plan und hebt den zugehörigen Pin hervor. Die vorhandene MVP-4-Fotofunktion bleibt dabei nutzbar.

### Speicherung und Fehlerbehandlung

Vor Änderungen an `observations.json` und `pins.json` wird jeweils eine `.bak`-Sicherung erzeugt. JSON-Dateien werden atomar ersetzt. Ungültige Plan-, Aktivitäts- oder Stammdatenbezüge sowie Koordinaten außerhalb von 0 bis 1 werden mit einer verständlichen Fehlermeldung abgewiesen. `plans.json` wird von MVP 5 nur gelesen.

### Bekannte Einschränkungen

- Pinpositionen auf PDFs beziehen sich auf die Viewerfläche der ersten Seite. Nach internem PDF-Zoom oder Verschieben kann die optische Überlagerung abweichen.
- Noch keine Mehrseiten-Pinverwaltung und keine eigene PDF-Rendering-Engine.
- Pins können mobil angelegt und geöffnet, aber noch nicht verschoben oder deaktiviert werden.
- Keine Cloud-Synchronisation, Benutzerverwaltung, KI-, Sprach-, IFC- oder Berichtsfunktion.
- Der lokale Büro-PC muss für den mobilen WLAN-Zugriff laufen.

Nächster möglicher Schritt: mobile Pin-/Foto-Bedienung weiter stabilisieren oder einen einfachen Baustellenbericht vorbereiten.


### Testanleitung MVP 5

1. `D:\Kai_BauSuite\mobile\Start-MobileServer.cmd` starten.
2. Am Handy im gleichen WLAN `http://192.168.178.49:8000` öffnen.
3. Projekt und einen aktuellen Plan auswählen; historische Planversionen dürfen nicht in der Hauptliste erscheinen.
4. PDF öffnen, `Pin setzen` aktivieren und auf die gewünschte Stelle tippen.
5. Aktivität sowie Beobachtungsdaten auswählen beziehungsweise erfassen und speichern.
6. Pin antippen, Beobachtung öffnen und mit `Auf Plan anzeigen` zum markierten Pin zurückkehren.
7. An der Pin-Beobachtung ein Foto ergänzen, Seite neu laden und Foto, Pin und Beobachtung erneut prüfen.
8. Server mit `Strg+C` beenden, erneut starten und den gespeicherten Zustand kontrollieren.
9. Windows-App öffnen und prüfen, dass Projekt, Aktivität, Beobachtung sowie Planversionierung weiterhin lesbar sind.


## MVP 5.1: Mobiler Workflow und stabile Pin-Koordinaten

Stand: 22.06.2026

### Ursache und technische Lösung

In MVP 5 lag der Pin-Layer über dem vollständigen nativen PDF-Viewer. Dessen Werkzeugleiste, Seitenränder, Scrollposition und Zoomstufe waren für die Anwendung nicht messbar. Die relativen Koordinaten bezogen sich dadurch auf den Viewerrahmen statt zuverlässig auf die PDF-Seite.

MVP 5.1 rendert PDF-Seite 1 mit der lokal ausgelieferten Bibliothek PDF.js in ein HTML-Canvas. Canvas beziehungsweise Bildplan und Pin-Layer verwenden dieselbe kontrollierte Seitenfläche. x_rel und y_rel werden aus dem Begrenzungsrechteck dieser tatsächlichen Seitenfläche berechnet. App-eigenes Zoomen und Scrollen ändern nur die Darstellung, nicht die gespeicherten Koordinaten.

Neue Pins enthalten coordinate_space = page-v1 und page_number = 1. Bestehende Pins ohne coordinate_space bleiben unverändert und lesbar. Ihre beabsichtigte Position lässt sich aus den alten Viewerkoordinaten nicht sicher rekonstruieren; sie werden deshalb nicht automatisch migriert und mobil als ältere Koordinate gekennzeichnet.

Lokale PDF.js-Dateien:

- D:\Kai_BauSuite\mobile\static\vendor\pdf.min.mjs
- D:\Kai_BauSuite\mobile\static\vendor\pdf.worker.min.mjs
- D:\Kai_BauSuite\mobile\static\vendor\pdfjs-LICENSE

plans.json wird weiterhin ausschließlich gelesen. Plan-PDFs werden nicht umbenannt oder verändert.

### Projekt-Dashboard

Die mobile Projektübersicht zeigt offene Beobachtungen, offene Mängel, überfällige Punkte, heute oder innerhalb der nächsten sieben Tage fällige Punkte, offene Fragen, letzte Beobachtungen und letzte Aktivitäten.

### Schnellaktionen und mobile Fachbegriffe

Schnellaktionen:

- Beobachtung erfassen
- Foto / Beobachtung
- Pin auf Plan setzen
- Neue Aktivität
- Pläne

Pin auf Plan setzen führt direkt zur Auswahl eines aktuellen Plans, öffnet anschließend den Pinmodus und danach die Beobachtungserfassung.

Die Fachlogik bleibt unverändert: Eine Aktivität ist der Vorgang oder Anlass; eine Beobachtung ist der einzelne Mangel, Hinweis, die Frage oder Aufgabe. Bei direkter Beobachtungserfassung wird eine vorhandene heutige Baustellenrunde verwendet. Fehlt sie, wird automatisch eine Windows-kompatible Aktivität Baustellenrunde <Datum> angelegt. Der Nutzer kann weiterhin eine andere Aktivität auswählen.

Über Foto / Beobachtung kann beim direkten Erfassen optional sofort ein Foto gewählt oder aufgenommen werden.

### Sicherheit und Kompatibilität

Vor dem Schreibtest wurden zusätzliche zeitgestempelte Sicherungen von activities.json, observations.json und pins.json angelegt. Die atomare Speicherung erzeugt weiterhin .bak-Sicherungen. photos.json, plans.json und Plan-Dateien wurden nicht verändert.

Neue Beobachtungen verwenden weiterhin das vorhandene Windows-Datenformat. Plan- und Pin-Bezüge sind additive Felder.

### Bekannte Einschränkungen

- PDF-Pins unterstützen weiterhin nur Seite 1.
- Alte Pins ohne coordinate_space können abweichen und müssen bei Bedarf fachlich neu gesetzt werden.
- Ein abschließender Finger-, Scroll- und Zoomtest muss auf dem konkret verwendeten iOS-/Android-Browser erfolgen.
- Noch keine Pinverschiebung, Mehrseiten-Pins oder Cloud-Synchronisation.


## MVP 5.2: Pin-Bearbeitung und Pin-Darstellung

Stand: 22.06.2026

### Pin-Detail

Ein Tipp auf einen Pin öffnet ein mobiles Bottom Sheet. Es zeigt Pin-Nummer, Pintitel, verknüpfte Beobachtung, Typ und Status. Von dort kann die Beobachtung geöffnet, ein kompatibler Pin verschoben oder das Detail geschlossen werden.

Die Funktion Auf Plan anzeigen bleibt erhalten. Der zugehörige Pin wird auf dem Plan hervorgehoben und kann anschließend angetippt und verschoben werden.

### Pin verschieben

Verschieben ist ausschließlich für Pins mit coordinate_space = page-v1 erlaubt:

1. Pin antippen.
2. Pin verschieben wählen.
3. Neue Position auf der tatsächlichen Planseite antippen.
4. Vorschau-Marker prüfen.
5. Neue Position speichern oder abbrechen.

Erst der ausdrückliche Speichervorgang sendet x_rel und y_rel an den Server. Der Update-Endpunkt ändert ausschließlich diese beiden Koordinaten sowie updated_at. Beobachtung, Planbezug und weitere Pinfelder bleiben unverändert.

Alte Pins ohne coordinate_space bleiben sichtbar. Der Server lehnt ein Verschieben mit verständlicher Meldung ab; es findet keine automatische Migration statt.

### Pin-Optik

Pins verwenden lokal eingebundene Lucide-Map-Pin-Symbole mit exakter Spitze. Der Touchbereich bleibt mindestens 44 Pixel groß. Farben:

- Mangel: rot/orange
- Hinweis: blau
- Frage: gelb
- erledigt: grün
- sonstige Pins: neutral grau
- ausgewählter Pin: hervorgehobener Schatten

Der Verschiebemodus zeigt nach dem Tippen einen Vorschau-Marker. Seine Spitze kennzeichnet die künftig gespeicherte Position.

Lokale Dateien:

- D:\Kai_BauSuite\mobile\static\vendor\lucide.min.js
- D:\Kai_BauSuite\mobile\static\vendor\lucide-LICENSE

### Sicherheit und Einschränkungen

Vor dem Test wurde eine zusätzliche zeitgestempelte Sicherung von pins.json angelegt. Die atomare Speicherung erzeugt weiterhin pins.json.bak. observations.json, photos.json, activities.json, plans.json und Plan-Dateien wurden nicht verändert.

Pin-Löschen ist bewusst noch nicht umgesetzt. Weitere Einschränkungen bleiben Seite 1 bei PDFs, keine automatische Alt-Pin-Migration und kein Mehrseiten-Verschieben.


## Roadmap: MVP 6 Mangelmail und MVP 6.1 KI-Fachhinweis

Stand: 22.06.2026

Diese Funktionen sind geplant und noch nicht implementiert.

### MVP 6: Mailentwurf aus Beobachtung oder Mangel

Aus der Detailansicht einer Beobachtung soll die Aktion Mail an Verantwortlichen erstellen einen prüfbaren Entwurf erzeugen. Vorgeschlagene Empfänger stammen aus den projektbezogenen Firmen und Verantwortlichen.

Der Entwurf übernimmt soweit vorhanden:

- Titel, Typ und Beschreibung
- Hauptverantwortliche Firma
- weitere beteiligte Firmen und Verantwortliche
- CC beziehungsweise zur Kenntnis
- Rückfrage an Planer oder Bauleitung
- Fotos
- Planname, Planversion und Pinbezug
- Status, Priorität und Fristen
- höflichen und fachlich eindeutigen Mangeltext

Ein Mangel kann mehrere Beteiligte besitzen. Die Auswahl muss vor Erstellung und Versand änderbar bleiben. Die App versendet niemals automatisch: Der Nutzer prüft Empfänger, Text, Anlagen und Fristen und gibt den Entwurf ausdrücklich frei.

Langfristige Felder:

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

Die Empfängerfelder sollen stabile IDs verwenden und später auf projektbezogene Beteiligte beziehungsweise API-Relationen abbildbar sein.

### MVP 6.1: Quellenbasierter KI-Fachhinweis

Optional kann die App einen vorsichtig formulierten Fachhinweis vorschlagen, beispielsweise zu Herstellerangaben, Verarbeitungsrichtlinien oder technischen Regeln. Ein Anwendungsfall sind WDVS-Kreuzfugen an Fensteröffnungen.

Zulässige Grundlagen:

- hinterlegte Herstellerunterlagen
- freigegebene Projektunterlagen
- geprüfte interne Textbausteine
- zulässige Zusammenfassungen oder eigene Notizen zu Normen
- nachvollziehbar gespeicherte Quellenhinweise

Die KI darf Normen, Fundstellen oder Herstellervorgaben nicht frei erfinden. Ohne belastbare Quelle muss sie Unsicherheit kenntlich machen oder auf einen Fachhinweis verzichten. fachhinweis_quellen[] speichert die verwendeten Quellenbezüge.

Der Nutzer muss Fachhinweis, Quellen, Mailtext und Empfänger vor Übernahme oder Versand prüfen und bestätigen. ki_generiert und vom_nutzer_geprueft machen Erzeugung und Freigabe nachvollziehbar.

### Geplante Reihenfolge

1. MVP 6: regelbasierter Mailentwurf aus vorhandenen Beobachtungs-, Beteiligten-, Foto-, Plan-, Pin- und Fristdaten.
2. Mehrere Empfänger, CC und projektbezogene Beteiligte vollständig unterstützen.
3. Prüfen, Bearbeiten und explizite Freigabe vor Versand.
4. MVP 6.1: quellenbasierte Suche und vorsichtiger KI-Fachhinweis.
5. Erst danach eine optionale technische Versandintegration.


## MVP 6: Mailentwurf und PDF-Bericht

Stand: 22.06.2026

### Mailentwurf

In der mobilen Beobachtungsdetailansicht steht Mailentwurf erstellen zur Verfügung. Der Entwurf übernimmt Projekt, Adresse, Beobachtung, Typ, Beschreibung, Gewerk, Firma beziehungsweise Verantwortlichen, Frist, Priorität, Planbezug und die Anzahl vorhandener Fotos.

Empfängervorschläge werden aus den vorhandenen Stammdaten abgeleitet. Hauptempfänger, weitere Empfänger und CC bleiben bearbeitbar. Betreff, Mailtext, Rückmeldefrist, Nachbesserungsfrist und ein manueller technischer Hinweis können vor dem Speichern geändert werden.

Der Entwurf kann in die Zwischenablage kopiert werden. MVP 6 versendet keine E-Mail.

Projektbezogene Speicherung:

D:\Kai_BauSuite\daten\projekte\<project-id>\mail_drafts.json

Mailentwürfe verwenden stabile IDs und enthalten unter anderem mail_status, mail_entwurf_text, Empfängerfelder, Fristen, fachhinweis_text, ki_generiert = false und vom_nutzer_geprueft = false. Die robuste JSON-Speicherung erzeugt mail_drafts.json.bak.

### PDF-Bericht

PDF-Bericht erstellen öffnet eine kurze Berichtsvorbereitung mit einem optionalen, ausschließlich manuellen technischen Hinweis. Die PDF-Datei wird im mobilen Browser mit der lokal eingebundenen Bibliothek pdf-lib erzeugt und anschließend vom lokalen Server validiert und projektbezogen gespeichert.

Speicherorte:

D:\Kai_BauSuite\daten\projekte\<project-id>\reports\<bericht>.pdf
D:\Kai_BauSuite\daten\projekte\<project-id>\reports.json

Der Bericht enthält:

- neutralen Berichtskopf
- Projektname, Adresse und Berichtsdatum
- Beobachtung, Typ, Status und Priorität
- Gewerk, Firma, Verantwortlichen und Frist
- Beschreibung beziehungsweise Feststellung
- optionalen manuellen technischen Hinweis
- Planbezug
- Planausschnitt mit sichtbarer Pinmarkierung
- vorhandene Beobachtungsfotos
- Rückmelde- und Nachbesserungsseite
- Seitenzahlen

reports.json speichert stabile Berichts-ID, Projekt-, Aktivitäts-, Beobachtungs-, Plan-, Pin- und Fotobezüge, relativen Dateipfad, Dateigröße, Fachhinweis und Zeitstempel. reports.json.bak wird bei Änderungen erzeugt. Absolute Pfade werden nicht in den Fachdaten gespeichert.

### Planausschnitt

Für die mobile Berichtserzeugung rendert PDF.js die betroffene Planseite. Der Ausschnitt wird um x_rel und y_rel des Pins zentriert und an den Seitenrändern begrenzt. Eine rote Zielmarke zeigt die dokumentierte Position. PDF-Pins verwenden derzeit weiterhin page_number 1.

### Dateisicherheit

Der Server akzeptiert ausschließlich Inhalte mit gültigem PDF-Kopf und maximal 50 MB. Die Datei wird zunächst atomar geschrieben; schlägt die Metadatenspeicherung fehl, wird die neue Berichtsdatei wieder entfernt.

Beobachtungen, Pins, Fotos und plans.json werden bei der Berichtserzeugung nur gelesen.

### Getesteter Bericht

Testbeobachtung: OBS-20260622090906-FBAE94

Gespeicherter Bericht:

D:\Kai_BauSuite\daten\projekte\PRJ-20260619182118-195920\reports\2026-06-22_Mangel_Neuer_test_pin_987248.pdf

Der vierseitige A4-Bericht wurde mit Poppler gerendert und visuell geprüft. Planausschnitt, Pinmarkierung, Foto, Berichtsdaten und Rückmeldeseite sind sichtbar und ohne Überlagerung dargestellt.

### Bekannte Einschränkungen

- Kein echter Mailversand.
- Keine automatische KI-Fach- oder Normrecherche.
- Technischer Hinweis ist manuell.
- PDF-Planbezug verwendet im aktuellen MVP Seite 1.
- Noch keine Berichtsvorlagen, Logos oder konfigurierbaren Briefköpfe.
- Mobile PDF-Erzeugung muss zusätzlich auf dem konkret verwendeten iOS-/Android-Browser geprüft werden.

## MVP 6.1: Klickbare Dashboard-Kacheln

Stand: 22.06.2026

Die fünf Kennzahlen im mobilen Projekt-Dashboard sind als große Touch-Flächen ausgeführt und öffnen jeweils eine gefilterte Beobachtungsliste:

- **Offene Beobachtungen:** alle Statuswerte außer `erledigt`
- **Offene Mängel:** Typ `Mangel` und Status nicht `erledigt`
- **Überfällig:** gültige Frist vor dem aktuellen Tag und Status nicht `erledigt`
- **Heute / nächste 7 Tage:** gültige Frist von heute bis einschließlich heute plus sieben Tage und Status nicht `erledigt`
- **Offene Fragen:** Typ `Frage` und Status nicht `erledigt`

Status und Typ werden ohne Beachtung von Groß-/Kleinschreibung ausgewertet. Leere oder ungültige Fristen werden ignoriert. Unterstützt werden ISO-Daten sowie vorhandene deutsche Datumsformate mit Punkt oder Schrägstrich.

Die Ergebnisansicht zeigt Filtertitel, Trefferzahl, Leerzustand und eine einspaltige Kartenliste. Jede Karte enthält die wichtigsten Beobachtungsdaten sowie vorhandene Plan- und Fotohinweise und öffnet die bestehende Beobachtungsdetailansicht. Dadurch bleiben Bearbeiten, Fotos, `Auf Plan anzeigen`, Mailentwurf und PDF-Bericht unverändert erreichbar.

Der Link `Alle` bei den letzten Beobachtungen öffnet die vollständige Beobachtungsliste des Projekts. `Alle` bei den letzten Aktivitäten öffnet weiterhin die vollständige Aktivitätsliste. Die zuletzt angezeigten Beobachtungen und Aktivitäten bleiben direkt antippbar.

Die Filterung erfolgt ausschließlich im mobilen Client auf den bereits geladenen Projektdaten. Es wurden keine fachlichen JSON-Strukturen, Projektdaten, Plandaten oder Server-Schreibwege geändert.

### Bekannte Einschränkungen

- Die Filteransicht bietet noch keine frei kombinierbaren Filterfelder.
- Ungültige Fristwerte werden bewusst nicht als fällig oder überfällig eingestuft.
- Die integrierte Browsersteuerung stand beim automatisierten Test unter Windows nicht zur Verfügung; Server, API, ausgelieferte Ressourcen und Filterlogik wurden deshalb ohne Datenänderung geprüft.

Nächste Schritte:

- MVP 6.2: quellenbasierter Fachhinweis
- MVP 7: Deutsch-/Albanisch-Sprachfunktion

## MVP 6.2: Fachhinweis-Bausteine und Quellenbasis

Stand: 22.06.2026

MVP 6.2 ergänzt eine lokale, strukturierte Quellenbasis für kurze technische Hinweisbausteine. Es findet keine automatische KI-, Norm- oder Herstellerrecherche statt. Ein Fachhinweis wird erst wirksam, wenn der Nutzer Baustein, Text, Quelle und Prüfstatus gelesen und bewusst übernommen hat.

### Speicherort und Datenmodell

```text
D:\Kai_BauSuite\daten\fachwissen\fachhinweise.json
```

Jeder Datensatz besitzt eine stabile `fachhinweis_id` sowie Titel, Gewerk, Thema, Stichworte, Kurztext, Empfehlung beziehungsweise Maßnahme, Quellentyp, Quellenname, Abschnitt, optionales Quelldatum, Hersteller und System. `pruefstatus`, `aktiv`, `created_at` und `updated_at` steuern Freigabestand und Lebenszyklus.

Zulässige Prüfstatus:

- `zu prüfen`
- `ungeprüft`
- `geprüft`
- `freigegeben`

Die Speicherung erfolgt mit der bestehenden atomaren JSON-Funktion. Bei Änderungen wird `fachhinweise.json.bak` angelegt. Es werden keine langen Normtexte gespeichert, sondern kurze eigene Zusammenfassungen und nachvollziehbare Quellenverweise.

### Standardbausteine

Die initiale Datei enthält drei aktive Beispiele mit Prüfstatus `zu prüfen`:

- WDVS - Kreuzfugen an Öffnungsecken
- Fensteranschluss - Abdichtung prüfen
- Elektroinstallation - Abweichung vom Plan

Die Beispiele sind ausdrücklich keine fachliche Freigabe. Projekt-, System- oder Herstellervorgaben müssen vor Verwendung geprüft werden.

### Mobile Bedienung

Die Beobachtungsdetailansicht enthält den Abschnitt `Technischer Hinweis`. `Fachhinweis auswählen` öffnet eine nach Gewerk, Titel, Thema und Stichworten gewichtete Vorschlagsliste. Der Nutzer sieht Kurztext, Maßnahme, Quelle und Prüfstatus, kann den zu übernehmenden Text bearbeiten und muss die Übernahme ausdrücklich bestätigen.

Bei einer Beobachtung werden ausschließlich folgende Verknüpfungsdaten ergänzt:

- `fachhinweis_id`
- `fachhinweis_text_uebernommen`
- `fachhinweis_quelle`
- `fachhinweis_pruefstatus`
- `fachhinweis_vom_nutzer_bestaetigt`
- aktualisierte Versions- und Zeitstempel

Beobachtungen ohne diese optionalen Felder bleiben vollständig kompatibel.

Über die Schnellaktion `Fachhinweise` im Projekt-Dashboard können Bausteine angezeigt, angelegt, bearbeitet und aktiv beziehungsweise inaktiv gesetzt werden. Die mobile Verwaltung dient im MVP als einfache Adminansicht.

### Mailentwurf und PDF-Bericht

Ist ein Fachhinweis übernommen, enthält der Mailentwurf einen Abschnitt `Technischer Hinweis` mit Text, Quelle, Prüfstatus und einem Prüfhinweis, solange der Baustein nicht freigegeben ist. Die Mailmetadaten speichern Quelle und Prüfstatus. Es erfolgt weiterhin kein Mailversand.

Das vorhandene Feld `Technischer Hinweis` im PDF-Bericht wird mit dem übernommenen Text vorbelegt. Quelle, Prüfstatus und Prüfhinweis werden mit ausgegeben und in `reports.json` dokumentiert. Planbezug, Pin, Fotos und Rückmeldeseite bleiben unverändert.

### API

- `GET /api/knowledge-hints`
- `POST /api/knowledge-hints`
- `PUT /api/knowledge-hints/<fachhinweis-id>`
- `PUT /api/projects/<project-id>/observations/<observation-id>/knowledge-hint`

### Testnachweis

Getestete Beobachtung: `OBS-20260622090906-FBAE94` (`Neuer test pin`) mit Planbezug, Pin und Foto.

Erfolgreicher Test-Mailentwurf: `MAIL-20260622153602-A466FF`.

Erfolgreicher Testbericht: `RPT-20260622153602-6F91DC`:

```text
D:\Kai_BauSuite\daten\projekte\PRJ-20260619182118-195920\reports\2026-06-22_MVP62_Fachhinweis_Test_6F91DC.pdf
```

Der fünfseitige Bericht wurde gerendert und visuell geprüft. Fachhinweis, Quelle und Prüfstatus sind lesbar; Planausschnitt mit Pin, Beobachtungsfoto und Rückmeldeseite sind weiterhin vorhanden.

### Einschränkungen und nächster Schritt

- Keine automatische KI-Normrecherche.
- Keine automatische fachliche Freigabe.
- Keine Behauptung zu DIN- oder Herstellervorgaben ohne hinterlegten Quellenverweis.
- Vorschläge beruhen auf einfacher lokaler Gewichtung, nicht auf semantischer KI-Suche.
- Nutzer bleibt für Prüfung und Freigabe verantwortlich.

Nächster Schritt: MVP 7 Deutsch-/Albanisch-Sprachfunktion oder optional MVP 6.3 KI-gestützte Auswahl ausschließlich aus freigegebenen Fachhinweisen.

## Roadmap: Raum- und Blickrichtungszuordnung

Stand: 22.06.2026

### Ziel

Fotos, Panoramaaufnahmen und kurze Videos sollen später nicht nur einer Beobachtung, sondern auch einem räumlichen Standpunkt und einer Blickrichtung zugeordnet werden können. Damit wird nachvollziehbar, in welchem Raum und Geschoss die Aufnahme entstand, wo der Nutzer im Grundriss stand und welche Wand beziehungsweise welcher Bereich dokumentiert wurde.

Das Modul ist eine spätere Grundlage für:

- Soll-Ist-Abgleich von Planung und tatsächlicher Ausführung, insbesondere Elektro
- raumbezogene Foto- und Panoramadokumentation
- Video-Rundgänge
- Zuordnung zu Plan-Pins und Beobachtungen
- spätere IFC-/BIM-Räume, Wände und Bauteile

Es gehört nicht zum aktuellen Alpha-Stand. Die aktuellen Prioritäten bleiben MVP 6.2, anschließend die Deutsch-/Albanisch-Sprachfunktion und danach die Alpha-Vorbereitung.

### Datenmodell-Idee

Eine spätere Aufnahmezuordnung soll mindestens folgende Felder unterstützen:

```text
project_id
plan_id
room_id                 optional
ifc_guid                optional
raum_name
geschoss_bereich
position_x_rel
position_y_rel
blickrichtung_grad      0 bis unter 360 Grad
aufnahme_typ            Foto | Panorama | Video
observation_id          optional
pin_id                  optional
beschreibung
created_at
updated_at
```

Erweiterbare IFC-/BIM-Bezüge:

```text
building_storey
wall_id
element_id
soll_punkt_id
```

`position_x_rel` und `position_y_rel` beziehen sich auf die tatsächliche Planfläche und werden relativ gespeichert. Absolute Bildschirm- oder Pixelkoordinaten sind ungeeignet. Die Blickrichtung wird als Winkel gespeichert. `room_id` und `ifc_guid` bleiben optional, damit dieselbe Zuordnung zunächst mit 2D-PDF- oder Bildplänen und später mit IFC-/BIM-Modellen arbeiten kann.

Die Aufnahme selbst bleibt ein eigenständiges Foto-, Panorama- oder Videoobjekt. Raum-, Plan-, Beobachtungs- und Pin-Bezüge werden über stabile IDs verknüpft. Dadurch kann dieselbe Aufnahme später in Beobachtungen, Berichten, Rundgängen und Soll-Ist-Prüfungen verwendet werden.

### Stufenweise Umsetzung

#### Stufe 1: Manuelle Zuordnung

Die erste robuste Version arbeitet bewusst ohne automatische Raumerkennung:

1. Nutzer wählt Raum, Geschoss oder Planbereich.
2. Nutzer setzt seinen Standpunkt auf dem Grundriss.
3. Nutzer richtet einen Richtungspfeil aus.
4. Nutzer nimmt ein Foto auf oder wählt eine vorhandene Aufnahme.
5. App speichert Aufnahme, relative Position und Blickrichtung.

Die manuelle Korrektur bleibt auch dann erhalten, wenn später Sensordaten oder KI-Vorschläge hinzukommen.

#### Stufe 2: Panorama

Eine Panoramaaufnahme wird mit Raum, Standpunkt sowie Start- oder Blickrichtung gespeichert. Sie kann einer Beobachtung oder unmittelbar einem Raum zugeordnet werden und soll den vollständigen Raumzustand nachvollziehbar machen.

#### Stufe 3: Video und Rundgang

Kurze Rundum-Videos oder Raumrundgänge erhalten Raum-, Startpunkt- und gegebenenfalls Bewegungsrichtungsdaten. Später können daraus Einzelbilder, Blickrichtungen und Wandbereiche abgeleitet werden.

#### Stufe 4: Soll-Ist-Abgleich

Für Elektropläne werden geplante Sollpunkte wie Steckdosen, Schalter und Lichtauslässe mit räumlich zugeordneten Aufnahmen verglichen. Die Anwendung soll später unterstützen zu bestimmen:

- welche Wand aufgenommen wurde
- welche Sollpunkte in diesem Sichtbereich liegen müssten
- welche Punkte vor Ort dokumentiert wurden
- welche Elemente fehlen oder falsch positioniert erscheinen
- welche zusätzlichen Ausführungen vorhanden sind

Ergebnisse bleiben Vorschläge und müssen durch den Nutzer geprüft werden.

#### Stufe 5: IFC/BIM, Sensorik und AR

Langfristig können Raum- und Bauteilbezüge aus IFC über `ifc_guid`, `room_id`, Geschoss, Wand und Element hergestellt werden. Kompass, Gyroskop, Bewegungssensoren und Kamera-Metadaten können Standpunkt und Blickrichtung unterstützen. Da Sensordaten in Gebäuden ungenau sein können, ist stets eine manuelle Kontrolle und Korrektur erforderlich.

Automatische Raumerkennung, Steckdosen-/Schaltererkennung, Wandzuordnung sowie AR-/SLAM-gestützte Positionierung bleiben langfristige Optionen und werden nicht für den aktuellen Alpha-Stand umgesetzt.

### Beziehungen zu bestehenden Modulen

- **Pläne:** relative Position bezieht sich auf eine konkrete Planfläche und Planseite; die Planversionierung bleibt unabhängig.
- **Pins:** ein Aufnahme-Standpunkt kann mit einem vorhandenen Pin verknüpft sein, ist aber fachlich nicht zwingend derselbe Punkt wie der beobachtete Mangel.
- **Fotos und Beobachtungen:** Zuordnung ist optional, damit auch raumbezogene Bestandsdokumentation ohne Mangel möglich bleibt.
- **Panorama und Video:** verwenden dieselbe räumliche Grundstruktur wie Fotos, ergänzen später aufnahmespezifische Metadaten.
- **IFC/BIM:** optionale IDs lösen die Zuordnung von einer ausschließlichen Bindung an 2D-PDF-Pläne.
- **Soll-Ist-Abgleich:** räumliche Position und Blickrichtung grenzen den relevanten Plan-, Wand- und Bauteilbereich ein.

Für diese Roadmap-Ergänzung wurden keine App-Funktionen, APIs oder fachlichen JSON-Datenstrukturen verändert.

## MVP 7a: Freitext- und Diktat-Erfassung

Stand: 22.06.2026

### Umfang

Das mobile Projekt-Dashboard enthält die Schnellaktion `Per Sprache/Text erfassen`. Sie öffnet ein großes Freitextfeld, das auf dem Smartphone mit der normalen Diktierfunktion der Bildschirmtastatur befüllt werden kann. MVP 7a zeichnet selbst kein Audio auf.

Nach `Auswerten` erzeugt der lokale Server einen regelbasierten Strukturvorschlag. Die Vorschau zeigt:

- Originaltext
- erkannte Sprache: Deutsch, Albanisch, gemischt oder unbekannt
- vorgeschlagenen Titel
- Typ: Mangel, Hinweis, Frage oder Aufgabe
- deutsche Beschreibung, soweit über einfache Regeln ableitbar
- Gewerk
- Firma und Verantwortlichen aus den vorhandenen Stammdaten
- Status, Priorität und Frist
- deutliche Alpha- und Übersetzungswarnungen

Alle fachlichen Felder bleiben in der Vorschau bearbeitbar. `Bearbeiten` fokussiert die Eingabemaske. Erst nach aktivierter Bestätigung und `Übernehmen` wird eine Beobachtung gespeichert. Ohne Bestätigung lehnt der Server einen als strukturiert gekennzeichneten Vorschlag ab.

Wenn keine Aktivität ausgewählt ist, verwendet die bestehende mobile Logik eine heutige `Baustellenrunde` oder legt sie bei Bedarf an. Dadurch entsteht kein Fehler wegen fehlender `activity_id`.

### Analyse-Endpunkt

```text
POST /api/ai/parse-observation
```

Eingabe:

```json
{
  "project_id": "PRJ-...",
  "raw_text": "Freie Eingabe oder Diktat",
  "activity_id": "optional"
}
```

Der Server lädt Gewerke, Firmen und Verantwortliche selbst aus der konfigurierten Datenbasis. Stammdatenlisten des Clients werden nicht als maßgeblich übernommen.

Die Antwort enthält `analysis_mode = rule-based-alpha`, `external_ai_active = false`, erkannte Sprache, Strukturfelder, Stammdatenvorschläge, Konfidenz und Warnungen.

### Deutsch und Albanisch

- Deutsche Eingaben bleiben unverändert und werden über Schlüsselbegriffe strukturiert.
- Albanische und gemischte Eingaben werden über eine kleine, transparente Begriffsliste erkannt.
- Nur wenige bekannte Ausdrücke wie `te dritarja` oder `javën tjetër` können regelbasiert übertragen werden.
- Eine vollständige oder verlässliche Übersetzung ist nicht aktiv.
- Die Oberfläche zeigt deshalb ausdrücklich `Übersetzung/KI-Auswertung noch Alpha`.

Es werden keine Norm-, Hersteller- oder Fachbehauptungen erzeugt. Fachhinweise bleiben ausschließlich im getrennten MVP-6.2-Workflow mit Quelle und Nutzerbestätigung.

### Gespeicherte optionale Felder

Eine übernommene Beobachtung erhält zusätzlich:

```text
original_sprachtext
original_sprache
ki_strukturierung_verwendet = true
ki_vorschlag_bestaetigt = true
echte_ki_verwendet = false
analyse_modus = regelbasiert-alpha
```

Bestehende Beobachtungen ohne diese Felder bleiben kompatibel. Die Windows-App liest und bearbeitet weiterhin ihre bekannten Felder und erhält unbekannte Zusatzfelder beim Speichern des vorhandenen Objekts.

### Regelumfang MVP 7a

- WDVS, Außenputz, Putz und Fassade schlagen `WDVS / Putz` vor.
- Elektro, Steckdose, Schalter, Leitung und Lichtauslass schlagen `Elektro` vor.
- Namen wie `Labi` werden gegen Verantwortliche und Firmenansprechpartner abgeglichen.
- `hoch`, `Priorität hoch` und `dringend` beeinflussen die Priorität.
- `heute`, `morgen` und `nächste Woche` erzeugen einfache Fristvorschläge.
- Kreuzfugen und erkennbare Problemformulierungen werden als Mangel vorgeschlagen.

### Testnachweis

Regeltests:

- `Außenputz Kreuzfugen am Fenster, Priorität hoch, Frist nächste Woche` -> Deutsch, Mangel, WDVS / Putz, hoch, Frist 29.06.2026.
- `Außenputz te dritarja nicht gut, Labi prüfen` -> gemischt, Mangel, WDVS / Putz, LTH Bau GmbH und Labi.

Gespeicherte Testbeobachtung:

```text
OBS-20260622190925-78A0F6
Außenputz am Fenster prüfen [MVP 7a Test]
```

Die Beobachtung wurde neu geladen und mit dem Windows-Core gelesen. Plan-, Foto- und Berichtsdateien waren weiterhin über ihre vorhandenen Endpunkte erreichbar. Pins, Fotos, Fachhinweise, Mailentwürfe und Berichte blieben erhalten.

### Einschränkungen und nächster Schritt

- Keine externe KI.
- Keine vollständige Deutsch-/Albanisch-Übersetzung.
- Keine eigene Audioaufnahme oder Transkription.
- Keine semantische Fachprüfung.
- Keine automatische Speicherung oder Weitergabe ohne Nutzerbestätigung.

Nächster Schritt ist MVP 7b: optionale echte KI-/Übersetzungsanbindung, Transkription und erweiterte Alpha-Tests. Zugangsdaten dürfen dabei ausschließlich über sichere Konfiguration beziehungsweise Umgebungsvariablen eingebunden werden.

## MVP 7b: Browser-Audioaufnahme

Stand: 22.06.2026

### Mobile Bedienung

Der bestehende Bereich `Per Sprache/Text erfassen` enthält zusätzlich:

- `Aufnahme starten`
- `Aufnahme stoppen`
- sichtbaren Status `Aufnahme läuft…`
- nativen Audio-Player für die gespeicherte Aufnahme
- `Audiodatei aufnehmen / auswählen` als Browser-Fallback
- Anzeige der zuletzt gespeicherten Projektaufnahmen
- weiterhin Freitextfeld, `Text übernehmen` und die vollständige MVP-7a-Auswertung

In einem sicheren Browserkontext verwendet die Oberfläche `navigator.mediaDevices.getUserMedia` und `MediaRecorder`. Unterstützte MIME-Typen werden vor dem Start abgefragt. Bevorzugt werden WebM/Opus, MP4/M4A, WebM und Ogg/Opus.

Die derzeitige Handy-Adresse verwendet lokales HTTP. Chrome, Firefox und Safari stellen den direkten Mikrofonzugriff über `getUserMedia` normalerweise nur in einem sicheren HTTPS-Kontext bereit. Wenn MediaRecorder deshalb nicht verfügbar ist, öffnet `Aufnahme starten` automatisch den nativen Audio-Aufnahme-/Dateidialog des Geräts. Ob dieser Dialog unmittelbar einen Recorder oder eine Dateiauswahl anbietet, hängt vom mobilen Betriebssystem und Browser ab.

### Datenablage

Projektbezogene Metadaten:

```text
D:\Kai_BauSuite\daten\projekte\<project-id>\audio.json
```

Audiodateien:

```text
D:\Kai_BauSuite\daten\projekte\<project-id>\audio\<audio-id>\<audio-id>.<endung>
```

In den Metadaten werden ausschließlich relative Pfade gespeichert. Das Modell enthält:

```text
audio_id
project_id
activity_id               optional bis zur Zuordnung
observation_id            optional bis zur Zuordnung
original_filename
local_filename
relative_path
mime_type
file_size
duration_seconds          optional
transcription_status
created_at
updated_at
active
```

Die Audiodatei wird direkt nach Aufnahme oder Auswahl gespeichert. Nach bestätigter Übernahme des Strukturvorschlags wird sie über stabile IDs der neuen Beobachtung und Aktivität zugeordnet. `audio.json` wird atomar gespeichert und bei Änderungen als `audio.json.bak` gesichert.

Erlaubte Formate:

- WebM
- Ogg
- MP4/M4A
- MP3
- WAV

Der Server prüft MIME-Typ und Dateisignatur und begrenzt Aufnahmen auf 25 MB.

### Transkriptionsschnittstelle

Vorbereitet ist:

```text
POST /api/ai/transcribe-audio
```

Der Endpunkt prüft Projekt und Audio-ID, führt aber keine externe Verarbeitung aus. Die Antwort lautet sinngemäß:

```text
Audio wurde gespeichert. Automatische Transkription ist noch nicht aktiv.
```

`external_ai_active` bleibt `false`. Es werden keine API-Schlüssel gespeichert und keine externen Dienste aufgerufen.

### Testnachweis

Integrationstest:

```text
D:\Kai_BauSuite\mobile\tests\test_mvp7b_audio.py
```

Gespeicherte WAV-Testaufnahme:

```text
audio_id: AUD-20260622192909-82AB6A
relative_path: audio/AUD-20260622192909-82AB6A/AUD-20260622192909-82AB6A.wav
observation_id: OBS-20260622190925-78A0F6
```

Geprüft wurden Upload, Dateisignatur, Metadaten, Backup, Transkriptionsstatus, Beobachtungszuordnung, erneutes Laden und bytegleiche Dateiausgabe. MVP 7a funktioniert weiterhin. Plan-, Foto- und Berichtsdateien wurden über die bestehenden Endpunkte erfolgreich geladen.

Ein physischer Mikrofontest auf einem konkreten Android-/iOS-Gerät sowie eine direkte Firefox-/Chrome-Gerätematrix konnten in der Entwicklungsumgebung nicht durchgeführt werden. Die technische MediaRecorder-Unterstützung und der HTTP-Fallback sind implementiert; die reale Gerätefreigabe muss im WLAN-Test geprüft werden.

### Nächster Schritt

- HTTPS beziehungsweise vertrauenswürdigen sicheren lokalen Ursprung für direkten MediaRecorder-Zugriff festlegen
- echte Transkription für Deutsch, Albanisch und gemischte Sprache anbinden
- Übersetzung und Strukturierung weiterhin nur nach Nutzerbestätigung
- Browsermatrix auf konkreten iOS-/Android-Geräten testen

## MVP 7b.1: Direkte Mikrofonaufnahme ueber lokales HTTPS

Stand: 22.06.2026

Die mobile Web-App kann Audio in einem sicheren Browserkontext direkt ueber `navigator.mediaDevices.getUserMedia` und `MediaRecorder` aufnehmen. Der Ablauf umfasst `Aufnahme starten`, laufende Zeitanzeige, `Aufnahme stoppen`, lokalen Upload und Wiedergabe im vorhandenen HTML-Audioplayer. MVP 7a, die manuelle Texteingabe und die regelbasierte Strukturierung bleiben unveraendert.

### Startvarianten

HTTP bleibt fuer Entwicklung und den bisherigen Datei-Fallback erhalten:

```text
D:\Kai_BauSuite\mobile\Start-MobileServer.cmd
http://192.168.178.49:8000
```

Direkte Mikrofonaufnahme wird ueber die neue lokale HTTPS-Testvariante bereitgestellt:

```text
D:\Kai_BauSuite\mobile\Start-MobileServer-HTTPS.cmd
https://192.168.178.49:8443
```

`server.py` akzeptiert dafuer optional `--https`, `--certfile` und `--keyfile`. Der Statusendpunkt gibt das aktive Schema und die passenden lokalen Adressen aus. HTTP und HTTPS verwenden dieselbe konfigurierte Datenbasis.

### Lokale Zertifikate

Die Testzertifikate liegen unter:

```text
D:\Kai_BauSuite\mobile\certs
```

Die lokale CA und der private Schluessel sind ausschliesslich fuer das private Test-WLAN bestimmt. Das Serverzertifikat enthaelt `localhost`, den PC-Namen, `127.0.0.1` und beim Erzeugen erkannte private IP-Adressen, aktuell `192.168.178.49`. Bei einer geaenderten PC-IP muessen die Zertifikate mit `generate_https_cert.py` neu erzeugt werden.

Fuer einen verlaesslichen sicheren Browserkontext muss `kai-bausuite-local-ca.crt` auf dem Testgeraet als vertrauenswuerdige lokale CA installiert beziehungsweise bestaetigt werden. Eine lediglich uebergangene Zertifikatswarnung reicht je nach Browser nicht zwingend fuer `getUserMedia` aus. Im spaeteren Online-Betrieb wird ein regulaeres Zertifikat einer echten HTTPS-Domain verwendet.

### Aufnahme und Fallback

- Direkte Aufnahme wird nur angeboten, wenn `window.isSecureContext`, `getUserMedia` und `MediaRecorder` verfuegbar sind.
- Der Browser fragt die Mikrofonberechtigung ab.
- Die Statuszeile zeigt die laufende Aufnahmezeit im Format `MM:SS`.
- Nach dem Stoppen wird das Audio wie in MVP 7b projektbezogen gespeichert und direkt abspielbar angezeigt.
- Wenn HTTPS, Berechtigung oder Browserunterstuetzung fehlen, erscheint eine klare Meldung und der aufklappbare Fallback `Audio-Datei auswaehlen / Diktiergeraet verwenden`.
- Es gibt weiterhin keine automatische Transkription, keine externe KI, keine API-Schluessel und keine verdeckte Datenuebertragung.

Bevorzugter Geraetetest ist Chrome oder Edge auf Android. Firefox kann je nach Geraet, Zertifikatsspeicher und Berechtigungsmodell abweichen. Der reale Mikrofontest muss auf dem konkreten Smartphone erfolgen.

### Verifikation

Geprueft wurden Python- und JavaScript-Syntax, Zertifikatskette und SAN-Eintraege, HTTP-Start, HTTPS-Start, Auslieferung der echten Projektliste, sichere Kontextpruefung, Timerlogik und Fallback. Die physische Mikrofonfreigabe konnte in der Entwicklungsumgebung nicht automatisiert werden. `plans.json` blieb unveraendert.

Naechster Schritt: echte Transkription und Uebersetzung fuer Deutsch, Albanisch und gemischte Sprache, weiterhin nur mit Nutzerpruefung und ohne fest gespeicherte API-Schluessel.

## MVP 7c: Transkriptionsschnittstelle und Deutsch/Albanisch-Vorbereitung

Stand: 22.06.2026

MVP 7c erweitert die vorhandene HTTPS-Audioaufnahme um einen sicheren, derzeit deaktivierten Transkriptionsvertrag. Es wird kein externer KI-Dienst aufgerufen und kein API-Schluessel in Code, Konfiguration oder Projektdaten gespeichert.

### Konfiguration

Die zentrale Datei `D:\Kai_BauSuite\config\settings.json` enthaelt folgende neue Felder:

```text
ai_transcription_enabled
ai_provider
ai_endpoint
ai_model_transcription
ai_model_text
ai_api_key_env_name
```

`ai_api_key_env_name` speichert ausschliesslich den Namen einer spaeteren Umgebungsvariable, niemals den Schluessel selbst. Eine Konfiguration gilt nur dann als vollstaendig, wenn die Funktion aktiviert ist, Provider, Endpunkt und Transkriptionsmodell gesetzt sind und die benannte Umgebungsvariable zur Laufzeit vorhanden ist. Im aktuellen Stand sind alle Felder leer beziehungsweise deaktiviert.

### API-Vertrag

```text
POST /api/ai/transcribe-audio
```

Eingabe:

```text
project_id
audio_id
observation_id optional
language_hint: de | sq | mixed | auto
```

Ausgabe:

```text
success
status
transcript_text
detected_language
translated_text_de
error_message
provider
confidence
language_hint
external_ai_active
```

Projekt, Audio-ID, optionale Beobachtung und Sprachhinweis werden validiert. Solange kein Dienst konfiguriert ist, antwortet der Endpunkt mit `success=false`, `status=not_configured` und `Automatische Transkription ist noch nicht konfiguriert.` Die Audioaufnahme bleibt gespeichert und abspielbar. Selbst bei einer vollstaendigen Platzhalterkonfiguration wird noch kein Netzwerkaufruf ausgefuehrt; bis zur bewussten Provider-Implementierung lautet der Status `provider_adapter_pending`.

### Mobile Bedienung

Nach einer Aufnahme beziehungsweise Audioauswahl zeigt `Per Sprache/Text erfassen`:

- Sprachhinweis `auto`, `de`, `sq` oder `mixed`
- Button `Audio transkribieren`
- Status fuer laufend, erfolgreich, nicht konfiguriert oder Fehler
- bearbeitbares Feld `Transkript / manueller Text`
- Button `Text auswerten`

Ohne aktiven Dienst kann der Nutzer den Text manuell eingeben oder bearbeiten. `Text auswerten` uebergibt ihn an die bestehende regelbasierte MVP-7a-Auswertung. Dadurch bleiben Vorschlaege fuer Typ, Titel, Beschreibung, Gewerk, Firma, Verantwortlichen, Prioritaet, Frist und Status erhalten. Es wird keine Deutsch/Albanisch-Uebersetzung vorgetaeuscht; die Oberflaeche kennzeichnet sie als noch nicht aktiv.

### Beobachtungsmetadaten

Bei bestaetigter Uebernahme koennen Beobachtungen zusaetzlich enthalten:

```text
audio_id
original_sprachtext
original_sprache
transkript_text
deutsche_uebersetzung
albanischer_hinweistext
ki_transkription_verwendet
ki_strukturierung_verwendet
ki_vorschlag_bestaetigt
updated_at
```

Die `audio_id` wird gegen die aktiven Projektaufnahmen validiert. Bei einem manuellen Transkript bleibt `ki_transkription_verwendet=false`. Bestehende Beobachtungen ohne diese optionalen Felder bleiben kompatibel.

### Voice-First-Zielbild

Langfristig ist folgender bestaetigungspflichtiger Ablauf vorgesehen: Sprachvorgang starten, aufnehmen, transkribieren, Projekt/Aktivitaet/Beobachtung vorschlagen, optional Foto und Pin zuordnen, Fachhinweis pruefen sowie Mail/PDF vorbereiten. MVP 7c baut nur den Transkriptions- und Uebergabepunkt; es automatisiert diesen Gesamtworkflow noch nicht.

### Verifikation und Einschraenkungen

Ein isolierter Integrationstest prueft deaktivierte Transkription, gemischten manuellen Text, MVP-7a-Auswertung, Beobachtungsspeicherung und erneutes Laden der neuen Felder. Der reale HTTPS-Bestandstest hat Projekt, Aktivitaeten, Beobachtungen, Plaene, Fotos, Pins, Fachhinweise, Mailentwuerfe, Berichte und Audio weiterhin geladen. Es wurden keine Testdaten im produktiven Projekt angelegt. `plans.json` blieb unveraendert.

Naechster Schritt: bewusste Provider-Auswahl und echte Transkriptions-/Uebersetzungsanbindung fuer Deutsch, Albanisch und gemischte Sprache; danach der schrittweise Voice-First-Baustellenworkflow.

## MVP 7d: OpenAI-Transkription und Deutsch/Albanisch-Strukturierung

Stand: 22.06.2026

MVP 7d implementiert einen OpenAI-Provideradapter fuer bewusst ausgeloeste Audio-Transkription und strukturierte Beobachtungsvorschlaege. Ohne `OPENAI_API_KEY` wird kein externer Dienst aufgerufen; die lokale regelbasierte MVP-7a-Auswertung bleibt verfuegbar.

Offizielle technische Grundlagen:

- Speech-to-text: `https://developers.openai.com/api/docs/guides/speech-to-text`
- Structured Outputs: `https://developers.openai.com/api/docs/guides/structured-outputs`

### Sichere Konfiguration

`D:\Kai_BauSuite\config\settings.json` enthaelt nur Konfigurationswerte und den Namen der Schluesselvariable:

```text
ai_transcription_enabled: true
ai_provider: openai
ai_model_transcription: gpt-4o-mini-transcribe
ai_model_text: gpt-4o-mini
ai_api_key_env_name: OPENAI_API_KEY
```

Der echte API-Schluessel wird ausschliesslich zur Laufzeit aus der Windows-Umgebungsvariable `OPENAI_API_KEY` gelesen. Er wird nicht in JSON, Code, API-Antworten oder Logs geschrieben. Nach dem Anlegen beziehungsweise Aendern der Umgebungsvariable muss der Mobile Server neu gestartet werden.

Empfohlene Einrichtung ueber Windows: `Systemeigenschaften > Erweitert > Umgebungsvariablen > Benutzervariablen > Neu`. Variablenname ist `OPENAI_API_KEY`, Variablenwert ist der persoenliche API-Schluessel. Der Schluessel darf nicht in Projektdateien oder Startskripte eingetragen werden.

### Provideradapter

`D:\Kai_BauSuite\mobile\openai_provider.py` verwendet ausschliesslich Python-Standardbibliotheken.

Transkription:

```text
POST https://api.openai.com/v1/audio/transcriptions
```

- Multipart-Upload der projektbezogenen Audiodatei
- konfigurierbares Transkriptionsmodell
- optionaler Sprachhinweis `de` oder `sq`; `mixed` und `auto` lassen die Erkennung offen
- maximal 25 MB
- unterstuetzte Providerformate: MP3, MP4, MPEG, MPGA, M4A, WAV und WebM
- kontrollierte Meldungen fuer fehlenden/abgelehnten Schluessel, Dateifehler, Formatfehler, Timeout, Netzwerk, Rate Limit und leere Antwort

Strukturierung:

```text
POST https://api.openai.com/v1/responses
```

Die Responses API verwendet ein strenges JSON-Schema. Der Prompt verbietet erfundene Normen, Herstelleranforderungen, Rechtsbewertungen und freie Fachbehauptungen. Stammdaten- und Fachhinweis-IDs werden nach der Antwort serverseitig gegen die vorhandenen Listen geprueft; unbekannte IDs werden verworfen.

### Lokale API-Endpunkte

```text
POST /api/ai/transcribe-audio
POST /api/ai/structure-observation
```

`transcribe-audio` liest die Audiodatei nur ueber den gespeicherten relativen Projektpfad. `structure-observation` erhaelt Original-/Transkripttext, optionale Aktivitaets-, Plan- und Pin-IDs sowie die vorhandenen Gewerke, Firmen, Verantwortlichen und freigegebenen Fachhinweis-Bausteine. Plan- und Pin-IDs werden nur gelesen und validiert.

Ohne Schluessel antwortet die Transkription mit `not_configured`. Die Strukturierung liefert einen `rule_based_fallback` aus MVP 7a. Bei Providerfehlern bleibt die App bedienbar und verwendet ebenfalls den lokalen Fallback.

### Mobile Bedienung und Datenschutz

Der Ablauf ist:

1. Audio aufnehmen oder Text eingeben.
2. `Audio transkribieren` bewusst antippen.
3. Transkript pruefen und korrigieren.
4. `Strukturvorschlag erzeugen` bewusst antippen.
5. Vorschlag, Sprache, deutsche Beschreibung, Beteiligte, Fachhinweis-Vorschlag, Prioritaet und Frist pruefen.
6. Erst mit `Uebernehmen` wird gespeichert.

Die Oberflaeche weist darauf hin, dass Audio und Text nur nach dem jeweiligen Klick an OpenAI gesendet werden. Es gibt keine automatische Uebertragung, keine automatische endgueltige Speicherung und keinen Mailversand.

### Beobachtungsmetadaten

Nach Nutzerbestaetigung koennen zusaetzlich gespeichert werden:

```text
audio_id
original_sprachtext
original_sprache
transkript_text
deutsche_uebersetzung
albanischer_hinweistext
ki_transkription_verwendet
ki_strukturierung_verwendet
ki_vorschlag_bestaetigt
echte_ki_verwendet
ai_provider
ai_model_transcription
ai_model_text
updated_at
```

### Tests und Einschraenkungen

- Ohne Schluessel wurde `not_configured` erfolgreich gegen den echten HTTPS-Projektbestand getestet.
- Deutscher, gemischter und albanischer Text wurden im lokalen Fallback getestet.
- Der Provideradapter wurde mit einem lokalen Mock fuer Multipart-Transkription und Structured Output getestet.
- Der Mock-Test prueft, dass vor Nutzerbestaetigung keine Beobachtung automatisch gespeichert wird.
- Ein echter OpenAI-Aufruf wurde nicht ausgefuehrt, weil in der Entwicklungsumgebung kein `OPENAI_API_KEY` vorhanden war.
- Produktive Projekt- und Plandaten wurden nicht geaendert.

Naechster Schritt: MVP 7e Voice-First-Baustellenworkflow nach einem kontrollierten realen API-/Geraetetest mit eigenem OpenAI-Schluessel.

## MVP 7d.1: Transkript-Nachkorrektur und Ein-Knopf-Auswertung

Stand: 23.06.2026

MVP 7d.1 verbessert die bestehende OpenAI-Anbindung fuer echte Baustellenbegriffe und reduziert die Bedienung auf dem Handy. Die technische Basis bleibt unveraendert: Audio/Text werden nur nach Nutzerklick verarbeitet, Beobachtungen werden erst nach bestaetigter Vorschau gespeichert, und `plans.json` wird nicht veraendert.

### Baustellen-Glossar

Das lokale Glossar liegt unter:

```text
D:\Kai_BauSuite\daten\fachwissen\baustellen_glossar.json
```

Es enthaelt typische Projekt- und Fachbegriffe wie `WDVS`, `Wärmedämmverbundsystem`, `Außenputz`, `Putzsystem`, `Armierungsgewebe`, `Kreuzfugen`, `Öffnungsecken`, `Fensteranschluss`, `Labi`, `LTH Bau GmbH`, `Kronwinkler Straße` und `Aubing`. Die Datei ist keine Normen- oder Herstellerquelle, sondern nur Kontext fuer Transkription, Korrektur und Strukturierung.

Zusaetzlich verwendet der Server projektbezogenen Kontext:

- Projektname und Adresse
- aktive Gewerke
- aktive Firmen
- aktive Verantwortliche
- vorhandene Fachhinweis-Titel

### Transkript-Nachkorrektur

Der Endpunkt `POST /api/ai/transcribe-audio` fuehrt nach der Rohtranskription optional eine zweite OpenAI-Strukturabfrage aus, wenn das Textmodell konfiguriert ist. Diese Nachkorrektur erhaelt:

- Rohtranskript
- Projektkontext
- Stammdaten
- Fachhinweis-Titel
- Baustellen-Glossar

Die Antwort enthaelt:

```text
raw_transcript
cleaned_transcript_de
transcript_corrections[]
warnings[]
```

Regeln:

- Fachbegriffe und Namen duerfen vorsichtig korrigiert werden.
- Keine neuen Sachverhalte erfinden.
- Keine Normen, Herstelleranforderungen oder Rechtsbewertungen erzeugen.
- Unsichere Korrekturen bleiben als Warnung sichtbar.

### Strukturierung

`POST /api/ai/structure-observation` nutzt bevorzugt den bereinigten deutschen Text. Das Strukturierungsprompt wurde auf konkrete, kurze Baustellentitel und knappe Beschreibungen ausgerichtet, z. B. `WDVS: Kreuzfugen am Fenster` statt generischer Projekttitel. Stammdaten- und Fachhinweis-IDs werden weiterhin serverseitig gegen die lokalen Daten geprueft.

### Mobile Bedienung

Im Bereich `Per Sprache/Text erfassen` gibt es nun den Hauptbutton:

```text
Aufnahme auswerten
```

Ablauf:

1. Audio aufnehmen.
2. `Aufnahme auswerten` antippen.
3. App transkribiert, bereinigt das Transkript und erzeugt den Strukturvorschlag.
4. Nutzer prueft den Vorschlag.
5. Erst `Uebernehmen` speichert die Beobachtung.

Der bisherige Expertenablauf bleibt verfuegbar:

- `Audio transkribieren`
- `Strukturvorschlag erzeugen`

Bei deutscher Eingabe zeigt die Vorschau `Bereinigter deutscher Text`. `Deutsche Uebersetzung` beziehungsweise `Deutsche Fassung` wird nur fuer Albanisch oder gemischte Eingaben verwendet. Das Rohtranskript und die Korrekturen sind optional einklappbar sichtbar.

### Datenschutz und Speicherung

Audio und Text werden nur nach ausdruecklichem Klick an den konfigurierten KI-Dienst gesendet. Ohne sichtbaren `OPENAI_API_KEY` bleibt der lokale Fallback aktiv. API-Schluessel werden nicht in Code, JSON, Logs oder API-Antworten gespeichert.

Bei bestaetigter Beobachtung koennen zusaetzlich gespeichert werden:

```text
rohtranskript_text
bereinigter_deutscher_text
transkript_korrekturen[]
```

Bestehende Beobachtungen ohne diese Felder bleiben kompatibel.

### Tests und Grenzen

Geprueft wurden Python-/JavaScript-Syntax, MVP-7c-Kompatibilitaet, No-Key-Fallback, lokaler OpenAI-Mock mit Transkriptfehlern `Pflanzsystem` und `Kreuzbogen`, Nachkorrektur zu `Putzsystem` und `Kreuzfugen`, Strukturierung aus bereinigtem Text und ausbleibende automatische Speicherung vor Nutzerbestaetigung. `plans.json` blieb unveraendert.

Ein echter OpenAI-Aufruf wurde in dieser Codex-Terminalumgebung nicht ausgefuehrt, weil `OPENAI_API_KEY` dort nicht sichtbar war. Fuer den Praxistest muss der HTTPS-Mobile-Server in einer Windows-Umgebung gestartet werden, die die Benutzervariable `OPENAI_API_KEY` sieht.

Naechster Schritt: kontrollierter Handytest mit echter OpenAI-Transkription und danach weitere Vereinfachung des Voice-First-Baustellenworkflows.

## MVP 7d.2: Geschuetzte Baustellenbegriffe

Stand: 23.06.2026

MVP 7d.2 macht die Transkript-Nachkorrektur konservativer. Ziel ist nicht mehr maximale sprachliche Glattung, sondern fachlich naehere Wiedergabe des gesprochenen Baustellentextes.

### Glossar-Struktur

Das Baustellen-Glossar enthaelt nun zwei Bereiche:

```text
terms[]
protected_terms[]
```

`terms[]` liefert allgemeine bevorzugte Fachbegriffe fuer Transkription und Strukturierung. `protected_terms[]` enthaelt Begriffe, Namen und Orte, die nicht kreativ umgedeutet werden duerfen, z. B.:

- `Labi`
- `LTH Bau GmbH`
- `WDVS`
- `Kronwinkler Straße`
- `Aubing`
- `Armierungsgewebe`
- `Kreuzfugen`
- `Öffnungsecken`
- `Fensteranschluss`
- `Putzsystem`
- `Außenputz`

Zusätzlich gelten serverseitig automatisch als geschuetzt:

- Projektname
- Projektadresse
- aktive Gewerke
- aktive Firmen
- aktive Verantwortliche
- aktive Fachhinweis-Titel

Diese geschuetzten Begriffe werden in `glossary_context()` und `ai_context()` an die KI-Anfragen uebergeben.

### Strengere Nachkorrektur

Der Korrekturprompt verlangt jetzt:

- Rohtranskript nur behutsam korrigieren
- geschuetzte Begriffe bevorzugen
- Namen/Firmen/Projektorte nicht in normale Woerter umdeuten
- unsichere Stellen lieber stehen lassen
- keine neuen Massnahmen, Verantwortlichkeiten, Normen, Herstellerangaben oder Bewertungen erfinden

Beispielregel: `Labi verständigen` darf nicht zu einem erfundenen Wort wie `Lageverständigen` werden. Fachbegriffe wie `WDVS`, `Kreuzfugen` und `Armierungsgewebe` sollen sichtbar bleiben, wenn sie im Rohtext oder Kontext klar wahrscheinlich sind.

### Mobile Pruefung

Der bereinigte Text bleibt bearbeitbar und zeigt den Hinweis:

```text
Bereinigter Text – bitte Fachbegriffe/Namen prüfen.
```

Wenn `transcript_corrections[]` vorhanden ist, kann der Nutzer weiterhin `Korrekturen anzeigen` aufklappen und jede Korrektur mit Grund pruefen.

### Strukturvorschlag

Der Strukturierungsprompt wurde auf konkrete, kurze Titel und Baustellenbeschreibungen geschaerft. Gute Zielrichtung:

- `WDVS: Kreuzfugen an Fensteröffnung`
- `Kreuzfugen im Armierungsgewebe am Fenster`
- `Außenputz/WDVS - Kreuzfugen im Fensterbereich`

Zu allgemeine Titel wie reine Projekt-/Ortsbegehungen sollen vermieden werden. Die Beschreibung soll knapp bleiben: Feststellung, Ort, Aktion, Beteiligte und Frist.

### Tests und Grenzen

Der Mocktest prueft den Satz:

```text
Bauvorhaben Kronwinkler Straße, Aubing. Begehung WDVS vor Gewebespachtelung. Mangel im Bereich der Fenster: Kreuzfugen im Armierungsgewebe. Bitte Labi verständigen. Frist bis Freitag.
```

Geprueft wird unter anderem:

- `Labi` bleibt geschuetzt und wird nicht zu `Lageverständigen`
- `WDVS`, `Kreuzfugen`, `Armierungsgewebe`, `Kronwinkler Straße` und `Aubing` bleiben erhalten
- Strukturvorschlag liefert einen konkreten WDVS-/Fenster-Titel
- No-Key-Fallback und MVP-7c-Kompatibilitaet bleiben erhalten
- keine automatische Speicherung vor Nutzerbestaetigung
- `plans.json` bleibt unveraendert

Geschuetzte Begriffe reduzieren Fehlkorrekturen, ersetzen aber keine Nutzerpruefung. Die KI darf weiterhin nur Vorschlaege erzeugen; Speicherung erfolgt erst nach Bestaetigung.

## MVP 7d.3: Rohtranskript zuerst

Stand: 23.06.2026

MVP 7d.3 trennt die Sprachverarbeitung in drei nachvollziehbare Ebenen:

1. Rohtranskript
2. Bereinigter Text
3. Strukturvorschlag

Damit ist klar sichtbar, was gesprochen wurde, was vorsichtig korrigiert wurde und was ein KI-Vorschlag fuer strukturierte Felder ist.

### Rohtranskript

Der Endpunkt `POST /api/ai/transcribe-audio` liefert `transcript_text` und `raw_transcript` als wortnahes Rohtranskript. Dieses Feld ist keine Uebersetzung, keine Zusammenfassung und keine fachliche Beschreibung. Der Transkriptionsprompt enthaelt nur Schreibweisen fuer Eigennamen/Fachbegriffe und die klare Regel:

```text
Nur transkribieren, nicht uebersetzen, nicht zusammenfassen.
```

### Bereinigter Text

`cleaned_transcript_de` ist separat. Diese Bereinigung darf vorsichtig korrigieren:

- Gross-/Kleinschreibung
- Satzzeichen
- Fachbegriffe aus Glossar
- geschuetzte Begriffe wie `Labi`, `WDVS`, `Kreuzfugen`

Sie darf nicht uebersetzen, nicht englisch umformulieren, keine neuen Inhalte ergaenzen und keine Fristen oder Zustaendigkeiten veraendern. Wenn die Bereinigung offensichtlich englisch oder zu frei wirkt, wird sie serverseitig verworfen und das Rohtranskript als sichere Basis verwendet. Eine Warnung wird zurueckgegeben.

### Strukturvorschlag

`POST /api/ai/structure-observation` wird erst danach aufgerufen. Als Eingabe wird bevorzugt der bereinigte Text verwendet; das Rohtranskript wird zur Nachvollziehbarkeit mitgegeben. Der Strukturvorschlag darf Felder wie Titel, Typ, Beschreibung, Gewerk, Firma, Verantwortlicher, Status, Prioritaet und Frist vorschlagen. Er bleibt ein KI-Vorschlag und wird erst nach Nutzerbestaetigung gespeichert.

### Mobile UI

Im Bereich `Per Sprache/Text erfassen` sind nun sichtbar:

- `Rohtranskript`
- `Bereinigter Text`
- optional `Korrekturen anzeigen`

In der Vorschau `Vorschlag pruefen` stehen oben Rohtranskript und bereinigter Text; darunter folgen Beteiligte, Fachhinweise und Strukturvorschlag. So kann der Nutzer fachliche Veraenderungen vor dem Speichern erkennen.

### Tests und Grenzen

Getestet wurde ein deutscher Baustellentext mit `Kronwinkler Straße`, `Aubing`, `WDVS`, `Kreuzfugen`, `Armierungsgewebe`, `Labi verständigen` und `Frist bis Freitag`. Der Mocktest prueft, dass das Rohtranskript nicht englisch uebersetzt wird, die Bereinigung getrennt bleibt und eine simulierte englische Bereinigung verworfen wird. `plans.json` blieb unveraendert.

Grenze: Auch ein Rohtranskript kann Erkennungsfehler des Transkriptionsmodells enthalten. Deshalb bleiben Rohtranskript und bereinigter Text bearbeitbar und die Speicherung erfolgt weiterhin erst nach Bestaetigung.

## MVP 7e: Baustellenmodus fuer Sprach-/Texterfassung

Stand: 23.06.2026

MVP 7e fuehrt in der mobilen Oberflaeche einen gefuehrten `Baustellenmodus` fuer die Sprach-/Texterfassung ein. Der Modus ist fuer die schnelle Nutzung auf der Baustelle gedacht: aufnehmen, stoppen, Vorschlag pruefen, bestaetigen.

### Standardfluss

Der Standardfluss lautet:

```text
Aufnahme starten
-> Stoppen & auswerten
-> Audio speichern
-> Rohtranskript erstellen
-> bereinigten Text erzeugen
-> Strukturvorschlag erzeugen
-> Vorschlag pruefen
-> Übernehmen (geprüft)
```

Wichtig: Die Beobachtung wird nicht automatisch gespeichert. Erst der Button `Übernehmen (geprüft)` legt die Beobachtung an bzw. uebernimmt den Vorschlag. Intern wird dabei `ki_vorschlag_bestaetigt = true` gesetzt.

### Mobile UI

Die mobile Seite fuer Sprache/Text zeigt im Standardmodus:

- grossen Button `Aufnahme starten`
- waehrend der Aufnahme den Button `Stoppen & auswerten`
- Statusanzeige fuer Speichern, Transkription und Strukturvorschlag
- kompakte Anzeige der aktuellen Audiodatei
- vereinfachte Vorschau mit Strukturvorschlag im Vordergrund

Die UI bleibt bewusst einspaltig und fingerfreundlich. Detailinformationen werden nicht entfernt, sondern in den Expertenmodus verschoben.

### Expertenmodus / Details

Der einklappbare Bereich `Expertenmodus / Details` enthaelt weiterhin:

- Aktivitaetsauswahl
- Einzelbutton `Audio transkribieren`
- Einzelbutton `Strukturvorschlag erzeugen`
- Rohtranskript
- bereinigten Text
- Korrekturen und Warnungen
- freie Texteingabe unter `Text statt Aufnahme eingeben`
- Fallback fuer Audio-Dateiauswahl
- letzte Aufnahmen

Damit bleibt der Ablauf pruefbar und manuell steuerbar, falls der gefuehrte Standardfluss nicht ausreicht.

### Datenschutz und Nutzerfreigabe

- KI-Auswertung erfolgt nicht ohne bewusste Nutzeraktion.
- Im Standardfluss startet sie erst durch `Stoppen & auswerten`.
- Speicherung erfolgt erst durch `Übernehmen (geprüft)`.
- Es werden keine API-Schluessel im Code, in JSON-Konfigurationen oder Logs gespeichert.
- Ohne aktive OpenAI-Konfiguration bleibt ein lokaler regelbasierter Fallback verfuegbar.

### Fallback ohne KI

Wenn keine OpenAI-Konfiguration vorhanden ist oder die KI-Auswertung fehlschlaegt:

- Audio kann weiterhin lokal gespeichert werden.
- Freitext kann manuell eingegeben werden.
- Der lokale regelbasierte Strukturvorschlag bleibt nutzbar.
- Der Nutzer sieht weiterhin Rohtext und Vorschlag und entscheidet vor dem Speichern.

### Tests

Fuer MVP 7e wurden geprueft:

- JavaScript-Syntax der mobilen App
- MVP-7e-UI-Regressionscheck
- MVP-7d-OpenAI-Mocktest
- MVP-7c-Kompatibilitaetstest
- Server-Smoke-Test mit echten Projektdaten
- Baustellenmodus sichtbar
- `Expertenmodus / Details` einklappbar
- keine offensichtlichen JavaScript-Fehler beim Laden der mobilen Seite
- kein API-Schluessel in Code oder Konfiguration
- `plans.json` unveraendert

### Geaenderte Dateien

- `D:\Kai_BauSuite\mobile\static\app.js`
- `D:\Kai_BauSuite\mobile\static\styles.css`
- `D:\Kai_BauSuite\mobile\tests\test_mvp7e_ui.py`
- `D:\Kai_BauSuite\dokumentation\technische_dokumentation_kai_bausuite.md`
- `D:\Kai_BauSuite\dokumentation\entwicklungsstand_kai_bausuite.md`

### Bekannte Einschraenkungen

- Direkter Mikrofonzugriff am Handy benoetigt HTTPS bzw. einen sicheren Browser-Kontext.
- Der lokale Fallback ist nur eine einfache Alpha-Strukturierung.
- Transkript und KI-Vorschlag muessen weiterhin fachlich durch den Nutzer geprueft werden.

## MVP 7e.2: Kontextarme Rohtranskription

Stand: 23.06.2026

MVP 7e.2 behebt einen kritischen Fehler aus dem Handy-Test: Das Rohtranskript darf nicht durch Baustellen-Fachkontext, alte Vorschlaege oder Fachhinweisnaehe in ein falsches Thema gezogen werden.

### Ursache

Der bisherige Transkriptionsprompt enthielt viele bevorzugte Schreibweisen aus Projekt, Stammdaten, Glossar, protected terms und Fachhinweisen. Das half bei Begriffen wie `WDVS` oder `Labi`, konnte aber bei einer anderen Aufnahme, z. B. Estrichvorbereitung, das Rohtranskript in Richtung WDVS/Fensteranschluss verfremden.

### Neue Reihenfolge

Die Verarbeitung ist jetzt strikt getrennt:

```text
A) Audio -> Rohtranskript ohne Fachkontext
B) Rohtranskript anzeigen
C) Bereinigung mit Glossar/protected_terms
D) Strukturvorschlag aus aktuellem Rohtranskript/bereinigtem Text
E) Vorschau und Nutzerbestaetigung
```

### Rohtranskription

Der OpenAI-Transkriptionsaufruf fuer `/api/ai/transcribe-audio` bekommt nur noch einen neutralen, kurzen Hinweis:

```text
Transkribiere die Baustellennotiz moeglichst wortnah.
Nicht uebersetzen, nicht zusammenfassen, nicht strukturieren.
```

Nicht mehr im Rohtranskriptionsprompt:

- Projektstammdaten
- Fachhinweis-Titel
- WDVS-/Fenster-/Putz-Kontext
- protected_terms-Liste
- alte Strukturvorschlaege
- alter Freitext

### Bereinigung und Strukturierung

Glossar, protected terms, Projektstammdaten und Fachhinweise werden erst nach dem Rohtranskript verwendet. Die Bereinigung darf nur vorsichtig korrigieren. Sie darf kein neues Fachthema einfuehren. Beispiel: `Böden müssen sauber gemacht werden` bleibt Reinigung/Estrichvorbereitung und darf nicht zu WDVS, Fensteranschluss oder Putzmangel werden.

Die Strukturierung nutzt das aktuelle Rohtranskript beziehungsweise den aktuellen bereinigten Text. Ein altes `original_text`-Feld darf die aktuelle Aufnahme nicht ueberlagern.

### Audio-ID und Diagnose

Beim Auswerten wird exakt die ausgewaehlte `audio_id` verwendet. Der Server prueft die konkrete Audiodatei und gibt Diagnose-Metadaten zurueck:

- `request_id`
- `audio_id`
- Dateiname
- Dateigroesse
- Dauer, falls vorhanden
- Zeitstempel

Die mobile Oberflaeche zeigt diese Daten im Audio-Bereich an. Serverlogs enthalten nur kurze Ausschnitte von maximal 120 Zeichen fuer Rohtranskript, Bereinigung und Strukturinput. API-Schluessel und lange Volltexte werden nicht geloggt.

### Unsichere Transkripte

Wenn das Transkript offensichtlich unsicher wirkt, erzeugt der Ein-Knopf-Baustellenmodus keinen scheinbar sicheren Strukturvorschlag. Stattdessen erscheint:

```text
Transkript unsicher. Bitte Aufnahme anhoeren oder Text manuell korrigieren.
```

Der Nutzer kann die Aufnahme anhoeren, Rohtranskript oder bereinigten Text korrigieren und danach manuell den Strukturvorschlag erzeugen.

### Tests

Ergaenzte Regressionsfaelle:

- Estrich/Reinigung: `Bauvorhaben Kronwinkler Straße in Aubing, Begehung Estrichvorbereitung, Böden müssen sauber gemacht werden, Information an Labi, Frist bis Freitag.`
- WDVS: `Begehung WDVS vor Gewebespachtelung. Mangel im Bereich der Fenster: Kreuzfugen im Armierungsgewebe.`
- zwei Aufnahmen nacheinander: WDVS darf nicht in eine folgende Estrichaufnahme wandern
- alter Freitext: ein altes WDVS-Textfeld darf die neue Estrichaufnahme nicht ueberlagern

`plans.json` bleibt unveraendert.

## MVP 7f: Mobile Projektanlage

Stand: 23.06.2026

MVP 7f ergaenzt in der mobilen Projektliste einen einfachen, funktionalen Projektanlage-Flow. Ziel ist, unterwegs ein neues Projekt anlegen und direkt oeffnen zu koennen, ohne bestehende Projekt-, Plan-, Pin-, Foto-, Mail-, PDF- oder KI-Logik zu veraendern.

### Mobile UI

Die mobile Startseite / Projektliste zeigt:

```text
+ Neues Projekt
```

Das Formular `Neues Projekt` enthaelt:

- Projektname, Pflichtfeld
- Adresse / Ort
- Bauherr / Kunde
- Projekttyp: MFH, RH, EFH, Sanierung, Sonstiges
- Notiz

Nach `Projekt anlegen`:

- wird serverseitig eine eindeutige `project_id` erzeugt
- wird das Projekt in `projects.json` gespeichert
- wird die Projektordnerstruktur initialisiert
- springt die mobile App direkt in das neue Projektdashboard

### API

Neuer Endpunkt:

```text
POST /api/projects
```

Payload:

```json
{
  "name": "Projektname",
  "address": "Adresse / Ort",
  "client": "Bauherr / Kunde",
  "project_type": "MFH",
  "notes": "Notiz"
}
```

Antwort ist das neu angelegte Projektobjekt mit stabiler `id`, `createdAt`, `updatedAt` und `version`.

### Datenablage

Die Anlage nutzt weiterhin den zentral konfigurierten `data_root` aus:

```text
D:\Kai_BauSuite\config\settings.json
```

Standardstruktur:

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

Die initialen JSON-Dateien enthalten leere Listen. `plaene\plans.json` wird leer angelegt, damit die bestehende Planverwaltung und mobile Planliste ohne Sonderfall funktionieren.

### Sicherheit und Kompatibilitaet

- Projektname ist Pflichtfeld.
- Doppelte Projektnamen sind erlaubt; die technische `project_id` ist eindeutig.
- Speicherung erfolgt ueber die bestehende robuste JSON-Schreibroutine mit temporaerer Datei und Backup bestehender Dateien.
- Bestehende Projekte werden nicht veraendert.
- Bestehende `plans.json`-Dateien werden nicht geaendert.
- Keine API-Key- oder KI-Konfiguration wurde angepasst.

### Tests

Geprueft wurde mit temporaeren Testdaten:

- neues Projekt mobil/API anlegen
- Projekt erscheint in Projektliste
- Projekt kann geladen werden
- leere Planliste funktioniert
- Initialdateien sind vorhanden und leer
- erste Aktivitaet anlegen
- erste Beobachtung anlegen
- bestehende MVP-7c/7d/7e-Tests bleiben erfolgreich
- `plans.json` des bestehenden Projekts `3 RH Kronwinkler` blieb unveraendert

Zusaetzlich wurde ein rein lesender Smoke-Test gegen echte Daten durchgefuehrt:

- Mobile Server startet
- echte Projektliste laedt
- `3 RH Kronwinkler` ist weiterhin ladbar
- mobile Oberflaeche wird ausgeliefert
- keine echten Projekte wurden angelegt

### Naechster Schritt

Naechster sinnvoller Schritt ist die mobile Pflege von Stammdaten, insbesondere Firmen, Gewerken und Verantwortlichen, damit mobil angelegte Projekte bei Bedarf direkt mit Beteiligten vorbereitet werden koennen.

## MVP 7g.1: Harte Worttreue und Quellenbindung

Stand: 01.07.2026

MVP 7g.1 verschärft die bestehende Sprachpipeline. Ziel ist nicht sprachliche Schönheit, sondern nachvollziehbare Baustellendokumentation ohne Sinnumkehr oder erfundene Tatsachen.

### Glossar und verdächtige Begriffe

Das Baustellen-Glossar unter:

```text
D:\Kai_BauSuite\daten\fachwissen\baustellen_glossar.json
```

enthält zusätzlich:

- geschützte Begriffe wie `Ortsbegehung`, `Erdaushub`, `Nachbarbaustelle`, `Schreiben an`, `Estrichvorbereitung`
- bekannte Baustellenbegriffe wie `Baugrube`, `Gelände`, `Aushub` und `Verfüllung`
- `suspect_terms` mit optionalem Korrekturvorschlag und erforderlichem Kontext

Beispiele:

- `Aufspeckierung` wird nur bei passendem Begehungs-/Baustellenkontext als mögliche `Ortsbegehung` vorgeschlagen.
- `Erdaufwurf` wird nur bei passendem Erdarbeiten-/Aushubkontext als möglicher `Erdaushub` vorgeschlagen.
- `Pübenmessung` und `Baumagik` bleiben unklar und stoppen die automatische Strukturierung.

Jede automatische Korrektur bleibt in `transcript_corrections` sichtbar. Zusätzlich erscheint eine Warnung, damit der Nutzer den Begriff vor dem Übernehmen prüft.

### Keine Sinnumkehr

Der Strukturierungs-Prompt und eine serverseitige Plausibilitätsprüfung verbieten insbesondere:

- Umkehr von `Schreiben an X` zu `Schreiben von X`
- erfundene Verweigerung, Ablehnung, Schuld oder Ursache
- erfundene Dringlichkeit
- nicht gesprochene Fachthemen oder Beteiligte

Beispiel:

```text
Es muss ein Schreiben an den Unternehmer der Nachbarbaustelle geschickt werden, Frist bis Freitag.
```

darf als Aufgabe strukturiert werden, aber nicht zu einer Handlung des Unternehmers oder zu einer behaupteten Verweigerung verändert werden.

### Feldquellen

Die strukturierte KI-Antwort enthält `field_sources`. Für Titel, Typ, Beschreibung und Frist wird ein wörtlicher Quellausschnitt aus Rohtranskript oder bereinigtem Text verlangt. Quellen, die im aktuellen Transkript nicht vorkommen, werden serverseitig als Verstoß erkannt.

Bei fehlender Worttreue wird der KI-Strukturvorschlag verworfen und der bestehende regelbasierte Fallback verwendet. Eine endgültige Speicherung erfolgt weiterhin ausschließlich nach `Übernehmen (geprüft)`.

### Mobile Prüfung

In der mobilen Vorschau werden kritische Warnungen oberhalb des Vorschlags sichtbar angezeigt. Der aufklappbare Detailbereich zeigt:

- Rohtranskript
- bereinigten Text
- Korrekturen mit Original, Korrektur und Grund
- Feldquellen
- sämtliche Warnungen

### Grenzen

- Ein kontextabhängiger Korrekturvorschlag ist keine sichere Spracherkennung.
- Unklare Wörter müssen durch Anhören oder manuelle Texteingabe geklärt werden.
- Die Prüfung verhindert definierte und erkennbare Sinnumkehr, ersetzt aber nicht die fachliche Kontrolle durch den Nutzer.
- Es werden keine Normen, Herstellerangaben oder rechtlichen Bewertungen ergänzt.
- `plans.json`, Planversionierung, Pins, Fotos, Mail und PDF bleiben unverändert.

## MVP 7g.2: Notbremse gegen fantasievolle Beschreibungen

Stand: 01.07.2026

MVP 7g.2 verschärft die Worttreue aus MVP 7g.1. Sobald unklare Begriffe verbleiben oder die KI unbelegte Sachwörter verwendet, wird kein normaler Strukturvorschlag mehr angezeigt.

### Notbremse vor der Strukturierung

Das Glossar führt zusätzlich `Unterminierung` und `freier Grund` als verdächtige Begriffe. Verbleibt ein `suspect_term` nach der vorsichtigen Bereinigung im Text, antwortet die API mit:

```text
structure_status = blocked_uncertain
structure_blocked = true
```

Titel, Typ, Gewerk, Firma, Verantwortlicher und Beschreibung werden in diesem Zustand nicht als sichere Auswahl ausgegeben. Die mobile Vorschau zeigt:

```text
Vorschlag unsicher – bitte Text korrigieren.
```

Rohtranskript und bereinigter Text bleiben sichtbar. `Text korrigieren` führt zurück in den Expertenbereich. `Trotzdem als Entwurf anzeigen` liegt ausschließlich im aufklappbaren Expertenmodus und sendet die explizite Option `allow_unsafe_draft`.

### Wortnahe Fallback-Beschreibung

Wird ein KI-Vorschlag wegen fehlender Worttreue verworfen, gilt:

```text
description_de = bereinigter Text
```

Die Funktion `deterministic_description` darf nur Leerraum und Satzzeichen glätten. Bei mehr als drei Sätzen wird der gesamte Inhalt durch reine Zeichensetzungsänderung auf höchstens drei Sätze verdichtet. Es werden keine neuen Sachwörter, Zwecke, Ursachen oder Beteiligten ergänzt.

Die Antwort enthält:

```text
structure_status = safe_text_fallback
fallback_description_used = true
```

und den Hinweis:

```text
Beschreibung aus bereinigtem Text übernommen, weil KI-Vorschlag unsicher war.
```

### Serverseitige Belegprüfung

Vor der Anzeige prüft der Server:

- Pflichtquellen für `title`, `description_de`, `type`, `trade`, `company`, `responsible` und `due_date`, sofern das jeweilige Feld gesetzt ist
- ob jedes `source_text` tatsächlich im aktuellen Roh- oder Bereinigungstext vorkommt
- neue Inhaltswörter in Titel und Beschreibung
- nicht belegte Begriffe wie `dringend`, `verweigert`, `Unterminierung`, `verschuldet`, `Schaden`, `Gefahr`, `nicht durchgeführt` und `nicht möglich`
- fachfremde Begriffe wie `WDVS`, `Fensteranschluss`, `Kreuzfugen` oder `Mangel`, wenn sie nicht belegt sind
- bekannte `suspect_terms` im KI-Output
- Richtungsumkehr bei `Schreiben an den Unternehmer`

Bei einem Verstoß wird die KI-Beschreibung vollständig verworfen. Die Anwendung übernimmt nicht einzelne scheinbar brauchbare Teile einer unsicheren Beschreibung.

### Zurückhaltende Typwahl

- `Mangel` nur bei ausdrücklich genanntem Mangel oder klar benanntem Defekt
- `Aufgabe` bei Formulierungen wie `muss`, `bitte erledigen`, `Schreiben an`, `informieren` oder `prüfen`
- `Frage` bei ausdrücklicher Frage
- ansonsten `Hinweis`

Priorität `hoch` wird nur bei ausdrücklich genannter hoher Priorität oder `dringend` gesetzt.

### Sicherheitsgrenzen

- Keine Speicherung ohne `Übernehmen (geprüft)`.
- Ein blockierter Vorschlag kann nicht gespeichert werden.
- Der Expertenentwurf erfordert eine bewusste Aktion.
- Keine Norm-, Hersteller- oder Rechtsaussagen werden ergänzt.
- Planversionierung, `plans.json`, Pins, Fotos, Mail und PDF bleiben unverändert.

## MVP 7g.3: Belegpflicht statt pauschaler Wortverbote

Stand: 01.07.2026

MVP 7g.3 verfeinert die Notbremse aus MVP 7g.2. Nicht ein einzelnes Wort entscheidet über Zulässigkeit, sondern die Frage, ob die enthaltene Aussage durch Rohtranskript, bereinigten Text oder eindeutig zugeordnete Stammdaten belegt ist.

### Beschreibung aus bereinigtem Text

Im normalen Ablauf wird `description_de` nach erfolgreicher Strukturprüfung mit `deterministic_description(cleaned_text_de)` befüllt. Dadurch bleiben:

- gesprochener Inhalt
- Reihenfolge
- Handlungsrichtung
- Beteiligte
- Fristen
- ausdrücklich genannte Absichten

erhalten. Die Funktion glättet ausschließlich Leerraum und Satzzeichen. Bei einem unsicheren KI-Text gilt weiterhin:

```text
description_de = wortnahe Fallbackbeschreibung aus cleaned_text_de
```

mit dem Hinweis:

```text
Beschreibung aus bereinigtem Text übernommen, weil KI-Formulierung unbelegte Ergänzungen enthielt.
```

### Semantische Beleggruppen

Die serverseitige Prüfung verwendet `SEMANTIC_EVIDENCE_GROUPS`. Diese erlauben sprachliche Verdichtungen, wenn eine passende Aussagequelle vorhanden ist.

Beispiele:

- `Räumung` / `räumen` ist belegt durch `Räumung`, `räumen`, `freiräumen`, `freimachen` oder `Baufeld muss freigemacht werden`.
- `veranlassen` ist belegt durch `veranlassen`, `soll erledigt werden`, `muss gemacht werden`, `muss freigemacht werden` oder `bitte erledigen`.
- `informieren` / `kontaktieren` ist belegt durch `Schreiben an`, `schicken`, `senden`, `informieren` oder `kontaktieren`.
- `dringend` ist belegt durch `dringend`, `sofort`, `umgehend`, `eilig` oder eine ausdrückliche hohe Priorität.
- `verweigert` ist belegt durch `verweigert`, `abgelehnt` oder `nicht bereit`.

Damit ist beispielsweise `Räumung des Baufeldes veranlassen` erlaubt, wenn diese Absicht gesprochen oder durch `Baufeld freimachen/freiräumen` klar belegt wurde. Ohne diesen Beleg wird die Formulierung verworfen.

### Richtungsschutz

Für Anweisungen wie:

```text
Schreiben an den Unternehmer der Nachbarbaustelle schicken
```

werden weiterhin folgende Umdeutungen blockiert:

- `Schreiben vom Unternehmer`
- `Unternehmer erstellt das Schreiben`
- behauptete Verweigerung ohne entsprechenden Beleg

Bei einem Verstoß wird die KI-Beschreibung verworfen und der bereinigte Text übernommen.

### Fristschutz

`Frist bis Freitag` bleibt in der Beschreibung erhalten. Ein konkretes Datum darf zusätzlich in `due_date` stehen, wenn die Quelle `Frist bis Freitag` angegeben ist. Nicht belegte Formulierungen wie `bis zum nächsten Beitrag` werden durch Bedeutungs-, Token- und Quellenprüfung verworfen.

### Titel

Der Titel darf leicht verdichten, solange:

- alle Inhaltsaussagen belegt sind
- eine passende `field_sources`-Quelle vorhanden ist
- keine Richtung, Dringlichkeit, Ablehnung oder Ursache ergänzt wird

Beispiele für zulässige Verdichtung bei passender Quelle:

- `Nachbarbaustelle kontaktieren`
- `Schreiben an Unternehmer der Nachbarbaustelle`
- `Baufeld räumen / Nachbarbaustelle informieren`

### Sicherheitsgrenzen

- Echte Unsinnsbegriffe aus `suspect_terms` lösen weiterhin die Notbremse aus.
- Semantische Varianten werden nur über ausdrücklich definierte Beleggruppen akzeptiert.
- Feldquellen bleiben Pflicht.
- Speicherung erfolgt weiterhin erst nach Nutzerbestätigung.
- Keine Änderung an `plans.json`, Planversionierung, Pins, Fotos, Mail oder PDF.

## MVP 7i: Audioverwaltung und Sammelprotokoll

Stand: 02.07.2026

MVP 7i ergänzt eine nachvollziehbare Audioverwaltung sowie ein editierbares
Sammelprotokoll aus mehreren Aufnahmen. Die bestehende Diktat-first-Regel bleibt
verbindlich: Protokollpunkte stammen aus dem bereinigten Diktat, ersatzweise aus
dem Rohtranskript. Freie KI-Prosa wird nicht erzeugt.

### Audio-Soft-Delete

Aufnahmen werden nicht physisch gelöscht. `POST /api/audio/delete` archiviert
den Metadatensatz mit:

```text
deleted
deleted_at
deleted_reason
deleted_by
```

Archivierte Aufnahmen bleiben als Datei erhalten, werden aber in normalen
mobilen Listen und API-Projektantworten ausgeblendet. Ist eine Aufnahme bereits
einer Beobachtung oder einem Protokoll zugeordnet, zeigt die Oberfläche vor dem
Archivieren einen zusätzlichen Hinweis.

### Sammelprotokoll

Der mobile Ablauf lautet:

```text
Projekt -> Protokoll aus Aufnahmen -> Aufnahmen wählen
-> fehlende Transkripte erzeugen -> Vorschau prüfen/bearbeiten
-> bestätigt speichern
```

API:

- `POST /api/projects/<project_id>/protocols/preview`
- `POST /api/projects/<project_id>/protocols`

Die Vorschau gruppiert nur eindeutig diktierte Gewerke. Unterstützt werden
zunächst unter anderem WDVS/Putz, Estrich, Elektro, Sanitär/HLS, Erdarbeiten,
Rohbau, Fenster, Dach und Trockenbau. Ohne ausdrückliche und sichere Nennung
erfolgt die Zuordnung zu `Ohne sichere Gewerkzuordnung`.

Protokolle werden projektbezogen in `protocols.json` gespeichert. Das Modell
enthält:

```text
protocol_id
project_id
title
date
source_audio_ids[]
status
sections[]
items[]
created_at
updated_at
```

Jeder Punkt behält den Bezug zur Quellaufnahme und verwendet ausschließlich den
bereinigten Diktattext beziehungsweise das Rohtranskript. Die Vorschau ist
bearbeitbar; gespeichert wird erst nach ausdrücklicher Nutzerbestätigung.

### Grenzen und Kompatibilität

- PDF-Export, Mailversand und automatische Protokollverteilung sind noch nicht enthalten.
- Gelöschte Aufnahmen werden archiviert, nicht aus dem Dateisystem entfernt.
- Uneindeutige Gewerke werden nicht geraten.
- Keine Änderung an `plans.json`, Planversionierung, Pins, Fotos, Mail oder PDF.
- Kein API-Key wird in Code, Konfiguration oder Logs gespeichert.

## MVP 7h: Diktat-first

Stand: 01.07.2026

MVP 7h beendet die freie KI-Formulierung der Beobachtungsbeschreibung im Baustellenmodus.

### Verbindlicher Beschreibungsgrundsatz

Im Standardmodus gilt:

```text
description_de = cleaned_text_de
```

Wenn kein bereinigter Text vorhanden ist:

```text
description_de = raw_transcript
```

Die serverseitige Funktion `dictation_description` normalisiert ausschließlich zusammenhängenden Leerraum. Satzreihenfolge, Fristen, Handlungsrichtung und sämtliche gesprochenen Inhalte bleiben erhalten. Es werden keine Sätze entfernt oder auf eine feste Anzahl gekürzt.

Die API kennzeichnet:

```text
description_source = cleaned_text | raw_transcript
description_from_cleaned_text = true
ai_description_used = false
```

### KI als Feldextraktor

`POST /api/ai/structure-observation` fordert vom Textmodell nur noch:

- Titel
- Typ
- Gewerk
- Firma
- Verantwortlicher
- Status
- Priorität
- Frist
- Fachhinweisvorschläge aus vorhandener Bausteinbasis
- Feldquellen
- Feld-Confidence
- Warnungen

`description_de` ist nicht mehr Bestandteil des strukturierten OpenAI-Ausgabeschemas. Liefert ein Provider aus Kompatibilitätsgründen trotzdem eine Beschreibung, wird diese nur als `ai_description_alternative` geführt und im Standardmodus nicht verwendet.

### Vorschau

Die mobile Vorschau zeigt:

- `Beschreibung / Diktattext`
- Hinweis `Beschreibung basiert auf bereinigtem Diktat.`
- KI-Feldvorschläge im bestehenden Formular
- Rohtranskript, bereinigten Text, Feldquellen und Warnungen unter Details
- Confidence der Feldvorschläge
- optional eine ausdrücklich als nicht verwendet gekennzeichnete KI-Alternative

### Speichermetadaten

Bei bestätigter Speicherung werden zusätzlich abgelegt:

```text
description_source
ai_field_extraction_used
ai_description_used = false
field_sources[]
field_confidence[]
ai_warnings[]
user_final_values
changed_fields[]
```

Rohtranskript, bereinigter Text und Originalaudio bleiben weiterhin als Beweisgrundlage erhalten. Bestehende Windows-Dialoge ignorieren zusätzliche JSON-Felder und bleiben kompatibel.

### Transkription

Aktive Konfiguration:

```text
ai_model_transcription = gpt-4o-transcribe
```

Deutsch ist im Baustellenmodus voreingestellt. Albanisch, gemischte Sprache und automatische Erkennung können im Expertenmodus weiterhin gewählt werden. Die Rohtranskription bleibt kontextarm; Glossar, `protected_terms`, Projekt- und Stammdaten werden erst bei Bereinigung und Feldextraktion verwendet.

### Sicherheitsgrenzen

- Keine automatische Speicherung ohne `Übernehmen (geprüft)`.
- Keine freie KI-Beschreibung im Standardmodus.
- Fachhinweise ausschließlich aus vorhandener Bausteinbasis.
- Keine frei erfundenen Normen oder Herstellerangaben.
- Keine Änderung an `plans.json`, Planversionierung, Pins, Fotos, Mail oder PDF.

## v113 Hotfix: Baustellenkontrolle, Berichtsdaten und Adressübernahme

### Ziel
Der Hotfix v113 stabilisiert die gemeinsame Nutzung von Projektdaten, Planbezügen, Pins, Fotos und Berichtsinhalten für Baustellenkontrolle und Bautagesbericht, ohne den bestehenden A4-Berichtspfad der Bewehrungsabnahme zu verändern.

### Bautagesbericht: Projektadresse übernehmen
Der Bautagesbericht verwendet dieselbe Projektadress-Aufbereitung wie die Baustellenkontrolle. Über die Schaltfläche `Adresse aus Stammdaten übernehmen` wird die im Projekt gespeicherte Adresse in den Tagesbericht übernommen und im Bericht verwendet. Wenn im Projekt keine verwertbare Adresse vorhanden ist, wird eine klare App-Meldung angezeigt und es werden keine leeren Daten überschrieben.

### Baustellenkontrolle: Feststellungen im Bericht
Feststellungen der Baustellenkontrolle werden für die Berichtsausgabe aus den erfassten Site-Control-Items aufgebaut. Der Bericht berücksichtigt insbesondere:

- Art / Typ der Feststellung
- Status
- Bereich / Ort
- Gewerk, Firma und verantwortliche Person
- Beschreibung / Bemerkung
- Planbezug und Pin-Referenz
- Fotos aus der Feststellung und aus verknüpften Pins

Damit werden Berichte nicht mehr leer erzeugt, wenn eine Feststellung primär über eine Planmarkierung mit Pin und Foto dokumentiert wurde.

### Pin-Notizen und Fotos
Planpins, die aus einer Baustellenkontroll-Feststellung entstehen, bleiben fachlich mit dieser Feststellung verbunden. Die Synchronisierung erfolgt über die bestehende Pin-/Item-Verknüpfung. Pin-Notizen werden als Beschreibung der Feststellung verwendet, wenn dort noch kein eigener Text vorhanden ist. Pin-Fotos werden der zugehörigen Feststellung zugeordnet, ohne die gespeicherten Bilddaten zu duplizieren.

### Gemeinsame Berichtlogik
Der offizielle PDF-Weg bleibt der A4-Bericht über Vorschau und Druckdialog. v113 bereitet eine stärkere gemeinsame Berichtsnutzung vor, indem Projektadresse, Fotos, Planbezüge und Pin-Referenzen für Baustellenkontrolle und Bautagesbericht über gemeinsame Hilfsfunktionen aufbereitet werden. Der A4-Berichtspfad der Bewehrungsabnahme wird dabei nicht umgebaut.

### Bestandsschutz
Es wurden keine Datenbank-Stores, keine Planspeicher-Dateien und keine `plans.json`-Strukturen geändert. Bestehende Projektpläne bleiben unverändert. Der Hotfix arbeitet nur mit vorhandenen Verknüpfungen und Berichtsdaten.

## v114 Hotfix: Adressformatierung und Planmarkierungen im Baustellenkontroll-Bericht

### Adressformatierung
Die gemeinsame Adressformatierung berücksichtigt nun Straße, Hausnummer, PLZ und Ort getrennt. Ausgabe einzeilig: Straße Hausnummer, PLZ Ort; mehrzeilig: Straße Hausnummer und darunter PLZ Ort.

### Baustellenkontrolle: Planmarkierungen im Bericht
Für Baustellenkontroll-Feststellungen mit Pin wird die verknüpfte Planseite nun für den Bericht gerendert. Dabei werden auch zentrale Projektpläne berücksichtigt, nicht nur Pläne, die direkt im aktuellen Protokoll gespeichert sind. Die Ausgabe verwendet den bestehenden Planbild-/Pinmarker-Mechanismus des A4-Berichts.

### Fehlerfall
Wenn ein Pin vorhanden ist, der Plan oder die Planseite aber nicht geladen werden kann, wird im Bericht eine sichtbare Warnung mit plan_id und pin_id ausgegeben. Es bleibt kein still leerer Bereich.

### Bestandsschutz
Keine Änderung an plans.json, keine Datenbankmigration, keine Änderung der Pin-Koordinaten und keine Änderung des Planviewers.

## v115 MVP 8: Bautagesbericht Voice-First nach FoxBuild-Prinzip

### Ziel
Der Bautagesbericht kann als Diktat-first-Workflow begonnen werden. Ein großer Button erfasst den freien Tagesbericht per Browser-Spracherkennung. Das Rohtranskript bleibt sichtbar und wird lokal regelbasiert in Formularfelder und Mitarbeiterfelder überführt. Es werden keine API-Keys im Browser gespeichert und keine Angaben automatisch versendet.

### Lokale Auswertung
Die App erkennt im MVP ohne Server-KI: Mitarbeiteranzahl, genannte Namen, Firmen aus Stammdaten, Arbeitszeit, Wetter-/Temperaturhinweise, Gewerk, Material, Geräte, Behinderungen, Mängel und den wortnahen Tätigkeits-/Originaltext. Nicht erkannte Felder bleiben leer.

### Personal / Mitarbeiter
Aus Formulierungen wie „vier Mann“, „wir waren zu dritt“ oder „Von LTH Bau waren Labi und Arben da“ erzeugt die App Mitarbeiterkarten. Eindeutige Stammdaten-Treffer werden vorausgefüllt. Unklare oder fehlende Treffer bleiben sichtbar prüfpflichtig. Gespeichert werden unter anderem mitarbeiter_count_spoken, selected_employee_ids, unmatched_employee_names, employee_field_sources, employee_confidence und ai_employee_extraction_used.

### Deutsch / Albanisch / Mixed
Deutsch und Albanisch können über getrennte Mikrofonbuttons erfasst werden. Albanische oder gemischte Texte bleiben als Original/Rohtranskript erhalten. Eine echte Übersetzung bleibt weiterhin dem vorbereiteten geschützten Server-Endpunkt bzw. dem manuellen Übersetzungsworkflow vorbehalten.

### Diktat-first-Regel und Prüfung
Die Felder werden wortnah aus dem Diktat übernommen. Die App formuliert keine rechtlichen Bewertungen und erfindet keine Inhalte. Der Nutzer prüft die Vorschau, korrigiert Felder und erzeugt erst danach bewusst den A4-Bericht.

### Bestandsschutz
Bestehende manuelle Bautagesberichte bleiben bearbeitbar. Der A4-Berichtspfad, PDF speichern, Planviewer, Pins, Backup/Restore und plans.json wurden nicht umgebaut.
## v116 - Projektpläne in Bewehrungsabnahme
- Zentrale Projektpläne werden in der Bewehrungsabnahme automatisch im Plan-Tab angeboten, ohne manuelle Übernahme in die Abnahme.
- Planansicht nutzt die vorhandenen lokalen Plan-/PDF-Daten und bleibt ohne API-/Dropbox-/IndexedDB-Migration.
- Mobile Planansicht: bestehendes Zoom/Pan/Pinch bleibt erhalten, zusätzlich Rotationsbuttons für PDF-Planseiten.
- Rotation wird pro Abnahme/Plan in `planViewSettings` gespeichert; `plans.json` bleibt unverändert.
- Pin-Koordinaten und Berichtsausgabe bleiben unverändert; fachliche Pins werden weiterhin im Check-Markierungsdialog gesetzt.

