"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CreditCard, Lock, Shield, Check, ArrowLeft, ArrowRight, User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/lib/language"
import { createClient } from "@/lib/supabase"

interface CartItem {
  id: string
  title: { ar: string; en: string }
  price_halalas: number
  quantity: number
  creator: string
}

function CheckoutContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  
  // Buyer form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("sarhy_cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setLoading(false)
  }, [])
  
  const subtotal = cartItems.reduce((sum: number, item: CartItem) => sum + item.price_halalas * item.quantity, 0)
  const total = subtotal
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    
    try {
      // Validate form
      if (!formData.fullName || !formData.email || !formData.phone) {
        alert(language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields")
        setProcessing(false)
        return
      }
      
      if (cartItems.length === 0) {
        alert(language === "ar" ? "السلة فارغة" : "Cart is empty")
        setProcessing(false)
        return
      }
      
      // Create Moyasar payment via API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyer_name: formData.fullName,
          buyer_email: formData.email,
          buyer_phone: formData.phone,
          items: cartItems,
          total: total,
        }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Redirect to Moyasar payment page
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No payment URL returned")
      }
    } catch (error) {
      console.error("Error processing order:", error)
      alert(language === "ar" ? "حدث خطأ أثناء معالجة الطلب" : "Error processing order")
    } finally {
      setProcessing(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <div className="text-center py-12 text-muted-foreground">
              {language === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          </div>
        </main>
      </div>
    )
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <div className="text-center py-16 bg-card rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {language === "ar" ? "السلة فارغة" : "Cart is empty"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === "ar" ? "أضف منتجات إلى السلة للمتابعة" : "Add products to cart to continue"}
              </p>
              <button
                onClick={() => router.push("/marketplace")}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl"
              >
                {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === "ar" ? "إتمام الشراء" : "Checkout"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar" ? "أكمل طلبك بأمان" : "Complete your order securely"}
            </p>
          </motion.div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Payment Form */}
              <div className="lg:col-span-3 space-y-6">
                {/* Buyer Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {language === "ar" ? "معلومات المشتري" : "Buyer Information"}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        {language === "ar" ? "الاسم الكامل *" : "Full Name *"}
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {language === "ar" ? "البريد الإلكتروني * (لإرسال المنتج والإيصال)" : "Email * (for product delivery and receipt)"}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {language === "ar" ? "رقم الجوال *" : "Phone Number *"}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={language === "ar" ? "أدخل رقم جوالك" : "Enter your phone number"}
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
                
                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {language === "ar" ? "طريقة الدفع" : "Payment Method"}
                  </h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <RadioGroupItem value="card" />
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <span className="text-foreground">{language === "ar" ? "بطاقة ائتمان" : "Credit Card"}</span>
                    </label>
                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <RadioGroupItem value="paypal" />
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.768.768 0 0 1 .757-.646h6.737c2.21 0 3.955.737 4.622 2.144.29.613.426 1.268.366 1.972l-.002.034c-.12 1.1-.575 2.094-1.33 2.865-.783.798-1.875 1.364-3.202 1.618-.407.078-.843.117-1.312.117H9.723l-.942 5.98a.641.641 0 0 1-.633.533H7.076z"/>
                      </svg>
                      <span className="text-foreground">PayPal</span>
                    </label>
                  </RadioGroup>
                </motion.div>
                
                {/* Card Details */}
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      {language === "ar" ? "تفاصيل البطاقة" : "Card Details"}
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{language === "ar" ? "رقم البطاقة" : "Card Number"}</Label>
                        <Input placeholder="1234 5678 9012 3456" className="h-12 rounded-xl" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{language === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}</Label>
                          <Input placeholder="MM/YY" className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>CVV</Label>
                          <Input placeholder="123" className="h-12 rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{language === "ar" ? "اسم حامل البطاقة" : "Cardholder Name"}</Label>
                        <Input placeholder={language === "ar" ? "الاسم كما يظهر على البطاقة" : "Name as shown on card"} className="h-12 rounded-xl" />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Security Note */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 p-4 bg-secondary rounded-xl"
                >
                  <Shield className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    {language === "ar" 
                      ? "معاملاتك محمية بتشفير SSL 256-bit"
                      : "Your transaction is secured with 256-bit SSL encryption"
                    }
                  </p>
                </motion.div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-2xl border border-border p-6 sticky top-24 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {language === "ar" ? "ملخص الطلب" : "Order Summary"}
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item: CartItem) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate pe-2">
                          {language === "ar" ? item.title.ar : item.title.en} x{item.quantity}
                        </span>
                        <span className="text-foreground shrink-0">${item.price_halalas * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-semibold mb-6">
                    <span className="text-foreground">{language === "ar" ? "الإجمالي" : "Total"}</span>
                    <span className="text-foreground">${total}</span>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={processing}
                    className="w-full h-12 rounded-xl gap-2 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Lock className="w-4 h-4" />
                    {processing
                      ? (language === "ar" ? "جاري المعالجة..." : "Processing...")
                      : (language === "ar" ? "ادفع الآن" : "Pay Now")} ${total}
                  </Button>
                  
                  <div className="mt-4 space-y-2">
                    {[
                      language === "ar" ? "ضمان استرداد 30 يوم" : "30-day money-back guarantee",
                      language === "ar" ? "دعم فني على مدار الساعة" : "24/7 customer support",
                      language === "ar" ? "تحميل فوري بعد الدفع" : "Instant download after payment"
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500" />
                        {text}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function CheckoutPage() {
  return <CheckoutContent />
}
