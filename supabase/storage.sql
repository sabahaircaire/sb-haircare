-- SB Haircare — Storage buckets
-- Run after creating the project. Buckets are private, accessed via signed URLs from edge functions.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('hair-photos', 'hair-photos', false, 10485760, array['image/jpeg','image/png','image/webp','image/heic']),
  ('avatars',     'avatars',     false, 2097152,  array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- Each user can only access their own folder: <user_id>/...
create policy "hair_photos_owner_read" on storage.objects
  for select using (
    bucket_id = 'hair-photos' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "hair_photos_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'hair-photos' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "hair_photos_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'hair-photos' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_owner_read" on storage.objects
  for select using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );
