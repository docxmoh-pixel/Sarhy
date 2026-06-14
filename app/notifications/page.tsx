"use client"

import { motion } from "framer-motion"
import {
  Bell,
  Check,
  Gift,
  Heart,
  MessageCircle,
  ShoppingBag,
  Star,
  Trash2,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language"
import { useNotifications } from "@/components/notifications-provider"
import type { NotificationType } from "@/lib/notifications"

const ICON_MAP: Record<NotificationType, React.ElementType> = {
  purchase: ShoppingBag,
  review: Star,
  follow: Heart,
  message: MessageCircle,
  promo: Gift,
  system: Zap,
}

export default function NotificationsPage() {
  const { language } = useLanguage()
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications()

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              {language === "ar" ? "الإشعارات" : "Notifications"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {unreadCount > 0
                ? `${unreadCount} ${language === "ar" ? "غير مقروءة" : "unread"}`
                : language === "ar"
                ? "كل الإشعارات مقروءة"
                : "All caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              className="rounded-full gap-2"
              onClick={markAllAsRead}
            >
              <Check className="w-4 h-4" />
              {language === "ar" ? "تحديد الكل كمقروء" : "Mark all as read"}
            </Button>
          )}
        </motion.div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-border p-4 flex items-start gap-4 animate-pulse"
              >
                <div className="w-10 h-10 rounded-xl bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-card rounded-2xl border border-border"
          >
            <Bell className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {language === "ar" ? "لا توجد إشعارات" : "No notifications yet"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {language === "ar"
                ? "ستظهر إشعاراتك هنا فور وصولها"
                : "Your notifications will appear here in real time"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const Icon =
                ICON_MAP[notification.type as NotificationType] ?? Bell
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`bg-card rounded-2xl border p-4 flex items-start gap-4 ${
                    notification.is_read
                      ? "border-border"
                      : "border-primary/30 bg-primary/5"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notification.is_read
                        ? "bg-secondary text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 leading-tight">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1.5">
                          {new Date(notification.created_at).toLocaleDateString(
                            language === "ar" ? "ar-SA" : "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!notification.is_read && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary/70"
                        onClick={() => markAsRead(notification.id)}
                        title={
                          language === "ar" ? "تحديد كمقروء" : "Mark as read"
                        }
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteNotification(notification.id)}
                      title={language === "ar" ? "حذف" : "Delete"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
