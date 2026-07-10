-- Drop all foreign key constraints on cart_items that reference products
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'cart_items'::regclass
        AND confrelid = 'products'::regclass
    LOOP
        EXECUTE 'ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_record.conname);
        RAISE NOTICE 'Dropped constraint: %', constraint_record.conname;
    END LOOP;
END $$;

-- Add a single correct foreign key constraint from cart_items.product_id to products.id
ALTER TABLE cart_items
ADD CONSTRAINT cart_items_product_id_fkey
FOREIGN KEY (product_id) REFERENCES products(id)
ON DELETE CASCADE;
