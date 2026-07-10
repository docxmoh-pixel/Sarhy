"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  Heart,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language"
import { AIAssistant } from "@/components/ai-assistant"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"

const categories = [
  { id: "all", ar: "الكل", en: "All" },
  { id: "الحلول الرقمية", ar: "الحلول الرقمية", en: "Digital Solutions" },
  { id: "الخدمات والأعمال", ar: "الخدمات والأعمال", en: "Services & Business" },
  { id: "المعرفة والتطوير", ar: "المعرفة والتطوير", en: "Knowledge & Development" },
  { id: "المجتمع", ar: "المجتمع", en: "Community" },
]

const sortOptions = [
  { id: "newest", ar: "الأحدث", en: "Newest" },
  { id: "popular", ar: "الأكثر شعبية", en: "Most Popular" },
  { id: "price-low", ar: "السعر: الأقل", en: "Price: Low to High" },
  { id: "price-high", ar: "السعر: الأعلى", en: "Price: High to Low" },
]

function MarketplaceContent() {
  const { language } = useLanguage()
  const isAr = language === "ar"
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid")
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const PAGE_SIZE = 12

  const fetchProducts = async (pageNum: number, search: string, append: boolean) => {
    if (pageNum === 0) setLoading(true); else setLoadingMore(true)
    const supabase = createClient()
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_published", true)

    if (selectedCategory !== "all") query = query.eq("category", selectedCategory)
    if (search) query = query.ilike("title", `%${search}%`)

    if (sortBy === "newest") query = query.order("created_at", { ascending: false })
    else if (sortBy === "popular") query = query.order("sale_count", { ascending: false })
    else if (sortBy === "price-low") query = query.order("price_halalas", { ascending: true })
    else if (sortBy === "price-high") query = query.order("price_halalas", { ascending: false })

    query = query.range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

    const { data } = await query
    const results = data || []
    setProducts((prev) => append ? [...prev, ...results] : results)
    setHasMore(results.length === PAGE_SIZE)
    if (pageNum === 0) setLoading(false); else setLoadingMore(false)
  }

  useEffect(() => {
    setPage(0)
    fetchProducts(0, searchQuery, false)
  }, [selectedCategory, sortBy])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(0)
      fetchProducts(0, searchQuery, false)
    }, 500)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchQuery])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProducts(nextPage, searchQuery, true)
  }

  const filteredProducts = products

  const formatSAR = (halalas: number) => (halalas / 100).toFixed(2)

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {isAr ? "استكشف السوق" : "Explore Marketplace"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {isAr
                ? "اكتشف منتجات وخدمات رقمية من مبدعين موثوقين"
                : "Discover digital products and services from trusted creators"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? "ابحث عن منتجات..." : "Search products..."}
                  className="w-full h-12 ps-12 pe-4 rounded-xl bg-secondary border-0 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-12 px-4 pe-10 rounded-xl bg-secondary border-0 outline-none appearance-none cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {isAr ? option.ar : option.en}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "large" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("large")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 overflow-x-auto pb-2"
          >
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {isAr ? category.ar : category.en}
                </button>
              ))}
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              {isAr ? "لا توجد منتجات حالياً" : "No products available yet"}
            </div>
          ) : (
            <>
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {filteredProducts.map((product, index) => {
                const images = product.images
                  ? typeof product.images === "string"
                    ? JSON.parse(product.images)
                    : product.images
                  : []

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="group glass rounded-2xl overflow-hidden card-hover">
                        <div
                          className={cn(
                            "relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center",
                            viewMode === "large" ? "aspect-[16/10]" : "aspect-[4/3]"
                          )}
                        >
                          {images.length > 0 && images[0] ? (
                            <Image
                              src={images[0]}
                              alt=""
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <span className="text-5xl">📦</span>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                              <Heart className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div className="p-4">
                          {product.subcategory && (
                            <span className="inline-block mb-2 px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
                              {product.subcategory}
                            </span>
                          )}

                          <h3 className="font-semibold mb-2 line-clamp-1">
                            {product.title}
                          </h3>

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">
                              {formatSAR(product.price_halalas || 0)} {isAr ? "ر.س" : "SAR"}
                            </span>
                            {product.sale_count > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {product.sale_count} {isAr ? "مبيعة" : "sold"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-xl px-8"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      {isAr ? "جاري التحميل..." : "Loading..."}
                    </span>
                  ) : (
                    isAr ? "تحميل المزيد" : "Load More"
                  )}
                </Button>
              </div>
            )}
            </>
          )}
        </div>
      </main>

      <AIAssistant />
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <Suspense>
      <MarketplaceContent />
    </Suspense>
  )
}
