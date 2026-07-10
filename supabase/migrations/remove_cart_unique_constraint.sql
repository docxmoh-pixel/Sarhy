-- Remove unique constraint on cart_items to allow duplicate products
-- This allows users to add the same product multiple times as separate rows

-- Drop the unique constraint if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'cart_items_user_id_product_id_key'
    ) THEN
        ALTER TABLE cart_items DROP CONSTRAINT cart_items_user_id_product_id_key;
    END IF;
END $$;

-- Detect and log all triggers on cart_items
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    RAISE NOTICE 'Checking for triggers on cart_items table...';
    FOR trigger_record IN
        SELECT trigger_name, event_manipulation, event_object_table
        FROM information_schema.triggers
        WHERE event_object_table = 'cart_items'
    LOOP
        RAISE NOTICE 'Found trigger: % on % (event: %)', trigger_record.trigger_name, trigger_record.event_object_table, trigger_record.event_manipulation;
    END LOOP;
END $$;

-- Drop all triggers on cart_items
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN
        SELECT trigger_name
        FROM information_schema.triggers
        WHERE event_object_table = 'cart_items'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(trigger_record.trigger_name) || ' ON cart_items';
        RAISE NOTICE 'Dropped trigger: %', trigger_record.trigger_name;
    END LOOP;
END $$;
