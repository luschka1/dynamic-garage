-- ── Partner codes ────────────────────────────────────────────────────────────
create table if not exists partner_codes (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,           -- e.g. MOTORTREND2025
  partner_name  text not null,
  logo_url      text,
  headline      text not null default 'Get Lifetime Access — Free',
  subheadline   text not null default 'Sign up through this exclusive offer and never pay for Dynamic Garage.',
  payout_rate   numeric(10,2) not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ── Partner signups ───────────────────────────────────────────────────────────
create table if not exists partner_signups (
  id              uuid primary key default gen_random_uuid(),
  partner_code_id uuid not null references partner_codes(id) on delete cascade,
  user_id         uuid not null,
  signed_up_at    timestamptz not null default now(),
  qualified_at    timestamptz,                  -- set when all 3 rules met
  payout_status   text not null default 'pending'
                  check (payout_status in ('pending','qualified','paid','expired','suspended')),
  paid_at         timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists partner_signups_partner_idx on partner_signups(partner_code_id);
create index if not exists partner_signups_user_idx    on partner_signups(user_id);
create unique index if not exists partner_signups_user_unique on partner_signups(user_id);

-- ── Lifetime + partner columns on corvettes ───────────────────────────────────
alter table corvettes
  add column if not exists is_lifetime          boolean not null default false,
  add column if not exists partner_code_id      uuid references partner_codes(id) on delete set null,
  add column if not exists last_active_at       timestamptz;

-- ── RLS ───────────────────────────────────────────────────────────────────────
alter table partner_codes   enable row level security;
alter table partner_signups enable row level security;

-- Public can read active partner codes (needed for /join/[code] page)
create policy "public read active partner codes"
  on partner_codes for select
  using (active = true);

-- Users can read their own signup record
create policy "users read own signup"
  on partner_signups for select
  using (auth.uid() = user_id);
