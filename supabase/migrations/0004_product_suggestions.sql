-- SB Haircare — Suggestions de produits du marché
-- Permet à l'utilisatrice de proposer un produit absent du catalogue maître.
-- L'équipe SB valide manuellement et ajoute au catalogue marketCatalog.ts

create table if not exists public.product_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  product_name text not null,
  brand text not null,
  link text,
  notes text,
  reviewed boolean not null default false,
  added_to_catalog boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists product_suggestions_created_idx
  on public.product_suggestions (created_at desc);

alter table public.product_suggestions enable row level security;

-- Anyone (connecté ou anon) peut insérer une suggestion
drop policy if exists "suggestions_insert_anyone" on public.product_suggestions;
create policy "suggestions_insert_anyone" on public.product_suggestions
  for insert with check (true);

-- L'utilisatrice ne voit que ses propres suggestions
drop policy if exists "suggestions_select_own" on public.product_suggestions;
create policy "suggestions_select_own" on public.product_suggestions
  for select using (auth.uid() = user_id);
