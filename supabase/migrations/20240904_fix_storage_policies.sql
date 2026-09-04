-- Fix Storage RLS Policies for Products Bucket
-- This migration fixes the INSERT policy to allow authenticated users to upload files

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean migration)
DROP POLICY IF EXISTS "Authenticated users can upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view products" ON storage.objects;
DROP POLICY IF EXISTS "Public can view products" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- INSERT Policy: Allow authenticated users to upload to their own folder
-- Path structure: user_id/filename.ext or user_id/files/filename.ext
CREATE POLICY "Authenticated users can upload to their own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'products' AND
    -- Extract the first folder component and check it matches the user ID
    split_part(name, '/', 1) = auth.uid()::text
  );

-- SELECT Policy: Allow authenticated users to view files in their own folder
CREATE POLICY "Authenticated users can view products"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'products' AND
    split_part(name, '/', 1) = auth.uid()::text
  );

-- SELECT Policy: Allow public read access to all product files
CREATE POLICY "Public can view products"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'products');

-- UPDATE Policy: Allow users to update their own files
CREATE POLICY "Users can update their own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'products' AND
    split_part(name, '/', 1) = auth.uid()::text
  );

-- DELETE Policy: Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'products' AND
    split_part(name, '/', 1) = auth.uid()::text
  );
