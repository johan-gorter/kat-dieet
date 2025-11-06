# Supabase Deployment Setup Guide

Deze gids legt uit hoe je de Kat-dieet app kunt deployen naar Supabase met automatische deployments via GitHub Actions.

## Vereisten

- Een GitHub account met toegang tot deze repository
- Een Supabase account (gratis tier is voldoende)
- Admin rechten voor de GitHub repository om secrets te configureren

## Stap 1: Supabase Account en Projecten Aanmaken

### 1.1 Maak een Supabase account aan

1. Ga naar [https://supabase.com](https://supabase.com)
2. Klik op "Start your project"
3. Meld je aan met je GitHub account of email

### 1.2 Maak twee projecten aan

Je hebt twee aparte Supabase projecten nodig: één voor test/staging en één voor productie.

#### Test Project:
1. Klik op "New Project"
2. Kies een naam zoals: `kat-dieet-test`
3. Kies een sterk database wachtwoord (wordt automatisch gegenereerd)
4. Selecteer een regio (bij voorkeur `West EU (Ireland)` voor Nederlandse gebruikers)
5. Selecteer het Free tier
6. Klik op "Create new project"
7. Wacht tot het project klaar is (kan 1-2 minuten duren)
8. **Belangrijk**: Noteer het "Project Reference ID" - dit vind je in de URL: 
   - URL: `https://app.supabase.com/project/[PROJECT-REF]`
   - Of in: Settings > General > Reference ID

#### Productie Project:
1. Herhaal dezelfde stappen maar gebruik een naam zoals: `kat-dieet-prod`
2. **Belangrijk**: Noteer ook dit "Project Reference ID"

## Stap 2: Supabase Access Token Genereren

1. Ga naar je Supabase Dashboard
2. Klik op je profiel icoon (rechtsboven)
3. Klik op "Account Settings" of ga naar [https://app.supabase.com/account/tokens](https://app.supabase.com/account/tokens)
4. Klik op "Generate new token"
5. Geef het een naam zoals: `github-actions-deploy`
6. Selecteer de scope: `all` (voor full access) of minimaal `functions.write`
7. Klik op "Generate token"
8. **Belangrijk**: Kopieer dit token direct - je kunt het maar één keer zien!

## Stap 3: GitHub Secrets Configureren

Nu moet je drie secrets toevoegen aan je GitHub repository:

1. Ga naar je GitHub repository
2. Klik op "Settings" (bovenaan de repository pagina)
3. Klik in het linkermenu op "Secrets and variables" > "Actions"
4. Klik op "New repository secret" voor elk van de volgende secrets:

### Secret 1: SUPABASE_ACCESS_TOKEN
- **Name**: `SUPABASE_ACCESS_TOKEN`
- **Value**: Het access token dat je in Stap 2 hebt gegenereerd
- Klik op "Add secret"

### Secret 2: SUPABASE_TEST_PROJECT_REF
- **Name**: `SUPABASE_TEST_PROJECT_REF`
- **Value**: Het Project Reference ID van je test project
- Klik op "Add secret"

### Secret 3: SUPABASE_PROD_PROJECT_REF
- **Name**: `SUPABASE_PROD_PROJECT_REF`
- **Value**: Het Project Reference ID van je productie project
- Klik op "Add secret"

## Stap 4: Branches Aanmaken (optioneel)

De GitHub Actions zijn geconfigureerd om te deployen op basis van branches:

- **Test deployment**: triggered bij push naar de `develop` branch
- **Productie deployment**: triggered bij push naar de `main` branch

Als je een `develop` branch wilt gebruiken voor testing:

```bash
git checkout -b develop
git push -u origin develop
```

## Stap 5: Eerste Deployment

### Test Deployment

**Optie A: Via push naar develop branch**
```bash
git checkout develop
git add .
git commit -m "Setup Supabase deployment"
git push origin develop
```

**Optie B: Handmatige trigger via GitHub**
1. Ga naar je repository op GitHub
2. Klik op "Actions"
3. Selecteer "Deploy to Test Environment"
4. Klik op "Run workflow"
5. Selecteer de branch
6. Klik op "Run workflow"

### Productie Deployment

**Optie A: Via push naar main branch**
```bash
git checkout main
git merge develop  # of je changes
git push origin main
```

**Optie B: Handmatige trigger via GitHub**
1. Ga naar je repository op GitHub
2. Klik op "Actions"
3. Selecteer "Deploy to Production"
4. Klik op "Run workflow"
5. Selecteer de branch
6. Klik op "Run workflow"

## Stap 6: Je App Gebruiken

Na een succesvolle deployment zijn je apps beschikbaar op:

### Test URL:
```
https://[SUPABASE_TEST_PROJECT_REF].supabase.co/functions/v1/kat-dieet
```

### Productie URL:
```
https://[SUPABASE_PROD_PROJECT_REF].supabase.co/functions/v1/kat-dieet
```

Vervang `[SUPABASE_TEST_PROJECT_REF]` en `[SUPABASE_PROD_PROJECT_REF]` met je daadwerkelijke project reference IDs.

### Eerste keer gebruiken:
1. Open de URL in je browser
2. Kies een wachtwoord (dit wordt veilig opgeslagen)
3. Begin met het tracken van je kat's voeding!

### QR Code voor makkelijke toegang:
Je kunt een QR code maken met je wachtwoord in de URL:
```
https://[PROJECT_REF].supabase.co/functions/v1/kat-dieet?p=jouwwachtwoord
```

Gebruik een QR code generator zoals [https://www.qr-code-generator.com](https://www.qr-code-generator.com)

## Troubleshooting

### Deployment faalt met "Project not found"
- Controleer of de project reference IDs correct zijn
- Controleer of het access token geldig is en de juiste permissies heeft

### "Authentication failed" in GitHub Actions
- Controleer of `SUPABASE_ACCESS_TOKEN` correct is ingesteld als secret
- Genereer indien nodig een nieuwe token

### App laadt niet / 404 error
- Controleer of de deployment succesvol was in de GitHub Actions logs
- Wacht een paar minuten - eerste deployment kan wat langer duren
- Check de Supabase dashboard voor function logs

### Data wordt niet opgeslagen
- Supabase Edge Functions gebruiken Deno KV Store voor opslag
- Data is persistent per project
- Bij een nieuwe deployment blijft de data behouden

## Lokale Development

Voor lokale development kun je gewoon de originele Node.js versie gebruiken:

```bash
npm install
npm start
```

Dit draait op `http://localhost:3000`

## Kosten

- **Free tier**: Voldoende voor persoonlijk gebruik
  - 500MB database storage
  - 1GB file storage
  - 2GB data transfer
  - 500K Edge Function invocations per maand

- Voor meer intensief gebruik kun je upgraden naar Pro ($25/maand per project)

## Meer Informatie

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
