-- findmydiamond schema
-- Run this in the Supabase SQL editor to create the required tables

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  carat numeric(4,2) not null,
  cut text not null check (cut in ('Excellent', 'Very Good', 'Good', 'Fair')),
  color text not null check (color in ('D', 'E', 'F', 'G', 'H', 'I', 'J')),
  clarity text not null check (clarity in ('IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2')),
  price_gbp integer not null,
  retailer_name text not null,
  certification_body text not null check (certification_body in ('GIA', 'IGI')),
  retailer_url text,
  shape text not null default 'Round',
  created_at timestamptz not null default now()
);

create table if not exists email_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  shape text not null default 'Round',
  carat numeric(4,2) not null,
  cut text not null,
  color text not null,
  clarity text not null,
  target_price_gbp integer,
  gdpr_consent boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table listings enable row level security;
alter table email_signups enable row level security;

-- Listings are publicly readable
create policy "Listings are publicly readable"
  on listings for select
  using (true);

-- Email signups can be inserted by anyone (anon key)
create policy "Anyone can subscribe"
  on email_signups for insert
  with check (true);

-- Index for the fair-price query
create index if not exists idx_listings_specs
  on listings (shape, color, clarity);

-- Unique constraint on retailer_url for upsert deduplication
create unique index if not exists idx_listings_retailer_url
  on listings (retailer_url) where retailer_url is not null;

-- Allow service-role or cron to insert/update listings
create policy "Listings can be inserted via API"
  on listings for insert
  with check (true);

create policy "Listings can be updated via API"
  on listings for update
  using (true);

create policy "Listings can be deleted via API"
  on listings for delete
  using (true);
