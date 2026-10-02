-- Only the checkout service can read/write purchase references or set access.
create table public.wedding_studio_checkouts (
  board_owner uuid primary key references public.wedding_studio_boards(user_id),
  purchase_ref uuid not null unique default gen_random_uuid(),
  order_id text unique,
  payment_link_id text,
  checkout_url text,
  price_cents integer not null check (price_cents in (2900,4900)),
  environment text not null check (environment in ('production','sandbox')),
  request_payload jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.wedding_studio_checkouts enable row level security;
revoke all on public.wedding_studio_checkouts from public, anon, authenticated;
grant all on public.wedding_studio_checkouts to service_role;
