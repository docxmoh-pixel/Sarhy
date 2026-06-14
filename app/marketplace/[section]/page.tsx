"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Filter, Grid, List, SlidersHorizontal, Star, Download, Heart, ShoppingCart, Palette, Film, BookOpen, Code, GraduationCap, Camera, Heart as HeartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage, LanguageProvider } from "@/lib/language"
import Link from "next/link"

const sectionConfig: Record<string, { icon: any; gradient: string; color: string }> = {
  resha: { icon: Palette, gradient: "from-[oklch(0.55_0.22_300)] to-[oklch(0.65_0.18_320)]", color: "oklch(0.55 0.22 300)" },
  atheer: { icon: Film, gradient: "from-[oklch(0.55_0.18_230)] to-[oklch(0.65_0.16_250)]", color: "oklch(0.55 0.18 230)" },
  midad: { icon: BookOpen, gradient: "from-[oklch(0.55_0.18_55)] to-[oklch(0.65_0.16_75)]", color: "oklch(0.55 0.18 55)" },
  holool: { icon: Code, gradient: "from-[oklch(0.55_0.20_165)] to-[oklch(0.65_0.18_185)]", color: "oklch(0.55 0.20 165)" },
  mahara: { icon: GraduationCap, gradient: "from-[oklch(0.60_0.20_85)] to-[oklch(0.70_0.18_105)]", color: "oklch(0.60 0.20 85)" },
  erth: { icon: Camera, gradient: "from-[oklch(0.50_0.08_260)] to-[oklch(0.60_0.06_280)]", color: "oklch(0.50 0.08 260)" },
  aoun: { icon: HeartIcon, gradient: "from-[oklch(0.55_0.18_25)] to-[oklch(0.65_0.16_45)]", color: "oklch(0.55 0.18 25)" },
}

const sectionNames: Record<string, { ar: string; en: string; descAr: string; descEn: string }> = {
  resha: { ar: "ريشة", en: "Resha", descAr: "موارد التصميم والإبداع البصري", descEn: "Design resources & visual creativity" },
  atheer: { ar: "الأثير", en: "Atheer", descAr: "إنتاج الفيديو والصوت", descEn: "Video & audio production" },
  midad: { ar: "مداد", en: "Midad", descAr: "منظومة الكتابة والنشر", descEn: "Writing & publishing ecosystem" },
  holool: { ar: "حلول", en: "Holool", descAr: "سوق البرمجيات والأتمتة", descEn: "Software & automation marketplace" },
  mahara: { ar: "مهارة", en: "Mahara", descAr: "دورات وتدريب واستشارات", descEn: "Courses, training & consulting" },
  erth: { ar: "إرث", en: "Erth", descAr: "التصوير والأصول الرقمية", descEn: "Photography & digital assets" },
  aoun: { ar: "عون", en: "Aoun", descAr: "دعم المبدعين والمبادرات", descEn: "Creator & initiative support" },
}

const mockProducts = [
  { id: 1, title: { ar: "قالب موقع احترافي", en: "Professional Website Template" }, price: 49, rating: 4.9, downloads: 1250, creator: "Ahmed", image: null },
  { id: 2, title: { ar: "حزمة أيقونات متميزة", en: "Premium Icon Pack" }, price: 29, rating: 4.8, downloads: 890, creator: "Sara", image: null },
  { id: 3, title: { ar: "قالب عرض تقديمي", en: "Presentation Template" }, price: 39, rating: 4.7, downloads: 650, creator: "Mohammed", image: null },
  { id: 4, title: { ar: "مجموعة خطوط عربية", en: "Arabic Font Collection" }, price: 59, rating: 4.9, downloads: 2100, creator: "Noura", image: null },
  { id: 5, title: { ar: "قالب متجر إلكتروني", en: "E-commerce Template" }, price: 79, rating: 4.8, downloads: 780, creator: "Khaled", image: null },
  { id: 6, title: { ar: "حزمة موشن جرافيك", en: "Motion Graphics Pack" }, price: 89, rating: 4.9, downloads: 450, creator: "Reem", image: null },
  { id: 7, title: { ar: "قالب سيرة ذاتية", en: "Resume Template" }, price: 19, rating: 4.6, downloads: 3200, creator: "Fahd", image: null },
  { id: 8, title: { ar: "مجموعة صور احترافية", en: "Professional Photo Pack" }, price: 35, rating: 4.7, downloads: 1560, creator: "Huda", image: null },
]

function CategoryContent() {
  const params = useParams()
  const section = params.section as string
  const { language } = useLanguage()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  
  const config = sectionConfig[section] || sectionConfig.resha
  const names = sectionNames[section] || sectionNames.resha
  const Icon = config.icon
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Banner */}
        <section className={`bg-gradient-to-br ${config.gradient} py-16 mb-8`}>
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {language === "ar" ? names.ar : names.en}
                </h1>
                <p className="text-white/80">
                  {language === "ar" ? names.descAr : names.descEn}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        
        <div className="container mx-auto px-4 lg:px-8">
          {/* Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8"
          >
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={language === "ar" ? "ابحث في المنتجات..." : "Search products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10 h-11 rounded-xl"
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-3">
              <Select defaultValue="popular">
                <SelectTrigger className="w-[160px] h-11 rounded-xl">
                  <SelectValue placeholder={language === "ar" ? "ترتيب" : "Sort by"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">{language === "ar" ? "الأكثر شعبية" : "Most Popular"}</SelectItem>
                  <SelectItem value="newest">{language === "ar" ? "الأحدث" : "Newest"}</SelectItem>
                  <SelectItem value="price-low">{language === "ar" ? "السعر: منخفض" : "Price: Low"}</SelectItem>
                  <SelectItem value="price-high">{language === "ar" ? "السعر: مرتفع" : "Price: High"}</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl">
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
              
              <div className="flex border border-border rounded-xl overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none h-11 w-11"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none h-11 w-11"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Products Grid */}
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {mockProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link href={`/product/${product.id}`}>
                  <div className={`bg-card rounded-2xl border border-border overflow-hidden card-hover ${viewMode === "list" ? "flex" : ""}`}>
                    {/* Image */}
                    <div className={`bg-gradient-to-br ${config.gradient} relative ${viewMode === "list" ? "w-48 shrink-0" : "aspect-[4/3]"}`}>
                      <div className="absolute inset-0 bg-black/5" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 end-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
                        onClick={(e) => { e.preventDefault(); }}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Content */}
                    <div className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : ""}`}>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {language === "ar" ? product.title.ar : product.title.en}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500" />
                          {product.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {product.downloads.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">${product.price}</span>
                        <Button size="sm" className="rounded-full gap-1" onClick={(e) => { e.preventDefault(); }}>
                          <ShoppingCart className="w-4 h-4" />
                          {language === "ar" ? "أضف" : "Add"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-full">
              {language === "ar" ? "عرض المزيد" : "Load More"}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default function CategoryPage() {
  return (
    <LanguageProvider>
      <CategoryContent />
    </LanguageProvider>
  )
}
