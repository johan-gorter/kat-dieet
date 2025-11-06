# Kat Dieet Tracker

Web applicatie voor het bijhouden van de dagelijkse voeding van je kat.

## Functionaliteit

- Track hoeveel gram brokjes je kat per dag eet
- Maximale limiet van 50 gram per dag
- Weeg de voerzak voor en na het vullen van het bakje
- Zie direct hoeveel de kat heeft gegeten en hoeveel nog mag
- Veilige toegang via wachtwoord
- QR-code ondersteuning voor eenvoudige toegang

## Installatie

```bash
npm install
```

## Gebruik

1. Start de server:
```bash
npm start
```

2. Open je browser en ga naar `http://localhost:3000`

3. Bij eerste gebruik: kies een wachtwoord. Dit wordt veilig opgeslagen.

4. Bij volgende bezoeken: log in met je wachtwoord

## QR-code Toegang

Je kunt een QR-code maken met een link naar de app inclusief wachtwoord:

```
http://localhost:3000?p=jouwwachtwoord
```

Of voor productie:

```
https://jouw-domein.nl?p=jouwwachtwoord
```

Gebruik een QR-code generator (bijv. https://www.qr-code-generator.com) om deze link om te zetten naar een QR-code die je kunt printen.

## Technische Details

- **Volle zak**: 810 gram
- **Lege zak**: 10 gram  
- **Dagelijkse limiet**: 50 gram
- **Gegevensopslag**: `data.json` bestand (automatisch aangemaakt)

## Beveiliging

- Wachtwoorden worden veilig gehasht met bcrypt
- Data wordt lokaal opgeslagen in JSON formaat
- Geen externe dependencies voor data opslag

## Cloud Deployment naar Supabase

Deze app kan automatisch worden gedeployed naar Supabase met GitHub Actions.

📘 **[Zie SUPABASE-SETUP.md voor volledige setup instructies](./SUPABASE-SETUP.md)**

**Snelle setup:**
1. Maak twee Supabase projecten aan (test en productie)
2. Genereer een Supabase Access Token
3. Voeg drie secrets toe aan GitHub:
   - `SUPABASE_ACCESS_TOKEN`
   - `SUPABASE_TEST_PROJECT_REF`
   - `SUPABASE_PROD_PROJECT_REF`
4. Push naar `develop` branch voor test deployment
5. Push naar `main` branch voor productie deployment

Je app is dan beschikbaar op:
- Test: `https://[TEST-REF].supabase.co/functions/v1/kat-dieet`
- Productie: `https://[PROD-REF].supabase.co/functions/v1/kat-dieet`

## Lokale Development

Voor lokale development:

1. Installeer dependencies:
   ```bash
   npm install
   ```

2. Start de server:
   ```bash
   npm start
   ```

3. Open je browser op `http://localhost:3000`

## Alternatieve Productie Deployment (Self-hosted)

Voor self-hosted deployment gebruik:

1. Zet een omgevingsvariabele `PORT` voor de gewenste poort
2. Gebruik een process manager zoals PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name kat-dieet
   ```
3. Configureer een reverse proxy (nginx/Apache) voor HTTPS