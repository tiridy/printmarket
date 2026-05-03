-- Migration 002: Fix users table RLS and make role nullable for upsert flow
-- Run this in Supabase Dashboard → SQL Editor if not using CLI

-- 1. Make role nullable so a user row can be created before role is chosen
ALTER TABLE users ALTER COLUMN role DROP NOT NULL;

-- 2. Recreate RLS policies cleanly (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

-- Users can read their own row
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can create their own row (id must equal auth.uid())
CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own row
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
