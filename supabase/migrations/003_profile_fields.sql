-- Migration 003: Add profile fields and fix grants

-- 1. Add full_name and phone to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Grant table-level permissions to authenticated role
GRANT SELECT, INSERT, UPDATE ON TABLE users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE producer_profiles TO authenticated;
