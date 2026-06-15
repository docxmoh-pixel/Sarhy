"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import {
  Heart,
  Share2,
  Download,
  Star,
  Eye,
  ShoppingCart,
  Play,
  Check,
  ChevronRight,
  BadgeCheck,
  MessageCircle,
  Flag,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language"
import { useCart } from "@/lib/cart"
import { AIAssistant } from "@/components/ai-assistant"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"

function ProductContent() {
  const router = useRouter()
  const params = useParams()
  const { language } = useLanguage()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [submittingReport, setSubmittingReport] = useState(false)
  const { addToCart, isInCart, isLoading } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data: productData, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", params.id)
          .single()

        if (!productData || error) {
          router.push("/marketplace")
          return
        }

        setProduct(productData)
      } catch (error) {
        console.error("Error fetching product:", error)
        router.push("/marketplace")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return null
  }

  const priceInSAR = product.price_halalas ? (product.price_halalas / 100).toFixed(2) : "0.00"
  const features = product.features ? product.features.split('|').filter((f: string) => f.trim()) : []
  const images = product.images ? JSON.parse(product.images) : []
  const canPurchase = product.is_published
  const isExpired = product.has_expiry && product.expiry_date ? new Date(product.expiry_date) < new Date() : false

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          >
            <Link href="/marketplace" className="hover:text-foreground transition-colors">
              {language === "ar" ? "السوق" : "Marketplace"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/marketplace/${product.category}`} className="hover:text-foreground transition-colors">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate max-w-[200px]">
              {product.title}
            </span>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass mb-4">
                {images.length > 0 && images[selectedImage] ? (
                  <Image
                    src={images[selectedImage]}
                    alt=""
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-6xl">📦</div>
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "relative aspect-[4/3] rounded-xl overflow-hidden transition-all",
                        selectedImage === index 
                          ? "ring-2 ring-primary" 
                          : "opacity-60 hover:opacity-100"
                      )}
                    >
                      <Image src={image} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Title & Category */}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                  {product.subcategory}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                  {product.title}
                </h1>
              </div>
              
              {/* Creator */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <span className="font-semibold">
                    Seller ID: {product.seller_id}
                  </span>
                </div>
              </div>

              {/* Expiry Warning Card */}
              {product.has_expiry && product.expiry_date && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-500 dark:border-amber-600 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-500 dark:bg-amber-600 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-1">
                        {language === "ar" ? "تنبيه: هذا المنتج مؤقت" : "Warning: This product is temporary"}
                      </h3>
                      <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                        {language === "ar"
                          ? "يرجى فحص ملصق الصلاحية فور الاستلام وقبل الاستهلاك"
                          : "Please check the expiry label immediately upon receipt and before consumption"}
                      </p>
                      <div className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                        {language === "ar" ? "تاريخ انتهاء الصلاحية:" : "Expiry Date:"}{" "}
                        {new Date(product.expiry_date).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price & Actions */}
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <div className="text-3xl font-bold">{priceInSAR} ر.س</div>
                </div>

                <div className="flex-1 flex gap-3">
                  {!canPurchase || isExpired ? (
                    <Button disabled className="flex-1 gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      {isExpired
                        ? (language === "ar" ? "منتهي الصلاحية" : "Expired")
                        : (language === "ar" ? "غير متاح" : "Not Available")}
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      onClick={async () => {
                        console.log("[Product] addToCart clicked, product.id:", product.id)
                        await addToCart(product.id)
                        console.log("[Product] addToCart done")
                      }}
                      disabled={isLoading}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isLoading
                        ? (language === "ar" ? "جاري الإضافة..." : "Adding...")
                        : isInCart(product.id)
                          ? (language === "ar" ? "في السلة ✓" : "In Cart ✓")
                          : (language === "ar" ? "أضف للسلة" : "Add to Cart")
                      }
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                    className={cn(isLiked && "text-red-500")}
                  >
                    <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowReportModal(true)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Flag className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Features */}
              {features.length > 0 && (
                <div className="p-4 rounded-xl bg-secondary/50 mb-6">
                  <h3 className="font-semibold mb-3">{language === "ar" ? "المميزات" : "Features"}</h3>
                  <ul className="space-y-2">
                    {features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">{language === "ar" ? "الوصف" : "Description"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {language === "ar" ? "إبلاغ عن محتوى مخالف / تالف" : "Report Violation / Damaged Content"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === "ar" ? "سبب الإبلاغ" : "Report Reason"}
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-background"
                >
                  <option value="">
                    {language === "ar" ? "اختر السبب" : "Select Reason"}
                  </option>
                  <option value="inappropriate">
                    {language === "ar" ? "محتوى مخالف" : "Inappropriate Content"}
                  </option>
                  <option value="damaged">
                    {language === "ar" ? "منتج تالف/منتهي" : "Damaged/Expired Product"}
                  </option>
                  <option value="copyright">
                    {language === "ar" ? "انتهاك حقوق" : "Copyright Violation"}
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === "ar" ? "الوصف (اختياري)" : "Description (Optional)"}
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-background"
                  rows={3}
                  placeholder={language === "ar" ? "أضف تفاصيل إضافية..." : "Add additional details..."}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowReportModal(false)}
                variant="outline"
                className="flex-1"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={async () => {
                  if (!reportReason) {
                    alert(language === "ar" ? "يرجى اختيار سبب الإبلاغ" : "Please select a reason")
                    return
                  }
                  setSubmittingReport(true)
                  try {
                    const response = await fetch("/api/reports", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        product_id: product.id,
                        reason: reportReason,
                        description: reportDescription,
                      }),
                    })
                    if (response.ok) {
                      alert(language === "ar" ? "تم إرسال البلاغ بنجاح" : "Report submitted successfully")
                      setShowReportModal(false)
                      setReportReason("")
                      setReportDescription("")
                    } else {
                      throw new Error("Failed to submit report")
                    }
                  } catch (error) {
                    alert(language === "ar" ? "فشل إرسال البلاغ" : "Failed to submit report")
                  } finally {
                    setSubmittingReport(false)
                  }
                }}
                disabled={submittingReport}
                className="flex-1 bg-destructive hover:bg-destructive/90"
              >
                {submittingReport
                  ? (language === "ar" ? "جاري الإرسال..." : "Submitting...")
                  : (language === "ar" ? "إرسال" : "Submit")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AIAssistant />
    </div>
  )
}

export default function ProductPage() {
  return <ProductContent />
}
