-- Add fulfillment_type column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS fulfillment_type TEXT DEFAULT 'digital'
CHECK (fulfillment_type IN ('digital', 'service_remote', 'physical_shipping', 'service_onsite'));
