
create table public.wedding_studio_boards (
 user_id uuid primary key references auth.users(id) on delete cascade,
 title text not null default 'Our wedding',
 wedding_date text not null default '',
 updated_at timestamptz not null default now()
);
create table public.wedding_studio_items (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(length(title) between 1 and 200),
 kind text not null check(kind in ('note','link','image','file','palette')),
 category text not null default 'Sort later',
 status text not null default 'Idea' check(status in ('Idea','Shortlist','Chosen','Purchased / booked')),
 notes text not null default '' check(length(notes)<=10000),
 url text not null default '' check(length(url)<=3000),
 file_path text,
 file_name text,
 file_type text,
 colors jsonb not null default '[]'::jsonb,
 x integer not null default 40 check(x between 0 and 10000),
 y integer not null default 40 check(y between 0 and 10000),
 created_at timestamptz not null default now()
);
create index wedding_studio_items_user on public.wedding_studio_items(user_id);
create table public.wedding_studio_briefs (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 token uuid not null unique default gen_random_uuid(),
 title text not null check(length(title) between 1 and 200),
 payload jsonb not null,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default now() + interval '30 days'
);
create index wedding_studio_briefs_user on public.wedding_studio_briefs(user_id);
alter table public.wedding_studio_boards enable row level security;
alter table public.wedding_studio_items enable row level security;
alter table public.wedding_studio_briefs enable row level security;
create policy ws_boards_owner on public.wedding_studio_boards for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy ws_items_owner on public.wedding_studio_items for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy ws_briefs_owner on public.wedding_studio_briefs for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
grant select,insert,update,delete on public.wedding_studio_boards, public.wedding_studio_items, public.wedding_studio_briefs to authenticated;
revoke all on public.wedding_studio_boards, public.wedding_studio_items, public.wedding_studio_briefs from anon;
insert into storage.buckets (id,name,public,file_size_limit) values ('wedding-studio','wedding-studio',false,15728640);
create policy ws_files_insert on storage.objects for insert to authenticated with check(bucket_id='wedding-studio' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy ws_files_read on storage.objects for select to authenticated using(bucket_id='wedding-studio' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy ws_files_delete on storage.objects for delete to authenticated using(bucket_id='wedding-studio' and (storage.foldername(name))[1]=(select auth.uid())::text);

