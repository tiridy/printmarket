-- Migration 006: Add freelancer business type and kimlik_url column

ALTER TABLE producer_profiles DROP CONSTRAINT IF EXISTS producer_profiles_business_type_check;
ALTER TABLE producer_profiles ADD CONSTRAINT producer_profiles_business_type_check
  CHECK (business_type IN ('sahis', 'tuzel', 'freelancer'));

ALTER TABLE producer_profiles ADD COLUMN IF NOT EXISTS kimlik_url TEXT;
