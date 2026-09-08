-- Storage RLS policies for the `products` bucket (policies only — no ALTER TABLE).
-- Path structure used by the app: {auth.uid()}/file.ext and {auth.uid()}/files/file.ext
-- Run in Supabase SQL Editor. Idempotent.

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('products', 'products', true, 52428800)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

DROP POLICY IF EXISTS "Authenticated users can upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view products" ON storage.objects;
DROP POLICY IF EXISTS "Public can view products" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- INSERT: authenticated users can upload only inside their own folder
CREATE POLICY "Authenticated users can upload to their own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'products'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- SELECT: owners can read their own files
CREATE POLICY "Authenticated users can view products"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'products'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- SELECT: bucket is public, so anyone can read product files
CREATE POLICY "Public can view products"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'products');

-- UPDATE / DELETE: owners only
CREATE POLICY "Users can update their own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'products'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'products'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'products'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );