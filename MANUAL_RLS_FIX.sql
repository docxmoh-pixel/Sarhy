-- ========================================
-- RLS Policies Fix for Products Table & Storage
-- ========================================

-- === PART 1: PRODUCTS TABLE RLS POLICIES ===

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;

-- INSERT Policy: Allow any authenticated user to create products
CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- UPDATE Policy: Users can only update their own products (seller_id = user.id)
CREATE POLICY "Users can update their own products"
  ON products FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid());

-- DELETE Policy: Users can only delete their own products (seller_id = user.id)
CREATE POLICY "Users can delete their own products"
  ON products FOR DELETE
  TO authenticated
  USING (seller_id = auth.uid());

-- Admin policies: Admins can manage any products
CREATE POLICY "Admins can update any products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can delete any products"
  ON products FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- === PART 2: STORAGE BUCKET POLICIES ===

-- Create products bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('products', 'products', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/zip', 'text/plain'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/zip', 'text/plain'];

-- Drop existing storage policies
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

-- === VERIFICATION ===

-- Verify products table policies
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'products';

-- Verify storage policies
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
