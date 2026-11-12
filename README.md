# LaTeX-Buch mit mobiler Live-PDF

Dieses Repository enthält ein LaTeX-Dokument, das bei jedem erfolgreichen Push auf `main` automatisch in eine PDF umgewandelt und über GitHub Pages veröffentlicht wird.

## Vorschau

Nach dem Aktivieren von **Settings → Pages → Build and deployment → Source: GitHub Actions** ist die Ansicht unter

https://philip20794.github.io/runa-buch/

erreichbar. Auf Android kann sie in Chrome über „Zum Startbildschirm hinzufügen“ als Verknüpfung abgelegt werden. Die geöffnete Vorschau prüft alle 15 Sekunden auf eine neu veröffentlichte Version. Sobald der Build und das Deployment fertig sind, wird die PDF ohne manuelles Neuladen aktualisiert.

## Bearbeiten

Die Einstiegsdatei ist `main.tex`. Kapitel stehen in `kapitel/`, Literatur in `literatur.bib`. Änderungen auf `main` starten den Workflow `LaTeX PDF veröffentlichen`; ein fehlerhafter Build verändert die bisher veröffentlichte PDF nicht.

Lokal mit installierten TeX Live, `latexmk` und `biber`:

```sh
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
```

Die lokale PDF heißt `main.pdf`. Die im Internet veröffentlichte Datei heißt `dokument.pdf`.

## Aufbau

- `main.tex`: Hauptdokument.
- `kapitel/`: einzelne LaTeX-Kapitel.
- `literatur.bib`: Literaturdatenbank.
- `web/`: statischer Reader mit PDF.js, Versionserkennung und mobilem Layout.
- `tests/`: automatisierte Tests für Versionsprüfung und URL-Erstellung.
- `.github/workflows/publish.yml`: LaTeX-Build und GitHub-Pages-Deployment.

Der Workflow holt eine festgelegte Version von `pdfjs-dist` aus npm und kopiert die benötigten PDF.js-Dateien in die veröffentlichte Webseite. Es wird kein eigener Server oder Service Worker verwendet.

## Fehlerdiagnose

Unter **Actions → LaTeX PDF veröffentlichen** zeigen die Jobs `build` und `deploy` den Status. Wenn die URL noch 404 zeigt, zuerst unter **Settings → Pages** den Veröffentlichungstyp **GitHub Actions** wählen. Ist `build` fehlgeschlagen, die LaTeX-Fehlermeldungen im Actions-Log prüfen. Bleibt die PDF im geöffneten Browser alt, auf den Status der Seite und den `deploy`-Job achten: Erst ein erfolgreiches Deployment ändert die veröffentlichte Versionsdatei.

**Hinweis:** GitHub Pages für dieses öffentliche Repository ist frei erreichbar; bitte keine vertraulichen Texte einchecken.
