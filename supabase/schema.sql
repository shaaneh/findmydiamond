-- findmydiamond schema (V3)
-- Run this in the Supabase SQL editor to create the required tables
-- For existing databases, use migration-v3.sql instead

-- Loose diamond listings only. Mounts/settings will be a separate table in next phase.
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carat NUMERIC(4,2) NOT NULL,
  cut TEXT NOT NULL CHECK (cut IN ('Excellent', 'Very Good', 'Good', 'Fair')),
  color TEXT NOT NULL CHECK (color IN ('D', 'E', 'F', 'G', 'H', 'I', 'J')),
  clarity TEXT NOT NULL CHECK (clarity IN ('IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2')),
  price_gbp INTEGER NOT NULL,
  retailer_name TEXT NOT NULL,
  certification_body TEXT NOT NULL CHECK (certification_body IN ('GIA', 'IGI', 'HRD', 'AGS', 'EGL', 'GCAL')),
  retailer_url TEXT,
  shape TEXT NOT NULL DEFAULT 'Round',
  diamond_type TEXT NOT NULL DEFAULT 'natural' CHECK (diamond_type IN ('natural', 'lab-grown')),
  symmetry TEXT CHECK (symmetry IS NULL OR symmetry IN ('Excellent', 'Very Good', 'Good', 'Fair')),
  polish TEXT CHECK (polish IS NULL OR polish IN ('Excellent', 'Very Good', 'Good', 'Fair')),
  fluorescence TEXT CHECK (fluorescence IS NULL OR fluorescence IN ('None', 'Faint', 'Medium', 'Strong', 'Very Strong')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE listings IS 'Loose diamond listings only. Mounts/settings will be a separate table in next phase.';

CREATE TABLE IF NOT EXISTS email_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  shape TEXT NOT NULL DEFAULT 'Round',
  carat NUMERIC(4,2) NOT NULL,
  cut TEXT NOT NULL,
  color TEXT NOT NULL,
  clarity TEXT NOT NULL,
  target_price_gbp INTEGER,
  gdpr_consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exchange_rates (
  currency_pair TEXT PRIMARY KEY,
  rate NUMERIC(10,6) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Listings RLS policies
CREATE POLICY "Listings are publicly readable"
  ON listings FOR SELECT
  USING (true);

CREATE POLICY "Listings can be inserted via API"
  ON listings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Listings can be updated via API"
  ON listings FOR UPDATE
  USING (true);

CREATE POLICY "Listings can be deleted via API"
  ON listings FOR DELETE
  USING (true);

-- Email signups can be inserted by anyone (anon key)
CREATE POLICY "Anyone can subscribe"
  ON email_signups FOR INSERT
  WITH CHECK (true);

-- Exchange rates RLS policies
CREATE POLICY "Public read exchange rates"
  ON exchange_rates FOR SELECT
  USING (true);

CREATE POLICY "Service write exchange rates"
  ON exchange_rates FOR ALL
  USING (true);

-- Seed exchange rates with fallback rate
INSERT INTO exchange_rates (currency_pair, rate) VALUES ('USD_GBP', 0.79)
  ON CONFLICT (currency_pair) DO NOTHING;

-- Index for the fair-price query (includes diamond_type for V3 filtering)
CREATE INDEX IF NOT EXISTS idx_listings_specs
  ON listings (shape, diamond_type, color, clarity);

-- Unique constraint on retailer_url for upsert deduplication
CREATE UNIQUE INDEX IF NOT EXISTS idx_listings_retailer_url
  ON listings (retailer_url) WHERE retailer_url IS NOT NULL;
