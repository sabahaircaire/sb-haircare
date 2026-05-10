# Supabase setup — SB Haircare

## Étapes

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Récupère l'URL et la clé anon dans **Project Settings → API**
3. Renseigne `.env` à la racine du projet :
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
   ```
4. Dans le **SQL Editor** de Supabase, exécute dans l'ordre :
   - `migrations/0001_initial_schema.sql`
   - `migrations/0002_rls_policies.sql`
   - `migrations/0003_seed_data.sql`
   - `storage.sql`

## Tables principales

| Table | Rôle |
|---|---|
| `profiles` | Profil capillaire de l'utilisateur (type, porosité, longueur, objectif) |
| `hair_diary_entries` | Check-ins quotidiens (mood, hydratation, photo, notes) |
| `missions` | Catalogue des missions (template) |
| `user_missions` | Missions complétées par utilisateur+date |
| `user_stats` | XP, série, niveau |
| `wash_day_flows` | Templates de routines (jour de lavage, bain d'huile, masque ayur, etc.) |
| `wash_day_logs` | Logs d'exécution avec étapes complétées et feedback |
| `protective_style_logs` | Compteur de styles protecteurs (cornrows, locs, etc.) |
| `length_tracker_entries` | Photos avant/après + analyse IA |

## RLS

Chaque utilisateur ne voit que ses propres données. Les templates (`missions`, `wash_day_flows`) sont en lecture publique pour les utilisateurs authentifiés.

## Storage

- `hair-photos` (private, 10MB max) — photos de tracking longueur
- `avatars` (private, 2MB max) — photos de profil

Les chemins doivent suivre le format `<user_id>/<filename>` pour que les RLS storage fonctionnent.
