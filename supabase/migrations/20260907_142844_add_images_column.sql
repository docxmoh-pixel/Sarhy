-- Add images column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT;

-- Re-enable image upload functionality
-- The images column will store JSON array of image URLs