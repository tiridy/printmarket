-- Migration 007: Add IBAN field for freelancer producers
ALTER TABLE producer_profiles ADD COLUMN IF NOT EXISTS iban TEXT;
