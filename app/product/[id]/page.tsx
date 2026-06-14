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
    <div className="min-h-screen bg-background" dir="rtl">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !product ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">المنتج غير موجود</p>
        </div>
      ) : (
        <div className="container mx-auto max-w-6xl px-6 pt-24 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* LEFT - Product Info */}
            <div>
              <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground mb-4">
                {product.subcategory || product.category}
              </span>

              <h1 className="text-3xl font-black text-foreground mb-3 leading-tight text-right">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5 justify-end">
                <span>⭐ 0.0 (0)</span>
                <span>⬇ 0</span>
                <span>👁 0</span>
              </div>

              {/* Seller card */}
              <div className="flex items-center justify-between p-4 border border-border rounded-2xl mb-6">
                <button className="text-sm px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors font-medium">
                  {language === "ar" ? "متابعة" : "Follow"}
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{product.seller_name || "مبدع صرحي"}</p>
                    <p className="text-xs text-muted-foreground">1 {language === "ar" ? "منتج" : "product"}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                    م
                  </div>
                </div>
              </div>

              {/* Price section */}
              <div className="mb-4 text-right">
                <p className="text-sm text-muted-foreground mb-2">{language === "ar" ? "السعر" : "Price"}</p>
                <div className="flex items-baseline gap-2 justify-end">
                  <span className="text-3xl font-black text-foreground">
                    {product.price_halalas ? (product.price_halalas / 100).toFixed(2) : "0.00"}
                  </span>
                  <span className="text-muted-foreground text-lg">{language === "ar" ? "ر.س" : "SAR"}</span>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-2 mb-6">
                <button className="w-10 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
                  🚩
                </button>
                <button className="w-10 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
                  🔗
                </button>
                <button className="w-10 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
                  ❤️
                </button>
                <button
                  onClick={() => alert(language === "ar" ? "تمت الإضافة للسلة" : "Added to cart")}
                  className="flex-1 h-11 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  🛒 {language === "ar" ? "أضف للسلة" : "Add to cart"}
                </button>
              </div>

              {/* Features */}
              {product.features && (
                <div className="border border-border rounded-2xl p-5 mb-5">
                  <h3 className="font-bold text-foreground mb-4 text-right">
                    {language === "ar" ? "المميزات" : "Features"}
                  </h3>
                  <ul className="space-y-2.5">
                    {product.features.split('|').filter(Boolean).map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground justify-end">
                        <span>{f.trim()}</span>
                        <span className="text-green-500 flex-shrink-0">✓</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div className="text-right">
                <h3 className="font-bold text-foreground mb-3">
                  {language === "ar" ? "الوصف" : "Description"}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>
              </div>

              {/* Tags */}
              {product.subcategory && (
                <div className="flex flex-wrap gap-2 mt-6 justify-end">
                  <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">#{product.subcategory}</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">#{product.category}</span>
                </div>
              )}
            </div>

            {/* RIGHT - Images */}
            <div>
              {/* Main image */}
              <div className="aspect-[4/3] bg-muted rounded-2xl overflow-hidden mb-3 flex items-center justify-center">
                {product.images && product.images[0] ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 via-blue-400 to-orange-300 flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((img: string, i: number) => (
                    <div key={i} className="aspect-square bg-muted rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductPage() {
  return <ProductContent />
}
