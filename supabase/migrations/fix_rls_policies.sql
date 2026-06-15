-- Fix RLS policies for cart_items and reports tables

DROP POLICY IF EXISTS "users_can_manage_own_cart" ON cart_items;
CREATE POLICY "users_can_manage_own_cart" ON cart_items
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_can_insert_reports" ON reports;
CREATE POLICY "users_can_insert_reports" ON reports
FOR INSERT WITH CHECK (auth.uid() = reporter_id);
