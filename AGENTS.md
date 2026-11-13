# AGENTS.md – Verbindliche Regeln für die Arbeit am Buch

Diese Anweisungen gelten für alle KI-Coding- und Schreibassistenten, die in diesem Repository arbeiten. Sie gelten unabhängig davon, ob die Änderung direkt in GitHub oder über ein lokales Arbeitsverzeichnis erfolgt.

## 1. Unveränderliche Projektstruktur

Das bestehende Repository ist technisch eingerichtet. **Es darf ausschließlich am literarischen Inhalt des Buches gearbeitet werden.**

- Keine Dateien oder Verzeichnisse hinzufügen, löschen, verschieben oder umbenennen.
- Keine Änderungen an GitHub Actions, GitHub Pages, Build-Prozess, Reader, Tests, Abhängigkeiten oder Deployment.
- Keine Änderungen an `main.tex`, `literatur.bib`, `.gitignore`, `README.md`, `AGENTS.md` oder Dateien unter `.github/`, `web/` und `tests/`.
- Bearbeite ausschließlich den erzählerischen Text in bereits vorhandenen Dateien unter `kapitel/` und nur soweit es der konkrete Schreibauftrag erfordert.
- LaTeX-Grundgerüst, Kapitel- und Abschnittsgliederung, Überschriftenhierarchie, Labels, Referenzen und vorhandene Formatierung beibehalten. Keine Umstrukturierung des Buches.
- Vorhandene LaTeX-Befehle, Verweise und Sonderzeichen korrekt behandeln; keine Syntaxfehler erzeugen.
- Wenn eine Aufgabe eine strukturelle oder technische Änderung erfordern würde, **nicht eigenmächtig ändern**. Zuerst ausdrücklich beim Auftraggeber nachfragen.

Eine ausdrückliche spätere Anweisung des Auftraggebers kann diese Einschränkungen für eine konkrete Änderung aufheben.

## 2. Git-Arbeitsweise

- **Immer direkt auf dem bestehenden Branch `main` arbeiten.**
- Keine Feature-Branches, Pull Requests oder Forks für Schreibaufträge anlegen.
- Vor Änderungen den aktuellen Stand von `main` einlesen, damit keine fremden Änderungen überschrieben werden.
- Nur die beauftragten Buchtextänderungen committen und unmittelbar nach erfolgreicher Bearbeitung nach `main` pushen.
- Commit-Nachrichten kurz und aussagekräftig auf Deutsch verfassen.
- Der Push auf `main` startet automatisch den LaTeX-PDF-Build. Deshalb vor dem Push auf gültige LaTeX-Syntax achten.
- Nach dem Push, soweit Zugriff besteht, den GitHub-Actions-Build prüfen. Wenn er fehlschlägt, nur selbst verursachte Fehler in erlaubten Buchtextdateien korrigieren; bei technischen Problemen nicht eigenmächtig die Infrastruktur verändern.
- Besteht kein Schreibzugriff, die Einschränkung offen nennen statt einen Branch oder Pull Request als Ersatz anzulegen.

## 3. Genre und Schreibstil: Dark Romance

Das Buch ist ein **Dark-Romance-Roman**. Jeder neu geschriebene oder zur Überarbeitung übergebene erzählerische Text soll sprachlich zu diesem Genre passen.

- Dichte, atmosphärische, erwachsene Prosa mit emotionaler Intensität, Ambivalenz und glaubwürdiger psychologischer Spannung.
- Nähe, Begehren, Verletzlichkeit, Machtgefälle, Konflikte und innere Widersprüche können subtil und szenisch ausgearbeitet werden, soweit sie zur konkreten Geschichte passen.
- Szenen möglichst durch Wahrnehmungen, Handlungen, Körperreaktionen und Dialoge tragen, statt Gefühle nur zu erklären.
- Natürlich klingende, individuelle Figurenstimmen und Dialoge; Perspektive, Erzählzeit und bestehende Erzählstimme konsequent beibehalten.
- Satzrhythmus und Wortwahl der jeweiligen Szene anpassen. Keine formelhaften Metaphern, unpassende Übertreibung, künstlichen Cliffhanger oder ständig wiederholte Dark-Romance-Klischees.
- Dunkle Themen weder verharmlosen noch ungefragt verstärken. Eine gewünschte Grenzüberschreitung, Gewaltszene oder explizite Szene nicht ohne Auftrag erfinden.

**Wichtig:** Die Vorlage ist maßgeblich. Handlung, Figuren, Beziehungen, Reihenfolge, Perspektive, Motive und ausdrücklich festgelegte Fakten erhalten. Eine stilistische Überarbeitung darf den Sinn nicht eigenmächtig verändern. Lücken, neue Wendungen und Charaktereigenschaften nicht ohne Auftrag erfinden.

## 4. Redaktion, Rechtschreibung und Formatierung

Jeden bearbeiteten Buchtext vor dem Commit sorgfältig redigieren:

- Deutsche Rechtschreibung, Grammatik, Zeichensetzung und Satzbau korrigieren.
- Holprige, unklare oder unbeabsichtigt wiederholende Formulierungen verbessern.
- Wortwahl und Lesefluss für Dark Romance anpassen, ohne Aussage und persönliche Tonalität der Szene zu verlieren.
- Absätze nach Sinn und Szenenrhythmus setzen; Dialoge sauber und einheitlich formatieren.
- Bestehende direkte Rede, Kursivierungen und Hervorhebungen konsistent behandeln.
- Typografische und LaTeX-Konventionen des vorhandenen Projekts einhalten. Sonderzeichen wie `%`, `&`, `#` und `_` in Fließtext korrekt für LaTeX schreiben.
- Keine Markdown-Syntax in LaTeX-Dateien verwenden. Kein zusätzlicher Meta-Kommentar, keine Notizen über den Überarbeitungsprozess im Romantext.
- Bei größeren Überarbeitungen auf Anschlussfehler zur vorhergehenden und folgenden Szene achten.

## 5. Platzhalter für noch fehlende Passagen

Eine Folge aus **mehr als drei Fragezeichen direkt hintereinander** (`????`, `?????` usw.) ist ein bewusst gesetzter Platzhalter für eine später einzufügende Buchpassage.

- Die Fragezeichenfolge **genau so stehen lassen**, einschließlich ihrer Länge und Position im Text. Den Platzhalter auch bei sprachlicher Überarbeitung in das Buch übernehmen.
- Weder die fehlende Passage eigenständig erfinden noch die Lücke durch einen selbst geschriebenen Übergang, eine Zusammenfassung oder andere Zeichen ersetzen.
- Den Text vor und nach dem Platzhalter nicht so umschreiben, dass die bewusst offene Verbindung verdeckt oder der Platzhalter überflüssig wird.
- Erst wenn der Auftraggeber ausdrücklich vorgibt, was an dieser Stelle ergänzt werden soll, den betreffenden Platzhalter ersetzen. Andere Platzhalter bleiben unberührt.
- Ein, zwei oder drei aufeinanderfolgende Fragezeichen sind **nicht automatisch Platzhalter** und werden als gewöhnliche Satzzeichen behandelt.

## 6. Vor dem Abschluss

1. Nur die ausdrücklich beauftragten Dateien und Textstellen verändert?
2. Technische Dateien und Buchstruktur unverändert, soweit der Auftraggeber keine konkrete Ausnahme ausdrücklich beauftragt hat?
3. Sprache, Dark-Romance-Ton, Perspektive und Handlung konsistent?
4. Rechtschreibung, Grammatik, Interpunktion, Absätze und LaTeX-Syntax geprüft?
5. Änderungen direkt auf `main` gepusht und Build-Status, soweit zugänglich, kontrolliert?

Im Abschluss knapp erläutern, welche Textstellen geändert wurden, und den Stand des automatischen Builds nennen. Keine Funktions- oder Deployment-Erfolge behaupten, die nicht überprüft wurden.
