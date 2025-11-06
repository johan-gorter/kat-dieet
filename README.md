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

## Productie Deployment

Voor productie gebruik:

1. Zet een omgevingsvariabele `PORT` voor de gewenste poort
2. Gebruik een process manager zoals PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name kat-dieet
   ```
3. Configureer een reverse proxy (nginx/Apache) voor HTTPS