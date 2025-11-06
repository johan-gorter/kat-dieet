# QR Code Instructies

## Hoe maak je een QR-code aan

1. **Kies een wachtwoord** - Bij eerste gebruik van de app kies je een wachtwoord

2. **Maak de QR-code URL** - Combineer de app URL met je wachtwoord:
   - Voor lokaal gebruik: `http://localhost:3000?p=jouwwachtwoord`
   - Voor productie: `https://jouw-domein.nl?p=jouwwachtwoord`

3. **Genereer de QR-code** - Gebruik een van deze online tools:
   - https://www.qr-code-generator.com
   - https://www.qrcode-monkey.com
   - https://goqr.me
   
4. **Print de QR-code** - Print de code en plak hem bij de voerzak

5. **Gebruik de app** - Scan de QR-code met je telefoon om direct in te loggen

## Beveiligingstip

⚠️ Omdat het wachtwoord in de URL staat, moet je de QR-code veilig bewaren (bijvoorbeeld alleen in huis). Deel de QR-code niet met anderen die geen toegang tot de kat-voeding mogen hebben.

## Voorbeeld QR-code

Als je wachtwoord bijvoorbeeld "KatVoer2024" is, dan wordt je URL:
```
http://localhost:3000?p=KatVoer2024
```

Deze URL voer je in bij de QR-code generator.
