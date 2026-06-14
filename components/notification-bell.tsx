"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Bell,
  Check,
  Gift,
  Heart,
  MessageCircle,
  ShoppingBag,
  Star,
  Zap,
} from "lucide-react"
import Link from "next/link"
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

export function NotificationBell() {
  const { language } = useLanguage()
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen])

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative text-white hover:text-white/80"
        aria-label={language === "ar" ? "الإشعارات" : "Notifications"}
      >
        <Bell className="w-5 h-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-sm">
                {language === "ar" ? "الإشعارات" : "Notifications"}
                {unreadCount > 0 && (
                  <span className="ms-2 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-7 px-2"
                >
                  {language === "ar" ? "قراءة الكل" : "Mark all read"}
                </Button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  {language === "ar" ? "لا توجد إشعارات" : "No notifications"}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.slice(0, 8).map((n) => {
                    const Icon =
                      ICON_MAP[n.type as NotificationType] ?? Bell
                    return (
                      <div
                        key={n.id}
                        className={`px-4 py-3 flex items-start gap-3 hover:bg-muted/40 transition-colors ${
                          !n.is_read ? "bg-primary/5" : ""
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            !n.is_read
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight truncate">
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            {new Date(n.created_at).toLocaleDateString(
                              language === "ar" ? "ar-SA" : "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                        {!n.is_read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="mt-0.5 text-primary hover:text-primary/70 shrink-0"
                            aria-label="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer link */}
            <div className="border-t border-border px-4 py-2.5">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-xs text-primary hover:underline"
              >
                {language === "ar"
                  ? "عرض جميع الإشعارات"
                  : "View all notifications"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
