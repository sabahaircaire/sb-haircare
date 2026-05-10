-- SB Haircare — V1 schema
-- Run this in Supabase SQL editor (or via supabase CLI: supabase db push)

------------------------------------------------------------
-- Profiles : 1:1 with auth.users
------------------------------------------------------------
create type hair_type as enum (
  '3a','3b','3c','4a','4b','4c'
);

create type porosity as enum (
  'low','medium','high'
);

create type length_label as enum (
  'oreille','cou','epaules','poitrine','hanches','taille','coccyx'
);

create table public.profiles (
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

------------------------------------------------------------
-- Hair diary : check-ins quotidiens
------------------------------------------------------------
create table public.hair_diary_entries (
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

create index hair_diary_user_date_idx on public.hair_diary_entries (user_id, entry_date desc);

------------------------------------------------------------
-- Missions / gamification
------------------------------------------------------------
create table public.missions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                 -- 'hydrate_pointes', 'massage_cuir_chevelu'
  title text not null,
  description text,
  xp_reward int not null default 10,
  category text,                              -- 'hydration', 'scalp', 'protection', 'styling'
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.user_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  completed_date date not null default current_date,
  xp_earned int not null,
  created_at timestamptz not null default now(),
  unique(user_id, mission_id, completed_date)
);

create index user_missions_user_date_idx on public.user_missions (user_id, completed_date desc);

------------------------------------------------------------
-- Streaks / XP
------------------------------------------------------------
create table public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_xp int not null default 0,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  level_code text not null default 'curl_novice',
  last_active_date date,
  updated_at timestamptz not null default now()
);

------------------------------------------------------------
-- Wash day flows (templates et logs)
------------------------------------------------------------
create table public.wash_day_flows (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                  -- 'jour_de_lavage', 'bain_huile', 'masque_ayurvedique'
  title text not null,
  description text,
  total_duration_min int not null,
  cadence text,                                -- 'every_2_weeks', 'monthly', 'as_needed'
  steps jsonb not null,                        -- [{order, title, duration_min, instructions, suggestion?, reminder?}]
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.wash_day_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  flow_id uuid not null references public.wash_day_flows(id) on delete restrict,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  steps_completed jsonb,                       -- [{step_order, completed: bool, skipped: bool}]
  feedback text check (feedback in ('amazing','good','could_be_better')),
  before_photo_url text,
  after_photo_url text,
  notes text,
  created_at timestamptz not null default now()
);

create index wash_day_logs_user_idx on public.wash_day_logs (user_id, started_at desc);

------------------------------------------------------------
-- Protective styles tracker
------------------------------------------------------------
create table public.protective_style_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  style_code text not null,                    -- 'cornrows', 'box_braids', etc
  style_name text not null,
  installed_on date not null,
  recommended_remove_on date not null,
  removed_on date,
  reminder_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create index protective_style_user_idx on public.protective_style_logs (user_id, installed_on desc);

------------------------------------------------------------
-- Length tracking (photos avant/apres)
------------------------------------------------------------
create table public.length_tracker_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  measured_on date not null default current_date,
  length_inches numeric(4,1),
  photo_url text,
  ai_analysis jsonb,                            -- { length_estimate, damage_score, shine_score, ... }
  notes text,
  created_at timestamptz not null default now()
);

create index length_tracker_user_idx on public.length_tracker_entries (user_id, measured_on desc);

------------------------------------------------------------
-- Updated_at trigger helper
------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_touch before update on public.profiles
  for each row execute procedure public.touch_updated_at();

create trigger user_stats_touch before update on public.user_stats
  for each row execute procedure public.touch_updated_at();

------------------------------------------------------------
-- Auto-create profile + stats on signup
------------------------------------------------------------
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.user_stats (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
