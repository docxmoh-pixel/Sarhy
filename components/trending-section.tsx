"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Heart, Eye, Star } from "lucide-react"
import { useLanguage } from "@/lib/language"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

export function TrendingSection() {
  const { language, t } = useLanguage()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(6)

        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])
  
  return (
    <section className="py-24 lg:py-32 relative bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-balance text-[#122560]">
              {t("trending.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("trending.subtitle")}
            </p>
          </div>
          <Link href="/marketplace" className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            {t("common.viewall")}
          </Link>
        </motion.div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton Screens
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="relative aspect-[4/3] bg-muted/50 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-muted/50 rounded animate-pulse" />
                    <div className="h-4 bg-muted/50 rounded w-2/3 animate-pulse" />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="h-4 w-8 bg-muted/50 rounded animate-pulse" />
                        <div className="h-4 w-8 bg-muted/50 rounded animate-pulse" />
                      </div>
                      <div className="h-6 w-12 bg-muted/50 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : products.length === 0 ? (
            // Empty State
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass rounded-2xl overflow-hidden card-hover">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm text-center px-4">
                      {language === "ar" ? "قريباً.. أولى المنتجات الإبداعية" : "Coming soon... First creative products"}
                    </p>
                  </div>
                  <div className="p-5">
                    <div className="h-6 bg-muted/30 rounded mb-2" />
                    <div className="h-4 bg-muted/30 rounded w-2/3 mb-4" />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="h-4 w-8 bg-muted/30 rounded" />
                        <div className="h-4 w-8 bg-muted/30 rounded" />
                      </div>
                      <div className="h-6 w-12 bg-muted/30 rounded" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Dynamic Products
            products.map((product: any, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="group glass rounded-2xl overflow-hidden card-hover">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={language === "ar" ? product.name_ar : product.name_en}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">
                          {language === "ar" ? "لا توجد صورة" : "No image"}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Quick Actions */}
                    <div className="absolute top-4 end-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 start-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium glass">
                        {product.category || "منتج"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {language === "ar" ? product.name_ar : product.name_en}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {product.seller_id || "مبدع"}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" />
                          0
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          0
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                          0
                        </span>
                      </div>
                      
                      <div className="font-bold text-lg">
                        {product.price ? `${product.price} ر.س` : "0 ر.س"}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
