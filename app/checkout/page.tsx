"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, MapPin, CreditCard, Loader2, Smartphone, X } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { createClient } from "@/lib/supabase"
import { useCart } from "@/lib/cart"
import { useLanguage } from "@/lib/language"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Step = "address" | "review" | "payment"

declare global {
  interface Window { tapjs: any }
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items, total, isLoading: cartLoading } = useCart()
  const { language } = useLanguage()
  const isAr = language === "ar"
  const supabase = createClient()

  const needsAddress = items.some(
    (item) => item.products?.fulfillment_type === "physical_shipping" || item.products?.fulfillment_type === "service_onsite"
  )

  const [step, setStep] = useState<Step>("review")
  const [userId, setUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [showQrModal, setShowQrModal] = useState(false)
  const [qrLoading, setQrLoading] = useState(false)

  const [address, setAddress] = useState({
    full_name: "",
    phone: "",
    city: "",
    address_line1: "",
    address_line2: "",
  })
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [isOtherRecipient, setIsOtherRecipient] = useState(false)


  const formatSAR = (halalas: number) => (halalas / 100).toFixed(2)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUserId(user.id)
    })
  }, [])

  useEffect(() => {
    if (!userId) return
    supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSavedAddresses(data)
          const def = data.find((a) => a.is_default) || data[0]
          setSelectedAddressId(def.id)
          setAddress({
            full_name: def.full_name,
            phone: def.phone,
            city: def.city,
            address_line1: def.address_line1,
            address_line2: def.address_line2 || "",
          })
        } else {
          setUseNewAddress(true)
        }
      })
  }, [userId])

  useEffect(() => {
    if (needsAddress) {
      setStep("address")
    }
  }, [needsAddress])


  const handleAddressSubmit = async () => {
    if (!address.full_name || !address.phone || !address.city || !address.address_line1) {
      setError(isAr ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields")
      return
    }
    setError(null)

    if (useNewAddress && !isOtherRecipient && userId) {
      await supabase.from("user_addresses").insert({
        user_id: userId,
        label: isAr ? "عنوان جديد" : "New Address",
        full_name: address.full_name,
        phone: address.phone,
        city: address.city,
        address_line1: address.address_line1,
        address_line2: address.address_line2,
        is_default: savedAddresses.length === 0,
      })
    }

    setStep("review")
  }

  const handlePayment = async () => {
    if (!userId) return
    setSubmitting(true)
    setError(null)

    try {
      // Get user email
      const { data: { user } } = await supabase.auth.getUser()
      const userEmail = user?.email || ''

      // 1. إنشاء الطلب في Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          buyer_name: address.full_name,
          buyer_email: userEmail,
          buyer_phone: address.phone,
          total_halalas: total,
          status: "pending",
        })
        .select()
        .single()

      if (orderError || !order) throw new Error(orderError?.message || "Order creation failed")

      // 2. إدراج عناصر الطلب
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_halalas: item.products?.price_halalas || 0,
      }))
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
      if (itemsError) throw new Error('order_items: ' + itemsError.message)

      // 3. إنشاء charge في Tap
      const response = await fetch('/api/payment/create-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total),
          order_id: order.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment charge')
      }

      const { url } = await response.json()
      
      // 4. التوجيه إلى صفحة الدفع الخاصة بـ Tap
      window.location.href = url

    } catch (err: any) {
      setError(err.message || (isAr ? "حدث خطأ أثناء معالجة الدفع" : "Payment processing error"))
      setSubmitting(false)
    }
  }

  const handleMobilePayment = async () => {
    if (!userId) return
    setQrLoading(true)
    setError(null)
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          buyer_name: address.full_name,
          buyer_email: "",
          buyer_phone: address.phone,
          total_halalas: total,
          status: "pending",
        })
        .select()
        .single()

      if (orderError || !order) throw new Error(orderError?.message || "Order creation failed")

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_halalas: item.products?.price_halalas || 0,
      }))
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
      if (itemsError) throw new Error("order_items: " + itemsError.message)

      const url = `https://www.sarhy.com/pay/${order.id}`
      setQrUrl(url)
      setShowQrModal(true)
    } catch (err: any) {
      setError(err.message || (isAr ? "حدث خطأ أثناء إنشاء رمز الدفع" : "Failed to generate payment QR"))
    } finally {
      setQrLoading(false)
    }
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-16 text-center">
        <p className="text-muted-foreground mb-6">
          {isAr ? "سلتك فارغة" : "Your cart is empty"}
        </p>
        <Link href="/marketplace">
          <Button>{isAr ? "تصفح المنتجات" : "Browse Products"}</Button>
        </Link>
      </div>
    )
  }

  const Arrow = isAr ? ChevronLeft : ChevronRight

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {isAr ? "إتمام الشراء" : "Checkout"}
        </h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          {(needsAddress
            ? [
                { key: "address", label: isAr ? "العنوان" : "Address" },
                { key: "review", label: isAr ? "المراجعة" : "Review" },
                { key: "payment", label: isAr ? "الدفع" : "Payment" },
              ]
            : [
                { key: "review", label: isAr ? "المراجعة" : "Review" },
                { key: "payment", label: isAr ? "الدفع" : "Payment" },
              ]
          ).map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-medium ${
                  step === s.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span className={step === s.key ? "font-medium" : "text-muted-foreground"}>
                {s.label}
              </span>
              {i < 2 && <div className="w-8 h-px bg-border mx-2" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === "address" && (
              <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {isAr ? "عنوان الشحن" : "Shipping Address"}
                </div>

                {savedAddresses.length > 0 && !useNewAddress && (
                  <div className="space-y-3">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id)
                          setIsOtherRecipient(false)
                          setAddress({
                            full_name: addr.full_name,
                            phone: addr.phone,
                            city: addr.city,
                            address_line1: addr.address_line1,
                            address_line2: addr.address_line2 || "",
                          })
                        }}
                        className={`w-full text-right p-4 rounded-xl border transition-colors ${
                          selectedAddressId === addr.id && !isOtherRecipient
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        <p className="font-medium">{addr.label} — {addr.full_name}</p>
                        <p className="text-sm text-muted-foreground">{addr.phone}</p>
                        <p className="text-sm text-muted-foreground">{addr.address_line1}, {addr.city}</p>
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        setIsOtherRecipient(true)
                        setSelectedAddressId(null)
                        setAddress({ full_name: "", phone: "", city: "", address_line1: "", address_line2: "" })
                      }}
                      className={`w-full text-right p-4 rounded-xl border transition-colors ${
                        isOtherRecipient ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                      }`}
                    >
                      <p className="font-medium">{isAr ? "استلام لشخص آخر" : "Deliver to someone else"}</p>
                      <p className="text-sm text-muted-foreground">
                        {isAr ? "أدخل بيانات مستلم مختلف" : "Enter different recipient details"}
                      </p>
                    </button>

                    <button
                      onClick={() => setUseNewAddress(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      {isAr ? "+ إضافة عنوان جديد" : "+ Add new address"}
                    </button>
                  </div>
                )}

                {(useNewAddress || isOtherRecipient || savedAddresses.length === 0) && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{isAr ? "الاسم الكامل" : "Full Name"}</Label>
                      <Input
                        value={address.full_name}
                        onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>{isAr ? "رقم الجوال" : "Phone Number"}</Label>
                      <Input
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>{isAr ? "المدينة" : "City"}</Label>
                      <Input
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>{isAr ? "العنوان التفصيلي" : "Address Line"}</Label>
                      <Input
                        value={address.address_line1}
                        onChange={(e) => setAddress({ ...address, address_line1: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {savedAddresses.length > 0 && useNewAddress && (
                  <button
                    onClick={() => setUseNewAddress(false)}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {isAr ? "إلغاء واستخدام عنوان محفوظ" : "Cancel and use saved address"}
                  </button>
                )}

                <Button onClick={handleAddressSubmit} className="gap-2 mt-2">
                  {isAr ? "متابعة" : "Continue"}
                  <Arrow className="w-4 h-4" />
                </Button>
              </div>
            )}

            {step === "review" && (
              <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <h2 className="font-semibold mb-2">{isAr ? "مراجعة الطلب" : "Review Order"}</h2>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{item.products?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {isAr ? "الكمية" : "Qty"}: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold">
                      {formatSAR((item.products?.price_halalas || 0) * item.quantity)} {isAr ? "ر.س" : "SAR"}
                    </span>
                  </div>
                ))}
                {needsAddress && (
                  <div className="pt-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">{isAr ? "الشحن إلى" : "Shipping to"}</p>
                    <p>{address.full_name} — {address.phone}</p>
                    <p>{address.address_line1}, {address.city}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  {needsAddress && (
                    <Button variant="outline" onClick={() => setStep("address")}>
                      {isAr ? "رجوع" : "Back"}
                    </Button>
                  )}
                  <Button onClick={() => { setStep("payment") }} className="gap-2">
                    {isAr ? "متابعة للدفع" : "Continue to Payment"}
                    <Arrow className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  {isAr ? "طريقة الدفع" : "Payment Method"}
                </div>

                <>
                  <p className="text-sm text-muted-foreground">
                    {isAr
                      ? "ادفع بأمان عبر مدى، فيزا، ماستركارد، Apple Pay، أو STC Pay."
                      : "Pay securely via Mada, Visa, Mastercard, Apple Pay, or STC Pay."}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => setStep("review")} disabled={submitting || qrLoading}>
                      {isAr ? "رجوع" : "Back"}
                    </Button>
                    <Button onClick={handlePayment} disabled={submitting || qrLoading} className="gap-2">
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {submitting
                        ? (isAr ? "جاري التحضير..." : "Loading...")
                        : (isAr ? "الدفع الآن" : "Pay Now")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleMobilePayment}
                      disabled={submitting || qrLoading}
                      className="gap-2 border-primary/40 text-primary hover:bg-primary/5"
                    >
                      {qrLoading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Smartphone className="w-4 h-4" />}
                      {qrLoading
                        ? (isAr ? "جاري الإنشاء..." : "Generating...")
                        : (isAr ? "ادفع بالجوال 📱" : "Pay by Mobile 📱")}
                    </Button>
                  </div>
                </>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-6 rounded-2xl border border-border bg-card space-y-4">
              <h2 className="font-semibold">{isAr ? "ملخص الطلب" : "Order Summary"}</h2>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-muted-foreground">
                    <span className="line-clamp-1">{item.products?.title} × {item.quantity}</span>
                    <span>{formatSAR((item.products?.price_halalas || 0) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                <span>{isAr ? "الإجمالي" : "Total"}</span>
                <span className="text-primary">{formatSAR(total)} {isAr ? "ر.س" : "SAR"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQrModal && qrUrl && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-xl" dir={isAr ? "rtl" : "ltr"}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                {isAr ? "الدفع عبر الجوال" : "Pay by Mobile"}
              </h2>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center mb-4 p-4 bg-white rounded-xl">
              <QRCodeSVG
                value={qrUrl}
                size={220}
                level="M"
                includeMargin={false}
              />
            </div>

            <p className="text-sm text-center text-muted-foreground mb-4">
              {isAr
                ? "صوّر الكود بكاميرا جوالك لإتمام الدفع بـ Apple Pay"
                : "Scan the code with your phone camera to complete payment via Apple Pay"}
            </p>

            <div className="p-3 rounded-xl bg-secondary/50 break-all text-xs text-muted-foreground text-center mb-4 select-all">
              {qrUrl}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowQrModal(false)}
              >
                {isAr ? "إغلاق" : "Close"}
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={() => navigator.clipboard.writeText(qrUrl)}
              >
                {isAr ? "نسخ الرابط" : "Copy Link"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  )
}
