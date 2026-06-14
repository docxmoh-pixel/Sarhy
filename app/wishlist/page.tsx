"use client"

import { motion } from "framer-motion"
import { Heart, Trash2, ShoppingCart, Star, Download, FolderHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage, LanguageProvider } from "@/lib/language"
import Link from "next/link"

const wishlistItems = [
  { id: 1, title: { ar: "قالب موقع احترافي", en: "Professional Website Template" }, price: 49, rating: 4.9, downloads: 1250, creator: "Ahmed" },
  { id: 2, title: { ar: "حزمة أيقونات متميزة", en: "Premium Icon Pack" }, price: 29, rating: 4.8, downloads: 890, creator: "Sara" },
  { id: 3, title: { ar: "موسيقى خلفية سينمائية", en: "Cinematic Background Music" }, price: 19, rating: 4.7, downloads: 2100, creator: "Mohammed" },
  { id: 4, title: { ar: "قالب عرض تقديمي", en: "Presentation Template" }, price: 39, rating: 4.9, downloads: 650, creator: "Khaled" },
]

function WishlistContent() {
  const { language } = useLanguage()
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === "ar" ? "قائمة الرغبات" : "Wishlist"}
            </h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {language === "ar" ? "منتج محفوظ" : "saved items"}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-card rounded-2xl border border-border overflow-hidden card-hover group">
                  {/* Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 end-2 bg-white/80 hover:bg-white text-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="absolute bottom-2 start-2">
                      <Heart className="w-5 h-5 text-white fill-current" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2 hover:text-primary transition-colors">
                        {language === "ar" ? item.title.ar : item.title.en}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-3">
                      {language === "ar" ? "بواسطة" : "by"} {item.creator}
                    </p>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500" />
                        {item.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {item.downloads.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">${item.price}</span>
                      <Button size="sm" className="rounded-full gap-1">
                        <ShoppingCart className="w-4 h-4" />
                        {language === "ar" ? "أضف" : "Add"}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {wishlistItems.length === 0 && (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <FolderHeart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {language === "ar" ? "قائمة الرغبات فارغة" : "Wishlist is empty"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === "ar" ? "ابدأ بإضافة المنتجات التي تعجبك" : "Start adding products you like"}
              </p>
              <Link href="/marketplace">
                <Button className="rounded-full">
                  {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default function WishlistPage() {
  return (
    <LanguageProvider>
      <WishlistContent />
    </LanguageProvider>
  )
}
