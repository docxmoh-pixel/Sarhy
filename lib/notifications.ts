export type NotificationType =
  | "purchase"
  | "review"
  | "follow"
  | "message"
  | "promo"
  | "system"

export type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  type?: NotificationType
  action_url?: string
}
