-- Feature Requests table
-- Run this in your Supabase SQL editor

create table if not exists public.feature_requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  user_email  text,
  title       text not null,
  description text not null,
  category    text,
  priority    int check (priority between 1 and 5),
  status      text not null default 'open',  -- open | planned | done | declined
  created_at  timestamptz not null default now()
);

-- Only the submitting user can read their own requests;
-- owner (service role) can read all via dashboard
alter table public.feature_requests enable row level security;

create policy "Users can insert their own requests"
  on public.feature_requests for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own requests"
  on public.feature_requests for select
  using (auth.uid() = user_id);
