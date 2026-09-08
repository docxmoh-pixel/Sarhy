-- Fix RLS policies for products table (secure, owner-scoped)
-- Replaces the previous unsafe USING (true) policies.

DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;
DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;

-- Sellers can create products only for themselves
CREATE POLICY "Sellers can insert own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid());

-- Sellers can update/delete only their own products
CREATE POLICY "Sellers can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (seller_id = auth.uid());

-- Admins (users.role = 'admin') can manage all products
CREATE POLICY "Admins can manage all products"
  ON products FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));