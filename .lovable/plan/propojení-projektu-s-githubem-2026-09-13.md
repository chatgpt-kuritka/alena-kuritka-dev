# Propojení projektu s GitHubem

## Cíl
Nastavit obousměrnou synchronizaci zdrojového kódu mezi tímto Lovable projektem a GitHub účtem `chatgpt-kuritka`.

## Omezení
Lovable aktuálně nepodporuje přímé připojení existujícího GitHub repozitáře (`alena-kuritka-dev`). Lze vytvořit nový repozitář přes Lovable a následně do něj ručně přenést obsah, nebo založit nový projekt a zkopírovat kód opačným směrem.

## Navrhovaný postup

1. **Autorizovat GitHub v Lovable**
   - V editoru otevřít Plus (+) menu → GitHub → Connect project.
   - Autorizovat Lovable GitHub App na účtu `chatgpt-kuritka`.
   - Vybrat účet/organizaci `chatgpt-kuritka`.

2. **Vytvořit nový repozitář pro sync**
   - V Lovable kliknout na Create Repository.
   - Zvolit název (např. `alena-kuritka-dev-lovable` nebo jiný volný název).
   - Lovable do nového repozitáře nahraje aktuální zdrojový kód projektu.

3. **Přenést obsah z existujícího repozitáře** (pokud je to požadováno)
   - Naklonovat existující repozitář `github.com/chatgpt-kuritka/alena-kuritka-dev` lokálně.
   - Překopírovat potřebné soubory do nového repozitáře vytvořeného přes Lovable.
   - Commitnout a pushnout změny; Lovable je automaticky stáhne zpět.

4. **Ověřit obousměrný sync**
   - Udělat malou změnu v Lovable a zkontrolovat, že se objeví na GitHubu.
   - Udělat malou změnu v GitHubu a zkontrolovat, že se propsala do Lovable.

## Alternativa
Pokud je nutné zachovat přesný název `alena-kuritka-dev`, Lovable toto přímo neumožňuje. Doporučuji vytvořit nový repozitář a po úvodní synchronizaci upravit název/přesměrování podle potřeby.
