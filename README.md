# SB Haircare App

Application capillaire pour cheveux afro-texturés — marque **SB Haircare**.

Stack : **Expo (React Native + Web) + Expo Router + NativeWind + Supabase + Claude API**.
Un seul codebase qui ship sur **Netlify** (web V1) puis **App Store** (V2).

---

## Lancer en local

```bash
cd sb-haircare
npm install
npm run web        # ouvre le navigateur
# ou
npm run ios        # simulateur iOS (besoin Xcode)
```

## Variables d'environnement

Copie `.env.example` en `.env` et renseigne :

```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
```

L'app fonctionne sans ces variables (mode local templates), mais auth + persistance + diagnostic IA nécessitent Supabase.

---

## Architecture des écrans

```
app/
├── _layout.tsx              # Root: fonts, auth bootstrap, providers
├── index.tsx                # Redirige vers (tabs) ou (onboarding)/welcome
│
├── (onboarding)/
│   ├── welcome.tsx          # Splash + CTA "Commencer le diagnostic"
│   ├── signin.tsx           # Connexion (utilisateurs existants)
│   ├── name.tsx             # Étape 1/7 — prénom
│   ├── hair-type.tsx        # Étape 2/7 — 3A → 4C
│   ├── porosity.tsx         # Étape 3/7 — faible/moyenne/élevée
│   ├── length.tsx           # Étape 4/7 — longueur actuelle + objectif
│   ├── concerns.tsx         # Étape 5/7 — préoccupations (multi-select)
│   ├── routine.tsx          # Étape 6/7 — cuir chevelu, fréquence, routine actuelle
│   ├── photo.tsx            # Étape 7/7 — photo optionnelle pour diagnostic IA
│   ├── diagnostic.tsx       # Loading IA puis affichage du profil capillaire
│   └── result.tsx           # Inscription + sauvegarde du profil
│
├── (tabs)/                  # Navigation principale post-onboarding
│   ├── _layout.tsx
│   ├── index.tsx            # Accueil — focus semaine, missions, série
│   ├── hairstyle.tsx        # Planner + compteur styles protecteurs
│   ├── washday.tsx          # Wash Day Journal (lance les flows)
│   ├── learn.tsx            # Recettes DIY + articles
│   └── profile.tsx          # Profil + résultats + routine sauvegardée
│
└── wash/                    # Flow wash day pas-à-pas
    ├── _layout.tsx
    ├── select.tsx           # Choisir un rituel
    ├── intro.tsx            # "Prêt(e) à commencer ?"
    ├── step.tsx             # Suggestion → minuteur → rappel par étape
    ├── photo.tsx            # Washday progress photo
    ├── feedback.tsx         # Amazing / Good / Could be better
    └── complete.tsx         # "Flow terminé !"
```

## Composants & thème

- `src/theme/colors.ts` — palette bordeaux/crème/ocre/ink (charte SB Haircare)
- `src/theme/fonts.ts` — Playfair Display (sérif) + Inter (sans)
- `src/components/` — `Text`, `Card`, `Button`, `Input`, `Choice`, `ProgressDots`, `OnboardingShell`, `ScreenContainer`
- `src/store/` — Zustand stores : `auth`, `onboarding`, `washFlow`
- `src/lib/` — `supabase`, `diagnostic` (appel Edge Function Claude), `washFlows` (templates locaux + Supabase)

## Backend Supabase

Voir [supabase/README.md](supabase/README.md). 4 fichiers SQL à exécuter dans l'ordre :

1. `migrations/0001_initial_schema.sql` — tables (profiles, hair_diary, missions, wash_day_flows, etc.)
2. `migrations/0002_rls_policies.sql` — Row Level Security
3. `migrations/0003_seed_data.sql` — missions par défaut + 6 wash day flows
4. `storage.sql` — buckets `hair-photos` et `avatars`

## Edge Function — Diagnostic IA

`supabase/functions/diagnostic/index.ts` — appelle Claude (claude-opus-4-7) pour générer un profil capillaire structuré à partir du questionnaire + photo optionnelle.

```bash
# Déploiement
supabase functions deploy diagnostic
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

---

## Déploiement Netlify

1. Push le repo sur GitHub
2. Sur [Netlify](https://app.netlify.com) → "New site from Git" → connecte le repo
3. Netlify lit le `netlify.toml` automatiquement :
   - Build : `npm run build:web`
   - Publish : `dist/`
   - SPA redirects vers `/index.html`
4. Dans **Site settings → Environment variables**, ajoute :
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
5. Trigger un deploy. C'est live.

## Roadmap V2 (App Store)

- IA visuelle avancée : tracking longueur/dommages/brillance avec caméra native
- Notifications push (rappels timer, wash day J-1)
- Récompenses e-commerce (Stripe + lien produits SB Haircare)
- Forum communauté
- Tutoriels vidéo intégrés (Mux ou Cloudflare Stream)
