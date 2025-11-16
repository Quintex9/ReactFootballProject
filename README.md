# Live Sports Dashboard

Aplikácia na sledovanie živých športových výsledkov v reálnom čase. Dashboard poskytuje prehľad aktuálnych zápasov naprieč viacerými športovými ligami s automatickým obnovovaním dát každých 20 sekúnd.

## 📋 Popis projektu

Live Sports Dashboard je moderná webová aplikácia postavená na Next.js, ktorá umožňuje používateľom:

- **Sledovanie živých zápasov** v reálnom čase pre viacero športov
- **Filtrovanie podľa ligy** pre každý šport
- **Ukladanie obľúbených zápasov** s synchronizáciou cez Supabase
- **Autentifikácia používateľov** pre personalizované skúsenosti
- **Detailné informácie o zápasoch** vrátane štatistík a histórie

### Podporované športy

- ⚽ Football (Futbal)
- 🏀 NBA (Basketball)
- ⚾ MLB (Baseball)
- 🏈 NFL (American Football)
- 🏒 Hockey
- 🤾 Handball

### Technológie

- **Framework:** Next.js 16 (App Router)
- **React:** 19.2.0
- **TypeScript:** 5
- **Styling:** Tailwind CSS 4
- **Data Fetching:** SWR
- **Authentication:** Supabase
- **API:** API-SPORTS

## 🚀 Lokálne spustenie

### Požiadavky

- Node.js 20 alebo vyššie
- npm, yarn, pnpm alebo bun
- API kľúč od [API-SPORTS](https://www.api-sports.io/)
- Supabase projekt (voliteľné, pre autentifikáciu a obľúbené zápasy)

### Inštalácia

1. **Naklonujte repozitár:**
   ```bash
   git clone <repository-url>
   cd live-sports-dashboard
   ```

2. **Nainštalujte závislosti:**
   ```bash
   npm install
   # alebo
   yarn install
   # alebo
   pnpm install
   ```

3. **Vytvorte súbor `.env.local` v koreňovom adresári:**
   ```env
   # API-SPORTS kľúč (povinné)
   APISPORTS_KEY=your_api_sports_key_here

   # Supabase konfigurácia (voliteľné, pre autentifikáciu)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # URL aplikácie (pre produkciu)
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Spustite vývojový server:**
   ```bash
   npm run dev
   # alebo
   yarn dev
   # alebo
   pnpm dev
   ```

5. **Otvorte prehliadač:**
   Navigujte na [http://localhost:3000](http://localhost:3000)

### Build pre produkciu

```bash
npm run build
npm start
```

## 🌐 Nasadená verzia

**Produkčná verzia:** [Pridajte link na nasadenú aplikáciu]

> **Poznámka:** Ak je aplikácia nasadená na Vercel alebo inej platforme, pridajte sem odkaz.

## 📁 Štruktúra projektu

```
live-sports-dashboard/
├── src/
│   ├── app/                    # Next.js App Router stránky
│   │   ├── api/                # API routes
│   │   ├── components/         # React komponenty
│   │   ├── auth/              # Autentifikačná stránka
│   │   ├── favorites/         # Obľúbené zápasy
│   │   └── details/          # Detail zápasu
│   ├── context/               # React context (FavoritesContext)
│   ├── lib/                   # Utility funkcie a konfigurácia
│   └── components/            # Zdieľané komponenty
├── public/                    # Statické súbory
└── package.json
```

## 🔑 Environment premenné

| Premenná | Popis | Povinné |
|----------|-------|---------|
| `APISPORTS_KEY` | API kľúč od API-SPORTS | ✅ Áno |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase projektu | ❌ Voliteľné |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon kľúč | ❌ Voliteľné |
| `NEXT_PUBLIC_SITE_URL` | URL aplikácie (pre produkciu) | ❌ Voliteľné |

## 📝 Funkcie

- ✅ Automatické obnovovanie dát každých 20 sekúnd
- ✅ Filtrovanie zápasov podľa ligy
- ✅ Detailné informácie o zápasoch
- ✅ Ukladanie obľúbených zápasov (s Supabase)
- ✅ Autentifikácia používateľov
- ✅ Responzívny dizajn
- ✅ Temný motív UI

## 🛠️ Vývoj

### Dostupné skripty

- `npm run dev` - Spustí vývojový server
- `npm run build` - Vytvorí produkčný build
- `npm start` - Spustí produkčný server
- `npm run lint` - Spustí ESLint

## 📄 Licencia

Tento projekt je privátny.

## 🤝 Príspevky

Príspevky sú vítané! Pre väčšie zmeny prosím najprv otvorte issue na diskusiu o zmene, ktorú chcete urobiť.
