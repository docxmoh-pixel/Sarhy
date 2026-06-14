'use client'

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Search as SearchIcon, Filter, Star, Download, Heart, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/lib/language"
import Link from "next/link"

type Product = {
  id: number
  title: { ar: string; en: string }
  price: number
  rating: number
  downloads: number
  category: string
}

const mockResults: Product[] = [
  { id: 1, title: { ar: "قالب موقع احترافي", en: "Professional Website Template" }, price: 49, rating: 4.9, downloads: 1250, category: "resha" },
  { id: 2, title: { ar: "حزمة أيقونات متميزة", en: "Premium Icon Pack" }, price: 29, rating: 4.8, downloads: 890, category: "resha" },
  { id: 3, title: { ar: "موسيقى خلفية سينمائية", en: "Cinematic Background Music" }, price: 19, rating: 4.7, downloads: 2100, category: "atheer" },
  { id: 4, title: { ar: "قالب عرض تقديمي", en: "Presentation Template" }, price: 39, rating: 4.9, downloads: 650, category: "resha" },
  { id: 5, title: { ar: "كتاب إلكتروني - التصميم", en: "E-book - Design Guide" }, price: 15, rating: 4.6, downloads: 450, category: "midad" },
  { id: 6, title: { ar: "إضافة ووردبريس", en: "WordPress Plugin" }, price: 59, rating: 4.8, downloads: 780, category: "holool" },
]

const categories = [
  { key: "resha", ar: "ريشة", en: "Resha" },
  { key: "atheer", ar: "الأثير", en: "Atheer" },
  { key: "midad", ar: "مداد", en: "Midad" },
  { key: "holool", ar: "حلول", en: "Holool" },
  { key: "mahara", ar: "مهارة", en: "Mahara" },
  { key: "erth", ar: "إرث", en: "Erth" },
]

function SearchContent({ initialQuery }: { initialQuery: string }) {
  const { language } = useLanguage()
  const [query, setQuery] = useState(initialQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const filteredResults = mockResults.filter(result => {
    const matchesQuery =
      !query ||
      (result.title.ar?.toLowerCase() || "").includes(query.toLowerCase()) ||
      (result.title.en?.toLowerCase() || "").includes(query.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(result.category)
    return matchesQuery && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1 w-full">
                <SearchIcon className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={language === "ar" ? "ابحث عن منتجات، قوالب، أدوات..." : "Search products, templates, tools..."}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-14 ps-12 pe-4 rounded-2xl text-lg"
                />
              </div>
              <Button
                variant="outline"
                className="h-14 px-6 rounded-2xl gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5" />
                {language === "ar" ? "الفلاتر" : "Filters"}
              </Button>
            </div>

            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCategories.map(cat => {
                  const category = categories.find(c => c.key === cat)
                  return (
                    <Badge key={cat} variant="secondary" className="gap-1 rounded-full">
                      {language === "ar" ? category?.ar : category?.en}
                      <button onClick={() => setSelectedCategories(prev => prev.filter(c => c !== cat))}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )
                })}
                <button className="text-sm text-primary hover:underline" onClick={() => setSelectedCategories([])}>
                  {language === "ar" ? "مسح الكل" : "Clear all"}
                </button>
              </div>
            )}
          </motion.div>

          <div className="flex gap-8">
            {showFilters && (
              <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-64 shrink-0 hidden lg:block">
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                  <h3 className="font-semibold text-foreground mb-4">{language === "ar" ? "الأقسام" : "Categories"}</h3>
                  <div className="space-y-3">
                    {categories.map(cat => (
                      <label key={cat.key} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={selectedCategories.includes(cat.key)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories(prev => [...prev, cat.key])
                            } else {
                              setSelectedCategories(prev => prev.filter(c => c !== cat.key))
                            }
                          }}
                        />
                        <span className="text-sm text-foreground">{language === "ar" ? cat.ar : cat.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.aside>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {filteredResults.length} {language === "ar" ? "نتيجة" : "results"}
                  {query && ` ${language === "ar" ? "لـ" : "for"} "${query}"`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((product, index) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <Link href={`/product/${product.id}`}>
                      <div className="bg-card rounded-2xl border border-border overflow-hidden card-hover">
                        <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 relative">
                          <Button variant="ghost" size="icon" className="absolute top-2 end-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full" onClick={(e) => e.preventDefault()}>
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{language === "ar" ? product.title.ar : product.title.en}</h3>
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
                            <Button size="sm" className="rounded-full gap-1" onClick={(e) => e.preventDefault()}>
                              <ShoppingCart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {filteredResults.length === 0 && (
                <div className="text-center py-16">
                  <SearchIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">{language === "ar" ? "لم يتم العثور على نتائج" : "No results found"}</h3>
                  <p className="text-muted-foreground">{language === "ar" ? "جرب كلمات بحث مختلفة" : "Try different search terms"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SearchClient({ initialQuery }: { initialQuery: string }) {
  return <SearchContent initialQuery={initialQuery} />
}