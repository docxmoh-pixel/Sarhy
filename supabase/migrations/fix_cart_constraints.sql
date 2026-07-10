-- إزالة قيد التكرار (Unique Constraint) إن وجد
ALTER TABLE cart_items 
DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

-- تأكد من وجود الـ Relationship بين cart_items و products
-- (هذا الأمر يضمن أن Supabase يفهم الرابط)
ALTER TABLE cart_items 
ADD CONSTRAINT fk_product 
FOREIGN KEY (product_id) REFERENCES products(id);
