-- Add metadata column to order_items table
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
