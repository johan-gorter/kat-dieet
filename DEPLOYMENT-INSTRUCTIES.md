# 🚀 Deployment Instructies - Snel Overzicht

## Wat is er geïmplementeerd?

✅ **GitHub Actions workflows** voor automatische deployment
- `deploy-test.yml` - Deploy naar test omgeving bij push naar `develop` branch
- `deploy-production.yml` - Deploy naar productie bij push naar `main` branch

✅ **Supabase Edge Function** 
- Deno-gebaseerde versie van de app die draait op Supabase
- Data opslag via Deno KV Store (gratis, persistent)
- Identieke functionaliteit als de lokale Node.js versie

✅ **Volledige documentatie**
- `SUPABASE-SETUP.md` - Uitgebreide setup guide met screenshots en troubleshooting

---

## 📋 Stappen om Supabase te Koppelen

### 1️⃣ Supabase Account Aanmaken
1. Ga naar [https://supabase.com](https://supabase.com)
2. Klik op "Start your project" en meld je aan

### 2️⃣ Twee Projecten Aanmaken

**Test Project:**
- Naam: `kat-dieet-test`
- Regio: `West EU (Ireland)` (aanbevolen)
- Plan: Free
- **Noteer het Project Reference ID** (staat in de URL na projectaanmaak)

**Productie Project:**
- Naam: `kat-dieet-prod`
- Regio: `West EU (Ireland)` (aanbevolen)
- Plan: Free
- **Noteer het Project Reference ID**

### 3️⃣ Access Token Genereren
1. Ga naar: [https://app.supabase.com/account/tokens](https://app.supabase.com/account/tokens)
2. Klik "Generate new token"
3. Naam: `github-actions-deploy`
4. Scope: `all`
5. **Kopieer het token direct** (je ziet het maar 1x!)

### 4️⃣ GitHub Secrets Configureren
1. Ga naar: [https://github.com/johan-gorter/kat-dieet/settings/secrets/actions](https://github.com/johan-gorter/kat-dieet/settings/secrets/actions)
2. Klik "New repository secret" voor elk van deze secrets:

| Secret Naam | Waarde |
|-------------|--------|
| `SUPABASE_ACCESS_TOKEN` | Het access token uit stap 3 |
| `SUPABASE_TEST_PROJECT_REF` | Project Reference ID van test project |
| `SUPABASE_PROD_PROJECT_REF` | Project Reference ID van productie project |

### 5️⃣ Eerste Deployment Starten

**Voor Test:**
```bash
# Optie A: Via GitHub Actions UI
# Ga naar: https://github.com/johan-gorter/kat-dieet/actions
# Selecteer "Deploy to Test Environment" → "Run workflow"

# Optie B: Push naar develop branch
git checkout -b develop
git push -u origin develop
```

**Voor Productie:**
```bash
# Optie A: Via GitHub Actions UI
# Ga naar: https://github.com/johan-gorter/kat-dieet/actions
# Selecteer "Deploy to Production" → "Run workflow"

# Optie B: Push naar main branch
git push origin main
```

---

## 🌐 Je App URLs

Na succesvolle deployment zijn je apps beschikbaar op:

**Test:**
```
https://[TEST-PROJECT-REF].supabase.co/functions/v1/kat-dieet
```

**Productie:**
```
https://[PROD-PROJECT-REF].supabase.co/functions/v1/kat-dieet
```

Vervang `[TEST-PROJECT-REF]` en `[PROD-PROJECT-REF]` met je daadwerkelijke Project Reference IDs.

---

## 📱 QR Code voor Makkelijke Toegang

Maak een QR code met je wachtwoord erin:
```
https://[PROJECT-REF].supabase.co/functions/v1/kat-dieet?p=jouwwachtwoord
```

Gebruik: [https://www.qr-code-generator.com](https://www.qr-code-generator.com)

---

## 💰 Kosten

**Free Tier** (voldoende voor persoonlijk gebruik):
- ✅ 500MB database storage
- ✅ 1GB file storage  
- ✅ 2GB data transfer
- ✅ 500,000 Edge Function aanroepen per maand
- ✅ Onbeperkte API requests

**Geen creditcard vereist voor Free tier!**

---

## 🔧 Lokale Development

Lokaal blijft alles werken zoals voorheen:

```bash
npm install
npm start
# Open http://localhost:3000
```

---

## ❓ Troubleshooting

**Deployment faalt?**
- Check of alle 3 secrets correct zijn ingesteld
- Controleer de GitHub Actions logs voor details

**App laadt niet?**
- Wacht 2-3 minuten na eerste deployment
- Check Supabase dashboard → Edge Functions voor logs

**Meer hulp nodig?**
Zie `SUPABASE-SETUP.md` voor gedetailleerde troubleshooting en uitleg.

---

## 📚 Documentatie Links

- 📖 **Uitgebreide Setup Guide**: `SUPABASE-SETUP.md`
- 🔗 **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- 🔗 **GitHub Actions**: [https://docs.github.com/actions](https://docs.github.com/actions)
