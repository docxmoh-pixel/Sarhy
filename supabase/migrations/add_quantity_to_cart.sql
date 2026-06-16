-- Add quantity column to cart_items table
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
