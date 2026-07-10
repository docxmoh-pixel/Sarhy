"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useLanguage, LanguageProvider } from "@/lib/language"
import { ShoppingBag, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

function OrdersContent() {
  const { language, direction } = useLanguage()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace("/auth/login"); return }
      supabase
        .from("orders")
        .select("*, order_items(*, products(title, price_halalas, images))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setOrders(data || [])
          setLoading(false)
        })
    })
  }, [router])

  const statusLabel = (status: string) => {
    if (language === "ar") return status === "paid" ? "مكتمل" : "قيد المعالجة"
    return status === "paid" ? "Completed" : "Pending"
  }

  const statusClass = (status: string) =>
    status === "paid"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500"

  const getImageUrl = (images: any): string | null => {
    if (!images) return null
    try {
      const parsed = typeof images === "string" ? JSON.parse(images) : images
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null
    } catch {
      return null
    }
  }

  const orderTotal = (items: any[]): number =>
    items?.reduce((sum, item) => sum + (item.unit_price_halalas ?? item.products?.price_halalas ?? 0) * (item.quantity ?? 1), 0) ?? 0

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      <div className="container mx-auto px-4 py-8 max-w-3xl">

        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">
            {language === "ar" ? "طلباتي" : "My Orders"}
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <Package className="w-14 h-14 mx-auto mb-4 opacity-30 text-muted-foreground" />
            <p className="text-muted-foreground mb-6 text-lg">
              {language === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
            </p>
            <Link href="/marketplace">
              <Button className="rounded-xl gap-2">
                <ShoppingBag className="w-4 h-4" />
                {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const items: any[] = order.order_items || []
              const total = orderTotal(items)
              const shortId = order.id?.slice(0, 8).toUpperCase()
              const date = new Date(order.created_at).toLocaleDateString(
                language === "ar" ? "ar-SA" : "en-US",
                { year: "numeric", month: "short", day: "numeric" }
              )

              return (
                <div key={order.id} className="bg-card border border-border rounded-2xl p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {language === "ar" ? "رقم الطلب" : "Order #"}
                        {" "}<span className="font-mono font-semibold text-foreground">{shortId}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{date}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusClass(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item, i) => {
                      const product = item.products
                      const imageUrl = getImageUrl(product?.images)
                      const price = ((item.unit_price_halalas ?? product?.price_halalas ?? 0) / 100).toFixed(2)
                      const qty = item.quantity ?? 1

                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center text-2xl">
                            {imageUrl ? (
                              <Image src={imageUrl} alt={product?.title || ""} width={48} height={48} className="object-cover w-full h-full" />
                            ) : (
                              "📦"
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product?.title || "—"}</p>
                            <p className="text-xs text-muted-foreground">
                              {language === "ar" ? `الكمية: ${qty}` : `Qty: ${qty}`}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-primary flex-shrink-0">
                            {price} {language === "ar" ? "ر.س" : "SAR"}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm text-muted-foreground">
                      {language === "ar" ? "الإجمالي" : "Total"}
                    </span>
                    <span className="font-bold text-base">
                      {(total / 100).toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

export default function OrdersPage() {
  return (
    <LanguageProvider>
      <OrdersContent />
    </LanguageProvider>
  )
}
