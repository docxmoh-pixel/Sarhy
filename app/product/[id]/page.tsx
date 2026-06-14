"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
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
import { AIAssistant } from "@/components/ai-assistant"
import { cn } from "@/lib/utils"
import { getDisplayStats, getPurchaseStatus, getMockStatusLabel } from "@/lib/mock-guard"

// Mock product data
const product = {
  id: 1,
  title: "مجموعة أيقونات احترافية للتصميم",
  titleEn: "Professional Design Icon Pack",
  description: "مجموعة شاملة تضم أكثر من 5000 أيقونة متجهة عالية الجودة، مصممة خصيصاً للمشاريع الاحترافية. تتضمن المجموعة أيقونات بأحجام مختلفة وصيغ متعددة (SVG, PNG, AI, Figma) مع تحديثات مجانية مدى الحياة.",
  descriptionEn: "A comprehensive collection of over 5000 high-quality vector icons, designed specifically for professional projects. The pack includes icons in various sizes and formats (SVG, PNG, AI, Figma) with free lifetime updates.",
  price: 49,
  originalPrice: 79,
  category: "ريشة",
  categoryEn: "Resha",
  images: [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop",
  ],
  likes: 1234,
  views: 5678,
  downloads: 890,
  rating: 4.9,
  reviewsCount: 156,
  is_mock: false,
  is_published: true,
  has_expiry: false,
  expiry_date: null,
  creator: {
    name: "أحمد العلي",
    nameEn: "Ahmed Ali",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    verified: true,
    followers: 25600,
    products: 156,
    rating: 4.9,
  },
  features: [
    { ar: "5000+ أيقونة متجهة", en: "5000+ Vector Icons" },
    { ar: "صيغ متعددة (SVG, PNG, AI, Figma)", en: "Multiple Formats (SVG, PNG, AI, Figma)" },
    { ar: "تحديثات مجانية مدى الحياة", en: "Free Lifetime Updates" },
    { ar: "رخصة تجارية كاملة", en: "Full Commercial License" },
    { ar: "دعم فني على مدار الساعة", en: "24/7 Support" },
  ],
  tags: ["icons", "ui", "design", "vector", "svg"],
  license: {
    personal: { price: 29, ar: "رخصة شخصية", en: "Personal License" },
    commercial: { price: 49, ar: "رخصة تجارية", en: "Commercial License" },
    extended: { price: 149, ar: "رخصة موسعة", en: "Extended License" },
  },
}

const relatedProducts = [
  {
    id: 2,
    title: "مجموعة أيقونات الأعمال",
    titleEn: "Business Icons Pack",
    price: 39,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    rating: 4.8,
  },
  {
    id: 3,
    title: "أيقونات التواصل الاجتماعي",
    titleEn: "Social Media Icons",
    price: 29,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop",
    rating: 4.7,
  },
  {
    id: 4,
    title: "أيقونات التجارة الإلكترونية",
    titleEn: "E-commerce Icons",
    price: 45,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
    rating: 4.9,
  },
]

const reviews = [
  {
    id: 1,
    user: "محمد الفهد",
    userEn: "Mohammed Alfahd",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "2024-01-15",
    comment: "مجموعة رائعة جداً! الأيقونات عالية الجودة ومتنوعة. استخدمتها في عدة مشاريع وكانت النتائج مذهلة.",
    commentEn: "Amazing collection! The icons are high quality and diverse. Used them in several projects with stunning results.",
  },
  {
    id: 2,
    user: "سارة أحمد",
    userEn: "Sara Ahmed",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "2024-01-10",
    comment: "أفضل مجموعة أيقونات اشتريتها. الدعم الفني ممتاز والتحديثات المستمرة تجعلها قيمة استثنائية.",
    commentEn: "Best icon pack I've ever purchased. Excellent support and continuous updates make it exceptional value.",
  },
]

function ProductContent() {
  const { language } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedLicense, setSelectedLicense] = useState<"personal" | "commercial" | "extended">("commercial")
  const [isLiked, setIsLiked] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [submittingReport, setSubmittingReport] = useState(false)

  const displayStats = getDisplayStats(product)
  const purchaseStatus = getPurchaseStatus(product)
  const canPurchase = purchaseStatus.canPurchase

  // Check if product is expired
  const isExpired = product.has_expiry && product.expiry_date
    ? new Date(product.expiry_date) < new Date()
    : false

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
            <Link href="/marketplace/resha" className="hover:text-foreground transition-colors">
              {language === "ar" ? product.category : product.categoryEn}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate max-w-[200px]">
              {language === "ar" ? product.title : product.titleEn}
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
                <Image
                  src={product.images[selectedImage]}
                  alt=""
                  fill
                  className="object-cover"
                />
                
                {/* Preview Button */}
                <button className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
                  </div>
                </button>
              </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
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
            </motion.div>
            
            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Title & Category */}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                  {language === "ar" ? product.category : product.categoryEn}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                  {language === "ar" ? product.title : product.titleEn}
                </h1>
                
                {/* Stats */}
                <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    {displayStats.rating} ({displayStats.reviews})
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {product.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {displayStats.sales.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {product.likes.toLocaleString()}
                  </span>
                  {product.is_mock && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500 text-white">
                      {language === "ar" ? "عرض توضيحي" : "Demo"}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Creator */}
              <Link href="/creator/ahmed" className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 mb-6 hover:bg-secondary transition-colors">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image src={product.creator.avatar} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {language === "ar" ? product.creator.name : product.creator.nameEn}
                    </span>
                    {product.creator.verified && (
                      <BadgeCheck className="w-5 h-5 text-primary fill-primary/20" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {product.creator.followers.toLocaleString()} {language === "ar" ? "متابع" : "followers"} · {product.creator.products} {language === "ar" ? "منتج" : "products"}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {language === "ar" ? "متابعة" : "Follow"}
                </Button>
              </Link>

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

              {/* License Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">{language === "ar" ? "اختر الرخصة" : "Select License"}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(product.license) as Array<keyof typeof product.license>).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedLicense(key)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-start",
                        selectedLicense === key
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="font-bold text-lg">${product.license[key].price}</div>
                      <div className="text-xs text-muted-foreground">
                        {language === "ar" ? product.license[key].ar : product.license[key].en}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price & Actions */}
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <div className="text-3xl font-bold">${product.license[selectedLicense].price}</div>
                  {product.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </div>
                  )}
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
                    <Button className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      <ShoppingCart className="w-4 h-4" />
                      {language === "ar" ? "أضف للسلة" : "Add to Cart"}
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
              <div className="p-4 rounded-xl bg-secondary/50 mb-6">
                <h3 className="font-semibold mb-3">{language === "ar" ? "المميزات" : "Features"}</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      {language === "ar" ? feature.ar : feature.en}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">{language === "ar" ? "الوصف" : "Description"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {language === "ar" ? product.description : product.descriptionEn}
                </p>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/marketplace?tag=${tag}`}
                    className="px-3 py-1 rounded-full text-xs bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-8">
              {language === "ar" ? "التقييمات والمراجعات" : "Ratings & Reviews"}
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-5xl font-bold mb-2">{product.rating}</div>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-5 h-5",
                        star <= Math.round(product.rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {product.reviewsCount} {language === "ar" ? "تقييم" : "reviews"}
                </div>
              </div>
              
              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="glass rounded-2xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                        <Image src={review.avatar} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold">
                              {language === "ar" ? review.user : review.userEn}
                            </span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn(
                                    "w-3 h-3",
                                    star <= review.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-muted-foreground"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {language === "ar" ? review.comment : review.commentEn}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  {language === "ar" ? "عرض جميع التقييمات" : "View All Reviews"}
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Related Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-8">
              {language === "ar" ? "منتجات مشابهة" : "Related Products"}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/product/${item.id}`}>
                  <div className="group glass rounded-2xl overflow-hidden card-hover">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">
                        {language === "ar" ? item.title : item.titleEn}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          {item.rating}
                        </span>
                        <span className="font-bold">${item.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
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
