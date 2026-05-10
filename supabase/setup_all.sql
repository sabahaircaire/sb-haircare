-- SB Haircare — Setup complet (à coller en une fois dans le SQL Editor de Supabase)
-- Combine: schema + RLS + seed data + storage buckets/policies.
-- Idempotent à l'exception des seeds (insert sans on conflict — ne ré-exécute pas).

------------------------------------------------------------
-- 1) ENUMS & TABLES
------------------------------------------------------------
do $$ begin
  if not exists (select 1 from pg_type where typname = 'hair_type') then
    create type hair_type as enum ('3a','3b','3c','4a','4b','4c');
  end if;
  if not exists (select 1 from pg_type where typname = 'porosity') then
    create type porosity as enum ('low','medium','high');
  end if;
  if not exists (select 1 from pg_type where typname = 'length_label') then
    create type length_label as enum ('oreille','cou','epaules','poitrine','hanches','taille','coccyx');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  hair_type hair_type,
  porosity porosity,
  current_length length_label,
  goal_length length_label,
  diagnostic_summary jsonb,
  diagnostic_completed_at timestamptz,
  journey_started_at date default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hair_diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  mood text check (mood in ('amazing','good','could_be_better')),
  hydration_score smallint check (hydration_score between 1 and 5),
  notes text,
  photo_url text,
  created_at timestamptz not null default now(),
  unique(user_id, entry_date)
);
create index if not exists hair_diary_user_date_idx on public.hair_diary_entries (user_id, entry_date desc);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text,
  xp_reward int not null default 10,
  category text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  completed_date date not null default current_date,
  xp_earned int not null,
  created_at timestamptz not null default now(),
  unique(user_id, mission_id, completed_date)
);
create index if not exists user_missions_user_date_idx on public.user_missions (user_id, completed_date desc);

create table if not exists public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_xp int not null default 0,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  level_code text not null default 'curl_novice',
  last_active_date date,
  updated_at timestamptz not null default now()
);

create table if not exists public.wash_day_flows (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text,
  total_duration_min int not null,
  cadence text,
  steps jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.wash_day_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  flow_id uuid not null references public.wash_day_flows(id) on delete restrict,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  steps_completed jsonb,
  feedback text check (feedback in ('amazing','good','could_be_better')),
  before_photo_url text,
  after_photo_url text,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists wash_day_logs_user_idx on public.wash_day_logs (user_id, started_at desc);

create table if not exists public.protective_style_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  style_code text not null,
  style_name text not null,
  installed_on date not null,
  recommended_remove_on date not null,
  removed_on date,
  reminder_enabled boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists protective_style_user_idx on public.protective_style_logs (user_id, installed_on desc);

create table if not exists public.length_tracker_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  measured_on date not null default current_date,
  length_inches numeric(4,1),
  photo_url text,
  ai_analysis jsonb,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists length_tracker_user_idx on public.length_tracker_entries (user_id, measured_on desc);

------------------------------------------------------------
-- 2) TRIGGERS
------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute procedure public.touch_updated_at();

drop trigger if exists user_stats_touch on public.user_stats;
create trigger user_stats_touch before update on public.user_stats
  for each row execute procedure public.touch_updated_at();

create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  insert into public.user_stats (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

------------------------------------------------------------
-- 3) RLS
------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.hair_diary_entries enable row level security;
alter table public.user_missions enable row level security;
alter table public.user_stats enable row level security;
alter table public.wash_day_logs enable row level security;
alter table public.protective_style_logs enable row level security;
alter table public.length_tracker_entries enable row level security;
alter table public.missions enable row level security;
alter table public.wash_day_flows enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "diary_select_own" on public.hair_diary_entries;
create policy "diary_select_own" on public.hair_diary_entries for select using (auth.uid() = user_id);
drop policy if exists "diary_insert_own" on public.hair_diary_entries;
create policy "diary_insert_own" on public.hair_diary_entries for insert with check (auth.uid() = user_id);
drop policy if exists "diary_update_own" on public.hair_diary_entries;
create policy "diary_update_own" on public.hair_diary_entries for update using (auth.uid() = user_id);
drop policy if exists "diary_delete_own" on public.hair_diary_entries;
create policy "diary_delete_own" on public.hair_diary_entries for delete using (auth.uid() = user_id);

drop policy if exists "user_missions_select_own" on public.user_missions;
create policy "user_missions_select_own" on public.user_missions for select using (auth.uid() = user_id);
drop policy if exists "user_missions_insert_own" on public.user_missions;
create policy "user_missions_insert_own" on public.user_missions for insert with check (auth.uid() = user_id);

drop policy if exists "user_stats_select_own" on public.user_stats;
create policy "user_stats_select_own" on public.user_stats for select using (auth.uid() = user_id);
drop policy if exists "user_stats_update_own" on public.user_stats;
create policy "user_stats_update_own" on public.user_stats for update using (auth.uid() = user_id);

drop policy if exists "wash_day_logs_select_own" on public.wash_day_logs;
create policy "wash_day_logs_select_own" on public.wash_day_logs for select using (auth.uid() = user_id);
drop policy if exists "wash_day_logs_insert_own" on public.wash_day_logs;
create policy "wash_day_logs_insert_own" on public.wash_day_logs for insert with check (auth.uid() = user_id);
drop policy if exists "wash_day_logs_update_own" on public.wash_day_logs;
create policy "wash_day_logs_update_own" on public.wash_day_logs for update using (auth.uid() = user_id);

drop policy if exists "protective_style_select_own" on public.protective_style_logs;
create policy "protective_style_select_own" on public.protective_style_logs for select using (auth.uid() = user_id);
drop policy if exists "protective_style_insert_own" on public.protective_style_logs;
create policy "protective_style_insert_own" on public.protective_style_logs for insert with check (auth.uid() = user_id);
drop policy if exists "protective_style_update_own" on public.protective_style_logs;
create policy "protective_style_update_own" on public.protective_style_logs for update using (auth.uid() = user_id);
drop policy if exists "protective_style_delete_own" on public.protective_style_logs;
create policy "protective_style_delete_own" on public.protective_style_logs for delete using (auth.uid() = user_id);

drop policy if exists "length_select_own" on public.length_tracker_entries;
create policy "length_select_own" on public.length_tracker_entries for select using (auth.uid() = user_id);
drop policy if exists "length_insert_own" on public.length_tracker_entries;
create policy "length_insert_own" on public.length_tracker_entries for insert with check (auth.uid() = user_id);
drop policy if exists "length_update_own" on public.length_tracker_entries;
create policy "length_update_own" on public.length_tracker_entries for update using (auth.uid() = user_id);
drop policy if exists "length_delete_own" on public.length_tracker_entries;
create policy "length_delete_own" on public.length_tracker_entries for delete using (auth.uid() = user_id);

drop policy if exists "missions_public_read" on public.missions;
create policy "missions_public_read" on public.missions for select using (active = true);
drop policy if exists "wash_day_flows_public_read" on public.wash_day_flows;
create policy "wash_day_flows_public_read" on public.wash_day_flows for select using (active = true);

------------------------------------------------------------
-- 4) SEED DATA — missions
------------------------------------------------------------
insert into public.missions (code, title, description, xp_reward, category) values
  ('hydrate_pointes',     'Hydrater les pointes',         'Applique un leave-in ou une huile sur les pointes', 10, 'hydration'),
  ('massage_cuir_chevelu','Massage du cuir chevelu',      'Massage 3-5 min pour stimuler la circulation',       15, 'scalp'),
  ('bonnet_satin',        'Bonnet satin pour la nuit',    'Dors avec ton bonnet ou taie d''oreiller satin',    10, 'protection'),
  ('boire_eau',           'Hydratation interne',          '1.5L d''eau aujourd''hui',                            5, 'hydration'),
  ('demeler_doigts',      'Démêler aux doigts',           'Démêle doucement section par section',               10, 'protection'),
  ('huile_pre_poo',       'Pré-poo à l''huile',           'Bain d''huile avant ton wash day',                  20, 'hydration'),
  ('rincage_froid',       'Rinçage à l''eau froide',      'Scelle l''hydratation avec un rinçage froid',       10, 'hydration'),
  ('eviter_chaleur',      'Pas de chaleur aujourd''hui',  'Aucun outil chauffant',                              10, 'protection')
on conflict (code) do nothing;

------------------------------------------------------------
-- 5) SEED DATA — wash day flows
------------------------------------------------------------
insert into public.wash_day_flows (code, title, description, total_duration_min, cadence, steps) values
  ('jour_de_lavage',
   'Jour de lavage',
   'Routine de lavage complète : pré-poo, shampoing, après-shampoing, hydratation, coiffure',
   60,
   'every_2_weeks',
   '[
     {"order":1,"title":"Pré-poo","duration_min":30,"instructions":"Sur cheveux démêlés et hydratés, appliquez votre pré-poo et laissez agir au moins 30 minutes.","suggestion":"Avant de laver, démêlez doucement avec les doigts ou un peigne à dents larges. Commencez par les pointes."},
     {"order":2,"title":"Lavage","duration_min":3,"instructions":"Lavez vos cheveux en sections, en insistant sur le cuir chevelu et les racines."},
     {"order":3,"title":"Après-shampoing","duration_min":10,"instructions":"Rincez puis appliquez l''après-shampoing sur les longueurs et pointes.","suggestion":"Si besoin, utilisez plutôt un soin profond."},
     {"order":4,"title":"LOC ou LCO","duration_min":10,"instructions":"Rincez puis coiffez avec la méthode LOC ou LCO.","reminder":"Rincez puis coiffez avec LOC ou LCO"},
     {"order":5,"title":"Séchage étiré","duration_min":5,"instructions":"Mettez chaque section en vanilles/tresses pour sécher étiré.","reminder":"Mettez chaque section en vanilles/tresses pour sécher étiré"}
   ]'::jsonb),
  ('bain_huile',
   'Rituel bain d''huile',
   'Pré-poo profond à l''huile chaude pour nourrir les longueurs',
   45,
   'monthly',
   '[
     {"order":1,"title":"Préparer l''huile","duration_min":5,"instructions":"Faites tiédir un mélange d''huile de coco, ricin et amande douce."},
     {"order":2,"title":"Application section par section","duration_min":10,"instructions":"Appliquez généreusement sur cheveux secs, des racines aux pointes."},
     {"order":3,"title":"Laisser poser","duration_min":30,"instructions":"Couvrez d''un bonnet chauffant ou serviette chaude.","suggestion":"Profitez-en pour boire un thé."}
   ]'::jsonb),
  ('masque_ayurvedique',
   'Masque ayurvédique',
   'Mélange de poudres indiennes : Bringaraj, Brahmi, Fenugrec, Hibiscus, Guimauve',
   60,
   'monthly',
   '[
     {"order":1,"title":"Mélange","duration_min":5,"instructions":"Mélangez 3 à 4 cuillères à soupe de poudre avec un liquide chaud (eau, lait végétal, hydrolat)."},
     {"order":2,"title":"Application","duration_min":10,"instructions":"Appliquez sur cheveux propres et humides, du cuir chevelu aux pointes."},
     {"order":3,"title":"Pose sous chaleur","duration_min":40,"instructions":"Couvrez d''un bonnet chauffant. Laissez poser 30 à 60 min.","reminder":"Rincez abondamment à la fin"},
     {"order":4,"title":"Rinçage","duration_min":5,"instructions":"Rincez très abondamment puis appliquez après-shampoing si besoin."}
   ]'::jsonb),
  ('hydrater',
   'Hydrater',
   'Routine express d''hydratation entre les wash days',
   10,
   'as_needed',
   '[
     {"order":1,"title":"Vaporiser","duration_min":2,"instructions":"Vaporisez un mélange eau + jus d''aloe vera sur les longueurs."},
     {"order":2,"title":"Leave-in","duration_min":3,"instructions":"Appliquez un leave-in crème en sections."},
     {"order":3,"title":"Sceller","duration_min":3,"instructions":"Scellez avec une huile légère sur les longueurs et pointes."},
     {"order":4,"title":"Recoiffer","duration_min":2,"instructions":"Recoiffez en vanilles ou bantu knots pour la nuit."}
   ]'::jsonb),
  ('remise_en_forme_cuir_chevelu',
   'Remise en forme du cuir chevelu',
   'Massage rapide pour relancer la circulation',
   5,
   'as_needed',
   '[
     {"order":1,"title":"Huile pour le cuir chevelu","duration_min":1,"instructions":"Quelques gouttes d''huile (jojoba, ricin) directement sur le cuir chevelu."},
     {"order":2,"title":"Massage","duration_min":3,"instructions":"Massez en cercles avec le bout des doigts, sans frotter avec les ongles."},
     {"order":3,"title":"Étirements","duration_min":1,"instructions":"Pincez et soulevez doucement le cuir chevelu pour relâcher les tensions."}
   ]'::jsonb),
  ('dormir_satin',
   'Dormir en satin',
   'Routine du soir pour préserver tes longueurs',
   5,
   'as_needed',
   '[
     {"order":1,"title":"Recoiffer","duration_min":2,"instructions":"Recoiffe en grosses vanilles, ananas, ou bantu knots selon la longueur."},
     {"order":2,"title":"Bonnet satin","duration_min":1,"instructions":"Couvre tes cheveux d''un bonnet ou foulard satin/soie."},
     {"order":3,"title":"Taie d''oreiller","duration_min":2,"instructions":"Vérifie que ta taie d''oreiller est en satin/soie en backup."}
   ]'::jsonb)
on conflict (code) do nothing;

------------------------------------------------------------
-- 6) STORAGE BUCKETS
------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('hair-photos', 'hair-photos', false, 10485760, array['image/jpeg','image/png','image/webp','image/heic']),
  ('avatars',     'avatars',     false, 2097152,  array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "hair_photos_owner_read" on storage.objects;
create policy "hair_photos_owner_read" on storage.objects for select
  using (bucket_id = 'hair-photos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "hair_photos_owner_write" on storage.objects;
create policy "hair_photos_owner_write" on storage.objects for insert
  with check (bucket_id = 'hair-photos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "hair_photos_owner_delete" on storage.objects;
create policy "hair_photos_owner_delete" on storage.objects for delete
  using (bucket_id = 'hair-photos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "avatars_owner_read" on storage.objects;
create policy "avatars_owner_read" on storage.objects for select
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "avatars_owner_write" on storage.objects;
create policy "avatars_owner_write" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
