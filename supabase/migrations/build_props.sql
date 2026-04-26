-- ── Build Props (community voting) ───────────────────────────────────────────
create table if not exists build_props (
  id            uuid primary key default gen_random_uuid(),
  corvette_id   uuid not null references corvettes(id) on delete cascade,
  user_id       uuid not null,
  created_at    timestamptz not null default now(),
  -- one prop per user per build
  unique (corvette_id, user_id)
);

create index if not exists build_props_corvette_idx on build_props(corvette_id);
create index if not exists build_props_user_idx     on build_props(user_id);

-- ── RLS ───────────────────────────────────────────────────────────────────────
alter table build_props enable row level security;

-- Anyone can read prop counts
create policy "public read props"
  on build_props for select
  using (true);

-- Eligible members can insert (server enforces eligibility, RLS just requires auth)
create policy "auth insert props"
  on build_props for insert
  with check (auth.uid() = user_id);

-- Users can delete their own props
create policy "auth delete own props"
  on build_props for delete
  using (auth.uid() = user_id);

-- ── Props count denormalized on corvettes for fast sorting ────────────────────
alter table corvettes
  add column if not exists props_count integer not null default 0;

-- Keep props_count in sync via trigger
create or replace function sync_props_count()
returns trigger language plpgsql as $$
begin
  if (TG_OP = 'INSERT') then
    update corvettes set props_count = props_count + 1 where id = NEW.corvette_id;
  elsif (TG_OP = 'DELETE') then
    update corvettes set props_count = greatest(props_count - 1, 0) where id = OLD.corvette_id;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_sync_props_count on build_props;
create trigger trg_sync_props_count
  after insert or delete on build_props
  for each row execute function sync_props_count();

-- ── Weekly props notification tracking ───────────────────────────────────────
alter table corvettes
  add column if not exists props_notified_at timestamptz;
