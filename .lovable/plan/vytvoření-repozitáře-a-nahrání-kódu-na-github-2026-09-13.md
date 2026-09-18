# Vytvoření repozitáře a nahrání kódu na GitHub

## Cíl
Vytvořit repozitář `alena-kuritka-dev` na účtu `chatgpt-kuritka` a nahrát do něj aktuální kód tohoto projektu.

## Důležité rozlišení — dvě různé věci
1. **Git sync (dvoucestná synchronizace Lovable ↔ GitHub)** — tu umí nastavit jen Lovable editor (Plus menu → GitHub → Connect project). Při autorizaci Lovable GitHub App si repozitář vytvoří Lovable samo a pak se vše synchronizuje automaticky. Toto nemohu udělat za tebe kódem.
2. **Vytvoření repozitáře + jednorázové nahrání kódu přes GitHub API** — to mohu udělat já pomocí GitHub konektoru. Výsledek: repozitář existuje a obsahuje aktuální kód, ale **bez automatické synchronizace** — další změny z Lovable by se tam samy nedostávaly.

## Plán (varianta 2 — přes GitHub API)
1. Připojit GitHub konektor (otevře se karta, kde potvrdíš připojení k účtu `chatgpt-kuritka`).
2. Přes GitHub API vytvořit repozitář `alena-kuritka-dev` (public).
3. Přes GitHub API (trees/commits) nahrát všechny soubory projektu do větve `main` — jeden commit s aktuálním stavem kódu.
4. Ověřit voláním API, že repozitář existuje a obsahuje soubory.

## Co budeš muset udělat ty
- Potvrdit kartu pro připojení GitHub konektoru.
- Pokud chceš i automatickou synchronizaci: po vytvoření repa přes API ho Lovable nedokáže „přebrat" — pro sync je potřeba jít přes Plus menu → GitHub → Connect project, což vytvoří **nový** repozitář. Obojí současně na stejném repozitáři nejde.

## Poznámky
- Repozitář bude veřejný (public), jak jsi dříve uvedl.
- Pokud je tvým hlavním cílem dvoucestná synchronizace, doporučuji variantu 1 (ručně přes editor) — pak tento plán není potřeba.
