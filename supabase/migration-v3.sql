-- V3 Expansion Migration
-- Run against Supabase SQL editor

-- 1. Add diamond_type to listings
ALTER TABLE listings ADD COLUMN diamond_type TEXT NOT NULL DEFAULT 'natural'
  CHECK (diamond_type IN ('natural', 'lab-grown'));

-- 2. Add extended attributes (nullable)
ALTER TABLE listings ADD COLUMN symmetry TEXT
  CHECK (symmetry IS NULL OR symmetry IN ('Excellent', 'Very Good', 'Good', 'Fair'));

ALTER TABLE listings ADD COLUMN polish TEXT
  CHECK (polish IS NULL OR polish IN ('Excellent', 'Very Good', 'Good', 'Fair'));

ALTER TABLE listings ADD COLUMN fluorescence TEXT
  CHECK (fluorescence IS NULL OR fluorescence IN ('None', 'Faint', 'Medium', 'Strong', 'Very Strong'));

-- 3. Expand certification_body to include new labs
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_certification_body_check;
ALTER TABLE listings ADD CONSTRAINT listings_certification_body_check
  CHECK (certification_body IN ('GIA', 'IGI', 'HRD', 'AGS', 'EGL', 'GCAL'));

-- 4. Create exchange_rates table
CREATE TABLE exchange_rates (
  currency_pair TEXT PRIMARY KEY,
  rate NUMERIC(10,6) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read exchange rates" ON exchange_rates FOR SELECT USING (true);
CREATE POLICY "Service write exchange rates" ON exchange_rates FOR ALL USING (true);

-- Seed with fallback rate
INSERT INTO exchange_rates (currency_pair, rate) VALUES ('USD_GBP', 0.79);

-- 5. Update index to include diamond_type
DROP INDEX IF EXISTS idx_listings_specs;
CREATE INDEX idx_listings_specs ON listings (shape, diamond_type, color, clarity);

-- 6. Future-proofing comments
COMMENT ON TABLE listings IS 'Loose diamond listings only. Mounts/settings will be a separate table in next phase.';
