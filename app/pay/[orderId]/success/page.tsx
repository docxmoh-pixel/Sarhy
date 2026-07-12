"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function PaySuccessContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.orderId as string

  // Tap redirects with ?id=<payment_id>&status=paid&message=...
  const paymentId = searchParams.get('id') ?? undefined
  const paymentStatus = searchParams.get('status')

  const [done, setDone] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null)

  useEffect(() => {
    fetch('/api/pay/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, payment_id: paymentId, payment_status: paymentStatus }),
    })
      .then(async (res) => {
        const data = await res.json()
        setResult(res.ok ? { ok: true } : { ok: false, error: data.error })
      })
      .catch((err) => setResult({ ok: false, error: err.message }))
      .finally(() => setDone(true))
  }, [orderId, paymentId, paymentStatus])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="text-center space-y-6 max-w-sm w-full">
        {!done ? (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">جاري تأكيد الدفع...</p>
          </>
        ) : result?.ok ? (
          <>
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">تم الدفع بنجاح ✓</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                شكراً لك! تم استلام دفعتك وسيتم التواصل معك قريباً.
              </p>
              {paymentId && (
                <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
                  رقم العملية: {paymentId}
                </p>
              )}
            </div>
            <Link href="/marketplace" className="block">
              <Button className="w-full">العودة للسوق</Button>
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mx-auto">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">حدث خطأ</h1>
              <p className="text-muted-foreground text-sm">{result?.error || 'لم يتم تأكيد الدفع'}</p>
            </div>
            <Link href="/marketplace" className="block">
              <Button variant="outline" className="w-full">العودة للسوق</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function PaySuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <PaySuccessContent />
    </Suspense>
  )
}
