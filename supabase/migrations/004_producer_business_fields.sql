-- Migration 004: Add Turkish business identity fields to producer_profiles

ALTER TABLE producer_profiles ADD COLUMN IF NOT EXISTS business_type TEXT CHECK (business_type IN ('sahis', 'tuzel'));
ALTER TABLE producer_profiles ADD COLUMN IF NOT EXISTS tckn TEXT;
ALTER TABLE producer_profiles ADD COLUMN IF NOT EXISTS vkn TEXT;
ALTER TABLE producer_profiles ADD COLUMN IF NOT EXISTS vergi_dairesi TEXT;
ALTER TABLE producer_profiles ADD COLUMN IF NOT EXISTS ticaret_unvani TEXT;
