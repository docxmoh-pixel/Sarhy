"use client"

console.log('Marketplace page loaded')

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  Heart,
  Eye,
  Star,
  ChevronDown,
  X,
  ShoppingCart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language"
import { AIAssistant } from "@/components/ai-assistant"
import { cn } from "@/lib/utils"
import { getDisplayStats, getPurchaseStatus, getMockStatusLabel } from "@/lib/mock-guard"

const categories = [
  { id: "all", ar: "الكل", en: "All" },
  { id: "templates", ar: "قوالب", en: "Templates" },
  { id: "icons", ar: "أيقونات", en: "Icons" },
  { id: "fonts", ar: "خطوط", en: "Fonts" },
  { id: "photos", ar: "صور", en: "Photos" },
  { id: "videos", ar: "فيديو", en: "Videos" },
  { id: "audio", ar: "صوتيات", en: "Audio" },
  { id: "3d", ar: "ثلاثي الأبعاد", en: "3D" },
]

const sortOptions = [
  { id: "trending", ar: "الأكثر رواجاً", en: "Trending" },
  { id: "newest", ar: "الأحدث", en: "Newest" },
  { id: "popular", ar: "الأكثر شعبية", en: "Most Popular" },
  { id: "price-low", ar: "السعر: الأقل", en: "Price: Low to High" },
  { id: "price-high", ar: "السعر: الأعلى", en: "Price: High to Low" },
]

const products = [
  {
    id: 1,
    title: "مجموعة أيقونات احترافية",
    titleEn: "Professional Icon Pack",
    category: "icons",
    price: 49,
    originalPrice: 79,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
    likes: 1234,
    views: 5678,
    rating: 4.9,
    creator: "أحمد العلي",
    creatorEn: "Ahmed Ali",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    featured: true,
    is_mock: false,
    is_published: true,
    status: "active",
  },
  {
    id: 2,
    title: "قوالب موشن جرافيك",
    titleEn: "Motion Graphics Templates",
    category: "videos",
    price: 79,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    likes: 987,
    views: 4321,
    rating: 4.8,
    creator: "سارة محمد",
    creatorEn: "Sara Mohammed",
    creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    featured: false,
    is_mock: true,
    mock_sale_count: 500,
    mock_rating: 4.8,
    mock_reviews: 120,
    is_published: true,
    status: "active",
  },
  {
    id: 3,
    title: "حزمة الخطوط العربية",
    titleEn: "Arabic Fonts Bundle",
    category: "fonts",
    price: 35,
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=300&fit=crop",
    likes: 2156,
    views: 8765,
    rating: 5.0,
    creator: "خالد العمري",
    creatorEn: "Khalid Omari",
    creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    featured: true,
    is_mock: false,
    is_published: true,
    status: "active",
  },
  {
    id: 4,
    title: "نظام تصميم متكامل",
    titleEn: "Complete Design System",
    category: "templates",
    price: 149,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=300&fit=crop",
    likes: 567,
    views: 2345,
    rating: 4.7,
    creator: "نورة السعيد",
    creatorEn: "Noura Alsaid",
    creatorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    featured: false,
    is_mock: false,
    is_published: true,
    status: "active",
  },
  {
    id: 5,
    title: "مجموعة صور طبيعة",
    titleEn: "Nature Photo Collection",
    category: "photos",
    price: 29,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    likes: 4567,
    views: 15678,
    rating: 4.8,
    creator: "فاطمة الزهراء",
    creatorEn: "Fatima Alzahra",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    featured: true,
    is_mock: false,
    is_published: true,
    status: "active",
  },
  {
    id: 6,
    title: "مؤثرات صوتية سينمائية",
    titleEn: "Cinematic Sound Effects",
    category: "audio",
    price: 59,
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop",
    likes: 890,
    views: 3456,
    rating: 4.6,
    creator: "محمد الفهد",
    creatorEn: "Mohammed Alfahd",
    creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    featured: false,
    is_mock: true,
    mock_sale_count: 300,
    mock_rating: 4.6,
    mock_reviews: 80,
    is_published: true,
    status: "active",
  },
  {
    id: 7,
    title: "نماذج ثلاثية الأبعاد",
    titleEn: "3D Models Collection",
    category: "3d",
    price: 99,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    likes: 1567,
    views: 6789,
    rating: 4.9,
    creator: "علي الحربي",
    creatorEn: "Ali Alharbi",
    creatorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    featured: true,
    is_mock: false,
    is_published: true,
    status: "active",
  },
  {
    id: 8,
    title: "قوالب عروض تقديمية",
    titleEn: "Presentation Templates",
    category: "templates",
    price: 45,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    likes: 2345,
    views: 9876,
    rating: 4.7,
    creator: "ريم العتيبي",
    creatorEn: "Reem Alotaibi",
    creatorAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face",
    featured: false,
    is_mock: false,
    is_published: true,
    status: "active",
  },
]

function MarketplaceContent() {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("trending")
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid")
  const [showFilters, setShowFilters] = useState(false)
  
  const filteredProducts = selectedCategory === "all" 
    ? products.filter(p => p.is_published === true && p.status === "active")
    : products.filter(p => p.category === selectedCategory && p.is_published === true && p.status === "active")
  
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {language === "ar" ? "استكشف السوق" : "Explore Marketplace"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {language === "ar" 
                ? "اكتشف ملايين المنتجات الرقمية من مبدعين حول العالم"
                : "Discover millions of digital products from creators around the world"
              }
            </p>
          </motion.div>
          
          {/* Search & Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={language === "ar" ? "ابحث عن منتجات..." : "Search products..."}
                  className="w-full h-12 ps-12 pe-4 rounded-xl bg-secondary border-0 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {language === "ar" ? "فلترة" : "Filters"}
              </Button>
              
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-12 px-4 pe-10 rounded-xl bg-secondary border-0 outline-none appearance-none cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {language === "ar" ? option.ar : option.en}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
              
              {/* View Mode */}
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
          
          {/* Categories */}
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
                  {language === "ar" ? category.ar : category.en}
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Products Grid */}
          <div className={cn(
            "grid gap-6",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {filteredProducts.map((product, index) => {
              const displayStats = getDisplayStats(product)
              const purchaseStatus = getPurchaseStatus(product)
              const canPurchase = purchaseStatus.canPurchase

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="group glass rounded-2xl overflow-hidden card-hover">
                      {/* Image */}
                      <div className={cn(
                        "relative overflow-hidden",
                        viewMode === "large" ? "aspect-[16/10]" : "aspect-[4/3]"
                      )}>
                        <Image
                          src={product.image}
                          alt={language === "ar" ? product.title : product.titleEn}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Badges */}
                        <div className="absolute top-4 start-4 flex flex-col gap-2">
                          {product.featured && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                              {language === "ar" ? "مميز" : "Featured"}
                            </span>
                          )}
                          {product.is_mock && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500 text-white">
                              {language === "ar" ? "عرض توضيحي" : "Demo"}
                            </span>
                          )}
                          {product.originalPrice && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% {language === "ar" ? "خصم" : "OFF"}
                            </span>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Creator */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src={product.creatorAvatar}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {language === "ar" ? product.creator : product.creatorEn}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold mb-2 line-clamp-1">
                          {language === "ar" ? product.title : product.titleEn}
                        </h3>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            {product.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {product.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                            {displayStats.rating}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          {!canPurchase && (
                            <span className="text-xs text-amber-600 dark:text-amber-400">
                              {getMockStatusLabel(purchaseStatus.reason, language)}
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
          
          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              {language === "ar" ? "تحميل المزيد" : "Load More"}
            </Button>
          </div>
        </div>
      </main>

      <AIAssistant />
    </div>
  )
}

export default function MarketplacePage() {
  return <MarketplaceContent />
}
