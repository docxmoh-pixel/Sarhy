"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase"
import type { Notification } from "@/lib/notifications"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotification: async () => {},
})

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Derive unreadCount — no risk of stale separate counter
  const unreadCount = notifications.filter((n) => !n.is_read).length

  const fetchAndSubscribe = useCallback(async (userId: string) => {
    const supabase = createClient()
    setIsLoading(true)

    console.log("🔔 [NotificationsProvider] Fetching notifications for user ID:", userId)

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30)

    console.log("🔔 [NotificationsProvider] Fetched notifications:", data)

    setNotifications(data ?? [])
    setIsLoading(false)

    // Tear down any previous channel before creating a new one
    if (channelRef.current) {
      await channelRef.current.unsubscribe()
    }

    channelRef.current = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const incoming = payload.new as Notification
          setNotifications((prev) => [incoming, ...prev])
          // Fire Sonner toast
          toast(incoming.title, {
            description: incoming.message,
            icon: "🔔",
            duration: 5000,
          })
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as Notification
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          )
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== (payload.old as Notification).id)
          )
        }
      )
      .subscribe()
  }, [])

  useEffect(() => {
    const supabase = createClient()

    // Bootstrap from existing session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) fetchAndSubscribe(user.id)
    })

    // Re-run on auth state transitions (login / logout / token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        fetchAndSubscribe(session.user.id)
      } else if (event === "SIGNED_OUT") {
        setNotifications([])
        channelRef.current?.unsubscribe()
        channelRef.current = null
      }
    })

    return () => {
      subscription.unsubscribe()
      channelRef.current?.unsubscribe()
    }
  }, [fetchAndSubscribe])

  const markAsRead = useCallback(async (id: string) => {
    // Optimistic
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
    const supabase = createClient()
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
  }, [])

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false)
  }, [])

  const deleteNotification = useCallback(async (id: string) => {
    // Optimistic
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    const supabase = createClient()
    await supabase.from("notifications").delete().eq("id", id)
  }, [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationsContext)
}
