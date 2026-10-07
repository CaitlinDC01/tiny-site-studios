-- Applied to the existing Supabase project October 4, 2026.
alter table public.birthday_offers
  add column if not exists enroll_url text not null default ''
  check (enroll_url = '' or enroll_url ~ '^https?://');
alter table public.birthday_submissions
  add column if not exists enroll_url text not null default ''
  check (enroll_url = '' or enroll_url ~ '^https?://');
