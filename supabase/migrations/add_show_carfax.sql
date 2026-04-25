alter table corvettes
  add column if not exists show_carfax boolean not null default false;
