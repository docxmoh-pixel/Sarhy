-- Enable realtime for the notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Allow users to delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Add optional type and action_url columns (safe, backwards-compatible)
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'system',
  ADD COLUMN IF NOT EXISTS action_url TEXT;
