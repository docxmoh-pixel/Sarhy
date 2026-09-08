-- ========================================
-- RLS Policies Fix for Products Table Only
-- ========================================

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

-- Verify the policies were created successfully
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'products';
