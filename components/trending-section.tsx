"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart, Eye, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/lib/language"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useCart } from "@/lib/cart"

export function TrendingSection() {
  const { language, t } = useLanguage()
  const { addToCart, isInCart } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("products")
      .select("id, title, description, price_halalas, images, category, subcategory, seller_id")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setProducts(data || [])
        setLoading(false)
      })
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section className="py-24 lg:py-32 relative bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
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
            <p className="text-lg text-muted-foreground">{t("trending.subtitle")}</p>
          </div>
          <Link href="/marketplace" className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            {t("common.viewall")}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <div className="relative aspect-[4/3] bg-muted/50 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-muted/50 rounded animate-pulse" />
                    <div className="h-4 bg-muted/50 rounded w-2/3 animate-pulse" />
                    <div className="h-8 bg-muted/50 rounded animate-pulse" />
                  </div>
                </div>
              ))
            : products.map((product, index) => {
                const images = product.images
                  ? typeof product.images === "string" ? JSON.parse(product.images) : product.images
                  : []
                const price = product.price_halalas ? (product.price_halalas / 100).toFixed(2) : "0.00"
                const inCart = isInCart(product.id)

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                  >
                    <div className="group glass rounded-2xl overflow-hidden card-hover">
                      <Link href={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
                        {images[0] ? (
                          <Image src={images[0]} alt={product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <span className="text-4xl">📦</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {product.category && (
                          <div className="absolute top-4 start-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium glass">{product.category}</span>
                          </div>
                        )}
                      </Link>

                      <div className="p-5">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-primary transition-colors">
                            {product.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                          {product.subcategory || product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg text-primary">
                            {price} {language === "ar" ? "ر.س" : "SAR"}
                          </span>
                          <button
                            onClick={() => addToCart(product.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                              inCart
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            {inCart
                              ? (language === "ar" ? "في السلة" : "In Cart")
                              : (language === "ar" ? "أضف" : "Add")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
        </div>
      </div>
    </section>
  )
}
