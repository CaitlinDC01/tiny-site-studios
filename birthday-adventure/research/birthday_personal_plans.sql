-- Applied to the existing Supabase project October 4, 2026.
create table if not exists public.birthday_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan jsonb not null check (jsonb_typeof(plan) = 'object' and octet_length(plan::text) <= 200000),
  updated_at timestamptz not null default now()
);
alter table public.birthday_plans enable row level security;
revoke all on public.birthday_plans from anon;
grant select, insert, update, delete on public.birthday_plans to authenticated;
create policy birthday_plans_select on public.birthday_plans for select to authenticated using ((select auth.uid()) = user_id);
create policy birthday_plans_insert on public.birthday_plans for insert to authenticated with check ((select auth.uid()) = user_id);
create policy birthday_plans_update on public.birthday_plans for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy birthday_plans_delete on public.birthday_plans for delete to authenticated using ((select auth.uid()) = user_id);
