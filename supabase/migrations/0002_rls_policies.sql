-- SB Haircare — Row Level Security policies
-- Each user can only read/write their own data.

------------------------------------------------------------
-- Enable RLS
------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.hair_diary_entries enable row level security;
alter table public.user_missions enable row level security;
alter table public.user_stats enable row level security;
alter table public.wash_day_logs enable row level security;
alter table public.protective_style_logs enable row level security;
alter table public.length_tracker_entries enable row level security;

-- Public read for templates
alter table public.missions enable row level security;
alter table public.wash_day_flows enable row level security;

------------------------------------------------------------
-- Profiles
------------------------------------------------------------
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

------------------------------------------------------------
-- Hair diary
------------------------------------------------------------
create policy "diary_select_own" on public.hair_diary_entries
  for select using (auth.uid() = user_id);

create policy "diary_insert_own" on public.hair_diary_entries
  for insert with check (auth.uid() = user_id);

create policy "diary_update_own" on public.hair_diary_entries
  for update using (auth.uid() = user_id);

create policy "diary_delete_own" on public.hair_diary_entries
  for delete using (auth.uid() = user_id);

------------------------------------------------------------
-- User missions
------------------------------------------------------------
create policy "user_missions_select_own" on public.user_missions
  for select using (auth.uid() = user_id);

create policy "user_missions_insert_own" on public.user_missions
  for insert with check (auth.uid() = user_id);

------------------------------------------------------------
-- User stats
------------------------------------------------------------
create policy "user_stats_select_own" on public.user_stats
  for select using (auth.uid() = user_id);

create policy "user_stats_update_own" on public.user_stats
  for update using (auth.uid() = user_id);

------------------------------------------------------------
-- Wash day logs
------------------------------------------------------------
create policy "wash_day_logs_select_own" on public.wash_day_logs
  for select using (auth.uid() = user_id);

create policy "wash_day_logs_insert_own" on public.wash_day_logs
  for insert with check (auth.uid() = user_id);

create policy "wash_day_logs_update_own" on public.wash_day_logs
  for update using (auth.uid() = user_id);

------------------------------------------------------------
-- Protective style logs
------------------------------------------------------------
create policy "protective_style_select_own" on public.protective_style_logs
  for select using (auth.uid() = user_id);

create policy "protective_style_insert_own" on public.protective_style_logs
  for insert with check (auth.uid() = user_id);

create policy "protective_style_update_own" on public.protective_style_logs
  for update using (auth.uid() = user_id);

create policy "protective_style_delete_own" on public.protective_style_logs
  for delete using (auth.uid() = user_id);

------------------------------------------------------------
-- Length tracker
------------------------------------------------------------
create policy "length_select_own" on public.length_tracker_entries
  for select using (auth.uid() = user_id);

create policy "length_insert_own" on public.length_tracker_entries
  for insert with check (auth.uid() = user_id);

create policy "length_update_own" on public.length_tracker_entries
  for update using (auth.uid() = user_id);

create policy "length_delete_own" on public.length_tracker_entries
  for delete using (auth.uid() = user_id);

------------------------------------------------------------
-- Public templates (read-only for all authenticated users)
------------------------------------------------------------
create policy "missions_public_read" on public.missions
  for select using (active = true);

create policy "wash_day_flows_public_read" on public.wash_day_flows
  for select using (active = true);
