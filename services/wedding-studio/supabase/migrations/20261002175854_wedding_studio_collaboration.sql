-- Preserve owner IDs and existing inspiration while adding scoped collaboration.
create schema if not exists wedding_studio_private;
revoke all on schema wedding_studio_private from public, anon;
grant usage on schema wedding_studio_private to authenticated;
alter table public.wedding_studio_boards add column created_at timestamptz not null default now(), add column planning_start text not null default '', add column custom_tags jsonb not null default '[]', add column paid_at timestamptz, add column purchase_id text unique, add column paid_until timestamptz;
alter table public.wedding_studio_items add column tags jsonb not null default '["Sort later"]', add column tasks jsonb not null default '[]', add column task_view text not null default 'checklist' check(task_view in ('checklist','kanban')), add column template_meta jsonb not null default '{}', add column seating jsonb not null default '{}';
update public.wedding_studio_items set tags=jsonb_build_array(category);
alter table public.wedding_studio_items drop constraint wedding_studio_items_kind_check;
alter table public.wedding_studio_items add constraint wedding_studio_items_kind_check check(kind in ('note','link','image','file','palette','checklist','group','seating'));
alter table public.wedding_studio_items add constraint ws_tags_array check(jsonb_typeof(tags)='array' and jsonb_array_length(tags) between 1 and 20), add constraint ws_tasks_array check(jsonb_typeof(tasks)='array' and jsonb_array_length(tasks)<=200), add constraint ws_seating_size check(octet_length(seating::text)<=200000);
create index ws_items_tags on public.wedding_studio_items using gin(tags);
create table public.wedding_studio_members (board_owner uuid not null references public.wedding_studio_boards(user_id) on delete cascade, member_id uuid not null references auth.users(id) on delete cascade, email text not null, role text not null check(role in ('view','comment','contribute','partner')), tags jsonb, primary key(board_owner,member_id), check(tags is null or (jsonb_typeof(tags)='array' and jsonb_array_length(tags) between 1 and 20)));
create index ws_members_user on public.wedding_studio_members(member_id);
create table public.wedding_studio_invites (id uuid primary key default gen_random_uuid(), board_owner uuid not null references public.wedding_studio_boards(user_id) on delete cascade, email text not null check(length(email)<=254), role text not null check(role in ('view','comment','contribute','partner')), tags jsonb, token uuid not null unique default gen_random_uuid(), expires_at timestamptz not null default now()+interval '14 days', accepted_at timestamptz, check((role='partner' and tags is null) or (role<>'partner' and jsonb_typeof(tags)='array' and jsonb_array_length(tags) between 1 and 20)));
create index ws_invites_owner on public.wedding_studio_invites(board_owner);
create table public.wedding_studio_comments (id uuid primary key default gen_random_uuid(), item_id uuid not null references public.wedding_studio_items(id) on delete cascade, author_id uuid not null references auth.users(id) on delete cascade, author_name text not null check(length(author_name)<=100), body text not null check(length(body) between 1 and 3000), created_at timestamptz not null default now());
create index ws_comments_item on public.wedding_studio_comments(item_id);
create table public.wedding_studio_offer (id boolean primary key default true check(id), price_cents integer not null default 2900 check(price_cents in (2900,4900)), introductory boolean not null default true, payments_live boolean not null default false);
insert into public.wedding_studio_offer default values;
alter table public.wedding_studio_members enable row level security; alter table public.wedding_studio_invites enable row level security; alter table public.wedding_studio_comments enable row level security; alter table public.wedding_studio_offer enable row level security;
create function wedding_studio_private.access_board(owner_id uuid) returns boolean language sql stable security definer set search_path='' as $$select auth.uid() is not null and (auth.uid()=owner_id or exists(select 1 from public.wedding_studio_members m where m.board_owner=owner_id and m.member_id=auth.uid()))$$;
create function wedding_studio_private.editing_open(owner_id uuid) returns boolean language sql stable security definer set search_path='' as $$select auth.uid() is not null and exists(select 1 from public.wedding_studio_boards b where b.user_id=owner_id and (not (select payments_live from public.wedding_studio_offer where id) or b.created_at+interval '14 days'>now() or b.paid_until>now()))$$;
create function wedding_studio_private.access_item(owner_id uuid,item_tags jsonb,operation text default 'view') returns boolean language sql stable security definer set search_path='' as $$select auth.uid() is not null and (operation='view' or wedding_studio_private.editing_open(owner_id)) and (auth.uid()=owner_id or exists(select 1 from public.wedding_studio_members m where m.board_owner=owner_id and m.member_id=auth.uid() and (m.role='partner' or exists(select 1 from jsonb_array_elements_text(item_tags) t where m.tags ? t)) and (operation='view' or operation='comment' and m.role in ('comment','contribute','partner') or operation='edit' and m.role in ('contribute','partner'))))$$;
revoke all on all functions in schema wedding_studio_private from public,anon; grant execute on all functions in schema wedding_studio_private to authenticated;
-- Split read and write policies; only owners can change collaboration permissions.
drop policy ws_boards_owner on public.wedding_studio_boards;
create policy ws_boards_read on public.wedding_studio_boards for select to authenticated using(wedding_studio_private.access_board(user_id));
create policy ws_boards_insert on public.wedding_studio_boards for insert to authenticated with check(user_id=(select auth.uid()));
create policy ws_boards_update on public.wedding_studio_boards for update to authenticated using(user_id=(select auth.uid()) and wedding_studio_private.editing_open(user_id)) with check(user_id=(select auth.uid()));
revoke insert,update on public.wedding_studio_boards from authenticated;
grant insert(user_id,title,wedding_date,planning_start,custom_tags,updated_at),update(title,wedding_date,planning_start,custom_tags,updated_at) on public.wedding_studio_boards to authenticated;
drop policy ws_items_owner on public.wedding_studio_items;
create policy ws_items_read on public.wedding_studio_items for select to authenticated using(wedding_studio_private.access_item(user_id,tags));
create policy ws_items_insert on public.wedding_studio_items for insert to authenticated with check(wedding_studio_private.access_item(user_id,tags,'edit'));
create policy ws_items_update on public.wedding_studio_items for update to authenticated using(wedding_studio_private.access_item(user_id,tags,'edit')) with check(wedding_studio_private.access_item(user_id,tags,'edit'));
create policy ws_items_delete on public.wedding_studio_items for delete to authenticated using(user_id=(select auth.uid()) and wedding_studio_private.editing_open(user_id));
create function wedding_studio_private.protect_item() returns trigger language plpgsql security invoker set search_path='' as $$begin
 if TG_OP='UPDATE' and new.user_id<>old.user_id then raise exception 'Board ownership cannot change';end if;
 if TG_OP='UPDATE' and auth.uid()<>old.user_id and (new.tags<>old.tags or new.status<>old.status) and not exists(select 1 from public.wedding_studio_members where board_owner=old.user_id and member_id=auth.uid() and role='partner') then raise exception 'Only the couple can change tags and decisions';end if;
 return new;end$$;
create trigger ws_protect_item before update on public.wedding_studio_items for each row execute function wedding_studio_private.protect_item();
create policy ws_members_read on public.wedding_studio_members for select to authenticated using(board_owner=(select auth.uid()) or member_id=(select auth.uid()));
create policy ws_members_delete on public.wedding_studio_members for delete to authenticated using(board_owner=(select auth.uid()));
create policy ws_invites_owner on public.wedding_studio_invites for all to authenticated using(board_owner=(select auth.uid())) with check(board_owner=(select auth.uid()) and wedding_studio_private.editing_open(board_owner));
create policy ws_comments_read on public.wedding_studio_comments for select to authenticated using(exists(select 1 from public.wedding_studio_items i where i.id=item_id));
create policy ws_comments_insert on public.wedding_studio_comments for insert to authenticated with check(author_id=(select auth.uid()) and exists(select 1 from public.wedding_studio_items i where i.id=item_id and wedding_studio_private.access_item(i.user_id,i.tags,'comment')));
create policy ws_comments_delete on public.wedding_studio_comments for delete to authenticated using(author_id=(select auth.uid()));
create policy ws_offer_read on public.wedding_studio_offer for select to authenticated,anon using(true);
grant select,delete on public.wedding_studio_members to authenticated;grant select,insert,update,delete on public.wedding_studio_invites to authenticated;grant select,insert,delete on public.wedding_studio_comments to authenticated;grant select on public.wedding_studio_offer to authenticated,anon;
revoke all on public.wedding_studio_members,public.wedding_studio_invites,public.wedding_studio_comments from anon;
create function wedding_studio_private.accept_invite(invite_token uuid) returns uuid language plpgsql security definer set search_path='' as $$declare invite public.wedding_studio_invites; verified_email text;begin
 if auth.uid() is null then raise exception 'Sign in to accept this invitation';end if;
 select email into verified_email from auth.users where id=auth.uid() and email_confirmed_at is not null;
 select * into invite from public.wedding_studio_invites where token=invite_token and expires_at>now() and accepted_at is null for update;
 if invite.id is null or lower(invite.email)<>lower(verified_email) or invite.board_owner=auth.uid() then raise exception 'Invitation unavailable. Sign in with the invited email address.';end if;
 insert into public.wedding_studio_members(board_owner,member_id,email,role,tags) values(invite.board_owner,auth.uid(),verified_email,invite.role,invite.tags) on conflict(board_owner,member_id) do update set role=excluded.role,tags=excluded.tags;
 update public.wedding_studio_invites set accepted_at=now() where id=invite.id;return invite.board_owner;end$$;
revoke all on function wedding_studio_private.accept_invite(uuid) from public,anon;grant execute on function wedding_studio_private.accept_invite(uuid) to authenticated;
create function public.ws_accept_invite(invite_token uuid) returns uuid language sql security invoker set search_path='' as $$select wedding_studio_private.accept_invite(invite_token)$$;
revoke all on function public.ws_accept_invite(uuid) from public,anon;grant execute on function public.ws_accept_invite(uuid) to authenticated;
-- Explicit membership + tag + board-path checks, independent of implicit item RLS.
create function wedding_studio_private.access_file(object_path text) returns boolean language sql stable security definer set search_path='' as $$select auth.uid() is not null and (split_part(object_path,'/',1)=auth.uid()::text or exists(select 1 from public.wedding_studio_items i where i.file_path=object_path and split_part(object_path,'/',1)=i.user_id::text and wedding_studio_private.access_board(i.user_id) and wedding_studio_private.access_item(i.user_id,i.tags,'view')))$$;
create function wedding_studio_private.upload_file(object_path text) returns boolean language plpgsql stable security definer set search_path='' as $$declare owner_id uuid;begin
 if auth.uid() is null or split_part(object_path,'/',2)<>auth.uid()::text then return false;end if;
 begin owner_id=split_part(object_path,'/',1)::uuid;exception when invalid_text_representation then return false;end;
 return wedding_studio_private.editing_open(owner_id) and (owner_id=auth.uid() or exists(select 1 from public.wedding_studio_members m where m.board_owner=owner_id and m.member_id=auth.uid() and m.role in ('contribute','partner')));end$$;
revoke all on function wedding_studio_private.access_file(text),wedding_studio_private.upload_file(text) from public,anon;grant execute on function wedding_studio_private.access_file(text),wedding_studio_private.upload_file(text) to authenticated;
drop policy ws_files_insert on storage.objects;
create policy ws_files_insert on storage.objects for insert to authenticated with check(bucket_id='wedding-studio' and wedding_studio_private.upload_file(name));
drop policy ws_files_read on storage.objects;
create policy ws_files_read on storage.objects for select to authenticated using(bucket_id='wedding-studio' and wedding_studio_private.access_file(name));
-- Enforce file types in storage, not just in the picker.
update storage.buckets set allowed_mime_types=array['image/jpeg','image/png','image/webp','image/gif','image/avif','application/pdf','text/plain','text/csv','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/rtf','text/rtf','application/vnd.oasis.opendocument.text'] where id='wedding-studio';
create function wedding_studio_private.refresh_paid_until() returns trigger language plpgsql security definer set search_path='' as $$begin
 if new.paid_at is not null then new.paid_until=greatest(new.paid_at+interval '12 months',case when new.wedding_date ~ '^\d{4}-\d{2}-\d{2}$' then new.wedding_date::date+interval '3 months' else new.paid_at+interval '12 months' end);end if;return new;end$$;
create trigger ws_paid_until before insert or update on public.wedding_studio_boards for each row execute function wedding_studio_private.refresh_paid_until();
revoke all on function wedding_studio_private.refresh_paid_until() from public,anon,authenticated;
-- Purchase state has no client write grants; only verified service fulfillment can set it.
grant all on public.wedding_studio_boards,public.wedding_studio_offer to service_role;
