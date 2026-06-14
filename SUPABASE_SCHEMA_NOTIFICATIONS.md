# جدول الإشعارات (Notifications)

## إنشاء الجدول في Supabase

قم بتنفيذ SQL التالي في Supabase SQL Editor:

```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- تفعيل Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- السماح للمستخدمين بقراءة إشعاراتهم فقط
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- السماح للمستخدمين بتحديث إشعاراتهم فقط
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- السماح للنظام بإدراج الإشعارات
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
```

## هيكل الجدول

| الحقل | النوع | الوصف |
|-------|------|-------|
| id | UUID | معرف الإشعار (PK) |
| user_id | UUID | معرف المستخدم المستلم (FK) |
| title | TEXT | عنوان الإشعار |
| message | TEXT | نص الإشعار |
| is_read | BOOLEAN | هل تم قراءة الإشعار؟ |
| created_at | TIMESTAMP | تاريخ إنشاء الإشعار |
