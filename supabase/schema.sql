-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- CORVETTES
-- ─────────────────────────────────────────
create table if not exists public.corvettes (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  nickname    text not null,
  year        int not null,
  model       text not null,       -- e.g. "C8 Stingray", "Z06", "ZR1"
  trim        text,
  color       text,
  vin         text,
  mileage     int,
  photo_url   text,
  is_public    boolean default false,
  in_gallery   boolean not null default false,
  for_sale     boolean not null default false,
  show_vin_decoder boolean not null default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.corvettes enable row level security;

create policy "Users can manage own corvettes"
  on public.corvettes for all
  using (auth.uid() = user_id);

create policy "Public corvettes are viewable by anyone"
  on public.corvettes for select
  using (is_public = true);

-- ─────────────────────────────────────────
-- MODS
-- ─────────────────────────────────────────
create table if not exists public.mods (
  id           uuid primary key default uuid_generate_v4(),
  corvette_id  uuid references public.corvettes(id) on delete cascade not null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  name         text not null,
  category     text,               -- e.g. "Performance", "Appearance", "Audio"
  vendor       text,
  cost         numeric(10,2),
  install_date date,
  notes        text,
  purchase_url text,
  created_at   timestamptz default now()
);

alter table public.mods enable row level security;

create policy "Users can manage own mods"
  on public.mods for all
  using (auth.uid() = user_id);

create policy "Mods visible if corvette is public"
  on public.mods for select
  using (
    exists (
      select 1 from public.corvettes
      where corvettes.id = mods.corvette_id
        and corvettes.is_public = true
    )
  );

-- ─────────────────────────────────────────
-- SERVICE RECORDS
-- ─────────────────────────────────────────
create table if not exists public.service_records (
  id           uuid primary key default uuid_generate_v4(),
  corvette_id  uuid references public.corvettes(id) on delete cascade not null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  title        text not null,
  category     text,               -- e.g. "Oil Change", "Tires", "Repair", "Inspection"
  shop         text,
  mileage      int,
  cost         numeric(10,2),
  service_date date,
  notes        text,
  created_at   timestamptz default now()
);

alter table public.service_records enable row level security;

create policy "Users can manage own service records"
  on public.service_records for all
  using (auth.uid() = user_id);

create policy "Service visible if corvette is public"
  on public.service_records for select
  using (
    exists (
      select 1 from public.corvettes
      where corvettes.id = service_records.corvette_id
        and corvettes.is_public = true
    )
  );

-- ─────────────────────────────────────────
-- DOCUMENTS (receipts, photos, manuals)
-- ─────────────────────────────────────────
create table if not exists public.documents (
  id           uuid primary key default uuid_generate_v4(),
  corvette_id  uuid references public.corvettes(id) on delete cascade not null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  -- optionally linked to a mod or service record
  mod_id       uuid references public.mods(id) on delete set null,
  service_id   uuid references public.service_records(id) on delete set null,
  name         text not null,
  file_url     text not null,
  file_type    text,               -- "image", "pdf", "other"
  file_size    int,
  created_at   timestamptz default now()
);

alter table public.documents enable row level security;

create policy "Users can manage own documents"
  on public.documents for all
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- ANON READ GRANTS (for public gallery / share pages)
-- ─────────────────────────────────────────
grant select on public.corvettes        to anon;
grant select on public.mods             to anon;
grant select on public.service_records  to anon;

-- ─────────────────────────────────────────
-- STORAGE BUCKET SETUP (run in Supabase dashboard or via CLI)
-- ─────────────────────────────────────────
-- insert into storage.buckets (id, name, public) values ('corvette-files', 'corvette-files', false);
-- insert into storage.buckets (id, name, public) values ('corvette-photos', 'corvette-photos', true);
