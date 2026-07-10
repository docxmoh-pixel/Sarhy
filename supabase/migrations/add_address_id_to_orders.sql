-- Add address_id column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_id UUID REFERENCES user_addresses(id) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_address_id ON orders(address_id);
