"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Filter, Grid, List, SlidersHorizontal, Star, Download, Heart, ShoppingCart, Palette, Film, BookOpen, Code, GraduationCap, Camera, Heart as HeartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage, LanguageProvider } from "@/lib/language"
import { useCart } from "@/lib/cart"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

const sectionConfig: Record<string, { icon: any; gradient: string; color: string }> = {
  resha: { icon: Palette, gradient: "linear-gradient(135deg, #4c1d95, #7c3aed)", color: "#7c3aed" },
  atheer: { icon: Film, gradient: "linear-gradient(135deg, #1e3a8a, #2563eb)", color: "#2563eb" },
  erth: { icon: Camera, gradient: "linear-gradient(135deg, #064e3b, #059669)", color: "#059669" },
  holool: { icon: Code, gradient: "linear-gradient(135deg, #0f172a, #1e3a8a)", color: "#1e3a8a" },
  sanad: { icon: BookOpen, gradient: "linear-gradient(135deg, #0f172a, #1e3a8a)", color: "#1e3a8a" },
  sena3a: { icon: GraduationCap, gradient: "linear-gradient(135deg, #064e3b, #059669)", color: "#059669" },
  maydan: { icon: HeartIcon, gradient: "linear-gradient(135deg, #7c2d12, #ea580c)", color: "#ea580c" },
  mdad: { icon: BookOpen, gradient: "linear-gradient(135deg, #4c1d95, #7c3aed)", color: "#7c3aed" },
  mahara: { icon: GraduationCap, gradient: "linear-gradient(135deg, #064e3b, #059669)", color: "#059669" },
  aoun: { icon: HeartIcon, gradient: "linear-gradient(135deg, #7c2d12, #ea580c)", color: "#ea580c" },
  digital: { icon: Palette, gradient: "linear-gradient(135deg, #0f172a, #1e3a8a)", color: "#1e3a8a" },
  services: { icon: BookOpen, gradient: "linear-gradient(135deg, #064e3b, #059669)", color: "#059669" },
  knowledge: { icon: GraduationCap, gradient: "linear-gradient(135deg, #4c1d95, #7c3aed)", color: "#7c3aed" },
  community: { icon: HeartIcon, gradient: "linear-gradient(135deg, #7c2d12, #ea580c)", color: "#ea580c" },
}

const sectionNames: Record<string, { ar: string; en: string; descAr: string; descEn: string }> = {
  resha: { ar: "ريشة", en: "Resha", descAr: "موارد التصميم والإبداع البصري", descEn: "Design resources & visual creativity" },
  atheer: { ar: "الأثير", en: "Atheer", descAr: "إنتاج الفيديو والصوت الاحترافي", descEn: "Video & audio production" },
  erth: { ar: "إرث", en: "Erth", descAr: "التصوير والأصول الرقمية", descEn: "Photography & digital assets" },
  holool: { ar: "حلول", en: "Holool", descAr: "برمجة وتطوير تطبيقات وأنظمة", descEn: "Programming & development" },
  sanad: { ar: "سند", en: "Sanad", descAr: "خدمات دعم الأعمال والمشاريع", descEn: "Business support services" },
  sena3a: { ar: "صنعة", en: "Sena3a", descAr: "حرف وخدمات يدوية ومهنية", descEn: "Crafts & professional services" },
  maydan: { ar: "ميدان", en: "Maydan", descAr: "مشاريع تنافسية وعطاءات", descEn: "Competitive projects" },
  mdad: { ar: "مداد", en: "Mdad", descAr: "كتابة محتوى ونشر رقمي احترافي", descEn: "Content writing & publishing" },
  mahara: { ar: "مهارة", en: "Mahara", descAr: "دورات تدريبية واستشارات تطويرية", descEn: "Courses, training & consulting" },
  aoun: { ar: "عون", en: "Aoun", descAr: "تواصل وتعاون ودعم متبادل", descEn: "Community support" },
  digital: { ar: "الحلول الرقمية", en: "Digital Solutions", descAr: "الحلول الرقمية - تصميم، فيديو، تصوير، برمجة", descEn: "Digital Solutions - Design, Video, Photography, Programming" },
  services: { ar: "الخدمات والأعمال", en: "Services & Business", descAr: "الخدمات والأعمال - دعم الأعمال، حرف، مشاريع", descEn: "Services & Business - Business Support, Crafts, Projects" },
  knowledge: { ar: "المعرفة والتطوير", en: "Knowledge & Development", descAr: "المعرفة والتطوير - كتابة محتوى، دورات", descEn: "Knowledge & Development - Content Writing, Courses" },
  community: { ar: "المجتمع", en: "Community", descAr: "المجتمع - دعم المبدعين والمبادرات", descEn: "Community - Creator & Initiative Support" },
}

const mainCategoryGroups: Record<string, { name: string; nameEn: string; subsections: string[] }> = {
  "الحلول الرقمية": { name: "الحلول الرقمية", nameEn: "Digital Solutions", subsections: ["resha", "atheer", "erth", "holool"] },
  "الخدمات والأعمال": { name: "الخدمات والأعمال", nameEn: "Services & Business", subsections: ["sanad", "sena3a", "maydan"] },
  "المعرفة والتطوير": { name: "المعرفة والتطوير", nameEn: "Knowledge & Development", subsections: ["mdad", "mahara"] },
  "المجتمع": { name: "المجتمع", nameEn: "Community", subsections: ["aoun"] },
}

const subsectionToMainCategory: Record<string, string> = {
  resha: "الحلول الرقمية",
  atheer: "الحلول الرقمية",
  erth: "الحلول الرقمية",
  holool: "الحلول الرقمية",
  sanad: "الخدمات والأعمال",
  sena3a: "الخدمات والأعمال",
  maydan: "الخدمات والأعمال",
  mdad: "المعرفة والتطوير",
  mahara: "المعرفة والتطوير",
  aoun: "المجتمع",
  digital: "الحلول الرقمية",
  services: "الخدمات والأعمال",
  knowledge: "المعرفة والتطوير",
  community: "المجتمع",
}

function CategoryContent() {
  const params = useParams()
  const router = useRouter()
  const section = params.section as string
  const { language } = useLanguage()
  const { addToCart } = useCart()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [selectedSubsection, setSelectedSubsection] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  
  const config = sectionConfig[section] || sectionConfig.resha
  const names = sectionNames[section] || sectionNames.resha
  const Icon = config.icon
  
  const mainCategory = subsectionToMainCategory[section] || "الحلول الرقمية"
  const mainCategoryGroup = mainCategoryGroups[mainCategory]
  const subsections = mainCategoryGroup?.subsections || [section]

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("is_published", true)
          .eq("category", mainCategory)
          .order("created_at", { ascending: false })
        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [mainCategory])

  const filteredProducts = selectedSubsection === "all" 
    ? products 
    : products.filter(p => p.subcategory === selectedSubsection)
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Banner */}
        <div 
          className="w-full py-16 px-8 mb-8 text-white text-right"
          style={{ background: config.gradient }}
        >
          <div className="container mx-auto max-w-6xl flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">{language === "ar" ? names.ar : names.en}</h1>
              <p className="text-white/80 text-lg">{language === "ar" ? names.descAr : names.descEn}</p>
            </div>
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-8">
          {/* Subsection Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <Button
              variant={selectedSubsection === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSubsection("all")}
              className="rounded-full"
            >
              {language === "ar" ? "الكل" : "All"}
            </Button>
            {subsections.map((subsection) => (
              <Button
                key={subsection}
                variant={selectedSubsection === subsection ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubsection(subsection)}
                className="rounded-full"
              >
                {sectionNames[subsection]?.[language === "ar" ? "ar" : "en"] || subsection}
              </Button>
            ))}
          </motion.div>

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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>{language === "ar" ? "لا توجد منتجات حالياً" : "No products available"}</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link href={`/product/${product.id}`}>
                    <div 
                      className={`bg-card rounded-2xl border border-border overflow-hidden card-hover cursor-pointer ${viewMode === "list" ? "flex" : ""}`}
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
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
                          {product.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Badge variant="secondary">{product.subcategory}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-foreground">
                            {product.price_halalas ? `${(product.price_halalas / 100).toFixed(2)} ر.س` : "—"}
                          </span>
                          <Button size="sm" className="rounded-full gap-1" onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}>
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
          )}
          
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
