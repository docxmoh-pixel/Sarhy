"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Star, Users, Package, Verified, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage, LanguageProvider } from "@/lib/language"
import Link from "next/link"

const creators = [
  { id: 1, name: "أحمد الفهد", nameEn: "Ahmed Al-Fahd", username: "ahmed_design", avatar: null, verified: true, rating: 4.9, followers: 12500, products: 156, category: "resha", categoryEn: "Resha", sales: 8500, featured: true },
  { id: 2, name: "سارة العتيبي", nameEn: "Sara Al-Otaibi", username: "sara_creative", avatar: null, verified: true, rating: 4.8, followers: 9800, products: 89, category: "atheer", categoryEn: "Atheer", sales: 5200, featured: true },
  { id: 3, name: "محمد النجار", nameEn: "Mohammed Al-Najjar", username: "dev_mohammed", avatar: null, verified: true, rating: 4.9, followers: 15600, products: 234, category: "holool", categoryEn: "Holool", sales: 12300, featured: true },
  { id: 4, name: "نورة الحربي", nameEn: "Noura Al-Harbi", username: "noura_writes", avatar: null, verified: false, rating: 4.7, followers: 6400, products: 45, category: "midad", categoryEn: "Midad", sales: 2100, featured: false },
  { id: 5, name: "خالد السعيد", nameEn: "Khaled Al-Saeed", username: "khaled_edu", avatar: null, verified: true, rating: 4.8, followers: 11200, products: 67, category: "mahara", categoryEn: "Mahara", sales: 4800, featured: true },
  { id: 6, name: "ريم الشمري", nameEn: "Reem Al-Shammari", username: "reem_photo", avatar: null, verified: true, rating: 4.9, followers: 8900, products: 312, category: "erth", categoryEn: "Erth", sales: 7600, featured: false },
  { id: 7, name: "فهد القحطاني", nameEn: "Fahd Al-Qahtani", username: "fahd_motion", avatar: null, verified: false, rating: 4.6, followers: 5200, products: 78, category: "atheer", categoryEn: "Atheer", sales: 3400, featured: false },
  { id: 8, name: "هدى المطيري", nameEn: "Huda Al-Mutairi", username: "huda_design", avatar: null, verified: true, rating: 4.8, followers: 7800, products: 123, category: "resha", categoryEn: "Resha", sales: 5900, featured: true },
]

const categories = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "resha", ar: "ريشة", en: "Resha" },
  { key: "atheer", ar: "الأثير", en: "Atheer" },
  { key: "midad", ar: "مداد", en: "Midad" },
  { key: "holool", ar: "حلول", en: "Holool" },
  { key: "mahara", ar: "مهارة", en: "Mahara" },
  { key: "erth", ar: "إرث", en: "Erth" },
]

function CreatorsContent() {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredCreators = creators.filter(creator => {
    const matchesCategory = selectedCategory === "all" || creator.category === selectedCategory
    const matchesSearch = searchQuery === "" || 
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.username.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {language === "ar" ? "المبدعون" : "Creators"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "ar" 
                ? "اكتشف نخبة المبدعين في صرحي وتواصل معهم"
                : "Discover elite creators on Sarhy and connect with them"
              }
            </p>
          </motion.div>
          
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={language === "ar" ? "ابحث عن مبدع..." : "Search creators..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-10 h-11 rounded-xl"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.key}
                    variant={selectedCategory === cat.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.key)}
                    className="rounded-full"
                  >
                    {language === "ar" ? cat.ar : cat.en}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-card rounded-xl p-4 border border-border text-center">
              <div className="text-2xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground">{language === "ar" ? "مبدع نشط" : "Active Creators"}</div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border text-center">
              <div className="text-2xl font-bold text-foreground">2M+</div>
              <div className="text-sm text-muted-foreground">{language === "ar" ? "منتج رقمي" : "Digital Products"}</div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border text-center">
              <div className="text-2xl font-bold text-foreground">$10M+</div>
              <div className="text-sm text-muted-foreground">{language === "ar" ? "إجمالي المبيعات" : "Total Sales"}</div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border text-center">
              <div className="text-2xl font-bold text-foreground">150+</div>
              <div className="text-sm text-muted-foreground">{language === "ar" ? "دولة" : "Countries"}</div>
            </div>
          </motion.div>
          
          {/* Creators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link href={`/creator/${creator.username}`}>
                  <div className="bg-card rounded-2xl border border-border overflow-hidden card-hover">
                    {/* Cover */}
                    <div className="h-24 bg-gradient-to-br from-primary/20 to-accent/20 relative">
                      {creator.featured && (
                        <Badge className="absolute top-2 end-2 bg-primary/90">
                          {language === "ar" ? "مميز" : "Featured"}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Avatar */}
                    <div className="px-4 -mt-10 relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold border-4 border-card">
                        {(language === "ar" ? creator.name : creator.nameEn).charAt(0)}
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-4 pt-3">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {language === "ar" ? creator.name : creator.nameEn}
                        </h3>
                        {creator.verified && (
                          <Verified className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">@{creator.username}</p>
                      
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500" />
                          {creator.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {creator.followers.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {creator.products}
                        </span>
                      </div>
                      
                      <Badge variant="secondary" className="rounded-full">
                        {language === "ar" ? creator.category : creator.categoryEn}
                      </Badge>
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

export default function CreatorsPage() {
  return (
    <LanguageProvider>
      <CreatorsContent />
    </LanguageProvider>
  )
}
