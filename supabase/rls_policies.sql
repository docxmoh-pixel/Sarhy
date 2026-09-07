-- تفعيل RLS على جدول products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- سياسة القراءة للجميع
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- سياسة الإدراج للمستخدمين المصادق عليهم (يمكنك تعديل هذا ليتناسب مع نظام الصلاحيات الخاص بك)
CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- سياسة التحديث للمستخدمين المصادق عليهم
CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true);

-- سياسة الحذف للمستخدمين المصادق عليهم
CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- تفعيل RLS على جدول categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- سياسة القراءة للجميع
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- سياسة الإدراج للمشرفين فقط
CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- سياسة التحديث للمشرفين فقط
CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- سياسة الحذف للمشرفين فقط
CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );
