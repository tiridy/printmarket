-- Migration 005: Producer verification fields

ALTER TABLE producer_profiles
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS vergi_levhasi_url TEXT,
  ADD COLUMN IF NOT EXISTS verification_note TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Storage bucket for documents (run separately in Supabase Dashboard → Storage)
-- CREATE BUCKET: name = "documents", public = false

-- Storage RLS: allow authenticated users to upload to their own folder
-- INSERT policy on storage.objects:
--   (bucket_id = 'documents') AND (auth.uid()::text = (storage.foldername(name))[1])

GRANT SELECT, INSERT, UPDATE ON TABLE producer_profiles TO authenticated;
