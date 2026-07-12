"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Loader2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PayPage() {
  const params = useParams()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    fetch(`/api/pay/order?id=${orderId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('الطلب غير موجود')
        return res.json()
      })
      .then((data) => {
        setOrder(data.order)
        setItems(data.items)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [orderId])

  const handlePayment = async () => {
    if (!order) return
    setRedirecting(true)
    setError(null)

    try {
      const response = await fetch('/api/payment/create-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: order.total_halalas,
          order_id: order.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment charge')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء معالجة الدفع')
      setRedirecting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive text-sm">{error || 'الطلب غير موجود'}</p>
      </div>
    )
  }

  const formatSAR = (h: number) => (h / 100).toFixed(2)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md space-y-5">

        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">إتمام الدفع</h1>
          <p className="text-sm text-muted-foreground mt-1">طلب #{order.id.slice(0, 8)}</p>
        </div>

        {/* Order Summary */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ملخص الطلب</p>
          {items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground line-clamp-1 flex-1 ml-4">
                {item.product?.title || 'منتج'} × {item.quantity}
              </span>
              <span className="font-medium whitespace-nowrap">
                {formatSAR((item.price_halalas || 0) * item.quantity)} ر.س
              </span>
            </div>
          ))}
          <div className="border-t border-border pt-3 flex justify-between font-bold">
            <span>الإجمالي</span>
            <span className="text-primary text-lg">{formatSAR(order.total_halalas)} ر.س</span>
          </div>
        </div>

        {/* Payment Button */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <Button 
            onClick={handlePayment} 
            disabled={redirecting}
            className="w-full h-12 rounded-xl"
          >
            {redirecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                جاري التوجيه...
              </>
            ) : (
              'الدفع الآن'
            )}
          </Button>
        </div>

      </div>
    </div>
  )
}
